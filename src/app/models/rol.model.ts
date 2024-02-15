export class Rol {
    constructor(
      public id?: number,
      public nombre?: string,
      public descripcion?: string,
      public estado?: number,
      public esAliado?: boolean,
      public esAdministradorAliado?: boolean,
    ) {}
  }