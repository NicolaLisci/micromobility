import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  constructor(
    private authService : AuthService,
    private navController: NavController,
  ) { }

  ngOnInit() {
    if(this.authService.isLoggedIn){
      this.navController.navigateForward(['/']);
    }
  }

  onSignIn(){
    this.authService.GoogleAuth().then((res)=>console.log(res));
  }

}
