import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';


import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { IndentService } from 'app/services/indent.service';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { of } from 'rxjs';
import * as moment from 'moment';
import { ToasterService } from 'app/services/toaster.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ClientService } from 'app/services/client.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { ProductService } from 'app/services/product.service';
import { PlanningService } from 'app/services/planning.service';
import {SelectionModel} from '@angular/cdk/collections';
import * as $ from 'jquery';



export interface PeriodicElement {
    WorkOrderNo: string;

    Pending: string
    OrderDate: string;
    ClientPONo: string;
    ClientName: string;
    Planned: string;
    Product: string;
    Weight: string;
    Pieces: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { WorkOrderNo: '4288', OrderDate: '11/11/2019', ClientPONo: 'Verbal', ClientName: 'Alert Engg', Product: 'Bearing cartridge 01033', Weight: '0.000', Pieces: '02', Planned: '1', Pending: '12' },
    { WorkOrderNo: '4288', OrderDate: '11/11/2019', ClientPONo: 'Verbal', ClientName: 'Alert Engg', Product: 'Bearing cartridge 01033', Weight: '0.000', Pieces: '02', Planned: '1', Pending: '12' },
    { WorkOrderNo: '4288', OrderDate: '11/11/2019', ClientPONo: 'Verbal', ClientName: 'Alert Engg', Product: 'Bearing cartridge 01033', Weight: '0.000', Pieces: '02', Planned: '1', Pending: '12' },
    { WorkOrderNo: '4288', OrderDate: '11/11/2019', ClientPONo: 'Verbal', ClientName: 'Alert Engg', Product: 'Bearing cartridge 01033', Weight: '0.000', Pieces: '02', Planned: '1', Pending: '12' },
    { WorkOrderNo: '4288', OrderDate: '11/11/2019', ClientPONo: 'Verbal', ClientName: 'Alert Engg', Product: 'Bearing cartridge 01033', Weight: '0.000', Pieces: '02', Planned: '1', Pending: '12' },
    { WorkOrderNo: '4288', OrderDate: '11/11/2019', ClientPONo: 'Verbal', ClientName: 'Alert Engg', Product: 'Bearing cartridge 01033', Weight: '0.000', Pieces: '02', Planned: '1', Pending: '12' },
    { WorkOrderNo: '4288', OrderDate: '11/11/2019', ClientPONo: 'Verbal', ClientName: 'Alert Engg', Product: 'Bearing cartridge 01033', Weight: '0.000', Pieces: '02', Planned: '1', Pending: '12' },


];

@Component({
    selector: 'Planning-home',
    templateUrl: './Planning-home.component.html',
    styleUrls: ['./Planning-home.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PlanninghomeComponent implements OnInit {
    @Input() refreshList = false;
    @Input() disabled = true;
    dataSource : any;
    displayedColumns = ['selected', 'WorkOrderNo', 'OrderDate', 'Client PO No', 'Client Name', 'Product', 'Weight', 'No.of Pieces', 'Planned', 'Pending'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    listData: MatTableDataSource<any>;
    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;

    serachData = [];
    someData:any
    final = [];
    private _unsubscribeAll: Subject<any>;
    vendorList:any;
    public vendorList1: Observable<any[]> = of([]);
    createOrderForm: FormGroup;
    imageData: any;
    public planningForm: FormGroup;
    contractorList: any;
    productList: any;
    public productListFilter: Observable<any[]> = of([]);
    selection = new SelectionModel<PeriodicElement>(true, []);
    dataValueHave:boolean;

    date:any;
    id:any;
    sift:any;
    product:any;
    name;any;
    loader:boolean;


    constructor(
        public dialog: MatDialog,               
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _clientService: ClientService,
        private _formBuilder: FormBuilder,
        private httpService: HttpClient,
        private _productSevcie: ProductService,
        private _planningSevcie: PlanningService
    ) {
        
        this._unsubscribeAll = new Subject();
    }

 
    ngOnInit(): void {
        this.planningForm = this.createPlanningForm();
        this.getProductList();
        this.getContractorList();
        this.getClientList();
    }


    createPlanningForm(): FormGroup {
        return this._formBuilder.group({

            PlanDate: new FormControl((new Date()).toISOString()),
            ContractorId: ['', [Validators.required]],
            ClientID: ['',],
            ProductId: ['', ],
            Shift: ['', [Validators.required]],
        });

    }


    getContractorList() {
       
        this._planningSevcie.GetContractorList().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.contractorList = a.Body;

            }
        });
    }

    getClientList(): any {
        this._clientService.GetClientList().subscribe((a: any) => { 
            this.vendorList =  a.Body;   
                this.vendorList1 =  of(a.Body);          
        });
    }


    getProductList() {
        this._productSevcie.GetProductList().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.productList = a.Body;
                this.productListFilter = of(a.Body);
            }
        });
    }

    createProduct() {
        this._fuseSidebarService.getSidebar('addvendorDetails').toggleOpen();
    }

    onSearchChange(item){
        //:::::::::::::::::::::::::::::::::
        this.date = item;
        this.callSearchButton();
    }

    onSearchChange1(item){
        this.id = item;
        this.callSearchButton();
    }

    onSearchChange2(item){
        this.sift = item;
        this.callSearchButton();
    }

    onSearchChange3(item){
        for(let i=0; i<this.productList.length; i++){
            if(this.productList[i].Name == item)
                {
                    if(item  == undefined){
                        this.product =0
                    }
                    else{
                        this.product =  this.productList[i].ProductId
                    }   
                }        
              }
     //  this.product = item;
       this.callSearchButton();
    }

    onSearchChange4(item){
        for(let i=0; i<this.vendorList.length; i++){
            if(this.vendorList[i].Name == item)
                {
                     if(item == undefined){
                        this.name = 0
                     }
                     else{
                        this.name = this.vendorList[i].Id
                     }
                }
             }
        //this.name = item;
        this.callSearchButton();
    }

    callSearchButton(){
        let json = {
            PlanDate: moment(this.date).format('YYYY-MM-DD')?moment(this.date).format('YYYY-MM-DD'):(new Date()).toISOString(),
            ContractorId:this.id,
             ClientID:this.name?this.name:0,
             ProductId:this.product?this.product:0,
             Shift:this.sift
        }
        if(this.id && this.sift || this.product || this.name){
            this.loader=true
            this._planningSevcie.SearchPlanning(json).subscribe((a: any) => {
                if( a && a.Status && a.Status.toLowerCase() === 'success' )
                   {
                   console.log(a.Body)
                   this.loader=false;
                   this.dataSource=a.Body
                   this.serachData=a.Body
                   this. get()
                   if(this.dataSource.length > 0){
                     this.dataValueHave = true
                   }
                   else{
                    this.dataValueHave = false
                   }
                          this.listData = new MatTableDataSource(this.dataSource);
                          this.listData.sort = this.sort;
                          this.listData.paginator = this.paginator;       
                   }
                  else{
                     
                      if(a.status =="error")
                      {
                        this._toastr.errorToast("Something went wrong ,Internal Server Error 500")
                      }
                      else{
                        this._toastr.errorToast(a.Status)
                        this.loader=false
                      }  
                  }
               });
        }
        else{
           
        }
        
    }


//     searchButton() {
//         const value = this.planningForm.value
//         let json;
//          if(value.ClientID || value.ProductId)
//          {
//              let ClientID1;
//              let ProductId2
//                  console.log(value.ClientID + '<<<<&>>>>' + value.ProductId)
//                  for(let i=0; i<this.vendorList.length; i++){
//                      if(this.vendorList[i].Name == value.ClientID)
//                          {
//                               if(value.ClientID == undefined){
//                                 ClientID1 = 0
//                               }
//                               else{
//                                 ClientID1 = this.vendorList[i].Id
//                               }
//                          }
//                       }
//                  for(let i=0; i<this.productList.length; i++){
//                     if(this.productList[i].Name == value.ProductId)
//                         {
//                             if(value.ProductId  == undefined){
//                                 ProductId2 =0
//                             }
//                             else{
//                                 ProductId2 =  this.productList[i].ProductId
//                             }   
//                         }        
//                       }
              
//                 json = {
//                     PlanDate: moment(value.PlanDate).format('YYYY-MM-DD'),
//                     ClientID:ClientID1?ClientID1:0,
//                     ProductId:ProductId2?ProductId2:0,
//                     ContractorId:value.ContractorId,
//                     Shift:value.Shift
//                 }
//                 console.log(json)


// this._planningSevcie.SearchPlanning(json).subscribe((a: any) => {
//     if( a && a.Status && a.Status.toLowerCase() === 'success' )
//        {
//        console.log(a.Body)
//        this.dataSource=a.Body
//        this.serachData=a.Body
//        this. get()
//        if(this.dataSource.length > 0){
//          this.dataValueHave = true
//        }
//        else{
//         this.dataValueHave = false
//        }
//               this.listData = new MatTableDataSource(this.dataSource);
//               this.listData.sort = this.sort;
//               this.listData.paginator = this.paginator;       
//        }
//       else{
         
//           if(a.status =="error")
//           {
//             this._toastr.errorToast("Something went wrong ,Internal Server Error 500")
//           }
//           else{
//             this._toastr.errorToast(a.Status)
//           }  
//       }
//    });
//  }
//          else{
//             console.log('No Value')
//             this._toastr.errorToast("Please select product or client name")
//          }
    
    
//         }









    
    select(event,element){
        if(event.checked){
   this.dataSource.map(row => {      
        row.selected = event.checked;     
        row.selected.style.background ="#039be5;"    
      });
        }
        else{
            this.dataSource.map(row => {      
                row.selected = event.checked;        
              });
        }
    
    }

    allDataSelect(event, element){
        this.dataSource.forEach(row => row.selected = true);
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.length;
        return numSelected === numRows;
      }
    
     
      masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.forEach(row => this.selection.select(row));
      }

     submitButton(){
        let selectedIndent = _.filter(this.dataSource, (o: any) => o.selected);
        if(selectedIndent && !selectedIndent.length) {
            var element = <HTMLInputElement> document.getElementById("condition");
                     element.disabled = false;
            return this._toastr.warningToast('Please select atleast 1 Plan');
        }
        console.log(selectedIndent)
        
        const value = this.planningForm.value
                   
                    let arrayData:[]

                    let json ={
                        PlanDate:moment(value.PlanDate).format('YYYY-MM-DD'),
                        ContractorId:value.ContractorId,
                        Shift:value.Shift,
                        Body:selectedIndent
                    }
                    console.log(json)


                    this._planningSevcie.SubmitPlanning(json).subscribe((a: any) => {
                        if( a && a.Status && a.Status.toLowerCase() === 'success' )
                           {
                           console.log(a)  
                            
                           this._toastr.successToast("Successfully Planned")
                         
                           this.callSearchButton();
                           var element = <HTMLInputElement> document.getElementById("condition");
                             element.disabled = false;    
                           }
                        else
                          { 
                            if(a.status =="error")
          {
            this._toastr.errorToast("Something went wrong ,Internal Server Error 500")
          }
          else{
            this._toastr.errorToast(a.Status)
          }
                          }
                        });
     }

    


    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.listData.filter = searchStr.trim().toLowerCase();
        //this.dataSource = this.serachData.filter((item) => item.ProductName.toLowerCase().includes(searchStr));
    }


    get(){
        var csv =[];
        for(let i=0;i<this.dataSource.length;i++){
        this.someData = 
                {SNo: i+1, 
                WOID: this.dataSource[i].WOID,
                Orderdate: this.dataSource[i].Orderdate,
                ClientName: this.dataSource[i].ClientName,
                ClientPoNo: this.dataSource[i].ClientPoNo,
                ProductName: this.dataSource[i].ProductName,
                NetWeight: this.dataSource[i].NetWeight,
                NoofPieces: this.dataSource[i].NoofPieces,
                Planned  : this.dataSource[i].Planned,
                PendingforPlanning:this.dataSource[i].PendingforPlanning

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
        console.log(data, data.length)
        for (let i = 0; i < data.length; i++) {
            console.log(data[i].IndentId)
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
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

        filename = 'planning.csv';

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



