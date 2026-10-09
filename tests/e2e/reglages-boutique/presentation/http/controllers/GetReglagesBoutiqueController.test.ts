import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { ADRESSE_ALERTE_INITIALE, logInGerant, startTestApplication } from "@tests/e2e/bootstrap/TestApplication";

describe("GET /gerant/settings", () => {
	let app: INestApplication;

	beforeEach(async () => {
		app = await startTestApplication();
	});

	afterEach(async () => {
		await app.close();
	});

	it("répond 200 avec les réglages de départ lus dans la configuration (câblage HTTP et A6)", async () => {
		// Given
		const url = await app.getUrl();
		const token = await logInGerant(url);

		// When
		const response = await request(url).get("/gerant/settings").set("Authorization", `Bearer ${token}`);

		// Then
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ seuilStockBas: "1,000 kg", adresseAlerte: ADRESSE_ALERTE_INITIALE, fraisLivraison: "5,00 €" });
	});
});
