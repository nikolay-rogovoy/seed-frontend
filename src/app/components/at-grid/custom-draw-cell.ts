import { ICustomDrawCellArgs } from './i-custom-draw-cell-args';
import { ColumnInfo } from './column-info';

export type CustomDrawCell = (row: object, column: ColumnInfo) => ICustomDrawCellArgs
