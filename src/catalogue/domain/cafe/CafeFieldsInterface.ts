import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";

/**
 * Contrat de données d'un café : les valeurs attendues pour le créer. Un prix absent pour un format est refusé par le domaine.
 */
export interface CafeFieldsInterface {
	readonly nom: string;
	readonly origine: string;
	readonly description: string;
	readonly prixEnCentimes: Partial<Record<FormatCafe, number>>;
}
