import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';


import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { IndentService } from 'app/services/indent.service';
import {MatDialog} from '@angular/material';
import * as _ from 'lodash';

import * as moment from 'moment';
import { ToasterService } from 'app/services/toaster.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ClientService } from 'app/services/client.service';
import { Router } from '@angular/router';




@Component({
    selector     : 'stage-list',
    templateUrl  : './stage-list.component.html',
    styleUrls    : ['./stage-list.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class StagelistComponent implements OnInit
{    
    @Input() refreshList = false;
    dataSource: any[] = [];
    displayedColumns = ['workorderno', 'order-date', 'Delivery Date', 'Client PO No', 'Client Name','Entry Date','Username','view']; 

    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    listData: MatTableDataSource<any>;
    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    stockList = [];
    someData:any;;
    final=[];
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        public dialog: MatDialog,
        // public dialogRef: MatDialogRef<IssueStockComponent>,                
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _clientService: ClientService,
        private _route: Router
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.getWorkOrderList();
    }

    getWorkOrderList(): any {
        this._clientService.GetApproved().subscribe((a: any) => {
            
                this.dataSource = a.Body;
                this.stockList = a.Body;

                this.listData = new MatTableDataSource(this.dataSource);
                this.listData.sort = this.sort;
                this.listData.paginator = this.paginator;
        });
    }

    changePage(material){
        this._route.navigate(['indent', 'stage-details'], { queryParams: {material}});
    }
   

    sortData(sort): any {
        const data = this.dataSource.slice();
        if (!sort.active || sort.direction === '') {
          this.dataSource = data;
          return;
        }
    
        this.dataSource = data.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'material': return compare(a.ItemName, b.ItemName, isAsc);
            case 'category': return compare(a.CategoryId, b.CategoryId, isAsc);
            case 'quantity': return compare(a.Quantity, b.Quantity, isAsc);
            default: return 0;
          }
        });
    }
    

   
    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.listData.filter = searchStr.trim().toLowerCase();
        this.dataSource = this.stockList.filter((item) => item.Name.toLowerCase().includes(searchStr));
    }
   

}
function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

