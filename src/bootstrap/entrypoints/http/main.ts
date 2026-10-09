import "reflect-metadata";
import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "@bootstrap/composition/AppModule";
import { configureApp } from "@bootstrap/entrypoints/http/configureApp";

const DEFAULT_PORT = 3000;

/**
 * Lit le port d'écoute dans la variable d'environnement PORT, donnée externe non fiable.
 * Retourne le port par défaut si la valeur est absente ou n'est pas un port valide.
 */
const readPort = (): number => {
	const rawPort = process.env.PORT;

	if (rawPort === undefined || !/^\d+$/.test(rawPort)) {
		return DEFAULT_PORT;
	}

	const port = Number.parseInt(rawPort, 10);

	if (port < 1 || port > 65535) {
		return DEFAULT_PORT;
	}

	return port;
};

/**
 * Crée l'application HTTP NestJS, active la validation stricte des requêtes et écoute le port.
 */
const bootstrap = async (): Promise<INestApplication> => {
	const app = configureApp(await NestFactory.create(AppModule));
	await app.listen(readPort());

	return app;
};

void bootstrap();
