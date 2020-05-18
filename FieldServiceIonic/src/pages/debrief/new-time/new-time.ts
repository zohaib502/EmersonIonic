import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, PopoverController, App, AlertController } from 'ionic-angular';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { ValueProvider } from '../../../providers/value/value';
import { UtilityProvider } from '../../../providers/utility/utility';
import * as moment from "moment";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { LoggerProvider } from '../../../providers/logger/logger';
import * as Enums from '../../../enums/enums';
import { TranslateService } from '@ngx-translate/core';

// import { EditModalPage } from './edit-modal/edit-modal';

@IonicPage()
@Component({
  selector: 'page-new-time',
  templateUrl: 'new-time.html',
})
export class NewTimePage implements OnInit {
  isChecked: boolean = false;
  timeValid = false;
  Work_Type: any;
  resourceId: any;
  parent: any;
  public timeArraySummary = [];
  jobname: any[] = [];
  service_start_date: any;
  service_end_date: any;
  isDateError: boolean = false;
  fileName: any = 'NewTimePage';
  enums: any;
  originalWeekStart: any;
  weekEnd: any;
  _taskObj: any;
  updateTimearr: any = [];
  isPicked: Boolean;
  combinedCheckBox: Boolean;
  isjobId: any;
  fieldLovs: any = {};

  constructor(public popoverCtrl: PopoverController, public events: Events, public appCtrl: App, public bsDatepickerConfig: BsDatepickerConfig, public navCtrl: NavController, public utilityProvider: UtilityProvider, public navParams: NavParams, private localService: LocalServiceProvider, private valueservice: ValueProvider, public modalController: ModalController, public logger: LoggerProvider, public alertCtrl: AlertController, public translate: TranslateService) {
    //10/05/2018 kamal : declared enums object to use in html
    this.enums = Enums;
    this._taskObj = this.valueservice.getTask();
    this.isjobId = this.valueservice.getTaskId();
    //08/27/2019 Gaurav V: declared resourceId to check OSC/Non-OSC user.
    this.resourceId = this.valueservice.getResourceId();
  }

  ionViewDidEnter() {
    //11/04/2019 -- Mayur Varshney -- apply condition if viewCtrl relates to SDRTabsPage or DebriefPage
    if (this.navCtrl.parent.viewCtrl.id != "DebriefPage") return;
    this.loadLovs();
    this.getTime();
    this.events.subscribe('deleteFromDebrief', (data) => {
      // Refresh listview after delete
      this.refreshTimeEntries();
    });

  }

  ngOnInit() {
    this.service_start_date = new Date();
    this.service_end_date = new Date();
  }

  gottoExpense() {
    this.navCtrl.parent.select(2);
    this.valueservice.setTime(this.timeArraySummary);
  }

  getTime() {
    return new Promise((resolve, reject) => {
      this.utilityProvider.showSpinner();
      this.localService.getTimeList(this.valueservice.getTaskId()).then((res: any[]) => {
        res.sort(function(a,b){
          let a_start_date : any = a.Service_Start_Date,  
          b_start_date : any = b.Service_Start_Date;
          if(a.EntryDate){
            a_start_date = moment(moment(a.EntryDate).format('YYYY-MM-DD'))
                              .add(a.Start_Time.split(':')[0], 'hours').add(a.Start_Time.split(':')[1], 'minutes').toDate();
          }
          if(b.EntryDate){
            b_start_date = moment(moment(b.EntryDate).format('YYYY-MM-DD'))
                              .add(b.Start_Time.split(':')[0], 'hours').add(b.Start_Time.split(':')[1], 'minutes').toDate();
          }
          return moment(a_start_date).toDate().getTime() - moment(b_start_date).toDate().getTime();
        });
        res.map(item => {
          item.isPicked = (item.isPicked && String(item.isPicked) == "true") ? true : false;
        });
        this.timeArraySummary = res;
        this.timeArraySummary.forEach((item) => {
          if (!item.EntryDate) {
            item.displayDate = moment(item.Service_Start_Date).format(this.valueservice.getUserPreferences()[0].Date_Format ? this.valueservice.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
            item.displayEndDate = moment(item.Service_End_Date).format(this.valueservice.getUserPreferences()[0].Date_Format ? this.valueservice.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
            item.Start_Time = moment(item.Service_Start_Date).format('HH:mm');
            item.End_Time = moment(item.Service_End_Date).format('HH:mm');
          } else{
            item.displayDate = moment(item.EntryDate, "YYYY-MM-DD").format(this.valueservice.getUserPreferences()[0].Date_Format ? this.valueservice.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
            if(item.End_Time == "00:00"){
              item.displayEndDate = moment(item.EntryDate, 'YYYY-MM-DD').add(1, 'day').format(this.valueservice.getUserPreferences()[0].Date_Format ? this.valueservice.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
            } else{
              item.displayEndDate = moment(item.EntryDate, 'YYYY-MM-DD').format(this.valueservice.getUserPreferences()[0].Date_Format ? this.valueservice.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
            }
          }
        })
        this.setCombinedCheckBox();
        this.utilityProvider.stopSpinner();
        resolve(true);
      }).catch((err: any) => {
        this.utilityProvider.stopSpinner();
        resolve(false);
        this.logger.log(this.fileName, 'getTime', ' Error in getTimeList : ' + JSON.stringify(err))
      })
    })
    //08/28/2018 Zohaib Khan: Sorting time array from Utility
  }

  getfieldJobList() {
    this.jobname = this.valueservice.getFieldJob();
  }

  translator(text) {
    return this.translate[text] ? this.translate[text] : text;
  }
  /**
     * Preeti Varshney 03/12/2019
     * set and send current week start date and end date to the time entry page
     */
  currentWeek() {
    let now = moment();
    let fornow = moment();
    let from_date = now.startOf('isoWeek');
    let to_date = fornow.endOf('isoWeek');
    this.originalWeekStart = moment(from_date).format('DD-MMM-YYYY');
    this.weekEnd = moment(to_date).format('DD-MMM-YYYY');
  }
  /**
     * Preeti Varshney 03/12/2019
     * open time entry page to add new entry.
     */
  addProject() {
    this.currentWeek();
    this.valueservice.continueDebrief = true;
    if (this.valueservice.getUser().ClarityID != '') {
      this.appCtrl.getRootNav().push("ClarityTimeEntryPage", { weekStart: this.originalWeekStart, weekEnd: this.weekEnd, taskId: this.valueservice.getTaskId() });
    } else {
      if (this.valueservice.getResourceId() != '0') {
        this.appCtrl.getRootNav().push("OSCNonCTimeEntryPage", { weekStart: this.utilityProvider.WeekStart, weekEnd: this.utilityProvider.weekEnd, isVacation: false, taskId: this.valueservice.getTask().IsStandalone == 'true' ? this.valueservice.getTask().Job_Number : this.valueservice.getTaskId(), taskPk: this.valueservice.getTaskId() });
      } else {
        this.appCtrl.getRootNav().push("NonClarityTimeEntryPage", { weekStart: this.originalWeekStart, weekEnd: this.weekEnd, taskId: this.valueservice.getTask().Job_Number, vacationentry: true, vacClick: true, taskPk: this.valueservice.getTaskId() });
      }
    }
  }
  /**
   * Preeti Varshney 03/12/2019
   * open popover to delete or edit entry
   */
  openEditDeletePopOver(myEvent, time) {
    this.utilityProvider.closeFab();
    try {
      /**
     * Preeti Varshney 04/19/2019
     * created object to be sent to edit page
     */
      let timeData = {
        "Primary_Key": time.Task_Number,
        //Preeti Varshney 05/01/2019 add Date to the object to be sent for edit page
        "Date": new Date(moment(time.EntryDate, 'YYYY-MM-DD').format('YYYY/MM/DD')),
        "Start_Time": time.Start_Time,
        "End_Time": time.End_Time,
        "Job_Number": this.valueservice.getTask().Job_Number,
        "Work_Type": time.Work_Type,
        "Work_Type_Id": time.Work_Type_Id,
        "Item": time.Item,
        "Item_Id": time.Item_Id,
        "Charge_Method": time.Charge_Method,
        "Charge_Method_Id": time.Charge_Method_Id,
        "totalDuration": time.Duration,
        "TagNumber": time.TagNumber,
        "SerialNumber": time.SerialNumber,
        "Description": time.Description,
        "Duration": time.Duration,
        "Comments": time.Comments,
        "Time_Id": time.Time_Id,
        "Job_Type": time.Job_Type,
        "isPicked": time.isPicked
      }
      let params = { userPopOver: true, nonClarityPage: false, timeData: timeData };
      let userPopOver = this.popoverCtrl.create('PopoverEditDeletePage', params, { enableBackdropDismiss: true, cssClass: 'PopoverEditDeletePage' });
      userPopOver.present({
        ev: myEvent
      });
    } catch (error) {
      this.logger.log(this.fileName, 'openEditDeletePopOver', ' Error in popoverCtrl : ' + error);
    }
  }
  /*
    *@author:Prateek
     *Push permission by clicking checkbox in (updateper) array
     * @param {*} event to checked checkbox true false.permission id(ampid),isallowed(y),ManageRolesPage permission id array.
     */
  updateTime() {
    if (this.isChecked == false) {
      this.isChecked = true;
      this.updateTimearr = this.timeArraySummary;
    }
    else {
      this.isChecked = false;
      this.updateTimearr = '';
    }
  }

  selectAllEntries(event, time) {
    if (event.checked == true) {
      this.updateTimearr.push(time);
      this.valueservice.setTotaltimeChecked(this.updateTimearr);

    } else {
      for (let index = 0; index < this.updateTimearr.length; index++) {
        if (this.updateTimearr[index].Time_Id == time.Time_Id) {
          this.updateTimearr.splice(index, 1)
          this.valueservice.setTotaltimeChecked(this.updateTimearr);
        }
      }
    }
  }


  updateTimeEntry(event, time, executeQuery?) {
    if (time && time != '') {
      this.localService.updateTimeEntry(time.Time_Id, event.value).then(res => {
        for (let i = 0; i < this.timeArraySummary.length; i++) {
          if (this.timeArraySummary[i].Time_Id == time.Time_Id) {
            this.timeArraySummary[i].isPicked == event.value;
          }
        }
        //  console.log(this.timeArraySummary);
        this.setCombinedCheckBox();
      });
    } else {
      console.log("executeQuery")
      if (executeQuery) {
        // console.log('here');
        // console.log(this.combinedCheckBox);
        this.localService.updateTimeEntry(this.valueservice.getTaskId(), this.combinedCheckBox, true).then(res => {
          this.timeArraySummary.map(item => {
            console.log(item);
            if (String(item.isSubmitted) != "true") {
              item.isPicked = this.combinedCheckBox;
            }
          });
        });
      }
    }
  }

  setCombinedCheckBox() {
    let combinedBox = this.timeArraySummary.filter(item => {
      return String(item.isPicked) == "true";
    });
    if (combinedBox.length == this.timeArraySummary.length) {
      this.combinedCheckBox = true;
    } else {
      this.combinedCheckBox = false;
    }
    if (this.timeArraySummary.length == 0) {
      this.combinedCheckBox = false;
    }
  }

  refreshTimeEntries() {
    this.getTime();
  }

  /**
 *@author: Prateek(21/01/2019)
 *Unsubscribe all events.
 *App Optimization
 * @memberof CalendarPage
 */
  ionViewWillLeave(): void {
    this.events.unsubscribe('deleteFromDebrief');
    this.events.unsubscribe('refreshPageData');
    this.events.unsubscribe('langSelected');
  }

  /**
   * @author Gurkirat Singh
   * 03-28-2019 Gurkirat Singh : Publish an event to navigate to SDR Flow
   *
   * @memberof TimePage
   */
  gotoSDR() {
    this.events.publish("gotoSDR");
  }

  /**
 *Gaurav Vachhani 08/27/2019
 *Method to delete time entry if clicked ok
 * @param {*} time
 * @memberof NewTimePage
 */
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
            this.localService.deleteClarityTimeObject(time.Time_Id).then((res) => {
              this.getTime();
            })
          }
        }
      ]
    });
    alert.present();
  }
  /**
   *Gaurav Vachhani 08/27/2019
  * Function to navigate to edit time page
  * @param {*} time
  * @memberof NewTimePage
  */
  async editTime(time,copyEntry?) {
    try {
      if (this.valueservice.isOSCUser()) {
        if (time.EntryDate) {
          this.appCtrl.getRootNav().push("OSCNonCTimeEntryPage", { timeData: time, taskId: time.Job_Number, isEditMode: true, isDebrief: true, copyTimeEntry: copyEntry ? true : false });
        } else {
          time.Start_Time = moment(time.Service_Start_Date).format('HH:mm')
          time.End_Time = moment(time.Service_End_Date).format('HH:mm')
          let originalTime: any = await this.localService.getTimeById(time.Original)
          if (originalTime.length > 0) {
            originalTime[0].Start_Time = moment(originalTime[0].Service_Start_Date).format('HH:mm');
            originalTime[0].End_Time = moment(originalTime[0].Service_End_Date).format('HH:mm');
          }
          let editTimeParams = { originalTime: originalTime.length > 0 ? originalTime[0]: undefined, usertype: this.valueservice.getUser().ClarityID == '' ? 'NC' : 'C', timeLength: this.timeArraySummary.length, jobname: this.jobname, chargetype: this.fieldLovs['ChargeType'], worktype: this.fieldLovs['WorkType'], chargemethod: this.fieldLovs['ChargeMethod'], items: this.fieldLovs['Item'], overtime: this.valueservice.getOverTime(), shiftcode: this.valueservice.getShiftCode(), timeObject: time, editTime: true, ifEdit: 'Edit' }
          this.openEditModal(editTimeParams, time)
        }
      }
      else {
        // if(!this.valueservice.isOSCUser() && !this.valueservice.getUser().ClarityID){
        //   time.Work_Type = time.Activity_Name;
        //   time.Time_Id = time.timeId;
        //   time.SerialNumber = time.Serial_No;
        //   time.TagNumber = time.Tag_No;
        // }
        this.appCtrl.getRootNav().push("NonClarityEditTimeEntryPage", { timeData: time, weekBtnClicked: false, nonClarityPage: false, taskId: time.Job_Number, delWeekStarts: false, delWeekEnds: false });
      }
    } catch (err) {

    }
  }

  openEditModal(editTimeParams, time) {
    // 10/09/2018 -- Mayur Varshney -- create modal class dynamically on the basis of multiple condition
    let modalClass = editTimeParams.originalTime ? 'TimeModalPageWithOriginalEntry' : 'TimeModalPage';
    let TimeModal = this.utilityProvider.showModal('EditModalPage', editTimeParams, { enableBackdropDismiss: false, cssClass: modalClass });
    TimeModal.onDidDismiss(timeObj => {
      if (timeObj != undefined) {
        timeObj.isSubmitted = "false";
        timeObj.DB_Syncstatus = "false";
        timeObj.Sync_Status = "false";
        if (this.valueservice.getTaskStatusID() == Enums.Jobstatus.Debrief_Declined && !time.CurrentMobileId && !time.Original && time.Sync_Status == 'true') {
          timeObj.Original = time.Time_Id;
          timeObj.IsAdditional = 'true';
          timeObj.Time_Id = String(this.utilityProvider.getUniqueKey());
          timeObj.DebriefStatus = Enums.DebriefStatus.ReSubmitted;
          timeObj.Time_Code_Value = timeObj.Time_Code;
        }
        timeObj.Service_Start_Date = this.formatDateTime(timeObj.Service_Start_Date,timeObj.Start_Time);
        timeObj.Service_End_Date = this.formatDateTime(timeObj.Service_End_Date,timeObj.End_Time);
        this.localService.insertTime(timeObj).then((res: any) => {
          this.getTime();
        }).catch((err: any) => {
          this.logger.log(this.fileName, 'openEditModal', 'Error in insertTime : ' + JSON.stringify(err));
        });
      }
    });
    TimeModal.present();
  }

  async loadLovs() {
    try {
      let promiseArray = [];
      promiseArray.push(this.localService.getMSTData('ChargeMethod', undefined));
      promiseArray.push(this.localService.getMSTData('WorkType', undefined));
      promiseArray.push(this.localService.getMSTData('ChargeType', undefined));
      promiseArray.push(this.localService.getMSTData('Item', undefined));
      promiseArray.push(this.localService.getMSTData('MST_OvertimeCode', undefined));
      promiseArray.push(this.localService.getMSTData('MST_ShiftCode', undefined));
      let response = await Promise.all(promiseArray);
      if (response.length > 0) {
        this.fieldLovs['ChargeMethod'] = response[0];
        let data = [];
          for (let i = 0; i < response[1].length; i++) {
            if (response[1][i].NC == 1) {
              data.push(response[1][i]);
            }
          }
        this.fieldLovs['WorkType'] = data;
        this.fieldLovs['ChargeType'] = response[2];
        this.fieldLovs['Item'] = response[3];
        this.fieldLovs['Overtime'] = response[4];
        this.fieldLovs['ShiftCode'] = response[5];
      }
    } catch (err) {
      this.logger.log(this.fileName, "loadLovs", err.message)
    }

  }

  formatDateTime(date, time) {
    let service_date = moment(date).format("YYYY-MM-DD");
    let formatDate = moment(service_date + ' ' + time).format("DD-MM-YYYYTHH:mm");
    let dateTime = moment(formatDate, "DD-MM-YYYYTHH:mm");
    return dateTime;
  }
}


