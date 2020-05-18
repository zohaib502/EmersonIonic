import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { ValueProvider } from '../../../../providers/value/value';
import { LocalServiceProvider } from '../../../../providers/local-service/local-service';
import { SdrPdfReportProvider } from '../../../../providers/sdr-pdf-report/sdr-pdf-report';
import { SyncProvider } from '../../../../providers/sync/sync';
import { TranslateService } from '@ngx-translate/core';
import { AttachmentProvider } from '../../../../providers/attachment/attachment';
declare var cordova: any;
import * as Enums from '../../../../enums/enums';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { AccordionData } from '../../../../beans/AccordionData';
import { SdrUtilityProvider } from '../../../../providers/sdr-utility/sdr-utility';
import * as moment from "moment";
import { SdrTabsData } from '../../../../beans/SdrTabsData';

@IonicPage()

@Component({
  selector: 'page-pressure-review-submit',
  templateUrl: 'pressure-review-submit.html',
})

export class PressureReviewSubmitPage {
  asFoundPerformanceObj: any = {};
  testDataObj: any = {};
  finalInspectionObj: any = {};
  showLoader: boolean = false;
  Enums: any;
  currentReport: any;
  header_data: any;
  fileName: any = "PressureReviewSubmitPage";
  cardToDisplay: any;
  reportId: any;
  selectedDeviceType: any;
  selectedProcess: any;
  headerToDisplay: any;
  parentReferenceID: any;
  accordionTitle: any = {};
  pageArray: any[] = [];
  deviceID: any;
  expandOuterAccordion: any = {};
  accordionData = new AccordionData();
  depotRepairTrue: boolean = false;

  constructor(public localService: LocalServiceProvider, public valueProvider: ValueProvider,
    public utilityProvider: UtilityProvider, public appCtrl: App, public navCtrl: NavController, public logger: LoggerProvider,
    public localServicesdr: LocalServiceSdrProvider, public navParams: NavParams, public createReport: SdrPdfReportProvider,
    public syncProvider: SyncProvider, public translate: TranslateService, public sanitizer: DomSanitizer, public attachmentProvider: AttachmentProvider,
    public events: Events, public sdrUtility: SdrUtilityProvider) {
    this.Enums = Enums;
  }

  ionViewDidEnter() {
    // 07/10/2019 Gurkirat Singh : Run below code of did enter only if request is coming from 'SdrTabsPage' and not DebriefTabsPage
    if (this.navCtrl.parent && this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    // 07/10/2019 Gurkirat Singh : Sets current report, header data and selected process
    this.navCtrl.parent ? (this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Review Submit" }) : (this.header_data = { title1: "", title2: "Review Submit" });
    if (this.valueProvider.getCurrentReport()) {
      this.currentReport = this.valueProvider.getCurrentReport();
      this.selectedProcess = this.currentReport.SELECTEDPROCESS;
      this.depotRepairTrue = this.currentReport.DEPOTREPAIR;
      this.reportId = this.currentReport.REPORTID;
    }
    this.events.publish('user:created', 'SDR');
    this.cardToDisplay = '1';
    this.headerToDisplay = 'As Found';
    this.expandOuterAccordion = {};
    this.testDataObj = {};
    this.getDeviceID();
    this.loadData();
    this.getDropDownList();
  }

  ionViewDidLoad() {
    this.utilityProvider.showSpinner();
  }

  loadData() {
    return new Promise((resolve, reject) => {
      let promiseArr: any[] = [];
      try {
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'ASFOUNDPERFORMANCEPRESSUREFLOW'));
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'TESTDATAPRESSUREFLOW'));
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'FINALINSPECTIONPRESSUREFLOW'));
        Promise.all(promiseArr).then((response: any[]) => {
          this.asFoundPerformanceObj = response[0] && response[0][0] ? response[0][0] : {};
          this.testDataObj = response[1] && response[1][0] ? response[1][0] : {};
          this.finalInspectionObj = response[2] && response[2][0] ? response[2][0] : {};
          this.hideTitleIfNoData(this.headerToDisplay);
          this.utilityProvider.stopSpinner();
          resolve(true);
        }).catch(error => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, "loadData", "error in promiseAll" + JSON.stringify(error));
          resolve("failure");
        });
      } catch (error) {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, "loadData", "error in try-catch" + error.message);
        resolve("failure")
      }
    }).catch(err => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'loadData', 'error in promise' + JSON.stringify(err));
      return Promise.resolve("failure");
    })
  }

  gotofcr() {
    this.navToFCRFromSubmitReport();
  }

  navToFCRFromSubmitReport() {
    this.localService.getStandaloneJobById(this.valueProvider.getCurrentReport().REPORTID).then((task: any) => {
      if (task.length == 1) {
        this.valueProvider.setTask(task[0]).then(() => {
          this.valueProvider.setTaskId(task[0].Task_Number);
          this.valueProvider.setTaskObject(task[0]);
          this.valueProvider.setVerify(false);
          this.valueProvider.setIsCustomerSelected(false);
          this.valueProvider.setIsSummarySelected(false);
          if (task[0].StatusID == Enums.Jobstatus.Completed_Awaiting_Review) {
            let controller;
            if (this.valueProvider.getCurrentReport().REPORTSTATUS == Enums.ReportStatus.Completed) {
              controller = this.navCtrl;
            } else {
              controller = this.appCtrl.getRootNavs()[0];
            }
            controller.setRoot("SummaryPage", { ifCompleted: true }).then(() => {
              this.utilityProvider.stopSpinner();
            }).catch((error: any) => {
              this.utilityProvider.stopSpinner();
              this.logger.log(this.fileName, 'navToFCRFromSubmitReport', 'Error in navToFCRFromSubmitReport, push("SummaryPage"): ' + JSON.stringify(error));
            });
          } else {
            this.redirectToDebrief();
          }
        })
      } else {
        this.redirectToDebrief();
      }
    })
  }

  private redirectToDebrief() {
    this.appCtrl.getRootNavs()[0].push("DebriefPage");
  }

  sendMail() {
    this.GeneratePdf('sendMail')
  }

  GeneratePdf(isMail?) {
    let langCode = "en-gb";
    if (this.valueProvider.getUserPreferences()[0].FSR_Languages.split(",").length > 1) {
      this.localService.getFSREnabledLanguages().then((SDRPrintLanguages: any) => {
        let params = { 'SdrlanguageSelector': true, 'printLangList': SDRPrintLanguages, 'langLOV': this.valueProvider.getUserPreferences()[0].FSR_Languages.split(",") };
        this.showLangModal(params);
      });
    } else {
      this.utilityProvider.showSpinner();
      this.createReport.generatePdf(true, langCode).then((pdfFileName) => {
        this.openPDF(pdfFileName, isMail);
        this.utilityProvider.stopSpinner();
      }).catch((error) => {
        this.logger.log(this.fileName, "GeneratePdf", "Error Occured: " + JSON.stringify(error));
        this.utilityProvider.stopSpinner();
        this.utilityProvider.presentToast(Enums.Messages.PDF_Failed, 4000, 'top', 'feedbackToast');
      });
    }
  }

  showLangModal(params) {
    let languageModal = this.utilityProvider.showModal("NotesModalPage", params, { enableBackdropDismiss: false, cssClass: 'Language-Selector-Modal' });
    languageModal.present();
    languageModal.onDidDismiss(data => {
      if (data) {
        this.utilityProvider.showSpinner();
        this.createReport.generatePdf(true, data).then((pdfFileName) => {
          this.openPDF(pdfFileName);
          this.utilityProvider.stopSpinner();
        });
      }
    });
  }

  private openPDF(fileName, isMail?) {
    let filePath = cordova.file.dataDirectory;
    filePath = filePath + "/temp/";
    if (!isMail) {
      this.utilityProvider.openFile(filePath + fileName, "application/pdf", null);
    }
    else {
      this.generateBase64(fileName)
    }
  }

  generateBase64(filename) {
    let filepath = cordova.file.dataDirectory;
    let base64;
    filepath = filepath + "/temp/";
    this.utilityProvider.getBase64(filepath, filename)
      .then((res) => {
        base64 = res;
        this.openMailModal(base64, filename);
      }).catch((err) => {
        this.logger.log(this.fileName, 'generateBase64', JSON.stringify(err));
        let msg = 'Unable to attach PDF!!!';
        this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
      });
  }

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
        resolve(contactsEmail);
      });
    });
  }

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
            let recipients = this.removeDuplicates(toContacts);
            let mailTo = this.utilityProvider.isNotNull(recipients) ? recipients.toString() : ' ';
            this.localServicesdr.getTemplateData(this.reportId).then((res: any) => {
              let mailBody = this.createMailTemplate(res[0]);
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
            })
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

  createMailTemplate(task) {
    let customerName = task.IsStandalone && task.IsStandalone == 'false' ? task.Customer_Name : task.CUSTOMERNAME;
    // 09/28/2019 -- Mayur Varshney -- format user name
    let currentUserName = this.valueProvider.getUser() ?  this.utilityProvider.formattedCurrentUserName(this.valueProvider.getUser().Name) : '';
    let modalEmailBody = 'Dear ' + (customerName) + ',\n\nThank you for your business. \n\nPlease refer to attached report for the Field Service with the following details: \n\u2022 Service Request Number : ' + ((task && task.Service_Request) ? task.Service_Request : '') + '\n\u2022 Field Job Number : ' + (task ? (task.JOBID ? task.JOBID : (task.Task_Number ? task.Task_Number : '')) : '') + '\n\u2022 PO Number : ' + ((task && task.CUSTOMERPO) ? task.CUSTOMERPO : '') + '\n\u2022 Field Job Type : ' + ((task && task.Job_Description) ? task.Job_Description : '') + '\n\nShould you have any question, please email us at ContactUs@Emerson.com or call your local Emerson representative and provide above details for reference. \n\nThank you. \n\nSincerely,\n\n' + currentUserName;
    let emailBody = "<div style='border:2px;border-style:solid;border-color:lightgrey;padding:3px;'><div style='margin-bottom:10px;background-color:black;color:white;'><div style='text-align:right;'><span><a href='https://www.facebook.com/EmersonAutomationSolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=31da83f1a1b0418284454e08f03d0f0d&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.facebook + "' ></img></a></span><span><a href='https://twitter.com/search?q=Emerson%20Automation%20Solutions&src=typd'><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.twitter + "'></img></a></span><span><a href='https://www.linkedin.com/company/emerson-automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=f1f81298eb8c4d6e85d872355cd4ad22&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.linkedin + "' ></img></a></span><span><a href='https://www.youtube.com/Emersonautomationsolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=79be647e1eb143b6b86aff0599c01d3c&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.youtube + "' ></img></a></span></div></div><br><div style='padding:5px;'><a href='https://www.emerson.com/en-us/automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=679a6f9a219e4570b8dedfde81bf3bec&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><span><img style='height:auto;width:auto;' src='" + Enums.MailIcon.emersonLogo + "'></img></span></a></div><br><br><div style='padding:5px;'>Dear " + (customerName) + ",\n\nThank you for your business. \n\nPlease refer to attached report for the Field Service with the following details: \n\u2022 Service Request Number : " + ((task && task.Service_Request) ? task.Service_Request : "") + "\n\u2022 Field Job Number : " + (task ? (task.JOBID ? task.JOBID : (task.Task_Number ? task.Task_Number : "")) : "") + "\n\u2022 PO Number : " + ((task && task.CUSTOMERPO) ? task.CUSTOMERPO : "") + "\n\u2022 Field Job Type : " + ((task && task.Job_Description) ? task.Job_Description : "") + "\n\nShould you have any question, please email us at ContactUs@Emerson.com or call your local Emerson representative and provide above details for reference. \n\nThank you. \n\nSincerely,\n\n" + currentUserName + "</div><br><br><table style='width:100%;padding:10px;background-color:black;color:white;'><tr><td width='75%'><div style='text-align:left;'><span>Emerson Automation Solution</span><br><span><a href='https://www.emerson.com'><span style='color:blue;'>www.Emerson.com<span></a></span></div></td><td><div style='text-align:right;float:right;'><span><a href='https://www.facebook.com/EmersonAutomationSolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=31da83f1a1b0418284454e08f03d0f0d&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.facebook + "' ></img></a></span><span><a href='https://twitter.com/search?q=Emerson%20Automation%20Solutions&src=typd'><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.twitter + "'></img></a></span><span><a href='https://www.linkedin.com/company/emerson-automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=f1f81298eb8c4d6e85d872355cd4ad22&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.linkedin + "' ></img></a></span><span><a href='https://www.youtube.com/Emersonautomationsolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=79be647e1eb143b6b86aff0599c01d3c&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.youtube + "' ></img></a></span></div></td></tr></table></div>";
    let standaloneEmailBody = "<div style='border:2px;border-style:solid;border-color:lightgrey;padding:3px;'><div style='margin-bottom:10px;background-color:black;color:white;'><div style='text-align:right;'><span><a href='https://www.facebook.com/EmersonAutomationSolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=31da83f1a1b0418284454e08f03d0f0d&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.facebook + "' ></img></a></span><span><a href='https://twitter.com/search?q=Emerson%20Automation%20Solutions&src=typd'><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.twitter + "'></img></a></span><span><a href='https://www.linkedin.com/company/emerson-automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=f1f81298eb8c4d6e85d872355cd4ad22&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.linkedin + "' ></img></a></span><span><a href='https://www.youtube.com/Emersonautomationsolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=79be647e1eb143b6b86aff0599c01d3c&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.youtube + "' ></img></a></span></div></div><br><div style='padding:5px;'><a href='https://www.emerson.com/en-us/automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=679a6f9a219e4570b8dedfde81bf3bec&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><span><img style='height:auto;width:auto;' src='" + Enums.MailIcon.emersonLogo + "'></img></span></a></div><br><br><div style='padding:5px;'>Dear " + (customerName) + ",\n\nThank you for your business. \n\nPlease refer to attached report for the Field Service with the following details: \n\u2022 Field Job Number : " + (task ? (task.JOBID ? task.JOBID : (task.Task_Number ? task.Task_Number : "")) : "") + "\n\nShould you have any question, please email us at ContactUs@Emerson.com or call your local Emerson representative and provide above details for reference. \n\nThank you. \n\nSincerely,\n\n" + currentUserName + "</div><br><br><table style='width:100%;padding:10px;background-color:black;color:white;'><tr><td width='75%'><div style='text-align:left;'><span>Emerson Automation Solution</span><br><span><a href='https://www.emerson.com'><span style='color:blue;'>www.Emerson.com<span></a></span></div></td><td><div style='text-align:right;float:right;'><span><a href='https://www.facebook.com/EmersonAutomationSolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=31da83f1a1b0418284454e08f03d0f0d&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.facebook + "' ></img></a></span><span><a href='https://twitter.com/search?q=Emerson%20Automation%20Solutions&src=typd'><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.twitter + "'></img></a></span><span><a href='https://www.linkedin.com/company/emerson-automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=f1f81298eb8c4d6e85d872355cd4ad22&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.linkedin + "' ></img></a></span><span><a href='https://www.youtube.com/Emersonautomationsolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=79be647e1eb143b6b86aff0599c01d3c&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.youtube + "' ></img></a></span></div></td></tr></table></div>";
    let standaloneModalEmailBody = 'Dear ' + (customerName) + ',\n\nThank you for your business. \n\nPlease refer to attached report for the Field Service with the following details: \n\u2022 Field Job Number : ' + (task ? (task.JOBID ? task.JOBID : (task.Task_Number ? task.Task_Number : '')) : '') + '\n\nShould you have any question, please email us at ContactUs@Emerson.com or call your local Emerson representative and provide above details for reference. \n\nThank you. \n\nSincerely,\n\n' + currentUserName;
    return {
      "body": task.IsStandalone && task.IsStandalone == 'false' ? modalEmailBody : standaloneModalEmailBody,
      "emailBody": task.IsStandalone && task.IsStandalone == 'false' ? emailBody : standaloneEmailBody
    }
  }


  nextBtnClick() {
    try {
      this.cardToDisplay = (parseInt(this.cardToDisplay) + 1).toString()
    }
    catch (e) {
      this.logger.log(this.fileName, 'nextBtnClick', 'Error in nextBtnClick : ' + e.msg);
    }
  }

  backBtnClick() {
    try {
      this.cardToDisplay = (parseInt(this.cardToDisplay) - 1).toString()
    }
    catch (e) {
      this.logger.log(this.fileName, 'backBtnClick', 'Error in backBtnClick : ' + e.msg);
    }
  }

  selectPage(value) {
    try {
      if (parseInt(value)) {
        this.headerToDisplay = this.pageArray.filter(element => {
          return element.id == value;
        })[0].tabTitle;
        this.hideTitleIfNoData(this.headerToDisplay);
      }
      else {
        this.navCtrl.parent.select(this.navCtrl['index'] - 1);
      }
    }
    catch (e) {
      this.logger.log(this.fileName, 'selectPage', 'Error in selectPage : ' + e.msg);
    }
  }

  getDeviceID() {
    this.localServicesdr.getDEVICEIDForFlowIsolation(this.reportId).then((val) => {
      this.deviceID = val;
    })
  }

  hideTitleIfNoData(pageName) {
    let hasValue = false;
    let dataObj;
    this.accordionTitle = {};
    let objectInnerKeys = this.getAccordionTitles()[pageName];
    for (let key in objectInnerKeys) {
      let allDBKeys;
      if (pageName == 'As Found Performance') {
        allDBKeys = this.accordionData.allAsFoundPerformancePressureKeys[objectInnerKeys[key]];
        dataObj = this.asFoundPerformanceObj;
      }
      if (pageName == 'Test Data') {
        allDBKeys = this.accordionData.allTestDataPressureKeys[objectInnerKeys[key]];
        dataObj = this.testDataObj;
      }
      hasValue = false
      for (let innerDBKey in allDBKeys) {
        if (this.utilityProvider.isNotNull(dataObj[allDBKeys[innerDBKey]])) {
          hasValue = true;
          break;
        }
      }
      if (hasValue) {
        this.accordionTitle[objectInnerKeys[key]] = true;
      }
    }
  }

  getAccordionTitles() {
    let json = {
      "As Found Performance": ["PRE_TEST_DATA", "GAUGE", "CUSTOMER_SPECIFICATION"],
      "Test Data": ["PRESSURE_MEASUREMENT", "RING_SETTINGS", "GENERAL", "SPRING"]
    }
    return json;
  }

  getFomatedDate(date) {
    let _date = moment(date).format('DD-MMM-YYYY');
    return _date;
  }

  getDropDownList() {
    let sdrTabsData = new SdrTabsData();
    this.localServicesdr.getDEVICEIDForFlowIsolation(this.reportId).then((val) => {
      let fdoValue = this.valueProvider.getFdo();
      if (fdoValue == "false") {
        fdoValue = null;
      }
      switch (val) {
        case Enums.PressureProductId.DirectSpring:
        case Enums.PressureProductId.PilotOperated:
        case Enums.PressureProductId.VentVacuumOnly:
        case Enums.PressureProductId.VentPressureOnly:
        case Enums.PressureProductId.VentVacuumPressure:
          this.pageArray = fdoValue ? sdrTabsData.pressureTabs.filter((i) => {
            return i.fdo && i.id != '8' && i.id != '9';
          }) : sdrTabsData.pressureTabs.filter((i) => {
            return i.id != '8' && i.id != '9';
          });
          break;
      }
    });
  }

}
