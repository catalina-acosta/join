import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, orderBy, query, setDoc, Unsubscribe, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  firebaseUsers = inject(Firestore);
  unsubscribe;

  constructor() { 
    this.unsubscribe = this.getUsers();
  }

  getUsers() {
    return onSnapshot(collection(this.firebaseUsers, "users"), (userObject) => {
      userObject.docs.forEach(doc => console.log(doc.data()));
    })
  }
}
