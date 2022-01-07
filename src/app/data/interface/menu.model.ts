
export interface MenuInfo {
  codigo: number;
  ruta: string;
  titulo: string;
  icono: string;
  clase: string;
  claseEtiqueta: string;
  extraLink: boolean;
  menuPadre: number;
  subMenu: MenuInfo[];
}
