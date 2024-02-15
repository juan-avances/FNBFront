import { Column, CustomOperation } from "./prime-table.model";

export interface FileListModel {
    columnas?: Column[];
    data?: Array<any>;
    customOperations?: CustomOperation[];
}