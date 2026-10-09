import { AddCafePresenterInterface } from "@catalogue/application/ports/AddCafePresenterInterface";
import { CafeRepositoryInterface } from "@catalogue/application/ports/CafeRepositoryInterface";
import { AddCafeDTO } from "@catalogue/application/use-cases/AddCafeDTO";
import { Cafe } from "@catalogue/domain/cafe/Cafe";
import { IdGeneratorInterface } from "@shared/ports/IdGeneratorInterface";

/**
 * Ajoute un café au catalogue : il est enregistré visible, avec un prix pour chacun des trois formats.
 */
export class AddCafeUseCase {
	/**
	 * Reçoit les cafés enregistrés et le générateur d'identifiants.
	 */
	public constructor(
		private readonly cafeRepository: CafeRepositoryInterface,
		private readonly idGenerator: IdGeneratorInterface
	) {}

	/**
	 * Enregistre le nouveau café puis le transmet au presenter. Lève InvalidCafeError si une information manque
	 * ou si un prix est refusé : rien n'est alors enregistré.
	 */
	public async execute(dto: AddCafeDTO, presenter: AddCafePresenterInterface): Promise<void> {
		const cafe = Cafe.create(this.idGenerator.generate(), dto);
		await this.cafeRepository.save(cafe);
		presenter.present(cafe);
	}
}
