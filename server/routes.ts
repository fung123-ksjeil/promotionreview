import type { Express } from "express";
import { createServer, type Server } from "http";
import ExcelJS from "exceljs";

interface ProcessingResult {
  oneYearPerfect: { studentNumber: string; studentName: string }[];
  oneYearGood: { studentNumber: string; studentName: string; details: string }[];
  threeYearPerfect: { studentNumber: string; studentName: string }[];
  threeYearGood: { studentNumber: string; studentName: string; details: string }[];
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/generate-excel", async (req, res) => {
    try {
      const { gradeType, results, classInfo } = req.body as {
        gradeType: "1-2" | "3";
        results: ProcessingResult;
        classInfo?: { year?: string; grade?: string; classNum?: string; teacher?: string; initialCount?: string; currentCount?: string };
      };

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("사정원안");

      // ===== STEP 1: Set column widths (exact match) =====
      sheet.getColumn(1).width = 4.375;   // A
      sheet.getColumn(2).width = 9.5;     // B
      sheet.getColumn(3).width = 4;       // C
      sheet.getColumn(4).width = 7.5;     // D
      sheet.getColumn(5).width = 20.875;  // E
      sheet.getColumn(6).width = 3.75;    // F
      sheet.getColumn(7).width = 8.5;     // G
      sheet.getColumn(8).width = 3.875;   // H
      sheet.getColumn(9).width = 8.5;     // I
      sheet.getColumn(10).width = 20.5;   // J

      // ===== STEP 2: Set all row heights (1-42, exact match) =====
      const rowHeights: { [key: number]: number } = {
        1: 22.5, 2: 3, 3: 20.25, 4: 3, 5: 18.75, 6: 3, 7: 21.75, 8: 30.75, 9: 15.75
      };
      for (let r = 1; r <= 42; r++) {
        sheet.getRow(r).height = rowHeights[r] || 15.9;
      }

      // ===== STEP 3: Define fonts =====
      const titleFont: Partial<ExcelJS.Font> = { name: "돋움", size: 18, bold: true };
      const subTitleFont: Partial<ExcelJS.Font> = { name: "돋움", size: 16, bold: true };
      const infoFont: Partial<ExcelJS.Font> = { name: "돋움", size: 14, bold: true };
      const headerFont: Partial<ExcelJS.Font> = { name: "돋움", size: 12, bold: true };
      const dataFont: Partial<ExcelJS.Font> = { name: "돋움", size: 12 };

      // ===== STEP 4: Define border styles =====
      const doubleBorder: Partial<ExcelJS.Border> = { style: "double" };
      const dottedBorder: Partial<ExcelJS.Border> = { style: "dotted" };
      const thinBorder: Partial<ExcelJS.Border> = { style: "thin" };

      // ===== STEP 5: Define alignments =====
      const centerAlign: Partial<ExcelJS.Alignment> = { horizontal: "center", vertical: "middle" };
      const centerWrapAlign: Partial<ExcelJS.Alignment> = { horizontal: "center", vertical: "middle", wrapText: true };
      const centerShrinkAlign: Partial<ExcelJS.Alignment> = { horizontal: "center", vertical: "middle", shrinkToFit: true };
      const centerShrinkNoVAlign: Partial<ExcelJS.Alignment> = { horizontal: "center", shrinkToFit: true };

      // ===== STEP 6: Get values from classInfo (use defaults like original) =====
      const year = classInfo?.year || "20OO";
      const grade = classInfo?.grade || "O";
      const classNum = classInfo?.classNum || "O";
      const teacher = classInfo?.teacher || "OOO";
      const initialCount = classInfo?.initialCount || "OO";
      const currentCount = classInfo?.currentCount || "OO";

      // ===== STEP 7: ROW 1 - Title (merged A1:J1) =====
      sheet.mergeCells("A1:J1");
      const titleCell = sheet.getCell("A1");
      titleCell.value = `${year} 학년도 사정원안`;
      titleCell.font = titleFont;
      titleCell.alignment = centerAlign;

      // ===== STEP 8: ROW 3 - Subtitle (merged A3:J3) =====
      sheet.mergeCells("A3:J3");
      const subTitleCell = sheet.getCell("A3");
      subTitleCell.value = `제  ${grade} 학년 ${classNum} 반                       담 임 :  ${teacher}  (인)`;
      subTitleCell.font = subTitleFont;
      subTitleCell.alignment = centerAlign;

      // ===== STEP 9: ROW 5 - Info row with thin borders =====
      // A5:D5 merged
      sheet.mergeCells("A5:D5");
      const info1Cell = sheet.getCell("A5");
      info1Cell.value = `학년초 재적수 : ${initialCount}명`;
      info1Cell.font = infoFont;
      info1Cell.alignment = centerAlign;
      info1Cell.border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };
      sheet.getCell("B5").border = { top: thinBorder, bottom: thinBorder };
      sheet.getCell("C5").border = { top: thinBorder, bottom: thinBorder };
      sheet.getCell("D5").border = { right: thinBorder, top: thinBorder, bottom: thinBorder };

      // E5:G5 merged
      sheet.mergeCells("E5:G5");
      const info2Cell = sheet.getCell("E5");
      info2Cell.value = `현 재 적 수 :  ${currentCount}명`;
      info2Cell.font = infoFont;
      info2Cell.alignment = centerAlign;
      info2Cell.border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };
      sheet.getCell("F5").border = { top: thinBorder, bottom: thinBorder };
      sheet.getCell("G5").border = { right: thinBorder, top: thinBorder, bottom: thinBorder };

      // H5:J5 merged - 사정대상자수는 원본대로 OO명
      sheet.mergeCells("H5:J5");
      const info3Cell = sheet.getCell("H5");
      info3Cell.value = "사정대상자수 : OO명";
      info3Cell.font = infoFont;
      info3Cell.alignment = centerAlign;
      info3Cell.border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };
      sheet.getCell("I5").border = { top: thinBorder, bottom: thinBorder };
      sheet.getCell("J5").border = { right: thinBorder, top: thinBorder, bottom: thinBorder };

      // ===== STEP 10: ROW 7 - Award title =====
      sheet.mergeCells("A7:E7");
      const awardTitleCell = sheet.getCell("A7");
      awardTitleCell.value = "수 상 예 정 자";
      awardTitleCell.font = infoFont;
      awardTitleCell.alignment = centerAlign;

      if (gradeType === "3") {
        sheet.mergeCells("F7:J7");
        const awardTitle2Cell = sheet.getCell("F7");
        awardTitle2Cell.value = "수 상 예 정 자";
        awardTitle2Cell.font = infoFont;
        awardTitle2Cell.alignment = centerAlign;
      }

      // ===== STEP 11: ROW 8 - Headers =====
      // Left section (cols 1-5)
      const row8 = sheet.getRow(8);
      
      row8.getCell(1).value = "순";
      row8.getCell(1).font = headerFont;
      row8.getCell(1).alignment = centerWrapAlign;
      row8.getCell(1).border = { left: doubleBorder, right: dottedBorder, top: doubleBorder, bottom: dottedBorder };

      row8.getCell(2).value = "구  분";
      row8.getCell(2).font = headerFont;
      row8.getCell(2).alignment = centerWrapAlign;
      row8.getCell(2).border = { left: dottedBorder, right: dottedBorder, top: doubleBorder };

      row8.getCell(3).value = "번호";
      row8.getCell(3).font = headerFont;
      row8.getCell(3).alignment = centerWrapAlign;
      row8.getCell(3).border = { left: dottedBorder, right: dottedBorder, top: doubleBorder };

      row8.getCell(4).value = "성  명";
      row8.getCell(4).font = headerFont;
      row8.getCell(4).alignment = centerWrapAlign;
      row8.getCell(4).border = { left: dottedBorder, right: dottedBorder, top: doubleBorder };

      row8.getCell(5).value = "비     고";
      row8.getCell(5).font = headerFont;
      row8.getCell(5).alignment = centerWrapAlign;
      row8.getCell(5).border = { left: dottedBorder, right: doubleBorder, top: doubleBorder, bottom: dottedBorder };

      // Right section (cols 6-10) - ALWAYS format headers for all grades
      row8.getCell(6).value = "순";
      row8.getCell(6).font = headerFont;
      row8.getCell(6).alignment = centerWrapAlign;
      row8.getCell(6).border = { left: doubleBorder, right: dottedBorder, top: doubleBorder, bottom: dottedBorder };

      row8.getCell(7).value = "구  분";
      row8.getCell(7).font = headerFont;
      row8.getCell(7).alignment = centerWrapAlign;
      row8.getCell(7).border = { left: dottedBorder, right: dottedBorder, top: doubleBorder, bottom: dottedBorder };

      row8.getCell(8).value = "번호";
      row8.getCell(8).font = headerFont;
      row8.getCell(8).alignment = centerWrapAlign;
      row8.getCell(8).border = { left: dottedBorder, right: dottedBorder, top: doubleBorder };

      row8.getCell(9).value = "성  명";
      row8.getCell(9).font = headerFont;
      row8.getCell(9).alignment = centerWrapAlign;
      row8.getCell(9).border = { left: dottedBorder, right: dottedBorder, top: doubleBorder };

      row8.getCell(10).value = "비     고";
      row8.getCell(10).font = headerFont;
      row8.getCell(10).alignment = centerWrapAlign;
      row8.getCell(10).border = { left: dottedBorder, right: doubleBorder, top: doubleBorder, bottom: dottedBorder };

      // ===== STEP 12: Set up template for data rows (9-40) =====
      // Pre-format all data cells with borders and fonts (rows 9-39 normal, row 40 double bottom)
      for (let r = 9; r <= 40; r++) {
        const row = sheet.getRow(r);
        const isLastRow = r === 40;
        const bottomBorder = isLastRow ? doubleBorder : dottedBorder;
        
        // Left section (cols 1-5)
        row.getCell(1).font = dataFont;
        row.getCell(1).alignment = centerAlign;
        row.getCell(1).border = { left: doubleBorder, right: dottedBorder, top: dottedBorder, bottom: bottomBorder };

        row.getCell(2).font = dataFont;
        row.getCell(2).alignment = centerAlign;
        row.getCell(2).border = { left: dottedBorder, right: dottedBorder, top: dottedBorder, bottom: bottomBorder };

        row.getCell(3).font = dataFont;
        row.getCell(3).alignment = centerAlign;
        row.getCell(3).border = { left: dottedBorder, right: dottedBorder, top: dottedBorder, bottom: bottomBorder };

        row.getCell(4).font = dataFont;
        row.getCell(4).alignment = centerAlign;
        row.getCell(4).border = { left: dottedBorder, right: dottedBorder, top: dottedBorder, bottom: bottomBorder };

        row.getCell(5).font = dataFont;
        row.getCell(5).alignment = { horizontal: "center", vertical: "middle", shrinkToFit: true };
        row.getCell(5).border = { left: dottedBorder, right: doubleBorder, top: dottedBorder, bottom: bottomBorder };

        // Right section (cols 6-10) - ALWAYS format for all grades
        row.getCell(6).font = dataFont;
        row.getCell(6).alignment = centerAlign;
        row.getCell(6).border = { left: doubleBorder, right: dottedBorder, top: dottedBorder, bottom: bottomBorder };

        row.getCell(7).font = dataFont;
        row.getCell(7).alignment = centerAlign;
        row.getCell(7).border = { left: dottedBorder, right: dottedBorder, top: dottedBorder, bottom: bottomBorder };

        row.getCell(8).font = dataFont;
        row.getCell(8).alignment = centerAlign;
        row.getCell(8).border = { left: dottedBorder, right: dottedBorder, top: dottedBorder, bottom: bottomBorder };

        row.getCell(9).font = dataFont;
        row.getCell(9).alignment = centerAlign;
        row.getCell(9).border = { left: dottedBorder, right: dottedBorder, top: dottedBorder, bottom: bottomBorder };

        row.getCell(10).font = dataFont;
        row.getCell(10).alignment = { horizontal: "center", vertical: "middle", shrinkToFit: true };
        row.getCell(10).border = { left: dottedBorder, right: doubleBorder, top: dottedBorder, bottom: bottomBorder };
      }

      // ===== STEP 13: ROW 42 - Footer with thin borders =====
      const row42 = sheet.getRow(42);

      // A42:D42 merged
      sheet.mergeCells("A42:D42");
      row42.getCell(1).value = "1년 개근  : 00명";
      row42.getCell(1).font = dataFont;
      row42.getCell(1).alignment = centerAlign;
      row42.getCell(1).border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };
      row42.getCell(2).border = { top: thinBorder, bottom: thinBorder };
      row42.getCell(3).border = { top: thinBorder, bottom: thinBorder };
      row42.getCell(4).border = { right: thinBorder, top: thinBorder, bottom: thinBorder };

      // E42
      row42.getCell(5).value = "1년 정근  : 00명";
      row42.getCell(5).font = dataFont;
      row42.getCell(5).alignment = centerAlign;
      row42.getCell(5).border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };

      // F42:I42 merged - ALWAYS apply for all grades
      sheet.mergeCells("F42:I42");
      row42.getCell(6).value = "3년 개근 : 00명";
      row42.getCell(6).font = dataFont;
      row42.getCell(6).alignment = centerAlign;
      row42.getCell(6).border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };
      row42.getCell(7).border = { top: thinBorder, bottom: thinBorder };
      row42.getCell(8).border = { top: thinBorder, bottom: thinBorder };
      row42.getCell(9).border = { right: thinBorder, top: thinBorder, bottom: thinBorder };

      // J42
      row42.getCell(10).value = "3년 정근 : 00명";
      row42.getCell(10).font = dataFont;
      row42.getCell(10).alignment = centerAlign;
      row42.getCell(10).border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };

      // ===== STEP 14: Now fill in actual data =====
      let leftRow = 9;

      // 1년 개근 data
      results.oneYearPerfect.forEach((student, index) => {
        const row = sheet.getRow(leftRow);
        row.getCell(1).value = index + 1;
        row.getCell(2).value = "1년 개근";
        row.getCell(3).value = parseInt(student.studentNumber) || student.studentNumber;
        row.getCell(4).value = student.studentName;
        row.getCell(5).value = "";
        leftRow++;
      });

      // Summary for 1년 개근
      if (results.oneYearPerfect.length > 0) {
        sheet.getRow(leftRow).getCell(5).value = `이상 ${results.oneYearPerfect.length}명`;
        leftRow++;
      }

      leftRow += 2; // Gap rows

      // 1년 정근 data
      results.oneYearGood.forEach((student, index) => {
        const row = sheet.getRow(leftRow);
        row.getCell(1).value = index + 1;
        row.getCell(2).value = "1년 정근";
        row.getCell(3).value = parseInt(student.studentNumber) || student.studentNumber;
        row.getCell(4).value = student.studentName;
        row.getCell(5).value = student.details;
        leftRow++;
      });

      // Summary for 1년 정근
      if (results.oneYearGood.length > 0) {
        sheet.getRow(leftRow).getCell(5).value = `이상 ${results.oneYearGood.length}명`;
      }

      // Right section for 3rd grade
      if (gradeType === "3") {
        let rightRow = 9;

        // 3년 개근 data
        results.threeYearPerfect.forEach((student, index) => {
          const row = sheet.getRow(rightRow);
          row.getCell(6).value = index + 1;
          row.getCell(7).value = "3년 개근";
          row.getCell(8).value = parseInt(student.studentNumber) || student.studentNumber;
          row.getCell(9).value = student.studentName;
          row.getCell(10).value = "";
          rightRow++;
        });

        // Summary for 3년 개근
        if (results.threeYearPerfect.length > 0) {
          sheet.getRow(rightRow).getCell(10).value = `이상 ${results.threeYearPerfect.length}명`;
          rightRow++;
        }

        rightRow += 2; // Gap rows

        // 3년 정근 data
        results.threeYearGood.forEach((student, index) => {
          const row = sheet.getRow(rightRow);
          row.getCell(6).value = index + 1;
          row.getCell(7).value = "3년 정근";
          row.getCell(8).value = parseInt(student.studentNumber) || student.studentNumber;
          row.getCell(9).value = student.studentName;
          row.getCell(10).value = student.details;
          rightRow++;
        });

        // Summary for 3년 정근
        if (results.threeYearGood.length > 0) {
          sheet.getRow(rightRow).getCell(10).value = `이상 ${results.threeYearGood.length}명`;
        }
      }

      // ===== STEP 15: Update footer with actual counts =====
      const oneYearPerfectCount = results.oneYearPerfect.length;
      const oneYearGoodCount = results.oneYearGood.length;
      row42.getCell(1).value = `1년 개근  : ${oneYearPerfectCount}명`;
      row42.getCell(5).value = `1년 정근  : ${oneYearGoodCount}명`;

      if (gradeType === "3") {
        const threeYearPerfectCount = results.threeYearPerfect.length;
        const threeYearGoodCount = results.threeYearGood.length;
        row42.getCell(6).value = `3년 개근 : ${threeYearPerfectCount}명`;
        row42.getCell(10).value = `3년 정근 : ${threeYearGoodCount}명`;
      }

      const buffer = await workbook.xlsx.writeBuffer();

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=sajungwonan_${gradeType}.xlsx`
      );
      res.send(buffer);
    } catch (error) {
      console.error("Excel generation error:", error);
      res.status(500).json({ error: "Failed to generate Excel file" });
    }
  });

  return httpServer;
}
