import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";
import { ListCataloguePublicPresenter } from "@catalogue/presentation/http/presenters/ListCataloguePublicPresenter";
import { CafeBuilder } from "@tests/unit/catalogue/builders/CafeBuilder";

describe("ListCataloguePublicPresenter", () => {
	const mokaSidamo = new CafeBuilder()
		.with({
			nom: "Moka Sidamo",
			origine: "Éthiopie",
			description: "Notes florales et d'agrumes.",
			prixEnCentimes: { [FormatCafe.Grammes250]: 900, [FormatCafe.Grammes500]: 1750, [FormatCafe.Kilogramme1]: 3200 }
		})
		.buildCafe("cafe-1");

	it("affiche le prix de chaque format en euros, avec le libellé du format", () => {
		// Given
		const presenter = new ListCataloguePublicPresenter();

		// When
		presenter.present([mokaSidamo]);

		// Then
		expect(presenter.viewModel().cafes[0]?.prix).toEqual([
			{ format: "250 g", prix: "9,00 €" },
			{ format: "500 g", prix: "17,50 €" },
			{ format: "1 kg", prix: "32,00 €" }
		]);
	});

	it("transmet le nom, l'origine et la description tels quels", () => {
		// Given
		const presenter = new ListCataloguePublicPresenter();

		// When
		presenter.present([mokaSidamo]);

		// Then
		expect(presenter.viewModel().cafes[0]).toMatchObject({ nom: "Moka Sidamo", origine: "Éthiopie", description: "Notes florales et d'agrumes." });
	});
});
