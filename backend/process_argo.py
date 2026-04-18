import os
import requests
import xarray as xr
import pandas as pd
from datetime import datetime

# Directory to store downloaded NetCDF files
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
os.makedirs(DATA_DIR, exist_ok=True)

# Example NetCDF URLs from a reliable mirror (Ifremer GDAC)
NETCDF_URLS = [
    "https://data-argo.ifremer.fr/dac/aoml/6902743/6902743_prof.nc",
    "https://data-argo.ifremer.fr/dac/aoml/6902721/6902721_prof.nc",
]

csv_path = os.path.join(DATA_DIR, "argo_bob_temperature.csv")
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}

records = []
for url in NETCDF_URLS:
    filename = os.path.basename(url)
    file_path = os.path.join(DATA_DIR, filename)
    # Download if not already present or if it's suspiciously small (corrupted)
    if not os.path.exists(file_path) or os.path.getsize(file_path) < 1000:
        print(f"Downloading {url} ...")
        try:
            r = requests.get(url, headers=HEADERS, timeout=60)
            r.raise_for_status()
            with open(file_path, "wb") as f:
                f.write(r.content)
            print(f"Successfully downloaded {filename} ({os.path.getsize(file_path)} bytes)")
        except Exception as e:
            print(f"Failed to download {filename}: {e}")
            continue
    else:
        print(f"Using cached {filename} ({os.path.getsize(file_path)} bytes)")

    # Load with xarray using different engines (fallback for NetCDF3/4)
    ds = None
    for engine in ["netcdf4", "scipy", "h5netcdf"]:
        try:
            ds = xr.open_dataset(file_path, engine=engine)
            print(f"Successfully opened {filename} using {engine} engine.")
            break
        except Exception as e:
            print(f"Engine '{engine}' failed for {filename}: {e}")

    if ds is None:
        print(f"CRITICAL: Could not open {filename} with any available engine. Skipping.")
        continue

    # ARGO variable names can be uppercase. Handle both.
    def get_var(ds, names):
        for name in names:
            if name in ds:
                return ds[name].values
        return None

    lat = get_var(ds, ["LATITUDE", "latitude", "lat"])
    lon = get_var(ds, ["LONGITUDE", "longitude", "lon"])
    time = get_var(ds, ["TIME", "time"])
    temp = get_var(ds, ["TEMP", "temperature", "temp"])

    if any(v is None for v in [lat, lon, time, temp]):
        print(f"Skipping {filename}: Missing essential variables.")
        continue

    # Flatten and build records
    # ARGO profiles: Lat/Lon/Time are usually 1D (n_prof)
    # Temperature is usually 2D (n_prof, n_levels)
    for i in range(len(lat)):
        try:
            # Get temperature for this profile (could be a single value or a mean of levels)
            t_val = temp[i]
            if hasattr(t_val, "shape") and len(t_val.shape) > 0:
                # If 2D (levels), take the mean of valid values
                t_val = np.nanmean(t_val)
            
            if np.isnan(t_val):
                continue

            dt = pd.to_datetime(str(time[i])).date()
            records.append({
                "latitude": float(lat[i]),
                "longitude": float(lon[i]),
                "date": dt.isoformat(),
                "temperature": float(t_val),
                "year": int(dt.year)
            })
        except Exception as e:
            print(f"Error processing record {i} in {filename}: {e}")
            continue

# Create DataFrame and write CSV
if records:
    df = pd.DataFrame(records)
    # Year is already in records, but good to ensure
    df.to_csv(csv_path, index=False)
    print(f"CSV written to {csv_path} ({len(df)} rows)")
else:
    print("No records extracted.")
