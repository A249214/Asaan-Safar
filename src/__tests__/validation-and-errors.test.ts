import { describe, it, expect } from 'vitest';
import {
  validateCNIC,
  validateMobile,
  maskCNIC,
  maskMobile,
  formatCNICInput,
  sanitizeInput,
  formatCurrency,
  generatePNR,
} from '@/lib/utils';

describe('Phase 8 — Validation, Data Sanitization & Formatting Tests', () => {
  describe('CNIC Validation & Formatting', () => {
    it('accepts correctly formatted 13-digit Pakistani CNICs (5-7-1 format)', () => {
      expect(validateCNIC('35201-1234567-1')).toBe(true);
      expect(validateCNIC('42101-7654321-2')).toBe(true);
      expect(validateCNIC('61101-9876543-3')).toBe(true);
    });

    it('rejects malformed or incomplete CNICs', () => {
      expect(validateCNIC('3520112345671')).toBe(false); // missing hyphens
      expect(validateCNIC('35201-123456-1')).toBe(false); // only 6 middle digits
      expect(validateCNIC('3520-1234567-1')).toBe(false); // only 4 prefix digits
      expect(validateCNIC('ABCDE-1234567-1')).toBe(false); // letters
      expect(validateCNIC('')).toBe(false);
    });

    it('formats raw digits automatically into standard 5-7-1 hyphenated pattern', () => {
      expect(formatCNICInput('3520112345671')).toBe('35201-1234567-1');
      expect(formatCNICInput('352011')).toBe('35201-1');
      expect(formatCNICInput('35201')).toBe('35201');
    });

    it('masks CNIC digits securely to protect passenger privacy on public manifests', () => {
      const masked = maskCNIC('35201-1234567-1');
      expect(masked).toBe('35201-*****67-1');
      expect(masked).not.toContain('12345');
    });
  });

  describe('Mobile Phone Number Validation & Masking', () => {
    it('accepts valid 11-digit Pakistani mobile numbers starting with 03', () => {
      expect(validateMobile('03001234567')).toBe(true);
      expect(validateMobile('03217654321')).toBe(true);
      expect(validateMobile('03459876543')).toBe(true);
      expect(validateMobile('0312-3456789')).toBe(true); // handles hyphens gracefully
    });

    it('rejects invalid mobile numbers (landline prefixes, short lengths, foreign formats)', () => {
      expect(validateMobile('04235889900')).toBe(false); // Lahore landline prefix (042)
      expect(validateMobile('02135889900')).toBe(false); // Karachi landline prefix (021)
      expect(validateMobile('0300123456')).toBe(false); // only 10 digits
      expect(validateMobile('12345678901')).toBe(false); // not starting with 03
      expect(validateMobile('abcdefghijk')).toBe(false);
    });

    it('masks middle phone digits securely for staff displays', () => {
      const masked = maskMobile('03001234567');
      expect(masked).toBe('0300-***4567');
      expect(masked).not.toContain('123');
    });
  });

  describe('Input Sanitization & Output Formatting', () => {
    it('strips dangerous HTML/script injection characters from user input', () => {
      const unsafe = '<script>alert("hack")</script>&"evil"';
      const clean = sanitizeInput(unsafe);
      expect(clean).toBe('scriptalert(hack)/scriptevil');
      expect(clean).not.toContain('<');
      expect(clean).not.toContain('>');
      expect(clean).not.toContain('"');
    });

    it('formats Pakistani Rupee currency properly with commas and Rs. prefix', () => {
      expect(formatCurrency(3500)).toBe('Rs. 3,500');
      expect(formatCurrency(125000)).toBe('Rs. 125,000');
      expect(formatCurrency(0)).toBe('Rs. 0');
    });

    it('generates unambiguous alphanumeric PNR codes avoiding confusing characters', () => {
      const pnr = generatePNR('TPK');
      expect(pnr).toMatch(/^TPK-[2-9A-HJ-NP-Z]{6}$/);
      // Ensures characters '0', '1', 'I', 'O' are avoided to prevent passenger misreading
      expect(pnr).not.toContain('0');
      expect(pnr).not.toContain('1');
      expect(pnr).not.toContain('I');
      expect(pnr).not.toContain('O');
    });
  });
});
