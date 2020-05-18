import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { CloudService } from '../../providers/cloud-service/cloud-service';
import { ValueProvider } from '../../providers/value/value';
import { LoggerProvider } from '../../providers/logger/logger';
import { UtilityProvider } from '../../providers/utility/utility';
import { TransformProvider } from '../../providers/transform/transform';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment-timezone';
import { Events, Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import * as Enums from '../../enums/enums';
import { AttachmentProvider } from '../attachment/attachment';
import { AppVersion } from '@ionic-native/app-version';
import { LocalServiceSdrProvider } from '../local-service-sdr/local-service-sdr';
import { FileUpdaterProvider } from '../file-updater/file-updater';
import * as _ from 'lodash';
import { FetchProvider } from './fetch/fetch';
import { SubmitProvider } from './submit/submit';

/**
 * Sync Provider handles all the operations related to Syncing of everything to and from MCS, OSC and OFSC.
 * This includes Getting data from MCS, OSC and OFSC and saving it to the Mobile App DB,
 * Submitting data to MCS and OSC and updating the ID's and Status back to Mobile App DB,
 * Deletion of records from mobile app if deleted from OSC and OFSC.
 * Handling error during sync process by displaying error triangle near sync icon by calling handleError method passing(filename, function name, error message).
 * @export
 * @class SyncProvider
 * @author Gurkirat Singh, Mayur Varshney
 */
@Injectable()
export class SyncProvider {
  fileName: any = "SyncProvider";
  lastSyncTimeFormat: any = "MM-DD-YYYY HH:mm";
  lastSyncTime: any;
  currentSyncLogId: any;
  currentSyncStartTime: any;
  isAutoSyncing: any = false;
  isUserLoggedIn: any;
  errors: any[] = [];
  errorLength: number;
  // 08/28/2018 Rizwan Haider - For future use.
  initSyncCalled: any = false;
  permissions: any;
  attachmentService: AttachmentProvider;
  appVersion: any;
  fetchProvider: FetchProvider;
  submitProvider: SubmitProvider;
  scheduleSyncTimeout: any;
  scheduleSyncInterval:any;
  checksync = false;

  constructor(private network: Network, public injector: Injector,
    public translateService: TranslateService, public localServiceSDR: LocalServiceSdrProvider,
    public events: Events, public http: HttpClient,
    public storage: Storage, public logger: LoggerProvider, private platform: Platform, public localService: LocalServiceProvider,
    public utilityProvider: UtilityProvider, public transformProvider: TransformProvider, public cloudService: CloudService,
    public valueProvider: ValueProvider, public toastController: ToastController, public appVersionUtil: AppVersion,
    private fileUpdater: FileUpdaterProvider) {

    setTimeout(() => this.attachmentService = injector.get(AttachmentProvider), 500);
    setTimeout(() => this.fetchProvider = injector.get(FetchProvider));
    setTimeout(() => this.submitProvider = injector.get(SubmitProvider));
    // 09/10/2018 Suraj Gorai -- if app goes offline then sync spinner stop and show interrupt signal
    this.network.onDisconnect().subscribe(() => {
      if (this.isAutoSyncing) {
        this.isAutoSyncing = false;
        this.errorLength = 1;
      }
    });

    appVersionUtil.getVersionNumber().then((res) => {
      this.logger.log(this.fileName, 'constructor', "appVersion ==> " + this.fileUpdater.localDBConfig.softVersion);
      this.appVersion = res;
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'constructor', 'Error in getVersionNumber : ' + JSON.stringify(error));
    });

    // 08/13/2018 Zohaib Khan -- Checking if online or offline. If offline for more than 30 mins than start a sync.
    this.network.onConnect().subscribe(() => {
      if(valueProvider.getUser() && valueProvider.getUser().UserID) this.performSyncAppStart();
    });
    // 09/04/2018 Rizwan Haider - If resumed from background and sync is not in progess then start a schedule sync.
    this.platform.resume.subscribe(() => {
      if (!this.isAutoSyncing) {
        if(valueProvider.getUser() && valueProvider.getUser().UserID) this.scheduleSync();
      }
    });

    /**
     * When User Switch or focus out the app than trigger
     */
    let self = this;
    this.platform.ready().then(() => {
      window.onfocus = function () {
        if (!self.isAutoSyncing) {
        self.checksync = true;
        }
      }
    });

    /**
     * Schedule Interval for the sync process and check it again if user
     */
    this.scheduleSyncInterval = setInterval(function () {
      if (self.checksync) {
        if (!this.isAutoSyncing) {
          if (valueProvider.getUser() && valueProvider.getUser().UserID) self.scheduleSync()
        }
        clearInterval(this.scheduleSyncInterval);
        self.checksync = false;
      }
    }, 500);
  }
  
  /**
   * 07/23/2018 -- Getter for lastSyncTime
   *
   * @returns lastSyncTime : Last Successful Sync start time
   * @memberof SyncProvider
   * @author Gurkirat Singh
   */
  getLastSyncTime() {
    return this.lastSyncTime;
  };

  /**
   * 07/23/2018 -- Getter for isAutoSyncing
   *
   * @returns isAutoSyncing : Flag to check if Sync is in progress
   * @memberof SyncProvider
   * @author Gurkirat Singh
   */
  ifAutoSyncing() {
    return this.isAutoSyncing;
  }

  // Rajat

  /**
 * 07/30/2019
 * @requires isAutoSyncing : Flag to check if Sync is in Progress
 * @memberof Sync
 * @author Restructured By Rajat
 * @description  // Subtract 30 mins from current time.
 * 
 */
  syncExactTime() { //halfAnHourAgo
    return moment().subtract(Enums.syncConfig.syncDuration, Enums.syncConfig.syncUnit).toDate().getTime();
  }

  /**
 * 07/30/2019
 * @requires isAutoSyncing : Flag to check if Sync is in Progress
 * @memberof Sync
 * @author Restructured By Rajat
 * @description  // Checking if last sync time is before half an hour ago. If yes than start sync.
 * 
 */
  calculateDiffFromLastSync() {
    let nextSyncDiff = moment(this.getLastSyncTime()).isBefore(moment(this.syncExactTime()));
    this.logger.log(this.fileName, "calculateDiffFromLastSync", nextSyncDiff);
    return nextSyncDiff;
  }


  /**
  * 07/30/2019
  * @requires isAutoSyncing : Flag to check if Sync is in Progress
  * @memberof Sync
  * @author Restructured By Rajat
  * @description  //How much time left for sync start for next call, cal the diff from last sync time
  * 
  */
  getdiffTimeForSync() { //waitTime
    this.logger.log(this.fileName, "getdiffTimeForSync", moment(this.getLastSyncTime()).diff(moment(this.syncExactTime())));

    return moment(this.getLastSyncTime()).diff(moment(this.syncExactTime()));
  }

  /**
  * 07/30/2019
  * @requires isAutoSyncing : Flag to check if Sync is in Progress
  * @memberof Sync
  * @author Restructured By Rajat
  * @description  //How much time left for sync start for next call, cal the diff from last sync time
  * 
  */
  waitForSyncSchedule(currentTime) { //waitTime
    this.logger.log(this.fileName, "waitForSyncSchedule", currentTime);

    return moment(this.getLastSyncTime()).diff(moment(currentTime));
  }


  /**
  * 07/30/2019
  * @requires isAutoSyncing : Flag to check if Sync is in Progress
  * @memberof Sync
  * @author Restructured By Rajat
  * @description  //How much time left for sync start for next call, cal the diff from last sync time
  * 
  */
  getSyncPendingOperation(key: any = "") { //waitTime
    let operationSync;
    if (key) operationSync = sessionStorage.getItem("pendingOperations");
    operationSync = sessionStorage.getItem(key);
    return operationSync;
  }

  /**
 * 07/31/2019
 * @requires isAutoSyncing : Flag to check if Sync is in Progress
 * @memberof Sync
 * @author Restructured By Rajat
 * @description  //All dependent calls are happened and gethar all calls in one place and return that object to relevant places, to avoid the calls again - again
 * 
 */
  async syncCalculatedTime() {
    let syncTime = this.syncExactTime(); //halfAnHourAgo
    let nextSyncDiff = this.calculateDiffFromLastSync(); //beforeHalfHour
    let waitForSyncSchedule = this.waitForSyncSchedule(syncTime)
    let lastSyncTime = moment(new Date(moment(this.getLastSyncTime(), this.lastSyncTimeFormat))).toDate().getTime();
    let diffFromLastSync = moment(syncTime).isBefore(lastSyncTime);
    let collection = { syncTime, nextSyncDiff, waitForSyncSchedule, lastSyncTime, diffFromLastSync }
    this.logger.log(this.fileName, "syncCalculatedTime", JSON.stringify(collection));
    return collection;
  }

  /**
   * @memberof sync
   * @author Rajat
   * @default: Clear Last Timer Schedule Next SYNC Interval (Ref: DFD)
   * @description: 
   * It is a scheduler, To create a Stack for next Sync, 
   * whatever time we are passing at arugments.
   */
  async scheduleNextSync(waitingTimeForNextSchedule = null) {
    try {
      if (!waitingTimeForNextSchedule) waitingTimeForNextSchedule = Enums.syncConfig.syncDuration
      clearTimeout(this.scheduleSyncTimeout)
      this.scheduleSyncTimeout = setTimeout(() => {
        if (!this.ifAutoSyncing() && this.isUserLoggedIn) this.initiateSynch();
        
      }, waitingTimeForNextSchedule);

      // this.logger.log(this.fileName, 'scheduleNextSync', 'Error in scheduleNextSync : ' + JSON.stringify(waitingTimeForNextSchedule));

    } catch (error) {
      this.logger.log(this.fileName, 'scheduleNextSync', 'Error in scheduleNextSync : ' + JSON.stringify(error));
    }

  }

  /**
   * @memberof sync
   * @author Rajat
   * @default: Clear Last TimeOut (Ref: DFD)
   * @description: 
   * It is used for to clear the SetTimeOut from Stack, 
   * But only for sync Stack, not for whole app Timeout's.
   */
  async clearLastSetTimeOut(): Promise<any> {
    try {
      if (this.scheduleSyncTimeout) clearTimeout(this.scheduleSyncTimeout);
    } catch (error) {
      this.logger.log(this.fileName, 'clearLastSetTimeOut', 'Error in clearLastSetTimeOut : ' + JSON.stringify(error));
    }
  }


  /**
   * @memberof
   * @author
   * @description
   */
  public async performSyncLogin() {
    this.performSyncAppStart()
    this.logger.log(this.fileName, "performSyncLogin", this.performSyncAppStart());
  }

  /**
  * @memberof
  * @author
  * @description
  */
  public async performSyncManual() {
    try {
      this.clearLastSetTimeOut();
      this.initiateSynch();
    } catch (error) {
      this.handleError(this.fileName, "performSyncManual", "Error in performSyncManual: " + JSON.stringify(error));
    }
  }

  /**
  * @memberof sync
  * @author Rajat
  * @default: Perform sync operation when app is started
  * @description:-
  * When application started and user already logged in,
  * Perform Sync after checking DB Sync_Logs.
  * Get Last Sync Time > Calculate  Difference Between Last SYNC & (Current Time-30 min)
  */
  async performSyncAppStart() {
    this.logger.log(this.fileName, "performSyncAppStart: performSyncAppStart", "performSyncAppStart");
    this.processSyncRequest()
  }

  /**
  * @memberof
  * @author
  * @description
  */
  async processSyncRequest() {
    let getLastSyncTime = await this.setLastSyncStartTime();
    let getLastSyncStatus = await this.setLastSyncStatus();
    let calculateDiffSyncTime = await this.calculateDiffFromLastSync();
    try {
      if (getLastSyncTime || getLastSyncStatus) {
        if (calculateDiffSyncTime || getLastSyncStatus) {
          this.clearLastSetTimeOut();
          this.scheduleSync();
        } else {
          this.scheduleNextSync(this.getdiffTimeForSync());
        }
        this.logger.log(this.fileName, "processSyncRequest: calculateDiffSyncTime 321", calculateDiffSyncTime);

      } else {
        this.scheduleSync();
        this.logger.log(this.fileName, "processSyncRequest: Line:326 calculateDiffSyncTime", calculateDiffSyncTime);

      }
      this.logger.log(this.fileName, "processSyncRequest : getLastSyncTime", getLastSyncTime);

    } catch (error) {
      this.logger.log(this.fileName, 'processSyncRequest', 'Error in processSyncRequest : ' + JSON.stringify(error));
    }
  }

  /**
   * 07/23/2018 -- Gets the Last Successful sync from DB and sets the Start time
   *
   * @memberof SyncProvider
   * @author Gurkirat Singh
   */
  public async setLastSyncStartTime() {
    try {
      let syncStatus: any = await this.localService.getLastSyncLog();
      try {
        if (syncStatus) {
          this.lastSyncTime = moment(syncStatus.Start_Date).format(this.lastSyncTimeFormat);
          return true;
        } else {
          this.lastSyncTime = null;
          return false;
        }
      }
      catch (error) {
        this.handleError(this.fileName, "setLastSyncStartTime", JSON.stringify(error));
        return false;
      }
    }
    catch (error) {
      this.logger.log(this.fileName, 'setLastSyncStartTime', 'Error in setLastSyncStartTime : ' + JSON.stringify(error));
      return false;
    };
  }


  
  /**
   * 07/23/2018 -- Gets the Last Unsuccessful sync from DB and sets the Start time
   *
   * @memberof SyncProvider
   * @author Rajat Gupta
   */
  public async setLastSyncStatus() {
    try {
      let syncStatus: any = await this.localService.getLastSyncLogTime();
      if (syncStatus && syncStatus.Status != 'Success') {
        return true;
      } else {
        return false;
      }
    }
    catch (error) {
      this.logger.log(this.fileName, 'setLastSyncStatus', 'Error in setLastSyncStatus : ' + JSON.stringify(error));
      return false;
    };
  }

  /**
   * 07/23/2018 -- Inserts an entry with the Sync Start Time
   *
   * @memberof SyncProvider
   * @author Gurkirat Singh
   */
  insertSyncLog() {
    this.currentSyncStartTime = new Date();
    this.localService.insertSyncLog(this.currentSyncStartTime).then((res: any) => {
      this.currentSyncLogId = res;
    }).catch((err) => {
      this.handleError(this.fileName, "insertSyncLog", JSON.stringify(err));
    });
  }

  /**
   * 07/23/2018 -- Updates the Sync Log entry with End Time and Status
   *
   * @memberof SyncProvider
   * @author Gurkirat Singh
   */
  updateSyncLog() {
    try {
      let syncLog: any = {};
      syncLog.ID = this.currentSyncLogId;
      syncLog.End_Date = new Date();
      syncLog.Status = "Success";
      //08/19/2018 Zohaib: TODO Status should be change according to error.
      // if (Status == "Success") {
      this.lastSyncTime = moment(this.currentSyncStartTime).format(this.lastSyncTimeFormat);
      // }
      this.localService.updateSyncLog(syncLog);
    } catch (error) {
      this.handleError(this.fileName, "updateSyncLog", error);
    }
  }

  /**
   * Initiates Sync and Does following functions
   * 1. Gets the deleted record from OSC, and deletes it from the mobile app.
   * 2. Submits the Offline created data to OSC as well as MCS and updates the ID and Status back to mobile app
   * 3. Gets all the data according to Last Updated Flag from OSC, MCS and OFSC and saves it to the Mobile App
   *
   * @memberof SyncProvider
   * @author Gurkirat Singh
   */
  private async initiateSynch() {
    try {
      this.clearLastSetTimeOut();
      this.setupSync();
      let result = await this.validateUserDeviceAndToken();
      if(result) {
        await this.setUsersAppVersion();
        this.fetchProvider.fetchData();
        this.submitProvider.submitData();
        this.utilityProvider.checkVersionFromCofig();
      }


    } catch (error) {
      this.handleError(this.fileName, "initiateSynch", error.message);
      this.completeSync();
      this.utilityProvider.checkVersionFromCofig();
    } finally {
    }
  }

  async validateUserDeviceAndToken() {
    let result = false;
    let isSameDeviceLogin = await this.checkSingleInstanceLogin();
    if (!isSameDeviceLogin) {
      this.isAutoSyncing = false;
      this.isUserLoggedIn = false;
      this.utilityProvider.forcelogout(Enums.Messages.Force_Logout_Message);
      return result;
    }
    await this.refreshTokenIfNotValid();
    result = true;
    return result;
  }

  async completeSync() {
    this.isAutoSyncing = false;
    this.updateSyncLog();
    await this.localService.refreshTaskList();
    this.events.publish('refreshPageData', null);
  }

  private setupSync() {
    this.errors = [];
    this.errorLength = 0;
    this.isAutoSyncing = true;
    this.permissions = this.valueProvider.getPermissions();
    this.insertSyncLog();
    this.utilityProvider.endCurrentSession();
    this.utilityProvider.resetSession();
  }

  private async checkSingleInstanceLogin(): Promise<boolean> {
    let result = false;
    try {
      result = await this.cloudService.checkUser();
      console.log(result)
      return result;
    } catch (error) {
      console.log(error)
      this.handleError(this.fileName, "checkSingleInstanceLogin", error);
      throw error;
    }
  }

  private async refreshTokenIfNotValid() {
    try {
      try {
        await this.validateToken();
      } catch (error) {
        if (typeof error == 'string') {
          this.logger.log(this.fileName, "validateToken", "Token Expired. Refreshing again");
          await this.cloudService.refreshToken(error);
        } else {
          this.logger.log(this.fileName, "refreshTokenIfNotValid", error);
          throw error;
        }
      }
    } catch (error) {
      this.handleError(this.fileName, "refreshTokenIfNotValid", error);
      throw error;
    }
  }

  private async validateToken() {
    try {
      await this.utilityProvider.checkExpireToken();
    } catch (error) {
      this.logger.log(this.fileName, "validateToken", error);
      throw error;
    }
  }

  private setUsersAppVersion() {
    try {
      let currentAppVersion = this.fileUpdater.localDBConfig.softVersion;
      let userEmail = this.valueProvider.getUser().Email;
      this.cloudService.updateUserDetails(currentAppVersion, userEmail);
    } catch (error) {
      this.logger.log(this.fileName, "setUsersAppVersion", error);
    }
  }

  /**
   * 08/13/2018 Zohaib Khan
   * Start sync after every 30 mins. This method will activate once previous sync will complete.
   * 08/24/2018 kamal -- passed isLogin true inside scheduleSync when login first time with any user and set it false to bring LOV only on login
   * 08/28/2018 Suraj Gorai - Check token expire time before 5 min on background autosync.
   * 08/30/2018 - Suraj Gorai- Remove  appclose() and add events publish appLogout()   * 
    // 09/04/2018 Rizwan Haider - Applied half hour check to reschedule sync and run it. It also based on login status and sync in progress status
   */
  async scheduleSync(isLogin = false) {
    this.valueProvider.setIsLogin(isLogin);
    let SyncStartStatus = await this.syncCalculatedTime();
    let manualSync:any = await this.setLastSyncStatus();
    if(this.isUserLoggedIn){
      if ((isLogin || !SyncStartStatus.diffFromLastSync || manualSync)) {
        setTimeout(() => {
          if (!this.ifAutoSyncing()) {
            this.scheduleSync();
          }
        }, Enums.syncConfig.waitTime);
        this.logger.log(this.fileName, "scheduleSync", "scheduleSync is Init From Scheules :- " + Enums.syncConfig.waitTime);
        if (this.utilityProvider.isConnected()) {
          this.initiateSynch();
        } else {
          if (this.getSyncPendingOperation() == 'true') {
            this.initSyncCalled = true;
          }
        }
      }
      else {
        this.logger.log(this.fileName, "scheduleSync", "App Resumed, Checking Scheduler :: Last sync time less than 30 minutes, Skipping sync...");
      };
    }
  }


  //08/23/2018 Mayur Varshney -- Apply method for error handling, occurs if any API or database calling fails or user switch to offline mode during sync process.
  handleError(fileName, fnName, error) {

    try {
      console.log(error)

      if (!error) {
        console.log("Issue in Passing the error Message to HandleError Function");
        this.logger.log(this.fileName, "handleError", "handleError");
        return
      }

      let logFileError = JSON.parse(JSON.stringify(error));
      let customError = JSON.parse(JSON.stringify(error));

      if (customError.data && customError.data.error) {
        customError = customError.data.error;
        error = JSON.parse(JSON.stringify(customError));
      }

      if (!customError.source) {
        let message = customError.message ? customError.message : '';
        customError = {
          "httpCode": "",
          "userMessage": "",
          "source": ""
        }
        if (logFileError.data.status) {
            customError["httpCode"] = logFileError.data.status,
            customError["userMessage"] = logFileError.data.title,
            customError["source"] = "MCS"
            customError["message"] = logFileError.data.title
            customError["logFile"] = logFileError
        } else {
          customError["httpCode"] = Enums.errorCodes.unknownMessage,
            customError["userMessage"] = Enums.errorMessages.unknownMessage,
            customError["source"] = Enums.errorSource.unknownMessage
          customError["message"] = message
          customError["logFile"] = logFileError
  
        }
  
  
        error = JSON.parse(JSON.stringify(customError));
      }
  
      let interruptSyncJson = {
        "errFile": fileName,
        "errFunction": fnName,
        "errMsg": error
      }
  
      if (this.isAutoSyncing) {
        this.errors.push(interruptSyncJson);
        this.errorLength = this.errors.length;
        this.logger.log(fileName, 'handleError', "Error interrupting sync process :- {{\nError occurs in function :- " + interruptSyncJson.errFunction + " \nMsg :- " + JSON.stringify(interruptSyncJson.errMsg) + "\n}}");
      } else {
        this.logger.log(fileName, interruptSyncJson.errFunction, JSON.stringify(interruptSyncJson.errMsg));
      }
    }catch(error){
      this.logger.log(this.fileName, "handleError", error);     
    }
    
  }

  displayOfflineError(fileName, fnName) {
    let error;
    let customError = {
      "httpCode": "",
      "userMessage": "",
      "source": ""
    }

    customError["httpCode"] = Enums.errorCodes.unknownMessage,
      customError["userMessage"] = Enums.errorMessages.offlineConnectivity,
      customError["source"] = Enums.errorSource.connectivity
    error = JSON.parse(JSON.stringify(customError));


    let interruptSyncJson = {
      "errFile": fileName,
      "errFunction": fnName,
      "errMsg": error
    }
    this.errors.push(interruptSyncJson);
  }


}
