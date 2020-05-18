import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { LoggerProvider } from '../../providers/logger/logger';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { ValueProvider } from '../../providers/value/value';
import { UtilityProvider } from '../../providers/utility/utility';
// import { SyncProvider } from '../../providers/sync/sync';
import { SubmitProvider } from '../../providers/sync/submit/submit';

import * as moment from "moment";

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  fileName: any = 'User_Feedback';
  header_data: any;
  username: any;
  email: any;
  questions: any[] = [];
  userFeedback: any = {};
  userComments: any;

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, public logger: LoggerProvider, public localProvider: LocalServiceProvider, 
    public valueProvider: ValueProvider, public utilityProvider: UtilityProvider, public submitProvider: SubmitProvider) {
    this.header_data = { title1: "", title2: "User Feedback", taskId: "" };
  }

  ionViewDidLoad() {
    this.getFeedbackQuestions();
    let index = this.navCtrl.getActive().index;
    // this.logger.log(this.fileName, 'ionViewDidEnter', "index" + index);
    if (index % 2 == 0) {
      for (let i = index; i > 1; i--) {
        index = index - 1;
      }
      this.navCtrl.remove(index, 1);
    }
    if (index % 3 == 0) {
      for (let i = index; i > 1; i--) {
        index = index - 1;
      }
      this.navCtrl.remove(index, 2);
    }
  }

  ionViewDidEnter() {
    this.events.publish('user:created', "Feedback");
  }

  saveRating() {
    //09/06/2018 START kamal : for future use only if dynamic questions are required
    this.userFeedback.QID = 1;
  }

  getFeedbackQuestions() {
    this.localProvider.getFeedbackQuestions().then((res: any[]) => {
      this.questions = res;
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getFeedbackQuestions', 'Error in getFeedbackQuestions : ' +JSON.stringify(error));
    });
  }

  submitFeedback() {
    // 09/06/2018 kamal - changed user email to lowercase 
    // let userMail = this.valueProvider.getUser().Email;
    // this.userFeedback.User_Email = userMail.toLowerCase();
    // this.userFeedback.Feedback_Date = moment().format("MM-DD-YYYY HH:mm:ss");
    // this.userFeedback.Resource_Id = this.valueProvider.getResourceId();
    // this.userFeedback.Comments = this.userComments;
    // this.userFeedback.Sync_Status = 'false';
    // 09/14/2018 START kamal : for future use only if dynamic questions are required
    // this.userFeedback.QId = 1;

    let userMail = this.valueProvider.getUser().Email;
    let uniqueKey = this.utilityProvider.getUniqueKey();
    // let userId = this.valueProvider.getUserId();

    this.userFeedback.USER_EMAIL  = userMail.toLowerCase(), 
    this.userFeedback.ID = uniqueKey.toString(); 
    this.userFeedback.QID = "1", 
    this.userFeedback.RESOURCE_ID = this.valueProvider.getResourceId(), 
    this.userFeedback.USER_LOCATION = null, 
    this.userFeedback.COMMENTS = this.userComments, 
    this.userFeedback.FEEDBACK_DATE = this.localProvider.getCurrentDate(), 
    this.userFeedback.REVIEW_DATE = null, 
    this.userFeedback.REVIEWED_BY = null, 
    this.userFeedback.IS_REVIEWED = null, 
    this.userFeedback.CREATEDBY = this.valueProvider.getUserId(), 
    this.userFeedback.CREATEDON = this.localProvider.getCurrentDate(), 
    this.userFeedback.MODIFIEDBY = this.valueProvider.getUserId(), 
    this.userFeedback.MODIFIEDON = this.localProvider.getCurrentDate()
    // this.userFeedback.Sync_Status = "false" 
    // this.userFeedback.RATING = 3; 
    
    if (!this.userFeedback.RATING) {
      this.utilityProvider.presentToast('Please enter the rating before submit!!!', 2000, 'top', 'feedbackToast');
    } else {
      // this.logger.log(this.fileName, 'submitFeedback', 'userfeedback data : ' + this.userFeedback.length);
      this.localProvider.saveFeedback(this.userFeedback).then((res: any) => {
        // this.userFeedback.ID = res;
        if (this.utilityProvider.isConnected() == true) {
          this.utilityProvider.showSpinner();
          // this.logger.log(this.fileName, 'submitFeedback', 'userfeedback data : ' + this.userFeedback.length);
          let feedbackArr = [];
          feedbackArr.push(this.userFeedback);
          this.submitProvider.submitFeedbacks(feedbackArr, false).then((res: any) => {
            this.logger.log(this.fileName, 'submitFeedback', "data is submitted to MCS storage successful");
            this.userFeedback.RATING = "";
            this.userComments = "";
            this.userFeedback.ID = "";
            this.userFeedback.id = "";
            this.getUserFeedback().then(() => {
              this.utilityProvider.stopSpinner();
              this.utilityProvider.presentToast('Your feedback is submitted', 2000, 'top', 'feedbackToast');
            }).catch((err : any)=> {
              this.utilityProvider.stopSpinner();
              this.logger.log(this.fileName, 'submitFeedback', "Error to submitted to MCS storage" + JSON.stringify(err))
            });

          }).catch((error: any) => {
            this.utilityProvider.stopSpinner();
            this.logger.log(this.fileName, 'submitFeedback', 'Error in submitFeedback : ' + JSON.stringify(error));
          });
        } else {
          this.userFeedback.RATING = "";
          this.userComments = "";
          this.userFeedback.ID = "";
          this.userFeedback.id = "";
          this.utilityProvider.presentToast('Your feedback is submitted', 2000, 'top', 'feedbackToast');
        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'submitFeedback', 'Error in submitFeedback : ' + JSON.stringify(error));
      });
    }
  }

  getUserFeedback() {
    this.utilityProvider.showSpinner();
    return new Promise((resolve, reject) => {
      this.localProvider.getUserFeedback().then((res: any[]) => {
        this.valueProvider.setUserFeedback(res);
        resolve(null);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getUserFeedback', 'Error in getUserFeedback : ' +JSON.stringify(error));
      });
    });
  }

  //check character limit for description , should be less than 255 / Mayur
  _keyPressInText(event: any) {
    if (event.target.textLength > 254) {
      event.preventDefault();
    }
  }

}
