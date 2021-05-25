import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingInRoutingModule } from './sign-in.routing.module';
import { SignInComponent } from './sign-in.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    SingInRoutingModule,
    IonicModule,
  ]
})
export class SignInModule { }
