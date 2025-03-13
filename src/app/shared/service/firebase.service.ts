import { inject, Injectable } from '@angular/core';
import { collection, Firestore, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import { ContactInterface } from '../../main-content/contacts/contact-interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firebase = inject(Firestore);
  contactsList: ContactInterface[] = [];
  orderedContactsList: ContactInterface[] = [];
  unsubscribe;

  constructor() {
    this.unsubscribe = onSnapshot(collection(this.firebase, "contacts"), (joinObjects) => {
      this.contactsList = [];
      joinObjects.forEach((element) => {
        this.contactsList.push(this.setContactObject(element.id, element.data() as ContactInterface))
      })
    });
    this.orderedListQuery();
  }

  orderedListQuery() {
    const contactsRef = collection(this.firebase, "contacts")
    const q = query(contactsRef, orderBy('firstname'));
    return onSnapshot(q, (list) => {
      this.orderedContactsList = [];
      list.forEach(element => {
        this.orderedContactsList.push(this.setContactObject(element.id, element.data() as ContactInterface))
      });
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


// let avatarColors = [
//   "#FF7A00",
//   "#9327FF", 
//   "#6E52FF",
//   "#FC71FF",
//   "#FFBB2B",
//   "#1FD7C1", 
//   "#462F8A", 
//   "#FF4646", 
//   "#00BEE8", 
// ]

