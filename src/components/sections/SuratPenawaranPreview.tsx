"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useInvoiceStore, PeriodType } from "@/lib/invoice-store";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

const getPeriodLabel = (period: PeriodType, customPeriod?: string) => {
  if (period === "custom" && customPeriod) return customPeriod;
  const labels: Record<PeriodType, string> = {
    sekali: "Satu Kali",
    bulanan: "Bulanan",
    tahunan: "Tahunan",
    custom: "Custom",
  };
  return labels[period] || "-";
};

const SuratPenawaranPreview = forwardRef<HTMLDivElement>((_, ref) => {
  const { clientInfo, suratPenawaranInfo } = useInvoiceStore();

  const filteredItems = suratPenawaranInfo.workItems.filter(item => item.description);

  const whatsappUrl = "https://wa.me/6281225129109";

  return (
    <div
      ref={ref}
      id="surat-penawaran-preview-content"
      style={{
        width: "794px",
        minHeight: "1123px",
        backgroundColor: "#ffffff",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px", borderBottom: "3px solid #17a2b8", paddingBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "70px", height: "70px", position: "relative" }}>
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7b6ddbba-d08d-48ce-b89b-b73d742007d1-klipang-vercel-app/assets/images/logo-semesta-tekno-DGBbA37e-1.png"
              alt="Semesta Tekno"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#17a2b8", margin: 0 }}>
              SEMESTA TEKNO
            </h1>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>
              Professional IT Solutions
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ 
            display: "inline-block",
            background: "linear-gradient(135deg, #17a2b8 0%, #00bcd4 100%)",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "14px",
          }}>
            SURAT PENAWARAN
          </div>
          <p style={{ fontSize: "11px", color: "#64748b", margin: "8px 0 0 0" }}>
            {suratPenawaranInfo.nomorPenawaran || "-"}
          </p>
          <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0 0 0" }}>
            {suratPenawaranInfo.tanggal || "-"}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
        <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: "10px", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
            Kepada Yth:
          </p>
          <p style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a", margin: "0 0 6px 0" }}>
            {clientInfo.companyName || "-"}
          </p>
          <p style={{ fontSize: "12px", color: "#374151", margin: "4px 0" }}>
            PIC: {clientInfo.picName || "-"}
          </p>
          <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0", lineHeight: 1.5 }}>
            {clientInfo.address || "-"}
          </p>
        </div>
        
        <div style={{ padding: "16px", backgroundColor: "#f0f9ff", borderRadius: "10px", border: "1px solid #bae6fd" }}>
          <p style={{ fontSize: "10px", color: "#0284c7", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
            Dari:
          </p>
          <p style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a", margin: "0 0 6px 0" }}>
            SEMESTA TEKNO
          </p>
          <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0", lineHeight: 1.5 }}>
            Professional IT Solutions
          </p>
          <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0" }}>
            +62 812-2512-9109
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "25px", lineHeight: 1.8 }}>
        <p style={{ fontSize: "13px", color: "#374151", textAlign: "justify" }}>
          Dengan hormat,
        </p>
        <p style={{ fontSize: "13px", color: "#374151", textAlign: "justify", marginTop: "12px" }}>
          Berdasarkan permintaan dari <strong>{clientInfo.companyName || "[Nama Perusahaan]"}</strong> melalui <strong>{clientInfo.picName || "[Nama PIC]"}</strong>, kami dari SEMESTA TEKNO dengan ini mengajukan penawaran untuk pengerjaan <strong>{suratPenawaranInfo.jenisPekerjaan || "[Jenis Pekerjaan]"}</strong>.
        </p>
        <p style={{ fontSize: "13px", color: "#374151", marginTop: "12px" }}>
          Adapun rincian penawaran kami adalah sebagai berikut:
        </p>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#17a2b8" }}>
              <th style={{ padding: "12px 12px", textAlign: "center", color: "#ffffff", fontWeight: 600, width: "40px", borderTopLeftRadius: "8px" }}>
                No
              </th>
              <th style={{ padding: "12px 12px", textAlign: "left", color: "#ffffff", fontWeight: 600 }}>
                Deskripsi Pekerjaan
              </th>
              <th style={{ padding: "12px 12px", textAlign: "center", color: "#ffffff", fontWeight: 600, width: "100px" }}>
                Periode
              </th>
              <th style={{ padding: "12px 12px", textAlign: "right", color: "#ffffff", fontWeight: 600, width: "150px", borderTopRightRadius: "8px" }}>
                Biaya (Rp)
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                  <td style={{ padding: "12px 12px", textAlign: "center", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: 500 }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "12px 12px", textAlign: "left", borderBottom: "1px solid #e2e8f0", color: "#0f172a" }}>
                    {item.description}
                  </td>
                  <td style={{ padding: "12px 12px", textAlign: "center", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontSize: "11px" }}>
                    <span style={{ 
                      display: "inline-block",
                      padding: "4px 8px", 
                      backgroundColor: "#e0f2fe", 
                      borderRadius: "4px",
                      color: "#0284c7",
                      fontWeight: 500
                    }}>
                      {getPeriodLabel(item.period, item.customPeriod)}
                    </span>
                  </td>
                  <td style={{ padding: "12px 12px", textAlign: "right", borderBottom: "1px solid #e2e8f0", color: "#0f172a", fontWeight: 500, fontFamily: "monospace" }}>
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: "20px 12px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
                  Belum ada item pekerjaan
                </td>
              </tr>
            )}
            <tr style={{ backgroundColor: "#f0f9ff" }}>
              <td colSpan={3} style={{ padding: "14px 12px", textAlign: "right", fontWeight: 700, color: "#0f172a", borderBottomLeftRadius: "8px" }}>
                TOTAL
              </td>
              <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 700, color: "#17a2b8", fontSize: "14px", fontFamily: "monospace", borderBottomRightRadius: "8px" }}>
                Rp {formatCurrency(suratPenawaranInfo.totalNominal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <div style={{ backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ padding: "12px 16px", backgroundColor: "#f1f5f9", fontWeight: 600, fontSize: "12px", color: "#64748b" }}>
              Mekanisme Pembayaran
            </div>
            <div style={{ padding: "12px 16px", fontSize: "12px", color: "#0f172a" }}>
              {suratPenawaranInfo.mekanismePembayaran === "lunas" 
                ? "Pembayaran dilakukan secara penuh (100%)" 
                : "Pembayaran dilakukan secara bertahap (Termin)"}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr" }}>
            <div style={{ padding: "12px 16px", backgroundColor: "#f1f5f9", fontWeight: 600, fontSize: "12px", color: "#64748b" }}>
              Estimasi Waktu Pengerjaan
            </div>
            <div style={{ padding: "12px 16px", fontSize: "12px", color: "#0f172a" }}>
              {suratPenawaranInfo.lamaPengerjaan || "-"}
            </div>
          </div>
        </div>
      </div>

      {suratPenawaranInfo.mekanismePembayaran === "termin" && suratPenawaranInfo.terminItems.length > 0 && (
        <div style={{ marginBottom: "25px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#0f172a", marginBottom: "10px" }}>
            Rincian Pembayaran Termin:
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5a623" }}>
                <th style={{ padding: "10px 12px", textAlign: "center", color: "#ffffff", fontWeight: 600, width: "40px", borderTopLeftRadius: "8px" }}>
                  No
                </th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "#ffffff", fontWeight: 600 }}>
                  Keterangan
                </th>
                <th style={{ padding: "10px 12px", textAlign: "center", color: "#ffffff", fontWeight: 600, width: "80px" }}>
                  Persentase
                </th>
                <th style={{ padding: "10px 12px", textAlign: "right", color: "#ffffff", fontWeight: 600, width: "150px", borderTopRightRadius: "8px" }}>
                  Nominal (Rp)
                </th>
              </tr>
            </thead>
            <tbody>
              {suratPenawaranInfo.terminItems.map((termin, index) => (
                <tr key={termin.id} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#fffbeb" }}>
                  <td style={{ padding: "10px 12px", textAlign: "center", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: 500 }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "left", borderBottom: "1px solid #e2e8f0", color: "#0f172a" }}>
                    {termin.label}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>
                    <span style={{ 
                      display: "inline-block",
                      padding: "4px 10px", 
                      backgroundColor: "#fef3c7", 
                      borderRadius: "4px",
                      color: "#b45309",
                      fontWeight: 600,
                      fontSize: "11px"
                    }}>
                      {termin.percentage}%
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", borderBottom: "1px solid #e2e8f0", color: "#0f172a", fontWeight: 500, fontFamily: "monospace" }}>
                    {formatCurrency(termin.amount)}
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: "#fef3c7" }}>
                <td colSpan={2} style={{ padding: "12px 12px", textAlign: "right", fontWeight: 700, color: "#0f172a", borderBottomLeftRadius: "8px" }}>
                  TOTAL
                </td>
                <td style={{ padding: "12px 12px", textAlign: "center", fontWeight: 700, color: "#b45309" }}>
                  {suratPenawaranInfo.terminItems.reduce((sum, t) => sum + t.percentage, 0)}%
                </td>
                <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 700, color: "#f5a623", fontSize: "13px", fontFamily: "monospace", borderBottomRightRadius: "8px" }}>
                  Rp {formatCurrency(suratPenawaranInfo.totalNominal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.8, textAlign: "justify" }}>
          Demikian surat penawaran ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ textAlign: "center", width: "220px" }}>
          <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
            Hormat kami,
          </p>
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: "12px",
            padding: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0"
          }}>
            <QRCodeSVG 
              value={whatsappUrl} 
              size={80}
              level="M"
              bgColor="#ffffff"
              fgColor="#17a2b8"
            />
          </div>
          <p style={{ fontSize: "12px", fontWeight: "bold", color: "#0f172a", margin: "0 0 4px 0" }}>
            Siswanto, S.Pd, S.Kom, M.Kom
          </p>
          <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
            Project Manager
          </p>
        </div>
      </div>

      <div style={{ 
        marginTop: "40px",
        paddingTop: "20px",
        borderTop: "2px solid #17a2b8",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ fontSize: "10px", color: "#94a3b8" }}>
          <p style={{ margin: 0 }}>Dokumen ini dibuat secara digital oleh sistem Invoice & Surat Penawaran Maker</p>
        </div>
        <div style={{ fontSize: "10px", color: "#94a3b8", textAlign: "right" }}>
          <p style={{ margin: 0 }}>sekit@sekit.tech</p>
          <p style={{ margin: "2px 0 0 0" }}>semesta-tekno.id</p>
        </div>
      </div>
    </div>
  );
});

SuratPenawaranPreview.displayName = "SuratPenawaranPreview";

export default SuratPenawaranPreview;
