import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, MenuController, Events, PopoverController, Platform, Navbar, AlertController, App } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { UtilityProvider } from '../../providers/utility/utility';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { SyncProvider } from '../../providers/sync/sync';
import { ValueProvider } from '../../providers/value/value';
import { CloudService } from '../../providers/cloud-service/cloud-service';
import { LoggerProvider } from '../../providers/logger/logger';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import * as Enums from '../../enums/enums';
import { FileUpdaterProvider } from '../../providers/file-updater/file-updater';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-custom-header',
  templateUrl: 'custom-header.html',
})
export class CustomHeaderPage {
  header_data: any;
  menuTogglebtn: boolean = true;
  fileName: any = 'Custom_Header';
  filePath: any;
  Moment: any = moment;
  Enums: any = Enums;
  confirmBackToRoot: boolean = false;
  @ViewChild('fab') fab: FabContainer;
  @ViewChild('navbar') navBar: Navbar;

  constructor(private fileUpdater: FileUpdaterProvider, public platform: Platform, public app: App, public popoverCtrl: PopoverController, public events: Events, public sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public cloudProvider: CloudService, public syncProvider: SyncProvider, public translateService: TranslateService, public utilityProvider: UtilityProvider, public localService: LocalServiceProvider, public valueService: ValueProvider, public menuController: MenuController, public logger: LoggerProvider, public alertCtrl: AlertController) {

    // this.logger.log(this.fileName, 'constructor', this.valueService.getSelectedLang());
    if (this.platform.is('cordova')) {
      //08/20/2018 Zohaib Khan: To get the last updated date.
      this.syncProvider.setLastSyncStartTime();
      this.filePath = cordova.file.dataDirectory + '/lang/';
    }

    setTimeout(() => {
      this.setBackButtonAction();
      this.utilityProvider.setFab(this.fab);
    }, 800);

    this.events.subscribe('leave:page', (data) => {
      this.navCtrl.pop();
      this.events.unsubscribe('leave:page');
    })
  }
  @Input()
  set header(header_data: any) {
    this.header_data = header_data;
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.setBackButtonAction();
      this.confirmBackToRoot = false;
    }, 100);

  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.setBackButtonAction();
      this.confirmBackToRoot = false;
    }, 100);
  }

  get header() {
    return this.header_data;
  }

  gotoUserPreferences() {
    this.events.publish('openPref', null);
    this.events.publish('user:created', null);
  }

  menuToggle() {
    this.menuController.open();
    if (this.menuTogglebtn) {
      this.menuController.enable(false);
      this.menuTogglebtn = !this.menuTogglebtn;
    }
    else {
      this.menuController.enable(true);
      this.menuTogglebtn = true;
    }
  }

  closeFab() {
    this.utilityProvider.closeFab();
  }

  changeLanguage(lang) {
    // this.logger.log(this.fileName, 'changeLanguage', 'selected Lang ' + lang);
    this.translateService.use(lang);
    this.events.publish('langSelected', lang);
    let userPref = this.valueService.getUserPreferences();
    userPref[0].SelectedLanguage = lang;
    this.localService.updateUserPreferrences(userPref[0]).then((res): any => {
      // this.logger.log(this.fileName, 'changeLanguage', 'insertLanguagePrefrences ' + JSON.stringify(res));
      this.valueService.setUserPreferences(userPref);
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'changeLanguage', 'Error in updateUserPreferrences : ' + JSON.stringify(error));
    });
  }

  detectLanguageChange(changedLanguage) {
    this.changeLanguage(changedLanguage);
  }

  isOnline() {
    //this.syncProvider
    if (!this.utilityProvider.isConnected()) {
      this.syncProvider.displayOfflineError(this.fileName, 'isOnline');
      this.syncProvider.isAutoSyncing = false;
    }
    return this.utilityProvider.isConnected();
  }

  autoCloseFab(fab: FabContainer) {
    setTimeout(() => {
      fab.close();
    }, 4000);
  }

  syncData() {
    if (this.utilityProvider.isConnected()) {
      try {
        // 07/23/2018 Gurkirat Singh -- Added Sync invocation through event in SyncProvider and removed Sync Popup
        // this.syncProvider.syncSubmit();
        // 09/04/2018 Rizwan Haider - Replaced syncSubmit with scheduleSync event invocation in SyncProvider to update 30 min reschedule sync call
        this.syncProvider.scheduleSync(true);
        let appversion = this.fileUpdater.localDBConfig.softVersion;
        this.logger.log(this.fileName, 'syncData', 'Manual Sync is Clicked By '+ this.valueService.getUser().Name + " And App Version is " + appversion);
      } catch (error) {
        this.logger.log(this.fileName, 'syncData', 'Error in syncData :' + JSON.stringify(error));
      }
    }
    else {
      this.utilityProvider.presentToastButtom('Sync not possible in offline mode!!!', '4000', 'top', '', 'OK');
    }
  }

  openUserPopOver(myEvent) {
    this.utilityProvider.closeFab();
    try {
      let params = { userPopOver: true, headerData: this.header_data };
      let userPopOver = this.popoverCtrl.create('PopoverPage', params, { enableBackdropDismiss: true, cssClass: 'UserOptionPopOver' });
      userPopOver.present({
        ev: myEvent
      });
    } catch (error) {
      this.logger.log(this.fileName, 'openUserPopOver', error);
    }
  }


  /**
   *01-11-2018 Radheshyam kumar
   *This method show confirm alert if user has unsaved data.
   * @memberof CustomHeaderPage
   */
  setBackButtonAction() {
    this.navBar.backButtonClick = (ev: UIEvent) => {
      let navHistory = this.navCtrl['_linker']['_history'];
      let currentPage: string = navHistory[navHistory.length - 1];
      let lastPage: string = navHistory[navHistory.length - 2];
      if(currentPage.startsWith("/user-preferences") && lastPage.startsWith("/sdr-tabs") && this.valueService.getCurrentReport() && this.valueService.getCurrentReport().REPORTSTATUS >= Enums.ReportStatus.DeviceSelected) {
        this.navCtrl.setRoot("SdrTabsPage");
      } else {
        this.app.getRootNav().pop();
      }
    };
  }

  enableAppUpdate() {
    let msg = "Applying the update means that the app will restart. Ensure all work is completed before applying an update. Would you like to update?"
    let alert = this.utilityProvider.confirmationAlert(this.translateService.instant('Apply Update?'), this.translateService.instant(msg));
    alert.present();
    alert.onDidDismiss((response) => {
      if (response) {
        this.utilityProvider.downloadNewVersionFile().then((res: any) => {
        }).catch((err) => {
          this.logger.log(this.fileName, 'enableAppUpdate', "Error in extractSoftupdateZip of FileUpdater : " + JSON.stringify(err));
          return Promise.reject(err);
        });
      }
    });
  }

  displayErrors() {
    
    let params = {
      "errMsg": this.syncProvider.errors,
      "checkTask": Enums.ErrorHandlingStatus.sync
    }
    let syncErrorModal = this.utilityProvider.showModal("SyncErrorModalPage", params, { enableBackdropDismiss: false, cssClass: 'SyncErrorModalPage' });
    syncErrorModal.onDidDismiss((data) => {
      if (data == true) {
        this.logger.log("Error PopOver", 'syncInterrupt', "There is a sync interuption");
      }
    });
    
    if(this.syncProvider.errors){
      syncErrorModal.present();
    }else{
      this.logger.log("Error PopOver", 'syncInterrupt', "There is a on Fly Error Pop-up at cus");
    }  
  }

}
