import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, App } from 'ionic-angular';
import { LocalServiceSdrProvider } from '../../../providers/local-service-sdr/local-service-sdr';
import { LoggerProvider } from '../../../providers/logger/logger';
import { UtilityProvider } from '../../../providers/utility/utility';
import { ValueProvider } from '../../../providers/value/value';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { SdrPdfReportProvider } from '../../../providers/sdr-pdf-report/sdr-pdf-report';
import * as Enums from '../../../enums/enums'
import { AccordionData } from '../../../beans/AccordionData';
import { SyncProvider } from '../../../providers/sync/sync';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AttachmentProvider } from '../../../providers/attachment/attachment';
// import { EmailComposer } from '@ionic-native/email-composer';
declare var cordova: any;
// import moment from 'moment-timezone';
import { SdrUtilityProvider } from '../../../providers/sdr-utility/sdr-utility';
// declare var JSPath: any;

/**
 * Generated class for the ReviewSubmitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-review-submit',
  templateUrl: 'review-submit.html',
})
export class ReviewSubmitPage {
  Enums: any = Enums;
  header_data: any
  fileName = "ReviewSubmitPage";
  cardToDisplay = '1';
  finalTest = []; finalTestKeys = []
  Photos = []; photosKeys = []; allPhotos = []
  calibrationTest = [];
  path: any;
  currentReport: any; reportId: any; selectedDeviceType: any;
  asFound = {
    head: '', headComment: '', headNT: '', headP: '', headLT: '',
    completeObj: [], completeObjKeys: [], rowWithoutNullColumn: [],
    allColumnsOrder: new AccordionData().allAsfoundColumns[1],
    allColumn: new AccordionData().allAsfoundColumns[0]
  }
  asLeft = {
    headAF: '', headAL: '', headComment: '',
    completeObj: [], completeObjKeys: [], rowWithoutNullColumn: [],
    allColumnsOrder: new AccordionData().allAsfoundColumns[1],
    allAsLeftColumn: new AccordionData().allAsLeftColumns[0],
    allAsLeftRAColumn: new AccordionData().allAsLeftRAColumns[0],
  }
  asLeftRA = {
    headAF: '', headAL: '', headRA: '', headNT: '', headP: '', headLT: '', headComment: '',
    completeObj: [], completeObjKeys: [], rowWithoutNullColumn: [],
    allInnerObj: [], allInnerObjKeys: [],
    allColumnsOrder: new AccordionData().allAsfoundColumns[1],
    // allAsLeftColumn: new AccordionData().allAsLeftColumns[0],
    allAsLeftRAColumn: new AccordionData().allAsLeftRAColumns[0],
  }
  selectedProcess: any;
  constructor(public localService: LocalServiceProvider, public valueProvider: ValueProvider,
    public utilityProvider: UtilityProvider, public appCtrl: App, public navCtrl: NavController, public logger: LoggerProvider,
    public localServicesdr: LocalServiceSdrProvider, public navParams: NavParams, public createReport: SdrPdfReportProvider,
    public syncProvider: SyncProvider, public translate: TranslateService, public sanitizer: DomSanitizer, public attachmentProvider: AttachmentProvider,
    public events: Events, public sdrUtility: SdrUtilityProvider) {
    this.path = cordova.file.dataDirectory;
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad ReviewSubmitPage');
  }
  ionViewDidEnter() {
    if (this.navCtrl.parent && this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.navCtrl.parent ? (this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Review Submit" }) : (this.header_data = { title1: "", title2: "Review Submit" });
    this.cardToDisplay = '1';
    this.currentReport = this.valueProvider.getCurrentReport();
    this.selectedProcess = this.currentReport.SELECTEDPROCESS;
    this.reportId = this.currentReport.REPORTID;
    this.events.publish('user:created', 'SDR');
    // this.reportStatus = this.currentReport.REPORTSTATUS;
    setTimeout(() => {
      this.localServicesdr.getProductID(this.reportId).then((val) => {
        this.selectedDeviceType = val;
        this.getFinalTestData();
        this.getPhotosData();
        this.getCalibrationTestData();
        this.getAsFoundData();
      });
      this.utilityProvider.stopSpinner();
    }, 400);
  }

  /**
     *@Pulkit:06/13/2019
     *Use to Change option value and review page
     */
  selectPage(value) {
    try {
      if (parseInt(value)) {
        this.cardToDisplay = value;
      }
      else {
        this.navCtrl.parent.select(7);
      }
    }
    catch (e) { }
  }

  /**
     *@Pulkit:06/13/2019
     *Use to move on next page
     */
  nextBtnClick() {
    try {
      this.cardToDisplay = (parseInt(this.cardToDisplay) + 1).toString()
    }
    catch (e) { }
  }

  /**
    *@Pulkit:06/13/2019
    *Use to move on previous page
    */
  backBtnClick() {
    try {
      this.cardToDisplay = (parseInt(this.cardToDisplay) - 1).toString()
    }
    catch (e) { }
  }

  openResource(file) {
    this.attachmentProvider.openResource(file, 'reportfiles', Enums.AttachmentType.SDR, this.reportId);
  }

  /**
    *@Pulkit:06/13/2019
    *Use to get & display final test data on review submit page
    */
  getFinalTestData() {
    try {
      let data = [];
      this.finalTest = [];
      this.finalTestKeys = [];
      this.localServicesdr.getActuationdata(this.reportId, 'DEVICETESTACTUATION', 'getFinalTestData').then((response: any[]) => {
        if (response.length > 0) {
          data = response;
          this.finalTest["Air Pressure Test"] = [data[0].AIRPRESSUREPRETEST, data[0].AIRPRESSUREPOSTTEST]
          this.finalTest["Function Test"] = [data[0].FUNCTIONPRETEST, data[0].FUNCTIONPOSTTEST]
          this.finalTest["Hydro Test"] = [data[0].HYDROPRETEST, data[0].HYDROPOSTTEST]
          this.finalTest["Visual Test"] = [data[0].VISUALPRETEST, data[0].VISUALPOSTTEST]
          this.finalTestKeys = Object.keys(this.finalTest);
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getFinalTestData', ' Error in getFinalTestData : ' + JSON.stringify(error));
      });
    }
    catch (e) {
    }
  }

  /**
     *@Pulkit:06/18/2019
     *Use to get & display Photos data on review submit page
     */
  getPhotosData() {
    try {
      this.Photos = [];
      this.allPhotos = [];
      this.photosKeys = [];
      this.localServicesdr.getActuationdata(this.reportId, 'REPORTATTACHMENTS', 'getPhotosData').then((response: any[]) => {
        if (response.length > 0) {
          this.Photos = response;
          this.setAttachmentData();
          // console.log(this.allPhotos);
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getPhotosData', ' Error in getPhotosData : ' + JSON.stringify(error));
      });
    }
    catch (e) {
    }
  }

  /**
   *@Pulkit:06/18/2019
   *Use to set photos data display on review submit page
   */
  setAttachmentData() {
    this.allPhotos.push(this.Photos.filter(item => {
      return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFound;
    }))
    this.allPhotos.push(this.Photos.filter(item => {
      return item.ATTACHMENTTYPE == Enums.PhotosAccordion.CalibrationConfiguration;
    }))
    this.allPhotos.push(this.Photos.filter(item => {
      return item.ATTACHMENTTYPE == Enums.PhotosAccordion.Solution;
    }))
    this.allPhotos.push(this.Photos.filter(item => {
      return item.ATTACHMENTTYPE == Enums.PhotosAccordion.FinalTests;
    }))
  }

  /**
    *@Pulkit:06/13/2019
    *Use to get & display Calibration data on review submit page
    */
  getCalibrationTestData() {
    try {
      this.calibrationTest = []
      let data = []
      this.localServicesdr.getActuationdata(this.reportId, 'CALIBRATIONACTUATION', 'getCalibrationTestData').then((response: any[]) => {
        if (response.length > 0) {
          data = response;
          data.forEach(element => {
            let CTObj = []
            CTObj["Element"] = element.ELEMENT_OTHER ? element.ELEMENT_OTHER : element.CA_ELEMENT;
            CTObj["Option"] = element.OPTION_OTHER ? element.OPTION_OTHER : element.CA_OPTION;
            CTObj["Direction"] = element.DIRECTION_OTHER ? element.DIRECTION_OTHER : element.DIRECTION;
            CTObj["Condition"] = element.CONDITION_OTHER ? element.CONDITION_OTHER : element.CONDITION;
            CTObj["RA"] = element.RECOMMENDEDACTION_OTHER ? element.RECOMMENDEDACTION_OTHER : element.RECOMMENDEDACTION;
            CTObj["Result"] = element.RESULT_OTHER ? element.RESULT_OTHER : element.CA_RESULT;
            this.calibrationTest.push(CTObj);
          });
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getCalibrationTestData', ' Error in getCalibrationTestData : ' + JSON.stringify(error));
      });
    }
    catch (e) {
    }
  }

  /**
     *@Pulkit:06/13/2019
     *Use to get As Found data on review submit page
     */
  getAsFoundData() {
    try {
      let data = []
      let rowKeyData = []
      this.asFound.completeObj = []
      this.asFound.rowWithoutNullColumn = []
      this.asFound.completeObjKeys = []

      this.localServicesdr.getActuationdata(this.reportId, 'ASFOUNDACTUATION', 'getAsFoundData').then((response: any[]) => {
        if (response.length > 0) {
          data = response[0];
          rowKeyData = Object.keys(this.asFound.allColumn);//Object.keys(data)
          rowKeyData.forEach((element) => {
            if (data[element])
              this.asFound.rowWithoutNullColumn[element] = data[element]
          });
          let rowWithoutNullColumnKeys = Object.keys(this.asFound.rowWithoutNullColumn)
          let colObj = []
          rowWithoutNullColumnKeys.forEach(element => {
            if (this.asFound.allColumn[element]) {
              let cVal = this.asFound.allColumn[element];
              colObj = [];
              if (cVal[1]) {
                if (this.asFound.completeObj[cVal[0]]) {
                  colObj = this.asFound.completeObj[cVal[0]]
                }
                if (this.asFound.rowWithoutNullColumn[element + "OT"]) {
                  colObj[cVal[1]] = this.asFound.rowWithoutNullColumn[element + "OT"];
                }
                else {
                  colObj[cVal[1]] = this.asFound.rowWithoutNullColumn[element];
                }
                if (Object.keys(colObj).length)
                  this.asFound.completeObj[cVal[0]] = colObj
              }
              else {
                if (this.asFound.completeObj[cVal[0]]) {
                  colObj = this.asFound.completeObj[cVal[0]]
                }
                if (cVal[0] == "Network Type") {

                  if (element == "N_NETWORKTYPE_AFC") {
                    colObj["Comment"] = this.asFound.rowWithoutNullColumn[element];
                  }
                  if (element == "N_NETWORKTYPE_AFOT") {
                    colObj["As Found"] = this.asFound.rowWithoutNullColumn[element];
                  }
                  else if (element == "N_NETWORKTYPE_AF") {
                    colObj["As Found"] = this.asFound.rowWithoutNullColumn[element];
                  }
                  if (element == "N_NETWORKTYPE_NETWORKTYPE_AFOT") {
                    colObj["Netwok Type"] = this.asFound.rowWithoutNullColumn[element];
                  }
                  else if (element == "N_NETWORKTYPE_NETWORKTYPE_AF") {
                    colObj["Netwok Type"] = this.asFound.rowWithoutNullColumn[element];
                  }
                  if (element == "N_NETWORKTYPE_PROTOCOLS_AFOT") {
                    colObj["Protocols"] = this.asFound.rowWithoutNullColumn[element];
                  }
                  else if (element == "N_NETWORKTYPE_PROTOCOLS_AF") {
                    colObj["Protocols"] = this.asFound.rowWithoutNullColumn[element];
                  }
                  if (element == "N_NETWORKTYPE_LOOPTYPE_AFOT") {
                    colObj["Loop Type"] = this.asFound.rowWithoutNullColumn[element];
                  }
                  else if (element == "N_NETWORKTYPE_LOOPTYPE_AF") {
                    colObj["Loop Type"] = this.asFound.rowWithoutNullColumn[element];
                  }
                }
                else {
                  if ((element.split("_")[element.split("_").length - 1]) == "AFC") {
                    colObj["Comment"] = this.asFound.rowWithoutNullColumn[element];
                  }
                  else if ((element.split("_")[element.split("_").length - 1]) == "AF") {
                    colObj["As Found"] = this.asFound.rowWithoutNullColumn[element];
                  }
                  else if ((element.split("_")[element.split("_").length - 1]) == "AFOT") {
                    colObj["As Found"] = this.asFound.rowWithoutNullColumn[element];
                  }
                }
                if (Object.keys(colObj).length)
                  this.asFound.completeObj[cVal[0]] = colObj
              }
            }
          });
          let requiredOrder = this.asFound.allColumnsOrder[this.selectedDeviceType];
          requiredOrder = requiredOrder.filter(value => -1 !== Object.keys(this.asFound.completeObj).indexOf(value))
          this.asFound.completeObjKeys = requiredOrder;
        }
        this.getSolutionData()
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getAsFoundData', ' Error in getAsFoundData : ' + JSON.stringify(error));
      });
    }
    catch (e) {
    }
  }

  /**
     *@Pulkit:06/13/2019
     *Use to get As found Inner keys on review submit page
     */
  getSubKeysOfAsFound(key) {
    return Object.keys(this.asFound.completeObj[key])
  }
  getHeadOfComponent(key) {
    this.asFound.head = this.asFound.completeObj[key]["As Found"];
    this.asFound.headComment = this.asFound.completeObj[key]["Comment"];

    this.asFound.headNT = this.asFound.completeObj[key]["Netwok Type"];
    this.asFound.headP = this.asFound.completeObj[key]["Protocols"];
    this.asFound.headLT = this.asFound.completeObj[key]["Loop Type"];

  }

  /**
     *@Pulkit:06/13/2019
     *Use to get & display As Left (solution) data on review submit page
     */
  getSolutionData() {
    try {
      let data = []
      let rowKeyData = []
      this.asLeft.rowWithoutNullColumn = []
      this.asLeft.completeObj = [];
      this.asLeft.completeObjKeys = [];
      this.localServicesdr.getActuationdata(this.reportId, 'ASLEFTACTUATION', 'getSolutionData').then((response: any[]) => {
        if (response.length > 0) {
          data = response[0];
          // rowKeyData = Object.keys(data)
          rowKeyData = Object.keys(this.asLeft.allAsLeftColumn);
          rowKeyData.forEach((element) => {
            if (data[element])
              this.asLeft.rowWithoutNullColumn[element] = data[element]
          });
          let rowWithoutNullColumnKeys = Object.keys(this.asLeft.rowWithoutNullColumn)
          let colObj = []
          rowWithoutNullColumnKeys.forEach(element => {
            if (this.asLeft.allAsLeftColumn[element]) {
              let cVal = this.asLeft.allAsLeftColumn[element];
              colObj = [];
              if (cVal[1]) {
                if (this.asLeft.completeObj[cVal[0]]) {
                  colObj = this.asLeft.completeObj[cVal[0]]
                }
                if (this.asLeft.rowWithoutNullColumn[element + "OT"]) {
                  colObj[cVal[1]] = this.asFound.rowWithoutNullColumn[element + "OT"];
                }
                else {
                  colObj[cVal[1]] = this.asLeft.rowWithoutNullColumn[element];
                }
                this.asLeft.completeObj[cVal[0]] = colObj
              }
              else {
                if (this.asLeft.completeObj[cVal[0]]) {
                  colObj = this.asLeft.completeObj[cVal[0]]
                }
                if (cVal[0] == "Network Type") {
                  if (element == "N_NETWORKTYPE_ALC") {
                    colObj["Comment"] = this.asLeft.rowWithoutNullColumn[element];
                  }
                  if (element == "N_NETWORKTYPE_ALOT") {
                    colObj["As Left"] = this.asLeft.rowWithoutNullColumn[element];
                  }
                  else if (element == "N_NETWORKTYPE_AL") {
                    colObj["As Left"] = this.asLeft.rowWithoutNullColumn[element];
                  }
                  if (element == "N_NETWORKTYPE_PROTOCOLS_ALOT") {
                    colObj["Protocols"] = this.asLeft.rowWithoutNullColumn[element];
                  }
                  else if (element == "N_NETWORKTYPE_PROTOCOLS_AL") {
                    colObj["Protocols"] = this.asLeft.rowWithoutNullColumn[element];
                  }
                  if (element == "N_NETWORKTYPE_LOOPTYPE_ALOT") {
                    colObj["Loop Type"] = this.asLeft.rowWithoutNullColumn[element];
                  }
                  else if (element == "N_NETWORKTYPE_LOOPTYPE_AL") {
                    colObj["Loop Type"] = this.asLeft.rowWithoutNullColumn[element];
                  }
                }
                else {
                  if ((element.split("_")[element.split("_").length - 1]) == "ALC") {
                    colObj["Comment"] = this.asLeft.rowWithoutNullColumn[element];
                  }
                  else if ((element.split("_")[element.split("_").length - 1]) == "AL") {
                    colObj["As Left"] = this.asLeft.rowWithoutNullColumn[element];
                  }
                  else if ((element.split("_")[element.split("_").length - 1]) == "ALOT") {
                    colObj["As Left"] = this.asLeft.rowWithoutNullColumn[element];
                  }
                }
                this.asLeft.completeObj[cVal[0]] = colObj
              }
            }
          });
          let requiredOrder = this.asLeft.allColumnsOrder[this.selectedDeviceType];
          requiredOrder = requiredOrder.filter(value => -1 !== Object.keys(this.asLeft.completeObj).indexOf(value))
          this.asLeft.completeObjKeys = requiredOrder;
        }
        this.getSolutionRAData();
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getSolutionData', ' Error in getSolutionData : ' + JSON.stringify(error));
      });
    }
    catch (e) {
    }
  }

  /**
      *@Pulkit:06/13/2019
      *Use to get & display As Left Recommended Action (solution) data on review submit page
      */
  getSolutionRAData() {
    try {
      let data = [];
      let rowKeyData = [];
      this.asLeftRA.rowWithoutNullColumn = [];
      this.asLeftRA.completeObj = [];
      this.asLeftRA.completeObjKeys = [];
      this.asLeftRA.allInnerObj = [];
      this.asLeftRA.allInnerObjKeys = [];
      this.localServicesdr.getActuationdata(this.reportId, 'ASLEFTRAACTUATION', 'getSolutionRAData').then((response: any[]) => {
        if (response.length > 0) {
          data = response[0];
          //rowKeyData = Object.keys(data)
          rowKeyData = Object.keys(this.asLeftRA.allAsLeftRAColumn);
          rowKeyData.forEach((element) => {
            if (data[element])
              this.asLeftRA.rowWithoutNullColumn[element] = data[element]
          });
          let rowWithoutNullColumnKeys = Object.keys(this.asLeftRA.rowWithoutNullColumn)
          let colObj = []
          rowWithoutNullColumnKeys.forEach(element => {
            if (this.asLeftRA.allAsLeftRAColumn[element]) {
              let cVal = this.asLeftRA.allAsLeftRAColumn[element];
              colObj = [];
              if (cVal[1]) {
                if (this.asLeftRA.completeObj[cVal[0]]) {
                  colObj = this.asLeftRA.completeObj[cVal[0]]
                }
                if (this.asLeftRA.rowWithoutNullColumn[element + "OT"]) {
                  colObj[cVal[1]] = this.asLeftRA.rowWithoutNullColumn[element + "OT"]
                }
                else {
                  colObj[cVal[1]] = this.asLeftRA.rowWithoutNullColumn[element]
                }
                this.asLeftRA.completeObj[cVal[0]] = colObj

              }
              else {
                if (this.asLeftRA.completeObj[cVal[0]]) {
                  colObj = this.asLeftRA.completeObj[cVal[0]]
                }
                if ((element.split("_")[element.split("_").length - 1]) == "RAC") {
                  colObj["Comment"] = this.asLeftRA.rowWithoutNullColumn[element];
                }
                else if ((element.split("_")[element.split("_").length - 1]) == "RA") {
                  colObj["Recommended Action"] = this.asLeftRA.rowWithoutNullColumn[element];
                }
                else if ((element.split("_")[element.split("_").length - 1]) == "RAOT") {
                  colObj["Recommended Action"] = this.asLeftRA.rowWithoutNullColumn[element];
                }
                this.asLeftRA.completeObj[cVal[0]] = colObj
              }
            }
          });
          let AFKeys = Object.keys(this.asFound.completeObj)
          let ALKeys = Object.keys(this.asLeft.completeObj)
          let RAKeys = Object.keys(this.asLeftRA.completeObj)
          let allKeys = (AFKeys.concat(ALKeys).concat(RAKeys));
          allKeys = allKeys.filter(function (item, pos) {
            return allKeys.indexOf(item) == pos;
          });
          allKeys.forEach(AK => {
            let AFInnerKeys = Object.keys(this.asFound.completeObj[AK] ? this.asFound.completeObj[AK] : [])
            let ALInnerKeys = Object.keys(this.asLeft.completeObj[AK] ? this.asLeft.completeObj[AK] : [])
            let RAInnerKeys = Object.keys(this.asLeftRA.completeObj[AK] ? this.asLeftRA.completeObj[AK] : [])
            let AllKeys = (AFInnerKeys.concat(ALInnerKeys).concat(RAInnerKeys));
            AllKeys = AllKeys.filter(function (item, pos) {
              return AllKeys.indexOf(item) == pos;
            });
            this.asLeftRA.allInnerObj[AK] = AllKeys;
          });
          // this.asLeftRA.allInnerObjKeys = Object.keys(this.asLeftRA.allInnerObj)

          let requiredOrder = this.asLeftRA.allColumnsOrder[this.selectedDeviceType];
          requiredOrder = requiredOrder.filter(value => -1 !== Object.keys(this.asLeftRA.allInnerObj).indexOf(value))
          this.asLeftRA.allInnerObjKeys = requiredOrder;

          // console.log(this.asFound.completeObj)
          // console.log(this.asLeftRA.allInnerObjKeys);
        }
        else {
          let AFKeys = Object.keys(this.asFound.completeObj)
          let ALKeys = Object.keys(this.asLeft.completeObj)
          let RAKeys = Object.keys(this.asLeftRA.completeObj)
          let allKeys = (AFKeys.concat(ALKeys).concat(RAKeys));
          allKeys = allKeys.filter(function (item, pos) {
            return allKeys.indexOf(item) == pos;
          });
          allKeys.forEach(AK => {
            let AFInnerKeys = Object.keys(this.asFound.completeObj[AK] ? this.asFound.completeObj[AK] : [])
            let ALInnerKeys = Object.keys(this.asLeft.completeObj[AK] ? this.asLeft.completeObj[AK] : [])
            let RAInnerKeys = Object.keys(this.asLeftRA.completeObj[AK] ? this.asLeftRA.completeObj[AK] : [])
            let AllKeys = (AFInnerKeys.concat(ALInnerKeys).concat(RAInnerKeys));
            AllKeys = AllKeys.filter(function (item, pos) {
              return AllKeys.indexOf(item) == pos;
            });
            this.asLeftRA.allInnerObj[AK] = AllKeys;
          });
          // this.asLeftRA.allInnerObjKeys = Object.keys(this.asLeftRA.allInnerObj)

          let requiredOrder = this.asLeftRA.allColumnsOrder[this.selectedDeviceType];
          requiredOrder = requiredOrder.filter(value => -1 !== Object.keys(this.asLeftRA.allInnerObj).indexOf(value))
          this.asLeftRA.allInnerObjKeys = requiredOrder;

          // console.log(this.asFound.completeObj)
          // console.log(this.asLeftRA.allInnerObjKeys);
        }
      }).catch((error: any) => {
        // console.log(error);
        this.logger.log(this.fileName, 'getSolutionRAData', ' Error in getSolutionRAData : ' + JSON.stringify(error));
      });
    }
    catch (e) {
      // console.log(e);
    }
  }

  /**
      *@Pulkit:06/13/2019
      *Use to set solution common header data on review submit page
      */
  getHeadOfSolutionComponent(key) {
    this.asLeftRA.headAF = this.asFound.completeObj[key] ? (this.asFound.completeObj[key]["As Found"] ? this.asFound.completeObj[key]["As Found"] : '') : '';
    this.asLeftRA.headNT = this.asFound.completeObj[key] ? (this.asFound.completeObj[key]["Netwok Type"] ? this.asFound.completeObj[key]["Netwok Type"] : '') : '';
    this.asLeftRA.headP = this.asLeft.completeObj[key] ? (this.asLeft.completeObj[key]["Protocols"] ? this.asLeft.completeObj[key]["Protocols"] : '') : '';
    this.asLeftRA.headLT = this.asLeft.completeObj[key] ? (this.asLeft.completeObj[key]["Loop Type"] ? this.asLeft.completeObj[key]["Loop Type"] : '') : '';
    this.asLeftRA.headAL = this.asLeft.completeObj[key] ? (this.asLeft.completeObj[key]["As Left"] ? this.asLeft.completeObj[key]["As Left"] : '') : '';
    this.asLeftRA.headRA = this.asLeftRA.completeObj[key] ? (this.asLeftRA.completeObj[key]["Recommended Action"] ? this.asLeftRA.completeObj[key]["Recommended Action"] : '') : '';
    this.asLeftRA.headComment = this.asLeft.completeObj[key] ? (this.asLeft.completeObj[key]["Comment"] ? this.asLeft.completeObj[key]["Comment"] : '') : '';
  }

  sendMail() {
    this.GeneratePdf('sendMail')
  }

  GeneratePdf(isMail?) {
    let langCode = "en-gb";
    if (this.valueProvider.getUserPreferences()[0].FSR_Languages.split(",").length > 1) {
      this.localService.getFSREnabledLanguages().then((SDRPrintLanguages: any) => {
        let params = { 'SdrlanguageSelector': true, 'printLangList': SDRPrintLanguages, 'langLOV': this.valueProvider.getUserPreferences()[0].FSR_Languages.split(",") };
        this.showLangModal(params, isMail, langCode);
      });
    } else {
      // let pdfFileName: any = '';
      this.utilityProvider.showSpinner();
      this.createReport.generatePdf(true, langCode).then((pdfFileName) => {
        this.openPDF(pdfFileName, isMail);
        this.utilityProvider.stopSpinner();
      }).catch((error) => {
        // console.log('GeneratePdf", "Error Occured === ', JSON.stringify(error));
        this.logger.log(this.fileName, "GeneratePdf", "Error Occured: " + JSON.stringify(error));
        this.utilityProvider.stopSpinner();
        this.utilityProvider.presentToast(Enums.Messages.PDF_Failed, 4000, 'top', 'feedbackToast');
      });
    }
  }

  showLangModal(params, isMail, langCode) {
    let languageModal = this.utilityProvider.showModal("NotesModalPage", params, { enableBackdropDismiss: false, cssClass: 'Language-Selector-Modal' });
    languageModal.present();
    languageModal.onDidDismiss(data => {
      if (data) {
        // let pdfFileName: any = '';
        langCode = data;
        // 01/10/2018 Gurkirat Singh: PDF will be generated on the fly even if it is completed.
        // if (this.currentReport.Status != Enums.ReportStatus.Completed) {
        this.utilityProvider.showSpinner();
        this.createReport.generatePdf(true, data).then((pdfFileName) => {
          this.openPDF(pdfFileName, isMail);
          this.utilityProvider.stopSpinner();
        }
        )
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
    // }
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
        resolve(contactsEmail)
      });
    });
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

  // 07/10/2019 Gurkirat Singh : Moved submitReport function to the new SDR Utility Provider


  gotofcr() {
     this.navToFCRFromSubmitReport();
    // this.events.publish('goToFCR')
  }

  /**
   * 01-09-2019 -- Mansi Arora -- navigate to Debrief on click of FCR button
   * calls value provider to get current report
   * set task details and opens the debrief page
   * @memberOf WorkFlowPage
  */
  navToFCRFromSubmitReport() {
    // console.log(currentReport);
    this.localService.getStandaloneJobById(this.valueProvider.getCurrentReport().REPORTID).then((task: any) => {
      if (task.length == 1) {
        this.valueProvider.setTask(task[0]).then(() => {
          this.valueProvider.setTaskId(task[0].Task_Number);
          this.valueProvider.setTaskObject(task[0]);
          this.valueProvider.setVerify(false);
          this.valueProvider.setIsCustomerSelected(false);
          this.valueProvider.setIsSummarySelected(false);
          if (task[0].StatusID == Enums.Jobstatus.Completed_Awaiting_Review) {
            // 03-28-2019 Gurkirat Singh : Changed the navigation according to status to resolve double headers
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
    // 02/18/2019 -- RadheShyam -- removed old unused code , directly push DebirefPage on zeroth index
    this.appCtrl.getRootNavs()[0].push("DebriefPage");
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

  // openMailClent(base64, filename) {
  //   try {
  //     let base64parts = base64.split(',');
  //     if (base64parts[1] != "") {
  //       this.getToContacts().then((toContacts: any) => {
  //         this.localService.getCustomer(this.valueProvider.getTaskId()).then((custEmail: any) => {
  //           if (custEmail && custEmail.Email != '') {
  //             toContacts = toContacts.concat(custEmail.Email);
  //           }
  //           let compatibleAttachment = "base64:" + filename + "//" + base64parts[1];
  //           this.emailComposer.open({
  //             to: this.currentReport ? (this.currentReport.SELECTEDPROCESS != Enums.Selected_Process.SDR ? this.removeDuplicates(toContacts) : '') : ' ',
  //             subject: 'Report',
  //             body: '',
  //             attachments: [compatibleAttachment]
  //           }).then((res) => {
  //             this.logger.log(this.fileName, 'emailComposer openMailClent', res);;
  //           }).catch((error) => {
  //             this.logger.log(this.fileName, 'emailComposer openMailClent Error', error);
  //           });
  //         });
  //       });
  //     }
  //     else {
  //       let msg = 'Unable to attach PDF!!!';
  //       this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
  //     }
  //   } catch (error) {
  //     this.logger.log(this.fileName, 'openMailClent', error);
  //     let msg = 'Unable to attach PDF!!!';
  //     this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
  //   };
  // }

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


  ionViewWillLeave() {
    // this.navCtrl.parent.viewCtrl.instance.header_data = null;
    //this.header_data = null;
  }
}
