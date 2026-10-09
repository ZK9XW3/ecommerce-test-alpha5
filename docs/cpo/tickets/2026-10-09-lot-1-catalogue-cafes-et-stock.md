---
id: LOT-001
revision: 2
sources: [lot CEO rang 1 (EPIC-001), docs/backlog/EPIC-001-catalogue-cafes-et-stock.md@5034a88, docs/cto/architecture/2026-10-09-architecture-boutique-cafe.md r1 (A1–A12, Q1–Q3 validés), docs/cto/adr/0001-architecture-de-base-nestjs-clean-en-memoire.md r1]
---

# Lot de tickets : EPIC-001 Catalogue de cafés et stock (rang 1)

Règles : DECOMPOSITION-R01 à DECOMPOSITION-R14 (`decomposition/decomposition.md`).

Décisions de l'utilisateur appliquées : « sous le seuil » = strictement inférieur ; remonter le seuil n'envoie aucune alerte ; une adresse d'alerte mal formée est refusée ; noms métier en français.

## Tickets

Points de l'epic (numérotés dans l'ordre du « Comportement attendu ») :
P1 connexion · P2 refus identifiants faux · P3 pages gérant protégées · P4 ajout café · P5 modification · P6 suppression café jamais commandé · P7 refus suppression café commandé · P8 cacher · P9 réafficher · P10 catalogue public · P11 saisir/corriger stock · P12 consulter stock · P13 seuil · P14 adresse d'alerte · P15 frais de livraison · P16 liste stock bas · P17 e-mail d'alerte · P18 visiteur sans accès bloqué.

| Numéro | Id | Titre | Bloqué par | Couverture |
|---|---|---|---|---|
| [1] | T-001-01 | Installer les outils du projet | aucun | (outillage, aucun point direct) |
| [2] | T-001-02 | Connexion du gérant et protection des pages gérant | T-001-01 | P1, P2, P3 |
| [4] | T-001-03 | Ajouter un café et le voir dans le catalogue public | T-001-04 | P4, P10, P18 (ajout) |
| [3] | T-001-04 | Régler seuil, adresse d'alerte et frais de livraison | T-001-02 | P13, P14, P15, P18 (réglages) |
| [5] | T-001-05 | Modifier un café | T-001-03 | P5, P18 (modification) |
| [6] | T-001-06 | Cacher et réafficher un café | T-001-05 | P8, P9, P10, P18 (cacher) |
| [7] | T-001-07 | Supprimer un café | T-001-06 | P6, P7, P18 (suppression) |
| [8] | T-001-08 | Saisir, corriger et consulter le stock | T-001-07 | P11, P12, P18 (stock) |
| [9] | T-001-09 | Voir les cafés sous le seuil | T-001-04, T-001-08 | P16 |
| [10] | T-001-10 | Envoyer l'alerte e-mail au passage sous le seuil | T-001-09 | P17 |

Aucun ticket parallèle : T-001-03 et T-001-04 partagent le fichier de câblage de l'application, ils sont donc enchaînés (réglages d'abord, comme le recommande la démarche de l'architecture).

Tickets d'outillage (DECOMPOSITION-R14) : T-001-01 (un seul ticket couvre tous les outils de la rubrique « Outils nécessaires », car ils partagent les mêmes fichiers de projet et ne sont pas parallélisables).

## Graphe des dépendances

```
T-001-01 -> T-001-02
T-001-02 -> T-001-04 -> T-001-03 -> T-001-05 -> T-001-06 -> T-001-07 -> T-001-08 -> T-001-09 -> T-001-10
(flèche = « doit être terminé avant »)
```

Justification des dépendances :
- T-001-02 ← T-001-01 : le projet et ses outils doivent exister.
- T-001-04 ← T-001-02 : les actions gérant reposent sur la connexion et la protection des pages.
- T-001-03 ← T-001-04 : les deux modifient le même fichier de câblage de l'application (relecture du lead tech).
- T-001-05, -06, -07, -08 en chaîne : chacun enrichit le même café (mêmes données et mêmes règles), donc pas de parallèle possible.
- T-001-09 ← T-001-04 (seuil) et T-001-08 (stock).
- T-001-10 ← T-001-09 : même règle « sous le seuil » et adresse d'alerte réglée.

## Relecture du lead tech
- Dépendances justifiées et sans boucle ; tickets faisables seuls ; P1 à P18 couverts, niveau de test proposé par scénario.
- Parallélisme : T-001-03 et T-001-04 partageaient le fichier de câblage (`AppModule.ts`). Demande de découpage (DECOMPOSITION-R22) acceptée par le PO : T-001-04 passe en [3], T-001-03 en [4], la suite décalée d'un cran.
- T-001-02 : protection testée avec une page déclarée uniquement dans le test (TESTING-R14), aucune page gérant n'existant encore.
- T-001-06 crée la liste des cafés côté gérant (sans stock), enrichie du stock en T-001-08 ; couvert par la chaîne existante.
- Aucune question technique bloquante. `checks` sera renseigné par T-001-01.

## Raccourcis métier proposés
- aucun

---

# [1] Installer les outils du projet

---
id: T-001-01
revision: 1
sources: [EPIC-001, architecture 2026-10-09 r1 rubrique « Outils nécessaires », ADR 0001 r1, LOT-001]
---

## Pour l'humain

Le projet ne contient encore aucun code. Avant de construire la boutique, il faut installer et régler les outils retenus par l'architecte, pour que chaque ticket suivant puisse être vérifié automatiquement.

## Pour l'agent

### Comportement attendu

Ticket purement technique : pas de scénario, des critères binaires.
- [ ] Chaque outil de la rubrique « Outils nécessaires » de l'architecture est installé, après confirmation de l'utilisateur pour chaque installation (SECURITY-R03).
- [ ] La version de chaque outil est vérifiée au moment de l'installation (SECURITY-R08, SECURITY-R09).
- [ ] Les modèles de configuration d'outils du plugin sont appliqués.
- [ ] La clé `checks` de `.config/project.yaml` est renseignée pour chaque contrôle disponible.
- [ ] Le projet vide démarre sans erreur.

### Partie technique (lead tech)

Sources abrégées : « Archi » = `docs/cto/architecture/2026-10-09-architecture-boutique-cafe.md` (r3) ; « ADR 0001 » = `docs/cto/adr/0001-architecture-de-base-nestjs-clean-en-memoire.md`. Niveaux de test : recommandation (TESTING-R10, TESTING-R17, TESTING-R19) ; le développeur garde le dernier mot et signale tout écart (TESTING-R21). Pas de Cucumber.

#### Consignes

| Consigne | Source |
|---|---|
| Projet NestJS en **CommonJS**, TypeScript strict, Node ≥ 24.9 | Archi « Outils nécessaires » ; NESTJS-R03 ; ADR 0001 |
| Jest + supertest (dossiers `tests/unit`, `tests/integration`, `tests/e2e`) | Archi « Outils nécessaires », A8 ; TESTING-R09, TESTING-R19 |
| ESLint + typescript-eslint avec les modèles du plugin `skills/developpeur/assets/lint/eslint.config.mjs` + `eslint.nestjs.mjs` ; `eslint-plugin-boundaries` configuré pour couches, modules, `shared`, `bootstrap` | Archi « Outils nécessaires », « Sens des dépendances » ; STYLE-R12, CODE-ARCHI-R10, NESTJS-R01 |
| Prettier avec `skills/developpeur/assets/lint/.prettierrc` du plugin | Archi « Outils nécessaires » ; STYLE-R12 |
| Alias `paths` du tsconfig + `moduleNameMapper` Jest (`@acces-gerant/*`, `@catalogue/*`, `@reglages-boutique/*`, `@bootstrap/*`, `@shared/*`) | Archi « Outils nécessaires » ; STYLE-R23 |
| `class-validator` + `class-transformer` (accord de l'utilisateur avant chaque dépendance), `npm audit` après ajout | Archi A9 ; SECURITY-R03, SECURITY-R08 |
| Point d'entrée minimal `src/bootstrap/entrypoints/http/main.ts` + `src/bootstrap/composition/AppModule.ts` vide (seul `@Module`) + `ValidationPipe` global | Archi « Arborescence finale détaillée » (bootstrap/) |
| Renseigner `checks.types` (`tsc --noEmit`), `checks.lint`, `checks.format`, `checks.tests` (Jest), `checks.build` (`nest build`) | Archi « Outils nécessaires » ; DECOMPOSITION-R14 |

#### Fichiers concernés

```
<root>/
|-- [A] package.json, package-lock.json   dépendances et scripts (lint, format, typecheck, test, build)
|-- [A] tsconfig.json, tsconfig.build.json strict, CommonJS, paths
|-- [A] nest-cli.json                      entrée bootstrap/entrypoints/http/main
|-- [A] jest.config.*                      moduleNameMapper des alias
|-- [A] eslint.config.mjs, eslint.nestjs.mjs, .prettierrc   modèles du plugin
|-- [A] src/bootstrap/entrypoints/http/main.ts
|-- [A] src/bootstrap/composition/AppModule.ts
|-- [A] tests/e2e/bootstrap/...test.ts     test de fumée : l'application démarre
`-- [M] .config/project.yaml               clé checks
```

#### Commandes de contrôle

`checks` est vide : ce ticket le renseigne. Clés à remplir : `checks.types`, `checks.lint`, `checks.format`, `checks.tests`, `checks.build`. Toutes doivent réussir sur le projet vide.

#### Points d'attention

- Ticket d'outillage : aucun scénario ; un test e2e de fumée (l'application démarre) prouve le critère « le projet vide démarre ».
- Vérifier la version de chaque outil installé (SECURITY-R08, SECURITY-R09) et demander l'accord par dépendance (SECURITY-R03).

### Critères de fin
- [ ] Chaque critère ci-dessus est vérifié.
- [ ] Les commandes de contrôle de la partie technique réussissent.
- [ ] Le reste de l'application compile et les tests existants passent.

### Dépendances
- Bloqué par : aucun

---

# [2] Connexion du gérant et protection des pages gérant

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

---

# [4] Ajouter un café et le voir dans le catalogue public

---
id: T-001-03
revision: 1
sources: [EPIC-001, architecture 2026-10-09 r1, LOT-001]
---

## Pour l'humain

Le gérant crée la fiche d'un café (nom, origine, description, un prix par format) et les clients le voient aussitôt dans le catalogue public.

## Pour l'agent

### Comportement attendu

#### Scénario : ajout complet (détaille : P4 « Le gérant ajoute un café avec un nom, une origine, une description et un prix pour chacun des trois formats »)
- **Given** le gérant est connecté
- **When** il ajoute le café « Moka Sidamo », origine « Éthiopie », une description, et les prix 9,00 € (250 g), 17,00 € (500 g), 32,00 € (1 kg)
- **Then** le café est enregistré, visible, avec ces informations

#### Scénario : format sans prix (détaille : P4, règle « chaque café est toujours proposé dans les trois formats »)
- **Given** le gérant est connecté
- **When** il ajoute un café sans prix pour le format 1 kg
- **Then** l'ajout est refusé avec un message qui indique le prix manquant

#### Scénario : information obligatoire manquante (détaille : P4)
- **Given** le gérant est connecté
- **When** il ajoute un café sans nom, sans origine ou sans description
- **Then** l'ajout est refusé avec un message qui indique l'information manquante

#### Scénario : catalogue public (détaille : P10 « Le catalogue public liste les cafés visibles avec leur origine, leur description et le prix de chaque format »)
- **Given** le café « Moka Sidamo » a été ajouté
- **When** un visiteur consulte le catalogue public, sans connexion
- **Then** il voit ce café avec son origine, sa description et le prix de chacun des trois formats

#### Scénario : ajout par un visiteur (détaille : P18 « Un visiteur sans accès gérant ne peut ni ajouter… »)
- **Given** un visiteur non connecté
- **When** il tente d'ajouter un café
- **Then** l'ajout est refusé et aucun café n'est créé

### Partie technique (lead tech)

Sources abrégées : « Archi » = `docs/cto/architecture/2026-10-09-architecture-boutique-cafe.md` (r3) ; « ADR 0001 » = `docs/cto/adr/0001-architecture-de-base-nestjs-clean-en-memoire.md`. Niveaux de test : recommandation (TESTING-R10, TESTING-R17, TESTING-R19) ; le développeur garde le dernier mot et signale tout écart (TESTING-R21). Pas de Cucumber.

#### Consignes

| Consigne | Source |
|---|---|
| Domaine `catalogue/domain/cafe/` : `Cafe` (visible par défaut, stock 0), `CafeFieldsInterface`, `FormatCafe` (250 g, 500 g, 1 kg), `PrixParFormat` (prix > 0 pour les 3 formats), `InvalidCafeError` ; `domain/shared/Montant` (centimes) | Archi « Arborescence » catalogue/ ; « Contrats utiles » AddCafe |
| `AddCafeUseCase` + `AddCafeDTO` (implements `CafeFieldsInterface`) + `AddCafeResult` + `AddCafePresenterInterface` ; `ListCataloguePublicUseCase` + Result + presenter port | Archi « Arborescence » ; ADR 0001 (approche B) |
| Port `CafeRepositoryInterface` (`save`, `findById`, `findAll`, `delete`) + `InMemoryCafeRepository` ; `IdGeneratorInterface` + `RandomUuidGenerator` dans `shared/` | Archi « Contrats utiles » ; A5 |
| `POST /gerant/cafes` (`AddCafeController`, `AddCafeRequest`) ; `GET /catalogue` public (`ListCataloguePublicController`) ; presenters (« 12,50 € », « 250 g ») ; `CatalogueHttpErrorFilter` (`InvalidCafeError` → 422 avec l'information manquante) | Archi « Arborescence » presentation/http ; CODE-ARCHI-R13 |
| Câbler les providers du catalogue dans `AppModule` (useFactory port → adapter) | Archi « bootstrap/composition » |

#### Fichiers concernés

```
src/
|-- [A] catalogue/domain/cafe/{Cafe,CafeFieldsInterface,FormatCafe,PrixParFormat,InvalidCafeError}.ts
|-- [A] catalogue/domain/shared/Montant.ts
|-- [A] catalogue/application/use-cases/{AddCafe*,ListCataloguePublic*}.ts
|-- [A] catalogue/application/ports/{CafeRepositoryInterface,AddCafePresenterInterface,ListCataloguePublicPresenterInterface}.ts
|-- [A] catalogue/presentation/http/{controllers,requetes,presenters,erreurs}/...
|-- [A] catalogue/infrastructure/repositories/InMemoryCafeRepository.ts
|-- [A] shared/ports/IdGeneratorInterface.ts, shared/adapters/RandomUuidGenerator.ts
`-- [M] bootstrap/composition/AppModule.ts
```

#### Niveau de test suggéré par scénario

| Scénario | Niveau suggéré | Pourquoi |
|---|---|---|
| ajout complet | unit (use case) | `AddCafeUseCase.execute`, domaine réel et fakes (TESTING-R10) |
| format sans prix | unit (use case) | Refus atteignable par `execute` : pas de test direct de `PrixParFormat` (TESTING-R17) |
| information obligatoire manquante | unit (use case) | Un cas par information (nom, origine, description) |
| catalogue public | unit (use case) + unit presenter | `ListCataloguePublicUseCase` ; mise en forme des prix sur le presenter (Archi « Démarche ») |
| ajout par un visiteur | e2e | Le refus passe par `GerantAuthGuard` global : seul l'appel HTTP le traverse (TESTING-R19) ; un test (401 + état inchangé) suffit, sans doublon unitaire (TESTING-R17) |

#### Commandes de contrôle

`checks` est vide dans `.config/project.yaml` à ce jour : aucune commande déclarée. Lancer celles que T-001-01 aura renseignées : `checks.types`, `checks.lint`, `checks.format`, `checks.tests`, `checks.build`.

#### Points d'attention

- Montants en centimes entiers jusqu'au presenter (Archi « Contrats utiles »).
- Test de contrat `FakeCafeRepository` ↔ `InMemoryCafeRepository` (TESTING-R20).
- Fichier partagé avec T-001-04 : `bootstrap/composition/AppModule.ts` (voir relecture du découpage).

### Critères de fin
- [ ] Chaque scénario est vérifié par au moins un test.
- [ ] Les commandes de contrôle de la partie technique réussissent.
- [ ] Le reste de l'application compile et les tests existants passent.

### Dépendances
- Bloqué par : T-001-04 (même fichier de câblage de l'application ; T-001-04 dépend de la connexion)

---

# [3] Régler seuil, adresse d'alerte et frais de livraison

---
id: T-001-04
revision: 1
sources: [EPIC-001, architecture 2026-10-09 r1 (A6, Q2, Q3), LOT-001]
---

## Pour l'humain

Sur un seul écran de réglages, le gérant fixe le seuil de stock bas commun à tous les cafés, l'adresse qui reçoit les alertes et le prix fixe des frais de livraison.

## Pour l'agent

### Comportement attendu

#### Scénario : valeurs de départ (détaille : P13, P14, P15)
- **Given** la boutique vient de démarrer
- **When** le gérant connecté consulte les réglages
- **Then** il voit le seuil, l'adresse d'alerte et les frais de livraison de départ

#### Scénario : régler le seuil (détaille : P13 « Le gérant règle le seuil de stock bas, commun à tous les cafés »)
- **Given** le gérant est connecté
- **When** il règle le seuil à 2 kg
- **Then** les réglages affichent un seuil de 2 kg, valable pour tous les cafés

#### Scénario : seuil négatif (détaille : P13)
- **Given** le gérant est connecté
- **When** il règle le seuil à -1 kg
- **Then** le réglage est refusé et l'ancien seuil est conservé

#### Scénario : régler l'adresse d'alerte (détaille : P14 « Le gérant règle l'adresse e-mail qui reçoit les alertes »)
- **Given** le gérant est connecté
- **When** il règle l'adresse d'alerte à « stock@cafe-exemple.fr »
- **Then** les réglages affichent cette adresse

#### Scénario : adresse mal formée (détaille : P14, décision utilisateur)
- **Given** le gérant est connecté
- **When** il règle l'adresse d'alerte à « stock-cafe-exemple »
- **Then** le réglage est refusé avec un message et l'ancienne adresse est conservée

#### Scénario : régler les frais de livraison (détaille : P15 « Le gérant règle le prix fixe des frais de livraison dans l'écran de réglages »)
- **Given** le gérant est connecté
- **When** il règle les frais de livraison à 4,90 €
- **Then** les réglages affichent 4,90 €, à côté du seuil et de l'adresse d'alerte

#### Scénario : frais négatifs (détaille : P15)
- **Given** le gérant est connecté
- **When** il règle les frais de livraison à -2,00 €
- **Then** le réglage est refusé et l'ancien prix est conservé

#### Scénario : réglages par un visiteur (détaille : P18 « … ni changer le seuil, l'adresse d'alerte ou les frais de livraison »)
- **Given** un visiteur non connecté
- **When** il tente de changer le seuil, l'adresse d'alerte ou les frais de livraison
- **Then** la demande est refusée et les réglages restent inchangés

### Partie technique (lead tech)

Sources abrégées : « Archi » = `docs/cto/architecture/2026-10-09-architecture-boutique-cafe.md` (r3) ; « ADR 0001 » = `docs/cto/adr/0001-architecture-de-base-nestjs-clean-en-memoire.md`. Niveaux de test : recommandation (TESTING-R10, TESTING-R17, TESTING-R19) ; le développeur garde le dernier mot et signale tout écart (TESTING-R21). Pas de Cucumber.

#### Consignes

| Consigne | Source |
|---|---|
| Module `reglages-boutique/` : entité `ReglagesBoutique` (seuil `PoidsStock`, adresse `AdresseEmail`, frais `Montant`), `ReglagesBoutiqueFieldsInterface`, `InvalidReglagesBoutiqueError` ; value objects propres au module (aucun import du catalogue) | Archi « Arborescence » reglages-boutique/ ; CODE-ARCHI-R10 |
| `GetReglagesBoutiqueUseCase` + Result ; `UpdateReglagesBoutiqueUseCase` + DTO (remplacement d'un bloc ; refus = réglages inchangés) ; presenter ports | Archi « Contrats utiles » UpdateReglagesBoutique ; Q3 |
| `InMemoryReglagesBoutiqueRepository` initialisé avec les valeurs **obligatoires** lues dans `AppConfiguration` | Archi A6 |
| `GET /gerant/settings`, `PUT /gerant/settings` ; presenters (« 2,000 kg », « 4,90 € ») ; `ReglagesBoutiqueHttpErrorFilter` (`InvalidReglagesBoutiqueError` → 422) | Archi « Arborescence » presentation/http ; Q3 |
| Câbler le module dans `AppModule` | Archi « bootstrap/composition » |

#### Fichiers concernés

```
src/
|-- [A] reglages-boutique/domain/{ReglagesBoutique,ReglagesBoutiqueFieldsInterface,AdresseEmail,Montant,PoidsStock,InvalidReglagesBoutiqueError}.ts
|-- [A] reglages-boutique/application/{use-cases,ports}/...
|-- [A] reglages-boutique/presentation/http/{controllers,requetes,presenters,erreurs}/...
|-- [A] reglages-boutique/infrastructure/repositories/InMemoryReglagesBoutiqueRepository.ts
|-- [M] bootstrap/configuration/AppConfiguration.ts   réglages initiaux
`-- [M] bootstrap/composition/AppModule.ts
```

#### Niveau de test suggéré par scénario

| Scénario | Niveau suggéré | Pourquoi |
|---|---|---|
| valeurs de départ | unit (use case) | `GetReglagesBoutiqueUseCase` avec un fake initialisé |
| régler le seuil | unit (use case) | `UpdateReglagesBoutiqueUseCase.execute` (TESTING-R10) |
| seuil négatif | unit (use case) | Refus via `execute`, ancien seuil conservé |
| régler l'adresse d'alerte | unit (use case) | Idem |
| adresse mal formée | unit (use case) | Q3 ; pas de test direct de `AdresseEmail` (TESTING-R17) |
| régler les frais de livraison | unit (use case) + unit presenter | Mise en forme « 4,90 € » sur le presenter |
| frais négatifs | unit (use case) | Refus, ancien prix conservé |
| réglages par un visiteur | e2e | Le refus passe par `GerantAuthGuard` global : seul l'appel HTTP le traverse (TESTING-R19) ; un test (401 + état inchangé) suffit, sans doublon unitaire (TESTING-R17) |

#### Commandes de contrôle

`checks` est vide dans `.config/project.yaml` à ce jour : aucune commande déclarée. Lancer celles que T-001-01 aura renseignées : `checks.types`, `checks.lint`, `checks.format`, `checks.tests`, `checks.build`.

#### Points d'attention

- `PUT` remplace les trois valeurs d'un bloc (Archi « Contrats utiles ») : un refus laisse les trois inchangées.
- Test de contrat fake ↔ `InMemoryReglagesBoutiqueRepository` (TESTING-R20).
- Fichiers partagés avec T-001-03 : `AppModule.ts` ; `AppConfiguration.ts` (créé en T-001-02) est modifié ici seulement.

### Critères de fin
- [ ] Chaque scénario est vérifié par au moins un test.
- [ ] Les commandes de contrôle de la partie technique réussissent.
- [ ] Le reste de l'application compile et les tests existants passent.

### Dépendances
- Bloqué par : T-001-02 (connexion et protection des pages gérant)

---

# [5] Modifier un café

---
id: T-001-05
revision: 1
sources: [EPIC-001, architecture 2026-10-09 r1, LOT-001]
---

## Pour l'humain

Le gérant corrige la fiche d'un café existant : nom, origine, description ou prix d'un format.

## Pour l'agent

### Comportement attendu

#### Scénario : modifier les informations (détaille : P5 « Le gérant modifie chacune de ces informations »)
- **Given** le café « Moka Sidamo » existe et le gérant est connecté
- **When** il change son nom, son origine, sa description et le prix du format 500 g à 18,00 €
- **Then** la fiche et le catalogue public affichent les nouvelles valeurs

#### Scénario : modification qui retire un prix (détaille : P5, règle des trois formats)
- **Given** le café existe et le gérant est connecté
- **When** il enregistre une modification sans prix pour le format 250 g
- **Then** la modification est refusée et la fiche reste inchangée

#### Scénario : café inconnu (détaille : P5)
- **Given** le gérant est connecté
- **When** il modifie un café qui n'existe pas
- **Then** la demande est refusée avec un message « café introuvable »

#### Scénario : modification par un visiteur (détaille : P18)
- **Given** un visiteur non connecté
- **When** il tente de modifier un café
- **Then** la demande est refusée et la fiche reste inchangée

### Partie technique (lead tech)

Sources abrégées : « Archi » = `docs/cto/architecture/2026-10-09-architecture-boutique-cafe.md` (r3) ; « ADR 0001 » = `docs/cto/adr/0001-architecture-de-base-nestjs-clean-en-memoire.md`. Niveaux de test : recommandation (TESTING-R10, TESTING-R17, TESTING-R19) ; le développeur garde le dernier mot et signale tout écart (TESTING-R21). Pas de Cucumber.

#### Consignes

| Consigne | Source |
|---|---|
| `Cafe.update()` ; `UpdateCafeUseCase` + DTO + Result + `UpdateCafePresenterInterface` ; `CafeNotFoundError` | Archi « Arborescence » catalogue/ ; « Contrats utiles » UpdateCafe |
| `PUT /gerant/cafes/:id` (`UpdateCafeController`, `UpdateCafeRequest`) ; `CafeNotFoundError` → 404, `InvalidCafeError` → 422, café inchangé | Archi « Contrats utiles » |

#### Fichiers concernés

```
src/
|-- [M] catalogue/domain/cafe/Cafe.ts
|-- [A] catalogue/domain/cafe/CafeNotFoundError.ts
|-- [A] catalogue/application/use-cases/UpdateCafe*.ts, catalogue/application/ports/UpdateCafePresenterInterface.ts
|-- [A] catalogue/presentation/http/{controllers/UpdateCafeController,requetes/UpdateCafeRequest,presenters/UpdateCafe*}.ts
|-- [M] catalogue/presentation/http/erreurs/CatalogueHttpErrorFilter.ts
`-- [M] bootstrap/composition/AppModule.ts
```

#### Niveau de test suggéré par scénario

| Scénario | Niveau suggéré | Pourquoi |
|---|---|---|
| modifier les informations | unit (use case) | `UpdateCafeUseCase.execute` puis `ListCataloguePublicUseCase` sur le même fake |
| modification qui retire un prix | unit (use case) | Refus via `execute`, fiche inchangée |
| café inconnu | unit (use case) | `CafeNotFoundError` ; le 404 est une traduction simple du filtre |
| modification par un visiteur | e2e | Le refus passe par `GerantAuthGuard` global : seul l'appel HTTP le traverse (TESTING-R19) ; un test (401 + état inchangé) suffit, sans doublon unitaire (TESTING-R17) |

#### Commandes de contrôle

`checks` est vide dans `.config/project.yaml` à ce jour : aucune commande déclarée. Lancer celles que T-001-01 aura renseignées : `checks.types`, `checks.lint`, `checks.format`, `checks.tests`, `checks.build`.

#### Points d'attention

- Réutiliser la validation de `PrixParFormat` de T-001-03, sans la dupliquer.

### Critères de fin
- [ ] Chaque scénario est vérifié par au moins un test.
- [ ] Les commandes de contrôle de la partie technique réussissent.
- [ ] Le reste de l'application compile et les tests existants passent.

### Dépendances
- Bloqué par : T-001-03 (le café et sa fiche existent)

---

# [6] Cacher et réafficher un café

---
id: T-001-06
revision: 1
sources: [EPIC-001, architecture 2026-10-09 r1, LOT-001]
---

## Pour l'humain

Le gérant retire temporairement un café de la vente sans le supprimer, puis le remet en vente quand il veut.

## Pour l'agent

### Comportement attendu

#### Scénario : cacher (détaille : P8 « Le gérant cache un café : il n'apparaît plus dans le catalogue public »)
- **Given** le café « Moka Sidamo » est visible et le gérant est connecté
- **When** il cache ce café
- **Then** le café n'apparaît plus dans le catalogue public et il est marqué comme non commandable

#### Scénario : réafficher (détaille : P9 « Le gérant réaffiche un café caché : il réapparaît »)
- **Given** le café « Moka Sidamo » est caché et le gérant est connecté
- **When** il le réaffiche
- **Then** le café réapparaît dans le catalogue public

#### Scénario : seuls les cafés visibles sont publics (détaille : P10 « liste uniquement les cafés visibles »)
- **Given** un café visible et un café caché
- **When** un visiteur consulte le catalogue public
- **Then** il ne voit que le café visible

#### Scénario : le gérant voit aussi les cafés cachés (détaille : P8)
- **Given** un café caché
- **When** le gérant connecté consulte sa liste de cafés
- **Then** le café caché y figure, indiqué comme caché

#### Scénario : cacher par un visiteur (détaille : P18)
- **Given** un visiteur non connecté
- **When** il tente de cacher ou de réafficher un café
- **Then** la demande est refusée et la visibilité ne change pas

### Partie technique (lead tech)

Sources abrégées : « Archi » = `docs/cto/architecture/2026-10-09-architecture-boutique-cafe.md` (r3) ; « ADR 0001 » = `docs/cto/adr/0001-architecture-de-base-nestjs-clean-en-memoire.md`. Niveaux de test : recommandation (TESTING-R10, TESTING-R17, TESTING-R19) ; le développeur garde le dernier mot et signale tout écart (TESTING-R21). Pas de Cucumber.

#### Consignes

| Consigne | Source |
|---|---|
| `Cafe.hide()`, `Cafe.show()` (idempotents), `Cafe.isOrderable(format)` | Archi « Arborescence » Cafe.ts ; « Contrats utiles » Hide/Show |
| `HideCafeUseCase`, `ShowCafeUseCase` + DTO, **sans presenter** ; `POST /gerant/cafes/:id/hide` et `/show` → 204 | Archi A11, dérogation (1) |
| `ListCataloguePublicUseCase` ne renvoie que les cafés visibles | Archi « Contrats utiles » ListCataloguePublic |
| Liste gérant avec l'indication « caché » : la seule liste gérant prévue est `ListStocksCafesUseCase` (`GET /gerant/stocks`, tous les cafés) ; la créer ici sans le stock, T-001-08 l'enrichira | Archi « Arborescence » (ListStocksCafes : « gérant : tous les cafés ») |

#### Fichiers concernés

```
src/
|-- [M] catalogue/domain/cafe/Cafe.ts
|-- [A] catalogue/application/use-cases/{HideCafe,ShowCafe}{UseCase,DTO}.ts
|-- [M] catalogue/application/use-cases/ListCataloguePublicUseCase.ts
|-- [A] catalogue/application/use-cases/ListStocksCafes*.ts (+ presenter port, controller, presenter)
|-- [A] catalogue/presentation/http/controllers/{HideCafeController,ShowCafeController}.ts
`-- [M] bootstrap/composition/AppModule.ts
```

#### Niveau de test suggéré par scénario

| Scénario | Niveau suggéré | Pourquoi |
|---|---|---|
| cacher | unit (use case) | `HideCafeUseCase.execute` puis catalogue public ; « non commandable » via `isOrderable` en test direct du domaine, permis tant qu'aucun use case ne l'expose (TESTING-R17) |
| réafficher | unit (use case) | `ShowCafeUseCase.execute` |
| seuls les cafés visibles sont publics | unit (use case) | Archi « Démarche » : « Catalogue public = cafés visibles » en unit |
| le gérant voit aussi les cafés cachés | unit (use case) | `ListStocksCafesUseCase` avec un café caché |
| cacher par un visiteur | e2e | Le refus passe par `GerantAuthGuard` global : seul l'appel HTTP le traverse (TESTING-R19) ; un test (401 + état inchangé) suffit, sans doublon unitaire (TESTING-R17) |

#### Commandes de contrôle

`checks` est vide dans `.config/project.yaml` à ce jour : aucune commande déclarée. Lancer celles que T-001-01 aura renseignées : `checks.types`, `checks.lint`, `checks.format`, `checks.tests`, `checks.build`.

#### Points d'attention

- Le nom `ListStocksCafes` est celui de l'architecture ; si l'utilisateur préfère une liste gérant distincte, c'est un écart d'architecture à faire valider.

### Critères de fin
- [ ] Chaque scénario est vérifié par au moins un test.
- [ ] Les commandes de contrôle de la partie technique réussissent.
- [ ] Le reste de l'application compile et les tests existants passent.

### Dépendances
- Bloqué par : T-001-05 (même fiche café, enrichie de la visibilité)

---

# [7] Supprimer un café

---
id: T-001-07
revision: 1
sources: [EPIC-001, architecture 2026-10-09 r1 (A7), LOT-001]
---

## Pour l'humain

Le gérant supprime un café créé par erreur. Un café déjà commandé ne peut pas être supprimé, pour que les anciennes commandes gardent leurs informations : on lui propose de le cacher.

## Pour l'agent

### Comportement attendu

#### Scénario : suppression d'un café jamais commandé (détaille : P6 « Le gérant supprime un café qui n'a jamais été commandé »)
- **Given** le café « Moka Sidamo » n'a jamais été commandé et le gérant est connecté
- **When** il le supprime
- **Then** le café n'existe plus, ni pour le gérant ni dans le catalogue public

#### Scénario : refus pour un café déjà commandé (détaille : P7 « La suppression d'un café déjà commandé est refusée, avec un message qui propose de le cacher »)
- **Given** le café « Moka Sidamo » a déjà été commandé et le gérant est connecté
- **When** il tente de le supprimer
- **Then** la suppression est refusée, le café est conservé, et le message propose de le cacher

#### Scénario : café inconnu (détaille : P6)
- **Given** le gérant est connecté
- **When** il supprime un café qui n'existe pas
- **Then** la demande est refusée avec un message « café introuvable »

#### Scénario : suppression par un visiteur (détaille : P18)
- **Given** un visiteur non connecté
- **When** il tente de supprimer un café
- **Then** la demande est refusée et le café est conservé

### Partie technique (lead tech)

Sources abrégées : « Archi » = `docs/cto/architecture/2026-10-09-architecture-boutique-cafe.md` (r3) ; « ADR 0001 » = `docs/cto/adr/0001-architecture-de-base-nestjs-clean-en-memoire.md`. Niveaux de test : recommandation (TESTING-R10, TESTING-R17, TESTING-R19) ; le développeur garde le dernier mot et signale tout écart (TESTING-R21). Pas de Cucumber.

#### Consignes

| Consigne | Source |
|---|---|
| `DeleteCafeUseCase` + DTO, sans presenter ; `CafeDejaCommandeError` (« Ce café a déjà été commandé : cachez-le plutôt ») | Archi « Parcours métier » Supprimer ; A11 |
| Port `HistoriqueCommandesCafeReaderInterface` + adapter `NoHistoriqueCommandesReader` (« jamais commandé ») | Archi A7 |
| `DELETE /gerant/cafes/:id` → 204 ; 404 si inconnu ; 422 si déjà commandé, café conservé | Archi « Contrats utiles » DeleteCafe |

#### Fichiers concernés

```
src/
|-- [A] catalogue/domain/cafe/CafeDejaCommandeError.ts
|-- [A] catalogue/application/use-cases/DeleteCafe{UseCase,DTO}.ts
|-- [A] catalogue/application/ports/HistoriqueCommandesCafeReaderInterface.ts
|-- [A] catalogue/infrastructure/adapters/NoHistoriqueCommandesReader.ts
|-- [A] catalogue/presentation/http/controllers/DeleteCafeController.ts
|-- [M] catalogue/presentation/http/erreurs/CatalogueHttpErrorFilter.ts
`-- [M] bootstrap/composition/AppModule.ts
```

#### Niveau de test suggéré par scénario

| Scénario | Niveau suggéré | Pourquoi |
|---|---|---|
| suppression d'un café jamais commandé | unit (use case) | `DeleteCafeUseCase.execute` avec `FakeHistoriqueCommandesReader` |
| refus pour un café déjà commandé | unit (use case) | Archi « Démarche » : fake « commandé » → `CafeDejaCommandeError`, café conservé |
| café inconnu | unit (use case) | `CafeNotFoundError` |
| suppression par un visiteur | e2e | Le refus passe par `GerantAuthGuard` global : seul l'appel HTTP le traverse (TESTING-R19) ; un test (401 + état inchangé) suffit, sans doublon unitaire (TESTING-R17) |

#### Commandes de contrôle

`checks` est vide dans `.config/project.yaml` à ce jour : aucune commande déclarée. Lancer celles que T-001-01 aura renseignées : `checks.types`, `checks.lint`, `checks.format`, `checks.tests`, `checks.build`.

#### Points d'attention

- Le cas « déjà commandé » n'est atteignable qu'avec le fake : en production l'adapter répond toujours « jamais commandé » jusqu'à l'EPIC-003 (A7).

### Critères de fin
- [ ] Chaque scénario est vérifié par au moins un test.
- [ ] Les commandes de contrôle de la partie technique réussissent.
- [ ] Le reste de l'application compile et les tests existants passent.

### Dépendances
- Bloqué par : T-001-06 (le message de refus renvoie vers l'action « cacher »)

---

# [8] Saisir, corriger et consulter le stock

---
id: T-001-08
revision: 1
sources: [EPIC-001, architecture 2026-10-09 r1, LOT-001]
---

## Pour l'humain

Le gérant indique combien de kilos il lui reste de chaque café, corrige ce chiffre quand il le faut, et consulte à tout moment le stock restant.

## Pour l'agent

### Comportement attendu

#### Scénario : saisir le stock (détaille : P11 « Le gérant saisit et corrige le stock de chaque café en kilos »)
- **Given** le café « Moka Sidamo » existe et le gérant est connecté
- **When** il saisit un stock de 12,5 kg
- **Then** le stock du café est de 12,5 kg

#### Scénario : corriger le stock (détaille : P11)
- **Given** le café a un stock de 12,5 kg
- **When** le gérant le corrige à 10 kg
- **Then** le stock du café est de 10 kg

#### Scénario : stock négatif (détaille : P11)
- **Given** le café a un stock de 10 kg
- **When** le gérant saisit -3 kg
- **Then** la saisie est refusée et le stock reste à 10 kg

#### Scénario : stock plus fin que le gramme (détaille : P11)
- **Given** le café a un stock de 10 kg
- **When** le gérant saisit 1,2345 kg
- **Then** la saisie est refusée et le stock reste à 10 kg

#### Scénario : consulter les stocks (détaille : P12 « Le gérant consulte le stock restant de chaque café »)
- **Given** deux cafés, l'un à 10 kg, l'autre caché à 0,75 kg
- **When** le gérant connecté consulte les stocks
- **Then** il voit les deux cafés avec leur stock restant en kilos

#### Scénario : stock par un visiteur (détaille : P18 « … ni changer le stock »)
- **Given** un visiteur non connecté
- **When** il tente de changer ou de consulter le stock
- **Then** la demande est refusée et le stock reste inchangé

### Partie technique (lead tech)

Sources abrégées : « Archi » = `docs/cto/architecture/2026-10-09-architecture-boutique-cafe.md` (r3) ; « ADR 0001 » = `docs/cto/adr/0001-architecture-de-base-nestjs-clean-en-memoire.md`. Niveaux de test : recommandation (TESTING-R10, TESTING-R17, TESTING-R19) ; le développeur garde le dernier mot et signale tout écart (TESTING-R21). Pas de Cucumber.

#### Consignes

| Consigne | Source |
|---|---|
| `catalogue/domain/shared/PoidsStock` (grammes entiers ≥ 0, créé depuis des kg) + `InvalidStockError` (négatif ou plus fin que le gramme) ; `Cafe.changeStock()` | Archi « Arborescence » catalogue/domain/shared |
| `ChangeStockCafeUseCase` + DTO + Result + presenter port, **sans** alerte (ajoutée en T-001-10) | Archi « Parcours métier » Corriger le stock (étapes 1-3 et 5) |
| Enrichir `ListStocksCafesUseCase` (créé en T-001-06) du stock en kg | Archi « Arborescence » |
| `PUT /gerant/cafes/:id/stock` ; presenter « 3,250 kg » ; `InvalidStockError` → 422 | Archi « Arborescence » presentation/http ; « Contrats utiles » |

#### Fichiers concernés

```
src/
|-- [A] catalogue/domain/shared/{PoidsStock,InvalidStockError}.ts
|-- [M] catalogue/domain/cafe/Cafe.ts
|-- [A] catalogue/application/use-cases/ChangeStockCafe*.ts (+ presenter port, controller, request, presenter)
|-- [M] catalogue/application/use-cases/ListStocksCafes*.ts (+ presenter)
|-- [M] catalogue/presentation/http/erreurs/CatalogueHttpErrorFilter.ts
`-- [M] bootstrap/composition/AppModule.ts
```

#### Niveau de test suggéré par scénario

| Scénario | Niveau suggéré | Pourquoi |
|---|---|---|
| saisir le stock | unit (use case) | `ChangeStockCafeUseCase.execute` (TESTING-R10) |
| corriger le stock | unit (use case) | Idem |
| stock négatif | unit (use case) | Refus via `execute`, stock inchangé ; pas de test direct de `PoidsStock` (TESTING-R17) |
| stock plus fin que le gramme | unit (use case) | Idem |
| consulter les stocks | unit (use case) + unit presenter | `ListStocksCafesUseCase` ; format « 0,750 kg » sur le presenter |
| stock par un visiteur | e2e | Le refus passe par `GerantAuthGuard` global : seul l'appel HTTP le traverse (TESTING-R19) ; un test (401 + état inchangé) suffit, sans doublon unitaire (TESTING-R17) |

#### Commandes de contrôle

`checks` est vide dans `.config/project.yaml` à ce jour : aucune commande déclarée. Lancer celles que T-001-01 aura renseignées : `checks.types`, `checks.lint`, `checks.format`, `checks.tests`, `checks.build`.

#### Points d'attention

- Ne pas implémenter ici le passage sous le seuil (T-001-10) : pas de code anticipé (YAGNI).

### Critères de fin
- [ ] Chaque scénario est vérifié par au moins un test.
- [ ] Les commandes de contrôle de la partie technique réussissent.
- [ ] Le reste de l'application compile et les tests existants passent.

### Dépendances
- Bloqué par : T-001-07 (même fiche café, enrichie du stock)

---

# [9] Voir les cafés sous le seuil

---
id: T-001-09
revision: 1
sources: [EPIC-001, architecture 2026-10-09 r1 (Q1), LOT-001]
---

## Pour l'humain

Le gérant voit d'un coup d'œil les cafés à recommander : ceux dont le stock est passé sous le seuil qu'il a réglé.

## Pour l'agent

### Comportement attendu

#### Scénario : liste des cafés sous le seuil (détaille : P16 « Le gérant voit la liste des cafés dont le stock est sous le seuil »)
- **Given** le seuil est de 2 kg ; « Moka » a 1,5 kg, « Java » a 5 kg
- **When** le gérant connecté consulte les cafés en stock bas
- **Then** il voit « Moka » avec 1,5 kg, et pas « Java »

#### Scénario : stock égal au seuil (détaille : P16, décision « strictement inférieur »)
- **Given** le seuil est de 2 kg et « Moka » a exactement 2 kg
- **When** le gérant consulte les cafés en stock bas
- **Then** « Moka » n'y figure pas

#### Scénario : la liste suit le seuil réglé (détaille : P16)
- **Given** « Java » a 5 kg et le seuil est de 2 kg
- **When** le gérant règle le seuil à 6 kg puis consulte les cafés en stock bas
- **Then** « Java » y figure

#### Scénario : aucun café sous le seuil (détaille : P16)
- **Given** tous les cafés ont un stock au moins égal au seuil
- **When** le gérant consulte les cafés en stock bas
- **Then** la liste est vide

#### Scénario : consultation par un visiteur (détaille : P3)
- **Given** un visiteur non connecté
- **When** il demande la liste des cafés en stock bas
- **Then** l'accès est refusé

### Partie technique (lead tech)

Sources abrégées : « Archi » = `docs/cto/architecture/2026-10-09-architecture-boutique-cafe.md` (r3) ; « ADR 0001 » = `docs/cto/adr/0001-architecture-de-base-nestjs-clean-en-memoire.md`. Niveaux de test : recommandation (TESTING-R10, TESTING-R17, TESTING-R19) ; le développeur garde le dernier mot et signale tout écart (TESTING-R21). Pas de Cucumber.

#### Consignes

| Consigne | Source |
|---|---|
| Port `ReglagesAlerteStockReaderInterface` (seuil + adresse) dans `catalogue/application/ports/` | Archi « Arborescence » ; « Vue visuelle » |
| Raccord `bootstrap/composition/ReglagesBoutiqueAlerteStockReader.ts` : implémente ce port en lisant `ReglagesBoutiqueRepositoryInterface` (pas le use case Get) | Archi « Fichiers, classes et relations » ; CODE-ARCHI-R08, CODE-ARCHI-R10 |
| `ListCafesStockBasUseCase` + Result + presenter port : stock **strictement** inférieur au seuil | Archi « Contrats utiles » ; Q1 |
| `GET /gerant/stocks/low` (`ListCafesStockBasController`) | Archi « Arborescence » presentation/http |

#### Fichiers concernés

```
src/
|-- [A] catalogue/application/ports/{ReglagesAlerteStockReaderInterface,ListCafesStockBasPresenterInterface}.ts
|-- [A] catalogue/application/use-cases/ListCafesStockBas*.ts
|-- [A] catalogue/presentation/http/{controllers/ListCafesStockBasController,presenters/ListCafesStockBas*}.ts
|-- [A] bootstrap/composition/ReglagesBoutiqueAlerteStockReader.ts
`-- [M] bootstrap/composition/AppModule.ts
```

#### Niveau de test suggéré par scénario

| Scénario | Niveau suggéré | Pourquoi |
|---|---|---|
| liste des cafés sous le seuil | unit (use case) | `ListCafesStockBasUseCase` avec `FakeReglagesAlerteStockReader` |
| stock égal au seuil | unit (use case) | Limite Q1 via `execute` |
| la liste suit le seuil réglé | e2e | Seul scénario qui traverse le raccord réel catalogue → réglages (`PUT /gerant/settings` puis `GET /gerant/stocks/low`) |
| aucun café sous le seuil | unit (use case) | Liste vide |
| consultation par un visiteur | e2e | Le refus passe par `GerantAuthGuard` global : seul l'appel HTTP le traverse (TESTING-R19) ; un test (401 + état inchangé) suffit, sans doublon unitaire (TESTING-R17) |

#### Commandes de contrôle

`checks` est vide dans `.config/project.yaml` à ce jour : aucune commande déclarée. Lancer celles que T-001-01 aura renseignées : `checks.types`, `checks.lint`, `checks.format`, `checks.tests`, `checks.build`.

#### Points d'attention

- La règle « sous le seuil » (`<`) vit à un seul endroit du domaine du catalogue, réutilisée par T-001-10.

### Critères de fin
- [ ] Chaque scénario est vérifié par au moins un test.
- [ ] Les commandes de contrôle de la partie technique réussissent.
- [ ] Le reste de l'application compile et les tests existants passent.

### Dépendances
- Bloqué par : T-001-04 (seuil réglé), T-001-08 (stock de chaque café)

---

# [10] Envoyer l'alerte e-mail au passage sous le seuil

---
id: T-001-10
revision: 1
sources: [EPIC-001, architecture 2026-10-09 r1 (A2, A3, Q1, Q2), LOT-001]
---

## Pour l'humain

Dès que le stock d'un café passe sous le seuil, le gérant reçoit un e-mail qui nomme ce café et donne son stock restant, pour qu'il pense à en recommander. Il ne reçoit pas un e-mail à chaque mouvement tant que le café reste sous le seuil.

## Pour l'agent

### Comportement attendu

#### Scénario : passage sous le seuil (détaille : P17 « Quand le stock d'un café passe sous le seuil, un e-mail d'alerte nommant ce café et son stock restant est envoyé à l'adresse réglée »)
- **Given** le seuil est de 2 kg, l'adresse d'alerte est « stock@cafe-exemple.fr », « Moka » a 3 kg
- **When** le gérant corrige le stock de « Moka » à 1,5 kg
- **Then** un e-mail est envoyé à « stock@cafe-exemple.fr », nommant « Moka » et indiquant 1,5 kg

#### Scénario : déjà sous le seuil (détaille : P17, règle « pas à chaque mouvement suivant tant qu'il reste dessous »)
- **Given** le seuil est de 2 kg et « Moka » a 1,5 kg
- **When** le gérant corrige le stock à 1 kg
- **Then** aucun e-mail n'est envoyé

#### Scénario : arrivée exactement au seuil (détaille : P17, décision « strictement inférieur »)
- **Given** le seuil est de 2 kg et « Moka » a 3 kg
- **When** le gérant corrige le stock à 2 kg
- **Then** aucun e-mail n'est envoyé

#### Scénario : remontée puis nouvelle baisse (détaille : P17)
- **Given** le seuil est de 2 kg et « Moka » a 1 kg
- **When** le gérant corrige le stock à 5 kg, puis à 1,5 kg
- **Then** un seul e-mail est envoyé, lors de la baisse à 1,5 kg

#### Scénario : changer le seuil n'alerte pas (détaille : P17, décision « remonter le seuil n'envoie pas d'alerte »)
- **Given** « Java » a 5 kg et le seuil est de 2 kg
- **When** le gérant règle le seuil à 6 kg
- **Then** aucun e-mail n'est envoyé

#### Scénario : échec de l'envoi (détaille : P11 et P17)
- **Given** le seuil est de 2 kg, « Moka » a 3 kg, et l'envoi d'e-mail échoue
- **When** le gérant corrige le stock à 1,5 kg
- **Then** le stock est quand même enregistré à 1,5 kg

### Partie technique (lead tech)

Sources abrégées : « Archi » = `docs/cto/architecture/2026-10-09-architecture-boutique-cafe.md` (r3) ; « ADR 0001 » = `docs/cto/adr/0001-architecture-de-base-nestjs-clean-en-memoire.md`. Niveaux de test : recommandation (TESTING-R10, TESTING-R17, TESTING-R19) ; le développeur garde le dernier mot et signale tout écart (TESTING-R21). Pas de Cucumber.

#### Consignes

| Consigne | Source |
|---|---|
| Port transverse `EmailSenderInterface` + `InMemoryEmailSender` (garde et journalise, sans donnée sensible) | Archi A2 ; SECURITY-R06 |
| `Cafe.changeStock(nouveauStock, seuil)` indique le **passage** sous le seuil (avant ≥ seuil, après < seuil) | Archi « Parcours métier » étape 4 ; Q1 |
| `ChangeStockCafeUseCase` lit seuil + adresse via `ReglagesAlerteStockReaderInterface`, enregistre le stock **puis** envoie l'e-mail (nom du café + stock restant) ; échec d'envoi journalisé via `LoggerInterface`, stock conservé | Archi « Parcours métier » ; A3 ; « Fichiers, classes et relations » |
| Aucun envoi lors d'un changement de seuil (`UpdateReglagesBoutiqueUseCase` inchangé) | Archi Q2 |

#### Fichiers concernés

```
src/
|-- [A] shared/ports/EmailSenderInterface.ts, shared/adapters/InMemoryEmailSender.ts
|-- [M] catalogue/domain/cafe/Cafe.ts
|-- [M] catalogue/application/use-cases/ChangeStockCafeUseCase.ts
`-- [M] bootstrap/composition/AppModule.ts
```

#### Niveau de test suggéré par scénario

| Scénario | Niveau suggéré | Pourquoi |
|---|---|---|
| passage sous le seuil | unit (use case) | Archi « Démarche » : `FakeEmailSender`, seuil 2 kg, 3 → 1,5 kg |
| déjà sous le seuil | unit (use case) | Séquence 3 → 1,5 → 1 : un seul e-mail |
| arrivée exactement au seuil | unit (use case) | Limite Q1 |
| remontée puis nouvelle baisse | unit (use case) | Séquence via `execute` |
| changer le seuil n'alerte pas | e2e | Le use case réglages ne connaît pas l'e-mail ; seul un test de l'application câblée prouve l'absence d'envoi (`PUT /gerant/settings` puis lecture de `InMemoryEmailSender`) |
| échec de l'envoi | unit (use case) | Archi « Démarche » : fake e-mail en échec, stock enregistré, erreur journalisée (A3) |

#### Commandes de contrôle

`checks` est vide dans `.config/project.yaml` à ce jour : aucune commande déclarée. Lancer celles que T-001-01 aura renseignées : `checks.types`, `checks.lint`, `checks.format`, `checks.tests`, `checks.build`.

#### Points d'attention

- Test de contrat `FakeEmailSender` ↔ `InMemoryEmailSender` (TESTING-R20).
- Ne journaliser aucune donnée sensible (SECURITY-R06).

### Critères de fin
- [ ] Chaque scénario est vérifié par au moins un test.
- [ ] Les commandes de contrôle de la partie technique réussissent.
- [ ] Le reste de l'application compile et les tests existants passent.

### Dépendances
- Bloqué par : T-001-09 (même règle « sous le seuil » et lecture du seuil et de l'adresse réglés)
