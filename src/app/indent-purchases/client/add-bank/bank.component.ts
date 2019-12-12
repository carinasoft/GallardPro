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
    selector     : 'bank',
    templateUrl  : './bank.component.html',
    styleUrls    : ['./bank.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class BankComponent implements OnInit {

    @Output('indentCreated') public indentCreated: EventEmitter<boolean> = new EventEmitter(false);
    public contactForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<BankComponent>,
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
       console.log(this.data.dataof.AccountHolderName)
        this.contactForm = this.createClintForm();
    }


    createClintForm(): FormGroup {
        return  this._formBuilder.group({
            BankName:  new FormControl(this.data.dataof.BankName, Validators.required),
            BranchName:  new FormControl(this.data.dataof.BranchName, Validators.required),
            AccountNumber:  new FormControl(this.data.dataof.AccountNumber, Validators.required),
            AccountHolderName:  new FormControl(this.data.dataof.AccountHolderName, Validators.required),
            BranchAddress:  new FormControl(this.data.dataof.BranchAddress, Validators.required),
            BankAcType:  new FormControl(this.data.dataof.BankAcType, Validators.required),
            MICRCode:  new FormControl(this.data.dataof.MICRCode, Validators.required),
            BSRCode: new FormControl(this.data.dataof.BSRCode, Validators.required),
            IFCSCode: new FormControl(this.data.dataof.IFCSCode, Validators.required),
        });
      }
     


      addBankData(){
        let obj = this.contactForm.value
        obj.Id=this.data.indentList
        console.log(obj)
        this._clientService.AddClientBank(obj).subscribe((a: any) => {
          if (a && a.Status && a.Status.toLowerCase() === 'success') {
           
           this._toastr.successToast('Client Bank Details added succesfully');
           this.dialogRef.close(true);
          } else {
             this._toastr.errorToast(a.Status);
          }
       });

      }
  

   


   

}

