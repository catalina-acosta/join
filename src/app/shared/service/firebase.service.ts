import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, orderBy, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { ContactInterface } from '../../main-content/contacts/contact-interface';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firebase = inject(Firestore);
  contactsList: ContactInterface[] = [];
  orderedContactsList: ContactInterface[] = [];
  unsubscribe;
  avatarColor: string[] = [
    "#FF7A00",
    "#FF5EB3",
    "#6E52FF",
    "#9327FF",
    "#00BEE8",
    "#1FD7C1",
    "#FF745E",
    "#FFA35E",
    "#FC71FF",
    "#FFC701",
    "#0038FF",
    "#C3FF2B",
    "#FFE62B",
    "#FF4646",
    "#FFBB2B"
  ];

  // dummyData: { firstname: string; lastname: string; email: string; phone: string; color: string }[] = [
  //   {
  //     firstname: "Lena",
  //     lastname: "Schmidt",
  //     email: "lena.schmidt82@gmail.com",
  //     phone: "+49 1521 1234567",
  //     color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
  //   },
  //   {
  //     firstname: "Markus",
  //     lastname: "Sturmfels",
  //     email: "mark.thunderrock@gmail.com",
  //     phone: "+49 171 2345678",
  //     color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
  //   },
  //   {
  //     firstname: "Julia",
  //     lastname: "Weber",
  //     email: "julia.weber33@gmail.com",
  //     phone: "+49 160 3456789",
  //     color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
  //   },
  //   {
  //     firstname: "Thomas",
  //     lastname: "Eisenherz",
  //     email: "tom.ironheart@gmail.com",
  //     phone: "+49 176 4567890",
  //     color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
  //   },
  //   {
  //     firstname: "Sophie",
  //     lastname: "Bauer",
  //     email: "sophie.bauer19@gmail.com",
  //     phone: "+49 151 5678901",
  //     color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
  //   },
  //   {
  //     firstname: "Felix",
  //     lastname: "Sturmkind",
  //     email: "felix.stormchild@gmail.com",
  //     phone: "+49 159 6789012",
  //     color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
  //   },
  //   {
  //     firstname: "Anna",
  //     lastname: "Keller",
  //     email: "anna.keller88@gmail.com",
  //     phone: "+49 172 7890123",
  //     color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
  //   },
  //   {
  //     firstname: "Michael",
  //     lastname: "Schattenwald",
  //     email: "mike.shadowwood@gmail.com",
  //     phone: "+49 175 8901234",
  //     color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
  //   },
  //   {
  //     firstname: "Laura",
  //     lastname: "Fischer",
  //     email: "laura.fischer77@gmail.com",
  //     phone: "+49 157 9012345",
  //     color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
  //   },
  //   {
  //     firstname: "Stefan",
  //     lastname: "Morgentau",
  //     email: "stefan.dewlight@gmail.com",
  //     phone: "+49 162 0123456",
  //     color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
  //   }
  // ];

  // unsubscribeOrderedList: Unsubscribe = () => {};
// 
  constructor() {
    // this.initializeContacts();
    this.unsubscribe = this.orderedListQuery();
  }

// #region vorlage 
  // async initializeContacts() {
  //   try {
  //     const contactsRef = collection(this.firebase, "contacts");
  //     this.dummyData.forEach(async (element) => {
  //       await setDoc(doc(contactsRef), {
  //         email: element.email,
  //         firstname: element.firstname,
  //         lastname: element.lastname,
  //         phone: element.phone,
  //         color: element.color,
  //       });
  //     })
  //     console.log('Contact initialized successfully');
  //   } catch (error) {
  //     console.error('Error initializing contact:', error);
  //   }
  // }
// #endregion

  orderedListQuery() {
    const contactsRef = collection(this.firebase, "contacts")
    const q = query(contactsRef, orderBy('firstname'));
    return  onSnapshot(q, (list) => {
      this.orderedContactsList = [];
      list.forEach(element => {
        this.orderedContactsList.push(this.setContactObject(element.id, element.data() as ContactInterface))
      });
    })
  }

  async addContactToData(contactsList:ContactInterface){
    await addDoc(collection(this.firebase, "contacts"), contactsList);
  }

  async deleteContactFromData(id: string){
    await deleteDoc (doc(this.firebase, "contacts", id))
  }

  async editContactToDatabase(id: string, data: ContactInterface) {
    await updateDoc(doc(this.firebase, "contacts", id), {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      phone: data.phone,
    })
    console.log("data base updated");
    
  }
  
  setContactObject(id: string, obj: ContactInterface): ContactInterface {
    return {
      id: id,
      email: obj.email,
      firstname: obj.firstname,
      lastname: obj.lastname,
      phone: obj.phone,
      color: obj.color,
    }
  }
  
  ngOnDestroy() {
    if(this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
