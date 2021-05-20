import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss'],
})
export class DirectionComponent{

  @Input() tripDirections;
  @Input() tripDuration;

  constructor(
  ) { }



}
