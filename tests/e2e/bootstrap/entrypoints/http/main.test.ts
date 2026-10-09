import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { startTestApplication } from "@tests/e2e/bootstrap/TestApplication";

describe("Application HTTP", () => {
	let app: INestApplication;

	beforeEach(async () => {
		app = await startTestApplication();
	});

	afterEach(async () => {
		await app.close();
	});

	it("démarre et répond 404 à une route inconnue", async () => {
		// Given
		const url = await app.getUrl();

		// When
		const response = await request(url).get("/route-inconnue");

		// Then
		expect(response.status).toBe(404);
	});
});
