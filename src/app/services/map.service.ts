import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  
  constructor(
    private httpClient:HttpClient
    ) { }
    
    
    
    getIsochrone(coordinates:any, minutes:number){
      return this.httpClient.get('https://api.mapbox.com/isochrone/v1/mapbox/cycling/'+coordinates.longitude + '%2C' + coordinates.latitude + '?contours_minutes=' + minutes + '&polygons=true&access_token=' +environment.mapbox.accessToken);
    }
  }
  