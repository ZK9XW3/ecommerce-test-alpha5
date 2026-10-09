/**
 * Montant en centimes entiers. Propre au module catalogue (aucun import d'un autre module).
 * Le caractère entier est garanti à la frontière HTTP ; les règles propres à un prix sont vérifiées par PrixParFormat.
 */
export class Montant {
	/**
	 * Crée un montant ; passer par fromCentimes.
	 */
	private constructor(public readonly centimes: number) {}

	/**
	 * Crée un montant depuis des centimes.
	 */
	public static fromCentimes(centimes: number): Montant {
		return new Montant(centimes);
	}
}
