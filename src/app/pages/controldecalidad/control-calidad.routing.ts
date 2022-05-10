import { CertificadoComponent } from '@pages/controldecalidad/esterilizacion/certificado/certificado.component';
import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { FrmControlAgujaComponent } from '@pages/controldecalidad/agujas/frm-control-aguja/frm-control-aguja.component';
import { ImprimirAnalisisComponent } from '@pages/controldecalidad/analisis-agujas/imprimir-analisis/imprimir-analisis.component';
import { RegistrarAnalisisComponent } from '@pages/controldecalidad/analisis-agujas/registrar-analisis/registrar-analisis.component';

export const ControlCalidadRoutes: Routes = [
  {
    path: 'esterilizacion',
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
    children : [
      {
        path: 'prueba',
        component: FrmControlAgujaComponent,
        data: {
          title: "Certificado de Esterilización"
        }
      },
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
    ],
  },
]
