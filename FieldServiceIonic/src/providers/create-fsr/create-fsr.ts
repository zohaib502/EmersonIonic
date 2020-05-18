import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Component } from '@angular/core';
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
declare let $: any;

@Injectable()
export class CreateFsrProvider {
    contactList = [];
    taskObj: any
    public installBaseList = [];
    pdfObj = null;
    translate: any;
    noborderstyle = [false, false, false, false];
    borderstyle = [false, false, false, true];
    language: any;
    materialArray = [];
    userPreference: any = [];
    allAddressesCountry: any = [];

    isTemp: boolean = false;
    fileName: any = 'CreateFsrProvider';
    attachmentList: any;
    iconsObj: any = {};
    detailedNotesData: any = [];
    detailedAttachmentData: any = [];
    childElements: any = [];
    grandChildElements: any = [];
    constructor(public translateService: TranslateService, public logger: LoggerProvider, public localService: LocalServiceProvider, public sortPipe: SortPipe, public http: HttpClient, private utilityProvider: UtilityProvider, private valueProvider: ValueProvider, private platform: Platform) {
    }

    async generatepdf(langCode, isTemp, page, status) {
        try {
            //08/08/2018 Zohaib Khan: Getting the attachment list in attachmentList letiable
            this.attachmentList = this.valueProvider.getAttachmentForDisplay();
            let watermarktext = {};
            let defaultFont = 'Arial';
            this.taskObj = this.valueProvider.getTask();
            this.detailedNotesData = [];
            this.detailedAttachmentData = [];
            let detailedNotes: any = await this.localService.getDetailNotesList(String(this.valueProvider.getTaskId()));
            if (detailedNotes && detailedNotes.length > 0) {
                this.detailedNotesData = detailedNotes;
            }
            let allDetailedAttachments: any = await this.localService.getAllAttachmentFromDetailedNotes(this.valueProvider.getTaskId());
            if (allDetailedAttachments && allDetailedAttachments.length > 0) {
                this.detailedAttachmentData = allDetailedAttachments;
            }
            await this.getBase64DetailedNotesAttachment();
            let contactList = await this.localService.getContactList(this.valueProvider.getTaskId());
            await this.getaddresses();
            let translate = await this.translateService.getTranslation(langCode).toPromise();
            await this.getBase64Attachment();
            await this.getstaticIcons();
            this.translate = translate;
            let footerprefix = this.translator('Page');
            let footerSuffix = this.translator('Of');

            //07/20/2018 Zohaib Khan
            // Updated if condition according to do not display flag option
            // if temporary userpreference which is this.valueProvider.getUserFSRPreferences() is not empty that means user wants fsr with temporary preferences
            // Otherwise use the main user preferences values

            if (!isTemp && !this.valueProvider.getUserFSRPreferences()) {
                this.userPreference = this.valueProvider.getUserPreferences()[0];
            }
            else {
                this.userPreference = this.valueProvider.getUserFSRPreferences();
            }
            // 07/20/2018
            // added if condition if isTemp is true which means user wants a temporary fsr which only generetes on summary page with Watermark
            if (isTemp) {
                this.userPreference = this.valueProvider.getUserPreferences()[0];
                watermarktext = { text: 'DRAFT', color: 'blue', opacity: 0.3, bold: true, italics: false }
            }
            this.language = langCode;
            //this.valueProvider.isChinaCountry()
            //09/13/2018 Zohaib Khan: If language code is chinese than use chinese fonts
            // 05-28-2019 -- Mayur Varshney -- apply check if country is Korean then print pdf by korean font
            // 06-04-2019 -- Mayur Varshney -- apply check if country is Japan then print pdf by japan font
            if (langCode == 'zh-cn' || langCode == 'ko' || langCode == 'ja' || this.valueProvider.isChinaCountry() || this.valueProvider.isKoreanCountry() || this.valueProvider.isJapanCountry()) {
                defaultFont = 'SourceHanSansSC';
            }
            // Disable check of Romanian as per requirement
            //  else if (langCode == 'ro') {
            //     defaultFont = 'OpenSans';
            // }
            // let headerSection = ;
            let docDefinition = await this.getInitialDocDefinition(footerSuffix, footerprefix, watermarktext, defaultFont);
            docDefinition.content.push({ text: '', style: 'customerdetailheader' });
            docDefinition.content.push(this.getCustomerDetailsSection(contactList));
            this.getBoolean();
            if (this.userPreference.FSR_PrintNote) {
                docDefinition.content.push({ text: this.translator('Notes'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getNotesTable()));
            }
            if (this.userPreference.FSR_PrintAttachment) {
                docDefinition.content.push({ text: this.translator('Attachments'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getAttachmentsTable()));
            }
            if (this.userPreference.FSR_PrintTime) {
                docDefinition.content.push({ text: this.translator('Time'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getTimeTable()));
            }

            if (this.detailedNotesData.length > 0) {
                this.getPdfFonts();
                docDefinition.content.push({ text: this.translator('Detailed Notes'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getDetailedNotes(docDefinition)));
                // docDefinition = this.getDetailedNotesTable(docDefinition);
            }
            //11/06/2018 Zohaib Khan: If Status is Debrif Started Then use main preferences if not then use Task Table On-Site preferences to Print Expenses.
            if (this.userPreference.FSR_PrintExpense && String(this.valueProvider.getTaskObject().StatusID) == String(Enums.Jobstatus.Debrief_Started)) {
                docDefinition.content.push({ text: this.translator('Expenses'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getExpenseTable()));
            } else if (String(this.valueProvider.getTaskObject().FSR_PrintExpenseOnSite) == 'true' && String(this.valueProvider.getTaskObject().StatusID) != String(Enums.Jobstatus.Debrief_Started)) {
                docDefinition.content.push({ text: this.translator('Expenses'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getExpenseTable()));
            }
            if (this.userPreference.FSR_PrintMaterial) {
                docDefinition.content.push({ text: this.translator('Material'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getMaterialsTable()));
            }
            if (!isTemp && ((this.valueProvider.getEngineer() && this.valueProvider.getEngineer().Sign_File_Path) || (this.valueProvider.getCustomer() && this.valueProvider.getCustomer().Cust_Sign_File))) {
                //docDefinition.content.push({ text: this.translator('Signature'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.addSignTableToSection(this.getNewSignatureSection(), this.addTableToSection(this.getNewSection(), this.getSignatureTable()))));
            }
            if (this.userPreference.FSR_PrintEUISO && !isTemp) {
                docDefinition.content.push({ text: this.translator('EU-ISO'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getEUISOTable()));
            }
            //07/25/2018 Zohaib Khan
            // Added Disclaimer section to fsr
            if (this.userPreference.FSR_Disclaimer) {
                docDefinition.content.push({ text: this.translator('Disclaimer'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getDisclaimerSection()));
            }
            docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getSpace()));
            if ((this.userPreference.FSR_PrintTime) && (String(this.valueProvider.getTaskObject().StatusID) == String(Enums.Jobstatus.Debrief_In_Progress) || String(this.valueProvider.getTaskObject().StatusID) == String(Enums.Jobstatus.Debrief_Declined)) && (this.valueProvider.getSortedModifiedTime().length == 0)) {
                docDefinition.content.push({ text: this.translator('Customer Signed Off Time From Above'), style: 'header' });
                docDefinition.content.push({ text: this.translator('Time'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getTimeTable()));
                docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getSpace()));
            }
            //|| ((!isTemp && (((String(this.valueProvider.getTaskObject().FSR_PrintExpenseOnSite) == 'true') && ((this.valueProvider.getSortedModifiedExpense().length > 0 && this.valueProvider.getSortedModifiedExpense()) || (this.valueProvider.getadditionalExpense().length > 0 && this.valueProvider.getadditionalExpense()))) || String(this.valueProvider.getTaskObject().FSR_PrintExpenseComplete) == 'true')) || (isTemp && (String(this.userPreference.FSR_PrintExpenseComplete) == 'true' || (String(this.userPreference.FSR_PrintExpense) == 'true' && ((this.valueProvider.getSortedModifiedExpense().length > 0 && this.valueProvider.getSortedModifiedExpense()) || (this.valueProvider.getadditionalExpense().length > 0 && this.valueProvider.getadditionalExpense())) ))))
            //(this.valueProvider.getSortedModifiedMaterial() && this.valueProvider.getSortedModifiedMaterial().length > 0) || (this.valueProvider.getAdditionalMaterial() || this.valueProvider.getAdditionalMaterial().length > 0)
            if (((this.valueProvider.getSortedModifiedTime().length > 0 && this.valueProvider.getSortedModifiedTime()) || (this.valueProvider.getadditionalTime().length > 0 && this.valueProvider.getadditionalTime())) || (((this.valueProvider.getSortedModifiedExpense().length > 0 && this.valueProvider.getSortedModifiedExpense()) || (this.valueProvider.getadditionalExpense().length > 0 && this.valueProvider.getadditionalExpense())) && String(this.userPreference.FSR_PrintExpenseComplete) == 'true') || ((this.valueProvider.getSortedModifiedMaterial() && this.valueProvider.getSortedModifiedMaterial().length > 0) || (this.valueProvider.getAdditionalMaterial() && this.valueProvider.getAdditionalMaterial().length > 0))) {
                docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getAfterSignOffText()));
            }
            if (this.valueProvider.getSortedModifiedTime() && this.valueProvider.getSortedModifiedTime().length > 0) {
                docDefinition.content.push({ text: this.translator('Updated Time prior to Customer Signature'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getModifiedTimeTable()));
            }
            if (this.valueProvider.getadditionalTime() && this.valueProvider.getadditionalTime().length > 0) {
                docDefinition.content.push({ text: this.translator('Additional Time'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getAdditionalTimeTable()));
            }
            if (String(this.valueProvider.getTaskObject().StatusID) == String(Enums.Jobstatus.Debrief_In_Progress) || String(this.valueProvider.getTaskObject().StatusID) == String(Enums.Jobstatus.Debrief_Declined)) {
                docDefinition.content.push({ text: this.translator('Time Grand Total'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getGrandTotalFromTimeTables()));
            }
            //&& ((!isTemp && String(this.valueProvider.getTaskObject().FSR_PrintExpenseOnSite) == 'true') || (isTemp && String(this.userPreference.FSR_PrintExpense) == 'true'))
            if ((this.valueProvider.getSortedModifiedExpense() && this.valueProvider.getSortedModifiedExpense().length > 0) && ((String(this.userPreference.FSR_PrintExpenseComplete) == 'true') && ((String(this.valueProvider.getTaskObject().StatusID) != String(Enums.Jobstatus.Debrief_Started) && String(this.valueProvider.getTaskObject().FSR_PrintExpenseOnSite) == 'true')))) {
                docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getSpace()));
                docDefinition.content.push({ text: this.translator('Updated Expense prior to Customer Signature'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getModifiedExpenseTable()));
            }
            // && ((!isTemp && String(this.valueProvider.getTaskObject().FSR_PrintExpenseOnSite) == 'true') || (isTemp && String(this.userPreference.FSR_PrintExpense) == 'true'))
            if ((this.valueProvider.getadditionalExpense() && this.valueProvider.getadditionalExpense().length > 0) && ((String(this.userPreference.FSR_PrintExpenseComplete) == 'true') && ((String(this.valueProvider.getTaskObject().StatusID) != String(Enums.Jobstatus.Debrief_Started) && String(this.valueProvider.getTaskObject().FSR_PrintExpenseOnSite) == 'true')))) {
                docDefinition.content.push({ text: this.translator('Additional Expense'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getAdditionalExpenseTable()));
            }
            // || (!isTemp && (String(this.valueProvider.getTaskObject().FSR_PrintExpenseComplete) == 'true'))
            if ((String(this.valueProvider.getTaskObject().StatusID) == String(Enums.Jobstatus.Debrief_In_Progress) || String(this.valueProvider.getTaskObject().StatusID) == String(Enums.Jobstatus.Debrief_Declined)) && (String(this.userPreference.FSR_PrintExpenseComplete) == 'true') && (String(this.valueProvider.getTaskObject().FSR_PrintExpenseOnSite) == 'false')) {
                docDefinition.content.push({ text: this.translator('Expenses'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getPostSigExpenseTable()));
            }
            if (this.valueProvider.getSortedModifiedMaterial() && this.valueProvider.getSortedModifiedMaterial().length > 0) {
                docDefinition.content.push(this.addTableToSection(this.getNewNoBorderSection(), this.getSpace()));
                docDefinition.content.push({ text: this.translator('Updated Material prior to Customer Signature'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getModifiedMaterialsTable()));
            }
            if (this.valueProvider.getAdditionalMaterial() && this.valueProvider.getAdditionalMaterial().length > 0) {
                docDefinition.content.push({ text: this.translator('Additional Material'), style: 'header' });
                docDefinition.content.push(this.addTableToSection(this.getNewSection(), this.getAdditionalMaterialsTable()));
            }
            if (this.platform.is('cordova')) {
                return await this.createPDF(docDefinition, isTemp, page, langCode, status);
            } else {
                this.pdfObj = pdfMake.createPdf(docDefinition).open();
                return true;
            }
        } catch (error) {

        }
    }

    createPDF(docDefinition, isTemp, page, langCode, status) {
        return new Promise((resolve, reject) => {
            try {
                pdfMake.createPdf(docDefinition).getDataUrl((dataURL) => {
                    let filePath = cordova.file.dataDirectory;
                    if (isTemp) {
                        this.logger.log(this.fileName, 'generatepdf', "Saving Temporary Report for Job #" + this.taskObj.Task_Number);
                        this.utilityProvider.saveBase64Attachment(filePath + "/temp/", "Temp_Report_" + this.taskObj.Task_Number + "_" + langCode + ".pdf", dataURL.split(",")[1], "application/pdf").then((res) => {
                            resolve("success");
                        });
                    }
                    if (!isTemp && page == "SummaryPage") {
                        let reportStatus: any = "";
                        // 10/24/2018 Zohaib Khan: Updated condition for debrief declined.
                        //Zohaib Khan: 3/07/2019-- REMOVING isDeclined ==true from condition as it is not needed any more.
                        // if (this.valueProvider.getTaskObject().StatusID == Enums.Jobstatus.Debrief_Declined && String(this.valueProvider.getTaskObject().IsDeclined) == "true") {
                        if (this.valueProvider.getTaskObject().StatusID == Enums.Jobstatus.Debrief_Declined) {
                            reportStatus = "Resubmitted-" + moment.utc().format("YYYY-MM-DD-HH-mm").toString();
                        } else {
                            reportStatus = "CompletedDebrief-" + moment.utc().format("YYYY-MM-DD-HH-mm").toString();
                        }
                        this.logger.log(this.fileName, 'generatepdf', "Saving Report for Job #" + this.taskObj.Task_Number);
                        this.utilityProvider.saveBase64Attachment(filePath + "/taskfiles/" + this.valueProvider.getTaskId() + "/", "Report_" + this.taskObj.Task_Number + "_" + reportStatus + "_" + langCode + ".pdf", dataURL.split(",")[1], "application/pdf").then((res) => {
                            (res ? resolve("Report_" + this.taskObj.Task_Number + "_" + reportStatus + "_" + langCode + ".pdf") : resolve());
                        });
                    }
                    if (!isTemp && page != "SummaryPage") {
                        if (status != "" || status != undefined) {
                            this.logger.log(this.fileName, 'generatepdf', "Saving Report for Job #" + this.taskObj.Task_Number);
                            //03/08/2019-Zohaib Khan: Making common timestamp for onsite/Completed Report for creating and resolving.
                            let timeStamp = moment.utc().format("YYYY-MM-DD-HH-mm").toString();
                            this.utilityProvider.saveBase64Attachment(filePath + "/taskfiles/" + this.valueProvider.getTaskId() + "/", "Report_" + this.taskObj.Task_Number + "_" + status + "-" + timeStamp + "_" + langCode + ".pdf", dataURL.split(",")[1], "application/pdf").then((res) => {
                                (res ? resolve("Report_" + this.taskObj.Task_Number + "_" + status + "-" + timeStamp + "_" + langCode + ".pdf") : resolve());
                            });
                        }
                    }
                    this.childElements = [];
                });
            } catch (error) {
                this.logger.log(this.fileName, 'generatepdf', "Error: " + error.message);
                throw error;
            }
        })
    }

    async getInitialDocDefinition(footerSuffix, footerprefix, watermarktext, defaultFont) {
        await this.getPdfFonts();
        return {
            content: [],
            images: this.iconsObj,
            styles: await this.getStyles(),
            header: await this.getHeaderSection(),
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
            watermark: watermarktext,
            pageSize: { width: 700, height: 850 },
            defaultStyle: {
                font: defaultFont
            }
        };
    }


    /**
     * 08/10/2018 Zohaib Khan
     * getting base64 from thumbnail if exist otherwise generating it from actual image
     */
    getBase64Attachment() {
        let promise = [];
        let promiseIcon = [];
        let icons: any = {};
        let iconType;
        return new Promise((resolve, reject) => {
            if (this.attachmentList.length != 0) {
                //08/08/2018 Zohaib Khan: Generating base64 from thumbnails folder if attachment is image and updating the base64 in the same array. Earlier it was base64 of larger image.
                for (let i = 0; i < this.attachmentList.length; i++) {
                    if (this.attachmentList[i].contentType.indexOf('image') > -1) {
                        if (this.attachmentList[i].isThumbnailCreated) {
                            promise.push(this.utilityProvider.getBase64(cordova.file.dataDirectory + "/taskfiles/" + this.valueProvider.getTaskId() + "/thumbnails/", "thumb_" + this.attachmentList[i].filename));
                        } else {
                            promise.push(this.utilityProvider.getBase64(cordova.file.dataDirectory + "/taskfiles/" + this.valueProvider.getTaskId() + "/", this.attachmentList[i].filename));
                        }
                    } else {
                        //08/23/2018 Zohaib Khan: Make base64 code of icons dynamically from AppDirectory rather then getting them from valueservice
                        let supportedTypes = ["pdf", "xlsx", "txt", "ppt", "doc", "docx", "xls", "pptx"];
                        if (supportedTypes.indexOf(this.attachmentList[i].filetype) > -1) {
                            //08/23/2018 Zohaib Khan: Removing x from extention i:e xlsx so it will give us xls. This is for using same icon for both xlsx and xls similarly for other icons as well.
                            if (this.attachmentList[i].filetype.endsWith("x")) {
                                this.attachmentList[i].filetype = this.attachmentList[i].filetype.substring(0, this.attachmentList[i].filetype.length - 1);
                            }
                            iconType = this.attachmentList[i].filetype;
                        } else {
                            iconType = "unknown";
                        }
                        //08/25/2018 Zohaib Khan: if perticular type is not there than make base64 for that icon.
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
                        //08/25/2018 Zohaib Khan: Update iconsObj for super image `according to docDefination
                        for (let j = 0; j < iconResult.length; j++) {
                            let key = Object.keys(iconResult[j])[0];
                            this.iconsObj[key] = iconResult[j][key];
                        }
                        //08/10/2018 Zohaib Khan: Updating attachmentList with base64 of thumbnails.
                        for (let i = 0; i < this.attachmentList.length; i++) {
                            this.attachmentList[i].base64 = imageResult[i];
                        }
                        resolve(true);
                    }).catch((err: any) => {
                        this.logger.log(this.fileName, 'getBase64Attachment', 'Error in all : ' + JSON.stringify(err));
                    });
                }).catch((err: any) => {
                    this.logger.log(this.fileName, 'getBase64Attachment', 'Error in all Promise : ' + JSON.stringify(err));
                });
            } else {
                resolve(false);
            }
        });
    }


    getBase64DetailedNotesAttachment() {
        let promise = [];
        let promiseIcon = [];
        let icons: any = {};
        let iconType;
        return new Promise((resolve, reject) => {
            if (this.detailedAttachmentData.length != 0) {
                //08/08/2018 Zohaib Khan: Generating base64 from thumbnails folder if attachment is image and updating the base64 in the same array. Earlier it was base64 of larger image.
                for (let i = 0; i < this.detailedAttachmentData.length; i++) {
                    let attachmentName = this.detailedAttachmentData[i].File_Name;
                    let filetype = this.utilityProvider.generateFileNameAndType(attachmentName).Type;
                    if (this.detailedAttachmentData[i].File_Type.indexOf('image') > -1) {
                        if (this.platform.is('ios')) {
                            promise.push(this.utilityProvider.getBase64(cordova.file.dataDirectory + "/detailednotesfiles/" + this.valueProvider.getTaskId() + "/" + this.detailedAttachmentData[i].DNID + "/", this.detailedAttachmentData[i].File_Name));
                        } else {
                            promise.push(this.utilityProvider.getBase64(cordova.file.dataDirectory + "/detailednotesfiles/" + this.valueProvider.getTaskId() + "/" + this.detailedAttachmentData[i].DNID + "/thumbnails/", "thumb_" + this.detailedAttachmentData[i].File_Name));
                        }
                    } else {
                        //08/23/2018 Zohaib Khan: Make base64 code of icons dynamically from AppDirectory rather then getting them from valueservice
                        let supportedTypes = ["pdf", "xlsx", "txt", "ppt", "doc", "docx", "xls", "pptx"];
                        if (supportedTypes.indexOf(filetype) > -1) {
                            //08/23/2018 Zohaib Khan: Removing x from extention i:e xlsx so it will give us xls. This is for using same icon for both xlsx and xls similarly for other icons as well.
                            if (filetype.endsWith("x")) {
                                filetype = filetype.substring(0, filetype.length - 1);
                            }
                            iconType = filetype;
                        } else {
                            iconType = "unknown";
                        }
                        //08/25/2018 Zohaib Khan: if perticular type is not there than make base64 for that icon.
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
                        //08/25/2018 Zohaib Khan: Update iconsObj for super image `according to docDefination
                        for (let j = 0; j < iconResult.length; j++) {
                            let key = Object.keys(iconResult[j])[0];
                            this.iconsObj[key] = iconResult[j][key];
                        }
                        //08/10/2018 Zohaib Khan: Updating attachmentList with base64 of thumbnails.
                        for (let i = 0; i < this.detailedAttachmentData.length; i++) {
                            this.detailedAttachmentData[i].base64 = imageResult[i];
                        }
                        resolve(true);
                    }).catch((err: any) => {
                        this.logger.log(this.fileName, 'getBase64DetailedNotesAttachment', 'Error in all : ' + JSON.stringify(err));
                    });
                }).catch((err: any) => {
                    this.logger.log(this.fileName, 'getBase64DetailedNotesAttachment', 'Error in all Promise : ' + JSON.stringify(err));
                });
            } else {
                resolve(false);
            }
        });
    }

    /**
     * 08/25/2018 Zohaib khan:
     * Getting base64 of icons and setting it to result object
     */
    getIconBase64(type) {
        let path = cordova.file.dataDirectory + "/icons/";
        return new Promise((resolve, reject) => {
            this.utilityProvider.getBase64(path, type + ".png").then((res) => {
                let result: any = {};
                result[type] = res;
                resolve(result);
            }).catch((err: any) => {
                this.logger.log(this.fileName, 'getIconBase64', 'Error in getBase64 : ' + JSON.stringify(err));
            });
        });
    }

    getBoolean() {
        if (String(this.userPreference.FSR_PrintNote) == 'true' || this.userPreference.FSR_PrintNote == true) {
            this.userPreference.FSR_PrintNote = true;
        } else {
            this.userPreference.FSR_PrintNote = false;
        }
        if (String(this.userPreference.FSR_PrintAttachment) == 'true' || this.userPreference.FSR_PrintAttachment == true) {
            this.userPreference.FSR_PrintAttachment = true;
        } else {
            this.userPreference.FSR_PrintAttachment = false;
        }
        if (String(this.userPreference.FSR_PrintTime) == 'true' || this.userPreference.FSR_PrintTime == true) {
            this.userPreference.FSR_PrintTime = true;
        } else {
            this.userPreference.FSR_PrintTime = false;
        }
        if (String(this.userPreference.FSR_PrintExpense) == 'true' || this.userPreference.FSR_PrintExpense == true) {
            this.userPreference.FSR_PrintExpense = true;
        } else {
            this.userPreference.FSR_PrintExpense = false;
        }
        if (String(this.userPreference.FSR_PrintMaterial) == 'true' || this.userPreference.FSR_PrintMaterial == true) {
            this.userPreference.FSR_PrintMaterial = true;
        } else {
            this.userPreference.FSR_PrintMaterial = false;
        }

        if (String(this.userPreference.FSR_PrintEUISO) == 'true' || this.userPreference.FSR_PrintEUISO == true) {
            this.userPreference.FSR_PrintEUISO = true;
        } else {
            this.userPreference.FSR_PrintEUISO = false;
        }

        if (String(this.userPreference.FSR_Disclaimer) == 'true' || this.userPreference.FSR_Disclaimer == true) {
            this.userPreference.FSR_Disclaimer = true;
        } else {
            this.userPreference.FSR_Disclaimer = false;
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
            }
        };
    }

    getTextRow(columns, isStripped) {
        return columns.map(item => {
            return { text: (item ? item.toString() : ""), border: this.noborderstyle, fillColor: (isStripped ? '#CCCCCC' : "") };
        });
    }

    getHeaderRow(columns) {
        return columns.map(item => {
            return { text: (item ? this.translator(item.toString()) : ""), border: this.noborderstyle, bold: true };
        });
    }

    getSpaceAndBorderRow(columns) {
        return columns.map(item => {
            return { text: (item ? this.translator(item.toString()) : ""), border: this.borderstyle, bold: true };
        });
    }
    getSpaceRow(columns) {
        return columns.map(item => {
            return { text: (item ? this.translator(item.toString()) : ""), border: this.noborderstyle, bold: true };
        });
    }

    getImageRow(columns) {
        return columns.map((item: string) => {
            if (item.startsWith('data')) {
                return { image: item, border: this.noborderstyle };
            }
        });
    }

    getHeaderSection() {
        let emersonLogo = 'emerson.png';
        let centerSection = this.translator('Field Service Summary Report') + ' \n ' + this.translator('Field Job') + ' #' + (this.taskObj.Job_Number ? this.taskObj.Job_Number : this.taskObj.Task_Number); //12/06/2018 -- Pratibha -- show job number in fsr in headersection of pdf in case of standalone
        let rightSection = "";
        let headerTable;
        try {
            let addressList = this.getFSRAddress(this.language);
            if (addressList.length == 0) {
                let msg = 'Address Not Found';
                this.utilityProvider.presentToast(msg, 2000, 'top', 'feedbackToast');
            } else {
                let City, State, Country;
                // this.logger.log(this.fileName, 'getHeaderSection', "Address: " + JSON.stringify(addressList));
                let Business_Unit = addressList.Business_Unit ? addressList.Business_Unit : "";
                let Address_Line_1 = addressList.Address_Line_1;
                let Address_Line_2 = addressList.Address_Line_2 ? addressList.Address_Line_2 : "";
                City = addressList.City;
                State = addressList.State ? addressList.State : "";
                if (addressList.Country_Name == 'United States') {
                    Country = addressList.Country;
                }
                else {
                    Country = addressList.Country_Name;
                }
                let Zip_code = addressList.Zip_code;

                let Telephone = addressList.Telephone;
                // let Fax = addressList.Fax ? addressList.Fax : "";
                let Address_Line3 =
                    (City ? (City + ', ') : '') +
                    (State ? (State + ', ') : "") +
                    (Zip_code ? (Zip_code + ', ') : "") +
                    (Country ? Country : "");
                // 05/30/2019 -- Mayur Varshney -- apply check for fax
                rightSection = Business_Unit + ' \n ' + Address_Line_1 + ' \n ' + (Address_Line_2 ? (Address_Line_2 + ' \n ') : "") + Address_Line3 + ' \n ' +
                    this.translator('Tel') + ' :' + Telephone + (addressList.Fax ? ' \n' + this.translator('Fax') + ' :' + addressList.Fax : '');
                //10-04-18 Suraj Gorai - traslation for Tel and Fax key
            }
            headerTable = {
                margin: [12, 10, 12, 20],
                table: {
                    widths: ['25%', '40%', '35%'],
                    body: [[
                        { image: emersonLogo, border: [true, true, false, true], margin: [12, 10, 12, 10], width: 70 },
                        { text: centerSection, border: [false, true, false, true], margin: [12, 10, 12, 10], bold: true, alignment: "center" },
                        // 05/30/2019 -- Mayur Varshney -- reduce height for address
                        { text: rightSection, border: [false, true, true, true], margin: [12, 3, 12, 10], style: 'story' }
                    ]]
                }
            };
        } catch (err) {
            this.logger.log(this.fileName, 'getHeaderSection', "Error in try/catch: " + JSON.stringify(err));
            throw new Error("Error in getHeaderSection: " + err);
        }
        return headerTable;
    }

    getCustomerDetailsSection(contactList) {
        let section = this.getNewSection();
        section.table.body[0][0].push({ text: this.translator('Customer Name'), style: 'subheader', margin: [5, 5, 5, 0] });
        section.table.body[0][0].push({ text: this.taskObj.Customer_Name, style: 'story', margin: [5, 0, 5, 15] });
        section = this.addTableToSection(section, this.getContactTable(contactList));
        section = this.addTableToSection(section, this.getSrTable());
        if ((this.taskObj.IsStandalone == 'false') && (this.userPreference.FSR_PrintInstallBase || this.isTemp)) {
            section = this.addTableToSection(section, this.getInstallBaseTable());
        }
        return section;
    }

    getContactTable(contactList) {
        let table = {
            columns: [],
            margin: [5, 0, 5, 15]
        };
        try {
            if (this.taskObj.IsStandalone == 'false') {
                let contacts = contactList;
                console.log("contacts", contacts);
                //05/10/2019 -- Mayur Varshney -- fixes to show Default contact in FSR
                let fsrContactArr: any = this.sortPipe.transform(contacts, { property: "Default_Value", order: -1 }).slice(0, 2);
                for (let k in fsrContactArr) {
                    let item = fsrContactArr[k];
                    let contactrows = [];
                    let contactPreference = "";
                    if (item.Contacts_Preferences && item.Contacts_Preferences != '') {
                        contactPreference = item.Contacts_Preferences + ' Contact';
                    } else {
                        contactPreference = 'Contact';
                    }
                    contactrows.push({ text: this.translator(contactPreference), style: 'subheader' });
                    let contactItems = "";
                    item.Contact_Name ? (contactItems += item.Contact_Name + ' \n ') : '';
                    item.Office_Phone ? (contactItems += item.Office_Phone + ' \n ') : '';
                    item.Mobile_Phone ? (contactItems += item.Mobile_Phone + ' \n ') : '';

                    item.Email ? (contactItems += item.Email + ' \n ') : '';


                    contactrows.push({ text: contactItems, style: 'story' });
                    table.columns.push(contactrows);
                }
            }
            let rows = [];
            rows.push({ text: this.translator('Address'), style: 'subheader' });
            let addressItems = "";
            addressItems += this.taskObj.Address1 + ' \n ';
            if (this.taskObj.Address2 && this.taskObj.Address2 != '') {
                addressItems += this.taskObj.Address2 + ' \n ';
            }

            // 05/24/2019 -- Mayur Varshney -- apply check of German Country
            if (this.taskObj.Country == "Germany") {
                addressItems += (this.taskObj.Zip_Code ? this.taskObj.Zip_Code : '') + " " + this.taskObj.City + ' \n ';
                addressItems += (this.taskObj.State ? (this.taskObj.State) : '');
            } else {
                addressItems += this.taskObj.City + ' \n ';
                addressItems += (this.taskObj.State ? (this.taskObj.State) : '') + ' ' + (this.taskObj.Zip_Code ? this.taskObj.Zip_Code : '') + ' \n ';
            }

            rows.push({ text: addressItems, style: 'story' });
            table.columns.push(rows);
        } catch (err) {
            this.logger.log(this.fileName, 'getContactTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return table;
    }

    getSrTable() {
        let table = {
            margin: [0, 15, 0, 0],
            widths: [155, 155, 155, 155],
            body: []
        };
        let headerColumns = [];
        let valueKeys = [];

        if (this.taskObj.IsStandalone == 'true') {
            headerColumns = ['Field Job Number'];
            //12/06/2018 -- Pratibha -- show job number in fsr in pdf in case of standalone
            valueKeys = (['Job_Number'] ? ['Job_Number'] : ['Task_Number']);
        } else {
            headerColumns = ['Service Request', 'Field Job Number', 'Job Description', 'Customer PO Number'];
            valueKeys = ['Service_Request', 'Task_Number', 'Temp_Job_Description', 'Customer_PONumber'];
        }

        try {
            let valueArr = [this.valueProvider.getTask()];
            valueArr = valueArr.map((item) => {
                item.Temp_Job_Description = this.translator(item.Job_Description);
                return item;
            });
            let valueColumns = this.getValues(valueArr, valueKeys);

            table.body.push(this.getHeaderRow(headerColumns));
            table.body = table.body.concat(valueColumns);

        } catch (err) {
            this.logger.log(this.fileName, 'getSrTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return { style: 'datatable', table: table };
    }

    getInstallBaseTable() {
        let table = {
            margin: [0, 15, 0, 0],
            widths: [155, 155, 155, 155],
            body: []
        };
        try {
            let headerColumns = ['Item Name', 'Item Description', 'System ID / Serial', 'Tag'];
            let valueKeys = ['Item_Number', 'Description', 'Temp_Serial_Number', 'TagNumber'];
            let valueArr = this.valueProvider.getInstallBase();

            valueArr = valueArr.map((item) => {
                item.Temp_Serial_Number = item.System_ID && item.System_ID != '' ? item.System_ID : item.Serial_Number;
                return item;
            });

            let valueColumns = this.getValues(valueArr, valueKeys);

            table.body.push(this.getHeaderRow(headerColumns));
            table.body = table.body.concat(valueColumns);

        } catch (err) {
            this.logger.log(this.fileName, 'getInstallBaseTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return { style: 'datatable', table: table };
    }

    addTableToSection(section, tableToAdd) {
        section.table.body[0][0].push(tableToAdd);
        return section;
    }
    addNestedTableToSection(section, tableToAdd) {
        section.table.body[0][0].table.body[0][0].push(tableToAdd);
        return section;
    }

    addSignTableToSection(section, tableToAdd) {
        section.table.body[1][0].push(tableToAdd);
        return section;
    }

    getNewSignatureSection() {
        let table = {
            widths: ['*'],
            dontBreakRows: true,
            body: []
        };
        // Added a row in body
        table.body.push([[{ text: this.translator('Signature'), style: 'header' }]]);
        table.body.push([]);
        // Added a column in above row
        table.body[1].push([]);
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

    getNestedNewSection() {
        let table = {
            widths: ['*'],
            body: [

                [
                    {
                        table: {
                            widths: ['*'],
                            body: []
                        },
                    }
                ]
            ]
        };
        // Added a row in body

        // Added a column in above row
        table.body[0][0].table.body.push([]);
        table.body[0][0].table.body[0].push([]);
        return { table: table };
    }

    getNewNoBorderSection() {
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

    getValues(valueArr, keys) {
        let values = valueArr.map((item) => {
            let valueColumns = keys.map(function (key) { return item[key]; });
            return this.getTextRow(valueColumns, false);
        });
        return values;
    }

    // 05-03-2019 -- Mayur Varshney -- add table name for stripped class
    getStripedValues(valueArr, keys, tableName) {
        let values = valueArr.map((item) => {
            let valueColumns = keys.map(function (key) { return item[key]; });
            if (tableName == 'Material') {
                return this.getTextRow(valueColumns, item[0].CurrentMobileId);
            } else {
                return this.getTextRow(valueColumns, item.CurrentMobileId);
            }
        });
        return values;
    }
    //08/23/2018 Zohaib Khan: No need to call below function as base64 code make dynamically from dataDirectory Folder so commented that method.

    // getImage(valueColumn) {
    //     let result = "";
    //     result = valueColumn.base64;
    //     let supportedTypes = ["pdf", "xlsx", "txt", "ppt", "doc", "docx", "xls", "pptx"];
    //     if (supportedTypes.indexOf(valueColumn.filetype) > -1) {
    //         //result = '../../assets/libs/pdfmake/examples/fonts/txt.png';
    //         result = this.valueProvider['get' + valueColumn.filetype + 'img']();
    //     } else {
    //         if (valueColumn.contentType.split("/")[0] == 'image') {
    //             // this.utilityProvider.getBase64(cordova.file.dataDirectory + "/thumbnails", "thumb_" + valueColumn.fileDisc + "." + valueColumn.filetype).then(res => {
    //             // })

    //             //08/10/2018 Zohaib Khan: Setting the thumbnails base64 to result
    //             result = valueColumn.base64;
    //         }
    //         else {
    //             result = this.valueProvider['getunknownimg']();
    //         }
    //     }
    //     return result;
    // }

    getNotesTable() {
        let table = {
            margin: [0, 15, 0, 0],
            widths: [155, 480],
            body: []
        };
        try {
            let headerColumns = ['Note Type', 'Note Description'];
            let valueKeys = ['Temp_Note_Type', 'Notes'];
            let valueArr = this.valueProvider.getNote();
            valueArr = valueArr.map((item) => { item.Temp_Note_Type = item.Note_Type; return item; });
            // 12-03-2018 -- Mansi Arora -- Sort Notes in FSR in Ascending order of creation (The order may differ due to different groups being printed in some particular order)
            valueArr = valueArr.sort(function (a, b) {
                let dateA: any = new Date(a.Date), dateB: any = new Date(b.Date)
                return dateA - dateB //sort by date ascending
            });
            let customerSiteNotes = valueArr.filter((item) => { return item.Temp_Note_Type == 'Customer Site Information' }).map((item, i) => { if (i != 0) item.Temp_Note_Type = ''; return item; });
            let findingsNotes = valueArr.filter((item) => { return item.Temp_Note_Type == 'Findings' }).map((item, i) => { if (i != 0) item.Temp_Note_Type = ''; return item; });
            let actionTakenNotes = valueArr.filter((item) => { return item.Temp_Note_Type == 'Action Taken' }).map((item, i) => { if (i != 0) item.Temp_Note_Type = ''; return item; });
            let others = valueArr.filter((item) => { return (item.Temp_Note_Type != 'Customer Site Information' && item.Temp_Note_Type != 'Findings' && item.Temp_Note_Type != 'Action Taken' && item.Temp_Note_Type != '') });
            let groupedItems = [];
            for (let k in others) {
                let other = others[k];
                let currentNoteTypeIndex;
                let currentNoteType = groupedItems.filter((item, i) => {
                    if (item.Temp_Note_Type == other.Temp_Note_Type) {
                        currentNoteTypeIndex = i;
                        return true;
                    }
                    return false;
                });
                // 05-28-2019 -- Mayur Varshney -- apply check if others are IB , print ItemNumber and Serial Number with notes
                if (currentNoteType.length == 0) {
                    // 11/05/2019 -- Mayur Varshney -- apply condition of System_ID to show System_ID contact with notes in FSR
                    if (other.System_ID) {
                        groupedItems.push({ Temp_Note_Type: other.Temp_Note_Type, Notes: (other.Note_Type == 'Installed Base' ? other.System_ID + ":\n" + other.Notes : other.Notes) });
                    } else if (other.Item_Number || other.Serial_Number) {
                        groupedItems.push({ Temp_Note_Type: other.Temp_Note_Type, Notes: (other.Note_Type == 'Installed Base' ? other.Item_Number + " " + other.Serial_Number + ":\n" + other.Notes : other.Notes) });
                    } else {
                        groupedItems.push({ Temp_Note_Type: other.Temp_Note_Type, Notes: (other.Note_Type == 'Installed Base' ? other.Notes.split(":")[0] + ":\n" + other.Notes.split(":")[1] : other.Notes) });
                    }
                    console.log(groupedItems);
                } else {
                    // 11/05/2019 -- Mayur Varshney -- apply condition of System_ID to show System_ID contact with notes in FSR
                    if (other.System_ID) {
                        groupedItems[currentNoteTypeIndex].Notes = groupedItems[currentNoteTypeIndex].Notes + "\n\n" + (other.Note_Type == 'Installed Base' ? other.System_ID + ":\n" + other.Notes : other.Notes);
                    } else if (other.Item_Number || other.Serial_Number) {
                        groupedItems[currentNoteTypeIndex].Notes = groupedItems[currentNoteTypeIndex].Notes + "\n\n" + (other.Note_Type == 'Installed Base' ? other.Item_Number + " " + other.Serial_Number + ":\n" + other.Notes : other.Notes);
                    } else {
                        groupedItems[currentNoteTypeIndex].Notes = groupedItems[currentNoteTypeIndex].Notes + "\n\n" + (other.Note_Type == 'Installed Base' ? other.Notes.split(":")[0] + ":\n" + other.Notes.split(":")[1] : other.Notes);
                    }
                    console.log(groupedItems);
                }
            }
            valueArr = customerSiteNotes.concat(findingsNotes).concat(actionTakenNotes).concat(groupedItems);

            valueArr = valueArr.map((item) => { item.Temp_Note_Type = this.translator(item.Temp_Note_Type); return item; });
            let valueColumns = this.getValues(valueArr, valueKeys);

            table.body.push(this.getHeaderRow(headerColumns));
            table.body = table.body.concat(valueColumns);
        } catch (err) {
            this.logger.log(this.fileName, 'getNotesTable', "Error in tyr/catch: " + JSON.stringify(err));
        }
        return { style: 'datatable', table: table };
    }

    removeDuplicates(arr) {
        //arr.filter(item => item.Charge_Method.indexOf(args[0]) !== -1)
        let newArr = [];
        arr.forEach((value, key) => {
            let exists = false;
            newArr.forEach((val2, key) => {
                if (value.filename == val2.filename) { exists = true };
            });
            if (exists == false && value.filename != "") { newArr.push(value); }
        });
        return newArr;
    }

    getAttachmentsTable() {

        let table = {
            margin: [0, 15, 0, 0],
            widths: [],
            dontBreakRows: true,
            body: []
        };
        try {
            let width = (100 / 6).toFixed(2).toString() + "%";
            //  let valueColumns = this.valueProvider.getAttachmentForDisplay();
            //Array.from(new Set(valueColumns.map((itemInArray) => itemInArray.app)))
            // this.logger.log(this.fileName, 'getAttachmentsTable', "valueColumns: " + JSON.stringify(valueColumns));
            let valueColumns = this.removeDuplicates(this.attachmentList);
            //this.logger.log(this.fileName, 'getAttachmentsTable', "valueColumns: " + JSON.stringify(valueColumns));
            if (valueColumns && valueColumns.length > 0) {
                table.widths = [width, width, width, width, width, width];
                for (let k = 0; k < valueColumns.length; k++) {
                    let valueColumn = valueColumns[k];
                    let image = valueColumn.base64;
                    // let desc = valueColumn.filename.length >= 20 ? (valueColumn.filename.split(".")[0].substr(0, 18) + '..') : valueColumn.filename;
                    //08/27/2018 Suraj Gorai: Define height in table and define colums for images
                    //08/27/2018 Suraj Gorai: Define height 'auto' and change image fit to [100, 65]  in table and define colums for images
                    let imageCol: any = {
                        table: {
                            heights: [60, 20],
                            body: [
                                [{ columns: [{ image: image, border: this.noborderstyle, width: 75, height: 80, alignment: 'center' }], margin: [12, 0, 0, 0] }],
                                [{ columns: [{ text: valueColumn.filename, border: this.noborderstyle, width: 100, alignment: 'center' }] }]]
                        }, alignment: 'center', border: this.noborderstyle, layout: 'noBorders'
                    };
                    // Create a new attachment row if there is now row, or, if last row has reached 6 items
                    if (table.body.length == 0 || table.body[table.body.length - 1].length == 6) {
                        table.body.push([]);
                    }
                    // Push a new Image column to the last row
                    table.body[table.body.length - 1].push(imageCol);
                }
                // 28-06-2018 GS: Add remaining blank columns in last row to complete 6 columns in a row.
                while (table.body[table.body.length - 1].length < 6) {
                    let blankCol: any = { text: '', border: this.noborderstyle };
                    table.body[table.body.length - 1].push(blankCol);
                }
            }
            if (table.body.length == 0) {
                table.body.push([]);
            }
        } catch (err) {
            this.logger.log(this.fileName, 'getAttachmentsTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return { style: 'datatable', table: table };
    }

    getDetailedNotesAttachmentsTable(detailedAttachment) {
        let headerTable = {
            table: {
                margin: [0, 15, 0, 0],
                widths: [],
                dontBreakRows: true,
                body: []
            }
        };
        try {
            let width = (100 / 4).toFixed(2).toString() + "%";
            //  let valueColumns = this.valueProvider.getAttachmentForDisplay();
            //Array.from(new Set(valueColumns.map((itemInArray) => itemInArray.app)))
            // this.logger.log(this.fileName, 'getAttachmentsTable', "valueColumns: " + JSON.stringify(valueColumns));
            let valueColumns = detailedAttachment;
            //this.logger.log(this.fileName, 'getAttachmentsTable', "valueColumns: " + JSON.stringify(valueColumns));
            if (valueColumns && valueColumns.length > 0) {
                headerTable.table.widths = [width, width, width, width];
                for (let k = 0; k < valueColumns.length; k++) {
                    let valueColumn = valueColumns[k];
                    let image = valueColumn.base64;
                    // let desc = valueColumn.filename.length >= 20 ? (valueColumn.filename.split(".")[0].substr(0, 18) + '..') : valueColumn.filename;
                    //08/27/2018 Suraj Gorai: Define height in table and define colums for images
                    //08/27/2018 Suraj Gorai: Define height 'auto' and change image fit to [100, 65]  in table and define colums for images
                    let imageCol: any = {
                        table: {
                            heights: [60, 20],
                            body: [
                                [{ columns: [{ image: image, border: this.noborderstyle, width: 140, height: 80, alignment: 'center' }], margin: [12, 0, 0, 0] }],
                                [{ columns: [{ text: valueColumn.File_Name, border: this.noborderstyle, width: 150, alignment: 'center', fontSize: 8 }], margin: [12, 0, 0, 0] }]]
                        }, alignment: 'center', border: this.noborderstyle, layout: 'noBorders'
                    };
                    // Create a new attachment row if there is now row, or, if last row has reached 4 items
                    if (headerTable.table.body.length == 0 || headerTable.table.body[headerTable.table.body.length - 1].length == 4) {
                        headerTable.table.body.push([]);
                    }
                    // Push a new Image column to the last row
                    headerTable.table.body[headerTable.table.body.length - 1].push(imageCol);
                }
                // 28-06-2018 GS: Add remaining blank columns in last row to complete 4 columns in a row.
                while (headerTable.table.body[headerTable.table.body.length - 1].length < 4) {
                    let blankCol: any = { text: '', border: this.noborderstyle };
                    headerTable.table.body[headerTable.table.body.length - 1].push(blankCol);
                }
            }
            if (headerTable.table.body.length == 0) {
                headerTable.table.body.push([]);
            }
        } catch (err) {
            this.logger.log(this.fileName, 'getDetailedNotesAttachmentsTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return headerTable;
    }


    getTimeTable() {
        let table = {
            margin: [0, 15, 0, 0],
            widths: [],
            body: []
        };
        try {
            let headerColumns = [];
            let valueKeys = [];
            if (this.valueProvider.getUser().ClarityID) {
                if (this.userPreference.FSR_PrintChargeMethod) {
                    headerColumns = ['Start Date Time', 'End Date Time', 'Duration', 'Work Type', 'Item', 'Charge Method', 'Charge Type', 'Overtime Code', 'Shift Code', 'Comments'];
                    valueKeys = ['Temp_Service_Start_Date', 'Temp_Service_End_Date', 'Duration', 'Temp_Work_Type', 'Temp_Item', 'Temp_Charge_Method', 'Temp_Charge_Type', 'Time_Code', 'Shift_Code', 'Comments'];
                    table.widths = [85, 85, 40, 50, 45, 50, 45, 45, 45, 65];
                } else {
                    headerColumns = ['Start Date Time', 'End Date Time', 'Duration', 'Work Type', 'Item', 'Charge Type', 'Overtime Code', 'Shift Code', 'Comments'];
                    valueKeys = ['Temp_Service_Start_Date', 'Temp_Service_End_Date', 'Duration', 'Temp_Work_Type', 'Temp_Item', 'Temp_Charge_Type', 'Time_Code', 'Shift_Code', 'Comments'];
                    table.widths = [85, 85, 40, 50, 75, 55, 45, 45, 65];
                }
                //END
            } else {
                if (this.userPreference.FSR_PrintChargeMethod) {
                    headerColumns = ['Start Date Time', 'End Date Time', 'Duration', 'Work Type', 'Item', 'Charge Method', 'Comments'];
                    valueKeys = ['Temp_Service_Start_Date', 'Temp_Service_End_Date', 'Duration', 'Temp_Work_Type', 'Temp_Item', 'Temp_Charge_Method', 'Comments'];
                    table.widths = [90, 90, 50, 60, 70, 75, 105];
                } else {
                    headerColumns = ['Start Date Time', 'End Date Time', 'Duration', 'Work Type', 'Item', 'Comments'];
                    valueKeys = ['Temp_Service_Start_Date', 'Temp_Service_End_Date', 'Duration', 'Temp_Work_Type', 'Temp_Item', 'Comments'];
                    table.widths = [90, 90, 50, 90, 100, 105];
                }
            }
            let valueArr: any = [];

            //03/14/2019 -- Zohaib Khan -- If ShowNonBillableEntries is uncheck then remove break entries from Onsite and Final FSR
            if (String(this.userPreference.ShowNonBillableEntries) == "true") {
                valueArr = this.valueProvider.getTimeForDisplay().filter((item) => {
                    return item.Job_Type != 'vacation'
                });
            } else {
                valueArr = this.valueProvider.getTimeForDisplay().filter(item => {
                    return item.Work_Type != "Break" && item.Job_Type != 'vacation';
                });
            }
            valueArr = valueArr.map((item) => {
                //08062018 KW START added Service_Start_Date and time in time table
                (item.Service_Start_Date && item.Service_Start_Date != 'Sub Total' && item.Service_Start_Date != 'Grand Total') ? (item.EntryDate ? (item.Temp_Service_Start_Date = moment(item.EntryDate).format("DD-MMM-YYYY") + ' ' + item.Start_Time) : (item.Temp_Service_Start_Date = moment(item.Service_Start_Date).format("DD-MMM-YYYY HH:mm"))) : item.Temp_Service_Start_Date = this.translator(item.Service_Start_Date);
                //END
                item.Temp_Charge_Method = this.translator(item.Charge_Method);

                //08062018 KW START added Service_End_Date and time in time table
                (item.Service_Start_Date && item.Service_Start_Date != 'Sub Total' && item.Service_Start_Date != 'Grand Total') ? (item.EntryDate ? ((item.End_Time == "00:00") ? (item.Temp_Service_End_Date = moment(item.EntryDate).add(1, 'day').format("DD-MMM-YYYY") + ' ' + item.End_Time) : (item.Temp_Service_End_Date = moment(item.EntryDate).format("DD-MMM-YYYY") + ' ' + item.End_Time)) : (item.Temp_Service_End_Date = moment(item.Service_End_Date).format("DD-MMM-YYYY HH:mm"))) : item.Temp_Service_End_Date = '';
                //END
                item.Temp_Item = this.translator(item.Item);
                item.Temp_Charge_Type = this.translator(item.Charge_Type);
                item.Temp_Work_Type = this.translator(item.Work_Type);
                return item;
            });
            let valueColumns = this.getValues(valueArr, valueKeys);

            table.body.push(this.getHeaderRow(headerColumns));
            table.body = table.body.concat(valueColumns);
        } catch (err) {
            this.logger.log(this.fileName, 'getTimeTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return { style: 'datatable', table: table };
    }

    getExpenseTable() {
        let table = {
            margin: [0, 15, 0, 0],
            widths: [],
            body: []
        };
        try {
            let headerColumns = [];
            let valueKeys = [];
            if (this.userPreference.FSR_PrintChargeMethod) {
                headerColumns = ['Date', 'Expense Type', 'Currency', 'Amount', 'Distance', 'UOM', 'Charge Method', 'Justification'];
                valueKeys = ['Temp_Date', 'Temp_Expense_Type', 'Temp_Currency', 'Amount', 'Distance', 'UOM', 'Temp_Charge_Method', 'Justification'];
                table.widths = [60, 90, 50, 150, 40, 30, 70, 100];
            } else {
                headerColumns = ['Date', 'Expense Type', 'Currency', 'Amount', 'Distance', 'UOM', 'Justification'];
                valueKeys = ['Temp_Date', 'Temp_Expense_Type', 'Temp_Currency', 'Amount', 'Distance', 'UOM', 'Justification'];
                table.widths = [60, 90, 50, 150, 40, 70, 100];
            }
            let valueArr = this.valueProvider.getExpenseForDisplay().filter((item) => {
                return item.IsAdditional == 'false' && !item.Original
            }).sort((a, b) => {
                if (new Date(a.Date) < new Date(b.Date))
                    return -1;
                if (new Date(a.Date) > new Date(b.Date))
                    return 1;
                return 0;
            });

            valueArr = valueArr.map((item) => {
                item.Temp_Date = moment(item.Date).format("DD-MMM-YYYY");
                item.Temp_Expense_Type = this.translator(item.Expense_Type);
                item.Temp_Charge_Method = this.translator(item.Charge_Method);
                item.Temp_Currency = this.translator(item.Currency);
                return item;
            });
            let valueColumns = this.getValues(valueArr, valueKeys);
            table.body.push(this.getHeaderRow(headerColumns));
            table.body = table.body.concat(valueColumns);
        } catch (err) {
            this.logger.log(this.fileName, 'getExpenseTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return {
            style: 'datatable',
            table: table
        };
    }

    getMaterialsTable() {
        let table = {
            margin: [0, 15, 0, 0],
            widths: [],
            body: []
        };
        try {
            let headerColumns = [];
            let valueKeys = [];
            if (this.userPreference.FSR_PrintChargeMethod) {
                headerColumns = ['Item Name', 'Description', 'Quantity', 'UOM', 'Serial In', 'Serial Out', 'Charge Method'];
                valueKeys = ['Temp_ItemName', 'Description', 'Product_Quantity', 'UOM', 'Serial_In', 'Serial_Out', 'Temp_Charge_Type']
                table.widths = [75, 100, 70, 60, 95, 95, 90];
            } else {
                headerColumns = ['Item Name', 'Description', 'Quantity', 'UOM', 'Serial In', 'Serial Out'];
                valueKeys = ['Temp_ItemName', 'Description', 'Product_Quantity', 'UOM', 'Serial_In', 'Serial_Out']
                table.widths = [75, 100, 70, 60, 120, 105];
            }
            let valueArr = this.valueProvider.getMaterialForDisplay().filter(item => {
                // 04/02/2019 -- Mayur Varshney -- optimize code
                return item.filter((element) => {
                    return element.IsAdditional == 'false' && !element.Original;
                })
            });
            // 10/16/2018 -- Mayur letshney -- Optimise Code
            if (valueArr.length > 0) {
                valueArr = valueArr.map((item) => {
                    item.Serial_Number = "";
                    item.Serial_In = "";
                    item.Serial_Out = "";
                    // 04/02/2019 -- Mayur Varshney -- optimize code
                    item.Temp_Charge_Type = this.translator(item[0].Charge_Type);
                    item.Temp_ItemName = this.translator(item[0].ItemName);
                    item.Description = item[0].Description;
                    item.Product_Quantity = item.length;
                    item.UOM = item[0].UOM;
                    item.forEach(element => {
                        if (element.Serial_In || element.Serial_Out) {
                            item.Serial_In += element.Serial_In ? element.Serial_In + '\n\n' : '\n\n';
                            item.Serial_Out += element.Serial_Out ? element.Serial_Out + '\n\n' : '\n\n';
                        }
                    });
                    return item;
                });
            }
            //  valueArr = valueArr.map((item) => { item.Temp_Charge_Type = this.translator(item.Charge_Type); return item; });
            // valueArr = valueArr.map((item) => { item.Temp_ItemName = this.translator(item.ItemName); return item; });
            //let valueArr = tempValueArr.map((item) => {
            //    item.Serial_Number = item.Serial_Number ? item.Serial_Number.replace(/,/g, ' \n ') : '';
            //    item.Serial_In = item.Serial_In ? item.Serial_In.replace(/,/g, ' \n ') : '';
            //    item.Serial_Out = item.Serial_Out ? item.Serial_Out.replace(/,/g, ' \n ') : '';

            //    return item;
            //});

            let valueColumns = this.getValues(valueArr, valueKeys);
            table.body.push(this.getHeaderRow(headerColumns));
            table.body = table.body.concat(valueColumns);
        } catch (err) {
            this.logger.log(this.fileName, 'getMaterialsTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return {
            style: 'datatable',
            table: table
        };
    }

    /*
      * 07/25/2018 Zohaib Khan
      * Added getDisclaimerSection() to get the disclaimer message in FSR.
    */
    getDisclaimerSection() {
        let translatedText = this.translator('Estimated travel time for return trip. Actual time may be corrected upon arrival. This allows for any delays such as gates, guards, or traffic.');
        return {
            style: 'datatable',
            text: translatedText
        };
    }
    getSpace() {
        return {
            style: 'datatable',
            text: ' '
        };
    }

    getBeforeSignOffText() {
        let signOffContent = {
            table: {
                border: this.noborderstyle,
                widths: ['100%'],
                body: [
                    { text: this.translator("Customer Signed Off Time From Above"), border: [false, false, false, false], alignment: 'left', fontSize: 10, bold: true },
                ]
            }
        };
        return signOffContent;
    }

    getAfterSignOffText() {
        let signOffContent = {
            table: {
                border: this.noborderstyle,
                widths: ['40%', '20%', '40%'],
                body: [[
                    { text: this.translator("Data Entered After Customer Sign Off"), border: [false, false, false, false], alignment: 'left', fontSize: 10, bold: true },
                    { text: " ", border: [false, false, false, false], bold: true, alignment: "center" },
                    { text: this.translator("White Row – Updated Entry or Unchanged Existing Entry"), border: [true, true, true, false], fontSize: 8 }
                ], [
                    { text: " ", border: [false, false, false, false], alignment: 'left', fontSize: 10, },
                    { text: " ", border: [false, false, false, false], bold: true, alignment: "center" },
                    { text: this.translator('Gray Row – Old Entry'), border: [true, false, true, true], fontSize: 8, fillColor: "#CCCCCC" }
                ]]
            }
        };
        return signOffContent
    }

    getSignatureTable() {
        let table = {
            margin: [0, 15, 0, 0],
            dontBreakRows: true,
            widths: [],
            body: []
        };
        try {
            let headerColumns = [];
            // let valueKeys = [];
            let datarow = [];
            let footer = [];
            // let signatureArr = [];
            let engineer = this.valueProvider.getEngineer();
            let customer = this.valueProvider.getCustomer();
            headerColumns = ['EMERSON', this.taskObj.Customer_Name];
            //11/29/2018 -- Mansi Arora -- Show Job responsibility under Customer name
            //12/05/2018 -- Mansi Arora -- Rename Customer name to Customer Representative
            datarow = [[this.translator('Service Representative') + ': ' + this.valueProvider.getUser().Name, this.translator('Customer Representative') + ': ' + (customer && customer.Customer_Name ? customer.Customer_Name : '')], ['', this.translator('Job Responsibility') + ': ' + (customer && customer.Job_responsibilty ? customer.Job_responsibilty : '')]];

            let imageCol: any = [{
                image: engineer.Sign_File_Path,
                border: this.noborderstyle,
                width: 300
            },
            {
                border: this.noborderstyle,
                width: 300
            }];
            //if (!customer.isCustomerSignChecked) {
            //10/26/2018 -- Mayur letshney -- apply check on the basis of string parameter
            if (customer.isCustomerSignChecked.toString() === 'false') {
                imageCol[1].image = customer.Cust_Sign_File;
            } else {
                imageCol[1].text = '';
            }

            let Engg_Sign_Time = this.valueProvider.getFormattedTime(engineer.Engg_Sign_Time);
            let Cust_Sign_Time = this.valueProvider.getFormattedTime(customer.Cust_Sign_Time);

            this.logger.log(this.fileName, 'getSignatureTable', "Engg_Sign_Time: " + Engg_Sign_Time + " Cust_Sign_Time: " + Cust_Sign_Time);

            footer = [Engg_Sign_Time, Cust_Sign_Time ? Cust_Sign_Time : ''];
            table.widths = ['*', '*'];

            table.body.push(this.getHeaderRow(headerColumns));

            //11/29/2018 -- Mansi Arora -- Show Job responsibility under Customer name added data row in the array, so traversing the same to concat rows
            datarow.forEach(element => {
                table.body = table.body.concat([this.getTextRow(element, false)]);
            });
            table.body.push(imageCol);
            table.body = table.body.concat([this.getTextRow(footer, false)]);
        } catch (err) {
            this.logger.log(this.fileName, 'getSignatureTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return {
            style: 'story',
            table: table
        };
    }


    getEUISOTable() {

        let table = { columns: [] };
        try {
            // let widths = [];

            // let headerColumns = [];
            let customer = this.valueProvider.getCustomer();
            //11/13/2018 kamal : convert customer string values into boolean
            customer.SSE_Rules = (customer.SSE_Rules == 'true' || customer.SSE_Rules == true) ? true : false;
            customer.Safety_Rules = (customer.Safety_Rules == 'true' || customer.Safety_Rules == true) ? true : false;
            customer.Annuel_PdP = (customer.Annuel_PdP == 'true' || customer.Annuel_PdP == true) ? true : false;
            customer.Specific_PdP = (customer.Specific_PdP == 'true' || customer.Specific_PdP == true) ? true : false;
            customer.Working_license = (customer.Working_license == 'true' || customer.Working_license == true) ? true : false;
            customer.Emerson_Safety = (customer.Emerson_Safety == 'true' || customer.Emerson_Safety == true) ? true : false;
            customer.Home_Security = (customer.Home_Security == 'true' || customer.Home_Security == true) ? true : false;

            let Oui_SSE_Rules_CheckBox = this.getCheckboxFlag('Oui', customer.SSE_Rules);
            let Non_SSE_Rules_CheckBox = this.getCheckboxFlag('Non', !customer.SSE_Rules);
            let Oui_Safety_Rules_CheckBox = this.getCheckboxFlag('Oui', customer.Safety_Rules);
            let Non_Safety_Rules_CheckBox = this.getCheckboxFlag('Non', !customer.Safety_Rules);
            let Pdp_Annuel_PdP_CheckBox = this.getCheckboxFlag('PdP Annuel et/ou', customer.Annuel_PdP);
            let Pdp_Specific_PdP_CheckBox = this.getCheckboxFlag('PdP spécifique', customer.Specific_PdP);
            let Permis_Working_license_CheckBox = this.getCheckboxFlag('Permis de Travail', customer.Working_license);
            let Fiche_Emerson_Safety_CheckBox = this.getCheckboxFlag('Fiche Sécurité Emerson', customer.Emerson_Safety);
            let Oui_Home_Security_CheckBox = this.getCheckboxFlag('Oui', customer.Home_Security);
            let Non_Home_Security_CheckBox = this.getCheckboxFlag('Non', !customer.Home_Security)

            //    let headerColumns = ['EU-ISO'];
            //     let widths = ['*'];
            let rows = [];
            rows.push({ text: 'Le représentant de l\' EU certifie que l\'intervenant a réalisé les opérations conformément' + ' \n ', style: 'story' });

            let leftinnerTable = {
                margin: [40, 0, 10, 0],
                table: {
                    widths: ['50%', '30%', '20%'],
                    body: [
                        // [{ ul: ['aux règles SSE'], style: 'story' }, { text: (customer.SSE_Rules ? ' Oui' : 'Non'), style: 'story' }],
                        // [{ ul: ['aux règles de sécurité de '], style: 'story' }, { text: (customer.Safety_Rules ? ' Oui' : 'Non'), style: 'story' }]]

                        [{ ul: ['aux règles SSE'], style: 'story' }, Oui_SSE_Rules_CheckBox, Non_SSE_Rules_CheckBox],
                        [{ ul: ['aux règles de sécurité de l\'information en vigueur sur le site de l\'EU.'], style: 'story' }, Oui_Safety_Rules_CheckBox, Non_Safety_Rules_CheckBox]
                    ]
                },
                layout: 'noBorders'
            };
            rows.push(leftinnerTable);
            rows.push(
                {
                    table: {
                        widths: ['90%'],
                        body: [
                            [{ text: 'Remarques : ' + customer.Remarks + ' \n ', style: 'story' }]
                        ]
                    },
                    layout: 'noBorders'
                }
            )
            table.columns.push(rows);
            //table.columns.push(leftinnerTable);
            rows = [];

            rows.push({ text: 'Type Analyse de Risque  ' + ' \n ', style: 'story' });


            let rightinnerTable = {
                margin: [12, 2, 0, 0],
                table: {
                    body: [
                        // [{ text: 'PdP Annuel et/ou  ' + (customer.Annuel_PdP ? ' Oui' : 'Non') + '       PdP spécifique ' + (customer.Specific_PdP ? ' Oui' : 'Non'), style: 'story' }],
                        // [{ text: 'Permis de Travail  ' + (customer.Working_license ? ' Oui' : 'Non'), style: 'story' }],
                        // [{ text: 'Fiche Sécurité Emerson' + (customer.Emerson_Safety ? ' Oui' : 'Non'), style: 'story' }]

                        [Pdp_Annuel_PdP_CheckBox, Pdp_Specific_PdP_CheckBox],
                        [Permis_Working_license_CheckBox, { text: '' }],
                        [Fiche_Emerson_Safety_CheckBox, { text: '' }]

                    ]
                },
                layout: 'noBorders'
            };
            rows.push(rightinnerTable);
            // rows.push({ text: 'Accueil Sécurité Site' + (customer.Home_Security ? ' Oui' : 'Non') + ' \n ', style: 'story' }, );


            rows.push(
                {
                    table: {
                        body: [
                            [{ text: 'Accueil Sécurité Site', style: 'story' }, Oui_Home_Security_CheckBox, Non_Home_Security_CheckBox]
                        ]
                    },
                    layout: 'noBorders'
                });
            table.columns.push(rows);
        } catch (err) {
            this.logger.log(this.fileName, 'getEUISOTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return table;

    }

    getCheckboxFlag(text, flag) {
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
                ]]
            }
        };
    }

    getFooterSection(currentPage, pageCount) {
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
                            text: this.translator('Page') + ' ' + currentPage + ' ' + this.translator('Of') + ' ' + pageCount,
                        }
                    ],
                    alignment: 'center'
                }
            ]
        };
    }

    translator(text) {
        return this.translate[text] ? this.translate[text] : text;
    }

    getaddresses() {
        return new Promise((resolve, reject) => {
            this.localService.getCountryNames().then((res: any[]) => {
                this.allAddressesCountry = res;
                resolve(res);
            }).catch((err: any) => {
                this.logger.log(this.fileName, 'getaddresses', "Error in getCountryNames: " + JSON.stringify(err));
                resolve([]);
            });
        });
    }

    getFSRAddress(language) {
        // this.logger.log(this.fileName, "getFSRAddress", "allAddressesCountry: " + JSON.stringify(this.allAddressesCountry));
        let addressId;
        let address = [];

        if (language == 'zh-cn' && this.userPreference.AddressIdCh != '') {
            addressId = this.userPreference.AddressIdCh;
        } else {
            addressId = this.userPreference.AddressId;
        }
        // this.logger.log(this.fileName, "getFSRAddress", "addressId: " + addressId);
        // Get Address on basis of above selected Address in user preference Else gets the default address of Customer Country
        address = this.allAddressesCountry.filter((item) => {
            return (addressId && addressId != '') ? item.AddressId == parseInt(addressId) : (item.Country_Name == this.taskObj.Country && item.IsDefault && item.IsDefault.toString() == "true" && item.isEnabled && item.isEnabled.toString() == "true");
        });
        // this.logger.log(this.fileName, "getFSRAddress", "address1: " + JSON.stringify(address));

        // Get Address on basis of above selected Address in user preference Else gets the default address of Customer Country
        if (address.length == 0) {
            address = this.allAddressesCountry.filter((item) => {
                if (language == 'zh-cn') {
                    return item.Country_Name == this.taskObj.Country && item.IsDefault && item.IsDefault.toString() == "true" && item.isEnabled && item.isEnabled.toString() == "true" && item.Language == 'zh-cn';
                }
                return item.Country_Name == this.taskObj.Country && item.IsDefault && item.IsDefault.toString() == "true" && item.isEnabled && item.isEnabled.toString() == "true";
            });
        }
        // this.logger.log(this.fileName, "getFSRAddress", "address: " + JSON.stringify(address));

        // Show Default address of United Kingdom and Language English (UK)
        if (address.length == 0) {
            address = this.allAddressesCountry.filter((item) => {
                return item.Country_Code == "GB" && item.Language == "en-gb" && item.IsDefault && item.IsDefault.toString() == "true" && item.isEnabled && item.isEnabled.toString() == "true";
            });
        }
        // Show First Default address of United Kingdom (irrespective of language)
        if (address.length == 0) {
            address = this.allAddressesCountry.filter((item) => {
                return item.Country_Code == "GB" && item.IsDefault && item.IsDefault.toString() == "true" && item.isEnabled && item.isEnabled.toString() == "true";
            });
        }

        // this.logger.log(this.fileName, "getFSRAddress", "address to print: " + JSON.stringify(address));

        return address.length == 0 ? [] : address[0];
    }


    findSymbolForClass(selector) {
        let result = '';
        let sheets = document.styleSheets;

        for (let sheetNr = 0; sheetNr < sheets.length; sheetNr++) {
            let content = this.findCSSRuleContent(sheets[sheetNr], selector);

            if (content) {
                result = this.stripQuotes(content);
                break;
            }
        }
        return result;
    };

    findCSSRuleContent(mySheet, selector) {
        let ruleContent = '';
        let rules = mySheet.cssRules ? mySheet.cssRules : mySheet.rules;

        for (let i = 0; i < rules.length; i++) {
            let text = rules[i].selectorText;
            if (text && text.indexOf(selector) >= 0) {
                ruleContent = rules[i].style.content;
                break;
            }
        }

        return ruleContent;
    }

    stripQuotes(string) {
        let len = string.length;
        return string.slice(1, len - 1);
    }

    getAttachmentIcons() {
        return new Promise((resolve, reject) => {
            let promiseArr = [];
            //08/08/2018 Zohaib Khan: Generating base64 from thumbnails folder if attachment is image and updating the base64 in the same array. Earlier it was base64 of larger image.
            let filePath;
            let fileName;
            for (let i = 0; i < this.attachmentList.length; i++) {
                if (this.attachmentList[i].contentType.indexOf('image') > -1) {
                    filePath = cordova.file.dataDirectory + "/thumbnails";
                    fileName = "thumb_" + this.attachmentList[i].fileDisc + "." + this.attachmentList[i].filetype;
                } else {
                    filePath = cordova.file.applicationDirectory + "/www/assets/i18n";
                    fileName = this.getIconName(this.attachmentList[i].contentType);
                }
                promiseArr.push(this.utilityProvider.getBase64(filePath, fileName));
            }
            Promise.all(promiseArr).then().catch((err: any) => {
                this.logger.log(this.fileName, 'getAttachmentIcons', 'Error in all : ' + JSON.stringify(err));
            });
        });
    }

    getIconName(contentType) {
        let result;
        let supportedTypes = ["pdf", "xlsx", "txt", "ppt", "doc", "docx", "xls", "pptx"];
        if (supportedTypes.indexOf(contentType) > -1) {
            result = contentType + ".png";
        } else {
            result = "unknown.png";
        }
        return result;
    }
    /**
     * 09/14/2018 Zohaib Khan:
     * Creating base64 of static icons and saving them in icons object.
     */
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
            }).catch((err: any) => {
                this.logger.log(this.fileName, 'getstaticIcons', 'Error in all : ' + JSON.stringify(err));
            });
        });
    }

    getModifiedExpenseTable() {
        let finalData = [];
        let table = {
            margin: [0, 15, 0, 0],
            widths: [],
            body: []
        };
        try {
            let headerColumns = [];
            let valueKeys = [];
            let emptyRow = [];
            //07/25/2018 Zohaib Khan Added Distance and UOM in headerColumn and in valueKeys to show the value of Distance and UOM in both FSR.

            if (this.userPreference.FSR_PrintChargeMethod) {
                headerColumns = ['Date', 'Expense Type', 'Currency', 'Amount', 'Distance', 'UOM', 'Charge Method', 'Justification'];
                valueKeys = ['Temp_Date', 'Temp_Expense_Type', 'Temp_Currency', 'Amount', 'Distance', 'UOM', 'Temp_Charge_Method', 'Justification'];
                emptyRow = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
                table.widths = [60, 90, 50, 150, 40, 30, 70, 100];
            } else {
                headerColumns = ['Date', 'Expense Type', 'Currency', 'Amount', 'Distance', 'UOM', 'Justification'];
                valueKeys = ['Temp_Date', 'Temp_Expense_Type', 'Temp_Currency', 'Amount', 'Distance', 'UOM', 'Justification'];
                emptyRow = [' ', ' ', ' ', ' ', ' ', ' ', ' '];
                table.widths = [60, 90, 50, 150, 40, 70, 100];
            }

            //table.widths = [65, 90, 60, 50, 80, 245];
            //09/25/2018: Zohaib Khan getting expense data with IsAdditional=='true' && IsOriginal=='false'.
            let valueArr = this.valueProvider.getSortedModifiedExpense();
            //01/01/2019 kamal: blank array check
            if (valueArr.length > 0) {
                valueArr = valueArr.map((item) => {
                    if (item.Date == "Total") {
                        item.Temp_Date = this.translator(item.Date);
                    } else {
                        item.Temp_Date = moment(item.Date).format("DD-MMM-YYYY");
                    }
                    item.Temp_Expense_Type = this.translator(item.Expense_Type);
                    item.Temp_Charge_Method = this.translator(item.Charge_Method);
                    item.Temp_Currency = this.translator(item.Currency);
                    return item;
                });
            }
            // 05-03-2019 -- Mayur Varshney -- add table name for stripped class
            let valueColumns = this.getStripedValues(valueArr, valueKeys, 'Expense');
            for (let i = 0; i < valueColumns.length; i++) {
                finalData.push(valueColumns[i]);
                if (valueColumns[i][7].fillColor && i != valueColumns.length - 1) {
                    finalData.push(this.getSpaceAndBorderRow(emptyRow));
                }
            }
            // finalData.push(this.getSpaceRow(emptyRow));
            table.body.push(this.getHeaderRow(headerColumns));
            table.body = table.body.concat(finalData);
        } catch (err) {
            this.logger.log(this.fileName, 'getExpenseTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return {
            style: 'datatable',
            table: table
        };
    }

    getAdditionalExpenseTable() {
        let table = {
            margin: [0, 15, 0, 0],
            widths: [],
            body: []
        };
        try {
            let headerColumns = [];
            let valueKeys = [];
            if (this.userPreference.FSR_PrintChargeMethod) {
                headerColumns = ['Date', 'Expense Type', 'Currency', 'Amount', 'Distance', 'UOM', 'Charge Method', 'Justification'];
                valueKeys = ['Temp_Date', 'Temp_Expense_Type', 'Temp_Currency', 'Amount', 'Distance', 'UOM', 'Temp_Charge_Method', 'Justification'];
                table.widths = [60, 90, 50, 150, 40, 30, 70, 100];
            } else {
                headerColumns = ['Date', 'Expense Type', 'Currency', 'Amount', 'Distance', 'UOM', 'Justification'];
                valueKeys = ['Temp_Date', 'Temp_Expense_Type', 'Temp_Currency', 'Amount', 'Distance', 'UOM', 'Justification'];
                table.widths = [60, 90, 50, 150, 40, 70, 100];
            }

            let valueArr = this.valueProvider.getadditionalExpense();
            if (valueArr.length > 0) {
                valueArr = valueArr.map((item) => {
                    if (item.Date == "Total") {
                        item.Temp_Date = this.translator(item.Date);
                    } else {
                        item.Temp_Date = moment(item.Date).format("DD-MMM-YYYY");
                    }
                    // item.Temp_Date = moment(item.Date).format("DD-MMM-YYYY");
                    item.Temp_Expense_Type = this.translator(item.Expense_Type);
                    item.Temp_Charge_Method = this.translator(item.Charge_Method);
                    item.Temp_Currency = this.translator(item.Currency);
                    return item;
                });
            }
            // 05-03-2019 -- Mayur Varshney -- add table name for stripped class
            let valueColumns = this.getStripedValues(valueArr, valueKeys, 'Expense');
            table.body.push(this.getHeaderRow(headerColumns));
            table.body = table.body.concat(valueColumns);
        } catch (err) {
            this.logger.log(this.fileName, 'getExpenseTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return {
            style: 'datatable',
            table: table
        };
    }

    getPostSigExpenseTable() {
        let table = {
            margin: [0, 15, 0, 0],
            widths: [],
            body: []
        };
        try {
            let headerColumns = [];
            let valueKeys = [];
            //07/25/2018 Zohaib Khan Added Distance and UOM in headerColumn and in valueKeys to show the value of Distance and UOM in both FSR.
            if (this.userPreference.FSR_PrintChargeMethod) {
                headerColumns = ['Date', 'Expense Type', 'Currency', 'Amount', 'Distance', 'UOM', 'Charge Method', 'Justification'];
                valueKeys = ['Temp_Date', 'Temp_Expense_Type', 'Temp_Currency', 'Amount', 'Distance', 'UOM', 'Temp_Charge_Method', 'Justification'];
                table.widths = [60, 90, 50, 150, 40, 30, 70, 100];
            } else {
                headerColumns = ['Date', 'Expense Type', 'Currency', 'Amount', 'Distance', 'UOM', 'Justification'];
                valueKeys = ['Temp_Date', 'Temp_Expense_Type', 'Temp_Currency', 'Amount', 'Distance', 'UOM', 'Justification'];
                table.widths = [60, 90, 50, 150, 40, 70, 100];
            }

            //table.widths = [65, 90, 60, 50, 80, 245];
            //09/25/2018: Zohaib Khan getting expense data with IsAdditional=='true' && IsOriginal=='false'.
            let valueArr = this.valueProvider.getPostSigExpense();
            let SortedArr: any = [];
            //01/01/2019 kamal: blank array check
            if (valueArr.length > 0) {
                let nonMileageArr = [];
                nonMileageArr = valueArr.filter(item => { return item.Expense_Type != "Mileage" && item.Expense_Type != '' }).sort((a, b) => {
                    if (new Date(a.Date) < new Date(b.Date))
                        return -1;
                    if (new Date(a.Date) > new Date(b.Date))
                        return 1;
                    return 0;
                });
                let mileageArr = [];
                mileageArr = valueArr.filter(item => { return item.Expense_Type == "Mileage" }).sort((a, b) => {
                    if (new Date(a.Date) < new Date(b.Date))
                        return -1;
                    if (new Date(a.Date) > new Date(b.Date))
                        return 1;
                    return 0;
                });
                SortedArr = nonMileageArr.concat(mileageArr);
                let totalArr = valueArr.filter(item => { return item.Date == "Total" });
                SortedArr.push(totalArr[0]);
                SortedArr = SortedArr.map((item) => {
                    if (item.Date == "Total") {
                        item.Temp_Date = this.translator(item.Date);
                    } else {
                        item.Temp_Date = moment(item.Date.toString()).format("DD-MMM-YYYY");
                    }
                    // item.Temp_Date = moment(item.Date).format("DD-MMM-YYYY");
                    item.Temp_Expense_Type = this.translator(item.Expense_Type);
                    item.Temp_Charge_Method = this.translator(item.Charge_Method);
                    item.Temp_Currency = this.translator(item.Currency);
                    return item;
                });
            }

            // let SortedArr = valueArr.filter(item => { return item.Date != "Total" }).sort((a, b) => {
            //     if (new Date(a.Date) < new Date(b.Date))
            //         return -1;
            //     if (new Date(a.Date) > new Date(b.Date))
            //         return 1;
            //     return 0;
            // });

            // 05-03-2019 -- Mayur Varshney -- add table name for stripped class
            let valueColumns = this.getStripedValues(SortedArr, valueKeys, 'Expense');
            table.body.push(this.getHeaderRow(headerColumns));
            table.body = table.body.concat(valueColumns);
        } catch (err) {
            this.logger.log(this.fileName, 'getExpenseTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return {
            style: 'datatable',
            table: table
        };
    }

    getModifiedTimeTable() {
        let emptyRow;
        let finalData = [];
        let table = {
            margin: [0, 15, 0, 0],
            widths: [],
            body: []
        };
        let valueArr: any = [];

        try {
            let headerColumns = [];
            let valueKeys = [];
            if (this.valueProvider.getUser().ClarityID) {
                if (this.userPreference.FSR_PrintChargeMethod) {
                    headerColumns = ['Start Date Time', 'End Date Time', 'Duration', 'Work Type', 'Item', 'Charge Method', 'Charge Type', 'Overtime Code', 'Shift Code', 'Comments'];
                    valueKeys = ['Temp_Service_Start_Date', 'Temp_Service_End_Date', 'Duration', 'Temp_Work_Type', 'Temp_Item', 'Temp_Charge_Method', 'Temp_Charge_Type', 'Time_Code', 'Shift_Code', 'Comments'];
                    emptyRow = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
                    table.widths = [85, 85, 40, 50, 45, 50, 45, 45, 45, 65];
                } else {
                    headerColumns = ['Start Date Time', 'End Date Time', 'Duration', 'Work Type', 'Item', 'Charge Type', 'Overtime Code', 'Shift Code', 'Comments'];
                    valueKeys = ['Temp_Service_Start_Date', 'Temp_Service_End_Date', 'Duration', 'Temp_Work_Type', 'Temp_Item', 'Temp_Charge_Type', 'Time_Code', 'Shift_Code', 'Comments'];
                    emptyRow = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
                    table.widths = [85, 85, 40, 50, 65, 65, 45, 45, 65];
                }


            } else {
                if (this.userPreference.FSR_PrintChargeMethod) {
                    headerColumns = ['Start Date Time', 'End Date Time', 'Duration', 'Work Type', 'Item', 'Charge Method', 'Comments'];
                    emptyRow = [' ', ' ', ' ', ' ', ' ', ' ', ' '];
                    valueKeys = ['Temp_Service_Start_Date', 'Temp_Service_End_Date', 'Duration', 'Temp_Work_Type', 'Temp_Item', 'Temp_Charge_Method', 'Comments'];
                    table.widths = ['*', '*', '*', '*', '*', '*', 140];
                } else {
                    headerColumns = ['Start Date Time', 'End Date Time', 'Duration', 'Work Type', 'Item', 'Comments'];
                    emptyRow = [' ', ' ', ' ', ' ', ' ', ' '];
                    valueKeys = ['Temp_Service_Start_Date', 'Temp_Service_End_Date', 'Duration', 'Temp_Work_Type', 'Temp_Item', 'Comments'];
                    table.widths = ['*', '*', '*', '*', '*', 140];
                }
            }
            // if (String(this.userPreference.ShowNonBillableEntries) == "true") {

            // } else {
            //     valueArr = this.valueProvider.getSortedModifiedTime().filter(item => {
            //         return item.Work_Type != "Break";
            //     });
            // }
            valueArr = this.valueProvider.getSortedModifiedTime().filter((item) => {
                return item.Job_Type != 'vacation'
            });
            valueArr = valueArr.map((item) => {
                //  08062018 KW START added Service_Start_Date and time in time table
                (item.Service_Start_Date && item.Service_Start_Date != 'Sub Total' && item.Service_Start_Date != 'Grand Total') ? (item.EntryDate ? (item.Temp_Service_Start_Date = moment(item.EntryDate).format("DD-MMM-YYYY") + ' ' + item.Start_Time) : (item.Temp_Service_Start_Date = moment(item.Service_Start_Date).format("DD-MMM-YYYY HH:mm"))) : item.Temp_Service_Start_Date = this.translator(item.Service_Start_Date);
                //END
                item.Temp_Charge_Method = this.translator(item.Charge_Method);
                //08062018 KW START added Service_End_Date and time in time table
                (item.Service_Start_Date && item.Service_Start_Date != 'Sub Total' && item.Service_Start_Date != 'Grand Total') ? (item.EntryDate ? ((item.End_Time == "00:00") ? (item.Temp_Service_End_Date = moment(item.EntryDate).add(1, 'day').format("DD-MMM-YYYY") + ' ' + item.End_Time) : (item.Temp_Service_End_Date = moment(item.EntryDate).format("DD-MMM-YYYY") + ' ' + item.End_Time)) : (item.Temp_Service_End_Date = moment(item.Service_End_Date).format("DD-MMM-YYYY HH:mm"))) : item.Temp_Service_End_Date = '';
                //END
                item.Temp_Item = this.translator(item.Item);
                item.Temp_Charge_Type = this.translator(item.Charge_Type);
                item.Temp_Work_Type = this.translator(item.Work_Type);
                return item;
            });
            // 05-03-2019 -- Mayur Varshney -- add table name for stripped class
            let valueColumns = this.getStripedValues(valueArr, valueKeys, 'Time');
            table.body.push(this.getHeaderRow(headerColumns));
            for (let i = 0; i < valueColumns.length; i++) {
                if (this.valueProvider.getUser().ClarityID) {
                    finalData.push(valueColumns[i]);
                    if (valueColumns[i][8].fillColor && i != valueColumns.length - 1) {
                        finalData.push(this.getSpaceAndBorderRow(emptyRow));
                    }

                } else {
                    finalData.push(valueColumns[i]);
                    if (valueColumns[i][5].fillColor && i != valueColumns.length - 1) {
                        finalData.push(this.getSpaceAndBorderRow(emptyRow));
                    }
                }
            }
            finalData.push(this.getSpaceRow(emptyRow));
            table.body = table.body.concat(finalData);
        } catch (err) {
            this.logger.log(this.fileName, 'getTimeTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return {
            style: 'datatable',
            table: table
        }
    }

    getAdditionalTimeTable() {
        let table = {
            margin: [0, 15, 0, 0],
            widths: [],
            body: []
        };
        let valueArr: any = [];

        try {
            let headerColumns = [];
            let valueKeys = [];
            if (this.valueProvider.getUser().ClarityID) {
                if (this.userPreference.FSR_PrintChargeMethod) {
                    headerColumns = ['Start Date Time', 'End Date Time', 'Duration', 'Work Type', 'Item', 'Charge Method', 'Charge Type', 'Overtime Code', 'Shift Code', 'Comments'];
                    valueKeys = ['Temp_Service_Start_Date', 'Temp_Service_End_Date', 'Duration', 'Temp_Work_Type', 'Temp_Item', 'Temp_Charge_Method', 'Temp_Charge_Type', 'Time_Code', 'Shift_Code', 'Comments'];
                    table.widths = [85, 85, 40, 50, 45, 50, 45, 45, 45, 65];
                } else {
                    headerColumns = ['Start Date Time', 'End Date Time', 'Duration', 'Work Type', 'Item', 'Charge Type', 'Overtime Code', 'Shift Code', 'Comments'];
                    valueKeys = ['Temp_Service_Start_Date', 'Temp_Service_End_Date', 'Duration', 'Temp_Work_Type', 'Temp_Item', 'Temp_Charge_Type', 'Time_Code', 'Shift_Code', 'Comments'];
                    table.widths = [85, 85, 40, 70, 65, 45, 45, 45, 65];
                }
            } else {
                if (this.userPreference.FSR_PrintChargeMethod) {
                    headerColumns = ['Start Date Time', 'End Date Time', 'Duration', 'Work Type', 'Item', 'Charge Method', 'Comments'];
                    valueKeys = ['Temp_Service_Start_Date', 'Temp_Service_End_Date', 'Duration', 'Temp_Work_Type', 'Temp_Item', 'Temp_Charge_Method', 'Comments'];
                    table.widths = [90, 90, 50, 60, 70, 75, 105];
                } else {
                    headerColumns = ['Start Date Time', 'End Date Time', 'Duration', 'Work Type', 'Item', 'Comments'];
                    valueKeys = ['Temp_Service_Start_Date', 'Temp_Service_End_Date', 'Duration', 'Temp_Work_Type', 'Temp_Item', 'Comments'];
                    table.widths = [90, 90, 50, 100, 100, 105];
                }
            }
            // if (String(this.userPreference.ShowNonBillableEntries) == "true") {
            //     valueArr = this.valueProvider.getadditionalTime();
            // } else {
            //     valueArr = this.valueProvider.getadditionalTime().filter(item => {
            //         return item.Work_Type != "Break";
            //     });
            // }
            valueArr = this.valueProvider.getadditionalTime().filter((item) => {
                return item.Job_Type != 'vacation'
            });
            valueArr = valueArr.map((item) => {
                //  08062018 KW START added Service_Start_Date and time in time table
                (item.Service_Start_Date && item.Service_Start_Date != 'Sub Total' && item.Service_Start_Date != 'Grand Total') ? (item.EntryDate ? (item.Temp_Service_Start_Date = moment(item.EntryDate).format("DD-MMM-YYYY") + ' ' + item.Start_Time) : (item.Temp_Service_Start_Date = moment(item.Service_Start_Date).format("DD-MMM-YYYY HH:mm"))) : item.Temp_Service_Start_Date = this.translator(item.Service_Start_Date);
                //END
                item.Temp_Charge_Method = this.translator(item.Charge_Method);
                
                //08062018 KW START added Service_End_Date and time in time table
                (item.Service_Start_Date && item.Service_Start_Date != 'Sub Total' && item.Service_Start_Date != 'Grand Total') ? (item.EntryDate ? ((item.End_Time == "00:00") ? (item.Temp_Service_End_Date = moment(item.EntryDate).add(1, 'day').format("DD-MMM-YYYY") + ' ' + item.End_Time) : (item.Temp_Service_End_Date = moment(item.EntryDate).format("DD-MMM-YYYY") + ' ' + item.End_Time)) : (item.Temp_Service_End_Date = moment(item.Service_End_Date).format("DD-MMM-YYYY HH:mm"))) : item.Temp_Service_End_Date = '';
                //END
                item.Temp_Item = this.translator(item.Item);
                item.Temp_Charge_Type = this.translator(item.Charge_Type);
                item.Temp_Work_Type = this.translator(item.Work_Type);
                return item;
            });
            // 05-03-2019 -- Mayur Varshney -- add table name for stripped class
            let valueColumns = this.getStripedValues(valueArr, valueKeys, 'Time');
            table.body.push(this.getHeaderRow(headerColumns));
            table.body = table.body.concat(valueColumns);
        } catch (err) {
            this.logger.log(this.fileName, 'getTimeTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return {
            style: 'datatable',
            table: table
        }

    }

    getGrandTotalFromTimeTables() {
        let table = {
            margin: [0, 15, 0, 0],
            widths: [],
            body: []
        };
        let additionalTimeArr: any = [];
        let customerSignedTimeArr: any = [];
        let overAllTimeArr: any = [];

        try {
            let additionalTimeColumns = [];
            let customerSignedTimeColumns = [];
            let grandTimeColumns = [];
            let valueKeys = [];
            additionalTimeColumns = ['Additional Time Totals', ' '];
            customerSignedTimeColumns = ['Customer Signed Time Totals', ' '];
            grandTimeColumns = ['Overall Grand Time Totals', ' '];
            let emptyRow = [' ', ' '];
            valueKeys = ['Temp_Service_Start_Date', 'Temp_Work_Type', 'Duration'];
            table.widths = [150, 40];
            if (this.valueProvider.getSortedModifiedTime().length > 0) {
                customerSignedTimeArr = Object.assign([], this.valueProvider.getSortedModifiedTimeWithoutBreak()).filter((item: any) => {
                    return item.Service_Start_Date == "Sub Total" || item.Service_Start_Date == "Grand Total";
                });
                customerSignedTimeArr = JSON.parse(JSON.stringify(customerSignedTimeArr));

            } else {
                customerSignedTimeArr = JSON.parse(JSON.stringify(this.valueProvider.getTimeForDisplayWithoutBreak())).filter((item: any) => {
                    return item.Service_Start_Date == "Sub Total" || item.Service_Start_Date == "Grand Total";
                });
                customerSignedTimeArr = JSON.parse(JSON.stringify(customerSignedTimeArr));
            }
            customerSignedTimeArr.map(item => {
                item.Temp_Service_Start_Date = item.Service_Start_Date;
                if (item.Temp_Service_Start_Date != "Grand Total") {
                    item.Work_Type = item.Work_Type ? item.Work_Type : "No Value";
                }
                item.Temp_Work_Type = item.Work_Type;
            });
            if (customerSignedTimeArr.length > 0) {
                // 05-03-2019 -- Mayur Varshney -- add table name for stripped class
                let customerSignedValueColumn = this.getStripedValues(customerSignedTimeArr, valueKeys, 'Time');
                for (let i = 0; i < customerSignedValueColumn.length; i++) {
                    customerSignedValueColumn[i][0].text = this.translator(customerSignedValueColumn[i][0].text + " " + customerSignedValueColumn[i][1].text);
                    customerSignedValueColumn[i].splice(1, 1);
                }
                customerSignedValueColumn[customerSignedValueColumn.length - 2][0].border = this.borderstyle;
                customerSignedValueColumn[customerSignedValueColumn.length - 2][1].border = this.borderstyle;

                customerSignedValueColumn[customerSignedValueColumn.length - 1][0].bold = true;
                customerSignedValueColumn[customerSignedValueColumn.length - 1][1].bold = true;
                customerSignedValueColumn[customerSignedValueColumn.length - 1][0].text = this.translator('Customer Signed Time Total');
                customerSignedValueColumn.push(this.getSpaceRow(emptyRow));

                table.body.push(this.getHeaderRow(customerSignedTimeColumns));
                table.body = table.body.concat(customerSignedValueColumn);
            }

            additionalTimeArr = Object.assign([], this.valueProvider.getadditionalTimeWithoutBreak()).filter((item: any) => {
                return item.Service_Start_Date == "Sub Total" || item.Service_Start_Date == "Grand Total";
            });
            additionalTimeArr = JSON.parse(JSON.stringify(additionalTimeArr));
            additionalTimeArr.map(item => {
                item.Temp_Service_Start_Date = item.Service_Start_Date;
                if (item.Temp_Service_Start_Date != "Grand Total") {
                    item.Work_Type = item.Work_Type ? item.Work_Type : "No Value";
                }
                item.Temp_Work_Type = item.Work_Type;
            });
            if (additionalTimeArr.length > 0) {
                // 05-03-2019 -- Mayur Varshney -- add table name for stripped class
                let additionalValueColumns = this.getStripedValues(additionalTimeArr, valueKeys, 'Time');
                for (let i = 0; i < additionalValueColumns.length; i++) {
                    additionalValueColumns[i][0].text = this.translator(additionalValueColumns[i][0].text + " " + additionalValueColumns[i][1].text);
                    additionalValueColumns[i].splice(1, 1);
                }
                additionalValueColumns[additionalValueColumns.length - 2][0].border = this.borderstyle;
                additionalValueColumns[additionalValueColumns.length - 2][1].border = this.borderstyle;

                additionalValueColumns[additionalValueColumns.length - 1][0].bold = true;
                additionalValueColumns[additionalValueColumns.length - 1][1].bold = true;
                additionalValueColumns[additionalValueColumns.length - 1][0].text = this.translator('Additional Time Total');
                additionalValueColumns.push(this.getSpaceRow(emptyRow));

                table.body.push(this.getHeaderRow(additionalTimeColumns));
                table.body = table.body.concat(additionalValueColumns);
            }
            for (let i = 0; i < customerSignedTimeArr.length; i++) {
                if (customerSignedTimeArr[i].Service_Start_Date != "Grand Total") {
                    var temp = customerSignedTimeArr[i].Temp_Work_Type;
                }
                for (let j = 0; j < additionalTimeArr.length; j++) {

                    if ((additionalTimeArr[j].Temp_Work_Type == temp) && additionalTimeArr[j].Work_Type != '') {
                        customerSignedTimeArr[i].Duration = this.calculateDuration(customerSignedTimeArr[i].Duration, additionalTimeArr[j].Duration);
                        overAllTimeArr.push(customerSignedTimeArr[i]);
                    }
                }
            }
            let unmatchedFromcustomerSignedTimeArr = this.findUnMatchedObjects(customerSignedTimeArr, additionalTimeArr);
            let unMatchedFromadditionalTimeArr = this.findUnMatchedObjects(additionalTimeArr, customerSignedTimeArr);

            if (unmatchedFromcustomerSignedTimeArr.length > 0) {
                for (let i = 0; i < unmatchedFromcustomerSignedTimeArr.length; i++) {
                    //17/01/2019 kamal : remove break work type
                    // if (unmatchedFromcustomerSignedTimeArr[i].Work_Type != 'Break') {
                    overAllTimeArr.push(unmatchedFromcustomerSignedTimeArr[i]);
                    // }
                }
            }
            if (unMatchedFromadditionalTimeArr.length > 0) {
                for (let i = 0; i < unMatchedFromadditionalTimeArr.length; i++) {
                    //17/01/2019 kamal : remove break work type
                    //  if (unMatchedFromadditionalTimeArr[i].Work_Type != 'Break') {
                    overAllTimeArr.push(unMatchedFromadditionalTimeArr[i]);
                    //  }
                }
            }

            for (let i = 0; i < overAllTimeArr.length; i++) {
                if (overAllTimeArr[i].Service_Start_Date == "Grand Total") {
                    overAllTimeArr.splice(i, 1);
                }
            }
            // for (let i = 0; i < overAllTimeArr.length; i++) {
            //     //17/01/2019 kamal : remove break work type
            //     if (overAllTimeArr[i].Work_Type == 'Break') {
            //         overAllTimeArr.splice(i, 1);
            //     }
            // }

            // 05-03-2019 -- Mayur Varshney -- add table name for stripped class
            let overAllValueColumns = this.getStripedValues(overAllTimeArr, valueKeys, 'Time');
            // 12/03/2018 kamal: check if time entry exists
            if (overAllValueColumns.length > 0) {
                for (let i = 0; i < overAllValueColumns.length; i++) {
                    let overAllTypeTotal = "Overall " + overAllValueColumns[i][1].text + " Total";
                    overAllValueColumns[i][0].text = this.translator(overAllTypeTotal);
                    overAllValueColumns[i].splice(1, 1);
                    overAllValueColumns[i][0].bold = true;
                    overAllValueColumns[i][1].bold = true;
                }
                overAllValueColumns[overAllValueColumns.length - 1][0].border = this.borderstyle;
                overAllValueColumns[overAllValueColumns.length - 1][1].border = this.borderstyle;
            }
            table.body = table.body.concat(overAllValueColumns);
            let grandDuration = this.getHeaderRow(grandTimeColumns);
            grandDuration[1].text = this.calculateTime(overAllTimeArr);
            table.body.push(grandDuration);
        } catch (err) {
            this.logger.log(this.fileName, 'getGrandTotalFromTimeTables', "Error in try/catch: " + JSON.stringify(err));
        }
        return {
            style: 'datatable',
            table: table
        }

    }

    findUnMatchedObjects(array1, array2) {
        let filtered = array1.filter(item => {
            return !array2.some(item1 => {
                return item.Temp_Work_Type === item1.Temp_Work_Type;
            })
        });
        return filtered;
    }

    getModifiedMaterialsTable() {
        let finalData = [];
        let table = {
            margin: [0, 15, 0, 0],
            widths: [],
            body: []
        };
        try {
            let headerColumns = [];
            let valueKeys = [];
            let emptyRow = []
            if (this.userPreference.FSR_PrintChargeMethod) {
                headerColumns = ['Item Name', 'Description', 'Quantity', 'UOM', 'Serial In', 'Serial Out', 'Charge Method'];
                valueKeys = ['Temp_ItemName', 'Description', 'Product_Quantity', 'UOM', 'Serial_In', 'Serial_Out', 'Temp_Charge_Type']
                emptyRow = [' ', ' ', ' ', ' ', ' ', ' ', ' '];
                table.widths = [75, 100, 70, 60, 95, 95, 90];
            } else {
                headerColumns = ['Item Name', 'Description', 'Quantity', 'UOM', 'Serial In', 'Serial Out'];
                valueKeys = ['Temp_ItemName', 'Description', 'Product_Quantity', 'UOM', 'Serial_In', 'Serial_Out']
                emptyRow = [' ', ' ', ' ', ' ', ' ', ' '];
                table.widths = [75, 100, 70, 60, 120, 145];
            }


            let valueArr = this.valueProvider.getSortedModifiedMaterial();
            if (valueArr == undefined) {
                valueArr = [];
            }

            valueArr = valueArr.map((item) => {
                item.Serial_Number = "";
                item.Serial_In = "";
                item.Serial_Out = "";
                // 04/02/2019 -- Mayur Varshney -- optimize code
                item.Temp_Charge_Type = this.translator(item[0].Charge_Type);
                item.Temp_ItemName = this.translator(item[0].ItemName);
                item.Description = item[0].Description;
                item.Product_Quantity = item.length;
                item.UOM = item[0].UOM;
                item.forEach(element => {
                    if (element.Serial_In || element.Serial_Out) {
                        item.Serial_In += element.Serial_In ? element.Serial_In + '\n\n' : '\n\n';
                        item.Serial_Out += element.Serial_Out ? element.Serial_Out + '\n\n' : '\n\n';
                    }
                });
                return item;
            });
            //let valueArr = tempValueArr.map((item) => {
            //    item.Serial_Number = item.Serial_Number ? item.Serial_Number.replace(/,/g, ' \n ') : '';
            //    item.Serial_In = item.Serial_In ? item.Serial_In.replace(/,/g, ' \n ') : '';
            //    item.Serial_Out = item.Serial_Out ? item.Serial_Out.replace(/,/g, ' \n ') : '';

            //    return item;
            //});

            // 05-03-2019 -- Mayur Varshney -- add table name for stripped class
            let valueColumns = this.getStripedValues(valueArr, valueKeys, 'Material');
            for (let i = 0; i < valueColumns.length; i++) {
                finalData.push(valueColumns[i]);
                if (valueColumns[i][6].fillColor && i != valueColumns.length - 1) {
                    finalData.push(this.getSpaceAndBorderRow(emptyRow));
                }
            }
            finalData.push(this.getSpaceRow(emptyRow));
            table.body.push(this.getHeaderRow(headerColumns));
            table.body = table.body.concat(finalData);
        } catch (err) {
            this.logger.log(this.fileName, 'getModifiedMaterialsTable', "Error in try/catch: " + err);
        }
        return {
            style: 'datatable',
            table: table
        };
    }

    getAdditionalMaterialsTable() {
        let table = {
            margin: [0, 15, 0, 0],
            widths: [],
            body: []
        };
        try {
            let headerColumns = [];
            let valueKeys = [];
            if (this.userPreference.FSR_PrintChargeMethod) {
                headerColumns = ['Item Name', 'Description', 'Quantity', 'UOM', 'Serial In', 'Serial Out', 'Charge Method'];
                valueKeys = ['Temp_ItemName', 'Description', 'Product_Quantity', 'UOM', 'Serial_In', 'Serial_Out', 'Temp_Charge_Type']
                table.widths = [75, 100, 70, 60, 95, 95, 90];
            } else {
                headerColumns = ['Item Name', 'Description', 'Quantity', 'UOM', 'Serial In', 'Serial Out'];
                valueKeys = ['Temp_ItemName', 'Description', 'Product_Quantity', 'UOM', 'Serial_In', 'Serial_Out']
                table.widths = [75, 100, 70, 60, 120, 145];
            }
            let valueArr = this.valueProvider.getAdditionalMaterial();
            if (valueArr == undefined) {
                valueArr = [];
            }

            valueArr = valueArr.map((item) => {
                item.Serial_Number = "";
                item.Serial_In = "";
                item.Serial_Out = "";
                // 04/02/2019 -- Mayur Varshney -- optimize code
                item.Temp_Charge_Type = this.translator(item[0].Charge_Type);
                item.Temp_ItemName = this.translator(item[0].ItemName);
                item.Description = item[0].Description;
                item.Product_Quantity = item.length;
                item.UOM = item[0].UOM;
                item.forEach(element => {
                    if (element.Serial_In || element.Serial_Out) {
                        item.Serial_In += element.Serial_In ? element.Serial_In + '\n\n' : '\n\n';
                        item.Serial_Out += element.Serial_Out ? element.Serial_Out + '\n\n' : '\n\n';
                    }
                });
                return item;
            });

            //let valueArr = tempValueArr.map((item) => {
            //    item.Serial_Number = item.Serial_Number ? item.Serial_Number.replace(/,/g, ' \n ') : '';
            //    item.Serial_In = item.Serial_In ? item.Serial_In.replace(/,/g, ' \n ') : '';
            //    item.Serial_Out = item.Serial_Out ? item.Serial_Out.replace(/,/g, ' \n ') : '';

            //    return item;
            //});

            // 05-03-2019 -- Mayur Varshney -- add table name for stripped class
            let valueColumns = this.getStripedValues(valueArr, valueKeys, 'Material');
            table.body.push(this.getHeaderRow(headerColumns));
            table.body = table.body.concat(valueColumns);
        } catch (err) {
            this.logger.log(this.fileName, 'getMaterialsTable', "Error in try/catch: " + JSON.stringify(err));
        }
        return {
            style: 'datatable',
            table: table
        };
    }
    // calculateDuration(dur1, dur2) {
    //     let Dur1Hour = parseInt(dur1.split(':')[0]);
    //     let Dur1Min = parseInt(dur1.split(':')[1]);
    //     let Dur2Hour = parseInt(dur2.split(':')[0]);
    //     let Dur2Min = parseInt(dur2.split(':')[1]);
    //     let totalDurHour = Dur1Hour + Dur2Hour;
    //     let totalDurMin = Dur1Min + Dur2Min;
    //     totalDurHour += Math.floor(totalDurMin / 60);
    //     let remainder = totalDurMin % 60;
    //     if (totalDurMin > 60) {
    //         totalDurMin = remainder;
    //     }
    //     let duration = totalDurHour + ":" + totalDurMin;

    //     return this.formatDuration(duration);
    // }


    calculateDuration(dur1, dur2) {
        let duration;
        let Dur1Hour = parseInt(dur1.split(':')[0]);
        let Dur1Min = parseInt(dur1.split(':')[1]);
        let Dur2Hour = parseInt(dur2.split(':')[0]);
        let Dur2Min = parseInt(dur2.split(':')[1]);
        let totalDurHour = Dur1Hour + Dur2Hour;
        let totalDurMin = Dur1Min + Dur2Min;

        //08/01/2019 kamal: calculate time
        let hoursToMin = totalDurHour * 60;
        let totalTimeInMin = hoursToMin + totalDurMin;
        let updateHours = Math.floor(Math.abs(totalTimeInMin / 60));
        let updateMin = Math.floor(totalTimeInMin % 60);

        if (updateHours <= 9) {
            duration = ('0' + updateHours).slice(-2) + ":" + ('0' + +updateMin).slice(-2);
        }
        else {
            duration = updateHours + ":" + ('0' + +updateMin).slice(-2);
        }

        return this.formatDuration(duration);
    }

    calculateTime(grandTimeArr) {
        let durHour = 0;
        let durMin = 0;
        let duration;
        for (let i = 0; i < grandTimeArr.length; i++) {
            //10/01/2019 kamal : calculate total time without break entries
            if (grandTimeArr[i].Work_Type != 'Break') {
                durHour = durHour + parseInt(grandTimeArr[i].Duration.split(':')[0]);
                durMin = durMin + parseInt(grandTimeArr[i].Duration.split(':')[1]);
            }
        }

        //08/01/2019 kamal: calculate time
        let hoursToMin = durHour * 60;
        let totalTimeInMin = hoursToMin + durMin;
        let updateHours = Math.floor(Math.abs(totalTimeInMin / 60));
        let updateMin = Math.floor(totalTimeInMin % 60);

        if (updateHours <= 9) {
            duration = ('0' + updateHours).slice(-2) + ":" + ('0' + +updateMin).slice(-2);
        }
        else {
            duration = updateHours + ":" + ('0' + +updateMin).slice(-2);
        }
        return this.formatDuration(duration);
    }

    formatDuration(duration) {
        if (duration.split(":")[0].length == 1) {
            let hours = "0" + duration.split(":")[0];
            duration = hours + ":" + duration.split(":")[1];
        }
        if (duration.split(":")[1].length == 1) {
            let mins = "0" + duration.split(":")[1];
            duration = duration.split(":")[0] + ":" + mins;
        }
        return duration;
    }

    getDetailedNotes(docDefinition) {
        let table = { columns: [] };
        // let solutionValue: any = '';

        try {
            let rows = [];

            if (this.detailedNotesData.length > 0) {
                this.detailedNotesData.reverse();
                for (let i = 0; i < this.detailedNotesData.length; i++) {
                    let getTable = this.getAllDetailedNotesTable();
                    let transformedDetailedNotes = this.transformDetailedNotesList(this.detailedNotesData[i]);
                    // getTable.headerTable.table.body.push([this.getDetailedHeading(transformedDetailedNotes[0].Service_Information[1].DisplayName), this.getDetailedHeading(transformedDetailedNotes[0].Service_Information[2].DisplayName)])
                    // getTable.headerTable.table.body.push([this.getDetailedValue(transformedDetailedNotes[0].Service_Information[1].Value), this.getDetailedValue(transformedDetailedNotes[0].Service_Information[2].Value)]);
                    // getTable.headerTable.table.body.push([this.getsummaryHeading(transformedDetailedNotes[0].Service_Information[3].DisplayName)])
                    // getTable.headerTable.table.body.push([this.getsummaryValue(transformedDetailedNotes[0].Service_Information[3].Value)])
                    // rows.push(getTable.headerTable);
                    if (transformedDetailedNotes[0].Summary.Value && transformedDetailedNotes[0].Summary.Value != '') {
                        getTable.summaryTable.table.body.push([this.getDetailedHeading(transformedDetailedNotes[0].Summary.DisplayName)]);
                        getTable.summaryTable.table.body.push([]);
                        getTable.summaryTable.table.body[1].push(this.getHtmlColumn());
                        this.ParseHtml(getTable.summaryTable.table.body[1][0].stack, transformedDetailedNotes[0].Summary.Value);
                        rows.push(getTable.summaryTable);
                    }
                    if (transformedDetailedNotes[0].System_Information.Value && transformedDetailedNotes[0].System_Information.Value != '') {
                        getTable.System_Information.table.body.push([this.getDetailedHeading(transformedDetailedNotes[0].System_Information.DisplayName)]);
                        getTable.System_Information.table.body.push([]);
                        getTable.System_Information.table.body[1].push(this.getHtmlColumn());
                        this.ParseHtml(getTable.System_Information.table.body[1][0].stack, transformedDetailedNotes[0].System_Information.Value);
                        rows.push(getTable.System_Information);
                    }
                    if (transformedDetailedNotes[0].System_Information.attachment.length > 0) {
                        rows.push(this.getDetailedNotesAttachmentsTable(transformedDetailedNotes[0].System_Information.attachment));
                    }

                    if (transformedDetailedNotes[0].Detailed_Notes.Value && transformedDetailedNotes[0].Detailed_Notes.Value != '') {
                        getTable.Detailed_Notes.table.body.push([this.getDetailedHeading(transformedDetailedNotes[0].Detailed_Notes.DisplayName)]);
                        getTable.Detailed_Notes.table.body.push([]);
                        getTable.Detailed_Notes.table.body[1].push(this.getHtmlColumn());
                        this.ParseHtml(getTable.Detailed_Notes.table.body[1][0].stack, transformedDetailedNotes[0].Detailed_Notes.Value);
                        rows.push(getTable.Detailed_Notes);
                    }
                    if (transformedDetailedNotes[0].Detailed_Notes.attachment.length > 0) {
                        rows.push(this.getDetailedNotesAttachmentsTable(transformedDetailedNotes[0].Detailed_Notes.attachment));
                    }

                    if (transformedDetailedNotes[0].Result.Value && transformedDetailedNotes[0].Result.Value != '') {
                        getTable.Result.table.body.push([this.getDetailedHeading(transformedDetailedNotes[0].Result.DisplayName)]);
                        getTable.Result.table.body.push([]);
                        getTable.Result.table.body[1].push(this.getHtmlColumn());
                        this.ParseHtml(getTable.Result.table.body[1][0].stack, transformedDetailedNotes[0].Result.Value);
                        rows.push(getTable.Result);
                    }
                    if (transformedDetailedNotes[0].Result.attachment.length > 0) {
                        rows.push(this.getDetailedNotesAttachmentsTable(transformedDetailedNotes[0].Result.attachment));
                    }

                    if (transformedDetailedNotes[0].Suggestion.Value && transformedDetailedNotes[0].Suggestion.Value != '') {
                        getTable.Suggestion.table.body.push([this.getDetailedHeading(transformedDetailedNotes[0].Suggestion.DisplayName)]);
                        getTable.Suggestion.table.body.push([]);
                        getTable.Suggestion.table.body[1].push(this.getHtmlColumn());
                        this.ParseHtml(getTable.Suggestion.table.body[1][0].stack, transformedDetailedNotes[0].Suggestion.Value);
                        rows.push(getTable.Suggestion);
                    }
                    if (transformedDetailedNotes[0].Suggestion.attachment.length > 0) {
                        rows.push(this.getDetailedNotesAttachmentsTable(transformedDetailedNotes[0].Suggestion.attachment));
                    }
                }
            }
            table.columns.push(rows);
        } catch (err) {
            this.logger.log(this.fileName, 'getSolutionTable', "Error: " + JSON.stringify(err));
        }
        return table;

    }

    getAllDetailedNotesTable() {
        let headerTable = {
            table: {
                widths: ["45%", "45%"],
                body: []
            }
        };
        let summaryTable = {
            table: {
                widths: ["100%"],
                body: []
            }
        };
        let System_Information = {
            table: {
                widths: ["100%"],
                body: []
            }
        };
        let Detailed_Notes = {
            table: {
                widths: ["100%"],
                body: []
            }
        };
        let Result = {
            table: {
                widths: ["100%"],
                body: []
            }
        };
        let Suggestion = {
            table: {
                widths: ["100%"],
                body: []
            }
        };
        return { headerTable: headerTable, summaryTable: summaryTable, System_Information: System_Information, Detailed_Notes: Detailed_Notes, Result: Result, Suggestion: Suggestion }
    }


    transformDetailedNotesList(detailedNotesList) {
        let allAttachment = this.detailedAttachmentData.filter(item => {
            return item.DNID == detailedNotesList.DNID;
        })
        // let serviceInfoObj: any;
        let summary: any;
        let systemInfoObj: any;
        let detailedNotesObj: any;
        let remainingIssuesObj: any;
        let suggestionObj: any;
        let obj: any = [];

        // serviceInfoObj = [{
        //     'DisplayName': 'Report No.',
        //     'Value': detailedNotesList.Report_No,
        // },
        // {
        //     'DisplayName': 'Description One',
        //     'Value': detailedNotesList.Description_One,
        // },
        // {
        //     'DisplayName': 'Description Two',
        //     'Value': detailedNotesList.Description_Two,
        // },
        // {
        //     'DisplayName': 'Summary',
        //     'Value': detailedNotesList.Summary,
        // }];
        // 02-05-2019 -- Mansi Arora -- send key isHtml true in order to detect ckeditor content
        summary = {
            'DisplayName': 'SUMMARY',
            'Value': detailedNotesList.Summary,
            'attachment': [],
            'isHtml': true
        };

        systemInfoObj = {
            'DisplayName': 'SYSTEM INFORMATION',
            'Value': detailedNotesList.System_Info,
            'attachment': allAttachment.filter(item => { return item.Attachment_Type == "SystemInfo" }),
            'isHtml': true
        };
        detailedNotesObj = {
            'DisplayName': 'DETAILED NOTES',
            'Value': detailedNotesList.Detailed_Notes,
            'attachment': allAttachment.filter(item => { return item.Attachment_Type == "DetailedNotes" }),
            'isHtml': true
        };
        remainingIssuesObj = {
            'DisplayName': 'RESULT/REMAINING ISSUE',
            'Value': detailedNotesList.Result,
            'attachment': allAttachment.filter(item => { return item.Attachment_Type == "ResultRemaining" }),
            'isHtml': true
        };
        suggestionObj = {
            'DisplayName': 'SUGGESTION',
            'Value': detailedNotesList.Suggestion,
            'attachment': allAttachment.filter(item => { return item.Attachment_Type == "Suggestion" }),
            'isHtml': true
        };
        obj.push({
            //   'Service_Information': serviceInfoObj,
            'Summary': summary,
            'System_Information': systemInfoObj,
            'Detailed_Notes': detailedNotesObj,
            'Result': remainingIssuesObj,
            'Suggestion': suggestionObj
        });

        return obj
    }

    makeTableJsonForTextArea(element) {
        let body = [], mainArr = [];
        let json: any = {
            "table": {
                "body": []
            },
            layout: 'noBorders'
        };
        json.table.widths = ["100%"];
        json.table.body.push([]);
        json.table.body[0].push(this.getDetailedHeading(element.DisplayName));
        json.table.body.push([]);
        json.table.body[1].push(this.getHtmlColumn());
        this.ParseHtml(json.table.body[1][0].stack, element.Value);
        body.push(json);
        mainArr.push(body);
        return mainArr;
    }
    getHtmlColumn() {
        return { "stack": [], border: this.noborderstyle, margin: [5, 3, 0, 3], fontSize: 9 };
    }

    addBodyToTable(table, body) {
        table.body = body;
        return table;
    }

    getDetailedHeading(value) {
        return { text: (value ? this.translator(value.toString()) : ""), border: this.noborderstyle, bold: true, fontSize: 9 };
    }
    getsummaryHeading(value) {
        return { text: (value ? this.translator(value.toString()) : ""), border: this.noborderstyle, bold: true, fontSize: 9, colSpan: 2 };
    }
    getsummaryValue(value) {
        return { text: (value ? this.translator(value.toString()) : ""), border: this.noborderstyle, fontSize: 9, colSpan: 2 };
    }
    getDetailedValue(value) {
        return { text: (value ? this.translator(value.toString()) : ""), border: this.noborderstyle, fontSize: 9 };
    }

    getSubheaderColumn(value) {
        return { "text": (value ? value : " "), fontSize: '10', border: this.noborderstyle, color: '#234487', style: 'header' };
    }

    getCommentsColumn(value) {
        return { "text": (value ? value : " "), margin: [0, 0, 0, 10], border: this.noborderstyle, fontSize: 9, "style": "comment-text" };
    }

    private ParseHtml(cnt, htmlText) {
        let html = $(htmlText.replace(/\t/g, "").replace(/\n/g, ""));
        let p: any = this.CreateParagraph();
        for (let i = 0; i < html.length; i++) {
            this.ParseElement(cnt, html.get(i), p, []);
        }
    }

    private CreateParagraph() {
        let p: any = { text: [] };
        return p;
    }

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
            // case "img": {
            //     let maxResolution = {
            //         width: 435,
            //         height: 830
            //     },
            //         width = parseInt(e.getAttribute("width")),
            //         height = parseInt(e.getAttribute("height"));
            //     if (width > maxResolution.width) {
            //         let scaleByWidth = maxResolution.width / width;
            //         width *= scaleByWidth;
            //         height *= scaleByWidth;
            //     }
            //     if (height > maxResolution.height) {
            //         let scaleByHeight = maxResolution.height / height;
            //         width *= scaleByHeight;
            //         height *= scaleByHeight;
            //     }
            //     cnt.push({
            //         image: e.getAttribute("src"),
            //         width: width,
            //         alignment: e.getAttribute("alignment")
            //     });
            //     break;
            // }
            case "u": {
                //styles.push("text-decoration:underline");
                this.ParseContainer(cnt, e, p, styles.concat(["text-decoration:underline"]));
                break;
            }
            // 12-12-2019 -- Mayur Varshney -- remove italic functionality
            case "i":
            case "em": {
                //styles.push("font-style:italic");
                this.ParseContainer(cnt, e, p, styles.concat(["font-style:normal"]));
                break;
                //cnt.push({ text: e.innerText, bold: false });
            }
            case "span":
            // 12-24-2019 -- Mayur Varshney -- applied check to support font tag
            case "font": {
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
                            widths: [],
                            body: [],
                        }
                    }
                    // let border = e.getAttribute("border");
                    // let isBorder = true;
                    t['headerText'] = e.getAttribute("headerText");
                    //     if (border){
                    //        isBorder = true;
                    //     }
                    //    if (!isBorder) t['layout'] = 'noBorders';
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
            case "div": case "a": case "p": case "li": {
                p = this.CreateParagraph();
                let st = { stack: [] }
                st.stack.push(p);
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

                // ******************Zohaib Khan -- Below code is for changing the shapes for bullets in PDF**********************
                // if (st.stack[0].ul.length > 0) {
                //     for (let i = 0; i < st.stack[0].ul.length; i++) {
                //         if (this.childElements.indexOf(st.stack[0].ul[i].stack[0].text[0].text) > -1) {
                //             st.stack[0].ul[i].listType = "circle";
                //         }
                //         if (this.grandChildElements.indexOf(st.stack[0].ul[i].stack[0].text[0].text) > -1) {
                //             st.stack[0].ul[i].listType = "square";
                //         }
                //     }
                // }
                cnt.push(st);
                break;
            }

            case "ol": {
                let list = {
                    ol: []
                };
                let st = { stack: [] }
                st.stack.push(list);
                this.ComputeStyle(st, styles);
                this.ParseContainer(st.stack[0].ol, e, p, []);

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
                break;
            }
        }
        return p;
    }

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

    private ParseContainer(cnt, e, p, styles) {
        let elements = [];
        let children = e.childNodes;
        // let subChild = e.children;
        // ******************Zohaib Khan -- Below code is for changing the shapes for bullets in PDF**********************
        // if (e.nodeName.toLowerCase() == "ul") {
        //     if (subChild.length > 0) {
        //         for (let i = 0; i < subChild.length; i++) {
        //             if (subChild[i].children.length > 0) {
        //                 if (subChild[i].children[0].children.length > 0) {
        //                     for (let j = 0; j < subChild[i].children[0].children.length; j++) {
        //                         console.log(subChild[i].children[0].children[j].children.length);
        //                         if (subChild[i].children[0].children[j].children.length == 0) {
        //                             this.childElements.push(subChild[i].children[0].children[j].textContent.replace(/\n/g, ""));
        //                         } else {
        //                             this.childElements.push(subChild[i].children[0].children[j].innerHTML.split("<ul>")[0]);
        //                             if (subChild[i].children[0].children[j].children[0].children.length > 0) {
        //                                 for (var k = 0; k < subChild[i].children[0].children[j].children[0].children.length; k++) {
        //                                     this.grandChildElements.push(subChild[i].children[0].children[j].children[0].children[k].textContent.replace(/\n/g, ""));
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }

        // }
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
}
