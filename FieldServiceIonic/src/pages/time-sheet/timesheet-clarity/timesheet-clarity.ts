import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events, PopoverController } from 'ionic-angular';
import { BsDatepickerConfig } from 'ngx-bootstrap';

import * as moment from "moment";
import { UtilityProvider } from '../../../providers/utility/utility';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../providers/logger/logger';
import { ValueProvider } from '../../../providers/value/value';



@IonicPage()
@Component({
  selector: 'page-timesheet-clarity',
  templateUrl: 'timesheet-clarity.html',
})
export class TimesheetClarityPage {
  fileName: any = 'Timesheet_Clarity_Page';
  header_data: any;
  advSearchBtnClicked: boolean = false;
  dayBtnClicked: boolean = false;
  weekBtnClicked: boolean = true;
  public weekStart: any;
  public weekEnd: any;
  projectList: any = [];
  public timeRows: Array<any> = [];
  OutData: any = [];
  days: any = [];
  event = new Events()
  selectedDay: any;
  importEntries: boolean = true;
  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public bsDatepickerConfig: BsDatepickerConfig, public appCtrl: App, public utilityProvider: UtilityProvider, public localService: LocalServiceProvider, public logger: LoggerProvider, public valueProvider: ValueProvider, public popoverCtrl: PopoverController) {
    this.header_data = { title1: "", title2: "Timesheet Clarity", taskId: "" };

    //Prteek 03/14/2019 subscribe single event and case based on condition from day week view component
    this.events.subscribe('setWeekDay', (data) => {
      switch (data.type) {
        case 'setWeekStart':
        case 'setWeekEnd':
          this.weekStart = data.weekStart;
          this.weekEnd = data.weekEnd;
          this.getTimeRows();
          break;
        case 'setPreviusDay':
        case 'setNextDay':
          this.selectedDay = data.selectedday;
          this.getDayTimeRows();
          break;
        case 'showDayWise':
          this.selectedDay = data.selectedday;
          this.weekBtnClicked = data.weekBtnClicked;
          this.dayBtnClicked = data.dayBtnClicked;
          this.getDayTimeRows();
          break;
        case 'showWeekWise':
          this.weekBtnClicked = data.weekBtnClicked;
          this.dayBtnClicked = data.dayBtnClicked;
          this.getTimeRows();
          break;
        case 'advSearchBtn':
          this.advSearchBtnClicked = data.advSearchBtnClicked;
          break;
        default:

          break;
      }
    });

    this.events.subscribe('setWeekfromCal', (data) => {
      this.weekStart = data.weekStart;
      this.weekEnd = data.weekEnd;
      this.selectedDay = data.selectedDay;
      if (data.isChange) {
        if (this.selectedDay != undefined) {
          this.getDayTimeRows();
        }
        else {
          this.getTimeRows();
        }
      }
    });
    // this.events.subscribe('setCurrentWeek', (data) => {
    //   this.weekStart = data.weekStart;
    //   this.weekEnd = data.weekEnd;
    //   this.getTimeRows();
    // });

  }

  ionViewDidEnter() {
    // this.utilityProvider.currentWeek();
    this.weekStart = this.utilityProvider.WeekStart;
    this.weekEnd = this.utilityProvider.weekEnd;
    this.getTimeRows();
  }
  ionViewDidLoad() {
    this.loadData();
    this.events.publish('user:created', "Time");
  }
  loadData() {
    this.bsDatepickerConfig.dateInputFormat = 'DD MMM YYYY';
  }
  /**
    * Preeti Varshney 03/12/2019
    * receive data from expandable component as output
    */
  recievedData(data) {
    this.OutData = data;
  }
  /**
    * Preeti Varshney 03/12/2019
    * get time rows from time table using start date and end date
    */
  getTimeRows() {
    this.timeRows = [];
    let weekStart = moment(this.weekStart, 'DD-MMM-YYYY');
    let weekEnd = moment(this.weekEnd, 'DD-MMM-YYYY');
    let formattedweekStart = moment(weekStart, 'DD-MMM-YYYY').format('DD-MMM-YYYY');
    let formattedweekEnd = moment(weekEnd, 'DD-MMM-YYYY').format('DD-MMM-YYYY');
    this.localService.getTimeRows(formattedweekStart, formattedweekEnd).then((response: any[]) => {
      if (response) {
        // this.timeRows = [];
        this.timeRows = response;
        this.dayListData();
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getTimeRows', 'Error in getTimeRows : ' + JSON.stringify(error));
    });
  }
  /**
    * Preeti Varshney 03/12/2019
    * creating day list of date and day and assinging data from entry of the table
    */
  dayListData() {
    this.days = [];//todo days let
    let weekstart = this.weekStart;
    for (let i = 0; i < 7; i++) {
      let dayid = i + 1;
      let entryDate = moment(weekstart, 'DD-MMM-YYYY');
      let dayName = moment(weekstart, 'DD-MMM-YYYY').format("ddd");
      let duration = "";
      let notes = "";
      let startTime = "";
      let endTime = "";
      let formattedentryDate = moment(weekstart, 'DD-MMM-YYYY').format('DD-MMM-YYYY');
      this.timeRows.forEach((item) => {
        if (item.EntryDate == formattedentryDate) {
          duration = item.Duration;
          notes = item.Comments;
          startTime = item.Start_Time;
          endTime = item.End_Time;
        }
      })
      this.days.push({
        'dayid': dayid,
        'entryDate': entryDate,
        'dayName': dayName,
        'duration': duration,
        'notes': notes,
        'startTime': startTime,
        'endTime': endTime
      });
      weekstart = moment(weekstart, 'DD-MMM-YYYY').add(1, 'days');
    }
    this.getWeekDays();

  }
  /**
    * Preeti Varshney 03/12/2019
    * creating object of data from the table and pushing days into object
    */
  getWeekDays() {
    this.projectList = [];
    let data = {
      "projectn": this.timeRows[0].PROJECT_NAME,
      "task": this.timeRows[0].Field_Job_Name,
      "otCode": this.timeRows[0].Time_Code,
      "workType": this.timeRows[0].Work_Type,
      "shiftCode": this.timeRows[0].Shift_Code,
      "chargeType": this.timeRows[0].Charge_Type,
      "country": this.timeRows[0].Country_Name,
      "state": this.timeRows[0].State,
      "city": this.timeRows[0].City,
      "expanded": false,
      "days": this.days,

    };
    this.totalHours();
    this.projectList.push(data);
  }
  /**
   * Preeti Varshney 03/12/2019
   * calculate total week hours.
   */
  totalHours() {
    let initialHours = new Date();
    initialHours.setHours(0);
    initialHours.setMinutes(0);
    this.valueProvider.TotalHours = parseInt(moment(initialHours).format('HH:mm'));
    for (let i = 0; i < this.days.length; i++) {
      let duration = this.days[i].duration;
      let total = this.timeToMin(this.valueProvider.TotalHours) + this.timeToMin(duration);
      this.valueProvider.TotalHours = this.minToTime(total);
    }

  }
  /**
   * Preeti Varshney 03/12/2019
   * converting time to calculate total time in minutes
   */
  timeToMin(time) {
    let duration = moment.duration(time);
    let hours = duration.asHours();
    let minutes = duration.asMinutes() - hours * 60;
    let hoursToMin = hours * 60;
    let totalTimeInMin = hoursToMin + minutes;
    return totalTimeInMin;
  }
  /**
   * Preeti Varshney 03/12/2019
   * converting minutes to time for displaying in time format
   */
  minToTime(minutes) {
    let updateHours = Math.floor(Math.abs(minutes / 60));
    let updateMin = Math.floor(minutes % 60);
    let time;
    if (updateHours <= 9) {
      time = ('0' + updateHours).slice(-2) + ":" + ('0' + +updateMin).slice(-2);
    }
    else {
      time = updateHours + ":" + ('0' + +updateMin).slice(-2);
    }
    return time;
  }
  /**
    * Preeti Varshney 03/12/2019
    * expand the project to show the details of week
   */
  expandItem(item) {
    this.projectList.map((listItem) => {
      if (item == listItem) {
        listItem.expanded = !listItem.expanded;
      } else {
        listItem.expanded = false;
      }
      return listItem;
    });
  }

  importList() {
    this.projectList = [];
    if (this.importEntries = true) {
      this.DummydayListData();
      let data = {
        "projectn": "38787",
        "task": "2000-030 Technical Project Control enineer",
        "otCode": "Ot_301",
        "workType": "Labour",
        "shiftCode": "Shift_Code_12",
        "chargeType": "Labour",
        "country": "India",
        "state": "Delhi",
        "city": "Delhi",
        "expanded": false,
        "days": this.days,

      };
      this.projectList.push(data);
      this.importEntries = false;
    }

  }

  DummydayListData() {
    this.days = [];//todo days let
    let weekstart = moment("18-March-2019", 'DD-MMM-YYYY')
    for (let i = 0; i < 7; i++) {
      let dayid = i + 1;
      let entryDate = moment(weekstart, 'DD-MMM-YYYY');
      let dayName = moment(weekstart, 'DD-MMM-YYYY').format("ddd");
      let duration = "";
      let notes = "";
      let startTime = "";
      let endTime = "";
      // let formattedentryDate = moment(weekstart, 'DD-MMM-YYYY').format('DD-MMM-YYYY');
      // this.timeRows.forEach((item) => {
      //   if (item.EntryDate == formattedentryDate) {
      //     duration = item.Duration;
      //     notes = item.Comments;
      //     startTime = item.Start_Time;
      //     endTime = item.End_Time;
      //   }
      // })
      this.days.push({
        'dayid': dayid,
        'entryDate': entryDate,
        'dayName': dayName,
        'duration': duration,
        'notes': notes,
        'startTime': startTime,
        'endTime': endTime
      });
      weekstart = moment(weekstart, 'DD-MMM-YYYY').add(1, 'days');
    }
    this.utilityProvider.WeekStart = "18-March-2019";
    this.utilityProvider.weekEnd = "24-march-2019";
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
    this.projectList = [];
    this.localService.getDayRow(this.selectedDay).then((response: any) => {
      if (response.length > 0) {
        let data = {
          "task": response[0].Field_Job_Name,
          "totalHours": response[0].Total_Hours,
          "otCode": response[0].Time_Code,
          "workType": response[0].Work_Type,
          "shiftCode": response[0].Shift_Code,
          "chargeType": response[0].Charge_Type,
          "country": response[0].Country_Name,
          "state": response[0].State,
          "city": response[0].City,
          "Comment": response[0].Comments,
          "expanded": false,
          "Duration": response[0].Duration,
          "Start_Time": this.timeRows[0].Start_Time,
          "End_Time": this.timeRows[0].End_Time,
          "EntryDate": this.timeRows[0].EntryDate
        }
        this.projectList.push(data);
        //  console.log(this.projectList, "PROJECTLIST")
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getDayTimeRows', 'Error in getDayTimeRows : ' + JSON.stringify(error));
    });
  }
  /**
  * Preeti Varshney 03/12/2019
  * open popover to delete or edit entry
  */
  openEditDeletePopOver(myEvent) {
    this.utilityProvider.closeFab();
    try {
      let params = { userPopOver: true };
      let userPopOver = this.popoverCtrl.create('PopoverEditDeletePage', params, { enableBackdropDismiss: true, cssClass: 'PopoverEditDeletePage' });
      userPopOver.present({
        ev: myEvent
      });
    } catch (error) {
      this.logger.log(this.fileName, 'openEditDeletePopOver', error);
    }
  }


  /**
   * Mayur Varshney -- 12-17-2019 
   * Open Export time report modal page to export the detailed info of the current user in the form of CSV
   * @memberOf TimesheetClarityPage
   */
  newActivity() {
    let params = {};
  let exportReportModal = this.utilityProvider.showModal("TimeReportModalPage", params, { enableBackdropDismiss: false, cssClass: 'TimeReportModalPage' });
    exportReportModal.onDidDismiss(data => {
      console.log(data);
    });
    exportReportModal.present().catch((err: any) => {
      this.logger.log(this.fileName, 'newActivity', 'Error in exportReportModal : ' + JSON.stringify(err));
    });
  }

}
