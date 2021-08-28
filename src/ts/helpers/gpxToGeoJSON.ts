/**
 * Fetches a gpx and transforms it to GeoJSON.
 */
export const gpxToGeoJSON = async (url: string) => {
  const response = await fetch(url)
  const xml = await response.text()
  const parser = new DOMParser()
  const gpxData = parser.parseFromString(xml, 'application/xml')
  const trackingPoints = gpxData.querySelectorAll('trkpt')
  const name = gpxData.querySelector('trk name')?.innerHTML ?? ''

  const transformedPoints = [...trackingPoints].map(trackingPoint => [
    parseFloat(trackingPoint.getAttribute('lon')),
    parseFloat(trackingPoint.getAttribute('lat')),
    parseFloat(trackingPoint.querySelector('ele').innerHTML),
    Date.parse(trackingPoint.querySelector('time').innerHTML),
  ])

  const firstPointEpoch = transformedPoints[0][3]
  const lastPointEpoch = transformedPoints[transformedPoints.length - 1][3]

  return {
    "type": "Feature",
    "properties": {
      "name": name,
      "startTime": new Date(firstPointEpoch),
      "endTime": new Date(lastPointEpoch),
      "duration": (lastPointEpoch - firstPointEpoch) / 1000
    },
    "geometry": {
      "type": "MultiLineString",
      "properties": {},
      "coordinates": [transformedPoints]
    }
  }
}