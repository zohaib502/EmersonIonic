import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoggerProvider } from '../../../providers/logger/logger';
import * as moment from 'moment';
import * as Enums from '../../../enums/enums';

@IonicPage()
@Component({
  selector: 'page-calendar-modal',
  templateUrl: 'calendar-modal.html',
})
export class CalendarModalPage {

  fileName: any = 'Calendar_Modal';
  eventData: any;
  enums: any;
  Moment: any = moment;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public logger: LoggerProvider) {
    this.enums = Enums;
    this.eventData = this.navParams.get('eventData');
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  goToJobDetails() {
    this.viewCtrl.dismiss(true);
  }

}
