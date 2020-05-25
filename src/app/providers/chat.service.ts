import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Message } from '../interface/message.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Message>;

  public chats: Message[] = [];
  public user: any = {};

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) { 

   this.afAuth.authState.subscribe( currentUser => {
      console.log('User State: ', currentUser);
      if(!currentUser) {
      return;
      }
      this.user.name = currentUser.displayName;
      this.user.uid = currentUser.uid;
   })

  }

  login(provider: string) {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }

loadMessages() {

this.itemsCollection = this.afs.collection<Message>('chats', ref => ref.orderBy('date','desc').limit(5));

return this.itemsCollection.valueChanges().pipe(map((messages:Message[]) => {
               console.log(messages);
               this.chats = [];
               for (let message of messages) {
                 this.chats.unshift(message);
               }
               return this.chats;
              }));

}


addMessages(text: string) {
  let message: Message = {
    name: this.user.name,
    message: text,
    date: new Date().getTime(),
    uid: this.user.uid
  }
  return this.itemsCollection.add( message );
}

}
