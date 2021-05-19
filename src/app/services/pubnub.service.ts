import { Injectable } from '@angular/core';
import { GeoJSONSource } from 'mapbox-gl';
import { PubNubAngular } from 'pubnub-angular2';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PubnubService {

  pubnub: PubNubAngular;
  channel: string;
  messages :any[] = null;
  
  constructor(
    pubnub: PubNubAngular,
    private mapService: MapService
  ) {
    this.channel = 'my_channel';
      this.pubnub = pubnub;
      
      this.pubnub.init({
        publishKey: 'pub-c-9502aaeb-922b-45a9-a236-041365a3ed7d',
        subscribeKey: 'sub-c-26ac9198-b71d-11eb-b2e5-0e040bede276'
      });
      
      pubnub.addListener({
        status: (st) => {
          if (st.category === "PNUnknownCategory") {
            var newState = {
              new: 'error'
            };
            pubnub.setState({
              state: newState
            },
            (status) => {
              console.log(st.errorData.message);
            });
          }
        },
        message: (data) => {
          console.log(data);
          let el = document.createElement('div');
          el.className = 'bluetooth';
          
          if(data.message.user != JSON.parse(localStorage.getItem('user')).uid){
            (this.mapService.map.getSource('drone') as GeoJSONSource).setData(
              {
                "type": "FeatureCollection",
                "features": [
                  {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        data.message.coords.longitude,
                        data.message.coords.latitude
                      ]
                    }
                  }
                ]
              }
              );
            }
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
}
