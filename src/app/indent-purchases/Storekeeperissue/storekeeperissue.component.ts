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
import { IssueStockListHistoryComponent } from '../inventory/issue-stock-list-history/issue-stock-list-history.component';
import { IssueStockComponent } from '../inventory/issue-stock/issue-stock.component';
import { StockSummaryComponent } from '../inventory/stock-summary/stock-summary.component';



@Component({
    selector     : 'storekeeperissue',
    templateUrl  : './storekeeperissue.component.html',
    styleUrls    : ['./storekeeperissue.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class StorekeeperissueComponent implements OnInit
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
            data: this.stockList
        });
        if (csv == null) return;
    
        filename = 'export.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
    
        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }
    

















    // @Input() refreshList = false;
    // @Output() updateIndent: EventEmitter<any> = new EventEmitter(null);
    // dataSource: any[] = [];
    // stockList: any[] = [];
    // displayedColumns = ['IssuedDate',  'material', 'category', 'quantity','view'];

    // @ViewChild(MatPaginator)
    // paginator: MatPaginator;

    // @ViewChild(MatSort)
    // sort: MatSort;

    // @ViewChild('filter')
    // filter: ElementRef;
    // moment = moment;
    // // Private
    // private _unsubscribeAll: Subject<any>;

    // constructor(
    //     public dialog: MatDialog,
    //     private _indentService: IndentService,
    //     private _toastr: ToasterService
    // )
    // {
    //     // Set the private defaults
    //     this._unsubscribeAll = new Subject();
    // }

    // // -----------------------------------------------------------------------------------------------------
    // // @ Lifecycle hooks
    // // -----------------------------------------------------------------------------------------------------

    // /**
    //  * On init
    //  */
    // ngOnInit(): void
    // {
    //     this.getIssuedItemList();
    // }
    // getHistory(id){
    //     console.log(id);
 
    //     this._indentService.GetIssueStockListHistory1(id).subscribe(a => {
    //      if(a && a.Body && a.Body.length) {
    //          const dialogRef=this.dialog.open(IssueStockListHistoryComponent, {
    //              width: '100%',
    //              panelClass: ['medium-modal', 'center-align'],
    //              data: { indentList: a.Body }
    //          });
    //          dialogRef.afterClosed().subscribe(isSuccess => {
                
    //                  //this.getIndentList();
                 
    //          });
 
 
    //      } else {
    //          this._toastr.errorToast('No history found');
    //      }
    //  })
 
 
 
    //  }
 
 
 
    // getIssuedItemList(): any {
    //     this._indentService.GetIssuedItemList().subscribe((a: any) => {
    //         if (a && a.Body && a.Body.length) {
    //             this.dataSource = a.Body;
    //             this.stockList = a.Body;
    //             this.refreshList = false;
    //         } else {
    //             this.dataSource = [];
    //             this.stockList = [];            }
    //     });
    // }

    // editIndent(obj): any {
    //     this.updateIndent.emit(obj);
    // }

    // deleteIndent(indentId): any {
    //     console.log(indentId);
    //     this._indentService.DeleteIndent(indentId).subscribe(a => {
    //         if (a && a.Status.toLowerCase() === 'success') {
    //             this._toastr.successToast('Indent deleted succesfully');
    //             this.getIssuedItemList();                
    //         } else {
    //             this._toastr.errorToast(a.status);
    //         }
    //     });
    // }


    // sortData(sort): any {
    //     const data = this.dataSource.slice();
    //     if (!sort.active || sort.direction === '') {
    //       this.dataSource = data;
    //       return;
    //     }
    
    //     this.dataSource = data.sort((a, b) => {
    //       const isAsc = sort.direction === 'asc';
    //       switch (sort.active) {
    //         case 'IssuedDate': return compare(a.IssuedDate, b.IssuedDate, isAsc);
    //         case 'material': return compare(a.ItemName, b.ItemName, isAsc);
    //         case 'category': return compare(a.CategoryName, b.CategoryName, isAsc);
    //         case 'quantity': return compare(a.Quantity, b.Quantity, isAsc);
    //         case 'IssuedTo': return compare(a.Name, b.Name, isAsc);
    //         default: return 0;
    //       }
    //     });
    // }



    // ngOnChanges(s) {
    //     if (s && s.refreshList.currentValue) {
    //         this.getIssuedItemList();
    //     }
    // }

    // search(ev) {
    //     let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
    //     this.dataSource = this.stockList.filter((item) => { 
    //         return item.ItemName.toLowerCase().includes(searchStr) || item.Name.toLowerCase().includes(searchStr) || item.CategoryName.toLowerCase().includes(searchStr);
    //     });
    // }



}
function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
