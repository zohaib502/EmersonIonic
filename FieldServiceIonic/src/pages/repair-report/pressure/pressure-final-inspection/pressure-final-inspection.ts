import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import * as Enums from '../../../../enums/enums';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { AccordionData } from '../../../../beans/AccordionData';
import { ValueProvider } from '../../../../providers/value/value';
import { LoggerProvider } from '../../../../providers/logger/logger';
/**
 * Generated class for the PressureFinalInspectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pressure-final-inspection',
  templateUrl: 'pressure-final-inspection.html',
})
export class PressureFinalInspectionPage {
  showLoader: boolean = false;
  Enums: any;
  fileName: any = 'FinalInspectionPressureFlow';
  isRecordExists: boolean = false;
  bottomBtnClicked: boolean = false;
  Lookups: any = [];
  errorObj: any = [];
  bottomNavBtn: any;
  FinalInspectionObj: any = {
    FIPF_PK_ID: null,
    REPORTID: null
  };
  selectedProcess: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public localServiceSdr: LocalServiceSdrProvider,
    public valueProvider: ValueProvider,
    public utilityProvider: UtilityProvider,
    public logger: LoggerProvider, public events: Events) {
    this.Enums = Enums;
    this.getLovs();
  }

  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Final Inspection" };
    this.FinalInspectionObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
    this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
    this.getExistingData();
    this.getSDRReport();
  }

  getSDRReport() {
    if (this.FinalInspectionObj.REPORTID) {
      this.localServiceSdr.getSdrReport(this.FinalInspectionObj.REPORTID).then((response: any[]) => {
        if (response) {
          const sdrReportObj = response[0];
          this.FinalInspectionObj.REPAIR_DATE = sdrReportObj.REPAIRDATE;
          this.Lookups.filter((item) => {
            if (item.LookupID == sdrReportObj.SERVICESITE) {
              this.FinalInspectionObj.REPAIRED_BY = item.LookupValue;
            }
          });
        }
      }).catch((error: any) => {
      });
    }
  }

  getLovs() {
    const accordionData = new AccordionData();
    this.localServiceSdr.getLookups(accordionData.finalInspectionPressureLovs).then((res: any) => {
      this.Lookups = [];
      this.Lookups = JSON.parse(JSON.stringify(res));
    }).catch((error: any) => {
      this.logger.log(this.fileName, "getLookups", " Error in getLookups : " + JSON.stringify(error));
    });
  }

  ionViewWillLeave() {
    this.insertData();
    if (this.errorObj.length > 0) {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }
  }

  getExistingData() {
    this.localServiceSdr.getFinalInspectionPressureData(this.FinalInspectionObj.REPORTID).then((res: any): any => {
      if (res && res.length) {
        this.isRecordExists = true;
        this.FinalInspectionObj = JSON.parse(JSON.stringify(res[0]));
        this.addNoValueToUOM();
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getExistingData', ' Error in getExistingData : ' + JSON.stringify(error));
    });
  }

  addNoValueToUOM() {
    for (const key in this.FinalInspectionObj) {
      if (key.indexOf("_UOM") == key.length - 4) {
        const nonUOMKey = key.substring(0, key.indexOf("_UOM"));
        if (this.showValidationClass(this.FinalInspectionObj[nonUOMKey]) && !this.FinalInspectionObj[key]) {
          this.FinalInspectionObj[key] = 'No Value';
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
        this.FinalInspectionObj[key] = data.LookupValue;
      }
    });
  }

  manageOtherValueValidation(key) {
    if (key.indexOf("_OT") == key.length - 3) {
      const nonOtherKey = key.substring(0, key.indexOf("_OT"));
      if (this.FinalInspectionObj[nonOtherKey] == 'Other' && !this.FinalInspectionObj[key]) {
        this.errorObj.push(key);
      }
    }
  }

  insertData() {
    this.errorObj = [];
    //validate FinalInspectionObj
    for (const a in this.FinalInspectionObj) {
      this.manageOtherValueValidation(a);
    }

    if (
      this.showValidationClass(this.FinalInspectionObj.SET_PRESSURE) &&
      !this.FinalInspectionObj.SET_PRESSURE_UOM
    ) {
      this.errorObj.push('SET_PRESSURE_UOM');
    }
    if (
      this.showValidationClass(this.FinalInspectionObj.BACK_PRESSURE) &&
      !this.FinalInspectionObj.BACK_PRESSURE_UOM
    ) {
      this.errorObj.push('BACK_PRESSURE_UOM');
    }
    if (
      this.showValidationClass(this.FinalInspectionObj.CAPACITY) &&
      !this.FinalInspectionObj.CAPACITY_UOM
    ) {
      this.errorObj.push('CAPACITY_UOM');
    }
    if (
      this.showValidationClass(this.FinalInspectionObj.CDTP) &&
      !this.FinalInspectionObj.CDTP_UOM
    ) {
      this.errorObj.push('CDTP_UOM');
    }

    if (this.errorObj.length > 0) {
      return;
    }

    this.localServiceSdr.insertOrUpdateData(this.FinalInspectionObj, this.isRecordExists, 'FIPF_PK_ID', 'FINALINSPECTIONPRESSUREFLOW').then((res): any => {
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'insertData', ' Error in insertData : ' + JSON.stringify(error));
    });
  }

  showValidationClass(value) {
    if (value) {
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
