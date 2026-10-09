import { InvalidReglagesBoutiqueError } from "@reglages-boutique/domain/InvalidReglagesBoutiqueError";

/**
 * Montant en centimes entiers, jamais négatif. Propre au module réglages (aucun import du catalogue).
 */
export class Montant {
	private static readonly NEGATIF = "Les frais de livraison ne peuvent pas être négatifs.";
	private static readonly FRACTION_DE_CENTIME = "Les frais de livraison se règlent au centime près.";

	/**
	 * Crée un montant déjà validé ; passer par fromCentimes.
	 */
	private constructor(public readonly centimes: number) {}

	/**
	 * Crée un montant depuis des centimes ; refuse une valeur négative ou une fraction de centime.
	 */
	public static fromCentimes(centimes: number): Montant {
		if (centimes < 0) {
			throw new InvalidReglagesBoutiqueError(Montant.NEGATIF);
		}

		if (!Number.isInteger(centimes)) {
			throw new InvalidReglagesBoutiqueError(Montant.FRACTION_DE_CENTIME);
		}

		return new Montant(centimes);
	}
}
