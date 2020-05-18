import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import * as moment from "moment";
import { ValueProvider } from '../../../providers/value/value';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../providers/logger/logger';
import { UtilityProvider } from '../../../providers/utility/utility';

@IonicPage()

@Component({
  selector: 'page-comment-modal',
  templateUrl: 'comment-modal.html',
})
export class CommentModalPage implements OnInit {
  fileName: any = 'Comment_Modal_Page';
  dayList: any = [];
  project: any = [];
  dataObject: any = [];
  clarityUser: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public events: Events, public valueProvider: ValueProvider, public localService: LocalServiceProvider, public logger: LoggerProvider, public utilityProvider: UtilityProvider) {
    this.project = this.navParams.get('project');
    if (this.valueProvider.getUser().ClarityID != '') {
      this.clarityUser = true;
    }
  }
  ngOnInit() {
    this.Listdays();

  }
  Listdays() {
    for (let i = 0; i < this.project.days.length; i++) {
      if (this.project.days[i].notes != "" || this.project.days[i].notes != undefined) {
        this.dayList.push({
          "Comments": this.project.days[i].notes,
          "dayName": this.project.days[i].dayName,
          'duration': this.project.days[i].duration,
          'entryDate': this.project.days[i].entryDate,
          "Time_Id": this.project.days[i].Time_Id,
        });
      }
    }
  }
 
  public closeModal() {
    this.viewCtrl.dismiss();
  }

  changeNotes(event, Time_Id) {
    for (let i = 0; i < this.dayList.length; i++) {
      if (this.dayList[i].Time_Id == Time_Id) {
        this.dayList[i].Comments=(event.value).trim();
      }
    }
  }
  save() {
    let dataObject =[];
    for (let i = 0; i < this.dayList.length; i++) {
      if (this.dayList[i].Time_Id !="" && this.dayList[i].Time_Id != undefined) {
         dataObject.push({
          Comments:this.dayList[i].Comments,
          Time_Id:this.dayList[i].Time_Id,
          DB_Syncstatus: "false"
         });
      }
    }
    this.localService.updateTimeComments(dataObject).then((res): any => {
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'save' ,' Error in updateTimeBatch : '+ JSON.stringify(error));
    });

    //04/22/2019 Preeti Varshney refresh data after saving comments
    let value = { type: "showWeekWise" ,weekBtnClicked:true,dayBtnClicked:false};
    this.events.publish("setWeekDay", value);
    this.viewCtrl.dismiss();
  }
  cancel() {
    this.viewCtrl.dismiss();
  }
  getFomatedDate(date) {
    let _date = moment(date).format('DD-MMM-YYYY');
    return _date;
  }
}