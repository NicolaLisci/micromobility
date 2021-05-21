import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectionComponent } from './direction.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [DirectionComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports:[DirectionComponent]
})
export class DirectionModule { }
