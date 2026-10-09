/**
 * Port transverse qui produit des identifiants uniques, pour que les identifiants restent prévisibles en test (A5).
 */
export interface IdGeneratorInterface {
	/**
	 * Renvoie un nouvel identifiant, différent de tous ceux déjà produits.
	 */
	generate(): string;
}
