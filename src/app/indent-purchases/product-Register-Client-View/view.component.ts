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
    selector     : 'view',
    templateUrl  : './view.component.html',
    styleUrls    : ['./view.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ViewComponent implements OnInit
{    


    @Input() refreshList = false;
    @Input() dataSource: any[] = [];
    displayedColumns = ['serial', 'date',  'name', 'category',];
    moment = moment;
   
   
    
    private _unsubscribeAll: Subject<any>;

    constructor(
        public dialogRef: MatDialogRef<ViewComponent>,
	    @Inject(MAT_DIALOG_DATA) public data: any,                
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private content: ElementRef
    )
    {
       
        this._unsubscribeAll = new Subject();

        
      
    }

   
    ngOnInit(): void
    {
        // _.map(this.data.indentList, (o) => {
        //     o.CreateDate = moment(o.CreateDate).format('MM/DD/YYYY');
        //     return o.OrderQuantity = o.Quantity;  
        //   });
          
    }

   
    convert(){
        window.print();
      }
}


