import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LocalServiceSdrProvider } from '../../../../../providers/local-service-sdr/local-service-sdr';
import { ValueProvider } from '../../../../../providers/value/value';
import { UtilityProvider } from '../../../../../providers/utility/utility';
import { LoggerProvider } from '../../../../../providers/logger/logger';

@IonicPage()
@Component({
  selector: 'page-pre-test',
  templateUrl: 'pre-test.html',
})
export class PreTestPage {
  fileName: any = 'PreTestPage';
  preTestObj: any = {};
  reportID: any;
  selectedProcess: any;
  isDTValuesChanged: boolean = false;
  isDeviceTestRecordExists: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public localServiceSdr: LocalServiceSdrProvider, public valueProvider: ValueProvider,
    public utilityProvider: UtilityProvider, public logger: LoggerProvider, public translate: TranslateService,
    public events: Events) {
  }

  ionViewDidEnter() {
    this.reportID = this.valueProvider.getCurrentReport().REPORTID;
    this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
    this.preTestObj = {};
    this.preTestObj = {
      "AIRPRESSUREPRETEST": "",
      "FUNCTIONPRETEST": "",
      "HYDROPRETEST": "",
      "VISUALPRETEST": ""
    };
    // Making false while entering the component.
    this.isDTValuesChanged = false;
    this.isDeviceTestRecordExists = false;
    this.preTestObj.REPORTID = this.reportID;
    this.getDeviceTestActuation();
  }

  ionViewWillLeave(): void {
    setTimeout(() => {
      this.insertDeviceTestActuation();
    }, 100);
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
}
