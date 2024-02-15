import { Option } from '../@core/models/option.model';
export interface OptionToggle extends Option {
  state: boolean;
  enabled: boolean;
}
