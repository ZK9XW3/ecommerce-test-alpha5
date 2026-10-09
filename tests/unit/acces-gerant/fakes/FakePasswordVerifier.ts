import { PasswordVerifierInterface } from "@acces-gerant/application/ports/PasswordVerifierInterface";

/**
 * Vérificateur de mot de passe pour les tests : l'empreinte de « secret » est « empreinte(secret) ».
 */
export class FakePasswordVerifier implements PasswordVerifierInterface {
	/**
	 * Indique si l'empreinte est celle du mot de passe selon la convention du fake.
	 */
	public async verify(password: string, passwordHash: string): Promise<boolean> {
		return passwordHash === `empreinte(${password})`;
	}
}
