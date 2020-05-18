
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events, PopoverController } from 'ionic-angular';
import * as moment from "moment";
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { UtilityProvider } from '../../../providers/utility/utility';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../providers/logger/logger';

import { ValueProvider } from '../../../providers/value/value';
import { SearchPipe } from '../../../pipes/search/search';
import { CloudService } from '../../../providers/cloud-service/cloud-service';
import { TransformProvider } from '../../../providers/transform/transform';
import { DayWeekViewComponent } from '../../../components/day-week-view/day-week-view';
import * as Enums from '../../../enums/enums';
import { SubmitProvider } from '../../../providers/sync/submit/submit';
import { SyncProvider } from '../../../providers/sync/sync';
import { LocalServiceSdrProvider } from '../../../providers/local-service-sdr/local-service-sdr';


@IonicPage()
@Component({
  selector: 'page-time-nonclaritylist',
  templateUrl: 'time-nonclaritylist.html',
  providers: [DayWeekViewComponent]
})
export class TimeNonclaritylistPage {
  fileName: any = 'TimeNonclaritylistPage';
  Date: any;
  statusMsg: any;
  header_data: any;
  OutData: any = [];
  days: any = [];
  taskInput: string = '';
  public timeRows: Array<any> = [];
  public dayRow: Array<any> = [];
  groupByTask: any = [];
  groupByDay: any = [];
  public weekStart: any;
  public weekEnd: any;
  projectList: any = [];
  advSearchBtnClicked: boolean = false;
  listPage: boolean = true;
  noclistPage: boolean = true;
  selectedDay: any;
  dayBtnClicked: boolean = false;
  weekBtnClicked: boolean = true;
  importListBtnClicked: boolean = false;
  noRecordFound: boolean = false;
  // save: any;
  date_to: any;
  date_from: any;
  jobId: any = '';
  activity_name: any = '';
  item: any = '';
  activityNameList: any;
  shiftCodesList: any;
  private timeData: Array<any> = [];
  submitTimeArr: any = [];
  listPageNonClarity: boolean = true;
  @ViewChild('dp') dp1: BsDatepickerDirective;
  @ViewChild('dps') dp2: BsDatepickerDirective;
  submitDisabled: boolean;
  toggleAllaccordion: boolean;
  datepickerConfig: Partial<BsDatepickerConfig>;
  minDate: Date = new Date(new Date().setDate(new Date().getDate() - 90));
  searchData = [];
  searchFilter: boolean;
  sendData = [];
  dateFormatUserPref: any = "";
  advSearchObj: any = {};
  oscNonCLovs: any = {};
  items: any = {};
  // Enums: any = Enums;
  enums: any = {};
  recordExists: boolean = false;
  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public cloudService: CloudService,
    public appCtrl: App, public utilityProvider: UtilityProvider, public localService: LocalServiceProvider, public logger: LoggerProvider,
    public valueProvider: ValueProvider, public popoverCtrl: PopoverController, public searchPipe: SearchPipe,
    public transformProvider: TransformProvider, public dayWeekViewComp: DayWeekViewComponent, public submitProvider: SubmitProvider,
    public syncProvider: SyncProvider, private localServiceSdr: LocalServiceSdrProvider) {
    this.enums = Enums;
    if(this.valueProvider.isNonOSCNonClarityUser()){
      this.header_data = { title1: "", title2: "Timesheet", taskId: "" };
    }
    else{
      this.header_data = { title1: "", title2: "Timesheet Non-Clarity", taskId: "" };
    }
    this.Date = new Date();
    this.date_to = new Date();
    this.date_from = new Date();
    this.valueProvider.TotalHours = 0;
    this.selectedDay = moment().toDate();
  }

  ionViewDidEnter() {
    // Preeti Varshney 04/26/2019 expand All is false initially
    //this.toggleAllaccordion = false;
    this.events.publish('user:created', "Time");
    this.setDayFromUserPref();
    if (this.advSearchBtnClicked) {
      this.weekBtnClicked = false;
    }
    /**
* Preeti Varshney 09/12/2019
* Change the Date format from User Preference
*/
    if (this.valueProvider.getUserPreferences()[0].Date_Format) {
      if (this.valueProvider.getUserPreferences()[0].Date_Format == 'mm-dd-yyyy') {
        this.dateFormatUserPref = 'MM-dd-yyyy';
      }
      else {
        this.dateFormatUserPref = 'dd-MMM-yyyy';
      }
    }
    else {
      this.dateFormatUserPref = 'dd-MMM-yyyy';
    }
  }
  /**
* Preeti Varshney 09/12/2019
* Move All the events to ionViewDidLoad
*/
  ionViewDidLoad() {
    this.events.subscribe('setWeekDay', (data) => {
      switch (data.type) {
        case 'setWeekStart':
        case 'setWeekEnd':
          if (data.weekStart) {
            this.weekStart = data.weekStart;
          }
          if (data.weekEnd) {
            this.weekEnd = data.weekEnd;
          }
          // Preeti Varshney 04/26/2019 expand All is false initially
          this.toggleAllaccordion = false;
          this.getTimeRows();
          break;
        case 'setPreviusDay':
        case 'setNextDay':
          this.selectedDay = data.selectedday;
          // Preeti Varshney 04/26/2019 expand All is false initially
          this.toggleAllaccordion = false;
          this.getDayTimeRows();
          break;
        case 'showDayWise':
          this.selectedDay = data.selectedday;
          this.weekBtnClicked = data.weekBtnClicked;
          this.dayBtnClicked = data.dayBtnClicked;
          if (data.weekStart) {
            this.weekStart = data.weekStart;
          }
          if (data.weekEnd) {
            this.weekEnd = data.weekEnd;
          }
          // Preeti Varshney 04/26/2019 expand All is false initially
          this.toggleAllaccordion = false;
          this.loadDayWeekView();
          break;
        case 'showWeekWise':
          this.weekBtnClicked = data.weekBtnClicked;
          this.dayBtnClicked = data.dayBtnClicked;
          if (data.weekStart) {
            this.weekStart = data.weekStart;
          }
          if (data.weekEnd) {
            this.weekEnd = data.weekEnd;
          }
          // Preeti Varshney 04/26/2019 expand All is false initially
          this.toggleAllaccordion = false;
          this.getTimeRows();
          break;
        case 'advSearchBtn':
          this.projectList = [];

          this.advSearchBtnClicked = data.advSearchBtnClicked;
          this.dayBtnClicked = data.dayBtnClicked;
          this.weekBtnClicked = data.weekBtnClicked;
          if (this.taskInput) {
            this.taskInput = '';
            this.events.publish('clearSearchBox');
          }
          // Preeti Varshney 04/26/2019 expand All is false initially
          this.toggleAllaccordion = false;
          if (this.advSearchBtnClicked == false) {

            this.closeAdvancedSearch();
            if (this.taskInput) {
              this.taskInput = '';
              this.events.publish('clearSearchBox');
            }
          }


          break;
        case 'searchJobid':
          this.taskInput = data.taskInput;
          this.setFullLimit({ Job_Number: this.taskInput });
          break;
        case 'deleteTimeEntry':
          this.loadDayWeekView();
          break;
        default:
          this.valueProvider.TotalHours = 0;
          break;
      }
    });
    this.events.subscribe('setWeekfromCal', (data) => {
      if (data.weekStart) {
        this.weekStart = data.weekStart;
      }
      if (data.weekEnd) {
        this.weekEnd = data.weekEnd;
      }
      this.selectedDay = data.selectedDay;
      // Preeti Varshney 04/26/2019 expand All is false initially
      this.toggleAllaccordion = false;
      if (data.isChange) {
        if (this.weekBtnClicked == true) {
          this.getTimeRows();
        }
        else {
          this.getDayTimeRows();
        }
      }
    });
    this.events.subscribe('refreshListPage', (data) => {
      this.loadDayWeekView();
      // Preeti Varshney 08/28/2019 expand All is false initially
      this.toggleAllaccordion = false;
    });
    this.getActivityName();
    this.getShiftCodes();
    this.getActivityLovs();
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
    this.tsTotalHours();
  }
  /**
    * Preeti Varshney 03/12/2019
    * get time rows from time table using start date and end date
    */
  getTimeRows() {
    if (this.taskInput) {
      this.taskInput = '';
      this.events.publish('clearSearchBox');
    }
    this.utilityProvider.showSpinner();
    this.projectList = [];
    let formattedweekStart = moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    let formattedweekEnd = moment(this.weekEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    this.localService.getNonClarityTimeRows(formattedweekStart, formattedweekEnd).then((response: any[]) => {
      if (response.length > 0) {
        console.log("RESAfter", response);
        for (let i = 0; i < response.length; i++) {
          if (response[i].Charge_Method == null) {
            response[i].Charge_Method = ""
          }
          if (response[i].Work_Type_OT == null) {
            response[i].Work_Type_OT = ""
          }
          if (response[i].SerialNumber == null) {
            response[i].SerialNumber = ""
          }
          if (response[i].TagNumber == null) {
            response[i].TagNumber = ""
          }
          if (response[i].Item == null) {
            response[i].Item = ""
          }
        }
        console.log("RESAfter", response);
        this.timeRows = response;
        this.groupByTask = this.utilityProvider.groupBy(this.timeRows, function (item) {
          return [item.Task_Number, item.Work_Type, item.Work_Type_OT, item.Item, item.SerialNumber, item.TagNumber, item.Charge_Method];
        });
        this.groupByTask.forEach((task, index) => {
          let totalDuration = {};
          let innerInitialTimeEntry = this.getInitialTimeEntry(task);
          this.utilityProvider.cloneDuration = '';
          if (task.length > 1) {
            task.forEach((item) => {
              if (totalDuration[item.EntryDate]) {
                this.utilityProvider.cloneDuration = totalDuration[item.EntryDate];
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
          this.groupByTask[index].ModifiedTime = innerInitialTimeEntry;
        })
        this.groupByTask.sort((a, b) => (a.ModifiedTime < b.ModifiedTime) ? -1 : 1)
        this.groupByTimeEntries();
        //this.filterData();
        this.checkStatus()
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

  /**
    * Preeti Varshney 04/02/2019
    * calculate Total hours of all projects in a week.
     */
  tsTotalHours() {
    this.utilityProvider.cloneDuration = "";
    this.valueProvider.setTotalHours(null);
    this.valueProvider.TotalHours = 0;
    for (let i = 0; i < this.projectList.length; i++) {
      this.valueProvider.setTotalHours(this.utilityProvider.totalHours(this.projectList[i].totalDuration));
    }
  }
  /**
    * Preeti Varshney 03/12/2019
    * expand the project to show the details of project
   */
  expandItem(item) {
    /**
  * Preeti Varshney 04/26/2019
  * change the functionality of expand
  */
    this.projectList.map((listItem) => {
      if (item == listItem) {
        if (item.expanded == true) {
          listItem.expanded = false;
        }
        else {
          listItem.expanded = true;
        }
      }
      return listItem;
    });
    this.checkExpandAll();

  }
  /**
    * Preeti Varshney 03/12/2019
    * Check If all are expanded or not
    */
  checkExpandAll() {
    for (let i = 0; i < this.projectList.length; i++) {
      if (this.projectList[i].expanded == false) {
        this.toggleAllaccordion = false;
        return;
      }
      else {
        this.toggleAllaccordion = true;
      }
    }
  }
  importList() {
    // Preeti Varshney 04/26/2019 expand All is false initially
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
          let st_date = sdate.startOf('isoWeek');
          let en_date = edate.endOf('isoWeek');
          WeekStart = moment(st_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
          WeekEnd = moment(en_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        }
        else {
          WeekStart = response[0].EntryDate;
          WeekEnd = response[0].EntryDate;
        }
        // Preeti Varshney 04/25/2019 added the check on import time entry (only import time-entry that is before the present date)
        let importCheckDate = this.dayBtnClicked ? moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD') : moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD');
        if (moment(response[0].EntryDate).isBefore(importCheckDate)) {
          this.getLastWeekTimeRows(WeekStart, WeekEnd);
        }
        else {
          setTimeout(() => {
            this.utilityProvider.presentToast("No entries found", 2000, 'top', '');
          }, 1000);
        }
      } else {
        setTimeout(() => {
          this.utilityProvider.presentToast("No entries found", 2000, 'top', '');
        }, 1000);
      }
    }).catch((error: any) => {

      this.logger.log(this.fileName, 'importList', ' Error in lastWeekentryDate : ' + JSON.stringify(error));
    });
    this.importListBtnClicked = true;
  }

  /**
   *@Prateek 04/04/2019
   *Import previous week time entry
   */
  getLastWeekTimeRows(formattedweekStart, formattedweekEnd) {
    let isOSCNonClarity = true;
    if (!this.valueProvider.isOSCUser() && !this.valueProvider.getUser().ClarityID) {
      isOSCNonClarity = false;
    }
    this.localService.getNonClarityTimeRows(formattedweekStart, formattedweekEnd, isOSCNonClarity).then((response: any[]) => {
      this.utilityProvider.showSpinner();
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
          entry['Task_Number'] = entry.Primary_Key;
          entry['Original'] = null;
          entry['EntryDate'] = this.weekBtnClicked ? moment(importedDate, 'DD-MMM-YYYY').format('YYYY-MM-DD') : moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD');
          entry['isPicked'] = entry.Job_Type == "vacation" ? null : "true",
            delete entry['Time_Id'];
          dataObject.push(entry);
        });
        this.localServiceSdr.insertOrUpdateTimeSheetData(dataObject, false, 'TIME').then((res: any) => {
          if (res) {
            this.loadDayWeekView();
            this.utilityProvider.stopSpinner();
          }
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'getLastWeekTimeRows', ' Error in insertTimeBatch : ' + JSON.stringify(error));
        })
      }
      else {
        this.utilityProvider.stopSpinner();
        setTimeout(() => {
          this.utilityProvider.presentToast("No entries found", 2000, 'top', '');
        }, 1000);
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getLastWeekTimeRows', ' Error in getNonClarityTimeRows : ' + JSON.stringify(error));
    });
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
  /**
   *@author: Preeti Varshney 04/03/2019
   *Fetch time row according to day.
   */
  getDayTimeRows() {
    if (this.taskInput) {
      this.taskInput = '';
      this.events.publish('clearSearchBox');
    }
    this.utilityProvider.showSpinner();
    this.projectList = [];
    let formattedweekStart = moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    let formattedweekEnd = moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    this.localService.getNonClarityTimeRows(formattedweekStart, formattedweekEnd).then((response: any[]) => {
      if (response.length > 0) {
        this.dayRow = response;
        for (let i = 0; i < this.dayRow.length; i++) {
          this.dayRow[i].Date = new Date(moment(this.dayRow[i].EntryDate, 'YYYY-MM-DD').format('YYYY/MM/DD'));
          this.dayRow[i].expanded = false;
          this.dayRow[i].totalDuration = this.dayRow[i].Duration;
          this.dayRow[i].Task_Number = this.dayRow[i].Primary_Key;
          // if (this.dayRow[i].Original) {
          //   this.dayRow[i].Original = 'true';
          // }
          if ((this.dayRow[i].StatusID == Enums.Jobstatus.Debrief_In_Progress && this.dayRow[i].IsAdditional == "false") ||
            (this.dayRow[i].StatusID == Enums.Jobstatus.Debrief_Declined && (this.dayRow[i].Sync_Status == "true" || this.dayRow[i].Original)) ||
            (this.dayRow[i].StatusID == Enums.Jobstatus.Completed_Awaiting_Review) || this.dayRow[i].Sync_Status == "true") {
            this.dayRow[i].DisableDelete = true;
          } else {
            this.dayRow[i].DisableDelete = false;
          }
          this.dayRow[i].cssClass = this.checkAccordionClass(this.dayRow[i].Job_Type);
        }
        this.projectList = this.dayRow;
        this.tsTotalHours();
        this.checkStatus(); // 15-MAY-2019
      }
      this.utilityProvider.stopSpinner();
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getDayTimeRows', ' Error in getNonClarityTimeRows : ' + JSON.stringify(error));
    });
  }

  onShowPicker(event) {
    event.dayHoverHandler = this.utilityProvider.singleClickDaySelector(event, this.dp1, this.dp2);
  }
  /**
   *@Prateek 04/03/2019
   *Group time entries and prepare array to show on list page
   * @memberof TimeNonclaritylistPage
   */
  groupByTimeEntries() {
    this.projectList = [];
    let weekstart = moment(this.weekStart, 'DD-MMM-YYYY');
    this.groupByTask.forEach(element => {
      let daysData: any = {};
      this.utilityProvider.cloneDuration = '';
      this.days = [];
      daysData.totalDuration = "";
      let isAdditional = 'false';
      let Original = 'true';
      let Sync_Status = 'true';
      let isSubmitted = 'true'
      let disableDelete;
      let deleteTimeids = [];
      for (let i = 0; i < 7; i++) {
        let dayid = i + 1;
        let entryDate = moment(weekstart, 'DD-MMM-YYYY');
        let dayName = moment(weekstart, 'DD-MMM-YYYY').format("ddd");
        let formattedentryDate = moment(weekstart, 'YYYY-MM-DD').format('YYYY-MM-DD');
        element.forEach(ele => {
          if (ele.EntryDate == formattedentryDate) {
            daysData.duration = ele.TotalDuration ? ele.TotalDuration : ele.Duration
            daysData.totalDuration = this.utilityProvider.totalHours(ele.Duration)
            daysData.startTime = ele.Start_Time
            daysData.endTime = ele.End_Time
            daysData.notes = ele.Comments
            daysData.Time_Id = ele.Time_Id
            daysData.DB_Syncstatus = ele.DB_Syncstatus
            daysData.Date = ele.Date
            deleteTimeids.push(ele.Time_Id);
            if (ele.isSubmitted == 'false' || !ele.isSubmitted) {
              daysData.isSubmitted = 'false';
            }
            daysData.Job_Type = ele.Job_Type ? ele.Job_Type : ""
          }
          if (isAdditional == 'false' && (ele.IsAdditional == 'true')) {
            isAdditional = 'true';
          }
          if (Sync_Status == 'true' && (ele.Sync_Status == "false")) {
            Sync_Status = 'false';
          }
          if (isSubmitted == 'true' && (ele.isSubmitted == "false")) {
            isSubmitted = "false";
          }
          if ((ele.StatusID == Enums.Jobstatus.Debrief_In_Progress && ele.IsAdditional == "false") ||
            (ele.StatusID == Enums.Jobstatus.Debrief_Declined && (ele.Sync_Status == "true" || ele.Original)) ||
            (ele.StatusID == Enums.Jobstatus.Completed_Awaiting_Review) || ele.Sync_Status == "true") {
            ele.DisableDelete = true;
          } else {
            ele.DisableDelete = false;
          }
        });
        disableDelete = element.filter(item => item.DisableDelete == false).length == 0;
        this.days.push({
          'dayid': dayid,
          'entryDate': entryDate,
          'dayName': dayName,
          'duration': daysData.duration ? daysData.duration : "",
          'notes': daysData.notes ? daysData.notes : "",
          'startTime': daysData.startTime ? daysData.startTime : "",
          'endTime': daysData.endTime ? daysData.endTime : "",
          "Time_Id": daysData.Time_Id ? daysData.Time_Id : "",
          "Group_Id": element[0].Time_Id,
          "DB_Syncstatus": daysData.DB_Syncstatus,
          "Job_Type": daysData.Job_Type,
          "Date": daysData.Date,
          "isSubmitted": daysData.duration ? (daysData.isSubmitted == 'false' ? 'false' : 'true') : ''
        });
        weekstart = moment(weekstart, 'DD-MMM-YYYY').add(1, 'days');
        daysData.duration = "";
        daysData.startTime = "";
        daysData.endTime = "";
        daysData.notes = "";
        daysData.Time_Id = "";
        daysData.DB_Syncstatus = "";
        daysData.Job_Type = "";
        daysData.isSubmitted = "";
      }
      //Pulkit 05/30/2019- Null Job Type issue fixes
      let jobType = {};
      // let IsSubmitted = 'true';
      let newJobType = "field";
      this.days.forEach(val => {
        if (val.Job_Type) {
          jobType[val.Job_Type] ? jobType[val.Job_Type]++ : jobType[val.Job_Type] = 1
        }
        // if (val.isSubmitted == 'false' && isSubmitted) {
        //   IsSubmitted = 'false';
        // }
      });
      if (Object.keys(jobType).length == 1) {
        newJobType = Object.keys(jobType)[0]
      }
      this.days.forEach((val, index) => {
        if (!val.Job_Type) {
          this.days[index].Job_Type = newJobType;
        }
      });
      let jsonObj = {
        "Primary_Key": element[0].Primary_Key,
        "Group_Id": element[0].Time_Id,
        "Charge_Method": element[0].Charge_Method,
        "Charge_Method_Id": element[0].Charge_Method_Id,
        "Work_Type": element[0].Work_Type,
        "Work_Type_Id": element[0].Work_Type_Id,
        "Work_Type_OT": element[0].Work_Type_OT,
        "Item": element[0].Item,
        "Item_Id": element[0].Item_Id,
        "Description": element[0].Description,
        "Time_Code": null,
        "Shift_Code": null,
        "Comments": null,
        "expanded": false,
        "Start_Time": element[0].Start_Time,
        "End_Time": element[0].End_Time,
        "SerialNumber": element[0].SerialNumber,
        "TagNumber": element[0].TagNumber,
        //"DB_Syncstatus": element[0].DB_Syncstatus,
        "Job_Number": element[0].Job_Number,
        "Job_Type": element[0].Job_Type,
        "totalDuration": daysData.totalDuration,
        "Service_End_Date": element[0].Service_End_Date,
        "Service_Start_Date": element[0].Service_Start_Date,
        "ModifiedDate": element[0].ModifiedDate,
        "OracleDBID": element[0].OracleDBID,
        "Task_Number": element[0].Primary_Key,
        "isSubmitted": isSubmitted,
        "StatusID": element[0].StatusID,
        "length": element.length,
        "days": this.days,
        "isPicked": element[0].isPicked,
        "isAdditional": isAdditional,
        "DisableDelete": disableDelete,
        "Sync_Status": Sync_Status,
        "Date": daysData.Date,
        "DeleteTimeIds": deleteTimeids
      }
      weekstart = moment(this.weekStart, 'DD-MMM-YYYY');
      jsonObj["cssClass"] = this.checkAccordionClass(jsonObj.Job_Type);
      this.projectList.push(jsonObj);
    });
    this.tsTotalHours();
  }


  setFullLimit(criteria) {
    let time;
    this.submitDisabled = true;
    time = this.searchPipe.transform(this.projectList, criteria);
    this.utilityProvider.cloneDuration = "";
    if (time.length > 0) {
      this.searchFilter = true;
      this.searchData = time;
      for (let i = 0; i < time.length; i++) {
        this.valueProvider.setTotalHours(this.utilityProvider.totalHours(time[i].totalDuration));
      }
      for (let i = 0; i < time.length; i++) {
        if (!time[i].isSubmitted || time[i].isSubmitted == "false") {
          this.submitDisabled = false;
          return;
        }
      }
    }
    else {
      this.valueProvider.setTotalHours('')
    }
  }

  /**
  * Preeti Varshney 03/12/2019
  * open popover to delete or edit entry
  */
  openEditDeletePopOver(myEvent, timeData) {
    this.utilityProvider.closeFab();
    try {
      this.timeData = timeData.days ? timeData.days : [timeData.timeId];
      let params = { userPopOver: true, nonClarityPage: true, totalDuration: timeData.totalDuration, timeData: timeData, weekBtnClicked: this.weekBtnClicked, delWeekStarts: this.weekStart, delWeekEnds: this.weekEnd };
      let userPopOver = this.popoverCtrl.create('PopoverEditDeletePage', params, { enableBackdropDismiss: true, cssClass: 'PopoverEditDeletePage' });
      userPopOver.present({
        ev: myEvent
      });
    } catch (error) {
      this.logger.log(this.fileName, 'openEditDeletePopOver', ' Error in popoverCtrl : ' + JSON.stringify(error));
    }
  }
  editDeleteTime(timeData) {
    try {
      this.timeData = timeData.days ? timeData.days : [timeData.timeId];
      let params = { userPopOver: true, nonClarityPage: true, totalDuration: timeData.totalDuration, timeData: timeData, weekBtnClicked: this.weekBtnClicked, delWeekStarts: this.weekStart, delWeekEnds: this.weekEnd, vac: false };
      if (this.weekBtnClicked && !this.advSearchBtnClicked) {
        this.navCtrl.push("OscNoncTimeEditPage", params)
      }
      else {
        let param;
        param = { timeData: timeData, taskId: timeData.Job_Number, isEditMode: true, isListPage: true, dayEdit: true, vac: false };
        this.navCtrl.push("OSCNonCTimeEntryPage", param)
      }
      //let userPopOver = this.popoverCtrl.create('PopoverEditDeletePage', params, { enableBackdropDismiss: true, cssClass: 'PopoverEditDeletePage' });
    } catch (error) {
      this.logger.log(this.fileName, 'editDeleteTime', ' Error : ' + JSON.stringify(error));
    }
  }
  /* Narasimha (04/12/2019)
  *  Delete functionality implementation
  */
  deleteFromAcordion(timeData, statusID) {

    this.timeData = timeData.days ? timeData.days : [timeData.Time_Id];
    let alertMessage = "";
    if (this.weekBtnClicked == true) {
      alertMessage = "You are about to delete the time entries associated with " + this.weekStart + " to " + this.weekEnd + " of the week. Are you sure you want to proceed?";
      //alertMessage = "You are about to delete the week from " + this.weekStart + " to " + this.weekEnd + ". Are you sure?";
    } else {
      alertMessage = "Are you sure you want to Delete this time entry?";
    }
    let alert = this.utilityProvider.confirmationAlert('Alert', alertMessage);
    alert.present();
    alert.onDidDismiss((response) => {
      if (response) {
        this.deleteTimeEntries(statusID,timeData);
      }
    });
  }

  deleteTimeEntries(statusid,timeData?) {

    try {
      this.toggleAllaccordion = false;
      var timeIds = [];
      if (this.timeData.length == 7) {
        if (!this.valueProvider.getUser().ClarityID && this.valueProvider.isOSCUser()) {
          timeIds = timeData.DeleteTimeIds;
        } else {
          timeIds = this.timeData.map(time => time.Time_Id).filter(time => (time !== "" && time !== undefined));
        }
        
        // timeIds = this.timeData.map(time => time.Time_Id).filter(time => (time !== "" && time !== undefined));
      } else {
        timeIds = this.timeData;
      }
      if (timeIds) {
        this.localService.deleteBulkTimeObject(timeIds, statusid).then((response: any) => {
          console.log("DELETE RESPONSE", response);
          if (response)
            this.loadDayWeekView()
        })
      }
    } catch (error) {
      this.logger.log(this.fileName, "deleteTimeEntries", "Error: " + JSON.stringify(error));
    }
  }

  loadDayWeekView() {
    try {
      if (this.dayBtnClicked && !this.advSearchBtnClicked) {
        this.getDayTimeRows();
      }
      else if (this.advSearchBtnClicked) {
        this.advanceSearchApply('false');
      }
      else {
        this.getTimeRows();
      }
    } catch (error) {
      this.logger.log(this.fileName, "loadDayWeekView", "Error: " + JSON.stringify(error));
    }
  }

  /**
   *@author: Prateek
   *Submit time to ATP in offline/online scenerios.
   *Changing DB_Syncstatus to true after submission.
   */
  async submitTime() {
    try {
      let formattedweekStart;
      let formattedweekEnd;
      let dataToSubmitt;
      if (this.dayBtnClicked) {
        formattedweekStart = moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD');
        formattedweekEnd = moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD');
      } else {
        formattedweekStart = moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD');
        formattedweekEnd = moment(this.weekEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD');
      }
      if (this.searchFilter && this.taskInput) {
        dataToSubmitt = await this.localService.getFilteredTimeRecords(this.taskInput, formattedweekStart, formattedweekEnd);
        dataToSubmitt.map((item) => { item.Charge_Type = item.Charge_Type ? item.Charge_Type : ""; });
      }
      else {
        if (this.advSearchBtnClicked) {
          dataToSubmitt = this.projectList;
          dataToSubmitt = dataToSubmitt.filter((item) => { return item.isSubmitted == 'false' })
          dataToSubmitt.map((item) => { item.Charge_Type = item.Charge_Type ? item.Charge_Type : ""; });
        } else {
          dataToSubmitt = await this.localService.getTimeEntry(formattedweekStart, formattedweekEnd);
          dataToSubmitt.map((item) => { item.Charge_Type = item.Charge_Type ? item.Charge_Type : ""; });
        }
      }
      this.submitTimeATP(dataToSubmitt);
    } catch (error) {
      this.logger.log(this.fileName, 'submitTime', ' Error in  submitTime: ' + JSON.stringify(error));
    }
  }

  /**
   *Prateek 05/21/2019
   *Get time entries to submit to dbcs.
   */


  /**
   *@ Prateek 05/21/2019
   * Submit time entries and update sync status to dbcs.
   */
  // submitTimeDbcs(resp) {
  //   let issubmit;
  //   //Prateek 05/23/2019 Check for search time entries and send data accordingly.
  //   if (this.searchFilter && this.weekBtnClicked) {
  //     for (let j = 0; j < resp.length; j++) {
  //       for (let i = j; i < resp[j].days.length; i++) {
  //         if (resp[j].days[i].Time_Id != "" && resp[j].days[i].isSubmitted == "false") {
  //           let data = resp[j].days[i].Time_Id;
  //           this.sendData.push(data)
  //         }
  //       }
  //     }
  //     let data = this.sendData.toString();
  //     this.localService.getSearchTimeEntry(data).then((res: any) => {
  //       if (res.length > 0) {
  //         resp = res;
  //       }
  //     }).catch((error) => {
  //       this.utilityProvider.stopSpinner();
  //       this.logger.log(this.fileName, 'submitTimeDbcs', ' Error in  getSearchTimeEntry : ' + JSON.stringify(error));

  //     });
  //   }
  //   return new Promise((resolve, reject) => {
  //     issubmit = 'false';
  //     this.localService.updateTimeSyncStatus(resp, issubmit).then(() => {
  //       //console.log("RESPONSE", resp);
  //       if (resp.length > 0) {
  //         this.valueProvider.setSyncStatus("Submitted");
  //         this.utilityProvider.showSpinner();
  //         if (this.advSearchBtnClicked) {
  //           this.advanceSearchApply('false')
  //         }
  //         this.cloudService.submitTimeDbcs(this.transformProvider.changeTimeForMCS(Object.assign(Object.create(resp), resp))).then((res: any) => {
  //           if (res.message == "Time record inserted/updated successfully") {
  //             this.utilityProvider.stopSpinner();
  //             issubmit = 'true';
  //             this.localService.updateTimeSyncStatus(resp, issubmit).then(() => {
  //               resolve(true);
  //               this.statusMsg = this.valueProvider.getSyncStatus();
  //               if (this.searchFilter) {
  //                 this.taskInput = "";
  //                 this.searchFilter = false;
  //               }
  //               this.submitDisabled = true;
  //               this.toggleAllaccordion = false;
  //               this.loadDayWeekView();
  //             }).catch((error) => {
  //               this.logger.log(this.fileName, 'submitTimeDbcs', ' Error in updateTimeSyncStatus : ' + JSON.stringify(error));
  //               resolve(false);
  //             });
  //           }
  //           else {
  //             this.utilityProvider.stopSpinner();
  //           }
  //         }).catch((error) => {
  //           this.utilityProvider.stopSpinner();
  //           this.logger.log(this.fileName, 'submitTimeDBCS', ' Error in submitTimeDBCS : ' + JSON.stringify(error));
  //           resolve(false);
  //         });
  //       }
  //     }).catch((error) => {
  //       this.utilityProvider.stopSpinner();
  //       this.logger.log(this.fileName, 'submitTimeDbcs', ' Error in updateTimeSyncStatus : ' + JSON.stringify(error));
  //       resolve(false);
  //     });

  //   })
  // }

  async submitTimeATP(resp) {
    let message;
    try {
      this.utilityProvider.showSpinner();
      await this.localService.updateTimeSyncStatusOSC(resp, 'false');
      if (this.utilityProvider.isConnected()) {
        if (this.syncProvider.isAutoSyncing) {
          this.submitProvider.savePendingTimeRecords();
          sessionStorage.setItem("getPendingOperations", 'true');
          message = Enums.Messages.TimeSubmitSuccess;
        } else {
          let result = await this.syncProvider.validateUserDeviceAndToken();
          if (result) {
            await this.submitProvider.submitPendingTimeEntries(Object.assign(Object.create(resp), resp));
            message = Enums.Messages.TimeSubmitSuccess;
          } else {
            message = Enums.Messages.TimeSubmitError;
          }
        }
      } else {
        message = Enums.Messages.TimeSubmitSuccess;
      }
    } catch (error) {
      this.logger.log(this.fileName, 'submitTimeToDbcs', ' Error in  submitTimeToDbcs: ' + JSON.stringify(error));
      message = Enums.Messages.TimeSubmitError;
    } finally {
      this.loadDayWeekView();
      // Preeti Varshney 11/06/2019 expand All is false initially
      this.toggleAllaccordion = false;
      this.utilityProvider.stopSpinner();
      this.utilityProvider.presentToast(message, 4000, "top", "");
    }
  }

  filterData() {
    for (let i = 0; i < this.timeRows.length; i++) {
      if (this.timeRows[i].isSubmitted == "false") {
        this.valueProvider.setSyncStatus("Saved");
        this.statusMsg = this.valueProvider.getSyncStatus();
        this.submitDisabled = true;
        return;
      }
      else {
        this.valueProvider.setSyncStatus("Submitted");
        this.statusMsg = this.valueProvider.getSyncStatus();
        this.submitDisabled = false;
      }
    }
  }

  //By Vivek On 17 April 2019
  advanceSearchApply(issubmit) {
    // Preeti Varshney 04/26/2019 expand All is false initially
    this.projectList.length = 0;
    this.projectList = [];
    this.toggleAllaccordion = false;
    let formattedweekStart = moment(this.date_from, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    let formattedweekEnd = moment(this.date_to, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    this.advSearchObj.date_from = formattedweekStart;
    this.advSearchObj.date_to = formattedweekEnd;
    this.localService.advanceSearch(this.advSearchObj, issubmit).then((response: any) => {
      if (response.length > 0) {
        this.noRecordFound = false;
        this.dayBtnClicked = true;
        this.weekBtnClicked = false;
        for (let i = 0; i < response.length; i++) {
          response[i].Date = new Date(moment(response[i].EntryDate, 'YYYY-MM-DD').format('YYYY/MM/DD'));
          response[i].AdvDate = new Date(moment(response[i].EntryDate, 'YYYY-MM-DD').format('YYYY/MM/DD'));
          response[i].expanded = false;
          response[i].totalDuration = response[i].Duration;
          response[i].Task_Number = response[i].Primary_Key ? response[i].Primary_Key.toString() : response[i].Primary_Key;

          if ((response[i].StatusID == Enums.Jobstatus.Debrief_In_Progress && response[i].IsAdditional == "false") ||
            (response[i].StatusID == Enums.Jobstatus.Debrief_Declined && (response[i].Sync_Status == "true" || response[i].Original)) ||
            (response[i].StatusID == Enums.Jobstatus.Completed_Awaiting_Review) || response[i].Sync_Status == "true") {
            response[i].DisableDelete = true;
          } else {
            response[i].DisableDelete = false;
          }
          response[i].cssClass = this.checkAccordionClass(response[i].Job_Type);
        }
        this.projectList = response;
        this.tsTotalHours();
        this.checkStatus();
        // if (issubmit == "true") {
        //   this.submitTimeATP(response)
        // }
      } else {
        this.noRecordFound = true;
      }

    }).catch((error: any) => {
      this.logger.log(this.fileName, 'advanceSearchApply', ' Error in advanceSearch : ' + JSON.stringify(error));
    });
  }

  searchModal(key, val) {
    if (this.oscNonCLovs.length > 0) {
      this.getActivityLovs();
    }
    let dataArray: any = [];
    let searchModal;
    if (this.valueProvider.getResourceId() != '0' && this.valueProvider.getUser().ClarityID == '') {
      dataArray = (this.oscNonCLovs[key] && this.oscNonCLovs[key].length > 0) ? this.oscNonCLovs[key] : [];
      searchModal = this.utilityProvider.showModal("TimesheetDropdownPage", { dataSource: dataArray, type: 'oscNcData', ddValue: val }, { enableBackdropDismiss: false, cssClass: 'cssSearchModalPage' });
    }
    else {
      switch (key) {
        case 'Work_Type':
          dataArray = this.activityNameList;
          break;
        case 'Item':
          dataArray = this.shiftCodesList;
          break;
        default:
          break;
      }
      searchModal = this.utilityProvider.showModal("TimesheetDropdownPage", { dataSource: dataArray, type: 'nonOscNC', ddValue: val }, { enableBackdropDismiss: false, cssClass: 'cssSearchModalPage' });
    }


    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data) {
        this.advSearchObj[key] = data.LookupValue;
      }
      if (key == 'Work_Type') {

        let key;
        let id = data.ID.toString();
        this.advSearchObj.Item = '';
        switch (parseInt(id)) {
          case Enums.WorkType.Labour:
            key = "Others";
            this.oscNonCLovs.Item = this.items.Item.filter(item => {
              return item.Type == key;
            });
            this.oscNonCLovs.Item.unshift({ "ID": -2, "Value": "No Value" });
            break;
          case Enums.WorkType.Travel:
            key = "Travel";
            this.oscNonCLovs.Item = this.items.Item.filter(item => {
              return item.Type == key;
            });
            this.oscNonCLovs.Item.unshift({ "ID": -2, "Value": "No Value" });
            break;
          case Enums.WorkType.Break:
            this.oscNonCLovs.Item = this.items.Item.filter(item => {
              return item.Type == key;
            });
            break;
          case Enums.WorkType.NoValue:
            this.getActivityLovs();
            break;
          default:
            break;
        }

      }
    });
  }

  getActivityName() {
    this.localService.getActivityName().then((res: any) => {
      this.activityNameList = res;
    });
  }

  getShiftCodes() {
    this.localService.getShiftCodes().then((res: any) => {
      this.shiftCodesList = res.filter(item => {
        return item.Shift_Code && item.Shift_Code != '';
      });
    });
  }


  /* Prateek (04/22/2019)
  *  Alert box for submission of time entries.
  */
  alertSubmit() {
    let msg = this.weekBtnClicked ? "weekly " : "";
    let alert = this.utilityProvider.confirmationAlert('', 'Are you sure you want to submit your ' + msg + 'time entries?');
    alert.present();
    alert.onDidDismiss((response) => {
      if (response) {
        this.submitTime();
      }
    });
  }

  closeAdvancedSearch() {
    this.clearAllFields();
    if (this.dayBtnClicked)
      this.getDayTimeRows();
    else
      this.getTimeRows();
  }

  //Vivek On 24-APR-2019

  clearAllFields() {
    // Preeti Varshney 04/26/2019 expand All is false initially
    this.toggleAllaccordion = false;
    if (this.checkCurrDate(this.date_from))
      this.date_from = new Date();
    if (this.checkCurrDate(this.date_to))
      this.date_to = new Date();
    this.noRecordFound = false;
    this.projectList = [];
    this.advSearchObj.Job_Number = this.advSearchObj.Work_Type = this.advSearchObj.Item = this.advSearchObj.TagNumber = this.advSearchObj.SerialNumber = this.advSearchObj.AbsenceType = this.advSearchObj.Charge_Method = '';
    this.getActivityLovs();
  }

  checkStatus() {
    let formattedweekStart;
    let formattedweekEnd;
    //Prateek 05/22/2019 -- Check submit status for advance search entries
    if (this.advSearchBtnClicked) {
      this.submitDisabled = true;
      for (let i = 0; i < this.projectList.length; i++) {
        if (this.projectList[i].isSubmitted == "false") {
          this.submitDisabled = false;
          return;
        }
      }
    }
    else {
      if (this.dayBtnClicked) {
        formattedweekStart = moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD');
        formattedweekEnd = moment(this.selectedDay, 'DD-MMM-YYYY').format('YYYY-MM-DD')

      }
      else {
        formattedweekStart = moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD');
        formattedweekEnd = moment(this.weekEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD')

      }
      this.localService.getTimeEntry(formattedweekStart, formattedweekEnd).then((res: any) => {
        if (res.length > 0) {
          this.submitDisabled = true;
          for (let i = 0; i < this.projectList.length; i++) {
            if (this.projectList[i].isSubmitted == "false" || this.projectList[i].isSubmitted == false) {
              this.submitDisabled = false;
              return;
            }
          }
          // this.valueProvider.setSyncStatus("Saved");
          //this.statusMsg = this.valueProvider.getSyncStatus();
          //this.submitDisabled = false;
        }
        else {
          // this.valueProvider.setSyncStatus("Submitted");
          //this.statusMsg = this.valueProvider.getSyncStatus();
          this.submitDisabled = true;
        }
      }).catch((error) => {
        this.logger.log(this.fileName, 'checkStatus', ' Error in getTimeEntry : ' + JSON.stringify(error));
      });
    }
  }

  getDurationOnDate() {
    let fromDate = moment(this.date_from).format("YYYY-MM-DD");
    let toDate = moment(this.date_to).format("YYYY-MM-DD");
    if (moment(fromDate).isAfter(toDate)) {
      this.date_to = this.date_from;
    }
  }
  /**
* Preeti Varshney 04/26/2019
* Expand All and Collapse All functionality
*/
  collapsAllAccordion(event) {
    if (event == true) {
      this.toggleAllaccordion = true;
    }
    else {
      this.toggleAllaccordion = false;
    }
    if (this.toggleAllaccordion) {
      for (let i = 0; i < this.projectList.length; i++) {
        this.projectList[i].expanded = true;
      }
    }
    else {
      for (let i = 0; i < this.projectList.length; i++) {
        this.projectList[i].expanded = false;
      }
    }
  }
  /**
     * Preeti Varshney 04/05/2019
     * open popover page on clicking on duration in the day view
     * includes start time, end time, duration and notes
     */
  // openTimeDurationPopOver(project, myEvent) {
  //   this.utilityProvider.closeFab();
  //   try {
  //     let params = { userPopOver: true, project: project, nonclaritylistPage: this.listPageNonClarity, dayBtnClicked: this.dayBtnClicked, selectedDay: this.selectedDay };
  //     let userPopOver = this.popoverCtrl.create('PopoverTimePage', params, { enableBackdropDismiss: true, cssClass: 'TimePopOver' });
  //     userPopOver.present({
  //       ev: myEvent
  //     });
  //     userPopOver.onDidDismiss(data => {

  //     });

  //   } catch (error) {
  //     this.logger.log(this.fileName, 'openTimeDurationPopOver', ' Error in popoverCtrl : ' + JSON.stringify(error));
  //   }

  // }
  openTimeDurationPopOver(task, myEvent) {
    this.utilityProvider.closeFab();
    try {
      if (!this.valueProvider.isOSCUser() && !this.valueProvider.getUser().ClarityID) {
        let params = { userPopOver: true, day: task, project: task, nonclaritylistPage: this.listPageNonClarity, dayBtnClicked: this.dayBtnClicked, selectedDay: this.selectedDay };
        let userPopOver = this.popoverCtrl.create('PopoverTimePage', params, { enableBackdropDismiss: true, cssClass: 'TimePopOver' });
        userPopOver.present({
          ev: myEvent
        });
        userPopOver.onDidDismiss(data => {
          this.loadDayWeekView();
          this.toggleAllaccordion = false;
        });
      } else {
        let addEditTimeModal = this.utilityProvider.showModal("TimesheetAddEditModalPage", { day: task, nonclaritylistPage: this.listPage, dayBtnClicked: this.dayBtnClicked, selectedDay: this.selectedDay }, { enableBackdropDismiss: true, cssClass: 'FeedbackDetailModalPage' });
        addEditTimeModal.present({
          ev: myEvent
        });
        addEditTimeModal.onDidDismiss(data => {
          this.loadDayWeekView();
          this.toggleAllaccordion = false;
        });
      }



    } catch (error) {
      this.logger.log(this.fileName, 'openTimeDurationPopOver', ' Error in popoverCtrl : ' + JSON.stringify(error));
    }
  }
  /**
       * Preeti Varshney 09/12/2019
       * Set STARTDAYOFWEEK and ListView from the User Preference
       */
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
  /**
     * Preeti Varshney 09/12/2019
     * get day name of the week
     */
  getWeekDay(dayName) {
    let arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return arr.indexOf(dayName);
  }
  /**
     * Preeti Varshney 09/12/2019
     * format date accodring to date format in the listing.
     */
  formatDate(selecteddate) {
    selecteddate = moment(selecteddate, "DD-MMM-YYYY").format(this.valueProvider.getUserPreferences()[0].Date_Format ? this.valueProvider.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
    return selecteddate
  }
  /**
     * Preeti Varshney 09/12/2019
     * unsubcribe all events
     */
  ngOnDestroy() {
    this.events.unsubscribe('updatestartDay');
    this.events.unsubscribe('setWeekDay');
    this.events.unsubscribe('setWeekfromCal');
    this.events.unsubscribe('refreshListPage');
  }
  /**
    * Preeti Varshney 09/12/2019
    * Check if the date is current Date.
    */
  checkCurrDate(aaa) {
    return moment(aaa).format('DD-MMM-YYYY') != moment(new Date()).format('DD-MMM-YYYY')

  }
  getActivityLovs() {
    try {
      return new Promise((resolve, reject) => {
        let promiseArray = [];
        this.oscNonCLovs = {};
        promiseArray.push(this.localService.getMSTData('WorkType', undefined, undefined));
        promiseArray.push(this.localService.getItemList());
        //05/12/2019 Shivansh Subnani Get Absences / Internal Type lov's
        promiseArray.push(this.localService.getAbsenceType());
        promiseArray.push(this.localService.getMSTData('ChargeMethod', undefined));

        resolve(true)

        Promise.all(promiseArray).then((response) => {
          let data = [];
          for (let i = 0; i < response[0].length; i++) {
            if (response[0][i].NC == 1) {
              data.push(response[0][i]);
            }
          }
          this.oscNonCLovs['Work_Type'] = data;
          this.oscNonCLovs['Work_Type'].unshift({ "ID": -2, "Value": "No Value" });
          var items = response[1];
          this.oscNonCLovs['Item'] = response[1];
          this.oscNonCLovs['Item'].unshift({ "ID": -2, "Value": "No Value" });
          this.items['Item'] = response[1];
          this.oscNonCLovs.AbsenceType = response[2];
          this.oscNonCLovs.AbsenceType.unshift({ "ID": -2, "Value": "No Value" });
          //this.oscNonCLovs.AbsenceType.push({ "ID": -11000, "Value": "Other" });

          this.oscNonCLovs.Charge_Method = response[3];
          this.oscNonCLovs.Charge_Method.unshift({ "ID": -2, "Value": "No Value" });
          resolve(true);
        }).catch((error) => {
          this.utilityProvider.stopSpinner();
          reject(error);
        });
      })
    } catch (error) {
      this.logger.log(this.fileName, "getAllFieldsLOVs ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }

  /**
   * Mayur Varshney -- 12-17-2019 
   * Open Export time report modal page to export the detailed info of the current user in the form of CSV
   * @memberOf TimesheetClarityPage
   */
  newActivity() {
    // Preeti Varshney 12/20/2019 send weekStart and weekEnd as params.
    let exportReportModal = this.utilityProvider.showModal("TimeReportModalPage", { weekStart: this.weekStart, weekEnd: this.weekEnd }, { enableBackdropDismiss: false, cssClass: 'TimeReportModalPage' });
    exportReportModal.onDidDismiss(data => {
      console.log(data);
    });
    exportReportModal.present().catch((err: any) => {
      this.logger.log(this.fileName, 'newActivity', 'Error in exportReportModal : ' + JSON.stringify(err));
    });
  }


  /**
   * 01-22-2020 -- Mayur Varshney
   * return cssClass on the basis of ShowChargeMethod and JobType
   * @param {any} jobType 
   * @returns 
   * @memberOf TimeNonclaritylistPage
   */
  checkAccordionClass(jobType) {
    let cssClass: any;
    jobType = jobType ? jobType.toLowerCase() : jobType;
    let showChargeMethod = this.valueProvider.getUserPreferences()[0].ShowChargeMethod ? Boolean(JSON.parse(this.valueProvider.getUserPreferences()[0].ShowChargeMethod)) : false;
    switch (true) {
      case ((jobType == 'field' || jobType == null) && showChargeMethod == true):
        cssClass = 'desc showCM';
        break;
      case ((jobType == 'field' || jobType == null) && showChargeMethod == false):
        cssClass = 'desc';
        break;
      case ((jobType != 'field' && jobType != null) && showChargeMethod == true):
        cssClass = 'desc1 showCM';
        break;
      case ((jobType != 'field' && jobType != null) && showChargeMethod == false):
        cssClass = 'desc1';
        break;
    }
    return cssClass
  }
}
