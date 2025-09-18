from fastapi import APIRouter, HTTPException
from typing import List, Dict, Optional
from ..services.pokemon_tcg import PokemonTCGService

router = APIRouter(prefix="/api/pokemon-tcg", tags=["pokemon-tcg"])
tcg_service = PokemonTCGService()


@router.get("/search")
async def search_cards(name: str, set_name: Optional[str] = None) -> List[Dict]:
    """Pokemon TCG APIでカードを検索"""
    cards = await tcg_service.search_cards(name, set_name)
    return [tcg_service.format_card_data(card) for card in cards]


@router.get("/card/{card_id}")
async def get_card(card_id: str) -> Dict:
    """IDでカード情報を取得"""
    card = await tcg_service.get_card_by_id(card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    return tcg_service.format_card_data(card)


@router.get("/sets")
async def get_sets() -> List[Dict]:
    """利用可能なセット一覧を取得"""
    sets = await tcg_service.get_sets()
    return [{
        'id': s.get('id'),
        'name': s.get('name'),
        'series': s.get('series'),
        'releaseDate': s.get('releaseDate'),
        'total': s.get('total')
    } for s in sets]