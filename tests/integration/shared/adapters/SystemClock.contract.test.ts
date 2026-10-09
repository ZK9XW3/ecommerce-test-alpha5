import { SystemClock } from "@shared/adapters/SystemClock";
import { ClockInterface } from "@shared/ports/ClockInterface";
import { FakeClock } from "@tests/unit/acces-gerant/fakes/FakeClock";

describe.each([
	[
		"FakeClock",
		(): ClockInterface => {
			return new FakeClock(new Date("2026-10-09T10:00:00.000Z"));
		}
	],
	[
		"SystemClock",
		(): ClockInterface => {
			return new SystemClock();
		}
	]
])("Contrat ClockInterface : %s", (_name, createClock) => {
	it("renvoie une date valide", () => {
		// Given
		const clock = createClock();

		// When
		const now = clock.now();

		// Then
		expect(Number.isNaN(now.getTime())).toBe(false);
	});
});
