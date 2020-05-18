import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { AccordionData } from '../../../../beans/AccordionData'
import { ValueProvider } from '../../../../providers/value/value';
import { AttachmentProvider } from '../../../../providers/attachment/attachment';
declare var cordova: any;
import * as Enums from '../../../../enums/enums';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html',
})
export class PhotosPage {
  showLoader: boolean = false;
  AsFoundArray: any[] = [];
  CalibrationConfigurationArray: any[] = [];
  SolutionArray: any[] = [];
  FinalTestsArray: any[] = [];
  AsFoundAssemblyArray: any[] = [];
  AsFoundTrimArray: any[] = [];
  AsLeftTrimArray: any[] = [];
  AsLeftAssemblyArray: any[] = [];
  AsFoundAssemblyPhotosArray: any[] = [];
  AsFoundTrimPhotosArray: any[] = [];
  AsFoundPerformanceArray: any[] = [];
  TestDataArray: any[] = [];
  FinalInspectionArray: any[] = [];
  InspectionMeasurementArray: any[] = [];
  FindingsArray: any[] = [];
  fileName: any = 'Photos_Tab';
  Enums: any;
  tempFileName: any;
  renamedAttachment: any;
  reportID: any;
  expandOuterAccordion: any = {};
  toggleAllaccordion: boolean = false;
  thumbFilePath: any;
  attachFilePath: any;
  filee: any;
  selectedProcess: any;
  flowName: any;
  deviceID: any;
  bottomNavBtn: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public localServiceSdr: LocalServiceSdrProvider, public valueProvider: ValueProvider,
    public utilityProvider: UtilityProvider, public logger: LoggerProvider, public alertCtrl: AlertController, public attachmentProvider: AttachmentProvider, public sanitizer: DomSanitizer, public events: Events) {
    this.Enums = Enums;
  }

  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });

    this.toggleAllaccordion = false;
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Photos" };
    this.thumbFilePath = cordova.file.dataDirectory + "reportfiles/" + this.valueProvider.getCurrentReport().REPORTID + "/Photos/thumbnails/";
    this.attachFilePath = cordova.file.dataDirectory + "reportfiles/" + this.valueProvider.getCurrentReport().REPORTID + "/Photos/";
    this.reportID = this.valueProvider.getCurrentReport().REPORTID;
    this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
    this.localServiceSdr.getDEVICEIDForFlowIsolation(this.reportID).then((res: any) => {
      this.deviceID = res;
      switch (res) {
        case Enums.FlowIsolationProductId.ControlValve:
        case Enums.FlowIsolationProductId.Instrument:
        case Enums.FlowIsolationProductId.Isolation:
        case Enums.FlowIsolationProductId.LevelTroll:
        case Enums.FlowIsolationProductId.Regulator:
        case Enums.FlowIsolationProductId.TrimOnly:
        case Enums.FlowIsolationProductId.Controller:
          this.flowName = Enums.FlowName.FlowIsolation;
          break;
        case Enums.PressureProductId.DirectSpring:
        case Enums.PressureProductId.PilotOperated:
        case Enums.PressureProductId.VentPressureOnly:
        case Enums.PressureProductId.VentVacuumOnly:
        case Enums.PressureProductId.VentVacuumPressure:
          this.flowName = Enums.FlowName.Pressure;
          break;
        default:
          this.flowName = Enums.FlowName.Actuation;
          break;
      }
      this.getAttachmentData();
      this.generateAccordionKeys();
      let path = cordova.file.dataDirectory + "reportfiles/" + this.reportID + "/";
      this.utilityProvider.createDirIfNotExist(path, 'Photos', true).then((res: any) => {
        if (res) {
          this.logger.log(this.fileName, 'ionViewDidEnter', 'Photos folder created');
        }
      });
      this.toggleAllaccordion = false;
    }).catch((err) => {
      this.logger.log(this.fileName, 'ionViewDidEnter', JSON.stringify(err));
    });
  }

  generateAccordionKeys() {
    let accordionData = new AccordionData();
    let val: any[] = accordionData.PhotosAccordion[this.deviceID];
    for (let key of val) {
      this.expandOuterAccordion[key] = false;
    }
  }

  public async addAttachment(event: any, lookupID) {
    let path = cordova.file.dataDirectory + "reportfiles/" + this.reportID + "/Photos";
    event.target.files[0] = await this.getUploadedImageDimensions(event.target.files[0]);
    this.attachmentProvider.addAttachment(lookupID, event.target.files[0], Enums.AttachmentType.SDR, path, null, this.reportID).then((res: any) => {
      this.pushAttachmentInArray(res.newObject, lookupID);
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'addAttachment', 'Error in addAttachment : ' + JSON.stringify(err));
    });
  }

  getUploadedImageDimensions(file) {
    return new Promise(resolve => {
      let reader = new FileReader();
      const img = new Image();
      img.src = window.URL.createObjectURL(file);

      reader.readAsDataURL(file);
      reader.onload = () => {
        file.width = img.naturalWidth;
        file.height = img.naturalHeight;
        resolve(file);
      };
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'getUploadedImageDimensions', 'Error in promise : ' + JSON.stringify(err));
    });
  }

  pushAttachmentInArray(res, lookupID) {
    switch (lookupID) {
      // actuation
      case Enums.PhotosAccordion.AsFound:
        this.AsFoundArray.push(res);
        break;
      case Enums.PhotosAccordion.CalibrationConfiguration:
        this.CalibrationConfigurationArray.push(res);
        break;
      case Enums.PhotosAccordion.FinalTests:
        this.FinalTestsArray.push(res);
        break;
      case Enums.PhotosAccordion.Solution:
        this.SolutionArray.push(res);
        break;
      // flow-isolation
      case Enums.PhotosAccordion.AsFoundAssembly:
        this.AsFoundAssemblyArray.push(res);
        break;
      case Enums.PhotosAccordion.AsFoundTrim:
        this.AsFoundTrimArray.push(res);
        break;
      case Enums.PhotosAccordion.AsLeftTrim:
        this.AsLeftTrimArray.push(res);
        break;
      case Enums.PhotosAccordion.AsLeftAssembly:
        this.AsLeftAssemblyArray.push(res);
        break;
      case Enums.PhotosAccordion.AsFoundAssemblyPhotos:
        this.AsFoundAssemblyPhotosArray.push(res);
        break;
      case Enums.PhotosAccordion.AsFoundTrimPhotos:
        this.AsFoundTrimPhotosArray.push(res);
        break;
      //pressure
      case Enums.PhotosAccordion.AsFoundPerformance:
        this.AsFoundPerformanceArray.push(res);
        break;
      case Enums.PhotosAccordion.Findings:
        this.FindingsArray.push(res);
        break;
      case Enums.PhotosAccordion.InspectionMeasurement:
        this.InspectionMeasurementArray.push(res);
        break;
      case Enums.PhotosAccordion.TestData:
        this.TestDataArray.push(res);
        break;
      case Enums.PhotosAccordion.FinalInspection:
        this.FinalInspectionArray.push(res);
        break;
    }
  }

  setAttachmentData(res) {
    switch (this.flowName) {
      case Enums.FlowName.Actuation:
        this.AsFoundArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFound;
        });
        this.CalibrationConfigurationArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.CalibrationConfiguration;
        });
        this.SolutionArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.Solution;
        });
        this.FinalTestsArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.FinalTests;
        })
        break;
      case Enums.FlowName.FlowIsolation:
        this.AsFoundAssemblyArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundAssembly;
        });
        this.AsFoundTrimArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundTrim;
        });
        this.AsLeftTrimArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsLeftTrim;
        });
        this.AsLeftAssemblyArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsLeftAssembly;
        });
        this.AsFoundAssemblyPhotosArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundAssemblyPhotos;
        });
        this.AsFoundTrimPhotosArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundTrimPhotos;
        });
        break;
      case Enums.FlowName.Pressure:
        this.AsFoundAssemblyArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundAssembly;
        });
        this.AsFoundTrimArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundTrim;
        });
        this.AsLeftTrimArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsLeftTrim;
        });
        this.AsLeftAssemblyArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsLeftAssembly;
        });
        this.AsFoundPerformanceArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundPerformance;
        });
        this.FindingsArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.Findings;
        });
        this.InspectionMeasurementArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.InspectionMeasurement;
        });
        this.TestDataArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.TestData;
        });
        this.FinalInspectionArray = res.filter(item => {
          return item.ATTACHMENTTYPE == Enums.PhotosAccordion.FinalInspection;
        });
        break;
    }
  }

  updateShowInPdf(event, attachmentId) {
    this.localServiceSdr.changeShowInPDFStatus(event.value, attachmentId).then((res: any) => {
      this.logger.log(this.fileName, 'showInPDF', 'status change of attachment ID ' + attachmentId + 'to' + event.value);
    })
  }

  getAttachmentData() {
    let self = this;
    this.AsFoundArray = [];
    this.CalibrationConfigurationArray = [];
    this.SolutionArray = [];
    this.FinalTestsArray = [];
    this.AsFoundAssemblyArray = [];
    this.AsFoundTrimArray = [];
    this.AsLeftTrimArray = [];
    this.AsLeftAssemblyArray = [];
    this.AsFoundPerformanceArray = [];
    this.FindingsArray = [];
    this.InspectionMeasurementArray = [];
    this.TestDataArray = [];
    this.FinalInspectionArray = [];
    this.localServiceSdr.getSDRAttachment(this.reportID).then((res: any[]) => {
      if (res.length > 0) {
        self.setAttachmentData(res);
      }
    }).catch(err => {
      // this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getAttachmentData', 'err in getsdrAttachment : ' + JSON.stringify(err));
    })
  }

  deleteAttachmentObject(filedata, index, photoAccordion) {
    let attachmentDiscNameAndType = this.utilityProvider.generateFileDiscNameAndTypeSDR(filedata.FILENAME);
    switch (photoAccordion) {
      case Enums.PhotosAccordion.FinalTests:
        this.FinalTestsArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.AsFound:
        this.AsFoundArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.CalibrationConfiguration:
        this.CalibrationConfigurationArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.Solution:
        this.SolutionArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.AsFoundAssembly:
        this.AsFoundAssemblyArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.AsFoundTrim:
        this.AsFoundTrimArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.AsLeftTrim:
        this.AsLeftTrimArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.AsLeftAssembly:
        this.AsLeftAssemblyArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.AsFoundAssemblyPhotos:
        this.AsFoundAssemblyPhotosArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.AsFoundTrimPhotos:
        this.AsFoundTrimPhotosArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.AsFoundPerformance:
        this.AsFoundPerformanceArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.Findings:
        this.FindingsArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.InspectionMeasurement:
        this.InspectionMeasurementArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.TestData:
        this.TestDataArray.splice(index, 1);
        break;
      case Enums.PhotosAccordion.FinalInspection:
        this.FinalInspectionArray.splice(index, 1);
        break;
    }
    this.localServiceSdr.deleteAttachmentObject(filedata.RA_PK_ID);
    this.attachmentProvider.deleteAttachment(filedata, 'reportfiles', Enums.AttachmentType.SDR, attachmentDiscNameAndType, this.reportID).then((res: any) => {
      if (res) {
        this.logger.log(this.fileName, 'deleteAttachmentObject', 'attachment deleted of lookup : ' + photoAccordion + ' and RA_PK_ID : ' + filedata.RA_PK_ID);
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'deleteAttachmentObject', 'Error in deleteAttachmentObject : ' + JSON.stringify(err));
    });
  }

  openResource(file) {
    this.attachmentProvider.openResource(file, 'reportfiles', Enums.AttachmentType.SDR, this.reportID);
  }

  renameAttachmentDescription(file) {
    file.ATTACHMENTDESCRIPTION = this.utilityProvider.sliceValueUptoLimit(file.ATTACHMENTDESCRIPTION, 255);
    this.localServiceSdr.updateAttachmentDescription(file.RA_PK_ID, file.ATTACHMENTDESCRIPTION).then((res: any) => {
      this.logger.log(this.fileName, 'renameAttachmentDescription', 'description change successfully of attachment id : ' + file.RA_PK_ID);
    })
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
    let accordionData = new AccordionData();
    let val: any = accordionData.PhotosAccordion[this.deviceID];
    for (let key of val) {
      this.expandOuterAccordion[key] = this.toggleAllaccordion ? true : false;
    }
  }

  redirect(value) {
    this.utilityProvider.bottomNavigation(this.navCtrl, value);
  }

  gotofcr() {
    this.events.publish("goToFCR");
  }
}
