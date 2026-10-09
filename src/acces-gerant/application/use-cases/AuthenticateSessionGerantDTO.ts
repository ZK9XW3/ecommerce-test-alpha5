/**
 * Entrée de l'authentification d'une requête gérant : le jeton de session reçu.
 */
export class AuthenticateSessionGerantDTO {
	/**
	 * Porte le jeton reçu.
	 */
	public constructor(public readonly token: string) {}
}
