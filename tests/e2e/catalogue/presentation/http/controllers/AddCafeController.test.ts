import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { logInGerant, startTestApplication } from "@tests/e2e/bootstrap/TestApplication";

describe("POST /gerant/cafes", () => {
	const mokaSidamo = {
		nom: "Moka Sidamo",
		origine: "Éthiopie",
		description: "Notes florales et d'agrumes.",
		prix250gEnCentimes: 900,
		prix500gEnCentimes: 1700,
		prix1kgEnCentimes: 3200
	};
	let app: INestApplication;

	beforeEach(async () => {
		app = await startTestApplication();
	});

	afterEach(async () => {
		await app.close();
	});

	it("ajout par un visiteur", async () => {
		// Given
		const url = await app.getUrl();

		// When
		const response = await request(url).post("/gerant/cafes").send(mokaSidamo);

		// Then
		expect(response.status).toBe(401);
		const catalogue = await request(url).get("/catalogue");
		expect(catalogue.body).toEqual({ cafes: [] });
	});

	it("répond 201 avec le café enregistré mis en forme (câblage HTTP)", async () => {
		// Given
		const url = await app.getUrl();
		const token = await logInGerant(url);

		// When
		const response = await request(url).post("/gerant/cafes").set("Authorization", `Bearer ${token}`).send(mokaSidamo);

		// Then
		expect(response.status).toBe(201);
		expect(response.body).toMatchObject({
			nom: "Moka Sidamo",
			prix: [
				{ format: "250 g", prix: "9,00 €" },
				{ format: "500 g", prix: "17,00 €" },
				{ format: "1 kg", prix: "32,00 €" }
			]
		});
	});

	it("répond 422 avec l'information manquante (câblage CatalogueHttpErrorFilter)", async () => {
		// Given
		const url = await app.getUrl();
		const token = await logInGerant(url);

		// When
		const response = await request(url)
			.post("/gerant/cafes")
			.set("Authorization", `Bearer ${token}`)
			.send({ ...mokaSidamo, prix1kgEnCentimes: undefined });

		// Then
		expect(response.status).toBe(422);
		expect(response.body).toHaveProperty("message", expect.stringContaining("1 kg"));
	});

	it("refuse un prix en fraction de centime avec 400", async () => {
		// Given
		const url = await app.getUrl();
		const token = await logInGerant(url);

		// When
		const response = await request(url)
			.post("/gerant/cafes")
			.set("Authorization", `Bearer ${token}`)
			.send({ ...mokaSidamo, prix250gEnCentimes: 900.5 });

		// Then
		expect(response.status).toBe(400);
	});
});
