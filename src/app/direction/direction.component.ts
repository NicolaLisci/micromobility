import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss'],
})
export class DirectionComponent implements OnInit{

  @Input() tripDirections;
  @Input() tripDuration;

  constructor(
  ) { }


  ngOnInit(): void {
  }

  getInstructions(data) {
    let directions = document.getElementById('directions');
    
    let legs = data.legs;
    this.tripDuration
    for (var i = 0; i < legs.length; i++) {
      var steps = legs[i].steps;
      for (var j = 0; j < steps.length; j++) {
        this.tripDirections.push(steps[j].maneuver.instruction);
      }
    }
    
    this.tripDuration = Math.floor(data.duration / 60);
  }

}
