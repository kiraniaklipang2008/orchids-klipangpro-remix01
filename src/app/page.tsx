"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useInvoiceStore } from "@/lib/invoice-store";
import DocumentModeSelector from "@/components/sections/DocumentModeSelector";
import HeroInvoiceHeader from "@/components/sections/HeroInvoiceHeader";
import InvoiceTypeSelector from "@/components/sections/InvoiceTypeSelector";
import ClientInformationForm from "@/components/sections/ClientInformationForm";
import WorkDetailTable from "@/components/sections/WorkDetailTable";
import BankInfoAndSignature from "@/components/sections/BankInfoAndSignature";
import ActionFooter from "@/components/sections/ActionFooter";

const SuratPenawaranForm = dynamic(
  () => import("@/components/sections/SuratPenawaranForm"),
  { ssr: false }
);

const BrosurDigitalForm = dynamic(
  () => import("@/components/sections/BrosurDigitalForm"),
  { ssr: false }
);

export default function Home() {
  const { documentMode } = useInvoiceStore();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="py-4 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
        <main className="container max-w-[896px] mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-hidden border border-[#e2e8f0]">
            <div className="p-4 sm:p-6 lg:p-8">
              <DocumentModeSelector />
            </div>
            
            {documentMode !== "brosur_digital" && (
              <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
                <HeroInvoiceHeader />
              </div>
            )}

            <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 lg:space-y-8 bg-gradient-to-b from-[#f8fafc]/80 to-[#f8fafc]">
              {documentMode === "invoice" ? (
                <>
                  <InvoiceTypeSelector />
                  <ClientInformationForm />
                  <WorkDetailTable />
                  <BankInfoAndSignature />
                </>
              ) : documentMode === "surat_penawaran" ? (
                <SuratPenawaranForm />
              ) : (
                <BrosurDigitalForm />
              )}
              {documentMode !== "brosur_digital" && <ActionFooter />}
            </div>
          </div>

          <footer className="mt-6 sm:mt-8 text-center text-[#94a3b8] text-xs sm:text-sm pb-6 sm:pb-8">
            <p>© {new Date().getFullYear()} Invoice & Surat Penawaran Maker</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
