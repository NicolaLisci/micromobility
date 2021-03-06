import { Injectable } from '@angular/core';
import { GeoJSONSource } from 'mapbox-gl';
import { PubNubAngular } from 'pubnub-angular2';
import { defaultSourceOptions } from '../models/defaultSourceOptions.model';
import { droneLayerOptions } from '../models/pointerLayerOptions.model';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PubnubService {
  
  pubnub: PubNubAngular;
  channel = 'my_channel';
  messages :any[] = null;
  
  constructor(
    pubnub: PubNubAngular,
    private mapService: MapService
    ) {
      this.pubnub = pubnub;
    }
    
    initPubnub(){
      this.pubnub.init({
        publishKey: 'pub-c-9502aaeb-922b-45a9-a236-041365a3ed7d',
        subscribeKey: 'sub-c-26ac9198-b71d-11eb-b2e5-0e040bede276'
      });
      
      this.pubnub.addListener({
        status: (st) => {
          if (st.category === "PNUnknownCategory") {
            var newState = {
              new: 'error'
            };
            this.pubnub.setState({
              state: newState
            },
            (status) => {
              console.log(st.errorData.message);
            });
          }
        },
        message: (data) => {
          this.addAnotherUserOnTheMap(data);
        }
      });
      
      this.pubnub.subscribe({
        channels: [this.channel],
        triggerEvents: ['message']
      });
    }
    
    
    liveTrackUser(userId: string, coordinates: any){
      setInterval(() => {
        let hw = {
          user: userId,
          coords: coordinates
        }
        this.pubnub.publish({
          channel: this.channel, message: hw
        });
      }, 4000);
    }
    
    
    addAnotherUserOnTheMap(data: any){
      const message = data.message;
      // console.log(this.mapService.map.getSource('user_'+data.user))
      if(data.message.user != JSON.parse(localStorage.getItem('user')).uid){
        if(this.mapService.map.getSource('user_'+message.user) == undefined){
          this.mapService.map.addSource('user_'+message.user, defaultSourceOptions);
          console.log(this.mapService.map.getSource('user_'+message.user))
          this.mapService.map.addLayer(
            {
              'id': 'user_'+message.user,
              'type': 'symbol',
              'source': 'user_'+message.user,
              'layout': {
                'icon-image': 'rocket-15'
              },
              "paint": {
                "icon-color": "#FF0000"
              }
            }
          );

        }
        
        
        console.log('Another Device:', data.message);
        (this.mapService.map.getSource('user_'+message.user) as GeoJSONSource).setData(
          {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    message.coords.longitude,
                    message.coords.latitude
                  ]
                }
              }
            ]
          }
          );
        }
      }
    }
    