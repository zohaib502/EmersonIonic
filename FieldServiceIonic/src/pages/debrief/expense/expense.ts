import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { ValueProvider } from "../../../providers/value/value";
// import moment from 'moment';
import { UtilityProvider } from '../../../providers/utility/utility';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { LoggerProvider } from '../../../providers/logger/logger';
import * as Enums from '../../../enums/enums';
import * as moment from "moment";
@IonicPage()
@Component({
  selector: 'page-expense',
  templateUrl: 'expense.html',
})
export class ExpensePage implements OnInit {
  timeOut: any;
  expenseArraySummary: any = [];
  chargeMethod: any = [];
  expenseType: any = [];
  currency: any = [];
  UOM: any = [];
  public editExpenseObj: any = {};
  public taskId = this.valueService.getTaskId();
  public resourceId = this.valueService.getResourceId();
  public expenseObject: any = {
    Date: new Date(),
    Amount: "",
    UOM_Id: ""
  };
  public NUMBER_REGEX = /([0-9]{8})/;
  fileName: any = 'Expense_Page';
  error: boolean;
  showSelects: boolean = true;
  enums: any;
  _taskObj: any;
  /*
  Calling method this.refreshUOM();
  */
  @ViewChild('dp') dp1: BsDatepickerDirective
  //private _picker: BsDatepickerDirective;
  constructor(public events: Events, public bsDatepickerConfig: BsDatepickerConfig, public navCtrl: NavController, public navParams: NavParams, public localService: LocalServiceProvider, public valueService: ValueProvider, public modalController: ModalController, public utilityProvider: UtilityProvider, public cdref: ChangeDetectorRef, public logger: LoggerProvider) {
    //10/05/2018 kamal : declared enums object to use in html 
    this.enums = Enums;
    this._taskObj = this.valueService.getTask();
  }

  ionViewDidLoad() {
    this.loadData();
  }

  ionViewDidEnter() {
    //11/04/2019 -- Mayur Varshney -- apply condition if viewCtrl relates to SDRTabsPage or DebriefPage
    if (this.navCtrl.parent.viewCtrl.id != "DebriefPage") return;
    this.setDefaultExpenseObject();
    //Prateek(23/01/2019) Shifted all events in didenter. 
    this.refreshUOM();
    this.refreshPageData();
    this.langSelected();
  }

  loadData() {
    this.bsDatepickerConfig.dateInputFormat = 'DD MMM YYYY';
    this.getExpenseList();
    this.getChargeMethod();
    this.getCurrencyList();
    this.getExpenseTypeList();
    this.getUOMList();
    this.setDefaultCurrency();
    if (this.valueService.getTask().Expense_Method) {
      this.expenseObject.Charge_Method_Id = this.valueService.getTask().Expense_Method ? this.chargeMethod.filter(item => {
        return item.Value == this.valueService.getTask().Expense_Method;
      })[0].ID : '';
      this.expenseObject.Charge_Method = this.valueService.getTask().Expense_Method ? this.valueService.getTask().Expense_Method : '';
    }
  }

  ngOnInit() {
    this.expenseObject.Date = new Date();
  }

  gottoTime() {
    this.navCtrl.parent.select(1);
    this.valueService.setExpense(this.expenseArraySummary);
  }

  gottoMaterial() {
    this.navCtrl.parent.select(3);
    this.valueService.setExpense(this.expenseArraySummary);
  }

  setDefaultCurrency() {
    if (this.valueService.getUserPreferences()[0]) {
      if (this.valueService.getUserPreferences()[0].Default_Currency) {
        this.expenseObject.Currency_Id = +this.valueService.getUserPreferences()[0].Default_Currency;
        this.expenseObject.Currency = this.currency.filter(item => {
          return item.ID == this.valueService.getUserPreferences()[0].Default_Currency;
        })[0].Value;
      }
      else {
        this.expenseObject.Currency_Id = "";
        this.expenseObject.Currency = "";
      }
    }
    else {
      this.localService.getUserPreferrences().then((res: any) => {
        if (res.Default_Currency) {
          this.expenseObject.Currency_Id = +res.Default_Currency;
          this.expenseObject.Currency = this.currency.filter(item => {
            return item.ID == res.Default_Currency;
          })[0].Value;
        } else {
          this.expenseObject.Currency_Id = "";
          this.expenseObject.Currency = "";
        }
      })
        // 12-28-2018 -- Mansi Arora -- error handled by logging
        .catch((err: any) => {
          this.logger.log(this.fileName, 'setDefaultCurrency', 'Error in setDefaultCurrency, getUserPreferrences local service : ' + JSON.stringify(err));
        });
    }

  }

  setDefaultExpenseObject() {
    this.expenseObject.Date = new Date();
    this.expenseObject.Expense_Type = "";
    this.expenseObject.Amount = "";
    if (this.valueService.getUserPreferences()[0]) {
      this.expenseObject.Currency = this.currency.filter(item => {
        return item.ID == +this.valueService.getUserPreferences()[0].Default_Currency;
      })[0].Value;
    }
    else {
      this.expenseObject.Currency = "";
    }
    this.expenseObject.Distance = "";
    this.expenseObject.UOM = "";
    this.expenseObject.justification = "";
    this.expenseObject.Expense_Type_Id = "";
    this.expenseObject.Currency_Id = "";
    if (this.valueService.getUserPreferences()[0]) {
      this.expenseObject.Currency_Id = this.valueService.getUserPreferences()[0].Default_Currency ? +this.valueService.getUserPreferences()[0].Default_Currency : "";
    }
    else {
      this.expenseObject.Currency_Id = "";
    }
    this.expenseObject.UOM_Id = "";
    if (this.valueService.getTask().Expense_Method) {
      this.expenseObject.Charge_Method_Id = this.valueService.getTask().Expense_Method ? this.chargeMethod.filter(item => {
        return item.Value == this.valueService.getTask().Expense_Method;
      })[0].ID : '';
      this.expenseObject.Charge_Method = this.valueService.getTask().Expense_Method ? this.valueService.getTask().Expense_Method : '';
    }
    else {
      this.expenseObject.Charge_Method = "";
      this.expenseObject.Charge_Method_Id = "";
    }
  }
  /**
   * expense bean for add/edit expense
   * 05/09/2019 Gurkirat : Added Original, UniqueMobileId, IsAdditional fields
   *
   * @memberof ExpensePage
   */
  addObject() {
    let self = this;
    let newObject = {
      expenseDefault: "",
      Date: this.expenseObject.Date ? this.expenseObject.Date : new Date,
      Expense_Type: this.expenseObject.Expense_Type ? this.expenseObject.Expense_Type : "",
      Expense_Type_Id: this.expenseObject.Expense_Type_Id ? this.expenseObject.Expense_Type_Id.toString() : "",
      Amount: this.expenseObject.Amount ? this.expenseObject.Amount : "0",
      Currency: this.expenseObject.Currency ? this.expenseObject.Currency : "",
      Currency_Id: this.expenseObject.Currency_Id ? this.expenseObject.Currency_Id.toString() : "",
      Distance: this.expenseObject.Distance ? this.expenseObject.Distance : "",
      UOM: this.expenseObject.UOM ? this.expenseObject.UOM : "",
      UOM_Id: this.expenseObject.UOM_Id ? this.expenseObject.UOM_Id.toString() : "",
      Charge_Method: this.expenseObject.Charge_Method ? this.expenseObject.Charge_Method : "",
      Charge_Method_Id: this.expenseObject.Charge_Method_Id ? this.expenseObject.Charge_Method_Id.toString() : "",
      Justification: this.expenseObject.justification ? this.expenseObject.justification : "",
      Task_Number: this.taskId,
      ResourceId: this.resourceId,
      Original: null,
      // 10/17/2018 -- Mayur Varshney -- remove new Date from utc(new Date) as it automatically takes the current date-time
      Expense_Id: String(this.utilityProvider.getUniqueKey()),
      IsAdditional: 'false',
      DebriefStatus: Enums.DebriefStatus.Submitted,
      Sync_Status: false
    };

    if (newObject.Currency) {
      newObject.Currency = this.currency.filter(item => {
        return item.ID == newObject.Currency_Id;
      })[0].Value;
    }
    if (this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_In_Progress || this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_Declined) {
      newObject.IsAdditional = 'true';
    }
    else {
      newObject.IsAdditional = 'false';
    }

    // 12-28-2018 -- Mansi Arora -- commenting logged data
    // self.logger.log(self.fileName, 'addObject', "newObject" + JSON.stringify(newObject));
    this.localService.insertExpense(newObject).then(() => {
      //self.logger.log(this.fileName,'addObject',"Expense Id" + res);
      // newObject['Expense_Id'] = res;
      //self.logger.log(this.fileName,'addObject',JSON.stringify(newObject));
      this.expenseArraySummary.push(newObject);
      this.valueService.setExpense(this.expenseArraySummary);
      this.sortExpenseArr();

      /*
       * 07/25/2018 Zohaib Khan
       * calling this.setDefaultExpenseObject(); inside (then) of localService.insertExpense(newObject)
      */
      this.setDefaultExpenseObject();
      //this.expenseArraySummary = $filter('orderBy')(this.expenseArraySummary, ['Date']);
      //this.getExpenseList();
      //this.expenseObject
    }).catch((err: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      self.logger.log(self.fileName, 'addObject', 'Error in addObject, insertExpense local service : ' + JSON.stringify(err));
    });

  }

  addExpense() {
    this.checkAmountFormat();
    this.timeOut = setTimeout(() => {
      if (!this.error) {
        this.addObject()
      }
    }, 300)

  }

  deleteObject(expense, index) {
    for (let i = 0; i < this.expenseArraySummary.length; i++) {
      if (index == i) {
        this.expenseArraySummary.splice(index, 1);
      }
    }
    this.expenseArraySummary.reverse();
    this.localService.deleteExpenseList(expense.Expense_Id);
    this.sortExpenseArr();
  }

  openJustification() {
    let params = { ifJustification: true, ifComment: 'openJustification', justification: this.expenseObject.justification ? this.expenseObject.justification : '' };
    let expenseModal = this.utilityProvider.showModal('ExpenseModalPage', params, { enableBackdropDismiss: false, cssClass: 'ExpenseModalCommentPage' });
    expenseModal.onDidDismiss(data => {
      //self.logger.log(this.fileName,'openJustification',data);
      if (data != undefined) {
        this.expenseObject.justification = data;
      }
    });
    expenseModal.present().catch((err: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'openJustification', 'Error in openJustification : ' + JSON.stringify(err));
    });
  }

  /*
      * 07/25/2018 Zohaib Khan
      * The method selectExpenseTypeName() filtering names based on ID's 
      * updation UOM field based on userepreferences if expense_type is equal to mileage. 
      * if expense_type is not mileage then updating the UOM field with null (ON ionChange) of expense type field
    * 07/26/2018 Zohaib Khan
    * Erasing UOM and Distance value if expense type is not equal to mileage. 
  */

  selectExpenseTypeName(value) {
    let filtered = this.expenseType.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.expenseObject.Expense_Type = filtered.Value;
      if (filtered.Value == "Mileage") {
        this.expenseObject.UOM_Id = this.valueService.getUserPreferences()[0].UOM_Id;
        this.expenseObject.UOM = this.valueService.getUserPreferences()[0].UOM;
      } else {
        /* 07/30/2018 Zohaib Khan
          * if expense_type is not mileage then updating the UOM field with null (ON ionChange) of expense type field.
        */
        this.expenseObject.UOM_Id = '';
        this.expenseObject.UOM = '';
        this.expenseObject.Distance = '';
      }
    }

  }

  selectCurrencyName(value) {
    let filtered = this.currency.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.expenseObject.Currency = filtered.Value;
    }
  }

  selectChargeMethodName(value) {
    let filtered = this.chargeMethod.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.expenseObject.Charge_Method = filtered.Value;
    }
  }

  selectUOMName(value) {
    let filtered = this.UOM.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.expenseObject.UOM = filtered.Value;
    }
  }

  openJustificationOnEdit(expense, index) {
    let data = { justificationOnEdit: true, justification: expense.Justification, ifComment: '' };
    let expenseModal = this.utilityProvider.showModal('ExpenseModalPage', data, { enableBackdropDismiss: false, cssClass: 'ExpenseModalCommentPage' });
    expenseModal.present().catch((err: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'openJustificationOnEdit', 'Error in openJustificationOnEdit : ' + JSON.stringify(err));
    });
  }
  /**
   * update expanse in local DB
   *10/05/2018  kamal: check if task is declined then insert else update expense
   *
   * @param {*} editExpenseParams
   * @param {*} expense
   * @param {*} index
   * @memberof ExpensePage
   */
  openEditModal(editExpenseParams, expense, index) {
    let self = this;
    // 10/09/2018 -- Mayur Varshney -- create modal class dynamically on the basis of multiple condition
    let modalClass = editExpenseParams.originalExpense ? 'ExpenseModalPageWithOriginalEntry' : 'ExpenseModalPage';
    let expenseModal = this.utilityProvider.showModal('ExpenseModalPage', editExpenseParams, { enableBackdropDismiss: false, cssClass: modalClass });
    expenseModal.onDidDismiss(data => {
      //self.logger.log(this.fileName,'editExpense',data);
      if (data != undefined) {
        this.editExpenseObj = data;

        if (this.editExpenseObj.Amount == '') {
          this.editExpenseObj.Amount = 0;
        }

        //10/05/2018  kamal: checks if status is declined then insert else update edited expense 
        if (this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_Declined && !expense.CurrentMobileId && !expense.Original && expense.Sync_Status == 'true') {

          this.editExpenseObj.Original = expense.Expense_Id;
          this.editExpenseObj.IsAdditional = 'true';
          this.editExpenseObj.DebriefStatus = Enums.DebriefStatus.ReSubmitted;
          this.editExpenseObj.Sync_Status = false;
          //28/12/2018 kamal: on inserting update uniqueMobileId
          this.editExpenseObj.Expense_Id = String(this.utilityProvider.getUniqueKey());

          this.localService.insertExpense(this.editExpenseObj).then(() => {
            this.getExpense();
          })
            // 12-28-2018 -- Mansi Arora -- error handled by logging
            .catch((err: any) => {
              self.logger.log(self.fileName, 'openEditModal', 'Error in openEditModal, insertExpense local service : ' + JSON.stringify(err));
            });
        }
        else {
          this.editExpenseObj.Sync_Status = false;
          this.localService.updateExpense(this.editExpenseObj).then((res): any => {
            // 12-28-2018 -- Mansi Arora -- commenting logged data
            // self.logger.log(self.fileName, 'editExpense', 'res' + JSON.stringify(res));
            this.expenseArraySummary[index] = this.editExpenseObj;
            this.sortExpenseArr();
          }).catch((err: any) => {
            // 12-28-2018 -- Mansi Arora -- change in logs comment
            self.logger.log(self.fileName, 'openEditModal', 'Error in openEditModal, updateExpense local service : ' + JSON.stringify(err));
          });
        }
      }
    });
    expenseModal.present().catch((err) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      self.logger.log(self.fileName, 'editExpense', 'Error in editExpense : ' + JSON.stringify(err));
    });
  }

  /**
   *10/05/2018  kamal: get expense list from local DB
   *
   * @memberof ExpensePage
   */
  getExpense() {
    this.localService.getExpenseList(this.valueService.getTaskId()).then((res) => {
      this.expenseArraySummary = res;
      this.sortExpenseArr();
    })
      // 12-28-2018 -- Mansi Arora -- error handled by logging
      .catch((err: any) => {
        this.logger.log(this.fileName, 'getExpense', 'Error in getExpense, getExpenseList local service : ' + JSON.stringify(err));
      });
  }

  sortExpenseArr() {
    this.expenseArraySummary.sort((a, b) => {
      if (new Date(a.Date) < new Date(b.Date))
        return -1;
      if (new Date(a.Date) > new Date(b.Date))
        return 1;
      return 0;
    });
  }
  /**
   *10/05/2018  kamal: open modal for editing expense
   *
   * @param {*} expense
   * @param {*} index
   * @memberof ExpensePage
   */
  editExpense(expense, index) {
    //self.logger.log(this.fileName,'editExpense',"index" + JSON.stringify(this.expenseArraySummary[index]));

    if (this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_Declined && expense.Original && expense.IsAdditional == 'true') {
      this.localService.getExpenseById(expense.Original).then((res) => {
        let editExpenseParams = { originalExpense: res[0], chargeMethod: this.chargeMethod, uom: this.UOM, currency: this.currency, expenseType: this.expenseType, expenseObject: this.expenseArraySummary[index], editExpense: true, ifEdit: 'Edit' }
        this.openEditModal(editExpenseParams, expense, index);
      })
        // 12-28-2018 -- Mansi Arora -- error handled by logging
        .catch((err: any) => {
          this.logger.log(this.fileName, 'editExpense', 'Error in editExpense, getExpenseById local service : ' + JSON.stringify(err));
        });
    }
    else {
      let editExpenseParams = { chargeMethod: this.chargeMethod, uom: this.UOM, currency: this.currency, expenseType: this.expenseType, expenseObject: this.expenseArraySummary[index], editExpense: true, ifEdit: 'Edit' }
      this.openEditModal(editExpenseParams, expense, index);
    }

  }
  copyExpense(expense, index) {
    let self = this;
    let expenseObj: any = {};
    let copyExpenseParams = { chargeMethod: this.chargeMethod, uom: this.UOM, currency: this.currency, expenseType: this.expenseType, expenseObject: expense, editExpense: true, ifCopy: 'Copy' }
    let expenseModal = this.utilityProvider.showModal('ExpenseModalPage', copyExpenseParams, { enableBackdropDismiss: false, cssClass: 'ExpenseModalPage' });
    expenseModal.onDidDismiss(data => {
      if (data != undefined) {
        expenseObj = data;
        if (expenseObj.Amount == '') {
          expenseObj.Amount = 0;
        }

        // 10/17/2018 -- kamal -- set IsAdditional and DebriefStatus
        if (this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_In_Progress || this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_Declined) {
          expenseObj.IsAdditional = 'true';
          expenseObj.DebriefStatus = Enums.DebriefStatus.ReSubmitted;
        }
        else {
          expenseObj.IsAdditional = 'false';
          expenseObj.DebriefStatus = Enums.DebriefStatus.Submitted;
        }
        // 10/17/2018 -- Mayur Varshney -- remove new Date from utc(new Date) as it automatically takes the current date-time
        expenseObj.Expense_Id = String(this.utilityProvider.getUniqueKey());
        // 10/17/2018 -- kamal -- set fields to null 
        expenseObj.CurrentMobileId = null;
        expenseObj.Original = null;
        // 05/11/2019 -- Set sync Status - false if copy expense as we are doing new row insertion
        expenseObj.Sync_Status = "false";
        this.localService.insertExpense(expenseObj).then(() => {
          // expenseObj['Expense_Id'] = res;
          this.expenseArraySummary.push(expenseObj);
          this.sortExpenseArr();
        }).catch((err: any) => {
          // 12-28-2018 -- Mansi Arora -- change in logs comment
          self.logger.log(self.fileName, 'copyExpense', 'Error in copyExpense, insertExpense local service : ' + JSON.stringify(err));
        });
      }
    });
    expenseModal.present().catch((err: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      self.logger.log(self.fileName, 'copyExpense', 'Error in copyExpense : ' + JSON.stringify(err));
    });
  }

  getExpenseList() {
    this.expenseArraySummary = this.valueService.getExpense();
    this.sortExpenseArr();
  }

  getChargeMethod() {
    //12/14/2018 Zohaib Khan: Filtering charge method with no non-billable option.
    this.chargeMethod = this.valueService.getChargeMethod().filter(item => {
      return item.Value != "Non-Billable";
    });
  };

  getCurrencyList() {
    this.currency = this.valueService.getCurrency();
  };

  getExpenseTypeList() {
    this.expenseType = this.valueService.getExpenseType();
  };

  getUOMList() {
    this.UOM = this.valueService.getUOM();
  };

  checkIfchar(event) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
      this.expenseObject.Amount = '';
    }
  }
  /**
 *09/10/2018 kamal: remove space in distance 
 *
 * @memberof ExpensePage
 */
  checkDistanceFormat() {
    const pattern = /^\d{0,6}?$/;
    if (!pattern.test(this.expenseObject.Distance)) {
      this.expenseObject.Distance = '';
    }
  }

  _keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  checkAmountFormat() {
    if (this.expenseObject.Amount) {
      //04/30/2019 -- Mayur Varshney -- increase limit to 9 characters for amount
      //05/22/2019 -- Mayur Varshney -- increase limit to 27 characters for amount
      const pattern = /^\d{0,27}(\.\d{1,2})?$/;
      if (!pattern.test(this.expenseObject.Amount)) {
        this.error = true;
        this.expenseObject.Amount = '';
        if (this.expenseObject.Expense_Type == 'Mileage') {
          document.getElementById("amountFieldOnMileage").focus();
        } else {
          document.getElementById("amountField").focus();
        }
      } else {
        //05/22/2019 -- Mayur Varshney -- apply check if no decimal places is entered, add two zeros after decimal points automatically
        if (this.expenseObject.Amount.indexOf(".") == -1) {
          this.expenseObject.Amount = this.expenseObject.Amount.concat(".00");
        } else {
          let period = this.expenseObject.Amount.indexOf(".");
          if ((this.expenseObject.Amount.slice(period + 1, this.expenseObject.Amount.length)).length == 1) {
            this.expenseObject.Amount = this.expenseObject.Amount.concat("0");
          }
        }
        this.error = false;
      }
    }
  }

  /*
      * 07/23/2018 Zohaib Khan
      * Subscribing event 'RefreshUOM' to refresh the UOM value directly from User preferences 
      * 
      * 07/25/2018 Zohaib Khan
      * updated RefreshUOM event for clearing UOM value if expense type is not Mileage. if user goes to user preferences from expense and updates User preferences. 
      * 
      * 07/26/2018 Zohaib Khan
      * Added Method refreshUOM to refresh the UOM directly from Userpreferences
  */

  refreshUOM() {
    this.events.subscribe('refreshPreferences', (res) => {

      if (this.expenseObject.Expense_Type != 'Mileage') {
        this.expenseObject.UOM_Id = '';
        this.expenseObject.UOM = '';
      } else {
        this.expenseObject.UOM_Id = this.valueService.getUserPreferences()[0].UOM_Id;
        this.expenseObject.UOM = this.valueService.getUserPreferences()[0].UOM;
      }

    });
  }
  /*
     * 07/26/2018 Zohaib Khan
     * Moved refreshPageData Event to refreshPageData method and calling this method in expense constructor
  */
  refreshPageData() {
    this.events.subscribe('refreshPageData', (time) => {
      this.logger.log(this.fileName, " ExpensePage constructor", 'refreshPageData' + time);
      let taskobj = this.valueService.getTaskList().filter((item => { return item.Task_Number == this.valueService.getTaskId() }))[0];

      this.valueService.setTask(taskobj).then(() => {
        this.loadData();
      })
        // 12-28-2018 -- Mansi Arora -- error handled by logging
        .catch((err: any) => {
          this.logger.log(this.fileName, 'refreshPageData', 'Error in refreshPageData, setTask value provider : ' + JSON.stringify(err));
        });
    });
  }

  /*
     * 07/26/2018 Zohaib Khan
     * Moved langSelected Event to langSelected method and calling this method in expense constructor.
  */
  langSelected() {
    this.events.subscribe('langSelected', (res) => {
      // 10-12-18 Radheshyam - the dom will refresh and show the current language in dropbox.
      setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
  }
  /**
   *@author Prateek (19/feb/2019)
   * Date Select on single click ion ipad
   */
  onShowPicker(event) {
    // event.dayHoverHandler = hoverWrapper;
    event.dayHoverHandler = this.utilityProvider.singleClickDaySelector(event, this.dp1);
  }
  /**
   *@author: Prateek(21/01/2019)
   *Unsubscribe all events.
   *App Optimization
   * @memberof CalendarPage
   */
  ionViewWillLeave(): void {
    this.events.unsubscribe('langSelected');
    this.events.unsubscribe('refreshPageData');
    this.events.unsubscribe('refreshPreferences');
    clearTimeout(this.timeOut);
  }


  /** 
   * @author Gurkirat Singh
   * 03-28-2019 Gurkirat Singh : Publish an event to navigate to SDR Flow
   *
   * @memberof ExpensePage
   */
  gotoSDR() {
    this.events.publish("gotoSDR");
  }

}

