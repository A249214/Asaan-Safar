import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 11)}`;
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>"'&]/g, '');
}

export function validateCNIC(cnic: string): boolean {
  return /^\d{5}-\d{7}-\d{1}$/.test(cnic);
}

export function maskCNIC(cnic: string): string {
  if (!cnic || cnic.length < 15) return cnic;
  // e.g. 35201-1234567-1 -> 35201-*****67-1
  return `${cnic.slice(0, 6)}*****${cnic.slice(11)}`;
}

export function formatCNICInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
}

export function validateMobile(mobile: string): boolean {
  return /^03\d{9}$/.test(mobile.replace(/\D/g, ''));
}

export function maskMobile(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.length < 11) return mobile;
  return `${digits.slice(0, 4)}-***${digits.slice(7)}`;
}

export function generatePNR(prefix = 'TPK'): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${code}`;
}

export function generateServerBookingId(): string {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BK-${today}-${rand}`;
}
