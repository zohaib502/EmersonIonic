import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, App } from 'ionic-angular';
import { UtilityProvider } from '../../../providers/utility/utility';
import { ValueProvider } from '../../../providers/value/value';
import { LocalServiceSdrProvider } from '../../../providers/local-service-sdr/local-service-sdr';
import { LoggerProvider } from '../../../providers/logger/logger';
import { TranslateService } from '@ngx-translate/core';
import * as Enums from "../../../enums/enums";
import { SdrTabsData } from '../../../beans/SdrTabsData';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-select-device',
  templateUrl: 'select-device.html',
})
export class SelectDevicePage {
  Devices: any = [];
  DevicesNameMap: any = [];
  DevicesBUIDMap: any = [];
  ActuatorDevices: any = [];
  ActuatorDevicesNameMap: any = [];
  Lookups: any = [];
  LookupsNameMap: any = [];
  selectDeviceObj: any = {
    SD_PK_ID: undefined,
    REPORTID: undefined,
    SerialNo: null,
    OtherProductFamily: null,
    OtherType: null,
    OtherModelSize: null,
    networkDevices: []
  };
  errorObj: any = [];
  isDeviceRecordExists: any = false;
  fileName: any = 'SelectDevicePage';
  disableButtons = false;
  sdrReportObj: any = {};
  selectedProcess: any;
  firstLoad: boolean = true;
  prevDeviceSelected: any;
  isolationGroup = ['27', '28', '29', '30', '31', '32', '33'];
  pressureGroup = ['7', '8', '15', '16', '17'];
  constructor(
    // private elRef: ElementRef,
    public navCtrl: NavController,
    public navParams: NavParams,
    public localServiceSdr: LocalServiceSdrProvider,
    public valueProvider: ValueProvider,
    public logger: LoggerProvider,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public events: Events,
    public utilityProvider: UtilityProvider, public appCtrl: App) {
  }

  updateSdrReport() {
    return new Promise((resolve, reject) => {
      if (this.sdrReportObj && !this.isDeviceRecordExists) {
        this.sdrReportObj.REPORTSTATUS = Enums.ReportStatus.DeviceSelected;
        this.valueProvider.getCurrentReport().REPORTSTATUS = this.sdrReportObj.REPORTSTATUS;
        // console.log('SDR Report status changed to DeviceSelected');
        this.sdrReportObj.SYNCSTATUS = 'N';
        this.sdrReportObj.MODIFIEDBY = this.valueProvider.getUser().UserID;
        this.sdrReportObj.MODIFIEDDATE = this.localServiceSdr.getCurrentDate();
        this.localServiceSdr.insertUpdateSdrReport(this.sdrReportObj, true).then((response: any[]) => {
          resolve(true);
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'updateSdrReport', ' Error in updateSdrReport : ' + JSON.stringify(error));
          reject(error);
        });
      } else {
        resolve(true);
      }
    })
  }

  ionViewDidLoad() {
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.getDevices();
  }

  ionViewDidEnter() {
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Select Device" };
    this.navCtrl.parent.viewCtrl.instance.debriefFlow = false;
    this.disableButtons = false;
    this.selectedProcess = this.valueProvider.getSelectedprocess();
    if (this.valueProvider.getCurrentReport()) {
      this.sdrReportObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectDeviceObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.sdrReportObj.SELECTEDPROCESS = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
      this.getSDRReport();
    }
    this.utilityProvider.stopSpinner();
  }

  getSDRReport() {
    this.localServiceSdr.getSdrReport(this.selectDeviceObj.REPORTID).then((response: any[]) => {
      if (response) {
        this.sdrReportObj = response[0];
        this.selectedProcess = this.sdrReportObj.SELECTEDPROCESS;
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getSDRReport', ' Error in getSDRReport : ' + JSON.stringify(error));
    });
  }

  ionViewWillLeave() {
    let navHistory = this.navCtrl['_linker']['_history'];
    let lastPage: string = navHistory[navHistory.length - 2];
    if(lastPage.startsWith("/user-preferences")) return;
    if (this.isValidDevice()) {
      this.insertDevice(false);
    } else {
      if (this.selectDeviceObj.REPORTID) {
        this.utilityProvider.presentAlert();
        throw new Error('Form validation error!');
      }
    }
  }

  getDevices() {
    this.localServiceSdr.getDevices().then((item: any) => {
      for (let k = 0; k < item.length; k++) {
        this.Devices.push(item[k]);
        this.DevicesNameMap[item[k].ProductID] = item[k].ProductName;
        this.DevicesBUIDMap[item[k].ProductID] = item[k].BUID;
      }
      this.getActuatorDevices();
    })
  }

  getActuatorDevices() {
    this.localServiceSdr.getActuatorDevices().then((item: any) => {
      for (let k = 0; k < item.length; k++) {
        this.ActuatorDevices.push(item[k]);
        this.ActuatorDevicesNameMap[item[k].ProductID] = item[k].ProductName;
      }
      this.getLookupsByLookupType('ProductFamily').then((item: any) => {
        this.getLookupsByLookupType('ProcessFlowIsolation').then((item: any) => {
          this.getSelectedDevice();
        });
      });
    })
  }

  getLookupsByLookupType(type, parentId?, parentRefId?) {
    this.Lookups[type] = [];
    return this.localServiceSdr.getLookupsByLookupType(type, parentId, parentRefId).then((item: any) => {
      for (let k = 0; k < item.length; k++) {
        this.Lookups[type].push(item[k]);
        this.LookupsNameMap[item[k].LookupID] = item[k].LookupValue;
      }
      if (parentId != 22 && parentId != 23 && parentId != 24 && type != 'DirectSpring') {
        this.Lookups[type].push({ "LookupID": -1, "LookupValue": "Other" });
      }
      this.LookupsNameMap[-1] = "Other";
      this.LookupsNameMap[-2] = "No Value";
    });
  }

  searchModal(elementName) {
    let dataArray: any = [];
    let type = 'devices';
    switch (elementName) {
      case 'Device':
        dataArray = this.Devices;
        break;
      case 'ActuatorDevices':
        dataArray = this.ActuatorDevices;
        break;
      case 'PROCESS':
        type = 'lookups';
        dataArray = this.Lookups['ProcessFlowIsolation'];
        break;
      case 'PRESSURE_TYPE':
        type = 'lookups';
        dataArray = this.Lookups['DirectSpring'];
        break;
      default:
        type = 'lookups';
        dataArray = this.Lookups[elementName];
        break;
    }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: type }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {

      if (data != null) {
        if (elementName == 'Device') {
          if (!this.selectDeviceObj[elementName] || this.selectDeviceObj[elementName].ID != data.ID) {
            delete this.selectDeviceObj['ActuatorDevices'];
            this.clearDataOnFlowIsolationDeviceChange();
          }
        }
        if (elementName == 'Device' || elementName == 'ActuatorDevices') {
          if (!this.selectDeviceObj[elementName] || this.selectDeviceObj[elementName].ID != data.ID) {
            this.clearDataOnActuatorDeviceChange();
            this.deleteNetworkDevicesForReport();
          }
          if (this.isDeviceRecordExists && this.selectDeviceObj[elementName]) {
            if (this.selectDeviceObj[elementName].ID != data.ID) {
              this.showChangeDeviceDataLostAlert();
            }
          }
          if (elementName == 'Device' && this.DevicesBUIDMap[data.ID] == 2) {
            this.getLookupsByLookupType('DirectSpring', null, data.ID);
            delete this.selectDeviceObj['PRESSURE_TYPE'];
          }
          if (elementName == 'ActuatorDevices') {
            if (data.ID == '3' && this.Lookups['ProductFamily'] && this.Lookups['ProductFamily'][0] && this.Lookups['ProductFamily'][0].LookupID != -2) {
              this.Lookups['ProductFamily'].unshift({ "LookupID": -2, "LookupValue": "No Value" });
            } else if (this.selectDeviceObj['ActuatorDevices'] && this.selectDeviceObj['ActuatorDevices'].ID == '3') {
              this.Lookups['ProductFamily'].shift(1);
            }
          }
        }
        if (elementName == 'ProductFamily') {
          this.getLookupsByLookupType('Type', data.ID).then(res => {
            if (this.selectDeviceObj['ActuatorDevices'].ID == '3') {
              if (this.Lookups['Type'].length > 1) {
                this.Lookups['Type'].unshift({ "LookupID": -2, "LookupValue": "No Value" });
              }
            }
          });
          delete this.selectDeviceObj['Type'];
          delete this.selectDeviceObj['ModelSize'];
          delete this.Lookups['ModelSize'];
          this.selectDeviceObj.OtherProductFamily = null;
          this.selectDeviceObj.OtherType = null;
          this.selectDeviceObj.OtherModelSize = null;
        }
        if (elementName == 'Type') {
          this.getLookupsByLookupType('ModelSize', data.ID).then(res => {
            if (this.selectDeviceObj['ActuatorDevices'].ID == '3') {
              if (this.Lookups['ModelSize'].length > 1) {
                this.Lookups['ModelSize'].unshift({ "LookupID": -2, "LookupValue": "No Value" });
              }
            }
          });
          delete this.selectDeviceObj['ModelSize'];
          this.selectDeviceObj.OtherType = null;
          this.selectDeviceObj.OtherModelSize = null;
        }
        if (elementName == 'ModelSize') {
          this.selectDeviceObj.OtherModelSize = null;
        }
        this.selectDeviceObj[elementName] = data;
        if (elementName == 'PRESSURE_TYPE') {
          this.selectDeviceObj['PRESSURE_TYPE'] = data.LookupValue;
        }
        const errorIndex = this.errorObj.indexOf(elementName);
        if (errorIndex != -1) {
          this.errorObj.splice(errorIndex, 1);
        }
      }
    });
  }

  addNetworkDevice() {
    const networkDevice = {
      'ND_PK_ID': this.utilityProvider.getUniqueKey() + '',
      'REPORTID': this.selectDeviceObj.REPORTID,
      'PRODUCTFAMILY': this.selectDeviceObj['ProductFamily'] && this.selectDeviceObj['ProductFamily'].ID ? this.selectDeviceObj['ProductFamily'].ID : null,
      'PRODUCTTYPE': this.selectDeviceObj['Type'] && this.selectDeviceObj['Type'].ID ? this.selectDeviceObj['Type'].ID : null,
      'MODELTYPE': this.selectDeviceObj['ModelSize'] && this.selectDeviceObj['ModelSize'].ID ? this.selectDeviceObj['ModelSize'].ID : null,
      'PRODUCTFAMILY_OTHER': this.selectDeviceObj.OtherProductFamily,
      'PRODUCTTYPE_OTHER': this.selectDeviceObj.OtherType,
      'MODELTYPE_OTHER': this.selectDeviceObj.OtherModelSize,
      'SERIALNO': this.selectDeviceObj.SerialNo
    };
    if ((networkDevice.PRODUCTFAMILY == -1 && !networkDevice.PRODUCTFAMILY_OTHER) ||
      (networkDevice.PRODUCTTYPE == -1 && !networkDevice.PRODUCTTYPE_OTHER) ||
      (networkDevice.MODELTYPE == -1 && !networkDevice.MODELTYPE_OTHER)) {
      this.utilityProvider.presentAlert();
      return;
    }
    this.disableButtons = true;
    this.localServiceSdr.insertOrUpdateData(networkDevice, false, 'ND_PK_ID', 'NETWORKDEVICE').then((res): any => {
      this.selectDeviceObj.networkDevices.push(networkDevice);
      this.clearDataOnActuatorDeviceChange();
      this.disableButtons = false;
    }).catch((error: any) => {
      this.disableButtons = false;
      this.logger.log(this.fileName, 'addNetworkDevice', ' Error in addNetworkDevice : ' + JSON.stringify(error));
    });
  }

  clearDataOnActuatorDeviceChange() {
    delete this.selectDeviceObj['ProductFamily'];
    delete this.selectDeviceObj['Type'];
    delete this.selectDeviceObj['ModelSize'];
    delete this.Lookups['Type'];
    delete this.Lookups['ModelSize'];
    this.selectDeviceObj.SerialNo = null;
    this.selectDeviceObj.OtherProductFamily = null;
    this.selectDeviceObj.OtherType = null;
    this.selectDeviceObj.OtherModelSize = null;
  }

  clearDataOnFlowIsolationDeviceChange() {
    this.selectDeviceObj.TAG = '';
    delete this.selectDeviceObj['PROCESS'];
    delete this.selectDeviceObj['PROCESS_OT'];
  }

  deleteNetworkDevicesForReport() {
    if (this.selectDeviceObj.networkDevices.length > 0) {
      this.selectDeviceObj.networkDevices = [];
      this.localServiceSdr.deleteNetworkDevicesForReport(this.selectDeviceObj.REPORTID);
    }
  }

  deleteNetworkDevice(index) {
    const networkDevice = this.selectDeviceObj.networkDevices[index];
    this.localServiceSdr.deleteNetworkDevice(networkDevice.ND_PK_ID);
    this.selectDeviceObj.networkDevices.splice(index, 1);
  }

  isValidDevice() {
    this.errorObj = [];
    if (!this.selectDeviceObj['Device']) {
      this.errorObj.push('Device');
      return this.errorObj.length == 0;
    } else if (!this.selectDeviceObj['Device'].ID) {
      this.errorObj.push('Device');
      return this.errorObj.length == 0;
    }
    if (this.selectDeviceObj['Device'].ID == 34 && (!this.selectDeviceObj['ActuatorDevices'] || !this.selectDeviceObj['ActuatorDevices'].ID)) {
      this.errorObj.push('ActuatorDevices');
    }
    if (this.selectDeviceObj['ActuatorDevices'] && this.selectDeviceObj['ActuatorDevices'].ID && this.selectDeviceObj['ActuatorDevices'].ID != 3) {
      if (!this.selectDeviceObj['ProductFamily'] || !this.selectDeviceObj['ProductFamily'].ID) {
        this.errorObj.push('ProductFamily');
      }
      if (this.Lookups['Type'] && this.Lookups['Type'].length > 1 && (!this.selectDeviceObj['Type'] || !this.selectDeviceObj['Type'].ID)) {
        this.errorObj.push('Type');
      }
      if (this.Lookups['ModelSize'] && this.Lookups['ModelSize'].length > 1 && (!this.selectDeviceObj['ModelSize'] || !this.selectDeviceObj['ModelSize'].ID)) {
        this.errorObj.push('ModelSize');
      }
      if (this.selectDeviceObj['ProductFamily'] && this.selectDeviceObj['ProductFamily'].ID == -1 && !this.selectDeviceObj.OtherProductFamily) {
        this.errorObj.push('OtherProductFamily');
      }
      if (this.selectDeviceObj['Type'] && this.selectDeviceObj['Type'].ID == -1 && !this.selectDeviceObj.OtherType) {
        this.errorObj.push('OtherType');
      }
      if (this.selectDeviceObj['ModelSize'] && this.selectDeviceObj['ModelSize'].ID == -1 && !this.selectDeviceObj.OtherModelSize) {
        this.errorObj.push('OtherModelSize');
      }
    }
    // flow isolation
    if (this.DevicesBUIDMap[this.selectDeviceObj['Device'].ID] == 3 && this.selectDeviceObj['Device'].ID != 29) {
      if (!this.selectDeviceObj['PROCESS'] || !this.selectDeviceObj['PROCESS'].ID) {
        this.errorObj.push('PROCESS');
      }
      if (this.selectDeviceObj['PROCESS'] && this.selectDeviceObj['PROCESS'].ID == -1 && !this.selectDeviceObj.PROCESS_OT) {
        this.errorObj.push('PROCESS_OT');
      }
    }
    // Pressure
    if (this.DevicesBUIDMap[this.selectDeviceObj['Device'].ID] == 2) {
      if (!this.selectDeviceObj['PRESSURE_TYPE']) {
        this.errorObj.push('PRESSURE_TYPE');
      }
    }
    return this.errorObj.length == 0;
  }

  getSelectedDevice() {
    try {
      this.localServiceSdr.getSelectedDevice(this.selectDeviceObj.REPORTID).then((res: any): any => {
        // console.log(res);
        if (res && res.length) {
          this.isDeviceRecordExists = true;
          const existingDevice = JSON.parse(JSON.stringify(res[0]));
          this.selectDeviceObj.SD_PK_ID = existingDevice.SD_PK_ID;
          this.selectDeviceObj['Device'] = {
            ID: existingDevice.DEVICEID,
            LookupValue: this.DevicesNameMap[existingDevice.DEVICEID]
          };
          this.selectDeviceObj['ActuatorDevices'] = {
            ID: existingDevice.DEVICETYPE,
            LookupValue: this.ActuatorDevicesNameMap[existingDevice.DEVICETYPE]
          };
          if (existingDevice.PRODUCTFAMILY) {
            this.selectDeviceObj['ProductFamily'] = {
              ID: existingDevice.PRODUCTFAMILY,
              LookupValue: this.LookupsNameMap[existingDevice.PRODUCTFAMILY]
            };
          }
          if (existingDevice.PRODUCTTYPE) {
            this.getLookupsByLookupType('Type', existingDevice.PRODUCTFAMILY).then((item: any) => {
              this.selectDeviceObj['Type'] = {
                ID: existingDevice.PRODUCTTYPE,
                LookupValue: this.LookupsNameMap[existingDevice.PRODUCTTYPE]
              };
            });
          }
          if (existingDevice.MODELTYPE) {
            this.getLookupsByLookupType('ModelSize', existingDevice.PRODUCTTYPE).then((item: any) => {
              this.selectDeviceObj['ModelSize'] = {
                ID: existingDevice.MODELTYPE,
                LookupValue: this.LookupsNameMap[existingDevice.MODELTYPE]
              };
            });
          }
          this.selectDeviceObj.SerialNo = existingDevice.SERIALNO;
          this.selectDeviceObj.OtherProductFamily = existingDevice.PRODUCTFAMILY_OTHER;
          this.selectDeviceObj.OtherType = existingDevice.PRODUCTTYPE_OTHER;
          this.selectDeviceObj.OtherModelSize = existingDevice.MODELTYPE_OTHER;
          if (existingDevice.ISNETWORKDEVICE == "Y") {
            // console.log('Network Device exists.');
            this.getNetworkDevices();
          }
          // flow isolation
          this.selectDeviceObj.TAG = existingDevice.TAG;
          if (existingDevice.PROCESS) {
            this.getLookupsByLookupType('ProcessFlowIsolation').then((item: any) => {
              this.selectDeviceObj['PROCESS'] = {
                ID: existingDevice.PROCESS,
                LookupValue: this.LookupsNameMap[existingDevice.PROCESS]
              };
            });
          }
          this.selectDeviceObj.PROCESS_OT = existingDevice.PROCESS_OT;

          //Pressure
          if (existingDevice.TYPE) {
            this.getLookupsByLookupType('DirectSpring', null, existingDevice.DEVICEID).then((item: any) => {
              this.selectDeviceObj['PRESSURE_TYPE'] = existingDevice.TYPE;
            });
          }
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getSelectedDevice', ' Error in getSelectedDevice : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.logger.log(this.fileName, "getSelectedDevice", "Error: " + error.message);
    }
  }

  getNetworkDevices() {
    try {
      this.localServiceSdr.getNetworkDevices(this.selectDeviceObj.REPORTID).then((res: any): any => {
        // console.log(res);
        if (res && res.length) {
          this.selectDeviceObj.networkDevices = [];
          for (var i in res) {
            const networkDevice = JSON.parse(JSON.stringify(res[i]));
            this.selectDeviceObj.networkDevices.push(networkDevice);
            this.getLookupsByLookupType('Type', networkDevice.PRODUCTFAMILY).then(res => {
              this.Lookups['Type'] = [];
            });
            this.getLookupsByLookupType('ModelSize', networkDevice.PRODUCTTYPE).then(res => {
              this.Lookups['ModelSize'] = [];
            });
          }
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getNetworkDevices', ' Error in getNetworkDevices : ' + JSON.stringify(error));
      });
    } catch (error) {
      this.logger.log(this.fileName, "getNetworkDevices", "Error: " + error.message);
    }
  }

  insertDevice(clicked) {
    if (this.isValidDevice()) {
      this.updateSdrReport().then(() => {
        if (!this.isDeviceRecordExists && this.sdrReportObj) {
          this.sdrReportObj.REPORTSTATUS = Enums.ReportStatus.DeviceSelected;
          // console.log('SDR Report status changed to DeviceSelected');
        }
        this.disableButtons = true;
        this.localServiceSdr.insertOrUpdateData({
          'SD_PK_ID': this.selectDeviceObj.SD_PK_ID,
          'REPORTID': this.selectDeviceObj.REPORTID,
          'DEVICEID': this.selectDeviceObj['Device'] ? this.selectDeviceObj['Device'].ID : null,
          'DEVICETYPE': this.selectDeviceObj['ActuatorDevices'] ? this.selectDeviceObj['ActuatorDevices'].ID : null,
          'PRODUCTFAMILY': this.selectDeviceObj['ProductFamily'] ? this.selectDeviceObj['ProductFamily'].ID : null,
          'PRODUCTTYPE': this.selectDeviceObj['Type'] ? this.selectDeviceObj['Type'].ID : null,
          'MODELTYPE': this.selectDeviceObj['ModelSize'] ? this.selectDeviceObj['ModelSize'].ID : null,
          'SERIALNO': this.selectDeviceObj.SerialNo,
          'PRODUCTFAMILY_OTHER': this.selectDeviceObj.OtherProductFamily,
          'PRODUCTTYPE_OTHER': this.selectDeviceObj.OtherType,
          'MODELTYPE_OTHER': this.selectDeviceObj.OtherModelSize,
          'ISNETWORKDEVICE': this.selectDeviceObj.networkDevices.length > 0 ? "Y" : "N",
          'TAG': this.selectDeviceObj.TAG,
          'PROCESS': this.selectDeviceObj['PROCESS'] ? this.selectDeviceObj['PROCESS'].ID : null,
          'PROCESS_OT': this.selectDeviceObj['PROCESS_OT'],
          'TYPE': this.selectDeviceObj['PRESSURE_TYPE'] ? this.selectDeviceObj['PRESSURE_TYPE'] : null,
        }, this.isDeviceRecordExists, 'SD_PK_ID', 'SELECTEDDEVICE').then((res): any => {
          if (res) {
            this.selectDeviceObj.SD_PK_ID = res;
            this.isDeviceRecordExists = true;
            this.valueProvider.setDeviceType(this.selectDeviceObj['ActuatorDevices'] ? this.selectDeviceObj['ActuatorDevices'].ID : null);
            if (this.navCtrl.parent.viewCtrl.instance.debriefFlow == false) {
              if ((this.selectedProcess == Enums.Selected_Process.FCR ||
                (this.selectedProcess == Enums.Selected_Process.FCR_AND_SDR && this.valueProvider.getCurrentReport().ISSTANDALONE == 'Y')) &&
                this.navCtrl.parent.viewCtrl.instance.showFurtherTabs == false && this.valueProvider.getTask().Task_Status != "Completed_Awaiting_Review") {
                this.events.publish("goToFCR");
              } else if (clicked) {
                this.showFurtherTabs(clicked);
              }
            }
            // this.disableButtons = false;
          }
        }).catch((error: any) => {
          this.disableButtons = false;
          this.logger.log(this.fileName, 'insertDevice', ' Error in insertTime : ' + JSON.stringify(error));
        });
      });
    } else {
      this.utilityProvider.presentAlert();
    }
  }

  showChangeDeviceDataLostAlert() {
    try {
      let alert = this.alertCtrl.create({
        title: this.translate.instant("Confirm ?"),
        message: this.translate.instant("Are you sure you want to change the device ? All data will be lost"),
        enableBackdropDismiss: false,
        buttons: [
          {
            text: this.translate.instant('OK'),
            handler: () => {
              if (this.isolationGroup.indexOf(this.selectDeviceObj['Device'].ID.toString()) > -1) {
                this.localServiceSdr.deleteIsolationDataOnDeviceChange(this.selectDeviceObj.REPORTID);
              } else if (this.pressureGroup.indexOf(this.selectDeviceObj['Device'].ID.toString()) > -1) {
                this.localServiceSdr.deletePressureDataOnDeviceChange(this.selectDeviceObj.REPORTID);
              } else {
                this.localServiceSdr.deleteDataOnDeviceChange(this.selectDeviceObj.REPORTID);
              }
              this.isDeviceRecordExists = false;
              let path = cordova.file.dataDirectory + "/reportfiles/";
              this.utilityProvider.deleteDirIfExist(path, this.selectDeviceObj.REPORTID.toString());
              this.firstLoad = true;
              // this.showFurtherTabs(false);
              this.navCtrl.parent.viewCtrl.instance.SDRTabRef._tabs.length = 2;
            }
          },
          {
            text: this.translate.instant('Cancel'),
            role: 'cancel',
            handler: () => {
              this.isDeviceRecordExists = false;
              this.getSelectedDevice();
            }
          }
        ],
        cssClass: 'forcelogoutAlert'
      });
      alert.present();
    } catch (err) {
      // console.log(err);
    }
  }

  showFurtherTabs(clicked) {
    let sdrTabsData = new SdrTabsData();
    this.navCtrl.parent.viewCtrl.instance.SDRTabRef._tabs.length = 2;

    if (this.selectDeviceObj['ActuatorDevices'] && this.selectDeviceObj['ActuatorDevices'].ID) {

      this.navCtrl.parent.viewCtrl.instance.showFurtherTabs = true;
      this.navCtrl.parent.viewCtrl.instance.showIsoTabs = false;

      if (this.selectDeviceObj['ActuatorDevices'].ID == 1) {
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = sdrTabsData.actuationTabs.filter((i) => { return i.phMenu; });
        this.navigateFurther(clicked, 2);
      } else if (this.selectDeviceObj['ActuatorDevices'].ID == 2) {
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = sdrTabsData.actuationTabs.filter((i) => { return i.aeMenu; });
        this.navigateFurther(clicked, 2);
      } else {
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = sdrTabsData.actuationTabs.filter((i) => { return i.afMenu; });
        this.navigateFurther(clicked, 2);
      }

      // if (clicked)
      let parentRefId = this.selectDeviceObj['ActuatorDevices'].ID;
      this.handleLoader(parentRefId);
    } else {

      this.navCtrl.parent.viewCtrl.instance.showIsoTabs = true;
      this.navCtrl.parent.viewCtrl.instance.showFurtherTabs = false;
      let fdoValue = this.valueProvider.getFdo();

      if (this.selectDeviceObj['Device'].ID == Enums.FlowIsolationProductId.ControlValve || this.selectDeviceObj['Device'].ID == Enums.FlowIsolationProductId.Isolation) {
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = fdoValue == true ? sdrTabsData.isoCrtTabs.filter((i) => { return i.fdo; }) : sdrTabsData.isoCrtTabs;
      }
      if (this.selectDeviceObj['Device'].ID == Enums.FlowIsolationProductId.Instrument) {
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = fdoValue ? sdrTabsData.isoInstrumentTabs.filter((i) => { return i.fdo; }) : sdrTabsData.isoInstrumentTabs;
      }
      if (this.selectDeviceObj['Device'].ID == Enums.FlowIsolationProductId.LevelTroll || this.selectDeviceObj['Device'].ID == Enums.FlowIsolationProductId.Regulator) {
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = fdoValue ? sdrTabsData.isoLevelTrolRegTabs.filter((i) => { return i.fdo; }) : sdrTabsData.isoLevelTrolRegTabs;
      }
      if (this.selectDeviceObj['Device'].ID == Enums.FlowIsolationProductId.TrimOnly) {
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = fdoValue ? sdrTabsData.isoTrimOnlyTabs.filter((i) => { return i.fdo; }) : sdrTabsData.isoTrimOnlyTabs;
      }
      if (this.selectDeviceObj['Device'].ID == Enums.FlowIsolationProductId.Controller) {
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = fdoValue ? sdrTabsData.isoController.filter((i) => { return i.fdo; }) : sdrTabsData.isoController;
      }
      if (this.selectDeviceObj['Device'].ID == Enums.PressureProductId.DirectSpring || this.selectDeviceObj['Device'].ID == Enums.PressureProductId.PilotOperated || this.selectDeviceObj['Device'].ID == Enums.PressureProductId.VentVacuumOnly || this.selectDeviceObj['Device'].ID == Enums.PressureProductId.VentPressureOnly || this.selectDeviceObj['Device'].ID == Enums.PressureProductId.VentVacuumPressure) {
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = sdrTabsData.pressureTabs;
      }
      this.navigateFurther(clicked, 2);
      let parentRefId = this.selectDeviceObj['Device'].ID;
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

  navigateFurther(clicked, tab) {
    if (clicked) {
      setTimeout(() => {
        this.navCtrl.parent.select(tab);
      }, 300);
    }
  }

}
