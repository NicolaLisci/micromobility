import { AfterContentInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { MapService } from '../services/map.service';
import { BluetoothService } from '../services/bluetooth.service';
import { Observable } from 'rxjs';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import { GeoJSONSource } from 'mapbox-gl';
import { PubNubAngular } from 'pubnub-angular2';
import { ApiService } from '../services/api.service';
import { mapboxDrawOptions } from '../models/mapboxDraw.model';

declare let eon: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  
  public coords;
  public userId;
  
  public instructions = new Observable<any>();
  
  constructor(
    private mapService: MapService,
    private alertController: AlertController
    ) {
    }
    
    ngOnInit(): void {
      this.coords = this.mapService.coords;
      this.userId = JSON.parse(localStorage.getItem('user'))?.uid;  
      this.instructions = this.mapService.instructions.asObservable();
    }
    
    async getIsochrone() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Inserisci autonomia',
        inputs: [
          {
            name: 'km',
            type: 'text',
            placeholder: 'Km'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
              this.mapService.getIsochrone(data.km);
            }
          }
        ]
      });
      
      await alert.present();
    }
  }
  