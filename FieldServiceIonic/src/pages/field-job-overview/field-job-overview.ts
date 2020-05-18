import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Platform, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseProvider } from '../../providers/database/database';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { ValueProvider } from '../../providers/value/value';
import { UtilityProvider } from '../../providers/utility/utility';
import { SyncProvider } from '../../providers/sync/sync';
import { DomSanitizer } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LoggerProvider } from '../../providers/logger/logger';
import { CloudService } from '../../providers/cloud-service/cloud-service';
import { TransformProvider } from '../../providers/transform/transform';
import * as moment from "moment-timezone";
import { Clipboard } from '@ionic-native/clipboard';
// import { Base64 } from '@ionic-native/base64';  26-7-18, Suraj Gorai, Remove Base64 plugin
import { Device } from '@ionic-native/device';
import * as Enums from '../../enums/enums';
import { SubmitProvider } from '../../providers/sync/submit/submit';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-field-job-overview',
  templateUrl: 'field-job-overview.html',
})
export class FieldJobOverviewPage {

  fileName: any = 'Field_Job_Overview_Page';
  header_data: any;
  public notesList = [];
  public productList = [];
  public manufacturerList = [];
  public StatusList = [];
  public attachmentList = [];
  public contactList = [];
  public taskObj: any = {};
  public installBaseList = [];
  public toolsList = [];
  public taskId = this.valueProvider.getTaskId();
  public resourceId;
  public tools: any = {
    Tool_Name: ""
  };
  public type = '';
  public newRow = [];
  public map: any = null;
  public isVisible: boolean = false;
  public toolId: any;
  taskStatus: any;
  public isEnabled: boolean = false;
  dateCondition: any = false;
  page: any;
  devicePlatform: any;
  filePath: any;
  filePathTasks: any;
  enums: any;
  taskStatusId: any;
  converted_Start_Date: any;
  converted_End_Date: any;

  
  constructor(public submitProvider: SubmitProvider,private transformProvider: TransformProvider, public sanitizer: DomSanitizer, public events: Events, public navCtrl: NavController, public navParams: NavParams, private translateService: TranslateService, private valueProvider: ValueProvider, public localService: LocalServiceProvider, public dbCtrl: DatabaseProvider, public utilityProvider: UtilityProvider, public modalController: ModalController, public viewCtrl: ViewController, public plt: Platform, public syncProvider: SyncProvider, public cloudService: CloudService, private theInAppBrowser: InAppBrowser, public logger: LoggerProvider, public clipboard: Clipboard, public platform: Platform, public device: Device) {
    //08/10/2018 Zohaib Khan: Updated file path.
    this.filePath = cordova.file.dataDirectory + '/srfiles/';
    this.filePathTasks = cordova.file.dataDirectory + '/taskfiles/';
    this.enums = Enums;
    this.devicePlatform = this.device.platform.toLowerCase();
    this.header_data = { title1: "Debrief", title2: "Job #", taskId: this.taskId };

  }

  ionViewDidEnter() {
    // 07/29/2018 Gurkirat Singh -- Removed spinner on page refresh
    //Prateek(23/01/2019) Shifted all events in didenter. 
    this.events.subscribe('refreshPageData', (time) => {
      //this.utilityProvider.showSpinner();
      this.logger.log(this.fileName, " FieldJobOverviewPage constructor", 'refreshPageData' + time);
      // 04/01/2019 -- Mayur Varshney -- optimise code
      this.loadData().then((res: any) => {
        this.utilityProvider.stopSpinner();
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'ionViewDidEnter', 'Error in ionViewDidEnter, loadData : ' + JSON.stringify(error));
      });
    });
    // 07/29/2018 Gurkirat Singh -- Removed spinner on page load
    this.utilityProvider.showSpinner();
    let index = this.navCtrl.getActive().index;
    this.logger.log(this.fileName, 'ionViewDidEnter OverView', "index" + index);
    this.page = this.navParams.get('page');
    this.taskStatus = this.valueProvider.getTask().Task_Status;
    this.taskStatusId = this.valueProvider.getTask().StatusID;
    this.sideMenuView("Debrief");
    //this.notesList = this.valueProvider.getTaskNotes();
    //if (this.notesList.length == 0) {

    //}
    //else {
    //  this.loadData().then((res: any) => {
    //    this.utilityProvider.stopSpinner();
    //  }).catch((error: any) => {
    //    this.utilityProvider.stopSpinner();
    //    this.logger.log(this.fileName, 'constructor', 'Error in constructor : ' + error);
    //  });
    //}

    // 04/01/2019 -- Mayur Varshney -- optimise code
    this.loadData().then((res: any) => {
      this.utilityProvider.stopSpinner();
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'ionViewDidEnter', 'Error in ionViewDidEnter, loadData : ' + JSON.stringify(error));
    });
  }

  ionViewDidLoad() {
    this.resourceId = this.valueProvider.getResourceId();
    let taskobj = this.valueProvider.getTaskList().filter((item => { return item.Task_Number == this.taskId }))[0];
    this.valueProvider.setTask(taskobj);
  }

  sideMenuView(user) {
    this.events.publish('user:created', user);
  }


  // 04/01/2019 -- Mayur Varshney -- comment code not in use
  // setTask() {
  //   let taskobj = this.valueProvider.getTaskList().filter((item => { return item.Task_Number == this.taskId }))[0];
  //   this.valueProvider.setTask(taskobj).then(() => {
  //     this.loadData().then((res: any) => {
  //       // this.utilityProvider.stopSpinner();
  //     }).catch((error: any) => {
  //       this.utilityProvider.stopSpinner();
  //       // 12-28-2018 -- Mansi Arora -- change in logs comment
  //       this.logger.log(this.fileName, 'setTask', 'Error in setTask, loadData : ' + JSON.stringify(error));
  //     });
  //   })
  //     // 12-28-2018 -- Mansi Arora -- error handled by logging
  //     .catch((error: any) => {
  //       this.utilityProvider.stopSpinner();
  //       this.logger.log(this.fileName, 'setTask', 'Error in setTask in value provider : ' + JSON.stringify(error));
  //     });
  // }

  // 04/01/2019 -- Mayur Varshney -- optimise code
  async loadData() {
    try {
      this.isEnabled = false;
      let res = await this.localService.getTask();
      await this.valueProvider.setTask(res[0]);
      this.valueProvider.setTaskObject(res[0]);
      await this.getAttachmentlist();
      this.getNotesList();
      this.getContactListInfo();
      this.getTaskListInfo();
      this.getInstallBaseInfo();
      this.getToolsList();
      this.getProductlist();
      this.getStatuslist();
      this.getManufacturerlist();    
    } catch(error) {
      this.logger.log(this.fileName, 'loadData', 'Error: ' + error.message);
    } finally {
      this.utilityProvider.stopSpinner();
    }
  }

  // 04/17/2019 -- Mayur Varshney -- function not in use
  // getInstalledBase() {
  //   this.installBaseList = this.valueProvider.getInstallBase();
  // }

  getProductlist() {
    if (this.valueProvider.getProductList.length > 0) {
      this.productList = this.valueProvider.getProductList();
    }
    else {
      this.localService.getProducts().then((res: any) => {
        this.productList = res;
        this.valueProvider.setProductList(res);
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'getProductlist', 'Error in getProductlist, getProducts local service : ' + JSON.stringify(error));
      });
    }
  }

  getStatuslist() {
    if (this.valueProvider.getStatusList.length > 0) {
      this.StatusList = this.valueProvider.getStatusList();
    }
    else {
      this.localService.getStatus().then((res: any) => {
        this.StatusList = res;
        this.valueProvider.setStatusList(res);
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'getStatuslist', 'Error in getStatuslist, getStatus local service : ' + JSON.stringify(error));
      });
    }
  }

  getManufacturerlist() {
    if (this.valueProvider.getManufacturerList.length > 0) {
      this.manufacturerList = this.valueProvider.getManufacturerList();
    }
    else {
      this.localService.getManufacturer().then((res: any) => {
        this.manufacturerList = res;
        this.valueProvider.setManufacturerList(res);
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'getManufacturerlist', 'Error in getManufacturerlist, getManufacturer local service : ' + JSON.stringify(error));
      });
    }
  }

  isOnline() {
    return this.utilityProvider.isConnected();
  }

  refreshTaskList() {
    this.localService.refreshTaskList().then((res: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'refreshTaskList', 'got response after refreshing task list');
    }).catch((error: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'refreshTaskList', 'Error in getting response after refreshing task list : ' + JSON.stringify(error));
    });
  }

  /**
   * 07/27/2018 Mayur Varshney
   * Show spinner on modal did dismiss
   * Apply .then condition to prioritize the self.insertInstallBaseOnMCS(data) function for submitting the installbase, then again refresh task list
   * adding refreshTaskList function for refreshing Field Job List for both online and offline cases, and applying syncPending Icon on the basis of different condition
   * If Sync Status is pending then list will refresh and will display pendingSync Icon for the particular job else not.
   * Handle condition via catch if found any error during refreshing task list
   * @memberOf FieldJobOverviewPage
   */
  addInstalledBase() {
    let self = this;
    let installedBaseList = [];
    let params = { productList: this.productList, StatusList: this.StatusList, manufacturerList: this.manufacturerList };
    let installedBaseModal = this.utilityProvider.showModal("InstalledBaseModalPage", params, { enableBackdropDismiss: false, cssClass: 'InstalledBaseModalPage' });
    installedBaseModal.onDidDismiss(installedBaseObj => {
      if (installedBaseObj != undefined) {
        self.utilityProvider.showSpinner();
        installedBaseList = self.transformProvider.getInstalledBaseForLocal([installedBaseObj]);
        installedBaseList[0].InstalledBaseId = String(this.utilityProvider.getUniqueKey());
        installedBaseList[0].UniqueMobileId = installedBaseList[0].InstalledBaseId;
        this.localService.saveInstalledBase(installedBaseList[0]).then((res: any) => {
          // installedBaseList[0]['InstalledBaseId'] = res;
          if (self.isOnline()) {
            self.submitIBOnMCS(installedBaseList).then((res: any) => {
              self.utilityProvider.stopSpinner();
              self.refreshTaskList();

            }).catch((error: any) => {
              self.logger.log(self.fileName, 'addInstalledBase', 'Error in insertInstallBase on server : ' + JSON.stringify(error));
              self.utilityProvider.stopSpinner();
            });
          }
          else {
            self.installBaseList = installedBaseList;
            self.utilityProvider.stopSpinner();
            self.refreshTaskList();
            self.getInstallBaseInfo();
          }
        }).catch((error: any) => {
          // 12-28-2018 -- Mansi Arora -- change in logs comment
          this.logger.log(this.fileName, 'addInstalledBase', 'Error in addInstalledBase, saveInstalledBase local service : ' + JSON.stringify(error));
        });
      }
    });
    installedBaseModal.present();
  }

  /**
   * 07/27/2018 Mayur Varshney
   * implemented promise functionality 
   * return true if succesfully get response from the API
   * Handle error by using catch
   * @memberOf FieldJobOverviewPage
   */
  async submitIBOnMCS(InstalledBaseArr) {
    try {
      if (this.utilityProvider.isConnected()) {
        if(this.syncProvider.isAutoSyncing) {
          this.submitProvider.submitPromisesIBForOsc();
          sessionStorage.setItem("getPendingOperations",'true');
        } else {
          let result = await this.syncProvider.validateUserDeviceAndToken();
          if(result) {
            await this.submitProvider.submitInstallBase(InstalledBaseArr);
            this.getInstallBaseInfo();
          }
        }
      }
    } catch(error) {
      this.logger.log(this.fileName, 'submitIBonMCS', 'Error: ' + error.message);
    }
  }

  /**
   * 07/27/2018 Mayur Varshney
   * Show spinner on modal did dismiss
   * Apply .then condition to prioritize the self.saveInstalledBase(data) function for updating the installbase, then again refresh task list
   * Adding refreshTaskList function for refreshing Field Job List for both online and offline cases, and applying syncPending Icon on the basis of different condition
   * If Sync Status is pending then list will refresh and will display pendingSync Icon for the particular job else not.
   * Handle condition via catch if found any error during refreshing task list
   * @memberOf FieldJobOverviewPage
   */
  editInstalledBase(installedBase, index) {
    let self = this;
    let params = { productList: this.productList, StatusList: this.StatusList, manufacturerList: this.manufacturerList, installedBase: installedBase };
    let installedBaseModal = this.utilityProvider.showModal("InstalledBaseModalPage", params, { enableBackdropDismiss: false, cssClass: 'InstalledBaseModalPage' });
    installedBaseModal.onDidDismiss(installedBaseObj => {
      if (installedBaseObj != undefined) {
        installedBaseObj.Start_Date = new Date();
        installedBaseObj.Status_Id = parseInt(installedBaseObj.Status_Id);
        installedBaseObj.Sync_Status = "false";
        installedBaseObj.Product_Id = parseInt(installedBaseObj.Product_Id);
        installedBaseObj.Manufacturer_Id = parseInt(installedBaseObj.Manufacturer_Id);
        this.localService.saveInstalledBase(installedBaseObj).then((res: any) => {
          self.utilityProvider.showSpinner();
          if (this.isOnline()) {
            installedBaseObj.UniqueMobileId = installedBaseObj.InstalledBaseId;
            this.submitIBOnMCS([installedBaseObj]).then((res: any) => {
              self.utilityProvider.stopSpinner();
              self.refreshTaskList();
            }).catch((error: any) => {
              // 12-28-2018 -- Mansi Arora -- change in logs comment
              self.logger.log(self.fileName, 'editInstalledBase', 'Error in editInstalledBase, submitIBonMCS : ' + JSON.stringify(error));
              self.utilityProvider.stopSpinner();
            });
            self.getInstallBaseInfo();
          }
          else {
            this.installBaseList[index] = installedBaseObj;
            this.getInstallBaseInfo();
            self.utilityProvider.stopSpinner();
            self.refreshTaskList();
          }
          self.refreshNoteList();
        }).catch((error: any) => {
          // 12-28-2018 -- Mansi Arora -- change in logs comment
          self.logger.log(self.fileName, 'editInstalledBase', 'Error in editInstalledBase, saveInstalledBase local service : ' + JSON.stringify(error));
        });
      }
    });
    installedBaseModal.present();
  }

  refreshNoteList() {
    this.localService.getNotesList(String(this.valueProvider.getTaskId())).then((res: any[]) => {
      this.valueProvider.setNote(res);
    }).catch((error: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'refreshNoteList', 'Error in refreshNoteList, getNoteList local service : ' + JSON.stringify(error));
    });
  }

  /**
   * 26-7-18, Suraj Gorai
   * Remove Platform specific code for conversion from file to base64 
   *
   * @returns
   * @memberof FieldJobOverviewPage
   */
  getAttachmentlist() {
    this.attachmentList = [];
    let allAttachment;
    let foldername;
    let id;
    let filepath = cordova.file.dataDirectory;
    return new Promise((resolve, reject) => {
      allAttachment = this.valueProvider.getTaskAttachment().filter((item) => { return item.AttachmentType != 'fsr'; });
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'getAttachmentlist', 'Done getTaskAttachment value provider');
      if (this.plt.is('cordova')) {
        if (allAttachment.length > 0) {
          for (let attachment of allAttachment) {
            if (attachment.File_Type.indexOf('image') > -1) {
              //08/30/2018 Zohaib Khan: Selecting folder and id based on attachment wather its SR attachment or task attachment
              if (attachment.SRID && attachment.SRID != "") {
                foldername = "/srfiles/";
                id = attachment.SRID;
              }
              if (attachment.Task_Number && attachment.Task_Number != "") {
                foldername = "/taskfiles/";
                id = attachment.Task_Number;
              }
              //08/09/2018 Zohaib Khan: Checking if thumbnail is already generated or not is not than generate it and push attachmen data otherwise just push attachment data.
              this.createThumbnailIfNotExist(attachment).then(res => {
                //08/14/2018 Zohaib Khna: Checking if file exist or not if not than use the actual location
                this.utilityProvider.checkFileIfExist(filepath + foldername + id + "/thumbnails/", "thumb_" + attachment.File_Name).then((result) => {
                  attachment.isThumbnailCreated = result;
                  this.pushAttachmentData(attachment);
                })
                  // 12-28-2018 -- Mansi Arora -- error handled by logging
                  .catch((error: any) => {
                    this.logger.log(this.fileName, 'getAttachmentlist', 'Error in getAttachmentlist, checkFileIfExist utility provider ' + JSON.stringify(error));
                  });
              })
                // 12-28-2018 -- Mansi Arora -- error handled by logging
                .catch((error: any) => {
                  this.logger.log(this.fileName, 'getAttachmentlist', 'Error in getAttachmentlist, createThumbnailIfNotExist ' + JSON.stringify(error));
                });
            } else {
              this.pushAttachmentData(attachment);
            }
          }
          resolve(true);
        } else {
          resolve(true);
          this.logger.log(this.fileName, 'getAttachmentlist', 'no attachment');
        }
      } else {
        this.attachmentList = allAttachment.map((attachment) => {
          let attachmentObject: any = {};
          // 10/01/2018 -- Mayur Varshney -- split name and extension by getting the index of pre-dot of extension
          let attachmentTypeAndName = this.utilityProvider.generateFileNameAndType(attachment.File_Name);
          attachmentObject.contentType = attachment.File_Type;
          attachmentObject.fileDisc = attachmentTypeAndName.Name;
          attachmentObject.filename = attachment.File_Name;
          attachmentObject.filetype = attachmentTypeAndName.Type;
          return attachmentObject;
        });
        resolve(true);
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'getAttachmentlist', 'Error in getAttachmentlist ' + JSON.stringify(error));
      return (Promise.reject);
    })
  }

  //08/08/2018 Zohaib Khan: Checking if attachment exists in thumbnails folder or not if not than generate thumbnail.
  createThumbnailIfNotExist(attachment) {
    let foldername;
    let id;
    return new Promise((resolve, reject) => {
      let filepath = cordova.file.dataDirectory;
      //08/30/2018 Zohaib Khan: Selecting folder and id based on attachment wather its SR attachment or task attachment
      if (attachment.SRID && attachment.SRID != "") {
        foldername = "/srfiles/";
        id = attachment.SRID;
      }
      if (attachment.Task_Number && attachment.Task_Number != "") {
        foldername = "/taskfiles/";
        id = attachment.Task_Number;
      }
      //08/09/2018 Zohaib Khan: Checking if thumbnail is already generated or not. If not than generate it and move it to thumbnails folder.
      this.utilityProvider.checkFileIfExist(filepath + foldername + id + "/thumbnails/", "thumb_" + attachment.File_Name).then((res) => {
        if (!res) {
          this.utilityProvider.generateThumbnail(filepath + foldername + id + "/" + attachment.File_Name, 60, 90, 120, "thumb_" + attachment.File_Name).then((res) => {
            this.utilityProvider.moveFile(filepath, "thumb_" + attachment.File_Name, filepath + foldername + id + "/thumbnails", "thumb_" + attachment.File_Name).then(res => {
              resolve(true);
            })
              // 12-28-2018 -- Mansi Arora -- error handled by logging
              .catch((err: any) => {
                this.logger.log(this.fileName, 'createThumbnailIfNotExist', 'Error in createThumbnailIfNotExist, moveFile utility provider ' + JSON.stringify(err));
              });
          })
            // 12-28-2018 -- Mansi Arora -- error handled by logging
            .catch((err: any) => {
              this.logger.log(this.fileName, 'createThumbnailIfNotExist', 'Error in createThumbnailIfNotExist, generateThumbnail utility provider ' + JSON.stringify(err));
            });
        }
        else {
          resolve(false);
        }
      }).catch((err: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'createThumbnailIfNotExist', 'Error in createThumbnailIfNotExist, checkFileIfExist utility provider ' + JSON.stringify(err));
        resolve(false);
      });
    })
      // 12-28-2018 -- Mansi Arora -- error handled by logging
      .catch((err: any) => {
        this.logger.log(this.fileName, 'createThumbnailIfNotExist', 'Error in createThumbnailIfNotExist ' + JSON.stringify(err));
      });
  }
  //08/09/2018 Zohaib Khan: pushing  Attachment data to attachmentList to show them in overviewpage   .

  pushAttachmentData(attachment) {
    let self = this;
    // 10/01/2018 -- Mayur Varshney -- split name and extension by getting the index of pre-dot of extension
    let attachmentNameAndType = this.utilityProvider.generateFileNameAndType(attachment.File_Name);
    let attachmentObject: any = { "filename": "", "fileDisc": "", "file": "", "filetype": "", "data": "", "contentType": "", "base64": "" };
    attachmentObject.contentType = attachment.File_Type;
    attachmentObject.fileDisc = attachmentNameAndType.Name;
    attachmentObject.filename = attachment.File_Name;
    attachmentObject.filetype = attachmentNameAndType.Type;
    attachmentObject.SRID = attachment.SRID;
    //08/14/2018 Zohaib Khan: Thumbnail location selection.
    attachmentObject.isThumbnailCreated = attachment.isThumbnailCreated;
    attachmentObject.Task_Number = attachment.Task_Number;
    // 09/04/2018 -- Mayur Varshney -- Adding attachment status to show spinner and pending icon if attachment is not loading i.e. Attachment_Status ='0'
    attachmentObject.Attachment_Status = attachment.Attachment_Status;
    let ifAttachmentExits = this.attachmentList.some((el) => {
      return (el.filename == attachmentObject.filename)// && el.base64 == attachmentObject.base64);
    });
    if (ifAttachmentExits) {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'pushAttachmentData', 'attchment already exists');
    }
    else {
      self.attachmentList.push(attachmentObject);
    }
  }

  segmentChanged(event) {
    this.translateService.use(event._value);
  }

  getNotesList() {
    //10/01/2019 kamal : filter notes and show non debrief notes
    let tempNote: any[] = this.valueProvider.getTaskNotes();
    this.notesList = [];
    for (let i = 0; i < tempNote.length; i++) {
      if (tempNote[i].Created_By != 'Mobile RNT' && (tempNote[i].Notes_type != 'Action Taken' || tempNote[i].Notes_type != 'Customer Site Information' || tempNote[i].Notes_type != 'Findings' || tempNote[i].Notes_type != 'Installed Base')) {
        //18/01/2019 Prateek : filter duplicate notes
        let tempArr = this.notesList.filter((item) => {
          return item.Notes_ID == tempNote[i].Notes_ID
        });
        if (tempArr.length == 0) {
          this.notesList.push(tempNote[i]);
        }
      }
    }

    this.logger.log(this.fileName, 'getNotesList', 'number of notes : ' + this.notesList.length);
  }

  getTaskListInfo() {
    this.taskObj = this.valueProvider.getTask();
    // 01/03/2019 -- Mayur Varshney -- calling function to convert start and end date
    this.convertDateByTimezone(this.taskObj);
    // 02/06/2019 -- No need to convert the start date to UTC as we are already getting UTC converted Date-time
    let startDate = moment(this.taskObj.Start_Date).utc().format("YYYY-MM-DD");
    if (startDate > moment.utc(new Date()).format("YYYY-MM-DD")) {
      this.dateCondition = true;
    }
  }

  // 01/03/2019 -- Mayur Varshney -- Convert Start And End Date according to user timezone
  convertDateByTimezone(taskObj) {
    // 01/30/2019 -- Mayur Varshney -- get timeZoneIANA from tables, no need to convert it now
    let userPreferredTimeZone = this.valueProvider.getUser().timeZoneIANA;
    let preferredTimeZone = this.valueProvider.getUserPreferences()[0].timeZoneIANA;
    if (userPreferredTimeZone == preferredTimeZone) {
      this.converted_Start_Date = moment(taskObj.Start_Date).tz(userPreferredTimeZone).format("DD-MMM-YYYY");
      this.converted_End_Date = moment(taskObj.End_Date).tz(userPreferredTimeZone).format("DD-MMM-YYYY");
    } else {
      this.converted_Start_Date = moment(taskObj.Start_Date).tz(preferredTimeZone).format("DD-MMM-YYYY");
      this.converted_End_Date = moment(taskObj.End_Date).tz(preferredTimeZone).format("DD-MMM-YYYY");
    }
  }

  getContactListInfo() {
    this.contactList = this.valueProvider.getContact();
    this.valueProvider.setUserEmailId(this.contactList);
  }

  getInstallBaseInfo() {
    this.localService.getInstallBaseList(this.taskId).then((res: any) => {
      this.installBaseList = res;
      this.valueProvider.setInstallBase(res);
    })
      // 12-28-2018 -- Mansi Arora -- error handled by logging
      .catch((err: any) => {
        this.logger.log(this.fileName, 'getInstallBaseInfo', 'Error in getInstallBaseInfo, getInstallBaseList local service ' + JSON.stringify(err));
      });
  }

  getToolsList() {
    this.toolsList = this.valueProvider.getTool();
  }

  addTool() {
    let newObject = { Tool_Name: this.tools.Tool_Name }
    this.localService.insertTool(newObject).then((res): any => {
      newObject['ID'] = res;
      this.toolsList.push(newObject);
    }).catch((error: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'addTool', 'Error in addTool, insertTool local service : ' + JSON.stringify(error));
    });
    this.valueProvider.setTool(this.toolsList);
    this.tools.Tool_Name = "";
  }

  deleteTool(tool, index) {
    this.toolsList.splice(index, 1);
    this.localService.deleteTool(tool.ID);
  }

  /**
   * 09/13/2018 Suraj Gorai --show toast message in if user try to open in offline mode
   * @memberOf FieldJobOverviewPage
   */
  mapClicked() {
    if (this.utilityProvider.isConnected()) {
      let params = { ifNotes: false };
      let myModal = this.utilityProvider.showModal("MapModalPage", params, { enableBackdropDismiss: false, cssClass: 'MapModalPage' });
      myModal.present();
      this.isVisible = !this.isVisible;
    } else {
      this.utilityProvider.presentToastButtom('Map can not open in offline mode!!!', '4000', 'top', '', 'OK');
    }
  };

  //remove internet connectivity check /mayur
  notesReadmore(notes, notesType, index) {
    let params = { Notes: notes, NotesType: notesType, ifNotes: true };
    let myModal = this.utilityProvider.showModal("MapModalPage", params, { enableBackdropDismiss: false, cssClass: 'ReadMoreModalPage' });
    myModal.present();
    this.isVisible = !this.isVisible;
  }

  /**
   * Wrapper to integrate the left part of execution when we put the same funtion into Queue
   * Rajat 
   */
  // activityAfterDebrief(oldStatus){
  //   this.insertTaskChangeLog(oldStatus);
  //   this.localService.refreshTaskList().then((res: any) => {
  //     if (res) {
  //       this.utilityProvider.stopSpinner();
  //     }
  //   }).catch((error: any) => {
  //     this.logger.log(this.fileName, 'enableDebriefButton', 'Error in refreshing task list after enableDebriefButton : ' + JSON.stringify(error));
  //     this.utilityProvider.stopSpinner();
  //   });
  // }

  async acceptJob() {
    try {
        this.utilityProvider.showSpinner();
      // if(this.utilityProvider.isConnected()) {
      //   let checkTask = await this.submitProvider.checkTaskAtOSC(this.valueProvider.getTask());
      //   if(checkTask) {
      //     this.utilityProvider.stopSpinner();
      //     return this.submitProvider.displayErrors(checkTask);
      //   }
      // }
      let taskDetail = await this.updateTaskStatusLocal();
      await this.updateTaskStatusOSC(taskDetail);
      this.localService.refreshTaskList(); // Refresh task list to to show pending sync icon (if any) on tasks
    } catch(error) {
      this.logger.log(this.fileName, 'enableDebriefButton', 'Error: ' + error.message);
    } finally {
      this.utilityProvider.stopSpinner();
    }
  }

  async updateTaskStatusOSC(taskDetail) {
    try {
      if (this.utilityProvider.isConnected()) {
        if(this.syncProvider.isAutoSyncing) {
          this.submitProvider.submitPromisesForOscTask();
          sessionStorage.setItem("getPendingOperations",'true');
        } else {
          let result = await this.syncProvider.validateUserDeviceAndToken();
          if(result) {
            await this.submitProvider.submitTaskStatusBackend(taskDetail, "Online");
            this.cloudService.flushAnalyticsEvents();
          }
        }
      }
    } catch(error) {
      this.logger.log(this.fileName, 'updateTaskStatusOSC', 'Error: ' + error.message);
    }
  }

  async updateTaskStatusLocal() {
    try {
      let taskDetail = this.valueProvider.getTask();
      let oldStatus = taskDetail.StatusID;
      let oldStatusName = taskDetail.Task_Status;
      taskDetail.Task_Status = this.getNextStatusNameForChangeLog(oldStatusName);
      taskDetail.Sync_Status = 'false';
      taskDetail.Date = new Date();
      taskDetail.StatusID = this.getNextStatusForChangeLog(oldStatus);
      this.taskStatus = taskDetail.Task_Status;
      await this.localService.updateTaskStatusLocal(taskDetail); 
      await this.addChangeLog(taskDetail.StatusID);
      return taskDetail;
    } catch(error) {
      this.logger.log(this.fileName, 'updateTaskStatusLocal', 'Error: ' + error.message);
      throw error;
    }
  }

  async addChangeLog(taskStatus) {
    let TaskChangeLogObject: any = {
      ID: String(this.utilityProvider.getUniqueKey()),
      CreatedTime: "",
      UpdatedTime: new Date(),
      UpdatedByAccount: this.valueProvider.getUser().Email,
      CreatedByAccount: "",
      FieldJob: this.valueProvider.getTaskId(),
      Technician: this.valueProvider.getUser().Name,
      Timestamp: new Date(),
      ResourceId: this.valueProvider.getResourceId(),
      Sync_Status: false,
      Status: taskStatus
    }
    await this.localService.insertTaskChangeLog(TaskChangeLogObject);
    this.valueProvider.setTaskData(TaskChangeLogObject);
  }

  async openDebrief(selectedProcessID?) {
    this.utilityProvider.showSpinner();
    // if(this.utilityProvider.isConnected()) {
    // //  this.utilityProvider.showSpinner();      
    //   let checkTask = await this.submitProvider.checkTaskAtOSC(this.valueProvider.getTask());
    //   if(checkTask) {
    //     this.utilityProvider.stopSpinner();
    //     return this.submitProvider.displayErrors(checkTask);
    //   }
    // } 
    let currentTaskStatus = this.valueProvider.getTask().StatusID;
    if(currentTaskStatus == Enums.Jobstatus.Debrief_Started || currentTaskStatus == Enums.Jobstatus.Debrief_In_Progress) {
      if(!this.valueProvider.getTask().Selected_Process) {
        this.valueProvider.getTask().Selected_Process = selectedProcessID ? selectedProcessID : null;
        this.valueProvider.getTask().Sync_Status = 'false';
        await this.localService.updateTaskStatusLocal(this.valueProvider.getTask());
        await this.updateTaskStatusOSC(this.valueProvider.getTask());
      }
      this.navigateToDebriefPage();
      return;
    }
    try {
     
      this.valueProvider.getTask().Selected_Process = selectedProcessID ? selectedProcessID : null;
      if (parseInt(this.valueProvider.getTask().StatusID) == Enums.Jobstatus.Debrief_Declined) {
        let taskChangeLogs: any = await this.localService.getTaskChangeLog(this.valueProvider.getTaskId());
        let inProgressAlreadyAdded = false;
        if(taskChangeLogs.length > 0) {
          let changeLogs: any = this.utilityProvider.sortByDate(taskChangeLogs);
          let changeLog = changeLogs[changeLogs.length - 1];
          if(changeLog.Status == Enums.Jobstatus.Debrief_In_Progress) {
            inProgressAlreadyAdded = true;
          }
        }
        if(taskChangeLogs.length == 0 || !inProgressAlreadyAdded) {
          await this.addChangeLog(Enums.Jobstatus.Debrief_In_Progress);
          let task = this.valueProvider.getTask();
          if(this.utilityProvider.isConnected()) await this.submitProvider.submitTaskChangeLogOsc(task);
        }
      } else {
        let taskDetail = await this.updateTaskStatusLocal();
        await this.updateTaskStatusOSC(taskDetail);
      }
    } catch(error) {
      this.logger.log(this.fileName, 'openDebrief', 'Error: ' + error.message);
    } finally {
      this.navigateToDebriefPage();
    }
  }

  async navigateToDebriefPage() {
    let res = await this.localService.getTask();
    this.valueProvider.setTask(res[0]);
    this.valueProvider.setTaskObject(res[0]);

    this.valueProvider.setVerify(false);
    this.valueProvider.setIsCustomerSelected(false);
    this.valueProvider.setIsSummarySelected(false);
    this.valueProvider.setEngineer({});
    await this.navCtrl.push("DebriefPage", { page: this.page })
    const startIndex = this.navCtrl.getActive().index - 1;
    this.navCtrl.remove(startIndex, 1);
  }

  getNextStatusForChangeLog(oldStatus) {
    let nextStatus;
    switch (parseInt(oldStatus)) {
      case Enums.Jobstatus.Assigned:
        nextStatus = Enums.Jobstatus.Accepted;
        break;
      case Enums.Jobstatus.Accepted:
      case Enums.Jobstatus.Debrief_Started:
        nextStatus = Enums.Jobstatus.Debrief_Started;
        break;
      // 12/03/2018 : added if oldStatus is debrief in progress
      case Enums.Jobstatus.Debrief_In_Progress:
      case Enums.Jobstatus.Debrief_Declined:
        nextStatus = Enums.Jobstatus.Debrief_In_Progress;
        break;
    }
    return nextStatus;
  }

  getNextStatusNameForChangeLog(oldStatusName) {
    let nextStatus;
    switch (oldStatusName) {
      case Enums.JobstatusName.Assigned:
        nextStatus = Enums.JobstatusName.Accepted;
        break;
      case Enums.JobstatusName.Accepted:
      case Enums.JobstatusName.Debrief_Started:
        nextStatus = Enums.JobstatusName.Debrief_Started;
        break;
      // 12/03/2018 : added if oldStatus is debrief in progress
      case Enums.JobstatusName.Debrief_In_Progress:
      case Enums.JobstatusName.Debrief_Declined:
        nextStatus = Enums.JobstatusName.Debrief_In_Progress;
        break;
    }
    return nextStatus;
  }

  openResource(file) {
    let foldername;
    let id;
    let filepath = cordova.file.dataDirectory;
    if (file.SRID && file.SRID != "") {
      foldername = "/srfiles/";
      id = file.SRID;
    }
    if (file.Task_Number && file.Task_Number != "") {
      foldername = "/taskfiles/";
      id = file.Task_Number;
    }
    //08/10/2018 Zohaib Khan: Updated File path
    this.utilityProvider.openFile(filepath + foldername + id + "/" + file.filename, file.contentType, null);
  }

  projectListRequirement(dynamicId) {
    let target = "_system";
    this.logger.log(this.fileName, "projectListRequirement- SMS", 'URL: https://sms.na.emerson.com/Sms/Ibs/System/IbsSystem.aspx?action=open_by_system_id&id=' + dynamicId);
    this.clipboard.copy('https://sms.na.emerson.com/Sms/Ibs/System/IbsSystem.aspx?action=open_by_system_id&id=' + dynamicId).then(
      (resolve: string) => {
        this.utilityProvider.presentToast('Copy URL to clipboard', '3000', 'top', '');
      },
      (reject: string) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'projectListRequirement', 'Error in projectListRequirement, SMS : ' + reject);
      }
    );
    this.theInAppBrowser.create('http://epmintra.emersonprocess.com/processITPMO/SVCFT/Pages/smsapp.html?systemid=' + dynamicId, target, 'location=yes')
      .on('loaderror').subscribe(event => {
        this.logger.log(this.fileName, "projectListRequirement- SMS", 'loaderror: ' + JSON.stringify(event));
      });
  }

  /**
   * 11/12/2018 - redirect to SDR after update the selected process in Task table
   * Send data as params for SDR flow
   * Set setCurrentReport as null if new report is generated
   * @author Mayur Varshney
   */
  // gotoSDR() {
  //   this.valueProvider.getTask().Selected_Process = Enums.Selected_Process.SDR;
  //   this.localService.updateSelectedProcess(Enums.Selected_Process.SDR, this.valueProvider.getTask()).then((res: any) => {
  //     if (this.valueProvider.getTask().ReportID) {
  //       this.localService.getReportByID(this.valueProvider.getUserId(), this.valueProvider.getTask().ReportID).then((res: any) => {
  //         let result = this.utilityProvider.groupBySameKeyValues(res, "ReportID_Mobile"); // eg: {"1": [{}]}
  //         let currentReport;
  //         for (var k in result) {
  //           currentReport = this.utilityProvider.getReportList(result[k], result[k][0]);
  //         }
  //         this.valueProvider.setCurrentReport(currentReport);
  //         this.navCtrl.push("WorkFlowTabsPage", this.valueProvider.getTask());
  //       }).catch(err => {
  //         this.logger.log(this.fileName, "gotoSDR", 'Error in getReportByID: ' + err);
  //       });
  //     } else {
  //       this.valueProvider.setCurrentReport(null);
  //       this.navCtrl.push("WorkFlowTabsPage", this.valueProvider.getTask());
  //     }
  //   }).catch(err => {
  //     this.logger.log(this.fileName, "gotoSDR", 'Error in updateSelectedProcess: ' + err);
  //   });
  // }

  // 11/26/2018 -- Mayur Varshney -- update Safety_Check in task table, show/stop loader for the process
  updateSafetyCheck(event) {
    this.utilityProvider.showSpinner();
    this.localService.updateSafetyCheck(event.value).then((res: any) => {
      // 12/06/2018 -- Mansi Arora -- update Safety_Check in value provider & refresh task list
      this.valueProvider.getTask().Safety_Check = event.value;
      this.localService.refreshTaskList();
      this.utilityProvider.stopSpinner();
    });
  }

  openHistoyModal() {
    let params = {
      'customerID': this.taskObj.Customer_ID,
      'customerName': this.taskObj.Customer_Name
    };
    let historyModal = this.utilityProvider.showModal("SrHistoryModalPage", params, { enableBackdropDismiss: false, cssClass: 'SrHistoryModalPage' });
    historyModal.present();
  }
  /**
 *@author: Prateek(21/01/2019)
 *Unsubscribe all events.
 *App Optimization
 * @memberof CalendarPage
 */
  ionViewWillLeave(): void {
    this.events.unsubscribe('refreshPageData');
    //this.events.unsubscribe('user:created');
  }
}


