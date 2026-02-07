/**
 * 凡例定義レジストリ
 * 
 * アプリ全体で使用する凡例の定義を一元管理
 */

// 針葉樹の凡例（グラデーション）
export const coniferRamp = {
  id: 'conifer-ramp',
  type: 'ramp',
  title: '針葉樹',
  description: '材積密度',
  miniDescription: '濃い緑 = 針葉樹が多い',
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
  title: '広葉樹',
  description: '材積密度',
  miniDescription: '濃い茶 = 広葉樹が多い',
  stops: [
    { value: 0.2, color: 'rgba(141, 110, 99, 0.2)', label: '少ない' },
    { value: 0.35, color: 'rgba(141, 110, 99, 0.35)', label: '' },
    { value: 0.5, color: 'rgba(141, 110, 99, 0.5)', label: '' },
    { value: 0.65, color: 'rgba(141, 110, 99, 0.65)', label: '' },
    { value: 0.8, color: 'rgba(141, 110, 99, 0.8)', label: '' },
    { value: 0.95, color: 'rgba(141, 110, 99, 0.95)', label: '多い' }
  ]
}

// 等高線の凡例（カテゴリ）
export const contourLegend = {
  id: 'contour-legend',
  type: 'categorical',
  title: '等高線',
  description: '等高線の見方',
  miniDescription: '線の種類で標高間隔を表示',
  categories: [
    { label: '計曲線 (50m間隔)', color: '#333333', lineType: 'solid', lineWidth: 2 },
    { label: '主曲線 (10m間隔)', color: '#666666', lineType: 'solid', lineWidth: 1 },
    { label: '補助線 (2m間隔)', color: '#999999', lineType: 'dashed', lineWidth: 1 }
  ]
}

// 傾斜図の凡例（カテゴリ）
export const slopeLegend = {
  id: 'slope-legend',
  type: 'categorical',
  title: '傾斜図',
  description: '傾斜区分',
  miniDescription: '色で傾斜角度を表示',
  categories: [
    { label: '0-10° (平坦)', color: '#d4f1d4' },
    { label: '10-20° (緩斜面)', color: '#a8d5a8' },
    { label: '20-30° (斜面)', color: '#7cb97c' },
    { label: '30°+ (急斜面)', color: '#509d50' }
  ]
}

// 樹木メッシュ用の凡例セット
export function getTreeMeshLegends() {
  return [coniferRamp, broadleafRamp]
}
