import { SessionGerant } from "@acces-gerant/domain/SessionGerant";

/**
 * Port d'enregistrement et de recherche des sessions du gérant.
 */
export interface SessionGerantRepositoryInterface {
	/**
	 * Enregistre une session.
	 */
	save(session: SessionGerant): Promise<void>;

	/**
	 * Retrouve la session portant ce jeton, ou undefined si aucune ne le porte.
	 */
	findByToken(token: string): Promise<SessionGerant | undefined>;
}
