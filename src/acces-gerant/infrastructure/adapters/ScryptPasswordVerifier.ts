import { scrypt, timingSafeEqual } from "node:crypto";
import { PasswordVerifierInterface } from "@acces-gerant/application/ports/PasswordVerifierInterface";

/**
 * Vérifie un mot de passe avec scrypt de Node. L'empreinte a la forme « selHex:cléHex »
 * (commande de production documentée dans le README).
 */
export class ScryptPasswordVerifier implements PasswordVerifierInterface {
	private static readonly SEPARATOR = ":";

	/**
	 * Recalcule la clé scrypt du mot de passe avec le sel de l'empreinte, puis la compare en temps constant.
	 * Une empreinte mal formée ne correspond à aucun mot de passe.
	 */
	public async verify(password: string, passwordHash: string): Promise<boolean> {
		const [saltHex, expectedKeyHex] = passwordHash.split(ScryptPasswordVerifier.SEPARATOR);

		if (saltHex === undefined || expectedKeyHex === undefined || expectedKeyHex.length === 0) {
			return false;
		}

		const expectedKey = Buffer.from(expectedKeyHex, "hex");
		const derivedKey = await this.deriveKey(password, Buffer.from(saltHex, "hex"), expectedKey.length);

		return timingSafeEqual(derivedKey, expectedKey);
	}

	/**
	 * Calcule la clé scrypt de la longueur demandée.
	 */
	private async deriveKey(password: string, salt: Buffer, keyLength: number): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			scrypt(password, salt, keyLength, (error, derivedKey) => {
				if (error !== null) {
					reject(error);

					return;
				}

				resolve(derivedKey);
			});
		});
	}
}
