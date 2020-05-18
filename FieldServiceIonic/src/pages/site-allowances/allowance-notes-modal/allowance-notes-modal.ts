import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { UtilityProvider } from '../../../providers/utility/utility';
import { LoggerProvider } from '../../../providers/logger/logger';
import { ValueProvider } from '../../../providers/value/value';
import * as moment from "moment";
import * as Enums from '../../../enums/enums';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-allowance-notes-modal',
  templateUrl: 'allowance-notes-modal.html',
})
export class AllowanceNotesModalPage {

  fileName: any = 'Allowance_Notes_Modal';
  enums: any;
  showSelects: boolean = true;
  allowance_notes: any;
  formValue: any;
  value: any;


  /**
   * Creates an instance of AllowanceNotesModalPage.
   * @param {NavController} navCtrl 
   * @param {Events} events 
   * @param {NavParams} navParams 
   * @param {LoggerProvider} logger 
   * @param {UtilityProvider} utilityProvider 
   * @param {LocalServiceProvider} localService 
   * @param {ViewController} viewCtrl 
   * 
   * get formValue and text on clicking edit button from add allowance page
   * @memberOf AllowanceNotesModalPage
   */
  constructor(public navCtrl: NavController, public events: Events, public navParams: NavParams, public logger: LoggerProvider, public utilityProvider: UtilityProvider, public localService: LocalServiceProvider, public viewCtrl: ViewController) {
    this.enums = Enums;
    this.formValue = this.navParams.get('formValue');
    this.allowance_notes = this.navParams.get('value') ? this.navParams.get('value') : '';
  }


  /**
   * 12-31-2019 -- Mayur Varshney -- Load language on load
   * @memberOf AllowanceNotesModalPage
   */
  ionViewDidEnter() {
    this.events.subscribe('langSelected', (res) => {
      setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
  }


  /**
   * 12-31-2019 -- Mayur Varshney -- check notes limit on focusOut to trim the extra text
   * trim space on focus out if space are added
   * @param {any} notes 
   * @memberOf AllowanceNotesModalPage
   */
  checkNotesLimit(notes) {
    this.allowance_notes = this.allowance_notes.trim();
    this.allowance_notes = this.utilityProvider.sliceValueUptoLimit(notes, 267);
  }


  /**
   * 12-31-2019 -- Mayur Varshney -- send text and form name on dismiss 
   * @memberOf AllowanceNotesModalPage
   */
  saveNotes() {
    let data = {
      allowance_notes: this.allowance_notes,
      form: this.formValue
    }
    this.viewCtrl.dismiss(data);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
