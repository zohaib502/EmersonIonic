import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { UtilityProvider } from '../../../providers/utility/utility';
import { ValueProvider } from '../../../providers/value/value';
import { LoggerProvider } from '../../../providers/logger/logger';
import { LocalServiceSdrProvider } from '../../../providers/local-service-sdr/local-service-sdr';
import * as Enums from "../../../enums/enums";
declare var cordova: any;
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { SdrTabsData } from '../../../beans/SdrTabsData';

@IonicPage()
@Component({
  selector: 'page-new-repair-report',
  templateUrl: 'new-repair-report.html',
})
export class NewRepairReportPage {
  sdrReportObj: any = {};
  busineesGroup: any;
  allWorldArea: any = [];
  allEmservicesite: any = [];
  fileName: any = 'NewRepairReportPage';
  recordExists: boolean = false;
  SELECTEDPROCESS: any;
  REPORTID: any = null;
  srdReportData: any = [];
  errorObj: any = {};
  enums: any;
  datepickerConfig: Partial<BsDatepickerConfig>;
  @ViewChild('datepicker')
  private _picker: BsDatepickerDirective;
  deviceSelectionClicked: boolean = false;
  custModelData: any = {} ;
  isDisabled: boolean = false;
  disableJobID: boolean = false;
  timeout: number;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utilityProvider: UtilityProvider,
    public valueService: ValueProvider, public localService: LocalServiceProvider,
    public logger: LoggerProvider, public localServiceSdr: LocalServiceSdrProvider, public events: Events, public bsDatepickerConfig: BsDatepickerConfig) {
    this.enums = Enums;
  }

  ionViewDidEnter() {
    // this.sdrReportObj = {};
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    this.navCtrl.parent.viewCtrl.instance.header_data = { title1: "", title2: "New Report" };
    this.sdrReportObj.BUSINESSGROUP = Enums.BusinessGroup.Final_Control;
    this.sdrReportObj.CREATEDBY = this.valueService.getUserId();
    this.sdrReportObj.CREATEDBYNAME = this.valueService.getUser().Name;

    this.deviceSelectionClicked = false;
    this.getLookupsWordArea();
    if (this.valueService.getUserPreferences()[0].WorldAreaID) {
      this.sdrReportObj.WORLDAREA = this.valueService.getUserPreferences()[0].WorldAreaID;
    }
    this.checkuserPreWA();
    this.checkIfTimeEntriesExist();
    // if (this.navParams.data.data && this.navParams.data.data.REPORTID) {
    //   this.sdrReportObj.REPORTID = this.navParams.data.data.REPORTID;
    // }
    if (this.valueService.getCurrentReport()) {
      this.sdrReportObj.REPORTID = this.valueService.getCurrentReport().REPORTID;
      this.sdrReportObj.SELECTEDPROCESS = this.valueService.getCurrentReport().SELECTEDPROCESS;
      this.valueService.setFdo(this.valueService.getCurrentReport().FIELDSERVICEDIANOSTICONLY);
    }
    else {
      this.sdrReportObj.SELECTEDPROCESS = this.valueService.getSelectedprocess();
      this.sdrReportObj.REPORTID = null;
      this.sdrReportObj.SELECTEDPROCESS = this.valueService.getSelectedprocess();
      this.valueService.setFdo(null);

    }

    if (this.sdrReportObj.REPORTID != null) {
      //get data
      // this.valueService.setReportID(this.sdrReportObj.REPORTID);
      this.recordExists = true;
      this.getSDRReport();
    }
    if (this.valueService.getTaskObject() && (this.valueService.getTaskObject().IsStandalone == 'false')) {
      this.sdrReportObj.CUSTOMERNAME = this.valueService.getTaskObject().Customer_Name;
      this.sdrReportObj.CUSTOMERID = this.valueService.getTaskObject().Customer_ID
      this.sdrReportObj.CUSTOMERPO = this.valueService.getTaskObject().Customer_PONumber;
      this.sdrReportObj.JOBID = this.valueService.getTaskObject().Task_Number;
      this.sdrReportObj.BUSINESSUNIT = this.valueService.getTaskObject().Business_Unit;
      this.sdrReportObj.BUSINESSGROUP = this.valueService.getTaskObject().Business_Group == Enums.BusinessGroupNames.Final_Control ? 1 : '';
      this.sdrReportObj.SCOPEOFWORK = this.valueService.getTaskObject().Request_Summary;
      this.sdrReportObj.ISSTANDALONE = this.valueService.getTaskObject().IsStandalone;
      this.isDisabled = true;
    }
    this.utilityProvider.stopSpinner();
  }

  onShowPicker(event) {
    const dayHoverHandler = event.dayHoverHandler;
    const hoverWrapper = (hoverEvent) => {
      const { cell, isHovered } = hoverEvent;

      if ((isHovered &&
        !!navigator.platform &&
        /iPad|iPhone|iPod/.test(navigator.platform)) &&
        'ontouchstart' in window
      ) {
        (this._picker as any)._datepickerRef.instance.daySelectHandler(cell);
      }

      return dayHoverHandler(hoverEvent);
    };
    event.dayHoverHandler = hoverWrapper;
  }

  CheckUniqueJob() {
    return new Promise((resolve, reject) => {
      if (this.sdrReportObj.JOBID) {
        let jobid = this.sdrReportObj.JOBID.toString();
        this.sdrReportObj.JOBID = jobid.trim();
        this.localServiceSdr.checkIfSameJobId(this.sdrReportObj.REPORTID, this.sdrReportObj.JOBID).then((res: any) => {
          if (res[0].count != 0) {
            this.sdrReportObj.JOBID = " ";
            this.errorObj['JOBID'] = true;
            this.utilityProvider.presentToastButtom(Enums.Messages.Job_ID_Unique, '3000', 'top', '', 'OK');
            resolve(true);
          } else {
            resolve(false);
          }
        });

      } else {
        resolve(false);
      }
    })
  }

  checkuserPreWA() {
    let worldArea = this.valueService.getUserPreferences()[0].WorldAreaID ? (this.valueService.getUserPreferences()[0].WorldAreaID).toString() : "";
    switch (worldArea) {
      case '12057':
        this.sdrReportObj.WORLDAREANAME = "NorthAmerica";
        break;
      case '12058':
        this.sdrReportObj.WORLDAREANAME = "LatAm";
        break;
      case '12059':
        this.sdrReportObj.WORLDAREANAME = "Europe";
        break;
      case '12060':
        this.sdrReportObj.WORLDAREANAME = "MEA";
        break;
      case '12061':
        this.sdrReportObj.WORLDAREANAME = "Asia";
        break;
      default:
        break;
    }
    if (this.sdrReportObj.WORLDAREA != null)
      this.getLookupsEmservicesite();
  }
  ionViewWillLeave() {
    if (this.navCtrl.parent.viewCtrl.id != "SdrTabsPage") return;
    if (!this.isValidatedOnLeave()) {
      this.save();
      this.errorObj = {};
      // this.recordExists = false;
    } else {
      if (!this.deviceSelectionClicked) {
        this.errorObj = {};
        this.utilityProvider.presentAlert();
        throw new Error('Form validation error!');
      }
    }
    clearTimeout(this.timeout);
  }

  getLookupsWordArea() {
    this.localServiceSdr.getLookupsByLookupType("WorldArea").then((response: any[]) => {
      this.allWorldArea = response;
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getLookupsWordArea', ' Error in getLookupsByLookupType : ' + JSON.stringify(error));
    });
  }
  getLookupsEmservicesite() {
    this.localServiceSdr.getLookupsByLookupType("Sites", this.sdrReportObj.WORLDAREA).then((response: any[]) => {
      this.allEmservicesite = response;
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getLookupsEmservicesite', ' Error in getLookupsByLookupType : ' + JSON.stringify(error));
    });
  }
  showCustomerModal(key) {
    event.preventDefault();
    let searchModal = this.utilityProvider.showModal('CustomerSearchModalPage', "", { enableBackdropDismiss: true, cssClass: 'CommonSearchModalPage-Customer' });
    searchModal.onDidDismiss(data => {
      if (data != undefined) {
        this.sdrReportObj.CUSTOMERNAME = data.Name;
        this.sdrReportObj.CUSTOMERID = data.CustomerID;
        this.custModelData = data;

        this.clearValidation(key);
      }
    });
    searchModal.present();
  }

  searchModal(data) {
    let dataArray: any = [];
    switch (data) {
      case 'WORLDAREANAME':
        dataArray = this.allWorldArea;
        break;
      case 'SERVICESITENAME':
        dataArray = this.allEmservicesite;
        break;
      default:
        break;
    }
    let searchModal = this.utilityProvider.showModal("SearchModalPage", { dataSource: dataArray, type: data }, { enableBackdropDismiss: true, cssClass: 'cssSearchModalPage' });
    searchModal.present();
    searchModal.onDidDismiss(data => {
      if (data != null) {
        switch (data.type) {
          case 'WORLDAREANAME':
            this.sdrReportObj.WORLDAREANAME = data.LookupValue;
            this.sdrReportObj.WORLDAREA = data.ID;
            this.sdrReportObj.SERVICESITENAME = '';
            this.sdrReportObj.SERVICESITE = '';
            this.getLookupsEmservicesite();
            this.clearValidation(data.type);
            break;
          case 'SERVICESITENAME':
            this.sdrReportObj.SERVICESITENAME = data.LookupValue;
            this.sdrReportObj.SERVICESITE = data.ID;
            this.clearValidation(data.type);
            break;
          default:
            break;
        }
      }
    });
  }

  getSDRReport() {
    this.localServiceSdr.getSdrReport(this.sdrReportObj.REPORTID).then((response: any[]) => {
      if (response.length > 0) {
        this.sdrReportObj = response[0];
        if (response[0].REPAIRDATE) {
          this.sdrReportObj.REPAIRDATE = new Date(response[0].REPAIRDATE);
        }

        this.getLookupsEmservicesite();
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getSDRReport', ' Error in getSDRReport : ' + JSON.stringify(error));
    });
  }

  populateReportObject() {
    this.sdrReportObj.REPORTID = this.recordExists ? this.sdrReportObj.REPORTID : this.utilityProvider.getUniqueKey();
    this.sdrReportObj.REPORTSTATUS = this.recordExists ? this.sdrReportObj.REPORTSTATUS : Enums.ReportStatus.InDraft;
    let IsStandalone = this.valueService.getTaskObject() ? (this.valueService.getTaskObject().IsStandalone == "true" ? 'Y' : 'N') : 'Y';
    this.sdrReportObj.ISSTANDALONE = IsStandalone;
    this.sdrReportObj.CREATEDBY = this.recordExists ? this.sdrReportObj.CREATEDBY : this.valueService.getUser().UserID;
    this.sdrReportObj.CREATEDDATE = this.recordExists ? this.sdrReportObj.CREATEDDATE : this.localServiceSdr.getCurrentDate();
  }

  save() {
    this.sdrReportObj.SYNCSTATUS = 'N';
    this.sdrReportObj.MODIFIEDBY = this.valueService.getUser().UserID;
    this.sdrReportObj.MODIFIEDDATE = this.localServiceSdr.getCurrentDate();
    if (this.sdrReportObj.FIELDSERVICEDIANOSTICONLY && (this.sdrReportObj.FIELDSERVICEDIANOSTICONLY == true || this.sdrReportObj.FIELDSERVICEDIANOSTICONLY == 'true')) {
      this.sdrReportObj.FIELDREPAIR = 'false';
      this.sdrReportObj.DEPOTREPAIR = 'false';
    } else if (this.sdrReportObj.DEPOTREPAIR && (this.sdrReportObj.DEPOTREPAIR == true || this.sdrReportObj.DEPOTREPAIR == 'true')) {
      this.sdrReportObj.FIELDSERVICEDIANOSTICONLY = 'false';
      this.sdrReportObj.FIELDREPAIR = 'false';
    }
    else if (this.sdrReportObj.FIELDREPAIR && (this.sdrReportObj.FIELDREPAIR == true || this.sdrReportObj.FIELDREPAIR == 'true')) {
      this.sdrReportObj.FIELDSERVICEDIANOSTICONLY = 'false';
      this.sdrReportObj.DEPOTREPAIR = 'false';
    }
    this.valueService.setCurrentReport(this.sdrReportObj);
    this.localServiceSdr.insertUpdateSdrReport(this.sdrReportObj, this.recordExists).then((response: any) => {
      if (response) {
        // this.valueService.setCurrentReport(this.sdrReportObj);
        if (this.sdrReportObj.ISSTANDALONE == "N") {
          this.updateReportId();
        }
        else {
          this.InsertFcrTask();
        }
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'save', ' Error in insertSdrReport : ' + JSON.stringify(error));
    });
  }

  redirect() {
    this.populateReportObject();
    return this.CheckUniqueJob().then((isDuplicateID) => {
      if (!isDuplicateID) {
        // this.navCtrl.parent.viewCtrl.instance.reportData.data = this.sdrReportObj;
        this.valueService.setCurrentReport(this.sdrReportObj);
        if (!this.isValidated()) {
          this.navCtrl.parent.viewCtrl.instance.enableSelectDevice = true;
          this.deviceSelectionClicked = true;
          // this.valueService.setReportID(this.sdrReportObj.REPORTID);
          this.createFolder(this.sdrReportObj.REPORTID);
        }
        else {
          this.utilityProvider.presentAlert();
        }
      }
    })
  }

  createFolder(reportId) {
    let reportPath = cordova.file.dataDirectory + "/reportfiles/";
    this.utilityProvider.createDirIfNotExist(reportPath, reportId.toString(), false).then((res: any) => {
      if (res) {
        this.navCtrl.parent.select(1);
      }
    });
  }

  isValidated() {
    let checkRequired = false;
    if (!this.deviceSelectionClicked) {
      if (!this.utilityProvider.isNotNull(this.sdrReportObj.JOBID)) {
        this.errorObj['JOBID'] = true;
        checkRequired = true;
      }
      if (!this.utilityProvider.isNotNull(this.sdrReportObj.WORLDAREANAME)) {
        this.errorObj['WORLDAREANAME'] = true;
        checkRequired = true;
      }
      if (!this.utilityProvider.isNotNull(this.sdrReportObj.SERVICESITENAME)) {
        this.errorObj['SERVICESITENAME'] = true;
        checkRequired = true;
      }
      if (!this.utilityProvider.isNotNull(this.sdrReportObj.REPAIRDATE)) {
        this.errorObj['REPAIRDATE'] = true;
        checkRequired = true;
      }
      if (!this.utilityProvider.isNotNull(this.sdrReportObj.CUSTOMERNAME)) {
        this.errorObj['CUSTOMERNAME'] = true;
        checkRequired = true;
      }
    }
    return checkRequired;
  }

  isValidatedOnLeave() {
    let checkRequired = false;
    if (!this.deviceSelectionClicked) {
      if (this.sdrReportObj.JOBID != undefined && !this.utilityProvider.isNotNull(this.sdrReportObj.JOBID)) {
        this.errorObj['JOBID'] = true;
        checkRequired = true;
      }
      if (this.sdrReportObj.WORLDAREANAME != undefined && !this.utilityProvider.isNotNull(this.sdrReportObj.WORLDAREANAME)) {
        this.errorObj['WORLDAREANAME'] = true;
        checkRequired = true;
      }
      if (this.sdrReportObj.SERVICESITENAME != undefined && !this.utilityProvider.isNotNull(this.sdrReportObj.SERVICESITENAME)) {
        this.errorObj['SERVICESITENAME'] = true;
        checkRequired = true;
      }
      if (this.sdrReportObj.REPAIRDATE != undefined && !this.utilityProvider.isNotNull(this.sdrReportObj.REPAIRDATE)) {
        this.errorObj['REPAIRDATE'] = true;
        checkRequired = true;
      }
      if (this.sdrReportObj.CUSTOMERNAME != undefined && !this.utilityProvider.isNotNull(this.sdrReportObj.CUSTOMERNAME)) {
        this.errorObj['CUSTOMERNAME'] = true;
        checkRequired = true;
      }
    }
    return checkRequired;
  }

  clearValidation(key) {
    if (this.utilityProvider.isNotNull(this.sdrReportObj[key])) {
      this.errorObj[key] = false;
    }
  }

  public initTask() {
    return new Promise((resolve, reject) => {
      this.localService.updateTaskNumberInTime(this.sdrReportObj.JOBID, this.sdrReportObj.REPORTID).then(() => {
        this.valueService.setTaskId(this.sdrReportObj.REPORTID);
        this.localService.getTask().then((response: any) => {
          this.valueService.setTaskObject(response[0]);
          this.valueService.setTask(response[0]);
          this.valueService.setTask(response[0]).then((res: any) => {
            if (res == 'success') {
              //11/14/2018 kamal : set summary and customer isSelected false
              this.valueService.setVerify(false);
              this.valueService.setIsCustomerSelected(false);
              this.valueService.setIsSummarySelected(false);
              this.utilityProvider.stopSpinner();
              resolve(true);
            } else {
              this.logger.log(this.fileName, "goToFCR_SDR", "error in setTask : failure");
              resolve(false);
            }
          }).catch((error) => {
            this.utilityProvider.stopSpinner();
            this.logger.log(this.fileName, "goToFCR_SDR", "error in setTask :" + JSON.stringify(error));
            resolve(false);
          });
        })
      }).catch((error) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, "goToFCR_SDR", "error in updateTaskNumberInTime :" + JSON.stringify(error));
        resolve(false);
      });

    });
  }

  async InsertFcrTask() {
    try {
      if (this.sdrReportObj.SELECTEDPROCESS == Enums.Selected_Process.FCR || this.sdrReportObj.SELECTEDPROCESS == Enums.Selected_Process.FCR_AND_SDR) {
        if (Object.keys(this.custModelData).length) {
          this.sdrReportObj.Street_Address = this.custModelData.AddressLine1;
          this.sdrReportObj.Zip_Code = this.custModelData.Zipcode;
          this.sdrReportObj.City = this.custModelData.City;
          this.sdrReportObj.State = this.custModelData.State;
          this.sdrReportObj.Country = this.custModelData.Country;
          this.sdrReportObj.Address1 = this.custModelData.AddressLine1;
          this.sdrReportObj.Address2 = this.custModelData.AddressLine2;
        }
        this.sdrReportObj.Task_Status = 'Debrief Started';
        this.sdrReportObj.Start_Date = this.localServiceSdr.getCurrentDate();
        this.sdrReportObj.End_Date = this.localServiceSdr.getCurrentDate();
        this.sdrReportObj.Type = 'STANDALONE';
        this.sdrReportObj.StatusID = Enums.Jobstatus.Debrief_Started;
        this.sdrReportObj.IsStandalone = 'true';
        this.sdrReportObj.OracleDBID = this.valueService.getUserId();
        this.sdrReportObj.ResourceId = this.valueService.getResourceId();
        this.sdrReportObj.Sync_Status = 'false'
        this.sdrReportObj.Name = this.valueService.getUser().Name;
        this.sdrReportObj.Selected_Process = this.sdrReportObj.SELECTEDPROCESS;
        this.sdrReportObj.DBCS_SyncStatus = "false";
        if (Object.keys(this.custModelData).length) {
          await this.localServiceSdr.insertFCRTask(this.sdrReportObj)
          this.initTask()
        } else {
          await this.localServiceSdr.updateFcrTask(this.sdrReportObj)
          this.initTask()
        }
        await this.localService.refreshTaskList();
      }
    } catch (e) {
      this.logger.log(this.fileName,"InsertFcrTask",e.message)
    }
  }
  updateReportId() {
    this.localServiceSdr.updateReportId(this.sdrReportObj).then((response: any[]) => {

    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'updateReportId', ' Error in updateReportId : ' + JSON.stringify(error));
    });
  }
  fdoToggle(fdoValue) {
    this.valueService.setFdo(fdoValue);
    if (this.sdrReportObj.REPORTID) {
      this.localServiceSdr.getDEVICEIDForFlowIsolation(this.sdrReportObj.REPORTID).then((response: any) => {
        if (response && response != Enums.Product.Actuator) {
          this.navCtrl.parent.viewCtrl.instance.SDRTabRef._tabs.length = 2;
          this.fdoNavigation(response, fdoValue);
        }
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'getDEVICEIDForFlowIsolation', ' Error in getDEVICEIDForFlowIsolation : ' + JSON.stringify(error));
      });
    }
    if (fdoValue) {
      this.localServiceSdr.deleteDataOnFDOChange(this.sdrReportObj.REPORTID);
    }
  }

  fdoNavigation(deviceId, fdoValue) {
    let sdrTabsData = new SdrTabsData();
    switch (deviceId) {
      case Enums.FlowIsolationProductId.ControlValve:
      case Enums.FlowIsolationProductId.Isolation:
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = fdoValue ? sdrTabsData.isoCrtTabs.filter((i) => { return i.fdo; }) : sdrTabsData.isoCrtTabs;
        break;
      case Enums.FlowIsolationProductId.Controller:
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = fdoValue ? sdrTabsData.isoController.filter((i) => { return i.fdo; }) : sdrTabsData.isoController;
        break;
      case Enums.FlowIsolationProductId.Instrument:
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = fdoValue ? sdrTabsData.isoInstrumentTabs.filter((i) => { return i.fdo; }) : sdrTabsData.isoInstrumentTabs;
        break;
      case Enums.FlowIsolationProductId.LevelTroll:
      case Enums.FlowIsolationProductId.Regulator:
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = fdoValue ? sdrTabsData.isoLevelTrolRegTabs.filter((i) => { return i.fdo; }) : sdrTabsData.isoLevelTrolRegTabs;
        break;
      case Enums.FlowIsolationProductId.TrimOnly:
        this.navCtrl.parent.viewCtrl.instance.sdrTabs = fdoValue ? sdrTabsData.isoTrimOnlyTabs.filter((i) => { return i.fdo; }) : sdrTabsData.isoTrimOnlyTabs;
        break;
    }

  }
  checkNotesLimit(notes) {
    this.sdrReportObj.SCOPEOFWORK = this.utilityProvider.sliceValueUptoLimit(notes, 4000);
  }
  async checkIfTimeEntriesExist() {
    try {
      this.disableJobID = false;
      if ((!this.valueService.isOSCUser() && !this.valueService.getUser().CLarityID) || (this.valueService.isOSCUser() && !this.valueService.getUser().CLarityID )) {
        let result: any = await this.localServiceSdr.checkIfTimeEntriesExist(this.sdrReportObj.JOBID);
        if (result.length > 0) {
          this.disableJobID = result[0].COUNT > 0 ? true : false;
        }
      }
    } catch (error) {
      this.logger.log(this.fileName, "checkIfTimeEntriesExist", error)
    }
  }
}
