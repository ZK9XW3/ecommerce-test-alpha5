import { ClockInterface } from "@shared/ports/ClockInterface";

/**
 * Horloge figée pour les tests : renvoie toujours l'instant reçu à la construction.
 */
export class FakeClock implements ClockInterface {
	/**
	 * Fige l'horloge sur l'instant donné.
	 */
	public constructor(private readonly currentInstant: Date) {}

	/**
	 * Renvoie l'instant figé.
	 */
	public now(): Date {
		return new Date(this.currentInstant.getTime());
	}
}
