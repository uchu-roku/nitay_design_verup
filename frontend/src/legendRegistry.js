/**
 * 凡例定義レジストリ
 * 
 * アプリ全体で使用する凡例の定義を一元管理
 */

// 針葉樹の凡例（グラデーション）
export const coniferRamp = {
  id: 'conifer-ramp',
  type: 'ramp',
  title: '🌲 針葉樹',
  description: '材積密度',
  stops: [
    { value: 0.2, color: 'rgba(46, 125, 50, 0.2)', label: '少ない' },
    { value: 0.35, color: 'rgba(46, 125, 50, 0.35)', label: '' },
    { value: 0.5, color: 'rgba(46, 125, 50, 0.5)', label: '' },
    { value: 0.65, color: 'rgba(46, 125, 50, 0.65)', label: '' },
    { value: 0.8, color: 'rgba(46, 125, 50, 0.8)', label: '' },
    { value: 0.95, color: 'rgba(46, 125, 50, 0.95)', label: '多い' }
  ]
}

// 広葉樹の凡例（グラデーション）
export const broadleafRamp = {
  id: 'broadleaf-ramp',
  type: 'ramp',
  title: '🌳 広葉樹',
  description: '材積密度',
  stops: [
    { value: 0.2, color: 'rgba(141, 110, 99, 0.2)', label: '少ない' },
    { value: 0.35, color: 'rgba(141, 110, 99, 0.35)', label: '' },
    { value: 0.5, color: 'rgba(141, 110, 99, 0.5)', label: '' },
    { value: 0.65, color: 'rgba(141, 110, 99, 0.65)', label: '' },
    { value: 0.8, color: 'rgba(141, 110, 99, 0.8)', label: '' },
    { value: 0.95, color: 'rgba(141, 110, 99, 0.95)', label: '多い' }
  ]
}

// 樹木メッシュ用の凡例セット
export function getTreeMeshLegends() {
  return [coniferRamp, broadleafRamp]
}
