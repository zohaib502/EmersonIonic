import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
//import { SQLite } from '@ionic-native/sqlite';
import { LoggerProvider } from '../../providers/logger/logger';
import 'rxjs/add/operator/toPromise';
//import { Cordova } from '@ionic-native/core';

declare var window: any;

@Injectable()
export class DatabaseProvider {
  db: any;
  versionDb: any;
  currentPlatform: any;
  fileName: any = 'Database';
  // Increase CURRENTDBVERSION if any new script is added. This should be equal to the latest script number added. (Ex: emerson_v1.txt)
  // 08/06/2018 - Mayur Varshney- changed db version from 2 to 3
  // 09/24/2018 - kamal - changed db version from 3 to 4
  // 10/30/2018 - Gurkirat Singh- changed db version from 4 to 5
  // 10/30/2018 - Mayur Varshney- changed db version from 5 to 6
  //private CURRENTDBVERSION: number = 10;
  public dbName = 'emerson.sqlite';
  public versionDBName = 'versionDB.sqlite';
  constructor(public http: Http, private platform: Platform, public logger: LoggerProvider) {

  }

  /**
  * 08/2/2018 Gurkirat Singh
  * Gets the database file name
  * @memberOf DatabaseProvider
  */
  getDbName() {
    return this.dbName;
  }

  getVersionDbName() {
    return this.versionDBName;
  }

  getVersionDB() {
    if (!this.versionDb) {
      if (this.platform.is('cordova')) {
        this.logger.log(this.fileName, 'getVersionDB', "Opening DB...");
        this.versionDb = window.sqlitePlugin.openDatabase({ name: this.versionDBName, location: 'default' });
      }
    }
    return this.versionDb;
  }

  /*
   * 01/07/2019 Zohaib Khan:
   * Execute all the queries from versionDB to emerson.sqlite if any. When application starts for the 1st time.
  */
  executeAllQueriesFromVersionDB() {
    let batchQuery: any[] = [];
    return new Promise((resolve, reject) => {
      this.getAllDataFromversionDB().then((allVersionDbData: any) => {
        if (allVersionDbData.length > 0) {

          for (var i = 0; i < allVersionDbData.length; i++) {
            if (allVersionDbData[i].sqLiteStatement && allVersionDbData[i].sqLiteStatement != '') {
              let query = allVersionDbData[i].sqLiteStatement.split(";");
              if (query.length > 0) {
                //  batchQuery.push('BEGIN TRANSACTION');
                for (var j = 0; j < query.length; j++) {
                  if (query[j] != "") {
                    batchQuery.push(query[j]);
                  }
                }
                // batchQuery.push('COMMIT TRANSACTION');
              }
            }
          }

          this.getDB().sqlBatch(batchQuery, (res) => {
            resolve(true);
          }, (error) => {
            this.logger.log(this.fileName, 'executeAllQueriesFromVersionDB', "Error In getDB.sqlBatch() : " + error.message);
            resolve(false);
          });
        } else {
          this.logger.log(this.fileName, 'executeAllQueriesFromVersionDB', "Version database is empty");
          resolve(true);
        }
      }).catch(err => {
        this.logger.log(this.fileName, 'executeAllQueriesFromVersionDB', 'Error In getAllDataFromversionDB--' + err);
        resolve(err);
      });
    });
  }

  /**
     * 01/07/2019 Zohaib Khan:
     * Compairing if versionDb max version is greater than emerson.sqlite version. If true than make batch of queries from max version data and execute those queries in emerson.sqlite.
     *
  */

  updateCurrentDatabase() {
    let batchQuery: any[] = [];
    return new Promise((resolve, reject) => {
      this.versionDb = window.sqlitePlugin.openDatabase({ name: this.versionDBName, location: 'default' });
      this.getAllDataFromversionDB().then((latestVersionData: any) => {
        this.getCurrentDBversion().then((currentVersion: any) => {
          // 01/07/2019 Zohaib Khan: If version database's version is greated than actual database version than execute sql statement from version database max version.
          if (latestVersionData.length > 0) {
            var max = Math.max.apply(Math, latestVersionData.map(function (o) { return o.current_version; }));
            if (max > currentVersion) {
              for (var i = currentVersion + 1; i <= max; i++) {
                var filtered = latestVersionData.filter((item) => {
                  return item.current_version == i;
                });
                if (filtered[0].sqLiteStatement && filtered[0].sqLiteStatement != '') {
                  let query = filtered[0].sqLiteStatement.split(";");
                  if (query.length > 0) {
                    for (var j = 0; j < query.length; j++) {
                      if (query[j] != "") {
                        batchQuery.push(query[j]);
                      }
                    }
                  }
                }
              }
              console.log(batchQuery);
              this.getVersionDB().close();
              this.getDB().sqlBatch(batchQuery, (res) => {
                resolve(true);
              }, (error) => {
                this.logger.log(this.fileName, 'updateCurrentDatabasesqlBatch', "Error In getDB().sqlBatch : " + error.message);
                resolve(false)
              });
            } else {
              this.logger.log(this.fileName, 'updateCurrentDatabase', 'VersionDB HAS SAME VERSION As emerson.sqlite');
              this.getVersionDB().close();
              resolve(true);
            }
          } else {
            this.logger.log(this.fileName, 'updateCurrentDatabase', 'VersionDB Is empty');
            this.getVersionDB().close();
            resolve(true);
          }
        }).catch(err => {
          this.logger.log(this.fileName, 'updateCurrentDatabase', 'Error in getCurrentDBversion()' + err);
          resolve(false);
        });
      }).catch(err => {
        this.logger.log(this.fileName, 'updateCurrentDatabase', 'Error In getAllDataFromversionDB()' + err.message);
        resolve(false);
      });
    });
  }

  /*
 *01/07/2019 Zohaib Khan:
 * Getting data of maximum version from VersionDB.
*/

  getLatestVersionDatafromVersionDB() {
    let versionData = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "SELECT * FROM version WHERE current_version=(SELECT MAX(current_version) FROM version)";
      this.getVersionDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              versionData.push(item);
            }
          }
          resolve(versionData);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getLatestVersionDatafromVersionDB', 'Error : ' + error.message);
          reject(error);
        }));
      });
    });
  }

  /*
   * 09/06/2018 Zohaib Khan:
   * Getting all data from VersionDB.
   */

  getAllDataFromversionDB() {
    let versionData = [];
    return new Promise((resolve, reject) => {
      let query = '';
      query = "SELECT * FROM version";
      this.getVersionDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length > 0) {
            for (let i = 0; i < rs.rows.length; i++) {
              let item = rs.rows.item(i);
              versionData.push(item);
            }
          }
          resolve(versionData);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getAllDataFromversionDB', 'Error : ' + error.message);
          reject(error);
        }));
      });
    });
  }

  getCurrentDBversion() {
    let versionData;
    return new Promise((resolve, reject) => {
      let query = '';
      query = "Select DATABASEVERSION from CURRENTDATABASEVERSION";
      this.getDB().transaction((tx) => {
        tx.executeSql(query, [], ((tx, rs) => {
          if (rs.rows.length != 0) {
            let item = rs.rows.item(0).DATABASEVERSION;
            versionData = item;
          }
          resolve(versionData);
        }), ((tx, error) => {
          this.logger.log(this.fileName, 'getCurrentDBversion', 'Error : ' + error.message);
          reject(error);
        }));
      });
    });
  }

  getDB() {
    if (!this.db) {
      this.logger.log(this.fileName, 'getDB', "Opening DB...");
      if (this.platform.is('cordova')) {
        this.db = window.sqlitePlugin.openDatabase({ name: this.dbName, location: 'default' });
      } else {
        this.db = window.openDatabase(this.dbName, '1', 'Emerson', 1024 * 1024 * 100);
      }
    }
    return this.db;
  }

  // initDB() {
  //   return new Promise((resolve, reject) => {
  //     this.logger.log(this.fileName, 'getDB', "Creating/Opening DB...");
  //     if (this.platform.is('cordova')) {
  //       this.sqlite.create({
  //         name: this.dbName,
  //         location: 'default'
  //       }).then((db: SQLiteObject) => {
  //         this.logger.log(this.fileName, 'initDB', "DB Successfully Create/Open");
  //         this.db = db;
  //         this.loadScript(this.http, db).then(() => {
  //           this.logger.log(this.fileName, 'initDB', "Script Loaded Successfully");
  //           resolve(true);
  //         });
  //       }).catch(e => {
  //         this.logger.log(this.fileName, 'initDB', "Error: " + JSON.stringify(e));
  //         reject(e);
  //       });
  //     } else {
  //       this.db = window.openDatabase(this.dbName, '1', 'Emerson', 1024 * 1024 * 100);
  //       this.logger.log(this.fileName, 'initDB', "DB Successfully Create/Open");
  //       //this.loadScript(this.http, this.db);
  //       resolve(true);
  //     }
  //   });
  // }

  // loadScript(http: Http, database) {
  //   return new Promise((resolve, reject) => {
  //     this.getDBScript(database).then((dbScript: any[]) => {
  //       if (dbScript.length > 0) {
  //         database.sqlBatch(dbScript).then(() => {
  //           this.logger.log(this.fileName, 'loadScript', 'Populated database OK');
  //           resolve(true);
  //         }).catch(e => {
  //           this.logger.log(this.fileName, 'loadScript', 'ERROR while executing sql batch: ' + e.message);
  //           reject(e);
  //         });
  //       } else {
  //         this.logger.log(this.fileName, 'loadScript', 'Script Already Loaded');
  //         resolve(true);
  //       }
  //     });
  //   });
  // }

  // getAppDbVersion(database) {
  //   return new Promise((resolve, reject) => {
  //     database.transaction((tx) => {
  //       let version = 0;
  //       let checkIfExistQuery = "SELECT name FROM sqlite_master WHERE type='table' AND name='CURRENTDATABASEVERSION'";
  //       tx.executeSql(checkIfExistQuery, [], ((tx, rs) => {
  //         if (rs.rows.length != 0) {
  //           let query = "Select DATABASEVERSION from CURRENTDATABASEVERSION";
  //           tx.executeSql(query, [], ((tx, rs) => {
  //             if (rs.rows.length != 0) {
  //               version = rs.rows.item(0).DATABASEVERSION;
  //             }
  //             resolve(version);
  //           }), ((tx, error) => {
  //             this.logger.log(this.fileName, 'getAppDbVersion', 'Error: ' + error.message);
  //             resolve(version);
  //           }));
  //         } else {
  //           resolve(version);
  //         }
  //       }), ((tx, error) => {
  //         this.logger.log(this.fileName, 'getAppDbVersion', 'Error: ' + error.message);
  //         reject(error);
  //       }));
  //     });
  //   });
  // }

  // getDBScript(database) {
  //   return new Promise((resolve, reject) => {
  //     this.getAppDbVersion(database).then((appDBversion: number) => {
  //       let promise = [];
  //       let dbScript = [];
  //       for (let i = appDBversion + 1; i <= this.CURRENTDBVERSION; i++) {
  //         promise.push(this.http.get('assets/data/emerson_v' + i + '.txt').map((res: any) => res.text()).toPromise());
  //       }
  //       if (promise.length > 0) {
  //         Promise.all(promise).then(allResult => {
  //           let dbScript = [];
  //           for (let k in allResult) {
  //             let scriptArr = allResult[k].split(';');
  //             for (let i = 0; i < scriptArr.length - 1; i++) {
  //               let query = scriptArr[i].replace(/(?:\r\n|\r|\n)/g, '');
  //               if (query != '') {
  //                 dbScript.push(query);
  //               }
  //             }
  //           }
  //           resolve(dbScript);
  //         }).catch(error => {
  //           this.logger.log(this.fileName, 'getDBScript', 'Error: ' + error.message);
  //           reject(error);
  //         });
  //       } else {
  //         resolve(dbScript);
  //       }
  //     });
  //   });
  // }

  public insertBatchDataOnUpdate(sqlBatchStmt: any[], functionName) {
    return new Promise((resolve, reject) => {
      this.db = window.sqlitePlugin.openDatabase({ name: this.dbName, location: 'default' });
      this.getDB().sqlBatch(sqlBatchStmt, (res) => {
        // this.logger.log(this.fileName, functionName, "Response :" + JSON.stringify(res));
        resolve(true);
      }, (error) => {
        this.logger.log(this.fileName, functionName, "Error : " + JSON.stringify(error.message));
        reject(error);
      });
    })
  }

  public printInvalidQuery(sqlBatchStmt) {
    try {
      let validQueries = sqlBatchStmt.filter(element => {
        let query = element[0].toLowerCase().split("values");
        let queryParams = element[1];
        let columnQuery = query[0];
        let columnCount, valueCount;
        if (query.length > 1) {
          columnCount = (columnQuery.match(/,/g) || []).length + 1;
          valueCount = query[1].match(/\?/g) || [];
          if (columnCount == valueCount == queryParams) return true;
          if (columnCount > valueCount) {
            this.logger.log(this.fileName, "printInvalidQuery", "Error: Column count is greater than no of '?'s for Query: " + element[0]);
          } else if (valueCount > columnCount) {
            this.logger.log(this.fileName, "printInvalidQuery", "Error: No of '?'s is greater than columns defined for Query: " + element[0]);
          }
        } else {
          columnCount = columnQuery.match(/\?/g) || [];
          if (columnCount == queryParams) return true;
        }
        if (columnCount > queryParams) {
          this.logger.log(this.fileName, "printInvalidQuery", "Error: Column count is greater than no of query parameters for Query: " + JSON.stringify(element));
        } else if (queryParams > columnCount) {
          this.logger.log(this.fileName, "printInvalidQuery", "Error: No of Query parameters are greater than columns defined for Query: " + JSON.stringify(element));
        }
        return false;
      });
      return validQueries;
    } catch (error) {
      this.logger.log(this.fileName, "printInvalidQuery", "Error: " + error.message);
      return [];
    }
  }

}
