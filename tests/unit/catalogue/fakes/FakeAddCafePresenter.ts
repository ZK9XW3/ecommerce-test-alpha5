import { AddCafePresenterInterface } from "@catalogue/application/ports/AddCafePresenterInterface";
import { Cafe } from "@catalogue/domain/cafe/Cafe";

/**
 * Presenter de test : garde le café ajouté reçu pour que le test l'observe.
 */
export class FakeAddCafePresenter implements AddCafePresenterInterface {
	private presentedResult: Cafe | undefined;

	/**
	 * Garde le café reçu.
	 */
	public present(result: Cafe): void {
		this.presentedResult = result;
	}

	/**
	 * Renvoie le café reçu, ou undefined si rien n'a été présenté.
	 */
	public result(): Cafe | undefined {
		return this.presentedResult;
	}
}
