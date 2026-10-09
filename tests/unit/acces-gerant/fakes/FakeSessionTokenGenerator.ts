import { SessionTokenGeneratorInterface } from "@acces-gerant/application/ports/SessionTokenGeneratorInterface";

/**
 * Générateur de jetons prévisibles pour les tests : « jeton-1 », « jeton-2 »…
 */
export class FakeSessionTokenGenerator implements SessionTokenGeneratorInterface {
	private generatedCount = 0;

	/**
	 * Renvoie le jeton suivant de la série.
	 */
	public generate(): string {
		this.generatedCount += 1;

		return `jeton-${this.generatedCount}`;
	}
}
