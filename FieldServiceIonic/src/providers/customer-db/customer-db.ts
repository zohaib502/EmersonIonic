import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { LoggerProvider } from '../../providers/logger/logger';
import 'rxjs/add/operator/toPromise';
import { File } from '@ionic-native/file';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy';
import {FileUpdaterProvider} from "../file-updater/file-updater";
declare var window: any;
declare var cordova: any;
/*
  Generated class for the CustomerDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CustomerDbProvider {
  db: any;
  fileName: any = 'CustomerDB';
  // Increase CURRENTDBVERSION if any new script is added. This should be equal to the latest script number added. (Ex: emerson_v1.txt)
 // private CURRENTDBVERSION: number = 1;
  public dbName = 'emerson_customers.sqlite';

  constructor(public http: Http, public fileUpdater: FileUpdaterProvider, private platform: Platform, private sqlite: SQLite, public logger: LoggerProvider, public file: File, public sqLiteCopyDb: SqliteDbCopy) {
    console.log('Hello CustomerDbProvider Provider');
  }

  getDbName() {
    return this.dbName;
  }


  /**
   *12-31-2018 Radheshyam kumar, 
   *This method initialize the db.
   * @returns
   * @memberof CustomerDbProvider
   */
  getDB() {
    if(!this.db) {
      this.logger.log(this.fileName, 'getDB', "Opening Customer DB...");
      if (this.platform.is('cordova')) {
        this.db = window.sqlitePlugin.openDatabase({ name: this.dbName, location: 'default' });
      } else {
        this.db = window.openDatabase(this.dbName, '1', 'Emerson', 1024 * 1024 * 100);
      }
    }
    return this.db;
  }



  /**
   *12-31-2018 Radheshyam kumar
   * this method copy the "emerson_customers.sqlite" form the www folder to the app default db location.
   * @memberof CustomerDbProvider
   */
  initCustomerDB() {
    if (this.platform.is('ios')) {
      //TODO:Check if database exist or not.
      //this.sqLiteCopyDb.copyDbToStorage("emerson_customers.sqlite", 0,"emerson_customers.sqlite", false).then(res => {
      this.sqLiteCopyDb.copy("emerson_customers.sqlite", 0).then(res => {
          this.initializeCustomerDb();
      }).catch(err => {
        this.initializeCustomerDb();
        this.logger.log(this.fileName, 'getDB err', "Coppied emerson customers db from assets to dataDirecory ...");
      });
    } else {
    //12-31-2018 Radheshyam kumar added code to set the db on device default db location
      this.file.copyFile(cordova.file.applicationDirectory + "/www/", this.dbName, cordova.file.dataDirectory, "").then(() => {
        this.logger.log(this.fileName, 'getDB', "Coppied emerson customers db from assets to dataDirecory ...");
          this.initializeCustomerDb();
      }, (err) => {
        this.initializeCustomerDb();
        this.logger.log(this.fileName, 'getDB err', "Coppied emerson customers db from assets to dataDirecory ...");
      })
    }
  }

  initializeCustomerDb(){
    this.sqlite.create({
      name: this.dbName,
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.logger.log(this.fileName, 'init customers DB', "DB Successfully Create/Open");
      console.log("db initialize customer db");
      this.db = db;
    }).catch(e => {
      console.log("db initialize customer db"+JSON.stringify(e));
      this.logger.log(this.fileName, 'init customers DB', "Error: " + JSON.stringify(e));
    });
  }

}
