import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { ValueProvider } from '../../../../providers/value/value';
import { Platform } from 'ionic-angular';
import { LocalServiceProvider } from '../../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import * as moment from "moment";
import { UtilityProvider } from '../../../../providers/utility/utility';
/**
 * Generated class for the EditModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-modal',
  templateUrl: 'edit-modal.html',
})
export class EditModalPage implements OnInit {
  fileName: any = 'Edit_Modal';
  timeValid = false;
  chargemethod: any[] = [];
  jobname: any[] = [];
  chargetype: any[] = [];
  worktype: any[] = [];
  timeObject: any = {};
  timeObjects: any = {};
  clonetimeObject: any = {};
  items: any = [];
  public timeArraySummary = [];
  overtime: any[] = [];
  shiftcode: any[] = [];
  sTime: any;
  eTime: any;
  duration: any;
  titleModal: any;
  itemsList: any[] = [];
  comment: any;
  clarity_Name: any;
  charge_Type: any;
  work_Type: any;
  charge_method: any;
  iitem: any;
  date: any;
  clarity_Time: any;
  clarity_Shift: any;
  startTime: any;
  endTime: any;
  modalTitle: any;
  arrayLength: any;
  title_name: any;
  public newObject = {};
  userType: any;

  Field_Job_Name;
  Charge_Type;
  Charge_Method;
  Work_Type;
  Item;
  Time_Code;
  Shift_Code;
  Field_Job_Name_Id;
  Charge_Type_Id;
  Work_Type_Id;
  Charge_Method_Id;
  ifComment: any;
  ifJustification: any;
  editTime: any;
  CommentOnEdit;
  ifEdit: any;
  ifCopy: any;
  isDateError: any = false;
  commentFromField: any
  popoverEvent: any;
  isLaborTravelStandard = false;
  showSelects: boolean = true;
  service_start_date: Date;
  service_end_date: any;
  originalTime: any = [];
  minDate: Date;
  @ViewChild('dp') dp1: BsDatepickerDirective;
  @ViewChild('dps') dp2: BsDatepickerDirective;



  constructor(public utilityProvider: UtilityProvider, public events: Events, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public valueService: ValueProvider, public localService: LocalServiceProvider, public platform: Platform, public logger: LoggerProvider) {
    this.events.subscribe('langSelected', (res) => {
      // 10-12-18 Radheshyam - the dom will refresh and show the current language in dropbox.
      setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.gettimelist();
    this.clonetimeObject = this.navParams.get('timeObject');
    this.timeObject = Object.assign({}, this.clonetimeObject);
    this.timeObjects = Object.assign({}, this.clonetimeObject);

    // 05/13/2019 -- Mayur Varshney -- Set date to show selected date on calendar, datepicker
    this.service_start_date = new Date(this.timeObjects.Service_Start_Date);
    this.service_end_date = new Date(this.timeObjects.Service_End_Date);
    //Prateek 01/07/2019  :change service_start_date into date format in order to  open calender  in edit and copy
    this.minDate = new Date(this.service_start_date);
    //  this.minDate.setDate(this.minDate.getDate() + 1);
    //03/14/2019 -- Zohaib Khan -- Don't need to add 1 day on Servise end date minimum date. 
    this.minDate.setDate(this.minDate.getDate());

    if (this.timeObject.Item == "Travel- Standard" || this.timeObject.Item == "Labor- Standard") {
      this.isLaborTravelStandard = true;
    } else { this.isLaborTravelStandard = false; }
    if (this.timeObjects.Start_Time) {
      let startt_Cdate = new Date();
      startt_Cdate.setHours(this.timeObjects.Start_Time.split(":")[0]);
      startt_Cdate.setMinutes(this.timeObjects.Start_Time.split(":")[1]);
      this.timeObjects.Start_Time = startt_Cdate;
    }
    if (this.timeObjects.End_Time) {
      let endd_Cdate = new Date();
      endd_Cdate.setHours(this.timeObjects.End_Time.split(":")[0]);
      endd_Cdate.setMinutes(this.timeObjects.End_Time.split(":")[1]);
      this.timeObjects.End_Time = endd_Cdate;
    }

    //this.logger.log(this.fileName, 'ionViewDidLoad', this.timeObject.Date);
    //this.logger.log(this.fileName, 'ionViewDidLoad', "Time Object=" + JSON.stringify(this.timeObject));
    this.arrayLength = this.navParams.get('timeLength');
    this.popoverEvent = this.navParams.get('popoverEvent');

    //this.modalTitle=this.navParams.get('modalTitle');
    this.titleModal = this.modalTitle;
    //this.title_name=this.modalTitle;
    this.worktype = this.navParams.get('worktype');
    this.chargetype = this.navParams.get('chargetype');
    this.jobname = this.navParams.get('jobname');
    this.chargemethod = this.navParams.get('chargemethod');
    //JSON.parse(JSON.stringify(this.navParams.get('chargemethod')));
    this.items = this.navParams.get('items');
    this.itemsList = this.items;
    this.overtime = this.navParams.get('overtime');
    this.shiftcode = this.navParams.get('shiftcode');
    this.userType = this.navParams.get('usertype');
    this.ifComment = this.navParams.get('ifComment');
    this.ifJustification = this.navParams.get('ifJustification');
    this.editTime = this.navParams.get('editTime');
    this.originalTime = this.navParams.get('originalTime');
    //this.comment = this.navParams.get('justification');
    this.comment = this.navParams.get('commentText');
    //this.logger.log(this.fileName, 'ionViewDidLoad', this.comment);
    this.CommentOnEdit = this.navParams.get('commentOnEdit');
    this.ifEdit = this.navParams.get('ifEdit');
    this.ifCopy = this.navParams.get('ifCopy');
    if (this.items != undefined) {
      if (this.timeObject.Work_Type == "Labor") {
        this.itemsList = [];
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].Type == "Others") {
            //this.logger.log(this.fileName, 'ionViewDidLoad', JSON.stringify(this.items[i]));
            this.itemsList.push(this.items[i]);
          }
        }
      } if (this.timeObject.Work_Type == "Travel") {
        this.itemsList = [];


        this.timeObject.charge_method_Id = this.valueService.getTask().Travel_Method ? this.chargemethod.filter(item => {
          return item.Value == this.valueService.getTask().Travel_Method;
        })[0].ID : '';
        this.timeObject.charge_method = this.valueService.getTask().Travel_Method ? this.valueService.getTask().Travel_Method : '';
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].Type == "Travel") {
            //this.logger.log(this.fileName, 'ionViewDidLoad', JSON.stringify(this.items[i]));
            this.itemsList.push(this.items[i]);
          }
        }
      } if (this.timeObject.Work_Type != "Labor" && this.timeObject.Work_Type != "Travel") {
        this.itemsList = [];
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].Type == "Others") {
            //this.logger.log(this.fileName, 'ionViewDidLoad', JSON.stringify(this.items[i]));
            this.itemsList.push(this.items[i]);
          }
        }
      }
      if (this.Work_Type == "Deputation" || this.Work_Type == "Normal" || this.Work_Type == "Nightshift") {
        this.itemsList = [];
        this.timeObject.charge_method_Id = this.valueService.getTask().Labor_Method ? this.chargemethod.filter(item => {
          return item.Value == this.valueService.getTask().Labor_Method;
        })[0].ID : '';
        this.timeObject.charge_method = this.valueService.getTask().Labor_Method ? this.valueService.getTask().Labor_Method : '';
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].Type == "Others") {
            //this.logger.log(this.fileName, 'ionViewDidLoad', JSON.stringify(this.items[i]));
            this.itemsList.push(this.items[i]);
          }
        }
      }
    }
    //11/28/2018: Removing Non-Billable Charge method.
    // for (let i = 0; i < this.chargemethod.length; i++) {
    //   if (this.chargemethod[i].ID == 25) {
    //     this.chargemethod.splice(i, 1);
    //   }
    // }
    // if (this.timeObject.Work_Type_Id == 6) {
    //   //11/28/2018: pushing Non-Billable Charge method if work type is Break.
    //   //this.chargemethod.push({ ID: 25, Value: "Non-Billable", ResourceId: this.valueService.getResourceId() });
    //   this.timeObject.Charge_Method_Id = 25;
    //   this.timeObject.Charge_Type_Id = '';
    //   this.timeObject.Charge_Type = '';
    // }
    //12/14/2018 Zohaib Khan: Based on Break selection disabling all fields and selecting Non-billable charge method. 
    if (this.timeObject.Work_Type == 'Break') {
      this.chargemethod = this.valueService.getChargeMethod();
      let nonBillableID = this.chargemethod.filter(item => {
        return item.Value == "Non-Billable";
      })[0].ID;
      this.timeObject.Charge_Method_Id = parseInt(nonBillableID);
      this.timeObject.Charge_Type_Id = '';
      this.timeObject.Charge_Type = '';
    }
  }

  ngOnInit() {
    this.timeObjects.Service_Start_Date = new Date();
    this.timeObjects.Service_End_Date = new Date();
  }

  save() {
    if (this.ifJustification || this.CommentOnEdit) {
      //this.logger.log(this.fileName, 'save', "Inside save" + this.comment);
      this.viewCtrl.dismiss(this.comment);
    }
    else {
      //this.logger.log(this.fileName, 'save', "Copy Data=" + JSON.stringify(this.timeObject));
      if (this.timeArraySummary != undefined) {
        this.ifTimeValid();
      }
    }
  }

  selectFieldJobName(value) {
    //this.logger.log(this.fileName, 'selectFieldJobName', "event" + JSON.stringify(event));
    let filtered = this.jobname.filter(item => {
      return item.TaskCode == value;
    })[0];
    if (filtered != undefined) {
      this.timeObject.Field_Job_Name = filtered.JobName;
    }
  }

  selectChargeTypeName(value) {
    //this.logger.log(this.fileName, 'selectChargeTypeName', "event" + JSON.stringify(event));
    let filtered = this.chargetype.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.timeObject.Charge_Type = filtered.Value;
    }
  }

  selectWorkTypeName(value) {
    // console.log(value)
    //this.logger.log(this.fileName, 'selectWorkTypeName', "event" + JSON.stringify(event));
    //this.logger.log(this.fileName, 'selectWorkTypeName', "Items=" + JSON.stringify(this.items));
    // if (value == 6) {
    //   //11/28/2018: pushing Non-Billable Charge method if work type is Break.
    //   this.timeObject.Work_Type = "Break";
    //   this.chargemethod.push({ ID: 25, Value: "Non-Billable", ResourceId: this.valueService.getResourceId() });
    //   this.timeObject.Charge_Method_Id = 25;
    //   this.setEmptyOnBreak();
    // } else {
    for (let i = 0; i < this.chargemethod.length; i++) {
      if (this.chargemethod[i].ID == 25) {
        this.chargemethod.splice(i, 1);
      }
    }
    let filtered = this.worktype.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.timeObject.Work_Type = filtered.Value;
      //this.logger.log(this.fileName, 'selectWorkTypeName', JSON.stringify(this.timeObject.Work_Type));
      if (this.timeObject.Work_Type == "Labor" || this.timeObject.Work_Type == "Deputation" || this.timeObject.Work_Type == "Normal" || this.timeObject.Work_Type == "Nightshift") {
        this.itemsList = [];
        this.timeObject.Charge_Method_Id = this.valueService.getTask().Labor_Method ? this.chargemethod.filter(item => {
          return item.Value == this.valueService.getTask().Labor_Method;
        })[0].ID : '';
        this.timeObject.charge_method = this.valueService.getTask().Labor_Method ? this.valueService.getTask().Labor_Method : '';
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].Type == "Others") {
            //this.logger.log(this.fileName, 'selectWorkTypeName', JSON.stringify(this.items[i]));
            this.timeObject.Item_Id = "";
            this.itemsList.push(this.items[i]);
          }
        }
      } if (this.timeObject.Work_Type == "Travel") {

        this.timeObject.Charge_Method_Id = this.valueService.getTask().Travel_Method ? this.chargemethod.filter(item => {
          return item.Value == this.valueService.getTask().Travel_Method;
        })[0].ID : '';
        this.timeObject.charge_method = this.valueService.getTask().Travel_Method ? this.valueService.getTask().Travel_Method : '';

        this.itemsList = [];
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].Type == "Travel") {
            //this.logger.log(this.fileName, 'selectWorkTypeName', JSON.stringify(this.items[i]));
            this.timeObject.Item_Id = "";
            this.itemsList.push(this.items[i]);
          }
        }
      } if (this.timeObject.Work_Type != "Labor" && this.timeObject.Work_Type != "Travel") {
        this.itemsList = [];
        this.timeObject.Item = "";
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].Type == "Others") {
            //this.logger.log(this.fileName, 'selectWorkTypeName', JSON.stringify(this.items[i]));
            this.timeObject.Item_Id = "";
            this.itemsList.push(this.items[i]);
          }
        }
      }

      //12/14/2018 Zohaib Khan: Based on Break selection disabling all fields and selecting Non-billable charge method. 
      if (this.timeObject.Work_Type == 'Break') {
        this.chargemethod = this.valueService.getChargeMethod();
        let nonBillableID = this.chargemethod.filter(item => {
          return item.Value == "Non-Billable";
        })[0].ID;
        this.timeObject.Charge_Method_Id = parseInt(nonBillableID);
        this.setEmptyOnBreak();
      } else {
        this.chargemethod = this.valueService.getChargeMethod().filter(item => {
          return item.Value != "Non-Billable";
        });
      }

    }
    //  }
  }

  selectChargeMethodName(value) {
    //this.logger.log(this.fileName, 'selectChargeMethodName', "event" + JSON.stringify(event));
    let filtered = this.chargemethod.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.timeObject.Charge_Method = filtered.Value;
    }
  }

  // selectItemName(value) {
  //   //this.logger.log(this.fileName, 'selectItemName', "event" + JSON.stringify(event));
  //   let filtered = this.items.filter(item => {
  //     return item.ID == value;
  //   })[0];
  //   if (filtered != undefined) {
  //     this.timeObject.Item = filtered.Value;
  //   }
  // }

  // selectClarityTimeName(value) {
  //   //this.logger.log(this.fileName, 'selectClarityTimeName', "event" + JSON.stringify(event));
  //   let filtered = this.overtime.filter(item => {
  //     return item.OverTime_Shift_Code_ID == value;
  //   })[0];
  //   if (filtered != undefined) {
  //     this.timeObject.Time_Code = filtered.Overtimeshiftcode;
  //   }
  // }

  selectItemName(value) {
    let filtered = this.items.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.timeObject.Item = filtered.Value;
      if (this.timeObject.Item == "Travel- Standard" || this.timeObject.Item == "Labor- Standard") {
        this.isLaborTravelStandard = true;
        this.timeObject.Time_Code_Id = "";
      } else { this.isLaborTravelStandard = false; }
    }
  }

  selectClarityTimeName(value) {
    if (String(value) == '') {
      this.timeObject.Time_Code_Id = "";
    } else {
      let filtered = this.overtime.filter(item => {
        return item.OverTime_Shift_Code_ID == value;
      })[0];
      if (filtered != undefined) {
        this.timeObject.Time_Code = filtered.Overtimeshiftcode;
      }
    }
  }

  selectShiftCodeName(value) {
    //this.logger.log(this.fileName, 'selectShiftCodeName', "event" + JSON.stringify(event));
    let filtered = this.shiftcode.filter(item => {
      return item.Shift_Code_ID == value;
    })[0];
    if (filtered != undefined) {
      this.timeObject.Shift_Code = filtered.ShiftCodeName;
    }
  }

  /**
   *08062018 KW split dateTime coming in format(HH:mm) into to give hours and minutes
   *
   * @param {*} value
   * @returns
   * @memberof TimePage
   */
  getFormatTime(value) {
    let date = new Date();
    date.setHours(value.split(":")[0]);
    date.setMinutes(value.split(":")[1]);
    return date;
  }

  /**
  *
  *08/06/2018 Kamal set time in format(HH:mm) by passing hours and minutes
   
  * @param {*} value1 refer as hour
  * @param {*} value2 refer as minute
  * @returns duration
  * @memberof TimePage
  */
  getTimeDuration(value1, value2) {
    let duration = new Date();
    duration.setHours(value1);
    duration.setMinutes(value2);
    return duration;
  }

  /**
  *08/06/2018 Kamal convert hours into minutes in time provided in format(HH:mm) 
  *
  * @param {*} value will come in (HH:mm) format
  * @returns totalMinutes
  * @memberof TimePage
  */
  convertToMin(value) {
    let hours = value.split(":")[0] * 60;
    let minutes = value.split(":")[1];
    let totalMinutes = +hours + +minutes;
    return totalMinutes;
  }


  /**
     *08/06/2018 Kamal calculate duration on Change of date
     *
     * @memberof TimePage
     */
  getDurationOnDate() {
    let date = new Date();

    let startTime = this.formatDateTime(this.service_start_date, this.timeObject.Start_Time);
    let endTime = this.formatDateTime(this.service_end_date, this.timeObject.End_Time);

    let todayStartDate = this.formatDateTime(date, this.timeObject.Start_Time);
    let todayEndDate = this.formatDateTime(date, this.timeObject.End_Time);
    //Prateek 01/07/2019  :change service_start_date into date format in order to  open calender  in edit and copy
    this.minDate = new Date(this.service_start_date);
    //this.minDate.setDate(this.minDate.getDate() + 1);
    //03/14/2019 -- Zohaib Khan -- Don't need to add 1 day on Servise end date minimum date.
    this.minDate.setDate(this.minDate.getDate());
    if (moment(startTime).isSame(endTime)) {
      let initialDurartion = this.getTimeDuration(8, 0);
      this.timeObject.Duration = moment(initialDurartion).format('HH:mm');
    }
    else {
      if (moment(startTime).isAfter(endTime)) {
        this.service_end_date = this.service_start_date;
        //Prateek 01/07/2019  :change service_start_date into date format in order to  open calender  in edit and copy
        this.minDate = new Date(this.service_start_date);
        //this.minDate.setDate(this.minDate.getDate() + 1);
        //03/14/2019 -- Zohaib Khan -- Don't need to add 1 day on Servise end date minimum date.
        this.minDate.setDate(this.minDate.getDate());
        let d = new Date();
        d.setHours(this.timeObject.Start_Time.split(":")[0]);
        d.setMinutes(this.timeObject.Start_Time.split(":")[1]);
        this.timeObjects.End_Time = d;
      }
      else {
        if (!moment(startTime).isSame(todayStartDate) || !moment(endTime).isSame(todayEndDate)) {
          this.getDuration(startTime, endTime);
        }
        else {
          this.getDuration(startTime, endTime);
        }

      }
    }

  }



  /**
   *08/06/2018 Kamal calculate duration between overnight shift
   *
   * @memberof TimePage
   */
  getDuration(startTime, endTime) {

    let duration = moment.duration(endTime.diff(startTime));
    let hours = duration.asHours();
    let minutes = duration.asMinutes() - hours * 60;
    let hoursToMin = hours * 60;
    let totalTimeInMin = hoursToMin + minutes;
    let updateHours = Math.floor(Math.abs(totalTimeInMin / 60));
    let updateMin = Math.floor(totalTimeInMin % 60);
    //09/09/2018 kamal: add 0 to number less than 10 in hours
    if (updateHours <= 9) {
      this.timeObject.Duration = ('0' + updateHours).slice(-2) + ":" + ('0' + +updateMin).slice(-2);
    }
    else {
      this.timeObject.Duration = updateHours + ":" + ('0' + +updateMin).slice(-2);
    }
    if (totalTimeInMin < 0) {
      this.isDateError = true;
    }
    else if (totalTimeInMin > 0) {
      this.isDateError = false;
    }
    else {
      if (this.timeObject.Start_Time == '00:00' && this.timeObject.End_Time == '00:00') {
        let initialDurartion = this.getTimeDuration(8, 0); // as per client requiremnt
        this.timeObject.Duration = moment(initialDurartion).format('HH:mm');
        this.isDateError = false;
      }
      else {
        let initialDurartion = this.getTimeDuration(0, 0);
        this.timeObject.Duration = moment(initialDurartion).format('HH:mm');
        this.isDateError = true;
      }
    }
  }
  /**
  *08/06/2018 Kamal  set duration on date Time condition 
  *
  * @param {*} item
  * @param {*} type
  * @memberof TimePage
  */
  onDateTimeComparison(startTime, endTime) {
    let startt_Cdate = this.getFormatTime(this.timeObject.Start_Time);
    let endd_Cdate = this.getFormatTime(this.timeObject.End_Time);
    let defaultTime = moment(this.getTimeDuration(0, 0)).format('HH:mm');
    let initialDurartion = this.getTimeDuration(8, 0); // as per client requirement
    let isSameDate = moment(this.service_start_date).isSame(this.service_end_date);

    if (this.timeObjects.Start_Time == defaultTime && this.timeObjects.End_Time == defaultTime && isSameDate) {
      this.timeObject.Duration = moment(initialDurartion).format('HH:mm');
      this.isDateError = false;
    }

    if (this.timeObjects.Start_Time == defaultTime && this.timeObjects.End_Time == defaultTime && !isSameDate) {
      this.getDuration(startTime, endTime);
    }
    this.timeObjects.End_Time = (this.timeObjects.End_Time || '');

    if (endd_Cdate < startt_Cdate) {
      this.isDateError = true;
      this.getDuration(startTime, endTime);
    }
    if (this.timeObjects.Start_Time != defaultTime && this.timeObjects.End_Time != defaultTime || this.timeObjects.Start_Time == defaultTime && this.timeObjects.End_Time != defaultTime) {
      if (endd_Cdate < startt_Cdate) {
        this.getDuration(startTime, endTime);
      } else {
        this.isDateError = false;
        this.getDuration(startTime, endTime);
        if (this.timeObject.Duration.toString() == "00:00") {
          this.isDateError = true;
        } else {
          this.isDateError = false;
        }
      }
    }
  };

  /**
     *08/06/2018 Kamal  set duration in format(HH:mm) 
     *
     * @param {*} item
     * @param {*} type
     * @memberof TimePage
     */
  getTimeOnChange(item, type) {
    if (item == null && type == 'Start_Time') {
      this.timeObjects.Start_Time = this.getTimeDuration(0, 0);
    }
    if (item == null && type == 'End_Time') {
      this.timeObjects.End_Time = this.getTimeDuration(0, 0);
      return;
    }
    this.timeObject[type] = moment(item).format('HH:mm');
    let startTime = this.formatDateTime(this.service_start_date, this.timeObject.Start_Time);
    let endTime = this.formatDateTime(this.service_end_date, this.timeObject.End_Time);

    switch (type) {
      case 'Start_Time':

        if (moment(startTime).isSameOrAfter(endTime)) {
          let d = new Date();
          d.setHours(this.timeObject.Start_Time.split(":")[0]);
          d.setMinutes(this.timeObject.Start_Time.split(":")[1]);
          this.timeObjects.End_Time = d;
        }
        else {
          this.getDuration(startTime, endTime);
        }
        break;
      case 'End_Time':

        if (moment(startTime).isAfter(endTime)) {
          this.service_end_date = new Date();
          let dateNum = moment(this.service_start_date).get('date');
          this.service_end_date.setDate(dateNum + 1);
        }
        let startTimes = this.formatDateTime(this.service_start_date, this.timeObject.Start_Time);
        let endTimes = this.formatDateTime(this.service_end_date, this.timeObject.End_Time);
        this.onDateTimeComparison(startTimes, endTimes);
        break;
    }
  }

  /**
  *08/10/2018 kamal concatinate date with time using moment
  *
  * @param {*} date
  * @param {*} time
  * @returns
  * @memberof TimePage
  */
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

  gettimelist() {
    this.localService.getTimeList(String(this.valueService.getTaskId())).then((res: any[]) => {
      this.timeArraySummary = res;
      //this.logger.log(this.fileName, 'gettimelist', "JOb Name" + this.timeArraySummary);
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'gettimelist', 'Error in getTimeList : ' + JSON.stringify(err));
    });
  }

  checkEmpty() {
    if (this.clarity_Name == undefined) {
      this.clarity_Name = "";
      //this.logger.log(this.fileName, 'checkEmpty', "this.clarity_Name=" + this.clarity_Name);
    }
    if (this.charge_Type == undefined) {
      this.charge_Type = "";
    }
    if (this.charge_method == undefined) {
      this.charge_method = "";
    }
    if (this.work_Type == undefined) {
      this.work_Type = "";
    }
    if (this.iitem == undefined) {
      this.iitem = "";
    }
    if (this.clarity_Time == undefined) {
      this.clarity_Time = "";
    }
    if (this.clarity_Shift == undefined) {
      this.clarity_Shift = "";
    }
    if (this.date == undefined) {
      this.date = "";
    }
    if (this.duration == undefined) {
      this.duration = "";
    }
    if (this.startTime == undefined) {
      this.startTime = "";
    }
    if (this.endTime == undefined) {
      this.endTime = "";
    }
    if (this.valueService.getCommentText() == undefined) {
      this.valueService.setCommentText("");
    }
  }

  ifTimeValid() {
    this.timeObject.Service_Start_Date = this.service_start_date;
    this.timeObject.Service_End_Date = this.service_end_date;

    //this.logger.log(this.fileName, 'ifTimeValid', this.timeObject.Date);
    let sourceStartDate = new Date(this.timeObject.Service_Start_Date);
    let sourceEndDate = new Date(this.timeObject.Service_End_Date);
    //this.logger.log(this.fileName, 'ifTimeValid', sourceStartDate);
    let sourceStartTime = this.timeObject.Start_Time;
    let sourceEndTime = this.timeObject.End_Time;
    sourceStartDate.setHours(sourceStartTime.split(':')[0]);
    sourceStartDate.setMinutes(sourceStartTime.split(':')[1]);
    sourceStartDate.setSeconds(0);
    sourceStartDate.setMilliseconds(0);
    sourceEndDate.setHours(sourceEndTime.split(':')[0]);
    sourceEndDate.setMinutes(sourceEndTime.split(':')[1]);
    sourceEndDate.setSeconds(0);
    sourceEndDate.setMilliseconds(0);
    for (let k in this.timeArraySummary) {
      let timeObj = this.timeArraySummary[k];
      if ((this.ifEdit == "Edit" && this.timeObject.Time_Id == timeObj.Time_Id)) {
        continue;
      }
      let targetStartDate = new Date(timeObj.Service_Start_Date);
      let targetEndDate = new Date(timeObj.Service_End_Date);
      if(!timeObj.EntryDate){
      timeObj.Start_Time = moment(timeObj.Service_Start_Date).format('HH:mm');
      timeObj.End_Time = moment(timeObj.Service_End_Date).format('HH:mm');
      }
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
        this.timeValid = true;
        //this.logger.log(this.fileName, 'ifTimeValid', "breaking " + k + "...");
        return;
      }
    }
    this.timeValid = false;
    this.viewCtrl.dismiss(this.timeObject);
  }


  //check character limit for description , should be less than 255 / Mayur
  _keyPress(event: any) {
    if (event.target.textLength > 254) {
      event.preventDefault();
    }
  }

  onShowPicker(event) {

    const dayHoverHandler = event.dayHoverHandler;
    const hoverWrapper = (hoverEvent) => {
      const { cell, isHovered } = hoverEvent;

      if ((isHovered &&
        !!navigator.platform &&
        /iPad|iPhone|iPod/.test(navigator.platform)) &&
        'ontouchstart' in window
      ) {
        (this.dp2 as any)._datepickerRef.instance.daySelectHandler(cell);
        (this.dp1 as any)._datepickerRef.instance.daySelectHandler(cell);
      }

      return dayHoverHandler(hoverEvent);
    };
    event.dayHoverHandler = hoverWrapper;
  }



  // 09/05/2019 -- Mayur Varshney -- call function to hide calendar on every click of ion-select
  hideCalendar(event) {
    this.dp1.hide();
    this.dp2.hide();
  }

  readOriginalComments(comments) {
    let data = { commentText: comments };
    let readModal = this.utilityProvider.showModal('ReadOriginalCommentsPage', data, { enableBackdropDismiss: false, cssClass: 'ReadMoreModalPage' });
    readModal.present();
  }
  //11/28/2018 Zohaib Khan: Setting fields empty if work type is break
  setEmptyOnBreak() {
    this.timeObject.Field_Job_Name_Id = '';
    this.timeObject.Field_Job_Name = '';
    this.timeObject.Charge_Type_Id = '';
    this.timeObject.Charge_Type = '';
    this.timeObject.Item_Id = '';
    this.timeObject.Item = '';
    this.timeObject.Time_Code_Id = '';
    this.timeObject.Time_Code = '';
    this.timeObject.Shift_Code_Id = '';
    this.timeObject.Shift_Code = '';
  }
  ionViewWillLeave(): void {
    this.events.unsubscribe('langSelected');
  }

}
