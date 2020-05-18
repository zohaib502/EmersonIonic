import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { ValueProvider } from '../../../../providers/value/value';
import * as Enums from '../../../../enums/enums';
@IonicPage()
@Component({
  selector: 'page-iso-report-notes',
  templateUrl: 'iso-report-notes.html',
})

export class IsoReportNotesPage {
  reportNotesObj: any = {};
  elementOther: boolean = false;
  recordExists: boolean = false;
  selectedProcess: any;
  allMenuReportNotes: any = [];
  fileName: any = 'IsoReportNotesPage';
  isValidated: any = false;
  bottomBtnClicked: boolean = false;
  Enums: any = Enums;
  bottomNavBtn: any;
  placeHolder: any = `Tie back to problem statement, did you fix it \nDid the customer not repair something recommended \nIs there anything critical to know for next repair, anything left undone`;
  constructor(public navCtrl: NavController, public navParams: NavParams, public utilityProvider: UtilityProvider,
    public logger: LoggerProvider, public localServiceSdr: LocalServiceSdrProvider, public valueProvider: ValueProvider, public events: Events) {
    // 
  }

  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });

    this.bottomBtnClicked = false;
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Report Notes" };

    if (this.valueProvider.getCurrentReport()) {
      this.reportNotesObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
    }
    this.getFIReportNotes();
    this.getMenuReportNotes();
  }

  ionViewWillLeave() {
    if (this.checkIsValidated()) {
      this.save();
    } else {
      if (!this.bottomBtnClicked) {
        this.utilityProvider.presentAlert();
        throw new Error('Form validation error!');
      }
    }

  }
  goToFcr() {
    if (this.checkIsValidated()) {
      this.save();
      setTimeout(() => {
        this.events.publish("goToFCR");
      }, 100);

    } else {
      this.utilityProvider.presentAlert();
      throw new Error('Form validation error!');
    }
  }

  getMenuReportNotes() {
    this.localServiceSdr.getLookupsByLookupType("FutureRecomendationsNotes").then((response: any[]) => {
      this.allMenuReportNotes = response;
      this.allMenuReportNotes.unshift({ "LookupID": -2, "LookupValue": "No Value" });
      this.allMenuReportNotes.push({ "LookupID": -1, "LookupValue": "Other" });
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getMenuReportNotes', ' Error in getLookupsByLookupType : ' + JSON.stringify(error));
    });
  }

  searchModal(data) {
    let dataArray: any = [];
    switch (data) {
      case 'MenuReportNotes':
        dataArray = this.allMenuReportNotes;
        break;
      default:
        break;
    }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: data }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        switch (data.type) {
          case 'MenuReportNotes':
            if (data.LookupValue == 'Other') {
              this.elementOther = true;
            }
            else {
              this.elementOther = false;
              this.reportNotesObj.REPAIRSCOPECOMPLETED_OT = null
            }
            this.reportNotesObj.REPAIRSCOPECOMPLETEDNAME = data.LookupValue;
            this.reportNotesObj.REPAIRSCOPECOMPLETED = data.ID;
            break;
          default:
            break;
        }
      }
    });
  }

  redirect(value) {
    this.bottomBtnClicked = true;
    if (this.checkIsValidated()) {
      this.utilityProvider.bottomNavigation(this.navCtrl, value);
    } else {
      this.utilityProvider.presentAlert();
    }
  }
  checkIsValidated() {
    let isValidated = true;
    if (this.reportNotesObj) {
      if (this.reportNotesObj['REPAIRSCOPECOMPLETEDNAME'] == 'Other') {
        if (!this.utilityProvider.isNotNull(this.reportNotesObj['REPAIRSCOPECOMPLETED_OT'])) {
          isValidated = false;
        }
      }
      if (!this.utilityProvider.isNotNull(this.reportNotesObj['NOTES'])) {
        isValidated = false;
      }
    }
    return isValidated;

  }
  save() {
    this.reportNotesObj.RN_PK_ID = this.recordExists ? this.reportNotesObj.RN_PK_ID : this.utilityProvider.getUniqueKey();
    this.reportNotesObj.SYNCSTATUS = "N";
    this.reportNotesObj.CREATEDBY = this.recordExists ? this.reportNotesObj.CREATEDBY : this.valueProvider.getUser().UserID;
    this.reportNotesObj.CREATEDDATE = this.recordExists ? this.reportNotesObj.CREATEDDATE : this.localServiceSdr.getCurrentDate();
    this.reportNotesObj.MODIFIEDBY = this.valueProvider.getUser().UserID;
    this.reportNotesObj.MODIFIEDDATE = this.localServiceSdr.getCurrentDate();
    this.localServiceSdr.insertUpdateFIReportNotes(this.reportNotesObj, this.recordExists).then((response: any) => {
      if (response) {
        // 
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'save', ' Error in insertUpdateFIReportNotes : ' + JSON.stringify(error));
    });
  }

  getFIReportNotes() {
    this.localServiceSdr.getFIReportNotes(this.reportNotesObj.REPORTID).then((res: any) => {
      if (res.length > 0) {
        this.reportNotesObj = res[0];
        this.reportNotesObj.REPAIRSCOPECOMPLETEDNAME = this.reportNotesObj.REPAIRSCOPECOMPLETED == -1 ? 'Other' : res[0].LookupValue;
        this.recordExists = true;
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getFIReportNotes', ' Error in getFIReportNotes : ' + JSON.stringify(error));
    })
    this.utilityProvider.stopSpinner();
  }
  checkNotesLimit(notes) {
    this.reportNotesObj.NOTES = this.utilityProvider.sliceValueUptoLimit(notes, 1000);
  }
}
