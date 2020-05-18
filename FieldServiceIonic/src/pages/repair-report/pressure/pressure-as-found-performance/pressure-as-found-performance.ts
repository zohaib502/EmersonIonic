import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { AccordionData } from '../../../../beans/AccordionData';
import * as Enums from '../../../../enums/enums';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { ValueProvider } from '../../../../providers/value/value';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerDirective, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

/**
 * Generated class for the PressureAsFoundPerformancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pressure-as-found-performance',
  templateUrl: 'pressure-as-found-performance.html',
})
export class PressureAsFoundPerformancePage {

  showLoader: boolean = false;
  toggleAllaccordion: boolean = false;
  expandOuterAccordion: any = {};
  Enums: any;
  fileName: any = 'AsFoundPerformance_Pressure_Tab';
  isRecordExists: boolean = false;
  bottomBtnClicked: boolean = false;
  Lookups: any = [];
  errorObj: any = [];
  datepickerConfig: Partial<BsDatepickerConfig>;
  accordionData = new AccordionData();
  bottomNavBtn: any;
  @ViewChild('dateCompleted')
  _picker: BsDatepickerDirective;
  AsFoundPerformanceObj: any = {
    AFPPF_PK_ID: null,
    PRE_TEST_DATA_FIRST_POP_PRESSURE_UOM: null,
    PRE_TEST_DATA_SECOND_POP_PRESSURE_UOM: null,
    PRE_TEST_DATA_THIRD_POP_PRESSURE_UOM: null,
    PRE_TEST_DATA_PRE_OPEN_PRESSURE_UOM: null,
    PRE_TEST_DATA_SEAT_TIGHTNESS_PRESSURE_UOM: null,
    PRE_TEST_DATA_BACK_PRESSURE_TEST_PRESSURE_UOM: null
  };
  selectedProcess: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public localServiceSdr: LocalServiceSdrProvider,
    public valueProvider: ValueProvider,
    public utilityProvider: UtilityProvider,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public bsDatepickerConfig: BsDatepickerConfig,
    public logger: LoggerProvider, public events: Events) {
    this.Enums = Enums;
    this.getLovs();
  }

  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "As Found Performance" };
    this.AsFoundPerformanceObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
    this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
    this.generateAccordionKeys();
    this.getExistingData();
    this.toggleAllaccordion = false;
  }

  getLovs() {
    this.localServiceSdr.getLookups(this.accordionData.AsFoundPerformancePressureLovs).then((res: any) => {
      this.Lookups = [];
      this.Lookups = JSON.parse(JSON.stringify(res));
    }).catch((error: any) => {
      this.logger.log(this.fileName, "getLookups", " Error in getLookups : " + JSON.stringify(error));
    });
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

  ionViewWillLeave() {
    this.insertData();
    if (this.errorObj.length > 0) {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }
  }

  generateAccordionKeys() {
    for (let key in this.accordionData.AccordionKeys) {
      let val: any = this.accordionData.AccordionKeys[key];
      this.expandOuterAccordion[val] = false;
    }
  }

  getExistingData() {
    this.localServiceSdr.getAsFoundPerformanceData(this.AsFoundPerformanceObj.REPORTID).then((res: any): any => {
      if (res && res.length) {
        this.isRecordExists = true;
        this.AsFoundPerformanceObj = JSON.parse(JSON.stringify(res[0]));
        this.addNoValueToUOM();
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getExistingData', ' Error in getExistingData : ' + JSON.stringify(error));
    });
  }

  addNoValueToUOM() {
    for (const key in this.AsFoundPerformanceObj) {
      if (key.indexOf("_UOM") == key.length - 4) {
        const nonUOMKey = key.substring(0, key.indexOf("_UOM"));
        if (this.showValidationClass(this.AsFoundPerformanceObj[nonUOMKey]) && !this.AsFoundPerformanceObj[key]) {
          this.AsFoundPerformanceObj[key] = 'No Value';
        }
      }
    }
  }

  searchModal(elementName, key) {
    let dataArray = this.Lookups.filter((item) => {
      return item.LookupType == elementName
    });
    dataArray.push({ "LookupID": -1, "LookupValue": "Other" });
    dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });

    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: 'lookups' }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        this.AsFoundPerformanceObj[key] = data.LookupValue;
      }
    });
  }

  toggleAccordion(event) {
    if (this.toggleAllaccordion) {
      for (let key in this.accordionData.AccordionKeys) {
        let val: any = this.accordionData.AccordionKeys[key];
        if (!this.AsFoundPerformanceObj[val + "_NA"] || this.AsFoundPerformanceObj[val + "_NA"] == 'false' || this.AsFoundPerformanceObj[val + "_NA"] == false) {
          this.expandOuterAccordion[val] = true;
        }
      }
    } else {
      let accordionData = new AccordionData();
      for (let key in accordionData.AccordionKeys) {
        let val: any = accordionData.AccordionKeys[key];
        this.expandOuterAccordion[val] = false;
      }
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
  }

  confirmAlert($event, accordionName) {
    let isChecked = $event.target.checked;
    if (this.toggleAllaccordion) {
      this.expandOuterAccordion[accordionName] = !isChecked;
    }
    if (isChecked == true) {
      let hasValue = this.checkIfAccordionHasValue(accordionName);
      if (hasValue) {
        let alert = this.alertCtrl.create({
          title: this.translate.instant("Confirm ?"),
          message: this.translate.instant("You will lose the data of this accordion."),
          buttons: [
            {
              text: this.translate.instant('Cancel'),
              handler: () => {
                this.AsFoundPerformanceObj[accordionName + '_' + accordionName + "_NA"] = false;
              }
            },
            {
              text: this.translate.instant('OK'),
              handler: () => {
                this.clearAccordion(accordionName);
                if (this.expandOuterAccordion[accordionName] == true) {
                  this.expandOuterAccordion[accordionName] = false
                }
                this.AsFoundPerformanceObj[accordionName + '_' + accordionName + "_NA"] = true;
              }
            }
          ]
        });
        alert.present();
      } else {
        if (this.expandOuterAccordion[accordionName] == true) {
          this.expandOuterAccordion[accordionName] = false
        }
        this.AsFoundPerformanceObj[accordionName + '_' + accordionName + "_NA"] = isChecked;
      }
    } else {
      this.AsFoundPerformanceObj[accordionName + '_' + accordionName + "_NA"] = isChecked;
      this.clearAccordion(accordionName);
    }
  }

  checkIfAccordionHasValue(accordionName) {
    let hasValue = false;
    for (const k in this.AsFoundPerformanceObj) {
      if (k.indexOf(accordionName) == 0) {
        if (this.AsFoundPerformanceObj[k] != '' && this.AsFoundPerformanceObj[k] != null) {
          hasValue = true;
          break;
        }
      }
    }
    return hasValue;
  }

  clearAccordion(accordionName) {
    for (const k in this.AsFoundPerformanceObj) {
      if (k.indexOf(accordionName) == 0) {
        this.AsFoundPerformanceObj[k] = null;
      }
    }
  }

  manageOtherValueValidation(key) {
    if (key.indexOf("_OT") == key.length - 3) {
      const nonOtherKey = key.substring(0, key.indexOf("_OT"));
      if (this.AsFoundPerformanceObj[nonOtherKey] == 'Other' && !this.AsFoundPerformanceObj[key]) {
        this.errorObj.push(key);
      }
    }
  }

  manageUOMValidation(key) {
    if (key.indexOf("_UOM") == key.length - 4) {
      const nonUOMKey = key.substring(0, key.indexOf("_UOM"));
      if (this.showValidationClass(this.AsFoundPerformanceObj[nonUOMKey]) && !this.AsFoundPerformanceObj[key]) {
        this.errorObj.push(key);
      }
      if (this.showValidationClass(this.AsFoundPerformanceObj[key]) && !this.AsFoundPerformanceObj[nonUOMKey]) {
        this.errorObj.push(nonUOMKey);
      }
    }
  }

  deleteBackPressureData() {
    if (!this.AsFoundPerformanceObj.PRE_TEST_DATA_BACK_PRESSURE) {
      this.AsFoundPerformanceObj.PRE_TEST_DATA_BACK_PRESSURE_TEST_PRESSURE = null;
      this.AsFoundPerformanceObj.PRE_TEST_DATA_BACK_PRESSURE_TEST_PRESSURE_UOM = null;
      if (this.errorObj.indexOf('PRE_TEST_DATA_BACK_PRESSURE_TEST_PRESSURE_UOM') != -1) {
        this.errorObj.splice(this.errorObj.indexOf('PRE_TEST_DATA_BACK_PRESSURE_TEST_PRESSURE_UOM'), 1);
      }
    }
  }

  insertData() {
    this.errorObj = [];

    for (const a in this.AsFoundPerformanceObj) {
      this.manageOtherValueValidation(a);
      this.manageUOMValidation(a);
    }

    if (this.errorObj.length > 0) {
      return;
    }

    this.localServiceSdr.insertOrUpdateData(this.AsFoundPerformanceObj, this.isRecordExists, 'AFPPF_PK_ID', 'ASFOUNDPERFORMANCEPRESSUREFLOW').then((res): any => {
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'insertData', ' Error in insertData : ' + JSON.stringify(error));
    });
  }

  showValidationClass(value) {
    if (value && value != 'No Value') {
      return true;
    }
    return false;
  }

  goToFcr() {
    this.events.publish("goToFCR");
  }

  redirect(value) {
    this.bottomBtnClicked = true;
    this.utilityProvider.bottomNavigation(this.navCtrl, value);
  }
}
