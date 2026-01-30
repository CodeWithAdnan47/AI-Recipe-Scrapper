from pydantic import BaseModel
from typing import Optional

class Recipe(BaseModel):
    id: int
    title: str
    ingredients: str
    instructions: str
    image_name: Optional[str] = None
    cleaned_ingredients: Optional[str] = None

    class Config:
        from_attributes = True
