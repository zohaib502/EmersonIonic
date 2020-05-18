// //FAT(TST-2)
// export enum Jobstatus {
//     Unassigned = 1,
//     Assigned = 436,
//     Accepted = 444,
//     Debrief_In_Progress = 506,
//     Completed_Awaiting_Review = 438,
//     Job_Completed = 505,
//     Debrief_Declined = 507,
//     Debrief_Started = 504
// }

// //CRP(TST-1)
// export enum Jobstatus {
//     Unassigned = 1,
//     Assigned = 436,
//     Accepted = 444,
//     Debrief_In_Progress =495,
//     Completed_Awaiting_Review = 438,
//     Job_Completed= 494,
//     Debrief_Declined = 496,
//     Debrief_Started=493

// }

// (TST-1)

export enum DatabaseVersion {
  currentVersion = 0
}

export enum Jobstatus {
  Assigned = 436,
  Unassigned = 437,
  Completed_Awaiting_Review = 438,
  Debrief_Approved = 439,
  Submitted_for_Invoice = 440,
  Closed = 441,
  Cancelled = 442,
  Re_Assignment_Required=443,
  Accepted = 444,
  Debrief_Started = 514,
  Job_Completed = 515,
  Debrief_In_Progress = 516,
  Debrief_Declined = 517,
  Working = 11,
}

export enum jobIdNA {
  value = 112117102116101  // Octal value of JOBNA
}

export enum JobstatusName {
  Assigned = "Assigned",
  Unassigned = "Unassigned",
  Completed_Awaiting_Review = "Completed-Awaiting Review",
  Debrief_Approved ="Debrief Approved",
  Submitted_for_Invoice = "Submitted For Invoice",
  Closed = "Closed",
  Cancelled = "Cancelled",
  Re_Assignment_Required="Re Assignment Required",
  Accepted = "Accepted",
  Debrief_Started = "Debrief Started",
  Job_Completed = "Job Completed",
  Debrief_In_Progress = "Debrief In Progress",
  Debrief_Declined = "Debrief Declined",
}


export enum DebriefStatus {
  Submitted = 1,
  ReSubmitted = 2
}

export enum ReportStatus {
  InDraft = 23000,
  DeviceSelected = 23001,
  AsFound = 23002,
  AsLeft = 23003,
  AsFoundPerformance = 23004,
  Calibration = 23005,
  Measurement = 23006,
  Findings = 23007,
  InspectionMeasurement = 23008,
  SolutionNotes = 23009,
  FinalTest = 23010,
  TestData = 23011,
  Optional = 23012,
  FinalInspection = 23013,
  Completed = 23014
}

export enum Product {
  Actuator = 34,
  Networks = 3,
  Instrument = 29,
  ControlValve = 27,
  Regulator = 32
}

export enum Elements {
  Customer = 130095,
  Device = 130111,
  ActuatorDevices = 130268,
  ProductFamily = 5,
  Type = 6,
  ModelSize = 7,
}

export enum BUElements {
  Actuation = 1,
  Isolation = 143,
  Pressure = 333
}

export enum ElementType {
  ListView = 'ListView',
  Dropdown = 'Dropdown',
  TextField = 'TextField',
  SaveButton = 'SaveButton',
  Label = 'Label',
  TextArea = 'TextArea',
  Accordion = 'Accordion',
  ActionButton = 'ActionButton',
  CheckBox = 'CheckBox',
  SaveAccordionButton = 'SaveAccordionButton',
  ActionButtonFileUpload = 'ActionButtonFileUpload',
  ActionButtonComment = 'ActionButtonComment',
  Toggle = 'Toggle',
  Date = 'Date',
  AddButton = 'AddButton',
  AccordionListView = 'AccordionListView',
  ButtonWithIcon = 'ButtonWithIcon',
  NumberField = "NumberField",
  SearchField = 'SearchField',
  ReportViewLabel = 'ReportViewLabel',
  ReportViewButton = 'ReportViewButton',
  SearchDropdown = 'SearchDropdown',
  PDFButton = 'PDFButton',
  PrintButton = 'PrintButton',
  EmailButton = 'EmailButton',
  Part = 'Part',
  Time = 'Time',
  WorldArea = 'WorldArea',
  EditableListView = 'EditableListView',
  RadioButton = 'RadioButton',
  ReportViewRadioButton = 'ReportViewRadioButton',
  TextAreaNoLimit = 'TextAreaNoLimit'
}

export enum TemaplatePlaceholders {
  Header_Left = 1,
  Header_Right = 2,
  Content = 3,
  Footer_Left = 4,
  Footer_Right = 5
}

export enum BusinessUnits {
  Actuation = 1,
  Pressure = 2,
  Isolation = 3,
  Flow = 4,
  // PWS = 5
}

export enum BusinessGroup {
  Final_Control = 1,
  Flow = 2,
  RoseMount = 3,
  PWS = 4,
  // PWS = 5
}

export enum BusinessUnitNames {
  Actuation = "Actuation Technologies",
  Pressure = "Pressure Management",
  Isolation = "Isolation",
  Flow = "Flow Control",
  PWS = "Power & Water Solutions"
}

export enum BusinessGroupNames {
  Final_Control = 'Final Control',
  Flow = 'Flow Solutions',
  Measurement = 'Measurement & Analytical',
  System = 'Systems & Solutions',
  Discrete = 'Discrete & Industrial'
}

export enum DeviceType {
  OtherFreeText = 286
}

export enum RenderWorkFlowConditons {
  Networks = Product.Networks,
  OtherFreeText = DeviceType.OtherFreeText

}

export enum DataSources {
  Lookup = "Lookup"
}

export enum SearchModal {
  single = "1",
  multiple = "2"
}

export enum Selected_Process {
  SDR = 1,
  FCR = 2,
  FCR_AND_SDR = 3,
  Timesheet = 4,
  SDRText = "Service Detail Report",
  FCRText = "Field Completion Report",
  FCR_AND_SDR_Text = "Service Detail + Field Completion Report",
  TimesheetText = "Timesheet"
}

export enum Messages {
  SDR_Required_Msg = 'Please fill all the required fields.',
  Attachment_Exists = 'Attachment with same name already exists',
  Report_Must_Exist = 'Report should exist for upload',
  Attachment_Name_Too_Long = 'Attachment name too long',
  Attachment_Contain_Special_Char = 'Filename cannot contain special characters  \, /, *, :, ?, ", <, >, |, %, #, {, }, [, ]',
  Job_ID_Unique = 'Job Id should be unique',
  ReportSubmittedSuccess = 'Report Submitted Successfully',
  ReportSubmittedFailure = 'Error Occured While Submitting Report',
  validOption = 'Please select the option from dropdown',
  PDF_Failed = 'Error Occured while generating PDF!',
  Status_Update_Failed = 'Error Occured while Updating Status',
  Navigation_Confirm_Back = 'You have unsaved data on the page, your unsaved data would be lost. Do you wish to continue ?',
  Alert_Confirm_Title = 'Confirm ?',
  AccessoriesAlreadyAdded = 'Accessories alreadyAdded added',
  Alert_Title = "Alert",
  Attachment_Name_Too_Long_SDR = 'Attachment name too long.Maximum character limit allowed is 95.',
  Force_Logout_Message = 'You are now logged out due to log in on another device.',
  TimeSubmitSuccess = "Time Records Submitted Successfully",
  TimeSubmitError = "Error occured while submitting time records",
  SiteAllowance_Required_Msg = "Blank data cannot be saved",
  Submitted_Msg = "Data Submitted Successfully",
  Error_Submission = "Unable to Submit data",
  Saved_Msg = "Data Saved Successfully",
  Invalid_hours="Invalid Hours"
}

export enum DetailedNotes {
  System_Info = "SystemInfo",
  Detailed_Notes = "DetailedNotes",
  Result_Remaining = "ResultRemaining",
  Suggestion = "Suggestion"
}

export enum Notes {
  edit = 'edit',
  copy = 'Copy',
  pws = 'Power & Water Solutions'
}

export enum WorkflowGroup {
  ActuationGroup = 1,
  PressureGroup = 2,
  FlowIsolationGroup = 3
}

export enum AttachmentType {
  FCR = 1,
  SDR = 2,
  DetailedNotes = 3
}

export enum WorkFlow {
  NewRepairReport = 37,
  SelectDevice = 38,
  findings = 11
}

export enum Lookup {
  LookupType = 'Accessories',
  LookupTypeWitness = 'Witness Hold Points'
}

export enum LookupType {
  ProductAndConstructionElementsIsolation = 'ProductAndConstructionElementsIsolation'
}

export enum Created_By {
  MobileRNT = 'Mobile RNT'
}

export enum OrderByType {
  DisplayOrder = 1,
  LookupValue = 2
}

export enum Notes_Type_Id {
  CustomerSiteInformation = 4,
  ActionTaken = 6,
  Findings = 7,
  InstalledBase = 20
}

export enum PdfGroupType {
  PressureGroup = 'PressureGroup',
  PreTestGroup = 'PreTestGroup'
}

export enum AttachmentQuality {
  SDRAttachmentQuality = 95,
  FCRAttachmentQuality = 60,
  DetailedNotesAttachmentQuality = 95,
}

export enum AttachmentHeight {
  SDRAttachmentHeight = 800,
  FCRAttachmentHeight = 120,
  DetailedNotesAttachmentHeight = 800,
}

export enum AttachmentWidth {
  SDRAttachmentWidth = 1600,
  FCRAttachmentWidth = 90,
  DetailedNotesAttachmentWidth = 600,
}

export enum AttachmentNameLimit {
  SDR = 95,
  FCR = 50
}

export enum Analytics {
  LoadMore = "Partial data is loaded, click Load_More button to load next set of records!!"
}

export enum Placeholders {
  NotesPlaceHolder = "Tie back to problem statement did you fix it Did the customer not repair something recommended Is there anything critical to know for next repair, anything left undone",
  RecommendationsPlaceholder = "Examples: Upgrade to Enviro-Seal Packing ,Replace Actuator Stem,Body/Bonnet will require weld/repair or replacement, Recommend Application Review due to Cavitation,Flashing, or Outgassing damage,Replace Trim"
}

export enum RepairType {
  FieldDiagnostic = "Field Diagnostic Only"
}

export enum PressureType {
  Power = 12063,
  Portable = 12064
}

export enum RepairDate {
  Repair_Date = 130102
}

export enum MailIcon {
  facebook = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MjhlYmJlNy1lMGU3LWRjNDctYjI0ZS05MzQ0NzMzYmI2ZjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUI2MEYwM0Y4OTFCMTFFOTgxRTU5Qjg0OTc5MDUyMUQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUI2MEYwM0U4OTFCMTFFOTgxRTU5Qjg0OTc5MDUyMUQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZmI1OWJiNjItNzQzNC02NzQ4LTg4YzAtY2Y0OTdiOWVmNzBjIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjUyOGViYmU3LWUwZTctZGM0Ny1iMjRlLTkzNDQ3MzNiYjZmOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Psh25NYAAADYSURBVHjaYvz//z/DQAImhgEGow4YdcCoAyh1gD0Q7wbid0D8CYozSTGAhQLLjYH4ABZxOXqFQDsO8Vf0CgENJPZaIK4G4l/0dMBvJPZCIL5JjiHkOMAZSnMjifkA8Tco+wIQvyXaNFBtSCImBJJIMY8W5QArraPgGzT3sAMxI1TsDxB/h1r+jiTTyIgCISAWBeJHSMHeCMS8QCwCxMykmEdOCMB8+AtJ7CUQf4ZiuhXFzEhsntHacCAcIIzE5h4IB9xFSnivyDWEcbRfMOqAUQeMeAcABBgAzT7tsLw3UA8AAAAASUVORK5CYII=",
  twitter = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MjhlYmJlNy1lMGU3LWRjNDctYjI0ZS05MzQ0NzMzYmI2ZjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjFERUE1ODA4OTFCMTFFOUFCRTJCMTQxRTVEQjY5QTIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjFERUE1N0Y4OTFCMTFFOUFCRTJCMTQxRTVEQjY5QTIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZmI1OWJiNjItNzQzNC02NzQ4LTg4YzAtY2Y0OTdiOWVmNzBjIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjUyOGViYmU3LWUwZTctZGM0Ny1iMjRlLTkzNDQ3MzNiYjZmOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvrifZUAAAFFSURBVHjaYvz//z/DQAImhgEGow4YdcCoA0YdQMgBHEDMRYQ5eUB8DYjfA/FlIE4CYm4gzgRiU7w6QUUxHmwGxPeBWBuPmvL/2MFzIL4BxC747CAUAgJArADEZ4A4BIu8KBB34NArAcTsQMxLSQjIo/lqLRDbI8mL/McPGgmYT9ABIFwBxD/RDL4OxDOBeCoQ/8XjAHFC5rMQiAJLIFYD4nfQIIUBDSgmBAiZz8BIoD0gC8SPyMxhD4BYkdJs+BiIE8l0wD6iVBGRBkC4Hogf/ycNGBNjNrElIahQkSHB91uB+Cw1Q0ACiI9AffaXgM+/ATE/keYS7QAY9gfiFwQcYEqKmYSyiTIQi0FLRGsg9gVicRxqbwNxGBBfICmpEnChJRCvRvPhZyD+hITvAHEDEDOTGJpgzDjaLxh1wKgDRrwDAAIMAIlUAdsywnM8AAAAAElFTkSuQmCC",
  linkedin = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MjhlYmJlNy1lMGU3LWRjNDctYjI0ZS05MzQ0NzMzYmI2ZjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Njg1NDUyQjE4OTFCMTFFOUJGMTI5NTFBREJCQkM1QUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Njg1NDUyQjA4OTFCMTFFOUJGMTI5NTFBREJCQkM1QUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZmI1OWJiNjItNzQzNC02NzQ4LTg4YzAtY2Y0OTdiOWVmNzBjIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjUyOGViYmU3LWUwZTctZGM0Ny1iMjRlLTkzNDQ3MzNiYjZmOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv9SKF8AAAEgSURBVHjaYvz//z/DQAImhgEGow4YdcCoA4hxgBwQzwLiyUAsQG0HMBJRED0HYgko+xAQ29PbAcgK3gCxKL2jIAqIHwPxbSAOHYgooClgIUJNAxDLgBwLxKeAeCYQewNxNDR6bgFxBxA3A3EgEDMD8VGovrsETQeFAAH8/D8C7IaKtSKJ/QPi6/8xwS8gliVkPjFp4D4S+ylSYoRHIxBrAPElaFqBAVYg7qRXQVQBxPrQMuMCkrgDrRzAiMT+iObT+UhsfnqEwDdowoOBP0jsf/RwADNabmLFUYjRLAoGpDakqwMUkdjSUFoESUwMzUFCSGxeapSEM4BYDak2BIEjQCyLlAv+Iqk/BsTLoOzvg74uGG2SjTpg1AED7gCAAAMADwGf9ATHdCQAAAAASUVORK5CYII=",
  youtube = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MjhlYmJlNy1lMGU3LWRjNDctYjI0ZS05MzQ0NzMzYmI2ZjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkUyNkU2NkU4OTFCMTFFOTk4RUVBQTJERUI2MkYwREMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkUyNkU2NkQ4OTFCMTFFOTk4RUVBQTJERUI2MkYwREMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZmI1OWJiNjItNzQzNC02NzQ4LTg4YzAtY2Y0OTdiOWVmNzBjIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjUyOGViYmU3LWUwZTctZGM0Ny1iMjRlLTkzNDQ3MzNiYjZmOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtrzjesAAADiSURBVHjaYvz//z/DQAImhgEGow4YdcCoA0YdwEKkOjsgdgRiaSBmh4qhF6GMUPoXED8F4n1AfIigyaCimAAu/E8+yCNkPiMRdcEbIBYmM4RfArEEpWmAA4c4KHhfEdDLRY1EiCuIPIFYBogn4NHLSEsHaADxbyAuhFq0jAS9VMmGf5HYSkDMT6tsiMuRz4BYEognAXEIuR4kxgG/8SRCNQKW/KZGFNzHkwYI6X9EDQcUUZBOKgkpYCSyUaoCxMHQxMZJoCj+CcRPgHgTEJ+nlgNGq+NRB4w6YNQBw9cBAAEGAM4Hl1+jWXD6AAAAAElFTkSuQmCC",
  emersonLogo = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1N0RFM0M3OTkwRDExMUU5OUIwQkU2RUZDNzYxNzU5QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1N0RFM0M3QTkwRDExMUU5OUIwQkU2RUZDNzYxNzU5QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU3REUzQzc3OTBEMTExRTk5QjBCRTZFRkM3NjE3NTlCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU3REUzQzc4OTBEMTExRTk5QjBCRTZFRkM3NjE3NTlCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgATgCyAwERAAIRAQMRAf/EAL0AAQACAgMBAQAAAAAAAAAAAAAICQYHAwUKBAEBAQACAwEBAAAAAAAAAAAAAAAFBgEDBAcCEAABAwMDAwEEAwUSDwAAAAABAgMEAAUGERIHIRMIMUEiFBVRYQmBMkIjM3GRoXLSc7PTJHWVFjZ2F1cYOLFSgrJTkzTUpbWWJ1gZOREAAQMCAwQGBgkFAAMAAAAAAQACAxEEIRIFMUFRYXGR0SITBoGhscEyFPBCUnKSUzQVNeFigrIjM1QW/9oADAMBAAIRAxEAPwC/yiJREoiURKIlESiJREoiURaNzXmKPiPIFhxV2IV211nuX6ZtO5vv9GC39IRoSr6QdB1FZosErdzLrT7TT7DiXWXkBbTqDqlSVDUEEeoIrCyuSiJREoiURKIlESiJREoiURKIlESiJREoiURKIlESiJRFr3k/kXHeMMRn5NkV5t9lSAqPaF3J8MMvzloWplnefaopP3Aa3wW0k7ssbS47cFpmnjhbme4Ac1FHCLgjlays2y+y25uQxluScUyMrC/iEPEuLiOOanVKiSWzr0PT06HW5paaEUK+2uDhUKTPHcuXabc3ZbstSEsr7cXunq2fQo6+zX84/ofJC+gVtesLKURKIlESiJREoiURKIlESiJREoiURKIlESiJREoienU9AKIqM/Mbm7iznzPGsJTl93xy14BKkwLbeu23KscuWVBL0oobIdHUdtKzqNqdw0CjV60ixu7CPxGsa/MKkbHgbgN3oVO1S8tbx+Rzy3LsO1p9/pWE8R8Y85cdqTk2BXheTYw24HfmGOv/ADKAodCC9EG5SD9O5A0+muu7u7G8GSZuV/Bwyu9B/quaytLu2dnjfmYfsmrepScuPnLFti27byBjimZTBDUu92nUL3J90qdiOnXXp10X/k1Ev8sOkGaF3oPaFKu8wshdllb6R2KaHAHkPg/MEZy0WTIo11vEBj4hLaVFL64ySEkuNL0WlSCoA6jrqPrquXdhPamkjCPZ17FN217DcCsbgfb1bVJauNdSURKIlESiJREoiURKIlESiJREoiURKIlESiJRFEXzJ55u3BvGKZWMWr5rleTPmHbu7GXIiRoyNFSpEkJ0G3aQgAqHvLB9AamNEsGXc+WR1GjnQngAovV7x9tDVgqTyqBzKpHxqZxHyRNRGyjGZPHt2WoaZFjgMiAT9L0BwlQH6RRNXgwXtmKxvEjfsvwd6HdqpvjWl2cr2FjuLfh9LexTVsnE3InF2Pu5jw3lzGYRQ2D8fjEpSZSEFOpEiCohWvr7p3fdqLl1CC4cGXLMp/uGHoKmorKW2YXQnN93sUWs155tGcXCXZObONI1zuUdfacym2tfKr0wpOv5VACUrI+ghI+qu9mlSQAPs5aA/VPeYexRTtSjncW3UVafWHdeFbn4ZePOJ8PYQrLrX8fLvnI8aNPclXiM3GmxLetAcYhFCFL06krUdQVEjVI2gVT9b1OW7eGPoAzCgNQTvKtWk6fHbML21ObHEUNNwUz6hFLpREoiURKIlESiJREoiURKIlESiJREoiURKIlEWJZph1qzexv2a6NA6/jIUrQFTLwHurH1ewj2igWCKqEv9k3jO43Wci/Y9/F67JJCrzaNI5Kh1S4W9C04D7fd1I9oNTNtrd1CMubM3gcfXtUZNpNtI7Nlo7iMP6KMHOPj/wAwcY3I3vi/IV3Mw0ByEuG58HPS0fTahSi28kj2BXX/ABTU9Za1aXAyXLaV44t7QofUNMu4zntzWnDA/wBU8UrDl/kRyJIY5v45tt9tHHrSJNzyS5wnIU34snWLFPb2JdKlJK1A+7sSdwO4a69UbFp8YfaykZ/qg1bTeeSzpzpL5+W5jByfWIo6vDmrpQAAABoB0AFUxWtftESiJREoiURKIlESiJREoiURKIlESiJREoiURKIlEWP5Dal3KC98MAJqEEs+zfp12k/4KyCsEKLc67R8oD+AXhfwd7WpaMWnu6jZK6/uV32hDhGgJ+9V+dWVhSP49xU4biVpsTjyn5bLZdnuqUVAvune4E9T7qSdBp7K+SshZrRZSiJREoiURKIlESiJREoiURavuPNnD1ouE21XTlDFrdc7a+5FuECRdYjbzD7SihxtxCnAUqSoEEHqDXW2wuHAERuIPIrndeQtNC9tRzC+P+n3g/8ArcxD+GIf7bX1+3XP5buor5+dg+23rCye38kcfXWxTcotubWObjVtdDFwyBqfHVCYdO3RDkgL7aT76ehPtH01pdaytcGFpzHdQ16lsbcRubmDhQb64L7sfzbDMscktYtltmyR2GlK5jdrnR5imkrJCSsMrWUgkHTWvmSCSL42kdIIX1HMyT4XA9BWT1qWxYrf86wnFJDEXKMwsmOSpTfdjRrpPjxHHGwdu9KXloJGo01Fbo7eSQVY0noBK1Pmjjwc4DpK/Z2cYZbcdby64ZXaIeKvbCzkbsxlMFfcVsRtkFXbO5XQaH1o23kc/IGnNwpj1LJmY1ucuGXjXBYZ/T7wf/W5iH8MQ/22t/7dc/lu6itPzsH229YXNH514XlyGIkXlbFJMqU4lmNGau0Ra3HFkJShKQ4SSSdABWDp9yBUxu6isi8gJoHt6wu5yPlTjTD7j8oyvPsfxy69pL3y65XGPGf7a9dq+24tKtDodDpWuKzmlGZjHEcgV9SXMUZo5wB5latGY+O90zqFmjPKWIuXeHHWgR03iCG1uq0Sh86uj30pJT90H1FbDYXIGMbuor5F5Afrt6wpA226Wy8RG59ouMW6wXvyU2G8h9pX6VbZUk/cNcrmOYaOFCt7XBwqDUL5r5f7FjNvdu2R3mDYbWwQHrjcJDcZhJOugLjqkp1OnQa1mON0hytBJ5I97WCriAOa1AfJ7x3DpZPNGIhwK2EfNI+m7XTTXdp613ftF5SvhO6iuT9ytvzG9a2tjuWYtl0Qz8VyO2ZJCToFyrZLZloST1AUppSgD9RrilhfEaPaQeYoumOVkgq0g9C4snzLEsKg/M8vya14xbzrtl3SW1FQop6kJLqk7iPoFZigkmNGNJPIVSSZkYq8gDmtZRfJrx7mSGosbmbEXH31bWkfNY6dxPsBUsD9Gut2k3bRUxO6iuYajbE0EjetbphTYdxix51vlsz4MpAcizI7iXWnEH0UhaCUqB+kGuBzS00OBXYCCKhYJeeXeLMduz9hv/I2N2W9xlIRJtU25xmJDanAFIC23HApOoUCNR6GuhllPI3M1jiOIBWl91Ew5XPAPSFsFtxt1tDrS0utOpC23EEKSpKhqCCOhBFcxFFvWCZFypxpiFy+TZVn1gx27dtD3y243CPGf7bmuxfbcWlWitDodK6IrOaVuZjHEcQCVokuYozRzgDzKzpp1t9pt5lxLrLyQtp1B1SpKhqCCPUEVzkUW8Gq5KIvLdzc1GkeSfL0ec524T/JWQNy1lWwJaVeJAWd3s0Htr1zTyRZx02+G3/ULze9AN0+v2z7VaWfGD7PvU/9xbePq/jex+rqo/u+rfYP4FZP23TvtD8Sz7yL40wLinwgzzFuN2NuLKTBuMSUX/ilSVS7nFd76n/w9RtCSOm0JA9K5tMu5bnU2Pl+LEcKUBW+/to4LBzY/h29ZCqB8eOW8m4H5CsHJtvjSpGNolfKsojoCgxMhvAKfjlX3vcSkBxvX8JIPprV11OzZewmInvbRyPHo3FVWwunWsgkGzYea9Jj/JOFsceL5UXfY5wZFo+eC+JUC2qGW+4FD6VEe6E+u73dNeleWi1kM3g079aU5r0E3DBH4te7SteS80PPHKeUc28gXvlG+R349tu8pyBjjCgezFiRAktREK9CptDiVL09VLKvwq9U060ZZxCFpxAqeZO/sXnl7cuuZDI7YcB0cFY/yf8A/MjAP1q0H/iDlVmz/mn/AOXsU/c/xTPR7VE3w44z4B5IkchI52yNiwNWdu1qxgv3dFq7qnzK+J2lZHc2htv09NfrqX1u8u7cM+XFa1rhm4U96jNJtrabN4xpSlMacaqyjivxg8MY+c2K9ce5DFyrKcakIu1ttjWQN3EJcjKCkPLjoUSoNr2qGvQHSqveavqRiLZRla7A92nrVgttNsRIHRmrhjtqq9PtHunktcNOmuP2rX/Vrqy+V/0Q+8VBa/8Aqj0BSbtXiT4p3Hx+xvN8iyRWGZFPxKLdLlf/AJ2nRuc5ES8omM+paVar1/FpAJ9B1qJfrd+27dG0ZmhxFMu6vEe1SLdKszbB7jlJbWtd9OCiL4H5vnFg8hsKxvG7nNXYMokPxcnsiFKVFeipYccLzjXVIU0UhYX6j010JBmvMNvE+0e94FW7DvrX3qK0WaRly1rSaHaOS7v7Q/LczuvkPf8AGb7LlN4zjUS3pxG1lShG7EiI087IQjolSlvKWlStNfd26+7WvyzDG20D2/ESanft2dS2a9K91yWu2ClB6O1SQ4V4z+zz5GwvH7W7d0RsydhsIvTd9u8m1XEzu2O9sC3G46xv107W5OlRd9d6vBIXU7tcKAEU9vWu+zttNmYBXvb6kg1+nBTN4w4C4j8Tca5J5Bxdy43Npy1yLtOuVxkNvut26CwqT8LHW2htOxRQVakFSjt1J0FQV3qVxqb2RvoMaUHE4VKl7axhsGvkbU4Vx4DcqV7FKzbzH8irBbcxyCSHMxua0uqSoqatlsZSt9xmI2fdQG2kEI6dVe8rUkmr3II9Ks3GMfCOs8/SqgwyahcgPPxHqHJWics/Z68KPcZX5vjuzTLDm1mtzsqxXdU6RIMp+OguBmS26stkPbduqUp2k6joNDUrLzLciceKQWk4igw6OhWS60GDwj4Yo4DA19qgz4B89ZRg/LVg4znXZ+XgmePrgm0PrK2ok9aCY8iOFH3CpaQhYHRQVqeoFWDzHpzJrd0oHfbjXiN4KhtDvnxTCMnuu3cCta+aMGXcvLTky229kvzrjdLZGhx0kAuPPQIiEJBJA1JIHWurQnBtgwnYAfaVz6u0uvHgbSR7Ap0eDPlRcI0trx05ikPW/I7M8q24Vc7kO06FMHtm0yisghxspIaJ6n8n6hOtf8waOCPmoMWnFwH+w5cetTOjamQfl5dowFf9T7lF37R7+8uoew45adR912pfyv8Aov8AI+5Ruv8A6r0BXy4r/JfG/wB64f7AivO5vjd0lXaP4B0Bd9Wtfa8uHNcVmd5L8uQpOvw8vky/sv6HQ7F3h9KtD7Ohr1uwNLOMj8tv+oXm94K3Tx/efarlP/Xr4tA/k7wPq+dH9TVI/wDp77l+FWz9htOfWsm8xbTarB4d5vj9kXvtVgt1mt0DVzuqDMadEbbCl+07UjU1o0N7n6ixztpJPWCturNDbJzRsAA9YUDPCjh2zc6cEc/4Bde2xKmT7XIx66rTuMK4ssSDHeHt26+6sD1QVCrHr186zuoZG8DUcRUVUJpFo26t5WHiKcio2NZPzw9j6PC4RXw4vL+ybGoK+JS/v/2TeegjB390E6afh67alDFah/z/APbt9/TuUcJLgt+U/u2e7o3re3nRxNZOEsA8c+PbGEuJtcK+O3e4AaKmT3lQVSZCvb7yuiR7EhKfZUd5fvHXcs8rt5bTkMaBd2s2rbaOKMbq15nCq3Zyf/8AMjAP1qz/APMHK4bP+af/AJexdd1/FM9HtUcfBbx+4v53k8mtclJmKRjDVoXZ/hJvwfWYqYHt3Q7vyKNPo+7Un5g1OeyEfhU71a4V2U7VwaNYRXRf4m6lMabaq13iHxT4N4Ty05lghnNX1cJ63hUy5/EtlmQpBWA2QBqSgaGqffazdXkeSSlK1wFFZrTTLe2fnZWuzaqm/tHv7y1w/m/av8xdXHyv+iH3iqxr/wCqPQFzcqeGE3HuAMA5uwC5XTI486ww7tn1hl7HHIaZTCHTJidltBLLZUQtKtVJGitxG7TFnrofdvt5ABiQ08abjzWbnSCy3bMwk4AkcOY5KSn2b3IfCgYk4UcYt2L8xrbWlvIXVKcevkQEuKQw48pRaWjTVbKNAoALAOhCYvzRbXP/AJMxdFw+yfpvUh5fng+CgEnH7Q+m5T55d4b4K5qmxMe5ItdqueURou62Kblpi3lmMtZ0LZaWl4tlQOgUCjXXprrVcsr66tAXREhu/CrexTd1aW9ycsgBPrVZfk39n9iPFnH2T8nYNnc1qDjiESJWN31LThcbcdS3248poNHcCsbUqQd3pu1q16T5kkuZmxSMFTvHvCr2o6GyCMyMdgNx7Vh/hRl3IPIWK86eP5uUq8WO+cfXeVjMWS4XEwLhtRGbQ0peuxt4vgKSOmoBA1J13a9DFA+K5oAQ8V5jb1ii06PLJKySCtQWGnI7FoHxBy2Bxl5K4DccrdFkhMz5Vou78wdoRHJbDsQd7eBs2urAUTpt66+lSWtQm4snhmJoCKb6Y+xcWlSiG6aXYbQeVcF6G+Us5sHHvHOW5pf5zMa02i1SH0rUsDvuFpXZZaP4S3VkJSB6k15paW755mxtGJP06le7mZsMTnuOAC87Ph3iFxzPyP4viQI7jrVnu7d7uTyASGY1uPxClrI9AVJSjr7VAe2vTdbmEVnITvFB0lULSojJcsA3GvUtjeTn9+a/fzsx79gg1yaT/GD7rveujUf15+833KdHnR4lPZkxI5t4tgrZzyyITIym0QQUu3JljQplsBsa/EsgDXTqtI6e8kboDy9rIiPy8x7h2E7uR5H1KZ1rS/E/7R/ENo48+kKojk7lbKOX8hseSZi4iTkFss8KyzLkOi5YhFYQ+6P9IpKgFkepG721dLSzZasLGbCSacK7lV7m5fcODn7QAOmi9SeK/wAl8b/euH+wIryOb43dJXpEfwjoXfVrX2qKuXOMPDW4cs8nT8m8m7xYMnm5bepGQ2JnF7lIRCnuT3lSYyHm4qkuBp0qQFJJCtNQa9BsrvUWwRhkALQ0UOYYigodqpl1bWRmeXTEHMajKcDXoWLf0SeHX/ljln/SN6/3Ot3zuof+u38be1avlbL8534T2KXOMYNwLH8OuU8ctnON0m8bT74y7f8AkWdYLgH4MgPQSllNvW02+6klLY1SNPeP0GoWa4ujqMbjEA8DBocMdu/YpSOG3Fk9okOSuLiDhs3bVsTwJxLiLFLFyI1xNyy9yrEmToCrxKeskyymG4hp0NoCZYBc3gk6p9NK5vMU1xI5njR5MDTEOr1Lo0SKGNr/AAn58RXAinWtsmJ44f2qhP8AmsX+0J/F34cWQId29jYVfEFYa7PxXw/u6Fzudn8Db1rizXnyNKHwc233caV5Uqumlr83Wv8A1ps+mFaepaI8+cN4XyuTxmrlvmR/ilcJq6CxoZsM29fGhao3eJMQHtdvan7713dPSpHy7PcxiTwYs9aV7wbTbxXHrcUEhZ4smTbTAmuzgu0zLEeFJHhFiGM37lqVB4ojt24QOS2bNLU9ICJa1NH5cG3H0b16p6p6etfNvNcjU3PbGDJj3ajhx2LM0UBsGtc/uYd6h48Nqr+h8SeFH4z5f5Y5Hr07vw+I3f69N22H+bVjN7qW+3b+NvaoQWtjumP4T2LMsN4r8SI2X4pItnlJlNyuUe8QXLfb3MUvDSH30SEFtpS1RAlIWoBJJOgrRPeX5jcDbtAofrN4dK2w21mHtpM4mo+qexbr8x8B8Yci5pl3Llbnm5ce5aq0QG3Mci4/OuLaWEJV2ne/HjuIJWPZrqK4NDub2O2AhhDm1OOYD1Ers1aC1fPWWQtdQYUJ9ysh4th4tb+IMGg2a7pv+GQ8YhMwL5NZMdEu3oipCX3mXkp2BbY1UlYGntqr3bnuuHlwo7McBuNVP2wYIWgGraDHlRVAT+NfCu68rOXHjbyQv2KX2XfEuYxjuPY3dpvwk4ujY3b5DMP30938nsJGmgBI61dW3WpNgpLA1wpiXOaKjmK9aqrrexdLWOUg1wAaTjywWyfJHjfxrufIbiOS/IvLcZ5pj263s3qWceucyPICIzYafZjRoWxAcQASll/YF7ugVuFcul3V62H/AJQtMVTTvAb9lSfaF0ahb2rpf+krhJQVwJ9QHsK0PfOG+F0woSs78zMufxoOJLTNz49ypphXToGlynHG0nT0ISfzKkI765qfDtm5uUjPcuJ9pBQZ53U5sd71Y54YWnxasloyO3+PuUqzG9tCOcyvtwZlR7k6g7uzq1KjxdrIO7QNo26/fEqqsa6++e5puW5R9UClPUTj0qf0hto1pEDqneTWvrAwUa/KrE/BTJ87yBGQcqr4z5SZfIyWTYrZcLpFclHXeZbMaK6yXgfv9jqF7vv/AHqldHm1SOJuWPPHuqQDTlU1p6DyUfqcWnvkOZ+V++gJHpoKVUc7jw5wSi12Reb+ZOWSsLSQbVHmcf5OxFUnToIjslTzKentSg1JsvrrMfDtm5t9JGV9NMVwOtLegzzuy/cd6qqyjw5tnipaLTfIHjzkTeVXphDQyy+T2pDN4eb1/FlbcuPGUGd3p2mwjd6+9VW1x985wNy3KNwFMvqJx6cVYNJbaNBEBqd5O31gYdGCi1zbx94t3Lygut7y/n6543yK5f7Q7JwprHp8lluU21FEdkS24ymyHAlBKt2g3dfSpawub5tkGshBZQ97MBhjXCqjbyC0ddlz5SH1GFDy30VvtUtWpUk86YB4J5BytlFyHPUnALuuc4jIscs9huFygJuSVkSFsPMxFtDevUqCFqTu1009BfdPudUZA0eDmFMCXAGm7eqfewae+YnxMpriACRXqViXIOO4vc2rQ21yDlmNux7RF1fx233OQp+C1b5oXvERlwJ7rCyToAsKS3t0cKKrFtK9te404n4iNtRx4H37qqenjY6necMNwOyh4cvcpSVEqSX/2Q=="
}

export enum LookUpsType {
  element = "AsFoundPerformanceElementActuation",
  option = "AsFoundPerformanceOptionActuation",
  direction = "AsFoundPerformanceDirectionActuation",
  condition = "AsFoundPerformanceConditionActuation"
}

export enum WorldArea {
  NorthAmerica = 12057,
  LatAm = 12058,
  Europe = 12059,
  MEA = 12060,
  Asia = 12061
}

export enum Actuation {
  ActuatorPneumatic = '1',
  ActuatorElectric = '2',
  NetworkType = '3',
  GearBox = '4',
}

export enum FlowIsolationProductId {
  ControlValve = 27,
  Isolation = 28,
  Instrument = 29,
  LevelTroll = 30,
  TrimOnly = 31,
  Regulator = 32,
  Controller = 33
}

export enum PhotosAccordion {
  //Actuator
  AsFound = 30567,
  CalibrationConfiguration = 30569,
  Solution = 30572,
  FinalTests = 30573,

  //Flow-Isolation
  AsFoundAssembly = 30565,
  AsFoundTrim = 30566,
  AsLeftTrim = 30691,
  AsLeftAssembly = 30692,
  AsFoundAssemblyPhotos = 30508,
  AsFoundTrimPhotos = 30509,

  AsFoundPerformance = 30513,
  Findings = 30514,
  InspectionMeasurement = 30515,
  TestData = 30516,
  FinalInspection = 30517
}

export enum PhotosAccordionTitle {
  AsFound = "As Found",
  CalibrationConfiguration = "Calibration/Configuration",
  Solution = "Solution",
  FinalTests = "Final Tests",

  //Flow-Isolation
  AsFoundAssembly = "As Found Assembly",
  AsFoundTrim = "As Found Trim",
  AsLeftTrim = "As Left Trim",
  AsLeftAssembly = "As Left Assembly",
  AsFoundAssemblyPhotos = "As Found Assembly Photos",
  AsFoundTrimPhotos = "As Found Trim Photos"
}

export enum MCSConfig {
  baseUrl = "https://E652694781804221963B6609C43D8334.mobile.ocp.oraclecloud.com:443",
//  backendId = "1b65310a-c506-44f7-a76d-920df9ed8bc0", //working
  backendId = "4ecaa64d-3133-48fd-93a4-fb01d99429c9 ", //Testing
  anonymousToken = "RTY1MjY5NDc4MTgwNDIyMTk2M0I2NjA5QzQzRDgzMzRfTW9iaWxlQW5vbnltb3VzX0FQUElEOjRjMWY0MTMxLTlmYTQtNGI3ZS1hNTIwLTNjM2U2N2YxM2M0OQ==",
  encodedAuth = "Basic Y3JtYW5kb3Njc3VwcG9ydEBlbWVyc29uLmNvbTpFbWVyc29uIzIwMTk=",
  encodedKey = "Y3JtYW5kb3Njc3VwcG9ydEBlbWVyc29uLmNvbTpFbWVyc29uIzIwMTk="
}

export enum FlowName {
  Actuation = 1,
  FlowIsolation = 2,
  Pressure = 3
}

export enum Environment {
  env = "DEV"
  //env = "QA"
  //env = "CRP"
  //env = "FAT"
  //env = "Training"
  //env = "Production"
}

export enum PressureProductId {
  DirectSpring = 7,
  PilotOperated = 8,
  VentVacuumOnly = 15,
  VentPressureOnly = 16,
  VentVacuumPressure = 17,
}

export enum AlertMessage {
  "LoseData" ="Are you sure you want to Delete this time entry?"
}

// export enum syncStatus {
//   Done = "I",
//   Pending="P",
//   PendingAccept="PA",
//   PendingDebrief="PD",
//   PendingUpload="PU",
//   PendingStatus="PS",
// }

export enum syncConfig{
  syncDuration = 30,
  syncUnit = 'minutes',
  waitTime = 1800000,
}

export enum errorCodes {
  unableToDownload = "0",
  sqLiteError = "0",
  unknownMessage = "0"
}

export enum errorMessages {
  unableToDownload = "Unable to download the attachments.",
  sqLiteError = "Unable to execute query",
  unknownMessage = "Some error occurred while performing Sync.",
  unableToCreateFolder = "Unable to create folder for Report",
  jointVerb = " is ",
  already = ' already ',
  invoice = " for invoice ",
  contact_admin = ", contact your administrator",

  assign_unassign_status = "  is no longer Assigned to you, please contact your Scheduler/Service Admin to verify the Job and assignment status.",
  cancelled_job = "  is Cancelled; if a job is still required then please contact your Support Team for assistance",
  closed_job = "  is Closed; if a job is still required then please contact your Support Team for assistance",
  debreif_job = "  is Debrief Approved for Invoice; if a job is still required then please contact your Support Team for assistance",
  submitted_job = "  is Submitted for Invoice; if a job is still required then please contact your Support Team for assistance",
 
 
  unableToCreateLanguage = " Unable to create language file.",
  offlineConnectivity = "Can not continue sync in offline",
  activity_not_found = "cannot be updated - Activity Not Found in OFSC"
}

export enum errorSource {
  unableToDownload = "App",
  sqLiteError = "SQLite",
  unknownMessage = "Unknown",
  connectivity = "Connectivity"
}

//Maintain the status to save the conflict API Data
export enum conflictStatus {
  OSCTaskSubmit = 1,
  OSCInstallBaseSubmit = 2,
  ATPSDRReportSubmit = 3,
  ATPTimeSubmit = 4
}

// export enum OFC_status {
//   Completed_Awaiting  = 438,
//   Accepted  = 444,
//   Working = 11,
//   Debrief_Started = 514,
//   Job_Completed = 515,
//   Debrief_In_Progress = 516,
//   Debrief_Declined  = 517, 
//   Cancelled = 436,
// }
export enum OFSC_status {
  Completed_Awaiting  = 3,
  Accepted  = 8,
  Cancelled = 7,
  closed = 5,
  unassigned = 2,
  activity_not_found = 'A0' //Special Case When JOB is present in OSC and its Activity ID is not found in OFSC
}
 
// (TST-1)
export enum OFSC_Jobstatus {
  Accepted = "Accepted",
  Completed_Awaiting_Review = "Completed-Awaiting Review",
  Working = "Working",
  Debrief_Started = "Debrief Started",
  Job_Completed = "Job Completed",
  Debrief_In_Progress = "Debrief In Progress",
  Debrief_Declined = "Debrief Declined",
  Cancelled = "Cancelled"
}

export enum ErrorHandlingStatus {
  sync = 1,
  onFly = 2,
  admin = 3
}
export enum WorkType {
  Deputation = 1,
  Travel = 2,
  Normal = 3,
  NightShift = 4,
  Labour = 5,
  Break = 48,
  NoValue = -2
}

export enum chargeMethod {
  NonBillable = 49
}

export enum countryCode{
  CA = 'Canada',
  US = 'United States'
}

export enum clarityStatus {
  Saved = '1',
  Submitted = '2'
}
