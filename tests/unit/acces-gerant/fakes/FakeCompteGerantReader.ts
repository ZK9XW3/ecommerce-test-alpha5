import { CompteGerantReaderInterface } from "@acces-gerant/application/ports/CompteGerantReaderInterface";

/**
 * Compte gérant en mémoire pour les tests.
 */
export class FakeCompteGerantReader implements CompteGerantReaderInterface {
	/**
	 * Mémorise l'e-mail et l'empreinte du compte.
	 */
	public constructor(
		private readonly email: string,
		private readonly passwordHash: string
	) {}

	/**
	 * Renvoie l'e-mail du compte.
	 */
	public readEmail(): string {
		return this.email;
	}

	/**
	 * Renvoie l'empreinte du mot de passe du compte.
	 */
	public readPasswordHash(): string {
		return this.passwordHash;
	}
}
