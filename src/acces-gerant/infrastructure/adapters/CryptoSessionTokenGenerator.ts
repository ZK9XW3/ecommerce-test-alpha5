import { randomBytes } from "node:crypto";
import { SessionTokenGeneratorInterface } from "@acces-gerant/application/ports/SessionTokenGeneratorInterface";

/**
 * Produit des jetons de session opaques à partir d'octets aléatoires cryptographiquement sûrs.
 */
export class CryptoSessionTokenGenerator implements SessionTokenGeneratorInterface {
	private static readonly TOKEN_BYTES = 32;

	/**
	 * Renvoie 32 octets aléatoires encodés en base64url.
	 */
	public generate(): string {
		return randomBytes(CryptoSessionTokenGenerator.TOKEN_BYTES).toString("base64url");
	}
}
