import { useState } from "react";
import GradeSelector, { type GradeType } from "../GradeSelector";

export default function GradeSelectorExample() {
  const [grade, setGrade] = useState<GradeType>("1-2");
  
  return (
    <GradeSelector value={grade} onChange={setGrade} />
  );
}
