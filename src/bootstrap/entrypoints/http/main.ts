import "reflect-metadata";
import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppConfiguration } from "@bootstrap/configuration/AppConfiguration";
import { AppModule } from "@bootstrap/composition/AppModule";
import { configureApp } from "@bootstrap/entrypoints/http/configureApp";

/**
 * Crée l'application HTTP NestJS, active la validation stricte des requêtes et écoute le port configuré.
 * Le démarrage échoue si la configuration est absente ou invalide (AppConfiguration).
 */
const bootstrap = async (): Promise<INestApplication> => {
	const app = configureApp(await NestFactory.create(AppModule));
	await app.listen(app.get(AppConfiguration).httpPort);

	return app;
};

void bootstrap();
