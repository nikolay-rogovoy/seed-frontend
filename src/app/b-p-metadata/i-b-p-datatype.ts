import { IMetadataTable } from '../metadata/i-metadata-table';

/***/
export interface IBPDatatype extends IMetadataTable {
    /**Булл*/
    boolean: number;
    /**Целое*/
    int: number;
    /**С плавающей точкой*/
    real: number;
    /**Дата*/
    date: number;
    /**Дата и время*/
    datetime: number;
    /**Строка*/
    string: number;
    /***/
    doublePrecision: number;
}
