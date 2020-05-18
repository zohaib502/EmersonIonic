import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { TransformProvider } from '../../../../providers/transform/transform';
import { LoggerProvider } from '../../../../providers/logger/logger';
import { ValueProvider } from "../../../../providers/value/value";
import { UtilityProvider } from '../../../../providers/utility/utility';
import * as Enums from '../../../../enums/enums';
@IonicPage()
@Component({
  selector: 'page-material-modal',
  templateUrl: 'material-modal.html',
})
export class MaterialModalPage {
  // materialObj: any = {
  //   Charge_Type: ""
  // };
  chargeMethod: any = [];
  materialObj: any = [];
  Serial_Type: any = { Serial_In: "", Serial_Out: "", Serial_Number: "" };
  serial_Item: any[] = [];
  ifEdit: any;
  ifCopy: any;
  UOM: any[] = [{ "ID": 7, "Value": "EA", "ResourceId": this.valueService.getResourceId() }];
  fileName: any = 'Material_Modal';
  showSelects: boolean = true;
  originalMaterial: any = [];
  materialArrayClone: any = {};
  enums: any;
  ItemName: any;
  Description: any;
  Product_Quantity: any;
  Charge_Type_Id: any;
  Charge_Type: any;
  UOM_value: any;
  deletedMaterialSerialArray: any[] = [];
  cloneMaterialObj: any[] = [];
  lastMaterialObj: any[] = [];
  updateAllRows: boolean = false;
  updateMaterialSerials: boolean = false;
  updatedMaterialSerialId: any[] = [];
  changedValue: any;


  constructor(public valueService: ValueProvider, public events: Events, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public transformProvider: TransformProvider, public logger: LoggerProvider, public utilityProvider: UtilityProvider) {
    this.enums = Enums;
    this.events.subscribe('langSelected', (res) => {
      // 10-12-18 Radheshyam - the dom will refresh and show the current language in dropbox.
      setTimeout(() => {
        this.showSelects = false;
        setTimeout(() => { this.showSelects = true }, 1)
      }, 500);
    });
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.chargeMethod = this.navParams.get('chargeType');
    this.cloneMaterialObj = this.navParams.get('material');
    this.cloneMaterialObj.forEach(item => {
      this.materialObj.push(Object.assign(Object.create(item), item));
    });
    this.materialObj.reverse();
    this.ifEdit = this.navParams.get('ifEdit');
    this.ifCopy = this.navParams.get('ifCopy');
    this.originalMaterial = this.navParams.get('originalMaterial');
    this.loadData();
  }

  loadData() {
    this.ItemName = this.materialObj[0].ItemName;
    this.Description = this.materialObj[0].Description;
    this.Product_Quantity = this.materialObj.length;
    this.Charge_Type_Id = this.materialObj[0].Charge_Type_Id;
    this.Charge_Type = this.materialObj[0].Charge_Type;
    this.UOM_value = this.materialObj[0].UOM;
  }

  addSerialItem(index) {
    this.Product_Quantity++;
    let copy;
    if (this.Product_Quantity == 1) {
      copy = Object.assign(Object.create(this.lastMaterialObj[0]), this.lastMaterialObj[0]);
    } else {
      copy = Object.assign(Object.create(this.materialObj[0]), this.materialObj[0]);
    }
    copy.Material_Serial_Id = copy.Material_Id + "#" + String(this.utilityProvider.getUniqueKey());
    copy.Serial_In = null;
    copy.Serial_Out = null;
    this.materialObj.push(copy);
  }

  deleteSerialItem() {
    if (this.Product_Quantity > 0) {
      this.Product_Quantity--;
      this.deletedMaterialSerialArray.push(this.materialObj[this.materialObj.length - 1].Material_Serial_Id);
      this.materialObj.splice(this.materialObj.length - 1, 1);
      if (this.materialObj.length == 1) {
        this.lastMaterialObj.push(Object.assign(Object.create(this.materialObj[0]), this.materialObj[0]));
      }
    }
  }

  save() {
    if (this.ifCopy) {
      this.saveCopyMaterialSerial().then((res: any) => {
        this.viewCtrl.dismiss(this.materialObj);
      });
    } else {
      this.saveEditMaterialSerial().then((res: any) => {
        let params = {
          materialObj: this.materialObj,
          updatedMaterialSerialId: this.updatedMaterialSerialId,
          updateAllRows: this.updateAllRows,
          isChange: this.isChange,
          deletedMaterialSerialArray: this.deletedMaterialSerialArray
        }
        this.viewCtrl.dismiss(params);
      });
    }
  }

  setSerialItem(event) {
    this.materialObj.map((item) => {
      item.Serial_In = null;
      item.Serial_Out = null;
    })
  }

  setChargeTypeName(value) {
    this.isMaterialChange();
    let filtered = this.chargeMethod.filter(item => {
      return item.ID == value;
    })[0];
    if (filtered != undefined) {
      this.Charge_Type = filtered.Value;
    }
  }

  isMaterialChange() {
    this.updateAllRows = true;
  }

  changeValue(event: any) {
    this.changedValue = event;
  }

  isChange(id) {
    this.updateMaterialSerials = true;
    if (this.changedValue ? this.changedValue.ngControl.dirty : false) {
      this.updatedMaterialSerialId.push(id);
      this.updatedMaterialSerialId = this.utilityProvider.removeDuplicateItemFromArray(this.updatedMaterialSerialId);
      this.changedValue = '';
    }
  }

  saveCopyMaterialSerial() {
    let material_id = String(this.utilityProvider.getUniqueKey());
    return new Promise((resolve, reject) => {
      this.materialObj.forEach(item => {
        item.Material_Serial_Id = material_id + "#" + String(this.utilityProvider.getUniqueKey());
        item.IsAdditional = this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_Started ? "false" : "true";
        item.Charge_Type = this.Charge_Type;
        item.Charge_Type_Id = this.Charge_Type_Id;
        item.Description = this.Description;
        item.ItemName = this.ItemName;
        item.Product_Quantity = this.Product_Quantity;
        item.CurrentMobileId = null;
        item.Original = null;
        item.DebriefStatus = this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_Started ? Enums.DebriefStatus.Submitted : Enums.DebriefStatus.ReSubmitted
        item.Material_Id = material_id;
      })
      resolve(true);
    }).catch((err: any) => {
      this.logger.log(this.fileName, 'saveCopyMaterialSerial', 'error in promise' + JSON.stringify(err));
    })
  }

  saveEditMaterialSerial() {
    return new Promise((resolve, reject) => {
      this.materialObj.forEach(item => {
        if (this.updateAllRows || (this.updateMaterialSerials && this.updatedMaterialSerialId.indexOf(item.Material_Serial_Id) > -1)) {
          if (this.valueService.getTask().StatusID == Enums.Jobstatus.Debrief_Declined && item.Sync_Status != "true" && item.Original) {
            item.IsAdditional = "true";
          }
          item.Charge_Type = this.Charge_Type;
          item.Charge_Type_Id = this.Charge_Type_Id;
          item.Description = this.Description;
          item.ItemName = this.ItemName;
          item.Product_Quantity = '1';
          item.Original = item.Original ? item.Original : null;
        }
      });
      resolve(true);
    })
  }

}
