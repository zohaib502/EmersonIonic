import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoggerProvider } from '../../../providers/logger/logger';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-admin-feedbackdetail',
  templateUrl: 'admin-feedbackdetail.html',
})
export class AdminFeedbackdetailPage {

  questions: any;
  userFeedback: any = {};
  ifAvgRating: any;
  fiveStarCount: any;
  fourStarCount: any;
  threeStarCount: any;
  twoStarCount: any;
  oneStarCount: any;
  fiveRating: any = 5;
  fourRating: any = 4;
  threeRating: any = 3;
  twoRating: any = 2;
  oneRating: any = 1;
  userFeedbackList: any[] = [];
  fileName: any = 'Admin_Feedback';
  Moment:any=moment
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public logger: LoggerProvider) {
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.questions = this.navParams.get('questionList');
    this.userFeedback = this.navParams.get('userFeedback');
    this.ifAvgRating = this.navParams.get('ifAvgRating');
    this.fiveStarCount = this.navParams.get('fiveStarCount');
    this.fourStarCount = this.navParams.get('fourStarCount');
    this.threeStarCount = this.navParams.get('threeStarCount');
    this.twoStarCount = this.navParams.get('twoStarCount');
    this.oneStarCount = this.navParams.get('oneStarCount');
    this.userFeedbackList = this.navParams.get('userFeedbackList');
  }

  setFeedbackList(value) {
    this.userFeedbackList = this.userFeedbackList.filter((item: any) => {
      return item.RATING == value;
    });
    
    this.viewCtrl.dismiss(this.userFeedbackList);
  }

}
