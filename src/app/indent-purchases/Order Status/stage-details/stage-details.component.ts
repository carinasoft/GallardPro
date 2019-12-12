import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef, MatMenuTrigger, MatTableDataSource } from '@angular/material';
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
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'app/services/product.service';
import { PlannedHistoryComponent } from '../PlannedHistory/planned-history.component';
import { MouldHistoryComponent } from '../Mould/mould-history.component';
import { RejectHistoryComponent } from '../rejecthistory/reject-history.component';





@Component({
    selector     : 'stage-details',
    templateUrl  : './stage-details.component.html',
    styleUrls    : ['./stage-details.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class StagedetailsComponent implements OnInit
{    @ViewChild('contextMenuTrigger', {read: MatMenuTrigger}) contextMenuTrigger:MatMenuTrigger;
    @Input() refreshList = false;
    dataSource: any[] = [];
    MouldData: any[] = [];
    displayedColumns = ['sno','order-date', 'Grade','workorderno',  'Product Name','view', 'action','Moulding','Production','Dispatch','Rejected'];

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
        public location:Location,
        private _activatedRoute: ActivatedRoute,
        private _productSevcie : ProductService
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
      // this.MouldNoList();
        this._activatedRoute.queryParams.subscribe(params => {
            if (params['material']) {
               
                console.log( params['material'])
              //  this.poID = params['poNumber'];
              let data = params['material']
              this.WorkOrderDetailList(params['material']);
            }
       });
    }

    WorkOrderDetailList(id){
        this._productSevcie.WorkOrderApprovedList(id).subscribe((a:any) => {
            if(a && a.Body && a.Body.length){
              if(a.Status == "Success"){
                this.dataSource = a.Body; 
                this.stockList = a.Body; 
                console.log( a.Body)
               // this.contextMenuTrigger.openMenu();
              }
              this.listData = new MatTableDataSource(this.dataSource);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
            }        
      })  
    }

    

    MouldNoList(row){
        this._productSevcie.MouldNoList(row).subscribe((a:any) => {
            if(a && a.Body && a.Body.length){
                
               
                    this.MouldData = a.Body;  
                    console.log( a.Body) 
               
            }        
      })  
    }

    goBack(){
        this.location.back();
    }


    getPlannedHistory(Planned) {
        console.log(Planned)
        this._productSevcie.getPlannedHistory(Planned).subscribe(a => {
            if(a && a.Body && a.Body.length) {
                this.dialog.open(PlannedHistoryComponent, {
                    width: '100%',
                    panelClass: ['medium-modal', 'center-align'],
                    data: { indentList: a.Body }
                });

            } else {
                this._toastr.errorToast('No history found');
            }
        })
    }

    getMouldHistory(Mould) {
        console.log(Mould)
        this._productSevcie.getMouldHistory(Mould).subscribe(a => {
            if(a && a.Body && a.Body.length) {
                this.dialog.open(MouldHistoryComponent, {
                    width: '100%',
                    panelClass: ['medium-modal', 'center-align'],
                    data: { indentList: a.Body }
                });

            } else {
                this._toastr.errorToast('No history found');
            }
        })
    }

    getRejectedHistory(Rejected)
    {
        console.log(Rejected)
        this._productSevcie.getRejectedHistory(Rejected).subscribe(a => {
            if(a && a.Body && a.Body.length) {
                console.log(Rejected)
                this.dialog.open(RejectHistoryComponent, {
                    width: '100%',
                    panelClass: ['medium-modal', 'center-align'],
                    data: { indentList: a.Body }
                });

            } else {
                this._toastr.errorToast('No history found');
            }
        })
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
        this.listData.filter = searchStr.trim().toLowerCase();
        this.dataSource = this.stockList.filter((item) => item.Name.toLowerCase().includes(searchStr) || item.ProductName.toLowerCase().includes(searchStr));
    }
   

}
function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


