import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, Nav, Events } from 'ionic-angular';
import { ValueProvider } from '../../../providers/value/value';

import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { UtilityProvider } from '../../../providers/utility/utility';
import { FileChooser } from '@ionic-native/file-chooser';
import { DomSanitizer } from '@angular/platform-browser';

import { LoggerProvider } from '../../../providers/logger/logger';
import * as Enums from '../../../enums/enums';
import { CreateSdrProvider } from '../../../providers/create-sdr/create-sdr';
import { AttachmentProvider } from '../../../providers/attachment/attachment';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {
  @ViewChild('attachment')
  uploadObj: any;
  attach_Id;
  noteArraySummary: any[] = [];
  imageURI: any;
  imageFileName: any;
  filee: any;
  nativepath: any;
  testing: any;
  createdBy: any;
  test: any;
  duration: any;
  public attachmentArrayDb = [];
  public attachmentArray = [];
  files = [];
  titleModal: any;
  filesArray = [];
  updatedName: any;
  file1: any = {};
  attachmentName: any;
  renamedAttachment: any;
  fileName: any = 'Notes_Page';
  tempFileName: any;
  filePath: any;
  mainFilePath: any;
  enums: any;
  taskObj: any;
  awsAccess: boolean = false;
  detailedNoteCreated: boolean = false;
  checkForPopup: any = true;
  constructor(private ngZone: NgZone, public sanitizer: DomSanitizer, public navCtrl: NavController, public utilityProvider: UtilityProvider, public fileChooser: FileChooser, public navParams: NavParams, public modalController: ModalController, public localService: LocalServiceProvider, public valueService: ValueProvider, public loadingCtrl: LoadingController, public logger: LoggerProvider, public nav: Nav, public events: Events, public createSdr: CreateSdrProvider, public attachmentProvider: AttachmentProvider) {
    //08/23/2018 Zohaib Khan: Updated filepath and mainFilePath
    this.enums = Enums;
    this.taskObj = this.valueService.getTask();
    this.filePath = cordova.file.dataDirectory + "/taskfiles/" + this.valueService.getTaskId() + "/thumbnails/";
    this.mainFilePath = cordova.file.dataDirectory + '/taskfiles/' + this.valueService.getTaskId() + '/';


  }

  ionViewDidEnter() {
    //11/04/2019 -- Mayur Varshney -- apply condition if viewCtrl relates to SDRTabsPage or DebriefPage
    if (this.navCtrl.parent.viewCtrl.id != "DebriefPage") return;
    // 02-12-2019 -- Mansi Arora -- show spinner to avoid clicking of buttons before the data is loaded (specifically for detailed notes)
    // this.utilityProvider.showSpinner();
    //Prateek(23/01/2019) Shifted all events in didenter. 
    this.events.subscribe('detail:notes', (data) => {
      this.getDetailedNotesList();
    })
    // 01/09/2019 -- Mayur Varshney -- empty array db
    this.attachmentArray = [];
    this.attachmentArrayDb = [];
    this.attachmentArrayDb = this.valueService.getAttachment();
    this.getNoteList();
    this.deleteDetailedNotesIfEmpty().then(res => {
      this.getDetailedNotesList();
    });
    this.utilityProvider.checkIfDirectoryExist(cordova.file.dataDirectory, this.valueService.getTaskId()).then(res => {
      if (!res) {
        //  07/31/2018 Zohaib Khan: Called createDir method to create the directory with the name of Task Id and thumbnails inside taskid folder
        this.utilityProvider.createDir(cordova.file.dataDirectory + "/taskfiles", this.valueService.getTaskId()).then(res => {
          this.utilityProvider.createDir(cordova.file.dataDirectory + "/taskfiles/" + this.valueService.getTaskId(), "thumbnails");
        })
          // 12-28-2018 -- Mansi Arora -- error handled by logging
          .catch((err: any) => {
            this.logger.log(this.fileName, 'ionViewDidEnter', 'Error in ionViewDidEnter, createDir utility provider : ' + JSON.stringify(err));
          });
      }
    })
      // 12-28-2018 -- Mansi Arora -- error handled by logging
      .catch((err: any) => {
        this.logger.log(this.fileName, 'ionViewDidEnter', 'Error in ionViewDidEnter, checkIfDirectoryExist utility provider : ' + JSON.stringify(err));
      });
    //09/04/2018 kamal - check if coming from summary or customer signature page dont open notes popup
    if (this.valueService.getPageOnVerify() == '') {
      if (this.valueService.getCheckForNotesPopup()) {
        this.checkForActionTaken(this.noteArraySummary);
      }
    }
    this.getAttachmentData();
  }

  gotoMaterial() {
    this.navCtrl.parent.select(3);
    this.valueService.setNote(this.noteArraySummary);
    this.valueService.setAttachment(this.attachmentArrayDb);
  }

  gotoEmersonSignature() {
    this.navCtrl.parent.select(5);
    this.valueService.setNote(this.noteArraySummary);
    this.valueService.setAttachment(this.attachmentArrayDb);
  }
  gotoSummary() {
    this.navCtrl.parent.select(6);
    this.valueService.setNote(this.noteArraySummary);
    this.valueService.setAttachment(this.attachmentArrayDb);
  }

  checkForActionTaken(notesArr) {
    //10/25/2018 Zohaib Khan: Getting notes array from getNotesList(). Do not need to get notes from valueprovider again.
    let Notetype = notesArr.filter((item) => {
      return item.Note_Type == "Action Taken"
    });
    if (Notetype.length == 0) {
      this.addNoteClicked("Action Taken");
    }
    else {
      this.logger.log(this.fileName, 'checkForActionTaken', "Action Taken Exist");
    }
  }

  getAttachmentData() {
    let self = this;
    this.attachmentArray = [];
    this.attachmentArrayDb = this.valueService.getAttachment();
    for (let attachment of this.attachmentArrayDb) {
      self.utilityProvider.getAttachmentObjectForDisplay(cordova.file.dataDirectory + "/taskfiles/" + this.valueService.getTaskId() + "/thumbnails", attachment).then((attachmentObject: any) => {
        if (attachmentObject.contentType.indexOf('image') > -1) {
          //08/10/2018 Zohaib Khan: Checking if attachment exist or not if exist then use thumnails otherwise use main attachment
          this.utilityProvider.checkFileIfExist(cordova.file.dataDirectory + "/taskfiles/" + this.valueService.getTaskId() + "/thumbnails/", "thumb_" + attachmentObject.filename).then(res => {
            attachmentObject.isThumbnailCreated = res;
          })
            // 12-28-2018 -- Mansi Arora -- error handled by logging
            .catch((err: any) => {
              self.logger.log(self.fileName, 'getAttachmentData', 'Error in getAttachmentData, checkFileIfExist utility provider : ' + JSON.stringify(err));
            });
        }
        self.ngZone.run(() => {
          self.attachmentArray.push(attachmentObject);
        });
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        self.logger.log(self.fileName, 'getAttachmentData', 'Error in getAttachmentData, getAttachmentObjectForDisplay utility provider : ' + JSON.stringify(error));
      });
    }
  }

  getNoteList() {
    let filteredNotes: any = []
    return new Promise((resolve, reject) => {
      filteredNotes = this.valueService.getNote().filter((item) => {
        return item.Note_Type != null;
      });
      this.noteArraySummary = filteredNotes;
      if (!this.noteArraySummary) {
        this.localService.getNotesList(String(this.valueService.getTaskId())).then((res: any[]) => {
          filteredNotes = res.filter((item) => {
            return item.Note_Type != null;
          });
          this.noteArraySummary = filteredNotes;
          resolve(res);
        }).catch((error: any) => {
          // 12-28-2018 -- Mansi Arora -- change in logs comment
          this.logger.log(this.fileName, 'getNoteList', 'Error in getNoteList, getNotesList local service : ' + JSON.stringify(error));
        });
      } else {
        resolve(this.valueService.getNote());
      }
    });
  }


  /**
   *12-19-2018
   *Get detailed notes to show on notes list.
   * @returns
   * @memberof NotesPage
   */
  getDetailedNotesList() {
    this.localService.getDetailNotesList(String(this.valueService.getTaskId())).then((res: any[]) => {
      // 02-12-2019 -- Mansi Arora -- stop spinner once detailed notes function has been called back
      //  this.utilityProvider.stopSpinner();
      if (res.length > 0) {
        // 02-08-2019 -- Mansi Arora -- limit detailed notes to one by setting the value of detailedNoteCreated to true
        this.detailedNoteCreated = true;
        res.filter((item) => {
          item.awsAccess = true;
          this.noteArraySummary.push(item);
          return item;
        });
      } else {
        // 02-08-2019 -- Mansi Arora -- else set the value of detailedNoteCreated to false
        this.detailedNoteCreated = false;
      }
    }).catch((error: any) => {
      // 02-12-2019 -- Mansi Arora -- stop spinner once detailed notes function has been called back
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getDetailedNotesList', 'Error in getDetailedNotesList : ' + JSON.stringify(error));
    });
  };

  deleteDetailedNotesIfEmpty() {
    return new Promise((resolve, reject) => {
      this.localService.getDetailNotesList(String(this.valueService.getTaskId())).then((res: any[]) => {
        this.utilityProvider.stopSpinner();
        if (res.length > 0) {
          this.localService.deleteDetailedNotes(res[0].DNID).then(res => {
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  addNoteClicked(action) {
    //let self = this;
    let lov = { checkActionTaken: action };
    let addNotesmodal = this.utilityProvider.showModal('AddNotesModalPage', lov, { enableBackdropDismiss: false, cssClass: 'AddNotesModalPage' });
    addNotesmodal.onDidDismiss(data => {
      if (data != undefined) {
        this.handleNotes(data);
      }
      this.getNoteList();
      this.getDetailedNotesList();
    });
    addNotesmodal.present();
  };

  handleNotes(data) {
    // if (data.Notes_Id) {
    //   delete data.Notes_Id;
    // }
    if (!data.Notes_Id) data.Notes_Id = String(this.utilityProvider.getUniqueKey());
    this.localService.insertUpdateNotes(data).then((): any => {
      this.localService.getNotesForInstallBase(data.Notes_Install_Base, data.Notes_Id).then((resp: any) => {
        this.noteArraySummary.push(resp);
        this.valueService.setNote(this.noteArraySummary);
        this.shortArray(this.noteArraySummary);
      });
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'handleNotes', 'Error in insertUpdateNotes : ' + JSON.stringify(error));
    });
  }

  shortArray(array) {
    array = array.sort((a, b) => {
      if (a.Date < b.Date)
        return -1;
      if (a.Date > b.Date)
        return 1;
      return 0;
    });
  }

  editClicked(notes, index, title) {
    if (!notes.awsAccess) {
      let lov = { modalTitle: title, noteObj: notes }
      let editModal = this.utilityProvider.showModal('AddNotesModalPage', lov, { enableBackdropDismiss: false, cssClass: 'AddNotesModalPage' });
      editModal.onDidDismiss(data => {
        if (data != undefined) {
          this.localService.insertUpdateNotes(data).then((): any => {
            this.localService.getNotesForInstallBase(data.Notes_Install_Base, data.Notes_Id).then((resp: any) => {
              data.Item_Number = resp.Item_Number ? resp.Item_Number : '';
              data.Serial_Number = resp.Serial_Number ? resp.Serial_Number : '';
              this.noteArraySummary[index] = data;
              this.valueService.setNote(this.noteArraySummary);
              this.noteArraySummary.sort((a, b) => {
                if (new Date(a.Date).getDate() != new Date(b.Date).getDate()) {
                  if (a.Date < b.Date)
                    return -1;
                  if (a.Date > b.Date)
                    return 1;
                  return 0;
                }
              });
            }).catch((error: any) => {
              this.logger.log(this.fileName, 'editClicked', 'Error in getNotesForInstallBase : ' + JSON.stringify(error));
            });
          }).catch((error: any) => {
            this.logger.log(this.fileName, 'editClicked', 'Error in insertUpdateNotes : ' + JSON.stringify(error));
          });
        }
      });
      editModal.present();
    } else {
      this.navCtrl.push('DetailNotesPage', { data: notes, type: Enums.Notes.edit });
    }

  };

  copyClicked(notes, index, title) {
    if (!notes.awsAccess) {
      let lov = { modalTitle: title, noteObj: notes }
      let copyModal = this.utilityProvider.showModal('AddNotesModalPage', lov, { enableBackdropDismiss: false, cssClass: 'AddNotesModalPage' });
      copyModal.onDidDismiss(data => {
        if (data != undefined) {
          data.Notes_Id = String(this.utilityProvider.getUniqueKey());
          this.localService.insertUpdateNotes(data).then((): any => {
            this.localService.getNotesForInstallBase(data.Notes_Install_Base, data.Notes_Id).then((resp: any) => {
              this.noteArraySummary.push(resp);
              this.valueService.setNote(this.noteArraySummary);
              this.noteArraySummary.sort((a, b) => {
                if (a.Date < b.Date)
                  return -1;
                if (a.Date > b.Date)
                  return 1;
                return 0;
              });
            }).catch((error: any) => {
              this.logger.log(this.fileName, 'copyClicked', 'Error in getNotesForInstallBase : ' + JSON.stringify(error));
            });
          }).catch((error: any) => {
            this.logger.log(this.fileName, 'copyClicked', 'Error in insertUpdateNotes : ' + JSON.stringify(error));
          });
        }
      });
      copyModal.present();
    } else {
      this.navCtrl.push('DetailNotesPage', { data: notes, type: Enums.Notes.copy });
    }
  };

  deleteObject(notes, index) {
    for (let i = 0; i < this.noteArraySummary.length; i++) {
      if (index == i) {
        this.noteArraySummary.splice(index, 1);
      }
    }
    // 02-08-2019 -- Mansi Arora -- set new array to value provider after deleting notes
    this.valueService.setNote(this.noteArraySummary);
    if (!notes.awsAccess) {
      this.localService.deleteNotesObject(notes.Notes_Id);
    } else {
      //12-19-2018 Radheshyam kumar added this code to delete the detailed notes.
      this.localService.deleteDetailedNotesObject(notes.DNID)
    }
    // 02-08-2019 -- Mansi Arora -- if detailed note was deleted, set the value of detailedNoteCreated to false
    if (notes.DNID) {
      this.detailedNoteCreated = false;
    }
  }

  /**
   * 01/09/2019 - Mayur Varshney 
   * Optimise code by attachment provider
   * Add file in db and dir
   * @param {*} event
   */
  public addAttachment(event: any) {
    let path = cordova.file.dataDirectory + "taskfiles/" + this.valueService.getTaskId() + "/";
    this.attachmentProvider.addAttachment(null, event.target.files[0], Enums.AttachmentType.FCR, path).then((res: any) => {
      console.log(res);
      this.attachmentArrayDb.push(res.newObject);
      this.valueService.setAttachment(this.attachmentArrayDb);
      this.valueService.setAttachmentForDisplay(this.attachmentArrayDb);
      this.attachmentArray.push(res.fileObject);
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'addAttachment', 'Error in addAttachment : ' + JSON.stringify(err));
    });
  }

  /**
   * 01/09/2019 - Mayur Varshney 
   * Optimise code by attachment provider
   * Delete file from db and dir
   * @param {*} filedata
   * @param index
   */
  deleteAttachmentObject(filedata, index) {
    let attachmentDiscNameAndType = this.utilityProvider.generateFileDiscNameAndType(filedata);
    this.attachmentArray.splice(index, 1);
    this.attachmentArrayDb = this.attachmentArrayDb.filter((item) => { return item.Attachment_Id != filedata.Attachment_Id });
    this.localService.deleteAttachmentObject(filedata.Attachment_Id);
    this.attachmentProvider.deleteAttachment(filedata, 'taskfiles', Enums.AttachmentType.FCR, attachmentDiscNameAndType).then((res: any) => {
      if (res) {
        this.valueService.setAttachment(this.attachmentArrayDb);
        this.valueService.setAttachmentForDisplay(this.attachmentArrayDb);
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'deleteAttachmentObject', 'Error in deleteAttachmentObject : ' + JSON.stringify(err));
    });
  }

  /**
   * 01/09/2019 - Mayur Varshney 
   * Optimise code by attachment provider
   * open file on click
   * @param {*} file
   */
  openResource(file) {
    this.attachmentProvider.openResource(file, 'taskfiles', Enums.AttachmentType.FCR);
  }

  focusFunction(value) {
    this.renamedAttachment = value.target.value;
    this.tempFileName = value.target.value;
  }

  /**
   * 01/09/2019 - Mayur Varshney 
   * Optimise code by attachment provider
   * rename and update file
   * @param {*} fileData
   * @param index
   */
  renameAttachment(fileData, index) {
    let obj = {
      file: fileData,
      folderName: 'taskfiles',
      renamedAttachment: this.renamedAttachment,
      attachmentType: Enums.AttachmentType.FCR
    };
    this.attachmentProvider.renameAttachment(obj).then((res: any) => {
      this.updateAttachment(res, index);
    });
  }

  /**
   * 01/09/2019 - Mayur Varshney 
   * Optimise code by attachment provider
   * update file name in db and dir
   * @param {*} fileData
   * @param index
   */
  updateAttachment(fileData, index) {
    let objIndex = this.attachmentArrayDb.findIndex((obj => obj.Attachment_Id == fileData.object.file.Attachment_Id));
    this.attachmentProvider.updateAttachment(fileData, this.tempFileName).then((res: any) => {
      if (res) {
        this.attachmentArray[index].filename = fileData.updatedName;
        this.attachmentArrayDb[objIndex].File_Name = fileData.updatedName;
        this.valueService.setAttachment(this.attachmentArrayDb);
        this.valueService.setAttachmentForDisplay(this.attachmentArrayDb);
      }
      else {
        this.attachmentArray[index].fileDisc = this.tempFileName;
        this.valueService.setAttachment(this.attachmentArrayDb);
        this.valueService.setAttachmentForDisplay(this.attachmentArrayDb);
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'updateAttachment', 'Error in updateAttachment : ' + JSON.stringify(err));
    });
  }

  goToDetailNotes() {
    this.navCtrl.push("DetailNotesPage");
  }

  /** 
 * @author Gurkirat Singh
 * 03-28-2019 Gurkirat Singh : Publish an event to navigate to SDR Flow
 *
 * @memberof NotesPage
 */
  gotoSDR() {
    this.valueService.setCheckForNotesPopup(false);
    setTimeout(() => {
      this.events.publish("gotoSDR");
    }, 1000);
  }

  /**
   * 01-02-2019 -- Mansi Arora -- generateDetailedNotesPdf
   * calls sdr to generate a pdf for existing detailed notes
   * opens the file name in response
   * @memberOf NotesModalPage
  */
  generateDetailedNotesPdf() {
    this.utilityProvider.showSpinner();
    this.createSdr.generateDetailedNotesPdf().then(() => {
      let pdfFileName = "Detailed_Notes_SDR_" + this.valueService.getTaskId() + ".pdf";
      let filePath = cordova.file.dataDirectory;
      filePath = filePath + "/temp/";
      this.utilityProvider.openFile(filePath + pdfFileName, "application/pdf", null);
      this.utilityProvider.stopSpinner();
    }).catch((error) => {
      this.logger.log(this.fileName, "generateDetailedNotesPdf", "Error Occured: " + JSON.stringify(error));
      this.utilityProvider.stopSpinner();
      this.utilityProvider.presentToast(Enums.Messages.PDF_Failed, 4000, 'top', 'feedbackToast');
    });
  }

  /**
*@author: Prateek(21/01/2019)
*Unsubscribe all events.
*App Optimization
* @memberof CalendarPage
*/
  ionViewWillLeave(): void {
    this.events.unsubscribe('detail:notes');
    this.valueService.setCheckForNotesPopup(true);
  }
}
