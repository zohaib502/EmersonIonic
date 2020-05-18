import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FileUpdaterProvider } from "../../providers/file-updater/file-updater";
import { UtilityProvider } from "../../providers/utility/utility";

/**
 * Generated class for the UpdateExamplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-example',
  templateUrl: 'update-example.html',
})
export class UpdateExamplePage {
  header_data: any;
  localVersion: string = '1.0';
  public win: any

  constructor(public navCtrl: NavController, public navParams: NavParams, public fileUpdater: FileUpdaterProvider, public utilityProvider: UtilityProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateExamplePage');
    this.win = window;
  }


  isNewVersion = false;

  appConfig = {};

  checkUpdate() {
    this.fileUpdater.getAppConfig().subscribe(
      data => {

        console.log('APP-CONFIG : ', JSON.stringify(data))

        this.appConfig = data
        if (this.fileUpdater.localDBConfig.softVersion != data['softVersion']) {
          this.fileUpdater.newSoftVersion = data['softVersion'];
          this.isNewVersion = true;


        }
      },
      error => {
        console.log('APP-CONFIG  ERROR : ', JSON.stringify(error))

      })
  }


  isNewVersionDownloaded = false;
  downloadNewVersionFileTime;

  downloadNewVersionFile() {
    this.downloadNewVersionFileTime = new Date();
    let fPath = this.fileUpdater.newSoftVersion + '.zip'
    this.fileUpdater.downloadFileToDataDir(this.fileUpdater.appUpdateURL + fPath, fPath).then((entry) => {
      console.log('download complete: ' + entry.toURL(), this.fileUpdater.get_time_diff(this.downloadNewVersionFileTime));
      this.isNewVersionDownloaded = true;

    }, (error) => {
      // handle error
      console.log('ERROR download 123 : ' + error);
      console.log(JSON.stringify(error))
    });


  }


  setSoftVersion() {
    this.fileUpdater.setLocalDBItem('softVersion', this.fileUpdater.newSoftVersion);
    console.log('Softversion Set to : ' + this.fileUpdater.newSoftVersion);
  }


  xhr

  getSampleFile() {

    // let dirObj;

    this.win.resolveLocalFileSystemURL(this.fileUpdater.localDBConfig.localPath, function (dirEntry) {
      // dirObj = dirEntry;
      console.log('file system open: ' + dirEntry.name);


      this.xhr = new XMLHttpRequest();
      this.xhr.open('GET', 'http://cordova.apache.org/static/img/cordova_bot.png', true);
      this.xhr.responseType = 'blob';

      this.xhr.onload = function (event) {
        if (event.currentTarget.status == 200) {

          var blob = new Blob([event.currentTarget.response], { type: 'image/png' });

          console.log("Loaded Sample file.")

          this.saveFile(dirEntry, blob, "downloadedImage.png");
        }
      }.bind(this);
      this.xhr.send();

    }, e => {
      console.log("resolveLocalFileSystemURL ERROR ::", e)
    });


  }


  saveFile(dirEntry, fileData, fileName) {

    dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {

      this.writeFile(fileEntry, fileData);

    }, e => {
      console.log("saveFile ERROR ::", e)
    });
  }

  writeFile(fileEntry, dataObj, isAppend) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

      fileWriter.onwriteend = function () {
        console.log("Successful file write...");
      };

      fileWriter.onerror = function (e) {
        console.log("Failed file write: " + e.toString());
      };

      fileWriter.write(dataObj);
    });
  }


  // Convert file to base64 string
  fileToBase64(filename, filepath) {
    return new Promise(resolve => {
      var file = new File([filename], filepath);
      var reader = new FileReader();
      // Read file content on file loaded event
      reader.onload = function (event) {
        resolve(event.target["result"]);
      };

      // Convert data to base64
      reader.readAsDataURL(file);
    });
  };


  toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }


  b64FileUrl = "http://funuf.com/EmersonAppUpdate/test1.zip"
  b64ContentType = "application/zip"

  getBase64() {

    this.toDataUrl(this.b64FileUrl, function (myBase64) {
      var filename = this.b64FileUrl.replace(/^.*[\\\/]/, '');
      let base64 = myBase64.split("base64,")[1];
      this.utilityProvider.saveBase64File(this.fileUpdater.localDBConfig.localPath, filename, base64, this.b64ContentType).then((res) => {

        console.log("File Saved Successfully !!", res);
      }).catch((err) => {
        console.log("Error Saving file !!", err);
      });
    }.bind(this));


    /*
   this.fileToBase64("cordova_bot.png", "http://cordova.apache.org/static/img/cordova_bot.png").then(result => {
     console.log(result);
   });*/
  }

  getBase64ZipBlobtest() {

    this.getBase64ZipBlob(this.b64FileUrl, function (myBase64) {
      var filename = this.b64FileUrl.replace(/^.*[\\\/]/, '');
      let updatedFileName = this.utilityProvider.generateFileNameAndType(filename).Name + ".zip";
      // let base64 = myBase64.split("base64,")[1];
      console.log("Saving Base64 File to zip");
      this.utilityProvider.saveBase64File(this.fileUpdater.localDBConfig.localPath, updatedFileName, myBase64, this.b64ContentType).then((res) => {

        console.log("File Saved Successfully !!", res);
      }).catch((err) => {
        console.log("Error Saving file !!", err);
      });
    }.bind(this));


    /*
   this.fileToBase64("cordova_bot.png", "http://cordova.apache.org/static/img/cordova_bot.png").then(result => {
     console.log(result);
   });*/
  }

  getBase64ZipBlob(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      console.log("Got XHR response:");
      callback(xhr.response);

    };
    xhr.open('GET', url);
    xhr.responseType = 'text';
    xhr.send();
  }



}
