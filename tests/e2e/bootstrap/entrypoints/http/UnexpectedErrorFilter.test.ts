import { Controller, Get, INestApplication } from "@nestjs/common";
import request from "supertest";
import { publicRoute } from "@acces-gerant/presentation/http/controllers/publicRoute";
import { startTestApplication } from "@tests/e2e/bootstrap/TestApplication";

/**
 * Route publique fictive qui plante, déclarée seulement dans ce test.
 */
@Controller("route-qui-plante")
class RouteQuiPlanteController {
	/**
	 * Lève une erreur inattendue contenant un détail interne.
	 */
	@publicRoute()
	@Get()
	public crash(): string {
		throw new Error("détail interne secret");
	}
}

describe("UnexpectedErrorFilter", () => {
	let app: INestApplication;

	beforeEach(async () => {
		app = await startTestApplication([RouteQuiPlanteController]);
	});

	afterEach(async () => {
		await app.close();
	});

	it("répond 500 sans révéler le détail d'une erreur inattendue", async () => {
		// Given
		const url = await app.getUrl();

		// When
		const response = await request(url).get("/route-qui-plante");

		// Then
		expect(response.status).toBe(500);
		expect(JSON.stringify(response.body)).not.toContain("détail interne secret");
	});
});
