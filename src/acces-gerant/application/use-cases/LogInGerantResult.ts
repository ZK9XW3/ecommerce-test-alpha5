/**
 * Sortie d'une connexion acceptée : le jeton qui prouve la connexion et sa date d'expiration.
 */
export class LogInGerantResult {
	/**
	 * Regroupe le jeton et sa date d'expiration.
	 */
	public constructor(
		public readonly token: string,
		public readonly expiresAt: Date
	) {}
}
