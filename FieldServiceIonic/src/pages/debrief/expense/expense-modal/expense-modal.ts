import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { UtilityProvider } from '../../../../providers/utility/utility';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
/**
 * Generated class for the ExpenseModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expense-modal',
  templateUrl: 'expense-modal.html',
})
export class ExpenseModalPage implements OnInit {
  timeOut: any
  justification: any;
  justificationOnEdit: any;
  expenseObject: any = {};
  ifJustification: boolean;
  chargeMethod: any = [];
  expenseType: any = [];
  currency: any = [];
  UOM: any = [];
  editExpense: any;
  cloneExpenseObj: any = {};
  ifEdit: any;
  ifCopy: any;
  ifComment: any;
  fileName: any = 'Expense_Modal';
  error: boolean;
  showSelects: boolean = true;
  originalExpense: any = [];

  @ViewChild('dp') dp1: BsDatepickerDirective;

  constructor(public utilityProvider: UtilityProvider, public events: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public logger: LoggerProvider) {

  }
  ionViewDidEnter() {
    //Prateek(23/01/2019) Shifted all events in didenter. 
    this.events.subscribe('langSelected', (res) => {
      setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
  }
  ngOnInit() {
    this.expenseObject.Date = new Date();
  }
  public closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.cloneExpenseObj = this.navParams.get('expenseObject');
    this.expenseObject = Object.assign({}, this.cloneExpenseObj);
    // 05/13/2019 -- Mayur Varshney -- Set date to show selected date on calendar, datepicker
    this.expenseObject.Date = new Date(this.expenseObject.Date);
    this.chargeMethod = this.navParams.get('chargeMethod');
    this.expenseType = this.navParams.get('expenseType');
    this.currency = this.navParams.get('currency');
    this.UOM = this.navParams.get('uom');
    this.ifJustification = this.navParams.get('ifJustification');
    this.justificationOnEdit = this.navParams.get('justificationOnEdit');
    this.justification = this.navParams.get('justification');
    this.editExpense = this.navParams.get('editExpense');
    this.ifEdit = this.navParams.get('ifEdit');
    this.ifCopy = this.navParams.get('ifCopy');
    this.ifComment = this.navParams.get('ifComment');
    this.originalExpense = this.navParams.get('originalExpense');
  }

  save() {
    if (this.ifJustification || this.justificationOnEdit) {
      this.viewCtrl.dismiss(this.justification);
    }
    else {
      this.checkAmountFormat();
      this.timeOut = setTimeout(() => {
        if (!this.error) {
          if (this.expenseObject.Expense_Type != 'Mileage') {
            this.expenseObject.Expense_Id = this.cloneExpenseObj.Expense_Id;
            this.expenseObject.Distance = '';
            this.expenseObject.UOM = '';
            this.expenseObject.UOM_Id = '';
            this.viewCtrl.dismiss(this.expenseObject);
          }
          else {
            this.viewCtrl.dismiss(this.expenseObject);
          }
        }
      }, 500)
    }
  }

  selectExpenseTypeName(value) {
    this.expenseObject.Expense_Type = this.expenseType.filter(item => {
      return item.ID == value;
    })[0].Value;
  }

  selectCurrencyName(value) {
    this.expenseObject.Currency = this.currency.filter(item => {
      return item.ID == value;
    })[0].Value;
  }

  selectChargeMethodName(value) {
    this.expenseObject.Charge_Method = this.chargeMethod.filter(item => {
      return item.ID == value;
    })[0].Value;
  }

  selectUOMName(value) {
    this.expenseObject.UOM = this.UOM.filter(item => {
      return item.ID == value;
    })[0].Value;
  }

  checkIfchar(event) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  _keyPress(event: any) {
    const pattern = /[0-9\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
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

  //check character limit for description , should be less than 255 / Mayur
  _keyPressInText(event: any) {
    if (event.target.textLength > 254) {
      event.preventDefault();
    }
  }

  readOriginalComments(comments) {
    let data = { commentText: comments };
    let readModal = this.utilityProvider.showModal('ReadOriginalCommentsPageExpense', data, { enableBackdropDismiss: false, cssClass: 'ReadOriginalCommentsPageExpense' });
    readModal.present();
  }

  /**
 *@author Prateek (19/feb/2019)
 * Date Select on single click ion ipad
 */

  onShowPicker(event) {
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
    clearTimeout(this.timeOut);

  }
}

