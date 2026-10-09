import { PrixFormatViewModel } from "@catalogue/presentation/http/presenters/PrixFormatViewModel";

/**
 * Café du catalogue public, prêt à afficher.
 */
export class CafeCataloguePublicViewModel {
	/**
	 * Regroupe le nom, l'origine, la description et le prix de chacun des trois formats déjà mis en forme.
	 */
	public constructor(
		public readonly nom: string,
		public readonly origine: string,
		public readonly description: string,
		public readonly prix: readonly PrixFormatViewModel[]
	) {}
}
