import { FullComponent } from '@layout/full/full.component';
import { Routes } from '@angular/router';
import { BlankComponent } from '@layout/blank/blank.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/Home', pathMatch: 'full' },
      {
        path:'Home',
        loadChildren: () => import('@pages/home/starter.module').then(m => m.StarterModule)
      },
      {
        path:'Cuenta',
        loadChildren: () => import('@pages/cuenta/cuenta.module').then( m => m.CuentaModule)
      },
      {
        path:'Administracion',
        loadChildren:() => import('@pages/administracion/administracion.module').then(m => m.AdministracionModule)
      },
      {
        path:'Produccion',
        loadChildren:() => import('@pages/produccion/produccion.module').then(m => m.ProduccionModule)
      },
      {
        path:'ControlCalidad',
        loadChildren:() => import('@pages/controldecalidad/control-calidad.module').then(m => m.ControlCalidadModule)
      },
      {
        path:'Dashboard',
        loadChildren:() => import('@pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path:'Comercial',
        loadChildren:() => import('@pages/comercial/comercial.module').then(m => m.ComercialModule)
      },
      {
        path:'RRHH',
        loadChildren:() => import('@pages/rrhh/rrhh.module').then(m => m.RRHHModule)
      },
      {
        path:'Contabilidad',
        loadChildren:() => import('@pages/contabilidad/contabilidad.module').then(m => m.ContabilidadModule)
      },
      {
        path:'Licitaciones',
        loadChildren:() => import('@pages/licitaciones/licitaciones.module').then(m => m.LicitacionesModule)
      },
      {
        path:'Logistica',
        loadChildren:() => import('@pages/logistica/logistica.module').then(m => m.LogisticaModule)
      },
      {
        path:'FirmaDigital',
        loadChildren:() => import('@pages/firma-digital/firma-digital.module').then(m => m.FirmaDigitalModule)
      },
      {
        path:'GestionCalidad',
        loadChildren:() => import('@pages/gestion-calidad/gestion-calidad.module').then(m => m.GestionCalidadModule)
      },
      {
        path:'Exportaciones',
        loadChildren:() => import('@pages/exportaciones/exportaciones.module').then(m => m.ExportacionesModule)
      }
    ]
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path:'authentication',
        loadChildren: () => import('@auth/auth.module').then( m => m.AuthModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'authentication/404'
  }
];

