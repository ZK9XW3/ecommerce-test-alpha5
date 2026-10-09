/**
 * Prix d'un format de café, prêt à afficher.
 */
export class PrixFormatViewModel {
	/**
	 * Regroupe le libellé du format (ex. « 250 g ») et son prix déjà mis en forme (ex. « 9,00 € »).
	 */
	public constructor(
		public readonly format: string,
		public readonly prix: string
	) {}
}
