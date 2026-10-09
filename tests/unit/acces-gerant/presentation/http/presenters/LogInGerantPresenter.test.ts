import { SessionGerant } from "@acces-gerant/domain/SessionGerant";
import { LogInGerantPresenter } from "@acces-gerant/presentation/http/presenters/LogInGerantPresenter";

describe("LogInGerantPresenter", () => {
	it("affiche la date d'expiration à l'heure de Paris", () => {
		// Given
		const presenter = new LogInGerantPresenter();

		// When
		presenter.present(new SessionGerant("jeton-1", new Date("2026-10-09T16:00:00.000Z")));

		// Then
		expect(presenter.viewModel().expiresAt).toBe("09/10/2026 18:00");
	});

	it("transmet le jeton tel quel", () => {
		// Given
		const presenter = new LogInGerantPresenter();

		// When
		presenter.present(new SessionGerant("jeton-1", new Date("2026-10-09T16:00:00.000Z")));

		// Then
		expect(presenter.viewModel().token).toBe("jeton-1");
	});
});
