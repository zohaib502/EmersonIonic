import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';

@IonicPage()
@Component({
  selector: 'page-installed-base-modal',
  templateUrl: 'installed-base-modal.html',
})
export class InstalledBaseModalPage {

  installBaseObject: any = {};
  cloneInstallBaseObject: any = {};
  productList: any = [];
  StatusList: any = [];
  manufacturerList: any = [];
  showSelects: boolean = true;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public localService: LocalServiceProvider) {
    this.events.subscribe('langSelected', (res) => {
       // 10-12-18 Radheshyam - the dom will refresh and show the current language in dropbox.
      setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
  }

  ionViewDidLoad() {
    this.productList = this.navParams.get('productList');
    this.StatusList = this.navParams.get('StatusList');
    this.manufacturerList = this.navParams.get('manufacturerList');
    this.cloneInstallBaseObject = this.navParams.get('installedBase');
    this.installBaseObject = Object.assign({}, this.cloneInstallBaseObject);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  public save() {
    this.viewCtrl.dismiss(this.installBaseObject);
  }

  selectProductLine(value) {
    let filtered = this.productList.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.installBaseObject.Product_Line = filtered.Value;
    }
  }

  //check character limit for description , should be less than 4000 / Mayur
  _keyPress(event: any) {
    if (event.target.textLength > 3999) {
      event.preventDefault();
    }
  }

}
