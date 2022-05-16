import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { PedidosComponent } from '@pages/dashboard/comercial/pedidos/pedidos.component';
import { VentasComponent } from '@pages/dashboard/comercial/ventas/ventas.component';
import { ExportacionComponent } from '@pages/dashboard/comercial/exportacion/exportacion.component';
import { PedidoArimaComponent } from '@pages/dashboard/produccion/pedido-arima/pedido-arima.component';
import { InretailComponent } from '@pages/dashboard/comercial/inretail/inretail.component'
import { RentabilidadComponent } from '@pages/dashboard/comercial/rentabilidad/rentabilidad.component'
import { RentabilidadEstrategicoComponent } from './comercial/rentabilidad-estrategico/rentabilidad-estrategico.component';
import { DrogueriaComponent } from "./comercial/drogueria/drogueria.component";
import { SeguimientoOperacionesComponent } from "./produccion/seguimiento-operaciones/seguimiento-operaciones.component";

export const DashboardRoutes: Routes = [
    {
        path: 'comercial',
        canActivateChild: [AuthGuard],
        children : [
            {
                path: 'pedidos',
                component: PedidosComponent ,
                data: {
                  title: "Dashboard comercial pedidos"
                }
            },
            {
                path: 'ventas',
                component: VentasComponent ,
                data: {
                  title: "Dashboard comercial ventas"
                }
            },
            {
                path: 'exportacion',
                component: ExportacionComponent ,
                data: {
                  title: "Dashboard comercial exportación"
                }
            },
            {
                path: 'ventasInretail',
                component: InretailComponent ,
                data: {
                  title: "Dashboard comercial ventas inretail"
                }
            },
            {
                path: 'rentabilidad',
                component: RentabilidadComponent ,
                data: {
                  title: "Dashboard comercial rentabilidad"
                }
            },
            {
              path: 'rentabilidadEstrategica',
              component: RentabilidadEstrategicoComponent ,
              data: {
                title: "Dashboard comercial rentabilidad estratégica"
              }
          },
          {
            path: 'drogueria',
            component: DrogueriaComponent ,
            data: {
              title: "Dashboard drogueria"
            }
        },
        ]
    },
    {
        path: 'produccion',
        canActivateChild: [AuthGuard],
        children : [
            {
                path: 'pedidosArima',
                component: PedidoArimaComponent ,
                data: {
                  title: "Dashboard producción pedidos arima"
                }
            },
            {
              path: 'seguimiento-operaciones',
              component: SeguimientoOperacionesComponent ,
              data: {
                title: "Dashboard seguimiento operaciones"
              }
          }
        ]
    }
]
