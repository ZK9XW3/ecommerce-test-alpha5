/**
 * Port qui compare un mot de passe en clair à une empreinte.
 */
export interface PasswordVerifierInterface {
	/**
	 * Indique si le mot de passe correspond à l'empreinte.
	 */
	verify(password: string, passwordHash: string): Promise<boolean>;
}
