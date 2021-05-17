import { Component, OnInit } from '@angular/core';
import { PubNubAngular } from 'pubnub-angular2';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  // pubnub: PubNubAngular;
  // channel: string;
  // messages = [];

  constructor(){}
  
  // constructor(pubnub: PubNubAngular) {
  //   this.channel = 'my_channel';
  //   this.pubnub = pubnub;
  //   pubnub.init({
  //     publishKey: 'pub-c-9502aaeb-922b-45a9-a236-041365a3ed7d',
  //     subscribeKey: 'sub-c-26ac9198-b71d-11eb-b2e5-0e040bede276'
  //   });
    
  //   this.pubnub.subscribe({
  //     channels: [this.channel],
  //     triggerEvents: ['message']
  //   });
  // }
  
  ngOnInit() {
  //   this.messages = this.pubnub.getMessage(this.channel);
  //   setInterval(() => {
  //     let hw = 'Hello World, ' + Date.now();
  //     this.pubnub.publish({
  //       channel: this.channel, message: hw
  //     });
  //   }, 1000);
  }
}
