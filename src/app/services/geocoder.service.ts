import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {
  
  constructor() { }
  
  
  initGeocoder(coordinates){
    let geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      localGeocoder: this.coordinatesGeocoder,
      marker: true,
      placeholder: 'Search', 
      proximity: {
        longitude: coordinates.longitude,
        latitude: coordinates.latitude
      }
    });
    return geocoder;
  }
  
  coordinatesGeocoder = (query) => {
    var matches = query.match(
      /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
      );
      if (!matches) {
        return null;
      }
      
      var coord1 = Number(matches[1]);
      var coord2 = Number(matches[2]);
      var geocodes = [];
      
      if (coord1 < -90 || coord1 > 90) {
        // must be lng, lat
        geocodes.push(this.coordinateFeature(coord1, coord2));
      }
      
      if (coord2 < -90 || coord2 > 90) {
        // must be lat, lng
        geocodes.push(this.coordinateFeature(coord2, coord1));
      }
      
      if (geocodes.length === 0) {
        // else could be either lng, lat or lat, lng
        geocodes.push(this.coordinateFeature(coord1, coord2));
        geocodes.push(this.coordinateFeature(coord2, coord1));
      }
      
      return geocodes;
    };
    
    coordinateFeature(lng, lat) {
      return {
        center: [lng, lat],
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        place_name: 'Lat: ' + lat + ' Lng: ' + lng,
        place_type: ['coordinate'],
        properties: {},
        type: 'Feature'
      };
    }
    
  }
  