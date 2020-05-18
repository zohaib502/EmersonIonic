import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, Events } from 'ionic-angular';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { ValueProvider } from "../../../providers/value/value";
import { TransformProvider } from '../../../providers/transform/transform';
import { LoggerProvider } from '../../../providers/logger/logger';
import { UtilityProvider } from '../../../providers/utility/utility';
import * as Enums from '../../../enums/enums';
// import * as moment from "moment";
/**
 * Generated class for the MaterialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-material',
  templateUrl: 'material.html',
})
export class MaterialPage {

  chargeMethod: any = [];
  Serial_Type: any = { Serial_In: "", Serial_Out: "", Serial_Number: "" };
  serial_Item: any[] = [];
  serial_Number: any[] = [];
  serial_Out: any[] = [];
  serial_In: any[] = [];
  UOM: any[] = [{ "ID": 7, "Value": "EA", "ResourceId": "178" }];
  materialArray: any = {};
  materialArrayClone: any = {};
  materialSerialData: any = {};
  materialSerialArr: any = [];
  materialObject: any = {
    Charge_Type: "",
    Product_Quantity: "0",
    ItemName: '',
    UOM: this.UOM[0].Value,
    SerialArray: []
  };
  serial_Items: any[] = [];
  public editMaterialObj: any = {};
  public copyMaterialObj: any = {};
  fileName: any = 'Material_Page';
  showSelects: boolean = true;
  enums: any;
  disableAddButtonOnceClick: boolean = true;
  _taskObj: any;
  showSDRBtn: any;

  constructor(public utilityProvider: UtilityProvider, public events: Events, public navCtrl: NavController, public localService: LocalServiceProvider, public valueService: ValueProvider, public modalController: ModalController, public transformProvider: TransformProvider, public logger: LoggerProvider) {
    //10/05/2018 kamal : declared enums object to use in html 
    this.enums = Enums;
    this._taskObj = this.valueService.getTask();
  }

  ionViewDidEnter() {
    //11/04/2019 -- Mayur Varshney -- apply condition if viewCtrl relates to SDRTabsPage or DebriefPage
    if (this.navCtrl.parent.viewCtrl.id != "DebriefPage") return;
    // this.utilityProvider.showSpinner();
    this.loadData();
    //Prateek(23/01/2019) Shifted all events in didenter. 
    this.events.subscribe('refreshPageData', (time) => {
      this.logger.log(this.fileName, " MaterialPage constructor", 'refreshPageData' + time);
      let taskobj = this.valueService.getTaskList().filter((item => { return item.Task_Number == this.valueService.getTaskId() }))[0];

      this.valueService.setTask(taskobj).then(() => {
        this.loadData();
      }).catch((err: any) => {
        this.logger.log(this.fileName, 'Page constructor', 'setTask' + JSON.stringify(err));
      });
    });
    this.events.subscribe('langSelected', (res) => {
      // 10-12-18 Radheshyam - the dom will refresh and show the current language in dropbox.
      setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
    this.setDefaultMaterialObject();
  }

  // 04-02-2019 -- Mayur Varshney -- optimize code
  loadData() {
    this.getChargeMethod();
    this.getMaterialSerial();
    if (this.valueService.getTask().Material_Method) {
      this.materialObject.Charge_Type_Id = this.valueService.getTask().Material_Method ? this.chargeMethod.filter(item => {
        return item.Value == this.valueService.getTask().Material_Method;
      })[0].ID : '';
      this.materialObject.Charge_Type = this.valueService.getTask().Material_Method;
    }
    this.utilityProvider.stopSpinner();
  }

  gottoExpense() {
    this.navCtrl.parent.select(2);
    this.valueService.setMaterial(this.materialArray);
    this.valueService.setMaterialForDisplay(this.materialArray);
  }

  gottoNotes() {
    this.navCtrl.parent.select(4);
    this.valueService.setMaterial(this.materialArray);
    this.valueService.setMaterialForDisplay(this.materialArray);
  }

  trackByIndex(index, item) {
    return item.name;
  }

  setDefaultMaterialObject() {
    this.setChargeTypeName(this.materialObject.Charge_Type);
    //this.materialObject.Charge_Type = "";
    this.materialObject.Description = "";
    this.materialObject.ItemName = "";
    this.materialObject.Product_Quantity = "0";
    this.materialObject.SerialArray = [];
    this.serial_Item = [];
    this.serial_Number = [];
    this.serial_Out = [];
    this.serial_In = [];
    this.materialObject.Charge_Type_Id = this.valueService.getTask().Material_Method ? this.chargeMethod.filter(item => {
      return item.Value == this.valueService.getTask().Material_Method;
    })[0].ID : '';
    this.logger.log(this.fileName, 'setDefaultMaterialObject', 'setDefaultMaterialObject done');
  }

  setChargeTypeName(value) {
    //this.materialObject.Charge_Type = '';
    let filtered = this.chargeMethod.filter(item => {
      return item.ID == value;
    })[0];

    if (filtered != undefined) {
      this.materialObject.Charge_Type = filtered.Value;
    }
  }

  //04/02/2019 -- Mayur Varshney -- optimise code
  setSerialItem(event) {
    this.serial_Item.map(element => {
      element.Serial_In = null;
      element.Serial_Out = null;
      element.Serial_Number = null;
    });
  }

  getChargeMethod() {
    //12/14/2018 Zohaib Khan: Filtering charge method with no non-billable option.
    this.chargeMethod = this.valueService.getChargeMethod().filter(item => {
      return item.Value != "Non-Billable";
    });
  };

  //04/02/2019 -- Mayur Varshney -- optimise code
  addSerialItem(index) {
    this.disableAddButtonOnceClick = false;
    this.materialObject.Product_Quantity++;
    let copy = Object.assign({}, this.Serial_Type);
    copy.Material_Serial_Id = String(this.utilityProvider.getUniqueKey());
    this.serial_Item.push(copy);
    // this.materialObject.SerialArray.push(copy);
  }

  //04/02/2019 -- Mayur Varshney -- optimise code
  deleteSerialItem() {
    if (this.materialObject.Product_Quantity > 0) {
      this.materialObject.Product_Quantity--;
      this.disableAddButtonOnceClick = false;
      this.serial_Item.splice(this.serial_Item.length - 1, 1);
      // this.materialObject.SerialArray.splice(this.materialObject.SerialArray.length - 1, 1);
    }
    else {
      this.disableAddButtonOnceClick = true;
    }
  }

  /**
   * get material and group by on the basis of Material_Id
   * set final data in valueProvider
   * @memberOf MaterialPage
   * @author Mayur Varshney
   */
  getMaterialSerial() {
    try {
      // this.utilityProvider.showSpinner();
      this.localService.getMaterialSerialList(this.valueService.getTaskId()).then((res: any[]) => {
        this.materialArrayClone = this.utilityProvider.groupBy(res.reverse(), function (item) {
          return [item.Material_Id];
        });
        this.materialArray = this.materialArrayClone;
        this.valueService.setMaterial(this.materialArray);
        this.valueService.setMaterialForDisplay(this.materialArray);
        this.utilityProvider.stopSpinner();
      }).catch((error: any) => {
        this.logger.log(this.fileName, 'getMaterialSerial', 'Error in getMaterialSerialList: ' + JSON.stringify(error));
        this.utilityProvider.stopSpinner();
      })
    } catch (error) {
      this.logger.log(this.fileName, 'getMaterialSerial', 'Error: ' + JSON.stringify(error));
      this.utilityProvider.stopSpinner();
    }
  }

  /**
  * add multiple material serial data with respect to common material_id(randomly generated)
  * create MaterialSerialUniqueMobileId by concat material_id and material_serial_id via '#' delimeter
  * @memberOf MaterialPage
  * @author Mayur Varshney
  */
  addMaterial() {
    let matArr = [];
    if (!this.disableAddButtonOnceClick) {
      this.disableAddButtonOnceClick = true;
      let newObject: any = {
        Material_Id: String(this.utilityProvider.getUniqueKey()),
        Charge_Type: this.materialObject.Charge_Type ? this.materialObject.Charge_Type : null,
        Charge_Type_Id: this.materialObject.Charge_Type_Id ? this.materialObject.Charge_Type_Id.toString() : null,
        Description: this.materialObject.Description ? this.materialObject.Description : null,
        ItemName: this.materialObject.ItemName ? this.materialObject.ItemName : null,
        Product_Quantity: this.materialObject.Product_Quantity ? this.materialObject.Product_Quantity : null,
        Task_Number: this.valueService.getTaskId(),
        ResourceId: this.valueService.getResourceId(),
        UOM: "EA",
        Original: null,
        DebriefStatus: this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_Started ? Enums.DebriefStatus.Submitted : Enums.DebriefStatus.ReSubmitted,
        IsAdditional: this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_Started ? "false" : "true",
        OracleDBID: this.valueService.getUserId(),
        Serial_Number: null,
        materialDefault: null
      };

      if (this.valueService.getTask().Material_Method) {
        if (newObject.Charge_Type_Id == this.chargeMethod.filter(item => {
          return item.Value == this.valueService.getTask().Material_Method;
        })[0].ID) {
          newObject.Charge_Type = this.valueService.getTask().Material_Method;
        }
      }

      for (let i = 0; i < newObject.Product_Quantity; i++) {
        let newObj: any = Object.assign({}, newObject);
        newObj.Material_Serial_Id = newObj.Material_Id + "#" + this.serial_Item[i].Material_Serial_Id;
        newObj.Serial_In = this.serial_Item[i].Serial_In ? this.serial_Item[i].Serial_In : null;
        newObj.Serial_Out = this.serial_Item[i].Serial_Out ? this.serial_Item[i].Serial_Out : null;
        matArr.push(newObj);
      }
      this.addMaterialInDB(matArr);
    }
  }

  /**
  * copy material data via material modal
  * insert material serial rows in MST_Material table
  * @param material
  * @memberOf MaterialPage
  * @author Mayur Varshney
  */
  copyMaterial(copy_material, index) {
    let copy_var = Object.assign(Object.create(copy_material), copy_material);
    let copyMaterialParams = {
      chargeType: this.chargeMethod,
      material: copy_var,
      ifCopy: 'Copy'
    };
    let materialModal = this.modalController.create('MaterialModalPage', copyMaterialParams, { enableBackdropDismiss: false, cssClass: 'MaterialModalPage' });
    materialModal.onDidDismiss(data => {
      if (data != undefined) {
        this.addMaterialInDB(data);
      }
    });
    materialModal.present();
  }

  /**
  * insert material serial rows in MST_Material table
  * @param material
  * @memberOf MaterialPage
  * @author Mayur Varshney
  */
  addMaterialInDB(material) {
    let self = this;
    try {
      this.localService.addOrInsertMaterial(material)
      this.setDefaultMaterialObject();
      this.getMaterialSerial();
    } catch (err) {
      self.logger.log(self.fileName, 'addMaterialInDB', 'Error in insertMaterialSerialData : ' + err);
    };
  }

  //04/02/2019 -- Mayur Varshney -- optimise code
  editMaterial(material, index) {
    let promiseArr = [];
    if ((this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_Declined) && material[0].Original) {
      promiseArr.push(this.localService.getMaterialSerialOriginalRow(material[0].Original));
    }
    Promise.all(promiseArr).then((res: any[]) => {
      let edit_var: any = [];
      edit_var = Object.assign(Object.create(material), material);
      let params = {
        originalMaterial: (res[0] && res[0].length > 0) ? Object.assign(Object.create(res[0]), res[0]) : [],
        chargeType: this.chargeMethod,
        material: edit_var,
        ifEdit: 'Edit'
      };
      this.openEditModal(params, material, index);
    }).catch((error) => {
      this.logger.log(this.fileName, "editMaterial", "Error in Promise.all: " + JSON.stringify(error));
    });
  }

  //04/02/2019 -- Mayur Varshney -- optimise code
  openEditModal(editMaterialParams, material, index) {
    let modalClass = editMaterialParams.originalMaterial.length > 0 ? 'MaterialModalPageWithOriginalEntry' : 'MaterialModalPage';
    let materialModal = this.modalController.create('MaterialModalPage', editMaterialParams, { enableBackdropDismiss: false, cssClass: modalClass });
    materialModal.onDidDismiss(data => {
      if (data != undefined) {
        // if (!data.updateAllRows) {
        //   this.editMaterialObj = data.materialObj.filter((item) => {
        //     return data.updatedMaterialSerialId.indexOf(item.Material_Serial_Id) > -1;
        //   })
        // } else {
        //   this.editMaterialObj = data.materialObj;
        // }
        this.editMaterialObj = data.materialObj;
        if (this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_Declined && (editMaterialParams.originalMaterial.length == 0) && data.materialObj[0].Sync_Status == 'true') {
          this.createNewMaterialRows().then((res: any) => {
            this.localService.addOrInsertMaterial(res.newRow);
            this.getMaterialSerial();
            // }).catch((err: any) => {
            //   this.logger.log(this.fileName, 'openEditModal', 'Error in addOrInsertMaterial : ' + JSON.stringify(err));
            // });
          }).catch((err: any) => {
            this.logger.log(this.fileName, 'openEditModal', 'Error in createNewMaterialRows :' + JSON.stringify(err));
          });
        } else {
          this.localService.addOrInsertMaterial(this.editMaterialObj);
          data.deletedMaterialSerialArray.forEach(element => {
            this.localService.deleteMaterialSerialRow(element);
          });
          this.getMaterialSerial();
        }
      }
    });
    materialModal.present();
  }


  /**
   * On edit original material create additional rows w.r.t original material rows in case of Debrief Declined
   * @returns 
   * @memberOf MaterialPage
   * @author Mayur Varshney
   */
  createNewMaterialRows() {
    return new Promise((resolve, reject) => {
      let tempArr: any = {
        newRow: [],
        originalRow: []
      };
      try {
        let materialId = String(this.utilityProvider.getUniqueKey())
        this.editMaterialObj.forEach(element => {
          let newObj = Object.assign(Object.create(element), element);
          newObj.Material_Id = materialId;
          newObj.Material_Serial_Id = newObj.Material_Id + "#" + String(this.utilityProvider.getUniqueKey())
          newObj.Original = element.Material_Serial_Id;
          newObj.CurrentMobileId = null;
          newObj.IsAdditional = true;
          element.CurrentMobileId = newObj.Material_Serial_Id;
          tempArr.newRow.push(newObj);
          tempArr.originalRow.push(element);
        });
        resolve(tempArr);
      } catch (error) {
        this.logger.log(this.fileName, 'createNewMaterialRows', 'Error in try-catch :' + error.message);
        reject(error);
      }
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'createNewMaterialRows', 'Error in promise :' + JSON.stringify(err));
      return Promise.reject(err)
    });
  }

  //04/02/2019 -- Mayur Varshney -- optimise code
  deleteObject(material, index) {
    for (let i = 0; i < this.materialArray.length; i++) {
      if (index == i) {
        this.materialArray.splice(index, 1);
      }
    }
    this.localService.deleteMaterialSerialList(material[0].Material_Id).then(() => {
      this.getMaterialSerial();
    });
  }

  /** 
   * @author Gurkirat Singh
   * 03-28-2019 Gurkirat Singh : Publish an event to navigate to SDR Flow
   *
   * @memberof MaterialPage
   */
  gotoSDR() {
    this.events.publish("gotoSDR");
  }

  /**
  *@author: Prateek(21/01/2019)
  *Unsubscribe all events.
  *App Optimization
  * @memberof CalendarPage
  */
  ionViewWillLeave(): void {
    this.events.unsubscribe('refreshPageData');
    this.events.unsubscribe('langSelected');
  }

}




