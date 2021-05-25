import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PubNubAngular } from 'pubnub-angular2';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private userService: UserService
    ){}
    
    ngOnInit() {
      if(!this.authService.isLoggedIn){
        // this.authService.signInAnonymously().then((res:any)=>{});
        this.authService.GoogleAuth().then((res:any)=>{
          console.log(res);
        });
      }
      
    }
    
    // async presentAlertPrompt() {
    //   const alert = await this.alertController.create({
    //     cssClass: 'my-custom-class',
    //     header: 'Welcome',
    //     inputs: [],
    //     buttons: [
    //       {
    //         text: 'Start',
    //         handler: (data) => {
    //           this.authService.signInAnonymously().then((res:any)=>{
    //             console.log(res);
    //           });
    //         }
    //       }
    //     ]
    //   });
      
    //   await alert.present();
    // }
  }
  