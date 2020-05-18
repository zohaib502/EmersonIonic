import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoggerProvider } from '../../../providers/logger/logger';
import { UtilityProvider } from '../../../providers/utility/utility';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-invalid-key-modal',
  templateUrl: 'invalid-key-modal.html',
})
export class InvalidKeyModalPage {

  invalidKeyJsonArr: any[] = [];
  activeLanguage: any;
  fileName: any = "Invalid_Key_Modal";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public logger: LoggerProvider, public utilityProvider: UtilityProvider) {
  }


  /**
   * 08/07/2018, Mayur Varshney -- getting data from navparams before loading modal
   * @memberof InvalidKeyModalPage
   */
  ionViewDidLoad() {
    this.invalidKeyJsonArr = this.navParams.get("InvalidKeysArr");
    this.activeLanguage = this.navParams.get("ActiveLanguage");
  }

  /**
   * 08/07/2018, Mayur Varshney -- closeModal on click of cross button
   * @memberof InvalidKeyModalPage
   */
  public closeModal() {
    this.viewCtrl.dismiss();
  }

  /**
   * 08/07/2018, Mayur Varshney
   * export csv
   * reusing createCSV, saveLanguageFile and openFile function from utilityProvider from creating, generating and opening the CSV file.
   * @memberof InvalidKeyModalPage
   */
  exportInvalidKeyFile() {
    let filePath = cordova.file.dataDirectory;
    this.utilityProvider.createCSV(this.invalidKeyJsonArr).then((blob: any) => {
      if (blob) {
        this.utilityProvider.saveLanguageFile(blob, this.activeLanguage.Code + '-invalidKeyFile' + '.csv').then(() => {
          this.logger.log(this.fileName, 'exportInvalidKeyFile', 'this.filePath: ' + filePath + '/lang/' + this.activeLanguage.Code + '-invalidKeyFile' + '.csv');
          this.utilityProvider.openFile(filePath + '/lang/' + this.activeLanguage.Code + '-invalidKeyFile' + '.csv', 'text/csv', null);
          this.utilityProvider.stopSpinner();
        }).catch((error: any) => {
          this.utilityProvider.stopSpinner();
          this.logger.log(this.fileName, 'exportInvalidKeyFile', 'Error in saveLanguageFile : ' + JSON.stringify(error));
        });
      } else {
        this.logger.log(this.fileName, 'exportInvalidKeyFile', 'Error in creating blob ');
      }
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'exportInvalidKeyFile', 'Error in createCSV : ' + JSON.stringify(error));
    });
  }
}
