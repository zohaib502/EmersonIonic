import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
import { LoggerProvider } from '../../providers/logger/logger';
import { ValueProvider } from '../../providers/value/value';
import { CloudService } from '../../providers/cloud-service/cloud-service';
import { LocalServiceProvider } from '../../providers/local-service/local-service';
import { UtilityProvider } from '../../providers/utility/utility';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import * as Enums from '../../enums/enums'
import { Chart } from 'chart.js';
import * as moment from "moment";
import { TranslateService } from '@ngx-translate/core';

/**
 * ReportPage provide Analytical Report in the form of different Chart(Bar Chart) between Start Date and End Date getting from MCS.
 * This includes Getting data from MCS saving it locally to the Mobile App,
 * Post API call is hit from Cloud service for getting JSON array of Online and Offline Event accordingly,
 * Show data on the basis of groupBy item i.e Date, Country or UserId
 * Can filter the data by using multiple filters eg. Country, OSName etc.
 * Display error message via toast if error occurs during getting the data.
 * Reduce date window to 3 days from 15 days
 * @export
 * @class Report
 * @author Mayur Varshney 
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage implements OnInit {
  header_data: any;
  fileName: any = 'ReportPage';
  labels: any[] = [];
  countryName: any[] = [];
  OSName: any[] = [];
  users: any[] = [];
  groupByArr: any[] = [];
  analyticReportJSON: any;
  operatingSys: any;
  country: any;
  userID: any;
  start_date: any;
  end_date: any;
  barChart: Chart;
  minDate: any;
  maxDate: any;
  groupBy: any;
  showSelects: boolean = true;
  labelItem: any[] = [];
  labelValue: any[] = [];
  translate: any;
  dateWindow: any;
  showLoadMoreBtn: boolean = false;
  onlineOffset: any;
  offlineOffset: any;
  enums: any;
  from_date: any;
  to_date: any;
  loadUsageReport: boolean = true;
  loadOptimizationReport: boolean = false;
  timeOut: any;
  worldarea: any = [];
  countries: any = [];
  businessunits: any = [];
  optimizationReportPayload: any = {};
  @ViewChild('dp') dp1: BsDatepickerDirective;
  @ViewChild('dps') dp2: BsDatepickerDirective;
  @ViewChild('dpf') dp3: BsDatepickerDirective;
  @ViewChild('dpt') dp4: BsDatepickerDirective;
  @ViewChild('barCanvas') barCanvas;
  @ViewChild(Content) content: Content;

  constructor(public translateService: TranslateService, public navCtrl: NavController, public navParams: NavParams, public events: Events, public valueProvider: ValueProvider, public cloudProvider: CloudService, public logger: LoggerProvider, public utilityProvider: UtilityProvider, public localService: LocalServiceProvider, public bsDatepickerConfig: BsDatepickerConfig) {
    this.enums = Enums;
    this.header_data = { title1: "", title2: "Field Service Admin", taskId: "" };

  }

  /**
  * Initialise date type variable on didEnter
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  ngOnInit() {
    let currentDate = new Date();
    this.start_date = currentDate;
    this.optimizationReportPayload.From_Date = currentDate;
    this.end_date = currentDate;
    this.optimizationReportPayload.To_Date = currentDate;
    this.minDate = new Date('2018-01-01');
    this.maxDate = currentDate;
  }

  /**
  * Set start date and end date, call function to get report data
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  ionViewDidEnter() {
    this.loadData();
  }

  private async loadData() {
    //Prateek(23/01/2019) Shifted all events in didenter. 
    this.events.subscribe('langSelected', (res) => {
      // 10/08/2018 -- Mayur Varshney -- apply filter to show selected language
      this.applyFilters();
      setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
    this.groupByArr = ['Country', 'Date', 'Users'];
    this.groupBy = 'Date';
    this.ngOnInit();
    this.events.publish('setPage', "Report");
    // 09-21-2018 MY: Start date will be 3 days before today initially
    // 04/01/2019 -- Mayur Varshney -- get report days from MCS
    this.utilityProvider.showSpinner();
    this.cloudProvider.getAnalyticsReportDays().then((res: any) => {
      this.dateWindow = parseInt(res.days) - 1;
      let updatedStartDate = moment(this.end_date).subtract(this.dateWindow, 'day').format('YYYY-MM-DD');
      this.start_date = new Date(updatedStartDate);
      this.end_date = new Date();
      this.getAnalyticReport(false);
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'getAnalyticReport', 'Error in getAnalyticsReportDays:' + JSON.stringify(err))
    });
  }

  /**
  * Will load all the data for the selected Report
  * @export
  * @class Report
  * @author Zohaib Khan
  */
  private async generateReport(value) {
    if (value == 'usageReport') {
      this.cleanOptimizationReportData()
      this.loadUsageReport = true;
      this.loadOptimizationReport = false;
      this.loadData();
    }
    if (value == 'optimizationReport') {
      this.loadUsageReport = false;
      this.loadOptimizationReport = true;
      this.getOptimizationReportData();
    }
  }

  private cleanOptimizationReportData() {
    this.worldarea = [];
    this.countries = [];
    this.businessunits = [];
    this.optimizationReportPayload = {};
  }

  /**
 * Will load all the data for the optimization Report
 * @export
 * @class Report
 * @author Zohaib Khan
 */
  private async getOptimizationReportData() {
    let currentDate = new Date();
    let result: boolean = false;
    try {
      this.utilityProvider.showSpinner();
      this.worldarea = await this.localService.getWorldArea();
      this.countries = await this.localService.getCountry();
      this.businessunits = await this.localService.getBusinessUnits();
      this.optimizationReportPayload.From_Date = currentDate;
      this.optimizationReportPayload.To_Date = currentDate;
      this.utilityProvider.stopSpinner();
      result = true;
    } catch (err) {
      result = false;
      this.logger.log(this.fileName, 'getWorldArea', 'Error in getWorldArea:' + JSON.stringify(err))
    } finally {
      return result
    }
  }

  /**
 * Will Export the filterd data in csv -- TODO
 * @export
 * @class Report
 * @author Zohaib Khan
 */
  private exportOptimizationReport(reportData) {
    console.log(reportData);
  }

  /**
  * check start date if start date is smaller or larger than end date, set date accordingly
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  checkDateWindow(startDate, forOptimization?) {
    if (forOptimization) {
      if (moment(this.optimizationReportPayload.From_Date).isAfter(this.optimizationReportPayload.To_Date)) {
        this.optimizationReportPayload.To_Date = this.optimizationReportPayload.From_Date;
      }
    } else {
      // 09-21-2018 MY: Add comments where there is a complex logic
      let endDiffStartDate = moment(this.end_date).diff(moment(this.start_date), 'days');
      let currentDiffStartDate = moment(this.maxDate).diff(moment(this.start_date), 'days');
      let endDiffMinDate = moment(this.end_date).diff(moment(this.minDate), 'days');
      if (startDate) {
        if (moment(currentDiffStartDate).isSameOrBefore(this.dateWindow)) {
          this.end_date = new Date();
        } else if ((moment(endDiffStartDate).isAfter(this.dateWindow)) || (moment(endDiffStartDate).isBefore(0))) {
          let updatedEndDate = moment(this.start_date).add(this.dateWindow, 'day').format('YYYY-MM-DD');
          this.end_date = new Date(updatedEndDate);
        }
      } else {
        if (moment(endDiffMinDate).isSameOrBefore(this.dateWindow)) {
          this.start_date = new Date('2018-01-01');
          //10-18-18 Radheshyam kumar added check so that on change of end of date start date also change
        } else if ((moment(endDiffStartDate).isAfter(this.dateWindow)) || (moment(endDiffStartDate).isBefore(0)) || (new Date(this.start_date).getDate() > new Date(this.end_date).getDate())) {
          let updatedStartDate = moment(this.end_date).subtract(this.dateWindow, 'day').format('YYYY-MM-DD');
          this.start_date = new Date(updatedStartDate);
        }
      }
    }

  }



  /**
  * destroy chart to remove duplicacy, call initialiseBarChart without applying filter i.e passing params 'False'
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  getAnalyticReport(loadMore) {
    this.showLoadMoreBtn = false;
    if (!loadMore) {
      this.offlineOffset = null;
      this.onlineOffset = null;
      this.analyticReportJSON = null;
    }
    this.utilityProvider.showSpinner();
    if (this.barChart) {
      this.barChart.destroy();
    }
    // 10/08/2018 -- Mayur Varshney -- get selected language translation after 1 sec
    this.translate = '';
    setTimeout(() => {
      this.translateService.getTranslation(this.valueProvider.getSelectedLang()).toPromise().then(translate => {
        this.translate = translate;
        this.initializeBarChart(false);
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'getAnalyticReport', 'Error in getTranslation:' + JSON.stringify(err))
      });
    }, 1000);
  }

  /**
  * destroy chart to remove duplicacy, call initialiseBarChart with applying filter i.e passing params 'true'
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  applyFilters() {
    this.utilityProvider.showSpinner();
    if (this.barChart) {
      this.barChart.destroy();
    }
    // 10/08/2018 -- Mayur Varshney -- get selected language translation after 1 sec
    this.translate = '';
    setTimeout(() => {
      this.translateService.getTranslation(this.valueProvider.getSelectedLang()).toPromise().then(translate => {
        this.translate = translate;
        this.initializeBarChart(true);
      });
    }, 1000);
  }

  /**
  * Display chart after getting data from MCS
  * handle errors
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  initializeBarChart(filterApplied) {
    this.getAnalyticReportData(filterApplied).then((analyticRes: any) => {
      this.setFiltersData(analyticRes).then((filterData) => {
        let responseData = this.getChartData(analyticRes);
        this.showBarChart(responseData);
        this.utilityProvider.stopSpinner();
        this.content.scrollToBottom();
      }).catch((error: any) => {
        this.utilityProvider.stopSpinner();
        this.logger.log(this.fileName, 'initializeBarChart', 'Error in setFiltersData : ' + JSON.stringify(error));
        if(error.data && error.data.error){
          this.utilityProvider.displayErrors([{ "errMsg":error.data.error}]);
        }
      });
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'initializeBarChart', 'Error in getAnalyticReportData : ' + JSON.stringify(error));
      if(error.data && error.data.error){
        this.utilityProvider.displayErrors([{ "errMsg":error.data.error}]);
      }
    });
  }

  /**
  * getting analytic report data of online and offline event from cloud
  * call cloud service on the basis of filter
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  getAnalyticReportData(filterApplied) {
    return new Promise((resolve, reject) => {
      let responseData: any = {
        'onlineRes': [],
        'offlineRes': []
      };
      let onlineOffset = this.onlineOffset;
      let offlineOffset = this.offlineOffset;
      if (!filterApplied) {
        if (this.utilityProvider.isConnected()) {
          // 03/15/2019 -- Mayur Varshney -- apply check to get final response data w.r.t Offset and hasMore
          this.getResponse(this.analyticReportJSON ? this.analyticReportJSON : responseData, onlineOffset, offlineOffset).then((resData: any) => {
            this.analyticReportJSON = resData;
            resolve(resData);
          }).catch((error: any) => {
            this.logger.log(this.fileName, 'getAnalyticReportData', 'Error in getResponse : ' + JSON.stringify(error));
            reject(error);
          });
        } else {
          let msg = "Data cannot be refreshed while you are offline.";
          this.utilityProvider.presentToast(msg, 4000, 'top', 'feedbackToast');
          resolve(this.analyticReportJSON);
        }
      } else {
        resolve(this.analyticReportJSON);
      }
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getAnalyticReportData', 'Error in promise : ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }

  /**
  * getting analytic report data of online and offline event from cloud
  * again call online/offline service on the basis of hasMore: - true/false
  * resolve final response data after concat online and offline data
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  getResponse(responseData, onlineOffset, offlineOffset) {
    return new Promise((resolve, reject) => {
      let promiseArray = [];
      if (onlineOffset != 0)
        promiseArray.push(this.cloudProvider.getAnalyticReportDataForOnlineAndOffline(this.start_date, this.end_date, 'OnlineActivity', onlineOffset ? onlineOffset : 0));

      if (offlineOffset != 0)
        promiseArray.push(this.cloudProvider.getAnalyticReportDataForOnlineAndOffline(this.start_date, this.end_date, 'OfflineActivity', offlineOffset ? offlineOffset : 0));

      Promise.all(promiseArray).then((res) => {
        let apiRes: any = {
          'onlineRes': res[0],
          'offlineRes': res[1]
        }
        this.checkIfDataRemaining(apiRes).then((finalRes: any) => {
          if (finalRes.checkedData.onlineRes)
            responseData.onlineRes = responseData.onlineRes.concat(finalRes.checkedData.onlineRes);
          if (finalRes.checkedData.offlineRes)
            responseData.offlineRes = responseData.offlineRes.concat(finalRes.checkedData.offlineRes);
          // if (apiRes.onlineRes)
          //   onlineOffset = apiRes.onlineRes.offset;
          // if (apiRes.offlineRes)
          //   offlineOffset = apiRes.offlineRes.offset;
          // if (finalRes.loadMore) {
          //   this.getResponse(responseData, onlineOffset, offlineOffset).then(() => {
          //     resolve(responseData);
          //   })
          // } else {
          //   resolve(responseData)
          // }

          if (apiRes.onlineRes)
            this.onlineOffset = apiRes.onlineRes.offset;
          if (apiRes.offlineRes)
            this.offlineOffset = apiRes.offlineRes.offset;
          if (finalRes.loadMore) {
            this.showLoadMoreBtn = true;
            resolve(responseData)
          } else {
            resolve(responseData)
          }
        }).catch((err) => {
          this.logger.log(this.fileName, "getResponse", "Error in checkIfDataRemaining : " + JSON.stringify(err));
          reject(err);
        });
      }).catch((err) => {
        this.logger.log(this.fileName, "getResponse", "Error in promise-all : " + JSON.stringify(err));
        reject(err);
      });
    }).catch((err) => {
      this.logger.log(this.fileName, "getResponse", "Error in promise : " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
  * get filters data from JSON arr of analytic report
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  setFiltersData(analyticRes) {
    this.OSName = [];
    this.countryName = [];
    this.users = [];
    return new Promise((resolve, reject) => {
      this.getOS(analyticRes);
      this.getUsers(analyticRes);
      this.getCountry(analyticRes).then((countryRes: any) => {
        resolve(true);
      }).catch((error) => {
        this.logger.log(this.fileName, 'setFiltersData', 'Error in getChartData : ' + JSON.stringify(error));
        reject(error);
      });
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'setFiltersData', 'Error in Promise : ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }

  /**
  * get country ids from JSON arr of analytic report
  * show unknown as country name if lat-long are null
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  getCountryEventData(data) {
    let resArray = []
    for (let i = 0; i < data.length; i++) {
      //02/01/2019 -- Mayur Varshney -- pass country to unknown if country is not exist
      if (data[i].country) {
        resArray.push(data[i].country);
      } else {
        resArray.push('Unknown');
      }
      //09/24/2018 -- Mayur Varshney -- push 'Unknown' if user not allowed to access location, getting null in lat/long
      // if (data[i].latitude == 'null' && data[i].longitude == 'null') {
      //   resArray.push('Unknown');
      // }
    }
    return resArray;
  }

  /**
  * return Country Name with resp to the Country Code for Country Filter DropDown
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  getCountry(responseData) {
    return new Promise((resolve, reject) => {
      let onlineResArray = [];
      let offlineResArray = [];
      let countryArr = [];
      onlineResArray = this.getCountryEventData(responseData.onlineRes);
      offlineResArray = this.getCountryEventData(responseData.offlineRes);
      let concatArr = onlineResArray.concat(offlineResArray);
      // 09/24/2018 - Mayur Varshney - calling function to remove duplicate array item and sort in order
      countryArr = this.utilityProvider.removeDuplicateItemFromArray(concatArr);
      this.localService.getCountry().then((response: any[]) => {
        for (let k = 0; k < countryArr.length; k++) {
          //09/24/2018 -- Mayur Varshney -- push JSON ('Country_Code': 'Unknown', 'Country_Name': 'Unknown') into countryName array if countryArr includes 'Unknown'
          if (countryArr[k] != 'Unknown' && countryArr[k] != "''") {
            let filteredCountry = response.filter(item => {
              return item.Country_Code == countryArr[k]
            })[0];
            this.countryName.push(filteredCountry);
          } else if (countryArr[k] == 'Unknown') {
            this.countryName.push({ 'Country_Code': 'Unknown', 'Country_Name': 'Unknown' });
          } else {
            this.logger.log(this.fileName, 'getCountry', '[' + countryArr[k] + '] is coming from mcs analytics, please purge this wrong data');
          }
        }
        resolve(true);
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getCountry', 'Error in getCountry : ' + JSON.stringify(error));
        reject(error);
      });
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'getCountry', 'Error in Promise : ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }

  /**
  * get operating system names from JSON arr of analytic report
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  getOS(responseData) {
    let onlineResArray = [];
    let offlineResArray = [];
    for (let i = 0; i < responseData.onlineRes.length; i++) {
      if (responseData.onlineRes[i].osName) {
        onlineResArray.push(responseData.onlineRes[i].osName);
      }
    }
    for (let j = 0; j < responseData.offlineRes.length; j++) {
      if (responseData.offlineRes[j].osName) {
        offlineResArray.push(responseData.offlineRes[j].osName);
      }
    }
    let concatArr = onlineResArray.concat(offlineResArray);
    // 09/24/2018 - Mayur Varshney - calling function to remove duplicate array item and sort in order
    this.OSName = this.utilityProvider.removeDuplicateItemFromArray(concatArr);
  }

  /**
  * get user ids from JSON arr of analytic report
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  getUsers(responseData) {
    let onlineResArray = [];
    let offlineResArray = [];
    for (let i = 0; i < responseData.onlineRes.length; i++) {
      // 10/11/2018 -- Mayur Varshney -- add username with respect to userId to show name in place of Ids
      let username = responseData.onlineRes[i].properties.User_Name;
      let userId = responseData.onlineRes[i].properties.user;
      let userJson = {
        'userName': (username ? username : userId), 'userId': userId
      }
      onlineResArray.push(userJson);
    }
    for (let j = 0; j < responseData.offlineRes.length; j++) {
      // 10/11/2018 -- Mayur Varshney -- add username with respect to userId to show name in place of Ids
      let username = responseData.offlineRes[j].properties.User_Name;
      let userId = responseData.offlineRes[j].properties.user;
      let userJson = {
        'userName': (username ? username : userId), 'userId': userId
      }
      offlineResArray.push(userJson);
    }
    let concatArr = onlineResArray.concat(offlineResArray);
    // 10/11/2018 - Mayur Varshney - calling function to remove duplicate array json and sort in order
    this.users = (this.removeDuplicateJSONObjectFromArray(concatArr)).sort(this.utilityProvider.getSortOrder('userName'));
  }

  /**
  * Return chartData (jsonArr) on the basis of number days in between start and end date according to selected groupBy or multiple filters
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  getChartData(responseData) {
    this.labels = [];
    let days: any;
    let duration: any;
    let filteredRes = [];
    let filteredOnlineEventData = [];
    let filteredOfflineEventData = [];
    try {
      switch (this.groupBy) {
        case 'Date':
          duration = moment(this.end_date, 'YYYY-MM-DD').diff(moment(this.start_date, 'YYYY-MM-DD'), 'days');
          days = parseInt(duration);
          for (let i = 0; i <= days; i++) {
            let dateItem = moment(this.start_date, 'YYYY-MM-DD').add(i, 'days').format('MM-DD-YYYY');
            let formattedDate = moment(dateItem, 'MM-DD-YYYY').format('DD-MMM');
            filteredRes.push(this.filteredData(responseData, dateItem, formattedDate));
          }
          break;
        case 'Country':
          for (let i = 0; i < this.countryName.length; i++) {
            let countryItem = this.countryName[i].Country_Code;
            let filteredDataJson = this.filteredData(responseData, countryItem, null);
            if (filteredDataJson) {
              filteredRes.push(filteredDataJson);
            }
          }
          break;
        case 'Users':
          for (let i = 0; i < this.users.length; i++) {
            let userItem = this.users[i];
            let filteredDataJson = this.filteredData(responseData, userItem, null);
            if (filteredDataJson) {
              filteredRes.push(filteredDataJson);
            }
          }
          break;
      }
      for (let j = 0; j < filteredRes.length; j++) {
        filteredOnlineEventData.push(filteredRes[j].onlineEventData);
        filteredOfflineEventData.push(filteredRes[j].offlineEventData);
      }
    } catch (error) {
      this.logger.log(this.fileName, 'getChartData', 'Error in try-catch block : ' + JSON.stringify(error));
      throw error;
    } finally {
      // 09/26/2018 -- Mayur Varshney -- Show Legends on X-axis if group by is UserId
      if (this.groupBy != 'Users') {
        this.labelItem = this.labels;
      } else {
        let labelIndex = [];
        let labelValue = [];
        for (let i = 0; i <= this.labels.length; i++) {
          if (this.labels[i]) {
            labelIndex.push(i + 1);
            labelValue.push({
              'LabelIndex': i + 1,
              'LabelIndexValue': this.labels[i].userName
            });
          }
        }
        this.labelItem = labelIndex;
        this.labelValue = labelValue;
      }
      // 10/08/2018 -- Mayur Varshney -- convert x/y label, and display events into selected language before initialising the chart
      let chartData = {
        'labels': this.translator(this.labelItem, true),
        'onlineData': filteredOnlineEventData,
        'offlineData': filteredOfflineEventData,
        'xAxisLabel': this.translator(this.groupBy, false),
        'yAxisLabel': this.translator('Duration In Hours', false),
        'Online': 'Online',
        'Offline': 'Offline'
      }
      return chartData;
    }
  }

  /**
  * filter data on the basis of multiple filter applied
  * find number of hours user online or offline on particular date with respect to the filters
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  filteredData(responseData, selectedItem, formattedDate) {
    let filteredRes;
    let offlineEventDataTime = 0;
    let onlineEventDataTime = 0;
    let satisfyCondition = true;
    try {
      //09/24/2018 -- Mayur Varshney -- Optimise Code , calling getEventDataTime(params) from getFilteredGroupByData,
      //09/24/2018 -- Mayur Varshney -- Returns online/ offline time with resp to applied filters
      onlineEventDataTime = this.getFilteredGroupByData(responseData.onlineRes, selectedItem);
      offlineEventDataTime = this.getFilteredGroupByData(responseData.offlineRes, selectedItem);
      switch (this.groupBy) {
        case 'Country':
          //09/27/2018 -- Mayur Varshney -- Apply check to display data only if available
          if (onlineEventDataTime == 0 && offlineEventDataTime == 0) {
            satisfyCondition = false;
          }
          break;
        case 'Users':
          //09/27/2018 -- Mayur Varshney -- Apply check to display data only if available
          if (onlineEventDataTime == 0 && offlineEventDataTime == 0) {
            satisfyCondition = false;
          }
          break;
      }
      if (satisfyCondition) {
        this.labels.push(this.groupBy == 'Date' ? formattedDate : selectedItem);
        filteredRes = {
          'onlineEventData': parseFloat(onlineEventDataTime.toFixed(4)),
          'offlineEventData': parseFloat(offlineEventDataTime.toFixed(4))
        }
      }
      return filteredRes;
    } catch (error) {
      this.logger.log(this.fileName, 'filteredData', 'Error in try-catch : ' + JSON.stringify(error));
    }
  }

  /**
  * Return getEventDataTime(params) data in number form on the basis of multiple filter applied
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  getFilteredGroupByData(data, selectedItem) {
    let groupByData = data.filter(item => {
      let result = false;
      switch (this.groupBy) {
        case 'Date':
          // 09/24/2018 - Mayur Varshney -- moment.isSame is not working in iOS, converted the selectedItem and properties.date into string
          // check if both the dates are same then return true.
          let selectedItemInString = moment(selectedItem, 'MM-DD-YYYY').format('MM-DD-YYYY').toString();
          let dateFromJSONInString = moment(item.properties.Date, 'MM-DD-YYYY').format('MM-DD-YYYY').toString();
          result = (selectedItemInString == dateFromJSONInString ? true : false);
          break;
        case 'Country':
          if (selectedItem == 'Unknown') {
            //09/24/2018 -- Mayur Varshney -- return only JSON containing lat/long = "null" if selected groupBy is Country and selectedItem is 'Unknown'
            // result = (item.latitude == 'null' && item.longitude == 'null' && !item.properties.DurationInMinutes);
            //02/01/2019 -- Mayur Varshney -- Filter Data on the basis of Country
            result = (!item.country && !item.properties.DurationInMinutes);
          } else {
            result = (item.country == selectedItem && !item.properties.DurationInMinutes);
          }
          break;
        case 'Users':
          result = (item.properties.user == selectedItem.userId && !item.properties.DurationInMinutes);
          break;
      }
      return result;
    });
    //09/24/2018 -- Mayur Varshney -- return time after passing filterGroupByData as params in getEventDataTime()
    return this.getEventDataTime(groupByData);
  }

  /**
  * Return time spent in hours on the basis of multiple filter and groupBy applied
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  getEventDataTime(groupByData) {
    let EventData = groupByData.filter(item => {
      //09/24/2018 -- Mayur Varshney -- apply filter on the basis of selected Country, if available
      // let hasCountry = this.country ? (this.country == 'Unknown' ? (item.latitude == 'null' && item.longitude == 'null' && !item.properties.DurationInMinutes) : (item.country == this.country && !item.properties.DurationInMinutes)) : true;
      //02/01/2019 -- Mayur Varshney -- Filter Data on the basis of Country
      let hasCountry = this.country ? (this.country == 'Unknown' ? (!item.country && !item.properties.DurationInMinutes) : (item.country == this.country && !item.properties.DurationInMinutes)) : true;
      let hasOS = this.operatingSys ? (item.osName == this.operatingSys && !item.properties.DurationInMinutes) : true;
      let hasUserId = this.userID ? (item.properties.user == this.userID && !item.properties.DurationInMinutes) : true;
      return hasCountry && hasOS && hasUserId;
    });
    let EventDataTime = 0;
    for (let i = 0; i < EventData.length; i++) {
      if (EventData[i].properties.DurationInMilliseconds) {
        // 09/24/2018 -- Mayur varshney -- Divide total time by 3600 * 1000 to convert milliseconds into hours
        let convertedMillisecToHour = parseFloat(EventData[i].properties.DurationInMilliseconds) / 3600000;
        EventDataTime = convertedMillisecToHour + EventDataTime;
      }
    }
    return EventDataTime;
  }

  /**
  * show chart after passing online time spent, offline time spent and labels array in a json
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  showBarChart(chartData) {
    return new Promise((resolve, reject) => {
      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: chartData.Online,
              data: chartData.onlineData,
              backgroundColor: 'rgba(112, 246, 35, 0.5)',
              borderColor: 'rgba(6, 15, 5, 1)',
              borderWidth: 1
            },
            {
              label: chartData.Offline,
              data: chartData.offlineData,
              backgroundColor: 'rgba(6, 15, 5, 0.3)',
              borderColor: 'rgba(6, 15, 5, 1)',
              borderWidth: 1
            }]
        },
        options: {
          scaleShowVerticalLines: false,
          responsive: true,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                offsetGridLines: false,
                display: true
              },
              scaleLabel: {
                display: true,
                labelString: chartData.yAxisLabel,
                fontFamily: 'Helvetica Neue',
                fontSize: '14',
                fontColor: 'black'
              }
            }],
            xAxes: [{
              maxBarThickness: 100,
              gridLines: {
                offsetGridLines: false,
                display: false
              },
              scaleLabel: {
                display: true,
                labelString: chartData.xAxisLabel,
                fontFamily: 'Helvetica Neue',
                fontSize: '14',
                fontColor: 'black'
              }
            }]
          },
          legend: {
            labels: {
              fontColor: 'black',
              fontSize: 14
            }
          }
        }
      });
      resolve(this.barChart);
    }).catch((error: any) => {
      this.logger.log(this.fileName, 'showBarChart', 'Error in promise : ' + JSON.stringify(error));
      return Promise.reject(error);
    });
  }

  /**
  * hide datepicker calendar if any drop down click
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  hideCalendar(event) {
    this.dp1.hide();
    this.dp2.hide();
  }

  hideCalenderInOptimization() {
    this.dp3.hide();
    this.dp4.hide();
  }

  /**
  * translate language dynamically
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  translator(text, array) {
    if (array) {
      let translatedArray = [];
      for (let i = 0; i < text.length; i++) {
        translatedArray.push(this.translate[text[i]] ? this.translate[text[i]] : text[i]);
      }
      return translatedArray;
    } else {
      return this.translate[text] ? this.translate[text] : text;
    }
  }

  /**
  * remove duplicate json object from array
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  removeDuplicateJSONObjectFromArray(jsonArr) {
    let newArr = [];
    jsonArr.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key) => {
        if (value.userId == val2.userId) { exists = true };
      });
      if (exists == false && value.userId != "") { newArr.push(value); }
    });
    return newArr;
  }
  /**
   *@author Prateek (19/feb/2019)
   * Date Select on single click on ipad
   */
  onShowPicker(event) {
    // event.dayHoverHandler = hoverWrapper;
    event.dayHoverHandler = this.utilityProvider.singleClickDaySelector(event, this.dp1, this.dp2, this.dp3, this.dp4);
  }

  /**
  * check if more items returns true/false
  * return response data and loadMore true/false
  * show alert if moreItems is true
  * @export
  * @class Report
  * @author Mayur Varshney
  */
  checkIfDataRemaining(data) {
    return new Promise((resolve, reject) => {
      if ((data.onlineRes && data.onlineRes.moreItems) || (data.offlineRes && data.offlineRes.moreItems)) {
        // let alert = this.utilityProvider.confirmationAlert('Alert', 'Do you want to load more?');
        // alert.present();
        // alert.onDidDismiss((response) => {
        //   resolve({
        //     'checkedData': {
        //       'onlineRes': data.onlineRes ? data.onlineRes.items : data.onlineRes,
        //       'offlineRes': data.offlineRes ? data.offlineRes.items : data.offlineRes
        //     },
        //     'loadMore': response
        //   })
        // });

        resolve({
          'checkedData': {
            'onlineRes': data.onlineRes ? data.onlineRes.items : data.onlineRes,
            'offlineRes': data.offlineRes ? data.offlineRes.items : data.offlineRes
          },
          'loadMore': true
        })
      } else {
        resolve({
          'checkedData': {
            'onlineRes': data.onlineRes ? data.onlineRes.items : data.onlineRes,
            'offlineRes': data.offlineRes ? data.offlineRes.items : data.offlineRes
          },
          'loadMore': false
        })
      }
    }).catch((err) => {
      this.logger.log(this.fileName, "checkIfDataRemaining", "Error in promise : " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }

  /**
 *@author: Prateek(21/01/2019)
 *Unsubscribe all events.
 *App Optimization
 * @memberof CalendarPage
 */
  ionViewWillLeave(): void {
    this.events.unsubscribe('langSelected');
    clearTimeout(this.timeOut);
  }

}
