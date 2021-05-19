import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';
import { PubNubAngular } from 'pubnub-angular2';
import { AngularFireModule } from '@angular/fire';
import { config } from 'process';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from 'src/environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    // WebBluetoothModule.forRoot({
    //   enableTracing: true // or false, this will enable logs in the browser's console
    // })
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    Geolocation,
    PubNubAngular,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
