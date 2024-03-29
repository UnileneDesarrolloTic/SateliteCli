import { FeatherModule } from "angular-feather";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LicitacionesRoutes } from "./licitaciones.routing";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ComponenteModule } from "@shared/components/componente.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NuevoProcesoComponent } from './listar-proceso/nuevo-proceso/nuevo-proceso.component';
import { ListarProcesoComponent } from "./listar-proceso/listar-proceso.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { DistribucionProcesoComponent } from './distribucion-proceso/distribucion-proceso.component';
import { ProgramacionProcesoComponent } from './listar-proceso/programacion-proceso/programacion-proceso.component';
import { ProcesoMuestraEnsayoComponent } from './listar-proceso/proceso-muestra-ensayo/proceso-muestra-ensayo.component';
import { GuiaInformeComponent } from './listar-proceso/guia-informe/guia-informe.component';
import { ModalEditaGuiainformeComponent } from './listar-proceso/modal-edita-guiainforme/modal-edita-guiainforme.component';
import { ContratoProcesoComponent } from './listar-proceso/contrato-proceso/contrato-proceso.component';
import { ModalOrdenCompraComponent } from './listar-proceso/modal-orden-compra/modal-orden-compra.component';
import { SeguimientoOrdenCompraComponent } from './listar-proceso/seguimiento-orden-compra/seguimiento-orden-compra.component';


@NgModule({
  declarations: [NuevoProcesoComponent, ListarProcesoComponent, DistribucionProcesoComponent, ProgramacionProcesoComponent, ProcesoMuestraEnsayoComponent, GuiaInformeComponent, ModalEditaGuiainformeComponent, ContratoProcesoComponent, ModalOrdenCompraComponent, SeguimientoOrdenCompraComponent],
  imports: [
    RouterModule.forChild(LicitacionesRoutes),
    CommonModule,
    FeatherModule,
    ComponenteModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgApexchartsModule
  ],
  exports: [NuevoProcesoComponent, ListarProcesoComponent, DistribucionProcesoComponent, ProcesoMuestraEnsayoComponent,GuiaInformeComponent,ModalEditaGuiainformeComponent],
})
export class LicitacionesModule { }
