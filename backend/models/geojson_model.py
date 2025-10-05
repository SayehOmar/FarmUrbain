from pydantic import BaseModel, Field
from typing import List, Dict, Any


class GeoJSONModel(BaseModel):
    """
    Schema for uploaded GeoJSON-like data stored in MongoDB.
    Example:
    {
        "type": "Polygon",
        "coordinates": [[[10.1, 36.8], [10.2, 36.8], [10.2, 36.9], [10.1, 36.9], [10.1, 36.8]]],
        "properties": {
            "name": "Farm 1",
            "size": "54",
            "landType": "rooftop",
            "price": "54",
            "description": "Rooftop farm"
        }
    }
    """

    type: str = Field(
        default="Polygon", description="The geometry type, e.g., Polygon, Point, etc."
    )
    coordinates: List[List[List[float]]] = Field(
        ..., description="Nested list of coordinates for the geometry"
    )
    properties: Dict[str, Any] = Field(
        ..., description="Additional properties of the feature"
    )
