import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-forgot-password-modal',
  templateUrl: 'forgot-password-modal.html',
})
export class ForgotPasswordModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private theInAppBrowser: InAppBrowser) {
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  public forgetPassword() {
    let target = "_blank";
    this.theInAppBrowser.create('https://login.us2.oraclecloud.com/identity/faces/forgotpassword', target, 'location=yes');
  }

}

