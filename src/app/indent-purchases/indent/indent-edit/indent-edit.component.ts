import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter, Input, OnChanges, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { IndentService } from 'app/services/indent.service';
import { ToasterService } from 'app/services/toaster.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Http, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';


export const gstList = [0, 5, 12, 18, 28];
export const priority = ['normal', 'urgent'];

@Component({
    selector     : 'indent-edit',
    templateUrl  : './indent-edit.component.html',
    styleUrls    : ['./indent-edit.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class IndentEditComponent implements OnInit {
    public moment = moment;
    @Output('indentCreated') indentCreated: EventEmitter<boolean> = new EventEmitter(false);
    @Input() dataSource: any[] = [];
    displayedColumns = ['serial', 'date', 'number', 'name',  'qty', 'newqty'];
    IssueStockForm: any = {};
    public indentForm: FormGroup;
    public indentList = [];
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
      public dialogRef: MatDialogRef<IndentEditComponent>,
	    @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        public http:Http
        
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
        this.indentForm = this.createIndentForm();
    }


    public createIndentForm(): FormGroup {
        return this._formBuilder.group({
            
            IndentId: [{value: moment().format('YYYYMMDDHHss'), disabled: true}],
           
        });
    }


  updateData(id): any {
   // this.indentForm.enable();
   // let model = this.prepareRequest();
     const model: any = _.cloneDeep(this.IssueStockForm);
     model.item = _.cloneDeep(this.data.indentList);
    
     let value = this.data.indentList;
     
    //  if( value[0].Quantity <= this.data.Q){
    //      console.log(this.data.Q <= value[0].Quantity)
    //  }
    //  else{
    //     console.log("Wonrg ")
    //  }

           
      this._indentService.UpdateIndent(id,value[0].Quantity).subscribe(a => {
              
             if (a && a.Status.toLowerCase() === 'success') {
                 this._toastr.successToast('Record Updated succesfully');
                 this.IssueStockForm = {};
               
                 //this.dialogRef.close(true);
             } else {
                          this._toastr.errorToast(a.Body);
                  this.dialogRef.close(false);                
             }
         });




      //let options = new RequestOptions({ headers: headers });
    //   this.http.post('/api/MasterApi/EditIndent'+JSON.stringify(model),{
    //     headers:new HttpHeaders()
    //     .set('Content-Type','application/json')
    //     }).pipe(map(data => {
   
    //     console.log(data);
    // })).subscribe(result => {
    //     //console.log(result);
    //   });
   
      //   this._indentService.UpdateIndent(model).subscribe(a => {
    //       console.log(a)
    //      if (a && a.Status.toLowerCase() === 'success') {
    //          this._toastr.successToast('Stock issued succesfully');
    //          this.IssueStockForm = {};
           
    //          this.dialogRef.close(true);
    //      } else {
    //                   this._toastr.errorToast(a.Body);
    //           this.dialogRef.close(false);                
    //      }
    //  });
  }

  

prepareRequest(){
    this.indentForm.get('IndentId').enable();
    const model: any = _.cloneDeep(this.indentForm.value);
    this.indentForm.get('IndentId').disable();

    let RawMaterial = _.find(this.data.indentList, (o: any) => {
            return model.RawMaterialId;
    });

    if (RawMaterial) {
        model.RawMaterialId = RawMaterial.RawMaterialId;
    } else {
        return this._toastr.errorToast("Raw Material doesn't exist");
    }

    model.CreateDate = moment(model.CreateDate).format('MM/DD/YYYY');
    return model;
}
// public updateIndent() {
//     this.indentForm.enable();
//     let model = this.prepareRequest();
//     this._indentService.UpdateIndent(model).subscribe(a => {
//         if (a && a.Status && a.Status.toLowerCase() === 'success') {
//             this._toastr.successToast('Indent updated succesfully');
//             this.materialFilter = of(this.materialList);
//             this.dialogRef.close(true);
//         } else {
//             this._toastr.errorToast(a.Status);
//         }
//     });

// }

}
