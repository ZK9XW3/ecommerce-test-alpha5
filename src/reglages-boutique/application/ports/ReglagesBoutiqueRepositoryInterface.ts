import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";

/**
 * Port de lecture et d'enregistrement des réglages uniques de la boutique.
 */
export interface ReglagesBoutiqueRepositoryInterface {
	/**
	 * Renvoie les réglages actuels ; ils existent toujours, initialisés au démarrage.
	 */
	get(): Promise<ReglagesBoutique>;

	/**
	 * Remplace les réglages actuels.
	 */
	save(reglages: ReglagesBoutique): Promise<void>;
}
