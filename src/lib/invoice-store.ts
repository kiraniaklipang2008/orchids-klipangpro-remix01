"use client";

import { create } from "zustand";

export type DocumentMode = "invoice" | "surat_penawaran" | "brosur_digital";
export type InvoiceType = "penagihan" | "termin_dp" | "pelunasan";
export type PaymentMechanism = "termin" | "lunas";

export interface WorkItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  notes: string;
}

export interface ClientInfo {
  companyName: string;
  picName: string;
  address: string;
}

export interface TerminDPInfo {
  totalProjectAmount: number;
  dpAmount: number;
  terminNumber: number;
}

export type PeriodType = "sekali" | "bulanan" | "tahunan" | "custom";

export interface PenawaranWorkItem {
  id: string;
  description: string;
  amount: number;
  period: PeriodType;
  customPeriod?: string;
}

export interface TerminItem {
  id: string;
  label: string;
  percentage: number;
  amount: number;
}

export interface SuratPenawaranInfo {
  nomorPenawaran: string | null;
  tanggal: string;
  jenisPekerjaan: string;
  workItems: PenawaranWorkItem[];
  totalNominal: number;
  mekanismePembayaran: PaymentMechanism;
  lamaPengerjaan: string;
  terminCount: number;
  terminItems: TerminItem[];
}

export interface InvoiceState {
  documentMode: DocumentMode;
  invoiceNumber: string | null;
  invoiceDate: string;
  invoiceType: InvoiceType;
  clientInfo: ClientInfo;
  workItems: WorkItem[];
  totalAmount: number;
  terminDPInfo: TerminDPInfo;
  suratPenawaranInfo: SuratPenawaranInfo;
  
  setDocumentMode: (mode: DocumentMode) => void;
  setInvoiceNumber: (num: string) => void;
  setInvoiceDate: (date: string) => void;
  setInvoiceType: (type: InvoiceType) => void;
  setClientInfo: (info: Partial<ClientInfo>) => void;
  setWorkItems: (items: WorkItem[]) => void;
  addWorkItem: (item: WorkItem) => void;
  updateWorkItem: (id: string, updates: Partial<WorkItem>) => void;
  removeWorkItem: (id: string) => void;
  setTerminDPInfo: (info: Partial<TerminDPInfo>) => void;
  setSuratPenawaranInfo: (info: Partial<SuratPenawaranInfo>) => void;
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  documentMode: "invoice",
  invoiceNumber: null,
  invoiceDate: "",
  invoiceType: "penagihan",
  clientInfo: {
    companyName: "",
    picName: "",
    address: "",
  },
  workItems: [
    {
      id: "1",
      category: "Web Design",
      description: "",
      amount: 0,
      notes: "",
    },
  ],
  totalAmount: 0,
  terminDPInfo: {
    totalProjectAmount: 0,
    dpAmount: 0,
    terminNumber: 1,
  },
  suratPenawaranInfo: {
    nomorPenawaran: null,
    tanggal: "",
    jenisPekerjaan: "",
    workItems: [{ id: "1", description: "", amount: 0, period: "sekali" }],
    totalNominal: 0,
    mekanismePembayaran: "lunas",
    lamaPengerjaan: "",
    terminCount: 2,
    terminItems: [
      { id: "1", label: "Termin 1 (DP)", percentage: 50, amount: 0 },
      { id: "2", label: "Termin 2 (Pelunasan)", percentage: 50, amount: 0 },
    ],
  },

  setDocumentMode: (mode) => set({ documentMode: mode }),
  setInvoiceNumber: (num) => set({ invoiceNumber: num }),
  setInvoiceDate: (date) => set({ invoiceDate: date }),
  setInvoiceType: (type) => set({ invoiceType: type }),
  setClientInfo: (info) =>
    set((state) => ({
      clientInfo: { ...state.clientInfo, ...info },
    })),
  setWorkItems: (items) =>
    set({
      workItems: items,
      totalAmount: items.reduce((sum, item) => sum + (item.amount || 0), 0),
    }),
  addWorkItem: (item) =>
    set((state) => {
      const newItems = [...state.workItems, item];
      return {
        workItems: newItems,
        totalAmount: newItems.reduce((sum, i) => sum + (i.amount || 0), 0),
      };
    }),
  updateWorkItem: (id, updates) =>
    set((state) => {
      const newItems = state.workItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      return {
        workItems: newItems,
        totalAmount: newItems.reduce((sum, i) => sum + (i.amount || 0), 0),
      };
    }),
  removeWorkItem: (id) =>
    set((state) => {
      const newItems = state.workItems.filter((item) => item.id !== id);
      return {
        workItems: newItems,
        totalAmount: newItems.reduce((sum, i) => sum + (i.amount || 0), 0),
      };
    }),
  setTerminDPInfo: (info) =>
    set((state) => ({
      terminDPInfo: { ...state.terminDPInfo, ...info },
    })),
  setSuratPenawaranInfo: (info) =>
    set((state) => ({
      suratPenawaranInfo: { ...state.suratPenawaranInfo, ...info },
    })),
}));
