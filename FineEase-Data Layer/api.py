from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
import io

from reports import build_ngo_report

app = FastAPI()

# ---- replace with real DB/model later ----
def get_ngo_data(ngo_id: str):
    ngo = {"id": ngo_id, "name": f"NGO {ngo_id}", "reg_id": "REG123"}
    prediction = "Low Risk / Stable"
    score = 0.82
    summary = {
        "period": "FY 2024-25",
        "Total Income": "₹ 50,00,000",
        "Total Spend": "₹ 45,00,000",
        "Surplus": "₹ 5,00,000",
        "Current Ratio": 1.8
    }
    recommendations = [
        "Increase diversification of funding sources.",
        "Maintain current liquidity position above 1.5.",
        "Reduce administrative overheads by 5–10%."
    ]
    return ngo, prediction, score, summary, recommendations
# -----------------------------------------

@app.get("/api/report/{ngo_id}")
def download_ngo_report(ngo_id: str):
    ngo, prediction, score, summary, recommendations = get_ngo_data(ngo_id)

    pdf_bytes = build_ngo_report(
        ngo=ngo,
        prediction=prediction,
        score=score,
        summary=summary,
        recommendations=recommendations
    )

    if not pdf_bytes:
        raise HTTPException(status_code=500, detail="Could not generate report")

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="ngo_report_{ngo_id}.pdf"'
        }
    )
