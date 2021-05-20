import { Component, Input } from '@angular/core';

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
