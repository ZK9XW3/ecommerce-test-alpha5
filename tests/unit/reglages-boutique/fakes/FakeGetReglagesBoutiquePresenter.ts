import { GetReglagesBoutiquePresenterInterface } from "@reglages-boutique/application/ports/GetReglagesBoutiquePresenterInterface";
import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";

/**
 * Presenter de test : garde les réglages reçus pour que le test les observe.
 */
export class FakeGetReglagesBoutiquePresenter implements GetReglagesBoutiquePresenterInterface {
	private presentedResult: ReglagesBoutique | undefined;

	/**
	 * Garde les réglages reçus.
	 */
	public present(result: ReglagesBoutique): void {
		this.presentedResult = result;
	}

	/**
	 * Renvoie les réglages reçus, ou undefined si rien n'a été présenté.
	 */
	public result(): ReglagesBoutique | undefined {
		return this.presentedResult;
	}
}
