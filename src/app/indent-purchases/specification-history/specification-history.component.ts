import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import * as html2canvas from 'html2canvas';
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
import { MAT_DIALOG_DATA} from '@angular/material';
declare let jsPDF:any;
@Component({
    selector     : 'specification-history',
    templateUrl  : './specification-history.component.html',
    styleUrls    : ['./specification-history.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class SpecificationhistoryComponent implements OnInit
{    
    @Input() refreshList = false;
    @Input() dataSource: any[] = [];
    displayedColumns = ['serial', 'chemical',  'minvalue', 'maxvalue', 'standerdvalue','action'];
  //  @ViewChild('content') content:ElementRef;
    type1:any;
    type2:any;
    moment = moment;
    stockList = [];
    someData:any;
    final:any;;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        public dialogRef: MatDialogRef<SpecificationhistoryComponent>,
	    @Inject(MAT_DIALOG_DATA) public data: any,
       // public dialog: MatDialog,
        // public dialogRef: MatDialogRef<IssueStockComponent>,                
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private content: ElementRef
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        // this.type1=this.data.indentList.type;
        // console.log(this.type1)
        this.get();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        _.map(this.data.indentList, (o) => {
            o.CreateDate = moment(o.CreateDate).format('MM/DD/YYYY');
            return o.OrderQuantity = o.Quantity;  
          });
          this.get();
    }

    // getTotalCost() {
    //     return this.data.indentList.map(t =>.Quantity).reduce((acc, value) => acc + value, 0);
    //   }
    get(){
       
     }
    convert(){
        window.print();



}

}
