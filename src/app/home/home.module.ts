import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HomePageRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MapModule } from '../map/map.module';
import { GeocoderModule } from '../geocoder/geocoder.module';
import { DirectionModule } from '../direction/direction.module';


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
  // providers:[Geolocation]
})
export class HomePageModule {}
