/**
 * Café refusé parce qu'il enfreint une règle métier ; le message dit quelle information manque ou est invalide.
 */
export class InvalidCafeError extends Error {
	/**
	 * Crée l'erreur avec le message de la règle enfreinte.
	 */
	public constructor(message: string) {
		super(message);
		this.name = "InvalidCafeError";
	}
}
