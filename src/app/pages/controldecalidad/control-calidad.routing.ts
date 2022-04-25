import { CertificadoComponent } from '@pages/controldecalidad/esterilizacion/certificado/certificado.component';
import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { FrmControlAgujaComponent } from './agujas/frm-control-aguja/frm-control-aguja.component';

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

    ],
  },

  {
    path: 'agujas',
    canActivate: [AuthGuard],
    children : [
      {
        path: 'prueba',
        component: FrmControlAgujaComponent,
        data: {
          title: "Certificado de Esterilización",
          urls: [
            {title: 'Certificado de Esterilización' }
          ]
        }
      },

    ],
  },
   
]
