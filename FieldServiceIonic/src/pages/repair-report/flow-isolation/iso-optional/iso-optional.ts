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
 * Generated class for the IsoOptionalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-iso-optional',
  templateUrl: 'iso-optional.html',
})
export class IsoOptionalPage {
  showLoader: boolean = false;
  toggleAllaccordion: boolean = false;
  expandOuterAccordion: any = {};
  Enums: any;
  reportID: any;
  fileName: any = 'Optional_Tab';
  deviceId: any;
  isRecordExists: boolean = false;
  bottomBtnClicked: boolean = false;
  Lookups: any = [];
  errorObj: any = [];
  key = 'CV';
  datepickerConfig: Partial<BsDatepickerConfig>;
  accordionData = new AccordionData();
  bottomNavBtn: any;
  @ViewChild('dateCompleted')
  _picker: BsDatepickerDirective;
  OptionalObj: any = {
    OP_PK_ID: null,
    ValvePreTestData: {
      VALVEPRE_TESTDATA_SEATLEAKCLASS: null,
      VALVEPRE_TESTDATA_SEATLEAKCLASS_OT: null,
      VALVEPRE_TESTDATA_SEATTESTPRESSURE: null,
      VALVEPRE_TESTDATA_SEATTESTPRESSURE_OT: null,
      VALVEPRE_TESTDATA_SEATTESTUOM: null,
      VALVEPRE_TESTDATA_SEATTESTUOM_OT: null,
      VALVEPRE_TESTDATA_ALLOWABLELEAKAGE: null,
      VALVEPRE_TESTDATA_ALLOWABLELEAKAGEUNITOFMEASURMENT: null,
      VALVEPRE_TESTDATA_ALLOWABLELEAKAGEUNITOFMEASURMENT_OT: null,
      VALVEPRE_TESTDATA_ACTUALLEAKAGE: null,
      VALVEPRE_TESTDATA_ACTUALLEAKAGEUNITOFMEASURMENT: null,
      VALVEPRE_TESTDATA_ACTUALLEAKAGEUNITOFMEASURMENT_OT: null,
      VALVEPRE_TESTDATA_PRESSURECLASS: null,
      VALVEPRE_TESTDATA_PRESSURECLASS_OT: null,
      VALVEPRE_TESTDATA_HYDROTESTPRESSURE: null,
      VALVEPRE_TESTDATA_HYDROTESTPRESSUREUOM: null,
      VALVEPRE_TESTDATA_HYDROTESTPRESSUREUOM_OT: null,
      VALVEPRE_TESTDATA_HYDROTESTDURATION: null,
      VALVEPRE_TESTDATA_HYDROTESTDURATION_OT: null,
      VALVEPRE_TESTDATA_NOTES: null
    },
    MaterialsVerification: {
      MATERIALSVERIFICATION_BODY_ASFOUND: null,
      MATERIALSVERIFICATION_BODY_ASFOUND_OT: null,
      MATERIALSVERIFICATION_BODY_ASLEFT: null,
      MATERIALSVERIFICATION_BODY_ASLEFT_OT: null,

      MATERIALSVERIFICATION_PLUG_DISC_BALL_ASFOUND: null,
      MATERIALSVERIFICATION_PLUG_DISC_BALL_ASFOUND_OT: null,
      MATERIALSVERIFICATION_PLUG_DISC_BALL_ASLEFT: null,
      MATERIALSVERIFICATION_PLUG_DISC_BALL_ASLEFT_OT: null,

      MATERIALSVERIFICATION_STEM_SHAFT_ASFOUND: null,
      MATERIALSVERIFICATION_STEM_SHAFT_ASFOUND_OT: null,
      MATERIALSVERIFICATION_STEM_SHAFT_ASLEFT: null,
      MATERIALSVERIFICATION_STEM_SHAFT_ASLEFT_OT: null,

      MATERIALSVERIFICATION_CAGE_RETAINER_ASFOUND: null,
      MATERIALSVERIFICATION_CAGE_RETAINER_ASFOUND_OT: null,
      MATERIALSVERIFICATION_CAGE_RETAINER_ASLEFT: null,
      MATERIALSVERIFICATION_CAGE_RETAINER_ASLEFT_OT: null,

      MATERIALSVERIFICATION_SEAT_ASFOUND: null,
      MATERIALSVERIFICATION_SEAT_ASFOUND_OT: null,
      MATERIALSVERIFICATION_SEAT_ASLEFT: null,
      MATERIALSVERIFICATION_SEAT_ASLEFT_OT: null,

      MATERIALSVERIFICATION_BUSHINGS_BEARING_ASFOUND: null,
      MATERIALSVERIFICATION_BUSHINGS_BEARING_ASFOUND_OT: null,
      MATERIALSVERIFICATION_BUSHINGS_BEARING_ASLEFT: null,
      MATERIALSVERIFICATION_BUSHINGS_BEARING_ASLEFT_OT: null,

      MATERIALSVERIFICATION_BODY_BONNETBOLTING_ASFOUND: null,
      MATERIALSVERIFICATION_BODY_BONNETBOLTING_ASFOUND_OT: null,
      MATERIALSVERIFICATION_BODY_BONNETBOLTING_ASLEFT: null,
      MATERIALSVERIFICATION_BODY_BONNETBOLTING_ASLEFT_OT: null,

      MATERIALSVERIFICATION_GASKETS_ASFOUND: null,
      MATERIALSVERIFICATION_GASKETS_ASFOUND_OT: null,
      MATERIALSVERIFICATION_GASKETS_ASLEFT: null,
      MATERIALSVERIFICATION_GASKETS_ASLEFT_OT: null,

      MATERIALSVERIFICATION_NOTES: null
    },
    ControllerConstruction: {
      CONTROLLERCONSTRUCTION_S_N: null,
      CONTROLLERCONSTRUCTION_MANUFACTURER: null,
      CONTROLLERCONSTRUCTION_MANUFACTURER_OT: null,
      CONTROLLERCONSTRUCTION_PROPORTIONAL: null,
      CONTROLLERCONSTRUCTION_PROPORTIONAL_OT: null,
      CONTROLLERCONSTRUCTION_TYPE: null,
      CONTROLLERCONSTRUCTION_TYPE_OT: null,
      CONTROLLERCONSTRUCTION_INTEGRAL: null,
      CONTROLLERCONSTRUCTION_INTEGRAL_OT: null,
      CONTROLLERCONSTRUCTION_DIRECT_DIVERSE: null,
      CONTROLLERCONSTRUCTION_DIRECT_DIVERSE_OT: null,
      CONTROLLERCONSTRUCTION_DERIVATIVE: null,
      CONTROLLERCONSTRUCTION_DERIVATIVE_OT: null,
      CONTROLLERCONSTRUCTION_ORIENTATIONASFOUND: null,
      CONTROLLERCONSTRUCTION_INPUTRANGEASFOUND: null,
      CONTROLLERCONSTRUCTION_POSITIONASFOUND: null,
      CONTROLLERCONSTRUCTION_OUTPUTRANGEASFOUND: null,
      CONTROLLERCONSTRUCTION_SETPOINTASFOUND: null,
      CONTROLLERCONSTRUCTION_OTHERASFOUND: null,

      CONTROLLERCONSTRUCTION_NOTES: null,
    },
    SlidingItem: {
      SLIDINGITEM_UOM: null,
      SLIDINGITEM_UOM_OT: null,
      SLIDINGITEM_PACKINGBOXBORE_ASFOUND: null,
      SLIDINGITEM_PACKINGBOXBORE_ASFOUND_OT: null,
      SLIDINGITEM_PACKINGBOXBORE_ASLEFT: null,
      SLIDINGITEM_PACKINGBOXBORE_ASLEFT_OT: null,
      SLIDINGITEM_STEMDIAMETER_ASFOUND: null,
      SLIDINGITEM_STEMDIAMETER_ASFOUND_OT: null,
      SLIDINGITEM_STEMDIAMETER_ASLEFT: null,
      SLIDINGITEM_STEMDIAMETER_ASLEFT_OT: null,
      SLIDINGITEM_BONNETGUIDEOD_ASFOUND: null,
      SLIDINGITEM_BONNETGUIDEOD_ASFOUND_OT: null,
      SLIDINGITEM_BONNETGUIDEOD_ASLEFT: null,
      SLIDINGITEM_BONNETGUIDEOD_ASLEFT_OT: null,
      SLIDINGITEM_UPPERBODYGUIDEID_ASFOUND: null,
      SLIDINGITEM_UPPERBODYGUIDEID_ASFOUND_OT: null,
      SLIDINGITEM_UPPERBODYGUIDEID_ASLEFT: null,
      SLIDINGITEM_UPPERBODYGUIDEID_ASLEFT_OT: null,
      SLIDINGITEM_UPPERGUIDEBUSHINGID_ASFOUND: null,
      SLIDINGITEM_UPPERGUIDEBUSHINGID_ASFOUND_OT: null,
      SLIDINGITEM_UPPERGUIDEBUSHINGID_ASLEFT: null,
      SLIDINGITEM_UPPERGUIDEBUSHINGID_ASLEFT_OT: null,
      SLIDINGITEM_UPPERGUIDEPOSTOD_ASFOUND: null,
      SLIDINGITEM_UPPERGUIDEPOSTOD_ASFOUND_OT: null,
      SLIDINGITEM_UPPERGUIDEPOSTOD_ASLEFT: null,
      SLIDINGITEM_UPPERGUIDEPOSTOD_ASLEFT_OT: null,
      SLIDINGITEM_CAGEID_ASFOUND: null,
      SLIDINGITEM_CAGEID_ASFOUND_OT: null,
      SLIDINGITEM_CAGEID_ASLEFT: null,
      SLIDINGITEM_CAGEID_ASLEFT_OT: null,
      SLIDINGITEM_UPPERPLUGSEATOD_ASFOUND: null,
      SLIDINGITEM_UPPERPLUGSEATOD_ASFOUND_OT: null,
      SLIDINGITEM_UPPERPLUGSEATOD_ASLEFT: null,
      SLIDINGITEM_UPPERPLUGSEATOD_ASLEFT_OT: null,
      SLIDINGITEM_LOWERPLUGSEATOD_ASFOUND: null,
      SLIDINGITEM_LOWERPLUGSEATOD_ASFOUND_OT: null,
      SLIDINGITEM_LOWERPLUGSEATOD_ASLEFT: null,
      SLIDINGITEM_LOWERPLUGSEATOD_ASLEFT_OT: null,
      SLIDINGITEM_UPPERSEATRINGID_ASFOUND: null,
      SLIDINGITEM_UPPERSEATRINGID_ASFOUND_OT: null,
      SLIDINGITEM_UPPERSEATRINGID_ASLEFT: null,
      SLIDINGITEM_UPPERSEATRINGID_ASLEFT_OT: null,
      SLIDINGITEM_LOWERSEATRINGID_ASFOUND: null,
      SLIDINGITEM_LOWERSEATRINGID_ASFOUND_OT: null,
      SLIDINGITEM_LOWERSEATRINGID_ASLEFT: null,
      SLIDINGITEM_LOWERSEATRINGID_ASLEFT_OT: null,
      SLIDINGITEM_BLINDFLANGEGUIDEOD_ASFOUND: null,
      SLIDINGITEM_BLINDFLANGEGUIDEOD_ASFOUND_OT: null,
      SLIDINGITEM_BLINDFLANGEGUIDEOD_ASLEFT: null,
      SLIDINGITEM_BLINDFLANGEGUIDEOD_ASLEFT_OT: null,
      SLIDINGITEM_LOWERGUIDEBUSHINGID_ASFOUND: null,
      SLIDINGITEM_LOWERGUIDEBUSHINGID_ASFOUND_OT: null,
      SLIDINGITEM_LOWERGUIDEBUSHINGID_ASLEFT: null,
      SLIDINGITEM_LOWERGUIDEBUSHINGID_ASLEFT_OT: null,
      SLIDINGITEM_LOWERBODYGUIDEID_ASFOUND: null,
      SLIDINGITEM_LOWERBODYGUIDEID_ASFOUND_OT: null,
      SLIDINGITEM_LOWERBODYGUIDEID_ASLEFT: null,
      SLIDINGITEM_LOWERBODYGUIDEID_ASLEFT_OT: null,
      SLIDINGITEM_LOWERGUIDEPOSTOD_ASFOUND: null,
      SLIDINGITEM_LOWERGUIDEPOSTOD_ASFOUND_OT: null,
      SLIDINGITEM_LOWERGUIDEPOSTOD_ASLEFT: null,
      SLIDINGITEM_LOWERGUIDEPOSTOD_ASLEFT_OT: null,

      SLIDINGITEM_NOTES: null
    },
    RotaryValve: {
      ROTARYVALVE_UOM: null,
      ROTARYVALVE_UOM_OT: null,
      ROTARYVALVE_PACKINGBOXBORE_ASFOUND: null,
      ROTARYVALVE_PACKINGBOXBORE_ASFOUND_OT: null,
      ROTARYVALVE_PACKINGBOXBORE_ASLEFT: null,
      ROTARYVALVE_PACKINGBOXBORE_ASLEFT_OT: null,
      ROTARYVALVE_SHAFTDIAMETER_ASFOUND: null,
      ROTARYVALVE_SHAFTDIAMETER_ASFOUND_OT: null,
      ROTARYVALVE_SHAFTDIAMETER_ASLEFT: null,
      ROTARYVALVE_SHAFTDIAMETER_ASLEFT_OT: null,
      ROTARYVALVE_UPPERGUIDEBUSHINGID_ASFOUND: null,
      ROTARYVALVE_UPPERGUIDEBUSHINGID_ASFOUND_OT: null,
      ROTARYVALVE_UPPERGUIDEBUSHINGID_ASLEFT: null,
      ROTARYVALVE_UPPERGUIDEBUSHINGID_ASLEFT_OT: null,
      ROTARYVALVE_UPPERGUIDEPOSTOD_ASFOUND: null,
      ROTARYVALVE_UPPERGUIDEPOSTOD_ASFOUND_OT: null,
      ROTARYVALVE_UPPERGUIDEPOSTOD_ASLEFT: null,
      ROTARYVALVE_UPPERGUIDEPOSTOD_ASLEFT_OT: null,
      ROTARYVALVE_LOWERGUIDEBUSHINGID_ASFOUND: null,
      ROTARYVALVE_LOWERGUIDEBUSHINGID_ASFOUND_OT: null,
      ROTARYVALVE_LOWERGUIDEBUSHINGID_ASLEFT: null,
      ROTARYVALVE_LOWERGUIDEBUSHINGID_ASLEFT_OT: null,
      ROTARYVALVE_LOWERGUIDEPOSTOD_ASFOUND: null,
      ROTARYVALVE_LOWERGUIDEPOSTOD_ASFOUND_OT: null,
      ROTARYVALVE_LOWERGUIDEPOSTOD_ASLEFT: null,
      ROTARYVALVE_LOWERGUIDEPOSTOD_ASLEFT_OT: null,
      ROTARYVALVE_SEATSEALID_ASFOUND: null,
      ROTARYVALVE_SEATSEALID_ASFOUND_OT: null,
      ROTARYVALVE_SEATSEALID_ASLEFT: null,
      ROTARYVALVE_SEATSEALID_ASLEFT_OT: null,
      ROTARYVALVE_PACKINGBOXDEPTH_ASFOUND: null,
      ROTARYVALVE_PACKINGBOXDEPTH_ASFOUND_OT: null,
      ROTARYVALVE_PACKINGBOXDEPTH_ASLEFT: null,
      ROTARYVALVE_PACKINGBOXDEPTH_ASLEFT_OT: null,
      ROTARYVALVE_BUSHINGRETAINEROAL_ASFOUND: null,
      ROTARYVALVE_BUSHINGRETAINEROAL_ASFOUND_OT: null,
      ROTARYVALVE_BUSHINGRETAINEROAL_ASLEFT: null,
      ROTARYVALVE_BUSHINGRETAINEROAL_ASLEFT_OT: null,
      ROTARYVALVE_NOTES: null
    }
  };
  WitnessHoldPointsObj: any = {
    WHP_PK_ID: null,
    REPORTID: null,
    DATECOMPLETED: null,
    WHPVALUE: null,
    WHPVALUE_OT: null,
    CUSTOMERNAME: null,
    TECHNAME: null
  };
  WitnessHoldPoints = [];
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

    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Optional" };
    this.reportID = this.valueProvider.getCurrentReport().REPORTID;
    this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
    this.localServiceSdr.getDEVICEIDForFlowIsolation(this.reportID).then((res: any) => {
      this.deviceId = res;
      if (this.deviceId == Enums.FlowIsolationProductId.ControlValve) {
        this.key = 'CV';
      } else if (this.deviceId == Enums.FlowIsolationProductId.Isolation) {
        this.key = 'ISO';
      } else if (this.deviceId == Enums.FlowIsolationProductId.TrimOnly) {
        this.key = 'TO';
      }
      this.generateAccordionKeys();
      this.getExistingData();
      this.toggleAllaccordion = false;
    }).catch((err) => {
      this.logger.log(this.fileName, 'ionViewDidEnter', JSON.stringify(err));
    });
  }

  getLovs() {
    this.localServiceSdr.getLookups(this.accordionData.optionalKeys.lovKeys).then((res: any) => {
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
    this.localServiceSdr.getOptionalData(this.reportID).then((res: any): any => {
      if (res && res.length) {
        this.isRecordExists = true;
        const existingDevice = JSON.parse(JSON.stringify(res[0]));
        this.OptionalObj.OP_PK_ID = existingDevice.OP_PK_ID;
        // Assign database object to OptionalObj
        if (this.deviceId == Enums.FlowIsolationProductId.ControlValve) {
          // Test Technician, Witness and Date
          this.OptionalObj.VALVEPRE_TESTDATA_TESTTECHNICIAN = existingDevice[this.key + '_VALVEPRE_TESTDATA_TESTTECHNICIAN'];
          this.OptionalObj.VALVEPRE_TESTDATA_TESTWITNESS = existingDevice[this.key + '_VALVEPRE_TESTDATA_TESTWITNESS'];
          this.OptionalObj.VALVEPRE_TESTDATA_TESTDATE = existingDevice[this.key + '_VALVEPRE_TESTDATA_TESTDATE'];
        }

        // Valve Pre-Test Data
        this.OptionalObj.ValvePreTestData_NA = existingDevice[this.key + '_VALVEPRE_TESTDATA_VALVEPRE_TESTDATA_NA'];
        for (const a in this.OptionalObj.ValvePreTestData) {
          this.OptionalObj.ValvePreTestData[a] = existingDevice[this.key + '_' + a];
        }
        this.addNoValue();

        // Materials Verification
        this.OptionalObj.MaterialsVerification_NA = existingDevice[this.key + '_MATERIALSVERIFICATION_MATERIALSVERIFICATION_NA'];
        for (const a in this.OptionalObj.MaterialsVerification) {
          this.OptionalObj.MaterialsVerification[a] = existingDevice[this.key + '_' + a];
        }

        // Sliding Item
        this.OptionalObj.SlidingItem_NA = existingDevice[this.key + '_SLIDINGITEM_SLIDINGITEM_NA'];
        for (const a in this.OptionalObj.SlidingItem) {
          this.OptionalObj.SlidingItem[a] = existingDevice[this.key + '_' + a];
        }

        // Rotary Valve
        this.OptionalObj.RotaryValve_NA = existingDevice[this.key + '_ROTARYVALVE_ROTARYVALVE_NA'];
        for (const a in this.OptionalObj.RotaryValve) {
          this.OptionalObj.RotaryValve[a] = existingDevice[this.key + '_' + a];
        }

        if (this.deviceId == Enums.FlowIsolationProductId.ControlValve) {
          // Controller Construction
          this.OptionalObj.ControllerConstruction_NA = existingDevice[this.key + '_CONTROLLERCONSTRUCTION_CONTROLLERCONSTRUCTION_NA'];
          for (const a in this.OptionalObj.ControllerConstruction) {
            this.OptionalObj.ControllerConstruction[a] = existingDevice[this.key + '_' + a];
          }
        }

        if (this.deviceId == Enums.FlowIsolationProductId.ControlValve || this.deviceId == Enums.FlowIsolationProductId.TrimOnly) {
          // Witness Hold Points
          this.OptionalObj.WitnessHoldPoints_NA = existingDevice[this.key + '_WITNESSHOLDPOINTS_WITNESSHOLDPOINTS_NA'];
          if (!this.OptionalObj.WitnessHoldPoints_NA) {
            this.getWitnessHoldPoints();
          }
        }
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getExistingData', ' Error in getExistingData : ' + JSON.stringify(error));
    });
  }

  addNoValue() {
    if (
      this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_SEATTESTPRESSURE) &&
      !this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_SEATTESTUOM
    ) {
      this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_SEATTESTUOM = 'No Value';
    }

    if (
      this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ALLOWABLELEAKAGE) &&
      !this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ALLOWABLELEAKAGEUNITOFMEASURMENT
    ) {
      this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ALLOWABLELEAKAGEUNITOFMEASURMENT = 'No Value';
    }

    if (
      this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ACTUALLEAKAGE) &&
      !this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ACTUALLEAKAGEUNITOFMEASURMENT
    ) {
      this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ACTUALLEAKAGEUNITOFMEASURMENT = 'No Value';
    }

    if (
      this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_HYDROTESTPRESSURE) &&
      !this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_HYDROTESTPRESSUREUOM
    ) {
      this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_HYDROTESTPRESSUREUOM = 'No Value';
    }
  }

  searchModal(elementName, key1?, key2?) {
    let dataArray = this.Lookups.filter((item) => {
      return item.LookupType == elementName
    });
    dataArray.push({ "LookupID": -1, "LookupValue": "Other" });
    if(key2){
      if (key2.indexOf("UNITOFMEASURMENT") == key2.length - 16) {
        const nonUOMKey = key2.substring(0, key2.indexOf("UNITOFMEASURMENT"));
        if (!this.showValidationClass(this.OptionalObj[key1][nonUOMKey])) {
          dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
        }
      } else if (key2.indexOf("UOM") == key2.length - 3) {
        let nonUOMKey = key2.substring(0, key2.indexOf("UOM"));
        if (nonUOMKey == "VALVEPRE_TESTDATA_SEATTEST") {
          nonUOMKey = nonUOMKey + "PRESSURE";
        }
        if (!this.showValidationClass(this.OptionalObj[key1][nonUOMKey])) {
          dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
        }
      } else if (key2 == "VALVEPRE_TESTDATA_SEATTESTPRESSURE") {
        const nonUOMKey = "VALVEPRE_TESTDATA_SEATTESTUOM";
        if (!this.showValidationClass(this.OptionalObj[key1][nonUOMKey])) {
          dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
        }
      } else {
        dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
      }
    } else{
      dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
    }

    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: 'lookups' }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        if (elementName == 'WitnessHoldPoints') {
          this.WitnessHoldPointsObj.WHPVALUE = data.LookupValue;
        } else {
          this.OptionalObj[key1][key2] = data.LookupValue;
        }

      }
    });
  }

  toggleAccordion(event) {
    if (this.toggleAllaccordion) {
      for (let key in this.accordionData.AccordionKeys) {
        let val: any = this.accordionData.AccordionKeys[key];
        if (!this.OptionalObj[val + "_NA"] || this.OptionalObj[val + "_NA"] == 'false' || this.OptionalObj[val + "_NA"] == false) {
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
                this.OptionalObj[accordionName + "_NA"] = false;
              }
            },
            {
              text: this.translate.instant('OK'),
              handler: () => {
                this.clearAccordion(accordionName);
                if (this.expandOuterAccordion[accordionName] == true) {
                  this.expandOuterAccordion[accordionName] = false
                }
                this.OptionalObj[accordionName + "_NA"] = true;
              }
            }
          ]
        });
        alert.present();
      } else {
        if (this.expandOuterAccordion[accordionName] == true) {
          this.expandOuterAccordion[accordionName] = false
        }
        this.OptionalObj[accordionName + "_NA"] = isChecked;
      }
    } else {
      this.OptionalObj[accordionName + "_NA"] = isChecked;
      this.clearAccordion(accordionName);
    }
  }

  checkIfAccordionHasValue(accordionName) {
    let hasValue = false;
    for (const k in this.OptionalObj[accordionName]) {
      if (this.OptionalObj[accordionName][k] != '' && this.OptionalObj[accordionName][k] != null) {
        hasValue = true;
        break;
      }
    }
    return hasValue;
  }

  clearAccordion(accordionName) {
    for (const k in this.OptionalObj[accordionName]) {
      this.OptionalObj[accordionName][k] = null;
    }
  }

  manageOtherValueValidation(key, index) {
    if (index.indexOf("_OT") == index.length - 3) {
      const nonOtherKey = index.substring(0, index.indexOf("_OT"));
      if (this.OptionalObj[key][nonOtherKey] == 'Other' && !this.OptionalObj[key][index]) {
        this.errorObj.push(index);
      }
    }
  }

  insertData() {
    this.errorObj = [];
    let objectToInsert = {
      OP_PK_ID: this.OptionalObj.OP_PK_ID,
      REPORTID: this.reportID,
    };

    if (this.deviceId == Enums.FlowIsolationProductId.ControlValve) {
      // Test Technician, Witness and Date
      objectToInsert[this.key + '_VALVEPRE_TESTDATA_TESTTECHNICIAN'] = this.OptionalObj.VALVEPRE_TESTDATA_TESTTECHNICIAN;
      objectToInsert[this.key + '_VALVEPRE_TESTDATA_TESTWITNESS'] = this.OptionalObj.VALVEPRE_TESTDATA_TESTWITNESS;
      objectToInsert[this.key + '_VALVEPRE_TESTDATA_TESTDATE'] = this.OptionalObj.VALVEPRE_TESTDATA_TESTDATE;
    }

    // Valve Pre-Test Data
    objectToInsert[this.key + '_VALVEPRE_TESTDATA_VALVEPRE_TESTDATA_NA'] = this.OptionalObj.ValvePreTestData_NA;
    for (const a in this.OptionalObj.ValvePreTestData) {
      objectToInsert[this.key + '_' + a] = this.OptionalObj.ValvePreTestData[a];
      this.manageOtherValueValidation('ValvePreTestData', a);
    }
    if (
      this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_SEATTESTPRESSURE) &&
      !this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_SEATTESTUOM)
    ) {
      this.errorObj.push('VALVEPRE_TESTDATA_SEATTESTUOM');
    }
    if (
      this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_SEATTESTUOM) &&
      !this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_SEATTESTPRESSURE)
    ) {
      this.errorObj.push('VALVEPRE_TESTDATA_SEATTESTPRESSURE');
    }

    if (
      this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ALLOWABLELEAKAGE) &&
      !this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ALLOWABLELEAKAGEUNITOFMEASURMENT)
    ) {
      this.errorObj.push('VALVEPRE_TESTDATA_ALLOWABLELEAKAGEUNITOFMEASURMENT');
    }
    if (
      this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ALLOWABLELEAKAGEUNITOFMEASURMENT) &&
      !this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ALLOWABLELEAKAGE
    ) {
      this.errorObj.push('VALVEPRE_TESTDATA_ALLOWABLELEAKAGE');
    }

    if (
      this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ACTUALLEAKAGE) &&
      !this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ACTUALLEAKAGEUNITOFMEASURMENT)
    ) {
      this.errorObj.push('VALVEPRE_TESTDATA_ACTUALLEAKAGEUNITOFMEASURMENT');
    }
    if (
      this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ACTUALLEAKAGEUNITOFMEASURMENT) &&
      !this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_ACTUALLEAKAGE
    ) {
      this.errorObj.push('VALVEPRE_TESTDATA_ACTUALLEAKAGE');
    }

    if (
      this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_HYDROTESTPRESSURE) &&
      !this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_HYDROTESTPRESSUREUOM)
    ) {
      this.errorObj.push('VALVEPRE_TESTDATA_HYDROTESTPRESSUREUOM');
    }
    if (
      this.showValidationClass(this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_HYDROTESTPRESSUREUOM) &&
      !this.OptionalObj.ValvePreTestData.VALVEPRE_TESTDATA_HYDROTESTPRESSURE
    ) {
      this.errorObj.push('VALVEPRE_TESTDATA_HYDROTESTPRESSURE');
    }

    // Materials Verification
    objectToInsert[this.key + '_MATERIALSVERIFICATION_MATERIALSVERIFICATION_NA'] = this.OptionalObj.MaterialsVerification_NA;
    for (const a in this.OptionalObj.MaterialsVerification) {
      objectToInsert[this.key + '_' + a] = this.OptionalObj.MaterialsVerification[a];
      this.manageOtherValueValidation('MaterialsVerification', a);
    }

    // Sliding Item
    objectToInsert[this.key + '_SLIDINGITEM_SLIDINGITEM_NA'] = this.OptionalObj.SlidingItem_NA;
    for (const a in this.OptionalObj.SlidingItem) {
      objectToInsert[this.key + '_' + a] = this.OptionalObj.SlidingItem[a];
      this.manageOtherValueValidation('SlidingItem', a);
    }

    // Rotary Valve
    objectToInsert[this.key + '_ROTARYVALVE_ROTARYVALVE_NA'] = this.OptionalObj.RotaryValve_NA;
    for (const a in this.OptionalObj.RotaryValve) {
      objectToInsert[this.key + '_' + a] = this.OptionalObj.RotaryValve[a];
      this.manageOtherValueValidation('RotaryValve', a);
    }

    if (this.deviceId == Enums.FlowIsolationProductId.ControlValve) {
      // Controller Construction
      objectToInsert[this.key + '_CONTROLLERCONSTRUCTION_CONTROLLERCONSTRUCTION_NA'] = this.OptionalObj.ControllerConstruction_NA;
      for (const a in this.OptionalObj.ControllerConstruction) {
        objectToInsert[this.key + '_' + a] = this.OptionalObj.ControllerConstruction[a];
        this.manageOtherValueValidation('ControllerConstruction', a);
      }
    }

    if (this.deviceId == Enums.FlowIsolationProductId.ControlValve || this.deviceId == Enums.FlowIsolationProductId.TrimOnly) {
      // Witness Hold Points
      objectToInsert[this.key + '_WITNESSHOLDPOINTS_WITNESSHOLDPOINTS_NA'] = this.OptionalObj.WitnessHoldPoints_NA;
    }

    if (this.errorObj.length > 0) {
      return;
    }

    this.localServiceSdr.insertOrUpdateData(objectToInsert, this.isRecordExists, 'OP_PK_ID', 'OPTIONALFLOWISOLATION').then((res): any => {
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'insertData', ' Error in insertData : ' + JSON.stringify(error));
    });
  }

  addWitness() {
    let WitnessHoldPointsObj = Object.assign({}, this.WitnessHoldPointsObj);
    WitnessHoldPointsObj.REPORTID = this.reportID;
    this.errorObj = [];
    if (!WitnessHoldPointsObj.DATECOMPLETED) {
      this.errorObj.push('DATECOMPLETED');
    }
    if (!WitnessHoldPointsObj.CUSTOMERNAME) {
      this.errorObj.push('CUSTOMERNAME');
    }
    if (!WitnessHoldPointsObj.TECHNAME) {
      this.errorObj.push('TECHNAME');
    }
    if (WitnessHoldPointsObj.WHPVALUE == -1 && !WitnessHoldPointsObj.WHPVALUE_OT) {
      this.errorObj.push('WHPVALUE_OT');
    }
    if (this.errorObj.length > 0) {
      this.utilityProvider.presentAlert();
      return;
    }
    if (WitnessHoldPointsObj.WHPVALUE == 'No Value') {
      WitnessHoldPointsObj.WHPVALUE = null;
    }
    this.localServiceSdr.insertOrUpdateData(WitnessHoldPointsObj, false, 'WHP_PK_ID', 'WITNESSHOLDPOINTSFLOWISOLATION').then((res): any => {
      this.WitnessHoldPoints.push(WitnessHoldPointsObj);
      this.errorObj = [];
      this.WitnessHoldPointsObj = {
        WHP_PK_ID: null,
        REPORTID: null,
        DATECOMPLETED: null,
        WHPVALUE: null,
        WHPVALUE_OT: null,
        CUSTOMERNAME: null,
        TECHNAME: null
      };
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'addWitness', ' Error in addWitness : ' + JSON.stringify(error));
    });
  }

  getWitnessHoldPoints() {
    try {
      this.localServiceSdr.getWitnessHoldPoints(this.reportID).then((res: any): any => {
        if (res && res.length) {
          this.WitnessHoldPoints = [];
          for (var i in res) {
            const WitnessHoldPoint = JSON.parse(JSON.stringify(res[i]));
            this.WitnessHoldPoints.push(WitnessHoldPoint);
          }
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getWitnessHoldPoints', ' Error in getWitnessHoldPoints : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.logger.log(this.fileName, "getWitnessHoldPoints", "Error: " + error.message);
    }
  }

  deleteWitnessHoldPoint(index) {
    this.localServiceSdr.deleteWitnessHoldPoint(this.WitnessHoldPoints[index].WHP_PK_ID);
    this.WitnessHoldPoints.splice(index, 1);
  }

  copyAsFoundToAsLeft() {
    let _ASFOUND_OT = '';
    let _ASFOUND = '';
    for (const a in this.OptionalObj.MaterialsVerification) {
      if (a.indexOf('_ASLEFT_OT') != -1) {
        this.OptionalObj.MaterialsVerification[a] = _ASFOUND_OT;
      } else if (a.indexOf('_ASLEFT') != -1) {
        this.OptionalObj.MaterialsVerification[a] = _ASFOUND;
      }

      if (a.indexOf('_ASFOUND_OT') != -1) {
        _ASFOUND_OT = this.OptionalObj.MaterialsVerification[a];
      } else if (a.indexOf('_ASFOUND') != -1) {
        _ASFOUND = this.OptionalObj.MaterialsVerification[a];
      }
    }
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
