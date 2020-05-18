import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { DirectoryEntry, File } from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { Platform } from "ionic-angular";
import { normalizeURL } from "ionic-angular";
import { LoggerProvider } from '../logger/logger';

declare var window: any;



/*
  Generated class for the FileUpdaterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  and Angular DI.
*/
@Injectable()
export class FileUpdaterProvider {

    appConfigURL:any = "";
    appUpdateURL:any = "";

    fileName: any = 'FileUpdater';
    newSoftVersion = '';
    versionConfig = {};

    localDBName: any = 'localDB.sqlite';
    localDB:any;

    onLocalDBConfigUpdated = new EventEmitter();

    localDBConfig = {
      bucket_url: null,
      config_url: null,
      files: null,
      hardVersion: null,
      softVersion: null,
      localPath: null,
      assetPath: null,
      phVar1: null,
      phVar2: null,
      phVar3: null,
      old_softVersion: null
    }



  constructor(public http: HttpClient, private file: File, private transfer: FileTransfer, public platform: Platform, public logger: LoggerProvider) {
        console.log('Hello FileUpdaterProvider Provider');

        platform.ready().then(() => {


            this.setLocalDBItem('localPath', normalizeURL(this.file.dataDirectory));

          // removing initial loader
            document.getElementById('initial-loader').style.display = 'none';

            this.getAllDataFromLocalDB().then((localDBData: any) => {
              this.localDBConfig = localDBData;
              console.log("IONIC got Localdb Data :: ", this.localDBConfig);

              this.onLocalDBConfigUpdated.emit(this.localDBConfig);
              this.deleteOldSoftVersionDir()

            }).catch(err => {
              console.log("Error geting localDB dare :: ", err);
            });
        });

        this.onLocalDBConfigUpdated.subscribe( res=>{
          this.appConfigURL = this.localDBConfig.config_url+"?no-cache=";
          this.appUpdateURL = this.localDBConfig.bucket_url;
        })
    }


  getLocalDB() {
    if (!this.localDB) {
      if (this.platform.is('cordova')) {
        this.logger.log(this.localDBName, 'getLocalDB', "Opening DB...");
        this.localDB = window.sqlitePlugin.openDatabase({ name: this.localDBName, location: 'default' });
      }
      return this.localDB;
    }else{
      return this.localDB;
    }
  }



  getAllDataFromLocalDB() {
    let localDBData = {};
    return new Promise((resolve, reject) => {
      let query = '';
      query = "SELECT * FROM localStore";
      this.getLocalDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);

              localDBData[item.key] = item.value;
            }
          }
          resolve(localDBData);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getAllDataFromLocalDB', 'Error : ' + error.message);
          reject(error);
        }));
      });
    });
  }




  setLocalDBItem(key,value){

    var q = "UPDATE localStore SET value = '"+value+"' WHERE key = '"+key+"'";

    this.getLocalDB().executeSql(q, [], function(rs) {
      console.log('localDB item Set ');
    }, function(error) {
      console.log('LOCALDB SQL statement SET ERROR: ' , error.message);
    });
  }

  createDataDir(name, path = '', replace = true) {
        return this.file.createDir(this.file.dataDirectory + path, name, replace)
    }

    checkDataDir(name, path = '') {
        return this.file.checkDir(this.file.dataDirectory + path, name)
    }

    fileTransfer: FileTransferObject;

    downloadFileToDataDir(url, target) {
        console.log('///////   in Download 123',url);
        this.fileTransfer = this.transfer.create();
        this.fileTransfer.onProgress = function (progressEvent) {
            console.log("loaded: ", progressEvent)
        }
        console.log("Download File: URL: "+url+" Target:: "+this.file.dataDirectory + target)
        return this.fileTransfer.download(url, this.file.dataDirectory + target)

    }





    public async createRecursivePath(relDirPath: string, params: any = {}): Promise<any> {
        // console.log(`making sure rel Path: ${relDirPath}`);
        const absolutePath = this.file.dataDirectory + relDirPath;
        // console.log(`making sure abs Path: ${absolutePath}`);
        const pathParts = relDirPath.split('/');

        const dataParams = params

        const doesWholePathExist: boolean = await this.doesExist(absolutePath);
        if (doesWholePathExist) {
            console.log('Path Exist');
            return { result: true, data: dataParams };
        }
        let currentPath = this.file.dataDirectory;
        while (pathParts.length > 0) {
            const currentDir = pathParts.shift();
            const doesExist: boolean = await this.doesExist(currentPath + currentDir);
            if (!doesExist) {
                console.log(`creating: currentPath: ${currentPath} currentDir: ${currentDir}`);
                const dirEntry: DirectoryEntry = await this.file.createDir(currentPath, currentDir, false);
                if (!dirEntry) {
                    console.error('not created!');
                    return { result: false, data: dataParams };
                }
            }
            currentPath = currentPath + currentDir + '/';
        }
        return { result: true, data: dataParams };
    }

    doesExist(path) {
        let dirDest = path.substring(0, path.lastIndexOf('/'));
        let dirName = path.match(/([^\/]*)\/*$/)[1];

        console.log('dirDest: ' + dirDest);
        console.log('dirName: ' + dirName);


        return this.file.checkDir(dirDest + '/', dirName).then(_ => {
            return true
        })
            .catch(err => {
                console.log('Dir Not Found ', JSON.stringify(err))
                return false
            })

    }




    getBaseAppDir(dir): Promise<any> {

        return this.checkDataDir(dir).then(_ => {
            console.log('Directory exists : ', _)
            return Promise.resolve(dir);
        }).catch(err => {
            console.log('Directory doesn\'t exist')

            return this.createDataDir(dir).then(_ => {
                console.log('Directory Created')
                return Promise.resolve(dir);
            }).catch(err => {
                return Promise.reject(JSON.stringify(err));
            })

        });

    }



    getAppConfig() {
        return this.http.get(this.appConfigURL + new Date());
    }


    getFileList(appVersion) {
        return this.http.get(this.appUpdateURL + appVersion + '/files.json?no-cache=' + new Date());
    }


    deleteOldSoftVersionDir(){

      if(this.localDBConfig.old_softVersion && this.localDBConfig.old_softVersion != 'null' && this.localDBConfig.old_softVersion != ''){
        console.log('Old Version found');
        this.file.removeRecursively(this.file.dataDirectory, this.localDBConfig.old_softVersion).then(_ => {
          console.log('XXXXXX Old Version removed');

          this.setLocalDBItem('old_softVersion', null);
        })
          .catch(err => {
            console.log('XXXXXX UNABLE TO REMOVE Old Version');
            this.setLocalDBItem('old_softVersion', null);
          })
      }else{
        console.log('Old Version not available');
      }

    }

  /**
   *
   *
   */

  onSoftupdateZipDeleted = new EventEmitter();
  deleteSoftupdateZip(){
    this.file.removeFile(this.file.dataDirectory, this.newSoftVersion + '.zip').then(_ => {
      this.onSoftupdateZipDeleted.emit(true);
    })
    .catch(err => {
      console.log('Unable to delete file ', JSON.stringify(err))
      this.onSoftupdateZipDeleted.emit(false);
    })
  }


  /**
     *
     * @param zipSource Path to the zip file
     * @param destination Path where the content should be placed
     */


    loaded = 0;
    total = 0;
    isComplete = false

    softUpdateExtrationTime;
    onZipExtractionComplete = new EventEmitter();

    extractSoftupdateZip( isManual:any = false) {
        return new Promise((resolve, reject) => {
            console.log("Extraction Started... ");
            this.softUpdateExtrationTime = new Date();
            var zipSource = this.file.dataDirectory + '/' + this.newSoftVersion + '.zip';
            var destination = this.file.dataDirectory;
            this.isComplete = false

            // Handle the progress event

            // Proceed to unzip the file
            window['zip'].unzip(zipSource, destination, (status) => {
                if (status == 0) {
                    this.isComplete = true;
                    console.log("Files succesfully decompressed CB", this.get_time_diff(this.softUpdateExtrationTime));
                    if(!isManual){
                      this.onZipExtractionComplete.emit(true);
                    }
                }
                if (status == -1) {
                    console.error("Oops, cannot decompress files CB");
                    this.onZipExtractionComplete.emit(false);
                }
            }, this.progressHandler);
            resolve(true);
        }).catch((err) => {
            this.logger.log(this.fileName, 'extractSoftupdateZip', "Error in promise : " + JSON.stringify(err));
            return Promise.reject(err);
        })
    }

    progressHandler = (function (progressEvent) {

        this.loaded = progressEvent.loaded;
        this.total = progressEvent.total;
        // var percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        // Display progress in the console : 8% ...
        // console.log(percent + "%");
    }).bind(this);



    someFunction() {
        console.log("Some Function Called")
    }


    //// Utility Mehods

    get_time_diff(datetime) {
        var diff = new Date().getTime() - datetime.getTime();

        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        var ss = Math.floor(msec / 1000);
        msec -= ss * 1000;

        return hh + ":" + mm + ":" + ss;
    }



}
