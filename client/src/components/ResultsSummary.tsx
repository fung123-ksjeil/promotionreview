import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Users } from "lucide-react";
import { type GradeType } from "./GradeSelector";

export interface ProcessingResult {
  oneYearPerfect: { studentNumber: string; studentName: string }[];
  oneYearGood: { studentNumber: string; studentName: string; details: string }[];
  threeYearPerfect: { studentNumber: string; studentName: string }[];
  threeYearGood: { studentNumber: string; studentName: string; details: string }[];
}

interface ResultsSummaryProps {
  results: ProcessingResult;
  gradeType: GradeType;
  onDownload: () => void;
  isDownloading: boolean;
}

export default function ResultsSummary({ results, gradeType, onDownload, isDownloading }: ResultsSummaryProps) {
  const is3rdGrade = gradeType === "3";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-chart-2">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">처리가 완료되었습니다</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                1년 개근
              </span>
              <Badge variant="secondary" className="text-sm">
                {results.oneYearPerfect.length}명
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.oneYearPerfect.length === 0 ? (
              <p className="text-sm text-muted-foreground">해당 학생 없음</p>
            ) : (
              <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                {results.oneYearPerfect.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-muted-foreground">{s.studentNumber}</span>
                    <span>{s.studentName}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                1년 정근
              </span>
              <Badge variant="secondary" className="text-sm">
                {results.oneYearGood.length}명
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.oneYearGood.length === 0 ? (
              <p className="text-sm text-muted-foreground">해당 학생 없음</p>
            ) : (
              <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                {results.oneYearGood.map((s, i) => (
                  <li key={i} className="flex gap-2 flex-wrap">
                    <span className="text-muted-foreground">{s.studentNumber}</span>
                    <span>{s.studentName}</span>
                    <span className="text-muted-foreground text-xs">({s.details})</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {is3rdGrade && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    3년 개근
                  </span>
                  <Badge variant="secondary" className="text-sm">
                    {results.threeYearPerfect.length}명
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.threeYearPerfect.length === 0 ? (
                  <p className="text-sm text-muted-foreground">해당 학생 없음</p>
                ) : (
                  <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                    {results.threeYearPerfect.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-muted-foreground">{s.studentNumber}</span>
                        <span>{s.studentName}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    3년 정근
                  </span>
                  <Badge variant="secondary" className="text-sm">
                    {results.threeYearGood.length}명
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.threeYearGood.length === 0 ? (
                  <p className="text-sm text-muted-foreground">해당 학생 없음</p>
                ) : (
                  <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                    {results.threeYearGood.map((s, i) => (
                      <li key={i} className="flex gap-2 flex-wrap">
                        <span className="text-muted-foreground">{s.studentNumber}</span>
                        <span>{s.studentName}</span>
                        <span className="text-muted-foreground text-xs">({s.details})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Button
        onClick={onDownload}
        disabled={isDownloading}
        className="w-full md:w-auto"
        data-testid="button-download"
      >
        <Download className="w-4 h-4 mr-2" />
        {isDownloading ? "다운로드 중..." : "엑셀 다운로드"}
      </Button>
    </div>
  );
}
