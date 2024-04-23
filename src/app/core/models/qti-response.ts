import { Cardinality, BaseType } from '@abuenameh/qti-components';

export interface QtiResponse {
  identifier: string;
  cardinality: Cardinality;
  baseType: BaseType;
  value: string;
  values: string[];
}
