import { CafeRepositoryInterface } from "@catalogue/application/ports/CafeRepositoryInterface";
import { Cafe } from "@catalogue/domain/cafe/Cafe";
import { FormatCafe } from "@catalogue/domain/cafe/FormatCafe";
import { InMemoryCafeRepository } from "@catalogue/infrastructure/repositories/InMemoryCafeRepository";
import { FakeCafeRepository } from "@tests/unit/catalogue/fakes/FakeCafeRepository";

const createCafe = (id: string, nom: string): Cafe => {
	return Cafe.create(id, {
		nom,
		origine: "Éthiopie",
		description: "Notes florales.",
		prixEnCentimes: { [FormatCafe.Grammes250]: 900, [FormatCafe.Grammes500]: 1700, [FormatCafe.Kilogramme1]: 3200 }
	});
};

describe.each([
	[
		"FakeCafeRepository",
		(): CafeRepositoryInterface => {
			return new FakeCafeRepository();
		}
	],
	[
		"InMemoryCafeRepository",
		(): CafeRepositoryInterface => {
			return new InMemoryCafeRepository();
		}
	]
])("Contrat CafeRepositoryInterface : %s", (_name, createRepository) => {
	it("retrouve un café enregistré par son identifiant", async () => {
		// Given
		const repository = createRepository();
		await repository.save(createCafe("cafe-1", "Moka Sidamo"));

		// When
		const cafe = await repository.findById("cafe-1");

		// Then
		expect(cafe?.nom).toBe("Moka Sidamo");
	});

	it("ne retrouve aucun café pour un identifiant inconnu", async () => {
		// Given
		const repository = createRepository();
		await repository.save(createCafe("cafe-1", "Moka Sidamo"));

		// When
		const cafe = await repository.findById("cafe-inconnu");

		// Then
		expect(cafe).toBeUndefined();
	});

	it("liste tous les cafés dans l'ordre d'enregistrement", async () => {
		// Given
		const repository = createRepository();
		await repository.save(createCafe("cafe-1", "Moka Sidamo"));
		await repository.save(createCafe("cafe-2", "Santos"));

		// When
		const cafes = await repository.findAll();

		// Then
		expect(
			cafes.map((cafe) => {
				return cafe.nom;
			})
		).toEqual(["Moka Sidamo", "Santos"]);
	});

	it("remplace un café enregistré de nouveau avec le même identifiant", async () => {
		// Given
		const repository = createRepository();
		await repository.save(createCafe("cafe-1", "Moka Sidamo"));

		// When
		await repository.save(createCafe("cafe-1", "Moka Sidamo Grade 1"));

		// Then
		expect(await repository.findAll()).toHaveLength(1);
		expect((await repository.findById("cafe-1"))?.nom).toBe("Moka Sidamo Grade 1");
	});

	it("retire un café supprimé", async () => {
		// Given
		const repository = createRepository();
		await repository.save(createCafe("cafe-1", "Moka Sidamo"));

		// When
		await repository.delete("cafe-1");

		// Then
		expect(await repository.findById("cafe-1")).toBeUndefined();
	});
});
