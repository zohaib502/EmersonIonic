import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ValueProvider } from '../../value/value';
import moment from 'moment-timezone';
import { Storage } from '@ionic/storage';
import { SyncProvider } from '../sync';
import { UtilityProvider } from '../../utility/utility';
import { LoggerProvider } from '../../logger/logger';
import { CloudService } from '../../cloud-service/cloud-service';
import * as Enums from '../../../enums/enums';
import { LocalServiceProvider } from '../../local-service/local-service';
import { Events } from 'ionic-angular';
import { LocalServiceSdrProvider } from '../../local-service-sdr/local-service-sdr';
import { AttachmentProvider } from '../../attachment/attachment';
import { TransformProvider } from '../../transform/transform';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { SubmitProvider } from '../submit/submit';

declare let cordova;
declare function escape(s: string): string;
/*
  Generated class for the FetchProvider provider.
*/
@Injectable()
export class FetchProvider {

  fileName: any = "FetchProvider";
  isFetchRunning: boolean = false;
  permissions: any;
  syncProvider: SyncProvider;
  attachmentService: AttachmentProvider;
  submitProvider: SubmitProvider;

  constructor(public valueProvider: ValueProvider, public injector: Injector,
    public localServiceSDR: LocalServiceSdrProvider, public utilityProvider: UtilityProvider, public events: Events,
    public logger: LoggerProvider, public cloudService: CloudService, public localService: LocalServiceProvider,
    public transformProvider: TransformProvider, public storage: Storage, public translate: TranslateService) {

    setTimeout(() => this.submitProvider = injector.get(SubmitProvider));
    setTimeout(() => this.syncProvider = injector.get(SyncProvider));
    setTimeout(() => this.attachmentService = injector.get(AttachmentProvider), 500);
  }

  /**
   * Fetch All the data from server side (OSC, DBCS)
   *
   * @returns {Promise<boolean>}
   * @memberof FetchProvider
   */
  public async fetchData(): Promise<boolean> {
    let result: boolean = false;
    try {
      this.isFetchRunning = true;
      this.permissions = this.valueProvider.getPermissions();
      let promiseArr = [];

      if (this.shouldFetchTasks()) promiseArr.push(this.fetchTasks());
      if (this.valueProvider.isOSCUser()) promiseArr.push(this.fetchDeletedRecords());
      if (this.shouldFetchCustomers()) promiseArr.push(this.fetchCustomers());
      promiseArr.push(this.fetchTimezones());
      promiseArr.push(this.fetchDBLookupsLOVs());
      if (this.valueProvider.isOSCUser())
        promiseArr.push(this.fetchInternalActivities());

      if (this.valueProvider.isOSCUser()) promiseArr.push(this.fetchOnCallShift());
      if (this.shouldFetchLOVs()) promiseArr.push(this.fetchLOVs());
      promiseArr.push(this.fetchLanguageDetails());
      promiseArr.push(this.fetchAddresses());
      if (this.valueProvider.getUser().ClarityID) {
        let updatedDate = this.valueProvider.getUser().Last_Updated_ClarityLOV ? new Date(this.valueProvider.getUser().Last_Updated_ClarityLOV).toISOString() : "";
        promiseArr.push(this.fetchTimesheetLOVs(this.valueProvider.getUser().ClarityID, updatedDate));
      }

      if (this.valueProvider.getPermissions().EnterAllowances) promiseArr.push(this.fetchSiteAllowance());

      await Promise.all(promiseArr);
      let users = await this.localService.getActiveUser();
      if (users.length > 0) this.valueProvider.setUser(users[0]);

      result = true;
    } catch (error) {
      this.isFetchRunning = false;
      this.syncProvider.handleError(FetchProvider.name, "fetchData", error);
    } finally {
      this.isFetchRunning = false;
      if (!this.submitProvider.isSubmitting) {
        this.syncProvider.completeSync();
      }
    }
    return result;
  }

  fetchAddressDetails() {
    let allAddressList: any = [];
    return new Promise((resolve, reject) => {
      this.cloudService.getAddresses().then(res => {
        allAddressList = res;
        resolve(allAddressList);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  /**
   * Checks if it is the first sync of the day
   *
   * @private
   * @returns {boolean}
   * @memberof FetchProvider
   */
  private isDailySync(): boolean {
    let date = moment().format('MM-DD-YYYY');
    let lastSync = moment(this.syncProvider.getLastSyncTime()).format('MM-DD-YYYY');
    return !moment(date).isSame(lastSync);
  }

  /**
   * Checks if it is the first sync in the app
   *
   * @private
   * @returns {boolean}
   * @memberof FetchProvider
   */
  private isFirstSync(): boolean {
    return this.valueProvider.getIsLogin();
  }

  /**
   * Checks if the user has permission to create standalone or do debrief for osc job
   *
   * @private
   * @returns {boolean}
   * @memberof FetchProvider
   */
  private shouldFetchTasks(): boolean {
    return this.permissions.CreateStandaloneJob || this.permissions.DebriefOSCJob;
  }

  /**
   * Checks if LOVs should be fetched
   *
   * @private
   * @returns {boolean}
   * @memberof FetchProvider
   */
  private shouldFetchLOVs(): boolean {
    return this.isFirstSync() || this.isDailySync();
  }

  /**
   * Checks if customers should be fetched or not
   *
   * @private
   * @returns {boolean}
   * @memberof FetchProvider
   */
  private shouldFetchCustomers(): boolean {
    return this.permissions.CreateStandaloneJob;
  }

  private async fetchDeletedRecords() {
    let result = false;
    try {
      let userObject = {
        'ID': this.valueProvider.getUser().ID,
        'Last_Updated_Delete': new Date()
      };
      let deletedRecords = await this.cloudService.getDeletedRecords();
      await this.localService.deleteRecordBatch(this.getBatchDeletionData(deletedRecords));
      await this.localService.updateLastDelete(userObject);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "fetchDeletedRecords", error);
    }
    return result;
  }

  getBatchDeletionData(data) {
    let DeletedRecords = { Task: [], InstallBase: [], Note: [], Contact: [], Attachment: [] };
    if (data.Record_Deletion) {
      DeletedRecords.Task = DeletedRecords.Task.concat(data.Record_Deletion.filter((val) => { return val.Record_Type == "EngineerDisassociation" }));
      DeletedRecords.InstallBase = DeletedRecords.InstallBase.concat(data.Record_Deletion.filter((val) => { return val.Record_Type == "Installed Base" }));
      DeletedRecords.Note = DeletedRecords.Note.concat(data.Record_Deletion.filter((val) => { return val.Record_Type == "Notes" }));
      DeletedRecords.Contact = DeletedRecords.Contact.concat(data.Record_Deletion.filter((val) => { return val.Record_Type == "ContactDisassociation" }));
      DeletedRecords.Attachment = DeletedRecords.Attachment.concat(data.Record_Deletion.filter((val) => { return val.Record_Type == "JobAttachment" || val.Record_Type == "SRAttachment" }));
    }

    if (data.Standard_Record_Deletion) {
      DeletedRecords.Task = DeletedRecords.Task.concat(data.Standard_Record_Deletion.filter((val) => { return val.Record_Type == "Field Jobs" }));
      DeletedRecords.Contact = DeletedRecords.Contact.concat(data.Standard_Record_Deletion.filter((val) => { return val.Record_Type == "Contacts" }));
    }
    return DeletedRecords;
  }

  /**
   * Gets Jobs for user from multiple sources i.e. OSC, DBCS and 
   * adds them into the local database and refreshes the UI for
   * User.
   *
   * @private
   * @returns {Promise<boolean>}
   * @memberof FetchProvider
   */
  private async fetchTasks(): Promise<boolean> {
    let result: boolean = false;
    try {
      let oscTasks = [];
      if (this.valueProvider.isOSCUser()) oscTasks = await this.fetchOSCTasks();
      let promiseArr = [];
      if (this.valueProvider.isOSCUser()) {
        promiseArr.push(this.fetchOSCTaskDetails(oscTasks));
      }
      promiseArr.push(this.fetchPWSTaskData());
      promiseArr.push(this.fetchDBCSReportsAndTasks());

      await Promise.all(promiseArr);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchTasks", error);
    } finally {
      return result;
    }
  }

  /**
   * Gets Jobs and signatures from OSC through API's and updates them 
   * in local database. Also if a task is Closed or Cancelled, it is 
   * deleted from Database.
   *
   * @private
   * @returns {Promise<boolean>}
   * @memberof FetchProvider
   */
  private async fetchOSCTasks(): Promise<JSON[]> {
    let result: JSON[] = [];
    try {
      let currentFetchTime = this.utilityProvider.getCurrentTime();
      let oscTasks: JSON[] = await this.cloudService.getTaskInternalList();

      let openOSCTasks = oscTasks.filter(item => this.isTaskOpen(item));
      result = openOSCTasks;
      if (openOSCTasks) await this.localService.insertTaskAndSignaturesBatch(openOSCTasks);

      this.localService.updateLastTask({ ID: this.valueProvider.getUser().ID, Last_Updated_Task: currentFetchTime });

      let tasksToBeDeleted = oscTasks.filter((item) => !this.isTaskOpen(item)).map((item: any) => { return { Record_ID: item.Task_Number } });
      if (tasksToBeDeleted.length > 0) {
        let deletedRecords = { Task: tasksToBeDeleted };
        await this.localService.deleteRecordBatch(deletedRecords);
      }
      // 26/08/2019 GS: TODO: Remove Child Table Data for Tasks

      await this.localService.refreshTaskList();
      this.events.publish('refreshPageData', null);

    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchOSCTasks", error);
    } finally {
      return result;
    }
  }

  /**
   * Checks if a task is Open i.e. Not Closed and Not Cancelled.
   *
   * @private
   * @param {*} task
   * @returns
   * @memberof FetchProvider
   */
  private isTaskOpen(task) {
    return task.Task_Status_ID != Enums.Jobstatus.Closed && task.Task_Status_ID != Enums.Jobstatus.Cancelled;
  }

  private async fetchOSCTaskDetails(oscTasks) {
    let result: boolean = false;
    try {
      let promiseArr = [];
      promiseArr.push(this.fetchTaskDetails());
      promiseArr.push(this.fetchDebriefDetails(oscTasks));
      promiseArr.push(this.fetchSRDetails());
      promiseArr.push(this.fetchProjectDetails()); // Comment because new Project Fetch implemented.
      await Promise.all(promiseArr);

      await this.fetchDebriefAttachments();

    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchOSCTaskDetails", error);
    } finally {
      return result;
    }
  }

  /**
   * Gets the Task Details from MCS and Saves them locally.
   * It includes Install base, Contacts, Service Request, Projects, SR Notes and Attachments
   *
   * @private
   * @memberof FetchProvider
   */
  private async fetchTaskDetails() {
    let result: boolean = false;
    try {
      let currentFetchTime = this.utilityProvider.getCurrentTime();
      let taskDetails = await this.cloudService.getTaskDetails();
      await this.localService.saveTaskDetails(taskDetails);
      await this.localService.updateLastTaskDetail({ ID: this.valueProvider.getUser().ID, Last_Updated_Task_Detail: currentFetchTime });
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchTaskDetails", error);
    } finally {
      return result;
    }
  }

  /**
   * Gets Debrief Entries from OSC i.e. Time, Expense, Notes, Material, Signature
   * and save them to local database
   *
   * @private
   * @memberof FetchProvider
   */
  private async fetchDebriefDetails(oscTasks) {
    let result: boolean = false;
    try {
      oscTasks = oscTasks.map(item => item.Task_Number);
      if (oscTasks.length > 0) {
        let debriefDetails = await this.cloudService.getDebriefDetails(oscTasks);
        debriefDetails.Material = this.utilityProvider.combineMaterialArray(debriefDetails.Material);
        await this.localService.saveDebriefDetails(debriefDetails);
      }
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchDebriefDetails", error);
    } finally {
      return result;
    }
  }

  private async fetchSRDetails() {
    let result: boolean = false;
    try {
      let srIds = this.getSRIDs();
      if (srIds.length > 0) {
        let userObject = { ID: this.valueProvider.getUser().ID, Last_Updated_SR: this.utilityProvider.getCurrentTime() };
        let srDetails = await this.cloudService.getSRDetails(srIds);
        await this.localService.saveSRDetails(srDetails);
        await this.localService.updateLastSR(userObject);
      }
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchSRDetails", error);
    } finally {
      return result;
    }
  }

  private async fetchProjectDetails() {
    let result: boolean = false;
    try {
      let projectIds = this.getProjectIDs();
      if (projectIds.length > 0) {
        let userObject = { ID: this.valueProvider.getUser().ID, Last_Updated_Project: this.utilityProvider.getCurrentTime() };
        let projectDetails = await this.cloudService.getProjectDetails(projectIds);
        await this.localService.saveProjectDetails(projectDetails);
        await this.localService.updateLastProject(userObject);
      }
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchProjectDetails", error);
    } finally {
      return result;
    }
  }

  private getSRIDs() {
    let srNumberArray = [];
    this.valueProvider.getTaskList().forEach(item => {
      if (item.SR_ID && item.SR_ID != '' && srNumberArray.indexOf(item.SR_ID) === -1) {
        srNumberArray.push(item.SR_ID);
      }
    });
    return srNumberArray;
  }

  private getProjectIDs() {
    let projectNumberArray = [];
    this.valueProvider.getTaskList().forEach(item => {
      if (item.Project_Number && item.Project_Number != '' && projectNumberArray.indexOf(item.Project_Number) === -1) {
        projectNumberArray.push(item.Project_Number);
      }
    });
    return projectNumberArray;
  }

  /**
   * Gets Detailed Notes for PWS Tasks from DBCS and stores them locally to database
   *
   * @private
   * @memberof FetchProvider
   */
  private async fetchPWSTaskData() {
    let result: boolean = false;
    try {
      let pwsTasks: any = await this.localService.getTaskNumberForDetailedNotes();
      pwsTasks = pwsTasks.map((item) => item.Task_Number);
      let data: any = {};
      if (pwsTasks.length > 0) {
        data = await this.cloudService.getDetailedNotesFromDBCS({ Task_Number: pwsTasks });
      }
      // To be called when Starting working on Further JIRA tasks for Get services
      let promiseArr = [];
      if (data.notes) promiseArr.push(this.localService.insertDetailedNotesOnSync(data.notes));
      if (data.attachments) promiseArr.push(this.localService.insertDetailedNotesAttachmentDataSync(data.attachments, false));
      await Promise.all(promiseArr);
      await this.fetchPWSAttachments();
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchPWSTaskData", error);
    } finally {
      return result;
    }
  }

  /**
   * Gets all the pending Debrief Attachments and saves them as a physical file
   *
   * @private
   * @memberof FetchProvider
   */
  private async fetchDebriefAttachments() {
    let result: boolean = false;
    try {
      let attachments: any = await this.localService.getAttachmentListType();
      await this.downloadDebriefAttachments(attachments);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchDebriefAttachments", error);
    } finally {
      return result;
    }
  }

  private async downloadDebriefAttachments(attachments) {
    let result: boolean = false;
    try {

      let promiseArray = [];
      attachments.forEach((attachment) => {
        promiseArray.push(this.downloadAttachment(attachment));
      });
      let syncedAttachments = await Promise.all(promiseArray);
      await this.localService.updateAttachmentDownloadStatus(syncedAttachments);

      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "downloadDebriefAttachments", error);
    } finally {
      return result;
    }
  }

  /**
   *08/10/2018 Zohaib Khan
   * Creating directory with SRID name and saving files to that perticular directory
   */
  private async downloadAttachment(attachment) {
    try {
      let folderName;
      let id;
      if (attachment.SRID != "") {
        folderName = '/srfiles/';
        id = attachment.SRID
      }
      if (attachment.Task_Number != "") {
        folderName = '/taskfiles/';
        id = attachment.Task_Number
      }

      let downloadAttachment = await this.cloudService.downloadAttachment(attachment);
      //08/10/2018 Zohaib Khan: Checking if directory exist or not
      let dirExists = await this.utilityProvider.checkIfDirectoryExist(attachment.File_Path + folderName, id);

      if (!dirExists) {
        //08/10/2018 Zohaib Khan: Creating directory tind srid name
        await this.utilityProvider.createDir(attachment.File_Path + folderName, id);
        await this.utilityProvider.createDir(attachment.File_Path + folderName + id, "thumbnails");
      }
      attachment = await this.saveFilesToFolder(downloadAttachment, attachment);
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "downloadAttachment", error);
    } finally {
      return attachment;
    }

  }

  // private async saveFilesToFolder(result, item) {
  private async saveFilesToFolder(downloadAttachment, attachment) {
    try {
      let folderName;
      let id;
      if (downloadAttachment.data) {
        let base64Code = downloadAttachment.data;
        if (attachment.SRID != "") {
          folderName = '/srfiles/';
          id = attachment.SRID;
        }
        if (attachment.Task_Number != "") {
          folderName = '/taskfiles/';
          id = attachment.Task_Number;
        }

        await this.utilityProvider.saveBase64File(attachment.File_Path + folderName + id, attachment.File_Name, base64Code, attachment.File_Type);
        attachment.Attachment_Status = "true";
      }
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "saveFilesToFolder", error);
      attachment.Attachment_Status = "false";
    } finally {
      return attachment;
    }
  }

  /**
   * Gets all the Detailed Notes Attachments and saves them as a physical file
   *
   * @private
   * @memberof FetchProvider
   */
  private async fetchPWSAttachments() {
    let result: boolean = false;
    try {
      let attachments: JSON[] = await this.localService.getPendingPWSAttachments();
      let dnArr = _.uniqBy(attachments, 'DNID');
      await this.createPWSFolders(dnArr);
      let promiseArr = [];
      attachments.forEach(attachment => {
        promiseArr.push(this.downloadPWSAttachment(attachment));
      });
      let attachmentsResponse = await Promise.all(promiseArr);
      await this.localService.updateDetailedNotesAttachmentStatus(attachmentsResponse);

      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchPWSAttachments", error);
    } finally {
      return result;
    }
  }

  private async downloadPWSAttachment(attachment) {
    let result;
    try {
      if (!this.attachmentService) this.attachmentService = this.injector.get(AttachmentProvider);
      let attachmentData = await this.cloudService.getDetailedNotesAttachmentDBCS(attachment.Attachment_ID);
      let path = cordova.file.dataDirectory + "detailednotesfiles/" + attachment.task_number + "/" + attachment.DNID;
      result = await this.attachmentService.saveAttachmentDetailedNotes(attachmentData, Enums.AttachmentType.DetailedNotes, path);
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "downloadPWSAttachment", error);
    } finally {
      return result;
    }
  }

  private async createPWSFolders(dnArr) {
    let result: boolean = false;
    try {
      let promiseArr = [];
      let basePath = cordova.file.dataDirectory + "detailednotesfiles/";
      dnArr.forEach(detailedNote => {
        promiseArr.push(this.createPWSChildFolders(basePath, detailedNote));
      });
      await Promise.all(promiseArr);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "createPWSFolder", error);
    }
    return result;
  }

  private async createPWSChildFolders(basePath, detailedNote) {
    let result: boolean = false;
    try {
      let isDirCrerated = await this.utilityProvider.createDirIfNotExist(basePath, String(detailedNote.task_number), false);
      if (isDirCrerated) {
        let baseFolder = basePath + (detailedNote.task_number) + "/";
        await this.utilityProvider.createDirIfNotExist(baseFolder, String(detailedNote.DNID), true);
        result = true;
      }
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "createPWSChildFolders", error);
    } finally {
      return result;
    }
  }

  /**
   * Gets all the tasks and reports from server according to the 
   * last modified date, and stores them in the local database.
   *
   * @private
   * @returns {Promise<boolean>}
   * @memberof FetchProvider
   */
  private async fetchDBCSReportsAndTasks(): Promise<boolean> {
    let result: boolean = false;
    try {
      let taskNumbers: any = await this.localService.getTaskNumberListToFetch();
      taskNumbers = taskNumbers.map(item => item.Task_Number);

      let devicePromiseArr = [];
      devicePromiseArr.push(this.cloudService.getReports(taskNumbers));
      devicePromiseArr.push(this.cloudService.getActuationData());
      //  devicePromiseArr.push(this.cloudService.getIsolationData()); //To Do: Need to enable once we start flow isolation.

      let currentFetchTime = this.utilityProvider.getCurrentTime();
      let responseArr = await Promise.all(devicePromiseArr);

      let reportArr = Object.assign(responseArr[0], responseArr[1]);
      let promiseArr = [];
      this.validateSDRReportData(reportArr);
      if (reportArr && reportArr != {}) promiseArr.push(this.saveSDRData(reportArr));
      // if (reportArr.SDRREPORT.length > 0) promiseArr.push(this.createSDRReportFolders(reportArr.SDRREPORT));
      // promiseArr.push(this.localService.saveInternalTimeList(reportArr.INTERNALTIME.data));
      if (reportArr.TASK.data) promiseArr.push(this.saveTasksFromDBCS(reportArr.TASK.data));
      promiseArr.push(this.saveDebriefFromDBCS(reportArr));
      await Promise.all(promiseArr);
      await this.localService.updateLastReport({ ID: this.valueProvider.getUser().ID, Last_Updated_Reports: currentFetchTime });
      let attPromiseArr = [];
      attPromiseArr.push(this.fetchSDRAttachment());
      attPromiseArr.push(this.saveFCRReportAttachment());
      await Promise.all(attPromiseArr);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchDBCSReportsAndTasks", error);
    } finally {
      return result;
    }
  }

  /**
   * Create folders for Report by ID
   *
   * @private
   * @param {*} SDRREPORT
   * @returns
   * @memberof FetchProvider
   */
  private async createSDRReportFolders(SDRREPORT) {
    let result: boolean = false;
    try {
      let reportArr = [];
      let promiseArr = [];
      let reportPath = cordova.file.dataDirectory + "reportfiles/";
      for (let i = 0; i < SDRREPORT.length; i++) {
        promiseArr.push(this.createReportFolder(reportPath, SDRREPORT[i]));
        reportArr = reportArr.concat(SDRREPORT[i].reportdata);
      }
      await Promise.all(promiseArr);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "createSDRReportFolders", error);
    } finally {
      return result;
    }
  }

  private async createReportFolder(reportPath, fileData) {
    let result: boolean = false;
    try {
      await this.utilityProvider.createDirIfNotExist(reportPath, fileData.REPORTID, false);
      await this.utilityProvider.createDirIfNotExist(reportPath + fileData.REPORTID + "/", "Photos", true);
      result = true;
    } catch (error) {
      error.source = Enums.errorSource.unableToDownload;
      error.httpCode = Enums.errorCodes.unableToDownload;
      error.logMessage = Enums.errorMessages.unableToCreateFolder + ` ${fileData.REPORTID}`;
      error.userMessage = this.translate.instant(Enums.errorMessages.unableToCreateFolder) + ` ${fileData.REPORTID}`;
      this.syncProvider.handleError(FetchProvider.name, "createReportFolder", error);
    } finally {
      return result;
    }
  }

  private async saveSDRData(reportArr): Promise<boolean> {
    let result: boolean = false;
    try {
      await this.localServiceSDR.saveSDRData(reportArr);
      result = true;
    } catch (error) {
      this.logger.log(FetchProvider.name, "saveSDRData", error);
    } finally {
      return result;
    }
  }

  private async saveTasksFromDBCS(taskList) {
    let result: boolean = false;
    try {
      await this.localService.insertTaskListBatchDBCS(taskList);

      let promiseArr = [];
      let filePath = cordova.file.dataDirectory + "taskfiles/";
      for (let k in taskList) {
        promiseArr.push(this.utilityProvider.createDirIfNotExist(filePath, String(taskList[k].task_number), true))
      }

      Promise.all(promiseArr);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "saveTasksFromDBCS", error);
    } finally {
      return result;
    }
  }

  private async saveDebriefFromDBCS(Data) {
    let result: boolean = false;
    try {
      let promiseArr = [];
      if ((Data.TIME.data && Data.TIME.data.length > 0) || (Data.INTERNALTIME.data && Data.INTERNALTIME.data.length > 0)) {
        let time = (Data.TIME.data || []).concat((Data.INTERNALTIME.data || []));
        promiseArr.push(this.localService.saveInternalTimeList(time))
      };
      if (Data.EXPENSE.data && Data.EXPENSE.data.length > 0) promiseArr.push(this.localService.insertExpensesListBatchDBCS(Data.EXPENSE.data));
      if (Data.NOTES.data && Data.NOTES.data.length > 0) promiseArr.push(this.localService.insertNotesListBatchDBCS(Data.NOTES.data));
      if (Data.SIGNATURE.data && Data.SIGNATURE.data.length > 0) promiseArr.push(this.localService.saveSignatureDBCS(Data.SIGNATURE.data));
      if (Data.FCR_ATTACHMENT.data && Data.FCR_ATTACHMENT.data.length > 0) promiseArr.push(this.localService.insertAttachmentListBatchDBCS(Data.FCR_ATTACHMENT.data));

      let materials = this.utilityProvider.combineMaterialArrayDBCS(Data.MATERIAL.data);
      promiseArr.push(this.localService.insertMaterialListBatchDBCS(materials));

      await Promise.all(promiseArr);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "saveDebriefFromDBCS", error);
    } finally {
      return result;
    }
  }

  /**
   * Get SDR Attachment list to fetch the attachment for sdr.
   * @author:Gurkirat (02/18/2019)
   *
   */
  private async fetchSDRAttachment() {
    let result: boolean = false;
    try {
      let attachments = await this.localServiceSDR.getPendingSDRAttachments();
      await this.createSDRAttachments(attachments);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchSDRAttachment", error);
    } finally {
      return result;
    }
  }

  /**
   * Create folder is reportfiles according to attachment and get attachment from dbcs.
   * @author: Gurkirat (02/08/2019)
   * 
   */
  private async createSDRAttachments(value) {
    let result: boolean = false;
    try {
      let servicePromiseArr = [];
      let SDRREPORT = [];
      value.forEach((item) => {
        let data = SDRREPORT.filter(i => i.REPORTID == item.REPORTID);
        if (data.length == 0) SDRREPORT.push(item);
      })
      await this.createSDRReportFolders(SDRREPORT)
      for (let index = 0; index < value.length; index++) {
        servicePromiseArr.push(this.saveReportAttachments(value[index]));
      }
      await Promise.all(servicePromiseArr);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "createSDRAttachments", error);
    } finally {
      return result;
    }
  }

  private async saveReportAttachments(attachment) {
    let result: boolean = false;
    try {
      let attachmentData = await this.cloudService.getReportsAttachmentsSdr(attachment.RA_PK_ID)
      await this.addAttachment(attachmentData);
      if (attachmentData) {
        await this.localService.updateAttachmentStatus(attachment.RA_PK_ID);
      }
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "saveReportAttachments", error);
    } finally {
      return result;
    }
  }

  /**
   * Save Attcahment is the particular folder in reportfiles
   * @author:Prateek (02/18/2019)
   *
   */
  private async addAttachment(value: any) {
    let result: boolean = false;
    try {
      let path = cordova.file.dataDirectory + "reportfiles/" + value[0].REPORTID + "/Photos";
      if (!this.attachmentService) this.attachmentService = this.injector.get(AttachmentProvider);
      await this.attachmentService.saveAttachmentToFolderSdrDBCS(value, Enums.AttachmentType.SDR, path);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "addAttachment", error);
    }
    return result;
  }

  private async saveFCRReportAttachment() {
    let result: boolean = false;
    try {
      let fcrReportAttachments: any = await this.localService.getFCRReportAttachment();
      let promiseArr = [];
      fcrReportAttachments.forEach((item) => {
        promiseArr.push(this.fetchFCRAttachmentsFromDBCS(item));
      });
      await Promise.all(promiseArr);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "saveFCRReportAttachment", error);
    } finally {
      return result;
    }
  }

  private async fetchFCRAttachmentsFromDBCS(attachment) {
    let result: boolean = false;
    try {
      let id = attachment.Attachment_Id;
      let attachmentData: any = await this.cloudService.downloadFCRReportAttachment(id);
      if (attachmentData && attachmentData.length > 0) {
        let data = attachmentData[0];
        let attachmentObj = this.transformProvider.createAttachmentObject(data);
        let filePath = cordova.file.dataDirectory + "taskfiles/";
        if (!this.attachmentService) this.attachmentService = this.injector.get(AttachmentProvider);
        let response = await this.attachmentService.saveAttachment(filePath + data.task_number, attachmentObj, Enums.AttachmentType.FCR);
        if (response) {
          await this.localService.updatePendingFCRReportAttachmentSyncStatus(id);
        }
      } else {
        throw new Error("Error: No response for AttachmentID: " + id);
      }
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchFCRAttachmentsFromDBCS", error);
    } finally {
      return result;
    }
  }

  private async fetchInternalActivities(): Promise<boolean> {
    let result: boolean = false;
    try {
      let activities = await this.cloudService.getActivities();
      if (activities && activities.length) {
        await this.localService.insertInternalListBatch(activities);
        this.events.publish('refreshPageData', null);
      }
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchInternalActivities", error);
    } finally {
      return result;
    }
  }

  /**
   * @memberof FetchProvider
   * @default:  (Ref: saveLOVDetails) //osc
   * @description: 
   * Added LOV Batch to 
   */
  private async fetchLOVs(): Promise<boolean> {
    let result: boolean = false;
    try {
      let lovDetails = await this.cloudService.getLOVDetails();
      await this.localService.insertLOVBatch(lovDetails);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "saveLOVDetails", error);
    } finally {
      return result;
    }
  }
  /**
   * @memberof FetchProvider
   * @default:  (Ref: saveSiteAllowancesData) //ATP
   * @description: 
   * Added Allowances Batch to 
   */
  private async fetchSiteAllowance(): Promise<boolean> {
    let result: boolean = false;
    try {
      let userObject = {
        'ID': this.valueProvider.getUser().ID,
        'Last_Updated_Allowances': new Date()
      };
      let AllowancesDetails = await this.cloudService.getSiteAllowacesDetails();
      await this.localService.insertAllowanceBatch(AllowancesDetails);
      await this.localService.updateLastAllowance(userObject);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "fetchSiteAllowance", error);
    } finally {
      return result;
    }

  }

  private async fetchTimesheetLOVs(clarityId, lastModifiedDate): Promise<boolean> {
    let result: boolean = false;
    try {
      let userObject = { ID: this.valueProvider.getUser().ID, Last_Updated_SR: this.utilityProvider.getCurrentTime() };
      let lovDetails = await this.cloudService.getTimesheetLOVDetails(clarityId, lastModifiedDate);
      await this.localService.insertTimesheetLOVBatch(lovDetails);
      await this.localService.updatTimeSheetLovTime(userObject);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "saveTimesheetLOVDetails", error);
    } finally {
      return result;
    }
  }
  /**
     * @memberof FetchProvider
     * @default: Perform OnCallShift Process to Save, Replace and Delete the data Coming from MCS Service.
     * @description:-
     * Delete and INSERT OR REPLACE OnCallShift from Work_Schedule Table
     */
  private async fetchOnCallShift(): Promise<boolean> {
    let result: boolean = false;
    try {
      let onCallShifts: any = await this.cloudService.getOnCallShift();
      if (onCallShifts.items.length) {
        this.logger.log(this.fileName, "fetchOnCallShift", "SUCCESS PROMISE WorkSchedule. END WorkSchedule INSERT " + new Date());
        await this.localService.saveWorkSchedule(onCallShifts.items);
        this.valueProvider.setWorkSchedule(onCallShifts.items);
      } else {
        this.logger.log(this.fileName, "fetchOnCallShift", "No Data from server");
      }
      result = true;
    } catch (error) {
      this.syncProvider.handleError(FetchProvider.name, "fetchOnCallShift", error);
    } finally {
      return result;
    }
  }

  /**
    * @memberof FetchProvider
    * @default: Ref(sync:- fetchTimezones)
    * @description:-
    * Fetch ActiveTimezone from DBCS, Update localDB timezone, LastUpdatedTimezone 
    */
  public async fetchTimezones() {
    let result: any = [];
    try {
      let userObject = {
        'ID': this.valueProvider.getUser().ID,
        'Last_Updated_Timezone': new Date()
      };

      let activeTimezones: any = await this.cloudService.getActiveTimezone(false);
      if (activeTimezones && activeTimezones.length) {
        activeTimezones = await activeTimezones.map((item) => {
          item.Sync_Status = "true";
          return item;
        });

        await this.localService.saveActiveTimezoneList(activeTimezones);
        //01/30/2019 -- Mayur Varshney -- update user timezone isActive='Y' in timezone table
        await this.localService.saveUserTimezoneIsActive(this.valueProvider.getUser().timeZoneIANA);

        await this.localService.updateLastTimezone(userObject);
        this.valueProvider.getUser().Last_Updated_Timezone = userObject.Last_Updated_Timezone;
      } else {
        //02/02/2019 -- Mayur Varshney -- handle condition if all timezone are inactive
        await this.localService.saveUserTimezoneIsActive(this.valueProvider.getUser().timeZoneIANA)
        await this.localService.updateLastTimezone(userObject);
      }

      // result = activeTimezoneFromDBCS;
      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "fetchTimezones", error);
    } finally {
      return result;
    }
  }

  /**
  * @memberof FetchProvider
  * @default: Ref(sync:- fetchTimezones)
  * @description:-
  * Fetch All the timezones for admin from DBCS 
  */
  public async fetchTimezonesForAdmin() {
    let result: any = [];
    try {
      let activeTimezoneFromDBCS: any = await this.cloudService.getActiveTimezone(true);
      result = activeTimezoneFromDBCS;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "fetchTimezones", "Error in fetchTimezones: " + error.message);
      if (error.data && error.data.error) {
        this.utilityProvider.displayErrors([{ "errMsg": error.data.error }]);
      }
    } finally {
      return result;
    }
  }

  /**
   * @memberof FetchProvider
   * @default: Ref(sync:- saveCustomers)
   * @description:-
   * Fetch Customer Data from MCS, Update localDB , Set LastUpdated 
   */
  private async fetchCustomers(): Promise<boolean> {
    let result: boolean = false;
    try {
      let getCustomerDataFromMCS = await this.cloudService.getCustomerData();
      await this.localService.insertCustomerInCutomerDb(getCustomerDataFromMCS);
      await this.storage.set("Last_Updated_MST_Customer", this.utilityProvider.getCurrentTime());
      this.valueProvider.setLast_Updated_MST_Customer(this.utilityProvider.getCurrentTime());
      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "fetchCustomers", error);
    } finally {
      return result;
    }
  }

  /**
 * @memberof FetchProvider
 * @default: Ref(sync:- saveLanguageDetails)
 * @description:-
 * Fetch Languages Data from MCS, Update localDB , Set LastUpdated 
 */
  private async fetchLanguageDetails(): Promise<boolean> {
    let result: boolean = false;
    try {

      let languageData: any = await this.cloudService.getMSTLanguages();
      if (languageData && languageData.length > 0) {
        await this.localService.saveMSTLanguageList(languageData);
        await this.createLanguageFiles(languageData);
        await this.reloadLanguageData(languageData);

        let userObject = {
          'ID': this.valueProvider.getUser().ID,
          'Last_Updated_Languages': this.valueProvider.getUser().Last_Updated_Languages
        };
        await this.localService.lastUpdatedLanguages(userObject);
      }
      // // 02-03-2020 -- Mayur Varshney -- refresh user preference language drop down values on every sync
      this.localService.getEnabledLanguages().then((resp: any) => {
        this.valueProvider.setEnabledLanguageList(resp);
      })
      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "fetchLanguageDetails", error);
    } finally {
      return result;
    }
  }

  // for each with promise all[]
  private async createLanguageFiles(languageData) {
    let result: boolean = false;
    try {

      let promiseArr = [];

      languageData.forEach((language) => {

        if (language["ISENABLED"] == 'true') {

          try {
            let fileName = language["CODE"] + ".png";
            let iconB64 = language["LANGUAGE_ICON"];
            let iconBlob = this.utilityProvider.b64toBlob(iconB64, 'image/png', null);
            promiseArr.push(this.utilityProvider.saveLanguageFile(iconBlob, fileName));

            let languageCode = language["CODE"] + '.json';
            let languageFile = decodeURIComponent(escape(window.atob(language["RESOURCE_FILE"])));//atob(language["RESOURCE_FILE"]);


            // let languageFile = decodeURIComponent(window.atob(language["RESOURCE_FILE"]));
            // let languageFile = this.b64DecodeUnicode(language["RESOURCE_FILE"]);

            promiseArr.push(this.utilityProvider.saveLanguageFile(languageFile, languageCode));

            this.translate.reloadLang(language["CODE"]);
          } catch (error) {
            error.userMessage = language["LANG_NAME"] + Enums.errorMessages.unableToCreateLanguage;
            error.source = Enums.errorSource.unableToDownload;
            this.syncProvider.handleError(this.fileName, "createLanguageFiles", error);
          }

        }
      });
      await Promise.all(promiseArr);

      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "createLanguageFiles", error);
    } finally {
      return result;
    }
  }

  public async reloadLanguageData(languageData) {
    let result: boolean = false;
    try {
      languageData.forEach((language) => {
        let code: any = language["CODE"];
        this.translate.reloadLang(code);
      });

      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "createLanguageFiles", error);
    } finally {
      return result;
    }
  }

  /**
   * @memberof fetch
   * @default:  (Ref: saveLanguageKeyMappings) //DBCS
   * @description: 
   * Fetch language key mappings 
   */
  public async fetchLanguageKeyMapping(langId) {
    let result: any = [];
    try {
      let languageKeyMappings = await this.cloudService.getLanguageKeyMapping(langId);
      result = languageKeyMappings;
    } catch (error) {
      if (error.data && error.data.error) {
        this.utilityProvider.displayErrors([{ "errMsg": error.data.error }]);
      }
    } finally {
      return result;
    }
  }

  /**
   * @memberof fetch
   * @default:  (Ref: saveLookups)
   * @description: 
   * This function gets the data from DBCS Lookups Table
   * and stores it in Local SQLite DB
   */
  private async fetchDBLookupsLOVs(): Promise<boolean> {
    let result: boolean = false;
    try {
      let getLookups: any = await this.cloudService.getLookups();
      if (getLookups.data.length) {
        this.localService.insertLookupsBatch(getLookups.data)
      }
      await this.storage.set("Last_Updated_Lookups", this.utilityProvider.getCurrentTime())
      this.valueProvider.setLast_Updated_Lookups(this.utilityProvider.getCurrentTime());
      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "fetchDBLookupsLOVs", error);
    } finally {
      return result;
    }
  }


  /**
   * @memberof FetchProvider
   * @default: Ref(sync:- saveAddresses)
   * @description:-
   * Fetch Addresses Data from MCS, Update localDB 
   */
  private async fetchAddresses(): Promise<boolean> {
    let result: boolean = false;
    try {

      let userObject = { ID: this.valueProvider.getUser().ID, Last_Updated_Addresses: this.utilityProvider.getCurrentTime() };
      let addressList: any = await this.cloudService.getAddresses();
      let addresses: any = JSON.parse(JSON.stringify(addressList));
      if (addresses.length) {
        addresses = addresses.map((item) => {
          item.Sync_Status = "true";
          return item;
        });
        await this.localService.saveAddressListBatch(addresses);
      }
      await this.localService.updateLastAddresses(userObject);

      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "fetchAddresses", error);
    } finally {
      return result;
    }
  }

  // handleCustomErrors(error) {
  //   if (!error.code) {
  //     error.httpCode = Enums.errorCodes.unableToDownload,
  //     error.userMessage = Enums.errorMessages.unableToDownload,
  //     error.source = Enums.errorSource.unableToDownload
  //   }
  // }
  private validateSDRReportData(sdrData) {
    let result = true;
    let keys = Object.keys(sdrData);
    keys.forEach(key => {
      if (!sdrData[key].success) {
        this.syncProvider.handleError(this.fileName, "validateSDRReportData", sdrData[key].error);
        result = false;
      }
    })
    return result;
  }
}
