import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
    selector     : 'unit-operation',
    templateUrl  : './units-operation.component.html',
    styleUrls    : ['./units-operation.component.scss'],
  //  animations   : fuseAnimations,
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
export class UnitListComponent implements OnInit
{
    dataSource: any[] = [];
    displayedColumns = ['serial', 'name', 'action'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    unitList: any[] = [];
    someData:any;;
    final=[];
    inputFormValue:boolean
    private _unsubscribeAll: Subject<any>;
    orderForm: FormGroup;
    listData: MatTableDataSource<any>;
    constructor(
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService,
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

        this.getStockUnit();
        this.inputFormValue=false
        this.orderForm = this.createOrderForm();
    }


    getStockUnit() {
        this._indentService.GetStockUnit().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.dataSource = a.Body;
                this.unitList = a.Body;
                this.get();
            }
            this.dataSource.map(row => {      
                row.isEditable = false;        
              }); 

              this.listData = new MatTableDataSource(this.unitList);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
        });
    }

    createOrderForm(): FormGroup {
        return this._formBuilder.group({
            UOM: ['', [Validators.required]]
        });

    }

    editIndent(obj): any {
        console.log(obj);
    }


    openForm(){
        this.inputFormValue=true
    }
    cancelForm(){
        this.inputFormValue=false
    }
    addUOM(){
        this.inputFormValue=false
        const model = this.orderForm.value;
        console.log(model)
        this._indentService.AddUOM(model).subscribe(a => {
            if (a && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Added succesfully');
                this.inputFormValue=false
                this.getStockUnit();
            } else if(a.Status === 'Warning')
            {
               this._toastr.warningToast("Item already exists"); 
           }
           else{
               this._toastr.errorToast(a.Status)
           }
        });
    }

    close(indent){
        indent.isEditable = false;
        this.getStockUnit();
    }
    editRow(row) {
        this.dataSource.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
  }

  save(row){
    row.isEditable = false;
    console.log(row)
    this._indentService.EditUOM(row).subscribe(a => {
        if (a && a.Status.toLowerCase() === 'success') {
            this._toastr.successToast('Edit succesfully');
            this.getStockUnit();
        } else {
            this._toastr.errorToast(a.status);
        }
    });

  }


    deleteUnit(unitId): any {
        this._indentService.DeleteStockUnit(unitId).subscribe(a => {
            if (a && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Unit deleted succesfully');
                this.getStockUnit();
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
            case 'name': return this.compare(a.UOM, b.UOM, isAsc);
            default: return 0;
          }
        });
      }


      get(){
      //  console.log(this.unitList)
        var csv =[];
         for(let i=0;i<this.unitList.length;i++){
            
            //  this.name=this.dataSource[i].ItemName
            //  this.category=this.dataSource[i].CategoryName
            //  this.quny=this.dataSource[i].Quantity
        // console.log(this.materialList[i].ItemName,this.materialList[i].PONumber,this.materialList[i].Quantity)
         this.someData = 
             {   

                SNo: i, 
                UOM: this.unitList[i].UOM
               
                
            
            }
            
         // var someData = [
         //     {firstName: this.name, lastName: this.category, age: this.quny}
         //    ];
       csv.push(this.someData)
         }
       
         this.final=csv
     }



      convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    
        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }
       
        for(let i=0; i<data.length; i++)
        {
            data[i].IndentId
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
    
        filename = 'unitList.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
    
        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }
    

    
    search(ev): any {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.listData.filter = searchStr.trim().toLowerCase();
        this.dataSource = this.unitList.filter((item) => item.UOM.toLowerCase().includes(searchStr));
    }

    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
