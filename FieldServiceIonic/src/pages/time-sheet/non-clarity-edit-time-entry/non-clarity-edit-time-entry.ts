import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import * as moment from "moment";
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../providers/logger/logger';
import { ValueProvider } from '../../../providers/value/value';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { UtilityProvider } from '../../../providers/utility/utility';

@IonicPage()
@Component({
  selector: 'non-clarity-edit-page-time-entry',
  templateUrl: 'non-clarity-edit-time-entry.html',
})
export class NonClarityEditTimeEntryPage implements OnInit {
  fileName: any = 'NonClarityEditTimeEntryPage';
  header_data: any;
  dayList: any = [];
  weekStart: any;
  duration;
  taskId;
  job_Id: any = '';
  allJobIDs: any = [];
  service_start_date: any;
  service_end_date: any;
  Start_Time;
  End_Time;
  isDateError: boolean = false;
  desShow: boolean = false;
  isEntryDuplicated: boolean = true;
  listPage: boolean = false;
  item: any;
  charge_method;
  chargemethod: any[] = [];
  activityName: any = [];
  shiftCodes: any = [];
  charge_method_Id: any;
  serial_number: any;
  activity_name: any;
  tag_Number: any;
  description: any;
  isDropdownVisibleActivity: boolean = false;
  ValueActivity: any;
  @ViewChild('dp') dp1: BsDatepickerDirective;
  @ViewChild('dps') dp2: BsDatepickerDirective;
  timeData: any = [];
  nonClarityPage: any;
  isjobId: any;
  weekBtnClicked: boolean = false;
  datepickerConfig: Partial<BsDatepickerConfig>;
  minDate: Date = new Date(new Date().setDate(new Date().getDate() - 90));
  Job_Type: string = '';
  vacEntry: boolean = true;
  vacClick: boolean = false;
  depotClicked: boolean;
  isDepot: boolean;
  isField: boolean;
  timeId: any;
  //Preeti Varshney 05/09/2019 added Work_Type_Id to save
  Work_Type_Id: any;
  //Preeti Varshney 05/09/2019 added Item_Id to save
  Item_Id: any;
  delWeekStarts: any;
  delWeekEnds: any;
  //listPage: boolean = true;
  constructor(public utilityProvider: UtilityProvider, public navCtrl: NavController,
    public navParams: NavParams, public appCtrl: App, public events: Events,
    public localService: LocalServiceProvider, public logger: LoggerProvider,
    public valueProvider: ValueProvider) {

    this.weekBtnClicked = this.navParams.get('weekBtnClicked');
    this.timeData = this.navParams.get('timeData');
    this.nonClarityPage = this.navParams.get('nonClarityPage');
    this.taskId = this.navParams.get('taskId');
    this.delWeekStarts = this.navParams.get('delWeekStarts');
    this.delWeekEnds = this.navParams.get('delWeekEnds');

    let now = moment();
    let from_date = now.startOf('isoWeek');
    this.weekStart = moment(from_date).format('DD-MMM-YYYY');
    // this.bsDatepickerConfig.dateInputFormat = 'DD MMM YYYY';
    this.datepickerConfig = Object.assign({}, {
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false
      // , minDate: this.minDate
    });
    // TODO: Getting timeid for week - need to discuss for week view.
    this.timeId = this.timeData.Time_Id ? this.timeData.Time_Id : null;
    this.getJobType(this.timeId)
    this.dayList = this.utilityProvider.dayListData(this.weekStart);
    this.valueProvider.TotalHours = 0;

    //By Abhishek: to check from which page user is coming to edit the time entry
    if (this.nonClarityPage) {
      this.header_data = { title1: "", title2: "Timesheet", taskId: '' };
    }
    else {
      this.header_data = { title1: "Debrief", title2: "Job #", taskId: this.taskId };
    }
    this.events.subscribe('refreshEditpageData', (data) => {
      for (let i = 0; i < 7; i++) {
        if (data.dayid == this.timeData.days[i].dayid) {
          this.timeData.days[i].notes = data.Comments;
          this.timeData.days[i].startTime = data.Start_Time;
          this.timeData.days[i].endTime = data.End_Time;
          this.timeData.days[i].duration = data.duration;
          this.timeData.days[i].Time_Id = data.Time_Id;
          this.timeData.days[i].Job_Type = data.Job_Type,
          this.timeData.days[i].DB_Syncstatus = 'false',
          this.timeData.days[i].isDeleted = "false"
        }
      }
      this.events.publish('refreshTotalHours');
    });
  }

  ionViewDidEnter() {
    if (this.weekBtnClicked == false) {
      this.setDefaultTimeObject();
    }
    this.loadData();
    this.getShiftCodes();
  }
  ionViewDidLoad() {
    this.events.publish('user:created', "Time");
  }
  /**
    * Preeti Varshney 04/18/2019
    * load data to populate fields on edit page
    */
  loadData() {
    if (this.weekBtnClicked == false || !this.nonClarityPage) {
      this.service_start_date = this.timeData.Date;
      this.service_end_date = this.timeData.Date;
      if(this.timeData.End_Time == '00:00'){
        this.service_end_date = moment(this.timeData.Date).add(1, 'day').format('YYYY-MM-DD');
      }
      this.Start_Time = this.timeData.Start_Time == "" ? this.utilityProvider.getDateFormatTime(this.service_start_date, "00:00") : this.utilityProvider.getDateFormatTime(this.service_start_date, this.timeData.Start_Time);
      this.End_Time = this.timeData.End_Time == "" ? this.utilityProvider.getDateFormatTime(this.service_end_date, "00:00") : this.utilityProvider.getDateFormatTime(this.service_end_date, this.timeData.End_Time);
      this.duration = this.timeData.Duration;
    }
    else {
      this.initStartTime();
    }
    this.job_Id = this.timeData.Job_Number;
    this.serial_number = this.timeData.SerialNumber;
    this.activity_name = this.timeData.Work_Type;
    this.Work_Type_Id = this.timeData.Work_Type_Id;
    this.tag_Number = this.timeData.TagNumber;
    this.charge_method = this.timeData.Charge_Method;
    this.charge_method_Id = this.timeData.Charge_Method_Id;
    this.description = this.timeData.Comments;
    this.item = this.timeData.Item;
    this.Item_Id = this.timeData.Item_Id;
    this.Job_Type = this.timeData.Job_Type;

    this.getSTjob();
    this.getchargemethod();
    this.getActivityName();
  }
  getallTasks() {
    this.localService.getTaskForTimeSheet().then((res: any) => {
      for (let i = 0; i < res.length; i++) {
        res[i].LookupValue = res[i].Task_Number;
      }
      this.allJobIDs = res;

    });
  }
  initStartTime() {
    this.End_Time = this.Start_Time = null;
    this.duration = '00:00';
  }

  ngOnInit() {
    this.service_start_date = new Date();
    this.service_end_date = new Date();
  }
  cancel() {
    this.appCtrl.getRootNav().setRoot("TimeNonclaritylistPage", { save: "true" });
  }

  promptAlert(res) {
    this.utilityProvider.stopSpinner();
    //Preeti Varshney 04/30/2019 Promt alert
    let duplicateEntryDate = moment(res[0].EntryDate, 'YYYY-MM-DD').format('DD-MMM-YYYY');
    let duplicateStart_Time = res[0].Start_Time;
    let duplicateEnd_Time = res[0].End_Time;
    let Job_Number = res[0].Job_Number;
    let alert = this.utilityProvider.promptAlert('', 'Overlapping time entry exists (Job ID: ' + Job_Number + ' Date: ' + duplicateEntryDate + ' Start Time: ' + duplicateStart_Time + ' End Time: ' + duplicateEnd_Time + ')');
    alert.present();
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
      * Preeti Varshney 04/18/2019
      * update entries in the database
      */
  saveEdits() {
    let dataObject = [];

    if (this.vacEntry == false) {
      this.charge_method = "";
      this.charge_method_Id = "";
      this.serial_number = "";
      this.tag_Number = "";
    }

   // this.validateDuration();

    /**
    * Preeti Varshney 04/18/2019
    * update entries in the database from day-view edit page and debrief edit page
    */
    if (this.weekBtnClicked == false || !this.nonClarityPage) {
      let entryDate = moment(this.service_start_date, 'DD-MMM-YYYY').format('YYYY-MM-DD');
      let data = {
        Work_Type: this.activity_name ? this.activity_name : "",
        //Preeti Varshney 05/09/2019 added Work_Type_Id to save
        Work_Type_Id: this.Work_Type_Id,
        Item: this.item ? this.item : '',
        //Preeti Varshney 05/09/2019 added Item_Id to save
        Item_Id: this.Item_Id,
        Charge_Method: this.charge_method ? this.charge_method : "",
        Charge_Method_Id: this.charge_method_Id ? this.charge_method_Id.toString() : "",
        Time_Id: this.utilityProvider.isNotNull(this.timeData.Time_Id) ? this.timeData.Time_Id : String(this.utilityProvider.getUniqueKey()),
        Start_Time: this.Start_Time,
        Duration: this.duration,
        End_Time: this.End_Time,
        EntryDate: entryDate,
        Service_Start_Date :  moment(entryDate + " " + this.Start_Time).toDate().toString(),
        Service_End_Date :  this.End_Time == '00:00' ? moment((moment(entryDate).add(1, 'day')).format('YYYY-MM-DD') + " " + this.End_Time).toDate().toString() : moment(entryDate + " " + this.End_Time).toDate().toString(),
        Task_Number: this.timeData.Primary_Key,
        IsAdditional: 'false',
        DB_Syncstatus: "false",
        // Description: this.description ? this.description : "",
        Comments: this.description ? this.description : "",
        SerialNumber: this.serial_number ? this.serial_number : "",
        TagNumber: this.tag_Number ? this.tag_Number : "",
        ResourceId: this.valueProvider.getResourceId(),
        OracleDBID: this.valueProvider.getUserId(),
        //Preeti Varshney 05/09/2019 added Job_Number to save
        Job_Number: this.timeData.Job_Number,
        //  Preeti Varshney 05/09/2019 Added modified date to store Modified date on Oracle DB and Local DB
        ModifiedDate: new Date(),
        //Preeti Varshney 05/20/2019 Added isPicked to save
        isPicked: this.timeData.isPicked,
        Sync_Status: null,
        Job_Type: this.Job_Type ? this.Job_Type : this.timeData.Job_Type,
        isDeleted: "false",
        isSubmitted: "false",
        Date: this.timeData.Date
      };

      let searchDates: any = {
        "startDate": data.EntryDate,
        "endDate": data.EntryDate
      };

      this.localService.getCountTimeEntries([data], 'firstCheck', true).then((res: any[]) => {
        // First check for same time entry
        if (res && res.length == 0) {
          this.localService.getCountTimeEntries([data], 'secondcheck', true).then((res: any[]) => {
            // Second check for overlapping time entry
            if (res && res.length == 0) {
              this.localService.insertTime(data).then((res): any => {
                //
              }).catch((error: any) => {
                this.utilityProvider.stopSpinner();
                this.logger.log(this.fileName, 'saveEdits',' Error in insertTime : '+ JSON.stringify(error));
              });
              this.timeRedirect();
            } else {
              this.promptAlert(res);
            }
          }).catch((error: any) => {
            this.utilityProvider.stopSpinner();
            this.logger.log(this.fileName,'saveEdits', ' Error in getCountforMatchedTime : '+ JSON.stringify(error));
          });
        } else {
          this.promptAlert(res);
        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName,'saveEdits', ' Error in getCountforMatchedTime : '+ JSON.stringify(error));
      });

    }
    else {
      /**
    * Preeti Varshney 04/18/2019
    * update entries in the database from week-view edit  page
    */
      // console.log("TimeData", this.timeData);
      for (let i = 0; i < 7; i++) {
        if (this.timeData.days[i].Time_Id != null && this.timeData.days[i].Time_Id != "" && this.timeData.days[i].Time_Id != undefined) {
          let data = ({
            Work_Type: this.activity_name ? this.activity_name : "",
            //Preeti Varshney 05/09/2019 added Work_Type_Id to save
            Work_Type_Id: this.Work_Type_Id,
            Item: this.item ? this.item : '',
            //Preeti Varshney 05/09/2019 added Item_Id to save
            Item_Id: this.Item_Id,
            Charge_Method: this.charge_method ? this.charge_method : "",
            Charge_Method_Id: this.charge_method_Id ? this.charge_method_Id.toString() : "",
            Time_Id: this.utilityProvider.isNotNull(this.timeData.days[i].Time_Id) ? this.timeData.days[i].Time_Id : String(this.utilityProvider.getUniqueKey()),
            Start_Time: this.timeData.days[i].startTime,
            End_Time: this.timeData.days[i].endTime,
            Service_Start_Date: this.service_start_date,
            Service_End_Date: this.service_end_date,
            Task_Number: this.timeData.Primary_Key,
            IsAdditional: 'false',
            DB_Syncstatus: "false",
            // Description: this.description ? this.description : "",
            Comments: this.timeData.days[i].notes ? this.timeData.days[i].notes : "",
            SerialNumber: this.serial_number ? this.serial_number : "",
            TagNumber: this.tag_Number ? this.tag_Number : "",
            ResourceId: this.valueProvider.getResourceId(),
            //Preeti Varshney 05/09/2019 added Job_Number to save
            Job_Number: this.timeData.Job_Number,
            //Preeti Varshney 05/09/2019 Added modified date to store Modified date on Oracle DB and Local DB
            ModifiedDate: new Date(),
            //Preeti Varshney 05/09/2019 Added Job_Type to save
            Job_Type: this.Job_Type ? this.Job_Type : this.timeData.days[i].Job_Type,
            //Preeti Varshney 05/20/2019 Added isPicked to save
            isPicked: this.timeData.isPicked,
            OracleDBID: this.valueProvider.getUserId(),
            Sync_Status: null,
            isDeleted: "false",
            isSubmitted: "false",
            EntryDate: moment(this.timeData.days[i].entryDate).format('YYYY-MM-DD'),
            Duration: this.timeData.days[i].duration,
            Date:this.timeData.days[i].Date
          });
          dataObject.push(data);
        }

      }
      this.localService.insertTimeBatch(dataObject).then((res): any => {
        // dataObject['Time_Id'] = res;
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'saveEdits',' Error in insertTimeBatch : '+ JSON.stringify(error));
      });
      this.timeRedirect();
    }


  }

  /*
  * Narsimha Sanapala 04/12/2019
  * Delete time entry functionality enhanced
  */
  delete() {
    let alertMessage = "";
    if (this.weekBtnClicked == true) {
      alertMessage = "You are about to delete the time entries associated with " + this.delWeekStarts + " to " + this.delWeekEnds + " of the week. Are you sure you want to proceed?";

    } else {
      alertMessage = "Are you sure you want to Delete this time entry?";
    }
    let alert = this.utilityProvider.confirmationAlert('Alert', alertMessage);
    alert.present();
    alert.onDidDismiss((response) => {
      if (response) {
        this.deleteTimeEntries();
        this.timeRedirect();
      }
    });
  }

  deleteTimeEntries() {
    // Preeti Varshney 04/26/2019 expand All is false initially
    let timeData = this.timeData.days ? this.timeData.days : [this.timeData.Time_Id];
    var timeIds = [];
    if (timeData.length == 7) {
      timeIds = timeData.map(time => time.Time_Id).filter(time => (time !== "" && time !== undefined));
    } else {
      timeIds = timeData;
    }
    if (timeIds.length) {
      this.localService.deleteBulkTimeObject(timeIds);
    }
  }

  timeRedirect() {
    if (!this.nonClarityPage) {
      this.appCtrl.getRootNav().setRoot("DebriefPage", { save: "true", taskid: this.taskId });
    } else {
      let data = { type: 'deleteTimeEntry', afterEditWeek: true };
      this.events.publish("setWeekDay", data);
      this.appCtrl.getRootNav().setRoot("TimeNonclaritylistPage", { afterEditWeek: true });
    }
  }

  onShowPicker(event) {
    event.dayHoverHandler = this.utilityProvider.singleClickDaySelector(event, this.dp1, this.dp2);
  }

  getDurationOnDate(selected?) {
    this.service_end_date = this.service_start_date;
    if(this.End_Time == '00:00'){
      this.service_end_date = new Date(moment(this.service_start_date).add(1, 'day').toString())
    }
    let startTime = this.formatDateTime(this.service_start_date, this.Start_Time);
    let endTime = this.formatDateTime(this.service_end_date, this.End_Time);
    if (moment(startTime).isSame(endTime)) {
      let initialDurartion = this.utilityProvider.getTimeDuration(0, 0);
      this.duration = moment(initialDurartion).format('HH:mm');
      // this.bannerDuration = "8 Hours, 0 Minutes";
    }
    else {
      if (moment(startTime).isAfter(endTime)) {
        this.service_end_date = this.service_start_date;
        let d = new Date();
        d.setHours(this.Start_Time.split(":")[0]);
        d.setMinutes(this.Start_Time.split(":")[1]);
        this.End_Time = d;
      }
      else {
        this.getDuration(startTime, endTime);
      }
    }
  }

  formatDateTime(date, time) {
    let service_date = moment(date).format("YYYY-MM-DD");

    let formatDate = moment(service_date + ' ' + time).format("DD-MM-YYYYTHH:mm");
    let dateTime = moment(formatDate, "DD-MM-YYYYTHH:mm");
    return dateTime;
  }

  formatDuration(duration) {
    if (duration.split(":")[0].length == 1) {
      let hours = "0" + duration.split(":")[0];
      duration = hours + ":" + duration.split(":")[1];
    }
    if (duration.split(":")[1].length == 1) {
      let mins = "0" + duration.split(":")[1];
      duration = duration.split(":")[0] + ":" + mins;
    }
    return duration;
  }


  getTimeOnChange(event, type) {

    if ((!this.Start_Time && !this.End_Time) || (this.Start_Time == 'Invalid date' && this.End_Time == 'Invalid date')) {
      this.duration =  '00:00';
      return;
    }
    if (event == null) {
      this.duration =  '00:00';
      return;
    }

    this[type] = moment(event).format('HH:mm');

    if(this.End_Time=='00:00'){
      this.service_end_date=new Date(moment(this.service_start_date).add(1, 'day').toString())
    }
    else{
      this.service_end_date=new Date(moment(this.service_start_date).add(0, 'day').toString())
    }

    let startTimeVal : any = this.service_start_date;
    let endTimeVal: any = this.service_end_date ;

    switch (type) {
      case 'Start_Time':
        startTimeVal = this.utilityProvider.formatDateTime(this.service_start_date, this.Start_Time);
        endTimeVal = this.utilityProvider.formatDateTime(this.service_end_date, this.End_Time);
        if (moment(startTimeVal).isSameOrAfter(endTimeVal) || !this.End_Time || this.End_Time == 'Invalid date') {
          this.End_Time = this.utilityProvider.getDateFormatTime(this.service_start_date, this.Start_Time);
        }
        else {
          this.getDuration(startTimeVal, endTimeVal);
        }
        break;
      case 'End_Time':
        startTimeVal = this.utilityProvider.formatDateTime(this.service_start_date, this.Start_Time);
        endTimeVal = this.utilityProvider.formatDateTime(this.service_end_date, this.End_Time);

        if (!this.Start_Time || this.Start_Time == 'Invalid date') {
          this.Start_Time = this.utilityProvider.getDateFormatTime(this.service_end_date, this.End_Time);
        } else{
          this.getDuration(startTimeVal, endTimeVal);
          let startTimes = this.utilityProvider.formatDateTime(this.service_start_date, this.Start_Time);
          let endTimes = this.utilityProvider.formatDateTime(this.service_end_date, this.End_Time);
          this.onDateTimeComparison(startTimes, endTimes);
        }
        break;
    }
  }

  getDuration(startTime, endTime) {
    // Sana
    let totalTimeInMin: any;
    let updateHours: any;
    let updateMin: any;
    let diffDates = endTime.diff(startTime, 'days');
    
    if (diffDates == 0 || this.Start_Time == '00:00' && this.End_Time == '00:00') {
      // totalTimeInMin = ((((24 - startTime._d.getHours()) + endTime._d.getHours()) * 60) + (endTime._d.getMinutes() - startTime._d.getMinutes()));
        totalTimeInMin = moment.duration(endTime.diff(startTime)).asMinutes();
        if(diffDates > 1){
          totalTimeInMin = 0;
        }
        updateHours = Math.floor(Math.abs(totalTimeInMin / 60));
        updateMin = Math.floor(totalTimeInMin % 60);
    } else {
      let diffDates = endTime.diff(startTime, 'days') + 1;
      let endHours = (endTime._d.getHours() == 0 && endTime._d.getMinutes() == 0) ? 24 : endTime._d.getHours();
      totalTimeInMin = (((endHours - (startTime._d.getHours())) * 60) + (endTime._d.getMinutes() - startTime._d.getMinutes()));
      //if (diffDates > 0 && moment(startTime).format("HH:mm") > moment(endTime).format("HH:mm"))
        // totalTimeInMin = ((((24 - endTime._d.getHours()) - (startTime._d.getHours())) * 60) + (endTime._d.getMinutes() - startTime._d.getMinutes()));
        updateHours = Math.floor(Math.abs((totalTimeInMin * diffDates) / 60));
        updateMin = Math.floor((totalTimeInMin * diffDates) % 60);
    } 

      if (isNaN(totalTimeInMin) || totalTimeInMin  <= 0) {
        let initialDurartion = this.utilityProvider.getTimeDuration(0, 0);
        this.duration = moment(initialDurartion).format('HH:mm');
        this.isDateError = true;
      } else{
        if (updateHours <= 9) {
          this.duration = ('0' + updateHours).slice(-2) + ":" + ('0' + +updateMin).slice(-2);
        } else {
          this.duration = updateHours + ":" + ('0' + +updateMin).slice(-2);
        }
        this.isDateError = false;
      }
  }

  onDateTimeComparison(startTime, endTime) {
    let startt_Cdate = this.utilityProvider.getFormatTime(this.Start_Time);
    let endd_Cdate = this.utilityProvider.getFormatTime(this.End_Time);
    let startDuration = this.utilityProvider.getTimeDuration(0, 0);
    let defaultTime = moment(startDuration).format('HH:mm');
    let initialDurartion = this.utilityProvider.getTimeDuration(0, 0);
    let isSameDate = moment(this.service_start_date).isSame(this.service_end_date);

    if (this.Start_Time == defaultTime && this.End_Time == defaultTime && isSameDate) {
      this.duration = moment(initialDurartion).format('HH:mm');
      this.isDateError = false;
    }

    if (this.Start_Time == defaultTime && this.End_Time == defaultTime && !isSameDate) {
      this.getDuration(startTime, endTime);
    }
    this.End_Time = (this.End_Time || '');

    if (endd_Cdate < startt_Cdate) {
      this.isDateError = true;
      this.getDuration(startTime, endTime);
    }
    if (this.Start_Time != defaultTime && this.End_Time != defaultTime || this.Start_Time == defaultTime && this.End_Time != defaultTime) {
      if (endd_Cdate < startt_Cdate) {
        this.getDuration(startTime, endTime);
      } else {
        this.isDateError = false;
        this.getDuration(startTime, endTime);
        if (this.duration.toString() == "00:00") {
          this.isDateError = true;
        } else {
          this.isDateError = false;
        }
      }
    }
  };


  setDefaultTimeObject() {
    this.Start_Time = "";
    this.End_Time = "";
    let initialStartAndEnd = new Date;
    initialStartAndEnd.setHours(0);
    initialStartAndEnd.setMinutes(0);
    let initialDurartion = new Date;
    initialDurartion.setHours(8);
    initialDurartion.setMinutes(0);
    this.Start_Time = moment(initialStartAndEnd).format('HH:mm');
    this.End_Time = moment(initialStartAndEnd).format('HH:mm');
    this.duration = moment(initialDurartion).format('HH:mm');

    if(this.End_Time == '00:00'){
      this.service_end_date = (moment(this.timeData.Date).add(1, 'day')).format('YYYY-MM-DD');
    }
  }

  getchargemethod() {
    //03/13/2019 Zohaib Khan: Filtering charge method with no non-billable option.
    this.localService.getChargeMethod().then((res: any) => {
      this.chargemethod = res.filter(item => {
        return item.Value != "Non-Billable";
      });
    });
  }

  selectChargeMethodName(value) {
    this.charge_method = '';
    let filtered = this.chargemethod.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.charge_method = filtered.Value;
    }
  }

  getActivityName() {
    this.localService.getActivityNameByWorkTypeId(this.Work_Type_Id).then((res: any) => {
      this.activityName = res;
    });
  }

  getShiftCodes() {
    this.localService.getShiftCodes().then((res: any) => {

      this.shiftCodes = res.filter(item => {
        return item.Shift_Code && item.Shift_Code != '';
      });
    });
  }

  toggleSearchDropdownActivity() {
    this.isDropdownVisibleActivity = !this.isDropdownVisibleActivity;
  }
  hideSearchDropdownActivity() {
    this.isDropdownVisibleActivity = false;

  }
  hideSearchSelectDropDownActivity(childClick) {
    if (this.ValueActivity && this.ValueActivity != '') {
      this.activity_name = this.ValueActivity
    }
    setTimeout(() => {
      if (!childClick) {
        this.hideSearchDropdownActivity();
      }
    }, 100)
  }

  setSelectedValueActivity(value) {
    this.ValueActivity = "";
    this.activity_name = value;
  }
  /**
     * Preeti Varshney 04/05/2019
     * open search  box model
    */
  searchModal(data) {
    let dataArray: any = [];
    switch (data) {
      case 'jobids':
        dataArray = this.allJobIDs;
        break;
      case 'activityName':
        dataArray = this.activityName;
        break;
      case 'shiftCodes':
        dataArray = this.shiftCodes;
        break;
      case 'chargemethod':
        dataArray = this.chargemethod;
        break;
      default:
        break;
    }
    let searchModal = this.utilityProvider.showModal("TimesheetDropdownPage", { dataSource: dataArray, type: data }, { enableBackdropDismiss: false, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        switch (data.type) {
          case 'jobids':
            this.job_Id = data.LookupValue;
            break;
          case 'activityName':
            this.activity_name = data.LookupValue;
            //Preeti Varshney 05/09/2019 added Work_Type_Id to save
            this.Work_Type_Id = data.ID;
            this.desShow = true;
            this.isEntryDuplicated = true;
            break;
          case 'shiftCodes':
            this.item = data.LookupValue;
            //Preeti Varshney 05/09/2019 added Item_Id to save
            this.Item_Id = data.ID;
            break;
          case 'chargemethod':
            this.charge_method_Id = data.ID;
            this.charge_method = data.LookupValue;
            break;
          default:
            break;
        }
      }
    });
  }
  /**
     * Preeti Varshney 04/05/2019
     * check character limit for description , should be less than 255
    */
  _keyPressInText(event: any) {
    if (event.target.textLength > 254) {
      event.preventDefault();
    }
  }
  /**
 *@ Prateek 02/05/2019
 *Get job type for related job id
 * @memberof NonClarityTimeEntryPage
 */
  getJobType(timeId) {
    this.localService.getJobTypetime(timeId).then((res: any) => {
      if (res) {
        this.manageCheckbox(res, '');
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getJobType',' Error in getJobTypetime : '+ JSON.stringify(error));
    });
  }

  manageCheckbox(value, item) {
    if (value) {
      if (value[0].Job_Type == 'depot') {
        this.vacEntry = false;
        this.depotClicked = true;
        this.isDepot = true;
        this.isField = false;
        this.Job_Type = 'depot'
      }
      if (value[0].Job_Type == 'field') {
        this.vacEntry = true;
        this.depotClicked = false;
        this.isField = true;
        this.isDepot = false;
        this.Job_Type = 'field'
      }
    }
    else {
      if (item == 'field') {
        this.vacEntry = true;
        this.depotClicked = false;
        this.Job_Type = 'field'
      }
      if (item == 'depot') {
        this.vacEntry = false;
        this.depotClicked = true;
        this.Job_Type = 'depot'
      }
    }
    //this.item = '';
    //this.setDefaultTimeObject('');
  }

  /**
 *@ Prateek 02/05/2019
 *Get job type for related job id
 * @memberof NonClarityTimeEntryPage
 */
  getSTjob() {
    this.localService.getSTjob(this.activity_name).then((res: any) => {
      if (res) {
        if (res[0].OP_Code_ID == '1') {
          this.vacClick = true
        }
        else {
          this.vacClick = false
        }

      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName,'getSTjob', ' Error in getSTjob : ' + JSON.stringify(error));
    });
  }

  ionViewWillLeave() {
    this.events.unsubscribe('refreshEditpageData');
  }

}
