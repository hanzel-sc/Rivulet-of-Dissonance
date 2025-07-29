from pydantic import BaseModel

class MediaRequest(BaseModel):
    query: str
    type: str