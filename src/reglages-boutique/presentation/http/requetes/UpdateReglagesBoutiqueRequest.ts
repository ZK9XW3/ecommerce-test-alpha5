import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

const ADRESSE_ALERTE_MAX_LENGTH = 254;

/**
 * Forme attendue du corps de PUT /gerant/settings : les trois réglages, tous présents.
 * Seule la forme est vérifiée ici (400) ; les règles métier (négatif, adresse mal formée) le sont par le domaine (422).
 * Les valeurs par défaut ne servent qu'à faire refuser un champ absent : NaN n'est pas un nombre accepté, la chaîne vide non plus.
 */
export class UpdateReglagesBoutiqueRequest {
	@IsNumber()
	public readonly seuilStockBasEnKg: number = Number.NaN;

	@IsString()
	@IsNotEmpty()
	@MaxLength(ADRESSE_ALERTE_MAX_LENGTH)
	public readonly adresseAlerte: string = "";

	@IsNumber()
	public readonly fraisLivraisonEnCentimes: number = Number.NaN;
}
