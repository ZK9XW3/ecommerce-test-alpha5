---
id: adr-0001
revision: 3
status: valide
sources: [besoin-client.md@5034a88, docs/backlog/EPIC-001..005@5034a88, architecture-boutique-cafe r3]
supersedes: none
superseded_by: none
---

# 0001. Back-end NestJS en TypeScript, clean architecture modulaire avec quelques concepts DDD, stockage en mémoire derrière des ports, présentation en approche B

## Récapitulatif humain

Le gérant veut seulement le « moteur » (back-end) d'une boutique de café en ligne. L'utilisateur a choisi : TypeScript + NestJS, une clean architecture (le métier au centre, la technique autour) avec quelques concepts DDD (modèle construit avec le vocabulaire métier), un stockage **en mémoire** pour commencer (le vrai choix de base de données est reporté) et l'approche de présentation B (presenter/ViewModel).

Raison : le métier contient de vraies règles (stock jamais négatif, alerte au passage sous le seuil, statuts de commande, promotions) et plusieurs éléments techniques à remplacer plus tard (base de données, paiement, e-mail). Des « ports » (prises standard que le métier définit) permettent de brancher la vraie base ou le vrai paiement sans toucher au métier.

Principal coût : plus de fichiers par action (use case, DTO, Result, port de presenter, presenter, ViewModel, controller) ; les données sont perdues à chaque redémarrage tant que la base n'est pas choisie.

Dérogations (validées par l'utilisateur le 2026-10-09, via coordinateur) : (1) CODE-ARCHI-R02/R13 — actions sans donnée à renvoyer (cacher, réafficher, supprimer) : use case sans presenter, le controller répond 204 (A11) ; portée : toutes les actions sans réponse ; raison : un presenter sans contenu n'apporte rien. (2) CODE-ARCHI-R02 — `AuthenticateSessionGerantUseCase` sans presenter ; portée : ce seul use case, appelé par le guard global ; raison : le guard n'a aucune réponse HTTP à construire. (3) TESTING-R11 — Jest au lieu de Vitest (A8) ; portée : tout le projet ; raison : NESTJS-R03 (projet NestJS en CommonJS testé avec Jest), règle plus spécifique.
Décisions remplacées : aucune.

<details>
<summary>Détails pour les agents</summary>

## Contexte et problème

Nouveau projet, aucun code (observé : dépôt à `5034a88`, seulement des documents). Choix structurant car il fixe l'organisation de tout `src/`, le framework et la forme de toutes les réponses HTTP (one-way door au sens de CONCEPTION-R18 : architecture de base).

## Options comparées

| Option | Bénéfices | Coût / inconvénients | Motif du choix ou du rejet |
| --- | --- | --- | --- |
| NestJS + clean architecture modulaire (retenue) | Injection de dépendances et câblage au même endroit (`AppModule`), guards, pipes ; métier testable sans Nest (NESTJS-R01) ; ports prêts pour base, paiement, e-mail | Framework lourd pour un petit projet (durable) ; Nest 12 pousse l'ESM alors que la doctrine garde CommonJS (NESTJS-R03, durable) ; plus de fichiers par action | Décision de l'utilisateur ; conforme à CODE-ARCHI-R01 (règles métier significatives et plusieurs adapters) ; Robert C. Martin, « Clean Architecture » ; Eric Evans, « Domain-Driven Design » (PRINCIPLES-R01) |
| Express/Fastify sans framework structurant | Plus léger | Câblage manuel, guards et validation à reconstruire | Rejeté par l'utilisateur (NestJS imposé) |
| Structure plate (CRUD) | Peu de fichiers | Règles métier dispersées, remplacement de la base coûteux | Contraire à CODE-ARCHI-R01 vu les règles métier |
| Présentation approche A (réponse simple) | Moins de fichiers | Mise en forme dans les controllers | Utilisateur a choisi B (CODE-ARCHI-R18) |

Stockage : en mémoire, derrière des ports `…RepositoryInterface` ; la base réelle sera un nouvel ADR.

## Décision et validation

Validée par l'utilisateur via le coordinateur (trace assumée : pas de trace directe de l'utilisateur dans ce dépôt ; décisions transmises dans le mandat de conception du 2026-10-09) : TypeScript + NestJS ; stockage en mémoire derrière des ports, vraie base reportée ; clean architecture + quelques concepts DDD ; approche de présentation B ; back-end seulement ; paiement simulé derrière un port.

Arbitrages complémentaires validés par l'utilisateur le 2026-10-09 (A1–A12, Q1–Q3 du document `architecture-boutique-cafe` r3) : session opaque + guard global, e-mail factice derrière un port, Jest, class-validator + class-transformer, TDD pour domaine et use cases, noms métier en français et techniques en anglais, valeurs initiales des réglages lues depuis la configuration (A6).

## Conséquences et compromis

- Toute persistance passe par un port de `application/ports/` ; les implémentations `InMemory…Repository` vivent dans `infrastructure/repositories/`.
- Données perdues au redémarrage (temporaire, jusqu'au choix de la base).
- Atomicité « vérifier puis baisser le stock » (EPIC-003) : en mémoire, garantie par une opération unique du repository sans `await` intermédiaire (Node exécute un seul fil) ; à réexaminer avec la vraie base (transaction ou verrou).
- Chaque action HTTP : controller → `execute(dto, presenter)` → `presenter.viewModel()` ; presenter créé par `new` (jamais provider Nest).
- Référence canonique : `architecture-boutique-cafe` r3, sections « Vue visuelle » et « Arborescence finale détaillée ».

## Évolutions et vérification

- Choix de la base : nouvel ADR ; les tests de contrat (TESTING-R20) garantiront que l'adapter réel respecte les mêmes ports que les fakes.
- Vrai service de paiement / d'e-mail : nouvel adapter dans `infrastructure/providers/`, sans toucher au métier.
- Vérification : `eslint-plugin-boundaries` refuse les imports interdits entre couches et modules (STYLE-R12, CODE-ARCHI-R10).

## Dérogations et remplacement

Dérogations : voir le récapitulatif (A11, authentification sans presenter, A8), validées le 2026-10-09 via coordinateur. Remplacement : aucun.

</details>
