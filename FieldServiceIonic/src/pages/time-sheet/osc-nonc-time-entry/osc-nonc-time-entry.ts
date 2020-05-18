import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events, Platform, AlertController, NavControllerBase } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from "moment";
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../providers/logger/logger';
import { ValueProvider } from '../../../providers/value/value';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { UtilityProvider } from '../../../providers/utility/utility';
import { TranslateService } from '@ngx-translate/core';
import * as Enums from '../../../enums/enums';
import { LocalServiceSdrProvider } from '../../../providers/local-service-sdr/local-service-sdr';

@IonicPage()
@Component({
  selector: 'page-osc-nonc-time-entry',
  templateUrl: 'osc-nonc-time-entry.html',
})
export class OSCNonCTimeEntryPage implements OnInit {
  oscNonCLovs: any = {};
  items: any = {};
  formGroup: FormGroup;
  fileName: any = 'Time_Entry_Page';
  _taskObj: any = {};
  header_data: any;
  timeSheet: any = {};
  statusId:any;
  chargeMethodDisable: boolean = false;
  duration;
  isDateError: boolean = false;
  isFieldVal: boolean = true;
  dayEdit: boolean = false;
  jobIdLimit: any = 10;
  isDropdownVisible: boolean = false;
  isDropdownVisibleActivity: boolean = false;
  Value: any;
  isVacation: boolean = false;
  isEditMode: boolean = false;
  isDebrief: boolean = false;
  desShow: boolean = false;
  isEntryDuplicated: boolean = true;
  durationCheck = false;
  depotClicked: boolean = false;
  travelMethod: String = '';
  laborMethod: String = '';
  isCopyEntryClicked: boolean = false;
  @ViewChild('dp') dp1: BsDatepickerDirective;
  @ViewChild('dps') dp2: BsDatepickerDirective;
  // bannerDuration: string;
  datepickerConfig: Partial<BsDatepickerConfig>;
  minDate: Date = new Date(new Date().setDate(new Date().getDate() - 90));
  nightShift: boolean = false;
  clickedOnce: boolean = false;
  shiftSite: any = [];
  timeCode: boolean = false;
  isListPage: boolean = false;
  enums:{};
  constructor(public utilityProvider: UtilityProvider, public navCtrl: NavController,
    public navParams: NavParams, public alertCtrl: AlertController, public translate: TranslateService, public appCtrl: App, public events: Events, public localServiceSdr: LocalServiceSdrProvider, public localService: LocalServiceProvider,
    public logger: LoggerProvider, public valueProvider: ValueProvider, public platform: Platform) {
    this.enums = Enums;
    this.datepickerConfig = Object.assign({}, {
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false
    });
    this.isVacation = this.navParams.get('isVacation');
    this.isListPage = this.navParams.get('isListPage');
    this.header_data = { title1: "", title2: this.isVacation ? "Absences / Internal" : "Timesheet Non-Clarity", taskId: '' };
    this.setDefaultTimeObject();
    this.isCopyEntryClicked = this.navParams.get('copyTimeEntry') ? this.navParams.get('copyTimeEntry') : false;
    // this.isVacation = this.navParams.get('isVacation');
    this.timeSheet['Job_Type'] = this.isVacation ? 'vacation' : '';
    this.timeSheet['Item_Id'] = this.isVacation ? 2 : '';
    this.isFieldVal = this.isVacation ? false : true;
  }

  ionViewDidEnter() {
    if (this.isVacation) {
      this.timeSheet.Job_Number = "Not Applicable";
    }
    this.events.publish('user:created', "Time");
  }

  ionViewDidLoad() {
    this.isEditMode = this.navParams.get('isEditMode');
    this.timeSheet['Job_Number'] = this.navParams.get('taskId') ? this.navParams.get('taskId') : this.timeSheet['Job_Number'];
    this._taskObj = this.valueProvider.getTask();
    this.dayEdit = this.navParams.get('dayEdit') ? this.navParams.get('dayEdit') : false;
    if (this.dayEdit) {
      this.header_data = { title1: "", title2: this.isVacation ? "Absences / Internal" : "Timesheet Non-Clarity", taskId: '' };
      this.getChargeMethodJob(this.dayEdit);
    }
    else {
      if (this.timeSheet['Job_Number']) {
        this.isDebrief = true;
        this.header_data = { title1: "Debrief", title2: "Job #", taskId: this.timeSheet['Job_Number'] };
        this.getChargeMethodJob();
      }
    }
    this.loadData();
    // this.events.publish('user:created', "Time");

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

  loadData() {
    try {
      return new Promise(() => {
        this.utilityProvider.showSpinner();
        let promiseArray = [];
        let timeData = this.navParams.get('timeData')
        this.isVacation = timeData && timeData['Job_Type'] == 'vacation' ? true : this.isVacation;
        promiseArray.push(this.getActivityLovs());
        promiseArray.push(this.getchargemethod());
        promiseArray.push(this.getallTasks());
        if (this.timeSheet.Job_Number && !this.dayEdit && !timeData) {
          this.checkJobType();
        }
        Promise.all(promiseArray).then((response) => {
          this.utilityProvider.stopSpinner();
          if (timeData) {
            this.timeSheet = timeData ? timeData : {};
            this.timeSheet.Start_Time = this.utilityProvider.getFormatTime(this.timeSheet.Start_Time);
            this.timeSheet.End_Time = this.utilityProvider.getFormatTime(this.timeSheet.End_Time);

            var date = new Date(this.timeSheet.EntryDate);
            var userTimezoneOffset = date.getTimezoneOffset() * 60000;
            this.timeSheet.Service_Start_Date  = new Date(date.getTime() + userTimezoneOffset);
            if(this.timeSheet['End_Time']=='00:00'){
            this.timeSheet.Service_End_Date=new Date(moment(this.timeSheet.Service_Start_Date).add(1, 'day').toString())
            }
            else{
              this.timeSheet.Service_End_Date=new Date(moment(this.timeSheet.Service_Start_Date).add(0, 'day').toString())
            }
            this.depotClicked = this.timeSheet['Job_Type'] == 'depot' ? true : false;
            this.manageCheckbox(this.timeSheet['Job_Type']);
            this.statusId =  this.timeSheet['StatusID'];
            delete this.timeSheet['StatusID'];
            delete this.timeSheet['IsDeclined'];
            delete this.timeSheet['CurrentMobileId'];
            if (parseInt(this.timeSheet['Work_Type_Id']) == Enums.WorkType.Break) {
              this.timeCode = true;
            }
            let keyVal = this.getKeyValForWorkType(this.timeSheet['Work_Type_Id'], this.isEditMode);
            this.oscNonCLovs['Item'] = this.items['Item'].filter(item => {
              return item.Type == keyVal;
            });
          }
        }).catch((error) => {
          this.utilityProvider.stopSpinner();
        });
      })
    } catch (error) {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, "getAllFieldsLOVs ", " Error while loadData: " + JSON.stringify(error.message));
    }
  }

  ngOnInit() {
    this.resetDates('');
    if (!this.isVacation) {
      this.formGroup = new FormGroup({
        radioButtons: new FormControl('')
      })
    }
  }

  initStartTime() {
    this.timeSheet['End_Time'] = this.timeSheet['Start_Time'] = null;
    this.duration = '00:00';
  }

  resetDates(value) {
    if (value == '' || value == 'save') {
      this.timeSheet['Service_Start_Date'] = new Date();
      this.timeSheet['Service_End_Date'] = new Date();
    }
  }

  async saveTimeObject(isSaveClose?) {
    try {
      // let ifJobExist = await this.checkIfSameOscJobexist();
      // if (!ifJobExist) {
      this.clickedOnce = true;
      if (this._taskObj && this._taskObj.IsStandalone == 'false') {
        this.timeSheet['Task_Number'] = (this.timeSheet['Job_Number'] && this.timeSheet['Job_Number']!='Not Applicable')?this.timeSheet['Job_Number']:Enums.jobIdNA.value;
        this.saveTimelist(isSaveClose);
      } else {
        this.localService.getTaskNumberTime(this.timeSheet['Job_Number']).then((tasknumber: any) => {
          if (tasknumber.length > 0) {
            this.timeSheet['Task_Number'] = tasknumber[0].Task_Number;
            this.saveTimelist(isSaveClose)
          } else {
            this.localService.getTaskNumber(this.timeSheet['Job_Number']).then((res: any) => {
              if (res.length > 0) {
                this.timeSheet['Task_Number'] = res[0].Task_Number;
                this.saveTimelist(isSaveClose)
              }
              else {
                this.localService.checkTaskIsOSCJob(this.timeSheet['Job_Number']).then((jobs: any) => {
                  if (jobs.length > 0) {
                    this.timeSheet['Task_Number'] = (this.timeSheet['Job_Number'] && this.timeSheet['Job_Number']!='Not Applicable')?this.timeSheet['Job_Number']:Enums.jobIdNA.value;
                    this.saveTimelist(isSaveClose)
                  }
                  else {
                    this.timeSheet['Task_Number'] = '';
                    if (this.timeSheet['Job_Number'] !== 'No Value' && this.timeSheet['Job_Number'] !== '' && this.timeSheet['Job_Number'] !== undefined) {
                      this.timeSheet['Task_Number'] = (this.timeSheet['Job_Number'] && this.timeSheet['Job_Number']!='Not Applicable') ? parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000))): Enums.jobIdNA.value;
                    }
                    this.saveTimelist(isSaveClose)
                  }
                }).catch((error: any) => {
                  this.utilityProvider.stopSpinner();
                  this.logger.log(this.fileName, 'saveTimeObject', ' Error in getTaskNumber : ' + JSON.stringify(error));
                });
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
      }
      // } else {
      //   this.utilityProvider.presentToast('Absence Time Cannot be logged against OSC Jobs ',4000,'top','')
      // }
    } catch (e) {
      this.logger.log(this.fileName, "saveTimeObject", e.message)
    }
  }

  async saveTimelist(isSaveClose?) {
    let timeObjectToInsert = [];
    let durationData = this.getUpdatedDuration();
    let allDates = this.getAllDatesBetweenStartAndEnd(this.timeSheet['Service_Start_Date'], durationData.totalDays);
    if (this.timeSheet['Job_Type'] == 'depot') {
      delete this.timeSheet.SerialNumber;
      delete this.timeSheet.TagNumber;
      delete this.timeSheet.Charge_Method;
      delete this.timeSheet.Charge_Method_Id;
    }

    // if ((this.valueProvider.getUserPreferences()[0].ShowChargeMethod != 'true' && this.valueProvider.getUserPreferences()[0].ShowChargeMethod != true)) {
    //   delete this.timeSheet.Charge_Method;
    //   delete this.timeSheet.Charge_Method_Id;
    // }
    this.timeSheet['StatusID'] = await this.getStatusID(this.timeSheet['Job_Number']);
    for (let i = 0; i < durationData.totalDays; i++) {
      let timeData = JSON.parse(JSON.stringify(this.timeSheet));
      timeData.Duration = durationData.formatedDuration;
      timeData.EntryDate = allDates[i];
      timeData.ResourceId = this.valueProvider.getResourceId();
      timeData.isPicked = timeData['Job_Type'] == "vacation" ? null : "true";
      timeData.Job_Number = this.timeSheet['Job_Number'] == 'No Value' ? '' : this.timeSheet['Job_Number'];
      timeObjectToInsert.push(timeData);
    }
    let finalObject = this.validateDoubleEntries(timeObjectToInsert, durationData);
    finalObject = await this.changeStartEndTime(finalObject);
    if (finalObject && finalObject.length) {
      this.saveTime(finalObject, allDates,isSaveClose);
    }
  }

  async changeStartEndTime(timeObject){
    timeObject.forEach(element => {
      element.Service_Start_Date =  moment(element.EntryDate + " " + element.Start_Time).toDate().toString();
      element.Service_End_Date =  element.End_Time == '00:00' ? moment((moment(element.EntryDate).add(1, 'day')).format('YYYY-MM-DD') + " " + element.End_Time).toDate().toString() : moment(element.EntryDate + " " + element.End_Time).toDate().toString();
    });
    return timeObject;
  }

 async saveTime(timeObjectToInsert, allDates,isSaveClose?) {
    let searchDates: any = {
      "startDate": allDates[0],
      "endDate": allDates[allDates.length - 1]
    };
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
    if(this.isCopyEntryClicked){
      delete timeObjectToInsert[0]['Time_Id'];
      timeObjectToInsert[0]["EntryDate"] = moment(timeObjectToInsert[0]["Service_Start_Date"]).format("YYYY-MM-DD");
      timeObjectToInsert[0]["Service_End_Date"]=timeObjectToInsert[0]["Service_Start_Date"]
    }
    let res:any=await this.localServiceSdr.ifTimeValid(timeObjectToInsert);
          if(!res){
    this.localService.getCountTimeEntries(timeObjectToInsert, 'firstCheck', this.isEditMode).then((res: any[]) => {
      // First check for same time entry
      if (res && res.length == 0) {
        this.localService.getCountTimeEntries(timeObjectToInsert, 'secondcheck', this.isEditMode).then((res: any[]) => {
          // Second check for overlapping time entry
          if (res && res.length == 0) {
            // this.insertTimeBatch(timeObjectToInsert);
            this.localServiceSdr.insertOrUpdateTimeSheetData(timeObjectToInsert, this.isCopyEntryClicked?false:this.isEditMode, 'Time').then((res): any => {
              this.setDefaultTimeObject();
              this.clickedOnce = false;
              if (this.isEditMode || isSaveClose) {
                this.timeRedirect();
              }
            }).catch((error: any) => {
              this.utilityProvider.stopSpinner();
              this.logger.log(this.fileName, 'insertTimeBatch', ' Error in insertTimeBatch : ' + JSON.stringify(error));
            });

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
  else{
    this.promptAlert(res);
    this.events.publish('savedMSTDataIntoDB', false);
  }
  }

  deleteTime() {
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
            this.localService.deleteClarityTimeObject(this.timeSheet.Time_Id,undefined, this.statusId).then((res) => {
              this.timeRedirect();
            })
          }
        }
      ]
    });
    alert.present();
  }

  promptAlert(res) {
    this.utilityProvider.stopSpinner();
    //Preeti Varshney 04/30/2019 Promt alert
    let duplicateEntryDate = moment(res[0].EntryDate, 'YYYY-MM-DD').format('DD-MMM-YYYY');
    let duplicateEndDate = res[0].endDate ? moment(res[0].endDate, 'YYYY-MM-DD').format('DD-MMM-YYYY') : '';
    let duplicateStart_Time = res[0].Start_Time;
    let duplicateEnd_Time = res[0].End_Time;
    let Job_Number = res[0].Job_Number;
    if (Job_Number == null) Job_Number = 'Not Applicable (Absences / Internal)';
    let mszStr = 'Overlapping time entry exists (Job ID: ' + Job_Number + ' Date: ' + duplicateEntryDate + ' Start Time: ' + duplicateStart_Time + ' End Time: ' + duplicateEnd_Time + ')'
    if (duplicateEndDate) {
      mszStr = 'Overlapping time entry exists (Job ID: ' + Job_Number + ' Date between: ' + duplicateEntryDate + ' ' + duplicateStart_Time + ' to ' + duplicateEndDate + ' ' + duplicateEnd_Time + ')'
    }
    this.clickedOnce = false;
    let alert = this.utilityProvider.promptAlert('', mszStr);
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
    if (durationData.totalDays == 2 && this.timeSheet['Start_Time'] < "24" && this.timeSheet['End_Time'] < "24" && (this.timeSheet['Start_Time'] > this.timeSheet['End_Time'])) {
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
      // If the night shift entry end time is 24:00?
      if (timeObjectToInsert[1].Duration == "00:00") {
        timeObjectToInsert.length = 1;
        return timeObjectToInsert;
      }
      this.nightShift = true;
    }
    return timeObjectToInsert;
  }

  getUpdatedDuration() {
    let formatedDuration;
    var startDate = this.formatDateTime(this.timeSheet['Service_Start_Date'], "00:00");
    var endDate = this.formatDateTime(this.timeSheet['Service_End_Date'], "00:00");
    let totalDays = endDate.diff(startDate, 'days') + 1;

    if ((this.timeSheet['End_Time'] == '00:00' && this.timeSheet['Start_Time'] == '00:00')
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
    if (this.isDebrief == true) {
      this.navCtrl.getPrevious().data.fromDebrief = true;
      this.events.publish("deleteFromDebrief");
      this.appCtrl.getRootNav().pop()
      // let nav : NavControllerBase =  this.appCtrl.getRootNav();
      // nav.popTo({fromDebrief : true});
    }
    else {
      this.appCtrl.getRootNav().setRoot("TimeNonclaritylistPage", { save: "true" });
    }
  }

  onShowPicker(event) {
    event.dayHoverHandler = this.utilityProvider.singleClickDaySelector(event, this.dp1, this.dp2);
  }

  async getDurationOnDate() {
    if (this.isEditMode) {
      this.timeSheet['Service_End_Date'] = this.timeSheet['Service_Start_Date'];
      if(this.timeSheet['End_Time'] == '00:00'){
        this.timeSheet['Service_End_Date'] = new Date(moment(this.timeSheet['Service_Start_Date']).add(1, 'day').toString())
      }
      return;
    }
    let startTime, endTime
    if((this.timeSheet['Start_Time'] == null || this.timeSheet['Start_Time']  == 'Invalid Date') || (this.timeSheet['End_Time'] == null || this.timeSheet['End_Time']  == 'Invalid Date')){
      startTime = this.formatDateTime(this.timeSheet['Service_Start_Date'], '00:00');
      endTime = this.formatDateTime(this.timeSheet['Service_End_Date'], '00:00');
    }else{
      startTime = this.formatDateTime(this.timeSheet['Service_Start_Date'], this.timeSheet['Start_Time']);
      endTime = this.formatDateTime(this.timeSheet['Service_End_Date'], this.timeSheet['End_Time']);
    }
    if (moment(startTime).isSame(endTime)) {
      let initialDurartion = this.utilityProvider.getTimeDuration(0, 0);
      this.duration = moment(initialDurartion).format('HH:mm');
      // this.bannerDuration = "8 Hours, 0 Minutes";
    }
    else {
      if (moment(startTime).isAfter(endTime)) {
        this.timeSheet['Service_End_Date'] = this.timeSheet['Service_Start_Date'];
        let d = new Date();
        d.setHours(this.timeSheet['Start_Time'].split(":")[0]);
        d.setMinutes(this.timeSheet['Start_Time'].split(":")[1]);
        this.timeSheet['End_Time'] = d;
      }
      else {
        await this.getDuration(startTime, endTime);
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

  async getDuration(startTime, endTime) {
    // Sana
    let totalTimeInMin: any;
    let diffDates = endTime.diff(startTime, 'days');
    
    if (diffDates == 0 || this.timeSheet['Start_Time'] == '00:00' && this.timeSheet['End_Time'] == '00:00') {
      // totalTimeInMin = ((((24 - startTime._d.getHours()) + endTime._d.getHours()) * 60) + (endTime._d.getMinutes() - startTime._d.getMinutes()));
        totalTimeInMin = moment.duration(endTime.diff(startTime)).asMinutes();
        if(diffDates > 1){
          totalTimeInMin = 0;
        }
      } else {
        diffDates = endTime.diff(startTime, 'days') + 1;
        let endHours = (endTime._d.getHours() == 0 && endTime._d.getMinutes() == 0) ? 24 : endTime._d.getHours();
        totalTimeInMin = (((endHours - (startTime._d.getHours())) * 60) + (endTime._d.getMinutes() - startTime._d.getMinutes()));
      } 

      if (isNaN(totalTimeInMin) || totalTimeInMin  <= 0) {
        let initialDurartion = this.utilityProvider.getTimeDuration(0, 0);
        this.duration = moment(initialDurartion).format('HH:mm');
        this.isDateError = true;
      } else{
         diffDates = diffDates == 0 ? 1 : diffDates;
         let updateDurationHours =  Math.floor(Math.abs((totalTimeInMin * diffDates) / 60));
         let updateMin = Math.floor((totalTimeInMin * diffDates) % 60);
        if (updateDurationHours <= 9) {
          this.duration = ('0' + updateDurationHours).slice(-2) + ":" + ('0' + +updateMin).slice(-2);
        } else {
          this.duration = updateDurationHours + ":" + ('0' + +updateMin).slice(-2);
        }
        this.isDateError = false;
      }
  }

  checkforspace() {
    this.timeSheet.Job_Number = this.timeSheet.Job_Number.trim();
  }

  async getTimeOnChange(event, type) {

    if ((!this.timeSheet['Start_Time'] && !this.timeSheet['End_Time']) || (this.timeSheet['Start_Time'] == 'Invalid date' && this.timeSheet['End_Time'] == 'Invalid date')) {
      this.duration =  '00:00';
      return;
    }
    if (event == null) {
      this.duration =  '00:00';
      return;
    }

    this.timeSheet[type] = moment(event).format('HH:mm');   
    if(this.isEditMode){
      if(this.timeSheet['End_Time']=='00:00'){
        this.timeSheet.Service_End_Date=new Date(moment(this.timeSheet.Service_Start_Date).add(1, 'day').toString())
      }
      else{
        this.timeSheet.Service_End_Date=new Date(moment(this.timeSheet.Service_Start_Date).add(0, 'day').toString())
      }
    }

    let startTimeVal : any = this.timeSheet['Service_Start_Date'];
    let endTimeVal: any = this.timeSheet['Service_End_Date'] ;

    switch (type) {
      case 'Start_Time':
        startTimeVal = this.utilityProvider.formatDateTime(this.timeSheet['Service_Start_Date'], this.timeSheet['Start_Time']);
        endTimeVal = this.utilityProvider.formatDateTime(this.timeSheet['Service_End_Date'], this.timeSheet['End_Time']);
        if (moment(startTimeVal).isSameOrAfter(endTimeVal) || !this.timeSheet['End_Time'] || this.timeSheet['End_Time'] == 'Invalid date') {
          this.timeSheet['End_Time'] = this.utilityProvider.getDateFormatTime(this.timeSheet['Service_Start_Date'], this.timeSheet['Start_Time']);
        }
        else {
          await this.getDuration(startTimeVal, endTimeVal);
        }
        break;
      case 'End_Time':
        startTimeVal = this.utilityProvider.formatDateTime(this.timeSheet['Service_Start_Date'], this.timeSheet['Start_Time']);
        endTimeVal = this.utilityProvider.formatDateTime(this.timeSheet['Service_End_Date'], this.timeSheet['End_Time']);

        if (!this.timeSheet['Start_Time'] || this.timeSheet['Start_Time'] == 'Invalid date') {
          this.timeSheet['Start_Time'] = this.utilityProvider.getDateFormatTime(this.timeSheet['Service_End_Date'], this.timeSheet['End_Time']);
        } else{
          await this.getDuration(startTimeVal, endTimeVal);
          let startTimes = this.utilityProvider.formatDateTime(this.timeSheet['Service_Start_Date'], this.timeSheet['Start_Time']);
          let endTimes = this.utilityProvider.formatDateTime(this.timeSheet['Service_End_Date'], this.timeSheet['End_Time']);
          this.onDateTimeComparison(startTimes, endTimes);
        }
        break;
    }
  }

  async onDateTimeComparison(startTime, endTime) {
    let startt_Cdate = this.utilityProvider.getFormatTime(this.timeSheet['Start_Time']);
    let endd_Cdate = this.utilityProvider.getFormatTime(this.timeSheet['End_Time']);
    let startDuration = this.utilityProvider.getTimeDuration(0, 0);
    let defaultTime = moment(startDuration).format('HH:mm');
    let initialDurartion = this.utilityProvider.getTimeDuration(0, 0);
    let isSameDate = moment(this.timeSheet['Service_Start_Date']).isSame(this.timeSheet['Service_End_Date']);

    if (this.timeSheet['Start_Time'] == defaultTime && this.timeSheet['End_Time'] == defaultTime && isSameDate) {
      this.duration = moment(initialDurartion).format('HH:mm');
      this.isDateError = false;
    }

    if (this.timeSheet['Start_Time'] == defaultTime && this.timeSheet['End_Time'] == defaultTime && !isSameDate) {
      await this.getDuration(startTime, endTime);
    }
    this.timeSheet['End_Time'] = (this.timeSheet['End_Time'] || '');

    if (endd_Cdate < startt_Cdate) {
      this.isDateError = true;
      await this.getDuration(startTime, endTime);
    }
    if (this.timeSheet['Start_Time'] != defaultTime && this.timeSheet['End_Time'] != defaultTime || this.timeSheet['Start_Time'] == defaultTime && this.timeSheet['End_Time'] != defaultTime) {
      if (endd_Cdate < startt_Cdate) {
        await this.getDuration(startTime, endTime);
      } else {
        this.isDateError = false;
        await this.getDuration(startTime, endTime);
        if (this.duration.toString() == "00:00") {
          this.isDateError = true;
        } else {
          this.isDateError = false;
        }
      }
    }
  };


  setDefaultTimeObject() {
    this.desShow = false;
    this.timeSheet['End_Time'] = this.timeSheet['Start_Time'] = null;
    this.duration = '00:00';
    this.timeSheet['SerialNumber'] = '';
    this.timeSheet['Work_Type'] = '';
    this.timeSheet['Work_Type_Id'] = '';
    this.timeSheet['Work_Type_OT'] = null;
    this.timeSheet['TagNumber'] = '';
    this.timeSheet['Item'] = '';
    this.timeSheet['Item_Id'] = '';
    this.timeSheet['Charge_Method_Id'] = '';
    this.timeSheet['Charge_Method'] = '';
    this.timeSheet['Notes'] = '';
    this.timeSheet['Comments'] = '';
  }

  /**
  * Use to get Change Method code Lov's from DB
 */
  getchargemethod() {
    try {
      return new Promise((resolve, reject) => {
        this.localService.getChargeMethod().then((res: any) => {
          this.oscNonCLovs['Charge_Method'] = res.filter(item => {
            return item.ID != Enums.chargeMethod.NonBillable;
          });
          resolve(true);
        }).catch((error) => {
          reject(error);
        });
      })
    }
    catch (error) {
      this.logger.log(this.fileName, "getchargemethod ", " Error while getchargemethod: " + JSON.stringify(error.message));
    }
  }

  /**
  * Use to get Activity Type & Time code Lov's from DB
 */
  getActivityLovs() {
    try {
      return new Promise((resolve, reject) => {
        this.utilityProvider.showSpinner();
        let promiseArray = [];
        this.oscNonCLovs = {}
        if (this.isVacation) {
          promiseArray.push(this.localService.getAbsenceType());//getMSTData('VacationType', undefined, 'Value'));
        } else {
          promiseArray.push(this.localService.getMSTData('WorkType', undefined, undefined));
        }
        promiseArray.push(this.localService.getItemList());
        Promise.all(promiseArray).then((response) => {
          let data = [];
          for (let i = 0; i < response[0].length; i++) {
            if (response[0][i].NC == 1) {
              data.push(response[0][i]);
            }
          }
          if(!this.valueProvider.getUser().ClarityID && this.valueProvider.isOSCUser() && !this.isVacation){
            this.oscNonCLovs['Work_Type'] = data;
          } else {
            this.oscNonCLovs['Work_Type'] = response[0];
          }
          //if (this.isVacation) {
            //this.oscNonCLovs['Work_Type'].push({ "C": 0, "NC": 1, "ID": '-11000', "ResourceId": null, "Value": "Other" })
          //}
          var items = response[1];
          this.oscNonCLovs['Item'] = response[1];
          this.items['Item'] = response[1];
          this.utilityProvider.stopSpinner();
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
   * Use to get All Job of logedIn user from DB
  */
  getallTasks() {
    try {
      return new Promise((resolve, reject) => {
        this.localService.getTaskForTimeSheet().then((res: any) => {
          for (let i = 0; i < res.length; i++) {
            res[i].LookupValue = res[i].Task_Number;
          }
          this.oscNonCLovs['Job_Number'] = res;
          resolve(true);
        }).catch((error) => {
          reject(error);
        });
      })
    }
    catch (error) {
      this.logger.log(this.fileName, "getallTasks ", " Error while getallTasks: " + JSON.stringify(error.message));
    }
  }

  /**
   * Use to set Check for Field/Depot field.
  */
  manageCheckbox(item, isEdit?) {
    if (item == 'field') {
      this.isFieldVal = true;
      this.depotClicked = false;
      this.timeSheet['Job_Type'] = 'field';
    }
    if (item == 'depot') {
      this.isFieldVal = false;
      this.depotClicked = true;
      this.timeSheet['Job_Type'] = 'depot'
    }
    if (isEdit) {
      if (parseInt(this.timeSheet['Work_Type_Id']) == Enums.WorkType.Break) {
        this.timeSheet['Charge_Method'] = 'Non-Billable';
        this.timeSheet['Charge_Method_Id'] = Enums.chargeMethod.NonBillable;
      }
    }

  }
  getKeyValForWorkType(id, isEdit?) {
    let keyVal;
    switch (parseInt(id)) {
      case Enums.WorkType.Labour:
        keyVal = "Others";
        this.timeCode = false;
        this.chargeMethodDisable = false;
        break;
      case Enums.WorkType.Travel:
        keyVal = "Travel";
        this.timeCode = false;
        this.chargeMethodDisable = false;
        break;
      case Enums.WorkType.Break:
        this.timeCode = true;
        this.chargeMethodDisable = true;
        break;
      default:
        break;
    }
    if (!isEdit) {
      if (parseInt(id) == Enums.WorkType.Break) {
        this.timeSheet['Charge_Method'] = 'Non-Billable';
        this.timeSheet['Charge_Method_Id'] = Enums.chargeMethod.NonBillable;
      } else if (parseInt(id) == Enums.WorkType.Travel) {
        this.timeSheet['Charge_Method'] = this.travelMethod;
      } else if (parseInt(id) == Enums.WorkType.Labour) {
        this.timeSheet['Charge_Method'] = this.laborMethod;
      }
      if (this.oscNonCLovs['Charge_Method'].length) {
        var Charge_Method = this.oscNonCLovs['Charge_Method'].find(item => {
          return item.Value == this.timeSheet['Charge_Method'];
        });
        if (Charge_Method) {
          this.timeSheet['Charge_Method_Id'] = Charge_Method.ID;
        }
      }
    }
    return keyVal;
  }
  /**
   * Use to open search box model & filter the data
  */
  searchModal(key, val?) {
    let isTranslateVal=false;
    if(key=='Work_Type' || key=='Item' || key=='Charge_Method'){
      isTranslateVal=true;
    }
    if (this.oscNonCLovs.length > 0) {
      this.getActivityLovs();
    }
    let dataArray: any = [];
    dataArray = (this.oscNonCLovs[key] && this.oscNonCLovs[key].length > 0) ? this.oscNonCLovs[key] : [];
    let searchModal = this.utilityProvider.showModal("TimesheetDropdownPage", { dataSource: dataArray, type: 'oscNcData', ddValue: val, entryType: this.isVacation,isTranslate:isTranslateVal }, { enableBackdropDismiss: false, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data) {
        this.timeSheet[key] = data.LookupValue;
        if (key == 'Job_Number') {
          this.timeSheet['Task_Number'] = data.ID;
          this.timeSheet['Job_Number'] = data.LookupValue;
          this.getChargeMethodJob(true);
          this.checkJobType();
        }
        if (key == 'Item') {
          this.timeSheet['Item_Id'] = data.ID;
        }
        if (key == 'Charge_Method') {
          this.timeSheet['Charge_Method_Id'] = data.ID;
        }
        if (key == 'Work_Type') {
          this.timeSheet['Work_Type_Id'] = data.ID;
          if (this.timeSheet['Work_Type_Id'] != '-11000') {
            this.timeSheet['Work_Type_OT'] = null;
          }
          this.timeSheet['Charge_Method'] = '';
          this.timeSheet['Charge_Method_Id'] = '';
          this.timeSheet['Item'] = ''
          this.timeSheet['Item_Id'] = ''
          this.chargeMethodDisable = false;
          let keyVal = this.getKeyValForWorkType(data.ID.toString());
          this.oscNonCLovs['Item'] = this.items['Item'].filter(item => {
            return item.Type == keyVal;
          });
        }
      }
    });
  }

  getChargeMethodJob(isEdit?) {
    try {
      return new Promise(() => {
        let promiseArray = [];
        promiseArray.push(this.localService.getTaskByTaskNumber(this.timeSheet['Job_Number']));

        Promise.all(promiseArray).then((response) => {
          if (response[0] && response[0].length) {
            this.travelMethod = response[0][0].Travel_Method ? response[0][0].Travel_Method : '';
            this.laborMethod = response[0][0].Labor_Method ? response[0][0].Labor_Method : '';
            this.getKeyValForWorkType(this.timeSheet['Work_Type_Id'], !isEdit);
          }
        }).catch((error) => {
        });
      })
    } catch (error) {
      this.logger.log(this.fileName, "getAllFieldsLOVs ", " Error while loadData: " + JSON.stringify(error.message));
    }
  }

  async checkIfSameOscJobexist() {
    let isExist = false;
    try {
      if (this.timeSheet.Job_Number && this.isVacation && !this.isEditMode) {
        let result: any = await this.localService.checkIfSameOscJobexist(this.timeSheet.Job_Number);
        if (result.length) {
          isExist = result[0].COUNT > 0 ? true : false
        }
      }
    } catch (e) {
      this.logger.log(this.fileName, "checkIfSameOscJobexist", e.message)
      throw e;
    }
    return isExist;
  }
  async checkJobType() {
    try {
      let result: any = await this.localService.getFieldType(this.timeSheet.Job_Number);
      if (result.length > 0) {
        if (result[0].FIELDREPAIR == "true") {
          this.timeSheet.Job_Type = "field";
          this.isFieldVal = true;
        }
        if (result[0].DEPOTREPAIR == "true") {
          this.timeSheet.Job_Type = "depot";
          this.isFieldVal = false;
        }
      }
      else {
        //this.timeSheet.Job_Type = '';
      }
    }
    catch (e) {
      this.logger.log(this.fileName, "checkJobType", e.message)
      throw e;
    }
  }
  ionViewWillLeave() {
    this.events.publish("deleteFromDebrief");
  }

}
