import { IdGeneratorInterface } from "@shared/ports/IdGeneratorInterface";

/**
 * Générateur d'identifiants prévisibles pour les tests : « cafe-1 », « cafe-2 »…
 */
export class FakeIdGenerator implements IdGeneratorInterface {
	private generatedCount = 0;

	/**
	 * Renvoie l'identifiant suivant de la suite.
	 */
	public generate(): string {
		this.generatedCount += 1;

		return `cafe-${this.generatedCount}`;
	}
}
