import { CafeRepositoryInterface } from "@catalogue/application/ports/CafeRepositoryInterface";
import { InMemoryCafeRepository } from "@catalogue/infrastructure/repositories/InMemoryCafeRepository";
import { CafeBuilder } from "@tests/unit/catalogue/builders/CafeBuilder";
import { FakeCafeRepository } from "@tests/unit/catalogue/fakes/FakeCafeRepository";

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
		await repository.save(new CafeBuilder().with({ nom: "Moka Sidamo" }).buildCafe("cafe-1"));

		// When
		const cafe = await repository.findById("cafe-1");

		// Then
		expect(cafe?.nom).toBe("Moka Sidamo");
	});

	it("ne retrouve aucun café pour un identifiant inconnu", async () => {
		// Given
		const repository = createRepository();
		await repository.save(new CafeBuilder().with({ nom: "Moka Sidamo" }).buildCafe("cafe-1"));

		// When
		const cafe = await repository.findById("cafe-inconnu");

		// Then
		expect(cafe).toBeUndefined();
	});

	it("liste tous les cafés dans l'ordre d'enregistrement", async () => {
		// Given
		const repository = createRepository();
		await repository.save(new CafeBuilder().with({ nom: "Moka Sidamo" }).buildCafe("cafe-1"));
		await repository.save(new CafeBuilder().with({ nom: "Santos" }).buildCafe("cafe-2"));

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
		await repository.save(new CafeBuilder().with({ nom: "Moka Sidamo" }).buildCafe("cafe-1"));

		// When
		await repository.save(new CafeBuilder().with({ nom: "Moka Sidamo Grade 1" }).buildCafe("cafe-1"));

		// Then
		expect(await repository.findAll()).toHaveLength(1);
		expect((await repository.findById("cafe-1"))?.nom).toBe("Moka Sidamo Grade 1");
	});

	it("retire un café supprimé", async () => {
		// Given
		const repository = createRepository();
		await repository.save(new CafeBuilder().with({ nom: "Moka Sidamo" }).buildCafe("cafe-1"));

		// When
		await repository.delete("cafe-1");

		// Then
		expect(await repository.findById("cafe-1")).toBeUndefined();
	});
});
