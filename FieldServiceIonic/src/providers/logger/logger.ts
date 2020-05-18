import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from "moment";

import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
declare var cordova: any;
/*
  Generated class for the LoggerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoggerProvider {
    fileName = "loggerProvider"
    hasCordova: any = false;
    prefix = "log_";
    suffix = ".log";
    constructor(public file: File, public http: HttpClient, private platform: Platform) {
        if (this.platform.is('cordova')) {
            this.hasCordova = true;
        }
    }

    log(className, methodName, message) {
        let msg = moment().format("MM-DD-YYYY hh:mm:ss.SSSZ a") + ': ' + className.toUpperCase() + ' : ' + methodName + ' - ' + message + "\n";
        var currentDate = this.prefix + moment(new Date()).format("MM-DD-YYYY") + this.suffix;
        if (this.hasCordova) {

            //  07/31/2018 Zohaib Khan: Renamed the logger file with log_current date such as log_07-31-2018.log inside the Logs directory

            this.file.writeFile(this.file.dataDirectory, "logs/" + currentDate, msg, { replace: false, append: true })
                .catch((err) => {
                    //console.log("Error while logging (First try...)", err);
                    this.file.writeFile(this.file.dataDirectory, "logs/" + currentDate, msg, { replace: false })
                        .catch((err) => {
                            //console.log("Writer is Busy...");
                            setTimeout(() => { this.log(className, methodName, message); }, 100);
                        });
                });
        } else {
            console.log(msg);
        }

        //  07/31/2018 Zohaib Khan:Moment is called to format the current date to MM-DD-YYYY to name the logger file as perticular date

    }

    /**
     * 07/31/2018 Zohaib Khan 
     * Check if Has Cordova then cleans up all the previous log files before 15 days
     * @param {*} logDir
     * @memberof LoggerProvider
     */
    cleanUpPreviousLogs(logDir) {
        // var currentDate = this.prefix + moment(new Date()).format("MM-DD-YYYY") + this.suffix;
        if (this.hasCordova) {
            this.file.listDir(cordova.file.dataDirectory, logDir).then(res => {
                if (res.length > 15) {
                    //  07/31/2018 Zohaib Khan: Filtering the list of files before 15 days to be deleted from logs directory
                    var filteredLogList = res.filter((item) => {
                        return this.getLast15DaysLogFileNames().indexOf(item.name) == -1;
                    });
                    //  07/31/2018 Zohaib Khan: Removing the filtered files from logs directory except last 15 days files
                    for (var i = 0; i < filteredLogList.length; i++) {
                        this.log(this.fileName, "ListDirNames", String(filteredLogList[i].name));
                        this.file.removeFile(cordova.file.dataDirectory + "/logs", String(filteredLogList[i].name)).catch(err => {
                            console.log(err);
                        });
                    }
                }
            });
        }
    }
    /**
     * 08/05/2018 Zohaib Khan
     * getting dates of last 15 days from current date and converting them to log file names
     */
    getLast15DaysLogFileNames() {
        var result = [];
        for (var i = 0; i < 15; i++) {
            var d = new Date();
            d.setDate(d.getDate() - i);
            result.push(this.prefix + moment(d).format("MM-DD-YYYY") + this.suffix)
        }

        return result;
    }

}
