import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type GradeType } from "./GradeSelector";
import { type ProcessingResult } from "./ResultsSummary";

interface SajungwonanPreviewProps {
  results: ProcessingResult;
  gradeType: GradeType;
  classInfo?: {
    year?: string;
    grade?: string;
    classNum?: string;
    teacher?: string;
    initialCount?: string;
    currentCount?: string;
  };
}

export default function SajungwonanPreview({ results, gradeType, classInfo }: SajungwonanPreviewProps) {
  const is3rdGrade = gradeType === "3";

  const year = classInfo?.year || "20OO";
  const grade = classInfo?.grade || "O";
  const classNum = classInfo?.classNum || "O";
  const teacher = classInfo?.teacher || "OOO";
  const initialCount = classInfo?.initialCount || "OO";
  const currentCount = classInfo?.currentCount || "OO";
  const totalAward = results.oneYearPerfect.length + results.oneYearGood.length +
    (is3rdGrade ? results.threeYearPerfect.length + results.threeYearGood.length : 0);

  const cellBorder = "border border-border";
  const cellPadding = "px-2 py-1";

  return (
    <div className="border rounded-md bg-white overflow-hidden">
      <ScrollArea className="w-full">
        <div className="min-w-[700px] p-4" style={{ fontFamily: "'Dotum', 'Malgun Gothic', sans-serif" }}>
          <div className="text-center font-bold text-lg mb-1" style={{ fontSize: "18px" }}>
            {year} 학년도 사정원안
          </div>

          <div className="h-1"></div>

          <div className="text-center font-bold mb-1" style={{ fontSize: "16px" }}>
            제  {grade} 학년 {classNum} 반 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 담 임 :  {teacher}  (인)
          </div>

          <div className="h-1"></div>

          <div className="flex justify-between font-bold mb-1" style={{ fontSize: "14px" }}>
            <span>학년초 재적수 : {initialCount}명</span>
            <span>현 재 적 수 :  {currentCount}명</span>
            <span>사정대상자수 : {totalAward}명</span>
          </div>

          <div className="h-1"></div>

          <div className={`flex ${is3rdGrade ? "gap-2" : ""}`}>
            <div className="flex-1">
              <div className="text-center font-bold py-2" style={{ fontSize: "14px" }}>
                수 상 예 정 자
              </div>

              <table className="w-full border-collapse" style={{ fontSize: "12px" }}>
                <thead>
                  <tr>
                    <th className={`${cellBorder} ${cellPadding} font-bold text-center bg-background`} style={{ width: "35px" }}>순</th>
                    <th className={`${cellBorder} ${cellPadding} font-bold text-center bg-background`} style={{ width: "70px" }}>구  분</th>
                    <th className={`${cellBorder} ${cellPadding} font-bold text-center bg-background`} style={{ width: "40px" }}>번호</th>
                    <th className={`${cellBorder} ${cellPadding} font-bold text-center bg-background`} style={{ width: "60px" }}>성  명</th>
                    <th className={`${cellBorder} ${cellPadding} font-bold text-center bg-background`} style={{ width: "120px" }}>비     고</th>
                  </tr>
                </thead>
                <tbody>
                  {results.oneYearPerfect.map((s, i) => (
                    <tr key={`1p-${i}`}>
                      <td className={`${cellBorder} ${cellPadding} text-center`}>{i + 1}</td>
                      <td className={`${cellBorder} ${cellPadding} text-center`}>1년 개근</td>
                      <td className={`${cellBorder} ${cellPadding} text-center`}>{s.studentNumber}</td>
                      <td className={`${cellBorder} ${cellPadding} text-center`}>{s.studentName}</td>
                      <td className={`${cellBorder} ${cellPadding}`}></td>
                    </tr>
                  ))}
                  {results.oneYearPerfect.length > 0 && (
                    <tr>
                      <td className={`${cellPadding}`} colSpan={4}></td>
                      <td className={`${cellPadding} text-center`}>이상 {results.oneYearPerfect.length}명</td>
                    </tr>
                  )}

                  <tr><td colSpan={5} className="h-4"></td></tr>

                  {results.oneYearGood.map((s, i) => (
                    <tr key={`1g-${i}`}>
                      <td className={`${cellBorder} ${cellPadding} text-center`}>{i + 1}</td>
                      <td className={`${cellBorder} ${cellPadding} text-center`}>1년 정근</td>
                      <td className={`${cellBorder} ${cellPadding} text-center`}>{s.studentNumber}</td>
                      <td className={`${cellBorder} ${cellPadding} text-center`}>{s.studentName}</td>
                      <td className={`${cellBorder} ${cellPadding}`}>{s.details}</td>
                    </tr>
                  ))}
                  {results.oneYearGood.length > 0 && (
                    <tr>
                      <td className={`${cellPadding}`} colSpan={4}></td>
                      <td className={`${cellPadding} text-center`}>이상 {results.oneYearGood.length}명</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {is3rdGrade && (
              <div className="flex-1">
                <div className="text-center font-bold py-2" style={{ fontSize: "14px" }}>
                  수 상 예 정 자
                </div>

                <table className="w-full border-collapse" style={{ fontSize: "12px" }}>
                  <thead>
                    <tr>
                      <th className={`${cellBorder} ${cellPadding} font-bold text-center bg-background`} style={{ width: "35px" }}>순</th>
                      <th className={`${cellBorder} ${cellPadding} font-bold text-center bg-background`} style={{ width: "70px" }}>구  분</th>
                      <th className={`${cellBorder} ${cellPadding} font-bold text-center bg-background`} style={{ width: "40px" }}>번호</th>
                      <th className={`${cellBorder} ${cellPadding} font-bold text-center bg-background`} style={{ width: "60px" }}>성  명</th>
                      <th className={`${cellBorder} ${cellPadding} font-bold text-center bg-background`} style={{ width: "120px" }}>비     고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.threeYearPerfect.map((s, i) => (
                      <tr key={`3p-${i}`}>
                        <td className={`${cellBorder} ${cellPadding} text-center`}>{i + 1}</td>
                        <td className={`${cellBorder} ${cellPadding} text-center`}>3년 개근</td>
                        <td className={`${cellBorder} ${cellPadding} text-center`}>{s.studentNumber}</td>
                        <td className={`${cellBorder} ${cellPadding} text-center`}>{s.studentName}</td>
                        <td className={`${cellBorder} ${cellPadding}`}></td>
                      </tr>
                    ))}
                    {results.threeYearPerfect.length > 0 && (
                      <tr>
                        <td className={`${cellPadding}`} colSpan={4}></td>
                        <td className={`${cellPadding} text-center`}>이상 {results.threeYearPerfect.length}명</td>
                      </tr>
                    )}

                    <tr><td colSpan={5} className="h-4"></td></tr>

                    {results.threeYearGood.map((s, i) => (
                      <tr key={`3g-${i}`}>
                        <td className={`${cellBorder} ${cellPadding} text-center`}>{i + 1}</td>
                        <td className={`${cellBorder} ${cellPadding} text-center`}>3년 정근</td>
                        <td className={`${cellBorder} ${cellPadding} text-center`}>{s.studentNumber}</td>
                        <td className={`${cellBorder} ${cellPadding} text-center`}>{s.studentName}</td>
                        <td className={`${cellBorder} ${cellPadding}`}>{s.details}</td>
                      </tr>
                    ))}
                    {results.threeYearGood.length > 0 && (
                      <tr>
                        <td className={`${cellPadding}`} colSpan={4}></td>
                        <td className={`${cellPadding} text-center`}>이상 {results.threeYearGood.length}명</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
