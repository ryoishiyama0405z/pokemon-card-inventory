from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    card_number: Optional[str] = Field(None, max_length=50)
    set_name: str = Field(..., min_length=1, max_length=255)
    rarity: Optional[str] = Field(None, max_length=50)
    condition: str = Field(default="NM", max_length=50)
    language: str = Field(default="JP", max_length=10)
    image_url: Optional[str] = None
    description: Optional[str] = None


class CardCreate(CardBase):
    pass


class CardUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    card_number: Optional[str] = Field(None, max_length=50)
    set_name: Optional[str] = Field(None, min_length=1, max_length=255)
    rarity: Optional[str] = Field(None, max_length=50)
    condition: Optional[str] = Field(None, max_length=50)
    language: Optional[str] = Field(None, max_length=10)
    image_url: Optional[str] = None
    description: Optional[str] = None


class Card(CardBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InventoryBase(BaseModel):
    card_id: int
    quantity: int = Field(default=0, ge=0)
    purchase_price: Optional[float] = Field(None, ge=0)
    current_market_price: Optional[float] = Field(None, ge=0)
    purchase_date: Optional[datetime] = None
    location: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = None


class InventoryCreate(InventoryBase):
    pass


class InventoryUpdate(BaseModel):
    quantity: Optional[int] = Field(None, ge=0)
    purchase_price: Optional[float] = Field(None, ge=0)
    current_market_price: Optional[float] = Field(None, ge=0)
    purchase_date: Optional[datetime] = None
    location: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = None


class Inventory(InventoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    card: Card

    class Config:
        from_attributes = True


class PriceHistoryBase(BaseModel):
    card_id: int
    price: float = Field(..., ge=0)
    source: Optional[str] = Field(None, max_length=100)
    condition: Optional[str] = Field(None, max_length=50)
    notes: Optional[str] = None


class PriceHistoryCreate(PriceHistoryBase):
    pass


class PriceHistory(PriceHistoryBase):
    id: int
    date_recorded: datetime
    card: Card

    class Config:
        from_attributes = True


class CardWithInventory(Card):
    inventory_items: List[Inventory] = []
    price_history: List[PriceHistory] = []