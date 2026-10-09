import { randomBytes, scryptSync } from "node:crypto";
import { INestApplication, Type } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppConfiguration } from "@bootstrap/configuration/AppConfiguration";
import { AppModule } from "@bootstrap/composition/AppModule";
import { configureApp } from "@bootstrap/entrypoints/http/configureApp";

export const GERANT_EMAIL = "gerant@cafe.fr";
export const GERANT_PASSWORD = "mot-de-passe-de-test";
export const ADRESSE_ALERTE_INITIALE = "alerte@cafe.fr";

const hashPassword = (password: string): string => {
	const salt = randomBytes(16);

	return `${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`;
};

/**
 * Démarre l'application complète sur un port libre, avec un compte gérant de test.
 * Les controllers supplémentaires sont déclarés par le test lui-même, jamais en production.
 */
export const startTestApplication = async (testControllers: Type[] = []): Promise<INestApplication> => {
	const configuration = AppConfiguration.fromEnvironment({
		GERANT_EMAIL,
		GERANT_PASSWORD_HASH: hashPassword(GERANT_PASSWORD),
		GERANT_SESSION_DURATION_MINUTES: "480",
		REGLAGES_SEUIL_STOCK_BAS_KG: "1",
		REGLAGES_ADRESSE_ALERTE: ADRESSE_ALERTE_INITIALE,
		REGLAGES_FRAIS_LIVRAISON_CENTIMES: "500"
	});
	const moduleRef = await Test.createTestingModule({ imports: [AppModule], controllers: testControllers })
		.overrideProvider(AppConfiguration)
		.useValue(configuration)
		.compile();
	const app = configureApp(moduleRef.createNestApplication());
	await app.listen(0);

	return app;
};

/**
 * Connecte le gérant de test et renvoie son jeton de session.
 */
export const logInGerant = async (url: string): Promise<string> => {
	const response = await request(url).post("/gerant/session").send({ email: GERANT_EMAIL, password: GERANT_PASSWORD });
	const body: unknown = response.body;

	return typeof body === "object" && body !== null && "token" in body ? String(body.token) : "";
};
