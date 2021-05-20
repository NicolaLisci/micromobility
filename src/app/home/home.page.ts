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
  
  // map: mapboxgl.Map;
  // draw: any;
  // style = 'mapbox://styles/mapbox/dark-v10';
  
  // userId;
  
  public coords;
  public userId;

  public instructions = new Observable<any>();
  // tripDuration;
  // tripDirections = [];
  
  
  // coordinatesLiveTracking = null;
  // lat = 39.03437700146109;
  // lng = 8.999600913492351;
  
  
  // coordinates= {
  //   latitude: 0,
  //   longitude: 0
  // };
  
  // public deviceName$ = new Observable();
  // pubnub: PubNubAngular;
  // channel: string;
  // messages :any[] = null;
  
  constructor(
    // private geolocation: Geolocation,
    // private alertController: AlertController,
    private mapService: MapService,
    // private _apiService: ApiService,
    // pubnub: PubNubAngular
    ) {
      // this.channel = 'my_channel';
      // this.pubnub = pubnub;
      
      // this.pubnub.init({
      //   publishKey: 'pub-c-9502aaeb-922b-45a9-a236-041365a3ed7d',
      //   subscribeKey: 'sub-c-26ac9198-b71d-11eb-b2e5-0e040bede276'
      // });
      
      // pubnub.addListener({
      //   status: (st) => {
      //     if (st.category === "PNUnknownCategory") {
      //       var newState = {
      //         new: 'error'
      //       };
      //       pubnub.setState({
      //         state: newState
      //       },
      //       (status) => {
      //         console.log(st.errorData.message);
      //       });
      //     }
      //   },
      //   message: (data) => {
      //     console.log(data);
      //     let el = document.createElement('div');
      //     el.className = 'bluetooth';
      
      //     if(data.message.user != JSON.parse(localStorage.getItem('user')).uid){
      //       (this.map.getSource('drone') as GeoJSONSource).setData(
      //         {
      //           "type": "FeatureCollection",
      //           "features": [
      //             {
      //               "type": "Feature",
      //               "properties": {},
      //               "geometry": {
      //                 "type": "Point",
      //                 "coordinates": [
      //                   data.message.coords.longitude,
      //                   data.message.coords.latitude
      //                 ]
      //               }
      //             }
      //           ]
      //         }
      //         );
      //       }
      //     }
      //   });
      
      //   this.pubnub.subscribe({
      //     channels: [this.channel],
      //     triggerEvents: ['message']
      //   });
    }
    
    
    
    
    
    ngOnInit(): void {
      this.coords = this.mapService.coords;
    
      this.userId = JSON.parse(localStorage.getItem('user'))?.uid;

     this.instructions = this.mapService.instructions.asObservable();
      
      // const coordinates = JSON.parse(localStorage.getItem('coordinates'));
      
      // (mapboxgl as any).accessToken = environment.mapbox.accessToken;
      // this.map = new mapboxgl.Map({
      //   container: 'map',
      //   style: this.style,
      //   zoom: 15,
      //   logoPosition: "bottom-left",
      //   center: [coordinates.longitude,coordinates.latitude]
      // });
      
      // this.liveTrackUser();
      
      // this.addUserLocation();
      // this.getUserLocation();
      
      // this.mapDraw();
      
      
      
      // this.map.on('load', ()=>{
        
      //   this.map.resize();
        
      //   const defaultSourceOptions = {
      //     type: 'geojson',
      //     data: {
      //       'type': 'FeatureCollection',
      //       'features': []
      //     }
      //   };
        
      //   this.map.addSource('iso',defaultSourceOptions);
      //   this.map.addSource('drone', defaultSourceOptions);
        
      //   this.map.addLayer({
      //     'id': 'drone',
      //     'type': 'symbol',
      //     'source': 'drone',
      //     'layout': {
      //       'icon-image': 'rocket-15'
      //     },
      //     "paint": {
      //       "icon-color": "#ff0000"
      //     }
      //   });
        
      //   let geocoder = new MapboxGeocoder({
      //     accessToken: mapboxgl.accessToken,
      //     mapboxgl: mapboxgl,
      //     localGeocoder: this.coordinatesGeocoder,
      //     marker: true,
      //     placeholder: 'Search', 
      //     proximity: {
      //       longitude: coordinates.longitude,
      //       latitude: coordinates.latitude
      //     }
      //   });
        
      //   document.getElementById('geocoder').appendChild(geocoder.onAdd(this.map));
        
        
      //   this.map.addLayer(
      //     {
      //       'id': 'isoLayer',
      //       'type': 'fill',
      //       'source': 'iso',
      //       'layout': {},
      //       'paint': {
      //         'fill-color': '#005a32',
      //         'fill-opacity': 0.3
      //       }
      //     },
      //     'poi-label'
      //     );
          
      //   });
      }
      
      
      
      // liveTrackUser(){
      //   setInterval(() => {
      //     let hw = {
      //       user: this.userId,
      //       coords: this.coordinates
      //     }
      //     this.pubnub.publish({
      //       channel: this.channel, message: hw
      //     });
      //   }, 4000);
      // }
      
      // mapDraw(){
      //   this.draw = new MapboxDraw(mapboxDrawOptions);
      
      //   this.map.addControl(this.draw);
      
      //   this.map.on('draw.create',()=> this.updateRoute());
      //   this.map.on('draw.update',() => this.updateRoute());
      //   this.map.on('draw.delete', () => this.removeRoute());
      
      // }
      
      // updateRoute() {
      //   this.removeRoute();
      
      //   let data:any = this.draw.getAll();
      //   let lastFeature = data.features.length - 1;
      //   let coords = data.features[lastFeature].geometry.coordinates;
      
      //   let newCoords = coords.join(';');
      //   let radius = [];
      //   coords.forEach((element) => {
      //     radius.push(25);
      //   });
      
      //   this.getMatch(newCoords, radius);
      // }
      
      // getMatch(coordinates, radius) {
      //   let radiuses = radius.join(';');
      //   this.apiService.getMapDraw(coordinates, radiuses).subscribe((res:any)=>{
      //     this.coords = res.matchings[0].geometry;
      //     this.addRoute(this.coords);
      //     this.getInstructions(res.matchings[0]);
      //   });
      
      // }
      
      // addRoute(coords) {
      //   if (this.map.getSource('route')) {
      //     this.map.removeLayer('route');
      //     this.map.removeSource('route');
      //   } else {
      //     this.map.addLayer(
      //       {
      //       'id': 'route',
      //       'type': 'line',
      //       'source': {
      //         'type': 'geojson',
      //         'data': {
      //           'type': 'Feature',
      //           'properties': {},
      //           'geometry': coords
      //         }
      //       },
      //       'layout': {
      //         'line-join': 'round',
      //         'line-cap': 'round'
      //       },
      //       'paint': {
      //         'line-color': '#03AA46',
      //         'line-width': 8,
      //         'line-opacity': 0.8
      //       }
      //     }
      //     );
      //   }
      // }
      
      // getInstructions(data) {
      //   // Target the sidebar to add the instructions
      //   let directions = document.getElementById('directions');
      
      //   let legs = data.legs;
      //   this.tripDuration
      //   // Output the instructions for each step of each leg in the response object
      //   for (var i = 0; i < legs.length; i++) {
      //     var steps = legs[i].steps;
      //     for (var j = 0; j < steps.length; j++) {
      //       this.tripDirections.push(steps[j].maneuver.instruction);
      //     }
      //   }
      
      //   this.tripDuration = Math.floor(data.duration / 60);
      // }
      
      // removeRoute() {
      //   this.coords = undefined;
      //   if (this.map.getSource('route')) {
      //     this.map.removeLayer('route');
      //     this.map.removeSource('route');
      //   } else {
      //     return;
      //   }
      // }
      
      // getIsochrone(km){
      //   let minutes = (km/2) / 0.25;
      //   this.apiService.getIsochrone(this.coordinates, minutes).subscribe((res: any)=>{
      //     (this.map.getSource('iso') as GeoJSONSource).setData(res);
      //   })
      // }
      
      // onStartClick(){
      //   this.presentAlertPrompt();
      // }
      
      
      // async presentAlertPrompt() {
      //   const alert = await this.alertController.create({
      //     cssClass: 'my-custom-class',
      //     header: 'Inserisci autonomia',
      //     inputs: [
      //       {
      //         name: 'km',
      //         type: 'text',
      //         placeholder: 'Km'
      //       }
      //     ],
      //     buttons: [
      //       {
      //         text: 'Cancel',
      //         role: 'cancel',
      //         cssClass: 'secondary',
      //         handler: () => {
      //           console.log('Confirm Cancel');
      //         }
      //       }, {
      //         text: 'Ok',
      //         handler: (data) => {
      //           this.getIsochrone(data.km);
      //         }
      //       }
      //     ]
      //   });
      
      //   await alert.present();
      // }
      
      // addUserLocation(){
      //   this.map.addControl(
      //     new mapboxgl.GeolocateControl({
      //       positionOptions: {
      //         enableHighAccuracy: true
      //       },
      //       trackUserLocation: true
      //     })
      //     );
      //   }
      
      //   getUserLocation(){
      //     this.geolocation.getCurrentPosition().then((resp) => {
      //       this.coordinates.latitude = resp.coords.latitude;
      //       this.coordinates.longitude = resp.coords.longitude; 
      //     }).catch((error) => {
      //       console.log('Error getting location', error);
      //     });
      
      //     let watch = this.geolocation.watchPosition();
      //     watch.subscribe((data:any) => {
      //       this.coordinates.latitude = data.coords.latitude;
      //       this.coordinates.longitude = data.coords.longitude;
      //       localStorage.setItem('coordinates',JSON.stringify(this.coordinates));
      //     });
      //   }
      
      // addDeviceInMap(){
      //   this.geolocation.getCurrentPosition().then((resp) => {
      //     this.coordinates.latitude = resp.coords.latitude;
      //     this.coordinates.longitude = resp.coords.longitude
      //   }).catch((error) => {
      //     console.log('Error getting location', error);
      //   });
      
      //   let watch = this.geolocation.watchPosition();
      //   watch.subscribe((data:any) => {
      //     this.coordinates.latitude = data.coords.latitude;
      //     this.coordinates.longitude = data.coords.longitude;
      
      //     let el = document.createElement('div');
      //     el.className = 'bluetooth';
      //     new mapboxgl.Marker(el)
      //     .setLngLat([this.coordinates.longitude, this.coordinates.latitude])
      //     .addTo(this.map);
      //   });
      // }
      
      // coordinatesGeocoder = (query) => {
      //   var matches = query.match(
      //     /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
      //     );
      //     if (!matches) {
      //       return null;
      //     }
      
      //     var coord1 = Number(matches[1]);
      //     var coord2 = Number(matches[2]);
      //     var geocodes = [];
      
      //     if (coord1 < -90 || coord1 > 90) {
      //       // must be lng, lat
      //       geocodes.push(this.coordinateFeature(coord1, coord2));
      //     }
      
      //     if (coord2 < -90 || coord2 > 90) {
      //       // must be lat, lng
      //       geocodes.push(this.coordinateFeature(coord2, coord1));
      //     }
      
      //     if (geocodes.length === 0) {
      //       // else could be either lng, lat or lat, lng
      //       geocodes.push(this.coordinateFeature(coord1, coord2));
      //       geocodes.push(this.coordinateFeature(coord2, coord1));
      //     }
      
      //     return geocodes;
      //   };
      
      
      // coordinateFeature(lng, lat) {
      //   return {
      //     center: [lng, lat],
      //     geometry: {
      //       type: 'Point',
      //       coordinates: [lng, lat]
      //     },
      //     place_name: 'Lat: ' + lat + ' Lng: ' + lng,
      //     place_type: ['coordinate'],
      //     properties: {},
      //     type: 'Feature'
      //   };
      // }
      
      
    }
    