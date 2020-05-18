import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { UtilityProvider } from '../../../../providers/utility/utility';
import * as Enums from '../../../../enums/enums';
import { ValueProvider } from '../../../../providers/value/value';
@IonicPage()
@Component({
  selector: 'page-calibration-configration',
  templateUrl: 'calibration-configration.html',
})
export class CalibrationConfigrationPage {
  fileName = "CalibrationConfigrationPage";
  data = [];
  type: any;
  temp = null;
  caliconfdata: any = {};
  showData = [];
  elementOther: boolean = false;
  optionOther: boolean = false;
  directionOther: boolean = false;
  conditionOther: boolean = false;
  isChecked: boolean = false;
  addbutton: boolean;
  selectedProcess: any;
  Enums: any = Enums;
  firstLoad: boolean = true;
  prevDeviceSelected: any;
  bottomNavBtn: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public valueProvider: ValueProvider, public events: Events,
    public localservicesdr: LocalServiceSdrProvider, public logger: LoggerProvider, public utilityProvider: UtilityProvider, public appCtrl: App) {
  }
  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });

    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Calibration/Configuration" };
    if (this.valueProvider.getCurrentReport()) {
      this.caliconfdata.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
    }
    this.selectCalibrationData();
    this.getElementData();
    this.getOptionsData();
    this.getDirectionData();
    this.getConditionData();
  }

  ionViewDidLoad() {
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    // console.log('ionViewDidLoad CalibrationConfigrationPage');
  }

  ionViewWillLeave(): void {
    // console.log('ionViewWillLeave');
  }

  /**
   *@author: Prateek 03/13/2019
   *Fetch Final list data on the basis of primary key of device actuation table.
   */

  getElementData() {
    this.localservicesdr.getLookupsByLookupType(Enums.LookUpsType.element).then((response: any[]) => {
      if (response.length > 0) {
        this.data['element'] = response
        this.data['element'].unshift({ "LookupID": -2, "LookupValue": "No Value" })
        this.type = "element"
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getElementData', ' Error in getElementData : ' + JSON.stringify(error));
    });
  }

  getOptionsData() {
    this.localservicesdr.getLookupsByLookupType(Enums.LookUpsType.option).then((response: any[]) => {
      if (response.length > 0) {
        this.data['option'] = response
        this.data['option'].unshift({ "LookupID": -2, "LookupValue": "No Value" })
        this.type = "option"
      }
      // this.utilityProvider.stopSpinner();
    }).catch((error: any) => {
      // this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getOptionsData', ' Error in getOptionsData : ' + JSON.stringify(error));
    });
  }
  getDirectionData() {
    this.data = [];
    this.localservicesdr.getLookupsByLookupType(Enums.LookUpsType.direction).then((response: any[]) => {
      if (response.length > 0) {
        this.data['direction'] = response
        this.data['direction'].unshift({ "LookupID": -2, "LookupValue": "No Value" })
        this.type = "direction"
      }
      // this.utilityProvider.stopSpinner();
    }).catch((error: any) => {
      // this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getDirectionData', ' Error in getDirectionData : ' + JSON.stringify(error));
    });
  }

  getConditionData() {
    this.data = [];
    this.localservicesdr.getLookupsByLookupType(Enums.LookUpsType.condition).then((response: any[]) => {
      if (response.length > 0) {
        this.data['condition'] = response
        this.data['condition'].unshift({ "LookupID": -2, "LookupValue": "No Value" })
        this.type = "condition"
      }
      // this.utilityProvider.stopSpinner();
    }).catch((error: any) => {
      // this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getDirectionData', ' Error in getDirectionData : ' + JSON.stringify(error));
    });
  }
  showModel(type) {
    let searchModal
    // switch (type) {
    //   case 'element':
      //     this.getElementData();
      //     break;
      //   case 'option':
      //     this.getOptionsData();
      //     break;
      //   case 'direction':
      //     this.getDirectionData();
      //     break;
      //   case 'condition':
      //     this.getConditionData();
    //     break;
    // }
    //setTimeout(() => {
      searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: this.data[type], type: type, hasother: true }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
      searchModal.present();
      searchModal.onDidDismiss(data => {
        switch (type) {
          case 'element':
            if (data.LookupValue == 'Other') {
              this.elementOther = true;
              this.addbutton = true;
            }
            else {
              this.elementOther = false;
              this.addbutton = false;
              this.caliconfdata.ELEMENT_OTHER = null
            }
            this.caliconfdata.CA_ELEMENT = data.LookupValue;
            break;
          case 'option':
            if (data.LookupValue == 'Other') {
              this.optionOther = true;
              this.addbutton = true;
            }
            else {
              this.optionOther = false;
              this.addbutton = false;
              this.caliconfdata.OPTION_OTHER = null;
            }
            this.caliconfdata.CA_OPTION = data.LookupValue
            break;
          case 'direction':
            if (data.LookupValue == 'Other') {
              this.directionOther = true;
              this.addbutton = true;
            }
            else {
              this.directionOther = false;
              this.addbutton = false;
              this.caliconfdata.DIRECTION_OTHER = null;
            }
            this.caliconfdata.DIRECTION = data.LookupValue
            break;
          case 'condition':
            if (data.LookupValue == 'Other') {
              this.conditionOther = true;
              this.addbutton = true;
            }
            else {
              this.conditionOther = false;
              this.addbutton = false;
              this.caliconfdata.CONDITION_OTHER = null;
            }
            this.caliconfdata.CONDITION = data.LookupValue
            break;
        }
      })
    //}, 200);
  }

  insertCalibrationData() {
    if(this.caliconfdata.CA_ELEMENT== 'No Value'){
      this.caliconfdata.CA_ELEMENT = null;
    } 
    if(this.caliconfdata.CA_OPTION== 'No Value'){
      this.caliconfdata.CA_OPTION = null;
    } 
    if(this.caliconfdata.DIRECTION== 'No Value'){
      this.caliconfdata.DIRECTION = null;
    } 
    if(this.caliconfdata.CONDITION== 'No Value'){
      this.caliconfdata.CONDITION = null;
    } 


    this.localservicesdr.insertCalibrationBatch(this.caliconfdata).then((res: any) => {
      this.selectCalibrationData();
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'insertCalibrationData', ' Error in insertCalibrationData : ' + JSON.stringify(error));
    })
  }

  selectCalibrationData() {
    this.localservicesdr.getCalibrationData(this.caliconfdata.REPORTID).then((res: any) => {

      this.showData = res;
      this.caliconfdata.CA_PK_ID = null
      this.caliconfdata.CA_ELEMENT = null
      this.caliconfdata.ELEMENT_OTHER = null
      this.caliconfdata.OPTION_OTHER = null
      this.caliconfdata.CA_OPTION = null
      this.caliconfdata.DIRECTION_OTHER = null
      this.caliconfdata.DIRECTION = null
      this.caliconfdata.CONDITION_OTHER = null
      this.caliconfdata.CONDITION = null;
      this.elementOther = false;
      this.optionOther = false;
      this.conditionOther = false;
      this.directionOther = false;
      this.isChecked = false;
      this.temp = null

    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getCalibrationData', ' Error in getCalibrationData : ' + JSON.stringify(error));
    })
  }

  deleteData(value) {
    this.localservicesdr.deleteCalibrationData(value).then((res: any) => {
      this.selectCalibrationData();
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getCalibrationData', ' Error in getCalibrationData : ' + JSON.stringify(error));
    })
  }

  selectCheckBox(ev) {
    if (ev.value == true) {
      this.isChecked = true
      this.caliconfdata.CA_ELEMENT = 'N/A';
      this.caliconfdata.CA_OPTION = 'N/A';
      this.caliconfdata.DIRECTION = 'N/A';
      this.caliconfdata.CONDITION = 'N/A';
      this.caliconfdata.CA_RESULT = 'N/A';
      this.caliconfdata.RECOMMENDEDACTION = 'N/A';
      this.elementOther = false;
      this.optionOther = false;
      this.conditionOther = false;
      this.directionOther = false;
      this.caliconfdata.ELEMENT_OTHER = null
      this.caliconfdata.OPTION_OTHER = null
      this.caliconfdata.DIRECTION_OTHER = null
      this.caliconfdata.CONDITION_OTHER = null;
      // this.temp = "dummy"
      //this.finallistdata.DONEFUNCTIONPOSTTEST = 'y'
    }
    else {
      this.isChecked = false;
      this.caliconfdata.CA_ELEMENT = null;
      this.caliconfdata.CA_OPTION = null;
      this.caliconfdata.DIRECTION = null;
      this.caliconfdata.CONDITION = null;
      this.caliconfdata.CA_RESULT = null;
      this.caliconfdata.RECOMMENDEDACTION = null;
    }

  }

  tabRedirect(value) {
    let parentRefId = this.valueProvider.getDeviceType();
    this.utilityProvider.bottomNavigation(this.navCtrl, value);
    if (value == 'solution') {
      this.handleLoader(parentRefId);
    }
  }

  handleLoader(parentRefId) {
    if (this.firstLoad || this.prevDeviceSelected != parentRefId) {
      this.utilityProvider.showSpinner();
      this.firstLoad = false;
      this.prevDeviceSelected = parentRefId;
      setTimeout(() => {
        this.utilityProvider.stopSpinner();
      }, 1000);
    }
  }

  gotofcr() {
    this.events.publish("goToFCR");
    this.utilityProvider.stopSpinner();
  }
}
