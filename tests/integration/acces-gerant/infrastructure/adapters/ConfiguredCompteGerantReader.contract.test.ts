import { CompteGerantReaderInterface } from "@acces-gerant/application/ports/CompteGerantReaderInterface";
import { ConfiguredCompteGerantReader } from "@acces-gerant/infrastructure/adapters/ConfiguredCompteGerantReader";
import { FakeCompteGerantReader } from "@tests/unit/acces-gerant/fakes/FakeCompteGerantReader";

describe.each([
	[
		"FakeCompteGerantReader",
		(email: string, hash: string): CompteGerantReaderInterface => {
			return new FakeCompteGerantReader(email, hash);
		}
	],
	[
		"ConfiguredCompteGerantReader",
		(email: string, hash: string): CompteGerantReaderInterface => {
			return new ConfiguredCompteGerantReader(email, hash);
		}
	]
])("Contrat CompteGerantReaderInterface : %s", (_name, createReader) => {
	it("renvoie l'e-mail du compte", () => {
		// Given
		const reader = createReader("gerant@cafe.fr", "empreinte");

		// When
		const email = reader.readEmail();

		// Then
		expect(email).toBe("gerant@cafe.fr");
	});

	it("renvoie l'empreinte du mot de passe du compte", () => {
		// Given
		const reader = createReader("gerant@cafe.fr", "empreinte");

		// When
		const passwordHash = reader.readPasswordHash();

		// Then
		expect(passwordHash).toBe("empreinte");
	});
});
