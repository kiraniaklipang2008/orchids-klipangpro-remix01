import React from 'react';

interface PaymentSummaryProps {
  totalAmount?: number;
  terbilang?: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ 
  totalAmount = 0, 
  terbilang = "Nol Rupiah" 
}) => {
  // Format the amount with thousand separators
  const formattedAmount = new Intl.NumberFormat('id-ID').format(totalAmount);

  return (
    <div className="mt-4 bg-[#f0f9fa]/50 rounded-xl p-4 border border-[#17a2b8]/20 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="font-sans font-bold text-[#0f172a] text-base sm:text-lg">
          Total Pembayaran
        </span>
        <span className="font-sans font-bold text-[#17a2b8] text-xl sm:text-2xl">
          Rp&nbsp;{formattedAmount}
        </span>
      </div>
      
      <div className="mt-2 pt-2 border-t border-[#e2e8f0]/50">
        <p className="text-xs sm:text-sm text-[#64748b]">
          <span className="font-semibold text-[#0f172a]">Terbilang:</span>{" "}
          <span className="italic">{terbilang}</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentSummary;