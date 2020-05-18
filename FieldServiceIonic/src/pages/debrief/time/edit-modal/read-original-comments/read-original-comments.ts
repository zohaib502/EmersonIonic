import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-read-original-comments',
  templateUrl: 'read-original-comments.html',
})
export class ReadOriginalCommentsPage {
  comment:any="";
  
  constructor(public events: Events, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public platform: Platform) {

  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.comment = this.navParams.get('commentText');
    }

}
