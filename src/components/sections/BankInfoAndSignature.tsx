"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";

const BNI_LOGO_URL = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/7b6ddbba-d08d-48ce-b89b-b73d742007d1/logo-bni-1768693122687.webp?width=8000&height=8000&resize=contain";

const BankInfoAndSignature: React.FC = () => {
  const whatsappUrl = "https://wa.me/6281225129109";
  const [copied, setCopied] = React.useState(false);
  const accountNumber = "0249532534";

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-6 md:pt-8 border-t border-[#e2e8f0]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Bank Information Card - Left Column */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
          {/* Main Gradient Background */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(145deg, #006d77 0%, #17a2b8 50%, #00bcd4 100%)",
            }}
          />
          
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.07]">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                rgba(255,255,255,0.5) 20px,
                rgba(255,255,255,0.5) 22px
              )`
            }} />
          </div>
          
          {/* Glow Effects */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#00bcd4]/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#006d77]/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

          {/* Content */}
          <div className="relative z-10 p-5 sm:p-6 text-white">
            {/* Header with Label */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                <p className="text-[10px] sm:text-xs text-white/70 uppercase tracking-[0.15em] font-semibold">
                  Transfer Pembayaran Ke
                </p>
              </div>
              <div className="px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-[9px] font-medium text-white/80 uppercase tracking-wider">Verified</span>
              </div>
            </div>
            
            {/* Bank Logo Section */}
            <div className="flex items-center gap-4 mb-5 p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 shadow-lg">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg overflow-hidden p-1.5">
                <img
                  src={BNI_LOGO_URL}
                  alt="BNI Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg sm:text-xl leading-tight tracking-tight">
                  Bank Negara Indonesia
                </p>
                <p className="text-xs text-white/70 mt-0.5 font-medium">
                  BNI • Persero Tbk
                </p>
              </div>
            </div>

            {/* Account Number Display */}
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/25 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wide font-medium">
                  Nomor Rekening
                </p>
                <button
                  onClick={handleCopyAccount}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 border border-white/20 group"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-green-300" />
                      <span className="text-[10px] font-medium text-green-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} className="text-white/70 group-hover:text-white" />
                      <span className="text-[10px] font-medium text-white/70 group-hover:text-white">Salin</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="flex items-baseline gap-1">
                <p className="text-2xl sm:text-3xl font-bold tracking-[0.1em] font-mono text-white drop-shadow-sm">
                  {accountNumber}
                </p>
              </div>
              
              <div className="mt-3 pt-3 border-t border-white/15">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold">S</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      SISWANTO
                    </p>
                    <p className="text-[9px] text-white/60">Account Holder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hormat Kami Section - Right Column */}
        <div className="bg-gradient-to-br from-[#f8fafc] to-[#f0f9fa] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#e2e8f0] flex flex-col items-center justify-center shadow-sm">
          <p className="text-xs text-[#64748b] font-medium mb-4">
            Hormat Kami,
          </p>

          {/* QR Code */}
          <div className="relative mb-4">
            <div className="p-3 bg-white rounded-2xl border border-[#e2e8f0] shadow-lg">
              {/* Corner Decorations */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-[3px] border-l-[3px] border-[#17a2b8] rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-[3px] border-r-[3px] border-[#17a2b8] rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-[3px] border-l-[3px] border-[#17a2b8] rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-[3px] border-r-[3px] border-[#17a2b8] rounded-br-lg" />

              <QRCodeSVG
                value={whatsappUrl}
                size={90}
                level="M"
                bgColor="#ffffff"
                fgColor="#0f172a"
              />
            </div>
            <p className="text-[9px] text-[#94a3b8] text-center mt-2 font-medium">
              Scan untuk WhatsApp
            </p>
          </div>

          {/* Signature Info */}
          <div className="text-center">
            <p className="font-bold text-[#0f172a] text-sm tracking-tight">
              SISWANTO, S.Pd, S.Kom, M.Kom
            </p>
            <p className="text-[11px] text-[#64748b] mt-1">
              Direktur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankInfoAndSignature;
