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
  selector: 'page-iso-findings',
  templateUrl: 'iso-findings.html',
})
export class IsoFindingsPage {
  expandOuterAccordion: any = {};
  fileName: any = 'IsoFindingsPage';
  findingsObj: any = {};
  selectedProcess: any;
  toggleAllaccordion: boolean = false;
  Enums: any = Enums;
  errorObj: any = [];
  allControlValveLovs: any = [];
  allInstrumentLovs: any = [];
  allIsolationLovs: any = [];
  allRegulatorLovs: any = [];
  allLevelTrollLovs: any = [];
  allTrimOnlyLovs: any = [];
  allLOVsByDevice: any = [];
  parentReferenceID: any;
  isFindingsRecordExists: boolean = false;
  isFindingsValuesChanged: boolean = false;
  accordionData = new AccordionData();
  bottomNavBtn: any;
  constructor(public navCtrl: NavController, public utilityProvider: UtilityProvider, public logger: LoggerProvider, public alertCtrl: AlertController, public translate: TranslateService, public navParams: NavParams, public localServiceSdr: LocalServiceSdrProvider, public valueProvider: ValueProvider, public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IsoFindingsPage');
  }

  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });

    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Findings" };
    this.isFindingsValuesChanged = false;
    this.isFindingsRecordExists = false;
    if (this.valueProvider.getCurrentReport()) {
      this.findingsObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
      this.getDeviceID();
    }
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

  expandOuter(key) {
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

  toggleAccordion(event) {
    let accordionKeys;
    if (this.parentReferenceID == Enums.FlowIsolationProductId.ControlValve) {
      accordionKeys = this.accordionData.ControlValveAccordionKeys
    } else if (this.parentReferenceID == Enums.FlowIsolationProductId.Instrument) {
      accordionKeys = this.accordionData.InstrumentAccordionKeys
    } else if (this.parentReferenceID == Enums.FlowIsolationProductId.Isolation) {
      accordionKeys = this.accordionData.IsolationAccordionKeys
    }
    if (this.toggleAllaccordion) {
      for (let key in accordionKeys) {
        let val: any = accordionKeys[key];
        let json = this.setJson();
        if (json[val] != true) {
          this.expandOuterAccordion[val] = true;
        }
      }
    } else {
      for (let key in accordionKeys) {
        let val: any = accordionKeys[key];
        this.expandOuterAccordion[val] = false;
      }
    }
  }

  setJson() {
    let json = {
      "BodyBonnetControlValve": this.findingsObj.CV_BODY_BONNET_BODY_BONNET_NA,
      "TrimControlValve": this.findingsObj.CV_TRIM_TRIM_NA,
      "ActuatorControlValve": this.findingsObj.CV_ACTUATOR_ACTUATOR_NA,
      "PositionerControlValve": this.findingsObj.CV_POSITIONER_POSITIONER_NA,
      "OtherControlValve": this.findingsObj.CV_OTHER_OTHER_NA,
      "PositionerInstrument": this.findingsObj.INS_POSITIONER_POSITIONER_NA,
      "OtherInstrument": this.findingsObj.INS_OTHER_OTHER_NA,
      "LevelTroll": this.findingsObj.LT_LEVELTROL_LEVELTROL_NA,
      "BodyBonnetIsolation": this.findingsObj.ISO_BODY_BONNET_BODY_BONNET_NA,
      "TrimIsolation": this.findingsObj.ISO_TRIM_TRIM_NA,
      "ActuatorIsolation": this.findingsObj.ISO_ACTUATOR_ACTUATOR_NA,
      "PositionerIsolation": this.findingsObj.ISO_POSITIONER_POSITIONER_NA,
      "OtherIsolation": this.findingsObj.ISO_OTHER_OTHER_NA,
      "TrimOnly": this.findingsObj.TO_TRIMONLY_TRIMONLY_NA
    }
    return json;
  }



  redirect(value) {
    if (this.isValidated()) {
      this.utilityProvider.bottomNavigation(this.navCtrl, value);
    } else {
      this.utilityProvider.presentAlert();
    }
  }

  getDeviceID() {
    this.localServiceSdr.getDEVICEIDForFlowIsolation(this.findingsObj.REPORTID).then((val) => {
      this.parentReferenceID = val;
      this.loadLovs(this.parentReferenceID);
      this.getFindingsData();
    })
  }
  loadLovs(DeviceID) {
    let arr = this.accordionData.FindingsLovs[0][Enums.FlowIsolationProductId[DeviceID]];
    this.localServiceSdr.getLookups(arr).then((item) => {
      this.allLOVsByDevice = [];
      this.allLOVsByDevice = JSON.parse(JSON.stringify(item));
    })
  }
  confirmAlert(isChecked, accordionName, key) {
    if (isChecked == 'true' || isChecked == true) {
      let hasValue = this.checkIfAccordionHasValue(accordionName);
      if (hasValue) {
        let alert = this.alertCtrl.create({
          title: this.translate.instant("Confirm ?"),
          message: this.translate.instant("You will lose the data of this accordion."),
          enableBackdropDismiss: false,
          buttons: [
            {
              text: this.translate.instant('Cancel'),
              handler: () => {
                this.findingsObj[key] = false;
              }
            },
            {
              text: this.translate.instant('OK'),
              handler: () => {
                this.closeAndClearAccordion(accordionName, isChecked);
                this.updateFindingsObject(true, key);
              }
            }
          ]
        });
        alert.present();
      } else {
        if (this.expandOuterAccordion[accordionName] == true) {
          this.expandOuterAccordion[accordionName] = false
        }
        this.updateFindingsObject(true, key);
      }
    } else {
      this.closeAndClearAccordion(accordionName, false);
      this.updateFindingsObject(true, key);
      this.findingsObj[key] = false;
      this.expandOuterAccordion[accordionName] = false;
    }
  }

  updateFindingsObject(isChecked, key) {
    if (key) {
      this.findingsObj[key] = isChecked;
      if (!this.isFindingsValuesChanged) {
        this.isFindingsValuesChanged = true;
      }
    }
  }

  closeAndClearAccordion(accordionName, isChecked) {

    for (let key in this.accordionData[accordionName]) {
      let val: any = this.accordionData[accordionName][key];
      this.findingsObj[val] = isChecked ? "" : this.findingsObj[val];
      if (isChecked) {
        this.expandOuterAccordion[accordionName] = false;
      }
    }
  }

  checkIfAccordionHasValue(accordionName) {
    let hasValue = false;
    hasValue = this.checkIfHasValues(accordionName);
    return hasValue;
  }

  checkIfHasValues(accordionKey) {

    let hasValue = false;
    for (let key in this.accordionData[accordionKey]) {
      let val: any = this.accordionData[accordionKey][key];
      if (this.utilityProvider.isNotNull(this.findingsObj[val])) {
        hasValue = true;
        break;
      }
    }
    return hasValue;
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

  filterArrayData(dataArray, data) {
    dataArray = this.filterData(dataArray, data, this.allLOVsByDevice);
    return dataArray;
  }



  filterData(dataArray, data, arrayToFilter) {
    dataArray = arrayToFilter.filter((item) => {
      return item.LookupType == data
    })
    return dataArray;
  }

  isValidated() {
    this.errorObj = [];

    for (let key in this.accordionData.FindingsData) {
      let element: any = this.accordionData.FindingsData[key];
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
    if (this.isValidated()) {
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
        this.localServiceSdr.insertOrUpdateData(this.findingsObj, this.isFindingsRecordExists, 'FI_PK_ID', 'FINDINGSFLOWISOLATION').then((res): any => {
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
      this.localServiceSdr.getActuationdata(this.findingsObj.REPORTID, 'FINDINGSFLOWISOLATION', 'getFindingsData').then((res: any[]) => {
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

}
