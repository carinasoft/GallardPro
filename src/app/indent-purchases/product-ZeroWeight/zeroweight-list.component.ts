import { DataSource } from '@angular/cdk/collections';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { GeneratePurchaseOrder } from "app/indent-purchases/generate-order-modal/generate-order.component";
import { IndentService } from 'app/services/indent.service';
import { ToasterService } from "app/services/toaster.service";
import * as _ from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject, merge, Observable, Subject, fromEvent } from 'rxjs';
import { map, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IndentHistoryComponent } from 'app/indent-purchases/indent/indent-history-modal/indent-history.component';
import { AddIndentComponent } from "app/indent-purchases/indent/create-indent/add-indent.component";

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Location } from '@angular/common';
import { ProductService } from 'app/services/product.service';
import {  HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { RequestOptions, RequestOptionsArgs } from '@angular/http';
import {HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType} from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector     : 'zeroweight-list',
    templateUrl  : './zeroweight-list.component.html',
    styleUrls    : ['./zeroweight-list.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class ZeroweightlistComponent implements OnInit, OnChanges {
    @Input() refreshList: boolean = false;
    //@Output() updateIndent: EventEmitter<any> = new EventEmitter(null);
    dataSource: any[] = [];
    displayedColumns = [ 'S.NO.','Product Code', 'Product Name', 'Net Weight','Bunch Weight','Design','Action'];
    imageData:any;
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    indentList:any[] = [];
    someData:any;;
    final=[];
    editProduct:any;
    EditName:any;
    EditImage:any;
    EditNetWeight:any;
    EditGrossWeight :any;
    EditLength :any;
    EditWidth :any;
    EditHeight:any;
    EditId:any
    public productForm: FormGroup;
    public productForm1: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        public dialog: MatDialog,
        private _productSevcie : ProductService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        public location:Location,
        private httpService: HttpClient,
        private _formBuilder: FormBuilder,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.getIndentList();
        this.productForm = this.createProductForm();
    }
    createProductForm(): FormGroup{
        return this._formBuilder.group({
            Name: ['', []],
            NetWeight: ['', []],
            GrossWeight: ['', []],
            Length: ['', []],
            Width: ['', []],
            Height: ['', []],
            //UploadedImage : ['', [Validators.required]],
        });
    }
    getIndentList(): any {
        this._productSevcie.ZeroProductList().subscribe((a: any) => {
            if (a && a.Body &&a.Body.length) {
                this.dataSource = a.Body;
                this.indentList = a.Body;
                this.refreshList = false;
                this.get()
            }
        });

        this.dataSource.map(row => {      
            row.isEditable = false;        
          }); 
    }
//     editRow(row) {
//         this.dataSource.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
//     row.isEditable = true;
//   }
  goBack() {
    this.location.back();
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
            case 'IndentDate': return this.compare(a.CreateDate, b.CreateDate, isAsc);
            case 'priority': return this.compare(a.Priority, b.Priority, isAsc);
            case 'category': return this.compare(a.CategoryName, b.CategoryName, isAsc);
            case 'quantity': return this.compare(a.Quantity, b.Quantity, isAsc);
            case 'name': return this.compare(a.ItemName, b.ItemName, isAsc);
            default: return 0;
          }
        });
    }

    

    
    ngOnChanges(s) {
        if (s && s.refreshList.currentValue) {
            this.getIndentList();
        }
    }
    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.dataSource = this.indentList.filter((item) => item.Name.toLowerCase().includes(searchStr));
    }

    //-------------------------------------------------------------------------------------
    deleteRow(data){
        //console.log(data.ProductId)
        this._productSevcie.DeleteProduct(data.ProductId).subscribe((a:any)=>{
          //  console.log(a)
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Product deleted succesfully');
                 this.getIndentList();       
            } else {
                this._toastr.errorToast(a.Status);
            } 
        });
      
}


    createProduct(){
        this._fuseSidebarService.getSidebar('addvendorDetails').toggleOpen();
    }


    get(){
        var csv =[];
        for(let i=0;i<this.indentList.length;i++){
        this.someData = 
            {SNo: i+1,ProductCode:this.indentList[i].ProductId, Name: this.indentList[i].Name,NetWeight: this.indentList[i].NetWeight,BunchWeight: this.indentList[i].GrossWeight}
        
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
            data: this.final
        });
        if (csv == null) return;
    
        filename = 'zeroweightlist-List.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
    
        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

    editRow(row) {
        
        // console.log(row)
       
          this.editProduct = row
          console.log(this.editProduct)
          this.EditName = this.editProduct.Name
          this.EditNetWeight = this.editProduct.NetWeight
          this.EditGrossWeight = this.editProduct.GrossWeight
          this.EditLength = this.editProduct.Length
          this.EditWidth = this.editProduct.Width
          this.EditHeight = this.editProduct.Height
          this.EditImage = this.editProduct.Design
          this.EditId = this.editProduct.ProductId
          if(this.EditName && this.EditImage){
             this._fuseSidebarService.getSidebar('addvendorDetails1').toggleOpen();
          }
         
        
     }



     updateProduct(){
        console.log(this.EditName)
        let formData:FormData = new FormData();
       
        if(this.imageData!=null) {
            let file: File = this.imageData[0];
            formData.append('UploadedImage', file, file.name);
        }
              
           
           formData.append('Name', this.EditName);
           formData.append('NetWeight', this.EditNetWeight);
           formData.append('GrossWeight', this.EditGrossWeight);
           formData.append('Length', this.EditLength);
           formData.append('Width', this.EditWidth);
           formData.append('Height', this.EditHeight);
           formData.append('ProductID', this.EditId);
               
               const headers = new HttpHeaders();
               headers.append('Content-Type', 'multipart/form-data');  
                this.httpService.post('//api/SecondModuleApi/EditProduct', formData,{ headers: headers}).subscribe(
                    data => {
                     
                        this._fuseSidebarService.getSidebar('addvendorDetails1').close();
                        this.getIndentList();
                       // console.log (data);
                       let res:any;
                    res=data;

                    if (res && res.Status.toLowerCase() === 'success') {
                     this._toastr.successToast('Product Edited succesfully');
                     this.productForm.controls['Name'].reset()
                     this.productForm.controls['NetWeight'].reset()
                     this.productForm.controls['GrossWeight'].reset()
                     this.productForm.controls['Length'].reset()
                     this.productForm.controls['Width'].reset()
                     this.productForm.controls['Height'].reset()
                    //  Name: ['', [Validators.required]],
                    //  NetWeight: ['', [Validators.required]],
                    //  GrossWeight: ['', [Validators.required]],
                    //  Length: ['', [Validators.required]],
                    //  Width: ['', [Validators.required]],
                    //  Height: ['', [Validators.required]],
                    } 
                    else {
                        this._toastr.errorToast(res.status);
                    }
                    },
                    (err: HttpErrorResponse) => {
                      console.log (err.message);   
                    }
                  );
            //}
            



    }
} 
