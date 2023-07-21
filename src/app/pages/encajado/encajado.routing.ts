
import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { AvanceComponent } from "@pages/encajado/avance/avance.component";

export const EncajadoRoutes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'registro',
        component: AvanceComponent,
        data: {
          title: "Registro de encajado"
        }
      },
    ]
  },
]
