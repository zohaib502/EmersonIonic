import { Component, HostListener } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilityProvider } from '../../providers/utility/utility';
import { LoggerProvider } from '../../providers/logger/logger';
import { LocalServiceSdrProvider } from '../../providers/local-service-sdr/local-service-sdr';

/**
 * Generated class for the CustomerSearchModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-search-modal',
  templateUrl: 'customer-search-modal.html',
})
export class CustomerSearchModalPage {
  lovData: Array<any> = [];
  lovDataLength: any = 10;
  timeoutReference;
  timeout = 0.2e3;
  showErr: boolean = false;
  showSpinner: boolean = false;
  isDropdownVisible: boolean = false;
  Value: any;
  dropDownListLength: any;
  countries: Array<any> = [];
  searchFields = {
    accountno: '',
    customer: '',
    address1: '',
    address2: '',
    postalcode: '',
    city: '',
    country: ''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public utilityProvider: UtilityProvider, public logger: LoggerProvider, public localService: LocalServiceSdrProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerSearchModalPage');
    this.getCounty();
  }
  public closeModal() {
    this.viewCtrl.dismiss();
  }
  public getCounty() {
    this.localService.getCountries().then((res: any) => {
      if (res.length > 0) {
        this.countries = res;
      } else {
        this.countries = [];
      }
    });
  }
  //  function called on keyup to check the delay in typing
  doneTyping() {
    let self = this;
    if (this.timeoutReference) clearTimeout(this.timeoutReference);
    this.timeoutReference = setTimeout(function () {
      self.checkTimeOutValue();
    }, this.timeout);
  }
  //  if element is a dropdown, don't check typing delay
  checkTimeOutValue(isDropDown?) {
    if (!isDropDown) {
      if (!this.timeoutReference) return;
      this.timeoutReference = null;
    }
    this.searchParamsInDB();
  }
  // this method will pick the filtered items for the customer from the MST_Customer
  searchParamsInDB() {
    let searchClause = " where 1=1 ";
    this.showErr = true;
    if (this.searchFields.accountno != '') {
      // set showErr false if there are filters to apply
      this.showErr = false;
      searchClause += " and Account_Number like Lower('" + this.searchFields.accountno + "%')"

    }
    if (this.searchFields.customer != '') {
      // set showErr false if there are filters to apply
      this.showErr = false;
      searchClause += " and Lower(Name) like Lower('" + this.searchFields.customer + "%')"

    }
    if (this.searchFields.address1 != '') {
      // set showErr false if there are filters to apply
      this.showErr = false;
      searchClause += " and Lower(AddressLine1) like Lower('" + this.searchFields.address1 + "%')"

    }
    if (this.searchFields.address2 != '') {
      // set showErr false if there are filters to apply
      this.showErr = false;
      searchClause += " and Lower(AddressLine2) like Lower('" + this.searchFields.address2 + "%')"

    }
    if (this.searchFields.postalcode != '') {
      // set showErr false if there are filters to apply
      this.showErr = false;
      searchClause += " and Lower(Zipcode) like Lower('" + this.searchFields.postalcode + "%')"

    }
    if (this.searchFields.city != '') {
      // set showErr false if there are filters to apply
      this.showErr = false;
      searchClause += " and Lower(City) like Lower('" + this.searchFields.city + "%')"

    }
    if (this.searchFields.country != '') {
      // set showErr false if there are filters to apply
      this.showErr = false;
      searchClause += " and Lower(Country) like Lower('" + this.searchFields.country + "%')"

    }


    if (!this.showErr) {
      this.showSpinner = true;
      this.localService.getCustomerRecord(searchClause).then((res: any) => {
        if (res.length > 0) {
          this.showSpinner = false;
          this.lovData = res;
        } else {
          this.lovData = [];
          this.showSpinner = false;
        }
      });
    }
    else {
      //  if customer popup, set showErr as true else false
      this.showErr = true;
      //  clear record screen if serach filters are empty
      this.lovData = [];
      this.utilityProvider.presentToast("Please fill the fields to search.", 2000, 'top', '');
    }
  }
  selectedCustomer(data) {
    this.viewCtrl.dismiss(data);
  }
  setSelectedValue(option) {
    //02/08/2019 -- Mayur Varshney -- apply condition to hide dropdown

    this.searchFields.country = option ? option.Country_Name : null;
    // 02-16-2019 -- Mansi Arora -- call checkTimeOutValue on change of dropdown
    this.checkTimeOutValue(true);

    this.hideSearchSelectDropDown(true);
    this.hideSearchDropdown();
  }
  hideSearchDropdown() {
    //02/08/2019 -- Mayur Varshney -- remove timeout
    this.isDropdownVisible = false;
    this.Value = '';
  }

  //02/08/2019 -- Mayur Varshney -- apply condition to hide dropdown on outer select
  hideSearchSelectDropDown(childClick) {
    setTimeout(() => {
      if (!childClick) {
        this.hideSearchDropdown();
      }
    }, 100)
  }
  toggleSearchDropdown() {
    this.dropDownListLength = 10;
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    if (event.srcElement.scrollTop + event.srcElement.clientHeight == event.srcElement.scrollHeight) {
      // 02/25/2019 -- Mayur Varshney -- getting country list item's length from 6th index of PostRenderArgs.SearchColumns, change index if adding or removing any field into this searchColumns
      if (this.countries.length > 10 && (this.countries.length > this.dropDownListLength)) {
        this.dropDownListLength += 10;
      }
    }
  }

}
