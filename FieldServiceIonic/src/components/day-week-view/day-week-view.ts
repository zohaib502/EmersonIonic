import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { NavController, NavParams, App, Events } from 'ionic-angular';
import * as moment from "moment";
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { ValueProvider } from '../../providers/value/value'
import { UtilityProvider } from '../../providers/utility/utility';
import { TimesheetDropdownPage } from '../../pages/timesheet-dropdown/timesheet-dropdown';
import { LocalServiceProvider } from '../../providers/local-service/local-service';

@Component({
  selector: 'day-week-view',
  templateUrl: 'day-week-view.html'
})
export class DayWeekViewComponent {
  weekBtnClicked: boolean = true;
  dayBtnClicked: boolean = false;
  advSearchBtnClicked: boolean = false;
  calendarSelectedDay: any;
  text: string;
  selectedDay: any;
  @Output() OutData = new EventEmitter();
  WeekStart: string;
  WeekEnd: string;
  taskInput: any;
  advBtnText: string = 'Advanced Search';
  userPreferenceData: any;
  clarityUser: boolean = false;
  datepickerConfig: Partial<BsDatepickerConfig>;
  minDate: Date = new Date(new Date().setDate(new Date().getDate() - 90));
  enableDisableDate: boolean = true;
  showAllowanceButton: boolean = false;
  @ViewChild('dps') dps: BsDatepickerDirective;
  isFutureWeek: boolean = false;
  constructor(public events: Events,
    public navCtrl: NavController, public utilityProvider: UtilityProvider,
    public navParams: NavParams, public appCtrl: App, public valueProvider: ValueProvider, public localProvider: LocalServiceProvider) {
    this.datepickerConfig = Object.assign({}, {
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false,
      minDate: this.minDate
    });
    this.selectedDay = moment().format('DD-MMM-YYYY');
    if (this.valueProvider.getUser().ClarityID != '')
      this.clarityUser = true;

  }
  ngOnInit() {
    this.events.subscribe('updatestartDay', (data) => {
      this.WeekStart = data.weekStart;
      this.calendarSelectedDay = moment(this.WeekStart, "DD-MMM-YYYY").toDate();
      this.WeekEnd = data.weekEnd;
      this.dayBtnClicked = data.dayBtnClicked;
      this.weekBtnClicked = data.weekBtnClicked;
      this.advSearchBtnClicked = data.advSearchBtnClicked;
      if (!this.advSearchBtnClicked && this.dayBtnClicked) {
        this.setWeekDay('showDayWise');
        this.checkforFutureWeek('day');
      }
      else if (!this.advSearchBtnClicked && this.weekBtnClicked) {
        this.setWeekDay('showWeekWise');
        this.checkforFutureWeek('week');
      }
    });
    this.events.subscribe('clearSearchBox', () => {
      this.taskInput = "";
    });

  }

  /**
   * Preeti Varshney 03/12/2019
   * navigate to time entry page with parameters weekStart Date and weekEnd Date
   */
  addProject(value) {
    switch (value) {
      case 'addtime':
        if (this.valueProvider.getUser().ClarityID != '') {
          this.appCtrl.getRootNav().setRoot("ClarityTimeEntryPage", { weekStart: this.utilityProvider.WeekStart, weekEnd: this.utilityProvider.weekEnd });
        } else {
          if (this.valueProvider.getResourceId() != '0') {
            this.appCtrl.getRootNav().setRoot("OSCNonCTimeEntryPage", { weekStart: this.utilityProvider.WeekStart, weekEnd: this.utilityProvider.weekEnd, isVacation: false });
          } else {
            this.appCtrl.getRootNav().setRoot("NonClarityTimeEntryPage", { weekStart: this.utilityProvider.WeekStart, weekEnd: this.utilityProvider.weekEnd, vacationentry: true, vacClick: true });
          }
        }
        break;
      case 'addVactime':
        if (this.valueProvider.getUser().ClarityID != '') {
          this.appCtrl.getRootNav().setRoot("ClarityTimeEntryPage", { weekStart: this.utilityProvider.WeekStart, weekEnd: this.utilityProvider.weekEnd });
        } else {
          this.appCtrl.getRootNav().setRoot("NonClarityTimeEntryPage", { weekStart: this.utilityProvider.WeekStart, weekEnd: this.utilityProvider.weekEnd, vacationentry: false, vacClick: false, vac: true });
        }
        break;
      case 'Absences':
        if (this.valueProvider.getResourceId() != '0') {
          this.appCtrl.getRootNav().setRoot("OSCNonCTimeEntryPage", { weekStart: this.utilityProvider.WeekStart, weekEnd: this.utilityProvider.weekEnd, isVacation: true });
        } else {
          this.appCtrl.getRootNav().setRoot("NonClarityTimeEntryPage", { weekStart: this.utilityProvider.WeekStart, weekEnd: this.utilityProvider.weekEnd, vacationentry: false, vacClick: false });
        }
        break;
      case 'addAllowances':
        // 01-02-2020 -- Mayur Varshney -- add parameter of calendarType for Add and edit siteAllowances
        this.appCtrl.getRootNav().setRoot("SiteAllowancesPage", { weekStart: this.utilityProvider.WeekStart, weekEnd: this.utilityProvider.weekEnd, calendarType: "currentWeek" });
        break;
    }
  }
  editTimeEntry() {
    this.navCtrl.push("NonClarityEditTimeEntryPage");
  }

  /**
  *Prateek 03/13/2019
  * Code optimization for setting day and week view by publishing single event and condition on the basis of case.
  */setWeekDay(event) {
    if (this.dps && this.dps.isOpen) {
      this.dps.hide();
    }
    let data;
    switch (event) {

      case 'setWeekStart':
        this.WeekStart = moment(this.WeekStart, 'DD-MMM-YYYY').subtract(7, 'days').format('DD-MMM-YYYY');
        this.WeekEnd = moment(this.WeekEnd, 'DD-MMM-YYYY').subtract(7, 'days').format('DD-MMM-YYYY');
        // 01-02-2020 -- Mayur Varshney -- call getAllowance function with Start and End Date as params for week view
        this.getAllowanceData(this.WeekStart, this.WeekEnd);
        data = { weekStart: this.WeekStart, weekEnd: this.WeekEnd, type: event };
        this.calendarSelectedDay = moment(this.WeekStart, "DD-MMM-YYYY").toDate();
        this.selectedDay = this.WeekStart;
        this.events.publish("setWeekDay", data);
        this.getDurationOnDate('week');
        this.checkforFutureWeek('week');
        break;
      case 'setWeekEnd':
        this.WeekStart = moment(this.WeekStart, 'DD-MMM-YYYY').add(7, 'days').format('DD-MMM-YYYY');
        this.WeekEnd = moment(this.WeekEnd, 'DD-MMM-YYYY').add(7, 'days').format('DD-MMM-YYYY');
        // 01-02-2020 -- Mayur Varshney -- call getAllowance function with Start and End Date as params for week view
        this.getAllowanceData(this.WeekStart, this.WeekEnd);
        data = { weekStart: this.WeekStart, weekEnd: this.WeekEnd, type: event };
        this.calendarSelectedDay = moment(this.WeekStart, "DD-MMM-YYYY").toDate();
        this.selectedDay = this.WeekStart;
        this.events.publish("setWeekDay", data);
        this.getDurationOnDate('week');
        this.checkforFutureWeek('week');
        break;
      case 'setPreviusDay':
        this.selectedDay = moment(this.selectedDay, 'DD-MMM-YYYY').subtract(1, 'days').format('DD-MMM-YYYY');
        data = { selectedday: this.selectedDay, type: event };
        this.WeekStart = this.selectedDay;
        // 01-02-2020 -- Mayur Varshney -- call getAllowance function with Start Date as params for day view
        this.getAllowanceData(this.WeekStart);
        this.calendarSelectedDay = moment(this.WeekStart, "DD-MMM-YYYY").toDate();
        this.events.publish("setWeekDay", data);
        this.getDurationOnDate('day');
        this.checkforFutureWeek('day');
        break;
      case 'setNextDay':
        this.selectedDay = moment(this.selectedDay, 'DD-MMM-YYYY').add(1, 'days').format('DD-MMM-YYYY');
        data = { selectedday: this.selectedDay, type: event };
        this.WeekStart = this.selectedDay;
        // 01-02-2020 -- Mayur Varshney -- call getAllowance function with Start Date as params for day view
        this.getAllowanceData(this.WeekStart);
        this.calendarSelectedDay = moment(this.WeekStart, "DD-MMM-YYYY").toDate();
        this.events.publish("setWeekDay", data);
        this.getDurationOnDate('day');
        this.checkforFutureWeek('day');
        break;
      case 'showDayWise':
        this.weekBtnClicked = false;
        this.dayBtnClicked = true;
        this.selectedDay = moment(this.selectedDay, 'DD-MMM-YYYY').format('DD-MMM-YYYY');
        // 01-02-2020 -- Mayur Varshney -- call getAllowance function with Start Date as params for day view
        this.getAllowanceData(this.selectedDay);
        this.calendarSelectedDay = moment(this.selectedDay, "DD-MMM-YYYY").toDate();
        data = { weekBtnClicked: this.weekBtnClicked, dayBtnClicked: this.dayBtnClicked, selectedday: this.selectedDay, type: event, weekStart: this.WeekStart, weekEnd: this.WeekEnd };
        this.events.publish('setWeekDay', data);
        this.getDurationOnDate('day');
        this.checkforFutureWeek('day');
        break;
      case 'showWeekWise':
        this.dayBtnClicked = false;
        this.weekBtnClicked = true;
        this.selectedDay = moment(this.selectedDay, 'DD-MMM-YYYY').format('DD-MMM-YYYY');
        this.calendarSelectedDay = moment(this.selectedDay, "DD-MMM-YYYY").toDate();
        // 01-02-2020 -- Mayur Varshney -- call getAllowance function with Start and End Date as params for week view
        this.getAllowanceData(this.WeekStart, this.WeekEnd);
        data = { weekBtnClicked: this.weekBtnClicked, dayBtnClicked: this.dayBtnClicked, selectedday: this.selectedDay, type: event, weekStart: this.WeekStart, weekEnd: this.WeekEnd };
        this.events.publish('setWeekDay', data);
        this.getDurationOnDate('week');
        this.checkforFutureWeek('week');
        break;
      case 'advSearchBtn':
        if (this.advSearchBtnClicked == false) {
          this.advSearchBtnClicked = true;
          this.advBtnText = "Close Advanced Search";
        }
        else {
          this.advSearchBtnClicked = false;
          this.advBtnText = "Advanced Search";
        }
        data = { advSearchBtnClicked: this.advSearchBtnClicked, weekBtnClicked: this.weekBtnClicked, dayBtnClicked: this.dayBtnClicked, type: event };
        this.events.publish('setWeekDay', data);
        break;

      // Preeti Varshney 04/03/2019 -- event for sending job id to be search to the list-view
      case 'searchJobid':
        data = { taskInput: this.taskInput, type: event };
        this.events.publish('setWeekDay', data)
        break;
      default:
        break;

    }
    //this.checkforMinDate();
  }

  checkforMinDate(dayOrWeek) {
    let selectedDay = moment(this.selectedDay, "DD-MMM-YYYY");
    let weekStart = moment(this.WeekStart, "DD-MMM-YYYY");
    let minDate = moment(this.minDate);
    if (dayOrWeek == "week") {
      if (weekStart >= minDate) {
        this.enableDisableDate = true;
      } else {
        this.enableDisableDate = false;
      }
    }
    else {
      if (selectedDay >= minDate) {
        this.enableDisableDate = true;
      } else {
        this.enableDisableDate = false;
      }
    }
  }

  /**
   * Preeti Varshney 03/12/2019
   * set previous day
   */
  setPreviousDay() {
    this.selectedDay = moment(this.selectedDay, 'DD-MMM-YYYY').subtract(1, 'days').format('DD-MMM-YYYY');
  }

  /**
   * Preeti Varshney 03/12/2019
   * set next day
   */
  setNextDay() {
    this.selectedDay = moment(this.selectedDay, 'DD-MMM-YYYY').add(1, 'days').format('DD-MMM-YYYY');
  }
  /**
     * Preeti Varshney 03/12/2019
     * show and set date or week according to selected date from the calander
     */
  getDurationOnDate(type, isEntry?) {
    if (type == "week") {
      let date = moment(this.calendarSelectedDay, 'DD-MMM-YYYY');
      let date1 = moment(this.calendarSelectedDay, 'DD-MMM-YYYY');
      let date2 = moment(this.calendarSelectedDay, 'DD-MMM-YYYY');
      let st_date = date.startOf('week');
      let en_date = date1.endOf('week');
      this.WeekStart = moment(st_date).format('DD-MMM-YYYY');
      this.WeekEnd = moment(en_date).format('DD-MMM-YYYY');
      // 01-08-2020 -- Mayur Varshney -- show allowance if user selects a week from Calendar Picker
      this.getAllowanceData(this.WeekStart, this.WeekEnd);
      this.calendarSelectedDay = moment(this.WeekStart, "DD-MMM-YYYY").toDate();
      if (!(moment(this.selectedDay, 'DD-MMM-YYYY').startOf('week').isSame(st_date))) {
        this.selectedDay = this.WeekStart;
      }
      let data = { weekStart: this.WeekStart, weekEnd: this.WeekEnd, selectedDay: date2.format('DD-MMM-YYYY'), isChange: isEntry };
      this.events.publish('setWeekfromCal', data);
    }
    else {
      let date = moment(this.calendarSelectedDay, 'DD-MMM-YYYY');
      let date1 = moment(this.calendarSelectedDay, 'DD-MMM-YYYY');
      let date2 = moment(this.calendarSelectedDay, 'DD-MMM-YYYY');
      this.selectedDay = date2.format('DD-MMM-YYYY');
      let st_date = date.startOf('week');
      let en_date = date1.endOf('week');
      this.WeekStart = moment(st_date).format('DD-MMM-YYYY');
      this.WeekEnd = moment(en_date).format('DD-MMM-YYYY');
      // 01-08-2020 -- Mayur Varshney -- show allowance if user selects a day from Calendar Picker
      this.getAllowanceData(this.selectedDay);
      this.calendarSelectedDay = moment(this.selectedDay, "DD-MMM-YYYY").toDate();
      let data = { weekStart: this.WeekStart, weekEnd: this.WeekEnd, selectedDay: this.selectedDay, isChange: isEntry };
      this.events.publish('setWeekfromCal', data);
    }
    this.checkforMinDate(type);
    this.checkforFutureWeek(type);
  }


  /**
   * 05/11/2019 Mayur Varshney
   * Handle double click on calendar dates
   * @param {*} event
   * @memberof DayWeekViewComponent
   */
  onShowPicker(event) {
    event.dayHoverHandler = this.utilityProvider.singleClickDaySelector(event, this.dps);
  }
  formatDate(selecteddate) {
    selecteddate = moment(selecteddate, "DD-MMM-YYYY").format(this.valueProvider.getUserPreferences()[0].Date_Format ? this.valueProvider.getUserPreferences()[0].Date_Format.toUpperCase() : "DD-MMM-YYYY");
    return selecteddate
  }


  /**
   * 01-02-2020 -- Mayur Varshney
   * show hide clickable link to edit the allowance of the selected week or day
   * get count of allowance in the selected week or day
   * @param {any} startDate 
   * @param {any} [endDate] 
   * @memberOf DayWeekViewComponent
   */
  async getAllowanceData(startDate, endDate?) {
    startDate = moment(startDate, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    endDate = endDate ? moment(endDate, 'DD-MMM-YYYY').format('YYYY-MM-DD') : startDate;
    let data: any = await this.localProvider.getAllowanceData(startDate, endDate);
    this.showAllowanceButton = data[0].Count == 0 ? false : true;
  }


  /**
   * 01-02-2020 -- Mayur Varshney
   * navigate the page to the site allowance page on the basis of selected week or day to edit the allowance
   * @memberOf DayWeekViewComponent
   */
  editAllowance() {
    this.appCtrl.getRootNav().setRoot("SiteAllowancesPage", { weekStart: this.WeekStart, weekEnd: this.WeekEnd, calendarType: "selectedWeek" });
  }
  
  /**
    * 01/07/2020 Preeti Varshney
    * Disable Allowance + button for future week in week-view and for future date in day-view. 
    */
  checkforFutureWeek(dayOrWeek) {
    let currentWeekEndORDay = dayOrWeek == "week" ? moment().endOf('week').format() : moment().format();
    let checkDate = dayOrWeek == "week" ? moment(this.WeekStart, "DD-MMM-YYYY").format() : moment(this.selectedDay, "DD-MMM-YYYY").format();
    if (moment(checkDate).isAfter(currentWeekEndORDay)) {
      this.isFutureWeek = true;
    }
    else {
      this.isFutureWeek = false;
    }
  }
}
