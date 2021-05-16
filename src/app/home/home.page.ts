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
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";

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
    draw: any;
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
        // this.map.on('draw.delete', removeRoute);
        
      }
      
      updateRoute() {
        // removeRoute(); // Overwrite any existing layers
        console.log(this.draw);
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
      
      // Make a Map Matching request
      getMatch(coordinates, radius) {
        // Separate the radiuses with semicolons
        let radiuses = radius.join(';');
        // Create the query
        this.mapService.getMapDraw(coordinates, radiuses).subscribe((res:any)=>{
          var coords = res.matchings[0].geometry;
          // Draw the route on the map
          console.log(coords);
          this.addRoute(coords);
          // this.getInstructions(res.matchings[0]);
        });
        
        // $.ajax({
        //   method: 'GET',
        //   url: query
        // }).done(function (data) {
        //   let coords = data.matchings[0].geometry;
        // Draw the route on the map
        // addRoute(coords);
        // getInstructions(data.matchings[0]);
        // });
      }
      
      addRoute(coords) {
        // If a route is already loaded, remove it
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
      
      // getInstructions(data) {
      //   // Target the sidebar to add the instructions
      //   var directions = document.getElementById('directions');
      
      //   var legs = data.legs;
      //   var tripDirections = [];
      //   // Output the instructions for each step of each leg in the response object
      //   for (var i = 0; i < legs.length; i++) {
      //     var steps = legs[i].steps;
      //     for (var j = 0; j < steps.length; j++) {
      //       tripDirections.push('<br><li>' + steps[j].maneuver.instruction) +
      //       '</li>';
      //     }
      //   }
      //   directions.innerHTML =
      //   '<br><h2>Trip duration: ' +
      //   Math.floor(data.duration / 60) +
      //   ' min.</h2>' +
      //   tripDirections;
      // }
      
      removeRoute() {
        if (this.map.getSource('route')) {
          this.map.removeLayer('route');
          this.map.removeSource('route');
        } else {
          return;
        }
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
        