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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
    selector     : 'category-list',
    templateUrl  : './category-operation.component.html',
    styleUrls    : ['./category-operation.component.scss'],
    //animations   : fuseAnimations,
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
export class CategoryListComponent implements OnInit

{   
     listData: MatTableDataSource<any>;
    dataSource: any[] = [];
    displayedColumns = ['serial', 'name', 'action'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    categoryList: any[] = [];
    someData:any;;
    final=[];
    inputFormValue:boolean;
    orderForm: FormGroup;
    private _unsubscribeAll: Subject<any>;

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
        this.getCategory();
        this.inputFormValue=false;
        this.orderForm = this.createOrderForm();
    }

    createOrderForm(): FormGroup {
        return this._formBuilder.group({
            CategoryName: ['', [Validators.required]]
        });

    }

    addCategory(){
        this.inputFormValue=false  
        const model = this.orderForm.value;
       
        this._indentService.AddValueCategory(model).subscribe(a => {
            if (a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Category Added succesfully');
                this.getCategory(); 
                this.inputFormValue=false               
            } else if(a.Status === 'Warning')
             {
                this._toastr.warningToast("Item already exists"); 
            }
            else{
                this._toastr.errorToast(a.Status)
            }
        });
    }

    openForm(){
        this.inputFormValue=true
    }
    cancelForm(){
        this.inputFormValue=false;
        this.getCategory();
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
    
    this._indentService.EditValueCategory(row).subscribe(a => {
        if (a && a.Status.toLowerCase() === 'success') {
            this._toastr.successToast('Category Edited succesfully');
            this.getCategory(); 
                      
        } else {
            this._toastr.errorToast(a.status);
        }
    });
    

  }
    

    getCategory(): any {
        this._indentService.GetCategory().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.dataSource = a.Body;
                this.categoryList = a.Body;
                this.get();
            } else {
                this.dataSource = [];
                this.categoryList = [];
            }
            this.dataSource.map(row => {      
                row.isEditable = false;        
              });
              
              this.listData = new MatTableDataSource(this.categoryList);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
        });
    }

    editIndent(obj): any {
        console.log(obj);
    }

    deleteCategory(id): any {
        this._indentService.DeleteCategory(id).subscribe(a => {
            if (a && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Category deleted succesfully');
                this.getCategory();                
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
            case 'number': return compare(a.PONumber, b.PONumber, isAsc);
            case 'supplier': return compare(a.VendorName, b.VendorName, isAsc);
            case 'date': return compare(a.PODate, b.PODate, isAsc);
            case 'dispatch': return compare(a.Despatchhrough, b.Despatchhrough, isAsc);
            default: return 0;
          }
        });
    }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.listData.filter = searchStr.trim().toLowerCase();
        this.dataSource = this.categoryList.filter((item) => item.CategoryName.toLowerCase().includes(searchStr));
    }

    get(){
        //console.log(this.categoryList)
        var csv =[];
         for(let i=0;i<this.categoryList.length;i++){
            
            //  this.name=this.dataSource[i].ItemName
            //  this.category=this.dataSource[i].CategoryName
            //  this.quny=this.dataSource[i].Quantity
        // console.log(this.materialList[i].ItemName,this.materialList[i].PONumber,this.materialList[i].Quantity)
         this.someData = 
             {   

                SNo: i+1, 
                CategoryName: this.categoryList[i].CategoryName
               
                
            
            }
            
         // var someData = [
         //     {firstName: this.name, lastName: this.category, age: this.quny}
         //    ];
         csv.push(this.someData)
         }
         //console.log(csv)
         this.final=csv
     }



    convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    
        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }
        //console.log(data , data.length)
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
    
        filename = 'Category-List.csv';
    
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
