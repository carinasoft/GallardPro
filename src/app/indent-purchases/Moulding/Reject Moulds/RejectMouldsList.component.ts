import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef,MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
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

import { ClientService } from 'app/services/client.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {  HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { DialogComponent } from '../reason/Dialog.component';
import { PlanningService } from 'app/services/planning.service';



export interface PeriodicElement {
    MouldNo: string;
    WorkOrderNo: string;
    ClientPONo: string;
    ClientName: string;
    DateofMoulding: string;
    Contractor: string;
    Product: string;
    Reason:string;
   }

    const ELEMENT_DATA: PeriodicElement[] = [
        {MouldNo: 'A2032', WorkOrderNo: '632', ClientPONo: '250319', ClientName: 'Porwal Auto Components Ltd',DateofMoulding: '10/04/2019', Contractor: 'Banwari', Product: 'Pacl Suspension Tube Fuji 4303',Reason:'Mould box Not matching'},
        {MouldNo: 'A2032', WorkOrderNo: '632', ClientPONo: 'AEE/18-19/240', ClientName: 'Jai Maa Gauri Industries',DateofMoulding: '10/04/2019', Contractor: 'Banwari', Product: 'End Ring Alert',Reason:'Bottam Crack'},
        {MouldNo: 'A2032', WorkOrderNo: '632', ClientPONo: 'OLD PO', ClientName: 'Alert Engg',DateofMoulding: '10/04/2019', Contractor: 'Banwari', Product: 'Rew-Im3601az',Reason:'Top Mould Not Available'},
       
        
      
      ];

@Component({
    selector     : 'RejectMouldsList',
    templateUrl  : './RejectMouldsList.component.html',
    styleUrls    : ['./RejectMouldsList.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class RejectMouldsListComponent implements OnInit
{    
    @Input() refreshList = false;
    @Input() disabled = true;
    dataSource :any;
    displayedColumns = ['sno','MouldNo', 'WorkOrderNo', 'ClientPONo', 'ClientName', 'DateofMoulding','Contractor','Product','Reason','action'];
   
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;
    listData: MatTableDataSource<any>;
    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
   
    serachData= [];
    serachData1:any;
    final=[];
    delRow;
    // Private
    private _unsubscribeAll: Subject<any>;
    public vendorList1: Observable<any[]> = of([]);
    createOrderForm: FormGroup;
    imageData:any;
    RejectMouldsList:any;
    constructor(
        public dialog: MatDialog,
        // public dialogRef: MatDialogRef<IssueStockComponent>,                
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _clientService: ClientService,
        private _formBuilder: FormBuilder,
        private httpService: HttpClient,
        private _planningSevcie: PlanningService
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

        this.getRejectMouldsList()

    }




   getRejectMouldsList(): any{
       
        this._planningSevcie.RejectMouldsList().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.dataSource = a.Body;
                this.serachData1 =a.Body
            }
            this.dataSource.map(row => {      
                row.isEditable = false;        
              }); 
              this.listData = new MatTableDataSource(this.dataSource);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
        });
    }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.listData.filter = searchStr.trim().toLowerCase();
        this.dataSource = this.serachData1.filter((item) => item.ProductName.toLowerCase().includes(searchStr));
    }


    
    Reject(row){
        console.log(row);
        this.dataSource.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
    }
    close(row)
    {
        this.getRejectMouldsList()
     
        this.dataSource.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
        row.isEditable = false;
        // var element = <HTMLInputElement>document.getElementById('myInput');
        // element.value = '';
    }
    
    delete(row){
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '250px',
            data: {rowdata: row}
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
           
          });
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
            this.listData=JSON.parse(JSON.stringify(this.dataSource));
            this._toastr.successToast('Rejected succesfully');
            this.getRejectMouldsList()
           }
        else{
               this._toastr.errorToast(a.Status);
            } 
        });
    }
   
    

    




}




