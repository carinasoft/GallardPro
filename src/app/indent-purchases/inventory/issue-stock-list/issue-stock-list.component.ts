import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { IndentService } from 'app/services/indent.service';
import {MatDialog} from '@angular/material';
import * as _ from 'lodash';
import { GeneratePurchaseOrder } from 'app/indent-purchases/generate-order-modal/generate-order.component';
import * as moment from 'moment';
import { ToasterService } from 'app/services/toaster.service';
import { IssueStockListHistoryComponent } from '../issue-stock-list-history/issue-stock-list-history.component';
import { trigger, state,transition, style, animate, query, stagger,animateChild } from '@angular/animations';


@Component({
    selector     : 'issue-stock-list',
    templateUrl  : './issue-stock-list.component.html',
    styleUrls    : ['./issue-stock-list.component.scss'],
   // animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    animations   : [trigger('EnterLeave', [
        state('flyIn', style({ transform: 'translateX(0)' })),
        transition(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate('0.5s 300ms ease-in')
        ]),
        transition(':leave', [
          animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
        ])
      ]),
      trigger('EnterLeave1', [
        state('flyIn1', style({ transform: 'translateX(0)' })),
        transition(':enter', [
          style({ transform: 'translateX(-100%)' }),
          animate('0.5s 300ms ease-in')
        ]),
        transition(':leave', [
          animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
        ])
      ])
    ]
})
export class IssueStockListComponent implements OnInit, OnChanges
{
    @Input() refreshList = false;
    @Output() updateIndent: EventEmitter<any> = new EventEmitter(null);
    dataSource: any[] = [];
    stockList: any[] = [];
    displayedColumns = ['IssuedDate',  'material', 'category', 'quantity','view'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService
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
        this.getIssuedItemList();
    }

    getHistory(id){
       console.log(id);

       this._indentService.GetIssueStockListHistory1(id).subscribe(a => {
        if(a && a.Body && a.Body.length) {
            const dialogRef=this.dialog.open(IssueStockListHistoryComponent, {
                width: '100%',
                panelClass: ['medium-modal', 'center-align'],
                data: { indentList: a.Body }
            });
            dialogRef.afterClosed().subscribe(isSuccess => {
               
                    //this.getIndentList();
                
            });


        } else {
            this._toastr.errorToast('No history found');
        }
    })



    }





    getIssuedItemList(): any {
        this._indentService.GetIssuedItemList().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.dataSource = a.Body;
                console.log(this.dataSource)
                this.stockList = a.Body;
                this.refreshList = false;
            } else {
                this.dataSource = [];
                this.stockList = [];            }
        });
    }

    editIndent(obj): any {
        this.updateIndent.emit(obj);
    }

    deleteIndent(indentId): any {
        console.log(indentId);
        this._indentService.DeleteIndent(indentId).subscribe(a => {
            if (a && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Indent deleted succesfully');
                this.getIssuedItemList();                
            } else {
                this._toastr.errorToast(a.status);
            }
        });
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
            case 'IssuedDate': return compare(a.IssuedDate, b.IssuedDate, isAsc);
            case 'material': return compare(a.ItemName, b.ItemName, isAsc);
            case 'category': return compare(a.CategoryName, b.CategoryName, isAsc);
            case 'quantity': return compare(a.Quantity, b.Quantity, isAsc);
            case 'IssuedTo': return compare(a.Name, b.Name, isAsc);
            default: return 0;
          }
        });
    }



    ngOnChanges(s) {
        if (s && s.refreshList.currentValue) {
            this.getIssuedItemList();
        }
    }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.dataSource = this.stockList.filter((item) => { 
            return item.ItemName.toLowerCase().includes(searchStr) || item.ItemName.toLowerCase().includes(searchStr) || item.CategoryName.toLowerCase().includes(searchStr);
        });
    }

}
function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
