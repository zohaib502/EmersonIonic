import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController, Events } from "ionic-angular";
import { LocalServiceSdrProvider } from "../../../../providers/local-service-sdr/local-service-sdr";
import { LoggerProvider } from "../../../../providers/logger/logger";
import * as Enums from "../../../../enums/enums";
import { UtilityProvider } from "../../../../providers/utility/utility";
import { ValueProvider } from "../../../../providers/value/value";
import { TranslateService } from "@ngx-translate/core";
import { AccordionData } from '../../../../beans/AccordionData'
@IonicPage()
@Component({
  selector: "page-iso-calibration",
  templateUrl: "iso-calibration.html",
})
export class IsoCalibrationPage {
  expandAccordion: boolean;
  allCalibrtionValue: any = [];
  fileName = "IsoCalibrationPage";
  Enums: any = Enums;
  calsolKey: any;
  calibrationObj: any = {};
  calibrationSolObj: any = {};
  arr: Array<String> = ["CalibrationAsFoundAsLeftTravelUnitOfMeasurementFlowIsolation", "CalibrationAsFoundAsLeftBenchSetUnitOfMeasurementFlowIsolation", "CalibrationAsFoundAsLeftSignalOpenUnitOfMeasurementFlowIsolation", "CalibrationAsFoundAsLeftSignalClosedUnitOfMeasurementFlowIsolation", "SupplyUOM", "FailActionFlowIsolation", "TravelUOMFlowIsolation"];
  parentReferenceID: any;
  selectedProcess: any;
  bottomNavBtn: any;

  isCalibrationRecordExists: boolean = false;
  isCalibrationSolRecordExists: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public localservicesdr: LocalServiceSdrProvider, public translate: TranslateService, public logger: LoggerProvider, public utilityProvider: UtilityProvider,
    public valueProvider: ValueProvider, public events: Events) {
    this.expandAccordion = false;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad IsoCalibrationPage");
  }

  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });

    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Calibration" };
    if (this.valueProvider.getCurrentReport()) {
      this.calibrationObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
      this.getDeviceID();

    }
    this.getCalibrationIso();
    this.getCalibrationSol();
    // this.getCalibrationSolKeys();
  }
  expandAcc() {
    if (this.calibrationObj.CAL_NA == "true") {
      return;
    }
    else {
      if (this.expandAccordion == false) {
        this.expandAccordion = true;
      }
      else {
        this.expandAccordion = false;
      }
    }
  }
  showLovCalibration() {
    this.localservicesdr.getLookups(this.arr).then((res: any) => {
      this.allCalibrtionValue = [];
      this.allCalibrtionValue = JSON.parse(JSON.stringify(res));

    }).catch((error: any) => {
      this.logger.log(this.fileName, "showLovCalibration", " Error in showLovCalibration : " + JSON.stringify(error));
    })
  }
  getDeviceID() {
    this.localservicesdr.getDEVICEIDForFlowIsolation(this.calibrationObj.REPORTID).then((val) => {
      this.parentReferenceID = val;
      this.showLovCalibration();

    })
  }
  searchModal(data, key) {
    let dataArray: any = [];
    let modalKey
    dataArray = this.allCalibrtionValue.filter((item) => {
      return item.LookupType == data
    })
    if (key == "CAL_BENCH_UOM") {
      modalKey = "CAL_BENCHSET"
    }
    else {
      modalKey = key.replace("_UOM", "");
    }
    if (!this.removeNovalue(modalKey)) {
      dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
    }
    dataArray.push({ "LookupID": -1, "LookupValue": "Other" });
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: "isocal" }, { enableBackdropDismiss: true, cssClass: "cssSearchModalPage" });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        this.calibrationObj[key] = data.LookupValue;
      }
      data = null;
    });
  }
  insertCalibrationData() {
    this.localservicesdr.insertOrUpdateData(this.calibrationObj, this.isCalibrationRecordExists, 'CAL_PK_ID', 'CALIBRATIONFLOWISOLATION').then((res): any => {
      if (res) {
        //this.getCalibrationSolKeys();
      }
    }).catch((error: any) => {

      this.logger.log(this.fileName, 'insertCalibrationData', ' Error in insertOrUpdateData : ' + JSON.stringify(error));
    });
  }

  insertSolutionCaliData() {
    //delete this.calibrationSolObj.
    let solCalObj = JSON.parse(JSON.stringify(this.calibrationObj));
    delete solCalObj.CAL_PK_ID
    delete solCalObj.CAL_TRAVEL;
    delete solCalObj.CAL_SIGNALOPEN;
    delete solCalObj.CAL_BENCHSET;
    delete solCalObj.CAL_SIGNALCLOSED;
    delete solCalObj.CAL_SUPPLY;
    delete solCalObj.CAL_FAILACTION;
    delete solCalObj.CAL_FAILACTION_OT;
    if (this.calibrationSolObj) {
      solCalObj.CALSOL_PK_ID = this.calibrationSolObj.CALSOL_PK_ID;
    }
    Object.keys(solCalObj).forEach(element => {
      if (!this.calibrationSolObj[element]) {
        solCalObj[element] = this.calibrationObj[element];
      }
      else {
        solCalObj[element] = this.calibrationSolObj[element];
      }
    });
    this.localservicesdr.insertOrUpdateData(solCalObj, this.isCalibrationSolRecordExists, 'CALSOL_PK_ID', 'CALIBRATIONSOLUTIONFLOWISOLATION').then((res): any => {
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'insertSolutionCaliData', ' Error in insertOrUpdateData : ' + JSON.stringify(error));
    });
  }

  getCalibrationIso() {
    try {
      this.localservicesdr.getActuationdata(this.calibrationObj.REPORTID, 'CALIBRATIONFLOWISOLATION', 'getCalibrationIso').then((res: any[]) => {
        // console.log(res);
        if (res && res.length) {
          this.isCalibrationRecordExists = true;
          this.calibrationObj = JSON.parse(JSON.stringify(res[0]));

        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getCalibrationIso', ' Error in getActuationdata : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.logger.log(this.fileName, "getCalibrationIso", "Error: " + error.message);
    }
  }
  getCalibrationSol() {
    try {
      this.localservicesdr.getActuationdata(this.calibrationObj.REPORTID, 'CALIBRATIONSOLUTIONFLOWISOLATION', 'getCalibrationSol').then((res: any[]) => {
        // console.log(res);
        if (res && res.length) {
          this.isCalibrationSolRecordExists = true;
          // let solCalObj = JSON.parse(JSON.stringify(res[0].CALSOL_PK_ID));
          // this.calsolKey = JSON.parse(JSON.stringify(res[0].CALSOL_PK_ID));
          this.calibrationSolObj = res[0];
          //this.CAL_PK_ID = this.calibrationObj.CAL_PK_ID;
          //  getisoCaldata

        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getCalibrationSol', ' Error in getActuationdata : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.logger.log(this.fileName, "getCalibrationSol", "Error: " + error.message);
    }
  }
  // getCalibrationSolKeys() {
  //   try {
  //     this.localservicesdr.getisoCaldata(this.calibrationObj.REPORTID, 'CALIBRATIONFLOWISOLATION', 'getCalibrationSol').then((res: any[]) => {
  //       if (res && res.length) {
  //         this.calibrationSolObj = JSON.parse(JSON.stringify(res[0]));

  //       }
  //       this.insertSolutionCaliData()
  //     }).catch((error: any) => {


  confirmAlert(isChecked, accordionName, key) {
    if (isChecked) {
      if (this.checkIfAccordionHasValue(accordionName)) {
        let alert = this.alertCtrl.create({
          title: this.translate.instant("Confirm ?"),
          message: this.translate.instant("You will lose the data of this accordion."),
          enableBackdropDismiss: false,
          buttons: [
            {
              text: this.translate.instant('Cancel'),
              handler: () => {
                this.calibrationObj[key] = false;
              }
            },
            {
              text: this.translate.instant('OK'),
              handler: () => {
                this.expandAccordion = false;
                this.closeAndClearAccordion(accordionName, isChecked);
                this.calibrationObj.CAL_NA = "true";
              }
            }
          ]
        });
        alert.present();
      }
      else {
        this.calibrationObj.CAL_NA = "true";
        this.closeAndClearAccordion(accordionName, false);
      }
    }
    else {
      this.calibrationObj.CAL_NA = "false";
    }
  }

  gotofcr() {
    if (this.checkIfValid() && this.isValidated()) {
      this.insertCalibrationData();
      setTimeout(() => {
        this.events.publish("goToFCR");
      }, 100);
    } else {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }

  }

  checkIfAccordionHasValue(accordionName) {
    let hasValue = false;
    hasValue = this.checkifHasValues(accordionName);
    return hasValue;
  }

  closeAndClearAccordion(accordionName, isChecked) {
    let accordionData = new AccordionData();
    for (let key in accordionData[accordionName]) {
      let val: any = accordionData[accordionName][key];
      this.calibrationObj[val] = isChecked ? "" : this.calibrationObj[val];
    }
  }

  checkifHasValues(accordionKey) {
    this.expandAccordion = false;
    let accordionData = new AccordionData();
    let hasValue = false;
    for (let key in accordionData[accordionKey]) {
      let val: any = accordionData[accordionKey][key];
      if (this.utilityProvider.isNotNull(this.calibrationObj[val])) {
        hasValue = true;
        break;
      }
    }
    return hasValue;
  }


  redirect(value) {
    if (this.checkIfValid() && this.isValidated()) {
      this.utilityProvider.bottomNavigation(this.navCtrl, value);
    }
    else {
      this.utilityProvider.presentAlert();
    }
  }

  errorObj: any = [];
  ionViewWillLeave() {
    if (this.checkIfValid() && this.isValidated()) {
      this.insertCalibrationData();
      this.insertSolutionCaliData();
    } else {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }
  }

  checkIfValid() {
    this.errorObj = [];
    let isValid = true;
    let jsonObj = this.setJson();
    for (let i = 0; i < jsonObj.length; i++) {
      //08/14/2019 -- Mayur Varshney -- apply condition to check if No Value is selected in UOM then field should be empty
      if ((this.calibrationObj[jsonObj[i][0]] || (this.calibrationObj[jsonObj[i][1]] && this.calibrationObj[jsonObj[i][1]] != "No Value")) || this.calibrationObj[jsonObj[i][0]] && this.calibrationObj[jsonObj[i][1]] == "No Value") {
        if (!this.calibrationObj[jsonObj[i][0]]) {
          this.errorObj[jsonObj[i][0]] = true;
          isValid = false;
        }
        //08/14/2019 -- Mayur Varshney -- show red box on UOM if "No Value" is selected in UOM and field should be empty
        if ((!this.calibrationObj[jsonObj[i][1]]) || (this.calibrationObj[jsonObj[i][0]] && this.calibrationObj[jsonObj[i][1]] == "No Value")) {
          this.errorObj[jsonObj[i][1]] = true;
          isValid = false;
        }
        
        // if (this.calibrationObj[jsonObj[i][1]] == "No Value") {
        //   isValid = true;
        // }
      }
    }
    return isValid;
  }

  removeNovalue(key) {
    let isValid = false;
    let jsonObj = this.setJson();
    for (let i = 0; i < jsonObj.length; i++) {
      if (this.calibrationObj[key]) {
        isValid = true;
      }
    }
    return isValid;
  }
  setJson() {
    return [["CAL_TRAVEL", "CAL_TRAVEL_UOM"], ["CAL_SIGNALOPEN", "CAL_SIGNALOPEN_UOM"], ['CAL_BENCHSET', 'CAL_BENCH_UOM'], ['CAL_SIGNALCLOSED', 'CAL_SIGNALCLOSED_UOM'], ['CAL_SUPPLY', 'CAL_SUPPLY_UOM']];
  }



  isValidated() {
    this.errorObj = [];
    let accordionData = new AccordionData();
    for (let key in accordionData.isoCalibration) {
      let element: any = accordionData.isoCalibration[key];
      if (this.calibrationObj[element] == 'Other') {
        if (!this.utilityProvider.isNotNull(this.calibrationObj[element + "_OT"])) {
          this.errorObj.push(element + "_OT");
        }
      }

    }
    return this.errorObj.length == 0;
  }
}
