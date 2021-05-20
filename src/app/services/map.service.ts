import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as mapboxgl from 'mapbox-gl';
import { GeoJSONSource } from 'mapbox-gl';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mapboxDrawOptions } from '../models/mapboxDraw.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  
  map: mapboxgl.Map;
  draw: any;
  userId;
  style = 'mapbox://styles/mapbox/dark-v10';
  coords;
  
  coordinates= {
    latitude: 41.8874314503,
    longitude: 12.4886930452
  };

  public instructions = new BehaviorSubject<any>(false);
  
  
  constructor(
    private geolocation: Geolocation,
    private apiService: ApiService,
    ) {
      this.userId = JSON.parse(localStorage.getItem('user'))?.uid;
    }
    
    initMap(){
      if(localStorage.getItem('coordinates')){
        this.coordinates = JSON.parse(localStorage.getItem('coordinates'));
      }
 

      (mapboxgl as any).accessToken = environment.mapbox.accessToken;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 15,
        logoPosition: "bottom-left",
        center: [this.coordinates.longitude, this.coordinates.latitude]
      });
    }
    
    
    mapDraw(){
      this.draw = new MapboxDraw(mapboxDrawOptions);
      this.map.addControl(this.draw);
      this.map.on('draw.create',()=> this.updateRoute());
      this.map.on('draw.update',() =>this.updateRoute());
      this.map.on('draw.delete', (event) =>{
        this.removeRoute()
      } );      
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
        new mapboxgl.Marker(el)
        .setLngLat([this.coordinates.longitude, this.coordinates.latitude])
        .addTo(this.map);
      });
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
      
      addRoute(coords) {
        if (this.map.getSource('route')) {
          this.map.removeLayer('route');
          this.map.removeSource('route');
        } else {
          this.map.addLayer(
            {
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
                'line-color': '#438EE4',
                'line-width': 8,
                'line-opacity': 0.8
              }
            }
            );
          }
        }
        
        getMatch(coordinates, radius) {
          let radiuses = radius.join(';');
          this.apiService.getMapDraw(coordinates, radiuses).subscribe((res:any)=>{
            this.coords = res.matchings[0].geometry;
            this.addRoute(this.coords);
            const instructions =  this.getInstructions(res.matchings[0]);
            this.instructions.next(res);
          });
        }
        
        updateRoute() {
          this.removeRoute();
          let data:any = this.draw.getAll();
          let lastFeature = data.features.length - 1;
          let coords = data.features[lastFeature].geometry.coordinates;
          let newCoords = coords.join(';');
          let radius = [];
          coords.forEach((element) => {
            radius.push(25);
          });
          
          this.getMatch(newCoords, radius);
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
          this.apiService.getIsochrone(this.coordinates, minutes).subscribe((res: any)=>{
            (this.map.getSource('iso') as GeoJSONSource).setData(res);
          });
        }
        
        getInstructions(data) {
          let legs = data.legs;
          let tripDirections = [], tripDuration;
          for (var i = 0; i < legs.length; i++) {
            var steps = legs[i].steps;
            for (var j = 0; j < steps.length; j++) {
              tripDirections.push(steps[j].maneuver.instruction);
            }
          }
          tripDuration = Math.floor(data.duration / 60);
          return { tripDuration, tripDirections };
        }
        
      }