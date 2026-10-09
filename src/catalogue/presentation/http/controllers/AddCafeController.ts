import { Body, Controller, Post } from "@nestjs/common";
import { AddCafeDTO } from "@catalogue/application/use-cases/AddCafeDTO";
import { AddCafeUseCase } from "@catalogue/application/use-cases/AddCafeUseCase";
import { AddCafePresenter } from "@catalogue/presentation/http/presenters/AddCafePresenter";
import { AddCafeViewModel } from "@catalogue/presentation/http/presenters/AddCafeViewModel";
import { AddCafeRequest } from "@catalogue/presentation/http/requetes/AddCafeRequest";

/**
 * POST /gerant/cafes (gérant connecté) : ajoute un café au catalogue et renvoie le café enregistré.
 */
@Controller("gerant/cafes")
export class AddCafeController {
	/**
	 * Reçoit le use case d'ajout, câblé par AppModule.
	 */
	public constructor(private readonly addCafe: AddCafeUseCase) {}

	/**
	 * Transmet les informations et les prix du café au use case, puis renvoie le ViewModel du presenter.
	 */
	@Post()
	public async add(@Body() request: AddCafeRequest): Promise<AddCafeViewModel> {
		const presenter = new AddCafePresenter();
		await this.addCafe.execute(new AddCafeDTO(request), presenter);

		return presenter.viewModel();
	}
}
