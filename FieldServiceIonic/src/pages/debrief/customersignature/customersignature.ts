import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Events, App } from 'ionic-angular';//NavParams
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { ValueProvider } from '../../../providers/value/value';
import { SyncProvider } from '../../../providers/sync/sync';
import { UtilityProvider } from '../../../providers/utility/utility'
import { DatabaseProvider } from '../../../providers/database/database';
import { CreateFsrProvider } from '../../../providers/create-fsr/create-fsr';
import { LoggerProvider } from '../../../providers/logger/logger';
import { CloudService } from '../../../providers/cloud-service/cloud-service';
import * as Enums from '../../../enums/enums';
import * as moment from "moment";
import { LocalServiceSdrProvider } from '../../../providers/local-service-sdr/local-service-sdr';
import { SubmitProvider } from '../../../providers/sync/submit/submit';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-customersignature',
  templateUrl: 'customersignature.html',
})
export class CustomersignaturePage {

  taskId: any = this.valueProvider.getTaskId();
  resourceId: any = this.valueProvider.getResourceId();
  customerObject: any = {
    Customer_Id: this.taskId,
    Customer_Name: "",
    Job_responsibilty: "",
    Email: "",
    Task_Number: this.taskId,
    isCustomerSignChecked: false,
    customerComments: "",
    ResourceId: this.resourceId,
    Cust_Sign_File: "",
    Cust_Sign_Time: "",
    SSE_Rules: false,
    Safety_Rules: false,
    Remarks: "",
    Annuel_PdP: false,
    Specific_PdP: false,
    Working_license: false,
    Emerson_Safety: false,
    Home_Security: false,
    // do_not_survey: "",

  };
  engineerObject: any = {};
  isCorrect: boolean = true;
  notesArray: any = [];
  //surveyDecision: any = [{ "Value": "Yes" }, { "Value": "No" }];
  public taskObj = {};
  onVerify: boolean = false;
  contactArray: any = [];
  password: any;
  isPasswordError: any;
  enums: any;
  userPreferenceModalData: any;
  /*
  * 07/30/2018 Zohaib Khan
  * Changed Naming from showOrHideCustomerComments to ShowCustomerComments.
  */
  ShowCustomerComments: boolean;
  showHideCheckBox: boolean = true;
  disableSubmit: boolean = true;
  noteType: boolean = true;
  fileName: any = 'CustomersignaturePage';
  dateFormat: any;
  sse_rules = false;
  safety_rules = false;
  remarks: any;
  annuel_pdp = false;
  spec_pdp = false;
  working_license = false;
  emerson_safety = false;
  home_security = false;
  // decision: any;
  isPrintEUISOCHecked = false;
  //doNotSurvey = false;
  isContactSelected = false;
  getTask: any;
  _taskObj: any;
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  constructor(public events: Events, public appCtrl: App,
    public localServicesdr: LocalServiceSdrProvider, public cloudService: CloudService, public navCtrl: NavController, private createfsr: CreateFsrProvider, private syncProvider: SyncProvider, private submitProvider: SubmitProvider, private utilityProvider: UtilityProvider, private valueProvider: ValueProvider, public localService: LocalServiceProvider, public dbCtrl: DatabaseProvider, public logger: LoggerProvider) {
    this.enums = Enums;
    this._taskObj = this.valueProvider.getTask();
  }

  public signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 1440,
    'canvasHeight': 200
  };

  ionViewDidEnter() {
    //11/04/2019 -- Mayur Varshney -- apply condition if viewCtrl relates to SDRTabsPage or DebriefPage
    if (this.navCtrl.parent.viewCtrl.id != "DebriefPage") return;
    this.events.subscribe('refreshPreferences', (res) => {
      this.seteuISOFlag();
    });
    //let self = this;
    this.seteuISOFlag();
    if (this.valueProvider.getUserPreferences()[0]) {
      if (String(this.valueProvider.getUserPreferences()[0].FSR_PrintEUISO) == "true") {
        this.isPrintEUISOCHecked = true;
      } else { this.isPrintEUISOCHecked = false; }
    }
    this.customerObject.isCustomerSignChecked = false;
    if (this.valueProvider.getUserPreferences()[0]) {
      this.dateFormat = this.valueProvider.getUserPreferences()[0].Date_Format;
    }
    else {
      this.dateFormat = "";
    }
    this.onVerify = this.valueProvider.getVerify();
    if (this.onVerify) {
      let params = {};
      let verifyModal = this.utilityProvider.showModal("VerifyPasswordPage", params, {
        enableBackdropDismiss: false,
        cssClass: 'VerifyPasswordPage'
      });
      verifyModal.onDidDismiss(data => {
        if (data) {
          this.valueProvider.setIsCustomerSelected(false);
          this.valueProvider.setVerify(false);
          this.navCtrl.parent.select(this.valueProvider.getTabDetails().index);
          this.valueProvider.setPageOnVerify("");
        } else {
          this.valueProvider.setVerify(false);
          this.refreshPage();
        }
      });
      verifyModal.present();

    }
    this.taskId = this.valueProvider.getTaskId();
    this.resourceId = this.valueProvider.getResourceId();
    this.getCustomer();
    this.getEngineer();
    this.getNotes();
    this.getTaskInfo();
    this.drawClear();
    // this.contactArray = this.valueProvider.getContact();
    // this.valueProvider.setContactList(this.valueProvider.getContact());
    this.ShowCustomerComments = false;
    this.customerObject.customerComments = "";
  }

  drawClear() {
    if (this.signaturePad != undefined || this.signaturePad != null) {
      this.signaturePad.clear();
    }
    this.customerObject.Cust_Sign_Time = "";
    this.showHideCheckBox = true;
    this.disableSubmit = true;
  }

  // hidecheckbox() {
  //   this.showHideCheckBox = false;
  // }

  getCustomer() {
    this.localService.getCustomer(this.taskId).then((res: any[]) => {
      if (res != undefined) {
        this.customerObject = res;
      }
      this.drawClear();
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getCustomer', 'Error in getCustomer : ' + JSON.stringify(error));
    });
  }

  gottoSummary() {
    this.navCtrl.parent.select(6);
  }

  refreshPage() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  // SelectContactFields(value) {
  //   this.isContactSelected = true;
  //   let FilteredContact = this.valueProvider.getContactList().filter((item) => {
  //     return item.Contact_Name == value;
  //   });
  //   this.customerObject.Email = FilteredContact[0].Email;
  //   this.customerObject.Contact_Name = FilteredContact[0].Contact_Name;
  // }

  // addContactModal() {
  //   let contactObj: any = {};
  //   let AddContactModal = this.utilityProvider.showModal("AddContactModalPage", '', { enableBackdropDismiss: true, cssClass: 'AddContactModalPage' });
  //   AddContactModal.onDidDismiss((data) => {
  //     if (data != undefined) {
  //       this.utilityProvider.showSpinner();
  //       contactObj = data;
  //       this.localService.insertContact(contactObj).then((res) => {
  //         this.localService.getContactList(this.valueProvider.getTaskId()).then((res: any[]) => {
  //           this.valueProvider.setContactList(res);
  //           let latestContact = this.valueProvider.getContactList().filter((item) => {
  //             return item.Email == contactObj.Email;
  //           });
  //     this.syncProvider.submitContactList(latestContact).then((res) => {
  //             this.utilityProvider.stopSpinner();
  //           }).catch((err) => {
  //             this.logger.log(this.fileName, "addContactModal", JSON.stringify(err));
  //           });
  //         }).catch((err) => {
  //           this.logger.log(this.fileName, "addContactModal", JSON.stringify(err));
  //         });
  //       }).catch((err) => {
  //         this.logger.log(this.fileName, "addContactModal", JSON.stringify(err));
  //       });
  //     }
  //   });
  //   AddContactModal.present();
  // }
  /**
   * 07/18/2018 Zohaib Khan
   * If statement added to check if user wants to see the user preferences modal or not
   * @memberof CustomersignaturePage
   */
  async submitsignature(jobStatus) {
    try {
      if (String(this.valueProvider.getUserPreferences()[0].Do_Not_Show_Modal) == "false") {
        let userPreferenceModal = this.utilityProvider.showModal("UserPreferencesModalPage", '', { enableBackdropDismiss: true, cssClass: 'UserPreferencesPage' });
        userPreferenceModal.present();
        userPreferenceModal.onDidDismiss(data => {
          this.userPreferenceModalData = data;
          if (data) {
            // 03-07-2018 GS: Moved Analytics code to sync.ts
            this.submitData(jobStatus);
          }
        });
      } else {
        this.valueProvider.setUserFSRPreferences(null);
        this.submitData(jobStatus);
      }
    } catch (error) {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'submitsignature', 'Error in submitsignature : ' + JSON.stringify(error));
    }
  }

  updateCustTime(event) {
    if (event) {
      this.customerObject.isCustomerSignChecked = false;
      if (!this.ShowCustomerComments) {
        this.customerObject.Cust_Sign_Time = new Date();
      }
      this.disableSubmit = false;
    } else {
      this.customerObject.Cust_Sign_Time = "";
    }
  }

  showCustomerComments(event) {
    if (event.value) {
      this.ShowCustomerComments = true;
    }
    else {
      this.ShowCustomerComments = false;
      this.customerObject.customerComments = "";
      setTimeout(() => {
        // 08/15/2018 Zohaib Khna: called drawClear to clear signature pad when able to obtain signature
        this.drawClear();
        // this.signaturePad.clear();
      }, 300);
    }
  }

  async submitData(jobStatus) {
    let self = this;
    this.utilityProvider.showSpinner();
    if (this.utilityProvider.isConnected() && this.valueProvider.getTask().IsStandalone == 'false') {
      // this.utilityProvider.showSpinner();
      // let checkTask = await this.submitProvider.checkTaskAtOSC(this.valueProvider.getTask());
      // if (checkTask) {
      //   this.utilityProvider.stopSpinner();
      //   return this.submitProvider.displayErrors(checkTask);
      // }
    }

    if (this.signaturePad != undefined || this.signaturePad != null) {
      this.customerObject.Cust_Sign_File = this.signaturePad.toDataURL();
    }
    // if (this.decision == "Yes") {
    //   this.doNotSurvey = true;
    // } else {
    //   this.doNotSurvey = false;
    // }
    //  this.customerObject.do_not_survey = this.doNotSurvey;
    this.customerObject.SSE_Rules = this.sse_rules;
    this.customerObject.Safety_Rules = this.safety_rules;
    this.customerObject.Remarks = this.remarks ? this.remarks : "";
    this.customerObject.Annuel_PdP = this.annuel_pdp;
    this.customerObject.Specific_PdP = this.spec_pdp;
    this.customerObject.Working_license = this.working_license;
    this.customerObject.Emerson_Safety = this.emerson_safety;
    this.customerObject.Home_Security = this.home_security;
    this.localService.insertCustomerList(this.customerObject).then((res: any[]) => {
      this.valueProvider.setCustomer(this.customerObject);
      this.submit(jobStatus);
    }).catch((error: any) => {
      self.logger.log(self.fileName, 'submitsignature', 'Error in submitsignature : ' + JSON.stringify(error));
    });
  }

  getEngineer() {
    this.engineerObject = this.valueProvider.getEngineer();
  }

  getTaskInfo() {
    this.taskObj = this.valueProvider.getTask();
  }

  getNotes() {
    this.notesArray = this.valueProvider.getNote();
    let Notetype = this.notesArray.filter((item) => {
      return item.Note_Type == "Action Taken"
    });
    if (Notetype.length == 0) {
      this.noteType = true;
    }
    else {
      this.noteType = false;
    }
  }

  gottoEmersonSignature() {
    this.navCtrl.parent.select(5);
  }

  gottoNotes() {
    this.navCtrl.parent.select(4);
  }

  async submit(jobStatus) {
    try {
      let reportStatus = jobStatus == 'OnSite' ? "OnsiteDebrief" : "CompletedDebrief";
      if (this.valueProvider.getUserFSRPreferences() && String(this.valueProvider.getUserFSRPreferences().FSR_PrintExpense) == 'true') {
        this.valueProvider.getTask().FSR_PrintExpenseOnSite = 'true';
      } else if (!this.valueProvider.getUserFSRPreferences() && String(this.valueProvider.getUserPreferences()[0].FSR_PrintExpense) == 'true') {
        this.valueProvider.getTask().FSR_PrintExpenseOnSite = 'true';
      } else {
        this.valueProvider.getTask().FSR_PrintExpenseOnSite = 'false';
      }
      if (this.valueProvider.getUserFSRPreferences() && String(this.valueProvider.getUserFSRPreferences().FSR_PrintExpenseComplete) == 'true') {
        this.valueProvider.getTask().FSR_PrintExpenseComplete = 'true';
      } else if (!this.valueProvider.getUserFSRPreferences() && String(this.valueProvider.getUserPreferences()[0].FSR_PrintExpenseComplete) == 'true') {
        this.valueProvider.getTask().FSR_PrintExpenseComplete = 'true';
      } else {
        this.valueProvider.getTask().FSR_PrintExpenseComplete = 'false';
      }
      await this.localService.updateExpenseflagInTask(this.valueProvider.getTask());

      let res = await this.localService.getTask();
      this.valueProvider.setTaskObject(res[0]);
      //let selectedTask = this.valueProvider.getTask();
      let promiseArr = [];
      //09/13/2018 Zohaib Khan: Generating FSR based on Fsr Print languages
      let printLang = this.valueProvider.getUserPreferences()[0].FSR_Languages;
      // let PrintLangArr = printLang.split(',');

      // 03/07/2019 -- Mayur Varshney -- Removing Duplicate lang if there are.
      let PrintLangArr = this.utilityProvider.removeDuplicateItemFromArray(printLang.split(','));
      let resp;
      try {
        console.log("Start Pdf Make Here- " + moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss"))
        for (var i = 0; i < PrintLangArr.length; i++) {
          promiseArr.push(this.createfsr.generatepdf(PrintLangArr[i], false, "CustomersignaturePage", reportStatus));
        }
        resp = await Promise.all(promiseArr);
        console.log("Finshed Pdf Make Here- " + moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss"))
      } catch (error) {
        this.logger.log(this.fileName, 'submit', 'Error in submit : ' + error.message);
        this.utilityProvider.stopSpinner();
        let msg = 'Error Occured while generating PDF!';
        this.utilityProvider.presentToast(msg, 2000, 'top', 'feedbackToast');
        throw error;
      }
      //09/13/2013 Zohaib Khan: Inserting fsr to Attachment table with Attachment type=fsr
      for (var j = 0; j < resp.length; j++) {
        if (resp[j] != undefined) {
          let fsrAttachmentObject: any = {};
          fsrAttachmentObject.File_Name = resp[j];
          fsrAttachmentObject.AttachmentType = "fsr";
          fsrAttachmentObject.Task_Number = this.valueProvider.getTaskId();
          // 02/12/2019 -- Mayur Varshney -- add attachment_id, file_type, file_path, created_date for FSR in attachment table
          fsrAttachmentObject.Attachment_Id = this.utilityProvider.getUniqueKey();
          fsrAttachmentObject.File_Type = "application/pdf";
          fsrAttachmentObject.File_Path = cordova.file.dataDirectory + 'taskfiles/' + this.valueProvider.getTaskId();
          fsrAttachmentObject.Created_Date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
          this.localService.insertAttachment(fsrAttachmentObject);
        }
      }
      // 04/29/2019 -- Mayur Varshney -- create temp variable to set date in Date and DebriefSubmissionDate
      let tempDate = new Date();
      // 08-22-2018 GS: Added check for Online, if offline update the status as Completed in DB
      if (jobStatus == 'OnSite') {
        this.valueProvider.getTask().Task_Status = 'Debrief In Progress';
        this.valueProvider.getTask().StatusID = Enums.Jobstatus.Debrief_In_Progress;
      } else {
        this.valueProvider.getTask().Task_Status = 'Completed-Awaiting Review';
        this.valueProvider.getTask().StatusID = Enums.Jobstatus.Completed_Awaiting_Review;
        this.valueProvider.getTask().DebriefSubmissionDate = moment.utc(tempDate).format("YYYY-MM-DDTHH:mm:ss.000Z");
      }
      this.valueProvider.getTask().Sync_Status = 'false';
      this.valueProvider.getTask().Date = tempDate;
      this.valueProvider.getTask().IsDeclined = 'false';
      // Parvinder todo
      await this.localService.updateTaskStatusLocal(this.valueProvider.getTask());
      await this.localService.updateTimeStatusOnjobNumber(this.valueProvider.getTask().Task_Number);
      this.valueProvider.setTaskObject(this.valueProvider.getTask());

      //09/25/2018: Zohaib Khan : making object to insert Task change log.
      let TaskChangeLogObject: any = {
        CreatedTime: "",
        UpdatedTime: new Date(),
        UpdatedByAccount: this.valueProvider.getUser().Email,
        CreatedByAccount: "",
        FieldJob: this.valueProvider.getTaskId(),
        // 10/15/2018 -- Mayur Varshney -- passed resourceId to changelog for submit staging data
        ResourceId: this.valueProvider.getResourceId(),
        Technician: this.valueProvider.getUser().Name,
        Timestamp: new Date(),
        Sync_Status: false
      }
      //09/25/2018: Zohaib Khan Getting task change log based on maximum ids to insert into next entry
      if (jobStatus == "OnSite") {
        TaskChangeLogObject.ID = this.utilityProvider.getUniqueKey();
        TaskChangeLogObject.Status = Enums.Jobstatus.Job_Completed;
        reportStatus = "OnsiteDebrief";
        //10/11/2018 Zohaib Khan: Inserting 1 entry for job_completed into staging table if user clicks on onSite.
        await this.localService.insertTaskChangeLog(TaskChangeLogObject);
        TaskChangeLogObject.ID = this.utilityProvider.getUniqueKey();
        TaskChangeLogObject.Status = Enums.Jobstatus.Debrief_In_Progress;
      }
      if (jobStatus == "Completed") {
        TaskChangeLogObject.ID = this.utilityProvider.getUniqueKey();
        TaskChangeLogObject.Status = Enums.Jobstatus.Completed_Awaiting_Review;
        reportStatus = "CompletedDebrief";
      }

      await this.localService.insertTaskChangeLog(TaskChangeLogObject);
      this.valueProvider.setTaskData(TaskChangeLogObject);
      if (this.valueProvider.getTask().IsStandalone == 'false') {
        this.submitDebrief(jobStatus);
      } else {
        // 01-09-2019 -- Mansi Arora -- get current job and update status in submitted reports
        // let currentReport = this.valueProvider.getCurrentReport();
        // 01-09-2019 -- Mansi Arora -- mark complete only if its FCR
        if (this.valueProvider.getTask().Selected_Process == Enums.Selected_Process.FCR) {
          try {
            await this.localServicesdr.updateReport(this.valueProvider.getTask().ReportID, Enums.ReportStatus.Completed);
            if (this.utilityProvider.isConnected()) {

              if (this.syncProvider.isAutoSyncing) {
                this.openSummaryPage();
                this.submitProvider.savePendingSDRReports();
                sessionStorage.setItem("getPendingOperations", 'true');
                return true;
              }
              // 07/10/2019 Gurkirat Singh : Added fromSync parameter as false which is used to queue the submit if sync is already running
              //this.syncProvider.submitPendingReports(false, this.valueProvider.getTask().ReportID).then(() => {
              await this.submitProvider.submitPendingSDRReports(false, this.valueProvider.getTask().ReportID);
            }
            this.openSummaryPage();
          } catch (error) {
            this.logger.log(this.fileName, "submitReport", "Error Occured while Updating Status: " + error.message);
            this.utilityProvider.stopSpinner();
            this.utilityProvider.presentToast(Enums.Messages.Status_Update_Failed, 4000, 'top', 'feedbackToast');
            throw error;
          }
        } else {
          await this.localService.setIsSubmitted(this.valueProvider.getTask().Job_Number)
          this.openSummaryPage();
        }
      }
    } catch (error) {
      this.logger.log(this.fileName, "submitReport", "Error: " + error.message);
      this.utilityProvider.stopSpinner();
    }
  }

  openSummaryPage() {
    this.valueProvider.setUserFSRPreferences(null);
    this.appCtrl.getRootNav().setRoot('SummaryPage', { ifCompleted: true });
    this.utilityProvider.stopSpinner();
  }

  /**
   * Wrapper to integrate the left part of execution when we put the same funtion into Queue
   * Rajat 
   */
  activityAfterDebrief(jobStatus) {
    this.valueProvider.setUserFSRPreferences(null);
    if (jobStatus == 'OnSite') {
      this.navCtrl.push("SummaryPage");
      this.navCtrl.parent.select(6);
    } else {
      this.appCtrl.getRootNav().setRoot('SummaryPage', { ifCompleted: true });
    }
    this.utilityProvider.stopSpinner();
  }

  async submitDebrief(jobStatus) {
    try {
      this.logger.log(this.fileName, 'submitDebrief', "jobStatus : " + jobStatus);

      if (this.utilityProvider.isConnected()) {

        if (this.syncProvider.isAutoSyncing) {
          this.activityAfterDebrief(jobStatus);
          this.submitProvider.submitPromisesForOscTask();
          sessionStorage.setItem("getPendingOperations", 'true');
          return true;
        }

        let result = await this.syncProvider.validateUserDeviceAndToken();
        if (result) {
          await this.submitProvider.submitDebriefForTask(this.valueProvider.getTask(), "Online", false);
          this.cloudService.flushAnalyticsEvents();
          this.localService.refreshTaskList();
          this.valueProvider.setUserFSRPreferences(null);
          this.events.publish("refreshPreferences", null);
          if (jobStatus == 'OnSite') {
            this.navCtrl.push("SummaryPage");
            this.navCtrl.parent.select(6);
          } else {
            this.appCtrl.getRootNav().setRoot('SummaryPage', { ifCompleted: true });
          }
        }
        this.utilityProvider.stopSpinner();
      } else {
        this.valueProvider.setUserFSRPreferences(null);
        if (jobStatus == 'OnSite') {
          this.navCtrl.push("SummaryPage");
          this.navCtrl.parent.select(6);
        } else {
          this.appCtrl.getRootNav().setRoot('SummaryPage', { ifCompleted: true });
        }
      }
    } catch (error) {
      this.logger.log(this.fileName, "submitDebrief", "Error: " + error.message);
    } finally {
      this.utilityProvider.stopSpinner();
    }
  }


  validateEmail(email) {
    let condition = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    this.isCorrect = condition.test(email);
    return condition.test(email);
  }

  //check character limit for description , should be less than 255 / Mayur
  _keyPressInText(event: any) {
    if (event.target.textLength > 254) {
      event.preventDefault();
    }
  }

  //08/22/2018 Zohaib Khan: Setting euiso flag
  seteuISOFlag() {
    if (this.valueProvider.getUserPreferences()[0]) {
      if (String(this.valueProvider.getUserPreferences()[0].FSR_PrintEUISO) == "true") {
        this.isPrintEUISOCHecked = true;
      } else { this.isPrintEUISOCHecked = false; }
    }
  }

  // declineDebrief() {
  //   let TaskChangeLogObject: any = {
  //     TaskID: this.valueProvider.getTaskId(),
  //     UpdatedBy: this.valueProvider.getUser().Name,
  //     Sync_Status: this.utilityProvider.isConnected(),
  //     ResourceId: this.valueProvider.getResourceId(),
  //     TimeStampUpdatedTo: new Date()
  //   }
  //   this.localService.getMaxIdDataFromTaskChangeLog().then((res: any) => {
  //     TaskChangeLogObject.StatusUpdatedTo = Enums.Jobstatus.Debrief_Declined
  //     TaskChangeLogObject.StatusUpdatedFrom = res[0].StatusUpdatedTo;
  //     TaskChangeLogObject.TimeStampUpdatedFrom = res[0].TimeStampUpdatedTo;
  //     TaskChangeLogObject.Duration = this.utilityProvider.getDuration(TaskChangeLogObject.TimeStampUpdatedTo, TaskChangeLogObject.TimeStampUpdatedFrom);
  //     this.localService.insertTaskChangeLog(TaskChangeLogObject).then(res => {
  //       this.logger.log(this.fileName, "declineDebrief", "TaskChangeLog Inserted");
  //      });
  //   });
  // }



  /**
   *@author: Prateek(21/01/2019)
   *Unsubscribe all events.
   *Optimization
   * @memberof CalendarPage
   */
  ionViewWillLeave(): void {
    this.events.unsubscribe('refreshPreferences');

  }

  /**
   * @author Gurkirat Singh
   * 03-28-2019 Gurkirat Singh : Publish an event to navigate to SDR Flow
   *
   * @memberof CustomersignaturePage
   */
  gotoSDR() {
    this.events.publish("gotoSDR");
  }
}
