"""
Prepare data files for frontend deployment (without backend)
- Split large shouhan_simple.geojson into chunks
- Copy split files to frontend/public directory
"""
import json
import os
import math
import shutil
from pathlib import Path

def split_shouhan_geojson():
    """Split shouhan_simple.geojson into chunks of ~40MB each"""
    input_file = Path('data/administrative/rinsyousigen/shouhan_simple.geojson')
    output_dir = Path('../frontend/public/data/administrative/kitamirinsyou/split')
    
    print(f"[1/3] Loading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    total_features = len(data['features'])
    print(f"  Total features: {total_features}")
    
    # Calculate chunk size (aim for ~40MB per file to stay under 50MB)
    # 127MB / 103694 features ≈ 1.2KB per feature
    # 40MB / 1.2KB ≈ 33000 features per chunk
    features_per_chunk = 33000
    num_chunks = math.ceil(total_features / features_per_chunk)
    
    print(f"  Splitting into {num_chunks} chunks of ~{features_per_chunk} features each")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Split into chunks
    chunk_info = []
    for i in range(num_chunks):
        start_idx = i * features_per_chunk
        end_idx = min((i + 1) * features_per_chunk, total_features)
        chunk_features = data['features'][start_idx:end_idx]
        
        output_file = output_dir / f'forest_part_{i+1}.geojson'
        geojson = {
            'type': 'FeatureCollection',
            'features': chunk_features
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(geojson, f, ensure_ascii=False)
        
        file_size = output_file.stat().st_size / (1024 * 1024)
        print(f"    Part {i+1}: {len(chunk_features)} features, {file_size:.2f} MB")
        
        chunk_info.append({
            'part': i + 1,
            'file': f'forest_part_{i+1}.geojson',
            'features': len(chunk_features),
            'size_mb': round(file_size, 2)
        })
    
    # Also save features with unknown municipality
    unknown_features = [f for f in data['features'] if not f['properties'].get('市町村コー')]
    if unknown_features:
        output_file = output_dir / 'forest_unknown.geojson'
        geojson = {
            'type': 'FeatureCollection',
            'features': unknown_features
        }
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(geojson, f, ensure_ascii=False)
        print(f"    Unknown: {len(unknown_features)} features")
    
    # Create index file
    index = {
        'total_features': total_features,
        'num_parts': num_chunks,
        'parts': chunk_info
    }
    index_file = output_dir / 'index.json'
    with open(index_file, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    
    print(f"  ✓ Split complete!")

def copy_layers_files():
    """Copy split layer files to frontend"""
    source_dir = Path('data/administrative/rinsyousigen/split')
    dest_dir = Path('../frontend/public/data/administrative/kitamirinsyou/split')
    
    print(f"\n[2/3] Copying layer files...")
    os.makedirs(dest_dir, exist_ok=True)
    
    # Copy all layers_*.json files
    copied = 0
    for file in source_dir.glob('layers_*.json'):
        dest_file = dest_dir / file.name
        shutil.copy2(file, dest_file)
        file_size = dest_file.stat().st_size / (1024 * 1024)
        print(f"  ✓ {file.name}: {file_size:.2f} MB")
        copied += 1
    
    print(f"  ✓ Copied {copied} layer files")

def copy_municipality_codes():
    """Copy municipality codes to frontend"""
    source_file = Path('data/administrative/rinsyousigen/municipality_codes.json')
    dest_file = Path('../frontend/public/data/administrative/kitamirinsyou/municipality_codes.json')
    
    print(f"\n[3/3] Copying municipality codes...")
    
    if source_file.exists():
        shutil.copy2(source_file, dest_file)
        print(f"  ✓ Copied municipality_codes.json")
    else:
        print(f"  ! municipality_codes.json not found, skipping")

if __name__ == '__main__':
    split_shouhan_geojson()
    copy_layers_files()
    copy_municipality_codes()
    print("\n✅ All data prepared for frontend deployment!")
