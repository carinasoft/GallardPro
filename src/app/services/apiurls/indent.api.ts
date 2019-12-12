export const Indent_API = {
    ADD : 'MasterApi/AddIndent',
    UPDATE : 'MasterApi/EditIndent?IndentId=:id&NewQuantity=:quty',    
    GET: 'MasterApi/DisplayIndentList',
    DELETE: 'MasterApi/DeleteIndent?IndentId=:indentId',
    GENERATE_PO: 'MasterApi/CreatePO',
    GET_PO: 'MasterApi/DisplayPOList',
    GET_PO1: 'MasterApi/DisplayPOList',
    GET_PO2: 'MasterApi/DisplayCompleteGRNList',
    CREATE_GRN: 'MasterApi/CreateGRN',
    SEARCH_PO_NUMBER: 'MasterApi/DisplayPOListbyPoNumber?PoNumber=:number',
    GENERATE_GRN: 'MasterApi/CreateGRN',
    GET_PRICE_HISTORY: 'MasterApi/GetPriceHistory?RawMaterialId=:id',
    GET_INDENT_HISTORY: 'MasterApi/DisplayIndentHistoryList?MaterialId=:id',
    GET_INDENT_Summary: 'MasterApi/DisplaySummary?MaterialId=:id',
    GET_INDENT_HISTORY1: 'MasterApi/DisplayIndentHistoryListForDelete?MaterialId=:id',
    GET_INDENT_HISTORY2: 'MasterApi/DisplayIssueHistory?RawMaterilId=:id',
   
    DELETE_MULTIPLE_INDENT: 'MasterApi/DeleteMultipleIndentbyId?IndentList=:indentId',
    GET_PO_BY_NUMBER: 'MasterApi/DisplayPONumber?PoNumber=:number',
    UPDATE_PO: 'MasterApi/EditPONumber',
    DELETE_PO_INDENT: 'MasterApi/DeletePOItem',
   // DELETE_PO_INDENT: 'MasterApi/DeletePOItem?RawMaterialId=:indentId&PONumber=:po',
    ISSUE_ITEM1: 'MasterApi/EditIndent',
    ADDUOM:'MasterApi/AddUOMType',
    EDITUOM:'MasterApi/EditUOM',
    ADDCategory:'MasterApi/AddCategory',
    EDITCategory:'MasterApi/EditCategory',
    AddMaterial:'MasterApi/AddNewRawMaterial',
    EditMaterial:'MasterApi/EditRawMaterial'
};

export const Inventory_API = {
    
    //http://localhost:1153//api/MasterApi/EditIndent
	ISSUE_ITEM: 'MasterApi/IssueItem',
	GET_ISSUED_ITEM: 'MasterApi/DisplayIssueList',
	GET_STOCK_LIST: 'MasterApi/DisplayStockList'
}

export const Casting_API = {
    GET: 'SecondModuleApi/DsiplayCastingList',
    ADD: 'SecondModuleApi/AddCasting?Name=',
    EDIT: 'SecondModuleApi/EditCasting',
    DELETE: 'SecondModuleApi/DeleteCastingbyId'
}

export const Chemical_API = {
    GET: 'SecondModuleApi/DsiplayChemicalList',
    ADD: 'SecondModuleApi/AddChemical',
    EDIT: 'SecondModuleApi/EditChemical',
    DELETE: 'SecondModuleApi/DeleteChemicalbyId'

}

export const Grade_API = {
    GET: 'SecondModuleApi/GradeList',
    ADD: 'SecondModuleApi/AddGrade',
    EDIT: 'SecondModuleApi/EditGrade',
    DELETE: 'SecondModuleApi/DeleteGradebyId',
    LISTBYID: 'SecondModuleApi/GradeListbyId',

}

export const Specification_API ={
   GET: 'SecondModuleApi/SpecificationListbyId',
   GET1:'SecondModuleApi/ChemicalSpecificationListbyId',
   GET11:'SecondModuleApi/MechanicalSpecificationListbyId',
   ADD: 'SecondModuleApi/AddSpecification',
   EDIT: 'SecondModuleApi/EditSpecification',
   DELETE: 'SecondModuleApi/DeleteSpecificationbyId',
   GETMECHANICAL: 'SecondModuleApi/DsiplayMechanicalList',

}
//WorkOrderClientList
export const Client_API ={
   // GET: 'SecondModuleApi/ClientList',
    GET: 'SecondModuleApi/WorkOrderClientList',
    ADD: 'SecondModuleApi/AddClient',
    EDIT: 'SecondModuleApi/EditClient',
    DELETE: 'SecondModuleApi/DeleteClientbyId',
    ADDCONTACT: 'SecondModuleApi/AddClientContactDetail',
    ADDBANK: 'SecondModuleApi/AddClientBankDetail',
    DISPLAY: 'SecondModuleApi/DisplayClientbyId',
    GETWORKORDER:'SecondModuleApi/WorkOrderList',
    DELETEWORKORDER:'SecondModuleApi/DeleteWorkOrderbyId',
    GETClientType:'SecondModuleApi/DsiplayClientTypeList',
    ADDClientType:'SecondModuleApi/AddClientType',
    EditClientType:'SecondModuleApi/EditClientType',
    DeleteClientType:'SecondModuleApi/DeleteClientType',
    GETClientType1:'SecondModuleApi/DsiplayClientTypeListForVendor',
    GETAPPROVELIST:'SecondModuleApi/WorkOrderApproveList',
    GETAPPROVED:'SecondModuleApi/WorkOrderApprovedList',
    DeleteWorkOrderrRecordbyIdrow:'SecondModuleApi/DeleteWorkOrderRecordbyId'
}

export const Product_API={
    GET: 'SecondModuleApi/ProductList',
    DELETE: 'SecondModuleApi/DeleteProductbyId',
    GET1: 'SecondModuleApi/ZeroProductList',
    ADDWORKORDER:'SecondModuleApi/AddWorkOrderDetail',
    DISPLAYWorkOrder:'SecondModuleApi/WorkOrderDetailList',
    EDITWORKORDER: 'SecondModuleApi/EditAndApproveWorkOrder',
    DELETEWORK: 'SecondModuleApi/DeleteWorkOrderRecordbyId',
    DISPLAYWorkOrderApproved:'SecondModuleApi/WorkOrderApprovedDetailList',
    MouldNoList:'PlanningApi/MouldNoList',
    PlannedHistory:'PlanningApi/PlannedList',
    MouldHistory:'PlanningApi/CompleteMouldList',
    RejectedHistory:'PlanningApi/RejectedMouldList'
}

export const Planning_API={
    GETContractor:'SecondModuleApi/PlanningContractor',
    SearchPlanning:'PlanningApi/MouldPlanningSearch',
    SUBMITPLAN:'PlanningApi/AddWorkOrderPlan',
    SearchTodayPlanning:'PlanningApi/TodayPlan',
    DELETETODAYPLAN:'PlanningApi/CancelWorkPlan',
    SearchdayPlanning:'PlanningApi/DayPlan',
    SearchPendingMould:'PlanningApi/PendingMouldSearch',
    planningReports:'PlanningApi/PlanningReport',
    SearchMoulding:'PlanningApi/MoveProductionSearch',
    MovedToProduction:'PlanningApi/MoveToProduction',
    RejectMouldsList:'PlanningApi/MouldListForRejection',
    Reject:'PlanningApi/RejectMould',
    RemoveMouldNoSearch:'PlanningApi/RemoveMouldSearch',
    MoveToPlanning:'PlanningApi/ReMoveMouldMoveToPlan',
    MovedToNextDay:'PlanningApi/MoveToProductionNextDay'
}