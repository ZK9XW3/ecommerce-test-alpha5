import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { InvalidReglagesBoutiqueError } from "@reglages-boutique/domain/InvalidReglagesBoutiqueError";

/**
 * Traduit un réglage refusé par une règle métier en réponse HTTP 422, avec le message de la règle enfreinte.
 */
@Catch(InvalidReglagesBoutiqueError)
export class ReglagesBoutiqueHttpErrorFilter implements ExceptionFilter {
	/**
	 * Reçoit l'adaptateur HTTP de Nest pour écrire la réponse.
	 */
	public constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	/**
	 * Répond 422 avec le message de l'erreur.
	 */
	public catch(error: InvalidReglagesBoutiqueError, host: ArgumentsHost): void {
		const body = { statusCode: HttpStatus.UNPROCESSABLE_ENTITY, message: error.message };
		this.httpAdapterHost.httpAdapter.reply(host.switchToHttp().getResponse<unknown>(), body, HttpStatus.UNPROCESSABLE_ENTITY);
	}
}
