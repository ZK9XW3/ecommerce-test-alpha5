# [3] Régler seuil, adresse d'alerte et frais de livraison

Statut : À faire
Epic parente : EPIC-001 (EPIC-001-catalogue-cafes-et-stock.md)
Bloqué par : T-001-02 (connexion et protection des pages gérant)
Lot : LOT-001 (docs/cpo/tickets/2026-10-09-lot-1-catalogue-cafes-et-stock.md)

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
