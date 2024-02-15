import { LocalGridComponent } from '../../components/local-grid/local-grid.component';

export interface PrimeTable {
  columnas?: Column[];
  data?: any;
  totalRegistros?: number;
  options?: OptionsColumn;
  customOperations?: CustomOperation[];
}

export interface PrimeTableEditable {
  columnas?: InLineColumn[];
  data?: any;
  totalRegistros?: number;
  search?: boolean;
  canAdd?: boolean;
  canCheck?: boolean;
  canDelete?: boolean;
}

export interface CustomOperation {
  icon?: string;
  title?: string;
  type: 'Material' | 'Bootstrap';
  visibilidity?(entity: any): boolean;
  click(entity: any): void;
}

export interface Column {
  field: string;
  header: string;
  search?: boolean;
  order?: boolean;
  width?: number;
  visible?: boolean;
}

export interface OptionsColumn {
  showAdd: boolean;
  showSearch: boolean;
  showDelete: boolean;
  showChangeState: boolean;
  showIndex: boolean;
  showEdit: boolean;
  accionesWidth?: number;
  showStateColor?: boolean;
  documento?: boolean
}

export class PrimeTableResponse {
  public count: number;
  public entities: any[];

  constructor() {}
}

export class EditInlinePrimeTable {
  constructor(
    public columnas?: InLineColumn[],
    public data?: any,
    public totalRegistros: number = 0,
    public search: boolean = true,
    public canAdd: boolean = true,
    public canCheck: boolean = false,
    public canDelete: boolean = true
  ) {}
}

export interface InLineColumn {
  field: string;
  header: string;
  search: boolean;
  order: boolean;
  width?: number;
  editable: boolean;
  controlInput: string;
  controlOutput: string;
  visible: boolean;
}

export interface AutoCompleteParameter {
  event: any;
  column: InLineColumn;
  gridComponent: LocalGridComponent;
}
