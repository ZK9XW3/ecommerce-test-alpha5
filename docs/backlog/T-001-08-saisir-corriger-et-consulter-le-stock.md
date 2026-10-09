# [8] Saisir, corriger et consulter le stock

Statut : À faire
Epic parente : EPIC-001 (EPIC-001-catalogue-cafes-et-stock.md)
Bloqué par : T-001-07 (même fiche café, enrichie du stock)
Lot : LOT-001 (docs/cpo/tickets/2026-10-09-lot-1-catalogue-cafes-et-stock.md)

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
