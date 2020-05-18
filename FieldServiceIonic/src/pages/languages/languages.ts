import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { ValueProvider } from '../../providers/value/value';
import { SyncProvider } from '../../providers/sync/sync';
import { AlertController } from 'ionic-angular';
import { LoggerProvider } from '../../providers/logger/logger';
import { UtilityProvider } from '../../providers/utility/utility';
import { FetchProvider } from '../../providers/sync/fetch/fetch';
import { SubmitProvider } from '../../providers/sync/submit/submit';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-languages',
  templateUrl: 'languages.html',
})
export class LanguagesPage {
  @ViewChild('langupload')
  uploadObj: any;
  header_data: any;
  LangList: any = [];
  LabelField: any = [];
  myInput;
  fileName: any = 'LanguagesPage';
  pageNumber: number = 1;
  activeLanguage: any = {};
  showSelects: boolean = true;
  cancel: any = false;
  changedValue: any;
  permissions: any;
  timeOut: any;
  pendingSubmit: any[] = [];
  constructor(public events: Events, public utilityProvider: UtilityProvider, public valueProvider: ValueProvider, public syncProvider: SyncProvider, public navCtrl: NavController, public navParams: NavParams, public localService: LocalServiceProvider, public alertCtrl: AlertController, public logger: LoggerProvider, public fetchProvider: FetchProvider, public submitProvider: SubmitProvider) {
    this.header_data = { title1: "", title2: "Field Service Admin", taskId: "" };
    this.permissions = this.valueProvider.getPermissions();

  }

  ionViewDidLoad() {
    this.getLanguageList();
  }

  ionViewDidEnter() {
    this.events.subscribe('langSelected', (res) => {
      this.timeOut = setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
    this.setPage("Language");
  }

  private setPage(page) {
    this.events.publish('setPage', page);
  }

  /**
 * @memberof Language
 * @default: 
 * @description: 
 * 09-18-2018 Shivansh added check to viewlanguages
 */
  private getLanguageList() {
    let canView = this.permissions.ActivateLanguage ? true : false;
    return this.localService.getMST_Languages(canView).then((response: any[]) => {
      response.map(item => {
        item.isEnabled = item.isEnabled == "true" ? true : false;
      });
      this.LangList = response;
      return Promise.resolve(true);
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getLanguageList', 'Error in getLanguageList, getMST_Languages local service : ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }


  /**
 * @memberof Language
 * @default: 
 * @description: 
 * use onchange event as changeValue method for checking old and new value
 */
  private changeValue(event: any) {
    this.changedValue = event;
  }


  /**
   * @memberof Language
   * @default: 
   * @description: 
   * Will update the isEdited key to true if key is edited
   */
  private updateValue(translationRow) {
    if (this.changedValue ? this.changedValue.ngControl.dirty : false) {
      translationRow['isEdited'] = 'true';
      this.changedValue = '';
      this.pendingSubmit.push(translationRow);
    }
  }


  /**
    * @memberof Language
    * @default: 
    * @description: 
    * Will create payload and submit the payload to dbcs.
    */
  private saveLanguageMapping() {
    let self = this;

    self.utilityProvider.showSpinner();
    self.createLanguagePayLoadToSubmit().then(payLoadData => {
      self.submitProvider.submitLanguageKeyMapping(payLoadData).then(res => {
        self.updateLanguageKeyMappingAfterSubmit();
        self.utilityProvider.stopSpinner();
      }).catch(err => {
        self.utilityProvider.stopSpinner();
        self.logger.log(self.fileName, 'saveLanguageMapping', 'Error in submitLanguageKeyMapping,  ' + JSON.stringify(err));
        //this.utilityProvider.displayErrors(err.error);
        if (err.data && err.data.error) {
          this.utilityProvider.displayErrors([{ "errMsg": err.data.error }]);
        }
        //self.utilityProvider.presentToast(err && err.error ? err.error.errorMessage : "Error occured while Submitting Language. Please try again later", 3000, 'top', 'feedbackToast');
      });
    }).catch(err => {
      self.utilityProvider.stopSpinner();
      self.logger.log(self.fileName, 'saveLanguageMapping', 'Error in createLanguagePayLoadToSubmit,  ' + JSON.stringify(err));
      self.utilityProvider.presentToast("Error occured while creating data. Please try again later", 3000, 'top', 'feedbackToast');
    });
  }

  /**
   * @memberof Language
   * @default: 
   * @description: 
   * will create payload to submit data to dbcs
   */
  private createLanguagePayLoadToSubmit() {
    const userID = parseInt(this.valueProvider.getUser().UserID);
    return new Promise((resolve, reject) => {
      let languageKeysToSubmit: any = {};
      let keyMappingToSubmit = [];
      let filteredKeyMapping = this.LabelField.filter(item => { return item.isEdited == "true" });
      if (filteredKeyMapping.length > 0) {
        for (let i = 0; i < filteredKeyMapping.length; i++) {
          let keyMappingObject: any = {};
          keyMappingObject.LANG_ID = this.activeLanguage.Lang_Id;
          keyMappingObject.KEY_ID = parseInt(filteredKeyMapping[i].KEY_ID);
          keyMappingObject.Value = filteredKeyMapping[i].Value;
          keyMappingObject.MODIFIEDBY = userID;
          keyMappingToSubmit.push(keyMappingObject);
        }
      }
      languageKeysToSubmit.LANG_ID = this.activeLanguage.Lang_Id;
      languageKeysToSubmit.IS_ENABLED = this.activeLanguage.isEnabled;
      languageKeysToSubmit.MODIFIEDBY = userID;
      languageKeysToSubmit.KEY_MAPPING = keyMappingToSubmit;
      resolve(languageKeysToSubmit);
    }).catch(err => {
      this.logger.log(this.fileName, 'createLanguagePayLoadToSubmit', 'Error in createLanguagePayLoadToSubmit : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
     * @memberof Language
     * @default: 
     * @description: 
     * will update the isEdited key to false after submit
     */
  private updateLanguageKeyMappingAfterSubmit() {
    this.LabelField.map(item => {
      if (item.isEdited == "true") {
        item.isEdited = "false";
      }
    });
    this.pendingSubmit = [];
  }

  /**
     * @memberof Language
     * @default: 
     * @description: 
     * will export CVS from current list.
     */
  public exportData() {
    if (this.activeLanguage.Code) {
      this.utilityProvider.showSpinner();
      let filePath = cordova.file.dataDirectory;
      let keysToExport = [];
      for (let i = 0; i < this.LabelField.length; i++) {
        let cvsObject = {
          Lang_Code: this.activeLanguage.Code,
          // KEY_ID: this.LabelField[i].KEY_ID,
          Key_Name: this.LabelField[i].Key_Name,
          Value: this.LabelField[i].Value,
          Key_Length: this.LabelField[i].Key_Length
        }
        keysToExport.push(cvsObject);
      }
      this.utilityProvider.createCSV(keysToExport).then((blob: any) => {
        this.utilityProvider.saveLanguageFile(blob, this.activeLanguage.Code + '.csv').then(() => {
          this.utilityProvider.openFile(filePath + '/lang/' + this.activeLanguage.Code + '.csv', 'text/csv', null);
          this.utilityProvider.stopSpinner();
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'getLanguage_Key_Mappings', 'Error in getLanguage_Key_Mappings, saveLanguageFile utility provider : ' + JSON.stringify(error));
        });
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getLanguage_Key_Mappings', 'Error in getLanguage_Key_Mappings, createCSV utility provider : ' + JSON.stringify(error));
      });
    }
    else {
      this.utilityProvider.presentToast('Select Language First', 2000, 'top', 'feedbackToast');
    }
  }

  /**
     * @memberof Language
     * @default: 
     * @description: 
     *  Will import CVS to Language Module. 
     */
  public importData(files: any) {
    this.utilityProvider.showSpinner();
    let self = this;
    if (files && files.length > 0) {
      let reader: FileReader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = (e) => {
        let csv: any = reader.result;
        let allTextLines = csv.split(/\r|\n|\r/);
        let langArrOnUpload: any;
        try {
          langArrOnUpload = self.csvToJson(allTextLines);
        } catch (err) {
          self.utilityProvider.stopSpinner();
          let toast = err;
          self.utilityProvider.presentToast(toast, 1000, 'top', 'feedbackToast');
          return;
        }
        let dataArr = [];
        for (let i = 0; i < langArrOnUpload.length; i++) {
          this.LabelField.map((item) => {
            if (langArrOnUpload[i].Key_Name == item.Key_Name) {
              item.Value = langArrOnUpload[i].Value;
              item.isEdited = "true";
              item.Key_Length = langArrOnUpload[i].Key_Length;
            }
          });
        }
      }
    }
    self.utilityProvider.stopSpinner();
    self.uploadObj.nativeElement.value = "";
  }


  private csvToJson(allTextLines: any[]) {
    let jsonArr: any[] = [];
    let keyJsonErrorArray: any[] = [];
    try {
      let headers = allTextLines[0].split(',');
      allTextLines.shift();
      for (let k in allTextLines) {
        let item = allTextLines[k].split(',');
        if (item.length === headers.length) {
          let json: any = {};
          for (let j in headers) {
            let val = headers[j];
            json[val] = (item[j] == "null" ? null : item[j]);
          };
          if (parseInt(json.Key_Length) < (json.Value ? json.Value.length : 0)) {
            keyJsonErrorArray.push(json);
          } else {
            jsonArr.push(json);
          }
        }
      };
      let filteredArr = jsonArr.filter((item) => { return item.Lang_Code != this.activeLanguage.Code });
      if (filteredArr.length > 0) {
        throw new Error("Please upload selected language !");
      }
      if (keyJsonErrorArray.length > 0) {
        this.showInvalidKeyModal(keyJsonErrorArray);
      }
      return jsonArr;
    } catch (err) {
      this.logger.log(this.fileName, 'csvToJson', 'Error in csvToJson : ' + JSON.stringify(err));
      throw err;
    }
  }

  /**
     * @memberof Language
     * @default: 
     * @description: 
     *  Will show toast if user tries to add translation more than key length
     */
  private showInvalidKeyModal(invalidKeysArr) {
    let toast = "Please enter value with provided key length";
    this.utilityProvider.presentToast(toast, 1000, 'top', 'feedbackToast');
    let params = {
      InvalidKeysArr: invalidKeysArr,
      ActiveLanguage: this.activeLanguage
    };
    let invalidKeyModal = this.utilityProvider.showModal("InvalidKeyModalPage", params, { enableBackdropDismiss: false, cssClass: 'InvalidKeyModalPage' });
    invalidKeyModal.present();
    invalidKeyModal.onDidDismiss(data => {
      this.logger.log(this.fileName, 'showInvalidKeyModal', "dismissModal");
    });
  }


  /**
   * @memberof Language
   * @default: 
   * @description: 
   * 08/13/2018 Mayur Varshney -- clear mappingDataChange array on changing of language
   */
  public addLanguagePopup(val) {
    if (val == -1) {
      this.LabelField = [];
    } else {
      if (this.utilityProvider.isConnected()) {
        this.activeLanguage = this.LangList[val];
        this.fetchLanguageKeyMaping();
      } else {
        this.utilityProvider.stopSpinner();
        this.utilityProvider.presentToast("Please come online to fetch the keys", 3000, 'top', 'feedbackToast');
      }
    }
  }

  /**
     * @memberof Language
     * @default: 
     * @description: 
     *will fetch language key mapping from dbcs
     */
  private async fetchLanguageKeyMaping(): Promise<boolean> {
    let result: boolean = false;
    try {
      await this.fetchProvider.fetchLanguageKeyMapping(this.activeLanguage.Lang_Id).then((res: any) => {
        if (res && res.length) {
          res.map(item => {
            item.isEdited = "false";
          });
          this.LabelField = res;
          result = true;
          this.utilityProvider.stopSpinner();
        } else {
          this.LabelField = [];
          this.utilityProvider.stopSpinner();
        }
        // else {
        //   this.utilityProvider.stopSpinner();
        //   this.syncProvider.handleError(this.fileName, "fetchLanguageKeyMapping", res && res.error ? res.error : "Error occured while fetching language");
        //   this.utilityProvider.presentToast(res && res.error ? res.error.errorMessage : "Error occured while fetching language", 3000, 'top', 'feedbackToast');
        // }
      }).catch(err => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'fetchLanguageKeyMaping', 'Error in fetchLanguageKeyMapping : ' + JSON.stringify(err));
        if (err.data && err.data.error) {
          this.utilityProvider.displayErrors([{ "errMsg": err.data.error }]);
        }
        //this.utilityProvider.presentToast(err && err.error ? err.error.errorMessage : "Error occured while fetching language", 3000, 'top', 'feedbackToast');
      });
    } catch (error) {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'fetchLanguageKeyMaping', 'Error in fetchLanguageKeyMapping : ' + JSON.stringify(error));
      if (error.data && error.data.error) {
        this.utilityProvider.displayErrors([{ "errMsg": error.data.error }]);
      }
      //this.utilityProvider.presentToast("Error occured while fetching language", 3000, 'top', 'feedbackToast');
    } finally {
      return result;
    }
  }

  onCancel() {
    this.myInput = '';
  }


  public validateLength(event: any, keyLength) {
    if (event.target.textLength > keyLength) {
      event.preventDefault();
    }
  }

  ionViewWillLeave(): void {
    this.events.unsubscribe('langSelected');
    this.events.unsubscribe('refreshPageData');
    clearTimeout(this.timeOut);

  }
}
