import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import * as moment from "moment";
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { LoggerProvider } from '../../providers/logger/logger';
import { UtilityProvider } from '../../providers/utility/utility';
import { ValueProvider } from '../../providers/value/value';


@IonicPage()
@Component({
  selector: 'page-popover-time',
  templateUrl: 'popover-time.html',
})
export class PopoverTimePage {
  fileName: any = 'PopoverTimePage';
  Start_Time;
  End_Time;
  duration;
  dayData: any;
  projectData: any = [];
  insertId: any = '';
  isDateError: boolean = false;
  listPage: boolean;
  //presentDate: any = "";
  currentEntryDate: any = '';
  currentEndDate: any = '';
  hours: any = "";
  notes: any = '';
  dayBtnClicked: boolean = false;
  selectedDay: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public viewCtrl: ViewController, public localService: LocalServiceProvider, public logger: LoggerProvider, public utilityProvider: UtilityProvider, public valueProvider: ValueProvider) {
    this.dayData = this.navParams.get('day');
    this.projectData = this.navParams.get('project');
    // console.log("dayData in popover",this.dayData);
    // console.log("project Data in popover",this.projectData);
    this.dayBtnClicked = this.navParams.get('dayBtnClicked');
    this.listPage = this.navParams.get('listPage');
    this.selectedDay = this.navParams.get('selectedDay');
    if (this.dayBtnClicked == true) {
      this.currentEntryDate = moment(this.projectData.EntryDate, 'DD-MMM-YYYY');
      this.currentEndDate = moment(this.projectData.EntryDate, 'DD-MMM-YYYY');

    }
    else {
      this.currentEntryDate = this.dayData.entryDate;
      this.currentEndDate = this.dayData.entryDate;
    }
    this.loadData();
  }
  // ngOnInit() {
  //   this.loadData();
  // }
  ionViewDidLoad() {

  }
  loadData() {
    /**
  * Preeti Varshney 04/10/2019
  * if time of date is there in database
  */
    if (this.dayBtnClicked == true) {
      this.duration = this.projectData.Duration;
      this.notes = this.projectData.Comments;
      this.Start_Time = this.utilityProvider.getFormatTime(this.projectData.Start_Time);
      this.End_Time = this.utilityProvider.getFormatTime(this.projectData.End_Time);
    }
    else if (this.utilityProvider.isNotNull(this.dayData.duration)) {
      this.duration = this.dayData.duration;
      this.notes = this.dayData.notes;
      this.Start_Time = this.utilityProvider.getFormatTime(this.dayData.startTime);
      this.End_Time = this.utilityProvider.getFormatTime(this.dayData.endTime);
    }
    else {
      this.setDefaultTimeObject();
    }
  }

  /**
   * Preeti Varshney 03/12/2019
   * Set default time to 00:00 in start time and end time
   */
  setDefaultTimeObject() {
    let initialStartAndEnd = new Date(moment(this.currentEntryDate, 'YYYY-MM-DD').format('YYYY-MM-DD'));
      initialStartAndEnd.setHours(0);
      initialStartAndEnd.setMinutes(0);
      this.Start_Time = initialStartAndEnd;
      this.End_Time = initialStartAndEnd;
      setTimeout(() => {
        this.Start_Time = null;
        this.End_Time = null;
      }, 0);
      this.duration =  '00:00';
  }
  /**
 * Preeti Varshney 03/12/2019
 * Interlinked condition with start time and end time.
 */
  getTimeOnChange(event, type) {

    this.currentEndDate = this.currentEntryDate;

    if ((!this.Start_Time && !this.End_Time) || (this.Start_Time == 'Invalid date' && this.End_Time == 'Invalid date')) {
      this.duration =  '00:00';
      return;
    }
    if (event == null) {
      this.duration =  '00:00';
      return;
    }

    this[type] = moment(event).format('HH:mm');

    if(this.End_Time == "00:00"){
      this.currentEndDate =  moment(this.currentEntryDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
    }

    let startTimeVal : any = this.currentEntryDate;
    let endTimeVal: any = this.currentEndDate ;

    switch (type) {
      case 'Start_Time':
        if (moment(startTimeVal).isSameOrAfter(endTimeVal) || !this.End_Time || this.End_Time == 'Invalid date') {
          this.End_Time = this.utilityProvider.getDateFormatTime(this.currentEntryDate, this.Start_Time);
        }
        else {
          startTimeVal = this.utilityProvider.formatDateTime(this.currentEntryDate, this.Start_Time);
          endTimeVal = this.utilityProvider.formatDateTime(this.currentEndDate, this.End_Time);
          this.duration = this.utilityProvider.getDuration(startTimeVal, endTimeVal);
        }
        break;
      case 'End_Time':

        if (!this.Start_Time || this.Start_Time == 'Invalid date') {
          this.Start_Time = this.utilityProvider.getDateFormatTime(this.currentEndDate, this.End_Time);
        }
        startTimeVal = this.utilityProvider.formatDateTime(this.currentEntryDate, this.Start_Time);
        endTimeVal = this.utilityProvider.formatDateTime(this.currentEndDate, this.End_Time);
        this.duration = this.utilityProvider.getDuration(startTimeVal, endTimeVal);
        break;
    }
  }

  validateDuration() {
    // This is applicable for only night shift entries.
    if (this.End_Time == "23:59") {
      let splitTime = this.duration.split(":");
      let minutes = parseInt(splitTime[1]) + 1;
      let totalMinutes = splitTime[0] * 60 + minutes;
      let updateHours = Math.floor(Math.abs(totalMinutes / 60));
      let updateMin = Math.floor(totalMinutes % 60);
      if (updateHours <= 9) {
        this.duration = ('0' + updateHours).slice(-2) + ":" + ('0' + +updateMin).slice(-2);
      } else {
        this.duration = updateHours + ":" + ('0' + +updateMin).slice(-2);
      }
    }
  }

  /**
* Preeti Varshney 03/12/2019
* maintain object for popover data.
*/
  saveDuration() {

    //this.validateDuration();

    let data;
    data = this.createObject(this.projectData)
    data.Start_Time =  this.Start_Time;
    data.End_Time =  this.End_Time;
    data.Duration =  this.duration;
    data.Comments =  this.notes;
    data.isPicked =  this.projectData.Job_Type == "vacation" ? null : "true";
    data.isDeleted =  "false";
    data.IsAdditional = "false";
    data.ResourceId = this.valueProvider.getResourceId();
    data.isSubmitted = "false";
    data.DB_Syncstatus = "false";
    if (!this.dayBtnClicked) {
      data.Time_Id = this.dayData.Time_Id ? this.dayData.Time_Id : this.utilityProvider.getUniqueKey();
      data.EntryDate = moment(this.dayData.entryDate).format('YYYY-MM-DD');
    }
    let startDate = moment(this.currentEntryDate).format("YYYY-MM-DD");
    let endDate = moment(this.currentEndDate).format("YYYY-MM-DD");
    data.Service_Start_Date = moment(startDate + " " + data.Start_Time).toDate().toString();
    data.Service_End_Date = moment(endDate + " " +  data.End_Time).toDate().toString();
    data = this.removeUnwantedKeys(data);
    this.insertId = data.Time_Id;
    let searchDates: any = {
      "startDate": startDate,
      "endDate": endDate
    };

    this.localService.getCountTimeEntries([data], "firstcheck", this.insertId ? true : false).then((res: any[]) => {
      // First check for same time entry
      if (res && res.length == 0) {

        this.localService.getCountTimeEntries([data], "secondcheck", this.insertId ? true : false).then((res: any[]) => {
          // Second check for overlapping time entry
          if (res && res.length == 0) {
            this.localService.insertTime(data).catch((error: any) => {
              this.utilityProvider.stopSpinner();
              this.logger.log(this.fileName,'saveDuration', ' Error in insertTime : '+ JSON.stringify(error));
            }).then((res): any => {
              //this.insertId = res;
              if (this.dayBtnClicked == true) {
                this.viewCtrl.dismiss().then((res): any => {
                  let value = { type: "showDayWise", weekBtnClicked: false, dayBtnClicked: true, selectedday: this.selectedDay };
                  this.events.publish("setWeekDay", value);
                });

              }
              else if (this.listPage == false) {
                let popoverData = {
                  Start_Time: this.Start_Time,
                  End_Time: this.End_Time,
                  duration: this.duration,
                  Comments: this.notes,
                  Time_Id: this.insertId ? this.insertId : this.dayData.Time_Id,
                  dayid: this.dayData.dayid,
                  Job_Type: data.Job_Type
                };
                this.viewCtrl.dismiss(popoverData);
                // console.log("popover data",popoverData);
                this.events.publish("refreshEditpageData", popoverData);
              }
              else {
                this.viewCtrl.dismiss().then((res): any => {
                  let value = { type: "showWeekWise", weekBtnClicked: true, dayBtnClicked: false };
                  this.events.publish("setWeekDay", value);
                });

              }
            });
          } else {
            this.promptAlert(res);
          }
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName,'saveDuration', ' Error in getCountforMatchedTime : ' + JSON.stringify(error));
        });
      } else {
        this.promptAlert(res);
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName,'saveDuration', ' Error in getCountforMatchedTime : ' + JSON.stringify(error));
    });

  }

  promptAlert(res) {
    this.utilityProvider.stopSpinner();
    //Preeti Varshney 04/30/2019 Promt alert
    let duplicateEntryDate = moment(res[0].EntryDate, 'YYYY-MM-DD').format('DD-MMM-YYYY');;
    let duplicateStart_Time = res[0].Start_Time;
    let duplicateEnd_Time = res[0].End_Time;
    let Job_Number = res[0].Job_Number;
    let alert = this.utilityProvider.promptAlert('', 'Overlapping time entry exists (Job ID: ' + Job_Number + ' Date: ' + duplicateEntryDate + ' Start Time: ' + duplicateStart_Time + ' End Time: ' + duplicateEnd_Time + ')');
    alert.present();
  }

  checkforspace(value) {
    let val = value._value
    this.notes = val.trim();

  }

  createObject(key) {
    return Object.assign(Object.create(key), key)
  }

  removeUnwantedKeys(data) {
    // let keys = ['expanded', 'StatusID', 'totalDuration', 'Primary_Key','advdate','dayid','dayName','Group_Id'];
    let arr = ['dayid', 'entryDate', 'dayName', 'duration', 'startTime', 'endTime', 'notes', 'isOpen', 'TotalDuration', 'oldDuration', 'Group_Id', 'Serial_No', 'Tag_No', 'Primary_Key', 'totalDuration', 'Activity_Name', 'OT_Code', 'expanded', 'timeId','AdvDate','days','StatusID','length'];
    arr.forEach((key) => {
      delete data[key]
    })
    return data;
  }

}
