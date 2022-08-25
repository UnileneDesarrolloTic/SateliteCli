import { NgModule } from '@angular/core';
import { CommonModule,registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { RouterModule } from '@angular/router';
import { ProduccionRoutes } from './produccion.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotifierModule } from 'angular-notifier';
import { MateriaPrimaComponent } from './arima/materia-prima/materia-prima.component';
import { LogPedidosAutomaticosComponent } from './arima/log-pedidos-automaticos/log-pedidos-automaticos.component';
import { ProductoTerminadoComponent } from './arima/producto-terminado/producto-terminado.component';
import { CompraMateriaPrimaComponent } from './arima/compra-materia-prima/compra-materia-prima.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EtiquetasComponent } from './gestion/etiquetas/etiquetas.component';
import { SeguimientoOrdenCompraComponent } from './gestion/seguimiento-orden-compra/seguimiento-orden-compra.component';
import { ModalInformacionItemComponent } from './gestion/seguimiento-orden-compra/modal-informacion-item/modal-informacion-item.component';
import { TagResumenComponent } from './gestion/seguimiento-orden-compra/tag-resumen/tag-resumen.component';


registerLocaleData(localeEs);


@NgModule({
  declarations: [
    MateriaPrimaComponent,
    LogPedidosAutomaticosComponent,
    ProductoTerminadoComponent,
    CompraMateriaPrimaComponent,
    EtiquetasComponent,
    SeguimientoOrdenCompraComponent,
    ModalInformacionItemComponent,
    TagResumenComponent
  ],
  imports: [
    RouterModule.forChild(ProduccionRoutes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
  }),
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
