import { Component } from '@angular/core';
import { NavController, MenuController, Events, Platform, IonicPage } from 'ionic-angular';
import { CloudService } from '../../providers/cloud-service/cloud-service';
import { UtilityProvider } from '../../providers/utility/utility';
import { ValueProvider } from '../../providers/value/value';
import { SyncProvider } from '../../providers/sync/sync';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version';
import { ModalController } from 'ionic-angular';
import { CreateFsrProvider } from '../../providers/create-fsr/create-fsr';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Device } from '@ionic-native/device';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { FileUpdaterProvider } from "../../providers/file-updater/file-updater";
import { LocalServiceSdrProvider } from '../../providers/local-service-sdr/local-service-sdr';
import * as Enums from '../../enums/enums';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  fileName: any = 'Login_Page';
  public username: any = '';
  public password: any = '';
  public appVersion: any;
  loginError: boolean = false;
  loginProcess: boolean = false;
  loginErrorMsg: string;
  localSoftVersion = "";


  constructor(public localServiceSdr: LocalServiceSdrProvider, public network: Network, public events: Events, private fileUpdater: FileUpdaterProvider, private backgroundMode: BackgroundMode, public fsrprovider: CreateFsrProvider, public menuController: MenuController, public navCtrl: NavController, public syncProvider: SyncProvider, public localService: LocalServiceProvider, public modalCtrl: ModalController, public plt: Platform, public appVersionUtil: AppVersion, public valueProvider: ValueProvider, public cloudService: CloudService, public translateService: TranslateService, public utilityProvider: UtilityProvider, public logger: LoggerProvider, public storage: Storage, public cloudProvider: CloudService, public device: Device) {
    // , private iab: InAppBrowser
    this.plt.ready().then(() => {
      this.localSoftVersion = this.fileUpdater.localDBConfig.softVersion;


      if (this.plt.is('cordova')) {
        appVersionUtil.getVersionNumber().then((res) => {
          // 12-31-2018 -- Mansi Arora -- Change in format while logging app version
          this.logger.log(this.fileName, 'constructor', "appVersion ==> " + this.fileUpdater.localDBConfig.softVersion);
          this.appVersion = res;
        }).catch((error: any) => {
          this.logger.log(this.fileName, 'constructor', 'Error in getVersionNumber : ' + JSON.stringify(error));
        });
        // 12-31-2018 -- Mansi Arora -- Removed app version log as the variable is always undefined outside the getVersionNumber()
      } else {
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'constructor', 'Error in ready : ' + JSON.stringify(error));
    });

    this.network.onDisconnect().subscribe(() => {
      this.utilityProvider.stopSpinner();
      this.loginProcess = false;
    });

    this.fileUpdater.onLocalDBConfigUpdated.subscribe(res => {
      this.localSoftVersion = this.fileUpdater.localDBConfig.softVersion;
    });
  }

  ionViewDidEnter() {
    this.menuController.enable(false);
    // this.username ="shivansh.subnani";
    // this.password ="Sfb@2019";
    // this.login();
    // 09-12-18 Suraj Gorai --OKTA inappbrowser code remove, now we use OKTA JWT process
    // this.storage.get('logintoken').then((token) => {
    //   if (token == null) {
    //     this.openwebpage();
    //   }
    // }).catch((error: any) => {
    //   this.logger.log(this.fileName, 'ionViewDidEnter', 'Error in ionViewDidEnter : ' + JSON.stringify(error));
    // });
  }

  /**
   * 09-12-18 Suraj Gorai --OKTA inappbrowser code remove, now we use OKTA JWT process
   * @memberOf LoginPage
   */
  login() {
    this.syncProvider.isAutoSyncing = false;
    //this.logger.log(this.fileName, 'login', this.username + this.password);
    if (!this.username || !this.password) {
      this.loginError = true;
      // this.errorIn = "";
      this.loginErrorMsg = "Username And Password Is Required."
    }
    else {
      try {
        if (this.utilityProvider.isConnected()) {
          this.utilityProvider.showSpinner();
          this.onlineLogin();
        } else {
          // this.offlineLogin();
          this.utilityProvider.stopSpinner();
          this.utilityProvider.presentToast('Unable to login in offline mode!!!', 4000, 'top', '');
        }
      } catch (err) {
        this.logger.log(this.fileName, 'login', "Error login: " + JSON.stringify(err));
        this.loginError = true;
        this.utilityProvider.stopSpinner();
      }
    }
    // }).catch((err: any) => {
    //   this.logger.log(this.fileName, "login", 'Error in SyncLoader:' + JSON.stringify(err));
    // });
  }

  /**
   * 09-12-18 Suraj Gorai -- code changes based on OKTA JWT token process, Remove SSO token
   *
   * @memberOf LoginPage
   */
  //errorIn: any;
  onlineLogin() {
    let self = this;
    this.loginProcess = true;
    try {
      this.valueProvider.setUsername(this.username);
      this.cloudService.login(this.username, this.password).then((loginResponse: any) => {
        let userDetail = {
          'WorldAreaID': loginResponse.data.WorldAreaID,
          'userClarityID': loginResponse.data.ClarityID
        }
        // 05/08/2019 Gurkirat Singh: Removed setWorldAreaId, as it would set in the UserPreference Object in value provider.
        // this.valueProvider.setWorldAreaId(loginResponse.data.WorldAreaID);
        this.valueProvider.setaccsToken("Basic " + loginResponse.data.accsToken);
        //console.log("ACSS_TOKEN", loginResponse.data.accsToken)
        this.password = '';
        if (Object.keys(loginResponse.data.Permissions).length > 0) {
          if (loginResponse.statusCode == 401) {
            this.utilityProvider.stopSpinner();
            this.utilityProvider.presentToast('Unable to connect to Oracle Service Cloud. Authentication error', 10000, 'top', '');
            self.logger.log(self.fileName, 'onlineLogin', "Server Error: 401 Error " + JSON.stringify(loginResponse));
          } else if (loginResponse.statusCode == 500) {
            this.utilityProvider.stopSpinner();
            this.utilityProvider.presentToast('Unable to connect to Oracle Service Cloud. Please contact your administrator.', 10000, 'top', '');
            self.logger.log(self.fileName, 'onlineLogin', "Server Error: 500 Error " + +JSON.stringify(loginResponse));
          } else {
            let loginData = loginResponse ? loginResponse.data : null;
            this.storage.set('loginresponse', loginData);//.then(() => { });
            //09/19/18 Suraj Gorai - Store refresh and expire time in storage for future use
            let expiredata: {} = {
              'expiretime': Date.now() + (loginData.expires_in * 1000),
              'refreshtoken': loginData.refresh_token,
              'useremail': loginData.email.toLowerCase()
            }
            this.storage.set('expiredata', expiredata);
            if (loginResponse.data.alreadyLoggedIn) {
              let params = {}
              let deviceCheckPermission = this.utilityProvider.showModal("CheckdeviceModalPage", params, { enableBackdropDismiss: false, cssClass: 'CheckdeviceModal' });
              deviceCheckPermission.onDidDismiss((permission) => {
                if (permission == true) {
                  self.logger.log(self.fileName, 'deviceCheckPermission', "User give permission to logout from another device");
                  this.cloudService.updateUUID('update').then((res: any) => {
                    // self.logger.log(self.fileName, 'onlineLogin > updateUUID', res);
                    this.loginContinue(loginResponse, userDetail);
                  }).catch((err: any) => {
                    this.loginProcess = false;
                    this.logger.log(this.fileName, 'onlineLogin', 'Error in updateUUID : ' + JSON.stringify(err));
                    this.utilityProvider.stopSpinner();
                  });
                } else {
                  this.logger.log(this.fileName, 'onlineLogin', 'User decline new device login');
                  this.loginProcess = false;
                  this.utilityProvider.stopSpinner();
                }
              });
              deviceCheckPermission.present();
            } else {
              this.loginContinue(loginResponse, userDetail);
            }
          }
        } else {
          self.logger.log(self.fileName, 'deviceCheckPermission', "User don't have permission to login in App");
          this.loginProcess = false;
          this.utilityProvider.stopSpinner();
          this.utilityProvider.presentToast("You don't have permission to use the Field service Application.", '10000', 'top', '');
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'onlineLogin', 'Error in login' + JSON.stringify(error));

        //Prateek(25/01/2019) Implemented error messages according to users.
        //Prateek(15/02/2019) Code optimized for login msg using one variable instead of two.
        if (error.data) {
          if (error.data.error.errorMessage == "invalid_grant") {
            this.loginErrorMsg = "Please verify Username or Password";
          }
          else {
            this.loginErrorMsg = error.data.error.source + ":" + error.data.error.userMessage;
          }

          // switch (error.data.errorIn + (error.data.error ? "_" + error.data.error : '')) {
          //   case "Okta_invalid_grant":
          //   case "Okta_access_denied":
          //     this.loginErrorMsg = error.data.errorIn + ":" + error.data.error_description
          //     //this.errorIn = error.data.errorIn + ":"
          //     break;
          //   case "DBCS":
          //     this.loginErrorMsg = error.data.errorIn + ":" + error.data.errorCode
          //     //this.errorIn = error.data.errorIn + ":"
          //     break;
          //   default:
          //     this.loginErrorMsg = "Application: Please verify Username or Password"
          //     //this.errorIn = "Application:"
          //     break;
          // }
        } else {
          this.loginErrorMsg = "Application: Unknown Error Occurred";
          //this.errorIn = "Application";
        }
        //this.loginErrorMsg = "Unknown Error Occurred";
        this.loginError = true;
        this.loginProcess = false;
        this.utilityProvider.stopSpinner();
      });
    } catch (error) {
      this.logger.log(this.fileName, 'onlineLogin', 'Error in onlineLogin : ' + JSON.stringify(error));
      this.loginProcess = false;
      this.loginError = true;
      this.loginErrorMsg = "Please verify Username or Password"

      this.utilityProvider.stopSpinner();
    }
  }

  loginContinue(data, userDetail) {
    this.syncProvider.isAutoSyncing = false;
    let self = this;
    let response = data ? data.data : null;
    // 10-15-2018 Gurkirat Singh: Removed setUserId and set it in techprofile
    // this.valueProvider.setUserId(response.userID);
    //09-21-2018 Shivansh Set permissions in value service
    this.valueProvider.setPermissions(response.Permissions);
    //this.logger.log(this.fileName, 'onlineLogin', "Login Response: " + JSON.stringify(response));
    if (response && response.ID) {
      this.valueProvider.setResourceId(response['ID']);
      // 02-19-2019 -- Mansi Arora -- set userRoles in value provider
      this.valueProvider.setUserRoles(response['userRoles']);
      this.valueProvider.setStartSync(true);
      this.cloudService.getTechnicianProfile(this.username, response, response.userID).then((res: any) => {
        // 06-03-2019 -- Mayur Varshney -- send userdetail on login
        this.cloudProvider.updateUserDetails(this.fileUpdater.localDBConfig.softVersion, response.email).then((updateUserDetailResponse: any) => {
          let techProfile = res.data.technicianProfile[0];
          // 10-15-2018 Gurkirat Singh: Set DefaultBUID and UserID in techprofile
          techProfile.Email = response.email ? response.email.toLowerCase() : '';
          techProfile.DefaultBUID = response.DefaultBUID;
          techProfile.UserID = response.userID;
          // 01-30-2019 -- Mansi Arora -- insert country, state, city and zipcode while creating user
          // 01-31-2019 -- Mansi Arora -- country, state, city, zipcode default value null
          techProfile.country = response.country ? response.country : null;
          techProfile.state = response.state ? response.state : null;
          techProfile.city = response.city ? response.city : null;
          techProfile.zipcode = response.zipCode ? response.zipCode : null;
          techProfile.zipcode = response.zipCode ? response.zipCode : null;
          //self.logger.log(this.fileName, 'onlineLogin', "Tech Profile: " + JSON.stringify(techProfile));
          self.insertUser(techProfile, userDetail).then((response: any) => {
            //self.logger.log(self.fileName, 'onlineLogin', "USER =====> " + JSON.stringify(response));
            response.forEach((item) => {
              if (item.Login_Status == "1") {
                self.valueProvider.setUser(item);
                self.setDataToUserPreferences().then((res) => {
                  //self.logger.log(self.fileName, 'onlineLogin', "USER =====> " + JSON.stringify(response));
                  // self.valueProvider.setUserRoles(item.userRole);
                  self.valueProvider.setLastUpdated(new Date(self.valueProvider.getUser().Last_Updated).getTime());
                  self.utilityProvider.stopSpinner();
                  self.initEventsForAnalytics();
                  self.navCtrl.setRoot("FieldJobListPage", { "sync_type": 0, sync: "Login" });
                  // 07/23/2018 Gurkirat Singh -- Invoke Sync on Login through events
                  // 08/24/2018 kamal passed isLogin true inside scheduleSync when login first time with any user
                  this.syncProvider.isUserLoggedIn = true;
                  self.syncProvider.scheduleSync(true);
                  this.setTaskNameNA();
                }).catch((err: any) => {
                  this.logger.log(this.fileName, 'loginContinue', 'Error in setDataToUserPreferences : ' + JSON.stringify(err));
                });
                // 02-22-2019 -- Prateek -- log analytics for login activity optimized code
                let eventData = {};
                this.cloudProvider.logCustomEvent("LoginActivity", eventData).then(() => {
                  this.logger.log(this.fileName, "loginContinue", 'loginActivity custom event logged successfully')
                  this.cloudProvider.flushAnalyticsEvents();
                }).catch((err: any) => {
                  this.logger.log(this.fileName, 'logLoginAcivity', 'Error in logCustomEvent : ' + JSON.stringify(err));
                });
              }
            });
          }).catch((error: any) => {
            self.logger.log(self.fileName, 'onlineLogin', 'Error in insertUser : ' + JSON.stringify(error));
            this.utilityProvider.stopSpinner();
            this.loginProcess = false;
          });
        }).catch((err: any) => {
          this.logger.log(this.fileName, "loginContinue", 'Error in updateUserDetails:' + JSON.stringify(err));
          this.loginError = true;
          this.loginProcess = false;
          this.utilityProvider.stopSpinner();
        });
      }).catch((err: any) => {
        self.logger.log(self.fileName, 'onlineLogin', 'Error in getTechnicianProfile : ' + JSON.stringify(err));
        this.loginError = true;
        this.loginErrorMsg = "Please verify Username or Password."
        this.loginProcess = false;
        this.utilityProvider.stopSpinner();
      });
    } else {
      this.loginError = true;
      this.loginErrorMsg = "Please verify Username or Password."
      //this.loginErrorMsg=err.error_description

      this.loginProcess = false;
      this.utilityProvider.stopSpinner();
    }
    // }).catch((err: any) => {
    //   this.logger.log(this.fileName, "loginContinue", 'Error in SyncLoader:' + JSON.stringify(err));
    // });
  }
  setTaskNameNA() {
    try {
      if (this.valueProvider.getUser().ClarityID) {
        this.localServiceSdr.insertNATask()
      }
      else {
        this.localServiceSdr.deleteFromTable('Task_Number', Enums.jobIdNA.value, 'Task');
      }
    }
    catch (err) {
      this.logger.log(this.fileName, "setTaskNameNA", 'Error in setTaskNameNA:' + JSON.stringify(err));
    }
  }
// offlineLogin() {
//   let self = this;
//   this.valueProvider.setUsername(this.username);
//   self.storage.get('tokenExpireTime').then(expiredTime => {
//     /**
//      * 08/17/2018 Rizwan Haider,
//      * No need to just make a new reference to expiretime varable
//      */
//     // let expiredTime = expiretime;
//     let currentTime = Date.now();
//     if (expiredTime >= currentTime) {
//       //let authorizationValue = window.btoa(self.username + ":" + self.password);
//       self.localService.getUserLogin(this.username).then((response: any[]) => {
//         self.logger.log(self.fileName, 'offlineLogin', "USER =====> " + JSON.stringify(response));
//         if (response.length > 0) {
//           let userObject = {
//             'ID': response[0].ID,
//             'Login_Status': "1"
//           };
//           self.localService.updateUser(userObject).then((res) => {
//             self.localService.offLineLogin().then((success) => {
//               if (success) {
//                 self.utilityProvider.stopSpinner();
//                 self.initEventsForAnalytics();
//                 self.navCtrl.setRoot("FieldJobListPage");
//               } else {
//                 self.loginError = true;
//                 self.utilityProvider.stopSpinner();
//               }
//             }).catch((error: any) => {
//               self.logger.log(self.fileName, 'offlineLogin', 'Error in offlineLogin : ' + JSON.stringify(error));
//             });
//           }).catch((error: any) => {
//             self.logger.log(self.fileName, 'offlineLogin', 'Error in offlineLogin : ' + JSON.stringify(error));
//           });
//         } else {
//           self.loginError = true;
//           self.utilityProvider.stopSpinner();
//         }
//       }).catch((error: any) => {
//         self.logger.log(self.fileName, 'offlineLogin', 'Error in offlineLogin : ' + JSON.stringify(error));
//       });
//     } else {
//       let userObject = {
//         'ID': self.valueProvider.getUser().ID,
//         'Login_Status': "0"
//       };
//       self.cloudProvider.logout();
//       self.localService.updateUser(userObject).then((response) => {
//         self.storage.remove('logintoken');
//         self.valueProvider.setTaskList([]);
//       }).catch((error: any) => {
//         self.logger.log(self.fileName, 'offlineLogin', 'Error in offlineLogin : ' + JSON.stringify(error));
//       });
//     }
//   }).catch((error: any) => {
//     self.logger.log(self.fileName, 'offlineLogin', 'Error in offlineLogin : ' + JSON.stringify(error));
//   });
// }

/**
 * 08/28/2018 Gurkirat Singh:
 * Set Initial Online Time
 * Subscribe to Event Handlers when app goes to Foreground or Background
 * Enables the Background mode to prevent app from going to sleep mode
 *
 * @memberof LoginPage
 */
initEventsForAnalytics() {
  // 08/28/2018 Gurkirat Singh: Set Initial Online Time
  this.utilityProvider.setLastOnlineTime(new Date());
  this.utilityProvider.subscribeToPauseAndResumeEvent();
  try {
    this.backgroundMode.enable();
  } catch (error) {
    this.logger.log(this.fileName, 'initEventsForAnalytics', 'Error in initEventsForAnalytics : ' + JSON.stringify(error));
  }
}


setDataToUserPreferences() {
  let self = this;
  // 05/08/2019 Gurkirat Singh: Removed User Preference Object which was extra after merging branch
  return self.localService.getUserPreferrences().then((user_Preferences: any[]) => {
    // 12-27-2018 -- Mansi Arora -- ternary to handle languageId inorder to avoid any exception
    let UserPreferencesObject = {
      ResourceID: self.valueProvider.getResourceId(),
      Email: self.valueProvider.getUser().Email,
      Default_Currency: self.valueProvider.getUser().Currency,
      Preferred_language: self.valueProvider.getUser().Language,
      Preferred_language_Id: self.valueProvider.getUser().LanguageId ? self.valueProvider.getUser().LanguageId.toString() : null,
      Timezone: self.valueProvider.getUser().Time_Zone ? self.valueProvider.getUser().Time_Zone : '(UTC+00:00) London - GMT',
      FSR_PrintNote: true,
      FSR_PrintExpense: false,
      FSR_PrintExpenseComplete: false,
      FSR_PrintMaterial: true,
      FSR_PrintTime: true,
      FSR_PrintSignature: true,
      FSR_PrintInstallBase: true,
      FSR_PrintEUISO: false,
      FSR_PrintAttachment: true,
      Date_Format: "dd-mmm-yyyy",
      AddressId: "",
      AddressIdCh: "",
      SelectedLanguage: self.valueProvider.getUser().Language,
      // 07/17/2019 Zohaib Khan
      // Usr Pref modal from customer signature page will show initially
      Do_Not_Show_Modal: false,
      UOM: "",
      //07/25/2018 Zohaib Khan
      // Added FSR_Disclaimer. Initially it is true
      FSR_Disclaimer: true,
      FSR_Languages: "en-gb",
      //11/28/2018 Zohaib Khan: Setting ShowNonBillableEntries check to True for the first time.
      ShowNonBillableEntries: true,
      // 01-30-2019 -- Mansi Arora -- send timeZoneIANA to save user preferences
      timeZoneIANA: self.valueProvider.getUser().timeZoneIANA ? self.valueProvider.getUser().timeZoneIANA : 'Europe/London',
      //04-04-2019 Radheshyam kumar Added this to insert world are id on login.
      // 05/08/2019 Gurkirat Singh: If world area is already set in user preference then pick same else pick the one coming from login API
      WorldAreaID: user_Preferences.length != 0 && user_Preferences[0].WorldAreaID ? user_Preferences[0].WorldAreaID : self.valueProvider.getUser().WorldAreaID,
      //By Vivek On 21MAY2019
      ShowChargeMethod: user_Preferences.length != 0 && user_Preferences[0].ShowChargeMethod ? user_Preferences[0].ShowChargeMethod : false,
      ListView: user_Preferences.length != 0 && user_Preferences[0].ListView ? user_Preferences[0].ListView : "w",
      /**
      * Preeti Varshney 09/04/2019
      * Added Monday by default in the STARTDAYOFWEEK column at login
      */
      STARTDAYOFWEEK: user_Preferences.length != 0 && user_Preferences[0].STARTDAYOFWEEK ? user_Preferences[0].STARTDAYOFWEEK : "Monday",
      FSR_PrintChargeMethod :true
    };
    if (user_Preferences.length != 0) {
      return self.localService.updateWorldAreaInPreferrences(UserPreferencesObject.WorldAreaID ? UserPreferencesObject.WorldAreaID : null).then((res) => {
        user_Preferences[0].WorldAreaID = UserPreferencesObject.WorldAreaID;
        self.valueProvider.setUserPreferences(user_Preferences);
        self.translateService.use(user_Preferences[0].SelectedLanguage);
        // user_Preferences[0].WorldAreaID = UserPreferencesObject.WorldAreaID;
        // //05-04-2019 Radheshyam kumar Added to update userfreference if user has upadted in manage user.
        // return self.localService.updateUserPreferrences(user_Preferences[0]).then((res): any => {
        //   self.valueProvider.setUserPreferences(user_Preferences);
        //   self.translateService.use(user_Preferences[0].SelectedLanguage);
        //   //self.logger.log(self.fileName, 'setDataToUserPreferences', "UserPreferencesObject: " + JSON.stringify(self.valueProvider.getUserPreferences()));
        //   return Promise.resolve(true);
        // }).catch((error: any) => {
        //   self.logger.log(self.fileName, 'updateUserPreferrences', 'Error in updateUserPreferrences : ' + JSON.stringify(error));
        //   return Promise.resolve(false);
        // });
      });
    } else {
      return self.localService.insertUserPreferrences(UserPreferencesObject).then((res): any => {
        self.valueProvider.setUserPreferences([UserPreferencesObject]);
        self.translateService.use(UserPreferencesObject.SelectedLanguage);
        //self.logger.log(self.fileName, 'setDataToUserPreferences', "UserPreferencesObject: " + JSON.stringify(self.valueProvider.getUserPreferences()));
        return Promise.resolve(true);
      }).catch((error: any) => {
        self.logger.log(self.fileName, 'setDataToUserPreferences', 'Error in insertUserPreferrences : ' + JSON.stringify(error));
        return Promise.resolve(false);
      });
    }
  }).catch((error: any) => {
    self.logger.log(self.fileName, 'setDataToUserPreferences', 'Error in getUserPreferrences : ' + JSON.stringify(error));
    return Promise.resolve(false);
  });

}

insertUser(userObject, userDetail) {
  let baseData = this.username.toLowerCase();
  let authorizationValue = window.btoa(baseData);
  userObject.Login_Status = "1";
  userObject.Sync_Status = "0";
  userObject.Last_Updated = new Date();
  userObject.Last_Updated_Internal = new Date();
  userObject.Last_Updated_Delete = new Date();
  userObject.encrypt = authorizationValue;
  userObject.userName = this.username;
  if (userDetail.ClarityID) {
    userObject.ClarityID = userDetail.ClarityID;
  }
  userObject.WorldAreaID = userDetail.WorldAreaID;
  //userObject.userRole = this.valueProvider.getUserRoles();
  return this.localService.insertUserList(userObject).then((response) => {
    return this.localService.getUser();
  }).catch((error: any) => {
    this.logger.log(this.fileName, 'insertUser', 'Error in insertUserList : ' + JSON.stringify(error));
  });
}
  // 09-12-18 Suraj Gorai --OKTA inappbrowser code remove, now we use OKTA JWT process
}



