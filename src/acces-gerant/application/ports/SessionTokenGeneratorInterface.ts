/**
 * Port qui produit un jeton de session aléatoire et imprévisible.
 */
export interface SessionTokenGeneratorInterface {
	/**
	 * Renvoie un nouveau jeton, différent à chaque appel.
	 */
	generate(): string;
}
