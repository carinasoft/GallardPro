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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  of } from 'rxjs';
export const gstList = [18,0, 5, 12, 28];
import { trigger, state,transition, style, animate, query, stagger,animateChild } from '@angular/animations';



@Component({
    selector     : 'material-list',
    templateUrl  : './materials-operation.component.html',
    styleUrls    : ['./materials-operation.component.scss'],
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
export class MaterialListComponent implements OnInit
{
    listData: MatTableDataSource<any>;
    dataSource: any[] = [];
    displayedColumns = ['serial', 'material', 'category', 'unit', 'hsn', 'gst', 'action'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    
    @ViewChild(MatSort)
    sort: MatSort;
    public gstList = gstList;
    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    materialList: any[] = [];
    categoryList: any[] = [];
    unitList: any[] = [];
    someData:any;;
    final=[];
    openFormInput:boolean;
    orderForm: FormGroup;
    public categoryList1: Observable<any[]> = of([]);
    public unitList1: Observable<any[]> = of([]);
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

    
    ngOnInit(): void
    {
        this.getMaterialList();
        this.openFormInput=false
        this.orderForm = this.createOrderForm();
        this.getCategory();
        this.getStockUnit();
      //  this.dataSource.paginator = this.paginator;
      this.orderForm.controls['CategoryId'].valueChanges.subscribe((value) => {
        if (value) {
            this.categoryList1 = of(this._filter(value, 'material'));
        } else {
            this.categoryList1 = of(this.categoryList);
        }
    });


    this.orderForm.controls['UOMID'].valueChanges.subscribe((value) => {
        if (value) {
            this.unitList1 = of(this._filter1(value, 'material1'));
        } else {
            this.unitList1 = of(this.unitList);
        }
    });
    }

    private _filter(value: string, type) {
        
        if(Number(value)) {
            return;
        }
        let filterValue = value.toLowerCase();
        switch (type) {
            case 'material': {
   return this.categoryList.filter( (option: any) => option.CategoryName.toLowerCase().includes(filterValue));
                        }
            
            
        }
    }
    private _filter1(value: string, type) {
        
        if(Number(value)) {
            return;
        }
        let filterValue = value.toLowerCase();
        switch (type) {
            case 'material1': {
                return this.unitList.filter( (option: any) => option.UOM.toLowerCase().includes(filterValue));
                                   }
            
            
        }
    }

    


    close(indent){
        indent.isEditable = false;
        this.getMaterialList();  
    }
    editRow(row) {
        this.dataSource.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
  }

  save(row){
    row.isEditable = false;
  
            let jsondata={
                RawMaterialId:row.RawMaterialId,
                ItemName:row.ItemName,
                CategoryId:row.CategoryName,
                UOMID:row.UOM,
                HsnCode:row.HsnCode,
                Gst:row.Gst
                         }
if(row.RawMaterialId && row.ItemName && row.CategoryName && row.UOM && row.HsnCode && row.Gst){
                         this._indentService.EditMaterial(jsondata).subscribe(a => {
                            if (a && a.Status.toLowerCase() === 'success') {
                                this._toastr.successToast('Material Edited succesfully');
                                this.getMaterialList();   
                                row.isEditable = false;
                            } else {
                                this._toastr.errorToast(a.status);
                            }
                        });
                    }
                    else{
                        
                        this._toastr.errorToast("Please Fill All Filds");
                    }
  }

  addVendorDetail(){
    let model = this.orderForm.value
     let value=  model.CategoryId
      console.log(value)
      this._indentService.AddValueCategory1(value).subscribe(a => {
        if (a && a.Status.toLowerCase() === 'success') {
            this._toastr.successToast('Category Added succesfully');
            this.getMaterialList();  
            this.getCategory();             
        } else {
            this._toastr.errorToast(a.status);
        }
    });
  }
  addVendorDetail1(){
    let model = this.orderForm.value
    let value=  model.UOMID
     console.log(value)

     this._indentService.AddUOM1(value).subscribe(a => {
        if (a && a.Status.toLowerCase() === 'success') {
            this._toastr.successToast('Added succesfully');
            this.getMaterialList();  
            this.getStockUnit();
        } else {
            this._toastr.errorToast(a.status);
        }
    });
  }
  public selectUnit1(unitId) {
    console.log(unitId)
  if (!unitId) {
      return;
  }
  let selection = this.unitList.find(e => e.UOM === unitId);
  if (selection) {
      return selection.UOM;
  }
}
  public selectUnit(unitId) {
      console.log(unitId)
    if (!unitId) {
        return;
    }
    let selection = this.categoryList.find(e => e.CategoryName === unitId);
    if (selection) {
        return selection.CategoryName;
    }
}
    getCategory(): any {
        this._indentService.GetCategory().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
               
                this.categoryList = a.Body;
               
                this.categoryList1 = of(a.Body);
                console.log(this.categoryList)
            } 
        });
    }
    getStockUnit() {
        this._indentService.GetStockUnit().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
             
                this.unitList = a.Body;
                this.unitList1 = of(a.Body);
               console.log(this.unitList1)
            }
           
        });
    }

    createOrderForm(): FormGroup {
        return this._formBuilder.group({
            ItemName: ['', [Validators.required]],
            CategoryId: ['', [Validators.required]],
            UOMID: ['', [Validators.required]],
            HsnCode: ['', [Validators.required]],
            Gst: ['', [Validators.required]]

        });

    }
    openForm(){
        this.openFormInput = true
    }
    cancelForm(){
        this.openFormInput=false
    }
    addMaterials(){
        this.openFormInput=false    
        const model = this.orderForm.value;
        console.log(model)
        // CategoryId: {CategoryId: 1, CategoryName: "Electrical Maintainece"}
        // Gst: 5
        // HsnCode: "qqqqq"
        // ItemName: "qqqqq"
        // UOMID: {UOMID: 2, UOM: "Sq Metre"}
       
  let jsonData = {CategoryId: model.CategoryId.CategoryId,
                  Gst:model.Gst,
                  HsnCode:model.HsnCode,
                  ItemName:model.ItemName,
                  UOMID:model.UOMID.UOMID}



                  this._indentService.AddMaterial(model).subscribe(a => {
                    if (a && a.Status.toLowerCase() === 'success') {
                        this._toastr.successToast('Material Addes succesfully');
                        this.getMaterialList();   
                        this.orderForm.reset();
                        this.openFormInput=false    
                    } else if(a.Status === 'Warning')
                    {
                       this._toastr.warningToast("Item already exists"); 
                   }
                   else{
                       this._toastr.errorToast(a.Status)
                   }
                });

    }

    getMaterialList(): any {
        this._indentService.GetRawMaterial().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.dataSource = a.Body;
                this.materialList = a.Body;
                this.get();
            } this.dataSource.map(row => {      
                row.isEditable = false;        
              }); 

              this.listData = new MatTableDataSource(this.materialList);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
        });
    }

    get(){
     //   console.log(this.materialList)
        var csv =[];
         for(let i=0;i<this.materialList.length;i++){
            
            //  this.name=this.dataSource[i].ItemName
            //  this.category=this.dataSource[i].CategoryName
            //  this.quny=this.dataSource[i].Quantity
         this.materialList[i].ItemName,this.materialList[i].PONumber,this.materialList[i].Quantity
         this.someData = 
             {   

                ItemName: this.materialList[i].ItemName, 
                CategoryName: this.materialList[i].CategoryName, 
                UOM: this.materialList[i].UOM,
                HsnCode: this.materialList[i].HsnCode,
                Gst: this.materialList[i].Gst
               
                
            
            }
            
         // var someData = [
         //     {firstName: this.name, lastName: this.category, age: this.quny}
         //    ];
         csv.push(this.someData)
         }
        
         this.final=csv
     }

    editIndent(obj): any {
        console.log(obj);
    }


    



    deleteMaterial(id): any {
        this._indentService.DeleteMaterial(id).subscribe(a => {
            if (a && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Material deleted succesfully');
                this.getMaterialList();       
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
            case 'unit': return compare(a.UOMID, b.UOMID, isAsc);
            default: return 0;
          }
        });
      }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.listData.filter = searchStr.trim().toLowerCase();
        this.dataSource = this.materialList.filter((item) => item.ItemName.toLowerCase().includes(searchStr) || item.CategoryName.toLowerCase().includes(searchStr)  || item.UOM.toLowerCase().includes(searchStr));
    }



    convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    
        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }
      //  data , data.length
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
    
        filename = 'Material List.csv';
    
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

