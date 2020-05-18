import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CloudService } from '../../../providers/cloud-service/cloud-service';
import { LoggerProvider } from '../../../providers/logger/logger';
import { UtilityProvider } from '../../../providers/utility/utility';


@IonicPage()
@Component({
  selector: 'page-manage-roles',
  templateUrl: 'manage-roles.html',
})
export class ManageRolesPage {
  Rolename: any;
  desc: any;
  isPermission: boolean;
  isSave: boolean;
  list = [];
  usersOrderBy: any = '';
  updateper = [];
  fileName = "ManageRolesPage";
  errmsg: any;
  pList = [];
  userRoleID: any;


  constructor(public viewCtrl: ViewController,
    public navCtrl: NavController, public logger: LoggerProvider,
    public cloudService: CloudService,
    public navParams: NavParams, public utilityProvider: UtilityProvider) {
    this.isSave = false;

  }

  ionViewDidEnter() {
    this.Rolename = (this.navParams.get('rolename'));
    this.desc = (this.navParams.get('desc'));
    this.userRoleID = (this.navParams.get('UserRoleID'));
    if (this.userRoleID != "") {
      this.getPermission();
      this.isPermission = false;
    }
    else {
      this.isPermission = true;
    }

  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }
  /**
   *@author: Prateek
   *11-26-2018
   *Inserting Roles by calling mcs api roles
   * @memberof ManageRolesPage
   */
  addRoles() {
    this.errmsg = undefined;
    for (let index = 0; index < this.cloudService.uniqueRoles.length; index++) {
      if (this.cloudService.uniqueRoles[index]["RoleName"] == this.Rolename) {
        this.errmsg = "Role Name Already Existed";
      }
    }
    if (this.errmsg == undefined) {
      this.errmsg = "";
      let self = this;
      self.utilityProvider.showSpinner();
      try {
        self.cloudService.manageRoles(this.Rolename, this.desc, this.userRoleID, this.updateper).then((Response: any) => {

          self.utilityProvider.presentToast(Response.data.message, 2000, 'top', '');
          self.userRoleID = Response.data.UserRoleID;
          self.getPermission();
          this.cloudService.getRoles();
          self.utilityProvider.stopSpinner();
        }).catch(error => {
          this.logger.log(this.fileName, 'addRoles', error);
          self.utilityProvider.stopSpinner();
          if(error.data && error.data.error){
            this.utilityProvider.displayErrors([{ "errMsg":error.data.error}]);
          }
        });
      } catch (error) {
        this.logger.log(this.fileName, 'addRoles', error);
        self.utilityProvider.stopSpinner();
        if(error.data && error.data.error){
          this.utilityProvider.displayErrors([{ "errMsg":error.data.error}]);
        }
      }
    }
  }
  /**
   *@author:Prateek
  *Create and edit roles
  @param Rollenam,Description,userRoleID,Permissionlist as array
   */
  editRoles() {
    if (this.updateper.length == 0) {
      this.updateper = [];
    }
    //   let self = this;
    this.utilityProvider.showSpinner();
    try {
      let num = this.userRoleID.toString();
      this.cloudService.manageRoles(this.Rolename, this.desc, num, this.updateper).then((Response: any) => {
        this.utilityProvider.stopSpinner();
        this.utilityProvider.presentToast(Response.data.message, 2000, 'top', '');
        this.userRoleID = Response.data.UserRoleID;
        this.closeModal();
        this.cloudService.getRoles();
      }).catch(error => {
        this.logger.log(this.fileName, 'editRoles', error);
        this.utilityProvider.stopSpinner();
        if(error.data && error.data.error){
          this.utilityProvider.displayErrors([{ "errMsg":error.data.error}]);
        }
      });
    } catch (error) {
      this.logger.log(this.fileName, 'editRoles', error);
      this.utilityProvider.stopSpinner();
      if(error.data && error.data.error){
        this.utilityProvider.displayErrors([{ "errMsg":error.data.error}]);
      }
    }
    // }
    //else {

    //   }
  }
  /**
   *@author:Prateek
   *Get permission for roles by calling mcs api
 
   */
  getPermission() {
    this.utilityProvider.showSpinner();
    this.cloudService.getPermission(this.userRoleID).then((res: any) => {
      this.pList = res;
      // console.log("PERMI", res)
      this.groupPermissionList();
      this.isPermission = false;
      this.isSave = true;
      this.getEditPer(res);
      this.utilityProvider.stopSpinner();
    }).catch((err) => {
      this.utilityProvider.stopSpinner();
    });
  }
  /**
   *@author:Prateek
   *Group Permission list according to MOdelName
  
   */
  groupPermissionList() {
    let groubedByTeam = this.utilityProvider.groupBySameKeyValues(this.pList, 'ModuleName')
    this.pList = groubedByTeam;
    this.list.push(Object.keys(this.pList).map(key => ({ key, value: this.pList[key] })))
    this.sortByName(this.list, "key");

  }



  /**
   *Sort array by name permission list
   *22-11-2018
   */
  sortByName(array, key) {
    //  console.log("SORTNAME", array);
    array[0].sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));

    });
    array.sort();


  }
  /**
   *@author:Prateek
   *Push permission by clicking checkbox in (updateper) array
   * @param {*} event to checked checkbox true false.permission id(ampid),isallowed(y),ManageRolesPage permission id array.
   */
  updatePermission(event, ampid) {
    //  console.log("EVENT", event.checked)
    if (event.checked == true) {
      this.updateper.push({
        AMPID: ampid,
        ISAllowed: 'Y'
      });

    } else {

      for (let index = 0; index < this.updateper.length; index++) {
        if (this.updateper[index]["AMPID"] == ampid) {
          this.updateper.splice(index, 1)
        }
      }

    }
  }


  /**
   *@author:Prateek
   *Get updated permission and store in array
   */
  getEditPer(pList) {
    let fillper = pList.filter(function (per) {
      return per.IsAllowed == "Y";
    });
    for (let i = 0; i < fillper.length; i++) {
      this.updateper.push({
        AMPID: fillper[i].AMPID,
        ISAllowed: 'Y'
      }
      );
    }
  }
}
