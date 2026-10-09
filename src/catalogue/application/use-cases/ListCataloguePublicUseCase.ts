import { CafeRepositoryInterface } from "@catalogue/application/ports/CafeRepositoryInterface";
import { ListCataloguePublicPresenterInterface } from "@catalogue/application/ports/ListCataloguePublicPresenterInterface";

/**
 * Liste le catalogue public : les cafés proposés aux visiteurs, sans connexion.
 */
export class ListCataloguePublicUseCase {
	/**
	 * Reçoit les cafés enregistrés.
	 */
	public constructor(private readonly cafeRepository: CafeRepositoryInterface) {}

	/**
	 * Transmet les cafés du catalogue au presenter.
	 */
	public async execute(presenter: ListCataloguePublicPresenterInterface): Promise<void> {
		presenter.present(await this.cafeRepository.findAll());
	}
}
