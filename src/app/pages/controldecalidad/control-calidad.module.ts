import { FeatherModule } from 'angular-feather';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ControlCalidadRoutes } from './control-calidad.routing';
import { ComponenteModule } from '@shared/components/componente.module';
import { CertificadoComponent } from '@pages/controldecalidad/esterilizacion/certificado/certificado.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ImprimirAnalisisComponent } from './analisis-agujas/imprimir-analisis/imprimir-analisis.component';
import { RegistrarAnalisisComponent } from './analisis-agujas/registrar-analisis/registrar-analisis.component';
import { GestionContraMuestraComponent } from './gestion-contra-muestra/gestion-contra-muestra.component';
import { ModalKardexInternoComponent } from './gestion-contra-muestra/modal-kardex-interno/modal-kardex-interno.component';
import { ControlLotesComponent } from './control-lotes/control-lotes.component';
import { AdministracionProtocoloComponent } from './administracion-protocolo/administracion-protocolo.component';
import { NumeroParteComponent } from './administracion-protocolo/numero-parte/numero-parte.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AtributosComponent } from './administracion-protocolo/atributos/atributos.component';
import { DescripcionComponent } from './administracion-protocolo/descripcion/descripcion.component';
import { LeyendaComponent } from './administracion-protocolo/leyenda/leyenda.component';
import { PruebasComponent } from './administracion-protocolo/pruebas/pruebas.component';
import { DescripcionNuevoEditarComponent } from './administracion-protocolo/descripcion/descripcion-nuevo-editar/descripcion-nuevo-editar.component';
import { LeyendaNuevoEditarComponent } from './administracion-protocolo/leyenda/leyenda-nuevo-editar/leyenda-nuevo-editar.component';
import { PruebaNuevoEditComponent } from './administracion-protocolo/pruebas/prueba-nuevo-edit/prueba-nuevo-edit.component';
import { FormatoProtocoloComponent } from './formato-protocolo/formato-protocolo.component';
import { ControlProcesoComponent } from './formato-protocolo/control-proceso/control-proceso.component';
import { ControlProductoTerminadoComponent } from './formato-protocolo/control-producto-terminado/control-producto-terminado.component';
import { PruebasEfectuadasComponent } from './formato-protocolo/pruebas-efectuadas/pruebas-efectuadas.component';
import { ModalElegirDocumentoComponent } from './formato-protocolo/pruebas-efectuadas/modal-elegir-documento/modal-elegir-documento.component';
import { ListaAnalisisComponent } from './analisis-mp/lista-analisis/lista-analisis.component';
import { AnalisisHebraComponent } from './analisis-mp/analisis-hebra/analisis-hebra.component';



@NgModule({
  declarations: [
    CertificadoComponent,
    ImprimirAnalisisComponent,
    RegistrarAnalisisComponent,
    GestionContraMuestraComponent,
    ModalKardexInternoComponent,
    ControlLotesComponent,
    AdministracionProtocoloComponent,
    NumeroParteComponent,
    AtributosComponent,
    DescripcionComponent,
    LeyendaComponent,
    PruebasComponent,
    DescripcionNuevoEditarComponent,
    LeyendaNuevoEditarComponent,
    PruebaNuevoEditComponent,
    FormatoProtocoloComponent,
    ControlProcesoComponent,
    ControlProductoTerminadoComponent,
    PruebasEfectuadasComponent,
    ModalElegirDocumentoComponent,
    ListaAnalisisComponent,
    AnalisisHebraComponent,

  ],
  imports: [
    RouterModule.forChild(ControlCalidadRoutes),
    CommonModule,
    FeatherModule,
    ComponenteModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgMultiSelectDropDownModule,
    NgxDatatableModule,
  ],
  exports: [
    CertificadoComponent,
    GestionContraMuestraComponent
  ],
  providers: [DecimalPipe]
})

export class ControlCalidadModule { }
