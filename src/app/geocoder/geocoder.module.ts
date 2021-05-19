import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeocoderComponent } from './geocoder.component';

@NgModule({
  declarations: [GeocoderComponent],
  imports: [
    CommonModule
  ],
  exports:[GeocoderComponent]
})
export class GeocoderModule { }
