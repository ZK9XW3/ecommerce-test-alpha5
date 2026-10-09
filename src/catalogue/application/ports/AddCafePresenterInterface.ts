import { Cafe } from "@catalogue/domain/cafe/Cafe";

/**
 * Output port de l'ajout d'un café (approche B) : reçoit le café enregistré.
 */
export interface AddCafePresenterInterface {
	/**
	 * Reçoit le café enregistré pour le mettre en forme.
	 */
	present(result: Cafe): void;
}
