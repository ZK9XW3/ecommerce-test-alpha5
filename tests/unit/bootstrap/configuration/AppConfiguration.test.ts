import { AppConfiguration } from "@bootstrap/configuration/AppConfiguration";

describe("AppConfiguration", () => {
	const validEnvironment = {
		GERANT_EMAIL: "gerant@cafe.fr",
		GERANT_PASSWORD_HASH: "a1b2:c3d4",
		GERANT_SESSION_DURATION_MINUTES: "480"
	};

	it("lit la durée de session en minutes et la convertit en millisecondes", () => {
		// Given
		const environment = { ...validEnvironment, GERANT_SESSION_DURATION_MINUTES: "2" };

		// When
		const configuration = AppConfiguration.fromEnvironment(environment);

		// Then
		expect(configuration.sessionDurationInMilliseconds).toBe(120000);
	});

	it("lit le compte gérant", () => {
		// Given
		const environment = validEnvironment;

		// When
		const configuration = AppConfiguration.fromEnvironment(environment);

		// Then
		expect([configuration.gerantEmail, configuration.gerantPasswordHash]).toEqual(["gerant@cafe.fr", "a1b2:c3d4"]);
	});

	it("écoute le port 3000 si PORT est absent", () => {
		// Given
		const environment = validEnvironment;

		// When
		const configuration = AppConfiguration.fromEnvironment(environment);

		// Then
		expect(configuration.httpPort).toBe(3000);
	});

	it("écoute le port de PORT s'il est valide", () => {
		// Given
		const environment = { ...validEnvironment, PORT: "8080" };

		// When
		const configuration = AppConfiguration.fromEnvironment(environment);

		// Then
		expect(configuration.httpPort).toBe(8080);
	});

	it("échoue au démarrage si l'e-mail du gérant est absent", () => {
		// Given
		const environment = { ...validEnvironment, GERANT_EMAIL: undefined };

		// When
		const load = (): AppConfiguration => {
			return AppConfiguration.fromEnvironment(environment);
		};

		// Then
		expect(load).toThrow("GERANT_EMAIL");
	});

	it("échoue au démarrage sans révéler l'empreinte si elle n'a pas la forme sel:clé", () => {
		// Given
		const environment = { ...validEnvironment, GERANT_PASSWORD_HASH: "empreinte-invalide" };

		// When
		const load = (): AppConfiguration => {
			return AppConfiguration.fromEnvironment(environment);
		};

		// Then
		expect(load).toThrow("GERANT_PASSWORD_HASH");
		expect(load).not.toThrow("empreinte-invalide");
	});

	it("échoue au démarrage si la durée de session n'est pas un nombre entier de minutes positif", () => {
		// Given
		const environment = { ...validEnvironment, GERANT_SESSION_DURATION_MINUTES: "0" };

		// When
		const load = (): AppConfiguration => {
			return AppConfiguration.fromEnvironment(environment);
		};

		// Then
		expect(load).toThrow("GERANT_SESSION_DURATION_MINUTES");
	});
});
