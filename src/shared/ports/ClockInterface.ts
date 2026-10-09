/**
 * Port transverse donnant l'heure courante, pour que les règles qui dépendent du temps restent testables.
 */
export interface ClockInterface {
	/**
	 * Renvoie l'instant présent.
	 */
	now(): Date;
}
