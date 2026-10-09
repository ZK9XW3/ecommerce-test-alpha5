import { InvalidReglagesBoutiqueError } from "@reglages-boutique/domain/InvalidReglagesBoutiqueError";

/**
 * Poids de café en grammes entiers, jamais négatif. Propre au module réglages (aucun import du catalogue).
 */
export class PoidsStock {
	private static readonly GRAMMES_PAR_KG = 1000;
	private static readonly NEGATIF = "Le seuil de stock bas ne peut pas être négatif.";
	private static readonly PLUS_FIN_QUE_LE_GRAMME = "Le seuil de stock bas se règle au gramme près.";

	/**
	 * Crée un poids déjà validé ; passer par fromKilogrammes.
	 */
	private constructor(public readonly grammes: number) {}

	/**
	 * Crée un poids depuis des kilogrammes ; refuse une valeur négative ou plus fine que le gramme.
	 */
	public static fromKilogrammes(kilogrammes: number): PoidsStock {
		const grammes = Math.round(kilogrammes * PoidsStock.GRAMMES_PAR_KG);

		if (grammes < 0) {
			throw new InvalidReglagesBoutiqueError(PoidsStock.NEGATIF);
		}

		if (grammes / PoidsStock.GRAMMES_PAR_KG !== kilogrammes) {
			throw new InvalidReglagesBoutiqueError(PoidsStock.PLUS_FIN_QUE_LE_GRAMME);
		}

		return new PoidsStock(grammes);
	}
}
