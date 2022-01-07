import { MenuInfo } from "@data/interface/menu.model";

export const MENU_DATA: MenuInfo[] = [
  {
    codigo: 1,
    ruta: '',
    titulo: 'PrincipaL',
    icono: 'mdi mdi-dots-horizontal',
    clase: 'nav-small-cap',
    claseEtiqueta: '',
    extraLink: true,
    menuPadre: 0,
    subMenu: []
  },
  {
    codigo: 2,
    ruta: '/Home',
    titulo: 'Home',
    icono: 'home',
    clase: '',
    claseEtiqueta: 'side-badge badge badge-info',
    extraLink: false,
    menuPadre: 1,
    subMenu: []
  },
];
