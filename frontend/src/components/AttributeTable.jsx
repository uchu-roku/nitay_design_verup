import React, { useState, useEffect } from 'react'
import AppIcon from './AppIcon'
import Button from './ui/Button'
import Badge from './ui/Badge'

// MOC版表示マスキング: 許可された林班小班のキーコード（北斗市 林班54-小班8, 林班55-小班76）
const ALLOWED_COMPARTMENT_KEYS = new Set([
  '01050000540008',
  '01050000550076',
])

const isAllowedRow = (row) => row.keycode && ALLOWED_COMPARTMENT_KEYS.has(row.keycode)

const AttributeTable = ({ data, isResizing, onResizeStart, onAnalyzeSelected }) => {
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // データが変更されたら、許可済み林班小班かつ複層区分1の行のみを自動選択
  useEffect(() => {
    if (data && data.length > 0) {
      const selectableIndices = new Set(
        data
          .map((row, index) => {
            if (!isAllowedRow(row)) return null
            if (row.fukusouKubun && parseInt(row.fukusouKubun) >= 2) return null
            return index
          })
          .filter(index => index !== null)
      )
      setSelectedRows(selectableIndices)
    } else {
      setSelectedRows(new Set())
    }
  }, [data])

  const selectableIndices = data
    ? data.map((row, i) => {
        if (!isAllowedRow(row)) return null
        if (row.fukusouKubun && parseInt(row.fukusouKubun) >= 2) return null
        return i
      }).filter(i => i !== null)
    : []
  const allSelected = selectableIndices.length > 0 && selectableIndices.every(i => selectedRows.has(i))

  const handleSelectAll = () => {
    if (allSelected) {
      if (window.highlightedLayersMap && window.mapInstance) {
        selectableIndices.forEach(i => {
          const row = data[i]
          if (row?.keycode) {
            const hl = window.highlightedLayersMap.get(row.keycode)
            if (hl) {
              window.mapInstance.removeLayer(hl)
              window.highlightedLayersMap.delete(row.keycode)
            }
            if (window.restoreForestLayerByKeycode) {
              window.restoreForestLayerByKeycode(row.keycode)
            }
          }
        })
      }
      setSelectedRows(new Set())
    } else {
      if (window.highlightForestByKeycode) {
        selectableIndices.forEach(i => {
          const row = data[i]
          if (row?.keycode) window.highlightForestByKeycode(row.keycode)
        })
      }
      setSelectedRows(new Set(selectableIndices))
    }
  }

  const handleRowSelect = (id) => {
    const row = data[id]
    // 対象外林班小班は選択不可
    if (!row || !isAllowedRow(row)) return
    // 複層区分が2以上（下層）の場合は選択不可
    if (row.fukusouKubun && parseInt(row.fukusouKubun) >= 2) {
      return
    }

    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
      // マップのハイライトを解除し、元レイヤーを復元
      if (row?.keycode && window.highlightedLayersMap && window.mapInstance) {
        const highlightLayer = window.highlightedLayersMap.get(row.keycode)
        if (highlightLayer) {
          window.mapInstance.removeLayer(highlightLayer)
          window.highlightedLayersMap.delete(row.keycode)
        }
        if (window.restoreForestLayerByKeycode) {
          window.restoreForestLayerByKeycode(row.keycode)
        }
      }
    } else {
      newSelected.add(id)
      // マップにハイライトを追加
      if (row?.keycode && window.highlightForestByKeycode) {
        window.highlightForestByKeycode(row.keycode)
      }
    }
    setSelectedRows(newSelected)
  }

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  const sortedData = data && data.length > 0 ? [...data].sort((a, b) => {
    if (!sortConfig.key) return 0
    const aVal = a[sortConfig.key]
    const bVal = b[sortConfig.key]
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  }) : []

  // 選択された行の合計面積を計算（対象林班小班のみ）
  const calculateTotalArea = () => {
    if (selectedRows.size === 0) return 0
    const selectedData = Array.from(selectedRows).map(index => data[index]).filter(Boolean)
    const total = selectedData.reduce((sum, row) => {
      const area = parseFloat(row.area) || 0
      return sum + area
    }, 0)
    return total.toFixed(2)
  }

  const totalArea = calculateTotalArea()

  const handleExportCSV = () => {
    const headers = ['林班', '小班', '市町村', '面積(ha)', '森林種類', '林種', '樹種', '林齢(年)', '複層区分', '推定材積(m³)', '推定本数(本)']
    // CSV出力は対象林班小班のみ
    const rows = data.filter(row => isAllowedRow(row)).map(row => [
      row.rinban || '',
      row.shoban || '',
      row.municipalityName || '',
      row.area || '',
      row.forestType || '',
      row.rinshu || '',
      row.species || '',
      row.age || '',
      row.fukusouKubun || '',
      row.estimatedVolume != null ? row.estimatedVolume : '',
      row.estimatedTrees != null ? row.estimatedTrees : '',
    ])

    const bom = '﻿'
    const csvContent = bom + [headers, ...rows]
      .map(cols => cols.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `属性テーブル_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!data || data.length === 0) {
    return (
      <div className="attribute-table">
        <div className="table-header">
          <div className="resize-handle" onMouseDown={onResizeStart}></div>
          <h3 className="table-title">属性テーブル</h3>
        </div>
        <div className="table-empty-state">
          <AppIcon name="table" size="lg" className="empty-icon" />
          <h4 className="empty-title">データがありません</h4>
          <p className="empty-description">
            森林簿レイヤをオンにして、区域を選択してください
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="attribute-table">
      <div className="table-header">
        <div className="resize-handle" onMouseDown={onResizeStart}></div>
        <h3 className="table-title">属性テーブル</h3>
        <div className="table-actions">
          <Badge variant="neutral">{data.length}件</Badge>
          {selectedRows.size > 0 && (
            <span aria-live="polite">
              <Badge variant="primary">選択: {selectedRows.size}件 / 合計面積: {totalArea}ha</Badge>
            </span>
          )}
          {data.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              icon="check"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                
                // チェックされた行のデータを取得
                const selectedData = Array.from(selectedRows).map(index => data[index]).filter(Boolean)
                
                if (selectedData.length === 0) {
                  alert('小班を選択してください。')
                  return
                }
                
                if (onAnalyzeSelected) {
                  onAnalyzeSelected(selectedData)
                }
              }}
            >
              選択した小班を解析 ({selectedRows.size}件)
            </Button>
          )}
          <Button variant="ghost" size="sm" icon="filter">フィルタ</Button>
          <Button variant="ghost" size="sm" icon="refresh">並替</Button>
          <Button variant="ghost" size="sm" icon="export" onClick={handleExportCSV}>CSV出力</Button>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-sortable col-code" onClick={() => handleSort('rinban')}>
                <div className="th-content">
                  林班
                  {sortConfig.key === 'rinban' && (
                    <AppIcon name={sortConfig.direction === 'asc' ? 'chevronUp' : 'chevronDown'} size="sm" />
                  )}
                </div>
              </th>
              <th className="col-sortable col-code" onClick={() => handleSort('shoban')}>
                <div className="th-content">
                  小班
                  {sortConfig.key === 'shoban' && (
                    <AppIcon name={sortConfig.direction === 'asc' ? 'chevronUp' : 'chevronDown'} size="sm" />
                  )}
                </div>
              </th>
              <th className="col-sortable" onClick={() => handleSort('municipalityName')}>
                <div className="th-content">
                  市町村
                  {sortConfig.key === 'municipalityName' && (
                    <AppIcon name={sortConfig.direction === 'asc' ? 'chevronUp' : 'chevronDown'} size="sm" />
                  )}
                </div>
              </th>
              <th className="col-sortable col-numeric" onClick={() => handleSort('area')}>
                <div className="th-content">
                  面積
                  {sortConfig.key === 'area' && (
                    <AppIcon name={sortConfig.direction === 'asc' ? 'chevronUp' : 'chevronDown'} size="sm" />
                  )}
                </div>
              </th>
              <th className="col-sortable col-numeric" onClick={() => handleSort('estimatedVolume')}>
                <div className="th-content">
                  推定材積
                  {sortConfig.key === 'estimatedVolume' && (
                    <AppIcon name={sortConfig.direction === 'asc' ? 'chevronUp' : 'chevronDown'} size="sm" />
                  )}
                </div>
              </th>
              <th className="col-sortable col-numeric" onClick={() => handleSort('estimatedTrees')}>
                <div className="th-content">
                  推定本数
                  {sortConfig.key === 'estimatedTrees' && (
                    <AppIcon name={sortConfig.direction === 'asc' ? 'chevronUp' : 'chevronDown'} size="sm" />
                  )}
                </div>
              </th>
              <th className="col-sortable" onClick={() => handleSort('forestType')}>
                <div className="th-content">
                  森林種類
                  {sortConfig.key === 'forestType' && (
                    <AppIcon name={sortConfig.direction === 'asc' ? 'chevronUp' : 'chevronDown'} size="sm" />
                  )}
                </div>
              </th>
              <th className="col-sortable" onClick={() => handleSort('rinshu')}>
                <div className="th-content">
                  林種
                  {sortConfig.key === 'rinshu' && (
                    <AppIcon name={sortConfig.direction === 'asc' ? 'chevronUp' : 'chevronDown'} size="sm" />
                  )}
                </div>
              </th>
              <th className="col-sortable" onClick={() => handleSort('species')}>
                <div className="th-content">
                  樹種
                  {sortConfig.key === 'species' && (
                    <AppIcon name={sortConfig.direction === 'asc' ? 'chevronUp' : 'chevronDown'} size="sm" />
                  )}
                </div>
              </th>
              <th className="col-sortable col-numeric" onClick={() => handleSort('age')}>
                <div className="th-content">
                  林齢
                  {sortConfig.key === 'age' && (
                    <AppIcon name={sortConfig.direction === 'asc' ? 'chevronUp' : 'chevronDown'} size="sm" />
                  )}
                </div>
              </th>
              <th className="col-sortable" onClick={() => handleSort('fukusouKubun')}>
                <div className="th-content">
                  複層区分
                  {sortConfig.key === 'fukusouKubun' && (
                    <AppIcon name={sortConfig.direction === 'asc' ? 'chevronUp' : 'chevronDown'} size="sm" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => {
              const allowed = isAllowedRow(row)
              const isLower = row.fukusouKubun && parseInt(row.fukusouKubun) >= 2
              const rowStyle = allowed
                ? (selectedRows.has(index) ? { backgroundColor: '#DCFCE7', outline: '1px solid #16A34A' } : {})
                : { backgroundColor: '#F8FAFC', cursor: 'default' }

              return (
              <tr
                key={row.keycode ? `${row.keycode}-${index}` : index}
                style={rowStyle}
                className={allowed && selectedRows.has(index) ? 'selected' : ''}
                tabIndex={allowed ? 0 : -1}
                onClick={() => allowed && handleRowSelect(index)}
                onKeyDown={(e) => {
                  if (!allowed) return
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleRowSelect(index)
                  }
                }}
              >
                <td className="col-checkbox">
                  {!allowed ? (
                    <input type="checkbox" disabled style={{ opacity: 0, cursor: 'default', pointerEvents: 'none' }} />
                  ) : isLower ? (
                    <input
                      type="checkbox"
                      disabled
                      style={{ opacity: 0.3, cursor: 'not-allowed' }}
                      title="下層は選択できません（上層で選択してください）"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={selectedRows.has(index)}
                      onChange={() => handleRowSelect(index)}
                    />
                  )}
                </td>
                {allowed ? (
                  <>
                    <td className="col-code">{row.rinban || '-'}</td>
                    <td className="col-code">{row.shoban || '-'}</td>
                    <td>{row.municipalityName || '-'}</td>
                    <td className="col-numeric">{row.area ? `${row.area}ha` : '-'}</td>
                    <td className="col-numeric col-estimated">
                      {row.estimatedVolume != null ? `${row.estimatedVolume.toLocaleString()} m³` : '—'}
                    </td>
                    <td className="col-numeric col-estimated">
                      {row.estimatedTrees != null ? `${row.estimatedTrees.toLocaleString()} 本` : '—'}
                    </td>
                    <td>{row.forestType || '-'}</td>
                    <td>{row.rinshu || '-'}</td>
                    <td>{row.species || '-'}</td>
                    <td className="col-numeric">{row.age ? `${row.age}年` : '-'}</td>
                    <td>{row.fukusouKubun || '-'}</td>
                  </>
                ) : (
                  // 対象外行: 全セルを空欄・薄いグレーテキスト
                  Array.from({ length: 11 }).map((_, i) => (
                    <td key={i} style={{ color: '#CBD5E1' }}></td>
                  ))
                )}
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AttributeTable
