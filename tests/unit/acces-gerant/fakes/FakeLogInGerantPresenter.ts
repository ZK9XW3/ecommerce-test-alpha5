import { LogInGerantPresenterInterface } from "@acces-gerant/application/ports/LogInGerantPresenterInterface";
import { SessionGerant } from "@acces-gerant/domain/SessionGerant";

/**
 * Presenter de test : garde le résultat reçu pour que le test l'observe.
 */
export class FakeLogInGerantPresenter implements LogInGerantPresenterInterface {
	private presentedResult: SessionGerant | undefined;

	/**
	 * Garde le résultat reçu.
	 */
	public present(result: SessionGerant): void {
		this.presentedResult = result;
	}

	/**
	 * Renvoie le résultat reçu, ou undefined si aucun résultat n'a été présenté.
	 */
	public result(): SessionGerant | undefined {
		return this.presentedResult;
	}
}
