import { describe, it, expect, beforeEach } from 'vitest';
import { adminService } from '@/services/admin.service';
import { UserRole } from '@/types/auth.types';
import { useAuditStore } from '@/stores/audit.store';

describe('Phase 8 — Security, RBAC & Passenger PII Governance Tests', () => {
  beforeEach(() => {
    // Reset audit log state before test if needed
  });

  describe('Role-Based Access Control (RBAC) & Service Protection', () => {
    it('rejects unauthorized users (Customer or undefined role) from updating routes with 403 Forbidden', async () => {
      await expect(
        adminService.updateRoute('r1', { fare: 9999 }, UserRole.CUSTOMER)
      ).rejects.toThrow(/403 Forbidden/i);

      await expect(
        adminService.updateRoute('r1', { fare: 9999 }, undefined)
      ).rejects.toThrow(/403 Forbidden/i);
    });

    it('rejects unauthorized users from performing safe vehicle replacements', async () => {
      await expect(
        adminService.replaceVehicleSafely('r1', 'BT-TEST', 50, UserRole.CUSTOMER)
      ).rejects.toThrow(/403 Forbidden/i);

      await expect(
        adminService.replaceVehicleSafely('r1', 'BT-TEST', 50, UserRole.CONDUCTOR)
      ).rejects.toThrow(/403 Forbidden/i);
    });

    it('allows authorized Admin / Manager to execute administrative operations', async () => {
      const res = await adminService.updateRoute('r1', { platform: 'Bay 01' }, UserRole.ADMIN);
      expect(res.data).toBeDefined();
      expect(res.data.platform).toBe('Bay 01');
    });
  });

  describe('Passenger Manifest PII Protection by Role', () => {
    it('restricts passenger CNIC and phone on manifests viewed by conductors', async () => {
      const res = await adminService.getAdminBookings(UserRole.CONDUCTOR);
      expect(res.data.length).toBeGreaterThan(0);

      const record = res.data[0];
      expect(record.isCnicMasked).toBe(true);
      expect(record.isPhoneMasked).toBe(true);

      // Verify that middle digits are masked with asterisks
      expect(record.passengerInfo.cnic).toContain('*****');
      expect(record.passengerInfo.mobile).toContain('***');
    });

    it('logs an audit trail entry whenever full unmasked PII is accessed by an Admin', async () => {
      const initialLogs = useAuditStore.getState().entries.length;
      const res = await adminService.getAdminBookings(UserRole.ADMIN);
      expect(res.data.length).toBeGreaterThan(0);

      const record = res.data[0];
      expect(record.isCnicMasked).toBe(false);

      const updatedLogs = useAuditStore.getState().entries;
      expect(updatedLogs.length).toBeGreaterThan(initialLogs);
      const auditEntry = updatedLogs[0];
      expect(auditEntry.action).toBe('PII_ACCESS_AUDIT');
      expect(auditEntry.details).toContain('passenger manifest');
    });
  });

  describe('Gate Verification & Boarding Admission', () => {
    it('permits authorized staff to admit and check in passengers', async () => {
      const { data: bookings } = await adminService.getAdminBookings(UserRole.ADMIN);
      const activeBooking = bookings.find((b) => b.status === 'confirmed');
      expect(activeBooking).toBeDefined();

      const checkInRes = await adminService.checkInPassenger(activeBooking!.pnr, UserRole.CONDUCTOR);
      expect(checkInRes.success).toBe(true);
      expect(checkInRes.message).toContain('successfully boarded');

      // Check audit log for gate check-in record
      const latestLog = useAuditStore.getState().entries[0];
      expect(latestLog.action).toBe('PASSENGER_BOARDED_GATE');
      expect(latestLog.resource).toBe(activeBooking!.pnr);
    });

    it('rejects unauthorized customers from checking in tickets at gate', async () => {
      await expect(
        adminService.checkInPassenger('TPK-93A8B1', UserRole.CUSTOMER)
      ).rejects.toThrow(/403 Forbidden/i);
    });
  });
});
