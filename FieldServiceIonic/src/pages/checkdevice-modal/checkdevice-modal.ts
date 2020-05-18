import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CheckdeviceModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkdevice-modal',
  templateUrl: 'checkdevice-modal.html',
})
export class CheckdeviceModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
  givepermission() {
    this.viewCtrl.dismiss(true);
  }

}
