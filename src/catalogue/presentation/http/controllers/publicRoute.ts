import { Reflector } from "@nestjs/core";

/**
 * Décorateur « route publique » propre au catalogue : il marque une route que le guard global laisse passer sans session.
 * Déclaré dans ce module plutôt qu'importé d'acces-gerant, car aucun module n'importe un autre module (CODE-ARCHI-R10) ;
 * même nom camelCase que celui d'acces-gerant, pour la même raison de lint. Toute route non marquée est refusée sans connexion (SECURITY-R12).
 */
export const publicRoute = Reflector.createDecorator<boolean>({
	transform: (): boolean => {
		return true;
	}
});
