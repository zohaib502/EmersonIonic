import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Platform } from 'ionic-angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ValueProvider } from '../value/value';
import { LocalServiceProvider } from '../local-service/local-service';
import { LocalServiceSdrProvider } from '../local-service-sdr/local-service-sdr'
import { UtilityProvider } from '../utility/utility';
import { LoggerProvider } from '../logger/logger';
import { SortPipe } from '../../pipes/sort/sort';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import * as Enums from '../../enums/enums';
// import { processRecords } from 'ionic-angular/umd/components/virtual-scroll/virtual-util';
declare let cordova: any;
const SPACE_THRESHOLD = 741;
const NEW_TABLE_THRESHOLD = 711;
const ELEMENT_THRESHOLD = 761;

// declare let JSPath: any;
// declare let $: any;

/*
  Generated class for the SdrPdfReportProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SdrPdfReportProvider {

  isTemp: boolean = false;
  fileName: any = 'SdrPdfProvider';
  //attachmentList: any;
  repairType: any;
  translate: any;
  iconsObj: any = {};
  pdfObj = null;
  attachmentData: any;
  lov: any = {};
  allAttachmentList: any;
  SDRPrintLanguages: any;
  repType: any;
  noborderstyle = [false, false, false, false];
  isolationGroup = ['27', '28', '29', '30', '31', '32', '33'];
  printed: any = false;
  parentReferenceID: any;
  constructor(public translateService: TranslateService, public logger: LoggerProvider, public localService: LocalServiceProvider, public localServiceSdr: LocalServiceSdrProvider, public sortPipe: SortPipe, public http: HttpClient, private utilityProvider: UtilityProvider, private valueProvider: ValueProvider) {
    this.getPdfFonts();
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

  getSubHeaderNoBorderSection(isActuation?) {
    let table = {
      widths: ['*'],
      border: this.noborderstyle,
      body: []
    };
    // Added a row in body
    table.body.push([]);
    // Added a column in above row
    table.body[0].push([]);
    return {style: 'tableMargin' ,table: table, layout: 'noBorders' };
  }

  getNewNoBorderSectionCalibration(isActuation?) {
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

  getBlankPart(value) {
    return { text: (value ? value : " "), fillColor: "#fff", border: [false, false, false, false], fontSize: 9, color: "#939393", bold: true, alignment: 'left' };
  }

  getPartValue(value) {
    if (value) {
      if (value == "No Value" || value == "N/A") {
        value = " ";
      }
    }
    return { text: (value ? value : " "), border: this.noborderstyle, fontSize: 9, bold: true, alignment: 'left' };
  }


  public generatePdf(isTemp, langCode) {
    let self = this;
    this.getPdfFonts();
    return new Promise((resolve, reject) => {
      this.getDeviceType().then((res: any) => {
        this.getDatatoPrint(res).then((response: any) => {
          if (this.isolationGroup.indexOf(this.parentReferenceID.toString()) > -1) {
            // 07/11/2019 -- Zohaib Khan -- Setting attachment list based on Device response
            this.allAttachmentList = response[4] ? response[4] : [];
          } else {
            this.allAttachmentList = response[7] ? response[7] : [];
          }
          this.getBase64Attachment(this.valueProvider.getCurrentReport().REPORTID).then(transformedAttachments => {
            this.translateService.getTranslation(langCode).toPromise().then(translate => {
              this.getstaticIcons().then((resp) => {
                try {
                  this.translate = translate;
                  let footerprefix = this.translator('Page');
                  let footerSuffix = this.translator('Of');
                  let defaultFont = 'Arial';
                  if (langCode == 'zh-cn' || langCode == 'ko' || langCode == 'ja') {
                    defaultFont = 'SourceHanSansSC';
                  } else if (langCode == "ro") {
                    defaultFont = 'OpenSans';
                  }

                  let docDefinition = {
                    content: [],
                    images: this.iconsObj,
                    styles: this.getStyles(),
                    header: this.getHeaderSection(response[0]),
                    //12-09-2019://Gaurav V -  Changes to resolve blank row issue and new table margin
                    pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {

                      if (currentNode.startPosition.top >= NEW_TABLE_THRESHOLD) {
                        if ((currentNode.id == "elementSolution" || currentNode.id == "testingTable") && (currentNode.pageNumbers.length != 1 || currentNode.pageNumbers[0] != currentNode.pages)) {
                          return true;
                        }
                      }

                      if (currentNode.startPosition.top >= ELEMENT_THRESHOLD) {
                        if (currentNode.pageNumbers.length != 1 || currentNode.pageNumbers[0] != currentNode.pages) {
                          return true;
                        }
                      }

                      if ((currentNode.startPosition.top) >= SPACE_THRESHOLD) {
                        if (currentNode.text && currentNode.text == "\n") {
                          return false;
                        }
                        if (currentNode.text && currentNode.text == "\n \n \n") {
                          return true;
                        }
                        if ((currentNode.id == "actuationMainTable") && (currentNode.pageNumbers.length != 1 || currentNode.pageNumbers[0] != currentNode.pages)) {
                          return true;
                        }
                      }

                      return false;

                      /*
                      else if((currentNode.startPosition.top + 40) >= 790){
                        if(currentNode.table && currentNode.table.body.length>0){
                          isReturn =  true;
                        } else{
                          isReturn = false;
                        }
                      }
                      */
                    },
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
                    pageSize: { width: 700, height: 850 },
                    defaultStyle: {
                      font: defaultFont
                    }
                  }
                  docDefinition.content.push(this.addTableToSection(this.getSubHeaderNoBorderSection(), this.getSubHeaderSection(response[0])));
                  docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getDeviceName(response[1][0].PRODUCTNAME)));
                  if (this.isolationGroup.indexOf(this.parentReferenceID.toString()) == -1) {
                    docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getProductFamily(response[1][0])));
                  }
                  self.logger.log(self.fileName, 'generatepdf transformServiceInfoData', 'transformServiceInfoData');
                  let transformedServiceInfo = this.transformServiceInfoData(response[0][0]);
                  let body = this.getBodyFromElements(transformedServiceInfo);
                  if (body.length > 0) {
                    docDefinition.content.push({ text: this.translator("Service Information"), color: '#234487', style: 'header' });
                    docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSection(), body), "widths": ["50%", "50%"], layout: 'noBorders' });
                  }
                  if (response[0][0].SCOPEOFWORK) {
                    let scopeOfWork: any = {
                      DisplayName: "SCOPE OF WORK",
                      Value: response[0][0].SCOPEOFWORK
                    }
                    let CommentSection = this.makeTableJsonForTextArea(scopeOfWork);
                    docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSectionForTextArea(), CommentSection), "widths": ["100%", "100%"], layout: 'noBorders' });
                  }
                  if (this.isolationGroup.indexOf(this.parentReferenceID.toString()) > -1) {
                    docDefinition = this.generatePdfIsolation(docDefinition, response, this.parentReferenceID, transformedAttachments);
                  } else {
                    docDefinition = this.generatePdfActuation(docDefinition, response, transformedAttachments);
                  }
                  // console.log("Docdefinition" + JSON.stringify(docDefinition.content));
                  pdfMake.createPdf(docDefinition).getDataUrl((dataURL) => {
                    this.printed = false;
                    let filePath = cordova.file.dataDirectory;
                    let pdfFileName = "Temp_Report_SDR_" + this.valueProvider.getCurrentReport().REPORTID + "_" + langCode + ".pdf";
                    if (this.valueProvider.getCurrentReport().REPORTSTATUS == Enums.ReportStatus.Completed) { pdfFileName = "Report_SDR_" + this.valueProvider.getCurrentReport().REPORTID + "_" + langCode + ".pdf"; }


                    //  let pdfFileName = (isTemp ? "Temp_" : "") + "Report_SDR_" + currentReport.ReportID_Mobile + "_" + langCode + ".pdf";
                    let filePathSuffix = isTemp ? "/temp/" : '';
                    self.logger.log(self.fileName, 'generatepdf', "Saving Temporary Report for Report #" + pdfFileName);
                    self.utilityProvider.deleteFile(filePath + filePathSuffix, pdfFileName).then(res => {
                      self.utilityProvider.saveBase64Attachment(filePath + filePathSuffix, pdfFileName, dataURL.split(",")[1], "application/pdf").then((res) => {
                        resolve(pdfFileName);
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
      })
    }).catch(err => {
      self.logger.log(self.fileName, 'generatepdf', "Error in generatePdf: " + JSON.stringify(err));
    });
  }

  getFilteredDevice(element) {
    return new Promise((resolve, reject) => {
      this.localService.getProductByID(element.Value).then((res: any) => resolve(res));
    });
  }
  getBase64Attachment(folederId): Promise<any[]> {
    let promise = [];
    let filepath = cordova.file.dataDirectory;
    let iconType;
    let icons: any = {};
    let promiseIcon = [];
    return new Promise((resolve, reject) => {
      if (this.allAttachmentList.length != 0) {

        for (let i = 0; i < this.allAttachmentList.length; i++) {
          let attachmentName = this.allAttachmentList[i].FILENAME;
          let flowName = "Photos";
          let filetype = attachmentName.split(".")[1];
          if (this.allAttachmentList[i].FILETYPE.indexOf('image') > -1) {
            promise.push(this.getAttachmentBase64(filepath, folederId, flowName, attachmentName));
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
              if (imageResult[i]) this.allAttachmentList[i].base64 = imageResult[i];
            }
            this.allAttachmentList = this.allAttachmentList.filter((item: any) => {
              return String(item.SHOWINPDF) == "true";
            });
            if (this.isolationGroup.indexOf(this.parentReferenceID.toString()) > -1) {
              //07/11/2019 -- Zohaib Khan-- Transform Attachment Data based on Isolation Accordians and resolve it.
              resolve(this.transformAttachmentDataWithDevice("flowAndIsolation"));
            } else {
              //07/11/2019 -- Zohaib Khan-- Transform Attachment Data based on Actuator Accordians and resolve it.
              resolve(this.transformAttachmentDataWithDevice("Actuator"));
            }
          });
        }).catch((error) => {
          reject(error);
        });
      }
      else {
        resolve([]);
      }
    });

  }
  // 07/11/2019 -- Zohaib Khan -- transformAttachmentDataWithDevice function will transform the data based on selection of Device.
  transformAttachmentDataWithDevice(deviceName) {
    let transformedAttachmentData: any = [];
    if (deviceName == "Actuator") {
      transformedAttachmentData = [
        {
          header: "As Found",
          data: this.allAttachmentList.filter(item => { return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFound })
        },
        {
          header: "Calibration/Configuration",
          data: this.allAttachmentList.filter(item => { return item.ATTACHMENTTYPE == Enums.PhotosAccordion.CalibrationConfiguration })
        },
        {
          header: "Solution",
          data: this.allAttachmentList.filter(item => { return item.ATTACHMENTTYPE == Enums.PhotosAccordion.Solution })
        },
        {
          header: "Final Tests",
          data: this.allAttachmentList.filter(item => { return item.ATTACHMENTTYPE == Enums.PhotosAccordion.FinalTests })
        },
      ];
    }

    if (deviceName == "flowAndIsolation") {
      transformedAttachmentData = [
        {
          header: "As Found Assembly",
          data: this.allAttachmentList.filter(item => { return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundAssembly })
        },
        {
          header: "As Found Trim",
          data: this.allAttachmentList.filter(item => { return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsFoundTrim })
        },
        {
          header: "As Left Trim",
          data: this.allAttachmentList.filter(item => { return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsLeftTrim })
        },
        {
          header: "As Left Assembly",
          data: this.allAttachmentList.filter(item => { return item.ATTACHMENTTYPE == Enums.PhotosAccordion.AsLeftAssembly })
        },
      ];
    }
    return transformedAttachmentData
  }

  getIconBase64(type) {
    let path = cordova.file.dataDirectory + "/icons/";
    return new Promise((resolve, reject) => {
      this.utilityProvider.getBase64(path, type + ".png").then((res) => {
        let result: any = {};
        result[type] = res;
        resolve(result);
      });
    });
  }

  getAttachmentBase64(filepath, folederId, flowName, attachmentName) {
    return new Promise((resolve, reject) => {
      this.utilityProvider.getBase64(filepath + "/reportfiles/" + folederId + "/" + flowName + "/thumbnails", attachmentName).then(res => {
        resolve(res)
      }).catch(err => {
        this.logger.log(this.fileName, "getAttachmentBase64", "Error: " + JSON.stringify(err));
        resolve(false);
      })
    })
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

  getSubheaderColumn(value) {
    return { "text": (value ? value : " "), fontSize: '10', border: this.noborderstyle, color: '#234487', style: 'header' };
  }

  getCommentsColumn(value, isReportNotes?) {
    return { "text": (value ? value : " "), margin: [0, 0, 0, 0], border: this.noborderstyle, fontSize: 9, "style": "comment-text" };
  }


  generatePdfActuation(docDefinition, response, transformedAttachments?) {


    docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getAsFoundSection(response[3][0] ? response[3][0] : '', response[4][0] ? response[4][0] : '', response[5][0] ? response[5][0] : '')));

    if (response[6].length > 0) {
      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getElementsListSolution(response[6], this.translator("CALIBRATION DETAILS"))));
    }
    if (response[2].length > 0) {
      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getPreAndPostTestTable(response[2][0] ? response[2][0] : {})));
    }

    if (transformedAttachments.length > 0) {
      for (let i = 0; i < transformedAttachments.length; i++) {
        if (transformedAttachments[i].data.length > 0) {
          docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getAttachmentsTableWithHeader(transformedAttachments[i].data, this.translator(transformedAttachments[i].header))));
        }
      }
    }
    return docDefinition;
  }

  generatePdfIsolation(docDefinition, response, parentReferenceID?, transformedAttachments?) {
    /**Call for As found & SOlution Section */

    docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getAsFoundIsolationSection(response[2][0] ? response[2][0] : '', response[3][0] ? response[3][0] : '')));


    // -- Call For Final Calibration Table Section -- //
    docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSectionCalibration(), this.getCalibrationTable(response[6][0], response[7][0])));


    // -- Call For Test Data Table Section -- //
    let testData = response[13][0];
    if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.ControlValve || parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Isolation) {
      if (response[13].length > 0) {
        let transformTestData = this.transformTestData(testData);
        let body = this.getBodyFromElements(transformTestData);
        if (body.length > 0) {
          body.unshift([this.getTestDataTable('TEST DATA'), this.getTestDataTable('')])
          docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSection(), body), "widths": ["50%", "50%"], layout: 'noBorders' });
        }
        docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getTestDataAccordionTable(testData)));
      }
    }

    if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Regulator) {
      if (response[13].length > 0) {
        let transformTestData = this.transformTestDataRegulator(testData);
        let body = this.getBodyFromElements(transformTestData);
        if (body.length > 0) {
          body.unshift([this.getTestDataTable('TEST DATA'), this.getTestDataTable('')])
          docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSection(), body), "widths": ["50%", "50%"], layout: 'noBorders' });
        }
      }
    }

    if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.LevelTroll) {
      if (response[13].length > 0) {
        let transformTestData = this.transformTestData(testData);
        let body = this.getBodyFromElements(transformTestData);
        if (body.length > 0) {
          body.unshift([this.getTestDataTable('TEST DATA'), this.getTestDataTable('')])
          docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSection(), body), "widths": ["50%", "50%"], layout: 'noBorders' });
        }
        docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getTestDataAccordionTable(testData)));
      }
    }

    // -- Call For REPORT NOTES Section -- //
    if (response[10] && response[10].length > 0) {
      let reportNoesDataToPrint = this.transformRecommendationAndReportNotesData(response[10][0], "Repair Scope Completed", "REPAIRSCOPECOMPLETED_OT");
      if (reportNoesDataToPrint.length > 0 || response[10][0].NOTES) {
        docDefinition.content.push({ text: this.translator("REPORT NOTES"), color: '#234487', style: 'header' });
        let body = this.getBodyFromElements(reportNoesDataToPrint);
        if (body.length > 0) {
          docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSection(), body), "widths": ["50%", "50%"], layout: 'noBorders' });
        }
        docDefinition.content.push(this.getNotes(response[10][0].NOTES));
      }
    }

    // -- Call For RECOMMENDATIONS NOTES Section -- //
    if (response[9] && response[9].length > 0) {
      let recommendationDataToPrint = this.transformRecommendationAndReportNotesData(response[9][0], "Future Recommendations", "FUTURERECOMMENDATIONS_OT");
      if (recommendationDataToPrint.length > 0 || response[9][0].RECOMMENDATIONS) {
        docDefinition.content.push({ text: this.translator("RECOMMENDATIONS"), color: '#234487', style: 'header' });
        let body = this.getBodyFromElements(recommendationDataToPrint);
        if (body.length > 0) {
          docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSection(), body), "widths": ["50%", "50%"], layout: 'noBorders' });
        }
        docDefinition.content.push(this.getNotes(response[9][0].RECOMMENDATIONS));
      }
    }

    // -- Call For FINDINGS Section -- //
    if (response[5].length > 0) {
      docDefinition.content.push({ text: this.translator("FINDINGS"), color: '#234487', style: 'header' });
      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getFindingsIsolationSection(response[5][0] ? response[5][0] : '')));
      docDefinition.content.push({ text: this.translator("Recommended actions have been completed unless otherwise noted"), color: '#234487', style: 'header' });
    }

    if (response[12].length > 0) {
      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getAccessoryTable(response[12], this.translator("AS FOUND ACCESSORIES"))));
    }
    if (response[14].length > 0) {
      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getAccessoryTable(response[14], this.translator("AS LEFT ACCESSORIES"))));
    }

    // -- Call For Optional Services Section -- //
    if (response[11] && response[11].length > 0) {
      docDefinition.content.push({ text: this.translator("OPTIONAL SERVICES"), color: '#234487', style: 'header' });
      let key: any;
      if (this.parentReferenceID == Enums.FlowIsolationProductId.ControlValve) {
        key = 'CV';
      } else if (this.parentReferenceID == Enums.FlowIsolationProductId.Isolation) {
        key = 'ISO'
      } else if (this.parentReferenceID == Enums.FlowIsolationProductId.TrimOnly) {
        key = 'TO'
      }
      let transformedOptionalServicesInfo = this.transformOptionalServicesData(response[11][0], key);
      let body = this.getBodyFromElements(transformedOptionalServicesInfo);
      if (body.length > 0) {
        docDefinition.content.push({ "table": this.addBodyToTable(this.getContentSection(), body), "widths": ["50%", "50%"], layout: 'noBorders' });
      }

      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getOptionalServicesIsolationPreValveSection(response[11][0] ? response[11][0] : '')));
      docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(true), this.getOptionalServicesIsolationAccordionSection(response[11][0] ? response[11][0] : '')));
    }


    // -- Call For Final Inspection -- //
    docDefinition.content.push(this.addTableToSection(this.getTableSection(), this.getFinalInspection(response[8][0] ? response[8][0] : {})));


    // -- Call For Attachments Section -- //
    if (transformedAttachments) {
      for (let i = 0; i < transformedAttachments.length; i++) {
        if (transformedAttachments[i].data.length > 0) {
          docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getAttachmentsTableWithHeader(transformedAttachments[i].data, this.translator(transformedAttachments[i].header))));
        }
      }
    }
    return docDefinition;


  }

  transformRecommendationAndReportNotesData(notesData, label?, otherKey?) {
    let transformedData = [];
    if (notesData.LookupValue || notesData[otherKey]) {
      transformedData.push({
        DisplayName: label,
        Value: notesData.LookupValue ? notesData.LookupValue : notesData[otherKey]
      });
    }
    return transformedData;
  }

  getFinalInspection(finalInsperctionData) {
    if (finalInsperctionData) {
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.ControlValve) {

        return this.getFinalInspectionControlValve(finalInsperctionData);
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Isolation) {
        return this.getFinalInspectionIsolation(finalInsperctionData);
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Regulator) {
        return this.getFinalInspectionRegulator(finalInsperctionData);
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Instrument) {
        return this.getFinalInspectionInstrument(finalInsperctionData);
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Controller) {
        return this.getFinalInspectionController(finalInsperctionData);
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.LevelTroll) {
        return this.getFinalInspectionLevelTroll(finalInsperctionData);
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.TrimOnly) {
        return this.getFinalInspectionTrimOnly(finalInsperctionData);
      }
    }
  }

  getFinalInspectionControlValve(finalInsperctionData) {
    let table = { columns: [] };
    let subTableforItems: any;
    let headingrow = false;
    try {
      let rows = [];
      subTableforItems = this.getNewTable();

      // -- Body Assembly -- //
      if (String(finalInsperctionData.CV_BODYASSEMBLY_NA) != "true") {

        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Body Assembly", "Body Ht", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_BODYHT), "Bonnet Ht", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_BONNETHT)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Bottom Ht", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_BOTTOMHT), "Seal Protector Ring Ht", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_SEALPROTECTORRINGHT)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Body Size/Rating", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_BODYSIZE_RATING), "Body/Bonnet Material", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_BODY_BONNETMATERIAL)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Body Material Correct", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_BODYMATERIALCORRECT), "Bolting Torqued to Specification", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_BOLTINGTORQUEDTOSPECIFICATION)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Painted Per FFS 6A28 (Color)", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_PAINTEDPERFFS6A28_CLR), "Painted Per Customer Requirements", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_PAINTEDPERCUSTOMERREQUIREMENTS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Serial Number", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_SERIALNUMBER), "Name Plate Information Correct", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_NAMEPLATEINFORMATIONCORRECT)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Flow Direction Arrow", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_FLOWDIRECTIONARROW), "Minimum wall thickness", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_MINIMUMWALLTHICKNESS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Rotation Indicator", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_ROTATIONINDICATOR), "Hydro Stamp", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_HYDROSTAMP)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Service Co. Tag Attached", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_SERVICECOTAGATTACHED), "Corrosion Protection Oil Applied", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_CORROSIONPROTECTIONOILAPPLIED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Heat Number on Body/ Bonnet (list on right)", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_HEATNUMBERONBODY_BONNET_LISTONRIGHT), "End Connections/Flanges", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_ENDCONNECTIONS_FLANGES)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Castings Meet MSS-SP55", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_CASTINGSMEETMSS_SP55), "Fisher Certified tag attached", this.validateFinalInspectionValue(finalInsperctionData.CV_BODYASSEMBLY_FISHERCERTIFIEDTAGATTACHED)));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Actuator Assembly -- //
      if (String(finalInsperctionData.CV_ACTUATORASSEMBLY_NA) != "true") {
        subTableforItems = this.getNewTable();




        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Actuator Assembly", "Name Plate Information Correct", this.validateFinalInspectionValue(finalInsperctionData.CV_ACTUATORASSEMBLY_NAMEPLATEINFORMATIONCORRECT), "Safety Tag Attached", this.validateFinalInspectionValue(finalInsperctionData.CV_ACTUATORASSEMBLY_SAFETYTAGATTACHED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Painted Per FFS 6A28 (Color)", this.validateFinalInspectionValue(finalInsperctionData.CV_ACTUATORASSEMBLY_PAINTEDPERFFS6A28_CLR), "Painted Per Customer Requirements", this.validateFinalInspectionValue(finalInsperctionData.CV_ACTUATORASSEMBLY_PAINTEDPERCUSTOMERREQUIREMENTS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Vent Cap Attached", this.validateFinalInspectionValue(finalInsperctionData.CV_ACTUATORASSEMBLY_VENTCAPATTACHED), "Top Loading Port Capped Off", this.validateFinalInspectionValue(finalInsperctionData.CV_ACTUATORASSEMBLY_TOPLOADINGPORTCAPPEDOFF)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Serial Number", this.validateFinalInspectionValue(finalInsperctionData.CV_ACTUATORASSEMBLY_SERIALNUMBER), "Size and Type", this.validateFinalInspectionValue(finalInsperctionData.CV_ACTUATORASSEMBLY_SIZEANDTYPE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Stem Conn. Assy Tight/ Correct Pos", this.validateFinalInspectionValue(finalInsperctionData.CV_ACTUATORASSEMBLY_STEMCONNASSYTIGHT_CORRECTPOS), "Service Co. Tag Attached", this.validateFinalInspectionValue(finalInsperctionData.CV_ACTUATORASSEMBLY_SERVICECOTAGATTACHED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "All Other Conn. Secured ", this.validateFinalInspectionValue(finalInsperctionData.CV_ACTUATORASSEMBLY_ALLOTHERCONNSECURED), " ", this.validateFinalInspectionValue(' ')));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Instrumentation/ Accessories -- //
      if (String(finalInsperctionData.CV_INSTRUMENTATION_ACCESSORIES_NA) != "true") {
        subTableforItems = this.getNewTable();
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Instrumentation/ Accessories", "Painted Per FFS 6A28 (Color)", this.validateFinalInspectionValue(finalInsperctionData.CV_INSTRUMENTATION_ACCESSORIES_PAINTEDPERFFS6A28_CLR), "Painted Per Customer Requirements", this.validateFinalInspectionValue(finalInsperctionData.CV_INSTRUMENTATION_ACCESSORIES_PAINTEDPERCUSTOMERREQUIREMENTS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Name Plate Information Correct", this.validateFinalInspectionValue(finalInsperctionData.CV_INSTRUMENTATION_ACCESSORIESNAMEPLATEINFORMATIONCORRECT), "Service Co. Tag Attached", this.validateFinalInspectionValue(finalInsperctionData.CV_INSTRUMENTATION_ACCESSORIES_SERVICECOTAGATTACHED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Hazardous approval marks validated", this.validateFinalInspectionValue(finalInsperctionData.CV_INSTRUMENTATION_ACCESSORIES_HAZARDOUSAPPROVALMARKSVALIDATED), "Correct Tubing/Fittings", this.validateFinalInspectionValue(finalInsperctionData.CV_INSTRUMENTATION_ACCESSORIES_CORRECTTUBING_FITTINGS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Correct Mounting Orientation", this.validateFinalInspectionValue(finalInsperctionData.CV_INSTRUMENTATION_ACCESSORIES_CORRECTMOUNTINGORIENTATION), "Calibration Tag Attached", this.validateFinalInspectionValue(finalInsperctionData.CV_INSTRUMENTATION_ACCESSORIES_CALIBRATIONTAGATTACHED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "If Performed, Flowscanner Tag Att.", this.validateFinalInspectionValue(finalInsperctionData.CV_INSTRUMENTATION_ACCESSORIES_IFPERFORMED_FLOWSCANNERTAGATT), "All Other Conn./Mtg. Part Secured", this.validateFinalInspectionValue(finalInsperctionData.CV_INSTRUMENTATION_ACCESSORIES_ALLOTHERCONN_MTGPARTSECURED)));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Documentation -- //
      if (String(finalInsperctionData.CV_DOCUMENTATION_NA) != "true") {
        subTableforItems = this.getNewTable();
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Documentation", "Repair Order Complete", this.validateFinalInspectionValue(finalInsperctionData.CV_DOCUMENTATION_REPAIRORDERCOMPLETE), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.CV_DOCUMENTATION_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Repair Report Complete", this.validateFinalInspectionValue(finalInsperctionData.CV_DOCUMENTATION_REPAIRREPORTCOMPLETE), "Oracle Quality Complete", this.validateFinalInspectionValue(finalInsperctionData.CV_DOCUMENTATION_ORACLEQUALITYREPORTCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Diagnostics Report Complete", this.validateFinalInspectionValue(finalInsperctionData.CV_DOCUMENTATION_DIAGNOSTICSREPORTCOMPLETE), "As Shipped Photo", this.validateFinalInspectionValue(finalInsperctionData.CV_DOCUMENTATION_ASSHIPPEDPHOTO)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "P.I.D Tag", this.validateFinalInspectionValue(finalInsperctionData.CV_DOCUMENTATION_PIDTAG), "Weld Reports & PWHT Charts Complete", this.validateFinalInspectionValue(finalInsperctionData.CV_DOCUMENTATION_WELDREPORTS_PWHTCHARTSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "NDE Reports Complete", this.validateFinalInspectionValue(finalInsperctionData.CV_DOCUMENTATION_NDEREPORTSCOMPLETE), " ", this.validateFinalInspectionValue(' ')));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Shipping -- //
      if (String(finalInsperctionData.CV_SHIPPING_NA) != "true") {
        subTableforItems = this.getNewTable();
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Shipping", "Final Overall Visual", this.validateFinalInspectionValue(finalInsperctionData.CV_SHIPPING_FINALOVERALLVISUAL), "Instruction Manuals", this.validateFinalInspectionValue(finalInsperctionData.CV_SHIPPING_INSTRUCTIONMANUALS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Flange Covers", this.validateFinalInspectionValue(finalInsperctionData.CV_SHIPPING_FLANGECOVERS), "Open Ports Capped", this.validateFinalInspectionValue(finalInsperctionData.CV_SHIPPING_OPENPORTSCAPPED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Paper Work Completed", this.validateFinalInspectionValue(finalInsperctionData.CV_SHIPPING_PAPERWORKCOMPLETED), "Old Parts: Returned", this.validateFinalInspectionValue(finalInsperctionData.CV_SHIPPING_OLDPARTS_RETURNED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Scrapped", this.validateFinalInspectionValue(finalInsperctionData.CV_SHIPPING_SCRAPPED), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.CV_SHIPPING_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }
      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getConstructionTable', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getFinalInspectionIsolation(finalInsperctionData) {
    let table = { columns: [] };
    let subTableforItems: any;
    let headingrow = false;
    try {
      let rows = [];
      subTableforItems = this.getNewTable();

      // -- Documentation -- //
      if (String(finalInsperctionData.ISO_DOCUMENTATION_NA) != "true") {
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Documentation", "Repair Order Complete", this.validateFinalInspectionValue(finalInsperctionData.ISO_DOCUMENTATION_REPAIRORDERCOMPLETE), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.ISO_DOCUMENTATION_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Repair Report Complete", this.validateFinalInspectionValue(finalInsperctionData.ISO_DOCUMENTATION_REPAIRREPORTCOMPLETE), "Oracle Quality Complete", this.validateFinalInspectionValue(finalInsperctionData.ISO_DOCUMENTATION_ORACLEQUALITYREPORTCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Diagnostics Report Complete", this.validateFinalInspectionValue(finalInsperctionData.ISO_DOCUMENTATION_DIAGNOSTICSREPORTCOMPLETE), "As Shipped Photo", this.validateFinalInspectionValue(finalInsperctionData.ISO_DOCUMENTATION_ASSHIPPEDPHOTO)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "P.I.D Tag", this.validateFinalInspectionValue(finalInsperctionData.ISO_DOCUMENTATION_PIDTAG), "Weld Reports & PWHT Charts Complete", this.validateFinalInspectionValue(finalInsperctionData.ISO_DOCUMENTATION_WELDREPORTS_PWHTCHARTSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "NDE Reports Complete", this.validateFinalInspectionValue(finalInsperctionData.ISO_DOCUMENTATION_NDEREPORTSCOMPLETE), " ", this.validateFinalInspectionValue(' ')));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Shipping -- //
      if (String(finalInsperctionData.ISO_SHIPPING_NA) != "true") {
        subTableforItems = this.getNewTable();
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Shipping", "Final Overall Visual", this.validateFinalInspectionValue(finalInsperctionData.ISO_SHIPPING_FINALOVERALLVISUAL), "Instruction Manuals", this.validateFinalInspectionValue(finalInsperctionData.ISO_SHIPPING_INSTRUCTIONMANUALS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Flange Covers", this.validateFinalInspectionValue(finalInsperctionData.ISO_SHIPPING_FLANGECOVERS), "Open Ports Capped", this.validateFinalInspectionValue(finalInsperctionData.ISO_SHIPPING_OPENPORTSCAPPED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Paper Work Completed", this.validateFinalInspectionValue(finalInsperctionData.ISO_SHIPPING_PAPERWORKCOMPLETED), "Old Parts: Returned", this.validateFinalInspectionValue(finalInsperctionData.ISO_SHIPPING_OLDPARTS_RETURNED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Scrapped", this.validateFinalInspectionValue(finalInsperctionData.ISO_SHIPPING_SCRAPPED), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.ISO_SHIPPING_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }
      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getConstructionTable', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getFinalInspectionRegulator(finalInsperctionData) {
    let table = { columns: [] };
    let subTableforItems: any;
    let headingrow = false;
    try {
      let rows = [];
      subTableforItems = this.getNewTable();

      // -- Regulator Assembly -- //
      if (String(finalInsperctionData.REG_REGULATORASSEMBLY_NA) != "true") {
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Regulator Assembly", "Painted Per FFS 6A28 (Color)", this.validateFinalInspectionValue(finalInsperctionData.REG_REGULATORASSEMBLY_PAINTEDPERFFS6A28_CLR), "Painted Per Customer Requirements", this.validateFinalInspectionValue(finalInsperctionData.REG_REGULATORASSEMBLY_PAINTEDPERCUSTOMERREQUIREMENTS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Name Plate Information Correct", this.validateFinalInspectionValue(finalInsperctionData.REG_REGULATORASSEMBLY_NAMEPLATEINFORMATIONCORRECT), "Special Tagging Attached", this.validateFinalInspectionValue(finalInsperctionData.REG_REGULATORASSEMBLY_SPECIALTAGGINGATTACHED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Service Co. Tag Attached", this.validateFinalInspectionValue(finalInsperctionData.REG_REGULATORASSEMBLY_SERVICECOTAGATTACHED), "Regulator Preset and Tagged", this.validateFinalInspectionValue(finalInsperctionData.REG_REGULATORASSEMBLY_REGULATORPRESETANDTAGGED)));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Documentation -- //
      if (String(finalInsperctionData.REG_DOCUMENTATION_NA) != "true") {
        subTableforItems = this.getNewTable();
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Documentation", "Repair Order Complete", this.validateFinalInspectionValue(finalInsperctionData.REG_DOCUMENTATION_REPAIRORDERCOMPLETE), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.REG_DOCUMENTATION_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Repair Report Complete", this.validateFinalInspectionValue(finalInsperctionData.REG_DOCUMENTATION_REPAIRREPORTCOMPLETE), "Oracle Quality Complete", this.validateFinalInspectionValue(finalInsperctionData.REG_DOCUMENTATION_ORACLEQUALITYREPORTCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Diagnostics Report Complete", this.validateFinalInspectionValue(finalInsperctionData.REG_DOCUMENTATION_DIAGNOSTICSREPORTCOMPLETE), "As Shipped Photo", this.validateFinalInspectionValue(finalInsperctionData.REG_DOCUMENTATION_ASSHIPPEDPHOTO)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "P.I.D Tag", this.validateFinalInspectionValue(finalInsperctionData.REG_DOCUMENTATION_PIDTAG), "Weld Reports & PWHT Charts Complete", this.validateFinalInspectionValue(finalInsperctionData.REG_DOCUMENTATION_WELDREPORTS_PWHTCHARTSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "NDE Reports Complete", this.validateFinalInspectionValue(finalInsperctionData.REG_DOCUMENTATION_NDEREPORTSCOMPLETE), " ", this.validateFinalInspectionValue(' ')));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Shipping -- //
      if (String(finalInsperctionData.REG_SHIPPING_NA) != "true") {
        subTableforItems = this.getNewTable();
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Shipping", "Final Overall Visual", this.validateFinalInspectionValue(finalInsperctionData.REG_SHIPPING_FINALOVERALLVISUAL), "Instruction Manuals", this.validateFinalInspectionValue(finalInsperctionData.REG_SHIPPING_INSTRUCTIONMANUALS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Flange Covers", this.validateFinalInspectionValue(finalInsperctionData.REG_SHIPPING_FLANGECOVERS), "Open Ports Capped", this.validateFinalInspectionValue(finalInsperctionData.REG_SHIPPING_OPENPORTSCAPPED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Paper Work Completed", this.validateFinalInspectionValue(finalInsperctionData.REG_SHIPPING_PAPERWORKCOMPLETED), "Old Parts: Returned", this.validateFinalInspectionValue(finalInsperctionData.REG_SHIPPING_OLDPARTS_RETURNED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Scrapped", this.validateFinalInspectionValue(finalInsperctionData.REG_SHIPPING_SCRAPPED), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.REG_SHIPPING_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getFinalInspectionRegulator', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getFinalInspectionInstrument(finalInsperctionData) {
    let table = { columns: [] };
    let subTableforItems: any;
    let headingrow = false;
    try {
      let rows = [];
      subTableforItems = this.getNewTable();
      // subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
      // -- Instrumentation/ Accessories -- //
      if (String(finalInsperctionData.INS_INSTRUMENTATION_ACCESSORIES_NA) != "true") {
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Instrumentation/ Accessories", "Painted Per FFS 6A28 (Color)", this.validateFinalInspectionValue(finalInsperctionData.INSTRUMENTATION_ACCESSORIES_PAINTEDPERFFS6A28_CLR), "Painted Per Customer Requirements", this.validateFinalInspectionValue(finalInsperctionData.INSTRUMENTATION_ACCESSORIES_PAINTEDPERCUSTOMERREQUIREMENTS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Name Plate Information Correct", this.validateFinalInspectionValue(finalInsperctionData.INSTRUMENTATION_ACCESSORIESNAMEPLATEINFORMATIONCORRECT), "Service Co. Tag Attached", this.validateFinalInspectionValue(finalInsperctionData.INSTRUMENTATION_ACCESSORIES_SERVICECOTAGATTACHED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Hazardous approval marks validated", this.validateFinalInspectionValue(finalInsperctionData.INSTRUMENTATION_ACCESSORIES_HAZARDOUSAPPROVALMARKSVALIDATED), "Correct Tubing/Fittings", this.validateFinalInspectionValue(finalInsperctionData.INSTRUMENTATION_ACCESSORIES_CORRECTTUBING_FITTINGS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Correct Mounting Orientation", this.validateFinalInspectionValue(finalInsperctionData.INSTRUMENTATION_ACCESSORIES_CORRECTMOUNTINGORIENTATION), "Calibration Tag Attached", this.validateFinalInspectionValue(finalInsperctionData.INSTRUMENTATION_ACCESSORIES_CALIBRATIONTAGATTACHED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "If Performed, Flowscanner Tag Att.", this.validateFinalInspectionValue(finalInsperctionData.INSTRUMENTATION_ACCESSORIES_IFPERFORMED_FLOWSCANNERTAGATT), "All Other Conn./Mtg. Part Secured", this.validateFinalInspectionValue(finalInsperctionData.INSTRUMENTATION_ACCESSORIES_ALLOTHERCONN_MTGPARTSECURED)));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Documentation -- //
      if (String(finalInsperctionData.INS_DOCUMENTATION_NA) != "true") {
        subTableforItems = this.getNewTable();
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Documentation", "Repair Order Complete", this.validateFinalInspectionValue(finalInsperctionData.DOCUMENTATION_REPAIRORDERCOMPLETE), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.DOCUMENTATION_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Repair Report Complete", this.validateFinalInspectionValue(finalInsperctionData.DOCUMENTATION_REPAIRREPORTCOMPLETE), "Oracle Quality Report Complete", this.validateFinalInspectionValue(finalInsperctionData.DOCUMENTATION_ORACLEQUALITYREPORTCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Diagnostics Report Complete", this.validateFinalInspectionValue(finalInsperctionData.DOCUMENTATION_DIAGNOSTICSREPORTCOMPLETE), "As Shipped Photo", this.validateFinalInspectionValue(finalInsperctionData.DOCUMENTATION_ASSHIPPEDPHOTO)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "P.I.D Tag", this.validateFinalInspectionValue(finalInsperctionData.DOCUMENTATION_PIDTAG), "Weld Reports & PWHT Charts Complete", this.validateFinalInspectionValue(finalInsperctionData.DOCUMENTATION_WELDREPORTS_PWHTCHARTSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "NDE Reports Complete", this.validateFinalInspectionValue(finalInsperctionData.DOCUMENTATION_NDEREPORTSCOMPLETE), " ", this.validateFinalInspectionValue(' ')));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Shipping -- //
      if (String(finalInsperctionData.INS_SHIPPING_NA) != "true") {
        subTableforItems = this.getNewTable();
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Shipping", "Final Overall Visual", this.validateFinalInspectionValue(finalInsperctionData.SHIPPING_FINALOVERALLVISUAL), "Instruction Manuals", this.validateFinalInspectionValue(finalInsperctionData.SHIPPING_INSTRUCTIONMANUALS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Flange Covers", this.validateFinalInspectionValue(finalInsperctionData.SHIPPING_FLANGECOVERS), "Open Ports Capped", this.validateFinalInspectionValue(finalInsperctionData.SHIPPING_OPENPORTSCAPPED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Paper Work Completed", this.validateFinalInspectionValue(finalInsperctionData.SHIPPING_PAPERWORKCOMPLETED), "Old Parts: Returned", this.validateFinalInspectionValue(finalInsperctionData.SHIPPING_OLDPARTS_RETURNED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Scrapped", this.validateFinalInspectionValue(finalInsperctionData.SHIPPING_SCRAPPED), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.SHIPPING_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getFinalInspectionRegulator', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getFinalInspectionController(finalInsperctionData) {
    let table = { columns: [] };
    let subTableforItems: any;
    let headingrow = false;
    try {
      let rows = [];
      subTableforItems = this.getNewTable();
      //  subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);

      // -- Documentation -- //
      if (String(finalInsperctionData.CTR_DOCUMENTATION_NA) != "true") {
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Documentation", "Repair Order Complete", this.validateFinalInspectionValue(finalInsperctionData.CTR_DOCUMENTATION_REPAIRORDERCOMPLETE), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.CTR_DOCUMENTATION_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Repair Report Complete", this.validateFinalInspectionValue(finalInsperctionData.CTR_DOCUMENTATION_REPAIRREPORTCOMPLETE), "Oracle Quality Report Complete", this.validateFinalInspectionValue(finalInsperctionData.CTR_DOCUMENTATION_ORACLEQUALITYREPORTCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Diagnostics Report Complete", this.validateFinalInspectionValue(finalInsperctionData.CTR_DOCUMENTATION_DIAGNOSTICSREPORTCOMPLETE), "As Shipped Photo", this.validateFinalInspectionValue(finalInsperctionData.CTR_DOCUMENTATION_ASSHIPPEDPHOTO)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "P.I.D Tag", this.validateFinalInspectionValue(finalInsperctionData.CTR_DOCUMENTATION_PIDTAG), "Weld Reports & PWHT Charts Complete", this.validateFinalInspectionValue(finalInsperctionData.CTR_DOCUMENTATION_WELDREPORTS_PWHTCHARTSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "NDE Reports Complete", this.validateFinalInspectionValue(finalInsperctionData.CTR_DOCUMENTATION_NDEREPORTSCOMPLETE), " ", this.validateFinalInspectionValue(' ')));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Shipping -- //
      if (String(finalInsperctionData.CTR_SHIPPING_NA) != "true") {
        subTableforItems = this.getNewTable();
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Shipping", "Final Overall Visual", this.validateFinalInspectionValue(finalInsperctionData.CTR_SHIPPING_FINALOVERALLVISUAL), "Instruction Manuals", this.validateFinalInspectionValue(finalInsperctionData.CTR_SHIPPING_INSTRUCTIONMANUALS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Flange Covers", this.validateFinalInspectionValue(finalInsperctionData.CTR_SHIPPING_FLANGECOVERS), "Open Ports Capped", this.validateFinalInspectionValue(finalInsperctionData.CTR_SHIPPING_OPENPORTSCAPPED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Paper Work Completed", this.validateFinalInspectionValue(finalInsperctionData.CTR_SHIPPING_PAPERWORKCOMPLETED), "Old Parts: Returned", this.validateFinalInspectionValue(finalInsperctionData.CTR_SHIPPING_OLDPARTS_RETURNED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Scrapped", this.validateFinalInspectionValue(finalInsperctionData.CTR_SHIPPING_SCRAPPED), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.CTR_SHIPPING_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getFinalInspectionRegulator', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getFinalInspectionLevelTroll(finalInsperctionData) {
    let table = { columns: [] };
    let subTableforItems: any;
    let headingrow = false;
    try {
      let rows = [];
      subTableforItems = this.getNewTable();
      //subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);

      // -- Level-Trol Assembly  -- //
      if (String(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_NA) != "true") {
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Level-Trol Assembly", "Painted Per FFS 6A28 (Color)", this.validateFinalInspectionValue(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_PAINTEDPERFFS6A28_CLR), "Cage/Head Material", this.validateFinalInspectionValue(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_CAGE_HEADMATERIAL)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Painted Per Customer Requirements", this.validateFinalInspectionValue(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_PAINTEDPERCUSTOMERREQUIREMENTS), "Serial Number", this.validateFinalInspectionValue(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_SERIALNUMBER)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Name Plate Information Correct", this.validateFinalInspectionValue(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_NAMEPLATEINFORMATIONCORRECT), "Hydro Stamp", this.validateFinalInspectionValue(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_HYDROSTAMP)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Service Co. Tag Attached", this.validateFinalInspectionValue(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_SERVICECOTAGATTACHED), "Corrosion Protection Oil Applied", this.validateFinalInspectionValue(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_CORROSIONPROTECTIONOILAPPLIED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Correct Cage/Head Assy Orientation", this.validateFinalInspectionValue(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_CORRECTCAGE_HEADASSYORIENTATION), "Center Line Plate Attached", this.validateFinalInspectionValue(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_CENTERLINEPLATEATTACHED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Torque Tube Cover Cap Secured", this.validateFinalInspectionValue(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_TORQUETUBECOVERCAPSECURED), "Shipping Blocks In Place And Secure", this.validateFinalInspectionValue(finalInsperctionData.LT_LEVEL_TROLASSEMBLY_SHIPPINGBLOCKSINPLACEANDSECURE)));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Documentation -- //
      if (String(finalInsperctionData.LT_DOCUMENTATION_NA) != "true") {
        subTableforItems = this.getNewTable();
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Documentation", "Repair Order Complete", this.validateFinalInspectionValue(finalInsperctionData.LT_DOCUMENTATION_REPAIRORDERCOMPLETE), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.LT_DOCUMENTATION_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Repair Report Complete", this.validateFinalInspectionValue(finalInsperctionData.LT_DOCUMENTATION_REPAIRREPORTCOMPLETE), "Oracle Quality Report Complete", this.validateFinalInspectionValue(finalInsperctionData.LT_DOCUMENTATION_ORACLEQUALITYREPORTCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Diagnostics Report Complete", this.validateFinalInspectionValue(finalInsperctionData.LT_DOCUMENTATION_DIAGNOSTICSREPORTCOMPLETE), "As Shipped Photo", this.validateFinalInspectionValue(finalInsperctionData.LT_DOCUMENTATION_ASSHIPPEDPHOTO)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "P.I.D Tag", this.validateFinalInspectionValue(finalInsperctionData.LT_DOCUMENTATION_PIDTAG), "Weld Reports & PWHT Charts Complete", this.validateFinalInspectionValue(finalInsperctionData.LT_DOCUMENTATION_WELDREPORTS_PWHTCHARTSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "NDE Reports Complete", this.validateFinalInspectionValue(finalInsperctionData.LT_DOCUMENTATION_NDEREPORTSCOMPLETE), " ", this.validateFinalInspectionValue(' ')));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Shipping -- //
      if (String(finalInsperctionData.LT_SHIPPING_NA) != "true") {
        subTableforItems = this.getNewTable();
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Shipping", "Final Overall Visual", this.validateFinalInspectionValue(finalInsperctionData.LT_SHIPPING_FINALOVERALLVISUAL), "Instruction Manuals", this.validateFinalInspectionValue(finalInsperctionData.LT_SHIPPING_INSTRUCTIONMANUALS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Flange Covers", this.validateFinalInspectionValue(finalInsperctionData.LT_SHIPPING_FLANGECOVERS), "Open Ports Capped", this.validateFinalInspectionValue(finalInsperctionData.LT_SHIPPING_OPENPORTSCAPPED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Paper Work Completed", this.validateFinalInspectionValue(finalInsperctionData.LT_SHIPPING_PAPERWORKCOMPLETED), "Old Parts: Returned", this.validateFinalInspectionValue(finalInsperctionData.LT_SHIPPING_OLDPARTS_RETURNED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Scrapped", this.validateFinalInspectionValue(finalInsperctionData.LT_SHIPPING_SCRAPPED), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.LT_SHIPPING_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getFinalInspectionRegulator', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getFinalInspectionTrimOnly(finalInsperctionData) {
    let table = { columns: [] };
    let subTableforItems: any;
    let headingrow = false;
    try {
      let rows = [];
      subTableforItems = this.getNewTable();
      // subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);

      // -- Documentation -- //
      if (String(finalInsperctionData.TO_DOCUMENTATION_NA) != "true") {
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Documentation", "Repair Order Complete", this.validateFinalInspectionValue(finalInsperctionData.TO_DOCUMENTATION_REPAIRORDERCOMPLETE), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.TO_DOCUMENTATION_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Repair Report Complete", this.validateFinalInspectionValue(finalInsperctionData.TO_DOCUMENTATION_REPAIRREPORTCOMPLETE), "Oracle Quality Report Complete", this.validateFinalInspectionValue(finalInsperctionData.TO_DOCUMENTATION_ORACLEQUALITYREPORTCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Diagnostics Report Complete", this.validateFinalInspectionValue(finalInsperctionData.TO_DOCUMENTATION_DIAGNOSTICSREPORTCOMPLETE), "As Shipped Photo", this.validateFinalInspectionValue(finalInsperctionData.TO_DOCUMENTATION_ASSHIPPEDPHOTO)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "P.I.D Tag", this.validateFinalInspectionValue(finalInsperctionData.TO_DOCUMENTATION_PIDTAG), "Weld Reports & PWHT Charts Complete", this.validateFinalInspectionValue(finalInsperctionData.TO_DOCUMENTATION_WELDREPORTS_PWHTCHARTSCOMPLETE)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "NDE Reports Complete", this.validateFinalInspectionValue(finalInsperctionData.TO_DOCUMENTATION_NDEREPORTSCOMPLETE), " ", this.validateFinalInspectionValue(' ')));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      // -- Shipping -- //
      if (String(finalInsperctionData.TO_SHIPPING_NA) != "true") {
        subTableforItems = this.getNewTable();
        if (!headingrow) {
          subTableforItems.table.body.push([this.getTableHeader("FINAL INSPECTION", 2), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
          headingrow = true;
        }
        subTableforItems.table.body.push(this.getRowForFinalInspection("Shipping", "Final Overall Visual", this.validateFinalInspectionValue(finalInsperctionData.CTR_SHIPPING_FINALOVERALLVISUAL), "Instruction Manuals", this.validateFinalInspectionValue(finalInsperctionData.TO_SHIPPING_INSTRUCTIONMANUALS)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Flange Covers", this.validateFinalInspectionValue(finalInsperctionData.CTR_SHIPPING_FLANGECOVERS), "Open Ports Capped", this.validateFinalInspectionValue(finalInsperctionData.TO_SHIPPING_OPENPORTSCAPPED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Paper Work Completed", this.validateFinalInspectionValue(finalInsperctionData.CTR_SHIPPING_PAPERWORKCOMPLETED), "Old Parts: Returned", this.validateFinalInspectionValue(finalInsperctionData.TO_SHIPPING_OLDPARTS_RETURNED)));
        subTableforItems.table.body.push(this.getRowForFinalInspection(" ", "Scrapped", this.validateFinalInspectionValue(finalInsperctionData.CTR_SHIPPING_SCRAPPED), "Job Instructions Complete", this.validateFinalInspectionValue(finalInsperctionData.TO_SHIPPING_JOBINSTRUCTIONSCOMPLETE)));
        subTableforItems.table.body.push([this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure(""), this.getBlankColumnForPressure("")]);
        rows.push(subTableforItems);
      }

      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getFinalInspectionRegulator', "Error: " + JSON.stringify(err));
    }
    return table;
  }


  validateFinalInspectionValue(value) {
    return value ? value : " ";
  }

  getRowForFinalInspection(accordion, leftDisplay, leftValue, rightDisplay, rightValue) {
    let row = [];
    row.push(this.getBlankColumn(accordion));
    row.push(this.getLabelColumn(this.translator(leftDisplay)));
    row.push(this.getValueColumn(leftValue));
    row.push(this.getBlankColumn(' '));
    row.push(this.getLabelColumn(this.translator(rightDisplay)));
    row.push(this.getValueColumn(rightValue));

    return row;

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


  getElementsListSolution(elementList, header) {
    let table = { columns: [] };
    try {
      let rows = [];
      let accessoryTable = {
        //12-09-2019://Gaurav V -  Changes to resolve blank row issue and new table margin
        id: 'elementSolution',
        table: {
          widths: ['16%', '16%', '16%', '16%', '16%', '16%'],
          body: [],
        },
        layout: {
          layout: 'noBorders',
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
          }
        },
      };
      accessoryTable.table.body.push([{ text: this.translator(header), border: [false, false, false, false], fillColor: "#FFF", color: '#234487', style: 'header', colSpan: 2 }, this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
      accessoryTable.table.body.push([this.getBlankPart(this.translator("Element")), this.getBlankPart(this.translator("Option")), this.getBlankPart(this.translator("Direction")), this.getBlankPart(this.translator("Condition")), this.getBlankPart(this.translator("Recommended Action")), this.getBlankPart(this.translator("Result"))]);
      for (let k = 0; k < elementList.length; k++) {
        let jsonObj = elementList[k];
        accessoryTable.table.body.push([
          this.getPartValue(jsonObj.CA_ELEMENT == "Other" ? jsonObj.ELEMENT_OTHER : jsonObj.CA_ELEMENT),
          this.getPartValue(jsonObj.CA_OPTION == "Other" ? jsonObj.OPTION_OTHER : jsonObj.CA_OPTION),
          this.getPartValue(jsonObj.DIRECTION == "Other" ? jsonObj.DIRECTION_OTHER : jsonObj.DIRECTION),
          this.getPartValue(jsonObj.CONDITION == "Other" ? jsonObj.CONDITION_OTHER : jsonObj.CONDITION),
          this.getPartValue(jsonObj.RECOMMENDEDACTION == "Other" ? jsonObj.RECOMMENDEDACTION_OTHER : jsonObj.RECOMMENDEDACTION),
          this.getPartValue(jsonObj.CA_RESULT == "Other" ? jsonObj.RESULT_OTHER : jsonObj.CA_RESULT)]);
      }
      rows.push(accessoryTable);
      table.columns.push(rows);

    } catch (err) {
      this.logger.log(this.fileName, 'getElementsListSolution', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  transformServiceInfoData(serviceInfoData) {
    let transformedData = [
      {
        DisplayName: "Customer Service Site",
        Value: serviceInfoData.CUSTOMERNAME
      },
      {
        DisplayName: "Customer PO#",
        Value: serviceInfoData.CUSTOMERPO
      },
      {
        DisplayName: "Sales PO #",
        Value: serviceInfoData.SALESPO
      },
      {
        DisplayName: "Emerson Service Site",
        Value: serviceInfoData.EMERSONSERVICESITE ? serviceInfoData.EMERSONSERVICESITE : " "
      },
      {
        DisplayName: "Project #",
        Value: serviceInfoData.PROJECTNO
      }
    ];
    return transformedData
  }

  transformTestData(testData) {
    let transformedData: any = [];
    if (testData) {
      if (testData.TESTTECHNICIAN) {
        transformedData.push({ DisplayName: "Test Technician", Value: testData.TESTTECHNICIAN, ElementType: "TextBox" })
      }
      if (testData.TESTWITNESS) {
        transformedData.push({ DisplayName: "Test Witness", Value: testData.TESTWITNESS, ElementType: "TextBox" })
      }
      if (testData.TESTDATE) {
        transformedData.push({ DisplayName: "Date", Value: testData.TESTDATE, ElementType: "DatePicker" })
      }
      if (String(testData.CHECKBOX_AF) == "true") {
        transformedData.push({ DisplayName: "Af", Value: testData.CHECKBOX_AF, ElementType: "CheckBox" })
      }
      if (String(testData.CHECKBOX_AL) == "true") {
        transformedData.push({ DisplayName: "Al", Value: testData.CHECKBOX_AL, ElementType: "CheckBox" })
      }
      if (String(testData.STROKEDFROMCONTROLROOM) == "true" && this.repairType != "Depot Repair") {
        transformedData.push({ DisplayName: "Stroked From Control Room", Value: testData.STROKEDFROMCONTROLROOM, ElementType: "CheckBox" })
      }
      if (String(testData.CHECKBOX_PACKINGTORQUE) == "true") {
        transformedData.push({ DisplayName: "Packing Torque", Value: testData.CHECKBOX_PACKINGTORQUE, ElementType: "CheckBox" })
      }
      if (testData.BODYBONNETTORQUE) {
        transformedData.push({ DisplayName: "Body Bonnet Torque", Value: this.processValue("BODYBONNETTORQUE", testData), ElementType: "DropDown" })
      }
      if (testData.PACKINGTORQUE) {
        transformedData.push({ DisplayName: "Packing Torque", Value: this.processValue("PACKINGTORQUE", testData), ElementType: "DropDown" })
      }
      if (testData.DISASSEMBLYTECHNICIANNAME) {
        transformedData.push({ DisplayName: "Disassembly Technician Name", Value: testData.DISASSEMBLYTECHNICIANNAME, ElementType: "TextBox" })
      }
      if (testData.FINALASSEMBLYTECHNICIANNAME) {
        transformedData.push({ DisplayName: "Final Assembly Technician Name", Value: testData.FINALASSEMBLYTECHNICIANNAME, ElementType: "TextBox" })
      }
      if (testData.PARTSWRITEUPTECHNICANNAME) {
        transformedData.push({ DisplayName: "Parts Write Up Technican Name", Value: testData.FINALASSEMBLYTECHNICIANNAME, ElementType: "TextBox" })
      }
      if (testData.FINALINSPECTIONTECHNICIANNAME) {
        transformedData.push({ DisplayName: "Final Inspection Technician Name", Value: testData.FINALINSPECTIONTECHNICIANNAME, ElementType: "TextBox" })
      }
    }
    return transformedData;
  }

  transformTestDataRegulator(testData) {
    let transformedData: any = [];
    if (testData) {
      if (testData.TESTTECHNICIAN) {
        transformedData.push({ DisplayName: "Test Technician", Value: testData.TESTTECHNICIAN, ElementType: "TextBox" })
      }
      if (testData.TESTWITNESS) {
        transformedData.push({ DisplayName: "Test Witness", Value: testData.TESTWITNESS, ElementType: "TextBox" })
      }
      if (testData.TESTDATE) {
        transformedData.push({ DisplayName: "Date", Value: testData.TESTDATE, ElementType: "DatePicker" })
      }
      if (String(testData.CHECKBOX_AF) == "true") {
        transformedData.push({ DisplayName: "Af", Value: testData.CHECKBOX_AF, ElementType: "CheckBox" })
      }
      if (String(testData.CHECKBOX_AL) == "true") {
        transformedData.push({ DisplayName: "Al", Value: testData.CHECKBOX_AL, ElementType: "CheckBox" })
      }
      if (String(testData.STROKEDFROMCONTROLROOM) == "true" && this.repairType != "Depot Repair") {
        transformedData.push({ DisplayName: "Stroked From Control Room", Value: testData.STROKEDFROMCONTROLROOM, ElementType: "CheckBox" })
      }
      if (testData.REG_DISASSEMBLYTECH) {
        transformedData.push({ DisplayName: "Disassembly Tech", Value: testData.REG_DISASSEMBLYTECH, ElementType: "TextBox" })
      }
      if (testData.REG_TESTPRESSURE) {
        transformedData.push({ DisplayName: "Test Pressure", Value: testData.REG_TESTPRESSURE, ElementType: "TextBox" })
      }
      if (testData.REG_SETPOINT) {
        transformedData.push({ DisplayName: "Set Point", Value: testData.REG_SETPOINT, ElementType: "TextBox" })
      }
      if (testData.REG_FINALASSEMBLY) {
        transformedData.push({ DisplayName: "Final Assembly", Value: testData.REG_FINALASSEMBLY, ElementType: "TextBox" })
      }
      if (testData.REG_PARTSWRITEUP) {
        transformedData.push({ DisplayName: "Parts Writeup", Value: testData.REG_PARTSWRITEUP, ElementType: "TextBox" })
      }
      if (testData.REG_FINALINSPECTION) {
        transformedData.push({ DisplayName: "Final Inspection", Value: testData.REG_FINALINSPECTION, ElementType: "TextBox" })
      }
    }
    return transformedData;
  }

  translator(text) {
    // return text;
    return this.translate[text] ? this.translate[text] : text;
  }

  getBodyFromElements(ElementsArr) {
    let body = [], count = 0, mainArr = [];
    let filteredArr = ElementsArr.filter((item) => {
      return item.Value && item.Value != '';
    });
    for (let k = 0; k < filteredArr.length; k++) {
      count++;
      body.push(this.makeTableJson(ElementsArr[k]));
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

  addBodyToTable(table, body) {
    //table.dontBreakRows= true
    table.body = body;
    return table;
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

  makeTableJson(element) {
    let json: any = {
      "table": {
        "body": []
      },
      layout: 'noBorders'
    };

    json.table.widths = ["50%", "50%"];
    json.table.body.push([]);
    if (element.ElementType == "CheckBox") {
      json.table.body[0].push(this.getCheckBoxIcon(this.translator(element.DisplayName), element.Value == 'true' ? true : false));
      json.table.body[0].push(this.getBlankColumn(''));
    }
    if (element.ElementType == "DatePicker") {
      let formattedDate = "";
      formattedDate = moment(element.Value).format('DD-MMM-YYYY')
      json.table.body[0].push(this.getLabelColumn(this.translator(element.DisplayName)));
      json.table.body[0].push(this.getValueColumn(formattedDate));
    }
    if (element.ElementType != "DatePicker" && element.ElementType != "CheckBox") {
      json.table.body[0].push(this.getLabelColumn(this.translator(element.DisplayName)));
      json.table.body[0].push(this.getValueColumn(element.Value));
    }
    return json;
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
    return json;
  }

  isNotNull(value) {
    return value && value != '';
  }

  getBlankColumn(value, rowSpan?, index?) {
    if (rowSpan) {
      return { text: (value ? value : " "), rowSpan: rowSpan, fillColor: "#fff", border: this.noborderstyle, fontSize: 9, color: "#939393", bold: true, alignment: 'center', };
    } else {
      if (index == 0) {
        return { text: "\n", fillColor: "#fff", fontSize: 0, lineHeight: 0, border: this.noborderstyle };
      } else if (index == 1) {
        return { text: "\n \n \n", fillColor: "#fff", border: this.noborderstyle, fontSize: 5, color: "#939393", bold: true, alignment: 'center', };
      } else if (index == 2) {
        return { text: "\n", fillColor: "#b5cae1", fontSize: 0, lineHeight: 0 };
      } else {
        return { text: (value ? value : " "), fillColor: "#fff", border: this.noborderstyle, fontSize: 9, color: "#939393", bold: true, alignment: 'center', };
      }
    }
  }

  getLabelColumn(value, isRecommendation?) {
    let fillColor = "#DDE6EF";
    if (!this.isNotNull(value) && isRecommendation) {
      fillColor = "#FFF";
    }
    return { "text": (value ? value : " "), border: this.noborderstyle, margin: [5, 3, 0, 3], fontSize: '10', fillColor: fillColor, "style": "label" };
  }

  getValueColumn(value, isRecommendation?) {
    let fillColor = '#F4F2F2';
    if (!this.isNotNull(value) && isRecommendation) {
      fillColor = "#FFF";
    }
    return { "text": (value ? value : " "), bold: true, border: this.noborderstyle, margin: [5, 3, 0, 3], fontSize: '10', fillColor: fillColor, "style": "label-value" };
  }

  getDatatoPrint(deviceType) {
    let reportId = this.valueProvider.getCurrentReport().REPORTID;

    let promiseArr = [];
    return new Promise((resolve, reject) => {
      promiseArr.push(this.localServiceSdr.getSDRReportData(reportId)); //0

      if (this.isolationGroup.indexOf(this.parentReferenceID.toString()) > -1) {
        promiseArr.push(this.localServiceSdr.getSelectedDeviceDataForIsolation(reportId)); //1
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "ASFOUNDFLOWISOLATION")); //2
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "SOLUTIONFLOWISOLATION")); //3
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "REPORTATTACHMENTS")); //4
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "FINDINGSFLOWISOLATION")); //5
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "CALIBRATIONFLOWISOLATION")); //6
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "CALIBRATIONSOLUTIONFLOWISOLATION")); //7
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "FINALINSPECTIONFLOWISOLATION")); //8
        promiseArr.push(this.localServiceSdr.getFIRecommendations(reportId)); //9
        promiseArr.push(this.localServiceSdr.getFIReportNotes(reportId)); //10
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "OPTIONALFLOWISOLATION")); //11
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "ACCESSORIESFLOWISOLATION", 'VALUE_FOR="asfound"')); //12
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "TESTDATAFLOWISOLATION")); //13
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "ACCESSORIESFLOWISOLATION", 'VALUE_FOR="solution"'));//14
      }
      else {
        promiseArr.push(this.localServiceSdr.getSelectedDeviceData(reportId));
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "DEVICETESTACTUATION"));
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "ASFOUNDACTUATION"));
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "ASLEFTACTUATION"));
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "ASLEFTRAACTUATION"));
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "CALIBRATIONACTUATION"));
        promiseArr.push(this.localServiceSdr.getPageData(reportId, "REPORTATTACHMENTS"));
      }

      Promise.all(promiseArr).then((response: any) => {
        resolve(response);
      });
    });
  }

  getDeviceType() {
    return new Promise((resolve, reject) => {
      this.localService.getProductID(this.valueProvider.getCurrentReport().REPORTID).then((val) => {
        if (val) {
          this.parentReferenceID = val;
          resolve(this.parentReferenceID);
        } else {
          this.localServiceSdr.getDEVICEIDForFlowIsolation(this.valueProvider.getCurrentReport().REPORTID).then((res) => {
            if (res)
              this.parentReferenceID = res;
            resolve(this.parentReferenceID);
          })
        }
      })

    })
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


  addTableToSection(section, tableToAdd) {
    section.table.body[0][0].push(tableToAdd);
    return section;
  }

  getHeaderSection(headerData) {
    this.getPdfFonts();
    let emersonLogo = 'emerson.png';
    let centerSection = this.translator('REPAIR REPORT');
    let rightSection = 'Final Control';
    let headerTable;
    try {
      //Currently Setting BusinessGroup As Default Final Control
      let header = [];
      header.push();
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
    return headerTable;
  }

  getDeviceName(DeviceName) {
    let deviceNameSection = {
      table: {
        border: this.noborderstyle,
        body: [
          [{ text: this.translator("Device Name") + ":", border: [false, false, false, false], font: "Arial" ,fontSize: 10, bold: true, "margin": [-5, 0, 0, 0] }, { text: DeviceName, border: [false, false, false, false], fontSize: 10, alignment: "left", "margin": [0, 0, 0, 3] }]
        ]
      }
    };
    return deviceNameSection;
  }

  getSubHeaderSection(headerData) {
    let CreatedBy = this.valueProvider.getUser().Name;
    this.repairType = " ";
    if (headerData.length > 0) {
      if (headerData[0].FIELDREPAIR == 'true' || headerData[0].FIELDREPAIR == true) {
        this.repairType = "Field Repair";
      } else if (headerData[0].DEPOTREPAIR == 'true' || headerData[0].DEPOTREPAIR == true) {
        this.repairType = "Depot Repair";
      } else if (headerData[0].FIELDSERVICEDIANOSTICONLY == 'true' || headerData[0].FIELDSERVICEDIANOSTICONLY == true) {
        this.repairType = "Field Diagnostic Only";
      }
    }
    let deviceNameSection = {
      style: 'tableMargin',
      table: {
        border: this.noborderstyle,
        body: [
          [
            {
              "text": this.translator("Repair Date") + ":",
              "border": [false, false, false, false],
              "margin": [-5, 0, 0, 0],
              "fontSize": "10"
            },
            {
              //01/17/2019 Zohaib Khan -- TODO: Shivansh -- Repair Date should be formatted as dd/mm/yyyy
              "text": headerData[0].REPAIRDATE ? moment(headerData[0].REPAIRDATE).format('DD-MMM-YYYY') : "  ",
              "border": [false, false, false, false],
             // "margin": [0, 0, 0, 1],
              "fontSize": "10",
              "fillColor": "#EAEAEA"
            },
            {
              "text": this.translator("Created By") + ":",
              "border": [false, false, false, false],
              "margin": [30, 0, 0, 0],
              "fontSize": "10"
            },
            {
              "text": CreatedBy ? CreatedBy : " ",
              "border": [false, false, false, false],
            //  "margin": [-5, 3, 0, 3],
              "fontSize": "10",
              "fillColor": "#EAEAEA"
            },
            {
              "text": this.translator("Job ID") + ":",
              "border": [false, false, false, false],
              "margin": [30, 0, 0, 0],
              "fontSize": "11",

            },
            {
              "text": headerData[0].JOBID ? headerData[0].JOBID : "   ",
              "border": [false, false, false, false],
            //  "margin": [-5, 3, 0, 3],
              "fontSize": "10",
              "fillColor": "#EAEAEA"

            },
            {
              "text": this.translator("Repair Type") + ":",
              "border": [false, false, false, false],
              "margin": [30, 0, 0, 0],
              "fontSize": "11"
            },
            {
              "text": this.repairType,
              "border": [false, false, false, false],
            //  "margin": [0, 3, 5, 3],
              // "margin": [(String(headerData[0].FIELDREPAIR) == "true" || String(headerData[0].DEPOTREPAIR) == "true" ? 0 : 40), 3, 5, 3],
              "fontSize": "10",
              "fillColor": "#EAEAEA"
            }
          ]
        ]
      }
    };
    return deviceNameSection;
  }

  getProductFamily(reportData) {
    let deviceNameSection = {
      table: {
        border: this.noborderstyle,
        body: [
          //26/08/2019 - Gaurav Vachhani - Changes to show other values for product family.
          [{ text: this.translator("Product Family:"), border: [false, false, false, false], fontSize: 10, bold: true, "margin": [-5, 0, 0, 0] }, { text: reportData.PRODUCTFAMILY == null ? reportData.PRODUCTFAMILY_OTHER : reportData.PRODUCTFAMILY, border: [false, false, false, false], fontSize: 10, alignment: "left", "margin": [0, 0, 0, 3] }, { text: this.translator("Product Type:"), border: [false, false, false, false], fontSize: 10, bold: true, "margin": [5, 0, 0, 0] }, { text: reportData.PRODUCTTYPE == null ? reportData.PRODUCTTYPE_OTHER : reportData.PRODUCTTYPE, border: [false, false, false, false], fontSize: 10, alignment: "left", "margin": [0, 0, 0, 3] }],
          [{ text: this.translator("Model:"), border: [false, false, false, false], fontSize: 10, bold: true, "margin": [-5, 0, 0, 0] }, { text: reportData.MODELTYPE == null ? reportData.MODELTYPE_OTHER : reportData.MODELTYPE, border: [false, false, false, false], fontSize: 10, alignment: "left", "margin": [0, 0, 0, 3] }, { text: this.translator("Serial #:"), border: [false, false, false, false], fontSize: 10, bold: true, "margin": [5, 0, 0, 0] }, { text: reportData.SERIALNO, border: [false, false, false, false], fontSize: 10, alignment: "left", "margin": [0, 0, 0, 3] }]
        ]
      }
    };
    return deviceNameSection;
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


  //06/14/2019 function to display pretest and posttest data on pdf
  getPreAndPostTestTable(reportData) {
    let table = { columns: [] };
    try {
      let rows = [];
      let PreAndPostTestTable = {
        unbreakable: false,
        //12-09-2019://Gaurav V -  Changes to resolve blank row issue and new table margin
        id: 'testingTable',
        table: {
          id: 'testingTableInner',
          widths: ['18%', '3%', '30%', '5%', '30%'],
          body: [],
          margin: [0, 5, 0, 5]
        },
        layout: {
          layout: 'noBorders',
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#B5CAE1' : '#D5E2F0';
          }
        },
      };
      if (reportData.DONEAIRPRESSUREPRETEST || reportData.AIRPRESSUREPRETEST || reportData.DONEAIRPRESSUREPOSTTEST || reportData.AIRPRESSUREPOSTTEST ||
        reportData.DONEFUNCTIONPRETEST || reportData.FUNCTIONPRETEST || reportData.DONEFUNCTIONPOSTTEST || reportData.FUNCTIONPOSTTEST || reportData.DONEVISUALPRETEST ||
        reportData.VISUALPRETEST || reportData.DONEVISUALPOSTTEST || reportData.VISUALPOSTTEST || reportData.DONEHYDROPRETEST || reportData.HYDROPRETEST ||
        reportData.DONEHYDROPOSTTEST || reportData.HYDROPOSTTEST) {
        //PreAndPostTestTable.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), { text: 'Pre-Test', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, margin: [10, 0, 0, 0] }, this.getBlankColumn(''), { text: 'Post-Test', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, margin: [10, 0, 0, 0] }]);
        PreAndPostTestTable.table.body.push([{ text: this.translator("TESTING"), fillColor: "#fff", border: this.noborderstyle, fontSize: 10, color: '#234487', bold: true }, this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
        PreAndPostTestTable.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), { text: 'Pre-Test', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, margin: [10, 0, 0, 0] }, this.getBlankColumn(''), { text: 'Post-Test', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", border: this.noborderstyle, margin: [10, 0, 0, 0] }]);
      }
      let row = [];
      if (reportData.DONEAIRPRESSUREPRETEST || reportData.AIRPRESSUREPRETEST || reportData.DONEAIRPRESSUREPOSTTEST || reportData.AIRPRESSUREPOSTTEST) {
        row.push({ text: ("Air Pressure Test"), fillColor: "#fff", border: this.noborderstyle, fontSize: 9, color: "#939393", bold: true, alignment: 'center' });
        row.push(this.getCheckboxFlag(reportData.DONEAIRPRESSUREPRETEST));
        row.push(this.getPrePostVal(reportData.AIRPRESSUREPRETEST));
        row.push(this.getCheckboxFlag(reportData.DONEAIRPRESSUREPOSTTEST));
        row.push(this.getPrePostVal(reportData.AIRPRESSUREPOSTTEST));
        PreAndPostTestTable.table.body.push(row);
      }
      if (reportData.DONEFUNCTIONPRETEST || reportData.FUNCTIONPRETEST || reportData.DONEFUNCTIONPOSTTEST || reportData.FUNCTIONPOSTTEST) {
        row = [];
        row.push({ text: ("Function Test"), fillColor: "#fff", border: this.noborderstyle, fontSize: 9, color: "#939393", bold: true, alignment: 'center' });
        row.push(this.getCheckboxFlag(reportData.DONEFUNCTIONPRETEST));
        row.push(this.getPrePostVal(reportData.FUNCTIONPRETEST));
        row.push(this.getCheckboxFlag(reportData.DONEFUNCTIONPOSTTEST));
        row.push(this.getPrePostVal(reportData.FUNCTIONPOSTTEST));
        PreAndPostTestTable.table.body.push(row);
      }

      if (reportData.DONEHYDROPRETEST || reportData.HYDROPRETEST || reportData.DONEHYDROPOSTTEST || reportData.HYDROPOSTTEST) {
        row = [];
        row.push({ text: ("Hydro Test"), fillColor: "#fff", border: this.noborderstyle, fontSize: 9, color: "#939393", bold: true, alignment: 'center' });
        row.push(this.getCheckboxFlag(reportData.DONEHYDROPRETEST));
        row.push(this.getPrePostVal(reportData.HYDROPRETEST));
        row.push(this.getCheckboxFlag(reportData.DONEHYDROPOSTTEST));
        row.push(this.getPrePostVal(reportData.HYDROPOSTTEST));
        PreAndPostTestTable.table.body.push(row);
      }

      if (reportData.DONEVISUALPRETEST || reportData.VISUALPRETEST || reportData.DONEVISUALPOSTTEST || reportData.VISUALPOSTTEST) {
        row = [];
        row.push({ text: ("Visual Test"), fillColor: "#fff", border: this.noborderstyle, fontSize: 9, color: "#939393", bold: true, alignment: 'center' });
        row.push(this.getCheckboxFlag(reportData.DONEVISUALPRETEST));
        row.push(this.getPrePostVal(reportData.VISUALPRETEST));
        row.push(this.getCheckboxFlag(reportData.DONEVISUALPOSTTEST));
        row.push(this.getPrePostVal(reportData.VISUALPOSTTEST));
        PreAndPostTestTable.table.body.push(row);
      }

      if (PreAndPostTestTable.table.body.length > 1) {
        rows.push(PreAndPostTestTable);
        table.columns.push(rows);
      }
      if (PreAndPostTestTable.table.body.length == 0) {
        PreAndPostTestTable.table.body.push(this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn(""));
      }
      return PreAndPostTestTable;
    } catch (err) {
      this.logger.log(this.fileName, 'getPreAndPostTestTable', "Error: " + JSON.stringify(err));
    }
    return table;
  }



  getPrePostVal(value) {
    return { text: (value ? value : " "), border: this.noborderstyle, margin: [10, 3, 0, 3], fontSize: 9 };
  }
  getCheckboxFlag(flag) {
    //let image = this.valueProvider.getcheckboximg(flag);
    let image;
    if (flag) {
      if (flag == true || flag == 'true') {
        image = 'checkedboximg.png';
      } else if (flag == false || flag == 'false') {
        image = 'uncheckedboximg.png';
      }
      return { image: image, border: this.noborderstyle, fillColor: "#fff", fit: [8, 8], alignment: "right", margin: [0, 5, 0, 0] };
    } else {
      return { text: " ", border: this.noborderstyle, fillColor: "#fff", alignment: "right", margin: [0, 5, 0, 0] };
    }
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
      },
      tableMargin:{
        margin: [0, -10, 0, 0]
      }
    };
  }

  getAccordionHeader() {
    let subTableforItems = this.getSubTableForActuation1();
    if (subTableforItems.table.body.length == 0) {
      subTableforItems.table.body.push([this.getBlankColumn(''), { text: this.translator('AS FOUND'), color: "#045B83", bold: true, border: this.noborderstyle, alignment: 'center', fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('RECOMMENDED ACTION'), border: this.noborderstyle, alignment: 'center', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('AS LEFT'), border: this.noborderstyle, alignment: 'center', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }]);
    }
    return subTableforItems;
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

  getIsolationMainTable(isUnbreakable?) {
    let table: any = {
      unbreakable: false,
      table: {
        "body": [],
        "widths": ['22%', '68%']
      }, layout: "noBorders",
    }
    return table;
  }

  getPreValveOptionalServicesIsolationMainTable(isUnbreakable?) {
    let table: any = {
      unbreakable: false,
      table: {
        "body": [],
        "widths": ['12%', '88%']
      }, layout: "noBorders",
    }
    return table;
  }

  getTestDataTableStructure() {
    let table = {
      unbreakable: true,
      table: {
        dontBreakRows: true,
        widths: ['11%', '45%', '30%'],
        body: []
      },
      layout: {
        hLineWidth: function (i, node) {
          return (i === 0) || i === node.table.body.length - 1 ? 1.4 : 0;
        },
        vLineWidth: function (i, node) {
          return (i === 1 || i === node.table.widths.length) ? 1.4 : 0;
        },
        hLineColor: function (i, node) {
          return (i === 0) || i === node.table.body.length - 1 ? '#4d8dd1' : '';
        },
        vLineColor: function (i, node) {
          return (i === 1 || i === node.table.widths.length) ? '#4d8dd1' : '';
        },
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
        }
      },
    };
    return table;
  }

  getActuationMainTable(isUnbreakable?) {
    let table: any = {
      unbreakable: false,
      id: 'actuationMainTable',
      table: {
        "body": [],
        "widths": ['12%', '60%', '28%']
      }, layout: {
        hLineWidth: function (i, node) {
          return ((i === 0) || (i === node.table.body.length) ? 1.4 : 0);
        },
        vLineWidth: function (i, node) {
          return (i === 1 || i === node.table.widths.length) ? 1.4 : 0;
        },
        hLineColor: function (i, node) {
          return ((i === 0) || (i === node.table.body.length) ? '#4d8dd1' : '');
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
  getSubTableForFindings() {
    let subTable: any = {
      table: {
        widths: ['33%', '33%', '33%'],
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
  getSubTableForActuation() {
    let subTable: any = {
      dontBreakRows: true,
      unbreakable: false,
      table: {
        widths: ['25%', '25%', '25%', '25%'],
        body: [],
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
  getActuationHeadingTable(index?) {
    let table: any = {
      table: {
        "body": [],
        "widths": ['12%', '60%', '28%']
      }, layout: "noBorders",
    }
    return table;
  }

  getNotesboxActuation(value, border?) {
    if (border) {
      return { "text": (value ? value : " "), fillColor: '#e5e6e8', margin: [0, 3, 0, 12], fontSize: 9 };
    } else {
      return { "text": (value ? value : " "), fillColor: '#e5e6e8', margin: [0, 3, 0, 12], border: [false, false, false, false], fontSize: 9 };
    }
  }

  getConstructionValue(value, isValueDifferent) {
    if (isValueDifferent) {
      return { text: (value ? value : " "), border: this.noborderstyle, margin: [10, 3, 0, 3], fontSize: 9, fillColor: '#F5A623', bold: true };
    } else {
      return { text: (value ? value : " "), border: this.noborderstyle, margin: [10, 3, 0, 3], fontSize: 9, bold: true };
    }
  }

  getConstructionLabelForFindings(value, isValueDifferent, header?) {
    if (isValueDifferent) {
      return { text: (value ? value : " "), margin: [10, 3, 0, 3], alignment: "center", border: this.noborderstyle, fontSize: 9, fillColor: '#F5A623' };
    } else if (header) {
      return { text: (value ? value : " "), margin: [10, 3, 0, 3], alignment: "center", border: [false, true, false, false], fontSize: 9 };
    }
    else {
      return { text: (value ? value : " "), margin: [10, 3, 0, 3], alignment: "center", border: this.noborderstyle, fontSize: 9 };
    }
  }

  getConstructionLabelForComments(value) {
    return { text: (value ? value : " "), colSpan: 3, margin: [10, 3, 0, 3], alignment: "left", border: this.noborderstyle, fontSize: 9 };
  }
  getEmployeeLabelForFindings(value) {
    return { text: (value ? value : " "), colSpan: 2, margin: [10, 3, 0, 3], alignment: "left", border: this.noborderstyle, fontSize: 9 };
  }

  getsubTableforFindingRow(label, asfound, asLeft) {


    let tablerow: any[] = [
      this.getConstructionValue(label, false),
      this.getConstructionLabelForFindings(asfound, false),
      this.getConstructionLabelForFindings(asLeft, false)
    ];
    return tablerow;
  }

  getsubTableforActuationRow(label, asfound, asLeft, asLeftRA?) {


    let tablerow: any[] = [
      this.getConstructionValue(label, false),
      this.getConstructionLabelForFindings(asfound, false),
      this.getConstructionLabelForFindings(asLeft, false),
      this.getConstructionLabelForFindings(asLeftRA, false),
    ];
    return tablerow;
  }

  processObject(accordion, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {
    // let keys = [];
    for (let k in asFoundElementData) {
      if (k.indexOf(accordion) != -1 && k.indexOf("_NA") == -1) {
        let value = asFoundElementData[k];
        if (value && (value != 'true' || value != true)) return true;
        else continue;
      }
    };
    for (let k in AsLeftElementsData) {
      if (k.indexOf(accordion) != -1 && k.indexOf("_ALNA") == -1) {
        let value = AsLeftElementsData[k];
        //console.log(value);
        if (value && (value != 'true' || value != true)) return true;
        else continue;
      }
    };
    for (let k in AsLeftRAElementsData) {
      if (k.indexOf(accordion) != -1) {
        let value = AsLeftRAElementsData[k];
        //  console.log(value);
        if (value && (value != 'true' || value != true)) return true;
        else continue;
      }
    };
    return false;
  }

  processIsolationObject(accordion, asFoundElementData, asLeftElementsData) {
    // let keys = [];
    for (let k in asFoundElementData) {
      if (k.indexOf(accordion) != -1 && k.indexOf("_NA") == -1) {
        let value = asFoundElementData[k];
        if (value && (value != 'true' || value != true)) return true;
        else continue;
      }
    };
    for (let k in asLeftElementsData) {
      if (k.indexOf(accordion) != -1 && k.indexOf("_NA") == -1) {
        let value = asLeftElementsData[k];
        if (value && (value != 'true' || value != true)) return true;
        else continue;
      }
    };
    return false;
  }

  getIsolationAsFoundAccordionHeader() {
    let subTableforItems = this.getSubTableIsolation();
    if (subTableforItems.table.body.length == 0) {
      subTableforItems.table.body.push([{ text: this.translator('CONSTRUCTION AS FOUND'), color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", colSpan: 2, border: [false, false, false, false], margin: [10, 3, 0, 3] }, this.getBlankColumn(''), this.getBlankColumn(' '), { text: this.translator('CONSTRUCTION AS LEFT'), color: "#045B83", border: [false, false, false, false], bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, this.getBlankColumn('')]);
    }
    return subTableforItems;
  }



  getAsFoundIsolationSection(asFoundIsolation, asLeftIsolation) {
    let table = { columns: [] };
    try {
      let rows = [];
      let actuationTable = this.getSubTableIsolation();
      let mainIsolationTable = this.getIsolationMainTable();

      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.ControlValve) {
        if (this.processIsolationObject('CV_BODY', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getCVBodyAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Body'), actuationTable]);
          rows.push(mainIsolationTable);

        }
        if (this.processIsolationObject('CV_ACTUATOR', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getCVActuatorAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Actuator'), actuationTable]);
          rows.push(mainIsolationTable);

        }
        if (this.processIsolationObject('CV_POSITIONER', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getCVPositionerAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Positioner'), actuationTable]);
          rows.push(mainIsolationTable);
        }
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Controller) {
        if (this.processIsolationObject('CTR_CONTROLLER', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getControllerAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Controller'), actuationTable]);
          rows.push(mainIsolationTable);
        }
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Instrument) {
        if (this.processIsolationObject('INS_POSITIONER', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getInstrumentPositionerAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Positioner'), actuationTable]);
          rows.push(mainIsolationTable);
        }
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Isolation) {
        if (this.processIsolationObject('ISO_BODY', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getIsolationBodyAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Body'), actuationTable]);
          rows.push(mainIsolationTable);
        }
        if (this.processIsolationObject('ISO_ACTUATOR', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getIsolationActuatorAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Actuator'), actuationTable]);
          rows.push(mainIsolationTable);
        }
        if (this.processIsolationObject('ISO_POSITIONER', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getISOlationPositionerAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Positioner'), actuationTable]);
          rows.push(mainIsolationTable);
        }
      }

      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.LevelTroll) {
        if (this.processIsolationObject('LT_LEVEL', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getLevelTrolLevelAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Level'), actuationTable]);
          rows.push(mainIsolationTable);
        }
        if (this.processIsolationObject('LT_INSTRUMENT', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getLevelTrolInstrumentAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Instrument'), actuationTable]);
          rows.push(mainIsolationTable);
        }
        if (this.processIsolationObject('LT_ACCESSORIES', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getLevelTrolAccessoriesAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Accessories'), actuationTable]);
          rows.push(mainIsolationTable);
        }
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Regulator) {
        if (this.processIsolationObject('REG_BODY', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getRegulatorBodyAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Body'), actuationTable]);
          rows.push(mainIsolationTable);
        }
        if (this.processIsolationObject('REG_PILOT', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getRegulatorPilotAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Pilot'), actuationTable]);
          rows.push(mainIsolationTable);
        }
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.TrimOnly) {
        if (this.processIsolationObject('TO_BODY', asFoundIsolation, asLeftIsolation)) {
          actuationTable = this.getSubTableIsolation();
          mainIsolationTable = this.getIsolationMainTable();
          actuationTable = this.getTrimOnlyBodyAccordion(actuationTable, asFoundIsolation, asLeftIsolation);
          mainIsolationTable.table.body.push([this.getBlankColumn('Body'), actuationTable]);
          rows.push(mainIsolationTable);
        }
      }
      if (rows.length > 0) {
        mainIsolationTable = this.getIsolationMainTable();
        mainIsolationTable.table.body.push([this.getBlankColumn(''), this.getIsolationAsFoundAccordionHeader()]);
        rows.unshift(mainIsolationTable);
      }
      table.columns.push(rows);
      return table;
    } catch (error) {
      this.logger.log(this.fileName, "getAsFoundAsLeftData", error);
    }
  }

  getCVBodyAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {

    actuationTable = this.getIsolationAccordionRow('CV_BODY_MAKE', 'Make', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_BODY_PRESSURE CLASS', 'Pressure Class', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_BODY_MODEL', 'Model', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_BODY_ENDCONNECTION', 'End Connection', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_BODY_TRIMCHAR', 'Trim char', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_BODY_PKGCONFIGURATION', 'PKG Configuration', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_BODY_SIZE', 'Size', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_BODY_FLOWDIRECTION', 'Flow Direction', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_BODY_PORT', 'Port', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_BODY_SN', 'S/N', actuationTable, asFoundIsolation, asLeftIsolation);
    return actuationTable;

  }

  getCVActuatorAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {

    actuationTable = this.getIsolationAccordionRow('CV_ACTUATOR_MAKE', 'Make', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_ACTUATOR_POSITION', 'Position', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_ACTUATOR_MODEL', 'Model', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_ACTUATOR_ACTION', 'Action', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_ACTUATOR_SIZE', 'Size', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_ACTUATOR_HANDWHEEL', 'Handwheel', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_ACTUATOR_MOUNTING', 'Mounting', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_ACTUATOR_SN', 'S/N', actuationTable, asFoundIsolation, asLeftIsolation);

    return actuationTable;

  }

  getCVPositionerAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {
    actuationTable = this.getIsolationAccordionRow('CV_POSITIONER_MAKE', 'Make', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_POSITIONER_WIRE_POS_COLOR', 'Wire(+) Color', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_POSITIONER_MODEL', 'Model', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_POSITIONER_WIRE_NEG_COLOR', 'Wire(-) Color', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_POSITIONER_ACTION', 'Action', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CV_POSITIONER_SN', 'S/N', actuationTable, asFoundIsolation, asLeftIsolation);
    return actuationTable;

  }

  getCVAccessoriesAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {
    return actuationTable;

  }


  getControllerAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {

    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_SN', 'S/N', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_MANUFACTURER', 'Manufacturer', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_PROPORTIONAL', 'Proportional', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_TYPE', 'Type', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_INTEGRAL', 'Integral', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_DIRECT_REVERSE', 'Direct Reverse', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_DERIVATIVE', 'Derivative', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_ORIENTATION', 'Orientation', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_INPUTRANGE', 'Input Range', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_POSITION', 'Position', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_OUTPUTRANGE', 'Output Range', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_SETPOINT', 'Setpoint', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('CTR_CONTROLLER_OTHER', 'Other', actuationTable, asFoundIsolation, asLeftIsolation);

    return actuationTable;

  }


  getInstrumentPositionerAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {

    actuationTable = this.getIsolationAccordionRow('INS_POSITIONER_MAKE', 'Make', actuationTable, asFoundIsolation, asLeftIsolation, 'Body');
    actuationTable = this.getIsolationAccordionRow('INS_POSITIONER_WIRE_POS_COLOR', 'Wire(+) Color', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('INS_POSITIONER_MODEL', 'Model', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('INS_POSITIONER_WIRE_NEG_COLOR', 'Wire(-) Color', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('INS_POSITIONER_ACTION', 'Action', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('INS_POSITIONER_SN', 'S/N', actuationTable, asFoundIsolation, asLeftIsolation);
    return actuationTable;

  }



  getIsolationBodyAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {

    actuationTable = this.getIsolationAccordionRow('ISO_BODY_MAKE', 'Make', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_BONNETSTYLE', 'Bonnet Style', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_MODEL', 'Model', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_PKGCONFIGURATION', 'PKG Configuration', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_SIZE', 'Size', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_LIVE-LOADED', 'Live-Loaded', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_PORT', 'Port', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_TYPE', 'Type', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_PRESSURECLASS', 'Pressure Class', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_FIG#,SNORMODEL', 'FIG #, S/N OR MODEL', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_ENDCONNECTION', 'End Connection', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_BODYMATERIAL', 'Body Material', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_STEM_SHAFTMATERIAL', 'Stem/Shaft Material', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_PLUG_DISC_BALLMATERIAL', 'Plug/Disc/Ball Material', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_BODY_SEATMATERIAL', 'Seat Material', actuationTable, asFoundIsolation, asLeftIsolation);
    return actuationTable;

  }

  getIsolationActuatorAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {

    actuationTable = this.getIsolationAccordionRow('ISO_ACTUATOR_TYPE', 'Type', actuationTable, asFoundIsolation, asLeftIsolation);
    return actuationTable;

  }

  getISOlationPositionerAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {
    actuationTable = this.getIsolationAccordionRow('ISO_POSITIONER_MAKE', 'Make', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_POSITIONER_MODEL', 'Model', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_POSITIONER_ACTION', 'Action', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_POSITIONER_FIG#,SNORMODEL', 'FIG #, S/N OR MODEL', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('ISO_POSITIONER_COPYFIG#,SNORMODELFROMBODY', 'Copy FIG #, S/N OR MODEL From Body', actuationTable, asFoundIsolation, asLeftIsolation);
    return actuationTable;

  }
  getRegulatorBodyAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {

    actuationTable = this.getIsolationAccordionRow('REG_BODY_MAKE', 'Make', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('REG_BODY_RATING', 'Rating', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('REG_BODY_MODEL', 'Model', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('REG_BODY_CONN', 'Conn', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('REG_BODY_SN', 'S/N', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('REG_BODY_ORIFICESIZE', 'Orifice Size', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('REG_BODY_SIZE', 'Size', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('REG_BODY_SPRINGRANGE', 'Spring Range', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('REG_BODY_SPRINGCOLOR', 'Spring Color', actuationTable, asFoundIsolation, asLeftIsolation);
    return actuationTable;

  }

  getLevelTrolLevelAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {

    actuationTable = this.getIsolationAccordionRow('LT_LEVEL_MAKE', 'Make', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_LEVEL_DISPSIZE', 'Disp. Size', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_LEVEL_MODEL', 'Model', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_LEVEL_DISPRATING', 'Disp. Rating', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_LEVEL_SN', 'S/N', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_LEVEL_DISPVOLUME', 'Disp. Volume', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_LEVEL_RATING', 'Rating', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('DISPLACERWT', 'Displacer Wt', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_LEVEL_CONN', 'Conn', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_LEVEL_LEVELTTWALL', 'Level TT Wall', actuationTable, asFoundIsolation, asLeftIsolation);
    return actuationTable;

  }

  getLevelTrolInstrumentAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {

    actuationTable = this.getIsolationAccordionRow('LT_INSTRUMENT_MAKE', 'Make', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_INSTRUMENT_INPUT', 'Input', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_INSTRUMENT_MODEL', 'Model', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_INSTRUMENT_OUTPUT', 'Output', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_INSTRUMENT_SN', 'S/N', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_INSTRUMENT_REGULATOR', 'Regulator', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_INSTRUMENT_ACTION', 'Action', actuationTable, asFoundIsolation, asLeftIsolation);
    return actuationTable;

  }

  getLevelTrolAccessoriesAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {

    actuationTable = this.getIsolationAccordionRow('LT_ACCESSORIES_P_I', 'P/I', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_ACCESSORIES_SIGNAL', 'Signal', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_ACCESSORIES_SWITCH', 'Switch', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('LT_ACCESSORIES_OTHER', 'Other', actuationTable, asFoundIsolation, asLeftIsolation);
    return actuationTable;

  }

  getRegulatorPilotAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {

    actuationTable = this.getIsolationAccordionRow('REG_PILOT_MAKE', 'Make', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('REG_PILOT_SPRINGRANGE', 'Spring Range', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('REG_PILOT_MODEL', 'Model', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('REG_PILOT_SPRINGCOLOR', 'Spring Color', actuationTable, asFoundIsolation, asLeftIsolation);
    return actuationTable;

  }

  getTrimOnlyBodyAccordion(actuationTable, asFoundIsolation, asLeftIsolation) {

    actuationTable = this.getIsolationAccordionRow('TO_BODY_MAKE', 'Make', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('TO_BODY_PRESSURECLASS', 'Pressure Class', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('TO_BODY_MODEL', 'Model', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('TO_BODY_ENDCONNECTION', 'End Connection', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('TO_BODY_TRIMCHAR', 'Trim Char', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('TO_BODY_PKGCONFIGURATION', 'PKG Configuration', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('TO_BODY_SIZE', 'Size', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('TO_BODY_FLOWDIRECTION', 'Flow Direction', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('TO_BODY_PORT', 'Port', actuationTable, asFoundIsolation, asLeftIsolation);
    actuationTable = this.getIsolationAccordionRow('TO_BODY_SN', 'S/N', actuationTable, asFoundIsolation, asLeftIsolation);
    return actuationTable;

  }

  getIsolationAccordionRow(rowKey, rowTitle, actuationTable, asFoundIsolation, asLeftIsolation, accordionName?) {
    let asFoundOtherKey = rowKey + '_OT';
    let asLeftOtherKey = rowKey + '_OT';

    // if ((asFoundIsolation && asFoundIsolation[rowKey] != 'true' || asFoundIsolation[rowKey] != true) || (asLeftIsolation && asLeftIsolation[rowKey] != 'true' || asLeftIsolation[rowKey] != true)) {
    if ((asFoundIsolation && asFoundIsolation[rowKey]) || (asLeftIsolation && asLeftIsolation[rowKey])) {
      let isConstructionChanged = asLeftIsolation.ISCONSTRUCTIONCHANGES == 'Yes' ? true : false;
      let hasValueChanged = asFoundIsolation[rowKey] != asLeftIsolation[rowKey] ? true : false;
      actuationTable.table.body.push([this.getConstructionValueWithBorder(this.translator(rowTitle), false, "Border"), this.getConstructionValueWithBorder(asFoundIsolation[rowKey] == 'Other' ? asFoundIsolation[asFoundOtherKey] : asFoundIsolation[rowKey], false, "Border"), this.getBlankColumn(' '), this.getConstructionValueWithBorder(this.translator(rowTitle), false, "Border"), this.getConstructionValueWithBorder(isConstructionChanged ? (asLeftIsolation[asLeftOtherKey] == 'Other' ? asLeftIsolation[asLeftOtherKey] : asLeftIsolation[rowKey]) : (asLeftIsolation[rowKey] == 'Other' ? asLeftIsolation[asLeftOtherKey] : asLeftIsolation[rowKey]), isConstructionChanged ? hasValueChanged : false, "Border")]);
    }
    //}

    return actuationTable;

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
  getSubTableIsolation(index?, Datalength?) {
    let actuationTable: any = {
      table: {
        widths: ['24%', '24%', '2%', '24%', '26%'],
        body: []
      },
      layout: {
        hLineWidth: function (i, node) {
          return ((i === (index === 0 ? 1 : 0)) || (i === node.table.body.length) ? 1.4 : 0);
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === 2 || i === 3 || i === node.table.widths.length) ? 1.4 : 0;
        },
        hLineColor: function (i, node) {
          return ((i === (index === 0 ? 1 : 0)) || (i === node.table.body.length) ? '#4d8dd1' : '');
        },
        vLineColor: function (i, node) {
          return '#4d8dd1';
        },
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#B5CAE1' : '#DDE6EF';
        }
      },
    };
    return actuationTable;
  }

  getFindingsIsolationSection(findingsIsolation) {

    // let self = this;
    let table = { columns: [] };
    // let parentReferenceId = this.parentReferenceID;
    try {

      let rows = [];
      let subTableforItemsHeader = this.getActuationHeadingTable();
      let subTableforItems = this.getActuationMainTable();
      let subTableforActuationTable = this.getSubTableForFindings();
      subTableforItemsHeader.table.body.push([this.getBlankColumn(' '), this.getFindingsAccordionHeader(), { text: this.translator('NOTES'), color: "#045B83", bold: true, border: this.noborderstyle, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3], alignment: 'center' }]);



      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.ControlValve) {
        if (this.processFindingsObject('CV_BODY_BONNET', findingsIsolation)) {
          // rows.push(subTableforItemsHeader);
          subTableforActuationTable = this.getCVBodyBonnetAccordionTable(subTableforActuationTable, findingsIsolation);
          subTableforItems.table.body.push([this.getBlankColumn('Body/Bonnet'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.CV_BODY_BONNET_NOTES, "Border")]);
          subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);

          rows.push(subTableforItems);
        }
        if (this.processFindingsObject('CV_TRIM', findingsIsolation)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getCVTrimAccordionTable(subTableforActuationTable, findingsIsolation);
          subTableforItems.table.body.push([this.getBlankColumn('Trim'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.CV_TRIM_NOTES, "Border")]);
          subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
          rows.push(subTableforItems);
        }
        if (this.processFindingsObject('CV_ACTUATOR', findingsIsolation)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getCVActuatorAccordionTable(subTableforActuationTable, findingsIsolation);
          subTableforItems.table.body.push([this.getBlankColumn('Actuator'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.CV_ACTUATOR_NOTES, "Border")]);
          subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
          rows.push(subTableforItems);
        }
        if (this.processFindingsObject('CV_POSITIONER', findingsIsolation)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getCVPositionerAccordionTable(subTableforActuationTable, findingsIsolation);
          subTableforItems.table.body.push([this.getBlankColumn('Positioner'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.CV_POSITIONER_NOTES, "Border")]);
          subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
          rows.push(subTableforItems);
        }

        if (this.processFindingsObject('CV_OTHER', findingsIsolation)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getCVOtherAccordionTable(subTableforActuationTable, findingsIsolation);
          subTableforItems.table.body.push([this.getBlankColumn('Other'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.CV_OTHER_NOTES, "Border")]);
          subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
          rows.push(subTableforItems);
        }
      }


      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Isolation) {
        if (this.processFindingsObject('ISO_BODY_BONNET', findingsIsolation)) {
          subTableforActuationTable = this.getISOBodyBonnetAccordionTable(subTableforActuationTable, findingsIsolation);
          subTableforItems.table.body.push([this.getBlankColumn('Body/Bonnet'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.ISO_BODY_BONNET_NOTES, "Border")]);
          subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
          rows.push(subTableforItems);
        }
        if (this.processFindingsObject('ISO_TRIM', findingsIsolation)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getISOTrimAccordionTable(subTableforActuationTable, findingsIsolation);
          subTableforItems.table.body.push([this.getBlankColumn('Trim'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.ISO_TRIM_NOTES, "Border")]);
          subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
          rows.push(subTableforItems);
        }
        if (this.processFindingsObject('ISO_ACTUATOR', findingsIsolation)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getISOActuatorAccordionTable(subTableforActuationTable, findingsIsolation);
          subTableforItems.table.body.push([this.getBlankColumn('Actuator'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.ISO_ACTUATOR_NOTES, "Border")]);
          subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
          rows.push(subTableforItems);
        }
        if (this.processFindingsObject('ISO_POSITIONER', findingsIsolation)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getISOPositionerAccordionTable(subTableforActuationTable, findingsIsolation);
          subTableforItems.table.body.push([this.getBlankColumn('Positioner'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.ISO_POSITIONER_NOTES, "Border")]);
          subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
          rows.push(subTableforItems);
        }

        if (this.processFindingsObject('ISO_OTHER', findingsIsolation)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getISOOtherAccordionTable(subTableforActuationTable, findingsIsolation);
          subTableforItems.table.body.push([this.getBlankColumn('Other'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.ISO_OTHER_NOTES, "Border")]);

          rows.push(subTableforItems);
        }
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Regulator) {
        subTableforItems = this.getActuationMainTable();
        subTableforActuationTable = this.getSubTableForFindings();
        subTableforActuationTable = this.getREGFindingsAccordionTable(subTableforActuationTable, findingsIsolation);
        subTableforItems.table.body.push([this.getBlankColumn('Body'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.REG_REGULATOR_NOTES, "Border")]);
        subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
        rows.push(subTableforItems);
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Instrument) {

        if (this.processFindingsObject('INS_POSITIONER', findingsIsolation)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getINSPositionerAccordionTable(subTableforActuationTable, findingsIsolation);
          subTableforItems.table.body.push([this.getBlankColumn('Positioner'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.INS_POSITIONER_NOTES, "Border")]);

          rows.push(subTableforItems);
        }
        if (this.processFindingsObject('INS_OTHER', findingsIsolation)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getINSOtherAccordionTable(subTableforActuationTable, findingsIsolation);
          subTableforItems.table.body.push([this.getBlankColumn('Other'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.INS_OTHER_NOTES, "Border")]);
          subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
          rows.push(subTableforItems);
        }
      }

      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.LevelTroll) {
        subTableforItems = this.getActuationMainTable();
        subTableforActuationTable = this.getSubTableForFindings();
        subTableforActuationTable = this.getLTFindingsAccordionTable(subTableforActuationTable, findingsIsolation);
        subTableforItems.table.body.push([this.getBlankColumn('Positioner'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.LT_LEVELTROL_NOTES, "Border")]);
        subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
        rows.push(subTableforItems);

      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.TrimOnly) {
        subTableforItems = this.getActuationMainTable();
        subTableforActuationTable = this.getSubTableForFindings();
        subTableforActuationTable = this.getTOFindingsAccordionTable(subTableforActuationTable, findingsIsolation);
        subTableforItems.table.body.push([this.getBlankColumn('Body'), subTableforActuationTable, this.getNotesboxActuation(findingsIsolation.TO_TRIMONLY_NOTES, "Border")]);
        subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);

        rows.push(subTableforItems);
      }



      if (rows.length > 0) {
        rows.unshift(subTableforItemsHeader);
      }

      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getIsolationFIndingsata', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getCVBodyBonnetAccordionTable(subTableforActuationTable, findingsIsolation) {

    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_BODY_BONNET_BODY', 'Body', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_BODY_BONNET_GASKETSURFACES', 'Gasket Surfaces', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_BODY_BONNET_SEATAREA', 'Seat Area', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_BODY_BONNET_BONNET', 'Bonnet', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_BODY_BONNET_PACKINGBOX', 'Packing Box', subTableforActuationTable, findingsIsolation);

    // subTableforActuationTable.table.body.push([this.getConstructionValue('Notes', false), this.getConstructionLabelForComments(findingsIsolation.N_NETWORKTYPE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;

  }
  getCVTrimAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_TRIM_PLUG_BALL_DISK', 'Plug/Ball/Disk', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_TRIM_CAGE_GUIDE_SEALRETAINER', 'Cage/Guide/Seal Retainer', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_TRIM_SEAT', 'Seat', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_TRIM_STEM_SHAFT', 'Stem/Shaft', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_TRIM_BUSHINGS_BEARINGS', 'Bishing(s)/Bearing(s)', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_TRIM_PLUGSEALS', 'Plug Seals', subTableforActuationTable, findingsIsolation);

    // subTableforActuationTable.table.body.push([this.getConstructionValue('Notes', false), this.getConstructionLabelForComments(findingsIsolation.N_NETWORKTYPE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;

  }
  getCVActuatorAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_ACTUATOR_ACTUATOR', 'Actuator', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_ACTUATOR_CASING_YOKE_CYLINDER', 'Casing/Yoke/Cylinder', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_ACTUATOR_STEM_ROD', 'Stem Rod', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_ACTUATOR_CONNECTION_COUPLING', 'Connection/Coupling', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_ACTUATOR_BUSHING', 'Bushing', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_ACTUATOR_BOLTING', 'Bolting', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_ACTUATOR_DIAPHRAGM_SOFTPARTS', 'Diaphragm/Soft Parts', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_ACTUATOR_HANDWHEEL', 'Handwheel', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_ACTUATOR_SPRING', 'Spring', subTableforActuationTable, findingsIsolation);

    // subTableforActuationTable.table.body.push([this.getConstructionValue('Notes', false), this.getConstructionLabelForComments(findingsIsolation.N_NETWORKTYPE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);
    return subTableforActuationTable;

  }
  getCVPositionerAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_POSITIONER_POSITIONER', 'Positioner', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_POSITIONER_RELAY', 'Relay', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_POSITIONER_I_P', 'I/P', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_POSITIONER_FEEDBACK', 'Feedback', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_POSITIONER_GAUGES', 'Gauges', subTableforActuationTable, findingsIsolation);
    return subTableforActuationTable;

  }
  getCVOtherAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_OTHER_TUB__FITTINGS', 'Tub./Fittings', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_OTHER_AIRSETS', 'Airset(s)', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('CV_OTHER_ACCESSORY', 'Accessory', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable.table.body.push([this.getConstructionValue('Employee Name', false), this.getEmployeeLabelForFindings(findingsIsolation.CV_OTHER_EMPLOYEENAME)]);
    return subTableforActuationTable;
  }


  getISOBodyBonnetAccordionTable(subTableforActuationTable, findingsIsolation) {

    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_BODY_BONNET_BODY', 'Body', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_BODY_BONNET_GASKETSURFACES', 'Gasket Surfaces', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_BODY_BONNET_SEATAREA', 'Seat Area', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_BODY_BONNET_BONNET', 'Bonnet', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_BODY_BONNET_PACKINGBOX', 'Packing Box', subTableforActuationTable, findingsIsolation);

    // subTableforActuationTable.table.body.push([this.getConstructionValue('Notes', false), this.getConstructionLabelForComments(findingsIsolation.N_NETWORKTYPE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);
    return subTableforActuationTable;

  }
  getISOTrimAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_TRIM_PLUG_BALL_DISK', 'Plug/Ball/Disk', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_TRIM_CAGE_GUIDE_SEALRETAINER', 'Cage/Guide/Seal Retainer', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_TRIM_SEAT', 'Seat', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_TRIM_STEM_SHAFT', 'Stem/Shaft', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_TRIM_BUSHINGS_BEARINGS', 'Bishing(s)/Bearing(s)', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_TRIM_PLUGSEALS', 'Plug Seals', subTableforActuationTable, findingsIsolation);

    // subTableforActuationTable.table.body.push([this.getConstructionValue('Notes', false), this.getConstructionLabelForComments(findingsIsolation.N_NETWORKTYPE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);
    return subTableforActuationTable;

  }
  getISOActuatorAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_ACTUATOR_ACTUATOR', 'Actuator', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_ACTUATOR_CASING_YOKE_CYLINDER', 'Casing/Yoke/Cylinder', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_ACTUATOR_STEM_ROD', 'Stem Rod', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_ACTUATOR_CONNECTION_COUPLING', 'Connection/Coupling', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_ACTUATOR_BUSHING', 'Bushing', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_ACTUATOR_BOLTING', 'Bolting', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_ACTUATOR_DIAPHRAGM_SOFTPARTS', 'Diaphragm/Soft Parts', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_ACTUATOR_HANDWHEEL', 'Handwheel', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_ACTUATOR_SPRING', 'Spring', subTableforActuationTable, findingsIsolation);

    // subTableforActuationTable.table.body.push([this.getConstructionValue('Notes', false), this.getConstructionLabelForComments(findingsIsolation.N_NETWORKTYPE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);
    return subTableforActuationTable;

  }
  getISOPositionerAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_POSITIONER_POSITIONER', 'Positioner', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_POSITIONER_RELAY', 'Relay', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_POSITIONER_I_P', 'I/P', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_POSITIONER_FEEDBACK', 'Feedback', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_POSITIONER_GAUGES', 'Gauges', subTableforActuationTable, findingsIsolation);
    return subTableforActuationTable;

  }
  getISOOtherAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_OTHER_TUB._FITTINGS', 'Tub./Fittings', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_OTHER_AIRSETS', 'Airset(s)', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('ISO_OTHER_ACCESSORY', 'Accessory', subTableforActuationTable, findingsIsolation);
    return subTableforActuationTable;
  }




  getINSPositionerAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('INS_POSITIONER_POSITIONER', 'Positioner', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('INS_POSITIONER_RELAY', 'Relay', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('INS_POSITIONER_I_P', 'I/P', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('INS_POSITIONER_FEEDBACK', 'Feedback', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('INS_POSITIONER_GAUGES', 'Gauges', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('INS_POSITIONER_POSITIONER', 'Positioner', subTableforActuationTable, findingsIsolation);
    return subTableforActuationTable;
  }
  getINSOtherAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('INS_OTHER_TUB._FITTINGS', 'Tub./Fittings', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('INS_OTHER_AIRSETS', 'Airset(s)', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('INS_OTHER_ACCESSORY', 'Accessory', subTableforActuationTable, findingsIsolation);
  }

  getLTFindingsAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('LT_LEVELTROL_BODY', 'Body', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('LT_LEVELTROL_HEAD', 'Head', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('LT_LEVELTROL_DISPLACER', 'Displacer', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('LT_LEVELTROL_TORQUETUBE', 'Torque Tube', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('LT_LEVELTROL_TTARM', 'TT Arm', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('LT_LEVELTROL_CAGE', 'Cage', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('LT_LEVELTROL_INSTRUMENT', 'Instrument', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('LT_LEVELTROL_TUBING', 'Tubing', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('LT_LEVELTROL_FITTINGS', 'Fittings', subTableforActuationTable, findingsIsolation);

    return subTableforActuationTable;
  }

  getREGFindingsAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('REG_REGULATOR_PLUG', 'Plug', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('REG_REGULATOR_SEAT', 'Seat', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('REG_REGULATOR_BODY', 'Body', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('REG_REGULATOR_SPRING', 'Spring', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('REG_REGULATOR_DIAPHRAGM', 'Diaphragm', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('REG_REGULATOR_BOLTING', 'Boiling', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('REG_REGULATOR_PILOT', 'Pilot', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('REG_REGULATOR_FITTING', 'Fitting', subTableforActuationTable, findingsIsolation);

    return subTableforActuationTable;
  }

  getTOFindingsAccordionTable(subTableforActuationTable, findingsIsolation) {
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('TO_TRIMONLY_PLUG_BALL_DISK', 'Plug/Ball/Disk', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('TO_TRIMONLY_CAGE_GUIDE_SEALRETAINER', 'Cage/Guide/Seal Retainer', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('TO_TRIMONLY_SEAT', 'Seat', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('TO_TRIMONLY_STEM_SHAFT', 'Stem/Shaft', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('TO_TRIMONLY_BUSHINGS_BEARINGS', 'Bushing/Bearing(s)', subTableforActuationTable, findingsIsolation);
    subTableforActuationTable = this.getIsolationFindingsAccordionDetailRow('TO_TRIMONLY_PLUGSEALS', 'Plug Seals', subTableforActuationTable, findingsIsolation);

    return subTableforActuationTable;
  }

  getFindingsAccordionHeader() {
    let subTableforItems = this.getSubTableForFindingsIsolation();
    if (subTableforItems.table.body.length == 0) {
      subTableforItems.table.body.push([this.getBlankColumn(''), { text: this.translator('FOUND'), color: "#045B83", bold: true, border: this.noborderstyle, alignment: 'center', fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }, { text: this.translator('RECOMMENDED ACTION'), border: this.noborderstyle, alignment: 'center', color: "#045B83", bold: true, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3] }]);
    }
    return subTableforItems;
  }


  getSubTableForFindingsIsolation() {
    let subTable: any = {
      table: {
        widths: ['33%', '33%', '34%'],
        body: []
      },
      layout: "noBorders"
    }

    return subTable;
  }


  processFindingsObject(accordion, findingsIsolation) {
    // let keys = [];
    for (let k in findingsIsolation) {
      if (k.indexOf(accordion) != -1 && k.indexOf("_NA") == -1) {
        let value = findingsIsolation[k];
        if (value && (value != 'true' || value != true)) return true;
        else continue;
      }
    };


  }

  processPreValveObject(accordion, findingsIsolation) {
    // let keys = [];
    for (let k in findingsIsolation) {
      if (k.indexOf(accordion) != -1 && k.indexOf("_NA") == -1 && k.indexOf("_TESTWITNESS") == -1 && k.indexOf("_TESTTECHNICIAN") == -1 && k.indexOf("_TESTDATE") == -1) {
        let value = findingsIsolation[k];
        if (value && (value != 'true' || value != true)) return true;
        else continue;
      }
    };
  }

  getCVMaterialVerificationOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_MATERIALSVERIFICATION_BODY', 'Body', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_MATERIALSVERIFICATION_PLUG_DISC_BALL', 'Plug/Disc/Ball', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_MATERIALSVERIFICATION_STEM_SHAFT', 'Stem/Shaft', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_MATERIALSVERIFICATION_CAGE_RETAINER', 'Cage Retainer', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_MATERIALSVERIFICATION_SEAT', 'Seat', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_MATERIALSVERIFICATION_BUSHINGS_BEARING', 'Bushings/Bearings', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_MATERIALSVERIFICATION_BODY_BONNETBOLTING', 'Body/Bonnet Bolding', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_MATERIALSVERIFICATION_GASKETS', 'Gaskets', subTableforActuationTable, optionalServicesData);

    return subTableforActuationTable;
  }

  getCVSlidingItemOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_PACKINGBOXBORE', 'Packing Box Bore', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_STEMDIAMETER', 'Stem Diameter', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_BONNETGUIDEOD', 'Bonnet Guide OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_UPPERBODYGUIDEID', 'Upper Body Guide ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_UPPERGUIDEBUSHINGID', 'Upper Guide Busing ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_UPPERGUIDEPOSTOD', 'Upper Guide Post OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_CAGEID', 'Cage ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_UPPERPLUGSEATOD', 'Upper Plug Seat OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_LOWERPLUGSEATOD', 'Lower Plug Seat OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_UPPERSEATRINGID', 'Upper Seat Ring ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_LOWERSEATRINGID', 'Low Seat Ring Id', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_BLINDFLANGEGUIDEOD', 'Blind Flange Guide OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_LOWERGUIDEBUSHINGID', 'Lower Guide Busihng ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_LOWERBODYGUIDEID', 'Lower Body Guide ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_SLIDINGITEM_LOWERGUIDEPOSTOD', 'Lower Guide Post OD', subTableforActuationTable, optionalServicesData);

    return subTableforActuationTable;
  }

  getCVRotaryValveOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_ROTARYVALVE_PACKINGBOXBORE', 'Packing Box Bore', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_ROTARYVALVE_SHAFTDIAMETER', 'Shaft Diameter', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_ROTARYVALVE_UPPERGUIDEBUSHINGID', 'Upper Guide Bushing ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_ROTARYVALVE_UPPERGUIDEPOSTOD', 'Upper Guide Post OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_ROTARYVALVE_LOWERGUIDEBUSHINGID', 'Lower Guide Bushing ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_ROTARYVALVE_LOWERGUIDEPOSTOD', 'Lower Guide Post OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_ROTARYVALVE_SEATSEALID', 'Seat Seal ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_ROTARYVALVE_PACKINGBOXDEPTH', 'Packing Box Depth', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_ROTARYVALVE_BUSHINGRETAINEROAL', 'Bushing Retainer OAL', subTableforActuationTable, optionalServicesData);

    return subTableforActuationTable;
  }

  getCVControllerConstructionOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_S_N', 'S/N', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_MANUFACTURER', 'Manufacturer', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_PROPORTIONAL', 'Porpotional', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_TYPE', 'Type', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_INTEGRAL', 'Integral', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_DIRECT_DIVERSE', 'Direct Diverse', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_DERIVATIVE', 'Derivative', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_ORIENTATIONASFOUND', 'Orientation As found', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_INPUTRANGEASFOUND', 'Input Range As Found', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_POSITIONASFOUND', 'Position As Found', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_OUTPUTRANGEASFOUND', 'Output Range As Found', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_SETPOINTASFOUND', 'Set Point As Found', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('CV_CONTROLLERCONSTRUCTION_OTHERASFOUND', 'Others As Found', subTableforActuationTable, optionalServicesData);

    return subTableforActuationTable;
  }

  getACtuatorMaterialVerificationOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ACTUATOR_MATERIALSVERIFICATION_BODY', 'Body', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ACTUATOR_MATERIALSVERIFICATION_PLUG_DISC_BALL', 'Plug/Disc/Ball', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ACTUATOR_MATERIALSVERIFICATION_STEM_SHAFT', 'Stem/Shaft', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ACTUATOR_MATERIALSVERIFICATION_CAGE_RETAINER', 'Cage Retainer', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ACTUATOR_MATERIALSVERIFICATION_SEAT', 'Seat', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ACTUATOR_MATERIALSVERIFICATION_BUSHINGS_BEARING', 'Bushings/Bearings', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ACTUATOR_MATERIALSVERIFICATION_BODY_BONNETBOLTING', 'Body/Bonnet Bolding', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ACTUATOR_MATERIALSVERIFICATION_GASKETS', 'Gaskets', subTableforActuationTable, optionalServicesData);

    return subTableforActuationTable;
  }

  getISOMaterialVerificationOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_MATERIALSVERIFICATION_BODY', 'Body', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_MATERIALSVERIFICATION_PLUG_DISC_BALL', 'Plug/Disc/Ball', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_MATERIALSVERIFICATION_STEM_SHAFT', 'Stem/Shaft', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_MATERIALSVERIFICATION_CAGE_RETAINER', 'Cage Retainer', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_MATERIALSVERIFICATION_SEAT', 'Seat', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_MATERIALSVERIFICATION_BUSHINGS_BEARING', 'Bushings/Bearings', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_MATERIALSVERIFICATION_BODY_BONNETBOLTING', 'Body/Bonnet Bolding', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_MATERIALSVERIFICATION_GASKETS', 'Gaskets', subTableforActuationTable, optionalServicesData);

    return subTableforActuationTable;
  }

  getISOSlidingItemOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_PACKINGBOXBORE', 'Packing Box Bore', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_STEMDIAMETER', 'Stem Diameter', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_BONNETGUIDEOD', 'Bonnet Guide OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_UPPERBODYGUIDEID', 'Upper Body Guide ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_UPPERGUIDEBUSHINGID', 'Upper Guide Busing ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_UPPERGUIDEPOSTOD', 'Upper Guide Post OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_CAGEID', 'Cage ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_UPPERPLUGSEATOD', 'Upper Plug Seat OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_LOWERPLUGSEATOD', 'Lower Plug Seat OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_UPPERSEATRINGID', 'Upper Seat Ring ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_LOWERSEATRINGID', 'Low Seat Ring Id', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_BLINDFLANGEGUIDEOD', 'Blind Flange Guide OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_LOWERGUIDEBUSHINGID', 'Lower Guide Busihng ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_LOWERBODYGUIDEID', 'Lower Body Guide ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_SLIDINGITEM_LOWERGUIDEPOSTOD', 'Lower Guide Post OD', subTableforActuationTable, optionalServicesData);

    return subTableforActuationTable;
  }

  getISORotaryValveOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_ROTARYVALVE_PACKINGBOXBORE', 'Packing Box Bore', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_ROTARYVALVE_SHAFTDIAMETER', 'Shaft Diameter', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_ROTARYVALVE_UPPERGUIDEBUSHINGID', 'Upper Guide Bushing ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_ROTARYVALVE_UPPERGUIDEPOSTOD', 'Upper Guide Post OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_ROTARYVALVE_LOWERGUIDEBUSHINGID', 'Lower Guide Bushing ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_ROTARYVALVE_LOWERGUIDEPOSTOD', 'Lower Guide Post OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_ROTARYVALVE_SEATSEALID', 'Seat Seal ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_ROTARYVALVE_PACKINGBOXDEPTH', 'Packing Box Depth', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('ISO_ROTARYVALVE_BUSHINGRETAINEROAL', 'Bushing Retainer OAL', subTableforActuationTable, optionalServicesData);

    return subTableforActuationTable;
  }


  getTOMaterialVerificationOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_MATERIALSVERIFICATION_BODY', 'Body', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_MATERIALSVERIFICATION_PLUG_DISC_BALL', 'Plug/Disc/Ball', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_MATERIALSVERIFICATION_STEM_SHAFT', 'Stem/Shaft', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_MATERIALSVERIFICATION_CAGE_RETAINER', 'Cage Retainer', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_MATERIALSVERIFICATION_SEAT', 'Seat', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_MATERIALSVERIFICATION_BUSHINGS_BEARING', 'Bushings/Bearings', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_MATERIALSVERIFICATION_BODY_BONNETBOLTING', 'Body/Bonnet Bolding', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_MATERIALSVERIFICATION_GASKETS', 'Gaskets', subTableforActuationTable, optionalServicesData);

    return subTableforActuationTable;
  }

  getTOSlidingItemOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_PACKINGBOXBORE', 'Packing Box Bore', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_STEMDIAMETER', 'Stem Diameter', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_BONNETGUIDEOD', 'Bonnet Guide OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_UPPERBODYGUIDEID', 'Upper Body Guide ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_UPPERGUIDEBUSHINGID', 'Upper Guide Busing ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_UPPERGUIDEPOSTOD', 'Upper Guide Post OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_CAGEID', 'Cage ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_UPPERPLUGSEATOD', 'Upper Plug Seat OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_LOWERPLUGSEATOD', 'Lower Plug Seat OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_UPPERSEATRINGID', 'Upper Seat Ring ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_LOWERSEATRINGID', 'Low Seat Ring Id', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_BLINDFLANGEGUIDEOD', 'Blind Flange Guide OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_LOWERGUIDEBUSHINGID', 'Lower Guide Busihng ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_LOWERBODYGUIDEID', 'Lower Body Guide ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_SLIDINGITEM_LOWERGUIDEPOSTOD', 'Lower Guide Post OD', subTableforActuationTable, optionalServicesData);

    return subTableforActuationTable;
  }

  getTORotaryValveOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_ROTARYVALVE_PACKINGBOXBORE', 'Packing Box Bore', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_ROTARYVALVE_SHAFTDIAMETER', 'Shaft Diameter', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_ROTARYVALVE_UPPERGUIDEBUSHINGID', 'Upper Guide Bushing ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_ROTARYVALVE_UPPERGUIDEPOSTOD', 'Upper Guide Post OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_ROTARYVALVE_LOWERGUIDEBUSHINGID', 'Lower Guide Bushing ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_ROTARYVALVE_LOWERGUIDEPOSTOD', 'Lower Guide Post OD', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_ROTARYVALVE_SEATSEALID', 'Seat Seal ID', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_ROTARYVALVE_PACKINGBOXDEPTH', 'Packing Box Depth', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationOptionalServicesAccordionRow('TO_ROTARYVALVE_BUSHINGRETAINEROAL', 'Bushing Retainer OAL', subTableforActuationTable, optionalServicesData);

    return subTableforActuationTable;
  }
  getCVPreValveOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('CV_VALVEPRE_TESTDATA_SEATLEAKCLASS', 'Seat Leak Class', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('CV_VALVEPRE_TESTDATA_SEATTESTPRESSURE', 'Seat Test Pressure', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('CV_VALVEPRE_TESTDATA_SEATTESTUOM', 'Seat Test UOM', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('CV_VALVEPRE_TESTDATA_ALLOWABLELEAKAGE', 'Allowable Leakage', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('CV_VALVEPRE_TESTDATA_ALLOWABLELEAKAGEUNITOFMEASURMENT', 'Allowable Leakage Unit Of Measurement', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('CV_VALVEPRE_TESTDATA_ACTUALLEAKAGE', 'Actual Leakage', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('CV_VALVEPRE_TESTDATA_ACTUALLEAKAGEUNITOFMEASURMENT', 'Actual Leakage Unit Of Measurement', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('CV_VALVEPRE_TESTDATA_PRESSURECLASS', 'Pressure Class', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('CV_VALVEPRE_TESTDATA_HYDROTESTPRESSURE ', 'Hydro Test Pressure', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('CV_VALVEPRE_TESTDATA_HYDROTESTPRESSUREUOM ', 'Hydro Test Pressure UOM', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('CV_VALVEPRE_TESTDATA_HYDROTESTDURATION', 'Hydro Test Duration', subTableforActuationTable, optionalServicesData);
    return subTableforActuationTable;
  }


  getISOPreValveOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('ISO_VALVEPRE_TESTDATA_SEATLEAKCLASS', 'Seat Leak Class', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('ISO_VALVEPRE_TESTDATA_SEATTESTPRESSURE', 'Seat Test Pressure', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('ISO_VALVEPRE_TESTDATA_SEATTESTUOM', 'Seat Test UOM', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('ISO_VALVEPRE_TESTDATA_ALLOWABLELEAKAGE', 'Allowable Leakage', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('ISO_VALVEPRE_TESTDATA_ALLOWABLELEAKAGEUNITOFMEASURMENT', 'Allowable Leakage Unit Of Measurement', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('ISO_VALVEPRE_TESTDATA_ACTUALLEAKAGE', 'Actual Leakage', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('ISO_VALVEPRE_TESTDATA_ACTUALLEAKAGEUNITOFMEASURMENT', 'Actual Leakage Unit Of Measurement', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('ISO_VALVEPRE_TESTDATA_PRESSURECLASS', 'Pressure Class', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('ISO_VALVEPRE_TESTDATA_HYDROTESTPRESSURE ', 'Hydro Test Pressure', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('ISO_VALVEPRE_TESTDATA_HYDROTESTPRESSUREUOM ', 'Hydro Test Pressure UOM', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('ISO_VALVEPRE_TESTDATA_HYDROTESTDURATION', 'Hydro Test Duration', subTableforActuationTable, optionalServicesData);
    return subTableforActuationTable;
  }
  getTOPreValveOptionalAccordionTable(subTableforActuationTable, optionalServicesData) {
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('TO_VALVEPRE_TESTDATA_SEATLEAKCLASS', 'Seat Leak Class', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('TO_VALVEPRE_TESTDATA_SEATTESTPRESSURE', 'Seat Test Pressure', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('TO_VALVEPRE_TESTDATA_SEATTESTUOM', 'Seat Test UOM', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('TO_VALVEPRE_TESTDATA_ALLOWABLELEAKAGE', 'Allowable Leakage', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('TO_VALVEPRE_TESTDATA_ALLOWABLELEAKAGEUNITOFMEASURMENT', 'Allowable Leakage Unit Of Measurement', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('TO_VALVEPRE_TESTDATA_ACTUALLEAKAGE', 'Actual Leakage', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('TO_VALVEPRE_TESTDATA_ACTUALLEAKAGEUNITOFMEASURMENT', 'Actual Leakage Unit Of Measurement', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('TO_VALVEPRE_TESTDATA_PRESSURECLASS', 'Pressure Class', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('TO_VALVEPRE_TESTDATA_HYDROTESTPRESSURE ', 'Hydro Test Pressure', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('TO_VALVEPRE_TESTDATA_HYDROTESTPRESSUREUOM ', 'Hydro Test Pressure UOM', subTableforActuationTable, optionalServicesData);
    subTableforActuationTable = this.getIsolationNonListOptionalServicesAccordionRow('TO_VALVEPRE_TESTDATA_HYDROTESTDURATION', 'Hydro Test Duration', subTableforActuationTable, optionalServicesData);
    return subTableforActuationTable;
  }

  getIsolationOptionalServicesAccordionRow(rowKey, rowTitle, subTableforActuationTable, optionalServicesData) {

    let asFoundKey = rowKey + '_ASFOUND';
    let asFoundOthersKey = rowKey + '_ASFOUND_OT';
    let asLeftKey = rowKey + '_ASLEFT';
    let asLeftOthersKey = rowKey + '_ASLEFT_OT';
    let asFoundNAKey = rowKey + '_NA';
    if ((optionalServicesData && optionalServicesData[asFoundNAKey] != 'true')) {
      if ((optionalServicesData && optionalServicesData[asFoundKey] != null) || (optionalServicesData && optionalServicesData[asLeftKey] != null)) {
        subTableforActuationTable.table.body.push(this.getsubTableforFindingRow(rowTitle, optionalServicesData[asFoundKey] == 'Other' ? optionalServicesData[asFoundOthersKey] : optionalServicesData[asFoundKey], optionalServicesData[asLeftKey] == 'Other' ? optionalServicesData[asLeftOthersKey] : optionalServicesData[asLeftKey]));
      }
      return subTableforActuationTable;
    }
  }


  getIsolationNonListOptionalServicesAccordionRow(rowKey, rowTitle, subTableforActuationTable, optionalServicesData) {
    if ((optionalServicesData && optionalServicesData[rowKey] != null)) {
      subTableforActuationTable.table.body.push([this.getBlankColumn(''), this.getConstructionLabelForFindingsWithBorder(this.translator(rowTitle), false, "Border"), this.getConstructionValueWithBorder(optionalServicesData[rowKey], false, "Border")]);
    }
    return subTableforActuationTable;
  }

  getAsFoundSection(asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    let table = { columns: [] };
    let parentReferenceId = this.parentReferenceID;
    try {

      let rows = [];
      let subTableforItemsHeader = this.getActuationHeadingTable();
      let subTableforItems = this.getActuationMainTable();

      let subTableforActuationTable = this.getSubTableForActuation();

      subTableforItemsHeader.table.body.push([this.getBlankColumn(' '), this.getAccordionHeader(), { text: this.translator('AS FOUND COMMENTS'), color: "#045B83", bold: true, border: this.noborderstyle, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3], alignment: 'center' }]);
      rows.push(subTableforItemsHeader);

      if (parentReferenceId == '1') {
        if (this.processObject('UNIT', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          rows.push(subTableforItemsHeader);
          subTableforActuationTable = this.getPneumaticUnitAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Unit'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.PH_UNIT_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Unit'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.PH_UNIT_AFC, "Border")]);
          }
          //26/08/2019 - Gaurav Vachhani - Changes to resolve issue for space in pdf
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);

        }
        if (this.processObject('DRIVEMODULE', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getPneumaticDriveModuleAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Drive Module'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.PH_DRIVEMODULE_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Drive Module'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.PH_DRIVEMODULE_AFC, "Border")]);
          }
          //26/08/2019 - Gaurav Vachhani - Changes to resolve issue for space in pdf.
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);

        }
        if (this.processObject('SPRINGMODULE', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getPneumaticSpringModuleAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Spring Module'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.PH_SPRINGMODULE_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Spring Module'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.PH_SPRINGMODULE_AFC, "Border")]);
          }
          //26/08/2019 - Gaurav Vachhani - Changes to resolve issue for space in pdf.
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);

        }
        if (this.processObject('POWERMODULE', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(false);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getPneumaticPowerModuleAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Power Module'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.PH_POWERMODULE_AFC, "Border")]);

          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Power Module'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.PH_POWERMODULE_AFC, "Border")]);

          }
          //26/08/2019 - Gaurav Vachhani - Changes to resolve issue for space in pdf.
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);

        }
        if (this.processObject('POWERSWIVELMODULE', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getPneumaticPowerSwivelModuleAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Power Swivel Module'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.PH_POWERSWIVELMODULE_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Power Swivel Module'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.PH_POWERSWIVELMODULE_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);

        }
        if (this.processObject('TUBING', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getPneumaticTubingAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Tubing'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.PH_TUBING_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Tubing'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.PH_TUBING_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);

        }
        if (this.processObject('MOUNTINGHARDWAREADAPTION', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getPneumaticMountingHardwareAdaptionAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Mounting Hardware/Adaption'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.PH_MOUNTINGHARDWAREADAPTION_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Mounting Hardware/Adaption'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.PH_MOUNTINGHARDWAREADAPTION_AFC, "Border")]);

          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);

        }
        if (this.processObject('OVERRIDES', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getPneumaticOverridesAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Overrides'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.PH_OVERRIDES_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Overrides'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.PH_OVERRIDES_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);

        }
        if (this.processObject('VOSVALVEOPERATINGSYSTEM', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getPneumaticVOSAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          subTableforItems.table.body.push([this.getBlankColumn('VOS (Valve Operating System)'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.PH_VOSVALVEOPERATINGSYSTEM_AFC, "Border")]);
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);

        }
        if (this.processObject('ACCESSORIES', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getPneumaticAccessoriesAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Accessories'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.PH_ACCESSORIES_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Accessories'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.PH_ACCESSORIES_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);

        }
        if (this.processObject('PH_OTHER', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getPneumaticOthersAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Other'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.PH_OTHER_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Other'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.PH_OTHER_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);

        }
      }
      if (parentReferenceId == '2') {
        if (this.processObject('AE_HOUSINGFRAME', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getElectricHousingFrameAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Housing/Frame'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.AE_HOUSINGFRAME_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Housing/Frame'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.AE_HOUSINGFRAME_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);


        }
        if (this.processObject('AE_MOTORSUBASSEMBLY', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getElectricMotorSubassemblyAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Motor Subassembly'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.AE_MOTORSUBASSEMBLY_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Motor Subassembly'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.AE_MOTORSUBASSEMBLY_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);


        }
        if (this.processObject('AE_CONTROLSELECTRONICS', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getElectricControlsAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Controls (Electronics)'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.AE_CONTROLSELECTRONICS_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Controls (Electronics)'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.AE_CONTROLSELECTRONICS_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);


        }
        if (this.processObject('AE_ENCLOSURE', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getElectricEnclosureAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Enclosure'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.AE_ENCLOSURE_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Enclosure'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.AE_ENCLOSURE_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);


        }
        if (this.processObject('AE_SCMSEPARATECONTROLMODULE', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getElectricSCMAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('SCM (Separate Control Module)'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.AE_SCMSEPARATECONTROLMODULE_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('SCM (Separate Control Module)'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.AE_SCMSEPARATECONTROLMODULE_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);


        }
        if (this.processObject('AE_OVERRIDES', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getElectricOverridesAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Overrides'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.AE_OVERRIDES_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Overrides'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.AE_OVERRIDES_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);


        }
        if (this.processObject('AE_G', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getElectricGearboxAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Gearbox'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.AE_G_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Gearbox'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.AE_G_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);


        }
        if (this.processObject('AE_LINEARDRIVE', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getElectricLinearDriveAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Linear Drive'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.AE_LINEARDRIVE_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Linear Drive'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.AE_LINEARDRIVE_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);


        }
        if (this.processObject('AE_MOUNTINGHARDWAREADAPTION', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getElectricMountingHardwareAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Mounting Hardware/Adaption'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.AE_MOUNTINGHARDWAREADAPTION_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Mounting Hardware/Adaption'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.AE_MOUNTINGHARDWAREADAPTION_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);


        }
        if (this.processObject('AE_FAILSAFE', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getElectricFailSafeAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Fail-Safe'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.AE_FAILSAFE_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Fail-Safe'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.AE_FAILSAFE_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);


        }
        if (this.processObject('AE_ACCESSORIES', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getElectricAccessoriesAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Accessories'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.AE_ACCESSORIES_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Accessories'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.AE_ACCESSORIES_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);


        }
        if (this.processObject('AE_OTHER', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getElectricOthersAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Other'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.AE_OTHER_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Other'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.AE_OTHER_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);


        }
      }
      if (parentReferenceId == '3') {
        if (this.processObject("N_NETWORKTYPE", asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getNetworkTypeAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Network Type'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.N_NETWORKTYPE_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Network Type'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.N_NETWORKTYPE_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);
        }
      }

      if (parentReferenceId == '4') {
        if (this.processObject('G_HOUSINGFRAME', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getGearboxHosuingFrameAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Housing/Frame'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.G_HOUSINGFRAME_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Housing/Frame'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.G_HOUSINGFRAME_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);

        }

        if (this.processObject('G_SPURGEAR', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getGearboxSpurGearAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Spur Gear'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.G_SPURGEAR_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Spur Gear'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.G_SPURGEAR_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);
        }
        if (this.processObject('G_ACCESSORIES', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getGearboxAccessoriesAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Accessories'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.G_ACCESSORIES_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Accessories'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.G_ACCESSORIES_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);
        }
        if (this.processObject('G_MOUNTINGHARDWAREADAPTION', asFoundElementData, AsLeftElementsData, AsLeftRAElementsData)) {
          subTableforItems = this.getActuationMainTable(true);
          subTableforActuationTable = this.getSubTableForActuation();
          subTableforActuationTable = this.getGearboxMountingHardwareAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData);
          if (subTableforActuationTable.table.body.length > 0) {
            subTableforItems.table.body.push([this.getBlankColumn('Mounting Hardware/Adaption'), subTableforActuationTable, this.getNotesboxActuation(asFoundElementData.G_MOUNTINGHARDWAREADAPTION_AFC, "Border")]);
          } else {
            subTableforItems.table.body.push([this.getBlankColumn('Mounting Hardware/Adaption'), this.getBlankColumn('', null, 2), this.getNotesboxActuation(asFoundElementData.G_MOUNTINGHARDWAREADAPTION_AFC, "Border")]);
          }
          //subTableforItems.table.body.push([this.getBlankColumn('', null, 0), this.getBlankColumn('', null,0), this.getBlankColumn('', null, 0)]);
          rows.push(subTableforItems);
          rows.push([this.getBlankColumn('', null, 1)]);
        }


      }
      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getAsFoundActuationData', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getAccordionDetailRow(rowKey, rowTitle, subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData) {
    let asFoundKey = rowKey + '_AF';
    let asFoundOthersKey = rowKey + '_AFOT';
    let asLeftKey = rowKey + '_AL';
    let asLeftOthersKey = rowKey + '_ALOT';
    let asRecommndedKey = rowKey + '_RA';
    let asRecommndedOthersKey = rowKey + '_RAOT';
    let asFoundNAKey = rowKey + '_NA';
    if ((asFoundElementData && asFoundElementData[asFoundNAKey] != 'true' || asFoundElementData[asFoundNAKey] != true) || (AsLeftElementsData && AsLeftElementsData[asFoundNAKey] != 'true' || AsLeftElementsData[asFoundNAKey] != true)) {
      if ((asFoundElementData && asFoundElementData[asFoundKey]) || (AsLeftElementsData && AsLeftElementsData[asLeftKey]) || (AsLeftRAElementsData && AsLeftRAElementsData[asRecommndedKey])) {
        subTableforActuationTable.table.body.push(this.getsubTableforActuationRow(rowTitle, asFoundElementData ? asFoundElementData[asFoundKey] == 'Other' ? asFoundElementData[asFoundOthersKey] : asFoundElementData[asFoundKey] : '', AsLeftRAElementsData ? AsLeftRAElementsData[asRecommndedKey] == 'Other' ? AsLeftRAElementsData[asRecommndedOthersKey] : AsLeftRAElementsData[asRecommndedKey] : '', AsLeftElementsData ? (AsLeftElementsData[asLeftKey] == 'Other' ? AsLeftElementsData[asLeftOthersKey] : AsLeftElementsData[asLeftKey]) : ''));
      }
    }
    return subTableforActuationTable;
  }



  getIsolationFindingsAccordionDetailRow(rowKey, rowTitle, subTableforActuationTable, findingsIsolation) {
    let asFoundKey = rowKey + '_FOUND';
    let asFoundOthersKey = rowKey + '_FOUND_OT';
    let asLeftKey = rowKey + '_RECOMMENDEDACTION';
    let asLeftOthersKey = rowKey + '_RECOMMENDEDACTION_OT';
    let asFoundNAKey = rowKey + '_NA';

    if ((findingsIsolation && findingsIsolation[asFoundNAKey] != 'true')) {
      if ((findingsIsolation && findingsIsolation[asFoundKey]) || (findingsIsolation && findingsIsolation[asLeftKey])) {
        subTableforActuationTable.table.body.push(this.getsubTableforFindingRow(rowTitle, findingsIsolation[asFoundKey] == 'Other' ? findingsIsolation[asFoundOthersKey] : findingsIsolation[asFoundKey], findingsIsolation[asLeftKey] == 'Other' ? findingsIsolation[asLeftOthersKey] : findingsIsolation[asLeftKey]));
      }

      return subTableforActuationTable;
    }
  }
  // checkNaValue(rowKey, asFoundElementData, AsLeftElementsData) {
  //   let asFoundKey = rowKey + '_NA';
  //   if((asFoundElementData && asFoundElementData[asFoundKey] !=null) ||  AsLeftElementsData)
  // }

  getPneumaticUnitAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_HOUSING', 'Housing', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_HOUSINGCOVER', 'Housing Cover', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_HOUSINGADAPTOR', 'Housing Adapter', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_TORQUESHAFT', 'Torque Shaft', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_YOKE', 'Yoke', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_YOKEKEY', 'Yoke Key', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_YOKEKEYSPRING', 'Yoke Key Spring', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_YOKEPIN', 'Yoke Pin', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_YOKEROLL', 'Yoke Roll', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_YOKECOVER', 'Yoke Cover', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_POSITIONINDICATOR', 'Position Indicator', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_PISTONROD', 'Piston Rod', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_PISTON', 'Piston', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_PISTONASSEMBLY', 'Piston assembly', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_CYLINDERADAPTOR', 'Cylinder Adaptor', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_CYLINDER', 'Cylinder', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_CENTERBAR', 'Center Bar', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_ENDCAP', 'End Cap', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_STOPSCREWS', 'Stop Screws', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_JAMNUTS', 'Jam Nuts', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_HARDWARE', 'Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_SEALS', 'Seals', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_UNIT_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.PH_UNIT_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.PH_UNIT_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);
    return subTableforActuationTable;
  }

  getPneumaticDriveModuleAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_HOUSING', 'Housing', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_HOUSINGCOVER', 'Housing Cover', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_GUIDEBLOCKASSEMBLY', 'Guide Block Assembly', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_YOKE', 'Yoke', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_YOKEPIN', 'Yoke Pin', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_YOKECOVER', 'Yoke Cover', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_GUIDEBLOCK', 'Guide Block', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_POSITIONINDICATOR', 'Position Indicator', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_STOPSCREWS', 'Stop Screws', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_JAMNUTS', 'Jam Nuts', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_HARDWARE', 'Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_SEALS', 'Seals', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_DRIVEMODULE_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.PH_DRIVEMODULE_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.PH_DRIVEMODULE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getPneumaticSpringModuleAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {
    // let rows = [];
    subTableforActuationTable = this.getAccordionDetailRow('PH_SPRINGMODULE', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.PH_SPRINGMODULE_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.PH_SPRINGMODULE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);


    return subTableforActuationTable;
  }

  getPneumaticPowerModuleAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERMODULE', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERMODULE_ENDCAPINR', 'End Cap INR', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERMODULE_ENDCAPOTR', 'End Cap OTR', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERMODULE_TIEBARS', 'Tie Bars', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERMODULE_PISTON', 'Piston', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERMODULE_PISTONROD', 'Piston Rod', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERMODULE_SPLITRING', 'Split Ring', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERMODULE_CYLINDER', 'Cylinder', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERMODULE_HARDWARE', 'Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERMODULE_SEALS', 'Seals', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERMODULE_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.PH_POWERMODULE_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.PH_POWERMODULE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);


    return subTableforActuationTable;
  }

  getPneumaticTubingAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('PH_TUBING', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.PH_TUBING_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.PH_TUBING_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);


    return subTableforActuationTable;
  }

  getPneumaticPowerSwivelModuleAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERSWIVELMODULE', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERSWIVELMODULE_SPHERICALWASHERS', 'Spherical Washers', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERSWIVELMODULE_RODEXTENSIONASSEMBLY', 'Rod Extension Assembly', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_POWERSWIVELMODULE_RODEXTENSIONRETAINERNUT', 'Rod Extension Retainer Nut', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.PH_POWERSWIVELMODULE_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.PH_POWERSWIVELMODULE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);



    return subTableforActuationTable;
  }

  getPneumaticMountingHardwareAdaptionAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('PH_MOUNTINGHARDWAREADAPTION', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_MOUNTINGHARDWAREADAPTION_MOUNTINGBRACKET', 'Mounting Bracket', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_MOUNTINGHARDWAREADAPTION_STEMADAPTORBRACKETSAB', 'Stem Adaptor Bracket (SAB)', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_MOUNTINGHARDWAREADAPTION_HARDWARE', 'Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_MOUNTINGHARDWAREADAPTION_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.PH_MOUNTINGHARDWAREADAPTION_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.PH_MOUNTINGHARDWAREADAPTION_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);


    return subTableforActuationTable;
  }

  getPneumaticOverridesAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('PH_OVERRIDES', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_OVERRIDES_M3HEXNUTDRIVE', 'M3 (Hex Nut Drive)', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_OVERRIDES_M3HW', 'M3HW', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_OVERRIDES_G', 'Gearbox', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_OVERRIDES_MGG4SRG5SRONLY', 'MG (G4-SR/G5-SR only)', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_OVERRIDES_M11', 'M11', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_OVERRIDES_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.PH_OVERRIDES_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.PH_OVERRIDES_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getPneumaticVOSAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM_FILTER', 'Filter', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM_REGULATOR', 'Regulator', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM_GAUGE', 'Gauge', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM_CHECKVALVE', 'Check Valve', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM_RELIEFVALVE', 'Relief Valve', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM_SOLENOIDVALVE', 'Solenoid Valve', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM_PILOTVALVE', 'Pilot Valve', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM_MANUALVALVE', 'Manual Valve', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM_POSITIONER', 'Positioner', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM_VOLUMEBOOSTER', 'Volume Booster', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM_SPEEDCONTROLVALVES', 'Speed Control Valves', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_VOSVALVEOPERATINGSYSTEM_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.PH_VOSVALVEOPERATINGSYSTEM_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.PH_VOSVALVEOPERATINGSYSTEM_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getPneumaticAccessoriesAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('PH_ACCESSORIES', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_ACCESSORIES_DAMPERS', 'Dampers', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_ACCESSORIES_ETXETSETBETPET2', 'ETX (ETS, ETB,ETP, ET2)', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_ACCESSORIES_TSXTSSTSBTSPTS2', 'TSX (TSS, TSB, TSP, TS2)', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_ACCESSORIES_VOLUMETANKS', 'Volume Tanks', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('PH_ACCESSORIES_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.PH_ACCESSORIES_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.PH_ACCESSORIES_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;

  }

  getPneumaticOthersAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('PH_OTHER', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.PH_OTHER_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.PH_OTHER_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }


  getElectricHousingFrameAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_HOUSING', 'Housing', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_BASEPLATE', 'Base Plate', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_WORMGEARDRIVESLEEVE', 'Worm Gear/Drive Sleeve', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_WORMSHAFT', 'Worm Shaft', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_RACK', 'Rack', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_BEARINGS', 'Bearings', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_RACE', 'Race', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_HANDWHEELSHAFT', 'Handwheel Shaft', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_HANDWHEELGEARS', 'Handwheel Gears', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_TORQUESPRINGPARTS', 'Torque Spring Parts', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_CLUTCHSTUBSHAFT', 'Clutch Stub Shaft', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_CLUTCH', 'Clutch', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_CLUTCHSHIFTER', 'Clutch Shifter', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_HARDWARE', 'Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_SEALS', 'Seals', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_PLANETARYGEARSET', 'Planetary Gear Set', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_BALLSCREWOROUTPUTSHAFT', 'Ball Screw or Output Shaft', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_GEAREDLIMIT', 'Geared Limit', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_TORQUELIMIT', 'Torque limit', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_LOCKRINGSSTEMNUTBUSHINGRETAINERS', 'Lock Rings/Stem Nut-Bushing Retainers ', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_HOUSINGFRAME_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);

    if (AsLeftElementsData.AE_HOUSINGFRAME_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.AE_HOUSINGFRAME_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getElectricMotorSubassemblyAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_MOTOR', 'Motor', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_MOTORADAPTER', 'Motor Adapter', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_MOTORGEARS', 'Motor Gears', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_AUXMOTORGEARSHAFT', 'Aux Motor Gear Shaft', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_BEARINGS', 'Bearings', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_MOTORCLUTCH', 'Motor Clutch', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_MOTORADAPTERG', 'Motor Adapter Gearbox ', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_HARDWARE', 'Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_SEALS', 'Seals', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_CONDUITBOX', 'Conduit Box', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_CONDUITOREXPANDUNION', 'Conduit or Expand Union', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_WIREHARNESS', 'Wire Harness', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_BRAKE', 'Brake', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOTORSUBASSEMBLY_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.AE_MOTORSUBASSEMBLY_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.AE_MOTORSUBASSEMBLY_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getElectricControlsAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_GEARFRAME', 'Gearframe', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_LIMITG', 'Limit Gearbox', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_MDPI', 'MDPI', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_POTDRIVEGEARING', 'Pot Drive Gearing', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_POTENTIOMETER', 'Potentiometer', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_LOCALCONTROLS', 'Local Controls', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_LIMITSWITCHASSEMBLY', 'Limit Switch Assembly', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_TORQUESWITCHASSEMBLY', 'Torque Switch Assembly', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_POSITIONENCODER', 'Position Encoder', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_TORQUESENSOR', 'Torque Sensor', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_PILOTINDICATION', 'Pilot Indication', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_DISCONNECTCIRCUITBREAKER', 'Disconnect/Circuit Breaker', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_MOTORPROTECTION', 'Motor Protection', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_PHASEMONITOR', 'Phase Monitor', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_SPACEHEATER', 'Space Heater', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_AUXCONTROLMODULEISM', 'Aux Control Module/ISM', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_MOTORCONTROLMODULEBLDCSOLIDSTATERELAYSCR', 'Motor Control Module/BLDC/Solid State Relay/SCR', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_FAILSAFEMODULE', 'Failsafe Module', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_DISPLAYMODULE', 'Display Module', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_CPULOGICMODULE', 'CPU/Logic Module', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_FAILSAFEMODULEDECOUPLER', 'Failsafe Module/Decoupler', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_RELAYS', 'Relays', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_COMMUNICATIONSADAPTERMODULE', 'Communications Adapter Module', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_TERMINALBOARDTERMINALMODULES', 'Terminal Board/Terminal Modules', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_FUSES', 'Fuses', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_CONTACTOR', 'Contactor', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_TRANSFORMERPOWERCONVERTERPOWERSUPPLYMODULE', 'Transformer/Power Converter/Power Supply module', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_CONTROLSELECTRONICS_BATTERYBACKUPMODULE', 'Battery Backup Module', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);


    if (AsLeftElementsData.AE_CONTROLSELECTRONICS_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.AE_CONTROLSELECTRONICS_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getElectricEnclosureAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('AE_ENCLOSURE', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_ENCLOSURE_BASE', 'Base', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_ENCLOSURE_COVERASSEMBLY', 'Cover Assembly', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_ENCLOSURE_COVERASSEMBLYHARDWARE', 'Cover Assembly Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_ENCLOSURE_HARDWARE', 'Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_ENCLOSURE_SEALS', 'Seals', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_ENCLOSURE_LOCALDISPLAY', 'Local Display ', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_ENCLOSURE_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.AE_ENCLOSURE_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.AE_ENCLOSURE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getElectricSCMAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_BASEENCLOSURE', 'Base Enclosure', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_COVER', 'Cover', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_COVERHARDWARE', 'Cover Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_LOCALCONTROLS', 'Local Controls', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_PILOTINDICATION', 'Pilot Indication', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_DISCONNECTCIRCUITBREAKER', 'Disconnect/Circuit Breaker', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_MOTORPROTECTION', 'Motor Protection', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_PHASEMONITOR', 'Phase Monitor', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_SPACEHEATER', 'Space Heater', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_AUXCONTROLMODULEISM', 'Aux Control Module/ISM', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_DISPLAYMODULE', 'Display Module', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_CPULOGICMODULE', 'CPU/Logic Module', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_RELAYS', 'Relays', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_COMMUNICATIONSADAPTERMODULE', 'Communications Adapter Module', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_TERMINALBOARDTERMINALMODULES', 'Terminal Board/Terminal Modules', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_FUSES', 'Fuses', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_CONTACTOR', 'Contactor', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_SCMSEPARATECONTROLMODULE_TRANSFORMERPOWERCONVERTERPOWERSUPPLYMODULE', 'Transformer/Power Converter/Power Supply module', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.AE_SCMSEPARATECONTROLMODULE_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.AE_SCMSEPARATECONTROLMODULE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getElectricOverridesAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('AE_OVERRIDES', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_OVERRIDES_HANDWHEEL', 'Handwheel', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_OVERRIDES_HEXNUTDRIVE', 'Hex Nut Drive', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_OVERRIDES_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.AE_OVERRIDES_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.AE_OVERRIDES_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }


  getElectricGearboxAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('AE_G_G', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_G_HOUSING', 'Gearbox Housing', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_ENDCAPS', 'End Caps', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_POWERADAPTER', 'Power Adapter', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_SPURGEARS', 'Spur Gears', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_WORMGEARS', 'Worm Gears', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_WORMSHAFTS', 'Worm Shafts', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_INPUTSHAFTPINION', 'Input Shaft/Pinion', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_BEVELGEAR', 'Bevel Gear', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_BEARINGS', 'Bearings', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_RACE', 'Race', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_LOCKRINGSRETAINERS', 'Lock Rings/Retainers', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_RACK', 'Rack', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_PINION', 'Pinion', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_MECHANICALSTOPS', 'Mechanical Stops', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_HARDWARE', 'Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_SEALS', 'Seals', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_G_THRUSTBASE', 'Thrust Base', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.AE_G_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.AE_G_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getElectricLinearDriveAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('AE_LINEARDRIVE', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.AE_LINEARDRIVE_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.AE_LINEARDRIVE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getElectricMountingHardwareAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('AE_MOUNTINGHARDWAREADAPTION', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOUNTINGHARDWAREADAPTION_THRUSTBASEASSEMBLY', 'Thrust Base Assembly', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOUNTINGHARDWAREADAPTION_STEMNUT', 'Stem Nut', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOUNTINGHARDWAREADAPTION_BUSHING', 'Bushing', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOUNTINGHARDWAREADAPTION_MOUNTINGBRACKET', 'Mounting Bracket', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOUNTINGHARDWAREADAPTION_STEMADAPTOR', 'Stem Adaptor', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOUNTINGHARDWAREADAPTION_ANTIROTATIONDEVICEASSEMBLY', 'Anti-Rotation Device/Assembly', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOUNTINGHARDWAREADAPTION_HARDWARE', 'Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_MOUNTINGHARDWAREADAPTION_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);

    if (AsLeftElementsData.AE_MOUNTINGHARDWAREADAPTION_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.AE_MOUNTINGHARDWAREADAPTION_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);



    return subTableforActuationTable;
  }

  getElectricFailSafeAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('AE_FAILSAFE', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.AE_FAILSAFE_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.AE_FAILSAFE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getElectricAccessoriesAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('AE_ACCESSORIES', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_ACCESSORIES_STEMPROTECTORSSTEMOLUBE', 'Stem Protectors/Stem-o-Lube', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_ACCESSORIES_LUBRICATOR', 'Lubricator', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_ACCESSORIES_TORQUETENDER', 'Torque Tender', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_ACCESSORIES_RDM', 'RDM', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('AE_ACCESSORIES_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.AE_ACCESSORIES_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.AE_ACCESSORIES_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getElectricOthersAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('AE_OTHER', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.AE_OTHER_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.AE_OTHER_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);

    return subTableforActuationTable;
  }

  getGearboxHosuingFrameAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_G_HOUSING', 'Gearbox Housing', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_ENDCAPS', 'End Caps', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_SPURGEARS', 'Spur Gears', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_WORMGEARS', 'Worm Gears', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_WORMSHAFTS', 'Worm Shafts', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_INPUTSHAFTPINION', 'Input Shaft/Pinion', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_BEVELGEAR', 'Bevel Gear', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_BEARINGS', 'Bearings', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_RACE', 'Race', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_LOCKRINGSRETAINERS', 'Lock Rings/Retainers', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_RACK', 'Rack', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_PINION', 'Pinion', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_MECHANICALSTOPS', 'Mechanical Stops', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_STEMNUT', 'Stem Nut', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_BUSHING', 'Bushing', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_HARDWARE', 'Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_SEALS', 'Seals', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_HOUSINGFRAME_THRUSTBASE', 'Thrust Base', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.G_HOUSINGFRAME_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.G_HOUSINGFRAME_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);


    return subTableforActuationTable;
  }

  getGearboxSpurGearAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('G_SPURGEAR', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_SPURGEAR_G_HOUSING', 'Gearbox Housing', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_SPURGEAR_PURGEARS', 'Spur Gears', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_SPURGEAR_INPUTSHAFTPINION', 'Input Shaft/Pinion', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_SPURGEAR_BEARINGS', 'Bearings', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_SPURGEAR_RACE', 'Race', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_SPURGEAR_LOCKRINGSRETAINERS', 'Lock Rings/Retainers', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_SPURGEAR_STEMNUT', ' Stem Nut ', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_SPURGEAR_BUSHING', 'Bushing', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_SPURGEAR_HARDWARE', 'Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_SPURGEAR_SEALS', 'Seals', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_SPURGEAR_THRUSTBASE', 'Thrust Base', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);

    if (AsLeftElementsData.G_SPURGEAR_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.G_SPURGEAR_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);


    return subTableforActuationTable;
  }

  getGearboxAccessoriesAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('G_ACCESSORIES', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_ACCESSORIES_HANDWHEEL', 'Hand-Wheel', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_ACCESSORIES_HEXNUT', 'Hex Nut', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_ACCESSORIES_TORQUETENDER', 'Torque Tender', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_ACCESSORIES_LIMITSWITCH', 'Limit Switch', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_ACCESSORIES_STEMPROTECTOR', 'Stem Protector', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_ACCESSORIES_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);

    if (AsLeftElementsData.G_ACCESSORIES_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.G_ACCESSORIES_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);


    return subTableforActuationTable;
  }

  getGearboxMountingHardwareAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {
    //subTableforActuationTable.table.body.push([this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings(asFoundElementData.G_MOUNTINGHARDWAREADAPTION_AF, false), this.getConstructionLabelForFindings(AsLeftRAElementsData.G_MOUNTINGHARDWAREADAPTION_RA, false), this.getConstructionLabelForFindings(AsLeftElementsData.G_MOUNTINGHARDWAREADAPTION_AL, false)]);

    subTableforActuationTable = this.getAccordionDetailRow('G_MOUNTINGHARDWAREADAPTION', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_MOUNTINGHARDWAREADAPTION_THRUSTBASEASSEMBLY', 'Thrust Base Assembly', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_MOUNTINGHARDWAREADAPTION_STEMNUT', 'Stem Nut', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_MOUNTINGHARDWAREADAPTION_BUSHING', 'Bushing', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_MOUNTINGHARDWAREADAPTION_MOUNTINGBRACKET', 'Mounting Bracket', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_MOUNTINGHARDWAREADAPTION_STEMADAPTOR', 'Stem Adaptor', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_MOUNTINGHARDWAREADAPTION_ANTIROTATIONDEVICEASSEMBLY', 'Anti-Rotation Device/Assembly', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_MOUNTINGHARDWAREADAPTION_HARDWARE', 'Hardware', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    subTableforActuationTable = this.getAccordionDetailRow('G_MOUNTINGHARDWAREADAPTION_OTHER', 'Other', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.G_MOUNTINGHARDWAREADAPTION_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.G_MOUNTINGHARDWAREADAPTION_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);


    return subTableforActuationTable;
  }


  getNetworkTypeAccordion(subTableforActuationTable, asFoundElementData, AsLeftElementsData, AsLeftRAElementsData) {

    subTableforActuationTable = this.getAccordionDetailRow('N_NETWORKTYPE', '', subTableforActuationTable, asFoundElementData, AsLeftRAElementsData, AsLeftElementsData);
    if (AsLeftElementsData.N_NETWORKTYPE_ALC)
      subTableforActuationTable.table.body.push([this.getConstructionValue('Solution Comments', false), this.getConstructionLabelForComments(AsLeftElementsData.N_NETWORKTYPE_ALC), this.getConstructionLabelForFindings('', false), this.getConstructionLabelForFindings('', false)]);
    return subTableforActuationTable;
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
          if (valueColumn.base64) {
            let image = valueColumn.base64;
            let imageCol: any = {
              table: {
                heights: [1, 60, 20],
                body: [
                  //03/19/2019 -- Mayur Varshney -- set width and height for displaying two images in a row
                  // [{ image: image, border: this.noborderstyle, width: 300, height: 200, alignment: 'center' }],
                  // [{ columns: [{ text: valueColumn.DetailedValue, border: this.noborderstyle, width: 270, alignment: 'left' }], margin: [20, 0, 0, 0] }]]
                  [{ columns: [{ width: '*', text: '' }, { width: 'auto', table: { heights: 200, body: [[{ image: image, border: this.noborderstyle, fit: [330, 330], alignment: 'center' }],] } }, { width: '*', text: '' },] }],
                  [{ columns: [{ text: valueColumn.ATTACHMENTDESCRIPTION, border: this.noborderstyle, width: 270, alignment: 'center' }] }]
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

  transformCalibrationDataAsFound(asFoundResponse) {
    let transformedAsFoundData: any = [];

    // 07/15/2019 -- Zohaib Khan -- Transform As Found Calibration Data
    if (asFoundResponse) {
      if (asFoundResponse.CAL_TRAVEL && asFoundResponse.CAL_TRAVEL_UOM) {
        transformedAsFoundData.push({
          DisplayName: 'Travel',
          Value: this.processValue("CAL_TRAVEL", asFoundResponse)
        });
      }
      if (asFoundResponse.CAL_BENCHSET && asFoundResponse.CAL_BENCH_UOM) {
        transformedAsFoundData.push({
          DisplayName: 'Bench Set',
          Value: asFoundResponse.CAL_BENCHSET + " " + (asFoundResponse.CAL_BENCH_UOM == "Other" ? asFoundResponse.CAL_BENCH_UOM_OT : asFoundResponse.CAL_BENCH_UOM)
        });
      }
      if (asFoundResponse.CAL_SIGNALOPEN && asFoundResponse.CAL_SIGNALOPEN_UOM) {
        transformedAsFoundData.push({
          DisplayName: 'Signal Open',
          Value: this.processValue("CAL_SIGNALOPEN", asFoundResponse)
        });
      }
      if (asFoundResponse.CAL_SIGNALCLOSED && asFoundResponse.CAL_SIGNALCLOSED_UOM) {
        transformedAsFoundData.push({
          DisplayName: 'Signal Closed',
          Value: this.processValue("CAL_SIGNALCLOSED", asFoundResponse)
        });
      }
      if (asFoundResponse.CAL_SUPPLY && asFoundResponse.CAL_SUPPLY_UOM) {
        transformedAsFoundData.push({
          DisplayName: 'Supply',
          Value: this.processValue("CAL_SUPPLY", asFoundResponse)
        });
      }
      if (asFoundResponse.CAL_FAILACTION) {
        transformedAsFoundData.push({
          DisplayName: 'Fail Action',
          Value: asFoundResponse.CAL_FAILACTION == "Other" ? asFoundResponse.CAL_FAILACTION_OT : asFoundResponse.CAL_FAILACTION
        });
      }
    }
    return transformedAsFoundData;
  }

  processValue(colunmName, data) {
    let key = colunmName;
    let uom = key + "_UOM";
    let uom_Other = uom + "_OT";
    let value = data[key] + " " + (data[uom] == "Other" ? data[uom_Other] : data[uom]);

    return value;
  }

  transformCalibrationDataAsLeft(asLeftResponse) {
    let transformedAsLeftData: any = [];
    if (asLeftResponse) {
      if (asLeftResponse.CAL_TRAVEL && asLeftResponse.CAL_TRAVEL_UOM) {
        transformedAsLeftData.push({
          DisplayName: 'Travel',
          Value: this.processValue("CAL_TRAVEL", asLeftResponse)
        });
      }
      if (asLeftResponse.CAL_BENCHSET && asLeftResponse.CAL_BENCH_UOM) {
        transformedAsLeftData.push({
          DisplayName: 'Bench Set',
          Value: asLeftResponse.CAL_BENCHSET + " " + (asLeftResponse.CAL_BENCH_UOM == "Other" ? asLeftResponse.CAL_BENCH_UOM_OT : asLeftResponse.CAL_BENCH_UOM)
        });
      }
      if (asLeftResponse.CAL_SIGNALOPEN && asLeftResponse.CAL_SIGNALOPEN_UOM) {
        transformedAsLeftData.push({
          DisplayName: 'Signal Open',
          Value: this.processValue("CAL_SIGNALOPEN", asLeftResponse)
        });
      }
      if (asLeftResponse.CAL_SIGNALCLOSED && asLeftResponse.CAL_SIGNALCLOSED_UOM) {
        transformedAsLeftData.push({
          DisplayName: 'Signal Closed',
          Value: this.processValue("CAL_SIGNALCLOSED", asLeftResponse)
        });
      }
      if (asLeftResponse.CAL_SUPPLY && asLeftResponse.CAL_SUPPLY_UOM) {
        transformedAsLeftData.push({
          DisplayName: 'Supply',
          Value: this.processValue("CAL_SUPPLY", asLeftResponse)
        });
      }
      if (asLeftResponse.CAL_FAILACTION) {
        transformedAsLeftData.push({
          DisplayName: 'Fail Action',
          Value: asLeftResponse.CAL_FAILACTION == "Other" ? asLeftResponse.CAL_FAILACTION_OT : asLeftResponse.CAL_FAILACTION
        });
      }
    }
    return transformedAsLeftData;
  }

  getCalibrationTable(calibrationDataAsFound, calibrationDataAsLeft) {
    let table = { columns: [] };
    let rows = [];
    table = this.getCalibrationData(table, rows, calibrationDataAsFound, calibrationDataAsLeft, calibrationDataAsLeft ? calibrationDataAsLeft.CAL_TECHNICIAN : '');
    return table;
  }

  getCalibrationData(table, rows, calibrationDataAsFound, calibrationDataAsLeft, techName?) {
    let parentAsFoundHeading = true;
    let parentAsLeftHeading = true;
    let asFoundArr = this.transformCalibrationDataAsFound(calibrationDataAsFound);
    let asLeftArr = this.transformCalibrationDataAsLeft(calibrationDataAsLeft);
    if (asFoundArr.length > 0) {
      let leftinnerTable = {
        unbreakable: true,
        table: {
          widths: ['0.5%', '45%', '54%'],
          dontBreakRows: true,
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
          dontBreakRows: true,
          body: []
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === node.table.body.length ? 1.4 : 0;
          },
          vLineWidth: function (i, node) {
            return (i === 1 || i === node.table.widths.length) ? 1.4 : 0;
          },
          hLineColor: function (i, node) {
            return i === node.table.body.length ? '#4d8dd1' : '';
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
            return (i === 0) || i === node.table.body.length ? 1.4 : 0;
          },
          vLineWidth: function (i, node) {
            return (i === 2) || (i === 1) || (i === node.table.widths.length) ? 1.4 : 0;
          },
          hLineColor: function (i, node) {
            return (i === 0) || i === node.table.body.length ? '#4d8dd1' : '';
          },
          vLineColor: function (i, node) {
            return (i === 2) || (i === 1) || (i === node.table.widths.length) ? '#4d8dd1' : '';
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

  getBlankColumnTech() {
    return { text: "", color: "#045B83", bold: true, fontSize: 10, fillColor: "#fff", alignment: 'center', border: [false, false, false, true] }
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

  getTestDataTable(value) {
    let table = {
      "table": {
        dontBreakRows: true,
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



  getTestDataAccordionTable(testData) {
    let table = { columns: [] };
    let GSTPrssureHeadingRow = false, SLCHeadinRow = false, LeakageHeadingRow = false, HTPHeadingRow = false;
    try {
      let rows = [];
      if (testData) {
        let testDataStructure = this.getTestDataTableStructure();

        if (String(testData.CV_PKG_GSTPRESSURE_NA) != "true") {
          if (testData.CV_PKG_GSTPRESSURE_PKGGSTPRESSURE) {
            testDataStructure.table.body.push([!GSTPrssureHeadingRow ? this.getBlankColumn("PKG/GST Pressure") : this.getBlankColumn(""), this.getConstructionLabelForFindingsWithBorder(this.translator("PKG GST Pressure"), false, "Border"), this.getConstructionValueWithBorder(this.processValue("CV_PKG_GSTPRESSURE_PKGGSTPRESSURE", testData), false, "Border")]);
            GSTPrssureHeadingRow = true
          }
          if (testData.CV_PKG_GSTPRESSURE_PASS_FAIL) {
            testDataStructure.table.body.push([!GSTPrssureHeadingRow ? this.getBlankColumn("PKG/GST Pressure") : this.getBlankColumn(""), this.getConstructionLabelForFindingsWithBorder(this.translator("Pass/Fail"), false, "Border"), this.getConstructionValueWithBorder(testData.CV_PKG_GSTPRESSURE_PASS_FAIL == "Other" ? testData.CV_PKG_GSTPRESSURE_PASS_FAIL_OT : testData.CV_PKG_GSTPRESSURE_PASS_FAIL, false, "Border")]);
            GSTPrssureHeadingRow = true
          }

          if (testDataStructure.table.body.length > 0) {
            testDataStructure.table.body.push([this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn("")]);
            rows.push(testDataStructure);
          }
        }
        testDataStructure = this.getTestDataTableStructure();
        if (String(testData.SEATLEAKCLASS_NA) != "true") {
          if (testData.SEATLEAKCLASS) {
            testDataStructure.table.body.push([!SLCHeadinRow ? this.getBlankColumn("Seat Leak Class") : this.getBlankColumn(""), this.getConstructionLabelForFindingsWithBorder(this.translator("Seat Leak Class"), false, "Border"), this.getConstructionValueWithBorder(testData.SEATLEAKCLASS == "Other" ? testData.SEATLEAKCLASS_OT : testData.SEATLEAKCLASS, false, "Border")]);
            SLCHeadinRow = true
          }
          if (testData.TESTPRESSURE) {
            testDataStructure.table.body.push([!SLCHeadinRow ? this.getBlankColumn("Seat Leak Class") : this.getBlankColumn(""), this.getConstructionLabelForFindingsWithBorder(this.translator("Test Pressure"), false, "Border"), this.getConstructionValueWithBorder(this.processValue("TESTPRESSURE", testData), false, "Border")]);
            SLCHeadinRow = true
          }
          if (testDataStructure.table.body.length > 0) {
            testDataStructure.table.body.push([this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn("")]);
            rows.push(testDataStructure);
          }
        }

        testDataStructure = this.getTestDataTableStructure();
        if (String(testData.LEAKAGE_NA) != "true") {
          if (testData.LEAKAGE_ALLOWABLELEAKAGE) {
            testDataStructure.table.body.push([!LeakageHeadingRow ? this.getBlankColumn("Leakage") : this.getBlankColumn(""), this.getConstructionLabelForFindingsWithBorder(this.translator("Allowable Leakage"), false, "Border"), this.getConstructionValueWithBorder(this.processValue("LEAKAGE_ALLOWABLELEAKAGE", testData), false, "Border")]);
            LeakageHeadingRow = true
          }
          if (testData.LEAKAGE_ACTUALLEAKAGE) {
            testDataStructure.table.body.push([!LeakageHeadingRow ? this.getBlankColumn("Leakage") : this.getBlankColumn(""), this.getConstructionLabelForFindingsWithBorder(this.translator("Actual Leakage"), false, "Border"), this.getConstructionValueWithBorder(this.processValue("LEAKAGE_ACTUALLEAKAGE", testData), false, "Border")]);
            LeakageHeadingRow = true
          }

          if (testDataStructure.table.body.length > 0) {
            testDataStructure.table.body.push([this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn("")]);
            rows.push(testDataStructure);
          }
        }

        testDataStructure = this.getTestDataTableStructure();
        if (String(testData.HYDROTESTPRESSURE_NA) != "true") {
          if (testData.HYDROTESTPRESSURE) {
            testDataStructure.table.body.push([!HTPHeadingRow ? this.getBlankColumn("Hydro Test Pressure") : this.getBlankColumn(""), this.getConstructionLabelForFindingsWithBorder(this.translator("Hydro Test Pressure"), false, "Border"), this.getConstructionValueWithBorder(this.processValue("HYDROTESTPRESSURE", testData), false, "Border")]);
            HTPHeadingRow = true
          }
          if (testData.DURATION) {
            testDataStructure.table.body.push([!HTPHeadingRow ? this.getBlankColumn("Hydro Test Pressure") : this.getBlankColumn(""), this.getConstructionLabelForFindingsWithBorder(this.translator("Duration"), false, "Border"), this.getConstructionValueWithBorder(testData.DURATION == "Other" ? testData.DURATION_OT : testData.DURATION, false, "Border")]);
            HTPHeadingRow = true
          }

          if (testDataStructure.table.body.length > 0) {
            testDataStructure.table.body.push([this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn("")]);
            rows.push(testDataStructure);
          }
        }

        if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.LevelTroll) {
          testDataStructure = this.getTestDataTableStructure();
          if (testData.LT_BUILDDATE) {
            testDataStructure.table.body.push([this.getBlankColumn("Repair Assembly Data"), this.getConstructionLabelForFindingsWithBorder(this.translator("Build Date"), false, "Border"), this.getConstructionValueWithBorder(moment(testData.LT_BUILDDATE).format('DD-MMM-YYYY'), false, "Border")]);
          }
          if (testDataStructure.table.body.length > 0) {
            testDataStructure.table.body.push([this.getBlankColumn(""), this.getBlankColumn(""), this.getBlankColumn("")]);
            rows.push(testDataStructure);
          }
        }
        if (rows.length == 0) {
          testDataStructure.table.body.push([]);
          rows.push(testDataStructure);
        }
        table.columns.push(rows);
      }
    } catch (err) {
      this.logger.log(this.fileName, 'getTestDataAccordionTable', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getOptionalServicesIsolationPreValveSection(optionalServicesData) {
    // let self = this;
    let table = { columns: [] };
    try {
      let rows = [];
      let subTableforPreValve = this.getPreValveOptionalServicesIsolationMainTable();
      let subTableforOptionalNonList = this.getOptionalNonListTable();
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.ControlValve) {
        if (this.processPreValveObject('CV_VALVEPRE', optionalServicesData)) {
          subTableforOptionalNonList = this.getCVPreValveOptionalAccordionTable(subTableforOptionalNonList, optionalServicesData);
          subTableforPreValve.table.body.push([this.getBlankColumn('Valve Pre-Test Data'), subTableforOptionalNonList]);
          rows.push(subTableforPreValve);
        }
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.Isolation) {

        if (this.processPreValveObject('ISO_VALVEPRE', optionalServicesData)) {
          subTableforOptionalNonList = this.getISOPreValveOptionalAccordionTable(subTableforOptionalNonList, optionalServicesData);
          subTableforPreValve.table.body.push([this.getBlankColumn('Valve Pre-Test Data'), subTableforOptionalNonList]);
          rows.push(subTableforPreValve);
        }
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.TrimOnly) {

        if (this.processPreValveObject('TO_VALVEPRE', optionalServicesData)) {
          subTableforOptionalNonList = this.getTOPreValveOptionalAccordionTable(subTableforOptionalNonList, optionalServicesData);
          subTableforPreValve.table.body.push([this.getBlankColumn('Valve Pre-Test Data'), subTableforOptionalNonList]);
          rows.push(subTableforPreValve);
        }
      }

      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getOptionalServicesIsolationPreValveSection', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getOptionalServicesIsolationAccordionSection(optionalServicesData) {
    // let self = this;
    let table = { columns: [] };
    try {

      let rows = [];
      let subTableforItemsHeader = this.getActuationHeadingTable();
      let subTableforItems = this.getActuationMainTable();
      let subTableforActuationTable = this.getSubTableForFindings();

      subTableforItemsHeader.table.body.push([this.getBlankColumn(' '), this.getFindingsAccordionHeader(), { text: this.translator('NOTES'), color: "#045B83", bold: true, border: this.noborderstyle, fontSize: 9, fillColor: "#fff", margin: [10, 3, 0, 3], alignment: 'center' }]);

      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.ControlValve) {

        if (this.processFindingsObject('CV_MATERIALSVERIFICATION', optionalServicesData)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getCVMaterialVerificationOptionalAccordionTable(subTableforActuationTable, optionalServicesData);
          subTableforItems.table.body.push([this.getBlankColumn('Materials Verification'), subTableforActuationTable, this.getNotesboxActuation(optionalServicesData.CV_MATERIALSVERIFICATION_NOTES, "Border")]);
          subTableforItems.table.body.push([this.getBlankColumn(''), this.getBlankColumn(''), this.getBlankColumn('')]);
          rows.push(subTableforItems);
        }
        if (this.processFindingsObject('CV_ROTARYVALVE', optionalServicesData)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getCVRotaryValveOptionalAccordionTable(subTableforActuationTable, optionalServicesData);
          subTableforItems.table.body.push([this.getBlankColumn('Rotary Valve'), subTableforActuationTable, this.getNotesboxActuation(optionalServicesData.CV_ROTARYVALVE_NOTES, "Border")]);
          rows.push(subTableforItems);
        }
        if (this.processFindingsObject('CV_SLIDINGITEM', optionalServicesData)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getCVSlidingItemOptionalAccordionTable(subTableforActuationTable, optionalServicesData);
          subTableforItems.table.body.push([this.getBlankColumn('Sliding Item'), subTableforActuationTable, this.getNotesboxActuation(optionalServicesData.CV_SLIDINGITEM_NOTES, "Border")]);
          rows.push(subTableforItems);
        }
        if (this.processFindingsObject('CV_CONTROLLERCONSTRUCTION', optionalServicesData)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getCVMaterialVerificationOptionalAccordionTable(subTableforActuationTable, optionalServicesData);
          subTableforItems.table.body.push([this.getBlankColumn('Controller Construction'), subTableforActuationTable, this.getNotesboxActuation(optionalServicesData.CV_CONTROLLERCONSTRUCTION_NOTES, "Border")]);
          rows.push(subTableforItems);
        }
      }

      if (this.processFindingsObject('ISO_MATERIALSVERIFICATION', optionalServicesData)) {
        subTableforItems = this.getActuationMainTable();
        subTableforActuationTable = this.getSubTableForFindings();
        subTableforActuationTable = this.getISOMaterialVerificationOptionalAccordionTable(subTableforActuationTable, optionalServicesData);
        subTableforItems.table.body.push([this.getBlankColumn('Materials Verification'), subTableforActuationTable, this.getNotesboxActuation(optionalServicesData.ISO_MATERIALSVERIFICATION_NOTES, "Border")]);
        rows.push(subTableforItems);
      }
      if (this.processFindingsObject('ISO_ROTARYVALVE', optionalServicesData)) {
        subTableforItems = this.getActuationMainTable();
        subTableforActuationTable = this.getSubTableForFindings();
        subTableforActuationTable = this.getISORotaryValveOptionalAccordionTable(subTableforActuationTable, optionalServicesData);
        subTableforItems.table.body.push([this.getBlankColumn('Rotary Valve'), subTableforActuationTable, this.getNotesboxActuation(optionalServicesData.ISO_ROTARYVALVE_NOTES, "Border")]);
        rows.push(subTableforItems);
      }
      if (this.processFindingsObject('ISO_SLIDINGITEM', optionalServicesData)) {
        subTableforItems = this.getActuationMainTable();
        subTableforActuationTable = this.getSubTableForFindings();
        subTableforActuationTable = this.getISOSlidingItemOptionalAccordionTable(subTableforActuationTable, optionalServicesData);
        subTableforItems.table.body.push([this.getBlankColumn('Sliding Item'), subTableforActuationTable, this.getNotesboxActuation(optionalServicesData.ISO_SLIDINGITEM_NOTES, "Border")]);
        rows.push(subTableforItems);
      }
      if (parseInt(this.parentReferenceID) == Enums.FlowIsolationProductId.TrimOnly) {
        if (this.processFindingsObject('TO_MATERIALSVERIFICATION', optionalServicesData)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getTOMaterialVerificationOptionalAccordionTable(subTableforActuationTable, optionalServicesData);
          subTableforItems.table.body.push([this.getBlankColumn('Materials Verification'), subTableforActuationTable, this.getNotesboxActuation(optionalServicesData.TO_MATERIALSVERIFICATION_NOTES, "Border")]);
          rows.push(subTableforItems);
        }
        if (this.processFindingsObject('TO_ROTARYVALVE', optionalServicesData)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getTORotaryValveOptionalAccordionTable(subTableforActuationTable, optionalServicesData);
          subTableforItems.table.body.push([this.getBlankColumn('Rotary Valve'), subTableforActuationTable, this.getNotesboxActuation(optionalServicesData.TO_ROTARYVALVE_NOTES, "Border")]);
          rows.push(subTableforItems);
        }
        if (this.processFindingsObject('TO_SLIDINGITEM', optionalServicesData)) {
          subTableforItems = this.getActuationMainTable();
          subTableforActuationTable = this.getSubTableForFindings();
          subTableforActuationTable = this.getTOSlidingItemOptionalAccordionTable(subTableforActuationTable, optionalServicesData);
          subTableforItems.table.body.push([this.getBlankColumn('Sliding Item'), subTableforActuationTable, this.getNotesboxActuation(optionalServicesData.TO_SLIDINGITEM_NOTES, "Border")]);
          rows.push(subTableforItems);
        }

      }
      if (rows.length > 0) {
        rows.unshift(subTableforItemsHeader);
      }

      table.columns.push(rows);
    } catch (err) {
      this.logger.log(this.fileName, 'getOptionalServicesIsolationAccordionSection', "Error: " + JSON.stringify(err));
    }
    return table;
  }

  getOptionalNonListTable() {
    let optionalNonListTable: any = {
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

  getAccessoryTable(accessoriesList, header) {
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
      accessoryTable.table.body.push([{ text: this.translator(header), border: [false, false, false, false], fillColor: "#FFF", color: '#234487', style: 'header' }]);
      accessoryTable.table.body.push([this.getBlankPart(this.translator("Accessories"))]);
      for (let k = 0; k < accessoriesList.length; k++) {
        let jsonObj = accessoriesList[k];
        accessoryTable.table.body.push([this.getPartValue(jsonObj.VALUE == 'Other' ? jsonObj.VALUE_OT : jsonObj.VALUE)]);
      }
      rows.push(accessoryTable);
      table.columns.push(rows);

    } catch (err) {
      this.logger.log(this.fileName, 'getAccessoriesList', "Error: " + JSON.stringify(err));
    }
    return table;
  }



  transformOptionalServicesData(optionalServicesData, key) {
    let transformedData = [
      {
        DisplayName: "Test Technician",
        Value: optionalServicesData[key + '_VALVEPRE_TESTDATA_TESTTECHNICIAN']
      },
      {
        DisplayName: "Test Witness",
        Value: optionalServicesData[key + '_VALVEPRE_TESTDATA_TESTWITNESS']

      },
      {
        DisplayName: "Test Date",
        Value: optionalServicesData[key + '_VALVEPRE_TESTDATA_TESTDATE'] ? moment(optionalServicesData[key + '_VALVEPRE_TESTDATA_TESTDATE']).format('DD-MMM-YYYY') : ' '
      }
    ];
    return transformedData
  }

  getPdfFonts() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = {
      // Default font should still be available
      // Roboto: {
      //     normal: 'Roboto-Regular.ttf',
      //     bold: 'Roboto-Medium.ttf',
      //     italics: 'Roboto-Italic.ttf',
      //     bolditalics: 'Roboto-Italic.ttf'
      // },
      // Make sure you define all 4 components - normal, bold, italics, bolditalics - (even if they all point to the same font file)
      Arial: {
        normal: 'Arial-Regular.ttf',
        bold: 'Arial-Medium.ttf',
        italics: 'Arial-italic.ttf',
        bolditalics: 'Arial-BoldItalics.ttf'
      },
      SourceHanSansSC: {
        normal: 'SourceHanSansSC-Regular.ttf',
        bold: 'SourceHanSansSC-Bold.ttf',
        italics: 'SourceHanSansSC-Regular.ttf',
        bolditalics: 'SourceHanSansSC-Regular.ttf'
      },
      OpenSans: {
        normal: 'OpenSans-Regular.ttf',
        bold: 'OpenSans-Medium.ttf',
        italics: 'OpenSans-italic.ttf',
        bolditalics: 'OpenSans-BoldItalics.ttf'
      }
    };
  }

};
