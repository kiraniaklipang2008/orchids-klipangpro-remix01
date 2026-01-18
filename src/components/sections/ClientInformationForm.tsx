"use client";

import React from "react";
import { Building2, User, MapPin } from "lucide-react";
import { useInvoiceStore } from "@/lib/invoice-store";

const ClientInformationForm: React.FC = () => {
  const { clientInfo, setClientInfo } = useInvoiceStore();

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-[#f5a623]/5 to-transparent border-b border-[#e2e8f0]">
        <h2 className="text-sm sm:text-base font-semibold text-[#0f172a] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f5a623]" />
          Informasi Klien
        </h2>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div>
          <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#0f172a] mb-2">
            <Building2 size={14} className="text-[#64748b]" />
            Nama Perusahaan Klien
          </label>
          <input
            type="text"
            value={clientInfo.companyName}
            onChange={(e) => setClientInfo({ companyName: e.target.value })}
            placeholder="PT. Example Indonesia"
            className="w-full h-12 sm:h-[48px] px-4 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-xl transition-all focus:outline-none focus:border-[#17a2b8] focus:bg-white focus:ring-2 focus:ring-[#17a2b8]/10 placeholder:text-[#94a3b8]"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#0f172a] mb-2">
            <User size={14} className="text-[#64748b]" />
            Person In Contact (PIC)
          </label>
          <input
            type="text"
            value={clientInfo.picName}
            onChange={(e) => setClientInfo({ picName: e.target.value })}
            placeholder="John Doe"
            className="w-full h-12 sm:h-[48px] px-4 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-xl transition-all focus:outline-none focus:border-[#17a2b8] focus:bg-white focus:ring-2 focus:ring-[#17a2b8]/10 placeholder:text-[#94a3b8]"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#0f172a] mb-2">
            <MapPin size={14} className="text-[#64748b]" />
            Alamat
          </label>
          <textarea
            value={clientInfo.address}
            onChange={(e) => setClientInfo({ address: e.target.value })}
            placeholder="Jl. Contoh No. 123, Jakarta Selatan, DKI Jakarta 12345"
            rows={3}
            className="w-full px-4 py-3 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-xl transition-all focus:outline-none focus:border-[#17a2b8] focus:bg-white focus:ring-2 focus:ring-[#17a2b8]/10 placeholder:text-[#94a3b8] resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInformationForm;
