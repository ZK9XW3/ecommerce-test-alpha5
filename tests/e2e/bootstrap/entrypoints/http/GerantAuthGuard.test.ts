import { Controller, Get, INestApplication } from "@nestjs/common";
import request from "supertest";
import { InvalidSessionError } from "@acces-gerant/domain/InvalidSessionError";
import { GERANT_EMAIL, GERANT_PASSWORD, startTestApplication } from "@tests/e2e/bootstrap/TestApplication";

/**
 * Page gérant fictive, déclarée seulement dans ce test : aucune page gérant métier n'existe encore.
 */
@Controller("gerant/page-de-test")
class PageGerantDeTestController {
	/**
	 * Répond « ok » si le guard laisse passer.
	 */
	@Get()
	public show(): string {
		return "ok";
	}
}

describe("GerantAuthGuard", () => {
	let app: INestApplication;

	beforeEach(async () => {
		app = await startTestApplication([PageGerantDeTestController]);
	});

	afterEach(async () => {
		await app.close();
	});

	it("page gérant sans connexion", async () => {
		// Given
		const url = await app.getUrl();

		// When
		const response = await request(url).get("/gerant/page-de-test");

		// Then
		expect(response.status).toBe(401);
	});

	it("connexion expirée", async () => {
		// Given
		const url = await app.getUrl();

		// When
		const response = await request(url).get("/gerant/page-de-test").set("Authorization", "Bearer jeton-refuse");

		// Then
		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty("message", new InvalidSessionError().message);
	});

	it("page gérant avec connexion", async () => {
		// Given
		const url = await app.getUrl();
		const logIn = await request(url).post("/gerant/session").send({ email: GERANT_EMAIL, password: GERANT_PASSWORD });
		const body: unknown = logIn.body;
		const token = typeof body === "object" && body !== null && "token" in body ? String(body.token) : "";

		// When
		const response = await request(url).get("/gerant/page-de-test").set("Authorization", `Bearer ${token}`);

		// Then
		expect(response.status).toBe(200);
	});
});
