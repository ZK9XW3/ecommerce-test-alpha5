import { GetReglagesBoutiquePresenterInterface } from "@reglages-boutique/application/ports/GetReglagesBoutiquePresenterInterface";
import { ReglagesBoutiqueRepositoryInterface } from "@reglages-boutique/application/ports/ReglagesBoutiqueRepositoryInterface";

/**
 * Consulte les réglages actuels de la boutique : seuil de stock bas, adresse d'alerte et frais de livraison.
 */
export class GetReglagesBoutiqueUseCase {
	/**
	 * Reçoit les réglages enregistrés.
	 */
	public constructor(private readonly reglagesBoutiqueRepository: ReglagesBoutiqueRepositoryInterface) {}

	/**
	 * Transmet les réglages actuels au presenter.
	 */
	public async execute(presenter: GetReglagesBoutiquePresenterInterface): Promise<void> {
		presenter.present(await this.reglagesBoutiqueRepository.get());
	}
}
