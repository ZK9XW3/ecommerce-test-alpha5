/**
 * Session ouverte par le gérant après une connexion acceptée : un jeton et sa date d'expiration.
 */
export class SessionGerant {
	/**
	 * Crée une session portant ce jeton, valable jusqu'à la date d'expiration.
	 */
	public constructor(
		public readonly token: string,
		public readonly expiresAt: Date
	) {}
}
