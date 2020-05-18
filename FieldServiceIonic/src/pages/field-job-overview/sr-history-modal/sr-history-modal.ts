import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CloudService } from '../../../providers/cloud-service/cloud-service';
import { LoggerProvider } from '../../../providers/logger/logger';
//import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-sr-history-modal',
  templateUrl: 'sr-history-modal.html',
})
export class SrHistoryModalPage {

  fileName: any = 'SrHistoryModalPage';
  customerId: any;
  customerFieldJobs: any = [{
    'Task_Number': '123456',
    'SR_Number': '1890005235',
    'Start_Date': '20-10-2018',
    'End_Date': '20-10-2018',
    'Task_Status': 'Accepted',
    'Job_Description': 'Caliberation',
    'Street_Address': 'Rajouri Garden',
    'City': 'New Delhi',
    'State': 'New Delhi',
    'Country': 'India',
    'Zip_Code': '110064',
    'Attachment': [{
      'Name': 'image1'
    }, {
      'Name': 'image2'
    }]
  }, {
    'Task_Number': '789101',
    'SR_Number': '1890005235',
    'Start_Date': '20-10-2018',
    'End_Date': '20-10-2018',
    'Task_Status': 'Accepted',
    'Job_Description': 'Caliberation',
    'Street_Address': 'Rajouri Garden',
    'City': 'New Delhi',
    'State': 'New Delhi',
    'Country': 'India',
    'Zip_Code': '110064',
    'Attachment': [{
      'Name': 'Attachment1'
    }, {
      'Name': 'Attachment2'
    }, {
      'Name': 'Attachment3'
    }, {
      'Name': 'Attachment4'
    }]
  }, {
    'Task_Number': '456789',
    'SR_Number': '1890005235',
    'Start_Date': '20-10-2018',
    'End_Date': '20-10-2018',
    'Task_Status': 'Accepted',
    'Job_Description': 'Caliberation',
    'Street_Address': 'Rajouri Garden',
    'City': 'New Delhi',
    'State': 'New Delhi',
    'Country': 'India',
    'Zip_Code': '110064',
    'Attachment': [{
      'Name': 'Attachment1'
    }, {
      'Name': 'Attachment2'
    }]
  }, {
    'Task_Number': '234593',
    'SR_Number': '1890005235',
    'Start_Date': '20-10-2018',
    'End_Date': '20-10-2018',
    'Task_Status': 'Accepted',
    'Job_Description': 'Caliberation',
    'Street_Address': 'Rajouri Garden',
    'City': 'New Delhi',
    'State': 'New Delhi',
    'Country': 'India',
    'Zip_Code': '110064',
    'Attachment': [{
      'Name': 'Attachment1'
    }, {
      'Name': 'Attachment2'
    }]
  }, {
    'Task_Number': '987653',
    'SR_Number': '1890005235',
    'Start_Date': '20-10-2018',
    'End_Date': '20-10-2018',
    'Task_Status': 'Accepted',
    'Job_Description': 'Caliberation',
    'Street_Address': 'Rajouri Garden',
    'City': 'New Delhi',
    'State': 'New Delhi',
    'Country': 'India',
    'Zip_Code': '110064',
    'Attachment': [{
      'Name': 'Attachment3'
    }, {
      'Name': 'Attachment4'
    }]
  }];
  customerFieldJobDetail: any[] = [];
  customerName: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cloudService: CloudService,  public logger: LoggerProvider, public viewCtrl: ViewController) {
    this.customerId = this.navParams.get('customerID');
    this.customerName = this.navParams.get('customerName');
  }

  toggleSection(i) {
    this.customerFieldJobs[i].open = !this.customerFieldJobs[i].open;
  }

  ionViewDidLoad() {
    //this.getCustomerHistory(this.customerId);
  }

  getCustomerHistory(customerId) {
    this.cloudService.getCustomerHistory(customerId).then((res: any[]) => {
      this.customerFieldJobDetail = res;
    }).catch(err => {
      this.logger.log(this.fileName, "getCustomerHistory", 'Error: ' + err);
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  openAttachment(fieldJobDetail) {

  }

}
