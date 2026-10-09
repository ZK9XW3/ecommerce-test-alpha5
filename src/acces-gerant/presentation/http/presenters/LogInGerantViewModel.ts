/**
 * Réponse HTTP d'une connexion acceptée, prête à afficher : le jeton et sa date d'expiration lisible.
 */
export class LogInGerantViewModel {
	/**
	 * Regroupe le jeton et la date d'expiration déjà mise en forme (ex. « 09/10/2026 18:00 »).
	 */
	public constructor(
		public readonly token: string,
		public readonly expiresAt: string
	) {}
}
