import { Body, Controller, Post } from "@nestjs/common";
import { LogInGerantDTO } from "@acces-gerant/application/use-cases/LogInGerantDTO";
import { LogInGerantUseCase } from "@acces-gerant/application/use-cases/LogInGerantUseCase";
import { LogInGerantPresenter } from "@acces-gerant/presentation/http/presenters/LogInGerantPresenter";
import { LogInGerantViewModel } from "@acces-gerant/presentation/http/presenters/LogInGerantViewModel";
import { LogInGerantRequest } from "@acces-gerant/presentation/http/requetes/LogInGerantRequest";

/**
 * POST /gerant/session : connecte le gérant et renvoie son jeton de session.
 */
@Controller("gerant/session")
export class LogInGerantController {
	/**
	 * Reçoit le use case de connexion, câblé par AppModule.
	 */
	public constructor(private readonly logInGerant: LogInGerantUseCase) {}

	/**
	 * Transmet l'e-mail et le mot de passe au use case, puis renvoie le ViewModel du presenter.
	 */
	@Post()
	public async logIn(@Body() request: LogInGerantRequest): Promise<LogInGerantViewModel> {
		const presenter = new LogInGerantPresenter();
		await this.logInGerant.execute(new LogInGerantDTO(request.email, request.password), presenter);

		return presenter.viewModel();
	}
}
