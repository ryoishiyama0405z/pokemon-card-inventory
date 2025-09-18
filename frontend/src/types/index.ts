export interface Card {
  id: number;
  name: string;
  card_number?: string;
  set_name: string;
  rarity?: string;
  condition: string;
  language: string;
  image_url?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface Inventory {
  id: number;
  card_id: number;
  quantity: number;
  purchase_price?: number;
  current_market_price?: number;
  purchase_date?: string;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  card: Card;
}

export interface PriceHistory {
  id: number;
  card_id: number;
  price: number;
  source?: string;
  date_recorded: string;
  condition?: string;
  notes?: string;
  card: Card;
}

export interface CardFormData {
  name: string;
  card_number?: string;
  set_name: string;
  rarity?: string;
  condition?: string;
  language?: string;
  image_url?: string;
  description?: string;
}

export interface InventoryFormData {
  card_id: number;
  quantity: number;
  purchase_price?: number;
  current_market_price?: number;
  purchase_date?: string;
  location?: string;
  notes?: string;
}

export interface PokemonTCGCard {
  tcg_id: string;
  name: string;
  card_number: string;
  set_name: string;
  rarity: string;
  image_url: string;
  market_price?: number;
  release_date: string;
  series: string;
}