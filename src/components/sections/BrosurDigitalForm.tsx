"use client";

import React, { useState, useRef } from "react";
import { Building2, User, MapPin, Check, Star, Sparkles, Zap, MessageSquare, Database, Globe, Shield, Clock, Download, Phone, Mail, GlobeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";

const LOGO_URL = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/7b6ddbba-d08d-48ce-b89b-b73d742007d1/LOGO-copy-1768719686112.png?width=8000&height=8000&resize=contain";

interface PackageFeature {
  text: string;
  highlighted?: boolean;
}

interface Package {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  yearlyHosting: number;
  color: string;
  bgGradient: string;
  icon: React.ReactNode;
  features: PackageFeature[];
  popular?: boolean;
}

interface VendorInfo {
  name: string;
  whatsapp: string;
  email: string;
  website: string;
}

const packages: Package[] = [
  {
    id: "reguler",
    name: "Reguler",
    price: 2000000,
    priceLabel: "Rp 2.000.000",
    yearlyHosting: 650000,
    color: "#17a2b8",
    bgGradient: "from-[#17a2b8] to-[#0ea5e9]",
    icon: <Globe size={24} />,
    features: [
      { text: "Tema website sekolah" },
      { text: "Beranda, Profil, Berita, Galeri, Lokasi, Hubungi" },
      { text: "Hosting dan domain 1 tahun (per tahun Rp 650.000)" },
      { text: "Support Maintenance 24/7" },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 2500000,
    priceLabel: "Rp 2.500.000",
    yearlyHosting: 1150000,
    color: "#8b5cf6",
    bgGradient: "from-[#8b5cf6] to-[#a855f7]",
    icon: <Sparkles size={24} />,
    popular: true,
    features: [
      { text: "Tema website sekolah" },
      { text: "Beranda, Profil, Berita, Galeri, Lokasi, Hubungi" },
      { text: "VIDEO PROMO SEKOLAH DENGAN ANIMASI ARTIFICIAL INTELLIGENCE", highlighted: true },
      { text: "CUSTOMER SERVICE CHAT WHATSAPP OTOMATIS", highlighted: true },
      { text: "Hosting dan domain 1 tahun (per tahun Rp 1.150.000)" },
      { text: "Support Maintenance 24/7" },
    ],
  },
  {
    id: "bisnis",
    name: "Bisnis",
    price: 3000000,
    priceLabel: "Rp 3.000.000",
    yearlyHosting: 1500000,
    color: "#f59e0b",
    bgGradient: "from-[#f59e0b] to-[#f97316]",
    icon: <Zap size={24} />,
    features: [
      { text: "Tema website sekolah" },
      { text: "Beranda, Profil, Berita, Galeri, Lokasi, Hubungi" },
      { text: "VIDEO PROMO SEKOLAH DENGAN ANIMASI ARTIFICIAL INTELLIGENCE", highlighted: true },
      { text: "CUSTOMER SERVICE CHAT WHATSAPP OTOMATIS", highlighted: true },
      { text: "FORM PPDB DATABASE SEKOLAH", highlighted: true },
      { text: "Hosting dan domain 1 tahun (per tahun Rp 1.500.000)" },
      { text: "Support Maintenance 24/7" },
    ],
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

const BrosurDigitalForm: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const brosurRef = useRef<HTMLDivElement>(null);
  
  const [clientInfo, setClientInfoState] = useState({
    companyName: "",
    picName: "",
    address: "",
  });
  
  const [vendorInfo, setVendorInfo] = useState<VendorInfo>({
    name: "SEMESTA TEKNO",
    whatsapp: "0812-3456-7890",
    email: "info@semestatekno.com",
    website: "www.semestatekno.com",
  });
  
  const setClientInfo = (data: Partial<typeof clientInfo>) => {
    setClientInfoState(prev => ({ ...prev, ...data }));
  };

  const convertColorToRgb = (color: string): string => {
    if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
      return color;
    }
    if (color.includes('oklab') || color.includes('oklch') || color.includes('lab(') || color.includes('lch(') || color.includes('color(')) {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const imageData = ctx.getImageData(0, 0, 1, 1).data;
        return `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, ${(imageData[3] / 255).toFixed(2)})`;
      }
    }
    return color;
  };

  const convertBoxShadow = (boxShadow: string): string => {
    if (!boxShadow || boxShadow === 'none') return boxShadow;
    
    const colorFunctions = ['oklab', 'oklch', 'lab(', 'lch(', 'color('];
    if (!colorFunctions.some(fn => boxShadow.includes(fn))) {
      return boxShadow;
    }
    
    return boxShadow.replace(
      /(oklab|oklch|lab|lch|color)\([^)]+\)/gi,
      (match) => convertColorToRgb(match)
    );
  };

  const handleGeneratePDF = async () => {
    if (!brosurRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const element = brosurRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: false,
        removeContainer: true,
        imageTimeout: 30000,
        foreignObjectRendering: false,
        onclone: (_clonedDoc, clonedElement) => {
          clonedElement.style.width = "210mm";
          clonedElement.style.minHeight = "297mm";
          clonedElement.style.maxHeight = "297mm";
          clonedElement.style.overflow = "hidden";
          
          const images = clonedElement.querySelectorAll('img');
          images.forEach((img) => {
            img.crossOrigin = "anonymous";
            img.style.imageRendering = "auto";
          });
          
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const styles = window.getComputedStyle(htmlEl);
            
            const color = styles.color;
            const bgColor = styles.backgroundColor;
            const borderColor = styles.borderColor;
            const boxShadow = styles.boxShadow;
            const outlineColor = styles.outlineColor;
            const caretColor = styles.caretColor;
            
            if (color) {
              htmlEl.style.color = convertColorToRgb(color);
            }
            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
              htmlEl.style.backgroundColor = convertColorToRgb(bgColor);
            }
            if (borderColor) {
              htmlEl.style.borderColor = convertColorToRgb(borderColor);
            }
            if (boxShadow && boxShadow !== 'none') {
              htmlEl.style.boxShadow = convertBoxShadow(boxShadow);
            }
            if (outlineColor) {
              htmlEl.style.outlineColor = convertColorToRgb(outlineColor);
            }
            if (caretColor && caretColor !== 'auto') {
              htmlEl.style.caretColor = convertColorToRgb(caretColor);
            }
            
            const bgImage = styles.backgroundImage;
            if (bgImage && bgImage.includes('gradient')) {
              const convertedGradient = bgImage.replace(
                /(oklab|oklch|lab|lch|color)\([^)]+\)/gi,
                (match) => convertColorToRgb(match)
              );
              htmlEl.style.backgroundImage = convertedGradient;
            }
          });
        },
      });
      
      const imgData = canvas.toDataURL("image/png", 1.0);
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const widthRatio = pdfWidth / imgWidth;
      const heightRatio = pdfHeight / imgHeight;
      const ratio = Math.min(widthRatio, heightRatio);
      
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      const x = (pdfWidth - scaledWidth) / 2;
      const y = (pdfHeight - scaledHeight) / 2;
      
      pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight, undefined, "FAST");
      
      const clientName = clientInfo.companyName || "Klien";
      const sanitizedName = clientName.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-");
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `Brosur-Website-${sanitizedName}-${timestamp}.pdf`;
      
      pdf.save(fileName);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedPkg = packages.find(p => p.id === selectedPackage);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        <div className="bg-gradient-to-r from-[#0f172a]/10 to-[#1e293b]/10 px-4 sm:px-5 py-3 border-b border-[#e2e8f0]">
          <h3 className="font-bold text-[#0f172a] flex items-center gap-2">
            <User size={18} className="text-[#0f172a]" />
            Data Vendor
          </h3>
        </div>
        
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-2">
                Nama Vendor / Perusahaan
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={vendorInfo.name}
                  onChange={(e) => setVendorInfo({ ...vendorInfo, name: e.target.value })}
                  placeholder="SEMESTA TEKNO"
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-2">
                No. WhatsApp
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={vendorInfo.whatsapp}
                  onChange={(e) => setVendorInfo({ ...vendorInfo, whatsapp: e.target.value })}
                  placeholder="0812-3456-7890"
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="email"
                  value={vendorInfo.email}
                  onChange={(e) => setVendorInfo({ ...vendorInfo, email: e.target.value })}
                  placeholder="info@semestatekno.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-2">
                Website
              </label>
              <div className="relative">
                <GlobeIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={vendorInfo.website}
                  onChange={(e) => setVendorInfo({ ...vendorInfo, website: e.target.value })}
                  placeholder="www.semestatekno.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        <div className="bg-gradient-to-r from-[#17a2b8]/10 to-[#00bcd4]/10 px-4 sm:px-5 py-3 border-b border-[#e2e8f0]">
          <h3 className="font-bold text-[#0f172a] flex items-center gap-2">
            <Building2 size={18} className="text-[#17a2b8]" />
            Informasi Klien (Opsional)
          </h3>
        </div>
        
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-2">
                Nama Sekolah / Instansi
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={clientInfo.companyName}
                  onChange={(e) => setClientInfo({ companyName: e.target.value })}
                  placeholder="SDN Contoh 01"
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
                  placeholder="Kepala Sekolah / Admin"
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
                placeholder="Alamat lengkap sekolah..."
                rows={2}
                className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#17a2b8]/20 focus:border-[#17a2b8] transition-all resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        <div className="bg-gradient-to-r from-[#8b5cf6]/10 to-[#a855f7]/10 px-4 sm:px-5 py-3 border-b border-[#e2e8f0]">
          <h3 className="font-bold text-[#0f172a] flex items-center gap-2">
            <Star size={18} className="text-[#8b5cf6]" />
            Pilih Paket Website
          </h3>
        </div>
        
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPackage(pkg.id)}
                className={cn(
                  "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
                  selectedPackage === pkg.id
                    ? "border-current shadow-lg"
                    : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                )}
                style={{ 
                  borderColor: selectedPackage === pkg.id ? pkg.color : undefined,
                  backgroundColor: selectedPackage === pkg.id ? `${pkg.color}08` : undefined
                }}
              >
                {pkg.popular && (
                  <div 
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: pkg.color }}
                  >
                    POPULER
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                    style={{ background: `linear-gradient(135deg, ${pkg.color}, ${pkg.color}dd)` }}
                  >
                    {pkg.icon}
                  </div>
                  <h4 className="font-bold text-[#0f172a] text-lg">{pkg.name}</h4>
                </div>
                <p className="font-bold mt-1" style={{ color: pkg.color }}>{pkg.priceLabel}</p>
                <p className="text-xs text-[#64748b] mt-2">
                  Perpanjangan: Rp {formatCurrency(pkg.yearlyHosting)}/tahun
                </p>
                {selectedPackage === pkg.id && (
                  <div 
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: pkg.color }}
                  >
                    <Check size={14} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={brosurRef} className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden" style={{ width: "210mm", minHeight: "297mm", maxHeight: "297mm" }}>
        <div 
          className="px-5 py-4 text-white"
          style={{ background: `linear-gradient(135deg, ${selectedPkg?.color || "#17a2b8"}, ${selectedPkg?.color || "#17a2b8"}cc)` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <Image src={LOGO_URL} alt="Logo" width={40} height={40} className="object-contain" unoptimized />
              </div>
              <div>
                <h1 className="text-lg font-black leading-tight">Website Sekolah Profesional</h1>
                <p className="text-white/80 text-xs">Tingkatkan citra sekolah dengan website modern</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-medium">
                <Sparkles size={12} />
                Penawaran Spesial
              </div>
            </div>
          </div>
          {clientInfo.companyName && (
            <div className="mt-3 p-2.5 bg-white/10 backdrop-blur rounded-lg flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/70">Ditujukan untuk:</p>
                <p className="text-sm font-bold">{clientInfo.companyName}</p>
              </div>
              {clientInfo.picName && (
                <div className="text-right">
                  <p className="text-[10px] text-white/70">PIC:</p>
                  <p className="text-sm font-medium">{clientInfo.picName}</p>
                </div>
              )}
            </div>
          )}
        </div>

          <div className="relative" style={{ height: "320px", overflow: "hidden" }}>
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/75e11cd8-86c5-4809-a48f-01be02b62726/image-1768746935855.png?width=8000&height=8000&resize=contain"
              alt="Web Development Illustration"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-[#8b5cf6] px-6 py-2 rounded-full shadow-lg shadow-purple-500/30">
                <span className="text-white font-bold text-sm tracking-wide">PROMO JASA WEBSITE 2026</span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="text-center mb-3">
              <h2 className="text-base font-bold text-[#0f172a] flex items-center justify-center gap-1.5">
                <Star size={16} className="text-[#8b5cf6]" />
                Pilihan Paket Website
              </h2>
            </div>

          <div className="grid grid-cols-3 gap-3">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className={cn(
                  "relative rounded-xl border-2 overflow-hidden",
                  pkg.popular ? "border-[#8b5cf6]" : "border-[#e2e8f0]"
                )}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white text-center py-0.5 text-[9px] font-bold">
                    PALING DIMINATI
                  </div>
                )}
                <div className={cn("p-3", pkg.popular && "pt-5")}>
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ background: `linear-gradient(135deg, ${pkg.color}, ${pkg.color}dd)` }}
                    >
                      {React.cloneElement(pkg.icon as React.ReactElement, { size: 16 })}
                    </div>
                    <h3 className="text-sm font-bold text-[#0f172a]">{pkg.name}</h3>
                  </div>
                  <div className="mb-2">
                    <span className="text-base font-black" style={{ color: pkg.color }}>
                      {pkg.priceLabel}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <div 
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ 
                            backgroundColor: feature.highlighted ? pkg.color : `${pkg.color}20`,
                            color: feature.highlighted ? "white" : pkg.color
                          }}
                        >
                          <Check size={8} />
                        </div>
                        <span className={cn(
                          "text-[10px] leading-tight",
                          feature.highlighted ? "font-semibold text-[#0f172a]" : "text-[#64748b]"
                        )}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#e2e8f0]">
                    <p className="text-[9px] text-[#94a3b8]">Perpanjangan/tahun:</p>
                    <p className="font-bold text-[11px] text-[#0f172a]">Rp {formatCurrency(pkg.yearlyHosting)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { icon: <Shield size={14} />, label: "Garansi Keamanan", color: "#10b981" },
              { icon: <Clock size={14} />, label: "Support 24/7", color: "#f59e0b" },
              { icon: <MessageSquare size={14} />, label: "Konsultasi Gratis", color: "#8b5cf6" },
              { icon: <Database size={14} />, label: "Backup Data", color: "#17a2b8" },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-2 bg-[#f8fafc] rounded-lg">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto mb-1 text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <p className="text-[9px] font-medium text-[#64748b]">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-xl text-white">
            <div className="text-center mb-3">
              <h3 className="text-sm font-bold">Hubungi Kami</h3>
              <p className="text-white/70 text-[10px]">Konsultasikan kebutuhan website sekolah Anda</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <Phone size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-white/60">WhatsApp</p>
                  <p className="font-semibold text-[11px]">{vendorInfo.whatsapp}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#17a2b8] flex items-center justify-center flex-shrink-0">
                  <Mail size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-white/60">Email</p>
                  <p className="font-semibold text-[11px] break-all">{vendorInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                  <GlobeIcon size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-white/60">Website</p>
                  <p className="font-semibold text-[11px] break-all">{vendorInfo.website}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#f59e0b] flex items-center justify-center flex-shrink-0">
                  <Building2 size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-white/60">Perusahaan</p>
                  <p className="font-semibold text-[11px]">{vendorInfo.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto px-4 py-3 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-[#e2e8f0]">
                <Image src={LOGO_URL} alt="Logo" width={28} height={28} className="object-contain" unoptimized />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#0f172a]">{vendorInfo.name}</p>
                <p className="text-[9px] text-[#64748b]">Solusi Digital untuk Sekolah Indonesia</p>
              </div>
            </div>
            <div className="text-right text-[9px] text-[#64748b]">
              <p>{vendorInfo.website}</p>
              <p>{vendorInfo.whatsapp}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className={cn(
            "flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg",
            isGenerating 
              ? "bg-[#94a3b8] cursor-not-allowed" 
              : "bg-gradient-to-r from-[#17a2b8] to-[#0ea5e9] hover:shadow-xl hover:scale-[1.02]"
          )}
        >
          <Download size={20} />
          {isGenerating ? "Generating PDF..." : "Download Brosur PDF"}
        </button>
      </div>
    </div>
  );
};

export default BrosurDigitalForm;
