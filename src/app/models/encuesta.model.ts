import { Option } from '../@core/models/option.model';
export class Encuesta {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  estado: number;
  preguntas: Pregunta[];
  estados: Option[];
}

export class Pregunta {
  id: number;
  encuestaId: number;
  codigo: string;
  nombre: string;
  orden: number;
  estado: number;
  alternativas: Alternativa[];
}

export class Alternativa {
  id: number;  
  preguntaId: number;
  codigo: string;
  nombre: string;
  orden: number;
  estado: number;
  esOtro: boolean;
}

export class RespuestaEncuesta {
  clienteId: number;
  financiamientoId: number;
  encuestaId: number;
  respuestaList: RespuestaPregunta[];
}

export class RespuestaPregunta {
  preguntaId: number;
  alternativaId: number;
  descripcion: string;
}
