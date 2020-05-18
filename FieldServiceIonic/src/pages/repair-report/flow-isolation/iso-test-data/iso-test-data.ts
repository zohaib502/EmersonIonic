import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { UtilityProvider } from '../../../../providers/utility/utility';
import * as Enums from '../../../../enums/enums';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { AccordionData } from '../../../../beans/AccordionData'
import { ValueProvider } from '../../../../providers/value/value';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { TranslateService } from '@ngx-translate/core';
// import { timestamp } from 'rxjs/operators';
@IonicPage()
@Component({
  selector: 'page-iso-test-data',
  templateUrl: 'iso-test-data.html',
})
export class IsoTestDataPage {
  testDataObj: any = {};
  Enums: any;
  errorObj: any = [];
  deviceID: any;
  fileName: any = 'IsoTestDataPage';
  allLovs: any = [];
  datepickerConfig: Partial<BsDatepickerConfig>;
  @ViewChild('datepicker')
  @ViewChild('dps')
  private _picker: BsDatepickerDirective;
  expandAccordion: boolean;
  toggleAllaccordion: boolean = false;
  expandOuterAccordion: any = {};
  bottomBtnClicked: boolean = false;
  selectedProcess: any;
  recordExists: boolean = false;
  depotRepairTrue:boolean = false;
  accordionData = new AccordionData();
  constructor(public navCtrl: NavController, public navParams: NavParams, public utilityProvider: UtilityProvider, public localServiceSdr: LocalServiceSdrProvider, public valueProvider: ValueProvider, public logger: LoggerProvider, public alertCtrl: AlertController, public translate: TranslateService,public events:Events) {
    this.Enums = Enums;
  }

  ionViewDidEnter() {
    this.toggleAllaccordion = false;
    this.bottomBtnClicked = false;
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Test Data" };

    if (this.valueProvider.getCurrentReport()) {
      this.testDataObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
      this.depotRepairTrue = this.valueProvider.getCurrentReport().DEPOTREPAIR;
      this.getisoTestData();
    }
    this.getDeviceID();
  }
  goToFcr() {
    if (this.checkIfValid() && this.isValidated()) {
      this.save();
      setTimeout(() => {
        this.events.publish("goToFCR");
      }, 100);

    } else {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }
  }
  ionViewWillLeave() {
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    if (this.checkIfValid() && this.isValidated()) {
      this.save();
    } else {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }
  }
  checkIfValid() {
    this.errorObj = [];
    let isValid = true;
    let jsonObj = this.setUOMJson();
    for (let i = 0; i < jsonObj.length; i++) {
      if (this.testDataObj[jsonObj[i][0]] || this.testDataObj[jsonObj[i][1]]) {
        if (!this.testDataObj[jsonObj[i][0]]) {
          this.errorObj[jsonObj[i][0]] = true;
          isValid = false;
        }
        if (!this.testDataObj[jsonObj[i][1]]) {
          this.errorObj[jsonObj[i][1]] = true;
          isValid = false;
        }
        if (this.testDataObj[jsonObj[i][1]] == "No Value") {
          isValid = true;
        }
      }
    }
    return isValid;
  }

  removeNovalue(key) {

    let isValid = false;
    if (this.testDataObj[key]) {
      isValid = true;
    }
    return isValid;
  }
  setUOMJson() {
    return [["BODYBONNETTORQUE", "BODYBONNETTORQUE_UOM"], ["PACKINGTORQUE", "PACKINGTORQUE_UOM"], ["CV_PKG_GSTPRESSURE_PKGGSTPRESSURE", "CV_PKG_GSTPRESSURE_PKGGSTPRESSURE_UOM"], ["TESTPRESSURE", "TESTPRESSURE_UOM"], ["LEAKAGE_ALLOWABLELEAKAGE", "LEAKAGE_ALLOWABLELEAKAGE_UOM"], ["LEAKAGE_ACTUALLEAKAGE", "LEAKAGE_ACTUALLEAKAGE_UOM"], ["HYDROTESTPRESSURE", "HYDROTESTPRESSURE_UOM"]];
  }
  isValidated() {
    this.errorObj = [];
    let accordionData = new AccordionData();
    for (let key in accordionData.allTestData_OTKeys) {
      let element: any = accordionData.allTestData_OTKeys[key];
      if (this.testDataObj[element] == 'Other') {
        if (!this.utilityProvider.isNotNull(this.testDataObj[element + "_OT"])) {
          this.errorObj.push(element + "_OT");
        }
      }

    }
    return this.errorObj.length == 0;
  }
  save() {
    this.localServiceSdr.insertOrUpdateData(this.testDataObj, this.recordExists, 'TD_PK_ID', 'TESTDATAFLOWISOLATION').then((response: any) => {
      if (response) {

      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'save', ' Error in insertUpdateFIReportNotes : ' + JSON.stringify(error));
    });
  }
  getisoTestData() {
    this.localServiceSdr.getActuationdata(this.testDataObj.REPORTID, 'TESTDATAFLOWISOLATION', 'getisoTestData').then((res: any) => {
      if (res.length > 0) {
        if(res[0].TESTDATE)
        res[0].TESTDATE = new Date(res[0].TESTDATE);
        if(res[0].LT_BUILDDATE)
        res[0].LT_BUILDDATE = new Date(res[0].LT_BUILDDATE);
        this.testDataObj = res[0];
        this.recordExists = true;
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getisoTestData', ' Error in getisoTestData : ' + JSON.stringify(error));
    })
    this.utilityProvider.stopSpinner();
  }
  onShowPicker(event) {
    const dayHoverHandler = event.dayHoverHandler;
    const hoverWrapper = (hoverEvent) => {
      const { cell, isHovered } = hoverEvent;

      if ((isHovered &&
        !!navigator.platform &&
        /iPad|iPhone|iPod/.test(navigator.platform)) &&
        'ontouchstart' in window
      ) {
        (this._picker as any)._datepickerRef.instance.daySelectHandler(cell);
      }

      return dayHoverHandler(hoverEvent);
    };
    event.dayHoverHandler = hoverWrapper;
  }
  getDeviceID() {
    this.localServiceSdr.getDEVICEIDForFlowIsolation(this.testDataObj.REPORTID).then((val) => {
      this.deviceID = val;
      if (this.deviceID == Enums.FlowIsolationProductId.ControlValve || this.deviceID == Enums.FlowIsolationProductId.Isolation) {
        this.getLovs();
      }
    })
  }
  getLovs() {
    let arr = ['TestDataBodyBonnetTorqueUnitOfMeasurementFlowIsolation', 'PassFail', 'UnitOfMeasurement', 'SeatLeakFlowIsolation', 'TestDataPressureUnitOfMeasureFlowIsolation', 'TestDataAllowableActualUnitOfMeasurementFlowIsolation', 'HydroTestDurationFlowIsolation', 'HydroTestPressureUnitOfMeasureFlowIsolation'];
    this.localServiceSdr.getLookups(arr).then((item) => {
      this.allLovs = [];
      this.allLovs = JSON.parse(JSON.stringify(item));
    })
  }

  searchModal(data, key) {
    let dataArray: any = [];
    if (this.deviceID == Enums.FlowIsolationProductId.ControlValve || this.deviceID == Enums.FlowIsolationProductId.Isolation) {
      dataArray = this.allLovs.filter((item) => {
        return item.LookupType == data
      })
      let modalKey = key.replace("_UOM", "")
      if (!this.removeNovalue(modalKey)) {
        dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });

      }
      dataArray.push({ "LookupID": -1, "LookupValue": "Other" });
    }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: 'jobids' }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        this.testDataObj[key] = data.LookupValue;
      }
      data = null;
    });
  }
  toggleAccordion() {
    let json = this.setJson()[Enums.FlowIsolationProductId[this.deviceID]];
    let jsonKeys = Object.keys(json);
    if (this.toggleAllaccordion) {
      jsonKeys.forEach(val => {
        if (!json[val])
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
        "PKGGSTPressure": this.testDataObj.CV_PKG_GSTPRESSURE_NA,
        "SeatLeakClass": this.testDataObj.SEATLEAKCLASS_NA,
        "Leakage": this.testDataObj.LEAKAGE_NA,
        "HydroTestPressure": this.testDataObj.HYDROTESTPRESSURE_NA,
      },
      "Isolation":
      {
        "PKGGSTPressure": this.testDataObj.CV_PKG_GSTPRESSURE_NA,
        "SeatLeakClass": this.testDataObj.SEATLEAKCLASS_NA,
        "Leakage": this.testDataObj.LEAKAGE_NA,
        "HydroTestPressure": this.testDataObj.HYDROTESTPRESSURE_NA,
      },

      "LevelTroll":
      {
        "LevelLT": this.testDataObj.LT_RADATA_NA
      }
    }
    return json;
  }
  expandOuter(key) {
    let json = this.setJson()[Enums.FlowIsolationProductId[this.deviceID]];
    // let json = this.getDeviceJson[Enums.FlowIsolationProductId[this.deviceId]];
    if (!json[key]) {
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
    // if (!this.toggleAllaccordion) {
    //   this.expandOuterAccordion[key] = !this.expandOuterAccordion[key];
    //   Object.keys(this.expandOuterAccordion).forEach(element => {
    //     if (element != key) {
    //       this.expandOuterAccordion[element] = false;
    //     }
    //   });
    // } else {
    //   this.expandOuterAccordion[key] = !this.expandOuterAccordion[key];
    // }
  }
  confirmAlert(isChecked, accordionName, key) {
    if (this.toggleAllaccordion) {
      if (isChecked == 'true' || isChecked == true) {
        this.expandOuterAccordion[accordionName] = false;
      } else {
        this.expandOuterAccordion[accordionName] = true;
      }
    }
    if (isChecked == 'true' || isChecked == true) {
      let hasValue = this.checkIfHasValues(accordionName);
      if (hasValue) {
        let alert = this.alertCtrl.create({
          title: this.translate.instant("Confirm ?"),
          message: this.translate.instant("You will lose the data of this accordion."),
          buttons: [
            {
              text: this.translate.instant('Cancel'),
              handler: () => {
                this.testDataObj[key] = false;
              }
            },
            {
              text: this.translate.instant('OK'),
              handler: () => {
                this.closeAndClearAccordion(accordionName, isChecked);
              }
            }
          ]
        });
        alert.present();
      } else {
        if (this.expandOuterAccordion[accordionName] == true) {
          this.expandOuterAccordion[accordionName] = false
        }
      }
    } else {
      this.closeAndClearAccordion(accordionName, false);
    }
  }

  closeAndClearAccordion(accordionName, isChecked) {

    let allDBKeys = this.accordionData.allTestDataKeys[Enums.FlowIsolationProductId[this.deviceID]][accordionName];

    for (let key in allDBKeys) {

      this.testDataObj[allDBKeys[key]] = isChecked ? "" : this.testDataObj[allDBKeys[key]];

      if (isChecked) {

        this.expandOuterAccordion[accordionName] = false;

      }

    }

  }

  // checkIfAccordionHasValue(accordionName) {
  //   let hasValue = false;
  //   hasValue = this.checkifHasValues(accordionName);
  //   return hasValue;
  // }

  checkIfHasValues(accordionName) {

    let allDBKeys = this.accordionData.allTestDataKeys[Enums.FlowIsolationProductId[this.deviceID]][accordionName];

    let hasValue = false;

    for (let key in allDBKeys) {

      if (this.utilityProvider.isNotNull(this.testDataObj[allDBKeys[key]])) {

        hasValue = true;

        break;

      }

    }

    return hasValue;

  }
  redirect(value, doubleIndex) {
    this.bottomBtnClicked = true;
    if (this.checkIfValid() && this.isValidated()) {
      if(doubleIndex == "doubleRightbtn"){
        let index = this.navCtrl.parent.viewCtrl.instance.SDRTabRef.getSelected().index;
          this.navCtrl.parent.select(index + 2);
      }
      else{
        this.utilityProvider.bottomNavigation(this.navCtrl, value);
      }
      
    }
    else {
      this.utilityProvider.presentAlert();
    }
  }
  
}
