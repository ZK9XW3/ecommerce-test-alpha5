import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";
import { AddCafePresenter } from "@catalogue/presentation/http/presenters/AddCafePresenter";
import { CafeBuilder } from "@tests/unit/catalogue/builders/CafeBuilder";

describe("AddCafePresenter", () => {
	const mokaSidamo = new CafeBuilder()
		.with({ prixEnCentimes: { [FormatCafe.Grammes250]: 900, [FormatCafe.Grammes500]: 1750, [FormatCafe.Kilogramme1]: 3200 } })
		.buildCafe("cafe-1");

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
