import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { defaultSourceOptions } from '../models/defaultSourceOptions.model';
import { isoLayerOptions } from '../models/isoLayerOptions.model';
import { droneLayerOptions } from '../models/pointerLayerOptions.model';
import { PopoverComponent } from '../popover/popover.component';
import { ApiService } from '../services/api.service';
import { GeocoderService } from '../services/geocoder.service';
import { MapService } from '../services/map.service';
import { PubnubService } from '../services/pubnub.service';
import { Keyboard } from '@capacitor/keyboard';
import { GeoJSONSource } from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  
  constructor(
    private mapService: MapService,
    private pubNubService: PubnubService,
    private geocoderService: GeocoderService,
    private popoverController: PopoverController
    ) { }
    
    ngOnInit() {

      this.mapService.initMap();
      
      this.mapService.addUserLocation();
      this.mapService.getUserLocation();
      
      this.mapService.mapDraw();
      this.onMapLoaded();
    }
    
    onMapLoaded(){
      this.mapService.map.on('load', ()=>{
        this.mapService.map.resize();

        this.mapService.map.addSource('iso',defaultSourceOptions);
        this.mapService.map.addSource('drone', defaultSourceOptions);        
        this.mapService.map.addLayer(droneLayerOptions);

        console.log(this.mapService.map.getSource('drone') as GeoJSONSource);
        this.pubNubService.initPubnub();
        this.pubNubService.liveTrackUser(this.mapService.userId, this.mapService.coordinates);
        
        const geocoder = this.geocoderService.initGeocoder(this.mapService.coordinates);
        document.getElementById('geocoder').appendChild(geocoder.onAdd(this.mapService.map));
        
        geocoder.on('result', (res)=> {
          // console.log(res);
          Keyboard.hide();
          this.mapService.map.resize();
          const coordinates = this.mapService.coordinates.longitude+'%2C'+this.mapService.coordinates.latitude+'%3B'+res.result.center[0]+'%2C'+res.result.center[1];
          const radius = [25,25];
          geocoder.mapMarker.getElement().addEventListener('click', ()=> this.mapService.getMatch(coordinates, radius, res));
          geocoder.mapMarker.getElement().addEventListener('touchstart', ()=> this.mapService.getMatch(coordinates, radius, res));
        });
        
        this.mapService.map.addLayer(isoLayerOptions,'poi-label');
      });
    }
  
    
  }
  