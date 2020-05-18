import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
// import { Platform } from 'ionic-angular';
import * as moment from "moment";
import { LocalServiceProvider } from '../../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { ValueProvider } from '../../../../providers/value/value';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { UtilityProvider } from '../../../../providers/utility/utility';

@IonicPage()
@Component({
  selector: 'page-add-notes-modal',
  templateUrl: 'add-notes-modal.html',
})

export class AddNotesModalPage implements OnInit {
  @ViewChild('dp')
  public dp1: BsDatepickerDirective;
  createdBy: any;
  notetype: any[] = [];
  ibList: any[] = [];
  noteArraySummary: any[] = [];
  note_type: any = '';
  date: any;
  comment: any = '';
  title: any;
  notesObject: any = {};
  clonenotesObject: any = {};
  fileName: any = 'Notes_Modal';
  isInstallBase = false;
  IBase: any = '';
  showSelects: boolean = true;

  constructor(public events: Events, public navCtrl: NavController, public utilityProvider: UtilityProvider,
    public valueService: ValueProvider, public navParams: NavParams,
    public localService: LocalServiceProvider, public viewCtrl: ViewController, public logger: LoggerProvider) {
    this.events.subscribe('langSelected', (res) => {
      // 10-12-18 Radheshyam - the dom will refresh and show the current language in dropbox.
      setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
  }

  ionViewDidLoad() {
    this.ibList = this.valueService.getInstallBase();
    this.title = this.navParams.get('modalTitle');
    this.createdBy = this.valueService.getUser().Name;
    this.getNotetype();
    if (this.title != undefined || this.title != null) {
      this.notesObject = this.navParams.get('noteObj');
      this.clonenotesObject = Object.assign({}, this.notesObject);
      if (this.clonenotesObject.Note_Type == 'Installed Base') {
        this.IBase = this.clonenotesObject.InstalledBaseId;
      }
      this.note_type = this.clonenotesObject.Note_Type;
      this.comment = this.clonenotesObject.Notes;
      if (moment(this.clonenotesObject.Date).format("MM-DD-YYYY") != moment(new Date()).format("MM-DD-YYYY")) {
        // 05/13/2019 -- Mayur Varshney -- Set date to show selected date on calendar, datepicker
        this.date = new Date(this.clonenotesObject.Date);
      }
    }
    else {
      this.getNoteList().then((res): any => {
        let Notetype = this.noteArraySummary.filter((item) => {
          return item.Note_Type == "Action Taken"
        });
        if (this.noteArraySummary.length == 0) {
          this.note_type = "Action Taken";
        } if (Notetype.length == 0) {
          this.note_type = "Action Taken";
        }
        else {
          this.note_type = "";
        }
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'ionViewDidLoad', 'Error in ionViewDidLoad : ' + JSON.stringify(error));
      });
    }
  }

  ngOnInit() {
    this.date = new Date();
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  //convert insert, edit, copy function in to single function by passing different params accordingly /mayur
  saveNotes(func) {
    let newObject = {
      noteDefault: "",
      Note_Type: this.note_type ? this.note_type : "",
      Note_Type_Id: this.notetype.filter((item) => { return item.Value == this.note_type })[0].ID.toString(),
      Date: this.date ? this.date : new Date,
      Created_By: this.createdBy,
      Notes: this.comment ? this.comment : "",
      Notes_Install_Base: this.IBase ? this.IBase : "",
      ResourceId: this.valueService.getResourceId(),
      Task_Number: this.valueService.getTaskId(),
      Item_Number: this.notesObject.Item_Number ? this.notesObject.Item_Number : "",
      Serial_Number: this.notesObject.Serial_Number ? this.notesObject.Serial_Number : "",
      // 11/05/2019 -- Mayur Varshney -- Add system id to show on Notes page
      System_ID: this.notesObject.System_ID ? this.notesObject.System_ID : "",
      InstalledBaseId: this.notesObject.InstalledBaseId ? this.notesObject.InstalledBaseId : ""
    };
    if (func != 'insert') {
      newObject['Notes_Id'] = this.notesObject.Notes_Id;
    }
    this.viewCtrl.dismiss(newObject);
  }

  getNotetype() {
    this.notetype = this.valueService.getNoteType();
  }

  getNoteList() {
    return new Promise((resolve, reject) => {
      this.localService.getNotesList(String(this.valueService.getTaskId())).then((res: any[]) => {
        this.noteArraySummary = res;
        resolve(res);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getNoteList', 'Error in getNoteList : ' + JSON.stringify(error));
      });
    });
  }

  CheckForIB() {
    if (this.note_type == 'Installed Base') {
      this.isInstallBase = true;
    } else {
      this.IBase = "";
      this.isInstallBase = false;
    }
  }

  //checkIBForComment() {
  //  let comnt;
  //  if (this.title != undefined && this.note_type == 'Installed Base') {
  //    if (this.comment.split(":")[1] == undefined) {
  //      comnt = this.comment;
  //    } else {
  //      comnt = this.comment.split(":")[1];
  //    }
  //    if (this.IBase != this.comment.split(":")[0]) {
  //      let Edited = this.IBase + ":" + comnt;
  //      this.comment = Edited;
  //    }
  //  }
  //}

  //check character limit for description , should be less than 2000 / Mayur
  _keyPressInText(event: any) {
    if (event.target.textLength > 1999) {
      event.preventDefault();
    }
  }

  /**
 *@author Prateek (19/feb/2019)
 * Date Select on single click on ipad
 */
  /**
   *@author Prateek (19/feb/2019)
   * Date Select on single click on ipad
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

  }
}
