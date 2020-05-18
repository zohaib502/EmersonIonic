import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events, Platform } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from "moment";
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../providers/logger/logger';
import { ValueProvider } from '../../../providers/value/value';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { UtilityProvider } from '../../../providers/utility/utility';
@IonicPage()
@Component({
  selector: 'non-clarity-page-time-entry',
  templateUrl: 'non-clarity-time-entry.html',
})
export class NonClarityTimeEntryPage implements OnInit {
  formGroup: FormGroup;
  fileName: any = 'Time_Entry_Page';
  isjobId: boolean = false;
  header_data: any;
  duration;
  taskId;
  service_start_date: any;
  service_end_date: any;
  Start_Time;
  End_Time;
  isDateError: boolean = false;
  vacEntry: boolean = true;
  charge_method;
  chargemethod: any[] = [];
  activityName: any = [];
  shiftCodes: any = [];
  jobIdLimit: any = 10;
  job_Id: any = '';
  showjob_Id: any;
  allJobIDs: any = [];
  isDropdownVisible: boolean = false;
  isDropdownVisibleActivity: boolean = false;
  Value: any;
  activity_name: any;
  item: any;
  charge_method_Id: any;
  description: any;
  serial_number: any;
  tag_Number: any;
  notes: any;
  vacClick: boolean = false;
  desShow: boolean = false;
  isEntryDuplicated: boolean = true;
  durationCheck = false;
  depotClicked: boolean = false;
  @ViewChild('dp') dp1: BsDatepickerDirective;
  @ViewChild('dps') dp2: BsDatepickerDirective;
  bannerDuration: string;
  datepickerConfig: Partial<BsDatepickerConfig>;
  minDate: Date = new Date(new Date().setDate(new Date().getDate() - 90));
  Item_Id: any;
  Work_Type_Id: any;
  isDepot: boolean;
  isField: boolean;
  Job_Type: any;
  isDisabled: boolean = false;
  nightShift: boolean = false;
  clickedOnce: boolean = false;
  vac: boolean = false;
  constructor(public utilityProvider: UtilityProvider, public navCtrl: NavController,
    public navParams: NavParams, public appCtrl: App, public events: Events, public localService: LocalServiceProvider,
    public logger: LoggerProvider, public valueProvider: ValueProvider, public platform: Platform) {
    this.datepickerConfig = Object.assign({}, {
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false
    });

    this.taskId = this.navParams.get('taskId');
    this.vacEntry = this.navParams.get('vacationentry')
    this.vacClick = this.navParams.get('vacClick');
    this.vac = this.navParams.get('vac');
    //Preeti Varshney 05/15/2019 If vacation entry then Job Type is vacation
    if (!this.vacClick) {
      this.Job_Type = 'vacation';
      this.Item_Id = 2;
    }
    //console.log("JOBTYPE", this.Job_Type)
    this.getActivityName();
    if (this.taskId != undefined || this.taskId != null) {
      this.header_data = { title1: "Debrief", title2: "Job #", taskId: this.taskId };
      this.job_Id = this.navParams.get('taskPk');
      //this.getJobType(this.taskId);
      //this.mapKeys(this.taskId)
    }
    else {
      this.header_data = { title1: "", title2: "Timesheet", taskId: '' };
    }
    this.bannerDuration = " 8 Hours, 0 Minutes";
  }

  ionViewDidEnter() {
    if (this.vacEntry == false) {
      this.header_data = { title1: "", title2: "", taskId: "Vacation/Sick Day" };
      this.item = "ST"
    }
    this.setDefaultTimeObject('');
    this.loadData();
    this.events.publish('user:created', "Time");
    if (this.taskId != undefined || this.taskId != null) {
      this.getJobType(this.taskId);
    }
  }

  loadData() {
    this.getShiftCodes();
    this.getchargemethod();
    this.initStartTime();
    this.getallTasks();

  }

  ngOnInit() {
    this.resetDates('');
    if (this.vacClick) {
      this.formGroup = new FormGroup({
        radioButtons: new FormControl('')
      })
    }

  }

  initStartTime() {
    this.End_Time = this.Start_Time = null;
    this.duration = '00:00';
  }

  resetDates(value) {
    if (value == '' || value == 'save') {
      this.service_start_date = new Date();
      this.service_end_date = new Date();
    }
  }

  saveTimeObject(value) {
    // By Vivek on 26APR2019
    this.clickedOnce = true;
    //Prateek --05/27/2019 ETS-649 Can a user create a time entry before he creates a Job? Will that time entry show up in the Time tab (Debrief)? --
    this.localService.getTaskNumberTime(this.showjob_Id).then((tasknumber: any) => {
      if (tasknumber.length > 0) {
        this.job_Id = tasknumber[0].Task_Number;
        this.saveTimelist(value)
      }
      else {
        this.localService.getTaskNumber(this.showjob_Id).then((res: any) => {
          if (res.length > 0) {
            // console.log("JOBNUMBER", res)
            this.job_Id = res[0].Task_Number;
            this.saveTimelist(value)
          }
          else {
            this.job_Id = '';
            this.job_Id = parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000)));
            this.saveTimelist(value)
          }
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'saveTimeObject', ' Error in getTaskNumber : ' + JSON.stringify(error));
        });
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'saveTimeObject', ' Error in getTaskNumberTime : ' + JSON.stringify(error));
    });
    //this.job_Id = this.job_Id == "" && this.depotClicked ? parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000))) : this.job_Id;
    //this.saveTimelist(value);

    //this.job_Id = this.job_Id == "" && this.depotClicked ? parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000))) : this.job_Id;

  }

  async saveTimelist(value) {
    let timeObjectToInsert = [];
    let durationData = this.getUpdatedDuration();
    let allDates = this.getAllDatesBetweenStartAndEnd(this.service_start_date, durationData.totalDays);
    for (let i = 0; i < durationData.totalDays; i++) {
      let timeObject = {
        Work_Type: this.activity_name ? this.activity_name : "",
        Duration: durationData.formatedDuration,
        Item: this.item ? this.item : '',
        //Preeti Varshney 05/05/2019 if depot is selected charge method field should be blank
        Charge_Method: (this.charge_method && this.depotClicked == false) ? this.charge_method : "",
        //Preeti Varshney 05/05/2019 if depot is selected charge method Id field should be blank
        Charge_Method_Id: this.charge_method_Id && this.depotClicked == false ? this.charge_method_Id.toString() : "",
        Start_Time: this.Start_Time,
        End_Time: this.End_Time,
        // Service_Start_Date: moment.utc(this.service_start_date).format("DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A"),
        // Service_End_Date: moment.utc(this.service_end_date).format("DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A"),
        Service_Start_Date: this.service_start_date,
        Service_End_Date: this.service_end_date,
        Task_Number: this.job_Id,
        Time_Id: String(this.utilityProvider.getUniqueKey()),
        IsAdditional: 'false',
        // Description: this.description ? this.description : "",
        Comments: this.description ? this.description : "",
        //Preeti Varshney 05/05/2019 if depot is selected serial number field should be blank
        SerialNumber: this.serial_number && this.depotClicked == false ? this.serial_number : "",
        //Preeti Varshney 05/05/2019 if depot is selected tag number field should be blank
        TagNumber: this.tag_Number && this.depotClicked == false ? this.tag_Number : "",
        Notes: this.description ? this.description : "",

        EntryDate: allDates[i],
        ResourceId: this.valueProvider.getResourceId(),
        OracleDBID: this.valueProvider.getUserId(),
        DB_Syncstatus: "false",
        Job_Number: this.showjob_Id,
        Work_Type_Id: this.Work_Type_Id,
        Item_Id: this.Item_Id,
        Date: this.service_start_date ? this.service_start_date : new Date(),
        Job_Type: this.Job_Type ? this.Job_Type : "",
        isPicked: this.Job_Type == "vacation" ? null : "true",
        isDeleted: "false",
        isSubmitted: "false",
        // 05/07/2019 Mayur Varshney Added modified date to store Modified date on Oracle DB and Local DB
        ModifiedDate: new Date()
      };
      timeObjectToInsert.push(timeObject);
    }

    let finalObject = this.validateDoubleEntries(timeObjectToInsert, durationData);
    finalObject = await this.changeStartEndTime(finalObject);
    if (finalObject && finalObject.length) {
      this.saveTime(finalObject, value, allDates);
    }
  }

  async changeStartEndTime(timeObject){
    timeObject.forEach(element => {
      element.Service_Start_Date =  moment(element.EntryDate + " " + element.Start_Time).toDate().toString();
      element.Service_End_Date =  element.End_Time == '00:00' ? moment((moment(element.EntryDate).add(1, 'day')).format('YYYY-MM-DD') + " " + element.End_Time).toDate().toString() : moment(element.EntryDate + " " + element.End_Time).toDate().toString();
    });
    return timeObject;
  }

  saveTime(timeObjectToInsert, value, allDates) {
    let searchDates: any = {
      "startDate": allDates[0],
      "endDate": allDates[allDates.length - 1]
    };
    // this.validateDateRange(timeObjectToInsert, allDates);
    // if (allDates.length > 2 && timeObjectToInsert[0].End_Time == "00:00") {
    //   this.promptInvalidAlert("End Time should not be 00:00 for the entry.");
    //   this.clickedOnce = false;
    //   return;
    // } else 
    if (allDates.length > 2 && timeObjectToInsert[0].Start_Time > timeObjectToInsert[0].End_Time) {
      this.promptInvalidAlert("Start time should be lesser than end time for time entry.");
      this.clickedOnce = false;
      return;
    }
    this.localService.getCountTimeEntries(timeObjectToInsert, 'firstCheck', false).then((res: any[]) => {
      // First check for same time entry
      if (res && res.length == 0) {
        this.localService.getCountTimeEntries(timeObjectToInsert, 'secondcheck', false).then((res: any[]) => {
          // Second check for overlapping time entry
          if (res && res.length == 0) {
            this.insertTimeBatch(timeObjectToInsert, value);
          } else {
            this.promptAlert(res);
          }
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'saveTime', ' Error in getCountforMatchedTime : ' + JSON.stringify(error));
        });
      } else {
        this.promptAlert(res);
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'saveTime', ' Error in getCountforMatchedTime : ' + JSON.stringify(error));
    });
  }

  insertTimeBatch(timeObjectToInsert, value) {
    this.localService.insertTimeBatch(timeObjectToInsert).then((res): any => {
      timeObjectToInsert['Time_Id'] = res;
      if (value == 'NewActivity' || value == 'SaveAndNew') {
        this.setDefaultTimeObject(value);
        this.clickedOnce = false;
      } else {
        setTimeout(() => {
          this.timeRedirect();
        }, 200);
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'insertTimeBatch', ' Error in insertTimeBatch : ' + JSON.stringify(error));
    });
  }

  promptAlert(res) {
    this.utilityProvider.stopSpinner();
    //Preeti Varshney 04/30/2019 Promt alert
    let duplicateEntryDate = moment(res[0].EntryDate, 'YYYY-MM-DD').format('DD-MMM-YYYY');
    let duplicateStart_Time = res[0].Start_Time;
    let duplicateEnd_Time = res[0].End_Time;
    let Job_Number = res[0].Job_Number;
    if (Job_Number == null) Job_Number = 'Not Applicable (Absences / Internal)';
    let alert = this.utilityProvider.promptAlert('', 'Overlapping time entry exists (Job ID: ' + Job_Number + ' Date: ' + duplicateEntryDate + ' Start Time: ' + duplicateStart_Time + ' End Time: ' + duplicateEnd_Time + ')');
    this.clickedOnce = false;
    alert.present();
  }

  promptInvalidAlert(message) {
    this.utilityProvider.stopSpinner();
    let alert = this.utilityProvider.promptAlert('Invalid Entry', message);
    alert.present();
  }

  // This method is used for double time entries during night shift
  validateDoubleEntries(timeObjectToInsert, durationData) {
    this.nightShift = false;
    if (durationData.totalDays == 2 && this.Start_Time < "24" && this.End_Time < "24" && (this.Start_Time > this.End_Time)) {
      timeObjectToInsert[0].End_Time = "24:00";
      timeObjectToInsert[1].Start_Time = "00:00";

      for (let i = 0; i < timeObjectToInsert.length; i++) {
        let duration = moment.duration(moment(timeObjectToInsert[i].End_Time, "HH:mm").diff(moment(timeObjectToInsert[i].Start_Time, "HH:mm")));
        let hours = parseInt("" + duration.asHours());
        let minutes = parseInt("" + duration.asMinutes()) - hours * 60;
        let formattedDuration = (hours <= 9) ? ('0' + hours).slice(-2) + ":" + ('0' + +minutes).slice(-2) : hours + ":" + ('0' + +minutes).slice(-2);
        timeObjectToInsert[i].Duration = formattedDuration;
      }
      timeObjectToInsert[0].End_Time = "00:00";
      if (timeObjectToInsert[1].Duration == "00:00") {
        timeObjectToInsert.length = 1;
        timeObjectToInsert.length = 1;
        return timeObjectToInsert;
      }
      this.nightShift = true;
    }
    return timeObjectToInsert;
  }


  getUpdatedDuration() {
    let formatedDuration;
    var startDate = this.utilityProvider.formatDateTime(this.service_start_date, "00:00");
    var endDate = this.utilityProvider.formatDateTime(this.service_end_date, "00:00");
    let totalDays = endDate.diff(startDate, 'days') + 1;

    if ((this.End_Time == '00:00' && this.Start_Time == '00:00')
    || totalDays == 1) {
        if(totalDays == 1){
          formatedDuration = this.duration;
        } else{
          formatedDuration = '24:00';
          totalDays -= 1;
        }
      }
    else {
      let totalDurationHoursInMins = parseInt(this.duration.split(':')[0]) * 60;
      let totalDurationMins = parseInt(this.duration.split(':')[1]) + totalDurationHoursInMins;
      let dividedTimeInMins = totalDurationMins / totalDays;
      let updateHours = Math.floor(Math.abs(dividedTimeInMins / 60));
      let updateMin = Math.floor(dividedTimeInMins % 60);

      if (updateHours <= 9) {
        formatedDuration = ('0' + updateHours).slice(-2) + ":" + ('0' + +updateMin).slice(-2);
      }
      else {
        formatedDuration = updateHours + ":" + ('0' + +updateMin).slice(-2);
      }
    }
    return { 'totalDays': totalDays, 'formatedDuration': formatedDuration }
  }

  getAllDatesBetweenStartAndEnd(startDate, totalDays) {
    let allDates = [];
    for (var i = 0; i < totalDays; i++) {
      var date = new Date(String(startDate));
      date.setDate(date.getDate() + i);
      allDates.push(moment(date).format('YYYY-MM-DD'));
    }
    return allDates;
  }

  timeRedirect() {
    if (this.isjobId == true) {
      this.appCtrl.getRootNav().setRoot("DebriefPage", { save: "true", taskid: this.taskId });
    }
    else {
      this.appCtrl.getRootNav().setRoot("TimeNonclaritylistPage", { save: "true" });
    }
  }

  onShowPicker(event) {
    event.dayHoverHandler = this.utilityProvider.singleClickDaySelector(event, this.dp1, this.dp2);
  }

  getDurationOnDate() {
    
    let startTime, endTime
    if((this.Start_Time == null || this.Start_Time  == 'Invalid Date') || (this.End_Time == null || this.End_Time  == 'Invalid Date')){
      startTime = this.utilityProvider.formatDateTime(this.service_start_date, '00:00');
      endTime = this.utilityProvider.formatDateTime(this.service_end_date, '00:00');
    }else{
      startTime = this.utilityProvider.formatDateTime(this.service_start_date, this.Start_Time);
      endTime = this.utilityProvider.formatDateTime(this.service_end_date, this.End_Time);
    }
    if (moment(startTime).isSame(endTime)) {
      let initialDurartion = this.utilityProvider.getTimeDuration(0, 0);
      this.duration = moment(initialDurartion).format('HH:mm');
      this.bannerDuration = "8 Hours, 0 Minutes";
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

  _keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
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


  setDefaultTimeObject(value) {
    this.desShow = false;
    this.Start_Time = "00:00";
    this.End_Time = "00:00";
    let initialStartAndEnd = new Date;
    initialStartAndEnd.setHours(0);
    initialStartAndEnd.setMinutes(0);
    let initialDurartion = new Date;
    initialDurartion.setHours(0);
    initialDurartion.setMinutes(0);
    this.Start_Time = moment(initialStartAndEnd).format('HH:mm');
    this.End_Time = moment(initialStartAndEnd).format('HH:mm');
    this.duration = moment(initialDurartion).format('HH:mm');
    this.serial_number = '';
    this.activity_name = '';
    this.tag_Number = '';
    this.item = this.vacEntry == false && this.depotClicked == false ? this.item : '';
    this.charge_method_Id = '';
    this.charge_method = '';
    this.notes = '';
    this.job_Id = (value == 'NewActivity' ? this.job_Id : '' || this.taskId != undefined ? this.job_Id : '');
    this.Value = '';
    this.description = '';
    this.resetDates(value);
    this.initStartTime();
    if (value == 'SaveAndNew') {
      if (this.taskId != undefined || this.taskId != null)
        this.showjob_Id = this.taskId;
      else
        this.showjob_Id = ''
    }
    else {
      this.showjob_Id = (value == 'NewActivity' ? this.showjob_Id : '' || this.showjob_Id != undefined ? this.showjob_Id : '');
    }

    if (this.vacClick) {
      this.Job_Type = '';
      this.isDepot = false;
      this.isField = false;
      this.clearForm();
    }
  }

  clearForm() {
    this.formGroup.reset();
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
    this.localService.getActivityName().then((res: any = []) => {
      if (res.length > 0) {
        if (this.vacEntry == false) {
          this.activityName = res.filter(function (item) {
            return item.OP_Code_ID == "1";
          });
        }
        else {
          this.activityName = res.filter(function (item) {
            return item.OP_Code_ID == "0";
          });
        }

        //activityName
      }

    });
  }

  getShiftCodes() {
    this.localService.getShiftCodes().then((res: any) => {

      this.shiftCodes = res.filter(item => {
        return item.Shift_Code && item.Shift_Code != '';
      });
    });
  }


  toggleSearchDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }


  hideSearchDropdown() {
    this.isDropdownVisible = false;
  }

  hideSearchSelectDropDown(childClick) {
    if (this.Value && this.Value.replace(/\s/g, '') != '') {
      this.job_Id = this.Value
    }
    else {
      this.job_Id = '';
      this.Value = '';
    }
    setTimeout(() => {
      if (!childClick) {
        this.hideSearchDropdown();
      }
    }, 100)
  }
  setSelectedValue(value) {
    this.Value = "";
    this.job_Id = value;
  }

  getallTasks() {
    this.localService.getTaskForTimeSheet().then((res: any) => {
      for (let i = 0; i < res.length; i++) {
        res[i].LookupValue = res[i].Task_Number;
      }
      this.allJobIDs = res;
      if (this.taskId != undefined) {
        this.showjob_Id = this.taskId
        //this.job_Id = this.taskId;
        this.isjobId = true
        this.mapKeys(this.taskId);
      }
    });
  }

  toggleSearchDropdownActivity() {
    this.isDropdownVisibleActivity = !this.isDropdownVisibleActivity;
  }

  hideSearchDropdownActivity() {
    this.isDropdownVisibleActivity = false;

  }

  hideSearchSelectDropDownActivity(childClick) {
    //this.ValueActivity = ''
    setTimeout(() => {
      if (!childClick) {
        this.hideSearchDropdownActivity();
      }
    }, 100)
  }

  setSelectedValueActivity(value) {
    //this.ValueActivity = "";
    this.activity_name = value;
    this.desShow = true;
  }

  manageCheckbox(value, item) {
    if (value) {
      if (value[0].FIELDREPAIR == 'true') {
        this.vacEntry = true;
        this.depotClicked = false;
        this.isDepot = false;
        this.isField = true;
        this.Job_Type = 'field'
        this.isDisabled = true

      }
      if (value[0].DEPOTREPAIR == 'true') {
        this.vacEntry = false;
        this.depotClicked = true;
        this.isField = false;
        this.isDepot = true;
        this.Job_Type = 'depot'
        this.isDisabled = true

      }
      if (!value[0].FIELDREPAIR && !value[0].DEPOTREPAIR) {
        this.vacEntry = true;
        this.depotClicked = false;
        this.isField = false;
        this.isDepot = false;
        this.Job_Type = '';
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
            this.job_Id = data.ID;
            //this.mapKeys(data.LookupValue)
            this.showjob_Id = data.LookupValue;
            // this.getJobType(this.showjob_Id);
            if (!this.vac) {
              this.getJobType(this.showjob_Id);
            }
            break;
          case 'activityName':
            this.activity_name = data.LookupValue;
            this.desShow = true;
            this.Work_Type_Id = data.ID;
            //  this.isEntryDuplicated = true;
            break;
          case 'shiftCodes':
            this.item = data.LookupValue;
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

  mapKeys(value) {
    if (this.job_Id == null || this.job_Id == undefined) {
      if (this.allJobIDs.length) {
        for (let i = 0; i < this.allJobIDs.length; i++) {
          if (this.allJobIDs[i].LookupValue == value) {
            this.job_Id = this.allJobIDs[i].PrimaryKey;
          }
          else {
            // this.job_Id = value;
            // 05/07/2019 -- Mayur Varshney -- save random number
            this.job_Id = this.job_Id ? this.job_Id : parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000)));
          }
        }
      } else {
        // 05/07/2019 -- Mayur Varshney -- save random number
        this.job_Id = parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000)));
      }
    }

    this.showjob_Id = value;
    //this.getJobType(this.job_Id);
  }

  /**
   *@ Prateek 02/05/2019
   *Get job type for related job id
   * @memberof NonClarityTimeEntryPage
   */
  getJobType(jobid) {
    this.localService.getFieldType(jobid).then((res: any) => {
      if (res) {
        this.manageCheckbox(res, '');
      }
      else {
        this.vacEntry = true;
        this.depotClicked = false;
        this.isField = false;
        this.isDepot = false;
        this.Job_Type = '';
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getJobType', ' Error in getJobType : ' + JSON.stringify(error));
    });
  }

  checkforspace() {
    this.showjob_Id = this.showjob_Id.trim();
  }

  ionViewWillLeave() {
    this.events.publish('deleteFromDebrief');
  }
}
