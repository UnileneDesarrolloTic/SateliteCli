import { LoginComponent } from '@auth/login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutes } from './auth.routing';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from '@auth/not-found/not-found.component';
import { RegistrarAsistenciaComponent } from './registrar-asistencia/registrar-asistencia.component';

@NgModule({
  declarations: [
    LoginComponent,
    NotFoundComponent,
    RegistrarAsistenciaComponent
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
