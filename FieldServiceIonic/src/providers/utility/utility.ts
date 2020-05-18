import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, EventEmitter, HostListener, Output } from '@angular/core';
import { Network } from '@ionic-native/network';
import { LoadingController, Modal, ModalController, Platform, Popover, PopoverController, ToastController, FabContainer, Events, AlertController } from 'ionic-angular';
import { LoggerProvider } from '../logger/logger';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import * as moment from 'moment-timezone';
// import { Base64 } from '@ionic-native/base64';  26-7-18, Suraj Gorai, Remove Base64 plugin
import { Device } from '@ionic-native/device';
import { ImageResizer } from '@ionic-native/image-resizer';
import { CloudService } from '../cloud-service/cloud-service';
import { ValueProvider } from '../value/value';
import * as Enums from '../../enums/enums'
import { AppVersion } from '@ionic-native/app-version';
import { Clipboard } from '@ionic-native/clipboard';
import { TranslateService } from '@ngx-translate/core';
import { FileUpdaterProvider } from "../file-updater/file-updater";
// import { CustomerDbProvider } from "../customer-db/customer-db";
import { LocalServiceProvider } from "../local-service/local-service";
import { AccordionData } from '../../beans/AccordionData';
// import { SyncProvider } from '../sync/sync';
declare var window: any;
declare var cordova: any;
declare let navigator: any;

@Injectable()
export class UtilityProvider {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  private isOnline = false;
  private loading;
  public fab: FabContainer;
  public modal: Modal;
  public popover: Popover;
  fileName: any = 'UtilityProvider';
  getTimeZoneName: any[] = [];
  devicePlatform: any;
  lastOfflineTime: any;
  lastOnlineTime: any;
  isAppInBackground: boolean = false;
  appVersion: any;
  WeekStart: any;
  weekEnd: any;
  forcelogoutValidationCheck: boolean = false;
  public cloudProvider: CloudService;
  public valueProvider: ValueProvider;
  // syncProvider: SyncProvider;

  footerShow: boolean;
  footerData: any = {};
  enableReportIssueBtn = true; // Pulkit Agarwal- handle Report an issue button on user preferences page
  timeout: any;

  constructor(public imageResizer: ImageResizer, public logger: LoggerProvider, public fileUpdater: FileUpdaterProvider,
    injector: Injector, public file: File, public http: HttpClient, private platform: Platform, public localServiceProvider: LocalServiceProvider,
    public appVersionUtil: AppVersion, private network: Network, public popoverCtrl: PopoverController, public loadingCtrl: LoadingController, public modalController: ModalController, public toastController: ToastController, public storage: Storage, public iab: InAppBrowser, public device: Device, public events: Events, public alertCtrl: AlertController, public clipboard: Clipboard, public translate: TranslateService) {
    this.platform.ready().then(() => {
      if (this.device.platform)
        this.devicePlatform = this.device.platform.toLowerCase();
      // 08/28/2018 Gurkirat: Created Common Event Handlers for Network Connect and Disconnect
      this.subscribeToNetworkDiconnectEvent();
      this.subscribeToNetworkConnectEvent();
      if (this.platform.is('cordova')) {
        this.isOnline = this.network.type != 'none';
        // 02-19-2019 -- Mansi Arora -- check if appVersion already has a value, if not find & set appVersion
        if (!this.appVersion) {
          this.appVersionUtil.getVersionNumber().then((res) => {
            this.appVersion = res;
          });
        }
      } else {
        this.isOnline = navigator.onLine;
      }
      this.logger.log(this.fileName, "constructor", "IsOnline: " + this.isOnline);
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'constructor', 'Error in ready : ' + JSON.stringify(err));
    });
    // setTimeout(() => this.syncProvider = injector.get(SyncProvider));
    // 08/28/2018 Gurkirat: Resolved Circular Dependency for Following Files
    setTimeout(() => {
      this.cloudProvider = injector.get(CloudService);
      this.valueProvider = injector.get(ValueProvider);
    });

    this.autoUpdateSubscriptions()
  }

  // 09/03/2019 Gaurav Vachhani: Code to prevent enter key on text area
  preventEnter(event) {
    const element = event.target as HTMLInputElement;
    const limit = element.maxLength;
    const value = element.value.substr(0, limit);
    if (value.length >= limit) {
      event.preventDefault();
    }
  }

  public isConnected() {
    return this.isOnline;
  }

  public showSpinner() {
    if (this.loading == null) {
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: '<img src="assets/imgs/02hat_loader_2.gif"/></span>'
      });

      this.loading.onDidDismiss(() => {
      });

      this.loading.present();
    }
  }

  public stopSpinner() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  //08/13/2018 Zohaib Khan: Updated parameter with path
  getAttachmentObjectForMCS(path, attachment) {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        //08/13/2018 Zohaib Khan: Update with getBase64 method to get base 64 from perticular path
        this.getBase64(path, attachment.File_Name).then((result: any) => {
          let attachmentObject: any = {};
          // 10/01/2018 -- Mayur Varshney -- split name and extension by getting the index of pre-dot of extension
          let attachmentNameAndType = this.generateFileNameAndType(attachment.File_Name);
          let attachFileName = attachmentNameAndType.Name.substring(0, 60).trim();
          attachmentObject.taskId = attachment.Task_Number;
          attachmentObject.contentType = attachment.File_Type;
          // 10/04/2018 -- Mayur Varshney -- apply check if extension is not available
          attachmentObject.FileName = attachFileName + (attachmentNameAndType.Type ? '.' : '') + attachmentNameAndType.Type;
          attachmentObject.Description = attachmentNameAndType.Name;
          attachmentObject.Name = "";
          attachmentObject.Data = result.split(",")[1];
          resolve(attachmentObject);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getAttachmentObjectForMCS', 'Error in getBase64 : ' + JSON.stringify(err));
        })
      } else {
        resolve();
      }
    });
  }

  getAttachmentObjectForDetailedNotes(path, attachment) {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        //08/13/2018 Zohaib Khan: Update with getBase64 method to get base 64 from perticular path
        this.getBase64(path, attachment.File_Name).then((result: any) => {
          attachment.AttachmentData = result;
          resolve(attachment);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getAttachmentObjectForDetailedNotes', 'Error in getBase64 : ' + JSON.stringify(err));
          reject(err);
        })
      } else {
        resolve();
      }
    });
  }

  getAttachmentObjectForDisplay(filepath, attachment) {
    // 10/01/2018 -- Mayur Varshney -- Optimise Code, divide file name from extension using period
    return new Promise((resolve, reject) => {
      let attachmentNameAndType = this.generateFileNameAndType(attachment.File_Name);
      let attachmentObject: any = {};
      if (!this.platform.is('cordova')) {
        attachmentObject.base64 = "";
      }
      attachmentObject.Attachment_Id = attachment.Attachment_Id;
      attachmentObject.contentType = attachment.File_Type;
      attachmentObject.fileDisc = attachmentNameAndType.Name;
      attachmentObject.filename = attachment.File_Name;
      attachmentObject.filetype = attachmentNameAndType.Type;
      resolve(attachmentObject);
    }).catch(err => {
      this.logger.log(this.fileName, "getAttachmentObjectForDisplay", "Error in Promise: " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
   * 26-7-18, Suraj Gorai
   * Remove Platform specific code for conversion from file to base64
   *
   * @param {*} fileName
   * @returns
   * @memberof UtilityProvider
   */
  getBase64Data(fileName) {
    return new Promise((resolve, reject) => {
      this.logger.log(this.fileName, 'getBase64Data', 'running on Windows device!');
      let filePath: string = cordova.file.dataDirectory;
      this.file.readAsDataURL(filePath, fileName).then((res) => {
        resolve(res);
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'getBase64Data', 'Error while fetching base64 for ' + fileName + " : " + JSON.stringify(err));
      });
    });
  }

  getBase64(filepath, fileName) {
    try {
      return this.file.readAsDataURL(filepath, fileName)
    } catch (error) {
      this.logger.log(this.fileName, 'getBase64', 'Error while fetching base64 for ' + fileName + " : " + error.message);
      throw error;
    }
  }

  saveBase64File(folderpath, filename, content, contentType) {
    let self = this;
    return new Promise((resolve, reject) => {
      try {
        if (this.platform.is('cordova')) {
          let DataBlob = this.b64toBlob(content, contentType, null);
          window.resolveLocalFileSystemURL(folderpath, function (dir) {
            dir.getFile(filename, {
              create: true
            }, function (file) {
              file.createWriter(function (fileWriter) {
                fileWriter.write(DataBlob);
                resolve(true);
              }, function (error) {
                self.logger.log(self.fileName, "saveBase64File", "Error: Unable to save " + filename + " in " + folderpath);
                reject(error);
              });
            });
          });
        } else {
          resolve(true);
        }
      } catch (err) {
        self.logger.log(self.fileName, "saveBase64File", "Error: Unable to save " + filename + " in " + folderpath + ": " + JSON.stringify(err));
        reject(err);
      }
    });
  };

  isNotNull(value) {
    return value && value != '';
  }

  makeNameUnique(currentName) {
    let ext = currentName.split('.').slice(-1).join();
    let name = currentName.split('.').join('') + Date.now() + (Math.floor(Math.random() * 1000));
    return `${name}.${ext}`;
  }
  /**
   * 08/07/2018 Zohaib Khan: Updated method with file plugin
   */
  saveBase64Attachment(folderpath, filename, content, contentType) {
    return new Promise((resolve, reject) => {
      let imageFromCamera = false;
      let DataBlob = this.b64toBlob(content, contentType, null);
      if (this.platform.is('ios') && filename == 'image.jpg') {
        filename = this.makeNameUnique(filename);
        imageFromCamera = true;
      }
      this.file.writeFile(folderpath, filename, DataBlob).then(res => {
        if (imageFromCamera) resolve(res);
        else resolve(true);
      }).catch((err: any) => {
        this.logger.log(this.fileName, "saveBase64File", "Error: Unable to save " + filename + " in " + folderpath + ": " + JSON.stringify(err));
        resolve(false);
      })
    });
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, {
      type: contentType
    });
    return blob;
  };

  openFile(filePath, fileType, callback) {
    let self = this;
    if (this.platform.is('cordova')) {
      // console.log("filePath=" + filePath + "=AND fileType=" + fileType);
      cordova.plugins.fileOpener2.open(filePath, fileType, {

        error: function (e) {
          self.logger.log(self.fileName, "openFile", "Error: " + JSON.stringify(e));
          if (callback != null && callback != undefined) {
            callback();
          }
        },
        success: function () {
          // console.log('File opened successfully');
        }
      });
    } else {
      if (callback != null && callback != undefined) {
        callback();
      }
    }
  };

  checkIfFileExists(filePath, callback) {
    let self = this;
    return new Promise((resolve, reject) => {
      try {
        if (this.platform.is('cordova')) {
          window.resolveLocalFileSystemURL(filePath, function (fileExists) {
            // console.log("ACCESS GRANTED");
            resolve(true);
          });
        } else {
          if (callback != null && callback != undefined) {
            callback();
          }
        }
      } catch (err) {
        self.logger.log(self.fileName, "checkIfFileExists", "Error in Promise: " + JSON.stringify(err));
        resolve();
      }
    });
  };

  // base64toBlob(base64Data, contentType) {
  //     contentType = contentType || '';
  //     let sliceSize = 1024;
  //     let byteCharacters = atob(base64Data);
  //     let bytesLength = byteCharacters.length;
  //     let slicesCount = Math.ceil(bytesLength / sliceSize);
  //     let byteArrays = new Array(slicesCount);

  //     for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
  //         let begin = sliceIndex * sliceSize;
  //         let end = Math.min(begin + sliceSize, bytesLength);

  //         let bytes = new Array(end - begin);
  //         for (let offset = begin, i = 0 ; offset < end; ++i, ++offset) {
  //             bytes[i] = byteCharacters[offset].charCodeAt(0);
  //         }
  //         byteArrays[sliceIndex] = new Uint8Array(bytes);
  //     }
  //     return new Blob(byteArrays, { type: contentType });
  // }


  public showModal(pageComponent, options: any, settings) {
    this.modal = this.modalController.create(pageComponent, options, settings);
    return this.modal;
  }

  public showPopover(pageComponent) {
    this.popover = this.popoverCtrl.create(pageComponent);
    return this.popover;
  }

  public closePopover() {
    this.popover.dismiss();
  }

  //public closeModal() {
  //  if (this.modal) {
  //    this.modal.dismiss().then(() => { this.isPopupOpen = false; });
  //  }
  //}

  saveLanguageFile(data, fileName) {
    return this.file.writeFile(this.file.dataDirectory + '/lang', fileName, data, { replace: true });
  }

  saveTimeExportEntries(data, fileName) {
    return this.file.writeFile(this.file.dataDirectory + '/temp', fileName, data, { replace: true });
  }

  /**
   * 
   * @param UtilityProvider 
   * @param newDirName 
   */

  copyDir(dirName, newDirName) {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.file.checkDir(cordova.file.dataDirectory, newDirName).then((res) => {
          if (res) {
            resolve(true);
          }
        }).catch((err: any) => {
          if (err.message != 'NOT_FOUND_ERR') this.logger.log(this.fileName, "copyDir", "Error in checkDir: " + JSON.stringify(err));
          this.file.copyDir(cordova.file.applicationDirectory, dirName, cordova.file.dataDirectory, newDirName).then((res) => {
            resolve(true);
          }).catch((err: any) => {
            if (err.message != 'NOT_FOUND_ERR') this.logger.log(this.fileName, "copyDir", "Error in copyDir: " + JSON.stringify(err));
            resolve(true);
          });
        });
      } else {
        resolve(false);
      }
    })
  }

  /**
   *  07/31/2018 Zohaib Khan
   *  The method createDir is creating directory
   */
  public createDir(path, dirName) {
    return new Promise((resolve, reject) => {
      this.file.createDir(path, dirName, true).then(res => {
        // this.logger.log(this.fileName, "createDir", "Logs Directory Created");
        resolve();
      }).catch(err => {
        this.logger.log(this.fileName, "createDir", "Error createDir: " + JSON.stringify(err));
        reject(err);
      });
    });
  }

  public presentToast(msg, duration, position, cssClass) {
    let toast = this.toastController.create({
      message: msg,
      duration: duration,
      position: position,  //"top", "middle", "bottom".
      cssClass: cssClass
    });
    toast.present();
  }

  public presentToastButtom(msg, duration, position, cssClass, btnMsg) {
    let toast = this.toastController.create({
      message: msg,
      duration: duration,
      position: position,
      cssClass: cssClass,
      showCloseButton: true,
      closeButtonText: btnMsg,
      dismissOnPageChange: true
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }
  // 09-12-18 Suraj Gorai --OKTA inappbrowser code remove, now we use OKTA JWT process


  extractDomain(url) {
    let domain;
    if (url.indexOf('://') > -1) {
      domain = url.split('/')[2];
    }
    else {
      domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];

    return domain;
  }

  isEquivalentURL(url1, url2) {

    if (url1.indexOf("https") === 0 && url2.indexOf("https") === 0) {
      url1 = this.getPort(url1) === 443 ? url1.replace(':443', '') : url1;
      url2 = this.getPort(url2) === 443 ? url2.replace(':443', '') : url2;
    } else if (url1.indexOf("https") === -1 && url2.indexOf("https") === -1) {
      url1 = this.getPort(url1) === 80 ? url1.replace(':80', '') : url1;
      url2 = this.getPort(url2) === 80 ? url2.replace(':80', '') : url2;
    }

    return url1.indexOf(url2) === 0;

  };

  getPort(url) {
    let colonIdx = url.indexOf(':', 7);
    let slashIdx = url.indexOf('/', colonIdx);
    if (colonIdx > 0 && slashIdx == -1) {
      slashIdx = url.length;
    }
    let port = url.substr(colonIdx + 1, slashIdx - colonIdx - 1);
    if (port && !isNaN(port * 1)) {
      return port * 1;
    } else {
      return -1;
    }
  };

  setFab(fab) {
    this.fab = fab;
  }

  closeFab() {
    if (this.fab) {
      this.fab.close();
    }
  }

  /**
   * 08/07/2018, Mayur Varshney
   * create blob from jsonArray type data
   * promise type function
   * @returns blob
   * @memberof UtilityProvider
   */
  createCSV(jsonArr) {
    return new Promise((resolve, reject) => {
      // 08/07/2018 Mayur Varshney -- object.keys(res[0]) getting only key name for particular object from JSON of zeroth index
      let fields = Object.keys(jsonArr[0]);
      let replacer = function (key, value) { return value === null ? '' : value }
      let csv = jsonArr.map(function (row) {
        return fields.map(function (fieldName) {
          return JSON.stringify(row[fieldName], replacer)
        }).join(',')
      })
      csv.unshift(fields.join(',')) // add header column
      let csvData = csv.join('\r\n');
      // this.logger.log(this.fileName, 'getLanguage_Key_Mappings', csvData);
      let blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv' });
      resolve(blob);
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'exportCSV', 'Error in exportCSV : ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }

  /**
    * 08/07/2018 Zohaib Khan: Created method to resize the larger images
    */
  // 01/14/2019 -- Mayur Varshney -- handle error during creating thumbnail
  generateThumbnail(URI, quality, width, height, newName) {
    return new Promise((resolve, reject) => {
      this.imageResizer.resize({
        uri: URI,
        quality: quality,
        width: width,
        height: height,
        fileName: newName,
      }).then(resUri => {
        resolve(resUri)
      }).catch((err: any) => {
        reject(err);
        this.logger.log(this.fileName, "generateThumbnail", "Error in resize : " + JSON.stringify(err));
      });
    }).catch((err: any) => {
      this.logger.log(this.fileName, "generateThumbnail", "Error in promise: " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
  * 08/07/2018 Zohaib Khan: Created method to move the resized images
  */
  moveFile(filepath, filename, newPath, newName) {
    return new Promise((resolve, reject) => {
      this.file.moveFile(filepath, filename, newPath, newName).then(() => {
        resolve(true);
      }).catch((err: any) => {
        this.logger.log(this.fileName, "moveFile", "Error in moveFile: " + JSON.stringify(err));
        resolve(false);
      });
    });
  }

  /**
  * 08/07/2018 Zohaib Khan: Created method to delete the images & Files
  */
  deleteFile(path, filename) {
    return new Promise((resolve, reject) => {
      this.file.removeFile(path, filename).then(res => {
        resolve();
      }).catch((err: any) => {
        if (err.message != 'NOT_FOUND_ERR') this.logger.log(this.fileName, "deleteFile", "Error in deleteFile: " + JSON.stringify(err));
        else this.logger.log(this.fileName, "deleteFile", "File " + filename + " does not exist in Path: " + path);
        resolve();
      });
    });
  }

  /**
  * 08/07/2018 Zohaib Khan: Created method to check if file exist in the path or not
  */
  checkFileIfExist(filepath, filename) {
    return new Promise((resolve, reject) => {
      this.file.checkFile(filepath, filename).then(res => {
        resolve(res);
      }).catch((err: any) => {
        if (err.message != 'NOT_FOUND_ERR') this.logger.log(this.fileName, "checkFileIfExist", "Error in checkFile : " + JSON.stringify(err));
        resolve(false);
      })
    });
  }

  checkDirIfExist(filepath, filename) {
    return new Promise((resolve, reject) => {
      this.file.checkDir(filepath, filename).then(res => {
        resolve(res);
      }).catch((err: any) => {
        if (err.message != 'NOT_FOUND_ERR') this.logger.log(this.fileName, "checkDirIfExist", "Check DIR : " + JSON.stringify(err));
        resolve(false);
      })
    });
  }

  /**
  * 08/07/2018 Zohaib Khan: Checking if directory exists or not
  */
  checkIfDirectoryExist(path, dirName) {
    return new Promise((resolve, reject) => {
      this.file.checkDir(path, dirName).then(res => {
        resolve(res)
      }).catch((err: any) => {
        if (err.message != 'NOT_FOUND_ERR') this.logger.log(this.fileName, "checkIfDirectoryExist", "Error in checkDir : " + JSON.stringify(err));
        resolve(false);
      });
    })
  }

  /**
   * Event Handler when Network Disconnects. This event handler logs the Online duration of a user
   *
   * @memberof UtilityProvider
   */
  subscribeToNetworkDiconnectEvent() {
    this.network.onDisconnect().subscribe(() => {
      this.logOnlineAcivity();
      this.logger.log(this.fileName, "onDisconnect", 'network was disconnected :-( ' + this.network.type);
      this.isOnline = false;
    });
  }

  /**
   * Log an event for the Online Duration of a User
   *
   * @memberof UtilityProvider
   */
  logOnlineAcivity() {
    try {
      if (!this.isAppInBackground) {
        this.lastOfflineTime = new Date();
        // 09-17-2018 Mayur Varshney -- change duration from minutes to milliseconds
        var onlineDuration = (this.lastOfflineTime.getTime() - this.lastOnlineTime.getTime());
        this.logger.log(this.fileName, "logOnlineAcivity", "Online Duration: " + onlineDuration + " Milliseconds");
        if (onlineDuration >= 1) {
          // 09-17-2018 Mayur Varshney -- change DurationInMinutes key to DurationInMilliseconds
          // 10/10/2018 -- Mayur Varshney -- add user name to the properties
          // 02-22-2019 -- Prateek -- set common naming Naming Convention for events.
          let eventData = { DurationInMilliseconds: onlineDuration.toFixed(2) };
          // 04/06/2018 -- Mayur Varshney -- log analytics to add multiple duration in single record
          this.cloudProvider.logWorkingCustomEvent("OnlineActivity", eventData);
          // this.cloudProvider.logCustomEvent("OnlineActivity", eventData);
        }
      }
    } catch (error) {
      this.logger.log(this.fileName, "logOnlineActivity", "Error in logOnlineActivity: " + JSON.stringify(error));
    }
  }

  /**
   * Event Handler when Network Connects. This event handler logs the Offline duration of a user and Sends it to the MCS
   *
   * @memberof UtilityProvider
   */
  subscribeToNetworkConnectEvent() {
    this.network.onConnect().subscribe(() => {
      this.logOfflineAcivity();
      this.logger.log(this.fileName, "onConnect", 'network connected!' + this.network.type);
      this.isOnline = true;
    });
  }

  /**
   * Log an event for the Offline Duration of a User
   *
   * @memberof UtilityProvider
   */
  logOfflineAcivity() {
    try {
      if (!this.isAppInBackground) {
        this.lastOnlineTime = new Date();
        // 09-17-2018 Mayur Varshney -- change duration from minutes to milliseconds
        var offlineDuration = Math.abs(this.lastOnlineTime.getTime() - this.lastOfflineTime.getTime());
        this.logger.log(this.fileName, "logOfflineAcivity", "Offline Duration: " + offlineDuration + " Milliseconds");
        // 09-17-2018 Mayur Varshney -- change DurationInMinutes key to DurationInMilliseconds
        // 10/10/2018 -- Mayur Varshney -- add user name to the properties
        // 02-22-2019 -- Prateek -- set common naming Naming Convention.
        let eventData = { DurationInMilliseconds: offlineDuration.toFixed(2) };
        // 04/06/2018 -- Mayur Varshney -- log analytics to add multiple duration in single record
        this.cloudProvider.logWorkingCustomEvent("OfflineActivity", eventData);
        // this.cloudProvider.logCustomEvent("OfflineActivity", eventData).then(() => {
        // 03/15/2019 -- Mayur Varshney -- stop flushing analytics
        // this.cloudProvider.flushAnalyticsEvents();
        // }).catch((err: any) => {
        //   this.logger.log(this.fileName, 'logOfflineAcivity', 'Error in logCustomEvent : ' + JSON.stringify(err));
        // });

        // 03/15/2019 -- Mayur Varshney -- comment previous check for log custom events
        // if (offlineDuration >= 1) {
        //   let eventData = { DurationInMilliseconds: offlineDuration.toFixed(2) };
        //   this.cloudProvider.logCustomEvent("OfflineActivity", eventData).then(() => {
        //     this.cloudProvider.flushAnalyticsEvents();
        //   }).catch((err: any) => {
        //     this.logger.log(this.fileName, 'logOfflineAcivity', 'Error in logCustomEvent : ' + JSON.stringify(err));
        //   });
        // } else {
        //   this.cloudProvider.flushAnalyticsEvents();
        // }
      }
    } catch (error) {
      this.logger.log(this.fileName, "logOfflineAcivity", "Error in : logOfflineAcivity" + JSON.stringify(error));
    }
  }

  /**
   * Logs Either Online or Offline Duration on basis of Network Type
   *
   * @memberof UtilityProvider
   */
  endCurrentSession() {
    this.isOnline = this.network.type != 'none';
    if (this.isOnline) {
      this.logOnlineAcivity();
    } else {
      this.logOfflineAcivity();
    }
  }

  /**
   * Resets the Initial Online/Offline Time and Sends the Analytics to MCS if User is Online
   *
   * @memberof UtilityProvider
   */
  resetSession() {
    this.isOnline = this.network.type != 'none';
    if (this.isOnline) {
      this.lastOnlineTime = new Date();
      // 03/15/2019 -- Mayur Varshney -- stop flushing analytics
      // this.cloudProvider.flushAnalyticsEvents();
    } else {
      this.lastOfflineTime = new Date();
    }
  }

  /**
   * Sets Last Online Time
   *
   * @param {*} onlineTime
   * @memberof UtilityProvider
   */
  setLastOnlineTime(onlineTime) {
    this.lastOnlineTime = onlineTime;
  }

  /**
   * Subscribe to Event when App goes in Background or Foreground.
   * Logs Analytic Event when App Goes in Background
   * Resets Online/Offline Time when App comes in Forground and sends the Analytics to MCS if Online
   *
   * @memberof UtilityProvider
   */
  subscribeToPauseAndResumeEvent() {
    this.platform.pause.subscribe(() => {
      // console.log("pause", moment().format('YYYY-MM-DD HH:mm:ss'));
      this.endCurrentSession();
      this.logger.log(this.fileName, "subscribeToPauseAndResumeEvent", "App is in background");
      this.isAppInBackground = true;
    });
    this.platform.resume.subscribe(() => {
      this.resetSession();
      this.logger.log(this.fileName, "subscribeToPauseAndResumeEvent", "App is in foreground");
      this.isAppInBackground = false;
    });
  }

  /**
   * 08/28/2018 Zohaib Khan: Added sort functionality for time to use it from Time and summary.
   */
  sortTimeArray(array) {
    array.sort((a, b) => {
      let dateStart = this.formatDateTime(a.EntryDate, a.Start_Time);
      let dateEnd = this.formatDateTime(b.EntryDate, b.Start_Time);

      if (moment(dateStart).isAfter(dateEnd)) {
        return 1;
      }

      if (moment(dateStart).isBefore(dateEnd)) {
        return -1;
      }
      return 0;
    });
  }

  formatDateTime(date, time) {
    let service_date = moment(date).format("YYYY-MM-DD");

    let formatDate = moment(service_date + ' ' + time).format("DD-MM-YYYYTHH:mm");
    let dateTime = moment(formatDate, "DD-MM-YYYYTHH:mm");
    return dateTime;
  }

  // 09/28/2018 -- Mayur Varshney -- Find no use of this function
  //// 09/04/2018 Rizwan Haider
  ///* Returns a function, that, as long as it continues to be invoked, will not
  //be triggered. The function will be called after it stops being called for
  //N milliseconds. If `immediate` is passed, trigger the function on the
  //leading edge, instead of the trailing. */
  //debounce(func, wait, immediate) {
  //  let timeout;
  //  return function () {
  //    let context = this, args = arguments;
  //    let later = function () {
  //      timeout = null;
  //      if (!immediate) {
  //        func.apply(context, args);
  //      }
  //    };
  //    let callNow = immediate && !timeout;
  //    clearTimeout(timeout);
  //    timeout = setTimeout(later, wait);
  //    if (callNow) {
  //      func.apply(context, args);
  //    }
  //  };
  //}

  /**
   * 09/19/18 Suraj Gorai
   * @returns if token not expire then only resolve() call, if token expire then return refresh token
   * @memberOf UtilityProvider
   */
  checkExpireToken() {
    return new Promise((resolve, reject) => {
      this.storage.get("expiredata").then((val) => {
        let datenow = moment().valueOf();
        // this.logger.log(this.fileName, 'checkExpireToken => refreshToken', ' at ' + new Date()) + ' with datenow: ' + datenow + ' and expire:' + val.expiretime;
        if (moment(datenow).isSameOrBefore(val.expiretime)) {
          resolve();
        } else {
          reject(val.refreshtoken);
        }
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'checkExpireToken', 'Error in expiredata : ' + JSON.stringify(err));
        reject(err);
      });
    });
  }

  /**
   * 09/20/18 Suraj Gorai -- check user loged in diffrent device its auto logout from current device
   * 10/24/18 Suraj Gorai -- Change toast to alert message
   * @memberOf UtilityProvider
   */
  forcelogout(msg) {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("User Login"),
      message: msg,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: this.translate.instant('OK'),
          handler: () => {
            this.forcelogoutValidationCheck = false;
            // this.logger.log(this.fileName, 'forcelogout', msg);
            this.events.publish('forceAppLogout');
          }
        }
      ],
      cssClass: 'forcelogoutAlert'
    });
    if (!this.forcelogoutValidationCheck) {
      this.forcelogoutValidationCheck = true;
      alert.present();
    }
  }

  // 09/24/2018 - Mayur Varshney - remove duplicate array item and sort in order
  removeDuplicateItemFromArray(array) {
    return (Array.from(new Set(array))).sort();
  }

  getDuration(startTime, endTime) {
    let Formatedduration = '00:00';
    let endtime = moment(endTime).format("HH:mm");
    let startime = moment(startTime).format("HH:mm");
    let end = this.formatDateTime(endTime, endtime);
    let start = this.formatDateTime(startTime, startime);
    let duration = moment.duration(end.diff(start));
    let hours = duration.asHours();
    let minutes = duration.asMinutes() - hours * 60;
    let hoursToMin = hours * 60;
    let totalTimeInMin = hoursToMin + minutes;
    let updateHours = Math.floor(Math.abs(totalTimeInMin / 60));
    let updateMin = Math.floor(totalTimeInMin % 60);
    //09/06/2018 kamal: add 0 to number less than 10 in hours
    if (isNaN(totalTimeInMin) || totalTimeInMin  < 0) {
      return Formatedduration;
    }
    if (updateHours <= 9) {
      Formatedduration = ('0' + updateHours).slice(-2) + ":" + ('0' + +updateMin).slice(-2);
    } else {
      Formatedduration = updateHours + ":" + ('0' + +updateMin).slice(-2);
    }
    return Formatedduration;
  }

  //10/01/2018 -- Mayur Varshney -- restrict special characters in filename
  checkSpecialCharactersForFileName(filename) {
    let condition;
    switch (filename.includes('/') || filename.includes('*') || filename.includes(':') || filename.includes('?') || filename.includes('"') || filename.includes('<') || filename.includes('>') || filename.includes('|') || filename.includes('%') || filename.includes('#') || filename.includes('{') || filename.includes('}') || filename.includes('[') || filename.includes(']')) {
      case true:
        condition = true;
        break;
      case false:
        condition = false;
        break;
    }
    return condition;
  }

  //10-04/2018 -- Mayur Varshney -- find name and type from file
  generateFileNameAndType(attachment) {
    let name;
    let type;
    let period = attachment.lastIndexOf(".");
    switch (true) {
      case period == -1:
        name = attachment;
        type = '';
        break;
      case period > 0:
        name = attachment.slice(0, period);
        type = attachment.slice(period + 1, attachment.length);//.toLowerCase();
        break;
    }
    return ({ 'Name': name, 'Type': type });
  }

  //10-04/2018 -- Mayur Varshney -- find name and type from file
  generateFileDiscNameAndType(fileData) {
    let type;
    let period = fileData.filename.lastIndexOf(".");
    switch (true) {
      case period == -1:
        type = '';
        break;
      case period > 0:
        type = fileData.filename.slice(period + 1, fileData.filename.length).toLowerCase();
        break;
    }
    let name = fileData.fileDisc;
    return ({ 'Name': name, 'Type': type });
  }

  //01/16/2019 -- Mayur Varshney -- find name and type from file in SDR
  generateFileDiscNameAndTypeSDR(fileData) {
    let type;
    let name;
    let period = fileData.lastIndexOf(".");
    switch (true) {
      case period == -1:
        type = '';
        name = fileData.slice(period + 1, fileData.length);
        break;
      case period > 0:
        name = fileData.slice(0, period);
        type = fileData.slice(period + 1, fileData.length).toLowerCase();
        break;
    }
    return ({ 'Name': name, 'Type': type });
  }

  groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    })
  }

  /**
  * sorting array data
  * @export
  * @class Utility provider
  * @author Mayur Varshney
  */
  getSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }

  removeSpace(status) {
    return status.replace(/\s/g, '');
  }

  groupBySameKeyValues(xs, k) {
    return xs.reduce(function (rv, x) {
      (rv[x[k]] = rv[x[k]] || []).push(x);
      return rv;
    }, {});
  }

  getReportList(elements, zeroElm) {
    var element = zeroElm;
    for (var i = 0; i < elements.length; i++) {
      var jsonObj = elements[i];
      element[jsonObj.ElementName] = jsonObj.Value;
    }
    return element;
  }

  /**
   * 12/26/2018, Mansi Arora
   * Removing duplicate values from array
   * @returns array
   * @memberof UtilityProvider
   */
  removeDuplicates(arr) {
    return new Promise((resolve, reject) => {
      let unique_array = []
      for (let i = 0; i < arr.length; i++) {
        if (unique_array.indexOf(arr[i]) == -1) {
          unique_array.push(arr[i])
        }
      }
      resolve(unique_array);
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'removeDuplicates', 'Error in removeDuplicates : ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }

  /**
   * 12/26/2018, Mansi Arora
   * validate email array to send mail
   * @returns array
   * @memberof UtilityProvider
   */
  validateEmailToMail(str) {
    return new Promise((resolve, reject) => {
      let recipient = str.trim().replace(/[ ;,]+/g, ',').split(',');
      let rec: any = [];
      for (let i = 0; i < recipient.length; i++) {
        if (!(recipient[i] == '') && (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(recipient[i]))) {
          rec.push(recipient[i]);
        }
      }
      this.removeDuplicates(rec).then((res) => {
        rec = res;
        resolve(rec);
      }).catch((err) => {
        this.logger.log(this.fileName, 'validateEmailToMail', "Error: " + JSON.stringify(err));
        return Promise.reject(err);
      });
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'validateEmailToMail', 'Error in validateEmailToMail : ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }

  /**
   *12-18-2018
   * getDetailed notes attachments.
   * @param {*} filepath
   * @param {*} attachment
   * @returns
   * @memberof UtilityProvider
   */
  getDetailedNotesAttachmentObjectForDisplay(filepath, attachment) {
    // 12-/28/2018 -- Added code to sow attachment on detailed notes.
    return new Promise((resolve, reject) => {
      let attachmentNameAndType = this.generateFileNameAndType(attachment.File_Name);
      let attachmentObject: any = {};
      if (!this.platform.is('cordova')) {
        attachmentObject.base64 = "";
      }
      // 01-18-2019 -- Mansi Arora -- field name updated as per table
      attachmentObject.Attachment_Id = attachment.Attachment_ID;
      attachmentObject.contentType = attachment.File_Type;
      attachmentObject.fileDisc = attachmentNameAndType.Name;
      attachmentObject.filename = attachment.File_Name;
      attachmentObject.filetype = attachmentNameAndType.Type;
      attachmentObject.Attachment_Type = attachment.Attachment_Type
      resolve(attachmentObject);
    }).catch(err => {
      this.logger.log(this.fileName, "getDetailedNotesAttachmentObjectForDisplay", "Error: " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
   * 01/09/2019 - Mayur Varshney
   * check file size
   * @param {*} file
   * @returns result, error msg
   * @memberof UtilityProvider
   */
  checkFileSize(file) {
    let result;
    if (file.size / 1048576 > 10) {
      result = {
        'msg': this.translate.instant("Attachment size too large. Size should be less than 10MB"),
        'result': false
      }
      return result;
    } else if (file.size == 0) {
      result = {
        'msg': this.translate.instant("Attachment is corrupted, please try again with right file"),
        'result': false
      }
      return result;
    } else {
      result = {
        'msg': "",
        'result': true
      }
      return result;
    }
  }

  /**
   *01-14-2018 Radheshyam kumar
   *This function comes if user on sdf flow and there is unsaved data and user want to move back.
   * @param {*} component
   * @memberof UtilityProvider
   */
  // confirmAlert(component) {
  //   let alert = this.alertCtrl.create({
  //     title: Enums.Messages.Alert_Confirm_Title,
  //     message: Enums.Messages.Navigation_Confirm_Back,
  //     enableBackdropDismiss: false,
  //     buttons: [
  //       {
  //         text: 'No',
  //         handler: () => {
  //         }
  //       },
  //       {
  //         text: 'Yes',
  //         handler: () => {
  //           this.valueProvider.setHeaderNav(false);
  //           this.valueProvider.setCurrentSDRTabIndex(2);
  //           if (component == "loginpage") {
  //             this.events.publish('appclose', true);
  //           } else if (component == 'leave') {
  //             this.events.publish('leave:page', true);
  //           } else if (component == 'popover') {
  //             this.events.publish('goto:prefrence', true);
  //           } else {
  //             this.events.publish('goto:page', component);
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  /**
   * 01-15-2018 Mayur Varshney
   * check and create directory by passing path and folder name
   * create thumbnail on the basis of boolean value
   * @param {*} path
   * @param folderName
   * @param createThumbnail
   * @memberof UtilityProvider
   */
  createDirIfNotExist(path, folderName, createThumbnail) {
    return new Promise((resolve, reject) => {
      this.checkIfDirectoryExist(path, folderName).then(res => {
        if (!res) {
          this.createDir(path, folderName).then(resp => {
            if (createThumbnail) {
              this.createDir(path + folderName + "/", "thumbnails").then(() => {
                resolve(true);
              }).catch((err) => {
                this.logger.log(this.fileName, "createDirIfNotExist", "Error in createDir: " + JSON.stringify(err));
                reject(err);
              });
            } else {
              resolve(true);
            }
          }).catch((err) => {
            this.logger.log(this.fileName, "createDirIfNotExist", "Error in createDir: " + JSON.stringify(err));
            reject(err);
          });
        } else {
          resolve(true);
        }
      });
    })
  }

  /**
   * 01-15-2018 Mayur Varshney
   * check and delete directory by passing path and folder name
   * @param {*} path
   * @param folderName
   * @memberof UtilityProvider
   */
  deleteDirIfExist(path, folderName) {
    return new Promise((resolve, reject) => {
      this.checkIfDirectoryExist(path, folderName).then(res => {
        if (res) {
          this.deleteDirData(path, folderName).then(() => {
            resolve(true);
          });
        } else {
          resolve(true);
        }
      });
    }).catch((err) => {
      this.logger.log(this.fileName, "deleteDirIfExist", "Error: " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
   * 01-15-2018 Mayur Varshney
   * remove directory by passing path and folder name
   * again create folder with current report Id after deleting the folder to clean internal files
   * @param {*} path
   * @param folderName
   * @memberof UtilityProvider
   */
  public deleteDirData(path, dirName) {
    return new Promise((resolve, reject) => {
      this.file.removeRecursively(path, dirName).then(res => {
        this.logger.log(this.fileName, "deleteDir", path + dirName + " directory deleted successfully");
        this.createDir(path, dirName).then(() => {
          this.logger.log(this.fileName, "deleteDirData", path + dirName + " directory re-created successfully");
          resolve(true);
        });
      }).catch(err => {
        this.logger.log(this.fileName, "deleteDirData", "Error during removeRecursively: " + JSON.stringify(err));
        return Promise.reject(err);
      });
    });
  }

  /**
   * 01-17-2018 Mayur Varshney
   * check file if exist in folder
   * @param path
   * @param file
   * @memberof UtilityProvider
   */
  public getFile(path, file) {
    return new Promise((resolve, reject) => {
      this.file.resolveDirectoryUrl(path).then((res) => {
        this.file.getFile(res, file, { create: false }).then((res: any) => {
          this.logger.log(this.fileName, "getFile", "file already exist");
          resolve(true);
        }).catch(err => {
          this.logger.log(this.fileName, "getFile", "file not exist");
          resolve(false);
        });
      });
    }).catch(err => {
      this.logger.log(this.fileName, "getFile", "Error in promise: " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  _keyPressInText(event: any, limit) {
    if (event.target.textLength > limit) {
      event.preventDefault();
    }
  }

  /**
   *02-06-2019 Radheshyam kumar
   * Rremoved tost from sdr and added alert.
   * @param {*} [elements]
   * @memberof UtilityProvider
   */
  public presentAlert(elements?) {
    let alert = this.alertCtrl.create({
      title: Enums.Messages.Alert_Title,
      subTitle: this.translate.instant(Enums.Messages.SDR_Required_Msg),
      enableBackdropDismiss: false,
      buttons: [{
        text: this.translate.instant('Ok')
      }]
    });
    alert.present();
  }

  /**
   * 02/19/2019 Mayur Varshney
   * show message on the basis of err code
   * @param {*} err
   * @memberof UtilityProvider
   */
  checkUserIssueMessage(err) {
    if (!err.statusCode) { // If user use third party VPN "statusCode" always return 0
      this.presentToast(this.translate.instant("Unable to connect to server!!!"), 2000, 'top', '');
    } else if (err.statusCode == 422) {
      this.logger.log(this.fileName, 'checkUserIssueMessage', "err.data.error : " + err.data.error);
      this.forcelogout(err.data.errorCode);
    } else if (err.data.errorCode == "ETIMEDOUT") {
      this.presentToast(this.translate.instant("Unable to connect to server, Try again."), 2000, 'top', '');
    }
  }

  /**
   *@author:Prateek (20/02/2019)
   *Ipad selecting date on single click
   */
  singleClickDaySelector(event, dp1, dp2?, dp3?, dp4?) {
    const dayHoverHandler = event.dayHoverHandler;
    const hoverWrapper = (hoverEvent) => {
      const { cell, isHovered } = hoverEvent;
      if ((isHovered &&
        !!navigator.platform &&
        /iPad|iPhone|iPod/.test(navigator.platform)) &&
        'ontouchstart' in window
      ) {
        if (dp2) (dp2 as any)._datepickerRef.instance.daySelectHandler(cell);
        if (dp1) (dp1 as any)._datepickerRef.instance.daySelectHandler(cell);
        if (dp3) (dp3 as any)._datepickerRef.instance.daySelectHandler(cell);
        if (dp4) (dp4 as any)._datepickerRef.instance.daySelectHandler(cell);

      }
      return dayHoverHandler(hoverEvent);
    };
    return hoverWrapper;
  }

  // 02-19-2019 -- Mansi Arora -- getter & setter for appVersion
  public setAppVersion(version) {
    this.appVersion = version;
  }

  public getAppVersion() {
    return this.appVersion;
  }


  /**
   *
   * Update by Suketu Vyas for APPUPDATE feature
   */

  isNewVersionFromConfig = false;
  public checkVersionFromCofig() {
    return this.fileUpdater.getAppConfig().subscribe(
      data => {

        // console.log('Util APP-CONFIG : ', JSON.stringify(data))

        this.fileUpdater.versionConfig = data;
        if (this.fileUpdater.localDBConfig.softVersion != data['softVersion']) {
          this.fileUpdater.newSoftVersion = data['softVersion'];
          this.isNewVersionFromConfig = true;
          console.log('New Version Avaulable:', this.fileUpdater.newSoftVersion)
        }
      },
      error => {
        console.log('Util APP-CONFIG  ERROR : ', JSON.stringify(error))
      })
  }


  isNewVersionDownloaded = false;
  downloadNewVersionFileTime;
  zipContentType = "application/zip"
  downloadNewVersionFile() {
    this.updateInProgress = true;
    return new Promise((resolve, reject) => {
      // 05/28/2019 -- Mayur Varshney -- logout user in application before downloading package file
      //   this.events.publish('appLogout');
      this.downloadNewVersionFileTime = new Date();
      let fURL = this.fileUpdater.appUpdateURL + this.fileUpdater.newSoftVersion + '.txt';

      /*************DOWNLOAD ZIP FILE AS BASE64 TEXT FILE & SAVE TO FILE SYSTEM AS ZIP**************/
      this.getBase64TextFile(fURL, function (myBase64) {
        var filename = this.fileUpdater.newSoftVersion + '.zip';
        //   let base64 = myBase64.split("base64,")[1];
        this.saveBase64Attachment(this.fileUpdater.localDBConfig.localPath, filename, myBase64, this.zipContentType).then((res) => {
          //  console.log('Utils download complete: ', this.fileUpdater.get_time_diff(this.downloadNewVersionFileTime));
          this.logger.log(this.fileName, 'Utils download complete: ', this.fileUpdater.get_time_diff(this.downloadNewVersionFileTime));
          console.log("File Saved Successfully !!", res);
          this.isNewVersionDownloaded = true;
          setTimeout(function () {

            this.fileUpdater.extractSoftupdateZip().then((res: any) => {
              resolve(true);
            }).catch((err) => {
              this.showErrorAlertAppUpdate('Package Extraction Failed.');
              this.logger.log(this.fileName, 'downloadNewVersionFile', "Error in extractSoftupdateZip of FileUpdater : " + JSON.stringify(err));
              return Promise.reject(err);
            });
          }.bind(this), 10000);

        }).catch((err) => {
          console.log("Error Saving file !!", err);
          this.showErrorAlertAppUpdate('Package download Failed.');
          console.log('Utils ERROR download : ' + err);
          console.log(JSON.stringify(err))
          reject(err);
        });
      }.bind(this));

      /*************BELOW CODE IS THE ANOTHER APPROACH TO DOWNLOAD AND EXTRACT ZIP THE FILE**************/

      /* this.fileUpdater.downloadFileToDataDir(this.fileUpdater.appUpdateURL + fPath, fPath).then((entry) => {
         console.log('Utils download complete: ' + entry.toURL(), this.fileUpdater.get_time_diff(this.downloadNewVersionFileTime));
         this.isNewVersionDownloaded = true;
         this.fileUpdater.extractSoftupdateZip().then((res: any) => {
           resolve(true);
         }).catch((err) => {
           this.showErrorAlertAppUpdate('Package download Failed.');
           this.logger.log(this.fileName, 'downloadNewVersionFile', "Error in extractSoftupdateZip of FileUpdater : " + JSON.stringify(err));
           return Promise.reject(err);
         });
       }, (error) => {
         // handle error
         this.showErrorAlertAppUpdate('Package download Failed.');
         console.log('Utils ERROR download : ' + error);
         console.log(JSON.stringify(error))
         reject(error);
       }); */
    }).catch((err) => {
      this.logger.log(this.fileName, 'downloadNewVersionFile', "Error in promise : " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /*************GET BASE64 TEXT FILE **************/
  getBase64TextFile(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      console.log("Got XHR response:");
      callback(xhr.response);

    };
    xhr.open('GET', url);
    xhr.responseType = 'text';
    xhr.send();
  }

  updateInProgress = false;
  // onEmersonDBUpdated = new EventEmitter()
  autoUpdateSubscriptions() {

    //This is on ZIP Ext done.
    this.fileUpdater.onZipExtractionComplete.subscribe(res => {
      console.log("Zip Call Back: ", res);
      if (res) {
        this.localServiceProvider.updateNewEmersonDBFromLocalState();
      } else {
        this.updateInProgress = false;
        this.showErrorAlertAppUpdate('Package extraction Failed.');
      }

    }, err => {
      this.updateInProgress = false;
    })


    this.localServiceProvider.onEmersonDBUpdated.subscribe(res => {
      console.log("onEmersonDBUpdated Call Back: ", res);

      if (res) {
        this.setLocalStorageAfterAppUpdate();
        this.fileUpdater.deleteSoftupdateZip();
      } else {
        this.showErrorAlertAppUpdate('DB Update Failed.');
      }
    }, err => {
      console.log("Util, Unable to update Emerson DB")
      this.updateInProgress = false;
    })

    this.fileUpdater.onSoftupdateZipDeleted.subscribe(res => {
      console.log("zip file deleted: ", res);

      if (res) {
        this.events.publish('appLogout');
        setTimeout(function ($this) {
          $this.updateInProgress = false;
          $this.reloadApp();
        }, 5000, this);

      } else {
        this.showErrorAlertAppUpdate('ZiP Deletion Failed.');
      }


    }, err => {
      this.updateInProgress = false;
    })





    /*
      this.localServiceProvider.onCustomerDBUpdated.subscribe(res => {
        console.log("onCustomerDBUpdated Call Back: ", res);
        //this.localServiceProvider.updateNewEmersonDBFromLocalState();
      }, err => {
        console.log("Util, Unable to update Customer DB")
        this.updateInProgress = false;
      })
  */
  }



  showErrorAlertAppUpdate(reason) {
    let msg = "Unable to apply auto update. Reason: " + reason;
    let alert = this.promptAlert('Auto Update Error', msg);
    alert.present();
    alert.onDidDismiss((response) => {
      this.updateInProgress = false;
    });
  }



  setLocalStorageAfterAppUpdate() {

    this.fileUpdater.setLocalDBItem('old_softVersion', this.fileUpdater.localDBConfig.softVersion);
    this.fileUpdater.setLocalDBItem('softVersion', this.fileUpdater.newSoftVersion);
    this.fileUpdater.setLocalDBItem('files', this.fileUpdater.versionConfig['files']);
  }

  reloadApp() {
    location.reload(true)
  }







  // 02-19-2019 -- Prateek-- compare userAppVersion with latestAppVersion and show message.
  public checkForVersionUpdates(res) {
    let latestVersion;
    let userVersion;
    let devicePlatform = this.device.platform.toLowerCase();
    let finalVersion;
    this.footerData.latestAppVersion = res.data.latestAppVersion;
    // latestVersion = res.data.latestAppVersion.split('.');
    this.footerData.appURl = res.data.download_URL;
    if (devicePlatform == 'windows') {
      finalVersion = this.getAppVersion().slice(0, this.getAppVersion().lastIndexOf("."));
    }
    else {
      finalVersion = this.getAppVersion();
    }
    this.footerData.appVersion = finalVersion;
    // userVersion = finalVersion.split('.');
    // for (let i = 0; i < latestVersion.length; i++) {
    //   if (parseInt(latestVersion[i]) >= parseInt(userVersion[i])) {
    //     this.footerShow = true;
    //   }
    //   else {
    //     this.footerShow = false;
    //     return;
    //   }
    // }

    // 03/15/2019 -- Mayur Varshney -- apply logic for showing version bar
    if (parseInt(res.data.latestAppVersion.split('.')[0]) >= parseInt(finalVersion.split('.')[0])) {
      userVersion = (finalVersion.slice(0, finalVersion.lastIndexOf(".")).replace(".", "")) + (finalVersion.slice(finalVersion.lastIndexOf("."), finalVersion.length));
      latestVersion = ((res.data.latestAppVersion).slice(0, (res.data.latestAppVersion).lastIndexOf(".")).replace(".", "")) + ((res.data.latestAppVersion).slice((res.data.latestAppVersion).lastIndexOf("."), (res.data.latestAppVersion).length));
      this.footerShow = (parseFloat(latestVersion) > parseFloat(userVersion)) ? true : false;
    }
    else {
      this.footerShow = false;
    }
  }

  /**
   * 02/28/2019 Mayur Varshney
   * generate unique word on the basis of attachmentType
   * @param {*} path
   * @param attachmentType
   * @memberof UtilityProvider
   */
  getUniqueWordForAttachment(path, attachmentType) {
    let uniqueWord;
    let period;
    try {
      switch (attachmentType) {
        case Enums.AttachmentType.FCR:
          period = path.indexOf("/taskfiles");
          uniqueWord = path.slice(period + 11, path.length) + "_";
          break;
        case Enums.AttachmentType.SDR:
          period = path.indexOf("/reportfiles");
          uniqueWord = path.slice(period + 13, path.length) + "_";
          break;
        case Enums.AttachmentType.DetailedNotes:
          period = path.indexOf("/detailednotesfiles");
          uniqueWord = path.slice(period + 20, path.length) + "_";
          break;
      }
      return uniqueWord.replace('/', "_");
    } catch (error) {
      this.logger.log(this.fileName, "getUniqueWordForAttachment", "Error in catch block: " + error.message);
    }
  }
  isDowngrade() {
    return this.footerShow;

  }

  /**
   *@author Prateek 03/05/2019
   *Create funtion for in app browser for new app version
   */
  createInAppBrowser() {
    let target = "_system";
    this.logger.log(this.fileName, "createInAppBrowser", 'URL:' + this.footerData.appURl);
    this.clipboard.copy(this.footerData.appURl).then(
      (resolve: string) => {
        this.presentToast(this.translate.instant('Copy URL to clipboard'), '3000', 'top', '');
      },
      (reject: string) => {
        this.logger.log(this.fileName, 'createInAppBrowser', 'Error in createInAppBrowser, SMS : ' + reject);
      }
    );
    this.iab.create(this.footerData.appURl, target, 'location=yes')
      .on('loaderror').subscribe(event => {
        this.logger.log(this.fileName, "createInAppBrowser", 'loaderror: ' + JSON.stringify(event));
      });
  }


  /**
   * 04/01/2019 Mayur Varshney
   * show confirm alert
   * @param {*} title
   * @param msg
   * @memberof UtilityProvider
   */
  confirmationAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      message: msg,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'No',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        },
        {
          text: 'Yes',
          handler: () => {
            alert.dismiss(true);
            return false;
          }
        }
      ]
    });
    return alert;
  }

  /**
   * Preeti Varshney 03/12/2019
   * create daylist with date and days of selected week
   */
  dayListData(weekStart) {
    let dayList: any = [];
    for (let i = 0; i < 7; i++) {
      let dayid = i + 1;
      let entryDate = moment(weekStart, 'DD-MMM-YYYY');
      let dayName = moment(weekStart, 'DD-MMM-YYYY').format("ddd");
      dayList.push({
        'dayid': dayid,
        'entryDate': entryDate,
        'dayName': dayName,
        'duration': ""
      });
      weekStart = moment(weekStart, 'DD-MMM-YYYY').add(1, 'days');
    }
    return dayList;
  }

  /**
     * Pulkit 08/09/2019
     * Common Function:Get the header Data
     */
  getHeaderData(taskId, title1?, title2?, taskName?) {
    if (taskId) {
      return { title1: title1, title2: title2, taskId: taskId };
    }
    else {
      return { title1: "", title2: taskName, taskId: '' };
    }
  }
  /**
   * Prateek 03/18/2019
   * Common Function:Get the week from the current date
   */
  currentWeek() {
    let now = moment();
    let fornow = moment();
    let from_date = now.startOf('isoWeek');
    let to_date = fornow.endOf('isoWeek');
    this.WeekStart = moment(from_date).format('DD-MMM-YYYY');
    this.weekEnd = moment(to_date).format('DD-MMM-YYYY');
    // setTimeout(() => {
    //   this.events.publish('setCurrentWeek', data);
    // }, 0);
  }

  setWeekStartWeekEnd(weekStart, weekEnd) {
    this.WeekStart = weekStart;
    this.weekEnd = weekEnd;
  }

  /**
   * Preeti Varshney 03/12/2019
   * Calculate total hours
   */
  cloneDuration: any;
  totalHours(duration) {
    let inputtime = moment.duration(duration);
    let inputtimehours = inputtime.asHours();
    let inputtimeminutes = inputtime.asMinutes() - inputtimehours * 60;
    let inputtimehoursToMin = inputtimehours * 60;

    let inputtimetotalTimeInMin = inputtimehoursToMin + inputtimeminutes;

    let inputtotalHours = moment.duration(this.cloneDuration);
    let inputtotalHourshours = inputtotalHours.asHours();
    let inputtotalHoursminutes = inputtotalHours.asMinutes() - inputtotalHourshours * 60;
    let inputtotalHourshoursToMin = inputtotalHourshours * 60;
    let inputtotalHourstotalTimeInMin = inputtotalHourshoursToMin + inputtotalHoursminutes;

    let total = inputtimetotalTimeInMin + inputtotalHourstotalTimeInMin;
    let updateHours = Math.floor(Math.abs(total / 60));
    let updateMin = Math.floor(total % 60);
    let time;
    if (updateHours <= 9) {
      time = ('0' + updateHours).slice(-2) + ":" + ('0' + +updateMin).slice(-2);
    }
    else {
      time = updateHours + ":" + ('0' + +updateMin).slice(-2);
    }
    this.cloneDuration = time;
    return time;
  }

  /**
   * Preeti Varshney 04/30/2019
   * Promt alert
   */
  public promptAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      message: msg,
      enableBackdropDismiss: false,
      buttons: [{
        text: this.translate.instant('Ok')
      }]
    });
    return alert;
  }

  /* 04/02/2019 Mayur Varshney
    * add material_id(Random number) to all material quantities(whose mobile_indicator doesn't have '#' delimeter) in JSON array before saving in LocalDB
    * groupby material on the basis of Task, Item, ChargeMethod, Item_Description
    * @returns materialArr with materialId
    * @param {*} title
    * @param arrayData
    * @memberof UtilityProvider
    */
  combineMaterialArray(arrayData) {
    let temp_arr: any[] = [];
    let temp_arr2: any[] = [];
    let materialGroup: any[] = [];
    try {
      arrayData.forEach(element => {
        if (!element.Mobile_Indicator) {
          element.Mobile_Indicator = element.id;
        }
        if (element.Mobile_Indicator.indexOf("#") == -1) {
          temp_arr.push(element);
        } else {
          element.MaterialId = element.Mobile_Indicator.split("#")[0];
          temp_arr2.push(element)
        }
      });

      materialGroup = this.groupBy(temp_arr, function (item) {
        return [item.Task, item.Item, item.ChargeMethod, item.Item_Description];
      });

      materialGroup.forEach(item => {
        let randomNumber = this.getUniqueKey();
        item.map(element => {
          element.MaterialId = randomNumber;
        });
        temp_arr2 = temp_arr2.concat(item);
      });
    } catch (error) {
      this.logger.log(this.fileName, 'combineMaterialArray', "Error in try-catch block: " + error.message);
      throw error;
    }
    return temp_arr2;
  }


  /** 05/06/2019 Mayur Varshney
  * add material_id(Random number) to all material quantities(whose mobile_indicator doesn't have '#' delimeter) in JSON array before saving in LocalDB
  * groupby material on the basis of Task, Item, ChargeMethod, Item_Description
  * @returns materialArr with materialId
  * @param {*} title
  * @param arrayData
  * @memberof UtilityProvider
  */
  combineMaterialArrayDBCS(arrayData) {
    let temp_arr: any[] = [];
    let temp_arr2: any[] = [];
    let materialGroup: any[] = [];
    try {
      arrayData.forEach(element => {
        if (element.material_serial_id.indexOf("#") == -1) {
          temp_arr.push(element);
        } else {
          temp_arr2.push(element)
        }
      });

      temp_arr2.map(element => {
        element.materialid = element.material_serial_id.split("#")[0];
      });

      materialGroup = this.groupBy(temp_arr, function (item) {
        return [item.task_number, item.itemname, item.charge_type_id, item.description];
      });

      materialGroup.forEach(item => {
        let randomNumber = parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000)))
        item.map(element => {
          element.materialid = randomNumber;
        });
      });

      materialGroup.forEach(element => {
        return element.forEach(item => {
          temp_arr2.push(item);
        });
      });
    } catch (error) {
      this.logger.log(this.fileName, 'combineMaterialArray', "Error: " + error.message);
      throw error;
    }
    return temp_arr2;
  }


  /**
   * Addition of large number
   * @param {any} number1
   * @param {any} number2
   * @returns finalNumber
   * @author Mayur Varshney
   * @memberOf UtilityProvider
   */
  addLargeNumber(number1, number2) {
    //validate the nummber if there is any after decimal values. If not then concat the after decimal values. i.e, 10 --> 10.00
    number1 = this.validateNumber(number1);
    number2 = this.validateNumber(number2);

    // if s2 is longer than s1, swap them.
    if ((number2.substring(0, number2.lastIndexOf(".")).length) > (number1.substring(0, number1.lastIndexOf(".")).length)) {
      let temp = number2;
      number2 = number1;
      number1 = temp;
    }
    let nonDecimalStr1 = number1.substring(0, number1.lastIndexOf("."));
    let nonDecimalStr2 = number2.substring(0, number2.lastIndexOf("."));
    let decimalStr1 = number1.substring(number1.indexOf(".") + 1, number1.length);
    let decimalStr2 = number2.substring(number2.indexOf(".") + 1, number2.length);
    let finalNumber;
    let carry = 0;  // number that is carried to next decimal place, initially zero.
    let a;
    let b;
    let temp;
    let digitSum;
    let nonDecimalArr = [];
    for (let i = 0; i < nonDecimalStr1.length; i++) {
      a = parseInt(nonDecimalStr1.charAt(nonDecimalStr1.length - 1 - i));
      b = parseInt(nonDecimalStr2.charAt(nonDecimalStr2.length - 1 - i));
      b = (b) ? b : 0;
      temp = (carry + a + b).toString();
      digitSum = temp.charAt(temp.length - 1);
      if (i == nonDecimalStr1.length - 1) {
        nonDecimalArr.push(temp)
      } else {
        nonDecimalArr.push(digitSum)
        carry = parseInt(temp.charAt(temp.length - 2))
        carry = (carry) ? carry : 0;
      }
    }
    // 10/16/2019 -- Mayur Varshney -- apply condition to show two zero after decimal place
    // 12/04/2019 -- Mayur Varshney -- apply condition to handle Decimal addition error
    let defaultDecimal = "0.00"; 
    let finalDecimalNumber: any = (parseInt(decimalStr1) + parseInt(decimalStr2)).toString() == "0" ? defaultDecimal.split(".") : parseFloat((parseFloat("0." + decimalStr1) + parseFloat("0." + decimalStr2)).toString()).toFixed(2).split(".");
    // 08/07/2019 -- Mayur Varshney -- split the condition and assign the value in temporary variable
    let temporaryNumber = nonDecimalArr.reverse().toString();
    let NondecimalNumber = temporaryNumber.replace(/,/g, "");

    // 12/04/2019 -- Mayur Varshney -- apply condition on the basis of finalDecimalNumber array
    if (finalDecimalNumber[0] != 0) {
      // 12-10-2019 -- Mayur Varshney -- apply loop condition to add decimal carry with non-decimal number
      let secondNumber = finalDecimalNumber[0];
      let tempArr: any = [];
      for (let i = 1; i < NondecimalNumber.length + 1; i++) {
        let temp = NondecimalNumber.split("")[NondecimalNumber.length - i];
        let added = (parseInt(temp) + parseInt(secondNumber)).toString();
        if (added.length == 2) {
          secondNumber = added.split("")[0];
          tempArr.push(added.split("")[1]);
        } else {
          secondNumber = 0;
          tempArr.push(added.split("")[0]);
        }
      }
      NondecimalNumber = tempArr.reverse().toString().replace(/,/g, "");
      // 08/19/2019 -- Mayur Varshney -- fixes for showing two number after decimal
      finalNumber = NondecimalNumber.concat("." + finalDecimalNumber[1]);
    }
    else {
      // 12/04/2019 -- Mayur Varshney -- apply condition on the basis of finalDecimalNumber array
      finalNumber = NondecimalNumber.concat("." + finalDecimalNumber[1])
    }
    return finalNumber
  }

  validateNumber(number) {
    if (number.split(".")[1] == undefined) {
      number = number + ".00";
    }
    return number;
  }

  showLoaderTab: any = true;

  setShowLoaderTab(showLoaderTab) {
    this.showLoaderTab = showLoaderTab;
  }

  getShowLoaderTab() {
    return this.showLoaderTab;
  }

  // Preeti Varshney 06/14/2019 added common fuction
  getUniqueKey() {
    return parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000)));
  }

  readFileAsBlob(dbDirectory, contentType, fileName) {
    return new Promise((resolve, reject) => {
      let blob: any;
      this.getBase64(dbDirectory, fileName).then((res: any) => {
        if (res.indexOf("data:;base64,") == -1) {
          blob = this.b64toBlob(res.substring(res.indexOf("data:application/octet-stream;base64,") + 37, res.length), contentType, '');
        } else {
          blob = this.b64toBlob(res.substring(res.indexOf("data:;base64,") + 13, res.length), contentType, '');
        }
        resolve(blob);
      }).catch((err) => {
        this.logger.log(this.fileName, 'readFileAsBlob', "Error in promise : " + JSON.stringify(err));
        reject(err);
      });
    }).catch((err) => {
      this.logger.log(this.fileName, 'readFileAsBlob', "Error in promise : " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  readLogsFileAsBlob(element) {
    return new Promise((resolve, reject) => {
      this.getBase64(cordova.file.dataDirectory + "logs/", element.name).then((res: any) => {
        if (res.indexOf("data:;base64,") == -1) {
          element.blob = this.b64toBlob(res.substring(res.indexOf("data:application/octet-stream;base64,") + 37, res.length), "application/zip", '');
        } else {
          element.blob = this.b64toBlob(res.substring(res.indexOf("data:;base64,") + 13, res.length), "application/zip", '');
        }
        resolve(element);
      }).catch((err) => {
        this.logger.log(this.fileName, 'readLogsFileAsBlob', "Error in getBase64 : " + JSON.stringify(err));
        reject(err);
      });
    }).catch((err) => {
      this.logger.log(this.fileName, 'readLogsFileAsBlob', "Error in promise : " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  listFileFromFolder(dbDirectory, filename) {
    return new Promise((resolve, reject) => {
      this.file.listDir(dbDirectory, filename).then((res: any[]) => {
        resolve(res);
      }).catch((err) => {
        this.logger.log(this.fileName, 'listFileFromFolder', "Error in listDir : " + JSON.stringify(err));
        reject(err);
      })
    }).catch((err) => {
      this.logger.log(this.fileName, 'listFileFromFolder', "Error in promise : " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  sliceValueUptoLimit(textData, charLimit) {
    if (textData.length > charLimit) {
      textData = textData.slice(0, charLimit);
      let msg = "Character length should be less than " + charLimit;
      let alert = this.promptAlert('Alert', msg);
      alert.present();
    }
    return textData.trim();
  }

  bottomNavigation(navCtrl, value) {
    let index = navCtrl.parent.viewCtrl.instance.SDRTabRef.getSelected().index;
    if (value == 'back') {
      navCtrl.parent.select(index - 1);
    }
    else {
      navCtrl.parent.select(index + 1);
    }
  }
  checkUOMValidation(accordionKey, arrayObject) {
    let accordionData = new AccordionData();
    let hasValue = false;
    let data = accordionData['isoCalibration'].filter(item => {
      //console.log(item.indexOf("_UOM"));
      return item.indexOf("_UOM") == -1 && item.indexOf("_OT") == -1;
    })
    for (let key in data[accordionKey]) {
      let val: any = data[accordionKey][key];
      if (this.isNotNull(arrayObject[val]) && this.isNotNull(arrayObject[val + "_UOM"])) {
        hasValue = true;
        break;
      }
      else if (!this.isNotNull(arrayObject[val]) && !this.isNotNull(arrayObject[val + "_UOM"])) {
        hasValue = true;
        break;
      }
    }
    return hasValue;
  }

  bottomNavigationButtonName(navCtrl) {
    return new Promise((resolve, reject) => {
      let SDRTabRef = navCtrl.parent.viewCtrl.instance.SDRTabRef;
      if (SDRTabRef.length) {
        this.clearTimeOut();
        this.timeout = setTimeout(() => {
          resolve(SDRTabRef._tabs[SDRTabRef.getSelected().index + 1].tabTitle);
        }, 200);
      } else {
        resolve('');
      }
    }).catch((err) => {
      this.logger.log(this.fileName, 'bottomNavigationButtonName', "Error in promise : " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  userCredential() {
    let MCS_Details = atob(Enums.MCSConfig.encodedKey).split(":");
    return {
      username: MCS_Details[0],
      password: MCS_Details[1]
    }
  }

  clearTimeOut() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  public getCurrentTime() {
    return new Date();
  }
  /**
   * Preeti Varshney 08/08/2019
   * Format  time.
   */

  getFormatTime(value) {
    let date = new Date();
    date.setHours(value.split(":")[0]);
    date.setMinutes(value.split(":")[1]);
    return date;
  }


  getDateFormatTime(enterDate, value) {
    let date = new Date(moment(enterDate));
    date.setHours(value.split(":")[0]);
    date.setMinutes(value.split(":")[1]);
    return date;
  }

  /**
  * Preeti Varshney 08/08/2019
  * set time based on start time and end time.
  */
  getTimeDuration(value1, value2) {
    let duration = new Date();
    duration.setHours(value1);
    duration.setMinutes(value2);
    return duration;
  }

  getDateTimeDuration(date, value1, value2) {
    let duration = new Date(moment(date));
    duration.setHours(value1);
    duration.setMinutes(value2);
    return duration;
  }

  /**
   * Preeti Varshney 08/08/2019
   * set time based on start time and end time.
   */
  selectAllContent($event) {
    if ($event.target.classList.contains("bs-timepicker-field")) {
      $event.target.select();
    }
  }
  sortByDate(array) {
    array.sort((a, b) => {
      var dateA: any = new Date(a.date), dateB: any = new Date(b.date);
      return dateA - dateB; //sort by date ascending
    });
    return array;
  }

  async getFromStrorage(key) {
    return await this.storage.get(key);
  }



  displayErrors(ErrorObject) {
    let params = {
      "errMsg": ErrorObject,
      "checkTask": Enums.ErrorHandlingStatus.admin
    }
    let syncErrorModal = this.showModal("SyncErrorModalPage", params, { enableBackdropDismiss: false, cssClass: 'SyncErrorModalPage' });
    syncErrorModal.onDidDismiss((data) => {
      if (data == true) {
        this.logger.log("Error PopOver", 'syncInterrupt', "There is a sync interuption");
      }
    });
    if (ErrorObject) syncErrorModal.present();
  }

  /**
   * 09/27/2019 -- Mayur Varshney
   * check if username contain ',' separator in between Name
   * @param {any} username
   * @returns
   * @memberOf UtilityProvider
   */
  formattedCurrentUserName(username) {
    if (username.indexOf(',') > 0) {
      return username.split(',')[1] + ' ' + username.split(',')[0];
    } else {
      return username;
    }
  }

  /**
   * 
  * Rajat Gupta
  * @param
  * @returns Get the Index of Day Week
  * @memberOf UtilityProvider
   */

  getWeekDay(dayName) {
    let arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return arr.indexOf(dayName);
  }

  /**
  * Rajat Gupta
  * @param {any} startDate, DayStartFrom, GridViewType
  * @returns Date Format Should be YYYY-MM-DD
  * @memberOf UtilityProvider
  */
  dateGrid(startDate) {
    try {
      let dateGrid = [];
      let prefType = this.getWeekDay(this.valueProvider.getUserPreferences()[0].STARTDAYOFWEEK);
      if (startDate) {
        // var setDate = new Date(startDate);
        let formattedweekStart = moment(startDate).format("");
        let finalday = moment(formattedweekStart).startOf('week').add(1, 'day').isoWeekday(prefType).format("");
        for (let i = 0; i <= 6; i++) {
          dateGrid.push({
            'dayName': moment(finalday).add(i, 'day').format("dddd"),
            'dayDate': moment(finalday).add(i, 'day').format("DD-MMM"),
            'dayFullDate': moment(finalday).add(i,'day').format("DD-MM-YYYY")
          });
        }
        return dateGrid;
      }
    } catch (error) {
      this.logger.log("GetdateGridView", 'utility', "Generating Date Grid View For Site Allowances");
    }
  }
  /**
  * 
 * Preeti Varshney
 * @param
 * @returns Get the array of Allowances
 * @memberOf UtilityProvider
  */

  getAllowances() {
    let arr = [
      {
        name: 'Overtime',
        expanded: false
      },
      {
        name: 'Travel',
        expanded: false
      },
      {
        name: 'Site Allowance',
        expanded: false
      },
      {
        name: 'Meal',
        expanded: false
      }
    ];
    return arr;
  }


  /**
   * 01-09-2020 -- Mayur Varshney
   * check if the selected date is future date or not
   * @param {any} dayOrWeek 
   * @param {any} startDate 
   * @param {any} dateFormat 
   * @returns 
   * @memberOf UtilityProvider
   */
  checkforFutureDate(dayOrWeek, startDate, dateFormat) {
    let currentWeekEndORDay = dayOrWeek == "day" ? moment().format() : moment().endOf('week').format();
    return moment(moment(startDate, dateFormat).format()).isAfter(currentWeekEndORDay);
  }

}
