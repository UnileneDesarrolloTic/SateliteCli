import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProduccionRoutes } from './produccion.routing';
import { SeguimientoCandidatosProComponent } from './pronostico/seguimiento-candidatos-pro/seguimiento-candidatos-pro.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogPedidosCreadosComponent } from './pronostico/log-pedidos-creados/log-pedidos-creados.component';
import { NotifierModule } from 'angular-notifier';
import { SeguimientoCandidatoMpComponent } from './pronostico/seguimiento-candidato-mp/seguimiento-candidato-mp.component';
import { ProductosArimaComponent } from './arima/productos-arima/productos-arima.component';

@NgModule({
  declarations: [
    SeguimientoCandidatosProComponent,
    LogPedidosCreadosComponent,
    SeguimientoCandidatoMpComponent,
    ProductosArimaComponent
  ],
  imports: [
    RouterModule.forChild(ProduccionRoutes),
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    NgbModule,
    NotifierModule,
    ReactiveFormsModule,
  ]
})
export class ProduccionModule { }
