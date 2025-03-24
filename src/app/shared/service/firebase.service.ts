import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, orderBy, query, setDoc, Unsubscribe, updateDoc } from '@angular/fire/firestore';
import { ContactInterface } from '../../main-content/contacts/contact-interface';
import { TaskInterface } from '../../main-content/board/task.interface';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firebase = inject(Firestore);
  private tasksListSubject: BehaviorSubject<TaskInterface[]> = new BehaviorSubject<TaskInterface[]>([]); // BehaviorSubject verwenden, um Aufgaben zu speichern
  tasksList$: Observable<TaskInterface[]> = this.tasksListSubject.asObservable(); // 

  contactsList: ContactInterface[] = [];
  orderedContactsList: ContactInterface[] = [];
  tasksList: TaskInterface[] = [];
  todo: TaskInterface[] = [];
  inProgress: TaskInterface[] = [];
  awaitFeedback: TaskInterface[] = [];
  done: TaskInterface[] = [];

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

  dummyData: { firstname: string; lastname: string; email: string; phone: string; color: string }[] = [
    {
      firstname: "Lena",
      lastname: "Schmidt",
      email: "lena.schmidt82@gmail.com",
      phone: "+49 1521 1234567",
      color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
    },
    {
      firstname: "Markus",
      lastname: "Sturmfels",
      email: "mark.thunderrock@gmail.com",
      phone: "+49 171 2345678",
      color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
    },
    {
      firstname: "Julia",
      lastname: "Weber",
      email: "julia.weber33@gmail.com",
      phone: "+49 160 3456789",
      color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
    },
    {
      firstname: "Thomas",
      lastname: "Eisenherz",
      email: "tom.ironheart@gmail.com",
      phone: "+49 176 4567890",
      color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
    },
    {
      firstname: "Sophie",
      lastname: "Bauer",
      email: "sophie.bauer19@gmail.com",
      phone: "+49 151 5678901",
      color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
    },
    {
      firstname: "Felix",
      lastname: "Sturmkind",
      email: "felix.stormchild@gmail.com",
      phone: "+49 159 6789012",
      color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
    },
    {
      firstname: "Anna",
      lastname: "Keller",
      email: "anna.keller88@gmail.com",
      phone: "+49 172 7890123",
      color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
    },
    {
      firstname: "Michael",
      lastname: "Schattenwald",
      email: "mike.shadowwood@gmail.com",
      phone: "+49 175 8901234",
      color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
    },
    {
      firstname: "Laura",
      lastname: "Fischer",
      email: "laura.fischer77@gmail.com",
      phone: "+49 157 9012345",
      color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
    },
    {
      firstname: "Stefan",
      lastname: "Morgentau",
      email: "stefan.dewlight@gmail.com",
      phone: "+49 162 0123456",
      color: this.avatarColor[Math.floor(Math.random() * this.avatarColor.length)]
    }
  ];

  dummyDataTasks: { title: string; description: string; date: string; priority: string; assignedToUserId: string[]; status: string; category: string; subtasks: { subtask: string; isCompleted: boolean }[] }[] = [
    {
      title: "HomePage",
      description: "Create new component for the homepage",
      date: "20/04/2025",
      priority: "high",
      assignedToUserId: ["CCptP0yIlYy5X2uwA4de", "IzjGbNzLyv7OkpGeg3B4"],
      status: "todo",
      category: "techTask",
      subtasks: [
        { subtask: "create hero page", isCompleted: true },
        { subtask: "navbar", isCompleted: false }
      ]
    },
    {
      title: "Recipe List",
      description: "Develop the recipe list page",
      date: "21/04/2025",
      priority: "medium",
      assignedToUserId: ["KTbjIpLnVGi8q3OjCSHr", "XztzCuRkUPxQ2HOSqPBg", "e0Qb9uGieBOxesbvWUQd"],
      status: "inProgress",
      category: "userStory",
      subtasks: [
        { subtask: "fetch recipes from API", isCompleted: false },
        { subtask: "display recipes in a grid", isCompleted: true },
        { subtask: "add pagination", isCompleted: false }
      ]
    },
    {
      title: "Add Recipe Form",
      description: "Create a form for adding new recipes",
      date: "22/04/2025",
      priority: "low",
      assignedToUserId: ["i2Zsc7SoKgQPbLa8OKOx"],
      status: "awaitFeedback",
      category: "techTask",
      subtasks: [
        { subtask: "create form layout", isCompleted: false },
        { subtask: "add validation", isCompleted: true },
        { subtask: "connect to backend", isCompleted: false }
      ]
    },
    {
      title: "User Authentication",
      description: "Implement user authentication",
      date: "23/04/2025",
      priority: "high",
      assignedToUserId: ["mywr0t26HhjyiDGSNPS5", "vxNrGLk2bKtm4KZNXHJM"],
      status: "done",
      category: "userStory",
      subtasks: [
        { subtask: "create login page", isCompleted: true },
        { subtask: "create registration page", isCompleted: true },
        { subtask: "implement JWT authentication", isCompleted: true }
      ]
    },
    {
      title: "Recipe Detail Page",
      description: "Develop the recipe detail page",
      date: "24/04/2025",
      priority: "medium",
      assignedToUserId: ["wANKfeaSFQO0R6lBYzAJ"],
      status: "todo",
      category: "techTask",
      subtasks: [
        { subtask: "fetch recipe details from API", isCompleted: false },
        { subtask: "display recipe details", isCompleted: false },
        { subtask: "add comments section", isCompleted: false }
      ]
    },
    {
      title: "Search Functionality",
      description: "Implement search functionality for recipes",
      date: "25/04/2025",
      priority: "low",
      assignedToUserId: ["xS1ognbuTPARIklB3HfT", "xbVEjSZTNdq26NFYdsr9"],
      status: "inProgress",
      category: "userStory",
      subtasks: [
        { subtask: "create search bar", isCompleted: true },
        { subtask: "implement search logic", isCompleted: false },
        { subtask: "display search results", isCompleted: false }
      ]
    },
    {
      title: "Responsive Design",
      description: "Ensure the website is responsive",
      date: "26/04/2025",
      priority: "high",
      assignedToUserId: ["CCptP0yIlYy5X2uwA4de", "IzjGbNzLyv7OkpGeg3B4", "KTbjIpLnVGi8q3OjCSHr"],
      status: "awaitFeedback",
      category: "techTask",
      subtasks: [
        { subtask: "test on mobile devices", isCompleted: false },
        { subtask: "test on tablets", isCompleted: true },
        { subtask: "test on desktops", isCompleted: false }
      ]
    },
    {
      title: "User Profile",
      description: "Develop user profile page",
      date: "27/04/2025",
      priority: "medium",
      assignedToUserId: ["XztzCuRkUPxQ2HOSqPBg", "e0Qb9uGieBOxesbvWUQd"],
      status: "done",
      category: "userStory",
      subtasks: [
        { subtask: "fetch user data from API", isCompleted: true },
        { subtask: "display user data", isCompleted: true },
        { subtask: "allow user to edit profile", isCompleted: true }
      ]
    },
    {
      title: "Favorites Feature",
      description: "Implement feature to favorite recipes",
      date: "28/04/2025",
      priority: "low",
      assignedToUserId: ["i2Zsc7SoKgQPbLa8OKOx", "mywr0t26HhjyiDGSNPS5"],
      status: "todo",
      category: "techTask",
      subtasks: [
        { subtask: "add favorite button", isCompleted: false },
        { subtask: "store favorites in database", isCompleted: false },
        { subtask: "display favorites on profile", isCompleted: false }
      ]
    },
    {
      title: "Notifications",
      description: "Implement notifications for users",
      date: "29/04/2025",
      priority: "high",
      assignedToUserId: ["vxNrGLk2bKtm4KZNXHJM", "wANKfeaSFQO0R6lBYzAJ", "xS1ognbuTPARIklB3HfT"],
      status: "inProgress",
      category: "userStory",
      subtasks: [
        { subtask: "create notification system", isCompleted: true },
        { subtask: "send notifications on new recipes", isCompleted: false },
        { subtask: "display notifications in UI", isCompleted: false }
      ]
    }
  ];

  unsubscribeOrderedList: Unsubscribe = () => {};

  constructor() {
    // this.initializeContacts();
    // this.initializeTasks();
    this.unsubscribe = this.orderedListQuery();
    this.unsubscribe = this.getTasksList();
  }

// #region vorlage 
  // async initializeContacts() {
  //   try {
  //     const contactsRef = collection(this.firebase, "contacts");
  //     this.dummyData.forEach(async (element) => {
  //       await setDoc(doc(contactsRef), {
  //         email: element.email,
  //         fullname: `${element.firstname} ${element.lastname}`,
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

//region Vorlage tasks
  // async initializeTasks() {
  //   try {
  //         const tasksRef = collection(this.firebase, "tasks");
  //         this.dummyDataTasks.forEach(async (element) => {
  //           await setDoc(doc(tasksRef), {
  //             title: element.title,
  //             description: element.description,
  //             date: element.date,
  //             priority: element.priority,
  //             assignedToUserId: element.assignedToUserId,
  //             status: element.status,
  //             category: element.category,
  //             subtasks: element.subtasks,
  //           });
  //         })
  //         console.log('Tasks initialized successfully');
  //       } catch (error) {
  //         console.error('Error initializing task:', error);
  //       }
  // }
//endregion



  // 
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
      fullname: data.fullname,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      phone: data.phone,
    })
  }
  // TASKS 

  getTasksList() {
    return onSnapshot(collection(this.firebase, "tasks"), (taskObject) => {
      this.todo = [];
      this.inProgress = [];
      this.awaitFeedback = [];
      this.done = [];
      const tasksList: TaskInterface[] = [];
      
      taskObject.forEach((element) => {
        const task = this.setTaskObject(element.id, element.data() as TaskInterface);
        this.categorizeTask(task);
        tasksList.push(task);
      });
  
      // Aufgabenliste im BehaviorSubject aktualisieren
      this.tasksListSubject.next(tasksList);
    });
  }

  async addTaskToData(newTask:TaskInterface){
    await addDoc(collection(this.firebase, "tasks"), newTask);
  }

  async deleteTaskFromData(id: string){
    await deleteDoc (doc(this.firebase, "tasks", id))
  }

  async updateTaskStatus(taskId: string, updatedData: Partial<TaskInterface>){
    const taskDocRef = doc(this.firebase, `tasks/${taskId}`);
    await updateDoc(taskDocRef, updatedData)
      .catch((error) => {
        console.error(error);
      });
  }
  
  setContactObject(id: string, obj: ContactInterface): ContactInterface {
    return {
      id: id,
      email: obj.email,
      fullname: obj.fullname,
      firstname: obj.firstname,
      lastname: obj.lastname,
      phone: obj.phone,
      color: obj.color,
    }
  }

  setTaskObject(id:string, obj: TaskInterface): TaskInterface {
    return {
    id: id,
    title: obj.title,
    description: obj.description,
    date: obj.date,
    priority: obj.priority,
    assignedToUserId: obj.assignedToUserId,
    status: obj.status,
    category: obj.category,
    subtasks: obj.subtasks,
    }
  }

  categorizeTask(task: TaskInterface){
    if(task.status === "todo") {
      this.todo.push(task);
    } else if(task.status === "awaitFeedback") {
      this.awaitFeedback.push(task);
    } else if(task.status === "inProgress") {
      this.inProgress.push(task);
    } else if(task.status === "done") {
      this.done.push(task);
    }
  }
  
  ngOnDestroy() {
    if(this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
