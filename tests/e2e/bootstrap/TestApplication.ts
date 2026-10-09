import { randomBytes, scryptSync } from "node:crypto";
import { INestApplication, Type } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppConfiguration } from "@bootstrap/configuration/AppConfiguration";
import { AppModule } from "@bootstrap/composition/AppModule";
import { configureApp } from "@bootstrap/entrypoints/http/configureApp";

export const GERANT_EMAIL = "gerant@cafe.fr";
export const GERANT_PASSWORD = "mot-de-passe-de-test";

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
		GERANT_SESSION_DURATION_MINUTES: "480"
	});
	const moduleRef = await Test.createTestingModule({ imports: [AppModule], controllers: testControllers })
		.overrideProvider(AppConfiguration)
		.useValue(configuration)
		.compile();
	const app = configureApp(moduleRef.createNestApplication());
	await app.listen(0);

	return app;
};
