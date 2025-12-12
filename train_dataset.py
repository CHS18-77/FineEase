# train_dataset.py  (updated)
import pandas as pd
from pathlib import Path

OUT_DIR = Path("outputs")
OUT_DIR.mkdir(exist_ok=True)

# Try candidate filenames (pick the one that exists)
candidates = [
    OUT_DIR / "financials_scored_detailed.csv",
    OUT_DIR / "financials_scored_detailed_debug.csv",
    OUT_DIR / "financials_scored_detailed_debug1.csv"
]
INPUT = None
for c in candidates:
    if c.exists():
        INPUT = c
        break

if INPUT is None:
    raise FileNotFoundError(f"Could not find any of the expected files in outputs/: {candidates}")

print("Using input file:", INPUT)

df = pd.read_csv(INPUT)

# Ensure required numeric columns exist (fill missing with zeros where appropriate)
numeric_cols = ["total_expenditure", "assets", "inventory_value", "total_income"]
for col in numeric_cols:
    if col not in df.columns:
        print(f"Column '{col}' missing — creating with zeros")
        df[col] = 0

# Create inventory ratio columns if missing
if "inventory_expense_ratio" not in df.columns:
    # safe division
    df["inventory_expense_ratio"] = df.apply(
        lambda r: (r["inventory_value"] / r["total_expenditure"]) if r["total_expenditure"] not in (0, None) else 0,
        axis=1
    )
    print("Computed inventory_expense_ratio from inventory_value / total_expenditure")

if "inventory_asset_ratio" not in df.columns:
    df["inventory_asset_ratio"] = df.apply(
        lambda r: (r["inventory_value"] / r["assets"]) if r["assets"] not in (0, None) else 0,
        axis=1
    )
    print("Computed inventory_asset_ratio from inventory_value / assets")

# Create health_category from health_score
if "health_score" not in df.columns:
    raise KeyError("health_score column not found in the input file. Run scoring.py first.")

def categorize(score):
    if score >= 70:
        return "Good"
    elif score >= 50:
        return "Moderate"
    else:
        return "Risk"

df["health_category"] = df["health_score"].apply(categorize)

# Select features for ML (you can add/remove columns here)
features = [
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

# Ensure all feature columns exist; if missing create with zeros
for col in features:
    if col not in df.columns:
        print(f"Feature column '{col}' missing — creating with zeros")
        df[col] = 0

ml_df = df[features + ["health_category"]].copy()

OUT = OUT_DIR / "ml_training_dataset.csv"
ml_df.to_csv(OUT, index=False)
print("ML training dataset created at:", OUT)
print(ml_df.head(10).to_string(index=False))
