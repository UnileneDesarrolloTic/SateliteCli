import { LoginComponent } from '@auth/login/login.component';
import { Routes } from "@angular/router";
import { NotFoundComponent } from '@auth/not-found/not-found.component';
import { RegistrarAsistenciaComponent } from './registrar-asistencia/registrar-asistencia.component';

export const AuthRoutes: Routes = [
  {
    path: '',
    children : [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'registroAsistencia',
        component: RegistrarAsistenciaComponent
      },
      {
        path: '404',
        component: NotFoundComponent
      }
    ]
  }
]
