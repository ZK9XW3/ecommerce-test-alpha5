/**
 * Réponse HTTP d'un réglage accepté, prête à afficher : les réglages enregistrés.
 */
export class UpdateReglagesBoutiqueViewModel {
	/**
	 * Regroupe le seuil (ex. « 2,000 kg »), l'adresse d'alerte et les frais de livraison (ex. « 4,90 € ») déjà mis en forme.
	 */
	public constructor(
		public readonly seuilStockBas: string,
		public readonly adresseAlerte: string,
		public readonly fraisLivraison: string
	) {}
}
