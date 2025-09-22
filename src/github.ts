import crypto from "crypto";

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "";

export function verifyGitHubWebhook(payload: string, signature: string) {
    const hmac = crypto.createHmac("sha256", GITHUB_WEBHOOK_SECRET);
    hmac.update(payload, "utf-8");
    const digest = `sha256=${hmac.digest("hex")}`;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
