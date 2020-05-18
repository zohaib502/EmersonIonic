import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import * as moment from "moment";
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LocalServiceSdrProvider } from '../../../providers/local-service-sdr/local-service-sdr';
import { LoggerProvider } from '../../../providers/logger/logger';
import { ValueProvider } from '../../../providers/value/value';
import { UtilityProvider } from '../../../providers/utility/utility';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as Enums from '../../../enums/enums';

@IonicPage()
@Component({
  selector: 'page-clarity-time-entry',
  templateUrl: 'clarity-time-entry.html',
})
export class ClarityTimeEntryPage {

  fileName: any = 'Time_Entry_Page';
  fieldLovs: any = {};
  timeSheet: any = {};
  headerData: any;
  taskId: string;
  dayList: any = [];
  weekStart: any;
  weekEnd: any;
  selectedDay: any;
  recordExists: boolean = false;
  fromDebrief: boolean = false;
  isDayEntry: boolean = false;
  chargeMethodDisable: boolean = false;
  isTimeEntry: any = '';
  jobNumber: string;
  datepickerConfig: Partial<BsDatepickerConfig>;
  @ViewChild('dps') dps: BsDatepickerDirective;
  minDate: Date = new Date(new Date().setDate(new Date().getDate() - 90));
  editClarity: boolean = false;
  debriefEdit: boolean = false;
  startTime: any;
  endTime: any;
  duration: any;
  displayDate: any;
  displayEndDate: any;
  zeroDuration: boolean = false;
  timeEntriesArr: any = [];
  disableSaveBtn = false;
  weekEditPage: boolean = false;
  timeSheetTempArr: any = {};
  selectedDate: any = '';
  items: any = {};
  disableProject: boolean = false;
  isBreakSelected: boolean = false;
  travelMethodFromOSC: String = '';
  laborMethodFromOSC: String = '';
  chargeTypeFromOSC: String = '';
  editList: boolean;
  OSCJob : boolean = true;
  stateDropdown: boolean = false;
  constructor(public localServiceSdr: LocalServiceSdrProvider, public navCtrl: NavController,
    public navParams: NavParams, public appCtrl: App, public events: Events,
    public localService: LocalServiceProvider, public logger: LoggerProvider,
    public valueProvider: ValueProvider, public utilityProvider: UtilityProvider) {
    this.dayList.days = [];
    this.timeSheet = this.navParams.get('timeData') ? this.navParams.get('timeData') : {};
    this.selectedDate = this.navParams.get('date') ? this.navParams.get('date') : '';
    this.editList = this.navParams.get('editList');
    this.isTimeEntry = "true";
    this.timeSheetTempArr = JSON.parse(JSON.stringify(this.timeSheet));
    if (!this.timeSheet['Task_Number'])
      this.timeSheet['Task_Number'] = this.valueProvider.getTaskId();
    this.jobNumber = this.valueProvider.getTaskId() ? this.valueProvider.getTaskId() : undefined;
    if (!this.timeSheet['Job_Number'])
      this.timeSheet['Job_Number'] = this.jobNumber;
    // this.recordExists = this.navParams.get('timeData') ? true : false;
    //this.getDurationOnDate(this.navParams.get('weekDayStart') ? this.navParams.get('weekDayStart') : moment().toDate());
    this.datepickerConfig = Object.assign({}, {
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false,
      minDate: this.minDate
    });
    this.events.subscribe('saveToMST', (obj) => {
      this.recordExists = false;
      if (this.weekEditPage) {
        this.timeSheetTempArr['Start_Time'] = obj.Start_Time;
        this.timeSheetTempArr['End_Time'] = obj.End_Time;
        this.timeSheetTempArr['Comments'] = obj.Comments;
        this.timeSheetTempArr['Duration'] = obj.Duration;
        this.timeSheetTempArr['EntryDate'] = obj.EntryDate;
        this.timeSheetTempArr['Original'] = obj.Original;
        // this.timeSheet['UniqueMobileId'] = obj.UniqueMobileId;
        this.timeSheetTempArr['Time_Id'] = obj.Time_Id;
        this.timeSheetTempArr['Reconcile_Duration'] = undefined;
        this.timeSheetTempArr['DB_Syncstatus'] = obj.DB_Syncstatus;
        this.timeSheetTempArr['StatusID'] = obj.StatusID;
        this.timeSheetTempArr['isSubmitted'] = obj.isSubmitted;
        this.timeSheetTempArr['Service_Start_Date'] = obj.Service_Start_Date;
        this.timeSheetTempArr['Service_End_Date'] = obj.Service_End_Date;
        this.timeSheetTempArr['isSubmitted'] = obj.isSubmitted;
        if (obj.oldDuration) {
          let oldDuration: any = (moment(obj.oldDuration, "hh:mm"));
          let newDuration: any = (moment(obj.Duration, "hh:mm"));
          let reconcileDuration = (newDuration - oldDuration) / 60000;
          this.timeSheetTempArr['Reconcile_Duration'] = this.getTimeFromMins(reconcileDuration);
        }
      } else {
        this.timeSheet['Start_Time'] = obj.Start_Time;
        this.timeSheet['End_Time'] = obj.End_Time;
        this.timeSheet['Comments'] = obj.Comments;
        this.timeSheet['Duration'] = obj.Duration;
        this.timeSheet['EntryDate'] = obj.EntryDate;
        this.timeSheet['Original'] = obj.Original;
        // this.timeSheet['UniqueMobileId'] = obj.UniqueMobileId;
        this.timeSheet['Time_Id'] = obj.Time_Id;
        this.timeSheet['Reconcile_Duration'] = undefined;
        this.timeSheet['DB_Syncstatus'] = obj.DB_Syncstatus;
        this.timeSheet['StatusID'] = obj.StatusID;
        this.timeSheet['isSubmitted'] = obj.isSubmitted;
        this.timeSheet['Service_Start_Date'] = obj.Service_Start_Date ;
        this.timeSheet['Service_End_Date'] = obj.Service_End_Date;
        if (obj.oldDuration) {
          let oldDuration: any = (moment(obj.oldDuration, "hh:mm"));
          let newDuration: any = (moment(obj.Duration, "hh:mm"));
          let reconcileDuration = (newDuration - oldDuration) / 60000;
          this.timeSheet['Reconcile_Duration'] = this.getTimeFromMins(reconcileDuration);
        }
      }
      if (obj.Time_Id) {
        this.recordExists = true
      }
      this.saveMSTData();
    });
    /**
    * Preeti Varshney 10/06/2019
    * Send the original data when it is Week Edit Page
    */
    this.events.subscribe('openAddEditModal', (obj) => {
      if (this.weekEditPage) {
        this.timeSheetTempArr['newActivityType'] = this.timeSheet.Work_Type;
        this.timeSheetTempArr['weekEditPage'] = true;
        this.events.publish('getNewTimeEntryData', this.timeSheetTempArr);
      }
      else {
        this.timeSheetTempArr['weekEditPage'] = false;
        this.events.publish('getNewTimeEntryData', this.timeSheet);
      }
    });
    this.events.subscribe('getWeekTotalHours', (data) => {
      this.isDayEntry = data;
    })
    this.fromDebrief = this.navParams.get('fromDebrief') ? this.navParams.get('fromDebrief') : false;
    /**
     * Preeti Varshney 09/13/2019
     * Change the view when it is Debrief Edit
     */
    this.editClarity = this.navParams.get('editClarity') ? this.navParams.get('editClarity') : false;
    if (this.fromDebrief && this.editClarity) {
      this.debriefEdit = true;
      this.startTime = this.utilityProvider.getDateFormatTime( moment(this.timeSheet.EntryDate, 'YYYY-MM-DD'), this.timeSheet['Start_Time']);
      this.endTime = this.utilityProvider.getDateFormatTime( moment(this.timeSheet.EntryDate, 'YYYY-MM-DD'), this.timeSheet['End_Time']);
      this.duration = this.timeSheet['Duration'];
      this.displayDate = moment(this.timeSheet.EntryDate, 'YYYY-MM-DD').format("DD-MMM-YYYY");
      this.displayEndDate = moment(this.timeSheet.EntryDate, 'YYYY-MM-DD').format("DD-MMM-YYYY");
      this.headerData = this.utilityProvider.getHeaderData(this.timeSheet['Job_Number'], "Debrief", "Job #", "Timesheet Clarity");
    }
    if (this.editList) {
      this.headerData = { title1: "", title2: "Timesheet Clarity", taskId: '' };
    }
    else {
      this.headerData = this.utilityProvider.getHeaderData(this.timeSheet['Job_Number'], "Debrief", "Job #", "Timesheet Clarity");

    }
    /**
     * Preeti Varshney 09/16/2019
     * Load Task, Overtime Code, Shift Code on Edit Page
     */
    if (this.editClarity) {
      this.getFieldsByProject(this.timeSheet.Clarity_Project_Id);
      this.getAllFieldsLOVs();
      this.recordExists = true;
      // Preeti Varshney 12/05/2019 For OSC Clarity User all jobs are osc jobs except Not Applicable.
      if (this.timeSheet.Job_Number == 'Not Applicable') {
        this.OSCJob = false;
        this.compareCountry(this.timeSheet.Country_Code, false);
      }
      else {
        this.OSCJob = true;
      }
    }
    if (!this.fromDebrief && this.editClarity) {
      this.weekEditPage = true;
      this.events.subscribe('refreshEditPage', (data) => {
        this.getWeekData();
      })
    }
  }

  /**
 *Pulkit (09-Aug-2019)
 *Use to get All Projects at first load
 * @memberof ClarityTimeEntryPage
 */
  ionViewDidLoad() {
    this.getAllFieldsLOVs();
    this.disableProject = false;
    if (this.fromDebrief) {
      this.setClarityProjectFromOSC();
      this.OSCJob = true;
    }

    if (this.weekEditPage || this.fromDebrief) {
      this.getTimeDataAndInsertTempTime()
    }
    this.getDurationOnDate(this.navParams.get('weekDayStart') ? this.navParams.get('weekDayStart') : moment().toDate());
  }

  ionViewDidEnter(){
      this.events.publish('user:created', "Time");
  }

  /**
  *Pulkit (09-Aug-2019)
  *Use to return previous pade on cancel click
  * @memberof ClarityTimeEntryPage
  */
  cancelBtn() {
    if (this.fromDebrief) {
      this.navCtrl.getPrevious().data.fromDebrief = this.fromDebrief;
      this.events.publish("deleteFromDebrief");
      this.appCtrl.getRootNav().pop()
    } else {
      this.appCtrl.getRootNav().setRoot("ClarityTimelistPage");
    }
  }

  /**
  * Pulkit (19-Aug-2019)
  *Use to get the day from day Name
  * @memberof ClarityTimeEntryPage
  */
  getWeekDay(dayName) {
    let arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return arr.indexOf(dayName);
  }
  /**
   * Pulkit (11-Aug-2019)
   *Use to change week days at the time or date selection
   * @memberof ClarityTimeEntryPage
   */
  getDurationOnDate(dateVal?) {
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
      this.dayList.days = this.utilityProvider.dayListData(this.weekStart);
      this.events.publish('updateExpandable', this.dayList);
      this.getWeekData();
    }
    catch (error) {
      this.logger.log(this.fileName, "getDurationOnDate ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }

  /**
   * Pulkit (11-Aug-2019)
   * Date Select on single click ion ipad
   * @memberof ClarityTimeEntryPage
   */
  onShowPicker(event) {
    event.dayHoverHandler = this.utilityProvider.singleClickDaySelector(event, this.dps);
  }

  /**
   * Pulkit (11-Aug-2019)
   *Use to get Projects, Charge Method, & Countries from DB
   * @memberof ClarityTimeEntryPage
   */
  getAllFieldsLOVs() {
    try {
      return new Promise((resolve, reject) => {
        this.utilityProvider.showSpinner();
        let promiseArray = [];
        this.fieldLovs = {}
        this.localService.getTaskForTimeSheet().then((res: any) => {
          this.fieldLovs['Job_Number'] = res;

        });
        this.localService.getProjects(this.valueProvider.getUser().ClarityID).then((projects: any[]) => {
          if (projects) {
            this.fieldLovs['Clarity_Project'] = projects;

            promiseArray.push(this.localService.getMSTData('ChargeMethod', undefined));
            promiseArray.push(this.localService.getMSTData('WorkType', undefined));
            promiseArray.push(this.localService.getMSTData('Country', undefined, 'Country_Name'));

            promiseArray.push(this.localService.getMSTData('ChargeType', undefined, 'Value'));
            promiseArray.push(this.localService.getMSTData('Item', undefined, 'Type'));
            resolve(true)

          }
          Promise.all(promiseArray).then((response) => {
            this.fieldLovs['Charge_Method'] = response[0].filter(item => {
              return item.ID != Enums.chargeMethod.NonBillable;
            });
            // this.fieldLovs['Charge_Method'].unshift({ "ID": -2, "Value": "No Value" });
            this.fieldLovs['Work_Type'] = response[1];
            let data = [];
            for (let i = 0; i < response[1].length; i++) {
              if (response[1][i].C == 1) {
                data.push(response[1][i]);
              }
            }
            this.fieldLovs['Work_Type'] = data;
            this.fieldLovs['Country_Code'] = response[2];
            this.fieldLovs['Country_Code'].unshift({ "ID": -2, "Country_Name": "No Value" });

            this.fieldLovs['Charge_Type'] = response[3];

            this.fieldLovs['Item'] = response[4];
            this.items['Item'] = response[4];
            this.setValuesFromOSC();
            if (this.editClarity) {
              this.filterItemLovs(this.timeSheet.Work_Type_Id, true);
            } else {
              this.filterItemLovs(this.timeSheet.Work_Type_Id);
            }
            this.utilityProvider.stopSpinner();
            resolve(true);
          }).catch((error) => {
            this.utilityProvider.stopSpinner();
            //this.handleError(this.fileName, "submitReportAttachments", "Error in promise : " + JSON.stringify(error));
            reject(error);
          });
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          reject(error);
          this.logger.log(this.fileName, 'getAllFieldsLOVs', 'Error in getAllFieldsLOVs : ' + JSON.stringify(error));
        });
      })
    }
    catch (error) {
      this.logger.log(this.fileName, "getAllFieldsLOVs ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }

  /**
   * Pulkit (11-Aug-2019)
   * Use to get Tasks, OverTime code & Shift code based on Projects
   * @param {*} projectID
   * @returns
   * @memberof ClarityTimeEntryPage
   */
  getFieldsByProject(projectID) {
    try {
      return new Promise((resolve, reject) => {
        let promiseArray = [];//todo empty task list and all lov
        this.localService.getMSTAssignmentTask(projectID).then((response: any[]) => {
          if (!response.length) {
            this.localService.getMSTData('MST_TaskName', projectID, 'TASK_NAME').then((response: any[]) => {
              if (response) {
                this.fieldLovs['Field_Job_Name'] = response;
              }
            }).catch((error: any) => {
              this.logger.log(this.fileName, 'getFieldsByProject', 'Error in getFieldsByProject : ' + JSON.stringify(error));
            });
          }
          else {
            this.fieldLovs['Field_Job_Name'] = response;

          }
          promiseArray.push(this.localService.getClarityOvertimeCode(projectID));
          promiseArray.push(this.localService.getClarityShiftCode(projectID));
          Promise.all(promiseArray).then((response) => {
            this.fieldLovs['Time_Code'] = response[0];
            if (response[0].length > 0) this.fieldLovs['Time_Code'].unshift({ "ID": -2, "OVERTIMECODE": "No Value" });
            this.fieldLovs['Shift_Code'] = response[1];
            if (response[1].length > 0) this.fieldLovs['Shift_Code'].unshift({ "ID": -2, "SHIFTCODE": "No Value" });
            resolve(true);
          }).catch((error) => {
            this.logger.log(this.fileName, 'setOTAndShiftCode', 'Error in setOTAndShiftCode : ' + JSON.stringify(error));
            reject(error);
          });
        }).catch((error: any) => {//todo name chan and error handling
          this.logger.log(this.fileName, 'setOTAndShiftCode', 'Error in setOTAndShiftCode : ' + JSON.stringify(error));
        });;
      })
    }
    catch (error) {
      this.logger.log(this.fileName, "getFieldsByProject ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }


  /**
   * Pulkit (12-Aug-2019)
   * Clear all rquired fields except parametered fields
   * @param {*} [notToRemove]
   * @memberof ClarityTimeEntryPage
   */
  clearFields(notToRemove?, notToClear?) {
    let obj = ['Job_Number', 'Clarity_Project', 'Field_Job_Name', 'Time_Code', 'Shift_Code', 'Item', 'Work_Type', 'Work_Type_Id', 'Charge_Method_Id', 'Charge_Method', 'Charge_Type', 'City', 'State', 'Country_Code']
    if (notToRemove) {
      obj = obj.filter(function (el) {
        return notToRemove.indexOf(el) < 0;
      });
    }
    obj.forEach(element => {
      this.timeSheet[element] = ''
    });
    if(notToClear){
      this.chargeMethodDisable = false;
      this.isBreakSelected = false;
    }
    this.events.publish('updateExpandable', this.dayList);
  }


  clearBreakFields(notToRemove?) {
    let obj = ['Field_Job_Name', 'Time_Code', 'Shift_Code', 'Charge_Type', 'Item']
    if (notToRemove) {
      obj = obj.filter(function (el) {
        return notToRemove.indexOf(el) < 0;
      });
    }
    obj.forEach(element => {
      this.timeSheet[element] = ''
    });
  }

  getWeekData(cityState?,fromTemp?) {
    let data = {};
    if(cityState) {
      this.timeSheet.State = this.timeSheet.State ? this.timeSheet.State.trim() : null;
      this.timeSheet.City = this.timeSheet.City ? this.timeSheet.City.trim() : null;
    }
    if (this.editClarity && cityState) return;
    return new Promise((resolve, reject) => {
      // this.dayData['entryDate'] = moment(this.dayData.entryDate).format("YYYY-MM-DD");
      if (this.weekEditPage) {
        data = {
          "Clarity_Project": this.timeSheetTempArr["Clarity_Project_Id"], "Job_Number": this.timeSheetTempArr["Job_Number"], "Task": this.timeSheetTempArr["Field_Job_Name_Id"], "OTCode": this.timeSheetTempArr["Time_Code_Id"], "ShiftCode": this.timeSheetTempArr["Shift_Code_Id"], "ChargeType": this.timeSheetTempArr['Charge_Type_Id'], "workType": this.timeSheetTempArr["Work_Type_Id"], "Item": this.timeSheetTempArr['Item_Id'], "chargeMethod": this.timeSheetTempArr["Charge_Method_Id"],
          "City": this.timeSheetTempArr["City"], "Country_Code": this.timeSheetTempArr["Country_Code"], "State": this.timeSheetTempArr["State"], "startDate": moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD'), "endDate": moment(this.weekEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD')
        };
      } else {
        data = {
          "Clarity_Project": this.timeSheet["Clarity_Project_Id"], "Job_Number": this.timeSheet["Job_Number"], "Task": this.timeSheet["Field_Job_Name_Id"], "OTCode": this.timeSheet["Time_Code_Id"], "ShiftCode": this.timeSheet["Shift_Code_Id"], "ChargeType": this.timeSheet['Charge_Type_Id'], "workType": this.timeSheet["Work_Type_Id"], "Item": this.timeSheet['Item_Id'], "chargeMethod": this.timeSheet["Charge_Method_Id"],
          "City": this.timeSheet["City"], "Country_Code": this.timeSheet["Country_Code"], "State": this.timeSheet["State"], "startDate": moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD'), "endDate": moment(this.weekEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD')
        };
      }
      if (this.timeSheet["Clarity_Project"]) {
        //let tableName=fromTemp?fromTemp:this.weekEditPage;
        // this.localService.getWeekDayDuration(data, undefined, this.weekEditPage).then((res: any[]) => {
        this.localService.getWeekDayDuration(data, undefined, true).then((res: any[]) => {
          if (res.length) {
            this.events.publish('setDayDuration', res);
          }
          else {
            this.events.publish('updateExpandable', this.dayList);
            resolve(false);
          }
          if (this.weekEditPage)
            this.getTimeId(data, "true");
        }).catch((err: any) => {
          this.utilityProvider.stopSpinner();
          resolve(false);
          this.logger.log(this.fileName, 'getWeekData', ' Error in getWeekData : ' + JSON.stringify(err))
        })
      }
      else {
        resolve(false);
      }
    })
  }

  getTimeId(data, timeID) {
    return new Promise((resolve, reject) => {
      this.localService.getWeekDayDuration(data, timeID, this.weekEditPage).then((res: any[]) => {
        if (res.length) {
          this.timeEntriesArr = res
        }
        else {
          this.timeEntriesArr = [];
          resolve(false);
        }
      }).catch((err: any) => {
        this.utilityProvider.stopSpinner();
        resolve(false);
        this.logger.log(this.fileName, 'getWeekData', ' Error in getWeekData : ' + JSON.stringify(err))
      })
    })
  }

    /**
   * Pulkit (11-Aug-2019)
   * Use to Insert data from Time_Temp to Time table at the time of click on Save Task Or save & Close
   * @param {*} isSaveClose
   * @memberof insertFromTempToTime
   */
  async insertFromTempToTime(isSaveClose?) {
    try {

      let response = await this.localService.getMSTData('Time_Temp', '');//.then((response: any[]) => {
      if (response) {
        let res = await this.localService.insertTimeBatch(response);//then((res: any[]) => {
        if (res) {
          if (isSaveClose)
            this.cancelBtn();
        }
      }
    }
    catch (error) {
      this.disableSaveBtn = false;
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, "insertFromTempToTime ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }
  /**
   * Pulkit (11-Aug-2019)
   * Use to generate fieldLOVs based on given keys
   * @param {*} key
   * @param {*} val
   * @memberof ClarityTimeEntryPage
   */
  searchModal(key, val) {
    try {
      let isTranslateVal=false;
      if(key=='Charge_Type' || key=='Work_Type' || key=='Item' || key=='Charge_Method'){
        isTranslateVal=true;
      }
      let searchModal = this.utilityProvider.showModal("TimesheetDropdownPage", { dataSource: this.fieldLovs[key], type: 'mstData', ddValue: val,isTranslate:isTranslateVal }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
      searchModal.present();
      searchModal.onDidDismiss(data => {
        if (data) {
          if (!this.timeSheet[key] && (key == 'Clarity_Project' || key == 'Job_Number')) {
            if(key == 'Clarity_Project'){
              this.clearFields([ 'Job_Number', 'Clarity_Project', 'Item', 'Work_Type', 'Work_Type_Id', 'Charge_Method_Id', 'Charge_Method', 'Charge_Type', 'City', 'State', 'Country_Code']);
            } else{
              this.clearFields(['Job_Number'], true);
            }
          }
          if (key == 'Field_Job_Name' || key == 'Charge_Method' || key == 'Work_Type' || key == 'Time_Code' || key == 'Shift_Code' || key == 'Clarity_Project' || key == 'Charge_Type' || key == 'Item') {
            if (data.ID == undefined || data.ID == -2) {
              this.timeSheet[key + "_Id"] = null;
            }
            else {
              this.timeSheet[key + "_Id"] = data.ID;
            }
          }
          this.timeSheet[key] = data.LookupValue;
          if (key == 'Clarity_Project' || key == 'Job_Number') {
            if (key == 'Clarity_Project') {
              this.getFieldsByProject(data.ID)
            }
            if (key == 'Job_Number') {
              this.timeSheet['Task_Number'] = data.ID;
              this.clearFields(['Job_Number'], true);
              this.setClarityProjectFromOSC();
              // this.localService.dropTempTime();
              this.getTimeDataAndInsertTempTime();
              if(data.LookupValue == 'Not Applicable'){
                this.OSCJob = false;
              }
              else{
                this.OSCJob = true;
              }
            }
          }
          else if (!this.editClarity) {
            this.getWeekData(undefined,true);
          }

          if(key=='Job_Number'){
            this.setValuesFromOSC();
          }
          if (key == 'Work_Type') {
            let id = data.ID.toString();
            this.timeSheet.Item = '';
            this.filterItemLovs(id);

          }
          // Preeti Varshney 11/18/2019 added condition for country dropdown.
          if(key == 'Country_Code') {
             this.timeSheet.State = '';
             this.timeSheet.City = '';
             this.compareCountry(data.ID,true);
          }

        }
        data = null;
      });
    }
    catch (error) {
      this.logger.log(this.fileName, "searchModal ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }



  /**
   * Pulkit (11-Aug-2019)
   * Use to save data into DB
   * @memberof ClarityTimeEntryPage
   */
  async saveMSTData(edit?) {
    if (this.duration == '00:00') {
      this.zeroDuration = true;
      return;
    }
    try {
      let keys = Object.keys(this.timeSheet);
      let novalue;
      keys.forEach(key => {
        if (this.timeSheet[key] == "No Value") {
          this.timeSheet[key] = "";
        }
      });
      if (this.weekEditPage && edit) {
        this.recordExists = true;
        var selectedDate = (this.selectedDate != '') ? moment(this.selectedDate, 'DD-MMM-YYYY').format('YYYY-MM-DD') : '';
        let finalTimesheetArr = [];
        for (let i = 0; i < this.timeEntriesArr.length; i++) {
          //if(!(this.timeEntriesArr[i].StatusID == Enums.Jobstatus.Debrief_In_Progress || this.timeEntriesArr[i].StatusID == Enums.Jobstatus.Debrief_Declined) || String(this.timeEntriesArr[i]['IsAdditional'])){
          if (selectedDate == '' || selectedDate == this.timeEntriesArr[i].EntryDate) {
            this.timeEntriesArr[i].Time_Code_Id = this.timeSheet.Time_Code_Id;
            this.timeEntriesArr[i].Time_Code = this.timeSheet.Time_Code;
            this.timeEntriesArr[i].Work_Type_Id = this.timeSheet.Work_Type_Id;
            this.timeEntriesArr[i].Work_Type = this.timeSheet.Work_Type;
            this.timeEntriesArr[i].Charge_Type = this.timeSheet.Charge_Type;
            this.timeEntriesArr[i].Charge_Type_Id = this.timeSheet.Charge_Type_Id;
            this.timeEntriesArr[i].Item = this.timeSheet.Item;
            this.timeEntriesArr[i].Item_Id = this.timeSheet.Item_Id;
            this.timeEntriesArr[i].Field_Job_Name = this.timeSheet.Field_Job_Name;
            this.timeEntriesArr[i].Field_Job_Name_Id = this.timeSheet.Field_Job_Name_Id;
            this.timeEntriesArr[i].Shift_Code_Id = this.timeSheet.Shift_Code_Id;
            this.timeEntriesArr[i].Shift_Code = this.timeSheet.Shift_Code;
            this.timeEntriesArr[i].Charge_Method_Id = this.timeSheet.Charge_Method_Id;
            this.timeEntriesArr[i].Charge_Method = this.timeSheet.Charge_Method;
            this.timeEntriesArr[i].State = this.timeSheet.State;
            this.timeEntriesArr[i].City = this.timeSheet.City;
            this.timeEntriesArr[i].Country_Code = this.timeSheet.Country_Code;
            this.timeEntriesArr[i].StatusID = this.timeSheet.StatusID;
            this.timeEntriesArr[i].DB_Syncstatus = this.timeSheet.DB_Syncstatus;
            // this.timeEntriesArr[i].isSubmitted = this.timeSheet.isSubmitted;
            this.timeEntriesArr[i].isPicked = this.timeSheet.isPicked;
          }
          //}
        }
        for (let i = 0; i < this.timeEntriesArr.length; i++) {
          // if ((this.timeEntriesArr[i].StatusID == Enums.Jobstatus.Debrief_In_Progress && ((this.timeEntriesArr[i].IsAdditional == 'false' || this.timeEntriesArr[i].IsAdditional == false))) || (this.timeEntriesArr[i].StatusID == Enums.Jobstatus.Debrief_Started && (this.timeEntriesArr[i].isSubmitted == 'true' || this.timeEntriesArr[i].isSubmitted == true))) 
          if (this.timeEntriesArr[i].StatusID == Enums.Jobstatus.Debrief_In_Progress && (this.timeEntriesArr[i].IsAdditional == 'false' || this.timeEntriesArr[i].IsAdditional == false)) {
            delete this.timeEntriesArr[i];
          }
        }
        if (this.timeEntriesArr.length > 0) {
          this.disableSaveBtn = true;
            if(this.timeEntriesArr.length>1){
            this.timeEntriesArr=this.timeEntriesArr.filter(item=>{
              return (item.Sync_Status != "true" || item.StatusID == Enums.Jobstatus.Debrief_Declined)
            })
          }
          this.localServiceSdr.insertOrUpdateTimeSheetData(this.timeEntriesArr, this.recordExists, 'Time_Temp').then((response: any) => {
            this.localService.getMSTData('Time_Temp', '').then((response: any[]) => {
              if (response) {
                this.localService.insertTimeBatch(response).then((res: any[]) => {
                  if (res) {
                    if (edit)
                      this.cancelBtn();
                  }
                }).catch((error: any) => {
                  this.disableSaveBtn = false;
                  this.utilityProvider.stopSpinner();
                  this.logger.log(this.fileName, 'getFieldsByProject', 'Error in getFieldsByProject : ' + JSON.stringify(error));
                });
              }

            }).catch((error: any) => {
              this.disableSaveBtn = false;
              this.utilityProvider.stopSpinner();
              this.logger.log(this.fileName, 'getFieldsByProject', 'Error in getFieldsByProject : ' + JSON.stringify(error));
            })
          }).catch((error: any) => {
            this.disableSaveBtn = false;
            this.utilityProvider.stopSpinner();
            this.logger.log(this.fileName, 'saveMSTData', ' Error in saveMSTData : ' + JSON.stringify(error));
          });
        } else {
          this.cancelBtn();
        }
      }
      else {
        let data:any = {};
        if (this.weekEditPage) {
          data = this.timeSheetTempArr;
        } else {
          data = this.timeSheet;
        }
        if(this.endTime=="00:00"){
          data['Service_Start_Date'] = moment(data.EntryDate,'YYYY-MM-DD').format("YYYY-MM-DD");
          data['Service_End_Date'] = moment(this.displayEndDate,'DD-MMM-YYYY').format("YYYY-MM-DD");
        }
        let res:any=await this.localServiceSdr.ifTimeValid([data]);
          if(!res){
            this.localServiceSdr.checkTimeSheetOverlapData(data, (this.fromDebrief && this.editClarity)?false:true).then((res: any) => {
              if (!res.length) {
                 let tableName = (this.fromDebrief && this.editClarity) ? "Time":"Time_Temp" ;
                this.localServiceSdr.insertOrUpdateTimeSheetData([data], this.recordExists, tableName).then((response: any) => {
                  this.events.publish('savedMSTDataIntoDB', true);
    
                  if (this.weekEditPage) {
                    this.recordExists = true;
                    this.getWeekData();
                  }
                  if (this.debriefEdit)
                    this.cancelBtn();
                }).catch((error: any) => {
                  this.events.publish('savedMSTDataIntoDB', false);
                  this.utilityProvider.stopSpinner();
                  this.logger.log(this.fileName, 'saveMSTData', ' Error in saveMSTData : ' + JSON.stringify(error));
                });
              }
              else {
                this.promptAlert(res);
                this.events.publish('savedMSTDataIntoDB', false);
              }
            }).catch((error: any) => {
              this.events.publish('savedMSTDataIntoDB', false);
              this.utilityProvider.stopSpinner();
              this.logger.log(this.fileName, 'saveMSTData', ' Error in saveMSTData : ' + JSON.stringify(error));
            });
          }
          else{
            this.promptAlert(res);
            this.events.publish('savedMSTDataIntoDB', false);
          }
        // })
      }
    }
    catch (error) {
      this.events.publish('savedMSTDataIntoDB', false);
      this.logger.log(this.fileName, "saveMSTData ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }

  promptAlert(res) {
    let duplicateEntryDate = moment(res[0].EntryDate, 'YYYY-MM-DD').format('DD-MMM-YYYY');
    let duplicateEndDate = res[0].endDate ? moment(res[0].endDate, 'YYYY-MM-DD').format('DD-MMM-YYYY') : '';
    let duplicateStart_Time = res[0].Start_Time;
    let duplicateEnd_Time = res[0].End_Time;
    let Job_Number = res[0].Job_Number;
    let mszStr = 'Overlapping time entry exists (Job ID: ' + Job_Number + ' Date: ' + duplicateEntryDate + ' Start Time: ' + duplicateStart_Time + ' End Time: ' + duplicateEnd_Time + ')'
    if (duplicateEndDate) {
      mszStr = 'Overlapping time entry exists (Job ID: ' + Job_Number + ' Date between: ' + duplicateEntryDate + ' ' + duplicateStart_Time + ' to ' + duplicateEndDate + ' ' + duplicateEnd_Time + ')'
    }
    let alert = this.utilityProvider.promptAlert('', mszStr);
    alert.present();
  }
  /**
   *Pulkit (12-Aug-2019)
   * Use to perform required action ono bottom buttons click
   * @param {*} [isClear]
   * @memberof ClarityTimeEntryPage
   */
  saveBtnClick(isSaveClose?) {
    try {
      if (this.jobNumber) {
        this.clearFields(['Job_Number'], true);
      }
      else {
        this.clearFields(undefined, true);
      }
      this.insertFromTempToTime(isSaveClose);
      if (this.fromDebrief){
        this.setClarityProjectFromOSC();
        this.setValuesFromOSC();
      }
    }
    catch (error) {
      this.logger.log(this.fileName, "saveBtnClick ", " Error while generating query: " + JSON.stringify(error.message));
    }
  }

  /**
   *Pulkit (27-Aug-2019)
   *Use to calculate Reconcile Time
   * @memberof ClarityTimeEntryPage
   */
  getTimeFromMins(mins) {
    if (mins > 59) {
      let h = mins / 60 | 0,
        m = mins % 60 | 0;
      return (h < 9 ? ("0" + h) : h) + ":" + (m < 9 ? ("0" + m) : m)
    }
    else {
      if (mins < 0) {
        mins = mins * -1
        let h = mins / 60 | 0,
          m = mins % 60 | 0;
        return (h < 9 ? ("-0" + h) : h) + ":" + (m < 9 ? ("0" + m) : m)
      }
      else {
        return "00:" + (mins < 9 ? ("0" + mins) : mins)
      }
    }
  }

  /**
   *Pulkit (11-Aug-2019)
   *Use to unsubscribe events
   * @memberof ClarityTimeEntryPage
   */
  ngOnDestroy() {
    this.events.unsubscribe('saveToMST');
    this.events.unsubscribe('openAddEditModal');
    this.events.unsubscribe('getWeekTotalHours');
    this.events.unsubscribe('refreshEditPage');
  }
  /**
* Preeti Varshney 09/13/2019
* Interlinked condition with start time and end time.
*/
  getTimeOnChange(event, type) {

    this.zeroDuration = false;
    this.displayEndDate = moment(this.timeSheet.EntryDate, 'YYYY-MM-DD').format("DD-MMM-YYYY");

    if ((!this.startTime && !this.endTime) || (this.startTime == 'Invalid date' && this.endTime == 'Invalid date')) {
      //this.pickerStartTime = this.utilityProvider.getDateTimeDuration(this.currentEntryDate, 0, 0);
      //this.pickerEndTime = this.utilityProvider.getDateTimeDuration(this.currentEntryDate, 0, 0);
      this.duration =  '00:00';
      return;
    }

    if (event == null) {
      this.duration =  '00:00';
      return;
    }

    this[type] = moment(event).format('HH:mm');

    if(this.endTime == "00:00"){
      this.displayEndDate = moment(this.timeSheet.EntryDate, 'YYYY-MM-DD').add(1, 'day').format("DD-MMM-YYYY");
    }
    let startTimeVal : any;
    let endTimeVal: any ;
    switch (type) {
      case 'startTime':
        startTimeVal = this.utilityProvider.formatDateTime(moment(this.timeSheet.EntryDate, 'YYYY-MM-DD'), this.startTime);
        endTimeVal = this.utilityProvider.formatDateTime(moment(this.displayEndDate, 'DD-MMM-YYYY'), this.endTime);
        if (moment(startTimeVal).isSameOrAfter(endTimeVal) || !this.endTime || this.endTime == 'Invalid date') {
          this.endTime = this.utilityProvider.getDateFormatTime(moment(this.timeSheet.EntryDate, 'YYYY-MM-DD'), this.startTime);
        }
        else {
          this.duration = this.utilityProvider.getDuration(startTimeVal, endTimeVal);
        }
        break;
      case 'endTime':
        startTimeVal = this.utilityProvider.formatDateTime(moment(this.timeSheet.EntryDate, 'YYYY-MM-DD'), this.startTime);
        endTimeVal = this.utilityProvider.formatDateTime(moment(this.displayEndDate, 'DD-MMM-YYYY'), this.endTime);

        if (!this.startTime || this.startTime == 'Invalid date') {
          this.startTime = this.utilityProvider.getDateFormatTime(moment(this.displayEndDate, 'DD-MMM-YYYY'), this.endTime);
        }
        this.duration = this.utilityProvider.getDuration(startTimeVal, endTimeVal);
        break;
    }

    this.timeSheet['Start_Time'] = this.startTime;
    this.timeSheet['End_Time'] = this.endTime;
    this.timeSheet['Duration'] = this.duration;

  }
  /**
* Preeti Varshney 09/13/2019
* date format according to user preference
*/
  formatDate(selecteddate) {
    selecteddate = moment(selecteddate, "DD-MMM-YYYY").format(this.valueProvider.getUserPreferences()[0].Date_Format ? this.valueProvider.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
    return selecteddate
  }
  async getTimeDataAndInsertTempTime() {
    try {
      await this.localService.getTimeDataToTempTime(this.timeSheet['Job_Number'])
    }
    catch (e) {

    }
  }

  ionViewWillUnload() {
    this.localService.dropTempTime();
  }

  async dropTimeTempTable() {
    try {
      await this.localService.getTimeDataToTempTime(this.timeSheet['Job_Number'])
      this.getDurationOnDate(this.navParams.get('weekDayStart') ? this.navParams.get('weekDayStart') : moment().toDate());
      this.events.publish('user:created', "Time");
    }
    catch (e) {
      this.logger.log(this.fileName, "dropTimeTempTable", e.message);
    }
  }

  async setClarityProjectFromOSC() {
    try {
      this.disableProject = true;
      let result: any = await this.localService.getClarityProject(this.timeSheet.Job_Number);
      if (result.length > 0) {
        this.timeSheet.Clarity_Project = result[0].PROJECT;
        this.timeSheet.Clarity_Project_Id = result[0].OSC_ID;
        this.getFieldsByProject(this.timeSheet.Clarity_Project_Id);
      }
      else{
      this.disableProject = false;
      }
    } catch (e) {
      this.disableProject = false;
      this.logger.log(this.fileName, "setClarityProjectFromOSC", e.message);
    }
  }
  /**
    * Preeti Varshney 10/18/2019
    * Filter Item Lovs on the basis of selected Work Type
    */
  filterItemLovs(worktypeid, isForEdit?) {
    let key;
    if (!isForEdit) {
      this.timeSheet['Charge_Method'] = '';
      this.timeSheet['Charge_Method_Id'] = '';
    }
    switch (parseInt(worktypeid)) {
      case Enums.WorkType.Travel:
        key = "Travel";
        this.isBreakSelected = false;
        this.fieldLovs.Item = this.items.Item.filter(item => {
          return item.Type == key;
        });
        if (!isForEdit) {
          this.timeSheet.Charge_Method = this.travelMethodFromOSC;
        }
        break;
      case Enums.WorkType.Deputation:
      case Enums.WorkType.Labour:
      case Enums.WorkType.Normal:
      case Enums.WorkType.NightShift:
        key = "Others";
        this.isBreakSelected = false;
        this.fieldLovs.Item = this.items.Item.filter(item => {
          return item.Type == key;
        });
        if (!isForEdit) {
          this.timeSheet.Charge_Method = this.laborMethodFromOSC;
        }
        break;
      case Enums.WorkType.Break:
        this.isBreakSelected = true;
        this.clearBreakFields();
        this.timeSheet.Charge_Method = 'Non-Billable';
        this.timeSheet.Charge_Method_Id = Enums.chargeMethod.NonBillable;
        this.chargeMethodDisable = false;
        break;
    }
    if (!isForEdit) {
      if (this.fieldLovs['Charge_Method'].length) {
        var Charge_Method = this.fieldLovs['Charge_Method'].find(item => {
          return item.Value == this.timeSheet['Charge_Method'];
        });
        if (Charge_Method) {
          this.timeSheet['Charge_Method_Id'] = Charge_Method.ID;
        }
      }
    }
  }

  /**
   * Preeti Varshney 10/18/2019
   * Filter Item Lovs on the basis of selected Work Type
   * Set Charge Method, Charge Type, City, State, Country from OSC on the basis of Job ID
   */
  async setValuesFromOSC() {
    try {
      let result: any = await this.localService.getTaskByTaskNumber(this.timeSheet.Job_Number);
      if (result.length > 0) {
        let res = result[0];
        this.travelMethodFromOSC = res.Travel_Method ? res.Travel_Method : '';
        this.laborMethodFromOSC = res.Labor_Method ? res.Labor_Method : '';
        this.chargeTypeFromOSC = res.Charge_Type ? res.Charge_Type : '';
        if (!this.editClarity) {
          this.timeSheet.Charge_Type = this.chargeTypeFromOSC;
          this.timeSheet.City = res.City ? res.City : '';
          this.timeSheet.State = res.State ? res.State : '';
          this.timeSheet.Country_Code = res.Country ? res.Country : '';
          if (this.fieldLovs['Charge_Type'].length) {
            var Charge_Type = this.fieldLovs['Charge_Type'].find(item => {
              return item.Value == this.timeSheet['Charge_Type'];
            });
            if (Charge_Type) {
              this.timeSheet['Charge_Type_Id'] = Charge_Type.ID;
            }
          }

          this.filterItemLovs(this.timeSheet['Work_Type_Id']);
        }
      }
    } catch (e) {
      this.logger.log(this.fileName, "setValuesFromOSC", e.message);
    }
  }
  async filterState(countryCode) {
    try {
      let res = await this.localService.getStates(countryCode);
      this.fieldLovs['State'] = res;
    } catch (error) {
      this.logger.log(this.fileName, "filterState", " Error while generating query: " + JSON.stringify(error.message));
    }
  }

  compareCountry(countryid,fromDropDown?){
    let id;
    if(fromDropDown){
      id = countryid;
    }
    else{
      id= Object.keys(Enums.countryCode).find(key => Enums.countryCode[key] === countryid);
    }
    if(this.timeSheet.Country_Code == Enums.countryCode.CA || this.timeSheet.Country_Code == Enums.countryCode.US){
      this.stateDropdown = true;
      this.filterState(id);
     } else{
      this.stateDropdown = false;
     }
  }

  ionViewWillLeave() {
    this.events.publish("deleteFromDebrief");
  }

}
