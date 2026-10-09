import { ReglagesBoutiqueRepositoryInterface } from "@reglages-boutique/application/ports/ReglagesBoutiqueRepositoryInterface";
import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";

/**
 * Réglages de la boutique gardés dans un simple champ, pour les tests.
 */
export class FakeReglagesBoutiqueRepository implements ReglagesBoutiqueRepositoryInterface {
	/**
	 * Démarre avec les réglages initiaux.
	 */
	public constructor(private reglages: ReglagesBoutique) {}

	/**
	 * Renvoie les derniers réglages enregistrés.
	 */
	public async get(): Promise<ReglagesBoutique> {
		return this.reglages;
	}

	/**
	 * Remplace les réglages gardés.
	 */
	public async save(reglages: ReglagesBoutique): Promise<void> {
		this.reglages = reglages;
	}
}
