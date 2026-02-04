"""
Split layers_index.json by municipality code (first 5 digits of KEYCODE)
"""
import json
import os
from pathlib import Path

def split_layers_by_municipality():
    """Split layers_index.json by municipality code"""
    input_file = Path('data/administrative/rinsyousigen/layers_index.json')
    output_dir = Path('data/administrative/rinsyousigen/split')
    
    print(f"Loading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Total entries: {len(data)}")
    
    # Group by municipality code (digits 1-4 of KEYCODE: 振興局2桁+市町村2桁)
    by_municipality = {}
    for keycode, layers in data.items():
        # KEYCODEの1-4桁目を取得（振興局2桁+市町村2桁）
        muni_code = keycode[:4] if len(keycode) >= 4 else 'unknown'
        if muni_code not in by_municipality:
            by_municipality[muni_code] = {}
        by_municipality[muni_code][keycode] = layers
    
    print(f"Found {len(by_municipality)} municipalities")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Save each municipality separately
    municipality_list = []
    for muni_code, entries in by_municipality.items():
        output_file = output_dir / f'layers_{muni_code}.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(entries, f, ensure_ascii=False)
        
        file_size = output_file.stat().st_size / (1024 * 1024)
        print(f"  {muni_code}: {len(entries)} entries, {file_size:.2f} MB")
        
        municipality_list.append(muni_code)
    
    # Create index file
    index = {
        'municipalities': sorted(municipality_list),
        'file_pattern': 'layers_{municipality_code}.json'
    }
    index_file = output_dir / 'index.json'
    with open(index_file, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    
    print(f"\nSplit complete! Files saved to {output_dir}")
    print(f"Index file: {index_file}")

if __name__ == '__main__':
    split_layers_by_municipality()
