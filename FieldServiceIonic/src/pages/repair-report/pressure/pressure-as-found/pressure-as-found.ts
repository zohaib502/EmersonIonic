import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import * as Enums from '../../../../enums/enums';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { AccordionData } from '../../../../beans/AccordionData';
import { ValueProvider } from '../../../../providers/value/value';
import { LoggerProvider } from '../../../../providers/logger/logger';

/**
 * Generated class for the PressureAsFoundPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pressure-as-found',
  templateUrl: 'pressure-as-found.html',
})
export class PressureAsFoundPage {
  asfoundObj: any = {}; 
  deviceID: any; 
  deviceType: any;
  selectedProcess: any; 
  Enums: any = Enums;
  allLOVsByDeviceAndDisplayOrder: any = [];
  accordionData = new AccordionData();
  recordExists: boolean = false; 
  errorObj: any = [];
  fileName: any = 'PressureAsFoundPage';

  constructor(public navCtrl: NavController, public logger: LoggerProvider, public utilityProvider: UtilityProvider, public events: Events, public valueProvider: ValueProvider, public localServiceSdr: LocalServiceSdrProvider, public navParams: NavParams) {
  }

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

  ionViewDidEnter() {

    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "As Found" };
    if (this.valueProvider.getCurrentReport()) {
      this.asfoundObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
      console.log(this.selectedProcess);
      this.getDeviceID();
    }
    this.getAsFoundData();
  }
  // requiredCBFieldObj() {
  //   return [['BACK_PRESSURE', 'BACK_PRESSURE_UOM'], ['RESTRICTED_LIFT', 'RESTRICTED_LIFT_UOM']];
  // }

  checkIfNotValidated() {
    this.errorObj = [];
    let allReqKeys = this.accordionData.AFP_ReqUOM;
    let allOtrKeys = this.accordionData.AFP_ReqKeysForOT;
    let hasNoValue = false;

    if (!hasNoValue) {
      for (let i = 0; i < allReqKeys.length; i++) {
        if (this.asfoundObj[allReqKeys[i][0]] || (this.asfoundObj[allReqKeys[i][1]] && this.asfoundObj[allReqKeys[i][1]] != "No Value")) {
          if (!this.asfoundObj[allReqKeys[i][0]]) {
            this.errorObj[allReqKeys[i][0]] = true;
            hasNoValue = true;
          }
          if ((!this.asfoundObj[allReqKeys[i][1]]) || this.asfoundObj[allReqKeys[i][1]] == "No Value") {
            this.errorObj[allReqKeys[i][1]] = true;
            hasNoValue = true;

          } 
        }
      }
    }
    if (this.asfoundObj['BACK_PRESSURE_CB'] == 'true' || this.asfoundObj['BACK_PRESSURE_CB'] == true) {
      if (!this.asfoundObj['BACK_PRESSURE']) {
        this.errorObj['BACK_PRESSURE'] = true;
        hasNoValue = true;
      }
      if ((!this.asfoundObj['BACK_PRESSURE_UOM']) || this.asfoundObj['BACK_PRESSURE_UOM'] == "No Value") {
        this.errorObj['BACK_PRESSURE_UOM'] = true;
        hasNoValue = true;
      }
    }
    if (this.asfoundObj['RESTRICTED_LIFT_CB'] == 'true' || this.asfoundObj['RESTRICTED_LIFT_CB'] == true) {
      if (!this.asfoundObj['RESTRICTED_LIFT']) {
        this.errorObj['RESTRICTED_LIFT'] = true;
        hasNoValue = true;
      }
      if (!this.asfoundObj['RESTRICTED_LIFT_UOM'] || this.asfoundObj['RESTRICTED_LIFT_UOM'] == "No Value") {
        this.errorObj['RESTRICTED_LIFT_UOM'] = true;
        hasNoValue = true;
      }
    }

    if (!hasNoValue) {
      for (let val in allOtrKeys) {
        if (this.asfoundObj[allOtrKeys[val]] == "Other") {
          if (!this.utilityProvider.isNotNull(this.asfoundObj[allOtrKeys[val] + "_OT"])) {
            hasNoValue = true;
            break;
          }
        }
        if (hasNoValue) break;
      }
    }
    return hasNoValue;
  }

  checkCBValidation(val) {
    this.errorObj[val] = false;
    this.errorObj[val + "_UOM"] = false;
    this.asfoundObj[val] = "";
    this.asfoundObj[val + "_UOM"] = "";
  }

  removeNovalue(key) {
    let isValid = false;
      if (this.asfoundObj[key] || key=='RESTRICTED_LIFT' || key=='BACK_PRESSURE') {
        isValid = true;
      }
    return isValid;
  }

  getAsFoundData() {
    this.localServiceSdr.getPageData(this.asfoundObj.REPORTID, 'ASFOUNDPRESSUREFLOW').then((res: any) => {
      if (res.length > 0) {
        this.asfoundObj = res[0];
        this.recordExists = true;
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getAsFoundData', ' Error in getAsFoundData : ' + JSON.stringify(error));
    })
    this.utilityProvider.stopSpinner();
  }

  getDeviceID() {
    this.localServiceSdr.getSelectedDevice(this.asfoundObj.REPORTID).then((res: any): any => {
      let val = res[0];
      this.deviceID = val.DEVICEID;
      this.deviceType = val.TYPE;
      this.asfoundObj.VALVE_TYPE = val.TYPE;
      this.getLOVs();
    }
    )
  }

  getLOVs() {
    let arr = this.accordionData.AFP_LOVs;
    this.localServiceSdr.getLookupsByDisplayOrder(arr).then((item) => {
      this.allLOVsByDeviceAndDisplayOrder = [];
      this.allLOVsByDeviceAndDisplayOrder = JSON.parse(JSON.stringify(item));
    })
  }

  searchModal(data, key) {
    let dataArray: any = [];
    let modalKey = key.replace("_UOM", "");
    dataArray = this.filterData(dataArray, data, this.allLOVsByDeviceAndDisplayOrder)
    if (!this.removeNovalue(modalKey)) {
      dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
    }
    dataArray.push({ "LookupID": -1, "LookupValue": "Other" });

    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: 'jobids' }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(element => {
      if (element != null) {
        this.asfoundObj[key] = element.LookupValue;
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

  saveData() {
    this.localServiceSdr.insertOrUpdateData(this.asfoundObj, this.recordExists, 'AFPF_PK_ID', 'ASFOUNDPRESSUREFLOW').then((response: any) => {
      if (response) {
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'save', ' Error in insertUpdateAsFoundData : ' + JSON.stringify(error));
    });
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
