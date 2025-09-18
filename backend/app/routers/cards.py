from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import csv
import io
from ..database import get_db
from ..schemas.card import Card, CardCreate, CardUpdate, Inventory, InventoryCreate, InventoryUpdate, PriceHistory, PriceHistoryCreate
from ..crud import card as crud_card

router = APIRouter(prefix="/api/cards", tags=["cards"])


@router.get("/", response_model=List[Card])
def read_cards(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return crud_card.get_cards(db, skip=skip, limit=limit, search=search)


@router.get("/{card_id}", response_model=Card)
def read_card(card_id: int, db: Session = Depends(get_db)):
    db_card = crud_card.get_card(db, card_id=card_id)
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card


@router.post("/", response_model=Card)
def create_card(card: CardCreate, db: Session = Depends(get_db)):
    return crud_card.create_card(db=db, card=card)


@router.put("/{card_id}", response_model=Card)
def update_card(card_id: int, card: CardUpdate, db: Session = Depends(get_db)):
    db_card = crud_card.update_card(db, card_id=card_id, card_update=card)
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card


@router.delete("/{card_id}")
def delete_card(card_id: int, db: Session = Depends(get_db)):
    success = crud_card.delete_card(db, card_id=card_id)
    if not success:
        raise HTTPException(status_code=404, detail="Card not found")
    return {"message": "Card deleted successfully"}


@router.post("/bulk-upload")
async def bulk_upload_cards(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    content = await file.read()
    csv_data = csv.DictReader(io.StringIO(content.decode('utf-8')))

    created_cards = []
    errors = []

    for row_num, row in enumerate(csv_data, start=2):
        try:
            card_data = CardCreate(
                name=row['name'],
                card_number=row.get('card_number'),
                set_name=row['set_name'],
                rarity=row.get('rarity'),
                condition=row.get('condition', 'NM'),
                language=row.get('language', 'JP'),
                description=row.get('description')
            )
            card = crud_card.create_card(db=db, card=card_data)
            created_cards.append(card)
        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")

    return {
        "created_count": len(created_cards),
        "errors": errors,
        "cards": created_cards
    }


@router.get("/inventory/", response_model=List[Inventory])
def read_inventory(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_card.get_inventory(db, skip=skip, limit=limit)


@router.post("/inventory/", response_model=Inventory)
def create_inventory(inventory: InventoryCreate, db: Session = Depends(get_db)):
    return crud_card.create_inventory(db=db, inventory=inventory)


@router.put("/inventory/{inventory_id}", response_model=Inventory)
def update_inventory(inventory_id: int, inventory: InventoryUpdate, db: Session = Depends(get_db)):
    db_inventory = crud_card.update_inventory(db, inventory_id=inventory_id, inventory_update=inventory)
    if db_inventory is None:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return db_inventory


@router.get("/{card_id}/price-history", response_model=List[PriceHistory])
def read_price_history(card_id: int, db: Session = Depends(get_db)):
    return crud_card.get_price_history(db, card_id=card_id)


@router.post("/{card_id}/price-history", response_model=PriceHistory)
def create_price_history(card_id: int, price_history: PriceHistoryCreate, db: Session = Depends(get_db)):
    price_history.card_id = card_id
    return crud_card.create_price_history(db=db, price_history=price_history)