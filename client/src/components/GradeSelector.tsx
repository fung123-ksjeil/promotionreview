import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type GradeType = "1-2" | "3";

interface GradeSelectorProps {
  value: GradeType;
  onChange: (value: GradeType) => void;
}

export default function GradeSelector({ value, onChange }: GradeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-muted-foreground">학년 선택</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as GradeType)}
        className="flex gap-4"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="1-2" id="grade-1-2" data-testid="radio-grade-1-2" />
          <Label htmlFor="grade-1-2" className="cursor-pointer font-medium">
            1-2학년
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="3" id="grade-3" data-testid="radio-grade-3" />
          <Label htmlFor="grade-3" className="cursor-pointer font-medium">
            3학년
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
