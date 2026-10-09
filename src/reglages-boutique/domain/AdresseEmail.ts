import { InvalidReglagesBoutiqueError } from "@reglages-boutique/domain/InvalidReglagesBoutiqueError";

/**
 * Adresse e-mail bien formée : une partie locale, un « @ », puis un domaine contenant un point, sans espace.
 */
export class AdresseEmail {
	private static readonly FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	private static readonly MAL_FORMEE = "L'adresse d'alerte doit être une adresse e-mail valide (ex. stock@cafe-exemple.fr).";

	/**
	 * Crée une adresse déjà validée ; passer par fromString.
	 */
	private constructor(public readonly value: string) {}

	/**
	 * Crée une adresse ; refuse une adresse mal formée (Q3 de l'architecture).
	 */
	public static fromString(value: string): AdresseEmail {
		if (!AdresseEmail.FORMAT.test(value)) {
			throw new InvalidReglagesBoutiqueError(AdresseEmail.MAL_FORMEE);
		}

		return new AdresseEmail(value);
	}
}
