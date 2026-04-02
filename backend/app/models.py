from pydantic import BaseModel


class SimulateRequest(BaseModel):
    scenario_id: str
    mutation_mode: str = "all"
    detection_profile: str = "basic"