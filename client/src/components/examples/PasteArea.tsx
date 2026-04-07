import { useState } from "react";
import PasteArea from "../PasteArea";

export default function PasteAreaExample() {
  const [value, setValue] = useState("");
  
  const handlePaste = (data: string) => {
    setValue(data);
    console.log("Data pasted:", data);
  };

  return (
    <PasteArea value={value} onChange={setValue} onPaste={handlePaste} />
  );
}
