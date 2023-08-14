import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule,DecimalPipe,registerLocaleData } from '@angular/common';
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
import { MiniTablaDetalleComponent } from './gestion/seguimiento-orden-compra/mini-tabla-detalle/mini-tabla-detalle.component';
import { ModalVisualizarDetalleImportacionComponent } from './gestion/seguimiento-orden-compra/modal-visualizar-detalle-importacion/modal-visualizar-detalle-importacion.component';
import { OcDrogueriaComponent } from './arima/oc-drogueria/oc-drogueria.component';
import { CompraAgujaComponent } from './arima/compra-aguja/compra-aguja.component';
import { ComponenteModule } from '@shared/components/componente.module';
import { OrdenCompraDrogueriaComponent } from './arima/oc-drogueria/orden-compra-drogueria/orden-compra-drogueria.component';
import { ListarOrdenCompraPrevioComponent } from './arima/oc-drogueria/listar-orden-compra-previo/listar-orden-compra-previo.component';
import { CompraNacionalImportacionComponent } from './arima/compra-nacional-importacion/compra-nacional-importacion.component';
import { ProgramacionComponent } from './gestion/programacion/programacion.component';
import { RegistroFechaInicioEntregaComponent } from './gestion/programacion/registro-fecha-inicio-entrega/registro-fecha-inicio-entrega.component';
import { DividirProgramacionComponent } from './gestion/programacion/dividir-programacion/dividir-programacion.component';
import { EncajeComponent } from './encajado/encaje/encaje.component';
import { ProductoTerminadoTransferidoComponent } from './transferencia/producto-terminado-transferido/producto-terminado-transferido.component';

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
    TagResumenComponent,
    MiniTablaDetalleComponent,
    ModalVisualizarDetalleImportacionComponent,
    OcDrogueriaComponent,
    CompraAgujaComponent,
    OrdenCompraDrogueriaComponent,
    ListarOrdenCompraPrevioComponent,
    CompraNacionalImportacionComponent,
    ProgramacionComponent,
    RegistroFechaInicioEntregaComponent,
    DividirProgramacionComponent,
    ProductoTerminadoTransferidoComponent,
    EncajeComponent,
  ],
  imports: [
    RouterModule.forChild(ProduccionRoutes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    CommonModule,
    NgxDatatableModule,
    ComponenteModule,
    FormsModule,
    NgbModule,
    NotifierModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [DecimalPipe]
})
export class ProduccionModule { }
