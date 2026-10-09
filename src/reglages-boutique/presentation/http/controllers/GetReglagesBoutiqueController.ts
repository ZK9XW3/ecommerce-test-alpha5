import { Controller, Get } from "@nestjs/common";
import { GetReglagesBoutiqueUseCase } from "@reglages-boutique/application/use-cases/GetReglagesBoutiqueUseCase";
import { GetReglagesBoutiquePresenter } from "@reglages-boutique/presentation/http/presenters/GetReglagesBoutiquePresenter";
import { GetReglagesBoutiqueViewModel } from "@reglages-boutique/presentation/http/presenters/GetReglagesBoutiqueViewModel";

/**
 * GET /gerant/settings (gérant connecté) : renvoie les réglages actuels de la boutique.
 */
@Controller("gerant/settings")
export class GetReglagesBoutiqueController {
	/**
	 * Reçoit le use case de consultation, câblé par AppModule.
	 */
	public constructor(private readonly getReglagesBoutique: GetReglagesBoutiqueUseCase) {}

	/**
	 * Fait consulter les réglages par le use case, puis renvoie le ViewModel du presenter.
	 */
	@Get()
	public async show(): Promise<GetReglagesBoutiqueViewModel> {
		const presenter = new GetReglagesBoutiquePresenter();
		await this.getReglagesBoutique.execute(presenter);

		return presenter.viewModel();
	}
}
