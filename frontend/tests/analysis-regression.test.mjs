import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

// Execute the existing calculation blocks without mounting Leaflet or waiting
// for the UI timer. This tests the production calculations, not copies of them.
const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const mapSource = readFileSync(new URL('../src/Map.jsx', import.meta.url), 'utf8')
const silentConsole = { log() {} }

function calculateGrid(bounds) {
  const handler = appSource.slice(appSource.indexOf('const handleMapAnalyze ='))
  const start = handler.indexOf('const mockTreePoints = []')
  const end = handler.indexOf('setAnalysisResult(mockResult)', start)
  return vm.runInNewContext(`${handler.slice(start, end)}; mockResult`, {
    ...bounds, polygonCoords: null, console: silentConsole,
  }, { timeout: 5000 })
}

test('a wide drawn area completes with a bounded number of mesh cells', () => {
  const result = calculateGrid({ minLat: 42, maxLat: 42.1, minLon: 140, maxLon: 140.15 })
  assert.ok(result.tree_points.length > 0)
  assert.ok(result.tree_points.length <= 5000, `generated ${result.tree_points.length} cells`)
  assert.ok(result.mesh_size_m > 50)
  assert.ok(result.warnings.some(warning => warning.includes('メッシュ')))
})

test('a small area retains the 50m grid and its original cell count', () => {
  const result = calculateGrid({ minLat: 42, maxLat: 42.001, minLon: 140, maxLon: 140.001 })
  assert.equal(result.tree_points.length, 4)
  assert.equal(result.mesh_size_m, 50)
})

test('mesh extent calculation handles 300000 points without argument overflow', () => {
  const start = mapSource.indexOf('const volumes = treePoints.map')
  const end = mapSource.indexOf('// メッシュの表示サイズ', start)
  const points = Array.from({ length: 300000 }, (_, i) => ({
    volume: i % 4, lat: i === 0 ? 41 : 42, lon: i === 299999 ? 141 : 140,
  }))
  const result = vm.runInNewContext(
    `${mapSource.slice(start, end)}; ({minVolume, maxVolume, minLat, maxLat, minLon, maxLon})`,
    { treePoints: points, console: silentConsole }, { timeout: 5000 },
  )
  assert.deepEqual({ ...result }, {
    minVolume: 0, maxVolume: 3, minLat: 41, maxLat: 42, minLon: 140, maxLon: 141,
  })
})
