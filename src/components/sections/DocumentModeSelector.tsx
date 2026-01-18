"use client";

import React from "react";
import { FileText, Send, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInvoiceStore, DocumentMode } from "@/lib/invoice-store";

const modes: { value: DocumentMode; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: "invoice",
    label: "Invoice",
    icon: <FileText size={20} />,
    description: "Penagihan & Pembayaran",
  },
  {
    value: "surat_penawaran",
    label: "Surat Penawaran",
    icon: <Send size={20} />,
    description: "Proposal & Penawaran",
  },
  {
    value: "brosur_digital",
    label: "Brosur",
    icon: <Megaphone size={20} />,
    description: "Brosur Digital",
  },
];

const DocumentModeSelector: React.FC = () => {
  const { documentMode, setDocumentMode } = useInvoiceStore();

  return (
    <div className="flex gap-2 sm:gap-3 p-1.5 bg-[#f1f5f9] rounded-2xl">
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={() => setDocumentMode(mode.value)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-3 sm:px-5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200",
            documentMode === mode.value
              ? "bg-white text-[#17a2b8] shadow-lg"
              : "text-[#64748b] hover:text-[#0f172a] hover:bg-white/50"
          )}
        >
          <span className={cn(
            "transition-colors",
            documentMode === mode.value ? "text-[#17a2b8]" : "text-[#94a3b8]"
          )}>
            {mode.icon}
          </span>
          <div className="flex flex-col items-start">
            <span className="leading-tight">{mode.label}</span>
            <span className={cn(
              "text-[10px] sm:text-xs font-normal hidden sm:block",
              documentMode === mode.value ? "text-[#64748b]" : "text-[#94a3b8]"
            )}>
              {mode.description}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default DocumentModeSelector;
