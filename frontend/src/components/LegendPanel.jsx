import React from 'react'
import './LegendPanel.css'

/**
 * LegendPanel Component
 * 
 * 凡例を表示するパネル
 * 
 * @param {Array} items - 凡例アイテムの配列
 *   - type: 'ramp' | 'categorical'
 *   - title: タイトル
 *   - description: 説明（オプション）
 *   - stops: グラデーション用の配列 [{ value, color, label }]
 *   - categories: カテゴリ用の配列 [{ label, color }]
 */
export default function LegendPanel({ items = [] }) {
  // アイテムが空なら何も表示しない
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="legend-panel">
      <h4 className="legend-panel-title">凡例</h4>
      
      {items.map((item, index) => (
        <div key={item.id || index} className="legend-item-container">
          {/* タイトル */}
          <div className="legend-item-title">{item.title}</div>
          
          {/* 説明 */}
          {item.description && (
            <div className="legend-item-description">{item.description}</div>
          )}
          
          {/* グラデーション凡例 */}
          {item.type === 'ramp' && item.stops && (
            <div className="legend-ramp">
              <div className="legend-ramp-bar">
                {item.stops.map((stop, idx) => (
                  <div
                    key={idx}
                    className="legend-ramp-stop"
                    style={{ 
                      backgroundColor: stop.color,
                      flex: 1
                    }}
                  />
                ))}
              </div>
              <div className="legend-ramp-labels">
                <span className="legend-ramp-label-start">
                  {item.stops[0]?.label || ''}
                </span>
                <span className="legend-ramp-label-end">
                  {item.stops[item.stops.length - 1]?.label || ''}
                </span>
              </div>
            </div>
          )}
          
          {/* カテゴリ凡例 */}
          {item.type === 'categorical' && item.categories && (
            <div className="legend-categorical">
              {item.categories.map((cat, idx) => (
                <div key={idx} className="legend-categorical-item">
                  <span 
                    className="legend-categorical-color" 
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="legend-categorical-label">{cat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
