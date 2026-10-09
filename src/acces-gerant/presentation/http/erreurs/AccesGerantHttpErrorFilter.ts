import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { InvalidCredentialsError } from "@acces-gerant/domain/InvalidCredentialsError";
import { InvalidSessionError } from "@acces-gerant/domain/InvalidSessionError";

/**
 * Traduit les refus d'accès du gérant en réponse HTTP 401, avec le message de l'erreur métier.
 */
@Catch(InvalidCredentialsError, InvalidSessionError)
export class AccesGerantHttpErrorFilter implements ExceptionFilter {
	/**
	 * Reçoit l'adaptateur HTTP de Nest pour écrire la réponse.
	 */
	public constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	/**
	 * Répond 401 avec le message de l'erreur, identique quelle que soit la donnée fausse ou la raison du refus de session.
	 */
	public catch(error: InvalidCredentialsError | InvalidSessionError, host: ArgumentsHost): void {
		const body = { statusCode: HttpStatus.UNAUTHORIZED, message: error.message };
		this.httpAdapterHost.httpAdapter.reply(host.switchToHttp().getResponse<unknown>(), body, HttpStatus.UNAUTHORIZED);
	}
}
