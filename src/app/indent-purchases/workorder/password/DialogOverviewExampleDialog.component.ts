import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation, Inject, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { IndentService } from "app/services/indent.service";
import { ToasterService } from "app/services/toaster.service";
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, of, Subject } from 'rxjs';
import { CastingService } from 'app/services/casting.service';
import { ProductService } from 'app/services/product.service';
import { map, startWith } from 'rxjs/operators';
import {  HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { RequestOptions, RequestOptionsArgs, Http } from '@angular/http';
import {HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType} from '@angular/common/http';
import { ClientService } from 'app/services/client.service';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
    selector     : 'DialogOverviewExampleDialog',
    templateUrl  : './DialogOverviewExampleDialog.component.html',
    styleUrls    : ['./DialogOverviewExampleDialog.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})




export class DialogOverviewExampleDialogComponent implements OnInit {

    @Output('indentCreated') public indentCreated: EventEmitter<boolean> = new EventEmitter(false);
    formVar: FormGroup;




    constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: any, public http:Http,
      private _toastr: ToasterService,
        
        private _clientService: ClientService,) {}

    public ngOnInit(): void {
     
      this.formVar = this.fb.group({
      
        password: ''
      });
    }

    onNoClick(): void {
      //this.dialogRef.close();
      const model = this.formVar.value;
      console.log("password",model)


      this.http.post('/api/AdminApi/UserLogin?'+'UserName=Admin&Password='+model.password,{}).pipe(map(data => {

        let res = data.json()
          if(res.Status== 1){
            
          if(res.Details.AccountType == "Admin")
         {
           console.log(this.data)
         ////api/SecondModuleApi/DeleteWorkOrderRecordbyId?WOID=2&SNO=2
        //     this._clientService.DeleteWorkOrderrRecordbyId(this.data).subscribe((a:any)=>{
           
        //      if (a && a.Status && a.Status.toLowerCase() === 'success') {
        //          this._toastr.successToast('WorkOrder deleted succesfully');
        //                   this.dialogRef.close();
        //      } else {
        //          this._toastr.errorToast(a.Status);
        //      } 
        //  });     
             if( this.data && this.data.isWorkOder)
             {
              this._clientService.DeleteWorkOrder(this.data).subscribe((a:any)=>{
           
                if (a && a.Status && a.Status.toLowerCase() === 'success') {
                    this._toastr.successToast('WorkOrder deleted succesfully');
                             this.dialogRef.close();
                } else {
                    this._toastr.errorToast(a.Status);
                } 
                });               

             }
             else if(this.data) {
                  this._clientService.DeleteWorkOrderrRecordbyId(this.data).subscribe((a:any)=>{
           
             if (a && a.Status && a.Status.toLowerCase() === 'success') {
                 this._toastr.successToast('WorkOrder deleted succesfully');
                          this.dialogRef.close();
             } else {
                 this._toastr.errorToast(a.Status);
             } 
             });     
             }
                         
         }  
         else{
          this._toastr.errorToast("Inavlid password");
         } 
          }

          else{
            //alert("Inavlid password Status 0" )
            this._toastr.errorToast("Inavlid password");
          }
        })).subscribe(result => {
          
        });

           
    
    }

}

