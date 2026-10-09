import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";

/**
 * Output port de la consultation des réglages (approche B) : reçoit les réglages actuels.
 */
export interface GetReglagesBoutiquePresenterInterface {
	/**
	 * Reçoit les réglages actuels pour les mettre en forme.
	 */
	present(result: ReglagesBoutique): void;
}
