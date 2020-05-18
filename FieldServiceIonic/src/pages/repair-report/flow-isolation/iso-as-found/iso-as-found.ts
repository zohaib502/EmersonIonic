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
 * Generated class for the IsoAsFoundPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-iso-as-found',
  templateUrl: 'iso-as-found.html',
})

export class IsoAsFoundPage {
  asfoundObj: any = {}; solutionObj: any = {}; accessoriesObj: any = {};
  expandOuterAccordion: any = {};
  toggleAllaccordion: boolean = false;
  selectedProcess: any; Enums: any = Enums;
  deviceId: any; allLOVsByDevice: any = []; allLOVsByDeviceAndDisplayOrder: any = [];
  accordionData = new AccordionData();
  isNotValidated = false; recordExists: boolean = false; toggleDisable = false; isAccessories = true;
  modelLOVs = []; isModelLOVsE = []; nextPageText = 'Calibration';
  fileName: any = 'IsoAsFoundPage';
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

    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "As Found" };
    if (this.valueProvider.getCurrentReport()) {
      this.asfoundObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
      console.log(this.selectedProcess);
      this.getDeviceID();
    }
    this.getAsFoundData();
    this.getSolutionData();
    this.getAccessoriesData();
  }

  // checkNextPage() {
  //   let page = Enums.FlowIsolationProductId[this.deviceId];
  //   if (page != 'ControlValve' && page != 'Isolation' && page != 'Instrument') {
  //     this.nextPageText = 'Photos';
  //   }
  //   else {
  //     this.nextPageText = 'Calibration';
  //   }
  // }

  goToFcr() {
    if (this.checkIfNotValidated()) {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }
    else {
      this.saveData();
      setTimeout(() => {
        this.events.publish("goToFCR");
      }, 100);

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

  setJson() {
    let json = {
      "ControlValve":
      {
        "BodyCV": this.asfoundObj.CV_BODY_NA,
        "ActuatorCV": this.asfoundObj.CV_ACTUATOR_NA,
        "PositionerCV": this.asfoundObj.CV_POSITIONER_NA,
        "AccessoriesCV": this.asfoundObj.CV_ACCESSORIES_NA,
      },
      "Isolation":
      {
        "BodyISO": this.asfoundObj.ISO_BODY_NA,
        "ActuatorISO": this.asfoundObj.ISO_ACTUATOR_NA,
        "PositionerISO": this.asfoundObj.ISO_POSITIONER_NA,
        "AccessoriesISO": this.asfoundObj.ISO_ACCESSORIES_NA,
      },
      "Controller":
      {
        "ControllerCTR": this.asfoundObj.CTR_CONTROLLER_NA,
      },
      "Instrument":
      {
        "PositionerINS": this.asfoundObj.INS_POSITIONER_NA,
        "AccessoriesINS": this.asfoundObj.INS_ACCESSORIES_NA,
      },
      "LevelTroll":
      {
        "LevelLT": this.asfoundObj.LT_LEVEL_NA,
        "InstrumentLT": this.asfoundObj.LT_INSTRUMENT_NA,
        "AccessoriesLT": this.asfoundObj.LT_ACCESSORIES_NA,
      },
      "Regulator":
      {
        "BodyREG": this.asfoundObj.REG_BODY_NA,
        "PilotREG": this.asfoundObj.REG_PILOT_NA,
        "MVREG": this.asfoundObj.REG_MV_NA,
      },
      "TrimOnly":
      {
        "BodyTO": this.asfoundObj.TO_BODY_NA,
      },
    }
    return json;
  }

  getDeviceID() {
    this.localServiceSdr.getDEVICEIDForFlowIsolation(this.asfoundObj.REPORTID).then((val) => {
      this.deviceId = val;
      this.getLOVs();
      // this.checkNextPage();
    }
    )
  }

  redirect(value) {
    this.utilityProvider.bottomNavigation(this.navCtrl, value);
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
        this.asfoundObj[key] = element.LookupValue;
        if (key == 'ACCESSORIES') { this.isAccessories = true; }
        if (bodyModel == 'MAKE') {
          this.modelLOVs[modelKey] = this.filterModelData(this.modelLOVs[modelKey], element)
          if (!this.modelLOVs[modelKey].length) {
            this.isModelLOVsE[modelKey] = false;
            this.asfoundObj[modelKey] = "Other";
            this.asfoundObj[modelKey + "_OT"] = "";
          }
          else {
            this.isModelLOVsE[modelKey] = true;
            this.asfoundObj[modelKey] = "";
            this.asfoundObj[key.replace("_MAKE", "_MODEL_OT")] = "";
            this.modelLOVs[modelKey].unshift({ "LookupID": -2, "LookupValue": "No Value" });
            this.modelLOVs[modelKey].push({ "LookupID": -1, "LookupValue": "Other" });
          }

        }
        if (this.asfoundObj[key] != 'Other') {
          this.asfoundObj[key + "_OT"] = "";
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
                this.asfoundObj[key] = false;
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
          ],
          enableBackdropDismiss: false
        });
        alert.present();
      } else {
        this.setToggleAccordion();
        this.expandOuterAccordion[accordionName] = false
      }
    }
    else {
      if (accordionName == 'ActuatorCV') {
        this.asfoundObj.CV_ACTUATOR_HANDWHEEL = "None";
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
      this.asfoundObj[allDBKeys[key]] = isChecked ? null : this.asfoundObj[allDBKeys[key]];
      if (isChecked) {
        this.expandOuterAccordion[accordionName] = false;
      }
    }
  }

  checkIfHasValues(accordionName) {
    let allDBKeys = this.accordionData.allAsFoundKeysFI[Enums.FlowIsolationProductId[this.deviceId]][accordionName];
    let hasValue = false;
    for (let key in allDBKeys) {
      if (this.utilityProvider.isNotNull(this.asfoundObj[allDBKeys[key]])) {
        hasValue = true;
        break;
      }
    }
    return hasValue;
  }

  checkIfNotValidated() {
    let json = this.setJson()[Enums.FlowIsolationProductId[this.deviceId]];
    let allReqColumn = this.accordionData.asFoundRequiredKeysFI[Enums.FlowIsolationProductId[this.deviceId]];
    let allReqKeys = Object.keys(allReqColumn);
    // console.log(allReqKeys);
    let allOtrColumn = this.accordionData.allAsFoundKeysFI[Enums.FlowIsolationProductId[this.deviceId]];
    let allOtrKeys = Object.keys(allOtrColumn);
    let hasNoValue = false;
    this.isNotValidated = false;
    for (let val in allReqKeys) {
      if (!json[allReqKeys[val]]) {
        for (let key in allReqColumn[allReqKeys[val]]) {
          if (!this.utilityProvider.isNotNull(this.asfoundObj[allReqColumn[allReqKeys[val]][key]])) {
            hasNoValue = true;
            this.isNotValidated = true;
            break;
          }
        }
      }
      if (hasNoValue) break;
    }
    if (!hasNoValue) {
      for (let val in allOtrKeys) {
        if (!json[allOtrKeys[val]]) {
          for (let key in allOtrColumn[allOtrKeys[val]]) {
            if (this.asfoundObj[allOtrColumn[allOtrKeys[val]][key]] == "Other") {
              if (!this.utilityProvider.isNotNull(this.asfoundObj[allOtrColumn[allOtrKeys[val]][key] + "_OT"])) {
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
    // if (this.asfoundObj["ACCESSORIES"] == "Other") {
    //   if (!this.utilityProvider.isNotNull(this.asfoundObj["ACCESSORIES_OT"])) {
    //     hasNoValue = true;
    //     this.isNotValidated = true;
    //     return hasNoValue;
    //   }
    // }
    return hasNoValue;
  }

  getAsFoundData() {
    this.localServiceSdr.getPageData(this.asfoundObj.REPORTID, 'ASFOUNDFLOWISOLATION').then((res: any) => {
      if (res.length > 0) {
        this.asfoundObj = res[0];
        this.setToggleAccordion();
        // this.asfoundObj.REPAIRSCOPECOMPLETEDNAME = this.asfoundObj.REPAIRSCOPECOMPLETED == -1 ? 'Other' : res[0].LookupValue;
        this.recordExists = true;
      }
      if (!this.asfoundObj.CV_ACTUATOR_HANDWHEEL && !(this.asfoundObj.CV_ACTUATOR_NA == 'true' || this.asfoundObj.CV_ACTUATOR_NA == true)) {
        this.asfoundObj.CV_ACTUATOR_HANDWHEEL = "None";
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getAsFoundData', ' Error in getAsFoundData : ' + JSON.stringify(error));
    })
    this.utilityProvider.stopSpinner();
  }

  getSolutionData() {
    this.localServiceSdr.getPageData(this.asfoundObj.REPORTID, 'SOLUTIONFLOWISOLATION').then((res: any) => {
      if (res.length > 0) {
        this.solutionObj = res[0];
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getSolutionData', ' Error in getSolutionData : ' + JSON.stringify(error));
    })
    this.utilityProvider.stopSpinner();
  }
  getAccessoriesData() {
    this.localServiceSdr.getPageData(this.asfoundObj.REPORTID, 'ACCESSORIESFLOWISOLATION', 'VALUE_FOR="asfound"').then((res: any) => {
      if (res.length > 0) {
        this.accessoriesObj = res;
        // this.accessoriesRecordExists = true;
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
    this.asfoundObj.AF_PK_ID = this.recordExists ? this.asfoundObj.AF_PK_ID : '';
    delete this.asfoundObj.ACCESSORIES;
    delete this.asfoundObj.ACCESSORIES_OT;
    let solutionPK = this.solutionObj["SL_PK_ID"];
    let solutionConstChanges = this.solutionObj["ISCONSTRUCTIONCHANGES"];
    this.solutionObj = JSON.parse(JSON.stringify(this.asfoundObj));
    this.solutionObj["ISCONSTRUCTIONCHANGES"] = solutionConstChanges ? solutionConstChanges : "NA";
    delete this.solutionObj["AF_PK_ID"];
    if (solutionPK) {
      this.solutionObj["SL_PK_ID"] = solutionPK;
    }
    this.localServiceSdr.insertOrUpdateData(this.asfoundObj, this.recordExists, 'AF_PK_ID', 'ASFOUNDFLOWISOLATION').then((response: any) => {
      if (response) {
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'save', ' Error in insertUpdateAsFoundData : ' + JSON.stringify(error));
    });

    this.localServiceSdr.insertOrUpdateData(this.solutionObj, this.recordExists, 'SL_PK_ID', 'SOLUTIONFLOWISOLATION', 'ISCONSTRUCTIONCHANGES ="NA" or ISCONSTRUCTIONCHANGES ="No" ').then((res: any) => {
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName + "-ForSolution", 'save', ' Error in insertUpdateSolutionData : ' + JSON.stringify(error));
    });
  }

  checkAndSliceMaxLength(field, length) {
    this.asfoundObj[field] = this.utilityProvider.sliceValueUptoLimit(this.asfoundObj[field], length + 1);
  }

  saveAccessories() {
    this.isAccessories = true;
    if (!this.asfoundObj.ACCESSORIES) {
      this.isAccessories = false;
      this.utilityProvider.presentAlert();
      return;
    }
    if (this.asfoundObj.ACCESSORIES == 'Other' && !this.asfoundObj.ACCESSORIES_OT) {
      this.utilityProvider.presentAlert();
      return;
    }
    this.accessoriesObj = {};
    this.accessoriesObj.VALUE = this.asfoundObj.ACCESSORIES;
    this.accessoriesObj.VALUE_OT = this.asfoundObj.ACCESSORIES_OT;
    this.accessoriesObj.REPORTID = this.asfoundObj.REPORTID;
    this.accessoriesObj.VALUE_FOR = "asfound";
    this.localServiceSdr.insertOrUpdateData(this.accessoriesObj, false, 'AC_PK_ID', 'ACCESSORIESFLOWISOLATION').then((response: any) => {
      if (response) {
        this.asfoundObj.ACCESSORIES = "";
        this.asfoundObj.ACCESSORIES_OT = "";
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
      if (isChecked)
        this.asfoundObj[copyTo] = this.asfoundObj[copyFrom];
    }
    catch (e) { }
  }

  ionViewWillLeave() {
    if (this.checkIfNotValidated()) {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }
    else {
      this.saveData();
    }
  }
}
