/**
 * Accès refusé : jeton de session absent, inconnu ou expiré ; le gérant doit se reconnecter.
 */
export class InvalidSessionError extends Error {
	private static readonly MESSAGE = "Connexion absente ou expirée : reconnectez-vous.";

	/**
	 * Crée l'erreur avec son message unique.
	 */
	public constructor() {
		super(InvalidSessionError.MESSAGE);
		this.name = "InvalidSessionError";
	}
}
