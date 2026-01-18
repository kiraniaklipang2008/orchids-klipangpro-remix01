"use client";

import React, { useState, useEffect } from "react";
import { FileText, CreditCard, CircleCheck, Calculator, Percent, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInvoiceStore, InvoiceType } from "@/lib/invoice-store";

interface InvoiceTypeOption {
  id: InvoiceType;
  label: string;
  description: string;
  icon: React.ReactNode;
  activeClasses: string;
  iconBgActive: string;
  iconBgInactive: string;
}

const invoiceOptions: InvoiceTypeOption[] = [
  {
    id: "penagihan",
    label: "Penagihan",
    description: "Invoice tagihan penuh",
    icon: <FileText className="h-5 w-5" />,
    activeClasses: "border-[#17a2b8] bg-[#17a2b8]/5",
    iconBgActive: "bg-[#17a2b8] text-white",
    iconBgInactive: "bg-[#17a2b8]/10 text-[#17a2b8]",
  },
  {
    id: "termin_dp",
    label: "Termin DP",
    description: "Down Payment / Uang Muka",
    icon: <CreditCard className="h-5 w-5" />,
    activeClasses: "border-[#f5a623] bg-[#f5a623]/5",
    iconBgActive: "bg-[#f5a623] text-white",
    iconBgInactive: "bg-[#f5a623]/10 text-[#f5a623]",
  },
  {
    id: "pelunasan",
    label: "Pelunasan",
    description: "Pembayaran final",
    icon: <CircleCheck className="h-5 w-5" />,
    activeClasses: "border-[#25D366] bg-[#25D366]/5",
    iconBgActive: "bg-[#25D366] text-white",
    iconBgInactive: "bg-[#25D366]/10 text-[#25D366]",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

const formatWithThousandSeparator = (value: string): string => {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  return new Intl.NumberFormat("id-ID").format(parseInt(numericValue));
};

const parseFormattedNumber = (value: string): number => {
  const numericValue = value.replace(/\D/g, "");
  return parseInt(numericValue) || 0;
};

const InvoiceTypeSelector: React.FC = () => {
  const { invoiceType, setInvoiceType, terminDPInfo, setTerminDPInfo } = useInvoiceStore();
  
  const [totalProjectDisplay, setTotalProjectDisplay] = useState("");
  const [dpAmountDisplay, setDpAmountDisplay] = useState("");

  useEffect(() => {
    if (terminDPInfo.totalProjectAmount > 0) {
      setTotalProjectDisplay(formatCurrency(terminDPInfo.totalProjectAmount));
    }
    if (terminDPInfo.dpAmount > 0) {
      setDpAmountDisplay(formatCurrency(terminDPInfo.dpAmount));
    }
  }, []);

  const handleTotalProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatWithThousandSeparator(rawValue);
    setTotalProjectDisplay(formatted);
    setTerminDPInfo({ totalProjectAmount: parseFormattedNumber(rawValue) });
  };

  const handleDpAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatWithThousandSeparator(rawValue);
    setDpAmountDisplay(formatted);
    setTerminDPInfo({ dpAmount: parseFormattedNumber(rawValue) });
  };

  const dpPercentage = terminDPInfo.totalProjectAmount > 0 
    ? ((terminDPInfo.dpAmount / terminDPInfo.totalProjectAmount) * 100).toFixed(1)
    : "0";

  return (
    <div className="bg-gradient-to-br from-[#f0f9fa] to-[#e7f8fd]/50 rounded-2xl p-4 sm:p-5 border border-[#17a2b8]/10">
      <label className="text-sm font-semibold text-[#0f172a] block mb-3 sm:mb-4">
        Jenis Invoice
      </label>

      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-3" role="radiogroup">
        {invoiceOptions.map((option) => {
          const isActive = invoiceType === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setInvoiceType(option.id)}
              className={cn(
                "relative flex items-center sm:flex-col gap-3 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left sm:text-center",
                isActive
                  ? option.activeClasses + " shadow-md"
                  : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
              )}
            >
              <span
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6",
                  isActive ? option.iconBgActive : option.iconBgInactive
                )}
              >
                {option.icon}
              </span>

              <div className="flex-1 sm:flex-none">
                <span
                  className={cn(
                    "font-semibold text-sm block",
                    isActive ? "text-[#0f172a]" : "text-[#64748b]"
                  )}
                >
                  {option.label}
                </span>
                <span className="text-[11px] sm:text-[10px] text-[#94a3b8] mt-0.5 block">
                  {option.description}
                </span>
              </div>

              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 sm:hidden transition-colors",
                  isActive
                    ? "border-current"
                    : "border-[#cbd5e1]"
                )}
                style={{
                  borderColor: isActive
                    ? option.id === "penagihan"
                      ? "#17a2b8"
                      : option.id === "termin_dp"
                      ? "#f5a623"
                      : "#25D366"
                    : undefined,
                }}
              >
                {isActive && (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        option.id === "penagihan"
                          ? "#17a2b8"
                          : option.id === "termin_dp"
                          ? "#f5a623"
                          : "#25D366",
                    }}
                  />
                )}
              </div>

              {isActive && (
                <div className="absolute top-2 right-2 hidden sm:block">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{
                      backgroundColor:
                        option.id === "penagihan"
                          ? "#17a2b8"
                          : option.id === "termin_dp"
                          ? "#f5a623"
                          : "#25D366",
                    }}
                  />
                </div>
              )}

              <input
                type="radio"
                name="invoiceType"
                value={option.id}
                checked={isActive}
                onChange={() => setInvoiceType(option.id)}
                className="sr-only"
              />
            </button>
          );
        })}
      </div>

      {/* Termin DP Dynamic Fields */}
      {invoiceType === "termin_dp" && (
        <div className="mt-4 pt-4 border-t border-[#f5a623]/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-[#f5a623]/10 flex items-center justify-center">
              <Calculator size={14} className="text-[#f5a623]" />
            </div>
            <h3 className="text-sm font-semibold text-[#0f172a]">Detail Termin DP</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Total Nominal Pekerjaan */}
              <div className="bg-white rounded-xl p-3 border border-[#e2e8f0]">
                <label className="block text-[10px] font-medium text-[#64748b] uppercase tracking-wide mb-1.5">
                  Total Nominal Pekerjaan
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#94a3b8] font-medium">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={totalProjectDisplay}
                    onChange={handleTotalProjectChange}
                    placeholder="0"
                    className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm font-mono font-semibold text-right focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623] transition-all"
                  />
                </div>
              </div>

              {/* Nominal DP */}
              <div className="bg-white rounded-xl p-3 border border-[#e2e8f0]">
                <label className="block text-[10px] font-medium text-[#64748b] uppercase tracking-wide mb-1.5">
                  Nominal DP
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#94a3b8] font-medium">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={dpAmountDisplay}
                    onChange={handleDpAmountChange}
                    placeholder="0"
                    className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm font-mono font-semibold text-right focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623] transition-all"
                  />
                </div>
              </div>

            {/* Termin Ke */}
            <div className="bg-white rounded-xl p-3 border border-[#e2e8f0]">
              <label className="block text-[10px] font-medium text-[#64748b] uppercase tracking-wide mb-1.5">
                Termin Ke
              </label>
              <div className="relative">
                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="99"
                  value={terminDPInfo.terminNumber}
                  onChange={(e) => setTerminDPInfo({ terminNumber: parseInt(e.target.value) || 1 })}
                  className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm font-mono font-semibold text-center focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623] transition-all"
                />
              </div>
            </div>

            {/* Prosentase (Auto) */}
            <div className="bg-gradient-to-br from-[#f5a623]/10 to-[#f5a623]/5 rounded-xl p-3 border border-[#f5a623]/20">
              <label className="block text-[10px] font-medium text-[#f5a623] uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Percent size={10} />
                Prosentase (Auto)
              </label>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold text-[#f5a623] font-mono">{dpPercentage}</span>
                <span className="text-lg text-[#f5a623]/70">%</span>
              </div>
            </div>
          </div>

          {/* Summary Info */}
          {terminDPInfo.totalProjectAmount > 0 && terminDPInfo.dpAmount > 0 && (
            <div className="mt-3 p-3 bg-[#f5a623]/5 rounded-xl border border-[#f5a623]/20">
              <p className="text-xs text-[#64748b]">
                <span className="font-medium text-[#0f172a]">Ringkasan:</span> Pembayaran DP Termin ke-{terminDPInfo.terminNumber} sebesar{" "}
                <span className="font-semibold text-[#f5a623]">Rp {formatCurrency(terminDPInfo.dpAmount)}</span> ({dpPercentage}%) dari total pekerjaan{" "}
                <span className="font-semibold text-[#0f172a]">Rp {formatCurrency(terminDPInfo.totalProjectAmount)}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceTypeSelector;
