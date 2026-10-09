import { SessionGerant } from "@acces-gerant/domain/SessionGerant";

/**
 * Output port de la connexion du gérant (approche B) : reçoit la session ouverte par une connexion acceptée.
 */
export interface LogInGerantPresenterInterface {
	/**
	 * Reçoit la session ouverte pour le mettre en forme.
	 */
	present(result: SessionGerant): void;
}
