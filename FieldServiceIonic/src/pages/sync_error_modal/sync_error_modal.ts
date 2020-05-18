import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ValueProvider } from '../../providers/value/value';
// import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { UtilityProvider } from '../../providers/utility/utility';
import { CloudService } from '../../providers/cloud-service/cloud-service';
import { LoggerProvider } from '../../providers/logger/logger';
import { SyncProvider } from '../../providers/sync/sync';
import * as _ from 'lodash'; 

@IonicPage()
@Component({
  selector: 'sync-error-modal',
  templateUrl: 'sync_error_modal.html',
})
export class SyncErrorModalPage {
  errorData: any = []; 
  pointOfError='';
  // errors: any = [];

  constructor(public cloudProvider: CloudService,public navCtrl: NavController, public logger: LoggerProvider, public viewCtrl: ViewController, 
    public navParams: NavParams, public valueService: ValueProvider, public utilityProvider: UtilityProvider,
    public syncProvider: SyncProvider) {
      this.pointOfError  = this.navParams.get('checkTask');
      let errorsData = this.navParams.get('errMsg');
      console.log(errorsData);
      if(errorsData) {
        console.log("ERROR");
      }
      errorsData.forEach((item) => {
        this.errorData.push(item.errMsg);
      });

      this.errorData = _.uniqBy(this.errorData, 'httpCode').filter((error) => { 
        return (error.userMessage != null || error.errorMessage != null) 
      });

      console.log(errorsData);
      console.log(this.pointOfError);
  
    }

  closeModal() {
    this.viewCtrl.dismiss();
  } 

  trackByIndex(index, item) {
    return item.name;
  }

  openMailModal() {
    this.viewCtrl.dismiss();
    let mailModal = this.utilityProvider.showModal("MailPage", { dataSource: this.errorData }, { enableBackdropDismiss: false, cssClass: 'Mail-Selector-Modal' });
    mailModal.present();
  }

}