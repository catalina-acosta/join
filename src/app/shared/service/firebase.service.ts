import { inject, Injectable } from '@angular/core';
import { collection, Firestore, onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
firebase = inject(Firestore);

unsubscribe;

ngOnDestroy() {
  if(this.unsubscribe) {
    this.unsubscribe();
  }
}

constructor() {
  this.unsubscribe = onSnapshot(collection(this.firebase, "join"), (joinObjects) => {
    console.log(joinObjects);

  })
}
}