import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import * as moment from "moment";
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../providers/logger/logger';
import { ValueProvider } from '../../../providers/value/value';
import { LocalServiceSdrProvider } from '../../../providers/local-service-sdr/local-service-sdr';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { UtilityProvider } from '../../../providers/utility/utility';
import * as Enums from "../../../enums/enums"
@IonicPage()
@Component({
  selector: 'page-osc-nonc-time-edit',
  templateUrl: 'osc-nonc-time-edit.html',
})
export class OscNoncTimeEditPage {
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
  listPage: boolean = true;
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
  timeEntriesArr =[];
  travelMethod: String ='';
  laborMethod:String='';
  depotClicked: boolean = false;
  isTimeEntry: any = '';
  isDepot: boolean;
  isField: boolean;
  timeId: any;
  isVacation: boolean = false;
  //Preeti Varshney 05/09/2019 added Work_Type_Id to save
  Work_Type_Id: any;
  //Preeti Varshney 05/09/2019 added Item_Id to save
  Item_Id: any;
  delWeekStarts: any;
  delWeekEnds: any;
  overtimeMultiplier: any;
  recordExists: boolean = false;
  timeSheetTempObj: any = {};
  weekEditPage: boolean = true;
  timeSheet: any = {};
  timeCodes: any =[];
  tempTimeCodes : any = [];
  enums: any;
  constructor(public localServiceSdr: LocalServiceSdrProvider, public utilityProvider: UtilityProvider, public navCtrl: NavController,
    public navParams: NavParams, public appCtrl: App, public events: Events,
    public localService: LocalServiceProvider, public logger: LoggerProvider,
    public valueProvider: ValueProvider) {
    this.isTimeEntry = "true";
    this.enums = Enums;
    this.weekBtnClicked = this.navParams.get('weekBtnClicked');
    this.timeSheet = this.createObject(this.navParams.get('timeData'))
    this.isVacation = this.timeSheet['Job_Type'] == 'vacation'?true:false;
    this.timeSheet['Item_Id'] = this.isVacation ? 2 : this.timeSheet['Item_Id'];

    this.timeSheetTempObj = this.createObject(this.navParams.get('timeData'))
    this.nonClarityPage = this.navParams.get('nonClarityPage');
    this.taskId = this.navParams.get('taskId');
    this.delWeekStarts = this.navParams.get('delWeekStarts');
    this.delWeekEnds = this.navParams.get('delWeekEnds');
    this.weekEditPage = true;
    let now = moment();
    let from_date = now.startOf('week');
    this.weekStart = moment(from_date).format('DD-MMM-YYYY');
    this.getChargeMethodJob();
    // this.bsDatepickerConfig.dateInputFormat = 'DD MMM YYYY';
    this.datepickerConfig = Object.assign({}, {
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false
      // , minDate: this.minDate
    });
    // TODO: Getting timeid for week - need to discuss for week view.
    this.manageCheckbox("",this.timeSheet.Job_Type);
    //this.getJobType(this.timeSheet.timeId)
    this.dayList = this.utilityProvider.dayListData(this.weekStart);
    this.valueProvider.TotalHours = 0;

    //By Abhishek: to check from which page user is coming to edit the time entry
    if (this.nonClarityPage) {
      this.header_data = { title1: "", title2: "Timesheet Non-Clarity", taskId: '' };
    }
    else {
      this.header_data = { title1: "Debrief", title2: "Job #", taskId: this.taskId };
    }
    this.events.subscribe('EditDayDuration', (data) => {
      this.timeSheet.totalDuration =  "00:00";
      for (let i = 0; i < 7; i++) {
        if (data.dayid == this.timeSheet.days[i].dayid) {
          this.timeSheet.days[i].notes = data.Comments;
          this.timeSheet.days[i].startTime = data.Start_Time;
          this.timeSheet.days[i].endTime = data.End_Time;
          this.timeSheet.days[i].duration = data.duration;
          this.timeSheet.days[i].Time_Id = data.Time_Id;
          this.timeSheet.days[i].Job_Type = data.Job_Type,
          this.timeSheet.days[i].DB_Syncstatus = 'false',
          this.timeSheet.days[i].isDeleted = "false"
        }
        this.timeSheet.totalDuration = this.utilityProvider.totalHours(this.timeSheet.days[i].duration);

      }
    });
    
    // this.events.subscribe('saveToMST', (obj) => {
    //   this.recordExists = false;
    //   this.timeSheetTempObj['Start_Time'] = obj.Start_Time;
    //   this.timeSheetTempObj['End_Time'] = obj.End_Time;
    //   this.timeSheetTempObj['Comments'] = obj.Comments;
    //   this.timeSheetTempObj['Duration'] = obj.Duration;
    //   this.timeSheetTempObj['EntryDate'] = obj.EntryDate;
    //   this.timeSheetTempObj['Original'] = obj.Original;
    //   this.timeSheetTempObj['Time_Id'] = obj.Time_Id;
    //   this.timeSheetTempObj['Reconcile_Duration'] = undefined;
    //   this.timeSheetTempObj['DB_Syncstatus'] = obj.DB_Syncstatus;
    //   this.timeSheetTempObj['StatusID'] = obj.StatusID;
    //   this.timeSheetTempObj['isSubmitted'] = obj.isSubmitted;
    //   if (obj.Time_Id) {
    //     this.recordExists = true
    //   }
    //   // this.saveMSTData();
    // });
  }

  ionViewDidLoad() {
    // this.events.publish('user:created', "Time");
    if (this.timeSheetTempObj) {
      this.timeSheetTempObj.newActivityType = this.timeSheet.Work_Type;
    }
    this.loadData();
    this.getTimeDataAndInsertTempTime();
  }
  /**
    * Preeti Varshney 04/18/2019
    * load data to populate fields on edit page
    */
  loadData() {
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    this.Start_Time = date;
    // this.job_Id = this.timeData.Job_Number;
    // this.serial_number = this.timeData.SerialNumber;
    this.Job_Type = this.timeSheet.Job_Type;
    this.getActivityName();
    this.getTimeCodeLov();
    this.getchargemethod();
    // this.timeSheet.weekEditPage = true;
    this.timeSheetTempObj.weekEditPage = true;
    this.events.publish('getOscNonClarityData', this.timeSheetTempObj);
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
    if(Job_Number == null) Job_Number = 'Not Applicable (Absences / Internal)';
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

  /*
  * Narsimha Sanapala 04/12/2019
  * Delete time entry functionality enhanced
  */
  delete() {
    let alertMessage = "You are about to delete the time entries associated with " + this.delWeekStarts + " to " + this.delWeekEnds + " of the week. Are you sure you want to proceed?";
    let alert = this.utilityProvider.confirmationAlert('Alert', alertMessage);
    alert.present();
    alert.onDidDismiss((response) => {
      if (response) {
        let timeData = this.timeData.days ? this.timeData.days : [this.timeData.timeId];
        let timeIds = [];
        if (timeData.length == 7) {
          timeIds = timeData.map(time => time.Time_Id).filter(time => (time !== "" && time !== undefined));
        } else {
          timeIds = timeData;
        }
        if (timeIds.length > 0) {
          this.localService.deleteBulkTimeObject(timeIds);
        }
        this.timeRedirect();
      }
    });
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

  getDuration(startTime, endTime) {
    // Sana
    let totalTimeInMin: any;
    let updateHours: any;
    let updateMin: any;
    if ((endTime._d.getDate() - startTime._d.getDate() == 1) && (startTime._d.getHours() > endTime._d.getHours())) {
      totalTimeInMin = ((((24 - startTime._d.getHours()) + endTime._d.getHours()) * 60) + (endTime._d.getMinutes() - startTime._d.getMinutes()));
      updateHours = Math.floor(Math.abs(totalTimeInMin / 60));
      updateMin = Math.floor(totalTimeInMin % 60);
    } else {
      // let diffDates = (endTime._d.getDate() - startTime._d.getDate()) + 1;
      let diffDates = endTime.diff(startTime, 'days') + 1;
      totalTimeInMin = (((endTime._d.getHours() - startTime._d.getHours()) * 60) + (endTime._d.getMinutes() - startTime._d.getMinutes()));
      updateHours = Math.floor(Math.abs((totalTimeInMin * diffDates) / 60));
      updateMin = Math.floor((totalTimeInMin * diffDates) % 60);
    }

    //09/06/2018 kamal: add 0 to number less than 10 in hours
    if (updateHours <= 9) {
      this.duration = ('0' + updateHours).slice(-2) + ":" + ('0' + +updateMin).slice(-2);
    }
    else {
      this.duration = updateHours + ":" + ('0' + +updateMin).slice(-2);
    }
    if (totalTimeInMin < 0) {
      this.isDateError = true;
    }
    else if (totalTimeInMin > 0) {
      this.isDateError = false;
    }
    else {
      let initialDurartion = this.utilityProvider.getTimeDuration(0, 0);
      this.duration = moment(initialDurartion).format('HH:mm');
      this.isDateError = true;
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

  async getActivityName() {
    try {
      if(this.isVacation){
        this.activityName = await this.localService.getAbsenceType();//getMSTData('VacationType', undefined, 'Value');
        // let data = [];
        //   for (let i = 0; i < this.activityName.length; i++) {
        //     if (this.activityName[i].IsActive == 'Y') {
        //       data.push(this.activityName[i]);
        //     }
        //   }
        // this.activityName = data;
        //this.activityName.push({ "C": 0, "NC": 1, "ID": '-11000', "ResourceId": null, "Value": "Other" })

      } else{
        this.activityName = await this.localService.getActivityLov();
      }
      let result : any  = await this.localService.getShiftCodes();
      this.shiftCodes = result.filter((item) => {
        return item.Shift_Code && item.Shift_Code != '';
      });
    } catch (e) {

    }

  }


  /**
     * Preeti Varshney 04/05/2019
     * open search  box model
    */
  async searchModal(data) {
    let dataArray: any = [];
    try{
    let isTranslateVal=false;
    switch (data) {
      case 'jobids':
        dataArray = this.allJobIDs;
        break;
      case 'ActivityType':
        isTranslateVal=true;
        dataArray = this.activityName;
        break;
      case 'timeCodes':
        isTranslateVal=true;
        this.filterTimeCode();
        dataArray = this.timeCodes;
        break;
      case 'chargemethod':
        isTranslateVal=true;
        dataArray = this.chargemethod;
        break;
      case 'overtimeMultiplier':
        dataArray = this.overtimeMultiplier;
        break;
      default:
        break;
    }
    let searchModal = this.utilityProvider.showModal("TimesheetDropdownPage", { dataSource: dataArray, type: data,isTranslate:isTranslateVal }, { enableBackdropDismiss: false, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        switch (data.type) {
          case 'jobids':
            this.timeSheet.Job_Number = data.LookupValue;
            this.getChargeMethodJob();
            break;
          case 'ActivityType':
            this.timeSheet.Work_Type = data.LookupValue;
            this.timeSheet.Work_Type_Id = data.ID;
            this.timeSheet.newActivityType = data.LookupValue;
            this.timeSheetTempObj.newActivityType = data.LookupValue;
            this.timeSheet.Item = "";
            this.timeSheet.Item_Id = "";
            if (parseInt(this.timeSheet.Work_Type_Id) == Enums.WorkType.Break) {
              this.timeSheet.Charge_Method_Id = Enums.chargeMethod.NonBillable;
              this.timeSheet.Charge_Method = "Non-Billable";
            } else {
              this.timeSheet.Charge_Method_Id = '';
              this.timeSheet.Charge_Method = '';
              this.updatechargeMethod(this.timeSheet['Work_Type_Id']);
            }
            if(this.timeSheet['Work_Type_Id']!='-11000'){
              this.timeSheet['Work_Type_OT'] = null;
            }
            this.filterTimeCode();
            break;
          case 'timeCodes':
            this.timeSheet.Item = data.LookupValue;
            this.timeSheet.Item_Id = data.ID;
            this.filterTimeCode();
            break;
          case 'chargemethod':
            this.timeSheet.Charge_Method_Id = data.ID;
            this.timeSheet.Charge_Method = data.LookupValue;
            break;
          default:
            break;
        }
      }
    });
  }catch(e){

  }
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
      this.logger.log(this.fileName, 'getJobType', ' Error in getJobTypetime : ' + JSON.stringify(error));
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
    if (parseInt(this.timeSheet.Work_Type_Id) == Enums.WorkType.Break) {
      this.timeSheet.Charge_Method_Id = Enums.chargeMethod.NonBillable;
      this.timeSheet.Charge_Method = "Non-Billable";
    }
    //this.item = '';
  }

  /**
 *@ Prateek 02/05/2019
 *Get job type for related job id
 * @memberof NonClarityTimeEntryPage
 */
 async getTimeCodeLov() {
    try {
     this.timeCodes = await this.localService.getTimeCodeLov();
     this.tempTimeCodes = this.timeCodes;
     return this.tempTimeCodes;
    } catch (e) {

    }

  }

  getOTMultiplier() {
    this.localService.getOTMultiplier().then((res: any[]) => {
      this.overtimeMultiplier = res;
    });
  }
  // Function to save and edit time in case of osc user
  async saveTime() {
    try {
      if(!this.timeSheet.newActivityType){
        this.timeSheet.newActivityType = this.timeSheet.Work_Type;
      }
      // if ((this.valueProvider.getUserPreferences()[0].ShowChargeMethod != 'true' && this.valueProvider.getUserPreferences()[0].ShowChargeMethod != true)) {
      //   this.timeSheet.Charge_Method = null;
      //   this.timeSheet.Charge_Method_Id = null;
      // }

      if (this.Job_Type == 'depot') {
        this.timeSheet.Charge_Method = null;
        this.timeSheet.Charge_Method_Id = null;
        this.timeSheet.SerialNumber = null;
        this.timeSheet.TagNumber = null;
      }
      this.timeSheetTempObj.SerialNumber = this.timeSheetTempObj.SerialNumber ? this.timeSheetTempObj.SerialNumber : '';
      this.timeSheetTempObj.TagNumber = this.timeSheetTempObj.TagNumber ? this.timeSheetTempObj.TagNumber : '';
      /**
       * Gaurav Vachhani - 24-12-2019
       * Fetching list of all time entries of week for NONC-OSC user according to the selected date.
       */
      await this.localService.getNOCWeekDuration(this.timeSheetTempObj, moment(this.delWeekStarts, 'DD-MMM-YYYY').format('YYYY-MM-DD'), moment(this.delWeekEnds, 'DD-MMM-YYYY').format('YYYY-MM-DD'), this.weekEditPage).then((res: any[]) => {
        if (res.length) {
          this.timeEntriesArr = res;
          for (let i = 0; i < this.timeEntriesArr.length; i++) {
              this.timeEntriesArr[i].Work_Type_Id = this.timeSheet.Work_Type_Id;
              this.timeEntriesArr[i].Work_Type = this.timeSheet.Work_Type;
              this.timeEntriesArr[i].Work_Type_OT = this.timeSheet.Work_Type_OT;
              this.timeEntriesArr[i].Item = this.timeSheet.Item;
              this.timeEntriesArr[i].Item_Id = this.timeSheet.Item_Id;
              this.timeEntriesArr[i].Charge_Method_Id = this.timeSheet.Charge_Method_Id;
              this.timeEntriesArr[i].Charge_Method = this.timeSheet.Charge_Method;
              this.timeEntriesArr[i].SerialNumber = this.timeSheet.SerialNumber;
              this.timeEntriesArr[i].TagNumber = this.timeSheet.TagNumber;
              this.timeEntriesArr[i].Job_Type = this.timeSheet.Job_Type;
              this.timeEntriesArr[i].StatusID = this.timeSheet.StatusID;
              this.timeEntriesArr[i].DB_Syncstatus = this.timeSheet.DB_Syncstatus;
              this.timeEntriesArr[i].isPicked = this.timeSheet.isPicked;
          }
          /**
          * Gaurav Vachhani - 24-12-2019
          * Deleted saved time entries from the array of time entries
          */
          for (let i = 0; i < this.timeEntriesArr.length; i++) {
            if (this.timeEntriesArr[i].StatusID == Enums.Jobstatus.Debrief_In_Progress && (this.timeEntriesArr[i].IsAdditional == 'false' || this.timeEntriesArr[i].IsAdditional == false)) {
              delete this.timeEntriesArr[i];
            }
          }
          /**
          * Gaurav Vachhani - 24-12-2019
          * Filter of time entries which are not having sync status true
          */
          if (this.timeEntriesArr.length > 0) {
              if(this.timeEntriesArr.length>1){
              this.timeEntriesArr=this.timeEntriesArr.filter(item=>{
                return (item.Sync_Status != "true" || item.StatusID == Enums.Jobstatus.Debrief_Declined)
              })
            }
            this.localServiceSdr.insertOrUpdateTimeSheetData(this.timeEntriesArr, true, 'Time_Temp').then((response: any) => {
              this.localService.getMSTData('Time_Temp', '').then((response: any[]) => {
                if (response) {
                  this.localService.insertTimeBatch(response).then((res: any[]) => {
                    if (res) {
                      this.timeRedirect();
                    }
                  }).catch((error: any) => {
                    this.utilityProvider.stopSpinner();
                    this.logger.log(this.fileName, 'getFieldsByProject', 'Error in getFieldsByProject : ' + JSON.stringify(error));
                  });
                }
              }).catch((error: any) => {
                this.utilityProvider.stopSpinner();
                this.logger.log(this.fileName, 'getFieldsByProject', 'Error in getFieldsByProject : ' + JSON.stringify(error));
              })
            }).catch((error: any) => {
              this.utilityProvider.stopSpinner();
              this.logger.log(this.fileName, 'saveMSTData', ' Error in saveMSTData : ' + JSON.stringify(error));
            });
          } else {
            this.timeRedirect();
          }
        }
        else {
          this.timeEntriesArr = [];
        }
      }).catch((err: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getWeekData', ' Error in getWeekData : ' + JSON.stringify(err))
      })

      //await this.localService.updateTempTableData(this.timeSheet,this.Job_Type,this.timeSheetTempObj);
      //await this.localService.insertTempTimeDataToTime(this.timeSheet.Job_Number);
      
    } catch (error) {
      this.logger.log(this.fileName, "saveTime", error);
    }

  }

  ionViewDidEnter() {
    this.events.publish('user:created', "Time");
  }

  ionViewWillUnload() {
    this.localService.dropTempTime();
    this.events.unsubscribe('SaveOscNCData');
  }
  async getTimeDataAndInsertTempTime() {
    try {
      await this.localService.getTimeDataToTempTime(this.timeSheet.Job_Number,this.delWeekStarts, this.delWeekEnds)
    }
    catch (error) {
      this.logger.log(this.fileName, "getTimeDataAndInsertTempTime", error)
    }
  }


  createObject(key){
    return Object.assign(Object.create(key), key)
  }
  filterTimeCode() {
    let filterKey = this.timeSheet.Work_Type == "Labor" ? "Others" : this.timeSheet.Work_Type;
    this.timeCodes = this.tempTimeCodes.filter((item) => {
      return item.Type == filterKey
    })
  }

  async deleteTime(){
    try {
      let alertMessage = "You are about to delete the time entries associated with " + this.delWeekStarts + " to " + this.delWeekEnds + " of the week. Are you sure you want to proceed?";
      let alert = this.utilityProvider.confirmationAlert('Alert', alertMessage);
      alert.present();
      alert.onDidDismiss((response) => {
        if(response) this.deleteEntries()
      })
    } catch (e) {
      this.logger.log(this.fileName, "deleteTime", e.message)
    }
  }
  async deleteEntries() {
    try {
      this.timeSheetTempObj.SerialNumber = this.timeSheetTempObj.SerialNumber ? this.timeSheetTempObj.SerialNumber : '';
      this.timeSheetTempObj.TagNumber = this.timeSheetTempObj.TagNumber ? this.timeSheetTempObj.TagNumber : '';
      await this.localService.deleteTimeRecords("Time_Temp", this.timeSheet.Job_Number, this.delWeekStarts, this.delWeekEnds,this.timeSheetTempObj)
      await this.localService.deleteTimeRecords("Time", this.timeSheet.Job_Number, this.delWeekStarts, this.delWeekEnds,this.timeSheetTempObj)
      this.timeRedirect()
    } catch (e) {
      this.logger.log(this.fileName, "deleteEntries", e.message);
    }
  }

  getChargeMethodJob(){
    try {
      return new Promise(() => {
        let promiseArray = [];
        promiseArray.push(this.localService.getTaskByTaskNumber(this.timeSheet['Job_Number']));

        Promise.all(promiseArray).then((response) => {
          if(response[0] && response[0].length){
            this.travelMethod =  response[0][0].Travel_Method?response[0][0].Travel_Method:'';
            this.laborMethod =  response[0][0].Labor_Method?response[0][0].Labor_Method:'';
            this.updatechargeMethod(this.timeSheet['Work_Type_Id'], true);
          }
        }).catch((error) => {
        });
      })
    } catch (error) {
      this.logger.log(this.fileName, "getAllFieldsLOVs ", " Error while loadData: " + JSON.stringify(error.message));
    }
  }

  updatechargeMethod(id, isEdit?) {
    if(!isEdit){
      this.timeSheet['Charge_Method'] = ''
      this.timeSheet['Charge_Method_Id'] = ''
      if (parseInt(id) == Enums.WorkType.Break){
        this.timeSheet['Charge_Method'] = 'Non-Billable'
      } else if(parseInt(id)==Enums.WorkType.Labour){
        this.timeSheet['Charge_Method'] = this.travelMethod;
      } else if(parseInt(id)==Enums.WorkType.Travel){
        this.timeSheet['Charge_Method'] = this.laborMethod;
      }
    }
      if(this.chargemethod.length){
        var Charge_Method = this.chargemethod.find(item => {
          return item.Value == this.timeSheet['Charge_Method'];
        });
        if(Charge_Method){
          this.timeSheet['Charge_Method_Id'] = Charge_Method.ID;
        }
      }
  }

}