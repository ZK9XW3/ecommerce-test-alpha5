import { ReglagesBoutiqueRepositoryInterface } from "@reglages-boutique/application/ports/ReglagesBoutiqueRepositoryInterface";
import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";

/**
 * Réglages de la boutique gardés en mémoire du serveur, initialisés avec les valeurs de la configuration (A6) :
 * toute modification est perdue au redémarrage (ADR 0001).
 */
export class InMemoryReglagesBoutiqueRepository implements ReglagesBoutiqueRepositoryInterface {
	/**
	 * Démarre avec les réglages initiaux lus dans la configuration.
	 */
	public constructor(private reglages: ReglagesBoutique) {}

	/**
	 * Renvoie les réglages actuels.
	 */
	public async get(): Promise<ReglagesBoutique> {
		return this.reglages;
	}

	/**
	 * Remplace les réglages actuels.
	 */
	public async save(reglages: ReglagesBoutique): Promise<void> {
		this.reglages = reglages;
	}
}
