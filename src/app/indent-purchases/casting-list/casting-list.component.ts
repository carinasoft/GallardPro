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

import { CastingService } from 'app/services/casting.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Http } from '@angular/http';


@Component({
    selector     : 'casting-list',
    templateUrl  : './casting-list.component.html',
    styleUrls    : ['./casting-list.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class CastingListComponent implements OnInit, OnChanges {
    @Input() refreshList: boolean = false;
    //@Output() updateIndent: EventEmitter<any> = new EventEmitter(null);
    dataSource: any[] = [];
    displayedColumns = [ 'S.NO', 'CastingBase', 'Action'];
    delRow;
    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    public indentForm: FormGroup;
    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    castingList:any[] = [];
    someData:any;;
    final=[];
    inputFormValue:boolean
    private _unsubscribeAll: Subject<any>;
    public isUpdate = false;
    public newsForm: FormGroup;
    
    constructor(
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _castingService: CastingService,
        private _formBuilder: FormBuilder,
        private _fuseSidebarService: FuseSidebarService,
        public http:Http
    )
    {
        
        this._unsubscribeAll = new Subject();
    }

   
    ngOnInit(): void
    { this.indentForm = this.createIndentForm();
        this.getCastingList();
        this.inputFormValue=false
        this.newsForm = this.createNewsForm();
    }
    createNewsForm(): FormGroup {
        return this._formBuilder.group({
            Description: ['', [Validators.required]],
        });
    }

    openForm(){
        this.inputFormValue=true
    }
    cancelForm(){
        this.inputFormValue=false
    }
    public createIndentForm(): FormGroup {
        return this._formBuilder.group({
           
            CastingName: ['', [Validators.required]],
           
        });
    }

    public  addCasting() {
        this.inputFormValue=false
        let obj = this.indentForm.value
        console.log(obj)
         this._castingService.AddCasting(obj.CastingName).subscribe((a: any) => {
          if( a && a.Status && a.Status.toLowerCase() === 'success' )
             {
              this._toastr.successToast('Casting added succesfully');
              this.getCastingList();
              this.indentForm.reset();
             }
             else if(a.Status === 'Warning')
             {
                this._toastr.warningToast("Item already exists"); 
            }
            else{
                this._toastr.errorToast(a.Status)
            }
         });
      }
    getCastingList(): any {
       this._castingService.GetCasting().subscribe((a:any) => {
             if(a && a.Body && a.Body.length){
               //  console.log(a.Body)
                 this.dataSource = a.Body;
                 this.castingList = a.Body;
                 this.get();
             }
             this.dataSource.map(row => {      
                row.isEditable = false;        
              }); 
       })
       
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
    //{ID: 7, Name: "asasasasas", isEditable: false}
    this._castingService.CastingEdit(row).subscribe((a :any) =>{
        if( a && a.Status && a.Status.toLowerCase() === 'success' )
           {
            this._toastr.successToast('Casting Base Edited succesfully');
           
           }
        else{
               this._toastr.errorToast(a.Status);
            } 

    });
  }

  delete(row){
   // console.log(row);
    this.delRow = this.dataSource.indexOf(row);
    this.dataSource.splice(this.delRow,1);
   // console.log(this.dataSource);

    this._castingService.DeleteCasting(row).subscribe((a:any)=>{
      //  console.log(a)
        if (a && a.Status && a.Status.toLowerCase() === 'success') {
            this._toastr.successToast('Casting deleted succesfully');
           this.getCastingList();                
        } else {
            this._toastr.errorToast(a.Status);
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
       
            case 'Casting Base': return this.compare(a.Name, b.Name, isAsc);
            default: return 0;
          }
        });
    }

    

    

    ngOnChanges(s) {
        if (s && s.refreshList.currentValue) {
            //this.getIndentList();
        }
    }
    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.dataSource = this.castingList.filter((item) => item.Name.toLowerCase().includes(searchStr));
    }

    
    get(){
        var csv =[];
        for(let i=0;i<this.castingList.length;i++){
        this.someData = 
            {SNo: i+1, Name: this.castingList[i].Name}
        
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
    
        filename = 'Casting-List.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
    
        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }



    openAddNewsSideBar(){
        this.isUpdate = false;
        this.newsForm.get('Description').patchValue('');
        this._fuseSidebarService.getSidebar('addNews').toggleOpen();
    }

    saveNews(){
        const model = this.newsForm.value;

this.http.post('http://carinait.net/projects/CTSERPWebservices/webservices/index.php?action=SaveNews&Description='+model,{}).pipe(map(data => {
let a = data.json()          
if(a.success=='1'){
               this._toastr.successToast("Employee Attendance Save SuccessFully")
               this._fuseSidebarService.getSidebar('addNews').close();
            }
            else{
                this._toastr.errorToast(" An Error Occured While Uploding Attendance")
            }
       })).subscribe(result => {
        console.log(result);
      });
    }
} 
