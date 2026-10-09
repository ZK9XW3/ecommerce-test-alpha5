import { CafeFieldsInterface } from "@catalogue/domain/cafe/CafeFieldsInterface";
import { InvalidCafeError } from "@catalogue/domain/cafe/InvalidCafeError";
import { PrixParFormat } from "@catalogue/domain/cafe/PrixParFormat";

/**
 * Café du catalogue (racine d'agrégat) : nom, origine, description et prix des trois formats. Visible dès sa création.
 */
export class Cafe {
	private static readonly NOM_MANQUANT = "Le nom du café est obligatoire.";
	private static readonly ORIGINE_MANQUANTE = "L'origine du café est obligatoire.";
	private static readonly DESCRIPTION_MANQUANTE = "La description du café est obligatoire.";

	public readonly visible = true;
	public readonly nom: string;
	public readonly origine: string;
	public readonly description: string;
	public readonly prix: PrixParFormat;

	/**
	 * Recopie des valeurs en les validant ; passer par create.
	 */
	private constructor(
		public readonly id: string,
		fields: CafeFieldsInterface
	) {
		this.nom = Cafe.requireText(fields.nom, Cafe.NOM_MANQUANT);
		this.origine = Cafe.requireText(fields.origine, Cafe.ORIGINE_MANQUANTE);
		this.description = Cafe.requireText(fields.description, Cafe.DESCRIPTION_MANQUANTE);
		this.prix = PrixParFormat.fromCentimes(fields.prixEnCentimes);
	}

	/**
	 * Crée un café visible ; lève InvalidCafeError si le nom, l'origine ou la description est vide, ou si un prix manque ou n'est pas supérieur à 0.
	 */
	public static create(id: string, fields: CafeFieldsInterface): Cafe {
		return new Cafe(id, fields);
	}

	/**
	 * Renvoie le texte reçu, ou lève InvalidCafeError avec le message donné s'il est vide ou ne contient que des espaces.
	 */
	private static requireText(text: string, messageSiVide: string): string {
		if (text.trim() === "") {
			throw new InvalidCafeError(messageSiVide);
		}

		return text;
	}
}
