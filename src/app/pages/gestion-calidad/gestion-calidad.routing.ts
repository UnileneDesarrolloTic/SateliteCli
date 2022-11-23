import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { SeguimientoLoteComponent } from "@pages/gestion-calidad/seguimiento-lote/seguimiento-lote.component";
import { VentasClientesComponent } from "@pages/gestion-calidad/ventas-clientes/ventas-clientes.component";
import { DetalleComponent } from "@pages/gestion-calidad/reclamos-quejas/detalle/detalle.component";
import { ListaComponent } from "@pages/gestion-calidad/reclamos-quejas/lista/lista.component";
import { DetalleLoteComponent } from "@pages/gestion-calidad/reclamos-quejas/detalle-lote/detalle-lote.component";
import { ConfirmExitGuard } from "@guard/confirm-exit.guard";

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
          },
          {
            path: 'ReclamosQuejas',
            children:
            [
              {
                path:"",
                component: ListaComponent,
                data: {
                  title: "ADM. DE RECLAMOS"
                }
              },
              {
                path:"Detalle/:codReclamo",
                component: DetalleComponent,
                data: {
                  title: "DETALLE RECLAMO",
                  urls:[
                    { title: 'Lista de reclamos', url: '/GestionCalidad/ReclamosQuejas' },
                    { title: 'Detalle reclamo' },
                  ]
                }
              },
              {
                path:"DetalleLote/:codCliente/:codReclamo/:lote/:documento",
                component: DetalleLoteComponent,
                canDeactivate: [ConfirmExitGuard],
                data: {
                  title: "DETALLE LOTE RECLAMO"
                }
              }
            ]
          }
        ]
    },
]