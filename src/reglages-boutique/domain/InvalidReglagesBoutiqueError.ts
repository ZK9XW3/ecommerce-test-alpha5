/**
 * Réglage de la boutique refusé parce qu'il enfreint une règle métier ; le message dit laquelle.
 */
export class InvalidReglagesBoutiqueError extends Error {
	/**
	 * Crée l'erreur avec le message de la règle enfreinte.
	 */
	public constructor(message: string) {
		super(message);
		this.name = "InvalidReglagesBoutiqueError";
	}
}
