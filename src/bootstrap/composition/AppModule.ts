import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, HttpAdapterHost, Reflector } from "@nestjs/core";
import { SessionGerantRepositoryInterface } from "@acces-gerant/application/ports/SessionGerantRepositoryInterface";
import { AuthenticateSessionGerantUseCase } from "@acces-gerant/application/use-cases/AuthenticateSessionGerantUseCase";
import { LogInGerantUseCase } from "@acces-gerant/application/use-cases/LogInGerantUseCase";
import { ConfiguredCompteGerantReader } from "@acces-gerant/infrastructure/adapters/ConfiguredCompteGerantReader";
import { CryptoSessionTokenGenerator } from "@acces-gerant/infrastructure/adapters/CryptoSessionTokenGenerator";
import { ScryptPasswordVerifier } from "@acces-gerant/infrastructure/adapters/ScryptPasswordVerifier";
import { InMemorySessionGerantRepository } from "@acces-gerant/infrastructure/repositories/InMemorySessionGerantRepository";
import { LogInGerantController } from "@acces-gerant/presentation/http/controllers/LogInGerantController";
import { AccesGerantHttpErrorFilter } from "@acces-gerant/presentation/http/erreurs/AccesGerantHttpErrorFilter";
import { CafeRepositoryInterface } from "@catalogue/application/ports/CafeRepositoryInterface";
import { AddCafeUseCase } from "@catalogue/application/use-cases/AddCafeUseCase";
import { ListCataloguePublicUseCase } from "@catalogue/application/use-cases/ListCataloguePublicUseCase";
import { InMemoryCafeRepository } from "@catalogue/infrastructure/repositories/InMemoryCafeRepository";
import { AddCafeController } from "@catalogue/presentation/http/controllers/AddCafeController";
import { ListCataloguePublicController } from "@catalogue/presentation/http/controllers/ListCataloguePublicController";
import { CatalogueHttpErrorFilter } from "@catalogue/presentation/http/erreurs/CatalogueHttpErrorFilter";
import { AppConfiguration } from "@bootstrap/configuration/AppConfiguration";
import { GerantAuthGuard } from "@bootstrap/entrypoints/http/GerantAuthGuard";
import { UnexpectedErrorFilter } from "@bootstrap/entrypoints/http/UnexpectedErrorFilter";
import { ReglagesBoutiqueRepositoryInterface } from "@reglages-boutique/application/ports/ReglagesBoutiqueRepositoryInterface";
import { GetReglagesBoutiqueUseCase } from "@reglages-boutique/application/use-cases/GetReglagesBoutiqueUseCase";
import { UpdateReglagesBoutiqueUseCase } from "@reglages-boutique/application/use-cases/UpdateReglagesBoutiqueUseCase";
import { InMemoryReglagesBoutiqueRepository } from "@reglages-boutique/infrastructure/repositories/InMemoryReglagesBoutiqueRepository";
import { GetReglagesBoutiqueController } from "@reglages-boutique/presentation/http/controllers/GetReglagesBoutiqueController";
import { UpdateReglagesBoutiqueController } from "@reglages-boutique/presentation/http/controllers/UpdateReglagesBoutiqueController";
import { ReglagesBoutiqueHttpErrorFilter } from "@reglages-boutique/presentation/http/erreurs/ReglagesBoutiqueHttpErrorFilter";
import { ConsoleLogger } from "@shared/adapters/ConsoleLogger";
import { RandomUuidGenerator } from "@shared/adapters/RandomUuidGenerator";
import { SystemClock } from "@shared/adapters/SystemClock";
import { ClockInterface } from "@shared/ports/ClockInterface";
import { IdGeneratorInterface } from "@shared/ports/IdGeneratorInterface";
import { LoggerInterface } from "@shared/ports/LoggerInterface";

/**
 * Module racine de l'application : branche chaque port sur son implémentation, les controllers,
 * le guard global et les filtres d'erreurs.
 */
@Module({
	controllers: [LogInGerantController, GetReglagesBoutiqueController, UpdateReglagesBoutiqueController, AddCafeController, ListCataloguePublicController],
	providers: [
		{
			provide: AppConfiguration,
			useFactory: (): AppConfiguration => {
				return AppConfiguration.fromEnvironment(process.env);
			}
		},
		{
			provide: InMemorySessionGerantRepository,
			useFactory: (): InMemorySessionGerantRepository => {
				return new InMemorySessionGerantRepository();
			}
		},
		{
			provide: SystemClock,
			useFactory: (): SystemClock => {
				return new SystemClock();
			}
		},
		{
			provide: LogInGerantUseCase,
			inject: [AppConfiguration, InMemorySessionGerantRepository, SystemClock],
			useFactory: (configuration: AppConfiguration, sessionGerantRepository: SessionGerantRepositoryInterface, clock: ClockInterface): LogInGerantUseCase => {
				return new LogInGerantUseCase({
					compteGerantReader: new ConfiguredCompteGerantReader(configuration.gerantEmail, configuration.gerantPasswordHash),
					passwordVerifier: new ScryptPasswordVerifier(),
					sessionTokenGenerator: new CryptoSessionTokenGenerator(),
					sessionGerantRepository,
					clock,
					sessionDurationInMilliseconds: configuration.sessionDurationInMilliseconds
				});
			}
		},
		{
			provide: ConsoleLogger,
			useFactory: (): ConsoleLogger => {
				return new ConsoleLogger();
			}
		},
		{
			provide: AuthenticateSessionGerantUseCase,
			inject: [InMemorySessionGerantRepository, SystemClock],
			useFactory: (sessionGerantRepository: SessionGerantRepositoryInterface, clock: ClockInterface): AuthenticateSessionGerantUseCase => {
				return new AuthenticateSessionGerantUseCase(sessionGerantRepository, clock);
			}
		},
		{
			provide: APP_GUARD,
			inject: [Reflector, AuthenticateSessionGerantUseCase],
			useFactory: (reflector: Reflector, authenticateSessionGerant: AuthenticateSessionGerantUseCase): GerantAuthGuard => {
				return new GerantAuthGuard(reflector, authenticateSessionGerant);
			}
		},
		{
			provide: APP_FILTER,
			inject: [HttpAdapterHost, ConsoleLogger],
			useFactory: (httpAdapterHost: HttpAdapterHost, logger: LoggerInterface): UnexpectedErrorFilter => {
				return new UnexpectedErrorFilter(httpAdapterHost, logger);
			}
		},
		{
			provide: APP_FILTER,
			inject: [HttpAdapterHost],
			useFactory: (httpAdapterHost: HttpAdapterHost): AccesGerantHttpErrorFilter => {
				return new AccesGerantHttpErrorFilter(httpAdapterHost);
			}
		},
		{
			provide: InMemoryReglagesBoutiqueRepository,
			inject: [AppConfiguration],
			useFactory: (configuration: AppConfiguration): InMemoryReglagesBoutiqueRepository => {
				return new InMemoryReglagesBoutiqueRepository(configuration.createReglagesBoutiqueInitiaux());
			}
		},
		{
			provide: GetReglagesBoutiqueUseCase,
			inject: [InMemoryReglagesBoutiqueRepository],
			useFactory: (reglagesBoutiqueRepository: ReglagesBoutiqueRepositoryInterface): GetReglagesBoutiqueUseCase => {
				return new GetReglagesBoutiqueUseCase(reglagesBoutiqueRepository);
			}
		},
		{
			provide: UpdateReglagesBoutiqueUseCase,
			inject: [InMemoryReglagesBoutiqueRepository],
			useFactory: (reglagesBoutiqueRepository: ReglagesBoutiqueRepositoryInterface): UpdateReglagesBoutiqueUseCase => {
				return new UpdateReglagesBoutiqueUseCase(reglagesBoutiqueRepository);
			}
		},
		{
			provide: APP_FILTER,
			inject: [HttpAdapterHost],
			useFactory: (httpAdapterHost: HttpAdapterHost): ReglagesBoutiqueHttpErrorFilter => {
				return new ReglagesBoutiqueHttpErrorFilter(httpAdapterHost);
			}
		},
		{
			provide: InMemoryCafeRepository,
			useFactory: (): InMemoryCafeRepository => {
				return new InMemoryCafeRepository();
			}
		},
		{
			provide: RandomUuidGenerator,
			useFactory: (): RandomUuidGenerator => {
				return new RandomUuidGenerator();
			}
		},
		{
			provide: AddCafeUseCase,
			inject: [InMemoryCafeRepository, RandomUuidGenerator],
			useFactory: (cafeRepository: CafeRepositoryInterface, idGenerator: IdGeneratorInterface): AddCafeUseCase => {
				return new AddCafeUseCase(cafeRepository, idGenerator);
			}
		},
		{
			provide: ListCataloguePublicUseCase,
			inject: [InMemoryCafeRepository],
			useFactory: (cafeRepository: CafeRepositoryInterface): ListCataloguePublicUseCase => {
				return new ListCataloguePublicUseCase(cafeRepository);
			}
		},
		{
			provide: APP_FILTER,
			inject: [HttpAdapterHost],
			useFactory: (httpAdapterHost: HttpAdapterHost): CatalogueHttpErrorFilter => {
				return new CatalogueHttpErrorFilter(httpAdapterHost);
			}
		}
	]
})
export class AppModule {}
