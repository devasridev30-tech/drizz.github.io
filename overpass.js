export async function fetchNearby(lat, lon) {
  const query = `
    [out:json][timeout:25];
    (
      node["tourism"~"attraction|museum|viewpoint|gallery|zoo|theme_park|artwork"](around:9000,${lat},${lon});
      node["shop"~"mall|department_store|boutique|supermarket|gift|jewelry"](around:5000,${lat},${lon});
    );
    out center 50;
  `
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  })
  if (!res.ok) throw new Error('Nearby places unavailable right now')
  const json = await res.json()
  const elements = (json.elements || []).filter((e) => e.tags?.name)
  const attractions = elements.filter((e) => e.tags.tourism).slice(0, 8)
  const shops = elements.filter((e) => e.tags.shop).slice(0, 8)
  return { attractions, shops }
}

export function prettyTag(tag) {
  return tag.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function mapLink(lat, lon, name) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}(${encodeURIComponent(name)})`
}
