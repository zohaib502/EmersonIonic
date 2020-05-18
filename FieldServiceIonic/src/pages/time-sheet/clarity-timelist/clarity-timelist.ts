import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events, PopoverController, AlertController } from 'ionic-angular';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap';

import * as moment from "moment";
import { UtilityProvider } from '../../../providers/utility/utility';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../providers/logger/logger';
import { ValueProvider } from '../../../providers/value/value';
import { LocalServiceSdrProvider } from '../../../providers/local-service-sdr/local-service-sdr';
import { SearchPipe } from '../../../pipes/search/search';
import { CloudService } from '../../../providers/cloud-service/cloud-service';
import { TransformProvider } from '../../../providers/transform/transform';
import { TranslateService } from '@ngx-translate/core';
import * as Enums from '../../../enums/enums';
import { SyncProvider } from '../../../providers/sync/sync';
declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-clarity-timelist',
  templateUrl: 'clarity-timelist.html',
})
export class ClarityTimelistPage {
  fileName: any = 'Timesheet_Clarity_Page';
  header_data: any;
  advSearchBtnClicked: boolean = false;
  dayBtnClicked: boolean = false;
  weekBtnClicked: boolean = true;
  public weekStart: any;
  public weekEnd: any;
  searchInput: any;
  projectList: any = [];
  taskList: any = [];
  timeRows: any = []
  OutData: any = [];
  days: any = [];
  event = new Events()
  groupByProjects: any = [];
  selectedDay: any;
  importEntries: boolean = true;
  expandAccordion: boolean;
  toggleAllaccordion: boolean = false;
  listPage: boolean = true;
  importListBtnClicked: boolean = false;
  recordExists: boolean = false;
  searchFilter: boolean;
  searchData = [];
  date_to: any;
  date_from: any;
  fieldLovs: any = {};
  advSearchObj: any = {};
  noRecordFound: boolean = false;
  recordsToSubmit: any = [];
  submitDisabled: boolean = false;
  @ViewChild('dp') dp1: BsDatepickerDirective;
  @ViewChild('dps') dp2: BsDatepickerDirective;
  enums: any = Enums;
  dateFormatUserPref: any = "";
  enableSubmit: boolean = false;
  displayDateFrom: any = "";
  displayDateTo: any = "";
  minDate: Date = new Date(new Date().setDate(new Date().getDate() - 90));
  constructor(public events: Events, public translate: TranslateService, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public bsDatepickerConfig: BsDatepickerConfig, public appCtrl: App, public utilityProvider: UtilityProvider, public localService: LocalServiceProvider, public logger: LoggerProvider, public valueProvider: ValueProvider, public popoverCtrl: PopoverController, private localServiceSdr: LocalServiceSdrProvider, public searchPipe: SearchPipe, private cloudService: CloudService, private transformProvider: TransformProvider, public syncProvider: SyncProvider) {
    this.header_data = { title1: "", title2: "Timesheet Clarity", taskId: "" };
    this.date_to = new Date();
    this.date_from = new Date();
    this.selectedDay = moment().toDate();
  }

  ionViewDidEnter() {
    this.toggleAllaccordion = false;
    this.valueProvider.setTaskId("");
    this.events.publish('user:created', "Time");
    this.setDayFromUserPref();
    this.onDateFromChange(this.date_from);
    this.onDateToChange(this.date_to);

  }

  ionViewDidLoad() {
    this.events.subscribe('setWeekDay', (data) => {
      switch (data.type) {
        case 'setWeekStart':
        case 'setWeekEnd':
          if(data.weekStart){
            this.weekStart = data.weekStart;
          }
          if(data.weekEnd){
            this.weekEnd = data.weekEnd;
          }
          this.getTimeRows();
          // Preeti Varshney 08/28/2019 expand All is false initially
          this.toggleAllaccordion = false;
          break;
        case 'setPreviusDay':
        case 'setNextDay':
          this.selectedDay = data.selectedday;
          this.getDayTimeRows();
          // Preeti Varshney 08/28/2019 expand All is false initially
          this.toggleAllaccordion = false;
          break;
        case 'showDayWise':
          this.selectedDay = data.selectedday;
          this.weekBtnClicked = data.weekBtnClicked;
          this.dayBtnClicked = data.dayBtnClicked;
          if(data.weekStart){
            this.weekStart = data.weekStart;
          }
          if(data.weekEnd){
            this.weekEnd = data.weekEnd;
          }
          this.getDayTimeRows();
          // Preeti Varshney 08/28/2019 expand All is false initially
          this.toggleAllaccordion = false;
          break;
        case 'showWeekWise':
          this.weekBtnClicked = data.weekBtnClicked;
          this.dayBtnClicked = data.dayBtnClicked;
          if(data.weekStart){
            this.weekStart = data.weekStart;
          }
          if(data.weekEnd){
            this.weekEnd = data.weekEnd;
          }
          this.getTimeRows();
          // Preeti Varshney 08/28/2019 expand All is false initially
          this.toggleAllaccordion = false;
          break;
        case 'advSearchBtn':
          this.projectList = [];
          this.advSearchBtnClicked = data.advSearchBtnClicked;
          this.dayBtnClicked = data.dayBtnClicked;
          this.weekBtnClicked = data.weekBtnClicked;
          this.getAllFieldsLOVs();
          this.getFieldsByProject(undefined);
          if (this.searchInput) {
            this.searchInput = '';
            this.events.publish('clearSearchBox');
          }
          // Preeti Varshney 04/26/2019 expand All is false initially
          this.toggleAllaccordion = false;
          if (this.advSearchBtnClicked == false) {

            this.closeAdvancedSearch();
            if (this.searchInput) {
              this.searchInput = '';
              this.events.publish('clearSearchBox');
            }
          }
          break;
        case 'searchJobid':
          this.searchInput = data.taskInput;
          this.setFullLimit({ Job_Number: this.searchInput });
          break;
        default:

          break;
      }
    });

    this.events.subscribe('setWeekfromCal', (data) => {
      if(data.weekStart){
        this.weekStart = data.weekStart;
      }
      if(data.weekEnd){
        this.weekEnd = data.weekEnd;
      }
      this.selectedDay = data.selectedDay;
      // Preeti Varshney 08/28/2019 expand All is false initially
      this.toggleAllaccordion = false;
      if (data.isChange) {
        if (this.selectedDay != undefined) {
          if (this.dayBtnClicked) {
            this.getDayTimeRows();
          }
          else {
            this.getTimeRows();
          }
        }
      }
    });
    this.events.subscribe('refreshListPage', (data) => {
      this.loadDayWeekView();
      // Preeti Varshney 08/28/2019 expand All is false initially
      this.toggleAllaccordion = false;
    });
    this.events.publish('user:created', "Time");

  }

  /**
    * Preeti Varshney 03/12/2019
    * receive data from expandable component as output
    */
  recievedData(data) {
    this.OutData = data;
    for (let i = 0; i < this.projectList.length; i++) {
      if (this.projectList[i].Time_Id == this.OutData.Time_Id) {
        this.projectList[i].totalDuration = this.OutData.totalHours
      }

    }
    // this.tsTotalHours();
  }

  groupByTask: any = [];
  /**
    * Preeti Varshney 03/12/2019
    * get time rows from time table using start date and end date
    */
  getTimeRows() {
    if (this.searchInput) {
      this.searchInput = '';
      this.events.publish('clearSearchBox');
    }
    this.projectList = [];
    this.groupByProjects = [];
    let formattedweekStart = moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    let formattedweekEnd = moment(this.weekEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    this.localService.getTimeRows(formattedweekStart, formattedweekEnd).then((response: any[]) => {
      if (!moment((this.weekStart), 'DD-MMM-YYYY').isSame(moment((formattedweekStart)))) {
        return;
      }
      if (response.length > 0) {
        this.recordsToSubmit = response;
        let checkToSubmitRecords = this.recordsToSubmit.filter((item) => { return item.isSubmitted == 'false' || item.Import_Level == Enums.clarityStatus.Saved })
        this.enableSubmit = checkToSubmitRecords.length > 0 ? true : false;
        let groupByJobNumber = this.utilityProvider.groupBySameKeyValues(response, "Job_Number");
        for (let k in groupByJobNumber) {
          let ClarityObj: any = {};
          ClarityObj.Job_Number = k;
          let tempVar = this.utilityProvider.groupBySameKeyValues(groupByJobNumber[k], "Clarity_Project");
          // Grouping on the basis of Project
          ClarityObj.ClarityData = [];
          for (let i in tempVar) {
            let clarity: any = {};
            ClarityObj.ProjectNumber = i == null || i == 'null' ? "" : i;// Setting ProjectNumber on ClarityData
            clarity.Job_Number = k;

            clarity.Task = this.utilityProvider.groupBy(tempVar[i], function (item) {
              return [item.Time_Code, item.Work_Type, item.Shift_Code, item.Charge_Method, item.Field_Job_Name, item.City, item.Country_Code, item.State, item.Charge_Type, item.Item]
            });
            let initialTimeEntry = [];
            clarity.Task.forEach((task, index) => {
              let totalDuration = {};
              this.utilityProvider.cloneDuration = '';
              let innerInitialTimeEntry = this.getInitialTimeEntry(task);
              initialTimeEntry.push(innerInitialTimeEntry);
              if (task.length > 1) {
                task.forEach((item) => {
                  if (totalDuration[item.EntryDate]) {
                    totalDuration[item.EntryDate] = this.utilityProvider.totalHours(item.Duration);
                  }
                  else {
                    this.utilityProvider.cloneDuration = '';
                    totalDuration[item.EntryDate] = this.utilityProvider.totalHours(item.Duration);
                  }

                })
                task.forEach((item) => {
                  item.TotalDuration = totalDuration[item.EntryDate];
                })
              }
              clarity.Task[index].ModifiedTime = innerInitialTimeEntry;
            })
            clarity.Task.sort((a, b) => (a.ModifiedTime < b.ModifiedTime) ? -1 : 1)
            clarity.ProjectNumber = i == null || i == 'null' ? "" : i;
            let finalDate = this.getInitialTimeEntry(initialTimeEntry, "finalDate");
            let obj = this.createObject(ClarityObj);
            obj.ModifiedDate = finalDate;
            obj.ClarityData = [];
            obj.ClarityData.push(clarity);
            this.projectList.push(obj);
            this.groupByProjects.push(obj);
          }
        }
        this.groupByTimeEntries();
      }

      this.utilityProvider.stopSpinner();
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getTimeRows', ' Error in  getTimeRows: ' + JSON.stringify(error));
    });
  }

  getInitialTimeEntry(task, finaldate?) {
    let initialTimeEntry = [];
    let exactDate: any;
    try {
      if (task) {
        if (finaldate) {
          task.forEach(element => {
            initialTimeEntry.push((new Date(element)).getTime());
          });

        } else {
          task.forEach(element => {
            initialTimeEntry.push((new Date(this.utilityProvider.formatDateTime(element.EntryDate, element.Start_Time))).getTime());
          });
        }


        exactDate = initialTimeEntry.sort();
        //exactDate = exactDate.reverse();
        // console.log(exactDate);
        let convertDate = exactDate[0];
        // console.log(moment.unix(convertDate).toDate());
        return convertDate;
      }
    } catch (error) {
      console.log(error)
    }
  }

  setFullLimit(criteria) {
    let time;
    this.enableSubmit = false;
    time = this.searchPipe.transform(this.projectList, criteria);
    this.utilityProvider.cloneDuration = "";
    if (time.length > 0) {
      this.searchFilter = true;
      this.searchData = time;
      this.tsTotalHours(time);
    }
    else {
      this.valueProvider.setTotalHours('')
    }
  }

  tsTotalHours(response) {
    this.utilityProvider.cloneDuration = "";
    this.valueProvider.TotalHours = 0;
    if (this.weekBtnClicked) {
      for (let i = 0; i < response.length; i++) {
        for (let k = 0; k < response[i].ClarityData.length; k++) {
          for (let j = 0; j < response[i].ClarityData[k].Task.length; j++) {
            this.valueProvider.setTotalHours(this.utilityProvider.totalHours(response[i].ClarityData[k].Task[j].totalHours));
          }
        }
      }
    }
    if (this.dayBtnClicked) {
      for (let i = 0; i < response.length; i++) {
        for (let k = 0; k < response[i].ClarityData.length; k++) {
          this.valueProvider.setTotalHours(this.utilityProvider.totalHours(response[i].ClarityData[k].totalHours));
        }
      }

    }
    if (this.advSearchBtnClicked) {
      for (let i = 0; i < response.length; i++) {
        for (let z = 0; z < response[i].EntryDateTask.length; z++) {
          for (let k = 0; k < response[i].EntryDateTask[z].ClarityData.length; k++) {
            this.valueProvider.setTotalHours(this.utilityProvider.totalHours(response[i].EntryDateTask[z].ClarityData[k].totalHours));
          }
        }
      }
    }
    this.checkSubmittedEntries(response);
  }
  groupByTimeEntries() {
    let weekstart = moment(this.weekStart, 'DD-MMM-YYYY');
    for (let i = 0; i < this.groupByProjects.length; i++) {
      for (let j = 0; j < this.groupByProjects[i].ClarityData.length; j++) {
        let task = this.groupByProjects[i].ClarityData[j].Task;
        for (let k = 0; k < task.length; k++) {
          let daysData: any = {};
          this.utilityProvider.cloneDuration = '';
          this.days = [];
          daysData.totalDuration = "";
          let isAdditional = "false";
          let dbSyncStatus = true;
          let innerOriginal = true;
          let SyncStatus = "true";
          for (let i = 0; i < 7; i++) {
            let dayid = i + 1;
            let entryDate = moment(weekstart, 'DD-MMM-YYYY');
            let dayName = moment(weekstart, 'DD-MMM-YYYY').format("ddd");
            let formattedentryDate = moment(weekstart, 'YYYY-MM-DD').format('YYYY-MM-DD');
            task[k].forEach(element => {
              if (element.EntryDate == formattedentryDate) {
                daysData.duration = element.TotalDuration ? element.TotalDuration : element.Duration;
                daysData.startTime = element.Start_Time
                daysData.endTime = element.End_Time
                daysData.notes = element.Comments
                daysData.Time_Id = element.Time_Id
                // daysData.UniqueMobileId = element.UniqueMobileId
                daysData.DB_Syncstatus = element.DB_Syncstatus
                daysData.isSubmitted = element.isSubmitted
                daysData.isPicked = element.isPicked
                daysData.Job_Number = element.Job_Number ? element.Job_Number : "";
                daysData.Clarity_Project = element.Clarity_Project ? element.Clarity_Project : "";
                daysData.Import_Level = element.Import_Level
                if ((element.DB_Syncstatus == 'false' || element.DB_Syncstatus == false) && dbSyncStatus) {
                  dbSyncStatus = false;
                }


              }
              if ((element.IsAdditional == 'true' || element.IsAdditional == true) && isAdditional == "false") {
                isAdditional = "true";
              }
              if (SyncStatus && (element.SyncStatus == 'false' || element.SyncStatus == false)) {
                SyncStatus = "false";
              }
              if ((!element.Original) && innerOriginal) {
                innerOriginal = false;
              }
            });
            this.days.push({
              'dayid': dayid,
              'entryDate': entryDate,
              'dayName': dayName,
              'duration': daysData.duration ? daysData.duration : "",
              'notes': daysData.notes ? daysData.notes : "",
              'startTime': daysData.startTime ? daysData.startTime : "",
              'endTime': daysData.endTime ? daysData.endTime : "",
              "Time_Id": daysData.Time_Id ? daysData.Time_Id : "",
              // "Group_Id": task[0].UniqueMobileId,
              // "UniqueMobileId": daysData.UniqueMobileId,
              "DB_Syncstatus": daysData.DB_Syncstatus,
              "isSubmitted": daysData.isSubmitted,
              "Job_Number": daysData.Job_Number,
              "Clarity_Project": daysData.Clarity_Project,
              "TotalDuration": daysData.totalDuration,
              "isPicked": daysData.isPicked,
              "Import_Level": daysData.Import_Level
            });
            weekstart = moment(weekstart, 'DD-MMM-YYYY').add(1, 'days');
            daysData.duration = "";
            daysData.startTime = "";
            daysData.endTime = "";
            daysData.notes = "";
            daysData.Time_Id = "";
            // daysData.UniqueMobileId = "";
            daysData.DB_Syncstatus = "";
            daysData.Job_Type = "";
            daysData.Job_Number = "";
            daysData.isSubmitted = "";
            daysData.Clarity_Project = "";
            daysData.isPicked = "";
            daysData.Import_Level = "";
          }
          task[k].forEach(element => {
            if ((element.StatusID == Enums.Jobstatus.Debrief_In_Progress && element.IsAdditional == "false") ||
              (element.StatusID == Enums.Jobstatus.Debrief_Declined && (element.Sync_Status == "true" || element.Original)) ||
              (element.StatusID == Enums.Jobstatus.Completed_Awaiting_Review) || element.Sync_Status == "true") {
              element.DisableDelete = true;
            } else {
              element.DisableDelete = false;
            }
          });
          let DisableDelete = task[k].filter(item => item.DisableDelete == false).length == 0;
          let isSubmitted = true;
          this.days.forEach(res => {
            if (res.isSubmitted == "false") {
              isSubmitted = false;
              return;
            }
          });
          let totalHours;
          weekstart = moment(this.weekStart, 'DD-MMM-YYYY');
          this.projectList[i].ClarityData[j].Task[k].Field_Job_Name = task[k][0].Field_Job_Name;
          this.projectList[i].ClarityData[j].Task[k].Time_Code = task[k][0].Time_Code;
          this.projectList[i].ClarityData[j].Task[k].Work_Type = task[k][0].Work_Type;
          this.projectList[i].ClarityData[j].Task[k].Work_Type_Id = task[k][0].Work_Type_Id;
          this.projectList[i].ClarityData[j].Task[k].Work_Type_OT = task[k][0].Work_Type_OT;
          this.projectList[i].ClarityData[j].Task[k].Shift_Code = task[k][0].Shift_Code;
          this.projectList[i].ClarityData[j].Task[k].StatusID = task[k][0].StatusID;
          this.projectList[i].ClarityData[j].Task[k].IsDeclined = task[k][0].IsDeclined;
          this.projectList[i].ClarityData[j].Task[k].State = task[k][0].State;
          this.projectList[i].ClarityData[j].Task[k].City = task[k][0].City;
          this.projectList[i].ClarityData[j].Task[k].duration = task[k][0].Duration;
          this.projectList[i].ClarityData[j].Task[k].Charge_Method = task[k][0].Charge_Method;
          this.projectList[i].ClarityData[j].Task[k].Country_Code = task[k][0].Country_Code;
          this.projectList[i].ClarityData[j].Task[k].Charge_Type = task[k][0].Charge_Type;
          this.projectList[i].ClarityData[j].Task[k].Item = task[k][0].Item;
          this.projectList[i].ClarityData[j].Task[k].Charge_Type_Id = task[k][0].Charge_Type_Id;
          this.projectList[i].ClarityData[j].Task[k].Item_Id = task[k][0].Item_Id;
          this.projectList[i].ClarityData[j].Task[k].days = this.days;
          this.projectList[i].ClarityData[j].Task[k].Time_Id = task[k][0].Time_Id;
          this.projectList[i].ClarityData[j].Task[k].TotalLength = task[k].length;
          this.projectList[i].ClarityData[j].Task[k].isSubmitted = isSubmitted;
          this.projectList[i].ClarityData[j].Task[k].Original = innerOriginal;
          this.projectList[i].ClarityData[j].Task[k].IsAdditional = isAdditional;
          this.projectList[i].ClarityData[j].Task[k].DB_Syncstatus = dbSyncStatus;
          this.projectList[i].ClarityData[j].Task[k].isPicked = task[k][0].isPicked;
          this.projectList[i].ClarityData[j].Task[k].Sync_Status = SyncStatus;
          this.projectList[i].ClarityData[j].Task[k].DisableDelete = DisableDelete;

          this.utilityProvider.cloneDuration = "";
          for (let index = 0; index < this.days.length; index++) {
            totalHours = this.utilityProvider.totalHours(this.days[index].duration)
          }
          this.projectList[i].ClarityData[j].Task[k].totalHours = totalHours;
        }
        let DisableDelete = this.projectList[i].ClarityData[j].Task.filter(item => item.DisableDelete == false).length == 0;
        this.projectList[i].ClarityData[j].DisableDelete = DisableDelete;
      }
    }
    for (let i = 0; i < this.projectList.length; i++) {
      for (let j = 0; j < this.projectList[i].ClarityData.length; j++) {
        let totalHours;
        this.utilityProvider.cloneDuration = '';
        let original = true;
        let isAllSubmited = true;
        let isAllSynced = true;
        let isAllAdditional = "false";
        for (let k = 0; k < this.projectList[i].ClarityData[j].Task.length; k++) {
          // this.utilityProvider.cloneDuration = "";
          this.projectList[i].ClarityData[j].Task[k].forEach((task) => {
            totalHours = this.utilityProvider.totalHours(task.Duration);
            if ((task.isSubmitted == 'false' || task.isSubmitted == false) && isAllSubmited) {
              isAllSubmited = false;
            }
            if ((!task.Original) && original) {
              original = false;
            }
            if ((task.IsAdditional == 'true' || task.IsAdditional == true) && isAllAdditional == "false") {
              isAllAdditional = "true";
            }
          })
        }
        this.projectList[i].ClarityData[j].isSubmitted = isAllSubmited;
        this.projectList[i].ClarityData[j].Original = original;
        this.projectList[i].ClarityData[j].totalHours = totalHours;
        this.projectList[i].ClarityData[j].IsAdditional = isAllAdditional;
      }
    }
    this.projectList.sort((a, b) => (a.ModifiedDate < b.ModifiedDate) ? -1 : 1)
    this.tsTotalHours(this.projectList);
  }

  /**
    * Preeti Varshney 03/12/2019
    * open edit time entry page
   */
  editpage() {
    this.appCtrl.getRootNav().setRoot("ClarityTimeEntryPage");
  }


  /**
   * Preeti Varshney 03/12/2019
   * open comment box model
  */
  openCommentBox(project) {
    let feedbackModal = this.utilityProvider.showModal("CommentModalPage", { project }, { enableBackdropDismiss: false, cssClass: 'FeedbackDetailModalPage' });
    feedbackModal.present();
  }
  /**
   *@author: Prateek 03/13/2019
   *Fetch time row according to day.
   */
  getDayTimeRows() {
    if (this.searchInput) {
      this.searchInput = '';
      this.events.publish('clearSearchBox');
    }
    this.projectList = [];
    let formattedweekStart = moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    let formattedweekEnd = moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    this.localService.getTimeRows(formattedweekStart, formattedweekEnd).then((response: any) => {
      if (response.length > 0) {
        let checkToSubmitRecords = response.filter((item) => { return item.isSubmitted == 'false' })
        this.enableSubmit = checkToSubmitRecords.length > 0 ? true : false;
        let groupByJobNumber = this.utilityProvider.groupBySameKeyValues(response, "Job_Number");
        for (let k in groupByJobNumber) {
          let ClarityObj: any = {};
          ClarityObj.Job_Number = k;
          let tempVar = this.utilityProvider.groupBySameKeyValues(groupByJobNumber[k], "Clarity_Project");
          // Grouping on the basis of Project
          //ClarityObj.ClarityData = [];
          for (let i in tempVar) {
            let clarity: any = {};
            ClarityObj.ProjectNumber = i == null || i == 'null' ? "" : i;// Setting ProjectNumber on ClarityData
            clarity.Job_Number = k;
            clarity.Task = this.utilityProvider.groupBy(tempVar[i], function (item) {
              return [item.Time_Code, item.Work_Type, item.Shift_Code, item.Charge_Method, item.Field_Job_Name, item.City, item.Country_Code, item.State, item.Charge_Type, item.Item]
            });
            let initialTimeEntry = [];
            clarity.Task.forEach((task, index) => {
              let totalDuration = {};
              let totalDuration1 = {};
              let isSubmitted = true;
              let isAdditional = false;
              let dbSyncStatus = true;
              let innerOriginal = true;
              let SyncStatus = "true";
              let innerInitialTimeEntry = this.getInitialTimeEntry(task);
              this.utilityProvider.cloneDuration = '';
              let isSaved = false;
              let Import_Level = 1;
              initialTimeEntry.push(innerInitialTimeEntry);
              if (task.length > 0) {
                task.forEach((item) => {
                  if ((item.isSubmitted == 'false' || item.isSubmitted == false) && isSubmitted) {
                    isSubmitted = false;
                  }
                  if ((item.IsAdditional == 'true' || item.IsAdditional == true) && !isAdditional) {
                    isAdditional = true;
                  }
                  if ((item.DB_Syncstatus == 'false' || item.DB_Syncstatus == false) && dbSyncStatus) {
                    dbSyncStatus = false;
                  }
                  if ((!item.Original) && innerOriginal) {
                    innerOriginal = false;
                  }
                  // if (totalDuration[item.EntryDate]) {
                  //   totalDuration[item.EntryDate] = this.utilityProvider.totalHours(item.Duration);
                  // }
                  if ((item.SyncStatus == 'false' || item.SyncStatus == false) && SyncStatus) {
                    SyncStatus = "false";
                  }

                  if (totalDuration[item.EntryDate]) {
                    totalDuration[item.EntryDate] = this.utilityProvider.totalHours(item.Duration);
                  }
                  else {
                    this.utilityProvider.cloneDuration = '';
                    totalDuration[item.EntryDate] = this.utilityProvider.totalHours(item.Duration);
                  }
                  if (item.Import_Level == Enums.clarityStatus.Submitted && !isSaved) {
                    isSaved = true;
                    Import_Level = item.Import_Level;
                  }
                })
                
                task.forEach((item) => {
                   item.TotalDuration = totalDuration[item.EntryDate];
                  if ((item.StatusID == Enums.Jobstatus.Debrief_In_Progress && item.IsAdditional == "false") ||
                    (item.StatusID == Enums.Jobstatus.Debrief_Declined && (item.Sync_Status == "true" || item.Original)) ||
                    (item.StatusID == Enums.Jobstatus.Completed_Awaiting_Review) || item.Sync_Status == "true") {
                    item.DisableDelete = true;
                  } else {
                    item.DisableDelete = false;
                  }
                  if ((item.StatusID == Enums.Jobstatus.Debrief_In_Progress && item.IsAdditional == "false") || (item.StatusID == Enums.Jobstatus.Completed_Awaiting_Review)) {
                    item.DisableEdit = true;
                  } else {
                    item.DisableEdit = false;
                  }
                 
                }) 
              }
              let DisableDelete = task.filter(item => item.DisableDelete == false).length == 0;
              let DisableEdit = task.filter(item => item.DisableEdit == false).length == 0;
              clarity.Task[index].isSubmitted = isSubmitted;
              clarity.Task[index].IsAdditional = isAdditional;
              clarity.Task[index].DB_Syncstatus = dbSyncStatus;
              clarity.Task[index].Original = innerOriginal;
              clarity.Task[index].ModifiedTime = innerInitialTimeEntry;
              clarity.Task[index].SyncStatus = SyncStatus;
              clarity.Task[index].DisableDelete = DisableDelete;
              clarity.Task[index].DisableEdit = DisableEdit;
              clarity.Task[index].isSaved = isSaved;
              clarity.Task[index].Import_Level = Import_Level;
            })
            clarity.Task.sort((a, b) => (a.ModifiedTime < b.ModifiedTime) ? -1 : 1)
            clarity.ProjectNumber = i == null || i == 'null' ? "" : i;
            let DisableDelete = clarity.Task.filter(item=>item.DisableDelete == false).length == 0;
            let finalDate = this.getInitialTimeEntry(initialTimeEntry, "finalDate");
            let obj =  this.createObject(ClarityObj);
            clarity.DisableDelete = DisableDelete;
            obj.ModifiedDate = finalDate;
            obj.ClarityData = [];
            obj.ClarityData.push(clarity);
            this.projectList.push(obj);
          }
          // this.groupByProjects.push(ClarityObj);
        }
        for (let i = 0; i < this.projectList.length; i++) {
          for (let j = 0; j < this.projectList[i].ClarityData.length; j++) {
            let totalHours;
            let outerIsSubmitted = true;
            let outerOriginal = true;
            this.utilityProvider.cloneDuration = '';
            for (let k = 0; k < this.projectList[i].ClarityData[j].Task.length; k++) {
              // this.utilityProvider.cloneDuration = "";
              if ((this.projectList[i].ClarityData[j].Task[k].isSubmitted == 'false' || this.projectList[i].ClarityData[j].Task[k].isSubmitted == false) && outerIsSubmitted) {
                outerIsSubmitted = false;
              }
              if ((!this.projectList[i].ClarityData[j].Task[k].Original) && outerOriginal) {
                outerOriginal = false;
              }
              this.projectList[i].ClarityData[j].Task[k].forEach((task) => {
                totalHours = this.utilityProvider.totalHours(task.Duration);

              })
            }
            this.projectList[i].ClarityData[j].totalHours = totalHours;
            this.projectList[i].ClarityData[j].isSubmitted = outerIsSubmitted;
            this.projectList[i].ClarityData[j].Original = outerOriginal;
          }
        }
        this.projectList.sort((a, b) => (a.ModifiedDate < b.ModifiedDate) ? -1 : 1)
        this.tsTotalHours(this.projectList);
      }
      this.utilityProvider.stopSpinner();

    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getDayTimeRows', 'Error in getDayTimeRows : ' + JSON.stringify(error));
    });
  }

  createObject(key) {
    return Object.assign(Object.create(key), key)
  }

  /**
     * Preeti Varshney 08/21/2019
     * import previous entries
     */
  importList() {
    this.utilityProvider.showSpinner();
    // Preeti Varshney 08/21/2019 expand All is false initially
    this.projectList = [];
    this.toggleAllaccordion = false;
    let today = this.dayBtnClicked ? moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD') : moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    this.localService.lastWeekentryDate(today).then((response: any) => {

      if (response.length > 0) {
        let WeekStart;
        let WeekEnd;
        if (this.weekBtnClicked == true) {
          let sdate = moment(response[0].EntryDate, 'YYYY-MM-DD');
          let edate = moment(response[0].EntryDate, 'YYYY-MM-DD');
          let st_date = sdate.startOf('week');
          let en_date = edate.endOf('week');
          WeekStart = moment(st_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
          WeekEnd = moment(en_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        }
        else {
          WeekStart = response[0].EntryDate;
          WeekEnd = response[0].EntryDate;
        }
        // Preeti Varshney 08/21/2019 added the check on import time entry (only import time-entry that is before the present date)
        let importCheckDate = this.dayBtnClicked ? moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD') : moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD');
        if (moment(response[0].EntryDate).isBefore(importCheckDate)) {
          this.getLastWeekTimeRows(WeekStart, WeekEnd);
        }
        else {
          this.utilityProvider.stopSpinner();
          this.utilityProvider.presentToast("No entries found", 2000, 'top', '');
        }
      } else {
        this.utilityProvider.stopSpinner();
        this.utilityProvider.presentToast("No entries found", 2000, 'top', '');
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'importList', ' Error in lastWeekentryDate : ' + JSON.stringify(error));
    });
    this.importListBtnClicked = true;
  }
  /**
   * Preeti Varshney 08/21/2019
   * Get previous saved  time entries from database
   */
  getLastWeekTimeRows(formattedweekStart, formattedweekEnd) {
    this.localService.getTimeRows(formattedweekStart, formattedweekEnd, true).then((response: any[]) => {
      if (response.length > 0) {
        // Preeti Varshney 04/25/2019 Changes the import function for day view
        let dataObject = [];
        let importedDate;
        response.forEach((entry) => {
          if (this.weekBtnClicked) {
            let weekstart = moment(this.weekStart, 'DD-MMM-YYYY');
            let importeddayName = moment(entry.EntryDate, 'YYYY-MM-DD').format('ddd');
            for (let j = 0; j < 7; j++) {
              let currentDayName = moment(weekstart, 'DD-MMM-YYYY').format('ddd');
              if (currentDayName == importeddayName) {
                importedDate = moment(weekstart, 'DD-MM-YYYY');
              }
              weekstart = moment(weekstart, 'DD-MMM-YYYY').add(1, 'days');
            }
          }
          entry['EntryDate'] = this.weekBtnClicked ? moment(importedDate, 'DD-MMM-YYYY').format('YYYY-MM-DD') : moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD');
          // delete entry['UniqueMobileId'];
          delete entry['Time_Id'];
          delete entry['Original'];
          dataObject.push(entry);
        });
        this.localServiceSdr.insertOrUpdateTimeSheetData(dataObject, this.recordExists, 'TIME').then((response: any) => {
          if (response) {
            this.loadDayWeekView();
          }
          else {
            this.utilityProvider.stopSpinner();
          }
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'saveMSTData', ' Error in saveMSTData : ' + JSON.stringify(error));
        });
      }
      else {
        this.utilityProvider.stopSpinner();
        this.utilityProvider.presentToast("No entries found", 2000, 'top', '');
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getLastWeekTimeRows', ' Error in getTimeRows : ' + JSON.stringify(error));
    });
  }
  expandInnerAcc(data) {
    if (!this.toggleAllaccordion) {

      for (let i = 0; i < this.projectList.length; i++) {
        for (let k = 0; k < this.projectList[i].ClarityData; k++) {
          let task = this.projectList[i].ClarityData[k];
          for (let j = 0; j < task.length; j++) {
            if (data.Time_Id != this.projectList[i].ClarityData[k].task[j].Time_Id)
              this.projectList[i].ClarityData[k].task[j].isOpen = false;
          }
        }
      }
    }
    data.isOpen = !data.isOpen;
    this.toggleIfAllExpanded();
  }




  expandOuterAcc(currentAccordion, accordionList) {
    let isOpen = currentAccordion.isOpen;
    if (!this.toggleAllaccordion) {
      // this.toggleAccordionItems(accordionList, false);
      this.toggleAccordionItems(currentAccordion.Task, !isOpen);
    }
    currentAccordion.isOpen = !isOpen;
    this.toggleIfAllExpanded()
  }

  toggleIfAllExpanded() {
    let openedItems;
    if (this.advSearchBtnClicked) {
      openedItems = this.projectList.filter(item => {
        let openedSubItems = item.EntryDateTask[0].ClarityData.filter(accordion => {
          if (accordion.isOpen) {
            let subopened = this.getOpenedItems(accordion.Task);
            return subopened.length == accordion.Task.length;
          } else return false;
        });
        return openedSubItems.length == item.EntryDateTask[0].ClarityData.length;
      });
    }
    else {
      openedItems = this.projectList.filter(item => {
        let openedSubItems = item.ClarityData.filter(accordion => {
          if (accordion.isOpen) {
            let subopened = this.getOpenedItems(accordion.Task);
            return subopened.length == accordion.Task.length;
          } else return false;
        });
        return openedSubItems.length == item.ClarityData.length;
      });
    }
    if (openedItems.length == this.projectList.length) {
      this.toggleAllaccordion = true;
    } else {
      this.toggleAllaccordion = false;
    }
  }

  getOpenedItems(array) {
    return array.filter(item => item.isOpen);
  }

  toggleAccordionItems(accordionList, isToggle) {
    accordionList.map(accordion => accordion.isOpen = isToggle)
  }

  expandAll() {


    if (this.advSearchBtnClicked) {
      for (let i = 0; i < this.projectList.length; i++) {
        for (let z = 0; z < this.projectList[i].EntryDateTask.length; z++) {
          for (let k = 0; k < this.projectList[i].EntryDateTask[z].ClarityData.length; k++) {
            this.projectList[i].EntryDateTask[z].ClarityData[k].isOpen = this.toggleAllaccordion;
            let task = this.projectList[i].EntryDateTask[z].ClarityData[k].Task
            for (let j = 0; j < task.length; j++) {
              this.projectList[i].EntryDateTask[z].ClarityData[k].Task[j].isOpen = this.toggleAllaccordion;
            }
          }
        }
      }
    } else {
      for (let i = 0; i < this.projectList.length; i++) {
        for (let k = 0; k < this.projectList[i].ClarityData.length; k++) {
          this.projectList[i].ClarityData[k].isOpen = this.toggleAllaccordion;
          let task = this.projectList[i].ClarityData[k].Task
          for (let j = 0; j < task.length; j++) {
            this.projectList[i].ClarityData[k].Task[j].isOpen = this.toggleAllaccordion;
          }
        }
      }
    }
  }


  loadDayWeekView() {
    this.toggleAllaccordion = false;
    if (this.dayBtnClicked) {
      this.getDayTimeRows();
    }
    else if (this.advSearchBtnClicked) {
      this.advanceSearchApply('false');
    }
    else {
      this.getTimeRows();
    }
  }
  /**
      * Preeti Varshney 08/22/2019
      * open popover page on clicking on duration in the day view
      * includes start time, end time, duration and notes
      */
  openTimeDurationPopOver(task, myEvent) {
    this.utilityProvider.closeFab();
    try {
      let addEditTimeModal = this.utilityProvider.showModal("TimesheetAddEditModalPage", { day: task, listPage: this.listPage, dayBtnClicked: this.dayBtnClicked, selectedDay: this.selectedDay, advSearchBtnClicked: this.advSearchBtnClicked }, { enableBackdropDismiss: true, cssClass: 'FeedbackDetailModalPage' });
      addEditTimeModal.present({
        ev: myEvent
      });
      addEditTimeModal.onDidDismiss(data => {
        this.loadDayWeekView();
        this.toggleAllaccordion = false;
      });
    } catch (error) {
      this.logger.log(this.fileName, 'openTimeDurationPopOver', ' Error in popoverCtrl : ' + JSON.stringify(error));
    }
  }
  formatDate(selecteddate) {
    selecteddate = moment(selecteddate, "DD-MMM-YYYY").format(this.valueProvider.getUserPreferences()[0].Date_Format ? this.valueProvider.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
    return selecteddate
  }
  searchModal(key, val) {
    try {
      let isTranslateVal = false;
      if (key == 'Charge_Type' || key == 'Work_Type' || key == 'Item' || key == 'Charge_Method') {
        isTranslateVal = true;
      }
      let searchModal = this.utilityProvider.showModal("TimesheetDropdownPage", { dataSource: this.fieldLovs[key], type: 'mstData', ddValue: val, isTranslate: isTranslateVal }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
      searchModal.present();
      searchModal.onDidDismiss(data => {
        if (data) {
          // Preeti Varshney 09/10/2019 clear Task, Overtime Code, Shift_Code on Project Selection for first time.
          if (!this.advSearchObj[key] && key == 'Clarity_Project') {
            this.clearFields(['Job_Number', 'Clarity_Project', 'Work_Type', 'Charge_Method']);
          }
          this.advSearchObj[key] = data.LookupValue;
          if (key == 'Clarity_Project') {
            this.getFieldsByProject(data.ID)
          }
          if (key == 'Job_Number') {
            this.setClarityProjectFromOSC();
          }
        }
        data = null;
      });
    }
    catch (error) {
      this.logger.log(this.fileName, "searchModal ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }
  getAllFieldsLOVs(isClearClicked?) {
    try {
      return new Promise((resolve, reject) => {
        if (!isClearClicked)
          this.utilityProvider.showSpinner();
        let promiseArray = [];
        this.fieldLovs = {}
        this.localService.getTaskForTimeSheet(this.advSearchBtnClicked).then((res: any) => {
          this.fieldLovs['Job_Number'] = res;
          this.fieldLovs['Job_Number'].unshift({ "PrimaryKey": -2, "Task_Number": "No Value" });
        });
        this.localService.getProjects(this.valueProvider.getUser().ClarityID).then((projects: any[]) => {
          if (projects) {
            this.fieldLovs['Clarity_Project'] = projects;
            this.fieldLovs['Clarity_Project'].unshift({ "ID": -2, "P_PROJECTNUMBER": "No Value" });
            promiseArray.push(this.localService.getMSTData('ChargeMethod', undefined));
            promiseArray.push(this.localService.getMSTData('WorkType', undefined));
            resolve(true)

          }
          Promise.all(promiseArray).then((response) => {
            this.fieldLovs['Charge_Method'] = response[0];
            this.fieldLovs['Charge_Method'].unshift({ "ID": -2, "Value": "No Value" });
            this.fieldLovs['Work_Type'] = response[1];
            let data = [];
            for (let i = 0; i < response[1].length; i++) {
              if (response[1][i].C == 1) {
                data.push(response[1][i]);
              }
            }
            this.fieldLovs['Work_Type'] = data;

            this.fieldLovs['Work_Type'].unshift({ "ID": -2, "Value": "No Value" });
            this.utilityProvider.stopSpinner();
            resolve(true);
          }).catch((error) => {
            this.utilityProvider.stopSpinner();
            reject(error);
          });
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          reject(error);
          this.logger.log(this.fileName, 'getProjects', 'Error in getProjects : ' + JSON.stringify(error));
        });
      })
    }
    catch (error) {
      this.logger.log(this.fileName, "getAllFieldsLOVs ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }
  getFieldsByProject(projectID) {
    try {
      return new Promise((resolve, reject) => {
        let promiseArray = [];//todo empty task list and all lov
        this.localService.getMSTAssignmentTask(projectID).then((response: any[]) => {
          if (!response.length) {
            this.localService.getMSTData('MST_TaskName', projectID, 'TASK_NAME').then((response: any[]) => {
              if (response) {
                this.fieldLovs['Field_Job_Name'] = response;
                this.fieldLovs['Field_Job_Name'].unshift({ "ID": -2, "TASK_NAME": "No Value" });
              }
            }).catch((error: any) => {
              this.logger.log(this.fileName, 'setTask', 'Error in setTask : ' + JSON.stringify(error));
            });
          }
          else {
            this.fieldLovs['Field_Job_Name'] = response;
            this.fieldLovs['Field_Job_Name'].unshift({ "ID": -2, "TASK_NAME": "No Value" });

          }
          promiseArray.push(this.localService.getClarityOvertimeCode(projectID, true));
          promiseArray.push(this.localService.getClarityShiftCode(projectID, true));
          Promise.all(promiseArray).then((response) => {
            this.fieldLovs['Time_Code'] = response[0];
            this.fieldLovs['Time_Code'].unshift({ "ID": -2, "OVERTIMECODE": "No Value" });
            this.fieldLovs['Shift_Code'] = response[1];
            this.fieldLovs['Shift_Code'].unshift({ "ID": -2, "SHIFTCODE": "No Value" });

            resolve(true);
          }).catch((error) => {
            this.logger.log(this.fileName, 'setOTAndShiftCode', 'Error in setTask : ' + JSON.stringify(error));
            reject(error);
          });
        }).catch((error: any) => {//todo name chan and error handling
          this.logger.log(this.fileName, 'setTask', 'Error in setTask : ' + JSON.stringify(error));
        });;
      })
    }
    catch (error) {
      this.logger.log(this.fileName, "getFieldsByProject ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }
  advanceSearchApply(issubmit) {
    // Preeti Varshney 04/26/2019 expand All is false initially
    this.projectList.length = 0;
    this.projectList = [];
    this.toggleAllaccordion = false;
    let formattedweekStart = moment(this.date_from, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    let formattedweekEnd = moment(this.date_to, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    this.advSearchObj['date_from'] = formattedweekStart;
    this.advSearchObj['date_to'] = formattedweekEnd;
    this.localService.advSearchOSCClarity(this.advSearchObj, issubmit).then((response: any) => {
      if (response.length > 0) {
        let checkToSubmitRecords = response.filter((item) => { return item.isSubmitted == 'false' })
        this.enableSubmit = checkToSubmitRecords.length > 0 ? true : false;
        this.noRecordFound = this.dayBtnClicked = this.weekBtnClicked = false;
        let groupByEntryDate = this.utilityProvider.groupBySameKeyValues(response, "EntryDate");
        for (let z in groupByEntryDate) {
          let dateTask: any = {};
          let initialTimeEntry = [];
          dateTask.EntryDate = moment(z, 'YYYY-MM-DD').format("DD-MMM-YYYY");
          dateTask.EntryDateTask = [];
          let groupByJobNumber = this.utilityProvider.groupBySameKeyValues(groupByEntryDate[z], "Job_Number");
          for (let k in groupByJobNumber) {
            let ClarityObj: any = {};
            ClarityObj.EntryDate = moment(z, 'YYYY-MM-DD').format("DD-MMM-YYYY");;
            ClarityObj.Job_Number = k;
            let tempVar = this.utilityProvider.groupBySameKeyValues(groupByJobNumber[k], "Clarity_Project");
            // Grouping on the basis of Project
            ClarityObj.ClarityData = [];
            for (let i in tempVar) {
              let clarity: any = {};
              ClarityObj.ProjectNumber = i == null || i == 'null' ? "" : i;// Setting ProjectNumber on ClarityData
              clarity.Job_Number = k;
              clarity.EntryDate = moment(z, 'YYYY-MM-DD').format("DD-MMM-YYYY");;
              clarity.Task = this.utilityProvider.groupBy(tempVar[i], function (item) {
                return [item.Time_Code, item.Work_Type, item.Shift_Code, item.Charge_Method, item.Field_Job_Name, item.City, item.Country_Code, item.State, item.Charge_Type, item.Item]
              });
              let innerInitialTimeEntry;
              clarity.Task.forEach((task, index) => {
                let totalDuration = {};
                let isSubmitted = true;
                let isAdditional = false;
                let dbSyncStatus = true;
                let innerOriginal = true;
                let SyncStatus = "true";
                this.utilityProvider.cloneDuration = '';
                let isSaved = false;
                let Import_Level = 1;
                innerInitialTimeEntry = this.getInitialTimeEntry(task);
                initialTimeEntry.push(innerInitialTimeEntry);
                if (task.length > 0) {
                  task.forEach((item) => {
                    if ((item.isSubmitted == 'false' || item.isSubmitted == false) && isSubmitted) {
                      isSubmitted = false;
                    }
                    if ((item.IsAdditional == 'true' || item.IsAdditional == true) && !isAdditional) {
                      isAdditional = true;
                    }
                    if ((item.DB_Syncstatus == 'false' || item.DB_Syncstatus == false) && dbSyncStatus) {
                      dbSyncStatus = false;
                    }
                    if ((item.SyncStatus == 'false' || item.SyncStatus == false) && SyncStatus) {
                      SyncStatus = "false";
                    }
                    if ((!item.Original) && innerOriginal) {
                      innerOriginal = false;
                    }
                    if (totalDuration[item.EntryDate]) {
                      totalDuration[item.EntryDate] = this.utilityProvider.totalHours(item.Duration);
                    }
                    else {
                      this.utilityProvider.cloneDuration = '';
                      totalDuration[item.EntryDate] = this.utilityProvider.totalHours(item.Duration);
                    }
                    if (item.Import_Level == Enums.clarityStatus.Submitted && !isSaved) {
                      isSaved = true;
                      Import_Level = item.Import_Level;
                    }
                  })
                  task.forEach((item) => {
                    item.TotalDuration = totalDuration[item.EntryDate];
                    if ((item.StatusID == Enums.Jobstatus.Debrief_In_Progress && item.IsAdditional == "false") ||
                      (item.StatusID == Enums.Jobstatus.Debrief_Declined && (item.Sync_Status == "true" || item.Original)) ||
                      (item.StatusID == Enums.Jobstatus.Completed_Awaiting_Review) || item.Sync_Status == "true") {
                      item.DisableDelete = true;
                    } else {
                      item.DisableDelete = false;
                    }
                    if ((item.StatusID == Enums.Jobstatus.Debrief_In_Progress && item.IsAdditional == "false") || (item.StatusID == Enums.Jobstatus.Completed_Awaiting_Review)) {
                      item.DisableEdit = true;
                    } else {
                      item.DisableEdit = false;
                    }
                  })
                }
                let DisableEdit = task.filter(item => item.DisableEdit == false).length == 0;
                clarity.Task[index].isSubmitted = isSubmitted;
                clarity.Task[index].IsAdditional = isAdditional;
                clarity.Task[index].DB_Syncstatus = dbSyncStatus;
                clarity.Task[index].Original = innerOriginal;
                clarity.Task[index].SyncStatus = SyncStatus;
                let DisableDelete = task.filter(item => item.DisableDelete == false).length == 0;
                clarity.Task[index].DisableDelete = DisableDelete;
                clarity.Task[index].DisableEdit = DisableEdit;
                clarity.Task[index].Import_Level = Import_Level;
              })
              clarity.ProjectNumber = i == null || i == 'null' ? "" : i;
              let DisableDelete = clarity.Task.filter(item => item.DisableDelete == false).length == 0;
              clarity.DisableDelete = DisableDelete;
              let obj =  this.createObject(ClarityObj);
              obj.ModifiedDate = innerInitialTimeEntry;
              obj.ClarityData = [];
              obj.ClarityData.push(clarity);
              dateTask.EntryDateTask.push(obj);
            }
          }
          dateTask.EntryDateTask.sort((a, b) => (a.ModifiedDate < b.ModifiedDate) ? -1 : 1)
          let finalDate = this.getInitialTimeEntry(initialTimeEntry, "finalDate");
          dateTask.ModifiedDate = finalDate;
          this.projectList.push(dateTask);
        }
        this.projectList.sort((a, b) => (a.ModifiedDate < b.ModifiedDate) ? -1 : 1)
        for (let i = 0; i < this.projectList.length; i++) {
          for (let z = 0; z < this.projectList[i].EntryDateTask.length; z++) {
            for (let j = 0; j < this.projectList[i].EntryDateTask[z].ClarityData.length; j++) {
              let totalHours;
              let outerIsSubmitted = true;
              let outerOriginal = true;
              this.utilityProvider.cloneDuration = '';
              for (let k = 0; k < this.projectList[i].EntryDateTask[z].ClarityData[j].Task.length; k++) {
                // this.utilityProvider.cloneDuration = "";
                if ((this.projectList[i].EntryDateTask[z].ClarityData[j].Task[k].isSubmitted == 'false' || this.projectList[i].EntryDateTask[z].ClarityData[j].Task[k].isSubmitted == false) && outerIsSubmitted) {
                  outerIsSubmitted = false;
                }
                if ((!this.projectList[i].EntryDateTask[z].ClarityData[j].Task[k].Original) && outerOriginal) {
                  outerOriginal = false;
                }
                this.projectList[i].EntryDateTask[z].ClarityData[j].Task[k].forEach((task) => {
                  totalHours = this.utilityProvider.totalHours(task.Duration)
                })
              }

              this.projectList[i].EntryDateTask[z].ClarityData[j].totalHours = totalHours;
              this.projectList[i].EntryDateTask[z].ClarityData[j].isSubmitted = outerIsSubmitted;
              this.projectList[i].EntryDateTask[z].ClarityData[j].Original = outerOriginal;
            }
          }
        }
        this.tsTotalHours(this.projectList);
      } else {
        this.noRecordFound = true;
      }
      //  }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'advanceSearchApply', ' Error in advanceSearch : ' + JSON.stringify(error));
    });
  }
  /**
      * Preeti Varshney 08/27/2019
      * close advance search section and load the last list-view
      */
  closeAdvancedSearch() {
    this.clearAllFields();
    this.loadDayWeekView();
  }

  checkCurrDate(aaa) {
    return moment(aaa).format('DD-MMM-YYYY') != moment(new Date()).format('DD-MMM-YYYY')

  }
  /**
     * Preeti Varshney 08/27/2019
     * clear all fields of advance search section and the list
     */

  clearAllFields() {
    // Preeti Varshney 04/26/2019 expand All is false initially
    this.toggleAllaccordion = false;
    if (this.checkCurrDate(this.date_from))
      this.date_from = new Date();
    if (this.checkCurrDate(this.date_to))
      this.date_to = new Date();
    this.noRecordFound = false;
    this.advSearchObj.Job_Number = this.advSearchObj.Clarity_Project = this.advSearchObj.Field_Job_Name = this.advSearchObj.Time_Code = this.advSearchObj.Shift_Code = this.advSearchObj.Work_Type = this.advSearchObj.Charge_Method = '';
    this.projectList = [];
    this.getAllFieldsLOVs(true);
    this.getFieldsByProject(null);
  }
  getFomatedDate(date) {
    let _date = moment(date).format('DD-MMM-YYYY');
    return _date;
  }


  submitAlert() {
    let msg = this.weekBtnClicked ? "weekly " : "";
    let alert = this.utilityProvider.confirmationAlert('', 'Are you sure you want to submit your ' + msg + 'time entries?');
    alert.present();
    alert.onDidDismiss((response) => {
      if (response) {
        this.submitTime();
      }
    });
  }
  async submitTime() {
    try {
      this.recordsToSubmit = [];
      let formattedweekStart;
      let formattedweekEnd;
      if (this.dayBtnClicked) {
        formattedweekStart = moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD');
        formattedweekEnd = moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD');
      }
      else if (this.advSearchBtnClicked) {
        formattedweekStart = moment(this.date_from, 'DD-MMM-YYYY').format('YYYY-MM-DD');
        formattedweekEnd = moment(this.date_to, 'DD-MMM-YYYY').format('YYYY-MM-DD');
      } else {
        formattedweekStart = moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD');
        formattedweekEnd = moment(this.weekEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD');
      }
      // if (this.searchFilter && this.searchInput) {
      //   this.recordsToSubmit = await this.localService.getFilteredTimeRecords(this.searchInput, formattedweekStart, formattedweekEnd);
      //   this.recordsToSubmit.map((item) => { item.Charge_Type = item.Charge_Type ? item.Charge_Type : "";
      //   item.Import_Level = Enums.clarityStatus.Submitted; })
      //   this.submitTimeToDbcs(this.recordsToSubmit);
      // }
      // TODO: This Condition should be removed as we have commented submit button for advanced search
       if (this.advSearchBtnClicked) {
        this.advSearchObj['date_from'] = formattedweekStart;
        this.advSearchObj['date_to'] = formattedweekEnd;
        this.recordsToSubmit = await this.localService.advSearchOSCClarity(this.advSearchObj, 'false');
        this.recordsToSubmit = this.recordsToSubmit.filter((item) => { return item.isSubmitted == 'false' })
        this.recordsToSubmit.map((item) => { item.Charge_Type = item.Charge_Type ? item.Charge_Type : ""; });
        this.submitTimeToDbcs(this.recordsToSubmit);
      } 
      // TODO: This Condition should be removed as we have commented submit button for day view
       else if (this.dayBtnClicked) {
        this.recordsToSubmit = await this.localService.getTimeRows(formattedweekStart, formattedweekEnd);
        this.recordsToSubmit = this.recordsToSubmit.filter((item) => { return item.isSubmitted == 'false' })
        this.recordsToSubmit.map((item) => { item.Charge_Type = item.Charge_Type ? item.Charge_Type : ""; });
        this.submitTimeToDbcs(this.recordsToSubmit);
      } else {
        this.recordsToSubmit = await this.localService.getTimeRows(formattedweekStart, formattedweekEnd)
        this.recordsToSubmit = this.recordsToSubmit.filter((item) => { return item.isSubmitted == 'false' || item.Import_Level == Enums.clarityStatus.Saved })
        this.recordsToSubmit.map((item) => {
          item.Charge_Type = item.Charge_Type ? item.Charge_Type : "";
          item.Import_Level = Enums.clarityStatus.Submitted;
        });
        this.submitTimeToDbcs(this.recordsToSubmit);
      }

    } catch (error) {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'submitTime', ' Error in  submitTime: ' + JSON.stringify(error));
    }

  }
  async submitTimeToDbcs(recordsToSubmit) {
    try {
      this.utilityProvider.showSpinner();
      await this.localService.updateTimeSyncStatusOSC(recordsToSubmit, 'false');
      if (this.utilityProvider.isConnected()) {
        this.valueProvider.setSyncStatus("Submitted");
        if (recordsToSubmit.length > 0) {
          let success = await this.syncProvider.validateUserDeviceAndToken();
          if (success) {
            let res: any = await this.cloudService.submitTimeDbcs(this.transformProvider.changeTimeForMCS(Object.assign(Object.create(recordsToSubmit), recordsToSubmit)))
            if (res) {
              this.utilityProvider.stopSpinner();
              await this.localService.updateTimeSyncStatusOSC(recordsToSubmit, 'true',true);
              this.utilityProvider.presentToast(this.translate.instant(Enums.Messages.TimeSubmitSuccess), 4000, "top", "");
            } else {
              this.utilityProvider.presentToast(this.translate.instant(Enums.Messages.TimeSubmitError), 4000, "top", "");
              this.logger.log(this.fileName, 'submitTimeToDbcs', ' Error in  submitTimeToDbcs: ' + JSON.stringify(res.error));
            }
            this.loadDayWeekView();
          }
        }
        // this.loadDayWeekView();
      } else {
        this.utilityProvider.presentToast(this.translate.instant(Enums.Messages.TimeSubmitSuccess), 4000, "top", "");
        this.loadDayWeekView();
      }
    } catch (error) {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'submitTimeToDbcs', ' Error in  submitTimeToDbcs: ' + JSON.stringify(error));
    }
    finally {
      this.utilityProvider.stopSpinner();
    }
  }

  onShowPicker(event) {
    event.dayHoverHandler = this.utilityProvider.singleClickDaySelector(event, this.dp1, this.dp2);
  }
  getDurationOnDate() {
    let fromDate = moment(this.date_from).format("YYYY-MM-DD");
    let toDate = moment(this.date_to).format("YYYY-MM-DD");
    if (moment(fromDate).isAfter(toDate)) {
      this.date_to = this.date_from;
    }
  }
  setDayFromUserPref(dateVal?) {
    try {
      let selectedDayNumber = this.valueProvider.getUserPreferences()[0].STARTDAYOFWEEK ? this.getWeekDay(this.valueProvider.getUserPreferences()[0].STARTDAYOFWEEK) : 1;
      let date: any;
      moment.updateLocale('en', {
        week: { dow: selectedDayNumber, doy: 7 + selectedDayNumber - 1 }
      });
      if (dateVal) {
        date = moment(dateVal, 'DD-MMM-YYYY');
      }
      else {
        this.selectedDay = this.selectedDay ? this.selectedDay : moment().toDate();
        date = moment(this.selectedDay, 'DD-MMM-YYYY');
      }
      this.weekStart = moment(date.startOf('week')).format('DD-MMM-YYYY');
      this.weekEnd = moment(date.endOf('week')).format('DD-MMM-YYYY');
      if (this.valueProvider.getUserPreferences()[0].ListView == 'd') {
        this.weekBtnClicked = false;
        this.dayBtnClicked = true;
      } else {
        this.weekBtnClicked = true;
        this.dayBtnClicked = false;
      }
      let data = { weekStart: this.weekStart, weekEnd: this.weekEnd, dayBtnClicked: this.dayBtnClicked, weekBtnClicked: this.weekBtnClicked, advSearchBtnClicked: this.advSearchBtnClicked };
      this.events.publish('updatestartDay', data);
    }
    catch (error) {
      this.logger.log(this.fileName, "getDurationOnDate ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }

  editTime(time, date?) {
    if (this.utilityProvider.isNotNull(this.valueProvider.getUser().ClarityID)) {
      let wkStart;
      if (this.dayBtnClicked) {
        wkStart = this.selectedDay;
      }
      else if (this.advSearchBtnClicked && !this.weekBtnClicked) {
        wkStart = moment(time.EntryDate, "YYYY-MM-DD").format("DD-MMM-YYYY");
      }
      else {
        wkStart = this.weekStart;
      }
      this.appCtrl.getRootNav().setRoot("ClarityTimeEntryPage", { timeData: time, weekDayStart: wkStart, editClarity: true, date: date, editList: true });
    } else {
      this.appCtrl.getRootNav().setRoot("NonClarityEditTimeEntryPage", { timeData: time, weekBtnClicked: false, nonClarityPage: false, taskId: time.Job_No, delWeekStarts: false, delWeekEnds: false });
    }
  }

  /**
   *Shivansh Subnani 08/09/2019
   *Method to delete time entry if clicked ok
   * @param {*} time
   * @memberof DebriefTimeClaritylistPage
   */
  deleteTime(timeVal, entryDate?) {

    let alert = this.alertCtrl.create({
      title: this.translate.instant("Alert"),
      message: this.weekBtnClicked ? "You are about to delete the unsubmitted time entries associated with " + this.formatDate(this.weekStart) + " to " + this.formatDate(this.weekEnd) + " of the week. Are you sure you want to proceed?" : this.translate.instant(Enums.AlertMessage.LoseData),
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
            let time = timeVal;
            let allTimeIdsToDelete: any;
            if (entryDate) {
              if (entryDate == true || entryDate == 'true') {
                allTimeIdsToDelete = { StatusID: time.Task[0].StatusID, Job_Number: time.Job_Number, ProjectNumber: time.ProjectNumber, weekStart: moment(this.weekStart, "DD-MMM-YYYY").format("YYYY-MM-DD"), weekEnd: moment(this.weekEnd, "DD-MMM-YYYY").format("YYYY-MM-DD") }
              }
              else {
                allTimeIdsToDelete = { StatusID: time.Task[0].StatusID, Job_Number: time.Job_Number, ProjectNumber: time.ProjectNumber, weekStart: moment(entryDate, "DD-MMM-YYYY").format("YYYY-MM-DD") }
              }
              this.localService.deleteClarityTimeByProject(allTimeIdsToDelete).then((res) => {
                this.loadDayWeekView();
              })
            }
            else {
              allTimeIdsToDelete = time[0].Time_Id
              if (time.length) {
                for (let i = 0; i < time.length; i++) {
                  allTimeIdsToDelete = allTimeIdsToDelete + "," + time[i].Time_Id;
                }
                allTimeIdsToDelete = allTimeIdsToDelete.substring(1, allTimeIdsToDelete.length);
              }
              this.localService.deleteClarityTimeObject(allTimeIdsToDelete, undefined, time.StatusID).then((res) => {
                this.loadDayWeekView();
              })
            }
          }
        }
      ]
    });
    alert.present();
  }
  /**
       * Preeti Varshney 09/10/2019
       * get day name of the week
       */
  getWeekDay(dayName) {
    let arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return arr.indexOf(dayName);
  }
  /**
       * Preeti Varshney 09/10/2019
       * unsubcribe all events
       */
  ngOnDestroy() {
    this.events.unsubscribe('updatestartDay');
    this.events.unsubscribe('setWeekDay');
    this.events.unsubscribe('setWeekfromCal');
    this.events.unsubscribe('refreshListPage');
  }
  /**
       * Preeti Varshney 09/10/2019
       * clear Task, Overtime Code, Shift_Code on Project change.
       */
  clearFields(notToRemove?) {
    let obj = ['Job_Number', 'Clarity_Project', 'Field_Job_Name', 'Time_Code', 'Shift_Code', 'Work_Type', 'Charge_Method']
    if (notToRemove) {
      obj = obj.filter(function (el) {
        return notToRemove.indexOf(el) < 0;
      });
    }
    obj.forEach(element => {
      this.advSearchObj[element] = '';
    });
  }
  onDateFromChange(value: Date) {
    this.displayDateFrom = this.formatDate(value);
  }
  onDateToChange(value: Date) {
    this.displayDateTo = this.formatDate(value);
  }

  checkSubmittedEntries(response) {
    if (this.dayBtnClicked) {
      for (let i = 0; i < response.length; i++) {
        for (let k = 0; k < response[i].ClarityData.length; k++) {
          if (String(response[i].ClarityData[k].isSubmitted) === "false") {
            this.enableSubmit = true;
            break;
          }
        }
      }
    }
    else if (this.advSearchBtnClicked) {
      for (let i = 0; i < response.length; i++) {
        for (let z = 0; z < response[i].EntryDateTask.length; z++) {
          for (let k = 0; k < response[i].EntryDateTask[z].ClarityData.length; k++) {
            if (String(response[i].EntryDateTask[z].ClarityData[k].isSubmitted) === "false") {
              this.enableSubmit = true;
              break;
            }

          }
        }
      }
    } else {
      for (let i = 0; i < response.length; i++) {
        for (let k = 0; k < response[i].ClarityData.length; k++) {
          for (let j = 0; j < response[i].ClarityData[k].Task.length; j++) {
            if (String(response[i].ClarityData[k].Task[j].isSubmitted) === "false") {
              this.enableSubmit = true;
              break;
            }
          }
        }
      }
    }

  }
  /**Shivansh Subnani 12/2/2019
   * Method to prepopulate Project on the basis of job id
   *
   * @memberof ClarityTimelistPage
   */
  async setClarityProjectFromOSC() {
    try {
      let result: any = await this.localService.getClarityProject(this.advSearchObj.Job_Number);
      let projectID;
      if (result.length > 0) {
        this.advSearchObj.Clarity_Project = result[0].PROJECT;
        projectID = result[0].OSC_ID;
      } else {
        this.advSearchObj.Clarity_Project = '';
      }
      this.getFieldsByProject(projectID);
    } catch (e) {
      this.logger.log(this.fileName, "setClarityProjectFromOSC", e.message);
    }
  }

  
  /**
   * Mayur Varshney -- 12-17-2019 
   * Open Export time report modal page to export the detailed info of the current user in the form of CSV
   * @memberOf TimesheetClarityPage
   */
  newActivity() {
    let exportReportModal = this.utilityProvider.showModal("TimeReportModalPage",{weekStart:this.weekStart,weekEnd:this.weekEnd}, { enableBackdropDismiss: false, cssClass: 'TimeReportModalPage' });
    exportReportModal.onDidDismiss(data => {
      console.log(data);
    });
    exportReportModal.present().catch((err: any) => {
      this.logger.log(this.fileName, 'newActivity', 'Error in exportReportModal : ' + JSON.stringify(err));
    });
  }

  
  
}
