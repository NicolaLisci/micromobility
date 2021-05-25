import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private dbPath = '/users';
  
  usersRef: AngularFireList<User> = null;
  
  constructor(
    private dbFirestore: AngularFireDatabase
    ) {
      this.usersRef = dbFirestore.list(this.dbPath);
    }
    
    create(user: User){
      return this.usersRef.push(user);
    }
    
    getAll():Observable<any>{
      return this.usersRef.snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>({ key: c.payload.key, ...c.payload.val() }))));
        }
        
        update(key: string, value: any): Promise<void> {
          return this.usersRef.update(key, value);
        }
        
        delete(key: string): Promise<void> {
          return this.usersRef.remove(key);
        }
        
        deleteAll(): Promise<void> {
          return this.usersRef.remove();
        }
        
        toFirebase(user:User){
          return {
            id: user.id || null,
            distance: user.distance || null,
          }
        }
}
