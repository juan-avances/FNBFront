import { Option } from '../@core/models/option.model';

export interface FinanciamientoDatosGenerales {
  aliadoComercial: string;
  cliente: string;
  numeroDocumento: string;
  sede: string;
  cuentaContrato: string;
  lineaCredito: number;
  nroDocumento: string;
  tipoDocumento: string;
}

export interface FinanciamientoForm {
  id: number;

  tipoDespacho: number;
  totalMonto: number;
  fechaVenta: Date;
  correoElectronico: string;
  nroCuota: string;
  pagoMensual: string;
  tasaMensual:number;
  montoEvaluar:number;
  nroCuota2:number
  montoTotales:number;

  fechaEntrega: Date;
  nroBoleta: string;
  tipoTelefono: string;
  tipoTelefonoOp: string;
  numeroTelefono: string;
  nroTelefonoOp: string;

  canalVentaId: number;
  vendedor: number;
  vendedorS: string;
  montoCuota: number;

  aliadoComercialId: number;
  sedeId: number;
  detalle: ComboProducto[];

  cuentaContrato: string;
  nroPedidoVenta: string;
  nroDocumento: string;
  tipoDocumento: string;

  tipoPago: number;
  clienteId: number;
  idConsulta: number;
  fechaEntregaFinal: Date;
  nroDiasRango: number;

  despacho: Despacho;

  pagoenTienda: number;
  montoPagado: number;
  validacionReniec:boolean;
}

export interface FinanciamientoListas {
  vendedores: Option[];
  sedes: Option[];
  departamentos: Option[];
  tipoVenta: Option[];
  canales: Option[];
}

export interface Producto {
  label: string;
  value: number;
  ismodificable: boolean;
  sedes: number;
  aliadoId: number;
  aliado: string;
  aliadoSku: string;
  aliadoPrecio: number;
  idProducto: number;
  descripcion: string;
  precio: number;
  sku: string;
  cantidad: number;
  tipo: string;
  stock: number;
}

export interface ProductoManual {
  label: string;
  value: number;
  ismodificable: boolean;
  sedes: number;
  aliadoId: number;
  aliado: string;
  aliadoSku: string;
  aliadoPrecio: number;
  idProducto: number;
  descripcion: string;
  precio: number;
  sku: string;
  cantidad: string;
  tipo: string;
}

export interface ComboProducto {
  data?: any;
  children?: ComboProducto[];
  expanded?: boolean;
}

export interface Despacho {
  selected?: boolean;
  calleDespacho?: string;
  referenciaDespacho?: string;
  fechaRecojo?: Date;
  horarioRecojo?: number;
  costoEnvioDespacho?: string;
  quienRecibe?: number;
  departamentoId?: number;
  provinciaId?: number;
  distritoId?: number;
  tipoDespacho?: number;
  otraSedeTiendaId?: number;
  otraPersona?: Persona;
  nroBoleta?: string;
}

export interface Persona {
  dni?: string;
  nombre?: string;
  parentesco?: string;
}

export interface Financiamiento {
  datosGenerales: FinanciamientoDatosGenerales;
  datosFormulario: FinanciamientoForm;
  listas: FinanciamientoListas;
}

export interface PlanCuotas {
  cuota3: number;
  cuota6: number;
  cuota9: number;
  cuota12: number;
  cuota18: number;
  cuota24: number;
  cuota36: number;
  cuota48: number;
  cuota60: number;
}

export interface FinanciamientoPagination {
  aliadoComercial: string;
  sede: string;
  nroContrato: string;
  cliente: string;
  fechaVenta: Date;
  fechaEntrega: Date;
  importe: number;
  nroPedido: string;
  estadoNombre: string;
}

export interface FinanciamientoListInit {
  estado: number;
  vendedor: number;
  fechaVenta: Date;
  fechaEntrega: Date;
  nroContrato: string;
  nroPedido: string;
  aliadoId: number;
  sedeId: number;
  tipoDocumento: string;
  nroDocumento: string;
  categoriaId: number;
  canalId: number;
  estados: Option[];
  sedes: Option[];
  aliados: Option[];
  proveedores:Option[];
  categorias: Option[];
  tiposDocumento: Option[];
  canales: Option[];
}
export interface FinanciamientoArchivoDto {
  Id: number;
  FinanciamientoId: number;
  Descripcion: string;
  idTipoArchivo: number;
  NombreArchivo: string;
  Base64Logo: string;
  idDocumento: number;
}

export interface DocumentoComentario{
  id: number;
  idDesplegablesTipo: number;
  idDocumento:number;
  idFinanciamientoArchivo: number;
  isActive:boolean;
  idUser:number;
}