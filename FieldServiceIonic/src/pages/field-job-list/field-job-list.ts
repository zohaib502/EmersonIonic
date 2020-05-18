import { Component } from '@angular/core';
import { NavController, MenuController, ViewController, Events, NavParams, IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseProvider } from '../../providers/database/database';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { ValueProvider } from '../../providers/value/value';
import { UtilityProvider } from '../../providers/utility/utility';
import { SearchPipe } from '../../pipes/search/search';
import { LoggerProvider } from '../../providers/logger/logger';
// import { WorkFlowTabsPage } from '../repair-report/work-flow-tabs/work-flow-tabs';
import * as moment from "moment-timezone";
import * as momentDate from "moment";
import * as Enums from "../../enums/enums";
import { LocalServiceSdrProvider } from '../../providers/local-service-sdr/local-service-sdr';
@IonicPage()
@Component({
  selector: 'page-field-job-list',
  templateUrl: 'field-job-list.html',
})

export class FieldJobListPage {

  dummyVersion: any = '1.0';

  fileName: any = 'Field_Job_List_Page';
  header_data: any;
  taskInput: string = '';
  myTaskDetails: any[] = [];
  myReports: any = [];
  // 11-30-2018 GS: TODO for Shivansh - Remove Unused Code
  pendingReports: any[] = [];
  completedReports: any[] = [];
  filterTaskDetail: any[] = [];
  descending: boolean = false;
  order: number;
  column: string = 'name';
  jobsTodayLimit: any = 5;
  pendingAssignmentsLimit: any = 5;
  myFieldJobsLimit: any = 5;
  completedReportsLimit: any = 5;
  currentDate = moment().format("YYYY-MM-DD");
  jobsTodayOrderBy: any = '';
  jobsTodayReverseSort: any = false;
  sync_Type: any = "0";
  sync: any;
  permissions: any;
  ifSync: any;
  Moment: any = momentDate;
  user_Preferences: any = [];
  preferredTimeZone: any;
  userPreferredTimeZone: any;
  Enums: any = Enums;
  pendingReportsLimit: any = 5;
  selectedLegend: any = "";
  selectedProcess: null;
  showSelects: boolean = true;
  // repairReport = WorkFlowTabsPage;

  // private db: null;
  constructor(public events: Events, public searchPipe: SearchPipe, public viewCtrl: ViewController, public navCtrl: NavController, public utilityProvider: UtilityProvider, private valueProvider: ValueProvider, private translateService: TranslateService, public localService: LocalServiceProvider, public dbCtrl: DatabaseProvider, public menuController: MenuController, public navParams: NavParams, public logger: LoggerProvider, public localservicesdr: LocalServiceSdrProvider) {
    this.header_data = { title1: "", title2: "My Field Jobs", taskId: "" };
    this.permissions = this.valueProvider.getPermissions();

    this.ifSync = navParams.get('sync');
  }

  ionViewDidLoad() {
    this.setPage("Field Jobs");
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
  }

  /**
   * 11/10/18 Suraj Gorai
   * set setTask,setTaskObject array to null
   * @memberOf FieldJobListPage
   */
  ionViewWillEnter() {
    //Prateek(23/01/2019) Shifted all events in didenter.
    this.events.subscribe('refreshPageData', (obj) => {
      let self = this;
      // console.log("refreshPageData");
      this.getTask().then(() => {
        if (this.jobsTodayLimit > 5) {
          this.setFullLimit('jobsTodayLimit', { Start_Date: this.currentDate });
        }
        if (this.pendingAssignmentsLimit > 5) {
          this.setFullLimit('pendingAssignmentsLimit', { Task_Status: 'Assigned' });
        }
        if (this.myFieldJobsLimit > 5) {
          this.setFullLimit('myFieldJobsLimit', this.taskInput);
        }
        if (this.completedReportsLimit > 5) {
          this.setReportLimit('completedReportsLimit', '');
        }
      }).catch((err) => {
        self.logger.log(self.fileName, "constructor", JSON.stringify(err));
      });
      // 01/10/2019 Gurkirat Singh: Refresh Reports when auto sync is completed
      if (this.permissions.CreateStandaloneJob) {
        this.getReports()
      }

    });
    //Prateek(23/01/2019) Shifted all events in didenter.
    this.events.subscribe('UserSelectedTimeZone', (res) => {
      this.getTask();
    });
    this.valueProvider.setTask([]);
    this.valueProvider.setTaskObject([]);
    this.menuController.enable(true);
    this.menuController.open();
    this.pendingReportsLimit = 5;
    // 07/27/2018 Gurkirat Singh -- Removed Sync Popup on load of Field Job List page
    // if (this.ifSync == 'Login') {
    //   let params = { syncType: this.sync_Type };
    //   let syncModal = this.utilityProvider.showModal("ProgressModalPage", params, { enableBackdropDismiss: false, cssClass: 'ProgressModalPage' });
    //   syncModal.present();
    //   syncModal.onDidDismiss(data => {
    //     this.logger.log(this.fileName, 'ionViewDidEnter', "data" + data);
    //     if (data != undefined) {
    //       this.getTask();
    //       this.ifSync = '';
    //     }
    //   });
    // }
    this.getTask();
    if (this.permissions.CreateStandaloneJob) {
      this.getReports()
    }
    this.createUser("Field Jobs");
    this.selectedProcess = null;
  }
  /**
 *@author: Prateek(21/01/2019)
 *Unsubscribe all events.
 *App Optimization
 * @memberof CalendarPage
 */
  ionViewWillLeave(): void {
    this.events.unsubscribe('refreshPageData');
    this.events.unsubscribe('UserSelectedTimeZone');

  }
  createUser(user) {
    this.events.publish('user:created', user);
  }

  setPage(page) {
    //this.events.publish('setPage', page);
  }

  segmentChanged(event) {
    this.translateService.use(event._value);
  }

  getTask() {
    let self = this;
    return new Promise((resolve, reject) => {
      // 01/30/2019 -- Mayur Varshney -- get timeZoneIANA from tables, no need to convert it now
      this.userPreferredTimeZone = this.valueProvider.getUser().timeZoneIANA;
      this.preferredTimeZone = this.valueProvider.getUserPreferences()[0].timeZoneIANA;

      // 09/03/2018 -- Mayur Varshney -- refresh task list on the basis of local database
      this.localService.getTaskList().then((response: any[]) => {
        if (response) {
          this.myTaskDetails = response;
          this.logger.log(this.fileName, 'getTask', this.myTaskDetails.length);
          this.filterTaskDetail = response;
          if(this.selectedLegend !== ''){
            let filterValue = this.selectedLegend;
            this.selectedLegend = '';
            this.filter(filterValue)
          }
        }
        resolve(null);
      }).catch((error: any) => {
        self.logger.log(self.fileName, 'getTask', 'Error in getTaskList from local service : ' + JSON.stringify(error));
      });
    })
      // 12-28-2018 -- Mansi Arora -- error handled by logging
      .catch((error: any) => {
        self.logger.log(self.fileName, 'getTask', 'Error in getTask : ' + JSON.stringify(error));
      });
  }

  // 10/11/2018 -- Shivansh Subnani --
  /**
   *Gets the list of all reports displayed on the field Job list
   *
   * @returns
   * @memberof FieldJobListPage
   */
  getReports() {
    let self = this;
    return new Promise((resolve, reject) => {
      let userId = this.valueProvider.getUserId();
      this.localService.getReports(userId).then((response: any[]) => {
        if (response) {
          this.myReports = response;
          this.pendingReports = [];
          this.completedReports = [];
          if (response.length > 0) {
            // let result = this.groupBySameKeyValues(response, "ReportID_Mobile");
            // //console.log("ParsedResult",JSON.stringify(result));
            // for (var k in result) {
            //   this.getReportList(result[k], result[k][0])
            // }
            //TODO:Move this code in common function getReportList
            this.pendingReports = this.myReports.filter((report) => {
              // 12/30/2018 -- Mayur Varshney -- show all jobs except completed job
              return report.REPORTSTATUS != Enums.ReportStatus.Completed;
            })
            this.completedReports = this.myReports.filter((report) => {
              //TODO: apply 15 days filter
              return report.REPORTSTATUS == Enums.ReportStatus.Completed;
            })
          }
          this.logger.log(this.fileName, 'getReports', "Pending Reports: " + this.pendingReports.length + "; Completed Reports: " + this.completedReports.length);
        }
        resolve(null);
      }).catch((error: any) => {
        self.logger.log(self.fileName, 'getReports', 'Error in getReport : ' + JSON.stringify(error));
      });
    });
  }

  sort() {
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }

  goToFieldJobOverview(task) {
    let self = this;
    this.utilityProvider.showSpinner();
    this.valueProvider.setDebriefHeader(false);
    // 07/27/2018 Gurkirat Singh -- Removed dependent navigation to Overview page
    // On click of 'goToFieldJobOverview()' page will now redirect to Overview page and meanwhile the LOV's will
    // be loaded to valueProvider
    this.valueProvider.setTask(task)
      .then(() => {
        this.valueProvider.setTaskId(task.Task_Number);
        this.valueProvider.setTaskObject(task);
        if (task.Task_Status == 'Completed-Awaiting Review') {
          this.navCtrl.push("SummaryPage", { ifCompleted: true }).then(() => {
            this.utilityProvider.stopSpinner();
          }).catch((error: any) => {
            this.utilityProvider.stopSpinner();
            // 12-28-2018 -- Mansi Arora -- change in logs comment
            self.logger.log(self.fileName, 'goToFieldJobOverview', 'Error in goToFieldJobOverview, push("SummaryPage"): ' + JSON.stringify(error));
          });
          this.valueProvider.setVerify(false);
          this.valueProvider.setIsCustomerSelected(false);
          this.valueProvider.setIsSummarySelected(false);
        }
        else {
          this.navCtrl.push("FieldJobOverviewPage").then(() => {

            this.getManufacturerlist().then((res) => {
              this.getManufacturerlist().then((res) => {
                this.getProductlist().then((res) => {
                  this.utilityProvider.stopSpinner();
                }).catch((error: any) => {
                  this.utilityProvider.stopSpinner();
                  // 12-28-2018 -- Mansi Arora -- change in logs comment
                  self.logger.log(this.fileName, 'goToFieldJobOverview', 'Error in getProductlist: ' + JSON.stringify(error));
                });
              }).catch((error: any) => {
                this.utilityProvider.stopSpinner();
                // 12-28-2018 -- Mansi Arora -- change in logs comment
                self.logger.log(this.fileName, 'goToFieldJobOverview', 'Error in getManufacturerlist: ' + JSON.stringify(error));
              });
            }).catch((error: any) => {
              this.utilityProvider.stopSpinner();
              // 12-28-2018 -- Mansi Arora -- change in logs comment
              self.logger.log(this.fileName, 'goToFieldJobOverview', 'Error in getManufacturerlist: ' + JSON.stringify(error));
            });
          }).catch((error: any) => {
            this.utilityProvider.stopSpinner();
            // 12-28-2018 -- Mansi Arora -- change in logs comment
            self.logger.log(this.fileName, 'goToFieldJobOverview', 'Error in goToFieldJobOverview, push("FieldJobOverviewPage") : ' + JSON.stringify(error));
          });
        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'goToFieldJobOverview', 'Error in goToFieldJobOverview , valueProvider response: ' + JSON.stringify(error));
      });
  };

  onCancel() {
    this.taskInput = '';
  }

  setFullLimit(limitParamName, criteria) {
    this[limitParamName] = this.searchPipe.transform(this.searchPipe.transform(this.myTaskDetails, this.taskInput), criteria).length;
  }
  setReportLimit(limitParamName, criteria) {
    this[limitParamName] = this.searchPipe.transform(this.searchPipe.transform(this.myReports, this.taskInput), criteria).length;
  }

  getProductlist() {
    return new Promise((resolve, reject) => {
      this.localService.getProducts().then((res: any) => {
        this.valueProvider.setProductList(res);
        resolve(null);
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'getProductlist', 'Error in getProducts from local service : ' + JSON.stringify(error));
      });
    }).catch((error: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'getProductlist', 'Error in getProductlist : ' + JSON.stringify(error));
    });
  }

  getStatuslist() {
    return new Promise((resolve, reject) => {
      this.localService.getStatus().then((res: any) => {
        this.valueProvider.setStatusList(res);
        resolve(null);
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'getStatuslist', 'Error in getStatus from local service : ' + JSON.stringify(error));
      });
    }).catch((error: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'getStatuslist', 'Error in getStatusList : ' + JSON.stringify(error));
    });
  }

  getManufacturerlist() {
    return new Promise((resolve, reject) => {
      this.localService.getManufacturer().then((res: any) => {
        this.valueProvider.setManufacturerList(res);
        resolve(null);
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'getManufacturerlist', 'Error in getManufacturer from local service : ' + JSON.stringify(error));
      });
    }).catch((error: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'getManufacturerlist', 'Error in getManufacturerlist : ' + JSON.stringify(error));
    });
  }

  callWorkFlowTabs(Selected_Process) {
    if (Selected_Process != null) {
      this.valueProvider.setTaskObject(null);
      this.valueProvider.setTaskId(null);
      this.valueProvider.setCurrentBUGroup(this.valueProvider.getDefaultBGID());
      this.valueProvider.setCurrentReport(null);
      this.valueProvider.setCurrentDevice(null);
      this.valueProvider.setWorkFlowGroupID(null);
      this.valueProvider.setTaskObj(null);
      this.valueProvider.setTaskObject(null);
      this.valueProvider.setTaskId(null);
      this.valueProvider.setPressureType(null);
      this.navCtrl.push("SdrTabsPage", { Selected_Process: Selected_Process, ReportID: null });
    }
  }

  editReport(currentReport: any) {
    // 05/27/2019 Gurkirat Singh - Moved common code from goToWorkflowPage() for all types of Standalone Job.
    //this.valueProvider.setCurrentBUID(currentReport.BUID);
    //this.valueProvider.setCurrentReport(currentReport);
    // 03-28-2019 Gurkirat Singh : Added WorkFlowGroupID and Device before navigating to SDR Flow
    //this.valueProvider.setWorkFlowGroupID(currentReport.ReviewWorkFlowGroupID);
    //this.valueProvider.setCurrentDevice(currentReport.Device);
    //11/15/2018 -- Mayur Varshney -- set task in value providers after getting the current standalone job via ReportID_Mobile
    if (currentReport.SELECTEDPROCESS != Enums.Selected_Process.SDR) {
      this.utilityProvider.showSpinner();
      this.localService.getStandaloneJobById(currentReport.REPORTID).then((task: any) => {
        if (task.length == 1) {
          this.valueProvider.setTask(task[0]).then(() => {
            this.valueProvider.setTaskId(task[0].Task_Number);
            this.valueProvider.setTaskObject(task[0]);
            // 01-09-2019 -- Mansi Arora -- open debrief page in case of completed job
            this.valueProvider.setVerify(false);
            this.valueProvider.setIsCustomerSelected(false);
            this.valueProvider.setIsSummarySelected(false);
            if (task[0].StatusID == Enums.Jobstatus.Completed_Awaiting_Review) {
              this.navCtrl.push("SummaryPage", { ifCompleted: true }).then(() => {
                this.utilityProvider.stopSpinner();
              }).catch((error: any) => {
                this.utilityProvider.stopSpinner();
                this.logger.log(this.fileName, 'editReport', 'Error in editReport, push("SummaryPage"): ' + JSON.stringify(error));
              });
            } else {
              this.navCtrl.push("DebriefPage");
            }
          })
        } else {
          this.valueProvider.setTaskObj(null);
          this.valueProvider.setTaskObject(null);
          this.valueProvider.setTaskId(null);
          this.goToWorkflowPage(currentReport);
        }
      })
    } else {
      this.valueProvider.setTaskObj(null);
      this.valueProvider.setTaskObject(null);
      this.valueProvider.setTaskId(null);
      this.goToWorkflowPage(currentReport);
    }
  }

  goToWorkflowPage(currentReport) {
    this.valueProvider.setCurrentReport(currentReport);
    this.localservicesdr.getDEVICEIDForFlowIsolation(currentReport.REPORTID).then((deviceid: any) => {
      console.log("DEVICEID", deviceid);
      if (currentReport.REPORTSTATUS == Enums.ReportStatus.Completed) {
        if (currentReport.SELECTEDPROCESS == Enums.Selected_Process.SDR) this.utilityProvider.showSpinner();
        this.utilityProvider.stopSpinner();
        if (currentReport.SELECTEDPROCESS == Enums.Selected_Process.SDR)
          switch (deviceid) {
            case Enums.FlowIsolationProductId.ControlValve:
            case Enums.FlowIsolationProductId.Isolation:
            case Enums.FlowIsolationProductId.Controller:
            case Enums.FlowIsolationProductId.Instrument:
            case Enums.FlowIsolationProductId.LevelTroll:
            case Enums.FlowIsolationProductId.Regulator:
            case Enums.FlowIsolationProductId.TrimOnly:
              this.navCtrl.push("IsoReviewSubmitPage");
              break;
            case Enums.Product.Actuator:
              this.navCtrl.push("ReviewSubmitPage");
              break;
          }
        //this.navCtrl.push("ReviewSubmitPage");
      } else {
        this.utilityProvider.stopSpinner();
        this.navCtrl.push("SdrTabsPage");
      }
    }).catch((error: any) => {
      // 12-28-2018 -- Mansi Arora -- change in logs comment
      this.logger.log(this.fileName, 'goToWorkflowPage', 'Error in getDEVICEIDForFlowIsolation from local service : ' + JSON.stringify(error));
    });

  }


  groupBySameKeyValues(xs, k) {
    return xs.reduce(function (rv, x) {
      (rv[x[k]] = rv[x[k]] || []).push(x);
      return rv;
    }, {});
  }

  getReportList(elements, zeroElm) {
    var element = zeroElm;
    //console.log("elements"+JSON.stringify(elements));
    // console.log("zeroElm"+JSON.stringify(zeroElm));
    for (var i = 0; i < elements.length; i++) {
      var jsonObj = elements[i];
      element[jsonObj.ElementName] = jsonObj.Value;
    }
    this.myReports.push(element);
  }


  /**
  * Initialise filter functionality
  * @class Fieldjoblist
  * @author Prateek
  */
  filter(value) {
    //10-23-2018 Radheshyam kumar updated this code for filter legends
    //03-14-2019 Radheshyam kumar Added filter for "Both" and update check into 'Accepted'
    let permissions = this.permissions;
    if (this.selectedLegend === "" || this.selectedLegend != value) {
      this.selectedLegend = value;
      this.myTaskDetails = this.filterTaskDetail.filter(function (taskdetail) {
        //08/01/2019 Mayur : fix pending job filter
        return (value == 'Pending' ? taskdetail.Sync_Status == 'false' : taskdetail.Task_Status == value);
      });
      // 02-06-2019 -- Mansi Arora -- apply color filters on Standalone jobs also
      if (value == 'Completed-Awaiting Review') {
        this.pendingReports = [];
        this.completedReports = this.myReports.filter(function (currentReport) {
          if (permissions.CreateStandaloneJob) {
            return currentReport.REPORTSTATUS == Enums.ReportStatus.Completed;
          } else{
            return currentReport.Status == Enums.ReportStatus.Completed;
          }
        });
      } else if (value == 'Both') {
        this.completedReports = [];
        this.pendingReports = this.myReports.filter(function (currentReport) {
          if (permissions.CreateStandaloneJob) {
            if (currentReport.REPORTSTATUS != null && currentReport.REPORTSTATUS == Enums.Jobstatus.Completed_Awaiting_Review && currentReport.SELECTEDPROCESS == Enums.Selected_Process.FCR_AND_SDR && currentReport.REPORTSTATUS != Enums.ReportStatus.Completed) {
              return currentReport;
            } else {
              return null;
            }
          } else{
            if (currentReport.TaskStatus != null && currentReport.TaskStatus == Enums.Jobstatus.Completed_Awaiting_Review && currentReport.Selected_Process == Enums.Selected_Process.FCR_AND_SDR && currentReport.Status != Enums.ReportStatus.Completed) {
              return currentReport;
            } else {
              return null;
            }
          }
        });
      } else if (value == 'Accepted') {
        this.completedReports = [];
        this.pendingReports = this.myReports.filter(function (currentReport) {
          if (permissions.CreateStandaloneJob) {
            return currentReport.REPORTSTATUS != Enums.ReportStatus.Completed && (currentReport.REPORTSTATUS == null || currentReport.REPORTSTATUS != Enums.Jobstatus.Completed_Awaiting_Review);
          }else{
            return currentReport.Status != Enums.ReportStatus.Completed && (currentReport.TaskStatus == null || currentReport.TaskStatus != Enums.Jobstatus.Completed_Awaiting_Review);
          }
          
        });
      } else if (value == 'Debrief In Progress' || value == 'Debrief Started') {
        this.completedReports = [];
        this.pendingReports = this.myReports.filter(function (currentReport) {
          if (permissions.CreateStandaloneJob) {
            return currentReport.REPORTSTATUS != Enums.ReportStatus.Completed;
          } else{
            return currentReport.Status != Enums.ReportStatus.Completed;
          }
        });
      } else {
        this.pendingReports = [];
        this.completedReports = [];
      }
    } else {
      this.myTaskDetails = this.filterTaskDetail;
      this.pendingReports = this.myReports.filter(function (currentReport) {
        if (permissions.CreateStandaloneJob) {
          return currentReport.REPORTSTATUS != Enums.ReportStatus.Completed;
        } else{
          return currentReport.Status != Enums.ReportStatus.Completed;
        }
      });
      this.completedReports = this.myReports.filter(function (currentReport) {
        if (permissions.CreateStandaloneJob) {
          return currentReport.REPORTSTATUS == Enums.ReportStatus.Completed;
        } else{
          return currentReport.Status == Enums.ReportStatus.Completed;
        }
      });
      this.selectedLegend = "";
    }
  }

}
