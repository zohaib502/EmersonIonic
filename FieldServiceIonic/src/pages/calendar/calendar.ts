import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import * as moment from "moment-timezone";
import { AlertController } from 'ionic-angular';
import { ValueProvider } from '../../providers/value/value';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { UtilityProvider } from '../../providers/utility/utility';
import { LoggerProvider } from '../../providers/logger/logger';
// declare var jquery: any;
declare var $: any;
import * as Enums from '../../enums/enums';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
  header_data: any;
  minTimeVal = "00:00:00";
  maxTimeVal = "24:00:00";
  eventsArray: any[] = [];
  localeused: any;
  userPreferredTimezone: any;
  preferredTimeCode: any;
  preferredUTCOffset: any;
  fileName: any = 'Calendar_Page';

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public localService: LocalServiceProvider, public valueProvider: ValueProvider, public utilityProvider: UtilityProvider, public logger: LoggerProvider) {
    this.header_data = { title1: "", title2: "Calendar", taskId: "" };

  }

  ionViewDidLoad() {
    // 01/30/2019 -- Mayur Varshney -- get timeZoneIANA from tables, no need to convert it now
    this.userPreferredTimezone = this.valueProvider.getUserPreferences()[0].timeZoneIANA;
    this.getCalendarData();
    this.events.publish('user:created', "Calendar");
    let index = this.navCtrl.getActive().index;
    this.logger.log(this.fileName, 'ionViewDidEnter', "index Calendar" + index);
  }

  ionViewDidEnter() {
    //Prateek(23/01/2019) Shifted all events in didenter. 
    this.events.subscribe('refreshPageData', (obj) => {
      //$('#calendar').fullCalendar('removeEvents');
      this.getCalendarDataOnRefresh();
    });
    this.events.subscribe('langSelected', (res) => {
      this.localeused = res;
      this.eventInit(this.localeused);
    });
    this.events.subscribe('refreshPreferences', (res) => {
      // 01/30/2019 -- Mayur Varshney -- get timeZoneIANA from tables, no need to convert it now
      this.userPreferredTimezone = this.valueProvider.getUserPreferences()[0].timeZoneIANA;
      this.getCalendarData();
    });
    // 08/30/2018 Zohaib Khan: If calander is coming from userpreferences page than get calander data.
    if (this.navCtrl.last().name == "UserPreferencesPage") {
      // 01/30/2019 -- Mayur Varshney -- get timeZoneIANA from tables, no need to convert it now
      this.userPreferredTimezone = this.valueProvider.getUserPreferences()[0].timeZoneIANA;
      //08/29/2018 Zohaib Khan: Getting refreshed calander data on Backbutton. 
      this.getCalendarDataOnRefresh();
    }
    this.events.publish('user:created', "Calendar");
  }

  getCalendarDataOnRefresh() {
    let self = this;
    // 08/21/2019 -- Mayur Varshney -- remove check of gettask length as it is already applied in gettask function
    self.getTask().then((res: any) => {
      // 08/21/2019 -- Mayur Varshney -- remove check of getActivity length as it is already applied in getActivity function
      self.getActivity().then((res: any) => {
        //self.eventInit(this.valueProvider.getSelectedLang());
        $("#calendar").fullCalendar('removeEvents');
        $("#calendar").fullCalendar('addEventSource', this.eventsArray);
        $("#calendar").fullCalendar('rerenderEvents');
      }).catch((error: any) => {
        self.logger.log(self.fileName, 'ionViewDidLoad', 'Error in ionViewDidLoad : ' + JSON.stringify(error));
      });
    }).catch((error: any) => {
      self.logger.log(self.fileName, 'ionViewDidLoad', 'Error in ionViewDidLoad : ' + JSON.stringify(error));
    });
  }

  getCalendarData() {
    let self = this;
    // 08/21/2019 -- Mayur Varshney -- remove check of gettask length as it is already applied in gettask function
    self.getTask().then((res: any) => {
      // 08/21/2019 -- Mayur Varshney -- remove check of getActivity length as it is already applied in getActivity function
      self.getActivity().then((res: any) => {
        self.eventInit(this.valueProvider.getSelectedLang());
      }).catch((error: any) => {
        self.logger.log(self.fileName, 'ionViewDidLoad', 'Error in ionViewDidLoad : ' + JSON.stringify(error));
      });
    }).catch((error: any) => {
      self.logger.log(self.fileName, 'ionViewDidLoad', 'Error in ionViewDidLoad : ' + JSON.stringify(error));
    });
  }

  getTask() {
    return new Promise((resolve, reject) => {
      if (this.valueProvider.getTaskList().length > 0) {
        this.setEventArray(this.valueProvider.getTaskList()).then((res: any) => {
          resolve(true);
        }).catch((error: any) => {
          this.logger.log(this.fileName, 'getTask', error);
          reject(error);
        });
      }
      else {
        resolve(true);
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getTask', error);
    });
  }

  getActivity() {
    return new Promise((resolve, reject) => {
      if (this.valueProvider.getWorkSchedule().length > 0) {
        //this.logger.log(this.fileName, "getActivity", 'Inside' + JSON.stringify(this.valueProvider.getWorkSchedule()));
        this.setActivityEventArray(this.valueProvider.getWorkSchedule()).then((res: any) => {
          resolve(true);
        }).catch((error: any) => {
          this.logger.log(this.fileName, 'getActivity', error);
          reject(error);
        });
      }
      else {
        resolve(true);
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getActivity', error);
    });
  }

  async eventInit(lang) {
    this.utilityProvider.showSpinner();
    let self = this;
    let selectedLanguage;
    // 10/09/2018 -- Mayur Varshney --  set calendar locale according to selected language
    // if (lang) {
    //   selectedLanguage = lang;
    // } else {
    //   selectedLanguage = "en-gb";
    // }

    // 01-28-2020 -- Mayur Varshney -- send standard language code to the calendar module, pass "en-gb" as default if no language is selected
    selectedLanguage = await this.localService.getStandardLangCode(lang);
    selectedLanguage = selectedLanguage[0].Standard_Code;
    if (!selectedLanguage) {
      selectedLanguage = "en-gb";
    }

    $(document).ready(() => {
      $('#calendar').fullCalendar({
        customButtons: {
          monthButton: {
            text: 'month',
            click: function () {
              this.showMonth = true;
            }
          }
        },
        header: {
          left: 'prev,title,next ',
          right: 'agendaDay,agendaWeek,month'
        },
        locale: selectedLanguage,
        fixedWeekCount: false,
        defaultView: 'agendaWeek',
        navLinks: true,
        editable: false,
        slotEventOverlap: false,
        eventLimit: true,
        views: {
          month: {
            eventLimit: 6
          }
        },
        //adding all day slot
        allDaySlot: true,
        minTime: self.minTimeVal,
        maxTime: self.maxTimeVal,
        events: self.eventsArray,
        eventClick: function (event, jsEvent, view) {
          self.utilityProvider.showSpinner();
          self.valueProvider.setTask(event).then((response) => {
            // 11/21/2018 -- Mayur Varshney -- open modal to show details of clicked event(job/activity) 
            self.openCalendarInfo(event);
          }).catch((error: any) => {
            self.logger.log(this.fileName, 'eventInit', error);
          });
        },
        eventRender: function (event, element) {
          // 10/25/2018 -- Mayur Varshney -- Add completing awaiting review 
          if (event.Task_Status == 'Completed-Awaiting Review') {
            element.addClass("completedEvent");
          }
          // 10/25/2018 -- Mayur Varshney -- Add Debrief In Progress, Debrief Started
          if (event.Task_Status == 'Accepted' || event.Task_Status == 'Debrief In Progress' || event.Task_Status == 'Debrief Started') {
            element.addClass("acceptedEvent");
          }
          if (event.Task_Status == 'Assigned') {
            element.addClass("assignedEvent");
          }
          // 10/25/2018 -- Mayur Varshney -- Add Debrief Declined
          if (event.Task_Status == 'Debrief Declined') {
            element.addClass("declinedEvent");
          }
          if (event.Type == 'INTERNAL') {
            element.addClass("internalActivity");
          }
          if (event.type == 'on-call') {
            element.addClass("onCallEvent");
          }
        },
        navLinkDayClick: function (date, jsEvent) {
          $('#calendar').fullCalendar('triggerDayClick');
          $("#calendar").fullCalendar('changeView', 'agendaDay');
          $("#calendar").fullCalendar('gotoDate', date);
        }
      });
    });

    $('#calendar').fullCalendar('option', {
      locale: selectedLanguage
    });
    this.utilityProvider.stopSpinner();
  }

  sideMenuView(user) {
    this.events.publish('user:created', user);
  }

  //get internal and customer type activities only
  setEventArray(response) {
    return new Promise((resolve, reject) => {
      let startDateTime, endDateTime, customerInfo;
      if (response != null && response.length > 0) {
        this.eventsArray = [];
        response.forEach((item) => {
          this.checkEventTimeZone(item).then((res: any) => {
            if (res) {
              let userStartDateTime = res.userStartDateTime;
              let userEndDateTime = res.userEndDateTime;
              if (item.Type == "CUSTOMER") {
                startDateTime = moment(userStartDateTime).format("YYYY-MM-DDTHH:mm:ss");
                endDateTime = moment(userEndDateTime).format("YYYY-MM-DDTHH:mm:ss");
                //formatting only date done by SFB to show multi day event for allDay
                let onlyStartDate = moment(userStartDateTime).format("YYYY-MM-DD");
                let onlyEndDate = moment(userEndDateTime).format("YYYY-MM-DD");
                let startTime = moment(userStartDateTime).format("HH:mm")
                if (onlyStartDate != onlyEndDate) {
                  startDateTime = onlyStartDate;
                  endDateTime = moment(endDateTime).add('days', 1).format("YYYY-MM-DD");
                }
                //let customerInfo = item.Task_Number + "\n" + item.Job_Description + "\n" + item.Customer_Name + "\n" + item.Contact_Name + "\n" + item.Work_Phone_Number + "\n" + item.Mobile_Phone_Number;
                customerInfo;
                if (onlyStartDate != onlyEndDate) {
                  customerInfo = startTime + "###" + " " + "\n" + item.Task_Number + "###" + " " + "\n" + item.Job_Description + " " + "\n" + item.Customer_Name + " " + "\n" + item.Contact_Name + " " + "\n" + item.Work_Phone_Number + " " + "\n" + item.Mobile_Phone_Number;
                } else {
                  customerInfo = item.Task_Number + "   " + "\n" + item.Job_Description + " " + "\n" + item.Customer_Name + " " + "\n" + item.Contact_Name + " " + "\n" + item.Work_Phone_Number + " " + "\n" + item.Mobile_Phone_Number;
                }
                this.eventsArray.push({
                  title: customerInfo,
                  textEscape: true,
                  start: startDateTime,
                  end: endDateTime,
                  Task_Number: item.Task_Number,
                  Task_Status: item.Task_Status,
                  Job_Description: item.Job_Description,
                  Start_Date: moment(userStartDateTime).format("YYYY-MM-DDTHH:mm:ss"),
                  End_Date: moment(userEndDateTime).format("YYYY-MM-DDTHH:mm:ss"),
                  Assigned: item.Assigned,
                  Service_Request: item.Service_Request,
                  Expense_Method: item.Expense_Method,
                  Labor_Method: item.Labor_Method,
                  Travel_Method: item.Travel_Method,
                  Material_Method: item.Material_Method,
                  Duration: item.Duration,
                  Customer_Name: item.Customer_Name,
                  Street_Address: item.Street_Address,
                  City: item.City,
                  State: item.State,
                  Zip_Code: item.Zip_Code,
                  Activity_Id: item.Activity_Id,
                  SR_ID: item.SR_ID,
                  Country: item.Country,
                  Project_Number: item.Project_Number,
                  Charge_Type: item.Charge_Type,
                  Customer_PONumber: item.Customer_PONumber,
                  ResourceId: item.ResourceId,
                  // 11/21/2018 -- Mayur Varshney -- define type of event 
                  Type: item.Type,
                  // 11/21/2018 -- Mayur Varshney -- define status id of job 
                  StatusID: item.StatusID,
                  customerName: item.Customer_Name
                });
                //12/30/2018 -- Mayur Varshney -- Restrict Standalone Jobs
              } else if (item.Type == "INTERNAL") {
                startDateTime = moment(userStartDateTime).format("YYYY-MM-DDTHH:mm:ss");
                endDateTime = moment(userEndDateTime).format("YYYY-MM-DDTHH:mm:ss");
                // 11/22/2018 -- Mayur Varshney -- add job description with internal list
                customerInfo = item.Customer_Name + ((item.Job_Description) ? (' - ' + (item.Job_Description).slice(0, 20)) : '');
                this.eventsArray.push({
                  customerName: item.Customer_Name,
                  title: customerInfo,
                  textEscape: true,
                  start: startDateTime,
                  end: endDateTime,
                  // 01/25/2019 -- Mayur Varshney -- add Start_Date and End_Date to display on calendar modal
                  Start_Date: startDateTime,
                  End_Date: endDateTime,
                  // 11/21/2018 -- Mayur Varshney -- show job description for internal activity and on-call shift 
                  Job_Description: item.Job_Description,
                  // 11/21/2018 -- Mayur Varshney -- define type of event 
                  Type: item.Type
                });
              }
            }
          }).catch((err: any) => {
            this.logger.log(this.fileName, 'setEventArray', 'checkEventTimeZone : ' + JSON.stringify(err));
          });
          resolve(true);
        });
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'setEventArray', JSON.stringify(error));
      return Promise.reject(error);
    });
  }

  //get on-call shift activities only
  setActivityEventArray(response) {
    return new Promise((resolve, reject) => {
      if (response != null && response.length > 0) {
        response.forEach((response) => {
          let startDateTime, endDateTime, userStartDateTime, userEndDateTime;//, currentDate;
          this.checkTimeZone(response).then((res: any) => {
            if (res) {
              userStartDateTime = res.userStartDateTime;
              userEndDateTime = res.userEndDateTime;
              //if end date is null or not defined ,set it to current date + 3 months (90 days approx)
              let afterThreeMonthDate = moment(userStartDateTime).add(90, 'days').format('YYYY-MM-DD');
              let End_Date = response.End_Date ? response.End_Date : afterThreeMonthDate;
              //finding no. of days 
              let duration = moment.duration(moment(End_Date).diff(moment(userStartDateTime)));
              let numberOfDays = parseInt(duration.asDays());
              if (numberOfDays == 0) {
                numberOfDays = 1;
              }
              switch (response.Recurrence_Type) {
                case 'weekly':
                  let skipWeek = false;
                  let j = moment(userStartDateTime).day();
                  let userST = moment(userStartDateTime).format("YYYY-MM-DDTHH:mm:ss");
                  let userET = moment(userEndDateTime).format("YYYY-MM-DDTHH:mm:ss");
                  //let startOfWeek = moment(userST).startOf('isoWeek').isoWeekday(1).format("YYYY-MM-DDTHH:mm:ss");
                  let daysArr = response.Weekdays.split(",");
                  for (let i = 0; i < numberOfDays + 2; i++) {
                    let currentDay = moment(userST).format("ddd");
                    if (daysArr.indexOf(currentDay) > -1) {
                      startDateTime = moment(userST).format("YYYY-MM-DDTHH:mm:ss");
                      let beginningTime = moment(moment(userST).format('HH:mm:ss'), 'HH:mm');
                      let endTime = moment(moment(userET).format('HH:mm:ss'), 'HH:mm');
                      //compare time for showing multiday on-call event
                      if (endTime.isBefore(beginningTime)) {
                        let nextDate = moment(userET).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
                        endDateTime = moment(nextDate).format("YYYY-MM-DDTHH:mm:ss");
                      } else {
                        endDateTime = moment(userET).format("YYYY-MM-DDTHH:mm:ss");
                      }
                      this.eventsArray.push({
                        // 11/22/2018 -- Mayur Varshney -- show comments 
                        title: response.Shift_Label + (response.Comments ? ("\n" + response.Comments) : ''),
                        textEscape: true,
                        start: startDateTime,
                        end: endDateTime,
                        // 01/25/2019 -- Mayur Varshney -- add Start_Date and End_Date to display on calendar modal
                        Start_Date: startDateTime,
                        End_Date: endDateTime,
                        type: response.Shift_Type,
                        customerName: response.Shift_Label,
                        Comments: response.Comments
                      });
                    }
                    //startOfWeek = moment(startOfWeek).add((skipWeek ? (response.Recur_Every == 1 ? 1 : 7 * (response.Recur_Every - 1)) : 1), 'days').format('YYYY-MM-DDTHH:mm:ss');
                    userST = moment(userST).add((skipWeek ? (response.Recur_Every == 1 ? 1 : 7 * (response.Recur_Every - 1) + 1) : 1), 'days').format('YYYY-MM-DDTHH:mm:ss');
                    userET = moment(userET).add((skipWeek ? (response.Recur_Every == 1 ? 1 : 7 * (response.Recur_Every - 1) + 1) : 1), 'days').format('YYYY-MM-DDTHH:mm:ss');
                    j++;
                    if (j % 7 == 0) {
                      skipWeek = true;
                    } else {
                      skipWeek = false;
                    }
                    if (moment(userST, 'YYYY-MM-DD').isAfter(moment(response.End_Date, 'YYYY-MM-DD'))) {
                      break;
                    }
                  }
                  break;
                default:
                  for (let i = 0; i < numberOfDays + 2; i++) {
                    startDateTime = userStartDateTime;
                    //compare time for showing multiday on-call event
                    let beginningTime = moment(userStartDateTime, 'YYYY-MM-DDTHH:mm:ss');
                    let endTime = moment(userEndDateTime, 'YYYY-MM-DDTHH:mm:ss');
                    if (endTime.isBefore(beginningTime)) {
                      let nextDate = moment(userEndDateTime).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
                      endDateTime = moment(nextDate).format("YYYY-MM-DDTHH:mm:ss");
                    } else {
                      endDateTime = moment(userEndDateTime).format("YYYY-MM-DDTHH:mm:ss");
                    }
                    this.eventsArray.push({
                      // 11/22/2018 -- Mayur Varshney -- show comments 
                      title: response.Shift_Label + (response.Comments ? ("\n" + response.Comments) : ''),
                      textEscape: true,
                      start: startDateTime,
                      end: endDateTime,
                      // 01/25/2019 -- Mayur Varshney -- add Start_Date and End_Date to display on calendar modal
                      Start_Date: startDateTime,
                      End_Date: endDateTime,
                      type: response.Shift_Type,
                      customerName: response.Shift_Label,
                      Comments: response.Comments
                    });
                    userStartDateTime = moment(userStartDateTime).add((response.Recur_Every ? response.Recur_Every : 1), 'days').format('YYYY-MM-DDTHH:mm:ss');
                    userEndDateTime = moment(userEndDateTime).add((response.Recur_Every ? response.Recur_Every : 1), 'days').format('YYYY-MM-DDTHH:mm:ss');
                    if (moment(userStartDateTime, 'YYYY-MM-DD').isAfter(moment(response.End_Date, 'YYYY-MM-DD'))) {
                      break;
                    }
                  }
                  break;
              }
            } else {
              this.logger.log(this.fileName, 'setActivityEventArray', 'error in getting response from checkTimeZone');
            }
            resolve(true);
          }).catch((error: any) => {
            this.logger.log(this.fileName, 'setActivityEventArray', error);
          });
        });
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'setActivityEventArray', error);
      return Promise.reject(error);
    });
  }

  checkTimeZone(response) {
    let userStartDateTime, userEndDateTime
    // 01/30/2019 -- Mayur Varshney -- get timeZoneIANA from tables, no need to convert it now
    let userTimeZone = this.valueProvider.getUser().timeZoneIANA;
    return new Promise((resolve, reject) => {
      let dateTime = {};
      // 12-27-2018 -- Mayur Varshney -- fixes for timezone check
      let startDT = moment(response.Start_Date + ' ' + response.Work_Time_Start).format("YYYY-MM-DDTHH:mm:ss");
      let endDT = moment(response.Start_Date + ' ' + response.Work_Time_End).format("YYYY-MM-DDTHH:mm:ss");
      if (userTimeZone == this.userPreferredTimezone) {
        userStartDateTime = startDT;
        userEndDateTime = endDT;
      } else {
        let convertedStartDateTime = moment.tz(startDT, "YYYY-MM-DD HH:mm:ss", userTimeZone).format();
        let convertedEndDateTime = moment.tz(endDT, "YYYY-MM-DD HH:mm:ss", userTimeZone).format();
        userStartDateTime = moment(convertedStartDateTime).tz(this.userPreferredTimezone).format("YYYY-MM-DDTHH:mm:ss");
        userEndDateTime = moment(convertedEndDateTime).tz(this.userPreferredTimezone).format("YYYY-MM-DDTHH:mm:ss");
      }
      dateTime['userStartDateTime'] = userStartDateTime;
      dateTime['userEndDateTime'] = userEndDateTime;
      resolve(dateTime);
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getTask', 'Error in getTask : ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }

  // 01/30/2019 -- Mayur Varshney -- Optimise code as we are getting all date and time in UTC
  checkEventTimeZone(response) {
    // 01/30/2019 -- Mayur Varshney -- get timeZoneIANA from tables, no need to convert it now
    let userTimeZone = this.valueProvider.getUser().timeZoneIANA;
    return new Promise((resolve, reject) => {
      let dateTime = {};
      let finalTimeZone = (userTimeZone == this.userPreferredTimezone) ? userTimeZone : this.userPreferredTimezone;
      let userStartDateTime = moment(response.Start_Date).tz(finalTimeZone).format("YYYY-MM-DDTHH:mm:ss");
      let userEndDateTime = moment(response.End_Date).tz(finalTimeZone).format("YYYY-MM-DDTHH:mm:ss");
      dateTime['userStartDateTime'] = userStartDateTime;
      dateTime['userEndDateTime'] = userEndDateTime;
      resolve(dateTime);
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getTask', 'Error in getTask : ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }

  /**
   *  11/21/2018 -- Mayur Varshney --show details for particular job/activity in separate modal
   * @params -- passing whole event as a param 
   */
  openCalendarInfo(event) {
    let self = this;
    let params = {
      'eventData': event,
      'customerName': event.customerName
    }
    self.utilityProvider.stopSpinner();
    let calendarModal = this.utilityProvider.showModal('CalendarModalPage', params, { enableBackdropDismiss: false, cssClass: 'CalendarModalPage' });
    calendarModal.onDidDismiss(value => {
      if (value) {
        self.utilityProvider.showSpinner();
        if (event.StatusID == Enums.Jobstatus.Completed_Awaiting_Review) {
          self.navCtrl.push('SummaryPage', { ifCompleted: true, page: "calender" });
          self.valueProvider.setResourceId(event.ResourceId);
          self.valueProvider.setTaskId(event.Task_Number);
          self.valueProvider.setIsCustomerSelected(false);
          self.valueProvider.setIsSummarySelected(false);
        } else {
          self.navCtrl.push('FieldJobOverviewPage', { page: "calender" });
          self.valueProvider.setResourceId(event.ResourceId);
          self.valueProvider.setTaskId(event.Task_Number);
          self.sideMenuView("Debrief");
        }
        self.utilityProvider.stopSpinner();
      }
    });
    calendarModal.present().catch((err) => {
      this.logger.log(this.fileName, 'openCalendarInfo', JSON.stringify(err));
    });
  }
  /**
   *@author: Prateek(21/01/2019)
   *Unsubscribe all events.
   *Optimization
   * @memberof CalendarPage
   */
  ionViewWillLeave() {
    this.events.unsubscribe("refreshPageData");
    this.events.unsubscribe("langSelected");
    this.events.unsubscribe("refreshPreferences");
  }
}
