import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App,Events } from 'ionic-angular';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { ValueProvider } from '../../../../providers/value/value';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import * as Enums from '../../../../enums/enums';

@IonicPage()
@Component({
  selector: 'page-final-test',
  templateUrl: 'final-test.html',
})
export class FinalTestPage {
  finallistdata: any = {};
  fileName = "FinalTestPage";
  Enums: any = Enums;
  selectedProcess: any;
  bottomNavBtn: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public localServicesdr: LocalServiceSdrProvider, public logger: LoggerProvider,
    public valueProvider: ValueProvider, public appCtrl: App, public utilityProvider: UtilityProvider, public events: Events) {
  }

  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });

    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Final Tests" };
    this.finallistdata = {};

    if (this.valueProvider.getCurrentReport()) {
      this.finallistdata.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
    }
    // if (this.navParams.data.data && this.navParams.data.data.REPORTID) {
    //   this.finallistdata.REPORTID = this.navParams.data.data.REPORTID;
    //   this.selectedProcess = this.navParams.data.data.SELECTEDPROCESS;
    //   console.log("REPORTID on Select Device Page", this.finallistdata.REPORTID);
    // }
    setTimeout(() => {
      this.getFinalListData()
    }, 300);
  }

  /**
  *@author: Prateek 03/13/2019
  *Fetch Final list data on the basis of primary key of device actuation table.
  */

  getFinalListData() {
    //this.utilityProvider.showSpinner();
    this.localServicesdr.getFinalListdata(this.finallistdata.REPORTID).then((response: any) => {
      if (response.length > 0) {
        this.finallistdata = JSON.parse(JSON.stringify(response[0]));
        // this.finallistdata = response[0];
        // this.finallistdata.DONEAIRPRESSUREPRETEST=response[0].DONEAIRPRESSUREPRETEST;
        // this.finallistdata.AIRPRESSUREPRETEST=response[0].AIRPRESSUREPRETEST;
        // this.finallistdata.DONEAIRPRESSUREPOSTTEST=response[0].DONEAIRPRESSUREPOSTTEST;
        // this.finallistdata.AIRPRESSUREPOSTTEST=response[0].AIRPRESSUREPOSTTEST;
        // this.finallistdata.DONEFUNCTIONPRETEST=response[0].DONEFUNCTIONPRETEST;
        // this.finallistdata.FUNCTIONPRETEST=response[0].FUNCTIONPRETEST;
        // this.finallistdata.DONEFUNCTIONPOSTTEST=response[0].DONEFUNCTIONPOSTTEST;
        // this.finallistdata.FUNCTIONPOSTTEST=response[0].FUNCTIONPOSTTEST;
        // this.finallistdata.DONEHYDROPRETEST=response[0].DONEHYDROPRETEST;
        // this.finallistdata.HYDROPRETEST=response[0].HYDROPRETEST;
        // this.finallistdata.DONEHYDROPOSTTEST=response[0].DONEHYDROPOSTTEST;
        // this.finallistdata.HYDROPOSTTEST=response[0].HYDROPOSTTEST;
        // this.finallistdata.DONEVISUALPRETEST=response[0].DONEVISUALPRETEST;
        // this.finallistdata.VISUALPRETEST=response[0].VISUALPRETEST;
        // this.finallistdata.DONEVISUALPOSTTEST=response[0].DONEVISUALPOSTTEST;
        // this.finallistdata.VISUALPOSTTEST=response[0].VISUALPOSTTEST;
        // this.finallistdata.DTA_PK_ID=response[0].DTA_PK_ID;
        // console.log("FINALLIST", response)
      }
      // this.utilityProvider.stopSpinner();
    }).catch((error: any) => {
      // this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getFinalListData', ' Error in getFinalListData : ' + JSON.stringify(error));
    });
    this.utilityProvider.stopSpinner();
  }

  selectCheckBox(value, ev) {
    switch (value) {
      case 'airpresuretest':
        if (ev.value == true) {
          this.finallistdata.DONEAIRPRESSUREPOSTTEST = 'true'
        }
        else {
          this.finallistdata.DONEAIRPRESSUREPOSTTEST = 'false'
        }
        break;
      case 'functiontest':
        if (ev.value == true) {
          this.finallistdata.DONEFUNCTIONPOSTTEST = 'true'
        }
        else {
          this.finallistdata.DONEFUNCTIONPOSTTEST = 'false'
        }
        break;
      case 'hydrotest':
        if (ev.value == true) {
          this.finallistdata.DONEHYDROPOSTTEST = 'true'
        }
        else {
          this.finallistdata.DONEHYDROPOSTTEST = 'false'
        }
        break;
      case 'visualtest':
        if (ev.value == true) {
          this.finallistdata.DONEVISUALPOSTTEST = 'true'
        }
        else {
          this.finallistdata.DONEVISUALPOSTTEST = 'false'
        }
        break;
    }
  }

  redirect(value) {
    // let parentRefId = this.valueProvider.getDeviceType();
    this.utilityProvider.bottomNavigation(this.navCtrl, value);
  }

  updateFinalTest() {
    // this.finallistdata[0].AIRPRESSUREPOSTTEST = this.AIRPRESSUREPOSTTEST;
    // this.finallistdata[0].FUNCTIONPOSTTEST = this.FUNCTIONPOSTTEST;
    // this.finallistdata[0].HYDROPOSTTEST = this.HYDROPOSTTEST;
    // this.finallistdata[0].VISUALPOSTTEST = this.VISUALPOSTTEST;
    this.localServicesdr.updateFinalList(this.finallistdata).then((response: any[]) => {

      // this.utilityProvider.stopSpinner();
    }).catch((error: any) => {
      // this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'updateFinalTest', ' Error in updateFinalTest : ' + JSON.stringify(error));
    });
  }

  ionViewWillLeave() {
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.updateFinalTest();
  }

  gotofcr() {
    this.events.publish('goToFCR')
  }
}
