import { AuthenticateSessionGerantDTO } from "@acces-gerant/application/use-cases/AuthenticateSessionGerantDTO";
import { AuthenticateSessionGerantUseCase } from "@acces-gerant/application/use-cases/AuthenticateSessionGerantUseCase";
import { InvalidSessionError } from "@acces-gerant/domain/InvalidSessionError";
import { SessionGerant } from "@acces-gerant/domain/SessionGerant";
import { FakeClock } from "@tests/unit/acces-gerant/fakes/FakeClock";
import { FakeSessionGerantRepository } from "@tests/unit/acces-gerant/fakes/FakeSessionGerantRepository";

describe("AuthenticateSessionGerantUseCase", () => {
	let sessionGerantRepository: FakeSessionGerantRepository;
	let authenticateSessionGerant: AuthenticateSessionGerantUseCase;

	beforeEach(async () => {
		sessionGerantRepository = new FakeSessionGerantRepository();
		await sessionGerantRepository.save(new SessionGerant("jeton-valide", new Date("2026-10-09T18:00:00.000Z")));
		await sessionGerantRepository.save(new SessionGerant("jeton-expire", new Date("2026-10-09T09:59:00.000Z")));
		authenticateSessionGerant = new AuthenticateSessionGerantUseCase(sessionGerantRepository, new FakeClock(new Date("2026-10-09T10:00:00.000Z")));
	});

	it("page gérant avec connexion", async () => {
		// Given
		const dto = new AuthenticateSessionGerantDTO("jeton-valide");

		// When
		const authentication = authenticateSessionGerant.execute(dto);

		// Then
		await expect(authentication).resolves.toBeUndefined();
	});

	it("connexion expirée", async () => {
		// Given
		const dto = new AuthenticateSessionGerantDTO("jeton-expire");

		// When
		const authentication = authenticateSessionGerant.execute(dto);

		// Then
		await expect(authentication).rejects.toThrow(InvalidSessionError);
	});

	it("refuse un jeton inconnu", async () => {
		// Given
		const dto = new AuthenticateSessionGerantDTO("jeton-inconnu");

		// When
		const authentication = authenticateSessionGerant.execute(dto);

		// Then
		await expect(authentication).rejects.toThrow(InvalidSessionError);
	});
});
