# [7] Supprimer un café

Statut : À faire
Epic parente : EPIC-001 (EPIC-001-catalogue-cafes-et-stock.md)
Bloqué par : T-001-06 (le message de refus renvoie vers l'action « cacher »)
Lot : LOT-001 (docs/cpo/tickets/2026-10-09-lot-1-catalogue-cafes-et-stock.md)

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
