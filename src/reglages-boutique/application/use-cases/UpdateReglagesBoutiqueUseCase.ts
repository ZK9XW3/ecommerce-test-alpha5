import { ReglagesBoutiqueRepositoryInterface } from "@reglages-boutique/application/ports/ReglagesBoutiqueRepositoryInterface";
import { UpdateReglagesBoutiquePresenterInterface } from "@reglages-boutique/application/ports/UpdateReglagesBoutiquePresenterInterface";
import { UpdateReglagesBoutiqueDTO } from "@reglages-boutique/application/use-cases/UpdateReglagesBoutiqueDTO";
import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";

/**
 * Règle la boutique : remplace d'un bloc le seuil de stock bas, l'adresse d'alerte et les frais de livraison.
 */
export class UpdateReglagesBoutiqueUseCase {
	/**
	 * Reçoit les réglages enregistrés.
	 */
	public constructor(private readonly reglagesBoutiqueRepository: ReglagesBoutiqueRepositoryInterface) {}

	/**
	 * Enregistre les nouveaux réglages puis les transmet au presenter. Lève InvalidReglagesBoutiqueError
	 * si une valeur est refusée : rien n'est alors enregistré et les trois réglages actuels restent inchangés.
	 */
	public async execute(dto: UpdateReglagesBoutiqueDTO, presenter: UpdateReglagesBoutiquePresenterInterface): Promise<void> {
		const reglages = ReglagesBoutique.fromFields(dto);
		await this.reglagesBoutiqueRepository.save(reglages);
		presenter.present(reglages);
	}
}
