import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';
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
import { DialogOverviewExampleDialogComponent } from '../password/DialogOverviewExampleDialog.component';

export interface DialogData {
    animal: string;
    name: string;
  }

@Component({
    selector     : 'workorder-list',
    templateUrl  : './workorder-list.component.html',
    styleUrls    : ['./workorder-list.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class WorkorderlistComponent implements OnInit
{    
    @Input() refreshList = false;
    @Input() disabled = true;
    dataSource: any[] = [];
    dataSource1: any[] = [];
    ///displayedColumns = ['sno','workorderno', 'order-date', 'Grade', 'Product Name', 'Total Net Weight','Notes','No. of Ordered Pieces','Planned','status','view','action'];
    displayedColumns = ['workorderno', 'order-date', 'Delivery Date', 'Client PO No', 'Client Name','Entry Date','Username','view','action'];
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    stockList = [];
    serachData= [];
    someData:any;;
    final=[];
    // Private
    private _unsubscribeAll: Subject<any>;
    public vendorList1: Observable<any[]> = of([]);
    createOrderForm: FormGroup;
    imageData:any;
    constructor(
        public dialog: MatDialog,
        // public dialogRef: MatDialogRef<IssueStockComponent>,                
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _clientService: ClientService,
        private _formBuilder: FormBuilder,
        private httpService: HttpClient,
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

        this.createOrderForm = this.initCreateOrderForm();
        this.getClientList();
        this.getWorkOrderList();

        this.createOrderForm.controls['ClientName'].valueChanges.subscribe((value) => {
            if (value) {
                this.vendorList1 = of(this._filter(value, 'material'));
            } else {
                this.vendorList1 = of(this.dataSource);
            }
        });


    }

    


    delete(row){
       
        const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
            width: '250px',
            data: {rowdata: row, isWorkOder: true}
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.getWorkOrderList();
          });
         
        //  this._clientService.DeleteWorkOrder(row).subscribe((a:any)=>{
           
        //      if (a && a.Status && a.Status.toLowerCase() === 'success') {
        //          this._toastr.successToast('WorkOrder deleted succesfully');
        //                  this.getWorkOrderList();
        //      } else {
        //          this._toastr.errorToast(a.Status);
        //      } 
        //  });
     
     }
    getWorkOrderList(): any {
        this._clientService.GetWorkOrderList().subscribe((a: any) => {
            
                this.dataSource1 = a.Body;
                this.serachData = a.Body
               
                this.get();
                  
        });
    }

   


    onSelectVendor(vendor) {
        console.log(vendor)
        if (!vendor) {
          return;
      }
      this.createOrderForm.get('ClientID').enable();
      
      this.createOrderForm.patchValue({ClientID: vendor.Id,disabled: this.disabled});
    
     // this.createOrderForm.get('ClientID').disable();
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
            ClientName: ['', [Validators.required]],
            // PONumber: [{value: moment().format('YYYYMMDDHHss'), disabled: true}],
            // PODate: [moment(), [Validators.required]],
            OrderDate: [moment(), [Validators.required]],
            DeliveryDate: [moment(), [Validators.required]],
            ClientPONo:  ['', [Validators.required]],
            ClientID: ['', [Validators.required]],
            Priority: ['', [Validators.required]],
            UploadedImage: ['', [Validators.required]],
            // IndentKey: ['']
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



    viewWorkOrder(material){
        console.log(material.WOID)
        const dialogRef = this.dialog.open(ProductlistforworkorderComponent, {
            width: '100%',
            panelClass: ['max-950000', 'center-align'],
            data: { id: material.WOID }
           });
    }



    createProduct(){
        this._fuseSidebarService.getSidebar('addvendorDetails').toggleOpen();
    }
    open(){
       
        
        const dialogRef = this.dialog.open(WorkorderPrintComponent, {
            width: '100%',
            panelClass: ['max-950', 'center-align'],
            data: { indentList: this.dataSource }
        });

        dialogRef.afterClosed().subscribe(isSuccess => {
            if (isSuccess) {
                // dialogRef.close();
                 
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
            case 'quantity': return compare(a.Quantity, b.Quantity, isAsc);
            default: return 0;
          }
        });
    }
    
save(){

    // const dialogRef = this.dialog.open(ProductlistforworkorderComponent, {
    //     width: '100%',
    //     panelClass: ['max-950000', 'center-align'],
    //     data: { indentList: this.dataSource }
    // });

    const model = this.createOrderForm.value;
   

    let formData:FormData = new FormData();
    if(this.imageData != null) {
        let file: File = this.imageData[0];
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
                this._fuseSidebarService.getSidebar('addvendorDetails').close();
                this.getWorkOrderList();
                this.createOrderForm.reset();

                }
                else{
                    this._toastr.errorToast(res.Status);
                }
                // this._fuseSidebarService.getSidebar('addvendorDetails').close();
                // this.getWorkOrderList();
                // this.createOrderForm.reset();
                
              
            },
            (err: HttpErrorResponse) => {
              console.log (err.message);   
            }
          );
    //}






    // const dialogRef = this.dialog.open(ProductlistforworkorderComponent, {
    //     width: '100%',
    //     panelClass: ['max-950', 'center-align'],
    //     data: { indentList: this.dataSource }
    // });
}
   
    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.dataSource1 = this.serachData.filter((item) => item.Name.toLowerCase().includes(searchStr) || item.ClientPoNo.toLowerCase().includes(searchStr));
    }
   

    get(){
        var csv =[];
        for(let i=0;i<this.dataSource1.length;i++){
        this.someData = 
            {SNo: i+1, 
                WOID: this.dataSource1[i].WOID,
                Orderdate: this.dataSource1[i].Orderdate,
                Deliverydate: this.dataSource1[i].Deliverydate,
                ClientPoNo: this.dataSource1[i].ClientPoNo,
                Name: this.dataSource1[i].Name,
                Entrydate: this.dataSource1[i].Entrydate,
                Status: this.dataSource1[i].WOID,
                
            }
        
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
    
        filename = 'workorderlist.csv';
    
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





// @Component({
//     selector: 'dialog-overview-example-dialog',
//     templateUrl: 'dialog-overview-example-dialog.html',
//   })
//   export class DialogOverviewExampleDialog {
  
//     constructor(
//       public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//       @Inject(MAT_DIALOG_DATA) public data: DialogData) {
          
//       }
  
//     onNoClick(): void {
//       this.dialogRef.close();
//     }
  
//   }

