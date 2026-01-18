"use client";

import React, { useState, useEffect } from "react";
import { Building2, User, MapPin, Briefcase, Banknote, Clock, CreditCard, CheckCircle, Plus, Trash2, ListOrdered, Calendar, Repeat, CalendarDays, Edit3, Percent, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInvoiceStore, PaymentMechanism, PenawaranWorkItem, PeriodType, TerminItem } from "@/lib/invoice-store";

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

const paymentOptions: { value: PaymentMechanism; label: string; description: string }[] = [
  { value: "lunas", label: "Pembayaran Lunas", description: "100% di awal/akhir" },
  { value: "termin", label: "Pembayaran Termin", description: "Bertahap sesuai progress" },
];

const periodOptions: { value: PeriodType; label: string; icon: React.ReactNode }[] = [
  { value: "sekali", label: "Satu Kali", icon: <Calendar size={12} /> },
  { value: "bulanan", label: "Bulanan", icon: <Repeat size={12} /> },
  { value: "tahunan", label: "Tahunan", icon: <CalendarDays size={12} /> },
  { value: "custom", label: "Custom", icon: <Edit3 size={12} /> },
];

const terminCountOptions = [2, 3, 4, 5];

const getDefaultTerminItems = (count: number, total: number): TerminItem[] => {
  const percentage = Math.floor(100 / count);
  const remainder = 100 - (percentage * count);
  
  return Array.from({ length: count }, (_, i) => {
    const isLast = i === count - 1;
    const pct = isLast ? percentage + remainder : percentage;
    const label = i === 0 ? `Termin 1 (DP)` : i === count - 1 ? `Termin ${i + 1} (Pelunasan)` : `Termin ${i + 1}`;
    return {
      id: (i + 1).toString(),
      label,
      percentage: pct,
      amount: Math.round((pct / 100) * total),
    };
  });
};

const SuratPenawaranForm: React.FC = () => {
  const { clientInfo, setClientInfo, suratPenawaranInfo, setSuratPenawaranInfo } = useInvoiceStore();
  const [itemAmounts, setItemAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    const amounts: Record<string, string> = {};
    suratPenawaranInfo.workItems.forEach(item => {
      if (item.amount > 0) {
        amounts[item.id] = formatCurrency(item.amount);
      }
    });
    setItemAmounts(amounts);
  }, []);

  useEffect(() => {
    if (suratPenawaranInfo.mekanismePembayaran === "termin") {
      const newTerminItems = suratPenawaranInfo.terminItems.map(item => ({
        ...item,
        amount: Math.round((item.percentage / 100) * suratPenawaranInfo.totalNominal),
      }));
      setSuratPenawaranInfo({ terminItems: newTerminItems });
    }
  }, [suratPenawaranInfo.totalNominal]);

  const calculateTotal = (items: PenawaranWorkItem[]) => {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const handleAddItem = () => {
    const newId = Date.now().toString();
    const newItems = [...suratPenawaranInfo.workItems, { id: newId, description: "", amount: 0, period: "sekali" as PeriodType }];
    setSuratPenawaranInfo({ 
      workItems: newItems,
      totalNominal: calculateTotal(newItems)
    });
  };

  const handleRemoveItem = (id: string) => {
    if (suratPenawaranInfo.workItems.length <= 1) return;
    const newItems = suratPenawaranInfo.workItems.filter(item => item.id !== id);
    const newAmounts = { ...itemAmounts };
    delete newAmounts[id];
    setItemAmounts(newAmounts);
    setSuratPenawaranInfo({ 
      workItems: newItems,
      totalNominal: calculateTotal(newItems)
    });
  };

  const handleItemChange = (id: string, field: keyof PenawaranWorkItem, value: string | number) => {
    const newItems = suratPenawaranInfo.workItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setSuratPenawaranInfo({ 
      workItems: newItems,
      totalNominal: calculateTotal(newItems)
    });
  };

  const handleAmountChange = (id: string, rawValue: string) => {
    const formatted = formatWithThousandSeparator(rawValue);
    const numericValue = parseFormattedNumber(rawValue);
    setItemAmounts(prev => ({ ...prev, [id]: formatted }));
    handleItemChange(id, "amount", numericValue);
  };

  const handleTerminCountChange = (count: number) => {
    const newTerminItems = getDefaultTerminItems(count, suratPenawaranInfo.totalNominal);
    setSuratPenawaranInfo({ 
      terminCount: count,
      terminItems: newTerminItems
    });
  };

  const handleTerminPercentageChange = (id: string, percentage: number) => {
    const newTerminItems = suratPenawaranInfo.terminItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          percentage,
          amount: Math.round((percentage / 100) * suratPenawaranInfo.totalNominal),
        };
      }
      return item;
    });
    setSuratPenawaranInfo({ terminItems: newTerminItems });
  };

  const handleTerminLabelChange = (id: string, label: string) => {
    const newTerminItems = suratPenawaranInfo.terminItems.map(item => {
      if (item.id === id) {
        return { ...item, label };
      }
      return item;
    });
    setSuratPenawaranInfo({ terminItems: newTerminItems });
  };

  const getTotalPercentage = () => {
    return suratPenawaranInfo.terminItems.reduce((sum, item) => sum + item.percentage, 0);
  };

  const getPeriodLabel = (period: PeriodType, customPeriod?: string) => {
    if (period === "custom" && customPeriod) return customPeriod;
    const option = periodOptions.find(p => p.value === period);
    return option?.label || "-";
  };

  const generateNarasi = () => {
    const { jenisPekerjaan, totalNominal, mekanismePembayaran, lamaPengerjaan, workItems, terminItems } = suratPenawaranInfo;
    const { companyName, picName } = clientInfo;
    
    let pembayaranText = "";
    if (mekanismePembayaran === "lunas") {
      pembayaranText = "dilakukan secara penuh (100%)";
    } else {
      const terminText = terminItems.map(t => `${t.label}: ${t.percentage}% (Rp ${formatCurrency(t.amount)})`).join(", ");
      pembayaranText = `dilakukan secara bertahap: ${terminText}`;
    }

    const itemsText = workItems
      .filter(item => item.description)
      .map((item, idx) => `   ${idx + 1}. ${item.description} (${getPeriodLabel(item.period, item.customPeriod)}): Rp ${formatCurrency(item.amount)}`)
      .join("\n");

    return `Dengan hormat,

Berdasarkan permintaan dari ${companyName || "[Nama Perusahaan]"} melalui ${picName || "[Nama PIC]"}, kami dari SEMESTA TEKNO dengan ini mengajukan penawaran untuk pengerjaan ${jenisPekerjaan || "[Jenis Pekerjaan]"}.

Adapun rincian penawaran kami adalah sebagai berikut:

Jenis Pekerjaan: ${jenisPekerjaan || "-"}

Rincian Item Pekerjaan:
${itemsText || "   (Belum ada item)"}

Total Biaya: Rp ${totalNominal > 0 ? formatCurrency(totalNominal) : "-"}
Mekanisme Pembayaran: Pembayaran ${pembayaranText}
Estimasi Waktu Pengerjaan: ${lamaPengerjaan || "-"}

Demikian surat penawaran ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.

Hormat kami,
SEMESTA TEKNO`;
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        <div className="bg-gradient-to-r from-[#17a2b8]/10 to-[#00bcd4]/10 px-4 sm:px-5 py-3 border-b border-[#e2e8f0]">
          <h3 className="font-bold text-[#0f172a] flex items-center gap-2">
            <Building2 size={18} className="text-[#17a2b8]" />
            Informasi Klien
          </h3>
        </div>
        
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-2">
                Nama Perusahaan / Klien
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={clientInfo.companyName}
                  onChange={(e) => setClientInfo({ companyName: e.target.value })}
                  placeholder="PT. Contoh Perusahaan"
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-2">
                Nama PIC
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={clientInfo.picName}
                  onChange={(e) => setClientInfo({ picName: e.target.value })}
                  placeholder="Bapak/Ibu John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-2">
              Alamat
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-[#94a3b8]" />
              <textarea
                value={clientInfo.address}
                onChange={(e) => setClientInfo({ address: e.target.value })}
                placeholder="Alamat lengkap perusahaan..."
                rows={2}
                className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        <div className="bg-gradient-to-r from-[#f5a623]/10 to-[#ffc107]/10 px-4 sm:px-5 py-3 border-b border-[#e2e8f0]">
          <h3 className="font-bold text-[#0f172a] flex items-center gap-2">
            <Briefcase size={18} className="text-[#f5a623]" />
            Detail Penawaran
          </h3>
        </div>
        
        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-2">
              Jenis Pekerjaan
            </label>
            <div className="relative">
              <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                value={suratPenawaranInfo.jenisPekerjaan}
                onChange={(e) => setSuratPenawaranInfo({ jenisPekerjaan: e.target.value })}
                placeholder="Pembuatan Website Company Profile, Aplikasi Mobile, dll"
                className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-[#64748b] uppercase tracking-wide flex items-center gap-2">
                <ListOrdered size={14} />
                Rincian Item Pekerjaan
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#17a2b8]/10 text-[#17a2b8] rounded-lg text-xs font-semibold hover:bg-[#17a2b8]/20 transition-colors"
              >
                <Plus size={14} />
                Tambah Item
              </button>
            </div>
            
            <div className="space-y-3">
              {suratPenawaranInfo.workItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]"
                >
                  <div className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-lg bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623] font-bold text-sm flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                          placeholder="Deskripsi item pekerjaan..."
                          className="w-full px-3 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-sm focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623] transition-all"
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#94a3b8] font-medium">Rp</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={itemAmounts[item.id] || ""}
                            onChange={(e) => handleAmountChange(item.id, e.target.value)}
                            placeholder="0"
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-sm font-mono text-right focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623] transition-all"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs text-[#64748b] font-medium">Periode:</span>
                        {periodOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleItemChange(item.id, "period", option.value)}
                            className={cn(
                              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                              item.period === option.value
                                ? "bg-[#17a2b8] text-white"
                                : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#17a2b8] hover:text-[#17a2b8]"
                            )}
                          >
                            {option.icon}
                            {option.label}
                          </button>
                        ))}
                      </div>

                      {item.period === "custom" && (
                        <input
                          type="text"
                          value={item.customPeriod || ""}
                          onChange={(e) => handleItemChange(item.id, "customPeriod", e.target.value)}
                          placeholder="Masukkan periode custom (contoh: Per 3 Bulan, Per Semester, dll)"
                          className="w-full px-3 py-2 bg-white border border-[#e2e8f0] rounded-lg text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all"
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={suratPenawaranInfo.workItems.length <= 1}
                      className={cn(
                        "p-2 rounded-lg transition-colors flex-shrink-0",
                        suratPenawaranInfo.workItems.length <= 1
                          ? "text-[#cbd5e1] cursor-not-allowed"
                          : "text-[#ef4444] hover:bg-[#ef4444]/10"
                      )}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-[#17a2b8]/10 to-[#00bcd4]/10 rounded-xl border border-[#17a2b8]/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0f172a]">Total Nominal Penawaran</span>
                <span className="text-lg font-bold text-[#17a2b8] font-mono">
                  Rp {formatCurrency(suratPenawaranInfo.totalNominal)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-2">
              Lama Pengerjaan
            </label>
            <div className="relative">
              <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                value={suratPenawaranInfo.lamaPengerjaan}
                onChange={(e) => setSuratPenawaranInfo({ lamaPengerjaan: e.target.value })}
                placeholder="14 Hari Kerja, 1 Bulan, dll"
                className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-3">
              Mekanisme Pembayaran
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSuratPenawaranInfo({ mekanismePembayaran: option.value })}
                  className={cn(
                    "relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                    suratPenawaranInfo.mekanismePembayaran === option.value
                      ? "border-[#17a2b8] bg-[#17a2b8]/5"
                      : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    suratPenawaranInfo.mekanismePembayaran === option.value
                      ? "bg-[#17a2b8] text-white"
                      : "bg-[#f1f5f9] text-[#64748b]"
                  )}>
                    {option.value === "lunas" ? <Banknote size={20} /> : <CreditCard size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-semibold text-sm",
                      suratPenawaranInfo.mekanismePembayaran === option.value ? "text-[#17a2b8]" : "text-[#0f172a]"
                    )}>
                      {option.label}
                    </p>
                    <p className="text-xs text-[#64748b] truncate">{option.description}</p>
                  </div>
                  {suratPenawaranInfo.mekanismePembayaran === option.value && (
                    <CheckCircle size={18} className="text-[#17a2b8] absolute top-2 right-2" />
                  )}
                </button>
              ))}
            </div>

            {suratPenawaranInfo.mekanismePembayaran === "termin" && (
              <div className="mt-4 p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#64748b] uppercase tracking-wide flex items-center gap-2">
                    <Hash size={14} />
                    Jumlah Termin
                  </label>
                  <div className="flex gap-2">
                    {terminCountOptions.map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => handleTerminCountChange(count)}
                        className={cn(
                          "w-9 h-9 rounded-lg text-sm font-semibold transition-all",
                          suratPenawaranInfo.terminCount === count
                            ? "bg-[#17a2b8] text-white"
                            : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#17a2b8] hover:text-[#17a2b8]"
                        )}
                      >
                        {count}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {suratPenawaranInfo.terminItems.map((termin, index) => (
                    <div key={termin.id} className="flex gap-3 items-center p-3 bg-white rounded-lg border border-[#e2e8f0]">
                      <div className="w-7 h-7 rounded-lg bg-[#17a2b8]/10 flex items-center justify-center text-[#17a2b8] font-bold text-xs flex-shrink-0">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={termin.label}
                        onChange={(e) => handleTerminLabelChange(termin.id, e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all"
                      />
                      <div className="relative w-20">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={termin.percentage}
                          onChange={(e) => handleTerminPercentageChange(termin.id, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 pr-7 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm font-mono text-right focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all"
                        />
                        <Percent size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                      </div>
                      <div className="w-32 text-right">
                        <span className="text-sm font-mono text-[#0f172a]">Rp {formatCurrency(termin.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  getTotalPercentage() === 100 
                    ? "bg-[#10b981]/10 border-[#10b981]/30" 
                    : "bg-[#ef4444]/10 border-[#ef4444]/30"
                )}>
                  <span className="text-sm font-semibold text-[#0f172a]">Total Persentase</span>
                  <span className={cn(
                    "text-sm font-bold font-mono",
                    getTotalPercentage() === 100 ? "text-[#10b981]" : "text-[#ef4444]"
                  )}>
                    {getTotalPercentage()}%
                    {getTotalPercentage() !== 100 && (
                      <span className="ml-2 text-xs font-normal">
                        (harus 100%)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        <div className="bg-gradient-to-r from-[#10b981]/10 to-[#14b8a6]/10 px-4 sm:px-5 py-3 border-b border-[#e2e8f0]">
          <h3 className="font-bold text-[#0f172a] flex items-center gap-2">
            <CheckCircle size={18} className="text-[#10b981]" />
            Preview Narasi Surat Penawaran
          </h3>
        </div>
        
        <div className="p-4 sm:p-5">
          <div className="bg-[#f8fafc] rounded-xl p-4 sm:p-5 border border-[#e2e8f0]">
            <pre className="text-sm text-[#374151] whitespace-pre-wrap font-sans leading-relaxed">
              {generateNarasi()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuratPenawaranForm;
