import { AfterContentInit, Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  
  constructor(
    private geolocation: Geolocation,
    private alertController: AlertController,
    private mapService: MapService
    ) {}
    
    
    map: mapboxgl.Map;
    style = 'mapbox://styles/mapbox/light-v10';
    // lat = 39.03437700146109;
    // lng = 8.999600913492351;
    
    
    coordinates= {
      latitude: 0,
      longitude: 0
    };
    
    ngOnInit(): void {
      
      mapboxgl.accessToken = environment.mapbox.accessToken;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 15,
        // center: [this.lng, this.lat]
      });
      
      console.log(this.map);
      this.map.on('load', ()=>{
        this.map.addSource('iso', {
          type: 'geojson',
          data: {
            'type': 'FeatureCollection',
            'features': []
          }
        });

        this.map.addLayer(
          {
            'id': 'isoLayer',
            'type': 'fill',
            'source': 'iso',
            'layout': {},
            'paint': {
              'fill-color': '#5a3fc0',
              'fill-opacity': 0.3
            }
          },
          'poi-label'
        );
        
      });
      
      this.addUserLocation();
      this.getUserLocation();
      
      
      //  [39.0355800, 9.0003961]
      // var el = document.createElement('div');
      // el.className = 'marker';
      
      // make a marker for each feature and add to the map
      // new mapboxgl.Marker(el)
      // .setLngLat([9.0003961, 39.0355800])
      // .addTo(this.map);
      
      // this.addDeviceInMap();
      
      // this.map.addControl(new mapboxgl.NavigationControl());
    }
    
    getIsochrone(){
      this.mapService.getIsochrone(this.coordinates, 10).subscribe((res)=>{
        console.log(res);
        this.map.getSource('iso').setData(res);
      })
    }
    
    onStartClick(){
      this.presentAlertPrompt();
    }
    
    async presentAlertPrompt() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Inserisci autonomia',
        inputs: [
          {
            name: 'name1',
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
            handler: () => {
              console.log('ok')
              this.getIsochrone();
            }
          }
        ]
      });
      
      await alert.present();
    }
    
    addUserLocation(){
      this.map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
        );
      }
      
      getUserLocation(){
        this.geolocation.getCurrentPosition().then((resp) => {
          this.coordinates.latitude = resp.coords.latitude;
          this.coordinates.longitude = resp.coords.longitude
        }).catch((error) => {
          console.log('Error getting location', error);
        });
        
        let watch = this.geolocation.watchPosition();
        watch.subscribe((data:any) => {
          this.coordinates.latitude = data.coords.latitude;
          this.coordinates.longitude = data.coords.longitude;
          console.log(this.coordinates)
        });
      }
      
      addDeviceInMap(){
        this.geolocation.getCurrentPosition().then((resp) => {
          this.coordinates.latitude = resp.coords.latitude;
          this.coordinates.longitude = resp.coords.longitude
        }).catch((error) => {
          console.log('Error getting location', error);
        });
        
        let watch = this.geolocation.watchPosition();
        watch.subscribe((data:any) => {
          this.coordinates.latitude = data.coords.latitude;
          this.coordinates.longitude = data.coords.longitude;
          
          console.log(this.coordinates);
          var el = document.createElement('div');
          el.className = 'bluetooth';
          
          // make a marker for each feature and add to the map
          new mapboxgl.Marker(el)
          .setLngLat([this.coordinates.longitude, this.coordinates.latitude])
          .addTo(this.map);
        });
        
        
      }
      
      
      
    }
    