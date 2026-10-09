import { ClockInterface } from "@shared/ports/ClockInterface";

/**
 * Horloge réelle du système.
 */
export class SystemClock implements ClockInterface {
	/**
	 * Renvoie l'instant présent du système.
	 */
	public now(): Date {
		return new Date();
	}
}
