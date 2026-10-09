/**
 * Seul chargeur de configuration de l'application : lit les variables d'environnement au démarrage
 * et échoue tôt, en nommant la variable fautive sans jamais afficher sa valeur, si l'une est absente ou invalide.
 */
export class AppConfiguration {
	private static readonly DEFAULT_HTTP_PORT = 3000;
	private static readonly MAX_HTTP_PORT = 65535;
	private static readonly MILLISECONDS_PER_MINUTE = 60_000;
	private static readonly POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/;
	private static readonly PASSWORD_HASH_PATTERN = /^[0-9a-f]+:[0-9a-f]+$/i;

	/**
	 * Construit une configuration déjà validée ; passer par fromEnvironment.
	 */
	private constructor(
		public readonly httpPort: number,
		public readonly gerantEmail: string,
		public readonly gerantPasswordHash: string,
		public readonly sessionDurationInMilliseconds: number
	) {}

	/**
	 * Lit et valide la configuration depuis les variables d'environnement : GERANT_EMAIL,
	 * GERANT_PASSWORD_HASH (empreinte scrypt « selHex:cléHex », voir README), GERANT_SESSION_DURATION_MINUTES
	 * et PORT (facultatif, 3000 par défaut).
	 */
	public static fromEnvironment(environment: Record<string, string | undefined>): AppConfiguration {
		return new AppConfiguration(
			AppConfiguration.readHttpPort(environment.PORT),
			AppConfiguration.readRequired("GERANT_EMAIL", environment.GERANT_EMAIL),
			AppConfiguration.readPasswordHash(environment.GERANT_PASSWORD_HASH),
			AppConfiguration.readSessionDurationInMinutes(environment.GERANT_SESSION_DURATION_MINUTES) * AppConfiguration.MILLISECONDS_PER_MINUTE
		);
	}

	/**
	 * Renvoie le port de PORT, ou le port par défaut si la valeur est absente ou n'est pas un port valide.
	 */
	private static readHttpPort(rawPort: string | undefined): number {
		if (rawPort === undefined || !AppConfiguration.POSITIVE_INTEGER_PATTERN.test(rawPort)) {
			return AppConfiguration.DEFAULT_HTTP_PORT;
		}

		const port = Number.parseInt(rawPort, 10);

		if (port > AppConfiguration.MAX_HTTP_PORT) {
			return AppConfiguration.DEFAULT_HTTP_PORT;
		}

		return port;
	}

	/**
	 * Renvoie la valeur de la variable, ou échoue si elle est absente ou vide.
	 */
	private static readRequired(name: string, rawValue: string | undefined): string {
		if (rawValue === undefined || rawValue.trim() === "") {
			throw new Error(`Configuration : la variable d'environnement ${name} est obligatoire.`);
		}

		return rawValue.trim();
	}

	/**
	 * Renvoie l'empreinte du mot de passe, ou échoue si elle n'a pas la forme « selHex:cléHex ».
	 */
	private static readPasswordHash(rawValue: string | undefined): string {
		const passwordHash = AppConfiguration.readRequired("GERANT_PASSWORD_HASH", rawValue);

		if (!AppConfiguration.PASSWORD_HASH_PATTERN.test(passwordHash)) {
			throw new Error("Configuration : GERANT_PASSWORD_HASH doit avoir la forme « selHex:cléHex » (voir README).");
		}

		return passwordHash;
	}

	/**
	 * Renvoie la durée de session en minutes, ou échoue si ce n'est pas un entier strictement positif.
	 */
	private static readSessionDurationInMinutes(rawValue: string | undefined): number {
		const duration = AppConfiguration.readRequired("GERANT_SESSION_DURATION_MINUTES", rawValue);

		if (!AppConfiguration.POSITIVE_INTEGER_PATTERN.test(duration)) {
			throw new Error("Configuration : GERANT_SESSION_DURATION_MINUTES doit être un nombre entier de minutes supérieur à 0.");
		}

		return Number.parseInt(duration, 10);
	}
}
