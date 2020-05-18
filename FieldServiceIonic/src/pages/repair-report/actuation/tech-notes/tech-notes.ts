import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { ValueProvider } from '../../../../providers/value/value';
import * as Enums from '../../../../enums/enums';

@IonicPage()
@Component({
  selector: 'page-tech-notes',
  templateUrl: 'tech-notes.html',
})
export class TechNotesPage {
  fileName = "TechNotesPage";
  techNotesData = [];
  Enums: any = Enums;
  technotes: any = {
    TN_PK_ID: '',
    CREATEDBY: '',
    CREATEDDATE: '',
    MODIFIEDBY: '',
    MODIFIEDDATE: '',
    REPORTID: '',
    SYNCSTATUS: ''
  };
  selectedProcess: any;
  bottomNavBtn: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public localServiceSdr: LocalServiceSdrProvider, public valueProvider: ValueProvider,
    public utilityProvider: UtilityProvider, public logger: LoggerProvider, public events: Events) {
  }

  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });

    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Add Tech notes" };

    if (this.valueProvider.getCurrentReport()) {
      this.technotes.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
    }

    this.getTechNotes()
  }

  prepareAsFoundObject() {
    if (this.techNotesData.length > 0) {
      this.technotes.MODIFIEDBY = parseInt(this.valueProvider.getUserId());
      this.technotes.MODIFIEDDATE = this.localServiceSdr.getCurrentDate();
      this.technotes.TN_PK_ID = this.techNotesData[0].TN_PK_ID
      this.technotes.REPORTID = this.techNotesData[0].REPORTID;
      this.technotes.TECHNOTES = this.techNotesData[0].TECHNOTES
      this.technotes.CREATEDBY = this.techNotesData[0].CREATEDBY;
      this.technotes.CREATEDDATE = this.techNotesData[0].CREATEDDATE;
    } else {
      this.technotes.TN_PK_ID = this.utilityProvider.getUniqueKey();
      this.technotes.CREATEDBY = parseInt(this.valueProvider.getUserId());
      this.technotes.CREATEDDATE = this.localServiceSdr.getCurrentDate();
      this.technotes.MODIFIEDBY = parseInt(this.valueProvider.getUserId());
      this.technotes.MODIFIEDDATE = this.localServiceSdr.getCurrentDate();

    }
    this.technotes.SYNCSTATUS = "N";
  }

  getTechNotes() {
    this.localServiceSdr.getTechNotes(this.technotes.REPORTID).then((res: any) => {
      if (res.length > 0) {
        this.techNotesData = res;

      }
      this.prepareAsFoundObject();
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getCalibrationData', ' Error in getCalibrationData : ' + JSON.stringify(error));
    })
    this.utilityProvider.stopSpinner();
  }

  insertTechNotes() {
    this.localServiceSdr.InsertupdateTechNotes(this.technotes).then((res: any) => {
      if (res) {
        this.techNotesData = res;
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getCalibrationData', ' Error in getCalibrationData : ' + JSON.stringify(error));
    })
  }

  ionViewWillLeave() {
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.insertTechNotes();
  }

  redirect(value) {
    this.utilityProvider.bottomNavigation(this.navCtrl, value);
  }

  gotofcr() {
    this.events.publish("goToFCR");
  }
}
