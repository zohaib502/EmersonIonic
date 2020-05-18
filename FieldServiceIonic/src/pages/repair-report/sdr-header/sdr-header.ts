import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LocalServiceSdrProvider } from '../../../providers/local-service-sdr/local-service-sdr';
import { ValueProvider } from '../../../providers/value/value';
import * as Enums from '../../../enums/enums';

/**
 * Generated class for the SdrHeaderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sdr-header',
  templateUrl: 'sdr-header.html',
})
export class SdrHeaderPage {
  ProductName: any;
  sdrReportObj: any = {};
  REPORTID: any;
  ProductNameIsolation: any;
  TAG: any;
  selectedProcess: any;
  Enums: any;
  flowName: Enums.FlowName;
  deviceID: any;
  constructor(private viewController: ViewController, public navParams: NavParams, public localServiceSdr: LocalServiceSdrProvider, public valueService: ValueProvider, public navCtrl: NavController) {
    this.REPORTID = this.valueService.getCurrentReport().REPORTID;
    this.getProductName();
    this.getSDRReport();
    this.Enums = Enums;
    this.viewController.didEnter.subscribe(() => {
      this.localServiceSdr.getDEVICEIDForFlowIsolation(this.REPORTID).then((res: any) => {
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
          default:
            this.flowName = Enums.FlowName.Actuation;
            break;
        }
      }).catch((err) => {
      });
      this.getProductName();
      this.getSDRReport();
    });
  }

  getProductName() {
    if (this.REPORTID) {
      this.localServiceSdr.getProductNameForCustomHeaderActuation(this.REPORTID).then((res: any): any => {
        if (res && res.length) {
          this.ProductName = JSON.parse(JSON.stringify(res[0])).ProductName;
        }
      }).catch((error: any) => {
      });
      this.localServiceSdr.getProductNameForCustomHeaderIsolation(this.REPORTID).then((res: any): any => {
        if (res && res.length) {
          this.ProductNameIsolation = JSON.parse(JSON.stringify(res[0])).ProductName;
        }
      }).catch((error: any) => {
      });
      this.localServiceSdr.getTagForCustomHeaderIsolation(this.REPORTID).then((res: any): any => {
        if (res && res.length) {
          this.TAG = JSON.parse(JSON.stringify(res[0])).TAG;
        }
      }).catch((error: any) => {
      });
      this.localServiceSdr.getProcessNameForCustomHeaderIsolation(this.REPORTID).then((res: any): any => {
        if (res && res.length) {
          this.selectedProcess = JSON.parse(JSON.stringify(res[0])).LookupValue;
        }
      }).catch((error: any) => {
      });
    }
  }

  getSDRReport() {
    if (this.REPORTID) {
      this.localServiceSdr.getSdrReport(this.REPORTID).then((response: any[]) => {
        if (response) {
          this.sdrReportObj = response[0];
        }
      }).catch((error: any) => {
      });
    }
  }

}
