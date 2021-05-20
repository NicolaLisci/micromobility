import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss'],
})
export class DirectionComponent implements OnInit{
  
  @Input() instructions;
  
  tripDuration;
  tripDistance;
  
  constructor(
    ) { 
      
    }
    ngOnInit(): void {
      console.log(this.instructions.matchings[0])
      this.getTripDuration(this.instructions.matchings[0]);
      this.getTripDistance(this.instructions.matchings[0]);
    }
    
    getTripDuration(data){
      this.tripDuration = Math.floor(data.duration / 60);
    } 

    getTripDistance(data){
      this.tripDistance = data.distance / 1000 + 'km';
    }
    
  }
  