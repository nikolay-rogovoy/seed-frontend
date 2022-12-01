import { IMetadataTable } from '../metadata/i-metadata-table';

/***/
export interface IBPUser extends IMetadataTable {
    /**Администратор*/
    admin: number;
}
