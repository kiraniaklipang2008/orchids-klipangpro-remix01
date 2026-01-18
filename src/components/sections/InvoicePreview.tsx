"use client";

import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useInvoiceStore, InvoiceType } from "@/lib/invoice-store";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

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

const getInvoiceTypeLabel = (type: InvoiceType) => {
  switch (type) {
    case "penagihan":
      return "INVOICE PENAGIHAN";
    case "termin_dp":
      return "INVOICE TERMIN DP";
    case "pelunasan":
      return "INVOICE PELUNASAN";
    default:
      return "INVOICE";
  }
};

interface InvoiceStampProps {
  type: "termin_dp" | "pelunasan";
}

const InvoiceStamp: React.FC<InvoiceStampProps> = ({ type }) => {
  const isDP = type === "termin_dp";
  const text = isDP ? "DP" : "LUNAS";
  const subText = isDP ? "DOWN PAYMENT" : "PAID IN FULL";
  const color = isDP ? "#f5a623" : "#25D366";
  const bgColor = isDP ? "rgba(245, 166, 35, 0.08)" : "rgba(37, 211, 102, 0.08)";

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 24px",
        border: `4px solid ${color}`,
        borderRadius: "12px",
        backgroundColor: bgColor,
        transform: "rotate(-8deg)",
        boxShadow: `0 4px 12px ${isDP ? "rgba(245, 166, 35, 0.3)" : "rgba(37, 211, 102, 0.3)"}`,
      }}
    >
      <span
        style={{
          fontSize: "28px",
          fontWeight: "900",
          color: color,
          letterSpacing: "4px",
          lineHeight: 1,
        }}
      >
        {text}
      </span>
      <span
        style={{
          fontSize: "9px",
          fontWeight: "700",
          color: color,
          letterSpacing: "2px",
          marginTop: "4px",
          textTransform: "uppercase",
        }}
      >
        {subText}
      </span>
    </div>
  );
};

const InvoicePreview = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    invoiceNumber,
    invoiceDate,
    invoiceType,
    clientInfo,
    workItems,
    totalAmount,
    terminDPInfo,
  } = useInvoiceStore();

  const showStamp = invoiceType === "termin_dp" || invoiceType === "pelunasan";
  const whatsappUrl = "https://wa.me/6281225129109";
  const bniLogoUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/7b6ddbba-d08d-48ce-b89b-b73d742007d1/logo-bni-1768693122687.webp?width=8000&height=8000&resize=contain";

  const dpPercentage = terminDPInfo.totalProjectAmount > 0 
    ? ((terminDPInfo.dpAmount / terminDPInfo.totalProjectAmount) * 100).toFixed(1)
    : "0";

  return (
    <div
      ref={ref}
      id="invoice-preview-content"
      className="bg-white text-black"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "15mm",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        fontSize: "12px",
        lineHeight: "1.5",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "3px solid #17a2b8", paddingBottom: "15px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7b6ddbba-d08d-48ce-b89b-b73d742007d1-klipang-vercel-app/assets/images/logo-semesta-tekno-DGBbA37e-1.png"
            alt="Logo"
            style={{ width: "60px", height: "60px", objectFit: "contain" }}
            crossOrigin="anonymous"
          />
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#17a2b8", margin: 0 }}>
              SEMESTA TEKNO
            </h1>
            <p style={{ fontSize: "11px", color: "#64748b", margin: "2px 0 0 0" }}>
              Professional IT Solutions
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", margin: "0 0 8px 0" }}>
            {getInvoiceTypeLabel(invoiceType)}
          </h2>
          <p style={{ fontSize: "11px", color: "#64748b", margin: "2px 0" }}>
            No: <strong style={{ color: "#0f172a" }}>{invoiceNumber || "-"}</strong>
          </p>
          <p style={{ fontSize: "11px", color: "#64748b", margin: "2px 0" }}>
            Tanggal: <strong style={{ color: "#0f172a" }}>{invoiceDate || "-"}</strong>
          </p>
        </div>
      </div>

        {/* Client Info + Stamp Row - 50:50 Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          {/* Left Column - Client Info */}
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
          
          {/* Right Column - Stamp */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            backgroundColor: showStamp ? "transparent" : "#f8fafc",
            borderRadius: "10px",
            border: showStamp ? "none" : "1px dashed #e2e8f0",
            minHeight: "100px"
          }}>
            {showStamp ? (
              <InvoiceStamp type={invoiceType as "termin_dp" | "pelunasan"} />
            ) : (
              <p style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic" }}>Status Invoice</p>
            )}
          </div>
        </div>

        {/* Termin DP Detail Section */}
        {invoiceType === "termin_dp" && terminDPInfo.totalProjectAmount > 0 && (
          <div style={{ 
            marginBottom: "20px", 
            padding: "16px", 
            backgroundColor: "#fffbeb", 
            borderRadius: "10px", 
            border: "2px solid #f5a623",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "4px",
              height: "100%",
              backgroundColor: "#f5a623"
            }} />
            
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ 
                width: "28px", 
                height: "28px", 
                backgroundColor: "#f5a623", 
                borderRadius: "8px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <span style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>₹</span>
              </div>
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "bold", color: "#92400e" }}>
                Detail Pembayaran Termin DP
              </h3>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              <div style={{ 
                backgroundColor: "white", 
                padding: "12px", 
                borderRadius: "8px",
                border: "1px solid #fcd34d"
              }}>
                <p style={{ fontSize: "9px", color: "#92400e", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                  Total Nilai Pekerjaan
                </p>
                <p style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0, fontFamily: "monospace" }}>
                  Rp {formatCurrency(terminDPInfo.totalProjectAmount)}
                </p>
              </div>
              
              <div style={{ 
                backgroundColor: "white", 
                padding: "12px", 
                borderRadius: "8px",
                border: "1px solid #fcd34d"
              }}>
                <p style={{ fontSize: "9px", color: "#92400e", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                  Nominal DP
                </p>
                <p style={{ fontSize: "16px", fontWeight: "bold", color: "#f5a623", margin: 0, fontFamily: "monospace" }}>
                  Rp {formatCurrency(terminDPInfo.dpAmount)}
                </p>
              </div>
              
              <div style={{ 
                backgroundColor: "white", 
                padding: "12px", 
                borderRadius: "8px",
                border: "1px solid #fcd34d"
              }}>
                <p style={{ fontSize: "9px", color: "#92400e", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                  Termin Ke
                </p>
                <p style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
                  #{terminDPInfo.terminNumber}
                </p>
              </div>
              
              <div style={{ 
                backgroundColor: "#f5a623", 
                padding: "12px", 
                borderRadius: "8px"
              }}>
                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.8)", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                  Prosentase
                </p>
                <p style={{ fontSize: "20px", fontWeight: "bold", color: "white", margin: 0 }}>
                  {dpPercentage}%
                </p>
              </div>
            </div>
            
            <div style={{ 
              marginTop: "12px", 
              padding: "10px 12px", 
              backgroundColor: "rgba(245, 166, 35, 0.1)", 
              borderRadius: "6px",
              borderLeft: "3px solid #f5a623"
            }}>
              <p style={{ fontSize: "10px", color: "#78350f", margin: 0 }}>
                <strong>Keterangan:</strong> Pembayaran Down Payment (DP) Termin ke-{terminDPInfo.terminNumber} sebesar {dpPercentage}% dari total nilai pekerjaan. Sisa pembayaran sebesar Rp {formatCurrency(terminDPInfo.totalProjectAmount - terminDPInfo.dpAmount)} ({(100 - parseFloat(dpPercentage)).toFixed(1)}%) akan ditagihkan pada termin berikutnya.
              </p>
            </div>
          </div>
        )}

      {/* Work Items Table */}
      <div style={{ marginBottom: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
          <thead>
            <tr style={{ backgroundColor: "#17a2b8", color: "white" }}>
              <th style={{ padding: "10px 8px", textAlign: "left", fontWeight: "600", width: "5%" }}>No</th>
              <th style={{ padding: "10px 8px", textAlign: "left", fontWeight: "600", width: "20%" }}>Jenis</th>
              <th style={{ padding: "10px 8px", textAlign: "left", fontWeight: "600", width: "40%" }}>Item Pekerjaan</th>
              <th style={{ padding: "10px 8px", textAlign: "right", fontWeight: "600", width: "20%" }}>Nominal</th>
              <th style={{ padding: "10px 8px", textAlign: "left", fontWeight: "600", width: "15%" }}>Ket</th>
            </tr>
          </thead>
          <tbody>
            {workItems.map((item, index) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px 8px", verticalAlign: "top" }}>{index + 1}</td>
                <td style={{ padding: "10px 8px", verticalAlign: "top" }}>{item.category}</td>
                <td style={{ padding: "10px 8px", verticalAlign: "top", whiteSpace: "pre-wrap" }}>
                  {item.description || "-"}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right", fontFamily: "monospace", verticalAlign: "top" }}>
                  Rp {formatCurrency(item.amount)}
                </td>
                <td style={{ padding: "10px 8px", verticalAlign: "top" }}>{item.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: "#f0f9fa" }}>
              <td colSpan={3} style={{ padding: "12px 8px", fontWeight: "bold", textAlign: "right" }}>
                TOTAL
              </td>
              <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: "bold", fontFamily: "monospace", fontSize: "14px", color: "#17a2b8" }}>
                Rp {formatCurrency(totalAmount)}
              </td>
              <td style={{ padding: "12px 8px" }}></td>
            </tr>
            {totalAmount > 0 && (
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <td colSpan={5} style={{ padding: "10px 8px", fontSize: "11px", color: "#64748b" }}>
                  <span style={{ fontWeight: "600" }}>Terbilang: </span>
                  <span style={{ fontStyle: "italic", color: "#0f172a" }}>{numberToWords(totalAmount)} Rupiah</span>
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>

        {/* Bank Info + Signature - 2 Column Layout */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
          {/* Bank Info - Left Column */}
          <div style={{ 
            flex: 1, 
            padding: "16px", 
            background: "linear-gradient(145deg, #006d77 0%, #17a2b8 50%, #00bcd4 100%)", 
            borderRadius: "12px", 
            color: "white",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Decorative Pattern */}
            <div style={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.5) 15px, rgba(255,255,255,0.5) 17px)`
            }} />
            
            {/* Header */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "5px", height: "5px", backgroundColor: "rgba(255,255,255,0.6)", borderRadius: "50%" }} />
                <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.8, margin: 0, fontWeight: 600 }}>
                  Transfer Pembayaran Ke
                </p>
              </div>
              <div style={{ padding: "2px 8px", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)" }}>
                <span style={{ fontSize: "8px", fontWeight: 500, opacity: 0.9, textTransform: "uppercase", letterSpacing: "0.5px" }}>Verified</span>
              </div>
            </div>
            
            {/* Bank Logo Section */}
            <div style={{ 
              position: "relative",
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              marginBottom: "12px", 
              padding: "10px 12px",
              backgroundColor: "rgba(255,255,255,0.12)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ 
                width: "48px", 
                height: "48px", 
                backgroundColor: "white", 
                borderRadius: "10px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                padding: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}>
                <img
                  src={bniLogoUrl}
                  alt="BNI Logo"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  crossOrigin="anonymous"
                />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "bold", margin: 0, lineHeight: 1.2 }}>Bank Negara Indonesia</p>
                <p style={{ fontSize: "10px", opacity: 0.75, margin: "2px 0 0 0" }}>BNI • Persero Tbk</p>
              </div>
            </div>
            
            {/* Account Number */}
            <div style={{ 
              position: "relative",
              backgroundColor: "rgba(255,255,255,0.1)", 
              borderRadius: "10px", 
              padding: "12px",
              border: "1px solid rgba(255,255,255,0.15)"
            }}>
              <p style={{ fontSize: "8px", opacity: 0.7, margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Nomor Rekening</p>
              <p style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "monospace", letterSpacing: "3px", margin: 0 }}>
                0249532534
              </p>
              <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "24px", height: "24px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "10px", fontWeight: "bold" }}>S</span>
                </div>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 600, margin: 0 }}>SISWANTO</p>
                  <p style={{ fontSize: "8px", opacity: 0.7, margin: 0 }}>Account Holder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section - Right Column */}
          <div style={{ 
            flex: 1, 
            backgroundColor: "#f8fafc", 
            borderRadius: "12px", 
            padding: "16px", 
            border: "1px solid #e2e8f0", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center" 
          }}>
            <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "12px" }}>
              Hormat Kami,
            </p>
            
            {/* QR Code */}
            <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "12px", border: "2px solid #e2e8f0", marginBottom: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <QRCodeSVG
                value={whatsappUrl}
                size={75}
                level="M"
                bgColor="#ffffff"
                fgColor="#0f172a"
              />
            </div>
            <p style={{ fontSize: "8px", color: "#94a3b8", margin: "0 0 10px 0" }}>Scan untuk WhatsApp</p>
            
            <p style={{ fontWeight: "bold", fontSize: "12px", color: "#0f172a", margin: 0, textAlign: "center" }}>
              SISWANTO, S.Pd, S.Kom, M.Kom
            </p>
            <p style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>
              Direktur
            </p>
          </div>
        </div>

      {/* Footer */}
      <div style={{ position: "absolute", bottom: "10mm", left: "15mm", right: "15mm", borderTop: "1px solid #e2e8f0", paddingTop: "10px", fontSize: "9px", color: "#94a3b8", textAlign: "center" }}>
        <p style={{ margin: 0 }}>Semesta Tekno | Professional IT Solutions</p>
        <p style={{ margin: "2px 0 0 0" }}>Email: info@semestatekno.com | Telp: +62 xxx xxxx xxxx</p>
      </div>
    </div>
  );
});

InvoicePreview.displayName = "InvoicePreview";

export default InvoicePreview;
