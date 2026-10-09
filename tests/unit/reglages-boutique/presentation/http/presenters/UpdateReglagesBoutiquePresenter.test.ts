import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";
import { UpdateReglagesBoutiquePresenter } from "@reglages-boutique/presentation/http/presenters/UpdateReglagesBoutiquePresenter";

describe("UpdateReglagesBoutiquePresenter", () => {
	const reglages = ReglagesBoutique.fromFields({ seuilStockBasEnKg: 2, adresseAlerte: "stock@cafe-exemple.fr", fraisLivraisonEnCentimes: 490 });

	it("affiche le seuil en kilogrammes au gramme près", () => {
		// Given
		const presenter = new UpdateReglagesBoutiquePresenter();

		// When
		presenter.present(reglages);

		// Then
		expect(presenter.viewModel().seuilStockBas).toBe("2,000 kg");
	});

	it("affiche les frais de livraison en euros", () => {
		// Given
		const presenter = new UpdateReglagesBoutiquePresenter();

		// When
		presenter.present(reglages);

		// Then
		expect(presenter.viewModel().fraisLivraison).toBe("4,90 €");
	});

	it("transmet l'adresse d'alerte telle quelle", () => {
		// Given
		const presenter = new UpdateReglagesBoutiquePresenter();

		// When
		presenter.present(reglages);

		// Then
		expect(presenter.viewModel().adresseAlerte).toBe("stock@cafe-exemple.fr");
	});
});
