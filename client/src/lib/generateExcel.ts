import ExcelJS from "exceljs";

interface ProcessingResult {
  oneYearPerfect: { studentNumber: string; studentName: string }[];
  oneYearGood: { studentNumber: string; studentName: string; details: string }[];
  threeYearPerfect: { studentNumber: string; studentName: string }[];
  threeYearGood: { studentNumber: string; studentName: string; details: string }[];
}

interface ClassInfo {
  year?: string;
  grade?: string;
  classNum?: string;
  teacher?: string;
  initialCount?: string;
  currentCount?: string;
}

export async function generateExcelAndDownload(
  gradeType: "1-2" | "3",
  results: ProcessingResult,
  classInfo?: ClassInfo
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("사정원안");

  sheet.getColumn(1).width = 4.375;
  sheet.getColumn(2).width = 9.5;
  sheet.getColumn(3).width = 4;
  sheet.getColumn(4).width = 7.5;
  sheet.getColumn(5).width = 20.875;
  sheet.getColumn(6).width = 3.75;
  sheet.getColumn(7).width = 8.5;
  sheet.getColumn(8).width = 3.875;
  sheet.getColumn(9).width = 8.5;
  sheet.getColumn(10).width = 20.5;

  const rowHeights: { [key: number]: number } = {
    1: 22.5, 2: 3, 3: 20.25, 4: 3, 5: 18.75, 6: 3, 7: 21.75, 8: 30.75, 9: 15.75
  };
  for (let r = 1; r <= 42; r++) {
    sheet.getRow(r).height = rowHeights[r] || 15.9;
  }

  const titleFont: Partial<ExcelJS.Font> = { name: "돋움", size: 18, bold: true };
  const subTitleFont: Partial<ExcelJS.Font> = { name: "돋움", size: 16, bold: true };
  const infoFont: Partial<ExcelJS.Font> = { name: "돋움", size: 14, bold: true };
  const headerFont: Partial<ExcelJS.Font> = { name: "돋움", size: 12, bold: true };
  const dataFont: Partial<ExcelJS.Font> = { name: "돋움", size: 12 };

  const doubleBorder: Partial<ExcelJS.Border> = { style: "double" };
  const dottedBorder: Partial<ExcelJS.Border> = { style: "dotted" };
  const thinBorder: Partial<ExcelJS.Border> = { style: "thin" };

  const centerAlign: Partial<ExcelJS.Alignment> = { horizontal: "center", vertical: "middle" };
  const centerWrapAlign: Partial<ExcelJS.Alignment> = { horizontal: "center", vertical: "middle", wrapText: true };

  const year = classInfo?.year || "20OO";
  const grade = classInfo?.grade || "O";
  const classNum = classInfo?.classNum || "O";
  const teacher = classInfo?.teacher || "OOO";
  const initialCount = classInfo?.initialCount || "OO";
  const currentCount = classInfo?.currentCount || "OO";

  sheet.mergeCells("A1:J1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = `${year} 학년도 사정원안`;
  titleCell.font = titleFont;
  titleCell.alignment = centerAlign;

  sheet.mergeCells("A3:J3");
  const subTitleCell = sheet.getCell("A3");
  subTitleCell.value = `제  ${grade} 학년 ${classNum} 반                       담 임 :  ${teacher}  (인)`;
  subTitleCell.font = subTitleFont;
  subTitleCell.alignment = centerAlign;

  sheet.mergeCells("A5:D5");
  const info1Cell = sheet.getCell("A5");
  info1Cell.value = `학년초 재적수 : ${initialCount}명`;
  info1Cell.font = infoFont;
  info1Cell.alignment = centerAlign;
  info1Cell.border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };
  sheet.getCell("B5").border = { top: thinBorder, bottom: thinBorder };
  sheet.getCell("C5").border = { top: thinBorder, bottom: thinBorder };
  sheet.getCell("D5").border = { right: thinBorder, top: thinBorder, bottom: thinBorder };

  sheet.mergeCells("E5:G5");
  const info2Cell = sheet.getCell("E5");
  info2Cell.value = `현 재 적 수 :  ${currentCount}명`;
  info2Cell.font = infoFont;
  info2Cell.alignment = centerAlign;
  info2Cell.border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };
  sheet.getCell("F5").border = { top: thinBorder, bottom: thinBorder };
  sheet.getCell("G5").border = { right: thinBorder, top: thinBorder, bottom: thinBorder };

  sheet.mergeCells("H5:J5");
  const info3Cell = sheet.getCell("H5");
  info3Cell.value = "사정대상자수 : OO명";
  info3Cell.font = infoFont;
  info3Cell.alignment = centerAlign;
  info3Cell.border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };
  sheet.getCell("I5").border = { top: thinBorder, bottom: thinBorder };
  sheet.getCell("J5").border = { right: thinBorder, top: thinBorder, bottom: thinBorder };

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

  for (let r = 9; r <= 40; r++) {
    const row = sheet.getRow(r);
    const isLastRow = r === 40;
    const bottomBorder = isLastRow ? doubleBorder : dottedBorder;

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

  const row42 = sheet.getRow(42);
  sheet.mergeCells("A42:D42");
  row42.getCell(1).value = `1년 개근  : ${results.oneYearPerfect.length}명`;
  row42.getCell(1).font = dataFont;
  row42.getCell(1).alignment = centerAlign;
  row42.getCell(1).border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };
  row42.getCell(2).border = { top: thinBorder, bottom: thinBorder };
  row42.getCell(3).border = { top: thinBorder, bottom: thinBorder };
  row42.getCell(4).border = { right: thinBorder, top: thinBorder, bottom: thinBorder };
  row42.getCell(5).value = `1년 정근  : ${results.oneYearGood.length}명`;
  row42.getCell(5).font = dataFont;
  row42.getCell(5).alignment = centerAlign;
  row42.getCell(5).border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };
  sheet.mergeCells("F42:I42");
  row42.getCell(6).value = gradeType === "3" ? `3년 개근 : ${results.threeYearPerfect.length}명` : "3년 개근 : -";
  row42.getCell(6).font = dataFont;
  row42.getCell(6).alignment = centerAlign;
  row42.getCell(6).border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };
  row42.getCell(7).border = { top: thinBorder, bottom: thinBorder };
  row42.getCell(8).border = { top: thinBorder, bottom: thinBorder };
  row42.getCell(9).border = { right: thinBorder, top: thinBorder, bottom: thinBorder };
  row42.getCell(10).value = gradeType === "3" ? `3년 정근 : ${results.threeYearGood.length}명` : "3년 정근 : -";
  row42.getCell(10).font = dataFont;
  row42.getCell(10).alignment = centerAlign;
  row42.getCell(10).border = { left: thinBorder, right: thinBorder, top: thinBorder, bottom: thinBorder };

  let leftRow = 9;
  results.oneYearPerfect.forEach((student, index) => {
    const row = sheet.getRow(leftRow);
    row.getCell(1).value = index + 1;
    row.getCell(2).value = "1년 개근";
    row.getCell(3).value = parseInt(student.studentNumber) || student.studentNumber;
    row.getCell(4).value = student.studentName;
    row.getCell(5).value = "";
    leftRow++;
  });
  if (results.oneYearPerfect.length > 0) {
    sheet.getRow(leftRow).getCell(5).value = `이상 ${results.oneYearPerfect.length}명`;
    leftRow++;
  }
  leftRow += 2;

  results.oneYearGood.forEach((student, index) => {
    const row = sheet.getRow(leftRow);
    row.getCell(1).value = index + 1;
    row.getCell(2).value = "1년 정근";
    row.getCell(3).value = parseInt(student.studentNumber) || student.studentNumber;
    row.getCell(4).value = student.studentName;
    row.getCell(5).value = student.details;
    leftRow++;
  });
  if (results.oneYearGood.length > 0) {
    sheet.getRow(leftRow).getCell(5).value = `이상 ${results.oneYearGood.length}명`;
  }

  if (gradeType === "3") {
    let rightRow = 9;
    results.threeYearPerfect.forEach((student, index) => {
      const row = sheet.getRow(rightRow);
      row.getCell(6).value = index + 1;
      row.getCell(7).value = "3년 개근";
      row.getCell(8).value = parseInt(student.studentNumber) || student.studentNumber;
      row.getCell(9).value = student.studentName;
      row.getCell(10).value = "";
      rightRow++;
    });
    if (results.threeYearPerfect.length > 0) {
      sheet.getRow(rightRow).getCell(10).value = `이상 ${results.threeYearPerfect.length}명`;
      rightRow++;
    }
    rightRow += 2;
    results.threeYearGood.forEach((student, index) => {
      const row = sheet.getRow(rightRow);
      row.getCell(6).value = index + 1;
      row.getCell(7).value = "3년 정근";
      row.getCell(8).value = parseInt(student.studentNumber) || student.studentNumber;
      row.getCell(9).value = student.studentName;
      row.getCell(10).value = student.details;
      rightRow++;
    });
    if (results.threeYearGood.length > 0) {
      sheet.getRow(rightRow).getCell(10).value = `이상 ${results.threeYearGood.length}명`;
    }
  }

  // 브라우저에서 Blob으로 다운로드
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `사정원안_${gradeType === "3" ? "3학년" : "1-2학년"}.xlsx`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
