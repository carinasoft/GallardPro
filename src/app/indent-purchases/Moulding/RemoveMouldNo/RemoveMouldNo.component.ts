import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
//Planned	Pending for Planning
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
    selector: 'RemoveMouldNo',
    templateUrl: './RemoveMouldNo.component.html',
    styleUrls: ['./RemoveMouldNo.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class RemoveMouldNoComponent implements OnInit {
    @Input() refreshList = false;
    @Input() disabled = true;
    dataSource : any;
    displayedColumns = ['selected', 'WorkOrderNo', 'OrderDate', 'Client PO No', 'Client Name', 'Product',  'No.of Pieces','Reason','action'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;

    serachData = [];

    final = [];
    // Private
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
    serachData1:any;

    boolvalue:boolean;
    Dateform:any;
    Dateto:any;
    MouldNo:any;
    loader:boolean;
    delRow:any;

    constructor(
        public dialog: MatDialog,
        // public dialogRef: MatDialogRef<IssueStockComponent>,                
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _clientService: ClientService,
        private _formBuilder: FormBuilder,
        private httpService: HttpClient,
        private _productSevcie: ProductService,
        private _planningSevcie: PlanningService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.planningForm = this.createPlanningForm();
      
    }

   
    createPlanningForm(): FormGroup {
        return this._formBuilder.group({

            PlanDate: new FormControl((new Date()).toISOString()),
            MouldNo: ['',],
        
        });

    }
   

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.dataSource = this.serachData1.filter((item) => item.ProductName.toLowerCase().includes(searchStr));
    }


    onSearchChange(event){
        this.Dateform=event;
        this.searchButton();
    }

    onSearchChange1(event){
        this.Dateto=event;
        this.searchButton();
    }

    onSearchChange2(event){
        this.MouldNo=event;
        this.searchButton();
    }
//http://localhost:1153//api/PlanningApi/RemoveMouldSearch?MouldDateFrom=&MouldDateTo=&MouldCode=A1234
    searchButton() {
        let json ={ 
            MouldDateFrom:moment(this.Dateform).format('YYYY-MM-DD')?moment(this.Dateform).format('YYYY-MM-DD'):(new Date()).toISOString(),
            MouldDateTo:moment(this.Dateto).format('YYYY-MM-DD')?moment(this.Dateto).format('YYYY-MM-DD'):(new Date()).toISOString(),
            MouldCode:this.MouldNo?this.MouldNo:''
        }
     if( json.MouldDateFrom && json.MouldDateTo){

     this.loader =true;
     this._planningSevcie.RemoveMouldNoSearch(json).subscribe((a: any) => {
    if( a && a.Status && a.Status.toLowerCase() === 'success' )
       {
       console.log(a.Body)
       this.loader =false;
       this.dataSource=a.Body
       this.serachData1=a.Body
       this.dataSource.map(row => {      
        row.isEditable = false;        
      }); 
       if(this.dataSource.length > 0)
       {
        this.boolvalue=true
       }
       else{
        this.boolvalue=false
       }


       }
      else{
          this._toastr.errorToast(a.Status);
          this.loader =false;
      }
   });
}  



         }
         

    select(event,element){
        if(event.checked){
   this.dataSource.map(row => {      
        row.selected = event.checked; 
        row.selected.style.background ="#ccc"         
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

        let json ={
            Status:'Success',
            Body:selectedIndent 
        }
        ///api/PlanningApi/ReMoveMouldMoveToProduction 
        
        this._planningSevcie.MoveToPlanning(json).subscribe((a: any) => {
            if( a && a.Status && a.Status.toLowerCase() === 'success' )
               {
                this._toastr.successToast(a.Status)
               //console.log(a.Body)
              // this.dataSource=a.Body
               this.searchButton();
               var element = <HTMLInputElement> document.getElementById("condition");
                     element.disabled = false;
               }
              else{
                  this._toastr.errorToast(a.Status)
              }
           });


     }


     Reject(row){
        console.log(row);
        this.dataSource.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
        row.isEditable = true;
    }

    close(row)
    {
        this.searchButton();
        this.dataSource.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
        row.isEditable = false;
    }

    save(row){
        console.log(row)

        let reason = row.Reason;
        let ID     = row.ID;
        this._planningSevcie.Reject(row).subscribe((a: any) => {
            if( a && a.Status && a.Status.toLowerCase() === 'success' )
           {
            this.delRow = this.dataSource.indexOf(this.dataSource);
            this.dataSource.splice(this.delRow, 1);
            this.dataSource=JSON.parse(JSON.stringify(this.dataSource));
            this._toastr.successToast('Rejected succesfully');
            this.searchButton();
           }
        else{
               this._toastr.errorToast(a.Status);
            } 
        });
    }











}
function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}





