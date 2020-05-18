import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ValueProvider } from '../../../../providers/value/value';
import { LoggerProvider } from '../../../../providers/logger/logger';
import * as Enums from '../../../../enums/enums';

@IonicPage()
@Component({
  selector: 'page-verify-password',
  templateUrl: 'verify-password.html',
})
export class VerifyPasswordPage {
  email: any;
  isEmailError: any;
  emptyEmail: any;
  engineerObject: any;
  fileName: any = 'Verify_Password_Modal';

  constructor(public navCtrl: NavController, public navParams: NavParams, private valueProvider: ValueProvider, public viewCtrl: ViewController, public logger: LoggerProvider) {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  checkPassword() {
    this.engineerObject = this.valueProvider.getEngineer();

    if (this.email) {
      let enteredEmail = this.email.toLowerCase();
      let userEmail = this.valueProvider.getUser().Email.toLowerCase();
      if (enteredEmail === userEmail) {
        this.email = "";
        this.isEmailError = false;
        this.emptyEmail = false;
        this.viewCtrl.dismiss(true);
        // 12/03/2018 kamal : check if status is debrief started then blank your engineer and customer signature
        if(this.valueProvider.getTask().StatusID == Enums.Jobstatus.Debrief_Started){
        this.engineerObject.Engg_Sign_Time = '';
        this.engineerObject.Sign_File_Path = '';
        }
      } else {
        this.email = "";
        this.isEmailError = true;
        this.emptyEmail = false;
      }
    } else {
      this.email = "";
      this.emptyEmail = true;
      this.isEmailError = false;
    }
  };

  setValidation() {
    this.isEmailError = false;
    this.emptyEmail = false;
  }

  cancelPassword() {
    this.email = "";
    this.viewCtrl.dismiss(false);
  }

}
