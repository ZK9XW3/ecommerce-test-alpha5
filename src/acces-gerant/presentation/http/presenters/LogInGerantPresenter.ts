import { LogInGerantPresenterInterface } from "@acces-gerant/application/ports/LogInGerantPresenterInterface";
import { SessionGerant } from "@acces-gerant/domain/SessionGerant";
import { LogInGerantViewModel } from "@acces-gerant/presentation/http/presenters/LogInGerantViewModel";

/**
 * Met en forme le résultat d'une connexion acceptée pour la réponse HTTP.
 * Créé par le controller à chaque requête, jamais injecté (approche B).
 */
export class LogInGerantPresenter implements LogInGerantPresenterInterface {
	private static readonly DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
		timeZone: "Europe/Paris",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});

	private presentedViewModel: LogInGerantViewModel | undefined;

	/**
	 * Construit le ViewModel : jeton inchangé, date d'expiration à l'heure de Paris au format « jj/mm/aaaa hh:mm ».
	 */
	public present(result: SessionGerant): void {
		this.presentedViewModel = new LogInGerantViewModel(result.token, LogInGerantPresenter.DATE_FORMAT.format(result.expiresAt));
	}

	/**
	 * Renvoie le ViewModel construit ; échoue si le use case n'a rien présenté, ce qui serait un défaut de code.
	 */
	public viewModel(): LogInGerantViewModel {
		if (this.presentedViewModel === undefined) {
			throw new Error("LogInGerantPresenter : viewModel() appelé avant present().");
		}

		return this.presentedViewModel;
	}
}
