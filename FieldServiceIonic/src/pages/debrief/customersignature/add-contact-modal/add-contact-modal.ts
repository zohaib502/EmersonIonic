import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LocalServiceProvider } from '../../../../providers/local-service/local-service';
import { ValueProvider } from '../../../../providers/value/value';

@IonicPage()
@Component({
  selector: 'page-add-contact-modal',
  templateUrl: 'add-contact-modal.html',
})
export class AddContactModalPage {

  firstName:any;
  lastName:any;
  contact_email:any;
  office_phone:any;
  isCorrect: boolean = true;

  contactObject: any = {
    Customer_Id:"",
    Customer_Name: "",
    Contact_Name:"",
    Home_Phone:"",
    Mobile_Phone:"",
    Fax_Phone:"",
    Office_Phone:"",
    Email:"",
    Task_Number:"",
    Start_Date:"",
    End_Date:"",
    Default_Value:"",
    ResourceId:"",
    First_Name:"",
    Last_Name:"",

 }

  constructor(public valueProvider: ValueProvider,public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public localService: LocalServiceProvider) {
  }

  ionViewDidLoad() {
    this.contactObject.Customer_Name=this.valueProvider.getContact()[0].Customer_Name
    this.contactObject.Task_Number=this.valueProvider.getTaskId();
    this.contactObject.ResourceId=this.valueProvider.getResourceId();

    
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  validateEmail(email) {
    let condition = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    this.isCorrect = condition.test(email);
    return condition.test(email);
  }

  public save() {
    this.contactObject.First_Name=this.firstName;
    this.contactObject.Last_Name=this.lastName;
    this.contactObject.Contact_Name=this.firstName+" "+this.lastName;
    this.contactObject.Email=this.contact_email;
    this.contactObject.Office_Phone=this.office_phone;
    this.viewCtrl.dismiss(this.contactObject);
  }



}
