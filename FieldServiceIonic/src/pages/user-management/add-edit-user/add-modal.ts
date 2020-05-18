import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CloudService } from '../../../providers/cloud-service/cloud-service';
import { UtilityProvider } from '../../../providers/utility/utility';
import { LoggerProvider } from '../../../providers/logger/logger';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { ValueProvider } from '../../../providers/value/value';
// import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';

@IonicPage()
@Component({
  selector: 'page-add-modal',
  templateUrl: 'add-modal.html',
})
export class AddModalPage {
  fileName: any = 'Add_Modal_Page';
  public name: any = '';
  public email: any = '';
  public userID: any = '';
  worldarea: any = [];
  userrolesid: any = [];
  isCorrect: boolean = true;
  insertMessage: boolean = false;
  resMessage: string;
  world_area: number;
  //clarityid: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  countries: any = [];
  isActive: string = 'Y';
  modifiedby: any;
  createdby: any;
  isEdit: any;


  constructor(public viewCtrl: ViewController,
    public navCtrl: NavController, public logger: LoggerProvider,
    public cloudService: CloudService, public localService: LocalServiceProvider,
    public navParams: NavParams, public utilityProvider: UtilityProvider, public valueProvider: ValueProvider) {
    // 01-29-2019 -- Mansi Arora -- call function to get list of all countries
    this.getCountry();
    this.name = (this.navParams.get('name'));
    this.email = (this.navParams.get('email'));
    this.userID = (this.navParams.get('userid'));
    //this.clarityid = (this.navParams.get('Clarity_ID'))
    this.world_area = (this.navParams.get('worldarea'))
    this.isActive = this.navParams.get('IsActive')
    // 01-30-2019 -- Mansi Arora -- get country, state, city, zipcode from params 
    this.country = (this.navParams.get('country'));
    this.state = (this.navParams.get('state'));
    this.city = (this.navParams.get('city'));
    this.zipcode = (this.navParams.get('zipcode'));
    this.createdby = this.navParams.get('createdby');
    this.isEdit = this.navParams.get('isEdit')
    if (this.navParams.get('rollmapping')) {
      this.userrolesid = (this.navParams.get('rollmapping'))
    }
    if (this.isActive == undefined) {
      this.isActive = "Y"
    }
  }

  ionViewDidLoad() {
    this.getWorldArea();

  }
  public closeModal() {
    this.viewCtrl.dismiss();
  }
  /**
   *Prateek 11/11/2018
   *Add/Edit users and call api to send the user data 
   *For add user we do not need to add value and for edit user we need to pass the value(this.userID, this.name, this.email, this.userrolesid,)
   * @memberof AddModalPage
   */
  addEditUser() {
    this.resMessage = "";
    this.insertMessage = false;
    // let resMessage = this.cloudService.users.filter((item: any) => {
    //   return item.Email == this.email;
    // });
    // if (resMessage.length > 0 && !this.isEdit) {
    //   this.resMessage = "Email already exists.";
    // } else {
    // this.resMessage = "";
    // 02-01-2019 -- Mansi Arora -- check world area before converting to string as no more a required field
    let worldid = this.world_area ? this.world_area.toString() : '';
    this.utilityProvider.showSpinner();
    try {
      //Prateek 03/04/2019 Added parameter createdby modifiedby
      if (this.userID == "") {
        //this.modifiedby = this.valueProvider.getUser().ID;
        this.createdby = this.valueProvider.getUserId();
      }
      else {
        this.modifiedby = this.valueProvider.getUserId();
      }
      let param = {
        'userid': this.userID,
        'name': this.name,
        'email': this.email.toLowerCase(),
        'userrolesid': this.userrolesid,
        'worldarea': worldid,
        //'clarityid': this.clarityid,
        'country': this.country,
        'state': this.state,
        'city': this.city,
        'zipcode': this.zipcode,
        'isActive': this.isActive,
        'createdby': this.createdby,
        'modifiedby': this.modifiedby
      }
      // 01-29-2019 -- Mansi Arora -- send values for country, state, city and zipcode to cloud service along with other fields
      this.cloudService.manageUser(param).then((Response: any) => {
        this.utilityProvider.stopSpinner();
        this.utilityProvider.presentToast(Response.data.message, 2000, 'top', '');
        this.cloudService.getUsers();
        this.viewCtrl.dismiss();
      }).catch(error => {
        this.insertMessage = true;
        this.resMessage = error.data.errorCode;
        this.logger.log(this.fileName, 'add/edituser', error);
        this.utilityProvider.stopSpinner();
        if (error.data && error.data.error) {
          this.utilityProvider.displayErrors([{ "errMsg": error.data.error }]);
        }
      });
    } catch (error) {
      this.logger.log(this.fileName, 'add/edituser', error.message);
      this.utilityProvider.stopSpinner();
      if (error.data && error.data.error) {
        this.utilityProvider.displayErrors([{ "errMsg": error.data.error }]);
      }
    }
    //}
  }

  /**
   *Prateek 11/11/2018
   *Email Validation 
   * @param {*} email
   * @returns
   * @memberof AddModalPage
   */
  validateEmail(email) {
    let condition = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    this.isCorrect = condition.test(email);
    return condition.test(email);
  }

  getWorldArea() {
    this.localService.getWorldArea().then((res: any[]) => {
      this.worldarea = res;
    });
  }

  // 01-29-2019 -- Mansi Arora -- get list of all countries if not present in value provider
  getCountry() {
    if (this.valueProvider.getCountryList() != '') {
      this.countries = this.valueProvider.getCountryList();
    } else {
      this.localService.getCountry().then((response: any[]) => {
        if (response) {
          this.countries = response;
          this.valueProvider.setCountryList(response);
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getCountry', 'Error in getCountry : ' + JSON.stringify(error));
      });
    }
  }
  /**
   *@author: Prateek 03/01/2019
   *
   * @param {*} event
   * @param {*} item
   * @memberof AddModalPage
   */
  setEnable(event) {
    if (event.value == true) {
      this.isActive = "Y";
    } else {
      this.isActive = "N";
    }
  }


}
