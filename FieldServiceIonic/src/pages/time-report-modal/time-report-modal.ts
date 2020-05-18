import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, ViewController } from 'ionic-angular';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { UtilityProvider } from '../../providers/utility/utility';
import { LoggerProvider } from '../../providers/logger/logger';
import { ValueProvider } from '../../providers/value/value';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import * as moment from "moment";
import * as Enums from '../../enums/enums';
declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-time-report-modal',
  templateUrl: 'time-report-modal.html',
})
export class TimeReportModalPage {
  fileName: any = 'Time_Report_Modal';
  showSelects: boolean = true;
  enums: any;
  from_date: any;
  to_date: any;
  translate: any;
  dateWindow: any;
  minDate: Date = new Date(new Date().setDate(new Date().getDate() - 90));
  maxDate: any;
  start_date: any;
  end_date: any;
  header_data: any;


  @ViewChild('dp') dp1: BsDatepickerDirective;
  @ViewChild('dps') dp2: BsDatepickerDirective;
  datepickerConfig: Partial<BsDatepickerConfig>;

  constructor(
    public valueProvider: ValueProvider,
    public navCtrl: NavController, public events: Events, public navParams: NavParams, public viewCtrl: ViewController, public logger: LoggerProvider, public utilityProvider: UtilityProvider, public localService: LocalServiceProvider, ) {
    this.datepickerConfig = Object.assign({}, {
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false
    });
    this.enums = Enums;
    this.header_data = { title1: "", title2: "Field Service Admin", taskId: "" };
    this.from_date = new Date(moment(this.navParams.get('weekStart'), "DD-MMM-YYYY").format());
    this.to_date = new Date(moment(this.navParams.get('weekEnd'), "DD-MMM-YYYY").format());

  }

  ionViewDidEnter() {
    this.events.subscribe('langSelected', (res) => {
      setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
  }


  /**
     * @memberof Clarity - Time List
     * @default: Mr Rajat Gupta
     * @description: 
     * will export CVS from Time Page
     */
  async exportData() {
    let dateParam = {
      start_date: moment(this.from_date).format('YYYY-MM-DD'),
      end_date: moment(this.to_date).format('YYYY-MM-DD'),
      UserID: this.valueProvider.getUser().UserID
    }
    let start_date = moment(dateParam.start_date).format("YYYYMMDD");
    let end_date = moment(dateParam.end_date).format("YYYYMMDD");

    try {
      let allowanceEntriesForReport;
      let getTimeEntries;
      if (dateParam) getTimeEntries = await this.localService.getTimeEntriesForReport(dateParam);
      if (dateParam) allowanceEntriesForReport = await this.localService.getAllowanceEntriesForReport(dateParam);
      let fresharray = [];
      let cvsObject = {}
      this.utilityProvider.showSpinner();
      let filePath = cordova.file.dataDirectory;
      let keysToExport = [];

      for (let i = 0; i < getTimeEntries.length; i++) {
        fresharray.push(getTimeEntries[i])
      }

      for (let i = 0; i < allowanceEntriesForReport.length; i++) {
        fresharray.push(allowanceEntriesForReport[i])
      }

      fresharray.sort(function (a, b) {
        let dateA: any = new Date(b.EntryDate), dateB: any = new Date(a.EntryDate)
        return dateA - dateB //sort by date ascending
      });
      getTimeEntries = fresharray;
      for (let i = 0; i < fresharray.length; i++) {
        if (fresharray[i].Time_Id !== undefined) {
          cvsObject = {
            Name: getTimeEntries[i].TimeCustomerName,
            Email: getTimeEntries[i].TimeCustomerEmail,
            Job_Number: getTimeEntries[i].Job_Number,
            Job_Type: getTimeEntries[i].Job_Type,
            EntryDate: getTimeEntries[i].EntryDate,
            Start_Time: getTimeEntries[i].Start_Time,
            End_Time: getTimeEntries[i].End_Time,
            Duration: getTimeEntries[i].Duration,
            Comments: getTimeEntries[i].Comments ? (getTimeEntries[i].Comments).replace(/[\r\n]+/gm, " ") : null,
            Charge_Type: getTimeEntries[i].Charge_Type,
            Charge_Method: getTimeEntries[i].Charge_Method,
            Work_Type: getTimeEntries[i].Work_Type,
            Item: getTimeEntries[i].Item,
            Clarity_Project: getTimeEntries[i].Clarity_Project,
            Clarity_Task_Id: getTimeEntries[i].Clarity_Task_Id,
            Time_Code: getTimeEntries[i].Time_Code,
            Shift_Code: getTimeEntries[i].Shift_Code,
            Country_Code: getTimeEntries[i].t_Country_Code,
            State: getTimeEntries[i].t_state,
            City: getTimeEntries[i].t_city,
            SerialNumber: getTimeEntries[i].SerialNumber,
            TagNumber: getTimeEntries[i].TagNumber,
            Work_Type_OT: getTimeEntries[i].Work_Type_OT,
            CreatedDate: getTimeEntries[i].Date,
            ModifiedDate: getTimeEntries[i].ModifiedDate,
            Notes: getTimeEntries[i].Notes,
            BUSINESS_UNIT: getTimeEntries[i].Business_Unit,
            REQUEST_SUMMARY: getTimeEntries[i].Request_Summary,
            CUSTOMER_NAME: getTimeEntries[i].Customer_Name,
            FIELD_JOB_TYPE: getTimeEntries[i].Field_Job_Type,
            Overtime_HOURS: '',
            Overtime_MULTIPLIER: '',
            Meal_County: '',
            Meal_Site: '',
            Travel_HOURS: '',
            Travel_MULTIPLIER: '',
            SiteAllowance_ONSHORE_OFFSHORE: '',
            SiteAllowance_Country: '',
           // CREATEDDATE: '',
           // MODIFIEDDATE: ''


          }
        } else {
          cvsObject = {
            Name: getTimeEntries[i].TimeCustomerName,
            Email: getTimeEntries[i].TimeCustomerEmail,
            Job_Number: getTimeEntries[i].Job_Number,
            Job_Type: getTimeEntries[i].Job_Type,
            EntryDate: getTimeEntries[i].EntryDate,
            Start_Time: getTimeEntries[i].Start_Time,
            End_Time: getTimeEntries[i].End_Time,
            Duration: getTimeEntries[i].Duration,
            Comments: getTimeEntries[i].Comments ? (getTimeEntries[i].Comments).replace(/[\r\n]+/gm, " ") : null,
            Charge_Type: getTimeEntries[i].Charge_Type,
            Charge_Method: getTimeEntries[i].Charge_Method,
            Work_Type: getTimeEntries[i].Work_Type,
            Item: getTimeEntries[i].Item,
            Clarity_Project: getTimeEntries[i].Clarity_Project,
            Clarity_Task_Id: getTimeEntries[i].Clarity_Task_Id,
            Time_Code: getTimeEntries[i].Time_Code,
            Shift_Code: getTimeEntries[i].Shift_Code,
            Country_Code: getTimeEntries[i].t_Country_Code,
            State: getTimeEntries[i].t_state,
            City: getTimeEntries[i].t_city,
            SerialNumber: getTimeEntries[i].SerialNumber,
            TagNumber: getTimeEntries[i].TagNumber,
            Work_Type_OT: getTimeEntries[i].Work_Type_OT,
            CreatedDate: getTimeEntries[i].Date,
            ModifiedDate: getTimeEntries[i].ModifiedDate,
            Notes: getTimeEntries[i].Notes,
            BUSINESS_UNIT: "",
            REQUEST_SUMMARY: "",
            CUSTOMER_NAME: "",
            FIELD_JOB_TYPE: "",
            Overtime_HOURS: getTimeEntries[i].Overtime_HOURS,
            Overtime_MULTIPLIER: getTimeEntries[i].Overtime_MULTIPLIER,
            Meal_County: getTimeEntries[i].Meal_County,
            Meal_Site: getTimeEntries[i].Meal_Site,
            Travel_HOURS: getTimeEntries[i].Travel_HOURS,
            Travel_MULTIPLIER: getTimeEntries[i].Travel_MULTIPLIER,
            SiteAllowance_ONSHORE_OFFSHORE: getTimeEntries[i].SiteAllowance_ONSHORE_OFFSHORE,
            SiteAllowance_Country: getTimeEntries[i].SiteAllowance_Country,
          //  CREATEDDATE: moment(getTimeEntries[i].SITE_CREATEDDATE).format('YYYY-MM-DD'),
         //   MODIFIEDDATE:moment(getTimeEntries[i].SITE_MODIFIEDDATE).format('YYYY-MM-DD'), 

          }
        }
        keysToExport.push(cvsObject);
      }
      if (keysToExport.length > 0) {
        this.utilityProvider.createCSV(keysToExport).then((blob: any) => {
          this.utilityProvider.saveTimeExportEntries(blob, "TR_" + start_date + "_" + end_date + "_" + this.valueProvider.getUser().UserID + '.csv').then(() => {
            this.utilityProvider.openFile(filePath + '/temp/' + "TR_" + start_date + "_" + end_date + "_" + this.valueProvider.getUser().UserID + '.csv', 'text/csv', null);
            this.utilityProvider.stopSpinner();
            this.utilityProvider.presentToast('CSV Data Exported Successfully ', 4000, 'middle', 'feedbackToast');
          }).catch((error: any) => {
            this.utilityProvider.stopSpinner();
            this.logger.log(this.fileName, 'exportData', 'Error in exportData, saveTimeExportEntries utility provider : ' + JSON.stringify(error));
          });
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'exportData', 'Error in exportData, createCSV utility provider : ' + JSON.stringify(error));
        });
      } else {
        this.utilityProvider.stopSpinner();
        this.utilityProvider.presentToast('You do not have Time Entries', 3000, 'middle', 'feedbackToast');
      }
    } catch (error) {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'exportData', 'createCSV utility provider : ' + JSON.stringify(error));
    }
  }

  /**
  * check start date if start date is larger than end date, set date accordingly
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  checkDateWindow() {
    this.to_date = moment(this.from_date).isAfter(this.to_date) ? new Date(moment(this.from_date).add(1, 'day').format('YYYY-MM-DD')) : this.to_date;
  }



  onShowPicker(event) {
    event.dayHoverHandler = this.utilityProvider.singleClickDaySelector(event, this.dp1, this.dp2);
  }


  closeModal() {
    this.viewCtrl.dismiss();
  }

}
