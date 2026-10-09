import { CafeRepositoryInterface } from "@catalogue/application/ports/CafeRepositoryInterface";
import { Cafe } from "@catalogue/domain/cafe/Cafe";

/**
 * Cafés gardés en mémoire du serveur : ils sont perdus au redémarrage (ADR 0001).
 */
export class InMemoryCafeRepository implements CafeRepositoryInterface {
	private readonly cafesById = new Map<string, Cafe>();

	/**
	 * Enregistre le café, rangé par son identifiant.
	 */
	public async save(cafe: Cafe): Promise<void> {
		this.cafesById.set(cafe.id, cafe);
	}

	/**
	 * Retrouve le café portant cet identifiant.
	 */
	public async findById(id: string): Promise<Cafe | undefined> {
		return this.cafesById.get(id);
	}

	/**
	 * Renvoie tous les cafés, dans l'ordre de leur premier enregistrement.
	 */
	public async findAll(): Promise<Cafe[]> {
		return [...this.cafesById.values()];
	}

	/**
	 * Retire le café portant cet identifiant.
	 */
	public async delete(id: string): Promise<void> {
		this.cafesById.delete(id);
	}
}
