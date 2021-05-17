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

declare let eon: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  
  map: mapboxgl.Map;
  draw: any;
  style = 'mapbox://styles/mapbox/dark-v10';
  
  userId;
  
  coords;
  tripDuration;
  tripDirections = [];
  
  
  coordinatesLiveTracking = null;
  // lat = 39.03437700146109;
  // lng = 8.999600913492351;
  
  
  coordinates= {
    latitude: 0,
    longitude: 0
  };
  
  public deviceName$ = new Observable();
  pubnub: PubNubAngular;
  channel: string;
  messages :any[] = null;
  
  constructor(
    private geolocation: Geolocation,
    private alertController: AlertController,
    private mapService: MapService,
    pubnub: PubNubAngular
    // private bluetoothService: BluetoothService
    ) {
      this.channel = 'my_channel';
      this.pubnub = pubnub;
      
      this.pubnub.init({
        publishKey: 'pub-c-9502aaeb-922b-45a9-a236-041365a3ed7d',
        subscribeKey: 'sub-c-26ac9198-b71d-11eb-b2e5-0e040bede276'
      });
      
      pubnub.addListener({
        status: (st) => {
          if (st.category === "PNUnknownCategory") {
            var newState = {
              new: 'error'
            };
            pubnub.setState({
              state: newState
            },
            (status) => {
              console.log(st.errorData.message);
            });
          }
        },
        message: (data) => {
          console.log(data);
          let el = document.createElement('div');
          el.className = 'bluetooth';
          
          if(data.message.user != localStorage.getItem('id')){
            new mapboxgl.Marker(el)
            .setLngLat([data.message.coords.longitude,data.message.coords.latitude])
            .addTo(this.map);
          }
        }
      });
      
      this.pubnub.subscribe({
        channels: [this.channel],
        triggerEvents: ['message']
      });
    }
    
    
    
    
    
    ngOnInit(): void {
      
      if(!localStorage.getItem('id')){
        localStorage.setItem('id',JSON.stringify(Math.floor(Math.random() * 11)));
      }else{
        this.userId = localStorage.getItem('id');
      }
      
      if(!localStorage.getItem('coordinates')){
        localStorage.setItem('coordinates', '{"latitude":0,"longitude":0}');
      }
      const coordinates = JSON.parse(localStorage.getItem('coordinates'));
      
      (mapboxgl as any).accessToken = environment.mapbox.accessToken;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 15,
        logoPosition: "bottom-left",
        center: [coordinates.longitude,coordinates.latitude]
      });
      
      // this.messages = this.pubnub.getMessage(this.channel);
      // console.log(this.messages)
      
      
      // const markerUser = new mapboxgl.Marker()
      // .setLngLat([this.messages[this.messages.length -1].latitude,this.messages[this.messages.length -1].longitude])
      // .addTo(this.map);
      
      
      this.liveTrackUser();
      
      // eon.map({
      //   pubnub: this.pubnub,
      //   id: 'map',
      //   options: {
      //     container: 'map',
      //     style: this.style,
      //     zoom: 15,
      //     logoPosition: "bottom-left",
      //     center: [coordinates.longitude,coordinates.latitude]
      //   },
      //   mbToken: environment.mapbox.accessToken,
      //   mbId: 'ianjennings.l896mh2e',
      //   channels: [this.channel],
      //   // connect: connect
      // });
      
      
      this.addUserLocation();
      this.getUserLocation();
      
      this.mapDraw();
      
      
      this.map.on('load', ()=>{
        this.map.resize();
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
          localGeocoder: this.coordinatesGeocoder,
          marker: true, // Do not use the default marker style
          placeholder: 'Search', // Placeholder text for the search bar
          proximity: {
            longitude: coordinates.longitude,
            latitude: coordinates.latitude
          } // Coordinates of UC Berkeley
        });
        
        document.getElementById('geocoder').appendChild(geocoder.onAdd(this.map));
        
        
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
      
      
      
      liveTrackUser(){
        setInterval(() => {
          // console.log(this.coordinates);
          let hw = {
            user: localStorage.getItem('id'),
            coords: this.coordinates
          }
          this.pubnub.publish({
            channel: this.channel, message: hw
          });
        }, 1000);
      }
      
      mapDraw(){
        this.draw = new MapboxDraw({
          // Instead of showing all the draw tools, show only the line string and delete tools
          displayControlsDefault: false,
          controls: {
            line_string: true,
            trash: true
          },
          styles: [
            // Set the line style for the user-input coordinates
            {
              'id': 'gl-draw-line',
              'type': 'line',
              'filter': [
                'all',
                ['==', '$type', 'LineString'],
                ['!=', 'mode', 'static']
              ],
              'layout': {
                'line-cap': 'round',
                'line-join': 'round'
              },
              'paint': {
                'line-color': '#438EE4',
                'line-dasharray': [0.2, 2],
                'line-width': 2,
                'line-opacity': 0.7
              }
            },
            // Style the vertex point halos
            {
              'id': 'gl-draw-polygon-and-line-vertex-halo-active',
              'type': 'circle',
              'filter': [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
              ],
              'paint': {
                'circle-radius': 12,
                'circle-color': '#FFF'
              }
            },
            // Style the vertex points
            {
              'id': 'gl-draw-polygon-and-line-vertex-active',
              'type': 'circle',
              'filter': [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
              ],
              'paint': {
                'circle-radius': 8,
                'circle-color': '#438EE4'
              }
            }
          ]
        });
        
        // Add the draw tool to the map
        this.map.addControl(this.draw);
        
        
        
        // Add create, update, or delete actions
        this.map.on('draw.create',()=> this.updateRoute());
        this.map.on('draw.update',() => this.updateRoute());
        this.map.on('draw.delete', () => this.removeRoute());
        
      }
      
      updateRoute() {
        this.removeRoute(); // Overwrite any existing layers
        // Get the coordinates
        let data:any = this.draw.getAll();
        let lastFeature = data.features.length - 1;
        let coords = data.features[lastFeature].geometry.coordinates;
        // Format the coordinates
        let newCoords = coords.join(';');
        // Set the radius for each coordinate pair to 25 meters
        let radius = [];
        coords.forEach((element) => {
          radius.push(25);
        });
        
        this.getMatch(newCoords, radius);
      }
      
      getMatch(coordinates, radius) {
        let radiuses = radius.join(';');
        this.mapService.getMapDraw(coordinates, radiuses).subscribe((res:any)=>{
          this.coords = res.matchings[0].geometry;
          this.addRoute(this.coords);
          this.getInstructions(res.matchings[0]);
        });
        
      }
      
      addRoute(coords) {
        if (this.map.getSource('route')) {
          this.map.removeLayer('route');
          this.map.removeSource('route');
        } else {
          this.map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': {
              'type': 'geojson',
              'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': coords
              }
            },
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': '#03AA46',
              'line-width': 8,
              'line-opacity': 0.8
            }
          });
        }
      }
      
      getInstructions(data) {
        // Target the sidebar to add the instructions
        let directions = document.getElementById('directions');
        
        let legs = data.legs;
        this.tripDuration
        // Output the instructions for each step of each leg in the response object
        for (var i = 0; i < legs.length; i++) {
          var steps = legs[i].steps;
          for (var j = 0; j < steps.length; j++) {
            this.tripDirections.push(steps[j].maneuver.instruction);
          }
        }
        
        this.tripDuration = Math.floor(data.duration / 60);
      }
      
      removeRoute() {
        this.coords = undefined;
        if (this.map.getSource('route')) {
          this.map.removeLayer('route');
          this.map.removeSource('route');
        } else {
          return;
        }
      }
      
      getIsochrone(km){
        let minutes = (km/2) / 0.25;
        this.mapService.getIsochrone(this.coordinates, minutes).subscribe((res: any)=>{
          (this.map.getSource('iso') as GeoJSONSource).setData(res);
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
            this.coordinates.longitude = resp.coords.longitude; 
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
            
            let el = document.createElement('div');
            el.className = 'bluetooth';
            
            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
            .setLngLat([this.coordinates.longitude, this.coordinates.latitude])
            .addTo(this.map);
          });
        }
        
        coordinatesGeocoder = (query) => {
          // Match anything which looks like
          // decimal degrees coordinate pair.
          var matches = query.match(
            /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
            );
            if (!matches) {
              return null;
            }
            
            var coord1 = Number(matches[1]);
            var coord2 = Number(matches[2]);
            var geocodes = [];
            
            if (coord1 < -90 || coord1 > 90) {
              // must be lng, lat
              geocodes.push(this.coordinateFeature(coord1, coord2));
            }
            
            if (coord2 < -90 || coord2 > 90) {
              // must be lat, lng
              geocodes.push(this.coordinateFeature(coord2, coord1));
            }
            
            if (geocodes.length === 0) {
              // else could be either lng, lat or lat, lng
              geocodes.push(this.coordinateFeature(coord1, coord2));
              geocodes.push(this.coordinateFeature(coord2, coord1));
            }
            
            return geocodes;
          };
          
          
          coordinateFeature(lng, lat) {
            return {
              center: [lng, lat],
              geometry: {
                type: 'Point',
                coordinates: [lng, lat]
              },
              place_name: 'Lat: ' + lat + ' Lng: ' + lng,
              place_type: ['coordinate'],
              properties: {},
              type: 'Feature'
            };
          }
          
          
        }
        