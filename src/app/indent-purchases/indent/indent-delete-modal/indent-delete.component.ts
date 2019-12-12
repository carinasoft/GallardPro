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
  selector: 'indent-delete-modal',
  styleUrls: ['./indent-delete.component.scss'],
  templateUrl: './indent-delete.component.html',
  animations   : fuseAnimations,
})
export class IndentDeleteComponent implements OnInit {
    public moment = moment;

    @Input() dataSource: any[] = [];
    displayedColumns = ['serial', 'date', 'number', 'name', 'category', 'qty', 'action'];

    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
      public dialogRef: MatDialogRef<IndentDeleteComponent>,
	    @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        public router :Router
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

        _.map(this.data.indentList, (o) => {
          o.CreateDate = moment(o.CreateDate).format('MM/DD/YYYY');
          return o.OrderQuantity = o.Quantity;  
        });
    }


    deleteIndent(indentId,idx): any {


      // if (this.data.indentList.length > 1) {
      //   if (this.data.isUpdate) {
      //     this._indentService.DeletePoIndent(rawId,this.data.poDetail.PONumber).subscribe(a => {
      //     // this._indentService.DeletePoIndent(this.data.indentList[idx].IndentId).subscribe(a => {
      //       if (a && a.Status.toLowerCase() === 'success') {
      //           this._toastr.successToast('Indent Deleted succesfully');
      //       } else {
      //           this._toastr.errorToast(a.Status);
      //       }
      //     });
  
      //   }
      //     this.data.indentList.splice(idx, 1);
      //     this.data = _.cloneDeep(this.data);  
           

          if (this.data.indentList.length > 0) {
      this._indentService.DeleteIndent(indentId).subscribe(a => {
          if (a && a.Status.toLowerCase() === 'success') {
              this._toastr.successToast('Indent deleted succesfully');
              this.data.indentList.splice(idx, 1);
              this.data = _.cloneDeep(this.data);
              //this.dialogRef.close(true);     
          } else {
              this._toastr.errorToast(a.status);
          }
      });
    }
    else{
     alert("")
    }
  }
}
