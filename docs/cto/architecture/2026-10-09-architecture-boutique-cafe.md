---
id: architecture-boutique-cafe
revision: 3
mode: proposition (arbitrages validés)
sources: [besoin-client.md@5034a88, docs/backlog/EPIC-001-catalogue-cafes-et-stock.md@5034a88, EPIC-002..005@5034a88, adr-0001 r3]
---

# Architecture de la boutique de café en ligne (back-end)

## Récapitulatif humain

**Contexte.** Le gérant d'une boutique de café veut vendre en ligne. On construit seulement le « moteur » (back-end, une API HTTP sans écran). Première étape : l'EPIC-001, le catalogue de cafés et le stock.

**Choix proposé.** Une application NestJS (framework serveur en TypeScript) découpée en **modules métier** : accès gérant, catalogue (cafés + stock), réglages de la boutique, puis plus tard panier, commandes, promotions. Chaque module a 4 couches : `domain` (règles métier pures), `application` (les actions possibles, appelées « use cases »), `presentation` (l'entrée HTTP) et `infrastructure` (stockage, e-mail…). Le métier ne connaît jamais la technique : il définit des **ports** (prises standard) que la technique vient remplir. Ainsi on démarre avec un stockage **en mémoire** et un e-mail **factice**, et on branchera plus tard une vraie base ou un vrai service sans toucher aux règles.

**Raison.** Décisions de l'utilisateur (voir [ADR 0001](../adr/0001-architecture-de-base-nestjs-clean-en-memoire.md)) ; elles conviennent car le projet contient de vraies règles (stock jamais vendu à découvert, alerte au passage sous le seuil, statuts de commande) et plusieurs services à remplacer plus tard.

**Principal coût.** Beaucoup de petits fichiers par action ; données perdues à chaque redémarrage tant que la base n'est pas choisie.

**Arbitrages** : tous validés par l'utilisateur le 2026-10-09 (A1 à A12, Q1 à Q3). Voir la section « Arbitrages ».

Dérogations (validées par l'utilisateur le 2026-10-09, via coordinateur) : (1) CODE-ARCHI-R02/R13 — actions sans donnée à renvoyer (cacher, réafficher, supprimer) : use case sans presenter, le controller répond 204 (A11) ; portée : toutes les actions sans réponse ; raison : un presenter sans contenu n'apporte rien. (2) CODE-ARCHI-R02 — `AuthenticateSessionGerantUseCase` sans presenter ; portée : ce seul use case, appelé par le guard global ; raison : le guard n'a aucune réponse HTTP à construire. (3) TESTING-R11 — Jest au lieu de Vitest (A8) ; portée : tout le projet ; raison : NESTJS-R03 (projet NestJS en CommonJS testé avec Jest), règle plus spécifique.
Décisions remplacées : aucune.
Approche de présentation : B (presenter/ViewModel), tranchée avec l'utilisateur (CODE-ARCHI-R18) ; jamais mélangée avec A.

## Arbitrages validés

Statut : A1 à A12 **validés** par l'utilisateur (2026-10-09, transmis par le coordinateur ; A12 modifié par l'utilisateur). Trace assumée : l'accord est connu via le coordinateur, sans trace directe de l'utilisateur dans ce dépôt.

| # | Sujet | Décision ou recommandation | Raison courte | Alternative |
| --- | --- | --- | --- | --- |
| A1 | Authentification du gérant | (Validé) Jeton de session **opaque** (chaîne aléatoire) renvoyé à la connexion, gardé en mémoire côté serveur, envoyé ensuite dans l'en-tête `Authorization: Bearer`, expiration après une durée configurable (ex. 8 h). Compte unique lu depuis la configuration (variables d'environnement : e-mail + **empreinte** du mot de passe, jamais le mot de passe en clair, SECURITY-R04). Vérification avec `scrypt` de Node (aucune dépendance). Un **guard global** refuse tout par défaut ; seules les routes marquées « publiques » passent (SECURITY-R12). | Simple, révocable, sans bibliothèque ; un seul compte | JWT signé (sans état serveur, mais non révocable et ajoute une dépendance) |
| A2 | Envoi des e-mails (alerte stock, puis confirmations) | (Validé) Port transverse `EmailSenderInterface` (dans `shared/ports/`) ; adapter **factice** `InMemoryEmailSender` qui garde les e-mails envoyés en mémoire et les écrit dans le journal (sans données sensibles, SECURITY-R06). Vrai service plus tard. | Aucun fournisseur choisi ; e-mails vérifiables en test | Envoi SMTP réel dès maintenant (coût, choix de fournisseur) |
| A3 | Échec de l'envoi d'un e-mail d'alerte | (Validé) Le stock est **quand même enregistré** ; l'échec est journalisé. | La correction du stock est l'action principale du gérant | Annuler la correction du stock si l'e-mail échoue |
| A4 | Horloge | (Validé) Port transverse `ClockInterface` + `SystemClock` ; utile dès l'EPIC-001 (expiration de session), indispensable à l'EPIC-005 (dates de fin à 23 h 59 heure de Paris). | Tests reproductibles (TESTING-R08) | Lire `new Date()` directement (tests non déterministes) |
| A5 | Génération d'identifiants | (Validé) Port transverse `IdGeneratorInterface` + adapter `RandomUuidGenerator` (`crypto.randomUUID` de Node). | Identifiants prévisibles en test | Générer dans l'entité (tests moins lisibles) |
| A6 | Valeurs initiales des réglages (seuil, adresse d'alerte, frais de livraison) | (Validé) Valeurs **obligatoires** lues depuis la configuration au démarrage, puis modifiables par le gérant. | Stockage en mémoire : tout est perdu au redémarrage ; évite un état « non réglé » | Démarrer sans valeur : pas d'alerte et commande impossible tant que non réglé |
| A7 | Savoir si un café « a déjà été commandé » avant que les commandes existent (EPIC-003) | (Validé) Port `HistoriqueCommandesCafeReaderInterface` dans le catalogue ; pour l'EPIC-001, adapter `NoHistoriqueCommandesReader` qui répond toujours « jamais commandé » (vrai, puisqu'aucune commande n'est possible), remplacé à l'EPIC-003 par un raccord placé dans `bootstrap/composition/` qui interroge le module commandes (aucun import entre modules, CODE-ARCHI-R10). | Le comportement de refus est conçu et testé dès maintenant | Marquer le café « commandé » par un événement envoyé par les commandes (EPIC-003) |
| A8 | Outil de test | (Validé) **Jest**. Contradiction dans la doctrine : TESTING-R11 demande Vitest pour un nouveau projet TS, NESTJS-R03 demande Jest pour un projet NestJS. Recommandation : Jest (règle plus spécifique, compatible CommonJS et alias). | Évite le support ESM expérimental | Vitest (+ passage en ESM, voir knowledge `nestjs.md#format-commonjs`) |
| A9 | Bibliothèque de validation des requêtes HTTP | (Validé) `class-validator` + `class-transformer` avec le `ValidationPipe` de NestJS (dépendances : accord requis, SECURITY-R03). | Standard NestJS, bien documenté | `zod` (schémas explicites) ou parsers écrits à la main |
| A10 | TDD | (Validé) **Avec TDD** pour le domaine et les use cases (règles bien spécifiées : 3 formats, stock en kg, passage sous le seuil, refus de suppression) ; sans TDD pour le câblage NestJS et les presenters. | TESTING-R12 : comportement bien spécifié | Tests écrits juste après chaque comportement (WORKFLOW-R04) |
| A11 | Actions sans donnée à renvoyer (cacher, supprimer…) en approche B | (Validé) Le use case ne prend **pas** de presenter et le controller répond `204 No Content`. | Un presenter sans contenu n'apporte rien | Presenter + ViewModel minimal pour chaque action |
| A12 | Langue des noms dans le code | (Validé, modifié par l'utilisateur) Noms **métier en français** (entités, value objects, termes du domaine, modules : `Cafe`, `PrixParFormat`, `PoidsStock`, `ReglagesBoutique`, `catalogue/`), noms **techniques en anglais** (verbes et suffixes : `get`, `update`, `resolve`, `UseCase`, `Repository`, `Controller`, `Presenter` ; ex. `getCafe`, `resolveCafeType`, `AddCafeUseCase`, `CafeRepositoryInterface`). Commentaires et docblocks en français. | Choix de l'utilisateur | — |

**Questions métier tranchées** (CONCEPTION-R02, validées par l'utilisateur le 2026-10-09, via coordinateur) :

- Q1. « Sous le seuil » = **strictement inférieur** (`<`).
- Q2. Remonter le seuil **ne déclenche pas** d'alerte ; seul un mouvement de stock la déclenche.
- Q3. Une adresse d'alerte mal formée est **refusée** à l'enregistrement (`InvalidReglagesBoutiqueError`, 422).

<details>
<summary>Détails pour les agents</summary>

## Mandat et état

- Mandat : architecture du projet entier, détaillée pour l'EPIC-001, modules des EPIC-002 à 005 à grands traits. Mode proposition.
- Décisions **validées** par l'utilisateur (mandat du 2026-10-09) : TypeScript + NestJS ; stockage en mémoire derrière des ports, base reportée ; clean architecture + quelques concepts DDD ; approche B ; back-end seulement ; paiement simulé derrière un port. Voir ADR 0001.
- Arbitrages A1 à A12 et questions Q1 à Q3 : validés par l'utilisateur le 2026-10-09.
- Hors mandat : aucune implémentation, aucune configuration modifiée.

## Existant observé

- Dépôt à `5034a88` : `.config/project.yaml`, `besoin-client.md`, `docs/backlog/EPIC-001..005`. Aucun code, aucun `package.json`. (observé)
- `checks` : toutes les commandes à `null` (observé) ; elles seront remplies par le développeur après les tickets d'outillage.
- `code.docblockLanguage: fr` (observé).
- Faits métier clés (EPIC-001) : un seul compte gérant ; 3 formats obligatoires 250 g / 500 g / 1 kg avec un prix chacun ; vente en grains uniquement ; stock en kg par café ; seuil commun ; alerte e-mail au **passage** sous le seuil ; frais de livraison fixes dans les réglages ; café déjà commandé : suppression refusée, il se cache.
- Divergence notée : `besoin-client.md` parle de grains **et** moulu et de livraison offerte au-delà d'un montant ; l'EPIC-001/002 tranchent « grains uniquement » et « frais jamais offerts ». L'epic fait foi (document plus récent, produit avec l'utilisateur).

## Vue visuelle proposée

Modules (dossiers de premier niveau de `src/`, nommés d'après le métier, DESCRIPTION-R12) :

```text
src/
├─ acces-gerant/   EPIC-001  connexion du gérant unique, sessions          [détaillé]
├─ catalogue/          EPIC-001  cafés, 3 formats de prix, visibilité, stock   [détaillé]
├─ reglages-boutique/   EPIC-001  seuil de stock bas, adresse d'alerte, frais   [détaillé]
├─ panier/             EPIC-002  panier sans compte                            [grands traits]
├─ commandes/           EPIC-003/4 commande, paiement simulé, suivi, annulation [grands traits]
├─ promotions/       EPIC-005  codes promo, offre 1 kg = 250 g offerts       [grands traits]
├─ bootstrap/        configuration, câblage (AppModule), point d'entrée HTTP, guard global
└─ shared/           ports transverses (e-mail, horloge, identifiants, journal) + adapters par défaut
```

Schéma des responsabilités (EPIC-001). Légende : `──>` « dépend de / importe » ; `==>` « implémente » ; `┄┄` raccord branché par `bootstrap/composition/`, sans import entre modules.

```text
                 ┌──────────────────────── bootstrap/ ─────────────────────────┐
                 │ main.ts · AppModule (useFactory : port -> adapter)          │
                 │ GerantAuthGuard (global, refuse par défaut) · configuration │
                 └───────┬───────────────────┬──────────────────────┬──────────┘
                         │ câble              │ câble                │ câble
   ┌─────────────────────▼───┐  ┌─────────────▼────────────┐  ┌──────▼──────────────────┐
   │ acces-gerant/          │  │ catalogue/                 │  │ reglages-boutique/         │
   │ presentation/http ──>    │  │ presentation/http ──>    │  │ presentation/http ──>   │
   │ application ──> domain   │  │ application ──> domain   │  │ application ──> domain  │
   │ infrastructure ==> ports │  │ infrastructure ==> ports │  │ infrastructure ==> ports│
   └──────────┬──────────────┘  └───────┬──────────────────┘  └────────▲────────────────┘
              │                         │ port ReglagesAlerteStockReader  ┊
              │                         └┄┄┄┄ (raccord dans bootstrap/composition) ┘
              └──────────────┬──────────┘
                             ▼
                 shared/ports (EmailSender, Clock, IdGenerator, Logger)
                             ▲ ==
                 shared/adapters (InMemoryEmailSender, SystemClock, RandomUuidGenerator, ConsoleLogger)
```

Adapters, par rôle (DESCRIPTION-R06) :
- **Primaires** (déclenchent un use case) : les controllers de `presentation/http/controllers/`, et `GerantAuthGuard` (déclenche `AuthenticateSessionGerantUseCase`).
- **Secondaires** (appelés par un use case) : `InMemory…Repository`, `InMemoryEmailSender`, `ScryptPasswordVerifier`, `CryptoSessionTokenGenerator`, `SystemClock`, `RandomUuidGenerator`, `NoHistoriqueCommandesReader`, le raccord catalogue → réglages.

Traduction externe (DESCRIPTION-R08) : aucun système externe réel à l'EPIC-001 ; la frontière avec le futur service de paiement (EPIC-003) et le futur fournisseur d'e-mail aura sa traduction dans l'adapter `infrastructure/providers/`.

## Arborescence finale détaillée

Proposée. Seuls les fichiers de l'EPIC-001 sont détaillés. Un dossier n'existe que s'il a un fichier (CODE-ARCHI-R01).

```text
src/
├─ acces-gerant/                                   # accès du gérant unique
│  ├─ domain/
│  │  ├─ SessionGerant.ts                           # entité : jeton, date d'expiration, estExpiree(maintenant)
│  │  ├─ InvalidCredentialsError.ts                  # e-mail ou mot de passe faux (même message dans les 2 cas)
│  │  └─ InvalidSessionError.ts                      # jeton absent, inconnu ou expiré
│  ├─ application/
│  │  ├─ use-cases/
│  │  │  ├─ LogInGerantUseCase.ts                   # vérifie e-mail + mot de passe, crée une session
│  │  │  ├─ LogInGerantDTO.ts                       # e-mail, mot de passe
│  │  │  ├─ LogInGerantResult.ts                    # jeton, date d'expiration
│  │  │  ├─ AuthenticateSessionGerantUseCase.ts     # valide un jeton (appelé par le guard), sans presenter
│  │  │  └─ AuthenticateSessionGerantDTO.ts         # jeton
│  │  └─ ports/
│  │     ├─ CompteGerantReaderInterface.ts         # lit l'e-mail et l'empreinte du compte configuré
│  │     ├─ PasswordVerifierInterface.ts             # compare un mot de passe à une empreinte
│  │     ├─ SessionTokenGeneratorInterface.ts        # produit un jeton aléatoire sûr
│  │     ├─ SessionGerantRepositoryInterface.ts     # enregistre / retrouve les sessions
│  │     └─ LogInGerantPresenterInterface.ts        # output port (approche B)
│  ├─ presentation/http/
│  │  ├─ controllers/LogInGerantController.ts       # POST /gerant/session (route publique)
│  │  ├─ requetes/LogInGerantRequest.ts             # forme de la requête (e-mail, mot de passe)
│  │  ├─ presenters/LogInGerantPresenter.ts         # Result -> ViewModel
│  │  ├─ presenters/LogInGerantViewModel.ts         # { token, expiresAt: "09/10/2026 18:00" }
│  │  ├─ controllers/PublicRoute.ts                  # décorateur SetMetadata « route publique » (voir liberté)
│  │  └─ erreurs/
│  │     ├─ AccesGerantHttpErrorFilter.ts          # InvalidCredentials/InvalidSession -> 401
│  │     └─ InvalidRequestError.ts                   # requête mal formée -> 400
│  └─ infrastructure/
│     ├─ repositories/InMemorySessionGerantRepository.ts
│     └─ adapters/
│        ├─ ConfiguredCompteGerantReader.ts        # reçoit e-mail + empreinte de bootstrap/configuration
│        ├─ ScryptPasswordVerifier.ts                # node:crypto scrypt + timingSafeEqual
│        └─ CryptoSessionTokenGenerator.ts           # node:crypto randomBytes
├─ catalogue/                                          # cafés, prix par format, visibilité, stock
│  ├─ domain/
│  │  ├─ cafe/
│  │  │  ├─ Cafe.ts                                # racine d'agrégat : nom, origine, description, prix, visible, stock ;
│  │  │  │                                           #   update(), hide(), show(), changeStock() -> indique le passage sous le seuil,
│  │  │  │                                           #   isOrderable(format)
│  │  │  ├─ CafeFieldsInterface.ts                 # contrat de données (nom, origine, description, prix des 3 formats)
│  │  │  ├─ FormatCafe.ts                          # enum : 250 g, 500 g, 1 kg (poids en grammes)
│  │  │  ├─ PrixParFormat.ts                          # value object : un prix > 0 pour chacun des 3 formats
│  │  │  ├─ InvalidCafeError.ts                    # nom/origine/description vides, prix manquant ou ≤ 0
│  │  │  ├─ CafeNotFoundError.ts
│  │  │  └─ CafeDejaCommandeError.ts             # « déjà commandé : cachez-le plutôt »
│  │  └─ shared/
│  │     ├─ Montant.ts                                 # value object en centimes (entier ≥ 0)
│  │     ├─ PoidsStock.ts                           # value object : poids en grammes entiers ≥ 0, créé depuis des kg
│  │     └─ InvalidStockError.ts                     # stock négatif ou plus fin que le gramme
│  ├─ application/
│  │  ├─ use-cases/
│  │  │  ├─ AddCafeUseCase.ts  + AddCafeDTO.ts (implements CafeFieldsInterface) + AddCafeResult.ts
│  │  │  ├─ UpdateCafeUseCase.ts + UpdateCafeDTO.ts + UpdateCafeResult.ts
│  │  │  ├─ DeleteCafeUseCase.ts + DeleteCafeDTO.ts           # refuse si déjà commandé
│  │  │  ├─ HideCafeUseCase.ts + HideCafeDTO.ts
│  │  │  ├─ ShowCafeUseCase.ts + ShowCafeDTO.ts
│  │  │  ├─ ListCataloguePublicUseCase.ts + ListCataloguePublicResult.ts   # cafés visibles seulement
│  │  │  ├─ ListStocksCafesUseCase.ts + ListStocksCafesResult.ts     # gérant : tous les cafés + stock
│  │  │  ├─ ListCafesStockBasUseCase.ts + ListCafesStockBasResult.ts
│  │  │  └─ ChangeStockCafeUseCase.ts + ChangeStockCafeDTO.ts + ChangeStockCafeResult.ts
│  │  │                                               # saisit/corrige le stock, envoie l'alerte au passage sous le seuil
│  │  └─ ports/
│  │     ├─ CafeRepositoryInterface.ts
│  │     ├─ ReglagesAlerteStockReaderInterface.ts     # lit seuil + adresse d'alerte (contrat vers reglages-boutique)
│  │     ├─ HistoriqueCommandesCafeReaderInterface.ts     # « ce café a-t-il déjà été commandé ? »
│  │     ├─ AddCafePresenterInterface.ts
│  │     ├─ UpdateCafePresenterInterface.ts
│  │     ├─ ListCataloguePublicPresenterInterface.ts
│  │     ├─ ListStocksCafesPresenterInterface.ts
│  │     ├─ ListCafesStockBasPresenterInterface.ts
│  │     └─ ChangeStockCafePresenterInterface.ts
│  ├─ presentation/http/
│  │  ├─ controllers/                                # un controller par action (CODE-ARCHI-R13)
│  │  │  ├─ AddCafeController.ts                   # POST   /gerant/cafes
│  │  │  ├─ UpdateCafeController.ts                # PUT    /gerant/cafes/:id
│  │  │  ├─ DeleteCafeController.ts                # DELETE /gerant/cafes/:id          -> 204
│  │  │  ├─ HideCafeController.ts                  # POST   /gerant/cafes/:id/hide     -> 204
│  │  │  ├─ ShowCafeController.ts                  # POST   /gerant/cafes/:id/show     -> 204
│  │  │  ├─ ListStocksCafesController.ts            # GET    /gerant/stocks
│  │  │  ├─ ListCafesStockBasController.ts         # GET    /gerant/stocks/low
│  │  │  ├─ ChangeStockCafeController.ts           # PUT    /gerant/cafes/:id/stock
│  │  │  └─ ListCataloguePublicController.ts           # GET    /catalogue (route publique)
│  │  ├─ requetes/                                   # AddCafeRequest, UpdateCafeRequest, ChangeStockCafeRequest
│  │  ├─ presenters/                                 # <Action>Presenter + <Action>ViewModel pour les 6 actions à réponse
│  │  │                                              #   (prix « 12,50 € », stock « 3,250 kg », format « 250 g »)
│  │  └─ erreurs/
│  │     ├─ CatalogueHttpErrorFilter.ts                # InvalidCafe/InvalidStock -> 422, NotFound -> 404, CafeDejaCommande -> 422
│  │     └─ InvalidRequestError.ts                   # -> 400
│  └─ infrastructure/
│     ├─ repositories/InMemoryCafeRepository.ts
│     └─ adapters/NoHistoriqueCommandesReader.ts            # EPIC-001 : « jamais commandé » (remplacé à l'EPIC-003, A7)
├─ reglages-boutique/                                   # réglages de la boutique
│  ├─ domain/
│  │  ├─ ReglagesBoutique.ts                            # entité unique : seuil (PoidsStock), adresse d'alerte, frais (Montant)
│  │  ├─ ReglagesBoutiqueFieldsInterface.ts
│  │  ├─ AdresseEmail.ts                             # value object (format e-mail)
│  │  ├─ Montant.ts / PoidsStock.ts                   # value objects propres au module (pas d'import entre modules)
│  │  └─ InvalidReglagesBoutiqueError.ts
│  ├─ application/
│  │  ├─ use-cases/
│  │  │  ├─ GetReglagesBoutiqueUseCase.ts + GetReglagesBoutiqueResult.ts
│  │  │  └─ UpdateReglagesBoutiqueUseCase.ts + UpdateReglagesBoutiqueDTO.ts (implements ReglagesBoutiqueFieldsInterface)
│  │  └─ ports/
│  │     ├─ ReglagesBoutiqueRepositoryInterface.ts
│  │     ├─ GetReglagesBoutiquePresenterInterface.ts
│  │     └─ UpdateReglagesBoutiquePresenterInterface.ts
│  ├─ presentation/http/
│  │  ├─ controllers/GetReglagesBoutiqueController.ts   # GET /gerant/settings
│  │  ├─ controllers/UpdateReglagesBoutiqueController.ts# PUT /gerant/settings
│  │  ├─ requetes/UpdateReglagesBoutiqueRequest.ts
│  │  ├─ presenters/GetReglagesBoutiquePresenter.ts      # implémente GetReglagesBoutiquePresenterInterface : Result -> ViewModel
│  │  ├─ presenters/GetReglagesBoutiqueViewModel.ts      # seuil « 2,000 kg », adresse d'alerte, frais « 4,90 € »
│  │  ├─ presenters/UpdateReglagesBoutiquePresenter.ts   # implémente UpdateReglagesBoutiquePresenterInterface : Result -> ViewModel
│  │  ├─ presenters/UpdateReglagesBoutiqueViewModel.ts   # réglages enregistrés, mêmes formats
│  │  └─ erreurs/ReglagesBoutiqueHttpErrorFilter.ts + InvalidRequestError.ts
│  └─ infrastructure/repositories/InMemoryReglagesBoutiqueRepository.ts  # initialisé avec les valeurs de configuration (A6)
├─ panier/ · commandes/ · promotions/                     # EPIC-002 à 005, voir « Modules suivants »
├─ bootstrap/
│  ├─ configuration/AppConfiguration.ts              # seul chargeur : port HTTP, compte gérant (e-mail + empreinte),
│  │                                                 #   durée de session, réglages initiaux ; échoue tôt si absent
│  ├─ composition/
│  │  ├─ AppModule.ts                                # seul @Module : useFactory port -> adapter, filtres, guard global
│  │  └─ ReglagesBoutiqueAlerteStockReader.ts            # raccord catalogue -> reglages-boutique (implémente le port du catalogue)
│  └─ entrypoints/http/
│     ├─ main.ts                                     # démarre Nest, ValidationPipe global
│     ├─ GerantAuthGuard.ts                         # global : refuse sauf route publique ; appelle AuthenticateSessionGerantUseCase
│     └─ UnexpectedErrorFilter.ts                   # global : erreur inattendue -> 500 générique, détail journalisé (SECURITY-R07)
└─ shared/
   ├─ ports/ EmailSenderInterface.ts · ClockInterface.ts · IdGeneratorInterface.ts · LoggerInterface.ts
   └─ adapters/ InMemoryEmailSender.ts · SystemClock.ts · RandomUuidGenerator.ts · ConsoleLogger.ts
tests/
├─ unit/
│  ├─ acces-gerant/application/use-cases/ LogInGerantUseCase.test.ts · AuthenticateSessionGerantUseCase.test.ts
│  ├─ acces-gerant/fakes/ (sessions, compte, vérificateur, générateur de jeton)
│  ├─ catalogue/application/use-cases/ <un test par use case>.test.ts
│  ├─ catalogue/presentation/http/presenters/ <Presenter>.test.ts
│  ├─ catalogue/fakes/ FakeCafeRepository · FakeReglagesAlerteStockReader · FakeHistoriqueCommandesReader · FakeEmailSender · FakeClock · FakeIdGenerator
│  └─ reglages-boutique/… (même logique)
├─ integration/                                      # tests de contrat fake <-> adapter réel (TESTING-R20)
│  └─ catalogue/infrastructure/repositories/InMemoryCafeRepository.contract.test.ts (etc.)
└─ e2e/
   ├─ acces-gerant/presentation/http/controllers/LogInGerantController.test.ts
   └─ catalogue/presentation/http/controllers/ <Controller>.test.ts (ex. AddCafeController.test.ts : accès refusé sans session, parcours nominal)
```

## Modules suivants (grands traits, EPIC-002 à 005)

| Module | Contenu prévu | Ports principaux | Points d'attention |
| --- | --- | --- | --- |
| `panier/` (EPIC-002) | Agrégat `Panier` (lignes café + format + quantité), identifié par un jeton remis au visiteur ; total = sous-total + frais | `PanierRepositoryInterface`, `CatalogueReaderInterface` (prix actuels, visibilité, stock), `FraisLivraisonReaderInterface` (réglages) | Prix toujours relus au catalogue ; ligne d'un café caché marquée « plus disponible » et hors total ; le panier ne réserve pas le stock |
| `commandes/` (EPIC-003, 004) | Agrégat `Commande` + `LigneCommande`, enum `StatutCommande` (payée → préparée → expédiée → livrée, annulée) ; passage de commande, suivi, annulation | `CommandeRepositoryInterface`, `PaymentProviderInterface` (→ `infrastructure/providers/SimulatedPaymentProvider`, réponse forcée par faux numéro de carte, remboursement), `RetraitStockInterface` (raccord dans `bootstrap/composition/` ; appel direct synchrone plutôt qu'un Domain Event, DDD-R06, car vérifier et retirer le stock doit être atomique et refuser la commande immédiatement), `EmailSenderInterface` | Vérifier **et** retirer le stock en une seule opération sans `await` intermédiaire (atomicité en mémoire, ADR 0001) ; alerte de seuil aussi à la baisse par commande ; le raccord qui implémente `HistoriqueCommandesCafeReaderInterface` du catalogue vit dans `bootstrap/composition/` et interroge les commandes (remplace `NoHistoriqueCommandesReader` ; CODE-ARCHI-R10) |
| `promotions/` (EPIC-005) | `CodePromo` (pourcentage, début, fin incluse 23 h 59 Paris, actif), offre `OffreUnKiloCadeau` | `CodePromoRepositoryInterface`, `ClockInterface` | Arrondi au centime ; sachet offert compté dans le stock ; branché au panier et à la commande par des contrats de lecture |

## Outils nécessaires

Types d'outils, sans version (CONCEPTION-R15). Le PO en tire des tickets d'outillage ; le développeur installe, applique les modèles du plugin (`plugin:skills/developpeur/assets/lint/`) et remplit `checks`.

| Type d'outil | Outil retenu ou proposé | Raison | Suite |
| --- | --- | --- | --- |
| Langage | TypeScript (mode strict) | Décision utilisateur | Ticket d'outillage |
| Environnement d'exécution | Node.js (≥ 24.9 exigé par NESTJS-R03) | Requis par NestJS 12 + Jest | Ticket d'outillage |
| Framework | NestJS, projet en CommonJS (NESTJS-R03) | Décision utilisateur ; avantages/inconvénients dans ADR 0001 | Ticket d'outillage |
| Vérification des types | Compilateur TypeScript (`tsc --noEmit`) | Contrôle `checks.types` | Remplir `checks.types` |
| Tests (unitaires, intégration, e2e) | Jest (arbitrage A8) + supertest pour les appels HTTP e2e | NESTJS-R03 ; e2e par le point d'entrée HTTP (TESTING-R19) | Remplir `checks.tests` |
| Lint | ESLint + typescript-eslint, modèle `eslint.config.mjs` + `eslint.nestjs.mjs` du plugin (Oxlint retiré) | STYLE-R12, NESTJS-R01/R02 | Remplir `checks.lint` |
| Contrôle des frontières | `eslint-plugin-boundaries` (couches, modules, `shared`, `bootstrap`) | CODE-ARCHI-R10, DESIGN-R01 | Inclus dans le lint |
| Mise en forme | Prettier (`.prettierrc` du plugin) | STYLE-R12 | Remplir `checks.format` |
| Alias d'import | `paths` du tsconfig + `moduleNameMapper` Jest (`@catalogue/*`, `@shared/*`…) | STYLE-R23 | Ticket d'outillage |
| Validation des requêtes | `class-validator` + `class-transformer` (arbitrage A9) | ValidationPipe NestJS | Accord dépendance (SECURITY-R03) |
| Build | `nest build` | Contrôle `checks.build` | Remplir `checks.build` |
| Audit des dépendances | `npm audit` | SECURITY-R08 | À chaque ajout de dépendance |
| Hachage du mot de passe | `node:crypto` (`scrypt`) — aucune dépendance | A1 | Script ou commande documentée pour produire l'empreinte |

## Fichiers, classes et relations (EPIC-001, extrait des éléments structurants)

| Élément et couche | Action | Responsabilité | Collaborateurs et relation |
| --- | --- | --- | --- |
| `catalogue/domain/cafe/Cafe.ts` (domain) | créer | Garder un café cohérent et décider s'il passe sous le seuil | Utilise `PrixParFormat`, `PoidsStock`, `Montant` |
| `catalogue/application/use-cases/ChangeStockCafeUseCase.ts` | créer | Corriger le stock d'un café et déclencher l'alerte au passage sous le seuil | `CafeRepositoryInterface`, `ReglagesAlerteStockReaderInterface`, `EmailSenderInterface`, `LoggerInterface`, presenter |
| `catalogue/application/use-cases/DeleteCafeUseCase.ts` | créer | Supprimer un café jamais commandé, sinon refuser | `CafeRepositoryInterface`, `HistoriqueCommandesCafeReaderInterface` |
| `bootstrap/composition/ReglagesBoutiqueAlerteStockReader.ts` | créer | Raccord : implémente le port du catalogue en lisant `ReglagesBoutiqueRepositoryInterface` du module réglages (lecture seule ; pas le use case `GetReglagesBoutique`, qui attend un presenter en approche B) | Seul endroit qui connaît les deux modules (CODE-ARCHI-R08, R10) |
| `bootstrap/entrypoints/http/GerantAuthGuard.ts` | créer | Refuser toute route non publique sans session valide | `AuthenticateSessionGerantUseCase` (adapter primaire) |
| `shared/adapters/InMemoryEmailSender.ts` | créer | Garder et journaliser les e-mails « envoyés » | Implémente `EmailSenderInterface` |

## Sens des dépendances

- **Autorisé** : `presentation → application → domain` ; `infrastructure → application (ports) + domain` ; `bootstrap → tout` ; tout module `→ shared/ports`.
- **Interdit** : `domain` et `application` n'importent ni `presentation`, ni `infrastructure`, ni `@nestjs/*` (NESTJS-R01) ; aucun module n'importe un autre module, `bootstrap/` ni `shared/adapters/` ; `shared/` n'importe aucun module ; aucun import entre canaux de `presentation/`.
- Propriétaires des ports : chaque module dans `application/ports/` (CODE-ARCHI-R05) ; ports transverses dans `shared/ports/` (CODE-ARCHI-R09). Chaque port inverse une dépendance technique ou inter-modules (DESIGN-R03) ; les `…PresenterInterface` sont les output ports de l'approche B.
- Vérifié par `eslint-plugin-boundaries`.

## Parcours métier, distinct des dépendances

**Corriger le stock d'un café (avec alerte)** :
1. `PUT /gerant/cafes/:id/stock` → `GerantAuthGuard` valide la session (sinon 401) → `ValidationPipe` + `ChangeStockCafeRequest` vérifient la forme (sinon 400).
2. `ChangeStockCafeController` crée `ChangeStockCafePresenter` par `new`, appelle `ChangeStockCafeUseCase.execute(dto, presenter)`.
3. Le use case charge le café (sinon `CafeNotFoundError` → 404), lit seuil + adresse via `ReglagesAlerteStockReaderInterface`, appelle `cafe.changeStock(nouveauStock, seuil)` (sinon `InvalidStockError` → 422), enregistre le café.
4. Si le café vient de **passer** sous le seuil (avant ≥ seuil, après < seuil, Q1 : strictement inférieur ; Q2 : un changement de seuil ne déclenche rien), il envoie via `EmailSenderInterface` un e-mail nommant le café et son stock restant ; un échec d'envoi est journalisé sans annuler la correction (A3).
5. `presenter.present(result)` → le controller renvoie `presenter.viewModel()` (200).

**Connexion du gérant** : `POST /gerant/session` (publique) → `LogInGerantUseCase` compare l'e-mail et vérifie le mot de passe par `PasswordVerifierInterface` ; échec → `InvalidCredentialsError` (401, message identique pour e-mail ou mot de passe faux) ; succès → session créée (jeton aléatoire, expiration via `ClockInterface`) → ViewModel `{ token, expiresAt }`.

**Supprimer un café** : `DeleteCafeUseCase` → `HistoriqueCommandesCafeReaderInterface` ; déjà commandé → `CafeDejaCommandeError` (422, message « Ce café a déjà été commandé : cachez-le plutôt ») ; sinon suppression (204).

## Contrats utiles

| Appelant → composant / opération | Entrées et contraintes | Sortie et garanties | Erreurs métier / échecs techniques | Traduction et état après échec |
| --- | --- | --- | --- | --- |
| `AddCafeController` → `AddCafeUseCase.execute(dto, presenter)` | nom, origine, description non vides ; prix en centimes > 0 pour 250 g, 500 g, 1 kg | Café créé visible, stock 0 ; Result : id, champs, prix | `InvalidCafeError` | 422 ; rien n'est enregistré |
| `UpdateCafeController` → `UpdateCafeUseCase` | id + mêmes champs | Café modifié | `CafeNotFoundError`, `InvalidCafeError` | 404 / 422 ; café inchangé |
| `DeleteCafeController` → `DeleteCafeUseCase` | id | Café retiré | `CafeNotFoundError`, `CafeDejaCommandeError` | 404 / 422 ; café conservé |
| `Hide/ShowCafeController` → `Hide/ShowCafeUseCase` | id | Visibilité changée (idempotent) | `CafeNotFoundError` | 404 |
| `ListCataloguePublicController` → `ListCataloguePublicUseCase` | aucune | Seuls les cafés visibles : nom, origine, description, prix des 3 formats | — | — |
| `ChangeStockCafeController` → `ChangeStockCafeUseCase` | id, stock en kg ≥ 0, au gramme près | Stock enregistré ; e-mail envoyé seulement au passage sous le seuil | `CafeNotFoundError`, `InvalidStockError` ; échec technique d'envoi d'e-mail | 404 / 422 (stock inchangé) ; échec d'e-mail : journalisé, stock conservé (A3) |
| `ListCafesStockBasUseCase` | aucune | Cafés dont stock < seuil (Q1, strict) | — | — |
| `UpdateReglagesBoutiqueUseCase` | seuil kg ≥ 0, adresse e-mail valide, frais en centimes ≥ 0 | Réglages remplacés d'un bloc | `InvalidReglagesBoutiqueError` | 422 ; réglages inchangés |
| `LogInGerantUseCase` | e-mail, mot de passe | Jeton + expiration | `InvalidCredentialsError` | 401, message générique |
| `GerantAuthGuard` → `AuthenticateSessionGerantUseCase` | jeton de l'en-tête `Authorization` | Accès accordé | `InvalidSessionError` | 401 ; aucune action exécutée |
| `CafeRepositoryInterface` | `save(cafe)`, `findById(id)`, `findAll()`, `delete(id)` | Racine d'agrégat seulement (DDD-R05) | Échec technique (futur stockage) | Erreur générique 500 sans détail (SECURITY-R07), détail journalisé |
| `EmailSenderInterface.send(message)` | destinataire, sujet, texte | E-mail remis à l'adapter | Échec technique | Voir A3 |

## Références aux décisions

| Choix / lien canonique | Statut | Référence de validation | Remplace / remplacé par |
| --- | --- | --- | --- |
| [ADR 0001](../adr/0001-architecture-de-base-nestjs-clean-en-memoire.md) : NestJS + clean architecture modulaire + DDD léger, stockage en mémoire, approche B | validé | Mandat utilisateur du 2026-10-09 | aucun |
| Arbitrages A1–A12, Q1–Q3 (ce document) | validé | Utilisateur, 2026-10-09 (via coordinateur) | aucun |

## Variations plausibles et incertitudes

| Variation / hypothèse | Source et plausibilité | Frontière / parties stables | Coût aujourd'hui / arbitrage |
| --- | --- | --- | --- |
| Vraie base de données | Décision utilisateur « reportée » : certaine | `…RepositoryInterface` + tests de contrat | Faible (ports déjà requis) ; futur ADR |
| Vrai service d'e-mail | Implicite (alertes, confirmations EPIC-003/004) : probable | `EmailSenderInterface` | Faible |
| Vrai paiement | Besoin client §5, EPIC-003 : certaine | `PaymentProviderInterface` | EPIC-003 |
| Interface web | Besoin client : « plus tard » | ViewModels déjà prêts à afficher (approche B) | Aucun ; pas de CORS ni de cookie conçus maintenant |

Aucun essai codé nécessaire.

## Démarche de réalisation et tests

- **TDD** : recommandé pour domaine et use cases (A10, TESTING-R12) ; les règles TDD (rules `developpement/tdd.md`) seront chargées par le développeur si retenu.
- **Tranches verticales** (WORKFLOW-R09) : oui, les use cases ont plusieurs comportements (nominal, refus, alerte). Ordre proposé, chaque tranche traversant toutes les couches :
  1. Outillage (tickets PO) : projet Nest CommonJS, lint + frontières, format, Jest, alias, `checks`.
  2. Connexion du gérant + guard global (sinon aucune route gérant n'est testable en e2e).
  3. Réglages (lecture + modification) — prérequis de l'alerte.
  4. Ajouter un café → catalogue public → modifier → cacher/réafficher → supprimer (refus inclus).
  5. Corriger le stock → liste du stock → liste sous le seuil → alerte e-mail.
- **Parallélisation** : après l'étape 2, les tranches 3 et 4 sont indépendantes ; la 5 dépend de 3 et 4.
- Niveaux : `unit` = use case avec fakes des ports (TESTING-R10) + presenters seuls ; `integration` = tests de contrat fake ↔ adapter `InMemory…` (TESTING-R20) ; `e2e` = application démarrée, appels HTTP.

| Comportement / risque | Niveau de test et frontière | Données / doublure | Résultat attendu |
| --- | --- | --- | --- |
| Connexion acceptée / refusée (e-mail ou mot de passe faux) | unit (`LogInGerantUseCase`) | Fake compte + vérificateur, `FakeClock` | Jeton + expiration / `InvalidCredentialsError` |
| Toute route gérant refusée sans session ou session expirée | e2e | Appel sans en-tête, jeton expiré | 401 |
| Ajout d'un café avec 3 prix ; refus si un prix manque | unit | Builder de café | Café créé / `InvalidCafeError` |
| Catalogue public = cafés visibles seulement | unit | 1 visible, 1 caché | Seul le visible |
| Suppression refusée si déjà commandé | unit | `FakeHistoriqueCommandesReader` « commandé » | `CafeDejaCommandeError`, café conservé |
| Alerte envoyée au passage sous le seuil, pas aux mouvements suivants | unit | Seuil 2 kg ; stock 3 → 1,5 → 1 | 1 seul e-mail, nommant le café et « 1,5 kg » |
| Échec d'e-mail : stock conservé | unit | Fake e-mail en échec | Stock enregistré, erreur journalisée |
| Mise en forme des prix, poids, dates | unit (presenters) | Result | « 12,50 € », « 1,500 kg » |
| Fake et adapter en mémoire respectent le même port | integration (contrat) | — | Mêmes résultats |

Contrôles du projet : indisponibles pour l'instant (`checks` à `null`, observé) ; remplis par le développeur après les tickets d'outillage.

## Liberté de réalisation et reprise

- Laissés au développeur : noms internes, forme exacte des ViewModels, partage ou non de la clé de métadonnée « route publique » (décorateur `PublicRoute` déclaré dans chaque module qui a une route publique, pour respecter l'absence d'import entre modules ; factorisation seulement à la 3e occurrence, PRINCIPLES-R05), format exact des messages de journal, langue des chemins de routes HTTP (français ou anglais, à garder homogène).
- Nécessitent une nouvelle validation si modifiés : approche B, découpage en modules, ports listés, sens des dépendances, comportement de l'alerte (passage seulement), refus de suppression d'un café commandé.
- Suite possible (au choix de l'utilisateur) : `architecte --design` ; relecture `architecte --review` conseillée pour l'ADR 0001 (one-way door, CONCEPTION-R18) ; ensuite product-owner pour le découpage.

</details>
