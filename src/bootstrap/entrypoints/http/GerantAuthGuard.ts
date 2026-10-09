import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthenticateSessionGerantDTO } from "@acces-gerant/application/use-cases/AuthenticateSessionGerantDTO";
import { AuthenticateSessionGerantUseCase } from "@acces-gerant/application/use-cases/AuthenticateSessionGerantUseCase";
import { publicRoute } from "@acces-gerant/presentation/http/controllers/publicRoute";

/**
 * Guard global : refuse toute route sans session gérant valide, sauf les routes marquées publicRoute (SECURITY-R12).
 * Le jeton est lu dans l'en-tête « Authorization: Bearer <jeton> ».
 */
export class GerantAuthGuard implements CanActivate {
	private static readonly BEARER_PREFIX = "Bearer ";

	/**
	 * Reçoit le lecteur de métadonnées de Nest et le use case d'authentification.
	 */
	public constructor(
		private readonly reflector: Reflector,
		private readonly authenticateSessionGerant: AuthenticateSessionGerantUseCase
	) {}

	/**
	 * Laisse passer une route publique ; sinon fait valider le jeton par le use case,
	 * qui lève InvalidSessionError (traduite en 401) en cas de refus.
	 */
	public async canActivate(context: ExecutionContext): Promise<boolean> {
		if (this.isPublicRoute(context)) {
			return true;
		}

		const token = this.readBearerToken(context.switchToHttp().getRequest<unknown>());
		await this.authenticateSessionGerant.execute(new AuthenticateSessionGerantDTO(token));

		return true;
	}

	/**
	 * Indique si la route ou son controller porte le décorateur publicRoute.
	 */
	private isPublicRoute(context: ExecutionContext): boolean {
		return this.reflector.getAllAndOverride(publicRoute, [context.getHandler(), context.getClass()]) === true;
	}

	/**
	 * Extrait le jeton de l'en-tête Authorization d'une requête non fiable ; renvoie une chaîne vide
	 * s'il est absent ou mal formé, ce que le use case refuse comme un jeton inconnu.
	 */
	private readBearerToken(request: unknown): string {
		const authorization = this.readAuthorizationHeader(request);

		if (authorization === undefined || !authorization.startsWith(GerantAuthGuard.BEARER_PREFIX)) {
			return "";
		}

		return authorization.slice(GerantAuthGuard.BEARER_PREFIX.length).trim();
	}

	/**
	 * Lit l'en-tête Authorization s'il est présent sous forme de texte.
	 */
	private readAuthorizationHeader(request: unknown): string | undefined {
		if (typeof request !== "object" || request === null || !("headers" in request)) {
			return undefined;
		}

		const headers = request.headers;

		if (typeof headers !== "object" || headers === null || !("authorization" in headers) || typeof headers.authorization !== "string") {
			return undefined;
		}

		return headers.authorization;
	}
}
