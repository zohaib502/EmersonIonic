import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-search-modal',
  templateUrl: 'search-modal.html',
})
export class SearchModalPage {
  @ViewChild('searchBar') myInput;
  LocalData: any;
  DataSource: any;
  showData: Array<any> = [];
  type: any;
  taskInput: string = "";
  jobidDropdown: boolean = false;
  jobidnotnull: boolean = false;
  hasOther: boolean = false;
  timeOut: any;
  constructor(public navCtrl: NavController, public translate: TranslateService,
    public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform) {
    this.DataSource = this.navParams.get('dataSource');
    this.type = this.navParams.get('type');
    this.hasOther = this.navParams.get('hasother');
    this.showLovs();

  }

  ngAfterViewChecked() {
    if (!this.platform.is('ios')) {
      this.timeOut = setTimeout(() => {
        this.myInput.setFocus();
      }, 500);
    }
  }

  // Clear timeouts
  ionViewWillLeave(): void {
    clearTimeout(this.timeOut);
    this.showData.length = 0;
  }

  showLovs() {
    this.showData = [];
    switch (this.type) {
      case 'isocal':
      case 'element':
      case 'option':
      case 'direction':
      case 'condition':
      case 'lookups':
      case 'WORLDAREANAME':
      case 'SERVICESITENAME':
      case 'jobids':
      case 'NetworkType':
      case 'protocols':
      case 'LoopType':
      case 'AsFoundNetwork':
      case 'AsLeftRecommendedAction':
      case 'AsLeftConditionActuation':
      case 'FurtherRecommendations':
      case 'MenuReportNotes':
      case 'Multiplier':
      case 'Site':
        for (let i = 0; i < this.DataSource.length; i++) {
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i].LookupValue),
            'Value': this.DataSource[i].LookupValue,
            'ID': this.DataSource[i].LookupID
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
      case 'Country':
        for (let i = 0; i < this.DataSource.length; i++) {
          this.showData.push({
            'type': this.type,
            'LookupValue': this.translate.instant(this.DataSource[i].Country_Name),
            'Value': this.DataSource[i].Country_Name,
            'ID': this.DataSource[i].Country_Code
          });
        }
      default:
        break;
    }
  }

  public closeModal() {
    this.viewCtrl.dismiss();
    clearTimeout(this.timeOut);
    this.showData.length = 0;
  }

  //This method select item from the list
  selectItem(obj) {
    if (obj == 'Other') {
      let data = {
        'type': this.type,
        'LookupValue': 'Other',
        'Value':'Other',
        'ID': '-1'
      }
     
      this.viewCtrl.dismiss(data);
    }
    else {
      let item = Object.assign({}, obj);
      item.LookupValue=item.Value;
      this.viewCtrl.dismiss(item);
    }
  }
  selectOpt() {
    let obj: any = [];
    obj.push({
      'type': 'jobids',
      'LookupValue': this.taskInput,
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
