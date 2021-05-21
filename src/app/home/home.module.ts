import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonIcon } from '@ionic/angular';
import { DirectionModule } from '../direction/direction.module';
import { GeocoderModule } from '../geocoder/geocoder.module';
import { MapModule } from '../map/map.module';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MapModule,
    GeocoderModule,
    DirectionModule
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
