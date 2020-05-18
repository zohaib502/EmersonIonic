import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ValueProvider } from '../../../../providers/value/value';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { CloudService } from '../../../../providers/cloud-service/cloud-service';
import { LoggerProvider } from '../../../../providers/logger/logger';
import * as Enums from '../../../../enums/enums';
// import moment from 'moment-timezone';
@IonicPage()
@Component({
  selector: 'page-notes-modal',
  templateUrl: 'notes-modal.html',
})
export class NotesModalPage {
  notes: any;
  languageSelector: any;
  SdrlanguageSelector: any;
  selectedLanguage: any;
  fileName: any = 'Notes_Modal';
  noteType: any;
  ifReadMore: any;
  isMail: any;
  mailObj: any;
  notesInstallBase: any;
  item_Number: any;
  isCorrectRecipient: boolean = true;
  serial_Number: any;
  systemID: any;
  langLOV: any;
  taskStatusId: any;
  filteredLangArr: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public logger: LoggerProvider, private valueProvider: ValueProvider, private cloudService: CloudService, private utilityProvider: UtilityProvider) {
    //private valueProvider: ValueProvider,
  }

  ionViewDidLoad() {
    // 01-04-2019 -- Mansi Arora -- ternary to avoid break in flow if task does not exist or is set to null
    this.taskStatusId = this.valueProvider.getTask() ? this.valueProvider.getTask().StatusID : '';
    this.ifReadMore = this.navParams.get('ifReadMore');
    this.isMail = this.navParams.get('isMail');
    this.notes = this.navParams.get('Notes');
    this.noteType = this.navParams.get('NoteType');
    this.notesInstallBase = this.navParams.get('Notes_Install_Base');
    this.serial_Number = this.navParams.get('Serial_Number');
    this.item_Number = this.navParams.get('Item_Number');
    // 11/05/2019 -- Mayur Varshney -- Add system id to show on summary read more page
    this.systemID = this.navParams.get('System_ID') ? this.navParams.get('System_ID') : null;
    this.languageSelector = this.navParams.get('languageSelector');
    this.SdrlanguageSelector = this.navParams.get('SdrlanguageSelector');
    let taskStatus = this.navParams.get('taskStatus');
    if (!this.isMail) {
      //09/14/2018 Zohaib Khan: If status is completed than pull get completed fsr language lov
      if (taskStatus == "Completed-Awaiting Review" || ((this.taskStatusId == Enums.Jobstatus.Debrief_In_Progress) && (this.valueProvider.getadditionalTime().length == 0 && this.valueProvider.getSortedModifiedTime().length == 0 && this.valueProvider.getadditionalExpense().length == 0 && this.valueProvider.getSortedModifiedExpense().length == 0 && this.valueProvider.getAdditionalMaterial().length == 0 && this.valueProvider.getSortedModifiedMaterial().length == 0) && (this.navParams.get('DetailedNotes') == "true" ? true : false))) {
        this.getCompletedLov();
      } else {
        this.getFilteredLangLov();
      }
    } else {
      this.mailObj = this.navParams.get('mailObj');
    }
  }

  saveLanguage() {
    // this.logger.log(this.fileName, 'saveLanguage', "pdf will be generated in this language :- " + this.selectedLanguage);
    this.viewCtrl.dismiss(this.selectedLanguage);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  getFilteredLangLov() {
    let FSRPrintLanguages = this.navParams.get('printLangList');
    this.langLOV = this.navParams.get('langLOV');
    //09/14/2018 Zohaib Khan: Filtering language array based on lang code 
    if (this.langLOV.length > 0 && FSRPrintLanguages.length > 0) {
      // 12-26-2018 -- Mansi Arora -- loop langLOV till length - 1
      for (var i = 0; i < this.langLOV.length; i++) {
        // 12-26-2018 -- Mansi Arora -- split the file name to get country code and pdf name
        let fileStatus = this.langLOV[i];
        let langName = fileStatus;
        if (this.langLOV[i].File_Name) {
          fileStatus = this.langLOV[i].File_Name.split("_")[2] + "_" + this.langLOV[i].File_Name.split("_")[3];
          // 12-26-2018 -- Mansi Arora -- further split to get the country code
          langName = fileStatus.split("_")[1].split(".")[0];
        }
        let filteredlangitem = FSRPrintLanguages.filter((item) => {
          // 12-26-2018 -- Mansi Arora -- compare language name with FSRPrintLAnguages code
          return item.Code == langName;
        });
        if (filteredlangitem[0] != undefined) {
          // 12-26-2018 -- Mansi Arora -- concat language name with file name to show in the dropdown and split to get the file code
          if (fileStatus.indexOf("_") > -1) {
            filteredlangitem[0].File_Name = filteredlangitem[0].Lang_Name + " (" + fileStatus.split("_")[0] + ")";
            filteredlangitem[0].File_Code = fileStatus.split("_")[0] + "_" + langName;
            this.filteredLangArr.push({ "File_Name": filteredlangitem[0].File_Name, "File_Code": filteredlangitem[0].File_Code });
          } else {
            this.filteredLangArr.push({ "File_Name": filteredlangitem[0].Lang_Name, "File_Code": filteredlangitem[0].Code });
          }
        }
      }
    }
  }

  getCompletedLov() {
    let filteredlangitem: any;
    let FSRPrintLanguages = this.navParams.get('printLangList');
    let completedLov = this.navParams.get("langLOV");
    if (completedLov && completedLov.length > 0) {
      for (var i = 0; i < completedLov.length; i++) {
        // 10/18/2019 -- Mayur Varshney -- apply condition if CompletedLov don't have any File_Name 
        let fileStatus = completedLov[i];
        let langName = fileStatus;
        if (completedLov[i].File_Name) {
          fileStatus = completedLov[i].File_Name.split("_")[2] + "_" + completedLov[i].File_Name.split("_")[3];
          langName = fileStatus.split("_")[1].split(".")[0];
        }
        filteredlangitem = FSRPrintLanguages.filter((item) => {
          return item.Code == langName;
        });
        if (filteredlangitem[0] != undefined) {
          filteredlangitem[0].File_Name = filteredlangitem[0].Lang_Name + " (" + fileStatus.split("_")[0] + ")";
          filteredlangitem[0].File_Code = fileStatus.split("_")[0] + "_" + langName;
          this.filteredLangArr.push({ "File_Name": filteredlangitem[0].File_Name, "File_Code": filteredlangitem[0].File_Code });
        }
      }
      // this.filteredLangArr = this.removeDuplicatesObjFromArray(this.filteredLangArr, "Code");
    }
    if (this.filteredLangArr && this.filteredLangArr.length > 0) {
      if (this.filteredLangArr[0].File_Code.split("-")[0] != "Resubmitted") {
        this.filteredLangArr = this.uniqBy(this.filteredLangArr, JSON.stringify);
      }
    }
  }

  uniqBy(a, key) {
    var seen = {};
    return a.filter(function (item) {
      var k = key(item.File_Name.split(")")[0]);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
  }


  //09/20/2018 Zohaib Khan: Removing duplicate language object based on language code.   
  removeDuplicatesObjFromArray(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  /**
   * 12-27-2018 -- Mansi Arora -- check for blank recipient field on key up
   * @memberOf NotesModalPage
  */
  _keyUp() {
    if (this.mailObj.to.length > 0) {
      this.isCorrectRecipient = true;
    } else {
      this.isCorrectRecipient = false;
    }
  }

  /**
   * 12-19-2018 -- Mansi Arora -- hit MCS to send the attachment via mail
   * checks if device is connected to the internet, if not shows a toast
   * validates if recipient is entered by the user
   * calls utilty funcion to validate all the recipients in the string
   * prepares an object and calls the MCS to send the mail along with the attachment
   * Handle condition via catch if found any error
   * @memberOf NotesModalPage
  */
  sendMail() {
    if (!this.utilityProvider.isConnected()) {
      let msg = 'PDF can\'t be mailed in offline mode!';
      this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
      return;
    }
    // 12-26-2018 -- Mansi Arora -- show error in modal if mail not present
    if (!this.mailObj.to || this.mailObj.to.trim() == '') {
      this.isCorrectRecipient = false;
      return;
    }
    this.utilityProvider.showSpinner();
    let toRecipient: any = [];
    let ccRecipient: any = [];
    let promiseArr = [];
    promiseArr.push(this.utilityProvider.validateEmailToMail(this.mailObj.to));
    promiseArr.push(this.utilityProvider.validateEmailToMail(this.mailObj.cc));
    Promise.all(promiseArr).then((allresult) => {
      toRecipient = allresult[0];
      ccRecipient = allresult[1];
      if (toRecipient.length > 0) {
        let data = {
          "contentType": "HTML",
          "content": {
            "body": this.mailObj.emailBody.trim().replace(/[\n]/g, '<br>'),
            "subject": this.mailObj.subject
          },
          "recipient": toRecipient.toString(),
          "cc": ccRecipient.toString(),
          "file": this.mailObj.attachment
        };

        this.cloudService.mailReport(data).then((res) => {
          this.utilityProvider.stopSpinner();
          this.closeModal();
          let msg = 'Mail Sent!!!';
          this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
        }).catch((err) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'sendMail', "Error: " + JSON.stringify(err));
          let msg = 'Error in sending mail.';
          this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
          this.closeModal();
        });
      } else {
        // 12-26-2018 -- Mansi Arora -- show error in modal if mail not present
        this.isCorrectRecipient = false;
        this.utilityProvider.stopSpinner();
        return;
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'sendMail', 'Error in sendMail : ' + error);
      this.utilityProvider.stopSpinner();
      let msg = 'Error in sending mail.';
      this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
      this.closeModal();
    });
  }
}
