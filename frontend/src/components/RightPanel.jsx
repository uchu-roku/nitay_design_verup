import React, { useState } from 'react'
import AppIcon from './AppIcon'
import Skeleton from './ui/Skeleton'
import Tooltip from './ui/Tooltip'
import { coniferRamp, broadleafRamp } from '../legendRegistry'

const RightPanel = ({ 
  isOpen, 
  onClose, 
  analysisResult,
  analysisStatus,
  tableHeight = 300
}) => {
  const [legendExpanded, setLegendExpanded] = useState(false)
  
  if (!isOpen) return null

  return (
    <aside className="right-panel" style={{ bottom: `${tableHeight}px` }}>
      <div className="right-panel-header">
        <div className="panel-title-wrapper">
          <AppIcon name="chart" size="base" />
          <h3 className="panel-title">解析結果</h3>
        </div>
        <button className="panel-close-btn" onClick={onClose} title="閉じる">
          <AppIcon name="close" size="sm" />
        </button>
      </div>

      <div className="right-panel-content">
        {analysisStatus === 'analyzing' && (
          <div className="analysis-loading" aria-live="polite">
            <Skeleton width="100%" height="20px" />
            <Skeleton width="100%" height="20px" />
            <Skeleton width="80%" height="20px" />
            <p className="loading-text">解析中...しばらくお待ちください</p>
          </div>
        )}

        {analysisStatus === 'error' && (
          <div className="analysis-error" role="alert">
            <AppIcon name="error" size="lg" />
            <h4>解析エラー</h4>
            <p>解析処理中にエラーが発生しました。再度お試しください。</p>
          </div>
        )}

        {analysisStatus === 'completed' && analysisResult && (
          <div className="analysis-result">
            <div className="result-section">
              <div className="result-metrics">
                <div className="metric-item">
                  <span className="metric-label">検出本数</span>
                  <span className="metric-value">{analysisResult.tree_count || 0}本</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">
                    針葉樹
                    <Tooltip content={coniferRamp.miniDescription} position="right">
                      <AppIcon name="info" size="sm" style={{ marginLeft: '4px', color: 'var(--text-secondary)', cursor: 'help' }} />
                    </Tooltip>
                  </span>
                  <span className="metric-value">{analysisResult.coniferous_count || 0}本</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">
                    広葉樹
                    <Tooltip content={broadleafRamp.miniDescription} position="right">
                      <AppIcon name="info" size="sm" style={{ marginLeft: '4px', color: 'var(--text-secondary)', cursor: 'help' }} />
                    </Tooltip>
                  </span>
                  <span className="metric-value">{analysisResult.broadleaf_count || 0}本</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">総材積</span>
                  <span className="metric-value">{analysisResult.volume_m3 || 0}m³</span>
                </div>
              </div>
            </div>

            {/* 折りたたみ可能な凡例セクション */}
            <div className="result-section legend-section">
              <button 
                className="legend-toggle-btn"
                onClick={() => setLegendExpanded(!legendExpanded)}
              >
                <AppIcon name={legendExpanded ? 'chevronDown' : 'chevronRight'} size="sm" />
                <span>凡例の詳細を見る</span>
              </button>
              
              {legendExpanded && (
                <div className="legend-detail">
                  {/* 針葉樹凡例 */}
                  <div className="legend-item-container">
                    <div className="legend-item-title">{coniferRamp.title}</div>
                    <div className="legend-item-description">{coniferRamp.description}</div>
                    <div className="legend-ramp">
                      <div className="legend-ramp-bar">
                        {coniferRamp.stops.map((stop, idx) => (
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
                          {coniferRamp.stops[0]?.label || ''}
                        </span>
                        <span className="legend-ramp-label-end">
                          {coniferRamp.stops[coniferRamp.stops.length - 1]?.label || ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 広葉樹凡例 */}
                  <div className="legend-item-container">
                    <div className="legend-item-title">{broadleafRamp.title}</div>
                    <div className="legend-item-description">{broadleafRamp.description}</div>
                    <div className="legend-ramp">
                      <div className="legend-ramp-bar">
                        {broadleafRamp.stops.map((stop, idx) => (
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
                          {broadleafRamp.stops[0]?.label || ''}
                        </span>
                        <span className="legend-ramp-label-end">
                          {broadleafRamp.stops[broadleafRamp.stops.length - 1]?.label || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {analysisResult.warnings && analysisResult.warnings.length > 0 && (
              <div className="result-warnings">
                <div className="warnings-header">
                  <AppIcon name="alert" size="base" />
                  <h4 className="warnings-title">注意事項</h4>
                </div>
                <ul className="warnings-list">
                  {analysisResult.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {analysisStatus === 'idle' && (
          <div className="panel-empty">
            <AppIcon name="chart" size="lg" />
            <p>
              <strong>1.</strong> 属性テーブルで小班を選択<br/>
              <strong>2.</strong> 「選択した小班を解析」をクリック
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}

export default RightPanel
