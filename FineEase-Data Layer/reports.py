from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
import io

def build_ngo_report(ngo, prediction, score, summary, recommendations):
    """
    ngo: dict with ngo_name, registration, etc.
    prediction: str  (e.g., "Low Risk / Stable")
    score: float or dict (e.g., overall risk score)
    summary: dict with key financial metrics
    recommendations: list of strings
    """

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    y = height - 2 * cm

    # Header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(2 * cm, y, f"NGO Financial Risk Report: {ngo['name']}")
    y -= 1.5 * cm

    c.setFont("Helvetica", 10)

    # Basic info
    c.drawString(2 * cm, y, f"Registration ID: {ngo.get('reg_id', 'N/A')}")
    y -= 0.6 * cm
    c.drawString(2 * cm, y, f"Reporting Period: {summary.get('period', 'N/A')}")
    y -= 1 * cm

    # Prediction + score
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2 * cm, y, "Prediction & Scores")
    y -= 0.7 * cm
    c.setFont("Helvetica", 10)
    c.drawString(2 * cm, y, f"Predicted Status: {prediction}")
    y -= 0.6 * cm
    c.drawString(2 * cm, y, f"Overall Score: {score}")
    y -= 1 * cm

    # Financial summary
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2 * cm, y, "Financial Summary")
    y -= 0.7 * cm
    c.setFont("Helvetica", 10)
    for key, value in summary.items():
        if key == "period":
            continue
        c.drawString(2 * cm, y, f"{key}: {value}")
        y -= 0.5 * cm
        if y < 3 * cm:
            c.showPage()
            y = height - 2 * cm
            c.setFont("Helvetica", 10)

    y -= 0.7 * cm

    # Recommendations
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2 * cm, y, "Recommendations")
    y -= 0.7 * cm
    c.setFont("Helvetica", 10)
    for i, rec in enumerate(recommendations, 1):
        c.drawString(2 * cm, y, f"{i}. {rec}")
        y -= 0.6 * cm
        if y < 3 * cm:
            c.showPage()
            y = height - 2 * cm
            c.setFont("Helvetica", 10)

    c.showPage()
    c.save()

    pdf_value = buffer.getvalue()
    buffer.close()
    return pdf_value
