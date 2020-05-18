export class SdrTabsData {

    actuationTabs: any = [
        { root: "DeviceTypePhPage", tabTitle: "As Found", phMenu: true, aeMenu: false, afMenu: false },
        { root: "DeviceTypeAePage", tabTitle: "As Found", phMenu: false, aeMenu: true, afMenu: false },
        { root: "AsFoundPage", tabTitle: "As Found", phMenu: false, aeMenu: false, afMenu: true },
        { root: "CalibrationConfigrationPage", tabTitle: "Calibration/Configuration", phMenu: true, aeMenu: true, afMenu: true },
        { root: "DeviceTypePhSolution", tabTitle: "Solution", phMenu: true, aeMenu: false, afMenu: false },
        { root: "DeviceTypeAeSolution", tabTitle: "Solution", phMenu: false, aeMenu: true, afMenu: false },
        { root: "SolutionPage", tabTitle: "Solution", phMenu: false, aeMenu: false, afMenu: true },
        { root: "FinalTestPage", tabTitle: "Final Tests", phMenu: true, aeMenu: true, afMenu: true },
        { root: "PhotosPage", tabTitle: "Photos", phMenu: true, aeMenu: true, afMenu: true },
        { root: "TechNotesPage", tabTitle: "Tech Notes", phMenu: true, aeMenu: true, afMenu: true },
        { root: "ReviewSubmitPage", tabTitle: "Review Submit", phMenu: true, aeMenu: true, afMenu: true }
    ];

    isoCrtTabs: any = [
        { id: '1', root: "IsoAsFoundPage", tabTitle: "As Found", fdo: true },
        { id: '2', root: "IsoCalibrationPage", tabTitle: "Calibration", fdo: true },
        { id: '3', root: "PhotosPage", tabTitle: "Photos", fdo: true },
        { id: '4', root: "IsoFindingsPage", tabTitle: "Findings", fdo: false },
        { id: '5', root: "IsoSolutionPage", tabTitle: "Solution", fdo: true },
        { id: '6', root: "IsoTestDataPage", tabTitle: "Test Data", fdo: false },
        { id: '7', root: "IsoOptionalPage", tabTitle: "Optional", fdo: false },
        { id: '8', root: "IsoFinalInspectionPage", tabTitle: "Final Inspection", fdo: false },
        { id: '9', root: "IsoReportNotesPage", tabTitle: "Report Notes", fdo: true },
        { id: '10', root: "IsoRecommendationsPage", tabTitle: "Recommendations", fdo: true },
        { id: '11', root: "TechNotesPage", tabTitle: "Tech Notes", fdo: true },
        { id: '12', root: "IsoReviewSubmitPage", tabTitle: "Review Submit", fdo: true }
    ];

    isoInstrumentTabs: any = [
        { id: '1', root: "IsoAsFoundPage", tabTitle: "As Found", fdo: true },
        { id: '2', root: "IsoCalibrationPage", tabTitle: "Calibration", fdo: true },
        { id: '3', root: "PhotosPage", tabTitle: "Photos", fdo: true },
        { id: '4', root: "IsoFindingsPage", tabTitle: "Findings", fdo: false },
        { id: '5', root: "IsoSolutionPage", tabTitle: "Solution", fdo: true },
        { id: '6', root: "IsoFinalInspectionPage", tabTitle: "Final Inspection", fdo: false },
        { id: '7', root: "IsoReportNotesPage", tabTitle: "Report Notes", fdo: true },
        { id: '8', root: "IsoRecommendationsPage", tabTitle: "Recommendations", fdo: true },
        { id: '9', root: "TechNotesPage", tabTitle: "Tech Notes", fdo: true },
        { id: '10', root: "IsoReviewSubmitPage", tabTitle: "Review Submit", fdo: true }
    ];

    isoLevelTrolRegTabs: any = [
        { id: '1', root: "IsoAsFoundPage", tabTitle: "As Found", fdo: true },
        { id: '2', root: "PhotosPage", tabTitle: "Photos", fdo: true },
        { id: '3', root: "IsoFindingsPage", tabTitle: "Findings", fdo: false },
        { id: '4', root: "IsoSolutionPage", tabTitle: "Solution", fdo: true },
        { id: '5', root: "IsoTestDataPage", tabTitle: "Test Data", fdo: false },
        { id: '6', root: "IsoFinalInspectionPage", tabTitle: "Final Inspection", fdo: false },
        { id: '7', root: "IsoReportNotesPage", tabTitle: "Report Notes", fdo: true },
        { id: '8', root: "IsoRecommendationsPage", tabTitle: "Recommendations", fdo: true },
        { id: '9', root: "TechNotesPage", tabTitle: "Tech Notes", fdo: true },
        { id: '10', root: "IsoReviewSubmitPage", tabTitle: "Review Submit", fdo: true }
    ];

    isoTrimOnlyTabs: any = [
        { id: '1', root: "IsoAsFoundPage", tabTitle: "As Found", fdo: true },
        { id: '2', root: "PhotosPage", tabTitle: "Photos", fdo: true },
        { id: '3', root: "IsoFindingsPage", tabTitle: "Findings", fdo: false },
        { id: '4', root: "IsoSolutionPage", tabTitle: "Solution", fdo: true },
        { id: '5', root: "IsoOptionalPage", tabTitle: "Optional", fdo: false },
        { id: '6', root: "IsoFinalInspectionPage", tabTitle: "Final Inspection", fdo: false },
        { id: '7', root: "IsoReportNotesPage", tabTitle: "Report Notes", fdo: true },
        { id: '8', root: "IsoRecommendationsPage", tabTitle: "Recommendations", fdo: true },
        { id: '9', root: "TechNotesPage", tabTitle: "Tech Notes", fdo: true },
        { id: '10', root: "IsoReviewSubmitPage", tabTitle: "Review Submit", fdo: true }
    ];


    isoController: any = [
        { id: '1', root: "IsoAsFoundPage", tabTitle: "As Found", fdo: true },
        { id: '2', root: "PhotosPage", tabTitle: "Photos", fdo: true },
        { id: '3', root: "IsoSolutionPage", tabTitle: "Solution", fdo: true },
        { id: '4', root: "IsoFinalInspectionPage", tabTitle: "Final Inspection", fdo: false },
        { id: '5', root: "IsoReportNotesPage", tabTitle: "Report Notes", fdo: true },
        { id: '6', root: "IsoRecommendationsPage", tabTitle: "Recommendations", fdo: true },
        { id: '7', root: "TechNotesPage", tabTitle: "Tech Notes", fdo: true },
        { id: '8', root: "IsoReviewSubmitPage", tabTitle: "Review Submit", fdo: true }
    ];

    pressureTabs: any = [
        { id: '1', root: "PressureAsFoundPage", tabTitle: "As Found", fdo: true },
        { id: '2', root: "PressureAsFoundPerformancePage", tabTitle: "As Found Performance", fdo: true },
        { id: '3', root: "PressureFindingsPage", tabTitle: "Findings", fdo: true },
        { id: '4', root: "PressureInspectionMeasurementPage", tabTitle: "Inspection Measurement", fdo: false },
        { id: '5', root: "PressureTestDataPage", tabTitle: "Test Data", fdo: true },
        { id: '6', root: "PressureFinalInspectionPage", tabTitle: "Final Inspection", fdo: true },
        { id: '7', root: "PhotosPage", tabTitle: "Photos", fdo: true },
        { id: '8', root: "TechNotesPage", tabTitle: "Tech Notes", fdo: true },
        { id: '9', root: "PressureReviewSubmitPage", tabTitle: "Review Submit", fdo: true }
    ];

}