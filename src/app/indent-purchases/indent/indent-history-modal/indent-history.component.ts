import {Component, Input, Inject, OnInit} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndentService } from '../../../services/indent.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'indent-history-modal',
  styleUrls: ['./indent-history.component.scss'],
  templateUrl: './indent-history.component.html',
  animations   : fuseAnimations,
})
export class IndentHistoryComponent implements OnInit {
    public moment = moment;

    @Input() dataSource: any[] = [];
    displayedColumns = ['serial', 'date', 'number',  'qty' ,'name', 'category',];
    someData:any;;
    final=[];
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
	    @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.get();

    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        
        _.map(this.data.indentList, (o) => {
          o.CreateDate = moment(o.CreateDate).format('MM/DD/YYYY');
          return o.OrderQuantity = o.Quantity;  
        });
    }

    get(){
       
        var csv =[];
         for(let i=0;i<this.data.indentList.length;i++){
            
            
        
         this.someData = 
             {SNo: i+1,Date: this.data.indentList[i].CreateDate,IndentNo: this.data.indentList[i].IndentId, Quantity: this.data.indentList[i].Quantity, RefIndent: this.data.indentList[i].RefIndent,RefPO:this.data.indentList[i].RefPO}
            
         // var someData = [
         //     {firstName: this.name, lastName: this.category, age: this.quny}
         //    ];
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
     
      for(let i=0; i<data.length; i++)
      {
          
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
       this.get();
      var data, filename, link;
  
      var csv = this.convertArrayOfObjectsToCSV({
          data: this.final
      });
     // console.log(data)
  
  
  
      if (csv == null) return;
  
      filename = 'Indent-History.csv';
  
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
