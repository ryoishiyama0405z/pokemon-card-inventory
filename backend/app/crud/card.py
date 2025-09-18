from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from typing import List, Optional
from ..models.card import Card, Inventory, PriceHistory
from ..schemas.card import CardCreate, CardUpdate, InventoryCreate, InventoryUpdate, PriceHistoryCreate


def get_card(db: Session, card_id: int) -> Optional[Card]:
    return db.query(Card).filter(Card.id == card_id).first()


def get_cards(db: Session, skip: int = 0, limit: int = 100, search: str = None) -> List[Card]:
    query = db.query(Card)
    if search:
        query = query.filter(Card.name.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()


def create_card(db: Session, card: CardCreate) -> Card:
    db_card = Card(**card.dict())
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card


def update_card(db: Session, card_id: int, card_update: CardUpdate) -> Optional[Card]:
    db_card = get_card(db, card_id)
    if db_card:
        update_data = card_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_card, field, value)
        db.commit()
        db.refresh(db_card)
    return db_card


def delete_card(db: Session, card_id: int) -> bool:
    db_card = get_card(db, card_id)
    if db_card:
        db.delete(db_card)
        db.commit()
        return True
    return False


def get_inventory(db: Session, skip: int = 0, limit: int = 100) -> List[Inventory]:
    return db.query(Inventory).offset(skip).limit(limit).all()


def get_inventory_by_card(db: Session, card_id: int) -> Optional[Inventory]:
    return db.query(Inventory).filter(Inventory.card_id == card_id).first()


def create_inventory(db: Session, inventory: InventoryCreate) -> Inventory:
    db_inventory = Inventory(**inventory.dict())
    db.add(db_inventory)
    db.commit()
    db.refresh(db_inventory)
    return db_inventory


def update_inventory(db: Session, inventory_id: int, inventory_update: InventoryUpdate) -> Optional[Inventory]:
    db_inventory = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if db_inventory:
        update_data = inventory_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_inventory, field, value)
        db.commit()
        db.refresh(db_inventory)
    return db_inventory


def get_price_history(db: Session, card_id: int, limit: int = 50) -> List[PriceHistory]:
    return (db.query(PriceHistory)
            .filter(PriceHistory.card_id == card_id)
            .order_by(desc(PriceHistory.date_recorded))
            .limit(limit)
            .all())


def create_price_history(db: Session, price_history: PriceHistoryCreate) -> PriceHistory:
    db_price_history = PriceHistory(**price_history.dict())
    db.add(db_price_history)
    db.commit()
    db.refresh(db_price_history)
    return db_price_history