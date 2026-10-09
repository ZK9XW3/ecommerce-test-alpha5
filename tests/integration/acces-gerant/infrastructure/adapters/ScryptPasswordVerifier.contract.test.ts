import { randomBytes, scryptSync } from "node:crypto";
import { PasswordVerifierInterface } from "@acces-gerant/application/ports/PasswordVerifierInterface";
import { ScryptPasswordVerifier } from "@acces-gerant/infrastructure/adapters/ScryptPasswordVerifier";
import { FakePasswordVerifier } from "@tests/unit/acces-gerant/fakes/FakePasswordVerifier";

const hashWithScrypt = (password: string): string => {
	const salt = randomBytes(16);

	return `${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`;
};

describe.each([
	[
		"FakePasswordVerifier",
		new FakePasswordVerifier(),
		(password: string): string => {
			return `empreinte(${password})`;
		}
	],
	["ScryptPasswordVerifier", new ScryptPasswordVerifier(), hashWithScrypt]
])("Contrat PasswordVerifierInterface : %s", (_name, verifier: PasswordVerifierInterface, hashOf) => {
	it("accepte le mot de passe qui a produit l'empreinte", async () => {
		// Given
		const passwordHash = hashOf("bon-mot-de-passe");

		// When
		const matches = await verifier.verify("bon-mot-de-passe", passwordHash);

		// Then
		expect(matches).toBe(true);
	});

	it("refuse un autre mot de passe", async () => {
		// Given
		const passwordHash = hashOf("bon-mot-de-passe");

		// When
		const matches = await verifier.verify("mauvais-mot-de-passe", passwordHash);

		// Then
		expect(matches).toBe(false);
	});
});
