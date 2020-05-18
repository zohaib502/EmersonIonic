import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, PopoverController, App, AlertController } from 'ionic-angular';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { ValueProvider } from '../../../providers/value/value';
import { UtilityProvider } from '../../../providers/utility/utility';
import * as moment from "moment";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { LoggerProvider } from '../../../providers/logger/logger';
import * as Enums from '../../../enums/enums';
import { TranslateService } from '@ngx-translate/core';
@IonicPage()
@Component({
  selector: 'page-debrief-time-claritylist',
  templateUrl: 'debrief-time-claritylist.html',
})
export class DebriefTimeClaritylistPage {
  isChecked: boolean = false;
  timeArraySummary: any = [];
  fileName: any = 'DebriefTimeClarityList';
  enums: any = Enums;
  originalWeekStart: any;
  weekEnd: any;
  taskObj: any ={};
  updateTimearr: any = [];
  isPicked: Boolean;
  combinedCheckBox: Boolean;
  dateFormat: any;
  disableAllCheckbox: Boolean = false;
  jobname:any = [];
  fieldLovs: any = {};

  constructor(public popoverCtrl: PopoverController, public events: Events, public appCtrl: App,
    public bsDatepickerConfig: BsDatepickerConfig, public navCtrl: NavController,
    public utilityProvider: UtilityProvider, public navParams: NavParams, private localService: LocalServiceProvider,
    private valueservice: ValueProvider, public modalController: ModalController, public logger: LoggerProvider,
    public alertCtrl: AlertController, public translate: TranslateService) {
      this.taskObj = this.valueservice.getTask();
  }

  ionViewDidEnter() {
    this.taskObj = this.valueservice.getTask();
    this.loadLovs();
    this.getfieldJobList()
    this.setSelectedProcess(this.taskObj ? this.taskObj.Task_Number : {});
    this.getTime();
    this.events.subscribe('deleteFromDebrief', (data) => {
      this.getTime();
    });

  }
  goToExpense() {
    this.navCtrl.parent.select(2);
    this.valueservice.setTime(this.timeArraySummary);
  }
  /**
   *Shivansh Subnani 08/09/2019
   * This Function Returns list of time entries
   * @returns
   * @memberof DebriefTimeClaritylistPage
   */
  getTime() {
    return new Promise((resolve, reject) => {
      this.utilityProvider.showSpinner();
      this.localService.getTimeList(this.valueservice.getTaskId()).then((res: any[]) => {
        if (res && res.length > 0)
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
          if (item.EntryDate) {
            item.displayDate = moment(item.EntryDate, "YYYY-MM-DD").format(this.valueservice.getUserPreferences()[0].Date_Format ? this.valueservice.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
            if(item.End_Time == "00:00"){
              item.displayEndDate = moment(item.EntryDate, 'YYYY-MM-DD').add(1, 'day').format(this.valueservice.getUserPreferences()[0].Date_Format ? this.valueservice.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
            } else{
              item.displayEndDate = moment(item.EntryDate, 'YYYY-MM-DD').format(this.valueservice.getUserPreferences()[0].Date_Format ? this.valueservice.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
            }
          } else {
            item.displayDate = moment(item.Service_Start_Date).format(this.valueservice.getUserPreferences()[0].Date_Format ? this.valueservice.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
            item.displayEndDate = moment(item.Service_End_Date).format(this.valueservice.getUserPreferences()[0].Date_Format ? this.valueservice.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
            item.Start_Time = moment(item.Service_Start_Date).format('HH:mm');
            item.End_Time = moment(item.Service_End_Date).format('HH:mm');
          }
         
        })
        this.setCombinedCheckBox();
        this.utilityProvider.stopSpinner();
        this.handleSelectCheckBox();
        resolve(true);
      }).catch((err: any) => {
        this.utilityProvider.stopSpinner();
        resolve(false);
        this.logger.log(this.fileName, 'getTime', ' Error in getTimeList : ' + JSON.stringify(err))
      })
    })
  }
  /**
   *Shivansh Subnani 08/09/2019
   *Function To translate keys
   * @param {*} text
   * @returns
   * @memberof DebriefTimeClaritylistPage
   */
  translator(text) {
    return this.translate[text] ? this.translate[text] : text;
  }

  /**
   * Shivansh Subnani 08/07/2019
   * open time entry page to add new entry.
   */
  addProject() {
    if (this.utilityProvider.isNotNull(this.valueservice.getUser().ClarityID)) {
      this.appCtrl.getRootNav().push("ClarityTimeEntryPage", { weekStart: moment(moment().startOf('isoWeek')).format('DD-MMM-YYYY'), weekEnd: moment(moment().endOf('isoWeek')).format('DD-MMM-YYYY'), taskId: this.valueservice.getTaskId(), fromDebrief: true });
    } else {
      this.appCtrl.getRootNav().setRoot("NonClarityTimeEntryPage", { weekStart: moment(moment().startOf('isoWeek')).format('DD-MMM-YYYY'), weekEnd: moment(moment().endOf('isoWeek')).format('DD-MMM-YYYY'), taskId: this.valueservice.getTask().Job_Number, vacationentry: true, vacClick: true, taskPk: this.valueservice.getTaskId() });
    }
  }
  /**
   *Shivansh Subnani 08/09/2019
   * Function to set isPicked key of checkbox to true and false
   * @param {*} event
   * @param {*} time
   * @param {*} [executeQuery]
   * @memberof DebriefTimeClaritylistPage
   */
  updateTimeEntry(event, time, executeQuery?) {
    if (time) {
      this.localService.updateTimeEntry(time.Time_Id, event.value).then(res => {
        this.timeArraySummary.forEach((item) => {
          if (item.Time_Id == time.Time_Id) item.isPicked = event.value
        })
        this.setCombinedCheckBox();
      });
    } else {
      if (executeQuery) {
        this.localService.updateTimeEntry(this.valueservice.getTaskId(), this.combinedCheckBox, true).then(res => {
          this.timeArraySummary.map(item => {
            if (item.isSubmitted=="false") {
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
    this.combinedCheckBox = combinedBox.length == this.timeArraySummary.length ? true : false;
    if (this.timeArraySummary.length == 0) {
      this.combinedCheckBox = false;
    }
  }
  /**
 *@author: Shivansh(07/08/2019)
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
   * @author Shivansh Subnani
   * 08-07-2019 Shivansh Subnani : Publish an event to navigate to SDR Flow
   *
   * @memberof TimePage
   */
  gotoSDR() {
    this.events.publish("gotoSDR");
  }
  /**
   *Shivansh Subnani 08/09/2019
   *Method to delete time entry if clicked ok
   * @param {*} time
   * @memberof DebriefTimeClaritylistPage
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
   *Shivansh Subnani 08/09/2019
   * Function to navigate to edit time page
   * @param {*} time
   * @memberof DebriefTimeClaritylistPage
   */
  async editTime(time,index) {
    try {
      if (time.EntryDate) {
        if (this.utilityProvider.isNotNull(this.valueservice.getUser().ClarityID)) {
          delete time.displayDate;
          delete time.displayEndDate;
          this.appCtrl.getRootNav().push("ClarityTimeEntryPage", { timeData: time, fromDebrief: true, editClarity: true });
        } else {
          this.appCtrl.getRootNav().push("NonClarityEditTimeEntryPage", { timeData: time, weekBtnClicked: false, nonClarityPage: false, taskId: time.Job_No, delWeekStarts: false, delWeekEnds: false });
        }
      } else {
        time.Start_Time = moment(time.Service_Start_Date).format('HH:mm')
        time.End_Time = moment(time.Service_End_Date).format('HH:mm')
        let originalTime : any = await this.localService.getTimeById(time.Original);
        if (originalTime.length > 0) {
          originalTime[0].Start_Time = moment(originalTime[0].Service_Start_Date).format('HH:mm');
          originalTime[0].End_Time = moment(originalTime[0].Service_End_Date).format('HH:mm');
        }
        let editTimeParams = { originalTime: originalTime.length > 0 ?  originalTime[0]: undefined, usertype: this.valueservice.getUser().ClarityID == '' ? 'NC' : 'C', timeLength: this.timeArraySummary.length, jobname: this.jobname, chargetype: this.fieldLovs['ChargeType'], worktype: this.fieldLovs['WorkType'], chargemethod: this.fieldLovs['ChargeMethod'], items: this.fieldLovs['Item'], overtime: this.valueservice.getOverTime(), shiftcode: this.valueservice.getShiftCode(), timeObject: time, editTime: true, ifEdit: 'Edit' }
        this.openEditModal(editTimeParams, time, index)
      }
    } catch (err) {
      this.logger.log(this.fileName, "editTime",err.message)
    }
    
  }
  handleSelectCheckBox() {
    this.disableAllCheckbox = false;
    let arr = [];
    this.timeArraySummary.forEach((item) => {
      if (item.isSubmitted == 'true') {
        arr.push(item);
        // this.disableAllCheckbox = true;
      }
    })
    if (arr.length == this.timeArraySummary.length) {
      this.disableAllCheckbox = true;
    }
  }

  async setSelectedProcess(taskNumber) {
    try {
      if (taskNumber) {
        if (!this.utilityProvider.isNotNull(this.taskObj.Selected_Process)) {
          let selectedProcess:any = await this.localService.getSelectedProcess(taskNumber);
          if(selectedProcess.length > 0){
            this.taskObj.Selected_Process = parseInt(selectedProcess[0].Selected_Process);
          }

        }
      }
    } catch (error) {
      this.logger.log(this.fileName, "setSelectedProcess", error)
    }
  }

  openEditModal(editTimeParams, time, index) {
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
      // promiseArray.push(this.localService.getMSTData('FieldJobName', undefined));
      let response = await Promise.all(promiseArray);
      if (response.length > 0) {
        this.fieldLovs['ChargeMethod'] = response[0];
        let data = [];
          for (let i = 0; i < response[1].length; i++) {
            if (response[1][i].C == 1) {
              data.push(response[1][i]);
            }
          }
        this.fieldLovs['WorkType'] = data;
        this.fieldLovs['ChargeType'] = response[2];
        this.fieldLovs['Item'] = response[3];
        this.fieldLovs['Overtime'] = response[4];
        this.fieldLovs['ShiftCode'] = response[5];
        //this.fieldLovs['FieldJobName'] = response[6];
      }
    } catch (err) {
      this.logger.log(this.fileName, "loadLovs", err.message)
    }

  }

  getfieldJobList() {
    // 08/07/2019 -- Mayur Varshney -- apply sort for Clarity Task Name for clarity users
    this.jobname = (this.valueservice.getFieldJob()).sort(function (a, b) {
      if (a.JobName > b.JobName)
        return 1;
      if (a.JobName < b.JobName)
        return -1;
      return 0;
    });
  }

  formatDateTime(date, time) {
    let service_date = moment(date).format("YYYY-MM-DD");
    let formatDate = moment(service_date + ' ' + time).format("DD-MM-YYYYTHH:mm");
    let dateTime = moment(formatDate, "DD-MM-YYYYTHH:mm");
    return dateTime;
  }


}
