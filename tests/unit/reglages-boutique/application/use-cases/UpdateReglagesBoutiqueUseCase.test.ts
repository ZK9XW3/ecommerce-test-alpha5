import { UpdateReglagesBoutiqueDTO } from "@reglages-boutique/application/use-cases/UpdateReglagesBoutiqueDTO";
import { UpdateReglagesBoutiqueUseCase } from "@reglages-boutique/application/use-cases/UpdateReglagesBoutiqueUseCase";
import { InvalidReglagesBoutiqueError } from "@reglages-boutique/domain/InvalidReglagesBoutiqueError";
import { ReglagesBoutique } from "@reglages-boutique/domain/ReglagesBoutique";
import { FakeReglagesBoutiqueRepository } from "@tests/unit/reglages-boutique/fakes/FakeReglagesBoutiqueRepository";
import { FakeUpdateReglagesBoutiquePresenter } from "@tests/unit/reglages-boutique/fakes/FakeUpdateReglagesBoutiquePresenter";

describe("UpdateReglagesBoutiqueUseCase", () => {
	const reglagesActuels = { seuilStockBasEnKg: 1, adresseAlerte: "alerte@cafe.fr", fraisLivraisonEnCentimes: 500 };
	let reglagesBoutiqueRepository: FakeReglagesBoutiqueRepository;
	let presenter: FakeUpdateReglagesBoutiquePresenter;
	let updateReglagesBoutique: UpdateReglagesBoutiqueUseCase;

	beforeEach(() => {
		reglagesBoutiqueRepository = new FakeReglagesBoutiqueRepository(ReglagesBoutique.fromFields(reglagesActuels));
		presenter = new FakeUpdateReglagesBoutiquePresenter();
		updateReglagesBoutique = new UpdateReglagesBoutiqueUseCase(reglagesBoutiqueRepository);
	});

	it("régler le seuil", async () => {
		// Given
		const dto = new UpdateReglagesBoutiqueDTO({ ...reglagesActuels, seuilStockBasEnKg: 2 });

		// When
		await updateReglagesBoutique.execute(dto, presenter);

		// Then
		expect((await reglagesBoutiqueRepository.get()).seuilStockBas.grammes).toBe(2000);
		expect(presenter.result()?.seuilStockBas.grammes).toBe(2000);
	});

	it("seuil négatif", async () => {
		// Given
		const dto = new UpdateReglagesBoutiqueDTO({ ...reglagesActuels, seuilStockBasEnKg: -1 });

		// When
		const update = updateReglagesBoutique.execute(dto, presenter);

		// Then
		await expect(update).rejects.toThrow(InvalidReglagesBoutiqueError);
		expect((await reglagesBoutiqueRepository.get()).seuilStockBas.grammes).toBe(1000);
	});

	it("seuil plus fin que le gramme", async () => {
		// Given
		const dto = new UpdateReglagesBoutiqueDTO({ ...reglagesActuels, seuilStockBasEnKg: 2.0005 });

		// When
		const update = updateReglagesBoutique.execute(dto, presenter);

		// Then
		await expect(update).rejects.toThrow(InvalidReglagesBoutiqueError);
		expect((await reglagesBoutiqueRepository.get()).seuilStockBas.grammes).toBe(1000);
	});

	it("régler l'adresse d'alerte", async () => {
		// Given
		const dto = new UpdateReglagesBoutiqueDTO({ ...reglagesActuels, adresseAlerte: "stock@cafe-exemple.fr" });

		// When
		await updateReglagesBoutique.execute(dto, presenter);

		// Then
		expect((await reglagesBoutiqueRepository.get()).adresseAlerte.value).toBe("stock@cafe-exemple.fr");
	});

	it("adresse mal formée", async () => {
		// Given
		const dto = new UpdateReglagesBoutiqueDTO({ ...reglagesActuels, adresseAlerte: "stock-cafe-exemple" });

		// When
		const update = updateReglagesBoutique.execute(dto, presenter);

		// Then
		await expect(update).rejects.toThrow(InvalidReglagesBoutiqueError);
		await expect(update).rejects.toThrow(/adresse d'alerte/);
		expect((await reglagesBoutiqueRepository.get()).adresseAlerte.value).toBe("alerte@cafe.fr");
	});

	it("régler les frais de livraison", async () => {
		// Given
		const dto = new UpdateReglagesBoutiqueDTO({ ...reglagesActuels, fraisLivraisonEnCentimes: 490 });

		// When
		await updateReglagesBoutique.execute(dto, presenter);

		// Then
		expect((await reglagesBoutiqueRepository.get()).fraisLivraison.centimes).toBe(490);
	});

	it("frais négatifs", async () => {
		// Given
		const dto = new UpdateReglagesBoutiqueDTO({ ...reglagesActuels, fraisLivraisonEnCentimes: -200 });

		// When
		const update = updateReglagesBoutique.execute(dto, presenter);

		// Then
		await expect(update).rejects.toThrow(InvalidReglagesBoutiqueError);
		expect((await reglagesBoutiqueRepository.get()).fraisLivraison.centimes).toBe(500);
	});

	it("frais en fraction de centime", async () => {
		// Given
		const dto = new UpdateReglagesBoutiqueDTO({ ...reglagesActuels, fraisLivraisonEnCentimes: 490.5 });

		// When
		const update = updateReglagesBoutique.execute(dto, presenter);

		// Then
		await expect(update).rejects.toThrow(InvalidReglagesBoutiqueError);
		expect((await reglagesBoutiqueRepository.get()).fraisLivraison.centimes).toBe(500);
	});
});
