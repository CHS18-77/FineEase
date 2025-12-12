# scoring_debug.py
from pathlib import Path
import pandas as pd
import numpy as np
import traceback
import json
import sys

ROOT = Path.cwd()
DATA_DIR = ROOT / "data"
OUT_DIR = ROOT / "outputs"

print("Working directory:", ROOT)
print("Python executable:", sys.executable)
print("DATA_DIR exists?:", DATA_DIR.exists())
print("OUT_DIR exists before run?:", OUT_DIR.exists())
print()

# List files in project root and data folder
print("Files in project root:")
for p in sorted(ROOT.iterdir()):
    print("  ", p.name)
print()
if DATA_DIR.exists():
    print("Files in data/:")
    for p in sorted(DATA_DIR.iterdir()):
        print("  ", p.name)
else:
    print("data/ folder not found - please create and put CSVs there.")
print()

# Helper: safe read CSV and show head
def try_read(path):
    try:
        df = pd.read_csv(path)
        print(f"Loaded {path.name}: shape={df.shape}")
        print(df.head(2).to_string(index=False))
        return df
    except Exception as e:
        print(f"ERROR reading {path}: {e}")
        traceback.print_exc()
        return None

# Attempt to load the expected files
ngos = try_read(DATA_DIR / "NGOs.csv")
fin = try_read(DATA_DIR / "FINANCIALS.csv")
csr = try_read(DATA_DIR / "CSR_Funding.csv")

if any(x is None for x in [ngos, fin, csr]):
    print("\nOne or more required CSVs failed to load. Fix the files or names and re-run this script.")
    sys.exit(1)

# Quick schema checks (required columns)
required_fin_cols = {"reg_no","ngo_name","year","total_income","total_expenditure","program_expense","admin_expense"}
missing = required_fin_cols - set(fin.columns)
if missing:
    print("\nMissing required FINANCIALS columns:", missing)
    print("Columns present:", list(fin.columns))
    print("Please rename columns to match exactly and re-run.")
    sys.exit(1)

# Ensure outputs dir exists
OUT_DIR.mkdir(parents=True, exist_ok=True)
print("\nOUT_DIR ensured at:", OUT_DIR)

# Minimal processing to write outputs (mimics scoring.py behavior)
try:
    # Compute simple ratios
    fin_proc = fin.copy()
    fin_proc["program_ratio"] = fin_proc["program_expense"] / fin_proc["total_expenditure"].replace({0: np.nan})
    fin_proc["admin_ratio"] = fin_proc["admin_expense"] / fin_proc["total_expenditure"].replace({0: np.nan})
    fin_proc["surplus_ratio"] = (fin_proc["total_income"] - fin_proc["total_expenditure"]) / fin_proc["total_income"].replace({0: np.nan})
    fin_proc[["program_ratio","admin_ratio","surplus_ratio"]] = fin_proc[["program_ratio","admin_ratio","surplus_ratio"]].fillna(0)

    # Simple health score (toy)
    fin_proc["health_score"] = (fin_proc["program_ratio"] * 0.4 + (1 - fin_proc["admin_ratio"]) * 0.3 + ((fin_proc["surplus_ratio"] + 1)/2) * 0.3) * 100
    fin_proc["health_score"] = fin_proc["health_score"].round(2)

    # Save detailed file
    detailed_path = OUT_DIR / "financials_scored_detailed_debug.csv"
    fin_proc.to_csv(detailed_path, index=False)
    print("Wrote:", detailed_path)

    # Aggregated latest per NGO
    fin_proc_sorted = fin_proc.sort_values(["reg_no","year"], ascending=[True, False])
    latest = fin_proc_sorted.groupby("reg_no").first().reset_index()
    merged = latest.merge(ngos, on="reg_no", how="left")
    merged_path = OUT_DIR / "ngo_health_summary_debug.csv"
    merged.to_csv(merged_path, index=False)
    print("Wrote:", merged_path)

    # JSON summary
    json_path = OUT_DIR / "ngo_health_summary_debug.json"
    merged[["reg_no","name","year","health_score","program_ratio","admin_ratio","surplus_ratio"]].to_json(json_path, orient="records", force_ascii=False, indent=2)
    print("Wrote:", json_path)

    print("\nDone. Please open the outputs/ folder and confirm the three debug files are present.")
except Exception as e:
    print("Processing error:", e)
    traceback.print_exc()
    sys.exit(1)
