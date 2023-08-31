from typing import List
from pydantic import BaseModel


class TowardsFrontendPayload(BaseModel):
    text: str
    function: str
    args: List[str]
