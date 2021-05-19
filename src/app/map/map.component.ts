import { Component, OnInit } from '@angular/core';
import { GeocoderService } from '../services/geocoder.service';
import { MapService } from '../services/map.service';
import { PubnubService } from '../services/pubnub.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  
  constructor(
    private mapService: MapService,
    private pubNubService: PubnubService,
    private geocoderService: GeocoderService
    ) { }
    
    ngOnInit() {
      this.pubNubService.initPubnub();
      this.pubNubService.liveTrackUser(this.mapService.userId, this.mapService.coordinates);
      this.mapService.initMap();
      
      this.mapService.addUserLocation();
      this.mapService.getUserLocation();
  
      this.mapService.mapDraw();
      this.onMapLoaded();
    }
    
    onMapLoaded(){
      this.mapService.map.on('load', ()=>{
        
        this.mapService.map.resize();
        
        const defaultSourceOptions : any= {
          type: 'geojson',
          data: {
            'type': 'FeatureCollection',
            'features': []
          }
        };
        
        this.mapService.map.addSource('iso',defaultSourceOptions);
        this.mapService.map.addSource('drone', defaultSourceOptions);
        
        const droneLayerOptions : any= {
          'id': 'drone',
          'type': 'symbol',
          'source': 'drone',
          'layout': {
            'icon-image': 'rocket-15'
          },
          "paint": {
            "icon-color": "#ff0000"
          }
        };

        this.mapService.map.addLayer(droneLayerOptions);
 
        const geocoder = this.geocoderService.initGeocoder(this.mapService.coordinates);
        document.getElementById('geocoder').appendChild(geocoder.onAdd(this.mapService.map));

        
        const isoLayerOptions:any = {
          'id': 'isoLayer',
          'type': 'fill',
          'source': 'iso',
          'layout': {},
          'paint': {
            'fill-color': '#005a32',
            'fill-opacity': 0.3
          }
        };
        
        this.mapService.map.addLayer(isoLayerOptions,'poi-label');
        
      });
    }
    
  }
  