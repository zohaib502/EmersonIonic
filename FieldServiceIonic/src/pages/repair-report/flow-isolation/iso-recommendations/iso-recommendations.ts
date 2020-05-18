import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { LocalServiceSdrProvider } from '../../../../providers/local-service-sdr/local-service-sdr';
import { ValueProvider } from '../../../../providers/value/value';
import * as Enums from '../../../../enums/enums';

@IonicPage()
@Component({
  selector: 'page-iso-recommendations',
  templateUrl: 'iso-recommendations.html',
})
export class IsoRecommendationsPage {
  fileName: any = 'IsoRecommendationsPage';
  recommendationObj: any = {};
  allFutureRecomendationsoption: any = [];
  elementOther: boolean = false;
  recordExists: boolean = false;
  selectedProcess: any;
  bottomBtnClicked: boolean = false;
  errorObj: any = [];
  Enums: any = Enums;
  bottomNavBtn: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public utilityProvider: UtilityProvider, public logger: LoggerProvider, public localServiceSdr: LocalServiceSdrProvider, public valueProvider: ValueProvider, public events: Events) {
  }

  ionViewDidEnter() {
    this.utilityProvider.bottomNavigationButtonName(this.navCtrl).then((res: any) => { this.bottomNavBtn = res; });

    this.bottomBtnClicked = false;
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "Recommendations" };

    if (this.valueProvider.getCurrentReport()) {
      this.recommendationObj.REPORTID = this.valueProvider.getCurrentReport().REPORTID;
      this.selectedProcess = this.valueProvider.getCurrentReport().SELECTEDPROCESS;
    }
    this.getFIRecommendations();
    this.getFutureRecommendations();
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
  getFutureRecommendations() {
    this.localServiceSdr.getLookupsByLookupType("FutureRecomendationsoptional").then((response: any[]) => {
      this.allFutureRecomendationsoption = response;
      this.allFutureRecomendationsoption.unshift({ "LookupID": -2, "LookupValue": "No Value" });
      this.allFutureRecomendationsoption.push({ "LookupID": -1, "LookupValue": "Other" });
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getFutureRecommendations', ' Error in getLookupsByLookupType : ' + JSON.stringify(error));
    });
  }
  searchModal(data) {
    let dataArray: any = [];
    switch (data) {
      case 'FurtherRecommendations':
        dataArray = this.allFutureRecomendationsoption;
        break;
      default:
        break;
    }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: data }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        switch (data.type) {
          case 'FurtherRecommendations':
            if (data.LookupValue == 'Other') {
              this.elementOther = true;
            }
            else {
              this.elementOther = false;
              this.recommendationObj.FUTURERECOMMENDATIONS_OT = null
            }
            this.recommendationObj.FutureRecommendationsOptionName = data.LookupValue;
            this.recommendationObj.FUTURERECOMMENDATIONS = data.ID;
            break;
          default:
            break;
        }
      }
    });
  }

  checkIsValidated() {
    let isValidated = true;
    if (this.recommendationObj && this.recommendationObj['FutureRecommendationsOptionName'] == 'Other') {
      if (!this.utilityProvider.isNotNull(this.recommendationObj['FUTURERECOMMENDATIONS_OT'])) {
        isValidated = false;
      }
    }
    return isValidated;
  }

  redirect(value) {
    this.bottomBtnClicked = true;
    if (this.checkIsValidated()) {
      this.utilityProvider.bottomNavigation(this.navCtrl, value);
    } else {
      this.utilityProvider.presentAlert();
    }
  }
  save() {
    this.recommendationObj.RC_PK_ID = this.recordExists ? this.recommendationObj.RC_PK_ID : this.utilityProvider.getUniqueKey();
    this.recommendationObj.SYNCSTATUS = "N";
    this.recommendationObj.CREATEDBY = this.recordExists ? this.recommendationObj.CREATEDBY : this.valueProvider.getUser().UserID;
    this.recommendationObj.CREATEDDATE = this.recordExists ? this.recommendationObj.CREATEDDATE : this.localServiceSdr.getCurrentDate();
    this.recommendationObj.MODIFIEDBY = this.valueProvider.getUser().UserID;
    this.recommendationObj.MODIFIEDDATE = this.localServiceSdr.getCurrentDate();
    this.localServiceSdr.insertUpdateFIRecommendations(this.recommendationObj, this.recordExists).then((response: any) => {
      if (response) {
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'save', ' Error in insertSdrReport : ' + JSON.stringify(error));
    });
  }
  getFIRecommendations() {
    this.localServiceSdr.getFIRecommendations(this.recommendationObj.REPORTID).then((res: any) => {
      if (res.length > 0) {
        this.recommendationObj = res[0];
        this.recommendationObj.FutureRecommendationsOptionName = this.recommendationObj.FUTURERECOMMENDATIONS == -1 ? 'Other' : res[0].LookupValue;
        this.recordExists = true;
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getCalibrationData', ' Error in getCalibrationData : ' + JSON.stringify(error));
    })
    this.utilityProvider.stopSpinner();
  }
  goToFcr() {
    if (this.checkIsValidated()) {
      this.save();
      setTimeout(() => {
        this.events.publish("goToFCR");
      }, 100);

    } else {
      if (!this.bottomBtnClicked) {
        this.utilityProvider.presentAlert();
        throw new Error('Form validation error!');
      }
    }
  }
  checkNotesLimit(notes) {
    this.recommendationObj.RECOMMENDATIONS = this.utilityProvider.sliceValueUptoLimit(notes, 1000);
  }
}
