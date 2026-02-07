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

// 等高線の凡例（カテゴリ）- OpenTopoMap仕様
export const contourLegend = {
  id: 'contour-legend',
  type: 'categorical',
  title: '等高線',
  description: '等高線の見方（OpenTopoMap）',
  miniDescription: '線の種類で標高間隔を表示',
  categories: [
    { label: '計曲線 (50m間隔)', color: '#8B4513', lineType: 'solid', lineWidth: 2 },
    { label: '主曲線 (10m間隔)', color: '#D2691E', lineType: 'solid', lineWidth: 1 }
  ]
}

// 傾斜図の凡例（カテゴリ）- 国土地理院標準
export const slopeLegend = {
  id: 'slope-legend',
  type: 'categorical',
  title: '傾斜図',
  description: '傾斜区分（国土地理院標準）',
  miniDescription: '色で傾斜角度を表示',
  categories: [
    { label: '0-3° (平坦地)', color: '#ffffff' },
    { label: '3-5° (緩傾斜地I)', color: '#e8e8e8' },
    { label: '5-10° (緩傾斜地II)', color: '#d0d0d0' },
    { label: '10-15° (急傾斜地I)', color: '#b0b0b0' },
    { label: '15-20° (急傾斜地II)', color: '#909090' },
    { label: '20-30° (急傾斜地III)', color: '#707070' },
    { label: '30-40° (急峻地I)', color: '#505050' },
    { label: '40°以上 (急峻地II)', color: '#303030' }
  ]
}

// 樹木メッシュ用の凡例セット
export function getTreeMeshLegends() {
  return [coniferRamp, broadleafRamp]
}
