import { randomUUID } from "node:crypto";
import { IdGeneratorInterface } from "@shared/ports/IdGeneratorInterface";

/**
 * Identifiants uniques aléatoires (UUID v4) produits par node:crypto (A5).
 */
export class RandomUuidGenerator implements IdGeneratorInterface {
	/**
	 * Renvoie un nouvel UUID aléatoire.
	 */
	public generate(): string {
		return randomUUID();
	}
}
