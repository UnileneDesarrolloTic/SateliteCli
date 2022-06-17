import { CertificadoComponent } from '@pages/controldecalidad/esterilizacion/certificado/certificado.component';
import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { ImprimirAnalisisComponent } from '@pages/controldecalidad/analisis-agujas/imprimir-analisis/imprimir-analisis.component';
import { RegistrarAnalisisComponent } from '@pages/controldecalidad/analisis-agujas/registrar-analisis/registrar-analisis.component';
import { PruebaFlexionComponent } from '@pages/controldecalidad/analisis-agujas/registrar-pruebas/prueba-flexion/prueba-flexion.component';
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
]
