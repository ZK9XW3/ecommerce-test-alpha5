import { LogInGerantPresenterInterface } from "@acces-gerant/application/ports/LogInGerantPresenterInterface";
import { LogInGerantResult } from "@acces-gerant/application/use-cases/LogInGerantResult";

/**
 * Presenter de test : garde le résultat reçu pour que le test l'observe.
 */
export class FakeLogInGerantPresenter implements LogInGerantPresenterInterface {
	private presentedResult: LogInGerantResult | undefined;

	/**
	 * Garde le résultat reçu.
	 */
	public present(result: LogInGerantResult): void {
		this.presentedResult = result;
	}

	/**
	 * Renvoie le résultat reçu, ou undefined si aucun résultat n'a été présenté.
	 */
	public result(): LogInGerantResult | undefined {
		return this.presentedResult;
	}
}
