import { AddCafeViewModelFieldsInterface } from "@catalogue/presentation/http/presenters/AddCafeViewModelFieldsInterface";
import { PrixFormatViewModel } from "@catalogue/presentation/http/presenters/PrixFormatViewModel";

/**
 * Réponse HTTP d'un café ajouté, prête à afficher : son identifiant, ses informations et ses prix.
 */
export class AddCafeViewModel {
	public readonly id: string;
	public readonly nom: string;
	public readonly origine: string;
	public readonly description: string;
	public readonly prix: readonly PrixFormatViewModel[];

	/**
	 * Recopie les valeurs déjà mises en forme.
	 */
	public constructor(fields: AddCafeViewModelFieldsInterface) {
		this.id = fields.id;
		this.nom = fields.nom;
		this.origine = fields.origine;
		this.description = fields.description;
		this.prix = fields.prix;
	}
}
