import { CafeFieldsInterface } from "@catalogue/domain/cafe/CafeFieldsInterface";
import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";

/**
 * Entrée de l'ajout d'un café : nom, origine, description et prix en centimes de chaque format.
 */
export class AddCafeDTO implements CafeFieldsInterface {
	public readonly nom: string;
	public readonly origine: string;
	public readonly description: string;
	public readonly prixEnCentimes: Partial<Record<FormatCafe, number>>;

	/**
	 * Recopie les valeurs reçues.
	 */
	public constructor(fields: CafeFieldsInterface) {
		this.nom = fields.nom;
		this.origine = fields.origine;
		this.description = fields.description;
		this.prixEnCentimes = { ...fields.prixEnCentimes };
	}
}
