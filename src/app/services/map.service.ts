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

    getMapDraw(coordinates:any, radiuses: any){
      return this.httpClient.get('https://api.mapbox.com/matching/v5/mapbox/cycling/'+coordinates +'?geometries=geojson&radiuses=' + radiuses + '&steps=true&access_token=' +environment.mapbox.accessToken);
    }

  }


  // https://api.mapbox.com/matching/v5/mapbox/cycling/9.000400715348263,39.03559525567064;9.000400715348263,39.03434913471395?geometries=geojson&radiuses=25,25&steps=true&access_token=pk.eyJ1Ijoibmljb2xhbGlzY2kiLCJhIjoiY2tvcTB3YzR1MHFrMzJwc2piZXduMmYxdCJ9.MZquw3FQpejTxMRwJBzutg

  // https://api.mapbox.com/matching/v5/mapbox/driving/9.000382292462064,39.035607089051496;9.000435435875772,39.03432053612866?geometries=geojson&radiuses=25;25&steps=true&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg
  