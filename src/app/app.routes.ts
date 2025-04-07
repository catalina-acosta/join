/**
 * @file Defines the application's routing configuration.
 */

import { RouterModule, Routes } from '@angular/router';
import { ImpressumComponent } from './impressum/impressum/impressum.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy/privacy-policy.component';
import { HelpComponent } from './help/help.component';
import { MainContentComponent } from './main-content/main-content.component';
import { ContactsListComponent } from './main-content/contacts/contacts-list/contacts-list.component';
import { ContactsComponent } from './main-content/contacts/contacts.component';
import { BoardComponent } from './main-content/board/board.component';
import { AddTaskComponent } from './main-content/add-task/add-task.component';
import { AddTaskDialogComponent } from './main-content/add-task/add-task-dialog/add-task-dialog.component';
import { SummaryComponent } from './main-content/summary/summary.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NgModule } from '@angular/core';

/**
 * Application routes configuration.
 * @constant {Routes}
 */
export const routes: Routes = [
    { path: '', component: MainContentComponent },
    { path: 'imprint', component: ImpressumComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'help-page', component: HelpComponent },
    { path: 'contact-list', component: ContactsListComponent },
    { path: 'contact', component: ContactsComponent },
    { path: 'board', component: BoardComponent },
    { path: 'add-task', component: AddTaskComponent },
    { path: 'add-task-dialog', component: AddTaskDialogComponent },
    { path: 'summary', component: SummaryComponent },
    { path: 'sign-up', component: SignUpComponent },
    // { path: 'login', component: LogInComponent },
    { path: '', redirectTo: '/', pathMatch: 'full' },
];

/**
 * Module for routing configuration.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
