import { Cafe } from "@catalogue/domain/cafe/Cafe";
import { CafeFieldsInterface } from "@catalogue/domain/cafe/CafeFieldsInterface";
import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";

/**
 * Construit les valeurs d'un café de test valide (le « Moka Sidamo » du ticket) ; le test ne précise que ce qui compte pour son cas.
 */
export class CafeBuilder {
	private fields: CafeFieldsInterface = {
		nom: "Moka Sidamo",
		origine: "Éthiopie",
		description: "Notes florales et d'agrumes.",
		prixEnCentimes: { [FormatCafe.Grammes250]: 900, [FormatCafe.Grammes500]: 1700, [FormatCafe.Kilogramme1]: 3200 }
	};

	/**
	 * Remplace les valeurs données, garde les autres.
	 */
	public with(overrides: Partial<CafeFieldsInterface>): CafeBuilder {
		this.fields = { ...this.fields, ...overrides };

		return this;
	}

	/**
	 * Renvoie les valeurs du café, pour un DTO ou une requête.
	 */
	public buildFields(): CafeFieldsInterface {
		return this.fields;
	}

	/**
	 * Crée le café du domaine avec cet identifiant.
	 */
	public buildCafe(id: string): Cafe {
		return Cafe.create(id, this.fields);
	}
}
