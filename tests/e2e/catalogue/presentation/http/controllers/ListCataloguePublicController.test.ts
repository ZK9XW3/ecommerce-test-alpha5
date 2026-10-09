import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { logInGerant, startTestApplication } from "@tests/e2e/bootstrap/TestApplication";

describe("GET /catalogue", () => {
	let app: INestApplication;

	beforeEach(async () => {
		app = await startTestApplication();
	});

	afterEach(async () => {
		await app.close();
	});

	it("répond 200 sans connexion avec les cafés mis en forme (câblage HTTP et route publique)", async () => {
		// Given
		const url = await app.getUrl();
		await request(url)
			.post("/gerant/cafes")
			.set("Authorization", `Bearer ${await logInGerant(url)}`)
			.send({ nom: "Moka Sidamo", origine: "Éthiopie", description: "Notes florales.", prix250gEnCentimes: 900, prix500gEnCentimes: 1700, prix1kgEnCentimes: 3200 });

		// When
		const response = await request(url).get("/catalogue");

		// Then
		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			cafes: [
				{
					nom: "Moka Sidamo",
					origine: "Éthiopie",
					description: "Notes florales.",
					prix: [
						{ format: "250 g", prix: "9,00 €" },
						{ format: "500 g", prix: "17,00 €" },
						{ format: "1 kg", prix: "32,00 €" }
					]
				}
			]
		});
	});
});
