import { IsInt, IsString, MaxLength, ValidateIf } from "class-validator";
import { CafeFieldsInterface } from "@catalogue/domain/cafe/CafeFieldsInterface";
import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";

const NOM_MAX_LENGTH = 200;
const ORIGINE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 2000;

/**
 * Forme attendue du corps de POST /gerant/cafes : textes et prix entiers en centimes.
 * Seule la forme est vérifiée ici (400) ; une information vide ou absente et un prix manquant ou nul sont refusés
 * par le domaine (422, message qui nomme l'information manquante), comme le prévoit l'architecture (InvalidCafeError).
 * Les valeurs par défaut font donc arriver un texte absent comme vide, et un prix absent comme manquant.
 */
export class AddCafeRequest implements CafeFieldsInterface {
	@IsString()
	@MaxLength(NOM_MAX_LENGTH)
	public readonly nom: string = "";

	@IsString()
	@MaxLength(ORIGINE_MAX_LENGTH)
	public readonly origine: string = "";

	@IsString()
	@MaxLength(DESCRIPTION_MAX_LENGTH)
	public readonly description: string = "";

	@ValidateIf(AddCafeRequest.isPresent)
	@IsInt()
	public readonly prix250gEnCentimes: number | undefined = undefined;

	@ValidateIf(AddCafeRequest.isPresent)
	@IsInt()
	public readonly prix500gEnCentimes: number | undefined = undefined;

	@ValidateIf(AddCafeRequest.isPresent)
	@IsInt()
	public readonly prix1kgEnCentimes: number | undefined = undefined;

	/**
	 * Regroupe les prix reçus par format ; un prix absent reste absent.
	 */
	public get prixEnCentimes(): Partial<Record<FormatCafe, number>> {
		return {
			[FormatCafe.Grammes250]: this.prix250gEnCentimes,
			[FormatCafe.Grammes500]: this.prix500gEnCentimes,
			[FormatCafe.Kilogramme1]: this.prix1kgEnCentimes
		};
	}

	/**
	 * Indique si un prix est fourni ; un prix null est vérifié, donc refusé comme non entier.
	 */
	private static isPresent(_request: object, value: unknown): boolean {
		return value !== undefined;
	}
}
