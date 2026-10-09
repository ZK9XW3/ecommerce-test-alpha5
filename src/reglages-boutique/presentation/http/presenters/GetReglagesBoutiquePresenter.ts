import { GetReglagesBoutiquePresenterInterface } from "@reglages-boutique/application/ports/GetReglagesBoutiquePresenterInterface";
import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";
import { GetReglagesBoutiqueViewModel } from "@reglages-boutique/presentation/http/presenters/GetReglagesBoutiqueViewModel";

/**
 * Met en forme les réglages actuels pour la réponse HTTP.
 * Créé par le controller à chaque requête, jamais injecté (approche B).
 */
export class GetReglagesBoutiquePresenter implements GetReglagesBoutiquePresenterInterface {
	private static readonly GRAMMES_PAR_KG = 1000;
	private static readonly CENTIMES_PAR_EURO = 100;
	private static readonly KILOGRAMMES_FORMAT = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
	private static readonly EUROS_FORMAT = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	private presentedViewModel: GetReglagesBoutiqueViewModel | undefined;

	/**
	 * Construit le ViewModel : seuil en kg au gramme près (« 2,000 kg »), adresse inchangée, frais en euros (« 4,90 € »).
	 */
	public present(result: ReglagesBoutique): void {
		this.presentedViewModel = new GetReglagesBoutiqueViewModel(
			`${GetReglagesBoutiquePresenter.KILOGRAMMES_FORMAT.format(result.seuilStockBas.grammes / GetReglagesBoutiquePresenter.GRAMMES_PAR_KG)} kg`,
			result.adresseAlerte.value,
			`${GetReglagesBoutiquePresenter.EUROS_FORMAT.format(result.fraisLivraison.centimes / GetReglagesBoutiquePresenter.CENTIMES_PAR_EURO)} €`
		);
	}

	/**
	 * Renvoie le ViewModel construit ; échoue si le use case n'a rien présenté, ce qui serait un défaut de code.
	 */
	public viewModel(): GetReglagesBoutiqueViewModel {
		if (this.presentedViewModel === undefined) {
			throw new Error("GetReglagesBoutiquePresenter : viewModel() appelé avant present().");
		}

		return this.presentedViewModel;
	}
}
