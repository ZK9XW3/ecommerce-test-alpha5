# [6] Cacher et réafficher un café

Statut : À faire
Epic parente : EPIC-001 (EPIC-001-catalogue-cafes-et-stock.md)
Bloqué par : T-001-05 (même fiche café, enrichie de la visibilité)
Lot : LOT-001 (docs/cpo/tickets/2026-10-09-lot-1-catalogue-cafes-et-stock.md)

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
