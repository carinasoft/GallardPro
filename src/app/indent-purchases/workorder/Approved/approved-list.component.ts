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
import { WorkorderPrintComponent } from '../work-order-print/workorder-print.component';
import { Location } from '@angular/common';
import { ApprovedetailsComponent } from '../Approve-details/approve-details.component';
import { ClientService } from 'app/services/client.service';
import { DialogOverviewExampleDialogComponent } from '../password/DialogOverviewExampleDialog.component';
import { ProductlistforworkorderComponent } from '../workorderOfproductNo/product-listforworkorder.component';
import { ApprovedItemComponent } from '../approvedlistdetails/approved-item.component';



@Component({
    selector     : 'approved-list',
    templateUrl  : './approved-list.component.html',
    styleUrls    : ['./approved-list.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ApprovedlistComponent implements OnInit
{    
    @Input() refreshList = false;
    dataSource: any[] = [];
    dataSource1: any[] = [];
   // displayedColumns = ['sno','workorderno', 'order-date', 'Delivery Date', 'Client PO No', 'Client Name','Entry Date','Username','view','action'];
   //displayedColumns = ['sno','workorderno', 'order-date', 'Grade', 'Product Name', 'Total Net Weight','Notes','No. of Ordered Pieces','Planned','status','view','action'];
   displayedColumns = ['workorderno', 'order-date', 'Delivery Date', 'Client PO No', 'Client Name','Entry Date','Username','view','action']; 
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
        public location:Location,
        private _clientService: ClientService,
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
            
                this.dataSource1 = a.Body;
                this.stockList = a.Body;
              
        });
    }

    delete(row){
       
        const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
            width: '250px',
            data: {rowdata: row, isWorkOder: true}
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.getWorkOrderList();
          });    
     }

    goBack(){
        this.location.back();
    }
  

    viewWorkOrder(material){
        console.log(material.WOID)
        const dialogRef = this.dialog.open(ApprovedItemComponent, {
            width: '100%',
            panelClass: ['max-950000', 'center-align'],
            data: { id: material.WOID,display:true}
           });
    }
    
    openApprove(){
        
        
        const dialogRef = this.dialog.open(ApprovedetailsComponent, {
            width: '100%',
            panelClass: ['max-950', 'center-align'],
            data: { indentList: this.dataSource }
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
    

   
    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.dataSource1 = this.stockList.filter((item) => item.Name.toLowerCase().includes(searchStr) || item.ClientPoNo.toLowerCase().includes(searchStr));
    }
   

}
function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

