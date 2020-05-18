import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, Nav, Events, ViewController, Navbar } from 'ionic-angular';
import { ValueProvider } from '../../../../providers/value/value';
import { Platform } from 'ionic-angular';
import { LocalServiceProvider } from '../../../../providers/local-service/local-service';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { AttachmentProvider } from '../../../../providers/attachment/attachment';
import { FileChooser } from '@ionic-native/file-chooser';
import { DomSanitizer } from '@angular/platform-browser';
// import { SortPipe } from '../../../../pipes/sort/sort';
import { LoggerProvider } from '../../../../providers/logger/logger';
import * as moment from "moment";
import * as Enums from '../../../../enums/enums';
import { Storage } from '@ionic/storage';
declare var cordova: any;

/**
 * Generated class for the DetailNotesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-notes',
  templateUrl: 'detail-notes.html',
})
export class DetailNotesPage {
  @ViewChild('attachment')
  @ViewChild('navbar') navBar: Navbar;
  uploadObj: any;
  config: any = {};
  filee: any;
  public attachmentArrayDb = [];
  public attachmentArray = [];
  renamedAttachment: any;
  fileName: any = 'Detailed_Notes_Page';
  tempFileName: any;
  filePath: any;
  mainFilePath: any;
  enums: any;
  detailedNote: any;
  detailNoteType: any;
  DNID: any;
  detailedNotes: { DNID: any, System_Info: any, Detailed_Notes: any, Result: any, Suggestion: any, Report_No: string, Description_One: string, Description_Two: string, Summary: string, Task_Number: any, Sync_Status: boolean, Date?: string, Created_By?: string, Created_Date?: string, Modified_By?: string, Modified_Date?: string, hasAttachments: any };
  DNIDForenkey: number = null;
  isIOS: boolean = false;
  ckeditorFileuploadUrl: any;
  isRefreshed = false;
  refreshckEditor = false;

  constructor(public storage: Storage, public viewCtrl: ViewController, private platform: Platform, private ngZone: NgZone, public sanitizer: DomSanitizer, public navCtrl: NavController, public utilityProvider: UtilityProvider, public fileChooser: FileChooser, public navParams: NavParams, public modalController: ModalController, public localService: LocalServiceProvider, public valueService: ValueProvider, public loadingCtrl: LoadingController, public logger: LoggerProvider, public nav: Nav, public event: Events, public attachmentProvider: AttachmentProvider) {
    this.utilityProvider.showSpinner();
    this.enums = Enums;
    this.DNIDForenkey = null;
    this.detailedNotes = { DNID: "", Report_No: null, Description_One: null, Description_Two: null, Summary: "", System_Info: "", Detailed_Notes: "", Result: "", Suggestion: "", Task_Number: this.valueService.getTaskId(), Sync_Status: false, hasAttachments: 0 };
    this.detailedNote = this.navParams.get('data');
    this.detailNoteType = this.navParams.get('type');

    if (this.detailedNote == undefined) {
      this.detailedNotes.DNID = parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000)));
      this.Save();
    }

    if (this.detailedNote) {
      this.detailedNotes = { DNID: this.detailedNote.DNID, Report_No: this.detailedNote.Report_No, Description_One: this.detailedNote.Description_One, Description_Two: this.detailedNote.Description_Two, Summary: this.detailedNote.Summary, System_Info: this.detailedNote.System_Info, Detailed_Notes: this.detailedNote.Detailed_Notes, Result: this.detailedNote.Result, Suggestion: this.detailedNote.Suggestion, Task_Number: this.detailedNote.Task_Number, Sync_Status: this.detailedNote.Sync_Status, hasAttachments: 0 };
      this.event.subscribe("load_detailedNotes", (res) => {
        setTimeout(() => {
          this.detailedNotes = { DNID: this.detailedNote.DNID, Report_No: this.detailedNote.Report_No, Description_One: this.detailedNote.Description_One, Description_Two: this.detailedNote.Description_Two, Summary: this.detailedNote.Summary, System_Info: this.detailedNote.System_Info, Detailed_Notes: this.detailedNote.Detailed_Notes, Result: this.detailedNote.Result, Suggestion: this.detailedNote.Suggestion, Task_Number: this.detailedNote.Task_Number, Sync_Status: this.detailedNote.Sync_Status, hasAttachments: 0 };
          this.utilityProvider.stopSpinner();
        }, 2000)
      })
      //  this.detailedNotes = { DNID: this.detailedNote.DNID, Report_No: this.detailedNote.Report_No, Description_One: this.detailedNote.Description_One, Description_Two: this.detailedNote.Description_Two, Summary: this.detailedNote.Summary, System_Info: this.detailedNote.System_Info, Detailed_Notes: this.detailedNote.Detailed_Notes, Result: this.detailedNote.Result, Suggestion: this.detailedNote.Suggestion, Task_Number: this.detailedNote.Task_Number, Sync_Status: this.detailedNote.Sync_Status, hasAttachments: 0 };
      this.DNIDForenkey = this.detailedNote.DNID;

      if (Enums.Notes.copy == this.detailNoteType) {
        this.detailedNotes.DNID = parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000)));
      }
    } else {
      this.utilityProvider.stopSpinner();
    }

    if (this.platform.is('ios')) {
      this.isIOS = true;
    } else {
      this.isIOS = false;
    }

    // 01/04/2018 GS: TODO: Move Detailed Notes folder into taskfiles/taskid
    if (this.detailedNotes.DNID != null) {
      this.filePath = cordova.file.dataDirectory + "/detailednotesfiles/" + this.valueService.getTaskId() + "/" + this.detailedNotes.DNID + "/thumbnails/";
      this.mainFilePath = cordova.file.dataDirectory + '/detailednotesfiles/' + this.valueService.getTaskId() + "/" + this.detailedNotes.DNID + "/";
    }


  }

  ionViewDidLoad() {
    this.attachmentArrayDb = this.valueService.getDetailedNotesAttachment();
    this.utilityProvider.checkIfDirectoryExist(cordova.file.dataDirectory, this.valueService.getTaskId()).then(res => {
      if (!res) {
        //  07/31/2018 Zohaib Khan: Called createDir method to create the directory with the name of Task Id and thumbnails inside taskid folder
        this.utilityProvider.createDir(cordova.file.dataDirectory + "/detailednotesfiles", this.valueService.getTaskId()).then(res => {
          this.utilityProvider.createDirIfNotExist(cordova.file.dataDirectory + "/detailednotesfiles/" + this.valueService.getTaskId() + "/", "" + this.detailedNotes.DNID, true).then(() => {
            this.getAttachmentData();
          });
          // this.utilityProvider.createDir(cordova.file.dataDirectory + "/detailednotesfiles/" + this.valueService.getTaskId() + "/", "thumbnails");
        });
      } else {
        this.getAttachmentData();
      }
    });
    // this.utilityProvider.createDir(cordova.file.dataDirectory + "/detailednotesfiles/"+this.valueService.getTaskId()+"/",this.detailedNotes.DNID ).then(res => {
    // this.getAttachmentData();
    ///03/07/2019 Zohaib Khan: Refresh ckEdir for Summary when page loded completely 
    this.refreshckEditor = true;
    // this.utilityProvider.stopSpinner();
  }

  ionViewWillLeave() {
    this.event.unsubscribe('load_detailedNotes');
  }

  /**
   *2-19-2018
   *Get all the attachment form the detailed table
   * @memberof DetailNotesPage
   */
  getAttachmentData() {
    let self = this;
    this.attachmentArray = [];
    //  console.log(this.valueService.getDetailedNotesAttachment());
    // this.attachmentArrayDb = this.valueService.getDetailedNotesAttachment().filter(item => {
    //   return item.DNID == this.detailedNote.DNID;
    // });

    this.localService.getAttachmentForDetailedNotes(this.detailedNotes.DNID).then((res: any) => {
      this.attachmentArrayDb = res;
      if (this.attachmentArrayDb.length > 0) {
        for (let attachment of this.attachmentArrayDb) {
          self.utilityProvider.getDetailedNotesAttachmentObjectForDisplay(cordova.file.dataDirectory + "/detailednotesfiles/" + this.valueService.getTaskId() + "/" + String(this.detailedNotes.DNID) + "/thumbnails", attachment).then((attachmentObject: any) => {
            if (attachmentObject.contentType.indexOf('image') > -1) {
              //08/10/2018 Zohaib Khan: Checking if attachment exist or not if exist then use thumnails otherwise use main attachment
              this.utilityProvider.checkFileIfExist(cordova.file.dataDirectory + "/detailednotesfiles/" + this.valueService.getTaskId() + "/" + String(this.detailedNotes.DNID) + "/thumbnails/", "thumb_" + attachmentObject.filename).then(res => {
                attachmentObject.isThumbnailCreated = res;
              });
            }
            self.ngZone.run(() => {
              self.attachmentArray.push(attachmentObject);
            });
          }).catch((error: any) => {
            self.logger.log(self.fileName, 'getAttachmentData', 'Error in getAttachmentData : ' + JSON.stringify(error));
          });
        }
      }
    }).catch((error) => {
      console.log("Err " + JSON.stringify(error));
    })
  }

  /**
   * 02-07-2019 -- Mansi Arora 
   * Removed function checkIfAttachmentExits
   * Not being used anywhere after attachment flow optimisation
  */

  /**
   * 02-07-2019 -- Mansi Arora 
   * Optimise code by attachment provider
   * Add file in db and dir
   * @param {*} event
   * @param {*} attachmentFor
   */

  public addAttachment(event: any, attachmentFor: any) {
    let path = cordova.file.dataDirectory + "detailednotesfiles/" + this.valueService.getTaskId() + "/" + String(this.detailedNotes.DNID);
    let obj = {
      attachmentFor: attachmentFor,
      DNIDForenkey: this.DNIDForenkey
    };
    this.attachmentProvider.addAttachment(null, event.target.files[0], Enums.AttachmentType.DetailedNotes, path, obj).then((res: any) => {
      this.attachmentArrayDb.push(res.newObject);
      this.valueService.setDetailedNotesAttachment(this.attachmentArrayDb);
      this.valueService.setDetailedNotesAttachmentForDisplay(this.attachmentArrayDb);
      this.attachmentArray.push(res.fileObject);
      this.localService.updateDetailedNotes(obj.DNIDForenkey, true);
      this.uploadObj.nativeElement.value = "";
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'addAttachment', 'Error in addAttachment : ' + JSON.stringify(err));
    });
  }

  /**
   * 02-07-2019 -- Mansi Arora 
   * Optimise code by attachment provider
   * Delete file from db and dir
   * @param {*} filedata
   * @param index
   */
  deleteAttachmentObject(filedata, index) {
    let attachmentDiscNameAndType = this.utilityProvider.generateFileDiscNameAndType(filedata);
    this.attachmentArray.splice(index, 1);
    this.attachmentArrayDb = this.attachmentArrayDb.filter((item) => { return item.Attachment_Id != filedata.Attachment_Id });
    this.localService.deleteDetaileNotesAttachmentObject(filedata.Attachment_Id);
    let path = "/detailednotesfiles/" + this.valueService.getTaskId() + "/" + String(this.detailedNotes.DNID);
    this.attachmentProvider.deleteAttachment(filedata, path, Enums.AttachmentType.DetailedNotes, attachmentDiscNameAndType).then((res: any) => {
      if (res) {
        this.valueService.setDetailedNotesAttachment(this.attachmentArrayDb);
        this.valueService.setDetailedNotesAttachmentForDisplay(this.attachmentArrayDb);
      }
      this.localService.getAttachmentForDetailedNotes(this.detailedNotes.DNID).then((res: any) => {
        console.log(res.length);
        if (res.length == 0) {
          this.localService.updateDetailedNotes(this.detailedNotes.DNID, false);
        }
      });
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'deleteAttachmentObject', 'Error in deleteAttachmentObject : ' + JSON.stringify(err));
    });
  }

  /**
   * 02-07-2019 -- Mansi Arora 
   * Optimise code by attachment provider
   * open file on click
   * @param {*} file
   */
  openResource(file) {
    this.attachmentProvider.openResource(file, "/detailednotesfiles/" + this.valueService.getTaskId() + "/" + String(this.detailedNotes.DNID) + "/", Enums.AttachmentType.DetailedNotes);
  }

  focusFunction(value) {
    this.renamedAttachment = value.target.value;
    this.tempFileName = value.target.value

  }

  /**
   * 02-07-2019 -- Mansi Arora 
   * Optimise code by attachment provider
   * rename and update file
   * @param {*} fileData
   * @param index
   */
  renameAttachment(fileData, index) {
    let obj = {
      file: fileData,
      folderName: "/detailednotesfiles/" + this.valueService.getTaskId() + "/" + String(this.detailedNotes.DNID),
      renamedAttachment: this.renamedAttachment,
      attachmentType: Enums.AttachmentType.DetailedNotes
    };
    this.attachmentProvider.renameAttachment(obj).then((res: any) => {
      this.updateAttachment(res, index);
    });
  }

  /**
   * 02-07-2019 -- Mansi Arora 
   * Optimise code by attachment provider
   * update file name in db and dir
   * @param {*} fileData
   * @param index
   */
  updateAttachment(fileData, index) {
    let objIndex = this.attachmentArrayDb.findIndex((obj => obj.Attachment_Id == fileData.object.file.Attachment_Id));
    this.attachmentProvider.updateAttachment(fileData, this.tempFileName, Enums.AttachmentType.DetailedNotes).then((res: any) => {
      if (res) {
        this.attachmentArray[index].filename = fileData.updatedName;
        this.attachmentArray[index].fileDisc = fileData.object.file.fileDisc;
        this.attachmentArrayDb[objIndex].File_Name = fileData.updatedName;
        this.valueService.setDetailedNotesAttachment(this.attachmentArrayDb);
        this.valueService.setDetailedNotesAttachmentForDisplay(this.attachmentArrayDb);
      }
      else {
        this.attachmentArray[index].fileDisc = this.tempFileName;
        this.valueService.setDetailedNotesAttachment(this.attachmentArrayDb);
        this.valueService.setDetailedNotesAttachmentForDisplay(this.attachmentArrayDb);
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'updateAttachment', 'Error in updateAttachment : ' + JSON.stringify(err));
    });
  }


  /**
   *12-19-2018
   *Add or update detailed notes
   * @memberof DetailNotesPage
   */
  Save(saveandPop?) {
    let saveData: boolean = false;
    //this code working for check that if any field is filled then save data.
    // if (this.detailedNotes.Description_One && this.detailedNotes.Description_Two && this.detailedNotes.Summary) {
    let date = new Date();
    if (saveandPop) {
      this.detailedNotes.Summary = typeof (this.detailedNotes.Summary) == "string" ? this.detailedNotes.Summary.replace(/\n$/, "") : '';
      this.detailedNotes.Suggestion = typeof (this.detailedNotes.Suggestion) == "string" ? this.detailedNotes.Suggestion.replace(/\n$/, "") : '';
      this.detailedNotes.Detailed_Notes = typeof (this.detailedNotes.Detailed_Notes) == "string" ? this.detailedNotes.Detailed_Notes.replace(/\n$/, "") : '';
      this.detailedNotes.System_Info = typeof (this.detailedNotes.System_Info) == "string" ? this.detailedNotes.System_Info.replace(/\n$/, "") : '';
      this.detailedNotes.Result = typeof (this.detailedNotes.Result) == "string" ? this.detailedNotes.Result.replace(/\n$/, "") : '';
      if (this.attachmentArrayDb.length > 0) {
        this.detailedNotes.hasAttachments = "1";
      }
    }
    this.detailedNotes.Created_By = this.valueService.getUser().ID;
    this.detailedNotes.Modified_By = this.valueService.getUser().ID;
    this.detailedNotes.Created_Date = moment(date).format('YYYY-MM-DD hh:mm:ss');
    this.detailedNotes.Modified_Date = moment(date).format('YYYY-MM-DD hh:mm:ss');
    this.detailedNotes.Date = moment(date).format('YYYY-MM-DD hh:mm:ss');
    this.detailedNotes.Sync_Status = false;
    this.localService.insertUpdateDetailedNotes(this.detailedNotes).then((res: any): any => {
      this.DNIDForenkey = res.DNID;
      this.event.publish('detail:notes', res);
      if (saveandPop || saveData) {
        this.navCtrl.pop();
      } else {
        this.createFolderInSideTaskNumber();
        saveData = true;
      }
    })
    //  } else {
    // this.utilityProvider.presentToastButtom('Please fill the required fields.', '4000', 'top', '', 'OK');
    //   }
  }

  saveDetailNotes() {
    this.Save(true);
  }

  createFolderInSideTaskNumber() {
    this.utilityProvider.createDir(cordova.file.dataDirectory + "/detailednotesfiles/" + this.valueService.getTaskId() + "/", String(this.detailedNotes.DNID)).then(res => {
      this.utilityProvider.createDir(cordova.file.dataDirectory + "/detailednotesfiles/" + this.valueService.getTaskId() + "/" + String(this.detailedNotes.DNID) + "/", "thumbnails");
      this.ckeditorFileuploadUrl = cordova.file.dataDirectory + "/detailednotesfiles/" + this.valueService.getTaskId() + "/" + String(this.detailedNotes.DNID) + "/thumbnails";
    });
  }



  /**
   *go back to notes tab with saving data.
   *
   * @memberof DetailNotesPage
   */
  cancelDetailNotes() {
    this.localService.deleteDetailedNotes(this.detailedNotes.DNID).then(res => {
      this.navCtrl.pop();
    });
  }

  //ck-editor functions goes here
  Summary(e) {
    this.detailedNotes.Summary = e;
  }

  SystemInfo(e) {
    this.detailedNotes.System_Info = e;
  }

  DetailedNotes(e) {
    this.detailedNotes.Detailed_Notes = e;
  }

  ResultRemaining(e) {
    this.detailedNotes.Result = e;
  }

  Suggestion(e) {
    this.detailedNotes.Suggestion = e;
  }


}