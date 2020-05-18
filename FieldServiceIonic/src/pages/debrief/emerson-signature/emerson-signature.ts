import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { ValueProvider } from '../../../providers/value/value';
import { DatabaseProvider } from '../../../providers/database/database';
import { LoggerProvider } from '../../../providers/logger/logger';
import moment from 'moment';
import * as Enums from '../../../enums/enums';

@IonicPage()
@Component({
  selector: 'page-emerson-signature',
  templateUrl: 'emerson-signature.html',
})
export class EmersonSignaturePage {

  taskId: any = this.valueService.getTaskId();
  resourceId: any = this.valueService.getResourceId();
  enableSummary: boolean = true;
  fileName: any = 'Emerson_Signature';
  dateFormat: any;
  engineerObject: any = {
    Engineer_Id: this.taskId,
    followUp: false,
    salesQuote: false,
    salesVisit: false,
    salesLead: false,
    Follow_Up: "",
    Spare_Quote: "",
    Sales_Visit: "",
    Sales_Head: "",
    Sign_File_Path: "",
    File_Name: "",
    Cust_Sign_File: "",
    isCustomerSignChecked: false,
    customerComments: "",
    Engg_Sign_Time: "",
    Cust_Sign_Time: "",
    Task_Number: this.taskId.toString()
  };
  Moment: any = moment;
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  public signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 1440,
    'canvasHeight': 200
  };
  enums: any;
  _taskObj: any;

  constructor(public navCtrl: NavController, private valueService: ValueProvider, public localService: LocalServiceProvider, public dbCtrl: DatabaseProvider, public logger: LoggerProvider, public events: Events) {
    this.enums = Enums;
    this._taskObj = this.valueService.getTask();
  }

  gottoNotes() {
    this.navCtrl.parent.select(4);
  }

  gottoSummary() {
    this.navCtrl.parent.select(6);
  }

  ionViewDidEnter() {
    //11/04/2019 -- Mayur Varshney -- apply condition if viewCtrl relates to SDRTabsPage or DebriefPage
    if (this.navCtrl.parent.viewCtrl.id != "DebriefPage") return;
    this.drawClear();
    this.taskId = this.valueService.getTaskId();
    if (this.valueService.getUserPreferences()[0]) {
      this.dateFormat = this.valueService.getUserPreferences()[0].Date_Format;
    }
    this.getEngineer();
  }
  //Other Functions

  getEngineer() {
    let self = this;
    this.localService.getEngineer(this.taskId).then((res) => {
      if (res != undefined) {
        this.engineerObject = res;
        this.engineerObject.followUp = (this.engineerObject.followUp == 'true');
        this.engineerObject.salesQuote = (this.engineerObject.salesQuote == 'true');
        this.engineerObject.salesVisit = (this.engineerObject.salesVisit == 'true');
        this.engineerObject.salesLead = (this.engineerObject.salesLead == 'true');
        this.engineerObject.isCustomerSignChecked = (this.engineerObject.isCustomerSignChecked == 'true');
      }
      this.drawClear();
    }).catch((error: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      self.logger.log(self.fileName, 'getEngineer', 'Error in getEngineer, getEngineer local service : ' + JSON.stringify(error));
    });
  }

  submitsignature() {
    let self = this;
    if (!this.enableSummary) {
      this.engineerObject.Sign_File_Path = this.signaturePad.toDataURL();
      this.localService.saveEngineer(this.engineerObject).then((res: any[]) => {
        this.valueService.setEngineer(this.engineerObject);
        this.gottoSummary();
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        self.logger.log(self.fileName, 'submitsignature', 'Error in submitsignature, insertEngineerList local service : ' + JSON.stringify(error));
      });
    }
  }

  drawClear() {
    this.engineerObject.Engg_Sign_Time = '';
    this.engineerObject.Sign_File_Path = '';
    this.signaturePad.clear();
    this.enableSummary = true;
  }

  updateEnggTime() {
    this.engineerObject.Engg_Sign_Time = new Date();
    this.enableSummary = false;
  }

  clearSalesLead() {
    this.engineerObject.Sales_Head = "";
  }

  clearfollowUp() {
    this.engineerObject.Follow_Up = "";
  }

  clearSalesVisit() {
    this.engineerObject.Sales_Visit = "";
  }

  clearSpareQuote() {
    this.engineerObject.Spare_Quote = "";
  }

  //check character limit for description , should be less than 500 / Mayur
  _keyPressInText(event: any) {
    if (event.target.textLength > 499) {
      event.preventDefault();
    }
  }

  /** 
   * @author Gurkirat Singh
   * 03-28-2019 Gurkirat Singh : Publish an event to navigate to SDR Flow
   *
   * @memberof EmersonSignaturePage
   */
  gotoSDR() {
    this.events.publish("gotoSDR");
  }

}
