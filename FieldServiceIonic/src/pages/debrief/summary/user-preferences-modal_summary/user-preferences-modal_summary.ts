import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { ValueProvider } from '../../../../providers/value/value';
import { LocalServiceProvider } from '../../../../providers/local-service/local-service';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { LoggerProvider } from '../../../../providers/logger/logger';
import * as Enums from '../../../../enums/enums';

@IonicPage()
@Component({
  selector: 'page-user-preferences-modal_summary',
  templateUrl: 'user-preferences-modal_summary.html',
})
export class UserPreferencesModalPageSummary {
  /**
 *07/23/2018 Zohaib Khan
  userPrefObj create in order to get rid of all variables
 *
 * 07/25/2018 Zohaib Khan
 * Disclaimer is added to userPrefObj
 * @type {*}
 * @memberof UserPreferencesPage
 */

  userPrefObj: any = {
    printNote: false,
    printMaterial: false,
    printExpense: false,
    printTime: false,
    printSign: false,
    euISO: false,
    attachment: false,
    country: "",
    address: "",
    chineseAddress: "",
    donotDisplay: false,
    disclaimer: false,
    printInstallBase: false,
    ShowNonBillableEntries: false,
    FSR_PrintChargeMethod : false
  };
  user_Preferences: any = {};
  userNote: boolean = false;
  userMaterial: boolean = false;

  userInstallBase: boolean = false;
  userExpense: boolean = false;
  userExpenseComplete: boolean = false;
  userTime: boolean = false;
  defaultAddressId: any;
  defaultAddress: any;
  filteredAddress: any[];
  chineseAddressList: any[];
  fsrprefernces = {};
  isChina: any = false;
  usereuISO: boolean = false;
  userattachment: boolean = false;
  fileName: any = 'User Preferences Modal';
  allAddresses: any[] = [];
  addressCountries: any[] = [];
  userDisclaimer: boolean = false;
  userNonBillableEntries: boolean = false;
  userPrintChargeMethod : boolean = false
  enums: any;
  constructor(public events: Events, public navCtrl: NavController, private localService: LocalServiceProvider, public logger: LoggerProvider, public viewCtrl: ViewController, public navParams: NavParams, public valueService: ValueProvider, public utilityProvider: UtilityProvider) {
    this.enums = Enums;
  }

  ionViewDidLoad() {
    this.isChina = this.valueService.getTask().Country.toLowerCase() == "people's republic of china" || this.valueService.getTask().Country.toLowerCase() == "china";
    this.user_Preferences = this.valueService.getUserPreferences();
    this.getAddressCountries().then(() => {
      this.setfieldValue();
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'ionViewDidLoad', 'Error in ionViewDidLoad : ' + JSON.stringify(error));
    });
  }

  getAddressCountries() {
    return this.localService.getCountryNames().then((res: any[]) => {
      this.allAddresses = res;
      this.addressCountries = this.removeDuplicates(res.map(item => { return item.Country_Name }));
      return Promise.resolve(true);
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getAddressCountries', 'Error in getAddressCountries : ' + JSON.stringify(error));
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
    this.utilityProvider.stopSpinner();
  }

  setfieldValue() {
    let getDbAddress = this.allAddresses.filter((item) => {
      return item.AddressId == this.user_Preferences[0].AddressId;
    });
    if (getDbAddress.length != 0) {
      this.userPrefObj.country = getDbAddress[0].Country_Name;
      this.selectCountyAddress();
      this.userPrefObj.chineseAddress = this.user_Preferences[0].AddressIdCh;
      this.userPrefObj.address = this.user_Preferences[0].AddressId;
    }

    if (String(this.user_Preferences[0].FSR_PrintExpenseComplete) == "true") {
      this.userExpenseComplete = true;
      this.userPrefObj.printExpenseCompleted = true;
    } else {
      this.userPrefObj.printExpenseCompleted = false;
      this.userExpenseComplete = false;

    }

    if (String(this.user_Preferences[0].FSR_PrintExpense) == "true") {
      this.userExpense = true;
      if (String(this.valueService.getTaskObject().StatusID) == String(Enums.Jobstatus.Debrief_Started)) {
        this.userPrefObj.printExpense = true;
      }
      //10/31/2018 Zohaib Khan: Added condition if Print Expense On-Site Report was unchecked for the first time. Make it unchecked for 2nd time as well.
      else if (String(this.valueService.getTaskObject().FSR_PrintExpenseOnSite) == 'true') {
        this.userPrefObj.printExpense = true;
      } else {
        this.userPrefObj.printExpense = false;
      }
    } else {
      if (String(this.valueService.getTaskObject().FSR_PrintExpenseOnSite) == 'true') {
        this.userExpense = true;
        this.userPrefObj.printExpense = true;
      } else {
        this.userPrefObj.printExpense = false;
        this.userExpense = false;
      }
    }

    if (String(this.user_Preferences[0].FSR_PrintInstallBase) == "true") {
      this.userPrefObj.printInstallBase = true;
      this.userInstallBase = true;
    } else {
      this.userPrefObj.printInstallBase = false;
      this.userInstallBase = false;
    }

    if (String(this.user_Preferences[0].FSR_PrintTime) == "true") {
      this.userPrefObj.printTime = true;
      this.userTime = true;
    } else {
      this.userPrefObj.printTime = false;
      this.userTime = false;
    }

    if (String(this.user_Preferences[0].FSR_PrintNote) == "true") {
      this.userPrefObj.printNote = true;
      this.userNote = true;
    } else {
      this.userPrefObj.printNote = false;
      this.userNote = false;
    }

    if (String(this.user_Preferences[0].FSR_PrintMaterial) == "true") {
      this.userPrefObj.printMaterial = true;
      this.userMaterial = true;
    } else {
      this.userPrefObj.printMaterial = false;
      this.userMaterial = false;
    }

    if (String(this.user_Preferences[0].FSR_PrintEUISO) == "true") {
      this.userPrefObj.euISO = true;
      this.usereuISO = true;
    } else {
      this.userPrefObj.euISO = false;
      this.usereuISO = false;
    }
    if (String(this.user_Preferences[0].FSR_PrintAttachment) == "true") {
      this.userPrefObj.attachment = true;
      this.userattachment = true;
    } else {
      this.userPrefObj.attachment = false;
      this.userattachment = false;
    }
    if (String(this.user_Preferences[0].Do_Not_Show_Modal) == "true") {
      this.userPrefObj.donotDisplay = true;
    } else {
      this.userPrefObj.donotDisplay = false;
    }
    if (String(this.user_Preferences[0].FSR_Disclaimer) == "true") {
      this.userPrefObj.disclaimer = true;
      this.userDisclaimer = true;
    } else {
      this.userPrefObj.disclaimer = false;
      this.userDisclaimer = false;
    }
    if (String(this.user_Preferences[0].ShowNonBillableEntries) == "true") {
      this.userPrefObj.ShowNonBillableEntries = true;
      this.userNonBillableEntries = true;
    } else {
      this.userPrefObj.ShowNonBillableEntries = false;
      this.userNonBillableEntries = false;
    }

    if (String(this.user_Preferences[0].FSR_PrintChargeMethod) == "true") {
      this.userPrefObj.FSR_PrintChargeMethod = true;
      this.userPrintChargeMethod = true;
    } else {
      this.userPrefObj.FSR_PrintChargeMethod = false;
      this.userPrintChargeMethod = false;
    }
    this.userPrefObj.printSign = (this.user_Preferences[0].FSR_PrintSignature == 'true')
    this.defaultAddressId = this.user_Preferences[0].AddressId;
  }

  removeDuplicates(arr) {
    let unique_array = []
    for (let i = 0; i < arr.length; i++) {
      if (unique_array.indexOf(arr[i]) == -1) {
        unique_array.push(arr[i])
      }
    }
    return unique_array;
  }

  getPreferences() {
    this.user_Preferences = this.valueService.getUserPreferences();
  }

  selectCountyAddress() {
    this.filteredAddress = [];
    this.chineseAddressList = [];
    this.filteredAddress = this.allAddresses.filter((item) => {
      return item.Country_Name == this.userPrefObj.country && item.Language != 'zh-cn';
    });
    this.chineseAddressList = this.allAddresses.filter((item) => {
      return item.Language == 'zh-cn';
    });
  }

  savePreferences() {
    // let geFSRAddress;
    // let chineseFSRAddress;
    // if (this.address != "") {
    //   geFSRAddress = this.allAddresses.filter((item) => {
    //     return item.id == this.address;
    //   })[0];
    // }
    // if (this.chineseAddress != "") {
    //   chineseFSRAddress = this.allAddresses.filter((item) => {
    //     return item.id == this.chineseAddress;
    //   })[0];
    // }

    /**
    * 07/20/2018 Zohaib Khan
    * Geting field values from object
    *
    * 07/26/2018 Zohaib Khan
    * FSR_Disclaimer is added to fsrprefernces object
    * @memberof CustomersignaturePage
    */
    this.fsrprefernces = {
      FSR_PrintNote: this.userPrefObj.printNote,
      FSR_PrintExpense: this.userPrefObj.printExpense,
      FSR_PrintExpenseComplete: this.userPrefObj.printExpenseCompleted,
      FSR_PrintMaterial: this.userPrefObj.printMaterial,
      FSR_PrintTime: this.userPrefObj.printTime,
      FSR_PrintEUISO: this.userPrefObj.euISO,
      FSR_PrintSignature: this.userPrefObj.printSign,
      FSR_PrintInstallBase: this.userPrefObj.printInstallBase,
      FSR_PrintAttachment: this.userPrefObj.attachment,
      AddressId: this.userPrefObj.address,
      AddressIdCh: this.userPrefObj.chineseAddress,
      Date_Format: this.valueService.getUserPreferences()[0].Date_Format,
      DoNotShowModal: this.userPrefObj.donotDisplay,
      FSR_Disclaimer: this.userPrefObj.disclaimer,
      ShowNonBillableEntries: this.userPrefObj.ShowNonBillableEntries,
      FSR_PrintChargeMethod : this.userPrefObj.FSR_PrintChargeMethod
    };
    this.valueService.setUserFSRPreferences(this.fsrprefernces);
    this.events.publish("refreshPreferences", null);
    this.viewCtrl.dismiss(this.fsrprefernces);
    // this.logger.log(this.fileName, "savePreferences", this.valueService.getUserFSRPreferences());
  }
  /**
   * 07/23/2018 Zohaib Khan
   *Added saveDoNotShowModalFlag() to save the updated value
    of do not show again flag to value service and User preferences Database.
    The method saveDoNotShowModalFlag() is calling from Do not show again checkbox ionChange
   * @memberof UserPreferencesModalPage
   */
  saveDoNotShowModalFlag() {

    let mainUserpref = Object.assign({}, this.valueService.getUserPreferences());
    mainUserpref[0].Do_Not_Show_Modal = String(this.userPrefObj.donotDisplay);
    this.localService.updateUserPreferrencesModal(mainUserpref[0]).then(res => {
      this.valueService.setUserPreferences(mainUserpref);
      this.valueService.setUserFSRPreferences(null);
    }).catch((error : any) => {
      this.logger.log(this.fileName, "saveDoNotShowModalFlag"," Error in updateUserPreferrencesModal : " +JSON.stringify(error));

    });

  }
}

