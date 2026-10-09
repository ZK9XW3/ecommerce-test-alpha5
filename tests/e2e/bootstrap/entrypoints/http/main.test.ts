import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@bootstrap/composition/AppModule";
import { configureApp } from "@bootstrap/entrypoints/http/configureApp";

describe("Application HTTP", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
		app = configureApp(moduleRef.createNestApplication());
		await app.listen(0);
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
