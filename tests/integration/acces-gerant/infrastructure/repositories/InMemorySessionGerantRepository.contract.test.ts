import { SessionGerantRepositoryInterface } from "@acces-gerant/application/ports/SessionGerantRepositoryInterface";
import { SessionGerant } from "@acces-gerant/domain/SessionGerant";
import { InMemorySessionGerantRepository } from "@acces-gerant/infrastructure/repositories/InMemorySessionGerantRepository";
import { FakeSessionGerantRepository } from "@tests/unit/acces-gerant/fakes/FakeSessionGerantRepository";

describe.each([
	[
		"FakeSessionGerantRepository",
		(): SessionGerantRepositoryInterface => {
			return new FakeSessionGerantRepository();
		}
	],
	[
		"InMemorySessionGerantRepository",
		(): SessionGerantRepositoryInterface => {
			return new InMemorySessionGerantRepository();
		}
	]
])("Contrat SessionGerantRepositoryInterface : %s", (_name, createRepository) => {
	it("retrouve une session enregistrée par son jeton", async () => {
		// Given
		const repository = createRepository();
		await repository.save(new SessionGerant("jeton-1", new Date("2026-10-09T18:00:00.000Z")));

		// When
		const session = await repository.findByToken("jeton-1");

		// Then
		expect(session?.expiresAt).toEqual(new Date("2026-10-09T18:00:00.000Z"));
	});

	it("ne retrouve aucune session pour un jeton inconnu", async () => {
		// Given
		const repository = createRepository();
		await repository.save(new SessionGerant("jeton-1", new Date("2026-10-09T18:00:00.000Z")));

		// When
		const session = await repository.findByToken("jeton-inconnu");

		// Then
		expect(session).toBeUndefined();
	});
});
