export class Option {
  public label: string;
  public value: string;
  public isModificable?: boolean;
}

export interface State {
  id: number;
  state: boolean;
}
