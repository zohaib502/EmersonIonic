import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { ValueProvider } from '../../providers/value/value';
import { SyncProvider } from '../../providers/sync/sync';
import { UtilityProvider } from '../../providers/utility/utility';
import { TransformProvider } from '../../providers/transform/transform';
import { SearchPipe } from '../../pipes/search/search';
import { LoggerProvider } from '../../providers/logger/logger';
import * as moment from "moment";
import { ListFilterPipe } from '../../pipes/list-filter/list-filter';
import { CloudService } from '../../providers/cloud-service/cloud-service';
import {FetchProvider} from '../../providers/sync/fetch/fetch';


@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  header_data: any;
  country: any = [];
  language: any = [];
  addressObj: any = {};
  addressList: any = [];
  allAddressList: any = [];
  newRow: any = [];
  countryCode: any;
  countryName: any;
  myInput: any;
  fileName: any = 'Address_Page';
  showSelects: boolean = true;
  preferredTimeZone: any;
  userPreferredTimeZone: any;
  Moment: any = moment;
  permissions: any;
  selectedCountryCode: any;
  timeOut: any;

  constructor(public listFilterPipe: ListFilterPipe, public transformProvider: TransformProvider,public fetchProvider: FetchProvider,
              public syncProvider: SyncProvider, public valueProvider: ValueProvider, public events: Events, public searchPipe: SearchPipe,
              public navCtrl: NavController, public navParams: NavParams, public localService: LocalServiceProvider,
              public utilityProvider: UtilityProvider, public logger: LoggerProvider, public cloudService: CloudService) {
    this.header_data = { title1: "", title2: "Field Service Admin", taskId: "" };
    this.permissions = this.valueProvider.getPermissions();
    this.getCountry();
    this.getLanguage();
    this.events.subscribe('langSelected', (res) => {
     this.timeOut=setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
    events.subscribe('refreshPageData', (refreshLang) => {
    this.getAddressList();
    });
  }

  ionViewDidLoad() {
    this.getAddressList();
  }

  ionViewDidEnter() {
    this.events.publish('setPage', "Locations");
  }
/**
*get list of Languages for the Language drop down
*
*/
  getLanguage() {
    this.localService.getMST_Languages(false).then((res: any[]) => {
      this.language = res;
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getLanguage', 'Error in getMST_Languages : ' + JSON.stringify(error));
    });
  }
  /**
   *get list of Countries for the Country drop down
   *
   */

  getCountry() {
    if (this.valueProvider.getCountryList() != '') {
      this.country = this.valueProvider.getCountryList();
    } else {
      this.localService.getCountry().then((response: any[]) => {
        if (response) {
          this.country = response;
          // this.logger.log(this.fileName, 'getCountry', this.country);
          this.valueProvider.setCountryList(response);
        }
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'getCountry', 'Error in getCountry : ' + JSON.stringify(error));
      });
    }
  }

  /**
   *get list of addresses from MCS
   *
   */
  getAddressList() {
    this.userPreferredTimeZone = this.valueProvider.getUser().timeZoneIANA;
    this.preferredTimeZone = this.valueProvider.getUserPreferences()[0].timeZoneIANA;
    if (this.permissions.ViewLocation) {
      if (this.isOnline()) {
        this.utilityProvider.showSpinner();
        this.fetchProvider.fetchAddressDetails().then((res:any) => {
            this.addressList = res;
            this.newRow = this.rowGroupBy(this.addressList, 2);
            this.allAddressList = res;
            if (this.countryCode) {
              this.addressList = this.addressList.filter(item => {
                return item.Country == this.countryCode;
              });
              this.newRow = this.rowGroupBy(this.addressList, 2);
            }
            this.utilityProvider.stopSpinner();
          }).catch((error: any) => {
            this.utilityProvider.stopSpinner();
            this.logger.log(this.fileName, 'getAddressList', 'Error in getAddressList : ' + JSON.stringify(error));
            if(error.data && error.data.error){
              this.utilityProvider.displayErrors([{ "errMsg":error.data.error}]);
            }
          });
      }
    }
  }

  /** Country code used to filter address List
   * @param value 
   */

  setCountryName(value) {
    if (value == '' || value == undefined) {
      this.selectedCountryCode = '';
      this.getAddressList();
    }
    else {
      this.selectedCountryCode = value;
      let filtered = this.country.filter(item => {
        return item.Country_Code == value;
      })[0];

      if (filtered != undefined) {
        this.countryName = filtered.Country_Name;
      }

      this.addressList = this.allAddressList.filter(item => {
        return item.Country == value;
      });
      if (this.addressList.length > 0) {
        this.newRow = this.rowGroupBy(this.addressList, 2);
      }
    }
  }

  
  /** Check if the user in online
   */

  isOnline() {
    return this.utilityProvider.isConnected();
  }

    /**
     * Process the data from add/edit modal window
     */

  addAddressModal() {
    let params = { countryName: this.countryName, countryCode: this.countryCode, ifAdd: 'Add', country: this.country, language: this.language };
    let addressModal = this.utilityProvider.showModal("AddressModalPage", params, { enableBackdropDismiss: false, cssClass: 'AddressModalPage' });
    addressModal.onDidDismiss(data => {
      if (data != undefined) {
        this.addressObj = data;
        this.addressObj.IS_DEFAULT = this.addressObj.IS_DEFAULT ? "true" : "false";
        this.addressObj.ADDRESS_ID=((new Date()).getTime() + "" + parseInt(String(Math.random() * 10000))).toString();
        this.addressObj.CREATEDBY=this.valueProvider.getUserId();
        this.addressObj.CREATEDON = moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        this.addressObj.MODIFIEDON = moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        this.addressObj.MODIFIEDBY = this.valueProvider.getUserId();

          if (this.isOnline()) {
            this.utilityProvider.showSpinner();
            this.insertAddressOnMCS(this.addressObj);
          }
          else {
            this.utilityProvider.presentToast("You need to be online to add a location!", 4000, 'top', 'feedbackToast');
          }
        
      }
    });
    addressModal.present();
  }

      /**
     * Insert New Location in MCS
     */
  async insertAddressOnMCS(addobject) {    
    try {
      let result = await this.syncProvider.validateUserDeviceAndToken();
      if(result) {
      ///  this.utilityProvider.displayErrors()
        await this.cloudService.addUpdateAddresses([addobject]);
        this.getAddressList();
      }
    } catch(error) {
      if(error.data && error.data.error){
        this.utilityProvider.displayErrors([{ "errMsg":error.data.error}]);
      }
      //this.utilityProvider.displayErrors(error.error)
     // this.utilityProvider.presentToast(error.error || "Error occured while adding Location. Please try again later!", 4000, 'top', 'feedbackToast');
    } finally {
      this.utilityProvider.stopSpinner();
    }
  }
  /**
   *Update Location modal window
   *
   * @param {*} addressAuditLogArr
   * @memberof AddressPage
   */

  editAddressModal(address, index) {
    if (!this.isOnline()) {
      this.utilityProvider.presentToast("Location can be updated only in Online mode", 4000, 'top', 'feedbackToast');
      return;
    }
    let params = { addressObj: address, ifEdit: 'Edit', country: this.country, language: this.language };
    let addressModal = this.utilityProvider.showModal("AddressModalPage", params, { enableBackdropDismiss: false, cssClass: 'AddressModalPage' });
    addressModal.onDidDismiss(data => {
      if (data != undefined) {
        this.addressObj = data;
        this.addressObj.IS_DEFAULT = this.addressObj.IS_DEFAULT ? "true" : "false";
        this.addressObj.MODIFIEDBY = this.valueProvider.getUserId();
        this.addressObj.MODIFIEDON = moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        if (this.isOnline()) {
            this.utilityProvider.showSpinner();
            this.updateAddressOnMCS(this.addressObj, index);
          }
          else {       
              this.utilityProvider.presentToast("Location can be updated only in Online mode", 4000, 'top', 'feedbackToast');
          }
      }
    });
    addressModal.present();
  }

  /**
   * 
   * @param addobject 
   * @param index 
   */
  getCountryName(code){
    if(this.country.length){
      return this.country.filter(item => {
        return item.Country_Code == code;
      })[0].Country_Name;
    }
  }

    /**
   *Update Location in MCS
   *
   * @param {*} addressAuditLogArr
   * @memberof AddressPage
   */
  updateAddressOnMCS(addobject, index) {

    if (addobject.ADDRESS_ID) {
      addobject.ADDRESS_ID = addobject.ADDRESS_ID;
    }
    let addressObjects = [];
    addressObjects.push(addobject);
    this.cloudService.checkUser().then((data) => {
      if (data) {
        this.utilityProvider.checkExpireToken().then(() => {
          this.cloudService.addUpdateAddresses(addressObjects).then((res) => {
            if(addressObjects.length){
              this.addressList[index] = addressObjects[0];
            }
              this.getAddressList();
            }).catch((err : any)=> {
              this.logger.log(this.fileName, 'updateAddressOnMCS', 'Error in insertAddressAuditLog: '+JSON.stringify(err.error));
              this.utilityProvider.presentToast("Error occured while updating Location. Please try again later!", 4000, 'top', 'feedbackToast');
            })
            this.utilityProvider.stopSpinner();
          }).catch((refreshtoken) => {
          this.logger.log(this.fileName, 'updateAddressOnMCS', 'Error in checkExpireToken: '+JSON.stringify(refreshtoken));
          let data = addobject;
          let data1 = index;
          this.cloudService.refreshToken(refreshtoken).then(() => {
            this.updateAddressOnMCS(data, data1);
          }).catch((err : any) => {
            this.logger.log(this.fileName, 'updateAddressOnMCS', "Error in refreshToken: " + JSON.stringify(err.error));   
            this.utilityProvider.presentToast("Error occured while updating Location. Please try again later!", 4000, 'top', 'feedbackToast');
          });
        });
      } else {
        this.syncProvider.isAutoSyncing =  false;
        this.syncProvider.isUserLoggedIn = false;
        this.utilityProvider.forcelogout("You are now logged out due to log in on another device.");
      }
    }).catch((err : any) => {
      this.logger.log(this.fileName, 'updateAddressOnMCS', "Error in checkUser: " + JSON.stringify(err));
      this.syncProvider.isAutoSyncing = false; 
      this.syncProvider.isUserLoggedIn = false;      
        this.utilityProvider.checkUserIssueMessage(err);
      // }).catch((res: any) => {
        this.utilityProvider.stopSpinner();
      //   this.logger.log(this.fileName, "updateAddressOnMCS", 'Error in SyncLoader:' + JSON.stringify(res));
      // });
    });
  }

  /**Add/Update Location modal cancel button action */

  onCancel() {
    this.myInput = '';
  }

  rowGroupBy(arr, size) {
    let newArr = [];
    for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  }

  // on leave clear timeouts

  ionViewWillLeave() {
    clearTimeout(this.timeOut);
    this.events.unsubscribe('langSelected');
    this.events.unsubscribe('refreshPageData');
  }

}
