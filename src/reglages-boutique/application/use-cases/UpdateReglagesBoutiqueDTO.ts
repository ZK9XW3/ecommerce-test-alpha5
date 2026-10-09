import { ReglagesBoutiqueFieldsInterface } from "@reglages-boutique/domain/ReglagesBoutiqueFieldsInterface";

/**
 * Entrée du réglage de la boutique : les trois valeurs qui remplacent d'un bloc les réglages actuels.
 */
export class UpdateReglagesBoutiqueDTO implements ReglagesBoutiqueFieldsInterface {
	public readonly seuilStockBasEnKg: number;
	public readonly adresseAlerte: string;
	public readonly fraisLivraisonEnCentimes: number;

	/**
	 * Recopie les trois valeurs reçues.
	 */
	public constructor(fields: ReglagesBoutiqueFieldsInterface) {
		this.seuilStockBasEnKg = fields.seuilStockBasEnKg;
		this.adresseAlerte = fields.adresseAlerte;
		this.fraisLivraisonEnCentimes = fields.fraisLivraisonEnCentimes;
	}
}
