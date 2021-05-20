import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient:HttpClient
    ) { }
    
    
    
    getIsochrone(coordinates:any, minutes:number){
      return this.httpClient.get('https://api.mapbox.com/isochrone/v1/mapbox/cycling/'+coordinates.longitude + '%2C' + coordinates.latitude + '?contours_minutes=' + minutes + '&polygons=true&access_token=' +environment.mapbox.accessToken);
    }

    getMapDraw(coordinates:any, radiuses: any){
      return this.httpClient.get('https://api.mapbox.com/matching/v5/mapbox/cycling/'+coordinates+'?geometries=geojson&radiuses=' + radiuses + '&steps=true&access_token=' +environment.mapbox.accessToken);
    }
}
