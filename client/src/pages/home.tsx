import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, FileSpreadsheet, AlertCircle, Download, CheckCircle } from "lucide-react";
import GradeSelector, { type GradeType } from "@/components/GradeSelector";
import ExcelGrid from "@/components/ExcelGrid";
import DataPreviewTable, { type StudentData } from "@/components/DataPreviewTable";
import SajungwonanPreview from "@/components/SajungwonanPreview";
import { type ProcessingResult } from "@/components/ResultsSummary";
import { generateExcelAndDownload } from "@/lib/generateExcel";

type ProcessingStatus = "idle" | "processing" | "complete" | "error";

export default function Home() {
  const { toast } = useToast();
  const [gradeType, setGradeType] = useState<GradeType>("1-2");
  const [rawInput, setRawInput] = useState("");
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const parseExcelData = useCallback((text: string): StudentData[] => {
    const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const lines = normalizedText.trim().split("\n").filter(line => line.trim() !== "");
    const parsedData: StudentData[] = [];

    // 유효한 데이터 행: 번호(col0) 또는 학년(col2) 중 하나라도 숫자이면 유효
    const isValidDataLine = (line: string): boolean => {
      const cells = line.split("\t");
      const col0 = cells[0]?.trim();
      const col2 = cells[2]?.trim();
      return !isNaN(parseInt(col0)) || !isNaN(parseInt(col2));
    };

    // 3학년용: 3행 단위로 학생 데이터 처리 (Python 코드와 동일)
    if (gradeType === "3") {
      // 헤더/빈 행 제외: 번호(col0)와 학년(col2) 모두 숫자가 아닌 행은 건너뜀
      const dataLines = lines.filter(isValidDataLine);

      // 3행씩 그룹핑 - 첫 번째 행에 학생번호/이름이 있고, 2-3번째 행은 비어있을 수 있음
      for (let i = 0; i < dataLines.length; i += 3) {
        if (i + 2 >= dataLines.length) break;

        const row1 = dataLines[i].split("\t");     // 1학년
        const row2 = dataLines[i + 1].split("\t"); // 2학년
        const row3 = dataLines[i + 2].split("\t"); // 3학년

        // 첫 번째 행에서 학생번호와 이름 추출
        const studentNumber = row1[0]?.trim();
        const studentName = row1[1]?.trim();

        if (!studentNumber || !studentName) continue;

        // 이미지 분석 결과: 열 구조
        // A(0):번호, B(1):이름, C(2):학년, D(3):반, E(4):결석1, F(5):결석2, G(6):결석3, 
        // H(7):지각1, I(8):지각2, J(9):지각3, K(10):조퇴1, L(11):조퇴2, M(12):조퇴3,
        // N(13):결과1, O(14):결과2, P(15):결과3
        
        // 각 행의 3개 열을 합산
        const parseRowSum = (row: string[], startIdx: number): number => {
          return (parseInt(row[startIdx] || "0") || 0) +
                 (parseInt(row[startIdx + 1] || "0") || 0) +
                 (parseInt(row[startIdx + 2] || "0") || 0);
        };

        // Excel 붙여넣기 시 빈 셀도 탭으로 구분되어 있어서 열 인덱스 동일
        // 오프셋 없이 모든 행에서 동일한 인덱스 사용

        // 열 구조: 번호(0), 이름(1), 학년(2), 수업일수(3), 결석질병(4), 결석미인정(5), 결석기타(6),
        // 지각질병(7), 지각미인정(8), 지각기타(9), 조퇴질병(10), 조퇴미인정(11), 조퇴기타(12),
        // 결과질병(13), 결과미인정(14), 결과기타(15)
        const parseGrade = (row: string[]): number => {
          return parseInt(row[2] || "0") || 0;
        };
        const parseSchoolDays = (row: string[]): number => {
          return parseInt(row[3] || "0") || 0;
        };
        const parseValue = (row: string[], idx: number): number => {
          return parseInt(row[idx] || "0") || 0;
        };

        const student: StudentData = {
          studentNumber,
          studentName,
          // 학년
          grade1: parseGrade(row1),
          grade2: parseGrade(row2),
          grade3: parseGrade(row3),
          // 수업일수
          schoolDays1: parseSchoolDays(row1),
          schoolDays2: parseSchoolDays(row2),
          schoolDays3: parseSchoolDays(row3),
          // 결석: E-G 열 (index 4-6) - 질병, 미인정, 기타
          absenceIllness1: parseValue(row1, 4),
          absenceUnexcused1: parseValue(row1, 5),
          absenceOther1: parseValue(row1, 6),
          absenceIllness2: parseValue(row2, 4),
          absenceUnexcused2: parseValue(row2, 5),
          absenceOther2: parseValue(row2, 6),
          absenceIllness3: parseValue(row3, 4),
          absenceUnexcused3: parseValue(row3, 5),
          absenceOther3: parseValue(row3, 6),
          // 지각: H-J 열 (index 7-9) - 질병, 미인정, 기타
          lateIllness1: parseValue(row1, 7),
          lateUnexcused1: parseValue(row1, 8),
          lateOther1: parseValue(row1, 9),
          lateIllness2: parseValue(row2, 7),
          lateUnexcused2: parseValue(row2, 8),
          lateOther2: parseValue(row2, 9),
          lateIllness3: parseValue(row3, 7),
          lateUnexcused3: parseValue(row3, 8),
          lateOther3: parseValue(row3, 9),
          // 조퇴: K-M 열 (index 10-12) - 질병, 미인정, 기타
          earlyLeaveIllness1: parseValue(row1, 10),
          earlyLeaveUnexcused1: parseValue(row1, 11),
          earlyLeaveOther1: parseValue(row1, 12),
          earlyLeaveIllness2: parseValue(row2, 10),
          earlyLeaveUnexcused2: parseValue(row2, 11),
          earlyLeaveOther2: parseValue(row2, 12),
          earlyLeaveIllness3: parseValue(row3, 10),
          earlyLeaveUnexcused3: parseValue(row3, 11),
          earlyLeaveOther3: parseValue(row3, 12),
          // 결과: N-P 열 (index 13-15) - 질병, 미인정, 기타
          classAbsenceIllness1: parseValue(row1, 13),
          classAbsenceUnexcused1: parseValue(row1, 14),
          classAbsenceOther1: parseValue(row1, 15),
          classAbsenceIllness2: parseValue(row2, 13),
          classAbsenceUnexcused2: parseValue(row2, 14),
          classAbsenceOther2: parseValue(row2, 15),
          classAbsenceIllness3: parseValue(row3, 13),
          classAbsenceUnexcused3: parseValue(row3, 14),
          classAbsenceOther3: parseValue(row3, 15),
          // 합계
          absence1: parseRowSum(row1, 4),
          absence2: parseRowSum(row2, 4),
          absence3: parseRowSum(row3, 4),
          late1: parseRowSum(row1, 7),
          late2: parseRowSum(row2, 7),
          late3: parseRowSum(row3, 7),
          earlyLeave1: parseRowSum(row1, 10),
          earlyLeave2: parseRowSum(row2, 10),
          earlyLeave3: parseRowSum(row3, 10),
          classAbsence1: parseRowSum(row1, 13),
          classAbsence2: parseRowSum(row2, 13),
          classAbsence3: parseRowSum(row3, 13),
        };

        parsedData.push(student);
      }
    } else {
      // 1-2학년용: 1행 단위로 처리
      for (const line of lines) {
        if (!isValidDataLine(line)) continue;

        const cells = line.split("\t");
        if (cells.length < 2) continue;

        const studentNumber = cells[0]?.trim();
        const studentName = cells[1]?.trim();

        if (!studentNumber || !studentName) {
          continue;
        }

        // 1-2학년은 단일 행에서 값을 읽음 - 열 구조: 번호(0), 이름(1), 학년(2), 수업일수(3), 결석(4-6), 지각(7-9), 조퇴(10-12), 결과(13-15)
        const student: StudentData = {
          studentNumber,
          studentName,
          grade1: parseInt(cells[2] || "0") || 0,
          schoolDays1: parseInt(cells[3] || "0") || 0,
          // 결석: E-G 열 (index 4-6) - 질병, 미인정, 기타
          absenceIllness1: parseInt(cells[4] || "0") || 0,
          absenceUnexcused1: parseInt(cells[5] || "0") || 0,
          absenceOther1: parseInt(cells[6] || "0") || 0,
          // 지각: H-J 열 (index 7-9) - 질병, 미인정, 기타
          lateIllness1: parseInt(cells[7] || "0") || 0,
          lateUnexcused1: parseInt(cells[8] || "0") || 0,
          lateOther1: parseInt(cells[9] || "0") || 0,
          // 조퇴: K-M 열 (index 10-12) - 질병, 미인정, 기타
          earlyLeaveIllness1: parseInt(cells[10] || "0") || 0,
          earlyLeaveUnexcused1: parseInt(cells[11] || "0") || 0,
          earlyLeaveOther1: parseInt(cells[12] || "0") || 0,
          // 결과: N-P 열 (index 13-15) - 질병, 미인정, 기타
          classAbsenceIllness1: parseInt(cells[13] || "0") || 0,
          classAbsenceUnexcused1: parseInt(cells[14] || "0") || 0,
          classAbsenceOther1: parseInt(cells[15] || "0") || 0,
          // 합계 유지
          absence1: (parseInt(cells[4] || "0") || 0) + (parseInt(cells[5] || "0") || 0) + (parseInt(cells[6] || "0") || 0),
          late1: (parseInt(cells[7] || "0") || 0) + (parseInt(cells[8] || "0") || 0) + (parseInt(cells[9] || "0") || 0),
          earlyLeave1: (parseInt(cells[10] || "0") || 0) + (parseInt(cells[11] || "0") || 0) + (parseInt(cells[12] || "0") || 0),
          classAbsence1: (parseInt(cells[13] || "0") || 0) + (parseInt(cells[14] || "0") || 0) + (parseInt(cells[15] || "0") || 0),
        };

        parsedData.push(student);
      }
    }

    return parsedData;
  }, [gradeType]);

  const validateAndSetData = useCallback((data: string, parsed: StudentData[]) => {
    if (!data.trim()) {
      setParseError(null);
      return;
    }

    const lines = data.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
      .trim().split("\n")
      .filter(line => line.trim() !== "");

    const isValidLine = (line: string): boolean => {
      const cells = line.split("\t");
      const col0 = cells[0]?.trim();
      const col2 = cells[2]?.trim();
      return !isNaN(parseInt(col0)) || !isNaN(parseInt(col2));
    };

    const nonHeaderLines = lines.filter(isValidLine);

    if (parsed.length === 0) {
      if (nonHeaderLines.length === 0 && lines.length > 0) {
        setParseError("붙여넣은 데이터가 헤더 행만 포함하고 있습니다. 학생 데이터 행도 함께 복사해서 붙여넣으세요.");
      } else if (nonHeaderLines.length > 0) {
        setParseError("학생 데이터를 찾을 수 없습니다. 올바른 열 구조인지 확인하고 다시 붙여넣으세요.");
      } else {
        setParseError(null);
      }
    } else {
      setParseError(null);
    }
  }, []);

  const handlePaste = useCallback((data: string) => {
    setRawInput(data);
    const parsed = parseExcelData(data);
    setStudentData(parsed);
    validateAndSetData(data, parsed);
    setStatus("idle");
    setResults(null);
  }, [parseExcelData, validateAndSetData]);

  // 학년 타입 변경 시 데이터 재파싱
  useEffect(() => {
    if (rawInput) {
      const parsed = parseExcelData(rawInput);
      setStudentData(parsed);
      validateAndSetData(rawInput, parsed);
      setStatus("idle");
      setResults(null);
    }
  }, [gradeType, parseExcelData, rawInput, validateAndSetData]);

  const handleClear = useCallback(() => {
    setRawInput("");
    setStudentData([]);
    setParseError(null);
    setStatus("idle");
    setResults(null);
  }, []);

  const processData = useCallback(() => {
    if (studentData.length === 0) return;

    setStatus("processing");

    setTimeout(() => {
      const is3rdGrade = gradeType === "3";
      const result: ProcessingResult = {
        oneYearPerfect: [],
        oneYearGood: [],
        threeYearPerfect: [],
        threeYearGood: [],
      };

      for (const student of studentData) {
        const totalAbsence = (student.absence1 || 0) + (student.absence2 || 0) + (student.absence3 || 0);
        const totalLate = (student.late1 || 0) + (student.late2 || 0) + (student.late3 || 0);
        const totalEarlyLeave = (student.earlyLeave1 || 0) + (student.earlyLeave2 || 0) + (student.earlyLeave3 || 0);
        const totalClassAbsence = (student.classAbsence1 || 0) + (student.classAbsence2 || 0) + (student.classAbsence3 || 0);

        const lastAbsence = is3rdGrade ? (student.absence3 || 0) : totalAbsence;
        const lastLate = is3rdGrade ? (student.late3 || 0) : totalLate;
        const lastEarlyLeave = is3rdGrade ? (student.earlyLeave3 || 0) : totalEarlyLeave;
        const lastClassAbsence = is3rdGrade ? (student.classAbsence3 || 0) : totalClassAbsence;

        const oneYearTotal = lastAbsence + lastLate + lastEarlyLeave + lastClassAbsence;
        const oneYearScore = lastAbsence * 3 + lastLate + lastEarlyLeave + lastClassAbsence;

        if (oneYearTotal === 0) {
          result.oneYearPerfect.push({
            studentNumber: student.studentNumber,
            studentName: student.studentName,
          });
        } else if (oneYearScore < 9) {
          const details: string[] = [];
          if (lastAbsence > 0) details.push(`결석${lastAbsence}`);
          if (lastLate > 0) details.push(`지각${lastLate}`);
          if (lastEarlyLeave > 0) details.push(`조퇴${lastEarlyLeave}`);
          if (lastClassAbsence > 0) details.push(`결과${lastClassAbsence}`);

          result.oneYearGood.push({
            studentNumber: student.studentNumber,
            studentName: student.studentName,
            details: details.join(","),
          });
        }

        if (is3rdGrade) {
          const threeYearTotal = totalAbsence + totalLate + totalEarlyLeave + totalClassAbsence;
          const threeYearScore = totalAbsence * 3 + totalLate + totalEarlyLeave + totalClassAbsence;

          if (threeYearTotal === 0) {
            result.threeYearPerfect.push({
              studentNumber: student.studentNumber,
              studentName: student.studentName,
            });
          } else if (threeYearScore < 9) {
            const details: string[] = [];
            if (totalAbsence > 0) details.push(`결석${totalAbsence}`);
            if (totalLate > 0) details.push(`지각${totalLate}`);
            if (totalEarlyLeave > 0) details.push(`조퇴${totalEarlyLeave}`);
            if (totalClassAbsence > 0) details.push(`결과${totalClassAbsence}`);

            result.threeYearGood.push({
              studentNumber: student.studentNumber,
              studentName: student.studentName,
              details: details.join(","),
            });
          }
        }
      }

      setResults(result);
      setStatus("complete");

      const toastInstance = toast({
        title: "처리 완료",
        description: "사정원안 데이터가 생성되었습니다.",
      });
      
      // 1초 후 자동으로 사라지게
      setTimeout(() => {
        toastInstance.dismiss();
      }, 1000);
    }, 500);
  }, [studentData, gradeType, toast]);

  const handleDownload = useCallback(async () => {
    if (!results) return;

    setIsDownloading(true);

    try {
      await generateExcelAndDownload(gradeType, results);

      const toastInstance = toast({
        title: "다운로드 완료",
        description: "엑셀 파일이 다운로드되었습니다.",
      });
      setTimeout(() => toastInstance.dismiss(), 1000);
    } catch (error) {
      const errorToast = toast({
        variant: "destructive",
        title: "다운로드 실패",
        description: "파일 생성 중 오류가 발생했습니다.",
      });
      setTimeout(() => errorToast.dismiss(), 1000);
    } finally {
      setIsDownloading(false);
    }
  }, [results, gradeType, toast]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileSpreadsheet className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">사정원안 생성기</h1>
          </div>
          <p className="text-muted-foreground">
            나이스 출결 데이터 처리 시스템
          </p>
        </header>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">학년 선택</CardTitle>
            </CardHeader>
            <CardContent>
              <GradeSelector value={gradeType} onChange={setGradeType} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
              <CardTitle className="text-lg">데이터 입력</CardTitle>
              {rawInput && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleClear}
                  data-testid="button-clear-input"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  데이터 지우기
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 rounded-md p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  <p className="font-medium">사전 작업</p>
                  <p className="text-muted-foreground">출결마감 후 학교생활기록부 반영 후 실시</p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">데이터 추출 경로</p>
                  <p className="text-muted-foreground">
                    나이스 &gt; 학급담임 &gt; 학생부/학교생활기록부 &gt; 학생부 항목별 조회 &gt; 출결상황
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">데이터 저장 방법</p>
                  <p className="text-muted-foreground">
                    조회 후 저장('XLS Data' 형식)한 파일의 데이터 부분을 아래 열 구조에 맞게 붙여넣으세요.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">열 구조 안내</p>
                <div className="overflow-x-auto border rounded-md">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border border-border px-2 py-1 text-center whitespace-nowrap" rowSpan={2}>번호</th>
                        <th className="border border-border px-2 py-1 text-center whitespace-nowrap" rowSpan={2}>성명</th>
                        <th className="border border-border px-2 py-1 text-center whitespace-nowrap" rowSpan={2}>학년</th>
                        <th className="border border-border px-2 py-1 text-center whitespace-nowrap" rowSpan={2}>수업일수</th>
                        <th className="border border-border px-2 py-1 text-center whitespace-nowrap" colSpan={3}>결석</th>
                        <th className="border border-border px-2 py-1 text-center whitespace-nowrap" colSpan={3}>지각</th>
                        <th className="border border-border px-2 py-1 text-center whitespace-nowrap" colSpan={3}>조퇴</th>
                        <th className="border border-border px-2 py-1 text-center whitespace-nowrap" colSpan={3}>결과</th>
                      </tr>
                      <tr className="bg-muted/30">
                        <th className="border border-border px-2 py-0.5 text-center text-muted-foreground whitespace-nowrap">질병</th>
                        <th className="border border-border px-2 py-0.5 text-center text-muted-foreground whitespace-nowrap">미인정</th>
                        <th className="border border-border px-2 py-0.5 text-center text-muted-foreground whitespace-nowrap">기타</th>
                        <th className="border border-border px-2 py-0.5 text-center text-muted-foreground whitespace-nowrap">질병</th>
                        <th className="border border-border px-2 py-0.5 text-center text-muted-foreground whitespace-nowrap">미인정</th>
                        <th className="border border-border px-2 py-0.5 text-center text-muted-foreground whitespace-nowrap">기타</th>
                        <th className="border border-border px-2 py-0.5 text-center text-muted-foreground whitespace-nowrap">질병</th>
                        <th className="border border-border px-2 py-0.5 text-center text-muted-foreground whitespace-nowrap">미인정</th>
                        <th className="border border-border px-2 py-0.5 text-center text-muted-foreground whitespace-nowrap">기타</th>
                        <th className="border border-border px-2 py-0.5 text-center text-muted-foreground whitespace-nowrap">질병</th>
                        <th className="border border-border px-2 py-0.5 text-center text-muted-foreground whitespace-nowrap">미인정</th>
                        <th className="border border-border px-2 py-0.5 text-center text-muted-foreground whitespace-nowrap">기타</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>

              <ExcelGrid
                value={rawInput}
                onChange={setRawInput}
                onPaste={handlePaste}
              />

              {parseError && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2" data-testid="parse-error-message">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {studentData.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  데이터 미리보기
                  <span className="text-sm font-normal text-muted-foreground">
                    ({studentData.length}명)
                  </span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleClear}
                  data-testid="button-clear"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  데이터 지우기
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <DataPreviewTable data={studentData} gradeType={gradeType} />

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button
                    onClick={processData}
                    disabled={status === "processing"}
                    data-testid="button-process"
                  >
                    {status === "processing" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        처리 중...
                      </>
                    ) : (
                      "사정원안 생성"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {status === "error" && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-5 h-5" />
                  <span>처리 중 오류가 발생했습니다. 데이터 형식을 확인해주세요.</span>
                </div>
              </CardContent>
            </Card>
          )}

          {status === "complete" && results && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-chart-2" />
                  사정원안 미리보기
                </CardTitle>
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  data-testid="button-download"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      다운로드 중...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      엑셀 다운로드
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">1년 개근:</span>
                    <span className="font-semibold">{results.oneYearPerfect.length}명</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">1년 정근:</span>
                    <span className="font-semibold">{results.oneYearGood.length}명</span>
                  </div>
                  {gradeType === "3" && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">3년 개근:</span>
                        <span className="font-semibold">{results.threeYearPerfect.length}명</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">3년 정근:</span>
                        <span className="font-semibold">{results.threeYearGood.length}명</span>
                      </div>
                    </>
                  )}
                </div>
                <SajungwonanPreview results={results} gradeType={gradeType} />
              </CardContent>
            </Card>
          )}
        </div>

        <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          사정원안 생성기 v1.0
        </footer>
      </div>
    </div>
  );
}
