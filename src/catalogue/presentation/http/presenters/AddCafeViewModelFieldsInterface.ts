import { PrixFormatViewModel } from "@catalogue/presentation/http/presenters/PrixFormatViewModel";

/**
 * Valeurs déjà mises en forme du café ajouté, regroupées car elles dépassent la limite de paramètres (STYLE-R21).
 */
export interface AddCafeViewModelFieldsInterface {
	readonly id: string;
	readonly nom: string;
	readonly origine: string;
	readonly description: string;
	readonly prix: readonly PrixFormatViewModel[];
}
