import { AddCafeDTO } from "@catalogue/application/use-cases/AddCafeDTO";
import { AddCafeUseCase } from "@catalogue/application/use-cases/AddCafeUseCase";
import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";
import { InvalidCafeError } from "@catalogue/domain/cafe/InvalidCafeError";
import { CafeBuilder } from "@tests/unit/catalogue/builders/CafeBuilder";
import { FakeAddCafePresenter } from "@tests/unit/catalogue/fakes/FakeAddCafePresenter";
import { FakeCafeRepository } from "@tests/unit/catalogue/fakes/FakeCafeRepository";
import { FakeIdGenerator } from "@tests/unit/catalogue/fakes/FakeIdGenerator";

describe("AddCafeUseCase", () => {
	let cafeRepository: FakeCafeRepository;
	let presenter: FakeAddCafePresenter;
	let addCafe: AddCafeUseCase;

	beforeEach(() => {
		cafeRepository = new FakeCafeRepository();
		presenter = new FakeAddCafePresenter();
		addCafe = new AddCafeUseCase(cafeRepository, new FakeIdGenerator());
	});

	it("ajout complet", async () => {
		// Given
		const dto = new AddCafeDTO({
			nom: "Moka Sidamo",
			origine: "Éthiopie",
			description: "Notes florales et d'agrumes.",
			prixEnCentimes: { [FormatCafe.Grammes250]: 900, [FormatCafe.Grammes500]: 1700, [FormatCafe.Kilogramme1]: 3200 }
		});

		// When
		await addCafe.execute(dto, presenter);

		// Then
		const cafe = await cafeRepository.findById("cafe-1");
		expect(cafe?.nom).toBe("Moka Sidamo");
		expect(cafe?.origine).toBe("Éthiopie");
		expect(cafe?.description).toBe("Notes florales et d'agrumes.");
		expect(cafe?.visible).toBe(true);
		expect(cafe?.prix.prixPour(FormatCafe.Grammes250).centimes).toBe(900);
		expect(cafe?.prix.prixPour(FormatCafe.Grammes500).centimes).toBe(1700);
		expect(cafe?.prix.prixPour(FormatCafe.Kilogramme1).centimes).toBe(3200);
		expect(presenter.result()?.id).toBe("cafe-1");
	});

	it("format sans prix", async () => {
		// Given
		const dto = new AddCafeDTO(new CafeBuilder().with({ prixEnCentimes: { [FormatCafe.Grammes250]: 900, [FormatCafe.Grammes500]: 1700 } }).buildFields());

		// When
		const add = addCafe.execute(dto, presenter);

		// Then
		await expect(add).rejects.toThrow(InvalidCafeError);
		await expect(add).rejects.toThrow(/prix.*1 kg/);
		expect(await cafeRepository.findAll()).toHaveLength(0);
	});

	it("refuse un prix nul", async () => {
		// Given
		const dto = new AddCafeDTO(
			new CafeBuilder().with({ prixEnCentimes: { [FormatCafe.Grammes250]: 900, [FormatCafe.Grammes500]: 0, [FormatCafe.Kilogramme1]: 3200 } }).buildFields()
		);

		// When
		const add = addCafe.execute(dto, presenter);

		// Then
		await expect(add).rejects.toThrow(InvalidCafeError);
		await expect(add).rejects.toThrow(/prix.*500 g/);
		expect(await cafeRepository.findAll()).toHaveLength(0);
	});

	describe("information obligatoire manquante", () => {
		it.each([
			["nom", { nom: "" }, /nom/],
			["origine", { origine: "" }, /origine/],
			["description", { description: "  " }, /description/]
		])("sans %s", async (_information, champManquant, messageAttendu) => {
			// Given
			const dto = new AddCafeDTO(new CafeBuilder().with(champManquant).buildFields());

			// When
			const add = addCafe.execute(dto, presenter);

			// Then
			await expect(add).rejects.toThrow(InvalidCafeError);
			await expect(add).rejects.toThrow(messageAttendu);
			expect(await cafeRepository.findAll()).toHaveLength(0);
		});
	});
});
