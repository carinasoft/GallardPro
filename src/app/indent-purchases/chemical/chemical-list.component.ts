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
import { AddchemicalComponent } from '../create-chemical/add-chemical.component';
import { CastingService } from 'app/services/casting.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
    selector     : 'chemical-list',
    templateUrl  : './chemical-list.component.html',
    styleUrls    : ['./chemical-list.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class ChemicallistComponent implements OnInit, OnChanges {
    @Input() refreshList: boolean = false;
    //@Output() updateIndent: EventEmitter<any> = new EventEmitter(null);
    dataSource: any[] = [];
    displayedColumns = [ 'S.NO.', 'Casting Base',  'Action'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    indentList:any[] = [];
    delRow;
    someData:any;;
    final=[];
    inputFormValue:boolean
    chemicalForm:FormGroup;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        public location :Location,
        private _castingService: CastingService,
        private _formBuilder: FormBuilder
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
        this.inputFormValue=false;
        this.chemicalForm = this.createChemicalForm();
       
       
            this.getGetChemical();
        
    }

    openForm(){
        this.inputFormValue=true
    }
    cancelForm(){
        this.inputFormValue=false
    }

    createChemicalForm(): FormGroup {
        return this._formBuilder.group({
            Name: ['', [Validators.required]]
        });

    }
    public  addChemical() {
        let obj = this.chemicalForm.value;
       
        this._castingService.AddChemical(obj.Name).subscribe((a: any) => {
           if (a && a.Status && a.Status.toLowerCase() === 'success') {
        
            this._toastr.successToast('Chemical added succesfully');
            this.getGetChemical();
            this.inputFormValue=false
           }
           else if(a.Status === 'Warning')
            {
               this._toastr.warningToast("Item already exists"); 
           }
           else{
               this._toastr.errorToast(a.Status)
           }
        //    else {
        //       this._toastr.errorToast(a.Status);
        //    }
        });

    }

    getGetChemical(): any {
        this._castingService.GetChemical().subscribe((a: any) => {
            if (a && a.Body &&a.Body.length) {
                this.dataSource = a.Body;
                this.indentList = a.Body;
                this.refreshList = false;
                this.get();
            }
            this.dataSource.map(row => {      
                row.isEditable = false;        
              }); 
        });
    }

     goBack() {
    this.location.back();
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
   
    this._castingService.ChemicalEdit(row).subscribe((a :any) =>{
        if( a && a.Status && a.Status.toLowerCase() === 'success' )
           {
            this._toastr.successToast('Chemical Edited succesfully');
           this.getGetChemical()
           }
        else{
               this._toastr.errorToast(a.Status);
            } 

    });
  }

  delete(row){
   
    this.delRow = this.dataSource.indexOf(row);
    this.dataSource.splice(this.delRow,1);
 

    this._castingService.DeleteChemical(row).subscribe((a:any)=>{
      
        if (a && a.Status && a.Status.toLowerCase() === 'success') {
            this._toastr.successToast('Chemical deleted succesfully');
           this.getGetChemical();                
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

    

    createChemical() {
        const dialogRef = this.dialog.open(AddchemicalComponent, {
            width: '40%',
            panelClass: ['max-950', 'center-align'],
        });

        dialogRef.afterClosed().subscribe(isSuccess => {
            if(isSuccess) {
                this.getGetChemical();
            }
        });
    }

    ngOnChanges(s) {
        if (s && s.refreshList.currentValue) {
           // this.getIndentList();
        }
    }
    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.dataSource = this.indentList.filter((item) => item.Name.toLowerCase().includes(searchStr));
    }

    get(){
        var csv =[];
        for(let i=0;i<this.indentList.length;i++){
        this.someData = 
            {SNo: i+1, Name: this.indentList[i].Name}
        
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
    
        filename = 'Chemical-List.csv';
    
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
