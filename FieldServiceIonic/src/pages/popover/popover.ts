import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events, PopoverController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { UtilityProvider } from '../../providers/utility/utility';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { SyncProvider } from '../../providers/sync/sync';
import { ValueProvider } from '../../providers/value/value';
import { LoggerProvider } from '../../providers/logger/logger';
import { CloudService } from '../../providers/cloud-service/cloud-service';
import { Device } from '@ionic-native/device';

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
  userPopOver: boolean = false;
  currentPageName: any;
  navHistoryList: any[] = [];
  isLogout:boolean = false;

  constructor(public viewCtrl: ViewController, public popoverCtrl: PopoverController, public events: Events, public navCtrl: NavController, public navParams: NavParams, public cloudProvider: CloudService, public syncProvider: SyncProvider, public translateService: TranslateService, public utilityProvider: UtilityProvider, public localService: LocalServiceProvider, public valueService: ValueProvider, public menuController: MenuController, public logger: LoggerProvider, public device: Device) {
    // this.events.subscribe('goto:prefrence', (data) => {
    //   this.events.unsubscribe('goto:prefrence');
    //  if(this.isLogout){
    //   this.handleLogout()
    //  }else{
    //   this.handlePrefrence();
    //  }     
    // })
  }

  ionViewDidLoad() {
    this.userPopOver = this.navParams.get("userPopOver");
    if (this.navParams.get("headerData")) {
      this.currentPageName = (this.navParams.get("headerData")).title2;
    }
  }


  ionViewDidEnter() {
    this.navHistoryList.push(this.navCtrl['_linker']['_history']);
  }

  goToUserPreferences() {
    this.viewCtrl.dismiss();
    // if(this.cloudProvider.valueProvider.getHeaderNav()){
    //   this.utilityProvider.confirmAlert('popover');
    //   this.isLogout = false;
    // }else{
     this.handlePrefrence();
    // }    
  }

  handlePrefrence(){
    this.events.publish('openPref', this.navHistoryList[0]);
    this.events.publish('user:created', null);
  }

  /**
   * 08/30/2018 - Suraj Gorai- Remove  appclose() and add events publish appLogout();
   * @memberOf PopoverPage
   */
  signOut() {
    // if(this.valueService.getHeaderNav()){
    //   this.utilityProvider.confirmAlert('popover');
    //   this.isLogout = true;
    // }else{
      this.handleLogout();
    // }
  }

  handleLogout(){
    this.viewCtrl.dismiss();
    let params = {}
    let signOutModal = this.utilityProvider.showModal("SignOutModalPage", params, { enableBackdropDismiss: false, cssClass: 'SignOutModalPage' });
    signOutModal.onDidDismiss((data) => {
      if (data == true) {
        this.logger.log("SignOut PopOver", 'signOut', "User logout from Application");
        this.events.publish('appLogout');
      }
    });
    signOutModal.present();
  }
}
