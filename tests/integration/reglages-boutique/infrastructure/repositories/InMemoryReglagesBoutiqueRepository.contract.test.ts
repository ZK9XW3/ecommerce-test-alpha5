import { ReglagesBoutiqueRepositoryInterface } from "@reglages-boutique/application/ports/ReglagesBoutiqueRepositoryInterface";
import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";
import { InMemoryReglagesBoutiqueRepository } from "@reglages-boutique/infrastructure/repositories/InMemoryReglagesBoutiqueRepository";
import { FakeReglagesBoutiqueRepository } from "@tests/unit/reglages-boutique/fakes/FakeReglagesBoutiqueRepository";

const reglagesInitiaux = ReglagesBoutique.fromFields({ seuilStockBasEnKg: 1, adresseAlerte: "alerte@cafe.fr", fraisLivraisonEnCentimes: 500 });

describe.each([
	[
		"FakeReglagesBoutiqueRepository",
		(): ReglagesBoutiqueRepositoryInterface => {
			return new FakeReglagesBoutiqueRepository(reglagesInitiaux);
		}
	],
	[
		"InMemoryReglagesBoutiqueRepository",
		(): ReglagesBoutiqueRepositoryInterface => {
			return new InMemoryReglagesBoutiqueRepository(reglagesInitiaux);
		}
	]
])("Contrat ReglagesBoutiqueRepositoryInterface : %s", (_name, createRepository) => {
	it("renvoie les réglages initiaux tant que rien n'est enregistré", async () => {
		// Given
		const repository = createRepository();

		// When
		const reglages = await repository.get();

		// Then
		expect(reglages.fraisLivraison.centimes).toBe(500);
	});

	it("renvoie les derniers réglages enregistrés", async () => {
		// Given
		const repository = createRepository();
		await repository.save(ReglagesBoutique.fromFields({ seuilStockBasEnKg: 2, adresseAlerte: "stock@cafe-exemple.fr", fraisLivraisonEnCentimes: 490 }));

		// When
		const reglages = await repository.get();

		// Then
		expect(reglages.fraisLivraison.centimes).toBe(490);
	});
});
