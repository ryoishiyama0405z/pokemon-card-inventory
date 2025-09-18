import axios from 'axios';
import { Card, CardFormData, Inventory, InventoryFormData, PriceHistory, PokemonTCGCard } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cards API
export const cardsAPI = {
  getAll: (params?: { skip?: number; limit?: number; search?: string }) =>
    api.get<Card[]>('/api/cards/', { params }),

  getById: (id: number) =>
    api.get<Card>(`/api/cards/${id}`),

  create: (data: CardFormData) =>
    api.post<Card>('/api/cards/', data),

  update: (id: number, data: Partial<CardFormData>) =>
    api.put<Card>(`/api/cards/${id}`, data),

  delete: (id: number) =>
    api.delete(`/api/cards/${id}`),

  bulkUpload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/cards/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Inventory API
export const inventoryAPI = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    api.get<Inventory[]>('/api/cards/inventory/', { params }),

  create: (data: InventoryFormData) =>
    api.post<Inventory>('/api/cards/inventory/', data),

  update: (id: number, data: Partial<InventoryFormData>) =>
    api.put<Inventory>(`/api/cards/inventory/${id}`, data),
};

// Price History API
export const priceHistoryAPI = {
  getByCard: (cardId: number) =>
    api.get<PriceHistory[]>(`/api/cards/${cardId}/price-history`),

  create: (cardId: number, data: { price: number; source?: string; condition?: string; notes?: string }) =>
    api.post<PriceHistory>(`/api/cards/${cardId}/price-history`, data),
};

// Pokemon TCG API
export const pokemonTCGAPI = {
  search: (name: string, setName?: string) =>
    api.get<PokemonTCGCard[]>('/api/pokemon-tcg/search', {
      params: { name, set_name: setName },
    }),

  getCard: (cardId: string) =>
    api.get<PokemonTCGCard>(`/api/pokemon-tcg/card/${cardId}`),

  getSets: () =>
    api.get('/api/pokemon-tcg/sets'),
};

export default api;