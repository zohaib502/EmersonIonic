import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { AlertController } from 'ionic-angular';
import { LoggerProvider } from '../../../providers/logger/logger';

@IonicPage()
@Component({
  selector: 'page-address-modal',
  templateUrl: 'address-modal.html',
})
export class AddressModalPage {
  addressObject: any = {};
  ifEdit: any;
  ifAdd: any;
  cloneAddressObj: any = {};
  country: any;
  language: any;
  setThisAsDefault: any;
  fileName: any = 'Address_Modal';
  cancel: any = false;

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
               public localService: LocalServiceProvider, public logger: LoggerProvider) {
  }

  ionViewDidLoad() {
    this.country = this.navParams.get('country');
    this.language = this.navParams.get('language');
    this.cloneAddressObj = this.navParams.get('addressObj');
    this.addressObject = Object.assign({}, this.cloneAddressObj);
    this.addressObject.BUSINESS_UNIT_CODE = "No Value";
    this.addressObject.tempLangObj = this.addressObject.LANGUAGE;
    this.ifEdit = this.navParams.get('ifEdit');
    this.ifAdd = this.navParams.get('ifAdd');
    if (this.ifAdd) {
      this.addressObject.COUNTRY = this.navParams.get('countryCode');
    }
  }

  /**Closes the modal window */
  closeModal() {
    this.viewCtrl.dismiss();
  }

  /**Save the New/Updated Location details*/
  save() {
    if (this.addressObject.IS_ENABLED == undefined) {
      this.addressObject.IS_ENABLED = "false";
    }
    this.addressObject.IS_ENABLED = this.addressObject.IS_ENABLED ? this.addressObject.IS_ENABLED : "false";
    this.localService.checkIfCountryExists(this.addressObject.COUNTRY, this.addressObject.LANGUAGE, true).then((res: any[]) => {
      if (res.length == 0) {
        this.viewCtrl.dismiss(this.addressObject);
      }
      else {
        if (this.setThisAsDefault) {
          this.localService.updateIfCountryExists(res[0].AddressId).then((res: any) => {
            this.addressObject.IS_DEFAULT = true;
            if (this.addressObject.STATE.trim() == '') {
              this.addressObject.STATE = "";
            }
            else {
              this.viewCtrl.dismiss(this.addressObject);
            }
          }).catch((error: any) => {
            this.logger.log(this.fileName, 'save', 'Error in updateIfCountryExists : ' + JSON.stringify(error));
          });
        }
        else {
          this.viewCtrl.dismiss(this.addressObject);
        }
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'save', 'Error in checkIfCountryExists : ' + JSON.stringify(error));
    });
  }

  _keyPress(event: any) {
    const pattern = /^[0-9-+.()]*$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  /**Trim Spaces from State Value of the object */
  trimSpaces(value) {
    this.addressObject.STATE = this.addressObject.STATE.trim();
  }

    /**Use to set the location to be default*/
  setDefault(event) {
    if (event.value) {
      this.localService.checkIfCountryExists(this.addressObject.COUNTRY, this.addressObject.LANGUAGE, true).then((res: any[]) => {
        if (res.length > 0) {
          let alert = this.alertCtrl.create({
            title: 'Confirm',
            message: 'Default alreday Exists.Do you want to set this as default..?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  this.addressObject.LANGUAGE = "";
                  this.addressObject.IS_DEFAULT = false;
                }
              },
              {
                text: 'Ok',
                handler: () => {
                  this.setThisAsDefault = true;
                }
              }
            ]
          });
          alert.present();
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'setDefault', 'Error in checkIfCountryExists : ' + JSON.stringify(error));
      });
    }
  }

  setDefaultOnChange(event) {
    if (event) {
      this.localService.checkIfCountryExists(this.addressObject.COUNTRY, this.addressObject.LANGUAGE, true).then((res: any[]) => {
        if (res.length > 0) {
          let alert = this.alertCtrl.create({
            title: 'Confirm',
            message: 'Default alreday Exists.Do you want to set this as default..?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  if(this.ifEdit){
                    this.addressObject.Language = this.addressObject.tempLangObj;
                  }
                  else{
                    this.addressObject.Language = "";
                  }
                  this.cancel = true;
                }
              },
              {
                text: 'Ok',
                handler: () => {
                  this.setThisAsDefault = true;
                }
              }
            ]
          });
          alert.present();
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'setDefaultOnChange', 'Error in checkIfCountryExists : ' + JSON.stringify(error));
        });
    }
  }

     /**Check if Language exists */
  checkIfLangExits() {
    !this.cancel ? this.setDefaultOnChange(this.addressObject.isEnabled) : this.cancel = false;
  }

    /**Set enable location Value of the object */
  setEnable(event) {
    if (event.value == true) {
      this.addressObject.IS_ENABLED = "true";
    }
    else if (event.value == false) {
      this.addressObject.IS_ENABLED = "false";
    }
  }
}
