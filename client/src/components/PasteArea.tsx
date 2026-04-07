import { Textarea } from "@/components/ui/textarea";
import { ClipboardPaste } from "lucide-react";

interface PasteAreaProps {
  value: string;
  onChange: (value: string) => void;
  onPaste: (data: string) => void;
}

export default function PasteArea({ value, onChange, onPaste }: PasteAreaProps) {
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    onChange(pastedData);
    onPaste(pastedData);
  };

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        placeholder=""
        rows={15}
        className="border-2 border-dashed border-input bg-muted/30 font-mono text-sm resize-none focus:border-primary"
        data-testid="textarea-paste"
      />
      {!value && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-muted-foreground">
          <ClipboardPaste className="w-10 h-10 mb-4 opacity-50" />
          <p className="text-base font-medium">Excel 데이터를 여기에 붙여넣기</p>
          <p className="text-sm mt-1">(Ctrl+V / Cmd+V)</p>
          <p className="text-xs mt-4 text-muted-foreground/70">
            나이스 출결 데이터를 복사하여 붙여넣으세요
          </p>
        </div>
      )}
    </div>
  );
}
