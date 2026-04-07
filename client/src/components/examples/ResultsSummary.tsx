import { useState } from "react";
import ResultsSummary, { type ProcessingResult } from "../ResultsSummary";

// todo: remove mock functionality
const mockResults: ProcessingResult = {
  oneYearPerfect: [
    { studentNumber: "1", studentName: "김민준" },
    { studentNumber: "3", studentName: "박지훈" },
    { studentNumber: "5", studentName: "정예준" },
  ],
  oneYearGood: [
    { studentNumber: "2", studentName: "이서연", details: "지각3" },
    { studentNumber: "4", studentName: "최수아", details: "결석1,지각1,조퇴1" },
  ],
  threeYearPerfect: [
    { studentNumber: "1", studentName: "김민준" },
  ],
  threeYearGood: [
    { studentNumber: "3", studentName: "박지훈", details: "지각2" },
  ],
};

export default function ResultsSummaryExample() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    console.log("Download triggered");
    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <ResultsSummary
      results={mockResults}
      gradeType="3"
      onDownload={handleDownload}
      isDownloading={isDownloading}
    />
  );
}
