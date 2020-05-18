import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { SearchPipe } from '../../pipes/search/search';
import { ValueProvider } from '../../providers/value/value';
import { UtilityProvider } from '../../providers/utility/utility';
import { CloudService } from '../../providers/cloud-service/cloud-service';
import { SyncProvider } from '../../providers/sync/sync'
import { LoggerProvider } from '../../providers/logger/logger';
import { ShowActiveTimeZonePipe } from '../../pipes/showActiveTimeZonePipe/showActiveTimeZonePipe';
import { FetchProvider } from '../../providers/sync/fetch/fetch';
import { SubmitProvider } from '../../providers/sync/submit/submit';

import moment from 'moment';

/**
 * Generated class for the TimezonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timezone',
  templateUrl: 'timezone.html',
})
export class TimezonePage {
  fileName: any = 'TimezonePage';
  taskInput: string = '';
  header_data: any;
  checkedTZ: any[] = [];
  uncheckedTZ: any[] = [];
  localTimeZones: any[] = [];
  showActive: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public utilityProvider: UtilityProvider, public localService: LocalServiceProvider, public valueProvider: ValueProvider, public logger: LoggerProvider, public searchPipe: SearchPipe, public cloudService: CloudService, public syncProvider: SyncProvider, public showActiveTimeZonePipe: ShowActiveTimeZonePipe, public fetchProvider: FetchProvider, public submitProvider: SubmitProvider) {
    this.header_data = { title1: "", title2: "Field Service Admin", taskId: "" };
  }

  ionViewDidEnter() {
    this.getTimeZone();
    this.events.publish('setPage', "Timezone");
  }

  /**
   * @memberof TimeZone
   * @default: 
   * @description: 
   * will fetch TimeZone to display
   */
  private async getTimeZone(): Promise<boolean> {
    let result: boolean = false;
    try {
      this.utilityProvider.showSpinner();
      await this.fetchProvider.fetchTimezonesForAdmin().then(res => {
        if (res && res.length) {
          res.map(item => {
            item.isEdited = "false";
          });
          this.localTimeZones = res;
          result = true;
        }
        this.utilityProvider.stopSpinner();
      }).catch(err => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getTimeZone', 'Error in getTimeZone : ' + JSON.stringify(err));
        if(err.data && err.data.error){
          this.utilityProvider.displayErrors([{ "errMsg":err.data.error}]);
        }
      });
    } catch (error) {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getTimeZone', 'Error in getTimeZone : ' + JSON.stringify(error));
      if(error.data && error.data.error){
        this.utilityProvider.displayErrors([{ "errMsg":error.data.error}]);
      }
    } finally {
      return result;
    }
  }

  /**
   * @memberof TimeZone
   * @default: 
   * @description: 
   * will edit TimeZone item with isEdited True
   */
  public setEnable(event, item) {
    item["isEdited"] = "true";
    item["IsActive"] = event.value == true ? "Y" : "N";
  }

  /**
   * @memberof TimeZone
   * @default: 
   * @description: 
   * will submit edited timezone to dbcs
   */
  public saveTimeZone() {
    let self = this;
    self.utilityProvider.showSpinner();
    self.createTimeZonePayLoadToSubmit().then((payLoadData: any) => {
      if (payLoadData && payLoadData.length > 0) {
        self.submitProvider.submitTimeZone(payLoadData).then(res => {
          self.updateTimeZoneAfterSubmit();
          this.utilityProvider.presentToast('Timezones saved successfully!', 2000, 'top', 'feedbackToast');
          self.utilityProvider.stopSpinner();
        }).catch(err => {
          self.utilityProvider.stopSpinner();
          self.logger.log(self.fileName, 'saveTimeZone', 'Error in saveTimeZone,  ' + JSON.stringify(err));
          if(err.data && err.data.error){
            this.utilityProvider.displayErrors([{ "errMsg":err.data.error}]);
          }
        });
      } else {
        self.utilityProvider.stopSpinner();
      }
    }).catch(err => {
      self.utilityProvider.stopSpinner();
      self.logger.log(self.fileName, 'saveTimeZone', 'Error in saveTimeZone,  ' + JSON.stringify(err));
      if(err.data && err.data.error){
        this.utilityProvider.displayErrors([{ "errMsg":err.data.error}]);
      }
    });
  }

  private updateTimeZoneAfterSubmit() {
    this.localTimeZones.map(item => {
      if (item.isEdited == "true") {
        item.isEdited = "false";
      }
    });
  }

  /**
  * @memberof TimeZone
  * @default: 
  * @description: 
  * will create payload to submit data to dbcs
  */
  private createTimeZonePayLoadToSubmit() {
    const userID = parseInt(this.valueProvider.getUser().UserID);
    const modifiedDate = moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    return new Promise((resolve, reject) => {
      let timeZoneToSubmit = [];
      let filteredtimeZone = this.localTimeZones.filter(item => { return item.isEdited == "true" });
      if (filteredtimeZone.length > 0) {
        for (let i = 0; i < filteredtimeZone.length; i++) {
          let timeZoneObject: any = {};
          timeZoneObject.TimeZoneID = filteredtimeZone[i].TimeZoneID;
          timeZoneObject.Modified_By = userID;
          timeZoneObject.Modified_Date = modifiedDate;
          timeZoneObject.IsActive = filteredtimeZone[i].IsActive;
          timeZoneToSubmit.push(timeZoneObject);
        }
      }
      resolve(timeZoneToSubmit);
    }).catch(err => {
      this.logger.log(this.fileName, 'createLanguagePayLoadToSubmit', 'Error in createLanguagePayLoadToSubmit : ' + JSON.stringify(err));
      return Promise.reject(err);
    });
  }
}
