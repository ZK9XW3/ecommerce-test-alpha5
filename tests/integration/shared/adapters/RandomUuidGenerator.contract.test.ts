import { RandomUuidGenerator } from "@shared/adapters/RandomUuidGenerator";
import { IdGeneratorInterface } from "@shared/ports/IdGeneratorInterface";
import { FakeIdGenerator } from "@tests/unit/catalogue/fakes/FakeIdGenerator";

describe.each([
	[
		"FakeIdGenerator",
		(): IdGeneratorInterface => {
			return new FakeIdGenerator();
		}
	],
	[
		"RandomUuidGenerator",
		(): IdGeneratorInterface => {
			return new RandomUuidGenerator();
		}
	]
])("Contrat IdGeneratorInterface : %s", (_name, createIdGenerator) => {
	it("produit un identifiant différent à chaque appel", () => {
		// Given
		const idGenerator = createIdGenerator();
		const premierId = idGenerator.generate();

		// When
		const secondId = idGenerator.generate();

		// Then
		expect(premierId).not.toBe("");
		expect(secondId).not.toBe(premierId);
	});
});
