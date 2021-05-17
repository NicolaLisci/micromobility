import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PubNubAngular } from 'pubnub-angular2';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    ){}
    
    ngOnInit() {
      if(!this.authService.isLoggedIn){
        this.presentAlertPrompt();
      }
      
    }
    
    async presentAlertPrompt() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Welcome',
        inputs: [],
        buttons: [
          {
            text: 'Start',
            handler: (data) => {
              this.authService.signInAnonymously().then((res:any)=>{
                console.log(res);
              })
            }
          }
        ]
      });
      
      await alert.present();
    }
  }
  