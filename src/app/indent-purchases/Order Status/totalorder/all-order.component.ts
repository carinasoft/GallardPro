import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef } from '@angular/material';
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
import { Location } from '@angular/common';




@Component({
    selector     : 'all-order',
    templateUrl  : './all-order.component.html',
    styleUrls    : ['./all-order.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class AllorderComponent implements OnInit
{    
    @Input() refreshList = false;
    dataSource: any[] = [];
    displayedColumns = ['sno','workorderno', 'order-date', 'Grade', 'Product Name', 'action'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

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
        public location:Location
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
        this.getStockList();
    }

    getStockList(): any {
        this._indentService.GetStockList().subscribe((a: any) => {
            if (a && a.Body.length) {
                this.dataSource = a.Body;
                this.stockList = a.Body; 
                            
            } else {
                this.stockList = [];
            }
        });
    }

    goBack(){
        this.location.back();
    }
    // open(){
       
        
    //     const dialogRef = this.dialog.open(WorkorderPrintComponent, {
    //         width: '100%',
    //         panelClass: ['max-950', 'center-align'],
        
    //     });

    //     dialogRef.afterClosed().subscribe(isSuccess => {
    //         if (isSuccess) {
    //             // dialogRef.close();
                 
    //         }
    //     });
    // }


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
        this.dataSource = this.stockList.filter((item) => item.ItemName.toLowerCase().includes(searchStr) || item.CategoryName.toLowerCase().includes(searchStr));
    }
   

}
function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

