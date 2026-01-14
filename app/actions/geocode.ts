interface geocodeResult {
    country: string,
    formattedAddress: string;
}

export async function getCountryFromCoords(lat: number, lng: number): Promise<geocodeResult> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat}, ${lng}&key=${apiKey}`
    );

    const data = await response.json()
    const results = data.result[0]
    const countryComponent = results.address_components.find((component: any) => component.types.includes("country"))
    const formattedAddress = results.formatted_address || "unknown"

    return {country: countryComponent.long_name || "unknown", formattedAddress};


}