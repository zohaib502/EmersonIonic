import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Injector } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { ValueProvider } from '../value/value';
import { TransformProvider } from '../transform/transform';
// import { SQLite } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { LoggerProvider } from '../../providers/logger/logger';
import * as Enums from '../../enums/enums';
import * as moment from "moment";
import { CustomerDbProvider } from '../customer-db/customer-db';
import { FileUpdaterProvider } from "../file-updater/file-updater";
import { SqliteDbCopy } from "@ionic-native/sqlite-db-copy";
import { File } from "@ionic-native/file";
declare let cordova: any;

/*
  Generated class for the LocalServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalServiceProvider {
  flag = true;
  TaskList: any[] = [];
  TimeList: any[] = [];
  workType: any[] = [];
  jobName: any[] = [];
  chargeType: any[] = [];
  chargeMethod: any[] = [];
  items: any[] = [];
  overTime: any[] = [];
  shiftCode: any[] = [];
  fileName: any = 'Local_Service';

  private valueProvider: ValueProvider;
  constructor(injector: Injector, public transformProvider: TransformProvider, public http: HttpClient, public dbctrl: DatabaseProvider, public platform: Platform, public logger: LoggerProvider, public customerDbProvider: CustomerDbProvider, public fileUpdater: FileUpdaterProvider, public sqLiteCopyDb: SqliteDbCopy, public file: File) {
    setTimeout(() => this.valueProvider = injector.get(ValueProvider));
  }

  public getUserFeedback() {
    let query = "SELECT * FROM User_Feedback where Sync_Status = 'true' order by Feedback_Date asc";
    return this.getList(query, [], "getUserFeedback");
  }

  async getTimeDataToTempTime(jobNumber, weekStart?, weekEnd?) {
    let query = "Insert into Time_Temp SELECT * FROM Time WHERE Job_Number = ?";
    let queryParams = [];
    queryParams.push(jobNumber);
    if (weekStart && weekEnd) {
      query = query + " and EntryDate between ? And ? ";
      queryParams.push(moment(weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD'));
      queryParams.push(moment(weekEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD'));
    }
    let timeTemp = await this.getList(query, queryParams, "getTimeDataToTempTime");
    return timeTemp;
  }

  dropTempTime() {
    return this.getList("Delete from Time_Temp", [], "dropTempTime");
  }

  /**
   * Getting list of service request from database.
   *
   * 07/27/2018 Mayur Varshney
   * Change select query for getting all columns from Task table combine with InstallBase_Sync_Status (Pending or Synced) for particular Field Job
   * previous query is  = "query = "SELECT * FROM Task WHERE ResourceId = ? AND Task_Status != ?""
   *
   * 11/12/18 Suraj Gorai- Hide 15 days old task from list and which is completed
   * @memberOf LocalServiceProvider
   */
  public async getTaskList() {
    // 04/29/2019 -- Mayur Varshney -- get job on the basis of 15 days after DebriefSubmissionDate
    let res = await this.getLastSyncLog();
    let lastSyncTime = this.getLastSyncTime(res);
    let query = `SELECT T.*,CASE( SELECT count( * ) FROM InstallBase WHERE Task_Number = T.Task_Number AND Sync_Status = 'false' )
    WHEN 0 THEN 'I' ELSE 'P' END IB_Install_Base, (Select REPORTSTATUS from SDRREPORT where ReportID=T.ReportID) as ReportStatus FROM Task T
    WHERE T.ResourceId = ? AND T.Task_Status != ? AND T.Task_Status != ? AND
    (CASE WHEN StatusID = ? THEN T.DebriefSubmissionDate > ? ELSE 1 = 1 END);`;
    let queryParams = [this.valueProvider.getResourceId(), "Cancelled", "Closed", Enums.Jobstatus.Completed_Awaiting_Review, lastSyncTime];
    this.TaskList = await this.getList(query, queryParams, "getTaskList");
    return this.TaskList;
  }

  private getLastSyncTime(res) {
    let lastSyncTime;
    if (res) {
      lastSyncTime = moment(res.Start_Date).subtract(15, "days").format("YYYY-MM-DDTHH:mm:ss.000Z");
    } else {
      lastSyncTime = moment.utc().subtract(15, "days").format("YYYY-MM-DDTHH:mm:ss.000Z");
    }
    return lastSyncTime;
  }

  async getTaskNumberListToFetch() {
    let res = await this.getLastSyncLog();
    let lastSyncTime = this.getLastSyncTime(res);
    let query = "SELECT T.Task_Number FROM Task T WHERE T.ResourceId = ? AND T.Task_Status != ? AND T.Task_Status != ? AND (CASE WHEN StatusID = ? THEN T.DebriefSubmissionDate > ? ELSE 1 = 1 END)"
    let queryParams = [this.valueProvider.getResourceId(), "Cancelled", "Closed", Enums.Jobstatus.Completed_Awaiting_Review, lastSyncTime];
    return await this.getList(query, queryParams, "getTaskNumberListToFetch");
  }

  // 08/30/2018 -- Mayur Varshney -- remove unused function getTaskInfo(params)

  /*
     Calling tasklisr method if their is no task in the list.
     */
  getallTaskList() {
    if (this.TaskList.length == 0) {
      this.getTaskList();
    }
    return this.TaskList;
  }


  /**
   *Gets the list of reports based on logged in userid.
   *
   * @param {*} userId
   * @returns
   * @memberof LocalServiceProvider
   */
  //02-01-2018 Radheshyam kumar Added customer db for mst_customer access.
  //03-14-2019 Puneet gandhi/Radheshyam kumar Added "TaskStatus" to get this stateus on filted job so that fcr completed and sdr incomplete will distinguish.
  public getReports(userId) {
    let query = "Select REPORTID,REPORTSTATUS,REPAIRDATE,JOBID,CUSTOMERNAME,WORLDAREA,CREATEDDATE,BUSINESSGROUP,SELECTEDPROCESS,FIELDSERVICEDIANOSTICONLY from SDRREPORT where CREATEDBY=? and ISSTANDALONE=?"
    let queryParams = [userId, 'Y'];
    return this.getList(query, queryParams, "getReports");
  }

  async insertUserList(response) {
    let res = await this.getList(`SELECT * FROM User WHERE ID = ${response.ID}`, [], "insertUserList");
    if (res.length > 0) return await this.updateUserValues(response);
    else return await this.insertUser(response);
  };

  insertUser(userObject) {
    // //console.log("INSERTUSER", userObject)
    //this.logger.log(this.fileName,'function',"USER INSERT OBJECT =====> " + JSON.stringify(userObject));
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        //07272018 KW Added Last_Updated_AddressAuditLog to bring AddressAuditLog on the basis of last updated date
        //08/20/2018 Mayur Varshney -- insert prepared state for lastModified date i.e. Last_Updated_Language_Key_Mappings, Last_Updated_Languages
        //08/20/2018 Kamal Added Last_Updated_Addresses,Last_Updated_Feedbacks,Last_Updated_FeedbackQuestions to bring Address, feedbacks, feedbackQuestions resp on the basis of last updated date
        // 01-29-2019 -- Mansi Arora -- insert timeZoneIANA while creating user
        // 01-30-2019 -- Mansi Arora -- insert country, state, city, zipcode while creating user
        let sqlInsert = "INSERT INTO User(ID,ClarityID,Currency,Default_View,Email,Language,LanguageId,Name,OFSCId,Password,Time_Zone,Type,User_Name,Work_Day,Work_Hour,Login_Status,Sync_Status,Last_Updated,Last_Updated_Task,Last_Updated_Internal,Last_Updated_Task_Detail,Last_Updated_Project,Last_Updated_LOV,Last_Updated_SR,Last_Updated_Delete,encrypt,userName,userRole,UserID,DefaultBUID,Last_Updated_Translation,Last_Updated_AddressAuditLog,Last_Updated_Language_Key_Mappings,Last_Updated_Languages,Last_Updated_Addresses,Last_Updated_Feedbacks,Last_Updated_FeedbackQuestions,WorldAreaID,Last_Updated_Timezone,timeZoneIANA, Country, State, City, Zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        insertValues.push(userObject.ID);
        insertValues.push(userObject.ClarityID);
        insertValues.push(userObject.Currency);
        insertValues.push(userObject.Default_View);
        insertValues.push(userObject.Email);
        insertValues.push(userObject.Language);
        insertValues.push(userObject.LanguageId);
        insertValues.push(userObject.Name);
        insertValues.push(userObject.OFSCId);
        insertValues.push(userObject.Password);
        insertValues.push(userObject.Time_Zone == '(UTC+01:00) Paris' ? '(UTC+01:00) Paris - Central European Time (CET)' : userObject.Time_Zone);
        insertValues.push(userObject.Type);
        insertValues.push(userObject.User_Name);
        insertValues.push(userObject.Work_Day);
        insertValues.push(userObject.Work_Hour);
        insertValues.push(userObject.Login_Status);
        insertValues.push(userObject.Sync_Status);
        insertValues.push(userObject.Last_Updated);
        insertValues.push(userObject.Last_Updated_Task);
        insertValues.push(userObject.Last_Updated_Internal);
        insertValues.push(userObject.Last_Updated_Task_Detail);
        insertValues.push(userObject.Last_Updated_Project);
        insertValues.push(userObject.Last_Updated_LOV);
        insertValues.push(userObject.Last_Updated_SR);
        insertValues.push(userObject.Last_Updated_Delete);
        insertValues.push(userObject.encrypt);
        insertValues.push(userObject.userName);
        insertValues.push(userObject.userRole);
        insertValues.push(userObject.UserID ? parseInt(userObject.UserID) : null);
        insertValues.push(userObject.DefaultBUID);
        insertValues.push(userObject.Last_Updated_Translation);
        insertValues.push(userObject.Last_Updated_AddressAuditLog);
        insertValues.push(userObject.Last_Updated_Language_Key_Mappings);
        insertValues.push(userObject.Last_Updated_Languages);
        insertValues.push(userObject.Last_Updated_Addresses);
        insertValues.push(userObject.Last_Updated_Feedbacks);
        insertValues.push(userObject.Last_Updated_FeedbackQuestions);
        insertValues.push(userObject.WorldAreaID);
        insertValues.push(userObject.Last_Updated_Timezone);
        // 01-29-2019 -- Mansi Arora -- insert timeZoneIANA while creating user
        insertValues.push(userObject.timeZoneIANA);
        // 01-30-2019 -- Mansi Arora -- insert country, state, city, zipcode while creating user
        // 01-31-2019 -- Mansi Arora -- country, state, city, zipcode default value null
        insertValues.push(userObject.country ? userObject.country : null);
        insertValues.push(userObject.state ? userObject.state : null);
        insertValues.push(userObject.city ? userObject.city : null);
        insertValues.push(userObject.zipcode ? userObject.zipcode : null);
        transaction.executeSql(sqlInsert, insertValues, (tx, res) => {

          //this.logger.log(this.fileName,'insertUser',"USER INSERT ID: " + res.insertId);

          resolve(res);

        }, (tx, error) => {
          this.logger.log(this.fileName, 'insertUser', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'insertUser', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  // 08/20/2018 Mayur Varshney -- change method name according to flow
  lastUpdatedLanguageKeyMappings(userObject) {
    return new Promise((resolve, reject) => {
      //this.logger.log(this.fileName,'function',"USER UPDATE OBJECT =====> " + JSON.stringify(userObject));
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE User SET Last_Updated_Language_Key_Mappings = ? WHERE ID = ?";
        insertValues.push(userObject.Last_Updated_Language_Key_Mappings);
        insertValues.push(userObject.ID);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          //this.logger.log(this.fileName,'function',"USER ROW AFFECTED: " + res.rowsAffected);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'lastUpdatedLanguageKeyMappings', 'Error: ' + JSON.stringify(error.message));
        });
      }, (error) => {
        this.logger.log(this.fileName, 'lastUpdatedLanguageKeyMappings', 'Error TXN: ' + JSON.stringify(error.message));
      });
    });
  };

  // 08/20/2018 Mayur Varshney -- adding function to store last modified date for translation table with respect to user id
  lastUpdatedTranslation(userObject) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE User SET Last_Updated_Translation = ? WHERE ID = ?";
        insertValues.push(userObject.Last_Updated_Translation);
        insertValues.push(userObject.ID);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
        }, (tx, error) => {
          this.logger.log(this.fileName, 'lastUpdatedTranslation', 'Error: ' + JSON.stringify(error.message));
        });
      }, (error) => {
        this.logger.log(this.fileName, 'lastUpdatedTranslation', 'Error TXN: ' + JSON.stringify(error.message));
      });
    });
  }

  // 08/20/2018 Mayur Varshney -- adding function to store last modified date for language table with respect to user id
  lastUpdatedLanguages(userObject) {
    let query = "UPDATE User SET Last_Updated_Languages = ? WHERE ID = ?";
    let queryParams = [userObject.Last_Updated_Languages, userObject.ID];
    return this.insertData(query, queryParams, "lastUpdatedLanguages");
  }

  updateUserValues(userObject) {

    //this.logger.log(this.fileName,'function',"USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {

        let insertValues = [];

        // 01-29-2019 -- Mansi Arora -- update timeZoneIANA while updating user
        // 01-30-2019 -- Mansi Arora -- country, state, city, zipcode while updating user
        let sqlUpdate = "UPDATE User SET ClarityID = ?, Currency = ?, Default_View = ?, Email = ?, Language = ?, LanguageId = ?, Name = ?, OFSCId = ?, Password = ?, Time_Zone = ?, Type = ?, User_Name = ?, Work_Day = ?, Work_Hour = ?, Login_Status = ?, Sync_Status = ?, Last_Updated = ?, Last_Updated_Task = ?, Last_Updated_Internal = ?, Last_Updated_Task_Detail = ?, Last_Updated_Project = ?, Last_Updated_LOV = ?, Last_Updated_SR = ?, Last_Updated_Delete = ?, encrypt = ?, userName = ?, userRole = ?, UserID = ?, DefaultBUID = ?, timeZoneIANA = ?, Country = ?, State = ?, City = ?, Zipcode = ?  WHERE ID = ?";
        insertValues.push(userObject.ClarityID);
        insertValues.push(userObject.Currency);
        insertValues.push(userObject.Default_View);
        insertValues.push(userObject.Email);

        insertValues.push(userObject.Language);
        insertValues.push(userObject.LanguageId);
        insertValues.push(userObject.Name);
        insertValues.push(userObject.OFSCId);
        insertValues.push(userObject.Password);
        insertValues.push(userObject.Time_Zone);

        insertValues.push(userObject.Type);
        insertValues.push(userObject.User_Name);
        insertValues.push(userObject.Work_Day);
        insertValues.push(userObject.Work_Hour);
        insertValues.push(userObject.Login_Status);
        insertValues.push(userObject.Sync_Status);
        insertValues.push(userObject.Last_Updated);
        insertValues.push(userObject.Last_Updated_Task);
        insertValues.push(userObject.Last_Updated_Internal);
        insertValues.push(userObject.Last_Updated_Task_Detail);
        insertValues.push(userObject.Last_Updated_Project);
        insertValues.push(userObject.Last_Updated_LOV);
        insertValues.push(userObject.Last_Updated_SR);
        insertValues.push(userObject.Last_Updated_Delete);
        insertValues.push(userObject.encrypt);
        insertValues.push(userObject.userName);
        insertValues.push(userObject.userRole);
        insertValues.push(userObject.UserID ? parseInt(userObject.UserID) : null);
        insertValues.push(userObject.DefaultBUID);
        // 01-29-2019 -- Mansi Arora -- timeZoneIANA while updating user
        insertValues.push(userObject.timeZoneIANA);
        // 01-30-2019 -- Mansi Arora -- country, state, city, zipcode while updating user
        // 01-31-2019 -- Mansi Arora -- country, state, city, zipcode default value null
        insertValues.push(userObject.country ? userObject.country : null);
        insertValues.push(userObject.state ? userObject.state : null);
        insertValues.push(userObject.city ? userObject.city : null);
        insertValues.push(userObject.zipcode ? userObject.zipcode : null);

        insertValues.push(userObject.ID);

        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {

          //this.logger.log(this.fileName,'function',"USER ROW AFFECTED: " + res.rowsAffected);

          resolve(res);

        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateUserValues', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateUserValues', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  public getWorkType() {
    this.workType = [];
    return new Promise((resolve, reject) => {
      let query = '';

      query = "Select * from WorkType"
      //this.logger.log(this.fileName,'function',query);

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              this.workType.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.workType))

          resolve(this.workType);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getWorkType', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  getallWorkType() {
    if (this.workType.length == 0) {
      this.getWorkType();
    }
    return this.workType;
  }

  public getFieldJobName() {
    this.jobName = [];
    return new Promise((resolve, reject) => {
      let query = '';

      query = "Select * from FieldJobName"
      //this.logger.log(this.fileName,'function',query);

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              this.jobName.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.jobName))

          resolve(this.jobName);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getFieldJobName', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  getallJobName() {
    if (this.jobName.length == 0) {
      this.getFieldJobName();
    }
    return this.jobName;
  }

  public getChargeType() {
    this.chargeType = [];
    return new Promise((resolve, reject) => {
      let query = '';

      query = "Select * from ChargeType"
      //this.logger.log(this.fileName,'function',query);

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              this.chargeType.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.chargeType))

          resolve(this.chargeType);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getFieldJobName', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  getallChargeType() {
    if (this.chargeType.length == 0) {
      this.getChargeType();
    }
    return this.chargeType;
  }

  public getChargeMethod() {
    this.chargeMethod = [];
    return new Promise((resolve, reject) => {
      let query = '';

      query = "Select * from ChargeMethod"
      //this.logger.log(this.fileName,'function',query);

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              this.chargeMethod.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.chargeMethod))

          resolve(this.chargeMethod);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getChargeMethod', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  getallChargeMethod() {
    if (this.chargeMethod.length == 0) {
      this.getChargeMethod();
    }
    return this.chargeMethod;
  }

  public getItem() {
    this.items = [];
    return new Promise((resolve, reject) => {
      let query = '';

      query = "Select * from Item"
      //this.logger.log(this.fileName,'function',query);

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              this.items.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.items))

          resolve(this.items);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getItem', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  getallItem() {
    if (this.items.length == 0) {
      this.getItem();
    }
    return this.items;
  }

  public getOverTime() {
    this.overTime = [];
    return new Promise((resolve, reject) => {
      let query = '';


      query = "Select * from OverTime"
      //this.logger.log(this.fileName,'function',query);

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              this.overTime.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.overTime))

          resolve(this.overTime);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getOverTime', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  getallOvetTime() {
    if (this.overTime.length == 0) {
      this.getOverTime();
    }
    return this.overTime;
  }

  public getShiftCode() {
    this.shiftCode = [];
    return new Promise((resolve, reject) => {
      let query = '';


      query = "Select * from ShiftCode"
      //this.logger.log(this.fileName,'function',query);

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              this.shiftCode.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.shiftCode))

          resolve(this.shiftCode);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getShiftCode', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  getallShiftCode() {
    if (this.shiftCode.length == 0) {
      this.getShiftCode();
    }
    return this.shiftCode;
  }

  /**Khushboo Dhanani- Get all details related to particular**/

  getInstallBaseList(taskId) {
    ////console.log('getInstallBaseList', taskId);
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT * FROM InstallBase WHERE Task_Number = ? AND ResourceId = ?", [taskId ? taskId.toString() : '', this.valueProvider.getResourceId()], (tx, res) => {
          let value = [];
          let rowLength = res.rows.length;
          //this.logger.log(this.fileName,'function',"row length" + rowLength);
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          // this.logger.log(this.fileName,'getInstallBaseList',"GET INSTALLBASE DB ==========> " + JSON.stringify(value));
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getInstallBaseList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getInstallBaseList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getContactList(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT * FROM Contact WHERE Task_Number = ? AND ResourceId = ?", [taskId ? taskId.toString() : '', this.valueProvider.getResourceId()], (tx, res) => {
          let value = [];
          let rowLength = res.rows.length;
          //this.logger.log(this.fileName,'function',"row length" + rowLength);
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
          // this.logger.log(this.fileName,'getContactList',"GET CONTACT DB ==========> " + JSON.stringify(value));
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getContactList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getContactList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getOverviewNotes(srid, taskId) {
    let query = "SELECT * FROM Note WHERE Incident = ? and (Task_Number = ? or Task_Number isNull)";
    let queryParams = [srid, taskId];
    return this.getList(query, queryParams, "getOverviewNotes");
  }

  getNoteList(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT * FROM Note WHERE Task_Number = ? AND ResourceId = ?", [taskId ? taskId.toString() : '', this.valueProvider.getResourceId()], (tx, res) => {
          let value = [];
          let rowLength = res.rows.length;
          //this.logger.log(this.fileName,'function',"row length" + rowLength);
          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }
          resolve(value);

          // this.logger.log(this.fileName,'getNoteList',"GET NOTE DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getNoteList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getNoteList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getSRNoteList(srid) {

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        transaction.executeSql("SELECT * FROM Note WHERE Incident = ? AND ResourceId = ?", [srid ? srid.toString() : '', this.valueProvider.getResourceId()], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }

          resolve(value);

          // this.logger.log(this.fileName,'getSRNoteList',"GET SR NOTE DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getSRNoteList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getSRNoteList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getReportDataAsLOV(ReportID_Mobile, ElementID, parentData) {
    let query = "SELECT * FROM ReportData WHERE ReportID_Mobile = ? AND ElementID = ?";
    let queryParams = [ReportID_Mobile.toString(), ElementID];
    if (parentData && parentData.Value) {
      query = query + " AND ParentID_Mobile = (SELECT RDID_Mobile FROM ReportData WHERE Value = ? AND ElementID = ? AND ReportID_Mobile = ? LIMIT 1)";
      queryParams.push(parentData.Value);
      queryParams.push(parentData.ElementID);
      queryParams.push(ReportID_Mobile);
    }
    return this.getList(query, queryParams, "getReportDataAsLOV");
  }

  getAttachmentList(taskId, type) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let stmtValues = [];
        // 11/02/2018 -- Mayur Varshney -- Update query for standalone jobs
        let query = "SELECT * FROM Attachment INNER JOIN Task tk ON tk.Task_Number = Attachment.Task_Number WHERE Attachment.Task_Number = ? AND Attachment.Type = ? AND CASE WHEN tk.IsStandalone = 'true' THEN Attachment.OracleDBID = ? ELSE Attachment.ResourceId = ? END"
        let value = [];
        stmtValues.push(taskId.toString());
        stmtValues.push(type);
        stmtValues.push(this.valueProvider.getUserId());
        stmtValues.push(this.valueProvider.getResourceId());
        transaction.executeSql(query, stmtValues, (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
          // this.logger.log(this.fileName,'getAttachmentList',"GET ATTACHMENT DB ==========> " + JSON.stringify(value));
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getAttachmentList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getAttachmentList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  // SELECT * FROM Attachment WHERE Task_Number = " + String(taskId) + " AND Sync_Status = 'false' AND AttachmentType in ('fsr', 'D') AND ResourceId = ?;
  // SELECT File_Name FROM Attachment WHERE Task_Number = " + String(taskId) + " AND AttachmentType = 'fsr' AND Attachment_Status = '0';
  // SELECT * FROM Attachment WHERE Task_Number = ? AND Type = ? AND ResourceId = ? AND Attachment_Status=='0';

  // OLD QUERY: SELECT * FROM Attachment WHERE Task_Number = ? AND Type = ? AND ResourceId = ? AND Attachment_Status=='0'
  getUnUploadedAttachmentList(taskId) {
    let query = `SELECT * FROM Attachment WHERE Task_Number = ? AND Sync_Status = 'false' AND AttachmentType in ('fsr', 'D') AND ResourceId = ?`;
    let queryParams = [taskId.toString(), this.valueProvider.getResourceId()];
    return this.getList(query, queryParams, "getUnUploadedAttachmentList");
  };

  // getUnUploadedAttachmentList(taskId, type) {
  //   return new Promise((resolve, reject) => {
  //     this.dbctrl.getDB().transaction((transaction) => {
  //       let value = [];
  //       transaction.executeSql("SELECT * FROM Attachment WHERE Task_Number = ? AND Type = ? AND ResourceId = ? AND Attachment_Status=='0'", [taskId.toString(), type, this.valueProvider.getResourceId()], (tx, res) => {
  //         let rowLength = res.rows.length;
  //         for (let i = 0; i < rowLength; i++) {
  //           value.push(res.rows.item(i));
  //         }
  //         resolve(value);
  //         // this.logger.log(this.fileName,'getAttachmentList',"GET ATTACHMENT DB ==========> " + JSON.stringify(value));
  //       }, (tx, error) => {
  //         this.logger.log(this.fileName, 'getAttachmentList', 'Error: ' + JSON.stringify(error.message));
  //         reject(error);
  //       });
  //     }, (error) => {
  //       this.logger.log(this.fileName, 'getAttachmentList', 'Error TXN: ' + JSON.stringify(error.message));
  //       reject(error);
  //     });
  //   })
  // };

  getOverviewAttachments(srId, taskId) {
    let query = `SELECT * FROM Attachment WHERE (Task_Number = ? OR SRID = ?) AND Type in ('O','S')`;
    let queryParams = [taskId, srId];
    return this.getList(query, queryParams, "getOverviewAttachments");
  }

  getSRAttachmentList(srId, type) {
    return new Promise((resolve, reject) => {
      let value = [];
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT * FROM Attachment WHERE SRID = ? AND Type = ? AND ResourceId = ?", [srId, type, this.valueProvider.getResourceId()], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          // this.logger.log(this.fileName,'getSRAttachmentList',"GET ATTACHMENT DB ==========> " + JSON.stringify(value));
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getSRAttachmentList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getSRAttachmentList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  getOverTimeList(Project_Number) {

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        transaction.executeSql("SELECT * FROM OverTime WHERE Project_Number = ? AND ResourceId = ?", [Project_Number ? Project_Number.toString() : '', this.valueProvider.getResourceId()], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }
          resolve(value);

          // this.logger.log(this.fileName,'getOverTimeList',"GET OVERTIME DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getOverTimeList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getOverTimeList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getShiftCodeList(Project_Number) {

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        transaction.executeSql("SELECT * FROM ShiftCode  WHERE Project_Number = ? AND ResourceId = ?", [Project_Number ? Project_Number.toString() : '', this.valueProvider.getResourceId()], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }
          resolve(value);

          // this.logger.log(this.fileName,'getShiftCodeList',"GET SHIFTCODE DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getShiftCodeList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getShiftCodeList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getFieldJobNameList(Project_Number) {

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        transaction.executeSql("SELECT * FROM FieldJobName WHERE Project_Number = ? AND ResourceId = ?", [Project_Number ? Project_Number.toString() : '', this.valueProvider.getResourceId()], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }
          resolve(value);

          // this.logger.log(this.fileName,'getFieldJobNameList',"GET FIELDJOBNAME DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getFieldJobNameList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getFieldJobNameList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getChargeMethodList() {

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        // 10/30/2018 -- Mayur Varshney -- Remove ResourceId dependency from LOVs
        transaction.executeSql("SELECT * FROM ChargeMethod", [], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }
          resolve(value);

          // this.logger.log(this.fileName,'getChargeMethodList',"GET CHARGEMETHOD DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getChargeMethodList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getChargeMethodList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getChargeTypeList() {

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        // 10/30/2018 -- Mayur Varshney -- Remove ResourceId dependency from LOVs
        transaction.executeSql("SELECT * FROM ChargeType", [], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }
          resolve(value);

          // this.logger.log(this.fileName,'getChargeTypeList',"GET CHARGETYPE DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getChargeTypeList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getChargeTypeList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getExpenseTypeList() {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        // 10/30/2018 -- Mayur Varshney -- Remove ResourceId dependency from LOVs
        transaction.executeSql("SELECT * FROM ExpenseType", [], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);

          // this.logger.log(this.fileName,'getExpenseTypeList',"GET EXPENSETYPE DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getExpenseTypeList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getExpenseTypeList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getNoteTypeList() {

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        // 10/30/2018 -- Mayur Varshney -- Remove ResourceId dependency from LOVs
        transaction.executeSql("SELECT * FROM NoteType", [], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }
          resolve(value);

          // this.logger.log(this.fileName,'getNoteTypeList',"GET NOTETYPE DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getNoteTypeList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getNoteTypeList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getWorkTypeList() {

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        // 10/30/2018 -- Mayur Varshney -- Remove ResourceId dependency from LOVs
        transaction.executeSql("SELECT * FROM WorkType", [], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }
          resolve(value);

          // this.logger.log(this.fileName,'getWorkTypeList',"GET WORKTYPE DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getWorkTypeList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getWorkTypeList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getItemList() {

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        // 10/30/2018 -- Mayur Varshney -- Remove ResourceId dependency from LOVs
        transaction.executeSql("SELECT * FROM Item", [], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }
          resolve(value);

          // this.logger.log(this.fileName,'getItemList',"GET ITEM DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getItemList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getItemList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getCurrencyList() {

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        // 10/30/2018 -- Mayur Varshney -- Remove ResourceId dependency from LOVs
        transaction.executeSql("SELECT * FROM Currency order by Value asc", [], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }

          resolve(value);

          // this.logger.log(this.fileName,'getCurrencyList',"GET CURRENCY DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getCurrencyList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getCurrencyList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getUOMList() {

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        // 10/30/2018 -- Mayur Varshney -- Remove ResourceId dependency from LOVs
        transaction.executeSql("SELECT * FROM UOM", [], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }

          resolve(value);

          // this.logger.log(this.fileName,'getUOMList',"GET UOM DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getUOMList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getUOMList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getTimeList(taskId) {
    let query = `SELECT tm.*,Task.StatusID StatusID,Task.IsDeclined IsDeclined, (SELECT Time_Id FROM Time WHERE Original = tm.Time_Id) As CurrentMobileId FROM Time tm inner Join Task on task.Task_Number=tm.Task_Number WHERE CurrentMobileId IS NULL AND tm.Job_Type is not 'vacation' AND tm.Task_Number = ? AND tm.OracleDBID = ? AND tm.isDeleted='false'
    order by tm.EntryDate, tm.Start_Time`;

    let queryParams = [taskId.toString(), this.valueProvider.getUserId()];
    return this.getList(query, queryParams, "getTimeList");
  };

  getPendingTimeList(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT *, Time_Id as UniqueMobileId, Original as OriginalMobileID FROM Time WHERE Task_Number = ? AND Sync_Status = 'false' and isDeleted='false' and IFNULL(Job_Type, '') !='vacation'",
          [taskId.toString()], (tx, res) => {
            let value = [];
            let rowLength = res.rows.length;
            for (let i = 0; i < rowLength; i++) {
              value.push(res.rows.item(i));
            }
            value.reverse();
            //this.logger.log(this.fileName,'function',"GET TIME DB ==========> " + JSON.stringify(value));
            resolve(value);
          }, (tx, error) => {
            this.logger.log(this.fileName, 'getPendingTimeList', "GET TIME SELECT ERROR: " + JSON.stringify(error.message));
            reject(error);
          });
      }, (error) => {
        this.logger.log(this.fileName, 'getPendingTimeList', "GET TIME TRANSACTION ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  getExpenseList(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let stmtValue = []
        let value = [];
        // 11/02/2018 -- Mayur Varshney -- Update query for standalone jobs
        let sqlQuery = `SELECT ex.*, (SELECT Expense_Id FROM Expense WHERE Original = ex.Expense_Id) As CurrentMobileId FROM Expense ex
        INNER JOIN Task tk ON ex.Task_Number = tk.Task_Number WHERE ex.Task_Number = ? AND ex.OracleDBID = ? AND CurrentMobileId IS NULL`;
        stmtValue.push(taskId.toString());
        stmtValue.push(this.valueProvider.getUserId());
        transaction.executeSql(sqlQuery, stmtValue, (tx, res) => {
          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }
          value.reverse();
          resolve(value);

          // this.logger.log(this.fileName,'getExpenseList',"GET EXPENSE DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getExpenseList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getExpenseList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getPendingExpenseList(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT *, Expense_Id as UniqueMobileId, Original as OriginalMobileID FROM Expense WHERE Task_Number = ? AND Sync_Status = 'false'",
          [taskId.toString()], (tx, res) => {
            let value = [];
            let rowLength = res.rows.length;
            for (let i = 0; i < rowLength; i++) {
              value.push(res.rows.item(i));
            }
            value.reverse();
            //this.logger.log(this.fileName,'function',"GET TIME DB ==========> " + JSON.stringify(value));
            resolve(value);
          }, (tx, error) => {
            this.logger.log(this.fileName, 'getPendingExpenseList', "GET TIME SELECT ERROR: " + JSON.stringify(error.message));
            reject(error);
          });
      }, (error) => {
        this.logger.log(this.fileName, 'getPendingExpenseList', "GET TIME TRANSACTION ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  /**
   * Get materialserial list on the basis of task number and CurrentMobileId
   * @returns Promise<Boolean>
   * @param taskId
   * @memberof LocalServiceProvider
   * @author Mayur Varshney
   */
  public getMaterialSerialList(taskId) {
    let query = `SELECT M.*, (SELECT Material_Serial_Id FROM MST_Material WHERE Original = M.Material_Serial_Id) As CurrentMobileId
    FROM MST_Material M WHERE M.Task_Number = ? AND CurrentMobileId IS NULL`;
    let queryParams = [taskId];
    return this.getList(query, queryParams, 'getMaterialSerialList');
  }


  /**
   * Get materialserial list on the basis of task number
   * @returns Promise<Boolean>
   * @param taskId
   * @memberof LocalServiceProvider
   * @author Mayur Varshney
   */
  public getAllMaterialSerialList(taskId) {
    let query = "SELECT M.*, (SELECT Material_Serial_Id FROM MST_Material WHERE Original = M.Material_Serial_Id) As CurrentMobileId FROM MST_Material M WHERE M.Task_Number = ?";
    let queryParams = [taskId];
    return this.getList(query, queryParams, 'getAllMaterialSerialList');
  }

  // 04/02/2019 -- Mayur Varshney -- Optimise query for getting pending material serial list
  getPendingMaterialList(taskId) {
    let query = "SELECT *, Material_Serial_Id as UniqueMobileId, Original as OriginalMobileID FROM MST_Material WHERE ( Task_Number = ? AND ResourceId = ? AND Sync_Status = 'false')";
    let queryParams = [taskId, this.valueProvider.getResourceId()];
    return this.getList(query, queryParams, 'getPendingMaterialList');
  }

  getNotesList(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        let stmtValues = [];
        // 11/02/2018 -- Mayur Varshney -- Update query for standalone jobs
        // 11/05/2019 -- Mayur Varshney -- Update query for adding System_ID
        let query = "SELECT N.*, IB.Serial_Number, IB.Item_Number, IB.InstalledBaseID, IB.System_ID FROM Notes N LEFT OUTER JOIN InstallBase IB on IB.InstalledBaseId = N.Notes_Install_Base AND IB.task_number = N.task_number INNER JOIN Task tk ON N.Task_Number = tk.Task_Number WHERE N.Task_Number = ? AND CASE WHEN tk.IsStandalone = 'true' THEN N.OracleDBID = ? ELSE N.ResourceId = ? END ";
        stmtValues.push(taskId.toString());
        stmtValues.push(this.valueProvider.getUserId());
        stmtValues.push(this.valueProvider.getResourceId());
        transaction.executeSql(query, stmtValues, (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          value.reverse();
          //this.logger.log(this.fileName,'function',"in local service getNotesList :::" + JSON.stringify(value));
          resolve(value);
          // this.logger.log(this.fileName,'getNotesList',"GET NOTES DB ==========> " + JSON.stringify(value));
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getNotesList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getNotesList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getPendingNotesList(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        // 11/05/2019 -- Mayur Varshney -- Update query for adding System_ID
        transaction.executeSql("SELECT  N.*,N.Notes_Id as UniqueMobileId, IB.Serial_Number, IB.Item_Number, IB.InstalledBaseID, IB.System_ID FROM Notes N LEFT OUTER JOIN InstallBase IB on IB.InstalledBaseId = N.Notes_Install_Base AND IB.task_number = N.task_number WHERE N.Task_Number = ? AND N.Sync_Status = 'false'",
          [taskId.toString()], (tx, res) => {
            let value = [];
            let rowLength = res.rows.length;
            for (let i = 0; i < rowLength; i++) {
              value.push(res.rows.item(i));
            }
            value.reverse();
            //this.logger.log(this.fileName,'function',"GET TIME DB ==========> " + JSON.stringify(value));
            resolve(value);
          }, (tx, error) => {
            //this.logger.log(this.fileName,'getTimeList',"GET TIME SELECT ERROR: " + JSON.stringify(error.message));
            reject(error);
          });
      }, (error) => {
        //this.logger.log(this.fileName,'getTimeList',"GET TIME TRANSACTION ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };


  /**
   * Get Signature, time stamp and task number from Engineer and Customer Table on the basis of task number and resource id
   * @returns Promise<Boolean>
   * @memberof LocalServiceProvider
   * @author Mayur Varshney
   */
  getPendingSignature(taskId) {
    let query = `SELECT Engg.Task_Number as UniqueMobileId, Engg.Task_Number, Engg.Engineer_Id, Engg.Sign_File_Path, Engg.Engg_Sign_Time, Cust.Customer_Id,
    Cust.Cust_Sign_File, Cust.Cust_Sign_Time, Cust.Customer_Name, Cust.Job_responsibilty, Cust.Email FROM Engineer AS Engg
    LEFT OUTER JOIN Customer AS Cust ON Cust.Task_Number = Engg.Task_Number WHERE Engg.Task_Number = ? AND
    (Engg.Sync_Status = ? OR Cust.Sync_Status = ?)`;
    let queryParams = [String(taskId), false, false];
    return this.getList(query, queryParams, "getPendingSignature");
  }

  async getEngineer(taskId) {
    let query = "SELECT * FROM Engineer WHERE Task_Number = ? AND OracleDBID = ?";
    let queryParams = [taskId, this.valueProvider.getUserId()];
    let rows = await this.getList(query, queryParams, "getEngineer");
    return rows.length > 0 ? rows[0] : null;
  };

  getToolList(taskId) {

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];

        transaction.executeSql("SELECT * FROM Tool WHERE Task_Number = ? AND ResourceId = ?", [taskId ? taskId.toString() : '', this.valueProvider.getResourceId()], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }
          resolve(value);

          // this.logger.log(this.fileName,'getToolList',"GET TOOLS DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getToolList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getToolList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  /**
  * Inserts the Log entry before Staring the sync process
  * @param Start_Date
  * @memberOf LocalServiceProvider
  */
  // 08/2/2018 Gurkirat Singh -- Changed @param from syncLog to Start_Date
  insertSyncLog(Start_Date) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        // 08/2/2018 Gurkirat Singh -- Removed Other columns while inserting the sync log, as they will be added on Update
        let sqlInsert = "INSERT INTO Sync_Log(Start_Date,UserId) VALUES (?,?)";
        insertValues.push(Start_Date);
        insertValues.push(this.valueProvider.getResourceId());

        transaction.executeSql(sqlInsert, insertValues, (tx, res) => {

          resolve(res.insertId);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'insertSyncLog', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'insertSyncLog', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  /**
  * Updates the Sync Log after completing the Sync process
  * @param syncLog - SyncLog Object contains all the columns for SyncLog Table
  * @memberOf LocalServiceProvider
  */
  public updateSyncLog(syncLog) {
    return new Promise((resolve, reject) => {
      let query = '';
      query = "UPDATE Sync_Log SET End_Date = ?,Status = ? where ID = ? ";

      // Removed hardcoded "success" status and End Date
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [syncLog.End_Date, syncLog.Status, syncLog.ID], ((tx, rs) => {
          // Removed for loop which is used while Selecting records and added resolve
          resolve(syncLog);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'updateSyncLog', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      }, (error) => {
        this.logger.log(this.fileName, 'updateSyncLog', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  insertTool(tools) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlInsert = "INSERT INTO Tool(Tool_Name,Task_Number,ResourceId) VALUES (?, ?, ?)";
        insertValues.push(tools.Tool_Name);
        insertValues.push(this.valueProvider.getTaskId());
        insertValues.push(this.valueProvider.getResourceId());
        transaction.executeSql(sqlInsert, insertValues, (tx, res) => {

          resolve(res.insertId);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'insertTool', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'insertTool', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  public getCountry() {
    let country = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "Select * from Country order by Country_Name asc";

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              country.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.chargeType))

          resolve(country);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getCountry', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  public getCountryNames() {
    let country = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "SELECT * FROM Country INNER JOIN Address ON Address.Country=Country.Country_Code WHERE Address.AddressId IS NOT NULL AND Address.isEnabled = 'true' order by Country_Name asc";

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              country.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.chargeType))

          resolve(country);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getCountryNames', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  public checkIfCountryExists(countryCode, languageCode, isdefault) {
    //this.logger.log(this.fileName,'function',languageCode.toString() + countryCode.toString() + isdefault);
    let country = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "Select * from Address where Language= '" + languageCode + "' and Country= '" + countryCode + "' and Isdefault= '" + isdefault + "' ";

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              country.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(country))

          resolve(country);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'checkIfCountryExists', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  public updateIfCountryExists(addressId) {
    let country = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "UPDATE Address SET IsDefault = ? where AddressId = ? ";

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [false, addressId], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              country.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.chargeType))

          resolve(country);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'updateIfCountryExists', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  public getAddressList() {
    let addressList = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "select ad.AddressId, ad.Business_Unit,ad.Business_Unit_Code,ad.Address_Line_1,ad.Address_Line_2,ad.Zip_code,ad.City,ad.State,ad.Country,ad.Language,ad.IsDefault,ad.Updated_By,ad.Updated_Date,ad.Sync_Status,ad.Telephone,ad.Fax, ad.isEnabled, ad.id, c.Country_Name from Address ad INNER JOIN Country c on c.Country_Code = ad.country;";

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              addressList.push(item);
            }
          }
          resolve(addressList);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getAddressList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      }, (tx, error) => {
        this.logger.log(this.fileName, 'getAddressList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  public getPendingAddresses() {
    let addressList = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "SELECT * FROM Address WHERE Sync_Status = ?";

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, ['false'], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              addressList.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.chargeType))

          resolve(addressList);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getPendingAddresses', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  public getPendingInstalledBase() {
    let query = "SELECT CAST(InstalledBaseId AS VARCHAR(50)) as UniqueMobileId, Task.SR_ID, Task.Customer_ID, InstallBase.* FROM InstallBase INNER JOIN Task ON Task.Task_Number = InstallBase.Task_Number WHERE InstallBase.Sync_Status = 'false'";
    return this.getList(query, [], "getPendingInstalledBase");
  }

  /**
   * Saves a list of addresses in DB as a batch statement
   *
   * @param dataArray {Array} Array of addresses
   * @returns Promise<Boolean>
   * @memberof LocalServiceProvider
   * @author Gurkirat Singh
   */
  saveAddressListBatch(dataArray) {
    let sqlBatchStmt = [];
    for (let k in dataArray) {
      let data = dataArray[k];
      let stmtValues = [];
      let sqlInsert: any[] = ["INSERT OR REPLACE INTO Address(" + (data.ADDRESS_ID ? "AddressId, " : "") + "Business_Unit, Business_Unit_Code, Address_Line_1, Address_Line_2, Zip_code, City, State, Country, Language, IsDefault, Sync_Status, Telephone, Fax, isEnabled, Updated_By, Updated_Date) VALUES (" + (data.ADDRESS_ID ? " ?," : "") + "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"];
      if (data.ADDRESS_ID) stmtValues.push(data.ADDRESS_ID);
      stmtValues.push(data.BUSINESS_UNIT);
      stmtValues.push(data.BUSINESS_UNIT_CODE);
      stmtValues.push(data.ADDRESS_LINE_1);
      stmtValues.push(data.ADDRESS_LINE_2);
      stmtValues.push(data.ZIP_CODE);
      stmtValues.push(data.CITY);
      stmtValues.push(data.STATE);
      stmtValues.push(data.COUNTRY);
      stmtValues.push(data.LANGUAGE);
      stmtValues.push(data.IS_DEFAULT);
      stmtValues.push(data.Sync_Status ? data.Sync_Status : 'false');
      stmtValues.push(data.TELEPHONE);
      stmtValues.push(data.FAX);
      stmtValues.push(data.IS_ENABLED);
      stmtValues.push(data.CREATEDBY);
      stmtValues.push(data.CREATEDON);
      // stmtValues.push(data.MODIFIEDBY);
      // stmtValues.push(data.MODIFIEDON);
      // stmtValues.push(data.id);

      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlInsert);
    }
    return this.insertBatchData(sqlBatchStmt, "saveAddressListBatch");
  };

  /**
  *
  *07262018 KW insert new Address in local Db table Address
  * @param {*} address
  * @returns insert Id
  * @memberof LocalServiceProvider
  */
  insertAddress(address) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlInsert = "INSERT INTO Address (Business_Unit,Business_Unit_Code, Address_Line_1, Address_Line_2, Zip_code, City, State, Country, Language, IsDefault, Updated_By, Updated_Date, Sync_Status, Telephone, Fax, isEnabled,id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        insertValues.push(address.Business_Unit);
        insertValues.push(address.Business_Unit_Code);
        insertValues.push(address.Address_Line_1);
        insertValues.push(address.Address_Line_2);
        insertValues.push(address.Zip_code);
        insertValues.push(address.City);
        insertValues.push(address.State);
        insertValues.push(address.Country);
        insertValues.push(address.Language);
        insertValues.push(address.IsDefault);
        insertValues.push(address.Updated_By);
        insertValues.push(address.Updated_Date);
        insertValues.push(address.Sync_Status);
        insertValues.push(address.Telephone);
        insertValues.push(address.Fax);
        insertValues.push(address.isEnabled);
        insertValues.push(address.id);

        transaction.executeSql(sqlInsert, insertValues, (tx, res) => {
          resolve(res.insertId);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'insertAddress', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'insertAddress', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };
  /**
  *
  *07262018 KW update address locally
  * @param {*} address
  * @returns addressObj
  * @memberof LocalServiceProvider
  */
  updateAddress(address) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE Address SET Business_Unit = ?, Business_Unit_Code = ?, Address_Line_1 = ?, Address_Line_2 = ?, Zip_code = ?, City = ?, State = ?, Country = ?, Language = ?, IsDefault = ?, Updated_By = ?, Updated_Date = ?, Sync_Status = ? ,Telephone = ?, Fax = ?, isEnabled = ?, id = ? WHERE AddressId = ?";
        insertValues.push(address.Business_Unit);
        insertValues.push(address.Business_Unit_Code);
        insertValues.push(address.Address_Line_1);
        insertValues.push(address.Address_Line_2);
        insertValues.push(address.Zip_code);
        insertValues.push(address.City);
        insertValues.push(address.State);
        insertValues.push(address.Country);
        insertValues.push(address.Language);
        insertValues.push(address.IsDefault);
        insertValues.push(address.Updated_By);
        insertValues.push(address.Updated_Date);
        insertValues.push(address.Sync_Status ? address.Sync_Status : 'false');
        insertValues.push(address.Telephone);
        insertValues.push(address.Fax);
        insertValues.push(address.isEnabled);
        insertValues.push(address.id);
        insertValues.push(address.AddressId);

        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          resolve(res);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateAddress', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateAddress', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  /**
  *
  *07262018 KW accepts addressAuditLogs Array and insert into local DB
  * @param {*} response
  * @memberof LocalServiceProvider
  */
  saveAddressAuditLogListOnSync(response) {
    let responseList = response;
    let promises = [];
    for (let i = 0; i < responseList.length; i++) {
      promises.push(((i) => {
        return new Promise((resolve, reject) => {
          this.dbctrl.getDB().transaction((transaction) => {
            let sqlSelect = "SELECT * FROM AddressAuditLog WHERE id = ?";
            transaction.executeSql(sqlSelect, [responseList[i].id], (tx, res) => {
              var rowLength = res.rows.length;
              if (rowLength > 0) {
                if (responseList[i].AuditLogId) {
                  this.updateAddressAuditLog(responseList[i])
                    .then(resolve)
                    .catch(reject);
                }
              } else {
                this.insertAddressAuditLog(responseList[i])
                  .then(resolve)
                  .catch(reject);
              }

            }, (tx, error) => {
              this.logger.log(this.fileName, 'saveAddressAuditLogListOnSync', 'Error: ' + JSON.stringify(error.message));
              reject(error);
            });
          }, (error) => {
            this.logger.log(this.fileName, 'saveAddressAuditLogListOnSync', 'Error TXN: ' + JSON.stringify(error.message));
            reject(error);
          });
        });
      })(i));
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises).then(() => {
        resolve("SUCCESS");
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'saveAddressAuditLogListOnSync', 'Error in Promise all: ' + JSON.stringify(error));
        resolve("ERROR");
      });
    });
  };


  /**
  *
  *07262018 KW accepts addressAuditLogs Array and insert into local DB
  * @param {*} response
  * @memberof LocalServiceProvider
  */
  saveAddressAuditLogList(response) {
    let responseList = response;
    let promises = [];
    for (let i = 0; i < responseList.length; i++) {
      promises.push(((i) => {
        return new Promise((resolve, reject) => {
          this.dbctrl.getDB().transaction((transaction) => {
            let sqlSelect = "SELECT * FROM AddressAuditLog WHERE AuditLogId = ?";
            transaction.executeSql(sqlSelect, [responseList[i].AuditLogId], (tx, res) => {
              var rowLength = res.rows.length;
              if (rowLength > 0) {
                if (responseList[i].AuditLogId) {
                  this.updateAddressAuditLog(responseList[i])
                    .then(resolve)
                    .catch(reject);
                }
              } else {
                this.insertAddressAuditLog(responseList[i])
                  .then(resolve)
                  .catch(reject);
              }

            }, (tx, error) => {
              this.logger.log(this.fileName, 'saveAddressAuditLogList', 'Error: ' + JSON.stringify(error.message));
              reject(error);
            });
          }, (error) => {
            this.logger.log(this.fileName, 'saveAddressAuditLogList', 'Error TXN: ' + JSON.stringify(error.message));
            reject(error);
          });
        });
      })(i));
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises).then(() => {
        resolve("SUCCESS");
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'saveAddressAuditLogList', 'Error in Promise all: ' + JSON.stringify(error));
        resolve("ERROR");
      });
    });
  };

  /**
  *
  *07262018 KW insert new AddressAuditLog in local Db table Address
  * @param {*} address
  * @returns insert Id
  * @memberof LocalServiceProvider
  */
  insertAddressAuditLog(addressAuditLog) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlInsert = "INSERT INTO AddressAuditLog (AddressId, Business_Unit,Business_Unit_Code, Address_Line_1, Address_Line_2, Zip_code, City, State, Country, Language, IsDefault, updatedBy, updatedOn, Sync_Status, Telephone, Fax, isEnabled, ResourceId, AddressMCSId, id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        insertValues.push(addressAuditLog.AddressId);
        insertValues.push(addressAuditLog.Business_Unit);
        insertValues.push(addressAuditLog.Business_Unit_Code);
        insertValues.push(addressAuditLog.Address_Line_1);
        insertValues.push(addressAuditLog.Address_Line_2);
        insertValues.push(addressAuditLog.Zip_code);
        insertValues.push(addressAuditLog.City);
        insertValues.push(addressAuditLog.State ? addressAuditLog.State : "");
        insertValues.push(addressAuditLog.Country);
        insertValues.push(addressAuditLog.Language);
        insertValues.push(addressAuditLog.IsDefault);
        insertValues.push(addressAuditLog.updatedBy);
        insertValues.push(addressAuditLog.updatedOn);
        insertValues.push(addressAuditLog.Sync_Status ? addressAuditLog.Sync_Status : 'false');
        insertValues.push(addressAuditLog.Telephone);
        insertValues.push(addressAuditLog.Fax ? addressAuditLog.Fax : "");
        insertValues.push(addressAuditLog.isEnabled);
        insertValues.push(this.valueProvider.getResourceId());
        insertValues.push(addressAuditLog.AddressMCSId);
        insertValues.push(addressAuditLog.id);

        transaction.executeSql(sqlInsert, insertValues, (tx, res) => {
          resolve(res.insertId);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'insertAddressAuditLog', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'insertAddressAuditLog', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };
  /**
  *
  *07262018 KW update address locally
  * @param {*} address
  * @returns addressObj
  * @memberof LocalServiceProvider
  */
  updateAddressAuditLog(addressAuditLog) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE AddressAuditLog SET AddressId = ?, Business_Unit = ?, Business_Unit_Code = ?, Address_Line_1 = ?, Address_Line_2 = ?, Zip_code = ?, City = ?, State = ?, Country = ?, Language = ?, IsDefault = ?, updatedBy = ?, updatedOn = ?, Sync_Status = ? ,Telephone = ?, Fax = ?, isEnabled = ?, ResourceId = ? , AddressMCSId = ?, id = ? WHERE AuditLogId = ?";
        insertValues.push(addressAuditLog.AddressId);
        insertValues.push(addressAuditLog.Business_Unit);
        insertValues.push(addressAuditLog.Business_Unit_Code);
        insertValues.push(addressAuditLog.Address_Line_1);
        insertValues.push(addressAuditLog.Address_Line_2);
        insertValues.push(addressAuditLog.Zip_code);
        insertValues.push(addressAuditLog.City);
        insertValues.push(addressAuditLog.State ? addressAuditLog.State : "");
        insertValues.push(addressAuditLog.Country);
        insertValues.push(addressAuditLog.Language);
        insertValues.push(addressAuditLog.IsDefault);
        insertValues.push(addressAuditLog.updatedBy);
        insertValues.push(addressAuditLog.updatedOn);
        insertValues.push(addressAuditLog.Sync_Status ? addressAuditLog.Sync_Status : 'false');
        insertValues.push(addressAuditLog.Telephone);
        insertValues.push(addressAuditLog.Fax ? addressAuditLog.Fax : "");
        insertValues.push(addressAuditLog.isEnabled);
        insertValues.push(this.valueProvider.getResourceId());
        insertValues.push(addressAuditLog.AddressMCSId);
        insertValues.push(addressAuditLog.id);
        insertValues.push(addressAuditLog.AuditLogId);

        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          resolve(res);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateAddressAuditLog', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateAddressAuditLog', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  deleteTool(id) {
    this.dbctrl.getDB().transaction((transaction) => {

      let sqlDelete = "DELETE FROM Tool WHERE id = " + id;

      transaction.executeSql(sqlDelete);

    }, (error) => {
      this.logger.log(this.fileName, 'deleteTool', 'Error: ' + JSON.stringify(error.message));
    });
  }

  deleteTimeObject(Time_ID) {
    //this.logger.log(this.fileName,'function',"Time_ID=" + Time_ID);
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("DELETE FROM Time WHERE Time_Id = " + Time_ID, [], (tx, res) => {
          //this.logger.log(this.fileName,'function',"DELETED");
        }, (tx, error) => {
          this.logger.log(this.fileName, 'deleteTimeObject', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'deleteTimeObject', 'Error: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  // insertContactListBatch(response) {
  //   return new Promise((resolve, reject) => {
  //     let sqlBatchStmt = [];
  //     for (let k in response) {
  //       let data = response[k];
  //       let stmtValues = [];
  //       let sqlInsert: any[] = ["INSERT OR REPLACE INTO Contact VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT Contact_ID_PK FROM Contact WHERE Contact_ID = ? AND Task_Number = ?))"];
  //       stmtValues.push(parseInt(data.Contact_ID));
  //       stmtValues.push(data.Customer_Name);
  //       sqlInsert.push(stmtValues);
  //       sqlBatchStmt.push(sqlInsert);
  //     }
  //     //this.logger.log(this.fileName, 'insertContactListBatch', "stmtValues :" + JSON.stringify(stmtValues));
  //     this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (res) => {
  //       // this.logger.log(this.fileName, 'insertContactListBatch', "Response :" + JSON.stringify(res));
  //       resolve(true);
  //     }, (error) => {
  //       this.logger.log(this.fileName, 'insertContactListBatch', "Error : " + JSON.stringify(error.message));
  //       reject(error);
  //     });
  //   });
  // }

  /* @Narasimha 04/12/2019
  *  Delete bulk time objects
  */
  deleteBulkTimeObject(timeIdList, statusid?) {
    return new Promise((resolve, reject) => {
      let sqlDelete: any[]
      let sqlBatchStmt = [];
      timeIdList.forEach((timeId) => {
        if (statusid == Enums.Jobstatus.Debrief_In_Progress) {
          sqlDelete = ["UPDATE time set isDeleted='true',db_syncstatus = 'false' WHERE Sync_Status='false'  and isAdditional='true' and Time_Id = " + timeId];
          sqlBatchStmt.push(sqlDelete);
        }
        else if (statusid == Enums.Jobstatus.Debrief_Declined) {
          sqlDelete = ["UPDATE time set isDeleted='true',db_syncstatus = 'false' WHERE (Sync_Status='false' and isAdditional='true' and (Original is null OR Original = '')) and Time_Id = " + timeId];
          sqlBatchStmt.push(sqlDelete);
        }
        else {
          sqlDelete = ["UPDATE time set isDeleted='true',db_syncstatus = 'false' WHERE Time_Id = " + timeId];
          sqlBatchStmt.push(sqlDelete);
        }

      })

      this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (res) => {
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, 'deleteBulkTimeObject', "Error : " + JSON.stringify(error.message));
        reject(error);
      });

    })
  };

  deleteNotesObject(Notes_ID) {
    //this.logger.log(this.fileName,'function',"Time_ID=" + Notes_ID);
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {


        transaction.executeSql("DELETE FROM Notes WHERE Notes_Id = " + Notes_ID, [], (tx, res) => {

          //this.logger.log(this.fileName,'function',"DELETED");
        }, (tx, error) => {
          this.logger.log(this.fileName, 'deleteNotesObject', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'deleteNotesObject', 'Error: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  updateExpense(responseList) {
    // //this.logger.log(this.fileName,'function',"Inside Update");

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {

        let insertValues = [];
        // 11/02/2018 -- Mayur Varshney -- update query, insert OracleDBID in table
        let sqlUpdate = "UPDATE Expense SET expenseDefault = ?, Date = ?, Expense_Type = ?, Expense_Type_Id = ?, Amount = ?, Currency = ?, Currency_Id = ?, Distance = ?, UOM = ?, UOM_Id = ?, Charge_Method = ?, Charge_Method_Id = ?, Justification = ?, ResourceId = ?, Sync_Status = ?, OracleDBID = ? WHERE Expense_Id = ? AND Task_Number = ?";

        insertValues.push("");
        insertValues.push(responseList.Date);
        insertValues.push(responseList.Expense_Type);
        insertValues.push(responseList.Expense_Type_Id);
        insertValues.push(responseList.Amount);
        insertValues.push(responseList.Currency);
        insertValues.push(responseList.Currency_Id);
        insertValues.push(responseList.Distance);
        insertValues.push(responseList.UOM);
        insertValues.push(responseList.UOM_Id);
        insertValues.push(responseList.Charge_Method);
        insertValues.push(responseList.Charge_Method_Id);
        insertValues.push(responseList.Justification);
        insertValues.push(this.valueProvider.getResourceId());
        insertValues.push(responseList.Sync_Status);
        // 11/02/2018 -- Mayur Varshney -- insert OracleDBID in table
        insertValues.push(this.valueProvider.getUserId());
        insertValues.push(responseList.Expense_Id);
        insertValues.push(this.valueProvider.getTaskId());

        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {

          resolve(res);

          //this.logger.log(this.fileName,'function',"EXPENSE ROW AFFECTED: " + res.rowsAffected);

        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateExpense', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'updateExpense', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });

  }

  /**
  *07262018 KW update Last_Updated_AddressAuditLog in users table in local DB
  *
  * @param {*} userObject
  * @returns
  * @memberof LocalServiceProvider
  */
  updateLastAddressAuditLog(userObject) {
    let query = "UPDATE User SET Last_Updated_AddressAuditLog = ? WHERE ID = ?";
    let queryParams = [userObject.Last_Updated_AddressAuditLog, userObject.ID];
    return this.insertData(query, queryParams, "updateLastAddressAuditLog");
  };

  updateLastReport(userObject) {
    let queryParams = [userObject.Last_Updated_Reports, userObject.ID];
    return this.insertData("UPDATE User SET Last_Updated_Reports = ? WHERE ID = ?", queryParams, "updateLastReport");
  };

  /**
  *07262018 KW gives addressAuditLogs on the basis of ID where sync status is false
  * @param {*} address
  * @returns address
  * @memberof LocalServiceProvider
  */
  public checkIfPendingALExists(address) {
    let self = this;
    let addressAuditLogArr = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "Select * from AddressAuditLog where AddressId = ? and Sync_Status = ?"

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [address.AddressId, "false"], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              addressAuditLogArr.push(item);
            }
            self.updateAddressAuditLogs(addressAuditLogArr, address).then(() => {
              resolve("success");
            }).catch((error: any) => {
              self.logger.log(self.fileName, "checkIfPendingALExists", "Error in updateAddressAuditLogs: " + JSON.stringify(error));
              reject("failure");
            });
          }
          else {
            resolve("success");
          }
        }), ((tx, error) => {
          self.logger.log(self.fileName, 'checkIfOfflineALExists', 'Error TX: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }
  /**
  *07272018 KW update all pending AddressAuditLog in local DB
  *
  * @param {*} addressAuditLogArr
  * @param {*} address
  * @memberof LocalServiceProvider
  */
  updateAddressAuditLogs(addressAuditLogArr, address) {
    let self = this;
    self.logger.log(self.fileName, 'updateAddressAuditLogs', 'AddressAuditLog update request: ' + JSON.stringify(addressAuditLogArr));
    return new Promise((resolve, reject) => {
      let promiseArr = [];
      if (addressAuditLogArr.length > 0) {
        for (let j = 0; j < addressAuditLogArr.length; j++) {
          promiseArr.push(self.updateAddressIdAuditLog(addressAuditLogArr[j], address));
        }
        Promise.all(promiseArr).then((res) => {
          // self.logger.log(self.fileName, 'updateAddressAuditLogs', 'res: ' + res);
          resolve("success");
        }).catch((error: any) => {
          self.logger.log(self.fileName, "updateAddressAuditLogs", "Error in promise all: " + JSON.stringify(error));
          reject("failure");
        });
      }
    });


  }

  /**
  *08/20/2018 Kamal update Last_Updated_Addresses in users table in local DB
  *
  * @param {*} userObject
  * @returns
  * @memberof LocalServiceProvider
  */
  updateLastAddresses(userObject) {
    let query = "UPDATE User SET Last_Updated_Addresses = ? WHERE ID = ?";
    let queryParams = [userObject.Last_Updated_Addresses, userObject.ID];
    return this.insertData(query, queryParams, "updateLastAddresses");
  };

  /**
   *08/20/2018 Kamal update Last_Updated_Feedbacks in users table in local DB
   *
   * @param {*} userObject
   * @returns
   * @memberof LocalServiceProvider
   */
  updateLastfeedbacks(userObject) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE User SET Last_Updated_Feedbacks = ? WHERE ID = ?";
        insertValues.push(userObject.Last_Updated_Feedbacks);
        insertValues.push(userObject.ID);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          //this.logger.log(this.fileName,'function',"USER ROW AFFECTED: " + res.rowsAffected);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateLastfeedbacks', 'Error: ' + JSON.stringify(error.message));
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateLastfeedbacks', 'Error TXN: ' + JSON.stringify(error.message));
      });
    });
  };

  /**
   *08/20/2018 Kamal update Last_Updated_FeedbackQuestions in users table in local DB
   *
   * @param {*} userObject
   * @returns
   * @memberof LocalServiceProvider
   */
  updateLastFeedbackQuestions(userObject) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE User SET Last_Updated_FeedbackQuestions = ? WHERE ID = ?";
        insertValues.push(userObject.Last_Updated_FeedbackQuestions);
        insertValues.push(userObject.ID);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          //this.logger.log(this.fileName,'function',"USER ROW AFFECTED: " + res.rowsAffected);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateLastFeedbackQuestions', 'Error: ' + JSON.stringify(error.message));
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateLastFeedbackQuestions', 'Error TXN: ' + JSON.stringify(error.message));
      });
    });
  };


  /**
  *07262018 KW update field addressMCSId on AddressAuditLog into local DB
  *
  * @param {*} responseList
  * @returns addressAuditLog Object
  * @memberof LocalServiceProvider
  */
  updateAddressIdAuditLog(responseList, address) {
    let self = this;
    this.logger.log(this.fileName, 'updateAddressIdAuditLog', 'AddressAuditLog update request: ' + JSON.stringify(responseList));
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE AddressAuditLog SET AddressMCSId = ?  WHERE AddressId = ?";

        insertValues.push(address.id);
        insertValues.push(address.AddressId);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          self.logger.log(self.fileName, 'updateAddressIdAuditLog', 'res: ' + res);
          resolve("success");
        }, (tx, error) => {
          self.logger.log(self.fileName, 'updateAddressIdAuditLog', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        self.logger.log(self.fileName, 'updateAddressIdAuditLog', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  /**
  *07262018 KW get all addressAuditLogs submitted offline
  * @returns addressAuditLogs Array
  * @memberof LocalServiceProvider
  */
  public getPendingAddressAuditLogs() {
    let addressAuditLogList = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "SELECT * FROM AddressAuditLog WHERE Sync_Status = ?";

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, ['false'], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              addressAuditLogList.push(item);
            }
          }
          resolve(addressAuditLogList);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getPendingAddressAuditLogs', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  /**
   * Get material original row on the basis of OriginalId value
   * @param {any} materialId
   * @returns arrays of original rows
   * @author Mayur Varshney
   * @memberOf LocalServiceProvider
   */
  getMaterialSerialOriginalRow(OriginalId) {
    let selectQuery: any = `SELECT * FROM MST_Material WHERE Material_Id = (Select Material_Id FROM MST_Material WHERE Material_Serial_Id = ?)
    AND Task_Number = ? AND Original ISNULL`;
    let queryParams: any = [OriginalId, this.valueProvider.getTaskId()]
    return this.getList(selectQuery, queryParams, 'getMaterialSerialOriginalRow')
  }

  getExpenseById(expenseId) {
    let query = `Select * from EXPENSE where Expense_Id = ?`;
    return this.getList(query, [expenseId], "getExpenseById");
  }

  getTimeById(timeId) {
    let query = `Select * from Time where Time_Id = ?`;
    return this.getList(query, [timeId], "getTimeById");
  }

  insertExpense(responseList) {

    //this.logger.log(this.fileName,'function',JSON.stringify(responseList));

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {

        let insertValues = [];
        // 11/02/2018 -- Mayur Varshney -- update query ,insert OracleDBID in table
        let sqlInsert = "INSERT INTO Expense (expenseDefault, Date, Expense_Type,Expense_Type_Id,Amount,Currency,Currency_Id,Distance,UOM,UOM_Id,Charge_Method,Charge_Method_Id,Justification,Task_Number,ResourceId,Original, Expense_Id,IsAdditional,DebriefStatus, Sync_Status, OracleDBID) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?)";

        insertValues.push("");
        insertValues.push(responseList.Date);
        insertValues.push(responseList.Expense_Type);
        insertValues.push(responseList.Expense_Type_Id);
        insertValues.push(responseList.Amount);
        insertValues.push(responseList.Currency);
        insertValues.push(responseList.Currency_Id);
        insertValues.push(responseList.Distance);
        insertValues.push(responseList.UOM);
        insertValues.push(responseList.UOM_Id);
        insertValues.push(responseList.Charge_Method);
        insertValues.push(responseList.Charge_Method_Id);
        insertValues.push(responseList.Justification);
        insertValues.push(this.valueProvider.getTaskId());
        insertValues.push(this.valueProvider.getResourceId());
        insertValues.push(responseList.Original);
        insertValues.push(responseList.Expense_Id);
        insertValues.push(responseList.IsAdditional);
        insertValues.push(responseList.DebriefStatus);
        insertValues.push(responseList.Sync_Status);
        // 11/02/2018 -- Mayur Varshney -- insert OracleDBID in table
        insertValues.push(this.valueProvider.getUserId());

        transaction.executeSql(sqlInsert, insertValues, (tx, res) => {

          //this.logger.log(this.fileName,'function',"EXPENSE INSERT ID: " + res.insertId);
          resolve(res.insertId);



        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateExpense', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'updateExpense', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });

    });
  }

  /**
   * batch insert/replace materialserial rows
   * @returns Promise<Boolean>
   * @memberof LocalServiceProvider
   * @author Mayur Varshney
   */
  addOrInsertMaterial(dataArray) {
    let sqlBatchStmt = [];
    for (let k in dataArray) {
      let responseList = dataArray[k];
      let insertValues = [];
      let sqlInsert: any[] = ["INSERT OR REPLACE INTO MST_Material (Material_Id, Charge_Type, Charge_Type_Id, Description, ItemName, Product_Quantity, Task_Number, ResourceId, UOM, Material_Serial_Id, Serial_In, Serial_Out, Original, DebriefStatus, IsAdditional, OracleDBID, Serial_Number, materialDefault, Sync_Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"];
      insertValues.push(responseList.Material_Id);
      insertValues.push(responseList.Charge_Type);
      insertValues.push(responseList.Charge_Type_Id);
      insertValues.push(responseList.Description ? responseList.Description : null);
      insertValues.push(responseList.ItemName);
      insertValues.push('1');
      insertValues.push(responseList.Task_Number);
      insertValues.push(responseList.ResourceId);
      insertValues.push(responseList.UOM);
      insertValues.push(responseList.Material_Serial_Id);
      insertValues.push(responseList.Serial_In ? responseList.Serial_In : null);
      insertValues.push(responseList.Serial_Out ? responseList.Serial_Out : null);
      insertValues.push(responseList.Original ? responseList.Original : null);
      insertValues.push(responseList.DebriefStatus);
      insertValues.push(responseList.IsAdditional);
      insertValues.push(responseList.OracleDBID);
      insertValues.push(responseList.Serial_Number ? responseList.Serial_Number : null);
      insertValues.push(responseList.materialDefault ? responseList.materialDefault : null);
      insertValues.push(false);
      sqlInsert.push(insertValues);
      sqlBatchStmt.push(sqlInsert);
    }
    return this.insertBatchData(sqlBatchStmt, "addOrInsertMaterial");
  }

  /**
   *Insert Time in local DB
   *
   * //04/10/2019 Preeti Varshney
   * updated the insert query to insert batch and update query
   *
   */
  insertTimeBatch(dataArray){
    return new Promise((resolve, reject) => {

      let reportBatch = []
      for (let k in dataArray) {
        let data = dataArray[k];
        // //console.log("DUMMYYYReportData", data)
        let sqlInsert = [];
        let queryParams = []
          let insertQuery = "INSERT OR REPLACE INTO Time (";

          let insert = "";
          let insert1 = "";

          let dataKeys = Object.keys(data);
          if (dataKeys.length) {
            dataKeys.forEach((key) => {
              insert += key + ", ";
              insert1 += "? , ";
              queryParams.push(data[key] ? data[key] : null );
            })
            // Insert query
            insertQuery += insert + ") VALUES (" + insert1 + ")";
            // insertQuery = insertQuery.replace(",) VALUES", ") VALUES");
            insertQuery = insertQuery.replace(/, \)/g, ')').replace(/'null'/g, 'null');
            sqlInsert.push(insertQuery);
            sqlInsert.push(queryParams);
            reportBatch.push(sqlInsert);
          }
      }
      this.dbctrl.getDB().sqlBatch(reportBatch, (res) => {
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, 'insertTimeBatch', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  }
  /**
     *Insert Time in local DB
     *
     * //04/22/2019 Preeti Varshney
     *  insert and update query
     *
     */
  insertTime(data) {
    return this.insertJsonData(data, "Time", ["CurrentMobileId", "DisableDelete", "cssClass", "StatusID", "IsDeclined", "displayDate", "displayEndDate", "DeleteTimeIds"], "insertTime");
  }

  /**
   * 07/25/2018 Mayur combined update and insert into single function for insert/update Notes
   *
   * @param {*} responseList
   * @returns
   * @memberof LocalServiceProvider
   */
  insertUpdateNotes(responseList) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertUpdateValues = [];
        // 11/02/2018 -- Mayur Varshney -- update query, insert OracleDBID in table
        let sqlInsertUpdate = "INSERT OR REPLACE INTO Notes(Notes_Id, noteDefault, Note_Type, Note_Type_Id, Date, Created_By, Notes, Notes_Install_Base, Task_Number, OracleDBID, ResourceId, Sync_Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        insertUpdateValues.push(responseList.Notes_Id);
        insertUpdateValues.push(responseList.noteDefault);
        insertUpdateValues.push(responseList.Note_Type);
        insertUpdateValues.push(responseList.Note_Type_Id);
        insertUpdateValues.push(responseList.Date);
        insertUpdateValues.push(responseList.Created_By);
        insertUpdateValues.push(responseList.Notes);
        insertUpdateValues.push(responseList.Notes_Install_Base);
        insertUpdateValues.push(responseList.Task_Number);
        // 11/02/2018 -- Mayur Varshney -- insert OracleDBID in table
        insertUpdateValues.push(this.valueProvider.getUserId());
        insertUpdateValues.push(this.valueProvider.getResourceId());
        insertUpdateValues.push(false);
        transaction.executeSql(sqlInsertUpdate, insertUpdateValues, (tx, res) => {
          resolve(responseList.Notes_Id);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'insertNotes', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'insertNotes', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  getNotesForInstallBase(installBaseId, notesId) {
    let value = [];
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        // 11/05/2019 -- Mayur Varshney -- Update query for adding System_ID
        transaction.executeSql("Select  N.*, IB.Serial_Number, IB.Item_Number, IB.InstalledBaseID, IB.System_ID from Notes N LEFT OUTER JOIN InstallBase IB on IB.InstalledBaseId = N.Notes_Install_Base where N.Notes_Install_Base = ? and N.Notes_Id = ?", [installBaseId, notesId], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value[0]);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getNotesForInstallBase', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getNotesForInstallBase', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  }
  /**
   *update time in local DB
   * @param {*} responseList
   * @returns
   * @memberof LocalServiceProvider
   */
  updateTime(responseList) {

    //this.logger.log(this.fileName,'function',"TIME UPDATE OBJECT =====> " + JSON.stringify(responseList));

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {

        let insertValues = [];
        // 11/02/2018 -- Mayur Varshney -- update query, insert OracleDBID in table
        let sqlUpdate = "UPDATE Time SET timeDefault = ?, Field_Job_Name = ?, Field_Job_Name_Id = ?, Charge_Type = ?, Charge_Type_Id = ?, Charge_Method = ?, Charge_Method_Id = ?, Work_Type = ?, Work_Type_Id = ?, Item = ?, Item_Id = ?, Description = ?, Time_Code = ?, Time_Code_Id = ?, Time_Code_Value = ?, Shift_Code = ?, Shift_Code_Id = ?, Shift_Code_Value = ?, Date = ?, Duration = ?, Comments = ?, ResourceId = ?, Start_Time = ?, End_Time = ?, Service_Start_Date = ? , Service_End_Date = ? , OracleDBID = ?, Sync_Status = ? WHERE Time_Id = ? AND Task_Number = ?";

        insertValues.push(responseList.timeDefault);
        insertValues.push(responseList.Field_Job_Name);
        insertValues.push(responseList.Field_Job_Name_Id);
        insertValues.push(responseList.Charge_Type);
        insertValues.push(responseList.Charge_Type_Id);
        insertValues.push(responseList.Charge_Method);
        insertValues.push(responseList.Charge_Method_Id);
        insertValues.push(responseList.Work_Type);
        insertValues.push(responseList.Work_Type_Id);
        insertValues.push(responseList.Item);
        insertValues.push(responseList.Item_Id);
        insertValues.push(responseList.Description);
        insertValues.push(responseList.Time_Code);
        insertValues.push(responseList.Time_Code_Id);
        insertValues.push(responseList.Time_Code_Value);
        insertValues.push(responseList.Shift_Code);
        insertValues.push(responseList.Shift_Code_Id);
        insertValues.push(responseList.Shift_Code_Value);
        insertValues.push(responseList.Date);
        insertValues.push(responseList.Duration);
        insertValues.push(responseList.Comments);
        insertValues.push(this.valueProvider.getResourceId());
        insertValues.push(responseList.Start_Time);
        insertValues.push(responseList.End_Time);
        // 08/07/2018 kamal added service start date and service end date field
        insertValues.push(responseList.Service_Start_Date);
        insertValues.push(responseList.Service_End_Date);
        // 11/02/2018 -- Mayur Varshney -- insert OracleDBID in table
        insertValues.push(this.valueProvider.getUserId());
        insertValues.push(false);
        insertValues.push(responseList.Time_Id);
        insertValues.push(responseList.Task_Number);

        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {

          //this.logger.log(this.fileName,'function',"TIME ROW AFFECTED: " + res.rowsAffected);

          resolve(res);

        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateTime', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'updateTime', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getPendingTaskList() {
    let query = "SELECT * FROM Task WHERE Sync_Status = ? AND ResourceId = ? AND IsStandalone = 'false'";
    let queryParams = ["false", this.valueProvider.getResourceId()];
    return this.getList(query, queryParams, "getPendingTaskList");
  };

  getTask() {
    let value = [];
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {

        transaction.executeSql("SELECT * FROM Task WHERE Task_Number = ?", [this.valueProvider.getTaskId()], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }

          //this.logger.log(this.fileName,'function',"GET TASK PENDING DB ==========> " + JSON.stringify(value));

          resolve(value);

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getPendingTaskList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getPendingTaskList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
      // } else {
      //   resolve(value);
      // }
    })
  };

  //16-09-2019 Gaurav V -  Check OSC Job using Task_Number
  checkTaskIsOSCJob(taskId) {
    let value = [];
    return new Promise((resolve, reject) => {
      //if (this.valueProvider.getResourceId() != "0") {
      this.dbctrl.getDB().transaction((transaction) => {

        transaction.executeSql("SELECT * FROM Task WHERE Task_Number = ? and IsStandalone = 'false'", [taskId], (tx, res) => {

          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }

          //this.logger.log(this.fileName,'function',"GET TASK PENDING DB ==========> " + JSON.stringify(value));

          resolve(value);

        }, (tx, error) => {
          this.logger.log(this.fileName, 'getPendingTaskList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getPendingTaskList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
      // } else {
      //   resolve(value);
      // }
    })
  };

  updateTaskSubmitStatus(responseList) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {

        let insertValues = [];
        // 04/29/2019 -- Mayur Varshney -- update DebriefSubmissionDate in taskTable
        //let sqlUpdate = "UPDATE Task SET Task_Status = ?, Submit_Status = ?, Date = ?, Sync_Status = ?, StatusID = ?, IsDeclined = ?, DebriefSubmissionDate = ?, DBCS_SyncStatus = ?  WHERE Task_Number = ?";

        // 09/29/2019 -- Parvinder -- remove submit_status & update sync_status in taskTable
        let sqlUpdate = "UPDATE Task SET Task_Status = ?, Date = ?, Sync_Status = ?, StatusID = ?, IsDeclined = ?, DebriefSubmissionDate = ?, DBCS_SyncStatus = ?  WHERE Task_Number = ?";

        insertValues.push(responseList.Task_Status);
        //insertValues.push(responseList.Submit_Status);
        insertValues.push(responseList.Date);
        insertValues.push(responseList.Sync_Status);
        insertValues.push(responseList.StatusID);
        insertValues.push(responseList.IsDeclined);
        insertValues.push(responseList.DebriefSubmissionDate ? responseList.DebriefSubmissionDate : null);
        insertValues.push("false");
        insertValues.push(responseList.Task_Number);

        //this.logger.log(this.fileName,'function',"TASK UPDATE VALUES =====> " + insertValues);

        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {

          //this.logger.log(this.fileName,'function',"TASK ROW AFFECTED: " + res.rowsAffected);

          resolve(res);

        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateTaskSubmitStatus', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'updateTaskSubmitStatus', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  // updateTaskStatus(responseList) {
  //   return new Promise((resolve, reject) => {
  //     this.dbctrl.getDB().transaction((transaction) => {

  //       let insertValues = [];

  //       //11/12/2018 -- Mayur Varshney -- update selected process in Task, change query
  //       //let sqlUpdate = "UPDATE Task SET Task_Status = ?, Submit_Status = ?, Date = ?, Sync_Status = ?, StatusID = ?, Selected_Process = ? WHERE Task_Number = ?";
  //       // 09/29/2019 -- Parvinder -- remove submit_status & update sync_status in taskTable
  //       let sqlUpdate = "UPDATE Task SET Task_Status = ?, Date = ?, Sync_Status = ?, StatusID = ?, Selected_Process = ? WHERE Task_Number = ?";
  //       insertValues.push(responseList.Task_Status);
  //       //insertValues.push(responseList.Submit_Status);
  //       insertValues.push(responseList.Date);
  //       insertValues.push(responseList.Sync_Status);//To verify
  //       insertValues.push(responseList.StatusID);
  //       // insertValues.push(responseList.IsDeclined);
  //       insertValues.push(responseList.Selected_Process);
  //       insertValues.push(responseList.Task_Number);

  //       //this.logger.log(this.fileName,'function',"TASK UPDATE VALUES =====> " + insertValues);

  //       transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {

  //         //this.logger.log(this.fileName,'function',"TASK ROW AFFECTED: " + res.rowsAffected);

  //         resolve(res);

  //       }, (tx, error) => {
  //         this.logger.log(this.fileName, 'updateTaskSubmitStatus', 'Error: ' + JSON.stringify(error.message));
  //         reject(error);
  //       });

  //     }, (error) => {
  //       this.logger.log(this.fileName, 'updateTaskSubmitStatus', 'Error TXN: ' + JSON.stringify(error.message));
  //       reject(error);
  //     });
  //   });
  // };


  updateTaskStatusLocal(responseList) {
    let sqlUpdate;
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {

        let insertValues = [];
        if (responseList.StatusID == Enums.Jobstatus.Accepted) {

          sqlUpdate = "UPDATE Task SET Task_Status = ?, Date = ?, Sync_Status = ?, StatusID = ?, IsDeclined = ?  WHERE Task_Number = ?";

          insertValues.push(responseList.Task_Status);
          //insertValues.push(responseList.Submit_Status);
          insertValues.push(new Date());
          insertValues.push(responseList.Sync_Status);
          insertValues.push(responseList.StatusID);
          insertValues.push(responseList.IsDeclined);
          // insertValues.push("false");
          insertValues.push(responseList.Task_Number);
        } else {
          sqlUpdate = "UPDATE Task SET Task_Status = ?, Date = ?, Sync_Status = ?, StatusID = ?, Selected_Process = ?, DebriefSubmissionDate = ? WHERE Task_Number = ?";
          insertValues.push(responseList.Task_Status);
          //insertValues.push(responseList.Submit_Status);
          insertValues.push(new Date());
          insertValues.push(responseList.Sync_Status);//To verify
          insertValues.push(responseList.StatusID);
          // insertValues.push(responseList.IsDeclined);
          insertValues.push(responseList.Selected_Process);
          insertValues.push(responseList.DebriefSubmissionDate ? responseList.DebriefSubmissionDate : null);
          insertValues.push(responseList.Task_Number);
        }

        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          resolve(res);

        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateTaskSubmitStatus', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'updateTaskSubmitStatus', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  updateLastTask(userObject) {
    let query = "UPDATE User SET Last_Updated_Task = ? WHERE ID = ?";
    let queryParams = [userObject.Last_Updated_Task, userObject.ID];
    return this.insertData(query, queryParams, "updateLastTask");
  };

  /**
   * Saves list of Tasks in DB as a Batch Statement
   *
   * @param {*} response
   * @returns Promise<any>
   * @memberof LocalServiceProvider
   */
  insertTaskAndSignaturesBatch(response) {
    let sqlBatchStmt = [];
    for (let k in response) {
      let data = response[k];
      let stmtValues = [];
      let stmtUpdateValues = [];
      let sqlUpdate: any[];
      let sqlInsert: any[];
      // 04/29/2019 -- Mayur Varshney -- update and insert DebriefSubmissionDate in taskTable
      // if (data.IsStandalone == 'true') {
      //   sqlUpdate = ["UPDATE Task SET Job_Description = ?, Duration = ?, Task_Status = ?, Customer_Name =?, Street_Address = ?, City = ?, State = ?, Country = ?, Zip_Code = ?, Expense_Method = ?, Labor_Method = ?, Travel_Method = ?, Material_Method = ?, Service_Request = ?, Assigned = ?, Start_Date = ?, End_Date = ?, Activity_Id = ?, Work_Phone_Number = ?, Mobile_Phone_Number = ?, Address1 = ?, SR_ID = ?, Name = ?, Contact_Name = ?, ResourceId = ?, Charge_Type = ?, Project_Number = ?, Customer_PONumber = ?, Customer_ID = ?, Business_Group = ?, Contract_Number = ?, Contract_Desc_Link = ?, DeclineComments = ?, StatusID = ?, IsDeclined = ?, FSR_PrintExpenseComplete = ?, FSR_PrintExpenseOnSite = ?, Business_Unit = ?, DebriefSubmissionDate = ?, Safety_Check = ?, Request_Summary = ?, Address2 = ? WHERE Task_Number = ? AND Sync_Status != ?"];
      //   // 10/30/2018 -- Mayur Varshney -- update query, added two variables as IsStandalone, Job_Number, Selected_Process, OracleDBID
      //   sqlInsert = ["INSERT OR IGNORE INTO Task(Job_Description, Duration, Task_Status, Customer_Name, Street_Address, City, State, Country, Zip_Code, Expense_Method, Labor_Method, Travel_Method, Material_Method, Service_Request, Assigned, Start_Date, End_Date, Activity_Id, Work_Phone_Number, Mobile_Phone_Number, Address1, SR_ID, Name, Contact_Name, ResourceId, Charge_Type, Project_Number, Customer_PONumber, Customer_ID, Business_Group, Contract_Number, Contract_Desc_Link, DeclineComments, StatusID, IsDeclined,  FSR_PrintExpenseComplete, FSR_PrintExpenseOnSite, Business_Unit, DebriefSubmissionDate, Safety_Check, Request_Summary, Address2, Task_Number, Sync_Status, Email, Date, Type, Sync_Status, IsStandalone, Job_Number, OracleDBID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"];
      // }
      // else {
      sqlUpdate = ["UPDATE Task SET Job_Description = ?, Duration = ?, Task_Status = ?, Customer_Name =?, Street_Address = ?, City = ?, State = ?, Country = ?, Zip_Code = ?, Expense_Method = ?, Labor_Method = ?, Travel_Method = ?, Material_Method = ?, Service_Request = ?, Assigned = ?, Start_Date = ?, End_Date = ?, Activity_Id = ?, Work_Phone_Number = ?, Mobile_Phone_Number = ?, Address1 = ?, SR_ID = ?, Name = ?, Contact_Name = ?, ResourceId = ?, Charge_Type = ?, Project_Number = ?, Customer_PONumber = ?, Customer_ID = ?, Business_Group = ?, Contract_Number = ?, Contract_Desc_Link = ?, DeclineComments = ?, StatusID = ?, IsDeclined = ?, FSR_PrintExpenseComplete = ?, FSR_PrintExpenseOnSite = ?, Business_Unit = ?, DebriefSubmissionDate = ?, Safety_Check = ?, Request_Summary = ?, Address2 = ?, Selected_Process = ?  WHERE Task_Number = ? AND Sync_Status = ?"];
      // 10/30/2018 -- Mayur Varshney -- update query, added two variables as IsStandalone, Job_Number, Selected_Process, OracleDBID
      sqlInsert = ["INSERT OR IGNORE INTO Task(Job_Description, Duration, Task_Status, Customer_Name, Street_Address, City, State, Country, Zip_Code, Expense_Method, Labor_Method, Travel_Method, Material_Method, Service_Request, Assigned, Start_Date, End_Date, Activity_Id, Work_Phone_Number, Mobile_Phone_Number, Address1, SR_ID, Name, Contact_Name, ResourceId, Charge_Type, Project_Number, Customer_PONumber, Customer_ID, Business_Group, Contract_Number, Contract_Desc_Link, DeclineComments, StatusID, IsDeclined,  FSR_PrintExpenseComplete, FSR_PrintExpenseOnSite, Business_Unit, DebriefSubmissionDate, Safety_Check, Request_Summary, Address2, Selected_Process, Task_Number, Sync_Status, Email, Date, Type, IsStandalone, Job_Number, OracleDBID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"];
      // }

      stmtUpdateValues.push(data.Job_Description);
      stmtUpdateValues.push(data.Duration);
      stmtUpdateValues.push(data.Task_Status ? data.Task_Status : null);
      stmtUpdateValues.push(data.Customer_Name);
      stmtUpdateValues.push(data.Street_Address);
      stmtUpdateValues.push(data.City);
      stmtUpdateValues.push(data.State);
      stmtUpdateValues.push(data.Country);
      stmtUpdateValues.push(data.Zip_Code);
      stmtUpdateValues.push(data.Expense_Method);
      stmtUpdateValues.push(data.Labor_Method);
      stmtUpdateValues.push(data.Travel_Method);
      stmtUpdateValues.push(data.Material_Method);
      stmtUpdateValues.push(data.Service_Request);
      stmtUpdateValues.push(data.Assigned);
      stmtUpdateValues.push(data.Start_Date);
      stmtUpdateValues.push(data.End_Date);
      stmtUpdateValues.push(data.Activity_Id);
      stmtUpdateValues.push(data.Work_Phone_Number);
      stmtUpdateValues.push(data.Mobile_Phone_Number);
      stmtUpdateValues.push(data.Address1);
      stmtUpdateValues.push(data.SR_ID);
      stmtUpdateValues.push(data.Name);
      stmtUpdateValues.push(data.Contact_Name);
      stmtUpdateValues.push(this.valueProvider.getResourceId());
      stmtUpdateValues.push(data.Charge_Type);
      stmtUpdateValues.push(data.Project_Number);
      stmtUpdateValues.push(data.Customer_PONumber);
      stmtUpdateValues.push(data.Customer_ID);
      stmtUpdateValues.push(data.Business_Group ? data.Business_Group : null);
      stmtUpdateValues.push(data.Contract_Number);
      stmtUpdateValues.push(data.Contract_Desc_Link);
      // 10/13/2018 -- Mayur Varshney -- insert/update decline comments if available
      stmtUpdateValues.push(data.Decline_Comments ? data.Decline_Comments : '');
      stmtUpdateValues.push(data.Task_Status_ID);
      stmtUpdateValues.push(data.Task_Status_ID == Enums.Jobstatus.Debrief_Declined.toString() ? 'true' : 'false');
      stmtUpdateValues.push(data.Print_Expense_On_Completed_Rep ? (data.Print_Expense_On_Completed_Rep == 'Yes' ? 'true' : 'false') : '');
      stmtUpdateValues.push(data.Print_Expense_On_On_Site_Rep ? (data.Print_Expense_On_On_Site_Rep == 'Yes' ? 'true' : 'false') : '');
      stmtUpdateValues.push(data.Business_Unit ? data.Business_Unit : '');
      stmtUpdateValues.push(data.DebriefSubmissionDate ? data.DebriefSubmissionDate : null);
      // 11/22/2018 -- Mayur Varshney -- apply safety check box
      // 12/04/2018 -- Mansi Arora -- default value changed to false
      // 12/14/2018 -- Mayur Varshney -- apply condition if Safety_Check is returning Yes then insert true else false in Task Table
      stmtUpdateValues.push((data.Safety_Check && data.Safety_Check == 'Yes') ? true : false);
      //05/13/2019 -- Zohaib Khan -- Added Address 2 field
      stmtUpdateValues.push(data.Request_Summary)
      stmtUpdateValues.push(data.Address2)
      stmtUpdateValues.push(data.SelectedProcess == '' ? null : data.SelectedProcess);
      // stmtUpdateValues.push(data.SDRReportID == '' ? null : data.SDRReportID);
      stmtUpdateValues.push(data.Task_Number);
      stmtUpdateValues.push("true");
      sqlUpdate.push(stmtUpdateValues);

      stmtValues = stmtValues.concat(stmtUpdateValues);
      stmtValues.push(data.Email);
      stmtValues.push(new Date());
      stmtValues.push("CUSTOMER");
      // 10/30/2018 -- Mayur Varshney -- added new field IsStandalone, passing false
      stmtValues.push(false);
      // 10/30/2018 -- Mayur Varshney -- added new field Job_Number, passing null
      stmtValues.push(null);
      // 10/31/2018 -- Mayur Varshney -- added new field Selected_Process, passing null
      // TODO - Need discussion
      // stmtValues.push(null);
      // 10/31/2018 -- Mayur Varshney -- added new field OracleDBID, passing userID
      stmtValues.push(this.valueProvider.getUserId());
      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlUpdate);
      sqlBatchStmt.push(sqlInsert);
      sqlBatchStmt = sqlBatchStmt.concat(this.getEngineerSignatureQuery(data));
      sqlBatchStmt = sqlBatchStmt.concat(this.getCustomerSignatureQuery(data));
    }
    return this.insertBatchData(sqlBatchStmt, "insertTaskAndSignaturesBatch");
  }

  /**
   * Insert Tasks coming from DBCS for OSC and Non OSC Jobs
   *
   * @param {*} response
   * @returns
   * @memberof LocalServiceProvider
   */
  insertTaskListBatchDBCS(response) {
    let sqlBatchStmt = [];
    for (let k in response) {
      let data = response[k];
      let stmtValues = [];
      let stmtUpdateValues = [];
      let sqlUpdate: any[];
      let sqlInsert: any[];
      if (data.isstandalone == 'true') {
        // 02/18/2019 -- Mayur Varshney -- change in update/insert query, remove  Submit_Status
        // 04/29/2019 -- Mayur Varshney -- update and insert DebriefSubmissionDate in taskTable
        sqlUpdate = ["UPDATE Task SET Job_Description = ?, Duration = ?, Task_Status = ?, Customer_Name =?, Street_Address = ?, City = ?, State = ?, Country = ?, Zip_Code = ?, Expense_Method = ?, Labor_Method = ?, Travel_Method = ?, Material_Method = ?, Service_Request = ?, Assigned = ?, Start_Date = ?, End_Date = ?, Activity_Id = ?, Work_Phone_Number = ?, Mobile_Phone_Number = ?, Address1 = ?, SR_ID = ?, Name = ?, Contact_Name = ?, ResourceId = ?, Charge_Type = ?, Project_Number = ?, Customer_PONumber = ?, Customer_ID = ?, Business_Group = ?, Contract_Number = ?, Contract_Desc_Link = ?, DeclineComments = ?, StatusID = ?, IsDeclined = ?, FSR_PrintExpenseComplete = ?, FSR_PrintExpenseOnSite = ?, Business_Unit = ?, Safety_Check = ?, Email = ?, Date = ?, Type = ?, Sync_Status = ?, Selected_Process = ?, IsStandalone = ?, Job_Number = ?, OracleDBID = ?, ReportID = ?, DBCS_SyncStatus = ? WHERE Task_Number = ?"];
        sqlInsert = ["INSERT OR IGNORE INTO Task(Job_Description, Duration, Task_Status, Customer_Name, Street_Address, City, State, Country, Zip_Code, Expense_Method, Labor_Method, Travel_Method, Material_Method, Service_Request, Assigned, Start_Date, End_Date, Activity_Id, Work_Phone_Number, Mobile_Phone_Number, Address1, SR_ID, Name, Contact_Name, ResourceId, Charge_Type, Project_Number, Customer_PONumber, Customer_ID, Business_Group, Contract_Number, Contract_Desc_Link, DeclineComments, StatusID, IsDeclined,  FSR_PrintExpenseComplete, FSR_PrintExpenseOnSite, Business_Unit, Safety_Check, Email, Date, Type, Sync_Status, Selected_Process, IsStandalone, Job_Number, OracleDBID, ReportID, DBCS_SyncStatus, Task_Number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"];

        stmtUpdateValues.push(data.job_description);
        stmtUpdateValues.push(data.duration);
        stmtUpdateValues.push(data.task_status);
        stmtUpdateValues.push(data.customer_name);
        stmtUpdateValues.push(data.street_address);
        stmtUpdateValues.push(data.city);
        stmtUpdateValues.push(data.state);
        stmtUpdateValues.push(data.country);
        stmtUpdateValues.push(data.zip_code);
        stmtUpdateValues.push(data.expense_method);
        stmtUpdateValues.push(data.labor_method);
        stmtUpdateValues.push(data.travel_method);
        stmtUpdateValues.push(data.material_method);
        stmtUpdateValues.push(data.service_request);
        stmtUpdateValues.push(data.assigned);
        stmtUpdateValues.push(data.start_date);
        stmtUpdateValues.push(data.end_date);
        stmtUpdateValues.push(data.activity_id);
        stmtUpdateValues.push(data.work_phone_number);
        stmtUpdateValues.push(data.mbile_phone_number);
        stmtUpdateValues.push(data.address1);
        stmtUpdateValues.push(data.sr_id);
        stmtUpdateValues.push(data.name);
        stmtUpdateValues.push(data.contact_name);
        stmtUpdateValues.push(data.resourceid);
        stmtUpdateValues.push(data.charge_type);
        stmtUpdateValues.push(data.project_number);
        stmtUpdateValues.push(data.customer_ponumber);
        stmtUpdateValues.push(data.customer_id);
        stmtUpdateValues.push(data.business_group);
        stmtUpdateValues.push(data.contract_number);
        stmtUpdateValues.push(data.contract_desc_link);
        // 10/13/2018 -- Mayur Varshney -- insert/update decline comments if available
        stmtUpdateValues.push(data.declinecomments);
        stmtUpdateValues.push(data.statusid);
        stmtUpdateValues.push(data.isdeclined);
        stmtUpdateValues.push(data.fsr_printexpensecompleted);
        stmtUpdateValues.push(data.fsr_printexpenseonsite);
        stmtUpdateValues.push(data.business_unit);
        stmtUpdateValues.push(null);
        // stmtValues = stmtValues.concat(stmtUpdateValues);
        stmtUpdateValues.push(data.email);
        stmtUpdateValues.push(data.date);
        stmtUpdateValues.push(data.type);
        stmtUpdateValues.push("true");
        stmtUpdateValues.push(data.selected_process);
      } else {
        // 02/18/2019 -- Mayur Varshney -- change in update query, remove  Submit_Status
        // 04/29/2019 -- Mayur Varshney -- update DebriefSubmissionDate in taskTable
        sqlUpdate = ["UPDATE Task SET IsStandalone = ?, Job_Number = ?, OracleDBID = ?, ReportID = ?, DBCS_SyncStatus = ? WHERE Task_Number = ?"];
      }
      stmtUpdateValues.push(data.isstandalone);
      stmtUpdateValues.push(data.job_number ? data.job_number : null);
      stmtUpdateValues.push(data.oracledbid);
      stmtUpdateValues.push(data.reportid ? data.reportid : null);
      stmtUpdateValues.push(true);
      stmtUpdateValues.push(data.task_number);
      sqlUpdate.push(stmtUpdateValues);
      if (data.isstandalone == 'true') {
        stmtValues = stmtUpdateValues;
        sqlInsert.push(stmtValues);
      }
      sqlBatchStmt.push(sqlUpdate);
      if (data.isstandalone == 'true') sqlBatchStmt.push(sqlInsert);
    }
    return this.insertBatchData(sqlBatchStmt, "insertTaskListBatchDBCS");
  }





  /**
   * Saves list of Internal Activities in DB as a Batch Statement
   *
   * @param {*} response
   * @returns Promise<any>
   * @memberof LocalServiceProvider
   */
  insertInternalListBatch(response) {
    return new Promise((resolve, reject) => {
      let sqlBatchStmt = [];
      for (let k in response) {
        let data = response[k];
        let stmtValues = [];
        // 11/21/2018 -- Mayur Varshney -- add Activity_Description column in the internal table
        let sqlUpdate: any[] = ["UPDATE Internal SET Start_time = ?, End_time = ?, Activity_type = ?, Status = ?, ResourceId = ?, Activity_Description = ? WHERE Activity_Id = ?"];
        let sqlInsert: any[] = ["INSERT OR IGNORE INTO Internal(Start_time,End_time,Activity_type,Status,ResourceId,Activity_Description,Activity_Id) VALUES (?, ?, ?, ?, ?, ?, ?)"];
        stmtValues.push(data.Start_time);
        stmtValues.push(data.End_time);
        stmtValues.push(data.Activity_type);
        stmtValues.push(data.Status);
        stmtValues.push(this.valueProvider.getResourceId());
        stmtValues.push(data.Description);
        stmtValues.push(data.Activity_Id);
        sqlUpdate.push(stmtValues);
        sqlInsert.push(stmtValues);
        sqlBatchStmt.push(sqlUpdate);
        sqlBatchStmt.push(sqlInsert);
      }
      //this.logger.log(this.fileName, 'insertInternalListBatch', "stmtValues :" + JSON.stringify(stmtValues));
      this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (res) => {
        // this.logger.log(this.fileName, 'insertInternalListBatch', "Response :" + JSON.stringify(res));
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, 'insertInternalListBatch', "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  getInternalList() {
    return new Promise((resolve, reject) => {
      let value = [];
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT * FROM Internal WHERE ResourceId = ? AND Status = ?", [this.valueProvider.getResourceId(), "pending"], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          //this.logger.log(this.fileName,'function',"GET INTERNAL DB ==========> " + JSON.stringify(value));
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getInternalList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getInternalList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  updateLastTaskDetail(userObject) {
    return new Promise((resolve, reject) => {
      //this.logger.log(this.fileName,'function',"USER UPDATE OBJECT =====> " + JSON.stringify(userObject));
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE User SET Last_Updated_Task_Detail = ? WHERE ID = ?";
        insertValues.push(userObject.Last_Updated_Task_Detail);
        insertValues.push(userObject.ID);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          resolve(true);
          //this.logger.log(this.fileName,'function',"USER ROW AFFECTED: " + res.rowsAffected);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateLastTaskDetail', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateLastTaskcusDetail', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  getProducts() {
    return new Promise((resolve, reject) => {
      let query = '';
      //this.logger.log(this.fileName,'function',userDetails.EBSUserId);
      query = "SELECT * FROM Product";
      //this.logger.log(this.fileName,'function',query);
      let lang = [];
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              lang.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.TaskList))

          resolve(lang);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getProducts', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  };

  getManufacturer() {
    return new Promise((resolve, reject) => {
      let query = '';
      //this.logger.log(this.fileName,'function',userDetails.EBSUserId);
      query = "SELECT * FROM Manufacturer";
      //this.logger.log(this.fileName,'function',query);
      let lang = [];
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              lang.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.TaskList))

          resolve(lang);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getManufacturer', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  };

  getStatus() {
    return new Promise((resolve, reject) => {
      let query = '';
      //this.logger.log(this.fileName,'function',userDetails.EBSUserId);
      query = "SELECT * FROM Status";
      //this.logger.log(this.fileName,'function',query);
      let lang = [];
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              lang.push(item);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.TaskList))

          resolve(lang);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getStatus', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  };

  saveInstalledBase(installBase) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlInsert = `INSERT OR REPLACE INTO InstallBase(InstalledBaseId, Product_Line, Serial_Number, System_ID, TagNumber, Original_PO_Number,
          Task_Number, Service_Request, Assigned, Start_Date, End_Date, ResourceId, Item_Number, Description, Status_Id, Manufacturer_Id, Product_Id,
          Updated_By, Updated_Date, Sync_Status, Customer_Id, Customer_Name)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        insertValues.push(installBase.InstalledBaseId);
        insertValues.push(installBase.Product_Line ? installBase.Product_Line : "");
        insertValues.push(installBase.Serial_Number ? installBase.Serial_Number : "");
        insertValues.push(installBase.System_ID ? installBase.System_ID : "");
        insertValues.push(installBase.TagNumber ? installBase.TagNumber : "");
        insertValues.push(installBase.Original_PO_Number ? installBase.Original_PO_Number : "");
        insertValues.push(installBase.Task_Number ? installBase.Task_Number : "");
        insertValues.push(installBase.Service_Request ? installBase.Service_Request : "");
        insertValues.push(installBase.Assigned ? installBase.Assigned : "");
        insertValues.push(installBase.Start_Date ? installBase.Start_Date : "");
        insertValues.push(installBase.End_Date ? installBase.End_Date : "");
        insertValues.push(this.valueProvider.getResourceId());
        insertValues.push(installBase.Item_Number ? installBase.Item_Number : "");
        insertValues.push(installBase.Description ? installBase.Description : "");
        insertValues.push(installBase.Status_Id ? installBase.Status_Id : "");
        insertValues.push(installBase.Manufacturer_Id ? installBase.Manufacturer_Id : "");
        insertValues.push(installBase.Product_Id ? installBase.Product_Id : "");
        insertValues.push(installBase.Updated_By ? installBase.Updated_By : "");
        insertValues.push(installBase.Updated_Date ? installBase.Updated_Date : "");
        // 07/27/2018 Mayur Varshney
        // push Sync_Status value directly.
        // Previous code - insertValues.push(installBase.Installed_Base_ID ? "true" : "false");
        insertValues.push(installBase.Sync_Status);
        insertValues.push(installBase.Customer_Id ? installBase.Customer_Id : "");
        insertValues.push(installBase.Customer_Name ? installBase.Customer_Name : "");

        transaction.executeSql(sqlInsert, insertValues, (tx, res) => {
          resolve(res.insertId);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'saveInstalledBase', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'saveInstalledBase', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  /**
   * Saves List of Install Base in DB as a batch Statement
   *
   * @param {*} response
   * @returns
   * @memberof LocalServiceProvider
   */
  getInstallBaseBatch(response): Array<Array<any>> {
    let sqlBatchStmt = [];
    for (let k in response) {
      let data = response[k];
      let stmtValues = [];
      let sqlInsert: any[] = [`INSERT OR REPLACE INTO InstallBase(InstalledBaseId, Product_Line, Serial_Number, System_ID, TagNumber, Original_PO_Number,
          Task_Number, Service_Request, Assigned, Start_Date, End_Date, ResourceId, Item_Number, Description, Status_Id, Manufacturer_Id,
          Updated_By, Updated_Date, Sync_Status, Customer_Id, Customer_Name, Product_Id, Installed_Base_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`];
      if (data.Mobile_Indicator && data.Mobile_Indicator != '') {
        stmtValues.push(data.Mobile_Indicator);
      } else {
        stmtValues.push(data.Installed_Base_ID);
      }
      stmtValues.push(data.Product_Line);
      stmtValues.push(data.Serial_Number);
      stmtValues.push(data.System_ID);
      stmtValues.push(data.TagNumber);
      stmtValues.push(data.Original_PO_Number);
      stmtValues.push(data.Task_Number);
      stmtValues.push(data.Service_Request);
      stmtValues.push(data.Assigned);
      stmtValues.push(data.Start_Date);
      stmtValues.push(data.End_Date);
      stmtValues.push(this.valueProvider.getResourceId());
      stmtValues.push(data.Item_Number);
      stmtValues.push(data.Description);
      stmtValues.push(data.Status_Id);
      stmtValues.push(data.Manufacturer_Id);
      stmtValues.push(data.Updated_By);
      stmtValues.push(data.Updated_Date);
      stmtValues.push(true);
      stmtValues.push(data.Customer_Id);
      stmtValues.push(data.Customer_Name);
      stmtValues.push(data.Product_Id);
      stmtValues.push(data.Installed_Base_ID);
      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlInsert);
    }
    return sqlBatchStmt;
  }

  /**
   *08/17/2018 kamal check if Id exits update else insert InstalledBase Locally
   *
   * @param {*} response
   * @returns
   * @memberof LocalServiceProvider
   */
  // insertInstalledBaseList(response) {
  //   let sqlBatchStmt = [];
  //   for (let i = 0; i < response.length; i++) {
  //     sqlBatchStmt.push(this.updateInstalledBase(response[i]));
  //     sqlBatchStmt.push(this.insertInstalledBase(response[i]));
  //   }
  //   return this.insertBatchData(sqlBatchStmt, "insertInstalledBaseList");
  // };
  /**
  *08/17/2018 kamal update InstalledBase Locally
  *
  * @param {*} responseList
  * @returns
  * @memberof LocalServiceProvider
  */
  updateInstalledBaseStatus(responseList) {
    let sqlBatchStmt = [];
    responseList.forEach(element => {
      sqlBatchStmt.push([
        "UPDATE InstallBase SET Sync_Status = 'true', Installed_Base_ID = ? WHERE Sync_Status = 'false' AND InstalledBaseId = ?",
        [element.id ? element.id : element.Installed_Base_ID, element.InstalledBaseId]
      ]);
    });
    return this.insertBatchData(sqlBatchStmt, "updateInstalledBaseStatus");
  };

  /**
  *08/17/2018 kamal Insert InstalledBase Locally
  *
  * @param {*} responseList
  * @returns
  * @memberof LocalServiceProvider
  */
  // insertInstalledBase(responseList) {
  //   let insertValues = [];
  //   let sqlInsert = "INSERT INTO InstallBase (InstalledBaseId, Product_Line, Serial_Number, System_ID, TagNumber, Original_PO_Number, Task_Number, Service_Request, Assigned, Start_Date, End_Date, ResourceId, Item_Number, Description, Status_Id, Manufacturer_Id, Updated_By, Updated_Date, Sync_Status, Customer_Id,Customer_Name,Product_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  //   insertValues.push(responseList.InstalledBaseId);
  //   insertValues.push(responseList.Product_Line ? responseList.Product_Line : "");
  //   insertValues.push(responseList.Serial_Number ? responseList.Serial_Number : "");
  //   insertValues.push(responseList.System_ID ? responseList.System_ID : "");
  //   insertValues.push(responseList.TagNumber ? responseList.TagNumber : "");
  //   insertValues.push(responseList.Original_PO_Number ? responseList.Original_PO_Number : "");
  //   insertValues.push(responseList.Task_Number ? responseList.Task_Number : "");
  //   insertValues.push(responseList.Service_Request ? responseList.Service_Request : "");
  //   insertValues.push(responseList.Assigned ? responseList.Assigned : "");
  //   insertValues.push(responseList.Start_Date);
  //   insertValues.push(responseList.End_Date ? responseList.End_Date : "");
  //   insertValues.push(this.valueProvider.getResourceId());
  //   insertValues.push(responseList.Item_Number);
  //   insertValues.push(responseList.Description ? responseList.Description : "");
  //   insertValues.push(responseList.Status_Id);
  //   insertValues.push(responseList.Manufacturer_Id);
  //   insertValues.push(responseList.Updated_By ? responseList.Updated_By : "");
  //   insertValues.push(responseList.Updated_Date ? responseList.Updated_Date : "");
  //   insertValues.push(responseList.Installed_Base_ID ? "true" : "false");
  //   insertValues.push(responseList.Customer_Id ? responseList.Customer_Id : "");
  //   insertValues.push(responseList.Customer_Name ? responseList.Customer_Name : "");
  //   insertValues.push(responseList.Product_Id);
  //   return [sqlInsert, insertValues];
  // };

  /**
   * Saves List of Contacts in DB as Batch Statement
   *
   * @param {*} response
   * @returns
   * @memberof LocalServiceProvider
   */
  getContactsBatch(response): Array<Array<any>> {
    let sqlBatchStmt = [];
    for (let k in response) {
      let data = response[k];
      let stmtValues = [];
      let sqlInsert: any[] = ["INSERT OR REPLACE INTO Contact VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT Contact_ID_PK FROM Contact WHERE Contact_ID = ? AND Task_Number = ?))"];
      stmtValues.push(parseInt(data.Contact_ID));
      stmtValues.push(data.Customer_Name);
      stmtValues.push(data.Contact_Name);
      stmtValues.push(data.Home_Phone);
      stmtValues.push(data.Mobile_Phone);
      stmtValues.push(data.Fax_Phone);
      stmtValues.push(data.Office_Phone);
      stmtValues.push(data.Email);
      stmtValues.push(data.Foreign_Key);
      stmtValues.push(data.Task_Number);
      stmtValues.push(data.Service_Request);
      stmtValues.push(data.Assigned);
      stmtValues.push(data.Start_Date);
      stmtValues.push(data.End_Date);
      stmtValues.push(data.Default_Value);
      stmtValues.push(data.Contact_Preference);
      stmtValues.push(this.valueProvider.getResourceId());
      stmtValues.push(data.First_Name);
      stmtValues.push(data.Last_Name);
      stmtValues.push(parseInt(data.Contact_ID));
      stmtValues.push(data.Task_Number);
      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlInsert);
    }
    return sqlBatchStmt;
  }

  public getLang_Key_Mappings(langid) {
    let langList = [];
    return new Promise((resolve, reject) => {
      let query = '';
      //09/12/2018 -- Kamal Waila -- Change query : -SELECT Lang_Id, LKM.Key_Id, Key_Name, Value FROM Language_Key_Mappings LKM INNER JOIN MST_Translation_Key MTK ON MTK.id = LKM.Key_Id WHERE Lang_Id = ?"
      //09/25/2018 -- Mayur Varshney -- Change query to get Key_Length from MST_Translation_Key table
      query = "SELECT LKM.Lang_Id, MTK.id, MTK.Key_Name, LKM.Value, MTK.Key_Length FROM  MST_Translation_Key MTK LEFT OUTER JOIN  Language_Key_Mappings LKM ON LKM.Key_Id = MTK.id and LKM.Lang_Id = ?";
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [langid], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              langList.push(item);
            }
          }
          resolve(langList);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getLang_Key_Mappings', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  /**
   * Saves list of Note in DB as a Batch statement
   *
   * @param {*} response
   * @returns
   * @memberof LocalServiceProvider
   */
  getNoteBatch(response): Array<Array<any>> {
    let sqlBatchStmt = [];
    for (let k in response) {
      let data = response[k];
      let stmtValues = [];
      let sqlUpdate: any[] = ["UPDATE Note SET Notes = ?, Notes_type = ?, Note_Description = ?, Created_By = ?, MobileCreatedBy = ?, Task_Number = ?, Assigned = ?, Start_Date = ?, End_Date = ?, Last_updated_date = ?, Incident = ?, ResourceId = ?  WHERE Notes_ID = ? AND Service_Request =?"];
      let sqlInsert: any[] = ["INSERT OR IGNORE INTO Note(Notes,Notes_type,Note_Description,Created_By,MobileCreatedBy,Task_Number,Assigned,Start_Date,End_Date,Last_updated_date,Incident,ResourceId,Notes_ID,Service_Request) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"];
      stmtValues.push(data.Notes);
      stmtValues.push(data.Notes_type);
      stmtValues.push(data.Note_Description);
      stmtValues.push(data.Created_By);
      stmtValues.push(data.MobileCreatedBy);
      stmtValues.push(data.Task_Number);
      stmtValues.push(data.Assigned);
      stmtValues.push(data.Start_Date);
      stmtValues.push(data.End_Date);
      stmtValues.push(data.Last_updated_date);
      stmtValues.push(data.Incident);
      stmtValues.push(this.valueProvider.getResourceId());
      stmtValues.push(data.Notes_ID);
      stmtValues.push(data.Service_Request);
      sqlUpdate.push(stmtValues);
      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlUpdate);
      sqlBatchStmt.push(sqlInsert);
    }
    return sqlBatchStmt;
  }

  getAttachmentBatch(response): Array<Array<any>> {
    let sqlBatchStmt = [];
    for (let k in response) {
      let data = response[k];
      // 08/01/2019 -- Haidar -- closed jobs attachment data undefined check
      if (data != undefined || data != null) {
        let stmtValues = [];
        let sqlInsert: any[] = ["INSERT OR IGNORE INTO Attachment(File_Name,File_Type,File_Path,Type,AttachmentType,Created_Date,Task_Number,SRID,ResourceId,Attachment_Id,Attachment_Status,Sync_Status, OSC_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"];
        stmtValues.push(data.File_Name);
        stmtValues.push(data.File_Type);
        stmtValues.push(data.File_Path);
        // stmtValues.push(data.base64);
        stmtValues.push(data.Type);
        stmtValues.push(data.AttachmentType);
        stmtValues.push(data.Created_Date);
        stmtValues.push(data.Task_Number);
        stmtValues.push(data.SRID);
        stmtValues.push(this.valueProvider.getResourceId());
        stmtValues.push(parseInt(data.Attachment_Id));
        stmtValues.push(false);
        stmtValues.push(true);
        stmtValues.push(parseInt(data.Attachment_Id));
        sqlInsert.push(stmtValues);
        sqlBatchStmt.push(sqlInsert);
      }
    }
    return sqlBatchStmt;
  }

  deleteAttachmentObject(attachmendId) {

    this.dbctrl.getDB().transaction((transaction) => {
      //this.logger.log(this.fileName,'function',attachmendId);
      let sqlDelete = "DELETE FROM Attachment where Attachment_Id = " + attachmendId;
      //this.logger.log(this.fileName,'function',"sqlDelete=" + sqlDelete);

      transaction.executeSql(sqlDelete);
    }, (error) => {
      this.logger.log(this.fileName, 'deleteAttachmentObject', 'Promise Error: ' + JSON.stringify(error.message));
    });
  }

  updateLastLOV(userObject) {
    return new Promise((resolve, reject) => {
      //this.logger.log(this.fileName,'function',"USER UPDATE OBJECT =====> " + JSON.stringify(userObject));
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE User SET Last_Updated_LOV = ? WHERE ID = ?";
        insertValues.push(userObject.Last_Updated_LOV);
        insertValues.push(userObject.ID);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          //this.logger.log(this.fileName,'function',"USER ROW AFFECTED: " + res.rowsAffected);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateLastLOV', 'Error: ' + JSON.stringify(error.message));
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateLastLOV', 'Error TXN: ' + JSON.stringify(error.message));
      });
    });
  };

  updateLastSR(userObject) {
    let query = "UPDATE User SET Last_Updated_SR = ? WHERE ID = ?";
    let queryParams = [userObject.ID, userObject.Last_Updated_SR]
    return this.insertData(query, queryParams, "updateLastSR");
  };

  updatTimeSheetLovTime(userObject) {
    let query = "UPDATE User SET Last_Updated_ClarityLOV = ? WHERE ID = ?";
    let queryParams = [userObject.Last_Updated_SR, userObject.ID]
    return this.insertData(query, queryParams, "updatTimeSheetLovTime");
  };

  updateLastDelete(userObject) {
    let query = "UPDATE User SET Last_Updated_Delete = ? WHERE ID = ?";
    let queryParams = [userObject.Last_Updated_Delete, userObject.ID];
    return this.insertData(query, queryParams, "updateLastDelete");
  };

  // updateDeclineStatus(tableName) {
  //   return new Promise((resolve, reject) => {
  //     //this.logger.log(this.fileName,'function',"USER UPDATE OBJECT =====> " + JSON.stringify(userObject));
  //      this.dbctrl.getDB().transaction((transaction) => {
  //       let insertValues = [];
  //       let sqlUpdate = "UPDATE '" + tableName + "' SET DeclineStatus = case when DeclineStatus IS NULL then '" + Enums.DeclineStatus.Submitted + "' else '" + Enums.DeclineStatus.ReSubmitted + "' END where Task_Number = ? AND (DeclineStatus IS NULL OR DeclineStatus = '" + Enums.Jobstatus.Debrief_Declined + "')";
  //       insertValues.push(this.valueProvider.getTaskId());
  //       transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
  //         //this.logger.log(this.fileName,'function',"USER ROW AFFECTED: " + res.rowsAffected);
  //       }, (tx, error) => {
  //         this.logger.log(this.fileName, 'updateDeclineStatus', 'Error: ' + JSON.stringify(error.message));
  //       });
  //     }, (error) => {
  //       this.logger.log(this.fileName, 'updateDeclineStatus', 'Error TXN: ' + JSON.stringify(error.message));
  //     });
  //   });
  // };

  /**
   * Saves All LOV's in DB coming from GetLOVDetails Service from MCS as a Batch Statement
   *
   * @param {*} response
   * @returns
   * @memberof LocalServiceProvider
   */
  insertLOVBatch(response) {
    return new Promise((resolve, reject) => {
      let sqlBatchStmt = [];
      try {
        let lovs = Object.keys(response);
        for (let k in lovs) {
          // let lov = response[k];
          var tableName = lovs[k];
          sqlBatchStmt = sqlBatchStmt.concat(this.getLOVBatch(tableName, response[tableName]));
        }
      } catch (error) {
        this.logger.log(this.fileName, 'insertLOVBatch', "Error : " + JSON.stringify(error.message));
        reject(error);
      }
      //this.logger.log(this.fileName, 'insertLOVBatch', "sqlBatchStmt :" + JSON.stringify(sqlBatchStmt));
      this.dbctrl.getDB().sqlBatch(sqlBatchStmt, () => {
        // this.logger.log(this.fileName, 'insertLOVBatch', "Response :" + JSON.stringify(res));
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, 'insertLOVBatch', "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  // 08/07/2018 Gurkirat Singh -- Removed Following functions
  // insertChargeMethodList, updateChargeMethod, insertChargeMethod, insertChargeTypeList, updateChargeType,
  // insertChargeType, insertProductList, updateProduct, insertProduct, insertStatusList,
  // updateStatus, insertStatus, insertManufacturerList, updateManufacturer, insertManufacturer,
  // insertExpenseTypeList, updateExpenseType, insertExpenseType, insertNoteTypeList, updateNoteType,
  // insertNoteType, insertWorkTypeList, updateWorkType, insertWorkType, insertItemList,
  // updateItem, insertItem, insertCurrencyList, updateCurrency, insertCurrency,
  // insertUOMList, updateUOM, insertUOM, insertOverTimeList, updateOverTime,
  // insertOverTime, insertShiftCodeList, updateShiftCode, insertShiftCode,
  // insertFieldJobNameList, updateFieldJobName, insertFieldJobName, insertNoteList, insertNote,
  // updateNote, insertAttachmentList, updateAttachment, insertTaskList, insertInternalList,
  // saveAddressList, insertTimeList, saveInstalledBaseList, insertInstalledBaseList, deleteTaskRecord,
  // deleteInstallRecord, deleteContactRecord, deleteNoteRecord, deleteAttachmentRecord
  //

  /**
   * Creates a Batch Insert/Update Statements to be used for saving data in DB
   *
   * @param {*} tableName
   * @param {*} lovdata
   * @returns
   * @memberof LocalServiceProvider
   */
  getLOVBatch(tableName, lovdata) {
    let sqlBatchStmt = [];
    for (let k in lovdata) {
      let data = lovdata[k];
      let stmtValues = [];
      let sqlUpdate: any[];
      let sqlInsert: any[];

      stmtValues.push(data.Value);

      switch (tableName) {
        case "WorkType":
          // 10/30/2018 -- Mayur Varshney -- Remove ResourceId dependency from LOVs
          sqlUpdate = ["UPDATE WorkType SET Value = ?, NC = ?, C = ? WHERE ID = ?"];
          sqlInsert = ["INSERT OR IGNORE INTO WorkType(Value,NC,C,ID) VALUES (?, ?, ?, ?)"];
          stmtValues.push(data.NC);
          stmtValues.push(data.C);
          break;
        case "Item":
          // 10/30/2018 -- Mayur Varshney -- Remove ResourceId dependency from LOVs
          sqlUpdate = ["UPDATE Item SET Value = ?, Type = ? WHERE ID = ?"];
          sqlInsert = ["INSERT OR IGNORE INTO Item(Value,Type,ID) VALUES (?, ?, ?)"];
          stmtValues.push(data.Type);
          break;
        default:
          // 10/30/2018 -- Mayur Varshney -- Remove ResourceId dependency from LOVs
          sqlUpdate = ["UPDATE " + tableName + " SET Value = ? WHERE ID = ?"];
          sqlInsert = ["INSERT OR IGNORE INTO " + tableName + "(Value,ID) VALUES (?, ?)"];
          break;
      }

      stmtValues.push(data.ID);
      //08/28/2018 Zohaib Khan: pushing the values with updated resource id into sqlUpdate Query.
      sqlUpdate.push(stmtValues);
      sqlBatchStmt.push(sqlUpdate);
      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlInsert);
    }
    return sqlBatchStmt;
  }

  /**
   * Saves All LOV's in DB coming from GetClarityLOV Service from MCS as a Batch Statement
   *
   * @param {*} response
   * @returns
   * @memberof LocalServiceProvider
   */
  insertTimesheetLOVBatch(response) {
    let sqlBatchStmt = [];
    try {
      let lovs = Object.keys(response);
      for (let k in lovs) {
        var tableName = lovs[k];
        let resData = this.getTimesheetLOVBatch(tableName, response[tableName])
        sqlBatchStmt = resData ? sqlBatchStmt.concat(resData) : sqlBatchStmt;
      }
      return this.insertBatchData(sqlBatchStmt, 'insertTimesheetLOVsList');
    } catch (error) {
      this.logger.log(this.fileName, 'insertTimesheetLOVBatch', "Error : " + JSON.stringify(error.message));
      throw Error('failed to insert TimesheetLOV Batch');
    }
  }

  getTimesheetLOVBatch(tableName, lovdata) {
    let sqlBatchStmt = [];
    for (let k in lovdata) {
      let data = lovdata[k];
      let stmtValues = [];
      let sqlInsert: any[];

      switch (tableName) {
        case "MST_Project":
          sqlInsert = ["INSERT OR REPLACE INTO MST_Project(ID,PROJECT_NAME,P_PROJECTMANAGER,P_PROJECTNUMBER,P_COMPANY,P_CLARITYCONTACT,CREATEDDATE,OSC_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"];
          stmtValues.push(data.ID);
          stmtValues.push(data.PROJECT_NAME);
          stmtValues.push(data.P_PROJECTMANAGER);
          stmtValues.push(data.P_PROJECTNUMBER);
          stmtValues.push(data.P_COMPANY);
          stmtValues.push(data.P_CLARITYCONTACT);
          stmtValues.push(data.CREATEDDATE);
          stmtValues.push(data.OSC_ID);
          break;
        case "MST_TaskName":
          sqlInsert = ["INSERT OR REPLACE INTO MST_TaskName(ID,CREATEDDATE,TASK_NAME,PROJECT,TASK_CODE,OSC_ID) VALUES (?, ?, ?, ?, ?, ?)"];
          stmtValues.push(data.ID);
          stmtValues.push(data.CREATEDDATE);
          stmtValues.push(data.TASK_NAME);
          stmtValues.push(data.PROJECT);
          stmtValues.push(data.TASK_CODE);
          stmtValues.push(data.OSC_ID);
          break;
        case "MST_OvertimeCode":
          sqlInsert = ["INSERT OR REPLACE INTO MST_OvertimeCode(ID,CREATEDDATE,OVERTIMECODE,PROJECT,OSC_ID) VALUES (?, ?, ?, ?, ?)"];
          stmtValues.push(data.ID);
          stmtValues.push(data.CREATEDDATE);
          stmtValues.push(data.OVERTIMECODE);
          stmtValues.push(data.PROJECT);
          stmtValues.push(data.OSC_ID);
          break;
        case "MST_Assignment_Projects":
          sqlInsert = ["INSERT OR REPLACE INTO MST_Assignment_Projects(ID_NUM,PROJECT,RESOURCE_CODE,TASK_CODE,CREATEDDATE) VALUES (?, ?, ?, ?, ?)"];
          stmtValues.push(data.ID_NUM);
          stmtValues.push(data.PROJECT);
          stmtValues.push(data.RESOURCE_CODE);
          stmtValues.push(data.TASK_CODE);
          stmtValues.push(data.CREATEDDATE);
          break;
        case "MST_ShiftCode":
          sqlInsert = ["INSERT OR REPLACE INTO MST_ShiftCode(ID,CREATEDDATE,SHIFTCODE,PROJECT,OSC_ID) VALUES (?, ?, ?, ?, ?)"];
          stmtValues.push(data.ID);
          stmtValues.push(data.CREATEDDATE);
          stmtValues.push(data.SHIFTCODE);
          stmtValues.push(data.PROJECT);
          stmtValues.push(data.OSC_ID);
          break;
        case "MST_Team_Projects":
          sqlInsert = ["INSERT OR REPLACE INTO MST_Team_Projects(ID_NUM,RESOURCE_CODE,PROJECT,CREATEDDATE) VALUES (?, ?, ?, ?)"];
          stmtValues.push(data.ID_NUM);
          stmtValues.push(data.RESOURCE_CODE);
          stmtValues.push(data.PROJECT);
          stmtValues.push(data.CREATEDDATE);
          break;
        default:
          sqlInsert = ["INSERT OR IGNORE INTO " + tableName + "(ID) VALUES (?)"];
          stmtValues.push(data.ID);
          break;
      }
      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlInsert);
    }
    return sqlBatchStmt;
  }

  updateLastProject(userObject) {
    let query = "UPDATE User SET Last_Updated_Project = ? WHERE ID = ?";
    let queryParams = [userObject.Last_Updated_Project, userObject.ID];
    return this.insertData(query, queryParams, "updateLastProject");
  };

  /**
   * Saves List of Project Details like OverTime, ShiftCode, FieldJobName in DB as a Batch Statement
   *
   * @param {*} response
   * @returns
   * @memberof LocalServiceProvider
   */
  insertProjectDetailsBatch(response) {
    return new Promise((resolve, reject) => {
      let sqlBatchStmt = [];
      try {
        for (let k in response) {
          let lov = response[k];
          let lovName = Object.keys(lov)[0];
          var tableName;
          switch (lovName) {
            case "OverTImeShiftCode":
              tableName = "OverTime";
              break;
            case "ShiftCode":
              tableName = "ShiftCode";
              break;
            case "TaskName":
              tableName = "FieldJobName";
              break;
            default:
              tableName = k;
              break;
          }
          sqlBatchStmt = sqlBatchStmt.concat(this.getProjectDetailsBatch(tableName, lov[lovName]));
        }
      } catch (error) {
        this.logger.log(this.fileName, 'insertProjectDetailsBatch', "Error : " + JSON.stringify(error.message));
        reject(error);
      }
      //this.logger.log(this.fileName, 'insertProjectDetailsBatch', "sqlBatchStmt :" + JSON.stringify(sqlBatchStmt));
      this.dbctrl.getDB().sqlBatch(sqlBatchStmt, () => {
        // this.logger.log(this.fileName, 'insertProjectDetailsBatch', "Response :" + JSON.stringify(res));
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, 'insertProjectDetailsBatch', "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }


  /**
   * Creates a batch statement for Project details
   *
   * @param {*} tableName
   * @param {*} lovdata
   * @returns
   * @memberof LocalServiceProvider
   */
  async insertAllowanceBatch(batchData) {
    let sqlBatchStmt = [];
    for (let k in batchData) {
      let data = batchData[k];
      let stmtValues = [];
      let sqlUpdate: any[];
      let sqlInsert: any[];



      sqlUpdate = ["UPDATE Allowance SET ALLOWANCETYPE = ?, ENTRYDATE = ?, CREATEDBY = ?, CREATEDDATE = ?, MODIFIEDBY = ?, MODIFIEDDATE = ?, FIELD1 = ?, FIELD2 = ?, FIELD3 = ?, FIELD4 = ?, FIELD5 = ?, FIELD1_OT = ?, FIELD2_OT = ?, FIELD3_OT = ?, FIELD4_OT = ?, FIELD5_OT = ?, NOTES = ?, ISDELETED = ?, DB_SYNCSTATUS = ?, ISSUBMITTED = ?  WHERE ALLOWANCEID = ? AND ORACLEDBID = ?"];

      sqlInsert = ["INSERT OR IGNORE INTO Allowance( ALLOWANCETYPE, ENTRYDATE, CREATEDBY, CREATEDDATE, MODIFIEDBY, MODIFIEDDATE, FIELD1, FIELD2, FIELD3, FIELD4, FIELD5, FIELD1_OT, FIELD2_OT, FIELD3_OT, FIELD4_OT, FIELD5_OT, NOTES, ISDELETED, DB_SYNCSTATUS, ISSUBMITTED, ALLOWANCEID, ORACLEDBID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"];

      stmtValues.push(data.ALLOWANCETYPE);
      stmtValues.push(data.ENTRYDATE);
      stmtValues.push(data.CREATEDBY);
      stmtValues.push(data.CREATEDDATE);
      stmtValues.push(data.MODIFIEDBY);
      stmtValues.push(data.MODIFIEDDATE);
      stmtValues.push(data.FIELD1);
      stmtValues.push(data.FIELD2);
      stmtValues.push(data.FIELD3);
      stmtValues.push(data.FIELD4);
      stmtValues.push(data.FIELD5);
      stmtValues.push(data.FIELD1_OT);
      stmtValues.push(data.FIELD2_OT);
      stmtValues.push(data.FIELD3_OT);
      stmtValues.push(data.FIELD4_OT);
      stmtValues.push(data.FIELD5_OT);
      stmtValues.push(data.NOTES);
      stmtValues.push(false);
      stmtValues.push(true);
      stmtValues.push(true);
      stmtValues.push(data.ALLOWANCEID);
      stmtValues.push(this.valueProvider.getUserId());
      sqlUpdate.push(stmtValues);
      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlUpdate);
      sqlBatchStmt.push(sqlInsert);
    }
    return await this.insertBatchData(sqlBatchStmt, 'insertAllowanceBatch');

  }


  async updateLastAllowance(userObject) {

    let sqlUpdate = "UPDATE User SET Last_Updated_Allowances = ? WHERE ID = ?";
    let insertValues = [userObject.Last_Updated_Allowances, userObject.ID];
    return await this.insertData(sqlUpdate, insertValues, "updateLastAllowance");
  };

  /**
   * Creates a batch statement for Project details
   *
   * @param {*} tableName
   * @param {*} lovdata
   * @returns
   * @memberof LocalServiceProvider
   */
  getProjectDetailsBatch(tableName, lovdata) {
    let sqlBatchStmt = [];
    for (let k in lovdata) {
      let data = lovdata[k];
      let stmtValues = [];
      let sqlUpdate: any[];
      let sqlInsert: any[];

      stmtValues.push(data.Technician_ID);
      stmtValues.push(data.Project);
      stmtValues.push(data.Start_Date);
      stmtValues.push(data.Date_Completed);
      stmtValues.push(this.valueProvider.getResourceId());

      switch (tableName) {
        case "OverTime":
          sqlUpdate = ["UPDATE OverTime SET Technician_ID = ?, Project = ?, Start_Date = ?, Date_Completed = ?, ResourceId = ?, Field_Job_ID = ?, Overtimeshiftcode = ?  WHERE OverTime_Shift_Code_ID = ? AND Project_Number = ?"];
          sqlInsert = ["INSERT OR IGNORE INTO OverTime(Technician_ID, Project, Start_Date, Date_Completed, ResourceId, Field_Job_ID, Overtimeshiftcode, OverTime_Shift_Code_ID, Project_Number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"];

          stmtValues.push(data.Field_Job_ID);
          stmtValues.push(data.Overtimeshiftcode);
          stmtValues.push(data.OverTime_Shift_Code_ID);
          stmtValues.push(data.Project_Number);
          break;
        case "ShiftCode":
          sqlUpdate = ["UPDATE ShiftCode SET Technician_ID = ?, Project = ?, Start_Date = ?, Date_Completed = ?, ResourceId = ?, Field_Job_ID = ?, ShiftCodeName = ?  WHERE Shift_Code_ID = ? AND Project_Number = ?"];
          sqlInsert = ["INSERT OR IGNORE INTO ShiftCode(Technician_ID, Project, Start_Date, Date_Completed, ResourceId, Field_Job_ID, ShiftCodeName, Shift_Code_ID, Project_Number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"];

          stmtValues.push(data.Field_Job_ID);
          stmtValues.push(data.ShiftCodeName);
          stmtValues.push(data.Shift_Code_ID);
          stmtValues.push(data.Project_Number);
          break;
        case "FieldJobName":
          sqlUpdate = ["UPDATE FieldJobName SET Technician_ID = ?, Project = ?, Start_Date = ?, Date_Completed = ?, ResourceId = ?, JobName = ?  WHERE TaskCode = ? AND Project_Number = ?"];
          sqlInsert = ["INSERT OR IGNORE INTO FieldJobName(Technician_ID, Project, Start_Date, Date_Completed, ResourceId, JobName, TaskCode, Project_Number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"];

          stmtValues.push(data.JobName);
          stmtValues.push(data.TaskCode);
          stmtValues.push(data.Project_Number);
          break;
      }

      // 05/20/2019 -- Mayur Varshney -- passing update params for batch query
      sqlUpdate.push(stmtValues);
      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlUpdate);
      sqlBatchStmt.push(sqlInsert);
    }
    return sqlBatchStmt;
  }

  updateSyncStatus(userObject) {
    return new Promise((resolve, reject) => {
      // //this.logger.log(this.fileName,'function',"USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

      this.dbctrl.getDB().transaction((transaction) => {

        let insertValues = [];

        let sqlUpdate = "UPDATE User SET Sync_Status = ? WHERE ID = ?";

        insertValues.push(userObject.Sync_Status);
        insertValues.push(userObject.ID);

        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {

          // //this.logger.log(this.fileName,'function',"USER ROW AFFECTED: " + res.rowsAffected);

        }, (tx, error) => {

          this.logger.log(this.fileName, 'updateSyncStatus', "USER UPDATE ERROR: " + JSON.stringify(error.message));
        });

      }, (error) => {

        this.logger.log(this.fileName, 'updateSyncStatus', "USER UPDATE TRANSACTION ERROR: " + JSON.stringify(error.message));
      });
    });
  };

  getAttachmentListType() {
    return new Promise((resolve, reject) => {
      let value = [];
      this.dbctrl.getDB().transaction((transaction) => {
        let query = "SELECT A.* from Attachment A INNER JOIN Task T ON (T.Task_Number = A.Task_Number OR T.SR_ID = A.SRID) WHERE A.ResourceID = ? and A.Attachment_Status = 'false' and ((A.Type in ('O', 'S') AND T.StatusID != ?) or A.AttachmentType = 'fsr')";
        transaction.executeSql(query, [this.valueProvider.getResourceId(), Enums.Jobstatus.Completed_Awaiting_Review], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getAttachmentListType', "GET ATTACHMENT SELECT ERROR: " + JSON.stringify(error.message));
          resolve(value);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getAttachmentListType', "GET ATTACHMENT TRANSACTION ERROR: " + JSON.stringify(error.message));
        resolve(value);
      });
    })
  };

  updateAttachmentDownloadStatus(attachments) {
    let sqlBatchStmt = [];
    attachments.forEach(attachment => {
      if (attachment.Attachment_Status == "true") {
        sqlBatchStmt.push(["UPDATE Attachment SET Attachment_Status = 'true'  WHERE Attachment_Id = ?", [attachment.Attachment_Id]]);
      }
    });
    return this.insertBatchData(sqlBatchStmt, "updateAttachmentDownloadStatus");
  };

  updateLastSync(userObject) {
    return new Promise((resolve, reject) => {
      // //this.logger.log(this.fileName,'function',"USER UPDATE OBJECT =====> " + JSON.stringify(userObject));
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE User SET Last_Updated = ? WHERE ID = ?";
        insertValues.push(userObject.Last_Updated);
        insertValues.push(userObject.ID);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          // //this.logger.log(this.fileName,'function',"USER ROW AFFECTED: " + res.rowsAffected);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateLastSync', "USER UPDATE ERROR: " + JSON.stringify(error.message));
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateLastSync', "USER UPDATE TRANSACTION ERROR: " + JSON.stringify(error.message));
      });
    });
  };

  getUserLogin(User_Name) {
    return new Promise((resolve, reject) => {
      var value = [];
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT * FROM User WHERE LOWER(User_Name) = ?", [User_Name.toLowerCase()], (tx, res) => {
          var rowLength = res.rows.length;
          if (rowLength == 1) {
            value.push(res.rows.item(0));
          }
          // //this.logger.log(this.fileName,'function',"GET USER DB ==========> " + JSON.stringify(value));
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getUserLogin', "GET USER SELECT ERROR: " + JSON.stringify(error.message));
          resolve(value);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getUserLogin', "GET USER TRANSACTION ERROR: " + JSON.stringify(error.message));
        resolve(value);
      });
    });
  };

  deleteExpenseList(expenseId) {

    this.dbctrl.getDB().transaction((transaction) => {

      let sqlDelete = "DELETE FROM Expense where Expense_Id = " + expenseId;

      transaction.executeSql(sqlDelete);

    }, (error) => {

      this.logger.log(this.fileName, 'deleteExpenseList', "EXPENSE DELETE TRANSACTION ERROR: " + JSON.stringify(error.message));
    });
  };

  // 04/02/2019 -- Mayur Varshney -- optimise code
  // deleteMaterialList(materialId) {
  //   let query = "DELETE FROM Material where Material_Id = ?";
  //   let queryParams = [materialId];
  //   return this.insertData(query, queryParams, "deleteMaterialList");
  // };

  /**
   * Delete all material serial item from MST_Material table on the basis of material id
   * @returns Promise<Boolean>
   * @memberof LocalServiceProvider
   * @author Mayur Varshney
   */
  deleteMaterialSerialList(materialId) {
    let query = "DELETE FROM MST_Material where Material_Id = ?";
    let queryParams = [materialId];
    return this.insertData(query, queryParams, "deleteMaterialList");
  };

  /**
   * Delete material serial row from MST_Material w.r.t Material_Serial_Id
   * @returns Promise<Boolean>
   * @memberof LocalServiceProvider
   * @author Mayur Varshney
   */
  deleteMaterialSerialRow(material_serial_id) {
    let query = "DELETE FROM MST_Material where Material_Serial_Id = ?";
    let queryParams = [material_serial_id];
    return this.insertData(query, queryParams, "deleteMaterialSerialRow");
  }

  updateUser(userObject) {
    return new Promise((resolve, reject) => {
      // //this.logger.log(this.fileName,'function',"USER UPDATE OBJECT =====> " + JSON.stringify(userObject));
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE User SET Login_Status = ?  WHERE ID = ?";
        insertValues.push(userObject.Login_Status);
        insertValues.push(userObject.ID);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          //this.logger.log(this.fileName,'function',"USER ROW AFFECTED: " + res.rowsAffected);
          resolve("success");
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateUser', "USER UPDATE ERROR: " + JSON.stringify(error.message));
          resolve("success");
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateUser', "USER UPDATE TRANSACTION ERROR: " + JSON.stringify(error.message));
        resolve("success");
      });
    });
  };
  //Customer Methods

  insertCustomerList(response) {
    //this.logger.log(this.fileName,'function',"Executing Time sql");

    let responseList = response;

    // let promises = [];

    return new Promise((resolve, reject) => {

      this.dbctrl.getDB().transaction((transaction) => {

        let sqlSelect = "SELECT * FROM Customer WHERE Task_Number = " + responseList.Task_Number;
        //this.logger.log(this.fileName,'function',"CuSTOMER  ====> " + sqlSelect);

        transaction.executeSql(sqlSelect, [], (tx, res) => {
          //this.logger.log(this.fileName,'function',"SQL Executed");
          //this.logger.log(this.fileName,'function',res);
          var rowLength = res.rows.length;

          //this.logger.log(this.fileName,'function',"CuSTOMER LENGTH ====> " + rowLength);

          if (rowLength > 0) {

            this.updateCustomer(responseList).then((res) => {
              resolve(res);
            }).catch((err: any) => {
              this.logger.log(this.fileName, 'insertCustomerList', 'Error in updateCustomer: ' + JSON.stringify(err));
            });

          } else {

            this.insertCustomer(responseList).then((res) => {
              resolve(res);
            }).catch((err: any) => {
              this.logger.log(this.fileName, 'insertCustomerList', 'Error in insertCustomer: ' + JSON.stringify(err));
            });
          }

        }, (tx, error) => {

          this.logger.log(this.fileName, 'insertCustomerList', "CuSTOMER SELECT ERROR: " + JSON.stringify(error.message));

          reject(error);
        });

      }, (error) => {

        this.logger.log(this.fileName, 'insertCustomerList', "CuSTOMER SELECT TRANSACTION ERROR: " + JSON.stringify(error.message));

        reject(error);
      });
    });
  };

  insertCustomer(responseList) {

    //this.logger.log(this.fileName,'function',"CuSTOMER INSERT OBJECT =====> " + JSON.stringify(responseList));
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        // 10/16/2018 -- Mayur Varshney -- add one parameter for Sync_Status
        // 11/05/2018 -- Mayur Varshney -- add one parameter as OracleDBID
        let sqlInsert = "INSERT INTO CUSTOMER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        insertValues.push(responseList.Customer_Id);
        insertValues.push(responseList.Customer_Name);
        insertValues.push(responseList.Job_responsibilty);
        insertValues.push(responseList.Email);
        insertValues.push(responseList.Task_Number);
        insertValues.push(responseList.isCustomerSignChecked);
        insertValues.push(responseList.customerComments);
        insertValues.push(this.valueProvider.getResourceId());
        insertValues.push(responseList.Cust_Sign_File);
        insertValues.push(responseList.Cust_Sign_Time);
        insertValues.push(responseList.SSE_Rules);
        insertValues.push(responseList.Safety_Rules);
        insertValues.push(responseList.Remarks);
        insertValues.push(responseList.Annuel_PdP);
        insertValues.push(responseList.Specific_PdP);
        insertValues.push(responseList.Working_license);
        insertValues.push(responseList.Emerson_Safety);
        insertValues.push(responseList.Home_Security);
        insertValues.push(responseList.do_not_survey);
        // 10/16/2018 -- Mayur Varshney -- add one parameter for Sync_Status
        insertValues.push(false);
        // 10/23/2018 -- Mayur Varshney -- add one parameter for Signature_Id
        insertValues.push(null);
        // 11/05/2018 -- Mayur Varshney -- add one parameter as OracleDBID
        insertValues.push(this.valueProvider.getUserId());
        //this.logger.log(this.fileName,'function',"sql " + insertValues);
        transaction.executeSql(sqlInsert, insertValues, (tx, res) => {

          //this.logger.log(this.fileName,'function',"CuSTOMER INSERT ID: " + res.insertId);

          resolve(res);

        }, (tx, error) => {

          this.logger.log(this.fileName, 'insertCustomer', "CuSTOMER INSERT ERROR: " + JSON.stringify(error.message));

          reject(error);
        });

      }, (error) => {

        this.logger.log(this.fileName, 'insertCustomer', "CuSTOMER INSERT TRANSACTION ERROR: " + JSON.stringify(error.message));

        reject(error);
      });

    })
  };

  updateCustomer(responseList) {

    //this.logger.log(this.fileName,'function',"updateCustomer UPDATE OBJECT =====> " + JSON.stringify(responseList));

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];

        // 10/16/2018 -- Mayur Varshney -- add one parameter for Sync_Status
        // 11/05/2018 -- Mayur Varshney -- add one parameter as OracleDBID
        let sqlUpdate = "UPDATE Customer SET Customer_Id = ?, Customer_Name = ?, Job_responsibilty= ?, Email = ?, isCustomerSignChecked =?, customerComments =?, ResourceId = ?, Cust_Sign_File = ?, Cust_Sign_Time = ?, Sync_Status = ?, OracleDBID = ? WHERE Task_Number = ?";

        insertValues.push(responseList.Customer_Id);
        insertValues.push(responseList.Customer_Name);
        insertValues.push(responseList.Job_responsibilty);
        insertValues.push(responseList.Email);
        insertValues.push(responseList.isCustomerSignChecked);
        insertValues.push(responseList.customerComments);
        insertValues.push(this.valueProvider.getResourceId());
        insertValues.push(responseList.Cust_Sign_File);
        insertValues.push(responseList.Cust_Sign_Time);
        // 10/16/2018 -- Mayur Varshney -- add one parameter for Sync_Status
        insertValues.push(false);
        // 11/05/2018 -- Mayur Varshney -- add one parameter as OracleDBID
        insertValues.push(this.valueProvider.getUserId());
        insertValues.push(responseList.Task_Number);

        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {

          //this.logger.log(this.fileName,'function',"CUSTOMER ROW AFFECTED: " + res.rowsAffected);

          resolve(res);

        }, (tx, error) => {

          this.logger.log(this.fileName, 'updateCustomer', "CUSTOMER UPDATE ERROR: " + JSON.stringify(error.message));

          reject(error);
        });

      }, (error) => {

        this.logger.log(this.fileName, 'updateCustomer', "CUSTOMER UPDATE TRANSACTION ERROR: " + JSON.stringify(error.message));

        reject(error);
      });
    })
  };


  getCustomer(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        // var value = [];
        // 11/05/2018 -- Mayur Varshney -- Update query for standalone jobs
        let stmtValues = [];
        // 03/07/2019 -- Mayur Varshney -- get only customer table data
        let query = "SELECT Customer.* FROM Customer INNER JOIN Task tk ON Customer.Task_Number = tk.Task_Number WHERE Customer.Task_Number = ? AND CASE WHEN tk.IsStandalone = 'true' THEN Customer.OracleDBID = ? ELSE Customer.ResourceId = ? END";
        stmtValues.push(taskId ? taskId.toString() : null);
        stmtValues.push(this.valueProvider.getUserId());
        stmtValues.push(this.valueProvider.getResourceId());
        transaction.executeSql(query, stmtValues, (tx, res) => {
          var rowLength = res.rows.length;
          //this.logger.log(this.fileName,'function',"row length" + rowLength);
          if (rowLength > 0) {
            var value = res.rows.item(0);
          }
          resolve(value);

          // this.logger.log(this.fileName,'getCustomer',"GET Customer DB ==========> " + JSON.stringify(value));

        }, (tx, error) => {

          this.logger.log(this.fileName, 'getCustomer', "GET Customer SELECT ERROR: " + JSON.stringify(error.message));

          reject(error);
        });

      }, (error) => {

        this.logger.log(this.fileName, 'getCustomer', "GET Customer ERROR: " + JSON.stringify(error.message));

        reject(error);
      });
    })
  };

  offLineLogin() {
    let self = this;
    self.logger.log(self.fileName, "offLineLogin", "Offline Login Started...");
    return new Promise((resolve, reject) => {
      try {
        //this.cloudProvider.loginAnonymous();
        self.getUser().then((response: any) => {
          let users = response.filter((item) => { return item.Login_Status == "1"; });
          if (users.length > 0) {
            // self.logger.log(self.fileName, "offLineLogin", "USERS =====> " + JSON.stringify(users));
            //self.logger.log(self.fileName,'offLineLogin',item);
            //self.valueProvider.setUserRoles(users[0].userRole);
            self.valueProvider.setUser(users[0]);
            self.valueProvider.setResourceId(self.valueProvider.getUser().ID);
            self.getUserPreferrences().then((userPref: any) => {
              // self.logger.log(self.fileName, "offLineLogin", JSON.stringify(userPref));
              //self.logger.log(self.fileName, "offLineLogin", "Setting User Preferences...");
              self.valueProvider.setUserPreferences(userPref);
              //this.logger.log(this.fileName,'offLineLogin',res[0].preferredLanguage);
              //this.translateService.use(lang);

              self.valueProvider.setLastUpdated(new Date(self.valueProvider.getUser().Last_Updated).getTime());
              self.refreshTaskList();
              resolve(true);
            }).catch((err: any) => {
              this.logger.log(this.fileName, 'offLineLogin', 'Error in getUserPreferrences: ' + JSON.stringify(err));
              resolve(false);
            })
          } else {
            self.logger.log(self.fileName, "offLineLogin", "No User found to login...");
            resolve(false);
          }
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'offLineLogin', 'Error in getUser: ' + JSON.stringify(err));
          resolve(false);
        });
      } catch (error) {
        this.logger.log(this.fileName, 'offLineLogin', 'Error: ' + error.message);
        resolve(false);
      }
    });
  }

  async refreshTaskList() {
    try {
      let self = this;
      let taskListResponse: any = await this.getTaskList();
      this.logger.log(this.fileName, 'refreshTaskList', "TASKLIST Length" + taskListResponse.length);
      let internalresponse = await this.getInternalList();
      taskListResponse = taskListResponse.concat(self.transformProvider.getInternalOFSCListForLocal(internalresponse));
      self.valueProvider.setTaskList(taskListResponse);
      let workSchedules = await this.getWorkSchedule();
      this.valueProvider.setWorkSchedule(workSchedules);
    } catch (error) {
      this.logger.log(this.fileName, 'refreshTaskList', "Error: " + error.message);
    }
  }

  updateAttachmentName(updatedName, attachmentId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE Attachment SET File_Name = " + JSON.stringify(updatedName) + " WHERE Attachment_Id = " + attachmentId;
        //this.logger.log(this.fileName,'function',sqlUpdate);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          resolve(res);
          //this.logger.log(this.fileName,'function',"ATTACHMENT ROW AFFECTED: " + res.rowsAffected);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateAttachmentName', "ATTACHMENT UPDATE ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateAttachmentName', "ATTACHMENT UPDATE TRANSACTION ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  insertAttachment(responseList) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        // 11/02/2018 -- Mayur Varshney -- update query, insert OracleDBID in table
        let sqlInsert = "INSERT INTO Attachment(File_Name, File_Type, File_Path, Type, AttachmentType, Created_Date, Task_Number, SRID, ResourceId, ORACLEDBID, Attachment_Id, Attachment_Status, Sync_Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        insertValues.push(responseList.File_Name);
        insertValues.push(responseList.File_Type);
        insertValues.push(responseList.File_Path);
        insertValues.push(responseList.Type);
        insertValues.push(responseList.AttachmentType);
        insertValues.push(responseList.Created_Date);
        insertValues.push(responseList.Task_Number);
        insertValues.push(responseList.SRID);
        insertValues.push(this.valueProvider.getResourceId());
        insertValues.push(this.valueProvider.getUserId());
        insertValues.push(parseInt(responseList.Attachment_Id));
        insertValues.push(true);
        insertValues.push(false);
        transaction.executeSql(sqlInsert, insertValues, (tx, res) => {
          resolve(res.insertId);
          //this.logger.log(this.fileName,'function',"ATTACHMENT INSERT ID: " + res.insertId);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'insertAttachment', "ATTACHMENT INSERT ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'insertAttachment', "ATTACHMENT INSERT TRANSACTION ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  getActiveUser() {
    let query = "SELECT * FROM User where Login_Status = ?";
    let queryParams = ["1"];
    return this.getList(query, queryParams, "getActiveUser");
  }

  getTaskByTaskNumber(taskNumber) {
    let query = "SELECT * FROM Task WHERE Task_Number = ?";
    return this.getList(query, [taskNumber], "getActiveUser");
  }

  getUser() {

    return new Promise((resolve, reject) => {
      let value = [];
      this.dbctrl.getDB().transaction((transaction) => {

        transaction.executeSql("SELECT * FROM User", [], (tx, res) => {
          let rowLength = res.rows.length;

          for (let i = 0; i < rowLength; i++) {

            value.push(res.rows.item(i));
          }
          resolve(value);

          //this.logger.log(this.fileName,'function',"GET USER DB ==========> " + JSON.stringify(value));


        }, (tx, error) => {

          this.logger.log(this.fileName, 'getUser', "GET USER SELECT ERROR: " + JSON.stringify(error.message));

          resolve(value);
        });

      }, (error) => {

        this.logger.log(this.fileName, 'getUser', "GET USER TRANSACTION ERROR: " + JSON.stringify(error.message));

        resolve(value);
      });
    })
  };

  getTaskStatus() {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT Sync_Status  FROM Task  WHERE Sync_Status != 'true'", [], (tx, res) => {
          // this.logger.log(this.fileName, 'getTaskStatus', "GET getTaskStatus DB ==========> " + JSON.stringify(res));
          resolve(res.rows.length);
        }, (error) => {
          this.logger.log(this.fileName, 'getTaskStatus', "GET Submit_Status SELECT ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getTaskStatus', "GET Submit_Status TRANSACTION ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    })
  };


  /**
   * Saves All LOV's in DB coming from GetLOVDetails Service from MCS as a Batch Statement
   *
   * @param {*} response
   * @returns
   * @memberof LocalServiceProvider
   */
  deleteRecordBatch(DeletedRecords) {
    let sqlBatchStmt = [];
    for (let tableName in DeletedRecords) {
      sqlBatchStmt = sqlBatchStmt.concat(this.getDeleteRecordBatch(tableName, DeletedRecords[tableName]));
    }
    return this.insertBatchData(sqlBatchStmt, "deleteRecordBatch");
  }

  /**
   * Creates a Batch Insert/Update Statements to be used for saving data in DB
   *
   * @param {*} tableName
   * @param {*} lovdata
   * @returns
   * @memberof LocalServiceProvider
   */
  getDeleteRecordBatch(tableName, lovdata) {
    let sqlBatchStmt = [];
    for (let k in lovdata) {
      let data = lovdata[k];
      let stmtValues = [];
      let sqldelete: any[];

      stmtValues.push(data.Record_ID);

      switch (tableName) {
        case "InstallBase":
          sqldelete = ["DELETE FROM InstallBase WHERE Installed_Base_ID = ?"];
          if (data.TaskID && data.TaskID != "") {
            sqldelete = [sqldelete[0] + " AND Task_Number = ?"];
            stmtValues.push(data.TaskID);
          }
          break;
        case "Contact":
          sqldelete = ["DELETE FROM Contact WHERE Contact_ID = ?"];
          if (data.TaskID && data.TaskID != "") {
            sqldelete = [sqldelete[0] + " AND Task_Number = ?"];
            stmtValues.push(data.TaskID);
          }
          break;
        case "Task":
          // let timeCount = "(SELECT count(*) FROM Time WHERE Sync_Status = 'false' AND Task_Number = ?)";
          // let expenseCount = "(SELECT count(*) FROM Expense WHERE Sync_Status = 'false' AND Task_Number = ?)";
          // let materialCount = "(SELECT count(*) FROM MST_Material WHERE Sync_Status = 'false' AND Task_Number = ?)";
          // let notesCount = "(SELECT count(*) FROM Notes WHERE Sync_Status = 'false' AND Task_Number = ?)";
          // let engineerCount = "(SELECT count(*) FROM Engineer WHERE Sync_Status = 'false' AND Task_Number = ?)";
          // let customerCount = "(SELECT count(*) FROM Customer WHERE Sync_Status = 'false' AND Task_Number = ?)";
          // let changeLogCount = "(SELECT count(*) FROM TaskChangeLog WHERE Sync_Status = 'false' AND FieldJob = ?)";
          // let ibCount = "(SELECT count(*) FROM InstallBase WHERE Sync_Status = 'false' AND Task_Number = ?)";
          // let attachmentCount = "(SELECT count(*) FROM Attachment WHERE Sync_Status = 'false' AND Task_Number = ?)";
          // let taskQuery = `DELETE FROM Task WHERE Task_Number = ? AND Sync_Status = 'true' AND ${timeCount} = 0 AND ${expenseCount} = 0 AND
          // ${materialCount} = 0 AND ${notesCount} = 0 AND ${engineerCount} = 0 AND ${customerCount} = 0 AND ${changeLogCount} = 0 AND ${ibCount} = 0
          // AND ${attachmentCount} = 0`;
          let taskQuery = `DELETE FROM Task WHERE Task_Number = ?`;
          sqldelete = [taskQuery];
          // stmtValues = [data.Record_ID, data.Record_ID, data.Record_ID, data.Record_ID, data.Record_ID, data.Record_ID, data.Record_ID,
          // data.Record_ID, data.Record_ID, data.Record_ID];
          stmtValues = [data.Record_ID];
          break;
        case "Note":
          sqldelete = ["DELETE FROM Note WHERE Notes_ID = ?"];
          break;
        case "Attachment":
          sqldelete = ["DELETE FROM Attachment WHERE OSC_Id = ?"];
          if (data.SRID && data.SRID != "") {
            sqldelete = [sqldelete[0] + " AND SRID = ?"];
            stmtValues.push(data.SRID);
          }
          break;
      }

      sqldelete.push(stmtValues);
      sqlBatchStmt.push(sqldelete);
    }
    return sqlBatchStmt;
  }

  getFeedbackQuestions() {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let getQuestions = [];
        let sqlUpdate = "SELECT * FROM MST_Feedback_Questions";
        transaction.executeSql(sqlUpdate, [], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            getQuestions.push(res.rows.item(i));
          }
          resolve(getQuestions);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getFeedbackQuestions', "Error :" + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getFeedbackQuestions', "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }
  /**
   *09/19/2018 Shivansh Subnani
   *Method invoked to get languages from local db.Takes Parameter canView which is used for
   *permissions if the user is admin then get all the languages based on the view permission
   *if not admin then get those languages which are only active
   * @param {*} canView
   * @returns
   * @memberof LocalServiceProvider
   */
  getMST_Languages(canView) {
    let query = "";
    query = canView ? "SELECT * FROM MST_Languages order by Lang_Name asc" : "SELECT * FROM MST_Languages where Is_Active ='true' order by Lang_Name asc;"
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        transaction.executeSql(query, [], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
          //this.logger.log(this.fileName,'function',"GET CURRENCY DB ==========> " + JSON.stringify(value));
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getMST_Languages', "ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getMST_Languages', "ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  insertUserPreferrences(responseList) {
    //this.logger.log(this.fileName,'function',"USER INSERT OBJECT =====> " + JSON.stringify(responseList));
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        //07/24/2018 Zohaib Khan
        //Added FSR_Disclaimer in the query
        // 01-30-2019 -- Mansi Arora -- timeZoneIANA while inserting user preferences
        let sqlInsert = "INSERT INTO User_Preferences  (ResourceID, Email, Default_Currency, Preferred_language, Preferred_language_Id, Timezone, FSR_PrintNote, FSR_PrintExpense, FSR_PrintExpenseComplete, FSR_PrintMaterial, FSR_PrintTime, FSR_PrintSignature, FSR_PrintInstallBase, FSR_PrintEUISO ,FSR_PrintAttachment, Date_Format, AddressId, AddressIdCh, SelectedLanguage, Do_Not_Show_Modal, UOM, UOM_Id, FSR_Disclaimer, FSR_Languages, ShowNonBillableEntries,WorldAreaID, timeZoneIANA, ShowChargeMethod, ListView,STARTDAYOFWEEK, FSR_PrintChargeMethod) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)";
        insertValues.push(responseList.ResourceID);
        insertValues.push(responseList.Email);
        insertValues.push(responseList.Default_Currency);
        insertValues.push(responseList.Preferred_language);
        insertValues.push(responseList.Preferred_language_Id);
        insertValues.push(responseList.Timezone);
        insertValues.push(responseList.FSR_PrintNote);
        insertValues.push(responseList.FSR_PrintExpense);
        insertValues.push(responseList.FSR_PrintExpenseComplete);
        insertValues.push(responseList.FSR_PrintMaterial);
        insertValues.push(responseList.FSR_PrintTime);
        insertValues.push(responseList.FSR_PrintSignature);
        insertValues.push(responseList.FSR_PrintInstallBase);
        insertValues.push(responseList.FSR_PrintEUISO);
        insertValues.push(responseList.FSR_PrintAttachment);
        insertValues.push(responseList.Date_Format);
        insertValues.push(responseList.AddressId);
        insertValues.push(responseList.AddressIdCh);
        insertValues.push(responseList.SelectedLanguage);
        insertValues.push(responseList.Do_Not_Show_Modal);
        insertValues.push(responseList.UOM);
        insertValues.push(responseList.UOM_Id);
        insertValues.push(responseList.FSR_Disclaimer);
        insertValues.push(responseList.FSR_Languages);
        insertValues.push(responseList.ShowNonBillableEntries);
        insertValues.push(responseList.WorldAreaID);
        // 01-30-2019 -- Mansi Arora -- timeZoneIANA while inserting user preferences
        insertValues.push(responseList.timeZoneIANA);
        insertValues.push(responseList.ShowChargeMethod != null ? responseList.ShowChargeMethod : false);
        //04/25/2019 -- Vivek Sharma -- Added ListView for Time sheet entry
        insertValues.push(responseList.ListView != null ? responseList.ListView : "w");
        // Preeti Varshney 09/04/2019 -- Added STARTDAYOFWEEK for Time sheet entry
        insertValues.push(responseList.STARTDAYOFWEEK != null ? responseList.STARTDAYOFWEEK : "Monday");
        insertValues.push(responseList.FSR_PrintChargeMethod);
        transaction.executeSql(sqlInsert, insertValues, (tx, res) => {
          resolve(res.insertId);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'insertUserPreferrences', "ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'insertUserPreferrences', "ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  getUserPreferrences() {
    // this.logger.log(this.fileName, 'getUserPreferrences', "Resource ID: " + this.valueProvider.getResourceId());

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        transaction.executeSql("SELECT * FROM User_Preferences WHERE ResourceID = ?", [parseInt(this.valueProvider.getResourceId())], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getUserPreferrences', "GET USER PREFERRENCE ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getUserPreferrences', "GET USER PREFERRENCE ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  updateUserPreferrences(responseList) {
    //this.logger.log(this.fileName,'function',"TIME UPDATE OBJECT =====> " + JSON.stringify(responseList));

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {

        let insertValues = [];
        //07/26/2018 Zohaib Khan: Added FSR_Disclaimer in the query
        //11/28/2018 Zohaib: Updated Query with show Non-BillableEntries check
        // 01-30-2019 -- Mansi Arora -- timeZoneIANA while updating user preferences
        let sqlUpdate = "UPDATE User_Preferences SET ResourceID = ?, Email = ?, Default_Currency = ?, Preferred_language = ?, Preferred_language_Id = ?, Timezone = ?, FSR_PrintNote = ?, FSR_PrintExpense = ?, FSR_PrintExpenseComplete = ?, FSR_PrintMaterial = ?, FSR_PrintTime = ?, FSR_PrintSignature = ?, FSR_PrintInstallBase = ?, FSR_PrintEUISO = ?, FSR_PrintAttachment = ?, Date_Format = ?,AddressId = ?, AddressIdCh = ?, SelectedLanguage = ?, Do_Not_Show_Modal = ?, UOM = ?, UOM_Id=?, FSR_Disclaimer=?, FSR_Languages=?,ShowNonBillableEntries=?,WorldAreaID=?, timeZoneIANA=?, ShowChargeMethod=?, ListView=?,STARTDAYOFWEEK = ?,FSR_PrintChargeMethod = ? WHERE ResourceID=" + this.valueProvider.getResourceId();

        insertValues.push(responseList.ResourceID);
        insertValues.push(responseList.Email);
        insertValues.push(responseList.Default_Currency);
        insertValues.push(responseList.Preferred_language);
        insertValues.push(responseList.Preferred_language_Id);
        insertValues.push(responseList.Timezone);
        insertValues.push(responseList.FSR_PrintNote);
        insertValues.push(responseList.FSR_PrintExpense);
        insertValues.push(responseList.FSR_PrintExpenseComplete);
        insertValues.push(responseList.FSR_PrintMaterial);
        insertValues.push(responseList.FSR_PrintTime);
        insertValues.push(responseList.FSR_PrintSignature);
        insertValues.push(responseList.FSR_PrintInstallBase);
        insertValues.push(responseList.FSR_PrintEUISO);
        insertValues.push(responseList.FSR_PrintAttachment);
        insertValues.push(responseList.Date_Format);
        insertValues.push(responseList.AddressId);
        insertValues.push(responseList.AddressIdCh);
        insertValues.push(responseList.SelectedLanguage);
        insertValues.push(responseList.Do_Not_Show_Modal);
        insertValues.push(responseList.UOM);
        insertValues.push(responseList.UOM_Id);
        insertValues.push(responseList.FSR_Disclaimer);
        insertValues.push(responseList.FSR_Languages);
        insertValues.push(responseList.ShowNonBillableEntries);
        insertValues.push(responseList.WorldAreaID);
        // 01-30-2019 -- Mansi Arora -- timeZoneIANA while updating user preferences
        insertValues.push(responseList.timeZoneIANA);
        //03/13/2019 -- Zohaib Khan -- Added ShowChargeMethod for Time sheet entry
        insertValues.push(responseList.ShowChargeMethod != null ? responseList.ShowChargeMethod : false);

        //04/25/2019 -- Vivek Sharma -- Added ListView for Time sheet entry
        insertValues.push(responseList.ListView != null ? responseList.ListView : "w");
        insertValues.push(responseList.STARTDAYOFWEEK ? responseList.STARTDAYOFWEEK : "Monday");
        insertValues.push(responseList.FSR_PrintChargeMethod);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {

          //this.logger.log(this.fileName,'function',"TIME ROW AFFECTED: " + res.rowsAffected);

          resolve(res);

        }, (tx, error) => {

          this.logger.log(this.fileName, 'updateUserPreferrences', "TIME UPDATE ERROR: " + JSON.stringify(error.message));

          reject(error);
        });

      }, (error) => {

        this.logger.log(this.fileName, 'updateUserPreferrences', "TIME UPDATE TRANSACTION ERROR: " + JSON.stringify(error.message));

        reject(error);
      });
    })
  };


  updateWorldAreaInPreferrences(worldArea) {
    //this.logger.log(this.fileName,'function',"TIME UPDATE OBJECT =====> " + JSON.stringify(responseList));
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        //07/26/2018 Zohaib Khan: Added FSR_Disclaimer in the query
        //11/28/2018 Zohaib: Updated Query with show Non-BillableEntries check
        // 01-30-2019 -- Mansi Arora -- timeZoneIANA while updating user preferences
        let sqlUpdate = "UPDATE User_Preferences SET WorldAreaID=? WHERE ResourceID=" + this.valueProvider.getResourceId();
        insertValues.push(worldArea);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          //this.logger.log(this.fileName,'function',"TIME ROW AFFECTED: " + res.rowsAffected);
          resolve(res);
        }, (tx, error) => {
          reject(error);
        });
      }, (error) => {
        reject(error);
      });
    })
  };

  // 07/18/2018 Zohaib Khan
  // Created methed which updates the do not show flag in user preferences table

  updateUserPreferrencesModal(responseList) {

    //this.logger.log(this.fileName,'function',"TIME UPDATE OBJECT =====> " + JSON.stringify(responseList));

    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {

        let insertValues = [];

        let sqlUpdate = "UPDATE User_Preferences SET Do_Not_Show_Modal = ? WHERE ResourceID=" + this.valueProvider.getResourceId();
        insertValues.push(responseList.Do_Not_Show_Modal);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {

          //this.logger.log(this.fileName,'function',"TIME ROW AFFECTED: " + res.rowsAffected);

          resolve(res);

        }, (tx, error) => {

          this.logger.log(this.fileName, 'updateUserPreferrences', "TIME UPDATE ERROR: " + JSON.stringify(error.message));

          reject(error);
        });

      }, (error) => {

        this.logger.log(this.fileName, 'updateUserPreferrences', "TIME UPDATE TRANSACTION ERROR: " + JSON.stringify(error.message));

        reject(error);
      });
    })
  };

  public getLanguageMapping(langJSON) {
    let feedbackDetails = [];
    return new Promise((resolve, reject) => {
      let query = '';
      // TODO: Use Prepare Statements
      query = "Select * from Language_Key_Mappings Where Lang_Id = ? and Key_Id = ?";
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [langJSON.Lang_Id, langJSON.Key_Id], ((tx, rs) => {
          this.logger.log(this.fileName, 'getLanguageMapping', 'query count' + rs.rows.length);
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              if (item.Value != langJSON.Value) {
                item.Value = langJSON.Value;
              }
              feedbackDetails.push(item);
            }
          }
          resolve(feedbackDetails);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getLanguageMapping', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  getAddresses() {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        transaction.executeSql("SELECT * FROM Address", [], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getAddresses', "ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getAddresses', "ERROR TXN: " + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  saveFeedback(userFeedback) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let feedback = [];
        let sqlUpdate = "INSERT OR REPLACE INTO User_Feedback (" + (userFeedback.FEEDBACK_ID ? "Feedback_Id," : "") + "id, Resource_Id, User_Email, Comments, Is_Reviewed, Reviewed_By, User_Location, Feedback_Date, Review_Date, Sync_Date, QId, Rating, Sync_Status) VALUES (" + (userFeedback.Feedback_Id ? "?," : "") + "?,?,?,?,?,?,?,?,?,?,?,?,?)";
        if (userFeedback.FEEDBACK_ID)
          feedback.push(userFeedback.FEEDBACK_ID);
        feedback.push(userFeedback.ID);
        feedback.push(userFeedback.RESOURCE_ID);
        feedback.push(userFeedback.USER_EMAIL);
        feedback.push(userFeedback.COMMENTS);
        feedback.push(userFeedback.IS_REVIEWED);
        feedback.push(userFeedback.REVIEWED_BY);
        feedback.push(userFeedback.USER_LOCATION);
        feedback.push(userFeedback.FEEDBACK_DATE);
        feedback.push(userFeedback.REVIEW_DATE);
        feedback.push(userFeedback.CREATEDON);
        feedback.push(userFeedback.QID);
        feedback.push(userFeedback.RATING);
        feedback.push(userFeedback.Sync_Status ? userFeedback.Sync_Status : 'false');
        //this.logger.log(this.fileName, 'saveFeedback', "feedback :" + JSON.stringify(feedback));
        transaction.executeSql(sqlUpdate, feedback, (tx, res) => {
          //this.logger.log(this.fileName, 'saveFeedback', "saved feedback res :" + JSON.stringify(feedback));
          resolve(res.insertId);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'saveFeedback', "saved feedback error :" + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'saveFeedback', "saved feedback error : " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  getEnabledLanguages() {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        transaction.executeSql("SELECT * FROM MST_Languages where isEnabled == 'true' AND Sync_Status =='true' AND Lang_Name is not null order by Lang_Name asc", [], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getActiveLanguages', "GET ACTIVE LANGUAGE ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getActiveLanguages', "GET ACTIVE LANGUAGE ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  updateFeedbackStatus(dataArray) {
    let sqlBatchStmt = [];
    for (let k in dataArray) {
      let data = dataArray[k];
      let stmtValues = [];
      let sqlInsert: any[] = ["Update User_Feedback SET Sync_Status = ? WHERE id = ?"];
      stmtValues.push('true');
      stmtValues.push(data.ID);
      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlInsert);
    }
    return this.insertBatchData(sqlBatchStmt, "updateFeedbackStatus");
  }

  public getPendingFeedbacks() {
    let addressList = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "SELECT * FROM User_Feedback WHERE Sync_Status = ?";

      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, ['false'], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              let feedbackRow: any = {
                "FEEDBACK_ID": item.Feedback_Id,
                "ID": item.id.toString(),
                "RESOURCE_ID": item.Resource_Id,
                "USER_EMAIL": item.User_Email,
                "COMMENTS": item.Comments,
                "IS_REVIEWED": item.Is_Reviewed,
                "REVIEWED_BY": item.Reviewed_By,
                "USER_LOCATION": item.User_Location,
                "FEEDBACK_DATE": item.Feedback_Date,
                "REVIEW_DATE": item.Review_Date,
                "CREATEDON": item.Sync_Date,
                "QID": item.QId.toString(),
                "RATING": item.Rating,
                "CREATEDBY": this.valueProvider.getUserId(),
                "MODIFIEDBY": this.valueProvider.getUserId(),
              };
              addressList.push(feedbackRow);
            }
          }
          //this.logger.log(this.fileName,'function','Service Request Data' + JSON.stringify(this.chargeType))

          resolve(addressList);
        }), ((tx, error) => {
          reject(error);
        }));
      });
    });
  }

  saveFeedbackList(response) {
    let responseList = response;
    let promises = [];
    for (let i = 0; i < responseList.length; i++) {
      responseList[i].Sync_Status = 'true';
      promises.push(this.saveFeedback(responseList[i]));
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises).then((response) => {
        resolve(true);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'saveFeedbackList', "Error in Promise all: " + JSON.stringify(error));
        resolve(false);
      });
    });
  };

  saveFeedbackQuestionsList(response) {
    let responseList = response;
    let promises = [];
    for (let i = 0; i < responseList.length; i++) {
      responseList[i].Sync_Status = 'true';
      promises.push(this.saveFeedbackQuestions(responseList[i]));
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises).then((response) => {
        resolve(true);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'saveFeedbackQuestionsList', "Error in Promise all : " + JSON.stringify(error));
        resolve(false);
      });
    });
  };

  saveFeedbackQuestions(feedbackQuestion) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let stmtValues = [];
        let sqlUpdate = "INSERT OR REPLACE INTO MST_Feedback_Questions (" + (feedbackQuestion.QId ? "QId," : "") + "Questions,id,Sync_Status) VALUES (" + (feedbackQuestion.QId ? "?," : "") + "?,?,?)";
        if (feedbackQuestion.QId)
          stmtValues.push(feedbackQuestion.QId);
        stmtValues.push(feedbackQuestion.Questions);
        stmtValues.push(feedbackQuestion.id);
        stmtValues.push(feedbackQuestion.Sync_Status ? feedbackQuestion.Sync_Status : 'false');
        transaction.executeSql(sqlUpdate, stmtValues, (tx, res) => {
          resolve(res.insertId);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'saveFeedbackQuestions', "Error : " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'saveFeedbackQuestions', "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  saveMSTLanguageList(responseList) {
    let sqlBatchStmt = [];
    if (responseList.length) {
      for (let k in responseList) {
        let language = responseList[k];
        let stmtValues = [];
        // update query to insert-update standard_code column values from ATP DB
        let sqlInsert: any[] = ["INSERT OR REPLACE INTO MST_Languages (" + (language.LANG_ID ? "Lang_Id, " : "") + "Lang_Name, Code, Is_Active, isEnabled, Sync_Status, is_FSR_Languages, Standard_Code) VALUES (" + (language.LANG_ID ? "?," : "") + "?,?,?,?,?,?,?)"];
        if (language.LANG_ID)
          stmtValues.push(language.LANG_ID);
        stmtValues.push(language.LANG_NAME);
        stmtValues.push(language.CODE);
        stmtValues.push(language.IS_ACTIVE);
        stmtValues.push(language.ISENABLED);
        stmtValues.push('true');
        stmtValues.push(language.FSR_ENABLED);
        stmtValues.push(language.STANDARD_CODE);
        sqlInsert.push(stmtValues);
        sqlBatchStmt.push(sqlInsert);
      }
    }
    return this.insertBatchData(sqlBatchStmt, 'saveMSTLanguageList');
  }

  saveMSTLanguages(language) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let stmtValues = [];
        let sqlUpdate = "INSERT OR REPLACE INTO MST_Languages (" + (language.LANG_ID ? "Lang_Id," : "") + "Lang_Name, Code, Is_Active, isEnabled, Sync_Status, is_FSR_Languages) VALUES (" + (language.LANG_ID ? "?," : "") + "?,?,?,?,?,?)";

        if (language.LANG_ID) stmtValues.push(language.LANG_ID);
        stmtValues.push(language.LANG_NAME);
        stmtValues.push(language.CODE);
        stmtValues.push(language.IS_ACTIVE);
        stmtValues.push(language.ISENABLED);
        stmtValues.push(language.Sync_Status ? language.Sync_Status : 'false');
        stmtValues.push(language.FSR_ENABLED);
        // stmtValues.push(language.id);
        // stmtValues.push('true');

        transaction.executeSql(sqlUpdate, stmtValues, (tx, res) => {
          resolve(res.insertId);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'saveMSTLanguages', "Error : " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'saveMSTLanguages', "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  saveMSTTranslationKeyList(translationKeys) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let sqlBatchStmt = [];
        for (let k in translationKeys) {
          let translationKey = translationKeys[k];
          let stmtValues = [];

          //07/27/2018 Mayur Varshney
          //Change insert/replace query for inserting data into two new columns i.e Key_Length and Is_Active in MST_Translation_Key table.
          //previous query is  = "query = "INSERT OR REPLACE INTO MST_Translation_Key (" + (translationKeys.Key_Id ? "Key_Id," : "") + "Key_Name,id,Sync_Status) VALUES (" + (translationKey.Key_Id ? "?," : "") + "?,?,?)"

          let sqlUpdate: any[] = ["INSERT OR REPLACE INTO MST_Translation_Key (" + (translationKeys.Key_Id ? "Key_Id," : "") + "Key_Name,id,Sync_Status,Key_Length,Is_Active) VALUES (" + (translationKey.Key_Id ? "?," : "") + "?,?,?,?,?)"];
          if (translationKey.Key_Id)
            stmtValues.push(translationKey.Key_Id);
          stmtValues.push(translationKey.Key_Name);
          stmtValues.push(translationKey.id);
          stmtValues.push('true');

          //07/27/2018 Mayur Varshney
          //pushing Key_Length and Is_Active into stmtValues array after getting it from cloudService provider
          stmtValues.push(translationKey.Key_Length);
          stmtValues.push(translationKey.Is_Active);
          sqlUpdate.push(stmtValues);
          sqlBatchStmt.push(sqlUpdate);
        }
        //this.logger.log(this.fileName, 'saveMSTTranslationKeyList', "mst translation keys :" + JSON.stringify(stmtValues));
        this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (tx, res) => {
          //this.logger.log(this.fileName, 'saveMSTTranslationKeyList', "saved mst translation keys res :" + JSON.stringify(stmtValues));
          resolve(true);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'saveMSTTranslationKeyList', "Error : " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'saveMSTTranslationKeyList', "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }
  /**
   *09/12/2018 kamal: save new added keys in local DB
   *
   * @param {*} languageKeyMaps
   * @param {*} id
   * @returns
   * @memberof LocalServiceProvider
   */
  saveNewLanguageKeyMappingList(languageKeyMaps, id) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let sqlBatchStmt = [];
        for (let k in languageKeyMaps) {
          let languageKeyMap = languageKeyMaps[k];
          let stmtValues = [];
          let sqlUpdate: any[] = ["INSERT OR REPLACE INTO Language_Key_Mappings (Lang_Id,Key_Id,Sync_Status,Is_Draft) VALUES (?,?,?,?)"];
          stmtValues.push(id);
          stmtValues.push(languageKeyMap.id);
          stmtValues.push(languageKeyMap.Sync_Status ? languageKeyMap.Sync_Status : "false");
          stmtValues.push("true");
          sqlUpdate.push(stmtValues);
          sqlBatchStmt.push(sqlUpdate);
        }
        this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (tx, res) => {
          resolve(true);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'saveNewLanguageKeyMappingList', "Error : " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'saveNewLanguageKeyMappingList', "Error TX: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  saveLanguageKeyMappingList(languageKeyMaps) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let sqlBatchStmt = [];
        for (let k in languageKeyMaps) {
          let languageKeyMap = languageKeyMaps[k];
          let stmtValues = [];
          if (languageKeyMap.id) {
            languageKeyMap.Key_Id = languageKeyMap.id;
          }
          // 08/14/2018 Mayur Varshney --  query changes
          // -- previous query -- "INSERT OR REPLACE INTO Language_Key_Mappings (Lang_Id,Key_Id,Value,Sync_Status) VALUES (?,?,?,?)"

          let sqlUpdate: any[] = ["INSERT OR REPLACE INTO Language_Key_Mappings (Lang_Id,Key_Id,Value,Sync_Status,Is_Draft) VALUES (?,?,?,?,?)"];
          stmtValues.push(languageKeyMap.Lang_Id);
          stmtValues.push(languageKeyMap.Key_Id);
          stmtValues.push(languageKeyMap.Value);
          stmtValues.push(languageKeyMap.Sync_Status ? languageKeyMap.Sync_Status : "false");

          // 08/14/2018 Mayur Varshney --  push Is_Draft status
          stmtValues.push(languageKeyMap.Is_Draft ? languageKeyMap.Is_Draft : "false");
          sqlUpdate.push(stmtValues);
          sqlBatchStmt.push(sqlUpdate);
        }
        this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (tx, res) => {
          resolve(true);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'saveLanguageKeyMappingList', "Error : " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'saveLanguageKeyMappingList', "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  public getPendingTranslations() {
    let value = [];
    return new Promise((resolve, reject) => {
      // Here Key_Name is being used to send to MCS, So that Language Files can be created for a technincian from Key_Name:Value pair

      // 08/13/2018 Mayur Varshney
      // previous query = "SELECT LKM.Lang_Id, LKM.Key_Id, MTK.Key_Name, LKM.Value, LKM.Sync_Status FROM Language_Key_Mappings LKM INNER JOIN MST_Translation_Key MTK ON MTK.id = LKM.Key_Id WHERE LKM.Sync_Status = ? and MTK.Is_Active = 'true'"

      let query = "SELECT LKM.Lang_Id, LKM.Key_Id, MTK.Key_Name, LKM.Value, LKM.Sync_Status FROM Language_Key_Mappings LKM INNER JOIN MST_Translation_Key MTK ON MTK.id = LKM.Key_Id WHERE LKM.Sync_Status = ? and MTK.Is_Active = ? and LKM.Is_Draft = ?";
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, ['false', 'true', 'false'], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              value.push(item);
            }
          }
          resolve(value);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getPendingTranslations', "ERROR: " + JSON.stringify(error.message));
          resolve(value);
        }));
      });
    });
  }

  public getPendingLanguages() {
    let value = [];
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM MST_Languages WHERE Sync_Status = ? ";
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, ['false'], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              value.push(item);
            }
          }
          resolve(value);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getPendingLanguages', "EROR: " + JSON.stringify(error.message));
          resolve(value);
        }));
      });
    });
  }

  // 01/28/2019 -- Mayur Varshney -- Optimise code
  public getTimeZoneList() {
    // 01-30-2019 -- Mansi Arora -- order Timezone list by TimeZoneIANA
    // 02-18-2019 -- Mansi Arora -- order Timezone list by TimeZone_Name in ascending order
    let query = "SELECT * FROM TimeZone order by TimeZone_Name asc";
    return this.getList(query, [], 'getTimeZoneList');
  }

  /**
   * 01/28/2019 -- Mayur Varshney
   * get active timezone list on the basis of IsActive status
   * @returns
   * @memberOf LocalServiceProvider
   */
  public getActiveTimeZoneList() {
    let query = "SELECT * FROM TimeZone WHERE IsActive = ? order by TimeZone_Name asc";
    let queryParams = ['Y'];
    return this.getList(query, queryParams, 'getActiveTimeZoneList');
  }

  public getLanguage_Key_Mappings(langid) {
    let langList = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "SELECT * FROM Language_Key_Mappings WHERE Lang_Id =?"
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [langid], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              langList.push(item);
            }
          }
          resolve(langList);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getLanguage_Key_Mappings', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  /**
   * Delete and INSERT OR REPLACE OnCallShift from Work_Schedule Table
   *
   * @param {any} response
   * @returns
   *
   * @memberOf LocalServiceProvider
   */
  public async saveWorkSchedule(response) {
    let deleteQuery = "DELETE FROM Work_Schedule WHERE ResourceId = ?";
    await this.insertData(deleteQuery, [this.valueProvider.getResourceId()], "saveWorkSchedule");
    if (response.length > 0) {
      let sqlBatchStmt = [];
      for (let i = 0; i < response.length; i++) {
        let comments = response[i].comments ? response[i].comments : '';
        let endDate = response[i].endDate ? response[i].endDate : '';
        let recurrence = response[i].recurrence;
        let weekdays = recurrence.weekdays ? recurrence.weekdays.toString() : '';
        let recurEvery = recurrence.recurEvery ? recurrence.recurEvery : '';
        let recurrenceType = recurrence.recurrenceType ? recurrence.recurrenceType : '';
        let dayFrom = recurrence.dayFrom ? recurrence.dayFrom : '';
        let dayTo = recurrence.dayTo ? recurrence.dayTo : '';
        let insertValues = [];
        let sqlInsert: any[] = [`INSERT OR REPLACE INTO  Work_Schedule (Schedule_Time_Id,Record_Type, Start_Date, End_Date,
          Shift_Label, Shift_Type, Work_Time_Start, Work_Time_End, Is_Working, Recurrence_Type, Recur_Every, Weekdays,
          Day_From, Day_To,Comments, ResourceId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`];
        insertValues.push(response[i].scheduleItemId);
        insertValues.push(response[i].recordType);
        insertValues.push(response[i].startDate);
        insertValues.push(endDate);
        insertValues.push(response[i].shiftLabel);
        insertValues.push(response[i].shiftType);
        insertValues.push(response[i].workTimeStart);
        insertValues.push(response[i].workTimeEnd);
        insertValues.push(response[i].isWorking);
        insertValues.push(recurrenceType);
        insertValues.push(recurEvery);
        insertValues.push(weekdays);
        insertValues.push(dayFrom);
        insertValues.push(dayTo);
        insertValues.push(comments);
        insertValues.push(this.valueProvider.getResourceId());
        sqlInsert.push(insertValues);
        sqlBatchStmt.push(sqlInsert);
      }
      await this.insertBatchData(sqlBatchStmt, "saveWorkSchedule");
    }
  }


  /**
   * getting all data from work_schedule table
   *
   * @returns
   *
   * @memberOf LocalServiceProvider
   */
  public getWorkSchedule() {
    let activityList = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "SELECT * FROM Work_Schedule WHERE ResourceId = ?;"
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [this.valueProvider.getResourceId()], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              activityList.push(item);
            }
          }
          resolve(activityList);
        }), ((tx, error) => {
          // this.logger.log(this.fileName, 'getWorkSchedule', 'Error in getWorkSchedule : ' + JSON.stringify(activityList));
          reject(error);
        }));
      });
    });
  }

  updateDebriefItems(debriefItems, taskNumber) {
    let sqlBatchStmt: any[] = [];
    let queryParams = [taskNumber];
    if (debriefItems.Time && !debriefItems.Time.hasError) {
      sqlBatchStmt.push([`UPDATE Time SET Sync_Status = 'true', DB_SyncStatus = 'false' WHERE Task_Number = ? AND Sync_Status = 'false'`, queryParams]);
    }
    if (debriefItems.Expense && !debriefItems.Expense.hasError) {
      sqlBatchStmt.push([`UPDATE Expense SET Sync_Status = 'true' WHERE Task_Number = ? AND Sync_Status = 'false'`, queryParams]);
    }
    if (debriefItems.Material && !debriefItems.Material.hasError) {
      sqlBatchStmt.push([`UPDATE MST_Material SET Sync_Status = 'true' WHERE Task_Number = ? AND Sync_Status = 'false'`, queryParams]);
    }
    if (debriefItems.Signature && !debriefItems.Signature.hasError) {
      sqlBatchStmt.push(["UPDATE Customer SET Sync_Status = 'true' WHERE Task_Number = ? AND Sync_Status = 'false'", queryParams]);
      sqlBatchStmt.push(["UPDATE Engineer SET Sync_Status = 'true' WHERE Task_Number = ? AND Sync_Status = 'false'", queryParams]);
    }
    if (debriefItems.Notes && !debriefItems.Notes.hasError) {
      sqlBatchStmt.push(["UPDATE Notes SET Sync_Status = 'true' WHERE Task_Number = ? AND Sync_Status = 'false'", queryParams]);
    }
    return this.insertBatchData(sqlBatchStmt, "updateDebriefItems");
  };

  public getPendingContacts() {
    let value = [];
    return new Promise((resolve, reject) => {
      if (this.valueProvider.isOSCUser()) {
        let query = '';
        query = "SELECT T.Customer_ID as Customer_Id, C.* FROM Contact C INNER JOIN Task T ON T.Task_Number = C.Task_Number WHERE (Contact_ID IS NULL OR Contact_ID = '')";

        this.dbctrl.getDB().transaction((tx) => {
          tx.executeSql(query, [], ((tx, rs) => {
            if (rs.rows.length > 0) {
              for (let i = 0; i < rs.rows.length; i++) {
                let item = rs.rows.item(i);
                value.push(item);
              }
            }
            // this.logger.log(this.fileName, 'getPendingContacts', 'Contact Added Data' + JSON.stringify(value))

            resolve(value);
          }), ((tx, error) => {
            this.logger.log(this.fileName, 'getPendingContacts', 'Error: ' + JSON.stringify(error.message));
            reject(error);
          }));
        });
      } else {
        resolve(value);
      }
    });
  }

  updateContactId(responseList) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let sqlBatchStmt = [];
        let stmtValues;
        for (let k in responseList) {
          let contactList = responseList[k];
          stmtValues = [];
          let sqlUpdate: any[] = ["UPDATE Contact SET Contact_ID = ? where Contact_Id_PK = ?"];

          stmtValues.push(contactList.Contact_ID);
          stmtValues.push(contactList.Contact_Id_PK);
          sqlUpdate.push(stmtValues);
          sqlBatchStmt.push(sqlUpdate);
        }
        // this.logger.log(this.fileName, 'updateContactId', "Updated contact id's :" + JSON.stringify(stmtValues));
        this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (tx, res) => {

          resolve(responseList);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateContactId', "Error : " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateContactId', "Error TXN : " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  deleteMaterialSerialData(materialId) {

    this.dbctrl.getDB().transaction((transaction) => {

      let sqlDelete = "DELETE FROM Material_Serial where Material_Id_Fk = " + materialId;

      transaction.executeSql(sqlDelete);

    }, (error) => {

      this.logger.log(this.fileName, 'deleteMaterialList', "MATERIAL DELETE TRANSACTION ERROR: " + JSON.stringify(error.message));
    });
  };

  /**
   * Gets the Last successfull sync from SyncLog Table
   *
   * @returns Promise
   * @memberof LocalServiceProvider
   */
  getLastSyncLog() {
    return new Promise((resolve, reject) => {
      let query = '';
      query = "SELECT * FROM Sync_Log WHERE UserId = ? and Status = ? ORDER BY ID DESC LIMIT 1";
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [this.valueProvider.getResourceId(), "Success"], ((tx, rs) => {
          let syncLog;
          if (rs.rows.length == 1) {
            syncLog = rs.rows.item(0);
          }
          resolve(syncLog);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getLastSyncLog', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  /**
   * Gets the Last successfull sync from SyncLog Table
   *
   * @returns Promise
   * @memberof LocalServiceProvider
   */
  getLastSyncLogTime() {
    return new Promise((resolve, reject) => {
      let query = '';
      query = "SELECT * FROM Sync_Log WHERE UserId = ? ORDER BY ID DESC LIMIT 1";
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [this.valueProvider.getResourceId()], ((tx, rs) => {
          let syncLog;
          if (rs.rows.length == 1) {
            syncLog = rs.rows.item(0);
          }
          resolve(syncLog);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getLastSyncLog', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  //-- Mayur Varshney -- add new function -- update Is_draft status to false whose Is_Draft Status is true with respect to Lang_Id
  updateIsDraftTranslation(langId) {
    return new Promise((resolve, reject) => {
      let query = '';
      query = "UPDATE Language_Key_Mappings SET Is_Draft = ? WHERE Is_Draft = ? AND Lang_Id = ?"
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, ['false', 'true', langId], ((tx, rs) => {
          resolve(true);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getIsDraftTranslation', 'Error in getIsDraftTranslation : ' + JSON.stringify(error));
          reject(error);
        }));
      });
    });
  }

  getBusinessUnits() {
    let query = "SELECT BU.BUID as LookupID, BU.Name as LookupValue, BU.* FROM BusinessUnits BU where IsActive = ?";
    let queryParams = ["Y"];
    return this.getList(query, queryParams, "getBusinessUnits");
  }

  //RAdheshyam kumar changed db connection to customer-data
  getCustomers() {
    let query = "SELECT C.CustomerID as LookupID, C.Name as LookupValue, C.* FROM MST_Customer C where IsActive = ?";
    let queryParams = ["Y"];
    return this.getListFormCustomerDB(query, queryParams, "getCustomers");
  }

  //RAdheshyam kumar changed db connection to customer-data
  getCustomerByID(CustomerID) {
    let query = "SELECT CustomerID,Name as LookupValue FROM MST_Customer where CustomerID = ?";
    let queryParams;
    if (CustomerID == null) {
      queryParams = [0];
    } else {
      queryParams = [CustomerID];
    }
    return this.getListFormCustomerDB(query, queryParams, "getCustomerByID");
  }

  getProduct(BGID) {
    //31/10/2018 : Ankit Pathak : Get Product as per the Mapper BUID instead of BUID
    let query = "SELECT P.ProductID as LookupID, P.ProductName as LookupValue, P.* FROM MST_Product P WHERE BusinessGroupID = ? AND IsActive = ? AND ParentID IS NULL ORDER BY ProductName ";
    let queryParams = [BGID, "Y"];
    return this.getList(query, queryParams, "getProduct");
  }

  getProductByID(ProductID) {
    //31/10/2018 : Ankit Pathak : Get Product as per the Mapper BUID instead of BUID
    let query = "SELECT P.ProductID as LookupID, P.ProductName as LookupValue, P.* FROM MST_Product P WHERE ProductID = ?";
    let queryParams = [ProductID];
    return this.getList(query, queryParams, "getProduct");
  }

  getChildProducts(BGID, ParentID) {
    let query = "SELECT P.ProductID as LookupID, P.ProductName as LookupValue, P.* FROM MST_Product P WHERE BusinessGroupID = ? AND IsActive = ? AND ParentID = ? ORDER BY WorkFlowGroupID";
    let queryParams = [BGID, "Y", ParentID];
    return this.getList(query, queryParams, "getProduct");
  }

  getWorkFlows(BUID, TemplateID) {
    //31/10/2018 : Ankit Pathak : Get WorkFlows as per the Mapper BUID instead of BUID
    //20/11/2018 : Shivansh Subnani: Get workflows where workflowGroupId is null to show common pages for all Bu's
    return this.getList("SELECT W.*,L.DisplayOrder as StatusOrder FROM WorkFlow W LEFT OUTER JOIN Lookups L ON l.LookupID = W.StatusToChange where W.WorkFlowGroupID IS NULL  and W.TemplateID = ? and W.IsActive = ? ORDER BY W.DisplayOrder asc", [TemplateID, "Y"], "getWorkFlows");
  }

  getParentWorkFlowSections(WorkFlowIDArr) {
    let query = "SELECT * FROM WorkFlowSections wfs INNER JOIN WorkFlow WF ON WF.WorkFlowID = wfs.WorkFlowID where wfs.WorkFlowID IN (" + WorkFlowIDArr.toString() + ") and wfs.ParentID ISNULL and wfs.IsActive = ? ORDER BY wfs.DisplayOrder asc ";
    return this.getList(query, ["Y"], "getParentWorkFlowSections");
  }

  getChildWorkFlowSections(SectionID) {
    return this.getList("SELECT * FROM WorkFlowSections where ParentID = ? and IsActive = ? ORDER BY DisplayOrder asc", [SectionID, "Y"], "getChildWorkFlowSections");
  }

  getTemplatePlaceholders(TemplateID) {
    return this.getList("SELECT * FROM TemaplatePlaceholders where TemplateID = ?", [TemplateID], "getTemplatePlaceholders");
  }

  //TODO : Optimize Accordion Specific Elements
  getWorkFlowElementsAccordion(SectionID, PlaceholderID, currentReport, ParentElementID, accordionItemParent, IsReport?) {
    let query = "SELECT (select count(l.LookupID) from Lookups l where l.LookupType = WE.ElementName and " +
      "WE.ElementType = ? and l.parentid = ?) as elcount, RD.RDID, RD.RDID_Mobile, " +
      "Case When We.PrepopulateWithElementID IS NOT NULL THEN " +
      "(Select R.Value FROM ReportData R WHERE R.ElementID = We.PrepopulateWithElementID AND R.ParentID_Mobile = " +
      "(SELECT RDID_Mobile FROM ReportData WHERE ElementID = " +
      "(SELECT ParentID FROM WorkFlowElements WHERE ElementID = We.PrepopulateWithElementID) AND Value = ? AND ReportID_Mobile = ?)) " +
      "ELSE RD.Value end as PrePopulatedValue, " +
      "Case When We.PrepopulateWithElementID IS NOT NULL AND RD.RDID_Mobile IS NULL THEN " +
      "(Select R.Value FROM ReportData R WHERE R.ElementID = We.PrepopulateWithElementID AND R.ParentID_Mobile = " +
      "(SELECT RDID_Mobile FROM ReportData WHERE ElementID = " +
      "(SELECT ParentID FROM WorkFlowElements WHERE ElementID = We.PrepopulateWithElementID) AND Value = ? AND ReportID_Mobile = ?)) " +
      "ELSE RD.Value end as Value, " +
      "Case When We.PrepopulateWithElementID IS NOT NULL AND RD.RDID_Mobile IS NULL THEN " +
      "(Select R.DetailedValue FROM ReportData R WHERE R.ElementID = We.PrepopulateWithElementID AND R.ParentID_Mobile = " +
      "(SELECT RDID_Mobile FROM ReportData WHERE ElementID = " +
      "(SELECT ParentID FROM WorkFlowElements WHERE ElementID = We.PrepopulateWithElementID) AND Value = ? AND ReportID_Mobile = ?)) " +
      "ELSE RD.DetailedValue end as DetailedValue, " +
      "Case When We.PrepopulateWithElementID IS NOT NULL AND RD.RDID_Mobile IS NULL THEN " +
      "(Select R.OtherValue FROM ReportData R WHERE R.ElementID = We.PrepopulateWithElementID AND R.ParentID_Mobile = " +
      "(SELECT RDID_Mobile FROM ReportData WHERE ElementID = " +
      "(SELECT ParentID FROM WorkFlowElements WHERE ElementID = We.PrepopulateWithElementID) AND Value = ? AND ReportID_Mobile = ?)) " +
      "ELSE RD.OtherValue end as OtherValue " +
      ", RD.ReportID_Mobile, WE.*, Val.LookupValue as ValidationValue, Val.Type as ValidationType FROM WorkFlowElements WE " +
      "LEFT OUTER JOIN ReportData RD ON RD.ElementID = WE.ElementID " +
      "AND RD.ReportID_Mobile = ?  AND RD.ParentID_Mobile = (SELECT RDID_Mobile FROM ReportData WHERE ElementID = ? AND Value = ? AND ReportID_Mobile = ?) " +
      "LEFT OUTER JOIN Lookups Val ON We.ValidationID = Val.LookupID " +
      "WHERE WE.SectionID = ? AND WE.ContentPlaceholderID = ? AND WE.IsActive = ? AND WE.ParentID = ? " +
      "GROUP BY WE.ElementID ORDER BY We.DisplayOrder";
    let queryParams = [Enums.ElementType.AccordionListView,
      accordionItemParent, accordionItemParent, currentReport.ReportID_Mobile, accordionItemParent, currentReport.ReportID_Mobile,
      accordionItemParent, currentReport.ReportID_Mobile, accordionItemParent, currentReport.ReportID_Mobile, currentReport.ReportID_Mobile, ParentElementID, accordionItemParent,
    currentReport.ReportID_Mobile, SectionID, PlaceholderID, "Y", ParentElementID]
    // //console.log("getWorkFlowElementsAccordionQuery", query);
    ////console.log("getWorkFlowElementsAccordionqueryParams", queryParams);
    return this.getList(query, queryParams, "getWorkFlowElementsAccordion");
  }

  //02-01-2018 Radheshyam kumar Added customer db for mst_customer access.
  getWorkFlowElements(SectionID, PlaceholderID, currentReport) {
    // return new Promise((resolve, reject) => {
    let query;
    if (currentReport) {
      query = "SELECT RD.RDID, RD.RDID_Mobile, RD.DetailedValue,RD.OtherValue, " +
        //"Case " +
        "Case When We.PrepopulateWithElementID IN (2, 153, 334, 404, 130095) THEN  (Select RV.Value from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? ) " +
        "When We.PrepopulateWithElementID IN (147,4,398,130111) THEN (Select ProductName	from MST_Product where ProductID = (Select RV.Value from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? )) " +
        "When We.PrepopulateWithElementID IN (5,6,7,149) THEN (Select LookupValue	from Lookups where LookupID = (Select RV.Value from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? )) " +
        "When We.PrepopulateWithElementID IN (130109) THEN (Select BusinessGroupName	from BusinessGroup where BusinessGroupID = (Select RV.Value from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? ) ) " +
        "When We.PrepopulateWithElementID IS NOT NULL AND RD.RDID_Mobile IS NULL THEN " +
        "(Select RDP.Value from ReportData RDP Where RDP.ElementID = WE.PrepopulateWithElementID AND RDP.ReportID_Mobile = ? ) " +
        "ELSE RD.Value end as Value, " +
        "Case When We.PrepopulateWithElementID IN (2, 153, 334, 404, 130095) THEN  (Select RV.DetailedValue from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? ) " +
        "When We.PrepopulateWithElementID IN (147,4,398,130111) THEN (Select ProductName	from MST_Product where ProductID = (Select RV.DetailedValue from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? )) " +
        "When We.PrepopulateWithElementID IN (5,6,7,149) THEN (Select LookupValue	from Lookups where LookupID = (Select RV.DetailedValue from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? )) " +
        "When We.PrepopulateWithElementID IN (130109) THEN (Select BusinessGroupName	from BusinessGroup where BusinessGroupID = (Select RV.DetailedValue from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? ) ) " +
        "When We.PrepopulateWithElementID IS NOT NULL AND RD.RDID_Mobile IS NULL THEN " +
        "(Select RDP.DetailedValue from ReportData RDP Where RDP.ElementID = WE.PrepopulateWithElementID AND RDP.ReportID_Mobile = ? ) " +
        "ELSE RD.DetailedValue end as DetailedValue, " +
        "Case When We.PrepopulateWithElementID IN (2, 153, 334, 404, 130095) THEN  (Select RV.OtherValue from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? ) " +
        "When We.PrepopulateWithElementID IN (147,4,398,130111) THEN (Select ProductName	from MST_Product where ProductID = (Select RV.OtherValue from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? )) " +
        "When We.PrepopulateWithElementID IN (5,6,7,149) THEN (Select LookupValue	from Lookups where LookupID = (Select RV.OtherValue from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? )) " +
        "When We.PrepopulateWithElementID IN (130109) THEN (Select BusinessGroupName	from BusinessGroup where BusinessGroupID = (Select RV.OtherValue from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? ) ) " +
        "When We.PrepopulateWithElementID IS NOT NULL AND RD.RDID_Mobile IS NULL THEN " +
        "(Select RDP.OtherValue from ReportData RDP Where RDP.ElementID = WE.PrepopulateWithElementID AND RDP.ReportID_Mobile = ? ) " +
        "ELSE RD.OtherValue end as OtherValue, " +
        "Case When We.PrepopulateWithElementID IS NOT NULL THEN " +
        "(Select RV.Value from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? ) Else RD.Value End as ValueID, " +
        "RD.ReportID_Mobile, WE.*, Val.LookupValue as ValidationValue, Val.Type as ValidationType " +
        "FROM WorkFlowElements WE " +
        "LEFT OUTER JOIN ReportData RD ON RD.ElementID = WE.ElementID " +
        "AND RD.ReportID_Mobile = ? " +
        "AND RD.ParentID_Mobile ISNULL LEFT OUTER JOIN Lookups Val ON We.ValidationID = Val.LookupID " +
        "WHERE WE.SectionID = ? AND WE.ContentPlaceholderID = ? AND WE.IsActive = ? AND WE.ParentID ISNULL " +
        "GROUP BY WE.ElementID ORDER BY We.DisplayOrder";
    } else {
      query = "SELECT RD.RDID, RD.RDID_Mobile, RD.Value, RD.ReportID_Mobile, WE.*, Val.LookupValue as ValidationValue, Val.Type as ValidationType " +
        "FROM WorkFlowElements WE LEFT OUTER JOIN ReportData RD ON RD.ElementID = WE.ElementID AND RD.ReportID_Mobile IS NULL " +
        "AND RD.ParentID_Mobile ISNULL LEFT OUTER JOIN Lookups Val ON We.ValidationID = Val.LookupID " +
        "WHERE WE.SectionID = ? AND WE.ContentPlaceholderID = ? AND WE.IsActive = ? AND WE.ParentID ISNULL " +
        "GROUP BY WE.ElementID ORDER BY We.DisplayOrder";
    }
    let queryParams = [];
    if (currentReport) {
      queryParams = [currentReport.ReportID_Mobile, currentReport.ReportID_Mobile, currentReport.ReportID_Mobile,
      currentReport.ReportID_Mobile, currentReport.ReportID_Mobile, currentReport.ReportID_Mobile, currentReport.ReportID_Mobile,
      currentReport.ReportID_Mobile, currentReport.ReportID_Mobile, currentReport.ReportID_Mobile, currentReport.ReportID_Mobile, currentReport.ReportID_Mobile,
      currentReport.ReportID_Mobile,
      currentReport.ReportID_Mobile, currentReport.ReportID_Mobile, currentReport.ReportID_Mobile, currentReport.ReportID_Mobile];
    }
    queryParams = queryParams.concat([SectionID, PlaceholderID, "Y"]);
    // //console.log("getWorkFlowElementsQuery", query);
    // //console.log("queryParams", queryParams);
    //return this.getList(query, queryParams, "getWorkFlowElements");

    // let WFElements;
    // let CustomerIDArr = [];
    //let tempCustomerArr = 0;
    return this.getList(query, queryParams, "getWorkFlowElements")
    // .then((res: any[]) => {
    //   WFElements = res;
    //   let filteredElements = WFElements.filter((item) => item.PrepopulateWithElementID == 130095);
    //   filteredElements.forEach(item => {
    //     if (CustomerIDArr.indexOf(item.Value) == -1) CustomerIDArr.push(item.Value);
    //   });
    //   let promiseArr = [];
    //   CustomerIDArr.forEach((item) => {
    //     promiseArr.push(this.getCustomerByID(item));
    //   })
    //   Promise.all(promiseArr).then((allResult) => {
    //     WFElements.forEach(item => {
    //       if (item.PrepopulateWithElementID == 130095) {
    //         allResult.filter(customerItem => {
    //           if (customerItem.length > 0) {
    //             if (customerItem[0].CustomerID == item.Value) {
    //               item.Value = customerItem[0].LookupValue;
    //             }
    //           }
    //         });
    //       }
    //     });
    //     resolve(WFElements);
    //   }).catch((err: any) => {
    //     this.logger.log(this.fileName, 'getWorkFlowElements', 'Error in Promise all: ' + JSON.stringify(err));
    //   });
    // }).catch((error) => {
    //   this.logger.log(this.fileName, 'getWorkFlowElements', 'Error in getList: ' + JSON.stringify(error));
    //   reject(error)
    // });
    // })
  }

  //02-01-2018 Radheshyam kumar Added customer db for mst_customer access.
  getWorkFlowElementsForReview(SectionID, PlaceholderID, currentReport) {
    // return new Promise((resolve, reject) => {
    let ReportID_MobileJoin = currentReport ? " AND RD.ReportID_Mobile = ? " : " AND RD.ReportID_Mobile ISNULL ";
    // let ValueCaseWhen = "Case When We.PrepopulateWithElementID in (2, 153, 334, 404,130095) THEN (Select Name	from MST_Customer where CustomerID = RD.Value) " +
    //   "When We.PrepopulateWithElementID IN (147,4,398,130111) THEN (Select ProductName	from MST_Product where ProductID = RD.Value) " +
    //   "When We.PrepopulateWithElementID IN (5,6,7,149) THEN (Select LookupValue	from Lookups where LookupID = RD.Value) " +
    //   "When We.ReportViewElementType = 'ReportViewLabel' AND We.DataSource ='Lookup' THEN(SELECT LookupValue FROM Lookups WHERE LookupID = RD.Value) " +
    //   "When We.PrepopulateWithElementID IN (130109) THEN (Select BusinessGroupName	from BusinessGroup where BusinessGroupID = RD.Value) " +
    //   "ELSE RD.Value end as Value";
    let ValueCaseWhen = "Case " +
      "When We.PrepopulateWithElementID IN (147,4,398,130111) THEN (Select ProductName	from MST_Product where ProductID = RD.Value) " +
      "When We.PrepopulateWithElementID IN (5,6,7,149) THEN (Select LookupValue	from Lookups where LookupID = RD.Value) " +
      "When We.ReportViewElementType = 'ReportViewLabel' AND We.DataSource ='Lookup' THEN(SELECT LookupValue FROM Lookups WHERE LookupID = RD.Value) " +
      "When We.PrepopulateWithElementID IN (130109) THEN (Select BusinessGroupName	from BusinessGroup where BusinessGroupID = RD.Value) " +
      "ELSE RD.Value end as Value";
    //22/10/2018 Ankit Pathak: Added Case for PrepopulateElementID for RD.ValueID
    let ValueIDCaseWhen = currentReport ? ", Case When We.PrepopulateWithElementID IN (147,4,398,130111) THEN" +
      " (Select RV.Value from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? ) Else RD.Value End as ValueID, "
      : ", RD.Value as ValueID, ";
    let query = "SELECT RD.RDID, RD.RDID_Mobile, RD.DetailedValue, RD.OtherValue, " + ValueCaseWhen + ValueIDCaseWhen +
      " RD.ReportID_Mobile, WE.*, Val.LookupValue as ValidationValue, Val.Type as ValidationType FROM WorkFlowElements WE " +
      "LEFT OUTER JOIN ReportData RD ON RD.ElementID in (WE.ElementID, WE.PrepopulateWithElementID) " +
      ReportID_MobileJoin + " AND RD.ParentID_Mobile ISNULL LEFT OUTER JOIN Lookups Val ON We.ValidationID = Val.LookupID " +
      "WHERE WE.SectionID = ? AND WE.ContentPlaceholderID = ? AND WE.IsActive = ? AND WE.ParentID ISNULL " +
      "GROUP BY WE.ElementID ORDER BY We.DisplayOrder";
    let queryParams = [];
    if (currentReport) queryParams.push(currentReport.ReportID_Mobile);
    if (currentReport) queryParams.push(currentReport.ReportID_Mobile);
    queryParams = queryParams.concat([SectionID, PlaceholderID, "Y"]);
    ////console.log("query", query);
    ////console.log("queryParams", queryParams);
    //return this.getList(query, queryParams, "getWorkFlowElements");

    // let ReviewWFElements;
    // let CustomerIDArr = [];
    //let tempCustomerArr = 0;
    return this.getList(query, queryParams, "getWorkFlowElementsForReview")
    //   .then((res: any[]) => {
    //     ReviewWFElements = res;
    //     let filteredElements = ReviewWFElements.filter((item) => item.PrepopulateWithElementID == 130095);
    //     filteredElements.forEach(item => {
    //       if (CustomerIDArr.indexOf(item.Value) == -1) CustomerIDArr.push(item.Value);
    //     });
    //     let promiseArr = [];
    //     CustomerIDArr.forEach((item) => {
    //       promiseArr.push(this.getCustomerByID(item));
    //     })
    //     Promise.all(promiseArr).then((allResult) => {
    //       ReviewWFElements.forEach(item => {
    //         if (item.PrepopulateWithElementID == 130095) {
    //           allResult.filter(customerItem => {
    //             if (customerItem.length > 0) {
    //               if (customerItem[0].CustomerID == item.Value) {
    //                 item.Value = customerItem[0].LookupValue;
    //               }
    //             }
    //           });
    //         }
    //       });
    //       resolve(ReviewWFElements);
    //     }).catch((err: any) => {
    //       this.logger.log(this.fileName, 'getWorkFlowElementsForReview', 'Error in Promise all: ' + JSON.stringify(err));
    //     });
    //   }).catch((error) => {
    //     this.logger.log(this.fileName, 'getWorkFlowElementsForReview', 'Error in getList: ' + JSON.stringify(error));
    //     reject(error)
    //   });
    // })
  }

  getLookupByType(LookupType, OrderByType, ParentReferenceID?) {
    let queryParams = [LookupType, "Y"];
    //22/10/2018 Ankit Pathak: Handling for Loading LOVs as per the Dependent Dropdown
    if (ParentReferenceID) queryParams.push(ParentReferenceID);
    let ParentReferenceIDClause = ParentReferenceID ? "AND ParentReferenceID = ?" : "";
    let OrderBy = OrderByType && OrderByType == Enums.OrderByType.DisplayOrder ? " ORDER BY DisplayOrder,lower(LookupValue)" : " ORDER BY lower(LookupValue)";
    return this.getList("SELECT LU.* FROM Lookups LU WHERE LookupType = ? and IsActive = ? " + ParentReferenceIDClause + OrderBy + " asc", queryParams, "getLookupByType");
  }

  getChildLookupByType(LookupType, OrderByType, ParentID) {
    let queryParams = [LookupType, "Y", ParentID];
    //22/10/2018 Ankit Pathak: Handling for Loading LOVs as per the Dependent Dropdown
    let OrderBy = OrderByType && OrderByType == Enums.OrderByType.DisplayOrder ? " ORDER BY DisplayOrder,lower(LookupValue)" : " ORDER BY lower(LookupValue)";
    return this.getList("SELECT LU.* FROM Lookups LU WHERE LookupType = ? and IsActive = ? AND ParentID = ? " + OrderBy + " asc", queryParams, "getChildLookupByType");
  }

  getLookupByID(LookupID) {
    let queryParams = [LookupID];
    //22/10/2018 Ankit Pathak: Handling for Loading LOVs as per the Dependent Dropdown
    return this.getList("SELECT LookupValue FROM Lookups LU WHERE LookupID = ?", queryParams, "getLookupByID");
  }

  getAccordionLookupByType(currentReport, ElementID, LookupType, ParentReferenceID, parentID?) {
    let ReportID_Mobile = currentReport ? currentReport.ReportID_Mobile : null;
    let queryParams = [ReportID_Mobile, ElementID, LookupType, "Y"];
    if (ParentReferenceID) queryParams.push(ParentReferenceID);
    let ParentReferenceIDClause = ParentReferenceID ? " AND ParentReferenceID = ?" : "";
    //23/10/2018 Ankit Pathak: Handling for Loading LOVs as per the Dependent Parent
    if (parentID) queryParams.push(parentID);
    let ParentIDClause = parentID ? " AND LU.ParentID = ?" : "";
    let query = "SELECT RD.RDID, RD.RDID_Mobile, LU.* FROM Lookups LU LEFT OUTER JOIN ReportData RD ON RD.ReportID_Mobile = ? AND RD.Value = LU.LookupID AND RD.ElementID = ? WHERE LookupType = ? and IsActive = ?" + ParentReferenceIDClause + ParentIDClause + " ORDER BY DisplayOrder asc";
    return this.getList(query, queryParams, "getAccordionLookupByType");
  }

  // saveReportDataWithInsertID(WorkFlowElement, parentElement, currentReport, isModified) {
  //   try {
  //     let isInsert = WorkFlowElement.RDID_Mobile ? false : true;
  //     let uniqueRDID_Mobile = parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000)));
  //     WorkFlowElement.RDID_Mobile = !isInsert ? WorkFlowElement.RDID_Mobile : uniqueRDID_Mobile;
  //     let RDIDSubQuery = WorkFlowElement.RDID ? "?" : "(SELECT RDID FROM ReportData WHERE RDID_Mobile = ?)";
  //     // let RDID_MobileSubQuery = WorkFlowElement.RDID_Mobile ? "?" : "(SELECT RDID_Mobile FROM ReportData WHERE RDID = ?)";
  //     let ReportIDSubQuery = currentReport.ReportID ? "?" : "(SELECT ReportID FROM SubmittedReports WHERE ReportID_Mobile = ?)";
  //     let ReportID_MobileSubQuery = currentReport.ReportID_Mobile ? "?" : "(SELECT ReportID_Mobile FROM SubmittedReports WHERE ReportID = ?)";
  //     let ParentIDSubQuery = "(SELECT RDID FROM ReportData WHERE ElementID = ? AND Value = ? AND ReportID_Mobile = ?)";
  //     let ParentID_MobileSubQuery = "(SELECT RDID_Mobile FROM ReportData WHERE ElementID = ? AND Value = ? AND ReportID_Mobile = ?)";
  //     let query = "INSERT OR REPLACE INTO ReportData(RDID, RDID_Mobile, ReportID, ReportID_Mobile, ElementID, Value, ParentID, ParentID_Mobile, SyncStatus, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate) " +
  //       "VALUES (" + RDIDSubQuery + ", ?, " + ReportIDSubQuery + " , " + ReportID_MobileSubQuery + ", ?, ?, " + ParentIDSubQuery + ", " + ParentID_MobileSubQuery + ", ?, ?, ?, ?, ?)";
  //     let queryParams = [
  //       WorkFlowElement.RDID ? WorkFlowElement.RDID : WorkFlowElement.RDID_Mobile,
  //       WorkFlowElement.RDID_Mobile,
  //       currentReport.ReportID ? currentReport.ReportID : currentReport.ReportID_Mobile,
  //       currentReport.ReportID_Mobile ? currentReport.ReportID_Mobile : currentReport.ReportID,
  //       WorkFlowElement.ElementID,
  //       WorkFlowElement.Value,
  //       WorkFlowElement.ParentID,
  //       parentElement ? parentElement.Value : null,
  //       currentReport.ReportID_Mobile ? currentReport.ReportID_Mobile : currentReport.ReportID,
  //       WorkFlowElement.ParentID,
  //       parentElement ? parentElement.Value : null,
  //       currentReport.ReportID_Mobile ? currentReport.ReportID_Mobile : null,
  //       WorkFlowElement.SyncStatus ? WorkFlowElement.SyncStatus : 'false',
  //       WorkFlowElement.ReportID || WorkFlowElement.ReportID_Mobile ? WorkFlowElement.CreatedBy : this.getCurrentUser(),
  //       WorkFlowElement.ReportID || WorkFlowElement.ReportID_Mobile ? WorkFlowElement.CreatedDate : this.getCurrentDate(),
  //       isModified ? this.getCurrentUser() : WorkFlowElement.ModifiedBy,
  //       isModified ? this.getCurrentDate() : WorkFlowElement.ModifiedDate
  //     ];
  //     return this.insertData(query, queryParams, "saveReportDataWithInsertID");
  //   } catch (error) {
  //     this.logger.log(this.fileName, "saveReportDataWithInsertID", "Error: " + JSON.stringify(error.message));
  //   }
  // }

  saveReportDataAsBatch(WorkFlowElements, currentReport, accordionListView?) {
    let sqlBatch = this.getReportDataBatch(WorkFlowElements, currentReport, accordionListView);
    ////console.log("sqlBatch", sqlBatch);
    return this.insertBatchData(sqlBatch, "saveReportDataAsBatch");
  }

  // createReport(jsonData) {
  //   // 11/14/2018: Gurkirat Singh - Added Selected_Process, IsStandalone
  //   let query = "INSERT INTO SubmittedReports(ReportID, ReportID_Mobile, ReportNumber, Status, SyncStatus, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate, Selected_Process, IsStandalone) VALUES (?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)";
  //   let queryParams = [
  //     jsonData.ReportID, jsonData.ReportID_Mobile, jsonData.ReportNumber, jsonData.Status, jsonData.SyncStatus,
  //     parseInt(this.valueProvider.getUserId()), this.getCurrentDate(), parseInt(this.valueProvider.getUserId()), this.getCurrentDate(),
  //     jsonData.Selected_Process, jsonData.IsStandalone
  //   ];
  //   return this.insertData(query, queryParams, "createReport");
  // }

  public getCurrentUser() {
    // return this.valueProvider.getUser().UserID;
    return parseInt(this.valueProvider.getUserId());
  }

  public getCurrentDate() {
    //  02/06/2019 -- Mayur Varshney -- save Created date time in UTC
    return moment.utc(new Date()).format("DD-MMM-YYYY hh:mm:ss.SSS A");
  }

  private insertData(query, queryParams, functionName) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql(query, queryParams, (tx, res) => {
          resolve(res.insertId);
        }, (tx, error) => {
          this.logger.log(this.fileName, functionName, 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, functionName, 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  deleteReportData(RDID_Mobile) {
    this.dbctrl.getDB().transaction((transaction) => {
      let sqlDelete = "DELETE FROM ReportData WHERE RDID_Mobile = " + RDID_Mobile;
      transaction.executeSql(sqlDelete);
    }, (error) => {
      this.logger.log(this.fileName, 'deleteReportData', 'Error: ' + JSON.stringify(error.message));
    });
  }

  getReportDataBatch(dataArray, currentReport, accordionListView?: boolean) {
    let sqlBatchStmt = [];
    try {
      for (let k in dataArray) {
        let data = dataArray[k];
        if (data) {
          let isInsert = data.RDID_Mobile ? false : true;
          let uniqueRDID_Mobile = parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000)));
          //01-29-2018 Radheshyam kumar added "accordionListView" check for adding accessories item.
          if (accordionListView) {
            data.RDID_Mobile = uniqueRDID_Mobile;
          } else {
            data.RDID_Mobile = !isInsert ? data.RDID_Mobile : uniqueRDID_Mobile;
          }

          let ParentID_MobileSubQuery = "(SELECT RDID_Mobile FROM ReportData WHERE ElementID = ? AND Value = ? AND ReportID_Mobile = ?)";
          let CreatedBy_MobileSubQuery = isInsert ? "?" : "(SELECT CreatedBy FROM ReportData WHERE RDID_Mobile = ?)";
          let CreatedDate_MobileSubQuery = isInsert ? "?" : "(SELECT CreatedDate FROM ReportData WHERE RDID_Mobile = ?)";
          let query: any[] = ["INSERT OR REPLACE INTO ReportData(RDID_Mobile, ReportID_Mobile, ElementID, Value, ParentID_Mobile, SyncStatus, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate, File_Type, DetailedValue,OtherValue,Show_In_Pdf,AttachmentStatus) " +
            "VALUES (?, ?, ?, ?, " + ParentID_MobileSubQuery + ", ?, " + CreatedBy_MobileSubQuery + ", " + CreatedDate_MobileSubQuery + ", ?, ?, ?, ?,?,?,?)"];
          let stmtValues = [
            data.RDID_Mobile,
            currentReport.ReportID_Mobile,
            //24/10/2018: Ankit Pathak : Change Value of PrepopulateElement on Change of Value in Populated Element
            // 11/21/2018: Gurkirat Singh: Just save the value of current element and not update the PrepopulateElement
            // data.PrepopulateWithElementID ? data.PrepopulateWithElementID : data.ElementID,
            data.ElementID,
            // 03-18-2019 Gurkirat Singh : Added Check for Elements whose value is a Json Object should go as a string.
            data.Value && typeof data.Value === 'object' && data.ElementType != Enums.ElementType.Date && data.ElementType != Enums.ElementType.Time ? JSON.stringify(data.Value) : data.Value,
            // this.getElementValue(data),
            data.ParentID,
            data.ParentValue,
            currentReport.ReportID_Mobile,
            data.SyncStatus ? data.SyncStatus : 'false',
          ];
          stmtValues.push(isInsert ? this.getCurrentUser() : data.RDID_Mobile);
          stmtValues.push(isInsert ? this.getCurrentDate() : data.RDID_Mobile);
          stmtValues.push(this.getCurrentUser());
          stmtValues.push(this.getCurrentDate());
          stmtValues.push(data.File_Type);
          // 02/05/2019: Shivansh Subnani : Added No Value check not to store No Value in database
          if (data.DetailedValue == "No Value") {
            stmtValues.push(null);
          } else {
            stmtValues.push(data.DetailedValue);
          }
          if (data.OtherValue) {
            stmtValues.push(data.OtherValue);
          } else {
            stmtValues.push(null);
          }
          stmtValues.push(data.Show_In_Pdf != null ? data.Show_In_Pdf : 'true');
          stmtValues.push(data.AttachmentStatus != null ? data.AttachmentStatus : 'false');
          query.push(stmtValues);
          sqlBatchStmt.push(query);
        }
      }
    } catch (error) {
      this.logger.log(this.fileName, "getReportDataBatch", "Error: " + JSON.stringify(error.message));
    }
    return sqlBatchStmt;
  }


  /**
   *03-14-2019
   *Shivansh Subnani Checks if elementtype is listview or editablelistview then stringify the json else return same value
   * @param {*} data
   * @returns
   * @memberof LocalServiceProvider
   */
  getElementValue(data) {
    if (data.Value) {
      return data.ElementType == Enums.ElementType.ListView || data.ElementType == Enums.ElementType.EditableListView ? JSON.stringify(data.Value) : data.Value
    } else {
      return data.Value;
    }
  }



  private insertBatchData(sqlBatchStmt: any[], functionName) {
    return new Promise((resolve, reject) => {
      if (sqlBatchStmt.length > 0) {
        this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (res) => {
          resolve(true);
        }, (error) => {
          this.logger.log(this.fileName, functionName, "Error : " + error.message);
          this.dbctrl.printInvalidQuery(sqlBatchStmt);
          reject(new Error(error.message));
        });
      } else {
        resolve(true);
      }
    })
  }

  /**
   *@author: Prateek
   *22/01/2019
   *Common Funtion for batch process for cutomer db.
   */
  private insertBatchDataCustomerDB(sqlBatchStmt: any[], functionName) {
    return new Promise((resolve, reject) => {
      this.customerDbProvider.getDB().sqlBatch(sqlBatchStmt, (res) => {
        // this.logger.log(this.fileName, functionName, "Response :" + JSON.stringify(res));
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, functionName, "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    })
  }

  /**
   * Creates a query dynamically using the data as it is in the JSON Object
   * and inserts or replace the data using the query
   *
   * @private
   * @param {*} jsonObj
   * @param {*} tableName
   * @param {*} functionName
   * @returns
   * @memberof LocalServiceProvider
   */
  private insertJsonData(jsonObj, tableName, columnsToSkip, functionName) {
    let columnQuery = "", valueQuery = "", queryParams = [];
    let dataKeys = Object.keys(jsonObj);
    dataKeys.forEach((key) => {
      if (!columnsToSkip.find(col => col == key)) {
        columnQuery += key + ",";
        valueQuery += "?,"
        queryParams.push(jsonObj[key]);
      }
    });
    columnQuery = columnQuery.slice(0, -1);
    valueQuery = valueQuery.slice(0, -1);
    let query = `INSERT OR REPLACE INTO ${tableName} (${columnQuery}) Values (${valueQuery})`;
    return this.insertData(query, queryParams, functionName);
  }

  private getList(query, queryParams, functionName): Promise<JSON[]> {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, queryParams, ((tx, rs) => {
          let resultArray = [];
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              resultArray.push(item);
            }
          }
          resolve(resultArray);
        }), ((tx, error) => {
          //let message = "Error : " + JSON.stringify(error.message) + " for Query " + query + " And Query Params " + JSON.stringify(queryParams);
          // this.logger.log(this.fileName, functionName, message);
          reject(error);
        }));
      }, (error) => {
        this.logger.log(this.fileName, functionName, 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  private getListFormCustomerDB(query, queryParams, functionName) {
    return new Promise((resolve, reject) => {
      this.customerDbProvider.getDB().transaction((tx) => {
        tx.executeSql(query, queryParams, ((tx, rs) => {
          let resultArray = [];
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              resultArray.push(item);
            }
          }
          resolve(resultArray);
        }), ((tx, error) => {
          this.logger.log(this.fileName, functionName, "Error : " + JSON.stringify(error.message));
          reject(error);
        }));
      }, (error) => {
        this.logger.log(this.fileName, functionName, 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  //09/10/2018 Zohaib Khan: Getting list of languages which are true in MST_Languages table to generate fsr in that language
  getFSREnabledLanguages() {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        transaction.executeSql("SELECT * FROM MST_Languages where is_FSR_Languages == 'true' AND Sync_Status =='true' order by Lang_Name asc", [], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getActiveLanguages', "GET ACTIVE LANGUAGE ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getActiveLanguages', "GET ACTIVE LANGUAGE ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  //09/13/2018 Zohaib Khan: Getting Fsr based on attachment type and Task number
  getUnUploadedFSRTypeAttachment(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value: any = [];
        let sqlQuery = "SELECT File_Name FROM Attachment WHERE Task_Number==" + String(taskId) + " AND AttachmentType=='fsr' AND Attachment_Status=='0'";
        transaction.executeSql(sqlQuery, [], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getUnUploadedFSRTypeAttachment', "ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getUnUploadedFSRTypeAttachment', "ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  getAllFSRTypeAttachment(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value: any = [];
        let sqlQuery = "SELECT File_Name FROM Attachment WHERE Task_Number==" + String(taskId) + " AND AttachmentType=='fsr' GROUP BY File_Name";
        transaction.executeSql(sqlQuery, [], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getActiveLanguages', "GET ACTIVE LANGUAGE ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getActiveLanguages', "GET ACTIVE LANGUAGE ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }


  insertTaskChangeLog(responseList) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlInsert = "INSERT INTO TaskChangeLog(ID, CreatedTime, UpdatedTime, UpdatedByAccount, CreatedByAccount ,FieldJob, Technician, Timestamp, Status, Sync_Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        insertValues.push(responseList.ID);
        insertValues.push(responseList.CreatedTime);
        insertValues.push(responseList.UpdatedTime);
        insertValues.push(responseList.UpdatedByAccount);
        insertValues.push(responseList.CreatedByAccount);
        insertValues.push(responseList.FieldJob);
        insertValues.push(responseList.Technician);
        insertValues.push(responseList.Timestamp);
        insertValues.push(responseList.Status);
        insertValues.push(responseList.Sync_Status);
        transaction.executeSql(sqlInsert, insertValues, (tx, res) => {
          resolve(res);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'insertTaskChangeLog', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'insertTaskChangeLog', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  getTaskChangeLog(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        transaction.executeSql("SELECT * FROM TaskChangeLog WHERE FieldJob = ?", [taskId], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getTaskChangeLog', "ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getTaskChangeLog', "ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  getWorkFlowElementName(element) {
    let elementIDs = "";
    let data = JSON.parse(element.EventArgs).UniqueElementIDs;
    for (var k in data) { elementIDs = elementIDs + "," + data[k]; }
    elementIDs = elementIDs.slice(1)
    let query = "select COUNT(*) as count from ReportData where ElementID IN(" + elementIDs + ") AND VALUE =?";
    return this.getList(query, [element.Value], "getWorkFlowElementName");
  }

  //10-29-18 Radheshyam kumar Search customers using search modal.
  getFilteredData(params, tableName, check, LookUpAlias, LookUpAliasValue) {
    return new Promise((resolve, reject) => {
      this.customerDbProvider.getDB().transaction((transaction) => {
        let value: Array<any> = [];
        let query = "";
        try {
          let searchConditions = "";
          params.forEach((param, index) => {
            if (param.key) {
              if (index == 0) {
                searchConditions = searchConditions + " WHERE LOWER(" + param.key + ") LIKE LOWER('" + param.value + "%') ";
              } else {
                if (check) {
                  searchConditions = searchConditions + " AND LOWER(" + param.key + ") LIKE LOWER('" + param.value + "%')";
                } else {
                  searchConditions = searchConditions + " OR LOWER(" + param.key + ") LIKE LOWER('" + param.value + "%')";
                }
              }
            } else {
              // //console.log("param.key not exists");
            }
          })
          if (LookUpAlias != "LookupID") {
            query = "SELECT tbl." + LookUpAlias + " AS LookupID, tbl." + LookUpAliasValue + " As LookupValue, tbl.* FROM " + tableName + " tbl" + searchConditions + " LIMIT 50";
          } else {
            query = "SELECT * FROM " + tableName + " " + searchConditions;
          }
        } catch (error) {
          this.logger.log(this.fileName, "getFilteredData ", " Error while generating query: " + JSON.stringify(error.message));
        }
        transaction.executeSql(query, [], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, "getFilteredData ", " ERROR while executing query: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, "getFilteredData ", " ERROR in transaction: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  //10-31-18getDropDownData for customer search
  getDropdownList(table, lookUpIdAlias, LookUpAliasValue) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        let query = "SELECT dptbl." + lookUpIdAlias + " AS LookupID, dptbl." + LookUpAliasValue + " AS LookupValue FROM " + table + " dptbl";
        // //console.log(query);
        transaction.executeSql(query, [], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'Search modal dropdown', "ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getTaskChangeLog', "ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  //11-01-18 Radheshyam filter lookup values for search modal
  getLookupByTypeOnSearchModal(params, LookupType) {
    let queryParams = [LookupType, "Y"];
    let key = params[0].key;
    // Object.keys(params).map((param, i) => {
    //   if (i == 0) {
    //     key = param;
    //   }
    // })
    queryParams.push('%' + params[0].value + '%');
    // //console.log("SELECT * FROM Lookups WHERE LookupType = ? and IsActive = ? and " + key + " LIKE ? ORDER BY DisplayOrder asc", queryParams, "getLookupByTypeOnSearchModal");
    return this.getList("SELECT * FROM Lookups WHERE LookupType = ? and IsActive = ? and " + key + " LIKE ? ORDER BY DisplayOrder asc", queryParams, "getLookupByTypeOnSearchModal");
  }


  /**
   *
   *
   * @param {*} taskId
   * @returns
   * @memberof LocalServiceProvider
   */
  getAllTimeList(taskId) {
    let query: any;
    let params: any = [];
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        query = `SELECT T.*, (SELECT Time_Id FROM Time WHERE Original = T.Time_Id) As CurrentMobileId FROM Time T WHERE T.Task_Number = ?
        AND T.ResourceId = ? And T.isDeleted=? and IFNULL(T.Job_Type, '') != 'vacation'`;
        params = [taskId ? taskId.toString() : '', this.valueProvider.getResourceId(), false];
        //24-09-2019 Gaurav V - Removed condition to check picked time for every user.
        // if (this.valueProvider.getResourceId() == "0") {
        query += " AND T.isPicked = ?";
        params.push(true);
        //}
        transaction.executeSql(query, params, (tx, res) => {
          let value = [];
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          value.reverse();
          // this.logger.log(this.fileName,'getTimeList',"GET TIME DB ==========> " + JSON.stringify(value));
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getTimeList', "GET TIME SELECT ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getTimeList', "GET TIME TRANSACTION ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };


  async getAllExpenseList(taskId) {
    let query = "SELECT ex.*, (SELECT Expense_Id FROM Expense WHERE Original = ex.Expense_Id) As CurrentMobileId FROM Expense ex WHERE ex.Task_Number = ? AND ex.OracleDBID = ?";
    let queryParams = [taskId.toString(), this.valueProvider.getUserId()];
    let data = await this.getList(query, queryParams, "getAllExpenseList");
    data.reverse();
    return data;
  };

  getPendingTaskChangeLogs(taskId) {
    let query = `Select TC.*, TC.ID as UniqueMobileId, T.Street_Address as Address, T.End_Date as endDate, T.Start_Date as startDate,
    T.Customer_Name as Customer, T.Contact_Name as displayContactName, T.Email as displayEmail, U.Name as ContactName, U.Email,
    U.Time_Zone as timezone, T.Task_Number as FieldJobNumber, T.Job_Description as RequestSummary, T.Job_Description as FieldJobType
    from TaskChangeLog TC , Task T, User U where TC.Sync_Status = 'false' and TC.FieldJob = T.Task_Number and T.resourceid = U.ID
    and T.Task_Number = ?`;
    let queryParams = [taskId];
    return this.getList(query, queryParams, "getPendingTaskChangeLogs");
  };

  updateTaskChangeLogs(changeLogs) {
    let idArr = [];
    changeLogs.forEach(item => {
      idArr.push(item.ID);
    })
    let query = `UPDATE TaskChangeLog SET Sync_Status = 'true' WHERE ID in (${idArr.toString()})`;
    return this.insertData(query, [], "updateTaskChangeLogs");
  };

  //10/3/2018 Suraj Gorai: Getting login status
  getLoginStatus() {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT Login_Status FROM User Where Login_Status = 1", [], (tx, res) => {
          let rowLength = res.rows.length;
          if (rowLength > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
          this.logger.log(this.fileName, 'getLoginStatus', "GET App LoginStatus length: " + rowLength);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getLoginStatus', "GET App LoginStatus ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getLoginStatus', "GET App LoginStatus ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  /**
  * Saves list of Notes in DB as a Batch statement of Editable FSR
   *
   * @param {*} dataArray
   * @returns
   * @memberof LocalServiceProvider
   */
  getNotesBatch(dataArray): Array<Array<any>> {
    let sqlBatchStmt = [];
    for (let k in dataArray) {
      let data = dataArray[k];
      let stmtValues = [];

      // 02/04/2020 -- Mayur Varshney -- update query, add sync_status variable as true when fetching data from OSC

      let sqlUpdate: any[] = ["UPDATE Notes SET noteDefault = ?, Note_Type = (SELECT Value FROM NoteType where ID = ?), Note_Type_Id = ?, Date = ?, Created_By = ?, Notes = ?, Task_Number = ?, ResourceId = ?, OracleDBID = ?, Notes_Install_Base = ?, Sync_Status = ? WHERE Notes_Id = ?"];

      let sqlInsert: any[] = ["INSERT OR IGNORE INTO Notes (noteDefault, Note_Type, Note_Type_Id, Date, Created_By, Notes, Task_Number, ResourceId, OracleDBID, Notes_Install_Base, Sync_Status, Notes_Id)VALUES (?, (SELECT Value FROM NoteType where ID = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"];

      let Notes_type = data.Notes_type.replace(/ /g, "");
      let noteTypeId = Enums.Notes_Type_Id[Notes_type];
      stmtValues.push(null);
      stmtValues.push(noteTypeId);
      stmtValues.push(noteTypeId);
      stmtValues.push(new Date(data.MobileCreatedBy.replace(/'/g, "")));
      stmtValues.push(this.valueProvider.getUser().Name);
      stmtValues.push(data.Notes);
      stmtValues.push(data.Task_Number);
      stmtValues.push(this.valueProvider.getResourceId());
      stmtValues.push(this.valueProvider.getUserId());
      stmtValues.push(null);
      stmtValues.push("true");
      stmtValues.push(data.Mobile_Indicator && data.Mobile_Indicator != "" ? data.Mobile_Indicator : data.Notes_ID);

      sqlUpdate.push(stmtValues);
      sqlInsert.push(stmtValues);

      sqlBatchStmt.push(sqlUpdate);
      sqlBatchStmt.push(sqlInsert);
    }
    return sqlBatchStmt;
  }

  insertNotesListBatchDBCS(dataArray) {
    return new Promise((resolve, reject) => {
      let sqlBatchStmt = [];
      for (let k in dataArray) {
        let data = dataArray[k];
        let stmtValues = [];
        // 11/02/2018 -- Mayur Varshney --update Update/Insert query for standalone jobs
        // 02/04/2020 -- Mayur Varshney -- update query, add sync_status variable as true when fetching data from ATP
        let sqlInsert: any[] = ["INSERT OR IGNORE INTO Notes (noteDefault,Note_Type,Note_Type_Id,Date,Created_By,Notes,Task_Number,ResourceId,OracleDBID,Notes_Install_Base,Sync_Status,Notes_Id)VALUES (?,(SELECT Value FROM NoteType where ID = ?),?,?,?,?,?,?,?,?,?,?)"];
        stmtValues.push(data.noteDefault);
        stmtValues.push(data.note_type_id);
        stmtValues.push(data.note_type_id);
        stmtValues.push(moment(data.createddate).toDate());
        stmtValues.push(data.created_by);
        stmtValues.push(data.notes);
        stmtValues.push(data.task_number);
        stmtValues.push(this.valueProvider.getResourceId());
        stmtValues.push(this.valueProvider.getUserId());
        stmtValues.push(data.notes_install_base);
        stmtValues.push("true");
        stmtValues.push(data.notes_id);
        sqlInsert.push(stmtValues);
        sqlBatchStmt.push(sqlInsert);
      }
      //this.logger.log(this.fileName, 'insertNotesListBatch', "stmtValues :" + JSON.stringify(stmtValues));
      this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (res) => {
        // this.logger.log(this.fileName, 'insertNotesListBatch', "Response :" + JSON.stringify(res));
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, 'insertNotesListBatch', "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    })
  }

  /**
   * Saves list of Notes in DB as a Batch statement of Editable FSR
   *
   * @param {*} dataArray
   * @returns
   * @memberof LocalServiceProvider
   */
  getExpenseBatch(dataArray): Array<Array<any>> {
    let sqlBatchStmt = [];
    for (let k in dataArray) {
      let data = dataArray[k];
      let stmtValues = [];
      let sqlUpdate: any[] = ["UPDATE Expense SET expenseDefault = ?,Date = ?,Expense_Type = (SELECT Value FROM ExpenseType where  ID= ?),Expense_Type_Id = ?,Amount = ?,Currency = (SELECT Value FROM Currency where  ID= ?),Currency_Id = ?,Distance = ?,UOM = (SELECT Value FROM UOM where  ID= ?),UOM_Id = ?,Charge_Method = (SELECT Value FROM ChargeMethod where  ID= ?),Charge_Method_Id = ?,Justification = ?,Task_Number = ?,ResourceId = ?, OracleDBID = ?, Original = ?,DebriefStatus = ?,IsAdditional = ?, Sync_Status = ? WHERE Expense_Id = ? and Sync_Status = 'true'"];
      let sqlInsert: any[] = ["INSERT OR IGNORE INTO Expense (expenseDefault,Date,Expense_Type,Expense_Type_Id,Amount,Currency,Currency_Id,Distance,UOM,UOM_Id,Charge_Method,Charge_Method_Id,Justification,Task_Number,ResourceId, OracleDBID,Original,DebriefStatus,IsAdditional, Sync_Status, Expense_Id) VALUES ( ?,?,(SELECT Value FROM ExpenseType where  ID= ?),?,?,(SELECT Value FROM Currency where  ID= ?),?,?,(SELECT Value FROM UOM where  ID= ?),?,(SELECT Value FROM ChargeMethod where  ID= ?),?,?,?,?,?,?,?,?,?,?)"];

      // 10/16/2018 -- Mayur Varshney -- change isOriginal and isAdditional true/false on the basis of 1/0
      // 12/14/2018 -- Gurkirat Singh -- change isOriginal and isAdditional true/false on the basis of IsAdditional
      data.IsAdditional = data.IsAdditional == null ? false : (data.IsAdditional == '1' ? true : false);
      stmtValues.push(null);
      stmtValues.push(moment(data.Date).toDate());
      stmtValues.push(data.Expense_Item);
      stmtValues.push(data.Expense_Item);
      stmtValues.push(data.Ammount);
      stmtValues.push(data.Currencies);
      stmtValues.push(data.Currencies);
      stmtValues.push(data.Distance);
      stmtValues.push(data.UOM);
      stmtValues.push(data.UOM);
      stmtValues.push(data.ChargeMethod);
      stmtValues.push(data.ChargeMethod);
      //10/24/2018: Zohaib Khan Inserting Comments.
      stmtValues.push(data.Comments);
      stmtValues.push(data.Task);
      stmtValues.push(this.valueProvider.getResourceId());
      stmtValues.push(this.valueProvider.getUserId());
      stmtValues.push(data.OriginalMobileID);
      stmtValues.push(data.DebriefStatus);
      stmtValues.push(data.IsAdditional);
      stmtValues.push(true);
      stmtValues.push(data.Mobile_Indicator);

      sqlUpdate.push(stmtValues);
      sqlInsert.push(stmtValues);

      sqlBatchStmt.push(sqlUpdate);
      sqlBatchStmt.push(sqlInsert);
    }
    return sqlBatchStmt;
  }

  insertExpensesListBatchDBCS(dataArray) {
    return new Promise((resolve, reject) => {
      let sqlBatchStmt = [];
      for (let k in dataArray) {
        let data = dataArray[k];
        let stmtValues = [];
        let sqlUpdate: any[] = ["UPDATE Expense SET expenseDefault = ?,Date = ?,Expense_Type = (SELECT Value FROM ExpenseType where  ID= ?),Expense_Type_Id = ?,Amount = ?,Currency = (SELECT Value FROM Currency where  ID= ?),Currency_Id = ?,Distance = ?,UOM = (SELECT Value FROM UOM where  ID= ?),UOM_Id = ?,Charge_Method = (SELECT Value FROM ChargeMethod where  ID= ?),Charge_Method_Id = ?,Justification = ?,Task_Number = ?,ResourceId = ?, OracleDBID = ?,Original = ?,DebriefStatus = ?,IsAdditional = ?, Sync_Status = ? WHERE Expense_Id = ?"];
        let sqlInsert: any[] = ["INSERT OR IGNORE INTO Expense (expenseDefault,Date,Expense_Type,Expense_Type_Id,Amount,Currency,Currency_Id,Distance,UOM,UOM_Id,Charge_Method,Charge_Method_Id,Justification,Task_Number,ResourceId, OracleDBID,Original,DebriefStatus,IsAdditional, Sync_Status, Expense_Id) VALUES ( ?,?,(SELECT Value FROM ExpenseType where  ID= ?),?,?,(SELECT Value FROM Currency where  ID= ?),?,?,(SELECT Value FROM UOM where  ID= ?),?,(SELECT Value FROM ChargeMethod where  ID= ?),?,?,?,?,?,?,?,?,?,?)"];

        stmtValues.push(data.expensedefault);
        stmtValues.push(data.date);
        stmtValues.push(data.expense_type_id);
        stmtValues.push(data.expense_type_id);
        stmtValues.push(data.amount);
        stmtValues.push(data.currency_id);
        stmtValues.push(data.currency_id);
        stmtValues.push(data.distance);
        stmtValues.push(data.uom_id);
        stmtValues.push(data.uom_id);
        stmtValues.push(data.charge_method_id);
        stmtValues.push(data.charge_Method_id);
        //10/24/2018: Zohaib Khan Inserting Comments.
        stmtValues.push(data.justification);
        stmtValues.push(data.task_number);
        stmtValues.push(this.valueProvider.getResourceId());
        stmtValues.push(this.valueProvider.getUserId());
        stmtValues.push(data.original);
        stmtValues.push(data.debriefstatus);
        stmtValues.push(data.isadditional);
        stmtValues.push(true);
        stmtValues.push(data.expense_id);

        sqlUpdate.push(stmtValues);
        sqlInsert.push(stmtValues);
        sqlBatchStmt.push(sqlUpdate);
        sqlBatchStmt.push(sqlInsert);
      }
      //this.logger.log(this.fileName, 'insertExpensesListBatch', "stmtValues :" + JSON.stringify(stmtValues));
      this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (res) => {
        // this.logger.log(this.fileName, 'insertExpensesListBatch', "Response :" + JSON.stringify(res));
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, 'insertExpensesListBatchDBCS', "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    })
  }

  /**
   *  Saves list of Time in DB as a Batch statement of Editable FSR
   *
   * @param {*} dataArray
   * @returns
   * @memberof LocalServiceProvider
   */
  getTimeBatch(dataArray): Array<Array<any>> {
    // console.log(dataArray);
    let sqlBatchStmt = [];
    let fieldJobNameQuery = "(SELECT JobName FROM FieldJobName WHERE TaskCode= ?)";
    let chargeTypeQuery = "(SELECT Value FROM ChargeType where ID= ?)";
    let chargeMethodQuery = "(SELECT Value FROM ChargeMethod where ID= ?)";
    let workTypeQuery = "(SELECT Value FROM WorkType where ID= ?)";
    let itemQuery = "(SELECT Value FROM Item where ID= ?)";
    let shiftCodeQuery = "(SELECT ShiftCodeName FROM ShiftCode where Shift_Code_ID= ?)";
    for (let k in dataArray) {
      let data = dataArray[k];
      let stmtValues = [];
      let sqlUpdate: any[] = [`UPDATE Time  SET  timeDefault = ?, Field_Job_Name = ${fieldJobNameQuery}, Field_Job_Name_Id = ?,
        Charge_Type = ${chargeTypeQuery}, Charge_Type_Id = ?, Charge_Method = ${chargeMethodQuery}, Charge_Method_Id = ?,
        Work_Type = ${workTypeQuery}, Work_Type_Id = ?, Item = ${itemQuery}, Item_Id = ?, Description = ?, Time_Code = ?, Time_Code_Id = ?,
        Time_Code_Value = ?, Shift_Code = ${shiftCodeQuery}, Shift_Code_Id = ?, Shift_Code_Value = ${shiftCodeQuery}, Date = ?,
        Duration = ?, Comments = ?, Task_Number = ?, ResourceId = ?, OracleDBID = ?, Start_Time = ?, End_Time = ?,
        Service_Start_Date = ?, Service_End_Date = ?, Original = ?,
        IsAdditional = ?, DebriefStatus = ?, Sync_Status = ?, isDeleted = ? WHERE Time_Id = ? and Sync_Status = 'true'`];

      let sqlInsert: any[] = [`INSERT OR IGNORE INTO Time (timeDefault, Field_Job_Name, Field_Job_Name_Id, Charge_Type, Charge_Type_Id,
          Charge_Method, Charge_Method_Id, Work_Type, Work_Type_Id, Item, Item_Id, Description, Time_Code, Time_Code_Id, Time_Code_Value,
          Shift_Code, Shift_Code_Id, Shift_Code_Value, Date, Duration, Comments, Task_Number, ResourceId, OracleDBID, Start_Time, End_Time,
          Service_Start_Date, Service_End_Date, Original,
          IsAdditional, DebriefStatus, Sync_Status, isDeleted, Time_Id) VALUES (?, ${fieldJobNameQuery}, ?, ${chargeTypeQuery}, ?,
            ${chargeMethodQuery}, ?, ${workTypeQuery}, ?, ${itemQuery}, ?, ?, ?, ?, ?, ${shiftCodeQuery}, ?, ${shiftCodeQuery}, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`];
      // 10/16/2018 -- Mayur Varshney -- change isOriginal and isAdditional true/false on the basis of 1/0
      // 12/14/2018 -- Gurkirat Singh -- change isOriginal and isAdditional true/false on the basis of IsAdditional
      data.IsAdditional = data.IsAdditional == null ? false : (data.IsAdditional == '1' ? true : false);
      stmtValues.push(null);
      // TODO Zohaib : remove blank spaces...(REMOVED--- Zohaib Khan).
      //10/19/2018 Zohaib Khan: Inserting Field Job Name and Field Job Name Id in the time table.
      stmtValues.push(data.JobName);
      stmtValues.push(data.JobName);
      stmtValues.push(data.Charge_type);
      stmtValues.push(data.Charge_type);
      stmtValues.push(data.ChargeMethod);
      stmtValues.push(data.ChargeMethod);
      stmtValues.push(data.Work_Type);
      stmtValues.push(data.Work_Type);
      // 10/16/2018 -- Mayur Varshney -- push labor-item for Item Value
      stmtValues.push(parseInt(data.Labor_Item));
      // 10/16/2018 -- Mayur Varshney -- push labor-item for Item_Id
      stmtValues.push(data.Labor_Item);
      stmtValues.push(null);
      //10/19/2018 Zohaib Khan: Inserting time code and shift code values in the time table.
      stmtValues.push(data.OTShiftCodeName);
      stmtValues.push(data.OverTimeShiftCode);
      stmtValues.push(data.OTShiftCodeName);
      // 10/24/2018 Zohaib Khan: Updating shiftcode based on Id's.
      stmtValues.push(data.ShiftCode);
      stmtValues.push(data.ShiftCode);
      stmtValues.push(data.ShiftCode);
      stmtValues.push(moment(data.Start_Date).toDate());
      stmtValues.push(data.Duration);
      stmtValues.push(data.Comments);
      stmtValues.push(data.Task);
      stmtValues.push(this.valueProvider.getResourceId());
      stmtValues.push(this.valueProvider.getUserId());
      // 10/16/2018 -- Mayur Varshney -- push start time via moment from Start Date
      stmtValues.push(moment(data.Start_Date).format('HH:mm')); // start time
      // 10/16/2018 -- Mayur Varshney -- push end time via moment from End Date
      stmtValues.push(moment(data.End_Date).format('HH:mm')); // end time
      // 10/16/2018 -- Mayur Varshney -- push start Date after converting into Date type via moment from Start Date
      stmtValues.push(moment(data.Start_Date).toDate()); // service start date
      // 10/16/2018 -- Mayur Varshney -- push end Date after converting into Date type via moment from End Date
      stmtValues.push(moment(data.End_Date).toDate()); // service end date
      stmtValues.push(data.OriginalMobileID);
      stmtValues.push(data.IsAdditional);
      stmtValues.push(data.DebriefStatus);
      stmtValues.push(true);
      // 06/12/2019 --Zohaib Khan -- isDeleted ? should be after sync_status
      stmtValues.push(false); //isDeleted
      stmtValues.push(data.Mobile_Indicator);


      sqlUpdate.push(stmtValues);
      sqlInsert.push(stmtValues);

      sqlBatchStmt.push(sqlUpdate);
      sqlBatchStmt.push(sqlInsert);
    }
    return sqlBatchStmt;
  }

  insertTimeListBatchDBCS(dataArray) {
    let sqlBatchStmt = [];
    let OpCodesubQUery;
    let STcodesubquery;
    for (let k in dataArray) {

      let data = dataArray[k];
      if (data.resourceid == '0') {
        OpCodesubQUery = "SELECT OP_Code FROM MST_ActivityName where Id= ?"
        STcodesubquery = "?"
      }
      else {
        OpCodesubQUery = "SELECT Value FROM WorkType where ID= ?"
        STcodesubquery = "SELECT Value FROM Item where ID= ?"
      }
      let stmtValues = [];
      let sqlUpdate: any[] = ["UPDATE Time  SET  timeDefault = ?, Field_Job_Name = (SELECT JobName FROM FieldJobName WHERE TaskCode= ?), Field_Job_Name_Id = ?, Charge_Type = (SELECT Value FROM ChargeType where ID= ?), Charge_Type_Id = ?, Charge_Method = (SELECT Value FROM ChargeMethod where ID= ?), Charge_Method_Id = ?, Work_Type = (" + OpCodesubQUery + "), Work_Type_Id = ?, Item = (" + STcodesubquery + "), Item_Id = ?, Description = ?, Time_Code = ?, Time_Code_Id = ?, Time_Code_Value = ?, Shift_Code =  (SELECT ShiftCodeName FROM ShiftCode where Shift_Code_ID= ?), Shift_Code_Id = ?, Shift_Code_Value = (SELECT ShiftCodeName FROM ShiftCode where Shift_Code_ID= ?), Date = ?, Duration = ?, Comments = ?, Task_Number = ?, ResourceId = ?, OracleDBID = ?, Start_Time = ?, End_Time = ?, Service_Start_Date = ?, Service_End_Date = ?, Original = ?, IsAdditional = ?, DebriefStatus = ?,isPicked=?,ModifiedDate=?,EntryDate=?,SerialNumber=?,TagNumber=?, Job_Number =? , DB_SyncStatus = ? ,  Job_Type = ?,isDeleted=?,isSubmitted=? WHERE Time_Id = ?"];

      let sqlInsert: any[] = ["INSERT OR IGNORE INTO Time (timeDefault, Field_Job_Name, Field_Job_Name_Id, Charge_Type, Charge_Type_Id, Charge_Method, Charge_Method_Id, Work_Type, Work_Type_Id, Item, Item_Id, Description, Time_Code, Time_Code_Id, Time_Code_Value, Shift_Code, Shift_Code_Id, Shift_Code_Value, Date, Duration, Comments, Task_Number, ResourceId, OracleDBID, Start_Time, End_Time, Service_Start_Date, Service_End_Date, Original, IsAdditional, DebriefStatus,isPicked,ModifiedDate,EntryDate,SerialNumber,TagNumber, Job_Number,DB_SyncStatus,Job_Type,isDeleted,isSubmitted) VALUES (?, (SELECT JobName FROM FieldJobName WHERE TaskCode= ?), ?, (SELECT Value FROM ChargeType where ID= ?), ?, (SELECT Value FROM ChargeMethod where ID= ?), ?, (" + OpCodesubQUery + "), ?, ( " + STcodesubquery + "), ?, ?, ?, ?, ?, (SELECT ShiftCodeName FROM ShiftCode where Shift_Code_ID= ?), ?, (SELECT ShiftCodeName FROM ShiftCode where Shift_Code_ID= ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?)"];

      stmtValues.push(data.timeDefault);
      stmtValues.push(data.field_job_name_id);
      stmtValues.push(data.field_job_name_id);
      stmtValues.push(data.charge_type_id);
      stmtValues.push(data.charge_type_id);
      stmtValues.push(data.charge_method_id);
      stmtValues.push(data.charge_method_id);
      stmtValues.push(data.work_type_id);
      stmtValues.push(data.work_type_id);
      if (data.resourceid == '0') {
        stmtValues.push(data.item);
      }
      else {
        stmtValues.push(parseInt(data.item_id));
      }
      stmtValues.push(data.item_id);
      stmtValues.push(null);
      //10/19/2018 Zohaib Khan: Inserting time code and shift code values in the time table.
      stmtValues.push(data.time_code);
      stmtValues.push(data.time_code_id);
      stmtValues.push(data.time_code_value);
      // 10/24/2018 Zohaib Khan: Updating shiftcode based on Id's.
      stmtValues.push(data.shift_code);
      stmtValues.push(data.shift_code_id);
      stmtValues.push(data.shift_code_value);
      stmtValues.push(moment(data.date).toDate());
      stmtValues.push(data.duration);
      stmtValues.push(data.comments);
      stmtValues.push(data.task_number);
      stmtValues.push(this.valueProvider.getResourceId());
      stmtValues.push(this.valueProvider.getUserId());
      // 10/16/2018 -- Mayur Varshney -- push start time via moment from Start Date
      stmtValues.push(data.start_time); // start time
      // 10/16/2018 -- Mayur Varshney -- push end time via moment from End Date
      stmtValues.push(data.end_time); // end time
      // 10/16/2018 -- Mayur Varshney -- push start Date after converting into Date type via moment from Start Date
      stmtValues.push(moment(data.service_start_date).toDate()); // service start date
      // 10/16/2018 -- Mayur Varshney -- push end Date after converting into Date type via moment from End Date
      stmtValues.push(moment(data.service_end_date).toDate()); // service end date
      stmtValues.push(data.original);
      stmtValues.push(data.isadditional);
      stmtValues.push(data.debriefstatus);
      stmtValues.push(data.ispicked == null ? 'true' : data.ispicked);
      stmtValues.push(moment(data.ModifiedDate).toDate());
      stmtValues.push(moment(data.entrydate).format('YYYY-MM-DD'));
      stmtValues.push(data.serialnumber);
      stmtValues.push(data.tagnumber);
      stmtValues.push(data.job_number);
      stmtValues.push(data.sync_status);
      stmtValues.push(data.job_type);
      stmtValues.push("false");
      stmtValues.push("true");
      stmtValues.push(data.time_id);

      sqlInsert.push(stmtValues);
      sqlUpdate.push(stmtValues);
      sqlBatchStmt.push(sqlUpdate);
      sqlBatchStmt.push(sqlInsert);
    }
    return this.insertBatchData(sqlBatchStmt, "insertTimeListBatchDBCS");
  }

  // 04/02/2019 -- Mayur Varshney -- remodified code for insert or update material list data
  getMaterialBatch(dataArray): Array<Array<any>> {
    let sqlBatchStmt = [];
    for (let k in dataArray) {
      let data = dataArray[k];
      let stmtValues = [];
      if (data) {
        let sqlUpdate: any[] = ["UPDATE MST_Material SET Material_Id = ?, Charge_Type = (SELECT Value FROM ChargeMethod where ID= ?), Charge_Type_Id = ?, Description = ?, ItemName = ?,  Product_Quantity = ?, Task_Number = ?, ResourceId = ?, UOM = ?, Serial_In = ?, Serial_Out = ?, DebriefStatus = ?, IsAdditional = ?, OracleDBID = ?, Serial_Number = ?, materialDefault = ?, Sync_Status = ?, Original = ? WHERE Material_Serial_Id = ? and Sync_Status = 'true'"];

        let sqlInsert: any[] = ["INSERT OR IGNORE INTO MST_Material (Material_Id, Charge_Type, Charge_Type_Id, Description, ItemName, Product_Quantity, Task_Number, ResourceId, UOM, Serial_In, Serial_Out, DebriefStatus, IsAdditional, OracleDBID, Serial_Number, materialDefault, Sync_Status, Original, Material_Serial_Id) VALUES (?, (SELECT Value FROM ChargeMethod where ID= ?),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"]

        stmtValues.push(data.MaterialId);
        stmtValues.push(data.ChargeMethod);
        stmtValues.push(data.ChargeMethod);
        stmtValues.push(data.Item_Description);
        stmtValues.push(data.Item);
        stmtValues.push(data.Product_Quantity);
        stmtValues.push(data.Task);
        stmtValues.push(this.valueProvider.getResourceId());
        stmtValues.push('EA');
        stmtValues.push(data.Serialin);
        stmtValues.push(data.SerialOut);
        stmtValues.push(data.DebriefStatus);
        stmtValues.push(data.IsAdditional == '1' ? true : false);
        stmtValues.push(this.valueProvider.getUserId());
        stmtValues.push(data.SerialNumber);
        stmtValues.push(null);
        stmtValues.push(true);
        stmtValues.push(data.OriginalMobileID);
        stmtValues.push(data.Mobile_Indicator);
        sqlUpdate.push(stmtValues);
        sqlInsert.push(stmtValues);
        sqlBatchStmt.push(sqlUpdate);
        sqlBatchStmt.push(sqlInsert);
      }
    }
    return sqlBatchStmt;
    // return this.insertBatchData(sqlBatchStmt, 'insertMaterialListBatch');
  }

  // 05/06/2019 -- Mayur Varshney -- remodified code for insert or update material list data for DBCS
  insertMaterialListBatchDBCS(dataArray) {
    let sqlBatchStmt = [];
    for (let k in dataArray) {
      let data = dataArray[k];
      let stmtValues = [];
      if (data) {
        let sqlUpdate: any[] = ["UPDATE MST_Material SET Material_Id = ?, Charge_Type = (SELECT Value FROM ChargeMethod where ID= ?), Charge_Type_Id = ?, Description = ?, ItemName = ?,  Product_Quantity = ?, Task_Number = ?, ResourceId = ?, UOM = ?, Serial_In = ?, Serial_Out = ?, DebriefStatus = ?, IsAdditional = ?, OracleDBID = ?, Serial_Number = ?, materialDefault = ?, Sync_Status = ? WHERE Material_Serial_Id = ?"];

        let sqlInsert: any[] = ["INSERT OR IGNORE INTO MST_Material (Material_Id, Charge_Type, Charge_Type_Id, Description, ItemName, Product_Quantity, Task_Number, ResourceId, UOM, Serial_In, Serial_Out, DebriefStatus, IsAdditional, OracleDBID, Serial_Number, materialDefault, Sync_Status, Material_Serial_Id) VALUES (?, (SELECT Value FROM ChargeMethod where ID= ?),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"]

        stmtValues.push(data.materialid)
        stmtValues.push(data.charge_type_id);
        stmtValues.push(data.charge_type_id);
        stmtValues.push(data.description);
        stmtValues.push(data.itemname);
        stmtValues.push(data.production_quantity);
        stmtValues.push(data.task_number);
        stmtValues.push(this.valueProvider.getResourceId() ? this.valueProvider.getResourceId() : null);
        stmtValues.push('EA');
        stmtValues.push(data.serial_in);
        stmtValues.push(data.serial_out);
        stmtValues.push(data.debriefstatus);
        stmtValues.push(data.isadditional == 'true' ? true : false);
        stmtValues.push(this.valueProvider.getUserId());
        stmtValues.push(data.serial_number);
        stmtValues.push(null);
        stmtValues.push(true);
        stmtValues.push(data.material_serial_id);
        sqlUpdate.push(stmtValues);
        sqlInsert.push(stmtValues);
        sqlBatchStmt.push(sqlUpdate);
        sqlBatchStmt.push(sqlInsert);
      }
    }
    return this.insertBatchData(sqlBatchStmt, 'insertMaterialListBatch');
  }

  getAllAttachmentList(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        transaction.executeSql("SELECT * FROM Attachment WHERE Task_Number = ? AND ResourceId = ?", [taskId.toString(), this.valueProvider.getResourceId()], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
          // this.logger.log(this.fileName,'getAttachmentList',"GET ATTACHMENT DB ==========> " + JSON.stringify(value));
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getAttachmentList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getAttachmentList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  /**
   * Perform update and insert query operation for Engineer table
   * @param {*} tasklist - insert/update data of Engineer table getting from taskList
   * @memberof LocalServiceProvider
   * @author Mayur Varshney- 10/23/2018
   */
  getEngineerSignatureQuery(data) {
    let sqlBatchStmt = [];
    if (data.Task_Status_ID == Enums.Jobstatus.Debrief_Declined || data.Task_Status_ID == Enums.Jobstatus.Debrief_In_Progress) {
      let stmtInsertValues = [];
      let stmtUpdateValue = [];
      let sqlInsert: any[] = ["INSERT OR IGNORE INTO Engineer (Engineer_Id, Sign_File_Path, File_Name, Task_Number, ResourceId, Engg_Sign_Time, Sync_Status, OracleDBID) VALUES (?,?,?,?,?,?,?,?)"];
      stmtInsertValues.push(data.Task_Number);
      stmtInsertValues.push(data.Emerson_Signature ? data.Emerson_Signature : null);
      stmtInsertValues.push(data.File_Name ? data.File_Name : null);
      stmtInsertValues.push(data.Task_Number);
      stmtInsertValues.push(this.valueProvider.getResourceId());
      stmtInsertValues.push(data.Emerson_Signature_Timestamp ? moment(data.Emerson_Signature_Timestamp).toDate() : null);
      stmtInsertValues.push(true);
      stmtInsertValues.push(this.valueProvider.getUserId());
      sqlInsert.push(stmtInsertValues);

      let sqlUpdate: any[] = ["UPDATE Engineer SET Sign_File_Path = ?, Engg_Sign_Time = ?, Sync_Status = ? WHERE Engineer_Id = ? and Sync_Status = 'true'"];
      stmtUpdateValue.push(data.Emerson_Signature ? data.Emerson_Signature : null);
      stmtUpdateValue.push(data.Emerson_Signature_Timestamp ? moment(data.Emerson_Signature_Timestamp).toDate() : null);
      stmtUpdateValue.push(true);
      stmtUpdateValue.push(data.Task_Number);
      sqlUpdate.push(stmtUpdateValue);

      sqlBatchStmt.push(sqlInsert);
      sqlBatchStmt.push(sqlUpdate);
    }
    return sqlBatchStmt;
  }

  /**
   * Perform update and insert query operation for Customer table
   * @param {*} tasklist - insert/update data of Customer table getting from taskList
   * @memberof LocalServiceProvider
   * @author Mayur Varshney- 10/23/2018
   */
  getCustomerSignatureQuery(data) {
    let sqlBatchStmt = [];
    try {
      if (data && data.Task_Status_ID == Enums.Jobstatus.Debrief_Declined || data.Task_Status_ID == Enums.Jobstatus.Debrief_In_Progress) {
        let stmtInsertValues = [];
        let stmtUpdateValue = [];
        let sqlInsert: any[] = ["INSERT OR IGNORE INTO Customer (Customer_Id, Customer_Name, Job_responsibilty, Email, Task_Number, isCustomerSignChecked, ResourceId, Cust_Sign_File, Cust_Sign_Time, Sync_Status, OracleDBID)VALUES (?,?,?,?,?,?,?,?,?,?,?)"];
        stmtInsertValues.push(data.Task_Number);
        stmtInsertValues.push(data.Customer_Representative_Name ? data.Customer_Representative_Name : null);
        stmtInsertValues.push(data.Cust_Rep_Job_Responsibility ? data.Cust_Rep_Job_Responsibility : null);
        stmtInsertValues.push(data.Customer_Representative_Email ? data.Customer_Representative_Email : null);
        stmtInsertValues.push(data.Task_Number);
        stmtInsertValues.push(data.Customer_Signature ? 'false' : 'true');
        stmtInsertValues.push(this.valueProvider.getResourceId());
        stmtInsertValues.push(data.Customer_Signature ? data.Customer_Signature : null);
        stmtInsertValues.push(data.Customer_Signature_Timestamp ? moment(data.Customer_Signature_Timestamp).toDate() : null);
        stmtInsertValues.push(true);
        stmtInsertValues.push(this.valueProvider.getUserId());
        sqlInsert.push(stmtInsertValues);

        let sqlUpdate: any[] = ["UPDATE Customer SET Cust_Sign_File = ?, Cust_Sign_Time = ?, Sync_Status = ?, Customer_Name = ?, Job_responsibilty = ?, Email = ?, isCustomerSignChecked = ? WHERE Customer_Id = ? and Sync_Status = 'true'"];
        stmtUpdateValue.push(data.Customer_Signature ? data.Customer_Signature : null);
        stmtUpdateValue.push(data.Customer_Signature_Timestamp ? moment(data.Customer_Signature_Timestamp).toDate() : null);
        stmtUpdateValue.push(true);
        stmtUpdateValue.push(data.Customer_Representative_Name ? data.Customer_Representative_Name : null);
        stmtUpdateValue.push(data.Cust_Rep_Job_Responsibility ? data.Cust_Rep_Job_Responsibility : null);
        stmtUpdateValue.push(data.Customer_Representative_Email ? data.Customer_Representative_Email : null);
        stmtUpdateValue.push(data.Customer_Signature ? 'false' : 'true');
        stmtUpdateValue.push(data.Task_Number);
        sqlUpdate.push(stmtUpdateValue);

        sqlBatchStmt.push(sqlInsert);
        sqlBatchStmt.push(sqlUpdate);
      }
    } catch (error) {
      this.logger.log(this.fileName, 'insertOrUpdateCustomerSignature', "Error caught: " + JSON.stringify(error.message));
    }
    return sqlBatchStmt;
  }

  saveSignatureDBCS(dataArray) {
    let sqlBatchStmt = [];
    for (let k in dataArray) {
      let data = dataArray[k];
      sqlBatchStmt = sqlBatchStmt.concat(this.getEngineerSignatureQueryDBCS(data));
      sqlBatchStmt = sqlBatchStmt.concat(this.getCustomerSignatureQueryDBCS(data));
    }
    return this.insertBatchData(sqlBatchStmt, "saveSignatureDBCS");
  }

  /**
   *@authorPrateek 02/14/2019
   *Insert ar update engineer signature from dbcs to internal database on sync
   * @param {*} dataArray
   * @returns
   * @memberof LocalServiceProvider
   */
  getEngineerSignatureQueryDBCS(data) {
    let sqlBatchStmt = [];
    let stmtInsertValues = [];
    let sqlUpdate: any[] = ["UPDATE Engineer SET Sign_File_Path = ?, Engg_Sign_Time = ?, Sync_Status = ?, File_Name = ?, Task_Number = ?, ResourceId = ?, followUp = ?, salesQuote = ?, salesVisit = ?, salesLead = ?,OracleDBID=? WHERE Engineer_Id = ?"];
    let sqlInsert: any[] = ["INSERT OR IGNORE INTO Engineer (Sign_File_Path, Engg_Sign_Time, Sync_Status, File_Name, Task_Number, ResourceId,followUp,salesQuote,salesVisit,salesLead,OracleDBID, Engineer_Id)VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"];

    stmtInsertValues.push(data.engg_sign_file ? data.engg_sign_file : null);
    stmtInsertValues.push(data.engg_sign_time);
    stmtInsertValues.push(true);
    stmtInsertValues.push(data.file_name ? data.file_name : null);
    stmtInsertValues.push(parseInt(data.task_number));
    stmtInsertValues.push(this.valueProvider.getResourceId());
    stmtInsertValues.push(data.followup);
    stmtInsertValues.push(data.salesquote);
    stmtInsertValues.push(data.salesvisit);
    stmtInsertValues.push(data.saleslead);
    stmtInsertValues.push(this.valueProvider.getUserId());
    stmtInsertValues.push(data.task_number);
    sqlInsert.push(stmtInsertValues);
    sqlUpdate.push(stmtInsertValues);
    sqlBatchStmt.push(sqlInsert);
    sqlBatchStmt.push(sqlUpdate);
    return sqlBatchStmt;
  }

  /**
   *@authorPrateek 02/14/2019
   *Insert ar update customer signature from dbcs to internal database on sync
   * @param {*} dataArray
   * @returns
   * @memberof LocalServiceProvider
   */
  getCustomerSignatureQueryDBCS(data) {
    let sqlBatchStmt = [];
    let stmtInsertValues = [];
    let sqlUpdate: any[] = ["UPDATE Customer SET Cust_Sign_File = ?, Cust_Sign_Time = ?, Sync_Status = ?, Customer_Name = ?, Job_responsibilty = ?, Email = ?, isCustomerSignChecked = ?,Task_Number=?,ResourceId=?,Annuel_PdP=?,Specific_PdP=?,Working_license=?,Emerson_Safety=?,Home_Security=?,do_not_survey=?,OracleDBID=? WHERE Customer_Id = ?"];
    let sqlInsert: any[] = ["INSERT OR IGNORE INTO Customer (Cust_Sign_File,Cust_Sign_Time,Sync_Status,Customer_Name,Job_responsibilty,Email,isCustomerSignChecked, Task_Number, ResourceId,Annuel_PdP,Specific_PdP,Working_license,Emerson_Safety,Home_Security,do_not_survey,OracleDBID,Customer_Id)VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"];
    stmtInsertValues.push(data.cust_sign_file);
    stmtInsertValues.push(data.cust_sign_time ? moment(data.Cust_Sign_Time).toDate() : null);
    stmtInsertValues.push(true);
    stmtInsertValues.push(data.customer_Name ? data.customer_Name : null);
    stmtInsertValues.push(data.job_responsibilty ? data.job_responsibilty : null);
    stmtInsertValues.push(data.email ? data.email : null);
    stmtInsertValues.push(data.iscustomersignchecked);
    stmtInsertValues.push(data.task_number);
    stmtInsertValues.push(this.valueProvider.getResourceId());
    stmtInsertValues.push(data.annuel_pdp);
    stmtInsertValues.push(data.specific_pdp);
    stmtInsertValues.push(data.working_license);
    stmtInsertValues.push(data.emerson_safety);
    stmtInsertValues.push(data.home_security);
    stmtInsertValues.push(data.do_not_survey);
    stmtInsertValues.push(this.valueProvider.getUserId());
    stmtInsertValues.push(data.task_number);
    sqlInsert.push(stmtInsertValues);
    sqlUpdate.push(stmtInsertValues);
    sqlBatchStmt.push(sqlInsert);
    sqlBatchStmt.push(sqlUpdate);
    return sqlBatchStmt;
  }

  updateExpenseflagInTask(responseList) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE Task SET FSR_PrintExpenseComplete = ?, FSR_PrintExpenseOnSite = ? WHERE Task_Number = ?";
        insertValues.push(responseList.FSR_PrintExpenseComplete);
        insertValues.push(responseList.FSR_PrintExpenseOnSite);
        insertValues.push(responseList.Task_Number);
        //this.logger.log(this.fileName,'function',"TASK UPDATE VALUES =====> " + insertValues);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          //this.logger.log(this.fileName,'function',"TASK ROW AFFECTED: " + res.rowsAffected);
          resolve(res);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateExpenseflagInTask', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'updateExpenseflagInTask', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  // TODO: update should be done based on uinque mobile id and instead of single it should be batch, sync status 'true';
  async updateUploadedAttachmentStatus(attachments) {
    // return new Promise((resolve, reject) => {
    try {
      let sqlBatchStmt = [];
      for (let i = 0; i < attachments.length; i++) {
        let query = [];
        query.push("UPDATE Attachment SET Sync_Status = ? WHERE File_Name = ? AND Task_Number = ?");
        let values = [
          attachments[i].Sync_Status ? attachments[i].Sync_Status : false,
          attachments[i].FileName,
          attachments[i].taskId
        ];
        query.push(values);
        sqlBatchStmt.push(query);
      }
      return (this.insertBatchData(sqlBatchStmt, "updateUploadedAttachmentStatus"));
    } catch (error) {
      this.logger.log(this.fileName, 'updateUploadedAttachmentStatus', "ATTACHMENT UPDATE TRANSACTION ERROR: " + JSON.stringify(error.message));
      throw error;
    }
    // });
  };
  /**
   * 11/01/2018 - Perform insert or replace query operation for Task table
   * @param {*} tasklist - insert/replace data in Task table getting from Submitted Report as currentReport
   * @memberof LocalServiceProvider
   * @author Mayur Varshney
   */
  insertReportDataInTask(currentReport, jobFlow) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let stmtValues = [];
        // 04/29/2019 -- Mayur Varshney -- insert or replace DebriefSubmissionDate in taskTable
        // 05-27-2019 Gurkirat Singh - Below Query will now only insert task and will not update it as the update will happen on New Repair Report Page
        let sqlInsert = "INSERT OR IGNORE INTO Task (Task_Number, Sync_Status, IsStandalone, Type, Job_Number, Task_Status, Start_Date, End_Date, ResourceId, OracleDBID, Project_Number, SR_ID, Selected_Process, StatusID, ReportID, Customer_Name, Street_Address, Address1, Address2, City, State, Country, Zip_Code, Business_Group, DebriefSubmissionDate)VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        stmtValues.push(currentReport.ReportID_Mobile);
        let taskobj = this.valueProvider.getTask();
        taskobj = taskobj ? taskobj : {};
        stmtValues.push(taskobj.Sync_Status ? taskobj.Sync_Status : 'true');
        stmtValues.push(true);
        stmtValues.push('STANDALONE');
        stmtValues.push(currentReport.JobID ? currentReport.JobID : null);
        stmtValues.push(taskobj.Task_Status ? taskobj.Task_Status : 'Debrief Started');
        stmtValues.push(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
        stmtValues.push(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
        stmtValues.push(this.valueProvider.resourceId ? this.valueProvider.resourceId : '');
        stmtValues.push(this.valueProvider.getUserId());
        stmtValues.push(currentReport.Project_Number ? currentReport.Project_Number : '');
        stmtValues.push(currentReport.SR_ID ? currentReport.SR_ID : '');
        //11/12/2018 -- Mayur Varshney -- update selected process in Task
        stmtValues.push(jobFlow);
        stmtValues.push(Enums.Jobstatus.Debrief_Started);
        // 11/12/2018 -- Mayur Varshney -- insert ReportId into task table
        stmtValues.push(currentReport.ReportID_Mobile);
        // 11/14/2018 -- Mayur Varshney -- insert full address with customer name
        // todo -- Mayur Varshney -- remove static values
        stmtValues.push(currentReport.Customer ? currentReport.Customer : '');
        stmtValues.push(currentReport.Street_Address ? currentReport.Street_Address : '');
        stmtValues.push(currentReport.Address1 ? currentReport.Address1 : '');
        stmtValues.push(currentReport.Address2 ? currentReport.Address2 : '');
        stmtValues.push(currentReport.City ? currentReport.City : '');
        stmtValues.push(currentReport.State ? currentReport.State : '');
        stmtValues.push(currentReport.Country ? currentReport.Country : '');
        stmtValues.push(currentReport.Zip_Code ? currentReport.Zip_Code : '');
        stmtValues.push(currentReport.Business_Group);
        stmtValues.push(currentReport.DebriefSubmissionDate ? currentReport.DebriefSubmissionDate : null);
        transaction.executeSql(sqlInsert, stmtValues, (tx, res) => {
          resolve(true);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'insertReportDataInTask', "ERROR: " + JSON.stringify(error.message));
          resolve(false);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'insertReportDataInTask', "TRANSACTION ERROR: " + JSON.stringify(error.message));
        resolve(false);
      });
    });
  }

  /**
   * 05-27-2019 Gurkirat Singh - Perform replace query operation for Task table
   *
   * @param {*} currentReport
   * @returns
   * @memberof LocalServiceProvider
   */
  updateReportDataInTask(currentReport) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let stmtValues = [];
        // 04/29/2019 -- Mayur Varshney -- insert or replace DebriefSubmissionDate in taskTable
        let sqlInsert = "UPDATE Task SET Customer_Name = ?, Street_Address = ?, Address1 = ?, Address2 = ?, City = ?, State = ?, Country = ?, Zip_Code = ? WHERE Task_Number = ?";
        let taskobj = this.valueProvider.getTask();
        taskobj = taskobj ? taskobj : {};
        stmtValues.push(currentReport.Customer ? currentReport.Customer : '');
        stmtValues.push(currentReport.Street_Address ? currentReport.Street_Address : '');
        stmtValues.push(currentReport.Address1 ? currentReport.Address1 : '');
        stmtValues.push(currentReport.Address2 ? currentReport.Address2 : '');
        stmtValues.push(currentReport.City ? currentReport.City : '');
        stmtValues.push(currentReport.State ? currentReport.State : '');
        stmtValues.push(currentReport.Country ? currentReport.Country : '');
        stmtValues.push(currentReport.Zip_Code ? currentReport.Zip_Code : '');
        stmtValues.push(currentReport.ReportID_Mobile);
        transaction.executeSql(sqlInsert, stmtValues, (tx, res) => {
          resolve(true);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateReportDataInTask', "ERROR: " + JSON.stringify(error.message));
          resolve(false);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateReportDataInTask', "TRANSACTION ERROR: " + JSON.stringify(error.message));
        resolve(false);
      });
    });
  }

  /**
   * 11/02/2018 - get IsStandalone value from Task table
   * @param {*} taskNumber - get IsStandalone from Task table
   * @memberof LocalServiceProvider
   * @author Mayur Varshney
   */
  IsStandaloneJob(taskNumber) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let sqlQuery = "SELECT * FROM Task where IsStandalone = 'true' AND Task_Number = ?";
        transaction.executeSql(sqlQuery, [taskNumber], (tx, res) => {
          resolve(res.rows);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'IsStandaloneJob', "ERROR: " + JSON.stringify(error.message));
          resolve(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'IsStandaloneJob', "TRANSACTION ERROR: " + JSON.stringify(error.message));
        resolve(error);
      });
    });
  }
  /**
   * 11/02/2018 - update selected Process value in task Task table
   * @param {*} taskNumber - get taskNumber from taskObject
   * @memberof LocalServiceProvider
   * @author Mayur Varshney
   */
  // updateSelectedProcess(selectedProcess, taskObject) {
  //   return new Promise((resolve, reject) => {
  //     this.dbctrl.getDB().transaction((transaction) => {
  //       let sqlUpdate = "UPDATE Task SET Selected_Process = ? WHERE Task_Number = ?";
  //       transaction.executeSql(sqlUpdate, [selectedProcess, taskObject.Task_Number], (tx, res) => {
  //         resolve(res);
  //       }, (tx, error) => {
  //         this.logger.log(this.fileName, 'updateSelectedProcess', "UPDATE ERROR: " + JSON.stringify(error.message));
  //         reject(error);
  //       });
  //     }, (error) => {
  //       this.logger.log(this.fileName, 'updateSelectedProcess', "UPDATE TRANSACTION ERROR: " + JSON.stringify(error.message));
  //       reject(error);
  //     });
  //   });
  // }

  /* Perform update Safety_Check in task table
  * @param {*} tasklist - getting boolean value by safetyCheck
  * @memberof LocalServiceProvider
  * @author Mayur Varshney- 11/26/2018
  */
  updateSafetyCheck(safetyCheck) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let sqlUpdate = "UPDATE Task SET Safety_Check = ? WHERE Task_Number = ?";
        transaction.executeSql(sqlUpdate, [safetyCheck, this.valueProvider.getTaskId()], (tx, res) => {
          resolve(res);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateTaskSubmitStatus', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateTaskSubmitStatus', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  /**
   *Gets the list of reports based on logged in userid and current ReportID.
   * 11/12/2018 -- Mayur Varshney
   * @param {*} userId
   * @returns
   * @memberof LocalServiceProvider
   */
  //02-01-2018 Radheshyam kumar Added customer db for mst_customer access.
  public getReportByID(userId, reportID) {
    // return new Promise((resolve, reject) => {
    // 01-10-2019 -- Mansi Arora -- same query as in getReports without standalone check
    // let query = "Select (SELECT WorkFlowGroupID FROM MST_Product WHERE ProductID = "
    //   + "(SELECT Value FROM ReportData WHERE ElementID = 130111 AND ReportID_Mobile = RD.ReportID_Mobile)) AS ReviewWorkFlowGroupID,"
    //   + "(SELECT WorkFlowID FROM WorkFlow WHERE WorkFlowGroupID = (SELECT WorkFlowGroupID FROM MST_Product WHERE ProductID = "
    //   + "(SELECT Value FROM ReportData WHERE ElementID = 130111 AND ReportID_Mobile = RD.ReportID_Mobile)) ORDER BY DisplayOrder DESC LIMIT 1) AS ReviewWorkFlowID, "
    //   + "We.ElementName, "
    //   + "Case When We.ElementName='BusinessGroup' then (Select BusinessGroupName from BusinessGroup where BusinessGroupID=RD.Value) "
    //   + "When We.ElementName='Customer' then RD.DetailedValue"
    //   + " else RD.Value end as Value,CASE WHEN We.ElementName = 'BusinessGroup' "
    //   + "THEN(  SELECT BusinessGroupID FROM BusinessGroup  WHERE BusinessGroupID = RD.Value  )  ELSE null   END AS BGID,SR.IsStandalone,SR.CreatedBy,SR.CreatedDate,SR.ModifiedBy,SR.ModifiedDate, SR.ReportID_Mobile, SR.ReportID, SR.Status, L.LookupValue as StatusName, L.DisplayOrder as StatusOrder, SR.Selected_Process, SR.ReportNumber from SubmittedReports SR "
    //   + "INNER JOIN ReportData RD on RD.ReportID_Mobile=SR.ReportID_Mobile INNER JOIN WorkFlowElements WE ON WE.ElementID = RD.ElementID INNER JOIN LOOKUPS L ON L.LookupID =SR.Status "
    //   + "Where WE.ElementID in (130109,130095,130098,130106,130111,130102) AND SR.CreatedBy = ? AND SR.ReportID_Mobile = ? Order by RD.ReportID_Mobile ";

    let query = "Select SR.*,SD.DeviceId as DEVICEID from SDRREPORT SR LEFT OUTER JOIN SELECTEDDEVICE SD ON SD.ReportId = SR.ReportId where SR.CreatedBy = ? AND SR.ReportID = ?";

    let queryParams = [userId, reportID];
    // let query = "Select L.LookupValue ,We.ElementName, "
    // + "Case When We.ElementName='BusinessGroup' then (Select BusinessGroupName from BusinessGroup where BusinessGroupID=RD.Value) "
    // //+ "When We.ElementName='Customer' then (Select Name	from MST_Customer where CustomerID=RD.Value) else RD.Value end as Value,CASE WHEN We.ElementName = 'BusinessGroup' "
    // + " else RD.Value end as Value,CASE WHEN We.ElementName = 'BusinessGroup' "
    // + "THEN(  SELECT BusinessGroupID FROM BusinessGroup  WHERE BusinessGroupID = RD.Value  )  ELSE null   END AS BGID,SR.CreatedBy,SR.CreatedDate,SR.ModifiedBy,SR.ModifiedDate, SR.IsStandalone, SR.ReportID_Mobile, SR.ReportID, SR.Status, SR.Selected_Process, SR.ReportNumber from SubmittedReports SR "
    // + "INNER JOIN ReportData RD on RD.ReportID_Mobile=SR.ReportID_Mobile INNER JOIN WorkFlowElements WE ON WE.ElementID = RD.ElementID INNER JOIN LOOKUPS L ON L.LookupID =SR.Status "
    // + "Where WE.ElementID in (130109,130095,130098) AND SR.CreatedBy = ? AND SR.ReportID_Mobile = ?  Order by RD.ReportID_Mobile ";

    // let queryParams = [userId, reportID];
    // let ReportWFElements;
    // let CustomerIDArr = [];
    // let tempCustomerArr = 0;
    return this.getList(query, queryParams, "getReportByID")
    //   .then((res: any[]) => {
    //     ReportWFElements = res;
    //     let filteredElements = ReportWFElements.filter((item) => item.ElementName == 'Customer');
    //     filteredElements.forEach(item => {
    //       if (CustomerIDArr.indexOf(item.Value) == -1) CustomerIDArr.push(item.Value);
    //     });
    //     let promiseArr = [];
    //     CustomerIDArr.forEach((item) => {
    //       promiseArr.push(this.getCustomerByID(item));
    //     })
    //     Promise.all(promiseArr).then((allResult) => {
    //       ReportWFElements.forEach(item => {
    //         if (item.ElementName == 'Customer') {
    //           allResult.filter(customerItem => {
    //             if (customerItem.length > 0) {
    //               if (customerItem[0].CustomerID == item.Value) {
    //                 item.Value = customerItem[0].LookupValue;
    //               }
    //             }
    //           });
    //         }
    //       });
    //       resolve(ReportWFElements);
    //     }).catch((err: any) => {
    //       this.logger.log(this.fileName, 'getReportByID', 'Error in Promise all: ' + JSON.stringify(err));
    //     });
    //   }).catch((error) => {
    //     this.logger.log(this.fileName, 'getReportByID', 'Error in getList: ' + JSON.stringify(error));
    //     reject(error)
    //   });
    // })
  }

  getWorkFlowsForReview(BGID, TemplateID) {
    //06/11/2018 : Shivansh Subnani : Get WorkFlows as per the Mapper BUID instead of BUID
    return this.getList("SELECT * FROM WorkFlow WHERE WorkFlowGroupID = ? AND TemplateID = ? AND  IsActive = ?  AND IsReport IS NULL  AND ParentID IS NOT NULL ORDER BY DisplayOrder asc", [BGID, TemplateID, "Y"], "getWorkFlowsForReview");
  }

  /**
   * Updates Report ID in Task
   *
   * @param {*} ReportID
   * @param {*} Task_Number - Task Number from OSC Job
   * @returns
   * @memberof LocalServiceProvider
   * @author Gurkirat Singh
   */
  updateReportIDInTask(ReportID, Task_Number) {
    let query = "UPDATE Task SET ReportID = ? WHERE Task_Number = ?";
    let queryParams = [ReportID, Task_Number];
    return this.insertData(query, queryParams, "updateReportIDInTask");
  }

  /**
   * Gets the list of standalone job by ReportID_Mobile.
   * 11/15/2018 -- Mayur Varshney
   * @param {*} ReportID_Mobile
   * @returns
   * @memberof LocalServiceProvider
   */
  getStandaloneJobById(reportid) {
    let query = "SELECT * FROM Task WHERE ReportID = ?";
    return this.getList(query, [reportid], "getStandaloneJobById");
  }

  getBusinessGroup() {
    let query = "SELECT BG.BusinessGroupID as LookupID, BG.BusinessGroupName as LookupValue, BG.* FROM BusinessGroup BG;";
    return this.getList(query, [], "getBusinessGroup");
  }

  public getAllWorkflowsOnGroupID(workflowGroupId, TemplateID, DeviceID) {
    //let query = "SELECT BG.BusinessGroupID as LookupID, BG.BusinessGroupName as LookupValue, BG.* FROM BusinessGroup BG;";
    return this.getList("SELECT W.*, L.DisplayOrder AS StatusOrder, (Select W1.TabTitle from WorkFlow W1 INNER JOIN WorkflowProductMapping WPF1 ON WPF1.WorkflowGroupID = W1.WorkFlowGroupID AND WPF1.WorkflowID =W1.WorkFlowID  Where  W.WorkFlowGroupID = ?  and WPF1.ProductID = ? AND W1.IsActive = ?  and W1.DisplayOrder > W.DisplayOrder Order by W1.DisplayOrder  Limit 1) as NextTab FROM WorkFlow W INNER JOIN WorkflowProductMapping WPF ON WPF.WorkflowGroupID = W.WorkFlowGroupID AND WPF.WorkflowID =W.WorkFlowID  LEFT OUTER JOIN Lookups L ON l.LookupID = W.StatusToChange WHERE W.WorkFlowGroupID = ?  AND W.TemplateID = ? AND W.IsActive = ? AND WPF.ProductID = ? ORDER BY W.DisplayOrder ASC", [workflowGroupId, DeviceID, "Y", workflowGroupId, TemplateID, "Y", DeviceID], "getAllWorkflowsOnGroupID");
  }

  //Radheshyam cahnge connection customer
  //Changed this.getList to this.getListFormCustomerDB
  public getCustomerDetails(CustomerID) {
    //let query = "SELECT BG.BusinessGroupID as LookupID, BG.BusinessGroupName as LookupValue, BG.* FROM BusinessGroup BG;";
    return this.getListFormCustomerDB("SELECT * FROM MST_Customer where CustomerID = ? ", [CustomerID], "getCustomerDetails");
  }

  public getAllWorkFlows() {
    // TODO: Setting workflowGroupID from valueprovider Currently setting as 1 static
    let workflowGroupID = this.valueProvider.getWorkFlowGroupID();
    //Shivansh Subnani 18-12-2018
    return this.getList("select * from WorkFlow where (ShowInPDF is null OR ShowInPDF = 'Y') and (WorkFlowGroupID IS NULL OR WorkFlowGroupID = ? ) order by DisplayOrder asc", [workflowGroupID], "getAllWorkFlows");
  }

  public GetPdfSections(workflowId) {
    return this.getList("select * from WorkFlowSections  where (ShowInPDF is null OR ShowInPDF ='Y') and WorkFlowID = ? ", [workflowId], "GetPdfSections");
  }

  //02-01-2018 Radheshyam kumar Added customer db for mst_customer access.
  GetPdfElements(SectionID, PlaceholderID, currentReport) {
    // return new Promise((resolve, reject) => {
    let ReportID_MobileJoin = currentReport ? " AND RD.ReportID_Mobile = ? " : " AND RD.ReportID_Mobile ISNULL ";
    //let ValueCaseWhen = "Case When We.PrepopulateWithElementID in (2, 153, 334, 404,130095) THEN (Select Name	from MST_Customer where CustomerID = RD.Value) " +
    let ValueCaseWhen = "Case  " +
      "When We.PrepopulateWithElementID IN (147,4,398,130111) THEN (Select ProductName	from MST_Product where ProductID = RD.Value) " +
      "When We.PrepopulateWithElementID IN (5,6,7,149) THEN (Select LookupValue	from Lookups where LookupID = RD.Value) " +
      "When We.ReportViewElementType = 'ReportViewLabel' AND We.DataSource ='Lookup' THEN(SELECT LookupValue FROM Lookups WHERE LookupID = RD.Value) " +
      "When We.PrepopulateWithElementID IN (130109) THEN (Select BusinessGroupName	from BusinessGroup where BusinessGroupID = RD.Value) " +
      "ELSE RD.Value end as Value";
    //22/10/2018 Ankit Pathak: Added Case for PrepopulateElementID for RD.ValueID
    let ValueIDCaseWhen = currentReport ? ", Case When We.PrepopulateWithElementID IN (147,4,398,130111) THEN" +
      " (Select RV.Value from ReportData RV Where RV.ElementID = WE.PrepopulateWithElementID AND RV.ReportID_Mobile = ? ) Else RD.Value End as ValueID, "
      : ", RD.Value as ValueID, ";
    let query = "SELECT RD.RDID, RD.RDID_Mobile, " + ValueCaseWhen + ValueIDCaseWhen +
      " RD.ReportID_Mobile, WE.*, Val.LookupValue as ValidationValue, Val.Type as ValidationType FROM WorkFlowElements WE " +
      "LEFT OUTER JOIN ReportData RD ON RD.ElementID in (WE.ElementID, WE.PrepopulateWithElementID) " +
      ReportID_MobileJoin + " AND RD.ParentID_Mobile ISNULL LEFT OUTER JOIN Lookups Val ON We.ValidationID = Val.LookupID " +
      "WHERE WE.SectionID = ? AND WE.ContentPlaceholderID = ? AND WE.IsActive = ? AND WE.ParentID ISNULL AND (WE.ShowInPDF IS NULL OR WE.ShowInPDF ='Y') " +
      "GROUP BY WE.ElementID ORDER BY We.DisplayOrder";
    let queryParams = [];
    if (currentReport) queryParams.push(currentReport.ReportID_Mobile);
    if (currentReport) queryParams.push(currentReport.ReportID_Mobile);
    queryParams = queryParams.concat([SectionID, PlaceholderID, "Y"]);
    ////console.log("query", query);
    ////console.log("queryParams", queryParams);
    //return this.getList(query, queryParams, "getWorkFlowElements");

    // let PdfWFElements;
    // let CustomerIDArr = [];
    //      let tempCustomerArr = 0;
    return this.getList(query, queryParams, "GetPdfElements")
    //   .then((res: any[]) => {
    //     PdfWFElements = res;
    //     let filteredElements = PdfWFElements.filter((item) => item.PrepopulateWithElementID == 130095);
    //     filteredElements.forEach(item => {
    //       if (CustomerIDArr.indexOf(item.Value) == -1) CustomerIDArr.push(item.Value);
    //     });
    //     let promiseArr = [];
    //     CustomerIDArr.forEach((item) => {
    //       promiseArr.push(this.getCustomerByID(item));
    //     })
    //     Promise.all(promiseArr).then((allResult) => {
    //       PdfWFElements.forEach(item => {
    //         if (item.PrepopulateWithElementID == 130095) {
    //           allResult.filter(customerItem => {
    //             if (customerItem.length > 0) {
    //               if (customerItem[0].CustomerID == item.Value) {
    //                 item.Value = customerItem[0].LookupValue;
    //               }
    //             }
    //           });
    //         }
    //       });
    //       resolve(PdfWFElements);
    //     }).catch((err: any) => {
    //       this.logger.log(this.fileName, 'GetPdfElements', 'Error in Promise all: ' + JSON.stringify(err));
    //     });
    //   }).catch((error) => {
    //     this.logger.log(this.fileName, 'GetPdfElements', 'Error in getList: ' + JSON.stringify(error));
    //     reject(error)
    //   });
    // })
  }

  /**
   *12-19-2018
   * Insert or update detailed notes
   * @param {*} responseList
   * @returns
   * @memberof LocalServiceProvider
   */
  public insertUpdateDetailedNotes(responseList) {
    return new Promise((resolve, reject) => {
      // let value = [];
      this.dbctrl.getDB().transaction((transaction) => {
        let insertUpdateValues = [];
        let sqlInsertUpdate = "INSERT OR REPLACE INTO DetailedNotes(" + (responseList.DNID ? "DNID," : "") + " Report_No, Description_One, Description_Two, Summary, System_Info, Detailed_Notes, Result, Suggestion, Task_Number, Sync_Status, Date, Created_By, Created_Date, Modified_By, Modified_Date, hasAttachments) VALUES (" + (responseList.DNID ? " ?," : "") + "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        if (responseList.DNID)
          insertUpdateValues.push(responseList.DNID);
        insertUpdateValues.push(responseList.Report_No);
        insertUpdateValues.push(responseList.Description_One);
        insertUpdateValues.push(responseList.Description_Two);
        insertUpdateValues.push(responseList.Summary);
        insertUpdateValues.push(responseList.System_Info);
        insertUpdateValues.push(responseList.Detailed_Notes);
        insertUpdateValues.push(responseList.Result);
        insertUpdateValues.push(responseList.Suggestion);
        insertUpdateValues.push(responseList.Task_Number);
        insertUpdateValues.push(responseList.Sync_Status);
        insertUpdateValues.push(responseList.Date);
        insertUpdateValues.push(responseList.Created_By);
        insertUpdateValues.push(responseList.Created_Date);
        insertUpdateValues.push(responseList.Modified_By);
        insertUpdateValues.push(responseList.Modified_Date);
        insertUpdateValues.push(responseList.hasAttachments);


        transaction.executeSql(sqlInsertUpdate, insertUpdateValues, (tx, res) => {
          resolve(responseList);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'insertDetailedNotes', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'insertDetailedNotes', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  /**
   *12-19-2018
   *Delete Detailed nots from notes list
   * @param {*} DNID
   * @returns
   * @memberof LocalServiceProvider
   */
  deleteDetailedNotesObject(DNID) {
    //this.logger.log(this.fileName,'function',"Time_ID=" + Notes_ID);
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("DELETE FROM DetailedNotes WHERE DNID = " + DNID, [], (tx, res) => {
        }, (tx, error) => {
          this.logger.log(this.fileName, 'deleteDetailedNotesObject', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'deleteNotesObject', 'Error: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  deleteDetailedNotes(DNID) {
    //this.logger.log(this.fileName,'function',"Time_ID=" + Notes_ID);
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("DELETE FROM DetailedNotes WHERE Summary=='' AND System_Info=='' AND Detailed_Notes=='' AND Result=='' AND Suggestion=='' AND hasAttachments=='0' AND DNID = " + DNID, [], (tx, res) => {
          resolve();
        }, (tx, error) => {
          this.logger.log(this.fileName, 'deleteDetailedNotesObject', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'deleteNotesObject', 'Error: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  /**
   *12-19-2018
   *Inseert detail notes attachments
   * @param {*} responseList
   * @returns
   * @memberof LocalServiceProvider
   */
  public insertDetailedNoteAttachment(responseList) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        // 11/02/2018 -- Mayur Varshney -- update query, insert OracleDBID in table
        let sqlInsert = "INSERT INTO DetailedNotesAttachment VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        if (responseList.DNID) {
          insertValues.push(parseInt(responseList.DNID)); // this id will be coming from the detail notes "DNID"
          insertValues.push(parseInt(responseList.Attachment_Id)); // what should i pass in this  primary key "Attachment_Id"
          insertValues.push(responseList.File_Name);
          insertValues.push(responseList.File_Type);
          insertValues.push(responseList.File_Path);
          insertValues.push(responseList.Attachment_Type);
          insertValues.push(responseList.Sync_Status);
          insertValues.push(responseList.Date);
          insertValues.push(responseList.Created_By);
          insertValues.push(responseList.Created_Date);
          insertValues.push(responseList.Modified_By);
          insertValues.push(responseList.Modified_Date);
          insertValues.push(responseList.Task_Number);
          insertValues.push("true");

          transaction.executeSql(sqlInsert, insertValues, (tx, res) => {
            resolve(res.insertId);
          }, (tx, error) => {
            this.logger.log(this.fileName, 'insertAttachment', "DETAILEDNOTESATTACHMENT INSERT ERROR: " + JSON.stringify(error.message));
            reject(error);
          });
        }

      }, (error) => {
        this.logger.log(this.fileName, 'insertAttachment', "DETAILEDNOTESATTACHMENT INSERT TRANSACTION ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  /**
   *Delete Detail notes attachment
  *2-19-2018
  * @param {*} attachmendId
  * @memberof LocalServiceProvider
  */
  deleteDetaileNotesAttachmentObject(attachmendId) {
    this.dbctrl.getDB().transaction((transaction) => {
      //this.logger.log(this.fileName,'function',attachmendId);
      let sqlDelete = "DELETE FROM DetailedNotesAttachment where Attachment_Id = " + attachmendId;
      //this.logger.log(this.fileName,'function',"sqlDelete=" + sqlDelete);

      transaction.executeSql(sqlDelete);
    }, (error) => {
      this.logger.log(this.fileName, 'deleteDetailedNotesAttachmentObject', 'Promise Error: ' + JSON.stringify(error.message));
    });
  }

  /**
   *Update detail notes attachment
  * 12-19-2018
  * @param {*} updatedName
  * @param {*} attachmentId
  * @returns
  * @memberof LocalServiceProvider
  */
  updateDetailedNotesAttachmentName(updatedName, attachmentId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlUpdate = "UPDATE DetailedNotesAttachment SET File_Name = " + JSON.stringify(updatedName) + " WHERE Attachment_Id = " + attachmentId;
        //this.logger.log(this.fileName,'function',sqlUpdate);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          resolve(res);
          //this.logger.log(this.fileName,'function',"ATTACHMENT ROW AFFECTED: " + res.rowsAffected);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateDetailedNotesAttachmentName', "ATTACHMENT UPDATE ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateDetailedNotesAttachmentName', "ATTACHMENT UPDATE TRANSACTION ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  /**
   *get detail notes list
   *12-19-2018
   * @param {*} taskId
   * @returns
   * @memberof LocalServiceProvider
   */
  public getDetailNotesList(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        let stmtValues = [];
        // 11/02/2018 -- Mayur Varshney -- Update query for standalone jobs
        let query = "SELECT N.* FROM DetailedNotes N INNER JOIN Task tk ON N.Task_Number = tk.Task_Number WHERE N.Task_Number = ?";
        stmtValues.push(taskId.toString());
        transaction.executeSql(query, stmtValues, (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          value.reverse();
          //this.logger.log(this.fileName,'function',"in local service getNotesList :::" + JSON.stringify(value));
          resolve(value);
          // this.logger.log(this.fileName,'getNotesList',"GET NOTES DB ==========> " + JSON.stringify(value));
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getDetailNotesList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getDetailNotesList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  };

  updateDetailedNotes(DNID, flag) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [flag, DNID];
        let sqlUpdate = "UPDATE DetailedNotes SET hasAttachments = ? WHERE DNID = ?";
        //console.log(sqlUpdate);
        //this.logger.log(this.fileName,'function',sqlUpdate);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          resolve(res);
          //this.logger.log(this.fileName,'function',"ATTACHMENT ROW AFFECTED: " + res.rowsAffected);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateDetailedNotes', "updateDetailedNotes ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateDetailedNotes', "updateDetailedNotes ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  //02-01-2018 Radheshyam kumar Added customer db for mst_customer access.
  public getPdfReportData(currentReport) {
    // return new Promise((resolve, reject) => {
    let WorkFlowGroupID = this.valueProvider.getWorkFlowGroupID();
    //let query = "Select WFE.ElementID, WFE.ElementType, WFE.DataSource, WFE.DisplayName, WFE.SectionID, WFE.WorkflowID, WF.HeaderTitle as WFTitle, WFS.DisplayName as SectionTitle,  WFE.DisplayName as Label,RD.RDid_Mobile,Case When WFE.DataSource='BusinessGroup' then (Select BusinessGroupName from BusinessGroup where BusinessGroupID=RD.Value)  When WFE.DataSource='Lookup'  then (Select LookupValue from Lookups where LookupID=RD.Value) else RD.Value end as Value ,RD.ParentID_Mobile, RD.File_Type from ReportData RD INNER JOIN WorkFlowElements WFE on WFE.elementid=RD.elementID INNER JOIN WorkFlowSections WFS on WFS.SectionID=WFE.SectionID INNER JOIN WorkFlow WF on WF.WorkFlowID=WFE.WorkFlowID WHere (WFE.ShowinPDF = 'Y' or  WFE.ShowinPDF is null)and  ReportID_Mobile= ? Order by WFE.displayorder, WFE.PDFDisplayOrder desc";
    let query = "Select * from (Select WFE.ElementID,WFE.SaveNullValue, WFE.ElementType, WFE.DataSource, WFE.DisplayName,WFE.PDFArgs, WFE.SectionID, WFE.WorkFlowID, WF.HeaderTitle as WFTitle, WF.FlowName AS FlowName, WFS.DisplayName as SectionTitle,  WFE.DisplayName as Label,RD.RDID_Mobile, Case When WFE.DataSource='BusinessGroup' then (Select BusinessGroupName from BusinessGroup where BusinessGroupID=RD.Value) When WFE.DataSource='Lookup' and RD.Value !=-1 and WFE.LinkId is not null then (Select LookupValue from Lookups where LookupID=RD.Value) || ' '|| (Select RD3.DetailedValue from ReportData RD3 where RD3.ReportID_Mobile= ? and RD3.ElementID=WFE.LinkID and ((RD3.ParentID_Mobile is not null  and RD3.ParentID_Mobile=RD.ParentID_Mobile) Or (RD3.ParentID_Mobile is null))) When WFE.ElementType='SearchDropdown' and RD.Value ==-1 and WFE.LinkId is not null then (RD.OtherValue) || ' ' || (Select RD3.DetailedValue from ReportData RD3 where RD3.ReportID_Mobile= ? and RD3.ElementID=WFE.LinkID and ((RD3.ParentID_Mobile is not null  and RD3.ParentID_Mobile=RD.ParentID_Mobile) Or (RD3.ParentID_Mobile is null))) When WFE.DataSource='Lookup' and RD.Value !=-1  then (Select LookupValue from Lookups where LookupID=RD.Value) When WFE.ElementType='SearchDropdown' and RD.Value ==-1  then (RD.OtherValue) When WFE.DataSource='MST_Product'  then (Select ProductName from MST_Product where ProductID=RD.Value) When WFE.LinkId is not null then RD.Value || ' '|| (Select RD3.DetailedValue from ReportData RD3 where RD3.ReportID_Mobile=? and RD3.ElementID=WFE.LinkID and ((RD3.ParentID_Mobile is not null  and RD3.ParentID_Mobile=RD.ParentID_Mobile) Or (RD3.ParentID_Mobile is null))) When WFE.ElementType='Toggle'  and RD.value='true' then 'Yes' When WFE.ElementType='Toggle'  and RD.value='false' then 'No' else RD.Value end as Value , ParentID_Mobile , RD.File_Type,  RD.Value as LookupID, RD.DetailedValue, Case when ParentID_Mobile is null and Elementtype ='Accordion' then (Select DisplayOrder from Lookups where  lookupid=RD.Value) when ParentID_Mobile is null then WFE.PDFDisplayOrder else IFNULL((Select  WFE2.PDFDisplayOrder from ReportData RD2 INNER JOIN WorkFlowElements WFE2 on WFE2.ElementID=RD2.ElementID where RD2.ReportID_Mobile=? and RD2.RDID_Mobile=RD.ParentID_Mobile),1 )|| '.'  ||  ifnull(WFE.PDFDisplayOrder,1) end as DisplayOrder,  WFE.PDFDisplayOrder, WFE.ParentID, WFE.PreRenderArgs, LinkID from WorkFlowElements WFE INNER JOIN WorkFlow WF on WFE.WorkFlowID=WF.WorkFlowID INNER JOIN WorkFlowSections WFS on WFS.SectionID=WFE.SectionID Inner  JOIN ReportData RD on RD.ElementID=WFE.ElementID and  ReportID_Mobile=? Where (WF.WorkFlowGroupID = ? Or WF.WorkFlowGroupID is null) and (WFE.ShowinPDF = 'Y' or  WFE.ShowinPDF is null) and (WFE.ParentID is not null or RD.RDID_Mobile is not null) AND RD.Show_In_Pdf != 'false' AND ((WFE.ElementType = ? AND RD.FILE_TYPE LIKE ?) OR WFE.ElementType != ?))a  Order By DisplayOrder;"
    let queryParams = [
      currentReport.ReportID_Mobile,
      currentReport.ReportID_Mobile,
      currentReport.ReportID_Mobile,
      currentReport.ReportID_Mobile,
      currentReport.ReportID_Mobile,
      WorkFlowGroupID,
      Enums.ElementType.ActionButtonFileUpload,
      '%image%',
      Enums.ElementType.ActionButtonFileUpload
    ];

    // let pdfReportData;
    // let CustomerIDArr = [];
    //let tempCustomerArr = 0;
    // //console.log("query"+JSON.stringify(query));
    // //console.log("queryParams"+JSON.stringify(queryParams));
    return this.getList(query, queryParams, "getPdfReportData")
    //   .then((res: any[]) => {
    //     pdfReportData = res;
    //     let filteredElements = pdfReportData.filter((item) => item.DataSource == 'MST_Customer');
    //     filteredElements.forEach(item => {
    //       if (CustomerIDArr.indexOf(item.Value) == -1) CustomerIDArr.push(item.Value);
    //     });
    //     let promiseArr = [];
    //     CustomerIDArr.forEach((item) => {
    //       promiseArr.push(this.getCustomerByID(item));
    //     })
    //     Promise.all(promiseArr).then((allResult) => {
    //       pdfReportData.forEach(item => {
    //         if (item.DataSource == 'MST_Customer') {
    //           allResult.filter(customerItem => {
    //             if (customerItem.length > 0) {
    //               if (customerItem[0].CustomerID == item.Value) {
    //                 item.Value = customerItem[0].LookupValue;
    //               }
    //             }
    //           });
    //         }
    //       });
    //       resolve(pdfReportData);
    //     }).catch((err: any) => {
    //       this.logger.log(this.fileName, 'getPdfReportData', 'Error in Promise all: ' + JSON.stringify(err));
    //     });
    //   }).catch((error) => {
    //     this.logger.log(this.fileName, 'getPdfReportData', 'Error in getList: ' + JSON.stringify(error));
    //     reject(error)
    //   });
    // })
  }

  /**
   * Gets all the Reports pending to submit
   *
   * @returns
   * @memberof LocalServiceProvider
   */
  // getPendingReports() {
  //   let query = "SELECT * FROM SubmittedReports WHERE SyncStatus = ? AND Status = ?";
  //   let queryParams = ['false', Enums.ReportStatus.Completed];
  //   return this.getList(query, queryParams, "getPendingReportData");
  // }

  /**
   * Gets all the Report Data pending to submit for a report
   *
   * @param {*} reportID
   * @returns
   * @memberof LocalServiceProvider
   */
  getPendingReportData(reportID) {
    let query = "SELECT RD.* FROM ReportData RD LEFT OUTER JOIN WorkFlowElements WE ON WE.ElementID = RD.ElementID WHERE RD.SyncStatus = ? AND RD.ReportID_Mobile = ? AND WE.ElementType != ?";
    let queryParams = ['false', reportID, Enums.ElementType.ActionButtonFileUpload];
    return this.getList(query, queryParams, "getPendingReportData");
  }

  /**
   * Gets all the Attachments pending to be submit for a report
   *
   * @param {*} reportID
   * @returns
   * @memberof LocalServiceProvider
   */
  getPendingReportAttachments(reportID) {
    let query = "SELECT RD.*,WF.FlowName FROM ReportData RD LEFT OUTER JOIN WorkFlowElements WE ON WE.ElementID = RD.ElementID INNER JOIN WORKFLOW WF ON WF.WorkFlowID= WE.WorkFlowID WHERE RD.SyncStatus = ? AND RD.ReportID_Mobile = ? AND WE.ElementType = ?";
    let queryParams = ['false', reportID, Enums.ElementType.ActionButtonFileUpload];
    return this.getList(query, queryParams, "getPendingReportAttachments");
  }

  /**
   * Get all the tasks pending to be submitted
   *
   * @returns
   * @memberof LocalServiceProvider
   */
  getPendingTaskForDBCS() {
    let query = "SELECT * FROM Task Where Selected_Process in (?,?) AND DBCS_SyncStatus = ? AND RP.Status = ?";
    let queryParams = [String(Enums.Selected_Process.FCR_AND_SDR), String(Enums.Selected_Process.SDR), "false", Enums.ReportStatus.Completed];
    return this.getList(query, queryParams, "getPendingTaskForDBCS");
  }

  // getPendingTaskForDBCSByReportID(ReportID) {
  //   // 02/11/2019 : Gurkirat Singh - Removed  T.Selected_Process in (?, ?) as all pending tasks are to be submit irrespective of Selected_Process
  //   let query = "SELECT T.* FROM Task T INNER JOIN SubmittedReports RP ON RP.ReportID_Mobile = T.ReportID Where T.DBCS_SyncStatus = ? AND RP.Status = ? AND RP.ReportID_Mobile = ?";
  //   let queryParams = [
  //     // String(Enums.Selected_Process.FCR_AND_SDR),
  //     // String(Enums.Selected_Process.SDR),
  //     "false",
  //     Enums.ReportStatus.Completed,
  //     ReportID
  //   ];
  //   return this.getList(query, queryParams, "getPendingTaskForDBCSByReportID");
  // }

  getPendingTimeForDBCS(Task_Number) {
    let query = "SELECT * FROM Time WHERE Task_Number = ?";
    let queryParams = [Task_Number];
    return this.getList(query, queryParams, "getPendingTimeForDBCS");
  }

  getPendingExpenseForDBCS(Task_Number) {
    let query = "SELECT * FROM Expense WHERE Task_Number = ?";
    let queryParams = [Task_Number];
    return this.getList(query, queryParams, "getPendingExpenseForDBCS");
  }

  // 05/06/2019 -- Mayur Varshney -- get pending material from MST_Material on the basis of Sync_Status and Task_Number
  getPendingMaterialForDBCS(Task_Number) {
    let query = "SELECT Material_Serial_Id, Task_Number, Product_Quantity, Serial_In, Serial_Out, Serial_Number, IsAdditional, Charge_Type_Id, Description, ItemName FROM MST_Material WHERE Task_Number = ? AND Sync_Status = ?";
    let queryParams = [Task_Number, 'false'];
    return this.getList(query, queryParams, "getPendingMaterialForDBCS");
  }

  getPendingSignatureForDBCS(Task_Number) {
    let query = "SELECT E.followUp,E.salesQuote,E.salesVisit,E.salesLead,E.Follow_Up,E.Spare_Quote,E.Sales_Visit,E.Sales_Head," +
      "E.Sign_File_Path AS Engg_Sign_File,E.Task_Number,E.Engg_Sign_Time,C.Customer_Name,C.Job_responsibilty,C.Email,C.isCustomerSignChecked," +
      "C.customerComments,C.Cust_Sign_File,C.Cust_Sign_Time,C.OracleDBID,C.SSE_Rules,C.Remarks,C.Annuel_PdP,C.Specific_PdP,C.Working_license," +
      "C.Emerson_Safety,C.Home_Security,C.do_not_survey " +
      "FROM Engineer E INNER JOIN Customer C ON C.Task_Number = E.Task_Number WHERE E.Task_Number = ?";
    let queryParams = [Task_Number];
    return this.getList(query, queryParams, "getPendingSignatureForDBCS");
  }

  getPendingNotesForDBCS(Task_Number) {
    let query = "SELECT * FROM Notes WHERE Task_Number = ?";
    let queryParams = [Task_Number];
    return this.getList(query, queryParams, "getPendingNotesForDBCS");
  }

  // updateReport(report) {
  //   let query = "UPDATE SubmittedReports Set SyncStatus = ?, Status = ?, ModifiedBy = ?, ModifiedDate = ? Where ReportID_Mobile = ?";
  //   let queryParams = [report.SyncStatus ? report.SyncStatus : 'false', report.Status, this.getCurrentUser(), this.getCurrentDate(), report.ReportID_Mobile];
  //   return this.insertData(query, queryParams, "updateReport");
  // }

  updatePendingReportDataSyncStatus(reportID) {
    let query = "UPDATE ReportData Set SyncStatus = ? Where SyncStatus = ? AND ReportID_Mobile = ? AND ElementID not in (SELECT ElementID FROM WorkFlowElements WHERE ElementType = ?)";
    let queryParams = ['true', 'false', reportID, Enums.ElementType.ActionButtonFileUpload];
    return this.insertData(query, queryParams, "updatePendingReportDataSyncStatus");
  }

  updatePendingReportAttachmentSyncStatus(RDID_Mobile) {
    let query = "UPDATE ReportData Set SyncStatus = ? Where RDID_Mobile = ?";
    let queryParams = ['true', RDID_Mobile];
    return this.insertData(query, queryParams, "updatePendingReportAttachmentSyncStatus");
  }

  updatePendingTaskSyncStatusByReportID(reportID) {
    let query = "UPDATE Task Set DBCS_SyncStatus = ? Where ReportID = ?";
    let queryParams = ['true', reportID];
    return this.insertData(query, queryParams, "updatePendingReportDataSyncStatus");
  }

  updatePendingTaskSyncStatusByTasknumber(tasknumber) {
    let query = "UPDATE Task Set DBCS_SyncStatus = ? Where Task_Number = ?";
    let queryParams = ['true', tasknumber];
    return this.insertData(query, queryParams, "updatePendingTaskSyncStatusByTasknumber");
  }
  /**
   *@author:Prateek
   *Get lookuptype=worldarea from lookup table to show in add user in user management page
   *26-12-2018
   * @returns
   * @memberof LocalServiceProvider
   */
  getWorldArea() {
    return this.getList("SELECT * FROM Lookups WHERE LookupType = 'WorldArea'", '', 'getWorldArea');
  }

  /**
 *@author:Khushboo
 *Get lookuptype=ShiftSite from lookup table to show in time modal
 *26-12-2018
 * @returns
 * @memberof LocalServiceProvider
 */
  getShiftSite() {
    return this.getList("SELECT * FROM Lookups WHERE LookupType = 'ShiftSite'", '', 'getShiftSite');
  }

  /**
 *@author:Khushboo
 *Get lookuptype=otmultiplier from lookup table to show in time modal
 *26-12-2018
 * @returns
 * @memberof LocalServiceProvider
 */
  getOTMultiplier() {
    return this.getList("SELECT * FROM Lookups WHERE LookupType = 'OTMultiplier'", '', 'getOTMultiplier');
  }


  getDetailedNotesAttachments(taskId) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        let stmtValues = [];
        // 12/28/2018 -- get Detaled notes attachment
        let query = "SELECT DN.* FROM DetailedNotesAttachment DN INNER JOIN Task tk ON DN.Task_Number = tk.Task_Number WHERE DN.Task_Number = ?";
        stmtValues.push(taskId.toString());
        transaction.executeSql(query, stmtValues, (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          value.reverse();
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getNotesList', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getNotesList', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  }

  /**
   * 01-02-2019 -- Mansi Arora -- getAttachmentFromDetailedNotes
   * get all the attachments of detailed notes sent via param
   * @memberOf LocalServiceProvider
  */
  getAttachmentFromDetailedNotes(DNID) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        let stmtValues = [];
        let query = "SELECT * FROM DetailedNotesAttachment WHERE DNID = ?";
        stmtValues.push(DNID.toString());
        transaction.executeSql(query, stmtValues, (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          value.reverse();
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getAttachmentFromDetailedNotes', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getAttachmentFromDetailedNotes', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  }

  getAllAttachmentFromDetailedNotes(taskNumber) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let value = [];
        let stmtValues = [];
        let query = "SELECT * FROM DetailedNotesAttachment WHERE task_number = ?";
        stmtValues.push(taskNumber.toString());
        transaction.executeSql(query, stmtValues, (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          value.reverse();
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getAttachmentFromDetailedNotes', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });

      }, (error) => {
        this.logger.log(this.fileName, 'getAttachmentFromDetailedNotes', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    })
  }

  public getAllWorkflowsOnGroupIDForReview(workflowGroupId, TemplateID) {
    return this.getList("select  HeaderTitle as LookupValue, WorkFlowID as LookupID from WorkFlow where WorkFlowGroupID = ? and IsActive = ? and IsReport IS NULL Order By DisplayOrder asc", [workflowGroupId, 'Y'], "getAllWorkflowsOnGroupIDForReview");
  }

  /**
  *@author:Prateek: 01/01/2019
  *Delete data from report data table when device is changed.
  * @param {*} id
  * @returns
  * @memberof LocalServiceProvider
  */
  deleteDataOnDeviceChange(id) {
    return this.getList("DELETE FROM ReportData  where elementid in (select wfe.elementid from WorkFlow w, WorkFlowSections wfs, WorkFlowElements wfe where w.WorkFlowID = wfs.WorkFlowID and wfs.SectionID = wfe.SectionID and w.WorkFlowID != 37 and wfe.ElementID !=130111) and ReportID_Mobile = '" + id + "'", '', 'ReportData');
  }

  getAttachmentForDetailedNotes(DNID) {
    return this.getList("select * from DetailedNotesAttachment WHERE DNID=?", [DNID], "getAttachmentForDetailedNotes");
  }

  updateElementType(elementID, elementType) {
    this.dbctrl.getDB().transaction((transaction) => {
      let value = [];
      let stmtValues = [];
      let query = "UPDATE WorkFlowElements SET ElementType = ? WHERE ElementID = ?";
      stmtValues.push(elementType);
      stmtValues.push(elementID);
      transaction.executeSql(query, stmtValues, (tx, res) => {
        let rowLength = res.rows.length;
        for (let i = 0; i < rowLength; i++) {
          value.push(res.rows.item(i));
        }
        value.reverse();
      }, (tx, error) => {
        this.logger.log(this.fileName, 'updateElementType', 'Error: ' + JSON.stringify(error.message));
      });
    }, (error) => {
      this.logger.log(this.fileName, 'updateElementType', 'Error TXN: ' + JSON.stringify(error.message));
    })
  }

  /**
   *Prateek(01/15/2019)
   *To insert values to internal database in SubmittedReports table during sync.
   *Reuse batch funtion to insert submitted reports.
   */
  // insertSubmittedReportsOnSync(jsonData) {
  //   //let dummyarray: any = [];
  //   //dummyarray.push(jsonData)
  //   let reportBatch = []
  //   for (let k in jsonData) {
  //     let data = jsonData[k];
  //     // //console.log("DUMMYYY", data)
  //     let sqlInsert: any[] = ["INSERT  OR REPLACE INTO SubmittedReports(ReportID, ReportID_Mobile, ReportNumber, Status, SyncStatus, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate, Selected_Process, IsStandalone) VALUES (?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)"];
  //     let queryParams = [];
  //     queryParams.push(data.ReportID);
  //     queryParams.push(data.reportid_mobile);
  //     queryParams.push(data.reportnumber);
  //     queryParams.push(data.status);
  //     queryParams.push(data.syncstatus);
  //     queryParams.push(data.createdby);
  //     queryParams.push(moment(data.createddate).format("DD-MMM-YYYY hh:mm:ss.SSS A"));
  //     queryParams.push(data.modifiedby);
  //     queryParams.push(moment(data.modifieddate).format("DD-MMM-YYYY hh:mm:ss.SSS A"));
  //     queryParams.push(data.selected_process);
  //     queryParams.push(data.isstandalone);
  //     sqlInsert.push(queryParams);
  //     reportBatch.push(sqlInsert);
  //   }
  //   return this.insertBatchData(reportBatch, "insertReportData");
  // }

  /**
   *Prateek(01/15/2019)
   *To insert values to internal database in reportdata table during sync.
   *Reuse batch funtion to insert Reportdata..
   */
  insertReportDataOnSync(jsonData) {
    let reportBatch = []
    for (let k in jsonData) {
      let data = jsonData[k];
      // //console.log("DUMMYYYReportData", data)
      let sqlInsert: any[] = ["INSERT OR REPLACE INTO ReportData(RDID, RDID_Mobile, ReportID, ReportID_Mobile, ElementID, Value, ParentID, ParentID_Mobile, SyncStatus, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate, File_Type, AttachmentStatus,DetailedValue,OtherValue,Show_In_Pdf) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT AttachmentStatus FROM ReportData WHERE RDID_Mobile = ?), ?,?,?)"];
      let queryParams = []
      queryParams.push(data.RDID)
      queryParams.push(data.rdid_mobile)
      queryParams.push(data.reportid)
      queryParams.push(data.reportid_mobile)
      queryParams.push(data.elementid)
      queryParams.push(data.value)
      queryParams.push(data.parentid)
      queryParams.push(data.parentid_mobile)
      queryParams.push(data.syncstatus)
      queryParams.push(data.createdby)
      queryParams.push(data.createddate)
      queryParams.push(data.modifiedby)
      queryParams.push(data.modifieddate)
      queryParams.push(data.file_type)
      queryParams.push(data.rdid_mobile)
      queryParams.push(data.detailedvalue)
      queryParams.push(data.othervalue)
      queryParams.push(data.show_in_pdf != null ? data.show_in_pdf : 'true');
      sqlInsert.push(queryParams);
      reportBatch.push(sqlInsert)

    }
    return this.insertBatchData(reportBatch, "insertReportData");
  }

  /**
   *@author:Prateek
   *22/01/2019
   *Insert customer into cutomerdatabase
   */
  insertCustomerInCutomerDb(getCustomerDataFromMCS) {
    let reportBatch = []
    for (let k in getCustomerDataFromMCS) {
      let data = getCustomerDataFromMCS[k];
      // //console.log("DUMMYYYReportData", data)
      let sqlInsert: any[] = ["INSERT OR REPLACE INTO MST_Customer(CustomerID, Address_ID, Name, AddressLine1, AddressLine2, Zipcode, City, State, Country, Phone, Email, IsActive, CreatedBy, CreatedDate,ModifiedBy,ModifiedDate,Account_Number,Party_Number,AddressUsage) VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"];
      let queryParams = []
      queryParams.push(data.Customer_ID);
      queryParams.push(data.Address_ID);
      queryParams.push(data.Customer);
      queryParams.push(data.Address_1 == '' ? null : data.Address_1);
      queryParams.push(data.Address_2 == '' ? null : data.Address_2);
      queryParams.push(data.Postal_Code == '' ? null : data.Postal_Code);
      queryParams.push(data.City == '' ? null : data.City);
      queryParams.push(data.State == '' ? null : data.State);
      queryParams.push(data.Country == '' ? null : data.Country)
      queryParams.push(data.Phone == '' ? null : data.Phone)
      queryParams.push(data.Email == '' ? null : data.Email)
      queryParams.push(data.IsActive ? "Y" : data.IsActive)
      queryParams.push(data.CreatedBy == '' ? null : data.CreatedBy)
      queryParams.push(data.Date_Created.replace(/'/gi, ''));
      queryParams.push(data.ModifiedBy == '' ? null : data.ModifiedBy)
      queryParams.push(data.LastUpdatedDate == '' ? null : data.LastUpdatedDate.replace(/'/gi, ''))
      queryParams.push(data.Account_Number == '' ? null : data.Account_Number)
      queryParams.push(data.Party_Number == '' ? null : data.Party_Number)
      queryParams.push(data.AddressUsage == '' ? null : data.AddressUsage)
      sqlInsert.push(queryParams);
      reportBatch.push(sqlInsert);
    }
    return this.insertBatchDataCustomerDB(reportBatch, "insertCustomerInCutomerDb");
  }

  /**
   *Prateek 17/01/2019
   *
   * @returns
   * @memberof LocalServiceProvider
   */
  public getRdidSdrAttachment() {
    // let reportData = [];
    // let query="SELECT RD.*,WF.FlowName as FolderName from ReportData RD INNER JOIN WorkFlowElements WFE on WFE.ElementID = RD.ElementID INNER JOIN WorkFlow WF on WF.WorkFlowID = WFE.WorkFlowID WHERE WFE.ElementType = 'ActionButtonFileUpload' AND RD.AttachmentStatus = 'false'"
    // this.getList(query, '', "getReports").then((res: any[]) => {
    //   reportData = res;
    // }).catch((error: any) => {
    //   this.logger.log(this.fileName, 'getReports', 'Error in getList: ' + JSON.stringify(error));

    // });
    return this.getList("SELECT  RD.*,WF.FlowName as FolderName from ReportData RD INNER JOIN WorkFlowElements WFE on WFE.ElementID = RD.ElementID INNER JOIN WorkFlow WF on WF.WorkFlowID = WFE.WorkFlowID WHERE WFE.ElementType = 'ActionButtonFileUpload' AND (RD.AttachmentStatus IS NULL OR RD.AttachmentStatus = 'false')", '', "getRdidSdrAttachment");
    //return this.getList("SELECT WFE.ElementType ,RD.* from ReportData RD INNER JOIN WorkFlowElements WFE on WFE.ElementID = RD.ElementID;", '', "getRdidSdrAttachment");

  }

  /**
   *@author:Prateek 07/02/2019
   *Update Attachment status to true in reportdata table after  inserting attachment in the reportfiles folder.
   * @param {*} rdidmobile
   * @returns
   * @memberof LocalServiceProvider
   */
  updateAttachmentStatus(RA_PK_ID) {
    let insertValues = [];
    insertValues.push("Y");
    insertValues.push(RA_PK_ID);
    return this.insertData("UPDATE REPORTATTACHMENTS SET ATTACHMENTSTATUS = ? WHERE RA_PK_ID = ?", insertValues, "updateAttachmentStatus");
  };

  getFieldDiagnosticData(ElementID, ReportID) {
    return this.getList("Select * from ReportData where ElementID = ? and ReportID_Mobile =?  ", [ElementID, ReportID], "getFieldDiagnosticData")
  }

  /**
   * Perform update selected timezone in TimeZone table
   * @param {*} array - array of arrays having checked and unchecked timezones
   * @memberof LocalServiceProvider
   * @author Mansi Arora- 12/10/2018
   */
  // 01-30-2019 -- Mansi Arora -- optimise code by sending an array of arrays as asked by Mayur
  updateTimeZone(array) {
    let sqlBatchStmt = [];
    // 01-30-2019 -- Mansi Arora -- optimise code by traversing an array of arrays for getting checked and unchecked array as asked by Mayur
    for (let i = 0; i < array.length; i++) {
      if (array[i].length > 0) {
        let query = [];
        let values = [];
        query.push("UPDATE TimeZone SET IsActive = ?, Modified_By = ?, Modified_Date = ?, Sync_Status = ? WHERE TimeZoneID IN (" + array[i].toString() + ")");
        values.push(i == 0 ? 'Y' : 'N');
        values.push(this.valueProvider.getUser().UserID);
        values.push(moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
        values.push('false');
        query.push(values);
        sqlBatchStmt.push(query);
      }
    }
    if (sqlBatchStmt.length > 0) {
      return this.insertBatchData(sqlBatchStmt, "insertTimeZone");
    }
  }

  /**
  * 01/28/2019 Mayur Varshney
  * update Last_Updated_Timezone in users table
  * @param {*} userObject
  * @returns
  * @memberof LocalServiceProvider
  */
  updateLastTimezone(userObject) {

    let sqlUpdate = "UPDATE User SET Last_Updated_Timezone = ? WHERE ID = ?";
    let insertValues = [userObject.Last_Updated_Timezone, userObject.ID];
    return this.insertData(sqlUpdate, insertValues, "updateLastTimezone");
  };

  /**
  * 01/28/2019 Mayur Varshney
  * save active timezone in db
  * @param {*} dataArray
  * @returns
  * @memberof LocalServiceProvider
  */
  saveActiveTimezoneList(dataArray) {
    let sqlBatchStmt = [];
    for (let k in dataArray) {
      let data = dataArray[k];
      let stmtValues = [];
      let sqlInsert: any[] = ["UPDATE TimeZone SET IsActive = ?, Modified_By = ?, Modified_Date = ?, Created_By = ?, Created_Date = ?, Sync_Status = ?, TimeZoneIANA = ?, TimeZone_Name = ? WHERE TimeZoneID = ?"];
      stmtValues.push(data.IsActive);
      stmtValues.push(data.Modified_By ? data.Modified_By : null);
      stmtValues.push(data.Modified_Date ? data.Modified_Date.toString() : null);
      stmtValues.push(data.Created_By ? data.Created_By : null);
      stmtValues.push(data.Created_Date ? data.Created_Date.toString() : null);
      stmtValues.push("true");
      stmtValues.push(data.TimeZoneIANA ? data.TimeZoneIANA : null);
      stmtValues.push(data.TimeZone_Name ? data.TimeZone_Name : null);
      stmtValues.push(data.TimeZoneID);
      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlInsert);
    }
    return this.insertBatchData(sqlBatchStmt, "saveActiveTimezoneList");
  }

  /**
  * 01/30/2019 Mayur Varshney
  * update timezone IsActive = 'Y' w.r.t to User Timezone coming from OFSC
  * @param {*} timeZoneIANA
  * @memberof LocalServiceProvider
  */
  saveUserTimezoneIsActive(timeZoneIANA) {
    let sqlUpdate = "UPDATE TimeZone SET IsActive = ? WHERE timeZoneIANA = ?"
    let updateParam = ['Y', timeZoneIANA]
    return this.insertData(sqlUpdate, updateParam, 'saveUserTimezoneIsActive');
  }

  /**
  * 01/28/2019 Mayur Varshney
  * get pending timezone on the basis of Sync_Status
  * @returns
  * @memberof LocalServiceProvider
  */
  getPendingTimezone() {
    let query = "SELECT TimeZoneID, Modified_By, Modified_Date, IsActive FROM TimeZone WHERE Sync_Status = ?";
    let queryParams = ["false"];
    return this.getList(query, queryParams, 'getPendingTimezone');
  }

  /**
  * 01/28/2019 Mayur Varshney
  * update timezone on the basis of Sync_Status
  * @returns
  * @memberof LocalServiceProvider
  */
  updateTimezoneStatus(dataArray) {
    let sqlBatchStmt = [];
    for (let k in dataArray) {
      let data = dataArray[k];
      let stmtValues = [];
      let sqlInsert: any[] = ["Update TimeZone SET Sync_Status = ? WHERE TimeZoneID = ?"];
      stmtValues.push('true');
      stmtValues.push(data.TimeZoneID);
      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlInsert);
    }
    return this.insertBatchData(sqlBatchStmt, "saveActiveTimezoneList");
  }

  /**
   *01-28-2019 Radheshyam kumar
   * This function work for update Work flow element as required
   * @param {*} elementID
   * @param {*} IsRequired
   * @memberof LocalServiceProvider
   */
  public updateElementProperties(elementID, IsRequired) {
    this.dbctrl.getDB().transaction((transaction) => {
      let value = [];
      let stmtValues = [];
      let query = "UPDATE WorkFlowElements SET IsRequired = ? WHERE ElementID = ?";
      stmtValues.push(IsRequired);
      stmtValues.push(elementID);
      transaction.executeSql(query, stmtValues, (tx, res) => {
        let rowLength = res.rows.length;
        for (let i = 0; i < rowLength; i++) {
          value.push(res.rows.item(i));
        }
        value.reverse();
      }, (tx, error) => {
        this.logger.log(this.fileName, 'updateElementProperties', 'Error: ' + JSON.stringify(error.message));
      });
    }, (error) => {
      this.logger.log(this.fileName, 'updateElementProperties', 'Error TXN: ' + JSON.stringify(error.message));
    })
  }

  public getPendingDetailedNotes(Task_Number) {
    return this.getList("SELECT * FROM DetailedNotes WHERE Sync_Status = ? AND Task_Number = ?", [false, Task_Number], "getPendingDetailedNotes")
  };

  public getDetailNotesAttachment(Task_Number) {
    return this.getList("SELECT * FROM DetailedNotesAttachment WHERE Sync_Status = ? AND Task_Number = ?", [false, Task_Number], "getDetailNotesAttachment")
  };

  /**
   *@author:Prateek 07/02/2019
  *Update Attachment status to true in reportdata table after  inserting attachment in the detailednotes folder.
  * @param {*} rdidmobile
  * @returns
  * @memberof LocalServiceProvider
  */
  updateAttachmentStatusDetailedNotesAttachment(attachmentId) {
    let insertValues = [];
    insertValues.push("true");
    insertValues.push(attachmentId);
    return this.insertData("UPDATE DetailedNotesAttachment SET Sync_Status = ? WHERE Attachment_ID = ?", insertValues, "updateAttachmentStatusDetailedNotesAttachment");
  };

  /**
  *@author:Prateek 07/02/2019
  *Update Attachment status to true in reportdata table after  inserting attachment in the detailednotes folder.
  * @param {*} rdidmobile
  * @returns
  * @memberof LocalServiceProvider
  */
  updateDetailedNotesSyncStatus(attachmentId) {
    let insertValues = [];
    insertValues.push("true");
    insertValues.push(attachmentId);
    return this.insertData("UPDATE DetailedNotes SET Sync_Status = ? WHERE DNID = ?", insertValues, "updateDetailedNotesSyncStatus");
  };

  /**
   * 02/09/2019 -- Mayur Varshney
   * get all pending attachment
   * @param {*} Task_Number
   * @returns
   * @memberof LocalServiceProvider
   */
  getPendingAttachmentForDBCS(Task_Number) {
    let query = "SELECT * FROM Attachment WHERE Task_Number = ? AND AttachmentType != ? AND Attachment_Status = ?"
    let queryParams = [Task_Number, 'O', 'false'];
    return this.getList(query, queryParams, "getPendingAttachmentForDBCS")
  }

  /**
   * 02/09/2019 -- Mayur Varshney
   * update pending attachment status
   * @param {*} Task_Number
   * @returns
   * @memberof LocalServiceProvider
   */
  updatePendingFCRReportAttachmentSyncStatus(Attachment_Id) {
    let query = "UPDATE Attachment SET Attachment_Status = ? WHERE Attachment_Id = ?"
    let queryParams = ['true', Attachment_Id];
    return this.insertData(query, queryParams, 'updatePendingFCRReportAttachmentSyncStatus');
  }

  /**
    *@author Prateek (02/-8/2019)
    *get task number for getting detailed notes.
    * @returns
    * @memberof LocalServiceProvider
    */
  getTaskNumberForDetailedNotes() {
    return this.getList("Select Task_Number from Task Where Business_Unit = ? AND StatusID in (?,?)", [Enums.BusinessUnitNames.PWS, Enums.Jobstatus.Debrief_In_Progress, Enums.Jobstatus.Debrief_Declined], "getTaskNumberForDetailedNotes");
  }

  /**
   *Prateek(01/15/2019)
   *To insert values to internal database in reportdata table during sync.
   *Reuse batch funtion to insert Reportdata..
   */
  insertDetailedNotesOnSync(jsonData) {
    let reportBatch = []
    for (let k in jsonData) {
      let data = jsonData[k];
      ////console.log("DUMMYYYReportData", data)
      let sqlUpdate: any[] = ["Update DetailedNotes SET Report_No = ?, Description_One = ?, Description_Two = ?, Summary = ?, System_Info = ?, Detailed_Notes = ?, Result = ?, Suggestion = ?, Task_Number = ?, Date = ?, Created_By = ?, Created_Date = ?, Modified_By = ?,Modified_Date = ? where DNID = ? AND Sync_Status = ?"];
      let sqlInsert: any[] = ["INSERT OR IGNORE INTO DetailedNotes(Report_No, Description_One, Description_Two, Summary, System_Info, Detailed_Notes, Result, Suggestion, Task_Number, Date, Created_By, Created_Date, Modified_By,Modified_Date, DNID, Sync_Status) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)"];
      let queryParams = [];
      queryParams.push(data.report_no)
      queryParams.push(data.description_one)
      queryParams.push(data.description_two)
      queryParams.push(data.summary)
      queryParams.push(data.system_info)
      queryParams.push(data.detailed_notes)
      queryParams.push(data.result)
      queryParams.push(data.suggestion)
      queryParams.push(data.task_number)
      queryParams.push(data.entry_date)
      queryParams.push(data.created_by)
      queryParams.push(data.created_date)
      queryParams.push(data.modified_by),
        queryParams.push(data.modified_date),
        queryParams.push(data.dnid)
      queryParams.push(true)
      sqlInsert.push(queryParams);
      sqlUpdate.push(queryParams);
      reportBatch.push(sqlInsert);
      reportBatch.push(sqlInsert);

    }
    return this.insertBatchData(reportBatch, "insertReportData");
  }

  insertDetailedNotesAttachmentDataSync(jsonData, isPhysicalFileCreated) {
    let reportBatch = []
    let basePath = cordova.file.dataDirectory;
    for (let k in jsonData) {
      let data = jsonData[k];
      if (data) {
        data.filepath = basePath + "detailednotesfiles/" + data.task_number + "/" + data.dnid;
        ////console.log("DUMMYYYReportData", data)
        let sqlInsert: any[] = ["INSERT OR IGNORE INTO DetailedNotesAttachment(DNID, Attachment_ID, File_Name, File_Type, File_Path, Attachment_Type, Sync_Status, Date, Created_By, Created_Date, Modified_By, Modified_Date, task_number, Attachment_Status) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"];
        let queryParams = []
        queryParams.push(data.dnid)
        queryParams.push(data.attachment_id)
        queryParams.push(data.file_name)
        queryParams.push(data.file_type)
        queryParams.push(data.filepath)
        queryParams.push(data.attachment_type)
        queryParams.push(true)
        queryParams.push(data.attachment_entry_date)
        queryParams.push(data.attachment_created_by)
        queryParams.push(data.attachment_created_date)
        queryParams.push(data.attachment_modified_by)
        queryParams.push(data.attachment_modified_date)
        queryParams.push(data.task_number);
        queryParams.push(String(isPhysicalFileCreated));
        sqlInsert.push(queryParams);
        reportBatch.push(sqlInsert)
      }

    }
    return this.insertBatchData(reportBatch, "insertReportData");
  }

  updateDetailedNotesAttachmentStatus(jsonData) {
    let idArr = jsonData.filter(item => item.attachment_status == "true").map(item => item.attachment_id);
    let query = `UPDATE DetailedNotesAttachment SET Attachment_Status = 'true' WHERE Attachment_ID in (${idArr.toString()})`;
    let queryParams = [];
    return this.insertData(query, [], "updateDetailedNotesAttachmentStatus");
  }

  /**
    * 02/11/2019 -- Mayur Varshney
    * insert/update report attachment getting from DBCS
    * @param {*} attachmentArr
    * @returns
    * @memberof LocalServiceProvider
    */
  insertAttachmentListBatchDBCS(attachmentArr) {
    let sqlBatchStmt = [];
    for (let k in attachmentArr) {
      let data = attachmentArr[k];
      if (data != undefined || data != null) {
        let stmtValues = [];
        let sqlInsert: any[] = ["INSERT OR IGNORE INTO Attachment(File_Name, File_Type, File_Path, Type, AttachmentType, Created_Date, Task_Number, SRID, ResourceId, ORACLEDBID, Attachment_Id, Attachment_Status, Sync_Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"];
        stmtValues.push(data.file_name);
        stmtValues.push(data.file_type);
        stmtValues.push(data.file_path);
        stmtValues.push(data.type);
        stmtValues.push(data.attachmenttype);
        stmtValues.push(data.created_date);
        stmtValues.push(data.task_number);
        stmtValues.push(data.srid);
        stmtValues.push(this.valueProvider.getResourceId());
        stmtValues.push(data.oracledbid);
        stmtValues.push(parseInt(data.attachment_id));
        stmtValues.push(false);
        stmtValues.push(true);
        sqlInsert.push(stmtValues);
        sqlBatchStmt.push(sqlInsert);
      }
    }
    return this.insertBatchData(sqlBatchStmt, 'insertAttachmentListBatchDBCS');
  }

  /**
    * 02/12/2019 -- Mayur Varshney
    * get FCRReport attachment getting from local db
    * @returns
    * @memberof LocalServiceProvider
    */
  getFCRReportAttachment() {
    let query = "SELECT at.* FROM Attachment at INNER JOIN Task t ON t.Task_Number = at.Task_Number INNER JOIN SDRREPORT sr ON sr.ReportID = at.Task_Number WHERE t.StatusID = ? AND t.IsStandalone = ? AND at.Attachment_Status = ?";
    let queryParams = [Enums.Jobstatus.Completed_Awaiting_Review, 'true', 'false'];
    return this.getList(query, queryParams, 'getFCRReportAttachment');
  }

  getWorkFlowElementForTag(elementId, ReportID_Mobile) {
    let query = "select Value from reportData where ELEMENTID = ? AND ReportID_Mobile = ?"
    // let queryParams = [130114,ReportID_Mobile ];
    let queryParams = [elementId, ReportID_Mobile];
    return this.getList(query, queryParams, 'getWorkFlowElementForTag')
  }

  //09/28/2019 Pulkit -- function to get StatusID from Task table
  getStatusID(ProjectNumber) {
    let query = "select StatusID from Task where Task_Number=?"
    let queryParams = [ProjectNumber];
    return this.getList(query, queryParams, 'getStatusID')
  }

  //03/12/2019 Pulkit -- function to get Projects from MST_Project table
  getProjects(clarityID) {
    // let query = "select MP.* from (SELECT Project,RESOURCE_CODE FROM MST_Team_Projects UNION SELECT Project,RESOURCE_CODE FROM MST_Assignment_Projects) MTAP INNER JOIN MST_Project MP on MP.P_PROJECTNUMBER=MTAP.PROJECT INNER JOIN MST_TaskName MT on MT.Project=MP.OSC_ID where RESOURCE_CODE=? ORDER BY MP.P_PROJECTNUMBER;"
    let query = "select MP.* from (SELECT Project,RESOURCE_CODE FROM MST_Team_Projects UNION SELECT Project,RESOURCE_CODE FROM MST_Assignment_Projects) MTAP INNER JOIN MST_Project MP on MP.P_PROJECTNUMBER=MTAP.PROJECT  where RESOURCE_CODE=? ORDER BY MP.P_PROJECTNUMBER;"
    let queryParams = [clarityID];
    return this.getList(query, queryParams, 'getProjectsList')
  }

  //03/12/2019 Pulkit -- function to get Projects from MST table
  public getMSTData(tableName, project?, orderBy?) {
    let isProject: any = [project];
    let query = '';
    query = "SELECT * FROM " + tableName;
    if (project) {
      query += " where PROJECT =  ? ";
    }
    else {
      isProject = '';
    }
    if (orderBy) {
      query += " ORDER BY " + orderBy;
    }
    return this.getList(query, isProject, "setTask");
  }

  public getMSTAssignmentTask(project) {
    let query = '';
    query = `Select TN.* from MST_TaskName TN
    INNER JOIN MST_Assignment_Projects AP on AP.TASK_CODE=TN.TASK_CODE and AP.PROJECT = TN.PROJECT
    INNER JOIN MST_Project MP ON MP.P_PROJECTNUMBER = TN.PROJECT
    where MP.OSC_ID = ? and AP.Resource_code=?
    union
    Select TN.* from MST_TaskName TN
    INNER JOIN MST_Team_Projects TP on TP.PROJECT = TN.PROJECT
    INNER JOIN MST_Project MP ON MP.P_PROJECTNUMBER = TN.PROJECT
    where MP.OSC_ID = ? and TP.Resource_code= ?
    Order By TASK_NAME `;
    return this.getList(query, [project, this.valueProvider.getUser().ClarityID, project, this.valueProvider.getUser().ClarityID], "setTask");
  }

  //03/12/2019 Preeti Varshney -- function to get Time rows of selected week from Time table
  public getTimeRows(weekStart, weekEnd, fromImport?) {
    let query = '';
    //09/16/2019 Preeti Varshney  query changes.
    query = "Select Time.*,CASE WHEN Task.StatusID is NULL AND Time.Job_Number != 'Not Applicable' THEN ? WHEN Time.Job_Number = 'Not Applicable' then ? ELSE Task.StatusID END AS StatusID,Task.IsDeclined IsDeclined,(SELECT tm.Time_Id FROM Time tm WHERE tm.Original = time.Time_Id) As CurrentMobileId from Time INNER JOIN Task on task.Task_Number=Time.Task_Number where CurrentMobileId IS NULL and Time.EntryDate between ? And ? And Time.isDeleted = 'false' AND Time.OracleDBID = " + this.valueProvider.getUserId();
    if (fromImport) {
      query += " AND Task.StatusID NOT IN (" + Enums.Jobstatus.Completed_Awaiting_Review + ")";
    }
    // query += " ORDER BY Time.ModifiedDate desc";
    query += " ORDER BY Time.ENTRYDATE";
    return this.getList(query, [Enums.Jobstatus.Completed_Awaiting_Review, Enums.Jobstatus.Debrief_Started, weekStart, weekEnd], "getTimeRows");
  }

  /**
   *04-03-2019 Radheshyam kumar
   * Get World Area by id
   * @param {*} id
   * @returns
   * @memberof LocalServiceProvider
   */
  getWorldAreaByID(id) {
    return this.getList("SELECT * FROM Lookups WHERE LookupID = " + id, '', 'getWorldAreaByID');
  }

  deleteAccordionData(AccordionItem, currentWorkFlowIDToSkip, ReportID_Mobile, IsPrePopulated) {
    let subQuery;
    let query;
    let queryParams;
    if (!IsPrePopulated) {
      subQuery = "(select RD.RDID_Mobile from ReportData RD left outer join WorkFlowElements WFE on WFE.elementid = RD.ElementID where WFE.elementtype = ? and RD.Value = ? AND ReportID_Mobile = ?)";
      query = "DELETE FROM ReportData WHERE RDID_Mobile in " + subQuery + " OR ParentID_Mobile in " + subQuery;
      queryParams = [Enums.ElementType.Accordion, AccordionItem, ReportID_Mobile, Enums.ElementType.Accordion, AccordionItem, ReportID_Mobile];
    } else {
      subQuery = "(select RD.RDID_Mobile from ReportData RD left outer join WorkFlowElements WFE on WFE.elementid = RD.ElementID where WFE.elementtype = ? and RD.Value = ? and WFE.WorkflowID == ? AND ReportID_Mobile = ?)";
      query = "DELETE FROM ReportData WHERE RDID_Mobile in " + subQuery + " OR ParentID_Mobile in " + subQuery;
      queryParams = [Enums.ElementType.Accordion, AccordionItem, currentWorkFlowIDToSkip, ReportID_Mobile, Enums.ElementType.Accordion, AccordionItem, currentWorkFlowIDToSkip, ReportID_Mobile];
    }
    return this.insertData(query, queryParams, "deleteAccordionData");
  }

  /**
    *@author:Prateek 03/13/2019
    *Query to fetch time data day wise
    */
  public getDayRow(day) {
    let query = '';
    query = "Select * from Time Where EntryDate=?";
    return this.getList(query, [day], "getDayRows");
  }

  /**
    *@author:Prateek 03/13/2019
    *Query to fetch chargetype day wise
    */
  // public getchargeType() {
  //   let query = '';
  //   query = "Select * from ChargeType";
  //   return this.getList(query, '', "getChargeRows");
  // }

  /**
    *@author:Prateek 03/13/2019
    *Query to fetch WorkType day wise
    */
  // public getworkType() {
  //   let query = '';
  //   query = "Select * from WorkType"
  //   return this.getList(query, '', "getWorktypeRows");
  // }

  /**
  *@author:Prateek 03/13/2019
  *Query to fetch chargetype day wise
  */
  // public getcountryType() {
  //   let query = '';
  //   query = "Select * from Country order by Country_Name asc";
  //   return this.getList(query, '', "getCountryRows");
  // }

  public getActivityName() {
    let activityName = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "Select * from MST_ActivityName GROUP BY OP_Code";
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              activityName.push(item);
            }
          }
          resolve(activityName);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getActivityName', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  getActivityNameByWorkTypeId(workTypeId) {
    let activityName = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "select op_code, ID from MST_ActivityName WHERE OP_CODE_ID = (SELECT OP_CODE_ID FROM MST_ActivityName WHERE ID = (SELECT WORK_TYPE_ID FROM TIME WHERE WORK_TYPE_ID = " + workTypeId + ")) Group By OP_CODE";
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              activityName.push(item);
            }
          }
          resolve(activityName);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getActivityName', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  public getShiftCodes() {
    let shiftCode = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "Select Shift_Code,Id from MST_ActivityName order by OP_Code asc LIMIT 4";
      this.dbctrl.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              shiftCode.push(item);
            }
          }
          resolve(shiftCode);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getShiftCodes', 'Error TXN: ' + JSON.stringify(error.message));
          reject(error);
        }));
      });
    });
  }

  getNonClarityTimeRows(weekStart, weekEnd, fromImport?) {
    // Preeti Varshney 05/06/2019 modify query
    let query = "Select  CASE tk.IsStandalone WHEN 'false' THEN tk.Task_Number WHEN 'true' THEN tk.Job_Number else TM.TASK_NUMBER END AS Task_Number,CASE WHEN tk.StatusID is NULL AND tm.Job_Number != 'Not Applicable' THEN ? WHEN tm.Job_Number = 'Not Applicable' then ? ELSE tk.StatusID END AS StatusID,tm.Task_Number as 'Primary_Key',tm.Time_Id,tm.Charge_Method,tm.Charge_Method_Id,tm.Work_Type,tm.Work_Type_Id,tm.DB_Syncstatus,tm.Item,Item_Id,tm.Description,tm.Time_Code,tm.Shift_Code,tm.Date,tm.Duration,tm.Comments,tm.Start_Time,tm.End_Time,tm.SerialNumber,tm.TagNumber,tm.DB_Syncstatus,tm.EntryDate,tm.Job_Number,tm.Job_Type,tm.isSubmitted,tm.Service_Start_Date,tm.Service_End_Date,tm.Service_End_Date,tm.OracleDBID,tm.ModifiedDate,tm.Travel_Allowance,tm.Overtime_multiplier,tm.Overtime_hours,tm.isPicked,tm.Work_Type_OT,tm.Shift_Site,tm.IsAdditional,tm.Original,tm.Sync_Status, (SELECT tim.Time_Id FROM Time tim WHERE tim.Original = tm.Time_Id) As CurrentMobileId from Time tm LEFT JOIN Task tk ON tm.Task_Number = tk.Task_Number where CurrentMobileId IS NULL and tm.OracleDBID = " + this.valueProvider.getUserId() + " and tm.EntryDate between   ? AND ? and tm.isDeleted='false'";
    let queryParams = [];
    queryParams.push(Enums.Jobstatus.Completed_Awaiting_Review);
    queryParams.push(Enums.Jobstatus.Debrief_Started);
    queryParams.push()
    queryParams.push(weekStart)
    queryParams.push(weekEnd)
    //query = "Select CASE tk.IsStandalone WHEN 'false' THEN tk.Task_Number WHEN 'true' THEN tk.Job_Number END AS Task_Number,tk.Task_Number as 'Primary_Key',tm.Time_Id,tm.Charge_Method,tm.Work_Type,tm.Item,tm.Description,tm.Time_Code,tm.Shift_Code,tm.Duration,tm.Comments,tm.Start_Time,tm.End_Time,tm.SerialNumber,tm.TagNumber,tm.EntryDate,tm.DB_Syncstatus from Time tm INNER JOIN Task tk ON tm.Task_Number = tk.Task_Number where tm.EntryDate between   ? AND ? order by tm.time_id desc";
    //query = "Select Time_Id,Charge_Method,Work_Type,Item,Description,Time_Code,Shift_Code,Duration,Comments,Task_Number,Start_Time,End_Time,SerialNumber,TagNumber,EntryDate  from Time  where EntryDate between   ? AND ? order by Time_Id Desc ";
    if (fromImport) {
      query += " AND tk.StatusID NOT IN (" + Enums.Jobstatus.Completed_Awaiting_Review + ")";

      query += "union Select null as 'Task_number',null as 'StatusID',tm.Task_Number as 'Primary_Key', tm.Time_Id,tm.Charge_Method,tm.Charge_Method_Id,tm.Work_Type,tm.Work_Type_Id,tm.DB_Syncstatus,tm.Item,Item_Id,tm.Description,tm.Time_Code,tm.Shift_Code,tm.Date,tm.Duration,tm.Comments,tm.Start_Time,tm.End_Time,tm.SerialNumber,tm.TagNumber,tm.DB_Syncstatus,tm.EntryDate,tm.Job_Number,tm.Job_Type,tm.isSubmitted,tm.Service_Start_Date,tm.Service_End_Date,tm.Service_End_Date,tm.OracleDBID,tm.ModifiedDate,tm.Travel_Allowance,tm.Overtime_multiplier,tm.Overtime_hours,tm.isPicked,tm.Work_Type_OT,tm.Shift_Site ,tm.IsAdditional,tm.Original,tm.Sync_Status, (SELECT tim.Time_Id FROM Time tim WHERE tim.Original = tm.Time_Id) As CurrentMobileId from Time tm where tm.OracleDBID = " + this.valueProvider.getUserId() + " and tm.EntryDate between   ? AND ? and tm.isDeleted='false' AND tm.job_type = 'vacation'";
      queryParams.push(weekStart);
      queryParams.push(weekEnd);
    }
    query += "order by tm.Start_Time,tm.EntryDate";
    return this.getList(query, queryParams, "getNonClarityTimeRows");
  }

  // getTaskForTimeSheet() {
  //   //03/19/2019 -- Zohaib Khan -- Getting list of all tasks where StatusId != Completed Awaiting rewiew
  //   let value = [];
  //   return new Promise((resolve, reject) => {
  //     this.dbctrl.getDB().transaction((transaction) => {
  //       transaction.executeSql("SELECT * FROM Task WHERE StatusID != ?", [String(Enums.Jobstatus.Completed_Awaiting_Review)], (tx, res) => {
  //         let rowLength = res.rows.length;
  //         //console.log(rowLength);
  //         for (let i = 0; i < rowLength; i++) {
  //           value.push(res.rows.item(i));
  //         }
  //         resolve(value);
  //       }, (tx, error) => {
  //         this.logger.log(this.fileName, 'getTaskForTimeSheet', 'Error: ' + JSON.stringify(error.message));
  //         reject(error);
  //       });

  //     }, (error) => {
  //       this.logger.log(this.fileName, 'getTaskForTimeSheet', 'Error TXN: ' + JSON.stringify(error.message));
  //       reject(error);
  //     });
  //   });
  // };

  //04/01/2019 -- Prateek -- Query Optimized Getting list of all tasks where StatusId =Debrief_In_Progress Debrief_Started Debrief_Declined Completed_Awaiting_Review Accepted
  getTaskForTimeSheet(adv?) {
    let query = '';
    // query = "select CASE IsStandalone WHEN 'false' THEN Task_Number ELSE Job_Number END As Task_Number, Task_Number as PrimaryKey From Task  where StatusID in (" + Enums.Jobstatus.Debrief_In_Progress + "," + Enums.Jobstatus.Debrief_Started + "," + Enums.Jobstatus.Debrief_Declined + "," + Enums.Jobstatus.Completed_Awaiting_Review + "," + Enums.Jobstatus.Accepted + ")";
    if (adv) {
      // query = "select CASE IsStandalone WHEN 'false' THEN Task_Number ELSE Job_Number END As Task_Number, Task_Number as PrimaryKey From Task  where OracleDBID = " + this.valueProvider.getUserId() + " AND StatusID in (" + Enums.Jobstatus.Debrief_In_Progress + "," + Enums.Jobstatus.Debrief_Started + "," + Enums.Jobstatus.Debrief_Declined + "," + Enums.Jobstatus.Completed_Awaiting_Review + ")";
      query = "select distinct job_number AS Task_Number, Task_Number AS PrimaryKey from Time where OracleDBID =" + this.valueProvider.getUserId() + " and isDeleted = 'false' and entryDate >= date('now','-90 day') order by task_number";
    }
    else {
      query = "select CASE IsStandalone WHEN 'false' THEN Task_Number ELSE Job_Number END As Task_Number, Task_Number as PrimaryKey From Task  where OracleDBID = " + this.valueProvider.getUserId() + " AND StatusID in (" + Enums.Jobstatus.Debrief_In_Progress + "," + Enums.Jobstatus.Debrief_Started + "," + Enums.Jobstatus.Debrief_Declined + ")";
    }
    return this.getList(query, '', "getTaskForTimeSheet");
  }

  //04/10/2019 -- Preeti Varshney -- update query to be executed in loop to check for duplicate time entry
  getCountforMatchedTime(responseList, check, searchDates, nightShift) {
    let query = '';
    let params = [];
    // for (let i = 0; i < responseList.length; i++) {
    let TimeId = responseList[0].Time_Id;
    if (nightShift) {
      query = "select EntryDate, Time_Id, Start_Time, End_Time, Job_Number, (SELECT tmp.Time_Id FROM Time tmp WHERE tmp.Original = Time.Time_Id) As CurrentMobileId FROM Time WHERE CurrentMobileId IS NULL AND ( (EntryDate BETWEEN ? AND ?) AND ((? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? < TIME(Start_Time) AND ? > TIME(End_Time))) OR (EntryDate BETWEEN ? AND ?) AND ((? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? < TIME(Start_Time) AND ? > TIME(End_Time))) ) and OracleDBID = ? and isDeleted='false' order by EntryDate, Start_Time desc;";
    } else {
      if (TimeId != null) {
        query = "select EntryDate, Time_Id, Start_Time, End_Time, Job_Number, (SELECT tmp.Time_Id FROM Time tmp WHERE tmp.Original = Time.Time_Id) As CurrentMobileId FROM Time WHERE CurrentMobileId IS NULL AND ( (EntryDate BETWEEN ? AND ?) AND ((? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? BETWEEN TIME(Start_Time) AND (End_Time)) OR (? < TIME(Start_Time) AND ? > TIME(End_Time))) AND Time_Id != ? ) and OracleDBID = ? and isDeleted='false' order by EntryDate, Start_Time desc";
      } else {
        query = "select EntryDate, Time_Id, Start_Time, End_Time, Job_Number, (SELECT tmp.Time_Id FROM Time tmp WHERE tmp.Original = Time.Time_Id) As CurrentMobileId FROM Time WHERE CurrentMobileId IS NULL AND ( (EntryDate BETWEEN ? AND ?) AND ( (? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? < TIME(Start_Time) AND ? > TIME(End_Time))) ) and OracleDBID = ? and isDeleted='false' order by EntryDate, Start_Time desc;";
      }
    }
    // Check double entry times between start date - end date
    params.push(searchDates.startDate);
    params.push(searchDates.endDate);
    // To check start time
    if (check == "secondCheck") {
      let startTime = responseList[0].Start_Time.split(":");
      let minutes = (startTime[1] == "00") ? parseInt(startTime[1]) + 2 : parseInt(startTime[1]) + 1; // startTime[1] = "01"; // Add 1 min to time
      let time = (minutes < 9) ? startTime[0] + ":0" + minutes : startTime[0] + ":" + minutes;
      params.push(time);
    } else {
      params.push(responseList[0].Start_Time);
    }
    params.push(responseList[0].End_Time);
    params.push(responseList[0].Start_Time);
    params.push(responseList[0].End_Time);

    // Only for night shift entries
    if (nightShift) {
      params.push(searchDates.endDate);
      params.push(searchDates.endDate);
      if (check == "secondCheck") {
        let startTime = responseList[1].Start_Time.split(":");
        let minutes = (startTime[1] == "00") ? parseInt(startTime[1]) + 2 : parseInt(startTime[1]) + 1; // startTime[1] = "01"; // Add 1 min to time
        let time = (minutes < 9) ? startTime[0] + ":0" + minutes : startTime[0] + ":" + minutes;
        params.push(time);
      } else {
        params.push(responseList[1].Start_Time);
      }
      params.push(responseList[1].End_Time);
      params.push(responseList[1].Start_Time);
      params.push(responseList[1].End_Time);
    }

    if (TimeId != null) {
      params.push(responseList[0].Time_Id);
    }
    params.push(this.valueProvider.getUserId());
    return this.getList(query, params, "get count for matched time");
    // }
  };



  public getAllWorkflows(workflowGroupId, TemplateID, DeviceID) {
    //let query = "SELECT BG.BusinessGroupID as LookupID, BG.BusinessGroupName as LookupValue, BG.* FROM BusinessGroup BG;";
    let queryParams = [TemplateID, "Y", workflowGroupId, DeviceID, "Y", workflowGroupId, TemplateID, "Y", DeviceID];
    return this.getList("SELECT W.*,L.DisplayOrder as StatusOrder, NULL as NextTab FROM WorkFlow W LEFT OUTER JOIN Lookups L ON l.LookupID = W.StatusToChange where W.WorkFlowGroupID IS NULL  and W.TemplateID = ? and W.IsActive = ? UNION SELECT W.*, L.DisplayOrder AS StatusOrder, (Select W1.TabTitle from WorkFlow W1 INNER JOIN WorkflowProductMapping WPF1 ON WPF1.WorkflowGroupID = W1.WorkFlowGroupID AND WPF1.WorkflowID =W1.WorkFlowID  Where  W.WorkFlowGroupID = ?  and WPF1.ProductID = ? AND W1.IsActive = ?  and W1.DisplayOrder > W.DisplayOrder Order by W1.DisplayOrder  Limit 1) as NextTab FROM WorkFlow W INNER JOIN WorkflowProductMapping WPF ON WPF.WorkflowGroupID = W.WorkFlowGroupID AND WPF.WorkflowID =W.WorkFlowID  LEFT OUTER JOIN Lookups L ON l.LookupID = W.StatusToChange WHERE W.WorkFlowGroupID = ?  AND W.TemplateID = ? AND W.IsActive = ? AND WPF.ProductID = ? ORDER BY W.DisplayOrder ASC", queryParams, "getAllWorkflows");
  }

  /**
   *@Prateek 04/04/2019
   *Select query for getting latest entry data in desending order.
   */
  public lastWeekentryDate(today) {
    let query = '';
    let params = [today];
    // query = "select max(entrydate) as EntryDate from time order by EntryDate Desc";
    query = "select max(entrydate) as EntryDate from time where OracleDBID = " + this.valueProvider.getUserId() + " and isDeleted = 'false' and EntryDate < ? order by EntryDate Desc";
    return this.getList(query, params, "lastWeekentryDate");
  }

  /**
   * 04-09-2019 Gurkirat Singh
   * Insert/ Update Lookups in SQLite DB Batch
   *
   * @param {*} jsonData
   * @returns
   * @memberof LocalServiceProvider
   */
  insertLookupsBatch(jsonData) {
    if (jsonData.length) {
      let batchArr = [];
      for (let k in jsonData) {
        let data = jsonData[k];
        let sqlInsert: any[] = ["INSERT OR REPLACE INTO Lookups(LookupID, LookupType, LookupValue, LookupCode, IsActive, Type, DisplayOrder, ParentID, ParentReferenceID, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate) VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?)"];
        let queryParams = []
        queryParams.push(data.lookupid);
        queryParams.push(data.lookuptype);
        queryParams.push(data.lookupvalue);
        queryParams.push(data.lookupcode);
        queryParams.push(data.isactive);
        queryParams.push(data.type);
        queryParams.push(data.displayorder);
        queryParams.push(data.parentid);
        queryParams.push(data.parentreferenceid);
        queryParams.push(data.createdby);
        queryParams.push(data.createddate);
        queryParams.push(data.modifiedby);
        queryParams.push(data.modifieddate);
        sqlInsert.push(queryParams);
        batchArr.push(sqlInsert);
      }
      return this.insertBatchData(batchArr, "insertLookupsBatch");
    }
  }

  updateTimeEntry(id, flag, entireList?) {
    let sqlUpdate;
    return new Promise((resolve, reject) => {
      //this.logger.log(this.fileName,'function',"USER UPDATE OBJECT =====> " + JSON.stringify(userObject));
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        if (entireList) {
          sqlUpdate = "UPDATE Time SET isPicked = ? WHERE Task_Number = ? AND (isSubmitted = 'false' OR isSubmitted='') AND Job_Type  is not 'vacation'";
        } else {
          sqlUpdate = "UPDATE Time SET isPicked = ? WHERE Time_Id = ? AND (isSubmitted = 'false' OR isSubmitted='') AND Job_Type is not 'vacation'";
        }
        insertValues.push(flag);
        insertValues.push(id);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          resolve(true);
        }, (tx, error) => {
          resolve(false);
          this.logger.log(this.fileName, 'updateTimeEntry', 'Error: ' + JSON.stringify(error.message));
        });
      }, (error) => {
        resolve(false);
        this.logger.log(this.fileName, 'updateTimeEntry', 'Error TXN: ' + JSON.stringify(error.message));
      });
    });
  };
  updateTimeEntryNOC(id, flag, entireList?) {
    let sqlUpdate;
    return new Promise((resolve, reject) => {
      //this.logger.log(this.fileName,'function',"USER UPDATE OBJECT =====> " + JSON.stringify(userObject));
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        sqlUpdate = "UPDATE Time SET isPicked = ? WHERE Time_Id = ? AND (isSubmitted = 'false' OR isSubmitted='') AND Job_Type is not 'vacation'";
        insertValues.push(flag);
        insertValues.push(id);
        transaction.executeSql(sqlUpdate, insertValues, (tx, res) => {
          resolve(true);
        }, (tx, error) => {
          resolve(false);
          this.logger.log(this.fileName, 'updateTimeEntry', 'Error: ' + JSON.stringify(error.message));
        });
      }, (error) => {
        resolve(false);
        this.logger.log(this.fileName, 'updateTimeEntry', 'Error TXN: ' + JSON.stringify(error.message));
      });
    });
  };
  /**
   *@Vivek 17/04/2019
   *Select query for Advance search.
   */
  public advanceSearch(params, issubmit) {
    let query = '';
    let queryParams = [];
    queryParams.push(Enums.Jobstatus.Completed_Awaiting_Review);
    queryParams.push(Enums.Jobstatus.Debrief_Started);
    if (issubmit == "true") {
      query = "SELECT tm.*,CASE WHEN tk.StatusID is NULL AND tm.Job_Number != 'Not Applicable' THEN ? WHEN tm.Job_Number = 'Not Applicable' then ? ELSE tk.StatusID END AS StatusID,CASE tk.IsStandalone WHEN 'false' THEN tk.Task_Number WHEN 'true' THEN tk.Job_Number ELSE TM.TASK_NUMBER END AS Task_Number, tm.Task_Number as 'Primary_Key', (SELECT tim.Time_Id FROM Time tim WHERE tim.Original = tm.Time_Id) As CurrentMobileId FROM Time tm LEFT JOIN Task tk ON tm.Task_Number = tk.Task_Number where CurrentMobileId IS NULL and tm.DB_Syncstatus='false' AND tm.isDeleted='false' AND tm.OracleDBID = " + this.valueProvider.getUserId() + " and tm.EntryDate between '" + params.date_from + "' AND '" + params.date_to + "'";
    }
    else {
      query = "SELECT tm.*,CASE WHEN tk.StatusID is NULL AND tm.Job_Number != 'Not Applicable' THEN ? WHEN tm.Job_Number = 'Not Applicable' then ? ELSE tk.StatusID END AS StatusID,CASE tk.IsStandalone WHEN 'false' THEN tk.Task_Number WHEN 'true' THEN tk.Job_Number ELSE TM.TASK_NUMBER END AS Task_Number, tm.Task_Number as 'Primary_Key', (SELECT tim.Time_Id FROM Time tim WHERE tim.Original = tm.Time_Id) As CurrentMobileId FROM Time tm LEFT JOIN Task tk ON tm.Task_Number = tk.Task_Number where CurrentMobileId IS NULL and tm.isDeleted='false' and tm.OracleDBID = " + this.valueProvider.getUserId() + " and tm.EntryDate between '" + params.date_from + "' AND '" + params.date_to + "'";

    }
    //Change the query to select the job number and DB_Syncstatus

    if (params.Job_Number != '' && params.Job_Number != undefined) {
      query += " AND tm.Job_Number like ?";
      queryParams.push(`%${params.Job_Number}%`);
    }

    if (params.Work_Type != '' && params.Work_Type != undefined && params.Work_Type != 'No Value') {
      query += " AND tm.Work_Type = ?";
      queryParams.push(params.Work_Type);
    }
    if (params.Item != '' && params.Item != undefined && params.Item != 'No Value') {
      query += " AND tm.Item = ?";
      queryParams.push(params.Item);
    }
    if (params.TagNumber != '' && params.TagNumber != undefined) {
      query += " AND tm.TagNumber like ?";
      queryParams.push(`%${params.TagNumber}%`);
    }
    if (params.SerialNumber != '' && params.SerialNumber != undefined) {
      query += " AND tm.SerialNumber like ?";
      queryParams.push(`%${params.SerialNumber}%`);
    }
    if (params.Charge_Method != '' && params.Charge_Method != undefined && params.Charge_Method != 'No Value') {
      query += " AND tm.Charge_Method = ?";
      queryParams.push(params.Charge_Method);
    }
    if (params.AbsenceType != '' && params.AbsenceType != undefined && params.AbsenceType != 'No Value') {
      query += " AND tm.Work_Type = ?";
      queryParams.push(params.AbsenceType);
    }
    //Preeti Varshney 05/09/2019 order by entryDate and start time
    query += " order by tm.EntryDate,tm.Start_Time";
    return this.getList(query, queryParams, "advanceSearch");
  }

  // public getTimeEntry(taskno) {
  //   let query = '';
  //   let params=[];
  //   query = "select * from Task where Task_Number=(select Task_Number from Time where Task_Number=? AND DB_Syncstatus='false');";
  //   params.push(taskno)
  //   return this.getList(query, params, "getTimeEntry");
  // }

  /**
     *@Prateek 17/04/2019
    *Select query for getting latest entry data in desending order.
    */
  public getTimeEntry(weekStart, weekEnd) {
    let query = '';
    let params = [this.valueProvider.getUserId(), weekStart, weekEnd];
    // query = "select * from time where DB_Syncstatus='false'";
    query = "select * from time where OracleDBID = ? and isSubmitted='false' AND EntryDate between ? AND ?";
    return this.getList(query, params, "getTimeEntry");
  }

  updateTimeStatus(responseList) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let sqlBatchStmt = [];
        let stmtValues;
        for (let k in responseList) {
          let timeList = responseList[k];
          stmtValues = [];
          let sqlUpdate: any[] = ["UPDATE Time SET DB_Syncstatus = 'true' , isSubmitted='true' where Time_Id = ?"];
          stmtValues.push(timeList.Time_Id);
          sqlUpdate.push(stmtValues);
          sqlBatchStmt.push(sqlUpdate);
        }
        // this.logger.log(this.fileName, 'updateContactId', "Updated contact id's :" + JSON.stringify(stmtValues));
        this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (tx, res) => {

          resolve(responseList);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateTimeStatus', "Error : " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateTimeStatus', "Error TXN : " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  updateTimeSyncStatus(responseList) {
    let sqlBatchStmt = [];
    let sqlUpdate: any[]
    for (let k in responseList) {
      let timeList = responseList[k];
      sqlUpdate = ["UPDATE Time SET DB_Syncstatus = 'true' where Time_Id = " + timeList.Time_Id];
      sqlBatchStmt.push(sqlUpdate);
    }
    return this.insertBatchData(sqlBatchStmt, "updateTimeSyncStatus");
  }

  /**
   * 
   * @param responseList 
   */
  updateAllowanceSyncStatus(responseList) {
    let sqlBatchStmt = [];
    for (let k in responseList) {
      let timeList = responseList[k];
      let sqlUpdate: any[] = ["UPDATE Allowance SET DB_SYNCSTATUS = 'true', ISSUBMITTED = 'true' where ALLOWANCEID =" + timeList.ALLOWANCEID];
      sqlBatchStmt.push(sqlUpdate);
    }
    return this.insertBatchData(sqlBatchStmt, "updateAllowanceSyncStatus");
  }

  /**
   *@ Prateek 02/05/2019
   *Get job related to job id
   */
  getJobType(taskId) {
    //console.log("Task ID==>", taskId);
    let queryParams = [taskId];
    let query = "Select ElementID,Value from ReportData where ReportID_Mobile = ? AND (ElementID = '130107' OR ElementID = '130108')"
    return this.getList(query, queryParams, 'getJobType');
  }

  /**
  *Prateek 05/04/2019
  *Get job_type from time table.
  */
  getJobTypetime(timeId) {
    //console.log("Time ID==>", timeId); // Job_Number replace with Time_Id
    let queryParams = [timeId];
    let query = "Select Job_Type from Time where Time_Id = ? "
    return this.getList(query, queryParams, 'getJobTypetime');
  }

  /**
    *Prateek 05/04/2019
    *Get job_type from time table.
    */
  getSTjob(Shift_Code) {
    //console.log("shift code==>", Shift_Code);
    let queryParams = [Shift_Code];
    let query = "Select OP_Code_ID from MST_ActivityName where OP_Code = ? "
    return this.getList(query, queryParams, 'getJobType');
  }


  /**
   * 05/07/2019 -- Mayur Varshney
   * Insert/Update internalTimeEntry in db on Sync
   * @param {any} timeData
   * @memberOf LocalServiceProvider
   */
  saveInternalTimeList(timeData) {
    let batchArr = [];
    for (let k in timeData) {
      let data = timeData[k];

      let sqlUpdate: any[] = ["UPDATE Time SET timeDefault = ?, Field_Job_Name = ?, Field_Job_Name_Id = ?, Charge_Type = ?, Charge_Type_Id = ?, Charge_Method = ?, Charge_Method_Id = ?, Work_Type = ?, Work_Type_Id = ?,Work_Type_OT = ?, Item = ?, Item_Id = ?, Description = ?, Time_Code = ?, Time_Code_Id = ?, Time_Code_Value = ?, Shift_Code = ?, Shift_Code_Id = ?, Shift_Code_Value = ?, Date = ?, Duration = ?, Comments = ?, Task_Number = ?, ResourceId = ?, Start_Time = ?, End_Time = ?, Service_End_Date = ?, Service_Start_Date = ?, Original = ?, DebriefStatus = ?, IsAdditional = ?, OracleDBID = ?, State = ?, City = ?, Total_Hours = ?, Country_Code = ?, EntryDate = ?, Clarity_Task_Id = ?, Notes = ?, SerialNumber = ?, TagNumber = ?, isPicked = ?, DB_Syncstatus = ?, ModifiedDate = ?, Job_Number = ?, Job_Type = ?,Sync_Status=?,isDeleted=?,isSubmitted=?,Import_Level = ?,Clarity_Project=?,Clarity_Project_Id = ? WHERE Time_Id = ? AND DB_Syncstatus='true'"];

      let sqlInsert: any[] = ["INSERT OR REPLACE INTO Time(timeDefault, Field_Job_Name, Field_Job_Name_Id, Charge_Type, Charge_Type_Id, Charge_Method, Charge_Method_Id, Work_Type, Work_Type_Id,Work_Type_OT,Item, Item_Id, Description, Time_Code, Time_Code_Id, Time_Code_Value, Shift_Code, Shift_Code_Id, Shift_Code_Value, Date, Duration, Comments, Task_Number, ResourceId, Start_Time, End_Time, Service_End_Date, Service_Start_Date, Original, DebriefStatus, IsAdditional, OracleDBID, State, City, Total_Hours, Country_Code, EntryDate, Clarity_Task_Id, Notes, SerialNumber, TagNumber, isPicked, DB_Syncstatus, ModifiedDate, Job_Number, Job_Type,Sync_Status,isDeleted,isSubmitted,Import_Level,Clarity_Project,Clarity_Project_Id,Time_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)"];

      let queryParams = [];
      queryParams.push(data.timedefault);
      queryParams.push(data.field_job_name);
      queryParams.push(data.field_job_name_id);
      queryParams.push(data.charge_type);
      queryParams.push(data.charge_type_id);
      queryParams.push(data.charge_method);
      queryParams.push(data.charge_method_id);
      queryParams.push(data.work_type);
      queryParams.push(data.work_type_id);
      queryParams.push(data.work_type_ot);
      queryParams.push(data.item);
      queryParams.push(data.item_id);
      queryParams.push(data.description);
      queryParams.push(data.time_code);
      queryParams.push(data.time_code_id);
      queryParams.push(data.time_code_value);
      queryParams.push(data.shift_code);
      queryParams.push(data.shift_code_id);
      queryParams.push(data.shift_code_value);
      queryParams.push(moment.utc(data.created_date, 'DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A').local().toDate());
      queryParams.push(data.duration);
      queryParams.push(data.comments);
      queryParams.push(data.task_number);
      queryParams.push(data.resourceid);
      queryParams.push(data.start_time);
      queryParams.push(data.end_time);
      queryParams.push(moment.utc(data.service_end_date, 'DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A').local().toDate());
      queryParams.push(moment.utc(data.service_start_date, 'DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A').local().toDate());

      queryParams.push(data.orginal);
      queryParams.push(data.debriefstatus);
      queryParams.push(data.isadditional);
      queryParams.push(data.dbcsid);
      queryParams.push(data.state);
      queryParams.push(data.city);
      queryParams.push(data.total_hours);
      queryParams.push(data.country_code);
      queryParams.push(data.entrydate);
      queryParams.push(data.clarity_task_id);
      queryParams.push(data.notes);
      queryParams.push(data.serialnumber);
      queryParams.push(data.tagnumber);
      queryParams.push(data.ispicked);
      queryParams.push('true');
      queryParams.push(moment(data.modifieddate).toDate());
      queryParams.push(data.job_number);
      queryParams.push(data.job_type);
      queryParams.push(data.sync_status); // Set Sync_Status to true
      queryParams.push(data.isdeleted);
      queryParams.push('true');
      queryParams.push(data.import_level);
      queryParams.push(data.clarity_project);
      queryParams.push(data.clarity_project_id);
      queryParams.push(data.time_id);
      sqlUpdate.push(queryParams);
      sqlInsert.push(queryParams);

      batchArr.push(sqlUpdate);
      batchArr.push(sqlInsert);
    }
    return this.insertBatchData(batchArr, "saveInternalTimeList");
  }

  updateJobIDForTime(currentReport) {
    let queryParams = [currentReport.JobID, currentReport.ReportID_Mobile];
    return this.insertData("UPDATE Time SET Job_Number = ? WHERE Task_Number = ?", queryParams, "updateJobIDForTime");
  }

  updateJobIDForTask(currentReport) {
    let queryParams = [currentReport.JobID, currentReport.ReportID_Mobile];
    return this.insertData("UPDATE Task SET Job_Number = ? WHERE Task_Number = ?", queryParams, "updateJobIDForTime");
  }

  /**
   *@Prateek 21/05/2019
  *Select query for getting time entry to submit whose sync status is false.
  */
  public getPendingTimeEntry() {
    let query = '';
    let params = [this.valueProvider.getUserId()];
    query = "SELECT * FROM time where OracleDBID = ? AND DB_Syncstatus='false' and isSubmitted = 'true' AND Sync_Status = 'false' and IFNULL(Job_Type, '') !='vacation'";
    return this.getList(query, params, "getPendingTimeEntry");
  }

  /**
   *@Rajat
  *Select query for getting time entry to submit whose sync status is false.
  */
  public getPendingAllowancesEntry() {
    let query = '';
    let params = [this.valueProvider.getUserId()];
    query = "SELECT * FROM Allowance where OracleDBID = ? AND DB_Syncstatus='false'";
    return this.getList(query, params, "getPendingAllowanceEntry");
  }

  /**
     *@Prateek 24/05/2019
    *Select query for getting search entry records on the basis of timeid.
    */
  public getSearchTimeEntry(timeid) {
    let query = '';
    //let params = [this.valueProvider.getUserId(), weekStart, weekEnd];
    // query = "select * from time where DB_Syncstatus='false'";
    //query = "select * from time where Time_Id in (" + timeid + ")";
    query = "select * from time where Time_Id in(" + timeid + ") And isSubmitted='false'";
    return this.getList(query, '', "getSearchTimeEntry");
  }
  /**
     *@Prateek 24/05/2019
    *Select query for searching record for particular task number in task table if exist.
    */
  public getTaskNumber(jobnumber) {
    let params = [jobnumber]
    let query = '';
    query = "select Task_Number from Task where lower(Job_Number) = lower(?)";
    //query = "update time set task_number=(select Task_Number from task where job_id=" + jobnumber + ")where Job_Number="+jobnumber+"";
    return this.getList(query, params, "getTaskNumber");
  }
  /**
     *@Prateek 27/05/2019
    *Select query for searching record for particular task number in task table if exist.
    */
  public getTaskNumberTime(tasknumber) {
    let query = '';
    let params = [tasknumber]
    query = "select Task_Number from time where lower(Job_Number) = lower(?)"
    //query = "update time set task_number=(select Task_Number from task where job_id=" + jobnumber + ")where Job_Number="+jobnumber+"";
    return this.getList(query, params, "getTaskNumberTime");
  }


  public updateTaskNumberInTime(JobNumber, TaskNumber) {
    let query = "Update Time set Task_Number = ?, ModifiedDate = ?, Sync_Status = ? where lower(Job_Number) = lower(?) and Task_Number != ?";
    let modifiedDate = moment.utc(new Date()).format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A');
    let params = [TaskNumber, modifiedDate, 'false', JobNumber, TaskNumber];
    return this.insertData(query, params, "updateTaskNumberInTime");
  }

  /**
 *@Prateek 29/05/2019
*Select pending delete time entries.
*/
  public deletePendingTimeEntry(tablename, colname) {
    let query = '';
    let params = [this.valueProvider.getUserId()];
    // query = "select * from time where DB_Syncstatus='false'";
    query = "select Time_Id from " + tablename + " where OracleDBID = ? and " + colname + " = 'true'";
    return this.getList(query, params, "deletePendingTimeEntry");
  }


  /**
*@Prateek 29/05/2019
*Select pending delete time entries.
*/
  public deletePendingAllowancesEntry(tablename, colname) {
    let query = '';
    let params = [this.valueProvider.getUserId()];
    query = "select AllowanceID from " + tablename + " where OracleDBID = ? and " + colname + " = 'true'";
    return this.getList(query, params, "deletePendingAllowancesEntry");
  }


  /**
   *
   * Suketu Vyas App Update Emerson DB
   */


  onCustomerDBUpdated = new EventEmitter()
  updateNewCustomerDBFromLocalState() {

    let appDir = this.fileUpdater.newSoftVersion;

    if (this.platform.is('ios')) {


      this.customerDbProvider.db.close(success => {

        console.log('Customer DB Closed', success);
        //TODO:Check if database exist or not.
        console.log(cordova.file.dataDirectory + appDir + '/emerson_customers.sqlite');
        this.sqLiteCopyDb.copyDbFromStorage("emerson_customers.sqlite", 0, cordova.file.dataDirectory + appDir + '/emerson_customers.sqlite', true).then(res => {
          console.log(this.customerDbProvider.fileName, 'Updated DB Cpoied', res);
          this.onCustomerDBUpdated.emit(true);
          this.customerDbProvider.initializeCustomerDb()

        }).catch(err => {
          this.onCustomerDBUpdated.emit(false);
          this.customerDbProvider.initializeCustomerDb();
          console.log(this.customerDbProvider.fileName, 'DB Update  err', err);
        });

      }, err => {
        this.onCustomerDBUpdated.emit(false);
        console.log('Customer DB Not Closed', err);

      });
    } else {

      this.customerDbProvider.db.close(success => {
        console.log('Customer DB Closed', success);
        console.log(cordova.file.dataDirectory + appDir + '/emerson_customers.sqlite');

        this.file.removeFile(cordova.file.dataDirectory, 'emerson_customers.sqlite').then((res) => {
          console.log('Old DB Deleted: ', res);
          this.file.copyFile(cordova.file.dataDirectory + appDir + '/', this.customerDbProvider.dbName, cordova.file.dataDirectory, "").then((res) => {
            console.log(this.fileName, "Coppied emerson customers db from APP Direcotry", res);
            this.onCustomerDBUpdated.emit(true);
            this.customerDbProvider.initializeCustomerDb();
          }, (err) => {
            this.onCustomerDBUpdated.emit(false);
            this.customerDbProvider.initCustomerDB();
            console.log(this.customerDbProvider.fileName, "Error copy DB ...", err);
          })
        }, (err) => {
          this.onCustomerDBUpdated.emit(false);
          console.log('Error Deleting Old File: ', err);
        })




      }, err => {
        this.onCustomerDBUpdated.emit(false);
        console.log('Customer DB Not Closed', err);

      });

    }

  }


  /* @Prateek 04/29/2019
  *  Delete bulk  objects based on dbcs request
  */
  deleteDbcsEntries(timeIdList) {
    return new Promise((resolve, reject) => {
      let sqlBatchStmt = [];
      timeIdList.forEach((timeId) => {
        let sqlDelete: any[] = ["DELETE FROM " + timeId.tableName + " WHERE Time_Id = " + timeId.id];

        sqlBatchStmt.push(sqlDelete);
      })
      this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (res) => {
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, 'deleteDbcsEntries', "Error : " + JSON.stringify(error.message));
        reject(error);
      });

    })
  };

  deleteATPEntries(AllowanceList) {
    return new Promise((resolve, reject) => {
      let sqlBatchStmt = [];
      AllowanceList.forEach((Allowance) => {
        let sqlDelete: any[] = ["DELETE FROM " + Allowance.tableName + " WHERE ALLOWANCEID = " + Allowance.id];

        sqlBatchStmt.push(sqlDelete);
      })
      this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (res) => {
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, 'deleteATPEntries', "Error : " + JSON.stringify(error.message));
        reject(error);
      });

    })
  };

  checkIfSameJobId(currentReport, element) {
    let query = "select COUNT(*) as count from ReportData where ElementID IN(130098) AND VALUE = ?";
    let params = [element.Value];
    if (currentReport) {
      query = query + " and reportID_mobile != ?";
      params.push(currentReport.ReportID_Mobile);
    }

    return this.getList(query, params, "checkIfSameJobId")
  }

  onEmersonDBUpdated = new EventEmitter()
  async updateNewEmersonDBFromLocalState() {
    let oldDBVersion = await this.dbctrl.getCurrentDBversion();
    let dbName = this.dbctrl.getDbName();
    let appDir = this.fileUpdater.newSoftVersion;
    let filePath = cordova.file.dataDirectory;
    if (this.platform.is('ios')) {
      if (String(oldDBVersion) == String(Enums.DatabaseVersion.currentVersion)) {
        let UserAndUserPrefData = await this.getUserAndUserPreferenceDataFromOldDB();
        this.sqLiteCopyDb.copyDbToStorage(dbName, 0, cordova.file.dataDirectory + '/', false).then(res => {
          setTimeout(() => {
            this.file.moveFile(filePath, dbName, filePath, "Old_" + dbName).then(() => {
              this.dbctrl.getDB().close(success => {
                this.sqLiteCopyDb.copyDbFromStorage(dbName, 0, cordova.file.dataDirectory + appDir + '/' + dbName, true).then(res => {
                  this.inserUserOnUpdate(UserAndUserPrefData[0]).then(res => {
                    this.insertUserPrefOnUpdate(UserAndUserPrefData[1]).then(res => {
                      this.onEmersonDBUpdated.emit(true);
                    }).catch(err => {
                      this.logger.log(this.fileName, "Error In insertUserPrefOnUpdate", 'Error: ' + JSON.stringify(err));
                    });
                  }).catch(err => {
                    this.logger.log(this.fileName, "Error In inserUserOnUpdate", 'Error: ' + JSON.stringify(err));
                  });
                });
              }, (err) => {
                this.onEmersonDBUpdated.emit(false);
                this.logger.log(this.fileName, "CLOSE" + dbName + "Error closing DB", 'Error: ' + JSON.stringify(err));
              });
            });
          }, 1000);
        }, (err) => {
          this.onEmersonDBUpdated.emit(false);
          this.logger.log(this.fileName, "Old_" + dbName + "Error copying DB", 'Error: ' + JSON.stringify(err));
        });
      } else {
        this.onEmersonDBUpdated.emit(true);
      }
    } else {
      if (String(oldDBVersion) == String(Enums.DatabaseVersion.currentVersion)) {
        let UserAndUserPrefData = await this.getUserAndUserPreferenceDataFromOldDB();
        this.file.copyFile(filePath, dbName, filePath, "Old_" + dbName).then((res) => {
          setTimeout(() => {
            this.dbctrl.getDB().close(success => {
              this.file.removeFile(filePath, dbName).then((res) => {
                this.file.copyFile(filePath + appDir + '/', dbName, filePath, "").then((res) => {
                  this.inserUserOnUpdate(UserAndUserPrefData[0]).then(res => {
                    this.insertUserPrefOnUpdate(UserAndUserPrefData[1]).then(res => {
                      this.onEmersonDBUpdated.emit(true);
                    }).catch(err => {
                      this.logger.log(this.fileName, "Error In insertUserPrefOnUpdate", 'Error: ' + JSON.stringify(err));
                    });
                  }).catch(err => {
                    this.logger.log(this.fileName, "Error In inserUserOnUpdate", 'Error: ' + JSON.stringify(err));
                  });
                }, (err) => {
                  this.onEmersonDBUpdated.emit(false);
                  this.logger.log(this.fileName, dbName + "Error copying DB", 'Error: ' + JSON.stringify(err));
                });
              }).catch(err => {
                this.logger.log(this.fileName, "Error In removeFile", 'Error: ' + JSON.stringify(err));
              });
            });
          }, 1000);
        }, (err) => {
          this.onEmersonDBUpdated.emit(false);
          this.logger.log(this.fileName, "Old_" + dbName + "Error copying DB", 'Error: ' + JSON.stringify(err));
        });
      } else {
        this.onEmersonDBUpdated.emit(true);
      }
    }
  }

  async inserUserOnUpdate(userData) {
    let sqlBatchStmt = [];
    for (let k in userData) {
      let userObject = userData[k];
      let insertValues = [];
      let sqlInsert: any[] = [`INSERT INTO User(ID,ClarityID,Currency,Default_View,Email,Language,LanguageId,Name,OFSCId,Password,Time_Zone,Type,User_Name,Work_Day,Work_Hour,Login_Status,Sync_Status,Last_Updated,Last_Updated_Task,Last_Updated_Internal,Last_Updated_Task_Detail,Last_Updated_Project,Last_Updated_LOV,Last_Updated_SR,Last_Updated_Delete,encrypt,userName,userRole,UserID,DefaultBUID,Last_Updated_Translation,Last_Updated_AddressAuditLog,Last_Updated_Language_Key_Mappings,Last_Updated_Languages,Last_Updated_Addresses,Last_Updated_Feedbacks,Last_Updated_FeedbackQuestions,WorldAreaID,Last_Updated_Timezone,timeZoneIANA, Country, State, City, Zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`];
      insertValues.push(userObject.ID);
      insertValues.push(userObject.ClarityID);
      insertValues.push(userObject.Currency);
      insertValues.push(userObject.Default_View);
      insertValues.push(userObject.Email);
      insertValues.push(userObject.Language);
      insertValues.push(userObject.LanguageId);
      insertValues.push(userObject.Name);
      insertValues.push(userObject.OFSCId);
      insertValues.push(userObject.Password);
      insertValues.push(userObject.Time_Zone == '(UTC+01:00) Paris' ? '(UTC+01:00) Paris - Central European Time (CET)' : userObject.Time_Zone);
      insertValues.push(userObject.Type);
      insertValues.push(userObject.User_Name);
      insertValues.push(userObject.Work_Day);
      insertValues.push(userObject.Work_Hour);
      insertValues.push(userObject.Login_Status);
      insertValues.push(userObject.Sync_Status);
      insertValues.push(userObject.Last_Updated);
      insertValues.push(userObject.Last_Updated_Task);
      insertValues.push(userObject.Last_Updated_Internal);
      insertValues.push(userObject.Last_Updated_Task_Detail);
      insertValues.push(userObject.Last_Updated_Project);
      insertValues.push(userObject.Last_Updated_LOV);
      insertValues.push(userObject.Last_Updated_SR);
      insertValues.push(userObject.Last_Updated_Delete);
      insertValues.push(userObject.encrypt);
      insertValues.push(userObject.userName);
      insertValues.push(userObject.userRole);
      insertValues.push(userObject.UserID ? parseInt(userObject.UserID) : null);
      insertValues.push(userObject.DefaultBUID);
      insertValues.push(userObject.Last_Updated_Translation);
      insertValues.push(userObject.Last_Updated_AddressAuditLog);
      insertValues.push(userObject.Last_Updated_Language_Key_Mappings);
      insertValues.push(userObject.Last_Updated_Languages);
      insertValues.push(userObject.Last_Updated_Addresses);
      insertValues.push(userObject.Last_Updated_Feedbacks);
      insertValues.push(userObject.Last_Updated_FeedbackQuestions);
      insertValues.push(userObject.WorldAreaID);
      insertValues.push(userObject.Last_Updated_Timezone);
      insertValues.push(userObject.timeZoneIANA);
      insertValues.push(userObject.country ? userObject.country : null);
      insertValues.push(userObject.state ? userObject.state : null);
      insertValues.push(userObject.city ? userObject.city : null);
      insertValues.push(userObject.zipcode ? userObject.zipcode : null);
      sqlInsert.push(insertValues);
      sqlBatchStmt.push(sqlInsert);
    }
    return await this.dbctrl.insertBatchDataOnUpdate(sqlBatchStmt, 'inserUserOnUpdate');
  }

  async insertUserPrefOnUpdate(userPrefData) {
    let sqlBatchStmt = [];
    for (let k in userPrefData) {
      let responseList = userPrefData[k];
      let insertValues = [];
      let sqlInsert: any[] = ["INSERT INTO User_Preferences  (ResourceID, Email, Default_Currency, Preferred_language, Preferred_language_Id, Timezone, FSR_PrintNote, FSR_PrintExpense, FSR_PrintExpenseComplete, FSR_PrintMaterial, FSR_PrintTime, FSR_PrintSignature, FSR_PrintInstallBase, FSR_PrintEUISO ,FSR_PrintAttachment, Date_Format, AddressId, AddressIdCh, SelectedLanguage, Do_Not_Show_Modal, UOM, UOM_Id, FSR_Disclaimer, FSR_Languages, ShowNonBillableEntries,WorldAreaID, timeZoneIANA, ShowChargeMethod, ListView,STARTDAYOFWEEK,FSR_PrintChargeMethod) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)"];
      insertValues.push(responseList.ResourceID);
      insertValues.push(responseList.Email);
      insertValues.push(responseList.Default_Currency);
      insertValues.push(responseList.Preferred_language);
      insertValues.push(responseList.Preferred_language_Id);
      insertValues.push(responseList.Timezone);
      insertValues.push(responseList.FSR_PrintNote);
      insertValues.push(responseList.FSR_PrintExpense);
      insertValues.push(responseList.FSR_PrintExpenseComplete);
      insertValues.push(responseList.FSR_PrintMaterial);
      insertValues.push(responseList.FSR_PrintTime);
      insertValues.push(responseList.FSR_PrintSignature);
      insertValues.push(responseList.FSR_PrintInstallBase);
      insertValues.push(responseList.FSR_PrintEUISO);
      insertValues.push(responseList.FSR_PrintAttachment);
      insertValues.push(responseList.Date_Format);
      insertValues.push(responseList.AddressId);
      insertValues.push(responseList.AddressIdCh);
      insertValues.push(responseList.SelectedLanguage);
      insertValues.push(responseList.Do_Not_Show_Modal);
      insertValues.push(responseList.UOM);
      insertValues.push(responseList.UOM_Id);
      insertValues.push(responseList.FSR_Disclaimer);
      insertValues.push(responseList.FSR_Languages);
      insertValues.push(responseList.ShowNonBillableEntries);
      insertValues.push(responseList.WorldAreaID);
      insertValues.push(responseList.timeZoneIANA);
      insertValues.push(responseList.ShowChargeMethod != null ? responseList.ShowChargeMethod : false);
      insertValues.push(responseList.ListView != null ? responseList.ListView : "w");
      insertValues.push("Monday");
      insertValues.push(responseList.FSR_PrintChargeMethod);
      sqlInsert.push(insertValues);
      sqlBatchStmt.push(sqlInsert);
    }
    return await this.dbctrl.insertBatchDataOnUpdate(sqlBatchStmt, 'insertUserPrefOnUpdate');
  }



  private async getUserAndUserPreferenceDataFromOldDB() {
    let promiseArr: any = [];
    return new Promise((resolve, reject) => {
      promiseArr.push(this.getList("Select * from User", [], "getUserAndUserPreferenceDataFromOldDB"));
      promiseArr.push(this.getList("Select * from User_Preferences", [], "getUserAndUserPreferenceDataFromOldDB"));
      Promise.all(promiseArr).then((res: any) => {
        resolve(res);
      }).catch(err => {
        this.logger.log(this.fileName, 'getUserAndUserPreferenceDataFromOldDB', 'Error: ' + JSON.stringify(err.message));
      });
    });
  }

  getLookupsByLookupType(lookupType, ParentID?) {
    let query = "select * from lookups where lookuptype = ? ";
    if (ParentID) {
      query = query + " AND PARENTID = " + ParentID
    }
    query = query + " Order By DisplayOrder ";
    let queryParams = [lookupType];
    return this.getList(query, queryParams, "getLookupsByLookupType")
  }

  getAsLeftData(reportId) {
    return new Promise((resolve, reject) => {
      let value = [];
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT * from ASLEFTACTUATION where reportid = ?", [reportId], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          //   this.logger.log(this.fileName, 'function', "GET INTERNAL DB (ASLEFTACTUATION) ==========> " + JSON.stringify(value));
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getAsLeftData', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getAsLeftData', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  getAsLeftRAData(reportId) {
    return new Promise((resolve, reject) => {
      let value = [];
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT * from ASLEFTRAACTUATION where reportid = ?", [reportId], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          //     this.logger.log(this.fileName, 'function', "GET INTERNAL DB (ASLEFTRAACTUATION) ==========> " + JSON.stringify(value));
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getAsLeftRAData', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getAsLeftRAData', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  getCalibrationData(reportId) {
    return new Promise((resolve, reject) => {
      let value = [];
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT * from CALIBRATIONACTUATION where reportid = ?", [reportId], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          //    this.logger.log(this.fileName, 'function', "GET INTERNAL DB (DEVICETESTACTUATION) ==========> " + JSON.stringify(value));
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getCalibrationData', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getCalibrationData', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  getReportAttachmentsData(reportId) {
    return new Promise((resolve, reject) => {
      let value = [];
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT * from REPORTATTACHMENTS where reportid = ?", [reportId], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          //    this.logger.log(this.fileName, 'function', "GET INTERNAL DB (getReportAttachmentsData) ==========> " + JSON.stringify(value));
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getReportAttachmentsData', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getReportAttachmentsData', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  getProductID(REPORTID) {
    return new Promise((resolve, reject) => {
      let query = "Select P.ProductID from MST_Product P, SELECTEDDEVICE D Where P.PARENTID = D.DEVICEID and P.PRODUCTID = D.DEVICETYPE and D.REPORTID = ?";
      this.getList(query, [REPORTID], "getProductNameForCustomHeader").then((res: any) => {
        if (res && res.length > 0) {
          // console.log(res[0].ProductID);
          resolve(res[0].ProductID);
        } else {
          resolve(false);
        }
      });
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getTask', error);
    });;

  }


  getReportStatus(createdby, reportid) {
    let query = "Select REPORTID,REPORTSTATUS,REPAIRDATE,JOBID,CUSTOMERNAME,WORLDAREA,CREATEDDATE,BUSINESSGROUP,SELECTEDPROCESS from SDRREPORT where REPORTID=? and CREATEDBY=?"
    let queryParams = [reportid, createdby];
    return this.getList(query, queryParams, "getElementType")
  }

  deleteClarityTimeObject(timeID, isEdit?, statusID?) {
    let qry = '';
    let tableName = isEdit ? "Time_Temp" : "Time";
    if (statusID == Enums.Jobstatus.Debrief_In_Progress) {
      qry = "UPDATE " + tableName + " set isdeleted = 'true', db_syncstatus = 'false' where Sync_Status='false' and isAdditional='true' and Time_Id in (" + timeID + ") "
    }
    else if (statusID == Enums.Jobstatus.Debrief_Declined) {
      qry = "UPDATE " + tableName + " set isdeleted = 'true', db_syncstatus = 'false' where (Sync_Status='false' and isAdditional='true' and Original is null) and Time_Id in (" + timeID + ") "
    }
    else {
      qry = "UPDATE " + tableName + " set isdeleted = 'true', db_syncstatus = 'false' where Sync_Status='false'  and Original is null and Time_Id in (" + timeID + ") "
    }
    return this.getList(qry, [], "deleteClarityTimeObject")
  }

  deleteClarityTimeByProject(obj) {
    let qry = '';
    if (obj.StatusID == Enums.Jobstatus.Debrief_In_Progress) {
      qry = "UPDATE TIME set isdeleted = 'true', db_syncstatus = 'false' where Sync_Status='false' and isAdditional='true' and Job_Number=? and Clarity_Project=? and OracleDBID=? "
    }
    else if (obj.StatusID == Enums.Jobstatus.Debrief_Declined) {
      qry = "UPDATE TIME set isdeleted = 'true', db_syncstatus = 'false' where (Sync_Status='false' and isAdditional='true' and Original is null) and Job_Number=? and Clarity_Project=? and OracleDBID=? "
    }
    else {
      qry = "UPDATE TIME set isdeleted = 'true', db_syncstatus = 'false' where Sync_Status='false' and Original is null and Job_Number=? and Clarity_Project=? and OracleDBID=? "
    }
    let queryParams = [obj.Job_Number, obj.ProjectNumber, this.valueProvider.getUserId(), obj.weekStart];
    if (obj.weekEnd) {
      queryParams.push(obj.weekEnd);
      qry += " and EntryDate BETWEEN ? AND ? "
    }
    else {
      qry += " and EntryDate = ?"
    }
    return this.getList(qry, queryParams, "deleteClarityTimeByProject")
  }

  getPreviousEntries(day, weekEditPage?) {
    let query;
    /**
  * Preeti Varshney 10/06/2019
  * Changes query for getting previous entries from Time_Temp table when it is a week edit page.
  */
    if (weekEditPage) {
      query = "Select tm.*,CASE WHEN Task.StatusID is NULL AND tm.Job_Number != 'Not Applicable' THEN ? WHEN tm.Job_Number = 'Not Applicable' then ? ELSE Task.StatusID END AS StatusID,Task.IsDeclined IsDeclined, (SELECT tm.Time_Id FROM Time_Temp TT WHERE TT.Original = tm.Time_Id) As CurrentMobileId from Time_Temp tm LEFT OUTER Join Task on task.Task_Number=tm.Task_Number where CurrentMobileId IS NULL AND tm.isDeleted='false' AND tm.Clarity_Project_Id = ? AND tm.Job_Number = ? AND tm.EntryDate=? AND tm.OracleDBID=?";
    }
    else {
      query = "Select tm.*,CASE WHEN Task.StatusID is NULL AND tm.Job_Number != 'Not Applicable' THEN ? WHEN tm.Job_Number = 'Not Applicable' then ? ELSE Task.StatusID END AS StatusID,Task.IsDeclined IsDeclined, (SELECT tm.Time_Id FROM Time T WHERE T.Original = tm.Time_Id) As CurrentMobileId from Time tm LEFT OUTER Join Task on task.Task_Number=tm.Task_Number where CurrentMobileId IS NULL AND tm.isDeleted='false' AND tm.Clarity_Project_Id = ? AND tm.Job_Number = ? AND tm.EntryDate=? AND tm.OracleDBID=?";
    }

    let queryParams = [Enums.Jobstatus.Completed_Awaiting_Review, Enums.Jobstatus.Debrief_Started, day.Clarity_Project_Id, day.Job_Number, day.entryDate, this.valueProvider.getUserId()];
    if (day.Time_Code_Id) {
      query += " AND tm.Time_Code_Id =?";
      queryParams.push(day.Time_Code_Id);
    }
    else {
      query += " AND (tm.Time_Code_Id is null OR tm.Time_Code_Id = '')";
    }
    if (day.Charge_Type_Id) {
      query += " AND tm.Charge_Type_Id =?";
      queryParams.push(day.Charge_Type_Id);
    }
    else {
      query += " AND (tm.Charge_Type_Id is null OR tm.Charge_Type_Id = '')";
    }
    if (day.Work_Type_Id) {
      query += " AND tm.Work_Type_Id =?";
      queryParams.push(day.Work_Type_Id);
    }
    else {
      query += " AND (tm.Work_Type_Id is null OR tm.Work_Type_Id = '')";
    }
    if (day.Item_Id) {
      query += " AND tm.Item_Id =?";
      queryParams.push(day.Item_Id);
    }
    else {
      query += " AND (tm.Item_Id is null OR tm.Item_Id = '')";
    }
    if (day.Shift_Code_Id) {
      query += " AND tm.Shift_Code_Id =?";
      queryParams.push(day.Shift_Code_Id);
    }
    else {
      query += " AND (tm.Shift_Code_Id is null OR tm.Shift_Code_Id = '')";
    }
    if (day.Charge_Method_Id) {
      query += " AND tm.Charge_Method_Id =?";
      queryParams.push(day.Charge_Method_Id);
    }
    else {
      query += " AND (tm.Charge_Method_Id is null OR tm.Charge_Method_Id = '')";
    }
    if (day.Field_Job_Name_Id) {
      query += " AND tm.Field_Job_Name_Id =?";
      queryParams.push(day.Field_Job_Name_Id);
    }
    else {
      query += " AND (tm.Field_Job_Name_Id is null OR tm.Field_Job_Name_Id = '')";
    }
    if (day.City) {
      query += " AND lower(tm.City) =lower(?)";
      queryParams.push(day.City);
    }
    else {
      query += " AND (tm.City is null OR tm.City = '')";
    }
    if (day.Country_Code) {
      query += " AND lower(tm.Country_Code) = lower(?)";
      queryParams.push(day.Country_Code);
    }
    else {
      query += " AND (tm.Country_Code is null OR tm.Country_Code = '')";
    }
    if (day.State) {
      query += " AND lower(tm.State) = lower(?)";
      queryParams.push(day.State);
    }
    else {
      query += " AND (tm.State is null OR tm.State = '')";
    }
    query += " order by EntryDate,Start_Time";
    return this.getList(query, queryParams, "getPreviousEntries");
  }
  getPreviousEntriesNOC(day, weekEditPage) {
    let tableName = "Time";
    if (weekEditPage) {
      tableName = "Time_temp"
    }
    let query;
    let queryParams;
    if (day.Job_Number == null || day.Job_Number == '' || day.Job_Number == undefined || day.Job_Number == 'Not Applicable') {
      //tableName = "Time";
      query = `Select tm.*,CASE WHEN tsk.StatusID is NULL AND tm.Job_Number != 'Not Applicable' THEN ? WHEN tm.Job_Number = 'Not Applicable' then ? ELSE tsk.StatusID END AS StatusID,tsk.isDeclined, (SELECT tm.Time_Id FROM ${tableName} TT WHERE TT.Original = tm.Time_Id) As CurrentMobileId from ${tableName} tm LEFT OUTER JOIN Task tsk on tsk.Task_Number = tm.Task_Number where CurrentMobileId IS NULL AND tm.EntryDate=? and tm.Work_Type_Id = ? and tm.Job_Type=?  and tm.OracleDBID=? and tm.isDeleted = 'false'`;
      queryParams = [Enums.Jobstatus.Completed_Awaiting_Review, Enums.Jobstatus.Debrief_Started, day.EntryDate, day.Work_Type_Id, day.Job_Type, this.valueProvider.getUserId()];
      if (day.Work_Type_OT) {
        query += " AND tm.Work_Type_OT =?";
        queryParams.push(day.Work_Type_OT);
      }

    } else {
      query = `Select tm.*,CASE WHEN tsk.StatusID is NULL AND tm.Job_Number != 'Not Applicable' THEN ? WHEN tm.Job_Number = 'Not Applicable' then ? ELSE tsk.StatusID END AS StatusID,tsk.isDeclined, (SELECT tm.Time_Id FROM ${tableName} TT WHERE TT.Original = tm.Time_Id) As CurrentMobileId from ${tableName} tm LEFT OUTER JOIN Task tsk on tsk.Task_Number = tm.Task_Number where CurrentMobileId IS NULL AND tm.Job_Number = ? and tm.EntryDate=? and tm.Work_Type_Id = ? and tm.Job_Type=?  and tm.OracleDBID=? and tm.isDeleted = 'false'`;
      queryParams = [Enums.Jobstatus.Completed_Awaiting_Review, Enums.Jobstatus.Debrief_Started, day.Job_Number, day.EntryDate, day.Work_Type_Id, day.Job_Type, this.valueProvider.getUserId()];

    }

    if (day.Charge_Method) {
      query += " AND Charge_Method =?";
      queryParams.push(day.Charge_Method);
    } else {
      query += " AND (tm.Charge_Method is null OR tm.Charge_Method = '')";
    }

    if (day.SerialNumber) {
      query += " AND SerialNumber =?";
      queryParams.push(day.SerialNumber);
    } else {
      query += " AND (tm.SerialNumber is null OR tm.SerialNumber = '')";
    }
    if (day.TagNumber) {
      query += " AND TagNumber =?";
      queryParams.push(day.TagNumber);
    } else {
      query += " AND (tm.TagNumber is null OR tm.TagNumber = '')";
    }

    if (day.Item_Id != null && day.Item_Id != '') {
      query += " AND Item_Id =?";
      queryParams.push(day.Item_Id);
    } else {
      query += " AND (tm.Item_Id is null OR tm.Item_Id = '')";
    }

    query += " order by EntryDate,Start_Time";
    return this.getList(query, queryParams, "getPreviousEntriesNOC");
  }

  getWeekDayDuration(day, timeID?, timeTemp?) {
    let query;
    let tableName = timeTemp ? "Time_Temp" : "Time";
    if (timeID) {
      query = "select * from " + tableName + " time where isDeleted='false' and OracleDBID=? and Clarity_Project_Id = ? and Job_Number = ? and EntryDate BETWEEN ? AND ? "
    }
    else {
      query = "select EntryDate, strftime('%H:%M',TIME(sum(strftime('%H',duration)*3600+strftime('%M',Duration)*60),'unixepoch')) as Duration, case when min(isSubmitted) = 'false' then 'false' else 'true' end as isSubmitted, case when min(Import_Level) = '1' then 1 else 2 end as Import_Level, (SELECT tm.Time_Id FROM " + tableName + " tm WHERE tm.Original = time.Time_Id) As CurrentMobileId from " + tableName + " time where isDeleted='false' and CurrentMobileId IS NULL and OracleDBID=? and Clarity_Project_Id = ? and Job_Number = ? and EntryDate BETWEEN ? AND ? "
    }
    let queryParams = [this.valueProvider.getUserId(), day.Clarity_Project, day.Job_Number, day.startDate, day.endDate];

    if (day.OTCode) {
      query += " AND Time_Code_Id =?";
      queryParams.push(day.OTCode);
    }
    else {
      query += " AND (Time_Code_Id is null OR Time_Code_Id = '')";
    }
    if (day.ChargeType) {
      query += " AND Charge_Type_Id =?";
      queryParams.push(day.ChargeType);
    }
    else {
      query += " AND (Charge_Type_Id is null OR Charge_Type_Id = '')";
    }
    if (day.workType) {
      query += " AND Work_Type_Id =?";
      queryParams.push(day.workType);
    }
    else {
      query += " AND (Work_Type_Id is null OR Work_Type_Id = '')";
    }
    if (day.Item) {
      query += " AND Item_Id =?";
      queryParams.push(day.Item);
    }
    else {
      query += " AND (Item_Id is null OR Item_Id = '')";
    }
    if (day.ShiftCode) {
      query += " AND Shift_Code_Id =?";
      queryParams.push(day.ShiftCode);
    }
    else {
      query += " AND (Shift_Code_Id is null OR Shift_Code_Id = '')";
    }
    if (day.chargeMethod) {
      query += " AND Charge_Method_Id =?";
      queryParams.push(day.chargeMethod);
    }
    else {
      query += " AND (Charge_Method_Id is null OR Charge_Method_Id = '')";
    }
    if (day.Task) {
      query += " AND Field_Job_Name_Id =?";
      queryParams.push(day.Task);
    }
    else {
      query += " AND (Field_Job_Name_Id is null OR Field_Job_Name_Id = '')";
    }
    if (day.City) {
      query += " AND lower(Time.City) =lower(?)";
      queryParams.push(day.City);
    }
    else {
      query += " AND (Time.City is null OR Time.City = '')";
    }
    if (day.Country_Code) {
      query += " AND lower(Time.Country_Code) = lower(?)";
      queryParams.push(day.Country_Code);
    }
    else {
      query += " AND (Time.Country_Code is null OR Time.Country_Code = '')";
    }
    if (day.State) {
      query += " AND lower(Time.State) = lower(?)";
      queryParams.push(day.State);
    }
    else {
      query += " AND (Time.State is null OR Time.State = '')";
    }
    if (!timeID)
      query += ' group by entrydate'
    // let query = "Select  from Time where Clarity_Project = ? and Job_Number = ? and EntryDate BETWEEN ? AND ?";

    return this.getList(query, queryParams, "getWeekDayDuration");
  }
  /**
   *
   * Gaurav Vachhani - 24-12-2019
   * Fetching list of all time entries of week for NONC-OSC user according to the selected date.
   * 
   * @param {*} day object of time entry
   * @param {*} [weekstart] starting date of a week
   * @param {*} [weekEnd] ending date of a week
   * @param {*} [timeTemp] boolean key to recognise the table
   * @returns
   * @memberof LocalServiceProvider
   */
  getNOCWeekDuration(day, weekstart?, weekEnd?, timeTemp?) {
    let query;
    let tableName = timeTemp ? "Time_Temp" : "Time";
    query = "select * from " + tableName + " time where isDeleted='false' and OracleDBID=? and Job_Type = ? and Job_Number = ? and EntryDate BETWEEN ? AND ? "
    let queryParams = [this.valueProvider.getUserId(), day.Job_Type, day.Job_Number, weekstart, weekEnd];

    if (day.Charge_Method) {
      query += " AND Charge_Method =?";
      queryParams.push(day.Charge_Method);
    }
    if (day.SerialNumber) {
      query += " AND SerialNumber =?";
      queryParams.push(day.SerialNumber);
    }
    if (day.TagNumber) {
      query += " AND TagNumber =?";
      queryParams.push(day.TagNumber);
    }
    if (day.Item_Id != null && day.Item_Id != '') {
      query += " AND Item_Id =?";
      queryParams.push(day.Item_Id);
    }
    if (day.Work_Type_Id) {
      query += " AND Work_Type_Id =?";
      queryParams.push(day.Work_Type_Id);
    }
    if (day.Work_Type_OT) {
      query += " AND Work_Type_OT =?";
      queryParams.push(day.Work_Type_OT);
    }
    return this.getList(query, queryParams, "getNOCWeekDuration");
  }

  /**
     * Preeti Varshney 09/10/2019
     * Get entries of advance search ( Date From, Date To , Job ID, Project, Task, Overtime Code, Shift Code, Activity Type, Charge Method ).
     */
  public advSearchOSCClarity(params, issubmit) {
    let query = '';
    // if (issubmit == "true") {
    //   query = "Select * from time where DB_Syncstatus='false' AND isDeleted='false' AND OracleDBID = " + this.valueProvider.getUserId() + " and EntryDate between '" + params.date_from + "' AND '" + params.date_to + "'";

    // }
    // else {

    // query = "Select Time.*,Task.StatusID StatusID,Task.IsDeclined IsDeclined,(SELECT tm.Time_Id FROM Time tm WHERE tm.Original = Time.Time_Id) As CurrentMobileId from Time inner Join Task on task.Task_Number=Time.Task_Number where CurrentMobileId IS NULL AND Time.isDeleted='false' and Time.OracleDBID = " + this.valueProvider.getUserId() + " and Time.EntryDate between '" + params.date_from + "' AND '" + params.date_to + "'";
    query = "Select Time.*,CASE WHEN Task.StatusID is NULL AND Time.Job_Number != 'Not Applicable' THEN " + Enums.Jobstatus.Completed_Awaiting_Review + " WHEN Time.Job_Number = 'Not Applicable' then " + Enums.Jobstatus.Debrief_Started + " ELSE Task.StatusID END AS StatusID,CASE WHEN Task.IsDeclined is NULL THEN 'false' ELSE Task.IsDeclined END AS IsDeclined,(SELECT tm.Time_Id FROM Time tm WHERE tm.Original = Time.Time_Id) As CurrentMobileId from Time left Join Task on task.Task_Number=Time.Task_Number where CurrentMobileId IS NULL AND Time.isDeleted='false' and Time.OracleDBID = " + this.valueProvider.getUserId() + " and Time.EntryDate between '" + params.date_from + "' AND '" + params.date_to + "'";

    // }
    //Change the query to select the job number and DB_Syncstatus


    if (params.Job_Number != '' && params.Job_Number != undefined && params.Job_Number != 'No Value')
      query += " AND Time.Job_Number like '%" + params.Job_Number + "%'";
    if (params.Work_Type != '' && params.Work_Type != undefined && params.Work_Type != 'No Value')
      query += " AND Time.Work_Type = '" + params.Work_Type + "'";
    if (params.Clarity_Project != '' && params.Clarity_Project != undefined && params.Clarity_Project != 'No Value')
      query += " AND Time.Clarity_Project = '" + params.Clarity_Project + "'";
    if (params.Field_Job_Name != '' && params.Field_Job_Name != undefined && params.Field_Job_Name != 'No Value')
      query += " AND Time.Field_Job_Name like '%" + params.Field_Job_Name + "%'";
    if (params.Time_Code != '' && params.Time_Code != undefined && params.Time_Code != 'No Value')
      query += " AND Time.Time_Code like '%" + params.Time_Code + "%'";
    if (params.Shift_Code != '' && params.Shift_Code != undefined && params.Shift_Code != 'No Value')
      query += " AND Time.Shift_Code like '%" + params.Shift_Code + "%'";
    if (params.Charge_Method != '' && params.Charge_Method != undefined && params.Charge_Method != 'No Value')
      query += " AND Time.Charge_Method = '" + params.Charge_Method + "'";
    query += " order by Time.EntryDate,Time.Start_Time";
    return this.getList(query, '', "advanceSearch");
  }

  async saveTaskDetails(taskDetails) {
    let sqlBatchStmt = this.getInstallBaseBatch(taskDetails.InstallBase);
    sqlBatchStmt = sqlBatchStmt.concat(this.getContactsBatch(taskDetails.Contacts));

    // let OSCNotes = taskDetails.Notes.filter((OSCNotesItem) => { return OSCNotesItem.Created_By != Enums.Created_By.MobileRNT; });
    // let DebriefNotes = taskDetails.Notes.filter((DebriefNotesItem) => { return DebriefNotesItem.Created_By == Enums.Created_By.MobileRNT; });
    // sqlBatchStmt = sqlBatchStmt.concat(this.getNoteBatch(OSCNotes));
    // sqlBatchStmt = sqlBatchStmt.concat(this.getNotesBatch(DebriefNotes));

    let attachmentArray = this.transformProvider.getTaskAttachmentsFromMCS(taskDetails.Attachments);
    sqlBatchStmt = sqlBatchStmt.concat(this.getAttachmentBatch(attachmentArray));

    return await this.insertBatchData(sqlBatchStmt, "saveTaskDetails");
  }

  saveDebriefDetails(debriefDetails) {
    // let sqlBatchStmt = this.getTimeBatch(debriefDetails.Time);
    let sqlBatchStmt = []
    sqlBatchStmt = sqlBatchStmt.concat(this.getMaterialBatch(debriefDetails.Material));
    sqlBatchStmt = sqlBatchStmt.concat(this.getExpenseBatch(debriefDetails.Expenses));

    let OSCNotes = debriefDetails.Notes.filter((OSCNotesItem) => { return OSCNotesItem.Created_By != Enums.Created_By.MobileRNT; });
    let DebriefNotes = debriefDetails.Notes.filter((DebriefNotesItem) => { return DebriefNotesItem.Created_By == Enums.Created_By.MobileRNT; });

    sqlBatchStmt = sqlBatchStmt.concat(this.getNoteBatch(OSCNotes));
    sqlBatchStmt = sqlBatchStmt.concat(this.getNotesBatch(DebriefNotes));
    return this.insertBatchData(sqlBatchStmt, "saveDebriefDetails");
  }

  getPendingDebriefAttachments() {
    return false;
  }

  saveSRDetails(data) {
    let sqlBatchStmt = [];
    if (data.SRNotes && data.SRNotes.length > 0) sqlBatchStmt = this.getNoteBatch(data.SRNotes);
    if (data.SRAttachments && data.SRAttachments.length > 0) {
      let attachmentArray = this.transformProvider.getSRAttachmentsFromMCS(data.SRAttachments);
      sqlBatchStmt = sqlBatchStmt.concat(this.getAttachmentBatch(attachmentArray));
    }
    return this.insertBatchData(sqlBatchStmt, "saveSRDetails");
  }

  saveProjectDetails(data) {
    let sqlBatchStmt = [];
    let tableNames = Object.keys(data);
    for (let k in tableNames) {
      let tableName = tableNames[k];
      sqlBatchStmt = sqlBatchStmt.concat(this.getProjectDetailsBatch(tableName, data[tableName]));
    }
    return this.insertBatchData(sqlBatchStmt, "saveProjectDetails");
  }


  getPendingPWSAttachments(): Promise<JSON[]> {
    let query = "SELECT * FROM DetailedNotesAttachment WHERE Attachment_Status = ? AND Created_By = ?";
    let queryParams = ["false", this.valueProvider.getResourceId()];
    return this.getList(query, queryParams, "getPendingPWSAttachments");
  }

  saveEngineer(data) {
    let query = "INSERT OR REPLACE INTO Engineer VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let queryParams = [];

    queryParams.push(data.Task_Number);
    queryParams.push(data.followUp);
    queryParams.push(data.salesQuote);
    queryParams.push(data.salesVisit);
    queryParams.push(data.salesLead);
    queryParams.push(data.Follow_Up);
    queryParams.push(data.Spare_Quote);
    queryParams.push(data.Sales_Visit);
    queryParams.push(data.Sales_Head);
    queryParams.push(data.Sign_File_Path);
    queryParams.push(data.File_Name);
    queryParams.push(data.Task_Number);
    queryParams.push(data.isCustomerSignChecked);
    queryParams.push(data.customerComments);
    queryParams.push(this.valueProvider.getResourceId());
    queryParams.push(data.Cust_Sign_File);
    queryParams.push(data.Engg_Sign_Time);
    queryParams.push(data.Cust_Sign_Time);
    queryParams.push(false);
    queryParams.push(null);
    queryParams.push(this.valueProvider.getUserId());
    return this.insertData(query, queryParams, "saveEngineer");
  };

  public getTimeDataToSubmit(taskId) {
    let query = '';
    //09/19/2019 Shivansh Subnani query changes.
    query = "Select * from Time where Db_Syncstatus='false' AND OracleDBID = ? AND JOB_NUMBER = ? ORDER BY ENTRYDATE";
    return this.getList(query, [this.valueProvider.getUserId(), taskId], "getTimeDataToSubmit");
  }

  updateTimeSyncStatusOSC(responseList, isSubmitted, isClaritySubmit?) {
    return new Promise((resolve, reject) => {
      let query;
      if (isSubmitted == 'false') {
        /** Sync_Status = 'false' removing sync_status for saving time entries  ==> TCU-71*/
        query = "UPDATE Time SET DB_Syncstatus = 'false' ,isSubmitted = 'true' where Time_Id = ?";
      }
      else {
        query = "UPDATE Time SET  DB_Syncstatus = 'true', isSubmitted='true' where Time_Id = ?";
      }
      if (isClaritySubmit) {
        query = "UPDATE Time SET  DB_Syncstatus = 'true', isSubmitted='true', import_level = '2' where Time_Id = ?";
      }
      this.dbctrl.getDB().transaction((transaction) => {
        let sqlBatchStmt = [];

        let stmtValues;
        for (let k in responseList) {
          let timeList = responseList[k];
          stmtValues = [];
          let sqlUpdate: any[] = [query];
          stmtValues.push(timeList.Time_Id ? timeList.Time_Id : timeList.timeId);
          sqlUpdate.push(stmtValues);
          sqlBatchStmt.push(sqlUpdate);
        }
        // this.logger.log(this.fileName, 'updateContactId', "Updated contact id's :" + JSON.stringify(stmtValues));
        this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (tx, res) => {

          resolve(responseList);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'updateTimeSyncStatus', "Error : " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'updateTimeSyncStatus', "Error TXN : " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };
  updateTimeStatusOnjobNumber(jobNumber) {
    return this.getList("UPDATE Time SET Sync_Status = 'false' , DB_Syncstatus = 'false' ,isSubmitted = 'true' where Job_Number = ?", [jobNumber], "updateTimeStatusOnjobNumber")
  }

  getFilteredTimeRecords(searchParam, weekStart, weekEnd) {
    let params = [weekStart, weekEnd];
    return this.getList("select * from time where issubmitted ='false' AND EntryDate between '" + weekStart + "' AND '" + weekEnd + "' And job_number like  '%" + searchParam + "%'", [], "getFilteredTimeRecords")
  }
  setIsSubmitted(taskID) {
    return this.getList("UPDATE Time SET isSubmitted = 'true' where Job_Number = ?", [taskID], "setIsSubmitted")
  }
  getSelectedProcess(taskNumber) {
    return this.getList("select selected_process from task where task_number = ? ", [taskNumber], "getSelectedProcess")
  }

  getActivityLov() {
    return this.getList("Select * from WorkType where NC ='1'", [], "getActivityLov")
  }
  getTimeCodeLov() {
    return this.getList("Select * from Item ", [], "getTimeCodeLov")
  }
  getTempTableData(jobNumber) {
    return this.getList("Select * from Temp_Time where job_number = ?", [jobNumber], "getTempTableData")
  }
  updateTempTableData(timeSheet, jobType, tempObj) {
    let query = "UPDATE Time_Temp SET SerialNumber = ?,Item = ? ,TagNumber = ?,Work_Type_Id = ?,Work_Type= ?, Work_Type_OT= ?, Item_Id = ?,charge_method_Id = ? ,charge_method = ? , Job_Type = ?  where job_number = ? and isSubmitted='false' and ifnull(SerialNumber,'') = ? and Item = ? and ifnull(TagNumber,'') = ? and Work_Type_Id = ? and Work_Type = ? and Item_Id = ? ";
    let queryParams = [timeSheet.SerialNumber, timeSheet.Item, timeSheet.TagNumber, timeSheet.Work_Type_Id, timeSheet.newActivityType, timeSheet.Work_Type_OT, timeSheet.Item_Id, timeSheet.Charge_Method_Id, timeSheet.Charge_Method, jobType, timeSheet.Job_Number, tempObj.SerialNumber, tempObj.Item, tempObj.TagNumber, tempObj.Work_Type_Id, tempObj.Work_Type, tempObj.Item_Id];
    if (tempObj.Charge_Method && tempObj.Charge_Method_Id) {
      query = query + " and charge_method = ? and charge_method_Id= ?";
      queryParams.push(tempObj.Charge_Method);
      queryParams.push(tempObj.Charge_Method_Id);
    }
    if (tempObj.Work_Type_Id == '-11000' && tempObj.Work_Type_OT) {
      query = query + " and Work_Type_OT = ? ";
      queryParams.push(tempObj.Work_Type_OT);
    }

    return this.getList(query, queryParams, "updateTempTableData")
  }
  insertTempTimeDataToTime(jobNumber) {
    return this.getList("Insert OR REPLACE INTO Time SELECT * FROM Time_Temp where Job_Number = ? ", [jobNumber], "insertTempTimeDataToTime")
  }

  deleteTimeRecords(tableName, Job_Number, StartDate, EndDate, tempObj) {
    StartDate = moment(StartDate, 'DD-MMM-YYYY').format('YYYY-MM-DD')
    EndDate = moment(EndDate, 'DD-MMM-YYYY').format('YYYY-MM-DD')
    let query = "";
    if (tempObj.StatusID == Enums.Jobstatus.Debrief_In_Progress) {
      query = "UPDATE " + tableName + " set isdeleted = 'true', db_syncstatus = 'false' where Sync_Status='false' and isAdditional='true' ";
    }
    else if (tempObj.StatusID == Enums.Jobstatus.Debrief_Declined) {
      query = "UPDATE " + tableName + " set isdeleted = 'true', db_syncstatus = 'false' where (Sync_Status='false' and isAdditional='true' and (Original is null OR Original = '')) ";
    }
    else {
      query = "UPDATE " + tableName + " set isdeleted = 'true', db_syncstatus = 'false' where Sync_Status='false' and (Original is null OR Original = '') ";
    }

    query = query + "and job_number = ? and entryDate between ? and ?";
    let queryParams = [Job_Number, StartDate, EndDate];

    if (tempObj.SerialNumber) {
      query += " AND SerialNumber =?";
      queryParams.push(tempObj.SerialNumber);
    }
    else {
      query += " AND (SerialNumber is null OR SerialNumber = '')";
    }

    if (tempObj.Item) {
      query += " AND Item =?";
      queryParams.push(tempObj.Item);
    }
    else {
      query += " AND (Item is null OR Item = '')";
    }

    if (tempObj.TagNumber) {
      query += " AND TagNumber =?";
      queryParams.push(tempObj.TagNumber);
    }
    else {
      query += " AND (TagNumber is null OR TagNumber = '')";
    }

    if (tempObj.Work_Type_Id) {
      query += " AND Work_Type_Id =?";
      queryParams.push(tempObj.Work_Type_Id);
    }
    else {
      query += " AND (Work_Type_Id is null OR Work_Type_Id = '')";
    }

    if (tempObj.Work_Type) {
      query += " AND Work_Type =?";
      queryParams.push(tempObj.Work_Type);
    }
    else {
      query += " AND (Work_Type is null OR Work_Type = '')";
    }

    if (tempObj.Item_Id) {
      query += " AND Item_Id =?";
      queryParams.push(tempObj.Item_Id);
    }
    else {
      query += " AND (Item_Id is null OR Item_Id = '')";
    }

    if (tempObj.Charge_Method) {
      query += " AND Charge_Method =?";
      queryParams.push(tempObj.Charge_Method);
    }
    else {
      query += " AND (Charge_Method is null OR Charge_Method = '')";
    }

    if (tempObj.Charge_Method_Id) {
      query += " AND Charge_Method_Id =?";
      queryParams.push(tempObj.Charge_Method_Id);
    }
    else {
      query += " AND (Charge_Method_Id is null OR Charge_Method_Id = '')";
    }

    return this.getList(query, queryParams, "deleteTimeRecords")
  }

  getClarityProject(JobNumber) {
    let query = `select MJ.P_PROJECTNUMBER AS PROJECT, MJ.OSC_ID from task tsk  INNER JOIN MST_Project MJ ON MJ.P_PROJECTNUMBER = tsk.Project_Number
    WHERE tsk.task_number = ?`;
    return this.getList(query, [JobNumber], "getClarityProject")
  }
  /**
      * Preeti Varshney 10/31/2019
      * Changes the query for filtering lovs for advance search when no project is selected.
      */
  getClarityOvertimeCode(project, isAdvSearch?) {
    let query;
    let queryParams = [];
    if (isAdvSearch && !project) {
      query = "Select * from MST_OvertimeCode";
    }
    else {
      query = "Select OC.* from MST_OvertimeCode OC INNER JOIN MST_Project MP ON MP.P_PROJECTNUMBER = OC.PROJECT WHERE MP.OSC_ID = ?";
      queryParams.push(project)
    }
    return this.getList(query, queryParams, "getClarityOvertimeCode")
  }
  /**
    * Preeti Varshney 10/31/2019
    * Changes the query for filtering lovs for advance search when no project is selected.
    */
  getClarityShiftCode(project, isAdvSearch?) {
    let query;
    let queryParams = [];
    if (isAdvSearch && !project) {
      query = "Select * from MST_ShiftCode";
    }
    else {
      query = "Select SC.* from MST_ShiftCode SC INNER JOIN MST_Project MP ON MP.P_PROJECTNUMBER = SC.PROJECT WHERE MP.OSC_ID = ?";
      queryParams.push(project);
    }
    return this.getList(query, queryParams, "getClarityShiftCode")
  }

  checkIfSameOscJobexist(jobNumber) {
    let query = "select count(*) as COUNT from task where task_number = ? and ResourceId = ?";
    if (this.valueProvider.getSelectedprocess() == Enums.Selected_Process.FCR || this.valueProvider.getSelectedprocess() == Enums.Selected_Process.FCR_AND_SDR) {
      query = "select count(*) as COUNT from task where Job_Number = ? and ResourceId = ?"
    }
    return this.getList(query, [jobNumber, this.valueProvider.getResourceId()], 'checkIfSameOscJobexist')
  }
  /**
   *@Prateek
   *Get job type for standalone job
   */
  getFieldType(jobnumber) {

    let query = "select * from SDRREPORT where JOBID =?";
    return this.getList(query, [jobnumber], "getWorkFlowElementName");
  }
  public getStates(countryCode) {
    let query = "SELECT * FROM State where Country_Code = ? order by StateName";
    let queryParams = [countryCode];
    return this.getList(query, queryParams, "setTask");
  }

  getAbsenceType() {
    return this.getList("SELECT LookupID as ID, LookupValue as Value FROM Lookups WHERE LookupType = 'AbsenceType' and IsActive='Y' order by LookupValue", [], "getAbsenceType")
  }

  /**
   * Mr Rajat Gupta
   * Get all Time Entries according to the From and To Date
   */
  public getTimeEntriesForReport(dateParam) {
    let query = "Select distinct t.*,tk.Business_Unit, tk.Request_Summary, tk.Customer_Name, tk.Job_Description as Field_Job_Type, u.Name as TimeCustomerName, u.Email as TimeCustomerEmail, t.State as t_state, t.City as t_city, t.Country_Code as t_Country_Code FROM  Time t  INNER JOIN User u on t.OracleDBID=u.UserID  LEFT JOIN Task tk ON t.Task_Number = tk.Task_Number WHERE t.isDeleted = 'false' AND (DATE(t.EntryDate) BETWEEN ? AND ?) AND t.OracleDBID = " + dateParam.UserID;
    let queryParams = [dateParam.start_date, dateParam.end_date];
    return this.getList(query, queryParams, "getTimeEntries");
  }

  public getAllowanceEntriesForReport(dateParam) {

    let query = "SELECT c.MODIFIEDDATE as SITE_MODIFIEDDATE, c.CREATEDDATE as SITE_CREATEDDATE, u.Name as TimeCustomerName, u.Email as TimeCustomerEmail, u.*, c.ENTRYDATE as 'EntryDate', case when c1.FIELD1='Other' then c1.FIELD1_OT else c1.FIELD1 end as 'Overtime_HOURS', case when c1.FIELD2='Other' then c1.FIELD2_OT else c1.FIELD2 end as 'Overtime_MULTIPLIER',  case when c2.FIELD1='Other' then c2.FIELD1_OT else c2.FIELD1 end as 'Meal_County',  case when c2.FIELD2='Other' then c2.FIELD2_OT else c2.FIELD2 end as 'Meal_Site',  case when c3.FIELD1='Other' then c3.FIELD1_OT else c3.FIELD1 end as 'Travel_HOURS',  case when c3.FIELD2='Other' then c3.FIELD2_OT else c3.FIELD2 end as 'Travel_MULTIPLIER',  case when c4.FIELD1='Other' then c4.FIELD1_OT else c4.FIELD1 end as 'SiteAllowance_ONSHORE_OFFSHORE',  case when c4.FIELD2='Other' then c4.FIELD2_OT else c4.FIELD2 end as 'SiteAllowance_Country', c5.Notes as 'Notes' FROM Allowance c LEFT JOIN Allowance c1 ON c.ENTRYDATE = c1.ENTRYDATE and c1.AllowanceType='Overtime' LEFT JOIN Allowance c2  ON c.ENTRYDATE = c2.ENTRYDATE and c2.AllowanceType='Meal' LEFT JOIN Allowance c3 ON c.ENTRYDATE = c3.ENTRYDATE and c3.AllowanceType='Travel' LEFT JOIN Allowance c4 ON c.ENTRYDATE = c4.ENTRYDATE and c4.AllowanceType='SiteAllowance' LEFT JOIN Allowance c5 ON c.ENTRYDATE = c5.ENTRYDATE and c5.AllowanceType='Notes' INNER JOIN User u on c.OracledbID=u.userID WHERE c.ISDELETED='false' AND (DATE(c.ENTRYDATE) BETWEEN ? AND ?) AND c.ORACLEDBID = " + dateParam.UserID + " group by c.ENTRYDATE";
    let queryParams = [dateParam.start_date, dateParam.end_date];
    return this.getList(query, queryParams, "getTimeEntries");
  }
  /**
 * Mr Rajat Gupta
 * 
 */
  async getSummarizedData(dataParam) {
    //NON Clarity
    let query;
    // query = `SELECT tn.*,(SELECT tm.Time_Id FROM Time tm WHERE tm.Original = tn.Time_Id) As CurrentMobileId FROM TIME tn INNER JOIN Task tt ON tt.Task_Number = tn.Task_Number WHERE DATE(tn.EntryDate) BETWEEN ? and ? AND  tn.OracleDBID = ? and tn.isDeleted='false'`;
    // query = "SELECT tn.EntryDate,tn.Clarity_Project,tn.Time_Id, tt.Customer_Name as Customer, tn.Job_Number as Job_ID, tn.Duration,tn.Field_Job_Name,  tn.Work_Type FROM TIME as tn INNER JOIN User as u ON u.UserID = tn.OracleDBID INNER JOIN Task tt ON tt.Task_Number = tn.Task_Number WHERE DATE(tn.EntryDate) BETWEEN ? AND ? AND  tn.OracleDBID = ? and isDeleted='false'";

    query = `SELECT tn.EntryDate,tn.Clarity_Project,tn.Time_Id,tn.Work_Type, tt.Customer_Name as 
              Customer, tn.Job_Number as Job_ID, tn.Duration,tn.Field_Job_Name,
              tn.Work_Type FROM TIME as tn INNER JOIN 
              Task tt ON tt.Task_Number = tn.Task_Number WHERE  (SELECT Time_Id FROM Time WHERE Original = tn.Time_Id) is null AND  DATE(tn.EntryDate) BETWEEN ? AND ? AND  tn.OracleDBID = ? and isDeleted='false' order by tn.Start_Time,tn.EntryDate`;

    let queryParams = [dataParam.start_date, dataParam.end_date, this.valueProvider.getUser().UserID];
    return this.getList(query, queryParams, "getSummarizedData");
  }

  /**
 * Prateek
 * Calculate total hours for summarized data (Site Allowence)
 */
  async getTotalHourSummarizedData(dataParam) {
    //NON Clarity
    let query;
    //   query = `Select Time_Id, tm.EntryDate,time(sum(strftime('%s', Duration)), 'unixepoch') 
    // As Totalhours from Time tm INNER JOIN Task tt ON tt.Task_Number = tm.Task_Number Where tm.EntryDate Between ? and ? and tm.OracleDBID=? and tm.isDeleted='false' and 
    // (SELECT Time_Id FROM Time WHERE Original = Time_Id) is null Group By EntryDate`
    //this.valueProvider.getUser().UserID;
    query = `Select Time_Id, tm.EntryDate,time(sum(strftime('%s', tm.Duration)), 'unixepoch') 
    As Totalhours from Time tm INNER JOIN Task tt ON tt.Task_Number = tm.Task_Number Where tm.EntryDate between ? AND ? and tm.OracleDBID=? and tm.isDeleted='false' and 
    (SELECT Time_Id FROM Time WHERE Original = tm.Time_Id) is null Group By tm.EntryDate`;
    let queryParams = [dataParam.start_date, dataParam.end_date, this.valueProvider.getUser().UserID];
    return this.getList(query, queryParams, "getTotalHourSummarizedData");
  }

  /**
 * Mr Rajat Gupta
 * 
 */
  async getMaxCountData(dataParam) {
    //NON Clarity
    let query;
    // query = `SELECT  tm.EntryDate, COUNT(EntryDate) as max_count FROM TIME as tm INNER JOIN 
    // Task tt ON tt.Task_Number = tm.Task_Number
    // WHERE EntryDate Between ? AND ? AND tm.OracleDBID = ? Group By tm.EntryDate order by max_count DESC LIMIT 1`;

    query = `SELECT  tm.EntryDate, COUNT(tm.EntryDate) as max_count FROM TIME as tm INNER JOIN Task tt ON tt.Task_Number = tm.Task_Number WHERE (SELECT Time_Id FROM Time WHERE Original = tm.Time_Id) is null AND tm.EntryDate Between ? AND ? AND tm.OracleDBID = ? AND tm.isDeleted='false' Group By tm.EntryDate order by max_count DESC LIMIT 1`
    let queryParams = [dataParam.start_date, dataParam.end_date, this.valueProvider.getUser().UserID];
    return this.getList(query, queryParams, "getMaxCountData");
  }


  /**
   * Mayur Varshney -- 01-01-2020
   * Change the IsDeleted status 'true' and Db_Syncstatus 'false' of those entries whose IsSubmitted status is 'true' so that all the pending entries will      picked automatically to delete allowance entries from ATP 
   * @param {any} date 
   * @returns 
   * @memberOf LocalServiceProvider
   */
  async deleteATPAllowanceTimeEntries(date) {
    let query = "UPDATE Allowance SET IsDeleted = ?, DB_Syncstatus = ? WHERE EntryDate BETWEEN ? AND ? AND OracleDBID = ? AND IsSubmitted = ?";
    let queryParams = ['true', 'false', date.startDate, date.endDate, this.valueProvider.getUserId(), 'true'];
    return this.getList(query, queryParams, "deleteTimeEntries");
  }


  /**
   * Mayur Varshney -- 01-01-2020
   * Delete all the allowance entries that were submitted in offline mode from the local db whose IsSubmitted status is 'false'
   * @param {any} date 
   * @returns 
   * @memberOf LocalServiceProvider
   */
  async deleteLocalAllowanceTimeEntries(date) {
    let query = "DELETE from Allowance WHERE EntryDate BETWEEN ? AND ? AND OracleDBID = ? AND IsSubmitted = ?";
    let queryParams = [date.startDate, date.endDate, this.valueProvider.getUserId(), 'false'];
    return this.insertData(query, queryParams, "deleteTimeEntries");
  }

  /**
   * Mayur Varshney -- 01-01-2020
   * get allowance data on the basis of start date and end date
   * @param {any} date 
   * @returns 
   * @memberOf LocalServiceProvider
   */
  async getAllowanceData(startDate, endDate) {
    let query = "Select Count(*) as Count from Allowance WHERE EntryDate BETWEEN ? AND ? AND OracleDBID = ? AND ISDELETED = ?";
    let queryParams = [startDate, endDate, this.valueProvider.getUserId(), 'false'];
    return this.getList(query, queryParams, "getAllowanceData");
  }


  /**
   * 01-28-2020 -- Mayur Varshney
   * get standard_code on the basis of Code from MST_Language table
   * @param {any} langCode 
   * @returns 
   * @memberOf LocalServiceProvider
   */
  getStandardLangCode(langCode) {
    let query = "Select Standard_Code from MST_Languages WHERE Code = ?";
    let queryParams = [langCode];
    return this.getList(query, queryParams, "getStandardLangCode");
  }

  /**
* Preeti Varshney 02/03/2020
* Update Comments from Comment Modal in Non-OSC Non-Clarity.
*/
  updateTimeComments(dataArray) {
    let sqlBatchStmt = [];
    for (let k in dataArray) {
      let data = dataArray[k];
      let stmtValues = [];
      let sqlInsert: any[] = ["Update Time SET Comments = ?,DB_Syncstatus =? WHERE Time_Id = ?"];
      stmtValues.push(data.Comments ? data.Comments : null);
      stmtValues.push(data.DB_Syncstatus);
      stmtValues.push(data.Time_Id);
      sqlInsert.push(stmtValues);
      sqlBatchStmt.push(sqlInsert);
    }
    return this.insertBatchData(sqlBatchStmt, "updateTimeComments");
  }

  createObject(key) {
    return Object.assign(Object.create(key), key)
  }

  getCountTimeEntries(responseList, check, fromEdit) {
    /* let query = '';
    let params = [];
    // for (let i = 0; i < responseList.length; i++) {
    let TimeId = responseList[0].Time_Id;
    if (nightShift) {
      query = "select EntryDate, Time_Id, Start_Time, case when End_Time == '00:00' then '24:00' else End_Time end as End_New, Job_Number, (SELECT tmp.Time_Id FROM Time tmp WHERE tmp.Original = Time.Time_Id) As CurrentMobileId FROM Time WHERE CurrentMobileId IS NULL AND ( (EntryDate BETWEEN ? AND ?) AND ((? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? < TIME(Start_Time) AND ? > TIME(End_Time))) OR (EntryDate BETWEEN ? AND ?) AND ((? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? < TIME(Start_Time) AND ? > TIME(End_Time))) ) and OracleDBID = ? and isDeleted='false' order by EntryDate, Start_Time desc;";
    } else {
      if (TimeId != null) {
        query = "select EntryDate, Time_Id, Start_Time, End_Time, Job_Number, (SELECT tmp.Time_Id FROM Time tmp WHERE tmp.Original = Time.Time_Id) As CurrentMobileId FROM Time WHERE CurrentMobileId IS NULL AND ( (EntryDate BETWEEN ? AND ?) AND ((? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? BETWEEN TIME(Start_Time) AND (End_Time)) OR (? < TIME(Start_Time) AND ? > TIME(End_Time))) AND Time_Id != ? ) and OracleDBID = ? and isDeleted='false' order by EntryDate, Start_Time desc";
      } else {
        query = "select EntryDate, Time_Id, Start_Time, End_Time, Job_Number, (SELECT tmp.Time_Id FROM Time tmp WHERE tmp.Original = Time.Time_Id) As CurrentMobileId FROM Time WHERE CurrentMobileId IS NULL AND ( (EntryDate BETWEEN ? AND ?) AND ( (? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? BETWEEN TIME(Start_Time) AND TIME(End_Time)) OR (? < TIME(Start_Time) AND ? > TIME(End_Time))) ) and OracleDBID = ? and isDeleted='false' order by EntryDate, Start_Time desc;";
      }
    }
    // Check double entry times between start date - end date
    params.push(searchDates.startDate);
    params.push(searchDates.endDate);
    // To check start time
    if (check == "secondCheck") {
      let startTime = responseList[0].Start_Time.split(":");
      let minutes = (startTime[1] == "00") ? parseInt(startTime[1]) + 2 : parseInt(startTime[1]) + 1; // startTime[1] = "01"; // Add 1 min to time
      let time = (minutes < 9) ? startTime[0] + ":0" + minutes : startTime[0] + ":" + minutes;
      params.push(time);
    } else {
      params.push(responseList[0].Start_Time);
    }
    params.push(responseList[0].End_Time);
    params.push(responseList[0].Start_Time);
    params.push(responseList[0].End_Time);

    // Only for night shift entries
    if (nightShift) {
      params.push(searchDates.endDate);
      params.push(searchDates.endDate);
      if (check == "secondCheck") {
        let startTime = responseList[1].Start_Time.split(":");
        let minutes = (startTime[1] == "00") ? parseInt(startTime[1]) + 2 : parseInt(startTime[1]) + 1; // startTime[1] = "01"; // Add 1 min to time
        let time = (minutes < 9) ? startTime[0] + ":0" + minutes : startTime[0] + ":" + minutes;
        params.push(time);
      } else {
        params.push(responseList[1].Start_Time);
      }
      params.push(responseList[1].End_Time);
      params.push(responseList[1].Start_Time);
      params.push(responseList[1].End_Time);
    }

    if (TimeId != null) {
      params.push(responseList[0].Time_Id);
    }
    params.push(this.valueProvider.getUserId());
    return this.getList(query, params, "get count for matched time"); */
    // }

    let obj;
    let condObj;
    if (responseList.length > 1 && check == 'secondcheck') {
      obj = [this.valueProvider.getUserId(), responseList[1]['EntryDate']];
      condObj = this.createObject(responseList[1]);
    } else {
      obj = [this.valueProvider.getUserId(), responseList[0]['EntryDate']];
      condObj = this.createObject(responseList[0]);
    }
    if (condObj['End_Time'] == '00:00') {
      condObj['End_Time'] = '24:00';
    }
    let query = "";
    if (fromEdit) {
      query = "select *, case when End_Time == '00:00' then '24:00' else End_Time end as End_New,  (SELECT tm.Time_Id FROM Time tm WHERE tm.Original = time.Time_Id) As CurrentMobileId FROM Time WHERE CurrentMobileId IS NULL and OracleDBID = ? AND EntryDate = ? AND ((TIME('" + condObj['Start_Time'] + "','+1 minutes') BETWEEN TIME(Start_Time,'+1 minutes') AND TIME(End_New)) OR (TIME('" + condObj['End_Time'] + "','-1 minutes') BETWEEN TIME(Start_Time) AND TIME(End_New,'-1 minutes')) OR ('" + condObj['Start_Time'] + "' < TIME(Start_Time) AND '" + condObj['End_Time'] + "' > TIME(End_New))) and isDeleted='false' and Time_Id NOT IN (Select Time_Id from Time_Temp)"
      if (condObj['Time_Id']) {
        query += " AND Time_Id != " + condObj['Time_Id'];
      }
      query += " UNION ";
      query += "select *,case when End_Time == '00:00' then '24:00' else End_Time end as End_New,(SELECT tmp.Time_Id FROM Time_Temp tmp WHERE tmp.Original = Time_Temp.Time_Id) As CurrentMobileId FROM Time_Temp WHERE CurrentMobileId IS NULL and OracleDBID = ? AND EntryDate = ? AND ((TIME('" + condObj['Start_Time'] + "','+1 minutes') BETWEEN TIME(Start_Time,'+1 minutes') AND TIME(End_New)) OR (TIME('" + condObj['End_Time'] + "','-1 minutes') BETWEEN TIME(Start_Time) AND TIME(End_New,'-1 minutes')) OR ('" + condObj['Start_Time'] + "' < TIME(Start_Time) AND '" + condObj['End_Time'] + "' > TIME(End_New))) and isDeleted='false'";
      obj.push(this.valueProvider.getUserId());
      obj.push(condObj['EntryDate']);
    }
    else {
      query = "select *,case when End_Time == '00:00' then '24:00' else End_Time end as End_New,(SELECT tm.Time_Id FROM Time tm WHERE tm.Original = time.Time_Id) As CurrentMobileId FROM Time WHERE CurrentMobileId IS NULL and OracleDBID = ? AND EntryDate = ? AND ((TIME('" + condObj['Start_Time'] + "','+1 minutes') BETWEEN TIME(Start_Time,'+1 minutes') AND TIME(End_New)) OR (TIME('" + condObj['End_Time'] + "','-1 minutes') BETWEEN TIME(Start_Time) AND TIME(End_New,'-1 minutes')) OR ('" + condObj['Start_Time'] + "' < TIME(Start_Time) AND '" + condObj['End_Time'] + "' > TIME(End_New))) and isDeleted='false'";
    }
    if (condObj['Time_Id']) {
      query += " AND Time_Id != " + condObj['Time_Id'];
    }
    query += " order by Start_Time asc";
    return this.getList(query, obj, "checkIfSameJobId")
  };

}
