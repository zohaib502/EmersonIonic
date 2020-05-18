import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { ValueProvider } from '../value/value';
import moment from 'moment';
import { UtilityProvider } from '../utility/utility';
import { LoggerProvider } from '../logger/logger';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { LocalServiceProvider } from '../local-service/local-service';
import { FileUpdaterProvider } from "../file-updater/file-updater";
import { IMCS, AnalyticsEvent, IStorageCollection } from 'mcs';
import * as mcssdk from 'mcs';
import { mcsConfig } from "../../mcs-config/mcs-config";
import { appConfig } from "../../app-config/app-config";
import * as Enums from '../../enums/enums';
// import { SubmitProvider } from '../sync/submit/submit';


/*
  Generated class for the McsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CloudService {
  pList = [];
  // backend: any;
  isAuthenticated: any;
  collection: IStorageCollection;
  fileName: any = 'CloudService';
  public valueProvider: ValueProvider;
  public utilityProvider: UtilityProvider;
  // public submitProvider: SubmitProvider;
  refreshToast = false;
  currentTime: number;
  expiredTime: number;
  users = [];
  filterUsers = [];
  roles: any;
  uniqueRoles = [];
  permissionlist = [];
  // 08/08/2018 Gurkirat Singh -- Added common date format for MCS Last Modified Date
  modifiedDateFormat = "YYYY-MM-DDTHH:mm:ss.SSSZ";
  // 02-07-2018 GS: Variable for Offline Analytics
  analyticEvents: AnalyticsEvent[] = [];
  isLogout: any = false;
  mcs: IMCS = mcssdk;

  constructor(public logger: LoggerProvider, public http: HttpClient, public plt: Platform, injector: Injector, public storage: Storage, public fileUpdater: FileUpdaterProvider, public toastController: ToastController, public events: Events, public device: Device, public localService: LocalServiceProvider) {
    this.initMCS();
    setTimeout(() => {
      // 08/28/2018 Gurkirat Singh: Removed Unused Injector for LocalServiceProvider
      // Added Injector for UtilityProvider
      this.valueProvider = injector.get(ValueProvider)
      this.utilityProvider = injector.get(UtilityProvider)
      // this.submitProvider = injector.get(SubmitProvider)
    });
  }

  initMCS() {
    // BaseUrl is set to localhost so that proxy from the file "ionic.config.json" can work on web while testing on web
    if (!this.plt.is('cordova')) {
      mcsConfig.mobileBackend.baseUrl = "http://localhost:8100";
    }
    mcsConfig.mobileBackend.baseUrl = Enums.MCSConfig.baseUrl;
    mcsConfig.mobileBackend.authentication.basic.mobileBackendId = Enums.MCSConfig.backendId;
    mcsConfig.mobileBackend.authentication.basic.anonymousKey = Enums.MCSConfig.anonymousToken;
    // this.logger.log(this.fileName, 'mcsConfig', "EmcsConfig: " + JSON.stringify(mcsConfig));
    //console.log("The config has been set and now it has the backend defined in the config as the point of entry for the rest of the functions you need to call.");
    this.mcs.init(mcsConfig);
    // this.mcs.mobileBackend = this.mcs.mobileBackendManager.returnMobileBackend('EMERSON_MBE', mcsConfig);
    // 02/01/2019 -- Mayur Varshney -- Stop location popup on application initialization
    // if (this.plt.is('cordova')) {
    //   mcs.mobileBackendManager.platform.initGPSLocation();
    // }
  }

  async getOfflineAnalytics() {
    try {
      let success = await this.localService.getLoginStatus();
      if (success) {
        if (this.isAuthenticated) {
          // 02-07-2018 GS: Get remaining offline analytic events to be sent to MCS
          let analyticEvents = await this.storage.get('AnalyticEvents')
          // this.logger.log(this.fileName, 'getOfflineAnalytics', 'Analytic Events Done: ' + analyticEvents.length);
          this.analyticEvents = analyticEvents && analyticEvents != '' ? analyticEvents : [];
          // GS: Set offline events back to MCS SDK
          this.mcs.mobileBackend.analytics._setEvents(this.analyticEvents);
          this.flushAnalyticsEvents();
        } else {
          await this.loginMCS()
          this.getOfflineAnalytics();
        }
      } else {
        this.logger.log(this.fileName, 'getOfflineAnalytics', "Application is in logout state");
      }
    } catch(error) {
      this.logger.log(this.fileName, 'getOfflineAnalytics', error);
    }
  }

  // 09-12-18 Suraj Gorai --OKTA inappbrowser code remove, now we use OKTA JWT process
  invokeMCSService(endpoint, method, data) {
    // 02/26/2019 -- Mayur Varshney -- check if user if logged to prevent authentication popup
    if (!this.isLogout) {
      if (this.isAuthenticated) {
        this.mcs.mobileBackend.customCode.setAccsHeaderValue(this.valueProvider.getAccsToken());
        return this.mcs.mobileBackend.customCode.invokeCustomCodeJSONRequest(endpoint, method, data)
          .then(res => {
            this.logger.log(this.fileName, endpoint, 'ECID: ' + res.headers['x-oracle-dms-ecid']);           
           if(res.data.success !== undefined) {
            if(res.data.success)  return Promise.resolve(res.data);
            return Promise.reject(res.data.error);
           }else{
            return Promise.resolve(res);
           }
           
          })
          .catch(err => {
            this.logger.log(this.fileName, endpoint, 'ERROR ECID: ' + err.headers['x-oracle-dms-ecid']);
            let requestPayload = data ? JSON.stringify(data) : '';
            let errorPayload = err ? JSON.stringify(err) : '';
            try {
              requestPayload = requestPayload.slice(0, 1000); //Pulkit- handle to push limited request data in log files (base64)
            } catch (e) { }
            this.logger.log(this.fileName, 'invokeMCSService', 'Error Occured for: ' + endpoint + '\n' + 'Request Payload: ' + requestPayload + '\n' + 'Error Payload: ' + errorPayload + '/nERROR ECID: ' + err.headers['x-oracle-dms-ecid']);
            return Promise.reject(err);
          });
      } else {
        return this.loginMCS().then(() => {
          return this.invokeMCSService(endpoint, method, data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'invokeMCSService', 'Error in loginMCS' + JSON.stringify(err))
          return Promise.reject(err);
        });
      }
    } else {
      this.logger.log(this.fileName, 'invokeMCSService', 'User is already in logout state')
      return Promise.reject('User is in logout state');
    }
  }
  // 09-12-18 Suraj Gorai --OKTA inappbrowser code remove, now we use OKTA JWT process, remove SSO token with user credentials
  login(username, password) {
    var self = this;
    let credentials: {};
    credentials = {
      "username": username,
      "password": password,
      "UDID": this.device.uuid,
      // 02-19-2019 -- Mansi Arora -- send userAppVersion to login
      "currentAppVersion": this.utilityProvider.getAppVersion(),
      "logout": false
    }

    return new Promise((resolve, reject) => {
      this.loginMCS().then(() => {
        // 02/26/2019 -- Mayur Varshney -- check if user if logged to prevent authentication popup
        this.isLogout = false;
        this.mcs.mobileBackend.customCode.invokeCustomCodeJSONRequest('fieldserviceapi/login', 'POST', credentials).then(function (response) {
             resolve(response.data);
         // reject(response.data)
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'loginMCS', "Error in invokeCustomCodeJSONRequest" + JSON.stringify(err));
          reject(err)
        });
      }, function (err) {
        self.logger.log(self.fileName, 'loginMCS', "Error in loginMCS" + JSON.stringify(err));
        reject(err);
      });
    });
  }


  /**
   *@author:Prateek
   *Update.Delete and add user
   * @param {*} userid
   * @param {*} name
   * @param {*} email
   * @param {*} roles
   * @param {*} isactive
   * @returns
   * @memberof CloudService
   */
  // 01-29-2019 -- Mansi Arora -- set country, state, city and zipcode as optional params
  manageUser(param) {
    // var self = this;
    if (this.utilityProvider.isConnected()) {
      let credentials: {};
      // 01-29-2019 -- Mansi Arora -- send values for country, state, city and zipcode along with other fields
      credentials = {
        "UserID": param.userid,
        "Name": param.name,
        "Email": param.email,
        "RoleMappings": param.userrolesid,
        "ClarityID": param.clarityid,
        "WorldAreaID": param.worldarea ? param.worldarea : '',
        "country": param.country ? param.country : '',
        "state": param.state ? param.state : '',
        "city": param.city ? param.city : '',
        "zipCode": param.zipcode ? param.zipcode : '',
        "IsActive": param.isActive,
        "CreatedBy": parseInt(param.createdby) ? parseInt(param.createdby) : '',
        "ModifiedBy": parseInt(param.modifiedby) ? parseInt(param.modifiedby) : ''

      }
      return new Promise((resolve, reject) => {
        this.getUsers();
        this.mcs.mobileBackend.customCode.invokeCustomCodeJSONRequest('fieldserviceapi/users', 'POST', credentials).then(function (response) {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'manageUsers', "Error: " + JSON.stringify(err));
          reject(err);
        });

      });
      //   return this.invokeMCSService('fieldserviceapi/users', 'POST', credentials).then((response) => {
      //     console.log(response.data, "ADDDD")
      //     this.utilityProvider.stopSpinner();
      //     //console.log(this.users, "USERS")
      //     return Promise.resolve(response.data);
      //   }).catch((err) => {
      //     this.utilityProvider.stopSpinner();
      //     // console.log(JSON.stringify(err), "ERRR")
      //     this.logger.log(this.fileName, 'getUsers', "Error: " + JSON.stringify(err));
      //     return Promise.reject(err);
      //   });
      // } else {
      //   this.utilityProvider.stopSpinner();
      //   this.logger.log(this.fileName, 'getUsers', "Error: You are Offline!!");
      //   let err = "You are Offline!!";
      //   return Promise.reject(err);
      // }
    }
  }


  /**
   *@author Prateek
   *used to add/update/delete roles
   * @param {*} name
   * @param {*} desc
   * @param {*} userroleId
   * @returns
   * @memberof CloudService
   */
  manageRoles(name, desc, userroleId, permission) {
    // var self = this;
    console.log("ROLEID", userroleId)
    if (this.utilityProvider.isConnected()) {
      let credentials: {};
      credentials = {
        "RoleName": name,
        "Description": desc,
        "UserRoleID": userroleId,
        "Permissions": permission
      }
      return new Promise((resolve, reject) => {
        this.getRoles();
        this.mcs.mobileBackend.customCode.invokeCustomCodeJSONRequest('fieldserviceapi/roles', 'POST', credentials).then(function (response) {
          resolve(response.data);

        }).catch((err) => {
          this.logger.log(this.fileName, 'manageRoles', "Error: " + JSON.stringify(err));
          reject(err);
        });

      });
    }
  }
  /**
   *@author Prateek
   *Used to get all permission of users from server
   * @param {*} UserRoleID
   * @returns
   * @memberof CloudService
   */
  getPermission(UserRoleID) {

    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/permission/' + UserRoleID, 'GET', '').then((response) => {
          resolve(response.data);

        }).catch((err) => {
          this.logger.log(this.fileName, 'submitContactList', "Error: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'submitContactList', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
    // let credentials: {};
    // credentials = {
    //   "UserRoleID": UserRoleID
    // }
    // if (this.utilityProvider.isConnected()) {
    //   this.utilityProvider.showSpinner();
    //   return this.invokeMCSService('fieldserviceapi/permission/' + UserRoleID, 'GET', '').then((response) => {
    //     //this.pList = response.data;
    //     this.permissionlist = response.data
    //     // console.log("GETPERMISSIONLIST", this.permissionlist)
    //     //this.removeDuplicateRoles('ModuleName')
    //     this.groupPermissionList();
    //     // this.removeDuplicateRoles(this.permisionlist);
    //     this.utilityProvider.stopSpinner();
    //     //console.log(this.users, "USERS")
    //     return Promise.resolve(response.data);
    //   }).catch((err) => {
    //     this.utilityProvider.stopSpinner();
    //     // console.log(JSON.stringify(err), "ERRR")
    //     this.logger.log(this.fileName, 'getPermission', "Error: " + JSON.stringify(err));
    //     return Promise.reject(err);
    //   });
    // } else {
    //   this.utilityProvider.stopSpinner();
    //   this.logger.log(this.fileName, 'getPermission', "Error: You are Offline!!");
    //   let err = "You are Offline!!";
    //   return Promise.reject(err);
    // }


  }
  /**
   *@author Prateek
   *Used to group permision
   * @memberof CloudService
   */
  groupPermissionList() {
    var groupBy = function (xs, key) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };
    var groubedByTeam = groupBy(this.permissionlist, 'ModuleName')
    this.permissionlist = groubedByTeam;
    this.pList.push(this.permissionlist)
    this.keys();
    // console.log("GROUP", JSON.stringify(this.pList));
  }
  loginMCS() {
    var self = this;
    return new Promise((resolve, reject) => {
      this.mcs.mobileBackend.setAuthenticationType('basic');
      self.isAuthenticated = false;
      this.mcs.mobileBackend.authorization.authenticate(this.utilityProvider.userCredential().username, this.utilityProvider.userCredential().password)
        .then((res) => {
          self.isAuthenticated = true;
          resolve();
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'loginMCS', ' Error in authenticate' + JSON.stringify(err));
          self.isAuthenticated = false;
          reject(err);
        });
    });
  }
  list = []
  keys() {
    // console.log("PLIST", this.pList);
    for (let i = 0; i < this.pList.length; i++) {
      this.list.push(Object.keys(this.pList[i]).map(key => ({ key, value: this.pList[i][key] })))
      // console.log("LIST", this.list);
    }

  }


  //SSO use
  // login(sso_token) {
  //   let self = this;
  //   return new Promise((resolve, reject) => {
  //     if (this.utilityProvider.isConnected()) {
  //       this.setAccessToken(sso_token).then((res) => {
  //         self.invokeMCSService('fieldserviceapi/login', 'GET', null).then((response) => {
  //           resolve(response);
  //           self.logger.log(self.fileName, 'logCustomEvent', "Analytics Session Started");
  //           this.mcs.mobileBackend.analytics.startSession();
  //           self.logCustomEvent('Login', { user: sso_token.principal.toLowerCase() });
  //           self.flushAnalyticsEvents();
  //         }).catch(err => {
  //           self.logger.log(self.fileName, 'login', "Error: " + JSON.stringify(err));
  //           reject(err)
  //         });
  //       });
  //     } else {
  //       self.logger.log(self.fileName, 'login', "Error: You are Offline!!");
  //       let err = "You are Offline!!";
  //       reject(err);
  //     }
  //   });
  // }

  //loginAnonymous() {
  //    let self = this;
  //    return new Promise((resolve, reject) => {
  //        this.mcs.mobileBackend.setAuthenticationType('basicAuth');
  //        this.mcs.mobileBackend.Authorization.authenticateAnonymous(function () {
  //            self.isAuthenticated = false;
  //            resolve(null);
  //        }, function (err) { reject(err) });
  //    });
  //}

  // setAccessToken(sso_token) {
  //   this.currentTime = Date.now();
  //   return new Promise((resolve, reject) => {
  //     this.mcs.mobileBackend.setAuthenticationType('ssoAuth');
  //     this.mcs.mobileBackend.authorization.setAccessToken(sso_token, (status, response) => {
  //       // let tokenExpireTime = this.currentTime + 180 * 1000;
  //       let tokenExpireTime = this.currentTime + sso_token.expires_in * 1000;
  //       this.storage.set('tokenExpireTime', tokenExpireTime).then(() => {
  //         this.storage.set('sso_token', sso_token).then(() => {
  //           this.isAuthenticated = true;
  //           resolve(true);
  //         });
  //       });
  //     })
  //   })
  // }

  // loginMCS(username, password) {
  //     let self = this;
  //     return new Promise((resolve, reject) => {
  //         this.mcs.mobileBackend.setAuthenticationType('basicAuth');
  //         this.mcs.mobileBackend.authorization.authenticate(username, password, function (status, result) {
  //             self.isAuthenticated = true;
  //             resolve(null);
  //         }, function (status, err) {
  //             self.isAuthenticated = false;
  //             reject(err);
  //         });
  //     });
  // }

  /**
   *
   *  09-12-18 Suraj Gorai --remove sso_token storage check
   * @returns
   *
   * @memberOf CloudService
   */
  logout() {
    let self = this;
    return new Promise((resolve, reject) => {
      // 02/26/2019 -- Mayur Varshney -- check if user if logged to prevent authentication popup
      this.isLogout = true;
      this.mcs.mobileBackend.analytics.endSession(this.getLocation()).then(() => {
        // self.logger.log(self.fileName, 'logout', "Analytics Session Ended");
        // 02/26/2019 -- Mayur Varshney -- comment backend to prevent authentication popup
        // this.mcs.mobileBackend.authorization.logout();
        // self.logger.log(self.fileName, 'logout', "Logged out from MCS Backend");
        self.isAuthenticated = false;
      }).catch((err) => {
        self.logger.log(self.fileName, 'logout', "Error in endSession: " + JSON.stringify(err));
      });
    });
  }

  /**
   * 09/18/18 Suraj Gorai
   * @param {any} token  is application refresh token which we get from OKTA in the time of user login, if user (refresh token) inactive or block then application automatic logout user with message
   * @returns new access token beased on refresh token
   * @memberOf CloudService
   */
  refreshToken(token) {
    let data: {} = {
      "refresh_token": token
    }
    let expireinfo: {};
    return new Promise((resolve, reject) => {
      this.invokeMCSService('fieldserviceapi/refreshToken', 'POST', data).then((res) => {
        this.storage.get('expiredata').then((data) => {
          expireinfo = {
            'expiretime': Date.now() + (res.data.expires_in * 1000),
            'refreshtoken': data.refreshtoken,
            'useremail': data.useremail
          }
          this.storage.set('expiredata', expireinfo).then(() => {
            resolve(res);
          }).catch((err: any) => {
            this.logger.log(this.fileName, 'refreshToken', 'Error in set expiredata : ' + JSON.stringify(err))
            reject(err);
          });
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'refreshToken', 'Error in get expiredata : ' + JSON.stringify(err))
          reject(err);
        });
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'refreshToken', 'Error in invokeMCSService' + JSON.stringify(err));
        let apptoast = this.toastController.create({
          message: "Your session expired, Please login again to continue..",
          duration: 4000,
          position: 'middle',
          showCloseButton: true,
          closeButtonText: "OK",
          dismissOnPageChange: false
        });
        apptoast.onDidDismiss(() => {
          // this.logger.log(this.fileName, 'refreshToken', "Error in onDidDismiss: " + JSON.stringify(err));
          this.events.publish('appLogout');
        });
        apptoast.present();
        reject(err);
      });
    });
  };

  /**
   * //09/28/2018 Suraj Gorai: check user login in app using same device or not.
   * @returns
   * @memberOf CloudService
   */
  checkUser(): Promise<boolean> {
    let self = this;
    return new Promise((resolve, reject) => {
      if (self.utilityProvider.isConnected()) {
        self.storage.get('expiredata').then(res => {
          let data: {};
          data = {
            "emailID": res.useremail,
            "UDID": self.device.uuid,
            // 02-19-2019 -- Mansi Arora -- send userAppVersion to checkUser
            "currentAppVersion": this.utilityProvider.getAppVersion()
          }
          self.invokeMCSService('fieldserviceapi/checkUser', 'POST', data).then((res: any) => {
            if (res.data.alreadyLoggedIn == "true") {
              this.utilityProvider.checkForVersionUpdates(res);
              resolve(true);
            } else {
              this.utilityProvider.checkForVersionUpdates(res);
              resolve(false);
            }
          }).catch((err: any) => {
            self.logger.log(self.fileName, 'checkUser', "Error in invokeMCSService: " + JSON.stringify(err));
            reject(err)
          });
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'checkUser', 'Error in expiredata' + JSON.stringify(err))
          reject(err)
        });
      } else {
        self.logger.log(self.fileName, 'checkUser', "Error: Application is in offline mode.");
        reject('offline');
      }
    });
  };

  updateUUID(data) {
    let post: {};
    return new Promise((resolve, reject) => {
      this.storage.get('expiredata').then(res => {
        if (data == "update") {
          post = {
            "emailID": res.useremail,
            "UDID": this.device.uuid,
            // 02-19-2019 -- Mansi Arora -- send userAppVersion to updateUUID
            "currentAppVersion": this.fileUpdater.localDBConfig.softVersion,
            "logout": false
          }

        } else if (data == "logout") {
          post = {
            "emailID": res.useremail,
            "UDID": this.device.uuid,
            // 02-19-2019 -- Mansi Arora -- send userAppVersion to updateUUID
            "currentAppVersion": this.fileUpdater.localDBConfig.softVersion,
            "logout": true
          }
        }
        this.invokeMCSService('fieldserviceapi/updateUDID', 'POST', post).then((res: any) => {
          if (res.data.message == "update true") {
            resolve();
          }
          else if (res.data.message == "logout true") {
            resolve();
          }
        }).catch((err: any) => {
          this.logger.log(this.fileName, "updateUUID", 'Error in invokeMCSService' + JSON.stringify(err))
          reject(err)
        });
      }).catch((err: any) => {
        this.logger.log(this.fileName, "updateUUID", 'Error in get expiredata' + JSON.stringify(err))
      });
    });
  };

  // 08/31/2018 -- Mayur Varshney -- return current date in particular format
  newDateTime(date) {
    return moment(date).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  }

  getTechnicianProfile(username, userObject,userID?) {
    //this.logger.log(self.fileName, 'getTechnicianProfile', "userObject: " + JSON.stringify(userObject));
    // let self = this;
    return new Promise((resolve, reject) => {
      if (this.valueProvider.isOSCUser()) {
        if (this.utilityProvider.isConnected()) {
          this.invokeMCSService('fieldserviceapi/techprofile?resourceId=' + this.valueProvider.getResourceId()+'&dbUserId='+userID, 'GET', null).then((response) => {
            resolve(response);
          }).catch((err: any) => {
            this.logger.log(this.fileName, 'getTechnicianProfile', "Error in invokeMCSService: " + JSON.stringify(err));
            reject(err);
          });
        } else {
          this.logger.log(this.fileName, 'getTechnicianProfile', "Error: You are Offline!!");
          let err = "You are Offline!!";
          reject(err);
        }
      } else {
        let techProfile = {
          data: {
            "technicianProfile": [
              {
                "ID": "0",
                "ClarityID": "",
                "Currency": userObject.currency,
                "Default_View": "",
                "Email": "",
                "Language": userObject.selectedLanguage,
                "LanguageId": userObject.selectedLanguageId,
                "Name": userObject.lastName + ', ' + userObject.firstName,
                "OFSCId": "0",
                "Password": "",
                "Time_Zone": userObject.timeZone,
                "Type": "",
                "User_Name": username,
                "Work_Day": "",
                "Work_Hour": ""
              }
            ]
          }
        };
        resolve(techProfile);
      }
    });
  }

  /**
  * To submit status in OSC/OFSC 
  * Parvinder
  */
  updateTaskStatus(formData) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/workflowUpdateTask', 'POST', formData).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'workflowUpdateTask', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'workflowUpdateTask', "Error: You are Offline!!");
        // let err = "You are Offline!!";
        reject("failure");
      }
    });
  }

  // updateOFSCStatus(formData) {
  //   return new Promise((resolve, reject) => {
  //     if (this.utilityProvider.isConnected()) {
  //       let data = {
  //         "masteractivityId": formData.Activity_Id + "",
  //         "XA_TASK_STATUS": formData.XA_TASK_STATUS,
  //         "resourceId": this.valueProvider.getResourceId() + "",
  //         "OFSCdate": moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  //         "TaskId": formData.TaskId + "",
  //         "email": formData.email != undefined ? formData.email : "",
  //         "CompletedDateOSC": formData.completeDate != undefined ? formData.completeDate : "",
  //         "followUp": formData.followUp != undefined ? formData.followUp : "",
  //         "salesQuote": formData.salesQuote != undefined ? formData.salesQuote : "",
  //         "salesVisit": formData.salesVisit != undefined ? formData.salesVisit : "",
  //         "salesLead": formData.salesLead != undefined ? formData.salesLead : "",
  //         "followuptext": formData.followuptext != undefined ? formData.followuptext : "",
  //         "sparequotetext": formData.sparequotetext != undefined ? formData.sparequotetext : "",
  //         "salesText": formData.salesText != undefined ? formData.salesText : "",
  //         "salesleadText": formData.salesleadText != undefined ? formData.salesleadText : "",
  //         "denySignature": formData.denySignature != undefined ? formData.denySignature : "",
  //         "signatureComments": formData.signatureComments != undefined ? formData.signatureComments : "",
  //         "Print_Expense_On_On_Site_Rep": formData.print_Expense_On_On_Site_Rep != undefined ? formData.print_Expense_On_On_Site_Rep : "",
  //         "Print_Expense_On_Completed_Rep": formData.print_Expense_On_Completed_Rep != undefined ? formData.print_Expense_On_Completed_Rep : "",
  //         // 12/14/2018 -- Mayur Varshney -- add Safety_Check
  //         "Safety_Check": formData.Safety_Check

  //         // "dndSurvey": formData.dndSurvey != undefined ? formData.dndSurvey : "",
  //         // "SR_ID": formData.SR_ID != undefined ? formData.SR_ID : ""
  //       };
  //       this.invokeMCSService('fieldserviceapi/workflow_OFSC', 'POST', data).then((response) => {
  //         resolve("success");
  //       }).catch((err: any) => {
  //         this.logger.log(this.fileName, 'updateOFSCStatus', "Error in invokeMCSService: " + JSON.stringify(err));
  //         reject(err);
  //       });
  //     } else {
  //       this.logger.log(this.fileName, 'updateOFSCStatus', "Error: You are Offline!!");
  //       // let err = "You are Offline!!";
  //       reject("failure");
  //     }
  //   });
  // };

  /**
   * Add/ Insert for Debrief items
   *
   * @param {*} formData
   * @param {*} dataLength
   * @param {*} Task_Number (Task Number for a particular job)
   * @returns
   * @memberof CloudService
   */
  updateDebrief(formData, Task_Number) {
    //11/12/2018 kamal : passed task number in update debrief
    return new Promise((resolve, reject) => {
      // 11-16-2018 -- Mayur Varshney -- Restrict job to submit on MCS
      // 11/19/2018 -- Mayur -- removed IsStandalone condition
      if (this.utilityProvider.isConnected()) {
        // 10/30/2018 Gurkirat Singh - Added Task_Number instead of this.valuprovider.getTaskId()
        // Sana: combinedUpdate changed to submitDebrief
        this.invokeMCSService('fieldserviceapi/submitDebrief/' + Task_Number, 'POST', formData).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'updateDebrief', "Error in invokeMCSService: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        this.logger.log(this.fileName, 'updateDebrief', "Error: You are Offline!!");
        //this.submitProvider.displayOfflineError(this.fileName,"updateDebrief");
        reject({ result: null });
      }
    });
  };

  createAttachment(attachment) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/createAttachment', 'POST', attachment).then((response) => {
          resolve(true);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'createAttachment', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'createAttachment', "Error: You are Offline!!");
        reject({ result: null });
      }
    });
  };

  /**
   *10/10/2018 kamal : submit task change logs into OSC
   *
   * @param {*} stagingData
   * @returns
   * @memberof CloudService
   */
  submitStagingData(stagingData) {
    return new Promise((resolve, reject) => {
      // 11-16-2018 -- Mayur Varshney -- Restrict job to send staging on MCS
      // 11/19/2018 -- Mayur -- removed IsStandalone condition
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/stagingTable', 'POST', stagingData).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'submitStagingData', "Error in invokeMCSService: " + JSON.stringify(err));
          resolve("failure");
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'submitStagingData', "Error: You are Offline!!");
        resolve("failure");
      }
    });
  };
  /**
   *08/23/2018 Start kamal -- gets activities from MCS
   *
   * @returns
   * @memberof CloudService
   */
  getActivities() {
    if (this.utilityProvider.isConnected()) {
      let data = {};
      data = {
        "resourceId": this.valueProvider.getResourceId(),
        "fromDate": this.valueProvider.getStartDate()
      }
      return this.invokeMCSService('fieldserviceapi/activities', 'POST', data).then((response) => {
        return Promise.resolve(response.data);
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'getActivities', "Error in invokeMCSService: " + JSON.stringify(err));
        return Promise.reject(err);
      });
    } else {
      this.logger.log(this.fileName, 'getActivities', "Error: You are Offline!!");
      let err = "You are Offline!!";
      return Promise.reject(err);
    }
  };

  getTaskInternalList() {
    if (this.utilityProvider.isConnected()) {
      let data = {};
      data = {
        "resourceId": this.valueProvider.getResourceId(),
        "fromDate": this.valueProvider.getStartDate(),
        "toDate": this.valueProvider.getEndDate(),
        "updateDate": this.valueProvider.getUser().Last_Updated_Task ? new Date(this.valueProvider.getUser().Last_Updated_Task).toISOString() : ""
      }
      //08/24/2018 Start kamal -- changed MCS endpoint for tasklist
      return this.invokeMCSService('fieldserviceapi/taskList', 'POST', data).then((response) => {
        return Promise.resolve(response.data);
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'getTaskInternalList', "Error in invokeMCSService: " + JSON.stringify(err));
        return Promise.reject(err);
      });
    } else {
      this.logger.log(this.fileName, 'getTaskInternalList', "Error: You are Offline!!");
      let err = "You are Offline!!";
      return Promise.reject(err);
    }
  };

  getTaskDetails() {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let data = {};
        data = {
          "resourceId": this.valueProvider.getResourceId(),
          "fromDate": this.valueProvider.getStartDate(),
          "toDate": this.valueProvider.getEndDate(),
          "updateDate": this.valueProvider.getUser().Last_Updated_Task_Detail ? new Date(this.valueProvider.getUser().Last_Updated_Task_Detail).toISOString() : ""
        };
        // let userObject = {
        //     'ID': this.valueProvider.getUser().ID,
        //     'Last_Updated_Task_Detail': new Date()
        // };
        this.invokeMCSService('fieldserviceapi/taskDetails', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getTaskDetails', "Error i invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getTaskDetails', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };


  getLOVDetails() {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/oscLOVs', 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getLOVDetails', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getLOVDetails', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  
  async getSiteAllowacesDetails() {
    try {
      if (this.utilityProvider.isConnected()) {
        let data = {
          "dbcsId": this.valueProvider.getUserId().toString(),
          "createdDate": moment.utc(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          "modifiedDate": this.valueProvider.getUser().Last_Updated_Allowances ? new Date(this.valueProvider.getUser().Last_Updated_Allowances).toISOString() : ""
        };
       let response = await this.invokeMCSService('fieldserviceapi/getAllowances', 'POST', data)
       return response.data;
      }else{
        this.logger.log(this.fileName, 'getSiteAllowacesDetails', "Error: You are Offline!!");
        let err = "You are Offline!!";
        throw err;
      }     
    } catch (error) {
      this.logger.log(this.fileName, 'getSiteAllowacesDetails', error);
      throw error
    }
  };

  
  async getTimesheetLOVDetails(clarityId,lastModifiedDate) {
    if (this.utilityProvider.isConnected()) {
      try {
        let api = 'fieldserviceapi/getClarityLov?clarityId='+clarityId;
        if(lastModifiedDate){
          lastModifiedDate= moment.utc(new Date(lastModifiedDate)).format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A') ;
          api = 'fieldserviceapi/getClarityLov?clarityId='+clarityId +'&modifiedDate='+lastModifiedDate;
        }
        let response = await this.invokeMCSService(api, 'GET', null);
        return response.data;
      } catch (error) {
        this.logger.log(this.fileName, 'getTimesheetLOVDetails', "Error in invokeMCSService: " + error.message);
        throw error;
      }
    } else {
      this.logger.log(this.fileName, 'getTimesheetLOVDetails', "Error: You are Offline!!");
      let err = "You are Offline!!";
      throw err;
    }
  }
  
  getProjectDetails(projectArray) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let data = {};
        data = {
          "resourceId": this.valueProvider.getResourceId(),
          "fromDate": this.valueProvider.getStartDate(),
          "toDate": this.valueProvider.getEndDate(),
          "updateDate": this.valueProvider.getUser().Last_Updated_Project ? new Date(this.valueProvider.getUser().Last_Updated_Project).toISOString() : "",
          "project_number": projectArray
        };
        this.invokeMCSService('fieldserviceapi/oscClarityData', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getProjectDetails', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getProjectDetails', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  getSRDetails(srNumberArray) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let data = {};
        data = {
          "updateDate": this.valueProvider.getUser().Last_Updated_SR ? new Date(this.valueProvider.getUser().Last_Updated_SR).toISOString() : "",
          "SRID": srNumberArray
        };
        this.invokeMCSService('fieldserviceapi/srDetails', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getSRDetails', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getSRDetails', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  downloadAttachment(attachmentObject) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let data = {};
        if (attachmentObject.Task_Number != undefined && attachmentObject.Task_Number != null && attachmentObject.Task_Number != "") {

          data = {
            "path": "/tasks",
            "TaskID": attachmentObject.Task_Number,
            "IncidentID": "",
            "FileAttachmentID": attachmentObject.Attachment_Id
          };

        } else if (attachmentObject.SRID != undefined && attachmentObject.SRID != null && attachmentObject.SRID != "") {

          data = {
            "path": "/incidents",
            "TaskID": "",
            "IncidentID": attachmentObject.SRID,
            "FileAttachmentID": attachmentObject.Attachment_Id
          };
        }
        this.invokeMCSService('fieldserviceapi/download_attachments', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'downloadAttachment', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'downloadAttachment', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  //downloadAttachment(attachmentObject) {
  //    return new Promise((resolve, reject) => {
  //        let url = mcsConfig.mobileBackends['EMERSON_MBE'].baseUrl;
  //        let data = {};
  //        if (attachmentObject.Task_Number != undefined && attachmentObject.Task_Number != null && attachmentObject.Task_Number != "") {

  //            data = {
  //                "path": "/tasks",
  //                "TaskID": attachmentObject.Task_Number,
  //                "IncidentID": "",
  //                "FileAttachmentID": attachmentObject.Attachment_Id
  //            };

  //        } else if (attachmentObject.SRID != undefined && attachmentObject.SRID != null && attachmentObject.SRID != "") {

  //            data = {
  //                "path": "/incidents",
  //                "TaskID": "",
  //                "IncidentID": attachmentObject.SRID,
  //                "FileAttachmentID": attachmentObject.Attachment_Id
  //            };
  //        }
  //        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //        this.http.post(url + 'mobile/custom/download_Attachment/download_attachments', data, { headers: headers }).toPromise().then((response: any) => {
  //            resolve(response.data);
  //        }).catch((error : any) => {
  //            reject(error);
  //        });
  //    });
  //}

  getDeletedRecords() {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let data = {
          "resourceId": this.valueProvider.getResourceId(),
          "updateDate": new Date(this.valueProvider.getUser().Last_Updated_Delete).toISOString(),
          "taskId": ""
        };
        this.invokeMCSService('fieldserviceapi/getDeletedRecords', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getDeletedRecords', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getDeletedRecords', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  getAddresses() {
    let isAdmin = this.valueProvider.locationPermissions();
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let tableName = appConfig.AddressTableName;
        // 09/27/2018 -- Mayur Varshney -- Recorrect login for getting all address if admin and (isEnabled=true)'s address if non-admin 
        let url = 'fieldserviceapi/address';
        let queryParam = this.valueProvider.getUser().Last_Updated_Addresses ? "?modifiedDate=" + this.newDateTime(this.valueProvider.getUser().Last_Updated_Addresses) : "";
        let isEnabledParam = this.valueProvider.getUser().Last_Updated_Addresses ? '&isEnabled=true' : '?isEnabled=true';
        // 08/31/2018 -- Mayur Varshney -- change date in MCS supported format
        let api = isAdmin ? url + queryParam : url + queryParam + isEnabledParam;
        this.invokeMCSService(api, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getAddresses', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getAddresses', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };



  /**
   *07262018 KW get all AdressAuditLogs from MCS
   * @returns addressAuditLogs
   * @memberof CloudService
   */
  getAddressAuditLogs() {
    let self = this;
    let isAdmin = this.valueProvider.locationPermissions();
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        // 08/31/2018 -- Mayur Varshney -- change date in MCS supported format
        // self.logger.log(self.fileName, 'getAddressAuditLogs', "Last_Updated_AddressAuditLog: " + self.newDateTime(self.valueProvider.getUser().Last_Updated_AddressAuditLog).length);
        let url = this.valueProvider.getUser().Last_Updated_AddressAuditLog ? "?modifiedDate=" + self.newDateTime(self.valueProvider.getUser().Last_Updated_AddressAuditLog) : "";
        let tableName = appConfig.AddressAuditLogTableName;
        let api = 'fieldserviceapi/database/' + tableName + url;
        // self.logger.log(self.fileName, 'getAddressAuditLogs', "api: " + api.length);
        this.invokeMCSService(isAdmin ? api : api, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getAddressAuditLogs', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getAddressAuditLogs', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  getOnCallShift() {
    let resourceId = this.valueProvider.getResourceId();
    let date = moment().format("YYYY-MM-DD");
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/workSchedules?id=' + resourceId + '&date=' + date, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getOnCallShift', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getOnCallShift', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  /**
   *Prateek (01/15/2019)
   *Get report data from ocs
   */
  getReports(taskNumbers) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        // 08/31/2018 -- Mayur Varshney -- change date in MSC supported format
        // let dateParam = this.valueProvider.getUser().Last_Updated_Reports ? "&modifiedDate=" + this.newDateTime(this.valueProvider.getUser().Last_Updated_Reports) : "&modifiedDate=10-JAN-2019 06:38:37.628000000 AM";
        // 02:06:2019 Gurkirat Singh: Bringing all data when user logs in for first time
        // 01/31/2020 Gurkirat Singh: Added a boolean param "isBackwardCompatible", so that in older versions, osc time entries do not come
        let data: any = {
          "userId": this.valueProvider.getUser().UserID,
          "tasks": taskNumbers.toString(),
          "isBackwardCompatible" : true
        };
        if (this.valueProvider.getUser().Last_Updated_Reports) {
          let date = moment.utc(new Date(this.valueProvider.getUser().Last_Updated_Reports)).format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A');
          data.modifiedDate = date;
        }
        this.invokeMCSService('fieldserviceapi/sdrReportData/', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getReports', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getReports', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  }

  /**
   *
   *
   * @returns
   * @memberof CloudService
   */
  getActuationData() {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let data: any = {
          "userId": this.valueProvider.getUser().UserID
        };
        if (this.valueProvider.getUser().Last_Updated_Reports) {
          let date = moment.utc(new Date(this.valueProvider.getUser().Last_Updated_Reports)).format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A');
          data.modifiedDate = date;
        }
        this.invokeMCSService('fieldserviceapi/getActuationReportData/', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getActuationData', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getActuationData', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  }

  /**
   *
   *
   * @returns
   * @memberof CloudService
   */
  getIsolationData() {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let data: any = {
          "userId": this.valueProvider.getUser().UserID
        };
        if (this.valueProvider.getUser().Last_Updated_Reports) {
          let date = moment.utc(new Date(this.valueProvider.getUser().Last_Updated_Reports)).format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A');
          data.modifiedDate = date;
        }
        this.invokeMCSService('fieldserviceapi/getIsolationReportData/', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getIsolationData', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getIsolationData', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  }

  /**
   *Prateek (01/15/2019)
   *Get report data from ocs
   */
  getSignatureReport(taskID) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let data = {
          "Task_Number": taskID
        };
        this.invokeMCSService('fieldserviceapi/getSignature', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getSignatureReport', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getSignatureReport', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  submitAddresses(addressList) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {

        let tableName = appConfig.AddressTableName;
        this.invokeMCSService('fieldserviceapi/database/' + tableName, 'PUT', addressList).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'submitAddresses', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'submitAddresses', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };
  /**
   *07262018 KW submit AddressAuditLogs into MCS
   *
   * @param {*} addressAuditLogList
   * @returns addressAuditLogs
   * @memberof CloudService
   */
  submitAddressAuditLog(addressAuditLogList) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {

        let tableName = appConfig.AddressAuditLogTableName;
        this.invokeMCSService('fieldserviceapi/database/' + tableName, 'PUT', addressAuditLogList).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'submitAddressAuditLog', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'submitAddressAuditLog', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  submitInstallBase(installBaseList) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/installBase', 'POST', installBaseList).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'submitInstallBase', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'submitInstallBase', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  updateInstallBase(installBaseList) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/updateInstallBase/' + installBaseList.Installed_Base_ID, 'POST', installBaseList).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'updateInstallBase', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'updateInstallBase', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  }

  getFeedbacks() {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let api = 'fieldserviceapi/feedback';
        this.invokeMCSService(api, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getFeedbacks', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getFeedbacks', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };


  // /**
  //  *Prateek (01/15/2019)
  //  *Get report data from ocs
  //  */
  // getReports() {
  //   return new Promise((resolve, reject) => {
  //     if (this.utilityProvider.isConnected()) {
  //       // 08/31/2018 -- Mayur Varshney -- change date in MSC supported format
  //       let userParam = this.valueProvider.getUser().UserID ? "?userId=" + this.valueProvider.getUser().UserID : "";
  //       let dateParam = this.valueProvider.getUser().Last_Updated_Reports ? "&modifiedDate=" + this.newDateTime(this.valueProvider.getUser().Last_Updated_Reports) : "&modifiedDate=2019-01-21T11:06:36";

  //       console.log('userParam', userParam);
  //       console.log('dateParam', dateParam);

  //       let api = 'fieldserviceapi/getSubmitReportData/' + userParam + dateParam;

  //       this.invokeMCSService(api, 'GET', null).then((response) => {
  //         resolve(response.data);
  //       }).catch((err: any) => {
  //         this.logger.log(this.fileName, 'getReports', "Error in invokeMCSService: " + JSON.stringify(err));
  //         reject(err);
  //       });
  //     } else {
  //       this.logger.log(this.fileName, 'getReports', "Error: You are Offline!!");
  //       let err = "You are Offline!!";
  //       reject(err);
  //     }
  //   });
  // }

  getFeedbackQuestions() {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        // 08/31/2018 -- Mayur Varshney -- change date in MSC supported format
        let url = this.valueProvider.getUser().Last_Updated_FeedbackQuestions ? "?modifiedDate=" + this.newDateTime(this.valueProvider.getUser().Last_Updated_FeedbackQuestions) : "";
        let tableName = appConfig.FeedbackQuesTableName;
        let api = 'fieldserviceapi/database/' + tableName + url;
        this.invokeMCSService(api, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getFeedbackQuestions', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getFeedbackQuestions', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  submitFeedback(feedbacks) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/feedback', 'POST', feedbacks).then((response) => {
          //   console.log("response"+response.data);
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'submitFeedback', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'submitFeedback', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  getMSTLanguages() {
    let isAdmin = this.valueProvider.languagePermissions();
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        // let tableName = appConfig.LanguageTableName;
        let apiUrl = 'fieldserviceapi/language';
        let enabled = ""; // "?ISENABLED=true";
        let params = this.valueProvider.getUser().Last_Updated_Languages ? "&modifiedDate=" + this.newDateTime(this.valueProvider.getUser().Last_Updated_Languages) : "";
        this.invokeMCSService(isAdmin ? apiUrl : apiUrl + enabled + params, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getMSTLanguages', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getMSTLanguages', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  getMSTTranslationKeys() {
    //let self = this;
    let url;
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        // 08/20/2018 Mayur Varshney -- get updated changes in translation key table on the basis of last modified date and time, change format by passing date as params.
        // 08/31/2018 -- Mayur Varshney -- change date in MSC supported format
        url = this.valueProvider.getUser().Last_Updated_Translation ? "&modifiedDate=" + this.newDateTime(this.valueProvider.getUser().Last_Updated_Translation) : "";
        let tableName = appConfig.TranslationTableName;

        // 08/02/2018 Mayur Varshney
        // getting all keys on the basis of condition 'Is_Active=true'
        let api = 'fieldserviceapi/database/' + tableName + '?Is_Active=true' + url;
        // self.logger.log(self.fileName, 'getMSTTranslationKeys', "api: " + api.length);
        this.invokeMCSService(api, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getMSTTranslationKeys', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getMSTTranslationKeys', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  getLanguageKeyMappings(allKeys) {
    //let self = this;
    let url;
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        // 08/31/2018 -- Mayur Varshney -- change date in MSC supported format
        // self.logger.log(self.fileName, 'getLanguageKeyMappings', "Last_Updated_Translation: " + this.newDateTime(this.valueProvider.getUser().Last_Updated_Translation).length);
        //07202018 KW condition check to get translation keys on the basis of modifiedDate

        // 08/03/2018 Mayur Varshney
        // change "?modifiedDate" to "&modifiedDate=" , as we pass "?" for Is_Active status in api
        // using ternary operator instead of if-else condition applied for url on allKeys params

        // 08/20/2018 Mayur Varshney -- get updated changes in languageKeyMapping table on the basis of last modified date and time, change format by passing date as params.
        // 08/31/2018 -- Mayur Varshney -- change date in MSC supported format
        url = allKeys ? '' : (this.valueProvider.getUser().Last_Updated_Language_Key_Mappings ? "&modifiedDate=" + this.newDateTime(this.valueProvider.getUser().Last_Updated_Language_Key_Mappings) : "");
        let tableName = appConfig.LanguageMappingTableName;

        // 08/03/2018 Mayur Varshney
        // get all data on the basis of Is_Active=true
        // passing "?Is_Active=true" status in api with "&modifiedDate"

        let api = 'fieldserviceapi/database/' + tableName + '?Is_Active=true' + url;
        // self.logger.log(self.fileName, 'getLanguageKeyMappings', "api: " + api.length);
        this.invokeMCSService(api, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getLanguageKeyMappings', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getLanguageKeyMappings', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  getLanguageKeyMapping(langId, allKeys?) {
    let url;
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.utilityProvider.showSpinner();
        url = allKeys ? '' : (this.valueProvider.getUser().Last_Updated_Language_Key_Mappings ? "&modifiedDate=" + this.newDateTime(this.valueProvider.getUser().Last_Updated_Language_Key_Mappings) : "");
        let api = 'fieldserviceapi/LanguageKeyMapping?LangID=' + langId + url;
        console.log("api", api);
        this.invokeMCSService(api, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'getLanguageKeyMapping', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getLanguageKeyMapping', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  }

  submitTranslations(translations) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let tableName = appConfig.LanguageMappingTableName;
        this.invokeMCSService('fieldserviceapi/database/' + tableName, 'PUT', translations).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'submitTranslations', "Error in  invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'submitTranslations', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  submitLanguages(languages) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        //09/20/18 Suraj Gorai -- if user loged in diffrent device its auto logout from current device
        this.checkUser().then((data) => {
          if (data) {
            this.utilityProvider.checkExpireToken().then(() => {
              let tableName = appConfig.LanguageTableName;
              this.invokeMCSService('fieldserviceapi/database/' + tableName, 'PUT', languages).then((response) => {
                resolve(response.data);
              }).catch((err: any) => {
                this.logger.log(this.fileName, 'submitLanguages', "Error in invokeMCSService: " + JSON.stringify(err));
                reject(err);
              });
            }).catch((refreshtoken: any) => {
              this.logger.log(this.fileName, 'submitLanguages', "Error in checkExpireToken" + JSON.stringify(refreshtoken));
              let data = languages;
              this.refreshToken(refreshtoken).then(() => {
                this.submitLanguages(data);
              }).catch((err: any) => {
                this.logger.log(this.fileName, 'submitLanguages', "Error in refreshToken: " + JSON.stringify(err));
              });
            });
          } else {
            this.logger.log(this.fileName, 'submitLanguages', "Error refreshToken : You are Offline!!");
            let err = "You are Offline!!";
            reject(err);
          }
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'submitLanguages', "Error in checkUser: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'submitLanguages', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  getCollection(collectionName) {
    return new Promise((resolve, reject) => {
      if (!this.collection) {
        this.mcs.mobileBackend.storage.getCollection(collectionName).then((collection: IStorageCollection) => {
          this.collection = collection;
          resolve(collection);
        }).catch((data) => {
          this.logger.log(this.fileName, 'getCollection', "Error in getCollection: " + JSON.stringify(data));
          reject(data);
        });
      } else {
        resolve(this.collection);
      }
    });
  };

  getStorageObjectFromCollection(storageId) {
    return new Promise((resolve, reject) => {
      this.collection.loadObjectPayload(storageId, 'arraybuffer').then((storageObject) => {
        resolve(storageObject);
      }).catch(err => {
        this.logger.log(this.fileName, 'getStorageObjectFromCollection', "Error in Collection getObject: " + JSON.stringify(err));
        reject(err);
      })
    });
  };

  /**
   * 09-12-18 Suraj Gorai --OKTA token check code remove, now we use OKTA JWT process
   *
   * @param {any} collectionName
   * @param {any} storageId
   * @returns
   *
   * @memberOf CloudService
   */
  getStorageObject(collectionName, storageId) {
    //  This is the officially documented way, but fires redundant REST call:
    //  return getCollection(collectionName).then( function (collection) {
    //      return getStorageObjectFromCollection(collection,storageId)
    //  })
    if (this.isAuthenticated) {
      return this.getCollection(collectionName).then(() => {
        return this.getStorageObjectFromCollection(storageId);
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'getStorageObject', 'getCollection' + JSON.stringify(err))
      });
    } else {
      return this.loginMCS().then(() => {
        return this.getCollection(collectionName).then(() => {
          return this.getStorageObjectFromCollection(storageId);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getStorageObject', "Error in getStorageObjectFromCollection: " + JSON.stringify(err));
        });
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'getStorageObject', 'Error in loginMCS : ' + JSON.stringify(err))
      });
      // this.storage.get('expiredTime').then(Response => {
      //   this.expiredTime = Response;
      // });
      // if (this.expiredTime >= this.currentTime) {
      // return this.storage.get('sso_token').then((sso_token) => {
      //   return this.setAccessToken(sso_token).then((res) => {

      //   })
      // });
      // } else {
      //   console.log('Token has expired or user has not been authenticate with the service');
      // }
    }
  };

  getLanguageIcon(lang) {
    return new Promise((resolve, reject) => {
      let name = lang + ".png";
      this.getStorageObject("FieldServiceIcons", name).then((response: any) => {
        resolve(response);
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'getLanguageIcon', "Error in getStorageObject: " + JSON.stringify(err));
        reject(err);
      });
    });
  };

  async logCustomEvent(eventName, properties) {
    let result = false;
    try {
      let success = await this.localService.getLoginStatus();
      if (success) {
        let event = new AnalyticsEvent(eventName);
        event.properties = properties;
        let userRoles = this.valueProvider.getUserRoles();
        // 02-22-2019 -- Prateek -- log analytics for every events.
        // 04/06/2018 -- Mayur Varshney -- convert integer to float value
        // 06/06/2019 -- Set duration for OnlineActivity and OfflineActivity
        if (eventName == 'OnlineActivity' || eventName == 'OfflineActivity') {
          event.properties.DurationInMilliseconds = event.properties.DurationInMilliseconds.toFixed(2);
        }
        event.properties['App_Version'] = this.fileUpdater.localDBConfig.softVersion;
        // event.properties['App_Version'] = this.utilityProvider.getAppVersion();
        event.properties['User_Roles'] = (userRoles ? userRoles.toString() : '');
        event.properties['User_Name'] = this.valueProvider.getUser().Name;
        event.properties['user'] = this.valueProvider.getUser().Email.toLowerCase();
        event.properties['Date'] = moment().format("MM-DD-YYYY");
        this.logger.log(this.fileName, 'logCustomEvent', eventName + " Event Logged");
        this.mcs.mobileBackend.analytics.logEvent(event);
        // 02-07-2018 GS: Get current remaining analytic events to be sent to MCS and set to storage for offline caching
        this.analyticEvents = this.mcs.mobileBackend.analytics._getEvents();
        await this.storage.set('AnalyticEvents', this.analyticEvents);
        result = true;
      } else {
        this.logger.log(this.fileName, 'logCustomEvent', "Application is in logout state");
      }
    } catch (error) {
      this.logger.log(this.fileName, 'logCustomEvent', error);
    }
    return result;
  }

  /**
   * add all duration of online and offline activity to reduce mutliple records
   * @param {any} eventName
   * @param {any} properties
   * @author Mayur Varshney
   * @memberOf CloudService
   */
  logWorkingCustomEvent(eventName, properties) {
    this.localService.getLoginStatus().then((success) => {
      if (success) {
        switch (eventName) {
          case 'OnlineActivity':
            this.storage.get('OnlineActivity').then((res: any) => {
              this.storage.set('OnlineActivity', { 'DurationInMilliseconds': (parseInt(properties.DurationInMilliseconds) + parseInt(res && res.DurationInMilliseconds ? res.DurationInMilliseconds : 0)) });
            });
            break;
          case 'OfflineActivity':
            this.storage.get('OfflineActivity').then((res: any) => {
              this.storage.set('OfflineActivity', { 'DurationInMilliseconds': (parseInt(properties.DurationInMilliseconds) + parseInt(res && res.DurationInMilliseconds ? res.DurationInMilliseconds : 0)) });
            });
            break;
        }
      } else {
        this.logger.log(this.fileName, 'logWorkingCustomEvent', "Application is in logout state");
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'logWorkingCustomEvent', "Error in getLoginStatus: " + JSON.stringify(err));
    });
  }

  /**
   * 08/28/2018 Gurkirat Singh:
   * Gets all the pending analytic events from Storage and Sends to MCS.
   * It also checks if Token is expired or not and Refreshes the token by Opening In-App Browser
   *09-12-18 Suraj Gorai --OKTA token check code remove, now we use OKTA JWT process
   * @memberof CloudService
   */
  flushAnalyticsEvents() {
    // 02-07-2018 GS: Added self variable to internal functions
    var self = this;
    if (self.utilityProvider.isConnected()) {
      this.localService.getLoginStatus().then((success) => {
        if (success) {
          if (self.isAuthenticated) {
            self.logger.log(self.fileName, 'flushAnalyticsEvents', "Flushing Analytic Events...");
            // 01/30/2019 -- Mayur Varshney -- send location from user table for analytics
            let location = this.getLocation();
            // this.mcs.mobileBackend.analytics.setLocation(location);
            // 02-07-2018 GS: Delete Cached Events after sending to MCS
            if(self.analyticEvents.length > 0) {
              this.mcs.mobileBackend.analytics.flush(location).then((res) => {
                // self.logger.log(self.fileName, 'flushAnalyticsEvents', "Flushed Analytic Events: " + res.length);
                self.analyticEvents = [];
                self.storage.set('AnalyticEvents', self.analyticEvents);
                // 04/06/2018 -- Mayur Varshney -- empty online and offline activity storage
                self.storage.set('OnlineActivity', { 'DurationInMilliseconds': 0 });
                self.storage.set('OfflineActivity', { 'DurationInMilliseconds': 0 });
              }).catch((err: any) => {
                self.logger.log(self.fileName, 'flushAnalyticsEvents', "Error in alalytics flus: " + JSON.stringify(err));
              });
            }
          } else {
            self.loginMCS().then(() => {
              self.flushAnalyticsEvents();
            }).catch((err: any) => {
              self.logger.log(self.fileName, 'flushAnalyticsEvents', "Error in loginMCS: " + JSON.stringify(err));
            });
          }
        } else {
          this.logger.log(this.fileName, 'flushAnalyticsEvents', "Application is in logout state");
        }
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'flushAnalyticsEvents', "Error in getLoginStatus: " + JSON.stringify(err));
      });
    }
  }

  submitContactList(contactList) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/contact', 'POST', contactList).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'submitContactList', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'submitContactList', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

  // 09-21-2018 -- Mayur Varshney -- get analytic jsonArr for Offline And Online Event with respect to the Start Date and End Date
  getAnalyticReportDataForOnlineAndOffline(startDate, endDate, status, offset) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let postData = {
          "startDate": moment(startDate).format('YYYY-MM-DD'),
          "endDate": moment(endDate).add(1, 'day').format('YYYY-MM-DD'),
          "exportType": "Events",
          "name": status,
          "offset": offset
        };
        this.invokeMCSService('fieldserviceapi/getAnalytics', 'POST', postData).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getAnalyticReportDataForOnlineAndOffline', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getAnalyticReportDataForOnlineAndOffline ', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getAnalyticReportDataForOnlineAndOffline ', 'Error in promise : ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }

  // 09-14-2018 -- Mayur Varshney -- post API request for getting Analytical Data from FieldService_MBE 1.2 mobile backend
  getAnalytics(data) {
    let baseUrl = mcsConfig.mobileBackend.baseUrl;
    let url = baseUrl + '/mobile/system/analyticsExport/export/request'
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let headerValue: {} = {
          'Authorization': Enums.MCSConfig.encodedAuth,
          'Content-Type': 'application/json',
          'Oracle-Mobile-Backend-Id': mcsConfig.mobileBackend.authentication.basic.mobileBackendId,
          'Access-Control-Allow-Origin': '*',
        }
        const httpOptions = {
          headers: new HttpHeaders(headerValue)
        };
        this.http.post(url, data, httpOptions).subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getAnalytics', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getAnalytics', 'Error in promise : ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }


  /**
   *@author:Prateek
   *Get the users from database and store it in users=[]
   * @returns users
   *
   */

  getUsers() {
    if (this.utilityProvider.isConnected()) {
      this.utilityProvider.showSpinner();
      return this.invokeMCSService('fieldserviceapi/users', 'GET', '').then((response) => {
        this.users = response.data
        this.filterUsers = response.data
        this.utilityProvider.stopSpinner();
        return Promise.resolve(response.data);
      }).catch((err) => {
        this.utilityProvider.stopSpinner();

        this.logger.log(this.fileName, 'getUsers', "Error: " + JSON.stringify(err));
        return Promise.reject(err);
      });
    } else {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getUsers', "Error: You are Offline!!");
      let err = "You are Offline!!";
      return Promise.reject(err);
    }
  };

  /**
   *@author:Prateek
   *Fetch users roles form database
   *Date: 11-26-2018
   */
  getRoles() {
    if (this.utilityProvider.isConnected()) {
      //this.utilityProvider.showSpinner();
      return this.invokeMCSService('fieldserviceapi/roles', 'GET', '').then((response) => {
        this.uniqueRoles = response.data

        this.utilityProvider.stopSpinner();

        return Promise.resolve(response.data);
      }).catch((err) => {
        //this.utilityProvider.stopSpinner();

        this.logger.log(this.fileName, 'getUsers', "Error: " + JSON.stringify(err));
        return Promise.reject(err);
      });
    } else {
      //this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getRoles', "Error: You are Offline!!");
      let err = "You are Offline!!";
      return Promise.reject(err);
    }
    // if (this.utilityProvider.isConnected()) {
    //   this.invokeMCSService('fieldserviceapi/roles', 'GET', '').then((response) => {
    //     this.roles = response.data;
    //     console.log(this.roles, "ROLES")
    //     this.removeDuplicateRoles("UserRoleID");
    //     //return Promise.resolve(response.data);
    //   }).catch((err) => {
    //     this.logger.log(this.fileName, 'roles', "Error: " + JSON.stringify(err));
    //     // return Promise.reject(err);
    //   });
    // } else {
    //   this.logger.log(this.fileName, 'roles', "Error: You are Offline!!");
    //   let err = "You are Offline!!";
    //   //return Promise.reject(err);
    //}
  };

  /**
   *@author:Prateek
   *Remove duplicate role name from array and store in uniques roles

   */
  removeDuplicateRoles(ModuleName) {
    let newArray = [];
    let lookupObject = {};
    for (var i in this.pList) {
      lookupObject[this.pList[i][ModuleName]] = this.pList[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    this.pList = newArray;
    //console.log(this.uniqueRoles, "NEWARRAY");
  }

  /* 11/29/2018 Mayur Varshney:
  * Gets all the Field job that are assigned to the particular Customer.
  * @params customerId
  * @memberof CloudService
  */
  getCustomerHistory(customerId) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/CustomerHistory', 'POST', customerId).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'getCustomerHistory', "Error: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getCustomerHistory', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  }

  submitReport(data) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/saveSubmitReportData', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'submitReport', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"submitReport");
        reject({ result: null });
      }
    });
  }

  submitReportAttachment(data) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/insertReportAttachment', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'submitReportAttachment', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"submitReportAttachment");
        reject({ result: null });
      }
    });
  }

  /**
   * 12/19/2018 Mansi Arora:
   * Send Mail with the pdf attachment.
   * @params contentType as HTML
   * @params content
   * @params subject
   * @params recipient
   * @params cc
   * @params file
   * @memberof CloudService
   */
  mailReport(data) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/sendMail', 'POST', data).then((response) => {
          resolve("success");
        }).catch((err) => {
          this.logger.log(this.fileName, 'mailReport', "Error: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'mailReport', "Error: You are Offline!!");
        reject("failure");
      }
    });
  };


  getReportsAttachmentsSdr(res) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let endpoint = 'fieldserviceapi/getNewReportAttachment?RA_PK_ID=' + res;
        this.invokeMCSService(endpoint, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'getReportsAttachmentsSdr', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"getReportsAttachmentsSdr");
        reject({ result: null });
      }
    });
  }
  /**
   *@author: Prateek (07/02/2019)
   *Submitt detailed report into dbcs
   */
  submitDetailedNotes(data) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let Created_Date = moment.utc(data.Created_Date).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        let Modified_Date = moment.utc(data.Modified_Date).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        let date = moment.utc(data.Modified_Date).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        data.Entry_Date = date;
        data.Created_Date = Created_Date;
        data.Modified_Date = Modified_Date;
        this.invokeMCSService('fieldserviceapi/detailedNotes', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'submitDetailedNotes', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"submitDetailedNotes");

        reject({ result: null });
      }
    });
  }


  submitDetailedNotesAttachment(res) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let Created_Date = moment.utc(res.Created_Date).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        let Modified_Date = moment.utc(res.Modified_Date).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        let date = moment.utc(res.Date).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        res.Created_Date = Created_Date;
        res.Modified_Date = Modified_Date;
        res.Entry_Date = date;
        this.invokeMCSService('fieldserviceapi/detailedNotesAttachments', 'POST', res).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'submitDetailedNotes', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"submitDetailedNotes");

        reject({ result: null });
      }
    });
  }
  /**
   * 01/28/2019 Mayur Varshney:
   * get active timezone on the basis of last updated time
   * @memberof CloudService
   */
  getActiveTimezone(forAdmin) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let url = 'fieldserviceapi/timeZone';
        let queryParam = this.valueProvider.getUser().Last_Updated_Timezone ? "?modifiedDate=" + moment.utc(new Date(this.valueProvider.getUser().Last_Updated_Timezone)).format('YYYY-MM-DDTHH:mm:ss.SSSZ') : "";

        let api = forAdmin ? url : url + queryParam;
        this.invokeMCSService(api, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getActiveTimezone', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getActiveTimezone', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  }

  /**
   * 01/28/2019 Mayur Varshney:
   * submit active timezone on DBCS
   * @memberof CloudService
   */
  submitTimezone(timezoneArr) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/timeZone', 'POST', timezoneArr).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'submitTimezone', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        let err = "Please come online to submit timezones!!";
        this.logger.log(this.fileName, 'submitTimezone', err);
        reject({ error: err });
      }
    });
  }

  /**
   * 
   * @param LastUpdatedDate 
   */
  updatedDateForMCS(LastUpdatedDate) {
    return moment(new Date(LastUpdatedDate)).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  }


  getCustomerData() {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let data = {};
        let LastUpdatedDate = this.valueProvider.getLast_Updated_MST_Customer()
        if (LastUpdatedDate) {
          data = {
            "updateDate": this.updatedDateForMCS(LastUpdatedDate)
          };
        }
        this.invokeMCSService('fieldserviceapi/customers', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'customers', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"customers");
        reject({ result: null });
      }
    });
  }

  /**
   * 02/09/2019 Mayur Varshney
   * submit report attachment on DBCS
   * @memberof CloudService
   */
  submitFCRReportAttachmentOnDBCS(attachmentData) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/fcrAttachments', 'POST', attachmentData).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'customers', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"submitFCRReportAttachmentOnDBCS");
        reject({ result: null });
      }
    });
  }

  getDetailedNotesFromDBCS(res) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        //let data = {};
        // let post_object;
        // for (let key of Object.keys(res)) {
        //   post_object[key] = res[key];
        // }
        // let creds = JSON.stringify(
        //   post_object
        // );
        this.invokeMCSService('fieldserviceapi/getDetailedNotes', 'POST', res).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'getDetailedNotesFromDBCS', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"getDetailedNotesFromDBCS");
        reject({ result: null });
      }
    });
  }

  getDetailedNotesAttachmentDBCS(attachmentid) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        //let data = {};
        // let post_object;
        // for (let key of Object.keys(res)) {
        //   post_object[key] = res[key];
        // }
        // let creds = JSON.stringify(
        //   post_object
        // );
        this.invokeMCSService('fieldserviceapi/detailedNotesAttachments?attachment_id=' + attachmentid, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'submitDetailedNotes', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"getDetailedNotesAttachmentDBCS");
        reject({ result: null });
      }
    });
  }

  /**
   * 02/11/2019 Mayur Varshney
   * download report attachment base64 from DBCS
   * @memberof CloudService
   */
  downloadFCRReportAttachment(attachmentId) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/getfcrAttachments?attachment_id=' + attachmentId, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'downloadFCRReportAttachment', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"downloadFCRReportAttachment");
        reject({ result: null });
      }
    });
  }

  /**
   * 04/01/2019 Mayur Varshney
   * get report days for analytics day window
   * @memberof CloudService
   */
  getAnalyticsReportDays() {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/getAnalyticsReportDays', 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'getReportDays', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"getAnalyticsReportDays");
        reject({ result: null });
      }
    });
  }

  /**
   * 04-09-2019 Gurkirat Singh
   * Fetches the data from DBCS Lookup Table according to last modified date
   *
   * @returns
   * @memberof CloudService
   */
  getLookups() {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        // let lastModifiedDate = this.valueProvider.getLast_Updated_Lookups();
        let lastModifiedDate = this.valueProvider.getLast_Updated_Lookups() ?
          moment.utc(new Date(this.valueProvider.getLast_Updated_Lookups())).format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A') : null;
        let url = "fieldserviceapi/lookups" + (lastModifiedDate ? "?modifiedDate=" + lastModifiedDate : "");
        this.invokeMCSService(url, 'GET', '').then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getLookups', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getLookups', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  };

   submitTimeDbcs(data) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/submitTimeRecords', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'submitTimeDbcs', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"submitTimeDbcs");
        reject({ result: null });
      }
    });
  }
  /**
   *@ Prateek 05/29/2019
   * Delete time entries from dbcs
   */
  deleteDebriefItems(data) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/deleteDebriefItems', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'submitTimeDbcs', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"deleteDebriefItems");
        reject({ result: null });
      }
    });
  }

  getDeletedEntries(lastsynctime) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let queryParam = '?createdBy=' + this.valueProvider.getUser().UserID;
        // queryParam = queryParam;
        if (lastsynctime) {
          // 01-08-2020 -- Mayur Varshney -- convert the lastsynctime as per the current format before converting it into utc
          let date = moment.utc(new Date(moment(lastsynctime,"MM-DD-YYYY HH:mm").format())).format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A');
          queryParam = queryParam + "&modifiedDate=" + date;
        }
        this.invokeMCSService('fieldserviceapi/getDeletedDebriefItems/' + queryParam, 'GET', null).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'getDeletedEntries', "Error in getDeletedEntries: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'getReports', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  }


  /**
   * 06-03-2019 -- Mayur Varshney
   * Update user details on DBCS
   * @param {any} appVersion
   * @param {any} email
   * @returns
   * @memberOf CloudService
   */
  updateUserDetails(appVersion, email) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        let data: any = {
          "currentAppVersion": appVersion,
          "email": email
        }
        this.invokeMCSService('fieldserviceapi/updateUserDetails', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'updateUserDetails', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'updateUserDetails', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  }

  submitLanguageKey(languagePayLoad) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/LanguageKeyMapping', 'POST', languagePayLoad).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'submitLanguageKey', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        let err = "Please come online to Submit the keys!!";
        this.logger.log(this.fileName, 'submitLanguageKey', "Error:" + err);
        reject(err);
      }
    });
  }

  async getDebriefDetails(oscTasks) {
    if (this.utilityProvider.isConnected()) {
      try {
        let data = { tasks: oscTasks }
        let url = 'fieldserviceapi/debriefEntries';
        let response = await this.invokeMCSService(url, 'POST', data);
        return response.data;
      } catch (error) {
        this.logger.log(this.fileName, 'getDebriefDetails', "Error in invokeMCSService: " + error.message);
        throw error;
      }
    } else {
      this.logger.log(this.fileName, 'getDebriefDetails', "Error: You are Offline!!");
      let err = "You are Offline!!";
      throw err;
    }
  }

  addUpdateAddresses(addressObject) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/address', 'POST', addressObject).then((response) => {
          resolve(response.data);
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'updateAddresses', "Error in invokeMCSService: " + JSON.stringify(err));
          reject(err);
        });
      } else {
        this.logger.log(this.fileName, 'updateAddresses', "Error: You are Offline!!");
        let err = "You are Offline!!";
        reject(err);
      }
    });
  }

  getLocation() {
    return { locality: this.valueProvider.getUser().City, region: this.valueProvider.getUser().State, postalCode: this.valueProvider.getUser().Zipcode, country: this.valueProvider.getUser().Country };
  }

  
  /**
   * check Task which belongs to this user or not at OFSC and OSC, if not show message and return to next
   * Rajat 
   * @memberof CloudService
   */
  checkTaskAtOSC(TaskObjectForOSC) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/fieldJobDetails', 'POST', TaskObjectForOSC).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'submitTimezone', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        let err = "Please come online to submit timezones!!";
        this.logger.log(this.fileName, 'submitTimezone', err);
        reject({ error: err });
      }
    });
  }

  submitAllowanceATP(data) {
    return new Promise((resolve, reject) => {
      if (this.utilityProvider.isConnected()) {
        this.invokeMCSService('fieldserviceapi/submitAllowances', 'POST', data).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          this.logger.log(this.fileName, 'submitAllowances', "Error: " + JSON.stringify(err));
          reject({ error: err });
        });
      } else {
        //this.submitProvider.displayOfflineError(this.fileName,"submitTimeDbcs");
        reject({ result: null });
      }
    });
  }

}
