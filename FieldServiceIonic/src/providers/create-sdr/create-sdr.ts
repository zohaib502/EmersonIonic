import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ValueProvider } from '../value/value';
import { LocalServiceProvider } from '../local-service/local-service';
import { UtilityProvider } from '../utility/utility';
import { LoggerProvider } from '../logger/logger';
import { SortPipe } from '../../pipes/sort/sort';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import * as Enums from '../../enums/enums';
declare let cordova: any;
// declare let JSPath: any;
declare let $: any;
@Injectable()
export class CreateSdrProvider {

  isTemp: boolean = false;
  fileName: any = 'CreateSdrProvider';
  //attachmentList: any;
  translate: any;
  iconsObj: any = {};
  pdfObj = null;
  attachmentData: any;
  lov: any = {};
  allAttachmentList: any;
  SDRPrintLanguages: any;
  repType: any;
  noborderstyle = [false, false, false, false];
  printed: any = false;
  constructor(public translateService: TranslateService, public logger: LoggerProvider, public localService: LocalServiceProvider, public sortPipe: SortPipe, public http: HttpClient, private utilityProvider: UtilityProvider, private valueProvider: ValueProvider, private platform: Platform) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = {
      //   // Default font should still be available
      //        Roboto: {
      //             normal: 'Roboto-Regular.ttf',
      //             bold: 'Roboto-Medium.ttf',
      //             italics: 'Roboto-Italic.ttf',
      //             bolditalics: 'Roboto-Italic.ttf'
      //         },
      Arial: {
        normal: 'Arial-Regular.ttf',
        bold: 'Arial-Medium.ttf',
        italics: 'Arial-Regular.ttf',
        bolditalics: 'Arial-Medium.ttf'
      },
      SourceHanSansSC: {
        normal: 'SourceHanSansSC-Regular.ttf',
        bold: 'SourceHanSansSC-Bold.ttf',
        italics: 'SourceHanSansSC-Regular.ttf',
        bolditalics: 'SourceHanSansSC-Regular.ttf'
      }
    };
  }

  getNewNoBorderSection(isActuation?) {
    let table = {
      widths: ['*'],
      border: this.noborderstyle,
      body: []
    };
    // Added a row in body
    table.body.push([]);
    // Added a column in above row
    table.body[0].push([]);
    return { table: table, layout: 'noBorders' };
  }

  getNewNoFinalInspectionBorderSection(isActuation?) {
    let table = {
      widths: ['*'],
      border: this.noborderstyle,
      dontBreakRows: true,
      body: []
    };
    // Added a row in body
    table.body.push([]);
    // Added a column in above row
    table.body[0].push([]);
    return { table: table, layout: 'noBorders' };
  }

  getPressureNoBorderSection(isActuation?) {
    let table = {
      widths: ['*'],
      border: this.noborderstyle,
      body: []
    };
    // Added a row in body
    table.body.push([]);
    // Added a column in above row
    table.body[0].push([]);
    return { table: table, layout: { defaultBorder: false, paddingBottom: function (i, node) { return -16; } } };
  }

  getPressureNoBorderSectionNotes(isActuation?) {
    let table = {
      widths: ['*'],
      border: this.noborderstyle,
      body: []
    };
    // Added a row in body
    table.body.push([]);
    // Added a column in above row
    table.body[0].push([]);
    return { table: table, layout: 'noBorders' };
  }
  getTableSection() {
    let table = {
      widths: ['*'],
      border: this.noborderstyle,
      dontBreakRows: false,
      body: []
    };
    // Added a row in body
    table.body.push([]);
    // Added a column in above row
    table.body[0].push([]);
    return { table: table, layout: 'noBorders' };
  }

  getNewSection() {
    let table = {
      widths: ['*'],
      body: []
    };
    // Added a row in body
    table.body.push([]);
    // Added a column in above row
    table.body[0].push([]);
    return { table: table };
  }

  public generatePdf(currentReport, isTemp, langCode) {
    let self = this;
    return new Promise((resolve, reject) => {
      this.getAllWorkFlows(currentReport).then((allWorkFlow: any) => {
        this.getReportData(currentReport).then((reportData: any) => {
          //You will get Current Report on the basis of CurrentReport.ReportID_Mobile
          this.allAttachmentList = reportData.filter(item => { return item.ElementType == Enums.ElementType.ActionButtonFileUpload; });
          this.translateService.getTranslation(langCode).toPromise().then(translate => {
            this.getBase64Attachment(currentReport.ReportID_Mobile).then((res) => {
              // console.log("ReportData", JSON.stringify(reportData));
              this.getstaticIcons().then((resp) => {
                try {
                  this.translate = translate;
                  let footerprefix = this.translator('Page');
                  let footerSuffix = this.translator('Of');
                  let defaultFont = 'Arial';
                  if (langCode == 'zh-cn') {
                    defaultFont = 'SourceHanSansSC';
                  }
                  // let watermarktext = currentReport.Status != Enums.ReportStatus.Completed ? { text: 'DRAFT', color: '#A8A39E', opacity: 0.4, italics: false } : {};
                  let docDefinition = {
                    content: [],
                    images: this.iconsObj,
                    styles: this.getStyles(),
                    header: this.getHeaderSection(currentReport, reportData),
                    footer: function (currentPage, pageCount) {
                      // return currentPage.toString() + ' of ' + pageCount;
                      return {
                        margin: 10,
                        columns: [
                          {
                            fontSize: 9,
                            text: [
                              {
                                text: '--------------------------------------------------------------------------' + '\n',
                                margin: [0, 20]
                              },
                              {
                                text: footerprefix + ' ' + currentPage + ' ' + footerSuffix + ' ' + pageCount,
                              }
                            ],
                            alignment: 'center'
                          }
                        ]
                      };
                    },
                    pageMargins: [12, 95, 12, 60],
                    // watermark: watermarktext,
                    pageSize: { width: 700, height: 850 }
                    ,
                    defaultStyle: {
                      font: defaultFont
                    }
                  }
                  docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getDeviceName(reportData)));
                  let filteredProductFamilyData = reportData.filter((item) => {
                    return item.ElementID == 5
                  });
                  if (filteredProductFamilyData.length > 0) {
                    docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getProductFamily(reportData)));
                  }
                  // console.log("docDefinition.content" + JSON.stringify(docDefinition.content));
                  this.attachmentData = reportData.filter((item) => item.ElementType == Enums.ElementType.ActionButtonFileUpload);
                  if (this.valueProvider.getWorkFlowGroupID() != Enums.WorkflowGroup.PressureGroup) {
                    docDefinition = this.getWorkFlowTable(allWorkFlow[0], reportData, docDefinition);
                  } else {
                    let filteredReportData = reportData.filter((item) => {
                      return item.WorkFlowID == 37 && item.ElementID != 130104 && item.ElementID != 130102 && item.ElementID != 130106 && item.ElementID != 130107 && item.ElementID != 130108;
                    })
                    let serviceInfo = this.getCommonPdfData(filteredReportData);
                    if (serviceInfo) {
                      docDefinition.content.push({ text: this.translator("SERVICE INFORMATION"), margin: [11, 0, 0, 0], color: '#234487', style: 'header' });
                      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), serviceInfo));
                    }
                  }
                  let scopeOfWork = reportData.filter((item) => {
                    return item.ElementID == 130104
                  });
                  if (scopeOfWork.length > 0) {
                    scopeOfWork[0].DisplayName = (scopeOfWork[0].DisplayName).toUpperCase();
                    let CommentSection = this.makeTableJsonForTextArea(scopeOfWork[0]);
                    docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
                  }
                  //Shivansh Subnani 01/17/2019 generatePdf for isolation flow
                  if (this.valueProvider.getWorkFlowGroupID() == Enums.WorkflowGroup.FlowIsolationGroup) {
                    docDefinition = this.generatePdfIsolation(docDefinition, reportData);
                    for (let i = 1; i < allWorkFlow.length; i++) {
                      docDefinition = this.getWorkFlowTable(allWorkFlow[i], reportData, docDefinition);
                    }
                  }
                  //Shivansh Subnani 01/17/2019 generatePdf for Actuation flow
                  if (this.valueProvider.getWorkFlowGroupID() == Enums.WorkflowGroup.ActuationGroup) {
                    docDefinition = this.generatePdfActuation(docDefinition, reportData);
                    for (let i = 1; i < allWorkFlow.length; i++) {
                      docDefinition = this.getWorkFlowTable(allWorkFlow[i], reportData, docDefinition);
                    }
                  }
                  //Shivansh Subnani 01/17/2019 generatePdf for Pressure flow
                  if (this.valueProvider.getWorkFlowGroupID() == Enums.WorkflowGroup.PressureGroup) {
                    docDefinition = this.generatePdfPressure(docDefinition, reportData, allWorkFlow);
                  }
                  pdfMake.createPdf(docDefinition).getDataUrl((dataURL) => {
                    this.printed = false;
                    let filePath = cordova.file.dataDirectory;

                    let pdfFileName: any = '';
                    if (this.currentReport.Status == Enums.ReportStatus.Completed) {
                      pdfFileName = "Report_SDR_" + currentReport.ReportID_Mobile + "_" + langCode + ".pdf";
                    }
                    else {
                      pdfFileName = "Temp_Report_SDR_" + currentReport.ReportID_Mobile + "_" + langCode + ".pdf";
                    }
                    //  let pdfFileName = (isTemp ? "Temp_" : "") + "Report_SDR_" + currentReport.ReportID_Mobile + "_" + langCode + ".pdf";
                    let filePathSuffix = isTemp ? "/temp/" : ("/reportfiles/" + currentReport.ReportID_Mobile);
                    self.logger.log(self.fileName, 'generatepdf', "Saving Temporary Report for Report #" + currentReport.ReportID_Mobile);
                    self.utilityProvider.deleteFile(filePath + filePathSuffix, pdfFileName).then(res => {
                      self.utilityProvider.saveBase64Attachment(filePath + filePathSuffix, pdfFileName, dataURL.split(",")[1], "application/pdf").then((res) => {
                        resolve("success");
                      });
                    });
                  })
                } catch (err) {
                  self.logger.log(self.fileName, 'generatepdf', "Error Creating PDF: " + err);
                  reject(err);
                }
              });
            });
          });
        });
      }).catch(err => {
        self.logger.log(self.fileName, 'generatepdf', "Error Getting Addresses: " + JSON.stringify(err));
        reject(err);
      });
    })
  }

  getDeviceName(reportData) {
    let deviceName = reportData.filter(item => {
      return item.ElementID == 130111
    })[0].Value;
    let deviceNameSection = {
      table: {
        border: this.noborderstyle,
        body: [
          [{ text: this.translator("Device Name:"), border: [false, false, false, false], fontSize: 10, bold: true, "margin": [-5, 0, 0, 0] }, { text: deviceName, border: [false, false, false, false], fontSize: 10, alignment: "left", "margin": [0, 0, 0, 3] }]
        ]
      }
    };
    return deviceNameSection;
  }

  getProductFamily(reportData) {
    let productFamily = reportData.filter(item => {
      return item.ElementID == 5
    })[0].Value;
    let productType = " ", Model = " ", Serial = " ";
    let filteredReportData = reportData.filter((item) => {
      return item.ElementID == 6 || item.ElementID == 7 || item.ElementID == 8
    })
    filteredReportData.forEach((item) => {
      if (item.ElementID == 6) {
        productType = item.DetailedValue;
      } else if (item.ElementID == 7) {
        Model = item.DetailedValue;
      } else if (item.ElementID == 8) {
        Serial = item.Value;
      }
    })

    let deviceNameSection = {
      table: {
        border: this.noborderstyle,
        body: [
          [{ text: this.translator("Product Family:"), border: [false, false, false, false], fontSize: 10, bold: true, "margin": [-5, 0, 0, 0] }, { text: productFamily, border: [false, false, false, false], fontSize: 10, alignment: "left", "margin": [0, 0, 0, 3] }, { text: this.translator("Product Type:"), border: [false, false, false, false], fontSize: 10, bold: true, "margin": [5, 0, 0, 0] }, { text: productType, border: [false, false, false, false], fontSize: 10, alignment: "left", "margin": [0, 0, 0, 3] }],
          [{ text: this.translator("Model:"), border: [false, false, false, false], fontSize: 10, bold: true, "margin": [-5, 0, 0, 0] }, { text: Model, border: [false, false, false, false], fontSize: 10, alignment: "left", "margin": [0, 0, 0, 3] }, { text: this.translator("Serial #:"), border: [false, false, false, false], fontSize: 10, bold: true, "margin": [5, 0, 0, 0] }, { text: Serial, border: [false, false, false, false], fontSize: 10, alignment: "left", "margin": [0, 0, 0, 3] }]
        ]
      }
    };
    return deviceNameSection;
  }

  getAccordionData(docDefinition, reportData) {
    // docDefinition.content.push({ text: this.translator('') });
    let filteredReportData = reportData.filter((item) => {
      return item.ElementType != Enums.ElementType.ListView && item.LookupID != 30017
    })
    docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getAsFoundAsLeftData(filteredReportData)));
    return docDefinition;
  }

  getAsFoundAsLeftData(reportData) {
    let table = { columns: [] };
    try {
      let rows = [];
      let asFoundLeftData = [], AsFoundElementsData = [], AsLeftElementsData = [], AsFoundAccordionItems = [], AsLeftAccordionItems = [];
      reportData.forEach((item) => {
        if (item.WorkFlowID == 9 || item.WorkFlowID == 36) {
          asFoundLeftData.push(item);
          if (item.WorkFlowID == 9) {
            if (item.ElementType == Enums.ElementType.Accordion) AsFoundAccordionItems.push(item);
            AsFoundElementsData.push(item);
          } else {
            if (item.ElementType == Enums.ElementType.Accordion) AsLeftAccordionItems.push(item);
            AsLeftElementsData.push(item);
          }
        }
      });
      AsFoundAccordionItems.forEach((parentAsFoundElement, index) => {
        let actuationTable = this.getSubTableIsolation(index, AsFoundAccordionItems.length - 1);
        let hasHeader = true;
        let parentAsLeftElement = AsLeftAccordionItems.filter(item => item.Value == parentAsFoundElement.Value);
        let parentAsLeftRDID_Mobile = parentAsLeftElement.length > 0 ? parentAsLeftElement[0].RDID_Mobile : 0;
        let AsFoundLeftAccordionElements = asFoundLeftData.filter(item => {
          return ((item.ParentID_Mobile == parentAsFoundElement.RDID_Mobile) && item.ElementType != Enums.ElementType.ActionButtonFileUpload);
        });
        AsFoundLeftAccordionElements.forEach((item, index) => {
          let headingRow: any[] = []
          let asFoundValue = item.Value;
          let asleftElement: any = this.getAsleftValueforAccordion(parentAsLeftRDID_Mobile, item, AsLeftElementsData)
          let asLeftValue = asleftElement.length > 0 ? asleftElement[0].Value : " ";
          let constructionChanged = reportData.filter((item) => { return item.ElementID == 22008 })[0];
          // console.log(constructionChanged);
          let isConstructionChanged = false;
          if (constructionChanged) {
            isConstructionChanged = constructionChanged.DetailedValue == "Yes" ? true : false;
          }
          if (this.isNotNull(asFoundValue) || this.isNotNull(asLeftValue)) {
            let hasValueChanged = item.Value != asLeftValue ? true : false;
            headingRow.push(this.getBlankColumn(' '));
            headingRow.push(this.getConstructionValueWithBorder(this.translator(item.DisplayName), false, "Border"));
            headingRow.push(this.getConstructionValueWithBorder(item.Value, false, "Border"))
            headingRow.push(this.getBlankColumn(' '))
            headingRow.push(this.getConstructionValueWithBorder(this.translator(item.DisplayName), false, "Border"))
            headingRow.push(this.getConstructionValueWithBorder(isConstructionChanged ? asLeftValue : item.Value, isConstructionChanged ? hasValueChanged : false, "Border"))
            if (hasHeader) {
              headingRow[0].text = parentAsFoundElement.Value;
              hasHeader = false
            }
            actuationTable.table.body.push(headingRow);
          }
        })
        if (actuationTable.table.body.length > 0) {
          if (index == 0) actuationTable.table.body.unshift([this.getBlankColumn(' '), { text: this.translator('CONSTRUCTION AS FOUND'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", colSpan: 2, border: [false, false, false, false], margin: [10, 3, 0, 3] }, this.getBlankColumn(''), this.getBlankColumn(' '), { text: this.translator('CONSTRUCTION AS LEFT'), color: "#045B83", border: [false, false, false, false], bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, this.getBlankColumn('')]);
          rows.push(actuationTable);
        }
      })
      table.columns.push(rows);
      return table;
    } catch (error) {
      this.logger.log(this.fileName, "getAsFoundAsLeftData", error);
    }
  }

  getAsleftValueforAccordion(parentAsLeftRDID_Mobile, asFoundElement, AsLeftElementsData) {
    let asLeftElement = AsLeftElementsData.filter((item) => {
      return item.ParentID_Mobile == parentAsLeftRDID_Mobile && item.DisplayName == asFoundElement.DisplayName
    });
    return asLeftElement;
  }

  getSolutionData(docDefinition, reportData) {
    docDefinition.content.push({ text: this.translator('SOLUTIONS'), color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", border: this.noborderstyle });
    let filteredReportData = reportData.filter((item) => {
      return item.WorkFlowID == 12 && item.ParentID_Mobile == null && item.ElementType != Enums.ElementType.Accordion && item.ElementType != Enums.ElementType.TextArea
    })
    if (filteredReportData.length > 0) {
      let body = this.getBodyFromElements(filteredReportData);
      if (body.length > 0) {
        docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSection(), body), "widths": ["50%", "50%"], layout: 'noBorders' });
        docDefinition.content.push({ text: this.translator('') });
      }
    }
    let filteredSolutionData = reportData.filter((item) => {
      return item.WorkFlowID == 12
    })
    docDefinition.content.push({ text: this.translator('') });
    docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getSolutionTable(filteredSolutionData)));
    let dataWithTextArea = reportData.filter((item => {
      return item.WorkFlowID == 12 && item.ParentID_Mobile == null && item.ElementType != Enums.ElementType.Accordion && item.ElementType == Enums.ElementType.TextArea
    }))
    if (dataWithTextArea.length > 0) {
      dataWithTextArea[0].DisplayName = this.translator("SOLUTION COMMENTS");
      let CommentSection = this.makeTableJsonForTextArea(dataWithTextArea[0]);
      docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
    }
    return docDefinition;
  }

  getTestData(docDefinition, reportData) {
    let filteredReportData = reportData.filter((item) => {
      return item.WorkFlowID == 13 && item.ParentID_Mobile == null && item.ElementType != Enums.ElementType.Accordion && item.ElementType != Enums.ElementType.TextArea
    })
    if (filteredReportData.length > 0) {
      // docDefinition.content.push({ text: this.translator('TEST DATA'), color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", border: this.noborderstyle });
      let body = this.getBodyFromElements(filteredReportData);
      if (body.length > 0) {
        // console.log("body"+JSON.stringify(body));
        body.unshift([this.getTestDataTable('TEST DATA'), this.getTestDataTable('')])
        // docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSection(), body), "widths": ["50%", "50%"], layout: 'noBorders' });
        docDefinition.content.push({ unbreakable: true, "table": this.addBodyToTable(this.getContentSection(), body), "widths": ["50%", "50%"], layout: 'noBorders', dontBreakRows: true });
        docDefinition.content.push({ text: this.translator('') });
      }
    }
    let filteredTestData = reportData.filter((item) => {
      return item.WorkFlowID == 13
    })
    docDefinition.content.push({ text: this.translator('') });
    docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getSolutionTable(filteredTestData)));
    // let dataWithTextArea = reportData.filter((item => {
    //   return item.WorkFlowID == 13 && item.ParentID_Mobile == null && item.ElementType != Enums.ElementType.Accordion && item.ElementType == Enums.ElementType.TextArea
    // }))
    // if (dataWithTextArea.length > 0) {
    //   dataWithTextArea[0].DisplayName = this.translator("TEST DATA COMMENTS");
    //   let CommentSection = this.makeTableJsonForTextArea(dataWithTextArea[0]);
    //   docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
    // }
    return docDefinition;
  }
  getFinalInspectionData(docDefinition, reportData) {
    docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getFinalInspection(reportData)));
    return docDefinition;
  }

  getTestDataTable(value) {
    let table = {
      "table": {
        "body": [[
          { text: this.translator(value), color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", border: this.noborderstyle },
          { text: " ", color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", border: this.noborderstyle }]],
        "widths": ["50%",
          "50%"]
      },
      "layout": "noBorders"
    }
    return table;
  }

  checkIfThumbnailCreated(folderId) {
    let filepath = cordova.file.dataDirectory;
    return new Promise((resolve, reject) => {
      if (this.allAttachmentList.length != 0) {
        for (let i = 0; i < this.allAttachmentList.length; i++) {
          let attachmentName = this.allAttachmentList[i].Value;
          this.utilityProvider.checkFileIfExist(filepath + '/reportfiles/' + folderId + "/thumbnails/", attachmentName).then((thumbnailResult) => {
            if (thumbnailResult) {
              //console.log("here");
              this.allAttachmentList[i].isThumbnailExist = true;
              resolve(true);
            } else {
              this.utilityProvider.checkFileIfExist(filepath + '/reportfiles/' + folderId + "/", attachmentName).then((largeImageResult) => {
                if (largeImageResult) {
                  this.allAttachmentList[i].isThumbnailExist = false;
                  resolve(true);
                }
              });
            }
          });
        }
      }
      resolve(true);
    });
  }

  getBase64Attachment(folederId) {
    let promise = [];
    let filepath = cordova.file.dataDirectory;
    let iconType;
    let icons: any = {};
    let promiseIcon = [];
    return new Promise((resolve, reject) => {
      if (this.allAttachmentList.length != 0) {
        for (let i = 0; i < this.allAttachmentList.length; i++) {
          let attachmentName = this.allAttachmentList[i].Value;
          let flowName = this.allAttachmentList[i].FlowName;
          let filetype = attachmentName.split(".")[1];
          if (this.allAttachmentList[i].File_Type.indexOf('image') > -1) {
            // -- 02/05/2019 -- Mayur letshney -- create pdf by using thumbnails for attachment
            promise.push(this.getAttachmentBase64(filepath, folederId, flowName, attachmentName));
            //promise.push(this.utilityProvider.getBase64(filepath + "/reportfiles/" + folederId + "/" + flowName + "/thumbnails", "thumb_" + attachmentName));
            // if (this.platform.is('ios')) {
            //   promise.push(this.utilityProvider.getBase64(filepath + "/reportfiles/" + folederId + "/" + flowName, attachmentName));
            // } else {
            //   promise.push(this.utilityProvider.getBase64(filepath + "/reportfiles/" + folederId + "/" + flowName + "/thumbnails", "thumb_" + attachmentName));
            // }
          }
          else {
            let supportedTypes = ["pdf", "xlsx", "txt", "ppt", "doc", "docx", "xls", "pptx"];
            if (supportedTypes.indexOf(filetype) > -1) {
              if (filetype.endsWith("x")) {
                filetype = filetype.substring(0, filetype.length - 1);
              }
              iconType = filetype;
            } else {
              iconType = "unknown";
            }
            promise.push(Promise.resolve(iconType));
            if (!icons[iconType]) {
              icons[iconType] = true;
              //08/25/2018 Zohaib Khan:resolving type to fetch the icon base64 from super image
              promiseIcon.push(this.getIconBase64(iconType));
            }
          }
        }
        Promise.all(promise).then((imageResult) => {
          Promise.all(promiseIcon).then((iconResult) => {
            for (let j = 0; j < iconResult.length; j++) {
              let key = Object.keys(iconResult[j])[0];
              this.iconsObj[key] = iconResult[j][key];
            }
            for (let i = 0; i < this.allAttachmentList.length; i++) {
              if(imageResult[i]) this.allAttachmentList[i].base64 = imageResult[i];
            }
            resolve(true);
          });
        }).catch((error) => {
          reject(error);
        });
      }
      else {
        resolve(false);
      }
    });

  }

  getAttachmentBase64(filepath, folederId, flowName, attachmentName){
    return new Promise((resolve, reject) => {
      this.utilityProvider.getBase64(filepath + "/reportfiles/" + folederId + "/" + flowName + "/thumbnails", attachmentName).then(res => {
        resolve(res)
      }).catch(err => {
        this.logger.log(this.fileName, "getAttachmentBase64", "Error: " + JSON.stringify(err));
        resolve(false);
      })
    })
  }

  getIconBase64(type) {
    let path = cordova.file.dataDirectory + "/icons/";
    return new Promise((resolve, reject) => {
      this.utilityProvider.getBase64(path, type + ".png").then((res) => {
        let result: any = {};
        result[type] = res;
        //console.log(result);
        resolve(result);
      });
    });
  }

  // 01-21-2019 -- Mansi Arora -- get base64 of icons for detailed notes pdf
  getDetailedNotesIconBase64(type) {
    let path = cordova.file.dataDirectory + "/icons/";
    return new Promise((resolve, reject) => {
      this.utilityProvider.getBase64(path, type + ".png").then((res) => {
        let result = res;
        resolve(result);
      });
    });
  }

  getWorkFlowTable(workFlow, allreportData, docDefinition) {
    //TODO By ZOHAIB Change Cus. Name to Cust.
    let reportData = allreportData.filter((item) => (item.WorkFlowID == workFlow.WorkFlowID) && item.ElementType != Enums.ElementType.ActionButtonFileUpload && item.ElementType != Enums.ElementType.CheckBox && item.Value && item.Value != '');
    // this.attachmentData = allreportData.filter((item) => item.WorkFlowID == workFlow.WorkFlowID && item.ElementType == Enums.ElementType.ActionButtonFileUpload);
    if (reportData.length > 0) {
      //14-01-2019 Shivansh Subnani
      //Neglecting those WorkflowIDs for which we need to show the data as accordion or listview
      let AccordionPageIDs = [9, 10, 11, 36, 14, 2, 50, 4, 19, 23, 24, 15, 6, 12, 3, 13, 51, 5, 18, 22, 58, 56, 57, 59, 60, 52, 53, 54];
      let filteredReportData = reportData.filter((item) => {
        return AccordionPageIDs.indexOf(item.WorkFlowID) == -1
      });

      if (filteredReportData.length > 0) {
        if (workFlow.WorkFlowID == 37) {
          filteredReportData = filteredReportData.filter((item) => {
            return item.ElementID != 130104 && item.ElementID != 6 && item.ElementID != 7 && item.ElementID != 8 && item.ElementID != 130102 && item.ElementID != 130106
          })
        }
        let body = this.getBodyFromElements(filteredReportData);
        if (body.length > 0) {
          //01/24/2019 Zohaib Khan: Changing Label from New Report to Service Info. Write now its static need to discuss with Shivansh about verbage.
          if (workFlow.HeaderTitle == "New Report") {
            workFlow.HeaderTitle = "Service Information";
          }
          docDefinition.content.push({ text: this.translator(workFlow.HeaderTitle), color: '#234487', style: 'header' });
          docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSection(), body), "widths": ["50%", "50%"], layout: 'noBorders' });
        }
      }
    }

    return docDefinition;
  }

  arr: any = [];

  getAccordionTable(reportData) {
    // console.log(JSON.stringify(reportData))
    let table = { columns: [] };
    let filteredAsFoundData;
    let filteredAsLeftData;
    let asFoundValue: any = '';
    let asLeftValue: any = '';
    let parentAsFoundHeading = true;
    let parentAsLeftHeading = true;
    let WorkFlowGroupID = this.valueProvider.getWorkFlowGroupID();
    if (this.valueProvider.getWorkFlowGroupID() == Enums.WorkflowGroup.FlowIsolationGroup) {
      filteredAsFoundData = reportData.filter((item) => {
        return item.WorkFlowID == 9
      })
    } else if (this.valueProvider.getWorkFlowGroupID() == Enums.WorkflowGroup.ActuationGroup) {
      filteredAsFoundData = reportData.filter((item) => {
        return item.WorkFlowID == 4
      })
    }
    try {
      let rows = [];
      let leftinnerTable = {
        table: {
          widths: ['25%', '45%', '30%'],
          body: []
        },
        layout: {
          layout: 'noBorders',
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
          }
        },
      };
      let asFoundAccordionData = filteredAsFoundData.filter((item) => {
        return item.ElementType == Enums.ElementType.Accordion
      });
      let asFoundComments = filteredAsFoundData.filter((item) => {
        return item.ElementType == Enums.ElementType.TextArea
      });

      if (asFoundAccordionData.length > 0 || asFoundComments.length > 0) {
        for (let k = 0; k < asFoundAccordionData.length; k++) {
          let subHeadingRow = true;
          for (let i = 0; i < filteredAsFoundData.length; i++) {
            if (asFoundAccordionData[k].RDID_Mobile == filteredAsFoundData[i].ParentID_Mobile) {
              asFoundValue = filteredAsFoundData[i].Value;
              let isValueDifferent = this.matchAsFoundWithAsLeftData(asFoundAccordionData[k], filteredAsFoundData[i], reportData, false);
              let isBothBlank = this.matchAsFoundWithAsLeftData(asFoundAccordionData[k], filteredAsFoundData[i], reportData, true);
              if (subHeadingRow) {
                if (!isBothBlank || WorkFlowGroupID == 1) {
                  if (parentAsFoundHeading) {
                    leftinnerTable.table.body.push([this.getBlankColumn(' '), { text: 'CONSTRUCTION(AS FOUND)', color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", border: this.noborderstyle }, this.getBlankColumn(' ')]);
                    parentAsFoundHeading = false;
                  }
                  leftinnerTable.table.body.push([this.getBlankColumn(asFoundAccordionData[k].Value), this.getConstructionLabel(this.translator(filteredAsFoundData[i].DisplayName), isValueDifferent), this.getConstructionValue(filteredAsFoundData[i].Value, isValueDifferent)]);
                  subHeadingRow = false;
                }
              } else {
                if (!isBothBlank || WorkFlowGroupID == 1) {
                  leftinnerTable.table.body.push([this.getBlankColumn(' '), this.getConstructionLabel(this.translator(filteredAsFoundData[i].DisplayName), isValueDifferent), this.getConstructionValue(filteredAsFoundData[i].Value, isValueDifferent)]);
                }
              }
            }
          }
          if (asFoundValue && asFoundValue != '') {
            leftinnerTable.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' ')]);
          }
        }
        if (asFoundComments.length > 0) {
          let item = asFoundComments[0];
          if (item.Value && item.Value != '') {
            leftinnerTable.table.body.push([this.getBlankColumn(' '), this.getColumnForTextAreaLabel('AS FOUND COMMENTS'), this.getBlankColumn(' ')]);
            leftinnerTable.table.body.push([this.getBlankColumn(' '), this.getColumnForTextArea(item.Value), this.getBlankColumn(' ')]);
          }
        }
        if (leftinnerTable.table.body.length == 0) {
          leftinnerTable.table.body.push([]);
        }
        rows.push(leftinnerTable);
        table.columns.push(rows);
      }
      rows = [];
      let rightinnerTable = {
        table: {
          widths: ['0.5%', '45%', '45%'],
          body: []
        },
        layout: {
          layout: 'noBorders',
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#C9D9A9' : '#DEEBC3';
          },
          border: [false, false, false, false]
        },
      };
      if (this.valueProvider.getWorkFlowGroupID() == Enums.WorkflowGroup.FlowIsolationGroup) {
        filteredAsLeftData = reportData.filter((item) => {
          return item.WorkFlowID == 36
        })
      }

      let asLeftAccordionData = filteredAsLeftData.filter((item) => {
        return item.ElementType == Enums.ElementType.Accordion
      });
      let asLeftComments = filteredAsLeftData.filter((item) => {
        return item.ElementType == Enums.ElementType.TextArea
      });
      let asLeftData = [];
      for (let i = 0; i < asFoundAccordionData.length; i++) {
        for (let j = 0; j < asLeftAccordionData.length; j++) {
          if (asFoundAccordionData[i].Value == asLeftAccordionData[j].Value) {
            asLeftData.push(asLeftAccordionData[j])
          }
        }
      }
      if (asLeftData.length > 0 || asLeftComments.length > 0) {
        for (let k = 0; k < asLeftData.length; k++) {
          for (let i in filteredAsLeftData) {
            if (filteredAsLeftData[i].ParentID_Mobile == asLeftData[k].RDID_Mobile) {
              asLeftValue = filteredAsLeftData[i].Value;
              //if (filteredAsLeftData[i].Value && filteredAsLeftData[i].Value != '') {
              let isValueDifferent = this.matchAsLeftWithAsFoundData(asLeftData[k], filteredAsLeftData[i], reportData, false);
              let isBothBlank = this.matchAsLeftWithAsFoundData(asLeftData[k], filteredAsLeftData[i], reportData, true);
              if (!isBothBlank) {
                if (parentAsLeftHeading) {
                  rightinnerTable.table.body.push([this.getBlankColumn(' '), { text: this.translator('SOLUTION'), color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", border: this.noborderstyle }, this.getBlankColumn(' ')]);
                  parentAsLeftHeading = false
                }
                rightinnerTable.table.body.push([this.getBlankColumn(' '), this.getConstructionLabel(this.translator(filteredAsLeftData[i].DisplayName), isValueDifferent), this.getConstructionValue(filteredAsLeftData[i].Value, isValueDifferent)]);
              }
            }
          }
          if (asLeftValue && asLeftValue != '') {
            rightinnerTable.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' ')]);
          }
        }
        if (asLeftComments.length > 0) {
          let item = asLeftComments[0];
          if (item.Value && item.Value != '') {
            rightinnerTable.table.body.push([this.getBlankColumn(' '), this.getColumnForTextAreaLabel(this.translator('SOLUTION COMMENTS')), this.getBlankColumn(' ')]);
            rightinnerTable.table.body.push([this.getBlankColumn(' '), this.getColumnForTextArea(item.Value), this.getBlankColumn(' ')]);
          }
        }
        if (rightinnerTable.table.body.length == 0) {
          rightinnerTable.table.body.push([]);
        }
        rows.push(rightinnerTable);
        table.columns.push(rows);
      }
    } catch (err) {
      this.logger.log(this.fileName, 'getConstructionTable', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getSolutionTable(filteredSolutionData) {
    let table = { columns: [] };
    let solutionValue: any = '';
    try {
      let rows = [];

      let solutionData = filteredSolutionData.filter((item) => {
        return item.ElementType == Enums.ElementType.Accordion
      });
      if (solutionData.length > 0) {
        // leftinnerTable.table.body.push([this.getBlankColumn(' '), { text: 'CONSTRUCTION(AS FOUND/LEFT)', color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", border: this.noborderstyle }, this.getBlankColumn(' ')]);
        for (let k = 0; k < solutionData.length; k++) {
          let leftinnerTable = {
            unbreakable: true,
            table: {
              dontBreakRows: true,
              widths: ['11%', '45%', '30%'],
              body: []
            },
            layout: {

              hLineWidth: function (i, node) {
                return (i === 0) || i === node.table.body.length ? (k === 0 || k === solutionData.length - 1) ? 1.4 : 0.7 : 0;
              },
              vLineWidth: function (i, node) {
                return (i === 1 || i === node.table.widths.length) ? 1.4 : 0;
              },
              hLineColor: function (i, node) {
                return (i === 0) || i === node.table.body.length ? '#4d8dd1' : '';
              },
              vLineColor: function (i, node) {
                return (i === 1 || i === node.table.widths.length) ? '#4d8dd1' : '';
              },
              fillColor: function (rowIndex, node, columnIndex) {
                return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
              }
            },
          };
          let subHeadingRow = true;
          for (let i = 0; i < filteredSolutionData.length; i++) {
            if (solutionData[k].RDID_Mobile == filteredSolutionData[i].ParentID_Mobile) {
              solutionValue = filteredSolutionData[i].Value;
              if (filteredSolutionData[i].Value && filteredSolutionData[i].Value != '') {
                if (subHeadingRow) {
                  leftinnerTable.table.body.push([this.getBlankColumn(solutionData[k].Value), this.getConstructionLabelForFindingsWithBorder(this.translator(filteredSolutionData[i].DisplayName), false, "Border"), this.getConstructionValueWithBorder(filteredSolutionData[i].Value, false, "Border")]);
                  subHeadingRow = false;
                } else {
                  leftinnerTable.table.body.push([this.getBlankColumn(' '), this.getConstructionLabelForFindingsWithBorder(this.translator(filteredSolutionData[i].DisplayName), false, "Border"), this.getConstructionValueWithBorder(filteredSolutionData[i].Value, false, "Border")]);
                }
              }
            }
          }
          if (solutionValue && solutionValue != '') {
            // leftinnerTable.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' ')]);
          }
          if (leftinnerTable.table.body.length == 0) {
            leftinnerTable.table.body.push([]);
          }
          rows.push(leftinnerTable);
        }

        table.columns.push(rows);
      }
    } catch (err) {
      this.logger.log(this.fileName, 'getSolutionTable', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  matchAsFoundWithAsLeftData(asFoundSubHeading, filteredAsFoundData, reportData, checkForBlank) {
    let isValueDifferent = false;
    let bothBlank = false;
    let filteredAsLeftData;
    try {
      if (this.valueProvider.getWorkFlowGroupID() == Enums.WorkflowGroup.FlowIsolationGroup) {
        filteredAsLeftData = reportData.filter((item) => {
          return item.WorkFlowID == 36
        })
      }
      if (filteredAsLeftData.length > 0) {
        let asLeftData = filteredAsLeftData.filter((item) => {
          return item.Value == asFoundSubHeading.Value
        });
        if (asLeftData.length > 0) {
          let filteredData = filteredAsLeftData.filter(item => {
            return item.ParentID_Mobile == asLeftData[0].RDID_Mobile;
          });
          if (filteredData.length > 0) {
            let asLeftItem = filteredData.map(item => item.DisplayName).indexOf(filteredAsFoundData.DisplayName);
            if (checkForBlank) {
              if (!filteredAsFoundData.Value && !filteredData[asLeftItem].Value) {
                bothBlank = true;
              }
              return bothBlank
            }
            else {
              if (filteredAsFoundData.Value != filteredData[asLeftItem].Value) {
                isValueDifferent = true;
              }
              return isValueDifferent
            }
          }
          else {
            bothBlank = true;
            return bothBlank
          }
        } else {
          bothBlank = true;
          return bothBlank
        }
      } else {
        bothBlank = true;
        return bothBlank
      }
    } catch (err) {
      this.logger.log(this.fileName, 'matchAsFoundWithAsLeftData', "Error: " + JSON.stringify(err));
      return false
    }
  }

  matchAsLeftWithAsFoundData(asLeftSubHeading, filteredAsLeftData, reportData, checkForBlank) {
    let isValueDifferent = false;
    let bothBlank = false;
    let filteredAsFoundData;
    try {
      if (this.valueProvider.getWorkFlowGroupID() == Enums.WorkflowGroup.FlowIsolationGroup) {
        filteredAsFoundData = reportData.filter((item) => {
          return item.WorkFlowID == 9
        })
      } else if (this.valueProvider.getWorkFlowGroupID() == Enums.WorkflowGroup.ActuationGroup) {
        filteredAsFoundData = reportData.filter((item) => {
          return item.WorkFlowID == 4
        })
      }
      let asFoundData = filteredAsFoundData.filter((item) => {
        return item.Value == asLeftSubHeading.Value;
      });
      if (asFoundData.length > 0) {
        let filteredData = filteredAsFoundData.filter(item => {
          return item.ParentID_Mobile == asFoundData[0].RDID_Mobile;
        });
        if (filteredData.length > 0) {
          let asFoundItem = filteredData.map(item => item.DisplayName).indexOf(filteredAsLeftData.DisplayName);
          if (checkForBlank) {
            if (!filteredAsLeftData.Value && !filteredData[asFoundItem].Value) {
              bothBlank = true;
            }
            return bothBlank
          } else {
            //if (filteredData[asFoundItem].Value && filteredData[asFoundItem].Value != '') {
            if (filteredAsLeftData.Value != filteredData[asFoundItem].Value) {
              isValueDifferent = true;
            }
            // }
            return isValueDifferent
          }
        }
      }
    } catch (err) {
      this.logger.log(this.fileName, 'matchAsLeftWithAsFoundData', "Error: " + JSON.stringify(err));
      return false
    }
    return false;
  }
  //Shivansh Subnani 01/17/2019 function to display final inspection  data on pdf
  getFinalInspection(reportData) {
    let table = { columns: [] };
    let filteredFindingsData;
    if (this.valueProvider.getWorkFlowGroupID() == Enums.WorkflowGroup.FlowIsolationGroup) {
      filteredFindingsData = reportData.filter((item) => {
        return item.WorkFlowID == 15
      })
    }
    try {
      let rows = [];
      // let leftinnerTable = {
      //   table: {
      //     widths: ['15%', '22%', '22%', '0.2%', '22%', '22%'],
      //     body: []
      //   },
      //   layout: {
      //     layout: 'noBorders',
      //     fillColor: function (rowIndex, node, columnIndex) {
      //       return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
      //     }
      //   },
      // };
      let findingsData = filteredFindingsData.filter((item) => {
        return item.ElementType == Enums.ElementType.Accordion
      });
      // let subTableforHeading = this.getNewTable();
      // rows.push(subTableforHeading);
      if (findingsData.length > 0) {

        for (let k = 0; k < findingsData.length; k++) {
          let subHeadingRow = true;
          let subTableforItems = this.getNewTable();
          if (k == 0) {
            subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          }
          let sortedData = this.getFindingsAccordionArray(filteredFindingsData, findingsData[k]);
          if (sortedData.leftData.length > 0) {
            for (let i = 0; i < sortedData.leftData.length; i++) {
              let row = [];
              row.push(subHeadingRow ? this.getBlankColumn(findingsData[k].Value) : this.getBlankColumn(""));
              if (sortedData.leftData[i].ElementType != Enums.ElementType.RadioButton) {
                row.push(this.getLabelColumn(this.translator(sortedData.leftData[i].DisplayName)));
                row.push(this.getValueColumn(sortedData.leftData[i].Value))
              }
              if (sortedData.leftData[i].ElementType == Enums.ElementType.RadioButton) {
                row.push(this.getLabelColumn(this.translator(sortedData.leftData[i].DisplayName)));
                row.push(this.getValueColumn(this.isNotNull(sortedData.leftData[i].DetailedValue) ? sortedData.leftData[i].DetailedValue : " "));
              }
              row.push(this.getBlankColumn(" "));
              if (sortedData.rightData[i].ElementType != Enums.ElementType.RadioButton) {
                row.push(this.getLabelColumn(this.translator(sortedData.rightData[i].DisplayName)));
                row.push(this.getValueColumn(sortedData.rightData[i].Value))
              }
              if (sortedData.rightData[i].ElementType == Enums.ElementType.RadioButton) {
                row.push(this.getLabelColumn(this.translator(sortedData.rightData[i].DisplayName)));
                row.push(this.getValueColumn(this.isNotNull(sortedData.rightData[i].DetailedValue) ? sortedData.rightData[i].DetailedValue : " "));
              }
              if (row.length == 6) {
                subTableforItems.table.body.push(row);
                subHeadingRow = false;
              }
              if (i == sortedData.leftData.length - 1 && k != findingsData.length) {
                subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
              }
            }
            if (subTableforItems.table.body.length > 0) {
              rows.push(subTableforItems);
            }
          }
        }

        table.columns.push(rows);
      }

    } catch (err) {
      this.logger.log(this.fileName, 'getConstructionTable', "Error: " + JSON.stringify(err));
    }
    return table;
  }
  //Shivansh Subnani 01/17/2019 function to display Findings data on pdf
  // getFindingsTable(reportData, docDefinition) {
  //   let table = { columns: [] };
  //   try {
  //     let rows = [];
  //     let findingsData = [], findingsAccordionItems = [];
  //     reportData.forEach((item) => {
  //       if (item.WorkFlowID == 11) {
  //         findingsData.push(item);
  //         if (item.ElementType == Enums.ElementType.Accordion) findingsAccordionItems.push(item);
  //       }
  //     });
  //     findingsAccordionItems.forEach((parentFindingsElement, index) => {
  //       let findingsNotes = [];
  //       let subTableforItems = this.getSubTableForFindings();
  //       if (index == 0) {
  //         subTableforItems.table.body.push([this.getTableHeader('FINDINGS', 2), this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' ')]);
  //         subTableforItems.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: this.translator('FOUND'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "center" }, { text: this.translator('RECOMMENDED ACTION'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "center" }]);
  //       }
  //       let findingsTextField = [];
  //       let findingsAccordionListItems = findingsData.filter(item => {
  //         return item.ParentID_Mobile == parentFindingsElement.RDID_Mobile && item.ElementType == Enums.ElementType.AccordionListView;
  //       });
  //       findingsAccordionListItems.forEach((subParentFindingElement, i) => {
  //         let row: any[] = [];
  //         row.push(i == 0 ? this.getBlankColumn(parentFindingsElement.Value) : this.getBlankColumn('')),
  //           row.push(this.getConstructionValue(subParentFindingElement.Value, false)),
  //           row.push(this.getConstructionLabelForFindings(' ', false)),
  //           row.push(this.getConstructionLabelForFindings(' ', false))

  //         let findingsAccordionListElements = findingsData.filter(item => {
  //           return (item.ParentID_Mobile == subParentFindingElement.RDID_Mobile);
  //         });

  //         findingsAccordionListElements.forEach((item) => {
  //           let index = 0;
  //           switch (item.DisplayName) {
  //             case "Found":
  //               index = 2;
  //               break;
  //             case "Recommended Action":
  //               index = 3;
  //               break;
  //           }
  //           if (index != 0 && row[index] && item.Value) row[index].text = item.Value;
  //         });
  //         if (row.filter((item) => item.text != ' ').length > 1) subTableforItems.table.body.push(row);
  //       })
  //       let findingsAccordionElements = findingsData.filter((item) => {
  //         return item.ParentID_Mobile == parentFindingsElement.RDID_Mobile && item.ElementType != Enums.ElementType.AccordionListView
  //       })
  //       findingsAccordionElements.forEach((item) => {
  //         if (item.ElementType == Enums.ElementType.TextArea) {
  //           // findingsNotes = [this.getBlankColumn(' '), this.getNotesboxLabel(this.translator(item.DisplayName)), this.getNotesbox(item.Value)];
  //           findingsNotes = item.Value;
  //         } else if (item.ElementType == Enums.ElementType.TextField) {
  //           findingsTextField = [this.getBlankColumn(' '), this.getConstructionValue(this.translator(item.DisplayName), false), this.getCommentsbox(item.Value)]
  //         }
  //       })
  //       if (findingsTextField.length > 0) subTableforItems.table.body.push(findingsTextField);
  //       //   if (findingsNotes.length > 0) subTableforItems.table.body.push(findingsNotes);
  //       if (index == 0) {
  //         if (subTableforItems.table.body.length > 0) {
  //           subTableforItems.table.body[2][4] = this.getNotesbox(findingsNotes, (subTableforItems.table.body.length - 2));
  //         }
  //       } else {
  //         if (subTableforItems.table.body.length > 0) {
  //           subTableforItems.table.body[0][4] = this.getNotesbox(findingsNotes, (subTableforItems.table.body.length - 1));
  //         }
  //       }

  //       if (subTableforItems.table.body.length > 0) {
  //         // console.log(subTableforItems.table.body);
  //         rows.push(subTableforItems);
  //       }
  //     });
  //     // rows.push(findingTable);
  //     table.columns.push(rows);
  //   } catch (err) {
  //     this.logger.log(this.fileName, 'getFindingsTable', "Error: " + err.message);
  //   }
  //   return table;
  // }

  /**
   *
   *Commented Code for rowSpan Issue
   * @param {*} reportData
   * @param {*} docDefinition
   * @returns
   * @memberof CreateSdrProvider
   */
  getFindingsTable(reportData, docDefinition) {
    let table = { columns: [] };
    try {
      let rows = [];
      let findingsData = [], findingsAccordionItems = [];
      reportData.forEach((item) => {
        if (item.WorkFlowID == 11) {
          findingsData.push(item);
          if (item.ElementType == Enums.ElementType.Accordion) findingsAccordionItems.push(item);
        }
      });
      // findingTable.table.body.push([this.getTableHeader('FINDINGS'), this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' ')]);

      // findingTable.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: this.translator('FOUND'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "left" }, { text: this.translator('RECOMMENDED ACTION'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "left" }]);
      findingsAccordionItems.forEach((parentFindingsElement, index) => {
        let findingsNotes = [];
        let headerRow = true;
        let subTableforItems = this.getSubTableForFindings(true, index);
        if (index == 0) {
          subTableforItems.table.body.push([this.getTableHeader('FINDINGS', 2), this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' ')]);
          subTableforItems.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: this.translator('FOUND'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "center" }, { text: this.translator('RECOMMENDED ACTION'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "center" }, { text: this.translator('NOTES'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "center" }]);
          // } else if (index != findingsAccordionItems.length) {
          //   subTableforItems.table.body.push([this.getTableHeader(''), this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' ')]);
        }
        let findingsTextField = [];
        let findingsAccordionListItems = findingsData.filter(item => {
          return item.ParentID_Mobile == parentFindingsElement.RDID_Mobile && item.ElementType == Enums.ElementType.AccordionListView;
        });
        findingsAccordionListItems.forEach((subParentFindingElement, i) => {
          let row: any[] = [];
          row.push(this.getBlankColumn('')),
            row.push(this.getConstructionValueWithBorder(subParentFindingElement.Value, false, "Border")),
            row.push(this.getConstructionLabelForFindingsWithBorder(' ', false, "Border")),
            row.push(this.getConstructionLabelForFindingsWithBorder(' ', false, "Border")),
            row.push(this.getConstructionLabelForFindingsWithBorder(' ', false, "Border"))
          let findingsAccordionListElements = findingsData.filter(item => {
            return (item.ParentID_Mobile == subParentFindingElement.RDID_Mobile) && item.ElementType != "AccordionListView";
          });

          findingsAccordionListElements.forEach((item) => {
            let index = 0;
            switch (item.DisplayName) {
              case "Found":
                index = 2;
                break;
              case "Recommended Action":
                index = 3;
                break;
            }
            if (index != 0 && row[index] && item.Value) row[index].text = item.Value;
          });
          if (row.filter((item) => item.text != ' ').length > 1) {
            if (row[2].text != ' ' || row[3].text != ' ' || row[4].text != ' ') {
              if (headerRow) {
                row[0].text = parentFindingsElement.Value;
                headerRow = false;
              }
              subTableforItems.table.body.push(row);
            }
          }

        })
        let findingsAccordionElements = findingsData.filter((item) => {
          return item.ParentID_Mobile == parentFindingsElement.RDID_Mobile && item.ElementType != Enums.ElementType.AccordionListView
        })
        findingsAccordionElements.forEach((item) => {
          if (item.ElementType == Enums.ElementType.TextArea) {
            findingsNotes = item.Value;
          } else if (item.ElementType == Enums.ElementType.TextField && this.isNotNull(item.Value)) {
            findingsTextField = [this.getBlankColumn(' '), this.getConstructionValueWithBorder(this.translator(item.DisplayName), false, "Border"), this.getCommentsbox(item.Value), this.getBlankColumn(' '), this.getBlankColumn(' ')]
          }
        })

        if (findingsTextField.length > 0) subTableforItems.table.body.push(findingsTextField);
        if (index == 0) {
          if (subTableforItems.table.body.length > 2) {
            subTableforItems.table.body[2][4] = this.getNotesbox(findingsNotes, (subTableforItems.table.body.length - 2));
          }
        } else {
          if (subTableforItems.table.body.length > 0) {
            subTableforItems.table.body[0][4] = this.getNotesbox(findingsNotes, (subTableforItems.table.body.length));
          }
        }
        //   if (findingsNotes.length > 0) subTableforItems.table.body.push(findingsNotes);
        if (subTableforItems.table.body.length > 0) {
          // console.log(subTableforItems.table.body);
          rows.push(subTableforItems);
        }
      });
      // rows.push(findingTable);
      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getFindingsTable', "Error: " + err.message);
    }
    return table;
  }

  getOptionalTable(reportData) {
    let table = { columns: [] };
    try {
      let rows = [];
      let optionalData = [], optionalAccordionItems = [];
      reportData.forEach((item) => {
        if (item.WorkFlowID == 14) {
          optionalData.push(item);
          if (item.ElementType == Enums.ElementType.Accordion && item.Value != "Valve Pre-Test Data" && item.Value != "Controller Construction") optionalAccordionItems.push(item);
        }
      });
      // let count = 0;
      optionalAccordionItems.forEach((parentFindingsElement, index) => {
        let findingsNotes = [];
        let headerRow = true;
        let subTableforItems = this.getSubTableForOptional(true, index);
        if (index == 0) {
          subTableforItems.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: this.translator('AS FOUND'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "left", margin: [5, 0, 0, 0] }, { text: this.translator('AS LEFT'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "left", margin: [5, 0, 0, 0] }, { text: this.translator('NOTES'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "left", margin: [5, 0, 0, 0] }]);
        }
        let findingsTextField = [];
        let findingsAccordionListItems = optionalData.filter(item => {
          return item.ParentID_Mobile == parentFindingsElement.RDID_Mobile && item.ElementType == Enums.ElementType.AccordionListView;
        });
        findingsAccordionListItems.forEach((subParentFindingElement, i) => {
          let row: any[] = [];
          row.push(this.getBlankColumn('')),
            row.push(this.getConstructionValueWithBorder(subParentFindingElement.Value, false, "Border")),
            row.push(this.getConstructionLabelForFindingsWithBorder(' ', false, "Border")),
            row.push(this.getConstructionLabelForFindingsWithBorder(' ', false, "Border")),
            row.push(this.getConstructionLabelForFindingsWithBorder(' ', false, "Border"))
          let findingsAccordionListElements = optionalData.filter(item => {
            return (item.ParentID_Mobile == subParentFindingElement.RDID_Mobile) && item.ElementType != "AccordionListView";
          });

          findingsAccordionListElements.forEach((item) => {
            let index = 0;
            switch (item.DisplayName) {
              case "As Found":
                index = 2;
                break;
              case "As Left":
                index = 3;
                break;
            }
            if (index != 0 && row[index] && item.Value) row[index].text = item.Value;
          });
          if (row.filter((item) => item.text != ' ').length > 1) {
            if (row[2].text != ' ' || row[3].text != ' ' || row[4].text != ' ') {
              if (headerRow) {
                row[0].text = parentFindingsElement.Value;
                headerRow = false;
              }
              subTableforItems.table.body.push(row);
            }
          }

        })
        let optionalAccordionElements = optionalData.filter((item) => {
          return item.ParentID_Mobile == parentFindingsElement.RDID_Mobile && item.ElementType != Enums.ElementType.AccordionListView
        })
        optionalAccordionElements.forEach((item) => {
          if (item.ElementType == Enums.ElementType.TextArea) {
            findingsNotes = item.Value;
          } else if (item.ElementType == Enums.ElementType.TextField && this.isNotNull(item.Value)) {
            findingsTextField = [this.getBlankColumn(' '), this.getConstructionValueWithBorder(this.translator(item.DisplayName), false, "Border"), this.getCommentsbox(item.Value), this.getBlankColumn(' '), this.getBlankColumn(' ')]
          }
        })

        if (findingsTextField.length > 0) subTableforItems.table.body.push(findingsTextField);
        if (index == 0) {
          if (subTableforItems.table.body.length > 1) {
            subTableforItems.table.body[1][4] = this.getNotesbox(findingsNotes, (subTableforItems.table.body.length - 1));
          }
        } else {
          if (subTableforItems.table.body.length > 0) {
            subTableforItems.table.body[0][4] = this.getNotesbox(findingsNotes, (subTableforItems.table.body.length));
          }
        }
        if (subTableforItems.table.body.length > 0) {
          rows.push(subTableforItems);
        }
      });
      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getOptionalTable', "Error: " + err.message);
    }
    return table;
  }

  getMaterialVerificationTable(reportData, docDefinition) {
    let table = { columns: [] };
    try {
      let rows = [];
      let filteredReportData = reportData.filter((item) => {
        return item.LookupID == 30017
      })
      let findingsData = [], findingsAccordionItems = [];
      reportData.forEach((item) => {
        if (item.WorkFlowID == 9) {
          findingsData.push(item);

        }
      });

      filteredReportData.forEach((item) => {
        if (item.ElementType == Enums.ElementType.Accordion) findingsAccordionItems.push(item);
      })
      // findingTable.table.body.push([this.getTableHeader('FINDINGS'), this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' ')]);

      // findingTable.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: this.translator('FOUND'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "left" }, { text: this.translator('RECOMMENDED ACTION'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "left" }]);
      findingsAccordionItems.forEach((parentFindingsElement, index) => {
        let findingsNotes = [];
        let subTableforItems = this.getSubTableForFindings(true, index);
        if (index == 0) {
          // subTableforItems.table.body.push([this.getTableHeader('MATERIAL VERIFICATION', 2), this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' ')]);
          subTableforItems.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: this.translator('AS FOUND'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "center" }, { text: this.translator('AS LEFT'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "center" }, { text: this.translator('NOTES'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, alignment: "center" }]);
          // } else if (index != findingsAccordionItems.length) {
          //   subTableforItems.table.body.push([this.getTableHeader(''), this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' ')]);
        }
        let findingsTextField = [];
        let findingsAccordionListItems = findingsData.filter(item => {
          return item.ParentID_Mobile == parentFindingsElement.RDID_Mobile && item.ElementType == Enums.ElementType.AccordionListView;
        });
        findingsAccordionListItems.forEach((subParentFindingElement, i) => {
          let row: any[] = [];
          row.push(i == 0 ? this.getBlankColumn(parentFindingsElement.Value) : this.getBlankColumn('')),
            row.push(this.getConstructionValueWithBorder(subParentFindingElement.Value, false, "Border")),
            row.push(this.getConstructionLabelForFindingsWithBorder(' ', false, "Border")),
            row.push(this.getConstructionLabelForFindingsWithBorder(' ', false, "Border")),
            row.push(this.getConstructionLabelForFindingsWithBorder(' ', false, "Border"))
          let findingsAccordionListElements = findingsData.filter(item => {
            return (item.ParentID_Mobile == subParentFindingElement.RDID_Mobile);
          });

          findingsAccordionListElements.forEach((item) => {
            let index = 0;
            switch (item.DisplayName) {
              case "As Found":
                index = 2;
                break;
              case "As Left":
                index = 3;
                break;
            }
            if (index != 0 && row[index] && item.Value) row[index].text = item.Value;
          });
          if (row.filter((item) => item.text != ' ').length > 1) subTableforItems.table.body.push(row);
        })
        let findingsAccordionElements = findingsData.filter((item) => {
          return item.ParentID_Mobile == parentFindingsElement.RDID_Mobile && item.ElementType != Enums.ElementType.AccordionListView
        })
        findingsAccordionElements.forEach((item) => {
          if (item.ElementType == Enums.ElementType.TextArea) {
            findingsNotes = item.Value;
          } else if (item.ElementType == Enums.ElementType.TextField) {
            findingsTextField = [this.getBlankColumn(' '), this.getConstructionValueWithBorder(this.translator(item.DisplayName), false, "Border"), this.getCommentsbox(item.Value), this.getBlankColumn(' '), this.getBlankColumn(' ')]
          }
        })

        if (findingsTextField.length > 0) subTableforItems.table.body.push(findingsTextField);
        if (index == 0) {
          if (subTableforItems.table.body.length > 0) {
            subTableforItems.table.body[1][4] = this.getNotesbox(findingsNotes, (subTableforItems.table.body.length - 2));
          }
        } else {
          if (subTableforItems.table.body.length > 0) {
            subTableforItems.table.body[0][4] = this.getNotesbox(findingsNotes, (subTableforItems.table.body.length));
          }
        }
        if (subTableforItems.table.body.length > 0) {
          rows.push(subTableforItems);
        }
      });
      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getMaterialVerificationTable', "Error: " + err.message);
    }
    return table;
  }
  //Shivansh Subnani 01/17/2019 function to display pretest and posttest data on pdf
  getPreAndPostTestTable(filteredTestData, reportData) {
    let table = { columns: [] };
    try {
      let rows = [];
      let PreAndPostTestTable = {
        unbreakable: true,
        table: {
          widths: ['18%', '3%', '30%', '5%', '30%'],
          body: []
        },
        layout: {
          layout: 'noBorders',
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#B5CAE1' : '#D5E2F0';
          }
        },
      };
      // console.log("filteredTestData" + JSON.stringify(filteredTestData));
      PreAndPostTestTable.table.body.push([this.getTableHeader('TESTING', 2), this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);

      PreAndPostTestTable.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), { text: 'Pre-Test', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, margin: [10, 0, 0, 0] }, this.getBlankColumn(''), { text: 'Post-Test', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, margin: [10, 0, 0, 0] }]);
      let ElementsArr = [[367, 368, 607, 608], [372, 373, 611, 612], [382, 383, 619, 620], [377, 378, 615, 616]];
      for (let i = 0; i < ElementsArr.length; i++) {
        // let tempRow = [];
        let row = [];
        let data = ElementsArr[i];
        let elementArr = reportData.filter((item) => data.indexOf(item.ElementID) > -1);
        if (elementArr.length > 0) {
          row.push(this.getBlankColumn(elementArr[0].SectionTitle));
          for (let k in data) {
            let element = reportData.filter((item) => item.ElementID == data[k]);
            if (element.length > 0) {
              if (element[0].ElementType == Enums.ElementType.CheckBox) {
                row.push(this.getCheckboxFlag(element[0].Value == 'true' ? true : false));
              } else {
                row.push(this.getPrePostVal(element[0].Value));
              }
            } else {
              row.push(this.getBlankColumn(""));
            }
          }
        }
        if (row.length == 5) {
          PreAndPostTestTable.table.body.push(row);
        }
      }
      if (PreAndPostTestTable.table.body.length > 1) {
        rows.push(PreAndPostTestTable);
        table.columns.push(rows);
      }
    } catch (err) {
      this.logger.log(this.fileName, 'getPreAndPostTestTable', "Error: " + JSON.stringify(err));
    }
    return table;
  }


  getFindingsTableForActuation(reportData, docDefinition) {
    let table = { columns: [] };
    try {
      let rows = [];
      let asFoundArr = [];
      let asLeftArr = [];
      let ElementsArr = [21, 22, 23, 24, 25, 354];
      let asLeftElementsArr = [595, 596, 597, 598, 599, 600]
      for (let j = 0; j < reportData.length; j++) {
        if (ElementsArr.indexOf(reportData[j].ElementID) > -1) {
          asFoundArr.push(reportData[j])
        }
        else if (asLeftElementsArr.indexOf(reportData[j].ElementID) > -1) {
          asLeftArr.push(reportData[j])
        }
      }
      // if (asFoundArr.length > 0 || asLeftArr.length > 0) {
      //   docDefinition.content.push({ text: this.translator("FINDINGS AND CORRECTIVE ACTIONS"), color: '#234487', style: 'header' });
      // }
      if (asFoundArr.length > 0) {
        let leftinnerTable = {
          table: { widths: ['45%', '45%'], body: [] }, layout: { layout: 'noBorders', fillColor: function (rowIndex, node, columnIndex) { return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF'; } },
        };
        leftinnerTable.table.body.push([{ text: this.translator('AS FOUND PERFORMANCE'), color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", border: this.noborderstyle }, this.getBlankColumn(' ')]);
        for (let i in asFoundArr) {
          leftinnerTable.table.body.push([this.getConstructionLabel(this.translator(asFoundArr[i].DisplayName), false), this.getConstructionValue(asFoundArr[i].Value, false)]);
        }
        rows.push(leftinnerTable);
        table.columns.push(rows);
        rows = [];
      }
      if (asLeftArr.length > 0) {
        let rightinnerTable = {
          table: { widths: ['45%', '45%'], body: [] }, layout: { layout: 'noBorders', fillColor: function (rowIndex, node, columnIndex) { return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF'; }, border: [false, false, false, false] },
        };
        rightinnerTable.table.body.push([{ text: 'AS LEFT PERFORMANCE', color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", border: this.noborderstyle }, this.getBlankColumn(' ')]);
        for (let k in asLeftArr) {
          rightinnerTable.table.body.push([this.getConstructionLabel(this.translator(asLeftArr[k].DisplayName), false), this.getConstructionValue(asLeftArr[k].Value, false)]);
        }
        rows.push(rightinnerTable);
        table.columns.push(rows);
        rows = [];
      }
      return table;

    } catch (err) {
      this.logger.log(this.fileName, 'getFindingsTableForActuation', "Error: " + JSON.stringify(err));
    }
    return table;
  }
  getCalibrationTableForActuation(reportData) {
    let table = { columns: [] };
    try {
      let rows = [];
      let asFoundArr = [];
      let asLeftArr = [];
      let ElementsArr = [21, 22, 23, 24, 25, 354];
      let asLeftElementsArr = [595, 596, 597, 598, 599, 600]
      for (let j = 0; j < reportData.length; j++) {
        if ((ElementsArr.indexOf(reportData[j].ElementID) > -1) && reportData[j].DetailedValue != "N/A") {
          asFoundArr.push(reportData[j])
        }
        else if ((asLeftElementsArr.indexOf(reportData[j].ElementID) > -1) && reportData[j].DetailedValue != "N/A") {
          asLeftArr.push(reportData[j])
        }
      }
      if (asFoundArr.length > 0) {
        let leftinnerTable = {
          table: { widths: ['30%', '30%'], body: [] }, layout: { layout: 'noBorders', fillColor: function (rowIndex, node, columnIndex) { return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF'; } },
        };
        leftinnerTable.table.body.push([this.getTableHeader("CALIBRATION/CONFIGURATION", 2), this.getBlankColumn(' ')]);

        leftinnerTable.table.body.push([{ text: this.translator('AS FOUND PERFORMANCE'), color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", border: this.noborderstyle }, this.getBlankColumn(' ')]);
        for (let i in asFoundArr) {
          leftinnerTable.table.body.push([this.getConstructionLabel(this.translator(asFoundArr[i].DisplayName), false), this.getConstructionValue(asFoundArr[i].Value, false)]);
        }
        rows.push(leftinnerTable);
        if (asLeftArr.length == 0) {
          table.columns.push(rows);
        }
        rows = [];
      }
      rows = [];
      return table;

    } catch (err) {
      this.logger.log(this.fileName, 'getCalibrationTableForActuation', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  // getAsFoundActuationData(reportData) {
  //   let table = { columns: [] };
  //   try {
  //     let rows = [];

  //     let asFoundLeftData = [], AsFoundElementsData = [], AsLeftElementsData = [], AsFoundAccordionItems = [], AsLeftAccordionItems = [];
  //     reportData.forEach((item) => {
  //       if (item.WorkFlowID == 50 || item.WorkFlowID == 2) {
  //         asFoundLeftData.push(item);
  //         if (item.WorkFlowID == 2) {
  //           if (item.ElementType == "Accordion") AsFoundAccordionItems.push(item);
  //           AsFoundElementsData.push(item);
  //         } else {
  //           if (item.ElementType == "Accordion") AsLeftAccordionItems.push(item);
  //           AsLeftElementsData.push(item);
  //         }
  //       }
  //     });
  //     // let subTableforHeading = this.getSubTable();
  //     // subTableforHeading.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: this.translator('AS FOUND'), color: "#045B83", bold: true, border: this.noborderstyle, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('RECOMMENDED ACTION'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('AS LEFT'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }]);
  //     // rows.push(subTableforHeading);
  //     AsFoundAccordionItems.forEach((parentAsFoundElement, index) => {
  //       let subTableforItems = this.getSubTable();
  //       if (index == 0) {
  //         subTableforItems.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: this.translator('AS FOUND'), color: "#045B83", bold: true, border: this.noborderstyle, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('RECOMMENDED ACTION'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('AS LEFT'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }]);
  //       }
  //       let headingRow: any[] = [
  //         //this.getBlankColumn(this.translator(parentAsFoundElement.Value)),
  //         this.getBlankColumn(this.translator(parentAsFoundElement.Value)),
  //         this.getConstructionValue(' ', false),
  //         this.getConstructionLabel(' ', false),
  //         this.getConstructionLabel(' ', false),
  //         this.getConstructionLabel(' ', false),
  //       ];
  //       let AsFoundComments = [];
  //       let AsLeftComments = [];
  //       let parentAsLeftElement = AsLeftAccordionItems.filter(item => item.Value == parentAsFoundElement.Value);
  //       let parentAsLeftRDID_Mobile = parentAsLeftElement.length > 0 ? parentAsLeftElement[0].RDID_Mobile : 0;
  //       let AsFoundLeftAccordionElements = asFoundLeftData.filter(item => {
  //         return (item.ParentID_Mobile == parentAsFoundElement.RDID_Mobile || item.ParentID_Mobile == parentAsLeftRDID_Mobile) && item.ElementType != "AccordionListView";
  //       });

  //       AsFoundLeftAccordionElements.forEach((item) => {
  //         let index = 0;
  //         if (item.ElementType == "TextArea") {
  //           let commentTitle = item.WFTitle + " " + "Comments";
  //           if (item.FlowName == "AsFound" && this.isNotNull(item.Value)) AsFoundComments = [this.getBlankColumn(' '), this.getConstructionValue(commentTitle, false), this.getComments(item.Value)];
  //           if (item.FlowName == "AsLeft" && this.isNotNull(item.Value)) AsLeftComments = [this.getBlankColumn(' '), this.getConstructionValue(commentTitle, false), this.getComments(item.Value)];
  //         } else {
  //           switch (item.DisplayName) {
  //             case "As Found":
  //               index = 2;
  //               break;
  //             case "Recommended Action":
  //               index = 3;
  //               break;
  //             case "As Left":
  //               index = 4;
  //               break;
  //           }
  //           if (index != 0 && headingRow[index] && item.Value) headingRow[index].text = this.translator(item.Value);
  //         }
  //       })
  //       if (headingRow.filter((item) => item.text != ' ').length > 1) subTableforItems.table.body.push(headingRow);
  //       if (AsFoundComments.length > 0) subTableforItems.table.body.push(AsFoundComments);
  //       if (AsLeftComments.length > 0) subTableforItems.table.body.push(AsLeftComments);
  //       let AsFoundAccordionListItems = AsFoundElementsData.filter(item => {
  //         return item.ParentID_Mobile == parentAsFoundElement.RDID_Mobile && item.ElementType == "AccordionListView";
  //       });
  //       AsFoundAccordionListItems.forEach(subParentAsFoundElement => {
  //         let subParentAsLeftElement = AsLeftElementsData.filter(item => {
  //           return item.Value == subParentAsFoundElement.Value;
  //         });
  //         let subParentAsLeftElementRDID_Mobile = subParentAsLeftElement.length > 0 ? subParentAsLeftElement[0].RDID_Mobile : 0;
  //         let row: any[] = [
  //           this.getBlankColumn(' '),
  //           this.getConstructionValue(this.translator(subParentAsFoundElement.Value), false),
  //           this.getConstructionLabel(' ', false),
  //           this.getConstructionLabel(' ', false),
  //           this.getConstructionLabel(' ', false),
  //         ];

  //         let AsFoundLeftAccordionListElements = asFoundLeftData.filter(item => {
  //           return (item.ParentID_Mobile == subParentAsFoundElement.RDID_Mobile || item.ParentID_Mobile == subParentAsLeftElementRDID_Mobile) && item.ElementType != "AccordionListView";
  //         });

  //         AsFoundLeftAccordionListElements.forEach((item) => {
  //           let index = 0;
  //           switch (item.DisplayName) {
  //             case "As Found":
  //               index = 2;
  //               break;
  //             case "Recommended":
  //               index = 3;
  //               break;
  //             case "As Left":
  //               index = 4;
  //               break;
  //           }
  //           if (index != 0 && row[index] && item.Value) row[index].text = this.translator(item.Value);
  //         });
  //         if (row.filter((item) => item.text != ' ').length > 1) subTableforItems.table.body.push(row);
  //       });

  //       if (subTableforItems.table.body.length > 0) {
  //         // console.log(subTableforItems);
  //         // subTableforItems.table.body[0][0] = this.getRotatedText(this.translator(parentAsFoundElement.Value), subTableforItems.table.body.length);
  //         rows.push(subTableforItems);
  //       }
  //     });
  //     table.columns.push(rows);
  //   } catch (err) {
  //     this.logger.log(this.fileName, 'getAsFoundActuationData', "Error: " + JSON.stringify(err));
  //   }
  //   return table;
  // }

  // getAsFoundActuationData(reportData) {
  //   let table = { columns: [] };
  //   try {
  //     let rows = [];

  //     let asFoundLeftData = [], AsFoundElementsData = [], AsLeftElementsData = [], AsFoundAccordionItems = [], AsLeftAccordionItems = [];
  //     reportData.forEach((item) => {
  //       if (item.WorkFlowID == 50 || item.WorkFlowID == 2) {
  //         asFoundLeftData.push(item);
  //         if (item.WorkFlowID == 2) {
  //           if (item.ElementType == "Accordion") AsFoundAccordionItems.push(item);
  //           AsFoundElementsData.push(item);
  //         } else {
  //           if (item.ElementType == "Accordion") AsLeftAccordionItems.push(item);
  //           AsLeftElementsData.push(item);
  //         }
  //       }
  //     });
  //     // let subTableforHeading = this.getSubTable();
  //     // subTableforHeading.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: this.translator('AS FOUND'), color: "#045B83", bold: true, border: this.noborderstyle, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('RECOMMENDED ACTION'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('AS LEFT'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }]);
  //     // rows.push(subTableforHeading);
  //     AsFoundAccordionItems.forEach((parentAsFoundElement, index) => {
  //       let subTableforItems = this.getSubTableActuation(index);
  //       let hasHeader = true;
  //       if (index == 0) {
  //         subTableforItems.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: this.translator('AS FOUND'), color: "#045B83", bold: true, border: this.noborderstyle, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('RECOMMENDED ACTION'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('AS LEFT'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('AS FOUND COMMENTS'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }]);
  //       }
  //       let headingRow: any[] = [
  //         //this.getBlankColumn(this.translator(parentAsFoundElement.Value)),
  //         this.getBlankColumn(this.translator(parentAsFoundElement.Value)),
  //         this.getConstructionValueWithBorder(' ', false, "border"),
  //         this.getConstructionLabelForFindingsWithBorder(' ', false, "border"),
  //         this.getConstructionLabelForFindingsWithBorder(' ', false, "border"),
  //         this.getConstructionLabelForFindingsWithBorder(' ', false, "border"),
  //         this.getConstructionLabelForFindingsWithBorder(' ', false, "border"),
  //       ];
  //       let AsFoundComments = [];
  //       let AsLeftComments = [];
  //       let parentAsLeftElement = AsLeftAccordionItems.filter(item => item.Value == parentAsFoundElement.Value);
  //       let parentAsLeftRDID_Mobile = parentAsLeftElement.length > 0 ? parentAsLeftElement[0].RDID_Mobile : 0;
  //       let AsFoundLeftAccordionElements = asFoundLeftData.filter(item => {
  //         return (item.ParentID_Mobile == parentAsFoundElement.RDID_Mobile || item.ParentID_Mobile == parentAsLeftRDID_Mobile) && item.ElementType != "AccordionListView";
  //       });

  //       AsFoundLeftAccordionElements.forEach((item) => {
  //         let index = 0;
  //         if (item.ElementType == "TextArea") {
  //           let commentTitle = item.WFTitle + " " + "Comments";
  //           if (item.FlowName == "AsFound" && this.isNotNull(item.Value)) AsFoundComments = item.Value;
  //           if (item.FlowName == "AsLeft" && this.isNotNull(item.Value)) AsLeftComments = [this.getBlankColumn(' '), this.getConstructionValueWithBorder(commentTitle, false, "border"), this.getComments(item.Value, "Border"), this.getBlankColumnWithBorder(' '), this.getBlankColumnWithBorder(' '), this.getBlankColumnWithBorder(' ')];
  //         } else {
  //           switch (item.DisplayName) {
  //             case "As Found":
  //               index = 2;
  //               break;
  //             case "Recommended Action":
  //               index = 3;
  //               break;
  //             case "As Left":
  //               index = 4;
  //               break;
  //           }
  //           if (index != 0 && headingRow[index] && item.Value) headingRow[index].text = this.translator(item.Value);
  //         }
  //       })
  //       if (headingRow.filter((item) => item.text != ' ').length > 1) subTableforItems.table.body.push(headingRow);
  //       // if (AsFoundComments.length > 0) subTableforItems.table.body.push(AsFoundComments);
  //       // if (AsLeftComments.length > 0) subTableforItems.table.body.push(AsLeftComments);
  //       let AsFoundAccordionListItems = AsFoundElementsData.filter(item => {
  //         return item.ParentID_Mobile == parentAsFoundElement.RDID_Mobile && item.ElementType == "AccordionListView";
  //       });
  //       AsFoundAccordionListItems.forEach(subParentAsFoundElement => {
  //         let subParentAsLeftElement = AsLeftElementsData.filter(item => {
  //           return item.Value == subParentAsFoundElement.Value;
  //         });
  //         let subParentAsLeftElementRDID_Mobile = subParentAsLeftElement.length > 0 ? subParentAsLeftElement[0].RDID_Mobile : 0;
  //         let row: any[] = [
  //           this.getBlankColumn(' '),
  //           subParentAsFoundElement.Value == "Solution Comments" ? this.getConstructionValueWithBorder(this.translator(subParentAsFoundElement.Value), false, 'noBorder') : this.getConstructionValueWithBorder(this.translator(subParentAsFoundElement.Value), false, "border"),
  //           this.getConstructionLabelForFindingsWithBorder(' ', false, "border"),
  //           this.getConstructionLabelForFindingsWithBorder(' ', false, "border"),
  //           this.getConstructionLabelForFindingsWithBorder(' ', false, "border"),
  //           this.getConstructionLabelForFindingsWithBorder(' ', false, "border")
  //         ];

  //         let AsFoundLeftAccordionListElements = asFoundLeftData.filter(item => {
  //           return (item.ParentID_Mobile == subParentAsFoundElement.RDID_Mobile || item.ParentID_Mobile == subParentAsLeftElementRDID_Mobile) && item.ElementType != "AccordionListView";
  //         });

  //         AsFoundLeftAccordionListElements.forEach((item) => {
  //           let index = 0;
  //           switch (item.DisplayName) {
  //             case "As Found":
  //               index = 2;
  //               break;
  //             case "Recommended":
  //               index = 3;
  //               break;
  //             case "As Left":
  //               index = 4;
  //               break;
  //           }
  //           if (index != 0 && row[index] && item.Value) row[index].text = this.translator(item.Value);
  //         });

  //         if (row.filter((item) => item.text != ' ').length > 1) {
  //           if (row[2].text != ' ' || row[3].text != ' ' || row[4].text != ' ' || row[5].text != ' ') {
  //             if (headingRow.filter((item) => item.text != ' ').length <= 1 && hasHeader) {
  //               row[0].text = parentAsFoundElement.Value;
  //               hasHeader = false;
  //             }
  //             subTableforItems.table.body.push(row);
  //           }
  //         }
  //       });
  //       if (AsLeftComments.length > 0) subTableforItems.table.body.push(AsLeftComments);
  //       if (index == 0) {
  //         if (subTableforItems.table.body.length > 0) {
  //           subTableforItems.table.body[1][5] = this.getNotesboxActuation(AsFoundComments, (subTableforItems.table.body.length - 1), "border");
  //         }
  //       } else {
  //         if (subTableforItems.table.body.length > 0) {
  //           subTableforItems.table.body[0][5] = this.getNotesboxActuation(AsFoundComments, (subTableforItems.table.body.length), "border");
  //         }
  //       }
  //       if (subTableforItems.table.body.length > 0) {
  //         // console.log(subTableforItems);
  //         // subTableforItems.table.body[0][0] = this.getRotatedText(this.translator(parentAsFoundElement.Value), subTableforItems.table.body.length);
  //         rows.push(subTableforItems);
  //       }
  //     });
  //     table.columns.push(rows);
  //   } catch (err) {
  //     this.logger.log(this.fileName, 'getAsFoundActuationData', "Error: " + JSON.stringify(err));
  //   }
  //   return table;
  // }

  getAsFoundActuationData(reportData) {
    let table = { columns: [] };
    try {
      let rows = [];
      let asFoundLeftData = [], AsFoundElementsData = [], AsLeftElementsData = [], AsFoundAccordionItems = [], AsLeftAccordionItems = [];
      reportData.forEach((item) => {
        if (item.WorkFlowID == 50 || item.WorkFlowID == 2) {
          asFoundLeftData.push(item);
          if (item.WorkFlowID == 2) {
            if (item.ElementType == "Accordion") AsFoundAccordionItems.push(item);
            AsFoundElementsData.push(item);
          } else {
            if (item.ElementType == "Accordion") AsLeftAccordionItems.push(item);
            AsLeftElementsData.push(item);
          }
        }
      });
      AsFoundAccordionItems.forEach((parentAsFoundElement, index) => {
        let subTableforItems = this.getActuationMainTable(index);
        let subTableforItemsHeader = this.getActuationHeadingTable(index);
        let AsFoundLeftAccordionElements = asFoundLeftData.filter(item => {
          return (item.ParentID_Mobile == parentAsFoundElement.RDID_Mobile) && item.ElementType != "AccordionListView";
        });
        let AsFoundComments = []
        AsFoundLeftAccordionElements.forEach((item) => {
          if (item.ElementType == "TextArea") {
            if (item.FlowName == "AsFound" && this.isNotNull(item.Value)) AsFoundComments = item.Value;
          }
        })
        let accordionDetails  = this.getAccordionDetailsTable(parentAsFoundElement,asFoundLeftData,AsFoundElementsData,AsLeftElementsData,AsLeftAccordionItems);
        // let notesData  = this.getAccordionNotesTable(AsFoundComments);
        if (index == 0) {
          subTableforItemsHeader.table.body.push([this.getBlankColumn(' '), this.getAccordionHeader(),{ text: this.translator('AS FOUND COMMENTS'), color: "#045B83", bold: true, border: this.noborderstyle, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3],alignment : 'center' }]);
          rows.push(subTableforItemsHeader);
        }
        subTableforItems.table.body.push([this.getBlankColumn(parentAsFoundElement.Value), accordionDetails, this.getNotesboxActuation(AsFoundComments,"Border")]);
        if (subTableforItems.table.body.length > 0 && (accordionDetails.table.body.length > 1 || AsFoundComments.length > 0)) {
          rows.push(subTableforItems);
        }
      });
      table.columns.push(rows);
    } catch (err) {
      // console.log(err);
       this.logger.log(this.fileName, 'getAsFoundActuationData', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getActuationHeadingTable(index?) {
    let table: any = {
      table: {
        "body": [],
        "widths": ['12%', '60%', '28%']
      }, layout: "noBorders",
    }
    return table;
  }

  getAccordionHeader() {
    let subTableforItems = this.getSubTableForActuation1();
    if (subTableforItems.table.body.length == 0) {
      subTableforItems.table.body.push([this.getBlankColumn(''), { text: this.translator('AS FOUND'), color: "#045B83", bold: true, border: this.noborderstyle, alignment:'center', fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('RECOMMENDED ACTION'), border: this.noborderstyle,  alignment:'center', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('AS LEFT'), border: this.noborderstyle, alignment:'center', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }]);
    }
    return subTableforItems;
  }

  getAccordionNotesTable(AsFoundComments) {
    let subTable: any = {
      table: {
        widths: ['100%'],
        body: []
      }, layout:"noBorders"
    }
    subTable.table.body.push([{ text: AsFoundComments.length > 0 ? AsFoundComments : " ", fillColor:  AsFoundComments.length > 0 ? '#e5e6e8' : '', fontSize: 9, border:this.noborderstyle }]);
    return subTable;
  }

  getAccordionDetailsTable(parentAsFoundElement,asFoundLeftData,AsFoundElementsData,AsLeftElementsData,AsLeftAccordionItems) {
    let subTableforItems = this.getSubTableForActuation();
    let headingRow: any[] = [
      this.getConstructionValue(' ', false),
      this.getConstructionLabelForFindings(' ', false),
      this.getConstructionLabelForFindings(' ', false),
      this.getConstructionLabelForFindings(' ', false),
    ];
    let AsFoundComments: any = [];
    let AsLeftComments: any = [];
    let parentAsLeftElement = AsLeftAccordionItems.filter(item => item.LookupID == parentAsFoundElement.LookupID);
    let parentAsLeftRDID_Mobile = parentAsLeftElement.length > 0 ? parentAsLeftElement[0].RDID_Mobile : 0;
    let AsFoundLeftAccordionElements = asFoundLeftData.filter(item => {
      return (item.ParentID_Mobile == parentAsFoundElement.RDID_Mobile || item.ParentID_Mobile == parentAsLeftRDID_Mobile) && item.ElementType != "AccordionListView";
    });

    AsFoundLeftAccordionElements.forEach((item) => {
      let index = 0;
      if (item.ElementType == "TextArea") {
        let commentTitle = item.WFTitle + " " + "Comments";
        if (item.FlowName == "AsFound" && this.isNotNull(item.Value)) AsFoundComments = item.Value;
        if (item.FlowName == "AsLeft" && this.isNotNull(item.Value)) AsLeftComments = [this.getConstructionValue(commentTitle, false), this.getComments(item.Value), this.getBlankColumn(''), this.getBlankColumn(' ')];
      } else {
        switch (item.DisplayName) {
          case "As Found":
            index = 1;
            break;
          case "Recommended Action":
            index = 2;
            break;
          case "As Left":
            index = 3;
            break;
        }
        if (index != 0 && headingRow[index] && item.Value) headingRow[index].text = this.translator(item.Value);
      }
    })
    if (headingRow[1].text != ' ' || headingRow[2].text != ' ' || headingRow[3].text != ' ') {
      subTableforItems.table.body.push(headingRow);
    }
    // if (AsFoundComments.length > 0) subTableforItems.table.body.push(AsFoundComments);
    // if (AsLeftComments.length > 0) subTableforItems.table.body.push(AsLeftComments);
    let AsFoundAccordionListItems = AsFoundElementsData.filter(item => {
      return item.ParentID_Mobile == parentAsFoundElement.RDID_Mobile && item.ElementType == "AccordionListView";
    });
    AsFoundAccordionListItems.forEach(subParentAsFoundElement => {
      let subParentAsLeftElement = AsLeftElementsData.filter(item => {
        return item.LookupID == subParentAsFoundElement.LookupID;
      });
      let subParentAsLeftElementRDID_Mobile = subParentAsLeftElement.length > 0 ? subParentAsLeftElement[0].RDID_Mobile : 0;
      let row: any[] = [
        subParentAsFoundElement.Value == "Solution Comments" ? this.getConstructionValue(this.translator(subParentAsFoundElement.Value), false) : this.getConstructionValue(this.translator(subParentAsFoundElement.Value), false),
        this.getConstructionLabelForFindings(' ', false),
        this.getConstructionLabelForFindings(' ', false),
        this.getConstructionLabelForFindings(' ', false)
      ];

      let AsFoundLeftAccordionListElements = asFoundLeftData.filter(item => {
        return (item.ParentID_Mobile == subParentAsFoundElement.RDID_Mobile || item.ParentID_Mobile == subParentAsLeftElementRDID_Mobile) && item.ElementType != "AccordionListView";
      });

      AsFoundLeftAccordionListElements.forEach((item) => {
        let index = 0;
        switch (item.DisplayName) {
          case "As Found":
            index = 1;
            break;
          case "Recommended":
            index = 2;
            break;
          case "As Left":
            index = 3;
            break;
        }
        if (index != 0 && row[index] && item.Value) row[index].text = this.translator(item.Value);
      });

      if (row.filter((item) => item.text != ' ').length > 1) {
        subTableforItems.table.body.push(row);
      }
    });
    if (AsLeftComments.length > 0) subTableforItems.table.body.push(AsLeftComments);
    if(subTableforItems.table.body.length == 0){
      subTableforItems.table.body.push([]);
    }
    return subTableforItems;
  }


  getActuationMainTable(index?) {
    let table: any = {
      table: {
        "body": [],
        "widths": ['12%', '60%', '28%']
      }, layout: {
        hLineWidth: function (i, node) {
          return ((i === (index === 0 ? 0 : 0)) || (i === node.table.body.length) ? 0.7 : 0);
        },
        vLineWidth: function (i, node) {
          return (i === 1 || i === node.table.widths.length) ? 1.4 : 0;
        },
        hLineColor: function (i, node) {
          return ((i === (index === 0 ? 0 : 0)) || (i === node.table.body.length) ? '#4d8dd1' : '#4d8dd1');
        },
        vLineColor: function (i, node) {
          return (i === 1 || i === node.table.widths.length) ? '#4d8dd1' : '';
        },
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
        }
      },
    }
    return table;
  }

  getSubTableForActuation() {
    let subTable: any = {
      table: {
        widths: ['25%', '25%', '25%', '27%'],
        body: []
      },
      layout: {
        defaultBorder: false,
        paddingRight: function (i, node) { return -1; },
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#DDE6EF' : '#B5CAE1';
        }
      }
    }

    return subTable;
  }

  getSubTableForActuation1() {
    let subTable: any = {
      table: {
        widths: ['25%', '25%', '25%', '25%'],
        body: []
      },
      layout: "noBorders"
    }

    return subTable;
  }

  getFindingsAsLeftListView(reportData) {
    let table = { columns: [] };
    try {
      let rows = [];

      // let actuationTable = {
      //   table: {
      //     widths: ['10%', '20%', '20%', '25%', '25%'],
      //     body: []
      //   },
      //   layout: {
      //     layout: 'noBorders',
      //     fillColor: function (rowIndex, node, columnIndex) {
      //       return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
      //     }
      //   },
      // };
      // let subTableforHeading = this.getSubTable();
      let asFoundLeftData = [], AsFoundElementsData = [], AsLeftElementsData = [], AsFoundAccordionItems = [], AsLeftAccordionItems = [];
      reportData.forEach((item) => {
        if (item.WorkFlowID == 2 || item.WorkFlowID == 4) {
          asFoundLeftData.push(item);
          if (item.WorkFlowID == 2) {
            if (item.ElementType == "Accordion") AsFoundAccordionItems.push(item);
            AsFoundElementsData.push(item);
          } else {
            if (item.ElementType == "Accordion") AsLeftAccordionItems.push(item);
            AsLeftElementsData.push(item);
          }
        }
      });
      // subTableforHeading.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: this.translator('AS FOUND'), color: "#045B83", bold: true, border: this.noborderstyle, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('RECOMMENDED ACTION'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('AS LEFT'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }]);
      // rows.push(subTableforHeading);
      AsFoundAccordionItems.forEach((parentAsFoundElement, index) => {
        let subTableforItems = this.getSubTable();
        if (index == 0) {
          subTableforItems.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: this.translator('AS FOUND'), color: "#045B83", bold: true, border: this.noborderstyle, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('RECOMMENDED ACTION'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('AS LEFT'), border: this.noborderstyle, color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }]);
        }
        let headingRow: any[] = [
          this.getBlankColumn(this.translator(parentAsFoundElement.Value)),
          this.getConstructionValue(' ', false),
          this.getConstructionLabel(' ', false),
          this.getConstructionLabel(' ', false),
          this.getConstructionLabel(' ', false),
        ];
        let parentAsLeftElement = AsLeftAccordionItems.filter(item => item.Value == parentAsFoundElement.Value);
        let parentAsLeftRDID_Mobile = parentAsLeftElement.length > 0 ? parentAsLeftElement[0].RDID_Mobile : 0;
        let AsFoundLeftAccordionElements = asFoundLeftData.filter(item => {
          return (item.ParentID_Mobile == parentAsFoundElement.RDID_Mobile || item.ParentID_Mobile == parentAsLeftRDID_Mobile) && item.ElementType != "AccordionListView";
        });

        AsFoundLeftAccordionElements.forEach((item) => {
          let index = 0;
          switch (item.DisplayName) {
            case "As Found Condition":
              index = 2;
              break;
            case "Recommended Action":
              index = 3;
              break;
            case "As Left Conditions":
              index = 4;
              break;
          }
          if (index != 0 && headingRow[index] && item.Value) headingRow[index].text = this.translator(item.Value);
        })
        if (headingRow.filter((item) => item.text != ' ').length > 1) subTableforItems.table.body.push(headingRow);
        let AsFoundAccordionListItems = AsFoundElementsData.filter(item => {
          return item.ParentID_Mobile == parentAsFoundElement.RDID_Mobile && item.ElementType == "AccordionListView";
        });
        AsFoundAccordionListItems.forEach(subParentAsFoundElement => {
          let subParentAsLeftElement = AsLeftElementsData.filter(item => {
            return item.Value == subParentAsFoundElement.Value;
          });
          let subParentAsLeftElementRDID_Mobile = subParentAsLeftElement.length > 0 ? subParentAsLeftElement[0].RDID_Mobile : 0;
          let row: any[] = [
            this.getBlankColumn(' '),
            this.getConstructionValue(this.translator(subParentAsFoundElement.Value), false),
            this.getConstructionLabel(' ', false),
            this.getConstructionLabel(' ', false),
            this.getConstructionLabel(' ', false),
          ];

          let AsFoundLeftAccordionListElements = asFoundLeftData.filter(item => {
            return (item.ParentID_Mobile == subParentAsFoundElement.RDID_Mobile || item.ParentID_Mobile == subParentAsLeftElementRDID_Mobile) && item.ElementType != "AccordionListView";
          });

          AsFoundLeftAccordionListElements.forEach((item) => {
            let index = 0;
            switch (item.DisplayName) {
              case "As Found":
                index = 2;
                break;
              case "Recommended":
                index = 3;
                break;
              case "As Left":
                index = 4;
                break;
            }
            if (index != 0 && row[index] && item.Value) row[index].text = this.translator(item.Value);
          });
          if (row.filter((item) => item.text != ' ').length > 1) subTableforItems.table.body.push(row);
        });
        if (subTableforItems.table.body.length > 1) {
          rows.push(subTableforItems);
        }
      });

      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getAsFoundActuationData', "Error: " + JSON.stringify(err));
    }
    return table;

  }

  getHeadingRowData(combinedActuationData, accordionData) {
    let headingRow: any = [];
    let filtered = combinedActuationData.filter((item) => {
      return item.ParentID_Mobile == accordionData.RDID_Mobile
    });

    if (filtered.length > 0) {
      headingRow = filtered.filter(item => {
        return item.ElementType == Enums.ElementType.SearchDropdown
      });
    }
    return { asFound: headingRow[0].Value, RecommendedAction: headingRow[1].Value, asLeft: headingRow[2].Value }
  }

  getfindingAsLeftHeadingRowData(combinedActuationData, accordionData) {
    // let headingRow: any = [];
    let filtered = combinedActuationData.filter((item) => {
      return item.ParentID_Mobile == accordionData.RDID_Mobile
    });

    if (filtered.length > 0) {
      return { asFoundCondition: filtered[0].Value ? filtered[0].Value : '', asLeftCondition: filtered[1].Value ? filtered[1].Value : '', RecommendedAction: filtered[2].Value ? filtered[2].Value : '' }
    } else {
      return { asFoundCondition: '', asLeftCondition: '', RecommendedAction: '' }
    }
  }


  getPreTestData(pressureData) {
    let table = { columns: [] };
    let preTestAccordionData = pressureData.filter((item) => {
      return item.LookupID == 1025
    });
    try {
      let rows = [];
      let preTestTable = {
        table: {
          widths: ['25%', '25%', '0.2%', '25%', '24%'],
          body: []
        },
        layout: {
          layout: 'noBorders',
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
          }
        },
      };
      for (let i = 0; i < preTestAccordionData.length; i++) {
        let sortedPressureData = this.getPressureGroupTypeData(pressureData, preTestAccordionData[i]);
        if (sortedPressureData.leftData.length > 0) {
          for (let k = 0; k < sortedPressureData.leftData.length; k++) {
            if (k == 0) {
              preTestTable.table.body.push([this.getBlankColumnForPreTest(this.translator((preTestAccordionData[i].Value).toUpperCase())),
              this.getBlankColumn(' '),
              this.getBlankColumn(' '),
              this.getBlankColumn(' '),
              this.getBlankColumn(' ')]);
            }
            let row = [];
            if (sortedPressureData.leftData[k].DisplayName) {
              row.push(this.getConstructionLabelForPressure(this.translator(sortedPressureData.leftData[k].DisplayName), false));
            } else {
              row.push(this.getConstructionLabelForPressure(' ', false))
            }
            if (sortedPressureData.leftData[k].Value) {
              let colSpan = 1;
              if (sortedPressureData.leftData[k].ElementID == 3030 && this.valueProvider.getPressureType() == Enums.PressureType.Power) {
                colSpan = 4
              }
              row.push(this.getConstructionValueForPressure(sortedPressureData.leftData[k].Value, false, colSpan))
            } else {
              row.push(this.getConstructionValueForPressure(' ', false))
            }
            row.push(this.getBlankColumn(' '));
            if (sortedPressureData.rightData[k].DisplayName) {
              row.push(this.getConstructionLabelForPressure(this.translator(sortedPressureData.rightData[k].DisplayName), false))
            } else {
              row.push(this.getConstructionLabelForPressure(' ', false))
            }
            if (sortedPressureData.rightData[k].Value) {
              let colSpan = 1;
              if (sortedPressureData.rightData[k].ElementID == 3030 && this.valueProvider.getPressureType() == Enums.PressureType.Power) {
                colSpan = 4
              }
              row.push(this.getConstructionValueForPressure(sortedPressureData.rightData[k].Value, false, colSpan))
            } else {
              row.push(this.getConstructionValueForPressure(' ', false))
            }

            preTestTable.table.body.push(row);
            if (k == sortedPressureData.leftData.length - 1) {
              preTestTable.table.body.push([this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn(' '), this.getBlankColumn(""), this.getBlankColumn("")]);
              break;
            }
          }
        }
      }
      if (preTestTable.table.body.length > 0) {
        rows.push(preTestTable);
        table.columns.push(rows);
      }
      return table;
    } catch (err) {
      this.logger.log(this.fileName, 'getPreTestData', "Error: " + JSON.stringify(err));
    }
  }

  getPressureData(pressureData, header?) {
    let table = { columns: [] };
    //  console.log("pressureData"+JSON.stringify(pressureData));
    try {
      let rows = [];
      let accordionData = pressureData.filter((item) => {
        return item.ElementType == Enums.ElementType.Accordion && item.LookupID != 1025
      });
      accordionData.forEach((item, index) => {
        let subTableforItems = this.getSubTableForPressure(true, index);
        if (index == 0) {
          subTableforItems.table.body.push([this.getTableHeader(header, 3), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        }
        let headingRow = true;
        let sortedPressureData = this.getPressureAccordionArray(pressureData, item);
        if (sortedPressureData.leftData.length > 0) {
          for (let i = 0; i < sortedPressureData.leftData.length; i++) {
            if (headingRow) {
              subTableforItems.table.body.push([this.getBlankColumn(item.Value),
              this.getConstructionLabelForFindingsWithBorder(this.translator(sortedPressureData.leftData[i].DisplayName), false, "Border"),
              this.getConstructionValueWithBorder(sortedPressureData.leftData[i].Value, false, "Border"), this.getBlankColumnWithBorder(""),
              this.getConstructionLabelForFindingsWithBorder(this.translator(sortedPressureData.rightData[i].DisplayName), false, "Border"),
              this.getConstructionValueWithBorder(sortedPressureData.rightData[i].Value, false, "Border")]);
              headingRow = false;
            } else {
              subTableforItems.table.body.push([this.getBlankColumn(""),
              this.getConstructionLabelForFindingsWithBorder(this.translator(sortedPressureData.leftData[i].DisplayName), false, "Border"),
              this.getConstructionValueWithBorder(sortedPressureData.leftData[i].Value, false, "Border"),
              this.getBlankColumnWithBorder(""),
              this.getConstructionLabelForFindingsWithBorder(this.translator(sortedPressureData.rightData[i].DisplayName), false, "Border"),
              this.getConstructionValueWithBorder(sortedPressureData.rightData[i].Value, false, "Border")]);
            }
          }
        }
        if (subTableforItems.table.body.length > 0) {
          rows.push(subTableforItems);
        }
      })
      table.columns.push(rows);

    } catch (err) {
      this.logger.log(this.fileName, 'getPressureData', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getAddpartsTable(addPartData) {
    let table = { columns: [] };
    try {
      let rows = [];
      let addPartTable = {
        table: {
          widths: ['20%', '20%', '20%', '20%', '20%'],
          body: []
        },
        layout: {
          layout: 'noBorders',
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
          }
        },
      };
      addPartTable.table.body.push([this.getBlankPart("Part"), this.getBlankPart(this.translator("As Found Condition")), this.getBlankPart(this.translator("Recommended Action")), this.getBlankPart(this.translator("Next Service Recommendation")), this.getBlankPart("Comments")]);
      for (let k = 0; k < addPartData.length; k++) {
        let jsonObj = JSON.parse(addPartData[k].Value);
        addPartTable.table.body.push([this.getPartValue(jsonObj[0].DetailedValue), this.getPartValue(jsonObj[1].DetailedValue), this.getPartValue(jsonObj[2].DetailedValue), this.getPartValue(jsonObj[3].DetailedValue), this.getPartValue(jsonObj[4].Value)]);
      }
      rows.push(addPartTable);
      table.columns.push(rows);

    } catch (err) {
      this.logger.log(this.fileName, 'getAddpartsTable', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getAccessoriesList(accessoriesList, header) {
    let table = { columns: [] };
    try {
      let rows = [];
      let accessoryTable = {
        unbreakable: true,
        table: {
          widths: ['100%'],
          body: []
        },
        layout: {
          layout: 'noBorders',
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
          }
        },
      };
      // addPartTable.table.body.push([this.getBlankPart("Part"), this.getBlankPart("As Found Condition"), this.getBlankPart("Recommended Action"), this.getBlankPart("Next Service Recommendation"), this.getBlankPart("Comments")]);
      accessoryTable.table.body.push([{ text: this.translator(header), border: [false, false, false, false], fillColor: "#FFF", color: '#234487', style: 'header' }]);
      accessoryTable.table.body.push([this.getBlankPart(this.translator("Accessories"))]);
      for (let k = 0; k < accessoriesList.length; k++) {
        let jsonObj = JSON.parse(accessoriesList[k].Value);
        accessoryTable.table.body.push([this.getPartValue(jsonObj[0].DetailedValue)]);
      }
      rows.push(accessoryTable);
      table.columns.push(rows);

    } catch (err) {
      this.logger.log(this.fileName, 'getAccessoriesList', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getElementsListCalibration(elementList, header) {
    let table = { columns: [] };
    try {
      let rows = [];
      let accessoryTable = {
        table: {
          widths: ['25%', '25%', '25%', '25%'],
          dontBreakRows: true,
          body: []
        },
        layout: {
          layout: 'noBorders',
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
          }
        },
      };
      // addPartTable.table.body.push([this.getBlankPart("Part"), this.getBlankPart("As Found Condition"), this.getBlankPart("Recommended Action"), this.getBlankPart("Next Service Recommendation"), this.getBlankPart("Comments")]);
      accessoryTable.table.body.push([{ text: this.translator(header), border: [false, false, false, false], fillColor: "#FFF", color: '#234487', style: 'header' }, this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
      accessoryTable.table.body.push([this.getBlankPart(this.translator("Element")), this.getBlankPart(this.translator("Option")), this.getBlankPart(this.translator("Direction")), this.getBlankPart(this.translator("Condition"))]);
      for (let k = 0; k < elementList.length; k++) {
        let jsonObj = JSON.parse(elementList[k].Value);
        accessoryTable.table.body.push([this.getPartValue(jsonObj[0].DetailedValue), this.getPartValue(jsonObj[1].DetailedValue), this.getPartValue(jsonObj[2].DetailedValue), this.getPartValue(jsonObj[3].DetailedValue)]);
      }
      rows.push(accessoryTable);
      table.columns.push(rows);

    } catch (err) {
      this.logger.log(this.fileName, 'getElementsListCalibration', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getElementsListSolution(elementList, header) {
    let table = { columns: [] };
    try {
      let rows = [];
      let accessoryTable = {
        table: {
          widths: ['16%', '16%', '16%', '16%', '16%', '16%'],
          body: []
        },
        layout: {
          layout: 'noBorders',
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
          }
        },
      };
      // addPartTable.table.body.push([this.getBlankPart("Part"), this.getBlankPart("As Found Condition"), this.getBlankPart("Recommended Action"), this.getBlankPart("Next Service Recommendation"), this.getBlankPart("Comments")]);
      accessoryTable.table.body.push([{ text: this.translator(header), border: [false, false, false, false], fillColor: "#FFF", color: '#234487', style: 'header', colSpan: 2 }, this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
      accessoryTable.table.body.push([this.getBlankPart(this.translator("Element")), this.getBlankPart(this.translator("Option")), this.getBlankPart(this.translator("Direction")), this.getBlankPart(this.translator("Condition")), this.getBlankPart(this.translator("Recommended Action")), this.getBlankPart(this.translator("Result"))]);
      for (let k = 0; k < elementList.length; k++) {
        let jsonObj = JSON.parse(elementList[k].Value);
        accessoryTable.table.body.push([this.getPartValue(jsonObj[0].DetailedValue), this.getPartValue(jsonObj[1].DetailedValue), this.getPartValue(jsonObj[2].DetailedValue), this.getPartValue(jsonObj[3].DetailedValue), this.getPartValue(jsonObj.length > 4 ? jsonObj[4].DetailedValue : " "), this.getPartValue(jsonObj.length > 4 ? jsonObj[5].DetailedValue : " ")]);
      }
      rows.push(accessoryTable);
      table.columns.push(rows);

    } catch (err) {
      this.logger.log(this.fileName, 'getElementsListSolution', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getPressureAccordionArray(pressureData, accordionData) {
    let leftData = [];
    let rightData = [];
    let allData = pressureData.filter(item => {
      return (item.ParentID_Mobile == accordionData.RDID_Mobile);
    });
    if (allData.length > 0) {
      for (let i = 0; i < allData.length; i++) {
        if (i % 2 == 0) {
          if (allData[i].ElementType == Enums.ElementType.Date) {
            if (this.isNotNull(allData[i].Value)) {
              allData[i].Value = moment(allData[i].Value).format('DD-MMM-YYYY')
            }
          } else if (allData[i].ElementType == Enums.ElementType.Time) {
            if (this.isNotNull(allData[i].Value)) {
              allData[i].Value = moment(allData[i].Value).format('HH:mm')
            }
          }
          leftData.push(allData[i])
        }
        if (i % 2 == 1) {
          if (allData[i].ElementType == Enums.ElementType.Date) {
            if (this.isNotNull(allData[i].Value)) {
              allData[i].Value = moment(allData[i].Value).format('DD-MMM-YYYY')
            }
          } else if (allData[i].ElementType == Enums.ElementType.Time) {
            if (this.isNotNull(allData[i].Value)) {
              allData[i].Value = moment(allData[i].Value).format('HH:mm')
            }
          }
          rightData.push(allData[i])
        }
      }
      let missingRow = leftData.length - rightData.length;
      if (missingRow > 0) {
        for (let j = 0; j < missingRow; j++) {
          rightData.push({ DisplayName: '', Value: '' });
        }
      }
    }
    return { "leftData": leftData, "rightData": rightData }
  }

  getFindingsAccordionArray(pressureData, accordionData) {
    let leftData = [];
    let rightData = [];
    let allData = pressureData.filter(item => {
      return ((item.ParentID_Mobile == accordionData.RDID_Mobile));
    });
    if (allData.length > 0) {
      for (let i = 0; i < allData.length; i++) {
        if (i % 2 == 0) {
          if (allData[i].ElementType == Enums.ElementType.Date) {
            allData[i].Value = moment(allData[i].Value).format('DD-MMM-YYYY')
          } else if (allData[i].ElementType == Enums.ElementType.Time) {
            allData[i].Value = moment(allData[i].Value).format('HH:mm')
          }
          leftData.push(allData[i])
        }
        if (i % 2 == 1) {
          if (allData[i].ElementType == Enums.ElementType.Date) {
            allData[i].Value = moment(allData[i].Value).format('DD-MMM-YYYY')
          } else if (allData[i].ElementType == Enums.ElementType.Time) {
            allData[i].Value = moment(allData[i].Value).format('HH:mm')
          }
          rightData.push(allData[i])
        }
      }
      let missingRow = leftData.length - rightData.length;
      if (missingRow > 0) {
        for (let j = 0; j < missingRow; j++) {
          rightData.push({ DisplayName: '', Value: '' });
        }
      }
    }
    return { "leftData": leftData, "rightData": rightData }
  }

  generateCommonData(ElementsArr) {
    let leftData = [];
    let rightData = [];
    let allData = ElementsArr;
    if (allData.length > 0) {
      for (let i = 0; i < allData.length; i++) {
        if (allData[i].ElementID == 130095 || allData[i].ElementID == 130100 || allData[i].ElementID == 1045) {
          allData[i].Value = allData[i].DetailedValue;
        }

        if (i % 2 == 0) {
          if (allData[i].ElementType == Enums.ElementType.Date) {
            if (allData[i].Value)
              allData[i].Value = moment(allData[i].Value).format('DD-MMM-YYYY')
          } else if (allData[i].ElementType == Enums.ElementType.Time) {
            if (allData[i].Value)
              allData[i].Value = moment(allData[i].Value).format('HH:mm')
          }
          leftData.push(allData[i])
        }
        if (i % 2 == 1) {
          if (allData[i].ElementType == Enums.ElementType.Date) {
            if (allData[i].Value)
              allData[i].Value = moment(allData[i].Value).format('DD-MMM-YYYY')
          } else if (allData[i].ElementType == Enums.ElementType.Time) {
            if (allData[i].Value)
              allData[i].Value = moment(allData[i].Value).format('HH:mm')
          }
          rightData.push(allData[i])
        }
      }
      let missingRow = leftData.length - rightData.length;
      if (missingRow > 0) {
        for (let j = 0; j < missingRow; j++) {
          rightData.push({ DisplayName: '', Value: '' });
        }
      }
    }
    return { "leftData": leftData, "rightData": rightData }
  }
  getPressureGroupTypeData(pressureData, accordionData) {
    let leftData = [];
    let rightData = [];
    let allData = pressureData.filter(item => {
      return (item.ParentID_Mobile == accordionData.RDID_Mobile);
    });
    let PressureGroupData = [];
    let PreTestGroupData = [];
    for (let k = 0; k < allData.length; k++) {
      if (allData[k].PDFArgs) {
        let args = JSON.parse(allData[k].PDFArgs);
        if (args.GroupType == Enums.PdfGroupType.PressureGroup) {
          PressureGroupData.push(allData[k]);
        } else if (args.GroupType == Enums.PdfGroupType.PreTestGroup) {
          PreTestGroupData.push(allData[k]);
        }
      }
    }
    if (PressureGroupData.length > 0) {
      for (let i = 0; i < PressureGroupData.length; i++) {
        if (i % 2 == 0) {
          if (PressureGroupData[i].ElementType == Enums.ElementType.Date) {
            if (this.isNotNull(PressureGroupData[i].Value)) {
              PressureGroupData[i].Value = moment(PressureGroupData[i].Value).format('DD-MMM-YYYY')
            }
          } else if (PressureGroupData[i].ElementType == Enums.ElementType.Time) {
            if (this.isNotNull(PressureGroupData[i].Value)) {
              PressureGroupData[i].Value = moment(PressureGroupData[i].Value).format('HH:mm')
            }
          }
          leftData.push(PressureGroupData[i])
        }
        if (i % 2 == 1) {
          if (PressureGroupData[i].ElementType == Enums.ElementType.Date) {
            if (this.isNotNull(PressureGroupData[i].Value)) {
              PressureGroupData[i].Value = moment(PressureGroupData[i].Value).format('DD-MMM-YYYY')
            }
          } else if (PressureGroupData[i].ElementType == Enums.ElementType.Time) {
            if (this.isNotNull(PressureGroupData[i].Value)) {
              PressureGroupData[i].Value = moment(PressureGroupData[i].Value).format('HH:mm')
            }
          }
          rightData.push(PressureGroupData[i])
        }
      }
      let missingRow = leftData.length - rightData.length;
      if (missingRow > 0) {
        for (let j = 0; j < missingRow; j++) {
          rightData.push({ DisplayName: '', Value: '' });
        }
      }
    }
    if (PreTestGroupData.length > 0) {
      for (let i = 0; i < PreTestGroupData.length; i++) {
        if (i % 2 == 0) {
          if (PreTestGroupData[i].ElementType == Enums.ElementType.Date) {
            if (this.isNotNull(PreTestGroupData[i].Value)) {
              PreTestGroupData[i].Value = moment(PreTestGroupData[i].Value).format('DD-MMM-YYYY')
            }
          } else if (PreTestGroupData[i].ElementType == Enums.ElementType.Time) {
            if (this.isNotNull(PressureGroupData[i].Value)) {
              PreTestGroupData[i].Value = moment(PreTestGroupData[i].Value).format('HH:mm')
            }
          }
          leftData.push(PreTestGroupData[i])
        }
        if (i % 2 == 1) {
          if (PreTestGroupData[i].ElementType == Enums.ElementType.Date) {
            if (this.isNotNull(PreTestGroupData[i].Value)) {
              PreTestGroupData[i].Value = moment(PreTestGroupData[i].Value).format('DD-MMM-YYYY')
            }
          } else if (PreTestGroupData[i].ElementType == Enums.ElementType.Time) {
            if (this.isNotNull(PreTestGroupData[i].Value)) {
              PreTestGroupData[i].Value = moment(PreTestGroupData[i].Value).format('HH:mm')
            }
          }
          rightData.push(PreTestGroupData[i])
        }
      }
      let missingRow = leftData.length - rightData.length;
      if (missingRow > 0) {
        for (let j = 0; j < missingRow; j++) {
          rightData.push({ DisplayName: '', Value: '' });
        }
      }
    }
    return { "leftData": leftData, "rightData": rightData }
  }

  getCommentText(findingsData) {
    let comment = findingsData.ElementType == Enums.ElementType.TextArea ? findingsData.Value : "";
    return comment;
  }
  //TODO: By Zohaib

  getOptionalTableNotListView(filteredOptionalData) {
    let table = { columns: [] };
    // let value: any = "";
    try {
      let rows = [];
      // console.log("filteredOptionalData"+JSON.stringify(filteredOptionalData));
      let optionalAccordion = filteredOptionalData.filter((item) => {
        return item.ElementType == Enums.ElementType.Accordion
      });
      if (optionalAccordion.length > 0) {
        for (let k = 0; k < optionalAccordion.length; k++) {
          if (optionalAccordion[k].Value == "Valve Pre-Test Data" || optionalAccordion[k].Value == "Controller Construction") {
            let optionalNonListTable = this.getOptionalNonListTable();
            let subHeadingRow = true;
            let nonListViewData = this.getNonListViewData(filteredOptionalData, optionalAccordion[k]);
            if (nonListViewData) {
              for (let i = 0; i < nonListViewData.length; i++) {
                // value = nonListViewData[i].Value;
                if (nonListViewData[i].Value && nonListViewData[i].Value != '') {
                  if (subHeadingRow) {
                    optionalNonListTable.table.body.push([this.getBlankColumn(optionalAccordion[k].Value), this.getConstructionLabelForFindingsWithBorder(this.translator(nonListViewData[i].DisplayName), false, "Border"), this.getConstructionValueWithBorder(nonListViewData[i].Value, false, "Border")]);
                    subHeadingRow = false;
                  }
                  else {
                    optionalNonListTable.table.body.push([this.getBlankColumn(''), this.getConstructionLabelForFindingsWithBorder(this.translator(nonListViewData[i].DisplayName), false, "Border"), this.getConstructionValueWithBorder(nonListViewData[i].Value, false, "Border")]);
                  }
                }
              }
            }
            if (optionalNonListTable.table.body.length == 0) {
              optionalNonListTable.table.body.push([]);
            }
            rows.push(optionalNonListTable);
          }
        }
        // if (optionalNonListTable.table.body.length == 0) {
        //   optionalNonListTable.table.body.push([]);
        // }

        table.columns.push(rows);
      }
    } catch (err) {
      this.logger.log(this.fileName, 'getSolutionTable', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getOptionalNonListTable(){
    let optionalNonListTable : any = {
      unbreakable: true,
      table: {
        widths: ['11%', '49%', '39%'],
        body: []
      },
      layout: {
        hLineWidth: function (i, node) {
          return (i === 0) || i === node.table.body.length ? 1.4 : 0;
        },
        vLineWidth: function (i, node) {
          return (i === 1 || i === node.table.widths.length) ? 1.4 : 0;
        },
        hLineColor: function (i, node) {
          return (i === 0) || i === node.table.body.length ? '#4d8dd1' : '';
        },
        vLineColor: function (i, node) {
          return (i === 1 || i === node.table.widths.length) ? '#4d8dd1' : '';
        },
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
        }
      },
    };
    return optionalNonListTable;
  }
  getNonListViewData(optionalData, accordionData) {
    let filteredOptionalData = optionalData.filter(item => {
      return item.ParentID_Mobile == accordionData.RDID_Mobile && item.ElementType != Enums.ElementType.AccordionListView
    });
    return filteredOptionalData
  }
  // getOptionalTable(reportData) {
  //   let table = { columns: [] };
  //   let parentHeading = true;
  //   let headingRowforLine = true;
  //   let headingRowforColor = true;
  //   try {
  //     //  let reportData = this.valueProvider.getreportData();
  //     let rows = [];
  //     let optionalData = reportData.filter((item) => {
  //       return item.WorkFlowID == 14
  //     });
  //     let accordionData = optionalData.filter((item) => {
  //       return (item.ElementType == Enums.ElementType.Accordion) && item.Value != 'Valve Pre-Test Data'
  //     });
  //     let count = 0;
  //     accordionData.forEach((parentData, index) => {
  //       let optionalHeadingTable = this.getSubOptionalTable(index);
  //       let optionalTable = this.getSubOptionalTable(index);
  //       let headingRow = true;
  //       for (let i = 0; i < optionalData.length; i++) {
  //         if ((parentData.RDID_Mobile == optionalData[i].ParentID_Mobile) && optionalData[i].ElementType == "AccordionListView") {
  //           let zerothValue = this.getZerothValue(optionalData[i], optionalData)
  //           if ((optionalData[i].Value && optionalData[i].Value != '') && (zerothValue && zerothValue != "")) {
  //             if (parentHeading) {
  //               optionalHeadingTable.table.body.push([this.getBlankColumn(' '), this.getBlankColumn(' '), { text: 'As Found', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", alignment: 'left', border: this.noborderstyle }, { text: 'As Left', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", alignment: 'left', border: this.noborderstyle }]);
  //               rows.push(optionalHeadingTable);
  //               parentHeading = false;
  //             }
  //             if (headingRow) {
  //               optionalTable.table.body.push([this.getBlankColumn(parentData.Value), this.getConstructionValueWithBorder(optionalData[i].Value, false, "Border"), this.getConstructionLabelForFindingsWithBorder(this.getZerothValue(optionalData[i], optionalData), false, "Border"), this.getConstructionLabelForFindingsWithBorder(this.getFirstValue(optionalData[i], optionalData), false, "Border")]);
  //               headingRow = false;
  //             } else {
  //               optionalTable.table.body.push([this.getBlankColumn(' '), this.getConstructionValueWithBorder(optionalData[i].Value, false, "Border"), this.getConstructionLabelForFindingsWithBorder(this.getZerothValue(optionalData[i], optionalData), false, "Border"), this.getConstructionLabelForFindingsWithBorder(this.getFirstValue(optionalData[i], optionalData), false, "Border")]);
  //             }
  //           }
  //         }
  //       }
  //       let filteredReportData = optionalData.filter((item) => {
  //         return item.ElementID == 130359 || item.ElementID == 268 || item.ElementID == 269 || item.ElementID == 270
  //       });
  //       if ((optionalTable.table.body.length > 0 && filteredReportData.length == 0) && count == 0) {
  //         optionalHeadingTable.table.body.unshift([this.getTableHeader(this.translator('OPTIONAL SERVICES'), 2), this.getBlankColumn(' '), this.getBlankColumn(' '), this.getBlankColumn(' ')]);
  //         count++;
  //       }
  //       // if (optionalTable.table.body.length == 0) {
  //       //   optionalTable.table.body.push([]);
  //       // }
  //       if (optionalTable.table.body.length > 0) {
  //         rows.push(optionalTable);
  //       }
  //       // }
  //     });


  //     table.columns.push(rows);

  //   } catch (err) {
  //     this.logger.log(this.fileName, 'getOptionalTable', "Error: " + JSON.stringify(err));
  //   }
  //   return table;
  // }

  getSubOptionalTable(index?) {
    let optionalTable: any = {
      unbreakable: true,
      table: {
        widths: ['15%', '17%', '20%', '20%'],
        body: []
      },
      layout: {
        hLineWidth: function (i, node) {
          return ((i === 0) || i === node.table.body.length) ? 0.7 : 0;
        },
        vLineWidth: function (i, node) {
          return (i === 1 || i === node.table.widths.length) ? 1.4 : 0;
        },
        hLineColor: function (i, node) {
          return ((i === 0) || i === node.table.body.length) ? '#4d8dd1' : '';
        },
        vLineColor: function (i, node) {
          return ((i === 1) || i === node.table.widths.length) ? '#4d8dd1' : '';
        },
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
        }
      },
    };
    return optionalTable;
  }

  getZerothValue(subHeadingData, WorkFlowID11Data) {

    let subHeadingValues = WorkFlowID11Data.filter(item => {
      return item.ParentID_Mobile == subHeadingData.RDID_Mobile;
    });
    if (subHeadingValues.length > 0) {
      return subHeadingValues[0].Value
    } else {
      return " ";
    }
  }
  getFirstValue(subHeadingData, WorkFlowID11Data) {

    let subHeadingValues = WorkFlowID11Data.filter(item => {
      return item.ParentID_Mobile == subHeadingData.RDID_Mobile;
    });
    if (subHeadingValues.length > 1) {
      return subHeadingValues[1].Value
    } else {
      return " ";
    }
  }
  getSecondValue(subHeadingData, WorkFlowID11Data) {

    let subHeadingValues = WorkFlowID11Data.filter(item => {
      return item.ParentID_Mobile == subHeadingData.RDID_Mobile;
    });
    if (subHeadingValues.length > 2) {
      return subHeadingValues[2].Value
    } else {
      return " ";
    }
  }

  getCalibrationTable(reportData, calibrationData, techName?) {
    let table = { columns: [] };
    let rows = [];
    // console.log("calibrationData"+JSON.stringify(calibrationData));
    table = this.getCalibrationData(table, rows, reportData, calibrationData, techName);
    //table.columns.push(rows);

    return table;
  }

  getAttachmentsTable(attachmentData) {

    let table = {
      margin: [0, 15, 0, 0],
      widths: [],
      dontBreakRows: true,
      body: []
    };
    try {
      // 03/19/2019 -- Mayur Varshney -- set width to 50% for displaying two images in a row
      let width = (100 / 2).toFixed(2).toString() + "%";
      //  let valueColumns = this.valueProvider.getAttachmentForDisplay();
      //Array.from(new Set(valueColumns.map((itemInArray) => itemInArray.app)))
      let valueColumns = attachmentData;
      let validVC = valueColumns.filter((vc) => { return vc.base64 });
      if (valueColumns && validVC.length > 0) {
        // 03/19/2019 -- Mayur Varshney -- set with for 2 variable in a array for displaying two images in a row
        // table.widths = [width, width, width, width, width, width];
        table.widths = [width, width];
        for (let k = 0; k < valueColumns.length; k++) {
          let valueColumn = valueColumns[k];
          if(valueColumn.base64) {
            let image = valueColumn.base64;
            let imageCol: any = {
              table: {
                heights: [60, 20],
                body: [
                  //03/19/2019 -- Mayur Varshney -- set width and height for displaying two images in a row
                  [{ columns: [{ image: image, border: this.noborderstyle, width: 320, height: 200, alignment: 'center' }], margin: [12, 0, 0, 0] }],
                  [{ columns: [{ text: valueColumn.DetailedValue, border: this.noborderstyle, width: 300, alignment: 'center' }], margin: [12, 0, 0, 0] }]]
              }, alignment: 'center', border: this.noborderstyle, layout: 'noBorders',
            };
            // Create a new attachment row if there is now row, or, if last row has reached 6 items
            // 03/19/2019 -- Mayur Varshney -- Create a new attachment row if there is now row, or, if last row has reached 2 items
            if (table.body.length == 0 || table.body[table.body.length - 1].length == 2) {
              table.body.push([]);
            }
            // Push a new Image column to the last row
            table.body[table.body.length - 1].push(imageCol);
          }
        }
        // 28-06-2018 GS: Add remaining blank columns in last row to complete 6 columns in a row.
        // 03/19/2019 -- Mayur Varshney -- Add remaining blank columns in last row to complete 2 columns in a row
        while (table.body[table.body.length - 1].length < 2) {
          let blankCol: any = { text: '', border: this.noborderstyle };
          table.body[table.body.length - 1].push(blankCol);
        }
      }
      if (table.body.length == 0) {
        table.body.push([]);
      }
    } catch (err) {
      this.logger.log(this.fileName, 'getAttachmentsTable', "Error: " + JSON.stringify(err));
    }
    return { style: 'datatable', table: table };
  }

  getAttachmentsTableWithHeader(attachmentData, header) {

    let table = {
      margin: [0, 15, 0, 0],
      widths: ["*"],
      dontBreakRows: false,
      body: []
    };
    try {
      // 03/19/2019 -- Mayur Varshney -- set width to 50% for displaying two images in a row
      // let width = (100 / 2).toFixed(2).toString() + "%";
      // let rows = [];
      //  let valueColumns = this.valueProvider.getAttachmentForDisplay();
      //Array.from(new Set(valueColumns.map((itemInArray) => itemInArray.app)))
      let valueColumns = attachmentData;
      let validVC = valueColumns.filter((vc) => { return vc.base64 });
      if (valueColumns && validVC.length > 0) {
        // 03/19/2019 -- Mayur Varshney -- set with for 2 variable in a array for displaying two images in a row
        // table.widths = [width, width, width, width, width, width];
        // table.widths = [width, width];
        // table.body.push([[{ text: this.translator(header), color: '#234487', style: 'header', border: this.noborderstyle }]]);
        for (let k = 0; k < valueColumns.length; k++) {
          let valueColumn = valueColumns[k];
          if(valueColumn.base64) {
            let image = valueColumn.base64;
            let imageCol: any = {
              table: {
                heights: [1, 60, 20],
                body: [
                  //03/19/2019 -- Mayur Varshney -- set width and height for displaying two images in a row
                  // [{ image: image, border: this.noborderstyle, width: 300, height: 200, alignment: 'center' }],
                  // [{ columns: [{ text: valueColumn.DetailedValue, border: this.noborderstyle, width: 270, alignment: 'left' }], margin: [20, 0, 0, 0] }]]
                  [{ columns: [{ width: '*', text: '' }, { width: 'auto', table: { heights: 200, body: [[{ image: image, border: this.noborderstyle, fit: [330, 330], alignment: 'center' }],] } }, { width: '*', text: '' },] }],
                  [{ columns: [{ text: valueColumn.DetailedValue, border: this.noborderstyle, width: 270, alignment: 'center' }] }]
                ]
              }, alignment: 'left', border: this.noborderstyle, layout: 'noBorders',
            };
            if (k == 0) {
              imageCol.table.body.unshift([{ columns: [{ text: this.translator(header), color: '#234487', style: 'header', border: this.noborderstyle, width: 300, alignment: 'left' }] }]);
            } else {
              imageCol.table.body.unshift([{ columns: [{ text: "  ", border: this.noborderstyle, width: 300, alignment: 'left', style: 'header' }] }])
            }

            // Create a new attachment row if there is now row, or, if last row has reached 6 items
            // 03/19/2019 -- Mayur Varshney -- Create a new attachment row if there is now row, or, if last row has reached 2 items
            if (table.body.length == 0 || (table.body[table.body.length - 1][0][0] && table.body[table.body.length - 1][0][0].table.body[0].length == 2)) {
              table.body.push(
                [[{
                  table: {
                    widths: ['50%', '50%'],
                    dontBreakRows: true,
                    body: [[]],
                    border: this.noborderstyle
                  }, layout: 'noBorders',
                }]]);
            }
            // Push a new Image column to the last row
            if (table.body[table.body.length - 1][0][0])
              table.body[table.body.length - 1][0][0].table.body[0].push(imageCol);
          }
        }
        // 28-06-2018 GS: Add remaining blank columns in last row to complete 6 columns in a row.
        // 03/19/2019 -- Mayur Varshney -- Add remaining blank columns in last row to complete 2 columns in a row
        while (table.body[table.body.length - 1][0][0].table.body[0].length < 2) {
          let blankCol: any = { text: '', border: this.noborderstyle };
          table.body[table.body.length - 1][0][0].table.body[0].push(blankCol);
        }
      }

      if (table.body.length == 0) {
        table.body.push([]);
      } else {
        // let headerData = [];
        // headerData.push({ text: this.translator(header), color: '#234487', style: 'header', border: this.noborderstyle });
        // headerData.push({ text: "", color: '#234487', style: 'header', border: this.noborderstyle });
        // table.body[0][0][0].table.body.unshift(headerData);
      }
    } catch (err) {
      this.logger.log(this.fileName, 'getAttachmentsTable', "Error: " + err.message);
    }
    return { style: 'datatable', table: table, layout: 'noBorders' };
  }



  getCalibrationData(table, rows, reportData, calibrationData, techName?) {
    let parentAsFoundHeading = true;
    let parentAsLeftHeading = true;
    let WorkFlowGroupID = this.valueProvider.getWorkFlowGroupID();
    if (WorkFlowGroupID == Enums.WorkflowGroup.FlowIsolationGroup) {
      calibrationData = reportData.filter((item) => {
        return item.WorkFlowID == 10 || item.WorkFlowID == 36
      })
    }

    // let accordionData = calibrationData.filter((item) => {
    //   return item.ElementType == Enums.ElementType.Accordion
    // });
    // let allCalibrationData = [];
    // for (let i = 0; i < accordionData.length; i++) {
    //   for (let k = 0; k < calibrationData.length; k++) {
    //     if ((accordionData[i].RDID_Mobile == calibrationData[k].ParentID_Mobile) && calibrationData[k].ElementType != Enums.ElementType.ActionButtonFileUpload) {
    //       allCalibrationData.push(calibrationData[k])
    //     }
    //   }
    // }
    let asFoundArr = [];
    let asLeftArr = [];

    if (WorkFlowGroupID == Enums.WorkflowGroup.FlowIsolationGroup) {
      let ElementsArr = [185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195];
      let asLeftElementsArrr = [2039, 2041, 2042, 2043, 2045, 2047, 2049, 2051, 2053, 2055, 2057, 2059, 2051]
      for (let j = 0; j < reportData.length; j++) {
        if (ElementsArr.indexOf(reportData[j].ElementID) > -1) {
          asFoundArr.push(reportData[j]);
        }
        else if (asLeftElementsArrr.indexOf(reportData[j].ElementID) > -1) {
          asLeftArr.push(reportData[j]);
        }
      }
    }
    if (asFoundArr.length > 0) {
      let leftinnerTable = {
        unbreakable: true,
        table: {
          widths: ['0.5%', '45%', '54%'],
          body: []
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 1) || i === node.table.body.length ? 1.4 : 0;
          },
          vLineWidth: function (i, node) {
            return (i === 1 || i === node.table.widths.length) ? 1.4 : 0;
          },
          hLineColor: function (i, node) {
            return (i === 1) || i === node.table.body.length ? '#4d8dd1' : '';
          },
          vLineColor: function (i, node) {
            return (i === 1 || i === node.table.widths.length) ? '#4d8dd1' : '';
          },
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
          }
        },
      };
      for (let i in asFoundArr) {
        if (asFoundArr[i].Value) {
          if (parentAsFoundHeading) {
            leftinnerTable.table.body.push([this.getBlankColumn(''), { text: this.translator('CALIBRATION (AS FOUND)'), color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", border: this.noborderstyle }, this.getBlankColumn(' ')]);
            parentAsFoundHeading = false;
          }
          leftinnerTable.table.body.push([this.getBlankColumn(''), this.getConstructionLabelForFindingsWithBorder(this.translator(asFoundArr[i].DisplayName), false, "Border"), this.getConstructionValueWithBorder(asFoundArr[i].Value, false, "Border")]);
        }
      }
      if (leftinnerTable.table.body.length == 0) {
        leftinnerTable.table.body.push([]);
      }
      rows.push(leftinnerTable);
      table.columns.push(rows);
      rows = [];
    }
    if (asLeftArr.length > 0) {
      let rightinnerTable = {
        unbreakable: true,
        table: {
          widths: ['0.5%', '45%', '45%'],
          body: []
        },
        layout: {
          hLineWidth: function (i, node) {
            return  i === node.table.body.length ? 1.4 : 0;
          },
          vLineWidth: function (i, node) {
            return (i === 1 || i === node.table.widths.length) ? 1.4 : 0;
          },
          hLineColor: function (i, node) {
            return  i === node.table.body.length ? '#4d8dd1' : '';
          },
          vLineColor: function (i, node) {
            return (i === 1 || i === node.table.widths.length) ? '#4d8dd1' : '';
          },
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#C9D9A9' : '#DEEBC3';
          }
        },
      };

      let newrightinnerTable = {
        unbreakable: true,
        table: {
          widths: ['0.5%', '45%', '45%'],
          body: []
        },
        layout: {
          hLineWidth: function (i, node) {
            return  (i === 0) || i === node.table.body.length ? 1.4 : 0;
          },
          vLineWidth: function (i, node) {
            return   (i === 2) || (i === 1)  || (i === node.table.widths.length) ? 1.4 : 0;
          },
          hLineColor: function (i, node) {
            return  (i === 0) || i === node.table.body.length ? '#4d8dd1' : '';
          },
          vLineColor: function (i, node) {
            return  (i === 2) || (i === 1)  || (i === node.table.widths.length) ? '#4d8dd1' : '';
          },
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#C9D9A9' : '#DEEBC3';
          }
        },
      };
      for (let k in asLeftArr) {
        if (asLeftArr[k].Value) {
          if (parentAsLeftHeading) {
            newrightinnerTable.table.body.push([this.getBlankColumn(' '), { text: this.translator('CALIBRATION (AS LEFT)'), color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", border: [false, false, false, true] }, techName ? { text: this.translator("Technician :") + techName, color: "#045B83", bold: true, fontSize: 10, fillColor: "#e5e6e8", alignment: 'left' } : this.getBlankColumnTech()]);
            parentAsLeftHeading = false;
          }
          rightinnerTable.table.body.push([this.getBlankColumn(' '), this.getConstructionLabelForFindingsWithBorder(this.translator(asLeftArr[k].DisplayName), false, "Border"), this.getConstructionValueWithBorder(asLeftArr[k].Value, false, "Border")]);
        }
      }
      // console.log("rightinnerTableLength" + rightinnerTable.table.body.length);
      if (rightinnerTable.table.body.length == 0) {
        rightinnerTable.table.body.push([]);
      }
      rows.push(newrightinnerTable);
      rows.push(rightinnerTable);
      table.columns.push(rows);
      rows = [];
    }
    return table;
  }


  allWorkFlow: any = {};
  currentReport: any = {};

  getAllWorkFlows(currentReport) {
    return new Promise((resolve, reject) => {
      this.currentReport = currentReport;
      this.localService.getAllWorkFlows().then(res => {
        this.allWorkFlow = res;
        resolve(this.allWorkFlow);
      }).catch((error) => {
        reject(error);
      });
    })
  }

  getBlankColumnTech() {
    return { text: "", color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", alignment: 'center', border: [false, false, false, true] }
  }

  getHeaderSection(currentReport, reportData) {
    let emersonLogo = 'emerson.png';
    let centerSection = this.translator('REPAIR REPORT');
    let rightSection = "";
    let repairType = "";
    let repairDate = reportData.filter((item) => {
      return item.ElementID == 130102
    })[0].Value
    for (let k in reportData) {
      if (reportData[k].ElementID == 130107) {
        if (reportData[k].Value == true || reportData[k].Value == 'true') {
          repairType = this.translator(reportData[k].DisplayName);
          break;
        }

      }
      if (reportData[k].ElementID == 130108) {
        if (reportData[k].Value == true || reportData[k].Value == 'true') {
          repairType = this.translator(reportData[k].DisplayName);
          break;
        }
      }
      if (reportData[k].ElementID == 130106) {
        if (reportData[k].Value == 'Yes') {
          repairType = this.translator(reportData[k].DisplayName);
          break;
        }
      }
    }
    this.repType = repairType;
    let headerTable;
    try {
      //Currently Setting BusinessGroup As Default Final Control
      rightSection = currentReport.Business_Group == Enums.BusinessGroup.Final_Control ? "Final Control" : "Final Control"
      let CreatedBy = this.valueProvider.getUser().Name;
      let header = [];
      header.push()
      headerTable = {
        "table": {
          "widths": ["100%"],
          "body":
            [
              [
                {
                  "table": {
                    "widths": ["25%", "40%", "35%"],
                    "body": [[
                      {
                        "image": emersonLogo,
                        "border": [false, false, false, false],
                        "margin": [12, 10, 12, 10],
                        "width": 70
                      },
                      {
                        "text": centerSection,
                        "border": [false, false, false, false],
                        "margin": [28, 20, 24, 20],
                        "bold": true,
                        "color": '#045B83',
                        "alignment": "center",
                        "fontSize": "15"
                      },
                      {
                        "text": rightSection,
                        "border": [false, false, false, false],
                        "margin": [24, 25, 24, 20],
                        "alignment": "right",
                        "bold": true,
                        "fontSize": "13",
                        "color": "#939393"

                      }]]
                  },
                  layout: 'noBorders'
                }],
              [{
                "table": {
                  "body": [
                    [
                      {
                        "text": this.translator("Repair Date") + ":",
                        "border": [false, false, false, false],
                        "margin": [12, 3, 0, 3],
                        "fontSize": "10"
                      },
                      {
                        //01/17/2019 Zohaib Khan -- TODO: Shivansh -- Repair Date should be formatted as dd/mm/yyyy
                        "text": repairDate ? moment(repairDate).format('DD-MMM-YYYY') : "  ",
                        "border": [false, false, false, false],
                        "margin": [0, 3, 0, 3],
                        "fontSize": "10",
                        "fillColor": "#EAEAEA"
                      },
                      {
                        "text": this.translator("Created By") + ":",
                        "border": [false, false, false, false],
                        "margin": [35, 3, 0, 3],
                        "fontSize": "10"
                      },
                      {
                        "text": CreatedBy,
                        "border": [false, false, false, false],
                        "margin": [0, 3, 0, 3],
                        "fontSize": "10",
                        "fillColor": "#EAEAEA"
                      },
                      {
                        "text": this.translator("Job ID") + ":",
                        "border": [false, false, false, false],
                        "margin": [35, 3, 0, 3],
                        "fontSize": "11",

                      },
                      {
                        "text": currentReport.JobID ? currentReport.JobID : "       ",
                        "border": [false, false, false, false],
                        "margin": [0, 3, 0, 3],
                        "fontSize": "10",
                        "fillColor": "#EAEAEA"

                      },
                      {
                        "text": this.translator("Repair Type") + ":",
                        "border": [false, false, false, false],
                        "margin": [35, 3, 0, 3],
                        "fontSize": "11"
                      },
                      {
                        "text": repairType,
                        "border": [false, false, false, false],
                        "margin": [(repairType ? 0 : 40), 3, 5, 3],
                        "fontSize": "10",
                        "fillColor": "#EAEAEA"
                      }
                    ]
                  ]

                },
                layout: 'noBorders'
              }]
            ]
        },
        layout: 'noBorders'

      };
    } catch (err) {
      this.logger.log(this.fileName, 'getHeaderSection', "Error: " + err);
      throw new Error("Error in getHeaderSection: " + err);
    }
    //Shivansh Subnani
    // Do Not Show Job ID in case of pressure
    if (this.valueProvider.getWorkFlowGroupID() == Enums.WorkflowGroup.PressureGroup) {
      headerTable.table.body[1][0].table.body[0].splice(4, 2)
    };
    return headerTable;
  }

  getStyles() {
    return {
      header: {
        fontSize: 10,
        bold: true,
        margin: [0, 5, 0, 5]
      },
      additionalSection: {
        fontSize: 15,
        bold: true,
        margin: [0, 5, 0, 5]
      },
      customerdetailheader: {
        margin: 10
      },
      subheader: {
        fontSize: 9,
        bold: true,
        margin: [0, 2, 0, 0]
      },
      story: {
        fontSize: 9
      },
      nobordercell: {
        border: [false, false, false, false],
      },
      datatable: {
        fontSize: 9,
        border: [false, false, false, false],
      },
      tablerow: {
      }
    };
  }

  getstaticIcons() {
    let icons = ["emerson.png", "checkedboximg.png", "uncheckedboximg.png"];
    return new Promise((resolve, reject) => {
      let promise = [];
      for (let i = 0; i < icons.length; i++) {
        promise.push(this.utilityProvider.getBase64(cordova.file.dataDirectory + "/icons/", icons[i]));
      }
      Promise.all(promise).then((result: any) => {
        for (let i = 0; i < icons.length; i++) {
          this.iconsObj[icons[i]] = result[i];
        }
        resolve(true);
      });
    });
  }

  translator(text) {
    // return text;
    return this.translate[text] ? this.translate[text] : text;
  }

  getCommonDetails(allWorkFlow, reportData) {
    let res = reportData.filter(item => {
      return item.WorkFlowID == allWorkFlow[0].WorkFlowID
    })
    return res;
  }

  getReportData(currentReport) {
    return new Promise((resolve, reject) => {
      this.localService.getPdfReportData(currentReport).then((response: any) => {
        resolve(response)
      })
    }).catch((error: any) => {
      this.utilityProvider.stopSpinner();
      this.logger.log(this.fileName, 'getReportData', 'Error in getReportData' + JSON.stringify(error));
    });
  }
  SortByName(x, y) {
    return ((x.text == y.text) ? 0 : ((x.text > y.text) ? 1 : -1));
  }
  addTableToSection(section, tableToAdd) {
    section.table.body[0][0].push(tableToAdd);
    return section;
  }
  addNestedTableToSection(section, tableToAdd) {
    section.table.body[0][0].table.body[0][0].push(tableToAdd);
    return section;
  }

  getContentSection(isDetailedNote?) {
    let table = {
      "widths": ["50%", "50%"],
      "body": []
    };
    if (isDetailedNote) {
      table = {
        "widths": isDetailedNote,
        "body": []
      };
    }
    return table;
  }
  getContentSectionForTextArea(isDetailedNote?) {
    let table = {
      "widths": ["100%", "100%"],
      "body": []
    };
    if (isDetailedNote) {
      table = {
        "widths": isDetailedNote,
        "body": []
      };
    }
    return table;
  }

  addBodyToTable(table, body) {
    table.body = body;
    return table;
  }
  getBodyFromElements(ElementsArr, isDetailedNote?) {
    let body = [], count = 0, mainArr = [];
    let filteredArr = ElementsArr.filter((item) => {
      return this.isNotNull(item.Value) || item.SaveNullValue == 'Y'
    })
    for (let k = 0; k < filteredArr.length; k++) {
      if (ElementsArr[k].ElementType != Enums.ElementType.ActionButtonFileUpload) {
        count++;
        body.push(this.makeTableJson(ElementsArr[k], isDetailedNote));
        if (!isDetailedNote) {
          if (count % 2 == 0) {
            mainArr.push(body);
            count = 0;
            body = [];
          } else if (k == ElementsArr.length - 1 && k % 2 == 0) {
            body.push(this.makeblankJson(''))
            mainArr.push(body);
          }
        }
        else {
          mainArr.push(body);
        }
      }
    }
    return mainArr;
  }
  getCommonPdfData(ElementsArr, header?, isRecommendation?) {
    let table = { columns: [] };
    try {
      let rows = [];
      let filteredArr = ElementsArr.filter((item) => {
        return this.isNotNull(item.Value) || item.SaveNullValue == 'Y'
      });

      let commonTable = {
        unbreakable: isRecommendation ? true : false,
        table: {
          widths: ['25%', '25%', '0.1%', '25%', '25%'],
          body: []
        },
        layout: {
          layout: 'noBorders',
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
          }
        },
      };

      let sortedCommonPdfData = this.generateCommonData(filteredArr);
      if (sortedCommonPdfData.leftData.length > 0) {
        if (header) {
          commonTable.table.body.push([this.getTableHeader(header), this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn("")]);
        }
        for (let i = 0; i < sortedCommonPdfData.leftData.length; i++) {
          let row = [];
          if (sortedCommonPdfData.leftData[i].ElementType != Enums.ElementType.CheckBox) {
            row.push(this.getLabelColumn(this.translator(sortedCommonPdfData.leftData[i].DisplayName), isRecommendation));
            row.push(this.getValueColumn(sortedCommonPdfData.leftData[i].Value, isRecommendation))
          }
          if (sortedCommonPdfData.leftData[i].ElementType == Enums.ElementType.CheckBox) {
            row.push(this.getCheckBoxIcon(this.translator(sortedCommonPdfData.leftData[i].DisplayName), sortedCommonPdfData.leftData[i].Value == 'true' ? true : false));
            row.push(this.getValueColumn(""));
          }
          row.push(this.getBlankColumn(""));
          if (sortedCommonPdfData.rightData[i].ElementType != Enums.ElementType.CheckBox) {
            row.push(this.getLabelColumn(this.translator(sortedCommonPdfData.rightData[i].DisplayName), isRecommendation));
            row.push(this.getValueColumn(sortedCommonPdfData.rightData[i].Value, isRecommendation))
          }
          if (sortedCommonPdfData.rightData[i].ElementType == Enums.ElementType.CheckBox) {
            row.push(this.getCheckBoxIcon(this.translator(sortedCommonPdfData.rightData[i].DisplayName), sortedCommonPdfData.rightData[i].Value == 'true' ? true : false));
            row.push(this.getValueColumn(""))
          }
          if (row.length == 5) {
            commonTable.table.body.push(row);
          }
          if (i == sortedCommonPdfData.leftData.length - 1) {
            commonTable.table.body.push([this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn("")]);
          }
        }
      }

      if (commonTable.table.body.length > 0) {
        rows.push(commonTable);
        table.columns.push(rows);
      }
    } catch (err) {
      this.logger.log(this.fileName, 'getPressureData', "Error: " + JSON.stringify(err));
    }
    return table;
  }
  getBodyFromElementForAddParts(ElementsArr) {
    let body = [], count = 0, mainArr = [];
    for (let k = 0; k < ElementsArr.length; k++) {
      count++;
      body.push(this.makeTableJsonForAddparts(ElementsArr[k]));
      if (count % 2 == 0) {
        mainArr.push(body);
        count = 0;
        body = [];
      } else if (k == ElementsArr.length - 1 && k % 2 == 0) {
        body.push(this.makeblankJson(''))
        mainArr.push(body);
      }
    }
    return mainArr;
  }

  makeTableJson(element, isDetailedNote?) {
    let json: any = {
      "table": {
        "body": []
      },
      layout: 'noBorders'
    };
    if (!isDetailedNote) {
      json.table.widths = ["50%", "50%"];
      json.table.body.push([]);
      //02/14/2019 Shivansh Subnani -- Replacing Customer Name to Customer.
      if (element.ElementID == 130095 || element.ElementID == 130100 || element.ElementID == 1045) {
        element.Value = element.DetailedValue;
      }
      if (element.ElementType != Enums.ElementType.CheckBox) {
        json.table.body[0].push(this.getLabelColumn(this.translator(element.DisplayName)));
        if (element.ElementType != Enums.ElementType.Date) {
          json.table.body[0].push(this.getValueColumn(element.Value));
        }
        else {
          //14-01-2019 Shivansh Subnani
          //Formating Dates if type of element is data
          let formattedDate = "";
          if (element.Value) {
            formattedDate = moment(element.Value).format('DD-MMM-YYYY')
          }
          json.table.body[0].push(this.getValueColumn(formattedDate));
        }
      } else {
        if (element.DisplayName == 'Stroked From Control Room') {
          // console.log(this.printed);
          if (this.repType != "Depot Repair" && !this.printed) {
            // console.log(element.DisplayName);
            json.table.body[0].push(this.getCheckBoxIcon(this.translator(element.DisplayName), element.Value == 'true' ? true : false));
            this.printed = true;
          }
        } else {
          json.table.body[0].push(this.getCheckBoxIcon(this.translator(element.DisplayName), element.Value == 'true' ? true : false));
          json.table.body[0].push(this.getBlankColumn(''));
        }
      }
    } else {
      json.table.widths = element.widths;
      json.table.body.push([]);
      json.table.body[0].push(this.getLabelColumn(this.translator(element.DisplayName)));
      // 02-05-2019 -- Mansi Arora -- parse html content if isHtml true else add value column
      if (element.isHtml) {
        json.table.body[0].push(this.getHtmlColumn());
        this.ParseHtml(json.table.body[0][1].stack, element.Value);
      } else {
        json.table.body[0].push(this.getValueColumn(element.Value));
      }
    }
    return json;
  }

  // 02-05-2019 -- Mansi Arora -- object for html content value
  getHtmlColumn() {
    return { "stack": [], border: this.noborderstyle, margin: [5, 3, 0, 3], fillColor: '#F4F2F2', "style": "label-value" };
  }

  makeTableJsonForAddparts(element) {
    let json: any = {
      "table": {
        "body": []
      },
      layout: 'noBorders'
    };
    json.table.widths = ["50%", "50%"];
    json.table.body.push([]);
    json.table.body[0].push(this.getLabelColumn(this.translator(element.DisplayName)));
    json.table.body[0].push(this.getValueColumn(element.DetailedValue));
    return json;
  }

  makeTableJsonForTextArea(element, isReportNotes?) {
    let body = [], mainArr = [];
    let json: any = {
      "table": {
        "body": []
      },
      layout: 'noBorders'
    };
    json.table.widths = ["100%"];
    json.table.body.push([]);
    json.table.body[0].push(this.getSubheaderColumn(this.translator(element.DisplayName)));
    json.table.body.push([]);
    json.table.body[1].push(this.getCommentsColumn(element.Value, isReportNotes));
    body.push(json);
    mainArr.push(body);
    return mainArr;
  }

  makeblankJson(element) {
    let json: any = {
      "table": {
        "body": []
      },
      layout: 'noBorders'
    };
    // if (element.ElementType != Enums.ElementType.TextArea) {
    json.table.widths = ["50%", "50%"];
    json.table.body.push([]);
    json.table.body[0].push(this.getBlankColumn(''));
    json.table.body[0].push(this.getBlankColumn(''));
    // }
    // else {
    //   json.table.widths = ["100%"];
    //   json.table.body.push([]);
    //   json.table.body[0].push(this.getSubheaderColumn(element.DisplayName));
    //   json.table.body.push([]);
    //   json.table.body[1].push(this.getCommentsColumn(element.Value));
    // }
    return json;
  }

  getLabelColumn(value, isRecommendation?) {
    let fillColor = "#DDE6EF";
    if (!this.isNotNull(value) && isRecommendation) {
      fillColor = "#FFF";
    }
    return { "text": (value ? value : " "), border: this.noborderstyle, margin: [5, 3, 0, 3], fontSize: '10', fillColor: fillColor, "style": "label" };
  }

  getSubheaderColumn(value) {
    return { "text": (value ? value : " "), fontSize: '10', border: this.noborderstyle, color: '#234487', style: 'header' };
  }

  getValueColumn(value, isRecommendation?) {
    let fillColor = '#F4F2F2';
    if (!this.isNotNull(value) && isRecommendation) {
      fillColor = "#FFF";
    }
    return { "text": (value ? value : " "), bold: true, border: this.noborderstyle, margin: [5, 3, 0, 3], fontSize: '10', fillColor: fillColor, "style": "label-value" };
  }

  getCommentsColumn(value, isReportNotes?) {
    return { "text": (value ? value : " "), margin: [0, 0, 0, 0], border: this.noborderstyle, fontSize: 9, "style": "comment-text" };
  }
  getComments(value, border?) {
    if (border) {
      return { "text": (value ? value : " "), margin: [10, 3, 0, 3], fontSize: 9, "style": "comment-text", colSpan: 3 };
    } else {
      return { "text": (value ? value : " "), margin: [10, 3, 0, 3], border: this.noborderstyle, fontSize: 9, "style": "comment-text", colSpan: 3 };

    }
  }
  getConstructionLabel(value, isValueDifferent) {
    if (isValueDifferent) {
      return { text: (value ? value : " "), margin: [10, 3, 0, 3], border: this.noborderstyle, fontSize: 9, fillColor: '#F5A623' };
    } else {
      return { text: (value ? value : " "), margin: [10, 3, 0, 3], border: this.noborderstyle, fontSize: 9 };
    }
  }

  getConstructionLabelForFindings(value, isValueDifferent) {
    if (isValueDifferent) {
      return { text: (value ? value : " "), margin: [10, 3, 0, 3], alignment: "center", border: this.noborderstyle, fontSize: 9, fillColor: '#F5A623' };
    } else {
      return { text: (value ? value : " "), margin: [10, 3, 0, 3], alignment: "center", border: this.noborderstyle, fontSize: 9 };
    }
  }

  getConstructionLabelForFindingsWithBorder(value, isValueDifferent, border) {
    if (isValueDifferent) {
      return { text: (value ? value : " "), margin: [10, 3, 0, 3], alignment: "center", border: this.noborderstyle, fontSize: 9, fillColor: '#F5A623' };
    } else {
      if (border == 'bottom') {
        return { text: (value ? value : " "), margin: [10, 3, 0, 3], alignment: "left", border: [false, false, false, true], fontSize: 9 };
      } else {
        return { text: (value ? value : " "), margin: [10, 3, 0, 3], alignment: "left", fontSize: 9 };
      }
    }
  }

  getConstructionValue(value, isValueDifferent) {
    if (isValueDifferent) {
      return { text: (value ? value : " "), border: this.noborderstyle, margin: [10, 3, 0, 3], fontSize: 9, fillColor: '#F5A623', bold: true };
    } else {
      return { text: (value ? value : " "), border: this.noborderstyle, margin: [10, 3, 0, 3], fontSize: 9, bold: true };
    }
  }

  getConstructionValueWithBorder(value, isValueDifferent, border) {
    if (isValueDifferent) {
      if (border == "Border") {
        return { text: (value ? value : " "), margin: [10, 3, 0, 3], fontSize: 9, fillColor: '#F5A623', bold: true };
      } else {
        return { text: (value ? value : " "), border: [false, false, false, false], margin: [10, 3, 0, 3], fontSize: 9, fillColor: '#F5A623', bold: true };
      }
    } else {
      if (border == 'topAndLeft') {
        return { text: (value ? value : " "), border: [true, true, false, false], margin: [10, 3, 0, 3], fontSize: 9, bold: true };
      } else if (border == 'leftAndBottom') {
        return { text: (value ? value : " "), border: [true, false, false, true], margin: [10, 3, 0, 3], fontSize: 9, bold: true };
      } else if (border == 'noBorder') {
        return { text: (value ? value : " "), margin: [10, 3, 0, 3], fontSize: 9, bold: true, border: this.noborderstyle };
      } else {
        return { text: (value ? value : " "), margin: [10, 3, 0, 3], fontSize: 9, bold: true };
      }

    }
  }

  getPrePostVal(value) {
    return { text: (value ? value : " "), border: this.noborderstyle, margin: [10, 3, 0, 3], fontSize: 9 };
  }

  getConstructionLabelForPressure(value, isValueDifferent) {
    if (isValueDifferent) {
      return { text: (value ? value : " "), margin: [10, 3, 0, 3], border: this.noborderstyle, fontSize: 9, fillColor: '#F5A623' };
    } else {
      let fillColor;
      // if (value == "") {
      //   fillColor = "#fff"
      // }
      return { text: (value ? value : " "), margin: [10, 3, 0, 3], border: this.noborderstyle, fontSize: 9, fillColor: fillColor };
    }
  }
  getConstructionValueForPressure(value, isValueDifferent, colSpan?) {
    if (isValueDifferent) {
      return { text: (value ? value : " "), border: this.noborderstyle, margin: [10, 3, 0, 3], fontSize: 9, fillColor: '#F5A623', bold: true };
    } else {
      let fillColor;
      return { text: (value ? value : " "), border: this.noborderstyle, margin: [10, 3, 0, 3], fontSize: 9, bold: true, fillColor: fillColor, colSpan: colSpan };
    }
  }

  getFindingLabel(value) {
    return { text: (value ? value : " "), border: this.noborderstyle, margin: [10, 3, 0, 3], fontSize: 9, bold: true, alignment: "right" };
  }
  getFindingValue(value) {
    return { text: (value ? value : " "), border: this.noborderstyle, fontSize: 9, alignment: "center" };
  }

  getCheckboxValue(CategoryData) {
    let item = CategoryData.filter((item) => {
      return item.ElementType == Enums.ElementType.CheckBox
    })[0]
    if (item) {
      if (item.Value == "true") {
        return this.getConstructionValue('Yes', false)
      } else {
        return this.getConstructionValue('No', false)
      }
    } else {
      return this.getConstructionValue('No', false)
    }

  }
  getPrePostValue(CategoryData) {
    let item = CategoryData.filter((item) => {
      return item.ElementType == Enums.ElementType.TextArea
    })
    if (item.length > 0) {
      for (let k in item) {
        return this.getConstructionValue(item[k].Value, false)
      }
    } else {
      return this.getConstructionValue('', false)
    }
  }

  getPartValue(value) {
    if (value) {
      if (value == "No Value" || value == "N/A") {
        value = " ";
      }
    }
    return { text: (value ? value : " "), border: this.noborderstyle, fontSize: 9, bold: true, alignment: 'left' };
  }

  getCommentValue(value, rowSpan) {
    return { text: (value ? value : " "), border: this.noborderstyle, fillColor: '#FFF', fontSize: 9, alignment: 'center' };
  }

  getBlankColumn(value, rowSpan?) {
    if (rowSpan) {
      return { text: (value ? value : " "), rowSpan: rowSpan, fillColor: "#fff", border: this.noborderstyle, fontSize: 9, color: "#939393", bold: true, alignment: 'center', };
    } else {
      return { text: (value ? value : " "), fillColor: "#fff", border: this.noborderstyle, fontSize: 9, color: "#939393", bold: true, alignment: 'center', };
    }
  }




  getBlankColumnforOptional(value, rowSpan?) {
    if (rowSpan) {
      return { text: (value ? value : " "), rowSpan: rowSpan, fillColor: "#fff", border: this.noborderstyle, fontSize: 9, color: "#939393", bold: true, alignment: 'center', };
    } else {
      return { text: (value ? value : " "), fillColor: "#fff", border: [false, false, false, true], fontSize: 9, color: "#939393", bold: true, alignment: 'center', };
    }
  }

  getBlankColumnWithBorder(value, rowSpan?, techName?) {
    if (techName) {
      return { text: (value ? value : " "), color: "#045B83", bold: true, fontSize: 10, alignment: 'center', fillColor: "#F4F2F2", border: this.noborderstyle };
    } else {
      if (rowSpan) {
        return { text: (value ? value : " "), rowSpan: rowSpan, fillColor: "#fff", border: [true, false, true, false], fontSize: 9, color: "#939393", bold: true, alignment: 'center', };
      } else {
        return { text: (value ? value : " "), fillColor: "#fff", border: [true, false, true, false], fontSize: 9, color: "#939393", bold: true, alignment: 'center', };
      }
    }
  }

  getHeadingBlankColumn(value, rowSpan?) {
    if (rowSpan) {
      return { text: (value ? value : " "), rowSpan: rowSpan, fillColor: "#fff", border: [false, false, false, true], fontSize: 9, color: "#939393", bold: true, alignment: 'center', };
    } else {
      return { text: (value ? value : " "), fillColor: "#fff", fontSize: 9, color: "#939393", bold: true, alignment: 'center', };
    }
  }

  getRotatedText(text, rowSpan?) {
    let image = this.writeRotatedText(text);
    return { image: image, border: this.noborderstyle, fillColor: "#fff", width: 15, height: 130, alignment: "right" };
    // if (rowSpan) {
    //   return { image: image, border: this.noborderstyle, fillColor: "#fff", rowSpan: rowSpan, width: 15, height: 130, alignment: "right" };
    // } else {
    //   return { image: image, border: this.noborderstyle, fillColor: "#fff", width: 15, height: 130, alignment: "right" };
    // }
  }

  getTableHeader(value, colSpan?) {
    // let colspan;
    // if (colSpan) {
    //   colspan = colSpan
    // }
    return { text: this.translator(value), fillColor: "#fff", color: '#234487', colSpan: colSpan, border: [false, false, false, false], style: 'header' };
  }

  getBlankColumnForPreTest(value) {
    return { text: (value ? value : " "), fillColor: "#fff", border: [false, false, false, false], fontSize: 10, color: "#234487", bold: true, alignment: 'left' };
  }
  getBlankColumnForPressure(value) {
    return { text: (value ? value : " "), fillColor: "#fff", border: [false, false, false, false], fontSize: 9, color: "#fff", alignment: 'center' };
  }
  getBlankPart(value) {
    return { text: (value ? value : " "), fillColor: "#fff", border: [false, false, false, false], fontSize: 9, color: "#939393", bold: true, alignment: 'left' };
  }
  getColumnForTextArea(value) {
    return { text: (value ? value : " "), margin: [10, 3, 0, 3], border: this.noborderstyle, fontSize: 9, colSpan: 2 };
  }
  getColumnForTextAreaLabel(value) {
    return { text: (value ? value : " "), margin: [10, 3, 0, 3], border: this.noborderstyle, fontSize: 10, colSpan: 2, color: "#045B83", bold: true, fillColor: "#fff" };
  }
  getSubHeadingColumn(value, rowSpanLength) {
    return { text: (value ? value : " "), fillColor: "#fff", border: [false, false, false, false], fontSize: 9, color: "#939393", bold: true, alignment: 'center', rowSpan: rowSpanLength };
  }

  getCommentsbox(value) {
    return { "text": (value ? value : " "), margin: [10, 3, 0, 3], fontSize: 9, "style": "comment-text", colSpan: 2 };
  }

  getNotesbox(value, rowSpan?, ifLastRow?) {
    if (!ifLastRow) {
      return { "text": (value ? value : " "), fillColor: '#e5e6e8', fontSize: 9, rowSpan: rowSpan };
    } else {
      return { "text": (value ? value : " "), fillColor: '#e5e6e8', fontSize: 9, rowSpan: rowSpan };
    }
  }

  getNotesboxActuation(value, border?) {
    if (border) {
      return { "text": (value ? value : " "), fillColor: '#e5e6e8', fontSize: 9 };
    } else {
      return { "text": (value ? value : " "), fillColor: '#e5e6e8', border: [false, false, false, false], fontSize: 9 };
    }
  }

  getNotesboxLabel(value) {
    return { "text": (value ? value : " "), border: [false, false, false, false], margin: [10, 3, 0, 3], fillColor: '#e5e6e8', fontSize: 9, bold: true };
  }


  generatePdfActuation(docDefinition, reportData) {
    let asLeftDataActuation = reportData.filter((item) => {
      return item.WorkFlowID == 50
    })
    let asFoundDataActuation = reportData.filter((item) => {
      return item.WorkFlowID == 2
    })
    let asFoundAttachmentData = this.customFilter(this.attachmentData, 2);
    let asLeftAttachmentData = this.customFilter(this.attachmentData, 50);
    if (asFoundDataActuation.length > 0 || asLeftDataActuation.length > 0) {
      // docDefinition.content.push({ text: this.translator("AS FOUND/SOLUTION"), color: '#234487', style: 'header' });
      console.log("reportData"+JSON.stringify(reportData));
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAsFoundActuationData(reportData)));
      // console.log("docdefinition.Content" + JSON.stringify(docDefinition.content));
      // docDefinition.content.push({ text: "   ", color: '#FFF', fillColor: "#fff", style: 'header' });
    }
    // else {
    //   docDefinition.content.push({ text: this.translator("Looks like As-Left data has not been saved yet. Please navigate to As-Left Tab"), style: 'header' });
    // }

    // let asFoundComments = reportData.filter((item) => {
    //   return item.ElementID == 16039
    // });
    // if ((asFoundComments.length > 0) && (asFoundComments[0].Value && asFoundComments[0].Value != '')) {
    //   asFoundComments[0].DisplayName = this.translator("As-Found Comments");
    //   let CommentSection = this.makeTableJsonForTextArea(asFoundComments[0]);
    //   docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
    // }
    // let asLeftComments = reportData.filter((item) => {
    //   return item.ElementID == 16042;
    // });
    // if ((asLeftComments.length > 0) && (asLeftComments[0].Value && asLeftComments[0].Value != '')) {
    //   asLeftComments[0].DisplayName = this.translator("Solution Comments");
    //   let CommentSection = this.makeTableJsonForTextArea(asLeftComments[0]);
    //   docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
    // }
    let solutionNotes = asLeftDataActuation.filter((item) => {
      return item.ElementID == 98
    })
    if ((solutionNotes.length > 0) && this.isNotNull(solutionNotes[0].Value)) {
      let CommentSection = this.makeTableJsonForTextArea(solutionNotes[0]);
      docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
    }
    let followUp = asLeftDataActuation.filter((item) => {
      return item.ElementID == 100
    })
    if ((followUp.length > 0) && this.isNotNull(followUp[0].Value)) {
      let CommentSection = this.makeTableJsonForTextArea(followUp[0]);
      docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
    }

    if (asFoundAttachmentData.length > 0) {
      // docDefinition.content.push({ text: this.translator("AS FOUND ATTACHMENTS"), color: '#234487', style: 'header' });
      let accordionData = asFoundDataActuation.filter((item) => {
        return item.ElementType == Enums.ElementType.Accordion
      });
      for (let i = 0; i < accordionData.length; i++) {
        let accordionAttachmentData = this.getAccordionAttachment(accordionData[i], asFoundAttachmentData);
        if (accordionAttachmentData.accordionName != "" && accordionAttachmentData.accordionAttachment.length > 0) {
          // docDefinition.content.push({ text: this.translator(accordionAttachmentData.accordionName), fontSize: 9, color: "#939393", bold: true, });
          docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(accordionAttachmentData.accordionAttachment, this.translator(accordionAttachmentData.accordionName))));
        }
      }
      let asFoundAttachmentsWithoutParent = asFoundAttachmentData.filter((item) => {
        return item.ParentID_Mobile == null
      });

      if (asFoundAttachmentsWithoutParent.length > 0) {
        docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(asFoundAttachmentsWithoutParent, this.translator("AS FOUND ATTACHMENTS"))));
      }
    }
    if (asLeftAttachmentData.length > 0) {
      // docDefinition.content.push({ text: this.translator("SOLUTIONS ATTACHMENTS"), color: '#234487', style: 'header' });
      let accordionData = asLeftDataActuation.filter((item) => {
        return item.ElementType == Enums.ElementType.Accordion
      });
      for (let i = 0; i < accordionData.length; i++) {
        let accordionAttachmentData = this.getAccordionAttachment(accordionData[i], asLeftAttachmentData);
        if (accordionAttachmentData.accordionName != "" && accordionAttachmentData.accordionAttachment.length > 0) {
          // docDefinition.content.push({ text: this.translator(accordionAttachmentData.accordionName), fontSize: 9, color: "#939393", bold: true, });
          docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(accordionAttachmentData.accordionAttachment, this.translator(accordionAttachmentData.accordionName))));
        }
      }
      let asLeftAttachmentsWithoutParent = asLeftAttachmentData.filter((item) => {
        return item.ParentID_Mobile == null
      });
      if (asLeftAttachmentsWithoutParent.length > 0) {
        docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(asLeftAttachmentsWithoutParent, "SOLUTION ATTACHMENTS")));
      }
    }
    // let calibrationData = reportData.filter(item => {
    //   return item.WorkFlowID == 51;
    // });
    // if (calibrationData.length > 0) {

    //   // let calibrationElements = calibrationData.filter((item) => {
    //   //   return item.ElementID == 140254;
    //   // });
    //   // if (calibrationElements.length > 0) {
    //   //   docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getElementsListCalibration(calibrationElements, this.translator("AS FOUND CALIBRATION"))));
    //   // }
    //   // docDefinition.content.push({ text: this.translator("Calibration/ Configuration"), color: '#7CC4EF', style: 'header' });
    //   // docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getCalibrationTableForActuation(reportData)));
    //   // let calibrationComments = calibrationData.filter((item) => {
    //   //   return item.ElementID == 17001
    //   // })
    //   // if ((calibrationComments.length > 0) && this.isNotNull(calibrationComments[0].Value)) {
    //   //   calibrationComments[0].DisplayName = this.translator("Calibration Comments");
    //   //   let CommentSection = this.makeTableJsonForTextArea(calibrationComments[0]);
    //   //   docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
    //   // }

    //   let calibrationAttachment = this.customFilter(this.attachmentData, 51);
    //   if (calibrationAttachment.length > 0) {
    //     // docDefinition.content.push({ text: this.translator("Calibration Attachments"), color: '#234487', style: 'header' });
    //     docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(calibrationAttachment, "CALIBRATION ATTACHMENTS")));
    //   }
    // }
    let measurementData = reportData.filter(item => {
      return item.WorkFlowID == 3;
    });
    if (measurementData.length > 0) {
      docDefinition.content.push({ text: this.translator("MEASUREMENT"), color: '#234487', style: 'header' });
      let measurementCommentData = measurementData.filter((item) => {
        return item.ElementID == 46
      })
      if ((measurementCommentData.length > 0) && this.isNotNull(measurementCommentData[0].Value)) {
        measurementCommentData[0].DisplayName = this.translator("MEASUREMENT COMMENTS");
        let CommentSection = this.makeTableJsonForTextArea(measurementCommentData[0]);
        docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
      }

      let measurementAttachment = this.customFilter(this.attachmentData, 3);
      if (measurementAttachment.length > 0) {
        // docDefinition.content.push({ text: this.translator("Measurement Attachments"), color: '#234487', style: 'header' });
        // console.log("measurementAttachment" + JSON.stringify(measurementAttachment));
        docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(measurementAttachment, "MEASUREMENT ATTACHMENTS")));
      }
    }
    let findingsData = reportData.filter((item) => {
      return item.WorkFlowID == 4
    });
    if (findingsData.length > 0) {
      // docDefinition.content.push({ text: this.translator("FINDINGS AND CORRECTIVE ACTIONS"), color: '#234487', style: 'header' });
      //   docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getFindingsTableForActuation(reportData, docDefinition)));
      // docDefinition.content.push({ text: this.translator(""), color: '#FFF', fillColor: "#fff", style: 'header' });
      // docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getFindingsAsLeftListView(reportData)));
      // docDefinition.content.push({ text: "   ", color: '#FFF', style: 'header' });

      // let findingComments = reportData.filter((item) => {
      //   return item.WorkFlowID == 4 && item.ElementType == Enums.ElementType.TextArea && !item.ParentID_Mobile
      // });

      // if ((findingComments.length > 0) && (findingComments[0].Value && findingComments[0].Value != '')) {
      //   findingComments[0].DisplayName = this.translator("Findings And Corrective Action Comments");
      //   let CommentSection = this.makeTableJsonForTextArea(findingComments[0]);
      //   docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
      // }

    }
    let findingAttachments = this.customFilter(this.attachmentData, 4);
    if (findingAttachments.length > 0) {
      // docDefinition.content.push({ text: this.translator("Findings And Corrective Action Attachments"), color: '#234487', style: 'header' });
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(findingAttachments, "FINDINGS AND CORRECTIVE ACTION ATTACHMENTS")));
    }

    let solutionElements = reportData.filter((item) => {
      return item.ElementID == 140254;
    });
    if (solutionElements.length > 0) {
      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getElementsListSolution(solutionElements, this.translator("CALIBRATION DETAILS"))));
    }
    let filteredTestData = reportData.filter((item) => {
      return item.WorkFlowID == 6
    });
    if (filteredTestData.length > 0) {
      // docDefinition.content.push({ text: this.translator("Final Test"), color: '#7CC4EF', style: 'header' });
      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getPreAndPostTestTable(filteredTestData, reportData)));
      // let filteredTestComments = reportData.filter((item) => {
      //   return item.WorkFlowID == 6 && item.ElementID == 139
      // });
      // if ((filteredTestComments.length > 0) && (filteredTestComments[0].Value && filteredTestComments[0].Value != '')) {
      //   filteredTestComments[0].DisplayName = this.translator("Final Test Comments");
      //   let CommentSection = this.makeTableJsonForTextArea(filteredTestComments[0]);
      //   docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
      // }
    }
    let testAttachments = this.customFilter(this.attachmentData, 6);
    if (testAttachments.length > 0) {
      // docDefinition.content.push({ text: this.translator("Final Test Attachments"), color: '#234487', style: 'header' });
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(testAttachments, "FINAL TEST ATTACHMENTS")));
    }

    let photosTabData = this.customFilter(this.attachmentData, 56);
    if (photosTabData.length > 0) {
      let accordionData = reportData.filter((item) => {
        return item.ElementType == Enums.ElementType.Accordion && item.WorkFlowID == 56
      });
      for (let i = 0; i < accordionData.length; i++) {
        let accordionAttachmentData = this.getAccordionAttachment(accordionData[i], photosTabData)
        if (accordionAttachmentData.accordionName != "" && accordionAttachmentData.accordionAttachment.length > 0) {
          docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getAttachmentsTableWithHeader(accordionAttachmentData.accordionAttachment, this.translator(accordionAttachmentData.accordionName))));
        }
      }
    }

    return docDefinition;
  }

  getAccordionAttachment(accordionData, attachmentData) {
    // console.log(accordionData);
    let filteredAttachment = attachmentData.filter(item => {
      return item.ParentID_Mobile == accordionData.RDID_Mobile;
    });
    if (filteredAttachment.length > 0) {
      return { accordionName: accordionData.Value, accordionAttachment: filteredAttachment }
    } else {
      return { accordionName: "", accordionAttachment: [] }
    }
  }


  generatePdfPressure(docDefinition, reportData, allWorkFlow) {
    let asFoundLeftData = this.customFilter(reportData, 18);
    // if (asFoundLeftData.length > 0) {
    let currentRepairDataIDs = [1049, 1045, 1044, 1047, 1043, 1053, 1051, 1057, 1056];
    let currentRepairData = reportData.filter((item) => {
      return currentRepairDataIDs.indexOf(item.ElementID) > -1
    });

    if (this.valueProvider.getPressureType() == Enums.PressureType.Power) {
      currentRepairData.map((item) => {
        if (item.ElementID == 1049) {
          item.DisplayName = " "
        }
      })
    }
    // let currentRepairComments = reportData.filter((item) => {
    //   return item.ElementID == 1058;
    // });

    let manufacturerTagDataIDs = [1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031, 1033, 1034, 1035, 1038, 130143, 1037, 1032, 140219, 140251];
    let manufacturerTagData = asFoundLeftData.filter((item) => {
      return manufacturerTagDataIDs.indexOf(item.ElementID) > -1
    });
    if (this.valueProvider.getPressureType() == Enums.PressureType.Power) {
      manufacturerTagData.map((item) => {
        if (item.ElementID == 130143) {
          item.DisplayName = " "
        }
      })
    }


    let currentRepairDataTable = this.getCommonPdfData(currentRepairData, "CURRENT REPAIR DATA");
    let manufacturerTagDataTable = this.getCommonPdfData(manufacturerTagData, "MANUFACTURER TAG DATA");
    if (currentRepairDataTable) {
      docDefinition.content.push(this.addTableToSection(this.getPressureNoBorderSection(true), currentRepairDataTable));
    }
    if (manufacturerTagDataTable) {
      docDefinition.content.push(this.addTableToSection(this.getPressureNoBorderSection(true), manufacturerTagDataTable));
    }
    let asFoundLeftAttachments = this.customFilter(this.attachmentData, 18);
    if (asFoundLeftAttachments.length > 0) {
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(asFoundLeftAttachments, "AS FOUND ATTACHMENTS")));
    }
    let asFoundData = this.customFilter(reportData, 19);
    if (asFoundData.length > 0) {
      let data = asFoundData.filter((item) => {
        return item.ElementID == 3000 || item.ElementID == 3001 || item.ElementID == 3002 || item.ElementID == 140223 || item.ElementID == 140224 || item.ElementID == 140225 || item.ElementID == 140226
      })
      if (data.length > 0) {
        let inlet = " ", inletConnectionType = " ", inletConnectionRating = " ";;
        data.forEach((item) => {
          if (item.ElementID == 3000) {
            if (this.isNotNull(item.Value)) {
              inlet = item.Value;
            }
          }
          if (item.ElementID == 140223) {
            if (this.isNotNull(item.Value)) {
              inletConnectionType = item.Value;
            }
          }
          if (item.ElementID == 140224) {
            if (this.isNotNull(item.Value)) {
              inletConnectionRating = item.Value;
            }
          }
        })
        let jsonObjInlet = {
          "ElementID": 5000,
          "SaveNullValue": "Y",
          "ElementType": Enums.ElementType.SearchDropdown,
          "DisplayName": "Inlet",
          "DetailedValue": inlet + " " + inletConnectionType + " " + inletConnectionRating,
          "Value": inlet + " " + inletConnectionType + " " + inletConnectionRating
        }
        let outlet = " ", outletConnectionType = " ", outletConnectionRating = " ";
        data.forEach((item) => {
          if (item.ElementID == 3001) {
            if (this.isNotNull(item.Value)) {
              outlet = item.Value;
            }
          }
          if (item.ElementID == 140225) {
            if (this.isNotNull(item.Value)) {
              outletConnectionType = item.Value;
            }
          }
          if (item.ElementID == 140226) {
            if (this.isNotNull(item.Value)) {
              outletConnectionRating = item.Value;
            }
          }
        })

        let jsonObjOutlet = {
          "ElementID": 5001,
          "SaveNullValue": "Y",
          "ElementType": Enums.ElementType.SearchDropdown,
          "DisplayName": "Outlet",
          "DetailedValue": outlet + " " + outletConnectionType + " " + outletConnectionRating,
          "Value": outlet + " " + outletConnectionType + " " + outletConnectionRating
        }
        let arr = [];
        if (this.isNotNull(jsonObjInlet.Value))
          arr.push(jsonObjInlet)
        if (this.isNotNull(jsonObjOutlet.Value))
          arr.push(jsonObjOutlet)
        if (arr.length > 0) {
          let body = this.getCommonPdfData(arr, "ATTRIBUTES");
          if (body) {
            docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), body));
          }
        }
      }
      let preTestTable = this.getPreTestData(asFoundData);
      let table = this.getPressureData(asFoundData);
      if (preTestTable.columns.length > 0) {
        docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), preTestTable));
      }
      if (table.columns.length > 0) {
        docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), table));
      }
    }
    let asFoundDataAttachments = this.customFilter(this.attachmentData, 19);
    if (asFoundDataAttachments.length > 0) {
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(asFoundDataAttachments, "AS FOUND PERFORMANCE ATTACHMENTS")));
    }

    let findingsData = this.customFilter(reportData, 22);
    findingsData = findingsData.filter((item) => {
      return item.ElementID != 22022
    })
    if (findingsData.length > 0) {
      let filteredReportData = findingsData.filter((item) => {
        return item.ElementType != Enums.ElementType.TextArea && item.ElementID != 1066 && item.ElementID != 130144 && item.ElementID != 22022;
      });
      let body = this.getCommonPdfData(filteredReportData, "FINDINGS");
      if (body) {
        docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), body));
      }
    }
    let findingsAttachment = this.customFilter(this.attachmentData, 22);
    if (findingsAttachment.length > 0) {
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(findingsAttachment, "FINDINGS ATTACHMENTS")));
    }

    let measurementData = this.customFilter(reportData, 23);
    let addPartData = reportData.filter((item) => {
      return item.ElementID == 22022;
    });
    if (measurementData.length > 0) {
      let table = this.getPressureData(measurementData, "INSPECTION MEASUREMENT");
      if (table.columns.length > 0) {
        docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), table));
      }
      // console.log(" docDefinition.content"+JSON.stringify(docDefinition.content));
      if (addPartData.length > 0) {
        docDefinition.content.push({ text: this.translator('PARTS'), color: '#234487', style: 'header' });
        docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getAddpartsTable(addPartData)));
      }
    }
    let measurementAttachments = this.customFilter(this.attachmentData, 23);
    if (measurementAttachments.length > 0) {
      // docDefinition.content.push({ text: this.translator("Inspection Measurement Attachments"), color: '#234487', style: 'header' });
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(measurementAttachments, "INSPECTION MEASUREMENT ATTACHMENTS")));
    }
    // docDefinition.content.push({text:"",margin:[0,0,0,10]});
    let testData = this.customFilter(reportData, 24);
    if (testData.length > 0) {
      let table = this.getPressureData(testData, "FINAL TEST DATA");
      if (table.columns.length > 0) {
        docDefinition.content.push(this.addTableToSection(this.getNewNoFinalInspectionBorderSection(true), table));
      }
    }
    let testDataAttachments = this.customFilter(this.attachmentData, 24);
    if (testDataAttachments.length > 0) {
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(testDataAttachments, "TEST DATA ATTACHMENTS")));
    }
    let finalInspectionData = this.customFilter(reportData, 25);
    if (finalInspectionData.length > 0) {
      let currentRepairDataIDs = [1049, 1045, 1044, 1047, 1043, 1053, 1051, 1057, 1056];
      let filteredReportData = finalInspectionData.filter((item) => {
        return (item.ElementType != Enums.ElementType.TextArea && item.ElementID != 1041) && (currentRepairDataIDs.indexOf(item.ElementID) == -1)
      });

      let body = this.getCommonPdfData(filteredReportData, "FINAL INSPECTION");
      if (body) {
        docDefinition.content.push(this.addTableToSection(this.getNewNoFinalInspectionBorderSection(true), body));
      }
      let inspectedByValue = finalInspectionData.filter((item) => {
        return item.ElementID == 1041
      });
      if (inspectedByValue.length > 0) {
        docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getInspectedByValue(inspectedByValue[0])));
      }
    }
    let finalInspectionAttachment = this.customFilter(this.attachmentData, 25);
    if (finalInspectionAttachment.length > 0) {
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(finalInspectionAttachment, "FINAL INSPECTION ATTACHMENTS")));
    }

    let photosTabData = this.customFilter(this.attachmentData, 57);
    if (photosTabData.length > 0) {
      let accordionData = reportData.filter((item) => {
        return item.ElementType == Enums.ElementType.Accordion && item.WorkFlowID == 57
      });
      for (let i = 0; i < accordionData.length; i++) {
        let accordionAttachmentData = this.getAccordionAttachment(accordionData[i], photosTabData)
        if (accordionAttachmentData.accordionName != "" && accordionAttachmentData.accordionAttachment.length > 0) {
          docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getAttachmentsTableWithHeader(accordionAttachmentData.accordionAttachment, this.translator(accordionAttachmentData.accordionName))));
        }
      }
    }

    // console.log("docdefinition.content" + JSON.stringify(docDefinition.content));

    return docDefinition;
  }

  getInspectedByValue(inspectedBy) {
    let inspectedBySection = {
      table: {
        border: this.noborderstyle,
        body: [
          [{ text: this.translator(inspectedBy.DisplayName), border: [false, false, false, false], fontSize: 10, bold: true, "margin": [-5, 0, 0, 0] }, { text: inspectedBy.Value, border: [false, false, false, false], fontSize: 10, alignment: "left", "margin": [0, 0, 0, 3] }]
        ]
      }
    };
    return inspectedBySection;
  }
  generatePdfIsolation(docDefinition, reportData) {
    //Shivansh Subnani 01/17/2019 filtering asfoundData
    let asFoundDataIsolation = reportData.filter((item) => {
      return (item.WorkFlowID == 9 || item.WorkFlowID == 36)
    })
    if (asFoundDataIsolation.length > 0) {
      docDefinition = this.getAccordionData(docDefinition, reportData);
      let isMaterialVerification = reportData.filter((item) => {
        return item.LookupID == 30017
      })
      if (isMaterialVerification.length > 0) {
        docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getMaterialVerificationTable(reportData, docDefinition)));
      }
      let asFoundAccessories = asFoundDataIsolation.filter((item) => {
        return item.ElementID == 22024;
      });
      if (asFoundAccessories.length > 0) {
        // docDefinition.content.push({ text: this.translator('AS FOUND ACCESSORIES'), color: '#7CC4EF', style: 'header' });
        // let header = this.translator("AS FOUND ACCESSORIES");
        docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getAccessoriesList(asFoundAccessories, this.translator("AS FOUND ACCESSORIES"))));
      }
      let solutionAccessories = asFoundDataIsolation.filter((item) => {
        return item.ElementID == 22026;
      });
      if (solutionAccessories.length > 0) {
        // let header = this.translator("SOLUTION ACCESSORIES");
        // docDefinition.content.push({ text: this.translator('SOLUTION ACCESSORIES'), color: '#7CC4EF', style: 'header' });
        docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getAccessoriesList(solutionAccessories, this.translator("AS LEFT ACCESSORIES"))));
      }
      let asFoundComments = asFoundDataIsolation.filter((item) => {
        return item.ElementID == 179
      });
      if ((asFoundComments.length > 0) && this.isNotNull(asFoundComments[0].Value)) {
        asFoundComments[0].DisplayName = this.translator("AS FOUND COMMENTS");
        let CommentSection = this.makeTableJsonForTextArea(asFoundComments[0]);
        docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
      }
      let solutionComments = asFoundDataIsolation.filter((item) => {
        return item.ElementID == 14032
      });
      if ((solutionComments.length > 0) && this.isNotNull(solutionComments[0].Value)) {
        solutionComments[0].DisplayName = this.translator("AS LEFT COMMENTS");
        let CommentSection = this.makeTableJsonForTextArea(solutionComments[0]);
        docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
      }
    }
    let asFoundattachmentData = this.attachmentData.filter((item) => {
      return item.WorkFlowID == 9
    })
    if (asFoundattachmentData.length > 0) {
      // docDefinition.content.push({ text: this.translator("AS FOUND ATTACHMENTS"), color: '#234487', style: 'header' });
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(asFoundattachmentData, "AS FOUND ATTACHMENTS")));
    }
    let asLeftAtachmentData = this.attachmentData.filter((item) => {
      return item.WorkFlowID == 36
    })
    if (asLeftAtachmentData.length > 0) {
      // docDefinition.content.push({ text: this.translator("SOLUTION ATTACHMENTS"), color: '#234487', style: 'header' });
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(asLeftAtachmentData, "AS LEFT ATTACHMENTS")));
    }
    let calibrationData = reportData.filter((item) => {
      return item.WorkFlowID == 10 || item.WorkFlowID == 36
    });

    if (calibrationData.length > 0) {
      let inspectedByValue = calibrationData.filter((item) => {
        return item.ElementID == 14034
      });
      let techName: any = '';
      if (inspectedByValue.length > 0) {
        techName = inspectedByValue[0].Value;
      }
      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getCalibrationTable(reportData, calibrationData, techName)));

      // if (inspectedByValue.length > 0) {
      //   docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getInspectedByValue(inspectedByValue[0])));
      // }
    }
    let calibrationattachmentData = this.attachmentData.filter((item) => {
      return item.WorkFlowID == 10
    })

    if (calibrationattachmentData.length > 0) {
      // docDefinition.content.push({ text: this.translator("CALIBRATION ATTACHMENTS"), color: '#234487', style: 'header' });
      let accordionData = calibrationData.filter((item) => {
        return item.ElementType == Enums.ElementType.Accordion
      });
      for (let i = 0; i < accordionData.length; i++) {
        let accordionAttachmentData = this.getAccordionAttachment(accordionData[i], calibrationattachmentData)
        if (accordionAttachmentData.accordionName != "" && accordionAttachmentData.accordionAttachment.length > 0) {
          // docDefinition.content.push({ text: this.translator(accordionAttachmentData.accordionName), fontSize: 9, color: "#939393", bold: true, });
          docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getAttachmentsTableWithHeader(accordionAttachmentData.accordionAttachment, this.translator(accordionAttachmentData.accordionName))));
        }
      }
      let calibrationAttachmentsWithoutParent = calibrationattachmentData.filter((item) => {
        return item.ParentID_Mobile == null
      });
      if (calibrationAttachmentsWithoutParent.length > 0) {
        docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(calibrationAttachmentsWithoutParent, this.translator("CALIBRATION ATTACHMENTS"))));
      }
    }

    let testData = reportData.filter((item) => {
      return item.WorkFlowID == 13
    });
    if (testData.length > 0) {
      docDefinition = this.getTestData(docDefinition, testData)
    }

    let filteredNotesRecommendation = reportData.filter((item) => {
      return item.ElementID == 140233;
    })
    if (filteredNotesRecommendation.length > 0) {
      let serviceInfo = this.getCommonPdfData(filteredNotesRecommendation, this.translator("REPORT NOTES"), true);
      if (serviceInfo) {
        docDefinition.content.push(this.addTableToSection(this.getPressureNoBorderSectionNotes(true), serviceInfo));
      }
    }
    let reportNotes = reportData.filter((item) => {
      return item.ElementID == 140234
    });
    if ((reportNotes.length > 0) && this.isNotNull(reportNotes[0].Value)) {
      docDefinition.content.push(this.getNotes(reportNotes[0].Value));
    }

    // console.log("docDefinition.content" + JSON.stringify(docDefinition.content));

    let filteredRecommendations = reportData.filter((item) => {
      return item.ElementID == 140240;
    })
    if (filteredRecommendations.length > 0) {
      let recommendationData = this.getCommonPdfData(filteredRecommendations, this.translator("RECOMMENDATIONS"), true);
      if (recommendationData) {
        docDefinition.content.push(this.addTableToSection(this.getPressureNoBorderSectionNotes(true), recommendationData));
      }
    }
    let recommendationNotes = reportData.filter((item) => {
      return item.ElementID == 140241
    });
    if ((recommendationNotes.length > 0) && this.isNotNull(recommendationNotes[0].Value)) {
      // let CommentSection = this.makeTableJsonForTextArea(recommendationNotes[0]);
      // docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
      docDefinition.content.push(this.getNotes(recommendationNotes[0].Value));
    }


    let findingsData = reportData.filter((item) => {
      return item.WorkFlowID == 11
    });
    if (findingsData.length > 0 && this.repType != Enums.RepairType.FieldDiagnostic) {
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getFindingsTable(reportData, docDefinition)));
      // console.log("docdefinition.Content" + JSON.stringify(docDefinition.content));
      // let findingsComments = findingsData.filter((item) => {
      //   return item.ElementID == 219
      // });
      // if ((findingsComments.length > 0) && this.isNotNull(findingsComments[0].Value)) {
      //   findingsComments[0].DisplayName = this.translator("FINDINGS COMMENTS");
      //   if (findingsComments[0].Value && findingsComments[0].Value != '') {
      //     let CommentSection = this.makeTableJsonForTextArea(findingsComments[0]);
      //     docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
      //   }
      // }
      docDefinition.content.push({ text: this.translator("Recommended actions have been completed unless otherwise noted"), color: '#234487', style: 'header' });
    }
    let findingsattachmentData = this.attachmentData.filter((item) => {
      return item.WorkFlowID == 11
    })
    if (findingsattachmentData.length > 0) {
      // docDefinition.content.push({ text: this.translator("FINDINGS ATTACHMENTS"), color: '#234487', style: 'header' });
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(findingsattachmentData, "FINDINGS ATTACHMENTS")));
    }
    // let solutionData = reportData.filter((item) => {
    //   return item.WorkFlowID == 12
    // })
    // if (solutionData.length > 0) {
    //   docDefinition = this.getSolutionData(docDefinition, reportData);
    // }
    // let solutionsAttachmentData = this.attachmentData.filter((item) => {
    //   return item.WorkFlowID == 12
    // })
    // if (solutionsAttachmentData.length > 0) {
    //   docDefinition.content.push({ text: this.translator("SOLUTIONS ATTACHMENTS"), color: '#234487', style: 'header' });
    //   docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getAttachmentsTable(solutionsAttachmentData)));
    // }

    let testAttachmentData = this.attachmentData.filter((item) => {
      return item.WorkFlowID == 13
    })
    if (testAttachmentData.length > 0) {
      // docDefinition.content.push({ text: this.translator("TEST DATA" + "  " + "ATTACHMENTS"), color: '#234487', style: 'header' });
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(testAttachmentData, "TEST DATA ATTACHMENTS")));
    }
    let optionalData = reportData.filter((item) => {
      return item.WorkFlowID == 14
    });
    if (optionalData.length > 0) {
      // docDefinition.content.push({ text: "   ", color: '#FFF', fillColor: "#fff", style: 'header' });
      // docDefinition.content.push({ text: this.translator("OPTIONAL SERVICES"), color: '#234487', style: 'header' });
      let filteredReportData = optionalData.filter((item) => {
        return item.ElementID == 130359 || item.ElementID == 268 || item.ElementID == 269 || item.ElementID == 270
      });
      let body = this.getBodyFromElements(filteredReportData);
      // console.log("body" + JSON.stringify(body));
      if (body.length > 0) {
        let arr = [];
        arr.push({ "table": { "body": [[{ "text": this.translator("OPTIONAL SERVICES"), "border": this.noborderstyle, "margin": [5, 3, 0, 3], "fontSize": "10", color: '#234487', style: 'header', "fillColor": "#FFF" }, { "text": "   ", "bold": true, "border": this.noborderstyle, "margin": [5, 3, 0, 3], "fontSize": "10", "fillColor": "#FFF", "style": "label-value" }]], "widths": ["50%", "50%"] }, "layout": "noBorders" })
        arr.push({
          "table": {
            "body": [[{ "text": "  ", "border": this.noborderstyle, "margin": [5, 3, 0, 3], "fontSize": "10", "fillColor": "#FFF", "style": "label" },
            { "text": "  ", "bold": true, "border": this.noborderstyle, "margin": [5, 3, 0, 3], "fontSize": "10", "fillColor": "#FFF", "style": "label-value" }]], "widths": ["50%", "50%"]
          }, "layout": "noBorders"
        })
        body.unshift(arr);
        docDefinition.content.push({ unbreakable: true, "table": this.addBodyToTable(this.getContentSection(), body), "widths": ["50%", "50%"], layout: 'noBorders' });
      }
      // let Recommendations = optionalData.filter((item) => {
      //   return item.ElementID == 130360
      // });
      // if (Recommendations.length > 0) {
      //   let CommentSection = this.makeTableJsonForTextArea(Recommendations[0]);
      //   docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
      // }
      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getOptionalTableNotListView(reportData)));
      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getOptionalTable(reportData)));
      // let optionalDataComments = optionalData.filter((item) => {
      //   return item.ElementID == 287
      // });
      // if (optionalDataComments.length > 0) {
      //   optionalDataComments[0].DisplayName = this.translator("OPTIONAL SERVICES COMMENTS");
      //   let CommentSection = this.makeTableJsonForTextArea(optionalDataComments[0]);
      //   docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
      // }

    }
    let optionalAttachmentData = this.attachmentData.filter((item) => {
      return item.WorkFlowID == 14
    })
    if (optionalAttachmentData.length > 0) {
      // docDefinition.content.push({ text: this.translator("OPTIONAL SERVICES" + "  " + "ATTACHMENTS"), color: '#234487', style: 'header' });
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(optionalAttachmentData, "OPTIONAL SERVICES ATTACHMENTS")));
    }
    let finalInspection = reportData.filter((item) => {
      return item.WorkFlowID == 15
    });
    if (finalInspection.length > 0 && this.repType != Enums.RepairType.FieldDiagnostic) {
      // docDefinition.content.push({ text: this.translator("FINAL INSPECTION"), color: '#234487', style: 'header' });
      docDefinition = this.getFinalInspectionData(docDefinition, reportData);
    }
    let finalInspectionAttachmentData = this.attachmentData.filter((item) => {
      return item.WorkFlowID == 15
    })
    if (finalInspectionAttachmentData.length > 0) {
      // docDefinition.content.push({ text: this.translator("FINAL INSPECTION" + "  " + "ATTACHMENTS"), color: '#234487', style: 'header' });
      docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getAttachmentsTableWithHeader(finalInspectionAttachmentData, "FINAL INSPECTION ATTACHMENTS")));
    }




    let photosTabData = this.attachmentData.filter((item) => {
      return item.WorkFlowID == 58
    })
    if (photosTabData.length > 0) {
      // docDefinition.content.push({ text: this.translator("CALIBRATION ATTACHMENTS"), color: '#234487', style: 'header' });
      let accordionData = reportData.filter((item) => {
        return item.ElementType == Enums.ElementType.Accordion && item.WorkFlowID == 58
      });
      for (let i = 0; i < accordionData.length; i++) {
        let accordionAttachmentData = this.getAccordionAttachment(accordionData[i], photosTabData)
        if (accordionAttachmentData.accordionName != "" && accordionAttachmentData.accordionAttachment.length > 0) {
          // docDefinition.content.push({ text: this.translator(accordionAttachmentData.accordionName), fontSize: 9, color: "#939393", bold: true, });
          docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getAttachmentsTableWithHeader(accordionAttachmentData.accordionAttachment, this.translator(accordionAttachmentData.accordionName))));
        }
      }
    }
    return docDefinition;
  }

  /**
   * 01-02-2019 -- Mansi Arora -- getDetailedNotesHeaderSection
   * form header section for detailed notes pdf
   * @memberOf CreateSdrProvider
  */
  getDetailedNotesHeaderSection(res) {
    let emersonLogo = 'emerson.png';
    let centerSection = this.translator('REPAIR REPORT');
    let rightSection = "";
    let headerTable;
    try {
      //Currently Setting BusinessGroup As Default Final Control
      rightSection = res.Business_Group == Enums.BusinessGroup.Final_Control ? "Final Control" : "Final Control"
      let CreatedBy = this.valueProvider.getUser().Name;
      headerTable = {
        "table": {
          "widths": ["*"],
          "body": [[{
            "table": {
              "widths": ["25%", "40%", "35%"],
              "body": [[
                {
                  "image": emersonLogo,
                  "border": [false, false, false, false],
                  "margin": [12, 10, 12, 10],
                  "width": 70
                },
                {
                  "text": centerSection,
                  "border": [false, false, false, false],
                  "margin": [24, 20, 24, 20],
                  "bold": true,
                  "color": '#045B83',
                  "alignment": "center",
                  "fontSize": "15"
                },
                {
                  "text": rightSection,
                  "border": [false, false, false, false],
                  "margin": [24, 20, 24, 20],
                  "alignment": "center",
                  "bold": true,
                  "fontSize": "13",
                  "color": "#939393"

                }]]
            },
            layout: 'noBorders'
          }],
          [{
            "table": {
              "body": [[
                {
                  "text": "Created Date:",
                  "border": [false, false, false, false],
                  "margin": [12, 3, 0, 3],
                  "fontSize": "11"
                },
                {
                  "text": res.Created_Date ? moment(res.Created_Date).format('DD/MM/YYYY') : '',
                  "border": [false, false, false, false],
                  "margin": [0, 3, 0, 3],
                  "fontSize": "10",
                  "fillColor": "#EAEAEA"
                },
                {
                  "text": "Created By:",
                  "border": [false, false, false, false],
                  "margin": [35, 3, 0, 3],
                  "fontSize": "11"
                },
                {
                  "text": CreatedBy,
                  "border": [false, false, false, false],
                  "margin": [0, 3, 0, 3],
                  "fontSize": "10",
                  "fillColor": "#EAEAEA"
                },
                {
                  "text": "Job ID:",
                  "border": [false, false, false, false],
                  "margin": [35, 3, 0, 3],
                  "fontSize": "11",

                },
                {
                  "text": res.Task_Number,
                  "border": [false, false, false, false],
                  "margin": [0, 3, 0, 3],
                  "fontSize": "10",
                  "fillColor": "#EAEAEA"

                }
              ]]
            },
            layout: 'noBorders'
          }]
          ]
        },
        layout: 'noBorders'
      };
    } catch (err) {
      this.logger.log(this.fileName, 'getDetailedNotesHeaderSection', "Error: " + err);
      throw new Error("Error in getDetailedNotesHeaderSection: " + err);
    }
    return headerTable;
  }

  // 02-05-2019 -- Mansi Arora -- make parent objects
  private ParseContainer(cnt, e, p, styles) {
    let elements = [];
    let children = e.childNodes;
    if (children.length != 0) {
      for (let i = 0; i < children.length; i++) {
        p = this.ParseElement(elements, children[i], p, styles);
      }
    }
    if (elements.length != 0) {
      for (let i = 0; i < elements.length; i++) {
        cnt.push(elements[i]);
      }
    }
    return p;
  }

  // 02-05-2019 -- Mansi Arora -- add style to the object value
  private ComputeStyle(o, styles) {
    for (let i = 0; i < styles.length; i++) {
      let st = styles[i].trim().toLowerCase().split(":");
      if (st.length == 2) {
        switch (st[0]) {
          case "font-size": {
            o.fontSize = parseInt(st[1]);
            break;
          }
          case "text-align": {
            switch (st[1]) {
              case "right": o.alignment = 'right'; break;
              case "center": o.alignment = 'center'; break;
            }
            break;
          }
          case "font-weight": {
            switch (st[1]) {
              case "bold": o.bold = true; break;
            }
            break;
          }
          case "text-decoration": {
            switch (st[1]) {
              case "underline": o.decoration = "underline"; break;
            }
            break;
          }
          case "font-style": {
            switch (st[1]) {
              case "italic": o.italics = true; break;
            }
            break;
          }
        }
      }
    }
  }

  // 02-05-2019 -- Mansi Arora -- Parse Elements and make objects
  private ParseElement(cnt, e, p, styles) {
    if (!styles) styles = [];
    if (e.getAttribute) {
      let nodeStyle = e.getAttribute("style");
      if (nodeStyle) {
        let ns = nodeStyle.split(";");
        for (let k = 0; k < ns.length; k++) {
          styles.push(ns[k]);
        }
      }
    }

    switch (e.nodeName.toLowerCase()) {
      case "#text": {
        let t = { text: e.textContent.replace(/\n/g, "") };
        if (styles) {
          this.ComputeStyle(t, styles);
        }
        p.text.push(t);
        break;
      }
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "b":
      case "strong": {
        //styles.push("font-weight:bold");
        this.ParseContainer(cnt, e, p, styles.concat(["font-weight:bold"]));
        break;
      }
      case "img": {
        let maxResolution = {
          width: 435,
          height: 830
        },
          width = parseInt(e.getAttribute("width")),
          height = parseInt(e.getAttribute("height"));
        if (width > maxResolution.width) {
          let scaleByWidth = maxResolution.width / width;
          width *= scaleByWidth;
          height *= scaleByWidth;
        }
        if (height > maxResolution.height) {
          let scaleByHeight = maxResolution.height / height;
          width *= scaleByHeight;
          height *= scaleByHeight;
        }
        cnt.push({
          image: e.getAttribute("src"),
          width: width,
          alignment: e.getAttribute("alignment")
        });
        break;
      }
      case "u": {
        //styles.push("text-decoration:underline");
        this.ParseContainer(cnt, e, p, styles.concat(["text-decoration:underline"]));
        break;
      }
      case "em":
      case "i": {
        //styles.push("font-style:italic");
        this.ParseContainer(cnt, e, p, styles.concat(["font-style:italic"]));
        //styles.pop();
        break;
        //cnt.push({ text: e.innerText, bold: false });
      }
      case "span": {
        this.ParseContainer(cnt, e, p, styles);
        break;
      }
      case "br":
      case "\n":
      case "\t":
        {
          p = this.CreateParagraph();
          cnt.push(p);
          break;
        }
      case "table":
        {
          let t = {
            table: {
              headerRows: 1,
              widths: [],
              body: [],
              headerText: ''
            }
          }
          let border = e.getAttribute("border");
          let isBorder = false;
          t['headerText'] = e.getAttribute("headerText");
          if (border) if (parseInt(border) == 1) isBorder = true;
          if (!isBorder) t['layout'] = 'noBorders';
          this.ParseContainer(t.table.body, e, p, styles);

          let widths = e.getAttribute("widths");
          if (!widths) {
            if (t.table.body.length != 0) {
              if (t.table.body[0].length != 0) {
                for (let k = 0; k < t.table.body[0].length; k++) {
                  t.table.widths.push("*");
                }
              }
            }
          } else {
            let w = widths.split(",");
            for (let k = 0; k < w.length; k++) {
              t.table.widths.push(w[k]);
            }
          }
          cnt.push(t);
          break;
        }
      case "thead":
      case "tbody": {
        this.ParseContainer(cnt, e, p, styles);
        //p = CreateParagraph();
        break;
      }
      case "tr": {
        let row = [];
        this.ParseContainer(row, e, p, styles);
        cnt.push(row);
        break;
      }
      case "th":
      case "td": {
        p = this.CreateParagraph();
        let st = { stack: [] }
        st.stack.push(p);

        let rspan = e.getAttribute("rowspan");
        if (rspan) st['rowSpan'] = parseInt(rspan);
        let cspan = e.getAttribute("colspan");
        if (cspan) st['colSpan'] = parseInt(cspan);

        this.ParseContainer(st.stack, e, p, styles);
        cnt.push(st);
        break;
      }
      // 02-08-2019 -- Mansi Arora -- handling for nested element font
      case "div": case "a": case "p": case "li": case "font": {
        p = this.CreateParagraph();
        let st = { stack: [] }
        st.stack.push(p);
        // 02-08-2019 -- Mansi Arora -- if element has an attribute sixe, add it to styles
        if (e.hasAttribute('size')) {
          styles.push({
            'font-size': e.size
          });
        }
        this.ComputeStyle(st, styles);
        this.ParseContainer(st.stack, e, p, []);

        cnt.push(st);
        break;
      }
      case "ul": {
        let list = {
          ul: []
        };
        let st = { stack: [] }
        st.stack.push(list);
        this.ComputeStyle(st, styles);
        this.ParseContainer(st.stack[0].ul, e, p, []);

        cnt.push(st);
        break;
      }
      case "li": {
        p = this.CreateParagraph();
        this.ComputeStyle(p, styles);
        this.ParseContainer(p.text, e, p, []);

        cnt.push(p);
        break;
      }
      // case "li": {

      // let t = e.textContent.replace(/\n/g, "");
      //   if (styles) {
      //     this.ComputeStyle(t, styles);
      //   }
      //  // this.ParseContainer(t, e, p, []);
      //   cnt.push(t);
      //   break;
      // }
      default: {
        // console.log("Parsing for node " + e.nodeName + " not found");
        break;
      }
    }
    return p;
  }

  /**
   * 02-05-2019 -- Mansi Arora -- ParseHtml
   * @param cnt content array
   * @param htmlText html content
   * @returns parsed html object
   * @memberOf CreateSdrProvider
  */
  private ParseHtml(cnt, htmlText) {
    let html = $(htmlText.replace(/\t/g, "").replace(/\n/g, ""));
    let p = this.CreateParagraph();
    for (let i = 0; i < html.length; i++) {
      this.ParseElement(cnt, html.get(i), p, []);
    }
  }

  /**
   * 02-05-2019 -- Mansi Arora -- ParseHtml
   * @returns object for a paragraph
   * @memberOf CreateSdrProvider
  */
  private CreateParagraph() {
    let p = { text: [] };
    return p;
  }

  /**
   * 01-02-2019 -- Mansi Arora -- generateDetailedNotesPdf
   * generate pdf for detailed notes
   * @memberOf CreateSdrProvider
  */
  public generateDetailedNotesPdf() {
    let self = this;
    let isDetailedNote = true;
    let obj: any = [];
    let serviceInfoObj: any;
    let systemInfoObj: any;
    let detailedNotesObj: any;
    let remainingIssuesObj: any;
    let suggestionObj: any;
    let promiseArr = [];
    return new Promise((resolve, reject) => {
      this.localService.getDetailNotesList(String(this.valueProvider.getTaskId())).then((res: any[]) => {
        if (res && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            promiseArr.push(this.localService.getAttachmentFromDetailedNotes(res[i].DNID));
            serviceInfoObj = [[{
              'mainwidth': ["50%"],
              'DisplayName': 'Report No.',
              'Value': res[i].Report_No,
              'widths': ["50%", "50%"]
            }],
            [{
              'mainwidth': ["100%"],
              'DisplayName': 'Description One',
              'Value': res[i].Description_One,
              'widths': ["25%", "75%"]
            }],
            [{
              'mainwidth': ["100%"],
              'DisplayName': 'Description Two',
              'Value': res[i].Description_Two,
              'widths': ["25%", "75%"]
            }],
            [{
              'mainwidth': ["100%"],
              'DisplayName': 'Summary',
              'Value': res[i].Summary,
              'widths': ["25%", "75%"]
            }]];
            // 02-05-2019 -- Mansi Arora -- send key isHtml true in order to detect ckeditor content
            systemInfoObj = [[{
              'mainwidth': ["100%"],
              'DisplayName': 'SYSTEM INFORMATION',
              'Value': res[i].System_Info,
              'widths': ["25%", "75%"],
              'attachment': [],
              'isHtml': true
            }]];
            detailedNotesObj = [[{
              'mainwidth': ["100%"],
              'DisplayName': this.translator('DETAILED NOTES'),
              'Value': res[i].Detailed_Notes,
              'widths': ["25%", "75%"],
              'attachment': [],
              'isHtml': true
            }]];
            remainingIssuesObj = [[{
              'mainwidth': ["100%"],
              'DisplayName': this.translator('RESULT/REMAINING ISSUE'),
              'Value': res[i].Result,
              'widths': ["25%", "75%"],
              'attachment': [],
              'isHtml': true
            }]];
            suggestionObj = [[{
              'mainwidth': ["100%"],
              'DisplayName': this.translator('SUGGESTION'),
              'Value': res[i].Suggestion,
              'widths': ["25%", "75%"],
              'attachment': [],
              'isHtml': true
            }]];
            obj.push({
              'SERVICE INFORMATION': serviceInfoObj,
              'SYSTEM INFORMATION': systemInfoObj,
              'DETAILED NOTES': detailedNotesObj,
              'RESULT': remainingIssuesObj,
              'SUGGESTION': suggestionObj
            });
          }
          // 01-02-2019 -- Mansi Arora -- get all the attachments
          Promise.all(promiseArr).then((allresult) => {
            let promiseArray = [];
            for (let el = 0; el < allresult.length; el++) {
              for (let elem = 0; elem < allresult[el].length; elem++) {
                // 01-21-2019 -- Mansi Arora -- check attachment type before converting to base64
                let attachmentName = allresult[el][elem].File_Name;
                let filetype = attachmentName.split(".")[1];
                if (allresult[el][elem].File_Type.indexOf('image') > -1) {
                  if (this.platform.is('ios')) {
                    promiseArray.push(this.utilityProvider.getBase64(cordova.file.dataDirectory + 'detailednotesfiles/' + this.valueProvider.getTaskId() + '/' + allresult[el][elem].DNID + '/', allresult[el][elem].File_Name));
                  } else {
                    promiseArray.push(this.utilityProvider.getBase64(cordova.file.dataDirectory + 'detailednotesfiles/' + this.valueProvider.getTaskId() + '/' + allresult[el][elem].DNID + "/thumbnails", "thumb_" + allresult[el][elem].File_Name));
                  }
                }
                // 01-21-2019 -- Mansi Arora -- if not an image, get icon and convert to base64
                else {
                  let iconType;
                  let supportedTypes = ["pdf", "xlsx", "txt", "ppt", "doc", "docx", "xls", "pptx"];
                  if (supportedTypes.indexOf(filetype) > -1) {
                    if (filetype.endsWith("x")) {
                      filetype = filetype.substring(0, filetype.length - 1);
                    }
                    iconType = filetype;
                  } else {
                    iconType = "unknown";
                  }
                  promiseArray.push(this.getDetailedNotesIconBase64(iconType));
                }
              }
            }
            // 01-02-2019 -- Mansi Arora -- convert attachments to base64
            Promise.all(promiseArray).then((allBase64Result) => {
              let count = 0;
              // 01-02-2019 -- Mansi Arora -- map base64 attachment to the object
              for (let el = 0; el < allresult.length; el++) {
                for (let elem = 0; elem < allresult[el].length; elem++) {
                  allresult[el][elem]['base64'] = allBase64Result[count];
                  allresult[el][elem]['value'] = allresult[el][elem]['File_Name'];
                  count++;
                }
              }
              // 01-02-2019 -- Mansi Arora -- push attachment object to the attachment array
              try {
                for (let i = 0; i < allresult.length; i++) {
                  for (let j = 0; j < allresult[i].length; j++) {
                    switch (allresult[i][j].Attachment_Type) {
                      case 'SystemInfo':
                        if (obj[i] && obj[i]['SYSTEM INFORMATION'] && obj[i]['SYSTEM INFORMATION'][0] && obj[i]['SYSTEM INFORMATION'][0][0] && obj[i]['SYSTEM INFORMATION'][0][0].attachment) {
                          obj[i]['SYSTEM INFORMATION'][0][0].attachment.push(allresult[i][j]);
                        }
                        break;
                      case 'DetailedNotes':
                        if (obj[i] && obj[i]['DETAILED NOTES'] && obj[i]['DETAILED NOTES'][0] && obj[i]['DETAILED NOTES'][0][0] && obj[i]['DETAILED NOTES'][0][0].attachment) {
                          obj[i]['DETAILED NOTES'][0][0].attachment.push(allresult[i][j]);
                        }
                        break;
                      case 'ResultRemaining':
                        if (obj[i] && obj[i]['RESULT'] && obj[i]['RESULT'][0] && obj[i]['RESULT'][0][0] && obj[i]['RESULT'][0][0].attachment) {
                          obj[i]['RESULT'][0][0].attachment.push(allresult[i][j]);
                        }
                        break;
                      case 'Suggestion':
                        if (obj[i] && obj[i]['SUGGESTION'] && obj[i]['SUGGESTION'][0] && obj[i]['SUGGESTION'][0][0] && obj[i]['SUGGESTION'][0][0].attachment) {
                          obj[i]['SUGGESTION'][0][0].attachment.push(allresult[i][j]);
                        }
                        break;
                      default:
                        break;
                    }
                  }
                }
              } catch (err) {
                self.logger.log(self.fileName, 'generateDetailedNotesPdf', "Error mapping attachments: " + JSON.stringify(err));
                reject(err);
              }
              this.getstaticIcons().then((resp) => {
                try {
                  let footerprefix = this.translator('Page');
                  let footerSuffix = this.translator('Of');
                  let defaultFont = 'Arial';
                  let watermarktext = {};
                  let docDefinition = {
                    content: [],
                    images: this.iconsObj,
                    styles: this.getStyles(),
                    header: this.getDetailedNotesHeaderSection(res[0]),
                    footer: function (currentPage, pageCount) {
                      return {
                        margin: 10,
                        columns: [
                          {
                            fontSize: 9,
                            text: [
                              {
                                text: '--------------------------------------------------------------------------' + '\n',
                                margin: [0, 20]
                              },
                              {
                                text: footerprefix + ' ' + currentPage + ' ' + footerSuffix + ' ' + pageCount,
                              }
                            ],
                            alignment: 'center'
                          }
                        ]
                      };
                    },
                    pageMargins: [12, 95, 12, 60],
                    watermark: watermarktext,
                    pageSize: { width: 700, height: 850 }
                    ,
                    defaultStyle: {
                      font: defaultFont
                    }
                  }
                  for (let a = 0; a < obj.length; a++) {
                    for (let item in obj[a]) {
                      docDefinition.content.push({ text: this.translator(item), color: '#234487', style: 'header' });
                      for (let x = 0; x < obj[a][item].length; x++) {
                        docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSection(obj[a][item][x][0].mainwidth), this.getBodyFromElements(obj[a][item][x], isDetailedNote)), "widths": obj[a][item][x][0].mainwidth, layout: 'noBorders' });
                        // 01-02-2019 -- Mansi Arora -- check if attachment exists
                        if (obj[a][item][x][0].attachment && obj[a][item][x][0].attachment.length > 0) {
                          docDefinition.content.push({ text: this.translator("Attachments"), color: '#234487', style: 'header' });
                          docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getAttachmentsTable(obj[a][item][x][0].attachment)));
                        }
                      }
                      docDefinition.content.push({ text: this.getBlankColumn('  '), color: '#234487', style: 'header' });
                    }
                    docDefinition.content.push({ text: this.getBlankColumn('  '), color: '#234487', style: 'header' });
                    docDefinition.content.push({ text: this.getBlankColumn('  '), color: '#234487', style: 'header' });
                  }

                  pdfMake.createPdf(docDefinition).getDataUrl((dataURL) => {
                    let filePath = cordova.file.dataDirectory;
                    let pdfFileName = "Detailed_Notes_SDR_" + this.valueProvider.getTaskId() + ".pdf";
                    let filePathSuffix = "/temp/";
                    self.logger.log(self.fileName, 'generateDetailedNotesPdf', "Saving Temporary Deatiled Notes PDF");
                    self.utilityProvider.deleteFile(filePath + filePathSuffix, pdfFileName).then(res => {
                      self.utilityProvider.saveBase64Attachment(filePath + filePathSuffix, pdfFileName, dataURL.split(",")[1], "application/pdf").then((res) => {
                        this.attachmentData = [];
                        resolve("success");
                      });
                    });
                  })
                } catch (err) {
                  self.logger.log(self.fileName, 'generateDetailedNotesPdf', "Error get Static icons: " + JSON.stringify(err));
                  reject(err);
                }
              });
            })
              .catch((err: any) => {
                self.logger.log(self.fileName, 'generateDetailedNotesPdf', "Error convert attachments to base64: " + JSON.stringify(err));
                reject(err);
              });
          })
            .catch((err: any) => {
              self.logger.log(self.fileName, 'generateDetailedNotesPdf', "Error in getting all the attachments: " + JSON.stringify(err));
              reject(err);
            });
        } else {
          this.utilityProvider.stopSpinner();
          this.utilityProvider.presentToast('Detailed Notes not found', 4000, 'top', 'feedbackToast');
        }
      })
        .catch((err: any) => {
          self.logger.log(self.fileName, 'generateDetailedNotesPdf', "Error in getDetailNotesList, local service: " + JSON.stringify(err));
          reject(err);
        });

    })
      .catch((err: any) => {
        self.logger.log(self.fileName, 'generateDetailedNotesPdf', "Error in generateDetailedNotesPdf: " + JSON.stringify(err));
        this.utilityProvider.stopSpinner();
        this.utilityProvider.presentToast(Enums.Messages.PDF_Failed, 4000, 'top', 'feedbackToast');
      });
  }
  customFilter(data, WorkFlowID) {
    let result = data.filter((item) => {
      return item.WorkFlowID == WorkFlowID
    })
    return result;
  }
  getCheckboxFlag(flag) {
    //let image = this.valueProvider.getcheckboximg(flag);
    let image;
    if (flag == true) {
      image = 'checkedboximg.png';
    } else {
      image = 'uncheckedboximg.png';
    }
    return { image: image, border: this.noborderstyle, fillColor: "#fff", fit: [8, 8], alignment: "right", margin: [0, 5, 0, 0] };
  }
  getFinalCheckboxFlag(flag) {
    //let image = this.valueProvider.getcheckboximg(flag);
    let image;
    if (flag == true) {
      image = 'checkedboximg.png';
    } else {
      image = 'uncheckedboximg.png';
    }
    return { image: image, border: this.noborderstyle, fillColor: "#F4F2F2", fit: [8, 8], alignment: "left", margin: [0, 5, 0, 0] };
  }
  getCheckBoxIcon(text, flag) {
    //let image = this.valueProvider.getcheckboximg(flag);
    let image;
    if (flag == true) {
      image = 'checkedboximg.png';
    } else {
      image = 'uncheckedboximg.png';
    }
    return {
      table: {
        body: [[
          {
            margin: [0, 0, 0, 3],
            border: this.noborderstyle,
            image: image,
            fit: [8, 8]
          },
          {
            margin: [0, 0, 0, 3],
            border: this.noborderstyle,
            text: text,
            style: 'story',
            bold: true
          }
        ]],
        layout: 'noBorders'
      },
      layout: 'noBorders',
      border: this.noborderstyle
    };
  }
  getFinalCheckBoxIcon(text, flag) {
    //let image = this.valueProvider.getcheckboximg(flag);
    let image;
    if (flag == true) {
      image = 'checkedboximg.png';
    } else {
      image = 'uncheckedboximg.png';
    }
    return {
      table: {
        body: [[
          {
            margin: [0, 0, 0, 3],
            border: this.noborderstyle,
            text: text,
            style: 'story'
          },
          {
            margin: [0, 0, 0, 3],
            border: this.noborderstyle,
            image: image,
            fit: [8, 8]
          }
        ]],
        layout: 'noBorders'
      },
      layout: 'noBorders',
      border: this.noborderstyle
    };
  }

  isNotNull(value) {
    return value && value.trim() != '';
  }

  getSDRPrintLang() {
    this.localService.getFSREnabledLanguages().then((res: any) => {
      this.SDRPrintLanguages = res;
    });
  }

  writeRotatedText(text) {
    let ctx, canvas = document.createElement('canvas');
    canvas.width = 36;
    canvas.height = 350;
    ctx = canvas.getContext('2d');
    ctx.font = '22pt Arial';

    ctx.save();
    ctx.translate(25, 160);
    ctx.rotate(-0.5 * Math.PI);
    ctx.fillStyle = '#939393';
    ctx.fillText(text, 27, -3);
    // ctx.textBaseline='bottom';
    ctx.restore();
    return canvas.toDataURL();
  }

  getSubTable() {
    let subTable: any = {
      table: {
        widths: ['10%', '20%', '20%', '25%', '25%'],
        dontBreakRows: true,
        body: []
      },
      layout: {
        layout: 'noBorders',
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
        }
      },
    };
    return subTable
  }
  getSubTableActuation(index?) {
    let subTable: any = {
      unbreakable: true,
      table: {
        widths: ["10%", "15%", "15%", "15%", "15%", "30%"],
        body: []
      },
      layout: {
        hLineWidth: function (i, node) {
          return ((i === (index === 0 ? 1 : 0)) || (i === node.table.body.length) ? 0.7 : 0);
        },
        vLineWidth: function (i, node) {
          return (i === 1 || i === node.table.widths.length) ? 1.4 : 0;
        },
        hLineColor: function (i, node) {
          return ((i === (index === 0 ? 1 : 0)) || (i === node.table.body.length) ? '#4d8dd1' : '#4d8dd1');
        },
        vLineColor: function (i, node) {
          return (i === 1 || i === node.table.widths.length) ? '#4d8dd1' : '';
        },
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
        }
      },
    };
    return subTable
  }

  getSubTableIsolation(index, Datalength) {
    let actuationTable: any = {
      table: {
        widths: ['15%', '20%', '20%', '1%', '20%', '20%'],
        body: []
      },
      layout: {
        hLineWidth: function (i, node) {
          return ((i === (index === 0 ? 1 : 0)) || (i === node.table.body.length) ? 0.7 : 0);
        },
        vLineWidth: function (i, node) {
          return (i === 1 || i === 3 || i === 4 || i === node.table.widths.length) ? 1.4 : 0;
        },
        hLineColor: function (i, node) {
          return ((i === (index === 0 ? 1 : 0)) || (i === node.table.body.length) ? '#4d8dd1' : '');
        },
        vLineColor: function (i, node) {
          return (i === 1 || i === 3 || i === 4 || i === node.table.widths.length) ? '#4d8dd1' : '';
        },
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
        }
      },
    };
    return actuationTable;
  }


  getSubTableForFindings(border?, index?) {
    let findingTable: any = {
      unbreakable: true,
      table: {
        widths: ['10%', '15%', '15%', '20%', '40%'],
        body: []
      },
      layout: {
        hLineWidth: function (i, node) {
          return (i === (index === 0 ? 2 : 0) || i === node.table.body.length) && border ? (index === 0) ? 1.4 : 0.7 : 0;
        },
        vLineWidth: function (i, node) {
          return (i === 1 || i === node.table.widths.length) && border ? 1.4 : 0;
        },
        hLineColor: function (i, node) {
          return (i === (index === 0 ? 2 : 0) || i === node.table.body.length) && border ? (index === 0) ? '#4d8dd1' : '#4d8dd1' : '';
        },
        vLineColor: function (i, node) {
          return (i === 1 || i === node.table.widths.length) && border ? '#4d8dd1' : '';
        },
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
        }
      }
    }
    return findingTable;
  }

  getSubTableForOptional(border?, index?) {
    let findingTable: any = {
      unbreakable: true,
      table: {
        widths: ['10%', '15%', '15%', '20%', '40%'],
        body: []
      },
      layout: {
        hLineWidth: function (i, node) {
          return (i === (index === 0 ? 1 : 0) || i === node.table.body.length) && border ? (index === 0) ? 1.4 : 0.7 : 0;
        },
        vLineWidth: function (i, node) {
          return (i === 1 || i === node.table.widths.length) && border ? 1.4 : 0;
        },
        hLineColor: function (i, node) {
          return (i === (index === 0 ? 1 : 0) || i === node.table.body.length) && border ? (index === 0) ? '#4d8dd1' : '#4d8dd1' : '';
        },
        vLineColor: function (i, node) {
          return (i === 1 || i === node.table.widths.length) && border ? '#4d8dd1' : '';
        },
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
        }
      }
    }
    return findingTable;
  }

  getSubTableForPressure(border?, index?) {
    let pressureTable: any = {
      unbreakable: true,
      table: {
        widths: ['15%', '20%', '20%', '0.2%', '20%', '20%'],
        body: []
      },
      layout: {
        hLineWidth: function (i, node) {
          return ((i === 1) || i === node.table.body.length) ? 0.7 : 0;
        },
        vLineWidth: function (i, node) {
          return (i === 1 || i === 3 || i === 4 || i === node.table.widths.length) && border ? 1.4 : 0;
        },
        hLineColor: function (i, node) {
          return ((i === 0) || (i === 1) || i === node.table.widths.length) ? '#4d8dd1' : '#4d8dd1';
        },
        vLineColor: function (i, node) {
          return (i === 1 || i === 3 || i === 4 || i === node.table.widths.length) && border ? '#4d8dd1' : '';
        },
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
        }
      }

    };
    return pressureTable;
  }
  getNewTable() {
    let subTable: any = {
      unbreakable: true,
      table: {
        widths: ['15%', '20%', '20%', '0.1%', '20%', '20%'],
        body: []
      },
      layout: {
        layout: 'noBorders',
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
        }
      },
    };
    return subTable
  }

  getNotes(value) {
    let table: any = {
      "table": {
        "widths": ["100%"],
        "body": [[
          {
            "text": value,
            "margin": [0,
              0,
              0,
              0],
            "border": [false,
              false,
              false,
              false],
            "fontSize": 9,
            "style": "comment-text"
          }]]
      },
      "layout": "noBorders"
    }
    return table;
  }
}
