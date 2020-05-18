import { Component, HostListener, ViewChild, AfterViewChecked } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,Platform } from 'ionic-angular';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { ValueProvider } from '../../providers/value/value';
import { LoggerProvider } from '../../providers/logger/logger';
import { UtilityProvider } from '../../providers/utility/utility';
import * as Enums from "../../enums/enums";
import { TranslateService } from '@ngx-translate/core';
import { SearchPipe } from '../../pipes/search/search';
import { FilterUniquePipe } from '../../pipes/filter-unique/filter-unique';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';

/**
 * Generated class for the CommonSearchModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-common-search-modal',
  templateUrl: 'common-search-modal.html',
})
export class CommonSearchModalPage implements AfterViewChecked {
  @ViewChild('searchInput') searchInput;

  lovData: Array<any> = [];
  lovDataLength: any = 10;
  element: any;
  // noRecord: boolean = false;
  fileName: any = 'Common_Search_Modal';
  Enums: any = Enums;
  PostRenderArgs: any;
  pageNumber: number = 1;
  showSpinner: boolean = false;
  // JSON: any = JSON;
  // 02-16-2019 -- Mansi Arora -- set showErr, ErrorText, timeoutReference, timeout variables for smartsearch on keyup
  showErr: boolean = false;
  ErrorText: string = 'Please fill the fields to search.';
  timeoutReference;
  timeout = 0.2e3;
  dropDownListLength: any;
  Value: any;
  isDropdownVisible: boolean = false;
  isDataSearched: any = false;
  setFocusDebounced = new Subject();

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public localService: LocalServiceProvider, public valueProvider: ValueProvider, public loggerProvider: LoggerProvider, public utilityProvider: UtilityProvider, public translate: TranslateService, public searchPipe: SearchPipe, public filterUnique: FilterUniquePipe,private platform: Platform) {
    this.element = this.navParams.get('element');
    this.PostRenderArgs = this.utilityProvider.isNotNull(this.element.PostRenderArgs) ? JSON.parse(this.element.PostRenderArgs) : {};
    this.PostRenderArgs.SearchColumns = this.PostRenderArgs.SearchColumns ? this.PostRenderArgs.SearchColumns : [{"type" : "text", "key" : "LookupValue"}];
    this.PostRenderArgs.SearchColumns.forEach((item) => {
      if (item.type == 'select') this.loadDropdownData(item);
    });
    if(this.element.ElementID != Enums.Elements.Customer) {
      this.lovData = this.navParams.get('dataSource');
    }

    // set focus on the input field after modal is open 
    // set debounce equal to 500 to prevent the multiple calls on keypress.
    this.setFocusDebounced.pipe(debounceTime(500)).subscribe(() => {
      this.searchInput.setFocus();
    });
  }

  // seach functionalities goes here
  public closeModal() {
    this.viewCtrl.dismiss();
  }

  // checkRecords() {
  //   if (this.lovData.length == 0) {
  //     this.noRecord = true;
  //   } else {
  //     this.noRecord = false;
  //   }
  // }

  //This method select item from the list
  selectItem(obj, index) {
    this.viewCtrl.dismiss({selectedItem :obj });
  }

  ngAfterViewChecked() {
      // Focus not setting up on serach elements
      this.element = this.navParams.get('element');
      if(this.element.ElementID != Enums.Elements.Customer && !this.platform.is('ios')){
        this.setFocusDebounced.next(true);
      }
  }

  trackByFn(index, item) {
    if(item && item.id) {
      return item.id;
    } else {
      return index;
    }
  }

  // 02-16-2019 -- Mansi Arora -- function called on keyup to check the delay in typing
  doneTyping() {
    let self = this;
    if (this.timeoutReference) clearTimeout(this.timeoutReference);
    this.timeoutReference = setTimeout(function () {
      self.checkTimeOutValue();
    }, this.timeout);
  }

  // 02-16-2019 -- Mansi Arora -- if element is a dropdown, don't check typing delay
  checkTimeOutValue(isDropDown?) {
    if (!isDropDown) {
      if (!this.timeoutReference) return;
      this.timeoutReference = null;
    }
    this.searchParamsInDB();
  }

  // this method will pick the filtered items for the customer from the MST_Customer
  searchParamsInDB() {
    // this.noRecord = false;
    let nonNullFields = this.PostRenderArgs.SearchColumns.filter((field) => field.value && field.value.trim() != '')
    if (nonNullFields.length > 0) {
      // 02-16-2019 -- Mansi Arora -- set showErr false if there are filters to apply
      this.showErr = false;
      switch (this.PostRenderArgs.DataSource) {
        case "MST_Customer":
          this.getLocalDbData(nonNullFields, this.PostRenderArgs.DataSource, true, this.PostRenderArgs.LookUpAlias, this.PostRenderArgs.LookUpAliasValue);
          break;
        case "Lookup":
          this.getLookupLov(nonNullFields);
          break;
      }
    } else {
      // 02-16-2019 -- Mansi Arora -- if customer popup, set showErr as true else false
      if (this.PostRenderArgs.DataSource == 'MST_Customer') {
        this.showErr = true;
        // 02-18-2019 -- Mansi Arora -- clear record screen if serach filters are empty
        this.lovData = [];
      } else {
        this.showErr = false;
        this.utilityProvider.presentToast("Please fill the fields to search.", 2000, 'top', '');
      }
    }
  }

  //this method commonly work for both single search and multiple search and get the filtered data from the db.
  getLocalDbData(params, tableName, check, LookUpAlias, LookUpAliasValue) {
    this.isDataSearched = true;
    this.showSpinner = true;
    this.localService.getFilteredData(params, tableName, check, LookUpAlias, LookUpAliasValue).then((res: any) => {
      if (res.length > 0) {
        this.showSpinner = false;
        this.lovData = res;
      } else {
        this.lovData = [];
        this.showSpinner = false;
        // this.checkRecords();
      }
    })
  }

  getLookupLov(params) {
    this.showSpinner = true;
    // params[this.element.ElementName] = this.element.ElementName;
    this.localService.getLookupByTypeOnSearchModal(params, this.element.ElementName).then((res: any) => {
      if (res.length > 0) {
        this.showSpinner = false;
        this.lovData = res;
      } else {
        this.showSpinner = false;
        this.lovData = [];
        // this.checkRecords();
      }
    });
  }

  //11-10-18 Load dropdown data
  loadDropdownData(SearchColumn) {
    this.localService.getDropdownList(this.PostRenderArgs.DropdownDataSource, this.PostRenderArgs.DropdownLookupAliasId, this.PostRenderArgs.DropdownLookupAliasValue).then((res: any) => {
      if (res.length > 0) SearchColumn.data = res;
    })
  }


  toggleSearchDropdown() {
    this.dropDownListLength = 10;
    this.isDropdownVisible = !this.isDropdownVisible;
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

  setSelectedValue(option, field?) {
    //02/08/2019 -- Mayur Varshney -- apply condition to hide dropdown
    if (field) {
      field.value = option ? option.LookupValue : null;
      // 02-16-2019 -- Mansi Arora -- call checkTimeOutValue on change of dropdown
      this.checkTimeOutValue(true);
    }
    this.hideSearchSelectDropDown(true);
    this.hideSearchDropdown();
  }



  /**
    * 02/25/2019 Mayur Varshney
    * auto-scrolling
    * @param {boolean} event
    * @param {*} element
    */
  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    if (event.srcElement.scrollTop + event.srcElement.clientHeight == event.srcElement.scrollHeight) {
      // 02/25/2019 -- Mayur Varshney -- getting country list item's length from 6th index of PostRenderArgs.SearchColumns, change index if adding or removing any field into this searchColumns
      if (this.PostRenderArgs.SearchColumns[6].data.length > 10 && (this.PostRenderArgs.SearchColumns[6].data.length > this.dropDownListLength)) {
        this.dropDownListLength += 10;
      }
    }
  }

  /**
    * 02/25/2019 Mayur Varshney
    * auto-scrolling
    * @param {boolean} event
    * @param {*} element
    */
  @HostListener('window:scroll', ['$event'])
  scrollHandlerForModal(event) {
    if (event.srcElement.scrollTop + event.srcElement.clientHeight == event.srcElement.scrollHeight) {
      // 02/25/2019 -- Mayur Varshney -- getting country list item's length from 6th index of PostRenderArgs.SearchColumns, change index if adding or removing any field into this searchColumns
      let searchedLovData = this.filterUnique.transform(this.searchPipe.transform(this.lovData, { translator : this.translate, LookupValue : this.PostRenderArgs.SearchColumns[0].value }));
      if (searchedLovData.length > 10 && (searchedLovData.length > this.lovDataLength)) {
        this.lovDataLength += 10;
      }
    }
  }

}
