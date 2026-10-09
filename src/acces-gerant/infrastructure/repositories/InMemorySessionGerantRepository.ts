import { SessionGerantRepositoryInterface } from "@acces-gerant/application/ports/SessionGerantRepositoryInterface";
import { SessionGerant } from "@acces-gerant/domain/SessionGerant";

/**
 * Sessions du gérant gardées en mémoire du serveur : elles sont perdues au redémarrage (ADR 0001).
 */
export class InMemorySessionGerantRepository implements SessionGerantRepositoryInterface {
	private readonly sessionsByToken = new Map<string, SessionGerant>();

	/**
	 * Enregistre la session, rangée par son jeton.
	 */
	public async save(session: SessionGerant): Promise<void> {
		this.sessionsByToken.set(session.token, session);
	}

	/**
	 * Retrouve la session portant ce jeton.
	 */
	public async findByToken(token: string): Promise<SessionGerant | undefined> {
		return this.sessionsByToken.get(token);
	}
}
