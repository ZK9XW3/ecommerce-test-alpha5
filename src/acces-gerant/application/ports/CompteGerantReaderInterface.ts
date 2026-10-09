/**
 * Port de lecture du compte gérant unique : son e-mail et l'empreinte de son mot de passe.
 */
export interface CompteGerantReaderInterface {
	/**
	 * Renvoie l'e-mail du compte gérant.
	 */
	readEmail(): string;

	/**
	 * Renvoie l'empreinte du mot de passe du compte gérant, jamais le mot de passe en clair.
	 */
	readPasswordHash(): string;
}
