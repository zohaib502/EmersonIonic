import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, Events } from 'ionic-angular';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { AccordionData } from '../../../../beans/AccordionData';
import { ValueProvider } from '../../../../providers/value/value';
import * as Enums from '../../../../enums/enums';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-as-found',
  templateUrl: 'as-found.html',
})
export class AsFoundPage {
  fileName: any = 'AsFoundPage';
  header_data: any;
  Oexpanded: boolean = false;
  Iexpanded: boolean = false;
  expandOuterAccordion: any = {};
  expandInnerAccordion: any;
  asFoundObj: any = {};
  asLeftObj: any = {};
  toggleAllaccordion: boolean = false;
  accordionElementKey: any = {};
  asFoundValues: any = [];
  preTestObj: any = {};
  accordionKey: any = {};
  networkTypeValues: any = [];
  protocolsValues: any = [];
  loopTypeValues: any = [];
  asFoundNetworkValues: any = [];
  isAsFoundRecordExists: boolean = false;
  isAsLeftRecordExists: boolean = false;
  isDeviceTestRecordExists: boolean = false;
  isAFValuesChanged: boolean = false; // Making false while entering the component.
  isALValuesChanged: boolean = false;
  isDTValuesChanged: boolean = false;
  // showLoader: boolean = false;
  parentReferenceId: any;
  reportID: any;
  errorObj: any = [];
  selectedProcess: any;
  Enums: any = Enums;
  firstLoad: boolean = true;
  bottomNavBtn: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public appCtrl: App,
    public localServiceSdr: LocalServiceSdrProvider, public valueProvider: ValueProvider,
    public utilityProvider: UtilityProvider, public logger: LoggerProvider, public alertCtrl: AlertController, public translate: TranslateService,
    public events: Events) {

    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.header_data = { title1: "", title2: "As Found", taskId: "" };

  }

  ionViewDidEnter() {
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.handleLoader();
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "As Found" };
    if (this.valueProvider.getCurrentReport()) {
      this.reportID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
    }
    this.asFoundValues = [];
    this.toggleAllaccordion = false;
    this.asFoundObj = {};
    this.asLeftObj = {};
    this.preTestObj = {};
    this.preTestObj = {
      "AIRPRESSUREPRETEST": "",
      "FUNCTIONPRETEST": "",
      "HYDROPRETEST": "",
      "VISUALPRETEST": ""
    };

    // Making false while entering the component.
    this.isAFValuesChanged = false;
    this.isALValuesChanged = false;
    this.isDTValuesChanged = false;
    this.isAsFoundRecordExists = false;
    this.isAsLeftRecordExists = false;
    this.isDeviceTestRecordExists = false;

    this.asFoundObj.REPORTID = this.reportID;
    this.asLeftObj.REPORTID = this.reportID;
    this.preTestObj.REPORTID = this.reportID;

    this.getDeviceTestActuation();
    setTimeout(() => {
      this.getAsFoundActuation();
    }, 100);
    setTimeout(() => {
      this.getAsLeftActuation();
      this.utilityProvider.stopSpinner();
    }, 200);

    setTimeout(() => {
      this.localServiceSdr.getProductID(this.reportID).then((val) => {
        this.parentReferenceId = val;

        this.addValues();
        this.addNetworkValues();
        this.addProtocolValues();
        this.addLoopTypeValues();
        this.addAsFoundNetworkValues();
        this.generateAccordionKeys();
        this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });
      });
    })
    // setTimeout(function(){ this.showLoader = false }, 4000);
  }

  handleLoader() {
    if (this.firstLoad) {
      this.utilityProvider.showSpinner();
      this.firstLoad = false;
    }
  }

  generateAccordionKeys() {
    let accordionData = new AccordionData();
    for (let key in accordionData.AccordionKeys) {
      let val: any = accordionData.AccordionKeys[key];
      this.expandOuterAccordion[val] = false;
    }
  }

  expandInner(key) {
    if (this.expandInnerAccordion == key) {
      this.expandInnerAccordion = "";
    }
    else {
      this.expandInnerAccordion = key;
    }
  }

  expandOuter(key) {
    this.expandInnerAccordion = {};
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

  /**
  * @author: Narsimha (06/12/2019)
  * Unsubscribe all events here (if exists).
  * App Optimization
  * @memberof AsFoundPage
  */
  ionViewWillLeave(): void {
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    if (this.isValidated()) {
      this.insertAsFoundData();
      setTimeout(() => {
        this.insertAsLeftNAData();
      }, 100);
      setTimeout(() => {
        this.insertDeviceTestActuation();
      }, 200);
    } else {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }
  }

  setJson() {
    let json = {
      "GearboxHousing": this.asFoundObj.G_HOUSINGFRAME_NA,
      "GearboxSpurGear": this.asFoundObj.G_SPURGEAR_NA,
      "GearBoxAccessories": this.asFoundObj.G_ACCESSORIES_NA,
      "GearboxMounting": this.asFoundObj.G_MOUNTINGHARDWAREADAPTION_NA,
      "Unit": this.asFoundObj.PH_UNIT_NA,
      "DriveModule": this.asFoundObj.PH_DRIVEMODULE_NA,
      "SpringModule": this.asFoundObj.PH_SPRINGMODULE_NA,
      "PowerModule": this.asFoundObj.PH_POWERMODULE_NA,
      "PowerSwivelModule": this.asFoundObj.PH_POWERSWIVELMODULE_NA,
      "Tubing": this.asFoundObj.PH_TUBING_NA,
      "ActuatorMountingHardware": this.asFoundObj.PH_MOUNTINGHARDWAREADAPTION_NA,
      "ActuatorOverrides": this.asFoundObj.PH_OVERRIDES_NA,
      "VOS": this.asFoundObj.PH_VOSVALVEOPERATINGSYSTEM_NA,
      "ActuatorAccessories": this.asFoundObj.PH_ACCESSORIES_NA,
      "ActuatorOther": this.asFoundObj.PH_OTHER_NA,
      "HousingFrame": this.asFoundObj.AE_HOUSINGFRAME_NA,
      "MotorSubAssembly": this.asFoundObj.AE_MOTORSUBASSEMBLY_NA,
      "Controls": this.asFoundObj.AE_CONTROLSELECTRONICS_NA,
      "Enclosure": this.asFoundObj.AE_ENCLOSURE_NA,
      "SCM": this.asFoundObj.AE_SCMSEPARATECONTROLMODULE_NA,
      "ElectricOverides": this.asFoundObj.AE_OVERRIDES_NA,
      "Gearbox": this.asFoundObj.AE_G_NA,
      "LinearDrive": this.asFoundObj.AE_LINEARDRIVE_NA,
      "ElectricMountingHardware": this.asFoundObj.AE_MOUNTINGHARDWAREADAPTION_NA,
      "failSafe": this.asFoundObj.AE_FAILSAFE_NA,
      "ElectricAccessories": this.asFoundObj.AE_ACCESSORIES_NA,
      "ElectricOther": this.asFoundObj.AE_OTHER_NA
    }
    return json;
  }

  addValues() {
    this.localServiceSdr.getLookupsByLookupType("AsFoundConditionActuation").then((item: any) => {
      this.asFoundValues = JSON.parse(JSON.stringify(item));
      this.asFoundValues.unshift({ "LookupID": -2, "LookupValue": "No Value" });
      this.asFoundValues.push({ "LookupID": -1, "LookupValue": "Other" });
    })
    this.asFoundValues = this.asFoundValues.filter((item) => {
      return _.uniqBy(item, 'LookupValue');
    })
  }

  addNetworkValues() {
    if (this.parentReferenceId == '3') {
      this.localServiceSdr.getLookupsByLookupType("NetworkType").then((item: any) => {
        this.networkTypeValues = JSON.parse(JSON.stringify(item));
        this.networkTypeValues.unshift({ "LookupID": -2, "LookupValue": "No Value" });
        this.networkTypeValues.push({ "LookupID": -1, "LookupValue": "Other" });
      })
    }
  }

  addProtocolValues() {
    if (this.parentReferenceId == '3') {
      this.localServiceSdr.getLookupsByLookupType("Protocols").then((item: any) => {
        this.protocolsValues = JSON.parse(JSON.stringify(item));
        this.protocolsValues.unshift({ "LookupID": -2, "LookupValue": "No Value" });
        this.protocolsValues.push({ "LookupID": -1, "LookupValue": "Other" });
      })
    }
  }

  addLoopTypeValues() {
    if (this.parentReferenceId == '3') {
      this.localServiceSdr.getLookupsByLookupType("LoopType").then((item: any) => {
        this.loopTypeValues = JSON.parse(JSON.stringify(item));
        this.loopTypeValues.unshift({ "LookupID": -2, "LookupValue": "No Value" });
        this.loopTypeValues.push({ "LookupID": -1, "LookupValue": "Other" });
      })
    }
  }

  addAsFoundNetworkValues() {
    if (this.parentReferenceId == '3') {
      this.localServiceSdr.getLookupsByLookupType("AsFoundConditionNetwork").then((item: any) => {
        this.asFoundNetworkValues = JSON.parse(JSON.stringify(item));
        this.asFoundNetworkValues.unshift({ "LookupID": -2, "LookupValue": "No Value" });
        this.asFoundNetworkValues.push({ "LookupID": -1, "LookupValue": "Other" });
      })
    }
  }

  searchModal(data, key) {
    let dataArray: any = [];
    switch (data) {
      case 'jobids':
        dataArray = this.asFoundValues;
        break;
      case 'NetworkType':
        dataArray = this.networkTypeValues;
        break;
      case 'protocols':
        dataArray = this.protocolsValues;
        break;
      case 'LoopType':
        dataArray = this.loopTypeValues;
        break;
      case 'AsFoundNetwork':
        dataArray = this.asFoundNetworkValues;
      default:
        break;
    }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: data }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        this.asFoundObj[key] = data.LookupValue;
        if (!this.isAFValuesChanged) {
          this.isAFValuesChanged = true;
        }

        // Applicable only for nerwork tab - storing values in as left db also
        if (this.parentReferenceId == '3') {
          let keyIs = key.split("_");
          if (keyIs[keyIs.length - 2] == "PROTOCOLS" || keyIs[keyIs.length - 2] == "LOOPTYPE") {
            keyIs[keyIs.length - 1] = "AL";
            if (this.asLeftObj[keyIs.join("_")] == null || this.asLeftObj[keyIs.join("_")] == '') {
              this.asLeftObj[keyIs.join("_")] = data.LookupValue;
              if (!this.isALValuesChanged) {
                this.isALValuesChanged = true;
              }
            }
          }
        }
        if (this.asFoundObj[key] != 'Other') {
          this.asFoundObj[key + "OT"] = "";
        }
      }
      data = null;
    });
  }

  searchModalSet(data, key, accordionName) {
    let dataArray: any = [];
    switch (data) {
      case 'jobids':
        dataArray = this.asFoundValues;
        break;
      case 'NetworkType':
        dataArray = this.networkTypeValues;
        break;
      case 'protocols':
        dataArray = this.protocolsValues;
        break;
      case 'LoopType':
        dataArray = this.loopTypeValues;
        break;
      case 'AsFoundNetwork':
        dataArray = this.asFoundNetworkValues;
      default:
        break;
    }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: data }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        if (!this.isAFValuesChanged) {
          this.isAFValuesChanged = true;
        }
        this.asFoundObj[key] = data.LookupValue;
        if (data.LookupValue == 'No Damage Found' || data.LookupValue == 'N/A' || data.LookupValue == 'Functions properly' || data.LookupValue == 'No Fault Found') {
          this.setAccordionComponents(accordionName);
        }
        if (this.asFoundObj[key] != 'Other') {
          this.asFoundObj[key + "OT"] = "";
        }
      }
      data = null;
    });
  }

  clearAccordion(isChecked, accordionName) {
    switch (accordionName) {
      case 'GearboxMounting':
        this.closeAndClearAccordion('CombinedGearBoxMountingData', accordionName, isChecked);
        break;
      case 'GearboxHousing':
        this.closeAndClearAccordion('CombinedGearBoxHousingData', accordionName, isChecked);
        break;
      case 'GearBoxAccessories':
        this.closeAndClearAccordion('CombinedGearBoxAccessories', accordionName, isChecked);
        break;
      case 'GearboxSpurGear':
        this.closeAndClearAccordion('CombinedGearBoxSpurGear', accordionName, isChecked);
        break;
      case 'NetworkType':
        this.closeAndClearAccordion('CombinedNetworkType', accordionName, isChecked);
        break;
      case 'Unit':
        this.closeAndClearAccordion('CombinedUnit', accordionName, isChecked);
        break;
      case 'DriveModule':
        this.closeAndClearAccordion('CombinedDriveModule', accordionName, isChecked);
        break;
      case 'SpringModule':
        this.closeAndClearAccordion('CombinedSpringModule', accordionName, isChecked);
        break;
      case 'PowerModule':
        this.closeAndClearAccordion('CombinedPowerModule', accordionName, isChecked);
        break;
      case 'PowerSwivelModule':
        this.closeAndClearAccordion('CombinedPowerSwivelModule', accordionName, isChecked);
        break;
      case 'Tubing':
        this.closeAndClearAccordion('CombinedTubing', accordionName, isChecked);
        break;
      case 'ActuatorMountingHardware':
        this.closeAndClearAccordion('CombinedActuatorMounting', accordionName, isChecked);
        break;
      case 'ActuatorOverrides':
        this.closeAndClearAccordion('CombinedActuatorOverrides', accordionName, isChecked);
        break;
      case 'VOS':
        this.closeAndClearAccordion('CombinedVos', accordionName, isChecked);
        break;
      case 'ActuatorAccessories':
        this.closeAndClearAccordion('CombinedActuatorAccessories', accordionName, isChecked);
        break;
      case 'ActuatorOther':
        this.closeAndClearAccordion('CombinedOther', accordionName, isChecked);
        break;
      case 'HousingFrame':
        this.closeAndClearAccordion('CombinedHousingFrame', accordionName, isChecked);
        break;
      case 'MotorSubAssembly':
        this.closeAndClearAccordion('CombinedMotorSubAssembly', accordionName, isChecked);
        break;
      case 'Controls':
        this.closeAndClearAccordion('CombinedControls', accordionName, isChecked);
        break;
      case 'Enclosure':
        this.closeAndClearAccordion('CombinedEnclosure', accordionName, isChecked);
        break;
      case 'SCM':
        this.closeAndClearAccordion('CombinedSCM', accordionName, isChecked);
        break;
      case 'ElectricOverides':
        this.closeAndClearAccordion('CombinedElectricOverides', accordionName, isChecked);
        break;
      case 'Gearbox':
        this.closeAndClearAccordion('CombinedGearbox', accordionName, isChecked);
        break;
      case 'LinearDrive':
        this.closeAndClearAccordion('CombinedLinearDrive', accordionName, isChecked);
        break;
      case 'ElectricMountingHardware':
        this.closeAndClearAccordion('CombinedElectricMountingHardware', accordionName, isChecked);
        break;
      case 'failSafe':
        this.closeAndClearAccordion('CombinedFailSafe', accordionName, isChecked);
        break;
      case 'ElectricAccessories':
        this.closeAndClearAccordion('CombinedElectricAccessories', accordionName, isChecked);
        break;
      case 'ElectricOther':
        this.closeAndClearAccordion('CombinedElectricOther', accordionName, isChecked);
        break;
    }
  }
  closeAndClearAccordion(data, accordionName, isChecked) {
    let accordionData = new AccordionData();
    for (let key in accordionData[data]) {
      let val: any = accordionData[data][key];
      this.asFoundObj[val] = isChecked ? "" : this.asFoundObj[val];
      let disableKey = "disable" + accordionName;
      this.accordionElementKey[disableKey] = isChecked;
      if (isChecked) {
        this.expandOuterAccordion[accordionName] = false;
      }
    }
  }

  checkIfAccordionHasValue(accordionName) {
    let hasValue = false;
    switch (accordionName) {
      case 'GearboxMounting':
        hasValue = this.checkifHasValues('CombinedGearBoxMountingData');
        break;
      case 'GearboxHousing':
        hasValue = this.checkifHasValues('CombinedGearBoxHousingData');
        break;
      case 'GearBoxAccessories':
        hasValue = this.checkifHasValues('CombinedGearBoxAccessories');
        break;
      case 'GearboxSpurGear':
        hasValue = this.checkifHasValues('CombinedGearBoxSpurGear');
        break;
      case 'NetworkType':
        hasValue = this.checkifHasValues('CombinedNetworkType');
        break;
      case 'Unit':
        hasValue = this.checkifHasValues('CombinedUnit');
        break;
      case 'DriveModule':
        hasValue = this.checkifHasValues('CombinedDriveModule');
        break;
      case 'SpringModule':
        hasValue = this.checkifHasValues('CombinedSpringModule');
        break;
      case 'PowerModule':
        hasValue = this.checkifHasValues('CombinedPowerModule');
        break;
      case 'PowerSwivelModule':
        hasValue = this.checkifHasValues('CombinedPowerSwivelModule');
        break;
      case 'Tubing':
        hasValue = this.checkifHasValues('CombinedTubing');
        break;
      case 'ActuatorMountingHardware':
        hasValue = this.checkifHasValues('CombinedActuatorMounting');
        break;
      case 'ActuatorOverrides':
        hasValue = this.checkifHasValues('CombinedActuatorOverrides');
        break;
      case 'VOS':
        hasValue = this.checkifHasValues('CombinedVos');
        break;
      case 'ActuatorAccessories':
        hasValue = this.checkifHasValues('CombinedActuatorAccessories');
        break;
      case 'ActuatorOther':
        hasValue = this.checkifHasValues('CombinedOther');
        break;
      case 'HousingFrame':
        hasValue = this.checkifHasValues('CombinedHousingFrame');
        break;
      case 'MotorSubAssembly':
        hasValue = this.checkifHasValues('CombinedMotorSubAssembly');
        break;
      case 'Controls':
        hasValue = this.checkifHasValues('CombinedControls');
        break;
      case 'Enclosure':
        hasValue = this.checkifHasValues('CombinedEnclosure');
        break;
      case 'SCM':
        hasValue = this.checkifHasValues('CombinedSCM');
        break;
      case 'ElectricOverides':
        hasValue = this.checkifHasValues('CombinedElectricOverides');
        break;
      case 'Gearbox':
        hasValue = this.checkifHasValues('CombinedGearbox');
        break;
      case 'LinearDrive':
        hasValue = this.checkifHasValues('CombinedLinearDrive');
        break;
      case 'ElectricMountingHardware':
        hasValue = this.checkifHasValues('CombinedElectricMountingHardware');
        break;
      case 'failSafe':
        hasValue = this.checkifHasValues('CombinedFailSafe');
        break;
      case 'ElectricAccessories':
        hasValue = this.checkifHasValues('CombinedElectricAccessories');
        break;
      case 'ElectricOther':
        hasValue = this.checkifHasValues('CombinedElectricOther');
        break;
    }
    return hasValue;
  }

  checkifHasValues(accordionKey) {
    let accordionData = new AccordionData();
    let hasValue = false;
    for (let key in accordionData[accordionKey]) {
      let val: any = accordionData[accordionKey][key];
      if (this.utilityProvider.isNotNull(this.asFoundObj[val])) {
        hasValue = true;
        break;
      }
    }
    return hasValue;
  }

  confirmAlert(isChecked, accordionName, key) {
    if (this.toggleAllaccordion) {
      if (isChecked == 'true' || isChecked == true) {
        this.expandOuterAccordion[accordionName] = false;
      }
    }
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
                let asFoundKey = key.replace("_ALNA", "_NA");
                this.asFoundObj[asFoundKey] = false;
                this.clearAccordion(false, '');
              }
            },
            {
              text: this.translate.instant('OK'),
              handler: () => {
                if (!this.toggleAllaccordion) {
                  this.expandInnerAccordion = '';
                }
                this.clearAccordion(true, accordionName);
                this.updateAsLeftObject(true, key);
              }
            }
          ]
        });
        alert.present();
      } else {
        let disableKey = "disable" + accordionName;
        this.accordionElementKey[disableKey] = true;
        if (this.expandOuterAccordion[accordionName] == true) {
          this.expandOuterAccordion[accordionName] = false
        }
        this.updateAsLeftObject(true, key);
      }
    } else {
      this.clearAccordion(false, accordionName);
      this.updateAsLeftObject(false, key);
    }
  }

  updateAsLeftObject(isChecked, key) {
    // For as left table
    // Need to change later
    if (key) {
      this.asLeftObj[key] = isChecked;
      if (!this.isALValuesChanged) {
        this.isALValuesChanged = true;
      }
      if (!this.isAFValuesChanged) {
        this.isAFValuesChanged = true;
      }
    }
  }

  toggleAccordion(event) {
    this.expandInnerAccordion = '';
    if (this.toggleAllaccordion) {
      let accordionData = new AccordionData();
      for (let key in accordionData.AccordionKeys) {
        let val: any = accordionData.AccordionKeys[key];
        let json = this.setJson();
        if (json[val] != true) {
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

  setAccordionComponents(accordionName) {
    let accordionData = new AccordionData();
    switch (accordionName) {
      case 'Unit':
        for (let key in accordionData.unitArr) {
          let val: any = accordionData.unitArr[key];
          this.asFoundObj[val] = this.asFoundObj.PH_UNIT_AF;
        }
        break;
      case 'DriveModule':
        for (let key in accordionData.DriveModuleArr) {
          let val: any = accordionData.DriveModuleArr[key];
          this.asFoundObj[val] = this.asFoundObj.PH_DRIVEMODULE_AF;
        }
        break;
      case 'PowerModule':
        for (let key in accordionData.PowerModuleArr) {
          let val: any = accordionData.PowerModuleArr[key];
          this.asFoundObj[val] = this.asFoundObj.PH_POWERMODULE_AF;
        }
        break;
      case 'PowerSwivelModule':
        for (let key in accordionData.PowerSwivelModuleArr) {
          let val: any = accordionData.PowerSwivelModuleArr[key];
          this.asFoundObj[val] = this.asFoundObj.PH_POWERSWIVELMODULE_AF;
        }
        break;
      case 'MountingHardwareAdaption':
        for (let key in accordionData.MountingHardwareAdaptionArr) {
          let val: any = accordionData.MountingHardwareAdaptionArr[key];
          this.asFoundObj[val] = this.asFoundObj.PH_MOUNTINGHARDWAREADAPTION_AF;
        }
        break;
      case 'Overrides':
        for (let key in accordionData.OverridesArr) {
          let val: any = accordionData.OverridesArr[key];
          this.asFoundObj[val] = this.asFoundObj.PH_OVERRIDES_AF;
        }
        break;
      case 'VOS':
        for (let key in accordionData.VOSArr) {
          let val: any = accordionData.VOSArr[key];
          this.asFoundObj[val] = this.asFoundObj.PH_VOSVALVEOPERATINGSYSTEM_AF;
        }
        break;
      case 'Accessories':
        for (let key in accordionData.AccessoriesArr) {
          let val: any = accordionData.AccessoriesArr[key];
          this.asFoundObj[val] = this.asFoundObj.PH_ACCESSORIES_AF;
        }
        break;
      case 'HousingFrame':
        for (let key in accordionData.HousingFrameArr) {
          let val: any = accordionData.HousingFrameArr[key];
          this.asFoundObj[val] = this.asFoundObj.AE_HOUSINGFRAME_AF;
        }
        break;
      case 'ElectricMotorSubAssembly':
        for (let key in accordionData.MotorSubAssemblyArr) {
          let val: any = accordionData.MotorSubAssemblyArr[key];
          this.asFoundObj[val] = this.asFoundObj.AE_MOTORSUBASSEMBLY_AF;
        }
        break;
      case 'ControlsElectronics':
        for (let key in accordionData.ControlsArr) {
          let val: any = accordionData.ControlsArr[key];
          this.asFoundObj[val] = this.asFoundObj.AE_CONTROLSELECTRONICS_AF;
        }
        break;
      case 'Enclosure':
        for (let key in accordionData.EnclosureArr) {
          let val: any = accordionData.EnclosureArr[key];
          this.asFoundObj[val] = this.asFoundObj.AE_ENCLOSURE_AF;
        }
        break;
      case 'SCM':
        for (let key in accordionData.SCMArr) {
          let val: any = accordionData.SCMArr[key];
          this.asFoundObj[val] = this.asFoundObj.AE_SCMSEPARATECONTROLMODULE_AF;
        }
        break;
      case 'ElectricOverrides':
        for (let key in accordionData.ElectricOverridesArr) {
          let val: any = accordionData.ElectricOverridesArr[key];
          this.asFoundObj[val] = this.asFoundObj.AE_OVERRIDES_AF;
        }
        break;
      case 'Gearbox':
        for (let key in accordionData.GearBoxArr) {
          let val: any = accordionData.GearBoxArr[key];
          this.asFoundObj[val] = this.asFoundObj.AE_G_AF;
        }
        break;
      case 'ElectricMountingHardware':
        for (let key in accordionData.ElectricMountingAdaptionArr) {
          let val: any = accordionData.ElectricMountingAdaptionArr[key];
          this.asFoundObj[val] = this.asFoundObj.AE_MOUNTINGHARDWAREADAPTION_AF;
        }
        break;
      case 'ElectricAccessories':
        for (let key in accordionData.ElectricAccessoriesArr) {
          let val: any = accordionData.ElectricAccessoriesArr[key];
          this.asFoundObj[val] = this.asFoundObj.AE_ACCESSORIES_AF;
        }
        break;
      case 'GearboxHousing':
        for (let key in accordionData.GearBoxHousingFrameArr) {
          let val: any = accordionData.GearBoxHousingFrameArr[key];
          this.asFoundObj[val] = this.asFoundObj.G_HOUSINGFRAME_AF;
        }
        break;
      case 'GearBoxSpurGear':
        for (let key in accordionData.GearBoxSpurGear) {
          let val: any = accordionData.GearBoxSpurGear[key];
          this.asFoundObj[val] = this.asFoundObj.G_SPURGEAR_AF;
        }
        break;
      case 'GearBoxAccessories':
        for (let key in accordionData.GearBoxAccessoriesArr) {
          let val: any = accordionData.GearBoxAccessoriesArr[key];
          this.asFoundObj[val] = this.asFoundObj.G_ACCESSORIES_AF;
        }
        break;
      case 'GearboxMounting':
        for (let key in accordionData.GearBoxMountingArr) {
          let val: any = accordionData.GearBoxMountingArr[key];
          this.asFoundObj[val] = this.asFoundObj.G_MOUNTINGHARDWAREADAPTION_AF;
        }
        break;
    }
  }

  getAsFoundActuation() {
    try {
      this.localServiceSdr.getActuationdata(this.asFoundObj.REPORTID, 'ASFOUNDACTUATION', 'getAsFoundActuation').then((res: any[]) => {
        // console.log(res);
        if (res && res.length) {
          this.isAsFoundRecordExists = true;
          this.asFoundObj = JSON.parse(JSON.stringify(res[0]));
        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getAsFoundActuation', ' Error in insertTime : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.logger.log(this.fileName, "getAsFoundActuation", "Error: " + error.message);
    }
  }

  getDeviceTestActuation() {
    try {
      this.localServiceSdr.getActuationdata(this.preTestObj.REPORTID, 'DEVICETESTACTUATION', 'getDeviceTestActuation').then((res: any[]) => {
        // console.log(res);
        if (res && res.length) {
          this.isDeviceTestRecordExists = true;
          this.preTestObj = JSON.parse(JSON.stringify(res[0]));
        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getDeviceTestActuation', ' Error in insertTime : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.logger.log(this.fileName, "getDeviceTestActuation", "Error: " + error.message);
    }
  }

  // Load as left NA actuation data
  getAsLeftActuation() {
    try {
      this.localServiceSdr.getActuationdata(this.asLeftObj.REPORTID, 'ASLEFTACTUATION', 'getAsLeftActuation').then((res: any[]) => {
        if (res && res.length) {
          this.isAsLeftRecordExists = true;
          // this.asLeftObj["AL_PK_ID"] = res[0].AL_PK_ID;
          this.asLeftObj = JSON.parse(JSON.stringify(res[0]));
        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getAsLeftActuation', ' Error in insertTime : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.logger.log(this.fileName, "getAsLeftActuation", "Error: " + error.message);
    }
  }


  insertAsFoundData() {
    try {

      if (this.isAFValuesChanged) {
        this.localServiceSdr.insertOrUpdateData(this.asFoundObj, this.isAsFoundRecordExists, 'AF_PK_ID', 'ASFOUNDACTUATION').then((res): any => {
          // console.log(res);
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'insertAsFoundData', ' Error in insertTime : ' + JSON.stringify(error));
        });
      }

    } catch (error) {
      this.logger.log(this.fileName, "insertAsFoundData", "Error: " + error.message);
    }
  }

  insertDeviceTestActuation() {
    try {

      if (this.isDTValuesChanged) {
        this.localServiceSdr.insertOrUpdateData(this.preTestObj, this.isDeviceTestRecordExists, 'DTA_PK_ID', 'DEVICETESTACTUATION').then((res): any => {
          // console.log(res);
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'insertDeviceTestActuation', ' Error in insertTime : ' + JSON.stringify(error));
        });
      }

    } catch (error) {
      this.logger.log(this.fileName, "insertDeviceTestActuation", "Error: " + error.message);
    }
  }

  // Inser as left data N/A to DB
  insertAsLeftNAData() {
    try {

      if (this.isALValuesChanged) {
        this.localServiceSdr.insertOrUpdateData(this.asLeftObj, this.isAsLeftRecordExists, 'AL_PK_ID', 'ASLEFTACTUATION').then((res): any => {
          // console.log(res);
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'insertAsLeftNAData', ' Error in insertTime : ' + JSON.stringify(error));
        });
      }

    } catch (error) {
      this.logger.log(this.fileName, "insertAsLeftNAData", "Error: " + error.message);
    }
  }


  redirect(value) {
    if (this.isValidated()) {
      this.utilityProvider.bottomNavigation(this.navCtrl, value);
    } else {
      this.utilityProvider.presentAlert();
    }
  }

  asFoundValChanged(event) {
    if (event.value && !this.isAFValuesChanged) {
      this.isAFValuesChanged = true;
    }
  }

  deviceTestValChanged(event) {
    if (event.value && !this.isDTValuesChanged) {
      this.isDTValuesChanged = true;
    }
  }

  deviceTstChkValChanged(event) {
    if (!this.isDTValuesChanged) {
      this.isDTValuesChanged = true;
    }
  }
  gotofcr() {
    this.events.publish("goToFCR");
  }

  isValidated() {
    this.errorObj = [];
    let accordionData = new AccordionData();
    // let allasfoundKeys=Object.keys(accordionData.allAsfoundColumns[0])
    for (let key in accordionData.AsFoundData) {
      let element: any = accordionData.AsFoundData[key];
      if (this.asFoundObj[element] == 'Other') {
        if (!this.utilityProvider.isNotNull(this.asFoundObj[element + "OT"])) {
          this.errorObj.push(element + "OT");
        }
      }

    }
    return this.errorObj.length == 0;
  }
  changeNetworkType(key) {
    let asleftKey = key.replace("_AFOT", "_ALOT");
    this.asLeftObj[asleftKey] = this.asFoundObj[key];
  }

}
