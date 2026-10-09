import { Reflector } from "@nestjs/core";

/**
 * Décorateur « route publique » nommé en camelCase, comme l'exige la convention de nommage du lint pour une variable
 * (le nom PublicRoute de l'architecture est écarté, PRINCIPLES-R03). Il marque une route comme publique : le guard global la laisse passer sans session.
 * Toute route non marquée est refusée sans connexion (SECURITY-R12).
 */
export const publicRoute = Reflector.createDecorator<boolean>({
	transform: (): boolean => {
		return true;
	}
});
