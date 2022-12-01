import { FilterInfo } from './filter-info';

/**Информация о колонке*/
export class ColumnInfo {

    /**Сортировка текущей колонки*/
    columnSort = ColumnSort.None;

    /**Порядок сортировок если несклько колонок*/
    columnSortNumber = 0;

    /**Конструктор*/
    constructor(public name: string,
        public comment: string,
        public allowSort = true,
        public filterInfo: FilterInfo = new FilterInfo(''),
        public columnFormat: ColumnFormat = ColumnFormat.Default,
        public editable = false,
        public columnSummary: ColumnSummary = ColumnSummary.None) {
    }
}

/**Форматы колонки*/
export enum ColumnFormat {
    Date,
    Datetime,
    Number,
    Currency,
    Default,
    Boolean,
    Picture,
    Template
}

/**Форматы колонки*/
export enum ColumnSummary {
    Sum,
    Avg,
    Min,
    Max,
    None,
}


/**Сортировки колонки*/
export enum ColumnSort {
    Ask,
    Desc,
    None
}
