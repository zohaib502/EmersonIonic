import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { UtilityProvider } from '../../utility/utility';
import { ValueProvider } from '../../value/value';
import { LoggerProvider } from '../../logger/logger';
import { SyncProvider } from '../sync';
import { LocalServiceProvider } from '../../local-service/local-service';
import { CloudService } from '../../cloud-service/cloud-service';
import { AttachmentProvider } from '../../attachment/attachment';
import moment from 'moment-timezone';
import { Events, Platform, ToastController } from 'ionic-angular';
import { TransformProvider } from '../../transform/transform';
import * as Enums from '../../../enums/enums';
import { LocalServiceSdrProvider } from '../../local-service-sdr/local-service-sdr';
import { FetchProvider } from '../fetch/fetch';
import * as _ from 'lodash';
declare var cordova;
/*
  Generated class for the SubmitProvider provider.
*/
@Injectable()
export class SubmitProvider {

  fileName: any = "SyncProvider";
  // syncStatus: any = {};
  lastSyncTimeFormat: any = "MM-DD-YYYY HH:mm";
  lastSyncTime: any;
  currentSyncLogId: any;
  currentSyncStartTime: any;
  errors: any[] = [];
  errorLength: number;
  // 08/28/2018 Rizwan Haider - For future use.
  pendingOperations: any[] = [];
  sdrRdidList: any[] = [];
  initSyncCalled: any = false;
  oneGoData: any = 0;
  ifNotSubmitting: any = true;
  onSubmittting: any = false;
  permissions: any;
  syncProvider: SyncProvider
  appVersion: any;
  isSubmitting: boolean;
  fetchProvider: FetchProvider;
  storePromiseForSubmit = [];

  constructor(
    public http: HttpClient,
    public valueProvider: ValueProvider,
    public transformProvider: TransformProvider,
    public utilityProvider: UtilityProvider,
    public logger: LoggerProvider,
    private localService: LocalServiceProvider,
    public cloudService: CloudService,
    // attachmentService: AttachmentProvider,
    public injector: Injector,
    // private platform: Platform,
    public localServiceSDR: LocalServiceSdrProvider,
    public events: Events

  ) {
    setTimeout(() => this.syncProvider = injector.get(SyncProvider));
    setTimeout(() => this.fetchProvider = injector.get(FetchProvider));
    // console.log('Hello SubmitProvider Provider');

  }

  /**
  * To perform parallel Submit for different activities
  * Parvinder
  */
  async submitData() {
    let result: boolean = false;
    let promises = [];
    try {
      this.isSubmitting = true;
      if (this.valueProvider.isOSCUser()) {
        promises.push(this.submitPendingOscTask());
        promises.push(this.submitPendingIBForOsc());
        // promises.push(this.submitTaskChangeLogOsc(true));
      }
      promises.push(this.submitPendingSDRReports(true));
      
      promises.push(this.submitPendingTimeEntries());
      
      promises.push(this.deletePendingTimeEntries());
      
      promises.push(this.submitPendingAllowancesEntries());
      promises.push(this.deletePendingAllowancesEntries()); //Delete Pending Site Allowances Entries

      promises.push(this.getPendingFeedbacks());

      result = true;
      let submitTaskResponse = await Promise.all(promises);
      submitTaskResponse.forEach(element => {
        if (element == false) {
          result = false;
          //To do for error
        }
      });
    } catch (error) {
      result = false;
      this.syncProvider.handleError(SubmitProvider.name, "submitData", error);
    } finally {
      this.isSubmitting = false;
      this.completeSubmit();//need to check for optimization
      return result;
    }
  }

  /**
  * Get pending tasks to be submitted to OSC where Sync status is False
  * Loop each task & based on Task status
  * call  submitDebriefForTask(), if --Debrief In-Progress/Completed-Awaiting Review/Declined
  * Or updateTaskStatusCloud(), if -- Accepted/Debrief Started
  * Parvinder
  */

  async submitPendingOscTask() {
    let result: boolean = false;
    let pendingTaskFromLocalDB: any;
    let promises = [];
    try {
      pendingTaskFromLocalDB = await this.localService.getPendingTaskList();
      if (pendingTaskFromLocalDB.length > 0) {
        pendingTaskFromLocalDB.forEach((item) => {
          switch (parseInt(item.StatusID)) {
            case Enums.Jobstatus.Debrief_In_Progress:
            case Enums.Jobstatus.Completed_Awaiting_Review:
              promises.push(this.submitDebriefForTask(item, "offline", true));
              break;
            case Enums.Jobstatus.Accepted:
            case Enums.Jobstatus.Debrief_Started:
              promises.push(this.submitTaskStatusBackend(item, "offline"));
              break;
          }
        });
        let promisesResponse = await Promise.all(promises);
        result = true;
        promisesResponse.forEach(element => {
          if (element == false) {
            result = false;
            //To do for error
          }
        });
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitPendingOscTask", error);
      result = false;
    }
    return result;
  }

  /**
  * To submit status in OSC/OFSC
  * Parvinder
  */
  async submitTaskStatusBackend(taskObject, ConnectionMode) {
    let result: boolean = false;
    let jobSubmissionStatus: string;
    try {
      let changeLogSuccess = await this.submitTaskChangeLogOsc(taskObject);
      if (!changeLogSuccess) return result;
      // let taskNewObject: any = {
      //   Activity_Id: taskObject.Activity_Id,
      //   Task_Number: taskObject.Task_Number,
      // };
      // if (this.syncProvider.isAutoSyncing) await this.checkTaskAtOSC(taskNewObject);
      let engineerResponse: any = await this.localService.getEngineer(taskObject.Task_Number);
      let customerResponse: any = await this.localService.getCustomer(taskObject.Task_Number);
      let statusData: any = this.transformProvider.getUpdateTaskStatusForMCS(taskObject, engineerResponse, customerResponse);
      let updateTaskStatus: any = await this.cloudService.updateTaskStatus(statusData);
      if (updateTaskStatus) {
        switch (parseInt(taskObject.StatusID)) {
          case Enums.Jobstatus.Accepted:
            jobSubmissionStatus = "JobAccepted";
            break;
          case Enums.Jobstatus.Completed_Awaiting_Review:
            jobSubmissionStatus = "JobCompleted";
            break;
        }

        let customEvents = {
          User: this.valueProvider.getUser().Email.toLowerCase(),
          JobNumber: taskObject.Task_Number.toString(),
          ConnectionMode: ConnectionMode
        }
        taskObject.Sync_Status = true;
        await this.localService.updateTaskStatusLocal(taskObject);
        if (jobSubmissionStatus) await this.cloudService.logCustomEvent(jobSubmissionStatus, customEvents);
        result = true;

      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitTaskStatusBackend", error);
      result = false;
    }
    return result;
  }


  /**
* @memberof SubmitProvider
* @default:
* @description:
*/
  async submitTaskChangeLogOsc(taskObject) {
    let result: boolean = false;
    try {
      let pendingTaskChangeLogsFromLocalDB: any = await this.localService.getPendingTaskChangeLogs(taskObject.Task_Number);
      if (pendingTaskChangeLogsFromLocalDB.length == 0) return true;
      pendingTaskChangeLogsFromLocalDB = pendingTaskChangeLogsFromLocalDB.map((res) => {
        res.ResourceId = this.valueProvider.getResourceId();
        // 02/13/2019 -- Mayur Varshney -- send modified start/end date in case of Accepted Job Status
        if (res.Status == Enums.Jobstatus.Accepted) {
          res.endDate = this.formatDate(res.endDate)
          res.startDate = this.formatDate(res.startDate)
          res.subject = 'Meeting invite for Job #';
        }
        return res;
      });
      let submitStagingData: any = await this.cloudService.submitStagingData(pendingTaskChangeLogsFromLocalDB);
      if (submitStagingData) {
        await this.localService.updateTaskChangeLogs(pendingTaskChangeLogsFromLocalDB);
        result = true;
      } else {
        throw submitStagingData.error;
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitTaskChangeLogOsc", error);
    }
    return result;
  }

  private formatDate(date) {
    let result = moment(date).tz(this.valueProvider.getUser().timeZoneIANA).format('YYYY-MM-DD HH:mm:ss.SSS Z');
    return result;
  }

  /*********************//* Debrief Wrapper *//******************** */

  /**
  * To submit Debrief for a Task
  * Parvinder
  */
  async submitDebriefForTask(taskObject, ConnectionMode, fromSync) {
    let result: boolean = false;
    let promises = [];
    let promiseArr = [];
    let businessUnit = (taskObject.Business_Unit == Enums.BusinessUnitNames.PWS) ? true : false;
    try {
      // let checkTask;
      // if (this.syncProvider.isAutoSyncing) checkTask = await this.checkTaskAtOSC(taskObject);
      // if (checkTask) return result;
      promises.push(this.submitDebriefDataCombined(taskObject, fromSync));
      // promises.push(this.submitTimeEntriesToDbcs(taskObject))
      promises.push(this.submitDebriefDataMaterial(taskObject));
      promises.push(this.submitOSCAttachments(taskObject));
      promises.push(this.submitTaskChangeLogOsc(taskObject));
      if (businessUnit) {
        promises.push(this.submitPWSData(taskObject));
      }
      let debriefResponse = await Promise.all(promises);
      result = true;
      debriefResponse.forEach(element => {
        if (element == false) {
          result = false;
        }
      });
      if (result == true) {
        result = await this.submitTimeEntriesToDbcs(taskObject);
        if (result == true) {
          await this.submitTaskStatusBackend(taskObject, ConnectionMode);
        }
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitDebriefForTask", error);
      result = false;
    } finally {
      return result;
    }
  }

  /*********************//* Debrief Wrapper *//******************** */
  /**
   * @memberof SyncProvider
   * Rajat
   * @default: Ref(Flow DFD)
   * @description:submitDebriefDataCombined (Still Some Part Left API Name is also changed), derived from below
   * function, submitDebrief to consise it
   */
  private async submitDebriefDataCombined(taskObject, fromSync) {
    let result = false;
    try {
      if (this.syncProvider.isAutoSyncing && !fromSync) {

        sessionStorage.setItem("pendingOperations", 'true');
        return Promise.resolve("success");

      } else {

        let submitDebriefArr: any = [];
        submitDebriefArr.push(this.localService.getPendingTimeList(taskObject.Task_Number));
        submitDebriefArr.push(this.localService.getPendingSignature(taskObject.Task_Number));
        submitDebriefArr.push(this.localService.getPendingExpenseList(taskObject.Task_Number));
        submitDebriefArr.push(this.localService.getPendingNotesList(taskObject.Task_Number));

        let submitDebriefResponse: any = await Promise.all(submitDebriefArr);

        // TODO: Submit Notes and Signature Once API starts supporting,
        // TODO: Get Notes_Id and SignatureID as UniqueMobileID in both Notes and Signature
        let pendingTimeEntriesForTask: any = submitDebriefResponse[0];
        pendingTimeEntriesForTask = this.transformProvider.getTimeForMCS(pendingTimeEntriesForTask);
        let getPendingSignature: any = submitDebriefResponse[1];
        let getPendingExpense: any = submitDebriefResponse[2];
        let getPendingNotes: any = submitDebriefResponse[3];

        let formData = {
          "Time": pendingTimeEntriesForTask,
          "Signature": getPendingSignature,
          "Expense": getPendingExpense,
          "Notes": getPendingNotes,
        };
        let submitDataLength = pendingTimeEntriesForTask.length + getPendingSignature.length + getPendingExpense.length + getPendingNotes.length;
        if (submitDataLength != 0) {
          let updateDebrief: any = await this.cloudService.updateDebrief(formData, taskObject.Task_Number);
          if (updateDebrief) {
            result = this.validateDebriefSubmission(updateDebrief);
            await this.localService.updateDebriefItems(updateDebrief, taskObject.Task_Number);
          }
        } else {
          result = true;
        }
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitDebriefDataCombined", error);
      result = false;
    } finally {
      return result;
    }
  }

  private validateDebriefSubmission(debriefData) {
    let result = true;
    let keys = Object.keys(debriefData);
    keys.forEach(key => {
      if (debriefData[key].hasError) {
        this.syncProvider.handleError(this.fileName, "validateDebriefSubmission", debriefData[key].error);
        result = false;
      }
    })
    return result;
  }

  /**
   * @memberof SyncProvider
   * Sana
   * @default: Ref(Flow DFD)
   * @description:submitDebriefMaterial, derived from below
   * function, submitDebrief to consise it
   */
  private async submitDebriefDataMaterial(taskObject) {
    let result = false;
    try {
      let submitDebriefMaterial: any = [];
      submitDebriefMaterial = await this.localService.getPendingMaterialList(taskObject.Task_Number);

      let formData = {
        "Material": submitDebriefMaterial
      };
      let submitDataLength = submitDebriefMaterial.length;
      if (submitDataLength != 0) {
        let updateDebrief: any = await this.cloudService.updateDebrief(formData, taskObject.Task_Number);
        if (updateDebrief) {
          result = this.validateDebriefSubmission(updateDebrief);
          await this.localService.updateDebriefItems(updateDebrief, taskObject.Task_Number);
        }
      } else {
        result = true;
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitDebriefDataMaterial", error);
      result = false;
    } finally {
      return result;
    }
  }


  /**
   * @memberof SyncProvider
   * Sana
   * @default: Ref(Flow DFD)
   * @description:submitOSCAttachments, derived from below
   * function, submitDebrief to consise it
   */
  private async submitOSCAttachments(taskObject) {
    let result = false;
    try {
      result = true;

      let taskId = taskObject.Task_Number;
      let promises = [];
      let newPromises = [];
      let unAttachmentList: any = await this.localService.getUnUploadedAttachmentList(taskId);
      if (unAttachmentList.length > 0) {
        unAttachmentList.forEach((attachment) => {
          //08/13/2018 Zohaib Khan: Updated parameter with filepath
          if (attachment.AttachmentType == 'fsr') {
            let reportAttachment = {
              "File_Name": attachment.File_Name,
              "Task_Number": taskId,
              "File_Type": "application/pdf"
            }
            promises.push(this.utilityProvider.getAttachmentObjectForMCS(cordova.file.dataDirectory + "/taskfiles/" + taskId + "/", attachment));
          } else {
            promises.push(this.utilityProvider.getAttachmentObjectForMCS(cordova.file.dataDirectory + "/taskfiles/" + taskId + "/", attachment));
          }
        });

        let attachmentJSONData = await Promise.all(promises);

        for (var i = 0; i < attachmentJSONData.length; i++) {
          newPromises.push(this.uploadOSCAttachment(attachmentJSONData[i]));
        }
      }

      let attachmentJSONData = await Promise.all(newPromises);
      await this.localService.updateUploadedAttachmentStatus(attachmentJSONData);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitOSCAttachments", error);
      result = false;
    } finally {
      return result;
    }
  };

  async uploadOSCAttachment(attachment) {
    try {
      let data = { "attachment": [attachment] };
      await this.cloudService.createAttachment(data);
      attachment.Sync_Status = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "uploadOSCAttachment", error);
    }
    return attachment;
  }

  /**
  *@author: Sana
  *Get Pending detail notes attachment whose status is false
  */
  private async submitPWSData(taskObject) {
    let result = false;
    try {
      // Sending task to dbcs in case of pws and final control
      await this.sendTaskToDbcs(taskObject);

      let getPendingNotes: any = await this.localService.getPendingDetailedNotes(taskObject.Task_Number);
      if (getPendingNotes && getPendingNotes.length) {
        await this.submitDetailNotesDbcs(getPendingNotes);

        // if (this.platform.is('cordova')) {
        //   await this.submitOSCAttachments(taskObject, ConnectionMode);
        // }
      }

      let promises = [];
      let notesAttachments: any = await this.localService.getDetailNotesAttachment(taskObject.Task_Number);
      let filePath = cordova.file.dataDirectory + "/detailednotesfiles/";
      if (notesAttachments && notesAttachments.length) {
        for (let index = 0; index < notesAttachments.length; index++) {
          promises.push(this.submitDetailedNotesAttachment(filePath + notesAttachments[index].task_number + "/" + notesAttachments[index].DNID + "/", notesAttachments[index]));
        }
      }
      Promise.all(promises);

      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitPWSData", error);
      result = false;
    } finally {
      return result;
    }
  }

  /**
  *@author Sana
  *Send Pws task to dbcs
  */
  private async sendTaskToDbcs(task) {
    let result = false;
    try {
      let data: any = { TASK: [task] };
      await this.cloudService.submitReport(data);

      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "sendTaskToDbcs", error);
      result = false;
    } finally {
      return result;
    }
  }

  /**
  * @author  Sana
  * Submitt detailed notes into DBCS
  */
  private async submitDetailNotesDbcs(detailednotes) {
    let result = false;
    try {
      let promiseArr = [];
      for (let k in detailednotes) {
        promiseArr.push(this.submitSingleDetailedNote(detailednotes[k]));
      }
      await Promise.all(promiseArr);

      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitDetailNotesDbcs", error);
      result = false;
    } finally {
      return result;
    }
  }

  /**
  * @author Sana
  * Submitt detailed notes into DBCS
  */
  private async submitSingleDetailedNote(detailedNote) {
    let result = false;
    try {
      await this.cloudService.submitDetailedNotes(detailedNote);
      await this.localService.updateDetailedNotesSyncStatus(detailedNote.DNID);

      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitSingleDetailedNote", error);
      result = false;
    } finally {
      return result;
    }
  }

  /**
  * @author: Sana
  * Get detail Attachment base64.
  */
  private async submitDetailedNotesAttachment(path, res) {
    let result = false;
    try {
      let finalAttachementNotes = await this.utilityProvider.getAttachmentObjectForDetailedNotes(path, res);
      console.log(finalAttachementNotes);
      let submitAttach = await this.cloudService.submitDetailedNotesAttachment(finalAttachementNotes);
      if (submitAttach) this.localService.updateAttachmentStatusDetailedNotesAttachment(res.Attachment_ID);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitDetailedNotesAttachment", error);
      result = false;
    } finally {
      return result;
    }
  }

  /**
  * @memberof SubmitProvider
  * @default:
  * @description:
  */
  public async getPendingFeedbacks(fromSync = true): Promise<any> {
    let result: any = false;
    try {
      let pendingLocalFeedbacks: any = await this.localService.getPendingFeedbacks();

      if (pendingLocalFeedbacks && pendingLocalFeedbacks.length) {
        if (this.syncProvider.isAutoSyncing && !fromSync) {
          sessionStorage.setItem("pendingOperations", 'true');
          return Promise.resolve("success");
        } else {
          let submitFeedback: any = await this.cloudService.submitFeedback(pendingLocalFeedbacks);
          if (submitFeedback) {
            submitFeedback.Feedback_Date = moment(submitFeedback.Feedback_Date).format("MM-DD-YYYY HH:mm:ss");
            await this.localService.updateFeedbackStatus(pendingLocalFeedbacks);
            // Do we need to get the feedbacks from cloud to local DB?
            // await this.localService.saveFeedbackList(pendingLocalFeedbacks);
          }
        }

        result = true;
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "getPendingFeedbacks", error);
      result = false;
    } finally {
      return result;
    }
  }

  /**
  * @memberof SubmitProvider
  * @default:
  * @description:
  */
  public async submitFeedbacks(feedbackArray, fromSync) {
    if (this.syncProvider.isAutoSyncing && !fromSync) {
      sessionStorage.setItem("pendingOperations", 'true');
      return Promise.resolve("success");
    } else {
      let result: any = false;
      try {

        let feedbackResult: any = await this.cloudService.submitFeedback(feedbackArray);
        if (feedbackResult) {
          feedbackResult.Feedback_Date = moment(feedbackResult.Feedback_Date).format("MM-DD-YYYY HH:mm:ss");
          await this.localService.updateFeedbackStatus(feedbackArray);
          // Do we need to get the feedbacks from cloud to local DB?
          // this.localService.saveFeedbackList(feedbackArray);
        }

        result = true;
      } catch (error) {
        this.utilityProvider.stopSpinner();
        this.syncProvider.handleError(this.fileName, "submitFeedbacks", error);
        result = false
      } finally {
        return result;
      }
    }
  }

  /**
   * 08/17/2018 Sana: submit Installed Base on MCS
   * @param {*} submitPendingIBForOsc
   * @returns installedBaseArray
   * @memberof SyncProvider
   */
  private async submitPendingIBForOsc(): Promise<any> {
    let result: any = false;
    try {
      let pendingLocalInstalledBase: any = await this.localService.getPendingInstalledBase();

      if (pendingLocalInstalledBase.length > 0) {
        result = await this.submitInstallBase(pendingLocalInstalledBase);
      } else {
        result = true;
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitPendingIBForOsc", error);
    } finally {
      return result;
    }
  }

  /**
   * Submit an array of Install base in OSC and update the status of those records as Synced
   *
   * @param {*} ibArray
   * @returns
   * @memberof SubmitProvider
   */
  async submitInstallBase(ibArray) {
    let result: any = false;
    try {
      let installedBaseArray = await this.transformProvider.getInstalledBaseForMCS(ibArray);
      let submitInstallBase = await this.cloudService.submitInstallBase(installedBaseArray);
      await this.localService.updateInstalledBaseStatus(submitInstallBase);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitInstallBase", error);
    } finally {
      return result;
    }
  }

  /**
 * @memberof SubmitProvider
 * @default:
 * @description:
 */

  /**********************************(Submit Pending Reports)******************************************/
  public async submitPendingSDRReports(fromSync, REPORTID?) {
    let result: boolean = false;
    try {
      let promiseArr = [];
      promiseArr.push(this.localServiceSDR.getPendingSDRReport(REPORTID));
      promiseArr.push(this.localServiceSDR.getPendingReportAttachments(REPORTID));
      promiseArr.push(this.localServiceSDR.getPendingFCRAttachment(REPORTID));
      let pendingReportAndAttach = await Promise.all(promiseArr);
      let SDRReports = pendingReportAndAttach[0];
      let SDRReportAttachments = pendingReportAndAttach[1];
      let FCRAttachments = pendingReportAndAttach[2];
      let submitPromiseArr = [];
      if (SDRReports.length) {
        let payload: any = { SDRREPORT: SDRReports };
        submitPromiseArr.push(this.submitReport(payload));
      }
      if (SDRReportAttachments.length) submitPromiseArr.push(this.submitReportAttachments(SDRReportAttachments));
      if (FCRAttachments.length) submitPromiseArr.push(this.submitFCRReportAttachments(FCRAttachments));

      await Promise.all(submitPromiseArr);
      result = true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitPendingSDRReports", error);
      result = false
    }
    return result;
  }

  public async submitReport(payload) {
    try {
      let reportIDArr = [];
      payload.SDRREPORT.forEach(item => {
        reportIDArr.push(item.REPORTID);
      });
      let getPendingReportDataResponse: any = await this.getPendingReportData(payload);
      if (getPendingReportDataResponse) {
        let submitReportResponse: any = await this.cloudService.submitReport(payload);
        if (submitReportResponse) {
          let updateReportTaskAndDebriefEntriesResponse: any = await this.localServiceSDR.updateReportTaskAndDebriefEntries(submitReportResponse, reportIDArr, payload.TIME);
          if (!updateReportTaskAndDebriefEntriesResponse) {
            this.syncProvider.handleError(this.fileName, "submitReport", "Error while updateReportTaskAndDebriefEntriesResponse ");
          }
        } else {
          this.syncProvider.handleError(this.fileName, "submitReport", "Error while submit report");
        }
      } else {
        this.syncProvider.handleError(this.fileName, "submitReport", "Error while getting - getPendingReportData ");
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitReport", + error);
    }
  }

  async submitReportAttachments(SDRReportAttachments) {
    let promiseArr = [];
    try {
      SDRReportAttachments.forEach((item) => {
        promiseArr.push(this.submitReportAttachment(item));
      });
      let promiseArrResponse = await Promise.all(promiseArr);
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitReportAttachments", + error);
    }
  }

  private async submitReportAttachment(attachment) {
    try {
      let filePath = cordova.file.dataDirectory + "/reportfiles/" + attachment.REPORTID + "/Photos";
      let AttachmentData: any = await this.utilityProvider.getBase64(filePath, attachment.FILENAME);
      if (AttachmentData.length) {
        attachment.ATTACHMENTDATA = AttachmentData;
        let submitReportAttachmentResponse: any = await this.cloudService.submitReportAttachment([attachment]);
        if (submitReportAttachmentResponse) {
          let updatePendingReportAttachmentSyncStatusResponse: any = await this.localServiceSDR.updatePendingReportAttachmentSyncStatus(attachment.RA_PK_ID);
          if (!updatePendingReportAttachmentSyncStatusResponse) {
            this.syncProvider.handleError(this.fileName, "submitReportAttachment", "Error in updatePendingReportAttachmentSyncStatusResponse");
          }
        } else {
          this.syncProvider.handleError(this.fileName, "submitReportAttachment", "Error in submitReportAttachment : ");
        }
      } else {
        this.syncProvider.handleError(this.fileName, "submitReportAttachment", "Error in getBase64 : ");
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitReportAttachment", error);
    }
  }

  /**
     * 02/09/2019 -- Mayur Varshney
     * getting pending attachments on the basis of attachment_status w.r.t to ReportID_Mobile
     * Submit FCR flow attachments of standalone job
     * @param {*} Task_Number
     * @returns
     * @memberof SyncProvider
     */
  async submitFCRReportAttachments(FCRAttachments) {
    let promiseArr = [];
    try {
      FCRAttachments.forEach((item) => {
        promiseArr.push(this.submitFCRReportAttachment(item));
      });
      await Promise.all(promiseArr);
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitFCRReportAttachments", error);
    }
  }

  /**
   * 02/09/2019 -- Mayur Varshney
   * get base64 of file
   * submit attachment data on DBCS
   * Updates attachment_status after successfully upload the attachment
   * @param {*} attachmentData
   * @returns
   * @memberof SyncProvider
   */

  private async submitFCRReportAttachment(attachmentData) {
    try {
      let filePath = cordova.file.dataDirectory + "taskfiles/" + attachmentData.Task_Number;
      let AttachmentData: any = await this.utilityProvider.getBase64(filePath, attachmentData.File_Name);
      if (AttachmentData.length) {
        attachmentData.AttachmentData = AttachmentData;
        let submitFCRReportAttachmentOnDBCSResponse: any = await this.cloudService.submitFCRReportAttachmentOnDBCS([attachmentData]);
        if (submitFCRReportAttachmentOnDBCSResponse) {
          let updatePendingFCRReportAttachmentSyncStatusResponse: any = await this.localServiceSDR.updatePendingFCRReportAttachmentSyncStatus(attachmentData);
          if (!updatePendingFCRReportAttachmentSyncStatusResponse) {
            this.syncProvider.handleError(this.fileName, "submitFCRReportAttachment", "Error in updatePendingFCRReportAttachmentSyncStatus");
          }
        } else {
          this.syncProvider.handleError(this.fileName, "submitFCRReportAttachment", "Error in submitFCRReportAttachmentOnDBCS : ");
        }
      } else {
        this.syncProvider.handleError(this.fileName, "submitFCRReportAttachment", "Error in getBase64 : ");
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitFCRReportAttachment", error);
    }
  }

  private async getPendingReportData(payload) {

    let reportIDArr = [];
    let ActuationReportIDArr = [];
    let IsolationReportIDArr = [];
    payload.SDRREPORT.forEach(item => {
      reportIDArr.push(item.REPORTID);
      if (item.BUID == Enums.BusinessUnits.Actuation) ActuationReportIDArr.push(item.REPORTID);
      if (item.BUID == Enums.BusinessUnits.Isolation) IsolationReportIDArr.push(item.REPORTID);
    });
    let promiseArr = [];
    let commonTables = ["SELECTEDDEVICE", "TECHNOTES"];
    let ActuationTables = ["NETWORKDEVICE", "ASFOUNDACTUATION", "ASLEFTACTUATION", "ASLEFTRAACTUATION", "CALIBRATIONACTUATION", "DEVICETESTACTUATION"];
    let IsolationTables = ["ASFOUNDFLOWISOLATION", "CALIBRATIONFLOWISOLATION", "FINDINGSFLOWISOLATION", "SOLUTIONFLOWISOLATION",
      "FINALINSPECTIONFLOWISOLATION", "OPTIONALFLOWISOLATION", "RECOMMENDATIONSFLOWISOLATION", "REPORTNOTESFLOWISOLATION",
      "ACCESSORIESFLOWISOLATION", "TESTDATAFLOWISOLATION", "WITNESSHOLDPOINTSFLOWISOLATION"];
    _.each(commonTables, (TableName) => {
      promiseArr.push(this.localServiceSDR.getPendingSDRTableData(TableName, reportIDArr).then(res => { payload[TableName] = res; return Promise.resolve(true); }));
    });
    promiseArr.push(this.getPendingTaskAndDebriefEntries(reportIDArr, payload));
    if (ActuationReportIDArr.length > 0) {
      _.each(ActuationTables, (TableName) => {
        promiseArr.push(this.localServiceSDR.getPendingSDRTableData(TableName, ActuationReportIDArr).then(res => { payload[TableName] = res; return Promise.resolve(true); }));
      });
    }
    if (IsolationReportIDArr.length > 0) {
      _.each(IsolationTables, (TableName) => {
        promiseArr.push(this.localServiceSDR.getPendingSDRTableData(TableName, IsolationReportIDArr).then(res => { payload[TableName] = res; return Promise.resolve(true); }));
      });
    }

    try {
      await Promise.all(promiseArr);
      return payload;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "getPendingReportData", error);
    }

  }

  /**
   * Gets Pending Task by ReportID and if it is a Standalone then gets
   * its Debrief Entries, Signatures, and Attachments to submit to Orable DBCS
   *
   * @private
   * @param {*} ReportID_Mobile
   * @returns
   * @memberof SyncProvider
   */
  public async getPendingTaskAndDebriefEntries(reportIDArr, payload) {
    let result: boolean = false;
    let Tasks: any = await this.localServiceSDR.getPendingTasksForDBCS(reportIDArr);
    try {
      if (Tasks.length > 0) {
        payload.TASK = Tasks;
        let promiseArr = [];
        let TaskArr = [];
        Tasks.forEach((item) => {
          if (item.IsStandalone && item.IsStandalone == 'true') {
            TaskArr.push(item.Task_Number);
          }
        });
        if (TaskArr.length > 0) {
          promiseArr.push(this.localServiceSDR.getPendingTimeForDBCS(TaskArr));
          promiseArr.push(this.localServiceSDR.getPendingNotesForDBCS(TaskArr));
          promiseArr.push(this.localServiceSDR.getPendingExpenseForDBCS(TaskArr));
          promiseArr.push(this.localServiceSDR.getPendingMaterialForDBCS(TaskArr));
          promiseArr.push(this.localServiceSDR.getPendingSignatureForDBCS(TaskArr));
          try {
            let allResult = await Promise.all(promiseArr);
            payload.TIME = allResult[0];
            payload.NOTES = allResult[1];
            payload.EXPENSE = allResult[2];
            payload.MST_MATERIAL = allResult[3];
            payload.SIGNATURE = allResult[4];
            result = true;
          } catch (error) {
            this.syncProvider.handleError(this.fileName, "getPendingTaskAndDebriefEntries", error);
            result = false;
          }
        } else {
          result = true;
        }
      } else {
        result = true;
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "getPendingTaskAndDebriefEntries", error);
      result = false;
    }
    return payload;
  }

  /**********************************(Submit Pending Reports)******************************************/


  /**
  /**
  *@ Sana 10/09/2019
  * @memberof submitTimeEntries
  * @default:  for TimeSheet
  * @description: it is restructured, Submit pending time entries on sync
  */
  public async submitPendingTimeEntries(pendingTimeEntries?) {
    let result: any = false;
    try {
      if(!pendingTimeEntries) pendingTimeEntries = await this.localService.getPendingTimeEntry();

      if (pendingTimeEntries && pendingTimeEntries.length > 0) {
        let TimeForMCSConversion = await this.transformProvider.changeTimeForMCS(Object.assign(Object.create(pendingTimeEntries), pendingTimeEntries))
        await this.cloudService.submitTimeDbcs(TimeForMCSConversion);
        await this.localService.updateTimeSyncStatus(pendingTimeEntries);
      }
      result = true;
    } catch (error) {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'submitTimeDBCS', JSON.stringify(error));
      if(!pendingTimeEntries) throw error;
    } finally {
      return result;
    }
  }

  /**
  /**
  *@ Rajat 
  * @memberof submitAllowncesEntries
  * @default:  for TimeSheet
  * @description: it is restructured, Submit pending time entries on sync
  */
  public async submitPendingAllowancesEntries(pendingAllowancesEntries?) {
    let result: any = false;
    try {
      if(!pendingAllowancesEntries) pendingAllowancesEntries = await this.localService.getPendingAllowancesEntry();

      if (pendingAllowancesEntries && pendingAllowancesEntries.length > 0) {
        let TimeForMCSConversion = await this.transformProvider.changeAllowanceForATP(Object.assign(Object.create(pendingAllowancesEntries), pendingAllowancesEntries))
        await this.cloudService.submitAllowanceATP(TimeForMCSConversion);
        await this.localService.updateAllowanceSyncStatus(pendingAllowancesEntries);
      }
      result = true;
    } catch (error) {
      this.utilityProvider.stopSpinner();
    //  this.logger.log(this.fileName, 'submitAllowanceATP', JSON.stringify(error));
      this.logger.log(this.fileName, "submitAllowanceATP", "Error: " + error.message);

      if(!pendingAllowancesEntries) throw error;
    } finally {
      return result;
    }
  }

  /**
  * @memberof SubmitProvider
  * @default:
  * @description: Submit pending delete time entries on sync
  * @author: Sana 10/09/2019
  */
  async deletePendingAllowancesEntries(tablename = "Allowance") {
    let result: any = false;
    let item = [];
    let userID = this.valueProvider.getUserId();
    try {
      let deleteLocalAllowancesEntries: any = await this.localService.deletePendingAllowancesEntry('Allowance', 'IsDeleted');

      if (deleteLocalAllowancesEntries && deleteLocalAllowancesEntries.length) {
        let key = Object.keys(deleteLocalAllowancesEntries[0]);
        for (let i = 0; i < deleteLocalAllowancesEntries.length; i++) {
          let data = {
            "id": deleteLocalAllowancesEntries[i].ALLOWANCEID,
            "primaryKey": key[0],
            "tableName": tablename,
            "createdBy": userID.toString()
          }
          item.push(data);
          
        }
          let appConnected = await this.utilityProvider.isConnected();
          if (appConnected) {
            await this.cloudService.deleteDebriefItems(item);
            let getDeletedEntries = await this.cloudService.getDeletedEntries(this.syncProvider.getLastSyncTime());
            await this.localService.deleteATPEntries(getDeletedEntries);
          }
      }
      result = true;
    } catch (error) {
      this.logger.log(this.fileName, 'submitTimeDeleteEntries', JSON.stringify(error));
      result = false;
    } finally {
      return result;
    }
  }
  /**
  * @memberof SubmitProvider
  * @default:
  * @description: Submit pending delete time entries on sync
  * @author: Sana 10/09/2019
  */
  async deletePendingTimeEntries(tablename = "time") {
    let result: any = false;
    let item = [];
    let userID = this.valueProvider.getUserId();
    try {
      let deleteLocalTimeEntries: any = await this.localService.deletePendingTimeEntry('time', 'isDeleted');

      if (deleteLocalTimeEntries && deleteLocalTimeEntries.length) {
        let key = Object.keys(deleteLocalTimeEntries[0]);
        for (let i = 0; i < deleteLocalTimeEntries.length; i++) {
          let data = {
            "id": deleteLocalTimeEntries[i].Time_Id,
            "primaryKey": key[0],
            "tableName": tablename,
            "createdBy": userID.toString()
          }
          item.push(data);
        }
        let appConnected = await this.utilityProvider.isConnected();
        if (appConnected) {
          await this.cloudService.deleteDebriefItems(item);
          let getDeletedEntries = await this.cloudService.getDeletedEntries(this.syncProvider.getLastSyncTime());
          await this.localService.deleteDbcsEntries(getDeletedEntries);
        }
      }
      result = true;
    } catch (error) {
      this.logger.log(this.fileName, 'submitTimeDeleteEntries', JSON.stringify(error));
      result = false;
    } finally {
      return result;
    }
  }

  async completeSubmit() {
    let result: any = false;
    try {
      await this.logOnlineOfflineActivity();
      this.cloudService.flushAnalyticsEvents();
      if (!this.fetchProvider.isFetchRunning) {
        if (this.storePromiseForSubmit.length > 0) {
          this.collectPendingSubmitData();
          sessionStorage.setItem("getPendingOperations", 'false');
        } else {
          this.syncProvider.isAutoSyncing = false;
          this.syncProvider.updateSyncLog();
          // 08/30/2018 -- Mayur Varshney -- refresh task list before refreshPageData during submit
          this.localService.refreshTaskList().then(res => {
            this.events.publish('refreshPageData', null);
          }).catch((err: any) => {
            // 12-28-2018 -- Mansi Arora -- change in logs comment
            this.logger.log(this.fileName, 'completeSubmit', 'Error in completeSubmit, refreshTaskList local service : ' + JSON.stringify(err));
          });
        }

      } else {
        if (this.storePromiseForSubmit.length > 0) {
          this.collectPendingSubmitData();
          sessionStorage.setItem("getPendingOperations", 'false');
        }
      }
      this.isSubmitting = false;
    } catch (error) {
      this.logger.log(this.fileName, 'completeSubmit', 'Error in logOnlineOfflineActivity : ' + JSON.stringify(error));
      result = false;
    }
  }

  submitPendingData() {
    let getPendingOperations = sessionStorage.getItem("getPendingOperations");
    if (!this.syncProvider.isAutoSyncing && getPendingOperations) {
      // have to execute the submit promise array accordingly.
    }
  }

  /**
 * Push the function inside the globale array for future execution after sync is done , Ready to start that array
 * submitPromisesForOscTask is the future point
 * Rajat
 */
  submitPromisesForOscTask() {
    if (this.storePromiseForSubmit.indexOf(Enums.conflictStatus.OSCTaskSubmit) == -1) {
      this.storePromiseForSubmit.push(Enums.conflictStatus.OSCTaskSubmit);
    }
  }
  /**
 * Push the function inside the globale array for future execution after sync is done , Ready to start that array
 * submitPromisesForOscTask is the future point
 * Rajat
 */
  submitPromisesIBForOsc() {
    if (this.storePromiseForSubmit.indexOf(Enums.conflictStatus.OSCInstallBaseSubmit) == -1) {
      this.storePromiseForSubmit.push(Enums.conflictStatus.OSCInstallBaseSubmit);
    }
  }

  /**
   * Push the function inside the globale array for future execution after sync is done , Ready to start that array
   * savePendingSDRReports is the future point
   * Rajat
   */
  savePendingSDRReports() {
    if (this.storePromiseForSubmit.indexOf(Enums.conflictStatus.ATPSDRReportSubmit) == -1) {
      this.storePromiseForSubmit.push(Enums.conflictStatus.ATPSDRReportSubmit);
    }
  }

  /**
   * Push the function inside the globale array for future execution after sync is done , Ready to start that array
   * savePendingSDRReports is the future point
   * Rajat
   */
  savePendingTimeRecords() {
    if (this.storePromiseForSubmit.indexOf(Enums.conflictStatus.ATPTimeSubmit) == -1) {
      this.storePromiseForSubmit.push(Enums.conflictStatus.ATPTimeSubmit);
    }
  }


  /**
   * Execute the function when sync completed and Global Array have the functions according to the status
   * Barrier:- Direct function is not able to push inside any global array, if happen than checking the index is not possible
   * Avoid to insert the function direct inside the any array.
   * Rajat
   */
  async collectPendingSubmitData() {
    let promises = [];
    try {
      let PendingTaskList = Object.assign([], this.storePromiseForSubmit);
      this.storePromiseForSubmit = [];
      if (PendingTaskList.length > 0) {
        PendingTaskList.forEach((item) => {
          switch (item) {
            case Enums.conflictStatus.OSCTaskSubmit:
              promises.push(this.submitPendingOscTask());
              break;
            case Enums.conflictStatus.ATPSDRReportSubmit:
              promises.push(this.submitPendingSDRReports(true));
              break;
            case Enums.conflictStatus.ATPTimeSubmit:
              promises.push(this.submitPendingTimeEntries());
              break;
            default:
              break;
          }
        });
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "collectPendingSubmitData", "Error in promise : " + JSON.stringify(error));
    }
    Promise.all(promises).then((allResult) => {
      console.log(allResult);
      this.completeSubmit();
    }).catch(err => {
      this.syncProvider.isAutoSyncing = false;
      this.syncProvider.handleError(this.fileName, "collectPendingSubmitData", "Error in promise : " + JSON.stringify(err));
    });

  }

  public submitLanguageKeyMapping(data) {
    return new Promise((resolve, reject) => {
      try {
        this.cloudService.submitLanguageKey(data).then(res => {
          resolve(true);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'submitLanguageKeyMapping', 'Error in submitLanguageKeyMapping: ' + JSON.stringify(err));
          reject(err);
        });
      } catch (error) {
        this.logger.log(this.fileName, 'submitLanguageKeyMapping', 'Error in submitLanguageKeyMapping: ' + JSON.stringify(error));
        reject(error);
      }
    });
  }

  public submitTimeZone(timezoneArr) {
    return new Promise((resolve, reject) => {
      if (timezoneArr.length > 0) {
        try {
          this.cloudService.submitTimezone(timezoneArr).then((result: any) => {
            resolve(true);
          }).catch(err => {
            this.logger.log(this.fileName, "submitTimezone", "Error while submitTimezone : " + JSON.stringify(err));
            reject(err);
          });
        } catch (err) {
          this.logger.log(this.fileName, "submitTimezone", "Error : " + JSON.stringify(err));
          reject(err);
        }
      } else {
        resolve(true);
      }
    });

  }

  displayErrors(ErrorObject) {
    let params = {
      "errMsg": ErrorObject,
      "checkTask": Enums.ErrorHandlingStatus.onFly
    }
    let syncErrorModal = this.utilityProvider.showModal("SyncErrorModalPage", params, { enableBackdropDismiss: false, cssClass: 'SyncErrorModalPage' });
    syncErrorModal.onDidDismiss((data) => {
      if (data == true) {
        this.logger.log("Error PopOver", 'syncInterrupt', "There is a sync interuption");
      }
    });
    if(ErrorObject) syncErrorModal.present();
  }

  /**
   * check Task which belongs to this user or not at OFSC and OSC, if not show message and return to next
   * Rajat
   */
  async checkTaskAtOSC(taskObject) {
    return false;
  //  console.log("Start Checking OSC Task- " + moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss"))
  //   let result: boolean = false;
  //   let interruptSyncJson = {};
  //   let finalErrorMsg = [];
  //   let taskId = taskObject.Task_Number;
  //   let message = '';
  //   try {
  //     if (taskObject) {
  //       let getTaskAtOSC: any = await this.cloudService.checkTaskAtOSC(taskObject);
  //       if (getTaskAtOSC) {
  //         if (getTaskAtOSC.OFSC.resourceid == this.valueProvider.getResourceId().toString()) {
  //           switch (parseInt(getTaskAtOSC.OFSC.status)) {
  //             case Enums.OFSC_status.unassigned:
  //               message = Enums.errorMessages.assign_unassign_status
  //               break;
  //             case Enums.OFSC_status.Completed_Awaiting:
  //               break;
  //             case Enums.OFSC_status.Accepted:
  //               break;
  //             case Enums.OFSC_status.Cancelled:
  //               message = Enums.errorMessages.cancelled_job;
  //               break;
  //             case Enums.OFSC_status.closed:
  //               message = Enums.errorMessages.closed_job;
  //               break;
  //           }
  //         } else if ((getTaskAtOSC.OFSC.resourceid == '') && (getTaskAtOSC.OFSC.status == Enums.OFSC_status.activity_not_found)) {
  //           message = Enums.errorMessages.activity_not_found;
  //         } else {
  //           message = Enums.errorMessages.assign_unassign_status;
  //         }

  //         if (getTaskAtOSC.OSC.resourceid == this.valueProvider.getResourceId().toString()) {
  //           switch (parseInt(getTaskAtOSC.OSC.status)) {
  //             case Enums.Jobstatus.Accepted:
  //               break;
  //             case Enums.Jobstatus.Completed_Awaiting_Review:
  //               break;
  //             case Enums.Jobstatus.Working:
  //               break;
  //             case Enums.Jobstatus.Debrief_Started:
  //               break;
  //             case Enums.Jobstatus.Job_Completed:
  //               break;
  //             case Enums.Jobstatus.Debrief_In_Progress:
  //               break;
  //             case Enums.Jobstatus.Debrief_Declined:
  //               break;
  //             case Enums.Jobstatus.Closed:
  //               message = Enums.errorMessages.closed_job;
  //               break;
  //             case Enums.Jobstatus.Cancelled:
  //               message = Enums.errorMessages.cancelled_job;
  //               break;
  //             case Enums.Jobstatus.Debrief_Approved:
  //               message = Enums.errorMessages.debreif_job;
  //               break;
  //             case Enums.Jobstatus.Submitted_for_Invoice:
  //               message = Enums.errorMessages.submitted_job;
  //               break;
  //           }
  //         } else {
  //           message = Enums.errorMessages.assign_unassign_status;
  //         }
  //       }
  //       if (message != '') {
  //         if (this.syncProvider.isAutoSyncing) {
  //           interruptSyncJson = {
  //             "httpCode": taskId,
  //             "userMessage": message,
  //             "source": ".",
  //             "isAutoSyncJob": true

  //           }
  //           finalErrorMsg.push({ "errMsg": interruptSyncJson });
  //           this.syncProvider.handleError(SubmitProvider.name, "checkTaskAtOSC", interruptSyncJson);
  //         } else {
  //           interruptSyncJson = {
  //             "httpCode": taskId,
  //             "userMessage": message,
  //             "source": "OFSC"
  //           }
  //           finalErrorMsg.push({ "errMsg": interruptSyncJson });
  //         }
  //         return finalErrorMsg;
  //       }

  //       result = false;
  //     } else {
  //       this.logger.log(this.fileName, 'checkTaskAtOSC', 'Error in checkTaskAtOSC Object Argument blank');
  //       result = false;
  //     }
  //   } catch (error) {
  //     this.logger.log(this.fileName, 'checkTaskAtOSC', 'Error in checkTaskAtOSC : ' + JSON.stringify(error));
  //     throw error;
  //   }
  //   console.log("Finished Checking OSC Task- " + moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss"))
  //   return result;
  }

  /**
   * log analytics after getting them from storage via OnlineActivity/OfflineActivity
   * @returns
   * @author Mayur Varshney
   * @memberOf SubmitProvider
   */
  async logOnlineOfflineActivity() {
    try {
      let OnlineDuration = await this.utilityProvider.getFromStrorage('OnlineActivity');
      await this.cloudService.logCustomEvent('OnlineActivity', OnlineDuration);
      let OfflineDuration = await this.utilityProvider.getFromStrorage('OfflineActivity');
      await this.cloudService.logCustomEvent('OfflineActivity', OfflineDuration);
      return true;
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "logOnlineOfflineActivity", "Error: " + error);
      throw error;
    }
  }

  private async submitTimeEntriesToDbcs(taskObject) {
    let result = false;
    try {
      let recordsToSubmit = await this.localService.getTimeDataToSubmit(taskObject.Task_Number);
      recordsToSubmit.map((item: any) => {
        item.Charge_Type = item.Charge_Type ? item.Charge_Type : "";
        item.isSubmitted = true;
      })
      let submitDataLength = recordsToSubmit.length;
      if (submitDataLength != 0) {
        this.valueProvider.setSyncStatus("Submitted");
        let res: any = await this.cloudService.submitTimeDbcs(this.transformProvider.changeTimeForMCS(Object.assign(Object.create(recordsToSubmit), recordsToSubmit)))
        if (res) {
          await this.localService.updateTimeSyncStatusOSC(recordsToSubmit, 'true');
          result = true;
        } else {
          // throw
        }
      } else {
        result = true;
      }
    } catch (error) {
      this.syncProvider.handleError(this.fileName, "submitTimeEntriesToDbcs", error);
      result = false;
    } finally {
      return result;
    }
  }
  displayOfflineError(fileName, fnName){
    let error;
    let customError = {
      "httpCode": "",
      "userMessage": "",
      "source": ""
    }

    customError["httpCode"] = Enums.errorCodes.unknownMessage,
    customError["userMessage"] = Enums.errorMessages.offlineConnectivity,
    customError["source"] = Enums.errorSource.connectivity
    error = JSON.parse(JSON.stringify(customError));
    
    
    let interruptSyncJson = {
      "errFile": fileName,
      "errFunction": fnName,
      "errMsg": error
    }
    this.syncProvider.errors.push(interruptSyncJson);    
  }

}
