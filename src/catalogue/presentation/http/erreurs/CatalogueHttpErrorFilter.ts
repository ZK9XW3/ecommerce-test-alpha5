import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { InvalidCafeError } from "@catalogue/domain/cafe/InvalidCafeError";

/**
 * Traduit un café refusé par une règle métier en réponse HTTP 422, avec le message qui nomme l'information manquante.
 */
@Catch(InvalidCafeError)
export class CatalogueHttpErrorFilter implements ExceptionFilter {
	/**
	 * Reçoit l'adaptateur HTTP de Nest pour écrire la réponse.
	 */
	public constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	/**
	 * Répond 422 avec le message de l'erreur.
	 */
	public catch(error: InvalidCafeError, host: ArgumentsHost): void {
		const body = { statusCode: HttpStatus.UNPROCESSABLE_ENTITY, message: error.message };
		this.httpAdapterHost.httpAdapter.reply(host.switchToHttp().getResponse<unknown>(), body, HttpStatus.UNPROCESSABLE_ENTITY);
	}
}
