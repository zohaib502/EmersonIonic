import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ValueProvider } from '../../providers/value/value';
// import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { UtilityProvider } from '../../providers/utility/utility';
import { CloudService } from '../../providers/cloud-service/cloud-service';
import { LoggerProvider } from '../../providers/logger/logger';

@IonicPage()
@Component({
  selector: 'page-signout_modal',
  templateUrl: 'signout_modal.html',
})
export class SignOutModalPage {

  constructor(public cloudProvider: CloudService,public navCtrl: NavController, public logger: LoggerProvider, public viewCtrl: ViewController, public navParams: NavParams, public valueService: ValueProvider, public utilityProvider: UtilityProvider) {
    // , private localService: LocalServiceProvider
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
  signOut() {
    this.viewCtrl.dismiss(true);
  }

}