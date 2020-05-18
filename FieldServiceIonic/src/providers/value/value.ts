import { Injectable, Injector } from '@angular/core';
import { LocalServiceProvider } from '../local-service/local-service';
import { HttpClient } from '@angular/common/http';
import { DatabaseProvider } from '../database/database';
import * as moment from "moment-timezone";
import { LoggerProvider } from '../logger/logger';
import { Permissions } from '../../beans/Permissions'
import * as Enums from '../../enums/enums';
import { Storage } from '@ionic/storage';
@Injectable()
export class ValueProvider {
  db: any;
  accsToken: string;
  private localService: LocalServiceProvider;
  fileName: any = 'ValueProvider';
  appUrl: any;
  continueDebrief: boolean = false;
  TotalHours: any;
  Selected_Process: any;
  fdo: any;
  notePopup: boolean = true;
  constructor(public logger: LoggerProvider, injector: Injector, public http: HttpClient,
    public dbctrl: DatabaseProvider, public storage: Storage) {
    this.permissions = Permissions;
    this.startDate.setDate(this.startDate.getDate() - 15);
    this.startDateISOFormat = this.startDate.toISOString();
    this.endDate.setMonth(this.endDate.getMonth() + 3);
    this.endDateISOFormat = this.endDate.toISOString();
    this.momentTimeZoneNames = moment.tz.names();

    setTimeout(() => this.localService = injector.get(LocalServiceProvider));
  }
  modiFiedArrWithoutBreak: any = [];
  additionalArrWithoutBreak: any = [];
  originalArrWithoutBreak: any = [];
  username: string;
  onComplete: any;
  resourceId: any;
  taskId: any;
  userId: any;
  type: any;
  user: any = {};
  lastUpdated: any;
  permissions: any;
  isSummary: any;
  navigation: any;
  isVarify: any;
  tabEvent: any;
  isCustomerSelected: any;
  userRole: any = [];
  userFeedback: any[] = [];
  start_sync: any;
  user_prefArray: any = [];
  prefLangIds: any[] = [];
  userFSRPrefArray: any = {};
  countryList: any = [];
  contactList: any = [];
  productList: any = [];
  timeZoneList: any = [];
  activeTimeZoneList: any = [];
  manufacturerList: any = [];
  statusList: any = [];
  enabledCountryList: any = [];
  enabledLanguageList: any = [];
  preferredArray: any[] = [];
  preferredLanguage: any[] = [];
  workSchedule: any[] = [];
  debrief: any = {
    task: {},
    taskList: [],
    installBase: [],
    contacts: [],
    taskNotes: [],
    taskAttachment: [],
    time: [],
    timeForDisplay: [],
    expense: [],
    material: [],
    notes: [],
    attachment: [],
    engineer: {},
    overTime: [],
    shiftCode: [],
    fieldName: [],
    chargeMethod: [],
    chargeType: [],
    expenseType: [],
    noteType: [],
    workType: [],
    item: [],
    currency: [],
    UOM: [],
    tool: [],
    attachmentForDisplay: [],
    detailednotesattachment: [],
    detailedNotesAttachmentForDisplay: []
  };
  verifyPage: any;
  timeCommentText: any;
  startDate = new Date();
  startDateISOFormat: any;
  endDate = new Date();
  endDateISOFormat: any;
  taskList = [];
  isLogin: boolean;
  materialArr: any = [];
  modifiedTime: any = [];
  additionalTime: any = [];
  modifiedExpense: any = [];
  additionalExpense: any = [];
  postSigExpense: any = [];
  modifiedMaterial: any = [];
  additionalMaterial: any = [];
  taskData: any = {};
  taskObject: any = {};
  expenseObj: any = {};
  language: any;
  userType = {
    name: '',
    clarityType: '',
    defaultView: '',
    duration: ''
  };
  contactsEmail: any[] = [];
  momentTimeZoneNames: any[] = [];
  preferredTimeZone: any;
  // isAdmin: boolean = false;
  refreshTokenCheck: boolean = false;
  confirmBackToRoot: boolean = false;
  sdrTabIndex: number = 2;
  previousTabIndex: number = null;
  appVersion: any;
  worldAreaId: any;
  timeArr: any = [];
  taskIdtoSubmit: any;
  syncStatus: any;
  pressureType: any;
  day_week_pref_data: any;
  user_pref_loaded: boolean;
  // ReportID: any;
  DeviceType: any;

  // 08/24/2018 kamal set isLogin
  setIsLogin(islogin) {
    this.isLogin = islogin;
  }

  // 08/24/2018 kamal get isLogin
  getIsLogin() {
    return this.isLogin;
  }

  getUsername() {
    return this.username;
  }
  setUsername(username) {
    this.username = username;
  }

  getResourceId() {
    return this.resourceId.toString();
  }
  setResourceId(id) {
    this.resourceId = id;
  }

  getTaskId() {
    return this.taskId ? this.taskId.toString() : this.taskId;
  }
  setTaskId(taskId) {
    this.taskId = taskId;
  }

  getType() {
    return this.type;
  }
  setType(type) {
    this.type = type;
  }

  getUser() {
    return this.user;
  }
  setUser(user) {
    this.user = user;
    this.setUserType();
  }

  getUserType() {
    return this.userType;
  };

  getUserEmail() {
    return this.user.Email;
  }

  getUserFullName() {
    return this.user.Name;
  }

  setUserType() {
    /**
     * 08/17/2018 Rizwan Haider,
     * this.getUser() was called multiple times(5 times) just to get this.user, which is global variable.
     */
    this.userType.name = this.user.Name;
    this.userType.defaultView = this.user.Default_View;
    this.userType.duration = this.user.Work_Hour;
    if (this.user.ClarityID == "1" || this.user.ClarityID != "") {
      this.userType.clarityType = 'C';
    } else {
      this.userType.clarityType = 'NC';
    }
  }

  getCommentText() {
    return this.timeCommentText;
  }
  setCommentText(timeCommentText) {
    this.timeCommentText = timeCommentText;
  }

  getLastUpdated() {
    return this.lastUpdated;
  }
  setLastUpdated(lastUpdated) {
    this.lastUpdated = lastUpdated;
  }

  getStartDate() {
    return this.startDateISOFormat;
  };

  getEndDate() {
    return this.endDateISOFormat;
  };

  getLanguage() {
    return this.language;
  };
  setLanguage(lang) {
    this.language = lang;
  };

  setTask(taskObject) {
    // 12/29/2018 -- Mayur Varshney -- Apply check if taskobject is undefined
    if (taskObject.Task_Number) {
      return new Promise((resolve, reject) => {
        this.debrief.task = taskObject;
        this.localService.IsStandaloneJob(taskObject.Task_Number).then((res: any) => {
          if (res.length > 0) {
            this.initiateSetTaskForStandaloneJob(taskObject).then((standaloneResult: any) => {
              if (standaloneResult == 'success') {
                resolve('success');
              } else {
                resolve('failure');
              }
            }).catch((error) => {
              this.logger.log(this.fileName, "setTask TXN", "error :" + JSON.stringify(error));
              resolve('failure');
            });
          } else {
            this.initiateSetTaskForOSCJob(taskObject).then((OSC_Result: any) => {
              if (OSC_Result == 'success') {
                resolve('success');
              } else {
                resolve('failure');
              }
            }).catch((error) => {
              this.logger.log(this.fileName, "setTask TXN", "error :" + JSON.stringify(error));
              resolve('failure');
            });
          }
        }).catch((error) => {
          this.logger.log(this.fileName, "setTask", "Error in IsStandaloneJob :" + error);
          resolve("failure")
        });
      });
    } else {
      return Promise.resolve('failure');
    }
  };

  //11/02/2018 -- Mayur Varshney -- Divide set task into two part on the basis of standalone and OSC jobs
  initiateSetTaskForOSCJob(taskObject) {
    return new Promise((resolve, reject) => {
      this.debrief.task = taskObject;
      let promiseArray = [];
      // 10/24/2018 -- Mayur Varshney -- Apply try-catch and if condition for taskobject
      try {
        if (taskObject) {
          // console.log("setTask taskObject.Task_Number", taskObject.Task_Number );
          promiseArray.push(this.localService.getInstallBaseList(taskObject.Task_Number));
          promiseArray.push(this.localService.getContactList(taskObject.Task_Number));
          promiseArray.push(this.localService.getOverviewNotes(taskObject.SR_ID, taskObject.Task_Number));
          // promiseArray.push(this.localService.getSRNoteList(taskObject.SR_ID));
          promiseArray.push(this.localService.getOverviewAttachments(taskObject.SR_ID, taskObject.Task_Number));
          // promiseArray.push(this.localService.getSRAttachmentList(taskObject.SR_ID, "S"));
          promiseArray.push(this.localService.getOverTimeList(taskObject.Project_Number));
          promiseArray.push(this.localService.getShiftCodeList(taskObject.Project_Number));
          promiseArray.push(this.localService.getFieldJobNameList(taskObject.Project_Number));
          promiseArray.push(this.localService.getChargeMethodList());
          promiseArray.push(this.localService.getChargeTypeList());
          promiseArray.push(this.localService.getExpenseTypeList());
          promiseArray.push(this.localService.getNoteTypeList());
          promiseArray.push(this.localService.getWorkTypeList());
          promiseArray.push(this.localService.getItemList());
          promiseArray.push(this.localService.getCurrencyList());
          promiseArray.push(this.localService.getUOMList());
          promiseArray.push(this.localService.getTimeList(taskObject.Task_Number));
          promiseArray.push(this.localService.getExpenseList(taskObject.Task_Number));
          promiseArray.push(Promise.resolve([]));
          promiseArray.push(this.localService.getNotesList(taskObject.Task_Number));
          promiseArray.push(this.localService.getAttachmentList(taskObject.Task_Number, 'D'));
          promiseArray.push(this.localService.getEngineer(taskObject.Task_Number));
          promiseArray.push(this.localService.getToolList(taskObject.Task_Number));
          promiseArray.push(this.localService.getCustomer(taskObject.Task_Number));
          promiseArray.push(this.localService.getAddressList());

          Promise.all(promiseArray).then((response) => {
            try {
              this.debrief.installBase = response[0];
              this.debrief.contacts = response[1];
              this.setUserEmailId(this.debrief.contacts);
              this.debrief.taskNotes = response[2];
              this.debrief.taskAttachment = response[3];
              this.debrief.overTime = response[4];
              this.debrief.shiftCode = response[5];
              this.debrief.fieldName = response[6];
              this.debrief.chargeMethod = response[7];
              this.debrief.chargeType = response[8];
              this.debrief.expenseType = response[9];
              this.debrief.noteType = response[10];
              this.debrief.workType = response[11];
              this.debrief.item = response[12];
              this.debrief.currency = response[13];
              this.debrief.UOM = response[14];
              this.debrief.time = response[15];
              this.debrief.expense = response[16];
              this.debrief.material = response[17];
              this.debrief.notes = response[18];
              this.debrief.attachment = response[19];
              this.debrief.engineer = response[20];
              this.debrief.tool = response[21];
              this.debrief.customer = response[22];
              this.debrief.emersonAddress = response[23];
              resolve("success");
            } catch (error) {
              this.logger.log(this.fileName, "setTask", "Error in Promise catch :" + JSON.stringify(error));
              resolve("failure")
            }
          }).catch((error: any) => {
            this.logger.log(this.fileName, "setTask", "Promise all error :" + JSON.stringify(error));
            resolve("failure")
          });
        } else {
          this.logger.log(this.fileName, "setTask", "taskobject is not set");
          resolve("failure");
        }
      } catch (error) {
        this.logger.log(this.fileName, "setTask", "Error in Promise:" + JSON.stringify(error));
        resolve("failure");
      }
    })
  }

  //11/02/2018 -- Mayur Varshney -- Divide set task into two part on the basis of standalone and OSC jobs
  initiateSetTaskForStandaloneJob(taskObject) {
    return new Promise((resolve, reject) => {
      this.debrief.task = taskObject;
      let promiseArray = [];
      // 10/24/2018 -- Mayur Varshney -- Apply try-catch and if condition for taskobject
      try {
        if (taskObject) {
          promiseArray.push(this.localService.getContactList(taskObject.Task_Number));
          promiseArray.push(this.localService.getNoteList(taskObject.Task_Number));
          promiseArray.push(this.localService.getChargeMethodList());
          promiseArray.push(this.localService.getChargeTypeList());
          promiseArray.push(this.localService.getExpenseTypeList());
          promiseArray.push(this.localService.getNoteTypeList());
          promiseArray.push(this.localService.getWorkTypeList());
          promiseArray.push(this.localService.getItemList());
          promiseArray.push(this.localService.getCurrencyList());
          promiseArray.push(this.localService.getUOMList());
          promiseArray.push(this.localService.getTimeList(taskObject.Task_Number));
          promiseArray.push(this.localService.getExpenseList(taskObject.Task_Number));
          promiseArray.push(Promise.resolve([]));
          promiseArray.push(this.localService.getNotesList(taskObject.Task_Number));
          promiseArray.push(this.localService.getAttachmentList(taskObject.Task_Number, 'D'));
          promiseArray.push(this.localService.getEngineer(taskObject.Task_Number));
          promiseArray.push(this.localService.getToolList(taskObject.Task_Number));
          promiseArray.push(this.localService.getCustomer(taskObject.Task_Number));

          Promise.all(promiseArray).then((response) => {
            try {
              this.debrief.contacts = response[0];
              this.debrief.taskNotes = response[1];
              this.debrief.chargeMethod = response[2];
              this.debrief.chargeType = response[3];
              this.debrief.expenseType = response[4];
              this.debrief.noteType = response[5];
              this.debrief.workType = response[6];
              this.debrief.item = response[7];
              this.debrief.currency = response[8];
              this.debrief.UOM = response[9];
              this.debrief.time = response[10];
              this.debrief.expense = response[11];
              this.debrief.material = response[12];
              this.debrief.notes = response[13];
              this.debrief.attachment = response[14];
              this.debrief.engineer = response[15];
              this.debrief.tool = response[16];
              this.debrief.customer = response[17];
              resolve("success");
            } catch (error) {
              this.logger.log(this.fileName, "setTask", "error :" + JSON.stringify(error));
              resolve("failure");
            }
          }).catch((error) => {
            this.logger.log(this.fileName, "setTask TXN", "error :" + JSON.stringify(error));
            resolve("failure");
          });
        } else {
          this.logger.log(this.fileName, "setTask", "taskobject is not set");
          resolve("failure");
        }
      } catch (error) {
        this.logger.log(this.fileName, "setTask", "error :" + JSON.stringify(error));
        resolve("failure");
      }
    })
  }

  getTask() {
    return this.debrief.task;
  }
  setTaskObj(taskObj) {
    this.debrief.task = taskObj;
  }

  getTaskStatusID() {
    return this.debrief.task.StatusID;
  }

  isChinaCountry() {
    return this.getTask().Country.toLowerCase() == "people's republic of china" || this.getTask().Country.toLowerCase() == "china";
  }

  // 05-28-2019 -- Mayur Varshney -- apply check if country is Korean
  isKoreanCountry() {
    return this.getTask().Country.toLowerCase() == '"korea, republic of"';
  }

  // 06-04-2019 -- Mayur Varshney -- apply check if country is Japan
  isJapanCountry() {
    return this.getTask().Country.toLowerCase() == 'japan';
  }

  getInstallBase() {
    return this.debrief.installBase;
  };
  setInstallBase(installBaseObject) {
    this.debrief.installBase = installBaseObject;
  };

  getContact() {
    return this.debrief.contacts;
  };

  getTaskNotes() {
    return this.debrief.taskNotes;
  };

  getTaskAttachment() {
    return this.debrief.taskAttachment;
  };

  getOverTime() {
    return this.debrief.overTime;
  };
  setOverTime(overTimeArray) {
    this.debrief.overTime = overTimeArray;
  };

  getShiftCode() {
    return this.debrief.shiftCode;
  };
  setShiftCode(shiftCodeArray) {
    this.debrief.shiftCode = shiftCodeArray;
  };

  getFieldJob() {
    return this.debrief.fieldName;
  };

  getChargeMethod() {
    return this.debrief.chargeMethod;
  };

  getChargeType() {
    return this.debrief.chargeType;
  };

  getExpenseType() {
    return this.debrief.expenseType;
  };

  getNoteType() {
    return this.debrief.noteType;
  };

  getWorkType() {
    return this.debrief.workType;
  };

  getItem() {
    return this.debrief.item;
  };

  getCurrency() {
    return this.debrief.currency;
  };

  getUOM() {
    return this.debrief.UOM;
  };

  getCustomer() {
    return this.debrief.customer;
  };
  setCustomer(customerArray) {
    this.debrief.customer = customerArray;
  };

  getTime() {
    return this.debrief.time;
  };
  setTime(timeArray) {
    this.debrief.time = timeArray;
  };

  getTimeForDisplay() {
    return this.debrief.timeForDisplay;
  };
  setTimeForDisplay(timeArray) {
    this.debrief.timeForDisplay = timeArray;
  };

  setTimeForDisplayWithoutBreak(withoutBreakArray) {
    this.originalArrWithoutBreak = withoutBreakArray
  }
  getTimeForDisplayWithoutBreak() {
    return this.originalArrWithoutBreak
  }
  getExpense() {
    return this.debrief.expense;
  };
  setExpense(expenseArray) {
    this.debrief.expense = expenseArray;
  };

  getMaterial() {
    return this.debrief.material;
  };
  setMaterial(materialArray) {
    this.debrief.material = materialArray;
  };

  //09/17/2018 Zohaib Khan: Setting material data for FSR display
  setMaterialForDisplay(materialArray) {
    this.materialArr = materialArray
  }
  getMaterialForDisplay() {
    return this.materialArr;
  }

  getNote() {
    return this.debrief.notes;
  };
  setNote(noteArray) {
    this.debrief.notes = noteArray;
  };

  getAttachment() {
    return this.debrief.attachment;
  };
  setAttachment(attachmentArray) {
    this.debrief.attachment = attachmentArray;
  };

  getAttachmentForDisplay() {
    return this.debrief.attachmentForDisplay;
  };
  setAttachmentForDisplay(attachmentArray) {
    this.debrief.attachment = attachmentArray;
  };

  addAttachmentForDisplay(attachment) {
    this.debrief.attachmentForDisplay.push(attachment);
  };

  resetAttachmentForDisplay() {
    this.debrief.attachmentForDisplay = [];
  }

  getEngineer() {
    return this.debrief.engineer;
  };
  setEngineer(engineerObject) {
    this.debrief.engineer = engineerObject;
  };

  getTool() {
    return this.debrief.tool;
  };
  setTool(toolsObject) {
    this.debrief.tool = toolsObject;
  }

  getTaskList() {
    return this.taskList;
  };
  setTaskList(response) {
    this.taskList = response;
  };

  getCountryList() {
    return this.countryList;
  };
  setCountryList(response) {
    this.countryList = response;
  };

  getIsSummarySelected() {
    return this.isSummary;
  }
  setIsSummarySelected(value) {
    this.isSummary = value;
  }

  getNaviagtion() {
    return this.navigation;
  }
  setNavTab(nav) {
    this.navigation = nav;
  }

  getVerify() {
    return this.isVarify;
  }
  setVerify(value) {
    this.isVarify = value;
  }

  getTabDetails() {
    return this.tabEvent;
  }
  setTabDetails(value) {
    this.tabEvent = value;
  }

  getIsCustomerSelected() {
    return this.isCustomerSelected;
  }
  setIsCustomerSelected(value) {
    this.isCustomerSelected = value;
  }

  // 02-19-2019 -- Mansi Arora -- get current user roles
  getUserRoles() {
    return this.userRole;
  }

  // 02-19-2019 -- Mansi Arora -- set user roles while login
  setUserRoles(value) {
    this.userRole = value;
    // this.setHasAdminRole();
  }

  // hasAdminRole() {
  //   return this.isAdmin;
  // }
  // setHasAdminRole() {
  //   this.userRole = typeof this.userRole == 'string' ? this.userRole.split(',') : this.userRole;
  //   this.isAdmin = this.userRole.filter(item => { return item == 'FSA_Admin' }).length == 0 ? false : true;
  // }

  // getAddressByCountry(country, language) {
  //   let addressList;
  //   if (country.toLowerCase() == "people's republic of china" || country.toLowerCase() == "china") {
  //     addressList = this.debrief.emersonAddress.filter((item) => { return item.Country_Name == country && item.Language == language && item.IsDefault == 'true' });
  //   } else {
  //     addressList = this.debrief.emersonAddress.filter((item) => { return item.Country_Name == country && item.IsDefault == 'true' });
  //   }
  //   if (addressList.length == 0) {
  //     addressList = this.debrief.emersonAddress.filter((item) => { return item.Country_Name == 'US' && item.IsDefault == 'true' });
  //   }

  //   return addressList;
  // }

  /* getAddressByID(id) {
    let addressList = this.debrief.emersonAddress.filter((item) => { return item.Country_Name == id && item.IsDefault == 'true' });

    return addressList;
  } */

  getUserEmailId() {
    return this.contactsEmail;
  };
  setUserEmailId(contacts) {
    for (let i = 0; i < contacts.length; i++) {
      this.contactsEmail.push(contacts[i].Email);
    }
  };

  getPageOnVerify() {
    return this.verifyPage;
  }

  setPageOnVerify(value) {
    this.verifyPage = value;
  }

  getSelectedLang() {
    return this.user_prefArray.length > 0 ? this.user_prefArray[0].SelectedLanguage : 'en-gb';
  }

  getDebriefHeader() {
    return this.onComplete;
  }
  setDebriefHeader(value) {
    this.onComplete = value;
  }

  getStartSync() {
    return this.start_sync;
  }
  setStartSync(value) {
    this.start_sync = value;
  }

  // getDayWeekViewData() {
  //   return this.day_week_pref_data;
  // };

  // setDayWeekViewData(data) {
  //   this.day_week_pref_data = data;
  // };

  getUserPrefLoaded() {
    return this.user_pref_loaded;
  };

  setUserPrefLoaded(value) {
    this.user_pref_loaded = value;
  };

  getUserPreferences() {
    return this.user_prefArray;
  };

  setUserPreferences(userPreferenceArray) {
    this.user_prefArray = userPreferenceArray;
    this.setPreferredLanguage();
  };

  getUserFSRPreferences() {
    return this.userFSRPrefArray;
  };

  setUserFSRPreferences(fsrprefernces) {
    this.userFSRPrefArray = fsrprefernces;
    this.setPreferredLanguage();
  };

  getPreferredLanguage() {
    return this.preferredArray;
  };

  setPreferredLanguage() {
    try {
      if (this.user_prefArray.length > 0) {
        if (this.user_prefArray[0].Preferred_language) {
          this.preferredArray = this.user_prefArray[0].Preferred_language.split(",");
          this.prefLangIds = this.user_prefArray[0].Preferred_language_Id.split(",");
        }
      } else {
        this.preferredArray = ["en-gb", "zh-cn", "fr"];
      }
    } catch (err) {
      this.logger.log(this.fileName, 'setPreferredLanguage', 'Error in Promise: ' + JSON.stringify(err));
    }
  }

  getLanguageList() {
    return this.preferredLanguage;
  }

  setLanguageList(value) {
    this.preferredLanguage = value;
  }

  getUserFeedback() {
    return this.userFeedback;
  };

  setUserFeedback(value) {
    this.userFeedback = value;
  };

  getWorkSchedule() {
    return this.workSchedule;
  }
  setWorkSchedule(data) {
    this.workSchedule = data;
  }

  getprefLangIds() {
    return this.prefLangIds;
  }

  getProductList() {
    return this.productList;
  }
  setProductList(list) {
    this.productList = list;
  }

  getManufacturerList() {
    return this.manufacturerList;
  }
  setManufacturerList(list) {
    this.manufacturerList = list;
  }

  getStatusList() {
    return this.statusList;
  }
  setStatusList(list) {
    this.statusList = list;
  }

  getContactList() {
    return this.contactList;
  }
  setContactList(list) {
    this.contactList = list;
  }

  getEnabledCountryList() {
    return this.enabledCountryList;
  }
  setEnabledCountryList(list) {
    this.enabledCountryList = list;
  }

  getEnabledLanguageList() {
    return this.enabledLanguageList;
  }
  setEnabledLanguageList(list) {
    this.enabledLanguageList = list;
  }

  getActiveTimeZoneList() {
    return this.activeTimeZoneList;
  }
  setActiveTimeZoneList(list) {
    this.activeTimeZoneList = list;
  }



  getFormattedTime(date) {
    let formattedTime = '';
    if (date && date != '') {
      let dateFormat = this.user_prefArray[0].Date_Format;
      dateFormat = dateFormat && dateFormat != '' ? dateFormat.toUpperCase() : 'DD-MMM-YYYY';
      formattedTime = moment(date).format((dateFormat + ' HH:mm:ss'));
    }
    return formattedTime;
  }

  resetDebrief() {
    this.debrief = {
      task: {},
      taskList: [],
      installBase: [],
      contacts: [],
      taskNotes: [],
      taskAttachment: [],
      time: [],
      timeForDisplay: [],
      expense: [],
      material: [],
      notes: [],
      attachment: [],
      engineer: {},
      overTime: [],
      shiftCode: [],
      fieldName: [],
      chargeMethod: [],
      chargeType: [],
      expenseType: [],
      noteType: [],
      workType: [],
      item: [],
      currency: [],
      UOM: [],
      tool: [],
      attachmentForDisplay: []
    };
  }

  CurrentBUID: any;
  TemplateID: any = 1;
  currentReport: any;
  currentBGID: any;
  workFlowGroupID: any;
  workFlowID: any;
  productID: any;
  getDefaultBGID() {
    // 11-30-2018 GS : TODO for Shivansh - This should return User's Bussiness Group
    return this.getUser().DefaultBUID && this.getUser().DefaultBUID != '' ? parseInt(this.getUser().DefaultBUID) : Enums.BusinessGroup.Final_Control;
  }

  setCurrentBUID(BUID) {
    this.CurrentBUID = BUID;
  }

  getCurrentBUID() {
    return this.CurrentBUID;
  }

  setCurrentReport(currentReport) {
    this.currentReport = currentReport;
  }

  getCurrentReport() {
    return this.currentReport;
  }

  getTemplateID() {
    return this.TemplateID;
  }

  setPermissions(permissions) {
    this.permissions = permissions;
  }

  Last_Updated_MST_Customer: any;
  setLast_Updated_MST_Customer(Last_Updated_MST_Customer) {
    this.Last_Updated_MST_Customer = Last_Updated_MST_Customer;
  }

  getLast_Updated_MST_Customer() {
    return this.Last_Updated_MST_Customer;
  }

  Last_Updated_Lookups: any;
  setLast_Updated_Lookups(Last_Updated_Lookups) {
    this.Last_Updated_Lookups = Last_Updated_Lookups;
  }

  getLast_Updated_Lookups() {
    return this.Last_Updated_Lookups;
  }

  getPermissions() {
    return this.permissions;
  }

  getUserId() {
    return this.getUser().UserID;
  }

  setCurrentBUGroup(BGID) {
    this.currentBGID = BGID;
  }

  getCurrentBUGroup() {
    return this.currentBGID;
  }
  /**
   *Checks If any of the permissions is enabled for admin then returns true
   * @returns
   * @memberof ValueProvider
   */
  checkAdminPermissions() {
    if (this.languagePermissions() || this.locationPermissions() || this.permissions.AddUsers || this.permissions.EditUsers || this.permissions.AssignRoles || this.permissions.DeleteUsers || this.permissions.ViewUsers || this.permissions.ManageFeedbacks || this.permissions.ViewReport) {
      return true;
    }
    return false;
  }

  isOSCUser() {
    return this.resourceId.toString() != '0';
  }
  /**
   *Checks If any of the Language permissions is enabled  then returns true
   * @returns
   * @memberof ValueProvider
   */
  languagePermissions() {
    if (this.permissions.ActivateLanguage || this.permissions.EditLanguage || this.permissions.ViewLanguage || this.permissions.AddNewKey) {
      return true;
    }
    return false;
  }
  /**
   *Checks If any of the locations permissions is enabled  then returns true
   * @returns
   * @memberof ValueProvider
   */
  locationPermissions() {
    if (this.permissions.AddLocations || this.permissions.EditLocation || this.permissions.ViewLocation) {
      return true;
    }
    return false;
  }

  setSortedModifiedTime(time) {
    this.modifiedTime = time;
  }
  getSortedModifiedTime() {
    return this.modifiedTime;
  }

  setSortedModifiedTimeWithoutBreak(withoutBreakArray) {
    this.modiFiedArrWithoutBreak = withoutBreakArray
  }
  getSortedModifiedTimeWithoutBreak() {
    return this.modiFiedArrWithoutBreak
  }

  setadditionalTime(time) {
    this.additionalTime = time;
  }
  getadditionalTime() {
    return this.additionalTime;
  }

  setadditionalTimeWithoutBreak(withoutBreakArray) {
    this.additionalArrWithoutBreak = withoutBreakArray
  }
  getadditionalTimeWithoutBreak() {
    return this.additionalArrWithoutBreak;
  }
  setSortedModifiedExpense(expense) {
    this.modifiedExpense = expense;
  }
  getSortedModifiedExpense() {
    return this.modifiedExpense;
  }
  setadditionalExpense(expense) {
    this.additionalExpense = expense;
  }
  getadditionalExpense() {
    return this.additionalExpense;
  }
  setPostSigExpense(expense) {
    this.postSigExpense = expense;
  }
  getPostSigExpense() {
    return this.postSigExpense;
  }
  setSortedModifiedMaterial(material) {
    this.modifiedMaterial = material;
  }
  getSortedModifiedMaterial() {
    return this.modifiedMaterial;
  }
  setAdditionalMaterial(material) {
    this.additionalMaterial = material;
  }
  getAdditionalMaterial() {
    return this.additionalMaterial
  }

  setTaskData(data) {
    this.taskData = data;
  }
  getTaskData() {
    return this.taskData;
  }
  setTaskObject(object) {
    this.taskObject = object;
  }
  getTaskObject() {
    return this.taskObject;

  }
  setExpenseForDisplay(expense) {
    this.expenseObj = expense
  }
  getExpenseForDisplay() {
    return this.expenseObj
  }
  getWorkFlowGroupID() {
    return this.workFlowGroupID;
  }
  setWorkFlowGroupID(WorkflowGroupID) {
    this.workFlowGroupID = WorkflowGroupID;
  }

  getCurrentDevice() {
    return this.productID;
  }
  setCurrentDevice(ProductID) {
    this.productID = ProductID;
  }

  getDetailedNotesAttachment() {
    return this.debrief.detailednotesattachment;
  };
  setDetailedNotesAttachment(attachmentArray: any[]) {
    this.debrief.detailednotesattachment = attachmentArray;
  };

  getDetailedNotesAttachmentForDisplay() {
    return this.debrief.detailedNotesAttachmentForDisplay;
  };
  setDetailedNotesAttachmentForDisplay(attachmentArray: any[]) {
    this.debrief.detailedNotesAttachmentForDisplay = attachmentArray;
  };

  getWorkFlowID() {
    return this.workFlowID;
  }
  setWorkFlowID(workFlowID) {
    this.workFlowID = workFlowID;
  }

  getHeaderNav() {
    return this.confirmBackToRoot;
  }
  setHeaderNav(value) {
    this.confirmBackToRoot = value;
  }

  getCurrentSDRTabIndex() {
    return this.sdrTabIndex;
  }

  getPreviousSDRTabIndex() {
    return this.previousTabIndex;
  }

  setCurrentSDRTabIndex(value) {
    if (this.sdrTabIndex != value) {
      this.previousTabIndex = this.sdrTabIndex;
      this.sdrTabIndex = value;
    }
  }
  /**
   *@author Prateek 02/26/2019
   *Getter and setter for latest app version
   */

  getAppVersion() {
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get('latestAppVersionData').then((value: any) => {
          this.logger.log(this.fileName, 'getAppVersion', 'getAppVersion : ' + JSON.stringify(value));
          resolve(value);
        }).catch((error: any) => {
          resolve(false);
          this.logger.log(this.fileName, 'getAppVersion', 'Error in getAppVersion : ' + JSON.stringify(error));
        });
      })
    })
  }

  setAppVersionData(value) {
    this.storage.ready().then(() => {
      this.storage.set('latestAppVersionData', value);

    })
  }

  /**
 * Gets the World Area ID from User preference
 *
 * @returns
 * @memberof ValueProvider
 */
  getWorldAreaId() {
    return this.user_prefArray.length > 0 ? this.user_prefArray[0].WorldAreaID : null;
  }

  /**
    * Preeti Varshney 03/29/2019
    * Total hours of one week
    */
  getTotalHours() {
    return this.TotalHours;
  }
  setTotalHours(totalhours) {
    this.TotalHours = totalhours
  }
  /**
  * Prateek 04/12/2019
  * Total hours of one week
  */
  getTotaltimeChecked() {
    return this.timeArr;
  }
  setTotaltimeChecked(timeArr) {
    this.timeArr = timeArr
  }
  setaccsToken(accstoken) {
    this.accsToken = accstoken;
  }
  getAccsToken() {
    return this.accsToken;
  }


  setJobIdToSubmit(taskId) {
    this.taskIdtoSubmit = taskId;
  }

  getJobIdToSubmit() {
    return this.taskIdtoSubmit;
  }

  setSyncStatus(syncStatus) {
    this.syncStatus = syncStatus;
  }

  getSyncStatus() {
    return this.syncStatus;
  };

  setPressureType(type) {
    this.pressureType = type;
  }

  getPressureType() {
    return this.pressureType;
  }

  // setReportID(ReportID) {
  //   this.ReportID = ReportID;
  // }

  // getReportID() {
  //   return this.ReportID;
  // }
  setDeviceType(ID) {
    this.DeviceType = ID;
  }

  getDeviceType() {
    return this.DeviceType;
  }
  getSelectedprocess() {
    return this.Selected_Process;
  }
  setSelectedprocess(selectedprocess) {
    this.Selected_Process = selectedprocess;
  }
  getFdo() {
    return this.fdo;
  }
  setFdo(fdo) {
    this.fdo = fdo;
  }

  setCheckForNotesPopup(check) {
    this.notePopup = check;
  }
  getCheckForNotesPopup() {
    return this.notePopup;
  }
  /**
    * Preeti Varshney 10/14/2019
    * Check for OSC Non-Clarity User
    */
  isOSCNonClarityUser() {
    return this.resourceId.toString() != '0' && this.getUser().ClarityID == '';
  }
  /**
    * Preeti Varshney 10/14/2019
    * Check for OSC Clarity User
    */
   isOSCClarityUser() {
    return this.resourceId.toString() != '0' && this.getUser().ClarityID == '';
  }
  /**
    * Preeti Varshney 10/14/2019
    * Check for Non-OSC Clarity User
    */
   isNonOSCNonClarityUser() {
    return this.resourceId.toString() == '0' && this.getUser().ClarityID == '';
  }
}
