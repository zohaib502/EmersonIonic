import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
import { NavParams, Events } from 'ionic-angular';
/**
 * Generated class for the TimeDurationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'time-duration',
  templateUrl: 'time-duration.html'
})
export class TimeDurationComponent implements OnInit {
  Start_Time;
  End_Time;
  duration;
  isDateError: boolean = false;
  presentDate: any = "";
  hours: any = "";
  text: string;

  constructor(public navParams: NavParams, public events: Events) {
    this.presentDate = this.navParams.get('date');
  }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.setDefaultTimeObject();

  }
  /**
   * Preeti Varshney 03/12/2019
   * Set default time to 00:00 in start time and end time
   */
  setDefaultTimeObject() {
    let initialStartAndEnd = new Date();
    initialStartAndEnd.setHours(0);
    initialStartAndEnd.setMinutes(0);
    this.Start_Time = initialStartAndEnd;
    this.End_Time = initialStartAndEnd;
    let initialDurartion = new Date();
    initialDurartion.setHours(8);
    initialDurartion.setMinutes(0);
    this.duration = moment(initialDurartion).format('HH:mm');
  }
  /**
 * Preeti Varshney 03/12/2019
 * Interlinked condition with start time and end time.
 */
  getTimeOnChange(item, type) {
    if (item == null) {
      this.End_Time = this.getTimeDuration(0, 0);
      return;
    }
    this[type] = moment(item).format('HH:mm');
    let startTime = this.formatDateTime(this.presentDate, this.Start_Time);
    let endTime = this.formatDateTime(this.presentDate, this.End_Time);
    switch (type) {
      case 'Start_Time':

        if (moment(startTime).isSameOrAfter(endTime)) {
          let d = new Date();
          d.setHours(this.Start_Time.split(":")[0]);
          d.setMinutes(this.Start_Time.split(":")[1]);
          this.End_Time = d;
        }
        else {
          this.getDuration(startTime, endTime);
        }
        break;
      case 'End_Time':
        if (moment(startTime).isAfter(endTime)) {
          let d = new Date();
          d.setHours(this.End_Time.split(":")[0]);
          d.setMinutes(this.End_Time.split(":")[1]);
          this.Start_Time = d;
        }
        let startTimes = this.formatDateTime(this.presentDate, this.Start_Time);
        let endTimes = this.formatDateTime(this.presentDate, this.End_Time);
        this.onDateTimeComparison(startTimes, endTimes);
        break;
    }
  }

  /**
* Preeti Varshney 03/12/2019
* set time based on start time and end time.
*/
  getTimeDuration(value1, value2) {
    let duration = new Date();
    duration.setHours(value1);
    duration.setMinutes(value2);
    return duration;
  }

  /**
* Preeti Varshney 03/12/2019
* Format date time.
*/
  formatDateTime(date, time) {
    let service_date = moment(date).format("YYYY-MM-DD");

    let formatDate = moment(service_date + ' ' + time).format("DD-MM-YYYYTHH:mm");
    let dateTime = moment(formatDate, "DD-MM-YYYYTHH:mm");
    return dateTime;
  }
    /**
   * Preeti Varshney 03/12/2019
   * Calculate Time Duration based on start time and end time
   */

  getDuration(startTime, endTime) {

    let duration = moment.duration(endTime.diff(startTime));
    let hours = duration.asHours();
    let minutes = duration.asMinutes() - hours * 60;
    let hoursToMin = hours * 60;
    let totalTimeInMin = hoursToMin + minutes;
    let updateHours = Math.floor(Math.abs(totalTimeInMin / 60));
    let updateMin = Math.floor(totalTimeInMin % 60);
    if (updateHours <= 9) {
      this.duration = ('0' + updateHours).slice(-2) + ":" + ('0' + +updateMin).slice(-2);
    }
    else {
      this.duration = updateHours + ":" + ('0' + +updateMin).slice(-2);
    }
    if (totalTimeInMin < 0) {
      this.isDateError = true;
    }
    else if (totalTimeInMin > 0) {
      this.isDateError = false;
    }
    else {
      let initialDurartion = this.getTimeDuration(0, 0);
      this.duration = moment(initialDurartion).format('HH:mm');
      this.isDateError = true;
    }
  }


  onDateTimeComparison(startTime, endTime) {
    let startt_Cdate = this.getFormatTime(this.Start_Time);
    let endd_Cdate = this.getFormatTime(this.End_Time);
    let startDuration = this.getTimeDuration(0, 0);
    let defaultTime = moment(startDuration).format('HH:mm');
    let initialDurartion = this.getTimeDuration(8, 0);
    let isSameDate = moment(this.presentDate).isSame(this.presentDate);

    if (this.Start_Time == defaultTime && this.End_Time == defaultTime && isSameDate) {
      this.duration = moment(initialDurartion).format('HH:mm');
      this.isDateError = false;
    }

    if (this.Start_Time == defaultTime && this.End_Time == defaultTime && !isSameDate) {
      this.getDuration(startTime, endTime);
    }
    this.End_Time = (this.End_Time || '');

    if (endd_Cdate < startt_Cdate) {
      this.isDateError = true;
      this.getDuration(startTime, endTime);
    }
    if (this.Start_Time != defaultTime && this.End_Time != defaultTime || this.Start_Time == defaultTime && this.End_Time != defaultTime) {
      if (endd_Cdate < startt_Cdate) {
        this.getDuration(startTime, endTime);
      } else {
        this.isDateError = false;
        this.getDuration(startTime, endTime);
        if (this.duration.toString() == "00:00") {
          this.isDateError = true;
        } else {
          this.isDateError = false;
        }
      }
    }
  };
  getFormatTime(value) {
    let date = new Date();
    date.setHours(value.split(":")[0]);
    date.setMinutes(value.split(":")[1]);
    return date;
  }
  saveDuration() {
    let start_Time = this.Start_Time;
    let end_Time = this.End_Time;
    let duration = this.duration;
    let date = this.presentDate;
    let data = { startTime: start_Time, endTime: end_Time, duration: duration, date: date };
    this.events.publish('TimeDuration', data);
  }
}
