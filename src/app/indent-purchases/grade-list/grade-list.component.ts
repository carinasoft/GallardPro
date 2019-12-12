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

import { Location } from '@angular/common';
import { CastingService } from 'app/services/casting.service';
import { ActivatedRoute } from '@angular/router';
import { getMaxListeners } from 'cluster';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
    selector     : 'grade-list',
    templateUrl  : './grade-list.component.html',
    styleUrls    : ['./grade-list.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class GradeListComponent implements OnInit {
    @Input() refreshList: boolean = false;
    //@Output() updateIndent: EventEmitter<any> = new EventEmitter(null);
    dataSource: any[] = [];
    displayedColumns = [ 'S.NO.', 'Casting Base', 'Grade', 'Action'];
    getlist: any[] = [];
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    gradeList:any[] = [];
    someData:any;;
    final=[];
    delRow;
    // Private
    private _unsubscribeAll: Subject<any>;
    inputFormValue:boolean
    public indentForm: FormGroup;
   
    constructor(
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        public location :Location,
        private _castingService: CastingService,
        private route: ActivatedRoute,
        private _formBuilder: FormBuilder,
    )
    {
       
        this._unsubscribeAll = new Subject();
    }

  
    ngOnInit(): void
    {
        
        let item  = this.route.snapshot.paramMap.get('id')
        console.log("Item ",item)
        this.getList(item);
        if(item == '00000'){
            this.getGradeList();
        }
        if(item == '0'){
            this.getGradeList();
        }
       
        this.indentForm = this.createIndentForm(item);
      
        this.inputFormValue=false
       
    }


    public addGade() {
        this.inputFormValue=false
        let obj = this.indentForm.value;
       // console.log(obj)
        this._castingService.addGrade(obj).subscribe((a: any) => {
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Grade added succesfully');
                //this.indentForm.reset();
                this.indentForm.controls['grade'].reset();
                this.getList(obj.casting);
                this.indentForm.reset();
               } else if(a.Status === 'Warning')
               {
                  this._toastr.warningToast("Item already exists"); 
              }
              else{
                  this._toastr.errorToast(a.Status)
              }
        });
    }

    public createIndentForm(item): FormGroup {
        return this._formBuilder.group({
            
            casting: new FormControl(item),
            grade: ['', [Validators.required]],
           
        });
    }

    openForm(){
        this.inputFormValue=true
    }
    cancelForm(){
        this.inputFormValue=false
    }

    getList(Id) {
        // console.log(Id)
         this._castingService.GetGradeListByCastingId(Id).subscribe((a: any) => {
           if (a) {
               this.getlist=a.Body;
               console.log(this.dataSource)
               //this.value=true;
               this.get();
           }
           
         });
       }



    getGradeList(): any {
         this._castingService.GetGrade().subscribe((a :any) => {
               if(a && a.Body && a.Body.length) {
                    this.dataSource = a.Body;
                    this.gradeList = a.Body;
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
     goBack() {
    this.location.back();
  }

  editRow(row) {
    this.dataSource.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
row.isEditable = true;
}

save(row){
row.isEditable = false;
this._castingService.GradeEdit(row).subscribe((a :any) =>{
    if( a && a.Status && a.Status.toLowerCase() === 'success' )
       {
        this._toastr.successToast('Grade Edited succesfully');
        this.getGradeList();
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
this._castingService.DeleteGrade(row).subscribe((a:any)=>{
    //  console.log(a)
      if (a && a.Status && a.Status.toLowerCase() === 'success') {
          this._toastr.successToast('Grade deleted succesfully');
          let item  = this.route.snapshot.paramMap.get('id')
          this.getList(item);              
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
            case 'Casting Base': return this.compare(a.CastingName, b.CastingName, isAsc);
            case 'Grade': return this.compare(a.GradeName, b.GradeName, isAsc);
            default: return 0;
          }
        });
    }

    

    

  
    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.dataSource = this.gradeList.filter((item) => item.GradeName.toLowerCase().includes(searchStr));
    }

    get(){
        var csv =[];
        for(let i=0;i<this.gradeList.length;i++){
        this.someData = 
            {SNo: i+1, CastingName: this.gradeList[i].CastingName,GradeName: this.gradeList[i].GradeName}
        
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
    
        filename = 'Grade-List.csv';
    
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
