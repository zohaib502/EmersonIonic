
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { LocalServiceSdrProvider } from '../../../../../providers/local-service-sdr/local-service-sdr';
import { UtilityProvider } from '../../../../../providers/utility/utility';
import { LoggerProvider } from '../../../../../providers/logger/logger';
import { AccordionData } from '../../../../../beans/AccordionData'
import { ValueProvider } from '../../../../../providers/value/value';
import * as Enums from '../../../../../enums/enums';
import { TranslateService } from '@ngx-translate/core';
// import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'solution-device-type-ph',
  templateUrl: 'solution-device-type-ph.html',
})

export class DeviceTypePhSolution {
  Enums: any = Enums;
  fileName: any = 'DeviceTypePhSolution';
  header_data: any;
  Oexpanded: boolean = false;
  Iexpanded: boolean = false;
  expandOuterAccordion: any = {};
  expandInnerAccordion: any;
  asFoundObj: any = {};
  asLeftObj: any = {};
  recActObj: any = {};
  toggleAllaccordion: boolean = false;
  accordionKey: any = {};
  asFoundValues: any = [];
  networkTypeValues: any = [];
  protocolsValues: any = [];
  loopTypeValues: any = [];
  solutionNetworkValues: any = [];
  solutionRecommendedValues: any = [];
  solutionAsLeftValues: any = [];
  calibrationRecommendedValues: any = [];
  calibrationAsLeftValues: any = [];
  isAsFoundRecordExists: boolean = false;
  isAsLeftRecordExists: boolean = false;
  isRARecordExists: boolean = false;
  isALValuesChanged: boolean = false; // Making false while entering the component.
  isALRAValuesChanged: boolean = false; // Making false while entering the component.
  parentReferenceId: any; // TODO:: this need to be removed later.
  calibrationData = [];
  errorObj: any = [];
  selectedProcess: any;
  firstLoad: boolean = true;
  bottomNavBtn: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public localServiceSdr: LocalServiceSdrProvider, public valueProvider: ValueProvider,
    public utilityProvider: UtilityProvider, public logger: LoggerProvider, public alertCtrl: AlertController, public translate: TranslateService, public events: Events) {

    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.header_data = { title1: "", title2: "As Found", taskId: "" };

  }

  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });

    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.handleLoader();
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Solution" };
    this.solutionRecommendedValues = [];
    this.toggleAllaccordion = false;
    this.solutionAsLeftValues = [];
    this.protocolsValues = [];
    this.loopTypeValues = [];
    this.networkTypeValues = [];
    this.asFoundObj = {};
    this.asLeftObj = {};
    this.recActObj = {};
    // Making false while entering the component.
    this.isALValuesChanged = false;
    this.isALRAValuesChanged = false;
    this.isAsFoundRecordExists = false;
    this.isAsLeftRecordExists = false;
    this.isRARecordExists = false;


    if (this.valueProvider.getCurrentReport()) {
      this.asFoundObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.asLeftObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.recActObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
      // console.log("REPORTID on Solution Page", this.navParams.data.data.REPORTID);
    }
    // this.utilityProvider.stopSpinner();
    setTimeout(() => {
      this.getAsFoundActuation();
    }, 100);
    setTimeout(() => {
      this.getAsLeftActuation();
    }, 200);
    setTimeout(() => {
      this.getRecActionActuation();
      this.utilityProvider.stopSpinner();
    }, 300);
    // setTimeout(() => {
    //   this.clearValuesIfAsFoundChecked();
    // }, 400);
    setTimeout(() => {
      this.localServiceSdr.getProductID(this.valueProvider.getCurrentReport().REPORTID).then((val) => {
        this.parentReferenceId = val;
        this.addValues();
        this.addSolutionAsLeftValues();
        this.addSolutionRecommendedAction();
        this.generateAccordionKeys();
        this.selectCalibrationData();
        this.utilityProvider.stopSpinner();
      });
    });

  }

  handleLoader() {
    if (this.firstLoad) {
      this.utilityProvider.showSpinner();
      this.firstLoad = false;
    }
  }

  ionViewWillLeave(): void {
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    if (this.isValidated()) {
      this.insertAsLeftData();
      setTimeout(() => {
        this.insertAsLeftRAData();
      }, 100);
      setTimeout(() => {
        this.updateCalibrationData();
      }, 200);
    } else {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
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

  addValues() {
    this.localServiceSdr.getLookupsByLookupType("AsFoundConditionActuation").then((item: any) => {
      this.asFoundValues = JSON.parse(JSON.stringify(item));
      this.asFoundValues.unshift({ "LookupID": -2, "LookupValue": "No Value" })
      this.asFoundValues.push({ "LookupID": -1, "LookupValue": "Other" });
    })
  }

  addSolutionAsLeftValues() {
    this.localServiceSdr.getLookupsByLookupType("AsLeftConditionActuation").then((item: any) => {
      this.solutionAsLeftValues = JSON.parse(JSON.stringify(item));
      this.solutionAsLeftValues.unshift({ "LookupID": -2, "LookupValue": "No Value" });

      this.solutionAsLeftValues.push({ "LookupID": -1, "LookupValue": "Other" });
    })
  }

  addSolutionRecommendedAction() {
    this.localServiceSdr.getLookupsByLookupType("RecommendedActionActuation").then((item: any) => {
      this.solutionRecommendedValues = JSON.parse(JSON.stringify(item));
      this.solutionRecommendedValues.unshift({ "LookupID": -2, "LookupValue": "No Value" });
      this.solutionRecommendedValues.push({ "LookupID": -1, "LookupValue": "Other" });
    })
  }

  addCalibrationValues() {
    this.localServiceSdr.getLookupsByLookupType("AsFoundPerformanceRecommendedActionActuation").then((item: any) => {
      this.calibrationRecommendedValues = [];
      this.calibrationRecommendedValues = JSON.parse(JSON.stringify(item));
      this.calibrationRecommendedValues.unshift({ "LookupID": -2, "LookupValue": "No Value" });
      this.calibrationRecommendedValues.push({ "LookupID": -1, "LookupValue": "Other" });
    });
    this.localServiceSdr.getLookupsByLookupType("AsFoundPerformanceResultActuation").then((item: any) => {
      this.calibrationAsLeftValues = [];
      this.calibrationAsLeftValues = JSON.parse(JSON.stringify(item));
      this.calibrationAsLeftValues.unshift({ "LookupID": -2, "LookupValue": "No Value" });
      this.calibrationAsLeftValues.push({ "LookupID": -1, "LookupValue": "Other" });
    });
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
        dataArray = this.solutionNetworkValues;
        break;
      case 'AsLeftRecommendedAction':
        dataArray = this.solutionRecommendedValues;
        break;
      case 'AsLeftConditionActuation':
        dataArray = this.solutionAsLeftValues;
        break;
      default:
        break;
    }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: data }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        let keyIs = key.split("_");
        if (keyIs[keyIs.length - 1] == "RA") {
          this.recActObj[key] = data.LookupValue;
          this.asLeftRAValuesChanged();
        } else {
          this.asLeftObj[key] = data.LookupValue;
          this.asLeftValuesChanged();
        }
        if (this.asLeftObj[key] != 'Other') {
          this.asLeftObj[key + "OT"] = "";
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
        dataArray = this.solutionNetworkValues;
        break;
      case 'AsLeftRecommendedAction':
        dataArray = this.solutionRecommendedValues;
        break;
      case 'AsLeftConditionActuation':
        dataArray = this.solutionAsLeftValues;
        break;
      default:
        break;
    }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: data }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        let keyIs = key.split("_");
        if (keyIs[keyIs.length - 1] == "RA") {
          this.recActObj[key] = data.LookupValue;
          this.asLeftRAValuesChanged();
        } else {
          this.asLeftObj[key] = data.LookupValue;
          this.asLeftValuesChanged();
        }
        if (data.LookupValue == 'No Damage Found' || data.LookupValue == 'Functions properly' || data.LookupValue == 'No Fault Found' || data.LookupValue == 'N/A') {
          this.setAccordionComponents(accordionName);
        }
        if (key == "RECOMMENDEDACTION") {
          accordionName[key] = data.LookupID
        }
        if (this.asLeftObj[key] != 'Other') {
          this.asLeftObj[key + "OT"] = "";
        }
      }
      data = null;
    });
  }

  searchCalibration(key, calibration) {
    let dataArray: any = [];
    switch (key) {
      case 'RECOMMENDEDACTION':
        dataArray = this.calibrationRecommendedValues;
        break;
      case 'CA_RESULT':
        dataArray = this.calibrationAsLeftValues;
        break;
      default:
        break;
    }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: 'jobids' }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        calibration[key] = data.LookupValue
      }
    });
  }

  clearAccordion(isChecked, accordionName) {
    let accordionData = new AccordionData();
    if (isChecked == 'true' || isChecked == true) {
      switch (accordionName) {
        case 'GearboxMounting':
          for (let key in accordionData.CombinedGearBoxMountingDataAsLeft) {
            let val: any = accordionData.CombinedGearBoxMountingDataAsLeft[key];
            let keyIs = val.split("_");
            if (keyIs[keyIs.length - 1] == "RA") {
              this.recActObj[val] = "";
            } else {
              this.asLeftObj[val] = "";
            }
            let disableKey = "disable" + accordionName;
            this.asLeftObj[disableKey] = true;
            this.expandOuterAccordion[accordionName] = false;
          }
          break;
        case 'GearboxHousing':
          for (let key in accordionData.CombinedGearBoxHousingDataAsLeft) {
            let val: any = accordionData.CombinedGearBoxHousingDataAsLeft[key];
            let keyIs = val.split("_");
            if (keyIs[keyIs.length - 1] == "RA") {
              this.recActObj[val] = "";
            } else {
              this.asLeftObj[val] = "";
            }
            let disableKey = "disable" + accordionName;
            this.asLeftObj[disableKey] = true;
            this.expandOuterAccordion[accordionName] = false;
          }
          break;
        case 'GearBoxAccessories':
          for (let key in accordionData.CombinedGearBoxAccessoriesAsLeft) {
            let val: any = accordionData.CombinedGearBoxAccessoriesAsLeft[key];
            let keyIs = val.split("_");
            if (keyIs[keyIs.length - 1] == "RA") {
              this.recActObj[val] = "";
            } else {
              this.asLeftObj[val] = "";
            }
            let disableKey = "disable" + accordionName;
            this.asLeftObj[disableKey] = true;
            this.expandOuterAccordion[accordionName] = false;
          }
          break;
        case 'GearboxSpurGear':
          for (let key in accordionData.CombinedGearBoxSpurGearAsLeft) {
            let val: any = accordionData.CombinedGearBoxSpurGearAsLeft[key];
            let keyIs = val.split("_");
            if (keyIs[keyIs.length - 1] == "RA") {
              this.recActObj[val] = "";
            } else {
              this.asLeftObj[val] = "";
            }
            let disableKey = "disable" + accordionName;
            this.asLeftObj[disableKey] = true;
            this.expandOuterAccordion[accordionName] = false;
          }
          break;
        case 'NetworkType':
          this.closeAndClearAccordion('CombinedSolutionNetwork', accordionName, isChecked);
          break;
        case 'Unit':
          this.closeAndClearAccordion('CombinedUnitAsLeft', accordionName, isChecked);
          break;
        case 'DriveModule':
          this.closeAndClearAccordion('CombinedDriveModuleAsLeft', accordionName, isChecked);
          break;
        case 'SpringModule':
          this.closeAndClearAccordion('CombinedSpringModuleAsLeft', accordionName, isChecked);
          break;
        case 'PowerModule':
          this.closeAndClearAccordion('CombinedPowerModuleAsLeft', accordionName, isChecked);
          break;
        case 'PowerSwivelModule':
          this.closeAndClearAccordion('CombinedPowerSwivelModuleAsLeft', accordionName, isChecked);
          break;
        case 'Tubing':
          this.closeAndClearAccordion('CombinedTubingAsLeft', accordionName, isChecked);
          break;
        case 'ActuatorMountingHardware':
          this.closeAndClearAccordion('CombinedActuatorMountingAsLeft', accordionName, isChecked);
          break;
        case 'ActuatorOverrides':
          this.closeAndClearAccordion('CombinedActuatorOverridesAsLeft', accordionName, isChecked);
          break;
        case 'VOS':
          this.closeAndClearAccordion('CombinedVosAsLeft', accordionName, isChecked);
          break;
        case 'ActuatorAccessories':
          this.closeAndClearAccordion('CombinedActuatorAccessoriesAsLeft', accordionName, isChecked);
          break;
        case 'ActuatorOther':
          this.closeAndClearAccordion('CombinedOtherAsLeft', accordionName, isChecked);
          break;
        case 'HousingFrame':
          this.closeAndClearAccordion('CombinedHousingFrameAsLeft', accordionName, isChecked);
          break;
        case 'MotorSubAssembly':
          this.closeAndClearAccordion('CombinedMotorSubAssemblyAsLeft', accordionName, isChecked);
          break;
        case 'Controls':
          this.closeAndClearAccordion('CombinedControlsAsLeft', accordionName, isChecked);
          break;
        case 'Enclosure':
          this.closeAndClearAccordion('CombinedEnclosureAsLeft', accordionName, isChecked);
          break;
        case 'SCM':
          this.closeAndClearAccordion('CombinedSCMAsLeft', accordionName, isChecked);
          break;
        case 'ElectricOverides':
          this.closeAndClearAccordion('CombinedElectricOveridesAsLeft', accordionName, isChecked);
          break;
        case 'Gearbox':
          this.closeAndClearAccordion('CombinedGearboxAsLeft', accordionName, isChecked);
          break;
        case 'LinearDrive':
          this.closeAndClearAccordion('CombinedLinearDriveAsLeft', accordionName, isChecked);
          break;
        case 'ElectricMountingHardware':
          this.closeAndClearAccordion('CombinedElectricMountingHardwareAsLeft', accordionName, isChecked);
          break;
        case 'failSafe':
          this.closeAndClearAccordion('CombinedFailSafeAsLeft', accordionName, isChecked);
          break;
        case 'ElectricAccessories':
          this.closeAndClearAccordion('CombinedElectricAccessoriesAsLeft', accordionName, isChecked);
          break;
        case 'ElectricOther':
          this.closeAndClearAccordion('CombinedElectricOtherAsLeft', accordionName, isChecked);
          break;
      }
    } else {
      switch (accordionName) {
        case 'GearboxMounting':
          for (let key in accordionData.CombinedGearBoxMountingData) {
            let val: any = accordionData.CombinedGearBoxMountingData[key];
            let keyIs = val.split("_");
            if (keyIs[keyIs.length - 1] == "RA") {
              this.recActObj[val] = "";
            } else {
              this.asLeftObj[val] = "";
            }
            let disableKey = "disable" + accordionName;
            this.asLeftObj[disableKey] = false;
          }
          break;
        case 'GearboxHousing':
          for (let key in accordionData.CombinedGearBoxHousingData) {
            let val: any = accordionData.CombinedGearBoxHousingData[key];
            let keyIs = val.split("_");
            if (keyIs[keyIs.length - 1] == "RA") {
              this.recActObj[val] = "";
            } else {
              this.asLeftObj[val] = "";
            }
            let disableKey = "disable" + accordionName;
            this.asLeftObj[disableKey] = false;
          }
          break;
        case 'GearBoxAccessories':
          for (let key in accordionData.CombinedGearBoxAccessories) {
            let val: any = accordionData.CombinedGearBoxAccessories[key];
            let keyIs = val.split("_");
            if (keyIs[keyIs.length - 1] == "RA") {
              this.recActObj[val] = "";
            } else {
              this.asLeftObj[val] = "";
            }
            let disableKey = "disable" + accordionName;
            this.asLeftObj[disableKey] = false;
          }
          break;
        case 'GearboxSpurGear':
          for (let key in accordionData.CombinedGearBoxSpurGear) {
            let val: any = accordionData.CombinedGearBoxSpurGear[key];
            let keyIs = val.split("_");
            if (keyIs[keyIs.length - 1] == "RA") {
              this.recActObj[val] = "";
            } else {
              this.asLeftObj[val] = "";
            }
            let disableKey = "disable" + accordionName;
            this.asLeftObj[disableKey] = false;
          }
          break;
      }
    }

  }

  closeAndClearAccordion(data, accordionName, isChecked) {
    let accordionData = new AccordionData();
    for (let key in accordionData[data]) {
      let val: any = accordionData[data][key];
      if (isChecked) {
        let keyIs = val.split("_");
        if (keyIs[keyIs.length - 1] == "RA") {
          this.recActObj[val] = "";
        } else {
          this.asLeftObj[val] = "";
        }
        this.expandOuterAccordion[accordionName] = false;
      }
    }
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
                this.asLeftObj[key] = false;
                this.clearAccordion(false, '');
              }
            },
            {
              text: this.translate.instant('OK'),
              handler: () => {
                if (!this.toggleAllaccordion) {
                  this.expandInnerAccordion = '';
                }
                this.clearAccordion(isChecked, accordionName);
                this.updateAsLeftObject(true, key);
              }
            }
          ]
        });
        alert.present();
      } else {
        if (this.expandOuterAccordion[accordionName] == true) {
          this.expandOuterAccordion[accordionName] = false
        }
        this.updateAsLeftObject(true, key);
      }
    } else {
      this.clearAccordion(event, accordionName);
      this.updateAsLeftObject(false, key);
    }
  }

  updateAsLeftObject(isChecked, key) {
    // For as left table
    if (key) {
      this.asLeftObj[key] = isChecked;
      this.asLeftValuesChanged();
      this.asLeftRAValuesChanged();
      // if (!this.isALValuesChanged) {
      // this.isALValuesChanged = true;
      // }

    }
  }

  checkIfAccordionHasValue(accordionName) {
    let hasValue = false;
    switch (accordionName) {
      case 'GearboxMounting':
        hasValue = this.checkifHasValues('CombinedGearBoxMountingDataAsLeft');
        break;
      case 'GearboxHousing':
        hasValue = this.checkifHasValues('CombinedGearBoxHousingDataAsLeft');
        break;
      case 'GearBoxAccessories':
        hasValue = this.checkifHasValues('CombinedGearBoxAccessoriesAsLeft');
        break;
      case 'GearboxSpurGear':
        hasValue = this.checkifHasValues('CombinedGearBoxSpurGearAsLeft');
        break;
      case 'NetworkType':
        hasValue = this.checkifHasValues('CombinedNetworkTypeAsLeft');
        break;
      case 'Unit':
        hasValue = this.checkifHasValues('CombinedUnitAsLeft');
        break;
      case 'DriveModule':
        hasValue = this.checkifHasValues('CombinedDriveModuleAsLeft');
        break;
      case 'SpringModule':
        hasValue = this.checkifHasValues('CombinedSpringModuleAsLeft');
        break;
      case 'PowerModule':
        hasValue = this.checkifHasValues('CombinedPowerModuleAsLeft');
        break;
      case 'PowerSwivelModule':
        hasValue = this.checkifHasValues('CombinedPowerSwivelModuleAsLeft');
        break;
      case 'Tubing':
        hasValue = this.checkifHasValues('CombinedTubingAsLeft');
        break;
      case 'ActuatorMountingHardware':
        hasValue = this.checkifHasValues('CombinedActuatorMountingAsLeft');
        break;
      case 'ActuatorOverrides':
        hasValue = this.checkifHasValues('CombinedActuatorOverridesAsLeft');
        break;
      case 'VOS':
        hasValue = this.checkifHasValues('CombinedVosAsLeft');
        break;
      case 'ActuatorAccessories':
        hasValue = this.checkifHasValues('CombinedActuatorAccessoriesAsLeft');
        break;
      case 'ActuatorOther':
        hasValue = this.checkifHasValues('CombinedOtherAsLeft');
        break;
      case 'HousingFrame':
        hasValue = this.checkifHasValues('CombinedHousingFrameAsLeft');
        break;
      case 'MotorSubAssembly':
        hasValue = this.checkifHasValues('CombinedMotorSubAssemblyAsLeft');
        break;
      case 'Controls':
        hasValue = this.checkifHasValues('CombinedControlsAsLeft');
        break;
      case 'Enclosure':
        hasValue = this.checkifHasValues('CombinedEnclosureAsLeft');
        break;
      case 'SCM':
        hasValue = this.checkifHasValues('CombinedSCMAsLeft');
        break;
      case 'ElectricOverides':
        hasValue = this.checkifHasValues('CombinedElectricOveridesAsLeft');
        break;
      case 'Gearbox':
        hasValue = this.checkifHasValues('CombinedGearboxAsLeft');
        break;
      case 'LinearDrive':
        hasValue = this.checkifHasValues('CombinedLinearDriveAsLeft');
        break;
      case 'ElectricMountingHardware':
        hasValue = this.checkifHasValues('CombinedElectricMountingHardwareAsLeft');
        break;
      case 'failSafe':
        hasValue = this.checkifHasValues('CombinedFailSafeAsLeft');
        break;
      case 'ElectricAccessories':
        hasValue = this.checkifHasValues('CombinedElectricAccessoriesAsLeft');
        break;
      case 'ElectricOther':
        hasValue = this.checkifHasValues('CombinedElectricOtherAsLeft');
        break;
    }
    return hasValue;
  }

  checkifHasValues(accordionKey) {
    let accordionData = new AccordionData();
    let hasValue = false;
    for (let key in accordionData[accordionKey]) {
      let val: any = accordionData[accordionKey][key];
      if (this.utilityProvider.isNotNull(this.recActObj[val])) {
        hasValue = true;
        break;
      }
      if (this.utilityProvider.isNotNull(this.asLeftObj[val])) {
        hasValue = true;
        break;
      }
    }
    return hasValue;
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
        for (let key in accordionData.unitArrAsLeft) {
          let val: any = accordionData.unitArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.PH_UNIT_AL;
        }
        break;
      case 'DriveModule':
        for (let key in accordionData.DriveModuleArrAsLeft) {
          let val: any = accordionData.DriveModuleArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.PH_DRIVEMODULE_AL;
        }
        break;
      case 'PowerModule':
        for (let key in accordionData.PowerModuleArrAsLeft) {
          let val: any = accordionData.PowerModuleArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.PH_POWERMODULE_AL;
        }
        break;
      case 'PowerSwivelModule':
        for (let key in accordionData.PowerSwivelModuleArrAsLeft) {
          let val: any = accordionData.PowerSwivelModuleArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.PH_POWERSWIVELMODULE_AL;
        }
        break;
      case 'MountingHardwareAdaption':
        for (let key in accordionData.MountingHardwareAdaptionArrAsLeft) {
          let val: any = accordionData.MountingHardwareAdaptionArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.PH_MOUNTINGHARDWAREADAPTION_AL;
        }
        break;
      case 'Overrides':
        for (let key in accordionData.OverridesArrAsLeft) {
          let val: any = accordionData.OverridesArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.PH_OVERRIDES_AL;
        }
        break;
      case 'VOS':
        for (let key in accordionData.VOSArrAsLeft) {
          let val: any = accordionData.VOSArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.PH_VOSVALVEOPERATINGSYSTEM_AL;
        }
        break;
      case 'Accessories':
        for (let key in accordionData.AccessoriesArrAsLeft) {
          let val: any = accordionData.AccessoriesArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.PH_ACCESSORIES_AL;
        }
        break;
      case 'HousingFrame':
        for (let key in accordionData.HousingFrameArrAsLeft) {
          let val: any = accordionData.HousingFrameArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.AE_HOUSINGFRAME_AL;
        }
        break;
      case 'ElectricMotorSubAssembly':
        for (let key in accordionData.MotorSubAssemblyArrAsLeft) {
          let val: any = accordionData.MotorSubAssemblyArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.AE_MOTORSUBASSEMBLY_AL;
        }
        break;
      case 'ControlsElectronics':
        for (let key in accordionData.ControlsArrAsLeft) {
          let val: any = accordionData.ControlsArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.AE_CONTROLSELECTRONICS_AL;
        }
        break;
      case 'Enclosure':
        for (let key in accordionData.EnclosureArrAsLeft) {
          let val: any = accordionData.EnclosureArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.AE_ENCLOSURE_AL;
        }
        break;
      case 'SCM':
        for (let key in accordionData.SCMArrAsLeft) {
          let val: any = accordionData.SCMArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.AE_SCMSEPARATECONTROLMODULE_AL;
        }
        break;
      case 'ElectricOverrides':
        for (let key in accordionData.ElectricOverridesArrAsLeft) {
          let val: any = accordionData.ElectricOverridesArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.AE_OVERRIDES_AL;
        }
        break;
      case 'Gearbox':
        for (let key in accordionData.GearBoxArrAsLeft) {
          let val: any = accordionData.GearBoxArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.AE_G_AL;
        }
        break;
      case 'ElectricMountingHardware':
        for (let key in accordionData.ElectricMountingAdaptionArrAsLeft) {
          let val: any = accordionData.ElectricMountingAdaptionArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.AE_MOUNTINGHARDWAREADAPTION_AL;
        }
        break;
      case 'ElectricAccessories':
        for (let key in accordionData.ElectricAccessoriesArrAsLeft) {
          let val: any = accordionData.ElectricAccessoriesArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.AE_ACCESSORIES_AL;
        }
        break;
      case 'GearboxHousing':
        for (let key in accordionData.GearBoxHousingFrameArrAsLeft) {
          let val: any = accordionData.GearBoxHousingFrameArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.G_HOUSINGFRAME_AL;
        }
        break;
      case 'GearBoxSpurGear':
        for (let key in accordionData.GearBoxSpurGearAsLeft) {
          let val: any = accordionData.GearBoxSpurGearAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.G_SPURGEAR_AL;
        }
        break;
      case 'GearBoxAccessories':
        for (let key in accordionData.GearBoxAccessoriesArrAsLeft) {
          let val: any = accordionData.GearBoxAccessoriesArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.G_ACCESSORIES_AL;
        }
        break;
      case 'GearboxMounting':
        for (let key in accordionData.GearBoxMountingArrAsLeft) {
          let val: any = accordionData.GearBoxMountingArrAsLeft[key];
          this.asLeftObj[val] = this.asLeftObj.G_MOUNTINGHARDWAREADAPTION_AL;
        }
        break;
    }
  }

  // Load as found actuation data
  getAsFoundActuation() {
    try {
      return new Promise((resolve, reject) => {
        this.localServiceSdr.getActuationdata(this.asFoundObj.REPORTID, 'ASFOUNDACTUATION', 'getAsFoundActuation').then((res: any[]) => {
          // console.log(res);
          if (res && res.length) {
            this.isAsFoundRecordExists = true;
            this.asFoundObj = JSON.parse(JSON.stringify(res[0]));

            resolve(true);
          }
        }).catch((error: any) => {
          reject(true);
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'getAsFoundActuation', ' Error in insertTime : ' + JSON.stringify(error));
        });
      })


    } catch (error) {
      this.logger.log(this.fileName, "getAsFoundActuation", "Error: " + error.message);
    }
  }

  // Load as left actuation data
  getAsLeftActuation() {
    try {
      return new Promise((resolve, reject) => {
        this.localServiceSdr.getActuationdata(this.asLeftObj.REPORTID, 'ASLEFTACTUATION', 'getAsLeftActuation').then((res: any[]) => {
          // console.log(res);
          if (res && res.length) {
            this.isAsLeftRecordExists = true;
            this.asLeftObj = JSON.parse(JSON.stringify(res[0]));
            this.clearValuesIfAsFoundChecked();
            resolve(true);
          }
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'getAsLeftActuation', ' Error in insertTime : ' + JSON.stringify(error));
          reject(true);
        });
      })

    } catch (error) {
      this.logger.log(this.fileName, "getAsLeftActuation", "Error: " + error.message);
    }
  }

  // Load as left recommended action actuation data
  getRecActionActuation() {
    try {
      return new Promise((resolve, reject) => {
        this.localServiceSdr.getActuationdata(this.recActObj.REPORTID, 'ASLEFTRAACTUATION', 'getRecActionActuation').then((res: any[]) => {
          // console.log(res);
          if (res && res.length) {
            this.isRARecordExists = true;
            this.recActObj = JSON.parse(JSON.stringify(res[0]));
            this.clearValuesIfAsFoundChecked();
            resolve(true);
          }
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'getRecActionActuation', ' Error in insertTime : ' + JSON.stringify(error));
          reject(true);
        });
      })

    } catch (error) {
      this.logger.log(this.fileName, "getRecActionActuation", "Error: " + error.message);
    }
  }

  // Inser as left data to DB
  insertAsLeftData() {
    try {
      if (this.isALValuesChanged) {
        let keys = Object.keys(this.asLeftObj);
        let asLeftObj: any = {};
        if (keys.length > 0) {
          keys.forEach((item) => {
            if (item.indexOf("_AL") != -1)
              asLeftObj[item] = this.asLeftObj[item];
          })
        }
        asLeftObj.REPORTID = this.asLeftObj.REPORTID;
        asLeftObj.AL_PK_ID = this.asLeftObj.AL_PK_ID;
        this.localServiceSdr.insertOrUpdateData(asLeftObj, this.isAsLeftRecordExists, 'AL_PK_ID', 'ASLEFTACTUATION').then((res): any => {
          // console.log(res);
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'insertAsLeftData', ' Error in insertTime : ' + JSON.stringify(error));
        });
      }

    } catch (error) {
      this.logger.log(this.fileName, "insertAsLeftData", "Error: " + error.message);
    }
  }

  // Inser as left recommended action data to DB
  insertAsLeftRAData() {
    try {
      if (this.isALRAValuesChanged) {
        let keys = Object.keys(this.recActObj);
        let recActObj = {};
        if (keys.length > 0) {
          keys.forEach((item) => {
            if (item.indexOf("_AL") == -1)
              recActObj[item] = this.recActObj[item];
          })
        }
        this.localServiceSdr.insertOrUpdateData(recActObj, this.isRARecordExists, 'ALRA_PK_ID', 'ASLEFTRAACTUATION').then((res): any => {
          // console.log(res);
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'insertAsLeftRAData', ' Error in insertTime : ' + JSON.stringify(error));
        });
      }

    } catch (error) {
      this.logger.log(this.fileName, "insertAsLeftRAData", "Error: " + error.message);
    }
  }

  redirect(value) {
    if (this.isValidated()) {
      this.utilityProvider.bottomNavigation(this.navCtrl, value);
    } else {
      this.utilityProvider.presentAlert();
    }
  }

  // If Changes in HTML
  asLeftValChanged(event) {
    if (event.value && !this.isALValuesChanged) {
      this.isALValuesChanged = true;
    }
  }

  // If Changes in code
  asLeftValuesChanged() {
    if (!this.isALValuesChanged) {
      this.isALValuesChanged = true;
    }
  }

  // If Changes in code
  asLeftRAValuesChanged() {
    if (!this.isALRAValuesChanged) {
      this.isALRAValuesChanged = true;
    }
  }

  selectCalibrationData() {
    this.localServiceSdr.getCalibrationData(this.valueProvider.getCurrentReport().REPORTID).then((res: any) => {
      this.calibrationData = res;
      this.addCalibrationValues();
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getCalibrationData', ' Error in getCalibrationData : ' + JSON.stringify(error));
    })
  }

  updateCalibrationData() {
    for (var i in this.calibrationData) {
      this.localServiceSdr.insertOrUpdateData(this.calibrationData[i], true, 'CA_PK_ID', 'CALIBRATIONACTUATION').then((res: any) => {
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'updateCalibrationData', ' Error in updateCalibrationData : ' + JSON.stringify(error));
      })
    }
  }

  deleteCalibrationData(value) {
    this.localServiceSdr.deleteCalibrationData(value).then((res: any) => {
      this.selectCalibrationData();
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getCalibrationData', ' Error in getCalibrationData : ' + JSON.stringify(error));
    })
  }

  isValidated() {
    this.errorObj = [];
    let accordionData = new AccordionData();
    for (let key in accordionData.AsLeftData) {
      let element: any = accordionData.AsLeftData[key];
      if (this.asLeftObj[element] == 'Other') {
        if (!this.utilityProvider.isNotNull(this.asLeftObj[element + "OT"])) {
          this.errorObj.push(element + "OT");
        }
      }
      if (this.recActObj[element] == 'Other') {
        if (!this.utilityProvider.isNotNull(this.recActObj[element + "OT"])) {
          this.errorObj.push(element + "OT");
        }
      }
    }
    return this.errorObj.length == 0;
  }

  clearValuesIfAsFoundChecked() {
    let json = this.setJson();
    let result = Object.keys(json);
    result.forEach((item) => {
      if (json[item] == true || json[item] == 'true') {
        this.clearAccordion(true, item);
        this.asLeftValuesChanged();
        this.asLeftRAValuesChanged();
      }
    })
    this.utilityProvider.stopSpinner();
  }

  setJson() {
    let json = {
      "GearboxHousing": this.asLeftObj.G_HOUSINGFRAME_ALNA,
      "SpurGear": this.asLeftObj.G_SPURGEAR_ALNA,
      "GearBoxAccessories": this.asLeftObj.G_ACCESSORIES_ALNA,
      "GearboxMounting": this.asLeftObj.G_MOUNTINGHARDWAREADAPTION_ALNA,
      "Unit": this.asLeftObj.PH_UNIT_ALNA,
      "DriveModule": this.asLeftObj.PH_DRIVEMODULE_ALNA,
      "SpringModule": this.asLeftObj.PH_SPRINGMODULE_ALNA,
      "PowerModule": this.asLeftObj.PH_POWERMODULE_ALNA,
      "PowerSwivelModule": this.asLeftObj.PH_POWERSWIVELMODULE_ALNA,
      "Tubing": this.asLeftObj.PH_TUBING_ALNA,
      "ActuatorMountingHardware": this.asLeftObj.PH_MOUNTINGHARDWAREADAPTION_ALNA,
      "ActuatorOverrides": this.asLeftObj.PH_OVERRIDES_ALNA,
      "VOS": this.asLeftObj.PH_VOSVALVEOPERATINGSYSTEM_ALNA,
      "ActuatorAccessories": this.asLeftObj.PH_ACCESSORIES_ALNA,
      "ActuatorOther": this.asLeftObj.PH_OTHER_ALNA,
      "HousingFrame": this.asLeftObj.AE_HOUSINGFRAME_ALNA,
      "MotorSubAssembly": this.asLeftObj.AE_MOTORSUBASSEMBLY_ALNA,
      "Controls": this.asLeftObj.AE_CONTROLSELECTRONICS_ALNA,
      "Enclosure": this.asLeftObj.AE_ENCLOSURE_ALNA,
      "SCM": this.asLeftObj.AE_SCMSEPARATECONTROLMODULE_ALNA,
      "ElectricOverides": this.asLeftObj.AE_OVERRIDES_ALNA,
      "Gearbox": this.asLeftObj.AE_G_ALNA,
      "LinearDrive": this.asLeftObj.AE_LINEARDRIVE_ALNA,
      "ElectricMountingHardware": this.asLeftObj.AE_MOUNTINGHARDWAREADAPTION_ALNA,
      "failSafe": this.asLeftObj.AE_FAILSAFE_ALNA,
      "ElectricAccessories": this.asLeftObj.AE_ACCESSORIES_ALNA,
      "ElectricOther": this.asLeftObj.AE_OTHER_ALNA
    }
    return json;
  }
  gotofcr() {
    this.events.publish("goToFCR");
  }
}
