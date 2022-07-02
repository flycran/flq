import { FromOption, WhereOption, FieldOption } from './index';
export declare function from(option: FromOption): string;
export declare function field(option: FieldOption): string;
export declare function where(option: WhereOption, op?: WhereOption.Op): string;
export declare function order(param: any): string;
export declare function limit(param: any): string;
export declare function value(param: any): string;
export declare function set(param: any): string;
