import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { PedidosComponent } from '@pages/dashboard/comercial/pedidos/pedidos.component';
import { VentasComponent } from '@pages/dashboard/comercial/ventas/ventas.component';
import { ExportacionComponent } from '@pages/dashboard/comercial/exportacion/exportacion.component';
import { PedidoArimaComponent } from '@pages/dashboard/produccion/pedido-arima/pedido-arima.component';
import { InretailComponent } from '@pages/dashboard/comercial/inretail/inretail.component'
import { RentabilidadComponent } from '@pages/dashboard/comercial/rentabilidad/rentabilidad.component'
import { SegUnishopB2cComponent } from '@pages/dashboard/comercial/seg-unishop-b2c/seg-unishop-b2c.component'
import { SegOperacionesComercialComponent } from '@pages/dashboard/comercial/seg-operaciones-comercial/seg-operaciones-comercial.component'
import { EstadosFinancierosComponent } from '@pages/dashboard/comercial/estados-financieros/estados-financieros.component'
import { RentabilidadEstrategicoComponent } from '@pages/dashboard/comercial/rentabilidad-estrategico/rentabilidad-estrategico.component';
import { DrogueriaComponent } from "@pages/dashboard/comercial/drogueria/drogueria.component";
import { SeguimientoOperacionesComponent } from "@pages/dashboard/produccion/seguimiento-operaciones/seguimiento-operaciones.component";
import { SegProcesosComponent } from "@pages/dashboard/comercial/seg-procesos/seg-procesos.component";
import { DesempenioArimaComponent } from "@pages/dashboard/produccion/desempenio-arima/desempenio-arima.component";
import { ObligacionesFinancierasComponent } from "@pages/dashboard/comercial/obligaciones-financieras/obligaciones-financieras.component";
import { GestionCalidadComponent } from "@pages/dashboard/produccion/gestion-calidad/gestion-calidad.component";
import { ExportacionBoliviaComponent } from "@pages/dashboard/comercial/exportacion-bolivia/exportacion-bolivia.component";
import { BioleneComponent } from "./comercial/biolene/biolene.component";
import { SeguimientoCobranzaComponent } from "./comercial/seguimiento-cobranza/seguimiento-cobranza.component";

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
              path: 'procesos',
              component: SegProcesosComponent ,
              data: {
                title: "Dashboard Seguimiento de Licitaciones"
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
          {
            path: 'unishop-b2c',
            component: SegUnishopB2cComponent ,
            data: {
              title: "Unishop B2C"
            }
          },
          {
            path: 'operaciones-comercial',
            component: SegOperacionesComercialComponent ,
            data: {
              title: "Operaciones Comercial"
            }
          },
          {
            path: 'estados-financieros',
            component: EstadosFinancierosComponent ,
            data: {
              title: "Estados Financieros"
            }
          },
          {
            path: 'ObligacionesFinanciera',
            component: ObligacionesFinancierasComponent ,
            data: {
              title: "Obligaciones Financieras"
            }
          },
          {
            path: 'exportacion-bolivia',
            component: ExportacionBoliviaComponent,
            data: {
              title: "Seg. Expo. Bolivia"
            }
          },
          {
            path: 'biolene',
            component: BioleneComponent,
            data: {
              title: "Dashboard Biolene"
            }
          },
          {
            path: 'SeguimientoCobranza',
            component: SeguimientoCobranzaComponent,
            data: {
              title: "Seguimiento de Cobranza"
            }
          }
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
              path: 'DesempenioArima',
              component: DesempenioArimaComponent ,
              data: {
                title: "Desempeño arima y stocks"
              }
            },
            {
              path: 'seguimiento-operaciones',
              component: SeguimientoOperacionesComponent ,
              data: {
                title: "Dashboard seguimiento operaciones"
              }
            },
            {
              path: 'GestionCalidad',
              component: GestionCalidadComponent ,
              data: {
                title: "Dashboard Gestión de la Calidad"
              }
            },
        ]
    }
]
