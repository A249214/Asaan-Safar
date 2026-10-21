import { create } from 'zustand';
import { Ticket } from '@/types/ticket.types';
import { ticketService } from '@/services/ticket.service';
import { toast } from 'react-hot-toast';

interface TicketState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  validationResult: { valid: boolean; message: string } | null;
  isLoading: boolean;

  fetchTickets: () => Promise<void>;
  validateTicket: (qrCode: string) => Promise<void>;
  boardPassenger: (ticketId: string) => Promise<void>;
  lookupPassenger: (query: string) => Promise<Ticket[]>;
}

export const useTicketStore = create<TicketState>((set) => ({
  tickets: [],
  currentTicket: null,
  validationResult: null,
  isLoading: false,

  fetchTickets: async () => {
    set({ isLoading: true });
    try {
      const response = await ticketService.getTickets();
      set({ tickets: response.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  validateTicket: async (qrCode) => {
    set({ isLoading: true });
    try {
      const response = await ticketService.validateTicket(qrCode);
      set({
        currentTicket: response.data.ticket,
        validationResult: { valid: response.data.valid, message: response.data.message },
        isLoading: false,
      });
      if (response.data.valid) toast.success(response.data.message);
      else toast.error(response.data.message);
    } catch {
      set({ isLoading: false });
    }
  },

  boardPassenger: async (ticketId) => {
    const response = await ticketService.boardPassenger(ticketId);
    set((state) => ({
      currentTicket: response.data,
      tickets: state.tickets.map((t) => (t.id === ticketId ? response.data : t)),
    }));
    toast.success('Passenger boarded');
  },

  lookupPassenger: async (query) => {
    const response = await ticketService.lookupPassenger(query);
    return response;
  },
}));
