import { DataSource } from '@angular/cdk/collections';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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
import { ProductService } from 'app/services/product.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {  HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { RequestOptions, RequestOptionsArgs } from '@angular/http';
import {HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType} from '@angular/common/http';
// import { HttpClient } from '@angular/common/https';
// import { HttpErrorResponse } from '@angular/common/https/src/response';

@Component({
    selector     : 'product-list',
    templateUrl  : './product-list.component.html',
    styleUrls    : ['./product-list.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class ProductlistComponent implements OnInit, OnChanges {
    @Input() refreshList: boolean = false;
    //@Output() updateIndent: EventEmitter<any> = new EventEmitter(null);
    dataSource: any[] = [];
    //'Length','Width','Height',
    displayedColumns = [ 'S.NO.', 'Product Name', 'Net Weight','Gross Weight','Design','Action'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('myInput')
    myInputVariable: ElementRef;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    indentList:any[] = [];
    public productForm: FormGroup;
    public productForm1: FormGroup;
    // Private
    private _unsubscribeAll: Subject<any>;
    public imagePath;
    imgURL: any;
    public message: string;
    fileToUpload: File = null;
    someData:any;;
    final=[];
    private imageSrc: string = '';
    percentDone: number;
    uploadSuccess: boolean;
    imageData:any;
    editProduct:any;
    EditName:any;
    EditImage:any;
    EditNetWeight:any;
    EditGrossWeight :any;
    EditLength :any;
    EditWidth :any;
    EditHeight:any;
    EditId:any
    listData: MatTableDataSource<any>;
    constructor(
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _productSevcie : ProductService,
        private _formBuilder: FormBuilder,
        private httpService: HttpClient,
        private http: HttpClient
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
        this.productForm = this.createProductForm();
      
        this.getIndentList();
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

    // createProductForm1(data): FormGroup{
    //     return this._formBuilder.group({
    //         Name:  new FormControl(data),
    //         NetWeight: new FormControl(data, [Validators.required]),
    //         GrossWeight: new FormControl(data, [Validators.required]),
    //         Length: new FormControl(data, [Validators.required]),
    //         Width: new FormControl(data, [Validators.required]),
    //         Height: new FormControl(data, [Validators.required]),
    //         UploadedImage : new FormControl(data, [Validators.required]),
    //     });
    // }

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
         if(this.EditName ){
            this._fuseSidebarService.getSidebar('addvendorDetails1').toggleOpen();
         }
        
       
    }

    updateProduct(){
        this._fuseSidebarService.getSidebar('addvendorDetails1').close();
        //console.log(this.EditName)
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
                     var element = <HTMLInputElement> document.getElementById("condition");
                     element.disabled = false;
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

    fileChange(event) {
        const formModel = this.productForm.value;
        let fileList: FileList = event.target.files;
        this.imageData = fileList
    //     if(fileList.length > 0) {
    //         let file: File = fileList[0];
    //         let formData:FormData = new FormData();
          
    //    formData.append('UploadedImage', file, file.name);
    //    formData.append('Name', formModel.Name);
    //    formData.append('NetWeight', formModel.NetWeight);
    //    formData.append('GrossWeight', formModel.GrossWeight);
    //    formData.append('Length', formModel.Length);
    //    formData.append('Width', formModel.Width);
    //    formData.append('Height', formModel.Height);
           
    //        const headers = new HttpHeaders();
    //        headers.append('Content-Type', 'multipart/form-data');  
    //         this.httpService.post('/api/SecondModuleApi/AddProduct', formData,{ headers: headers}).subscribe(
    //             data => {
                 
                  
    //               console.log (data);
    //             },
    //             (err: HttpErrorResponse) => {
    //               console.log (err.message);   
    //             }
    //           );
    //     }
    }
 //-------------------------------------------------------------------------------------------------------   
    
    onFileChange(event) {


        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
          let file = event.target.files[0];
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.productForm.get('UploadedImage').setValue({
              UploadedImage: file.name,
              filetype: file.type,
              value: reader.result
            })
          };
        }
      }
    

      uploadFiles () {
        this._fuseSidebarService.getSidebar('addvendorDetails').close();
        const formModel = this.productForm.value;
        let formData:FormData = new FormData();
   if(this.imageData!=null) {
            let file: File = this.imageData[0];
            
          
       formData.append('UploadedImage', file, file.name);
   }
       formData.append('Name', formModel.Name);
       formData.append('NetWeight', formModel.NetWeight);
       formData.append('GrossWeight', formModel.GrossWeight);
       formData.append('Length', formModel.Length);
       formData.append('Width', formModel.Width);
       formData.append('Height', formModel.Height);
           
           const headers = new HttpHeaders();
           headers.append('Content-Type', 'multipart/form-data');  
            this.httpService.post('/api/SecondModuleApi/AddProduct', formData,{ headers: headers}).subscribe(
                data => {
                 
                   
                    console.log (data);
                    let res:any;
                    res=data;

                    if (res && res.Status.toLowerCase() === 'success') {
                     this._toastr.successToast('Product added succesfully');
                     this._fuseSidebarService.getSidebar('addvendorDetails').close();
                     this.getIndentList();
                     this.productForm.reset();
                     this.myInputVariable.nativeElement.value = "";
                     var element = <HTMLInputElement> document.getElementById("condition");
                     element.disabled = false;
                    } 
                    else if(res.Status === 'Warning')
             {
                this._toastr.warningToast("Item already exists"); 
            }
            else{
                this._toastr.errorToast(res.Status)
            }
                },
                (err: HttpErrorResponse) => {
                  console.log (err.message);   
                }
              );
       // }
        

    //     let model = this.productForm.value
    //     const headers = new HttpHeaders();
    //     headers.append('Content-Type', 'multipart/form-data');  
      


    //     const formModel = this.productForm.value;
        
        
    //     const formData: FormData = new FormData();
       
     
    //    formData.append('UploadedImage', formModel.UploadedImage);
    //    formData.append('Name', formModel.Name);
    //    formData.append('NetWeight', formModel.NetWeight);
    //    formData.append('GrossWeight', formModel.GrossWeight);
    //    formData.append('Length', formModel.Length);
    //    formData.append('Width', formModel.Width);
    //    formData.append('Height', formModel.Height);
    //     console.log('formData', formData);
        
    //     this.httpService.post('/api/SecondModuleApi/AddProduct',formData,{ headers: headers}).subscribe(
    //       data => {
           
            
    //         console.log (data);
    //       },
    //       (err: HttpErrorResponse) => {
    //         console.log (err.message);   
    //       }
    //     );

       
      }
    
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


    getIndentList(): any {
        this._productSevcie.GetProductList().subscribe((a: any) => {
            if (a && a.Body &&a.Body.length) {
                this.dataSource = a.Body;
                this.indentList = a.Body;
                this.refreshList = false;
                this.get();
            }
            this.listData = new MatTableDataSource(this.dataSource);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
            
        });

        // this.dataSource.map(row => {      
        //     row.isEditable = false;        
        //   }); 
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
        this.listData.filter = searchStr.trim().toLowerCase();
        this.dataSource = this.indentList.filter((item) => item.Name.toLowerCase().includes(searchStr));
    }

    //-------------------------------------------------------------------------------------
   


    createProduct(){
        this._fuseSidebarService.getSidebar('addvendorDetails').toggleOpen();
    }

    
    get(){
        var csv =[];
        for(let i=0;i<this.indentList.length;i++){
        this.someData = 
            {SNo: i+1, Name: this.indentList[i].Name,NetWeight: this.indentList[i].NetWeight,GrossWeight: this.indentList[i].GrossWeight,Length: this.indentList[i].Length,Width: this.indentList[i].Width,Height: this.indentList[i].Height}
        
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
    
        filename = 'product-List.csv';
    
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
