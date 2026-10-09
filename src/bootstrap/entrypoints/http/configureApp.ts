import { INestApplication, ValidationPipe } from "@nestjs/common";

/**
 * Applique à l'application HTTP sa configuration commune : validation stricte des requêtes.
 * Partagée par le point d'entrée et les tests, pour qu'ils démarrent la même application.
 */
export const configureApp = (app: INestApplication): INestApplication => {
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

	return app;
};
