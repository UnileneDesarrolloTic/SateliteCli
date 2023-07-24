
import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { TransferenciaPTComponent } from "@pages/encajado/transferencia-pt/transferencia-pt.component";

export const EncajadoRoutes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'transferenciaPT',
        component: TransferenciaPTComponent,
        data: {
          title: "Registro de encajado"
        }
      },
    ]
  },
]
