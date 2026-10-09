# [9] Voir les cafés sous le seuil

Statut : À faire
Epic parente : EPIC-001 (EPIC-001-catalogue-cafes-et-stock.md)
Bloqué par : T-001-04 (seuil réglé), T-001-08 (stock de chaque café)
Lot : LOT-001 (docs/cpo/tickets/2026-10-09-lot-1-catalogue-cafes-et-stock.md)

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
