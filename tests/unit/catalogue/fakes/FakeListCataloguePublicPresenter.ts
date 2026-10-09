import { ListCataloguePublicPresenterInterface } from "@catalogue/application/ports/ListCataloguePublicPresenterInterface";
import { Cafe } from "@catalogue/domain/cafe/Cafe";

/**
 * Presenter de test : garde les cafés du catalogue public reçus pour que le test les observe.
 */
export class FakeListCataloguePublicPresenter implements ListCataloguePublicPresenterInterface {
	private presentedResult: readonly Cafe[] | undefined;

	/**
	 * Garde les cafés reçus.
	 */
	public present(result: readonly Cafe[]): void {
		this.presentedResult = result;
	}

	/**
	 * Renvoie les cafés reçus, ou undefined si rien n'a été présenté.
	 */
	public result(): readonly Cafe[] | undefined {
		return this.presentedResult;
	}
}
