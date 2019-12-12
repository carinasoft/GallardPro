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
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ClientService } from 'app/services/client.service';


@Component({
    selector     : 'client-type',
    templateUrl  : './client-type.component.html',
    styleUrls    : ['./client-type.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ClientTypeComponent implements OnInit
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
    // Private
    inputFormValue:boolean
    private _unsubscribeAll: Subject<any>;
    orderForm: FormGroup;
    constructor(
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _formBuilder: FormBuilder,
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

        this.getStockUnit();
        this.inputFormValue=false
        this.orderForm = this.createOrderForm();
    }


    getStockUnit() {
        this._clientService.GetClientType().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.dataSource = a.Body;
                this.unitList = a.Body;
                this.get();
            }
            this.dataSource.map(row => {      
                row.isEditable = false;        
              }); 
        });
    }

    createOrderForm(): FormGroup {
        return this._formBuilder.group({
            ClientType: ['', [Validators.required]]
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
        const model = this.orderForm.value;
        console.log(model)
        this._clientService.AddClientType(model).subscribe(a => {
            if (a && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Added succesfully');
                this.inputFormValue=false
                this.getStockUnit();
            } else {
                this._toastr.errorToast(a.status);
            }
        });
    }

    close(indent){
        indent.isEditable = false;
    }
    editRow(row) {
        this.dataSource.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
  }

  save(row){
    row.isEditable = false;
    console.log(row)
    this._clientService.EditClientType(row).subscribe(a => {
        if (a && a.Status.toLowerCase() === 'success') {
            this._toastr.successToast('Edit succesfully');
            this.getStockUnit();
        } else {
            this._toastr.errorToast(a.status);
        }
    });

  }


    deleteUnit(unitId): any {
        this._clientService.DeleteClientType(unitId).subscribe(a => {
            if (a && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('ClientType deleted succesfully');
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

                SNo: i+1, 
                ClientType: this.unitList[i].ClientType
               
                
            
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
    
        filename = 'ClientType.csv';
    
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
        this.dataSource = this.unitList.filter((item) => item.ClientType.toLowerCase().includes(searchStr));
    }

    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
