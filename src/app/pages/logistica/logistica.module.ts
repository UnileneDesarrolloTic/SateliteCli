import { FeatherModule } from "angular-feather";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LogisticaRoutes } from "./logistica.routing";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ComponenteModule } from "@shared/components/componente.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MaestroItemComponent } from './maestro-item/maestro-item.component';
import { GestionGuiasComponent } from './gestion-guias/gestion-guias.component';
import { ConsultarStockVentasComponent } from './consultar-stock-ventas/consultar-stock-ventas.component';
import { DetalleItemVentasComponent } from './consultar-stock-ventas/detalle-item-ventas/detalle-item-ventas.component';
import { TagResumenComponent } from './consultar-stock-ventas/tag-resumen/tag-resumen.component';
import { TagDetalleComponent } from './consultar-stock-ventas/tag-detalle/tag-detalle.component';
import { ModalDetalleComprometidoComponent } from './consultar-stock-ventas/modal-detalle-comprometido/modal-detalle-comprometido.component';


@NgModule({
  declarations:
  [ MaestroItemComponent, GestionGuiasComponent, ConsultarStockVentasComponent, DetalleItemVentasComponent, TagResumenComponent, TagDetalleComponent, ModalDetalleComprometidoComponent],
  imports:
  [
    RouterModule.forChild(LogisticaRoutes),
    CommonModule,
    FeatherModule,
    ComponenteModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
  ],
  exports:
  [
    MaestroItemComponent,
    GestionGuiasComponent
  ],
})
export class LogisticaModule { }
