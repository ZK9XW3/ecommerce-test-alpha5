import { Module } from "@nestjs/common";
import { APP_FILTER, HttpAdapterHost } from "@nestjs/core";
import { SessionGerantRepositoryInterface } from "@acces-gerant/application/ports/SessionGerantRepositoryInterface";
import { LogInGerantUseCase } from "@acces-gerant/application/use-cases/LogInGerantUseCase";
import { ConfiguredCompteGerantReader } from "@acces-gerant/infrastructure/adapters/ConfiguredCompteGerantReader";
import { CryptoSessionTokenGenerator } from "@acces-gerant/infrastructure/adapters/CryptoSessionTokenGenerator";
import { ScryptPasswordVerifier } from "@acces-gerant/infrastructure/adapters/ScryptPasswordVerifier";
import { InMemorySessionGerantRepository } from "@acces-gerant/infrastructure/repositories/InMemorySessionGerantRepository";
import { LogInGerantController } from "@acces-gerant/presentation/http/controllers/LogInGerantController";
import { AccesGerantHttpErrorFilter } from "@acces-gerant/presentation/http/erreurs/AccesGerantHttpErrorFilter";
import { AppConfiguration } from "@bootstrap/configuration/AppConfiguration";
import { SystemClock } from "@shared/adapters/SystemClock";
import { ClockInterface } from "@shared/ports/ClockInterface";

/**
 * Module racine de l'application : branche chaque port sur son implémentation, les controllers et les filtres d'erreurs.
 */
@Module({
	controllers: [LogInGerantController],
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
			provide: APP_FILTER,
			inject: [HttpAdapterHost],
			useFactory: (httpAdapterHost: HttpAdapterHost): AccesGerantHttpErrorFilter => {
				return new AccesGerantHttpErrorFilter(httpAdapterHost);
			}
		}
	]
})
export class AppModule {}
