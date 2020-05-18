import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { ValueProvider } from '../../../../providers/value/value';
import * as Enums from '../../../../enums/enums';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { TranslateService } from '@ngx-translate/core';
import { AccordionData } from '../../../../beans/AccordionData';
/**
 * Generated class for the PressureInspectionMeasurementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pressure-inspection-measurement',
  templateUrl: 'pressure-inspection-measurement.html',
})
export class PressureInspectionMeasurementPage {
  imDataObj: any = {};
  selectedProcess: any;
  toggleAllaccordion: boolean = false;
  deviceID: any;
  Enums: any;
  fileName: any = 'PressureInspectionMeasurementPage';
  allLovs: any = [];
  expandOuterAccordion: any = {};
  accordionData = new AccordionData();
  bottomNavBtn: any;
  errorObj: any = [];
  recordExists: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public valueProvider: ValueProvider, public localServiceSdr: LocalServiceSdrProvider, public logger: LoggerProvider, public utilityProvider: UtilityProvider, public alertCtrl: AlertController, public translate: TranslateService, public events: Events) {
    this.Enums = Enums;
  }
  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });
    this.toggleAllaccordion = false;
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Report Notes" };

    if (this.valueProvider.getCurrentReport()) {
      this.imDataObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
      this.getinspectionMmtData();
    }
    this.getDeviceID();
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
  save() {
    this.localServiceSdr.insertOrUpdateData(this.imDataObj, this.recordExists, 'IMPF_PK_ID', 'INSPECTIONMEASUREMENTPRESSUREFLOW').then((response: any) => {
      if (response) {

      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'save', ' Error in insertUpdateFIReportNotes : ' + JSON.stringify(error));
    });
  }
  getinspectionMmtData() {
    this.localServiceSdr.getActuationdata(this.imDataObj.REPORTID, 'INSPECTIONMEASUREMENTPRESSUREFLOW', 'getinspectionMmtData').then((res: any) => {
      if (res.length > 0) {
        this.imDataObj = res[0];
        this.recordExists = true;
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getinspectionMmtData', ' Error in getinspectionMmtData : ' + JSON.stringify(error));
    })
    this.utilityProvider.stopSpinner();
  }
  checkIfValid() {
    this.errorObj = [];
    let isValid = true;
    let jsonObj = this.setUOMJson();
    for (let i = 0; i < jsonObj.length; i++) {
      if (this.imDataObj[jsonObj[i][0]] || this.imDataObj[jsonObj[i][1]]) {
        if (!this.imDataObj[jsonObj[i][0]]) {
          this.errorObj[jsonObj[i][0]] = true;
          isValid = false;
        }
        if (!this.imDataObj[jsonObj[i][1]]) {
          this.errorObj[jsonObj[i][1]] = true;
          isValid = false;
        }
        if (this.imDataObj[jsonObj[i][1]] == "No Value") {
          isValid = true;
        }
      }
    }
    return isValid;
  }
  setUOMJson() {
    return [["SPRINGS_LENGTH","SPRINGS_LENGTH_UOM"],["SPRINGS_DIAMETER","SPRINGS_DIAMETER_UOM"],["SPRINGS_WIRE_DIAMETER","SPRINGS_WIRE_DIAMETER_UOM"],["NOZZLE_HEIGHT_MIN","NOZZLE_HEIGHT_MIN_UOM"],["NOZZLE_HEIGHT_ACTUAL","NOZZLE_HEIGHT_ACTUAL_UOM"],["DISC_HEIGHT_MIN","DISC_HEIGHT_MIN_UOM"],["DISC_HEIGHT_ACTUAL","DISC_HEIGHT_ACTUAL_UOM"],["GUIDE_INSIDE_DIAMETER_MAX","GUIDE_INSIDE_DIAMETER_MAX_UOM"],["GUIDE_INSIDE_DIAMETER_ACTUAL","GUIDE_INSIDE_DIAMETER_ACTUAL_UOM"],["DISC_HOLDER_OUTSIDE_DIAMETER_MIN","DISC_HOLDER_OUTSIDE_DIAMETER_MIN_UOM"],["DISC_HOLDER_OUTSIDE_DIAMETER_ACTUAL","DISC_HOLDER_OUTSIDE_DIAMETER_ACTUAL_UOM"],["ORIFICE_INNER_DIAMETER_VALUE","ORIFICE_INNER_DIAMETER_VALUE_UOM"],["SEAT_INSIDE_STEP","SEAT_INSIDE_STEP_UOM"],["SEAT_OUTSIDE_STEP","SEAT_OUTSIDE_STEP_UOM"],["SEAT_ID","SEAT_ID_UOM"],["SEAT_OD","SEAT_OD_UOM"]];
  }
  isValidated() {
    this.errorObj = [];
    for (let key in this.accordionData.imDataKeys) {
      let element: any = this.accordionData.imDataKeys[key];
      for (let val in element) {
      if (this.imDataObj[element[val]] == 'Other') {
        if (!this.utilityProvider.isNotNull(this.imDataObj[[element[val]] + "_OT"])) {
          this.errorObj.push(val + "_OT");
        }
      }
    }
    }
    return this.errorObj.length == 0;
  }
  getDeviceID() {
    this.localServiceSdr.getDEVICEIDForFlowIsolation(this.imDataObj.REPORTID).then((val) => {
      this.deviceID = val;
 //     if (this.deviceID == Enums.FlowIsolationProductId.ControlValve || this.deviceID == Enums.FlowIsolationProductId.Isolation) {
        this.getLovs();
   //   }
    })
  }
  getLovs() {
    let arr = ['SpringMaterial','UnitOfMeasurementLength'];
    this.localServiceSdr.getLookups(arr).then((item) => {
      this.allLovs = [];
      this.allLovs = JSON.parse(JSON.stringify(item));
    })
  }
  searchModal(data, key) {
    let dataArray: any = [];
    //  if (this.deviceID == Enums.FlowIsolationProductId.ControlValve || this.deviceID == Enums.FlowIsolationProductId.Isolation) {
    dataArray = this.allLovs.filter((item) => {
      return item.LookupType == data
    })
         let modalKey = key.replace("_UOM", "")
         if (!this.removeNovalue(modalKey)) {
    dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
     }
    dataArray.push({ "LookupID": -1, "LookupValue": "Other" });
    //  }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: 'jobids' }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        this.imDataObj[key] = data.LookupValue;
      }
      data = null;
    });
  }
  
  toggleAccordion() {
    let json = this.setJson();
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
      "Springs": this.imDataObj.SPRINGS_SPRINGS_NA,
      "NozzleHeight":this.imDataObj.NOZZLE_HEIGHT_NOZZLE_HEIGHT_NA,
      "DiscHeight":this.imDataObj.DISC_HEIGHT_DISC_HEIGHT_NA,  
      "GuideInsideDiameter":this.imDataObj.GUIDE_INSIDE_DIAMETER_GUIDE_INSIDE_DIAMETER_NA,
      "DiscHolderOutsideDiameter":this.imDataObj.DISC_HOLDER_OUTSIDE_DIAMETER_DISC_HOLDER_OUTSIDE_DIAMETER_NA,
      "OrificeInnerDiameter":this.imDataObj.ORIFICE_INNER_DIAMETER_ORIFICE_INNER_DIAMETER_NA,
      "Seat":this.imDataObj.SEAT_SEAT_NA,
      "PerformedBy":this.imDataObj.PERFORMED_BY_PERFORMED_BY_NA  
    }
    return json;
  }
  expandOuter(key) {
    let json = this.setJson();
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
                this.imDataObj[key] = false;
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
  checkIfHasValues(accordionName) {
    let allDBKeys = this.accordionData.imDataKeys[accordionName];
    let hasValue = false;
    for (let key in allDBKeys) {
      if (this.utilityProvider.isNotNull(this.imDataObj[allDBKeys[key]])) {
        hasValue = true;
        break;
      }
    }
    return hasValue;
  }
  closeAndClearAccordion(accordionName, isChecked) {
    let allDBKeys = this.accordionData.imDataKeys[accordionName];
    for (let key in allDBKeys) {
      this.imDataObj[allDBKeys[key]] = isChecked ? "" : this.imDataObj[allDBKeys[key]];
      if (isChecked) {
        this.expandOuterAccordion[accordionName] = false;
      }
    }
  }
  redirect(value) {
    this.utilityProvider.bottomNavigation(this.navCtrl, value);
  }
  removeNovalue(key) {

    let isValid = false;
    if (this.imDataObj[key]) {
      isValid = true;
    }
    return isValid;
  }
}
