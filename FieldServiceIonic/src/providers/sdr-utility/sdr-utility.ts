import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Enums from '../../enums/enums';
import { UtilityProvider } from '../utility/utility';
import { ValueProvider } from '../value/value';
import { LocalServiceSdrProvider } from '../local-service-sdr/local-service-sdr';
import { SyncProvider } from '../sync/sync';
import { TranslateService } from '@ngx-translate/core';
import { LoggerProvider } from '../logger/logger';
import { SubmitProvider } from '../sync/submit/submit';

/*
  Generated class for the SdrUtilityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SdrUtilityProvider {

  fileName: any = "SdrUtilityProvider";
  constructor(public http: HttpClient, public utilityProvider: UtilityProvider, public valueProvider: ValueProvider, public localServicesdr: LocalServiceSdrProvider, public syncProvider : SyncProvider, private submitProvider: SubmitProvider, public translate: TranslateService, public logger: LoggerProvider) {
    console.log('Hello SdrUtilityProvider Provider');
  }

  submitReportActivity(appCtrl, reviewsubmitpage){
    this.utilityProvider.stopSpinner();
    this.utilityProvider.presentToastButtom(this.translate.instant(Enums.Messages.ReportSubmittedSuccess), '4000', 'top', '', 'OK');
    appCtrl.getRootNav().setRoot(reviewsubmitpage);
  }

  submitReport(currentReport, navCtrl, appCtrl, reviewsubmitpage) {
    this.utilityProvider.showSpinner();
    let isValidated = true;
    let taskObj: any = {};
    this.localServicesdr.getTaskObj(currentReport.REPORTID).then((res: any) => {
      taskObj = res.length ? res[0] : {};
      if (taskObj.Selected_Process == Enums.Selected_Process.FCR_AND_SDR) {
        if (taskObj.StatusID != Enums.Jobstatus.Completed_Awaiting_Review) {
          isValidated = false;
        }
      }
      if (isValidated) {
        // 01/10/2019 Gurkirat Singh: Update report as completed in local
        currentReport.REPORTSTATUS = Enums.ReportStatus.Completed;
        navCtrl.parent.viewCtrl.instance.reportData = currentReport;
        this.valueProvider.getCurrentReport().REPORTSTATUS = Enums.ReportStatus.Completed;
        this.localServicesdr.updateReport(currentReport.REPORTID, Enums.ReportStatus.Completed).then(() => {
          if (this.utilityProvider.isConnected()) {
            if(this.syncProvider.isAutoSyncing){
              this.submitReportActivity(appCtrl,reviewsubmitpage)
              this.submitProvider.savePendingSDRReports();
              sessionStorage.setItem("getPendingOperations",'true');
              return true;
            }
            //this.syncProvider.submitPendingReports(false, currentReport.REPORTID).then((res) => {
            this.submitProvider.submitPendingSDRReports(false, currentReport.REPORTID).then((res) => {
              if (res) {
                this.utilityProvider.stopSpinner();
                this.utilityProvider.presentToastButtom(this.translate.instant(Enums.Messages.ReportSubmittedSuccess), '4000', 'top', '', 'OK');
              } else {
                this.utilityProvider.stopSpinner();
                this.utilityProvider.presentToastButtom(this.translate.instant(Enums.Messages.ReportSubmittedFailure), '4000', 'top', '', 'OK');
              }
              appCtrl.getRootNav().setRoot(reviewsubmitpage);
            });
          } else {
            this.utilityProvider.stopSpinner();
            this.utilityProvider.presentToastButtom(this.translate.instant(Enums.Messages.ReportSubmittedSuccess), '4000', 'top', '', 'OK');
            appCtrl.getRootNav().setRoot(reviewsubmitpage);
          }
        }).catch((error) => {
          this.logger.log(this.fileName, "submitReport", "Error Occured while Updating Status: " + JSON.stringify(error));
          this.utilityProvider.stopSpinner();
          this.utilityProvider.presentToast(Enums.Messages.Status_Update_Failed, 4000, 'top', 'feedbackToast');
        });
      } else {
        this.utilityProvider.stopSpinner();
        let alert = this.utilityProvider.promptAlert("Alert", this.translate.instant("Please Submit Field Completion Report. Before Submitting Service Detail Report"))
        alert.present();
      }
    })
  }
}
