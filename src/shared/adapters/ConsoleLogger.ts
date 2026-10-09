import { LoggerInterface } from "@shared/ports/LoggerInterface";

/**
 * Journalisation sur la sortie d'erreur de la console.
 */
export class ConsoleLogger implements LoggerInterface {
	/**
	 * Écrit le message et la cause sur la sortie d'erreur.
	 */
	public error(message: string, cause: unknown): void {
		console.error(message, cause);
	}
}
