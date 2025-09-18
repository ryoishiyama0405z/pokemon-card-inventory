import httpx
import os
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class PokemonTCGService:
    def __init__(self):
        self.base_url = "https://api.pokemontcg.io/v2"
        self.api_key = os.getenv("POKEMON_TCG_API_KEY")
        self.headers = {}
        if self.api_key:
            self.headers["X-Api-Key"] = self.api_key

    async def search_cards(self, name: str, set_name: Optional[str] = None) -> List[Dict]:
        """Pokemon TCG APIでカードを検索"""
        async with httpx.AsyncClient() as client:
            try:
                query = f'name:"{name}"'
                if set_name:
                    query += f' set.name:"{set_name}"'

                params = {
                    'q': query,
                    'pageSize': 20
                }

                response = await client.get(
                    f"{self.base_url}/cards",
                    params=params,
                    headers=self.headers,
                    timeout=10.0
                )
                response.raise_for_status()

                data = response.json()
                return data.get('data', [])

            except httpx.RequestError as e:
                logger.error(f"Request error: {e}")
                return []
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error: {e}")
                return []

    async def get_card_by_id(self, card_id: str) -> Optional[Dict]:
        """IDでカード情報を取得"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/cards/{card_id}",
                    headers=self.headers,
                    timeout=10.0
                )
                response.raise_for_status()

                data = response.json()
                return data.get('data')

            except httpx.RequestError as e:
                logger.error(f"Request error: {e}")
                return None
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error: {e}")
                return None

    async def get_sets(self) -> List[Dict]:
        """利用可能なセット一覧を取得"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/sets",
                    headers=self.headers,
                    timeout=10.0
                )
                response.raise_for_status()

                data = response.json()
                return data.get('data', [])

            except httpx.RequestError as e:
                logger.error(f"Request error: {e}")
                return []
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error: {e}")
                return []

    def format_card_data(self, tcg_card: Dict) -> Dict:
        """TCG APIのデータを内部形式に変換"""
        market_price = None
        if tcg_card.get('tcgplayer', {}).get('prices'):
            prices = tcg_card['tcgplayer']['prices']
            # 一般的な価格を取得（normal, holofoil, reverseHolofoilの順で優先）
            for price_type in ['normal', 'holofoil', 'reverseHolofoil']:
                if price_type in prices and 'market' in prices[price_type]:
                    market_price = prices[price_type]['market']
                    break

        return {
            'name': tcg_card.get('name', ''),
            'card_number': tcg_card.get('number', ''),
            'set_name': tcg_card.get('set', {}).get('name', ''),
            'rarity': tcg_card.get('rarity', ''),
            'image_url': tcg_card.get('images', {}).get('large', ''),
            'tcg_id': tcg_card.get('id', ''),
            'market_price': market_price,
            'release_date': tcg_card.get('set', {}).get('releaseDate', ''),
            'series': tcg_card.get('set', {}).get('series', '')
        }