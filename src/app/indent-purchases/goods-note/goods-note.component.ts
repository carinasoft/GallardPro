import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { GeneratePurchaseOrder } from "app/indent-purchases/generate-order-modal/generate-order.component";
import * as moment from 'moment';
import { ToasterService } from "app/services/toaster.service";
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


export const IndentList = [
    { selected: false, IndentDate: '08/12/2018', priority: 'Normal', category: 'Production', material: { name: 'Thread Lock', uniqueName: 'threadlock'}, quantity: 100.00, unit: 'kgs'},
    { selected: false, IndentDate: '07/12/2018', priority: 'Urgent', category: 'Maintenance', material: { name: 'Ferro Manganese HC', uniqueName: 'threadlock'}, quantity: 2000.00, unit: 'kgs'},
    { selected: false, IndentDate: '04/12/2018', priority: 'Urgent', category: 'Mould Coats', material: { name: 'Black Japan Paints', uniqueName: 'threadlock'}, quantity: 100.00, unit: 'ltr'},
    { selected: false, IndentDate: '02/12/2018', priority: 'Urgent', category: 'Electrical', material: { name: 'Silica Sand', uniqueName: 'threadlock'}, quantity: 25000.00, unit: 'kgs'},
    { selected: false, IndentDate: '01/12/2018', priority: 'Normal', category: 'Production', material: { name: 'Grinding Wheel 2', uniqueName: 'threadlock'}, quantity: 20.00, unit: 'pcs'},
];

@Component({
    selector     : 'goods-note',
    templateUrl  : './goods-note.component.html',
    styleUrls    : ['./goods-note.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class GoodsReceiptNote implements OnInit
{
    dataSource: any[] = [];
    displayedColumns = [ 'ItemName', 'CategoryName', 'Quantity', 'ReceivedQty', 'Price' ];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    public grnForm: FormGroup;
    searchNumber = null;
    poID = null;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _route: Router,
        private _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder
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

        this.grnForm = this.createGrnForm();

        this._activatedRoute.queryParams.subscribe(params => {
             if (params['poNumber']) {
                 this.poID = params['poNumber'];
                 this.getOrderByNumber(params['poNumber']);
             }
        });
    }
    createGrnForm(): FormGroup{
        return this._formBuilder.group({
            TimeIn: ['', [Validators.required]],
            TimeOut: ['', [Validators.required]],
            Report: ['', [Validators.required]],
            BillNo: ['', [Validators.required]],
            VehicleNo: ['', [Validators.required]],
            LRNo: ['', [Validators.required]],
            
        });
    }
    getOrderByNumber(poNumber): any {
        this.poID = _.cloneDeep(poNumber);
        this._indentService.GetOrderByNumber(poNumber).subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.dataSource = a.Body;

                this.dataSource = _.map(this.dataSource, (o) => {
                   o.CreateDate = moment(o.CreateDate).format('MM/DD/YYYY');
                   return o;
                });

            }
        });
    }

    editIndent(obj): any {
        // console.log(obj);
    }

    deleteIndent(indentId): any {
        // console.log(indentId);
        this._indentService.DeleteIndent(indentId).subscribe(a => {
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Indent deleted succesfully');             
            } else {
                this._toastr.errorToast(a.status);
            }
        });
    }

    generateOrder() {
        let selectedIndent = _.filter(this.dataSource, (o: any) => o.selected);
        if(selectedIndent && !selectedIndent.length) {
            return this._toastr.warningToast('Please select atleast 1 indent');
        }
        // console.log('selectedIndent', selectedIndent);
        let dialogRef = this.dialog.open(GeneratePurchaseOrder, {
            width: "100%",
            panelClass: 'full-width-modal',
            data: { indentList: selectedIndent }
        });

        dialogRef.afterClosed().subscribe(result => {
        //   console.log(`Dialog result: ${result}`);
        });

    }
    // BillNo: "10sadsad"
    // LRNo: "asdas"
    // Report: "sadasd"
    // TimeIn: "05:40"
    // TimeOut: "05:00"
    // VehicleNo: "asdsa"
    generateGRN() {
        const model = this.grnForm.value
    let requestObj = {
        POID: this.poID,
        PoList: this.dataSource,
        BillNo:model.BillNo,
        LRNo:model.LRNo,
        Report:model.Report,
        TimeIn:model.TimeIn,
        TimeOut:model.TimeOut,
        VehicleNo:model.VehicleNo,
    };

  // console.log(this.dataSource[0].ReceivedQuantity)
        if(this.dataSource[0].ReceivedQuantity && model.BillNo && model.LRNo && model.TimeIn && model.TimeOut && model.VehicleNo){
            console.log(requestObj)
                   this._indentService.GenerateGRN(requestObj).subscribe((a: any) => {
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Generated Succesfully');
                this._route.navigate(['/indent/goodnote']);
            } else {
                this._toastr.errorToast(a.status);
            }
        });
        }
        else{
            this._toastr.errorToast("Please Fill All Required Filds");
        }
        //  this._indentService.GenerateGRN(requestObj).subscribe((a: any) => {
        //     if (a && a.Status && a.Status.toLowerCase() === 'success') {
        //         this._toastr.successToast('Generated Succesfully');
        //         this._route.navigate(['/indent/goodnote']);
        //     } else {
        //         this._toastr.errorToast(a.status);
        //     }
        // });
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
            case 'IndentId': return compare(a.IndentId, b.IndentId, isAsc);
            case 'CategoryName': return compare(a.CategoryName, b.CategoryName, isAsc);
            case 'ItemName': return compare(a.ItemName, b.ItemName, isAsc);
            case 'CreateDate': return compare(a.CreateDate, b.CreateDate, isAsc);
            case 'Priority': return compare(a.Priority, b.Priority, isAsc);
            default: return 0;
          }
        });
      }
}
function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
