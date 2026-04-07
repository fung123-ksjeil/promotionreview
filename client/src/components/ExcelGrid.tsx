import { useRef, useEffect, useState, useCallback } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ClipboardPaste, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExcelGridProps {
  value: string;
  onChange: (value: string) => void;
  onPaste: (data: string) => void;
  onClear?: () => void;
}

export default function ExcelGrid({ value, onChange, onPaste, onClear }: ExcelGridProps) {
  const [gridData, setGridData] = useState<string[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const lines = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
      const data = lines.map(line => line.split("\t"));
      setGridData(data);
    } else {
      setGridData([]);
    }
  }, [value]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    onChange(pastedData);
    onPaste(pastedData);
  }, [onChange, onPaste]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      // Allow default paste behavior
    }
  }, []);

  // 유효한 데이터 행: 번호(col0) 또는 학년(col2) 중 하나라도 숫자이면 유효
  const isValidDataRow = (row: string[]): boolean => {
    const col0 = row[0]?.trim();
    const col2 = row[2]?.trim();
    return !isNaN(parseInt(col0)) || !isNaN(parseInt(col2));
  };

  const columnHeaders = ["번호", "이름", "학년", "수업일수", "결석질병", "결석미인정", "결석기타", 
                         "지각질병", "지각미인정", "지각기타", "조퇴질병", "조퇴미인정", "조퇴기타",
                         "결과질병", "결과미인정", "결과기타"];

  const displayRows = gridData.filter(isValidDataRow);

  if (gridData.length === 0 || displayRows.length === 0) {
    return (
      <div 
        ref={containerRef}
        tabIndex={0}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="relative border-2 border-dashed border-input bg-muted/30 rounded-md min-h-[300px] focus:border-primary focus:outline-none cursor-pointer"
        data-testid="excel-grid-empty"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-muted-foreground">
          <ClipboardPaste className="w-10 h-10 mb-4 opacity-50" />
          <p className="text-base font-medium">Excel 데이터를 여기에 붙여넣기</p>
          <p className="text-sm mt-1">(Ctrl+V / Cmd+V)</p>
          <p className="text-xs mt-4 text-muted-foreground/70">
            나이스 출결 데이터를 복사하여 붙여넣으세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div 
        ref={containerRef}
        tabIndex={0}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
        data-testid="excel-grid"
      >
        <ScrollArea className="w-full max-h-[400px]">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-muted">
                <th className="border border-border px-2 py-1 text-center font-medium whitespace-nowrap min-w-[40px] bg-muted text-muted-foreground">#</th>
                {columnHeaders.map((header, idx) => (
                  <th 
                    key={idx} 
                    className="border border-border px-2 py-1 text-center font-medium whitespace-nowrap min-w-[60px]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row, rowIdx) => (
                <tr 
                  key={rowIdx}
                  className={rowIdx % 2 === 0 ? "bg-background" : "bg-muted/30"}
                >
                  <td className="border border-border px-1 py-1 text-center text-muted-foreground font-mono text-[10px]">
                    {rowIdx + 1}
                  </td>
                  {columnHeaders.map((_, colIdx) => (
                    <td 
                      key={colIdx} 
                      className="border border-border px-2 py-1 text-center font-mono tabular-nums"
                      data-testid={`cell-${rowIdx}-${colIdx}`}
                    >
                      {row[colIdx] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <ScrollBar orientation="horizontal" />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
      {onClear && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="default"
            onClick={onClear}
            data-testid="button-clear-excel"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            데이터 지우기
          </Button>
        </div>
      )}
    </div>
  );
}
