import { Component, Input, OnInit } from '@angular/core';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss'],
})
export class DirectionComponent implements OnInit{
  
  @Input() data;
  
  public tripDuration;
  public tripDistance;
  
  public location;

  public showCloseButton = false;
  
  constructor(
    private mapService : MapService
    ) { 
      
    }
    ngOnInit(): void {
      console.log(this.data);
      this.location = this.data.location.result.text;
      this.getTripDuration(this.data.tripInformation.matchings[0]);
      this.getTripDistance(this.data.tripInformation.matchings[0]);
    }
    
    getTripDuration(data){
      this.tripDuration = Math.floor(data.duration / 60);
    } 
    
    getTripDistance(data){
      this.tripDistance = data.distance / 1000;
    }
    
    onStartClick(){
      console.log(this.data.tripInformation)
      this.showCloseButton = true;
      this.mapService.map.easeTo({
        center: {lon: this.mapService.coordinates.longitude, lat: this.mapService.coordinates.latitude},
        pitch:60,
        zoom:15,
        bearing: this.data.tripInformation.matchings[0].legs[0].steps[0].intersections[0].bearings[0]
      });
    }

    onCloseClick(){
      this.mapService.map.easeTo({pitch:0});
      this.mapService.locationInformation.next(false);
      this.mapService.removeRoute();
    }
    
  }
  