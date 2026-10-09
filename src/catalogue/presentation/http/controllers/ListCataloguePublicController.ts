import { Controller, Get } from "@nestjs/common";
import { ListCataloguePublicUseCase } from "@catalogue/application/use-cases/ListCataloguePublicUseCase";
import { publicRoute } from "@catalogue/presentation/http/controllers/publicRoute";
import { ListCataloguePublicPresenter } from "@catalogue/presentation/http/presenters/ListCataloguePublicPresenter";
import { ListCataloguePublicViewModel } from "@catalogue/presentation/http/presenters/ListCataloguePublicViewModel";

/**
 * GET /catalogue (route publique) : renvoie le catalogue des cafés proposés aux visiteurs.
 */
@Controller("catalogue")
export class ListCataloguePublicController {
	/**
	 * Reçoit le use case du catalogue public, câblé par AppModule.
	 */
	public constructor(private readonly listCataloguePublic: ListCataloguePublicUseCase) {}

	/**
	 * Fait lister le catalogue par le use case, puis renvoie le ViewModel du presenter.
	 */
	@publicRoute()
	@Get()
	public async list(): Promise<ListCataloguePublicViewModel> {
		const presenter = new ListCataloguePublicPresenter();
		await this.listCataloguePublic.execute(presenter);

		return presenter.viewModel();
	}
}
