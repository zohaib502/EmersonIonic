import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, MenuController, Events, Platform } from 'ionic-angular';
import { ValueProvider } from '../../providers/value/value';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { UtilityProvider } from '../../providers/utility/utility';
import { SyncProvider } from '../../providers/sync/sync';
import { LoggerProvider } from '../../providers/logger/logger';
import { TranslateService } from '@ngx-translate/core';
import * as Enums from '../../enums/enums';
import { HttpClient } from "@angular/common/http";
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-user-preferences',
  templateUrl: 'user-preferences.html',
})
export class UserPreferencesPage {
  /**
   *07/23/2018 Zohaib Khan
    userPrefObj create in order to get rid of all variables
   *
   * @type {*}
   * @memberof UserPreferencesPage
   */
  userPrefObj: any = {
    showChargeMethod: false,
    printNote: false,
    printTime: false,
    printMaterial: false,
    printExpense: false,
    printAttach: false,
    printSig: false,
    printinstall: false,
    euiso: false,
    do_not_show_modal: false,
    chineseAddress: "",
    address: "",
    country: "",
    dateFormat: "",
    timeZoneID: "",
    preLangCode: [],
    currency_Id: "",
    UOM_Id: "",
    disclaimer: false,
    FSRLang: [],
    ShowNonBillableEntries: false,
    WorldAreaID: "",
    listView: "w" ,//By VIVEK On 25 APR -2019 for user's preference List view
    STARTDAYOFWEEK:"Monday", // Preeti Varshney 09/04/2019 -- User's preference  STARTDAYOFWEEK,
    FSR_PrintChargeMethod: false
  };
  UOM: any = [];
  fileName: any = 'User_Preferences_Page';
  header_data: any;
  currency: any = [];
  timezonesList: any = [];
  allCountries: any = [];
  user_Preferences: any = [];
  preferedLanguage: any = [];
  allAddresses: any = [];
  allAddressesCountry: any = [];
  filteredAddress: any = [];
  updatedUP: any = [];
  newPreferedLang: any = [];
  currencyName: any;
  public userPrefObject: any = {}
  timeZone: any;
  // 01-30-2019 -- Mansi Arora -- declare variable for timeZoneIANA
  timeZoneIANA: any;
  toast: any;
  customerSignaturePage: any;
  chineseAddressList: any = [];
  showSelects: boolean = true;
  flag: boolean = false;
  FSRPrintLanguages: any = [];
  enums: any;
  worldarea: any = [];
  dayWise: boolean = false;

  constructor(public http: HttpClient, public logger: LoggerProvider, public translateService: TranslateService, public syncProvider: SyncProvider, public menuController: MenuController, public localService: LocalServiceProvider, public viewCtrl: ViewController, public valueService: ValueProvider, public navCtrl: NavController, public navParams: NavParams, public events: Events, public utilityProvider: UtilityProvider, public platform: Platform) {
    this.enums = Enums;
    this.header_data = { title1: "", title2: "User Preferences", taskId: "" };
    // this.http = http;
  }
  /**
   *07/23/2018 Zohaib Khan
   * Added method  this.getUOMList(); to get the UOM List
   * @memberof UserPreferencesPage
   */
  ionViewDidLoad() {
    this.getFSRPrintLang();
    this.customerSignaturePage = this.navParams.get('customerSignaturePage');
    this.user_Preferences = this.valueService.getUserPreferences();
    this.getUOMList();
    this.getcurrency();
    this.getpreferedLanguage();
    this.getCountry().then((res) => {
      this.setfieldValue();
    })
      // 12-28-2018 -- Mansi Arora -- error handled by logging
      .catch((err: any) => {
        this.logger.log(this.fileName, 'ionViewDidLoad', 'Error in ionViewDidLoad, getCountry : ' + JSON.stringify(err));
      });
    this.getActivetimeZoneList();
    this.getWorldArea();
  }

  ionViewDidEnter() {
    //Prateek(23/01/2019) Shifted all events in didenter.
    this.events.subscribe('langSelected', (res) => {
      // 10-12-18 Radheshyam - the dom will refresh and show the current language in dropbox.
      setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
    this.menuController.enable(true);
    this.menuController.open();
    // Set the value: true onload of user prefences to refresh time page.
    this.valueService.setUserPrefLoaded(true);
  }

  selectTimezoneName(value) {
    let filtered = this.timezonesList.filter(item => {
      return item.TimeZoneID == value;
    })[0];
    if (filtered != undefined) {
      this.timeZone = filtered.TimeZone_Name;
      // 01-30-2019 -- Mansi Arora -- set value for timeZoneIANA
      this.timeZoneIANA = filtered.TimeZoneIANA;
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  removeDuplicates(arr) {
    let unique_array = []
    for (let i = 0; i < arr.length; i++) {
      if (unique_array.indexOf(arr[i]) == -1) {
        unique_array.push(arr[i])
      }
    }
    return unique_array
  }

  getCountry() {
    return new Promise((resolve, reject) => {
      this.getcountrynames().then((response: any[]) => {
        this.chineseAddressList = this.allCountries.filter((item) => {
          return item.Language == 'zh-cn';
        });
        for (let i = 0; i < this.allCountries.length; i++) {
          this.allAddressesCountry.push(this.allCountries[i].Country_Name);
        }
        this.allAddressesCountry = this.removeDuplicates(this.allAddressesCountry);
        resolve(true)
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'getCountry', 'Error in getCountry, getcountrynames : ' + JSON.stringify(error));
        reject(error);
      });
    });
  }

  getcurrency() {
    if (this.valueService.getCurrency.length > 0) {
      this.currency = this.valueService.getCurrency();
    }
    else {
      this.localService.getCurrencyList().then((res: any[]) => {
        this.currency = res;
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'getcurrency', 'Error in getcurrency, getCurrencyList local service : ' + JSON.stringify(error));
      });
    }
  }

  getpreferedLanguage() {
    if (this.valueService.getEnabledLanguageList().length > 0) {
      this.preferedLanguage = this.valueService.getEnabledLanguageList();
      this.preferedLanguage.sort((a, b) => {
        let langA = a.Lang_Name.toUpperCase();
        let langB = b.Lang_Name.toUpperCase();
        if (langA < langB) {
          return -1
        }
        if (langA > langB) {
          return 1;
        }
        return 0;
      });
    }
    else {
      this.localService.getEnabledLanguages().then((res: any[]) => {
        this.preferedLanguage = res;
        this.valueService.setEnabledLanguageList(res);
        this.preferedLanguage.sort((a, b) => {
          let langA = a.Lang_Name.toUpperCase();
          let langB = b.Lang_Name.toUpperCase();
          if (langA < langB) {
            return -1
          }
          if (langA > langB) {
            return 1;
          }
          return 0;
        });
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'getpreferedLanguage', 'Error in getpreferedLanguage, getEnabledLanguages local service : ' + JSON.stringify(error));
      });
    }
  }

  getAllAddresses() {
    return new Promise((resolve, reject) => {
      this.localService.getAddresses().then((res: any[]) => {
        this.allAddresses = res;
        resolve(res);
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'getAllAddresses', 'Error in getAllAddresses, getAddresses local service : ' + JSON.stringify(error));
      });
    }).catch((err: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'getAllAddresses', 'Error in getAllAddresses : ' + JSON.stringify(err));
    });
  }

  getcountrynames() {
    // let self = this;
    return new Promise((resolve, reject) => {
      // if (this.valueService.getEnabledCountryList().length > 0) {
      //   this.allCountries = this.valueService.getEnabledCountryList();
      //   resolve(this.allCountries);
      // }
      // else {
      this.localService.getCountryNames().then((res: any[]) => {
        this.allCountries = res;
        this.valueService.setEnabledCountryList(res);
        resolve(res);
      }).catch((err: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'getcountrynames', 'Error in getcountrynames, getCountryNames local service : ' + JSON.stringify(err));
      });
      // }
    }).catch((err: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'getcountrynames', 'Error in getcountrynames : ' + JSON.stringify(err));
    });
  }

  selectCountyAddress() {
    this.filteredAddress = [];
    this.filteredAddress = this.allCountries.filter((item) => {
      return item.Country_Name == this.userPrefObj.country && item.Language != 'zh-cn';
    });
    this.chineseAddressList = this.allCountries.filter((item) => {
      return item.Language == 'zh-cn';
    });
  }

  selectCurrencyName(value) {
    let filtered = this.currency.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.currencyName = filtered.Value;
    }
  }
  selectLangName() {
    for (let i = 0; i < this.userPrefObj.preLangCode.length; i++) {
      if (this.userPrefObj.preLangCode[i] == "") {
        this.userPrefObj.preLangCode = [];
      }
    }
    if (this.userPrefObj.preLangCode.length > 3) {
      this.toast = "Please select only 3 languages";
      this.utilityProvider.presentToast(this.toast, 2000, 'top', 'feedbackToast');
    } else {

      // 12-28-2018 -- Mansi Arora -- commenting data logged
      // this.logger.log(this.fileName, 'selectLangName getUserPreferences', this.valueService.getUserPreferences());
      // this.logger.log(this.fileName, 'selectLangName Preferred_language', this.valueService.getUserPreferences()[0].Preferred_language);

      this.newPreferedLang = this.userPrefObj.preLangCode.filter((item) => {
        return item != this.valueService.getUserPreferences()[0].Preferred_language.split(',');
      });
      // 12-28-2018 -- Mansi Arora -- commenting data logged
      // this.logger.log(this.fileName, 'selectLangName newPreferedLang', this.newPreferedLang);

    }
  }

  setfieldValue() {
    // let self = this;
    // 12-28-2018 -- Mansi Arora -- commenting data logged
    // self.logger.log(self.fileName, 'setfieldValue', JSON.stringify(self.user_Preferences[0]));
    this.userPrefObj.currency_Id = String(this.user_Preferences[0].Default_Currency);
    this.userPrefObj.dateFormat = String(this.user_Preferences[0].Date_Format);
    this.userPrefObj.UOM_Id = this.user_Preferences[0].UOM_Id;
    this.userPrefObj.UOM = this.user_Preferences[0].UOM;
    this.userPrefObj.listView = this.user_Preferences[0].ListView;
    this.userPrefObj.STARTDAYOFWEEK=this.user_Preferences[0].STARTDAYOFWEEK;
    this.userPrefObj.FSR_PrintChargeMethod = this.user_Preferences[0].FSR_PrintChargeMethod;

    this.dayWise = (this.userPrefObj.listView == "d") ? true : false;

    let arr = this.user_Preferences[0].Preferred_language;
    // 01-04-2019 -- Mansi Arora -- check for undefined and null value before splitting
    let finalPrefferedLanguage = arr ? arr.split(',') : [];
    // 01-04-2019 -- Mansi Arora -- using filter method to remove blank values from the array
    let newArray = finalPrefferedLanguage.filter(function (element) {
      if (element != '') return element;
    });
    this.userPrefObj.preLangCode = newArray;
    //this.timeZone = this.user_Preferences[0].Timezone;
    let FSRLang = this.user_Preferences[0].FSR_Languages;
    let FSRLangArr = FSRLang.split(',');
    this.userPrefObj.FSRLang = FSRLangArr;
    this.getcountrynames().then((res: any[]) => {
      let getDbAddress = this.allCountries.filter((item) => {
        return item.AddressId == this.user_Preferences[0].AddressId;
      });
      let getChDbAddress = this.allCountries.filter((item) => {
        return item.AddressId == this.user_Preferences[0].AddressIdCh;
      });
      if (getDbAddress.length != 0) {
        this.userPrefObj.country = String(getDbAddress[0].Country_Name);
        this.selectCountyAddress();
        if (this.user_Preferences[0].AddressId != null || this.user_Preferences[0].AddressId != undefined) {
          this.userPrefObj.address = getDbAddress[0].AddressId;
        }
      }
      if (getChDbAddress.length != 0) {
        this.userPrefObj.country = String(getDbAddress[0].Country_Name);
        this.selectCountyAddress();
        if (this.user_Preferences[0].AddressIdCh != null || this.user_Preferences[0].AddressIdCh != undefined) {
          this.userPrefObj.chineseAddress = getChDbAddress[0].AddressId;
        }
      }
      if (getDbAddress.length != 0 && getChDbAddress.length != 0) {
        this.userPrefObj.country = String(getDbAddress[0].Country_Name);
        this.selectCountyAddress();
        this.userPrefObj.address = getDbAddress[0].AddressId;
        this.userPrefObj.chineseAddress = getChDbAddress[0].AddressId;
      }
    }).catch((error: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'setfieldValue', 'Error in setfieldValue, getCountryNames : ' + JSON.stringify(error));
    });
    //11/05/2018 Zohaib Khan: If task is in Debrief In Progress Or Debried Declined then use the flags for Onsite expense from task table.
    if (this.valueService.getTaskObject() && ((String(this.valueService.getTaskObject().StatusID) == String(Enums.Jobstatus.Debrief_In_Progress)) || String(this.valueService.getTaskObject().StatusID) == String(Enums.Jobstatus.Debrief_Declined))) {
      if (String(this.valueService.getTaskObject().FSR_PrintExpenseOnSite) == 'true') {
        this.userPrefObj.printExpense = true;
      } else {
        this.userPrefObj.printExpense = false;
      }
    } else {
      if (String(this.user_Preferences[0].FSR_PrintExpense) == "true" || this.user_Preferences[0].FSR_PrintExpense == true) {
        this.userPrefObj.printExpense = true;
      } else {
        this.userPrefObj.printExpense = false;
      }
    }

    if (String(this.user_Preferences[0].FSR_PrintExpenseComplete) == "true" || this.user_Preferences[0].FSR_PrintExpenseComplete == true) {
      this.userPrefObj.printExpenseCompleted = true;
    } else {
      this.userPrefObj.printExpenseCompleted = false;
    }

    if (String(this.user_Preferences[0].FSR_PrintInstallBase) == "true" || this.user_Preferences[0].FSR_PrintInstallBase == true) {
      this.userPrefObj.printinstall = true;
    } else {
      this.userPrefObj.printinstall = false;
    }

    if (String(this.user_Preferences[0].FSR_PrintTime) == "true" || this.user_Preferences[0].FSR_PrintTime == true) {
      this.userPrefObj.printTime = true;
    } else {
      this.userPrefObj.printTime = false;
    }

    if (String(this.user_Preferences[0].FSR_PrintNote) == "true" || this.user_Preferences[0].FSR_PrintNote == true) {
      this.userPrefObj.printNote = true;
    } else {
      this.userPrefObj.printNote = false;
    }

    if (String(this.user_Preferences[0].FSR_PrintMaterial) == "true" || this.user_Preferences[0].FSR_PrintMaterial == true) {
      this.userPrefObj.printMaterial = true;
    } else {
      this.userPrefObj.printMaterial = false;
    }

    if (String(this.user_Preferences[0].FSR_PrintEUISO) == "true" || this.user_Preferences[0].FSR_PrintEUISO == true) {
      this.userPrefObj.euiso = true;
    } else {
      this.userPrefObj.euiso = false;
    }
    if (String(this.user_Preferences[0].FSR_PrintAttachment) == "true" || this.user_Preferences[0].FSR_PrintAttachment == true) {
      this.userPrefObj.printAttach = true;
    } else {
      this.userPrefObj.printAttach = false;
    }

    if (String(this.user_Preferences[0].Do_Not_Show_Modal) == "true" || this.user_Preferences[0].Do_Not_Show_Modal == true) {
      this.userPrefObj.do_not_show_modal = true;
    } else {
      this.userPrefObj.do_not_show_modal = false;
    }

    if (String(this.user_Preferences[0].FSR_Disclaimer) == "true" || this.user_Preferences[0].FSR_Disclaimer == true) {
      this.userPrefObj.disclaimer = true;
    } else {
      this.userPrefObj.disclaimer = false;
    }
    if (String(this.user_Preferences[0].ShowNonBillableEntries) == "true" || this.user_Preferences[0].ShowNonBillableEntries == true) {
      this.userPrefObj.ShowNonBillableEntries = true;
    } else {
      this.userPrefObj.ShowNonBillableEntries = false;
    }
    if (String(this.user_Preferences[0].ShowChargeMethod) == "true" || this.user_Preferences[0].ShowChargeMethod == true) {
      this.userPrefObj.showChargeMethod = true;
    } else {
      this.userPrefObj.showChargeMethod = false;
    }
    let worldArea;
    worldArea = this.user_Preferences[0].WorldAreaID;
    if (worldArea == undefined) {
      this.userPrefObj.WorldAreaID = this.valueService.getUser().WorldAreaID;
    }
    else {
      this.userPrefObj.WorldAreaID = this.user_Preferences[0].WorldAreaID;
    }
    if (String(this.user_Preferences[0].FSR_PrintChargeMethod) == "true" || this.user_Preferences[0].FSR_PrintChargeMethod == true) {
      this.userPrefObj.FSR_PrintChargeMethod = true;
    } else {
      this.userPrefObj.FSR_PrintChargeMethod = false;
    }
  }


  /**
   * 07/27/2018 Zohaib Khan
   * changed the method name from addObject to saveUserPreferences().
   * the method is getting field values and updating them in database and in valueservice.
   *
   */
  saveUserPreferences() {
    this.utilityProvider.closeFab();
    let preLangId = [];
    let fsrLangId = [];

    let self = this;
    for (let i = 0; i < this.preferedLanguage.length; i++) {
      for (let j = 0; j < this.userPrefObj.preLangCode.length; j++) {
        if (this.preferedLanguage[i].Code == this.userPrefObj.preLangCode[j]) {
          preLangId.push(this.preferedLanguage[i].Lang_Id);
        }
      }
    }
    this.utilityProvider.showSpinner();
    if (this.chineseAddressList.length == 0) {
      this.userPrefObj.chineseAddress = "";
    }
    if (this.filteredAddress.length == 0) {
      this.userPrefObj.address = "";
    }
    this.userPrefObject = {
      ResourceID: this.valueService.getResourceId(),
      Email: this.valueService.getUser().Email,
      Default_Currency: this.userPrefObj.currency_Id,
      Preferred_language: this.userPrefObj.preLangCode,
      Preferred_language_Id: preLangId,
      Timezone: this.timeZone ? this.timeZone : this.valueService.getUserPreferences()[0].Timezone,
      // 01-30-2019 -- Mansi Arora -- set value for timeZoneIANA to update user preferences
      timeZoneIANA: this.timeZoneIANA ? this.timeZoneIANA : this.valueService.getUserPreferences()[0].timeZoneIANA,
      FSR_PrintNote: this.userPrefObj.printNote,
      FSR_PrintExpense: this.userPrefObj.printExpense,
      FSR_PrintExpenseComplete: this.userPrefObj.printExpenseCompleted,
      FSR_PrintMaterial: this.userPrefObj.printMaterial,
      FSR_PrintTime: this.userPrefObj.printTime,
      FSR_PrintSignature: this.userPrefObj.printSig,
      FSR_PrintInstallBase: this.userPrefObj.printinstall,
      FSR_PrintEUISO: this.userPrefObj.euiso,
      FSR_PrintAttachment: this.userPrefObj.printAttach,
      Date_Format: this.userPrefObj.dateFormat,
      AddressId: this.userPrefObj.address,
      AddressIdCh: this.userPrefObj.chineseAddress,
      SelectedLanguage: this.valueService.getSelectedLang(),
      Do_Not_Show_Modal: this.userPrefObj.do_not_show_modal,
      UOM: this.userPrefObj.UOM,
      UOM_Id: this.userPrefObj.UOM_Id,
      //07/25/2018 Zohaib Khan
      // Setting FSR_Disclaimer with userPrefObj.disclaimer value
      FSR_Disclaimer: this.userPrefObj.disclaimer,
      FSR_Languages: this.userPrefObj.FSRLang,
      ShowNonBillableEntries: this.userPrefObj.ShowNonBillableEntries,
      WorldAreaID: this.userPrefObj.WorldAreaID,
      ShowChargeMethod: this.userPrefObj.showChargeMethod,
      // By VIVEK ON 25 APR-2019 set user list view preferences
      ListView: this.dayWise ? 'd' : 'w',
      STARTDAYOFWEEK: this.userPrefObj.STARTDAYOFWEEK,
      FSR_PrintChargeMethod: this.userPrefObj.FSR_PrintChargeMethod
    };

    let hasSelectedLang = this.userPrefObj.preLangCode.filter((item) => { return item == this.valueService.getSelectedLang() }).length > 0;
    self.logger.log("UserPreferences.ts", "hasSelectedLang", hasSelectedLang);

    if (!hasSelectedLang) {
      this.userPrefObject.SelectedLanguage = 'en-gb';
      this.translateService.use('en-gb');
    }
    if (this.userPrefObj.preLangCode.length == 1) {
      this.userPrefObject.SelectedLanguage = this.userPrefObj.preLangCode[0];
      this.translateService.use(this.userPrefObj.preLangCode[0]);
    }

    if (this.userPrefObj.FSRLang.length > 0) {
      for (let i = 0; i < this.preferedLanguage.length; i++) {
        for (let j = 0; j < this.userPrefObj.FSRLang.length; j++) {
          if (this.preferedLanguage[i].Code == this.userPrefObj.FSRLang[j]) {
            fsrLangId.push(this.preferedLanguage[i].Lang_Id);
          }
        }
      }

    }
    if (this.userPrefObj.preLangCode.length > 3) {
      this.utilityProvider.stopSpinner();
      this.toast = 'Please select only 3 languages';
      this.utilityProvider.presentToast(this.toast, 2000, 'top', 'feedbackToast');
    } else {
      /*
      07/27/2018 Zohaib Khan
      Setting this.userPrefObject.UOM = '' if user select Select UOM from dropdown
      */
      if (!this.userPrefObject.UOM_Id) {
        this.userPrefObject.UOM = ''
      }
      this.localService.updateUserPreferrences(this.userPrefObject).then((res): any => {
        /*
        07/27/2018 Zohaib Khan
        Converting Preferred_language and Preferred_language_Id from array to comma separated.
        */
        this.userPrefObject.Preferred_language = this.userPrefObject.Preferred_language.join();
        this.userPrefObject.Preferred_language_Id = this.userPrefObject.Preferred_language_Id.join();
        this.userPrefObject.FSR_Languages = this.userPrefObject.FSR_Languages.join();

        //09/12/2018 kamal : implemented online/offline check for saving user preference
        // if (this.isOnline()) {
        //   this.valueService.setUserPreferences([this.userPrefObject]);
        //   // this.events.publish('refreshPreferences', null);
        //   // this.saveLanguageFiles();
        // }
        // else {
          let promiseArr = [];
          for (let j = 0; j < this.userPrefObj.preLangCode.length; j++) {
            promiseArr.push(this.checkIfFlagExists(this.userPrefObj.preLangCode[j]))
          }
          Promise.all(promiseArr).then((res) => {
            let langsErr = "";
            for (let i = 0; i < res.length; i++) {
              for (let j = 0; j < this.userPrefObj.preLangCode.length; j++) {
                if (res[i] == this.userPrefObj.preLangCode[j]) {
                  this.preferedLanguage.filter(lang => {
                    return lang.Code == res[i];
                  })[0].Lang_Name;
                  langsErr = langsErr + this.preferedLanguage.filter(lang => {
                    return lang.Code == res[i];
                  })[0].Lang_Name + ", ";
                  this.userPrefObj.preLangCode.splice(j, 1);
                }
              }
            }
            langsErr = langsErr.length > 0 ? langsErr.substring(0, langsErr.lastIndexOf(",")) : langsErr;
            if (this.flag) {
              //console.log('Unable to download');
              this.utilityProvider.stopSpinner();
              //11/05/2018 kamal: changed verbiage.
              self.utilityProvider.presentToast('User Preferences saved. Unable to download ' + langsErr + '\n' + ' Language due to server connection error.', 4000, 'top', '');
              this.userPrefObject.Preferred_language = this.userPrefObj.preLangCode;
              preLangId = [];
              for (let i = 0; i < this.preferedLanguage.length; i++) {
                for (let j = 0; j < this.userPrefObj.preLangCode.length; j++) {
                  if (this.preferedLanguage[i].Code == this.userPrefObj.preLangCode[j]) {
                    preLangId.push(this.preferedLanguage[i].Lang_Id);
                  }
                }
              }
              this.userPrefObject.Preferred_language_Id = preLangId;
              this.localService.updateUserPreferrences(this.userPrefObject).then((res): any => {
                this.userPrefObject.Preferred_language = this.userPrefObject.Preferred_language.join();
                this.userPrefObject.Preferred_language_Id = this.userPrefObject.Preferred_language_Id.join();
                this.userPrefObject.FSR_Languages = this.userPrefObject.FSR_Languages.join();
                this.valueService.setUserPreferences([this.userPrefObject]);
                this.events.publish('refreshPreferences', null);
              })
                // 12-28-2018 -- Mansi Arora -- error handled by logging
                .catch((error: any) => {
                  this.logger.log(this.fileName, 'saveUserPreferences', 'Error in saveUserPreferences, updateUserPreferrences local service : ' + JSON.stringify(error));
                });
              //09/07/2018 kamal : refresh preferred language dropdown
              this.showSelects = false;
              setTimeout(() => { this.showSelects = true; }, 1)
              this.flag = false;
            }
            else {
              this.valueService.setUserPreferences([this.userPrefObject]);
              this.events.publish('refreshPreferences', null);
              // this.saveLanguageFiles();
              this.utilityProvider.stopSpinner();
              this.toast = 'User Preferences has been saved!';
              this.utilityProvider.presentToast(this.toast, 2000, 'top', 'feedbackToast');
            }
          })
            // 12-28-2018 -- Mansi Arora -- error handled by logging
            .catch((error: any) => {
              this.logger.log(this.fileName, 'saveUserPreferences', 'Error in saveUserPreferences, promise.all : ' + JSON.stringify(error));
              this.utilityProvider.stopSpinner();
            });
        // }

      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'saveUserPreferences', 'Error in saveUserPreferences, updateUserPreferrences local service : ' + JSON.stringify(error));
        this.utilityProvider.stopSpinner();
      });
    }
    this.events.publish("UserSelectedTimeZone", null);
    this.utilityProvider.stopSpinner(); // Need to check the right place
  }
  /**
   *09/12/2018 kamal: check if selected language flag is present in lang folder of file location
   *
   * @param {*} lang
   * @returns
   * @memberof UserPreferencesPage
   */
  checkIfFlagExists(lang) {
    let filepath = cordova.file.dataDirectory;
    return new Promise((resolve, reject) => {
      this.utilityProvider.checkFileIfExist(filepath + '/lang/', lang + '.png').then((result) => {
        if (!result) {
          resolve(lang);
          this.flag = true;
        }
        else {
          resolve('false')
        }
      })
        // 12-28-2018 -- Mansi Arora -- error handled by logging
        .catch((error: any) => {
          this.logger.log(this.fileName, 'checkIfFlagExists', 'Error in checkIfFlagExists, checkFileIfExist utility ptovider : ' + JSON.stringify(error));
        });
    })
      // 12-28-2018 -- Mansi Arora -- error handled by logging
      .catch((error: any) => {
        this.logger.log(this.fileName, 'checkIfFlagExists', 'Error in checkIfFlagExists : ' + JSON.stringify(error));
      });
  }

  // saveLanguageFiles() {
  //   let self = this;
  //   this.syncProvider.saveLanguageFiles().then((res: any) => {
  //     // 08/23/2018 Mayur Varshney -- handle savelanguage file on the basis of response(true,false) getting from sync.ts
  //     if (res.status == true) {
  //       this.valueService.setUserPreferences([this.userPrefObject]);
  //       this.events.publish('refreshPreferences', null);
  //       // this.events.publish('listViewUserPreference', null);//On 15 MAY 2019
  //       this.utilityProvider.stopSpinner();
  //       this.toast = 'User Preferences has been saved!';
  //       this.utilityProvider.presentToast(this.toast, 2000, 'top', 'feedbackToast');
  //     } else {
  //       self.logger.log("UserPreferences.ts", "saveUserPreferences", "error in saveLanguageFiles - " + JSON.stringify(res));
  //       this.utilityProvider.stopSpinner();
  //       let langsErr = "";
  //       for (let i = 0; i < res.data.length; i++) {
  //         if (res.data[i].status == false) {
  //           for (let j = 0; j < this.userPrefObj.preLangCode.length; j++) {
  //             if (res.data[i].lang == this.userPrefObj.preLangCode[j]) {
  //               this.preferedLanguage.filter(lang => {
  //                 return lang.Code == res.data[i].lang;
  //               })[0].Lang_Name;
  //               langsErr = langsErr + this.preferedLanguage.filter(lang => {
  //                 return lang.Code == res.data[i].lang;
  //               })[0].Lang_Name + ", ";
  //               this.userPrefObj.preLangCode.splice(j, 1);
  //             }
  //           }
  //         }
  //       }
  //       langsErr = langsErr.length > 0 ? langsErr.substring(0, langsErr.lastIndexOf(",")) : langsErr;
  //       //09/07/2018 kamal : changed message if language download interrupt
  //       self.utilityProvider.presentToast('Unable to download ' + langsErr + '\n' + '. Please try again later.', 10000, 'top', '');

  //       this.userPrefObject.Preferred_language = this.userPrefObj.preLangCode;
  //       let preLangId = [];
  //       for (let i = 0; i < this.preferedLanguage.length; i++) {
  //         for (let j = 0; j < this.userPrefObj.preLangCode.length; j++) {
  //           if (this.preferedLanguage[i].Code == this.userPrefObj.preLangCode[j]) {
  //             preLangId.push(this.preferedLanguage[i].id);
  //           }
  //         }
  //       }
  //       this.userPrefObject.Preferred_language_Id = preLangId;
  //       this.localService.updateUserPreferrences(this.userPrefObject).then((res): any => {
  //         this.userPrefObject.Preferred_language = this.userPrefObject.Preferred_language.join();
  //         this.userPrefObject.Preferred_language_Id = this.userPrefObject.Preferred_language_Id.join();
  //         this.userPrefObject.FSR_Languages = this.userPrefObject.FSR_Languages.join();
  //         this.valueService.setUserPreferences([this.userPrefObject]);
  //         this.events.publish('refreshPreferences', null);
  //       })
  //         // 12-28-2018 -- Mansi Arora -- error handled by logging
  //         .catch((error: any) => {
  //           this.logger.log(this.fileName, 'saveLanguageFiles', 'Error in saveLanguageFiles, updateUserPreferrences local service : ' + JSON.stringify(error));
  //         });
  //       //09/07/2018 kamal : refresh preferred language dropdown
  //       this.showSelects = false;
  //       setTimeout(() => { this.showSelects = true; }, 1)
  //     }
  //   }).catch((error: any) => {
  //     this.utilityProvider.stopSpinner();
  //     // 12-28-2018 -- Mansi Arora -- change in logs comment
  //     this.logger.log(this.fileName, 'saveLanguageFiles', 'Error in saveLanguageFiles : ' + JSON.stringify(error));
  //   });
  // }

  isOnline() {
    return this.utilityProvider.isConnected();
  }

  // 03/07/2019 -- Mayur Varshney -- Fixes for timezone , will get timezone directly from localDB instead of valueProvider
  getActivetimeZoneList() {
    this.localService.getActiveTimeZoneList().then((res: any[]) => {
      this.timezonesList = res;
      this.valueService.setActiveTimeZoneList(res);
      this.userPrefObj.timeZoneID = this.timezonesList.filter(item => {
        return item.TimeZone_Name == this.valueService.getUserPreferences()[0].Timezone;
      })[0].TimeZoneID;
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getActivetimeZoneList', 'Error in getActiveTimeZoneList local service : ' + JSON.stringify(error));
    });
  }

  // 07/20/2018 Zohaib Khan
  // Added selectUOMName and getUOMList to get the list of UOM from local service and filter that list acvcording to ID's
  selectUOMName(value) {
    let filtered = this.UOM.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.userPrefObj.UOM = filtered.Value;
    }
  }

  getUOMList() {
    this.localService.getUOMList().then(res => {
      this.UOM = res;
    }).catch((error: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'getUOMList', 'Error in getUOMList, getUOMList local service : ' + JSON.stringify(error));
    });

  };

  //09/14/2018 Zohaib Khan: Getting FSR print languages from database
  getFSRPrintLang() {
    this.localService.getFSREnabledLanguages().then((res: any) => {
      this.FSRPrintLanguages = res;
    })
      // 12-28-2018 -- Mansi Arora -- error handled by logging
      .catch((error: any) => {
        this.logger.log(this.fileName, 'getFSRPrintLang', 'Error in getFSRPrintLang, getFSREnabledLanguages local service : ' + JSON.stringify(error));
      });
  }
  selectFSRLangName() {
    if (this.userPrefObj.FSRLang.length > 2) {
      this.toast = "Please select only 2 languages";
      this.utilityProvider.presentToast(this.toast, 2000, 'top', 'feedbackToast');
    }
  }

  /**
   *@author Prateek 12-27-2018
   *Get worldarea from lookup table
   * @memberof UserPreferencesPage
   */
  getWorldArea() {
    this.localService.getWorldArea().then((res: any[]) => {
      this.worldarea = res;
    });
  }
  /**
 *@author: Prateek(21/01/2019)
 *Unsubscribe all events.
 *App Optimization
 * @memberof CalendarPage
 */
  ionViewWillLeave(): void {
    this.events.unsubscribe('langSelected');
  }

  viewSelected() {
    this.dayWise = !this.dayWise;
  }

  // /**
  //  * Getting zip base64 from local data directory
  //  * @author Pulkit Agarwal
  //  * @returns
  //  * @memberof UserPreferencesPage
  //  */
  // getZipped() {
  //   try {
  //     let prefix = "log_";
  //     let suffix = ".log";
  //     let logArray = [];
  //     let previousDate = moment(new Date()).subtract(16, 'days');
  //     while (moment(new Date(previousDate)).isSameOrBefore(new Date())) {
  //       logArray.push(new Date(previousDate));
  //       previousDate.add(1, 'days');
  //     }
  //     return new Promise((resolve, reject) => {
  //       var zip = new JSZip();
  //       let dbDirectory = cordova.file.dataDirectory;
  //       if (this.platform.is('ios')) { dbDirectory = cordova.file.applicationStorageDirectory + "/Library/LocalDatabase/"; }
  //       this.utilityProvider.checkFileIfExist(dbDirectory, "emerson.sqlite").then(res => {
  //         if (res) {
  //           this.http.get(dbDirectory + "emerson.sqlite", { responseType: 'blob' }).subscribe(data => {
  //             zip.folder("DB").file("emerson.sqlite", data);
  //             logArray.forEach((element, index) => {
  //               let LogFileName = prefix + moment(element).format("MM-DD-YYYY") + suffix;
  //               this.utilityProvider.checkFileIfExist(cordova.file.dataDirectory + "/logs/", LogFileName).then(result => {
  //                 if (result) {
  //                   this.http.get(cordova.file.dataDirectory + "/logs/" + LogFileName, { responseType: 'text' })
  //                     .subscribe(data => {
  //                       zip.folder("Log_Files").file(LogFileName, data);
  //                       if (logArray.length == index + 1) {
  //                         setTimeout(() => {
  //                           zip.generateAsync({ type: "base64", compression: "DEFLATE" })
  //                             .then(function (content) {
  //                               resolve("data:application/zip;base64," + content);
  //                             });
  //                         }, 100);
  //                       }
  //                     })
  //                 }
  //               });
  //             });
  //           });
  //         } else {
  //           this.logger.log(this.fileName, 'openMail', 'sqlite File not exist');
  //           let msg = 'Unable to attach sqlite';
  //           this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
  //           reject('sqlite File not exist');
  //         }
  //       }).catch((error: any) => {
  //         this.logger.log(this.fileName, 'openMail', 'Error in checkFileIfExist : ' + JSON.stringify(error));
  //         let msg = 'Unable to attach sqlite';
  //         this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
  //       });
  //     }).catch((error: any) => {
  //       this.logger.log(this.fileName, 'openMail', 'Error in openMail : ' + JSON.stringify(error));
  //       let msg = 'Unable to attach zip!';
  //       this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
  //     });
  //   }
  //   catch (e) {
  //     this.logger.log(this.fileName, 'openMail', 'error in try catch block : ' + e.message);
  //   }
  // }

  // /**
  //  * attach/create zip file to mail modal
  //  * @author Pulkit Agarwal
  //  * @memberof UserPreferencesPage
  //  */
  // openMailModal() {
  //   try {
  //     this.utilityProvider.showSpinner();
  //     this.getZipped().then((res: any) => {
  //       let fileName = "Local_State_" + moment().format("YYYY-MM-DD") + ".zip";
  //       let base64 = res;
  //       let base64parts = base64.split(',');
  //       if (base64parts[1] != "") {
  //         let compatibleAttachment = base64parts[1];
  //         let params = {
  //           'isMail': true,
  //           'mailObj': {
  //             'attachment': [{ 'file_content': compatibleAttachment, 'file_name': fileName }],
  //             'to': 'SupportTeam',
  //             'cc': '',
  //             'subject': 'Issue reported for Field Service version ' + this.utilityProvider.getAppVersion(),
  //             'body': ''
  //           }
  //         };
  //         this.utilityProvider.stopSpinner();
  //         let mailModal = this.utilityProvider.showModal("MailPage", params, { enableBackdropDismiss: false, cssClass: 'Mail-Selector-Modal' });
  //         mailModal.present();
  //       }
  //       else {
  //         this.utilityProvider.stopSpinner();
  //         let msg = 'Unable to attach Zip!!!';
  //         this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
  //       }
  //     }).catch((error: any) => {
  //       this.logger.log(this.fileName, 'openMailModal', 'Error in getZipped : ' + JSON.stringify(error));
  //       this.utilityProvider.stopSpinner();
  //     });
  //   } catch (error) {
  //     this.utilityProvider.stopSpinner();
  //     this.logger.log(this.fileName, 'openMailModal', error.message);
  //   };
  // }

  openMailModal() {
    let mailModal = this.utilityProvider.showModal("MailPage", '', { enableBackdropDismiss: false, cssClass: 'Mail-Selector-Modal' });
    mailModal.present();
  }


}

