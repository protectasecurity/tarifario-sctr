import { EventEmitter, Injectable } from "@angular/core";
import { Actividades } from "app/views/actividades/models/Actividades";
import { Zone } from "app/views/zones/models/zone.model";
import * as ExcelProper from "exceljs";
import * as Excel from "exceljs/dist/exceljs";
import { Fee, FeeType } from "../../views/fee/models/fee.model";
import { Appraisals, ILinkedChannel, IMatrixChannelGroup, MatrizRiesgo, ParameterStatus, Risk } from "../../views/matriz/models/matriz.model";
import { ParametersTypeConfiguration } from "../../views/parameters/models/company-type.model";
import { Parameter } from "../../views/parameters/models/parameter.model";
import { sortArray } from "../helpers/utils";
import { RiskGroup } from "../models/risk-group.model";
import { SeatConfigurationOperator } from "../models/seat-configuration.model";
import { UseClass } from "../models/use-class.model";
import { Restriction } from '../../views/channel-restriction/models/Restriction';
import { formatDate } from '@angular/common';

@Injectable()
export class FileExportService {
    constructor() { }

    settings: any;
    /* 	EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        EXCEL_EXTENSION = ".xlsx"; */

    private FormatData2(data: any): any[] {
        const result: any[] = [];
        (data.data as Array<any>).forEach(item => {
            const row: any[] = [];
            (data.columns as Array<any>).forEach((value, index) => {
                if (index > 1) {
                    row.push(item["feeZone"][value["id"]]);
                } else {
                    if (value.data === "description") {
                        row.push(item[value["data"]].description);
                    } else {
                        row.push(item[value["data"]]);
                    }
                }
            });
            result.push(row);
        });
        return result;
    }

    private HeadersMatriz(matriz: MatrizRiesgo, version: string, workbook: any): any {
        const sheetT = workbook.getWorksheet(1);
        const sheetC = workbook.getWorksheet(2);
        const font = { name: "Calibri", size: 10 };
        // CABECERA SHEET 1 y 2
        const topHeader = ["Descripción", "F. Inicio Vigencia", "F. Fin Vigencia", "Moneda", "Tipo", "Version", "Estado", "F. Efecto", "T. Padre"];
        const xcolHeader = [
            { key: "des", width: 30 },
            { key: "fi", width: 15 },
            { key: "ff", width: 25 },
            { key: "mo", width: 30 },
            { key: "ti", width: 15 },
            { key: "ver", width: 35 },
            { key: "est", width: 12 },
            { key: "fef", width: 15 },
            { key: "tp", width: 20 }
        ];
        sheetT.columns = xcolHeader;
        xcolHeader[1].width = 45;
        sheetC.columns = xcolHeader;
        const rowHeadT = sheetT.getRow(1);
        rowHeadT.values = topHeader;
        const rowHeadC = sheetC.getRow(1);
        rowHeadC.values = topHeader;
        rowHeadT.eachCell((cell, colNum) => {
            cell.font = { name: "Calibri", size: 10, bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffff00" } };
            cell.alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
            cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        });
        rowHeadC.eachCell((cell, colNum) => {
            cell.font = { name: "Calibri", size: 10, bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffff00" } };
            cell.alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
            cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        });
        sheetT.getCell("I1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffe60a" } };
        sheetC.getCell("I1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffe60a" } };

        // DETAILS DATA HEADER
        const rowHeadDataT = sheetT.getRow(2);
        const rowHeadDataC = sheetC.getRow(2);
        const headerVal = [
            matriz.description,
            matriz.startDate ? new Date(matriz.startDate).toLocaleDateString() : "",
            matriz.endDate ? new Date(matriz.endDate).toLocaleDateString() : "",
            matriz.currency === "PEN" ? "Soles" : "Dólares",
            FeeType[matriz.type],
            version,
            matriz.isActive ? "Activo" : "Inactivo",
            matriz.effectDate ? new Date(matriz.effectDate).toLocaleDateString() : "",
            matriz.originTariffMatrix ? matriz.originTariffMatrix["description"] : ""
        ];
        rowHeadDataT.values = headerVal;
        rowHeadDataT.eachCell((cell, colNum) => {
            cell.font = font;
            cell.alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
            cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        });
        rowHeadDataC.values = headerVal;
        rowHeadDataC.eachCell((cell, colNum) => {
            cell.font = font;
            cell.alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
            cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        });

        // CABECERA TABLA SHEET 1
        const tmpHeadersCol = matriz.parameters.filter(d => d.isActive && d.type === "WORKER_TYPE");
        const headerTablaT = ["RAMO", "ZONA", "TAMAÑO", "ACTIVIDADES", "PRIMA MINIMA", "PRIMA MINIMA ENDOSO"];
        tmpHeadersCol.forEach(c => headerTablaT.push(c["description"]));
        tmpHeadersCol.forEach(c => headerTablaT.push(c["description"]));
        const rowHeadTF = sheetT.getRow(5);
        rowHeadTF.values = headerTablaT;
        rowHeadTF.eachCell((cell, colNum) => {
            cell.font = { name: "Calibri", size: 10, bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffff00" } };
            cell.alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
            cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        });

        // CABECERA TABLA SHEET 1
        const tmpHeadersCol1 = matriz.parameters.filter(d => d.isActive && d.type === "WORKER_TYPE");
        const headerTablaT1 = ["", "", "", "", "", ""];
        tmpHeadersCol1.forEach(c => headerTablaT1.push(c["description"]));

        const rowHeadTF1 = sheetT.getRow(4);
        /* 	rowHeadTF1.values = headerTablaT1;
            rowHeadTF1.eachCell((cell, colNum) => {
                cell.font = { name: "Calibri", size: 10, bold: true };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffff00" } };
                cell.alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
                cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
            }); */
        sheetT.mergeCells("G4:J4");
        sheetT.getCell("G4").value = "Tasa Riesgo";
        sheetT.getCell("G4").font = { name: "Calibri", size: 10, bold: true };
        sheetT.getCell("G4").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffff00" } };
        sheetT.getCell("G4").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
        sheetT.getCell("G4").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
        sheetT.getCell("G4").border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

        sheetT.mergeCells("K4:N4");
        sheetT.getCell("K4").value = "Tasa Neta";
        sheetT.getCell("K4").font = { name: "Calibri", size: 10, bold: true };
        sheetT.getCell("K4").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffff00" } };
        sheetT.getCell("K4").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
        sheetT.getCell("K4").alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
        sheetT.getCell("K4").border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

        // CABECERA TABLA SHEET 2
        const headerTablaC = ["RAMO", "DESCRIPCION DEL CANAL", "FECHA INICIO", "FECHA FIN", "%COMISION", "%DISTRIBUCION", "%DESCUENTO"];
        tmpHeadersCol.forEach(c => headerTablaC.push(c["description"]));
        const rowHeadCF = sheetC.getRow(4);
        rowHeadCF.values = headerTablaC;
        rowHeadCF.eachCell((cell, colNum) => {
            cell.font = { name: "Calibri", size: 10, bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffff00" } };
            cell.alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
            cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        });

        return workbook;
    }

    private FormatDataMatrizSheetT(matriz: MatrizRiesgo, workbook: any): any {
        const sheetT = workbook.getWorksheet(1);
        const ramo = matriz.parameters.filter(d => d.isActive && d.type === "FIELD");
        const tamanno = matriz.parameters.filter(d => d.isActive && d.type === "COMPANY_SIZE");
        const zona = matriz.areaGroups;
        let act = matriz.activityGroups;

        ramo.forEach(r => {
            zona.forEach(z => {
                tamanno.forEach(t => {
                    act = act.sort(function (a, b) {
                        const nameA = Number(a.order) * 1000,
                            nameB = Number(b.order) * 1000;
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        return 0;
                    });

                    act.forEach(a => {
                        const elem = matriz.risks.find(
                            ob => ob.areaGroupId === z.id && ob.fieldsId === r.id && ob.enterpriseSizeId === t.id && ob.activityId === a.id
                        );
                        if (elem) {
                            const data = [
                                r["description"],
                                z["description"],
                                this.getFieldsSize(t),
                                "[" + a.group + "] - " + a.description,
                                elem.minimumPremium,
                                elem.minimumPremiumEndoso
                            ];
                            elem.appraisals.forEach(appr => data.push(appr.riskAppraisal));
                            elem.appraisals.forEach(appr => data.push(appr.commercialAppraisal));
                            sheetT.addRow(data);
                        }
                    });
                    const row = sheetT.getRow(sheetT.actualRowCount + 1);
                    row.eachCell(cell => (cell.border = { bottom: { style: "thin" } }));
                });
            });
        });

        return workbook;
    }

    private FormatDataMatrizSheetC(matriz: MatrizRiesgo, workbook: any): any {
        const sheetC = workbook.getWorksheet(2);
        const ramo = matriz.parameters.filter(d => d.isActive && d.type === "FIELD");
        const channels = matriz.linkedChannelGroups;

        ramo.forEach(r => {
            const elem = channels.filter(ob => ob.fieldsId === r.id);
            elem.forEach(c => {
                const data = [
                    r["description"],
                    c["channelGroup"]["description"],
                    c.startDate ? new Date(c.startDate).toLocaleDateString() : "",
                    c.endDate ? new Date(c.endDate).toLocaleDateString() : "",
                    c.commission ? c.commission : "",
                    c.distribution ? c.distribution : "",
                    c.discount ? c.discount : ""
                ];
                c["parameters"].forEach(p => data.push(p.isActive ? "Si" : "No"));
                sheetC.addRow(data);
            });
            const row = sheetC.getRow(sheetC.actualRowCount + 1);
            row.eachCell(cell => (cell.border = { bottom: { style: "thin" } }));
        });
        return workbook;
    }

    private getFieldsSize(element: any): string {
        if (ParametersTypeConfiguration[element.type] === ParametersTypeConfiguration.COMPANY_SIZE) {
            if (SeatConfigurationOperator[element.operators] === SeatConfigurationOperator.BETWEEN) {
                return SeatConfigurationOperator[element.operators] + " " + element.value + " y " + element.valueMax;
            } else {
                return SeatConfigurationOperator[element.operators] + " " + element.value;
            }
        } else {
            return element.description;
        }
        return "";
    }

    private getEnterpriseZise(description: string, tamanno: Parameter[]): Parameter {
        const order = description.split(" ");
        let result: Parameter;
        switch (order[0]) {
            case "(>=)":
                result = tamanno.find(t => t.operators === "GREATER_OR_EQUAL" && t.value === Number(order[order.length - 1]));
                break;
            case "(>)":
                result = tamanno.find(t => t.operators === "GREATER" && t.value === Number(order[order.length - 1]));
                break;
            case "(=)":
                result = tamanno.find(t => t.operators === "EQUAL" && t.value === Number(order[order.length - 1]));
                break;
            case "(<=)":
                result = tamanno.find(t => t.operators === "MINOR_OR_EQUAL" && t.value === Number(order[order.length - 1]));
                break;
            case "(<)":
                result = tamanno.find(t => t.operators === "MINOR" && t.value === Number(order[order.length - 1]));
                break;
            case "(<>)":
                result = tamanno.find(
                    t => t.operators === "BETWEEN" && t.value === Number(order[order.length - 3]) && t.valueMax === Number(order[order.length - 1])
                );
                break;
        }
        return result;
    }

    public exportMatriz(matriz: MatrizRiesgo, version: string) {
        // let workbook = new Excel.Workbook();
        let workbook: ExcelProper.Workbook = new Excel.Workbook();
        workbook.creator = "Web";
        workbook.lastModifiedBy = "Web";
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.addWorksheet("Tasas", {
            views: [
                {
                    activeCell: "A1",
                    showGridLines: true
                }
            ]
        });
        workbook.addWorksheet("Comisiones", {
            views: [
                {
                    activeCell: "A1",
                    showGridLines: true
                }
            ]
        });

        workbook = this.HeadersMatriz(matriz, version, workbook);
        workbook = this.FormatDataMatrizSheetT(matriz, workbook);
        workbook = this.FormatDataMatrizSheetC(matriz, workbook);

        this.pushFileToBrowser(workbook);
        /* workbook.xlsx.writeBuffer().then(dataw => {
            const blob = new Blob([dataw], { type: this.EXCEL_TYPE });
            FileSaver.saveAs(blob, matriz.description + "_" + new Date().getTime() + this.EXCEL_EXTENSION);
        }); */
    }

    public exportPrimasAndComissions(item: Fee, mHeaderCollPrima: string[], mHeaderCollComisiones: string[], lnkChannel: string) {
        const workbook = this.createWorkbook();
        this.addWorkSheet(workbook, "Tarifario");
        this.addSheetHeader(workbook, item.description + "- Prima", 1);
        this.addTableHeader(workbook, mHeaderCollPrima, 1, 3);
        this.formatSheet(workbook, 1, 3);
        this.addPrimaDataTable(workbook, item, 1);

        this.addWorkSheet(workbook, "Com. Variables x canal");
        this.addSheetHeader(workbook, item.description + "- Comisiones Variables", 2);
        this.addTableHeader(workbook, mHeaderCollComisiones, 2, 3);
        this.formatSheet(workbook, 2, 3);
        this.addVariableCommissionDataTable(workbook, item, 2, lnkChannel);

        this.addWorkSheet(workbook, "Com. Gross Up x canal");
        this.addSheetHeader(workbook, item.description + "- Comisiones Gross Up", 3);
        this.addTableHeader(workbook, mHeaderCollComisiones, 3, 3);
        this.formatSheet(workbook, 3, 3);
        this.addGrossUpCommissionDataTable(workbook, item, 3, lnkChannel);

        this.pushFileToBrowser(workbook, "Tarifario Primas-Comisiones");
    }

    private getVariablesComissionsData(item: Fee, lnkChannel: string) {
        const chanelGroupSelected = item.linkedchannels.find(x => x.channelGroup.id === lnkChannel);
        const mapZones: string[] = [];
        item.zones.forEach(zone => {
            mapZones.push(zone.id);
        });
        const dataTable = [];
        chanelGroupSelected.channelGroup.channels.forEach(channel => {
            channel.agents.forEach(chAgent => {
                const agent = chAgent.description + "";
                const struct = {
                    agente: agent,
                    tipoPoliza: "",
                    uso: "",
                    clase: ""
                };
                let index = -1;
                const size = item.rows.length;

                item.rows.forEach(row => {
                    index += 1;
                    struct.uso = row.vehicleUse.description;
                    struct.clase = row.description;
                    const mapComisionesBF: string[] = [];
                    const mapComisionesBFR: string[] = [];
                    const mapComisionesBD: string[] = [];
                    const mapComisionesBDR: string[] = [];
                    const mapComisionesIF: string[] = [];
                    const mapComisionesIFR: string[] = [];
                    const mapComisionesID: string[] = [];
                    const mapComisionesIDR: string[] = [];
                    let contadorB = 0;
                    let contadorI = 0;
                    row.feeZone.forEach(zone => {
                        zone.commission.forEach(comision => {
                            if (comision.channelGroupId === lnkChannel) {
                                if (chAgent.type === "BROKER") {
                                    contadorB += 1;
                                    mapComisionesBF[zone.idZone] = comision.brokerCommission.standardCommission;
                                    mapComisionesBFR[zone.idZone] = comision.brokerCommission.renewalStandardCommission;
                                    mapComisionesBD[zone.idZone] = comision.brokerCommission.digitalCommission;
                                    mapComisionesBDR[zone.idZone] = comision.brokerCommission.renewalDigitalCommission;
                                } else if (chAgent.type === "MIDDLEMAN") {
                                    contadorI += 1;
                                    mapComisionesIF[zone.idZone] = comision.middlemanCommission.standardCommission;
                                    mapComisionesIFR[zone.idZone] = comision.middlemanCommission.renewalStandardCommission;
                                    mapComisionesID[zone.idZone] = comision.middlemanCommission.digitalCommission;
                                    mapComisionesIDR[zone.idZone] = comision.middlemanCommission.renewalDigitalCommission;
                                }
                            }
                        });
                    });
                    //BROKER
                    if (contadorB > 0) {
                        struct.tipoPoliza = "FISICA";
                        dataTable[index] = this.getComisionRowsByPoliza(struct, mapZones, mapComisionesBF);

                        struct.tipoPoliza = "FISICA RENOVACION";
                        dataTable[index + size] = this.getComisionRowsByPoliza(struct, mapZones, mapComisionesBFR);

                        struct.tipoPoliza = "DIGITAL";
                        dataTable[index + size * 2] = this.getComisionRowsByPoliza(struct, mapZones, mapComisionesBD);

                        struct.tipoPoliza = "DIGITAL RENOVACION";
                        dataTable[index + size * 3] = this.getComisionRowsByPoliza(struct, mapZones, mapComisionesBDR);
                    }
                    //INTERMEDIARIOS
                    if (contadorI > 0) {
                        struct.tipoPoliza = "FISICA";
                        dataTable[index + size * 4] = this.getComisionRowsByPoliza(struct, mapZones, mapComisionesIF);

                        struct.tipoPoliza = "FISICA RENOVACION";
                        dataTable[index + size * 5] = this.getComisionRowsByPoliza(struct, mapZones, mapComisionesIFR);

                        struct.tipoPoliza = "DIGITAL";
                        dataTable[index + size * 6] = this.getComisionRowsByPoliza(struct, mapZones, mapComisionesID);

                        struct.tipoPoliza = "DIGITAL RENOVACION";
                        dataTable[index + size * 7] = this.getComisionRowsByPoliza(struct, mapZones, mapComisionesIDR);
                    }
                });
            });
        });
        return dataTable;
    }

    private getGrossUpComissionsData(item: Fee, lnkChannel: string) {
        const chanelGroupSelected = item.linkedchannels.find(x => x.channelGroup.id === lnkChannel);
        const mapZones: string[] = [];
        item.zones.forEach(zone => {
            mapZones.push(zone.id);
        });
        const dataTable = [];
        chanelGroupSelected.channelGroup.channels.forEach(channel => {
            channel.agents.forEach(chAgent => {
                const agent = chAgent.description + "";
                const struct = {
                    agente: agent,
                    tipoPoliza: "",
                    uso: "",
                    clase: ""
                };
                let index = -1;
                const size = item.rows.length;

                item.rows.forEach(row => {
                    index += 1;
                    struct.uso = row.vehicleUse.description;
                    struct.clase = row.description;
                    const mapComisionesGBF: string[] = [];
                    const mapComisionesGBD: string[] = [];
                    const mapComisionesGIF: string[] = [];
                    const mapComisionesGID: string[] = [];
                    let contadorB = 0;
                    let contadorI = 0;
                    row.feeZone.forEach(zone => {
                        zone.commission.forEach(comision => {
                            if (comision.channelGroupId === lnkChannel) {
                                if (chAgent.type === "BROKER") {
                                    contadorB += 1;
                                    mapComisionesGBF[zone.idZone] = comision.brokerCommission.standardGrossUpCommission;
                                    mapComisionesGBD[zone.idZone] = comision.brokerCommission.digitalGrossUpCommission;
                                } else if (chAgent.type === "MIDDLEMAN") {
                                    contadorI += 1;
                                    mapComisionesGIF[zone.idZone] = comision.middlemanCommission.standardGrossUpCommission;
                                    mapComisionesGID[zone.idZone] = comision.middlemanCommission.digitalGrossUpCommission;
                                }
                            }
                        });
                    });
                    //BROKER
                    if (contadorB > 0) {
                        struct.tipoPoliza = "FISICA";
                        dataTable[index] = this.getComisionRowsByPoliza(struct, mapZones, mapComisionesGBF);

                        struct.tipoPoliza = "DIGITAL";
                        dataTable[index + size] = this.getComisionRowsByPoliza(struct, mapZones, mapComisionesGBD);
                    }
                    //INTERMEDIARIOS
                    if (contadorI > 0) {
                        struct.tipoPoliza = "FISICA";
                        dataTable[index + size * 2] = this.getComisionRowsByPoliza(struct, mapZones, mapComisionesGIF);

                        struct.tipoPoliza = "DIGITAL";
                        dataTable[index + size * 3] = this.getComisionRowsByPoliza(struct, mapZones, mapComisionesGID);
                    }
                });
            });
        });
        return dataTable;
    }

    public exportRestrictions(items: Restriction[], mHeaderColl: string[]) {
        const workbook = this.createWorkbook();
        this.addWorkSheet(workbook, "Restricciones");
        const format = 'dd/MM/yyyy';
        const locale = 'en-US';
        const date = formatDate(new Date(), format, locale);
        this.addRestrictionSheetHeader(workbook, 'LISTA DE RESTRICCIONES DE CANALES (' + date + ')', 1);
        this.addRestrictionTableHeader(workbook, mHeaderColl, 1, 3);
        this.addRestrictionDataTable(workbook, items, 1);
        /*this.addPrimaDataTable(workbook, item, 1);
        this.formatTableGeneralInformation(workbook, 1);*/
        //	this.formatSheet(workbook, 1, 4);
        this.pushFileToBrowser(workbook, "Restricciones de Canales");
    }

    public exportPrimas(item: Fee, mHeaderColl: string[], generalInfo: any) {
        const workbook = this.createWorkbook();
        this.addWorkSheet(workbook, "Tarifario");
        //this.addSheetHeader(workbook, item.description + "- Prima", 1);
        this.addTableGeneralInformation(workbook, generalInfo, 1);
        this.addTableHeader(workbook, mHeaderColl, 1, 4);
        this.addPrimaDataTable(workbook, item, 1);
        this.formatTableGeneralInformation(workbook, 1);
        this.formatSheet(workbook, 1, 4);
        this.pushFileToBrowser(workbook, "Tarifario");
    }

    private createWorkbook(): ExcelProper.Workbook {
        const workbook: ExcelProper.Workbook = new Excel.Workbook();
        workbook.creator = "Web";
        workbook.lastModifiedBy = "Web";
        workbook.created = new Date();
        workbook.modified = new Date();
        return workbook;
    }

    private addWorkSheet(workbook: ExcelProper.Workbook, fileName: string) {
        workbook.addWorksheet(fileName, {
            views: [
                {
                    activeCell: "A1",
                    showGridLines: true
                }
            ]
        });
    }

    private addTableGeneralInformation(workbook: ExcelProper.Workbook, generalInfo: any, numberSheet: number) {
        const sheet = workbook.getWorksheet(numberSheet);
        const tableHeader = ['Descripción', 'F. Inicio Vigencia', 'F.Fin Vigencia', 'Moneda', 'Tipo', 'Version', 'Estado', 'F. Efecto', 'T. Padre'];
        const tableRow: string[] = [];
        tableRow.push(generalInfo.description);
        tableRow.push(generalInfo.iniVig);
        tableRow.push(generalInfo.finVig);
        tableRow.push(generalInfo.moneda);
        tableRow.push(generalInfo.tipo);
        tableRow.push(generalInfo.version);
        tableRow.push(generalInfo.estado);
        tableRow.push(generalInfo.effectdate);
        tableRow.push(generalInfo.tarifarioPadre);
        sheet.addRow(tableHeader);
        sheet.addRow(tableRow);
        sheet.addRow(['']);
    }

    private formatTableGeneralInformation(workbook: ExcelProper.Workbook, numberSheet: number) {
        const sheet = workbook.getWorksheet(numberSheet);
        const font = { name: 'Calibri', size: 10, underline: false, bold: true, color: { argb: "000000" } };
        const font2 = { name: 'Calibri', size: 10, underline: false, bold: false, color: { argb: "000000" } };
        const fill: ExcelProper.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' }, bgColor: { argb: '000000' } };
        const fill2: ExcelProper.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE60A' }, bgColor: { argb: 'FFE60A' } };
        const border: Partial<ExcelProper.Borders> = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        const alignment: Partial<ExcelProper.Alignment> = { vertical: 'middle', horizontal: 'center', wrapText: true };

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.font = font;
                row.eachCell((cell, cellNumer) => {
                    sheet.getCell(String(cell.address)).font = font;
                    sheet.getCell(String(cell.address)).fill = fill;
                    sheet.getCell(String(cell.address)).border = border;
                    sheet.getCell(String(cell.address)).alignment = alignment;
                });
            } else if (rowNumber === 2) {
                row.font = font;
                row.eachCell((cell, cellNumer) => {
                    sheet.getCell(String(cell.address)).font = font2;
                    sheet.getCell(String(cell.address)).border = border;
                    sheet.getCell(String(cell.address)).alignment = alignment;
                });
            }
        });
        sheet.getCell(String('I1')).fill = fill2;
    }

    private addRestrictionDataTable(workbook: ExcelProper.Workbook, item: Restriction[], numberSheet: number) {
        const sheet = workbook.getWorksheet(numberSheet);
        const data = this.getRestrictionData(item);
        sheet.addRows(data);
    }

    private addPrimaDataTable(workbook: ExcelProper.Workbook, item: Fee, numberSheet: number) {
        const sheet = workbook.getWorksheet(numberSheet);
        const data = this.getPrimaData(item);
        sheet.addRows(data);
    }

    private addVariableCommissionDataTable(workbook: ExcelProper.Workbook, item: Fee, numberSheet: number, lnkChannel: string) {
        const sheet = workbook.getWorksheet(numberSheet);
        const data = this.getVariablesComissionsData(item, lnkChannel);
        sheet.addRows(data);
    }

    private addGrossUpCommissionDataTable(workbook: ExcelProper.Workbook, item: Fee, numberSheet: number, lnkChannel: string) {
        const sheet = workbook.getWorksheet(numberSheet);
        const data = this.getGrossUpComissionsData(item, lnkChannel);
        sheet.addRows(data);
    }

    private addSheetHeader(workbook: ExcelProper.Workbook, title: string, numberSheet: number) {
        const sheet = workbook.getWorksheet(numberSheet);
        const font = { name: "Calibri", size: 10 };
        const head1 = [title];
        const titleRow = sheet.addRow(head1);
        titleRow.font = font;
        titleRow.font = {
            size: 14,
            underline: false,
            bold: true,
            color: { argb: "000000" }
        };
    }

    private addRestrictionSheetHeader(workbook: ExcelProper.Workbook, title: string, numberSheet: number) {
        const sheet = workbook.getWorksheet(numberSheet);
        sheet.mergeCells('A1:F1');
        const fill: ExcelProper.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' }, bgColor: { argb: '000000' } };
        const font = { size: 14, underline: false, bold: false, color: { argb: "000000" } };
        const alignment: Partial<ExcelProper.Alignment> = { wrapText: true, vertical: "middle", horizontal: "center" };
        sheet.getCell('A1').fill = fill;
        sheet.getCell('A1').font = font;
        sheet.getCell('A1').alignment = alignment;
        sheet.getCell('A1').border = { bottom: { style: "thin", color: { argb: '000000' } } };
        sheet.getCell('A1').value = title;
    }

    private addTableHeader(workbook: ExcelProper.Workbook, colHeaders: string[], numberSheet: number, numberTableHeader: number) {
        const sheet = workbook.getWorksheet(numberSheet);
        const xcolHeaders = [
            { key: "use", width: 20 },
            { key: "class", width: 41 },
            { key: "type", width: 18 }
        ];
        colHeaders.forEach((item, index) => {
            if (index >= 3) {
                xcolHeaders.push({ key: "zona" + (index - 2), width: item.length + 4 });
            }
        });
        sheet.views = [
            { state: 'frozen', xSplit: 3, ySplit: 4 }
        ];
        sheet.addRow("");
        sheet.getRow(numberTableHeader).values = colHeaders;
        sheet.columns = xcolHeaders;
    }

    private addRestrictionTableHeader(workbook: ExcelProper.Workbook, colHeaders: string[], numberSheet: number, numberTableHeader: number) {
        const sheet = workbook.getWorksheet(numberSheet);
        const fill: ExcelProper.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' }, bgColor: { argb: '2B0D61' } };
        const xcolHeaders = [
            { key: "channel", width: 40 },
            { key: "use", width: 25 },
            { key: "class", width: 25 },
            { key: "initDate", width: 12 },
            { key: "endDate", width: 12 },
            { key: "state", width: 10 }
        ];
        sheet.views = [
            { state: 'frozen', xSplit: 0, ySplit: 3 }
        ];
        sheet.addRow("");
        sheet.getRow(numberTableHeader).values = colHeaders;
        sheet.getCell('A' + numberTableHeader).fill = fill;
        sheet.getCell('B' + numberTableHeader).fill = fill;
        sheet.getCell('C' + numberTableHeader).fill = fill;
        sheet.getCell('D' + numberTableHeader).fill = fill;
        sheet.getCell('E' + numberTableHeader).fill = fill;
        sheet.getCell('F' + numberTableHeader).fill = fill;
        sheet.columns = xcolHeaders;
    }

    private formatSheet(workbook: ExcelProper.Workbook, numberSheet: number, numberTableHeader: number) {
        const sheet = workbook.getWorksheet(numberSheet);
        const font = { name: "Calibri", size: 10 };
        sheet.eachRow(function (row, rowNumber) {
            if (rowNumber >= numberTableHeader) {
                row.eachCell({ includeEmpty: true }, function (cell, cellNumber) {
                    sheet.getCell(cell.address.toString()).font = font;
                    if (cellNumber === 1) {
                        sheet.getCell(cell.address.toString()).alignment = {
                            wrapText: true,
                            vertical: "middle"
                        };
                    } else {
                        sheet.getCell(cell.address.toString()).alignment = {
                            wrapText: true,
                            vertical: "middle"
                        };
                    }
                    if (rowNumber === numberTableHeader) {
                        sheet.getCell(cell.address.toString()).alignment = {
                            wrapText: true,
                            horizontal: "center"
                        };
                        sheet.getCell(cell.address.toString()).font = {
                            bold: true,
                            color: { argb: "FFFFFF" }
                        };
                    }

                    sheet.getCell(cell.address.toString()).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: {
                            argb: rowNumber === numberTableHeader ? "2b0d61"
                                : rowNumber > numberTableHeader && Number(cell.col) < numberTableHeader ? "f1f1f1" : ""
                        }
                    };

                    sheet.getCell(cell.address.toString()).border = {
                        top: { style: "thin", color: { argb: '000000' } },
                        left: { style: "thin", color: { argb: '000000' } },
                        bottom: { style: "thin", color: { argb: '000000' } },
                        right: { style: "thin", color: { argb: '000000' } },
                    };
                });
            }

        });
    }
    private getRestrictionData(items: Restriction[]) {
        const dataTable = [];
        const format = 'dd/MM/yyyy';
        const locale = 'en-US';
        items.forEach(item => {
            const rowTable = [];
            rowTable.push(item.channel.description);
            rowTable.push(item.use.description);
            rowTable.push(item.clazz.description);
            rowTable.push(formatDate(item.initialDate, format, locale));
            rowTable.push(formatDate(item.endDate, format, locale));
            rowTable.push((item.status.toLowerCase() === 'active') ? 'Activo' : 'Inactivo');
            dataTable.push(rowTable);
        });
        return dataTable;
    }
    private getPrimaData(item: Fee) {
        const mapZones = [];
        item.zones.forEach(zone => {
            mapZones.push(zone.id);
        });
        const dataTable = [];
        const struct = {
            tipoPoliza: "",
            uso: "",
            clase: ""
        };
        let index = -1;
        const size = item.rows.length;
        item.rows.forEach(row => {
            index += 1;
            struct.uso = row.vehicleUse.description;
            struct.clase = row.description;
            const mapPrimaF: string[] = [];
            const mapPrimaFR: string[] = [];
            const mapPrimaD: string[] = [];
            const mapPrimaDR: string[] = [];
            row.feeZone.forEach(zone => {
                mapPrimaF[zone.idZone] = zone.premium.fisico;
                mapPrimaFR[zone.idZone] = zone.premium.fisicoRenovacion;
                mapPrimaD[zone.idZone] = zone.premium.digital;
                mapPrimaDR[zone.idZone] = zone.premium.digitalRenovacion;
            });
            struct.tipoPoliza = "FISICA";
            dataTable[index] = this.getPrimaRowsByPoliza(struct, mapZones, mapPrimaF);
            struct.tipoPoliza = "FISICA RENOVACION";
            dataTable[index + size] = this.getPrimaRowsByPoliza(struct, mapZones, mapPrimaFR);
            struct.tipoPoliza = "DIGITAL";
            dataTable[index + size * 2] = this.getPrimaRowsByPoliza(struct, mapZones, mapPrimaD);
            struct.tipoPoliza = "DIGITAL RENOVACION";
            dataTable[index + size * 3] = this.getPrimaRowsByPoliza(struct, mapZones, mapPrimaDR);
        });

        return dataTable;
    }

    private getPrimaRowsByPoliza(struct: any, mapZones: string[], map: string[]) {
        const rowTable = [];
        rowTable.push(struct.uso);
        rowTable.push(struct.clase);
        rowTable.push(struct.tipoPoliza);
        for (const zoneId of mapZones) {
            rowTable.push(map[zoneId]);
        }
        return rowTable;
    }

    private getComisionRowsByPoliza(struct: any, mapZones: string[], map: string[]) {
        const rowTable = [];
        rowTable.push(struct.agente + "");
        rowTable.push(struct.tipoPoliza);
        rowTable.push(struct.uso);
        rowTable.push(struct.clase);
        for (const zoneId of mapZones) {
            rowTable.push(map[zoneId]);
        }
        return rowTable;
    }


    public exportarTarifario(fileName: string, settings: any) {
        const workbook: ExcelProper.Workbook = new Excel.Workbook();
        workbook.creator = "Web";
        workbook.lastModifiedBy = "Web";
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.addWorksheet(fileName, {
            views: [
                {
                    activeCell: "A1",
                    showGridLines: true
                }
            ]
        });

        const sheet = workbook.getWorksheet(1);
        const font = { name: "Calibri", size: 10 };
        // CABECERA
        const head1 = [fileName];
        const titleRow = sheet.addRow(head1);
        titleRow.font = font;
        titleRow.font = {
            size: 14,
            underline: false,
            bold: true,
            color: { argb: "000000" }
        };

        const xcolHeaders = [
            { key: "gri", width: 20 },
            { key: "lev", width: 30 },
            { key: "uni", width: 10 },
            { key: "lev1", width: 10 },
            { key: "lev2", width: 10 },
            { key: "lev3", width: 10 },
            { key: "lev4", width: 10 },
            { key: "lev5", width: 10 }
        ];

        sheet.addRow("");
        sheet.getRow(3).values = settings.colHeaders;

        sheet.columns = xcolHeaders;
        sheet.addRows(this.FormatData2(settings));

        sheet.eachRow(function (row, rowNumber) {
            if (rowNumber >= 3) {
                row.eachCell({ includeEmpty: true }, function (cell, cellNumber) {
                    sheet.getCell(cell.address.toString()).font = font;
                    if (cellNumber === 1) {
                        sheet.getCell(cell.address.toString()).alignment = {
                            wrapText: true,
                            vertical: "middle"
                        };
                    } else {
                        sheet.getCell(cell.address.toString()).alignment = {
                            wrapText: true,
                            vertical: "middle"
                        };
                    }

                    if (rowNumber === 3) {
                        sheet.getCell(cell.address.toString()).alignment = {
                            horizontal: "center"
                        };
                        sheet.getCell(cell.address.toString()).font = {
                            bold: true,
                            color: { argb: "FFFFFF" }
                        };
                    }

                    sheet.getCell(cell.address.toString()).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: rowNumber === 3 ? "2b0d61" : rowNumber > 3 && Number(cell.col) < 3 ? "f1f1f1" : "" }
                    };

                    sheet.getCell(cell.address.toString()).border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" }
                    };
                });
            }
        });

        this.pushFileToBrowser(workbook);

        /* const xt = this.EXCEL_TYPE;
        const xx = this.EXCEL_EXTENSION;
        workbook.xlsx.writeBuffer().then(function (dataw) {
            const blob = new Blob([dataw], { type: xt });
            FileSaver.saveAs(
                blob,
                fileName + "_" + new Date().getTime() + xx
            );
        }); */
    }

    public exportRiskGroup(items: RiskGroup[], mHeaderColl: string[]) {
        const workbook = this.createWorkbook();
        this.addWorkSheet(workbook, 'Zonas');
        this.addSheetHeader(workbook, 'Grupos de Riesgo', 1);
        this.addTableHeader(workbook, mHeaderColl, 1, 3);
        this.formatSheet(workbook, 1, 3);
        this.addRiskGroupDataTable(workbook, items, 1);
        this.pushFileToBrowser(workbook, "Grupos de Riesgo");
    }
    public exportUseClasses(items: UseClass[], mHeaderColl: string[]) {
        const workbook = this.createWorkbook();
        this.addWorkSheet(workbook, 'Usos');
        //this.addSheetHeader(workbook, 'Usos y clases', 1);
        this.addTableHeader(workbook, mHeaderColl, 1, 3);
        this.formatSheet(workbook, 1, 3);
        this.addUseClassDataTable(workbook, items, 1);
        this.pushFileToBrowser(workbook, "Usos y clases");
    }

    private addRiskGroupDataTable(workbook: ExcelProper.Workbook, items: RiskGroup[], numberSheet: number) {
        const sheet = workbook.getWorksheet(numberSheet);
        const data = this.getRiskGroupData(items);
        sheet.addRows(data);
    }
    private addUseClassDataTable(workbook: ExcelProper.Workbook, items: UseClass[], numberSheet: number) {
        const sheet = workbook.getWorksheet(numberSheet);
        const data = this.getUseClassData(items);
        sheet.addRows(data);
    }

    private getRiskGroupData(items: RiskGroup[]) {
        const dataTable = [];
        items.forEach((item, index) => {
            const rowTable = [];
            rowTable.push(item.vehicleUse.description);
            rowTable.push(item.description);
            rowTable.push((item.isActive) ? 'SI' : 'NO');
            rowTable.push((item.isUsed) ? 'SI' : 'NO');
            dataTable.push(rowTable);
        });
        return dataTable;
    }
    private getUseClassData(items: UseClass[]) {
        const dataTable = [];
        items.forEach((item) => {
            const rowTable = [];
            rowTable.push(item.use.description);
            rowTable.push(item.clazz.description);
            rowTable.push((item.status) ? 'SI' : 'NO');
            dataTable.push(rowTable);
        });
        return dataTable;
    }

    public excelExport(fileName: string, header: string[], index: string[], data: any[]) {
        // const workbook = new Excel.Workbook();
        const workbook: ExcelProper.Workbook = new Excel.Workbook();
        workbook.creator = "Web";
        workbook.lastModifiedBy = "Web";
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.addWorksheet(fileName, {
            views: [
                {
                    activeCell: "A1",
                    showGridLines: true
                }
            ]
        });
        const sheet = workbook.getWorksheet(1);
        const font = { name: "Arial", size: 10 };

        const head1 = [fileName];
        const titleRow = sheet.addRow(head1);
        titleRow.font = font;
        titleRow.font = {
            size: 10,
            underline: false,
            bold: true,
            color: { argb: "000000" }
        };

        const xcolHeaders = [
            { key: "gri", width: 50 },
            { key: "lev", width: 20 },
            { key: "uni", width: 20 },
            { key: "lev1", width: 9 },
            { key: "lev2", width: 11 },
            { key: "lev3", width: 20 },
            { key: "lev4", width: 10 },
            { key: "lev5", width: 10 }
        ];

        sheet.addRow("");
        sheet.getRow(3).values = header;
        sheet.columns = xcolHeaders;
        sheet.addRows(this.FormatData(index, data));

        sheet.eachRow(function (row, rowNumber) {
            if (rowNumber >= 3) {
                row.eachCell({ includeEmpty: true }, function (cell, cellNumber) {
                    sheet.getCell(cell.address.toString()).font = font;
                    if (cellNumber === 1) {
                        sheet.getCell(cell.address.toString()).alignment = {
                            wrapText: true,
                            vertical: "middle"
                        };
                    } else {
                        sheet.getCell(cell.address.toString()).alignment = {
                            wrapText: true,
                            vertical: "middle"
                        };
                    }

                    if (rowNumber === 3) {
                        sheet.getCell(cell.address.toString()).alignment = {
                            horizontal: "center"
                        };
                        sheet.getCell(cell.address.toString()).font = {
                            bold: true
                        };
                    }

                    sheet.getCell(cell.address.toString()).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: rowNumber === 3 ? "D3D3D3" : "" }
                    };

                    sheet.getCell(cell.address.toString()).border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" }
                    };
                });
            }
        });
        this.pushFileToBrowser(workbook);
    }

    public excelExportNoWidht(fileName: string, header: string[], index: string[], data: any[]) {
        // const workbook = new Excel.Workbook();
        const workbook: ExcelProper.Workbook = new Excel.Workbook();
        workbook.creator = "Web";
        workbook.lastModifiedBy = "Web";
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.addWorksheet(fileName, {
            views: [
                {
                    activeCell: "A1",
                    showGridLines: true
                }
            ]
        });
        const sheet = workbook.getWorksheet(1);
        const font = { name: "Arial", size: 9 };

        const head1 = [fileName];
        const titleRow = sheet.addRow(head1);
        titleRow.font = font;
        titleRow.font = {
            size: 9,
            underline: false,
            bold: true,
            color: { argb: "000000" }
        };

        const xcolHeaders = [
            { key: "1", width: 15 },
            { key: "2", width: 15 },
            { key: "3", width: 50 },
            { key: "4", width: 50 },
            { key: "5", width: 50 },
            { key: "6", width: 50 },
            { key: "7", width: 50 },
            { key: "8", width: 12 },
            { key: "9", width: 15 },
            { key: "10", width: 10 },
            { key: "11", width: 10 },
            { key: "12", width: 10 },
            { key: "13", width: 10 }
        ];

        sheet.addRow("");
        sheet.getRow(3).values = header;
        sheet.columns = xcolHeaders;
        sheet.addRows(this.FormatData(index, data));

        sheet.eachRow(function (row, rowNumber) {
            if (rowNumber >= 3) {
                row.eachCell({ includeEmpty: true }, function (cell, cellNumber) {
                    sheet.getCell(cell.address.toString()).font = font;
                    if (cellNumber === 1) {
                        sheet.getCell(cell.address.toString()).alignment = {
                            wrapText: true,
                            vertical: "middle"
                        };
                    } else {
                        sheet.getCell(cell.address.toString()).alignment = {
                            wrapText: true,
                            vertical: "middle"
                        };
                    }

                    if (rowNumber === 3) {
                        sheet.getCell(cell.address.toString()).alignment = {
                            horizontal: "center"
                        };
                        sheet.getCell(cell.address.toString()).font = {
                            bold: true
                        };
                    }

                    sheet.getCell(cell.address.toString()).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: rowNumber === 3 ? "D3D3D3" : "" }
                    };

                    sheet.getCell(cell.address.toString()).border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" }
                    };
                });
            }
        });
        this.pushFileToBrowser(workbook);
    }

    pushFileToBrowser(workbook: ExcelProper.Workbook, nombreFile?: string) {
        workbook.xlsx.writeBuffer().then(dataw => {
            const blob = new Blob([dataw], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
            let fileN = "";
            if (nombreFile) {
                fileN = nombreFile + ".xlsx";
            } else {
                fileN =
                    Math.random()
                        .toString(36)
                        .substring(2, 15) +
                    Math.random()
                        .toString(36)
                        .substring(2, 15) +
                    ".xlsx";
            }

            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = fileN;
            anchor.click();
            setTimeout(function () {
                window.URL.revokeObjectURL(url);
            }, 0);
        });
    }

    private FormatData(index: string[], data: any[]): any[] {
        const result: any[] = [];
        data.forEach((value, index1) => {
            const row: any[] = [];
            index.forEach((value1, index2) => {
                if (typeof value[value1] === "object") {
                    if (value[value1] !== null) {
                        if (value1 === "locations") {
                            let chain: string = "";
                            let first: boolean = true;
                            (value[value1] as Array<any>).forEach(value2 => {
                                if (first) {
                                    first = false;
                                    chain += value2.description;
                                } else {
                                    chain += "/" + value2.description;
                                }
                            });
                            row.push(chain);
                        } else if (value1.toLowerCase().indexOf("date")) {
                            if (value[value1] != null) {
                                row.push(value[value1].format("DD/MM/YYYY HH:mm:ss"));
                            }
                        } else {
                            row.push(value[value1].description);
                        }
                    } else {
                        row.push(value[value1]);
                    }
                } else {
                    switch (typeof value[value1]) {
                        case "boolean":
                            if (value[value1]) {
                                row.push("SI");
                            } else {
                                row.push("NO");
                            }
                            break;
                        default:
                            if (value1 === "currency") {
                                if (value[value1] === "PEN") {
                                    row.push("SOLES");
                                } else {
                                    row.push("USD");
                                }
                            } else {
                                row.push(value[value1]);
                            }
                    }
                }
            });
            result.push(row);
        });
        return result;
    }

    private riskMatriz(
        matriz: MatrizRiesgo,
        workbook: any,
        ramo: any[],
        tamanno: any[],
        riesgos: any[],
        actividades: any[],
        zonas: any[]
    ): MatrizRiesgo {
        const sheetT = workbook.getWorksheet(1);
        const risk: Parameter[] = [];
        const riskList = matriz.risks;
        const list = [];

        sheetT.eachRow((row, rowNumber) => {
            if (rowNumber === 5) {
                row.eachCell((cell, column) => {
                    if (column > 6) {
                        risk[column] = riesgos.find(r => r.description === cell.value);
                    }
                });
            } else if (rowNumber > 5) {
                const ramoTmp = ramo.find(r => r.description === row.getCell(1).value);
                const zonaTmp = zonas.find(r => r.description === row.getCell(2).value);
                const tamannoTmp = this.getEnterpriseZise(row.getCell(3).value, tamanno);
                const actividadesTmp = actividades.find(r => ("[" + r.group + "] - " + r.description) === row.getCell(4).value);
                const minimumPremium = row.getCell(5).value;
                const minimumPremiumEndoso = row.getCell(6).value;

                if (ramoTmp && zonaTmp && tamannoTmp && actividadesTmp) {
                    const appr: Appraisals[] = [];
                    if (risk.length > 0) {
                        const maxL = risk.length - 1;
                        risk.forEach((r, i) => {
                            if (Number(i) + 4 <= maxL) {
                                const riskApp = row.getCell(i).value;
                                let commercialAppraisal = row.getCell(i + 4).value; // (Number(riskApp) / (1 - Number(actividadesTmp.factor)));
                                if (isNaN(commercialAppraisal)) {
                                    commercialAppraisal = 0;
                                }
                                appr.push({
                                    commercialAppraisal: commercialAppraisal,
                                    riskAppraisal: riskApp,
                                    workerTypeId: r.id
                                });
                            }
                        });
                    }

                    riesgos.forEach(r => {
                        const result = appr.find((a: Appraisals) => a.workerTypeId === r.id);
                        if (!result) {
                            appr.push({
                                commercialAppraisal: 0,
                                riskAppraisal: 0,
                                workerTypeId: r.id
                            });
                        }
                    });

                    list.push({
                        id: "obj." + actividadesTmp.id,
                        activityId: actividadesTmp.id,
                        areaGroupId: zonaTmp.id,
                        fieldsId: ramoTmp.id,
                        minimumPremium: minimumPremium,
                        minimumPremiumEndoso: minimumPremiumEndoso,
                        enterpriseSizeId: tamannoTmp.id,
                        appraisals: appr
                    });
                }
            }
        });

        riskList.forEach((rl: Risk) => {
            const result = list.find(
                ob =>
                    ob.areaGroupId === rl.areaGroupId &&
                    ob.fieldsId === rl.fieldsId &&
                    ob.enterpriseSizeId === rl.enterpriseSizeId &&
                    ob.activityId === rl.activityId
            );

            if (!result) {
                list.push(rl);
            }
        });

        const activ: Actividades[] = [];
        actividades.forEach(a => {
            const resp = list.find(f => f.activityId === a.id);
            if (resp) {
                activ.push(a);
            }
        });
        matriz.activityGroups = sortArray(activ, "order", 1);

        const zon: Zone[] = [];
        zonas.forEach(z => {
            const resp = list.find(f => f.areaGroupId === z.id);
            if (resp) {
                zon.push(z);
            }
        });
        matriz.areaGroups = sortArray(zon, "order", 1);

        zon.forEach(z => {
            ramo.forEach(r => {
                tamanno.forEach(t => {
                    activ.forEach(a => {
                        const tmp = list.find(ob => ob.areaGroupId === z.id && ob.fieldsId === r.id && ob.enterpriseSizeId === t.id && ob.activityId === a.id);
                        if (!tmp) {
                            const appr: Appraisals[] = [];
                            risk.forEach(ri =>
                                appr.push({
                                    commercialAppraisal: 0,
                                    riskAppraisal: 0,
                                    workerTypeId: ri.id
                                })
                            );

                            riesgos.forEach(ri => {
                                const result = appr.find((ac: Appraisals) => ac.workerTypeId === ri.id);
                                if (!result) {
                                    appr.push({
                                        commercialAppraisal: 0,
                                        riskAppraisal: 0,
                                        workerTypeId: ri.id
                                    });
                                }
                            });
                            list.push({
                                id: "obj." + a.id,
                                activityId: a.id,
                                areaGroupId: z.id,
                                fieldsId: r.id,
                                minimumPremium: 0,
                                minimumPremiumEndoso: 0,
                                enterpriseSizeId: t.id,
                                appraisals: appr
                            });
                        }
                    });
                });
            });
        });

        matriz.risks = list;
        return matriz;
    }

    private channelMatriz(matriz: MatrizRiesgo, workbook: any, ramo: any[], channel: any[], riesgos: any[]): MatrizRiesgo {
        const sheetC = workbook.getWorksheet(2);
        const channelList = matriz.linkedChannelGroups;
        const list: ILinkedChannel[] = [];
        const risk: Parameter[] = [];

        sheetC.eachRow((row, rowNumber) => {
            if (rowNumber === 4) {
                row.eachCell((cell, column) => {
                    if (column > 7) {
                        risk[column] = riesgos.find(r => r.description === cell.value);
                    }
                });
            } else if (rowNumber > 4) {
                const ramoTmp: Parameter = ramo.find(r => r.description === row.getCell(1).value);
                const channelTmp: IMatrixChannelGroup = channel.find(r => r.description === row.getCell(2).value);

                if (ramoTmp && channelTmp) {
                    const paramStatus: ParameterStatus[] = [];
                    risk.forEach((r, i) => {
                        paramStatus.push({
                            id: r.id,
                            description: r.description,
                            isActive: row.getCell(i).value === "Si"
                        });
                    });

                    riesgos.forEach(r => {
                        const result = paramStatus.find(ps => ps.id === r.id);
                        if (!result) {
                            paramStatus.push({
                                id: r.id,
                                description: r.description,
                                isActive: false
                            });
                        }
                    });

                    let startDate = row.getCell(3).value;
                    try {
                        startDate = startDate !== "" ? new Date(startDate).toISOString() : "";
                    } catch (error) {
                        startDate = new Date(startDate.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$2/$1/$3"));
                    }

                    let endDate = row.getCell(4).value;
                    try {
                        endDate = endDate !== "" ? new Date(endDate).toISOString() : "";
                    } catch (error) {
                        endDate = new Date(endDate.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$2/$1/$3"));
                    }

                    const distribution = row.getCell(6).value;
                    const ranges = distribution.split("/");
                    if (ranges.length === 1) {
                        channelTmp.channels.forEach(c => {
                            c.agents.forEach(a => {
                                switch (a["typeCore"]) {
                                    case 6:
                                        // types = "CORREDOR";
                                        a["distribution"] = ranges[0];
                                        break;
                                    case 10:
                                    case 11:
                                        // types = "INTERMEDIARIO";
                                        a["distribution"] = ranges[0];
                                        break;
                                    case 97:
                                        // types = "PUNTO DE VENTA";
                                        a["distribution"] = ranges[0];
                                        break;
                                }
                            });
                        });
                    } else if (ranges.length === 2) {
                        const pre = [];
                        const dataActual = [];
                        channelTmp.channels[0].agents.forEach(a => {
                            let types = "";
                            switch (a["typeCore"]) {
                                case 6:
                                    types = "CORREDOR";
                                    break;
                                case 10:
                                case 11:
                                    types = "INTERMEDIARIO";
                                    break;
                                case 97:
                                    types = "PUNTO DE VENTA";
                                    break;
                            }
                            if (types !== "") {
                                pre.push(types);
                            }
                        });
                        ranges.forEach((r, i) => {
                            dataActual.push({ cost: r, item: pre[i] });
                        });
                        if (dataActual[0].item !== dataActual[1].item) {
                            dataActual.forEach((d, i) =>
                                channelTmp.channels.forEach(c => {
                                    c.agents.forEach(a => {
                                        switch (a["typeCore"]) {
                                            case 6:
                                                if ("CORREDOR" === d.item) {
                                                    a["distribution"] = dataActual[i].cost;
                                                }
                                                break;
                                            case 10:
                                            case 11:
                                                if ("INTERMEDIARIO" === d.item) {
                                                    a["distribution"] = dataActual[i].cost;
                                                }
                                                break;
                                            case 97:
                                                if ("PUNTO DE VENTA" === d.item) {
                                                    a["distribution"] = dataActual[i].cost;
                                                }
                                                break;
                                        }
                                    });
                                })
                            );
                        } else {
                            dataActual.forEach((d, i) =>
                                channelTmp.channels.forEach(c => {
                                    c.agents.forEach((a, j) => {
                                        if (i === j) {
                                            switch (a["typeCore"]) {
                                                case 6:
                                                    if ("CORREDOR" === d.item) {
                                                        a["distribution"] = dataActual[i].cost;
                                                    }
                                                    break;
                                                case 10:
                                                case 11:
                                                    if ("INTERMEDIARIO" === d.item) {
                                                        a["distribution"] = dataActual[i].cost;
                                                    }
                                                    break;
                                                case 97:
                                                    if ("PUNTO DE VENTA" === d.item) {
                                                        a["distribution"] = dataActual[i].cost;
                                                    }
                                                    break;
                                            }
                                        }
                                    });
                                })
                            );
                        }
                    } else if (ranges.length > 2) {
                        const pre = [];
                        const dataActual = [];
                        channelTmp.channels[0].agents.forEach(a => {
                            let types = "";
                            switch (a["typeCore"]) {
                                case 6:
                                    types = "CORREDOR";
                                    break;
                                case 10:
                                case 11:
                                    types = "INTERMEDIARIO";
                                    break;
                                case 97:
                                    types = "PUNTO DE VENTA";
                                    break;
                            }
                            if (types !== "") {
                                pre.push(types);
                            }
                        });
                        ranges.forEach((r, i) => {
                            dataActual.push({ cost: r, item: pre[i] });
                        });
                        dataActual.forEach((d, i) =>
                            channelTmp.channels.forEach(c => {
                                c.agents.forEach((a, j) => {
                                    if (i === j) {
                                        switch (a["typeCore"]) {
                                            case 6:
                                                if ("CORREDOR" === d.item) {
                                                    a["distribution"] = dataActual[i].cost;
                                                }
                                                break;
                                            case 10:
                                            case 11:
                                                if ("INTERMEDIARIO" === d.item) {
                                                    a["distribution"] = dataActual[i].cost;
                                                }
                                                break;
                                            case 97:
                                                if ("PUNTO DE VENTA" === d.item) {
                                                    a["distribution"] = dataActual[i].cost;
                                                }
                                                break;
                                        }
                                    }
                                });
                            })
                        );
                    }

                    list.push({
                        startDate: startDate,
                        endDate: endDate,
                        commission: row.getCell(5).value,
                        distribution: distribution,
                        discount: row.getCell(7).value,
                        fieldsId: ramoTmp.id,
                        channelGroup: channelTmp,
                        parameters: paramStatus
                    });
                }
            }
        });
        channelList.forEach((cl: ILinkedChannel) => {
            const ch = list.find(c => c.fieldsId === cl.fieldsId && c.channelGroup.id === cl.channelGroup.id);
            if (!ch) {
                list.push(cl);
            }
        });
        matriz.linkedChannelGroups = list;
        return matriz;
    }

    public importMatrizData(file: any, matriz: MatrizRiesgo, ...arg) {
        const workbook: ExcelProper.Workbook = new Excel.Workbook();
        workbook.xlsx.load(file).then(() => {
            const ramo = matriz.parameters.filter(d => d.isActive && d.type === "FIELD");
            const tamanno = matriz.parameters.filter(d => d.isActive && d.type === "COMPANY_SIZE");
            const riesgos = matriz.parameters.filter(d => d.isActive && d.type === "WORKER_TYPE");
            matriz = this.riskMatriz(matriz, workbook, ramo, tamanno, riesgos, arg[0], arg[1]);
            if (matriz.originTariffMatrix) {
                matriz = this.channelMatriz(matriz, workbook, ramo, arg[2], riesgos);
            }
            const event: EventEmitter<MatrizRiesgo> = arg[3];
            event.emit(matriz);
        });
    }
}
