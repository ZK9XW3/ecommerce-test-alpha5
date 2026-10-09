import { Cafe } from "@catalogue/domain/cafe/Cafe";

/**
 * Output port du catalogue public (approche B) : reçoit les cafés proposés aux visiteurs.
 */
export interface ListCataloguePublicPresenterInterface {
	/**
	 * Reçoit les cafés du catalogue public pour les mettre en forme.
	 */
	present(result: readonly Cafe[]): void;
}
