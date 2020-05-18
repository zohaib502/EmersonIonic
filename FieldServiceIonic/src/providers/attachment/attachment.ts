import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LocalServiceProvider } from '../local-service/local-service';
import { UtilityProvider } from '../utility/utility';
import { ValueProvider } from '../value/value';
import { LoggerProvider } from '../logger/logger';
//import { SortPipe } from '../../pipes/sort/sort';
import * as Enums from '../../enums/enums';
import * as moment from "moment";
import { LocalServiceSdrProvider } from '../local-service-sdr/local-service-sdr';
import { File } from "@ionic-native/file";
declare var cordova: any;

/**
 * Attachment Provider handles all the operations related to attachment Add, Update, Delete and Open.
 * This includes inserting, updation and deletion attachment into the Mobile App DB,
 * Handling attachment related error.
 * @export
 * @class AttachmentProvider
 * @author Mayur Varshney
 */
@Injectable()

export class AttachmentProvider {

  fileName: any = 'AttachmentProvider';
  filepath: any;
  uploadObj: any;
  fileSizeMsg: any;

  constructor(private platform: Platform, private file: File, public utilityProvider: UtilityProvider, public localService: LocalServiceProvider, public valueService: ValueProvider, public logger: LoggerProvider, public localServiceSdr: LocalServiceSdrProvider) {
    platform.ready().then(() => {
      this.filepath = this.file.dataDirectory;
    });

  }

  /**
   * add file into db and dir
   * create thumbnail if attachment type is image
   * handle file size if exceeds more than 10mb
   * @param {*} file
   * @param attachmentType
   * @param folderName
   * @param index
   * @param obj - attachmentFor, DNIDForenKey - optional param to be sent in detailed notes case
   */
  addAttachment(lookupID, file, attachmentType, path, obj?, reportId?) {
    return new Promise((resolve, reject) => {
      // file size should be less than 10MB
      let checkFileSize = this.utilityProvider.checkFileSize(file);
      if (checkFileSize.result) {
        let attachmentTypeAndName = this.utilityProvider.generateFileNameAndType(file.name);
        if (attachmentTypeAndName.Name.length > this.getFileNameLimit(attachmentType)) {
          this.utilityProvider.presentToastButtom(attachmentType == Enums.AttachmentType.SDR ? Enums.Messages.Attachment_Name_Too_Long_SDR : Enums.Messages.Attachment_Name_Too_Long, '4000', 'top', '', 'OK');
        }
        else if (this.utilityProvider.checkSpecialCharactersForFileName(attachmentTypeAndName.Name)) {
          this.utilityProvider.presentToastButtom(Enums.Messages.Attachment_Contain_Special_Char, "4000", "top", "", "OK");
        }
        else {
          switch (attachmentType) {
            case Enums.AttachmentType.FCR:
              this.addAttachmentForFCR(file, attachmentType, attachmentTypeAndName, path).then((res: any) => {
                resolve(res);
              });
              break;
            // 02-07-2019 -- Mansi Arora -- handle for detailed notes attachment
            case Enums.AttachmentType.DetailedNotes:
              this.addAttachmentForFCR(file, attachmentType, attachmentTypeAndName, path, obj).then((res: any) => {
                resolve(res);
              });
              break;
            case Enums.AttachmentType.SDR:
              this.addAttachmentForSDR(file, attachmentType, attachmentTypeAndName, path, lookupID, reportId).then((res: any) => {
                resolve(res);
              });
              break;
          }
        }
      } else {
        this.utilityProvider.presentToastButtom(checkFileSize.msg, '4000', 'top', '', 'OK');
        reject(checkFileSize.msg);
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'addAttachment', 'Error in addAttachment : ' + JSON.stringify(err));
    });
  }

  getFileNameLimit(attachmentType) {
    let fileNameLimit;
    if (attachmentType == Enums.AttachmentType.SDR) {
      fileNameLimit = Enums.AttachmentNameLimit.SDR;
    } else {
      fileNameLimit = Enums.AttachmentNameLimit.FCR;
    }
    return fileNameLimit;
  }

  addAttachmentForSDR(file, attachmentType, attachmentTypeAndName, path, lookupID, reportId) {
    return new Promise((resolve, reject) => {
      try {
        let fileObject: any = { "width": file.width, "height": file.height, "filename": file.name, "fileDisc": attachmentTypeAndName.Name, "filetype": attachmentTypeAndName.Type, "data": "", contentType: "", base64: "", Attachment_Id: null };
        fileObject.REPORTID = reportId;
        // fileObject.Created_Date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
        // fileObject.Created_By = this.valueService.getUserId();
        fileObject.ATTACHMENTDESCRIPTION = attachmentTypeAndName.Name
        this.saveAttachmentToFolder(file, fileObject, attachmentType, path).then((resp) => {
          let result;
          result = this.createSDRAttachmentJSONObject(fileObject, path, lookupID);
          this.insertSDRAttachment(result.newObject, 'insertSDRAttachment').then((res: any) => {
            resolve(result);
          }).catch((err) => {
            this.logger.log(this.fileName, 'addAttachmentForFCR', 'Error in insertAttachment : ' + JSON.stringify(err));
            reject(err);
          });
        });
      } catch (err) {
        this.logger.log(this.fileName, 'addAttachmentForSDR', 'Error in try catch : ' + JSON.stringify(err));
        reject(err);
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'addAttachmentForSDR', 'Error in promise : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
   * add file into db and dir if attachment type is FCR
   * create thumbnail if attachment type is image
   * @param file
   * @param attachmentType
   * @param attachmentTypeAndName
   * @param path
   * @param attachmentFor - optional param to be sent in detailed notes
   * @param DNIDForenKey - optional param to be sent in detailed notes case
   */
  addAttachmentForFCR(file, attachmentType, attachmentTypeAndName, path, obj?) {
    return new Promise((resolve, reject) => {
      try {
        let fileObject: any = { "filename": file.name, "fileDisc": attachmentTypeAndName.Name, "filetype": attachmentTypeAndName.Type, "data": "", contentType: "", base64: "", Attachment_Id: null };
        this.saveAttachmentToFolder(file, fileObject, attachmentType, path).then((resp) => {
          let result;
          // 02-07-2019 -- Mansi Arora -- handling for detailed notes attachment, extra params for createDetailedNotesAttachmentJSONObject and insertAttachment
          if (attachmentType == Enums.AttachmentType.DetailedNotes) {
            result = this.createDetailedNotesAttachmentJSONObject(resp, obj, path);
            this.insertAttachment(result.newObject, 'insertDetailedNoteAttachment').then((res: any) => {
              resolve(result);
            }).catch((err) => {
              this.logger.log(this.fileName, 'addAttachmentForFCR', 'Error in insertAttachment : ' + JSON.stringify(err));
              reject(err);
            });
          } else {
            result = this.createAttachmentJSONObject(resp, path);
            this.insertAttachment(result.newObject, 'insertAttachment').then((res: any) => {
              resolve(result);
            }).catch((err) => {
              this.logger.log(this.fileName, 'addAttachmentForFCR', 'Error in insertAttachment : ' + JSON.stringify(err));
              reject(err);
            });
          }
        }).catch((err) => {
          this.logger.log(this.fileName, 'addAttachmentForFCR', 'Error in saveAttachmentToFolder : ' + JSON.stringify(err));
          reject(err);
        });
      } catch (err) {
        this.logger.log(this.fileName, 'addAttachmentForFCR', 'Error in try catch : ' + JSON.stringify(err));
        reject(err);
      }
    }).catch((err) => {
      this.logger.log(this.fileName, 'addAttachmentForFCR', 'Error in promise : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
   * add file into db and dir if attachment type is SDR
   * create thumbnail if attachment type is image
   * @param file
   * @param attachmentType
   * @param attachmentTypeAndName
   * @param path
   */
  // addAttachmentForSDR(element, file, attachmentType, attachmentTypeAndName, path) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       let fileObject: any = { "width": file.width, "height": file.height, "filename": file.name, "fileDisc": attachmentTypeAndName.Name, "filetype": attachmentTypeAndName.Type, "data": "", contentType: "", base64: "", Attachment_Id: null };
  //       fileObject.ReportID_Mobile = this.valueService.getCurrentReport().ReportID_Mobile;
  //       fileObject.ElementID = element.ElementID;
  //       fileObject.Value = file.name;
  //       fileObject.Created_Date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
  //       this.saveAttachmentToFolder(file, fileObject, attachmentType, path, element).then((resp) => {
  //         resolve(resp);
  //       });
  //     } catch (err) {
  //       this.logger.log(this.fileName, 'addAttachmentForSDR', 'Error in try catch : ' + JSON.stringify(err));
  //       reject(err);
  //     }
  //   }).catch((err: any) => {
  //     this.logger.log(this.fileName, 'addAttachmentForSDR', 'Error in promise : ' + JSON.stringify(err));
  //     return Promise.reject(err);
  //   });
  // }


  /**
   *@author:Prateek 24/01/2019
   *Save aatachment in report files folder according to folder name  form dbcs.
   */
  saveAttachmentToFolderSdrDBCS(fileObject, attachmentType, path, element?) {
    return new Promise((resolve, reject) => {
      let imageobject: any = {
        filename: fileObject[0].FILENAME
      }
      imageobject.contentType = fileObject[0].ATTACHMENTDATA.split(";")[0].split(":")[1];
      imageobject.base64 = fileObject[0].ATTACHMENTDATA.split(",")[1];

      if (attachmentType == Enums.AttachmentType.SDR) {
        this.saveAttachment(path, imageobject, attachmentType, element).then((saveAttachmentRes: any) => {
          resolve(saveAttachmentRes);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'saveAttachmentToFolder', 'Error in saveAttachment : ' + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.saveAttachment(path, imageobject, attachmentType).then((saveAttachmentRes: any) => {
          resolve(saveAttachmentRes);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'saveAttachmentToFolder', 'Error in saveAttachment : ' + JSON.stringify(err));
          reject(err);
        });
      }
    }).catch((err) => {
      this.logger.log(this.fileName, 'saveAttachmentToFolder', 'Error in saveAttachmentToFolder : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }



  /**
 *@author:Prateek 24/01/2019
 *Save aatachment in DetailednotesFolder folder according to folder name  form dbcs.
 */
  async saveAttachmentDetailedNotes(fileObject, attachmentType, path) {
    let result = fileObject;
    try {
      fileObject.attachment_status = "false";
      let imageobject: any = {
        filename: fileObject.file_name
      }
      imageobject.contentType = fileObject.attachmentdata.split(";")[0].split(":")[1];
      imageobject.base64 = fileObject.attachmentdata.split(",")[1];

      await this.saveAttachment(path, imageobject, attachmentType);
      fileObject.attachment_status = "true";
    } catch(error) {
      this.logger.log(this.fileName, 'saveAttachmentToFolder', 'Error in saveAttachment : ' + error.message);
      throw error;
    }
    return result;
  }
  /**
   * save file into dir
   * create thumbnail if attachment type is image
   * @param file
   * @param fileObject
   * @param attachmentType
   */
  saveAttachmentToFolder(file, fileObject, attachmentType, path, element?) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        fileObject.data = reader.result;
        fileObject.contentType = fileObject.data.split(";")[0].split(":")[1];
        fileObject.base64 = fileObject.data.split(",")[1];
        this.utilityProvider.getFile(path, fileObject.filename).then((fileExist: any) => {
          if (!fileExist) {
            if (attachmentType == Enums.AttachmentType.SDR) {
              this.saveAttachment(path, fileObject, attachmentType, element).then((saveAttachmentRes: any) => {
                resolve(saveAttachmentRes);
              }).catch((err: any) => {
                this.logger.log(this.fileName, 'saveAttachmentToFolder', 'Error in saveAttachment : ' + JSON.stringify(err));
              });
            } else {
              this.saveAttachment(path, fileObject, attachmentType).then((saveAttachmentRes: any) => {
                resolve(saveAttachmentRes);
              }).catch((err: any) => {
                this.logger.log(this.fileName, 'saveAttachmentToFolder', 'Error in saveAttachment : ' + JSON.stringify(err));
              });
            }
          } else {
            this.utilityProvider.presentToastButtom('File already exist, please change file name or type', '4000', 'top', '', 'OK');
            reject("File_Exist_Err");
          }
        });
      };
      reader.readAsDataURL(file);
    }).catch((err) => {
      this.logger.log(this.fileName, 'saveAttachmentToFolder', 'Error in saveAttachmentToFolder : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
   * save file into dir
   * @param path
   * @param fileObject
   */
  saveAttachment(path, fileObject, attachmentType, element?) {
    return new Promise((resolve, reject) => {
      this.utilityProvider.saveBase64Attachment(path, fileObject.filename, fileObject.base64, fileObject.contentType).then((attachmentResponse: any) => {
        fileObject.data = '';
        fileObject.base64 = '';
        if (attachmentResponse && attachmentResponse.name && this.platform.is('ios')) {
          fileObject.filename = attachmentResponse.name;
          fileObject.Value = attachmentResponse.name;
          //fileObject.fileDisc = attachmentResponse.name.split('.').slice(0, -1).join('.');
        }
        if (fileObject.contentType.indexOf('image') > -1) {
          // 02/28/2019 -- Mayur Varshney -- optimise code
          if (this.platform.is('ios')) {
            this.generateThumbnailForIOS(fileObject, attachmentType, path).then((res: any) => {
              resolve(res);
            }).catch((err: any) => {
              this.logger.log(this.fileName, 'saveAttachment', 'Error in saveBase64Attachment : ' + JSON.stringify(err));
              reject(err);
            });
          } else {
            this.generateThumbnail(path, fileObject, attachmentType).then((res: any) => {
              resolve(res);
            }).catch((err: any) => {
              this.logger.log(this.fileName, 'saveAttachment', 'Error in saveBase64Attachment : ' + JSON.stringify(err));
              reject(err);
            });
          }
        } else {
          resolve(fileObject);
        }
      }).catch((err: any) => {
        if (err.code == 12 && err.msg == 'PATH_EXISTS_ERR') {
          this.utilityProvider.presentToastButtom('File already exist, please change file name or type', '4000', 'top', '', 'OK');
        } else {
          this.utilityProvider.presentToastButtom('File already exist, please change file name or type', '4000', 'top', '', 'OK');
          this.logger.log(this.fileName, 'saveAttachment', 'Error in saveBase64Attachment : ' + JSON.stringify(err));
        }
        reject(err);
      });
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'saveAttachment', 'Error in saveBase64Attachment : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
   * generate thumbnail for IOS
   * @param fileObject
   */
  generateThumbnailForIOS(fileObject, attachmentType, folderPath) {
    return new Promise((resolve, reject) => {
      // 02/28/2019 -- Mayur Varshney -- concat unique word in name for generating thumbnails with unique name to avoid copying of same image
      let uniqueWord = this.utilityProvider.getUniqueWordForAttachment(folderPath, attachmentType);
      // 02/05/2019 -- Mayur Varshney -- set correct path for creating thumbnail in ios for fcr
      let path = folderPath + "/" + fileObject.filename;
      let finalPath = folderPath + "/thumbnails";
      // 03/19/2019 -- Mayur Varshney -- get image quality, height and width w.r.t attachmentType
      let sizeAndQuality = this.imageSizeAndQuality(attachmentType);
      // 06-04-2019 -- Mayur Varshney -- apply check of height, width and attachmentType
      if (attachmentType == Enums.AttachmentType.SDR && fileObject.height && fileObject.width) {
        sizeAndQuality.height = (fileObject.height / fileObject.width) * sizeAndQuality.width;
      }
      let thumbnailName: any;
      let NewthumbnailName: any;
      if (attachmentType == Enums.AttachmentType.SDR) {
        thumbnailName = uniqueWord + fileObject.filename;
        NewthumbnailName = fileObject.filename;
      } else {
        thumbnailName = "thumb_" + uniqueWord + fileObject.filename;
        NewthumbnailName = "thumb_" + fileObject.filename;
      }
      this.utilityProvider.generateThumbnail(path, sizeAndQuality.quality, sizeAndQuality.width, sizeAndQuality.height, thumbnailName).then((url: any) => {
        let subUrlIndex = url.lastIndexOf('/');
        let finalUrl = url.substring(0, subUrlIndex);
        let imageName = url.substring(subUrlIndex + 1, url.length);
        this.utilityProvider.moveFile(finalUrl, imageName, finalPath, NewthumbnailName).then(res => {
          fileObject.isThumbnailCreated = res;
          resolve(fileObject);
        }).catch((e: any) => {
          this.logger.log(this.fileName, 'generateThumbnailForIOS', 'Error in moveFile : ' + JSON.stringify(e));
          reject(e);
        });
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'generateThumbnailForIOS', 'Error in generateThumbnail : ' + JSON.stringify(err));
        reject(err);
      });
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'generateThumbnailForIOS', 'Error in promise : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
   * generate thumbnail for android and windows
   * @param path
   * @param fileObject
   */
  generateThumbnail(path, fileObject, attachmentType) {
    return new Promise((resolve, reject) => {
      // 02/28/2019 -- Mayur Varshney -- concat unique word in name for generating thumbnails with unique name to avoid copying of same image
      let uniqueWord = this.utilityProvider.getUniqueWordForAttachment(path, attachmentType);
      let thumbnailName: any;
      let NewthumbnailName: any;
      if (attachmentType == Enums.AttachmentType.SDR) {
        thumbnailName = uniqueWord + fileObject.filename;
        NewthumbnailName = fileObject.filename;
      } else {
        thumbnailName = "thumb_" + uniqueWord + fileObject.filename;
        NewthumbnailName = "thumb_" + fileObject.filename;
      }
      // 03/19/2019 -- Mayur Varshney -- get image quality, height and width w.r.t attachmentType
      let sizeAndQuality = this.imageSizeAndQuality(attachmentType);
      this.utilityProvider.generateThumbnail(path + "/" + fileObject.filename, sizeAndQuality.quality, sizeAndQuality.width, sizeAndQuality.height, thumbnailName).then((uri: any) => {
        this.utilityProvider.moveFile(this.filepath, thumbnailName, path + "/thumbnails", NewthumbnailName).then(res => {
          fileObject.isThumbnailCreated = res;
          resolve(fileObject);
        }).catch((e: any) => {
          this.logger.log(this.fileName, 'generateThumbnail', 'Error in moveFile : ' + JSON.stringify(e));
          reject(e);
        });
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'generateThumbnail', 'Error in generateThumbnail : ' + JSON.stringify(err));
        reject(err);
      });
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'generateThumbnail', 'Error in promise : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
   * return quality, height and width of image .w.r.t attachmentType
   * @param attachmentType
   */
  imageSizeAndQuality(attachmentType) {
    let height: any;
    let width: any;
    let quality: any;
    switch (attachmentType) {
      case Enums.AttachmentType.FCR:
        height = Enums.AttachmentHeight.FCRAttachmentHeight;
        width = Enums.AttachmentWidth.FCRAttachmentWidth;
        quality = Enums.AttachmentQuality.FCRAttachmentQuality;
        break;
      case Enums.AttachmentType.SDR:
        height = Enums.AttachmentHeight.SDRAttachmentHeight;
        width = Enums.AttachmentWidth.SDRAttachmentWidth;
        quality = Enums.AttachmentQuality.SDRAttachmentQuality;
        break;
      case Enums.AttachmentType.DetailedNotes:
        height = Enums.AttachmentHeight.DetailedNotesAttachmentHeight;
        width = Enums.AttachmentWidth.DetailedNotesAttachmentWidth;
        quality = Enums.AttachmentQuality.DetailedNotesAttachmentQuality;
        break;
    }
    return {
      'height': height, 'width': width, 'quality': quality
    }
  }

  /**
   * create JSON object
   * @param fileObject
   * @param attachmentType
   */
  createAttachmentJSONObject(fileObject, path) {
    let attachmentId = parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000)));
    fileObject.Attachment_Id = attachmentId;
    let newObject: any;
    newObject = {
      Attachment_Id: fileObject.Attachment_Id,
      File_Name: fileObject.filename,
      File_Type: fileObject.contentType ? fileObject.contentType : 'application/octet-stream',
      File_Path: path,
      Type: "D",
      AttachmentType: "D",
      Created_Date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
      Task_Number: String(this.valueService.getTaskId()),
      SRID: "",
      ResourceId: this.valueService.getResourceId()
    };
    return {
      'newObject': newObject,
      'fileObject': fileObject
    }
  }

  /**
   * @author: Mansi Arora 02-07-2019
   * create JSON object
   * @param fileObject
   * @param obj - attachmentFor, DNIDForenKey
   */
  createDetailedNotesAttachmentJSONObject(fileObject, obj, path) {
    let created_date = new Date();
    fileObject.Attachment_Type = obj.attachmentFor;
    let newObject = {
      DNID: obj.DNIDForenkey,
      Attachment_Id: parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000))),
      File_Name: fileObject.filename,
      File_Type: fileObject.contentType ? fileObject.contentType : 'application/octet-stream',
      File_Path: path,
      Attachment_Type: obj.attachmentFor,
      Sync_Status: false,
      Date: moment(created_date).format('YYYY-MM-DD hh:mm:ss'),
      Created_By: this.valueService.getUser().ID,
      Created_Date: moment(created_date).format('YYYY-MM-DD hh:mm:ss'),
      Modified_By: this.valueService.getUser().ID,
      Modified_Date: moment(created_date).format('YYYY-MM-DD hh:mm:ss'),
      Task_Number: String(this.valueService.getTaskId())
    }
    fileObject.Attachment_Id = newObject.Attachment_Id;
    return {
      'newObject': newObject,
      'fileObject': fileObject
    }
  }

  createSDRAttachmentJSONObject(fileObject, path, lookupID) {
    let created_date = new Date();
    let newObject = {
      RA_PK_ID: parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000))),
      ReportID: fileObject.REPORTID,
      FILENAME: fileObject.filename,
      FILETYPE: fileObject.contentType ? fileObject.contentType : 'application/octet-stream',
      File_Path: path,
      ATTACHMENTTYPE: lookupID,
      Sync_Status: 'N',
      Date: moment(created_date).format('YYYY-MM-DD hh:mm:ss'),
      Created_By: this.valueService.getUser().ID,
      Created_Date: moment(created_date).format('YYYY-MM-DD hh:mm:ss'),
      Modified_By: this.valueService.getUser().ID,
      Modified_Date: moment(created_date).format('YYYY-MM-DD hh:mm:ss'),
      ATTACHMENTDESCRIPTION: fileObject.ATTACHMENTDESCRIPTION,
      SHOWINPDF: fileObject.contentType.indexOf('image') > -1 ? 'true' : 'false'
    }
    fileObject.RA_PK_ID = newObject.RA_PK_ID;
    fileObject.SHOWINPDF = fileObject.contentType.indexOf('image') > -1 ? 'true' : 'false';
    fileObject.ATTACHMENTTYPE = lookupID;
    fileObject.FILETYPE = fileObject.contentType ? fileObject.contentType : 'application/octet-stream';
    fileObject.FILENAME = fileObject.filename

    return {
      'newObject': newObject,
      'fileObject': fileObject
    }
  }

  /**
   * insert attachment entry in db
   * @param attachmentObject
   * @param attachmentType
   * @param funcName - function to be called for inserting in database
   */
  insertAttachment(attachmentObject, funcName) {
    return new Promise((resolve, reject) => {
      // 02-07-2019 -- Mansi Arora -- call dynamic function from local service
      this.localService[funcName](attachmentObject).then((res): any => {
        resolve(res);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'insertAttachment', 'Error in insertAttachment, insertAttachment local service : ' + JSON.stringify(error));
        reject(error);
      });

    })
  }

  /**
   * insert attachment entry in db
   * @param attachmentObject
   * @param attachmentType
   * @param funcName - function to be called for inserting in database
   */
  insertSDRAttachment(attachmentObject, funcName) {
    return new Promise((resolve, reject) => {
      this.localServiceSdr[funcName](attachmentObject).then((res): any => {
        resolve(res);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'insertSDRAttachment', 'Error in insertSDRAttachment, insertAttachment local service : ' + JSON.stringify(error));
        reject(error);
      });

    })
  }

  /**
   * rename attachment on the basis of attachment type
   * @param object
   */
  renameAttachment(object) {
    return new Promise((resolve, reject) => {
      let attachmentDiscNameAndType;
      let filename;
      if (object.attachmentType == Enums.AttachmentType.SDR) {
        attachmentDiscNameAndType = this.utilityProvider.generateFileDiscNameAndTypeSDR(object.file.Value);
        filename = attachmentDiscNameAndType.Name.replace(" ", "");
      } else {
        attachmentDiscNameAndType = this.utilityProvider.generateFileDiscNameAndType(object.file);
        filename = object.file.fileDisc.replace(" ", "");
      }
      if ((attachmentDiscNameAndType.Type == 'octet-stream' && filename.trim() == '.') || (filename.trim() == "" || filename == undefined)) {
        (object.attachmentType == Enums.AttachmentType.SDR) ? (object.file.Value = object.renamedAttachment) : (object.file.fileDisc = object.renamedAttachment);
      } else if (this.utilityProvider.checkSpecialCharactersForFileName(filename)) {
        (object.attachmentType == Enums.AttachmentType.SDR) ? (object.file.Value = object.renamedAttachment) : (object.file.fileDisc = object.renamedAttachment);
        this.utilityProvider.presentToastButtom('Filename cannot contain special characters  \, /, *, :, ?, ", <, >, |, %, #, {, }, [, ]', "4000", "top", "", "OK");
      } else {
        let updatedName = attachmentDiscNameAndType.Name + "." + attachmentDiscNameAndType.Type;
        this.getAttachmentData(object, updatedName, ((object.attachmentType == Enums.AttachmentType.SDR) ? object.currentFlowName : '')).then((attachmentPathInfo: any) => {
          this.utilityProvider.getFile(attachmentPathInfo.fileAttachmentPath, attachmentPathInfo.updatedName).then((fileExist: any) => {
            if (!fileExist) {
              this.moveAttachment(attachmentPathInfo).then((resp: any) => {
                if (resp) {
                  let result = {
                    object: object,
                    updatedName: updatedName,
                    attachmentPathInfo: attachmentPathInfo
                  }
                  resolve(result);
                } else {
                  reject('error in renameAttachment');
                }
              }).catch((err: any) => {
                this.logger.log(this.fileName, 'renameAttachment', 'Error in renameFileByAttachmentType : ' + JSON.stringify(err));
                reject(err);
              });
            } else {
              this.utilityProvider.presentToastButtom('File already exist, please change file name or type', '4000', 'top', '', 'OK');
              (object.attachmentType == Enums.AttachmentType.SDR) ? (object.file.Value = object.renamedAttachment) : (object.file.fileDisc = object.renamedAttachment);
              reject("File_Exist_Err");
            }
          });
        });
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'renameAttachment', 'Error in promise : ' + JSON.stringify(err));
      return Promise.reject(err)
    });
  }

  /**
   * get file and image path after renaming the file
   * @param object
   * @param updatedName
   * @param currentFlowName - conditional
   * @returns attachmentJsonObject
   */
  getAttachmentData(object, updatedName, currentFlowName?) {
    return new Promise((resolve, reject) => {
      let fileAttachmentPath: any;
      let imageAttachmentPath: any;
      let previousFileName: any;
      let imageType;
      switch (object.attachmentType) {
        case Enums.AttachmentType.FCR:
          fileAttachmentPath = this.filepath + object.folderName + "/" + this.valueService.getTaskId();
          imageAttachmentPath = this.filepath + object.folderName + "/" + this.valueService.getTaskId() + "/thumbnails";
          previousFileName = object.file.filename;
          imageType = (object.file.contentType.indexOf('image') > -1) ? true : false;
          break;
        // 02-07-2019 -- Mansi Arora -- handling for detailed notes attachment
        case Enums.AttachmentType.DetailedNotes:
          fileAttachmentPath = this.filepath + object.folderName;
          imageAttachmentPath = this.filepath + object.folderName + "/thumbnails";
          previousFileName = object.file.filename;
          imageType = (object.file.contentType.indexOf('image') > -1) ? true : false;
          break;
        case Enums.AttachmentType.SDR:
          fileAttachmentPath = this.filepath + object.folderName + "/" + this.valueService.getCurrentReport().ReportID_Mobile.toString() + "/" + currentFlowName;
          imageAttachmentPath = this.filepath + object.folderName + "/" + this.valueService.getCurrentReport().ReportID_Mobile.toString() + "/" + currentFlowName + "/thumbnails";
          previousFileName = object.renamedAttachment;
          imageType = (object.file.File_Type.indexOf('image') > -1) ? true : false;
          break;
      }
      let attachmentPathData = {
        'fileAttachmentPath': fileAttachmentPath,
        'imageAttachmentPath': imageAttachmentPath,
        'previousFileName': previousFileName,
        'updatedName': updatedName,
        'imageType': imageType
      }
      resolve(attachmentPathData);
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'getAttachmentData', 'Error in promise : ' + JSON.stringify(err));
      return Promise.reject(err)
    });
  }

  /**
   * move attachment from one file to another file
   * @param attachmentPathJson
   */
  moveAttachment(attachmentPathJson) {
    return new Promise((resolve, reject) => {
      this.utilityProvider.moveFile(attachmentPathJson.fileAttachmentPath, attachmentPathJson.previousFileName, attachmentPathJson.fileAttachmentPath, attachmentPathJson.updatedName).then(res => {
        if (attachmentPathJson.imageType) {
          this.utilityProvider.moveFile(attachmentPathJson.imageAttachmentPath, "thumb_" + attachmentPathJson.previousFileName, attachmentPathJson.imageAttachmentPath, "thumb_" + attachmentPathJson.updatedName).then(res => {
            resolve(true);
          }).catch((err: any) => {
            this.logger.log(this.fileName, 'renameFCRAttachment', 'Error in moveFile : ' + JSON.stringify(err));
          });
        } else {
          resolve(true);
        }
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'renameFCRAttachment', 'Error in moveFile : ' + JSON.stringify(err));
        reject(err);
      });
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'renameFileByAttachmentType', 'Error in promise : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
   * update attachment name in db on the basis of Attachment_Id
   * @param fileData
   * @param updatedName
   * @param tempFileName
   * @param attachmentType - optional param to call dynamic function from local service
   */
  updateAttachment(fileData, tempFileName, attachmentType?) {
    let funcName = 'updateAttachmentName';
    if (attachmentType == Enums.AttachmentType.DetailedNotes) {
      funcName = 'updateDetailedNotesAttachmentName';
    }
    return new Promise((resolve, reject) => {
      let attachmentObj: any = {};
      attachmentObj.File_Name = fileData.updatedName;
      let attachmentFileNameAndType = this.utilityProvider.generateFileNameAndType(attachmentObj.File_Name);
      if (attachmentFileNameAndType.Name != tempFileName) {
        // 02-07-2019 -- Mansi Arora -- call dynamic function from local service
        this.localService[funcName](fileData.updatedName, fileData.object.file.Attachment_Id);
        resolve(true);
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'updateAttachment', 'Error in updateAttachment, checkIfAttachmentExits : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
   * delete attachment as per Attachment_Id
   * @param filedata
   * @param attachmentDiscNameAndType
   * @param folderName
   * @param attachmentType
   */
  deleteAttachment(filedata, folderName, attachmentType, attachmentDiscNameAndType, reportId?) {
    return new Promise((resolve, reject) => {
      let path;
      switch (attachmentType) {
        case Enums.AttachmentType.FCR:
          let deletedname = attachmentDiscNameAndType.Name + "." + attachmentDiscNameAndType.Type;
          path = this.filepath + "/" + folderName + "/" + this.valueService.getTaskId();
          this.utilityProvider.deleteFile(path, deletedname);
          if (filedata.contentType.indexOf('image') > -1) {
            this.utilityProvider.deleteFile(path + "/thumbnails", "thumb_" + deletedname);
          }
          resolve(true);
          break;
        // 02-07-2019 -- Mansi Arora -- handling for detailed notes attachment
        case Enums.AttachmentType.DetailedNotes:
          deletedname = attachmentDiscNameAndType.Name + "." + attachmentDiscNameAndType.Type;
          path = this.filepath + "/" + folderName;
          this.utilityProvider.deleteFile(path, deletedname);
          if (filedata.contentType.indexOf('image') > -1) {
            this.utilityProvider.deleteFile(path + "/thumbnails", "thumb_" + deletedname);
          }
          resolve(true);
          break;
        case Enums.AttachmentType.SDR:
          deletedname = attachmentDiscNameAndType.Name + "." + attachmentDiscNameAndType.Type;
          path = this.filepath + folderName + "/" + reportId + "/Photos";
          this.utilityProvider.deleteFile(path, deletedname);
          if (filedata.FILETYPE.indexOf('image') > -1) {
            this.utilityProvider.deleteFile(path + "/thumbnails", deletedname);
          }
          resolve(true);
          break;
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'deleteAttachmentObject', 'Error in deleteAttachmentObject : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
   * open file on click
   * @param file
   * @param folderName
   * @param attachmentType
   */
  openResource(file, folderName, attachmentType, reportId?) {
    return new Promise((resolve, reject) => {
      let attachmentDiscNameAndType: any;
      if (attachmentType == Enums.AttachmentType.SDR) {
        attachmentDiscNameAndType = this.utilityProvider.generateFileDiscNameAndTypeSDR(file.FILENAME);
      } else {
        attachmentDiscNameAndType = this.utilityProvider.generateFileDiscNameAndType(file);
      }
      let filepath = this.platform.is('cordova') ? cordova.file.dataDirectory : "";
      let updatedname = attachmentDiscNameAndType.Name + "." + attachmentDiscNameAndType.Type;
      switch (attachmentType) {
        case Enums.AttachmentType.FCR:
          this.utilityProvider.openFile(filepath + "/" + folderName + "/" + this.valueService.getTaskId() + "/" + updatedname, file.contentType, null);
          break;
        // 02-07-2019 -- Mansi Arora -- handling for detailed notes attachment
        case Enums.AttachmentType.DetailedNotes:
          this.utilityProvider.openFile(filepath + folderName + updatedname, file.contentType, null);
          break;
        case Enums.AttachmentType.SDR:
          this.utilityProvider.openFile(filepath + folderName + "/" + String(reportId) + "/Photos/" + updatedname, file.FILETYPE, null);
          break;
      }
      resolve(true);
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'openResource', 'Error in openResource : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  createThumbnailIfNotExist(path, file) {
    return new Promise((resolve, reject) => {
      this.utilityProvider.getFile(path, file.FILENAME).then((fileExist: any) => {
        if (!fileExist && file.FILETYPE.indexOf('image') > -1) {
          file.filename = file.FILENAME;
          if (this.platform.is('ios')) {
            this.generateThumbnailForIOS(file, Enums.AttachmentType.SDR, path).then((res: any) => {
              resolve({ isThumbnailCreated: true, attachmentId: file.RA_PK_ID });
            }).catch((err: any) => {
              this.logger.log(this.fileName, 'createThumbnailIfNotExist', 'Error in generateThumbnailForIOS : ' + JSON.stringify(err));
              resolve({ isThumbnailCreated: false, attachmentId: file.RA_PK_ID });
            });
          } else {
            this.generateThumbnail(path, file, Enums.AttachmentType.SDR).then((res: any) => {
              resolve({ isThumbnailCreated: true, attachmentId: file.RA_PK_ID });
            }).catch((err: any) => {
              this.logger.log(this.fileName, 'createThumbnailIfNotExist', 'Error in generateThumbnail : ' + JSON.stringify(err));
              resolve({ isThumbnailCreated: false, attachmentId: file.RA_PK_ID });
            });
          }
        }
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'createThumbnailIfNotExist', 'Error in getFile : ' + JSON.stringify(err));
        resolve({ isThumbnailCreated: false, attachmentId: file.RA_PK_ID });
      });
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'createThumbnailIfNotExist', 'Error in promise : ' + JSON.stringify(err));
      return Promise.resolve({ isThumbnailCreated: false, attachmentId: file.RA_PK_ID });
    });
  }

}
