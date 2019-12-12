import {Component, Input, Inject, OnInit, OnDestroy, OnChanges} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { ToasterService } from '../../services/toaster.service';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, merge, Observable, Subject, of } from 'rxjs';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndentService } from '../../services/indent.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'generate-purchase-order',
  styleUrls: ['./generate-order.component.scss'],
  templateUrl: './generate-order.component.html',
  animations   : fuseAnimations,
})
export class GeneratePurchaseOrder implements OnInit{
  public showProgress:boolean = false;
  	showSupplierDetail = true;
    stateList = [];
    cityList = [];
    vendorList = [];
    vendorFilter = [];
    createOrderForm: FormGroup;
    vendorDetails: any = {};
    public moment = moment;
    isVendorDetailShown;
    public selectedVendor = '';
    name:string;
    trans:boolean=true;
    show: boolean = false;
    progresValue:number;
    rangeArray:number[];
    public vendorList1: Observable<any[]> = of([]);
    public idid:any;
    public buttondisable:boolean;
    ClientType: any[] = [];
    spinnerValue:boolean;

    @Input() dataSource: any[] = [];
    displayedColumns = ['serial',  'name', 'qty', 'unit', 'tax','price','Basic','Tax','total','action'];
    public addVendorForm: FormGroup;
    isSingleClick: Boolean = true; 
    private _unsubscribeAll: Subject<any>;
    constructor(
      public dialogRef: MatDialogRef<GeneratePurchaseOrder>,
	    @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _clientService: ClientService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

this.name = 'Welcome to Angular2 Spinner'
this.progresValue =0;
this.rangeArray= new Array(100);
this.buttondisable = false
    }

    /**
     * On init
     */
    ngOnInit(): void
    {   
        this.spinnerValue=false;
        this.showProgress = false;
        this.createOrderForm = this.initCreateOrderForm();
        this.getAllVendor();
        this.getState();
        this.getClientType();
        this.addVendorForm = this.newForm();

        this.data.indentList = _.map(this.data.indentList, (o: any) => {
          o.CreateDate = moment(o.CreateDate).format('MM/DD/YYYY');
          o.OrderQuantity = o.Quantity;
           return o;  
        });
        if (this.data.isUpdate) {
          this.createOrderForm.patchValue(this.data.poDetail);
          this.createOrderForm.get('PODate').patchValue(moment());
         // console.log(this.data)
          this.createOrderForm.get('SupplierId').patchValue(this.data.poDetail.SupplierName);
          this.createOrderForm.get('SupplierId').disable();
        }


        this.createOrderForm.controls['SupplierId'].valueChanges.subscribe((value) => {
          if (value) {
              this.vendorList1 = of(this._filter(value, 'material'));
          } else {
              this.vendorList1 = of(this.vendorList);
          }
      });


        
    }


    getClientType(){
      this._clientService.GetClientType1().subscribe((a: any) => {
          if (a && a.Status && a.Status.toLowerCase() === 'success') {
           console.log(a)
           this.ClientType=a.Body
           
          } else {
             this._toastr.errorToast(a.Status);
          }
       });
    }

    private _filter(value: string, type) {
        
      if(Number(value)) {
          return;
      }
      let filterValue = value.toLowerCase();
      switch (type) {
          case 'material': {
 return this.vendorList.filter( (option: any) => option.VendorName.toLowerCase().includes(filterValue));
                      }
          
      }
  }



  public newForm(): FormGroup {
    return this._formBuilder.group({
      VendorName: ['', [Validators.required]],
      Email: ['', [Validators.required]],
      GST: ['', [Validators.required]],
      Address: [''],
      ServiceTaxNo: ['', [Validators.required]],
      PanNo: ['', [Validators.required]],
      MobileNumber: ['', [Validators.required]],
      ClientTypeId: ['', [Validators.required]],
      //Designation: ['', [Validators.required]],
      StateId: ['', [Validators.required]],
      CityId: ['', [Validators.required]],
    });

}







    toggleSpinner() {
      this.show = !this.show;
      this.trans=!this.trans;

  }
    initCreateOrderForm() {
        return this._formBuilder.group({
         
            SupplierId: ['', [Validators.required]],
            PONumber: [{value: moment().format('YYYYMMDDHHss'), disabled: true}],
            PODate: [moment(), [Validators.required]],
            SupplierRef: [''],
            Despatchhrough: [''],
            TermsofDelivery: [''],
            PinCode: [''],
            PaymentTerms: ['']
            // IndentKey: ['']
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
      console.log(stateId )
      this._indentService.GetCity(stateId).subscribe((a: any) => {
        if (a) {
            this.cityList = a.Body;
        }
      });
    }


    getAllVendor() {
      this._indentService.GetAllVendor().subscribe((a: any) => {
        if (a) {
            this.vendorList = a.Body;
            this.vendorList1 = of(a.Body);
            if (this.data.isUpdate) {
              let selectedVendor: any = _.find(this.vendorList, (o: any) => o.VendorId === this.data.poDetail.SupplierId);
              if (selectedVendor) {
                this.selectedVendor = selectedVendor;
              }            
            }
        }
      });
    }

    onSelectVendor(vendor) {
      console.log(vendor)
      if (!vendor) {
        return;
    }
    this.createOrderForm.get('SupplierId').enable();
    
    //this.createOrderForm.patchValue({SupplierId: vendor.VendorName});
     
      this.vendorDetails = vendor;
     
   
    }

    generateOrder(id) {
      this.spinnerValue=true;
    var boolean = true;

    this.createOrderForm.get('PONumber').enable(); 
    let requestObj = this.createOrderForm.value;


     console.log("selecat",this.selectedVendor);

      this.createOrderForm.get('PONumber').disable();
      requestObj.PoList = this.data.indentList;
      requestObj.PODate = moment(requestObj.PODate).format('MM/DD/YYYY');


     

   for(let i=0; i<requestObj.PoList.length; i++){
         let Quantity = requestObj.PoList[i].Quantity;
         let OrderQuantity = requestObj.PoList[i].OrderQuantity;
         if(Quantity >= OrderQuantity){
          //this.dialogRef.close(true);
         }
         else{
          this._toastr.errorToast("Material :- " + requestObj.PoList[i].ItemName + "  Order Quantity: " + OrderQuantity + " is greter than your actual Quantity: "+Quantity)
        
         boolean=false;
         }
   }
  if(boolean == true){
    
 
    console.log(requestObj);
    this._indentService.GeneratePurchaseOrder(requestObj).subscribe((a: any) => {
          if (a && a.Status.toLowerCase() === 'success') {
            this.showProgress = false;
              this._toastr.successToast('Purchase order generated succesfully');  
              this.dialogRef.close(true);
              this.createOrderForm.reset();  
              this.spinnerValue=false;            
          } else {
              this._toastr.errorToast(a.Status);
              this.spinnerValue=false;    
          }
        });
  }
  else{
   
  }
      
    }







    showVendorDetail() {
      this._fuseSidebarService.getSidebar('vendorDetailsAside').toggleOpen();
    }

    addVendorDetail(){

      let newMaterialName = this.createOrderForm.get('SupplierId').value;
        this.addVendorForm.patchValue({VendorName: newMaterialName});
      this._fuseSidebarService.getSidebar('addvendorDetails').toggleOpen();
    }

    getPriceHistory(id, idx) {
      let selectedIdx = this.data.indentList[idx];
      if(!selectedIdx.Price || !selectedIdx.OrderQuantity) {
        return ;
      }
      let selectedIndentPriceQty = this.data.indentList[idx].Price / this.data.indentList[idx].OrderQuantity;
      this._indentService.GetPriceHistory(id).subscribe((a) => {
        if (a && a.Body.length) {
         
            let quantityPerPrice = [];
            for(let i=0; i<a.Body.length; i++){
              let pricePerQty = a.Body[i].Price / a.Body[i].Quantity;
              let p1 =a.Body[0].Price;
              let p2 =a.Body[1].Price
             
              if(selectedIndentPriceQty / 10*100 > pricePerQty / 10*100){
          return this._toastr.mywarningToast('Price for material '+ a.Body[i].ItemName + ' is more than 10% of the previous order Price :' + a.Body[i].Price  + ' Second price :'+p1 );
 
              }
            }
            // _.forEach(a.Body, (obj: any) => {
            //   let pricePerQty = obj.Price / obj.Quantity;
            //   if (selectedIndentPriceQty / 10*100 > pricePerQty / 10*100) {
            //    return this._toastr.mywarningToast('Price for material '+ obj.ItemName + ' is more than 10% of the previous order Price :' + obj.Price );
            //   }
            // });
        }
      });
    }

    removeIndent(rawId,idx) {
     // console.log(rawId,this.data.poDetail.PONumber)
     if (this.data.indentList.length > 1) {
      if (this.data.isUpdate) {
        this._indentService.DeletePoIndent(rawId,this.data.poDetail.PONumber).subscribe(a => {
        // this._indentService.DeletePoIndent(this.data.indentList[idx].IndentId).subscribe(a => {
          if (a && a.Status.toLowerCase() === 'success') {
              this._toastr.successToast('Indent Deleted succesfully');
          } else {
              this._toastr.errorToast(a.Status);
          }
        });

      }
        this.data.indentList.splice(idx, 1);
        this.data = _.cloneDeep(this.data);  
         
          
      } else {
        this._toastr.warningToast('Atleast 1 indent required');
      }
    }

    calculateTotal(indent) {
      let price = _.cloneDeep(Number(indent.Price));      
      if (indent.Gst) {
        let taxperItem = price * indent.Gst / 100;
        indent.total =( (price + taxperItem) * Number(indent.OrderQuantity)).toFixed(); 
         
        indent.Basic = (price * Number(indent.OrderQuantity)).toFixed(); 
        indent.TaxonBasic = indent.total -  indent.Basic;

      } else {
        indent.total = (price * Number(indent.OrderQuantity)).toFixed();
        indent.Basic = (price * Number(indent.OrderQuantity)).toFixed(); 
        indent.TaxonBasic = 0;
      }
      
      
    }

  updateOrder() {

    if (this.data.isUpdate) {
     
      this.createOrderForm.get('SupplierId').patchValue(this.data.poDetail.SupplierId);
    }
    var boolean = true;
    this.createOrderForm.get('SupplierId').enable(); 
    this.createOrderForm.get('PONumber').enable(); 
    let requestObj = this.createOrderForm.value;
    this.createOrderForm.get('PONumber').disable();
    this.createOrderForm.get('SupplierId').disable(); 
    requestObj.PoList = this.data.indentList;
    requestObj.PODate = moment(requestObj.PODate).format('MM/DD/YYYY');
    
console.log(requestObj)
    for(let i=0; i<requestObj.PoList.length; i++){
          let Quantity = requestObj.PoList[i].Quantity;
          let OrderQuantity = requestObj.PoList[i].OrderQuantity;
          if( OrderQuantity>0){
           
            
          }
          else{
            this._toastr.errorToast("You can not enter 0 Qunatity")
         // alert("You can not enter 0 Qunatity")
          boolean=false;
          }
    }
   if(boolean == true){
     
     this._indentService.UpdatePurchaseOrder(requestObj).subscribe((a: any) => {
        if (a && a.Status.toLowerCase() === 'success') {
            this._toastr.successToast('Purchase order updated succesfully');  
            this.createOrderForm.reset();              
        } else {
            this._toastr.errorToast(a.Status);
        }
      });
   }
   else{
    
   }


    // this._indentService.UpdatePurchaseOrder(requestObj).subscribe((a: any) => {
    //     if (a && a.Status.toLowerCase() === 'success') {
    //         this._toastr.successToast('Purchase order updated succesfully');  
    //         this.createOrderForm.reset();              
    //     } else {
    //         this._toastr.errorToast(a.Status);
    //     }
    //   });
  }   
  prepareRequest(){
    this.createOrderForm.get('PONumber').enable(); 
     
    const model: any = _.cloneDeep(this.createOrderForm.value);
    console.log(model)
    this.createOrderForm.get('PONumber').disable();

    let RawMaterial = _.find(this.vendorList, (o: any) => {

      console.log(o.VendorId  ,model.SupplierId )
            return o.VendorId === model.SupplierId;
    });
  console.log(RawMaterial)
    if (RawMaterial) {
        model.SupplierId = RawMaterial.VendorId;
    } else {
        return this._toastr.errorToast("Raw VendorId doesn't exist");
    }

    
    return model;
}
  
  public  AddVendorData() {

let obj = this.addVendorForm.value;
//console.log(obj)



let jsonData={
  Name:obj.VendorName,
  MobileNo: obj.MobileNumber,
  Address:obj.Address,
  StateID:obj.StateId,
  CityID:obj.CityId,
  Pincode:'',
  PanNo:obj.PanNo,
  EmailID:obj.Email,
  GST:obj.GST,
  ServiceTaxNo:obj.ServiceTaxNo,
  ClientTypeId:obj.ClientTypeId
}

this._clientService.AddClient(jsonData).subscribe((a: any) => {
  if (a && a.Status && a.Status.toLowerCase() === 'success') {
   
   this._toastr.successToast('Client added succesfully');
   this._fuseSidebarService.getSidebar('addvendorDetails').close();
      this.vendorList.push(a.Body);
    this.vendorList1 = of(this.vendorList);
    //this._toastr.successToast('Vendor added succesfully');
  this.getAllVendor();
   //this.createOrderForm.controls['SupplierId'].reset()
    this._fuseSidebarService.getSidebar('addvendorDetails').close();
   
  } else {
     this._toastr.errorToast(a.Status);
  }
});
// this._indentService.AddVendor(obj).subscribe((a: any) => {
//   if (a && a.Status && a.Status.toLowerCase() === 'success') {

//     this.vendorList.push(a.Body);
//     this.vendorList1 = of(this.vendorList);
//     this._toastr.successToast('Vendor added succesfully');
  
//    this.createOrderForm.controls['SupplierId'].reset()
//     this._fuseSidebarService.getSidebar('addvendorDetails').close();
//   }
//   else{
//     this._toastr.errorToast(a.Status);
//   }
// });
    

}

public onSelectMaterial(value) {
  if (!value) {
      return;
  }
  this.createOrderForm.get('SupplierId').enable();
  
  this.createOrderForm.patchValue({SupplierId: value.VendorName});
  this.createOrderForm.get('SupplierId').disable();
}

public selectCategory(CategoryId) {
  if (!CategoryId) {
      return;
  }
  let selection = this.vendorList.find(e => e.VendorId === CategoryId);
  if (selection) {
      return selection.VendorName;
  }
}
}
