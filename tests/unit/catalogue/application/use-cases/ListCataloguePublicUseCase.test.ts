import { ListCataloguePublicUseCase } from "@catalogue/application/use-cases/ListCataloguePublicUseCase";
import { Cafe } from "@catalogue/domain/cafe/Cafe";
import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";
import { FakeCafeRepository } from "@tests/unit/catalogue/fakes/FakeCafeRepository";
import { FakeListCataloguePublicPresenter } from "@tests/unit/catalogue/fakes/FakeListCataloguePublicPresenter";

describe("ListCataloguePublicUseCase", () => {
	it("catalogue public", async () => {
		// Given
		const cafeRepository = new FakeCafeRepository();
		await cafeRepository.save(
			Cafe.create("cafe-1", {
				nom: "Moka Sidamo",
				origine: "Éthiopie",
				description: "Notes florales et d'agrumes.",
				prixEnCentimes: { [FormatCafe.Grammes250]: 900, [FormatCafe.Grammes500]: 1700, [FormatCafe.Kilogramme1]: 3200 }
			})
		);
		const presenter = new FakeListCataloguePublicPresenter();

		// When
		await new ListCataloguePublicUseCase(cafeRepository).execute(presenter);

		// Then
		const [cafe] = presenter.result() ?? [];
		expect(cafe?.nom).toBe("Moka Sidamo");
		expect(cafe?.origine).toBe("Éthiopie");
		expect(cafe?.description).toBe("Notes florales et d'agrumes.");
		expect(cafe?.prix.prixPour(FormatCafe.Grammes250).centimes).toBe(900);
		expect(cafe?.prix.prixPour(FormatCafe.Grammes500).centimes).toBe(1700);
		expect(cafe?.prix.prixPour(FormatCafe.Kilogramme1).centimes).toBe(3200);
	});
});
