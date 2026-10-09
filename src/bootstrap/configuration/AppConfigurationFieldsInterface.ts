import { ReglagesBoutiqueFieldsInterface } from "@reglages-boutique/domain/ReglagesBoutiqueFieldsInterface";

/**
 * Valeurs déjà validées de la configuration, regroupées car elles dépassent la limite de paramètres (STYLE-R21).
 */
export interface AppConfigurationFieldsInterface {
	readonly httpPort: number;
	readonly gerantEmail: string;
	readonly gerantPasswordHash: string;
	readonly sessionDurationInMilliseconds: number;
	readonly reglagesBoutiqueInitiaux: ReglagesBoutiqueFieldsInterface;
}
