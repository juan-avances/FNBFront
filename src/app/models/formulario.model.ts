import { Accion } from './accion.model';

export class Formulario {
  constructor(
    public id?: number,
    public Modulo?: string,
    public Formulario?: string,
    public TipoAccionNombre?: string,
    public Acciones?: Accion[]
  ) {}
}

export class FormularioMenu {
  constructor(
    public id?: number,
    public label?: string,
    public link?: string,
    public faIcon?: string,
    public parentId?: number,
    public order?: number,
    public items?: FormularioMenu[],
    public externalRedirect: boolean = true
  ) {}
}
