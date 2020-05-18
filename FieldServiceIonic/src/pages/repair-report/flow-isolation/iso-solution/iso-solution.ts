import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { AccordionData } from '../../../../beans/AccordionData';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { ValueProvider } from '../../../../providers/value/value';
import * as Enums from '../../../../enums/enums';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { TranslateService } from '@ngx-translate/core';
import { LoggerProvider } from '../../../../providers/logger/logger';
/**
 * Generated class for the IsoSolutionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-iso-solution',
  templateUrl: 'iso-solution.html',
})
export class IsoSolutionPage {
  errorObj: any = [];
  solutionObj: any = {}; accessoriesObj: any = {};
  expandOuterAccordion: any = {};
  toggleAllaccordion: boolean = false;
  selectedProcess: any; Enums: any = Enums;
  deviceId: any; allLOVsByDevice: any = []; allLOVsByDeviceAndDisplayOrder: any = []; calSolutionLov: any = [];
  accordionData = new AccordionData();
  isNotValidated = false; recordExists: boolean = false; toggleDisable = false; isAccessories = true;
  modelLOVs = []; isModelLOVsE = []; nextPageText = 'Calibration';
  fileName: any = 'IsoAsFoundPage';
  calibrationSolObj: any = {};
  arr: Array<String> = ["CalibrationAsFoundAsLeftTravelUnitOfMeasurementFlowIsolation", "CalibrationAsFoundAsLeftBenchSetUnitOfMeasurementFlowIsolation", "CalibrationAsFoundAsLeftSignalOpenUnitOfMeasurementFlowIsolation", "CalibrationAsFoundAsLeftSignalClosedUnitOfMeasurementFlowIsolation", "SupplyUOM", "FailActionFlowIsolation", "TravelUOMFlowIsolation"];
  isCalibrationSolRecordExists: boolean = false;
  bottomNavBtn: any;

  constructor(public navCtrl: NavController, public logger: LoggerProvider, public translate: TranslateService, public alertCtrl: AlertController, public utilityProvider: UtilityProvider, public valueProvider: ValueProvider, public events: Events, public navParams: NavParams, public localServiceSdr: LocalServiceSdrProvider, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IsoAsFoundPage');
  }

  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });

    this.expandOuterAccordion = {};
    this.toggleAllaccordion = false;

    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Solution" };
    if (this.valueProvider.getCurrentReport()) {
      this.solutionObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.calibrationSolObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
      console.log(this.selectedProcess);
      this.getDeviceID();
    }
    setTimeout(() => {
      this.getSolutionData();
      this.getAccessoriesData();
      this.showLovCalibration();
      this.getCalibrationSol();
    }, 100);

  }

  // checkNextPage() {
  //   let page = Enums.FlowIsolationProductId[this.deviceId];
  //   if (page == 'Instrument' || page == 'Controller') {
  //     this.nextPageText = 'Final Inspection';
  //   }
  //   else if (page == 'TrimOnly') {
  //     this.nextPageText = 'Optional';
  //   }
  //   else{
  //     this.nextPageText = 'Test Data';
  //   }
  // }

  goToFcr() {
    if (this.checkIfNotValidated() || !(this.checkIfValid() && this.isValidated())) {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }
    else {
      this.saveData();
      this.insertSolutionCaliData();
      setTimeout(() => {
        this.events.publish("goToFCR");
      }, 50);
    }
  }

  expandOuter(key) {
    let json = this.setJson()[Enums.FlowIsolationProductId[this.deviceId]];
    if (!json[key] || json[key]=='false') {
      if (!this.toggleAllaccordion) {
        this.expandOuterAccordion[key] = !this.expandOuterAccordion[key];
        Object.keys(this.expandOuterAccordion).forEach(element => {
          if (element != key) {
            this.expandOuterAccordion[element] = false;
          }
        });
      } else {
        this.expandOuterAccordion[key] = !this.expandOuterAccordion[key];
      }
    }
    this.setExpandCollapseAccordion();
  }

  setExpandCollapseAccordion() {
    let hasValue = false;
    for (let key in this.expandOuterAccordion) {
      if (this.expandOuterAccordion[key]) {
        hasValue = true;
        break
      }
    }
    if (!hasValue) {
      this.toggleAllaccordion = false
    }
  }

  toggleAccordion() {
    let json = this.setJson()[Enums.FlowIsolationProductId[this.deviceId]];
    let jsonKeys = Object.keys(json);
    if (this.toggleAllaccordion) {
      jsonKeys.forEach(val => {
        if (!json[val] || json[val] == 'false')
          this.expandOuterAccordion[val] = true;
      });
    }
    else {
      jsonKeys.forEach(val => {
        this.expandOuterAccordion[val] = false;
      });
    }
  }
 
  setConstructionChangeNo(){
    this.toggleAllaccordion=false;
  }

  setJson() {
    let json = {
      "ControlValve":
      {
        "BodyCV": this.solutionObj.CV_BODY_NA,
        "ActuatorCV": this.solutionObj.CV_ACTUATOR_NA,
        "PositionerCV": this.solutionObj.CV_POSITIONER_NA,
        "AccessoriesCV": this.solutionObj.CV_ACCESSORIES_NA,
      },
      "Isolation":
      {
        "BodyISO": this.solutionObj.ISO_BODY_NA,
        "ActuatorISO": this.solutionObj.ISO_ACTUATOR_NA,
        "PositionerISO": this.solutionObj.ISO_POSITIONER_NA,
        "AccessoriesISO": this.solutionObj.ISO_ACCESSORIES_NA,
      },
      "Controller":
      {
        "ControllerCTR": this.solutionObj.CTR_CONTROLLER_NA,
      },
      "Instrument":
      {
        "PositionerINS": this.solutionObj.INS_POSITIONER_NA,
        "AccessoriesINS": this.solutionObj.INS_ACCESSORIES_NA,
      },
      "LevelTroll":
      {
        "LevelLT": this.solutionObj.LT_LEVEL_NA,
        "InstrumentLT": this.solutionObj.LT_INSTRUMENT_NA,
        "AccessoriesLT": this.solutionObj.LT_ACCESSORIES_NA,
      },
      "Regulator":
      {
        "BodyREG": this.solutionObj.REG_BODY_NA,
        "PilotREG": this.solutionObj.REG_PILOT_NA,
        "MVREG": this.solutionObj.REG_MV_NA,
      },
      "TrimOnly":
      {
        "BodyTO": this.solutionObj.TO_BODY_NA,
      },
    }
    return json;
  }

  getDeviceID() {
    this.localServiceSdr.getDEVICEIDForFlowIsolation(this.solutionObj.REPORTID).then((val) => {
      this.deviceId = val;
      this.getLOVs();
      // this.checkNextPage();
    }
    )
  }

  redirect(value) {
    if (this.checkIfValid() && this.isValidated()) {
      this.utilityProvider.bottomNavigation(this.navCtrl, value);
    }
    else {
      this.utilityProvider.presentAlert();
    }
  }

  getLOVs() {
    let arr = this.accordionData.AF_LOVs[Enums.FlowIsolationProductId[this.deviceId]];
    this.localServiceSdr.getLookups(arr).then((item) => {
      this.allLOVsByDevice = [];
      this.allLOVsByDevice = JSON.parse(JSON.stringify(item));
    })
    this.localServiceSdr.getLookupsByDisplayOrder(arr).then((item) => {
      this.allLOVsByDeviceAndDisplayOrder = [];
      this.allLOVsByDeviceAndDisplayOrder = JSON.parse(JSON.stringify(item));
    })

  }

  searchModal(isRequired, data, key, bodyModel?) {
    let dataArray: any = [];
    if (!bodyModel || bodyModel == 'MAKE') {
      // this.modelLOVs = [];
      if (!isRequired) {
        dataArray = this.filterData(dataArray, data, this.allLOVsByDevice)
        dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
      }
      else {
        dataArray = this.filterData(dataArray, data, this.allLOVsByDeviceAndDisplayOrder)
      }
      dataArray.push({ "LookupID": -1, "LookupValue": "Other" });
    }
    else if (bodyModel == 'MODEL') {
      dataArray = this.modelLOVs[key];
    }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: 'jobids' }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(element => {
      if (element != null) {
        let modelKey = key.replace("_MAKE", "_MODEL");
        this.solutionObj[key] = element.LookupValue;
        if (key == 'ACCESSORIES') { this.isAccessories = true; }
        if (bodyModel == 'MAKE') {
          this.modelLOVs[modelKey] = this.filterModelData(this.modelLOVs[modelKey], element)
          if (!this.modelLOVs[modelKey].length) {
            this.isModelLOVsE[modelKey] = false;
            this.solutionObj[modelKey] = "Other";
            this.solutionObj[key.replace("_MAKE", "_MODEL_OT")] = "";
          }
          else {
            this.isModelLOVsE[modelKey] = true;
            this.solutionObj[modelKey] = "";
            this.solutionObj[key.replace("_MAKE", "_MODEL_OT")] = "";
            this.modelLOVs[modelKey].unshift({ "LookupID": -2, "LookupValue": "No Value" });
            this.modelLOVs[modelKey].push({ "LookupID": -1, "LookupValue": "Other" });
          }

        }
      }
      element = null;
    });
  }

  filterData(dataArray, data, arrayToFilter) {
    dataArray = arrayToFilter.filter((item) => {
      return item.LookupType == data
    })
    return dataArray;
  }

  filterModelData(dataArray, arrayToFilter) {
    dataArray = this.allLOVsByDeviceAndDisplayOrder.filter((item) => {
      return item.ParentID == arrayToFilter.ID
    })
    return dataArray;
  }

  confirmAlert(isChecked, accordionName, key) {
    if (isChecked) {
      if (this.checkIfHasValues(accordionName)) {
        let alert = this.alertCtrl.create({
          title: this.translate.instant("Confirm ?"),
          message: this.translate.instant("You will lose the data of this accordion."),
          buttons: [
            {
              text: this.translate.instant('Cancel'),
              handler: () => {
                this.solutionObj[key] = false;
              }
            },
            {
              text: this.translate.instant('OK'),
              handler: () => {
                this.expandOuterAccordion[accordionName] = false;
                this.setToggleAccordion();
                this.closeAndClearAccordion(accordionName, isChecked);
              }
            }
          ]
        });
        alert.present();
      } else {
        this.setToggleAccordion();
        this.expandOuterAccordion[accordionName] = false
      }
    }
    else {
      if (accordionName == 'ActuatorCV') {
        this.solutionObj.CV_ACTUATOR_HANDWHEEL = "None";
      }
      this.toggleDisable = false;
    }
  }

  setToggleAccordion() {
    let json = this.setJson()[Enums.FlowIsolationProductId[this.deviceId]];
    let hasValue = false;
    for (let key in json) {
      if (!this.utilityProvider.isNotNull(json[key]) || json[key] == 'false') {
        hasValue = true;
        break
      }
    }
    if (!hasValue) {
      this.toggleDisable = true;
      this.toggleAllaccordion = false
    }
  }

  closeAndClearAccordion(accordionName, isChecked) {
    let allDBKeys = this.accordionData.allAsFoundKeysFI[Enums.FlowIsolationProductId[this.deviceId]][accordionName];
    for (let key in allDBKeys) {
      this.solutionObj[allDBKeys[key]] = isChecked ? null : this.solutionObj[allDBKeys[key]];
      if (isChecked) {
        this.expandOuterAccordion[accordionName] = false;
      }
    }
  }

  checkIfHasValues(accordionName) {
    let allDBKeys = this.accordionData.allAsFoundKeysFI[Enums.FlowIsolationProductId[this.deviceId]][accordionName];
    let hasValue = false;
    for (let key in allDBKeys) {
      if (this.utilityProvider.isNotNull(this.solutionObj[allDBKeys[key]])) {
        hasValue = true;
        break;
      }
    }
    return hasValue;
  }

  checkIfNotValidated() {
    let json = this.setJson()[Enums.FlowIsolationProductId[this.deviceId]];
    let allOtrColumn = this.accordionData.allAsFoundKeysFI[Enums.FlowIsolationProductId[this.deviceId]];
    let allOtrKeys = Object.keys(allOtrColumn);
    let hasNoValue = false;
    this.isNotValidated = false;
    //  let allReqColumn = this.accordionData.asFoundRequiredKeysFI[Enums.FlowIsolationProductId[this.deviceId]];
   //   let allReqKeys = Object.keys(allReqColumn); // for (let val in allReqKeys) {
    //   if (!json[allReqKeys[val]]) {
    //     for (let key in allReqColumn[allReqKeys[val]]) {
    //       if (!this.utilityProvider.isNotNull(this.solutionObj[allReqColumn[allReqKeys[val]][key]])) {
    //         hasNoValue = true;
    //         this.isNotValidated = true;
    //         break;
    //       }
    //     }
    //   }
    //   if (hasNoValue) break;
    // }
    if (!hasNoValue && this.solutionObj.ISCONSTRUCTIONCHANGES!='No') {
      for (let val in allOtrKeys) {
        if (!json[allOtrKeys[val]] || json[allOtrKeys[val]]=='false') {
          for (let key in allOtrColumn[allOtrKeys[val]]) {
            if (this.solutionObj[allOtrColumn[allOtrKeys[val]][key]] == "Other") {
              if (!this.utilityProvider.isNotNull(this.solutionObj[allOtrColumn[allOtrKeys[val]][key] + "_OT"])) {
                hasNoValue = true;
                this.isNotValidated = true;
                break;
              }
            }
          }
        }
        if (hasNoValue) break;
      }
    }
    // if (this.solutionObj["ACCESSORIES"] == "Other") {
    //   if (!this.utilityProvider.isNotNull(this.solutionObj["ACCESSORIES_OT"])) {
    //     hasNoValue = true;
    //     this.isNotValidated = true;
    //     return hasNoValue;
    //   }
    // }
    return hasNoValue;
  }

  // setRadioButton(element, value) {
  //   element = value;
  // }

  getSolutionData() {
    this.localServiceSdr.getPageData(this.solutionObj.REPORTID, 'SOLUTIONFLOWISOLATION').then((res: any) => {
      if (res.length > 0) {
        this.solutionObj = res[0];
        this.setToggleAccordion();
        // this.solutionObj.REPAIRSCOPECOMPLETEDNAME = this.solutionObj.REPAIRSCOPECOMPLETED == -1 ? 'Other' : res[0].LookupValue;
        this.recordExists = true;
      }
      if (!this.solutionObj.CV_ACTUATOR_HANDWHEEL && !(this.solutionObj.CV_ACTUATOR_NA == 'true' || this.solutionObj.CV_ACTUATOR_NA == true)) {
        this.solutionObj.CV_ACTUATOR_HANDWHEEL = "None";
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getSolutionData', ' Error in getSolutionData : ' + JSON.stringify(error));
    })
    this.utilityProvider.stopSpinner();
  }

  getAccessoriesData() {
    this.localServiceSdr.getPageData(this.solutionObj.REPORTID, 'ACCESSORIESFLOWISOLATION', 'VALUE_FOR="solution"').then((res: any) => {
      if (res.length > 0) {
        this.accessoriesObj = res;
      }
      else {
        this.accessoriesObj = {};
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getAccessoriesData', ' Error in getAccessoriesData : ' + JSON.stringify(error));
    })
    this.utilityProvider.stopSpinner();
  }

  saveData() {
    this.solutionObj.SL_PK_ID = this.recordExists ? this.solutionObj.SL_PK_ID : '';
    delete this.solutionObj.ACCESSORIES;
    delete this.solutionObj.ACCESSORIES_OT;
    this.localServiceSdr.insertOrUpdateData(this.solutionObj, this.recordExists, 'SL_PK_ID', 'SOLUTIONFLOWISOLATION').then((response: any) => {
      if (response) {
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'save', ' Error in insertUpdateSolutionData : ' + JSON.stringify(error));
    });
  }

  saveAccessories() {
    this.isAccessories = true;
    if (!this.solutionObj.ACCESSORIES) {
      this.isAccessories = false;
      this.utilityProvider.presentAlert();
      return;
    }
    if (this.solutionObj.ACCESSORIES == 'Other' && !this.solutionObj.ACCESSORIES_OT) {
      this.utilityProvider.presentAlert();
      return;
    }
    this.accessoriesObj = {};
    this.accessoriesObj.VALUE = this.solutionObj.ACCESSORIES;
    this.accessoriesObj.VALUE_OT = this.solutionObj.ACCESSORIES_OT;
    this.accessoriesObj.REPORTID = this.solutionObj.REPORTID;
    this.accessoriesObj.VALUE_FOR = "solution";
    this.localServiceSdr.insertOrUpdateData(this.accessoriesObj, false, 'AC_PK_ID', 'ACCESSORIESFLOWISOLATION').then((response: any) => {
      if (response) {
        this.solutionObj.ACCESSORIES = "";
        this.solutionObj.ACCESSORIES_OT = "";
        this.getAccessoriesData();
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'save', ' Error in insertUpdateAccessoriesData : ' + JSON.stringify(error));
    });
  }

  deleteAccessories(value) {
    this.localServiceSdr.deleteFromTable("AC_PK_ID", value, "ACCESSORIESFLOWISOLATION").then((res: any) => {
      this.getAccessoriesData();
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getCalibrationData', ' Error in getCalibrationData : ' + JSON.stringify(error));
    })
  }

  copyFromBody(isChecked, copyFrom, copyTo) {
    try {
      if (isChecked) {
        if (this.solutionObj[copyTo] && this.solutionObj[copyTo] != this.solutionObj[copyFrom]) {
          this.CopySnPopup(copyFrom, copyTo);
        } else {
          this.solutionObj[copyTo] = this.solutionObj[copyFrom];
        }
      }
    }
    catch (e) { }
  }

  ionViewWillLeave() {
    if (this.checkIfNotValidated() || !(this.checkIfValid() && this.isValidated())) {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }
    else {
      this.saveData();
      this.insertSolutionCaliData();
    }

    // if (this.checkIfValid() && this.isValidated()) {
    //   this.insertSolutionCaliData();
    // } else {
    //   this.utilityProvider.presentAlert();
    //   throw new Error('Form validation error!');
    // }

  }
  showLovCalibration() {
    this.localServiceSdr.getLookups(this.arr).then((res: any) => {
      this.calSolutionLov = [];
      this.calSolutionLov = JSON.parse(JSON.stringify(res));

    }).catch((error: any) => {
      this.logger.log(this.fileName, "getCalibrationData", " Error in getCalibrationData : " + JSON.stringify(error));
    })
  }
  searchCalModal(data, key) {
    let dataArray: any = [];
    let modalKey

    dataArray = this.calSolutionLov.filter((item) => {
      return item.LookupType == data
    })
    if (key == "CAL_BENCH_UOM") {
      modalKey = "CAL_BENCHSET"
    }
    else {
      modalKey = key.replace("_UOM", "");
    }
    //console.log(s, "->", trim(s, "|"));

    if (!this.removeNovalue(modalKey)) {

      dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });

    }
    dataArray.push({ "LookupID": -1, "LookupValue": "Other" });

    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: "isocal" }, { enableBackdropDismiss: true, cssClass: "cssSearchModalPage" });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        this.calibrationSolObj[key] = data.LookupValue;
      }
      data = null;
    });
  }
  getCalibrationSol() {
    try {
      this.localServiceSdr.getActuationdata(this.calibrationSolObj.REPORTID, 'CALIBRATIONSOLUTIONFLOWISOLATION', 'getCalibrationSol').then((res: any[]) => {
        // console.log(res);
        if (res && res.length) {
          this.isCalibrationSolRecordExists = true
          this.calibrationSolObj = JSON.parse(JSON.stringify(res[0]));
          //this.CAL_PK_ID = this.calibrationObj.CAL_PK_ID;
        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getCalibrationIso', ' Error in insertTime : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.logger.log(this.fileName, "getCalibrationIso", "Error: " + error.message);
    }
  }
  insertSolutionCaliData() {

    this.localServiceSdr.insertOrUpdateData(this.calibrationSolObj, this.isCalibrationSolRecordExists, 'CALSOL_PK_ID', 'CALIBRATIONSOLUTIONFLOWISOLATION').then((res): any => {
      // console.log(res);
    }).catch((error: any) => {

      this.logger.log(this.fileName, 'insertCalibrationData', ' Error in insertTime : ' + JSON.stringify(error));
    });
  }
  setJsonKeys() {
    return [["CAL_TRAVEL", "CAL_TRAVEL_UOM"], ["CAL_SIGNALOPEN", "CAL_SIGNALOPEN_UOM"], ['CAL_BENCHSET', 'CAL_BENCH_UOM'], ['CAL_SIGNALCLOSED', 'CAL_SIGNALCLOSED_UOM'], ['CAL_SUPPLY', 'CAL_SUPPLY_UOM']];
  }
  checkIfValid() {
    this.errorObj = [];
    let isValid = true;
    let jsonObj = this.setJsonKeys();
    for (let i = 0; i < jsonObj.length; i++) {
      if (this.calibrationSolObj[jsonObj[i][0]] || (this.calibrationSolObj[jsonObj[i][1]] && this.calibrationSolObj[jsonObj[i][1]] != "No Value")) {
        if (!this.calibrationSolObj[jsonObj[i][0]]) {
          this.errorObj[jsonObj[i][0]] = true;
          isValid = false;
        }
        if (!this.calibrationSolObj[jsonObj[i][1]]) {
          this.errorObj[jsonObj[i][1]] = true;
          isValid = false;

        }
        // if (this.calibrationSolObj[jsonObj[i][1]] == "No Value") {
        //   isValid = true;
        // }
      }
    }
    return isValid;
  }
  removeNovalue(key) {
    let isValid = false;
    let jsonObj = this.setJsonKeys();
    for (let i = 0; i < jsonObj.length; i++) {
      if (this.calibrationSolObj[key]) {
        isValid = true;
      }
    }
    return isValid;
  }
  isValidated() {
    this.errorObj = [];
    let accordionData = new AccordionData();
    for (let key in accordionData.isoCalibration) {
      let element: any = accordionData.isoCalibration[key];
      if (this.calibrationSolObj[element] == 'Other') {
        if (!this.utilityProvider.isNotNull(this.calibrationSolObj[element + "_OT"])) {
          this.errorObj.push(element + "_OT");
        }
      }

    }
    return this.errorObj.length == 0;
  }

  CopySnPopup(copyFrom, copyTo) {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("Confirm ?"),
      message: this.translate.instant("A Serial number already exists. Are you sure you want to override this value ?"),
      enableBackdropDismiss: false,
      buttons: [
        {
          text: this.translate.instant('OK'),
          handler: () => {
            this.solutionObj[copyTo] = this.solutionObj[copyFrom];
          }
        },
        {
          text: this.translate.instant('Cancel'),
          role: 'cancel'
        }
      ],
      cssClass: 'forcelogoutAlert'
    });
    alert.present();
  }

}
