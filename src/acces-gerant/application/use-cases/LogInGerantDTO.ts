/**
 * Entrée de la connexion du gérant : l'e-mail et le mot de passe saisis.
 */
export class LogInGerantDTO {
	/**
	 * Regroupe l'e-mail et le mot de passe saisis.
	 */
	public constructor(
		public readonly email: string,
		public readonly password: string
	) {}
}
