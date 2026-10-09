import { SessionGerantRepositoryInterface } from "@acces-gerant/application/ports/SessionGerantRepositoryInterface";
import { SessionGerant } from "@acces-gerant/domain/SessionGerant";

/**
 * Sessions du gérant gardées dans une liste, pour les tests.
 */
export class FakeSessionGerantRepository implements SessionGerantRepositoryInterface {
	private readonly sessions: SessionGerant[] = [];

	/**
	 * Ajoute la session à la liste.
	 */
	public async save(session: SessionGerant): Promise<void> {
		this.sessions.push(session);
	}

	/**
	 * Cherche la session portant ce jeton dans la liste.
	 */
	public async findByToken(token: string): Promise<SessionGerant | undefined> {
		return this.sessions.find((session) => {
			return session.token === token;
		});
	}
}
