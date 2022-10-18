import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { SeguimientoLoteComponent } from "@pages/gestion-calidad/seguimiento-lote/seguimiento-lote.component";
import { VentasClientesComponent } from "@pages/gestion-calidad/ventas-clientes/ventas-clientes.component";

export const GestionCalidadRoutes: Routes = [
    {
        path: '',
        canActivateChild: [AuthGuard],
        children : [
          {
            path: 'SeguimientoLote',
            component: SeguimientoLoteComponent,
            data: {
              title: "Documentos"
            }
          },
          {
            path: 'VentasCliente',
            component: VentasClientesComponent,
            data: {
              title: "Ventas por cliente"
            }
          }
        ]
    },
]