import { AdresseEmail } from "@reglages-boutique/domain/AdresseEmail";
import { Montant } from "@reglages-boutique/domain/Montant";
import { PoidsStock } from "@reglages-boutique/domain/PoidsStock";
import { ReglagesBoutiqueFieldsInterface } from "@reglages-boutique/domain/ReglagesBoutiqueFieldsInterface";

/**
 * Réglages uniques de la boutique : seuil de stock bas commun à tous les cafés, adresse qui reçoit les alertes
 * et prix fixe des frais de livraison.
 */
export class ReglagesBoutique {
	/**
	 * Regroupe des valeurs déjà validées ; passer par fromFields.
	 */
	private constructor(
		public readonly seuilStockBas: PoidsStock,
		public readonly adresseAlerte: AdresseEmail,
		public readonly fraisLivraison: Montant
	) {}

	/**
	 * Crée les réglages d'un bloc ; lève InvalidReglagesBoutiqueError si une seule valeur enfreint une règle.
	 */
	public static fromFields(fields: ReglagesBoutiqueFieldsInterface): ReglagesBoutique {
		return new ReglagesBoutique(
			PoidsStock.fromKilogrammes(fields.seuilStockBasEnKg),
			AdresseEmail.fromString(fields.adresseAlerte),
			Montant.fromCentimes(fields.fraisLivraisonEnCentimes)
		);
	}
}
