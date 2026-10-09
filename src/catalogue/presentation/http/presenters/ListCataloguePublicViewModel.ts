import { CafeCataloguePublicViewModel } from "@catalogue/presentation/http/presenters/CafeCataloguePublicViewModel";

/**
 * Réponse HTTP du catalogue public, prête à afficher : la liste des cafés proposés.
 */
export class ListCataloguePublicViewModel {
	/**
	 * Regroupe les cafés du catalogue déjà mis en forme.
	 */
	public constructor(public readonly cafes: readonly CafeCataloguePublicViewModel[]) {}
}
