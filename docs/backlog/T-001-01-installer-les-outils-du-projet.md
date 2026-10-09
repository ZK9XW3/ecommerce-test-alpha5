# [1] Installer les outils du projet

Statut : À faire
Epic parente : EPIC-001 (EPIC-001-catalogue-cafes-et-stock.md)
Bloqué par : aucun
Lot : LOT-001 (docs/cpo/tickets/2026-10-09-lot-1-catalogue-cafes-et-stock.md)

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
