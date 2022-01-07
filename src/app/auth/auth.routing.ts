import { LoginComponent } from '@auth/login/login.component';
import { Routes } from "@angular/router";
import { NotFoundComponent } from '@auth/not-found/not-found.component';

export const AuthRoutes: Routes = [
  {
    path: '',
    children : [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '404',
        component: NotFoundComponent
      }
    ]
  }
]
