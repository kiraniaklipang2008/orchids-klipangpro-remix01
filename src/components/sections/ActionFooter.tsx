"use client";

import React, { useState, useRef, useCallback } from "react";
import { Eye, Download, MessageCircle, X, Loader2, FileText, Share2, CheckCircle, Copy, ExternalLink, Send } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useInvoiceStore } from "@/lib/invoice-store";
import InvoicePreview from "./InvoicePreview";
import SuratPenawaranPreview from "./SuratPenawaranPreview";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

const ActionFooter: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [renderHidden, setRenderHidden] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);

  const {
    documentMode,
    invoiceNumber,
    invoiceDate,
    invoiceType,
    clientInfo,
    workItems,
    totalAmount,
    terminDPInfo,
    suratPenawaranInfo,
  } = useInvoiceStore();

  const isInvoice = documentMode === "invoice";

  const getInvoiceTypeLabel = () => {
    switch (invoiceType) {
      case "penagihan":
        return "Penagihan";
      case "termin_dp":
        return "Termin DP";
      case "pelunasan":
        return "Pelunasan";
      default:
        return "Invoice";
    }
  };

  const getFilename = useCallback(() => {
    if (isInvoice) {
      return `${invoiceNumber || "Invoice"}_${clientInfo.companyName || "Client"}.pdf`
        .replace(/[^a-zA-Z0-9_\-\.]/g, "_");
    } else {
      return `${suratPenawaranInfo.nomorPenawaran || "SuratPenawaran"}_${clientInfo.companyName || "Client"}.pdf`
        .replace(/[^a-zA-Z0-9_\-\.]/g, "_");
    }
  }, [isInvoice, invoiceNumber, suratPenawaranInfo.nomorPenawaran, clientInfo.companyName]);

  const createPDF = useCallback(async (element: HTMLElement): Promise<void> => {
    const canvas = await html2canvas(element, {
      scale: 4,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 30000,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById("invoice-preview-content");
        if (clonedElement) {
          clonedElement.style.transform = "none";
          clonedElement.style.webkitFontSmoothing = "antialiased";
        }
      },
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: false,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    
    let finalWidth = pdfWidth;
    let finalHeight = pdfWidth / ratio;
    
    if (finalHeight > pdfHeight) {
      finalHeight = pdfHeight;
      finalWidth = pdfHeight * ratio;
    }
    
    const x = (pdfWidth - finalWidth) / 2;
    const y = 0;

    pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight, undefined, "FAST");
    
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    const downloadLink = document.createElement("a");
    downloadLink.href = pdfUrl;
    downloadLink.download = getFilename();
    downloadLink.target = "_blank";
    downloadLink.rel = "noopener noreferrer";
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 1000);
  }, [getFilename]);

  const handleDownloadPDF = useCallback(async () => {
    setIsGenerating(true);
    setRenderHidden(true);
    setDownloadSuccess(false);
    
    setTimeout(async () => {
      const elementId = isInvoice ? "hidden-invoice-preview" : "hidden-surat-penawaran-preview";
      const element = document.getElementById(elementId);
      
      if (element) {
        try {
          await createPDF(element);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
        } catch (error) {
          console.error("Error creating PDF:", error);
        }
      } else {
        console.error("Could not find preview element");
      }
      
      setIsGenerating(false);
      setRenderHidden(false);
    }, 800);
  }, [createPDF, isInvoice]);

  const generatePDFFromPreview = useCallback(async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      await createPDF(previewRef.current);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [createPDF]);

  const handlePreview = () => {
    setShowPreview(true);
  };

  const generateWhatsAppMessage = (includeDetails: boolean = true) => {
    if (!isInvoice) {
      return generateSuratPenawaranMessage();
    }
    
    const dpPercentage = terminDPInfo.totalProjectAmount > 0 
      ? ((terminDPInfo.dpAmount / terminDPInfo.totalProjectAmount) * 100).toFixed(1)
      : "0";

    let itemsList = "";
    if (includeDetails && workItems.length > 0) {
      itemsList = workItems.map((item, idx) => 
        `   ${idx + 1}. ${item.category}${item.description ? ` - ${item.description}` : ""}: Rp ${formatCurrency(item.amount)}`
      ).join("\n");
    }

    let terminDPSection = "";
    if (invoiceType === "termin_dp" && terminDPInfo.totalProjectAmount > 0) {
      terminDPSection = `
📊 *Detail Termin DP:*
   • Total Nilai Pekerjaan: Rp ${formatCurrency(terminDPInfo.totalProjectAmount)}
   • Nominal DP (${dpPercentage}%): Rp ${formatCurrency(terminDPInfo.dpAmount)}
   • Termin Ke: #${terminDPInfo.terminNumber}
   • Sisa: Rp ${formatCurrency(terminDPInfo.totalProjectAmount - terminDPInfo.dpAmount)}
`;
    }

    const message = `
*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
       📋 *${getInvoiceTypeLabel().toUpperCase()}*
*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*

📄 *No. Invoice:* ${invoiceNumber || "-"}
📅 *Tanggal:* ${invoiceDate || "-"}

*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
             🏢 *KEPADA*
*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
🏢 ${clientInfo.companyName || "-"}
👤 PIC: ${clientInfo.picName || "-"}
📍 ${clientInfo.address || "-"}
${terminDPSection}
${includeDetails && workItems.length > 0 ? `
*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
           📝 *RINCIAN PEKERJAAN*
*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
${itemsList}
` : ""}
*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
💰 *TOTAL: Rp ${formatCurrency(invoiceType === "termin_dp" ? terminDPInfo.dpAmount || totalAmount : totalAmount)}*
*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*

🏦 *Transfer Pembayaran:*
┌─────────────────────────
│  Bank: *BNI*
│  No. Rek: *0249532534*
│  a.n: *SISWANTO*
└─────────────────────────

Terima kasih atas kepercayaannya 🙏

_SEMESTA TEKNO_
_Professional IT Solutions_
📞 +62 812-2512-9109
    `.trim();

    return message;
  };

  const generateSuratPenawaranMessage = () => {
    const pembayaranText = suratPenawaranInfo.mekanismePembayaran === "lunas" 
      ? "Pembayaran Lunas (100%)" 
      : "Pembayaran Termin (Bertahap)";

    const message = `
*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
       📋 *SURAT PENAWARAN*
*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*

📄 *No. Penawaran:* ${suratPenawaranInfo.nomorPenawaran || "-"}
📅 *Tanggal:* ${suratPenawaranInfo.tanggal || "-"}

*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
             🏢 *KEPADA*
*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
🏢 ${clientInfo.companyName || "-"}
👤 PIC: ${clientInfo.picName || "-"}
📍 ${clientInfo.address || "-"}

*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
           📝 *DETAIL PENAWARAN*
*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*
💼 *Jenis Pekerjaan:* ${suratPenawaranInfo.jenisPekerjaan || "-"}
💰 *Total Nominal:* Rp ${suratPenawaranInfo.totalNominal > 0 ? formatCurrency(suratPenawaranInfo.totalNominal) : "-"}
💳 *Mekanisme:* ${pembayaranText}
⏱️ *Lama Pengerjaan:* ${suratPenawaranInfo.lamaPengerjaan || "-"}

*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*

Demikian penawaran ini kami sampaikan.
Atas perhatian dan kerjasamanya, kami ucapkan terima kasih 🙏

_SEMESTA TEKNO_
_Professional IT Solutions_
📞 +62 812-2512-9109
    `.trim();

    return message;
  };

  const handleWhatsAppShare = (withDetails: boolean = true) => {
    const message = generateWhatsAppMessage(withDetails);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: whatsappUrl } }, "*");
    setShowWhatsAppOptions(false);
  };

  const handleCopyMessage = async () => {
    const message = generateWhatsAppMessage(true);
    try {
      await navigator.clipboard.writeText(message);
      setShowWhatsAppOptions(false);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const labels = {
    downloadButton: isInvoice ? "Download Invoice PDF" : "Download Penawaran PDF",
    previewButton: isInvoice ? "Preview Invoice" : "Preview Penawaran",
    previewTitle: isInvoice ? "Preview Invoice" : "Preview Surat Penawaran",
    currentNumber: isInvoice ? invoiceNumber : suratPenawaranInfo.nomorPenawaran,
  };

  return (
    <>
      <div className="pt-6 pb-2">
        {/* Success notification */}
        {downloadSuccess && (
          <div className="mb-4 flex items-center justify-center gap-2 py-3 px-4 bg-green-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-sm font-medium text-green-700">PDF berhasil di-download!</span>
          </div>
        )}

        {/* Mobile Layout */}
        <div className="flex flex-col gap-3 sm:hidden">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="relative flex items-center justify-center gap-2.5 w-full h-14 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg bg-gradient-to-r from-[#17a2b8] to-[#00bcd4] text-white hover:shadow-xl active:scale-[0.98] disabled:opacity-70 overflow-hidden"
          >
              {isGenerating ? (
                <Loader2 size={22} className="animate-spin" />
              ) : downloadSuccess ? (
                <CheckCircle size={22} />
              ) : (
                <Download size={22} strokeWidth={2.5} />
              )}
              <span>{isGenerating ? "Generating PDF..." : downloadSuccess ? "Downloaded!" : labels.downloadButton}</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-sm transition-all duration-200 bg-[#f5a623] text-white hover:bg-[#e09512] active:scale-[0.98] shadow-md"
            >
              <Eye size={18} strokeWidth={2.5} />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => setShowWhatsAppOptions(true)}
              className="flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-sm transition-all duration-200 bg-[#25D366] text-white hover:bg-[#20BD5A] active:scale-[0.98] shadow-md"
            >
              <MessageCircle size={18} strokeWidth={2.5} />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center justify-center gap-2 h-12 lg:h-14 rounded-xl font-semibold text-sm lg:text-base transition-all duration-200 shadow-lg bg-[#f5a623] text-white hover:brightness-105 active:scale-[0.98]"
            >
              <Eye size={20} strokeWidth={2.5} />
              <span>{labels.previewButton}</span>
            </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="relative flex items-center justify-center gap-2 h-12 lg:h-14 rounded-xl font-semibold text-sm lg:text-base transition-all duration-200 shadow-lg bg-gradient-to-br from-[#17a2b8] to-[#00bcd4] text-white hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
          >
            {isGenerating ? (
              <Loader2 size={20} className="animate-spin" />
            ) : downloadSuccess ? (
              <CheckCircle size={20} />
            ) : (
              <Download size={20} strokeWidth={2.5} />
            )}
            <span>{isGenerating ? "Generating..." : downloadSuccess ? "Downloaded!" : "Download PDF"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowWhatsAppOptions(true)}
            className="flex items-center justify-center gap-2 h-12 lg:h-14 rounded-xl font-semibold text-sm lg:text-base transition-all duration-200 shadow-lg bg-[#25D366] text-white hover:bg-[#20BD5A] active:scale-[0.98]"
          >
            <MessageCircle size={20} strokeWidth={2.5} />
            <span>Share WhatsApp</span>
          </button>
        </div>

        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </div>

      {renderHidden && (
        <div 
          style={{ 
            position: "fixed", 
            left: "-9999px", 
            top: 0,
            zIndex: -1,
          }}
        >
          {isInvoice ? (
            <div id="hidden-invoice-preview">
              <InvoicePreview ref={hiddenRef} />
            </div>
          ) : (
            <div id="hidden-surat-penawaran-preview">
              <SuratPenawaranPreview ref={hiddenRef} />
            </div>
          )}
        </div>
      )}

      {/* WhatsApp Options Modal */}
      {showWhatsAppOptions && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowWhatsAppOptions(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Share via WhatsApp</h3>
                  <p className="text-white/80 text-xs">Pilih format pesan</p>
                </div>
              </div>
              <button
                onClick={() => setShowWhatsAppOptions(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Options */}
            <div className="p-4 space-y-3">
              <button
                onClick={() => handleWhatsAppShare(true)}
                className="w-full flex items-center gap-4 p-4 bg-[#f0fdf4] border-2 border-[#25D366]/30 rounded-xl hover:bg-[#dcfce7] hover:border-[#25D366] transition-all group"
              >
                <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText size={24} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-[#0f172a]">Lengkap dengan Rincian</p>
                  <p className="text-xs text-[#64748b]">Include semua item pekerjaan</p>
                </div>
                <ExternalLink size={18} className="text-[#25D366]" />
              </button>

              <button
                onClick={() => handleWhatsAppShare(false)}
                className="w-full flex items-center gap-4 p-4 bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-xl hover:bg-[#f1f5f9] hover:border-[#cbd5e1] transition-all group"
              >
                <div className="w-12 h-12 bg-[#64748b] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Share2 size={24} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-[#0f172a]">Ringkasan Saja</p>
                  <p className="text-xs text-[#64748b]">Tanpa detail item pekerjaan</p>
                </div>
                <ExternalLink size={18} className="text-[#94a3b8]" />
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e2e8f0]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-[#94a3b8]">atau</span>
                </div>
              </div>

              <button
                onClick={handleCopyMessage}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-[#e2e8f0] rounded-xl hover:bg-[#f8fafc] hover:border-[#17a2b8] transition-all text-[#64748b] hover:text-[#17a2b8]"
              >
                <Copy size={18} />
                <span className="font-medium">Copy Pesan ke Clipboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#e2e8f0] bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f5a623]/10 rounded-xl flex items-center justify-center">
                  {isInvoice ? <Eye size={20} className="text-[#f5a623]" /> : <Send size={20} className="text-[#17a2b8]" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0f172a]">{labels.previewTitle}</h3>
                  <p className="text-xs text-[#64748b]">{labels.currentNumber || "Dokumen"} - {clientInfo.companyName || "Client"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={generatePDFFromPreview}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#17a2b8] to-[#00bcd4] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-70"
                >
                  {isGenerating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : downloadSuccess ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Download size={16} />
                  )}
                  {isGenerating ? "Generating..." : downloadSuccess ? "Downloaded!" : "Download PDF"}
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2.5 hover:bg-[#f1f5f9] rounded-xl transition-colors"
                >
                  <X size={20} className="text-[#64748b]" />
                </button>
              </div>
            </div>
            <div className="overflow-auto p-4 bg-[#64748b]/20">
              <div className="shadow-xl rounded-lg overflow-hidden">
                {isInvoice ? (
                  <InvoicePreview ref={previewRef} />
                ) : (
                  <SuratPenawaranPreview ref={previewRef} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionFooter;
