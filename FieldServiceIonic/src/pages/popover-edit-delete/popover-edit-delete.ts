import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, App, ViewController } from 'ionic-angular';
import { ValueProvider } from '../../providers/value/value';
import { UtilityProvider } from '../../providers/utility/utility';
import { LocalServiceProvider } from '../../providers/local-service/local-service';

/**
 * Generated class for the PopoverEditDeletePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover-edit-delete',
  templateUrl: 'popover-edit-delete.html',
})
export class PopoverEditDeletePage {
  public timeData: any = [];
  public totalDuration: any;
  public nonClarityPage: any;
  weekBtnClicked: boolean = false;
  public weekStart: any;
  public weekEnd: any;
  public delWeekStarts: any;
  public delWeekEnds: any;

  constructor(public navCtrl: NavController, public valueProvider: ValueProvider,
    public navParams: NavParams, public appCtrl: App, public viewCtrl: ViewController,
    public utilityProvider: UtilityProvider, public events: Events,
    private localService: LocalServiceProvider) {

    this.timeData = this.navParams.get('timeData');
    this.weekBtnClicked = this.navParams.get('weekBtnClicked');
    this.totalDuration = this.navParams.get('totalDuration');
    // Identify Non-clarity page
    this.nonClarityPage = this.navParams.get('nonClarityPage');
    this.delWeekStarts = this.navParams.get('delWeekStarts');
    this.delWeekEnds = this.navParams.get('delWeekEnds');
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverEditDeletePage');
  }
  /**
      * Preeti Varshney 03/12/2019
      * open edit time entry page
     */
  editpage() {
    this.viewCtrl.dismiss();
    setTimeout(() => {
      if (this.valueProvider.getUser().ClarityID != '') {
        this.appCtrl.getRootNav().setRoot("ClarityTimeEntryPage", { weekStart: this.utilityProvider.WeekStart, weekEnd: this.utilityProvider.weekEnd });
      } else {
        this.appCtrl.getRootNav().setRoot("NonClarityEditTimeEntryPage", { timeData: this.timeData, weekBtnClicked: this.weekBtnClicked, nonClarityPage: this.nonClarityPage, taskId: this.timeData.Job_Number, delWeekStarts: this.delWeekStarts, delWeekEnds: this.delWeekEnds });
      }
    }, 500);
  }

  /*
  * Narsimha Sanapala 04/12/2019
  * TODO:: Delete time entry functionality
  */
  deleteTimeEntry() {
    this.viewCtrl.dismiss();
    let alertMessage = "";
    if (this.weekBtnClicked == true) {
      alertMessage = "You are about to delete the time entries associated with " + this.delWeekStarts + " to " + this.delWeekEnds + " of the week. Are you sure you want to proceed?";
      //  alertMessage = "You are about to delete the week from " + this.delWeekStarts + " to " + this.delWeekEnds + ". Are you sure?";
    } else {
      alertMessage = "Are you sure you want to Delete this time entry?";
    }
    let alert = this.utilityProvider.confirmationAlert('Alert', alertMessage);
    alert.present();
    alert.onDidDismiss((response) => {
      if (response) {
        this.deleteTimeEntries();
        this.timeRedirect();
      }
    });
  }

  deleteTimeEntries() {
    // Preeti Varshney 04/26/2019 expand All is false initially
    let timeData = this.timeData.days ? this.timeData.days : [this.timeData.Time_Id];
    let timeIds = [];
    if (timeData.length == 7) {
      timeIds = timeData.map(time => time.Time_Id).filter(time => (time !== "" && time !== undefined));
    } else {
      timeIds = timeData;
    }
    if (timeIds.length) {
      this.localService.deleteBulkTimeObject(timeIds);
    }
  }

  timeRedirect() {
    let data = { type: 'deleteTimeEntry', setTaskId: 'true' };
    if (this.nonClarityPage) {
      this.events.publish("setWeekDay", data);
    }
    else {
      this.events.publish("deleteFromDebrief", data);
      // this.appCtrl.getRootNav().setRoot("DebriefPage", { save: "true", taskid: taskId });
    }
  }

}
