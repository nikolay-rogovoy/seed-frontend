import {
  AfterViewChecked, ChangeDetectorRef, Component, ElementRef,
  EventEmitter, Input, OnInit, Output,
  QueryList, ViewChild, ViewChildren
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChangedCellArgs } from './changed-cell-args';
import { ColumnFormat, ColumnInfo, ColumnSort, ColumnSummary } from './column-info';
import { CustomDrawCell } from './custom-draw-cell';

@Component({
  moduleId: module.id,
  selector: 'app-at-grid',
  styleUrls: ['at-grid.css'],
  templateUrl: 'at-grid.html'
})
/***/
export class AtGridComponent implements OnInit, AfterViewChecked {

  /***/
  @ViewChildren('input')
  controls: QueryList<ElementRef>;

  /***/
  selectedInput: ChangedCellArgs;

  /**Данные*/
  @Input()
  data: Array<Object> = [];

  /**Колонки*/
  @Input()
  metaData: ColumnInfo[] = [];

  /**Количество строк на странице*/
  @Input()
  quRowOnPage = 10;

  /**Количество строк на странице*/
  @Input()
  id: number = Math.round(Math.random() * 1000000);

  /**Статический режим*/
  @Input()
  staticMode = true;

  /**Текущая страница*/
  @Input()
  currentPage = 0;

  /**Текущая страница*/
  @Input()
  imageSize = 100;

  /**Для установки стиля ячейки (row: Object, column: ColumnInfo) => {({'background-color': 'red'})}*/
  @Input()
  callbackSetCellStyle: Function;

  /**Имя грида для хранения лайаутов*/
  @Input()
  name = 'at-grid';

  /**Выделене какой-то позиции*/
  @Output()
  onSelect = new EventEmitter<Object>();

  @Input()
  readOnly = false;

  /**Форма*/
  @ViewChild('myForm')
  form: NgForm;

  /**Номер строки с наведенной мышкой*/
  rowNumMouseOver: number;

  /**Ячейка под указателем*/
  cellOver: ColumnInfo;

  /**Выделене какой-то позиции*/
  @Output()
  onLoad = new EventEmitter<number>();

  /***/
  @Output()
  onChanged = new EventEmitter<ChangedCellArgs>();

  /**Энум в компонет*/
  public columnFormat = ColumnFormat;

  /**Энум в компонет*/
  public columnSort = ColumnSort;

  /**Энум в компонет*/
  public columnSummary = ColumnSummary;

  /**Ширина стрелки сортировки*/
  arrowWidth = 0;

  /**Высота стрелки сортировки*/
  arrowHeight = 0;

  /**Показать порядок сортировки*/
  showSortOrder = false;

  /**Выделене какой-то позиции*/
  @Input()
  customDrawCell: CustomDrawCell = (row: object, column: ColumnInfo) => {
    return {
      ngStyle: {
      }
    };
  }

  /**Конструктор*/
  constructor(public changeDetectorRef: ChangeDetectorRef) {
    this.callbackSetCellStyle = (row: Object, column: ColumnInfo) => { };
  }

  /**Инит компонента*/
  ngOnInit() {
    const fontSize = this.getDefaultFontSize();
    this.arrowWidth = fontSize / 2;
    this.arrowHeight = fontSize;
    // Восстановить лайауты
    this.restoreLayouts();
    this.calcShowSortOrder();
  }

  /**После загрузки вьюхи*/
  ngAfterViewChecked() {
  }

  /**Выделить строку*/
  selectRow(item: Object) {
    this.onSelect.emit(item);
  }

  /**Первая страница*/
  firstPage() {
    this.currentPage = 0;
  }

  /**Первая страница*/
  lastPage() {
    this.currentPage = this.getQuPage() - 1;
  }

  /**Первая страница*/
  nextPage() {
    if (this.currentPage < (this.getQuPage() - 1)) {
      this.currentPage++;
    } else {
      this.currentPage = this.getQuPage() - 1;
    }
  }

  /**Первая страница*/
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    } else {
      this.currentPage = 0;
    }
  }

  /**Количество страниц*/
  getQuPage(): number {
    let result = Math.ceil(this.applyFilter().length / this.quRowOnPage);
    if (result <= 0) {
      result = 1;
    }
    return result;
  }

  /***/
  getColumnSummary(column: ColumnInfo) {
    if (column.columnSummary === ColumnSummary.Sum) {
      return this.data.map(x => x[column.name]).reduce((acc, val) => acc + val, 0);
    } else if (column.columnSummary === ColumnSummary.Max) {
      return Math.max(...this.data.map(x => x[column.name]));
    } else if (column.columnSummary === ColumnSummary.Min) {
      return Math.min(...this.data.map(x => x[column.name]));
    } else {
      return null;
    }
  }

  /***/
  existsSummary() {
    return this.metaData.find(x => x.columnSummary != ColumnSummary.None) != null;
  }

  /**Номер страницы от 1*/
  get humanCurrentPage(): number {
    return this.currentPage + 1;
  }
  set humanCurrentPage(value) {
    if (value <= 0) {
      value = 1;
    } else if (value > this.getQuPage()) {
      value = this.getQuPage();
    }
    if (this.currentPage != value - 1) {
      // Изменяем страницу
      this.currentPage = value - 1;
    } else {
      // Просто обновить вью
      // todo
      // Пока нет времени на это :(
    }
  }

  /**Наложить автофильтр*/
  applyFilter(): Array<Object> {
    let result: Array<Object> = [];
    if (this.data && this.metaData) {
      for (let item of this.data) {
        let checkFilter = true;
        for (let column of this.metaData) {
          if (column.filterInfo.value !== '' && column.filterInfo.value) {
            if (item[column.name] != null) {
              let testString = item[column.name].toString();
              let filterText = column.filterInfo.value;
              // Отпиливаем первую звездочку звездочку
              if (filterText[0] === '*') {
                filterText = filterText.substring(1);
              } else {
                // Текст должен начинаться с фильтра
                filterText = '^' + filterText;
              }
              // Экранировать слэш
              filterText = filterText.split('\\').join(`\\\\`);
              // Экранировать скобки
              filterText = filterText.split('(').join('\\(');
              filterText = filterText.split(')').join('\\)');
              // Экранировать плюс
              filterText = filterText.split('+').join(`\\+`);
              // Остальные звездочки заменяем на любые символы
              filterText = filterText.split('*').join(`[\\w\\W]+`);
              // Вопрос - это любой символ
              filterText = filterText.split('?').join(`[\\w\\W]{1}`);
              //column.filterInfo.value
              try {
                let pattern = new RegExp(filterText, 'i');
                // Условие правильное
                checkFilter = pattern.test(testString);
              } catch (error) {
                console.error('Ошибка регулярного выражения', error);
              }
            } else {
              checkFilter = false;
            }
          }
          if (!checkFilter) {
            break;
          }
        }
        if (checkFilter) {
          result.push(item);
        }
      }
    }
    return result;
  }

  dateComparer(lhs: Date, rhs: Date) {
    if (lhs != null && rhs != null) {
      if (lhs > rhs) {
        return 1;
      } else if (lhs < rhs) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (rhs != null) {
        return -1;
      } else if (lhs != null) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  /**Сравнить две строки*/
  compareColumn(a: object, b: object, columnInfo: ColumnInfo): number {
    let fieldValueA = a[columnInfo.name];
    let fieldValueB = b[columnInfo.name];
    if (fieldValueA == null && fieldValueB == null) {
      return 0;
    } else if (fieldValueA == null) {
      return -1;
    } else if (fieldValueB == null) {
      return 1;
    } else {
      switch (columnInfo.columnFormat) {
        case ColumnFormat.Datetime:
          return this.dateComparer(fieldValueA, fieldValueB);
        case ColumnFormat.Date:
          return this.dateComparer(fieldValueA, fieldValueB);
        case ColumnFormat.Default:
          return (<string>fieldValueA).localeCompare(<string>fieldValueB);
        case ColumnFormat.Number:
          return (<number>fieldValueA) - (<number>fieldValueB);
        case ColumnFormat.Currency:
          return (<number>fieldValueA) - (<number>fieldValueB);
        case ColumnFormat.Boolean:
          return (Number(fieldValueA)) - (Number(fieldValueB));
        default:
          return 0;
      }
    }
  }

  /**Получить строки для страницы*/
  getRowForPage(): Array<Object> {
    let index = 0;
    let result: Array<Object> = [];
    for (let item of this.applyFilter().sort((a, b) => {
      for (let col of this.metaData
        .filter(x => x.columnSort !== ColumnSort.None)
        .sort((a, b) => a.columnSortNumber - b.columnSortNumber)) {
        let compareResult = this.compareColumn(a, b, col);
        if (compareResult === 0) {
          // Переходим к следующей колонке, данные равны
        } else {
          return compareResult * (col.columnSort === ColumnSort.Desc ? - 1 : 1);
        }
      }
      return 0;
    })) {
      if (index >= this.currentPage * this.quRowOnPage && index < (this.currentPage + 1) * this.quRowOnPage) {
        result.push(item);
      }
      index++;
    }
    return result;
  }

  /**Фильтр изменен*/
  filterChanged(filter: any) {
  }

  /***/
  mouseOver(rowNum: number) {
    this.rowNumMouseOver = rowNum;
  }

  /***/
  mouseOverCell(cellOver: ColumnInfo) {
    this.cellOver = cellOver;
  }

  /***/
  getCellId(rowNum: number, colNum: number): string {
    return `at_grid_${this.id}_cell_${rowNum}'_'${colNum}`;
  }

  /**Ячейка изменена*/
  changedCell(param: ChangedCellArgs) {
    this.onChanged.emit(param);
  }

  /***/
  selectInput(param: ChangedCellArgs) {
    this.selectedInput = param;
  }

  /***/
  isAllowEdit(rowNum: number, column: ColumnInfo) {
    // && column === this.cellOver && rowNum === this.rowNumMouseOver
    return column.editable;
  }

  /***/
  setDatetime(item: object, column: ColumnInfo, value: any) {
    item[column.name] = new Date(value);
  }

  /**Получить размер шрифта по умолчанию*/
  getDefaultFontSize(): number {
    const who = document.createElement('div');

    who.style.cssText = 'display:inline-block; padding:0; line-height:1; position:absolute; visibility:hidden; font-size:1em';

    who.appendChild(document.createTextNode('M'));
    document.body.appendChild(who);
    const fs = who.offsetHeight;
    document.body.removeChild(who);
    return +fs;
  }

  /***/
  calcShowSortOrder() {
    this.showSortOrder = this.metaData
      .filter(x => x.columnSort !== ColumnSort.None).length > 1;
  }

  /**Изменить сортировку колонки*/
  changeSort(columnInfo: ColumnInfo) {
    if (columnInfo.columnFormat === ColumnFormat.Template || columnInfo.columnFormat === ColumnFormat.Picture) {
      // По этим колонкам сортировать нельзя :)
      return;
    }
    if (columnInfo.allowSort) {
      if (columnInfo.columnSort === ColumnSort.None) {
        // Номер колонки для сортировки
        let columnSortNumber = 1;
        for (let col of this.metaData) {
          if (col.columnSort !== ColumnSort.None) {
            columnSortNumber++;
          }
        }
        columnInfo.columnSort = ColumnSort.Ask;
        columnInfo.columnSortNumber = columnSortNumber;
        console.log(columnInfo);
      } else if (columnInfo.columnSort === ColumnSort.Ask) {
        columnInfo.columnSort = ColumnSort.Desc;
      } else if (columnInfo.columnSort === ColumnSort.Desc) {
        columnInfo.columnSort = ColumnSort.None;
        columnInfo.columnSortNumber = 0;
        // Пересортировываем порядок сортировок :)
        let i = 1;
        for (let col of this.metaData
          .filter(x => x.columnSort !== ColumnSort.None)
          .sort((a, b) => a.columnSortNumber - b.columnSortNumber)) {
          if (col.columnSort !== ColumnSort.None) {
            col.columnSortNumber = i++;
          }
        }
      }
      this.calcShowSortOrder();
      this.saveLayouts();
    }
  }

  /***/
  getOutGridName() {
    return `AtGridLayouts-${this.name}`;
  }
  /***/
  saveLayouts() {
    let data = JSON.stringify(this.metaData);
    localStorage.setItem(this.getOutGridName(), data);
  }

  /***/
  restoreLayouts() {
    if (localStorage.getItem(this.getOutGridName()) != null) {
      let data = <ColumnInfo[]>JSON.parse(localStorage.getItem(this.getOutGridName()));
      for (let di of data) {
        let someCols = this.metaData.filter(x => x.name === di.name);
        if (someCols.length > 0) {
          let someCol = someCols[0];
          if (di.columnSort !== ColumnSort.None) {
            someCol.columnSort = di.columnSort;
            someCol.columnSortNumber = di.columnSortNumber;
          }
        }
      }
    }
  }

  /***/
  setValue(item: Object, columnName: string, value: any) {
    console.log(value);
    item[columnName] = value;
  }
}
