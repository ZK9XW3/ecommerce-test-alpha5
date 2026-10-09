import { LogInGerantDTO } from "@acces-gerant/application/use-cases/LogInGerantDTO";
import { LogInGerantUseCase } from "@acces-gerant/application/use-cases/LogInGerantUseCase";
import { InvalidCredentialsError } from "@acces-gerant/domain/InvalidCredentialsError";
import { FakeClock } from "@tests/unit/acces-gerant/fakes/FakeClock";
import { FakeCompteGerantReader } from "@tests/unit/acces-gerant/fakes/FakeCompteGerantReader";
import { FakeLogInGerantPresenter } from "@tests/unit/acces-gerant/fakes/FakeLogInGerantPresenter";
import { FakePasswordVerifier } from "@tests/unit/acces-gerant/fakes/FakePasswordVerifier";
import { FakeSessionGerantRepository } from "@tests/unit/acces-gerant/fakes/FakeSessionGerantRepository";
import { FakeSessionTokenGenerator } from "@tests/unit/acces-gerant/fakes/FakeSessionTokenGenerator";

describe("LogInGerantUseCase", () => {
	const eightHoursInMilliseconds = 8 * 60 * 60 * 1000;
	let sessionGerantRepository: FakeSessionGerantRepository;
	let presenter: FakeLogInGerantPresenter;
	let logInGerant: LogInGerantUseCase;

	beforeEach(() => {
		sessionGerantRepository = new FakeSessionGerantRepository();
		presenter = new FakeLogInGerantPresenter();
		logInGerant = new LogInGerantUseCase({
			compteGerantReader: new FakeCompteGerantReader("gerant@cafe.fr", "empreinte(bon-mot-de-passe)"),
			passwordVerifier: new FakePasswordVerifier(),
			sessionTokenGenerator: new FakeSessionTokenGenerator(),
			sessionGerantRepository,
			clock: new FakeClock(new Date("2026-10-09T10:00:00.000Z")),
			sessionDurationInMilliseconds: eightHoursInMilliseconds
		});
	});

	it("connexion réussie", async () => {
		// Given
		const dto = new LogInGerantDTO("gerant@cafe.fr", "bon-mot-de-passe");

		// When
		await logInGerant.execute(dto, presenter);

		// Then
		expect(presenter.result()?.token).toBe("jeton-1");
		expect(presenter.result()?.expiresAt).toEqual(new Date("2026-10-09T18:00:00.000Z"));
		expect(await sessionGerantRepository.findByToken("jeton-1")).toBeDefined();
	});

	it("mot de passe faux", async () => {
		// Given
		const dto = new LogInGerantDTO("gerant@cafe.fr", "mauvais-mot-de-passe");

		// When
		const logIn = logInGerant.execute(dto, presenter);

		// Then
		await expect(logIn).rejects.toThrow(InvalidCredentialsError);
		expect(presenter.result()).toBeUndefined();
	});

	it("e-mail inconnu", async () => {
		// Given
		const dto = new LogInGerantDTO("inconnu@cafe.fr", "bon-mot-de-passe");

		// When
		const logIn = logInGerant.execute(dto, presenter);

		// Then
		await expect(logIn).rejects.toThrow(new InvalidCredentialsError().message);
		expect(presenter.result()).toBeUndefined();
	});
});
