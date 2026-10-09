import { CompteGerantReaderInterface } from "@acces-gerant/application/ports/CompteGerantReaderInterface";

/**
 * Compte gérant unique fourni par la configuration de l'application (bootstrap/configuration).
 */
export class ConfiguredCompteGerantReader implements CompteGerantReaderInterface {
	/**
	 * Reçoit l'e-mail et l'empreinte du mot de passe lus dans la configuration.
	 */
	public constructor(
		private readonly email: string,
		private readonly passwordHash: string
	) {}

	/**
	 * Renvoie l'e-mail configuré.
	 */
	public readEmail(): string {
		return this.email;
	}

	/**
	 * Renvoie l'empreinte configurée.
	 */
	public readPasswordHash(): string {
		return this.passwordHash;
	}
}
