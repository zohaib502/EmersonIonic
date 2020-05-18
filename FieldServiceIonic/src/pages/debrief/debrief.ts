import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events, Tabs, App } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ValueProvider } from '../../providers/value/value';
import { UtilityProvider } from '../../providers/utility/utility';
import { LoggerProvider } from '../../providers/logger/logger';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import * as Enums from '../../enums/enums';


@IonicPage()
@Component({
  selector: 'page-debrief',
  templateUrl: 'debrief.html',
})
export class DebriefPage {

  @ViewChild('myTabs') debriefTabRef: Tabs;

  header_data: any;
  fileName: any = 'Debrief_Page';
  lockEnabled: boolean;
  public taskId = this.valueService.getTaskId();
  public resourceId = this.valueService.getResourceId();
  pageIndex: boolean = false;
  page: any;
  translate: any;
  index: any;
  enums: any = Enums;
  fromDebrief: boolean = false;
  isBothFlow: boolean = false;
  constructor(public localService: LocalServiceProvider, public appCtrl: App, public utilityProvider: UtilityProvider, public events: Events, public navCtrl: NavController, private translateService: TranslateService, public navParams: NavParams, public valueService: ValueProvider, public viewCtrl: ViewController, public logger: LoggerProvider) {
    this.fromDebrief = this.navParams.get('fromDebrief') ? this.navParams.get('fromDebrief') : false;
    this.isBothFlow = this.navParams.get('isBothFlow') ? this.navParams.get('isBothFlow') : false;
    this.header_data = { title1: "Debrief", title2: "Job #", taskId: '' };

    // this.enums = Enums;
    // let Job_Number;
    // let save = this.navParams.get("save")
    // if (save == "true") {
    //   Job_Number = this.navParams.get("taskid");
    // }
    // else {
    //   Job_Number = this.valueService.getTask().Job_Number;
    // }

  }

  ionViewDidLoad() {
    this.utilityProvider.stopSpinner();
    this.page = this.navParams.get('page');
    // 02/18/2019 -- Radhe Shyam -- set timeout to load page
    setTimeout(() => {
      if (this.debriefTabRef != undefined) {
        if (this.valueService.getTask().Task_Status == 'Completed') {
          this.debriefTabRef.select(6);
        } else {
          this.debriefTabRef.select(1, {});
        }
      }
    }, 800);
  }

  ionViewDidEnter() {
    this.fromDebrief = this.navParams.get('fromDebrief') ? this.navParams.get('fromDebrief') : false;
    //Prateek(23/01/2019) Shifted all events in didenter.
    this.events.subscribe('lockButtonClicked', (res) => {
      this.lockEnabled = res;
    });
    // 03-28-2019 Gurkirat Singh : Subscribe an event to call a common function for redirecting to SDR Flow
    this.events.subscribe('gotoSDR', (res) => {
      this.gotoSDR();
    });
    this.setPage("Debrief");
    //11/14/2018 kamal : changed navCtrl to appCtrl
    if (this.valueService.getTask().IsStandalone == 'false' && !this.fromDebrief && !this.isBothFlow) {
      this.appCtrl.getRootNav().insert(1, 'FieldJobOverviewPage');
    }
    this.localService.getTask().then((res) => {
      if (res) {
        this.valueService.setTask(res[0]);
        this.valueService.setTaskObject(res[0]);
        this.header_data = { title1: "Debrief", title2: "Job #", taskId: this.valueService.getTask().Job_Number ? this.valueService.getTask().Job_Number : this.taskId };

      }
      console.log(this.valueService.getTask());
    })
    // let taskobj = this.valueService.getTaskList().filter((item => { return item.Task_Number == this.taskId }))[0];
    // this.valueService.setTask(taskobj);
    // this.valueService.setTaskObject(taskobj);
  }

  setPage(user) {
    this.events.publish('user:created', user);
  }

  tab1Root = '';
  tab2Root = (this.valueService.getUser().ClarityID != '') ? 'DebriefTimeClaritylistPage' : 'NewTimePage';
  tab3Root = 'ExpensePage';
  tab4Root = 'MaterialPage';
  tab5Root = 'NotesPage';
  tab6Root = 'EmersonSignaturePage';
  tab7Root = 'SummaryPage';
  tab8Root = 'CustomersignaturePage';

  segmentChanged(event) {
    this.translateService.use(event._value);
  }

  onselect(event) {
    this.index = event.index;
    this.logger.log(this.fileName, 'onselect', "User navigated to " + event.tabTitle + " Page");
    this.valueService.setTabDetails(event);
    this.valueService.setPageOnVerify("");
    if (this.valueService.getIsSummarySelected()) {
      this.valueService.setVerify(true);
      this.valueService.setIsSummarySelected(false);
      this.debriefTabRef.select(6);
    }
    else if (this.valueService.getIsCustomerSelected()) {
      this.valueService.setVerify(true);
      this.valueService.setIsCustomerSelected(false);
      this.debriefTabRef.select(7);
    } else {
      let tabIndex = this.debriefTabRef.getSelected().index;
      if (this.debriefTabRef) this.debriefTabRef.select(tabIndex);
    }
  }

  onselectOverview(value) {
    if (this.valueService.getTask().IsStandalone == 'false') {
      this.index = value.index;
      if (this.navCtrl.getActive().index > 0) {
        const startIndex = this.navCtrl.getActive().index - 1;
        this.navCtrl.remove(startIndex, 1).then(() => {
          this.navCtrl.setRoot('FieldJobOverviewPage').then(() => {
            this.navCtrl.remove(startIndex, 1);
          });
        });
      } else {
        this.navCtrl.setRoot('FieldJobOverviewPage')
      }
    }
      
  }

  onselectNew(value) {
    if (this.valueService.getTask().IsStandalone == 'true') {
      // 02/18/2019 -- Radhe Shyam -- remove unused code , push WorkFlowTabsPage to appCtrl
      //this.appCtrl.getRootNav().push("WorkFlowTabsPage", {});
      // this.appCtrl.getRootNav().pop();
      // if (this.valueService.getTask().SELECTEDPROCESS == Enums.Selected_Process.FCR || this.valueService.getTask().SELECTEDPROCESS == Enums.Selected_Process.FCR_AND_SDR) {
      //   this.navCtrl.pop();
      // } else {
      this.gotoSDR();
      // }
    }
  }

  getProductlist() {
    return new Promise((resolve, reject) => {
      this.localService.getProducts().then((res: any) => {
        this.valueService.setProductList(res);
        resolve(null);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getProductlist', 'Error in getProducts : ' + JSON.stringify(error));
      });
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getProductlist', 'Error in Promise : ' + JSON.stringify(error));
    });
  }

  getStatuslist() {
    return new Promise((resolve, reject) => {
      this.localService.getStatus().then((res: any) => {
        this.valueService.setStatusList(res);
        resolve(null);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getStatuslist', 'Error in getProductlist : ' + JSON.stringify(error));
      });
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getStatuslist', 'Error in Promise : ' + JSON.stringify(error));
    });
  }

  getManufacturerlist() {
    return new Promise((resolve, reject) => {
      this.localService.getManufacturer().then((res: any) => {
        this.valueService.setManufacturerList(res);
        resolve(null);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getManufacturerlist', 'Error in getManufacturerlist : ' + JSON.stringify(error));
      });
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getManufacturerlist', 'Error in Promise : ' + JSON.stringify(error));
    });
  }

  onselectSummary(event) {
    this.index = event.index;
    let self = this;
    let lang;
    if (self.valueService.getSelectedLang()) {
      lang = self.valueService.getSelectedLang();
    }
    else {
      if (self.valueService.getUser()) {
        lang = self.valueService.getUser().Language;
      } else {
        lang = 'en-gb';
      }
    }
    self.translateService.getTranslation(lang).toPromise().then(translate => {
      self.translate = translate;
      if (this.translator(event.tabTitle) == this.translator('Summary')) {
        self.valueService.setIsSummarySelected(true);
        self.valueService.setIsCustomerSelected(false);
        self.valueService.setVerify(false);
        self.valueService.setPageOnVerify("summary");
        // this.valueService.setNavTab(this.debriefTabRef.select(2));
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'onselectSummary', 'Error in getTranslation: ' + JSON.stringify(err));
    });

  }

  onselectCustomerSig(event) {
    this.index = event.index;
    let self = this;
    let lang;
    if (self.valueService.getSelectedLang()) {
      lang = self.valueService.getSelectedLang();
      self.logger.log(self.fileName, "onselectCustomerSig", "getSelectedLang: " + JSON.stringify(lang));
    }
    else {
      if (self.valueService.getUser()) {
        lang = self.valueService.getUser().Language;
        self.logger.log(self.fileName, "onselectCustomerSig", "getSelectedLang: " + JSON.stringify(lang));
      } else {
        lang = 'en-gb';
        self.logger.log(self.fileName, "onselectCustomerSig", "getSelectedLang: " + JSON.stringify(lang));
      }
    }
    self.translateService.getTranslation(lang).toPromise().then(translate => {
      self.translate = translate;
      if (this.translator(event.tabTitle) == this.translator('Customer Signature')) {
        this.valueService.setIsCustomerSelected(true);
        this.valueService.setIsSummarySelected(false);
        this.valueService.setPageOnVerify("customerSignature");
        // this.valueService.setNavTab(this.debriefTabRef.select(2));
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'onselectCustomerSig', 'Error in getTranslation : ' + JSON.stringify(err));
    });
  }

  translator(text) {
    return this.translate[text] ? this.translate[text] : text;
  }

  ionViewWillUnload() {
    this.valueService.resetDebrief();
  }

  /**
  *@author: Prateek(21/01/2019)
  *Unsubscribe all events.
  *App Optimization
  * @memberof CalendarPage
  */
  ionViewWillLeave(): void {
    this.events.unsubscribe('lockButtonClicked');
    // 03-28-2019 Gurkirat Singh : unSubscribe gotoSDR event that is subscribed in ionVieDidEnter
    this.events.unsubscribe('gotoSDR');

  }

  /**
   * 11/12/2018 - redirect to SDR after Send data as params for SDR flow
   * Set setCurrentReport as null if new report is generated
   * @author Mayur Varshney
   */
  gotoSDR() {
    let result;
    if (this.valueService.getTask().ReportID) {

      this.localService.getReportByID(this.valueService.getUserId(), this.valueService.getTask().ReportID).then((res: any) => {
        result = res[0];
        this.valueService.setCurrentReport(result);
        if (res && res[0].REPORTSTATUS == Enums.ReportStatus.Completed) {
          this.utilityProvider.showSpinner();
          this.appCtrl.getRootNav().setRoot("ReviewSubmitPage", { reportdata: result });
        } else {
          this.utilityProvider.showSpinner();
          this.appCtrl.getRootNav().setRoot("SdrTabsPage", { task: this.valueService.getTask() });
        }
      }).catch(err => {
        this.logger.log(this.fileName, "gotoSDR", 'Error in getReportStatus: ' + JSON.stringify(err));
      });
    } else {
      this.valueService.setCurrentReport(null);
      this.appCtrl.getRootNav().setRoot("SdrTabsPage", { Selected_Process: Enums.Selected_Process.FCR_AND_SDR, ReportID: null, task: this.valueService.getTask() });

    }
  }

  /**
   * 11/12/2018 - redirect to SDR after Send data as params for SDR flow
   * Set setCurrentReport as null if new report is generated
   * @author Mayur Varshney
   */
  // gotoSDR() {
  //   if (this.valueService.getTask().ReportID) {
  //     this.localService.getReportByID(this.valueService.getUserId(), this.valueService.getTask().ReportID).then((res: any) => {
  //       let result = this.utilityProvider.groupBySameKeyValues(res, "ReportID_Mobile");
  //       let currentReport;
  //       for (var k in result) {
  //         currentReport = this.utilityProvider.getReportList(result[k], result[k][0]);
  //       }
  //       this.valueService.setCurrentBUID(currentReport.BUID);
  //       this.valueService.setCurrentReport(currentReport);
  //       this.valueService.setWorkFlowGroupID(currentReport.ReviewWorkFlowGroupID);
  //       this.valueService.setCurrentDevice(currentReport.Device);
  //       // 01-10-2019 -- Mansi Arora -- open review page if report completed
  //       if (currentReport && currentReport.Status == Enums.ReportStatus.Completed) {
  //         this.utilityProvider.showSpinner();
  //         this.localService.getAllWorkflowsOnGroupID(this.valueService.getWorkFlowGroupID(), this.valueService.getTemplateID(), this.valueService.getCurrentDevice()).then((res: any) => {
  //           let tabs = [];
  //           if (currentReport.FieldDiagnosticOnly == "true") {
  //             let workFlowIDs = [11, 12, 13, 14];
  //             for (let k in res) {
  //               if (workFlowIDs.indexOf(res[k].WorkFlowID) == -1) {
  //                 tabs.push(res[k]);
  //               }
  //             }
  //           } else {
  //             tabs = res;
  //           }
  //           this.utilityProvider.stopSpinner();
  //           this.navCtrl.push("WorkFlowPage", tabs);
  //         });
  //       } else {
  //         this.appCtrl.getRootNav().setRoot("WorkFlowTabsPage", this.valueService.getTask());
  //       }
  //     }).catch(err => {
  //       this.logger.log(this.fileName, "gotoSDR", 'Error in getReportByID: ' + JSON.stringify(err));
  //     });
  //   } else {
  //     this.valueService.setCurrentReport(null);
  //     this.appCtrl.getRootNav().setRoot("WorkFlowTabsPage", this.valueService.getTask());
  //   }
  // }
}

