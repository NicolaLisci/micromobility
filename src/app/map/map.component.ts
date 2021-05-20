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
        
        this.mapService.map.addSource('iso',defaultSourceOptions);
        this.mapService.map.addSource('drone', defaultSourceOptions);        
        this.mapService.map.addLayer(droneLayerOptions);
        
        const geocoder = this.geocoderService.initGeocoder(this.mapService.coordinates);
        document.getElementById('geocoder').appendChild(geocoder.onAdd(this.mapService.map));
        
        geocoder.on('result', (res)=> {
          geocoder.mapMarker.getElement().addEventListener('click', ()=> {
            this.presentPopover(res);
          })
        });
        
        
        this.mapService.map.addLayer(isoLayerOptions,'poi-label');
        
      });
    }
    
    async presentPopover(data: any) {
      const popover = await this.popoverController.create({
        component: PopoverComponent,
        cssClass: 'marker-popover',
        componentProps: {data, onClick: () => popover.dismiss()},
        translucent: true,
        showBackdrop: false
      });
      await popover.present();
      
      await popover.onDidDismiss().then(()=>{
        const coordinates = this.mapService.coordinates.longitude+','+this.mapService.coordinates.latitude+';'+data.result.center[0]+','+data.result.center[1];
        const radius = [25,25];
        this.mapService.getMatch(coordinates, radius);
      });
    }

  }
  