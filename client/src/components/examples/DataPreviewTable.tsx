import DataPreviewTable, { type StudentData } from "../DataPreviewTable";

// todo: remove mock functionality
const mockData: StudentData[] = [
  { studentNumber: "1", studentName: "김민준", absence1: 0, absence2: 0, absence3: 0, late1: 0, late2: 0, late3: 0, earlyLeave1: 0, earlyLeave2: 0, earlyLeave3: 0, classAbsence1: 0, classAbsence2: 0, classAbsence3: 0 },
  { studentNumber: "2", studentName: "이서연", absence1: 1, absence2: 0, absence3: 0, late1: 2, late2: 1, late3: 0, earlyLeave1: 0, earlyLeave2: 0, earlyLeave3: 0, classAbsence1: 0, classAbsence2: 0, classAbsence3: 0 },
  { studentNumber: "3", studentName: "박지훈", absence1: 0, absence2: 0, absence3: 0, late1: 0, late2: 0, late3: 0, earlyLeave1: 0, earlyLeave2: 0, earlyLeave3: 0, classAbsence1: 0, classAbsence2: 0, classAbsence3: 0 },
  { studentNumber: "4", studentName: "최수아", absence1: 0, absence2: 1, absence3: 0, late1: 0, late2: 0, late3: 1, earlyLeave1: 1, earlyLeave2: 0, earlyLeave3: 0, classAbsence1: 0, classAbsence2: 0, classAbsence3: 0 },
  { studentNumber: "5", studentName: "정예준", absence1: 0, absence2: 0, absence3: 0, late1: 0, late2: 0, late3: 0, earlyLeave1: 0, earlyLeave2: 0, earlyLeave3: 0, classAbsence1: 0, classAbsence2: 0, classAbsence3: 0 },
];

export default function DataPreviewTableExample() {
  return (
    <DataPreviewTable data={mockData} gradeType="1-2" />
  );
}
