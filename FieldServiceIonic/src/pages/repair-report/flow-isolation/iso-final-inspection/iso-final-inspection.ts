import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { AccordionData } from '../../../../beans/AccordionData';
import * as Enums from '../../../../enums/enums';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { ValueProvider } from '../../../../providers/value/value';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the IsoFinalInspectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-iso-final-inspection',
  templateUrl: 'iso-final-inspection.html',
})
export class IsoFinalInspectionPage {
  showLoader: boolean = false;
  toggleAllaccordion: boolean = false;
  expandOuterAccordion: any = {};
  Enums: any;
  reportID: any;
  selectedProcess: any;
  fileName: any = 'FinalInspection_Tab';
  deviceId: any;
  isRecordExists: boolean = false;
  bottomBtnClicked: boolean = false;
  key = 'CV';
  bottomNavBtn: any;
  FinalInspectionObj: any = {
    FI_PK_ID: null,
    BodyAssembly: {
      PassAll: '',
      FailAll: '',
      BODYHT: '',
      BONNETHT: '',
      BOTTOMHT: '',
      SEALPROTECTORRINGHT: '',
      BODYSIZERATING: '',
      BODYBONNETMATERIAL: '',
      BODYMATERIALCORRECT: '',
      BOLTINGTORQUEDTOSPECIFICATION: '',
      PAINTEDPERFFS6A28COLOR: '',
      PAINTEDPERCUSTOMERREQUIREMENTS: '',
      SERIALNUMBER: '',
      NAMEPLATEINFORMATIONCORRECT: '',
      FLOWDIRECTIONARROW: '',
      MINIMUMWALLTHICKNESS: '',
      ROTATIONINDICATOR: '',
      HYDROSTAMP: '',
      SERVICECOTAGATTACHED: '',
      CORROSIONPROTECTIONOILAPPLIED: '',
      HEATNUMBERONBODYBONNETLISTONRIGHT: '',
      ENDCONNECTIONSFLANGES: '',
      CASTINGSMEETMSSSP55: '',
      FISHERCERTIFIEDTAGATTACHED: '',
    },
    ActuatorAssembly: {
      PassAll: '',
      FailAll: '',
      NAMEPLATEINFORMATIONCORRECT: '',
      SAFETYTAGATTACHED: '',
      PAINTEDPERFFS6A28COLOR: '',
      PAINTEDPERCUSTOMERREQUIREMENTS: '',
      VENTCAPATTACHED: '',
      TOPLOADINGPORTCAPPEDOFF: '',
      SERIALNUMBER: '',
      SIZEANDTYPE: '',
      STEMCONNASSYTIGHTCORRECTPOS: '',
      SERVICECOTAGATTACHED: '',
      ALLOTHERCONNSECURED: '',
    },
    InstrumentationAccessories: {
      PassAll: '',
      FailAll: '',
      PaintedPerFFS6A28: '',
      PaintedPerCustomerRequirements: '',
      NamePlateInformationCorrect: '',
      ServiceCoTagAttached: '',
      HazardousApprovalMarksValidated: '',
      CorrectTubingFittings: '',
      CorrectMountingOrientation: '',
      CalibrationTagAttached: '',
      IfPerformedFlowscannerTagAtt: '',
      AllOtherConnMtgPartSecured: ''
    },
    LevelTrolAssembly: {
      PassAll: '',
      FailAll: '',
      PaintedPerFFS6A28: '',
      CageHeadMaterial: '',
      PaintedPerCustomerRequirements: '',
      SerialNumber: '',
      NamePlateInformationCorrect: '',
      HydroStamp: '',
      ServiceCoTagAttached: '',
      CorrosionProtectionOilApplied: '',
      CorrectCageHeadAssyOrientation: '',
      CenterLinePlateAttached: '',
      TorqueTubeCoverCapSecured: '',
      ShippingBlocksInPlaceAndSecure: ''
    },
    RegulatorAssembly: {
      PassAll: '',
      FailAll: '',
      PaintedPerFFS6A28: '',
      PaintedPerCustomerRequirements: '',
      NamePlateInformationCorrect: '',
      SpecialTaggingAttached: '',
      ServiceCoTagAttached: '',
      RegulatorPresetandTagged: '',
    },
    Documentation: {
      PassAll: '',
      FailAll: '',
      RepairOrderComplete: '',
      JobInstructionsComplete: '',
      RepairReportComplete: '',
      OracleQualityReportComplete: '',
      DiagnosticsReportComplete: '',
      AsShippedPhoto: '',
      PIDTag: '',
      WeldReportsPWHTChartsComplete: '',
      NDEReportsComplete: ''
    },
    Shipping: {
      PassAll: '',
      FailAll: '',
      JobInstructionsComplete: '',
      FinalOverallVisual: '',
      InstructionManuals: '',
      FlangeCovers: '',
      OpenPortsCapped: '',
      PaperWorkCompleted: '',
      OldPartsReturned: '',
      Scrapped: ''
    }
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public localServiceSdr: LocalServiceSdrProvider,
    public valueProvider: ValueProvider,
    public utilityProvider: UtilityProvider,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public logger: LoggerProvider, public events: Events) {
    this.Enums = Enums;
  }

  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });

    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Final Inspection" };
    this.reportID = this.valueProvider.getCurrentReport().REPORTID;
    this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
    this.localServiceSdr.getDEVICEIDForFlowIsolation(this.reportID).then((res: any) => {
      this.deviceId = res;
      if (this.deviceId == Enums.FlowIsolationProductId.ControlValve) {
        this.key = 'CV';
      } else if (this.deviceId == Enums.FlowIsolationProductId.Controller) {
        this.key = 'CTR';
      } else if (this.deviceId == Enums.FlowIsolationProductId.Instrument) {
        this.key = 'INS';
      } else if (this.deviceId == Enums.FlowIsolationProductId.Isolation) {
        this.key = 'ISO';
      } else if (this.deviceId == Enums.FlowIsolationProductId.LevelTroll) {
        this.key = 'LT';
      } else if (this.deviceId == Enums.FlowIsolationProductId.Regulator) {
        this.key = 'REG';
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

  ionViewWillLeave() {
    this.insertData();
  }

  generateAccordionKeys() {
    let accordionData = new AccordionData();
    for (let key in accordionData.AccordionKeys) {
      let val: any = accordionData.AccordionKeys[key];
      this.expandOuterAccordion[val] = false;
    }
  }

  getExistingData() {
    this.localServiceSdr.getFinalInspectionData(this.reportID).then((res: any): any => {
      if (res && res.length) {
        this.isRecordExists = true;
        const existingDevice = JSON.parse(JSON.stringify(res[0]));
        this.FinalInspectionObj.FI_PK_ID = existingDevice.FI_PK_ID;
        // Assign database object to FinalInspectionObj
        // BodyAssembly
        this.FinalInspectionObj.BodyAssembly_NA = existingDevice.CV_BODYASSEMBLY_NA;
        this.FinalInspectionObj.BodyAssembly.BODYHT = existingDevice.CV_BODYASSEMBLY_BODYHT;
        this.FinalInspectionObj.BodyAssembly.BONNETHT = existingDevice.CV_BODYASSEMBLY_BONNETHT;
        this.FinalInspectionObj.BodyAssembly.BOTTOMHT = existingDevice.CV_BODYASSEMBLY_BOTTOMHT;
        this.FinalInspectionObj.BodyAssembly.SEALPROTECTORRINGHT = existingDevice.CV_BODYASSEMBLY_SEALPROTECTORRINGHT;
        this.FinalInspectionObj.BodyAssembly.BODYSIZERATING = existingDevice.CV_BODYASSEMBLY_BODYSIZE_RATING;
        this.FinalInspectionObj.BodyAssembly.BODYBONNETMATERIAL = existingDevice.CV_BODYASSEMBLY_BODY_BONNETMATERIAL;
        this.FinalInspectionObj.BodyAssembly.BODYMATERIALCORRECT = existingDevice.CV_BODYASSEMBLY_BODYMATERIALCORRECT;
        this.FinalInspectionObj.BodyAssembly.BOLTINGTORQUEDTOSPECIFICATION = existingDevice.CV_BODYASSEMBLY_BOLTINGTORQUEDTOSPECIFICATION;
        this.FinalInspectionObj.BodyAssembly.PAINTEDPERFFS6A28COLOR = existingDevice.CV_BODYASSEMBLY_PAINTEDPERFFS6A28_CLR;
        this.FinalInspectionObj.BodyAssembly.PAINTEDPERCUSTOMERREQUIREMENTS = existingDevice.CV_BODYASSEMBLY_PAINTEDPERCUSTOMERREQUIREMENTS;
        this.FinalInspectionObj.BodyAssembly.SERIALNUMBER = existingDevice.CV_BODYASSEMBLY_SERIALNUMBER;
        this.FinalInspectionObj.BodyAssembly.NAMEPLATEINFORMATIONCORRECT = existingDevice.CV_BODYASSEMBLY_NAMEPLATEINFORMATIONCORRECT;
        this.FinalInspectionObj.BodyAssembly.FLOWDIRECTIONARROW = existingDevice.CV_BODYASSEMBLY_FLOWDIRECTIONARROW;
        this.FinalInspectionObj.BodyAssembly.MINIMUMWALLTHICKNESS = existingDevice.CV_BODYASSEMBLY_MINIMUMWALLTHICKNESS;
        this.FinalInspectionObj.BodyAssembly.ROTATIONINDICATOR = existingDevice.CV_BODYASSEMBLY_ROTATIONINDICATOR;
        this.FinalInspectionObj.BodyAssembly.HYDROSTAMP = existingDevice.CV_BODYASSEMBLY_HYDROSTAMP;
        this.FinalInspectionObj.BodyAssembly.SERVICECOTAGATTACHED = existingDevice.CV_BODYASSEMBLY_SERVICECOTAGATTACHED;
        this.FinalInspectionObj.BodyAssembly.CORROSIONPROTECTIONOILAPPLIED = existingDevice.CV_BODYASSEMBLY_CORROSIONPROTECTIONOILAPPLIED;
        this.FinalInspectionObj.BodyAssembly.HEATNUMBERONBODYBONNETLISTONRIGHT = existingDevice.CV_BODYASSEMBLY_HEATNUMBERONBODY_BONNET_LISTONRIGHT;
        this.FinalInspectionObj.BodyAssembly.ENDCONNECTIONSFLANGES = existingDevice.CV_BODYASSEMBLY_ENDCONNECTIONS_FLANGES;
        this.FinalInspectionObj.BodyAssembly.CASTINGSMEETMSSSP55 = existingDevice.CV_BODYASSEMBLY_CASTINGSMEETMSS_SP55;
        this.FinalInspectionObj.BodyAssembly.FISHERCERTIFIEDTAGATTACHED = existingDevice.CV_BODYASSEMBLY_FISHERCERTIFIEDTAGATTACHED;
        // ActuatorAssembly
        this.FinalInspectionObj.ActuatorAssembly_NA = existingDevice.CV_ACTUATORASSEMBLY_NA;
        this.FinalInspectionObj.ActuatorAssembly.NAMEPLATEINFORMATIONCORRECT = existingDevice.CV_ACTUATORASSEMBLY_NAMEPLATEINFORMATIONCORRECT;
        this.FinalInspectionObj.ActuatorAssembly.SAFETYTAGATTACHED = existingDevice.CV_ACTUATORASSEMBLY_SAFETYTAGATTACHED;
        this.FinalInspectionObj.ActuatorAssembly.PAINTEDPERFFS6A28COLOR = existingDevice.CV_ACTUATORASSEMBLY_PAINTEDPERFFS6A28_CLR;
        this.FinalInspectionObj.ActuatorAssembly.PAINTEDPERCUSTOMERREQUIREMENTS = existingDevice.CV_ACTUATORASSEMBLY_PAINTEDPERCUSTOMERREQUIREMENTS;
        this.FinalInspectionObj.ActuatorAssembly.VENTCAPATTACHED = existingDevice.CV_ACTUATORASSEMBLY_VENTCAPATTACHED;
        this.FinalInspectionObj.ActuatorAssembly.TOPLOADINGPORTCAPPEDOFF = existingDevice.CV_ACTUATORASSEMBLY_TOPLOADINGPORTCAPPEDOFF;
        this.FinalInspectionObj.ActuatorAssembly.SERIALNUMBER = existingDevice.CV_ACTUATORASSEMBLY_SERIALNUMBER;
        this.FinalInspectionObj.ActuatorAssembly.SIZEANDTYPE = existingDevice.CV_ACTUATORASSEMBLY_SIZEANDTYPE;
        this.FinalInspectionObj.ActuatorAssembly.STEMCONNASSYTIGHTCORRECTPOS = existingDevice.CV_ACTUATORASSEMBLY_STEMCONNASSYTIGHT_CORRECTPOS;
        this.FinalInspectionObj.ActuatorAssembly.SERVICECOTAGATTACHED = existingDevice.CV_ACTUATORASSEMBLY_SERVICECOTAGATTACHED;
        this.FinalInspectionObj.ActuatorAssembly.ALLOTHERCONNSECURED = existingDevice.CV_ACTUATORASSEMBLY_ALLOTHERCONNSECURED;
        // Documentation
        this.FinalInspectionObj.Documentation_NA = existingDevice['DOCUMENTATION_NA'];
        this.FinalInspectionObj.Documentation.RepairOrderComplete = existingDevice['DOCUMENTATION_REPAIRORDERCOMPLETE'];
        this.FinalInspectionObj.Documentation.JobInstructionsComplete = existingDevice['DOCUMENTATION_JOBINSTRUCTIONSCOMPLETE'];
        this.FinalInspectionObj.Documentation.RepairReportComplete = existingDevice['DOCUMENTATION_REPAIRREPORTCOMPLETE'];
        this.FinalInspectionObj.Documentation.OracleQualityReportComplete = existingDevice['DOCUMENTATION_ORACLEQUALITYREPORTCOMPLETE'];
        this.FinalInspectionObj.Documentation.DiagnosticsReportComplete = existingDevice['DOCUMENTATION_DIAGNOSTICSREPORTCOMPLETE'];
        this.FinalInspectionObj.Documentation.AsShippedPhoto = existingDevice['DOCUMENTATION_ASSHIPPEDPHOTO'];
        this.FinalInspectionObj.Documentation.PIDTag = existingDevice['DOCUMENTATION_PIDTAG'];
        this.FinalInspectionObj.Documentation.WeldReportsPWHTChartsComplete = existingDevice['DOCUMENTATION_WELDREPORTS_PWHTCHARTSCOMPLETE'];
        this.FinalInspectionObj.Documentation.NDEReportsComplete = existingDevice['DOCUMENTATION_NDEREPORTSCOMPLETE'];
        // INSTRUMENTATION/ACCESSORIES
        this.FinalInspectionObj.InstrumentationAccessories_NA = existingDevice['INSTRUMENTATION_ACCESSORIES_NA'];
        this.FinalInspectionObj.InstrumentationAccessories.PaintedPerFFS6A28 = existingDevice['INSTRUMENTATION_ACCESSORIES_PAINTEDPERFFS6A28_CLR'];
        this.FinalInspectionObj.InstrumentationAccessories.PaintedPerCustomerRequirements = existingDevice['INSTRUMENTATION_ACCESSORIES_PAINTEDPERCUSTOMERREQUIREMENTS'];
        this.FinalInspectionObj.InstrumentationAccessories.NamePlateInformationCorrect = existingDevice['INSTRUMENTATION_ACCESSORIESNAMEPLATEINFORMATIONCORRECT'];
        this.FinalInspectionObj.InstrumentationAccessories.ServiceCoTagAttached = existingDevice['INSTRUMENTATION_ACCESSORIES_SERVICECOTAGATTACHED'];
        this.FinalInspectionObj.InstrumentationAccessories.HazardousApprovalMarksValidated = existingDevice['INSTRUMENTATION_ACCESSORIES_HAZARDOUSAPPROVALMARKSVALIDATED'];
        this.FinalInspectionObj.InstrumentationAccessories.CorrectTubingFittings = existingDevice['INSTRUMENTATION_ACCESSORIES_CORRECTTUBING_FITTINGS'];
        this.FinalInspectionObj.InstrumentationAccessories.CorrectMountingOrientation = existingDevice['INSTRUMENTATION_ACCESSORIES_CORRECTMOUNTINGORIENTATION'];
        this.FinalInspectionObj.InstrumentationAccessories.CalibrationTagAttached = existingDevice['INSTRUMENTATION_ACCESSORIES_CALIBRATIONTAGATTACHED'];
        this.FinalInspectionObj.InstrumentationAccessories.IfPerformedFlowscannerTagAtt = existingDevice['INSTRUMENTATION_ACCESSORIES_IFPERFORMED_FLOWSCANNERTAGATT'];
        this.FinalInspectionObj.InstrumentationAccessories.AllOtherConnMtgPartSecured = existingDevice['INSTRUMENTATION_ACCESSORIES_ALLOTHERCONN_MTGPARTSECURED'];
        // LEVEL-TROL ASSEMBLY
        this.FinalInspectionObj.LevelTrolAssembly_NA = existingDevice.LT_LEVEL_TROLASSEMBLY_NA;
        this.FinalInspectionObj.LevelTrolAssembly.PaintedPerFFS6A28 = existingDevice.LT_LEVEL_TROLASSEMBLY_PAINTEDPERFFS6A28_CLR;
        this.FinalInspectionObj.LevelTrolAssembly.CageHeadMaterial = existingDevice.LT_LEVEL_TROLASSEMBLY_CAGE_HEADMATERIAL;
        this.FinalInspectionObj.LevelTrolAssembly.PaintedPerCustomerRequirements = existingDevice.LT_LEVEL_TROLASSEMBLY_PAINTEDPERCUSTOMERREQUIREMENTS;
        this.FinalInspectionObj.LevelTrolAssembly.SerialNumber = existingDevice.LT_LEVEL_TROLASSEMBLY_SERIALNUMBER;
        this.FinalInspectionObj.LevelTrolAssembly.NamePlateInformationCorrect = existingDevice.LT_LEVEL_TROLASSEMBLY_NAMEPLATEINFORMATIONCORRECT;
        this.FinalInspectionObj.LevelTrolAssembly.HydroStamp = existingDevice.LT_LEVEL_TROLASSEMBLY_HYDROSTAMP;
        this.FinalInspectionObj.LevelTrolAssembly.ServiceCoTagAttached = existingDevice.LT_LEVEL_TROLASSEMBLY_SERVICECOTAGATTACHED;
        this.FinalInspectionObj.LevelTrolAssembly.CorrosionProtectionOilApplied = existingDevice.LT_LEVEL_TROLASSEMBLY_CORROSIONPROTECTIONOILAPPLIED;
        this.FinalInspectionObj.LevelTrolAssembly.CorrectCageHeadAssyOrientation = existingDevice.LT_LEVEL_TROLASSEMBLY_CORRECTCAGE_HEADASSYORIENTATION;
        this.FinalInspectionObj.LevelTrolAssembly.CenterLinePlateAttached = existingDevice.LT_LEVEL_TROLASSEMBLY_CENTERLINEPLATEATTACHED;
        this.FinalInspectionObj.LevelTrolAssembly.TorqueTubeCoverCapSecured = existingDevice.LT_LEVEL_TROLASSEMBLY_TORQUETUBECOVERCAPSECURED;
        this.FinalInspectionObj.LevelTrolAssembly.ShippingBlocksInPlaceAndSecure = existingDevice.LT_LEVEL_TROLASSEMBLY_SHIPPINGBLOCKSINPLACEANDSECURE;
        // REGULATOR ASSEMBLY
        this.FinalInspectionObj.RegulatorAssembly_NA = existingDevice.REG_REGULATORASSEMBLY_NA;
        this.FinalInspectionObj.RegulatorAssembly.PaintedPerFFS6A28 = existingDevice.REG_REGULATORASSEMBLY_PAINTEDPERFFS6A28_CLR;
        this.FinalInspectionObj.RegulatorAssembly.PaintedPerCustomerRequirements = existingDevice.REG_REGULATORASSEMBLY_PAINTEDPERCUSTOMERREQUIREMENTS;
        this.FinalInspectionObj.RegulatorAssembly.NamePlateInformationCorrect = existingDevice.REG_REGULATORASSEMBLY_NAMEPLATEINFORMATIONCORRECT;
        this.FinalInspectionObj.RegulatorAssembly.SpecialTaggingAttached = existingDevice.REG_REGULATORASSEMBLY_SPECIALTAGGINGATTACHED;
        this.FinalInspectionObj.RegulatorAssembly.ServiceCoTagAttached = existingDevice.REG_REGULATORASSEMBLY_SERVICECOTAGATTACHED;
        this.FinalInspectionObj.RegulatorAssembly.RegulatorPresetandTagged = existingDevice.REG_REGULATORASSEMBLY_REGULATORPRESETANDTAGGED;
        // SHIPPING
        this.FinalInspectionObj.Shipping_NA = existingDevice['SHIPPING_NA'];
        this.FinalInspectionObj.Shipping.JobInstructionsComplete = existingDevice['SHIPPING_JOBINSTRUCTIONSCOMPLETE'];
        this.FinalInspectionObj.Shipping.FinalOverallVisual = existingDevice['SHIPPING_FINALOVERALLVISUAL'];
        this.FinalInspectionObj.Shipping.InstructionManuals = existingDevice['SHIPPING_INSTRUCTIONMANUALS'];
        this.FinalInspectionObj.Shipping.FlangeCovers = existingDevice['SHIPPING_FLANGECOVERS'];
        this.FinalInspectionObj.Shipping.OpenPortsCapped = existingDevice['SHIPPING_OPENPORTSCAPPED'];
        this.FinalInspectionObj.Shipping.PaperWorkCompleted = existingDevice['SHIPPING_PAPERWORKCOMPLETED'];
        this.FinalInspectionObj.Shipping.OldPartsReturned = existingDevice['SHIPPING_OLDPARTS_RETURNED'];
        this.FinalInspectionObj.Shipping.Scrapped = existingDevice['SHIPPING_SCRAPPED'];
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getExistingData', ' Error in getExistingData : ' + JSON.stringify(error));
    });
  }

  toggleAccordion(event) {
    if (this.toggleAllaccordion) {
      let accordionData = new AccordionData();
      for (let key in accordionData.AccordionKeys) {
        let val: any = accordionData.AccordionKeys[key];
        if (!this.FinalInspectionObj[val + "_NA"] || this.FinalInspectionObj[val + "_NA"] == 'false' || this.FinalInspectionObj[val + "_NA"] == false) {
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
                this.FinalInspectionObj[accordionName + "_NA"] = false;
              }
            },
            {
              text: this.translate.instant('OK'),
              handler: () => {
                this.clearAccordion(accordionName);
                if (this.expandOuterAccordion[accordionName] == true) {
                  this.expandOuterAccordion[accordionName] = false
                }
                this.FinalInspectionObj[accordionName + "_NA"] = true;
              }
            }
          ]
        });
        alert.present();
      } else {
        if (this.expandOuterAccordion[accordionName] == true) {
          this.expandOuterAccordion[accordionName] = false
        }
        this.FinalInspectionObj[accordionName + "_NA"] = isChecked;
      }
    } else {
      this.FinalInspectionObj[accordionName + "_NA"] = isChecked;
      this.clearAccordion(accordionName);
    }
  }

  checkIfAccordionHasValue(accordionName) {
    let hasValue = false;
    for (const k in this.FinalInspectionObj[accordionName]) {
      if (this.FinalInspectionObj[accordionName][k] != '' && this.FinalInspectionObj[accordionName][k] != null) {
        hasValue = true;
        break;
      }
    }
    return hasValue;
  }

  clearAccordion(accordionName) {
    for (const k in this.FinalInspectionObj[accordionName]) {
      this.FinalInspectionObj[accordionName][k] = null;
    }
  }

  passAllOrFailAll(action, key, $event) {
    let value = '';
    if ($event.target && $event.target.checked == true) {
      if (action == "PassAll") {
        value = 'Pass';
        this.FinalInspectionObj[key].PassAll = 'true';
        this.FinalInspectionObj[key].FailAll = 'false';
      } else if (action == "FailAll") {
        value = 'Fail';
        this.FinalInspectionObj[key].PassAll = 'false';
        this.FinalInspectionObj[key].FailAll = 'true';
      }
    }
    let ignoreKeys = ['PassAll', 'FailAll', 'BODYHT', 'BONNETHT', 'BOTTOMHT', 'SEALPROTECTORRINGHT'];
    for (const k in this.FinalInspectionObj[key]) {
      if (ignoreKeys.indexOf(k) == -1) {
        this.FinalInspectionObj[key][k] = value;
      }
    }
  }

  setRadioButtonValue(element, key, value) {
    element.PassAll = 'false';
    element.FailAll = 'false';
    element[key] = value;
  }

  insertData() {
    let objectToInsert = {
      FI_PK_ID: this.FinalInspectionObj.FI_PK_ID,
      REPORTID: this.reportID,
    };

    if (this.deviceId == Enums.FlowIsolationProductId.ControlValve) {
      // BodyAssembly
      objectToInsert[this.key + '_BODYASSEMBLY_NA'] = this.FinalInspectionObj.BodyAssembly_NA;
      objectToInsert[this.key + '_BODYASSEMBLY_BODYHT'] = this.FinalInspectionObj.BodyAssembly.BODYHT;
      objectToInsert[this.key + '_BODYASSEMBLY_BONNETHT'] = this.FinalInspectionObj.BodyAssembly.BONNETHT;
      objectToInsert[this.key + '_BODYASSEMBLY_BOTTOMHT'] = this.FinalInspectionObj.BodyAssembly.BOTTOMHT;
      objectToInsert[this.key + '_BODYASSEMBLY_SEALPROTECTORRINGHT'] = this.FinalInspectionObj.BodyAssembly.SEALPROTECTORRINGHT;
      objectToInsert[this.key + '_BODYASSEMBLY_BODYSIZE_RATING'] = this.FinalInspectionObj.BodyAssembly.BODYSIZERATING;
      objectToInsert[this.key + '_BODYASSEMBLY_BODY_BONNETMATERIAL'] = this.FinalInspectionObj.BodyAssembly.BODYBONNETMATERIAL;
      objectToInsert[this.key + '_BODYASSEMBLY_BODYMATERIALCORRECT'] = this.FinalInspectionObj.BodyAssembly.BODYMATERIALCORRECT;
      objectToInsert[this.key + '_BODYASSEMBLY_BOLTINGTORQUEDTOSPECIFICATION'] = this.FinalInspectionObj.BodyAssembly.BOLTINGTORQUEDTOSPECIFICATION;
      objectToInsert[this.key + '_BODYASSEMBLY_PAINTEDPERFFS6A28_CLR'] = this.FinalInspectionObj.BodyAssembly.PAINTEDPERFFS6A28COLOR;
      objectToInsert[this.key + '_BODYASSEMBLY_PAINTEDPERCUSTOMERREQUIREMENTS'] = this.FinalInspectionObj.BodyAssembly.PAINTEDPERCUSTOMERREQUIREMENTS;
      objectToInsert[this.key + '_BODYASSEMBLY_SERIALNUMBER'] = this.FinalInspectionObj.BodyAssembly.SERIALNUMBER;
      objectToInsert[this.key + '_BODYASSEMBLY_NAMEPLATEINFORMATIONCORRECT'] = this.FinalInspectionObj.BodyAssembly.NAMEPLATEINFORMATIONCORRECT;
      objectToInsert[this.key + '_BODYASSEMBLY_FLOWDIRECTIONARROW'] = this.FinalInspectionObj.BodyAssembly.FLOWDIRECTIONARROW;
      objectToInsert[this.key + '_BODYASSEMBLY_MINIMUMWALLTHICKNESS'] = this.FinalInspectionObj.BodyAssembly.MINIMUMWALLTHICKNESS;
      objectToInsert[this.key + '_BODYASSEMBLY_ROTATIONINDICATOR'] = this.FinalInspectionObj.BodyAssembly.ROTATIONINDICATOR;
      objectToInsert[this.key + '_BODYASSEMBLY_HYDROSTAMP'] = this.FinalInspectionObj.BodyAssembly.HYDROSTAMP;
      objectToInsert[this.key + '_BODYASSEMBLY_SERVICECOTAGATTACHED'] = this.FinalInspectionObj.BodyAssembly.SERVICECOTAGATTACHED;
      objectToInsert[this.key + '_BODYASSEMBLY_CORROSIONPROTECTIONOILAPPLIED'] = this.FinalInspectionObj.BodyAssembly.CORROSIONPROTECTIONOILAPPLIED;
      objectToInsert[this.key + '_BODYASSEMBLY_HEATNUMBERONBODY_BONNET_LISTONRIGHT'] = this.FinalInspectionObj.BodyAssembly.HEATNUMBERONBODYBONNETLISTONRIGHT;
      objectToInsert[this.key + '_BODYASSEMBLY_ENDCONNECTIONS_FLANGES'] = this.FinalInspectionObj.BodyAssembly.ENDCONNECTIONSFLANGES;
      objectToInsert[this.key + '_BODYASSEMBLY_CASTINGSMEETMSS_SP55'] = this.FinalInspectionObj.BodyAssembly.CASTINGSMEETMSSSP55;
      objectToInsert[this.key + '_BODYASSEMBLY_FISHERCERTIFIEDTAGATTACHED'] = this.FinalInspectionObj.BodyAssembly.FISHERCERTIFIEDTAGATTACHED;
      // ActuatorAssembly
      objectToInsert[this.key + '_ACTUATORASSEMBLY_NA'] = this.FinalInspectionObj.ActuatorAssembly_NA;
      objectToInsert[this.key + '_ACTUATORASSEMBLY_NAMEPLATEINFORMATIONCORRECT'] = this.FinalInspectionObj.ActuatorAssembly.NAMEPLATEINFORMATIONCORRECT;
      objectToInsert[this.key + '_ACTUATORASSEMBLY_SAFETYTAGATTACHED'] = this.FinalInspectionObj.ActuatorAssembly.SAFETYTAGATTACHED;
      objectToInsert[this.key + '_ACTUATORASSEMBLY_PAINTEDPERFFS6A28_CLR'] = this.FinalInspectionObj.ActuatorAssembly.PAINTEDPERFFS6A28COLOR;
      objectToInsert[this.key + '_ACTUATORASSEMBLY_PAINTEDPERCUSTOMERREQUIREMENTS'] = this.FinalInspectionObj.ActuatorAssembly.PAINTEDPERCUSTOMERREQUIREMENTS;
      objectToInsert[this.key + '_ACTUATORASSEMBLY_VENTCAPATTACHED'] = this.FinalInspectionObj.ActuatorAssembly.VENTCAPATTACHED;
      objectToInsert[this.key + '_ACTUATORASSEMBLY_TOPLOADINGPORTCAPPEDOFF'] = this.FinalInspectionObj.ActuatorAssembly.TOPLOADINGPORTCAPPEDOFF;
      objectToInsert[this.key + '_ACTUATORASSEMBLY_SERIALNUMBER'] = this.FinalInspectionObj.ActuatorAssembly.SERIALNUMBER;
      objectToInsert[this.key + '_ACTUATORASSEMBLY_SIZEANDTYPE'] = this.FinalInspectionObj.ActuatorAssembly.SIZEANDTYPE;
      objectToInsert[this.key + '_ACTUATORASSEMBLY_STEMCONNASSYTIGHT_CORRECTPOS'] = this.FinalInspectionObj.ActuatorAssembly.STEMCONNASSYTIGHTCORRECTPOS;
      objectToInsert[this.key + '_ACTUATORASSEMBLY_SERVICECOTAGATTACHED'] = this.FinalInspectionObj.ActuatorAssembly.SERVICECOTAGATTACHED;
      objectToInsert[this.key + '_ACTUATORASSEMBLY_ALLOTHERCONNSECURED'] = this.FinalInspectionObj.ActuatorAssembly.ALLOTHERCONNSECURED;
    }

    // Documentation
    objectToInsert['DOCUMENTATION_NA'] = this.FinalInspectionObj.Documentation_NA;
    objectToInsert['DOCUMENTATION_REPAIRORDERCOMPLETE'] = this.FinalInspectionObj.Documentation.RepairOrderComplete;
    objectToInsert['DOCUMENTATION_JOBINSTRUCTIONSCOMPLETE'] = this.FinalInspectionObj.Documentation.JobInstructionsComplete;
    objectToInsert['DOCUMENTATION_REPAIRREPORTCOMPLETE'] = this.FinalInspectionObj.Documentation.RepairReportComplete;
    objectToInsert['DOCUMENTATION_ORACLEQUALITYREPORTCOMPLETE'] = this.FinalInspectionObj.Documentation.RepairOrderComplete;
    objectToInsert['DOCUMENTATION_DIAGNOSTICSREPORTCOMPLETE'] = this.FinalInspectionObj.Documentation.RepairOrderComplete;
    objectToInsert['DOCUMENTATION_ASSHIPPEDPHOTO'] = this.FinalInspectionObj.Documentation.RepairOrderComplete;
    objectToInsert['DOCUMENTATION_PIDTAG'] = this.FinalInspectionObj.Documentation.RepairOrderComplete;
    objectToInsert['DOCUMENTATION_WELDREPORTS_PWHTCHARTSCOMPLETE'] = this.FinalInspectionObj.Documentation.RepairOrderComplete;
    objectToInsert['DOCUMENTATION_NDEREPORTSCOMPLETE'] = this.FinalInspectionObj.Documentation.RepairOrderComplete;
    // SHIPPING
    objectToInsert['SHIPPING_NA'] = this.FinalInspectionObj.Shipping_NA;
    objectToInsert['SHIPPING_JOBINSTRUCTIONSCOMPLETE'] = this.FinalInspectionObj.Shipping.JobInstructionsComplete;
    objectToInsert['SHIPPING_FINALOVERALLVISUAL'] = this.FinalInspectionObj.Shipping.FinalOverallVisual;
    objectToInsert['SHIPPING_INSTRUCTIONMANUALS'] = this.FinalInspectionObj.Shipping.InstructionManuals;
    objectToInsert['SHIPPING_FLANGECOVERS'] = this.FinalInspectionObj.Shipping.FlangeCovers;
    objectToInsert['SHIPPING_OPENPORTSCAPPED'] = this.FinalInspectionObj.Shipping.OpenPortsCapped;
    objectToInsert['SHIPPING_PAPERWORKCOMPLETED'] = this.FinalInspectionObj.Shipping.PaperWorkCompleted;
    objectToInsert['SHIPPING_OLDPARTS_RETURNED'] = this.FinalInspectionObj.Shipping.OldPartsReturned;
    objectToInsert['SHIPPING_SCRAPPED'] = this.FinalInspectionObj.Shipping.Scrapped;

    // INSTRUMENTATION/ACCESSORIES
    if (this.deviceId == Enums.FlowIsolationProductId.ControlValve || this.deviceId == Enums.FlowIsolationProductId.Instrument) {
      objectToInsert['INSTRUMENTATION_ACCESSORIES_NA'] = this.FinalInspectionObj.InstrumentationAccessories_NA;
      objectToInsert['INSTRUMENTATION_ACCESSORIES_PAINTEDPERFFS6A28_CLR'] = this.FinalInspectionObj.InstrumentationAccessories.PaintedPerFFS6A28;
      objectToInsert['INSTRUMENTATION_ACCESSORIES_PAINTEDPERCUSTOMERREQUIREMENTS'] = this.FinalInspectionObj.InstrumentationAccessories.PaintedPerCustomerRequirements;
      objectToInsert['INSTRUMENTATION_ACCESSORIESNAMEPLATEINFORMATIONCORRECT'] = this.FinalInspectionObj.InstrumentationAccessories.NamePlateInformationCorrect;
      objectToInsert['INSTRUMENTATION_ACCESSORIES_SERVICECOTAGATTACHED'] = this.FinalInspectionObj.InstrumentationAccessories.ServiceCoTagAttached;
      objectToInsert['INSTRUMENTATION_ACCESSORIES_HAZARDOUSAPPROVALMARKSVALIDATED'] = this.FinalInspectionObj.InstrumentationAccessories.HazardousApprovalMarksValidated;
      objectToInsert['INSTRUMENTATION_ACCESSORIES_CORRECTTUBING_FITTINGS'] = this.FinalInspectionObj.InstrumentationAccessories.CorrectTubingFittings;
      objectToInsert['INSTRUMENTATION_ACCESSORIES_CORRECTMOUNTINGORIENTATION'] = this.FinalInspectionObj.InstrumentationAccessories.CorrectMountingOrientation;
      objectToInsert['INSTRUMENTATION_ACCESSORIES_CALIBRATIONTAGATTACHED'] = this.FinalInspectionObj.InstrumentationAccessories.CalibrationTagAttached;
      objectToInsert['INSTRUMENTATION_ACCESSORIES_IFPERFORMED_FLOWSCANNERTAGATT'] = this.FinalInspectionObj.InstrumentationAccessories.IfPerformedFlowscannerTagAtt;
      objectToInsert['INSTRUMENTATION_ACCESSORIES_ALLOTHERCONN_MTGPARTSECURED'] = this.FinalInspectionObj.InstrumentationAccessories.AllOtherConnMtgPartSecured;
    }

    // REGULATOR ASSEMBLY
    if (this.deviceId == Enums.FlowIsolationProductId.Regulator) {
      objectToInsert[this.key + '_REGULATORASSEMBLY_NA'] = this.FinalInspectionObj.RegulatorAssembly_NA;
      objectToInsert[this.key + '_REGULATORASSEMBLY_PAINTEDPERFFS6A28_CLR'] = this.FinalInspectionObj.RegulatorAssembly.PaintedPerFFS6A28;
      objectToInsert[this.key + '_REGULATORASSEMBLY_PAINTEDPERCUSTOMERREQUIREMENTS'] = this.FinalInspectionObj.RegulatorAssembly.PaintedPerCustomerRequirements;
      objectToInsert[this.key + '_REGULATORASSEMBLY_NAMEPLATEINFORMATIONCORRECT'] = this.FinalInspectionObj.RegulatorAssembly.NamePlateInformationCorrect;
      objectToInsert[this.key + '_REGULATORASSEMBLY_SPECIALTAGGINGATTACHED'] = this.FinalInspectionObj.RegulatorAssembly.SpecialTaggingAttached;
      objectToInsert[this.key + '_REGULATORASSEMBLY_SERVICECOTAGATTACHED'] = this.FinalInspectionObj.RegulatorAssembly.ServiceCoTagAttached;
      objectToInsert[this.key + '_REGULATORASSEMBLY_REGULATORPRESETANDTAGGED'] = this.FinalInspectionObj.RegulatorAssembly.RegulatorPresetandTagged;
    }

    // LEVEL-TROL ASSEMBLY
    if (this.deviceId == Enums.FlowIsolationProductId.LevelTroll) {
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_NA'] = this.FinalInspectionObj.LevelTrolAssembly_NA;
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_PAINTEDPERFFS6A28_CLR'] = this.FinalInspectionObj.LevelTrolAssembly.PaintedPerFFS6A28;
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_CAGE_HEADMATERIAL'] = this.FinalInspectionObj.LevelTrolAssembly.CageHeadMaterial;
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_PAINTEDPERCUSTOMERREQUIREMENTS'] = this.FinalInspectionObj.LevelTrolAssembly.PaintedPerCustomerRequirements;
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_SERIALNUMBER'] = this.FinalInspectionObj.LevelTrolAssembly.SerialNumber;
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_NAMEPLATEINFORMATIONCORRECT'] = this.FinalInspectionObj.LevelTrolAssembly.NamePlateInformationCorrect;
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_HYDROSTAMP'] = this.FinalInspectionObj.LevelTrolAssembly.HydroStamp;
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_SERVICECOTAGATTACHED'] = this.FinalInspectionObj.LevelTrolAssembly.ServiceCoTagAttached;
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_CORROSIONPROTECTIONOILAPPLIED'] = this.FinalInspectionObj.LevelTrolAssembly.CorrosionProtectionOilApplied;
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_CORRECTCAGE_HEADASSYORIENTATION'] = this.FinalInspectionObj.LevelTrolAssembly.CorrectCageHeadAssyOrientation;
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_CENTERLINEPLATEATTACHED'] = this.FinalInspectionObj.LevelTrolAssembly.CenterLinePlateAttached;
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_TORQUETUBECOVERCAPSECURED'] = this.FinalInspectionObj.LevelTrolAssembly.TorqueTubeCoverCapSecured;
      objectToInsert[this.key + '_LEVEL_TROLASSEMBLY_SHIPPINGBLOCKSINPLACEANDSECURE'] = this.FinalInspectionObj.LevelTrolAssembly.ShippingBlocksInPlaceAndSecure;
    }

    this.localServiceSdr.insertOrUpdateData(objectToInsert, this.isRecordExists, 'FI_PK_ID', 'FINALINSPECTIONFLOWISOLATION').then((res): any => {
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'insertData', ' Error in insertData : ' + JSON.stringify(error));
    });
  }
  goToFcr() {
    this.events.publish("goToFCR");
  }

  redirect(value) {
    this.bottomBtnClicked = true;
    this.utilityProvider.bottomNavigation(this.navCtrl, value);
  }

}
