import { Cafe } from "@catalogue/domain/cafe/Cafe";

/**
 * Port de lecture et d'enregistrement des cafés du catalogue (racine d'agrégat seulement).
 */
export interface CafeRepositoryInterface {
	/**
	 * Enregistre le café, ou remplace celui qui porte le même identifiant.
	 */
	save(cafe: Cafe): Promise<void>;

	/**
	 * Retrouve le café portant cet identifiant, ou undefined s'il n'existe pas.
	 */
	findById(id: string): Promise<Cafe | undefined>;

	/**
	 * Renvoie tous les cafés enregistrés, dans l'ordre d'enregistrement.
	 */
	findAll(): Promise<Cafe[]>;

	/**
	 * Retire le café portant cet identifiant ; sans effet s'il n'existe pas.
	 */
	delete(id: string): Promise<void>;
}
