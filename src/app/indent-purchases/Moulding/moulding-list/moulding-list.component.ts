import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation, Inject, Renderer2, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef,MAT_DIALOG_DATA, MatTable, MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
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
import { PeriodicElement } from 'app/indent-purchases/producation/Pouring Pending/PouringPending.component';




@Component({
    selector     : 'moulding-list',
    templateUrl  : './moulding-list.component.html',
    styleUrls    : ['./moulding-list.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class MouldinglistComponent implements OnInit
{    
    @Input() refreshList = false;
    @Input() disabled = true;
    dataSource:any;
   displayedColumns = ['DateofMoulding','MouldNo','Hardness','Check Status','Remarks', 'Base','Grade','WorkOrderNo','Product', 'Orderdate','ClientPONo', 'ClientName','Cancel'];
 // displayedColumns = ['selected1','position', 'name', 'weight', 'symbol','test','test1','test2','test3','test4','test5','test6','test7','test8'];
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    listData: MatTableDataSource<any>;
    serachData= [];
    valueData:boolean
    final=[];
    // Private
    private _unsubscribeAll: Subject<any>;
    public vendorList1: Observable<any[]> = of([]);
    mouldingForm: FormGroup;
    imageData:any;
    contractorList:any;
    delRow:any;
    mydata:any;
    serachData1:any;
    @ViewChild('table') table: MatTable<any>;
    selection = new SelectionModel<PeriodicElement>(true, []);

    date:any;
    id:any;
    shift:any;
    loader:boolean;

   
/**
     * Constructor
     *
     * @param {AnimationBuilder} _animationBuilder
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {ElementRef} _elementRef
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseMatchMediaService} _fuseMatchMediaService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {ObservableMedia} _observableMedia
     * @param {Renderer2} _renderer
     */





    constructor(
        public dialog: MatDialog,
        // public dialogRef: MatDialogRef<IssueStockComponent>,                
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _clientService: ClientService,
        private _formBuilder: FormBuilder,
        private httpService: HttpClient,
        private _planningSevcie: PlanningService,
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private _changeDetectorRef: ChangeDetectorRef,
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
        this.mouldingForm=this.createMouldingForm()
        this.getContractorList();
       
    }

/**
     * Toggle sidebar open
     *
     * @param key
     */
   toggleSidebarOpen(key): void
   {
       console.log(key)
       this._fuseSidebarService.getSidebar(key).close();
   }

    createMouldingForm(): FormGroup {
        return this._formBuilder.group({

            PlanDate: new FormControl((new Date()).toISOString()),
            ContractorId: ['', [Validators.required]],
            Shift: ['', [Validators.required]],
        });

    }


    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.listData.filter = searchStr.trim().toLowerCase();
        this.dataSource = this.serachData1.filter((item) => item.ProductName.toLowerCase().includes(searchStr));
    }


    allDataSelect(event, element){
        this.dataSource.forEach(row => row.selected = true);
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

    getContractorList() {
       
        this._planningSevcie.GetContractorList().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.contractorList = a.Body;

            }
        });
    }


    onSearchChange(searchValue){
        this.date=searchValue;
        let json ={
            PlanDate: this.date?this.date:(new Date()).toISOString(),
            ContractorId:this.id,
            Shift:this.shift
        }
        
        if(json.PlanDate && json.ContractorId && json.Shift){
            this.loader = true;
            this._planningSevcie.SearchMoulding(json).subscribe((a: any) => {
                if (a && a.Status && a.Status.toLowerCase() === 'success') {
                    this.loader = false;
                    console.log(a.Body)
                    this.dataSource = a.Body
                    this.serachData1 = a.Body
                    if (this.dataSource.length > 0) {
                        this.valueData = true;
                    }
                    else {
                        this.valueData = false;
                    }
                 this.listData = new MatTableDataSource(this.dataSource);
                 this.listData.sort = this.sort;
                 this.listData.paginator = this.paginator;
                   }
                  else{
                      this._toastr.errorToast(a.Status);
                      this.loader = false;
                  }
               });
        }
        else{
            
        }
    }
    onSearchChange1(searchValue){
        this.id=searchValue;
        let json ={
            PlanDate: this.date?this.date:(new Date()).toISOString(),
            ContractorId:this.id,
            Shift:this.shift
        }
        
        if(json.PlanDate && json.ContractorId && json.Shift){
            this.loader = true;
            this._planningSevcie.SearchMoulding(json).subscribe((a: any) => {
                if (a && a.Status && a.Status.toLowerCase() === 'success') {
                    this.loader = false;
                    console.log(a.Body)
                    this.dataSource = a.Body
                    this.serachData1 = a.Body
                    if (this.dataSource.length > 0) {
                        this.valueData = true;
                    }
                    else {
                        this.valueData = false;
                    }
                 this.listData = new MatTableDataSource(this.dataSource);
                 this.listData.sort = this.sort;
                 this.listData.paginator = this.paginator;
                   }
                  else{
                      this._toastr.errorToast(a.Status);
                      this.loader = false;
                  }
               });
        }
        else{
            
        }
    }
    onSearchChange2(searchValue){
        this.shift=searchValue;
        let json ={
            PlanDate: this.date?this.date:(new Date()).toISOString(),
            ContractorId:this.id,
            Shift:this.shift
        }
        
        if(json.PlanDate && json.ContractorId && json.Shift){
            this.loader = true;
            this._planningSevcie.SearchMoulding(json).subscribe((a: any) => {
                if (a && a.Status && a.Status.toLowerCase() === 'success') {
                    this.loader = false;
                    console.log(a.Body)
                    this.dataSource = a.Body
                    this.serachData1 = a.Body
                    if (this.dataSource.length > 0) {
                        this.valueData = true;
                    }
                    else {
                        this.valueData = false;
                    }
                 this.listData = new MatTableDataSource(this.dataSource);
                 this.listData.sort = this.sort;
                 this.listData.paginator = this.paginator;
                   }
                  else{
                      this._toastr.errorToast(a.Status);
                      this.loader = false;
                  }
               });
        }
        else{
            this._toastr.warningToast("No Record Found,Please make sure all required fields are filled out correctly")
        }
          }
    

    MoveToNextDay(){
        let array=[];
        for(let i=0; i<this.dataSource.length; i++){
          if(this.dataSource[i].MouldNo){
            
              let json={
  
  BaseName: this.dataSource[i].BaseName,
  CheckStatus: this.dataSource[i].CheckStatus,
  ClientName: this.dataSource[i].ClientName,
  ClientPoNo: this.dataSource[i].ClientPoNo,
  GradeName: this.dataSource[i].GradeName,
  Hardness: this.dataSource[i].Hardness,
  ID: this.dataSource[i].ID,
  MouldNo: this.dataSource[i].MouldNo,
  MouldingDate: this.dataSource[i].MouldingDate,
  NetWeight: this.dataSource[i].NetWeight,
  NoofPieces: this.dataSource[i].NoofPieces,
  Note: this.dataSource[i].Note,
  Orderdate: this.dataSource[i].Orderdate,
  ProductId: this.dataSource[i].ProductId,
  ProductName: this.dataSource[i].ProductName,
  Remarks: this.dataSource[i].Remarks,
  WODID: this.dataSource[i].WODID,
  WOID: this.dataSource[i].WOID
              }
  
           array.push(json)
          }
          else{
              console.log("No MouldNo")
          }
            
        }



        let jsondata ={
            PlanDate:moment(this.date).format('YYYY-MM-DD'),
            ContractorId:this.id,
            Shift:this.shift,
            Body:array
            }
           if(jsondata.Body.length === 0){
               alert("No Mould")
           }
           else {
            this._planningSevcie.PlanMoveToNextDay(jsondata).subscribe((a: any) => {
            if( a && a.Status && a.Status.toLowerCase() === 'success' )
            {
            this._toastr.successToast("Plan Moved To Next Day Successfully")
            }
            else{
                this._toastr.errorToast(a.Body);
            }
        });
           }
       

    }

   




    delete(row){
        
         this.delRow = this.dataSource.indexOf(row);
         this.dataSource.splice(this.delRow,1);
         
         this.listData=JSON.parse(JSON.stringify(this.dataSource));
         this.mydata = this.dataSource
          console.log(this.mydata)
     }
    
    toggleSidebarFolded(): void
    {
        this._fuseSidebarService.getSidebar('navbar').toggleFold();
    }

    MoveToProduction(){
  let array=[];
      for(let i=0; i<this.dataSource.length; i++){
        if(this.dataSource[i].MouldNo){
          
            let json={

BaseName: this.dataSource[i].BaseName,
CheckStatus: this.dataSource[i].CheckStatus,
ClientName: this.dataSource[i].ClientName,
ClientPoNo: this.dataSource[i].ClientPoNo,
GradeName: this.dataSource[i].GradeName,
Hardness: this.dataSource[i].Hardness,
ID: this.dataSource[i].ID,
MouldNo: this.dataSource[i].MouldNo,
MouldingDate: this.dataSource[i].MouldingDate,
NetWeight: this.dataSource[i].NetWeight,
NoofPieces: this.dataSource[i].NoofPieces,
Note: this.dataSource[i].Note,
Orderdate: this.dataSource[i].Orderdate,
ProductId: this.dataSource[i].ProductId,
ProductName: this.dataSource[i].ProductName,
Remarks: this.dataSource[i].Remarks,
WODID: this.dataSource[i].WODID,
WOID: this.dataSource[i].WOID
            }

         array.push(json)
        }
        else{
            console.log("No MouldNo")
        }
          
      }
      console.log(array)
      let jsondata ={
        PlanDate:moment(this.date).format('YYYY-MM-DD'),
        ContractorId:this.id,
        Shift:this.shift,
                        Body:array
                        }
      this._planningSevcie.MovedToProduction(jsondata).subscribe((a: any) => {
                               if( a && a.Status && a.Status.toLowerCase() === 'success' )
                               {
                               this._toastr.successToast("Plan Moved To Production Successfully")
                            
                               var element = <HTMLInputElement> document.getElementById("condition");
                               element.disabled = false;
                               let json ={
                                PlanDate: this.date?this.date:(new Date()).toISOString(),
                                ContractorId:this.id,
                                Shift:this.shift
                            }
                          
                                this._planningSevcie.SearchMoulding(json).subscribe((a: any) => {
                                    if (a && a.Status && a.Status.toLowerCase() === 'success') {
                                        console.log(a.Body)
                                        this.dataSource = a.Body
                                        this.serachData1 = a.Body
                                        if (this.dataSource.length > 0) {
                                            this.valueData = true;
                                        }
                                        else {
                                            this.valueData = false;
                                        }
                                     this.listData = new MatTableDataSource(this.dataSource);
                                     this.listData.sort = this.sort;
                                     this.listData.paginator = this.paginator;
                                       }
                                      else{
                                          this._toastr.errorToast(a.Status)
                                      }
                                   });

                               }
                               else{
                                  this._toastr.errorToast(a.Status);
                                  var element = <HTMLInputElement> document.getElementById("condition");
                               element.disabled = false;
                               }
                               });

        // let booleanValue=false;
        // let selectedIndent = _.filter(this.dataSource, (o: any) => o.selected);
        // if(selectedIndent && !selectedIndent.length) {
        //     var element = <HTMLInputElement> document.getElementById("condition");
        //              element.disabled = false;
        //     return this._toastr.warningToast('Please select atleast 1 plan');
        // }
        //   this.mydata =selectedIndent
        //     for(let i=0; i<this.mydata.length; i++){ 
        //         if(this.mydata[i].MouldNo){
        //             booleanValue=true;
        //         }
        //         else{
        //               booleanValue=false;
        //         }
        //     } 
        //                 if(booleanValue == true){
        //                 const value = this.mouldingForm.value
        //                 let json ={
        //                 PlanDate:moment(value.PlanDate).format('YYYY-MM-DD'),
        //                 ContractorId:value.ContractorId,
        //                 Shift:value.Shift,
        //                 Body:selectedIndent
        //                 }
        //                 console.log(json)
        //                        this._planningSevcie.MovedToProduction(json).subscribe((a: any) => {
        //                        if( a && a.Status && a.Status.toLowerCase() === 'success' )
        //                        {
        //                        this._toastr.successToast("Plan Moved To Production Successfully")
        //                        console.log(a.Body)
        //                        var element = <HTMLInputElement> document.getElementById("condition");
        //                        element.disabled = false;
        //                        }
        //                        else{
        //                           this._toastr.errorToast(a.Status)
        //                        }
        //                        });
        //                      }
                            }
}





















// MoveToNextDay(){
//     //  let date = new Date();
//     //  date.setDate( date.getDate() + 1);
//     //  console.log(date);


//     //  let json ={
//     //     PlanDate: date,
//     //     ContractorId:this.id,
//     //     Shift:this.shift
//     // }
    
//     // if(json.PlanDate && json.ContractorId && json.Shift){
//     //     this._planningSevcie.SearchMoulding(json).subscribe((a: any) => {
//     //         if (a && a.Status && a.Status.toLowerCase() === 'success') {
//     //             console.log(a.Body)
//     //             this.dataSource = a.Body
//     //             this.serachData1 = a.Body
//     //             if (this.dataSource.length > 0) {
//     //                 this.valueData = true;
//     //             }
//     //             else {
//     //                 this.valueData = false;
//     //             }
//     //          this.listData = new MatTableDataSource(this.dataSource);
//     //          this.listData.sort = this.sort;
//     //          this.listData.paginator = this.paginator;
//     //            }
//     //           else{
//     //               this._toastr.errorToast(a.Status)
//     //           }
//     //        });
//     // }
//     // else{
        
//     // }


// }


// //     searchButton(){
// //         const value = this.mouldingForm.value
// //         // let query = '?PlanDate='+moment(model.PlanDate).format('YYYY-MM-DD')+
// //         // '&ContractorId='+model.ContractorId+
// //         // '&Shift='+model.Shift;
// // console.log(value.PlanDate)
// //         if(value.PlanDate && value.ContractorId && value.Shift){
// //             this._planningSevcie.SearchMoulding(value).subscribe((a: any) => {
// //                 if (a && a.Status && a.Status.toLowerCase() === 'success') {
// //                     console.log(a.Body)
// //                     this.dataSource = a.Body
// //                     this.serachData1 = a.Body
// //                     if (this.dataSource.length > 0) {
// //                         this.valueData = true;
// //                     }
// //                     else {
// //                         this.valueData = false;
// //                     }
// //                  // this.toggleSidebarFolded()
// //                  this.listData = new MatTableDataSource(this.dataSource);
// //                  this.listData.sort = this.sort;
// //                  this.listData.paginator = this.paginator;

// //                    }
// //                   else{
// //                       this._toastr.errorToast(a.Status)
// //                   }
// //                });
// //         }
// //         else{
// //             this._toastr.errorToast("Please fill the form and search")
// //         }
    
// //     }
