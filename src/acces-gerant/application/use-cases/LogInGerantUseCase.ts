import { CompteGerantReaderInterface } from "@acces-gerant/application/ports/CompteGerantReaderInterface";
import { LogInGerantPresenterInterface } from "@acces-gerant/application/ports/LogInGerantPresenterInterface";
import { PasswordVerifierInterface } from "@acces-gerant/application/ports/PasswordVerifierInterface";
import { SessionGerantRepositoryInterface } from "@acces-gerant/application/ports/SessionGerantRepositoryInterface";
import { SessionTokenGeneratorInterface } from "@acces-gerant/application/ports/SessionTokenGeneratorInterface";
import { LogInGerantDTO } from "@acces-gerant/application/use-cases/LogInGerantDTO";
import { LogInGerantUseCaseDependenciesInterface } from "@acces-gerant/application/use-cases/LogInGerantUseCaseDependenciesInterface";
import { InvalidCredentialsError } from "@acces-gerant/domain/InvalidCredentialsError";
import { SessionGerant } from "@acces-gerant/domain/SessionGerant";
import { ClockInterface } from "@shared/ports/ClockInterface";

/**
 * Connecte le gérant : vérifie son e-mail et son mot de passe, puis ouvre une session à durée limitée.
 */
export class LogInGerantUseCase {
	private readonly compteGerantReader: CompteGerantReaderInterface;
	private readonly passwordVerifier: PasswordVerifierInterface;
	private readonly sessionTokenGenerator: SessionTokenGeneratorInterface;
	private readonly sessionGerantRepository: SessionGerantRepositoryInterface;
	private readonly clock: ClockInterface;
	private readonly sessionDurationInMilliseconds: number;

	/**
	 * Reçoit les ports et la durée de session nécessaires à la connexion.
	 */
	public constructor(dependencies: LogInGerantUseCaseDependenciesInterface) {
		this.compteGerantReader = dependencies.compteGerantReader;
		this.passwordVerifier = dependencies.passwordVerifier;
		this.sessionTokenGenerator = dependencies.sessionTokenGenerator;
		this.sessionGerantRepository = dependencies.sessionGerantRepository;
		this.clock = dependencies.clock;
		this.sessionDurationInMilliseconds = dependencies.sessionDurationInMilliseconds;
	}

	/**
	 * Met l'e-mail sous une forme comparable : sans espaces autour et en minuscules.
	 */
	private static normalizeEmail(email: string): string {
		return email.trim().toLowerCase();
	}

	/**
	 * Ouvre une session si l'e-mail et le mot de passe sont ceux du compte gérant, puis la transmet au presenter.
	 * Lève InvalidCredentialsError sinon, avec le même message que l'e-mail ou le mot de passe soit faux.
	 */
	public async execute(dto: LogInGerantDTO, presenter: LogInGerantPresenterInterface): Promise<void> {
		await this.ensureCredentialsMatch(dto);
		const session = this.openSession();
		await this.sessionGerantRepository.save(session);
		presenter.present(session);
	}

	/**
	 * Crée une session avec un nouveau jeton, qui expire après la durée de session configurée.
	 */
	private openSession(): SessionGerant {
		const expiresAt = new Date(this.clock.now().getTime() + this.sessionDurationInMilliseconds);

		return new SessionGerant(this.sessionTokenGenerator.generate(), expiresAt);
	}

	/**
	 * Vérifie toujours le mot de passe, même si l'e-mail est faux, pour que la durée de réponse
	 * ne révèle pas si l'e-mail existe.
	 */
	private async ensureCredentialsMatch(dto: LogInGerantDTO): Promise<void> {
		const passwordMatches = await this.passwordVerifier.verify(dto.password, this.compteGerantReader.readPasswordHash());
		const emailMatches = LogInGerantUseCase.normalizeEmail(dto.email) === LogInGerantUseCase.normalizeEmail(this.compteGerantReader.readEmail());

		if (!emailMatches || !passwordMatches) {
			throw new InvalidCredentialsError();
		}
	}
}
