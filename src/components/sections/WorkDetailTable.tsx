"use client";

import React from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInvoiceStore } from "@/lib/invoice-store";

const categories = [
  "Web Design",
  "Software Development",
  "Hosting & Domain",
  "App Install",
  "Whatsapp Service",
];

const numberToWords = (num: number): string => {
  const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  
  if (num < 12) return satuan[num];
  if (num < 20) return satuan[num - 10] + ' Belas';
  if (num < 100) return satuan[Math.floor(num / 10)] + ' Puluh' + (num % 10 === 0 ? '' : ' ' + satuan[num % 10]);
  if (num < 200) return 'Seratus' + (num % 100 === 0 ? '' : ' ' + numberToWords(num % 100));
  if (num < 1000) return satuan[Math.floor(num / 100)] + ' Ratus' + (num % 100 === 0 ? '' : ' ' + numberToWords(num % 100));
  if (num < 2000) return 'Seribu' + (num % 1000 === 0 ? '' : ' ' + numberToWords(num % 1000));
  if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + ' Ribu' + (num % 1000 === 0 ? '' : ' ' + numberToWords(num % 1000));
  if (num < 1000000000) return numberToWords(Math.floor(num / 1000000)) + ' Juta' + (num % 1000000 === 0 ? '' : ' ' + numberToWords(num % 1000000));
  if (num < 1000000000000) return numberToWords(Math.floor(num / 1000000000)) + ' Miliar' + (num % 1000000000 === 0 ? '' : ' ' + numberToWords(num % 1000000000));
  return numberToWords(Math.floor(num / 1000000000000)) + ' Triliun' + (num % 1000000000000 === 0 ? '' : ' ' + numberToWords(num % 1000000000000));
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

const InvoiceStamp: React.FC<{ type: "termin_dp" | "pelunasan" }> = ({ type }) => {
  const isDP = type === "termin_dp";
  const text = isDP ? "DOWN PAYMENT" : "LUNAS";
  const subText = isDP ? "UANG MUKA" : "PAID IN FULL";
  const color = isDP ? "#f5a623" : "#25D366";
  
  return (
    <div className="flex justify-center mb-4">
      <div
        className="relative inline-flex flex-col items-center justify-center px-8 py-3 border-4 rounded-lg transform -rotate-6"
        style={{ borderColor: color }}
      >
        <div
          className="absolute inset-0 opacity-10 rounded-lg"
          style={{ backgroundColor: color }}
        />
        <span
          className="text-2xl sm:text-3xl font-black tracking-wider relative z-10"
          style={{ color }}
        >
          {text}
        </span>
        <span
          className="text-xs sm:text-sm font-bold tracking-widest relative z-10 mt-0.5"
          style={{ color }}
        >
          {subText}
        </span>
        <div
          className="absolute -top-1 -left-1 w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const WorkDetailTable: React.FC = () => {
  const {
    workItems: items,
    totalAmount,
    invoiceType,
    addWorkItem,
    updateWorkItem,
    removeWorkItem,
  } = useInvoiceStore();

  const handleAddItem = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: "Software Development",
      description: "",
      amount: 0,
      notes: "",
    };
    addWorkItem(newItem);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      removeWorkItem(id);
    }
  };

  const showStamp = invoiceType === "termin_dp" || invoiceType === "pelunasan";

  return (
    <div className="section-card bg-white border border-[#e2e8f0] rounded-[16px] overflow-hidden">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-[#0f172a] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#17a2b8]"></span>
            Detail Pekerjaan
          </h2>
          <button
            onClick={handleAddItem}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#17a2b8] text-white rounded-xl font-semibold text-xs sm:text-sm hover:bg-[#138496] transition-all duration-200 active:scale-[0.98] shadow-sm"
          >
            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">Tambah</span>
            <span className="xs:hidden">+</span>
          </button>
        </div>

        {showStamp && <InvoiceStamp type={invoiceType as "termin_dp" | "pelunasan"} />}

        <div className="hidden md:block overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gradient-to-r from-[#17a2b8] to-[#00bcd4] text-white">
                <th className="w-[160px] text-xs font-semibold uppercase tracking-wider py-3 px-4 text-left first:pl-6 lg:first:pl-8">
                  Jenis
                </th>
                <th className="text-xs font-semibold uppercase tracking-wider py-3 px-4 text-left">
                  Item Pekerjaan
                </th>
                <th className="w-[140px] text-xs font-semibold uppercase tracking-wider py-3 px-4 text-right">
                  Nominal
                </th>
                <th className="w-[140px] text-xs font-semibold uppercase tracking-wider py-3 px-4 text-left">
                  Keterangan
                </th>
                <th className="w-[50px] py-3 px-4 last:pr-6 lg:last:pr-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {items.map((item) => (
                <tr key={item.id} className="group hover:bg-[#f8fafc] transition-colors">
                  <td className="py-3 px-4 first:pl-6 lg:first:pl-8">
                    <div className="relative">
                      <select
                        value={item.category}
                        onChange={(e) => updateWorkItem(item.id, { category: e.target.value })}
                        className="w-full appearance-none bg-[#f1f5f9] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:bg-white transition-all cursor-pointer pr-8"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <textarea
                      value={item.description}
                      onChange={(e) => updateWorkItem(item.id, { description: e.target.value })}
                      placeholder="Deskripsi pekerjaan..."
                      rows={1}
                      className="w-full bg-[#f1f5f9] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:bg-white transition-all resize-none min-h-[38px]"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <input
                      type="number"
                      value={item.amount === 0 ? "" : item.amount}
                      onChange={(e) => updateWorkItem(item.id, { amount: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full text-right bg-[#f1f5f9] border-none rounded-lg px-3 py-2 text-sm font-mono font-medium focus:ring-2 focus:ring-[#17a2b8]/20 focus:bg-white transition-all"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => updateWorkItem(item.id, { notes: e.target.value })}
                      placeholder="Catatan..."
                      className="w-full bg-[#f1f5f9] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:bg-white transition-all"
                    />
                  </td>
                  <td className="py-3 px-4 last:pr-6 lg:last:pr-8 text-center">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className={cn(
                        "p-1.5 text-[#ef4444] hover:bg-red-50 rounded-lg transition-all",
                        items.length === 1 && "opacity-30 cursor-not-allowed"
                      )}
                      disabled={items.length === 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#17a2b8] text-white flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                    Item #{index + 1}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className={cn(
                    "p-2 text-[#ef4444] hover:bg-red-100 rounded-lg transition-all",
                    items.length === 1 && "opacity-30 cursor-not-allowed"
                  )}
                  disabled={items.length === 1}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                    Jenis Pekerjaan
                  </label>
                  <div className="relative">
                    <select
                      value={item.category}
                      onChange={(e) => updateWorkItem(item.id, { category: e.target.value })}
                      className="w-full appearance-none bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all cursor-pointer pr-10"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748b] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                    Item Pekerjaan
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateWorkItem(item.id, { description: e.target.value })}
                    placeholder="Deskripsi pekerjaan..."
                    rows={2}
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                      Nominal (Rp)
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={item.amount === 0 ? "" : item.amount}
                      onChange={(e) => updateWorkItem(item.id, { amount: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm font-mono font-semibold text-right focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                      Keterangan
                    </label>
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => updateWorkItem(item.id, { notes: e.target.value })}
                      placeholder="Catatan..."
                      className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all"
                    />
                  </div>
                </div>

                {item.amount > 0 && (
                  <div className="pt-2 mt-2 border-t border-dashed border-[#e2e8f0]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#64748b]">Subtotal</span>
                      <span className="font-mono font-bold text-[#17a2b8] text-sm">
                        Rp {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={handleAddItem}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-[#f0f9fa] text-[#17a2b8] border-2 border-dashed border-[#17a2b8]/30 rounded-xl font-semibold text-sm hover:bg-[#17a2b8] hover:text-white hover:border-transparent transition-all duration-200 active:scale-[0.98]"
          >
            <Plus size={20} />
            Tambah Item Baru
          </button>
        </div>

        <div className="mt-4 sm:mt-6 p-4 bg-gradient-to-r from-[#f0f9fa] to-[#e7f8fd] rounded-xl border border-[#17a2b8]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-[#64748b] font-medium">Total Keseluruhan</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">{items.length} item pekerjaan</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-xl sm:text-2xl text-[#17a2b8]">
                Rp {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
          {totalAmount > 0 && (
            <div className="mt-3 pt-3 border-t border-[#17a2b8]/20">
              <p className="text-xs sm:text-sm text-[#64748b]">
                <span className="font-medium">Terbilang: </span>
                <span className="italic text-[#0f172a]">{numberToWords(totalAmount)} Rupiah</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkDetailTable;
