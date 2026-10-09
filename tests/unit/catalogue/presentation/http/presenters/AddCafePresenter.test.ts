import { Cafe } from "@catalogue/domain/cafe/Cafe";
import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";
import { AddCafePresenter } from "@catalogue/presentation/http/presenters/AddCafePresenter";

describe("AddCafePresenter", () => {
	const mokaSidamo = Cafe.create("cafe-1", {
		nom: "Moka Sidamo",
		origine: "Éthiopie",
		description: "Notes florales et d'agrumes.",
		prixEnCentimes: { [FormatCafe.Grammes250]: 900, [FormatCafe.Grammes500]: 1750, [FormatCafe.Kilogramme1]: 3200 }
	});

	it("affiche le prix de chaque format en euros, avec le libellé du format", () => {
		// Given
		const presenter = new AddCafePresenter();

		// When
		presenter.present(mokaSidamo);

		// Then
		expect(presenter.viewModel().prix).toEqual([
			{ format: "250 g", prix: "9,00 €" },
			{ format: "500 g", prix: "17,50 €" },
			{ format: "1 kg", prix: "32,00 €" }
		]);
	});

	it("transmet l'identifiant du café enregistré", () => {
		// Given
		const presenter = new AddCafePresenter();

		// When
		presenter.present(mokaSidamo);

		// Then
		expect(presenter.viewModel().id).toBe("cafe-1");
	});
});
