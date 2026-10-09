import { GetReglagesBoutiqueUseCase } from "@reglages-boutique/application/use-cases/GetReglagesBoutiqueUseCase";
import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";
import { FakeGetReglagesBoutiquePresenter } from "@tests/unit/reglages-boutique/fakes/FakeGetReglagesBoutiquePresenter";
import { FakeReglagesBoutiqueRepository } from "@tests/unit/reglages-boutique/fakes/FakeReglagesBoutiqueRepository";

describe("GetReglagesBoutiqueUseCase", () => {
	it("valeurs de départ", async () => {
		// Given
		const reglagesDeDepart = ReglagesBoutique.fromFields({ seuilStockBasEnKg: 1.5, adresseAlerte: "alerte@cafe.fr", fraisLivraisonEnCentimes: 590 });
		const getReglagesBoutique = new GetReglagesBoutiqueUseCase(new FakeReglagesBoutiqueRepository(reglagesDeDepart));
		const presenter = new FakeGetReglagesBoutiquePresenter();

		// When
		await getReglagesBoutique.execute(presenter);

		// Then
		expect(presenter.result()?.seuilStockBas.grammes).toBe(1500);
		expect(presenter.result()?.adresseAlerte.value).toBe("alerte@cafe.fr");
		expect(presenter.result()?.fraisLivraison.centimes).toBe(590);
	});
});
