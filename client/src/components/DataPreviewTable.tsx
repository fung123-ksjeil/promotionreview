import { Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type GradeType } from "./GradeSelector";

export interface StudentData {
  studentNumber: string;
  studentName: string;
  grade1?: number;
  grade2?: number;
  grade3?: number;
  classNum1?: number;
  classNum2?: number;
  classNum3?: number;
  schoolDays1?: number;
  schoolDays2?: number;
  schoolDays3?: number;
  absenceIllness1?: number;
  absenceIllness2?: number;
  absenceIllness3?: number;
  absenceUnexcused1?: number;
  absenceUnexcused2?: number;
  absenceUnexcused3?: number;
  absenceOther1?: number;
  absenceOther2?: number;
  absenceOther3?: number;
  lateIllness1?: number;
  lateIllness2?: number;
  lateIllness3?: number;
  lateUnexcused1?: number;
  lateUnexcused2?: number;
  lateUnexcused3?: number;
  lateOther1?: number;
  lateOther2?: number;
  lateOther3?: number;
  earlyLeaveIllness1?: number;
  earlyLeaveIllness2?: number;
  earlyLeaveIllness3?: number;
  earlyLeaveUnexcused1?: number;
  earlyLeaveUnexcused2?: number;
  earlyLeaveUnexcused3?: number;
  earlyLeaveOther1?: number;
  earlyLeaveOther2?: number;
  earlyLeaveOther3?: number;
  classAbsenceIllness1?: number;
  classAbsenceIllness2?: number;
  classAbsenceIllness3?: number;
  classAbsenceUnexcused1?: number;
  classAbsenceUnexcused2?: number;
  classAbsenceUnexcused3?: number;
  classAbsenceOther1?: number;
  classAbsenceOther2?: number;
  classAbsenceOther3?: number;
  absence1?: number;
  absence2?: number;
  absence3?: number;
  late1?: number;
  late2?: number;
  late3?: number;
  earlyLeave1?: number;
  earlyLeave2?: number;
  earlyLeave3?: number;
  classAbsence1?: number;
  classAbsence2?: number;
  classAbsence3?: number;
}

interface DataPreviewTableProps {
  data: StudentData[];
  gradeType: GradeType;
}

export default function DataPreviewTable({ data, gradeType }: DataPreviewTableProps) {
  if (data.length === 0) {
    return null;
  }

  const is3rdGrade = gradeType === "3";

  return (
    <div className="border rounded-md">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            {is3rdGrade ? (
              <>
                <TableRow className="bg-muted/50">
                  <TableHead rowSpan={2} className="font-semibold text-xs uppercase tracking-wide text-center w-12 border-b-0">번호</TableHead>
                  <TableHead rowSpan={2} className="font-semibold text-xs uppercase tracking-wide border-b-0 w-16">성명</TableHead>
                  <TableHead rowSpan={2} className="font-semibold text-xs uppercase tracking-wide text-center border-b-0 w-12">학년</TableHead>
                  <TableHead rowSpan={2} className="font-semibold text-xs uppercase tracking-wide text-center border-b-0">수업일수</TableHead>
                  <TableHead colSpan={3} className="font-semibold text-xs uppercase tracking-wide text-center border-l">결석</TableHead>
                  <TableHead colSpan={3} className="font-semibold text-xs uppercase tracking-wide text-center border-l">지각</TableHead>
                  <TableHead colSpan={3} className="font-semibold text-xs uppercase tracking-wide text-center border-l">조퇴</TableHead>
                  <TableHead colSpan={3} className="font-semibold text-xs uppercase tracking-wide text-center border-l">결과</TableHead>
                </TableRow>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-medium text-xs text-center text-muted-foreground border-l">질병</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">미인정</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">기타</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground border-l">질병</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">미인정</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">기타</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground border-l">질병</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">미인정</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">기타</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground border-l">질병</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">미인정</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">기타</TableHead>
                </TableRow>
              </>
            ) : (
              <>
                <TableRow className="bg-muted/50">
                  <TableHead rowSpan={2} className="font-semibold text-xs uppercase tracking-wide text-center w-16 border-b-0">번호</TableHead>
                  <TableHead rowSpan={2} className="font-semibold text-xs uppercase tracking-wide border-b-0">이름</TableHead>
                  <TableHead rowSpan={2} className="font-semibold text-xs uppercase tracking-wide text-center border-b-0">학년</TableHead>
                  <TableHead rowSpan={2} className="font-semibold text-xs uppercase tracking-wide text-center border-b-0">수업일수</TableHead>
                  <TableHead colSpan={3} className="font-semibold text-xs uppercase tracking-wide text-center border-l">결석</TableHead>
                  <TableHead colSpan={3} className="font-semibold text-xs uppercase tracking-wide text-center border-l">지각</TableHead>
                  <TableHead colSpan={3} className="font-semibold text-xs uppercase tracking-wide text-center border-l">조퇴</TableHead>
                  <TableHead colSpan={3} className="font-semibold text-xs uppercase tracking-wide text-center border-l">결과</TableHead>
                </TableRow>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-medium text-xs text-center text-muted-foreground border-l">질병</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">미인정</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">기타</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground border-l">질병</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">미인정</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">기타</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground border-l">질병</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">미인정</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">기타</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground border-l">질병</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">미인정</TableHead>
                  <TableHead className="font-medium text-xs text-center text-muted-foreground">기타</TableHead>
                </TableRow>
              </>
            )}
          </TableHeader>
          <TableBody>
            {is3rdGrade ? (
              data.map((student, index) => (
                <Fragment key={index}>
                  <TableRow data-testid={`row-student-${index}-grade1`} className="border-t-2">
                    <TableCell rowSpan={3} className="font-mono text-center p-1 align-middle border-b-0">{student.studentNumber}</TableCell>
                    <TableCell rowSpan={3} className="font-medium p-1 align-middle border-b-0">{student.studentName}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">1</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.schoolDays1 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums border-l p-1">{student.absenceIllness1 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.absenceUnexcused1 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.absenceOther1 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums border-l p-1">{student.lateIllness1 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.lateUnexcused1 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.lateOther1 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums border-l p-1">{student.earlyLeaveIllness1 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.earlyLeaveUnexcused1 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.earlyLeaveOther1 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums border-l p-1">{student.classAbsenceIllness1 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.classAbsenceUnexcused1 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.classAbsenceOther1 || 0}</TableCell>
                  </TableRow>
                  <TableRow data-testid={`row-student-${index}-grade2`}>
                    <TableCell className="font-mono text-center tabular-nums p-1">2</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.schoolDays2 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums border-l p-1">{student.absenceIllness2 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.absenceUnexcused2 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.absenceOther2 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums border-l p-1">{student.lateIllness2 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.lateUnexcused2 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.lateOther2 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums border-l p-1">{student.earlyLeaveIllness2 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.earlyLeaveUnexcused2 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.earlyLeaveOther2 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums border-l p-1">{student.classAbsenceIllness2 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.classAbsenceUnexcused2 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.classAbsenceOther2 || 0}</TableCell>
                  </TableRow>
                  <TableRow data-testid={`row-student-${index}-grade3`}>
                    <TableCell className="font-mono text-center tabular-nums p-1">3</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.schoolDays3 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums border-l p-1">{student.absenceIllness3 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.absenceUnexcused3 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.absenceOther3 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums border-l p-1">{student.lateIllness3 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.lateUnexcused3 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.lateOther3 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums border-l p-1">{student.earlyLeaveIllness3 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.earlyLeaveUnexcused3 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.earlyLeaveOther3 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums border-l p-1">{student.classAbsenceIllness3 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.classAbsenceUnexcused3 || 0}</TableCell>
                    <TableCell className="font-mono text-center tabular-nums p-1">{student.classAbsenceOther3 || 0}</TableCell>
                  </TableRow>
                </Fragment>
              ))
            ) : (
              data.map((student, index) => (
                <TableRow key={index} data-testid={`row-student-${index}`}>
                  <TableCell className="font-mono text-center p-1">{student.studentNumber}</TableCell>
                  <TableCell className="font-medium p-1">{student.studentName}</TableCell>
                  <TableCell className="font-mono text-center tabular-nums">
                    {student.grade1 || "-"}
                  </TableCell>
                  <TableCell className="font-mono text-center tabular-nums">
                    {student.schoolDays1 || 0}
                  </TableCell>
                  <TableCell className="font-mono text-center tabular-nums border-l">{student.absenceIllness1 || 0}</TableCell>
                  <TableCell className="font-mono text-center tabular-nums">{student.absenceUnexcused1 || 0}</TableCell>
                  <TableCell className="font-mono text-center tabular-nums">{student.absenceOther1 || 0}</TableCell>
                  <TableCell className="font-mono text-center tabular-nums border-l">{student.lateIllness1 || 0}</TableCell>
                  <TableCell className="font-mono text-center tabular-nums">{student.lateUnexcused1 || 0}</TableCell>
                  <TableCell className="font-mono text-center tabular-nums">{student.lateOther1 || 0}</TableCell>
                  <TableCell className="font-mono text-center tabular-nums border-l">{student.earlyLeaveIllness1 || 0}</TableCell>
                  <TableCell className="font-mono text-center tabular-nums">{student.earlyLeaveUnexcused1 || 0}</TableCell>
                  <TableCell className="font-mono text-center tabular-nums">{student.earlyLeaveOther1 || 0}</TableCell>
                  <TableCell className="font-mono text-center tabular-nums border-l">{student.classAbsenceIllness1 || 0}</TableCell>
                  <TableCell className="font-mono text-center tabular-nums">{student.classAbsenceUnexcused1 || 0}</TableCell>
                  <TableCell className="font-mono text-center tabular-nums">{student.classAbsenceOther1 || 0}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
