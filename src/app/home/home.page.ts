import { AfterContentInit, Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { MapService } from '../services/map.service';
import { BluetoothService } from '../services/bluetooth.service';
import { Observable } from 'rxjs';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  
  public deviceName$ = new Observable();
  
  constructor(
    private geolocation: Geolocation,
    private alertController: AlertController,
    private mapService: MapService,
    // private bluetoothService: BluetoothService
    ) {}
    
    
    map: mapboxgl.Map;
    style = 'mapbox://styles/mapbox/dark-v10';
    // lat = 39.03437700146109;
    // lng = 8.999600913492351;
    
    
    coordinates= {
      latitude: 0,
      longitude: 0
    };
    
    ngOnInit(): void {
      
      if(!localStorage.getItem('coordinates')){
        localStorage.setItem('coordinates', '{"latitude":0,"longitude":0}');
      }
      const coordinates = JSON.parse(localStorage.getItem('coordinates'));
      
      mapboxgl.accessToken = environment.mapbox.accessToken;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 15,
        center: [coordinates.longitude,coordinates.latitude]
      });
      
      this.addUserLocation();
      this.getUserLocation();
      
      this.map.on('load', ()=>{
        this.map.addSource('iso', {
          type: 'geojson',
          data: {
            'type': 'FeatureCollection',
            'features': []
          }
        });
        
        let geocoder = new MapboxGeocoder({
          // Initialize the geocoder
          accessToken: mapboxgl.accessToken, // Set the access token
          mapboxgl: mapboxgl, // Set the mapbox-gl instance
          marker: true, // Do not use the default marker style
          placeholder: 'Search', // Placeholder text for the search bar
          proximity: {
            longitude: coordinates.longitude,
            latitude: coordinates.latitude
          } // Coordinates of UC Berkeley
        });
        
        document.getElementById('geocoder').appendChild(geocoder.onAdd(this.map));
        
        // this.map.addControl(geocoder);
        
        this.map.addLayer(
          {
            'id': 'isoLayer',
            'type': 'fill',
            'source': 'iso',
            'layout': {},
            'paint': {
              'fill-color': '#005a32',
              'fill-opacity': 0.3
            }
          },
          'poi-label'
          );
          
        });
      }
      
      getIsochrone(km){
        let minutes = (km/2) / 0.25;
        this.mapService.getIsochrone(this.coordinates, minutes).subscribe((res)=>{
          this.map.getSource('iso').setData(res);
        })
      }
      
      onStartClick(){
        this.presentAlertPrompt();
      }
      
      findDevice(){
        // this.bluetoothService.value();
        // this.deviceName$ = this.bluetoothService.deviceName$.asObservable();
      }
      
      async presentAlertPrompt() {
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
                this.getIsochrone(data.km);
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
            localStorage.setItem('coordinates',JSON.stringify(this.coordinates));
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
            
            var el = document.createElement('div');
            el.className = 'bluetooth';
            
            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
            .setLngLat([this.coordinates.longitude, this.coordinates.latitude])
            .addTo(this.map);
          });
          
          
        }
        
        
        
      }
      