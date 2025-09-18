from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    card_number = Column(String(50), nullable=True)
    set_name = Column(String(255), nullable=False)
    rarity = Column(String(50), nullable=True)
    condition = Column(String(50), default="NM")  # NM, LP, MP, HP, DMG
    language = Column(String(10), default="JP")  # JP, EN, etc.
    image_url = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    inventory_items = relationship("Inventory", back_populates="card")
    price_history = relationship("PriceHistory", back_populates="card")


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False)
    quantity = Column(Integer, default=0)
    purchase_price = Column(Float, nullable=True)
    current_market_price = Column(Float, nullable=True)
    purchase_date = Column(DateTime(timezone=True), nullable=True)
    location = Column(String(255), nullable=True)  # 保管場所
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    card = relationship("Card", back_populates="inventory_items")


class PriceHistory(Base):
    __tablename__ = "price_history"

    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False)
    price = Column(Float, nullable=False)
    source = Column(String(100), nullable=True)  # mercari, yahoo_auction, tcg_player, etc.
    date_recorded = Column(DateTime(timezone=True), server_default=func.now())
    condition = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)

    # Relationships
    card = relationship("Card", back_populates="price_history")