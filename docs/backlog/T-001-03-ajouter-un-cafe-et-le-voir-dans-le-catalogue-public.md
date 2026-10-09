# [4] Ajouter un café et le voir dans le catalogue public

Statut : À faire
Epic parente : EPIC-001 (EPIC-001-catalogue-cafes-et-stock.md)
Bloqué par : T-001-04 (même fichier de câblage de l'application ; T-001-04 dépend de la connexion)
Lot : LOT-001 (docs/cpo/tickets/2026-10-09-lot-1-catalogue-cafes-et-stock.md)

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
