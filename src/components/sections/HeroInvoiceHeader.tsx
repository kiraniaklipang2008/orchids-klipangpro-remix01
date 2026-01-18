"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Hash, Calendar, Sparkles } from "lucide-react";
import { useInvoiceStore } from "@/lib/invoice-store";

const STORAGE_KEY = "invoice_counter";
const SPN_STORAGE_KEY = "spn_counter";

interface InvoiceCounter {
  yearMonth: string;
  count: number;
}

function getYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}${month}`;
}

function generateInvoiceNumber(): string {
  const yearMonth = getYearMonth();
  let stored: InvoiceCounter | null = null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch {
    stored = null;
  }

  let newCount = 1;
  if (stored && stored.yearMonth === yearMonth) {
    newCount = stored.count + 1;
  }

  const newCounter: InvoiceCounter = {
    yearMonth,
    count: newCount,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newCounter));

  const seq = String(newCount).padStart(2, "0");
  return `INV-${yearMonth}-${seq}`;
}

function generateSPNNumber(): string {
  const yearMonth = getYearMonth();
  let stored: InvoiceCounter | null = null;

  try {
    const raw = localStorage.getItem(SPN_STORAGE_KEY);
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch {
    stored = null;
  }

  let newCount = 1;
  if (stored && stored.yearMonth === yearMonth) {
    newCount = stored.count + 1;
  }

  const newCounter: InvoiceCounter = {
    yearMonth,
    count: newCount,
  };
  localStorage.setItem(SPN_STORAGE_KEY, JSON.stringify(newCounter));

  const seq = String(newCount).padStart(2, "0");
  return `SPN-${yearMonth}-${seq}`;
}

function formatDate(): string {
  const now = new Date();
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatDateShort(): string {
  const now = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
}

const HeroInvoiceHeader: React.FC = () => {
  const { documentMode, invoiceNumber, setInvoiceNumber, setInvoiceDate, suratPenawaranInfo, setSuratPenawaranInfo } = useInvoiceStore();
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentDateShort, setCurrentDateShort] = useState<string>("");

  const isInvoice = documentMode === "invoice";
  const currentNumber = isInvoice ? invoiceNumber : suratPenawaranInfo.nomorPenawaran;

  useEffect(() => {
    const date = formatDate();
    setCurrentDate(date);
    setCurrentDateShort(formatDateShort());
    setInvoiceDate(date);
    setSuratPenawaranInfo({ tanggal: date });
  }, [setInvoiceDate, setSuratPenawaranInfo]);

  const handleGenerate = () => {
    if (isInvoice) {
      const newInvoice = generateInvoiceNumber();
      setInvoiceNumber(newInvoice);
    } else {
      const newSPN = generateSPNNumber();
      setSuratPenawaranInfo({ nomorPenawaran: newSPN });
    }
  };

  const labels = {
    numberLabel: isInvoice ? "No. Invoice" : "No. Penawaran",
    buttonLabel: isInvoice ? "Generate No Invoice" : "Generate No Penawaran",
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-[#e2e8f0]">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7b6ddbba-d08d-48ce-b89b-b73d742007d1-klipang-vercel-app/assets/images/logo-semesta-tekno-DGBbA37e-1.png"
            alt="Semesta Tekno"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#17a2b8] leading-tight tracking-tight truncate">
            SEMESTA TEKNO
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
            Professional IT Solutions
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#f8fafc] to-[#f0f9fa] rounded-2xl p-4 sm:p-5 border border-[#e2e8f0]/80">
          <div className="flex flex-col gap-4 sm:hidden">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 border border-[#e2e8f0]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Hash size={12} className="text-[#17a2b8]" />
                  <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-medium">
                    {labels.numberLabel}
                  </span>
                </div>
                <span className="font-bold text-[#0f172a] text-sm block truncate">
                  {currentNumber || "—"}
                </span>
              </div>

              <div className="bg-white rounded-xl p-3 border border-[#e2e8f0]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar size={12} className="text-[#17a2b8]" />
                  <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-medium">
                    Tanggal
                  </span>
                </div>
                <span className="font-semibold text-[#0f172a] text-sm block truncate">
                  {currentDateShort || "—"}
                </span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full h-12 bg-gradient-to-r from-[#17a2b8] to-[#00bcd4] text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              {labels.buttonLabel}
            </button>
          </div>

          <div className="hidden sm:flex sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#17a2b8]/10 flex items-center justify-center">
                <Hash size={18} className="text-[#17a2b8]" />
              </div>
              <div>
                <span className="text-xs text-[#64748b] block mb-0.5">
                  {labels.numberLabel}
                </span>
                <span className="font-bold text-[#0f172a] text-base">
                  {currentNumber || "—"}
                </span>
              </div>
            </div>

            <div className="h-10 w-px bg-[#e2e8f0]" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5a623]/10 flex items-center justify-center">
                <Calendar size={18} className="text-[#f5a623]" />
              </div>
              <div>
                <span className="text-xs text-[#64748b] block mb-0.5">
                  Tanggal
                </span>
                <span className="font-semibold text-[#0f172a] text-base">
                  {currentDate || "—"}
                </span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="ml-auto h-11 px-5 bg-gradient-to-r from-[#17a2b8] to-[#00bcd4] text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Sparkles size={16} />
              {labels.buttonLabel}
            </button>
          </div>
        </div>
    </div>
  );
};

export default HeroInvoiceHeader;
