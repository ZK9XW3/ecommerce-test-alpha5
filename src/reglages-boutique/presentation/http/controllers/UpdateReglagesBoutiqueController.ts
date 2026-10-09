import { Body, Controller, Put } from "@nestjs/common";
import { UpdateReglagesBoutiqueDTO } from "@reglages-boutique/application/use-cases/UpdateReglagesBoutiqueDTO";
import { UpdateReglagesBoutiqueUseCase } from "@reglages-boutique/application/use-cases/UpdateReglagesBoutiqueUseCase";
import { UpdateReglagesBoutiquePresenter } from "@reglages-boutique/presentation/http/presenters/UpdateReglagesBoutiquePresenter";
import { UpdateReglagesBoutiqueViewModel } from "@reglages-boutique/presentation/http/presenters/UpdateReglagesBoutiqueViewModel";
import { UpdateReglagesBoutiqueRequest } from "@reglages-boutique/presentation/http/requetes/UpdateReglagesBoutiqueRequest";

/**
 * PUT /gerant/settings (gérant connecté) : remplace d'un bloc les réglages de la boutique et renvoie ceux enregistrés.
 */
@Controller("gerant/settings")
export class UpdateReglagesBoutiqueController {
	/**
	 * Reçoit le use case de réglage, câblé par AppModule.
	 */
	public constructor(private readonly updateReglagesBoutique: UpdateReglagesBoutiqueUseCase) {}

	/**
	 * Transmet les trois réglages au use case, puis renvoie le ViewModel du presenter.
	 */
	@Put()
	public async update(@Body() request: UpdateReglagesBoutiqueRequest): Promise<UpdateReglagesBoutiqueViewModel> {
		const presenter = new UpdateReglagesBoutiquePresenter();
		await this.updateReglagesBoutique.execute(new UpdateReglagesBoutiqueDTO(request), presenter);

		return presenter.viewModel();
	}
}
