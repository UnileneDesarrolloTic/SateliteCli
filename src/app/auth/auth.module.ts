import { LoginComponent } from '@auth/login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutes } from './auth.routing';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from '@auth/not-found/not-found.component';

@NgModule({
  declarations: [
    LoginComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AuthRoutes),
    ReactiveFormsModule
  ]
  // exports:[
  //   LoginComponent,
  //   NotFoundComponent
  // ]
})
export class AuthModule { }
