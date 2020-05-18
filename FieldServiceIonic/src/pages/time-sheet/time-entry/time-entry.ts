import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import * as moment from "moment";
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../providers/logger/logger';
import { ValueProvider } from '../../../providers/value/value';
import { UtilityProvider } from '../../../providers/utility/utility';


@IonicPage()
@Component({
  selector: 'page-time-entry',
  templateUrl: 'time-entry.html',
})
export class TimeEntryPage implements OnInit {
  fileName: any = 'Time_Entry_Page';
  header_data: any;
  dayList: any = [];
  weekStart: any;
  weekEnd: any;
  projects: any = [];
  tasks: any = [];
  otcodes: any = [];
  shiftcodes: any = [];
  countries: any = [];
  chargetypes: any = [];
  worktypes: any = [];
  filtered: any;
  public newObject: any = [];
  project;
  task_id;
  otCode_id;
  shiftCode_id;
  workType_id;
  chargeType_id;
  country;
  state;
  city;
  jobname;
  otShiftCode;
  shiftCode;
  workType;
  chargeType;
  date;
  duration;
  endTime;
  notes;
  startTime;
  countryName;
  taskId;
  OutData: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public appCtrl: App, public events: Events, public localService: LocalServiceProvider, public logger: LoggerProvider, public valueProvider: ValueProvider, public utilityProvider: UtilityProvider) {
    this.weekStart = this.navParams.get('weekStart');
    this.weekEnd = this.navParams.get('weekEnd');
    this.taskId = this.navParams.get('taskId');
    this.dayList = this.utilityProvider.dayListData(this.weekStart);
    this.valueProvider.TotalHours = 0;
    if (this.taskId != undefined || this.taskId != null) {
      this.header_data = { title1: "Debrief", title2: "Job #", taskId: this.taskId };
    }
    else {
      this.header_data = { title1: "", title2: "Timesheet Clarity", taskId: "" };
    }
  }

  ionViewDidLoad() {
    
    this.getProjects();
   // console.log('ionViewDidLoad TimeEntryPage');
  }
  ngOnInit() {

  }
  
  /**
   * Preeti Varshney 03/12/2019
   * data received from the expandable component as output
   */
  recievedData(data) {
   // console.log("WEEKDATA", JSON.stringify(data));
    this.OutData = data;
  }
  /**
     * Preeti Varshney 03/12/2019
     * assigning data to an object for inserting into database table 
  */
  addObject() {
    for (let i = 0; i < this.OutData.length; i++) {
      this.newObject[i] = {
        Clarity_Task_Id: this.task_id,
        Field_Job_Name: this.jobname,
        Time_Code_Id: this.otCode_id,
        Time_Code: this.otShiftCode,
        Time_Code_Value: this.otShiftCode,
        Shift_Code_Id: this.shiftCode_id,
        Shift_Code: this.shiftCode,
        Shift_Code_Value: this.shiftCode,
        Work_Type_Id: this.workType_id,
        Work_Type: this.workType,
        Charge_Type_Id: this.chargeType_id,
        Charge_Type: this.chargeType,
        Country_Code: this.country,
        State: this.state,
        City: this.city,
        Duration: this.OutData[i].duration,
        Comments: this.OutData[i].notes,
        Start_Time: this.OutData[i].startTime,
        End_Time: this.OutData[i].endTime,
        Total_Hours: this.OutData.totalHours,
        EntryDate: moment(this.OutData[i].date, 'DD-MMM-YYYY').format("DD-MMM-YYYY"),
        Date: this.OutData[i].date,
        Service_Start_Date: this.OutData[i].date,
        Service_End_Date: this.OutData[i].date,
        /* Preeti Varshney 03/13/2019 -- Task number if time entry is entered through the debrief job*/
        Task_Number: this.taskId ? this.taskId : "",
      };
    }

   // console.log("new Object", this.newObject);
    this.saveTime();
  }
  /**
   * Preeti Varshney 03/12/2019
   * save data in the time table
   */
  saveTime() {
    for (let i = 0; i < this.OutData.length; i++) {
      this.localService.insertTimeBatch(this.newObject[i]).then((res): any => {
        this.newObject['Time_Id'] = res;
      //  console.log("save successfully", res);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'saveTime', JSON.stringify(error));
      });
    }
    this.appCtrl.getRootNav().setRoot("ClarityTimelistPage");
  }


  cancel() {
    this.appCtrl.getRootNav().setRoot("ClarityTimelistPage");
  }
  /**
   * Prateek 03/14/2019
   * Optimized code by applying promises to get LOV(getchargeType,getworkType,getcountryType) from database
   */
  getProjects() {

    return new Promise((resolve, reject) => {
      this.utilityProvider.showSpinner();
      let promiseArray = [];
      this.localService.getProjects(this.valueProvider.getUser().ClarityID).then((projects: any[]) => {
        if (projects) {
          this.projects = projects;
          promiseArray.push(this.localService.getMSTData('ChargeType',undefined,'Value'));
          promiseArray.push(this.localService.getMSTData('WorkType',undefined,'Value'));
          promiseArray.push(this.localService.getMSTData('Country',undefined,'Country_Name'));
          resolve(true)
         
        }
        Promise.all(promiseArray).then((response) => {
          this.chargetypes = response[0];
          this.worktypes = response[1];
          this.countries = response[2];
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
        this.logger.log(this.fileName, 'getProjects', 'Error in getProjects : ' + JSON.stringify(error));
      });
    })
  }
  /**
   * Prateek 03/14/2019
   *  Optimized code to get task, otcode, shiftcode of a selected project.
   */
  getList(project) {
    return new Promise((resolve, reject) => {
      this.tasks = [];
      this.otcodes = [];
      this.OutData.shiftCode = [];
      let promiseArray = [];//todo empty task list and all lov
      this.localService.getMSTData('MST_TaskName',project,'TASK_NAME').then((response: any[]) => {
        if (response) {
          this.tasks = response;
          promiseArray.push(this.localService.getClarityOvertimeCode(project));
          promiseArray.push(this.localService.getClarityShiftCode(project));
          Promise.all(promiseArray).then((response) => {
            this.otcodes = response[0];
            this.shiftcodes = response[1];
            resolve(true);
          }).catch((error) => {
            this.logger.log(this.fileName, 'setTask', 'Error in setTask : ' + JSON.stringify(error));
            //this.handleError(this.fileName, "submitReportAttachments", "Error in promise : " + JSON.stringify(error));
            reject(error);
          });
        }
      }).catch((error: any) => {//todo name chan and error handling
        this.logger.log(this.fileName, 'setTask', 'Error in setTask : ' + JSON.stringify(error));
      });

    })
  }
  /**
   *Prateek 03/14/2019
   *optimised code to select entries.
   */
  selectData(type, value) {
    switch (type) {
      case 'task':
        this.filtered = this.tasks.filter(item => {
          return item.ID == value;
        })[0];
        if (this.filtered != undefined) {
          this.jobname = this.filtered.JobName;
        }
        break;
      case 'otcode':
        this.filtered = this.otcodes.filter(item => {
          return item.ID == value;
        })[0];
        if (this.filtered != undefined) {
          this.otShiftCode = this.filtered.OVERTIMESHIFTCODE;
        }
        break;
      case 'shiftcode':
        this.filtered = this.shiftcodes.filter(item => {
          return item.ID == value;
        })[0];
        if (this.filtered != undefined) {
          this.shiftCode = this.filtered.SHIFTCODE;
        }
        break;
      case 'worktype':
        this.filtered = this.worktypes.filter(item => {
          return item.ID == value;
        })[0];
        if (this.filtered != undefined) {
          this.workType = this.filtered.Value;
        }
        break;
      case 'chargetype':
        this.filtered = this.chargetypes.filter(item => {
          return item.ID == value;
        })[0];
        if (this.filtered != undefined) {
          this.chargeType = this.filtered.Value;
        }
        break;
      case 'country':
        this.filtered = this.countries.filter(item => {
          return item.Country_Code == value;
        })[0];
        if (this.filtered != undefined) {
          this.countryName = this.filtered.Country_Name;
        }
        break;
      default:
        break;
    }
  }


  // /**
  //  * Preeti Varshney 03/12/2019
  //  * get JobName using id
  //  */
  // selectJobName(value) {
  //   let filtered = this.tasks.filter(item => {
  //     return item.ID == value;
  //   })[0];
  //   if (filtered != undefined) {
  //     this.jobname = filtered.JobName;
  //   }
  // }
  // /**
  //  * Preeti Varshney 03/12/2019
  //  * get OVERTIMESHIFTCODE using id
  //  */
  // selectOtShiftCode(value) {
  //   let filtered = this.otcodes.filter(item => {
  //     return item.ID == value;
  //   })[0];
  //   if (filtered != undefined) {
  //     this.otShiftCode = filtered.OVERTIMESHIFTCODE;
  //   }
  // }
  // /**
  //  * Preeti Varshney 03/12/2019
  //  * get SHIFTCODE using id
  //  */
  // selectShiftCode(value) {
  //   let filtered = this.shiftcodes.filter(item => {
  //     return item.ID == value;
  //   })[0];
  //   if (filtered != undefined) {
  //     this.shiftCode = filtered.SHIFTCODE;
  //   }
  // }
  // /**
  //  * Preeti Varshney 03/12/2019
  //  * get workType using id
  //  */
  // selectWorkType(value) {
  //   let filtered = this.worktypes.filter(item => {
  //     return item.ID == value;
  //   })[0];
  //   if (filtered != undefined) {
  //     this.workType = filtered.Value;
  //   }
  // }
  // /**
  // * Preeti Varshney 03/12/2019
  // * get chargeType using id
  // */
  // selectChageType(value) {
  //   let filtered = this.chargetypes.filter(item => {
  //     return item.ID == value;
  //   })[0];
  //   if (filtered != undefined) {
  //     this.chargeType = filtered.Value;
  //   }
  // }
  // /**
  //  * Preeti Varshney 03/12/2019
  //  * get countryName using Country_Code
  //  */
  // selectCountry(value) {
  //   let filtered = this.countries.filter(item => {
  //     return item.Country_Code == value;
  //   })[0];
  //   if (filtered != undefined) {
  //     this.countryName = filtered.Country_Name;
  //   }
  // }
}
