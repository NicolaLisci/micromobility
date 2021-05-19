import { Injectable } from '@angular/core';
import { GeoJSONSource } from 'mapbox-gl';
import { ApiService } from './api.service';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  tripDuration;
  tripDirections = [];

  constructor() { }




}
