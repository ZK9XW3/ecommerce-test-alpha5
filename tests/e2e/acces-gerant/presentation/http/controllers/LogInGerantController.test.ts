import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { InvalidCredentialsError } from "@acces-gerant/domain/InvalidCredentialsError";
import { GERANT_EMAIL, GERANT_PASSWORD, startTestApplication } from "@tests/e2e/bootstrap/TestApplication";

describe("POST /gerant/session", () => {
	let app: INestApplication;

	beforeEach(async () => {
		app = await startTestApplication();
	});

	afterEach(async () => {
		await app.close();
	});

	it("répond 201 avec un JSON { token, expiresAt } (câblage HTTP de la connexion)", async () => {
		// Given
		const url = await app.getUrl();

		// When
		const response = await request(url).post("/gerant/session").send({ email: GERANT_EMAIL, password: GERANT_PASSWORD });

		// Then
		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("token");
		expect(response.body).toHaveProperty("expiresAt", expect.stringMatching(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/));
	});

	it("répond 401 avec le message unique des identifiants refusés (câblage AccesGerantHttpErrorFilter)", async () => {
		// Given
		const url = await app.getUrl();

		// When
		const response = await request(url).post("/gerant/session").send({ email: GERANT_EMAIL, password: "mauvais-mot-de-passe" });

		// Then
		expect(response.status).toBe(401);
		expect(response.body).toEqual({ statusCode: 401, message: new InvalidCredentialsError().message });
	});

	it("refuse une requête sans mot de passe avec 400", async () => {
		// Given
		const url = await app.getUrl();

		// When
		const response = await request(url).post("/gerant/session").send({ email: GERANT_EMAIL });

		// Then
		expect(response.status).toBe(400);
	});
});
