import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { ValueProvider } from '../value/value';
import { TransformProvider } from '../transform/transform';
// import { SQLite } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { LoggerProvider } from '../../providers/logger/logger';
import * as Enums from '../../enums/enums';
import * as moment from "moment";
import { CustomerDbProvider } from '../customer-db/customer-db';
import { UtilityProvider } from '../utility/utility';
import * as _ from 'lodash';
// import { windowWhen } from 'rxjs/operators';

/*
  Generated class for the LocalServiceSdrProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class LocalServiceSdrProvider {
  public dbName = 'emerson.sqlite';
  fileName: any = 'Local_Service_Sdr';
  private valueProvider: ValueProvider
  constructor(injector: Injector, public transformProvider: TransformProvider, public http: HttpClient, public dbctrl: DatabaseProvider, public platform: Platform, public logger: LoggerProvider, public customerDbProvider: CustomerDbProvider, public utilityProvider: UtilityProvider) {
    this.platform.ready().then((readySource) => {
      // console.log("ready");
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'constructor', 'Error in Platform ready: ' + JSON.stringify(err));
    });
    setTimeout(() => this.valueProvider = injector.get(ValueProvider));
  }

  public getLookupsByLookupType(lookupType, ParentID?, parentRefId?) {
    let query = "select * from lookups where lookuptype = ? and isactive = 'Y' ";
    if (ParentID) {
      query = query + " AND PARENTID = " + ParentID;
    }
    if (parentRefId) {
      query = query + " AND ParentReferenceID = " + parentRefId;
    }
    else {
      query = query + " AND ParentReferenceID is null";
    }
    // query = query + " Order By DisplayOrder ";
    query = query + " Order By LookupValue ";
    let queryParams = [lookupType];
    return this.getList(query, queryParams, "getLookupsByLookupType")
  }

  public getLookupsOrderByLookupValue(lookupType) {
    let query = "select * from lookups where lookuptype = ? ";
    query = query + " Order By LookupValue ";
    let queryParams = [lookupType];
    return this.getList(query, queryParams, "getLookupsOrderByLookupValue")
  }

  /**
  *  Select Columns from As Found Actuation in local DB
  *
  *  06/13/2019 Narsimha
  *  insert and update query
  */
  // public getAsFoundActuation(REPORTID) {
  //   let query = "select * from ASFOUNDACTUATION where REPORTID = ?";
  //   return this.getList(query, [REPORTID], "getAsFoundActuation")
  // }

  /**
  *  Select Columns from Device Test Actuation in local DB
  *
  *  06/13/2019 Narsimha
  *  insert and update query
  */
  // public getDeviceTestActuation(REPORTID) {
  //   let query = "select * from DEVICETESTACTUATION where REPORTID = ?";
  //   return this.getList(query, [REPORTID], "getPreTestActuation")
  // }

  /**
  *  insertOrUpdateData in local DB
  *
  *  06/13/2019 Narsimha, updated by Hardik
  *  insert and update query
  */
  public insertOrUpdateData(dataObj, isRecordExists, primaryKey, tableName, whereClause?) {
    dataObj = JSON.parse(JSON.stringify(dataObj).replace("'", "''"));
    if (isRecordExists) {
      dataObj.MODIFIEDBY = parseInt(this.valueProvider.getUserId());
      dataObj.MODIFIEDDATE = this.getCurrentDate();
    } else {
      dataObj[primaryKey] = this.utilityProvider.getUniqueKey();
      dataObj.CREATEDBY = parseInt(this.valueProvider.getUserId());
      dataObj.CREATEDDATE = this.getCurrentDate();
      dataObj.MODIFIEDBY = parseInt(this.valueProvider.getUserId());
      dataObj.MODIFIEDDATE = this.getCurrentDate();
    }
    dataObj.SYNCSTATUS = "N";
    return new Promise((resolve, reject) => {

      let uniqueId = dataObj[primaryKey] ? dataObj[primaryKey] : null;

      this.insertJsonData(dataObj, tableName, [], 'insert ' + tableName + "insertOrUpdateData").then(res => {
        resolve(uniqueId);
      }, (error) => {
        this.logger.log(this.fileName, 'insert ' + tableName, 'Error: ' + JSON.stringify(error.message));
        reject(error);
      });


      // this.dbctrl.getDB().transaction((transaction) => {
      //   let insertUpdateValues = "";
      //   let uniqueId = dataObj[primaryKey] ? dataObj[primaryKey] : null;
      //   let updateQuery = "UPDATE " + tableName + " SET ";
      //   let insertQuery = "INSERT OR IGNORE INTO " + tableName + " (";
      //   let insert = "";
      //   let insert1 = "";
      //   let sqlInsert = [];
      //   let queryParams = []

      //   let dataKeys = Object.keys(dataObj);
      //   if (dataKeys.length) {
      //     dataKeys.forEach((key) => {
      //       updateQuery += key + "= '" + dataObj[key] + "', ";
      //       insert += key + ", ";
      //       insert1 += "? , ";
      //       queryParams.push(dataObj[key] ? dataObj[key] : null );
      //       //insert1 += "'" + dataObj[key] + "', ";
      //     })
      //     if (isRecordExists) {
      //       // Update query
      //       updateQuery += "WHERE " + primaryKey + " = " + uniqueId;
      //       if (whereClause) {
      //         updateQuery += ' and ' + whereClause;
      //       }
      //       updateQuery = updateQuery.replace(", WHERE", " WHERE").replace(/'null'/g, 'null').replace(/'No Value'/g, 'null');
      //       insertUpdateValues = updateQuery;
      //     }
      //     else {
      //       // Insert query
      //       insertQuery += insert + ") VALUES (" + insert1 + ")";
      //       insertQuery = insertQuery.replace(/, \)/g, ')').replace(/'null'/g, 'null').replace(/'No Value'/g, 'null');
      //       insertUpdateValues = insertQuery;
      //     }
      //     sqlInsert.push(insertUpdateValues);
      //     sqlInsert.push(queryParams);

      //     transaction.executeSql([sqlInsert], [], (tx, res) => {
      //       resolve(uniqueId);
      //     }, (tx, error) => {
      //       this.logger.log(this.fileName, 'insert ' + tableName, 'Error: ' + JSON.stringify(error.message));
      //       reject(error);
      //     });
      //   }
      // }, (error) => {
      //   this.logger.log(this.fileName, 'insert ' + tableName, 'Error TXN: ' + JSON.stringify(error.message));
      //   reject(error);
      // });
    })
  }

  async getTimeList(taskId) {
    let query = `SELECT tm.*,Task.StatusID StatusID,Task.IsDeclined IsDeclined, (SELECT Time_Id FROM Time WHERE Original = tm.Time_Id) As CurrentMobileId FROM Time tm inner Join Task on task.Task_Number=tm.Task_Number WHERE CurrentMobileId IS NULL AND tm.Job_Type is not 'vacation' AND tm.Task_Number = ? AND tm.OracleDBID = ? AND tm.isDeleted='false' AND tm.EntryDate is null
    order by tm.EntryDate, tm.Start_Time`;

    let queryParams = [taskId.toString(), this.valueProvider.getUserId()];
    return await this.getList(query, queryParams, "getTimeList");
  };

  // async gettimelist() {
  //   await this.getTimeList(String(this.valueProvider.getTaskId())).then((res: any[]) => {
  //     return res;
  //     //this.logger.log(this.fileName, 'gettimelist', "JOb Name" + this.timeArraySummary);
  //   }).catch((err: any) => {
  //     this.logger.log(this.fileName, 'gettimelist', 'Error in getTimeList : ' + JSON.stringify(err));
  //   });
  // }

  async ifTimeValid(timeObjectData) {
    let timeObjects = this.createObject(timeObjectData);
    // let timeArraySummary:any= await this.getTimeList(String(this.valueProvider.getTaskId()))
    for (let i = 0; i < timeObjects.length; i++) {
      const timeObject = timeObjects[i];
      let timeArraySummary: any = await this.getTimeList(timeObject.Task_Number)
      let sourceStartDate = new Date(moment(timeObject.EntryDate).toString());
        let sourceEndDate = new Date(moment(timeObject.EntryDate).toString());
        if(timeObject.End_Time=='00:00'){
          sourceEndDate = new Date(moment(timeObject.EntryDate).add(1,'days').toString());
      }
      let sourceStartTime = timeObject.Start_Time;
      let sourceEndTime = timeObject.End_Time;
      sourceStartDate.setHours(sourceStartTime.split(':')[0]);
      sourceStartDate.setMinutes(sourceStartTime.split(':')[1]);
      sourceStartDate.setSeconds(0);
      sourceStartDate.setMilliseconds(0);
      sourceEndDate.setHours(sourceEndTime.split(':')[0]);
      sourceEndDate.setMinutes(sourceEndTime.split(':')[1]);
      sourceEndDate.setSeconds(0);
      sourceEndDate.setMilliseconds(0);
      for (let k in timeArraySummary) {
        let timeObj = timeArraySummary[k];
        if (timeObject.Time_Id == timeObj.Time_Id) {
          continue;
        }
        let targetStartDate = new Date(moment(timeObj.Service_Start_Date).toString());
        let targetEndDate = new Date(moment(timeObj.Service_End_Date).toString());
        timeObj.Start_Time = moment(timeObj.Service_Start_Date).format('HH:mm');
        timeObj.End_Time = moment(timeObj.Service_End_Date).format('HH:mm');
        let targetStartTime = timeObj.Start_Time;
        let targetEndTime = timeObj.End_Time;
        targetStartDate.setHours(targetStartTime.split(':')[0]);
        targetStartDate.setMinutes(targetStartTime.split(':')[1]);
        targetStartDate.setSeconds(0);
        targetStartDate.setMilliseconds(0);
        targetEndDate.setHours(targetEndTime.split(':')[0]);
        targetEndDate.setMinutes(targetEndTime.split(':')[1]);
        targetEndDate.setSeconds(0);
        targetEndDate.setMilliseconds(0);
        if ((moment(sourceStartDate).isSame(targetStartDate) && moment(sourceEndDate).isSame(targetEndDate)) ||
          (moment(sourceStartDate).isBetween(targetStartDate, targetEndDate)) ||
          (moment(sourceEndDate).isBetween(targetStartDate, targetEndDate)) ||
          (moment(targetStartDate).isBetween(sourceStartDate, sourceEndDate)) ||
          (moment(targetEndDate).isBetween(sourceStartDate, sourceEndDate))) {
          return [{ EntryDate: targetStartDate, endDate: targetEndDate, Start_Time: targetStartTime, End_Time: targetEndTime, Job_Number: timeObj.Job_Number }];
        }
      }
      return false;
    }
  }

  createObject(key) {
    return Object.assign(Object.create(key), key)
  }

  public checkTimeSheetOverlapData(dataObj, fromEdit?) {
    let obj = [this.valueProvider.getUserId(), dataObj['EntryDate']];
    let condObj;
    condObj = this.createObject(dataObj);
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
  }

  public insertOrUpdateTimeSheetData(dataObject, isRecordExists, tableName) {
    return new Promise((resolve, reject) => {
      dataObject.forEach(dataObj => {
        dataObj['isDeleted'] = false;
        // dataObj['Sync_Status'] = false;
        dataObj['ModifiedDate'] = new Date();
        dataObj['OracleDBID'] = this.valueProvider.getUserId();
        dataObj['ResourceId'] = String(this.valueProvider.getResourceId())
        dataObj['Service_Start_Date'] = dataObj.Service_Start_Date;
        dataObj['Service_End_Date'] = dataObj.Service_End_Date;
        dataObj['IsAdditional'] = false;
        dataObj['isSubmitted'] = false;
        dataObj['Date'] = new Date();
        if (!isRecordExists) {
          dataObj['Time_Id'] = this.utilityProvider.getUniqueKey();
          dataObj['Reconcile_Duration'] = undefined;
          dataObj['isPicked'] = true;
        }
        // let taskObj=this.valueProvider.getTask().StatusID?this.valueProvider.getTask():dataObj;

        if ((dataObj.StatusID == Enums.Jobstatus.Debrief_In_Progress || dataObj.StatusID == Enums.Jobstatus.Debrief_Declined)) {
          dataObj['IsAdditional'] = true;
          if (dataObj.StatusID == Enums.Jobstatus.Debrief_Declined && (dataObj.Sync_Status == true || dataObj.Sync_Status == 'true')) {
            let timeId = dataObj['Time_Id'];
            if (!dataObj['Original']) {
              dataObj['Time_Id'] = this.utilityProvider.getUniqueKey();
              if (isRecordExists) {
                dataObj['Original'] = timeId;
              }
            }
          }
        }

        dataObj['DB_Syncstatus'] = 'false';
        dataObj['Sync_Status'] = 'false';
        dataObj['Job_Status'] = dataObj.StatusID;
        if (this.valueProvider.getUser().ClarityID) {
          dataObj['Import_Level'] = Enums.clarityStatus.Saved;
        }
        this.insertJsonData(dataObj, tableName, ["CurrentMobileId", "TotalDuration", "IsDeclined", "StatusID", "newActivityType", "weekEditPage", "notes", "entryDate", "dayid", "dayName", "startTime", "endTime", "Group_Id", "Primary_Key", "Activity_Name", "OT_Code", "expanded", "totalDuration", "oldDuration", "duration", "AdvDate", "length", "DisableDelete", "isAdditional", "DisableEdit", "cssClass", 'DeleteTimeIds', 'displayDate', 'displayEndDate'], "insertOrUpdateTimeSheetData").then(res => {
          resolve(res);
        }, (error) => {
          this.logger.log(this.fileName, 'insert ' + tableName, 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      })
    });
  }

  public insertFromTempToTime(dataObject) {
    return new Promise((resolve, reject) => {
      dataObject.forEach(dataObj => {
        this.insertJsonData(dataObj, "Time", [], "insertFromTempToTime").then(res => {
          resolve(res);
        }, (error) => {
          this.logger.log(this.fileName, 'insert Time', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      })
    });
  }

  public insertJsonData(jsonObj, tableName, columnsToSkip, functionName) {
    let columnQuery = "", valueQuery = "", queryParams = [];
    let dataKeys = Object.keys(jsonObj);
    dataKeys.forEach((key) => {
      if (!columnsToSkip.find(col => col == key)) {
        columnQuery += key + ",";
        valueQuery += "?,"
        if (!(key.includes('Notes') || key.includes('_OT'))) {
          if (jsonObj[key] && jsonObj[key] == "No Value") {
            jsonObj[key] = null;
          }
        }
        queryParams.push(jsonObj[key]);
      }
    });
    columnQuery = columnQuery.slice(0, -1);
    valueQuery = valueQuery.slice(0, -1);
    let query = `INSERT OR REPLACE INTO ${tableName} (${columnQuery}) Values (${valueQuery})`;
    return this.insertData(query, queryParams, functionName);
  }

  insertNATask() {
    let data = {
      'Task_Number': Enums.jobIdNA.value,
      'Task_Status': Enums.JobstatusName.Debrief_Started,
      'Start_Date': new Date(),
      'End_Date': new Date(),
      'Type': 'STANDALONE',
      'Name': this.valueProvider.getUser().Name,
      'ResourceId': this.valueProvider.getUser().ID,
      'Sync_Status': 'false',
      'StatusID': Enums.Jobstatus.Debrief_Started,
      'IsStandalone': 'true',
      'Job_Number': 'Not Applicable',
      'OracleDBID': this.valueProvider.getUser().UserID,
      'ReportID': Enums.jobIdNA.value,
      'DBCS_SyncStatus': 'false'
    }
    this.insertJsonData(data, 'Task', [], 'setTaskNameNA');
  }
  private getList(query, queryParams, functionName) {
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
          reject(error);
        }));
      }, (error) => {
        this.logger.log(this.fileName, functionName, 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  /**
  *@Prateek:06/11/2019
  *Get data from device actuation table with report id.
  */
  getActuationdata(reportid, tableName, functionName) {
    let query = "select * from " + tableName + " where REPORTID=?"
    return this.getList(query, [reportid], functionName);
  }

  /**
   * Mayur Varshney
   * Get data as per table name and report id
   * @param {any} reportid
   * @param {any} tableName
   * @param {any} functionName
   * @returns
   *
   * @memberOf LocalServiceSdrProvider
   */
  getPageData(reportid, tableName, whereClause?) {
    let query = "select * from " + tableName + " where REPORTID=?"
    if (whereClause) {
      query = query + " and " + whereClause;
    }
    return this.getList(query, [reportid], "getPageData");
  }

  private insertData(query, queryParams, functionName) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql(query, queryParams, (tx, res) => {
          resolve(res.insertId);
        }, (tx, error) => {
          this.dbctrl.printInvalidQuery([[query, queryParams]]);
          this.logger.log(this.fileName, functionName, 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, functionName, 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  public getCurrentDate() {
    //  02/06/2019 -- Mayur Varshney -- save Created date time in UTC
    return moment.utc(new Date()).format("DD-MMM-YYYY hh:mm:ss.SSS A");
  }

  /**
  *@Prateek:06/11/2019
  *Get data from device actuation table with report id.
  */
  getFinalListdata(reportid) {
    // Preeti Varshney 05/06/2019 modify query
    let query = "select * from DEVICETESTACTUATION where REPORTID=?"
    return this.getList(query, [reportid], "getFinalListdata");
  }
  /**
  *@Prateek:06/11/2019
  *Update finallist data on the basis of reportid.
  */
  updateFinalList(finaltestlist) {
    let userid;
    if (finaltestlist.DTA_PK_ID == undefined) {
      userid = this.utilityProvider.getUniqueKey();
    }
    else {
      userid = finaltestlist.DTA_PK_ID
    }
    let modifieddate = this.getCurrentDate();
    if (!finaltestlist.CREATEDBY) finaltestlist.CREATEDBY = this.getCurrentUser();
    if (!finaltestlist.CREATEDDATE) finaltestlist.CREATEDDATE = this.getCurrentDate();
    let queryParams = [userid, finaltestlist.REPORTID,
      finaltestlist.DONEAIRPRESSUREPRETEST,
      finaltestlist.AIRPRESSUREPRETEST,
      finaltestlist.DONEFUNCTIONPRETEST,
      finaltestlist.FUNCTIONPRETEST,
      finaltestlist.HYDROPRETEST,
      finaltestlist.DONEHYDROPRETEST,
      finaltestlist.DONEVISUALPRETEST,
      finaltestlist.VISUALPRETEST,
      finaltestlist.DONEAIRPRESSUREPOSTTEST, finaltestlist.AIRPRESSUREPOSTTEST, finaltestlist.DONEFUNCTIONPOSTTEST,
      finaltestlist.FUNCTIONPOSTTEST, finaltestlist.DONEHYDROPOSTTEST, finaltestlist.HYDROPOSTTEST, finaltestlist.DONEVISUALPOSTTEST, finaltestlist.VISUALPOSTTEST, 'N', finaltestlist.CREATEDBY, finaltestlist.CREATEDDATE, this.getCurrentUser(), modifieddate];
    return this.insertData("INSERT OR REPLACE INTO DEVICETESTACTUATION (DTA_PK_ID,REPORTID,DONEAIRPRESSUREPRETEST,AIRPRESSUREPRETEST,DONEFUNCTIONPRETEST, FUNCTIONPRETEST,HYDROPRETEST,DONEHYDROPRETEST,DONEVISUALPRETEST,VISUALPRETEST,DONEAIRPRESSUREPOSTTEST,AIRPRESSUREPOSTTEST,DONEFUNCTIONPOSTTEST,FUNCTIONPOSTTEST,DONEHYDROPOSTTEST,HYDROPOSTTEST,DONEVISUALPOSTTEST,VISUALPOSTTEST,SYNCSTATUS,CREATEDBY,CREATEDDATE,MODIFIEDBY,MODIFIEDDATE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", queryParams, "updateFinalList");
  };
  /**
   *@Prateek 06/12/2019
   *Get element type in calibration and actuation
   */
  public getLookUpType(element) {
    let query = "select * from lookups where lookuptype = ?"
    let queryParams = [element]
    return this.getList(query, queryParams, "getElementType")
  }

  getCustomerRecord(searchClause) {
    return new Promise((resolve, reject) => {
      this.customerDbProvider.getDB().transaction((transaction) => {
        let value: Array<any> = [];
        let query = "";
        try {
          query = "Select CustomerID, Name, Account_Number,  AddressLine1, AddressLine2, Zipcode, City, State, Country ,Address_ID from MST_Customer " + searchClause + " LIMIT 50";
        } catch (error) {
          this.logger.log(this.fileName, "getCustomerRecord ", " Error while generating query: " + JSON.stringify(error.message));
        }
        transaction.executeSql(query, [], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, "getCustomerRecord ", " ERROR while executing query: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, "getCustomerRecord ", " ERROR in transaction: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  }

  getCountries() {
    let query = "SELECT Country_Code, Country_Name FROM Country order by Country_Name";
    return this.getList(query, [], "getCountries");

  }

  insertCalibrationBatch(insertData) {
    let id = parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000)));
    let createdby = parseInt(this.valueProvider.getUserId());
    let createdDate = this.getCurrentDate();
    let userid = parseInt(this.valueProvider.getUserId());
    let modifieddate = this.getCurrentDate();
    //let reportid = '7'
    let queryParams = [id, insertData.REPORTID, insertData.CA_ELEMENT, insertData.ELEMENT_OTHER,
      insertData.OPTION_OTHER, insertData.CA_OPTION, insertData.DIRECTION_OTHER, insertData.DIRECTION, insertData.CONDITION_OTHER, insertData.CONDITION, userid, modifieddate, createdby, createdDate, insertData.CA_RESULT ? insertData.CA_RESULT : null, insertData.RECOMMENDEDACTION ? insertData.RECOMMENDEDACTION : null];
    return this.insertData("INSERT into CALIBRATIONACTUATION  (CA_PK_ID,REPORTID,CA_ELEMENT,ELEMENT_OTHER,OPTION_OTHER,CA_OPTION,DIRECTION_OTHER,DIRECTION,CONDITION_OTHER,CONDITION,MODIFIEDBY,MODIFIEDDATE,CREATEDBY,CREATEDDATE,CA_RESULT,RECOMMENDEDACTION)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", queryParams, "updateFinalList");
  }
  /**
   *@Prateek 06/12/2019
   *Get element type in calibration and actuation
   */
  public getCalibrationData(element) {
    let query = "select * from CALIBRATIONACTUATION where REPORTID = ?"
    let queryParams = [element]
    return this.getList(query, queryParams, "getElementType")
  }

  /**
 * Delete calibtation data

 * @author Prateek
 */
  deleteCalibrationData(CA_PK_ID) {
    let query = "DELETE FROM CALIBRATIONACTUATION where CA_PK_ID = ?";
    let queryParams = [CA_PK_ID];
    return this.insertData(query, queryParams, "deleteMaterialSerialRow");
  }

  deleteFromTable(primaryKey, primaryKeyVal, tableName) {
    let query = "DELETE FROM " + tableName + " where " + primaryKey + " = ?";
    let queryParams = [primaryKeyVal];
    return this.insertData(query, queryParams, "deleteFrom" + tableName)
  }

  public insertUpdateSdrReport(sdrReportObj, isSDRRecordExists) {
    return new Promise((resolve, reject) => {

      this.insertJsonData(sdrReportObj, 'SDRREPORT', ['CREATEDBYNAME', 'WORLDAREANAME', 'SERVICESITENAME'], 'insert ' + 'SDRREPORT' + "insertUpdateSdrReport").then(res => {
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, 'insert ' + 'SDRREPORT', 'Error: ' + JSON.stringify(error.message));
        reject(error);
      });
      
      // this.dbctrl.getDB().transaction((transaction) => {
      //   let insertUpdateValues = "";
      //   let REPORTID = sdrReportObj.REPORTID;
      //   let updateQuery = "UPDATE SDRREPORT SET ";
      //   let insertQuery = "INSERT OR IGNORE INTO SDRREPORT (";
      //   let insert = "";
      //   let insert1 = "";
      //   let sqlInsert = [];
      //   let queryParams = []

      //   let dataKeys = Object.keys(sdrReportObj);
      //   if (dataKeys.length) {
      //     dataKeys.forEach((key) => {
      //       if (key != 'CREATEDBYNAME' && key != 'WORLDAREANAME' && key != 'SERVICESITENAME') {
      //         updateQuery += key + "= '" + (sdrReportObj[key] ? sdrReportObj[key] : null) + "', ";
      //         insert += key + ", ";
      //         insert1 += "? , ";
      //         queryParams.push(sdrReportObj[key] ? sdrReportObj[key] : null );
      //         //insert1 += "'" + (sdrReportObj[key] ? sdrReportObj[key] : null) + "', ";
      //       }

      //     })
      //     // if (REPORTID != null) {
      //     if (isSDRRecordExists) {
      //       // Update query
      //       updateQuery += "WHERE REPORTID = " + REPORTID;
      //       updateQuery = updateQuery.replace(", WHERE", " WHERE").replace(/'null'/g, 'null');
      //       insertUpdateValues = updateQuery;
      //     }
      //     else {
      //       // Insert query
      //       insertQuery += insert + ") VALUES (" + insert1 + ")";
      //       insertQuery = insertQuery.replace(/, \)/g, ')').replace(/'null'/g, 'null');
      //       insertUpdateValues = insertQuery;
      //     }

      //     sqlInsert.push(insertUpdateValues);
      //     sqlInsert.push(queryParams);

      //     transaction.executeSql([sqlInsert], [], (tx, res) => {
      //       resolve(true);
      //     }, (tx, error) => {
      //       this.logger.log(this.fileName, 'insert insertUpdateSdrReport', 'Error: ' + JSON.stringify(error.message));
      //       reject(error);
      //     });
      //   }
      // }, (error) => {
      //   this.logger.log(this.fileName, 'insert insertUpdateSdrReport', 'Error TXN: ' + JSON.stringify(error.message));
      //   reject(error);
      // });
    })
  }
  getSdrReport(REPORTID) {
    let query = "SELECT sr.REPORTID,sr.FIELDSERVICEDIANOSTICONLY,sr.FIELDREPAIR,sr.DEPOTREPAIR,sr.JOBID,sr.REPAIRDATE,sr.BUSINESSGROUP,sr.CUSTOMERID,sr.CUSTOMERNAME,sr.CUSTOMERPO,sr.SALESPO,sr.WORLDAREA,sr.SERVICESITE,sr.PROJECTNO,sr.SCOPEOFWORK,sr.SYNCSTATUS,sr.REPORTSTATUS,sr.SUBMITTEDDATE,sr.ISSTANDALONE,sr.SELECTEDPROCESS ,sr.CREATEDBY,ls.LookupValue as SERVICESITENAME,lw.LookupValue as WORLDAREANAME FROM SDRREPORT sr INNER JOIN Lookups lw ON lw.LookupID = sr.WORLDAREA INNER JOIN Lookups ls ON ls.LookupID = sr.SERVICESITE WHERE REPORTID = ?";
    let queryParams = [REPORTID];
    return this.getList(query, queryParams, "getSdrReport")

  }
  /**
*@Prateek:06/14/2019
*Get data from device actuation table with report id.
*/
  getTechNotes(reportid) {
    let query = "select * from TECHNOTES where REPORTID=?"
    return this.getList(query, [reportid], "getTechNotes");
  }


  public InsertupdateTechNotes(data) {
    let queryParams = [data.TN_PK_ID, data.REPORTID, data.TECHNOTES, data.SYNCSTATUS,
    data.CREATEDBY, data.CREATEDDATE, data.MODIFIEDBY, data.MODIFIEDDATE];
    return this.insertData("INSERT OR REPLACE INTO TECHNOTES(TN_PK_ID, REPORTID, TECHNOTES, SYNCSTATUS, CREATEDBY, CREATEDDATE, MODIFIEDBY, MODIFIEDDATE) VALUES (?,?,?,?,?,?,?,?)", queryParams, "InsertupdateTechNotes");

  }

  public getDevices() {
    let query = "Select * from MST_Product Where ParentID is null and IsActive='Y' Order By ProductName;";
    return this.getList(query, [], "getDevices");
  }

  public getActuatorDevices() {
    let query = "Select * from MST_Product Where ParentID =34 and IsActive='Y';";
    return this.getList(query, [], "getDevices");
  }

  public getSelectedDevice(REPORTID) {
    let query = "select * from SELECTEDDEVICE where REPORTID = ?";
    return this.getList(query, [REPORTID], "getSelectedDevice");
  }

  public getFinalInspectionData(REPORTID) {
    let query = "select * from FINALINSPECTIONFLOWISOLATION where REPORTID = ?";
    return this.getList(query, [REPORTID], "getFinalInspectionData");
  }

  public getFinalInspectionPressureData(REPORTID) {
    let query = "select * from FINALINSPECTIONPRESSUREFLOW where REPORTID = ?";
    return this.getList(query, [REPORTID], "getFinalInspectionData");
  }

  public getOptionalData(REPORTID) {
    let query = "select * from OPTIONALFLOWISOLATION where REPORTID = ?";
    return this.getList(query, [REPORTID], "getOptionalData");
  }

  public getAsFoundPerformanceData(REPORTID) {
    let query = "select * from ASFOUNDPERFORMANCEPRESSUREFLOW where REPORTID = ?";
    return this.getList(query, [REPORTID], "getAsFoundPerformanceData");
  }

  public getTestDataPressureData(REPORTID) {
    let query = "select * from TESTDATAPRESSUREFLOW where REPORTID = ?";
    return this.getList(query, [REPORTID], "getTestDataPressureData");
  }

  public getNetworkDevices(REPORTID) {
    let query = "select * from NETWORKDEVICE where REPORTID = ?";
    return this.getList(query, [REPORTID], "getNetworkDevices");
  }

  public getWitnessHoldPoints(REPORTID) {
    let query = "select * from WITNESSHOLDPOINTSFLOWISOLATION where REPORTID = ?";
    return this.getList(query, [REPORTID], "getWitnessHoldPoints");
  }

  public deleteNetworkDevice(ND_PK_ID) {
    let query = "DELETE FROM NETWORKDEVICE where ND_PK_ID = ?";
    return this.getList(query, [ND_PK_ID], "deleteNetworkDevice");
  }

  public deleteNetworkDevicesForReport(REPORTID) {
    let query = "DELETE FROM NETWORKDEVICE where REPORTID = ?";
    return this.getList(query, [REPORTID], "deleteNetworkDevicesForReport");
  }

  public deleteWitnessHoldPoint(WHP_PK_ID) {
    let query = "DELETE FROM WITNESSHOLDPOINTSFLOWISOLATION where WHP_PK_ID = ?";
    return this.getList(query, [WHP_PK_ID], "deleteWitnessHoldPoint");
  }

  public deleteDataOnDeviceChange(REPORTID) {
    let query = "DELETE FROM SELECTEDDEVICE where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteDataOnDeviceChange");

    query = "DELETE FROM NETWORKDEVICE where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteDataOnDeviceChange");

    query = "DELETE FROM ASFOUNDACTUATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteDataOnDeviceChange");

    query = "DELETE FROM ASLEFTACTUATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteDataOnDeviceChange");

    query = "DELETE FROM ASLEFTRAACTUATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteDataOnDeviceChange");

    query = "DELETE FROM CALIBRATIONACTUATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteDataOnDeviceChange");

    query = "DELETE FROM DEVICETESTACTUATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteDataOnDeviceChange");

    query = "DELETE FROM TECHNOTES where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteDataOnDeviceChange");

    query = "DELETE FROM REPORTATTACHMENTS where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteDataOnDeviceChange");
  }

  public deleteDataOnFDOChange(REPORTID) {
    let query = "DELETE FROM FINDINGSFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM TESTDATAFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM FINALINSPECTIONFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM OPTIONALFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");
  }

  public deleteIsolationDataOnDeviceChange(REPORTID) {
    let query = "DELETE FROM SELECTEDDEVICE where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteDataOnDeviceChange");

    query = "DELETE FROM ACCESSORIESFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM ASFOUNDFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM CALIBRATIONFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM CALIBRATIONSOLUTIONFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM FINALINSPECTIONFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM FINDINGSFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM OPTIONALFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM RECOMMENDATIONSFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM REPORTNOTESFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM TECHNOTES where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM SOLUTIONFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM TESTDATAFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM WITNESSHOLDPOINTSFLOWISOLATION where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM REPORTATTACHMENTS where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");
  }

  public deletePressureDataOnDeviceChange(REPORTID) {
    let query = "DELETE FROM SELECTEDDEVICE where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteDataOnDeviceChange");

    query = "DELETE FROM ASFOUNDPERFORMANCEPRESSUREFLOW where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM ASFOUNDPRESSUREFLOW where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM FINALINSPECTIONPRESSUREFLOW where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM FINDINGSPRESSUREFLOW where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM INSPECTIONMEASUREMENTPRESSUREFLOW where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM NOTESPRESSUREFLOW where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM PARTSPRESSUREFLOW where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM TESTDATAPRESSUREFLOW where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM TECHNOTES where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");

    query = "DELETE FROM REPORTATTACHMENTS where REPORTID = ?";
    this.getList(query, [REPORTID], "deleteIsolationDataOnDeviceChange");
  }


  /**
   * Gets all pending reports to submit to DBCS. If ReportID is passed gets particular Report
   *
   * @param {*} [REPORTID]
   * @returns
   * @memberof LocalServiceSdrProvider
   */
  getPendingSDRReport(REPORTID?) {
    let query = `SELECT SDR.*, P.BUID FROM SDRREPORT SDR INNER JOIN SELECTEDDEVICE SD ON SD.REPORTID = SDR.REPORTID
                  INNER JOIN MST_PRODUCT P ON P.PRODUCTID = SD.DEVICEID WHERE SDR.SYNCSTATUS = ? AND SDR.REPORTSTATUS = ?`;
    let queryParams = ['N', Enums.ReportStatus.Completed];
    if (REPORTID) {
      query = query + " AND SDR.REPORTID = ?";
      queryParams.push(REPORTID);
    }
    return this.getList(query, queryParams, "getPendingSDRReport");
  }

  /**
   * Gets Pending data to submit according to TableName and ReportIDs
   *
   * @param {*} TableName
   * @param {*} ReportIDArr
   * @returns
   * @memberof LocalServiceSdrProvider
   */
  getPendingSDRTableData(TableName, ReportIDArr) {
    let query = `SELECT * FROM ${TableName} WHERE SYNCSTATUS != ? AND REPORTID in (${ReportIDArr.toString()})`;
    let queryParams = ['Y'];
    return this.getList(query, queryParams, `getPendingSDRTableData: ${TableName}`);
  }

  getPendingReportAttachments(REPORTID) {
    let query = "SELECT A.* FROM REPORTATTACHMENTS A INNER JOIN SDRREPORT R ON R.ReportID = A.ReportID WHERE A.SYNCSTATUS != 'Y' AND R.REPORTSTATUS = ?";
    let queryParams = [Enums.ReportStatus.Completed];
    if (REPORTID) {
      query = query + " AND A.REPORTID = ?";
      queryParams.push(REPORTID);
    }
    return this.getList(query, queryParams, "getPendingReportAttachments");
  }

  getPendingTasksForDBCS(ReportIDArr) {
    let query = "SELECT T.* FROM Task T INNER JOIN SDRREPORT RP ON RP.ReportID = T.ReportID Where T.DBCS_SyncStatus = ? AND T.REPORTID in (" + ReportIDArr.toString() + ")";
    let queryParams = [
      // String(Enums.Selected_Process.FCR_AND_SDR),
      // String(Enums.Selected_Process.SDR),
      "false"
    ];
    return this.getList(query, queryParams, "getPendingTasksForDBCS");
  }

  getPendingTimeForDBCS(TaskArr) {
    let query = "SELECT * FROM Time WHERE Task_Number in (" + TaskArr.toString() + ")";
    let queryParams = [];
    return this.getList(query, queryParams, "getPendingTimeForDBCS");
  }

  getPendingExpenseForDBCS(TaskArr) {
    let query = "SELECT * FROM Expense WHERE Task_Number in (" + TaskArr.toString() + ")";
    let queryParams = [];
    return this.getList(query, queryParams, "getPendingExpenseForDBCS");
  }

  // 05/06/2019 -- Mayur Varshney -- get pending material from MST_Material on the basis of Sync_Status and Task_Number
  getPendingMaterialForDBCS(TaskArr) {
    let query = "SELECT Material_Serial_Id, Task_Number, Product_Quantity, Serial_In, Serial_Out, Serial_Number, IsAdditional, Charge_Type_Id, Description, ItemName FROM MST_Material WHERE Task_Number in (" + TaskArr.toString() + ") AND Sync_Status = ?";
    let queryParams = ['false'];
    return this.getList(query, queryParams, "getPendingMaterialForDBCS");
  }

  getPendingSignatureForDBCS(TaskArr) {
    let query = "SELECT E.followUp,E.salesQuote,E.salesVisit,E.salesLead,E.Follow_Up,E.Spare_Quote,E.Sales_Visit,E.Sales_Head," +
      "E.Sign_File_Path AS Engg_Sign_File,E.Task_Number,E.Engg_Sign_Time,C.Customer_Name,C.Job_responsibilty,C.Email,C.isCustomerSignChecked," +
      "C.customerComments,C.Cust_Sign_File,C.Cust_Sign_Time,C.OracleDBID,C.SSE_Rules,C.Remarks,C.Annuel_PdP,C.Specific_PdP,C.Working_license," +
      "C.Emerson_Safety,C.Home_Security,C.do_not_survey " +
      "FROM Engineer E INNER JOIN Customer C ON C.Task_Number = E.Task_Number WHERE E.Task_Number in (" + TaskArr.toString() + ")";
    let queryParams = [];
    return this.getList(query, queryParams, "getPendingSignatureForDBCS");
  }

  getPendingNotesForDBCS(TaskArr) {
    let query = "SELECT * FROM Notes WHERE Task_Number in (" + TaskArr.toString() + ")";
    let queryParams = [];
    return this.getList(query, queryParams, "getPendingNotesForDBCS");
  }

  getPendingFCRAttachment(REPORTID) {
    let query = `SELECT A.* FROM Attachment A INNER JOIN SDRREPORT R ON R.ReportID = A.task_number
    WHERE A.AttachmentType not in ('O', 'S') AND A.Sync_Status = 'false' AND R.IsStandalone = 'Y' AND R.REPORTSTATUS = ?`;
    let queryParams = [Enums.ReportStatus.Completed];
    if (REPORTID) {
      query = query + " AND A.Task_Number = ?";
      queryParams.push(REPORTID);
    }
    return this.getList(query, queryParams, "getPendingFCRAttachment");
  }


  /**
   * Updates Sync Status for synced records back in local DB.
   * The function firstly gets all the TableNames from keys found in `Data` parameter except `debriefItems` and `Signature` key
   * After getting the tableNames update query is created dynamically to update all the sync status of all the submitted records
   * as well as Task table`s DBCS Sync Status and Time table`s sync status.
   *
   * @param {JSON} Data : Response from API after data insert/update
   * @param {Array<String>} ReportIDArr : Array of ReportIDs submitted to DBCS
   * @param {Array<JSON>} TimeArr : Array of Time Records submitted to DBCS
   * @returns
   * @memberof LocalServiceSdrProvider
   */
  updateReportTaskAndDebriefEntries(Data, ReportIDArr, TimeArr) {
    let queryParams = ["Y", this.getCurrentUser(), this.getCurrentDate()];
    let TablesToExclude = ["debriefItems", "Signature"];
    let TableNames = Object.keys(Data).filter(key => TablesToExclude.indexOf(key) == -1);
    let sqlBatchStmt = [];
    _.each(TableNames, (TableName) => {
      let IdArr = Data[TableName].filter((item) => item.HASERROR == "FALSE").map((item) => item.REPORTID);
      if (IdArr.length > 0) sqlBatchStmt.push([`UPDATE ${TableName} Set SyncStatus = ?, ModifiedBy = ?, ModifiedDate = ? Where ReportID in (${IdArr.toString()})`, queryParams]);
    });
    sqlBatchStmt.push([`UPDATE Engineer Set Sync_Status = ? Where Engineer_ID in (${ReportIDArr.toString()})`, ["true"]]);
    sqlBatchStmt.push([`UPDATE Customer Set Sync_Status = ? Where Customer_ID in (${ReportIDArr.toString()})`, ["true"]]);
    sqlBatchStmt.push([`UPDATE Task Set DBCS_SyncStatus = ? Where ReportID in (${ReportIDArr.toString()})`, ["true"]]);
    if (TimeArr) {
      let stmtValues;
      for (let k in TimeArr) {
        let time = TimeArr[k];
        stmtValues = [];
        let sqlUpdate: any[] = ["UPDATE Time SET DB_Syncstatus = ? , isSubmitted = ? where Time_Id = ?"];
        stmtValues.push("true", "true", time.Time_Id);
        sqlUpdate.push(stmtValues);
        sqlBatchStmt.push(sqlUpdate);
      }
    }
    return this.insertBatchData(sqlBatchStmt, "updateReportTaskAndDebriefEntries");
  }

  updatePendingReportAttachmentSyncStatus(RA_PK_ID) {
    let query = "UPDATE REPORTATTACHMENTS Set SyncStatus = ? Where RA_PK_ID = ?";
    let queryParams = ['Y', RA_PK_ID];
    return this.insertData(query, queryParams, "updatePendingReportAttachmentSyncStatus");
  }

  /**
   * 02/09/2019 -- Mayur Varshney
   * update pending attachment status
   * @param {*} Task_Number
   * @returns
   * @memberof LocalServiceProvider
   */
  updatePendingFCRReportAttachmentSyncStatus(data) {
    let query = "UPDATE Attachment SET Attachment_Status = ?, Sync_Status = ? WHERE Attachment_Id = ?"
    let queryParams = ['true', 'true', data.Attachment_Id];
    return this.insertData(query, queryParams, 'updatePendingFCRReportAttachmentSyncStatus');
  }

  private insertBatchData(sqlBatchStmt: any[], functionName) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().sqlBatch(sqlBatchStmt, (res) => {
        // this.logger.log(this.fileName, functionName, "Response :" + JSON.stringify(res));
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, functionName, "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    })
  }

  public getCurrentUser() {
    // return this.valueProvider.getUser().UserID;
    return parseInt(this.valueProvider.getUserId());
  }

  getProductNameForCustomHeaderActuation(REPORTID) {
    let query = "Select P.ProductName from MST_Product P, SELECTEDDEVICE D Where P.PARENTID = D.DEVICEID and P.PRODUCTID = D.DEVICETYPE and D.REPORTID = ?";
    return this.getList(query, [REPORTID], "getProductNameForCustomHeader");
  }

  getProductNameForCustomHeaderIsolation(REPORTID) {
    let query = "Select P.ProductName from MST_Product P, SELECTEDDEVICE D Where P.PRODUCTID = D.DEVICEID and D.REPORTID = ?";
    return this.getList(query, [REPORTID], "getProductNameForCustomHeaderIsolation");
  }

  getProcessNameForCustomHeaderIsolation(REPORTID) {
    let query = "Select P.LookupValue from Lookups P, SELECTEDDEVICE D Where P.LookupID = D.PROCESS and D.REPORTID = ?";
    return this.getList(query, [REPORTID], "getProcessNameForCustomHeaderIsolation");
  }

  getTagForCustomHeaderIsolation(REPORTID) {
    let query = "Select TAG from SELECTEDDEVICE Where REPORTID = ?";
    return this.getList(query, [REPORTID], "getTagForCustomHeaderIsolation");
  }

  getProductID(REPORTID) {
    return new Promise((resolve, reject) => {
      let query = "Select P.ProductID from MST_Product P, SELECTEDDEVICE D Where P.PARENTID = D.DEVICEID and P.PRODUCTID = D.DEVICETYPE and D.REPORTID = ?";
      this.getList(query, [REPORTID], "getProductNameForCustomHeader").then((res: any) => {
        if (res && res.length > 0) {
          // console.log(res[0].ProductID);
          resolve(res[0].ProductID);
        }
      });
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getTask', error);
    });
  }

  /**
   * saveSDRData
   */
  public saveSDRData(ReportArr) {
    let sqlBatchStmt = [];
    try {
      let TablesToExclude = ["TASK", "TIME", "EXPENSE", "MATERIAL", "NOTES", "FCR_ATTACHMENT", "SIGNATURE", "INTERNALTIME"];
      let TableNames = Object.keys(ReportArr).filter(key => TablesToExclude.indexOf(key) == -1);
      TableNames.forEach(TableName => {
        let replaceOrIgnore = TableName == 'REPORTATTACHMENTS' ? 'IGNORE' : 'REPLACE';
        let baseQuery = `INSERT OR ${replaceOrIgnore} INTO ${TableName}`;
        let TableData = ReportArr[TableName];
        if (TableData.success) {
          let tData = TableData.data;
          tData.forEach(TableRow => {
            let ColumnNames = Object.keys(TableRow);
            let ColumnValues = [];
            let ColumnValueParams = [];
            ColumnNames.forEach(ColumnName => {
              ColumnValues.push("?");
              ColumnValueParams.push(TableRow[ColumnName]);
            });
            let query = baseQuery + "(" + ColumnNames.toString() + ") Values(" + ColumnValues.toString() + ")";
            sqlBatchStmt.push([query, ColumnValueParams]);
          });
        } else {
          let error = TableData.error;
          this.logger.log(this.fileName, 'saveSDRData', ' Error: ' + error);
        }
      })
    } catch (error) {
      this.logger.log(this.fileName, "saveSDRData", "Error : " + error.message);
    }
    return this.insertBatchData(sqlBatchStmt, "saveSDRData");
  }

  /**
   *
   * Gurkirat 17/01/2019
   *
   * @returns
   * @memberof LocalServiceProvider
   */
  public getPendingSDRAttachments() {
    let query = "SELECT RA.* FROM REPORTATTACHMENTS RA INNER JOIN SDRREPORT SDR ON SDR.ReportID = RA.ReportID WHERE (RA.AttachmentStatus IS NULL OR RA.AttachmentStatus = 'N') AND RA.CREATEDBY = ?";
    let queryParams = [this.valueProvider.getUserId()];
    return this.getList(query, queryParams, "getPendingSDRAttachments");
  }


  deleteAttachmentObject(attachmendId) {
    this.dbctrl.getDB().transaction((transaction) => {
      //this.logger.log(this.fileName,'function',attachmendId);
      let sqlDelete = "DELETE FROM REPORTATTACHMENTS where RA_PK_ID = " + attachmendId;
      //this.logger.log(this.fileName,'function',"sqlDelete=" + sqlDelete);

      transaction.executeSql(sqlDelete);
    }, (error) => {
      this.logger.log(this.fileName, 'deleteAttachmentObject', 'Promise Error: ' + JSON.stringify(error.message));
    });
  }

  public insertSDRAttachment(responseList) {
    return new Promise((resolve, reject) => {
      this.dbctrl.getDB().transaction((transaction) => {
        let insertValues = [];
        let sqlInsert = "INSERT INTO REPORTATTACHMENTS VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        insertValues.push(responseList.RA_PK_ID);
        insertValues.push(responseList.ReportID);
        insertValues.push(responseList.ATTACHMENTTYPE);
        insertValues.push(responseList.FILENAME);
        insertValues.push(responseList.FILETYPE);
        insertValues.push(responseList.File_Path);
        insertValues.push('Y');
        insertValues.push(responseList.ATTACHMENTDESCRIPTION);
        insertValues.push(responseList.Sync_Status);
        insertValues.push(responseList.SHOWINPDF);
        insertValues.push(this.getCurrentUser());
        insertValues.push(this.getCurrentDate());
        insertValues.push(this.getCurrentUser());
        insertValues.push(this.getCurrentDate());
        transaction.executeSql(sqlInsert, insertValues, (tx, res) => {
          resolve(res.insertId);
          //this.logger.log(this.fileName,'function',"ATTACHMENT INSERT ID: " + res.insertId);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'insertSDRAttachment', "ATTACHMENT INSERT ERROR: " + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'insertSDRAttachment', "ATTACHMENT INSERT TRANSACTION ERROR: " + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  changeShowInPDFStatus(status, attachmendId) {
    let query = "Update REPORTATTACHMENTS SET SHOWINPDF = ?, SYNCSTATUS = ?, MODIFIEDBY = ?, MODIFIEDDATE = ? WHERE RA_PK_ID = ?";
    let queryParams = [status, 'N', this.getCurrentUser(), this.getCurrentDate(), attachmendId];
    return this.insertData(query, queryParams, "changeShowInPDFStatus");
  }

  checkIfSameJobId(REPORTID, jobID) {
    let query = "select COUNT(*) as count from SDRREPORT where JOBID = ? ";
    let params = [jobID];
    if (REPORTID) {
      query = query + " and REPORTID != ?";
      params.push(REPORTID);
    }

    return this.getList(query, params, "checkIfSameJobId")
  }

  insertFCRTask(data) {
    let queryParams = [data.REPORTID, data.Task_Status, data.CUSTOMERNAME,
    data.Street_Address, data.City, data.State, data.Country, data.Zip_Code, data.Start_Date, data.End_Date, data.Type, data.Address1, data.Sync_Status, data.BUSINESSGROUP, data.StatusID, data.IsStandalone, data.JOBID, data.Selected_Process, data.OracleDBID, data.REPORTID, "false", data.Address2, data.Name, data.ResourceId];
    return this.insertData("INSERT OR REPLACE INTO Task(Task_Number, Task_Status, Customer_Name, Street_Address, City, State, Country, Zip_Code,Start_Date,End_Date,Type,Address1,Sync_Status,Business_Group,StatusID,IsStandalone,Job_Number,Selected_Process,OracleDBID,ReportID,DBCS_SyncStatus,Address2,Name,ResourceId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", queryParams, "InsertupdateTechNotes");
  }

  public getSDRAttachment(reportId) {
    let query = "SELECT * FROM REPORTATTACHMENTS WHERE REPORTID = ?";
    let queryParams = [reportId];
    return this.getList(query, queryParams, "getSDRAttachment");
  }

  updateAttachmentDescription(attachmendId, description) {
    let query = 'UPDATE REPORTATTACHMENTS SET ATTACHMENTDESCRIPTION = ?, SYNCSTATUS = ?, MODIFIEDBY = ?, MODIFIEDDATE = ? WHERE RA_PK_ID = ?';
    let queryParams = [description, 'N', this.getCurrentUser(), this.getCurrentDate(), attachmendId];
    return this.insertData(query, queryParams, 'updateAttachmentDescription');
  }

  updateReport(ReportID, ReportStatus) {
    let query = "UPDATE SDRREPORT Set ReportStatus = ?, ModifiedBy = ?, ModifiedDate = ? Where ReportID = ?";
    let queryParams = [ReportStatus, this.getCurrentUser(), this.getCurrentDate(), ReportID];
    return this.insertData(query, queryParams, "updateReport");
  }

  updateReportId(value) {
    let query = "UPDATE Task Set ReportId = ? Where Task_Number = ?";
    let queryParams = [value.REPORTID, value.JOBID];
    return this.insertData(query, queryParams, "updateReportId");
  }

  public insertUpdateFIRecommendations(recommendationObj, isSDRRecordExists) {
    return new Promise((resolve, reject) => {

      this.insertJsonData(recommendationObj, 'RECOMMENDATIONSFLOWISOLATION', ['FutureRecommendationsOptionName', 'LookupValue'], 'insert ' + 'RECOMMENDATIONSFLOWISOLATION' + "insertUpdateFIRecommendations").then(res => {
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, 'insert ' + 'RECOMMENDATIONSFLOWISOLATION', 'Error: ' + JSON.stringify(error.message));
        reject(error);
      });
      // this.dbctrl.getDB().transaction((transaction) => {
      //   let insertUpdateValues = "";
      //   let REPORTID = recommendationObj.REPORTID;
      //   let updateQuery = "UPDATE RECOMMENDATIONSFLOWISOLATION SET ";
      //   let insertQuery = "INSERT OR IGNORE INTO RECOMMENDATIONSFLOWISOLATION (";
      //   let insert = "";
      //   let insert1 = "";
      //   let dataKeys = Object.keys(recommendationObj);
      //   if (dataKeys.length) {
      //     dataKeys.forEach((key) => {
      //       if (key != 'FutureRecommendationsOptionName' && key != 'LookupValue') {
      //         updateQuery += key + "= '" + (recommendationObj[key] ? recommendationObj[key] : null) + "', ";
      //         insert += key + ", ";
      //         insert1 += "'" + (recommendationObj[key] ? recommendationObj[key] : null) + "', ";
      //       }

      //     })
      //     // if (REPORTID != null) {
      //     if (isSDRRecordExists) {
      //       // Update query
      //       updateQuery += "WHERE REPORTID = " + REPORTID;
      //       updateQuery = updateQuery.replace(", WHERE", " WHERE").replace(/'null'/g, 'null');
      //       insertUpdateValues = updateQuery;
      //     }
      //     else {
      //       // Insert query
      //       insertQuery += insert + ") VALUES (" + insert1 + ")";
      //       insertQuery = insertQuery.replace(/, \)/g, ')').replace(/'null'/g, 'null');
      //       insertUpdateValues = insertQuery;
      //     }

      //     transaction.executeSql(insertUpdateValues, [], (tx, res) => {
      //       resolve(true);
      //     }, (tx, error) => {
      //       this.logger.log(this.fileName, 'insert insertUpdateFIRecommendations', 'Error: ' + JSON.stringify(error.message));
      //       reject(error);
      //     });
      //   }
      // }, (error) => {
      //   this.logger.log(this.fileName, 'insert insertUpdateFIRecommendations', 'Error TXN: ' + JSON.stringify(error.message));
      //   reject(error);
      // });
    })
  }
  getFIRecommendations(REPORTID) {
    let query = "SELECT rec.RC_PK_ID,rec.FUTURERECOMMENDATIONS,rec.REPORTID,rec.FUTURERECOMMENDATIONS_OT,rec.RECOMMENDATIONS ,rec.CREATEDBY,rec.CREATEDDATE,lw.LookupValue FROM RECOMMENDATIONSFLOWISOLATION rec LEFT OUTER JOIN Lookups lw ON lw.LookupID = rec.FUTURERECOMMENDATIONS  WHERE REPORTID  = ?";
    let queryParams = [REPORTID];
    return this.getList(query, queryParams, "getFIRecommendations")

  }
  public insertUpdateFIReportNotes(reportNotesObj, isSDRRecordExists) {
    return new Promise((resolve, reject) => {

      this.insertJsonData(reportNotesObj, 'REPORTNOTESFLOWISOLATION', ['REPAIRSCOPECOMPLETEDNAME', 'LookupValue'], 'insert ' + 'REPORTNOTESFLOWISOLATION' + "insertUpdateFIReportNotes").then(res => {
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, 'insert ' + 'REPORTNOTESFLOWISOLATION', 'Error: ' + JSON.stringify(error.message));
        reject(error);
      });
      // this.dbctrl.getDB().transaction((transaction) => {
      //   let insertUpdateValues = "";
      //   let REPORTID = reportNotesObj.REPORTID;
      //   let updateQuery = "UPDATE REPORTNOTESFLOWISOLATION SET ";
      //   let insertQuery = "INSERT OR IGNORE INTO REPORTNOTESFLOWISOLATION (";
      //   let insert = "";
      //   let insert1 = "";
      //   let dataKeys = Object.keys(reportNotesObj);
      //   if (dataKeys.length) {
      //     dataKeys.forEach((key) => {
      //       if (key != 'REPAIRSCOPECOMPLETEDNAME' && key != 'LookupValue') {
      //         updateQuery += key + "= '" + (reportNotesObj[key] ? reportNotesObj[key] : null) + "', ";
      //         insert += key + ", ";
      //         insert1 += "'" + (reportNotesObj[key] ? reportNotesObj[key] : null) + "', ";
      //       }

      //     })
      //     // if (REPORTID != null) {
      //     if (isSDRRecordExists) {
      //       // Update query
      //       updateQuery += "WHERE REPORTID = " + REPORTID;
      //       updateQuery = updateQuery.replace(", WHERE", " WHERE").replace(/'null'/g, 'null');
      //       insertUpdateValues = updateQuery;
      //     }
      //     else {
      //       // Insert query
      //       insertQuery += insert + ") VALUES (" + insert1 + ")";
      //       insertQuery = insertQuery.replace(/, \)/g, ')').replace(/'null'/g, 'null');
      //       insertUpdateValues = insertQuery;
      //     }

      //     transaction.executeSql(insertUpdateValues, [], (tx, res) => {
      //       resolve(true);
      //     }, (tx, error) => {
      //       this.logger.log(this.fileName, 'insert insertUpdateFIReportNotes', 'Error: ' + JSON.stringify(error.message));
      //       reject(error);
      //     });
      //   }
      // }, (error) => {
      //   this.logger.log(this.fileName, 'insert insertUpdateFIReportNotes', 'Error TXN: ' + JSON.stringify(error.message));
      //   reject(error);
      // });
    })
  }
  getFIReportNotes(REPORTID) {
    let query = "SELECT rec.RN_PK_ID,rec.REPAIRSCOPECOMPLETED,rec.REPORTID,rec.REPAIRSCOPECOMPLETED_OT,rec.NOTES ,rec.CREATEDBY,rec.CREATEDDATE,lw.LookupValue FROM REPORTNOTESFLOWISOLATION rec LEFT OUTER JOIN Lookups lw ON lw.LookupID = rec.REPAIRSCOPECOMPLETED  WHERE REPORTID  = ?";
    let queryParams = [REPORTID];
    return this.getList(query, queryParams, "getFIReportNotes")

  }

  getLookups(arr) {
    let quesQuery = [];
    arr.forEach(() => quesQuery.push('?'));
    let query = "select * from Lookups where lookuptype in(" + quesQuery.toString() + ") and IsActive = 'Y' order by lower(LookupValue)";
    return this.getList(query, arr, "getControlValveLookups")
  }
  getLookupsByDisplayOrder(arr) {
    let quesQuery = [];
    arr.forEach(() => quesQuery.push('?'));
    let query = "select * from Lookups where lookuptype in(" + quesQuery.toString() + ") and IsActive = 'Y' order by DisplayOrder, lower(LookupValue)";
    return this.getList(query, arr, "getControlValveLookups")
  }

  getDEVICEIDForFlowIsolation(REPORTID) {
    return new Promise((resolve, reject) => {
      let query = "Select D.DEVICEID from SELECTEDDEVICE D Where D.REPORTID = ?";
      this.getList(query, [REPORTID], "getProductNameForCustomHeader").then((res: any) => {
        if (res && res.length > 0) {
          resolve(res[0].DEVICEID);
        } else {
          reject('no row exist with REPORTID = ' + REPORTID);
        }
      });
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getTask', error);
    });
  }


  getisoCaldata(reportid, tableName, functionName) {
    let query = "select REPORTID,CAL_TRAVEL_UOM,CAL_TRAVEL_UOM_OT,CAL_SIGNALOPEN_UOM,CAL_SIGNALOPEN_UOM_OT,CAL_BENCH_UOM,CAL_BENCH_UOM_OT,CAL_SIGNALCLOSED_UOM,CAL_SIGNALCLOSED_UOM_OT,CAL_SUPPLY_UOM,CAL_SUPPLY_UOM_OT,CAL_FAILACTION,CAL_FAILACTION_OT  from " + tableName + " where REPORTID=?"
    return this.getList(query, [reportid], functionName);
  }

  getSDRReportData(reportId) {
    return new Promise((resolve, reject) => {
      let value = [];
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT sd.*,l.lookupvalue as EMERSONSERVICESITE from SDRREPORT sd LEFT OUTER JOIN Lookups l on l.lookupid = sd.SERVICESITE where reportid = ?", [reportId], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          //this.logger.log(this.fileName,'function',"GET INTERNAL DB ==========> " + JSON.stringify(value));
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getSDRReportData', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getSDRReportData', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  getSelectedDeviceDataForIsolation(reportId) {
    return new Promise((resolve, reject) => {
      let value = [];
      this.dbctrl.getDB().transaction((transaction) => {
        transaction.executeSql("SELECT SD.DEVICEID,MP.PRODUCTNAME AS PRODUCTNAME from SELECTEDDEVICE SD inner JOIN MST_Product MP ON MP.PRODUCTID = SD.DEVICEID WHERE REPORTID = ?", [reportId], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          //this.logger.log(this.fileName,'function',"GET INTERNAL DB ==========> " + JSON.stringify(value));
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getSelectedDeviceData', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getSelectedDeviceData', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };

  getSelectedDeviceData(reportId) {
    return new Promise((resolve, reject) => {
      let value = [];
      this.dbctrl.getDB().transaction((transaction) => {
        //26/08/2019 - Gaurav Vachhani - Changes to fetch other values for selected device.
        transaction.executeSql("SELECT sd.DEVICETYPE, sd.PRODUCTFAMILY_OTHER, sd.PRODUCTTYPE_OTHER, sd.MODELTYPE_OTHER, l.lookupvalue as PRODUCTFAMILY, lp.lookupvalue as PRODUCTTYPE, sd.DEVICETYPE, lps.lookupvalue as MODELTYPE, sd.SERIALNO, mp.ProductName as PRODUCTNAME FROM SELECTEDDEVICE sd INNER JOIN MST_Product mp ON mp.ProductID = sd.DEVICETYPE LEFT OUTER JOIN Lookups l on l.LOOKUPID = sd.PRODUCTFAMILY LEFT OUTER JOIN Lookups lp on lp.LOOKUPID = sd.PRODUCTTYPE LEFT OUTER JOIN Lookups lps on lps.LOOKUPID = sd.MODELTYPE where reportid = ?", [reportId], (tx, res) => {
          let rowLength = res.rows.length;
          for (let i = 0; i < rowLength; i++) {
            value.push(res.rows.item(i));
          }
          //this.logger.log(this.fileName,'function',"GET INTERNAL DB ==========> " + JSON.stringify(value));
          resolve(value);
        }, (tx, error) => {
          this.logger.log(this.fileName, 'getSelectedDeviceData', 'Error: ' + JSON.stringify(error.message));
          reject(error);
        });
      }, (error) => {
        this.logger.log(this.fileName, 'getSelectedDeviceData', 'Error TXN: ' + JSON.stringify(error.message));
        reject(error);
      });
    });
  };
  getTemplateData(taskId) {
    let query = "SELECT SR.*, TK.Service_Request, TK.Job_Description, TK.IsStandalone, TK.Customer_Name, TK.Name FROM SDRREPORT SR LEFT OUTER JOIN Task TK ON TK.Task_Number = SR.JOBID WHERE SR.REPORTID = ?";
    let queryParams = [taskId];
    return this.getList(query, queryParams, 'getTemplateData');
  }

  getTaskObj(REPORTID) {
    let query = "Select * from TASK where ReportID = ?"
    return this.getList(query, [REPORTID], "getTaskObj")
  }
  deletePartsData(PPF_PK_ID) {
    let query = "DELETE FROM PARTSPRESSUREFLOW where PPF_PK_ID = ?";
    let queryParams = [PPF_PK_ID];
    return this.insertData(query, queryParams, "deletePartsData");
  }

  checkIfTimeEntriesExist(JobID) {
    return this.getList("select count(*) as COUNT from Time where job_number = ?", [JobID], "checkIfTimeEntriesExist")
  }
  /**
   *To update task even if customer data is not available
   *
   * @param {*} data
   * @returns
   * @memberof LocalServiceSdrProvider
   */
  updateFcrTask(data) {
    let queryParams = [];
    //queryParams.push(data.Task_Status)
    queryParams.push(data.Start_Date)
    queryParams.push(data.End_Date)
    //queryParams.push(data.StatusID)
    //queryParams.push(data.IsStandalone)
    queryParams.push(data.OracleDBID)
    queryParams.push(data.ResourceId)
    //queryParams.push(data.Sync_Status)
    queryParams.push(data.Name)
    queryParams.push(data.Selected_Process)
    //queryParams.push(data.DBCS_SyncStatus)
    queryParams.push(data.JOBID)
    queryParams.push(data.REPORTID)
    queryParams.push(data.REPORTID)
    return this.getList("UPDATE TASK SET Start_Date = ? ,End_Date =?,OracleDBID = ? ,ResourceId = ? , Name = ?,Selected_Process =?,Job_Number = ?,ReportID = ? where Task_Number = ? ", queryParams, "updateFcrTask")
  }
  public insertOrUpdateSiteAllowancesData(dataObject) {
    return new Promise((resolve, reject) => {
      if (dataObject.length > 0) {
        dataObject.forEach(dataObj => {
          this.insertJsonData(dataObj, "ALLOWANCE", [], "insertOrUpdateTimeSheetData").then(res => {
            resolve(true);
          }, (error) => {
            this.logger.log(this.fileName, 'insert ' + "ALLOWANCE", 'Error: ' + JSON.stringify(error.message));
            reject(false);
          });
        })
      } else {
        resolve(true);
      }

    });
  }

  getSiteAllowanceData(params) {
    let query = "Select * from Allowance where EntryDate between ? and ? and DBCSID=? and isDeleted='false'";
    let queryParams = [params.weekStart, params.weekEnd, params.dbcsID];
    return this.getList("Select * from Allowance where EntryDate between ? and ? and OracleDBID=? and isDeleted='false' Order By EntryDate", queryParams, "getSiteAllowanceData");
  }


}
