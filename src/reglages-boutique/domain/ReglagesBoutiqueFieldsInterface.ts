/**
 * Contrat de données des réglages de la boutique : les valeurs attendues pour les créer ou les remplacer.
 */
export interface ReglagesBoutiqueFieldsInterface {
	readonly seuilStockBasEnKg: number;
	readonly adresseAlerte: string;
	readonly fraisLivraisonEnCentimes: number;
}
