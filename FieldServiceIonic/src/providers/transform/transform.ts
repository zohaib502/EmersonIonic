import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import moment from 'moment-timezone';
import { ValueProvider } from '../value/value';
import { LoggerProvider } from '../logger/logger';
import { Platform } from 'ionic-angular';
import * as Enums from '../../enums/enums';

declare var cordova: any;
/*
  Generated class for the TransformProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TransformProvider {

  private valueProvider: ValueProvider;
  private fileName: any = 'TransformProvider';
  constructor(injector: Injector, public http: HttpClient, private platform: Platform, public logger: LoggerProvider) {
    setTimeout(() => this.valueProvider = injector.get(ValueProvider));
  }

  getTimeForMCS(pendingTimeEntriesForTask) {
    return pendingTimeEntriesForTask.map((item => {
      let startDate = new Date(item.Service_Start_Date);
      startDate.setHours(item.Start_Time.split(':')[0]);
      startDate.setMinutes(item.Start_Time.split(':')[1]);
      let endDate = new Date(item.Service_End_Date);
      endDate.setHours(item.End_Time.split(':')[0]);
      endDate.setMinutes(item.End_Time.split(':')[1]);
      item.Start_Date = moment.utc(startDate).format("YYYY-MM-DDTHH:mm:ss.000Z");
      item.End_Date = moment.utc(endDate).format("YYYY-MM-DDTHH:mm:ss.000Z");
      return item;
    }));
  }

  //03/01/2019 Haidar: set the object for updateAcceptStatusStaging only Accepted condition
  //02/11/2019 -- Mayur Varshney -- Recorrect details for calendar invite
  // getTaskChangeLogObject(newChangeLog: any) {
  //   newChangeLog.displayContactName = this.valueProvider.getTaskObject().Contact_Name;
  //   newChangeLog.displayEmail = this.valueProvider.getTaskObject().Email;
  //   newChangeLog.ContactName = this.valueProvider.getUser().Name;
  //   newChangeLog.Email = this.valueProvider.getUser().Email;
  //   newChangeLog.Address = this.valueProvider.getTaskObject().Street_Address;
  //   newChangeLog.endDate = moment(this.valueProvider.getTaskObject().End_Date).tz(this.valueProvider.getUser().timeZoneIANA).format('YYYY-MM-DD HH:mm:ss.SSS Z');
  //   newChangeLog.startDate = moment(this.valueProvider.getTaskObject().Start_Date).tz(this.valueProvider.getUser().timeZoneIANA).format('YYYY-MM-DD HH:mm:ss.SSS Z');
  //   newChangeLog.timezone = this.valueProvider.getUser().Time_Zone;
  //   newChangeLog.subject = 'Meeting invite for Job #';
  //   newChangeLog.FieldJobNumber = this.valueProvider.getTaskObject().Task_Number;
  //   newChangeLog.FieldJobType = this.valueProvider.getTaskObject().Job_Description;
  //   newChangeLog.Customer = this.valueProvider.getTaskObject().Customer_Name;
  //   newChangeLog.RequestSummary = this.valueProvider.getTaskObject().Job_Description;
  //   return newChangeLog;
  // }

  getExpenseForMCS(expenseArray) {

    //10/11/2018 kamal: added IsOrginal, IsAdditional,UniqueMobileId,DebriefStatus fields into expense for submitting into OSC
    return expenseArray.map(item => {
      return {
        "Expense_Id": item.Expense_Id,
        "task_id": item.Task_Number,
        "comments": item.Justification,
        "currency": item.Currency_Id.toString(),
        "distance": item.Distance,
        "unitofmeasurement": item.UOM_Id,
        "chargeMethod": item.Charge_Method_Id ? item.Charge_Method_Id.toString() : "",
        "ammount": item.Amount,
        "date": moment.utc(new Date(item.Date)).format("YYYY-MM-DD"),
        "expenseItem": item.Expense_Type_Id.toString(),
        "Original": item.Original,
        "DebriefStatus": item.DebriefStatus,
        "IsAdditional": item.IsAdditional,
      };
    })
  }
  /**
   *
   *07262018 KW  transform AddressAuditLog Object to insert into local DB offline
   * @param {*} addressAuditTrailObj
   * @returns addressAuditLog Object
   * @memberof TransformProvider
   */
  getAddressAuditTrailForLocal(addressAuditTrailObj) {
    delete addressAuditTrailObj.tempLangObj;
    addressAuditTrailObj.updatedBy = this.valueProvider.getUser().Name;
    addressAuditTrailObj.updatedOn = moment.utc(new Date()).format();
    addressAuditTrailObj.AddressMCSId = addressAuditTrailObj.id;
    delete addressAuditTrailObj.id;
    addressAuditTrailObj.Sync_Status = "false";
    addressAuditTrailObj.id = "";
    return addressAuditTrailObj;
  }

  getInstalledBaseForMCS(installedBaseArray) {
    return installedBaseArray.map(item => {
      //08/17/2018 kamal check if Customer_Id doesn't exits then insert it from value service
      item.Organization_Id = parseInt(item.Customer_ID ? item.Customer_ID : this.valueProvider.getTask().Customer_ID);
      item.SerialNumber = item.Serial_Number;
      //08/17/2018 kamal check if SR_ID doesn't exits then insert it from value service
      item.Incident_Id = parseInt(item.SR_ID ? item.SR_ID : this.valueProvider.getTask().SR_ID);
      item.Status_Id = parseInt(item.Status_Id);
      item.Manufacturer_Id = parseInt(item.Manufacturer_Id);
      item.Product_Id = parseInt(item.Product_Id);
      item.Task_Id = item.Task_Number;
      return item;
    })
  }

  getInstalledBaseForLocal(installedBaseList) {
    return installedBaseList.map(item => {
      item.Start_Date = new Date();
      item.Task_Number = this.valueProvider.getTaskId();
      item.Sync_Status = "false";
      item.Product_Line = item.Product_Line;
      item.Product_Id = item.Product_Id ? item.Product_Id.toString() : '';
      item.Manufacturer_Id = item.Manufacturer_Id ? item.Manufacturer_Id.toString() : '';
      item.Status_Id = item.Status_Id.toString();
      return item;
    })
  }

  mapSerial_item(item) {
    let serialIn, serialOut, serialNo;
    let Serial_Type: any[] = [];

    try {
      // 03-16-2019 : Gurkirat Singh - Added isSerialArray check to apply condition if any serial item is null or '' then also return the value in array
      serialIn = this.getSerialArray(item.Serial_In, true);
      serialOut = this.getSerialArray(item.Serial_Out, true);
      serialNo = this.getSerialArray(item.Serial_Number, true);
      //materialSerialId = this.getSerialArray(item.Material_Serial_Id);

      //console.log(serialNo);
      if (!this.isEmptyArray(serialNo)) {
        Serial_Type = serialNo.map(function (num) { return { Serial_In: "", Serial_Out: "", Serial_Number: num }; });
      } else if (!this.isEmptyArray(serialIn) || !this.isEmptyArray(serialOut)) {
        Serial_Type = serialIn.map(function (srIn, index) { return { Serial_In: srIn, Serial_Out: serialOut[index], Serial_Number: "" }; });
      }



    } catch (e) {
      this.logger.log(this.fileName, "mapSerial_item", "Error: " + JSON.stringify(e));
    }

    finally {
      return Serial_Type;
    }

  }

  getMaterialForMCS(materialArray) {

    //10/11/2018 kamal: added IsOrginal, IsAdditional,UniqueMobileId,DebriefStatus fields into material for submitting into OSC
    return materialArray.map(item => {
      return {
        "Material_Serial_Id": item.Material_Serial_Id,
        "charge_method": item.Charge_Type_Id.toString(),
        "task_id": item.Task_Number,
        "item_description": item.Description,
        "product_quantity": "1",
        "comments": "",
        "item": item.ItemName,
        "serialin": item.Serial_In || "",
        "serialout": item.Serial_Out || "",
        "serial_number": item.Serial_Number || "",
        "Original": item.Original,
        "DebriefStatus": item.DebriefStatus,
        "IsAdditional": item.IsAdditional,
        //01/01/2019 kamal: added material serial unquie Id
      };
    })
  }

  getSerialArray(obj, isSerialArray) {
    let result = [];
    if (obj && obj != '') {
      // console.log(obj)
      if ((typeof obj) == 'string') {
        result = obj.split(",");
      }
      else {
        for (let i = 0; i < obj.length; i++) {
          result = result.concat(obj[i].split(","));
        }
      }

    } else if (isSerialArray) {
      result.push('');
    }
    //  console.log(result);
    return result;
  }

  isEmptyArray(arr) {
    let result = true;
    if (arr && (typeof arr) == 'object') {
      result = arr.filter(function (item) { return item != '' }).length == 0;
    }
    return result;
  }

  getNotesForMCS(notesArray) {
    return notesArray.map(item => {
      return {
        "Notes_Id": item.Notes_Id,
        "Notes_type": item.Note_Type_Id,
        "notes_description": (item.Item_Number || item.Serial_Number ? item.Item_Number + " " + item.Serial_Number + " : " : '') + item.Notes,
        "task_id": item.Task_Number,
        "mobilecreatedDate": moment.utc(new Date(item.Date)).format("YYYY-MM-DDTHH:mm:ss.000Z"),
        // 04/09/2019 -- Mayur Varshney -- Send NotesId as mobile indicator to OSC
        "Mobile_Indicator": item.Notes_Id
      };
    })
  }

  /**
   *
   * 10/23/2018 -- Mayur Varshney -- transform Signature Object to send data into MCS
   * @param {*} signatureArray
   * @returns signatureArray Object
   * @memberof TransformProvider
   */
  getSignatureForMCS(signatureArray) {
    return signatureArray.map(item => {
      return {
        "task_id": item.Task_Number,
        "customer_id": item.Customer_Id,
        "customer_signature": item.Cust_Sign_File,
        // 10/31/2018 -- Mayur Varshney -- Apply check if customer deny signature
        "customer_signature_timestamp": item.Cust_Sign_File ? moment.utc(new Date(item.Cust_Sign_Time)).format("YYYY-MM-DDTHH:mm:ss.000Z") : '',
        "engineer_id": item.Engineer_Id,
        "emerson_signature": item.Sign_File_Path,
        "emerson_signature_timestamp": moment.utc(new Date(item.Engg_Sign_Time)).format("YYYY-MM-DDTHH:mm:ss.000Z"),
        "cust_rep_name": item.Customer_Name,
        //10/25/2018 -- Mayur Varshney -- change name from responsability to responsibility
        "cust_rep_job_responsibility": item.Job_responsibilty,
        "cust_rep_email": item.Email
      };
    })
  }

  getTaskListFromMCS(taskList) {
    return taskList.map(item => {
      item.Type = "CUSTOMER";
      item.email = "";
      item.Date = new Date();
      return item;
    })
  }

  getInternalOFSCListForLocal(internalTaskList) {
    return internalTaskList.map(internalObject => {
      let internalOFSCJSONObject: any = {};
      internalOFSCJSONObject.Start_Date = internalObject.Start_time;
      internalOFSCJSONObject.End_Date = internalObject.End_time;
      internalOFSCJSONObject.Type = "INTERNAL";
      internalOFSCJSONObject.Customer_Name = internalObject.Activity_type;
      internalOFSCJSONObject.Task_Number = internalObject.Activity_Id;
      // 11/21/2018 -- Mayur Varshney -- convert Activity_Description into job description
      internalOFSCJSONObject.Job_Description = internalObject.Activity_Description;
      return internalOFSCJSONObject;
    })
  }

  getTaskAttachmentsFromMCS(attachmentArray) {
    let filePath = "";
    if (this.platform.is('cordova')) {
      filePath = cordova.file.dataDirectory;
    }

    let tempArray = [];

    // 01/23/2019 -- Mayur Varshney -- filter attachment array for those task whose status is not closed, cancelled
    attachmentArray.forEach((item) => {
      let type = "O";
      let userFileName = item.User_File_Name.split("_");
      if (userFileName.length >= 2 && userFileName[0] == "Report" && userFileName[1] == item.Task_Number) {
        type = "fsr"
      }
      tempArray.push({
        Attachment_Id: item.Attachments_Id,

        File_Path: filePath,
        File_Name: item.User_File_Name,
        File_Type: item.Content_type,
        Type: "O",
        AttachmentType: type,
        Created_Date: item.Date_Created,
        Task_Number: item.Task_Number,
        SRID: ""
      })
    });
    return tempArray;
  }

  getSRAttachmentsFromMCS(attachmentArray) {
    let filePath = "";
    if (this.platform.is('cordova')) {
      filePath = cordova.file.dataDirectory;
    }
    return attachmentArray.map(item => {
      return {
        Attachment_Id: item.File_Attachment_ID,
        File_Path: filePath,
        File_Name: item.User_File_Name,
        File_Type: item.Content_Type,
        Type: "S",
        AttachmentType: "S",
        Created_Date: item.Date_Created,
        Task_Number: "",
        SRID: item.SRID
      };
    })
  }

  /**
   * // 05/07/2019 -- Mayur Varshney
   * transform date and keys as per format
   * @param {any} timeArray
   * @memberOf TransformProvider
   */
  changeTimeForMCS(timeArray) {
    return timeArray.map(item => {
      item.DB_Syncstatus = 'true';
      item.isSubmitted = 'true';
      item.Service_End_Date = moment.utc(new Date(item.Service_End_Date)).format("DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A");
      item.Service_Start_Date = moment.utc(new Date(item.Service_Start_Date)).format("DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A");
      item.ModifiedDate = moment.utc(new Date(item.ModifiedDate)).format("DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A");
      item.Date = moment.utc(new Date(item.Date)).format("DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A");
      return item;
    })
  }

   /**
   * Rajat Gupta
   * transform date and keys as per format
   * @param {any} timeArray
   * @memberOf TransformProvider
   */
  changeAllowanceForATP(timeArray) {
    return timeArray.map(item => {
      item.DB_SYNCSTATUS = 'true';
      item.ISSUBMITTED = 'true';
    
      // item.CREATEDDATE = moment.utc(new Date(item.CREATEDDATE)).format("DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A");
      // item.MODIFIEDDATE = moment.utc(new Date(item.MODIFIEDDATE)).format("DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A");
      return item;
    })
  }

  createAttachmentObject(data) {
    let contentType;
    if (data.file_type) contentType = data.file_type;
    else contentType = data.file_name.indexOf('pdf') > -1 ? 'application/pdf' : 'application/octet-stream';
    return {
      'filename': data.file_name,
      'base64': data.attachmentdata.split(",")[1],
      'contentType': contentType
    };
  }

  getUpdateTaskStatusForMCS(taskObject, engineerResponse, customerResponse) {
    return {
      "masteractivityId": String(taskObject.Activity_Id),
      "XA_TASK_STATUS": taskObject.StatusID,
      "resourceId": this.valueProvider.getResourceId(),
      "OFSCdate": moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      "TaskId": String(taskObject.Task_Number),
      "email": taskObject.Email || '',
      "CompletedDateOSC": taskObject.StatusID == Enums.Jobstatus.Completed_Awaiting_Review
        ? moment.utc(taskObject.DebriefSubmissionDate).format("YYYY-MM-DDTHH:mm:ss.000Z") : '',
      "followUp": (engineerResponse && engineerResponse.followUp) || '',
      "salesQuote": (engineerResponse && engineerResponse.salesQuote) || '',
      "salesVisit": (engineerResponse && engineerResponse.salesVisit) || '',
      "salesLead": (engineerResponse && engineerResponse.salesLead) || '',
      "followuptext": (engineerResponse && engineerResponse.Follow_Up) || '',
      "sparequotetext": (engineerResponse && engineerResponse.Spare_Quote) || '',
      "salesText": (engineerResponse && engineerResponse.Sales_Visit) || '',
      "salesleadText": (engineerResponse && engineerResponse.Sales_Head) || '',
      "denySignature": String((customerResponse && customerResponse.isCustomerSignChecked) || ''),
      "signatureComments": (customerResponse && customerResponse.customerComments),
      "Print_Expense_On_On_Site_Rep": taskObject.FSR_PrintExpenseOnSite || '',
      "Print_Expense_On_Completed_Rep": taskObject.FSR_PrintExpenseComplete || '',
      // 12/14/2018 -- Mayur Varshney -- add Safety_Check
      "Safety_Check": taskObject.Safety_Check,
      "SelectedProcess": taskObject.Selected_Process,
      "SDRReportID": taskObject.ReportID
    };
  }

}
