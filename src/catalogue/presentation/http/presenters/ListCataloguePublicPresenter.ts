import { ListCataloguePublicPresenterInterface } from "@catalogue/application/ports/ListCataloguePublicPresenterInterface";
import { Cafe } from "@catalogue/domain/cafe/Cafe";
import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";
import { PrixParFormat } from "@catalogue/domain/cafe/PrixParFormat";
import { CafeCataloguePublicViewModel } from "@catalogue/presentation/http/presenters/CafeCataloguePublicViewModel";
import { ListCataloguePublicViewModel } from "@catalogue/presentation/http/presenters/ListCataloguePublicViewModel";
import { PrixFormatViewModel } from "@catalogue/presentation/http/presenters/PrixFormatViewModel";

/**
 * Met en forme les cafés du catalogue public pour la réponse HTTP.
 * Créé par le controller à chaque requête, jamais injecté (approche B).
 */
export class ListCataloguePublicPresenter implements ListCataloguePublicPresenterInterface {
	private static readonly CENTIMES_PAR_EURO = 100;
	private static readonly EUROS_FORMAT = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	private presentedViewModel: ListCataloguePublicViewModel | undefined;

	/**
	 * Construit le ViewModel : pour chaque café, textes inchangés et prix de chaque format en euros (« 9,00 € »).
	 */
	public present(result: readonly Cafe[]): void {
		this.presentedViewModel = new ListCataloguePublicViewModel(
			result.map((cafe) => {
				return new CafeCataloguePublicViewModel(cafe.nom, cafe.origine, cafe.description, this.formatPrix(cafe.prix));
			})
		);
	}

	/**
	 * Renvoie le ViewModel construit ; échoue si le use case n'a rien présenté, ce qui serait un défaut de code.
	 */
	public viewModel(): ListCataloguePublicViewModel {
		if (this.presentedViewModel === undefined) {
			throw new Error("ListCataloguePublicPresenter : viewModel() appelé avant present().");
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
		return `${ListCataloguePublicPresenter.EUROS_FORMAT.format(centimes / ListCataloguePublicPresenter.CENTIMES_PAR_EURO)} €`;
	}
}
