import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { UtilityProvider } from '../../providers/utility/utility';
import { CloudService } from '../../providers/cloud-service/cloud-service';
import { LoggerProvider } from '../../providers/logger/logger';
import * as moment from "moment-timezone";
import * as JSZip from 'jszip';
import { HttpClient } from "@angular/common/http";
import { FileUpdaterProvider } from '../../providers/file-updater/file-updater';
import { ValueProvider } from '../../providers/value/value';
import * as Enums from '../../enums/enums';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-mail',
  templateUrl: 'mail.html',
})
export class MailPage {
  mailObj: any = {
    attachment: [],
    to: 'SupportTeam',
    cc: '',
    subject: '',
    body: ''
  };
  fileName: any = 'Error Logs';
  isCorrectRecipient: boolean = true;

  constructor(public navCtrl: NavController, private cloudService: CloudService, public logger: LoggerProvider, public navParams: NavParams, public viewCtrl: ViewController, private utilityProvider: UtilityProvider, public platform: Platform, public http: HttpClient, public fileUpdater: FileUpdaterProvider, public valueProvider: ValueProvider) {
    //this.mailObj.subject = 'Issue reported from ' + Enums.Environment.env + ' environment for  Field Service version ' + this.fileUpdater.localDBConfig.softVersion + ' by ' + this.valueProvider.getUser().Email;
    this.mailObj.subject = 'Issue reported by '+ this.valueProvider.getUser().Email + ' from Field Service App (' + Enums.Environment.env + ' v' + this.fileUpdater.localDBConfig.softVersion + ')';
  
    let body = this.navParams.get('dataSource');
    if (body && body.length) {
      this.mailObj.body = [];
      body.forEach((item, index) => {
        this.mailObj.body += (index + 1) + ') ' + item.httpCode + ' - ' + item.userMessage + ' \n';
      })
      // this.mailObj.body = JSON.stringify(mailBody);
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  _keyUp() {
    if (this.mailObj.to.length > 0) {
      this.isCorrectRecipient = true;
    } else {
      this.isCorrectRecipient = false;
    }
  }

  ionViewDidLoad() {
    this.loadData();
  }

  /**
   * attach/create zip file to mail modal
   * @author Pulkit Agarwal
   * @memberof UserPreferencesPage
   */
  loadData() {
    try {
      this.getZipped().then((res: any) => {
        let fileName = "Local_State_" + moment().format("YYYY-MM-DD") + ".zip";
        let base64 = res;
        let base64parts = base64.split(',');
        if (base64parts[1] != "") {
          let compatibleAttachment = base64parts[1];
          this.mailObj.attachment = [{ 'file_content': compatibleAttachment, 'file_name': fileName }];
        }
        else {
          let msg = 'Unable to attach Zip!!!';
          this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'loadData', 'Error in getZipped : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.logger.log(this.fileName, 'loadData', error.message);
    };
  }

  /**
   * Getting zip base64 from local data directory
   * @author Pulkit Agarwal
   * @returns
   * @memberof UserPreferencesPage
   */
  getZipped() {
    let promiseArr = [];
    try {
      let logArray = [];
      let previousDate = moment(new Date()).subtract(16, 'days');
      while (moment(new Date(previousDate)).isSameOrBefore(new Date())) {
        logArray.push(new Date(previousDate));
        previousDate.add(1, 'days');
      }
      return new Promise((resolve, reject) => {
        var zip = new JSZip();
        let sqliteDbDirectory = cordova.file.dataDirectory;
        if (this.platform.is('ios')) { sqliteDbDirectory = cordova.file.applicationStorageDirectory + "/Library/LocalDatabase/"; }
        this.utilityProvider.checkFileIfExist(sqliteDbDirectory, "emerson.sqlite").then(res => {
          if (res) {
            this.utilityProvider.readFileAsBlob(sqliteDbDirectory, "application/zip", "emerson.sqlite").then((resData: any) => {
              zip.folder("DB").file("emerson.sqlite", resData);
              this.utilityProvider.listFileFromFolder(cordova.file.dataDirectory, "logs").then((fileList: any[]) => {
                fileList.forEach(element => {
                  promiseArr.push(this.utilityProvider.readLogsFileAsBlob(element));
                });
                Promise.all(promiseArr).then((allResult: any[]) => {
                  if (allResult.length > 0) {
                    allResult.forEach(item => {
                      zip.folder("Log_Files").file(item.name, item.blob);
                      setTimeout(() => {
                        zip.generateAsync({ type: "base64", compression: "DEFLATE" })
                          .then(function (content) {
                            resolve("data:application/zip;base64," + content);
                          });
                      }, 100);
                    });
                  }
                });
              })
            });
          } else {
            this.logger.log(this.fileName, 'openMail', 'sqlite File not exist');
            let msg = 'Unable to attach sqlite';
            this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
            reject('sqlite File not exist');
          }
        }).catch((error: any) => {
          this.logger.log(this.fileName, 'openMail', 'Error in checkFileIfExist : ' + JSON.stringify(error));
          let msg = 'Unable to attach sqlite';
          this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
        });
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'openMail', 'Error in openMail : ' + JSON.stringify(error));
        let msg = 'Unable to attach zip!';
        this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
      });
    }
    catch (e) {
      this.logger.log(this.fileName, 'openMail', 'error in try catch block : ' + e.message);
    }
  }

  /**
   * send mail with param reportIssue to attach receipient in cc from MCS
   * @author Pulkit Agarwal
   * @returns
   * @memberof MailPage
   */
  sendMail() {
    if (!this.utilityProvider.isConnected()) {
      let msg = 'Logs can\'t be mailed in offline mode!';
      this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
      return;
    }
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
      // if (toRecipient.length > 0) {
      let data = {
        "contentType": "HTML",
        "content": {
          "body": this.mailObj.body.trim().replace(/[\n]/g, '<br>'),
          "subject": this.mailObj.subject
        },
        "recipient": toRecipient.toString(),
        "cc": ccRecipient.toString(),
        "file": this.mailObj.attachment,
        "reportIssue": true
      };
      this.utilityProvider.stopSpinner();
      this.closeModal();
      this.utilityProvider.enableReportIssueBtn = false;
      this.cloudService.mailReport(data).then((res) => {
        this.utilityProvider.enableReportIssueBtn = true;
        let msg = 'Mail Sent!!!';
        this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');

      }).catch((err) => {
        this.utilityProvider.enableReportIssueBtn = true;
        // this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'sendMail', "Error: " + JSON.stringify(err));
        let msg = 'Error in sending mail.';
        this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
        this.closeModal();
      });
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'sendMail', 'Error in sendMail : ' + error);
      this.utilityProvider.stopSpinner();
      let msg = 'Error in sending mail.';
      this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
      this.closeModal();
    });
  }
}
