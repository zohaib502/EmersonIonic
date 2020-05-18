import { Component, Renderer, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilityProvider } from '../../providers/utility/utility';
import { PopoverController, Events, NavParams } from 'ionic-angular';
import { LoggerProvider } from '../../providers/logger/logger';
import * as moment from "moment";
import { ValueProvider } from '../../providers/value/value';
import * as Enums from '../../enums/enums';

@Component({
  selector: 'expandable',
  templateUrl: 'expandable.html'
})
export class ExpandableComponent implements OnInit {
  fileName: any = "ExpandableComponent";
  text: string;
  enums:any={}
  @Input('data') Data: any;
  @Input('listPage') listPage: boolean;
  @Input('nonclaritylistPage') nonclaritylistPage: boolean;
  @Input('weekEditPage') weekEditPage: boolean;
  @Input('selectedDate') selectedDate: String;
  @Input('isTimeEntry') isTimeEntry: any;
  @Input('noclistPage') noclistPage: any;
  @Output() OutData = new EventEmitter();
  public days: any = [];
  timeSheetData: any = {}
  project: any = [];
  total_hours: any;
  constructor(public renderer: Renderer, public events: Events, public navParams: NavParams, public utilityProvider: UtilityProvider, public popoverCtrl: PopoverController, public logger: LoggerProvider, public valueProvider: ValueProvider) {
    this.enums = Enums;
    this.events.subscribe('updateExpandable', (obj) => {
      this.days = obj.days;
        this.clearDaysList();
        this.Listdays();
      });
    this.events.subscribe('getNewTimeEntryData', (obj) => {
      this.timeSheetData['Job_Number'] = obj['Job_Number']
      this.timeSheetData['Clarity_Project'] = obj['Clarity_Project'];
      this.timeSheetData['Clarity_Project_Id'] = obj['Clarity_Project_Id'];
      this.timeSheetData['Time_Code'] = obj['Time_Code'];
      this.timeSheetData['Time_Code_Id'] = obj['Time_Code_Id'];
      this.timeSheetData['Charge_Type'] = obj['Charge_Type'];
      this.timeSheetData['Charge_Type_Id'] = obj['Charge_Type_Id'];
      this.timeSheetData['Work_Type'] = obj['Work_Type'];
      this.timeSheetData['Work_Type_Id'] = obj['Work_Type_Id'];
      this.timeSheetData['Work_Type_OT'] = obj['Work_Type_OT'];
      this.timeSheetData['Item'] = obj['Item'];
      this.timeSheetData['Item_Id'] = obj['Item_Id'];
      this.timeSheetData['Shift_Code'] = obj['Shift_Code'];
      this.timeSheetData['Shift_Code_Id'] = obj['Shift_Code_Id'];
      this.timeSheetData['Charge_Method'] = obj['Charge_Method'];
      this.timeSheetData['Charge_Method_Id'] = obj['Charge_Method_Id'];
      this.timeSheetData['Field_Job_Name'] = obj['Field_Job_Name'];
      this.timeSheetData['Field_Job_Name_Id'] = obj['Field_Job_Name_Id'];
      this.timeSheetData['Country_Code'] = obj['Country_Code'];
      this.timeSheetData['City'] = obj['City'];
      this.timeSheetData['State'] = obj['State'];
      this.timeSheetData['newActivityType'] = obj['newActivityType'];
      this.timeSheetData['weekEditPage'] = obj['weekEditPage'];
    });
    this.events.subscribe('getOscNonClarityData', (obj) => {
      this.timeSheetData = obj;
    })
    this.events.subscribe('dayDuration', (obj) => {
      if(this.isTimeEntry){
        this.days[obj.dayid - 1].duration = obj.totalHours;
      }
        this.Listdays();
    });
    this.events.subscribe('setDayDuration', (obj) => {
      this.clearDaysList();
      obj.forEach(element => {
      this.setTotalHoursInView(element);
      });
      this.Listdays();
    });
    this.events.subscribe('refreshTotalHours', (obj) => {
      this.Listdays();
    })
  }
  ngOnInit() {
    this.project = this.Data;
    this.days = this.Data.days;
    this.Listdays();
  }
  ionViewWillLeave() {
    this.events.unsubscribe('updateExpandable');
    this.events.unsubscribe('getNewTimeEntryData');
    this.events.unsubscribe('dayDuration');
    this.events.unsubscribe('setDayDuration');
    this.events.unsubscribe('getOscNonClarityData');
    this.events.unsubscribe('refreshTotalHours');
  }
  clearDaysList() {
    if (this.days.length) {
      for (let i = 0; i < this.days.length; i++) {
        this.days[i].duration = '';
        this.days[i].isSubmitted = 'false';
        this.days[i].Import_Level = 1;
      }
    }
  }

  setTotalHoursInView(dayDataVal) {
    this.days.forEach((element, i) => {
      if (moment(element.entryDate).format('DD-MMM-YYYY') == moment(dayDataVal.EntryDate).format('DD-MMM-YYYY')) {
        this.days[i].duration = dayDataVal.Duration=='00:00'?'24:00':dayDataVal.Duration;
        this.days[i].isSubmitted = dayDataVal.isSubmitted;
        this.days[i].Import_Level = dayDataVal.Import_Level;
      }
    });
  }

  Listdays() {
    this.utilityProvider.cloneDuration = '';
    if (this.days.length) {
      for (let i = 0; i < this.days.length; i++) {
        this.total_hours = this.utilityProvider.totalHours(this.days[i].duration);
      }
    }
    if (this.total_hours != '00:00') {
      this.events.publish("getWeekTotalHours", true);
    }
    else {
      this.events.publish("getWeekTotalHours", false);
    }
  }


  /**
    * Preeti Varshney 03/12/2019
    * open popover page on clicking of squares in the day list
    * includes start time, end time, duration and notes
    */
  openTimeDurationPopOver(day, myEvent?) {
    this.utilityProvider.closeFab();
    try {
      if (this.valueProvider.getUser().ClarityID != '') {
        this.events.publish("openAddEditModal");
        day['Job_Number'] = this.timeSheetData['Job_Number'];
        day['Clarity_Project'] = this.timeSheetData['Clarity_Project'];
        day['Clarity_Project_Id'] = this.timeSheetData['Clarity_Project_Id'];
        day['Time_Code'] = this.timeSheetData['Time_Code'];
        day['Time_Code_Id'] = this.timeSheetData['Time_Code_Id'];
        day['Charge_Type'] = this.timeSheetData['Charge_Type'];
        day['Charge_Type_Id'] = this.timeSheetData['Charge_Type_Id'];
        day['Work_Type'] = this.timeSheetData['Work_Type'];
        day['Work_Type_Id'] = this.timeSheetData['Work_Type_Id'];
        day['Work_Type_OT'] = this.timeSheetData['Work_Type_OT'];
        day['Item'] = this.timeSheetData['Item'];
        day['Item_Id'] = this.timeSheetData['Item_Id'];
        day['Shift_Code'] = this.timeSheetData['Shift_Code'];
        day['Shift_Code_Id'] = this.timeSheetData['Shift_Code_Id'];
        day['Charge_Method'] = this.timeSheetData['Charge_Method'];
        day['Charge_Method_Id'] = this.timeSheetData['Charge_Method_Id'];
        day['Field_Job_Name'] = this.timeSheetData['Field_Job_Name'];
        day['Field_Job_Name_Id'] = this.timeSheetData['Field_Job_Name_Id'];
        day['Country_Code'] = this.timeSheetData['Country_Code'];
        day['City'] = this.timeSheetData['City'];
        day['State'] = this.timeSheetData['State'];
        day['newActivityType'] = this.timeSheetData['newActivityType'];
        day['weekEditPage'] = this.timeSheetData['weekEditPage'];

        // day['Time_Id'] = this.timeSheetData['Time_Id'];

        setTimeout(() => {
          let addEditTimeModal = this.utilityProvider.showModal("TimesheetAddEditModalPage", { day, project: this.project, listPage: this.listPage,weekEditPage:day['weekEditPage'] }, { enableBackdropDismiss: true, cssClass: 'FeedbackDetailModalPage' });
          addEditTimeModal.onDidDismiss(data => {
            this.events.publish("refreshListPage");
          });
          addEditTimeModal.present();
        });
      }
      else {
        this.events.publish("openAddEditModal");
        if(!this.valueProvider.isOSCUser() && this.valueProvider.getUser().ClarityID == ''){
          day['Job_Number'] = this.timeSheetData['Job_Number'];
          // day['Clarity_Project'] = this.timeSheetData['Clarity_Project'];
           day['Time_Code'] = this.timeSheetData['Time_Code'];
           day['Work_Type'] = this.timeSheetData['Work_Type'];
           day['Shift_Code'] = this.timeSheetData['Shift_Code'];
           day['Charge_Method'] = this.timeSheetData['Charge_Method'];
           day['Field_Job_Name'] = this.timeSheetData['Field_Job_Name'];
           day['Work_Type_OT'] = this.timeSheetData['Work_Type_OT'];

           setTimeout(() => {
            let params = { userPopOver: true, project: this.project, day: day, listPage: this.listPage };
            let userPopOver = this.popoverCtrl.create('PopoverTimePage', params, { enableBackdropDismiss: true, cssClass: 'TimePopOver' });
            userPopOver.present({
              ev: myEvent
            });
            userPopOver.onDidDismiss(data => {
              this.events.publish("refreshListPage");
            });
            // let addEditTimeModal = this.utilityProvider.showModal("PopoverTimePage", { day, project: this.project, nonclaritylistPage: this.listPage }, { enableBackdropDismiss: true, cssClass: 'FeedbackDetailModalPage' });
            // addEditTimeModal.onDidDismiss(data => {
            //  this.events.publish("refreshListPage");
            // });
            // addEditTimeModal.present();
          });
        } else {
          let keys;
          if (this.noclistPage) {
            keys = Object.keys(this.project);
            if(!this.project.Charge_Method) this.project.Charge_Method = '';
            keys.forEach((key) => {
              if(key != 'isSubmitted'){
                day[key] = this.project[key];
              }
            })
          } else {

            keys = Object.keys(this.timeSheetData);
            keys.forEach((key) => {
              if(key != 'isSubmitted'){
                day[key] = this.timeSheetData[key];
              }
            })
          }
          setTimeout(() => {
            let addEditTimeModal = this.utilityProvider.showModal("TimesheetAddEditModalPage", { day, project: this.project, nonclaritylistPage: this.listPage, weekEditPage: this.weekEditPage }, { enableBackdropDismiss: true, cssClass: 'FeedbackDetailModalPage' });
            addEditTimeModal.onDidDismiss(data => {
              if(!this.weekEditPage){
                this.events.publish("refreshListPage");
              }
            });
            addEditTimeModal.present();
          });

        }


      }

    } catch (error) {
      this.logger.log(this.fileName, 'openTimeDurationPopOver', ' Error in popoverCtrl : ' + JSON.stringify(error));
    }
  }

  /**
   * Preeti Varshney 03/12/2019
   * format the date for dispalying in DD-MMM format
   */
  getFomatedDate(date, selectedDate?) {
    var _date = moment(date).format('DD-MMM');
    if(selectedDate){
      _date = moment(date).format('DD-MMM-YYYY');
      return (_date == selectedDate);
    } else{
      return _date;
    }
  }

}
