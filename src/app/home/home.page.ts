import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Observable } from 'rxjs';
import { MapService } from '../services/map.service';


declare let eon: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  
  public coords;
  public userId;
  public showCard = true
  
  public locationInformation = new Observable<any>();
  // public instructions ;
  
  constructor(
    private mapService: MapService,
    private alertController: AlertController
    ) {
    }
    
    ngOnInit(): void {
      this.coords = this.mapService.coords;
      this.userId = JSON.parse(localStorage.getItem('user'))?.uid;  
      this.locationInformation = this.mapService.locationInformation.asObservable();
      // this.mapService.instructions.asObservable().subscribe((res)=>{
      //   this.instructions = res;
      // });
    }
    
    async getIsochrone() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Inserisci autonomia',
        inputs: [
          {
            name: 'km',
            type: 'text',
            placeholder: 'Km'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
              this.mapService.getIsochrone(data.km);
            }
          }
        ]
      });
      
      await alert.present();
    }
  
  
  }
  