import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSnackBarModule,
    MatSortModule,
    MatTableModule, MatTabsModule, MatCheckboxModule, MatMenuModule, MatAutocompleteModule, MatDatepickerModule, MatDialogModule, MatCardModule, MatProgressSpinnerModule, MatGridListModule, MatProgressBarModule, MatListModule, MatTooltipModule
} from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { IndentListComponent } from 'app/indent-purchases/indent/indent-list/indent-list.component';
import { IndentService } from 'app/services/indent.service';
import { AddIndentComponent } from 'app/indent-purchases/indent/create-indent/add-indent.component';
import { IndentPurchaseComponent } from 'app/indent-purchases/indent-purchase.component';
import { GeneratePurchaseOrder } from 'app/indent-purchases/generate-order-modal/generate-order.component';
import { IndentComponent } from 'app/indent-purchases/indent/indent.component';
import { GeneratedIndentList } from 'app/indent-purchases/purchase-order/purchase-order-list.component';
import { GoodsReceiptNote } from 'app/indent-purchases/goods-note/goods-note.component';
import { MaterialListComponent } from 'app/indent-purchases/materials-operation/materials-operation.component';
import { UnitListComponent } from 'app/indent-purchases/units-operation/units-operation.component';
import { CategoryListComponent } from 'app/indent-purchases/category-operation/category-operation.component';
import { FuseSidebarModule } from '@fuse/components/sidebar/sidebar.module';
import { InventoryComponent } from 'app/indent-purchases/inventory/inventory.component';
import { IssueStockComponent } from 'app/indent-purchases/inventory/issue-stock/issue-stock.component';
import { IssueStockListComponent } from 'app/indent-purchases/inventory/issue-stock-list/issue-stock-list.component';
import { StockListComponent } from 'app/indent-purchases/inventory/stock-list/stock-list.component';
import { IndentHistoryComponent } from 'app/indent-purchases/indent/indent-history-modal/indent-history.component';
import { loginComponent } from './user/login.component';
import { GslsecurityComponent } from './GSLSecurity/gslsecurity.component';
import { StorekeeperComponent } from './StoreKeeper/storekeeper.component';
import { Http } from '@angular/http';
import { StorekeeperissueComponent } from './Storekeeperissue/storekeeperissue.component';
import { GoodlistComponent } from './GSLSecuritygoodandrecevie/goodlist.component';
import { IndentDeleteComponent } from './indent/indent-delete-modal/indent-delete.component';
import { IndentEditComponent } from './indent/indent-edit/indent-edit.component';
import { StockSummaryComponent } from './inventory/stock-summary/stock-summary.component';
import { IssueStockListHistoryComponent } from './inventory/issue-stock-list-history/issue-stock-list-history.component';
import { ViewpdfComponent } from './viewpdf/viewpdf.component';
import { CastingListComponent } from './casting-list/casting-list.component';
import { GradeListComponent } from './grade-list/grade-list.component';
import { SpecificationListComponent } from './specification/specification-list.component';
import { SpecificationhistoryComponent } from './specification-history/specification-history.component';
import { ChemicallistComponent } from './chemical/chemical-list.component';
import { AddchemicalComponent } from './create-chemical/add-chemical.component';
import { RegisterlistComponent } from './Register-list/register-list.component';
import { ProductlistComponent } from './product-list/product-list.component';
import { ZeroweightlistComponent } from './product-ZeroWeight/zeroweight-list.component';
import { ViewComponent } from './product-Register-Client-View/view.component';
import { WorkorderlistComponent } from './workorder/workorder-list/workorder-list.component';
import { ClientlistComponent } from './client/client-list/client-list.component';
import { ContactComponent } from './client/add-contact/contact.component';
import { BankComponent } from './client/add-bank/bank.component';
import { DetailsComponent } from './client/view-details/details.component';
import { StatusdetailsComponent } from './workorder/status-details/status-details.component';
import { WorkorderPrintComponent } from './workorder/work-order-print/workorder-print.component';
import { ApprovelistComponent } from './workorder/Approve/approve-list.component';
import { ApprovedetailsComponent } from './workorder/Approve-details/approve-details.component';
import { ReportslistComponent } from './workorder/work-order-register/reports-list.component';
import { CancellistComponent } from './workorder/work-order-cancel/cancel-list.component';
import { StagelistComponent } from './Order Status/stage/stage-list.component';
import { StagedetailsComponent } from './Order Status/stage-details/stage-details.component';
import { AllorderComponent } from './Order Status/totalorder/all-order.component';
import { WorkorderComponent } from './workorder/workorder.component';
import { ClientComponent } from './client/client.component';
import { OrderstatusComponent } from './Order Status/orderstatus.component';
import { AlldetailsofclientComponent } from './client/alldetailsof client/alldetailsofclient.component';
import { ProductlistforworkorderComponent } from './workorder/workorderOfproductNo/product-listforworkorder.component';
import { MechanicalListComponent } from './MechanicalList/MechanicalList.component';
import { EditClientComponent } from './client/edit-client/edit-client.component';
import { ClientTypeComponent } from './client/client-type/client-type.component';
import { AddWorkorderComponent } from './workorder/add-workorder/add-workorder.component';
import { AmazingTimePickerModule } from 'amazing-time-picker'; // this line you need
import { DialogOverviewExampleDialogComponent } from './workorder/password/DialogOverviewExampleDialog.component';
import { ApprovedlistComponent } from './workorder/Approved/approved-list.component';
import { ProducationlistComponent } from './producation/producation-list/producation-list.component';
import { PlanninglistComponent } from './Planning/Planning-list/Planning-list.component';
import { PlanninghomeComponent } from './Planning/Planning-home/Planning-home.component';
import { PendingreportsComponent } from './Planning/PendingReports/Pendingreports.component';
import { TodaysplanComponent } from './Planning/TodaysPlan/Todaysplan.component';
import { HeatFinishComponent } from './producation/HeatFinish/HeatFinish.component';
import { SpectroAddComponent } from './producation/Spectro/spectro-add.component';
import { PouringComponent } from './producation/Pouring/Pouring.component';
import { PouringPendingComponent } from './producation/Pouring Pending/PouringPending.component';
import { MouldinglistComponent } from './Moulding/moulding-list/moulding-list.component';
import { DialogComponent } from './Moulding/reason/Dialog.component';
import { RejectMouldsListComponent } from './Moulding/Reject Moulds/RejectMouldsList.component';
import { MouldingComponent } from './Moulding/Moulding.component';
import { PlanningComponent } from './Planning/Planning.component';
import { ProducationComponent } from './producation/producation.component';
import { ApprovedItemComponent } from './workorder/approvedlistdetails/approved-item.component';
import { PlannedHistoryComponent } from './Order Status/PlannedHistory/planned-history.component';
import { MouldHistoryComponent } from './Order Status/Mould/mould-history.component';
import { RejectHistoryComponent } from './Order Status/rejecthistory/reject-history.component';
import { RemoveMouldNoComponent } from './Moulding/RemoveMouldNo/RemoveMouldNo.component';
import { OnlineStatusComponent } from './online-status/OnlineStatus.component';






const routes: Routes = [
    {
        path     : '',
        component: IndentPurchaseComponent,
        children: [
        {path: '', pathMatch: 'full', redirectTo: 'create'},
        {path:'RemoveMouldNo',component:RemoveMouldNoComponent},
        {path:'rejectmoulds',component:RejectMouldsListComponent},
        {path:'mouldinglist',component:MouldinglistComponent},
        {path:'pouringpending',component:PouringPendingComponent},
        {path:'pouring',component:PouringComponent},
        {path:'spectroadd',component:SpectroAddComponent},
        {path:'heatfinish',component:HeatFinishComponent},
        {path:'todaysplan',component:TodaysplanComponent},
        {path:'planningreports',component:PendingreportsComponent},
        {path:'planningHome',component:PlanninghomeComponent},
        {path:'planning',component:PlanninglistComponent},
        {path:'production',component:ProducationlistComponent},
        {path:'add-workorder',component:AddWorkorderComponent},
        {path:'client-type',component:ClientTypeComponent},
        {path:'all-order',component:AllorderComponent},
        {path:'stage-details', component:StagedetailsComponent },
        {path: 'stage', component:StagelistComponent},
        {path: 'work-order-cancel', component:CancellistComponent},
        {path: 'work-order-report', component:ReportslistComponent},
        {path: 'Approve', component:ApprovelistComponent},
        {path: 'Approved', component:ApprovedlistComponent},
        {path: 'work-order-status', component:StatusdetailsComponent},
        {path: 'client-list', component: ClientlistComponent},
        {path: 'workorder-list', component: WorkorderlistComponent},
        {path: 'zero-list', component: ZeroweightlistComponent},
        {path: 'productlist', component: ProductlistComponent},
        {path: 'register', component: RegisterlistComponent},
        {path: 'chemical', component: ChemicallistComponent},
        {path: 'specification-list', component: SpecificationListComponent},
        {path :'grade-list/:id', component: GradeListComponent},
        {path :'castingList', component: CastingListComponent},
        {path :'goodnote', component: GoodlistComponent},
        {path :'storekeeperissue', component: StorekeeperissueComponent},
        {path :'storekeeper', component: StorekeeperComponent},
        {path :'gslsecurity', component: GslsecurityComponent},
        {path: 'user', component: loginComponent},
        {path: 'create', component: IndentComponent},
        {path: 'generated', component: GeneratedIndentList},
        {path: 'grn', component: GoodsReceiptNote},
        {path: 'materials', component: MaterialListComponent},
        {path: 'units', component: UnitListComponent},
        {path: 'category', component: CategoryListComponent},
        {path: 'issue-stock', component: InventoryComponent},
        {path: 'stock-list', component: IssueStockListComponent},
        ]
        
    }
];

@NgModule({
    declarations: [
        RemoveMouldNoComponent,
        RejectHistoryComponent,
        MouldHistoryComponent,
        PlannedHistoryComponent,
        ApprovedItemComponent,
        ProducationComponent,
        PlanningComponent,
        MouldingComponent,
        RejectMouldsListComponent,
        DialogComponent,
        MouldinglistComponent,
        PouringPendingComponent,
        PouringComponent,
        SpectroAddComponent,
        HeatFinishComponent,
        TodaysplanComponent,
        PendingreportsComponent,
        PlanninghomeComponent,
        PlanninglistComponent,
        ProducationlistComponent,
        ApprovedlistComponent,
        DialogOverviewExampleDialogComponent,
        AddWorkorderComponent,
        ClientTypeComponent,
        EditClientComponent,
        MechanicalListComponent,
        ProductlistforworkorderComponent,
        AlldetailsofclientComponent,
        WorkorderComponent,
        ClientComponent,
        OrderstatusComponent,
        AllorderComponent,
        StagedetailsComponent,
        StagelistComponent,
        CancellistComponent,
        ReportslistComponent,
        ApprovedetailsComponent,
        ApprovelistComponent,
        WorkorderPrintComponent,
        StatusdetailsComponent,
        DetailsComponent,
        BankComponent,
        ContactComponent,
        ClientlistComponent,
        WorkorderlistComponent,
        ViewComponent,
        ZeroweightlistComponent,
        ProductlistComponent,
        RegisterlistComponent,
        AddchemicalComponent,
        ChemicallistComponent,
        SpecificationhistoryComponent,
        SpecificationListComponent,
       
        GradeListComponent,
      
        CastingListComponent,
        ViewpdfComponent,
        IndentPurchaseComponent,
        StockSummaryComponent,
        IndentEditComponent,
        IndentDeleteComponent,
        GoodlistComponent,
        StorekeeperissueComponent,
        StorekeeperComponent,
        GslsecurityComponent,
        loginComponent,
        IssueStockListHistoryComponent,
        IndentListComponent,
        AddIndentComponent,
        GeneratePurchaseOrder,
        GeneratedIndentList,
        IndentComponent,
        GoodsReceiptNote,
        MaterialListComponent,
        UnitListComponent,
        CategoryListComponent,
        IssueStockComponent,
        IssueStockListComponent,
        InventoryComponent,
        StockListComponent,
        IndentHistoryComponent,
       
    ],
    imports     : [
 
        RouterModule.forChild(routes),
        MatProgressSpinnerModule,
        MatCardModule,
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatCheckboxModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        NgxChartsModule,
        MatDialogModule,
        MatGridListModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatTooltipModule,
        AmazingTimePickerModule,
       
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseWidgetModule,
        FuseSidebarModule,
       
        
    ],
    providers   : [
        IndentService,
    ],
    exports: [
        GeneratePurchaseOrder
    ],
    entryComponents: [
        RemoveMouldNoComponent,
        RejectHistoryComponent,
        MouldHistoryComponent,
        PlannedHistoryComponent,
        ApprovedItemComponent,
        ProducationComponent,
        PlanningComponent,
        MouldingComponent,
        RejectMouldsListComponent,
        DialogComponent,
        MouldinglistComponent,
        PouringPendingComponent,
        PouringComponent,
        SpectroAddComponent,
        HeatFinishComponent,
        TodaysplanComponent,
        PendingreportsComponent,
        PlanninghomeComponent,
        PlanninglistComponent,
        ProducationlistComponent,
        ApprovedlistComponent,
        DialogOverviewExampleDialogComponent,
        AddWorkorderComponent,
        ClientTypeComponent,
        EditClientComponent,
        MechanicalListComponent,
        ProductlistforworkorderComponent,
        AlldetailsofclientComponent,
        AllorderComponent,
        StagedetailsComponent,
        StagelistComponent,
        CancellistComponent,
        ReportslistComponent,
        ApprovedetailsComponent,
        ApprovelistComponent,
        WorkorderPrintComponent,
        StatusdetailsComponent,
        DetailsComponent,
        BankComponent,
        ContactComponent,
        ClientlistComponent,
        WorkorderlistComponent,
        ViewComponent,
        ZeroweightlistComponent,
        ProductlistComponent,
        RegisterlistComponent,
        AddchemicalComponent,
        ChemicallistComponent,
        SpecificationhistoryComponent,
        SpecificationListComponent,
      
        GradeListComponent,
      
        CastingListComponent,
        ViewpdfComponent,
        IssueStockListHistoryComponent,
        StockSummaryComponent,
        IndentEditComponent,
        IndentDeleteComponent,
        GoodlistComponent,
        StorekeeperissueComponent,
        StorekeeperComponent,
        GslsecurityComponent,
        loginComponent,
        GeneratePurchaseOrder,
        IndentHistoryComponent,
        AddIndentComponent,
        IssueStockComponent,
      
    ]
})
export class IndentPurchaseModule
{
}
