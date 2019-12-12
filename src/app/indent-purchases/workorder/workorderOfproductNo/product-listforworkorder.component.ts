import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation, Inject, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
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
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { RequestOptions, RequestOptionsArgs } from '@angular/http';
import { HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DialogOverviewExampleDialogComponent } from '../password/DialogOverviewExampleDialog.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },

];

@Component({
  selector: 'product-listforworkorder',
  templateUrl: './product-listforworkorder.component.html',
  styleUrls: ['./product-listforworkorder.component.scss'],
  // animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 300ms ease-in')
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]

})
export class ProductlistforworkorderComponent implements OnInit {

  @Output('indentCreated') public indentCreated: EventEmitter<boolean> = new EventEmitter(false);
  CheckProductHave: any;
  public pageType: string;
  filteredOptions: Observable<[]>[] = [];
  public indentForm: FormGroup;
  public DetailList = [];
  public gradelist = [];
  public vendorList = [];
  public vendorList1: Observable<any[]> = of([]);
  gradelist1: Observable<any[]> = of([]);
  dataSource1: Observable<any[]> = of([]);
  public materialList = [];
  public categoryList = [];
  public unitList = [];
  public materialFilter: Observable<any[]> = of([]);
  public categoryFilter: Observable<any[]> = of([]);
  public unitFilter: Observable<any[]> = of([]);
  public noMaterialFound: boolean = false;
  public noUnitFound: boolean = false;
  public moment = moment;
  public isUpdate = false;
  imageData: any;
  public addMaterialForm: FormGroup;
  displayedColumns: string[] = ['id', 'progress', 'name', 'name1', 'name2', 'name4', 'name6', 'name7', 'name9', 'name8', 'color1'];
  public productForm: FormGroup;
  private _unsubscribeAll: Subject<any>;
  dataSource = ELEMENT_DATA;
  items: FormArray;
  delRow;
  public showButton: boolean;
  checkindex:any;




  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProductlistforworkorderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _indentService: IndentService,
    private _toastr: ToasterService,
    private _fuseSidebarService: FuseSidebarService,
    private _castingService: CastingService,
    private _productSevcie: ProductService,
    private httpService: HttpClient
  ) {
    this.showButton == true

    this._unsubscribeAll = new Subject();
  }

  public ngOnInit(): void {

    this.showButton == true;
    this.getCastingList();
    this.getProductList();
    this.WorkOrderDetailList(this.data.id);
    this.indentForm = this._formBuilder.group({

      items: this._formBuilder.array([
        this.createIndentForm()
      ])
    });

    this.productForm = this.createProductForm();

    //   this.indentForm.get('items').valueChanges.subscribe((value) => {
    //     console.log("value of total",value)
    //     console.log("name ",value[0].ProductId)

    //     if(value[0].ProductId ==value[0].ProductId)
    //     {
    //         return this.CheckProductHave = true;
    //     }
    //     else{
    //         return this.CheckProductHave = false;
    //     }

    // });
    this.indentForm.get('items').valueChanges.subscribe((value) => {
      console.log("value of total", value)

      for (let i = 0; i < value.length; i++) {

        if (value[i].ProductId) {
          this.vendorList1 = of(this._filter(value[i].ProductId, 'material'));
          console.log("name ", value[i].ProductId,i)
          let indexdata = i;
          this.checkindex = indexdata;
          this.CheckProductHave = true
        } else {
          this.vendorList1 = of(this.vendorList);

        }
      }

    });
  }

  showForm() {
    this.showButton = true;
  }
  getName(i) {
    return this.getControls()[i].value.ProductId;
  }

  getControls() {
    return (<FormArray>this.indentForm.get('items')).controls;
  }

  private _filter(value: string, type) {

    if (Number(value)) {
      return;
    }
    let filterValue = value.toLowerCase();
    switch (type) {
      case 'material': {
        return this.vendorList.filter((option: any) => option.Name.toLowerCase().includes(filterValue));
      }

    }
  }


  createProductForm(): FormGroup {
    return this._formBuilder.group({
      Name: ['', []],
      NetWeight: ['', []],
      GrossWeight: ['', []],
      Length: ['', []],
      Width: ['', []],
      Height: ['', []],
      //UploadedImage : ['', [Validators.required]],
    });
  }

  WorkOrderDetailList(id) {
    this._productSevcie.WorkOrderDetailList(id).subscribe((a: any) => {
      if (a && a.Body && a.Body.length) {
        this.DetailList = a.Body;

      }
      this.DetailList.map(row => {
        row.isEditable = false;
      });

      
      console.log("WorkOrderDetailList",this.DetailList)
    })
  }

  editRow(row) {
    this.DetailList.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
  }

  save(row) {

    this.delRow = this.DetailList.indexOf(row);
    // if (this.delRow == 0) {
    //   this.dialogRef.close();
    // }
    this.DetailList.splice(this.delRow, 1);
    this.DetailList=JSON.parse(JSON.stringify(this.DetailList));
    row.isEditable = false;
    console.log(this.delRow)
    let array = [];

    let jsondata = {
      SNO: row.SNO,
      CastingId: row.CastingId,
      GradeID: row.GradeID,
      ProductId: row.ProductId,
      NoofPieces: row.NoofPieces,
      Rate: row.Rate,
      NetWeight: row.NetWeight,
      GrossWeight: row.GrossWeight,
      TotalNetWeight: row.TotalNetWeight,
      TotalGrossWeight: row.TotalGrossWeight,
      EstimatePrice: row.EstimatePrice,
      Note: row.Note
    }

    array.push(jsondata)

    let j = { WOID: row.WOID, items: array }
    console.log(j)

    this._productSevcie.EditWorkOder(j).subscribe((a: any) => {
      if (a && a.Status && a.Status.toLowerCase() === 'success') {
        this._toastr.successToast('Edited succesfully');
       // this.WorkOrderDetailList(this.data.id);

      }
      else {
        this._toastr.errorToast(a.Status);
      }

    });


  }



  removeItem(i: number) {
    console.log(i)
    const controls = <FormArray>this.indentForm.controls['items'];
    controls.removeAt(i);

    this.filteredOptions.splice(i, 1);

  }



  delete(row) {
    
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      width: '250px',
      data: { rowdata: row }
    });
    dialogRef.afterClosed().subscribe(result => {
     
      let id = this.data.id;
     
      this.WorkOrderDetailList(id);

    this.delRow = this.DetailList.indexOf(this.data);
    this.DetailList.splice(this.delRow, 1);
    this.DetailList=JSON.parse(JSON.stringify(this.DetailList));
    });


    // this._productSevcie.DeleteWORK(row).subscribe((a:any)=>{

    //       if (a && a.Status && a.Status.toLowerCase() === 'success') {
    //           this._toastr.successToast('deleted succesfully');

    //           let id = this.data.id;
    //           console.log(id)
    //           this.WorkOrderDetailList(id);
    //           this.delRow = this.DetailList.indexOf(row);
    //           this.DetailList.splice(this.delRow,1);
    //         if(this.DetailList.length == 0){
    //             this.dialogRef.close();
    //         }


    //             } else {
    //             this._toastr.errorToast(a.Status);
    //             } 
    //   });

  }



  onSelectVendor($event,i) {
    console.log($event,i)
    this.checkindex=i;

    //     if (vendor.Name == '') {
    //       return this.CheckProductHave = true;
    //   }
    //   else{
    //     return this.CheckProductHave = false;
    //   }

  }


  public createIndentForm(): FormGroup {
    return this._formBuilder.group({
      CastingId: ['', [Validators.required]],
      ProductId: ['', [Validators.required]],
      GradeID: ['', [Validators.required]],
      NoofPieces: ['', [Validators.required]],
      Rate: ['', [Validators.required]],
      Note: ['', []],
      // NetWeight:['',[Validators.required]],
      // GrossWeight:['',[Validators.required]],
      // TotalNetWeight:['',[Validators.required]],
      // TotalGrossWeight:['',[Validators.required]],
      // EstimatePrice:['',[Validators.required]],

    });

  }

  getCastingList(): any {
    this._castingService.GetCasting().subscribe((a: any) => {
      if (a && a.Body && a.Body.length) {
        this.dataSource = a.Body;
        this.dataSource1 = of(a.Body);
      }
    })
  }

  getGrade(Id) {
    this._castingService.GetGradeListByCastingId(Id).subscribe((a: any) => {
      if (a) {
        this.gradelist = a.Body;
        this.gradelist1 = of(a.Body);
        console.log(a.Body)
      }
    });
  }

  getProductList(): any {
    this._productSevcie.GetProductList().subscribe((a: any) => {
      if (a && a.Body && a.Body.length) {
        this.vendorList = a.Body;
        this.vendorList1 = of(a.Body);
        console.log(this.vendorList)
      }
    });
  }


  addRow() {

    this.items = this.indentForm.get('items') as FormArray;
    this.items.push(this.createIndentForm());

    this.ManageNameControl(this.items.length - 1);
  }
  ManageNameControl(index: number) {
    var arrayControl = this.indentForm.get('items') as FormArray;
    this.filteredOptions[index] = arrayControl.at(index).get('ProductId').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.Name),

        // map(name => name ? this._filter1(name) : this.vendorList.slice())
      );

  }
  public _filter1(name: string) {
    const filterValue = name.toLowerCase();
    console.log("assasasas", filterValue)
    return this.vendorList.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }



  saveWorkOrder() {
    const model: any = _.cloneDeep(this.indentForm.value);
    let array = [];
    console.log(model)
    for (let j = 0; j < this.vendorList.length; j++) {


      for (let i = 0; i < model.items.length; i++) {

        if (model.items[i].ProductId == this.vendorList[j].Name) {
          console.log("Lenth ", model.items.length)
          console.log("Product id ", model.items[i].ProductId)
          console.log("Product id 2", this.vendorList[j].ProductId)
          // let studFg = this._formBuilder.group({
          //     ProductId: new FormControl(this.vendorList[j].ProductId),
          //     CastingId: new FormControl(model.items[i].CastingId),
          //     GradeID: new FormControl(model.items[i].GradeID),
          //     NoofPieces: new FormControl(model.items[i].NoofPieces),
          //     Rate: new FormControl(model.items[i].Rate),
          //     Note: new FormControl(model.items[i].Note),
          //     NetWeight: new FormControl(this.vendorList[j].NetWeight),
          //     GrossWeight: new FormControl(this.vendorList[j].GrossWeight),
          //     TotalNetWeight: new FormControl(this.vendorList[j].NetWeight*(model.items[i].NoofPieces)),
          //     TotalGrossWeight: new FormControl(model.items[i].TotalGrossWeight),
          //     EstimatePrice: new FormControl(model.items[i].EstimatePrice),

          //   })

          let json = {
            ProductId: this.vendorList[j].ProductId,
            CastingId: model.items[i].CastingId,
            GradeID: model.items[i].GradeID,
            NoofPieces: model.items[i].NoofPieces,
            Rate: model.items[i].Rate,
            Note: model.items[i].Note,
            NetWeight: this.vendorList[j].NetWeight,
            GrossWeight: this.vendorList[j].GrossWeight,
            TotalNetWeight: this.vendorList[j].NetWeight * (model.items[i].NoofPieces),
            TotalGrossWeight: this.vendorList[j].GrossWeight * (model.items[i].NoofPieces),
            EstimatePrice: this.vendorList[j].NetWeight * (model.items[i].NoofPieces) * (model.items[i].Rate),

          }
          array.push(json)
        }
      }
    }

    let j = { WOID: this.data.id, items: array }

    console.log(j)


    this._productSevcie.addWorkOrder(j).subscribe((a: any) => {

      if (a && a.Status && a.Status.toLowerCase() === 'success') {

        this._toastr.successToast('addWorkOrder added succesfully');
        this.indentForm.reset();
        console.log(a)
        this.WorkOrderDetailList(this.data.id);
        if (this.indentForm.get('items')['controls'].length > 1) {

          let value = this.indentForm.get('items')['controls'].length - 1
          console.log("Value Of remove form conrol", value)
          for (let j = 0; j < value; j++) {
            const controls = <FormArray>this.indentForm.controls['items'];
            controls.removeAt(j);

            this.filteredOptions.splice(j, 1);
          }
        }
        this.showButton = false;
      } else {
        this._toastr.errorToast(a.Status);
        console.log(a)
      }
    })

  }

  prepareRequest() {


    //     const model: any = _.cloneDeep(this.createOrderForm.value);
    //     console.log(model)
    //     this.createOrderForm.get('PONumber').disable();

    //     let RawMaterial = _.find(this.camical, (o: any) => {

    //       console.log(o.VendorId  ,model.SupplierId )
    //             return o.VendorId === model.SupplierId;
    //     });
    //   console.log(RawMaterial)
    //     if (RawMaterial) {
    //         model.SupplierId = RawMaterial.VendorId;
    //     } else {
    //         return this._toastr.errorToast("Raw VendorId doesn't exist");
    //     }


    //     return model;
  }
  getControls1() {
    return (<FormArray>this.indentForm.get('items')).controls;
  }
  addVendorDetail(index) {
    //  console.log(this.getControls()[index].value.ProductId)
    //this._fuseSidebarService.getSidebar('addvendorDetailsForProduct').toggleOpen();
    //ProductId  var arrayControl = this.checkoutFormGroup.get('products') as FormArray;



    this._fuseSidebarService.getSidebar('addvendorDetailsForProduct').toggleOpen();
    let value = this.getControls()[index].value.ProductId
    this.productForm.patchValue({ Name: value });

  }


  fileChange(event) {
    const formModel = this.productForm.value;
    let fileList: FileList = event.target.files;
    this.imageData = fileList

  }

  uploadFiles() {
    this._fuseSidebarService.getSidebar('addvendorDetailsForProduct').close();
    const formModel = this.productForm.value;
    let formData: FormData = new FormData();
    if (this.imageData != null) {
      let file: File = this.imageData[0];


      formData.append('UploadedImage', file, file.name);
    }
    formData.append('Name', formModel.Name);
    formData.append('NetWeight', formModel.NetWeight);
    formData.append('GrossWeight', formModel.GrossWeight);
    formData.append('Length', formModel.Length);
    formData.append('Width', formModel.Width);
    formData.append('Height', formModel.Height);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    this.httpService.post('/api/SecondModuleApi/AddProduct', formData, { headers: headers }).subscribe(
      data => {


        console.log(data);
        let res: any;
        res = data;

        if (res && res.Status.toLowerCase() === 'success') {
          this._toastr.successToast('Product added succesfully');
          this.vendorList.push(res.Body);
          this.vendorList1 = of(this.vendorList);
          this.getProductList();

          this.productForm.reset();
          var element = <HTMLInputElement> document.getElementById("condition");
                     element.disabled = false;

        }
        else if (res.Status === 'Warning') {
          this._toastr.warningToast("Item already exists");
          var element = <HTMLInputElement> document.getElementById("condition");
                     element.disabled = false;
        }
        else {
          this._toastr.errorToast(res.Status)
          var element = <HTMLInputElement> document.getElementById("condition");
                     element.disabled = false;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }

}

