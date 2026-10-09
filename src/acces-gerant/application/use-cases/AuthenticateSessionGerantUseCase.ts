import { SessionGerantRepositoryInterface } from "@acces-gerant/application/ports/SessionGerantRepositoryInterface";
import { AuthenticateSessionGerantDTO } from "@acces-gerant/application/use-cases/AuthenticateSessionGerantDTO";
import { InvalidSessionError } from "@acces-gerant/domain/InvalidSessionError";
import { ClockInterface } from "@shared/ports/ClockInterface";

/**
 * Vérifie qu'un jeton correspond à une session du gérant encore valide.
 * Sans presenter : appelé par le guard global, qui n'a aucune réponse à construire (dérogation (2) de l'ADR 0001).
 */
export class AuthenticateSessionGerantUseCase {
	/**
	 * Reçoit les sessions enregistrées et l'horloge.
	 */
	public constructor(
		private readonly sessionGerantRepository: SessionGerantRepositoryInterface,
		private readonly clock: ClockInterface
	) {}

	/**
	 * Termine sans rien renvoyer si la session existe et n'est pas expirée ; lève InvalidSessionError sinon.
	 */
	public async execute(dto: AuthenticateSessionGerantDTO): Promise<void> {
		const session = await this.sessionGerantRepository.findByToken(dto.token);

		if (session === undefined || session.isExpiredAt(this.clock.now())) {
			throw new InvalidSessionError();
		}
	}
}
