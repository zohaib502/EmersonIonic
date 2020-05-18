import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { CloudService } from '../../providers/cloud-service/cloud-service';
import { UtilityProvider } from '../../providers/utility/utility';
import { SearchPipe } from '../../pipes/search/search';
import { LoggerProvider } from '../../providers/logger/logger';
import { ValueProvider } from '../../providers/value/value';
import { LocalServiceProvider } from '../../providers/local-service/local-service';


@IonicPage()
@Component({
  selector: 'page-user-management',
  templateUrl: 'user-management.html',
})
export class UserManagementPage {
  header_data: any;
  taskInput: string = '';
  myFieldJobsLimit: any = 5;
  resMessage: any;
  pageNumber: number = 1;
  pageNumberRoles: number = 1;
  usersOrderBy: any = '';
  usersReverseSort: any = false;
  fileName: any = 'User_Management_Page';
  isUsers: boolean = false;
  isRoles: boolean = true;
  users: any = []
  constructor(public navCtrl: NavController, public events: Events, public logger: LoggerProvider,
    public navParams: NavParams, public searchPipe: SearchPipe,
    public cloudService: CloudService, public utilityProvider: UtilityProvider, public valueProvider: ValueProvider, public localService: LocalServiceProvider) {
    this.header_data = { title1: "", title2: "Field Service Admin", taskId: "" };
    // 01-29-2019 -- Mansi Arora -- call function to get list of all countries
    this.getCountry();
  }

  /** 11/11/2018
   *@author:Prateek
   *Empty The array and call the users function from cloudSevice to get users
   * @memberof UserManagementPage
   */
  ionViewDidLoad() {
    this.cloudService.users = [];
    this.users = this.cloudService.users;
    let promiseArr = [];
    promiseArr.push(this.cloudService.getUsers());
    promiseArr.push(this.cloudService.getRoles());
    Promise.all(promiseArr).then((res: any[]) => {
      this.users = this.cloudService.users;
    }).catch((error) => {
      this.logger.log(this.fileName, "editMaterial", "Error in Promise.all: " + JSON.stringify(error));
      if(error.data && error.data.error){
        this.utilityProvider.displayErrors([{ "errMsg":error.data.error}]);
      }
    });
  }
  ionViewDidEnter() {
    this.events.publish('setPage', "Manage Users");
  }
  /**
   *@author Prateek
   *11/11/2018
   *Radio button function to change between user and roles
   * @param {*} value
   * @memberof UserManagementPage
   */
  manageUsers(value) {

    if (value == "users") {
      // console.log(value, "VALUE")
      this.isUsers = false;
      this.isRoles = true;
      this.taskInput = "";
      this.pageNumberRoles = 1;
    }
    if (value == "roles") {
      // console.log(value, "VALUE")
      this.isUsers = true;
      this.isRoles = false;
      this.taskInput = "";
      this.pageNumber = 1;
    }
  }

  /**
   *@author:Prateek 11/11/2018
   *Open modal (Addmodalpage) and send below parameters to insert user
   * @param {*} name
   * @param {*} email
   * @param {*} userid
   * @param {*} rollmapping
   * @param {*} country
   * @param {*} state
   * @param {*} city
   * @param {*} zipcode
   * @memberof UserManagementPage
   */
  // 01-30-2019 -- Mansi Arora -- country, state, city, zipcode added as params 
  // 03/01/2019 -- Prateek-- added isActive, make all params conditional
  userModal(name?, email?, userid?, rollmapping?, cid?, worldarea?, country?, state?, city?, zipcode?, IsActive?, createdby?) {
    if (this.isOnline()) {
      if (rollmapping) {
        var res = rollmapping.split(",");
      }
      // 01-30-2019 -- Mansi Arora -- send country, state, city, zipcode as params to open modal.
      // 03/01/2019 -- Prateek-- added isActive 
      //03/07/2019 -- Mayur Varshney -- Pass isEdit true/false if user click on edit or add button
      let userModal = this.utilityProvider.showModal('AddModalPage', { name: name, email: email, userid: userid ? userid : '', rollmapping: res ? res : null, Clarity_ID: cid, worldarea: worldarea, country: country, state: state, city: city, zipcode: zipcode, IsActive: IsActive, createdby: createdby, isEdit: email ? true : false }, { enableBackdropDismiss: false, cssClass: 'insertModalPage' });
      userModal.onDidDismiss(data => {
        this.logger.log(this.fileName, 'openJustification', data);

      });
      userModal.present().catch((err) => {
        this.logger.log(this.fileName, 'openJustification', JSON.stringify(err));
      });
    }
    else {
      this.showNetworkAlert();
    }
  }

  /**11/26/2018
   *@author Prateek
   * Used to open roles modal where we can update/edit roles with permission
   */
  rolesModal(rolename, desc, userroleid) {
    if (this.utilityProvider.isConnected()) {
      // console.log("USERROLEID", userroleid)
      let params = {
        rolename: rolename,
        desc: desc,
        UserRoleID: userroleid ? userroleid : ''
      }
      let userModal = this.utilityProvider.showModal('ManageRolesPage', params, { enableBackdropDismiss: false, cssClass: 'ManageRolesPageModal' });
      userModal.onDidDismiss(data => {
        this.logger.log(this.fileName, 'openJustification', data);
      });
      userModal.present().catch((err) => {
        this.logger.log(this.fileName, 'openJustification', JSON.stringify(err));
      });


    }
    else {
      this.showNetworkAlert();
    }

  }

  /**
   *@author Prateek 11/11/2018
   *Pagination to set limit 10
   * @param {*} limitParamName
   * @memberof UserManagementPage
   */
  setFullLimit(limitParamName) {
    // 02-06-2019 -- Mansi Arora -- set sorting filters to default 
    this.usersOrderBy = '';
    this.usersReverseSort = false;
    this[limitParamName] = this.searchPipe.transform(this.searchPipe.transform(this.cloudService.users, this.taskInput), 10).length;
  }

  /**
   *@author Prateek 11/11/2018
   *Delete user with respect to usedID and call the funtion manageUser in cloudService
   * @param {*} userid
   * @memberof UserManagementPage
   */
  // deleteUser(userid) {
  //   var IsActive = "N";
  //   this.utilityProvider.showSpinner();
  //   try {
  //     this.cloudService.manageUser(userid, '', '', '', IsActive, '', '','','','','','','').then((Response: any) => {
  //       this.utilityProvider.stopSpinner();
  //       this.utilityProvider.presentToast("User Deleted Sucessfully", 2000, 'top', '');
  //       this.cloudService.getUsers();
  //     }).catch(error => {
  //       this.resMessage = error.data.errorCode;
  //       this.logger.log(this.fileName, 'add/edituser', error);
  //       this.utilityProvider.stopSpinner();
  //     });
  //   } catch (error) {
  //     this.logger.log(this.fileName, 'add/edituser', error);
  //     this.utilityProvider.stopSpinner();
  //   }
  // }
  /** 11/11/2018
   *@author Prateek
   *function call on condition if no network
   *Open alert box when not connected to internet  if ADD/UPDATE/DELETE button is clicked
   * @memberof UserManagementPage
   */
  showNetworkAlert() {
    let alert = this.utilityProvider.alertCtrl.create({
      title: "Network Error",
      message: "Please Connect To Internet",
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        },
        {
          text: 'CANCEL',
          handler: () => {
          }
        }
      ],
      cssClass: 'forcelogoutAlert'
    });
    alert.present();
  }


  /** 11/11/2018
   *Prateek
   *Show alert box to confirm delete user 
   * @param {*} userid
   * @memberof UserManagementPage
   */
  showAlert(userid) {
    if (this.isOnline() == true) {
      let alert = this.utilityProvider.alertCtrl.create({
        title: "Delete User",
        message: "Are You Sure You Want To Delete?",
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              //this.deleteUser(userid);
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {

            }
          },

        ],
        cssClass: 'forcelogoutAlert'
      });
      alert.present();
    }
    else {
      this.showNetworkAlert();
    }
  }



  /**
   *Prateek 11/11/2018
   *Check the internet connection
   * @returns
   * @memberof UserManagementPage
   */
  isOnline() {
    return this.utilityProvider.isConnected();
  }

  // 01-29-2019 -- Mansi Arora -- get list of all countries in advance and set to value provider to avoid blank dropdown
  getCountry() {
    if (this.valueProvider.getCountryList() == '') {
      this.localService.getCountry().then((response: any[]) => {
        if (response) {
          this.valueProvider.setCountryList(response);
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getCountry', 'Error in getCountry : ' + JSON.stringify(error));
      });
    }
  }
  /**
   *@author Prateek --03/01/2019-- Filter data on the basis of active and inactive
   *
   * @param {*} event
   * @memberof UserManagementPage
   */
  showActive(event) {
    let items = this.cloudService.users;
    if (event.value == true) {
      let d = items.filter(item => {
        try {
          return item.IsActive == "Y";
        } catch (error) {
          console.log(error);
          return false;
        }
      });
      this.cloudService.users = d;
    }
    else {
      this.cloudService.users = this.cloudService.filterUsers;
    }
  }

}
