"""
KEYCODEの構造を確認
"""
import geopandas as gpd
from pathlib import Path

shp_path = Path(__file__).parent / "data" / "administrative" / "rinsyousigen" / "01_渡島_小班.shp"
gdf = gpd.read_file(shp_path)

print("=== KEYCODEの構造確認 ===\n")

# サンプルを表示
print("サンプル（最初の5件）:")
for i in range(5):
    keycode = gdf.iloc[i]['KEYCODE']
    muni_code = gdf.iloc[i]['市町村コー']
    print(f"KEYCODE: {keycode}, 市町村コー: {muni_code}")
    print(f"  1-2桁目（振興局）: {keycode[0:2]}")
    print(f"  3-4桁目（市町村）: {keycode[2:4]}")
    print(f"  5-8桁目（林班）: {keycode[4:8]}")
    print(f"  9-12桁目（小班）: {keycode[8:12]}")
    print(f"  13-14桁目（枝番）: {keycode[12:14]}")
    print()

# 各市町村のKEYCODEを確認
print("\n=== 市町村別KEYCODE ===\n")
for muni_code in sorted(gdf['市町村コー'].unique()):
    if muni_code:
        sample = gdf[gdf['市町村コー'] == muni_code].iloc[0]
        keycode = sample['KEYCODE']
        print(f"市町村コー {muni_code}: KEYCODE={keycode} (振興局={keycode[0:2]}, 市町村={keycode[2:4]})")
