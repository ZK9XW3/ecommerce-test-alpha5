import { CafeRepositoryInterface } from "@catalogue/application/ports/CafeRepositoryInterface";
import { Cafe } from "@catalogue/domain/cafe/Cafe";

/**
 * Cafés gardés dans une liste, pour les tests.
 */
export class FakeCafeRepository implements CafeRepositoryInterface {
	private cafes: Cafe[] = [];

	/**
	 * Ajoute le café à la liste, ou remplace celui qui porte le même identifiant.
	 */
	public async save(cafe: Cafe): Promise<void> {
		await this.delete(cafe.id);
		this.cafes.push(cafe);
	}

	/**
	 * Cherche le café portant cet identifiant dans la liste.
	 */
	public async findById(id: string): Promise<Cafe | undefined> {
		return this.cafes.find((cafe) => {
			return cafe.id === id;
		});
	}

	/**
	 * Renvoie une copie de la liste des cafés.
	 */
	public async findAll(): Promise<Cafe[]> {
		return [...this.cafes];
	}

	/**
	 * Retire de la liste le café portant cet identifiant.
	 */
	public async delete(id: string): Promise<void> {
		this.cafes = this.cafes.filter((cafe) => {
			return cafe.id !== id;
		});
	}
}
