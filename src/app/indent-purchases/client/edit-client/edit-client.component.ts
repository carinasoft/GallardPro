import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation, Inject, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { IndentService } from "app/services/indent.service";
import { ToasterService } from "app/services/toaster.service";
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, of, Subject } from 'rxjs';
import { ClientService } from 'app/services/client.service';



@Component({
    selector     : 'edit-client',
    templateUrl  : './edit-client.component.html',
    styleUrls    : ['./edit-client.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EditClientComponent implements OnInit {

    @Output('indentCreated') public indentCreated: EventEmitter<boolean> = new EventEmitter(false);
    public contactForm: FormGroup;
    chek:boolean;
    Name:any;
    // Private
    stateList:any;
    cityList:any;
    private _unsubscribeAll: Subject<any>;
    ClientType: any[] = [];
    constructor(
        public dialogRef: MatDialogRef<EditClientComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _clientService: ClientService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _indentService: IndentService,
    ) {

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    public ngOnInit(): void {
       
        this.contactForm = this.createClintForm();
        this.chek= true;
        this.getState();
        this.getCity(this.data.State);
        this.getClientType()
    }
    check(){
      this.chek=false
    }
    getClientType(){
      this._clientService.GetClientType().subscribe((a: any) => {
          if (a && a.Status && a.Status.toLowerCase() === 'success') {
          
           this.ClientType=a.Body
           
          } else {
             this._toastr.errorToast(a.Status);
          }
       });
    }
    createClintForm(): FormGroup {
        return  this._formBuilder.group({
            Name:  new FormControl(this.data.Name,[Validators.required]),
            GST:  new FormControl(this.data.GST,[Validators.required]),
            PanNo:  new FormControl(this.data.PAN,[Validators.required]),
            EmailID:  new FormControl(this.data.EmailID,[Validators.required]),
            MobileNo:  new FormControl(this.data.MobileNo,[Validators.required]),
            Pincode:  new FormControl(this.data.Pincode,[Validators.required]),
            StateID:  new FormControl(this.data.State,[Validators.required]),
            CityID:  new FormControl(this.data.City,[Validators.required]),
            Address:new FormControl(this.data.Address,[Validators.required]),
            ServiceTaxNo:new FormControl(this.data.ServiceTaxNo,[Validators.required]),
            ClientTypeId:new FormControl(this.data.ClientTypeId,[Validators.required]),
        });
      }
     


    //   addBankData(){
    //     let obj = this.contactForm.value
    //     obj.Id=this.data.indentList
    //     console.log(obj)
    //     this._clientService.AddClientBank(obj).subscribe((a: any) => {
    //       if (a && a.Status && a.Status.toLowerCase() === 'success') {
           
    //        this._toastr.successToast('Client Bank Details added succesfully');
           
    //       } else {
    //          this._toastr.errorToast(a.Status);
    //       }
    //    });

    //   }
  
    editclient(){
               let obj = this.contactForm.value
               obj.Id =this.data.ClientID
              
                this._clientService.ClientEdit(this.contactForm.value).subscribe((a :any) =>{
                  if( a && a.Status && a.Status.toLowerCase() === 'success' )
                     {
                      this._toastr.successToast('Client Edited succesfully');
                     }
                  else{
                         this._toastr.errorToast(a.Status);
                      } 
              });
    }
   

    getState() {
        this._indentService.GetState().subscribe((a: any) => {
          if (a) {
              this.stateList = a.Body;
          }
        });
      }
  
      getCity(stateId) {
        this._indentService.GetCity(stateId).subscribe((a: any) => {
          if (a) {
              this.cityList = a.Body;
          }
        });
      }

   

}

