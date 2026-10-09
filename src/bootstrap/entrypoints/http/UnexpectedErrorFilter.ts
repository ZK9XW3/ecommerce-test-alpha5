import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import type { LoggerInterface } from "@shared/ports/LoggerInterface";

/**
 * Filtre global de dernier recours : une erreur HTTP de Nest garde sa réponse ; toute autre erreur
 * devient un 500 générique, son détail étant seulement journalisé côté serveur (SECURITY-R07).
 */
@Catch()
export class UnexpectedErrorFilter implements ExceptionFilter {
	private static readonly GENERIC_MESSAGE = "Erreur interne du serveur.";

	/**
	 * Reçoit l'adaptateur HTTP de Nest et le journal.
	 */
	public constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly logger: LoggerInterface
	) {}

	/**
	 * Répond selon le type d'erreur reçue.
	 */
	public catch(exception: unknown, host: ArgumentsHost): void {
		const response = host.switchToHttp().getResponse<unknown>();

		if (exception instanceof HttpException) {
			this.httpAdapterHost.httpAdapter.reply(response, exception.getResponse(), exception.getStatus());

			return;
		}

		this.logger.error("Erreur inattendue pendant une requête HTTP.", exception);
		const body = { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: UnexpectedErrorFilter.GENERIC_MESSAGE };
		this.httpAdapterHost.httpAdapter.reply(response, body, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
