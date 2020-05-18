import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { AccordionData } from '../../../../beans/AccordionData'
import * as Enums from '../../../../enums/enums';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { TranslateService } from '@ngx-translate/core';
import { ValueProvider } from '../../../../providers/value/value';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { LoggerProvider } from '../../../../providers/logger/logger';

@IonicPage()
@Component({
  selector: 'page-pressure-findings',
  templateUrl: 'pressure-findings.html',
})
export class PressureFindingsPage {
  findingsObj: any = {};
  partsObj: any = {};
  selectedProcess: any;
  Enums: any = Enums;
  errorObj: any = [];
  isFindingsRecordExists: boolean = false;
  isFindingsValuesChanged: boolean = false;
  isPartsRecordExists: boolean = false;
  isPartsValuesChanged: boolean = false;
  accordionData = new AccordionData();
  fileName: any = 'PressureFindingsPage';
  allLOVsByDevice: any = [];
  parentReferenceID: any;
  showPartsData = [];
  partsErrorObj: any =[];
  constructor(public navCtrl: NavController, public utilityProvider: UtilityProvider, public logger: LoggerProvider, public alertCtrl: AlertController, public translate: TranslateService, public navParams: NavParams, public localServiceSdr: LocalServiceSdrProvider, public valueProvider: ValueProvider, public events: Events) {
  }

  ionViewDidEnter() {
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Findings" };
    this.isFindingsValuesChanged = false;
    this.isFindingsRecordExists = false;
    this.isPartsValuesChanged = false;
    this.isPartsRecordExists = false;
    if (this.valueProvider.getCurrentReport()) {
      this.findingsObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.partsObj.REPORTID =  this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
      this.getDeviceID();
    }
  }
  getDeviceID() {
    this.localServiceSdr.getDEVICEIDForFlowIsolation(this.findingsObj.REPORTID).then((val) => {
      this.parentReferenceID = val;
      this.loadLovs(this.parentReferenceID);
      this.getFindingsData();
      this.getPartsData();
    })
  }
  loadLovs(DeviceID) {
    let arr = this.accordionData.PressureFindingsLovs['PressureLovs'];
    this.localServiceSdr.getLookups(arr).then((item) => {
      this.allLOVsByDevice = [];
      this.allLOVsByDevice = JSON.parse(JSON.stringify(item));
    })
  }
  searchModal(data, key) {
    let dataArray: any = [];
    dataArray = this.filterArrayData(dataArray, data);
    dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
    dataArray.push({ "LookupID": -1, "LookupValue": "Other" });
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: 'jobids' }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        if (!this.isFindingsValuesChanged) {
          this.isFindingsValuesChanged = true;
        }
        this.findingsObj[key] = data.LookupValue;
        if (this.findingsObj[key] != 'Other') {
          this.findingsObj[key + "_OT"] = "";
        }
      }
      data = null;
    });
  }

  searchModalParts(data, key) {
    let dataArray: any = [];
    dataArray = this.filterArrayData(dataArray, data);
    dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
    dataArray.push({ "LookupID": -1, "LookupValue": "Other" });
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: 'jobids' }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        if (!this.isPartsValuesChanged) {
          this.isPartsValuesChanged = true;
        }
        this.partsObj[key] = data.LookupValue;
        if (this.partsObj[key] != 'Other') {
          this.partsObj[key + "_OT"] = "";
        }
      }
      data = null;
    });
  }

  filterArrayData(dataArray, data) {
    dataArray = this.allLOVsByDevice.filter((item) => {
      return item.LookupType == data
    })
    return dataArray;
  }
  goToFcr() {
    if (this.isValidated()) {
      this.insertFindingsData();
      setTimeout(() => {
        this.events.publish("goToFCR");
      }, 100);
    } else {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }

  }
  isValidated() {
    this.errorObj = [];
    for (let key in this.accordionData.findingsPressureKeys) {
      let element: any = this.accordionData.findingsPressureKeys[key];
      if (this.findingsObj[element] == 'Other') {
        if (!this.utilityProvider.isNotNull(this.findingsObj[element + "_OT"])) {
          this.errorObj.push(element + "_OT");
        }
      }

    }
    return this.errorObj.length == 0;
  }
  ionViewWillLeave(): void {
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    if (this.checkIfValid() && this.isValidated()) {
      this.insertFindingsData();
    } else {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }
  }
  findingsValueChanged(event) {
    if (event.value && !this.isFindingsValuesChanged) {
      this.isFindingsValuesChanged = true;
    }
  }

  insertFindingsData() {
    try {
      if (this.isFindingsValuesChanged) {
        this.localServiceSdr.insertOrUpdateData(this.findingsObj, this.isFindingsRecordExists, 'FPF_PK_ID', 'FINDINGSPRESSUREFLOW').then((res): any => {
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'insertFindingsData', ' Error in insertTime : ' + JSON.stringify(error));
        });
      }

    } catch (error) {
      this.logger.log(this.fileName, "insertFindingsData", "Error: " + error.message);
    }
  }

  getFindingsData() {
    try {
      this.localServiceSdr.getActuationdata(this.findingsObj.REPORTID, 'FINDINGSPRESSUREFLOW', 'getFindingsData').then((res: any[]) => {
        // console.log(res);
        if (res && res.length) {
          this.isFindingsRecordExists = true;
          this.findingsObj = JSON.parse(JSON.stringify(res[0]));
        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getFindingsData', ' Error in insertTime : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.logger.log(this.fileName, "getFindingsData", "Error: " + error.message);
    }
  }

  insertPartsData() {
    if (this.isPartsValidated()) {
      try {
        this.localServiceSdr.insertOrUpdateData(this.partsObj, false, 'PPF_PK_ID', 'PARTSPRESSUREFLOW').then((res): any => {
          this.getPartsData();
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'insertPartsData', ' Error in insertTime : ' + JSON.stringify(error));
        });
      } catch (error) {
        this.logger.log(this.fileName, "insertPartsData", "Error: " + error.message);
      }
    } else {
      this.utilityProvider.presentAlert();
    }
  }

  getPartsData() {
    try {
      this.localServiceSdr.getActuationdata(this.partsObj.REPORTID, 'PARTSPRESSUREFLOW', 'getPartsData').then((res: any[]) => {
        if (res && res.length) {
          this.showPartsData = res;
          this.partsObj.PART = null
          this.partsObj.PART_OT = null
          this.partsObj.ASFOUNDCONDITION = null
          this.partsObj.ASFOUNDCONDITION_OT = null
        } else {
          this.showPartsData = [];
        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getPartsData', ' Error in insertTime : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.logger.log(this.fileName, "getPartsData", "Error: " + error.message);
    }
  }

  deleteData(value) {
    this.localServiceSdr.deletePartsData(value).then((res: any) => {
      this.getPartsData();
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'deleteData', ' Error in deleteData : ' + JSON.stringify(error));
    })
  }
  redirect(value) {
    if (this.checkIfValid() && this.isValidated()) {
      this.utilityProvider.bottomNavigation(this.navCtrl, value);
    } else {
      this.utilityProvider.presentAlert();
    }
  }

  setJson() {
    return [["ADJUSTMENT_BOLT_HEIGHT", "ADJUSTMENT_BOLT_HEIGHT_UOM"]];
  }

  checkIfValid() {
    this.errorObj = [];
    let isValid = true;
    let jsonObj = this.setJson();
    for (let i = 0; i < jsonObj.length; i++) {
      if (this.findingsObj[jsonObj[i][0]] || (this.findingsObj[jsonObj[i][1]] && this.findingsObj[jsonObj[i][1]] != "No Value")) {
        if (!this.findingsObj[jsonObj[i][0]]) {
          this.errorObj[jsonObj[i][0]] = true;
          isValid = false;
        }
        if (!this.findingsObj[jsonObj[i][1]]) {
          this.errorObj[jsonObj[i][1]] = true;
          isValid = false;
        }
      }
    }
    return isValid;
  }

  isPartsValidated() {
    this.partsErrorObj = [];
    let isValid = true;
    for (let key in this.accordionData.FindingsPartsKeys) {
      let element: any = this.accordionData.FindingsPartsKeys[key];
      if (!this.utilityProvider.isNotNull(this.partsObj[element])) {
          this.partsErrorObj[element] = true;
          isValid =false;
      }
    }
    return isValid;
  }

  deviceTstChkValChanged() {
    if (!this.isFindingsValuesChanged) {
      this.isFindingsValuesChanged = true;
    }
  }


}
