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

export const gstList = [0, 5, 12, 18, 28];
export const priority = ['normal', 'urgent'];

@Component({
    selector     : 'contact',
    templateUrl  : './contact.component.html',
    styleUrls    : ['./contact.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ContactComponent implements OnInit {

    @Output('indentCreated') public indentCreated: EventEmitter<boolean> = new EventEmitter(false);
   
    public contactForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<ContactComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _clientService: ClientService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService
    ) {

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    public ngOnInit(): void {
        this.contactForm = this.createClintForm();
 
    }

    createClintForm(): FormGroup {
        return  this._formBuilder.group({
            ContactName:  new FormControl(this.data.dataof.ContactName, Validators.required),
            ContactNo:  new FormControl(this.data.dataof.ContactNo, Validators.required),
            ContactEmail:   new FormControl(this.data.dataof.ContactEmail, Validators.required),
            AlternateContact:  new FormControl(this.data.dataof.AlternateContact, Validators.required),
            Designation:  new FormControl(this.data.dataof.Designation, Validators.required),
        });
      }

      saveContact(){
          let obj = this.contactForm.value
          obj.Id=this.data.indentList
          console.log(obj)
          this._clientService.AddClientContact(obj).subscribe((a: any) => {
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
             
             this._toastr.successToast('Client Contact added succesfully');
             this.dialogRef.close(true);
            } else {
               this._toastr.errorToast(a.Status);
            }
         });
 
      }
   

    
  

   


   

}

