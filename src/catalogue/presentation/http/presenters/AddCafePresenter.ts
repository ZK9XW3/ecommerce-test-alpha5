import { AddCafePresenterInterface } from "@catalogue/application/ports/AddCafePresenterInterface";
import { Cafe } from "@catalogue/domain/cafe/Cafe";
import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";
import { PrixParFormat } from "@catalogue/domain/cafe/PrixParFormat";
import { AddCafeViewModel } from "@catalogue/presentation/http/presenters/AddCafeViewModel";
import { PrixFormatViewModel } from "@catalogue/presentation/http/presenters/PrixFormatViewModel";

/**
 * Met en forme le café ajouté pour la réponse HTTP.
 * Créé par le controller à chaque requête, jamais injecté (approche B).
 */
export class AddCafePresenter implements AddCafePresenterInterface {
	private static readonly CENTIMES_PAR_EURO = 100;
	private static readonly EUROS_FORMAT = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	private presentedViewModel: AddCafeViewModel | undefined;

	/**
	 * Construit le ViewModel : identifiant et textes inchangés, prix de chaque format en euros (« 9,00 € »).
	 */
	public present(result: Cafe): void {
		this.presentedViewModel = new AddCafeViewModel({
			id: result.id,
			nom: result.nom,
			origine: result.origine,
			description: result.description,
			prix: this.formatPrix(result.prix)
		});
	}

	/**
	 * Renvoie le ViewModel construit ; échoue si le use case n'a rien présenté, ce qui serait un défaut de code.
	 */
	public viewModel(): AddCafeViewModel {
		if (this.presentedViewModel === undefined) {
			throw new Error("AddCafePresenter : viewModel() appelé avant present().");
		}

		return this.presentedViewModel;
	}

	/**
	 * Met le prix de chacun des trois formats sous la forme { format: « 250 g », prix: « 9,00 € » }.
	 */
	private formatPrix(prix: PrixParFormat): PrixFormatViewModel[] {
		return Object.values(FormatCafe).map((format) => {
			return new PrixFormatViewModel(format, this.formatEuros(prix.prixPour(format).centimes));
		});
	}

	/**
	 * Met un montant en centimes sous la forme « 9,00 € ».
	 */
	private formatEuros(centimes: number): string {
		return `${AddCafePresenter.EUROS_FORMAT.format(centimes / AddCafePresenter.CENTIMES_PAR_EURO)} €`;
	}
}
