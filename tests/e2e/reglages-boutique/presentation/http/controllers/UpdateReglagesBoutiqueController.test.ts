import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { ADRESSE_ALERTE_INITIALE, logInGerant, startTestApplication } from "@tests/e2e/bootstrap/TestApplication";

describe("PUT /gerant/settings", () => {
	const nouveauxReglages = { seuilStockBasEnKg: 2, adresseAlerte: "stock@cafe-exemple.fr", fraisLivraisonEnCentimes: 490 };
	let app: INestApplication;

	beforeEach(async () => {
		app = await startTestApplication();
	});

	afterEach(async () => {
		await app.close();
	});

	it("réglages par un visiteur", async () => {
		// Given
		const url = await app.getUrl();

		// When
		const response = await request(url).put("/gerant/settings").send(nouveauxReglages);

		// Then
		expect(response.status).toBe(401);
		const reglages = await request(url)
			.get("/gerant/settings")
			.set("Authorization", `Bearer ${await logInGerant(url)}`);
		expect(reglages.body).toEqual({ seuilStockBas: "1,000 kg", adresseAlerte: ADRESSE_ALERTE_INITIALE, fraisLivraison: "5,00 €" });
	});

	it("répond 200 avec les réglages enregistrés mis en forme (câblage HTTP)", async () => {
		// Given
		const url = await app.getUrl();
		const token = await logInGerant(url);

		// When
		const response = await request(url).put("/gerant/settings").set("Authorization", `Bearer ${token}`).send(nouveauxReglages);

		// Then
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ seuilStockBas: "2,000 kg", adresseAlerte: "stock@cafe-exemple.fr", fraisLivraison: "4,90 €" });
	});

	it("répond 422 avec le message du refus (câblage ReglagesBoutiqueHttpErrorFilter)", async () => {
		// Given
		const url = await app.getUrl();
		const token = await logInGerant(url);

		// When
		const response = await request(url)
			.put("/gerant/settings")
			.set("Authorization", `Bearer ${token}`)
			.send({ ...nouveauxReglages, adresseAlerte: "stock-cafe-exemple" });

		// Then
		expect(response.status).toBe(422);
		expect(response.body).toHaveProperty("message", expect.stringContaining("adresse d'alerte"));
	});

	it("refuse une requête sans frais de livraison avec 400", async () => {
		// Given
		const url = await app.getUrl();
		const token = await logInGerant(url);

		// When
		const response = await request(url).put("/gerant/settings").set("Authorization", `Bearer ${token}`).send({ seuilStockBasEnKg: 2, adresseAlerte: "stock@cafe-exemple.fr" });

		// Then
		expect(response.status).toBe(400);
	});
});
