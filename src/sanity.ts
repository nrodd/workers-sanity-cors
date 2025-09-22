const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_TOKEN = process.env.SANITY_TOKEN;

if (!SANITY_PROJECT_ID) {
    throw new Error("Missing required environment variable: SANITY_PROJECT_ID");
}
if (!SANITY_TOKEN) {
    throw new Error("Missing required environment variable: SANITY_TOKEN");
}
export async function addCors(origin: string) {
    try {
        const response = await fetch(`https://api.sanity.io/v2021-06-07/projects/${SANITY_PROJECT_ID}/cors`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${SANITY_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ origin, allowCredentials: true }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to add CORS origin: ${response.status} ${response.statusText} - ${errorText}`);
        }
    } catch (error) {
        // Optionally, you can log the error or rethrow it
        // console.error(error);
        throw error;
    }
}

export async function removeCors(origin: string) {
    // Get list of existing CORS origins
    let origins: Array<{ id: string; origin: string }> = [];
    try {
        const res = await fetch(
            `https://api.sanity.io/v2021-06-07/projects/${SANITY_PROJECT_ID}/cors`,
            {
                headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
            }
        );
        if (!res.ok) {
            throw new Error(`Failed to fetch CORS origins: ${res.status} ${res.statusText}`);
        }
        origins = await res.json() as Array<{ id: string; origin: string }>;
    } catch (error) {
        console.error("Error fetching or parsing CORS origins:", error);
        return;
    }
    const match = origins.find((o) => o.origin === origin);

    if (match) {
        await fetch(
            `https://api.sanity.io/v2021-06-07/projects/${SANITY_PROJECT_ID}/cors/${match.id}`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
            }
        );
    }
}
