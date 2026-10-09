import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";
import { InvalidCafeError } from "@catalogue/domain/cafe/InvalidCafeError";
import { Montant } from "@catalogue/domain/shared/Montant";

/**
 * Prix d'un café pour chacun des trois formats, tous présents et supérieurs à 0.
 */
export class PrixParFormat {
	private static readonly PRIX_MANQUANT = "Le prix est manquant pour le format";
	private static readonly PRIX_NON_POSITIF = "Le prix doit être supérieur à 0 pour le format";

	/**
	 * Regroupe des prix déjà validés ; passer par fromCentimes.
	 */
	private constructor(private readonly prixByFormat: Readonly<Record<FormatCafe, Montant>>) {}

	/**
	 * Crée les prix des trois formats ; lève InvalidCafeError en nommant le premier format dont le prix manque ou n'est pas supérieur à 0.
	 */
	public static fromCentimes(prixEnCentimes: Partial<Record<FormatCafe, number>>): PrixParFormat {
		return new PrixParFormat({
			[FormatCafe.Grammes250]: PrixParFormat.createPrix(FormatCafe.Grammes250, prixEnCentimes[FormatCafe.Grammes250]),
			[FormatCafe.Grammes500]: PrixParFormat.createPrix(FormatCafe.Grammes500, prixEnCentimes[FormatCafe.Grammes500]),
			[FormatCafe.Kilogramme1]: PrixParFormat.createPrix(FormatCafe.Kilogramme1, prixEnCentimes[FormatCafe.Kilogramme1])
		});
	}

	/**
	 * Crée le prix d'un format ; refuse un prix absent ou qui n'est pas supérieur à 0.
	 */
	private static createPrix(format: FormatCafe, centimes: number | undefined): Montant {
		if (centimes === undefined) {
			throw new InvalidCafeError(`${PrixParFormat.PRIX_MANQUANT} ${format}.`);
		}

		if (centimes <= 0) {
			throw new InvalidCafeError(`${PrixParFormat.PRIX_NON_POSITIF} ${format}.`);
		}

		return Montant.fromCentimes(centimes);
	}

	/**
	 * Renvoie le prix du format demandé.
	 */
	public prixPour(format: FormatCafe): Montant {
		return this.prixByFormat[format];
	}
}
