import { LogInGerantResult } from "@acces-gerant/application/use-cases/LogInGerantResult";

/**
 * Output port de la connexion du gérant (approche B) : reçoit le résultat d'une connexion acceptée.
 */
export interface LogInGerantPresenterInterface {
	/**
	 * Reçoit le résultat de la connexion pour le mettre en forme.
	 */
	present(result: LogInGerantResult): void;
}
