import { UpdateReglagesBoutiquePresenterInterface } from "@reglages-boutique/application/ports/UpdateReglagesBoutiquePresenterInterface";
import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";
import { UpdateReglagesBoutiqueViewModel } from "@reglages-boutique/presentation/http/presenters/UpdateReglagesBoutiqueViewModel";

/**
 * Met en forme les réglages enregistrés pour la réponse HTTP.
 * Créé par le controller à chaque requête, jamais injecté (approche B).
 */
export class UpdateReglagesBoutiquePresenter implements UpdateReglagesBoutiquePresenterInterface {
	private static readonly GRAMMES_PAR_KG = 1000;
	private static readonly CENTIMES_PAR_EURO = 100;
	private static readonly KILOGRAMMES_FORMAT = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
	private static readonly EUROS_FORMAT = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	private presentedViewModel: UpdateReglagesBoutiqueViewModel | undefined;

	/**
	 * Construit le ViewModel : seuil en kg au gramme près (« 2,000 kg »), adresse inchangée, frais en euros (« 4,90 € »).
	 */
	public present(result: ReglagesBoutique): void {
		this.presentedViewModel = new UpdateReglagesBoutiqueViewModel(
			this.formatKilogrammes(result.seuilStockBas.grammes),
			result.adresseAlerte.value,
			this.formatEuros(result.fraisLivraison.centimes)
		);
	}

	/**
	 * Renvoie le ViewModel construit ; échoue si le use case n'a rien présenté, ce qui serait un défaut de code.
	 */
	public viewModel(): UpdateReglagesBoutiqueViewModel {
		if (this.presentedViewModel === undefined) {
			throw new Error("UpdateReglagesBoutiquePresenter : viewModel() appelé avant present().");
		}

		return this.presentedViewModel;
	}

	/**
	 * Met un poids en grammes sous la forme « 2,000 kg ».
	 */
	private formatKilogrammes(grammes: number): string {
		return `${UpdateReglagesBoutiquePresenter.KILOGRAMMES_FORMAT.format(grammes / UpdateReglagesBoutiquePresenter.GRAMMES_PAR_KG)} kg`;
	}

	/**
	 * Met un montant en centimes sous la forme « 4,90 € ».
	 */
	private formatEuros(centimes: number): string {
		return `${UpdateReglagesBoutiquePresenter.EUROS_FORMAT.format(centimes / UpdateReglagesBoutiquePresenter.CENTIMES_PAR_EURO)} €`;
	}
}
