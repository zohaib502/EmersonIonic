import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Tabs, App } from 'ionic-angular';
import * as Enums from '../../../enums/enums';
import { ValueProvider } from '../../../providers/value/value';
import { UtilityProvider } from '../../../providers/utility/utility';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../providers/logger/logger';
import { LocalServiceSdrProvider } from '../../../providers/local-service-sdr/local-service-sdr';
import { SdrTabsData } from '../../../beans/SdrTabsData';

@IonicPage()
@Component({
  selector: 'page-sdr-tabs',
  templateUrl: 'sdr-tabs.html',
})
export class SdrTabsPage {
  fileName: any = "SdrTabsPage";
  selectedIndex = 0;
  header_data: any;
  showFurtherTabs = false;
  showIsoTabs = false;
  showInstrumentTabs = true;
  showLvltrolTabs = true;
  showRegulatorTabs = true;
  showTrimonlyTabs = true;
  showControllerTabs = true;
  debriefFlow = true;
  reportData: any;
  task: any;
  enableSelectDevice = false;
  Enums: any = Enums;

  deviceType: any;

  sdrtab1Root: any = 'NewRepairReportPage';
  sdrtab2Root: any = 'SelectDevicePage';

  sdrTabs: any = [];

  @ViewChild('SDRTabs') SDRTabRef: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public valueProvider: ValueProvider,
    public utilityProvider: UtilityProvider, public localService: LocalServiceProvider, public localServiceSdr: LocalServiceSdrProvider,
    public appCtrl: App, public logger: LoggerProvider) {
    this.header_data = { title1: "", title2: "New Report" };
    this.setPage("SDR");
    this.reportData = valueProvider.getCurrentReport();
    this.task = this.navParams.get('task');
    if (this.navParams.get('Selected_Process')) {
      this.valueProvider.setSelectedprocess(this.navParams.get('Selected_Process'))
    }
    if (this.task && this.task.IsStandalone == 'true' && this.task.Selected_Process == Enums.Selected_Process.FCR_AND_SDR) {
      this.showFurtherTabs = true;
    }
    // this.redirectTabs();
    if (this.valueProvider.getCurrentReport()) {
      this.utilityProvider.showSpinner();
    }

  }

  ionViewDidEnter() {
    this.events.subscribe('goToFCR', () => {
      this.navToFCRFromSubmitReport();
    });

    this.setDeviceType();
  }

  ionViewWillLeave() {
    // this.header_data = null
    this.events.unsubscribe("goToFCR");
  }

  ionViewDidLoad() {
  }

  setPage(user) {
    this.events.publish('user:created', user);
  }

  redirectTabs(tab) {
    let self = this;
    if (this.valueProvider.getCurrentReport()) {
      if (this.valueProvider.getCurrentReport().REPORTSTATUS == Enums.ReportStatus.InDraft) {
        //this.debriefTabRef.select(1);
        this.enableSelectDevice = true;
        this.showFurtherTabs = false;
        //this.selectedIndex = 1;
        setTimeout(() => {
          if (self.SDRTabRef) self.SDRTabRef.select(1, self.valueProvider.getCurrentReport()).then(() => {
            // console.log("Tab Selected")
          });
          this.utilityProvider.stopSpinner();
        }, 200);
      }
      if (this.valueProvider.getCurrentReport().REPORTSTATUS == Enums.ReportStatus.DeviceSelected) {
        //this.debriefTabRef.select(2);
        this.enableSelectDevice = true;
        if (this.valueProvider.getCurrentReport().SELECTEDPROCESS != Enums.Selected_Process.FCR) {
          this.showFurtherTabs = true;
        } else {
          tab = 1;
        }
        //this.selectedIndex = 2;
        setTimeout(() => {
          if (self.SDRTabRef)
            self.SDRTabRef.select(tab, self.valueProvider.getCurrentReport()).then(() => {
              // console.log("Tab Selected")
            });
          this.utilityProvider.stopSpinner();
        }, 100);
      }
    } else {
      this.showFurtherTabs = false;
      this.enableSelectDevice = false;
      //this.selectedIndex = 0;

      setTimeout(() => {
        if (self.SDRTabRef)
          self.SDRTabRef.select(0, self.valueProvider.getCurrentReport()).then(() => {
            // console.log("Tab Selected")
          });;
      }, 100);

    }
  }

  newRepair(event) {
    this.debriefFlow = true;
    this.tabChange(event);
  }

  tabChange(event) {
    let tabIndex = this.SDRTabRef.getSelected().index;
    this.valueProvider.setCurrentSDRTabIndex(tabIndex);
    if (this.SDRTabRef) this.SDRTabRef.select(tabIndex, this.valueProvider.getCurrentReport()).then(() => {
      // console.log("Tab Selected");
    });
  }

  /**
   * 01-09-2019 -- Mansi Arora -- navigate to Debrief on click of FCR button
   * calls value provider to get current report
   * set task details and opens the debrief page
   * @memberOf WorkFlowPage
  */
  navToFCRFromSubmitReport() {
    this.localService.getStandaloneJobById(this.valueProvider.getCurrentReport().REPORTID).then((task: any) => {
      if (task.length == 1) {
        this.valueProvider.setTask(task[0]).then(() => {
          this.valueProvider.setTaskId(task[0].Task_Number);
          this.valueProvider.setTaskObject(task[0]);
          this.valueProvider.setVerify(false);
          this.valueProvider.setIsCustomerSelected(false);
          this.valueProvider.setIsSummarySelected(false);
          if (task[0].StatusID == Enums.Jobstatus.Completed_Awaiting_Review) {
            // 03-28-2019 Gurkirat Singh : Changed the navigation according to status to resolve double headers
            let controller;
            if (this.valueProvider.getCurrentReport().REPORTSTATUS == Enums.ReportStatus.Completed) {
              controller = this.navCtrl;
            } else {
              controller = this.appCtrl.getRootNav();
            }
            controller.setRoot("SummaryPage", { ifCompleted: true }).then(() => {
              this.utilityProvider.stopSpinner();
            }).catch((error: any) => {
              this.utilityProvider.stopSpinner();
              this.logger.log(this.fileName, 'navToFCRFromSubmitReport', 'Error in navToFCRFromSubmitReport, push("SummaryPage"): ' + JSON.stringify(error));
            });
          } else {
            this.redirectToDebrief();
          }
        })
      } else {
        this.redirectToDebrief();
      }
    })
  }

  private redirectToDebrief() {
    // 02/18/2019 -- RadheShyam -- removed old unused code , directly push DebirefPage on zeroth index
    this.appCtrl.getRootNav().setRoot("DebriefPage", { fromDebrief: false, isBothFlow: true });
    //this.appCtrl.getRootNavs()[0].push("DebriefPage");
  }

  private setDeviceType() {
    setTimeout(() => {
      let reportId;
      let tab = 2;
      let sdrTabsData = new SdrTabsData();
      if (this.valueProvider.getCurrentReport()) {
        reportId = this.valueProvider.getCurrentReport().REPORTID;
      }
      if (reportId) {
        if (this.valueProvider.getCurrentReport().REPORTSTATUS == Enums.ReportStatus.DeviceSelected) {
          if (this.valueProvider.getCurrentReport().SELECTEDPROCESS != Enums.Selected_Process.FCR) {
            this.localServiceSdr.getDEVICEIDForFlowIsolation(reportId).then((val) => {
              if (val == Enums.Product.Actuator) {
                this.localServiceSdr.getProductID(reportId).then((val) => {
                  this.deviceType = val;
                  if (this.deviceType == 1) {
                    this.sdrTabs = sdrTabsData.actuationTabs.filter((i) => { return i.phMenu; });
                  } else if (this.deviceType == 2) {
                    this.sdrTabs = sdrTabsData.actuationTabs.filter((i) => { return i.aeMenu; });
                  } else if (this.deviceType == 3 || this.deviceType == 4) {
                    this.sdrTabs = sdrTabsData.actuationTabs.filter((i) => { return i.afMenu; });
                  }
                  // Redirect here
                  this.redirectTabs(tab);
                });
              }
              else {
                let fdoValue;
                if (this.valueProvider.getCurrentReport().FIELDSERVICEDIANOSTICONLY == "true") {
                  fdoValue = this.valueProvider.getCurrentReport().FIELDSERVICEDIANOSTICONLY;
                }
                switch (val) {
                  case Enums.FlowIsolationProductId.ControlValve:
                  case Enums.FlowIsolationProductId.Isolation:
                    this.sdrTabs = fdoValue ? sdrTabsData.isoCrtTabs.filter((i) => { return i.fdo; }) : sdrTabsData.isoCrtTabs;
                    break;
                  case Enums.FlowIsolationProductId.Controller:
                    this.sdrTabs = fdoValue ? sdrTabsData.isoController.filter((i) => { return i.fdo; }) : sdrTabsData.isoController;
                    break;
                  case Enums.FlowIsolationProductId.Instrument:
                    this.sdrTabs = fdoValue ? sdrTabsData.isoInstrumentTabs.filter((i) => { return i.fdo; }) : sdrTabsData.isoInstrumentTabs;
                    break;
                  case Enums.FlowIsolationProductId.LevelTroll:
                  case Enums.FlowIsolationProductId.Regulator:
                    this.sdrTabs = fdoValue ? sdrTabsData.isoLevelTrolRegTabs.filter((i) => { return i.fdo; }) : sdrTabsData.isoLevelTrolRegTabs;
                    break;
                  case Enums.FlowIsolationProductId.TrimOnly:
                    this.sdrTabs = fdoValue ? sdrTabsData.isoTrimOnlyTabs.filter((i) => { return i.fdo; }) : sdrTabsData.isoTrimOnlyTabs;
                    break;
                }

                this.redirectTabs(tab);
              }
            })
          } else{
            this.redirectTabs(tab);
          }
        } else {
          this.redirectTabs(tab);
        }
      } else {
        this.redirectTabs(tab);
      }

    }, 100);
  }
}
