import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App, AlertController } from 'ionic-angular';
import * as moment from "moment";
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap';
import { UtilityProvider } from '../../providers/utility/utility';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { LocalServiceSdrProvider } from '../../providers/local-service-sdr/local-service-sdr';
import { SubmitProvider } from '../../providers/sync/submit/submit';
import { ValueProvider } from '../../providers/value/value';
import { LoggerProvider } from '../../providers/logger/logger';
import { TranslateService } from '@ngx-translate/core';
import * as Enums from '../../enums/enums';
import { SyncProvider } from '../../providers/sync/sync';

/**
 * Generated class for the SiteAllowancesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-site-allowances',
  templateUrl: 'site-allowances.html',
})
export class SiteAllowancesPage {
  fileName: any = 'Site-Allowances';
  headerData: any;
  weekStart: any;
  weekEnd: any;
  Moment: any = moment;
  datepickerConfig: Partial<BsDatepickerConfig>;
  minDate: Date = new Date(new Date().setDate(new Date().getDate() - 90));
  maxDate: Date = new Date();
  @ViewChild('dps') dps: BsDatepickerDirective;
  allowanceList: any = [];
  overtimeExpanded: boolean = false;
  travelExpanded: boolean = false;
  siteAllowanceExpanded: boolean = false;
  mealExpanded: boolean = false;
  summHoursExpanded: boolean = false;
  siteAllowanceEntries = [];
  siteAllowenceHours = [];
  SiteAllowanceObj: any = {};
  days: any = [];
  multiplierLovs: any = [];
  siteLovs: any = [];
  country: any = [];
  OSCNonClarityUser: boolean = false;
  OSCClarityUser: boolean = false;
  NonOSCNonClarityUser: boolean = false;
  enums: any = Enums;
  calendarSelectedDay: any;
  siteAllowanceData: any = [];
  errorObj: any = [];
  allowanceListLength: any;
  calendarType: any;
  msg: string = "";
  enableDisableDate: boolean = true;
  futureWeek: boolean = true;
  toggleAllaccordion: boolean = false;
  noRecordFound: boolean = false;
  isDisableDay0: boolean = false;
  isDisableDay1: boolean = false;
  isDisableDay2: boolean = false;
  isDisableDay3: boolean = false;
  isDisableDay4: boolean = false;
  isDisableDay5: boolean = false;
  isDisableDay6: boolean = false;

  constructor(public logger: LoggerProvider, public valueProvider: ValueProvider, public localService: LocalServiceProvider, public navCtrl: NavController, public navParams: NavParams, public utilityProvider: UtilityProvider, public appCtrl: App, public modalController: ModalController, public localServiceSdr: LocalServiceSdrProvider, public submitProvider: SubmitProvider, public alertCtrl: AlertController, public translate: TranslateService, public syncProvider: SyncProvider) {
    this.OSCClarityUser = this.valueProvider.isOSCClarityUser();
    this.OSCNonClarityUser = this.valueProvider.isOSCNonClarityUser();
    this.NonOSCNonClarityUser = this.valueProvider.isNonOSCNonClarityUser();
    this.headerData = { title1: "", title2: "Allowances", taskId: '' };
    this.calendarType = this.navParams.get("calendarType");
    this.datepickerConfig = Object.assign({}, {
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false,
      minDate: this.minDate,
      maxDate: this.maxDate
    });
  }

  ionViewDidEnter() {
    this.loadData();
  }

  async loadData() {
    this.SiteAllowanceObj = {};
    let selectedDayNumber = this.valueProvider.getUserPreferences()[0].STARTDAYOFWEEK ? this.getWeekDay(this.valueProvider.getUserPreferences()[0].STARTDAYOFWEEK) : 1;
    moment.updateLocale('en', {
      week: { dow: selectedDayNumber, doy: 7 + selectedDayNumber - 1 }
    });

    // 01-02-2020 -- Mayur Varshney -- load from_date and to_date from the async function on the basis of calendartype
    let dateObject: any = this.setCalendarDate(this.calendarType);
    this.weekStart = moment(dateObject.from_date).format('DD-MMM-YYYY');
    this.weekEnd = moment(dateObject.to_date).format('DD-MMM-YYYY');
    this.calendarSelectedDay = moment(this.weekStart, "DD-MMM-YYYY").toDate();
    this.allowanceList = this.utilityProvider.getAllowances();
    this.loadSummarizedData(moment(dateObject.from_date).format('YYYY-MM-DD'), moment(dateObject.to_date).format('YYYY-MM-DD'));
    this.days = this.utilityProvider.dateGrid(moment(dateObject.from_date).format('YYYY-MM-DD'));
    await this.getLovs();
    this.SiteAllowanceObj = await this.getSiteAllowanceData();
    this.checkforFutureWeek();
    // 01-09-2020 -- Mayur Varshney -- disable future date fields to restrict user for entering allowance of future date
    this.disableFutureInputGrid();
  }


  /**
   * 01-02-2020 -- Mayur Varshney
   * set from_date and end_date on the basis of calendar type
   * For calendartype = 'currentweek' set from_date and to_date as per the current week
   * For calendartype = 'selectedweek' set from_date and to_date as per the params sent from the day-week-view page
   * return json object contains from_date and to_date
   * @param {any} calendarType 
   * @returns 
   * 
   * @memberOf SiteAllowancesPage
   */
  setCalendarDate(calendarType) {
    let from_date;
    let to_date;
    if (calendarType == 'currentWeek') {
      let now = moment();
      let fornow = moment();
      from_date = now.startOf('week');
      to_date = fornow.endOf('week');
    } else {
      /**
      * 01-06-2020 -- Gaurav Vachhani
      * Fetching start and end day of week using weekstart param.
      * */
      from_date = moment(this.navParams.get("weekStart"), "DD-MMM-YYYY");
      from_date = from_date.startOf('week');
      to_date = moment(this.navParams.get("weekStart"), "DD-MMM-YYYY");
      to_date = to_date.endOf('week');
    }
    return {
      from_date: from_date,
      to_date: to_date
    }
  }

  /**
    * Preeti Varshney 12/20/2019
    * expand the project to show the details of project
   */
  setWeekDay(event) {
    let start_date = moment(this.weekStart, 'DD-MMM-YYYY');
    let end_date = moment(this.weekEnd, 'DD-MMM-YYYY');
    switch (event) {
      case 'setWeekStart':
        this.weekStart = start_date.subtract(7, 'days').format('DD-MMM-YYYY');
        this.weekEnd = end_date.subtract(7, 'days').format('DD-MMM-YYYY');
        break;
      case 'setWeekEnd':
        this.weekStart = start_date.add(7, 'days').format('DD-MMM-YYYY');
        this.weekEnd = end_date.add(7, 'days').format('DD-MMM-YYYY');
        break;
    }
    this.calendarSelectedDay = start_date.toDate();
    this.getDurationOnDate();
    this.days = this.utilityProvider.dateGrid(start_date.format('YYYY-MM-DD'));
    this.loadSummarizedData(start_date.format('YYYY-MM-DD'), end_date.format('YYYY-MM-DD'));
    this.checkforFutureWeek();
    // 01-09-2020 -- Mayur Varshney -- disable future date fields to restrict user for entering allowance of future date
    this.disableFutureInputGrid();
  }

  /**
   * Preeti Varshney 12/23/2019
   * expand the project to show the details of project
  */
  expandItem(item) {
    if (item == 'Overtime') {
      if (this.overtimeExpanded == true) {
        this.overtimeExpanded = false;
      }
      else {
        this.overtimeExpanded = true;
      }
    }
    if (item == 'Travel') {
      if (this.travelExpanded == true) {
        this.travelExpanded = false;
      }
      else {
        this.travelExpanded = true;
      }
    }
    if (item == 'Site Allowance') {
      if (this.siteAllowanceExpanded == true) {
        this.siteAllowanceExpanded = false;
      }
      else {
        this.siteAllowanceExpanded = true;
      }
    }
    if (item == 'Meal') {
      if (this.mealExpanded == true) {
        this.mealExpanded = false;
      }
      else {
        this.mealExpanded = true;
      }
    }
    if (item == 'summarisedHours') {
      if (this.summHoursExpanded == true) {
        this.summHoursExpanded = false;
      }
      else {
        this.summHoursExpanded = true;
      }
    }
    if (this.overtimeExpanded && this.travelExpanded && this.siteAllowanceExpanded && this.mealExpanded && this.summHoursExpanded) {
      this.toggleAllaccordion = true;
    }
    else {
      this.toggleAllaccordion = false;
    }
  }

  /**
    * Rajat Gupta 12/23/2019
    * 
   */
  async loadSummarizedData(start_date, end_date) {
    this.siteAllowenceHours = [];
    this.siteAllowanceEntries = [];
    try {
      let dataParam = {
        start_date: start_date,
        end_date: end_date,
        ClarityStatus: this.valueProvider.getUser().ClarityID
      }
      let siteAllowancesData = await this.localService.getSummarizedData(dataParam);
      let getMaxCountData: any = await this.localService.getMaxCountData(dataParam);
      let getTotalHourSummarizedData = await this.localService.getTotalHourSummarizedData(dataParam);
      let AllowancesData;
      let currentdate;
      let rows = [];
      let totalhours = [];
      if (!moment((this.weekStart), 'DD-MMM-YYYY').isSame(moment((start_date)))) {
        return;
      }
      for (var i = 0; i < getMaxCountData[0].max_count; i++) {
        let section = [];
        currentdate = start_date;
        rows.push({ section });
        for (var j = 0; j < 7; j++) {
          AllowancesData = siteAllowancesData.filter((item: any) => {
            return item.EntryDate == currentdate && !item.isPrinted;
          })
          if (AllowancesData[0]) {
            AllowancesData[0].isPrinted = true;
            rows[i].section.push(AllowancesData[0]);
          } else {
            rows[i].section.push('');
          }
          currentdate = moment(currentdate, "YYYY-MM-DD").add('days', 1).format("YYYY-MM-DD");
        }
      }
      currentdate = start_date;
      for (var k = 0; k < 7; k++) {
        AllowancesData = getTotalHourSummarizedData.filter((item: any) => {
          return item.EntryDate == currentdate;
        })
        if (AllowancesData[0]) {
          let allowanceDuration = AllowancesData[0].Totalhours ? 
          this.Moment(AllowancesData[0].Totalhours, 'HH:mm:ss').format('HH:mm') : '';
          allowanceDuration = allowanceDuration == '00:00' ? '24:00' : allowanceDuration;
          totalhours.push(allowanceDuration);
          //totalhours.push(AllowancesData[0].totalhours)
        } else {
          totalhours.push('');
        }
        currentdate = moment(currentdate, "YYYY-MM-DD").add('days', 1).format("YYYY-MM-DD");
      }
      this.siteAllowenceHours = totalhours;
      this.siteAllowanceEntries = rows;


    } catch (error) {
      this.logger.log(this.fileName, 'loadSummarizedData', 'Error in loadSummarizedData : ' + error.message);
    }
  }

  async SaveAllowances() {
    try {
      if (!this.isValidated()) {
        this.utilityProvider.showSpinner()
        let allowances = [];
        let allowanceTypes = ["Overtime", "Travel", "SiteAllowance", "Meal", "Notes"];
        allowanceTypes.forEach((item) => {
          let entryDate = moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD');
          for (let j = 0; j < 7; j++) {

            let jsonObj = {
              "ALLOWANCEID": this.SiteAllowanceObj[`${item}_UID_${j}`] ? this.SiteAllowanceObj[`${item}_UID_${j}`] : this.utilityProvider.getUniqueKey(),
              "ALLOWANCETYPE": item,
              "CREATEDBY": this.valueProvider.getUser().UserID.toString(),
              "CREATEDDATE": this.SiteAllowanceObj[`${item}_UID_${j}`] ? this.SiteAllowanceObj[`${item}_createdDate_${j}`] : moment.utc(new Date()).format("DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A"),
              "ENTRYDATE": entryDate,
              "MODIFIEDDATE": moment.utc(new Date()).format("DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A"),
              "FIELD1": this.SiteAllowanceObj[`Field1_${item}_${j}`],
              "FIELD2": this.SiteAllowanceObj[`Field2_${item}_${j}`],
              "Notes": this.SiteAllowanceObj[`${item}_${j}`],
              "ORACLEDBID": this.valueProvider.getUser().UserID,
              "MODIFIEDBY": this.valueProvider.getUser().UserID,
              "ISDELETED": "false",
              "DB_SYNCSTATUS": "false",
              "ISSUBMITTED": this.SiteAllowanceObj[`${item}_UID_${j}`] ? this.SiteAllowanceObj[`${item}_isSubmitted_${j}`] : "false",
              "FIELD1_OT": this.SiteAllowanceObj[`Field1_${item}_${j}_OT`],
              "FIELD2_OT": this.SiteAllowanceObj[`Field2_${item}_${j}_OT`],
            };
            if (!this.SiteAllowanceObj[`${item}_UID_${j}`]) {
              if ((this.SiteAllowanceObj[`Field1_${item}_${j}`] && this.SiteAllowanceObj[`Field1_${item}_${j}`] != 'No Value') || (this.SiteAllowanceObj[`Field2_${item}_${j}`] && this.SiteAllowanceObj[`Field2_${item}_${j}`] != 'No Value') || this.SiteAllowanceObj[`${item}_${j}`]) {
                allowances.push(jsonObj);
              }
            } else {
              allowances.push(jsonObj);
            }
            entryDate = moment(entryDate, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');
          }
        })
        // console.log("allowances"+JSON.stringify(allowances));
        let isSubmitted = await this.localServiceSdr.insertOrUpdateSiteAllowancesData(allowances);
        if (isSubmitted) {
          let getDBObj = {
            weekStart: moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD'),
            weekEnd: moment(this.weekEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD'),
            dbcsID: this.valueProvider.getUser().UserID
          }
          let SiteAllowanceData: any = await this.localServiceSdr.getSiteAllowanceData(getDBObj);
          if (SiteAllowanceData.length > 0) {
            if (this.utilityProvider.isConnected()) {
              let success = await this.syncProvider.validateUserDeviceAndToken();
              if (success) {
                let result = await this.submitProvider.submitPendingAllowancesEntries(SiteAllowanceData);
                if (result) {
                  this.utilityProvider.presentToast(this.translate.instant(Enums.Messages.Submitted_Msg), 4000, "top", "");
                } else {
                  this.utilityProvider.presentToast(this.translate.instant(Enums.Messages.Error_Submission), 4000, "top", "");
                }
              }
            }
            else {
              this.utilityProvider.presentToast(this.translate.instant(Enums.Messages.Saved_Msg), 4000, "top", "");
            }
            if (this.valueProvider.getUser().ClarityID) {
              this.navCtrl.setRoot("ClarityTimelistPage")
            } else {
              this.navCtrl.setRoot("TimeNonclaritylistPage")
            }
          }
        } else {
          this.utilityProvider.presentToast("Unable to save data", 4000, "top", "");
        }
      } else {
        let alert = this.alertCtrl.create({
          title: Enums.Messages.Alert_Title,
          subTitle: this.translate.instant(this.msg),
          enableBackdropDismiss: false,
          buttons: [{
            text: this.translate.instant('Ok')
          }]
        });
        alert.present();
      }
    } catch (e) {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, "SaveAllowances", e.message);
    } finally {
      this.utilityProvider.stopSpinner();
    }
  }

  /**
   * Preeti Varshney 12/26/2019
   * get Lovs
   */
  async getLovs() {
    try {
      this.localService.getLookupsByLookupType('AllowanceMultiplier').then((item) => {
        this.multiplierLovs = JSON.parse(JSON.stringify(item));
      });
      this.localService.getLookupsByLookupType('AllowanceSite').then((item) => {
        this.siteLovs = JSON.parse(JSON.stringify(item));
      });

      this.localService.getCountry().then((item) => {
        this.country = JSON.parse(JSON.stringify(item));
      });
    } catch (error) {
      this.logger.log(this.fileName, 'getLovs', 'Error in getLovs : ' + JSON.stringify(error));
    }
  }

  /**
  * Preeti Varshney 12/27/2019
  * Use to return previous page on cancel click
  */
  cancelBtn() {
    if (this.OSCNonClarityUser || this.NonOSCNonClarityUser) {
      this.appCtrl.getRootNav().setRoot("TimeNonclaritylistPage");
    } else {
      this.appCtrl.getRootNav().setRoot("ClarityTimelistPage");
    }
  }


  /**
   * 12-31-2019 -- Mayur Varshney -- open modal to enter notes on the basis of different notes modal
   * Apply check to assign the text to the notes variable on dismiss the notes modal
   * @param {any} form 
   * @param {any} value 
   * @memberOf SiteAllowancesPage
   */
  addEditNotes(form, value) {
    if (this["isDisableDay" + form.substring(form.lastIndexOf('_') + 1)]) return;
    let notes = {
      formValue: form,
      value: value
    };
    let allowanceNotesModal = this.modalController.create('AllowanceNotesModalPage', notes, { enableBackdropDismiss: false, cssClass: 'AllowanceNotesModal' });
    allowanceNotesModal.onDidDismiss(data => {
      if (data != undefined) {
        console.log(data);
        switch (data.form) {
          case 'SiteAllowanceObj_Notes_0':
            this.SiteAllowanceObj.Notes_0 = data.allowance_notes;
            break;
          case 'SiteAllowanceObj_Notes_1':
            this.SiteAllowanceObj.Notes_1 = data.allowance_notes;
            break;
          case 'SiteAllowanceObj_Notes_2':
            this.SiteAllowanceObj.Notes_2 = data.allowance_notes;
            break;
          case 'SiteAllowanceObj_Notes_3':
            this.SiteAllowanceObj.Notes_3 = data.allowance_notes;
            break;
          case 'SiteAllowanceObj_Notes_4':
            this.SiteAllowanceObj.Notes_4 = data.allowance_notes;
            break;
          case 'SiteAllowanceObj_Notes_5':
            this.SiteAllowanceObj.Notes_5 = data.allowance_notes;
            break;
          case 'SiteAllowanceObj_Notes_6':
            this.SiteAllowanceObj.Notes_6 = data.allowance_notes;
            break;
        }
      }
    });
    allowanceNotesModal.present();
  }

  /**
  * Preeti Varshney 12/27/2019
  * Use to return previous page on cancel click
  */
  searchModal(data, key) {
    if (this["isDisableDay" + key.substring(key.lastIndexOf('_') + 1)]) return;
    let dataArray: any = [];
    switch (data) {
      case 'Multiplier':
        dataArray = this.multiplierLovs;
        dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
        dataArray.push({ "LookupID": -1, "LookupValue": "Other" });
        break;
      case 'Site':
        dataArray = this.siteLovs;
        dataArray.unshift({ "LookupID": -2, "LookupValue": "No Value" });
        dataArray.push({ "LookupID": -1, "LookupValue": "Other" });
        break;
      case 'Country':
        dataArray = this.country;
        dataArray.unshift({ "Country_Code": -2, "Country_Name": "No Value" });
        dataArray.push({ "Country_Code": -1, "Country_Name": "Other" });
      default:
        break;
    }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: data }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        this.SiteAllowanceObj[key] = data.LookupValue;
        if (this.SiteAllowanceObj[key] != 'Other') {
          this.SiteAllowanceObj[key + "_OT"] = null;
        }

        if (key.includes('Field1_SiteAllowance') && data.LookupValue == "No Value") {
          this.SiteAllowanceObj[["Field2", key.substring(key.indexOf("_"), key.length)].join('')] = "";
        } else if (key.includes('Field2_Meal') && data.LookupValue == "No Value") {
          this.SiteAllowanceObj[["Field1", key.substring(key.indexOf("_"), key.length)].join('')] = "";
        }
      }
      data = null;
    });
  }

  /**
   * Use to generate compatible JSON for binding data to HTML
   * @param SiteAllowanceData 
   */
  async generateDBJSON(SiteAllowanceData) {
    let allowanceTypes = ["Overtime", "Travel", "SiteAllowance", "Meal", "Notes"];
    let dateObj = [];
    for (let index = 0; index < 7; index++) {
      dateObj.push(moment(this.weekStart, 'DD-MMM-YYYY').add(index, 'days').format('YYYY-MM-DD'))
      allowanceTypes.forEach(elm => {
        this.SiteAllowanceObj[elm + "_UID_" + index] = null;
        this.SiteAllowanceObj[elm + "_isSubmitted_" + index] = null;
        this.SiteAllowanceObj[elm + "_createdDate_" + index] = null;
        if (elm != 'Notes') {
          this.SiteAllowanceObj['Field1_' + elm + "_" + index] = null;
          this.SiteAllowanceObj['Field1_' + elm + "_" + index + "_OT"] = null;
          this.SiteAllowanceObj['Field2_' + elm + "_" + index] = null;
          this.SiteAllowanceObj['Field2_' + elm + "_" + index + "_OT"] = null;
        }
        else {
          this.SiteAllowanceObj[elm + "_" + index] = null
        }
      });
    }
    if (SiteAllowanceData.length) {
      allowanceTypes.forEach(element => {
        SiteAllowanceData.filter(obj => {
          return obj.ALLOWANCETYPE == element;
        }
        ).forEach((element) => {
          this.SiteAllowanceObj[element.ALLOWANCETYPE + "_UID_" + dateObj.indexOf(element.ENTRYDATE)] = element.ALLOWANCEID
          this.SiteAllowanceObj[element.ALLOWANCETYPE + "_isSubmitted_" + dateObj.indexOf(element.ENTRYDATE)] = element.ISSUBMITTED
          this.SiteAllowanceObj[element.ALLOWANCETYPE + "_createdDate_" + dateObj.indexOf(element.ENTRYDATE)] = element.CREATEDDATE
          if (element.ALLOWANCETYPE != 'Notes') {
            this.SiteAllowanceObj['Field1_' + element.ALLOWANCETYPE + "_" + dateObj.indexOf(element.ENTRYDATE)] = element.FIELD1
            this.SiteAllowanceObj['Field1_' + element.ALLOWANCETYPE + "_" + dateObj.indexOf(element.ENTRYDATE) + "_OT"] = element.FIELD1_OT
            this.SiteAllowanceObj['Field2_' + element.ALLOWANCETYPE + "_" + dateObj.indexOf(element.ENTRYDATE)] = element.FIELD2
            this.SiteAllowanceObj['Field2_' + element.ALLOWANCETYPE + "_" + dateObj.indexOf(element.ENTRYDATE) + "_OT"] = element.FIELD2_OT
          }
          else {
            this.SiteAllowanceObj[element.ALLOWANCETYPE + "_" + dateObj.indexOf(element.ENTRYDATE)] = element.NOTES
          }
        });
      });
      this.allowanceListLength = Object.keys(this.SiteAllowanceObj).length;
    }
    else {
      this.allowanceListLength = 0;
    }
    return this.SiteAllowanceObj;
  }

  async  getSiteAllowanceData() {
    try {
      let getDBObj = {
        weekStart: moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD'),
        weekEnd: moment(this.weekEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD'),
        dbcsID: this.valueProvider.getUser().UserID
      }
      let SiteAllowanceData = await this.localServiceSdr.getSiteAllowanceData(getDBObj);
      return await this.generateDBJSON(SiteAllowanceData);
    } catch (e) {
      this.logger.log(this.fileName, "getSiteAllowanceData", e.message)
    }
  }

  getWeekDay(dayName) {
    let arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return arr.indexOf(dayName);
  }

  /**
    * Preeti Varshney 03/12/2019
    * show and set date or week according to selected date from the calander
    */
  async getDurationOnDate(isEntry?) {
    this.SiteAllowanceObj = {};
    let start_date;
    let end_date;
    let date = moment(this.calendarSelectedDay, 'DD-MMM-YYYY');
    let date1 = moment(this.calendarSelectedDay, 'DD-MMM-YYYY');
    let st_date = date.startOf('week');
    let en_date = date1.endOf('week');
    this.weekStart = moment(st_date).format('DD-MMM-YYYY');
    this.weekEnd = moment(en_date).format('DD-MMM-YYYY');
    this.calendarSelectedDay = moment(this.weekStart, "DD-MMM-YYYY").toDate();
    this.days = this.utilityProvider.dateGrid(moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD'));
    if (isEntry) {
      start_date = moment(this.weekStart, 'DD-MMM-YYYY').format('YYYY-MM-DD');
      end_date = moment(this.weekEnd, 'DD-MMM-YYYY').format('YYYY-MM-DD');
      this.loadSummarizedData(start_date, end_date);
    }
    this.SiteAllowanceObj = await this.getSiteAllowanceData();
    this.checkforMinDate();
    // 01-09-2020 -- Mayur Varshney -- disable future date fields to restrict user for entering allowance of future date
    this.disableFutureInputGrid();
    this.checkforFutureWeek();
  }

  /**
  * Mayur Varshney -- 12/30/2019
  * Method to delete time entry if clicked ok
  * @param {*} time
  * @memberof SiteAllowancesPage
  */
  deleteTime() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("Alert"),
      message: this.translate.instant('This will delete all Site Allowance entries for the entire week'),
      enableBackdropDismiss: false,
      buttons: [
        {
          text: this.translate.instant('Cancel'),
          handler: () => {
          }
        },
        {
          text: this.translate.instant('Continue'),
          handler: () => {
            this.deleteAllowanceTimeEntry();
          }
        }
      ]
    });
    alert.present();
  }


  /**
   * 01-01-2020 -- Mayur Varshney
   * Delete Allowance from local db if entries are submitted in offline mode
   * Delete Allowance from ATP and Local DB if entried are submitted in Online Mode
   * Present toast on successfull submittion of Allowance Entries in Local DB or ATP or both
   * Refreshing allowance data after deletion process
   * @memberOf SiteAllowancesPage
   */
  async deleteAllowanceTimeEntry() {
    this.utilityProvider.showSpinner();
    try {
      let date: any = {
        startDate: moment(this.weekStart, "DD-MMM-YYYY").format("YYYY-MM-DD"),
        endDate: moment(this.weekEnd, "DD-MMM-YYYY").format("YYYY-MM-DD")
      }
      await this.localService.deleteATPAllowanceTimeEntries(date);
      await this.localService.deleteLocalAllowanceTimeEntries(date);
      this.SiteAllowanceObj = {};
      if (this.utilityProvider.isConnected()) {
        let result = await this.syncProvider.validateUserDeviceAndToken();
        if (result) {
          let success = await this.submitProvider.deletePendingAllowancesEntries();
          if (success) {
            this.utilityProvider.presentToast(this.translate.instant("Entries of selected week are deleted successfully"), 3000, "top", "");
          } else {
            throw new Error('Unable to delete');
          }
        }
      } else {
        this.utilityProvider.presentToast(this.translate.instant("Entries of selected week are deleted successfully"), 3000, "top", "");
      }

      this.getSiteAllowanceData();
    } catch (e) {
      this.utilityProvider.presentToast(this.translate.instant("Unable to delete"), 3000, "top", "");
      this.logger.log(this.fileName, "deleteAllowanceTimeEntry", e.message);
    } finally {
      this.utilityProvider.stopSpinner();
    }
  }

  /**
 * 12/30/2019 Preeti Varshney
 * Handle double click on calendar dates
 * @param {*} event
 */
  onShowPicker(event) {
    event.dayHoverHandler = this.utilityProvider.singleClickDaySelector(event, this.dps);
  }


  isNotNull(value) {
    return value && value != '' && value != "No Value"
  }

  checkIfHasValue() {
    return Object.keys(this.SiteAllowanceObj).filter((obj) => {
      return this.SiteAllowanceObj[obj] && this.SiteAllowanceObj[obj] != 'No Value';
    }).length
  }
  /**
     * 01/03/2020 Preeti Varshney
     * Check input form for the validation
     * Field1 is mandatory if corresponding Field2 has value and vice-versa.
     */
  isValidated() {
    let hasError = false;
    let hasValue = this.checkIfHasValue();
    let allowances = ["Overtime", "Travel", "SiteAllowance", "Meal"];
    if (hasValue) {
      this.msg = Enums.Messages.SDR_Required_Msg;
      for (let i = 0; i < allowances.length; i++) {
        for (let index = 0; index < 7; index++) {
          if ((this.SiteAllowanceObj['Field1_' + allowances[i] + '_' + index] && this.SiteAllowanceObj['Field1_' + allowances[i] + '_' + index] != 'No Value') || (this.SiteAllowanceObj['Field2_' + allowances[i] + '_' + index] && this.SiteAllowanceObj['Field2_' + allowances[i] + '_' + index] != 'No Value')) {
            if (!((this.SiteAllowanceObj['Field1_' + allowances[i] + '_' + index] && this.SiteAllowanceObj['Field1_' + allowances[i] + '_' + index] != 'No Value') && (this.SiteAllowanceObj['Field2_' + allowances[i] + '_' + index] && this.SiteAllowanceObj['Field2_' + allowances[i] + '_' + index] != 'No Value'))) {
              hasError = true;
              break;
            }

            if ((this.SiteAllowanceObj['Field1_' + allowances[i] + '_' + index] == 'Other' && (!this.SiteAllowanceObj['Field1_' + allowances[i] + '_' + index + '_OT'])) || (this.SiteAllowanceObj['Field2_' + allowances[i] + '_' + index] == 'Other' && (!this.SiteAllowanceObj['Field2_' + allowances[i] + '_' + index + '_OT']))) {
              hasError = true;
              break;
            }
          }
        }
        if (hasError) {
          break;
        }
      }
    }
    else {
      this.msg = Enums.Messages.SiteAllowance_Required_Msg;
      hasError = true;
    }
    return hasError;
  }

  /**
   * 01/06/2020 Preeti Varshney
   * Hide left-arrow icon in week switch controller if it is less than three months before. 
   */
  checkforMinDate() {
    let weekStart = moment(this.weekStart, "DD-MMM-YYYY");
    let minDate = moment(this.minDate);
    if (weekStart >= minDate) {
      this.enableDisableDate = true;
    } else {
      this.enableDisableDate = false;
    }

  }
  /**
   * 01/07/2020 Preeti Varshney
   * Hide right-arrow icon in week switch controller for current and future week. 
   */
  checkforFutureWeek() {
    let currentWeekEnd = moment().endOf('week').format('YYYY-MM-DD');
    if (moment(moment(this.weekEnd, "DD-MMM-YYYY").format('YYYY-MM-DD')).isSameOrAfter(currentWeekEnd)) {
      this.futureWeek = true;
    }
    else {
      this.futureWeek = false;
    }

  }
  expandAll(event) {
    this.toggleAllaccordion = this.overtimeExpanded = this.travelExpanded = this.siteAllowanceExpanded = this.mealExpanded = this.summHoursExpanded = event;
  }
  // calOvertime(key) {
  //   let regexp = new RegExp('^[0-9.]+$');
  //   let dataValid = regexp.test(this.SiteAllowanceObj[key]);
  //   if (parseFloat(this.SiteAllowanceObj[key]) > 24) {
  //     this.SiteAllowanceObj[key] = '';
  //     return;
  //   }
  //   let n;
  //   if (this.SiteAllowanceObj[key].indexOf(".") != -1) {
  //     n = this.SiteAllowanceObj[key].slice(0, this.SiteAllowanceObj[key].indexOf(".") + 3);
  //   } else {
  //     n = this.SiteAllowanceObj[key];
  //   }
  //   let a = parseFloat(n);
  //   if (!dataValid || !(a != 0.00)) {
  //     this.SiteAllowanceObj[key] = '';
  //   }
  //   else {
  //     this.SiteAllowanceObj[key] = a;
  //   }
  // }
  // calOvertime(key) {
  //   let limit = new RegExp("^(1[1-9]|2[1-4]|[1-9])$");
  //   let validLimit = limit.test(this.SiteAllowanceObj[key]);
  //   if (validLimit) {
  //     return;
  //   } else {
  //     let regexp = new RegExp("^((1[1-9]|2[1-3]|[1-9])*[.][5,25,50,75]{1,2}$)");
  //     let dataValid = regexp.test(this.SiteAllowanceObj[key]);
  //     if (!dataValid || this.SiteAllowanceObj[key]>24 || this.SiteAllowanceObj[key]==0.00) {
  //       this.SiteAllowanceObj[key] = '';
  //       this.utilityProvider.presentToast(this.translate.instant(Enums.Messages.Invalid_hours), 4000, "top", "");
  //     }
  //   }
  // }

  calOvertime(key) {
    if(this.SiteAllowanceObj[key]){
    let data;
    data = new Number(this.SiteAllowanceObj[key]);
    if (data<= 24 && data!=0) {
      if (this.SiteAllowanceObj[key].indexOf(".") != -1) {
        let radixPos = String(this.SiteAllowanceObj[key]).indexOf('.');
        let value = String(this.SiteAllowanceObj[key]).slice(radixPos);
        if (value != ".25" && value != ".50" && value != ".75" && value != ".5" && value != ".00" && value != ".0" ) {
          this.SiteAllowanceObj[key] = '';
          this.utilityProvider.presentToast(this.translate.instant(Enums.Messages.Invalid_hours), 4000, "top", "");
        }
      }
    }
    else {
      this.SiteAllowanceObj[key] = '';
      this.utilityProvider.presentToast(this.translate.instant(Enums.Messages.Invalid_hours), 4000, "top", "");
    }
  }
  }

  /**
   * 01-09-2020 -- Mayur Varshney -- trim space
   * @param {any} key 
   * @memberOf SiteAllowancesPage
   */
  trimSpace(key) {
    if (key)
      this.SiteAllowanceObj[key] = this.SiteAllowanceObj[key].trim();
  }


  /**
   * 01-09-2020 -- Mayur Varshney
   * assigning the boolean value to enable disable the date grids
   * @memberOf SiteAllowancesPage
   */
  disableFutureInputGrid() {
    this.days.forEach((element, index) => {
      this['isDisableDay' + index] = this.utilityProvider.checkforFutureDate('day', this.days[index].dayFullDate, "DD-MM-YYYY");
    });
  }

}

