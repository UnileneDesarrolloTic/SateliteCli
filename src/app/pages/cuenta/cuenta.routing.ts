import { PerfilComponent } from '@pages/cuenta/perfil/perfil.component';
import { Routes } from "@angular/router";
import { AuthGuard } from '@guard/auth.guard';

export const CuentaRoutes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'perfil',
        component: PerfilComponent,
        data: {
          title: "Perfil Usuario",
          urls: [
            {title: 'Perfil' }
          ]
        }
      },
    ]
  },
]
