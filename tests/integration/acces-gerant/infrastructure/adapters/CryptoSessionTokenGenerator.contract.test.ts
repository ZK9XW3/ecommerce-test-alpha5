import { SessionTokenGeneratorInterface } from "@acces-gerant/application/ports/SessionTokenGeneratorInterface";
import { CryptoSessionTokenGenerator } from "@acces-gerant/infrastructure/adapters/CryptoSessionTokenGenerator";
import { FakeSessionTokenGenerator } from "@tests/unit/acces-gerant/fakes/FakeSessionTokenGenerator";

describe.each([
	[
		"FakeSessionTokenGenerator",
		(): SessionTokenGeneratorInterface => {
			return new FakeSessionTokenGenerator();
		}
	],
	[
		"CryptoSessionTokenGenerator",
		(): SessionTokenGeneratorInterface => {
			return new CryptoSessionTokenGenerator();
		}
	]
])("Contrat SessionTokenGeneratorInterface : %s", (_name, createGenerator) => {
	it("produit un jeton différent à chaque appel", () => {
		// Given
		const generator = createGenerator();
		const firstToken = generator.generate();

		// When
		const secondToken = generator.generate();

		// Then
		expect(secondToken).not.toBe(firstToken);
	});
});
