import streamlit as st
import pandas as pd
import plotly.express as px

# ---------- Load NGO master data ----------
@st.cache_data
def load_data():
    df = pd.read_csv("ngo_financials.csv")
    df.columns = df.columns.str.strip()
    return df

df = load_data()

st.title("NGO Financial Analytics Dashboard")

# Show columns for reference
st.write("Columns in CSV:", df.columns.tolist())

# Use 'name' as NGO identifier if present, else first column
if "name" in df.columns:
    ngo_col = "name"
else:
    ngo_col = df.columns[0]

st.write(f"Using '{ngo_col}' as NGO identifier column.")

# NGO selector
ngo_list = ["All"] + sorted(df[ngo_col].astype(str).unique().tolist())
selected_ngo = st.selectbox("Select NGO", ngo_list)

filtered_df = df.copy()
if selected_ngo != "All":
    filtered_df = filtered_df[filtered_df[ngo_col] == selected_ngo]

# Optional: download PDF link (if API is running)
if selected_ngo != "All":
    st.link_button(
        "📄 Download NGO PDF Report",
        f"http://localhost:8000/api/report/{selected_ngo}"
    )

st.markdown("---")

# ---------- Dummy financial analytics (no real financial columns needed) ----------

# We'll create fake periods and values just for visualization
periods = ["FY 2022-23", "FY 2023-24", "FY 2024-25"]

# Use NGO index to vary numbers slightly
if selected_ngo == "All":
    base_factor = 1
else:
    base_factor = int(filtered_df.index[0]) + 1

# 1) Spend Trend (dummy)
st.subheader("Spend Trend (Demo)")

spend_values = [10 * base_factor, 12 * base_factor, 11 * base_factor]  # in lakhs
spend_trend = pd.DataFrame({
    "period": periods,
    "total_spend": spend_values,
})

fig_spend = px.line(
    spend_trend,
    x="period",
    y="total_spend",
    markers=True,
    title="Total Spend Over Time (Demo)"
)
st.plotly_chart(fig_spend, use_container_width=True)

# 2) Program vs Admin Donut (dummy)
st.subheader("Program vs Admin Spend (Demo)")

program_spend = 0.8 * spend_values[-1]
admin_spend = 0.2 * spend_values[-1]

donut_df = pd.DataFrame({
    "category": ["Program", "Admin"],
    "amount": [program_spend, admin_spend]
})

fig_donut = px.pie(
    donut_df,
    names="category",
    values="amount",
    hole=0.5,
    title="Program vs Admin Split (Demo)"
)
st.plotly_chart(fig_donut, use_container_width=True)

# 3) Surplus Trend (dummy)
st.subheader("Surplus Trend (Demo)")

income_values = [v * 1.1 for v in spend_values]
surplus_values = [inc - exp for inc, exp in zip(income_values, spend_values)]

surplus_trend = pd.DataFrame({
    "period": periods,
    "surplus": surplus_values
})

fig_surplus = px.bar(
    surplus_trend,
    x="period",
    y="surplus",
    title="Surplus / Deficit Over Time (Demo)"
)
st.plotly_chart(fig_surplus, use_container_width=True)

# 4) Liquidity Trend (dummy)
st.subheader("Liquidity Trend (Demo)")

current_ratio_values = [1.5, 1.8, 1.6]

liq_trend = pd.DataFrame({
    "period": periods,
    "current_ratio": current_ratio_values
})

fig_liq = px.line(
    liq_trend,
    x="period",
    y="current_ratio",
    markers=True,
    title="Liquidity (Current Ratio) Over Time (Demo)"
)
st.plotly_chart(fig_liq, use_container_width=True)

# 5) Risk Heatmap (Demo)
st.subheader("Risk Heatmap (Demo)")

# Build a list of NGOs to show in the heatmap
if selected_ngo == "All":
    ngos = filtered_df[ngo_col].astype(str).unique().tolist()
else:
    ngos = [str(selected_ngo)]

if len(ngos) == 0:
    st.info("No NGOs available to display in risk heatmap.")
else:
    n = len(ngos)

    risk_df = pd.DataFrame({
        ngo_col: ngos,
        "risk_liquidity": [0.3 * base_factor] * n,
        "risk_sustainability": [0.4 * base_factor] * n,
        "risk_compliance": [0.2 * base_factor] * n,
    })

    risk_melt = risk_df.melt(
        id_vars=ngo_col,
        value_vars=["risk_liquidity", "risk_sustainability", "risk_compliance"],
        var_name="risk_type",
        value_name="risk_score"
    )

    fig_risk = px.density_heatmap(
        risk_melt,
        x="risk_type",
        y=ngo_col,
        z="risk_score",
        title="Risk Heatmap (Higher = More Risk) – Demo"
    )
    st.plotly_chart(fig_risk, use_container_width=True)

st.info("Note: All analytics above use demo values because financial columns are not present in the CSV. Structure is ready for real data.")
