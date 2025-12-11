from fastapi import APIRouter, HTTPException, Depends
from typing import Dict
import httpx
import os
from dependencies import get_api_key

router = APIRouter(prefix="/ai", tags=["AI Integration"])

@router.post("/test-communication")
async def test_communication_system(
    test_data: Dict,
    api_key: str = Depends(get_api_key)
) -> Dict:
    """Test communication system via LangGraph"""
    try:
        langgraph_url = os.getenv("LANGGRAPH_SERVICE_URL", "https://bhiv-hr-langgraph.onrender.com")
        
        # Route to appropriate test endpoint
        channel = test_data.get("channel", "email")
        
        if channel == "email":
            response = await httpx.post(f"{langgraph_url}/test/send-email",
                                      params=test_data,
                                      headers={"Authorization": f"Bearer {api_key}"},
                                      timeout=10.0)
        elif channel == "whatsapp":
            response = await httpx.post(f"{langgraph_url}/test/send-whatsapp", 
                                      params=test_data,
                                      headers={"Authorization": f"Bearer {api_key}"},
                                      timeout=10.0)
        elif channel == "telegram":
            response = await httpx.post(f"{langgraph_url}/test/send-telegram",
                                      params=test_data, 
                                      headers={"Authorization": f"Bearer {api_key}"},
                                      timeout=10.0)
        else:
            raise HTTPException(status_code=400, detail="Invalid channel")
            
        return {"success": True, "result": response.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/gemini/analyze")
async def analyze_with_gemini(
    text: str,
    analysis_type: str = "resume",
    api_key: str = Depends(get_api_key)
) -> Dict:
    """Analyze text using Gemini AI"""
    try:
        # Add Gemini integration here
        return {"success": True, "analysis": "Gemini analysis placeholder"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))