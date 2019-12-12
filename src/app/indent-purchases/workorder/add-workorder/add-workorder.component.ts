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
import {  of } from 'rxjs';
import * as moment from 'moment';
import { ToasterService } from 'app/services/toaster.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { WorkorderPrintComponent } from '../work-order-print/workorder-print.component';
import { ProductlistforworkorderComponent } from '../workorderOfproductNo/product-listforworkorder.component';
import { ClientService } from 'app/services/client.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {  HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';


@Component({
    selector     : 'add-workorder',
    templateUrl  : './add-workorder.component.html',
    styleUrls    : ['./add-workorder.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class AddWorkorderComponent implements OnInit
{    
    @Input() refreshList = false;
    @Input() disabled = true;
    dataSource: any[] = [];
    dataSource1: any[] = [];
    
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
    displayFileName:any;
    // Private
    private _unsubscribeAll: Subject<any>;
    public vendorList1: Observable<any[]> = of([]);
    createOrderForm: FormGroup;
    imageData:any;
    constructor(
        public dialog: MatDialog,         
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _clientService: ClientService,
        private _formBuilder: FormBuilder,
        private httpService: HttpClient,
    )
    {
        
        this._unsubscribeAll = new Subject();
    }

   
    ngOnInit(): void
    {
        this.getClientList();
        this.createOrderForm = this.initCreateOrderForm();
        this.createOrderForm.controls['ClientName'].valueChanges.subscribe((value) => {
            if (value) {
                this.vendorList1 = of(this._filter(value, 'material'));
            } else {
                this.vendorList1 = of(this.dataSource);
            }
        });


    }


    onSelectVendor(vendor) {
        console.log(vendor)
        if (!vendor) {
          return;
      }
      this.createOrderForm.get('ClientID').enable();
      
      this.createOrderForm.patchValue({ClientID: vendor.Id,disabled: this.disabled});
    
    
      }
  
    private _filter(value: string, type) {
        
        if(Number(value)) {
            return;
        }
        let filterValue = value.toLowerCase();
        switch (type) {
            case 'material': {
   return this.dataSource.filter( (option: any) => option.Name.toLowerCase().includes(filterValue));
                        }
            
        }
    }
  

    fileChange(event) {
      
        let fileList: FileList = event.target.files;
        this.imageData = fileList

    }

    initCreateOrderForm() {
        return this._formBuilder.group({
            ClientName: ['', ],
            OrderDate: [moment(), ],
            DeliveryDate: [moment(), ],
            ClientPONo:  ['', ],
            ClientID: ['', ],
            Priority: ['', ],
            UploadedImage: ['', ],
       
        });
    }

    getClientList(): any {
        this._clientService.GetClientList().subscribe((a: any) => {
            
                this.dataSource = a.Body;
                this.vendorList1 =  of(a.Body);
                this.dataSource.map(row => {      
                    row.isEditable = false;        
                  }); 
                  
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
    
save(){

    const model = this.createOrderForm.value;
    if(model.ClientID && model.Priority && model.OrderDate && model.DeliveryDate){

    let formData:FormData = new FormData();
    if(this.imageData != null) {
        let file: File = this.imageData;
        console.log(file)
        formData.append('UploadedImage', file, file.name);
    }
      else{
        formData.append('UploadedImage', '');
      }
  
   formData.append('ClientId', model.ClientID);
   formData.append('Orderdate',  moment(model.OrderDate).format('MM/DD/YYYY'));
   formData.append('Deliverydate', moment(model.DeliveryDate).format('MM/DD/YYYY'));
   formData.append('ClientPoNo', model.ClientPONo);
   formData.append('Priority', model.Priority);
  
   console.log( model.Priority);
       const headers = new HttpHeaders();
       headers.append('Content-Type', 'multipart/form-data');  
        this.httpService.post('//api/SecondModuleApi/AddWorkOrder', formData,{ headers: headers}).subscribe(
            data => {
               let res:any;
                res=data;
                if (res && res.Status && res.Status.toLowerCase() === 'success') {
                    this._toastr.successToast(' added succesfully');
                    console.log(res.Body.WOID)


                    const dialogRef = this.dialog.open(ProductlistforworkorderComponent, {
                    width: '100%',
                    panelClass: ['max-950000', 'center-align'],
                    data: { id: res.Body.WOID }
                   });
              
                 
                   var element = <HTMLInputElement> document.getElementById("condition");
                     element.disabled = false;
                   
                this.createOrderForm.reset();
                

                }
                else{
                    this._toastr.errorToast(res.Status);
                    var element = <HTMLInputElement> document.getElementById("condition");
                     element.disabled = false;
                }
                
                
              
            },
            (err: HttpErrorResponse) => {
              console.log (err.message);   
            }
          );
        }
        else{
            this._toastr.errorToast("please Fill Required Filds");
            var element = <HTMLInputElement> document.getElementById("condition");
                     element.disabled = false;
        }
}

clear(){
    this.createOrderForm.reset();
}

onFileSelected() {
let srcResult;
    const inputNode: any = document.querySelector('#file');
  
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        srcResult = e.target.result;
       
       
      };
  
      reader.readAsArrayBuffer(inputNode.files[0]);
      let fileList: FileList = inputNode.files[0];
      this.imageData = fileList
      console.log(this.imageData)

      this.displayFileName=inputNode.files[0].name
     
    }
  }

}
function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

