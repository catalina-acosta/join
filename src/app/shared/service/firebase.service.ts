import { inject, Injectable } from '@angular/core';
import { collection, Firestore, onSnapshot } from '@angular/fire/firestore';
import { ContactInterface } from '../../main-content/contacts/contact-interface';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firebase = inject(Firestore);
  contactsList: ContactInterface[] = [];
  unsubscribe;

  constructor() {
    this.unsubscribe = onSnapshot(collection(this.firebase, "contacts"), (joinObjects) => {
      this.contactsList = [];
      joinObjects.forEach((element) => {
        this.contactsList.push(this.setContactObject(element.id, element.data() as ContactInterface))
      })
    })
  }
  
  setContactObject(id: string, obj: ContactInterface): ContactInterface {
    return {
      id: id,
      email: obj.email,
      firstname: obj.firstname,
      lastname: obj.lastname,
      phone: obj.phone,
    }
  }
  
  ngOnDestroy() {
    if(this.unsubscribe) {
      this.unsubscribe();
    }
  }
}