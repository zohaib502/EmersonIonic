import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events, AlertController } from 'ionic-angular';
import * as moment from "moment";
import { UtilityProvider } from '../../../providers/utility/utility';
import { LoggerProvider } from '../../../providers/logger/logger';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LocalServiceSdrProvider } from '../../../providers/local-service-sdr/local-service-sdr';
import { ValueProvider } from '../../../providers/value/value';
import * as Enums from '../../../enums/enums';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-timesheet-add-edit-modal',
  templateUrl: 'timesheet-add-edit-modal.html',
})

export class TimesheetAddEditModalPage {
  dayData: any = {};
  notes: any;
  currentEntryDate: any = "";
  currentEndDate: any = "";
  isDateError: boolean = false;
  startTime: any;
  endTime: any;
  duration: any;
  oldDuration: any;
  dbSyncStatus: any;
  syncStatus: any;
  uniqueMobileId: any;
  TimeId: any;
  original: any;
  statusID:any;
  previousEntries: any = [];
  additionalEntries: any = [];
  previousEntriesTotalHours: any;
  fileName: any = 'TimesheetAddEditModalPage';
  recordExists: boolean = false;
  listPage: boolean;
  projectData: any = [];
  jsonObj: any = {};
  enums: any = {};
  dayBtnClicked: boolean = false;
  advSearchBtnClicked: boolean = false;
  selectedDay: any;
  isBtnClicked: boolean = false;
  nonClarityList: boolean = false;
  displayEntryDate: any = "";
  displayEndDate: any = "";
  zeroDuration: boolean = false;
  weekEditPage: boolean = false;
  _taskObj: any;
  constructor(public navCtrl: NavController, public translate: TranslateService, public alertCtrl: AlertController, public navParams: NavParams, public viewCtrl: ViewController, public events: Events, public utilityProvider: UtilityProvider, public logger: LoggerProvider, private localService: LocalServiceProvider, private localServiceSdr: LocalServiceSdrProvider, public valueService: ValueProvider) {
    this.projectData = this.navParams.get('project');
    this.enums = Enums;
    this.dayData = this.navParams.get('day');
    this.dayBtnClicked = this.navParams.get('dayBtnClicked');
    this.advSearchBtnClicked = this.navParams.get('advSearchBtnClicked');
    this.listPage = this.navParams.get('listPage');
    this.nonClarityList = this.navParams.get('nonclaritylistPage')
    this.selectedDay = this.navParams.get('selectedDay');
    this.weekEditPage = this.navParams.get('weekEditPage');
    let taskNumber, jobNumber;
    if (this.nonClarityList) {
      if (this.projectData) {
        taskNumber = this.projectData.Task_Number
        jobNumber =  this.projectData.Job_Number;
      }
      else {
        taskNumber = this.dayData["Task_Number"];
        jobNumber =  this.dayData["Job_Number"];
      }
    }
    else {
      taskNumber = (this.projectData && this.projectData.length > 0) ? this.projectData[0].Job_Number : this.dayData["Job_Number"];
      jobNumber = (this.projectData && this.projectData.length > 0) ? this.projectData[0].Job_Number : this.dayData["Job_Number"];
    }

    if (this.valueService.getTaskList().length) {
      let taskobj = this.valueService.getTaskList().filter((item => {
        if (item.Task_Number) return item.Task_Number == taskNumber
      }))[0];
      if (taskobj) {
        this.statusID = taskobj.StatusID;
        this.valueService.setTask(taskobj).then(() => {
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'Page constructor', 'Error in setTask : ' + JSON.stringify(err))
        });
      } else{
        this.checkTaskStatus(jobNumber);
      }
    } else{
      this.checkTaskStatus(jobNumber); 
    }
    
    this._taskObj = this.valueService.getUser();
    if (this.dayBtnClicked || this.advSearchBtnClicked) {
      this.currentEntryDate = this.dayData.entryDate = moment(this.dayData.EntryDate, 'YYYY-MM-DD');
      this.currentEndDate =  moment(this.currentEntryDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.displayEntryDate = moment(this.dayData.EntryDate, 'YYYY-MM-DD').format("DD-MMM-YYYY");
      this.displayEndDate =  moment(this.displayEntryDate, 'DD-MMM-YYYY').format('"DD-MMM-YYYY"');

    }
    else {
      this.currentEntryDate = this.dayData.entryDate;
      this.currentEndDate =  moment(this.currentEntryDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.displayEntryDate = moment(this.dayData.entryDate, 'YYYY-MM-DD').format("DD-MMM-YYYY");
      this.displayEndDate =  moment(this.displayEntryDate, 'DD-MMM-YYYY').format('"DD-MMM-YYYY"');
    }

    this.setDefaultTimeObject();

    if (this.listPage) {
      this.dayData.Clarity_Project = this.projectData ? this.projectData[0].Clarity_Project : this.dayData.Clarity_Project;
      this.dayData.Clarity_Project_Id = this.projectData ? this.projectData[0].Clarity_Project_Id : this.dayData.Clarity_Project_Id;
      this.dayData.Job_Number = this.projectData ? this.projectData[0].Job_Number : this.dayData.Job_Number;
      this.dayData.EntryDate = this.projectData ? moment(this.dayData.entryDate).format("YYYY-MM-DD") : this.dayData.EntryDate;
      this.dayData.Notes = this.dayData.notes;
      this.dayData.Time_Code = this.projectData ? this.projectData[0].Time_Code : this.dayData.Time_Code;
      this.dayData.Time_Code_Id = this.projectData ? this.projectData[0].Time_Code_Id : this.dayData.Time_Code_Id;
      this.dayData.Work_Type = this.projectData ? this.projectData[0].Work_Type : this.dayData.Work_Type;
      this.dayData.Work_Type_Id = this.projectData ? this.projectData[0].Work_Type_Id : this.dayData.Work_Type_Id;
      this.dayData.Shift_Code = this.projectData ? this.projectData[0].Shift_Code : this.dayData.Shift_Code;
      this.dayData.Shift_Code_Id = this.projectData ? this.projectData[0].Shift_Code_Id : this.dayData.Shift_Code_Id;
      this.dayData.Charge_Method = this.projectData ? this.projectData[0].Charge_Method : this.dayData.Charge_Method;
      this.dayData.Charge_Method_Id = this.projectData ? this.projectData[0].Charge_Method_Id : this.dayData.Charge_Method_Id;
      this.dayData.Field_Job_Name = this.projectData ? this.projectData[0].Field_Job_Name : this.dayData.Field_Job_Name;
      this.dayData.Field_Job_Name_Id = this.projectData ? this.projectData[0].Field_Job_Name_Id : this.dayData.Field_Job_Name_Id;
      this.dayData.City = this.projectData ? this.projectData[0].City : this.dayData.City;
      this.dayData.State = this.projectData ? this.projectData[0].State : this.dayData.State;
      this.dayData.Country_Code = this.projectData ? this.projectData[0].Country_Code : this.dayData.Country_Code;

      this.dayData.Charge_Type = this.projectData ? this.projectData[0].Charge_Type : this.dayData.Charge_Type;
      this.dayData.Charge_Type_Id = this.projectData ? this.projectData[0].Charge_Type_Id : this.dayData.Charge_Type_Id;
      this.dayData.Item = this.projectData ? this.projectData[0].Item : this.dayData.Item;
      this.dayData.Item_Id = this.projectData ? this.projectData[0].Item_Id : this.dayData.Item_Id;
      this.dayData.Work_Type_OT = this.projectData ? this.projectData[0].Work_Type_OT : this.dayData.Work_Type_OT;

      this.getPreviousEntries();
    }
    else if (this.valueService.isOSCUser() && !this.valueService.getUser().ClarityID) {
      this.dayData.EntryDate = this.projectData ? moment(this.dayData.entryDate).format("YYYY-MM-DD") : this.dayData.EntryDate;
      this.getPreviousEntriesNOC();
    }
    else {
      this.getPreviousEntries(true);
    }
    this.events.subscribe('savedMSTDataIntoDB', (obj) => {
      this.isBtnClicked = false;
      if (obj) {
        this.getPreviousEntries(true);
        this.clearDuration();
      }
    });
  }

  public closeModal() {
    this.viewCtrl.dismiss();
    // if (this.dayBtnClicked || this.advSearchBtnClicked) {
    //   this.events.publish('refreshListPage');
    // }
  }
  
  /**
   *
   *  08-01-2020 -- Gaurav Vachhani
   * @param {*} [taskNumber] to validate the type of task and assign the job status
   * @memberof TimesheetAddEditModalPage
   */
  checkTaskStatus(taskNumber?){
    if(taskNumber == "Not Applicable"){
      this.statusID = Enums.Jobstatus.Debrief_Started;
    } else{
      this.statusID = Enums.Jobstatus.Completed_Awaiting_Review;
    }
  }

  ionViewWillLeave() {

    this.events.unsubscribe('savedMSTDataIntoDB');
  }

  deleteTime(time) {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("Confirm ?"),
      message: this.translate.instant(Enums.AlertMessage.LoseData),
      enableBackdropDismiss: false,
      buttons: [
        {
          text: this.translate.instant('No'),
          handler: () => {
          }
        },
        {
          text: this.translate.instant('Yes'),
          handler: () => {
            this.clearFields();
            this.localService.deleteClarityTimeObject(time.Time_Id, ((this.listPage || this.nonClarityList) && !this.weekEditPage)?false:true).then((res) => {
              if (this.valueService.isOSCUser() && !this.valueService.getUser().ClarityID) {
                this.getPreviousEntriesNOC();
              } else {
                this.getPreviousEntries(this.listPage?false:true);
                this.events.publish('refreshEditPage');
              }
            })
          }
        }
      ]
    });
    alert.present();
  }

  clearFields() {
    this.notes = '';
    this.setDefaultTimeObject();
  }
  /**
   * Preeti Varshney 08/09/2019
   * Set default time to 00:00 in start time and end time
   */
  setDefaultTimeObject() {
      let initialStartAndEnd = new Date(moment(this.currentEntryDate, 'YYYY-MM-DD').format('YYYY-MM-DD'));
      initialStartAndEnd.setHours(0);
      initialStartAndEnd.setMinutes(0);
      this.startTime = initialStartAndEnd;
      this.endTime = initialStartAndEnd;
      setTimeout(() => {
        this.startTime = null;
        this.endTime = null;
      }, 0);
      this.duration =  '00:00';
  }
  /**
* Preeti Varshney 08/08/2019
* Interlinked condition with start time and end time.
*/
  getTimeOnChange(event, type) {

    this.zeroDuration = false;
    this.currentEndDate = this.currentEntryDate;
    this.displayEndDate = this.displayEntryDate;

    if ((!this.startTime && !this.endTime) || (this.startTime == 'Invalid date' && this.endTime == 'Invalid date')) {
      this.duration =  '00:00';
      return;
    }
    if (event == null) {
      this.duration =  '00:00';
      return;
    }
    this[type] = moment(event).format('HH:mm');

    if(this.endTime == "00:00"){
      this.currentEndDate =  moment(this.currentEntryDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
      this.displayEndDate =  moment(this.displayEntryDate, 'DD-MMM-YYYY').add(1, 'day').format('"DD-MMM-YYYY"');
    }
    let startTimeVal : any = this.currentEntryDate;
    let endTimeVal: any = this.currentEndDate ;
    switch (type) {
      case 'startTime':
        startTimeVal = this.utilityProvider.formatDateTime(this.currentEntryDate, this.startTime);
        endTimeVal = this.utilityProvider.formatDateTime(this.currentEndDate, this.endTime);
        if (moment(startTimeVal).isSameOrAfter(endTimeVal) || !this.endTime || this.endTime == 'Invalid date') {
          this.endTime = this.utilityProvider.getDateFormatTime(this.currentEntryDate, this.startTime);
        }
        else {
          this.duration = this.utilityProvider.getDuration(startTimeVal, endTimeVal);
        }
        break;
      case 'endTime':
        startTimeVal = this.utilityProvider.formatDateTime(this.currentEntryDate, this.startTime);
        endTimeVal = this.utilityProvider.formatDateTime(this.currentEndDate, this.endTime);
        if (!this.startTime || this.startTime == 'Invalid date') {
          this.startTime = this.utilityProvider.getDateFormatTime(this.currentEndDate, this.endTime);
        }
        this.duration = this.utilityProvider.getDuration(startTimeVal, endTimeVal);
        break;
    }

  }


  checkforspace(value) {
    let val = value._value
    this.notes = val.trim();

  }

  async getStatusID(jobNumber) {
    try {
      let response: any = await this.localService.getStatusID(jobNumber)
      return response.length ? response[0].StatusID : null;
    }
    catch (error) {
      this.logger.log(this.fileName, "getStatusID ", " Error while getStatusID query: " + JSON.stringify(error.message));
    }
  }
  /**
   * Preeti Varshney 08/12/2019
   * sending to add page for insert/update and clear modal on click of save button
   */
  async saveDuration(fromEdit?) {
    this.zeroDuration = false;
    if (this.duration == '00:00') {
      this.zeroDuration = true;
      return
    };
    this.isBtnClicked = true;
    this.dayData['Start_Time'] = this.startTime;
    this.dayData['End_Time'] = this.endTime;
    this.dayData['Comments'] = this.notes;
    this.dayData['Duration'] = this.duration;
    // this.dayData['UniqueMobileId'] = this.uniqueMobileId;
    this.dayData['Time_Id'] = this.TimeId;
    this.dayData['oldDuration'] = this.oldDuration;
    this.dayData['DB_Syncstatus'] = this.dbSyncStatus;
    this.dayData['Sync_Status'] = this.syncStatus;
    this.dayData['Original'] = this.original;
    let startDate = moment(this.currentEntryDate).format("YYYY-MM-DD");
    let endDate = moment(this.currentEndDate).format("YYYY-MM-DD");
    this.dayData['Service_Start_Date'] = moment(startDate + " " + this.dayData.Start_Time).toDate().toString();
    this.dayData['Service_End_Date'] = moment(endDate + " " +  this.dayData.End_Time).toDate().toString();
    this.dayData['StatusID'] = await this.getStatusID(this.dayData['Job_Number']);
    this.dayData['EntryDate'] = moment(this.dayData.entryDate).format("YYYY-MM-DD");
    if (this.valueService.isOSCUser() && !this.valueService.getUser().ClarityID) {
      this.dayData['Charge_Method'] = this.projectData ? this.projectData.Charge_Method : this.dayData.Charge_Method;
      this.dayData['Job_Number'] = this.projectData ? this.projectData.Job_Number : this.dayData.Job_Number;
      this.dayData['Work_Type_Id'] = this.projectData ? this.projectData.Work_Type_Id : this.dayData.Work_Type_Id;
      this.dayData['Work_Type_OT'] = this.projectData ? this.projectData.Work_Type_OT : this.dayData.Work_Type_OT;
      this.dayData['Work_Type'] = this.projectData ? this.projectData.Work_Type : this.dayData.Work_Type;
      // this.dayData['SerialNumber'] = this.projectData ? this.projectData.Serial_No : this.dayData.Serial_No;
      // this.dayData['TagNumber'] = this.projectData ? this.projectData.Tag_No : this.dayData.Tag_No;
      this.dayData['Charge_Method_Id'] = this.projectData ? this.projectData.Charge_Method_Id : this.dayData.Charge_Method_Id;
      this.dayData['Job_Type'] = this.projectData ? this.projectData.Job_Type : this.dayData.Job_Type;
      this.dayData['Item_Id'] = this.projectData ? this.projectData.Item_Id : this.dayData.Item_Id;
      this.dayData['Item'] = this.projectData ? this.projectData.Item : this.dayData.Item;
      this.dayData['Task_Number'] = this.projectData ? this.projectData.Task_Number : this.dayData.Task_Number;
      this.dayData['Notes'] = this.notes;
      this.dayData['TagNumber'] = this.projectData ? this.projectData.TagNumber : this.dayData.TagNumber;
      this.dayData['SerialNumber'] = this.projectData ? this.projectData.SerialNumber : this.dayData.SerialNumber;
      this.dayData['isPicked'] = this.projectData ? this.projectData.isPicked : this.dayData.isPicked;
      this.dayData['EntryDate'] = moment(this.dayData.entryDate).format("YYYY-MM-DD");
      this.dayData['isSubmitted'] = "false";
      let days = this.dayData.days;
      let tempObj = this.dayData;
      delete tempObj.days;
      this.jsonObj = JSON.parse(JSON.stringify(tempObj));
      this.dayData.days = days;
      this.saveMSTData(fromEdit);
    } else {
      this.events.publish('saveToMST', this.dayData);
      if (this.listPage == true) {
        this.dayData['Field_Job_Name'] = this.projectData ? this.projectData[0].Field_Job_Name : this.dayData.Field_Job_Name;
        this.dayData['Charge_Method'] = this.projectData ? this.projectData[0].Charge_Method : this.dayData.Charge_Method;
        this.dayData['City'] = this.projectData ? this.projectData[0].City : this.dayData.City;
        this.dayData['Clarity_Project'] = this.projectData ? this.projectData[0].Clarity_Project : this.dayData.Clarity_Project;
        this.dayData['Job_Number'] = this.projectData ? this.projectData[0].Job_Number : this.dayData.Job_Number;
        this.dayData['Shift_Code'] = this.projectData ? this.projectData[0].Shift_Code : this.dayData.Shift_Code;
        this.dayData['State'] = this.projectData ? this.projectData[0].State : this.dayData.State;
        this.dayData['Time_Code'] = this.projectData ? this.projectData[0].Time_Code : this.dayData.Time_Code;
        this.dayData['Work_Type'] = this.projectData ? this.projectData[0].Work_Type : this.dayData.Work_Type;
        this.dayData['Task_Number'] = this.projectData ? this.projectData[0].Task_Number : this.dayData.Task_Number;
        this.dayData['Country_Code'] = this.projectData ? this.projectData[0].Country_Code : this.dayData.Country_Code;
        this.dayData['isPicked'] = this.projectData ? this.projectData[0].isPicked : this.dayData.isPicked;
        this.jsonObj = JSON.parse(JSON.stringify(this.dayData));
        this.removeUnwantedKeys();
        this.saveMSTData(fromEdit);
      }
      if (this.nonClarityList) {
        this.dayData['Charge_Method'] = this.projectData ? this.projectData.Charge_Method : this.dayData.Charge_Method;
        this.dayData['Job_Number'] = this.projectData ? this.projectData.Job_Number : this.dayData.Job_Number;
        this.dayData['Work_Type_Id'] = this.projectData ? this.projectData.Work_Type_Id : this.dayData.Work_Type_Id;
        //  this.dayData['Comments'] = this.projectData ? this.projectData.notes : this.dayData.notes;
        this.dayData['Work_Type'] = this.projectData ? this.projectData.Work_Type : this.dayData.Work_Type;
        // this.dayData['SerialNumber'] = this.projectData ? this.projectData.Serial_No : this.dayData.Serial_No;
        // this.dayData['TagNumber'] = this.projectData ? this.projectData.Tag_No : this.dayData.Tag_No;
        this.dayData['Charge_Method_Id'] = this.projectData ? this.projectData.Charge_Method_Id : this.dayData.Charge_Method_Id;
        this.dayData['Job_Type'] = this.projectData ? this.projectData.Job_Type : this.dayData.Job_Type;
        this.dayData['Item_Id'] = this.projectData ? this.projectData.Item_Id : this.dayData.Item_Id;
        this.dayData['Item'] = this.projectData ? this.projectData.Item : this.dayData.Item;
        this.dayData['Task_Number'] = this.projectData ? this.projectData.Task_Number : this.dayData.Task_Number;
        if (this.valueService.isOSCUser()) {
          this.dayData['Notes'] = this.notes;
          this.dayData['TagNumber'] = this.projectData ? this.projectData.TagNumber : this.dayData.TagNumber;
          this.dayData['SerialNumber'] = this.projectData ? this.projectData.SerialNumber : this.dayData.SerialNumber;
        }

        // this.dayData['Charge_Method_Id'] = this.projectData ? this.projectData[0].Charge_Method_Id : this.dayData.Charge_Method_Id;
        //this.dayData['Charge_Method'] = this.projectData ? this.projectData[0].Charge_Method : this.dayData.Charge_Method;
        this.jsonObj = JSON.parse(JSON.stringify(this.dayData));
        this.removeUnwantedKeys();
        this.saveMSTData();
      }

    }
  }
  
  async saveMSTData(fromEdit?) {
    try {
      let tableName = fromEdit ? "Time_Temp" : "Time";
      let res: any = await this.localServiceSdr.ifTimeValid([this.jsonObj]);
      if (!res) {
        this.localServiceSdr.checkTimeSheetOverlapData(this.jsonObj, fromEdit).then((res: any) => {
          if (!res.length) {
            delete this.jsonObj["totalHours"];
            this.localServiceSdr.insertOrUpdateTimeSheetData([this.jsonObj], this.recordExists, tableName).then((response: any) => {
              if (this.nonClarityList) {
                this.getPreviousEntriesNOC();
              }
              else {
                this.getPreviousEntries();
              }

              this.clearDuration();
              this.recordExists = false;
              this.isBtnClicked = false;
            }).catch((error: any) => {
              this.utilityProvider.stopSpinner();
              this.isBtnClicked = false;
              this.logger.log(this.fileName, 'saveMSTData', ' Error in saveMSTData : ' + JSON.stringify(error));
            });
          }
          else {
            this.promptAlert(res);
          }
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.isBtnClicked = false;
          this.logger.log(this.fileName, 'saveMSTData', ' Error in saveMSTData : ' + JSON.stringify(error));
        });
      }
      else {
        this.promptAlert(res);
        this.events.publish('savedMSTDataIntoDB', false);
      }
    }
    catch (error) {
      this.isBtnClicked = false;
      this.logger.log(this.fileName, "saveMSTData ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }

  promptAlert(res) {
    let duplicateEntryDate = moment(res[0].EntryDate, 'YYYY-MM-DD').format('DD-MMM-YYYY');
    let duplicateStart_Time = res[0].Start_Time;
    let duplicateEnd_Time = res[0].End_Time;
    let Job_Number = res[0].Job_Number;
    if (Job_Number == null) Job_Number = 'Not Applicable (Absence)';
    let alert = this.utilityProvider.promptAlert('', 'Overlapping time entry exists (Job ID: ' + Job_Number + ' Date: ' + duplicateEntryDate + ' Start Time: ' + duplicateStart_Time + ' End Time: ' + duplicateEnd_Time + ')');
    alert.present();
    this.isBtnClicked = false;
  }
  /**
   * Preeti Varshney 08/12/2019
   * get previous entries of different start time and end time of one date with all fields same.
   */
  getPreviousEntries(isFromTemp?) {
    return new Promise((resolve, reject) => {
      this.dayData['entryDate'] = moment(this.dayData.entryDate).format("YYYY-MM-DD");
      let tempCheck=isFromTemp?isFromTemp:this.weekEditPage;
      this.localService.getPreviousEntries(this.dayData, tempCheck).then((res: any) => {
        this.additionalEntries = res.filter(item => {
          return item.IsAdditional == 'true' || item.IsAdditional == true
        });
        this.previousEntries = res.filter(item => {
          return item.IsAdditional == 'false' || item.IsAdditional == false
        });
        this.previousEntriesTotal(res);
        resolve(true);
      }).catch((err: any) => {
        this.utilityProvider.stopSpinner();
        resolve(false);
        this.logger.log(this.fileName, 'getPreviousEntries', ' Error in getTimeList : ' + JSON.stringify(err))
      })
    })
  }
  /**
   * Preeti Varshney 08/13/2019
   * clear modal on click of clear button
   */
  clearDuration() {
    this.startTime = null;
    this.endTime = null;
    this.duration = null;
    this.notes = null;
    this.uniqueMobileId = null;
    this.TimeId = null;
    this.original = null;
    this.setDefaultTimeObject();
  }
  /**
   * Preeti Varshney 08/13/2019
   * assign values to the  modal on click of edit of particular entry
   */
  editTime(item) {
    //this.startTime = item.Start_Time;
    //this.endTime = item.End_Time;
    this.startTime = this.utilityProvider.getDateFormatTime(this.currentEntryDate, item.Start_Time);
    this.endTime = this.utilityProvider.getDateFormatTime(this.currentEndDate, item.End_Time);
    this.oldDuration = JSON.stringify(item.Duration);
    this.dbSyncStatus = item.DB_Syncstatus;
    this.syncStatus = item.Sync_Status;
    this.duration = item.Duration;
    this.notes = item.Comments;
    this.original = item.Original;
    // this.uniqueMobileId = item.UniqueMobileId;
    this.TimeId = item.Time_Id;
    this.recordExists = true;
  }
  /**
   * Preeti Varshney 08/16/2019
   * Calculate Total duration of all previous entries on one date
   */
  previousEntriesTotal(res) {
    this.utilityProvider.cloneDuration = '';
    if (res.length) {
      for (let i = 0; i < res.length; i++) {
        this.previousEntriesTotalHours = this.utilityProvider.totalHours(res[i].Duration);
      }
      this.dayData['totalHours'] = this.previousEntriesTotalHours;
    }
    else {
      this.dayData['totalHours'] = null;
    }
    this.events.publish('dayDuration', this.dayData);
  }

  removeUnwantedKeys() {
    let arr = ['dayid', 'entryDate', 'dayName', 'duration', 'startTime', 'endTime', 'notes', 'isOpen', 'TotalDuration', 'oldDuration', 'Group_Id', 'Serial_No', 'Tag_No', 'Primary_Key', 'totalDuration', 'Activity_Name', 'OT_Code', 'expanded', 'timeId', 'AdvDate','DisableDelete','isAdditional','DisableEdit','DeleteTimeIds'];
    arr.forEach((item) => {
      delete this.jsonObj[item];
    });
  }
  async getPreviousEntriesNOC() {
    try {
      let res: any = await this.localService.getPreviousEntriesNOC(this.dayData, this.weekEditPage);
      this.additionalEntries = res.filter(item => {
        return item.IsAdditional == 'true' || item.IsAdditional == true
      });
      this.previousEntries = res.filter(item => {
        return item.IsAdditional == 'false' || item.IsAdditional == false
      });
      this.previousEntriesTotal(res);
    } catch (err) {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getPreviousEntries', ' Error in getTimeList : ' + err)
    }
  }
  formatDate(selecteddate) {
    selecteddate = moment(selecteddate, "DD-MMM-YYYY").format(this.valueService.getUserPreferences()[0].Date_Format ? this.valueService.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
    return selecteddate
  }

}
