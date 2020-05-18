import { Injectable } from '@angular/core';
// import { Headers, Http, Response } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { LoggerProvider } from '../providers/logger/logger';

declare var cordova;
declare var window;

@Injectable()
export class CustomTranslateLoader implements TranslateLoader  {
    logger: LoggerProvider;
    public http;
    prefix: string;
    suffix: string;
    constructor(http: HttpClient){
        this.http = http;
        console.log("TTT   CustomTranslateLoader Loaded")
    };
    /**
     * Gets the translations from the server
     * @param lang
     * @returns {any}
     */
    getTranslation(lang: string): Observable<any> {
        let filePath = cordova.file.dataDirectory;
        return Observable.create(observer => {
          window.resolveLocalFileSystemURL(filePath + 'lang/' + lang + ".json",  (fileEntry) => {

            console.log("resolveLocalFileSystemURL")
            fileEntry.file(function(file) {
                let reader = new FileReader();
        
                reader.onloadend = function(e) {
                        let firstIndex = this.result.indexOf('{');
                        let lastIndex = this.result.length;
                        let obj = JSON.parse(this.result.substring(firstIndex, lastIndex));
                        observer.next(obj);
                        observer.complete();  
                }
        
                reader.readAsText(file);
            });
        
        }, (e) => {
            console.log("Translation : ",e);
                observer.next({});
                observer.complete();  
        });
            // this.file.readAsText(filePath + 'lang/', lang + ".json").then((json: any) => {
            //     let firstIndex = json.indexOf('{');
            //     let lastIndex = json.length;
            //     let obj = JSON.parse(json.substring(firstIndex, lastIndex));
            //     observer.next(obj);
            //     observer.complete();               
            // }).catch(err => {
            //     observer.next({});
            //     observer.complete();               
            // });
            // this.http.get("./assets/i18n/" + lang + ".json").subscribe((res: Response) => {
            //     observer.next(res.json());
            //     observer.complete();               
            // },  error => {
            //     //  failed to retrieve from api, switch to local
            //     this.http.get("./assets/i18n/en-gb.json").subscribe((res: Response) => {
            //         observer.next(res.json());
            //         observer.complete();               
            //     })
            // });
        }); 
    }
}
