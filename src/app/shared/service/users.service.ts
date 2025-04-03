import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, orderBy, query, setDoc, Unsubscribe, updateDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { UserInterface } from '../../log-in/user.interface';


@Injectable({
  providedIn: 'root'
})
export class UsersService {


  constructor() { 

  }

}
