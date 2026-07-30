async function summaryFor(title) {
  const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
  if (!res.ok) throw new Error('not found')
  return res.json()
}

export async function fetchPlaceMedia(name) {
  try {
    return await summaryFor(name)
  } catch {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&format=json&srsearch=${encodeURIComponent(name)}`
    )
    const json = await res.json()
    const first = json?.query?.search?.[0]
    if (!first) throw new Error('No info found for this place')
    return summaryFor(first.title)
  }
}
