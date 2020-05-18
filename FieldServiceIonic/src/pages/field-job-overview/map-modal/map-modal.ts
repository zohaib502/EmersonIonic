import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ValueProvider } from '../../../providers/value/value';
import { LocalServiceProvider } from '../../../providers/local-service/local-service';
import { LoggerProvider } from '../../../providers/logger/logger';

declare let google: any;
declare let L: any;
declare let BMap: any;

@IonicPage()
@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html',
})
export class MapModalPage {

  public isChina: boolean;
  public isBaidu: boolean;
  public taskList: any;
  public customerAddress: any;
  @ViewChild('googleMap') googleMapElement: ElementRef;
  @ViewChild('baiduMap') baiduMapElement: ElementRef;
  @ViewChild('questMap') questMapMapElement: ElementRef;
  public geoCoder: any;
  public first: any;
  public ifNotes: any;
  public notes: any;
  public notesType: any;
  fileName: any = 'Field_Job_Overview_Modal';

  constructor(public navCtrl: NavController, public navParams: NavParams, public valueService: ValueProvider, public localService: LocalServiceProvider, public viewCtrl: ViewController, public logger: LoggerProvider) {
  }

  ionViewDidEnter() {
    this.ifNotes = this.navParams.get('ifNotes');
    this.notes = this.navParams.get('Notes');
    this.notesType = this.navParams.get('NotesType');
    this.taskList = this.valueService.getTask();
    if (!this.ifNotes) {
      this.setValues().then(res => {
        this.visibleMap();
      }).catch((error: any) => {
        // 12-28-2018 -- Mansi Arora -- change in logs comment
        this.logger.log(this.fileName, 'ionViewDidLoad', 'Error in ionViewDidLoad : ' + JSON.stringify(error));
      });
    }
  }

  setValues() {
    return new Promise((resolve, reject) => {
      if (this.taskList.Country == "People's Republic of China" || this.taskList.Country.toLowerCase() == "china") {
        this.isChina = true;
        if (this.taskList.Street_Address != "") {
          this.customerAddress = this.taskList.Street_Address + "," + this.taskList.City;
          // 12-28-2018 -- Mansi Arora -- commenting logged data
          // this.logger.log(this.fileName, 'setValues', this.customerAddress);
        } else {
          this.customerAddress = this.taskList.City;
          // 12-28-2018 -- Mansi Arora -- commenting logged data
          // this.logger.log(this.fileName, 'setValues', this.customerAddress);
        }

        if (this.customerAddress.match(/[\u3400-\u9FBF]/)) {
          this.isBaidu = true;
        } else {
          this.isChina = false;
          if (this.first == undefined) {
            this.first = true;
          } else {
            this.googleMap();
          }
        }
        resolve(true);
      } else {
        this.isChina = false;
        if (this.first == undefined) {
          this.first = true;
        } else {
          this.googleMap();
        }
        resolve(true);
      }
    });
  }

  visibleMap() {
    if (this.isChina) {
      this.logger.log(this.fileName, 'visibleMap', "china map should shown");
      this.isBaidu ? this.baiduMap() : this.questMap();
    } else {
      this.logger.log(this.fileName, 'visibleMap', "Google map should shown");
      if (this.first) {
        this.googleMap();
        this.first = false;
      }
    }
  }

  googleMap() {
    let self = this;
    if (google != undefined) {
      const map = new google.maps.Map(this.googleMapElement.nativeElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 12
      });
      if (map != null) {

        this.geoCoder = new google.maps.Geocoder();
        this.geoCoder.geocode({
          // 12-04-2019 -- Mayur Varshney -- Change the address to find the pointer accurately
          'address': self.taskList.Address1 + " ," + self.taskList.City + " ," + self.taskList.Zip_Code + " ," + self.taskList.Country
        }, function (results, status) {
          try {
            if (results.length > 0) {
              // 12-28-2018 -- Mansi Arora -- commenting logged data
              // self.logger.log(self.fileName, 'googleMap', results);
              if (status == google.maps.GeocoderStatus.OK) {
                let latitude = results[0].geometry.location.lat();
                let longitude = results[0].geometry.location.lng();
                let latlng = new google.maps.LatLng(latitude, longitude);
                map.setCenter(latlng);
                map.setCenter(results[0].geometry.location);
                new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location
                });
              } else {
                self.logger.log(self.fileName, 'googleMap', "GOOGLE GEOCODER ERROR");
              }
            }
            else {
              if (self.taskList.City || self.taskList.Zip_Code) {
                self.geoCoder = new google.maps.Geocoder();
                self.geoCoder.geocode({
                  'address': self.taskList.City + "," + self.taskList.Zip_Code
                }, function (results, status) {
                  if (results.length > 0) {
                    // 12-28-2018 -- Mansi Arora -- commenting logged data
                    // self.logger.log(self.fileName, 'googleMap', results);
                    if (status == google.maps.GeocoderStatus.OK) {
                      let latitude = results[0].geometry.location.lat();
                      let longitude = results[0].geometry.location.lng();
                      let latlng = new google.maps.LatLng(latitude, longitude);
                      map.setCenter(latlng);
                      map.setCenter(results[0].geometry.location);
                      new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                      });
                    } else {
                      self.logger.log(self.fileName, 'googleMap', "GOOGLE GEOCODER ERROR");
                    }
                  } else {
                    self.logger.log(self.fileName, 'googleMap', "Address Not found");
                    // this.utilityProvider.presentToastButtom('Address not found', '4000', 'top', '', 'OK');
                  }
                })
              } else {
                self.logger.log(self.fileName, 'googleMap', "Address Not found");
              }
            }
          } catch (err) {
            self.logger.log(self.fileName, 'googleMap', `Error: ${err.message}`);
          }
        });

      }
    }
  }

  baiduMap() {
    // 12-28-2018 -- Mansi Arora -- commenting logged data
    // this.logger.log(this.fileName, 'baiduMap', "CUSTOMER ADDRESS" + this.customerAddress);
    if (BMap != undefined) {
      // let address;
      let map = new BMap.Map(this.baiduMapElement.nativeElement);
      // let address = this.taskList.Street_Address;
      let geoCoder = new BMap.Geocoder();
      let longitude = 118.807395;
      let latitude = 32.065315;
      // let contextMenu = new BMap.ContextMenu();
      map.enableScrollWheelZoom();
      map.enableKeyboard()
      map.disableDoubleClickZoom();
      map.addControl(new BMap.NavigationControl());
      geoCoder.getPoint(this.customerAddress, function (point) {
        if (point) {
          longitude = point.lng;
          latitude = point.lat;
        }
        let pointer = new BMap.Point(longitude, latitude);
        map.centerAndZoom(pointer, 14);
        let myIcon = new BMap.Icon("assets/imgs/icons/map-marker.png", new BMap.Size(15, 25));
        let marker = new BMap.Marker(pointer, { icon: myIcon });
        map.addOverlay(marker);
      });
    }
  }

  questMap() {
    if (L != undefined) {
      L.mapquest.key = 'E1jRKUfN0osMSzrInmuAH2glsmHmneU3';
      this.geoCoder = new google.maps.Geocoder();
      this.geoCoder.geocode({
        'address': this.taskList.Street_Address + "," + this.taskList.City + "," + this.taskList.Zip_Code
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          let latitude = results[0].geometry.location.lat();
          let longitude = results[0].geometry.location.lng();
          // let latlng = new google.maps.LatLng(latitude, longitude);
          this.map = L.mapquest.map('map', {
            center: [latitude, longitude],
            layers: L.mapquest.tileLayer('map'),
            zoom: 14
          });
          let customIcon = L.mapquest.icons.circle({
            primaryColor: '#3b5998'
          });
          L.marker([latitude, longitude], { icon: customIcon }).addTo(this.map);
        }
      });
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
