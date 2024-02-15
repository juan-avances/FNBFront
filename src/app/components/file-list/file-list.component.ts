import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileListModel } from 'src/app/@core/models/file-list.model';
import { LazyLoadEvent } from 'primeng/primeng';


@Component({
  selector: 'file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['file-list.component.scss']
})
export class FileListComponent implements OnInit, AfterViewInit {
  @Input() dataEntity: FileListModel | undefined;
  @Input() idTipoArchivo: number| undefined;


  @Output() paginationLoad: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();

  ngOnInit() {

    this.paginationLoad.emit({ first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: 10,
      sortField: 'Id',
      sortOrder: 1});
  }

  ngAfterViewInit() {

  }
  lazyLoad(event: LazyLoadEvent) {
    this.paginationLoad.emit(event);
  }

  ngOnChanges() {

  }


}
