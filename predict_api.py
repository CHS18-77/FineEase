# predict_api.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from pathlib import Path
import pandas as pd

# ----------------------------------------------------------------------------
# FASTAPI APP
# ----------------------------------------------------------------------------

app = FastAPI(title="FinEase ML Prediction API")

# CORS (ALLOW NEXT.JS or LOCALHOST FRONTEND)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # you can restrict later to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------------------------------
# LOAD ML MODEL
# ----------------------------------------------------------------------------

MODEL_PATH = Path("outputs/model_health.pkl")
model = joblib.load(MODEL_PATH)

# ----------------------------------------------------------------------------
# REQUEST BODY FOR SINGLE PREDICTION
# ----------------------------------------------------------------------------

class NGOFeatures(BaseModel):
    program_ratio: float
    admin_ratio: float
    surplus_ratio: float
    inventory_value: float
    inventory_expense_ratio: float
    inventory_asset_ratio: float
    assets: float
    liabilities: float
    total_income: float
    total_expenditure: float

# ----------------------------------------------------------------------------
# ENDPOINT: PREDICT FOR MANUAL INPUT
# ----------------------------------------------------------------------------

@app.post("/api/predict-health")
def predict_health(features: NGOFeatures):
    X = np.array([[
        features.program_ratio,
        features.admin_ratio,
        features.surplus_ratio,
        features.inventory_value,
        features.inventory_expense_ratio,
        features.inventory_asset_ratio,
        features.assets,
        features.liabilities,
        features.total_income,
        features.total_expenditure
    ]])

    prediction = model.predict(X)[0]
    probabilities = model.predict_proba(X)[0]
    classes = model.classes_.tolist()

    return {
        "prediction": prediction,
        "confidence": float(max(probabilities)),
        "probabilities": {
            "Good": float(probabilities[classes.index("Good")]) if "Good" in classes else 0,
            "Moderate": float(probabilities[classes.index("Moderate")]) if "Moderate" in classes else 0,
            "Risk": float(probabilities[classes.index("Risk")]) if "Risk" in classes else 0,
        }
    }

# ----------------------------------------------------------------------------
# HELPERS FOR BATCH PREDICTIONS
# ----------------------------------------------------------------------------

OUT_DIR = Path("outputs")
DETAILED_FILE = OUT_DIR / "financials_scored_detailed_debug.csv"

# fallback if debug file not found
if not DETAILED_FILE.exists():
    DETAILED_FILE = OUT_DIR / "financials_scored_detailed.csv"

def build_feature_row(row):
    return [
        float(row.get("program_ratio", 0)),
        float(row.get("admin_ratio", 0)),
        float(row.get("surplus_ratio", 0)),
        float(row.get("inventory_value", 0)),
        float(row.get("inventory_expense_ratio", 0)),
        float(row.get("inventory_asset_ratio", 0)),
        float(row.get("assets", 0)),
        float(row.get("liabilities", 0)),
        float(row.get("total_income", 0)),
        float(row.get("total_expenditure", 0)),
    ]

# ----------------------------------------------------------------------------
# ENDPOINT: PREDICT FOR ALL NGOs (LATEST YEAR)
# ----------------------------------------------------------------------------

@app.get("/api/ngos/predict-all", summary="Predict health for all NGOs (latest year)")
def predict_health_all():
    if not DETAILED_FILE.exists():
        raise HTTPException(status_code=500, detail=f"{DETAILED_FILE} not found. Run scoring first.")

    df = pd.read_csv(DETAILED_FILE)
    df = df.sort_values(["reg_no", "year"], ascending=[True, False])
    latest = df.groupby("reg_no").first().reset_index()

    X = [build_feature_row(r) for _, r in latest.iterrows()]
    preds = model.predict(X)
    probs = model.predict_proba(X)

    classes = model.classes_.tolist()
    result = []

    for i, (_, row) in enumerate(latest.iterrows()):
        prob_vec = probs[i]
        prob_dict = {
            c: float(prob_vec[classes.index(c)]) if c in classes else 0.0
            for c in ["Good", "Moderate", "Risk"]
        }

        result.append({
            "reg_no": row["reg_no"],
            "name": row.get("ngo_name", row.get("name", "")),
            "year": int(row["year"]),
            "prediction": preds[i],
            "confidence": float(max(prob_vec)),
            "probabilities": prob_dict,
            "health_score": float(row.get("health_score", 0)),
        })

    return result
# ----------------------------------------------------------------------------
# ENDPOINT: PREDICT FOR A SINGLE NGO (LATEST YEAR)
# ----------------------------------------------------------------------------
@app.get("/api/ngos/{reg_no}/predict-health", summary="Predict health for a single NGO (latest year)")
def predict_health_single(reg_no: str):
    # read detailed file and pick latest year for this reg_no
    if not DETAILED_FILE.exists():
        raise HTTPException(status_code=500, detail=f"{DETAILED_FILE} not found. Run scoring first.")
    df = pd.read_csv(DETAILED_FILE)
    df = df.sort_values(["reg_no", "year"], ascending=[True, False])
    row = df[df["reg_no"].str.lower() == reg_no.lower()]
    if row.empty:
        raise HTTPException(status_code=404, detail="NGO not found in detailed financials")
    r = row.iloc[0].to_dict()
    X = [build_feature_row(r)]
    pred = model.predict(X)[0]
    probs = model.predict_proba(X)[0]
    classes = model.classes_.tolist()
    prob_dict = {c: float(probs[classes.index(c)]) if c in classes else 0.0 for c in ["Good","Moderate","Risk"]}
    return {
        "reg_no": r.get("reg_no"),
        "name": r.get("ngo_name", r.get("name", "")),
        "year": int(r.get("year", 0)),
        "prediction": pred,
        "confidence": float(max(probs)),
        "probabilities": prob_dict,
        "health_score": float(r.get("health_score", 0))
    }
# ----------------------------------------------------------------------------
# ENDPOINT: EXPLAIN PREDICTION FOR A SINGLE NGO (top feature contributions)
# ----------------------------------------------------------------------------

FEATURE_NAMES = [
    "program_ratio",
    "admin_ratio",
    "surplus_ratio",
    "inventory_value",
    "inventory_expense_ratio",
    "inventory_asset_ratio",
    "assets",
    "liabilities",
    "total_income",
    "total_expenditure",
]
@app.get("/api/ngos/{reg_no}/explain", summary="Explain ML prediction for a single NGO (latest year)")
def explain_ngo(reg_no: str):
    if not DETAILED_FILE.exists():
        raise HTTPException(status_code=500, detail=f"{DETAILED_FILE} not found. Run scoring first.")
    df = pd.read_csv(DETAILED_FILE)
    df = df.sort_values(["reg_no", "year"], ascending=[True, False])
    row = df[df["reg_no"].str.lower() == reg_no.lower()]
    if row.empty:
        raise HTTPException(status_code=404, detail="NGO not found in detailed financials")
    r = row.iloc[0].to_dict()

    X_raw = [[
        float(r.get("program_ratio", 0)),
        float(r.get("admin_ratio", 0)),
        float(r.get("surplus_ratio", 0)),
        float(r.get("inventory_value", 0)),
        float(r.get("inventory_expense_ratio", 0)),
        float(r.get("inventory_asset_ratio", 0)),
        float(r.get("assets", 0)),
        float(r.get("liabilities", 0)),
        float(r.get("total_income", 0)),
        float(r.get("total_expenditure", 0)),
    ]]

    try:
        scaler = model.named_steps["scaler"]
        clf = model.named_steps["clf"]
    except Exception:
        raise HTTPException(status_code=500, detail="Model pipeline not in expected format (scaler + clf)")

    # Scale (warning about feature names is harmless)
    X_scaled = scaler.transform(X_raw)  # shape (1, n_features)

    coefs = clf.coef_        # shape: (n_classes, n_features) or (1, n_features) for binary
    classes = clf.classes_.tolist()
    pred = model.predict(X_raw)[0]
    # Determine contribution depending on binary vs multiclass
    if coefs.shape[0] == 1:
        # binary logistic: coef_ corresponds to class `classes[1]` (positive class)
        pos_coef = coefs[0]
        if pred == classes[1]:
            contrib_vals = (pos_coef * X_scaled[0]).tolist()
        else:
            contrib_vals = ((-pos_coef) * X_scaled[0]).tolist()
    else:
        # multiclass: direct multiply for the predicted class row
        pred_index = classes.index(pred)
        contrib_vals = (coefs[pred_index] * X_scaled[0]).tolist()

    FEATURE_NAMES = [
        "program_ratio",
        "admin_ratio",
        "surplus_ratio",
        "inventory_value",
        "inventory_expense_ratio",
        "inventory_asset_ratio",
        "assets",
        "liabilities",
        "total_income",
        "total_expenditure",
    ]

    contributions = []
    for i, name in enumerate(FEATURE_NAMES):
        contributions.append({
            "feature": name,
            "raw_value": float(X_raw[0][i]),
            "scaled_value": float(X_scaled[0][i]),
            "contribution": float(contrib_vals[i])
        })

    contributions_sorted = sorted(contributions, key=lambda x: abs(x["contribution"]), reverse=True)

    return {
        "reg_no": r.get("reg_no"),
        "name": r.get("ngo_name", r.get("name", "")),
        "year": int(r.get("year", 0)),
        "prediction": pred,
        "explanation_top": contributions_sorted[:5],
        "all_contributions": contributions_sorted
    }
@app.get("/")
def home():
    return {
        "message": "FinEase API is running successfully!",
        "docs": "Go to /docs for API documentation.",
        "endpoints": [
            "/api/predict-health",
            "/api/ngos/predict-all",
            "/api/ngos/{reg_no}/predict-health",
            "/api/ngos/{reg_no}/explain"
        ]
    }
