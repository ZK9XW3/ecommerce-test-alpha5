import { CompteGerantReaderInterface } from "@acces-gerant/application/ports/CompteGerantReaderInterface";
import { PasswordVerifierInterface } from "@acces-gerant/application/ports/PasswordVerifierInterface";
import { SessionGerantRepositoryInterface } from "@acces-gerant/application/ports/SessionGerantRepositoryInterface";
import { SessionTokenGeneratorInterface } from "@acces-gerant/application/ports/SessionTokenGeneratorInterface";
import { ClockInterface } from "@shared/ports/ClockInterface";

/**
 * Dépendances de la connexion du gérant, regroupées car elles dépassent la limite de paramètres (STYLE-R21).
 */
export interface LogInGerantUseCaseDependenciesInterface {
	compteGerantReader: CompteGerantReaderInterface;
	passwordVerifier: PasswordVerifierInterface;
	sessionTokenGenerator: SessionTokenGeneratorInterface;
	sessionGerantRepository: SessionGerantRepositoryInterface;
	clock: ClockInterface;
	sessionDurationInMilliseconds: number;
}
