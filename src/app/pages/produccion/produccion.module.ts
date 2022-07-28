import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProduccionRoutes } from './produccion.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotifierModule } from 'angular-notifier';
import { MateriaPrimaComponent } from './arima/materia-prima/materia-prima.component';
import { LogPedidosAutomaticosComponent } from './arima/log-pedidos-automaticos/log-pedidos-automaticos.component';
import { ProductoTerminadoComponent } from './arima/producto-terminado/producto-terminado.component';
import { CompraMateriaPrimaComponent } from './arima/compra-materia-prima/compra-materia-prima.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EtiquetasComponent } from './gestion/etiquetas/etiquetas.component';

@NgModule({
  declarations: [
    MateriaPrimaComponent,
    LogPedidosAutomaticosComponent,
    ProductoTerminadoComponent,
    CompraMateriaPrimaComponent,
    EtiquetasComponent
  ],
  imports: [
    RouterModule.forChild(ProduccionRoutes),
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    NgbModule,
    NotifierModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule
  ]
})
export class ProduccionModule { }
