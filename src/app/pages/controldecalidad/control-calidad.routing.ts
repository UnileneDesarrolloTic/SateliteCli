import { CertificadoComponent } from '@pages/controldecalidad/esterilizacion/certificado/certificado.component';
import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { ImprimirAnalisisComponent } from '@pages/controldecalidad/analisis-agujas/imprimir-analisis/imprimir-analisis.component';
import { RegistrarAnalisisComponent } from '@pages/controldecalidad/analisis-agujas/registrar-analisis/registrar-analisis.component';
import { GestionContraMuestraComponent } from './gestion-contra-muestra/gestion-contra-muestra.component';
import { ControlLotesComponent } from './control-lotes/control-lotes.component';
import { AdministracionProtocoloComponent } from './administracion-protocolo/administracion-protocolo.component';
import { FormatoProtocoloComponent } from './formato-protocolo/formato-protocolo.component';
import { ControlProcesoComponent } from './formato-protocolo/control-proceso/control-proceso.component';
import { ControlProductoTerminadoComponent } from './formato-protocolo/control-producto-terminado/control-producto-terminado.component';
import { PruebasEfectuadasComponent } from './formato-protocolo/pruebas-efectuadas/pruebas-efectuadas.component';
import { ConfirmExitGuard } from '@guard/confirm-exit.guard';

export const ControlCalidadRoutes: Routes = [
  {
    path: 'esterilizacion',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'certificado',
        component: CertificadoComponent,
        data: {
          title: "Certificado de Esterilización",
          urls: [
            {title: 'Certificado de Esterilización' }
          ]
        }
      },
    ]
  },
  {
    path: 'analisis-agujas',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'imprimir-analisis',
        component: ImprimirAnalisisComponent,
        data: {
          title: "Imprimir análisis de agujas"
        }
      },
      {
        path: 'registrar-analisis',
        component: RegistrarAnalisisComponent,
        data: {
          title: "Registrar los análisis de agujas"
        }
      },
      {
        path: 'pruebas-agujas/:codAnalisis',
        loadChildren: () => import('@pages/controldecalidad/analisis-agujas/registrar-pruebas/registrar-pruebas.module').then(m => m.RegistrarPruebasModule)
      }
    ],
  },
  {
    path: 'Gestion',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'ContraMuestra',
        component: GestionContraMuestraComponent,
        data: {
          title: "Gestión contra muestra",
          urls: [
            {title: 'Gestión contra muestra' }
          ]
        }
      },
      {
        path: 'ControlLotes',
        component: ControlLotesComponent,
        data: {
          title: "Control de lotes",
          urls: [
            {title: 'Control de lotes' }
          ]
        }
      },
      {
        path: 'AdministracionProtocolo',
        component: AdministracionProtocoloComponent,
        data: {
          title: "Administración de Protocolo",
          urls: [
            {title: 'Administración de Protocolo' }
          ]
        }
      },
    ]
  },

  {
    path: 'Protocolo',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'principal',
        component: FormatoProtocoloComponent,
        data: {
          title: "Control de Protocolos"
        }
      },
      {
        path: 'ControlProceso/:NumeroLote',
        canDeactivate: [ConfirmExitGuard],
        component: ControlProcesoComponent,
        data: {
          title: "Control en proceso - Interno",
          urls: [
            { title: 'Control en proceso - Interno'},
            { title: 'Protocolo' }
          ]
        },
      },
      {
        path: 'ControlProductoTerminado/:NumeroLote',
        canDeactivate: [ConfirmExitGuard],
        component: ControlProductoTerminadoComponent,
        data: {
          title: "Control Producto Terminado",
          urls: [
            { title: 'Control Producto Terminado'},
            { title: 'Protocolo' }
          ]
        },
      },
      {
        path: 'PruebaEfectuadas/:NumeroLote/NumeroParte/:NumeroParte',
        canDeactivate: [ConfirmExitGuard],
        component: PruebasEfectuadasComponent,
        data: {
          title: "Formato Pruebas Efectuadas",
          urls: [
            { title: 'Formato Pruebas Efectuadas'},
            { title: 'Protocolo' }
          ]
        },
      },
    ],
  },
]
