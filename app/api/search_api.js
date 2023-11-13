import { getJson } from "serpapi"

export async function mapSearch(query, latitude, longtitude) {
  try {
    const params = {
      engine: "google_maps",
      api_key: process.env.SERPAPI_API_KEY,
      q: query,
    }
    if (latitude && longtitude) {
      params["ll"] = `@${latitude},${longtitude},15z`
    }
    const data = await getJson(params)

    return data["local_results"]?.splice(0, 10) || []
  } catch (e) {
    return []
  }
}

export async function searchById(id) {
  try {
    const data = await getJson({
      engine: "google_maps",
      api_key: process.env.SERPAPI_API_KEY,
      type: "place",
      place_id: id,
    })

    return data["place_results"]
  } catch {
    return null
  }
}