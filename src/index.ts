import { Hono } from "hono";
import { verifyGitHubWebhook } from "./github";
import { addCors, removeCors } from "./sanity";

const app = new Hono();

app.get("/", (c) => c.text("Sanity CORS Sync Worker is running"));

app.post("/webhook", async (c) => {
	const body = await c.req.json();
	const signature = c.req.header("x-hub-signature-256") || "";

	if (!verifyGitHubWebhook(JSON.stringify(body), signature)) {
		return c.text("Invalid signature", 401);
	}

	const event = c.req.header("x-github-event");

	if (event === "deployment_status") {
		const { deployment_status } = body;
		if (
			deployment_status.state === "success" &&
			deployment_status.target_url.includes("workers.dev")
		) {
			const url = deployment_status.target_url;
			await addCors(url);
		}
	}

	if (event === "pull_request") {
		const { action, pull_request } = body;
		if (action === "closed") {
			const prUrl = `https://pr-${pull_request.number}.${process.env.WORKERS_DOMAIN || "your-domain.workers.dev"}`;
			await removeCors(prUrl);
		}
	}

	return c.text("ok");
});

export default app;
