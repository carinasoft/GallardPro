import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef } from '@angular/material';
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
import { IssueStockComponent } from 'app/indent-purchases/inventory/issue-stock/issue-stock.component';
import { StockSummaryComponent } from '../stock-summary/stock-summary.component';
import { trigger, state,transition, style, animate, query, stagger,animateChild } from '@angular/animations';

@Component({
    selector     : 'stock-list',
    templateUrl  : './stock-list.component.html',
    styleUrls    : ['./stock-list.component.scss'],
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
export class StockListComponent implements OnInit
{    
    @Input() refreshList = false;
    dataSource: any[] = [];
    displayedColumns = ['selected', 'serial', 'material', 'category', 'quantity','view'];

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
        this.getStockList();
    }

    getStockList(): any {
        this._indentService.GetStockList().subscribe((a: any) => {
            if (a && a.Body.length) {
                this.dataSource = a.Body;
                this.stockList = a.Body; 
                this.get();               
            } else {
                this.stockList = [];
            }
        });
    }

    editIndent(obj): any {
        console.log(obj);
    }

    deleteMaterial(id): any {
        this._indentService.DeleteMaterial(id).subscribe(a => {
            if (a && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Material deleted succesfully');
                this.getStockList();       
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
            case 'material': return compare(a.ItemName, b.ItemName, isAsc);
            case 'category': return compare(a.CategoryId, b.CategoryId, isAsc);
            case 'quantity': return compare(a.Quantity, b.Quantity, isAsc);
            default: return 0;
          }
        });
    }
    openView(id){
        this._indentService.GetSummary(id).subscribe(a => {
            if(a ) {
                this.dialog.open(StockSummaryComponent, {
                    width: '100%',
                    panelClass: ['medium-modal', 'center-align'],
                    data: { indentList: a.IssueOrderList,data:a.stockbalance ,totali:a.IssueQunantityTotal ,totalo:a.OrderQunantityTotal},
                    
                });
          console.log(a.IssueOrderList,a.stockbalance,a)
            } else {
                this._toastr.errorToast('No history found');
            }
        })

//         IssueQunantityTotal: 8
// OrderQunantityTotal:
        // dialogRef.afterClosed().subscribe(isSuccess => {
        //     if (isSuccess) {
        //         // dialogRef.close();
        //         this.getStockList();                
        //     }
        // });
        // if(a && a.Body && a.Body.length) {
        //     const dialogRef=this.dialog.open(IndentDeleteComponent, {
        //         width: '100%',
        //         panelClass: ['medium-modal', 'center-align'],
        //         data: { indentList: a.Body }
        //     });
        //     dialogRef.afterClosed().subscribe(isSuccess => {
               
        //             this.getIndentList();
                
        //     });


        // } else {
        //     this._toastr.errorToast('No history found');
        // }
    }

    openStockIssueModal(){
        const selectedItem = _.filter(this.dataSource, (o: any) => o.selected);
        if (selectedItem && !selectedItem.length) {
            return this._toastr.errorToast('Please select atleast 1 item');
        }
        
        const dialogRef = this.dialog.open(IssueStockComponent, {
            width: '100%',
            panelClass: ['max-950', 'center-align'],
            data: { material: selectedItem }
        });

        dialogRef.afterClosed().subscribe(isSuccess => {
            if (isSuccess) {
                // dialogRef.close();
                this.getStockList();                
            }
        });
    }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.dataSource = this.stockList.filter((item) => item.ItemName.toLowerCase().includes(searchStr) || item.CategoryName.toLowerCase().includes(searchStr));
    }
    get(){
        console.log(this.stockList)
        var csv =[];
         for(let i=0;i<this.stockList.length;i++){
            
            //  this.name=this.dataSource[i].ItemName
            //  this.category=this.dataSource[i].CategoryName
            //  this.quny=this.dataSource[i].Quantity
         console.log(this.stockList[i].PODate,this.stockList[i].PONumber,this.stockList[i].Quantity)
         this.someData = 
             {   

                ItemName: this.stockList[i].ItemName, 
                CategoryName: this.stockList[i].CategoryName, 
                Quantity: this.stockList[i].Quantity
                
            
            }
            
         // var someData = [
         //     {firstName: this.name, lastName: this.category, age: this.quny}
         //    ];
         console.log(csv.push(this.someData))
         }
         console.log(csv)
         this.final=csv
     }

    convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    
        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }
        console.log(data , data.length)
        for(let i=0; i<data.length; i++)
        {
            console.log(data[i].IndentId)
        }
    
        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';
    
        keys = Object.keys(data[0]);
    
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
    
        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;
    
                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });
    
        return result;
    }
    
     downloadCSV() {
        var data, filename, link;
    
        var csv = this.convertArrayOfObjectsToCSV({
            data: this.final
        });
        if (csv == null) return;
    
        filename = 'Stock list.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
    
        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }
    


}
function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

