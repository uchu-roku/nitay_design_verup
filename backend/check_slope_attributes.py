"""
傾斜区分図のShapefileの属性を確認するスクリプト
"""
import zipfile
import struct
from pathlib import Path

def read_dbf_header(dbf_path):
    """DBFファイルのヘッダーとサンプルレコードを読み込む"""
    with open(dbf_path, 'rb') as f:
        # ヘッダー読み込み
        header = f.read(32)
        num_records = struct.unpack('<I', header[4:8])[0]
        header_length = struct.unpack('<H', header[8:10])[0]
        record_length = struct.unpack('<H', header[10:12])[0]
        
        print(f"レコード数: {num_records}")
        print(f"ヘッダー長: {header_length}")
        print(f"レコード長: {record_length}")
        print()
        
        # フィールド定義読み込み
        fields = []
        f.seek(32)
        while f.tell() < header_length - 1:
            field_def = f.read(32)
            if len(field_def) < 32 or field_def[0] == 0x0D:
                break
            
            field_name = field_def[0:11].decode('ascii', errors='ignore').rstrip('\x00').strip()
            field_type = chr(field_def[11])
            field_length = field_def[16]
            field_decimal = field_def[17]
            
            fields.append((field_name, field_type, field_length, field_decimal))
        
        print("フィールド定義:")
        for field_name, field_type, field_length, field_decimal in fields:
            print(f"  {field_name}: タイプ={field_type}, 長さ={field_length}, 小数点={field_decimal}")
        print()
        
        # サンプルレコードを読み込み（最初の10件）
        f.seek(header_length)
        sample_records = []
        for i in range(min(10, num_records)):
            record_data = f.read(record_length)
            if len(record_data) < record_length or record_data[0] == 0x2A:
                continue
            
            record = {}
            offset = 1
            for field_name, field_type, field_length, field_decimal in fields:
                value_bytes = record_data[offset:offset+field_length]
                try:
                    value_str = value_bytes.decode('shift_jis', errors='ignore').strip()
                    if field_type == 'N' or field_type == 'F':
                        if value_str:
                            try:
                                value = float(value_str) if field_decimal > 0 or '.' in value_str else int(value_str)
                            except:
                                value = value_str
                        else:
                            value = None
                    else:
                        value = value_str
                except:
                    value = None
                
                record[field_name] = value
                offset += field_length
            
            sample_records.append(record)
        
        return fields, sample_records

def main():
    base_dir = Path(__file__).parent
    zip_path = base_dir / "data" / "administrative" / "keisya" / "G04-d-11_6240-jgd_GML.zip"
    
    if not zip_path.exists():
        print(f"ZIPファイルが見つかりません: {zip_path}")
        return
    
    print(f"ZIPファイルを解凍: {zip_path.name}")
    print()
    
    # 一時ディレクトリに解凍
    temp_dir = base_dir / "data" / "administrative" / "keisya" / "temp"
    temp_dir.mkdir(exist_ok=True)
    
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(temp_dir)
    
    # Shapefileを探す
    shp_files = list(temp_dir.glob("**/*.shp"))
    print(f"Shapefileが見つかりました: {len(shp_files)}件")
    print()
    
    for shp_file in shp_files:
        dbf_file = shp_file.with_suffix('.dbf')
        
        if not dbf_file.exists():
            print(f"DBFファイルが見つかりません: {shp_file.name}")
            continue
        
        print(f"=== {shp_file.name} ===")
        fields, sample_records = read_dbf_header(dbf_file)
        
        print("サンプルレコード（最初の10件）:")
        for i, record in enumerate(sample_records, 1):
            print(f"  レコード {i}:")
            for key, value in record.items():
                print(f"    {key}: {value}")
            print()
    
    # 一時ファイルを削除
    import shutil
    shutil.rmtree(temp_dir)
    print("一時ファイルを削除しました")

if __name__ == "__main__":
    main()
