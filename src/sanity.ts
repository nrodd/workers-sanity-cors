const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_TOKEN = process.env.SANITY_TOKEN;

if (!SANITY_PROJECT_ID) {
    throw new Error("Missing required environment variable: SANITY_PROJECT_ID");
}
if (!SANITY_TOKEN) {
    throw new Error("Missing required environment variable: SANITY_TOKEN");
}
export async function addCors(origin: string) {
    await fetch(`https://api.sanity.io/v2021-06-07/projects/${SANITY_PROJECT_ID}/cors`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${SANITY_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ origin, allowCredentials: true }),
    });
}

export async function removeCors(origin: string) {
    // Get list of existing CORS origins
    const res = await fetch(
        `https://api.sanity.io/v2021-06-07/projects/${SANITY_PROJECT_ID}/cors`,
        {
            headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
        }
    );
    const origins = await res.json() as Array<{ id: string; origin: string }>;
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
