import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { ValueProvider } from '../../providers/value/value';
import { SyncProvider } from '../../providers/sync/sync';
import { UtilityProvider } from '../../providers/utility/utility';
import * as moment from 'moment';
import { SearchPipe } from '../../pipes/search/search';

import { LoggerProvider } from '../../providers/logger/logger';

import { CloudService } from '../../providers/cloud-service/cloud-service';


@IonicPage()
@Component({
  selector: 'page-admin-feedback',
  templateUrl: 'admin-feedback.html',
})
export class AdminFeedbackPage {

  questionList: any = [];
  userFeedbackList: any = [];
  allUserFeedbackList: any = [];
  feedbackTodayLimit: any = 5;
  feedbackLimit: any = 100;
  header_data: any;
  currentDate = moment().format("YYYY-MM-DD");
  taskInput: string = '';
  feedbackOrderBy: any = '';
  feedbackReverseSort: any = false;
  averageRating: any;
  commentLength: any;
  fiveStarCount: any;
  fourStarCount: any;
  threeStarCount: any;
  twoStarCount: any;
  oneStarCount: any;
  headLine: any = 'Latest Comments';
  fileName: any = 'Admin_Feedback';
  Moment: any = moment;
  sortDateParam: boolean = true;


  constructor(public valueProvider: ValueProvider, public syncProvider: SyncProvider,
    public searchPipe: SearchPipe, public navCtrl: NavController, public navParams: NavParams,
    public events: Events, public localService: LocalServiceProvider, public utilityProvider: UtilityProvider,
    public logger: LoggerProvider, public cloudService: CloudService) {
    this.header_data = { title1: "", title2: "Field Service Admin", taskId: "" };
    //this.userFeedbackList= [];
    events.subscribe('refreshPageData', (obj) => {
      this.getlatestFeedback();
      this.getUserFeedback().then(() => {
        if (this.feedbackTodayLimit > 5) {
          this.setFullLimit('feedbackTodayLimit', { FEEDBACK_DATE: this.currentDate });
        }
        this.utilityProvider.stopSpinner();
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'constructor', 'Error in constructor : ' + JSON.stringify(error));
      });
    });
  }

  ionViewDidLoad() {
    this.getFeedbackQuestions();
    this.getUserFeedback();
  }

  ionViewDidEnter() {
    this.events.publish('setPage', "Admin Feedback");
    this.getlatestFeedback()
  }

    /**
   * Calculates the Average Rating for feedback comments retrieved from MCS
   */
  getAverageRating() {
    let sum = 0;
    for (let i = 0; i < this.userFeedbackList.length; i++) {
      sum += parseInt(this.userFeedbackList[i].RATING, 10); //don't forget to add the base 
    }
    let avg = sum / this.userFeedbackList.length;
    this.averageRating = avg;
  }

  /**
   * Calculates the total number of feedback comments retrieved from MCS
   */
  getCommentLength() {
    let count = 0;
    for (let i = 0; i < this.userFeedbackList.length; i++) {
      if (this.userFeedbackList[i].COMMENTS == null) {
      }
      else {
        count++;
      }
    }
    this.commentLength = count;
  }

   /**
   *Gets all the Feedback details from MCS
   */
  private async getUserFeedback() {
    let result: boolean = false;
    try {
      await this.cloudService.getFeedbacks().then((response: any) => {
        if (response.length > 0) {
          this.userFeedbackList = response;
          console.log("response Data"+JSON.stringify(response));
          this.userFeedbackList.sort((a, b) => new Date(b.FEEDBACK_DATE).getTime() - new Date(a.FEEDBACK_DATE).getTime());
          this.allUserFeedbackList = response;
          this.getCommentLength();
          this.getAverageRating();
          result = true;
        }
      }).catch((error: any) => {
        
        if(error.data && error.data.error){
          this.utilityProvider.displayErrors([{ "errMsg":error.data.error}]);
        }
      });
    } catch (error) {
      this.logger.log(this.fileName, 'getUserFeedback', 'Error in getUserFeedback : ' + JSON.stringify(error));
      if(error.data && error.data.error){
        this.utilityProvider.displayErrors([{ "errMsg":error.data.error}]);
      }
    } finally {
      return result;
    }


  }
  /**
   * Sorts the Feedback comments in descending order
   */

  getlatestFeedback() {
    this.headLine = '';
    this.feedbackOrderBy = '';
    this.feedbackReverseSort = false;
    this.headLine = 'Latest Comments'; 
    if(this.userFeedbackList.length > 0){
    this.userFeedbackList.sort((a, b) => new Date(b.FEEDBACK_DATE).getTime() - new Date(a.FEEDBACK_DATE).getTime());
    }
    this.feedbackTodayLimit = 5;
  }

  /**
   * This method is used to list all the reviews & feeback comments
   * @param limitParamName 
   * @param criteria 
   */

  seeAll(limitParamName, criteria) {
    this.headLine = 'All Comments';
    this.userFeedbackList = this.allUserFeedbackList;
    this.getCommentLength();
    this.getAverageRating();
    this.feedbackOrderBy = '';
    this.feedbackReverseSort = false;
    this[limitParamName] = this.searchPipe.transform(this.searchPipe.transform(this.userFeedbackList, this.taskInput), criteria).length;
  }

  /**
   * To get the feedback question
   */

  getFeedbackQuestions() {
    this.localService.getFeedbackQuestions().then((res: any[]) => {
      this.questionList = res;
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getFeedbackQuestions', 'Error in getFeedbackQuestions : ' + JSON.stringify(error));
    });
  }

  /**
   * To get the count of the stars given for each review
   * @param number 
   */
  getStarCount(number) {
    let strCount = 0;
    for (let i = 0; i < this.userFeedbackList.length; i++) {
      if (this.userFeedbackList[i].RATING == number) {
        strCount++;
      }
    }
    return strCount;
  }
  /**
   * This method is used to display all the review ratings
   */

  openAvgRatingModal() {
    this.userFeedbackList = this.allUserFeedbackList;
    this.fiveStarCount = this.getStarCount(5);
    this.fourStarCount = this.getStarCount(4);
    this.threeStarCount = this.getStarCount(3);
    this.twoStarCount = this.getStarCount(2);
    this.oneStarCount = this.getStarCount(1);
    this.getCommentLength();
    this.getAverageRating();
    let params = { fiveStarCount: this.fiveStarCount, fourStarCount: this.fourStarCount, threeStarCount: this.threeStarCount, twoStarCount: this.twoStarCount, oneStarCount: this.oneStarCount, ifAvgRating: true, userFeedbackList: this.allUserFeedbackList };
    let feedbackModal = this.utilityProvider.showModal("AdminFeedbackdetailPage", params, { enableBackdropDismiss: false, cssClass: 'AverageRatingModalPage' });
    feedbackModal.onDidDismiss(data => {
      if (data != undefined) {
        this.userFeedbackList = data;
        this.getCommentLength();
        this.getAverageRating();
      }
    });
    feedbackModal.present();
  }

  /**
   * This method is used to open the Feedback/review modal window
   * @param userFeedback 
   */
  openDetailModal(userFeedback) {
    let params = { questionList: this.questionList, userFeedback: userFeedback, ifAvgRating: false };
    let feedbackModal = this.utilityProvider.showModal("AdminFeedbackdetailPage", params, { enableBackdropDismiss: false, cssClass: 'FeedbackDetailModalPage' });
    feedbackModal.present();
    if (!userFeedback.IS_REVIEWED || userFeedback.IS_REVIEWED == "false") {
      userFeedback.IS_REVIEWED = "true";
      userFeedback.REVIEWED_BY = this.valueProvider.getUser().Name;
      let reviewFeedback= [];
      reviewFeedback.push(userFeedback);
      this.cloudService.submitFeedback(reviewFeedback).then(() => {
        this.logger.log(this.fileName, 'openDetailModal', 'Submitted Data as reviewFeedback'+JSON.stringify(reviewFeedback));
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'openDetailModal', 'Error in openDetailModal : ' + JSON.stringify(error));      
        this.utilityProvider.displayErrors(error);
      });
    }
  }


  /**
   *@author: Prateek 18/01/2019
   *Click button event to sort date in accending and decending order
   * 
   */
  sortDate() {
    if (this.sortDateParam == true) {
      this.userFeedbackList.sort((a, b) => {
        
        return moment.utc(moment(a.FEEDBACK_DATE, "MM-DD-YYYY HH:mm:ss").format()).diff(moment.utc(moment(b.FEEDBACK_DATE, "MM-DD-YYYY HH:mm:ss").format()))
      });
      this.sortDateParam = false
    }
    else {
      this.userFeedbackList.sort((a, b) => {
        return moment.utc(moment(b.FEEDBACK_DATE, "MM-DD-YYYY HH:mm:ss").format()).diff(moment.utc(moment(a.FEEDBACK_DATE, "MM-DD-YYYY HH:mm:ss").format()))
      });
      this.sortDateParam = true;
    }
  }

  setFullLimit(limitParamName, criteria) {
    this[limitParamName] = this.searchPipe.transform(this.searchPipe.transform(this.userFeedbackList, this.taskInput), criteria).length;
  }
}
