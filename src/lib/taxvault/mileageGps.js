const EARTH_RADIUS_KM = 6371

export function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function createGpsTracker(onUpdate, onError) {
  let watchId = null
  let last = null
  let totalKm = 0

  const start = () => {
    if (!navigator.geolocation) {
      onError?.('GPS not available')
      return
    }
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        if (last) {
          totalKm += haversineKm(last.lat, last.lng, latitude, longitude)
        }
        last = { lat: latitude, lng: longitude }
        onUpdate?.({ totalKm, last })
      },
      (err) => onError?.(err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    )
  }

  const stop = () => {
    if (watchId != null) navigator.geolocation.clearWatch(watchId)
    watchId = null
    const result = { totalKm, last }
    last = null
    totalKm = 0
    return result
  }

  return { start, stop, getTotal: () => totalKm }
}
