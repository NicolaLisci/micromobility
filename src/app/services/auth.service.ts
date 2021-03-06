import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { User } from '../models/user.model';
import { UserService } from './user.service';

// export interface User {
//   uid: string;
//   email: string;
//   displayName: string;
//   photoURL: string;
//   emailVerified: boolean;
// }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userState: any;
  
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private userService : UserService,
    private router: Router,
    private ngZone: NgZone
    ) {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userState = user;
          // localStorage.setItem('user', JSON.stringify(this.userState));
          // JSON.parse(localStorage.getItem('user'));
        } else {
          localStorage.setItem('user', null);
          // JSON.parse(localStorage.getItem('user'));
        }
      })
    }
    
    GoogleAuth() {
      return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
    }
    
    signInAnonymously() {
      return this.afAuth.signInAnonymously()
      .then((result) => {
        // this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
    }
    
    get isLoggedIn(): boolean {
      const user = JSON.parse(localStorage.getItem('user'));
      return (user !== null) ? true : false;
    }
    
    AuthLogin(provider) {
      return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        this.userService.getAll().subscribe((users: [])=>{
          const found = users.find((user: User)=> user.email == result.user.email);
             localStorage.setItem('user', JSON.stringify(found));
          if(!found){
            const user = new User();
            user.id = result.user.uid;
            user.displayName = result.user.displayName;
            user.email = result.user.email;
            user.photoUrl = result.user.photoURL;
            user.distance = 0;
            this.userService.create(user);
          }
        });
      }).catch((error) => {
        window.alert(error)
      })
    }
    
    
    
    SignOut() {
      return this.afAuth.signOut().then(() => {
        localStorage.removeItem('user');
      })
    }
  }
  