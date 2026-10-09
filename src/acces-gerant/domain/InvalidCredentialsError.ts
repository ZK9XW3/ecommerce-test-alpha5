/**
 * Connexion refusée : e-mail ou mot de passe faux, avec le même message dans les deux cas
 * pour ne pas révéler lequel des deux est faux.
 */
export class InvalidCredentialsError extends Error {
	private static readonly MESSAGE = "E-mail ou mot de passe incorrect.";

	/**
	 * Crée l'erreur avec son message unique.
	 */
	public constructor() {
		super(InvalidCredentialsError.MESSAGE);
		this.name = "InvalidCredentialsError";
	}
}
