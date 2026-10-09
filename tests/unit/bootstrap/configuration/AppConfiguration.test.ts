import { AppConfiguration } from "@bootstrap/configuration/AppConfiguration";

describe("AppConfiguration", () => {
	const validEnvironment = {
		GERANT_EMAIL: "gerant@cafe.fr",
		GERANT_PASSWORD_HASH: "a1b2:c3d4",
		GERANT_SESSION_DURATION_MINUTES: "480",
		REGLAGES_SEUIL_STOCK_BAS_KG: "1.5",
		REGLAGES_ADRESSE_ALERTE: "alerte@cafe.fr",
		REGLAGES_FRAIS_LIVRAISON_CENTIMES: "490"
	};

	it("lit les réglages initiaux de la boutique", () => {
		// Given
		const environment = validEnvironment;

		// When
		const configuration = AppConfiguration.fromEnvironment(environment);

		// Then
		expect(configuration.reglagesBoutiqueInitiaux).toEqual({ seuilStockBasEnKg: 1.5, adresseAlerte: "alerte@cafe.fr", fraisLivraisonEnCentimes: 490 });
	});

	it("échoue au démarrage si l'adresse d'alerte initiale est absente", () => {
		// Given
		const environment = { ...validEnvironment, REGLAGES_ADRESSE_ALERTE: undefined };

		// When
		const load = (): AppConfiguration => {
			return AppConfiguration.fromEnvironment(environment);
		};

		// Then
		expect(load).toThrow("REGLAGES_ADRESSE_ALERTE");
	});

	it("échoue au démarrage si le seuil initial n'est pas un nombre", () => {
		// Given
		const environment = { ...validEnvironment, REGLAGES_SEUIL_STOCK_BAS_KG: "deux" };

		// When
		const load = (): AppConfiguration => {
			return AppConfiguration.fromEnvironment(environment);
		};

		// Then
		expect(load).toThrow("REGLAGES_SEUIL_STOCK_BAS_KG");
	});

	it("échoue au démarrage si les frais de livraison initiaux ne sont pas un nombre", () => {
		// Given
		const environment = { ...validEnvironment, REGLAGES_FRAIS_LIVRAISON_CENTIMES: "" };

		// When
		const load = (): AppConfiguration => {
			return AppConfiguration.fromEnvironment(environment);
		};

		// Then
		expect(load).toThrow("REGLAGES_FRAIS_LIVRAISON_CENTIMES");
	});

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

	it("échoue en nommant REGLAGES_* si un réglage initial enfreint une règle métier", () => {
		// Given
		const configuration = AppConfiguration.fromEnvironment({ ...validEnvironment, REGLAGES_SEUIL_STOCK_BAS_KG: "-1" });

		// When
		const createReglages = (): unknown => {
			return configuration.createReglagesBoutiqueInitiaux();
		};

		// Then
		expect(createReglages).toThrow("Configuration : réglages initiaux REGLAGES_* invalides");
	});
});
