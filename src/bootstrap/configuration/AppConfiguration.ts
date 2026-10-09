import { AppConfigurationFieldsInterface } from "@bootstrap/configuration/AppConfigurationFieldsInterface";
import { InvalidReglagesBoutiqueError } from "@reglages-boutique/domain/InvalidReglagesBoutiqueError";
import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";
import { ReglagesBoutiqueFieldsInterface } from "@reglages-boutique/domain/ReglagesBoutiqueFieldsInterface";

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

	public readonly httpPort: number;
	public readonly gerantEmail: string;
	public readonly gerantPasswordHash: string;
	public readonly sessionDurationInMilliseconds: number;
	public readonly reglagesBoutiqueInitiaux: ReglagesBoutiqueFieldsInterface;

	/**
	 * Construit une configuration déjà validée ; passer par fromEnvironment.
	 */
	private constructor(fields: AppConfigurationFieldsInterface) {
		this.httpPort = fields.httpPort;
		this.gerantEmail = fields.gerantEmail;
		this.gerantPasswordHash = fields.gerantPasswordHash;
		this.sessionDurationInMilliseconds = fields.sessionDurationInMilliseconds;
		this.reglagesBoutiqueInitiaux = fields.reglagesBoutiqueInitiaux;
	}

	/**
	 * Lit et valide la configuration depuis les variables d'environnement : GERANT_EMAIL,
	 * GERANT_PASSWORD_HASH (empreinte scrypt « selHex:cléHex », voir README), GERANT_SESSION_DURATION_MINUTES
	 * les réglages initiaux de la boutique (A6) REGLAGES_SEUIL_STOCK_BAS_KG, REGLAGES_ADRESSE_ALERTE,
	 * REGLAGES_FRAIS_LIVRAISON_CENTIMES, et PORT (facultatif, 3000 par défaut).
	 */
	public static fromEnvironment(environment: Record<string, string | undefined>): AppConfiguration {
		return new AppConfiguration({
			httpPort: AppConfiguration.readHttpPort(environment.PORT),
			gerantEmail: AppConfiguration.readRequired("GERANT_EMAIL", environment.GERANT_EMAIL),
			gerantPasswordHash: AppConfiguration.readPasswordHash(environment.GERANT_PASSWORD_HASH),
			sessionDurationInMilliseconds: AppConfiguration.readSessionDurationInMinutes(environment.GERANT_SESSION_DURATION_MINUTES) * AppConfiguration.MILLISECONDS_PER_MINUTE,
			reglagesBoutiqueInitiaux: {
				seuilStockBasEnKg: AppConfiguration.readNumber("REGLAGES_SEUIL_STOCK_BAS_KG", environment.REGLAGES_SEUIL_STOCK_BAS_KG),
				adresseAlerte: AppConfiguration.readRequired("REGLAGES_ADRESSE_ALERTE", environment.REGLAGES_ADRESSE_ALERTE),
				fraisLivraisonEnCentimes: AppConfiguration.readNumber("REGLAGES_FRAIS_LIVRAISON_CENTIMES", environment.REGLAGES_FRAIS_LIVRAISON_CENTIMES)
			}
		});
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

	/**
	 * Renvoie la valeur numérique de la variable, ou échoue si elle est absente ou n'est pas un nombre.
	 * Les règles métier (valeur négative, précision) sont vérifiées ensuite par le domaine des réglages.
	 */
	private static readNumber(name: string, rawValue: string | undefined): number {
		const value = Number(AppConfiguration.readRequired(name, rawValue));

		if (!Number.isFinite(value)) {
			throw new Error(`Configuration : ${name} doit être un nombre (séparateur décimal : point).`);
		}

		return value;
	}

	/**
	 * Construit les réglages de départ de la boutique, ou échoue en nommant les variables REGLAGES_*
	 * quand une valeur enfreint une règle métier (le message du domaine seul ne nomme pas la configuration).
	 */
	public createReglagesBoutiqueInitiaux(): ReglagesBoutique {
		try {
			return ReglagesBoutique.fromFields(this.reglagesBoutiqueInitiaux);
		} catch (error) {
			if (error instanceof InvalidReglagesBoutiqueError) {
				throw new Error(`Configuration : réglages initiaux REGLAGES_* invalides. ${error.message}`, { cause: error });
			}

			throw error;
		}
	}
}
