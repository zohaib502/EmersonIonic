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
  selector: 'page-iso-review-submit',
  templateUrl: 'iso-review-submit.html',
})
export class IsoReviewSubmitPage {
  asfoundObj: any = {}; accessoriesObj: any = {};
  calibrationObj: any = {};
  photosObj: any = {};
  findingsObj: any = {};
  solutionObj: any = {};
  testObj: any = {};
  OptionalObj: any = {};
  finalInspectionObj: any = {};
  asfoundAccData: any = {};
  calibrationSolutionObj: any = {};
  solutionAccData: any = {};
  reportNotesObj: any = {};
  recommendationObj: any = {};
  Photos: any[] = [];
  allPhotos: any[] = [];
  photosKeys: any[] = [];
  showLoader: boolean = false;
  Enums: any;
  currentReport: any;
  header_data: any;
  fileName: any = "ISOReviewSubmitPage";
  cardToDisplay: any;
  reportId: any;
  selectedDeviceType: any;
  selectedProcess: any;
  headerToDisplay: any;
  parentReferenceID: any;
  accordionTitle: any = {};
  pageArray: any[] = [

  ];
  deviceID: any;
  expandOuterAccordion: any = {};
  accordionData = new AccordionData();
  WitnessHoldPoints: any[] = [];
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
    //this.getDeviceID();
    this.events.publish('user:created', 'SDR');
    this.cardToDisplay = '1';
    this.headerToDisplay = 'As Found';
    this.expandOuterAccordion = {};
    this.testObj = {};
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
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'ASFOUNDFLOWISOLATION'));
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'CALIBRATIONFLOWISOLATION '));
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'FINDINGSFLOWISOLATION'));
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'SOLUTIONFLOWISOLATION', 'ISCONSTRUCTIONCHANGES!="NA"'));
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'TESTDATAFLOWISOLATION'));
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'OPTIONALFLOWISOLATION'));
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'FINALINSPECTIONFLOWISOLATION'));
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'ACCESSORIESFLOWISOLATION', 'VALUE_FOR="asfound"'));
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'CALIBRATIONSOLUTIONFLOWISOLATION '));
        promiseArr.push(this.localServicesdr.getPageData(this.reportId, 'ACCESSORIESFLOWISOLATION', 'VALUE_FOR="solution"'));
        promiseArr.push(this.getFIReportNotes());
        promiseArr.push(this.getFIRecommendations());
        promiseArr.push(this.getPhotosData());
        Promise.all(promiseArr).then((response: any[]) => {
          this.asfoundObj = response[0] ? response[0][0] : {};
          this.calibrationObj = response[1] ? response[1][0] : {};
          this.findingsObj = response[2] ? response[2][0] : {};
          this.solutionObj = response[3] ? response[3][0] : {};
          this.testObj = response[4] ? response[4][0] : {};
          const OptionalObj = response[5] ? response[5] : {};
          this.bindOptionalObj(OptionalObj);
          this.finalInspectionObj = response[6] ? response[6][0] : {};
          this.asfoundAccData = response[7] ? response[7] : {};
          this.calibrationSolutionObj = response[8] ? response[8][0] : {};
          this.solutionAccData = response[9] ? response[9] : {};
          this.hideAccordionLabelForFindingsIfNoValue();
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

  bindOptionalObj(OptionalObj) {
    if (OptionalObj && OptionalObj[0]) {
      OptionalObj = OptionalObj[0];
    }
    let key = 'CV';
    if (this.deviceID == Enums.FlowIsolationProductId.ControlValve) {
      key = 'CV';
    } else if (this.deviceID == Enums.FlowIsolationProductId.Isolation) {
      key = 'ISO';
    } else if (this.deviceID == Enums.FlowIsolationProductId.TrimOnly) {
      key = 'TO';
    }
    if (this.deviceID == Enums.FlowIsolationProductId.ControlValve) {
      // Test Technician, Witness and Date
      this.OptionalObj.VALVEPRE_TESTDATA_TESTTECHNICIAN = OptionalObj[key + '_VALVEPRE_TESTDATA_TESTTECHNICIAN'];
      this.OptionalObj.VALVEPRE_TESTDATA_TESTWITNESS = OptionalObj[key + '_VALVEPRE_TESTDATA_TESTWITNESS'];
      this.OptionalObj.VALVEPRE_TESTDATA_TESTDATE = OptionalObj[key + '_VALVEPRE_TESTDATA_TESTDATE'];
    }

    // Valve Pre-Test Data
    this.OptionalObj.ValvePreTestData_NA = OptionalObj[key + '_VALVEPRE_TESTDATA_VALVEPRE_TESTDATA_NA'];
    this.OptionalObj.ValvePreTestData = {};
    for (let a in this.accordionData.optionalKeys.ValvePreTestData) {
      this.OptionalObj.ValvePreTestData[this.accordionData.optionalKeys.ValvePreTestData[a]] = OptionalObj[key + '_' + this.accordionData.optionalKeys.ValvePreTestData[a]];
      this.manageOtherValue('ValvePreTestData', a, OptionalObj[key + '_' + this.accordionData.optionalKeys.ValvePreTestData[a]]);
    }

    // Materials Verification
    this.OptionalObj.MaterialsVerification_NA = OptionalObj[key + '_MATERIALSVERIFICATION_MATERIALSVERIFICATION_NA'];
    this.OptionalObj.MaterialsVerification = {};
    for (let a in this.accordionData.optionalKeys.MaterialsVerification) {
      this.OptionalObj.MaterialsVerification[this.accordionData.optionalKeys.MaterialsVerification[a]] = OptionalObj[key + '_' + this.accordionData.optionalKeys.MaterialsVerification[a]];
      this.manageOtherValue('MaterialsVerification', a, OptionalObj[key + '_' + this.accordionData.optionalKeys.MaterialsVerification[a]]);
    }

    // Sliding Item
    this.OptionalObj.SlidingItem_NA = OptionalObj[key + '_SLIDINGITEM_SLIDINGITEM_NA'];
    this.OptionalObj.SlidingItem = {};
    for (let a in this.accordionData.optionalKeys.SlidingItem) {
      this.OptionalObj.SlidingItem[this.accordionData.optionalKeys.SlidingItem[a]] = OptionalObj[key + '_' + this.accordionData.optionalKeys.SlidingItem[a]];
      this.manageOtherValue('SlidingItem', a, OptionalObj[key + '_' + this.accordionData.optionalKeys.SlidingItem[a]]);
    }

    // Rotary Valve
    this.OptionalObj.RotaryValve_NA = OptionalObj[key + '_ROTARYVALVE_ROTARYVALVE_NA'];
    this.OptionalObj.RotaryValve = {};
    for (let a in this.accordionData.optionalKeys.RotaryValve) {
      this.OptionalObj.RotaryValve[this.accordionData.optionalKeys.RotaryValve[a]] = OptionalObj[key + '_' + this.accordionData.optionalKeys.RotaryValve[a]];
      this.manageOtherValue('RotaryValve', a, OptionalObj[key + '_' + this.accordionData.optionalKeys.RotaryValve[a]]);
    }

    if (this.deviceID == Enums.FlowIsolationProductId.ControlValve) {
      // Controller Construction
      this.OptionalObj.ControllerConstruction_NA = OptionalObj[key + '_CONTROLLERCONSTRUCTION_CONTROLLERCONSTRUCTION_NA'];
      this.OptionalObj.ControllerConstruction = {};
      for (let a in this.accordionData.optionalKeys.ControllerConstruction) {
        this.OptionalObj.ControllerConstruction[this.accordionData.optionalKeys.ControllerConstruction[a]] = OptionalObj[key + '_' + this.accordionData.optionalKeys.ControllerConstruction[a]];
        this.manageOtherValue('ControllerConstruction', a, OptionalObj[key + '_' + this.accordionData.optionalKeys.ControllerConstruction[a]]);
      }
    }

    if (this.deviceID == Enums.FlowIsolationProductId.ControlValve || this.deviceID == Enums.FlowIsolationProductId.TrimOnly) {
      // Witness Hold Points
      this.OptionalObj.WitnessHoldPoints_NA = OptionalObj[key + '_WITNESSHOLDPOINTS_WITNESSHOLDPOINTS_NA'];
      if (!this.OptionalObj.WitnessHoldPoints_NA) {
        this.getWitnessHoldPoints();
      }
    }
  }

  manageOtherValue(key, index, value) {
    if (this.accordionData.optionalKeys[key][index].indexOf("_OT") == this.accordionData.optionalKeys[key][index].length - 3) {
      const nonOtherKey = this.accordionData.optionalKeys[key][index].substring(0, this.accordionData.optionalKeys[key][index].indexOf("_OT"));
      if (this.OptionalObj[key][nonOtherKey] == 'Other') {
        this.OptionalObj[key][nonOtherKey] = value;
      }
    }
  }

  getWitnessHoldPoints() {
    try {
      this.localServicesdr.getWitnessHoldPoints(this.reportId).then((res: any): any => {
        if (res && res.length) {
          this.WitnessHoldPoints = [];
          for (var i in res) {
            const WitnessHoldPoint = JSON.parse(JSON.stringify(res[i]));
            this.WitnessHoldPoints.push(WitnessHoldPoint);
          }
        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getWitnessHoldPoints', ' Error in getWitnessHoldPoints : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, "getWitnessHoldPoints", "Error: " + error.message);
    }
  }

  accordionHasValue(accordionName) {
    let hasValue = false;
    for (const a in this.accordionData.optionalKeys[accordionName]) {
      const key = this.accordionData.optionalKeys[accordionName][a];
      if (this.OptionalObj[accordionName][key] != null) {
        hasValue = true;
        break;
      }
    }
    return hasValue;
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

  // createMailTemplate(report) {
  //   let customerName = (report && report.CUSTOMERNAME) ? report.CUSTOMERNAME : '';
  //   let firstName = this.valueProvider.getUser().Name ? (this.valueProvider.getUser().Name).split(',')[1] : '';
  //   let lastName = (this.valueProvider.getUser().Name) ? (this.valueProvider.getUser().Name).split(',')[0] : '';

  //   let standaloneEmailBody = "<div style='border:2px;border-style:solid;border-color:lightgrey;padding:3px;'><div style='margin-bottom:10px;background-color:black;color:white;'><div style='text-align:right;'><span><a href='https://www.facebook.com/EmersonAutomationSolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=31da83f1a1b0418284454e08f03d0f0d&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.facebook + "' ></img></a></span><span><a href='https://twitter.com/search?q=Emerson%20Automation%20Solutions&src=typd'><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.twitter + "'></img></a></span><span><a href='https://www.linkedin.com/company/emerson-automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=f1f81298eb8c4d6e85d872355cd4ad22&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.linkedin + "' ></img></a></span><span><a href='https://www.youtube.com/Emersonautomationsolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=79be647e1eb143b6b86aff0599c01d3c&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.youtube + "' ></img></a></span></div></div><br><div style='padding:5px;'><a href='https://www.emerson.com/en-us/automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=679a6f9a219e4570b8dedfde81bf3bec&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><span><img style='height:auto;width:auto;' src='" + Enums.MailIcon.emersonLogo + "'></img></span></a></div><br><br><div style='padding:5px;'>Dear " + (customerName) + ",\n\nThank you for your business. \n\nPlease refer to attached report for the Field Service with the following details: \n\u2022 Field Job Number : " + report.JOBID + "\n\nShould you have any question, please email us at ContactUs@Emerson.com or call your local Emerson representative and provide above details for reference. \n\nThank you. \n\nSincerely,\n\n" + firstName + " " + lastName + "</div><br><br><table style='width:100%;padding:10px;background-color:black;color:white;'><tr><td width='75%'><div style='text-align:left;'><span>Emerson Automation Solution</span><br><span><a href='https://www.emerson.com'><span style='color:blue;'>www.Emerson.com<span></a></span></div></td><td><div style='text-align:right;float:right;'><span><a href='https://www.facebook.com/EmersonAutomationSolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=31da83f1a1b0418284454e08f03d0f0d&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.facebook + "' ></img></a></span><span><a href='https://twitter.com/search?q=Emerson%20Automation%20Solutions&src=typd'><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.twitter + "'></img></a></span><span><a href='https://www.linkedin.com/company/emerson-automation-solutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=f1f81298eb8c4d6e85d872355cd4ad22&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.linkedin + "' ></img></a></span><span><a href='https://www.youtube.com/Emersonautomationsolutions?utm_campaign=19E_AP_GRP-en_STI_Welcome_290_EM06&utm_medium=email&utm_source=Eloqua&elqTrackId=79be647e1eb143b6b86aff0599c01d3c&elq=e810b7444adb41f4b9ba7ac0a05b06f6&elqaid=19854&elqat=1&elqCampaignId='><img style='margin-right:5px;color:white;' src='" + Enums.MailIcon.youtube + "' ></img></a></span></div></td></tr></table></div>";

  //   let standaloneModalEmailBody = 'Dear ' + (customerName) + ',\n\nThank you for your business. \n\nPlease refer to attached report for the Field Service with the following details: \n\u2022 Field Job Number : ' + report.JOBID + '\n\nShould you have any question, please email us at ContactUs@Emerson.com or call your local Emerson representative and provide above details for reference. \n\nThank you. \n\nSincerely,\n\n' + firstName + ' ' + lastName;

  //   return {
  //     "body": standaloneModalEmailBody,
  //     "emailBody": standaloneEmailBody
  //   }
  // }

  createMailTemplate(task) {
    let customerName = task.IsStandalone && task.IsStandalone == 'false' ? task.Customer_Name : task.CUSTOMERNAME;
    // 09/28/2019 -- Mayur Varshney -- format user name
    let currentUserName = this.valueProvider.getUser() ?  this.utilityProvider.formattedCurrentUserName(this.valueProvider.getUser().Name) : '';
    // let start_date;
    // let end_date;
    // if (this.valueProvider.getUser().timeZoneIANA) {
    //   start_date = (task && task.Start_Date) ? moment(task.Start_Date).tz(this.valueProvider.getUser().timeZoneIANA).format('YYYY-MM-DD HH:mm:ss.SSS Z') : '';
    //   end_date = (task && task.End_Date) ? moment(task.End_Date).tz(this.valueProvider.getUser().timeZoneIANA).format('YYYY-MM-DD HH:mm:ss.SSS Z') : '';
    // } else {
    //   start_date = (task && task.Start_Date) ? moment(task.Start_Date).utc().format('YYYY-MM-DD HH:mm:ss.SSS Z') : '';
    //   end_date = (task && task.End_Date) ? moment(task.End_Date).utc().format('YYYY-MM-DD HH:mm:ss.SSS Z') : '';
    // }

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

  getFIRecommendations() {
    return new Promise((resolve, reject) => {
      this.localServicesdr.getFIRecommendations(this.reportId).then((res: any) => {
        if (res.length > 0) {
          this.recommendationObj = res[0];
          this.recommendationObj.FutureRecommendationsOptionName = this.recommendationObj.FUTURERECOMMENDATIONS == -1 ? 'Other' : res[0].LookupValue;
        }
        resolve(true);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getFIRecommendations', ' Error in getFIRecommendations : ' + JSON.stringify(error));
        reject(error);
      })
    }).catch(error => {
      this.logger.log(this.fileName, 'getFIRecommendations', ' Error in promise : ' + JSON.stringify(error));
      return Promise.reject(error);
    })
  }

  getFIReportNotes() {
    return new Promise((resolve, reject) => {
      this.localServicesdr.getFIReportNotes(this.reportId).then((res: any) => {
        if (res.length > 0) {
          this.reportNotesObj = res[0];
          this.reportNotesObj.REPAIRSCOPECOMPLETEDNAME = this.reportNotesObj.REPAIRSCOPECOMPLETED == -1 ? 'Other' : res[0].LookupValue;
        }
        resolve(true);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getFIReportNotes', ' Error in getFIReportNotes : ' + JSON.stringify(error));
        reject(error);
      })
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getFIReportNotes', ' Error in promise : ' + JSON.stringify(error));
      return Promise.reject(error);
    })
  }

  getPhotosData() {
    return new Promise((resolve, reject) => {
      try {
        this.Photos = [];
        this.allPhotos = [];
        this.photosKeys = [];
        this.localServicesdr.getPageData(this.reportId, 'REPORTATTACHMENTS').then((response: any[]) => {
          if (response.length > 0) {
            this.Photos = response;
            this.setAttachmentData();
          }
          resolve(true);
        }).catch((error: any) => {
          this.logger.log(this.fileName, 'getPhotosData', ' Error in getPhotosData : ' + JSON.stringify(error));
          reject(error);
        });
      }
      catch (e) {
        this.logger.log(this.fileName, 'getPhotosData', ' Error in getPhotosData try-catch block : ' + e.message);
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getPhotosData', ' Error in getPhotosData promise block: ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }


  setAttachmentData() {
    this.allPhotos.push(this.Photos.filter(item => {
      return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundAssembly;
    }));
    this.allPhotos.push(this.Photos.filter(item => {
      return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundTrim;
    }));
    this.allPhotos.push(this.Photos.filter(item => {
      return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsLeftTrim;
    }));
    this.allPhotos.push(this.Photos.filter(item => {
      return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsLeftAssembly;
    }));
    this.allPhotos.push(this.Photos.filter(item => {
      return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundAssemblyPhotos;
    }));
    this.allPhotos.push(this.Photos.filter(item => {
      return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundTrimPhotos;
    }));
  }

  getDeviceID() {
    this.localServicesdr.getDEVICEIDForFlowIsolation(this.reportId).then((val) => {
      this.deviceID = val;
    })
  }

  hideAccordionLabelForFindingsIfNoValue() {
    let jsonObj = this.setJson();
    for (let i = 0; i < jsonObj.length; i++) {
      let accordionName = jsonObj[i];
      for (let key in this.accordionData[accordionName]) {
        let val: any = this.accordionData[accordionName][key];
        if (!this.expandOuterAccordion[accordionName]) {
          if (this.findingsObj) {
            this.expandOuterAccordion[accordionName] = this.utilityProvider.isNotNull(this.findingsObj[val]) ? true : false;
          }
        }
      }
    }
  }

  setJson() {
    let json = ["BodyBonnetControlValve", "TrimControlValve", "ActuatorControlValve", "PositionerControlValve", "OtherControlValve",
      "BodyBonnetIsolation", "TrimIsolation", "ActuatorIsolation", "PositionerIsolation", "OtherIsolation", "PositionerInstrument", "OtherInstrument",
      "LevelTroll", "TrimOnly", "Regulator"
    ]

    return json;
  }

  hideTitleIfNoData(pageName) {
    let hasValue = false;
    let dataObj;
    this.accordionTitle = {};
    let objectInnerKeys = this.getAccordionTitles()[pageName][Enums.FlowIsolationProductId[this.deviceID]];
    for (let key in objectInnerKeys) {
      let allDBKeys;
      if (pageName == 'As Found' || pageName == 'Solution') {
        allDBKeys = this.accordionData.allAsFoundKeysFI[Enums.FlowIsolationProductId[this.deviceID]][objectInnerKeys[key]];
        if (pageName == 'As Found') { dataObj = this.asfoundObj; }
        else { dataObj = this.solutionObj; }
      }
      if (pageName == 'Test Data') {
        allDBKeys = this.accordionData.allTestDataKeys[Enums.FlowIsolationProductId[this.deviceID]][objectInnerKeys[key]];
        dataObj = this.testObj;
      }
      if (pageName == 'Final Inspection') {
        allDBKeys = this.accordionData.allFinalInspectionKeys[Enums.FlowIsolationProductId[this.deviceID]][objectInnerKeys[key]];
        dataObj = this.finalInspectionObj
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
      "As Found": {
        "ControlValve": ["BodyCV", "ActuatorCV", "PositionerCV"],
        "Isolation": ["BodyISO", "ActuatorISO", "PositionerISO"],
        "Controller": ["ControllerCTR"],
        "Instrument": ["PositionerINS"],
        "LevelTroll": ["LevelLT", "InstrumentLT", "AccessoriesLT"],
        "Regulator": ["BodyREG", "PilotREG", "MVREG"],
        "TrimOnly": ["BodyTO"]
      },
      "Solution": {
        "ControlValve": ["BodyCV", "ActuatorCV", "PositionerCV"],
        "Isolation": ["BodyISO", "ActuatorISO", "PositionerISO"],
        "Controller": ["ControllerCTR"],
        "Instrument": ["PositionerINS"],
        "LevelTroll": ["LevelLT", "InstrumentLT", "AccessoriesLT"],
        "Regulator": ["BodyREG", "PilotREG", "MVREG"],
        "TrimOnly": ["BodyTO"]
      },
      "Test Data":
      {
        "ControlValve": ["PKGGSTPressure", "SeatLeakClass", "Leakage", "HydroTestPressure"],
        "Isolation": ["PKGGSTPressure", "SeatLeakClass", "Leakage", "HydroTestPressure"],
        "LevelTroll": ["RepairAssemblyData"]
      },

      "Final Inspection":
      {
        "ControlValve": ["bodyassembly", "documentation", "shipping", "actuator", "instrument"],
        "Isolation": ["documentation", "shipping"],
        "Controller": ["documentation", "shipping"],
        "Instrument": ["instrument", "documentation", "shipping"],
        "LevelTroll": ["leveltrolassembly", "shipping", "documentation"],
        "Regulator": ["regulatorassembly", "documentation", "shipping"],
        "TrimOnly": ["shipping", "documentation"]
      }
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
        case Enums.FlowIsolationProductId.ControlValve:
        case Enums.FlowIsolationProductId.Isolation:
          this.pageArray = fdoValue ? sdrTabsData.isoCrtTabs.filter((i) => { return i.fdo && i.id != '11' && i.id != '12'; }) : sdrTabsData.isoCrtTabs.filter((i) => { return i.id != '11' && i.id != '12'; });
          break;
        case Enums.FlowIsolationProductId.Controller:
          this.pageArray = fdoValue ? sdrTabsData.isoController.filter((i) => { return i.fdo && i.id != '7' && i.id != '8'; }) : sdrTabsData.isoController.filter((i) => { return i.id != '7' && i.id != '8'; });
          break;
        case Enums.FlowIsolationProductId.Instrument:
          this.pageArray = fdoValue ? sdrTabsData.isoInstrumentTabs.filter((i) => { return i.fdo && i.id != '9' && i.id != '10'; }) : sdrTabsData.isoInstrumentTabs.filter((i) => { return i.id != '9' && i.id != '10'; });
          break;
        case Enums.FlowIsolationProductId.LevelTroll:
        case Enums.FlowIsolationProductId.Regulator:
          this.pageArray = fdoValue ? sdrTabsData.isoLevelTrolRegTabs.filter((i) => { return i.fdo && i.id != '9' && i.id != '10'; }) : sdrTabsData.isoLevelTrolRegTabs.filter((i) => { return i.id != '9' && i.id != '10'; });
          break;
        case Enums.FlowIsolationProductId.TrimOnly:
          this.pageArray = fdoValue ? sdrTabsData.isoTrimOnlyTabs.filter((i) => { return i.fdo && i.id != '9' && i.id != '10'; }) : sdrTabsData.isoTrimOnlyTabs.filter((i) => { return i.id != '9' && i.id != '10'; });
          break;
      }
    })
  }


}

