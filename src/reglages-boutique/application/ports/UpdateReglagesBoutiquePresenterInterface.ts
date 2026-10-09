import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";

/**
 * Output port du réglage de la boutique (approche B) : reçoit les réglages enregistrés.
 */
export interface UpdateReglagesBoutiquePresenterInterface {
	/**
	 * Reçoit les réglages enregistrés pour les mettre en forme.
	 */
	present(result: ReglagesBoutique): void;
}
