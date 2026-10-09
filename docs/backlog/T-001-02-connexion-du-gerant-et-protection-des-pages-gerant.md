# [2] Connexion du gérant et protection des pages gérant

Statut : À faire
Epic parente : EPIC-001 (EPIC-001-catalogue-cafes-et-stock.md)
Bloqué par : T-001-01 (projet et outils installés)
Lot : LOT-001 (docs/cpo/tickets/2026-10-09-lot-1-catalogue-cafes-et-stock.md)

---
id: T-001-02
revision: 1
sources: [EPIC-001, architecture 2026-10-09 r1 (A1), LOT-001]
---

## Pour l'humain

Le gérant est le seul à pouvoir gérer la boutique. Il se connecte avec son e-mail et son mot de passe ; sans cette connexion, toute page gérant est refusée.

## Pour l'agent

### Comportement attendu

#### Scénario : connexion réussie (détaille : P1 « Le gérant se connecte sur une page dédiée avec son e-mail et son mot de passe »)
- **Given** le compte gérant unique existe avec son e-mail et son mot de passe
- **When** le gérant se connecte avec cet e-mail et ce mot de passe
- **Then** la connexion est acceptée et il reçoit de quoi prouver qu'il est connecté

#### Scénario : mot de passe faux (détaille : P2 « Un e-mail ou un mot de passe faux refuse la connexion »)
- **Given** le compte gérant existe
- **When** quelqu'un se connecte avec le bon e-mail et un mauvais mot de passe
- **Then** la connexion est refusée

#### Scénario : e-mail inconnu (détaille : P2)
- **Given** le compte gérant existe
- **When** quelqu'un se connecte avec un autre e-mail
- **Then** la connexion est refusée, avec le même message que pour un mot de passe faux

#### Scénario : page gérant sans connexion (détaille : P3 « Toutes les pages gérant exigent cette connexion »)
- **Given** une personne qui ne s'est pas connectée
- **When** elle demande une page gérant
- **Then** l'accès est refusé

#### Scénario : connexion expirée (détaille : P3)
- **Given** le gérant s'est connecté et la durée de sa connexion est dépassée
- **When** il demande une page gérant
- **Then** l'accès est refusé et il doit se reconnecter

#### Scénario : page gérant avec connexion (détaille : P3)
- **Given** le gérant est connecté
- **When** il demande une page gérant
- **Then** l'accès est accordé

### Partie technique (lead tech)

Sources abrégées : « Archi » = `docs/cto/architecture/2026-10-09-architecture-boutique-cafe.md` (r3) ; « ADR 0001 » = `docs/cto/adr/0001-architecture-de-base-nestjs-clean-en-memoire.md`. Niveaux de test : recommandation (TESTING-R10, TESTING-R17, TESTING-R19) ; le développeur garde le dernier mot et signale tout écart (TESTING-R21). Pas de Cucumber.

#### Consignes

| Consigne | Source |
|---|---|
| Module `acces-gerant/` : `SessionGerant`, `InvalidCredentialsError`, `InvalidSessionError` (domain) ; `LogInGerantUseCase` (+ DTO, Result, presenter port) ; `AuthenticateSessionGerantUseCase` sans presenter ; ports `CompteGerantReaderInterface`, `PasswordVerifierInterface`, `SessionTokenGeneratorInterface`, `SessionGerantRepositoryInterface` | Archi « Arborescence » acces-gerant/ ; A1 ; dérogation (2) |
| Adapters : `ConfiguredCompteGerantReader`, `ScryptPasswordVerifier` (`scrypt` + `timingSafeEqual`), `CryptoSessionTokenGenerator` (`randomBytes`), `InMemorySessionGerantRepository` | Archi A1 ; SECURITY-R04 |
| `POST /gerant/session` (route publique, décorateur `PublicRoute`) → `LogInGerantController` → presenter/ViewModel `{ token, expiresAt }` ; 401 avec message identique pour e-mail ou mot de passe faux (`AccesGerantHttpErrorFilter`) | Archi « Parcours métier » connexion ; ADR 0001 (approche B) |
| `GerantAuthGuard` **global** : refuse tout sauf routes publiques, en-tête `Authorization: Bearer` ; `UnexpectedErrorFilter` global | Archi A1 ; SECURITY-R12, SECURITY-R07 |
| `AppConfiguration` : e-mail + empreinte du mot de passe, durée de session, échec au démarrage si absent ; documenter la commande qui produit l'empreinte | Archi « bootstrap/configuration » ; « Outils nécessaires » (hachage) |
| Ports transverses `ClockInterface` + `SystemClock`, `LoggerInterface` + `ConsoleLogger` | Archi A4 ; CODE-ARCHI-R09 |

#### Fichiers concernés

```
src/
|-- [A] acces-gerant/domain/{SessionGerant,InvalidCredentialsError,InvalidSessionError}.ts
|-- [A] acces-gerant/application/use-cases/{LogInGerant*,AuthenticateSessionGerant*}.ts
|-- [A] acces-gerant/application/ports/*.ts
|-- [A] acces-gerant/presentation/http/{controllers,requetes,presenters,erreurs}/...
|-- [A] acces-gerant/infrastructure/{repositories,adapters}/...
|-- [A] bootstrap/configuration/AppConfiguration.ts
|-- [A] bootstrap/entrypoints/http/{GerantAuthGuard,UnexpectedErrorFilter}.ts
|-- [M] bootstrap/entrypoints/http/main.ts
|-- [M] bootstrap/composition/AppModule.ts
`-- [A] shared/ports/{ClockInterface,LoggerInterface}.ts, shared/adapters/{SystemClock,ConsoleLogger}.ts
```

#### Niveau de test suggéré par scénario

| Scénario | Niveau suggéré | Pourquoi |
|---|---|---|
| connexion réussie | unit (use case) | `LogInGerantUseCase.execute` avec fakes compte/vérificateur/`FakeClock` (TESTING-R10 ; Archi « Démarche ») |
| mot de passe faux | unit (use case) | Règle du use case, atteignable par `execute` |
| e-mail inconnu | unit (use case) | Idem ; vérifier le même message que pour le mot de passe faux |
| page gérant sans connexion | e2e | Porté par le guard global (Archi « Démarche » : refus sans session = e2e) |
| connexion expirée | unit (use case) + e2e minimal | Expiration décidée par `AuthenticateSessionGerantUseCase` avec `FakeClock` ; l'e2e vérifie seulement le 401 d'un jeton refusé |
| page gérant avec connexion | e2e | Seul l'appel HTTP prouve que le guard laisse passer |

#### Commandes de contrôle

`checks` est vide dans `.config/project.yaml` à ce jour : aucune commande déclarée. Lancer celles que T-001-01 aura renseignées : `checks.types`, `checks.lint`, `checks.format`, `checks.tests`, `checks.build`.

#### Points d'attention

- Aucune route gérant métier n'existe encore : pour P3, le test e2e peut déclarer une route protégée dans son propre module de test Nest, sans code réservé aux tests en production (TESTING-R14).
- Test de contrat fake ↔ `InMemorySessionGerantRepository` (TESTING-R20).
- Jamais de mot de passe en clair dans la configuration ni dans les journaux (SECURITY-R04, SECURITY-R06).

### Critères de fin
- [ ] Chaque scénario est vérifié par au moins un test.
- [ ] Les commandes de contrôle de la partie technique réussissent.
- [ ] Le reste de l'application compile et les tests existants passent.

### Dépendances
- Bloqué par : T-001-01 (projet et outils installés)
