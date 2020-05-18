import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the TimesheetDropdownPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timesheet-dropdown',
  templateUrl: 'timesheet-dropdown.html',
})
export class TimesheetDropdownPage {
  @ViewChild('searchBar') myInput;
  LocalData: any;
  DataSource: any;
  showData: Array<any> = [];
  type: any;
  isTranslate = false;
  taskInput: string = "";
  jobidDropdown: boolean = false;
  timeSheetDropdownValue: any;
  jobidnotnull: boolean = false;
  timeType: boolean;
  constructor(public navCtrl: NavController, public translate: TranslateService, public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform) {
    this.DataSource = this.navParams.get('dataSource');
    this.isTranslate = this.navParams.get('isTranslate');
    this.type = this.navParams.get('type');
    this.timeType = this.navParams.get('entryType');
    this.timeSheetDropdownValue = this.navParams.get('ddValue');
    this.showLovs();

  }
  ngAfterViewChecked() {
    if (!this.platform.is('ios')) {
      setTimeout(() => {
        this.myInput.setFocus();
      }, 500);
    }
  }

  showLovs() {
    console.log("this.type" + this.type);
    switch (this.type) {
      case 'jobids':
        this.jobidDropdown = true;
        for (let i = 0; i < this.DataSource.length; i++) {
          this.showData.push({
            'type': this.type,
            'LookupValue': this.DataSource[i].LookupValue,
            'Value': this.DataSource[i].LookupValue,
            'ID': this.DataSource[i].PrimaryKey
          });
        }
        break;
      case 'activityName':
        for (let i = 0; i < this.DataSource.length; i++) {
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i].OP_Code.toString()),
            'Value': this.DataSource[i].OP_Code,
            'ID': this.DataSource[i].Id
          });
        }
        break;
      case 'shiftCodes':
        for (let i = 0; i < this.DataSource.length; i++) {
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i].Shift_Code),
            'Value': this.DataSource[i].Shift_Code,
            'ID': this.DataSource[i].Id
          });
        }
        break;
      case 'chargemethod':
        for (let i = 0; i < this.DataSource.length; i++) {
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i].Value),
            'Value': this.DataSource[i].Value,
            'ID': this.DataSource[i].ID
          });
        }
        break;
      case 'devices':
        for (let i = 0; i < this.DataSource.length; i++) {
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i].ProductName),
            'Value': this.DataSource[i].ProductName,
            'ID': this.DataSource[i].ProductID
          });
        }
        break;
      case 'lookups':
      case 'NetworkType':
      case 'protocols':
      case 'LoopType':
      case 'AsFoundNetwork':
      case 'AsLeftRecommendedAction':
      case 'AsLeftConditionActuation':
        for (let i = 0; i < this.DataSource.length; i++) {
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i].LookupValue.toString()),
            'Value': this.DataSource[i].LookupValue,
            'ID': this.DataSource[i].LookupID
          });
        }
        break;
      case 'mstData':
        // if (this.timeSheetDropdownValue == 'Task_Number') {
        //   this.jobidDropdown = true;
        // }
        for (let i = 0; i < this.DataSource.length; i++) {
          let ID = this.DataSource[i].ID;
          if (this.timeSheetDropdownValue == 'Task_Number') {
            ID = this.DataSource[i].PrimaryKey;
          }
          if (this.timeSheetDropdownValue == 'P_PROJECTNUMBER' || this.timeSheetDropdownValue == 'TASK_NAME' || this.timeSheetDropdownValue == 'OVERTIMECODE' || this.timeSheetDropdownValue == 'SHIFTCODE') {
            ID = this.DataSource[i].OSC_ID;
          }
          if (this.timeSheetDropdownValue == 'Country_Name') {
            ID = this.DataSource[i].Country_Code;
          }
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i][this.timeSheetDropdownValue].toString()),
            'Value': this.DataSource[i][this.timeSheetDropdownValue],
            'ID': ID
          });
        }
        break;
      case 'oscNcData':
        if (this.timeSheetDropdownValue == 'Task_Number') {
          if (this.timeType) {
            this.jobidDropdown = true;
            this.showData.push({
              'type': this.type,
              'LookupValue': this.translate.instant("No Value"),
              'Value': "No Value",
              'ID': "No Value"
            });
          }
        }
        for (let i = 0; i < this.DataSource.length; i++) {
          let ID = this.DataSource[i].ID;
          if (this.timeSheetDropdownValue == 'Task_Number') {
            ID = this.DataSource[i].PrimaryKey;
          }
          if (this.timeSheetDropdownValue == 'Shift_Code') {
            ID = this.DataSource[i].ID;
          }
          if (this.timeSheetDropdownValue == 'overtimeMultiplier') {
            ID = this.DataSource[i].Id;
          }
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i][this.timeSheetDropdownValue].toString()),
            'Value': this.DataSource[i][this.timeSheetDropdownValue],
            'ID': ID
          });
        }
        // Preeti Varshney 10/09/2019 commenting this thing because it is common for all dropdown of Non-Clarity Osc and No Value is to be shown at first position.
        //  this.sortShowData();
        break;
      case 'overtimeMultiplier':
        for (let i = 0; i < this.DataSource.length; i++) {
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i].LookupValue.toString()),
            'Value': this.DataSource[i][this.timeSheetDropdownValue],
            'ID': this.DataSource[i].LookupID
          });
        }
        break;
      case 'nonOscNC':
        for (let i = 0; i < this.DataSource.length; i++) {
          let ID = this.DataSource[i].ID;
          if (this.timeSheetDropdownValue == 'OP_Code') {
            ID = this.DataSource[i].Id;
          }
          if (this.timeSheetDropdownValue == 'Shift_Code') {
            ID = this.DataSource[i].Id;
          }
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i][this.timeSheetDropdownValue].toString()),
            'Value': this.DataSource[i][this.timeSheetDropdownValue],
            'ID': ID
          });
        }
        break;
      case 'timeCodes':
        for (let i = 0; i < this.DataSource.length; i++) {
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i].Value.toString()),
            'Value': this.DataSource[i].Value,
            'ID': this.DataSource[i].ID
          });
        }
        break;
      case 'ActivityType':
        for (let i = 0; i < this.DataSource.length; i++) {
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i].Value),
            'Value': this.DataSource[i].Value,
            'ID': this.DataSource[i].ID
          });
        }
        break;
      default:
        break;
    }
  }


  sortShowData() {
    this.showData = this.showData.sort(function (a, b) {
      if (a.LookupValue > b.LookupValue)
        return 1;
      if (a.LookupValue < b.LookupValue)
        return -1;
      return 0;
    });
  }
  public closeModal() {
    this.viewCtrl.dismiss();
  }

  //This method select item from the list
  selectItem(obj) {

    let item = Object.assign({}, obj);
    item.LookupValue=item.Value;
    this.viewCtrl.dismiss(item);
  }
  selectOpt() {
    let obj: any = [];
    obj.push({
      'type': 'jobids',
      'LookupValue': this.taskInput,
      'Value':this.taskInput,
      'ID': parseInt((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000))),
    });
    this.selectItem(obj[0]);
  }
  checkforspace(value) {
    // if the value is an empty string don't show select button
    let val = value._value
    if (val && val.trim() != '') {
      this.taskInput = val.trim();
      this.jobidnotnull = true;
    }
    else {
      this.jobidnotnull = false;
    }
  }
}
