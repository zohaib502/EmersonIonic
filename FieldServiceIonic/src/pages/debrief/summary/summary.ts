import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Platform, MenuController, Events, App } from 'ionic-angular';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { ValueProvider } from '../../../providers/value/value';
import { UtilityProvider } from '../../../providers/utility/utility';
import { CreateFsrProvider } from '../../../providers/create-fsr/create-fsr';
import { TransformProvider } from '../../../providers/transform/transform';
import { DomSanitizer } from '@angular/platform-browser';
import { LoggerProvider } from '../../../providers/logger/logger';
// import * as moment from "moment";  08/30/2018 - Suraj Gorai- Remove unused call
// import { EmailComposer } from '@ionic-native/email-composer';
// import { Base64 } from '@ionic-native/base64';  26-7-18, Suraj Gorai, Remove Base64 plugin
import { Device } from '@ionic-native/device';
declare var cordova: any;
import * as Enums from '../../../enums/enums';
import { CloudService } from '../../../providers/cloud-service/cloud-service';
import { SyncProvider } from '../../../providers/sync/sync';
import moment from 'moment-timezone';
import { SubmitProvider } from '../../../providers/sync/submit/submit';

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {
  public installBaseList = [];
  public taskObj: any = {};
  public timeArray = [];
  public attachmentList = [];
  public taskId;
  public resourceId;
  materialArray: any = {};
  materialArrayClone: any = {};
  serial_Items: any[] = [];
  noteArraySummary: any[] = [];
  public engineer: any = {};
  userType: any;
  public customer = {};
  attachmentArraySummary = [];
  engineerSignature: any;
  aftercustomersignature: boolean;
  taskDetails = {};
  onVerify: boolean = false;
  taskStatus: any;
  taskStatusId: any;
  selectedProcess: any;
  header_data: any;
  fileName: any = 'Summary_Page';
  locked: boolean = false;
  ifCompleted: any;
  page: any;
  devicePlatform: any;
  filePath: any;
  mainFilePath: any;
  FSRPrintLanguages: any;
  enums: any;
  _taskObj: any;
  isClarityUser: any = false;
  disablePdfButton: boolean = false;
  timeout: any;
  constructor(private syncProvider: SyncProvider, private submitProvider: SubmitProvider, public cloudService: CloudService, public navParams: NavParams, public appCtrl: App, public fsrProvider: CreateFsrProvider, private ngZone: NgZone, public sanitizer: DomSanitizer, public viewCtrl: ViewController, public navCtrl: NavController, public plt: Platform, private valueProvider: ValueProvider, public localService: LocalServiceProvider, public utilityProvider: UtilityProvider, public modalController: ModalController, public transformProvider: TransformProvider, public logger: LoggerProvider, public menuController: MenuController, public events: Events, public platform: Platform, public device: Device) {
    this.devicePlatform = this.device.platform.toLowerCase();
    this.header_data = { title1: "Debrief", title2: "Job #", taskId: this.valueProvider.getTask().Job_Number ? this.valueProvider.getTask().Job_Number : this.valueProvider.getTask().Task_Number };
    this.sideMenuView("Debrief");
    // 08/10/2018 Zohaib Khan: Updated both path. One is for Thumnails other one is for actual attachment.
    this.filePath = cordova.file.dataDirectory + "/taskfiles/" + this.valueProvider.getTaskId() + '/thumbnails/';
    this.mainFilePath = cordova.file.dataDirectory + "/taskfiles/" + this.valueProvider.getTaskId() + '/';
    this.enums = Enums;
    //11/28/2018 Zohaib Khan: Added Event to update the data dynamically.

    this._taskObj = this.valueProvider.getTask();
  }

  gottoEmersonSignature() {
    this.navCtrl.parent.select(5);
  }

  gottoCustomerSignature() {
    this.navCtrl.parent.select(7);
  }

  ionViewDidEnter() {
    //11/04/2019 -- Mayur Varshney -- apply condition if viewCtrl relates to SDRTabsPage or DebriefPage
    if (this.navCtrl.parent && this.navCtrl.parent.viewCtrl.id != "DebriefPage") return;
    //Prateek(23/01/2019) Shifted all events in didenter.
    this.isClarityUser = this.valueProvider.getUser().ClarityID ? true : false;
    this.events.subscribe('refreshPreferences', (res) => {
      this.getAllOriginalModifiedAndAdditionalEntries();
    });
    this.localService.getTask().then(res => {
      this.taskStatus = res[0].Task_Status;
      this.taskStatusId = res[0].StatusID;
      // 11/11/2018 -- Mayur Varshney -- get selected process for displaying SDR button
      this.selectedProcess = res[0].Selected_Process;
      this.taskObj = res[0];
      // Called Load Data in .then Call since load Data function is dependent
      this.loadData();
    });
    this.securityPopUp();
    this.verifyIndex();
  }

  async loadData() {
    this.taskId = this.valueProvider.getTaskId();
    this.userType = this.valueProvider.getUserType().clarityType;
    this.ifCompleted = this.navParams.get('ifCompleted');
    await this.getAllOriginalModifiedAndAdditionalEntries()
    await this.getFSRPrintLang();
    await this.getInstallBaseInfo();
    await this.getAttachmentlist();
    await this.getEngineer();
    await this.getCustomer();
    await this.getNoteList();
  }

  verifyIndex() {
    let index = this.navCtrl.getActive().index;
    this.page = this.navParams.get('page');
    if (index % 3 == 0) {
      if (this.page == 'calender') {
        for (let i = index; i > 1; i--) {
          index = index - 1;
        }
        this.navCtrl.remove(index, 2);
      }
      else {
        for (let i = index; i > 1; i--) {
          index = index - 1;
        }
        this.navCtrl.remove(index, 2);
      }
    }
    if (index % 2 == 0) {
      if (this.page == 'calender') {
        for (let i = index; i > 1; i--) {
          index = index - 1;
        }
        this.navCtrl.remove(index, 1);
      } else {
        for (let i = index; i > 1; i--) {
          index = index - 1;
        }
        this.navCtrl.remove(index, 1);
      }
    }
  }

  securityPopUp() {
    this.onVerify = this.valueProvider.getVerify();
    if (this.onVerify) {
      let params = {};
      let verifyModal = this.utilityProvider.showModal("VerifyPasswordPage", params, { enableBackdropDismiss: false, cssClass: 'VerifyPasswordPage' });
      verifyModal.onDidDismiss(data => {
        if (data) {
          this.valueProvider.setIsSummarySelected(false);
          this.valueProvider.setVerify(false);
          this.navCtrl.parent.select(this.valueProvider.getTabDetails().index);
          this.valueProvider.setPageOnVerify("");
        }
        else {
          this.valueProvider.setVerify(false);
          this.refreshPage();
        }
      });
      verifyModal.present();
    }
  }

  sideMenuView(user) {
    this.events.publish('user:created', user);
    //this.loadData();
  }

  refreshPage() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
    this.viewCtrl._didEnter();
  }

  getNoteList() {
    //10/30/2018 kamal: applied filter for removing note type created from OSC
    let filteredNotes: any = []
    return new Promise((resolve, reject) => {
      // 12-03-2018 -- Mansi Arora -- Sort Notes in FSR in Ascending order of creation (The order may differ due to different groups being printed in some particular order)
      filteredNotes = this.valueProvider.getNote().filter((item) => {
        return item.Note_Type != null;
      }).sort(function (a, b) {
        let dateA: any = new Date(a.Date), dateB: any = new Date(b.Date)
        return dateA - dateB //sort by date ascending
      });
      this.noteArraySummary = filteredNotes;
      if (this.noteArraySummary.length == 0) {
        this.localService.getNotesList(String(this.valueProvider.getTaskId())).then((res: any[]) => {
          // 12-03-2018 -- Mansi Arora -- Sort Notes in FSR in Ascending order of creation (The order may differ due to different groups being printed in some particular order)
          filteredNotes = res.filter((item) => {
            return item.Note_Type != null;
          }).sort(function (a, b) {
            let dateA: any = new Date(a.Date), dateB: any = new Date(b.Date)
            return dateA - dateB //sort by date ascending
          });
          this.noteArraySummary = filteredNotes;
          resolve(res);
        }).catch((error: any) => {
          this.logger.log(this.fileName, 'getNoteList', 'Error in getNoteList : ' + JSON.stringify(error));
        });
      } else {
        // 12-03-2018 -- Mansi Arora -- Sort Notes in FSR in Ascending order of creation (The order may differ due to different groups being printed in some particular order)
        resolve(this.valueProvider.getNote().sort(function (a, b) {
          let dateA: any = new Date(a.Date), dateB: any = new Date(b.Date)
          return dateA - dateB //sort by date ascending
        }));
      }
    });
  }

  getInstallBaseInfo() {
    this.localService.getInstallBaseList(this.taskId).then((res: any) => {
      this.installBaseList = res
    }).catch(err => {
      this.logger.log(this.fileName, 'getInstallBaseInfo', 'Error in getInstallBaseInfo : ' + JSON.stringify(err));
    })
  }

  /**Shivansh Subnani 09/03/2019
  *Returns Current Taskobj on the basis of taskid
  * Removed the use of getting taskObj from Valueprovider
  * @memberof SummaryPage
  */
  // getTaskListInfo() {

  //   this.taskId = this.valueProvider.getTaskId();
  //   //let taskobj = this.valueProvider.getTaskList().filter((item => { return item.Task_Number == this.taskId }))[0];
  //   // this.taskObj = this.valueProvider.getTask();
  //   // console.log("this.taskObj", this.taskObj);
  // }

  /**
   * get material on the basis of IsAdditional and IsOriginal
   * groupby material on the basis of material_id
   * @param {any} material
   * @author Mayur Varshney
   * @memberOf SummaryPage
   */
  getMaterialList(material) {
    this.materialArray = material.filter(item => {
      return item.IsAdditional == 'false' && !item.Original;
    });
    this.materialArrayClone = this.utilityProvider.groupBy(this.materialArray.reverse(), function (item) {
      return [item.Material_Id];
    });
    this.valueProvider.setMaterialForDisplay(this.materialArrayClone);
  }


  async gettimelist(time) {
    //10/23/2018 Zohaib Khan: Called local service only once to get the time list for original modified and additional entries
    //11/28/2018 Zohaib Khan: In UP if Show Non-Billable entries is checked than show break entries elso dont show them.
    if (String(this.valueProvider.getUserPreferences()[0].ShowNonBillableEntries) == 'false' || (this.valueProvider.getUserFSRPreferences() && String(this.valueProvider.getUserFSRPreferences().ShowNonBillableEntries) == 'false')) {
      this.timeArray = Object.assign([], time).filter(item => {
        return item.IsAdditional == 'false' && !item.Original && item.Work_Type != 'Break';
      });
    } else {
      this.timeArray = Object.assign([], time).filter(item => {
        return item.IsAdditional == 'false' && !item.Original;
      });
    }
    // for (let i = 0; i < this.timeArray.length; i++) {
    //   //this.timeArray[i].Service_Start_Date = new Date(this.timeArray[i].Service_Start_Date);
    //   // console.log("TIME", this.timeArray[i].Service_Start_Date);

    // }
    // if (this.valueProvider.getResourceId() == "0") {
      this.utilityProvider.sortTimeArray(this.timeArray);
      // this.timeArray.sort((a, b) => {
      //   let dateStart = this.utilityProvider.formatDateTime(a.EntryDate, a.Start_Time);
      //   let dateEnd = this.utilityProvider.formatDateTime(b.EntryDate, b.Start_Time);
      //   if (moment(dateStart).isAfter(dateEnd)) {
      //     return 1;
      //   }
      //   if (moment(dateStart).isBefore(dateEnd)) {
      //     return -1;
      //   }
      //   return 0;
      // });
    // }
    // else {
    //   this.utilityProvider.sortTimeArray(this.timeArray);
    // }

    // let timeCodeValue = this.valueProvider.getOverTime();
    // Work_Type is set as GRAND TOTAL to show on the page only
    //08062018 KW START changed Date to Service_Start_Date
    // previous code let grandtimeObject = { "Date": "Grand Total", "Work_Type": "", "Duration": "", "hours": 0, "mins": 0 };
    //               let subtotalObject = { "Date": "Sub Total", "Work_Type": "", "Duration": "", "hours": 0, "mins": 0 };

    let grandtimeObject = { "Service_Start_Date": "Grand Total", "Work_Type": "", "Duration": "", "hours": 0, "mins": 0 };
    // Date is set as SUB TOTAL to show on the page only
    let subtotalObject = { "Service_Start_Date": "Sub Total", "Work_Type": "", "Duration": "", "hours": 0, "mins": 0 };
    //END
    let subTotalArray = [];
    this.timeArray.forEach((key, value) => {

      if (key.Work_Type != "Break") {
        // console.log(key);
        grandtimeObject.Duration = this.calculateDuration(grandtimeObject, key);
        grandtimeObject.Duration = this.formatDuration(grandtimeObject.Duration);
        let workTypeSubTotal = subTotalArray.filter((obj) => { return obj.Work_Type == key.Work_Type });
        if (workTypeSubTotal.length == 1) {
          let index = subTotalArray.indexOf(workTypeSubTotal[0]);
          subTotalArray[index].Duration = this.calculateDuration(subTotalArray[index], key);
          subTotalArray[index].Duration = this.formatDuration(subTotalArray[index].Duration);
        } else {
          let subtotal = Object.assign({}, subtotalObject);
          subtotal.Work_Type = key.Work_Type;
          subtotal.Duration = this.calculateDuration(subtotal, key);
          subtotal.Duration = this.formatDuration(subtotal.Duration);
          subTotalArray.push(subtotal);
        }
      }
    });
    if (this.timeArray.length > 0) {
      this.timeArray = this.timeArray.concat(subTotalArray);
      this.timeArray.push(grandtimeObject);
    }
    await this.sortTimeEntries(this.timeArray);
    await this.set24HoursTimePreview(this.timeArray);
    this.valueProvider.setTimeForDisplay(this.timeArray);
    //});
  }

  async getTimeWithoutBreak(time) {
    let withOutBreakTime = JSON.parse(JSON.stringify(time)).filter(item => {
      return item.IsAdditional == 'false' && !item.Original && item.Work_Type != 'Break';
    });
     this.utilityProvider.sortTimeArray(withOutBreakTime);

    let grandtimeObject = { "Service_Start_Date": "Grand Total", "Work_Type": "", "Duration": "", "hours": 0, "mins": 0 };
    // Date is set as SUB TOTAL to show on the page only
    let subtotalObject = { "Service_Start_Date": "Sub Total", "Work_Type": "", "Duration": "", "hours": 0, "mins": 0 };
    //END
    let subTotalArray = [];
    withOutBreakTime.forEach((key, value) => {
      grandtimeObject.Duration = this.calculateDuration(grandtimeObject, key);
      grandtimeObject.Duration = this.formatDuration(grandtimeObject.Duration);
      let workTypeSubTotal = subTotalArray.filter((obj) => { return obj.Work_Type == key.Work_Type });
      if (workTypeSubTotal.length == 1) {
        let index = subTotalArray.indexOf(workTypeSubTotal[0]);
        subTotalArray[index].Duration = this.calculateDuration(subTotalArray[index], key);
        subTotalArray[index].Duration = this.formatDuration(subTotalArray[index].Duration);
      } else {
        let subtotal = Object.assign({}, subtotalObject);
        subtotal.Work_Type = key.Work_Type;
        subtotal.Duration = this.calculateDuration(subtotal, key);
        subtotal.Duration = this.formatDuration(subtotal.Duration);
        subTotalArray.push(subtotal);
      }
    });
    if (withOutBreakTime.length > 0) {
      withOutBreakTime = withOutBreakTime.concat(subTotalArray);
      withOutBreakTime.push(grandtimeObject);
    }
    await this.sortTimeEntries(withOutBreakTime);
    await this.set24HoursTimePreview(withOutBreakTime);
    this.valueProvider.setTimeForDisplayWithoutBreak(withOutBreakTime);
  }

  getEngineer() {
    // 12/09/2018 -- Zohaib -- Signature are not visible on summary and FSR
    this.localService.getEngineer(this.taskObj.Task_Number).then((res) => {
      this.engineer = res;
      this.valueProvider.setEngineer(this.engineer);
    });
    //this.logger.log(this.fileName, 'getEngineer', JSON.stringify(this.engineer));
  }

  getCustomer() {
    // 03/07/2019 -- Mayur Varshney -- show customer data on summary page
    this.localService.getCustomer(this.taskObj.Task_Number).then((res) => {
      this.customer = res;
      this.valueProvider.setCustomer(this.customer);
    });
  }
  /**
   * 26-7-18, Suraj Gorai
   * Remove Platform specific code for conversion from file to base64
   *
   * @memberof SummaryPage
   */
  async getAttachmentlist() {
    let self = this;
    this.localService.getAttachmentList(this.taskId, 'D').then((allAttachment: any) => {
      console.log("getAttachmentListFrom Database", allAttachment);
      if (this.plt.is('cordova')) {
        this.attachmentList = [];
        this.valueProvider.resetAttachmentForDisplay();
        for (let attachment of allAttachment) {
          let attachmentObject: any = { "filename": "", "fileDisc": "", "file": "", "filetype": "", "data": "", "contentType": "", "base64": "" };
          // 10/01/2018 -- Mayur Varshney -- split name and extension by getting the index of pre-dot of extension
          let attachmentNameAndType = this.utilityProvider.generateFileNameAndType(attachment.File_Name);
          //08/10/2018 Zohaib Khan: Removed base64 code.
          attachmentObject.contentType = attachment.File_Type;
          attachmentObject.fileDisc = attachmentNameAndType.Name;
          attachmentObject.filename = attachment.File_Name;
          attachmentObject.filetype = attachmentNameAndType.Type;
          if (attachmentObject.contentType.indexOf('image') > -1) {
            //08/10/2018 Zohaib Khan: Checking if attachment exists or not if not than show actual image otherwise show thumbnails.
            this.utilityProvider.checkFileIfExist(cordova.file.dataDirectory + "/taskfiles/" + this.valueProvider.getTaskId() + "/thumbnails/", "thumb_" + attachment.File_Name).then(res => {
              attachmentObject.isThumbnailCreated = res;
            });
          }
          self.ngZone.run(() => {
            self.attachmentList.push(attachmentObject);
            self.valueProvider.addAttachmentForDisplay(attachmentObject);
          });
        }
      } else {
        this.attachmentList = allAttachment.map((attachment) => {
          let attachmentObject: any = {};
          // 10/01/2018 -- Mayur Varshney -- split name and extension by getting the index of pre-dot of extension
          let attachmentNameAndType = this.utilityProvider.generateFileNameAndType(attachment.File_Name);
          attachmentObject.contentType = attachment.File_Type;
          attachmentObject.fileDisc = attachmentNameAndType.Name;
          attachmentObject.filename = attachment.File_Name.toLowerCase();
          attachmentObject.filetype = attachmentNameAndType.Type;
          return attachmentObject;
        });
      }
    });
  }

  submitsignature() {
    this.gottoCustomerSignature();
  }

  openResource(file) {
    let filepath = cordova.file.dataDirectory;
    //08/10/2018 Zohaib Khan: Added updated filepath
    this.utilityProvider.openFile(filepath + "/taskfiles/" + this.valueProvider.getTaskId() + "/" + file.filename, file.contentType, null);

  }

  installedBaseReadmore(notes, index) {
    var params = { Notes: notes }
    let myModal = this.utilityProvider.showModal("NotesModalPage", params, { enableBackdropDismiss: false, cssClass: 'Summary-NotesModalPage' });
    myModal.present();
  }

  notesReadmore(notes, notesInstallBase, noteType, index, serial_Number, item_Number, systemID) {
    // 11/05/2019 -- Mayur Varshney -- Add system id to show on summary page
    let params = { Notes: notes, Notes_Install_Base: notesInstallBase, Serial_Number: serial_Number, Item_Number: item_Number, NoteType: noteType, ifReadMore: true, System_ID: systemID }
    let myModal = this.utilityProvider.showModal("NotesModalPage", params, { enableBackdropDismiss: false, cssClass: 'Summary-NotesModalPage' });
    myModal.present();
  }

  calculateDuration(obj, key) {
    let DurationHours = parseInt(key.Duration.split(':')[0]);
    let DurationMinutes = parseInt(key.Duration.split(':')[1]);
    obj.hours = obj.hours + DurationHours;
    obj.mins = obj.mins + DurationMinutes;
    let reminder = obj.mins % 60;
    obj.hours += Math.floor(obj.mins / 60);
    if (obj.mins >= 60)
      obj.mins = reminder;
    // let duration = obj.hours + ":" + reminder;
    return obj.hours + ":" + reminder;
  };

  formatDuration(duration) {
    if (duration.split(":")[0].length == 1) {
      let hours = "0" + duration.split(":")[0];
      duration = hours + ":" + duration.split(":")[1];
    }
    if (duration.split(":")[1].length == 1) {
      let mins = "0" + duration.split(":")[1];
      duration = duration.split(":")[0] + ":" + mins;
    }
    return duration;
  }

  backToFieldJobs() {
    if (this.page == 'calender') {
      this.appCtrl.getRootNav().setRoot("CalendarPage");
    }
    else {
      this.appCtrl.getRootNav().setRoot("FieldJobListPage");
    }
  }

  openPdf(isMail) {
    //let filePath = cordova.file.dataDirectory;
    //09/14/2018 Zohaib Khan: If job status is completed the pull the FSR attachment from database
    // 12-26-2018 -- Mansi Arora -- replaced completed awaiting review check by status id
    // console.log(this.taskStatusId);
    if (!this.disablePdfButton) {
      this.disablePdfButton = true;
      this.localService.getDetailNotesList(String(this.valueProvider.getTaskId())).then((detailedNotes: any[]) => {
        console.log(detailedNotes)
        if (detailedNotes.length > 0) {
          console.log("here");
          if (this.taskStatusId == Enums.Jobstatus.Completed_Awaiting_Review || ((this.taskStatusId != Enums.Jobstatus.Debrief_Started) && (this.valueProvider.getadditionalTime().length == 0 && this.valueProvider.getSortedModifiedTime().length == 0 && this.valueProvider.getadditionalExpense().length == 0 && this.valueProvider.getSortedModifiedExpense().length == 0 && this.valueProvider.getAdditionalMaterial().length == 0 && this.valueProvider.getSortedModifiedMaterial().length == 0 && String(detailedNotes[0].Sync_Status) == "true"))) {
            this.localService.getAllFSRTypeAttachment(this.valueProvider.getTaskId()).then((res: any) => {
              //09/14/2018 Zohaib Khan: If attachment is more than one than show modal with languages otherwise open the attachment.
              if (res.length > 1) {
                //10/30/2018--TODO By Zohaib Khan-- Waiting for approval.
                let langLOV = this.getCurrentReportNames(res);
                if (langLOV.length > 1) {
                  let params = { 'languageSelector': true, 'printLangList': this.FSRPrintLanguages, 'langLOV': langLOV, 'taskStatus': this.taskStatus };
                  this.showLangModal(params, isMail);
                } else if (langLOV.length == 1) {
                  let lang = langLOV[0].File_Name.split("_")[2] + "_" + res[0].File_Name.split("_")[3].split(".")[0];
                  this.generatePdf(lang, isMail);
                }
              } else if (res.length == 1) {
                let lang = res[0].File_Name.split("_")[2] + "_" + res[0].File_Name.split("_")[3].split(".")[0];
                this.generatePdf(lang, isMail);
              }
            });
          }

          else {
            //09/14/2018 Zohaib Khan: if status is not completed than pull the attachment from user preferences.
            if (this.valueProvider.getUserPreferences()[0].FSR_Languages.split(",").length > 1) {
              let params = { 'languageSelector': true, 'printLangList': this.FSRPrintLanguages, 'langLOV': this.valueProvider.getUserPreferences()[0].FSR_Languages.split(","), 'taskStatus': this.taskStatus, "DetailedNotes": detailedNotes[0].Sync_Status };
              this.showLangModal(params, isMail, detailedNotes[0].Sync_Status);
            } else {
              this.generatePdf(this.valueProvider.getUserPreferences()[0].FSR_Languages.split(',')[0], isMail, detailedNotes[0].Sync_Status);
            }
          }

        } else {
          if (this.taskStatusId == Enums.Jobstatus.Completed_Awaiting_Review || ((this.taskStatusId != Enums.Jobstatus.Debrief_Started) && (this.valueProvider.getadditionalTime().length == 0 && this.valueProvider.getSortedModifiedTime().length == 0 && this.valueProvider.getadditionalExpense().length == 0 && this.valueProvider.getSortedModifiedExpense().length == 0 && this.valueProvider.getAdditionalMaterial().length == 0 && this.valueProvider.getSortedModifiedMaterial().length == 0))) {
            this.localService.getAllFSRTypeAttachment(this.valueProvider.getTaskId()).then((res: any) => {
              //09/14/2018 Zohaib Khan: If attachment is more than one than show modal with languages otherwise open the attachment.
              if (res.length > 1) {
                //10/30/2018--TODO By Zohaib Khan-- Waiting for approval.
                let langLOV = this.getCurrentReportNames(res);
                if (langLOV.length > 1) {
                  let params = { 'languageSelector': true, 'printLangList': this.FSRPrintLanguages, 'langLOV': langLOV, 'taskStatus': this.taskStatus };
                  this.showLangModal(params, isMail);
                } else if (langLOV.length == 1) {
                  let lang = langLOV[0].File_Name.split("_")[2] + "_" + res[0].File_Name.split("_")[3].split(".")[0];
                  this.generatePdf(lang, isMail);
                }
              } else if (res.length == 1) {
                let lang = res[0].File_Name.split("_")[2] + "_" + res[0].File_Name.split("_")[3].split(".")[0];
                this.generatePdf(lang, isMail);
              }
            });
          }

          else {
            //09/14/2018 Zohaib Khan: if status is not completed than pull the attachment from user preferences.
            if (this.valueProvider.getUserPreferences()[0].FSR_Languages.split(",").length > 1) {
              let params = { 'languageSelector': true, 'printLangList': this.FSRPrintLanguages, 'langLOV': this.valueProvider.getUserPreferences()[0].FSR_Languages.split(","), 'taskStatus': this.taskStatus };
              this.showLangModal(params, isMail);
            } else {
              this.generatePdf(this.valueProvider.getUserPreferences()[0].FSR_Languages.split(',')[0], isMail);
            }
          }
        }
        this.timeout = setTimeout(() => {
          this.disablePdfButton = false;
        }, 10);
      });
    }
    //if (this.valueProvider.getTask().Country.toLowerCase() == "people's republic of china" || this.valueProvider.getTask().Country.toLowerCase() == "china") {
    //   let params = { 'languageSelector': true };
    //   let languageModal = this.utilityProvider.showModal("NotesModalPage", params, { enableBackdropDismiss: false, cssClass: 'Language-Selector-Modal' });
    //   languageModal.present();
    //   languageModal.onDidDismiss(data => {
    //     if (data) {
    //       if (data.toLowerCase() == 'chinese') {
    //         this.generatePdf('zh-cn', isMail);
    //       } else {
    //         this.generatePdf('en-gb', isMail);
    //       }
    //     } else {
    //       self.logger.log(self.fileName, 'openPdf', 'no data');
    //     }
    //   });
    // } else {
    //   self.logger.log(self.fileName, 'openPdf', "country is not china");
    //   this.generatePdf('en-gb', isMail);
    // }
  }

  showLangModal(params, isMail, syncStatus?) {
    let languageModal = this.utilityProvider.showModal("NotesModalPage", params, { enableBackdropDismiss: false, cssClass: 'Language-Selector-Modal' });
    languageModal.present();
    languageModal.onDidDismiss(data => {
      if (data) {
        this.generatePdf(data, isMail, syncStatus);
      }
      this.disablePdfButton = false;
    });
  }
  //09/13/2018 Zohaib Khan: Getting FSR preferred language from database
  getFSRPrintLang() {
    this.localService.getFSREnabledLanguages().then((res: any) => {
      this.FSRPrintLanguages = res;
    });
  }

  removeDuplicates(arr) {
    let unique_array = []
    for (let i = 0; i < arr.length; i++) {
      if (unique_array.indexOf(arr[i]) == -1) {
        if (this.utilityProvider.isNotNull(arr[i])) {
          unique_array.push(arr[i])
        }
      }
    }
    if (unique_array.length > 0) {
      return unique_array;
    } else {
      return '';
    }
  }


  generatePdf(langId, isMail, syncStatus?) {
    return new Promise((resolve, reject) => {

      let filePath = cordova.file.dataDirectory;
      if (syncStatus) {
        this.generatePdfWithDetailedNotes(isMail, filePath, langId, syncStatus);
      } else {
        this.generatePdfWithOutDetailedNotes(isMail, filePath, langId);
      }

    });
  }

  generatePdfWithDetailedNotes(isMail, filePath, langId, syncStatus) {
    if (this.taskStatus == "Completed-Awaiting Review" || ((this.taskStatusId != Enums.Jobstatus.Debrief_Started) && (this.valueProvider.getadditionalTime().length == 0 && this.valueProvider.getSortedModifiedTime().length == 0 && this.valueProvider.getadditionalExpense().length == 0 && this.valueProvider.getSortedModifiedExpense().length == 0 && this.valueProvider.getAdditionalMaterial().length == 0 && this.valueProvider.getSortedModifiedMaterial().length == 0 && String(syncStatus) == "true"))) {
      if (isMail) {
        this.openMail(filePath + "/taskfiles/" + this.valueProvider.getTaskId() + "/", "Report_" + this.valueProvider.getTaskId() + "_" + langId + ".pdf");
      } else {
        this.utilityProvider.openFile(filePath + "/taskfiles/" + this.valueProvider.getTaskId() + "/" + "Report_" + this.valueProvider.getTaskId() + "_" + langId + ".pdf", "application/pdf", null);
      }
    }
    else {
      //08/13/2018 Zohaib Khan: Delete previous temp file if exist and generate updated one.
      this.utilityProvider.deleteFile(filePath + "/temp/", "Temp_Report_" + this.valueProvider.getTaskId() + "_" + langId + ".pdf").then(res => {
        this.utilityProvider.showSpinner();
        let promiseArr = [];
        promiseArr.push(this.fsrProvider.generatepdf(langId, true, "SummaryPage", ""));
        Promise.all(promiseArr).then((allresult) => {
          if (isMail) {
            //08/13/2018 Zohaib Khan: updated filepath with temp directory.
            this.openMail(filePath + "/temp/", "Temp_Report_" + this.valueProvider.getTaskId() + "_" + langId + ".pdf");
          } else {
            //08/13/2018 Zohaib Khan: updated filepath with temp directory.
            this.utilityProvider.openFile(filePath + "/temp/" + "Temp_Report_" + this.valueProvider.getTaskId() + "_" + langId + ".pdf", "application/pdf", null);
          }
          this.utilityProvider.stopSpinner();
        }).catch((error: any) => {
          this.logger.log(this.fileName, 'generatePdf', 'Error in generatePdf : ' + error);
          this.utilityProvider.stopSpinner();
          let msg = 'Error Occured while generating PDF!';
          this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
        });
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'generatePdf', 'Error in deleteFile : ' + JSON.stringify(err));
      });
    }
  }

  generatePdfWithOutDetailedNotes(isMail, filePath, langId) {
    if (this.taskStatus == "Completed-Awaiting Review" || ((this.taskStatusId != Enums.Jobstatus.Debrief_Started) && (this.valueProvider.getadditionalTime().length == 0 && this.valueProvider.getSortedModifiedTime().length == 0 && this.valueProvider.getadditionalExpense().length == 0 && this.valueProvider.getSortedModifiedExpense().length == 0 && this.valueProvider.getAdditionalMaterial().length == 0 && this.valueProvider.getSortedModifiedMaterial().length == 0))) {
      if (isMail) {
        this.openMail(filePath + "/taskfiles/" + this.valueProvider.getTaskId() + "/", "Report_" + this.valueProvider.getTaskId() + "_" + langId + ".pdf");
      } else {
        this.utilityProvider.openFile(filePath + "/taskfiles/" + this.valueProvider.getTaskId() + "/" + "Report_" + this.valueProvider.getTaskId() + "_" + langId + ".pdf", "application/pdf", null);
      }
    }
    else {
      //08/13/2018 Zohaib Khan: Delete previous temp file if exist and generate updated one.
      this.utilityProvider.deleteFile(filePath + "/temp/", "Temp_Report_" + this.valueProvider.getTaskId() + "_" + langId + ".pdf").then(res => {
        this.utilityProvider.showSpinner();
        let promiseArr = [];
        promiseArr.push(this.fsrProvider.generatepdf(langId, true, "SummaryPage", ""));
        Promise.all(promiseArr).then((allresult) => {
          if (isMail) {
            //08/13/2018 Zohaib Khan: updated filepath with temp directory.
            this.openMail(filePath + "/temp/", "Temp_Report_" + this.valueProvider.getTaskId() + "_" + langId + ".pdf");
          } else {
            //08/13/2018 Zohaib Khan: updated filepath with temp directory.
            this.utilityProvider.openFile(filePath + "/temp/" + "Temp_Report_" + this.valueProvider.getTaskId() + "_" + langId + ".pdf", "application/pdf", null);
          }
          this.utilityProvider.stopSpinner();
        }).catch((error: any) => {
          this.logger.log(this.fileName, 'generatePdf', 'Error in generatePdf : ' + error);
          this.utilityProvider.stopSpinner();
          let msg = 'Error Occured while generating PDF!';
          this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
        });
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'generatePdf', 'Error in deleteFile : ' + JSON.stringify(err));
      });
    }
  }

  openMail(path, fileName) {
    this.utilityProvider.getBase64(path, fileName).then((res: any) => {
      // 05/27/2019 -- Mayur Varshney -- open application mail modal to sent attachment with static info (read only)
      // this.openMailClent(res, fileName);
      this.openMailModal(res, fileName);
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'openMail', 'Error in openMail : ' + JSON.stringify(error));
      let msg = 'Unable to attach PDF!';
      this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
    });
  };

  // openMailClent(base64, filename) {
  //   try {
  //     let base64parts = base64.split(',');
  //     if (base64parts[1] != "") {
  //       this.getToContacts().then((toContacts: any) => {
  //         this.localService.getCustomer(this.valueProvider.getTaskId()).then((custEmail: any) => {
  //           if (custEmail && custEmail.Email != '') {
  //             toContacts = toContacts.concat(custEmail.Email);
  //           }
  //           let compatibleAttachment = "base64:" + filename + "//" + base64parts[1];
  //           this.emailComposer.open({
  //             to: this.removeDuplicates(toContacts),
  //             subject: 'Report',
  //             body: '',
  //             attachments: [compatibleAttachment]
  //           }).then((res) => {
  //             this.logger.log(this.fileName, 'emailComposer openMailClent', res);
  //           }).catch((error) => {
  //             this.logger.log(this.fileName, 'emailComposer openMailClent Error', error);
  //           });
  //         });
  //       });
  //     }
  //     else {
  //       let msg = 'Unable to attach PDF!!!';
  //       this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
  //     }
  //   } catch (error) {
  //     this.logger.log(this.fileName, 'openMailClent', error);
  //     let msg = 'Unable to attach PDF!!!';
  //     this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
  //   };
  // }

  getToContacts() {
    let contactsEmail: any = [];
    return new Promise((resolve, reject) => {
      this.localService.getContactList(this.valueProvider.getTaskId()).then((res: any) => {
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            contactsEmail.push(res[i].Email);
          }
        }
        resolve(contactsEmail)
      }).catch(err => {
        this.logger.log(this.fileName, 'getToContacts', 'Error in getToContacts : ' + JSON.stringify(err));
        resolve(contactsEmail)
      });
    });
  }

  lockScreen() {
    this.locked = !this.locked;
    if (this.locked) {
      this.menuController.enable(false);
      this.events.publish("lockButtonClicked", this.locked);
    } else {
      this.menuController.enable(true);
      this.events.publish("lockButtonClicked", this.locked);
    }
  }
  /**
   *10/19/2018 Zohaib Khan
   * Getting sorted list of original, additional and modified entries for Time, Expense, and Material.
   * @memberof SummaryPage
   */
  async getAllOriginalModifiedAndAdditionalEntries() {
    // console.log(this.valueProvider.getUserFSRPreferences());
    //10/24/2018 kamal : set Modified Material and Additional Material to blank
    this.valueProvider.setSortedModifiedMaterial([]);
    this.valueProvider.setAdditionalMaterial([]);
    this.localService.getAllTimeList(this.valueProvider.getTaskId()).then((time: any) => {
      this.laodTimeEntries(time);
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getAllOriginalModifiedAndAdditionalEntries ', 'Error in getAllTimeList :' + JSON.stringify(error));
    });
    this.localService.getAllExpenseList(this.valueProvider.getTaskId()).then((expense: any) => {
      this.valueProvider.setExpenseForDisplay(expense);
      this.getModiifiedExpenseList(expense);
      this.getAdditionalExpenseList(expense);
      this.getPostSignatureExpenseList(expense);
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getAllOriginalModifiedAndAdditionalEntries ', 'Error in getAllExpenseList :' + JSON.stringify(error));
    });

    // this.localService.getAllMaterialList(this.valueProvider.getTaskId()).then((material: any) => {
    //   this.getMaterialList(material);
    //   this.getModifiedMaterialList(material);
    //   this.getAdditionalMaterial(material);
    // }).catch((error: any) => {
    //   this.logger.log(this.fileName, 'getAllOriginalModifiedAndAdditionalEntries ', 'Error in getAllMaterialList :' + JSON.stringify(error));
    // });

    //04/02/2019-- Mayur Varshney -- get MaterialSerialList from local db
    this.localService.getAllMaterialSerialList(this.valueProvider.getTaskId()).then((material: any) => {
      this.getMaterialList(material);
      this.getModifiedMaterialList(material);
      this.getAdditionalMaterial(material);
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getAllOriginalModifiedAndAdditionalEntries ', 'Error in getAllMaterialList :' + JSON.stringify(error));
    });
  }

  async laodTimeEntries(time){
    await this.gettimelist(time);
    await this.getTimeWithoutBreak(time);
    await this.getAdditionalTimeList(time);
    await this.getAdditionalTimeListWithOutBreak(time);
    await this.getModifiedTimeListWithOutBreak(time);
    await this.getModifiedTimeList(time);
  }

  /**
   * 10/31/2018 Zohaib Khan
   * getModifiedTimeList takes all time entries and sort them with current and original entries and calculate their total basen on worktype.
   * @param {*} timeEntries
   * @memberof SummaryPage
   */
  async getModifiedTimeList(timeEntries) {
    let allTimeArr: any = [];
    let sortedTimeArr: any = [];
    let currentAndUnModifiedArr: any = [];
    allTimeArr = timeEntries;
    sortedTimeArr = await this.getSortedModifiedEntries(allTimeArr, 'Time');
    // this.valueProvider.setSortedModifiedTimeWithoutBreak(this.getTimeWithoutBreak(sortedTimeArr, "Modified Time"));
    //11/28/2018 Zohaib Khan: In UP if Show Non-Billable entries is checked than show break entries elso dont show them.
    if (String(this.valueProvider.getUserPreferences()[0].ShowNonBillableEntries) == 'false' || (this.valueProvider.getUserFSRPreferences() && String(this.valueProvider.getUserFSRPreferences().ShowNonBillableEntries) == 'false')) {
      sortedTimeArr = sortedTimeArr.filter(item => {
        return item.Work_Type != 'Break';
      });
    }
    //10/26/2018 Zohaib Khan: Filtering Current and original unmodified rows.
    currentAndUnModifiedArr = sortedTimeArr.filter((item) => {
      return item.CurrentMobileId == null;
    });

    //10/31/2018 Zohaib Khan: Optimised calculation code. Earlear same code was rewritten for calculations
    let calculatedResult: any = this.calculateTimeTotal(currentAndUnModifiedArr);
    if (currentAndUnModifiedArr.length > 0) {
      sortedTimeArr = sortedTimeArr.concat(calculatedResult.subTotalArray);
      sortedTimeArr.push(calculatedResult.grandtimeObject);
    }
   // await this.sortTimeEntries(sortedTimeArr);
    await this.set24HoursTimePreview(sortedTimeArr);
    this.valueProvider.setSortedModifiedTime(sortedTimeArr);
  }


  async set24HoursTimePreview(timeEntries){
    timeEntries.filter((item) => {
      if((item.Service_Start_Date != 'Sub Total') && (item.Service_Start_Date != 'Grand Total')){
        if (!item.EntryDate) {
          item.displayStartDate = moment(item.Service_Start_Date).format(this.valueProvider.getUserPreferences()[0].Date_Format ? this.valueProvider.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
          item.displayEndDate = moment(item.Service_End_Date).format(this.valueProvider.getUserPreferences()[0].Date_Format ? this.valueProvider.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
          item.Start_Time = moment(item.Service_Start_Date).format('HH:mm');
          item.End_Time = moment(item.Service_End_Date).format('HH:mm');
        } else{
          item.displayStartDate = moment(item.EntryDate, "YYYY-MM-DD").format(this.valueProvider.getUserPreferences()[0].Date_Format ? this.valueProvider.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
          if(item.End_Time == "00:00"){
            item.displayEndDate = moment(item.EntryDate, 'YYYY-MM-DD').add(1, 'day').format(this.valueProvider.getUserPreferences()[0].Date_Format ? this.valueProvider.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
          } else{
            item.displayEndDate = moment(item.EntryDate, 'YYYY-MM-DD').format(this.valueProvider.getUserPreferences()[0].Date_Format ? this.valueProvider.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
          }
        }
      }
    });
  }


  async sortTimeEntries(timeEntries){
    timeEntries.sort(function(a,b){
      let a_start_date : any = a.Service_Start_Date,  
      b_start_date : any = b.Service_Start_Date;
      if(a.EntryDate){
        a_start_date = moment(moment(a.EntryDate).format('YYYY-MM-DD'))
                          .add(a.Start_Time.split(':')[0], 'hours').add(a.Start_Time.split(':')[1], 'minutes').toDate();
      }
      if(b.EntryDate){
        b_start_date = moment(moment(b.EntryDate).format('YYYY-MM-DD'))
                          .add(b.Start_Time.split(':')[0], 'hours').add(b.Start_Time.split(':')[1], 'minutes').toDate();
      }
      return moment(a_start_date).toDate().getTime() - moment(b_start_date).toDate().getTime();
    });
  }

  async getModifiedTimeListWithOutBreak(timeEntries) {
    let allTimeArr: any = [];
    let sortedTimeArr: any = [];
    let currentAndUnModifiedArr: any = [];
    allTimeArr = timeEntries;
    sortedTimeArr = await this.getSortedModifiedEntries(allTimeArr, 'Time');
    // this.valueProvider.setSortedModifiedTimeWithoutBreak(this.getTimeWithoutBreak(sortedTimeArr, "Modified Time"));
    //11/28/2018 Zohaib Khan: In UP if Show Non-Billable entries is checked than show break entries elso dont show them.
    sortedTimeArr = sortedTimeArr.filter(item => {
      return item.Work_Type != 'Break';
    });

    //10/26/2018 Zohaib Khan: Filtering Current and original unmodified rows.
    currentAndUnModifiedArr = sortedTimeArr.filter((item) => {
      return item.CurrentMobileId == null;
    });

    //10/31/2018 Zohaib Khan: Optimised calculation code. Earlear same code was rewritten for calculations
    let calculatedResult: any = this.calculateTimeTotal(currentAndUnModifiedArr);
    if (currentAndUnModifiedArr.length > 0) {
      sortedTimeArr = sortedTimeArr.concat(calculatedResult.subTotalArray);
      sortedTimeArr.push(calculatedResult.grandtimeObject);
    }
    //await this.sortTimeEntries(sortedTimeArr);
    await this.set24HoursTimePreview(sortedTimeArr);
    this.valueProvider.setSortedModifiedTimeWithoutBreak(sortedTimeArr);
  }

  /**
   * 10/31/2018 Zohaib Khan
   * Filtering all additional entries and calculating their total.
   * @param {*} timeEntries : All Time Entries
   * @memberof SummaryPage
   */
  async getAdditionalTimeList(timeEntries) {
    let allTimeArr: any = [];
    let additionalTime: any = [];
    let originalAdditionalArr: any = [];
    allTimeArr = timeEntries;
    for (let i = 0; i < allTimeArr.length; i++) {
      //10/28/2018 Zohaib Khan: Getting all unmodified additional array.
      if (allTimeArr[i].IsAdditional == 'true' && !allTimeArr[i].CurrentMobileId && !allTimeArr[i].Original) {
        additionalTime.push(allTimeArr[i]);
      }
      //10/28/2018 Zohaib Khan: Getting all original additional array.
      else if (allTimeArr[i].IsAdditional == 'true' && !allTimeArr[i].Original && allTimeArr[i].CurrentMobileId) {
        originalAdditionalArr.push(allTimeArr[i]);
      }
    }
    if (originalAdditionalArr.length > 0) {
      for (let i = 0; i < originalAdditionalArr.length; i++) {
        let id = originalAdditionalArr[i].Time_Id;
        //10/28/2018 Zohaib Khan: Getting all Modified additional array.
        for (let j = 0; j < allTimeArr.length; j++) {
          if (id == allTimeArr[j].Original) {
            additionalTime.push(allTimeArr[j]);
          }
        }
      }
    }
    // this.valueProvider.setadditionalTimeWithoutBreak(this.getTimeWithoutBreak(additionalTime, "Additional"));
    //11/28/2018 Zohaib Khan: In UP if Show Non-Billable entries is checked than show break entries elso dont show them.
    if (String(this.valueProvider.getUserPreferences()[0].ShowNonBillableEntries) == 'false' || (this.valueProvider.getUserFSRPreferences() && String(this.valueProvider.getUserFSRPreferences().ShowNonBillableEntries) == 'false')) {
      // console.log(this.valueProvider.getUserFSRPreferences());
      additionalTime = additionalTime.filter(item => {
        return item.Work_Type != 'Break';
      });
    }
    //10/31/2018 Zohaib Khan: Sorting additional array on date and calculation all additional entries total.
    this.utilityProvider.sortTimeArray(additionalTime);
    let calculatedResult: any = this.calculateTimeTotal(additionalTime);
    if (additionalTime.length > 0) {
      additionalTime = additionalTime.concat(calculatedResult.subTotalArray);
      additionalTime.push(calculatedResult.grandtimeObject);
    }
    await this.sortTimeEntries(additionalTime);
    await this.set24HoursTimePreview(additionalTime);
    this.valueProvider.setadditionalTime(additionalTime);
  }

  async getAdditionalTimeListWithOutBreak(timeEntries) {
    let allTimeArr: any = [];
    let additionalTime: any = [];
    let originalAdditionalArr: any = [];
    allTimeArr = timeEntries;
    for (let i = 0; i < allTimeArr.length; i++) {
      //10/28/2018 Zohaib Khan: Getting all unmodified additional array.
      if (allTimeArr[i].IsAdditional == 'true' && !allTimeArr[i].CurrentMobileId && !allTimeArr[i].Original) {
        additionalTime.push(allTimeArr[i]);
      }
      //10/28/2018 Zohaib Khan: Getting all original additional array.
      else if (allTimeArr[i].IsAdditional == 'true' && !allTimeArr[i].Original && allTimeArr[i].CurrentMobileId) {
        originalAdditionalArr.push(allTimeArr[i]);
      }
    }
    if (originalAdditionalArr.length > 0) {
      for (let i = 0; i < originalAdditionalArr.length; i++) {
        let id = originalAdditionalArr[i].Time_Id;
        //10/28/2018 Zohaib Khan: Getting all Modified additional array.
        for (let j = 0; j < allTimeArr.length; j++) {
          if (id == allTimeArr[j].Original) {
            additionalTime.push(allTimeArr[j]);
          }
        }
      }
    }
    // this.valueProvider.setadditionalTimeWithoutBreak(this.getTimeWithoutBreak(additionalTime, "Additional"));
    //11/28/2018 Zohaib Khan: In UP if Show Non-Billable entries is checked than show break entries elso dont show them.
    additionalTime = additionalTime.filter(item => {
      return item.Work_Type != 'Break';
    });

    //10/31/2018 Zohaib Khan: Sorting additional array on date and calculation all additional entries total.
    this.utilityProvider.sortTimeArray(additionalTime);
    let calculatedResult: any = this.calculateTimeTotal(additionalTime);
    if (additionalTime.length > 0) {
      additionalTime = additionalTime.concat(calculatedResult.subTotalArray);
      additionalTime.push(calculatedResult.grandtimeObject);
    }
    await this.sortTimeEntries(additionalTime);
    await this.set24HoursTimePreview(additionalTime);
    this.valueProvider.setadditionalTimeWithoutBreak(additionalTime);
  }

  async getModiifiedExpenseList(expenseEntries) {
    let sortedExpenseArr: any = [];
    let allExpenseArr: any = [];
    let currentAndUnModifiedArr: any = [];
    let totalAmountAndDistanceArr: any = [];
    let expenseObject: any = { Date: "Total", Expense_Type: "", Currency: "", Amount: 0, Distance: 0, UOM: "", ChargeMethod: "", Justification: "" };
    allExpenseArr = expenseEntries;
    sortedExpenseArr = await this.getSortedModifiedEntries(allExpenseArr, 'Expense');
    //10/26/2018 Zohaib Khan: Filtering Current and original unmodified rows.
    currentAndUnModifiedArr = sortedExpenseArr.filter((item) => {
      return item.CurrentMobileId == null;
      // GS: Get those entries where expense id is not in original
    });
    if (currentAndUnModifiedArr.length > 0) {
      //05/22/2019 -- Mayur Varshney -- change default total amount
      let AmountTotal: any = "0.00";
      let DistanceTotal: any = 0;
      let uom: any = "";
      for (let i = 0; i < currentAndUnModifiedArr.length; i++) {
        if (currentAndUnModifiedArr[i].UOM) {
          uom = currentAndUnModifiedArr[i].UOM;
        }
        //10/26/2018 Zohaib Khan: Adding amount from entire array
        // AmountTotal = AmountTotal + parseFloat(currentAndUnModifiedArr[i].Amount);
        // 05/22/2019 -- Mayur Varshney -- add expense amount
        AmountTotal = this.utilityProvider.addLargeNumber(AmountTotal, currentAndUnModifiedArr[i].Amount);
        if (currentAndUnModifiedArr[i].Distance) {
          //10/26/2018 Zohaib Khan: Adding distance from entire array if available
          DistanceTotal = DistanceTotal + parseFloat(currentAndUnModifiedArr[i].Distance);
        }
      }
      expenseObject.Amount = AmountTotal;
      expenseObject.Distance = DistanceTotal;
      expenseObject.UOM = uom;
      totalAmountAndDistanceArr.push(expenseObject);
      sortedExpenseArr = sortedExpenseArr.concat(totalAmountAndDistanceArr);
    }
    this.valueProvider.setSortedModifiedExpense(sortedExpenseArr);
  }

  getPostSignatureExpenseList(expenseEntries) {
    // GS :
    let allExpenseArr: any = [];
    let totalAmountAndDistanceArr: any = [];
    let allupdatedAndUnModifiedEntries: any = [];
    allExpenseArr = expenseEntries;
    let expenseObject: any = { Date: "Total", Expense_Type: "", Currency: "", Amount: 0, Distance: 0, UOM: "", ChargeMethod: "", Justification: "" };
    //10/30/2018 Zohaib Khan: Filtering all original unmodified, additional unmodified and all updated entries.
    if (allExpenseArr.length > 0) {
      for (let i = 0; i < allExpenseArr.length; i++) {
        if (allExpenseArr[i].IsAdditional == 'false' && !allExpenseArr[i].CurrentMobileId && !allExpenseArr[i].Original) {
          allupdatedAndUnModifiedEntries.push(allExpenseArr[i]);
        } else if (allExpenseArr[i].IsAdditional == 'true' && !allExpenseArr[i].CurrentMobileId && !allExpenseArr[i].Original) {
          allupdatedAndUnModifiedEntries.push(allExpenseArr[i]);
        } else if (allExpenseArr[i].IsAdditional == 'true' && allExpenseArr[i].Original) {
          allupdatedAndUnModifiedEntries.push(allExpenseArr[i]);
        }
      }
    }
    if (allupdatedAndUnModifiedEntries.length > 0) {
      //05/22/2019 -- Mayur Varshney -- change default total amount
      let AmountTotal: any = "0.00";
      let DistanceTotal: any = 0;
      let uom: any = "";
      for (let i = 0; i < allupdatedAndUnModifiedEntries.length; i++) {
        if (allupdatedAndUnModifiedEntries[i].UOM) {
          uom = allupdatedAndUnModifiedEntries[i].UOM;
        }
        // AmountTotal = AmountTotal + parseFloat(allupdatedAndUnModifiedEntries[i].Amount);
        // 05/22/2019 -- Mayur Varshney -- add expense amount
        AmountTotal = this.utilityProvider.addLargeNumber(AmountTotal, allupdatedAndUnModifiedEntries[i].Amount);
        if (allupdatedAndUnModifiedEntries[i].Distance) {
          //10/26/2018 Zohaib Khan: Adding distance from entire array if available
          DistanceTotal = DistanceTotal + parseInt(allupdatedAndUnModifiedEntries[i].Distance);
        }
      }
      expenseObject.Amount = AmountTotal;
      expenseObject.Distance = DistanceTotal;
      expenseObject.UOM = uom;
      totalAmountAndDistanceArr.push(expenseObject);
      allupdatedAndUnModifiedEntries.sort((a, b) => {
        if (a.Date < b.Date)
          return -1;
        if (a.Date > b.Date)
          return 1;
        return 0;
      });
      allupdatedAndUnModifiedEntries = allupdatedAndUnModifiedEntries.concat(totalAmountAndDistanceArr);
    }
    this.valueProvider.setPostSigExpense(allupdatedAndUnModifiedEntries);
  }

  getAdditionalExpenseList(expenseEntries) {
    let allExpenseArr: any = [];
    let additionalExpense: any = [];
    let originalAdditionalArr: any = [];
    let totalAmountAndDistanceArr: any = [];
    let expenseObject: any = { Date: "Total", Expense_Type: "", Currency: "", Amount: 0, Distance: 0, UOM: "", ChargeMethod: "", Justification: "" };
    allExpenseArr = expenseEntries;
    // 08/07/2019 -- Mayur Varshney -- change the assignment type of i from var to let to limit the scope of i in this for loop
    for (let i = 0; i < allExpenseArr.length; i++) {
      if (allExpenseArr[i].IsAdditional == 'true' && !allExpenseArr[i].CurrentMobileId && !allExpenseArr[i].Original) {
        additionalExpense.push(allExpenseArr[i]);
      } else if (allExpenseArr[i].IsAdditional == 'true' && !allExpenseArr[i].Original && allExpenseArr[i].CurrentMobileId) {
        originalAdditionalArr.push(allExpenseArr[i]);
      }
    }
    if (originalAdditionalArr.length > 0) {
      for (let i = 0; i < originalAdditionalArr.length; i++) {
        let id = originalAdditionalArr[i].Expense_Id;
        //10/28/2018 Zohaib Khan: Getting all Modified additional array.
        for (let j = 0; j < allExpenseArr.length; j++) {
          if (id == allExpenseArr[j].Original) {
            additionalExpense.push(allExpenseArr[j]);
          }
        }
      }
    }
    additionalExpense.sort((a, b) => {
      if (new Date(a.Date) < new Date(b.Date))
        return -1;
      if (new Date(a.Date) > new Date(b.Date))
        return 1;
      return 0;
    });
    if (additionalExpense.length > 0) {
      //05/22/2019 -- Mayur Varshney -- change default total amount
      let AmountTotal: any = "0.00";
      let DistanceTotal: any = 0;
      let uom: any = "";
      for (let i = 0; i < additionalExpense.length; i++) {
        if (additionalExpense[i].UOM) {
          uom = additionalExpense[i].UOM;
        }
        // AmountTotal = AmountTotal + parseFloat(additionalExpense[i].Amount);
        // 05/22/2019 -- Mayur Varshney -- add expense amount
        AmountTotal = this.utilityProvider.addLargeNumber(AmountTotal, additionalExpense[i].Amount);
        if (additionalExpense[i].Distance) {
          //10/26/2018 Zohaib Khan: Adding distance from entire array if available
          DistanceTotal = DistanceTotal + parseInt(additionalExpense[i].Distance);
        }
      }
      expenseObject.Amount = AmountTotal;
      expenseObject.Distance = DistanceTotal;
      expenseObject.UOM = uom;
      totalAmountAndDistanceArr.push(expenseObject);
      additionalExpense = additionalExpense.concat(totalAmountAndDistanceArr);
    }
    this.valueProvider.setadditionalExpense(additionalExpense);
    //  }
  }

  async getModifiedMaterialList(materialEntries) {
    let allMaterialList: any = [];
    let modifiedMaterial: any = [];
    allMaterialList = materialEntries;
    modifiedMaterial = await this.getSortedModifiedEntries(allMaterialList, 'Material');
    if (modifiedMaterial.length > 0) {
      for (var k in modifiedMaterial) {
        modifiedMaterial[k].SerialArray = this.transformProvider.mapSerial_item(modifiedMaterial[k]);
      }
      this.valueProvider.setSortedModifiedMaterial(this.utilityProvider.groupBy(modifiedMaterial, function (item) {
        return [item.Material_Id];
      }));
    }
  }

  getAdditionalMaterial(materialEntries) {
    let allMaterialList: any = [];
    let additionalMaterial: any = [];
    let originalAdditionalArr: any = [];
    allMaterialList = materialEntries;
    for (var i = 0; i < allMaterialList.length; i++) {
      if (allMaterialList[i].IsAdditional == 'true' && !allMaterialList[i].CurrentMobileId && !allMaterialList[i].Original) {
        additionalMaterial.push(allMaterialList[i]);
      } else if (allMaterialList[i].IsAdditional == 'true' && allMaterialList[i].CurrentMobileId) {
        originalAdditionalArr.push(allMaterialList[i]);
      }
    }
    if (originalAdditionalArr.length > 0) {
      for (let i = 0; i < originalAdditionalArr.length; i++) {
        let id = originalAdditionalArr[i].Material_Serial_Id;
        //10/28/2018 Zohaib Khan: Getting all Modified additional array.
        for (let j = 0; j < allMaterialList.length; j++) {
          if (id == allMaterialList[j].Original) {
            additionalMaterial.push(allMaterialList[j]);
          }
        }
      }
    }
    additionalMaterial = this.utilityProvider.groupBy(additionalMaterial.reverse(), function (item) {
      return [item.Material_Id];
    });

    this.valueProvider.setAdditionalMaterial(additionalMaterial);
  }

  async getSortedModifiedEntries(array, arrName) {
    let orignalArr: any = [];
    // let originalUnModifiedArr: any = [];
    let currentArr: any = [];
    let id: any;
    let finalSortedArr: any = [];
    let finalArr: any = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i] != undefined) {
        // 11/11/2019 -- Mayur Varshney -- applying condition if table name is Time to check different columns
        if (array[i].CurrentMobileId && (arrName == "Time" ? array[i].DB_Syncstatus == "true" : array[i].Sync_Status == "true")) {
          orignalArr.push(array[i]);
        }
        if (array[i].Original && array[i].IsAdditional == 'true') {
          currentArr.push(array[i]);
        }
      }
    }
    orignalArr = orignalArr.reverse();
    currentArr = currentArr.reverse();
    if(arrName == "Time"){
      await this.sortTimeEntries(currentArr);
    }
    for (let i = 0; i < currentArr.length; i++) {
      finalSortedArr.push(currentArr[i]);
      for (let j = 0; j < currentArr.length; j++) {
        if (arrName == "Time") {
          id = String(currentArr[i].Time_Id);
        } if (arrName == "Expense") {
          id = String(currentArr[i].Expense_Id);
        } if (arrName == "Material") {
          id = String(currentArr[i].Material_Serial_Id);
        }
        if (orignalArr[j] && id == String(orignalArr[j].CurrentMobileId)) {
          finalSortedArr.push(orignalArr[j]);
        }
      }
    }
    finalArr = this.sortOnlyOriginalEntries(finalSortedArr, arrName);
    if (finalArr.length > 0) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].IsAdditional == 'false' && !array[i].CurrentMobileId && !array[i].Original) {
          finalArr.push(array[i]);
        }
      }
    }
    return finalArr;
  }
  //10/28/2018 Zohaib Khan: Sorting only original entries and removing modified additional entries.
  sortOnlyOriginalEntries(finalSortedArr, arrName) {
    let original = [];
    let current = [];
    let final = [];
    let OrignalId: any = "";
    for (let i = 0; i < finalSortedArr.length; i++) {
      if (!finalSortedArr[i].Original && finalSortedArr[i].IsAdditional == 'false') {
        original.push(finalSortedArr[i]);
      }
    }
    if (original.length > 0) {
      for (let j = 0; j < original.length; j++) {
        if (arrName == 'Time') {
          OrignalId = String(original[j].Time_Id);
        } else if (arrName == "Expense") {
          OrignalId = String(original[j].Expense_Id);
        } else if (arrName == "Material") {
          OrignalId = String(original[j].Material_Serial_Id);
        }
        for (let k = 0; k < finalSortedArr.length; k++) {
          if (OrignalId == String(finalSortedArr[k].Original)) {
            current.push(finalSortedArr[k]);
          }
        }
      }
      for (let i = 0; i < current.length; i++) {
        final.push(current[i])
        final.push(original[i])
      }
    }
    return final;
  }

  submitAdditionalData(jobStatus) {
    try {
      if (String(this.valueProvider.getUserPreferences()[0].Do_Not_Show_Modal) == "false") {
        let userPreferenceModal = this.utilityProvider.showModal("UserPreferencesModalPageSummary", '', { enableBackdropDismiss: true, cssClass: 'UserPreferencesModalPageSummary' });
        userPreferenceModal.present();
        userPreferenceModal.onDidDismiss(data => {
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
  async submitData(jobStatus) {
    // let self = this;
    this.utilityProvider.showSpinner();
    try {
      await this.localService.setIsSubmitted(this.valueProvider.getTaskId())
      //09/25/2018: Zohaib Khan : making object to insert Task change log.
      let TaskChangeLogObject: any = {
        ID: this.utilityProvider.getUniqueKey(),
        CreatedTime: "",
        UpdatedTime: new Date(),
        UpdatedByAccount: this.valueProvider.getUser().Email,
        CreatedByAccount: "",
        FieldJob: this.valueProvider.getTaskId(),
        Technician: this.valueProvider.getUser().Name,
        Timestamp: new Date(),
        // 10/15/2018 -- Mayur Varshney -- passed resourceId to changelog for submit staging data
        ResourceId: this.valueProvider.getResourceId(),
        Sync_Status: false,
        Status: jobStatus
      }
      this.localService.insertTaskChangeLog(TaskChangeLogObject).catch((err: any) => {
        this.logger.log(this.fileName, 'submitData', 'Error in insertTaskChangeLog : ' + JSON.stringify(err));
      });
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
      this.localService.updateExpenseflagInTask(this.valueProvider.getTask());
      this.valueProvider.setTaskObject(this.valueProvider.getTask());
      this.logger.log(this.fileName, "insertTaskChangeLog", "TaskChangeLog Inserted");
      //  let selectedTask = this.valueProvider.getTask();
      let promiseArr = [];
      //09/13/2018 Zohaib Khan: Generating FSR based on Fsr Print languages
      let printLang = this.valueProvider.getUserPreferences()[0].FSR_Languages;
      //zohaib Khan 03/07/2019: Removing Duplicate lang if there are.
      let PrintLangArr = this.utilityProvider.removeDuplicateItemFromArray(printLang.split(','));
      for (let i = 0; i < PrintLangArr.length; i++) {
        promiseArr.push(this.fsrProvider.generatepdf(PrintLangArr[i], false, "SummaryPage", ""));
      }
      Promise.all(promiseArr).then((resp) => {
        //09/13/2013 Zohaib Khan: Inserting fsr to Attachment table with Attachment type=fsr
        for (let j = 0; j < resp.length; j++) {
          if (resp[j] != undefined) {
            let fsrAttachmentObject: any = {};
            fsrAttachmentObject.File_Name = resp[j];
            fsrAttachmentObject.AttachmentType = "fsr";
            fsrAttachmentObject.Task_Number = this.valueProvider.getTaskId();
            this.localService.insertAttachment(fsrAttachmentObject);
          }
        }
        // 08-22-2018 GS: Added check for Online, if offline update the status as Completed in DB

        this.valueProvider.getTask().Task_Status = 'Completed-Awaiting Review';
        this.valueProvider.getTask().StatusID = Enums.Jobstatus.Completed_Awaiting_Review;
        // 04/29/2019 -- Mayur Varshney -- create temp variable to set date in Date and DebriefSubmissionDate
        let tempDate = new Date();
        this.valueProvider.getTask().Sync_Status = 'false';
        this.valueProvider.getTask().Date = tempDate;
        // 04/29/2019 -- Mayur Varshney -- insert DebriefSubmissionDate in valueProvider and localDB
        this.valueProvider.getTask().DebriefSubmissionDate = moment.utc(tempDate).format("YYYY-MM-DDTHH:mm:ss.000Z");
        this.valueProvider.getTask().Task_Number = this.valueProvider.getTaskId();
        //Parvinder Todo
        this.localService.updateTaskStatusLocal(this.valueProvider.getTask()).then((res): any => {
          // this.valueProvider.setUserFSRPreferences(null);
          // this.navCtrl.push("SummaryPage");
          // this.utilityProvider.stopSpinner();
          // this.localService.updateDeclineStatus('TIME');
          // this.localService.updateDeclineStatus('EXPENSE');
          // this.localService.updateDeclineStatus('MATERIAL');
          // if (this.valueProvider.getUserFSRPreferences() && String(this.valueProvider.getUserFSRPreferences().FSR_PrintExpense) == 'true') {
          //   this.valueProvider.getTask().FSR_PrintExpenseOnSite = 'true';
          // } else if (!this.valueProvider.getUserFSRPreferences() && String(this.valueProvider.getUserPreferences()[0].FSR_PrintExpense) == 'true') {
          //   this.valueProvider.getTask().FSR_PrintExpenseOnSite = 'true';
          // } else {
          //   this.valueProvider.getTask().FSR_PrintExpenseOnSite = 'false';
          // }
          // if (this.valueProvider.getUserFSRPreferences() && String(this.valueProvider.getUserFSRPreferences().FSR_PrintExpenseComplete) == 'true') {
          //   this.valueProvider.getTask().FSR_PrintExpenseComplete = 'true';
          // } else if (!this.valueProvider.getUserFSRPreferences() && String(this.valueProvider.getUserPreferences()[0].FSR_PrintExpenseComplete) == 'true') {
          //   this.valueProvider.getTask().FSR_PrintExpenseComplete = 'true';
          // } else {
          //   this.valueProvider.getTask().FSR_PrintExpenseComplete = 'false';
          // }
          // this.localService.updateExpenseflagInTask(this.valueProvider.getTask());
          this.submitFinalDebrief(jobStatus);

        }).catch((err: any) => {
          this.logger.log(this.fileName, 'submitData', 'Error in updateTaskSubmitStatus : ' + JSON.stringify(err));
          this.utilityProvider.stopSpinner();

        });
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'submitData', 'Error in Promise : ' + JSON.stringify(err));
        this.utilityProvider.stopSpinner();
      });
    } catch (error) {

    }
  }

  /**
   * Wrapper to integrate the left part of execution when we put the same funtion into Queue
   * @param jobStatus
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

  async submitFinalDebrief(jobStatus) {
    let self = this;
    if (this.utilityProvider.isConnected()) {

      if (this.syncProvider.isAutoSyncing) {
        this.activityAfterDebrief(jobStatus);
        this.submitProvider.submitPromisesForOscTask();
        sessionStorage.setItem("getPendingOperations", 'true');
        return true;
      } else {
        if (this.valueProvider.getTask().IsStandalone == 'false') {
          this.utilityProvider.showSpinner();
          // let checkTask = await this.submitProvider.checkTaskAtOSC(this.valueProvider.getTask());
          // if (checkTask) {
          //   this.utilityProvider.stopSpinner();
          //   return this.submitProvider.displayErrors(checkTask);
          // }
        }
      }
      //09/20/18 Suraj Gorai -- if user loged in diffrent device its auto logout from current device
      this.cloudService.checkUser().then((data) => {
        if (data) {
          //09/19/18 Suraj Gorai - Check access token expire or not , if token expired then automatic request for new access token from OKTA based on user refresh token
          this.utilityProvider.checkExpireToken().then(() => {

            this.valueProvider.getTask().Task_Status = 'Completed-Awaiting Review';
            this.valueProvider.getTask().StatusID = Enums.Jobstatus.Completed_Awaiting_Review;

            this.valueProvider.getTask().Sync_Status = 'false';
            this.valueProvider.getTask().Date = new Date();
            // zohaib Khan - 04/11/2019: EFSM1-68: SP#85518: Duplicated lines/ attachments in production (TST2/Prod). Setting job is to value provider.
            this.valueProvider.setJobIdToSubmit(this.valueProvider.getTaskId());
            this.submitProvider.submitDebriefForTask(this.valueProvider.getTask(), "Online", false).then((success) => {
              this.cloudService.flushAnalyticsEvents();
              //07/27/2018 Mayur Varshney
              //Adding Else Condition for displaying pending sync icon after completing the job offline
              if (success) {
                this.localService.refreshTaskList();
              }
              //07/19/2018 Zohaib Khan
              //Erasing temprary user preferences data for next job by setting "" to this.valueProvider.setUserFSRPreferences("");
              this.valueProvider.setUserFSRPreferences(null);
              this.events.publish("refreshPreferences", null);
              if (jobStatus == 'OnSite') {
                this.navCtrl.push("SummaryPage");
                this.navCtrl.parent.select(6);
              } else {
                this.appCtrl.getRootNav().setRoot('SummaryPage', { ifCompleted: true });
              }
              this.utilityProvider.stopSpinner();
            }).catch((error: any) => {
              self.logger.log(self.fileName, 'submit', 'Error in submit : ' + JSON.stringify(error));
              this.valueProvider.setUserFSRPreferences(null);
              if (jobStatus == 'OnSite') {
                this.navCtrl.push("SummaryPage");
                this.navCtrl.parent.select(6);
              } else {
                this.appCtrl.getRootNav().setRoot('SummaryPage', { ifCompleted: true });
              }
              self.utilityProvider.stopSpinner();
            });
          }).catch((refreshtoken: any) => {
            this.logger.log(this.fileName, 'submitFinalDebrief', "Error in checkExpireToken : " + JSON.stringify(refreshtoken));
            this.cloudService.refreshToken(refreshtoken).then(() => {
              this.submitData(jobStatus);
            }).catch((err: any) => {
              this.logger.log(this.fileName, 'submitFinalDebrief', "Error in refreshToken: " + JSON.stringify(err));
            });
          });
        } else {
          this.syncProvider.isAutoSyncing =  false;
          this.syncProvider.isUserLoggedIn = false;
          this.utilityProvider.forcelogout("You are now logged out due to log in on another device.");
        }
      }).catch((err: any) => {
        this.logger.log(this.fileName, "submitFinalDebrief", 'Error in checkUser: ' + JSON.stringify(err));
        this.syncProvider.isAutoSyncing = false;
        this.syncProvider.isUserLoggedIn = false;
        // 02/19/2019 -- Mayur Varshney -- show toast on check user
        this.utilityProvider.checkUserIssueMessage(err);
        // }).catch((err: any) => {
        this.utilityProvider.stopSpinner();
        //   this.logger.log(this.fileName, "submitFinalDebrief", 'Error in SyncLoader:' + JSON.stringify(err));
        // });
      });
    } else {
      this.valueProvider.setUserFSRPreferences(null);
      if (jobStatus == 'OnSite') {
        this.navCtrl.push("SummaryPage");
        this.navCtrl.parent.select(6);
      } else {
        this.appCtrl.getRootNav().setRoot('SummaryPage', { ifCompleted: true });
      }
      this.utilityProvider.stopSpinner();
    }
  }
  //11/04/2018 Zohaib Khan: Filtering Reports from current state.
  getCurrentReportNames(response) {
    let resubmittedReport: any = [];
    let onSiteReport: any = [];
    let CompletedReport: any = [];
    let lov: any = []
    for (var i = 0; i < response.length; i++) {
      // 09/18/2019 -- Mayur Varshney -- apply check to filter out current task's FSR
      if (response[i].File_Name.split("_")[1] == this.valueProvider.getTaskId()) {
        if (response[i].File_Name.split("_")[2].split("-")[0] != undefined && response[i].File_Name.split("_")[2].split("-")[0] == 'Resubmitted') {
          resubmittedReport.push(response[i]);
        }
        if (response[i].File_Name.split("_")[2].split("-")[0] == 'OnsiteDebrief') {
          onSiteReport.push(response[i]);
        }
        if (response[i].File_Name.split("_")[2].split("-")[0] == 'CompletedDebrief') {
          CompletedReport.push(response[i]);
        }
      }
    }
    if (resubmittedReport.length > 0) {
      lov = resubmittedReport;
    }
    else if (resubmittedReport.length == 0 && CompletedReport.length > 0) {
      lov = CompletedReport;
    } else if (resubmittedReport.length == 0 && CompletedReport.length == 0 && onSiteReport.length > 0) {
      lov = onSiteReport;
    }
    return lov;
  }

  calculateTimeTotal(timeArray) {
    let grandtimeObject = { "Service_Start_Date": "Grand Total", "Work_Type": "", "Duration": "", "hours": 0, "mins": 0 };
    let subtotalObject = { "Service_Start_Date": "Sub Total", "Work_Type": "", "Duration": "", "hours": 0, "mins": 0 };
    let subTotalArray = [];
    timeArray.forEach((key, value) => {
      if (key.Work_Type != "Break") {
        grandtimeObject.Duration = this.calculateDuration(grandtimeObject, key);
        grandtimeObject.Duration = this.formatDuration(grandtimeObject.Duration);
        let workTypeSubTotal = subTotalArray.filter((obj) => { return obj.Work_Type == key.Work_Type });
        if (workTypeSubTotal.length == 1) {
          let index = subTotalArray.indexOf(workTypeSubTotal[0]);
          subTotalArray[index].Duration = this.calculateDuration(subTotalArray[index], key);
          subTotalArray[index].Duration = this.formatDuration(subTotalArray[index].Duration);
        } else {
          let subtotal = Object.assign({}, subtotalObject);
          subtotal.Work_Type = key.Work_Type;
          subtotal.Duration = this.calculateDuration(subtotal, key);
          subtotal.Duration = this.formatDuration(subtotal.Duration);
          subTotalArray.push(subtotal);
        }
      }
    });
    return { "subTotalArray": subTotalArray, "grandtimeObject": grandtimeObject };
  }

  /**
  *@author: Prateek(21/01/2019)
  *Unsubscribe all events.
  *App Optimization
  * @memberof CalendarPage
  */
  ionViewWillLeave(): void {
    this.events.unsubscribe('refreshPreferences');
  }

  /**
   * 11/12/2018 - redirect to SDR after Send data as params for SDR flow
   * Set setCurrentReport as null if new report is generated
   * @author Mayur Varshney
   */
  gotoSDR() {
    let result;
    if (this.taskObj.ReportID) {
      this.localService.getReportByID(this.valueProvider.getUserId(), this.taskObj.ReportID).then((res: any) => {
        result = res[0];
        this.valueProvider.setCurrentReport(result);
        if (res && res[0].REPORTSTATUS == Enums.ReportStatus.Completed) {
          this.utilityProvider.showSpinner();
          //21/08/2019 Gaurav Vachhani: Redirect user to Review Page according to the device.
          switch (res[0].DEVICEID) {
            case Enums.FlowIsolationProductId.ControlValve:
            case Enums.FlowIsolationProductId.Isolation:
            case Enums.FlowIsolationProductId.Controller:
            case Enums.FlowIsolationProductId.Instrument:
            case Enums.FlowIsolationProductId.LevelTroll:
            case Enums.FlowIsolationProductId.Regulator:
            case Enums.FlowIsolationProductId.TrimOnly:
              this.appCtrl.getRootNav().setRoot("IsoReviewSubmitPage", { reportdata: result });
              break;
            case Enums.Product.Actuator:
              this.appCtrl.getRootNav().setRoot("ReviewSubmitPage", { reportdata: result });
              break;
          }
        } else {
          this.appCtrl.getRootNav().setRoot("SdrTabsPage", { reportdata: result, task: this.taskObj.ReportID });
        }
      }).catch(err => {
        this.logger.log(this.fileName, "gotoSDR", 'Error in getReportStatus: ' + JSON.stringify(err));
      });
    } else {
      this.valueProvider.setCurrentReport(null);
      this.appCtrl.getRootNav().setRoot("SdrTabsPage", { Selected_Process: Enums.Selected_Process.FCR_AND_SDR, ReportID: null, task: this.valueProvider.getTask() });

    }
  }

  /**
   * Mayur Varshney
   * send attachment from mail modal without opening the mail client
   * @param {any} base64
   * @param {any} filename
   * @memberOf SummaryPage
   */
  openMailModal(base64, filename) {
    try {
      let base64parts = base64.split(',');
      if (base64parts[1] != "") {
        this.getToContacts().then((toContacts: any) => {
          this.localService.getCustomer(this.valueProvider.getTaskId()).then((custEmail: any) => {
            if (custEmail && custEmail.Email != '') {
              toContacts = toContacts.concat(custEmail.Email);
            }
            let compatibleAttachment = base64parts[1];
            let task = this.valueProvider.getTaskObject();
            let recipients = this.removeDuplicates(toContacts);
            let mailTo = this.utilityProvider.isNotNull(recipients) ? recipients.toString() : ' ';
            let mailBody = this.createMailTemplate(task);

            let params = {
              'isMail': true,
              'mailObj': {
                'attachment': [{ 'file_content': compatibleAttachment, 'file_name': filename }],
                'to': mailTo,
                'cc': '',
                'subject': 'Emerson Field Service Report',
                'body': mailBody.body,
                'emailBody': mailBody.emailBody
              }
            };
            let mailModal = this.utilityProvider.showModal("NotesModalPage", params, { enableBackdropDismiss: false, cssClass: 'Mail-Selector-Modal' });
            mailModal.present();
          });
        });
      }
      else {
        let msg = 'Unable to attach PDF!!!';
        this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
      }
    } catch (error) {
      this.logger.log(this.fileName, 'openMailClent', error.message);
      let msg = 'Unable to attach PDF!!!';
      this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
    };
  }

  createMailTemplate(task) {
    let customerName = (task && task.Customer_Name) ? task.Customer_Name : '';
    // 09/28/2019 -- Mayur Varshney -- format user name
    let currentUserName = (task && task.Name) ? this.utilityProvider.formattedCurrentUserName(task.Name) : '';
    // let start_date;
    // let end_date;
    // if (this.valueProvider.getUser().timeZoneIANA) {
    //   start_date = (task && task.Start_Date) ? moment(task.Start_Date).tz(this.valueProvider.getUser().timeZoneIANA).format('YYYY-MM-DD HH:mm:ss.SSS Z') : '';
    //   end_date = (task && task.End_Date) ? moment(task.End_Date).tz(this.valueProvider.getUser().timeZoneIANA).format('YYYY-MM-DD HH:mm:ss.SSS Z') : '';
    // } else {
    //   start_date = (task && task.Start_Date) ? moment(task.Start_Date).utc().format('YYYY-MM-DD HH:mm:ss.SSS Z') : '';
    //   end_date = (task && task.End_Date) ? moment(task.End_Date).utc().format('YYYY-MM-DD HH:mm:ss.SSS Z') : '';
    // }

    let modalEmailBody = 'Dear ' + (customerName) + ',\n\nThank you for your business. \n\nPlease refer to attached report for the Field Service with the following details: \n\u2022 Service Request Number : ' + ((task && task.Service_Request) ? task.Service_Request : '') + '\n\u2022 Field Job Number : ' + (task ? (task.Job_Number ? task.Job_Number : (task.Task_Number ? task.Task_Number : '')) : '') + '\n\u2022 PO Number : ' + ((task && task.Customer_PONumber) ? task.Customer_PONumber : '') + '\n\u2022 Field Job Type : ' + ((task && task.Job_Description) ? task.Job_Description : '') + '\n\nShould you have any question, please email us at ContactUs@Emerson.com or call your local Emerson representative and provide above details for reference. \n\nThank you. \n\nSincerely,\n\n' + currentUserName;

    let emailBody = "<div style='border:2px;border-style:solid;border-color:lightgrey;padding:3px;'><div style='margin-bottom:10px;background-color:black;color:white;'><div style='text-align:right;'><span><a href='https://www.facebook.com/EmersonAutomationSolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=31da83f1a1b0418284454e08f03d0f0d&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.facebook + "' ></img></a></span><span><a href='https://twitter.com/search?q=Emerson%20Automation%20Solutions&src=typd'><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.twitter + "'></img></a></span><span><a href='https://www.linkedin.com/company/emerson-automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=f1f81298eb8c4d6e85d872355cd4ad22&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.linkedin + "' ></img></a></span><span><a href='https://www.youtube.com/Emersonautomationsolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=79be647e1eb143b6b86aff0599c01d3c&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.youtube + "' ></img></a></span></div></div><br><div style='padding:5px;'><a href='https://www.emerson.com/en-us/automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=679a6f9a219e4570b8dedfde81bf3bec&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><span><img style='height:auto;width:auto;' src='" + Enums.MailIcon.emersonLogo + "'></img></span></a></div><br><br><div style='padding:5px;'>Dear " + (customerName) + ",\n\nThank you for your business. \n\nPlease refer to attached report for the Field Service with the following details: \n\u2022 Service Request Number : " + ((task && task.Service_Request) ? task.Service_Request : "") + "\n\u2022 Field Job Number : " + (task ? (task.Job_Number ? task.Job_Number : (task.Task_Number ? task.Task_Number : "")) : "") + "\n\u2022 PO Number : " + ((task && task.Customer_PONumber) ? task.Customer_PONumber : "") + "\n\u2022 Field Job Type : " + ((task && task.Job_Description) ? task.Job_Description : "") + "\n\nShould you have any question, please email us at ContactUs@Emerson.com or call your local Emerson representative and provide above details for reference. \n\nThank you. \n\nSincerely,\n\n" + currentUserName + "</div><br><br><table style='width:100%;padding:10px;background-color:black;color:white;'><tr><td width='75%'><div style='text-align:left;'><span>Emerson Automation Solution</span><br><span><a href='https://www.emerson.com'><span style='color:blue;'>www.Emerson.com<span></a></span></div></td><td><div style='text-align:right;float:right;'><span><a href='https://www.facebook.com/EmersonAutomationSolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=31da83f1a1b0418284454e08f03d0f0d&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.facebook + "' ></img></a></span><span><a href='https://twitter.com/search?q=Emerson%20Automation%20Solutions&src=typd'><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.twitter + "'></img></a></span><span><a href='https://www.linkedin.com/company/emerson-automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=f1f81298eb8c4d6e85d872355cd4ad22&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.linkedin + "' ></img></a></span><span><a href='https://www.youtube.com/Emersonautomationsolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=79be647e1eb143b6b86aff0599c01d3c&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.youtube + "' ></img></a></span></div></td></tr></table></div>";

    let standaloneEmailBody = "<div style='border:2px;border-style:solid;border-color:lightgrey;padding:3px;'><div style='margin-bottom:10px;background-color:black;color:white;'><div style='text-align:right;'><span><a href='https://www.facebook.com/EmersonAutomationSolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=31da83f1a1b0418284454e08f03d0f0d&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.facebook + "' ></img></a></span><span><a href='https://twitter.com/search?q=Emerson%20Automation%20Solutions&src=typd'><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.twitter + "'></img></a></span><span><a href='https://www.linkedin.com/company/emerson-automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=f1f81298eb8c4d6e85d872355cd4ad22&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.linkedin + "' ></img></a></span><span><a href='https://www.youtube.com/Emersonautomationsolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=79be647e1eb143b6b86aff0599c01d3c&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.youtube + "' ></img></a></span></div></div><br><div style='padding:5px;'><a href='https://www.emerson.com/en-us/automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=679a6f9a219e4570b8dedfde81bf3bec&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><span><img style='height:auto;width:auto;' src='" + Enums.MailIcon.emersonLogo + "'></img></span></a></div><br><br><div style='padding:5px;'>Dear " + (customerName) + ",\n\nThank you for your business. \n\nPlease refer to attached report for the Field Service with the following details: \n\u2022 Field Job Number : " + (task ? (task.Job_Number ? task.Job_Number : (task.Task_Number ? task.Task_Number : "")) : "") + "\n\nShould you have any question, please email us at ContactUs@Emerson.com or call your local Emerson representative and provide above details for reference. \n\nThank you. \n\nSincerely,\n\n" + currentUserName + "</div><br><br><table style='width:100%;padding:10px;background-color:black;color:white;'><tr><td width='75%'><div style='text-align:left;'><span>Emerson Automation Solution</span><br><span><a href='https://www.emerson.com'><span style='color:blue;'>www.Emerson.com<span></a></span></div></td><td><div style='text-align:right;float:right;'><span><a href='https://www.facebook.com/EmersonAutomationSolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=31da83f1a1b0418284454e08f03d0f0d&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.facebook + "' ></img></a></span><span><a href='https://twitter.com/search?q=Emerson%20Automation%20Solutions&src=typd'><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.twitter + "'></img></a></span><span><a href='https://www.linkedin.com/company/emerson-automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=f1f81298eb8c4d6e85d872355cd4ad22&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.linkedin + "' ></img></a></span><span><a href='https://www.youtube.com/Emersonautomationsolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=79be647e1eb143b6b86aff0599c01d3c&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.youtube + "' ></img></a></span></div></td></tr></table></div>";

    let standaloneModalEmailBody = 'Dear ' + (customerName) + ',\n\nThank you for your business. \n\nPlease refer to attached report for the Field Service with the following details: \n\u2022 Field Job Number : ' + (task ? (task.Job_Number ? task.Job_Number : (task.Task_Number ? task.Task_Number : '')) : '') + '\n\nShould you have any question, please email us at ContactUs@Emerson.com or call your local Emerson representative and provide above details for reference. \n\nThank you. \n\nSincerely,\n\n' + currentUserName;

    return {
      "body": task.IsStandalone == 'false' ? modalEmailBody : standaloneModalEmailBody,
      "emailBody": task.IsStandalone == 'false' ? emailBody : standaloneEmailBody
    }
  }
}

