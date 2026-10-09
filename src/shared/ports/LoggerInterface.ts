/**
 * Port transverse de journalisation. Ne jamais y écrire de donnée sensible en clair (SECURITY-R06).
 */
export interface LoggerInterface {
	/**
	 * Journalise une erreur avec sa cause technique.
	 */
	error(message: string, cause: unknown): void;
}
