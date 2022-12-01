import { EntityName } from '../entities/entity-name';
import { getEntitiesMetadata } from '../entities/metadata/entity-metadata';

export class CommonLib {
  static formatDateFromString(date: string): string {
    if (date) {
      const d = new Date(date);
      return CommonLib.formatDate(d);
    } else {
      return null;
    }
  }
  static formatDate(date: Date): string {
    if (date) {
      let month = '' + (date.getMonth() + 1);
      let day = '' + date.getDate();
      const year = date.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    } else {
      return null;
    }
  }
  static formatDate2(date: Date): string {
    if (date) {
      let month = '' + (date.getMonth() + 1);
      let day = '' + date.getDate();
      const year = date.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [day, month, year].join('-');
    } else {
      throw('date is null');
    }
  }
  /***/
  static removeEmptyPrimaryKey(entity: any, entityName: EntityName) {
    const entitiesMetadata = getEntitiesMetadata().find(x => x.name === entityName);
    if (entitiesMetadata) {
      if (entity[entitiesMetadata.pkName] === null) {
        delete entity[entitiesMetadata.pkName];
      }
    } else {
      throw new Error(`Not found metadata for ${entitiesMetadata.name}`);
    }
    return entity;
  }

  static dateToShortString(date: Date) {
    let monthNames =["Jan","Feb","Mar","Apr", "May","Jun","Jul","Aug", "Sep", "Oct","Nov","Dec"];
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let monthName = monthNames[monthIndex];
    let year = date.getFullYear();
    return `${day}-${monthName}-${year}`; 
  }
}