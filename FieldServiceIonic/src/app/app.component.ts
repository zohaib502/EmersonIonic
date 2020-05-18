import { Component, ViewChild, ElementRef } from '@angular/core';
import { Nav, Platform, Events, ToastController, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseProvider } from '../providers/database/database';
import { ValueProvider } from '../providers/value/value';
import { UtilityProvider } from '../providers/utility/utility';
import { LocalServiceProvider } from '../providers/local-service/local-service';
import { CloudService } from '../providers/cloud-service/cloud-service';
import { LoggerProvider } from '../providers/logger/logger';
import { CustomerDbProvider } from '../providers/customer-db/customer-db'
import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Device } from '@ionic-native/device';
import { SyncProvider } from '../providers/sync/sync';
import { File } from '@ionic-native/file';
import { BackgroundMode } from '@ionic-native/background-mode';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy';
import * as Enums from '../enums/enums';
import { FileUpdaterProvider } from "../providers/file-updater/file-updater";

declare var cordova: any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('someInput') someInput: ElementRef;
  activePage: any = '';
  fileName: any = "MyApp";
  public appVersion: any;
  module: any;
  filteredLogList: any;
  rootPage: any;
  permissions: any;
  public buttonClicked: boolean = false;
  Enums: any = Enums;
  updateInProgress: boolean = false;
  localSoftVersion = "";
  // updatesAvailable: boolean = false;

  pages: Array<{ title: string, component: any, imageNotActivePath: string, imageActivePath: string, class: string }>;
  footerPages: Array<{ title: string, component: any, imageNotActivePath: string, imageActivePath: string, class: string }>;

  constructor(public fileUpdater: FileUpdaterProvider, public file: File, private backgroundMode: BackgroundMode, public cloudProvider: CloudService, public syncProvider: SyncProvider, public events: Events, public platform: Platform, public statusBar: StatusBar, public valueProvider: ValueProvider, public logger: LoggerProvider, public utilityProvider: UtilityProvider, public localService: LocalServiceProvider, public splashScreen: SplashScreen, public database: DatabaseProvider, private translateService: TranslateService, public storage: Storage, public toastController: ToastController, public appVersionUtil: AppVersion, private screenOrientation: ScreenOrientation, public device: Device, public app: App, public customerDBProvider: CustomerDbProvider, public sqLiteCopyDb: SqliteDbCopy, public alertCtrl: AlertController) {
    this.initializeApp();
    this.storage.get('loginresponse').then((val) => {
      if (val) {
        this.valueProvider.setPermissions(val.Permissions);
        this.valueProvider.setaccsToken("Basic " + val.accsToken);

      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'constructor', 'Error in Storage.get : ' + JSON.stringify(err));
    });
    this.storage.get('Last_Updated_MST_Customer').then((Last_Updated_MST_Customer) => {
      if (Last_Updated_MST_Customer) {
        this.valueProvider.setLast_Updated_MST_Customer(Last_Updated_MST_Customer);
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'constructor', 'Error in Storage.get : ' + JSON.stringify(err));
    })
    this.storage.get('Last_Updated_Lookups').then((Last_Updated_Lookups) => {
      if (Last_Updated_Lookups) {
        this.valueProvider.setLast_Updated_Lookups(Last_Updated_Lookups);
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'constructor', 'Error in Storage.get : ' + JSON.stringify(err));
    })

    //this.autoSyncAfter30Min();
    // Technician Pages
    let FieldJob = { title: 'Field Jobs', component: "FieldJobListPage", imageNotActivePath: 'assets/imgs/icons/Nav-helmet-icon.png', imageActivePath: 'assets/imgs/icons/Nav-helmet-icon-active.png', class: 'nav-drawer-icon-fieldJob' };
    let Calendar = { title: 'Calendar', component: "CalendarPage", imageNotActivePath: 'assets/imgs/icons/cal-icon.png', imageActivePath: 'assets/imgs/icons/cal-icon-active.png', class: 'nav-drawer-icon-calendar' };
    let Feedback = { title: 'Feedback', component: "FeedbackPage", imageNotActivePath: 'assets/imgs/icons/ic_speech-bubbles.png', imageActivePath: 'assets/imgs/icons/ic_speech-bubbles-active.png', class: 'nav-drawer-icon-feedback' };
    let Debrief = { title: 'Debrief', component: "DebriefPage", imageNotActivePath: 'assets/imgs/icons/Debrief-icon.png', imageActivePath: 'assets/imgs/icons/Debrief-icon-active.png', class: 'nav-drawer-icon-debrief' };
    //03/12/2019 Preeti Varshney added time page in navigation menu
    let Time = { title: 'Time', component: "timesheetclaritypage", imageNotActivePath: 'assets/imgs/icons/timesheet-icon.png', imageActivePath: 'assets/imgs/icons/timesheet-icon-active.png', class: 'nav-drawer-icon-calendar' }

    // 12/30/2018 -- Mayur Varshney -- Show SDR Icon if user continue to SDR flow
    let SDR = { title: 'SDR', component: "SdrTabsPage", imageNotActivePath: 'assets/imgs/icons/Debrief-icon.png', imageActivePath: 'assets/imgs/icons/Debrief-icon-active.png', class: 'nav-drawer-icon-debrief' };
    let Exit = { title: 'Exit', component: "LoginPage", imageNotActivePath: 'assets/imgs/icons/logout.png', imageActivePath: 'assets/imgs/icons/logout.png', class: 'nav-drawer-icon-logout' };
    let Home = { title: 'Field Service', component: "FieldJobListPage", imageNotActivePath: 'assets/imgs/icons/ic_leave-admin.png', imageActivePath: 'assets/imgs/icons/ic_leave-admin.png', class: 'nav-drawer-icon-home' };

    // Admin Pages
    let Language = { title: 'Language', component: "LanguagesPage", imageNotActivePath: 'assets/imgs/icons/ic_nav-languages.png', imageActivePath: 'assets/imgs/icons/ic_nav-languages-active.png', class: 'nav-drawer-icon-location' };
    let Locations = { title: 'Locations', component: "AddressPage", imageNotActivePath: 'assets/imgs/icons/ic_nav-location.png', imageActivePath: 'assets/imgs/icons/ic_nav-location-active.png', class: 'nav-drawer-icon-location' };
    let AdminFeedback = { title: 'Admin Feedback', component: "AdminFeedbackPage", imageNotActivePath: 'assets/imgs/icons/ic_speech-bubbles.png', imageActivePath: 'assets/imgs/icons/ic_speech-bubbles-active.png', class: 'nav-drawer-icon-feedback' };
    let Report = { title: 'Report', component: "ReportPage", imageNotActivePath: 'assets/imgs/icons/ic_admin_analytics.png', imageActivePath: 'assets/imgs/icons/ic_admin_analytics_active.png', class: 'nav-drawer-icon-report' };
    //11-10-2018 Prateek Created manageusers page and navigate to corresponding page 
    let ManageUsers = { title: 'Manage Users', component: "UserManagementPage", imageNotActivePath: 'assets/imgs/icons/user_mgmt.png', imageActivePath: 'assets/imgs/icons/user_mgmt_active.png', class: 'nav-drawer-icon-report' };
    let Admin = { title: 'Admin', component: "LanguagesPage", imageNotActivePath: 'assets/imgs/icons/ic_admin-alt.png', imageActivePath: 'assets/imgs/icons/ic_admin-alt-active.png', class: 'nav-drawer-icon-admin' };
    //09-20-2018 Shivansh Created to show Admin on the front page and navigate to corresponding page based on permissions 
    let AdminLocation = { title: 'Admin', component: "AddressPage", imageNotActivePath: 'assets/imgs/icons/ic_admin-alt.png', imageActivePath: 'assets/imgs/icons/ic_admin-alt-active.png', class: 'nav-drawer-icon-admin' };
    let AdminFeedBackOnPermission = { title: 'Admin', component: "LanguagesPage", imageNotActivePath: 'assets/imgs/icons/ic_admin-alt.png', imageActivePath: 'assets/imgs/icons/ic_admin-alt-active.png', class: 'nav-drawer-icon-admin' };
    let AdminReport = { title: 'Admin', component: "ReportPage", imageNotActivePath: 'assets/imgs/icons/ic_admin_analytics.png', imageActivePath: 'assets/imgs/icons/ic_admin_analytics_active.png', class: 'nav-drawer-icon-report' };
    // 01-24-2019 -- Mansi Arora -- timezone page
    let TimeZone = { title: 'Timezone', component: "TimezonePage", imageNotActivePath: 'assets/imgs/icons/timezone-inactive.png', imageActivePath: 'assets/imgs/icons/timezone-active.png', class: 'nav-drawer-icon-location' };
    //this.pages = [];UserManagementPage
    //this.pages.push(FieldJob, Calendar, Feedback, Exit);

    // let UpdateExample = { title: 'Update Example', component: "UpdateExamplePage", imageNotActivePath: 'assets/imgs/icons/timezone-inactive.png', imageActivePath: 'assets/imgs/icons/timezone-active.png', class: 'nav-drawer-icon-location' };

    this.platform.ready().then((readySource) => {
      if (this.platform.is('cordova')) {
        appVersionUtil.getVersionNumber().then((res) => {
          // 12-31-2018 -- Mansi Arora -- Change in format while logging app version
          this.logger.log(this.fileName, 'constructor', "appVersion ==> " + this.fileUpdater.localDBConfig.softVersion);
          this.appVersion = res;
          this.utilityProvider.setAppVersion(this.appVersion);
        }).catch((error: any) => {
          this.logger.log(this.fileName, 'constructor', 'Error in getVersionNumber : ' + JSON.stringify(error));
        });
        // 12-31-2018 -- Mansi Arora -- Removed app version log as the variable is always undefined outside the getVersionNumber()

        this.localSoftVersion = this.fileUpdater.localDBConfig.softVersion;
      } else {
      }

    }).catch((error: any) => {
      this.logger.log(this.fileName, 'constructor', 'Error in ready : ' + JSON.stringify(error));
    });



    this.fileUpdater.onLocalDBConfigUpdated.subscribe(res => {
      this.localSoftVersion = this.fileUpdater.localDBConfig.softVersion;
    });

    /**
     *07/08/18 - Suraj - Remove Android platform specification for Exit App
     * Event - generate side menu based on User's role.
     */
    events.subscribe('user:created', (page) => {
      this.activePage = page;
      this.permissions = this.valueProvider.getPermissions();
      this.pages = (this.permissions.CreateStandaloneJob || this.permissions.DebriefOSCJob) ? [FieldJob, Calendar] : [FieldJob];

      let devicePlatform = this.device.platform.toLowerCase();
      if (this.valueProvider.checkAdminPermissions()) {

        switch (this.activePage) {
          case "fieldJobOverView":
          case "Debrief":
            //09-20-2018 --Shivansh Added permissions check and then pushing based on them
            this.pages.push(Debrief);
            this.pages.push(Feedback);
            //03/12/2019 Preeti Varshney added time page in navigation menu
            // this.pages.push(Time);
            this.showTimeTab(Time);
            if (this.valueProvider.checkAdminPermissions()) {
              if (this.valueProvider.languagePermissions()) {
                this.pages.push(Admin);
              }
              else if (this.valueProvider.locationPermissions()) {
                this.pages.push(AdminLocation)
              }
              else if (this.permissions.ManageFeedbacks) {
                this.pages.push(AdminFeedBackOnPermission);
              } else if (this.permissions.ViewReport) {
                this.pages.push(AdminReport);
              }
            }
            devicePlatform == "windows" ? this.pages.push(Exit) : null;
            break;
          // 12/30/2018 -- Mayur Varshney -- Apply check if flow is SDR
          case "SDR":
            this.pages.push(SDR);
            this.pages.push(Feedback);
            //03/12/2019 Preeti Varshney added time page in navigation menu
            //this.pages.push(Time);
            this.showTimeTab(Time);
            if (this.valueProvider.checkAdminPermissions()) {
              if (this.valueProvider.languagePermissions()) {
                this.pages.push(Admin);
              }
              else if (this.valueProvider.locationPermissions()) {
                this.pages.push(AdminLocation)
              }
              else if (this.permissions.ManageFeedbacks) {
                this.pages.push(AdminFeedBackOnPermission);
              } else if (this.permissions.ViewReport) {
                this.pages.push(AdminReport);
              }
            }
            devicePlatform == "windows" ? this.pages.push(Exit) : null;
            break;
          default:
            if (this.module == 'adminModule') {
              this.clearPages();
              this.footerPages.push(Home);

              // 09-13-2018 -- Mayur Varshney -- push Report Page
              //this.pages.push(Language, Locations, AdminFeedback, Report, Exit);
              //09-20-2018 --Shivansh Added permissions check and then pushing based on them
              if (this.valueProvider.languagePermissions()) {
                this.pages.push(Language);
              }
              if (this.valueProvider.locationPermissions()) {
                this.pages.push(Locations)
                //10-11-2018 --- Prateek --- push management page
                // this.pages.push(UserManagement);
              }

              if (this.permissions.ManageFeedbacks) {
                this.pages.push(AdminFeedback);
              } if (this.permissions.ViewReport) {
                this.pages.push(Report);
              }
              this.pages.push(ManageUsers);
              // 01-24-2019 -- Mansi Arora -- show timezone page based on permissions
              if (this.permissions.ManageTimezone) {
                this.pages.push(TimeZone);
              }
              devicePlatform == "windows" ? this.pages.push(Exit) : null;

              if (this.activePage == 'Field Jobs') {
                this.clearPages();
                //09-20-2018 --Shivansh Added permissions check and then pushing based on them
                this.pages = [FieldJob];
                //devicePlatform == "windows" ? this.pages.push(FieldJob) : this.pages.push(FieldJob);                
                if (this.permissions.CreateStandaloneJob || this.permissions.DebriefOSCJob) {
                  this.pages.push(Calendar)
                }
                this.pages.push(Feedback);
                //03/12/2019 Preeti Varshney added time page in navigation menu
                //this.pages.push(Time);
                this.showTimeTab(Time);
                if (this.valueProvider.checkAdminPermissions()) {
                  if (this.valueProvider.languagePermissions()) {
                    this.pages.push(Admin);
                  } else if (this.valueProvider.locationPermissions()) {
                    this.pages.push(AdminLocation)
                  } else if (this.permissions.ManageFeedbacks) {
                    this.pages.push(AdminFeedBackOnPermission);
                  } else if (this.permissions.ViewReport) {
                    this.pages.push(AdminReport);
                  }
                }
                this.module = '';
                devicePlatform == "windows" ? this.pages.push(Exit) : null;

              }
            }
            else {
              //09-20-2018 --Shivansh Added permissions check and then pushing based on them
              this.pages.push(Feedback)

              ////// Added Update Page
              //   this.pages.push(UpdateExample);


              //03/12/2019 Preeti Varshney added time page in navigation menu
              //this.pages.push(Time);
              this.showTimeTab(Time);
              if (this.valueProvider.checkAdminPermissions()) {
                if (this.valueProvider.languagePermissions()) {
                  this.pages.push(Admin);
                }
                else if (this.valueProvider.locationPermissions()) {
                  this.pages.push(AdminLocation)
                }
                else if (this.permissions.ManageFeedbacks) {
                  this.pages.push(AdminFeedBackOnPermission);
                } else if (this.permissions.ViewReport) {
                  this.pages.push(AdminReport);
                }
              }
              //this.pages.push(Admin);

              devicePlatform == "windows" ? this.pages.push(Exit) : null;
            }
        }
      } else {
        switch (this.activePage) {
          case "fieldJobOverView":
          case "Debrief":
            if (this.permissions.DebriefOSCJob) {
              this.pages.push(Debrief)
            }
            // devicePlatform == "windows" ? this.pages.push(Time, Feedback, Exit) : this.pages.push(Time, Feedback);
            this.showTimeTabWindows(devicePlatform, Time, Feedback, Exit);
            break;
          // 12/30/2018 -- Mayur Varshney -- show/hide icon if flow is SDR
          case "SDR":
            this.pages.push(SDR);
            // devicePlatform == "windows" ? this.pages.push(Time, Feedback, Exit) : this.pages.push(Time, Feedback);
            this.showTimeTabWindows(devicePlatform, Time, Feedback, Exit);
            break;
          default:
            // devicePlatform == "windows" ? this.pages.push(Time, Feedback, Exit) : this.pages.push(Time, Feedback);
            this.showTimeTabWindows(devicePlatform, Time, Feedback, Exit);
            break;
        }

      }
    });

    events.subscribe('setPage', (page) => {
      this.activePage = page;
      if (this.valueProvider.checkAdminPermissions()) {
        this.footerPages = [];
        this.footerPages.push(Home);

        this.pages = [];
        switch (this.device.platform.toLowerCase()) {
          case "windows":
            // 09-20-2018 -- Shivansh Permissions and pushing report page --

            if (this.valueProvider.languagePermissions()) { this.pages.push(Language) }
            if (this.valueProvider.locationPermissions()) { this.pages.push(Locations) }
            if (this.permissions.ManageFeedbacks) { this.pages.push(AdminFeedback) }
            if (this.permissions.ViewReport) { this.pages.push(Report) }
            //11-10-2018 -- Prateek Give bydefault Manageusers permission to show manage users--
            this.pages.push(ManageUsers)
            // 01-24-2019 -- Mansi Arora -- show timezone page based on permissions
            if (this.permissions.ManageTimezone) {
              this.pages.push(TimeZone);
            }
            //if (this.valueProvider.languagePermissions()) { this.pages.push(ManageUsers) }
            this.pages.push(Exit);
            break;
          case "ios":
            // 09-13-2018 -- Mayur Varshney -- push Report Page
            // this.pages.push(Language, Locations, AdminFeedback);
            //09-20-2018 --Shivansh Added permissions check and then pushing based on them
            if (this.valueProvider.languagePermissions()) { this.pages.push(Language) }
            if (this.valueProvider.locationPermissions()) { this.pages.push(Locations) }
            if (this.permissions.ManageFeedbacks) { this.pages.push(AdminFeedback) }
            if (this.permissions.ViewReport) { this.pages.push(Report) }
            this.pages.push(ManageUsers) //12-18-2018 added to access on ios
            // 01-24-2019 -- Mansi Arora -- show timezone page based on permissions
            if (this.permissions.ManageTimezone) {
              this.pages.push(TimeZone);
            }
            //this.pages.push(Exit);
            break;
        }
      }
    });

    events.subscribe('openPref', (page) => {

      if (page[page.length - 1] == '/languages' || page[page.length - 1] == '/address' || page[page.length - 1] == '/admin-feedback') {
        this.module = "adminModule";
        this.activePage = "Language";
      }
      this.app.getRootNav().push("UserPreferencesPage");
    });

    events.subscribe('appclose', () => {
      this.appClose();
    });

    // 08/30/2018 - Suraj Gorai- add events subscribe appLogout()
    events.subscribe('appLogout', () => {
      this.appLogout();
    });
    events.subscribe('forceAppLogout', () => {
      utilityProvider.showSpinner();
      this.logout();
    });

    events.subscribe('goto:page', (page) => {
      this.nav.setRoot(page);
    })
  }

  hideConnectionBar() {
    this.someInput.nativeElement.style.display = "none";
    this.buttonClicked = !this.buttonClicked;
  }

  clearPages() {
    this.footerPages = [];
    this.pages = [];
  }

  isOnline() {
    return this.utilityProvider.isConnected();
  }

  /**
   *@Prateek --02/28/2019-- Check the app version when user open app again
   */
  checkAppVersion() {
    this.valueProvider.getAppVersion().then((res: any) => {
      this.logger.log(this.fileName, 'checkAppVersion', 'DATA in checkAppVersion : ' + res);
      if (res != null) {
        this.utilityProvider.checkForVersionUpdates(res)
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'checkAppVersion', 'Error in checkAppVersion : ' + JSON.stringify(error));
    });
  }


  initializeApp() {
    this.platform.ready().then(() => {
      // var filePath = (<any>window).cordova.file.dataDirectory;
      if (this.platform.is('cordova')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY);
        let devicePlatform = this.device.platform.toLowerCase();
        if (devicePlatform == 'windows') {
          (<any>window).cordova.plugins.UWPBackbutton.hideBackbutton();
        }
      };
      this.statusBar.styleDefault();
      this.utilityProvider.createDir(cordova.file.dataDirectory, 'logs');
      this.fileUpdater.getAllDataFromLocalDB().then((localDBConfig: any) => {
        if (this.platform.is('ios')) {
          this.utilityProvider.checkDirIfExist(this.file.dataDirectory, localDBConfig.softVersion).then(res => {
            if (res) {
              console.log("COPY FROM newSoftVersion");
              this.sqLiteCopyDb.copyDbFromStorage(this.database.getVersionDbName(), 0, this.file.dataDirectory + localDBConfig.softVersion + '/' + this.database.getVersionDbName(), true).then(res => {
              });
            }
            else {
              console.log("COPY FROM www");
              this.sqLiteCopyDb.copy(this.database.getVersionDbName(), 0);
            }
            this.storage.get('isDataBaseCopied').then(result => {
              if (!result) {
                this.sqLiteCopyDb.copy(this.database.getDbName(), 0).then(res => {
                  this.storage.set("isDataBaseCopied", true);
                  setTimeout(() => { this.appInit(); }, 3000);
                });
              } else {
                this.logger.log(this.fileName, 'initializeApp-->INSIDE IOS PLATFORM-->', "Do Not Copy Database");
                setTimeout(() => { this.appInit(); }, 3000);
              }
            });
          });

        }
        else {
          this.database.getVersionDB().close(success => {
            this.file.removeFile(this.file.dataDirectory, "versionDB.sqlite").then((res) => {
              this.utilityProvider.checkDirIfExist(this.file.dataDirectory, localDBConfig.softVersion).then(res => {
                if (res) {
                  console.log("COPY FROM newSoftVersion")
                  this.file.copyFile(this.file.dataDirectory + localDBConfig.softVersion + '/', this.database.getVersionDbName(), this.file.dataDirectory, this.database.getVersionDbName());
                }
                else {
                  console.log("COPY FROM www")
                  this.file.copyFile(cordova.file.applicationDirectory + "/www/", this.database.getVersionDbName(), this.file.dataDirectory, this.database.getVersionDbName());
                }
                this.utilityProvider.checkFileIfExist(cordova.file.dataDirectory, "emerson.sqlite").then(res => {
                  // 01/07/2019 Zohaib Khan: If emerson.sqlite not exist than copy the emerson.sqlite file from assets/data to AppDirectory. And execute all queries from version database if any and initialize app.
                  if (!res) {
                    this.file.copyFile(cordova.file.applicationDirectory + "/www/", this.database.getDbName(), this.file.dataDirectory, this.database.getDbName()).then(res => {
                      setTimeout(() => { this.appInit(); }, 3000);
                    });
                  } else {
                    // 01/07/2019 Zohaib Khan: if emerson.sqlite already exists than initialize app.
                    setTimeout(() => { this.appInit(); }, 3000);
                  }
                });
              });
            });
          });
        }
      });
      // this.database.initDB().then(() => {
      // });
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'initializeApp', 'Error in ready: ' + JSON.stringify(err));
    });
  }

  appInit() {
    //  08/07/2018 Zohaib Khan: Called createDir method to create the directory with the name of srfiles
    this.utilityProvider.createDir(cordova.file.dataDirectory, 'srfiles');
    //  08/10/2018 Zohaib Khan: Called createDir method to create the directory with the name of taskfiles
    this.utilityProvider.createDir(cordova.file.dataDirectory, 'taskfiles');
    this.utilityProvider.createDir(cordova.file.dataDirectory, 'reportfiles');
    this.utilityProvider.createDir(cordova.file.dataDirectory, 'detailednotesfiles');
    //  08/13/2018 Zohaib Khan: Called createDir method to create the directory with the name of  temp
    this.utilityProvider.createDir(cordova.file.dataDirectory, 'temp');
    this.utilityProvider.copyDir('www/assets/i18n', 'lang').then((res) => {
      this.utilityProvider.copyDir('www/assets/icon', 'icons').then((res) => {
        setTimeout(() => {
          this.splashScreen.hide();
          // this.logger.log(this.fileName, 'initializeApp', 'Hiding Splash screen');
          //07/31/2018 Zohaib Khan: listDir method is getting the list of all files created in Logs directory
          this.logger.cleanUpPreviousLogs("logs");
        }, 3000);
        this.translateService.setDefaultLang('en-gb');
        this.translateService.use('en-gb');
        this.cloudProvider.getOfflineAnalytics();
        this.localService.offLineLogin().then((success) => {
          //09/28/2018 Suraj Gorai: if user loged in in app then only getOfflineAnalytics() call. 
          if (success) {
            this.syncProvider.isUserLoggedIn =  true;
            //08/15/2018 Zohaib Khan: 30min logic implimented on App Start.
            this.syncProvider.performSyncAppStart();
            this.translateService.use(this.valueProvider.getSelectedLang() ? this.valueProvider.getSelectedLang() : 'en-gb');
            // 08/28/2018 Gurkirat Singh: Set Initial Online Time
            this.utilityProvider.setLastOnlineTime(new Date());
            this.utilityProvider.subscribeToPauseAndResumeEvent();
            try {
              // 08/28/2018 Gurkirat Singh: Enable Background mode to stop app from sleeping
              this.backgroundMode.enable();
            } catch (error) {
              this.logger.log(this.fileName, 'initializeApp', 'Error in try/catch : ' + JSON.stringify(error));
            }
            // 01/07/2019 Zohaib Khan: Updating emerson.sqlite if verionDb's version is greater than emerson.sqlite Version. 
            // this.database.updateCurrentDatabase().then((res: any) => {
            //   this.logger.log(this.fileName, 'initializeApp', 'Error in updateCurrentDatabase : ' + res);
            this.database.updateCurrentDatabase().then(res => {
              console.log(res);
              this.nav.push("FieldJobListPage");
            });

            //  });
          } else {
            this.database.updateCurrentDatabase().then(res => {
              console.log(res);
              this.nav.push("LoginPage");
            });

          }
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'initializeApp', 'Error in offLineLogin: ' + JSON.stringify(err));
        });
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'initializeApp', 'Error in copyDir icon: ' + JSON.stringify(err));
      });
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'initializeApp', 'Error in copyDir lang: ' + JSON.stringify(err));
    });

    this.customerDBProvider.initCustomerDB();
    // }).catch((err: any) => {
    //   this.logger.log(this.fileName, 'initializeApp', 'Error in initDB: ' + JSON.stringify(err));
    // });
    this.isOnline();
    this.checkAppVersion()
  }

  fieldJob() {
    this.nav.setRoot("FieldJobListPage");
  }

  appClose() {
    this.utilityProvider.showSpinner();
    switch (this.device.platform.toLowerCase()) {
      case "windows":
        window.close();
        break;
      case "android":
        this.platform.exitApp()
        break;
    }
  }


  /**
   *  08/30/2018 - Suraj Gorai- appLogout function if user logout if app is online then it remove deveice token from DBCS
   * @memberOf appLogout
   */
  async appLogout() {
    this.utilityProvider.showSpinner();
    try {
      if(this.utilityProvider.isConnected()) {
        let result = await this.syncProvider.validateUserDeviceAndToken();
        if(result) {
          await this.cloudProvider.updateUUID('logout');
          this.logout();
        }
      } else {
        this.logout();
      }
    } catch(error) {
      this.logger.log(this.fileName, 'appLogout', 'Error: ' + error.message);
      this.logout();
    } finally {
      this.utilityProvider.stopSpinner();
    }
  }

  /** 
   *  08/30/2018 - Suraj Gorai- logout function 
   * clear basic information form localService,cloudProvider and application close in windows platform and application setRoot to "LoginPage" in iOS   platform
   * @memberOf logout
   */
  async logout() {
    try {
      // 10/08/2018 -- Mayur Varshney -- Log Events during logout
      this.utilityProvider.endCurrentSession();
      // 04/06/2018 -- Mayur Varshney -- flushAnalytics before logout
      this.cloudProvider.flushAnalyticsEvents();
      this.syncProvider.isAutoSyncing = false;
      this.syncProvider.isUserLoggedIn = false;
      let userObject = {
        'ID': this.valueProvider.getUser().ID,
        'Login_Status': "0"
      };
      this.cloudProvider.logout();
      await this.localService.updateUser(userObject);
      this.valueProvider.setTaskList([]);
      // 10/08/2018 -- Suraj Gorai -- remove specific column data from ionicStorage(remove all column except analytics)
      await this.storage.remove('loginresponse');
      await this.storage.remove('expiredata');
      this.app.getRootNav().setRoot('LoginPage');
      this.removeAllThePopovers();
    } catch(error) {
      this.logger.log(this.fileName, 'logout', 'Error: ' + error.message);
    } finally {
      this.utilityProvider.stopSpinner();
    }
  }

  // to remove all popovers / select box / modal after logout 
  removeAllThePopovers() {
    try {
      // This will hide all the pop overs
      let elem: any = document.querySelector('.popover-wrapper');
      if (elem && elem.style) elem.style.display = 'none';
      Array.from(document.getElementsByClassName("closebtn")).forEach((el: any) => { if (el && el.click) el.click(); });
      Array.from(document.querySelector('ion-popover').childNodes).forEach((el: any) => { if (el && el.click) el.click(); });
      Array.from(document.querySelector('ion-modal').childNodes).forEach((el: any) => { if (el && el.click) el.click(); });
    } catch(error) {
      this.logger.log(this.fileName, 'removeAllThePopovers', 'Error: ' + error.message);
    }
  }

  calendar() {
    if (this.nav.getActive().name == "UserPreferencesPage") {
      this.nav.setRoot("CalendarPage");
    } else {
      this.nav.push("CalendarPage");
    }
  }

  feedback() {
    // -- 09/19/2018 -- Mayur Varshney -- change nav from push to setRoot
    this.nav.setRoot("FeedbackPage");
  }

  userManagement() {
    // -- 09/19/2018 -- Mayur Varshney -- change nav from push to setRoot
    this.nav.setRoot("UsermanagementPage");
    this.activePage = 'ManageUsers';
  }
  report() {
    if (this.utilityProvider.isConnected()) {
      // -- 09/19/2018 -- Mayur Varshney -- change nav from push to setRoot
      this.nav.setRoot("ReportPage");
    } else {
      let msg = 'Analytic Reports can be generated only in Online mode';
      this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
    }
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    switch (page.component.toLowerCase()) {
      case "loginpage":
        // if (this.valueProvider.getHeaderNav()) {
        //   this.utilityProvider.confirmAlert(page.component);
        // } else {
        this.appClose();
        // }

        break;
      case "calenderpage":
        this.calendar();
        break;
      case "feedbackpage":
        this.feedback();
        break;
      //03/12/2019 Preeti Varshney added time page case
      case "timesheetclaritypage":
        this.time();
        break;
      // -- 09/19/2018 -- Mayur Varshney -- add report page case
      case "reportpage":
        this.report();
        break;

      case "languagespage":
        this.adminPages(page.component);
        break;

      case "adminfeedbackpage":
        this.adminPages(page.component);
        break;

      case "addresspage":
        this.adminPages(page.component);
        break;

      case "usermanagementpage":
        this.adminPages(page.component);
        break;

      case "timezonepage":
        this.adminPages(page.component);
        break;


      default:
        // if (this.valueProvider.getHeaderNav()) {
        //   this.utilityProvider.confirmAlert(page.component);
        // } else {
        this.nav.setRoot(page.component);
      // }
    }
  }

  adminPages(component) {
    if (this.utilityProvider.isConnected()) {
      this.nav.setRoot(component);
    } else {
      let msg = 'This page is only accessible in Online mode';
      this.utilityProvider.presentToast(msg, 3000, 'top', 'feedbackToast');
    }
  }

  debrief() {
    this.nav.push("DebriefPage");
  }
  //03/12/2019 Preeti Varshney added time page 
  time() {
    this.valueProvider.continueDebrief = false;
    if (this.valueProvider.getUser().ClarityID != '') {
      this.nav.setRoot("ClarityTimelistPage");
    } else {
      this.nav.setRoot("TimeNonclaritylistPage");
    }
  }

  showTimeTab(Time) {
    this.pages.push(Time);
    // if (this.valueProvider.getResourceId() == '0') {
    //   this.pages.push(Time);
    // }
  }

  showTimeTabWindows(devicePlatform, Time, Feedback, Exit) {
    devicePlatform == "windows" ? this.pages.push(Time, Feedback, Exit) : this.pages.push(Time, Feedback);
    // if (this.valueProvider.getResourceId() == '0') {
    //   devicePlatform == "windows" ? this.pages.push(Time, Feedback, Exit) : this.pages.push(Time, Feedback);
    // } else {
    //   devicePlatform == "windows" ? this.pages.push(Feedback, Exit) : this.pages.push(Feedback);
    // }
  }


}
