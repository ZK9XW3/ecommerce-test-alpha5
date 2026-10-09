# [5] Modifier un café

Statut : À faire
Epic parente : EPIC-001 (EPIC-001-catalogue-cafes-et-stock.md)
Bloqué par : T-001-03 (le café et sa fiche existent)
Lot : LOT-001 (docs/cpo/tickets/2026-10-09-lot-1-catalogue-cafes-et-stock.md)

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
