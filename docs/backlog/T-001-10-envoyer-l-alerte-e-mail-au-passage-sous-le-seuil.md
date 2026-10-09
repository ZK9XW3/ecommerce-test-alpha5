# [10] Envoyer l'alerte e-mail au passage sous le seuil

Statut : À faire
Epic parente : EPIC-001 (EPIC-001-catalogue-cafes-et-stock.md)
Bloqué par : T-001-09 (même règle « sous le seuil » et lecture du seuil et de l'adresse réglés)
Lot : LOT-001 (docs/cpo/tickets/2026-10-09-lot-1-catalogue-cafes-et-stock.md)

---
id: T-001-10
revision: 1
sources: [EPIC-001, architecture 2026-10-09 r1 (A2, A3, Q1, Q2), LOT-001]
---

## Pour l'humain

Dès que le stock d'un café passe sous le seuil, le gérant reçoit un e-mail qui nomme ce café et donne son stock restant, pour qu'il pense à en recommander. Il ne reçoit pas un e-mail à chaque mouvement tant que le café reste sous le seuil.

## Pour l'agent

### Comportement attendu

#### Scénario : passage sous le seuil (détaille : P17 « Quand le stock d'un café passe sous le seuil, un e-mail d'alerte nommant ce café et son stock restant est envoyé à l'adresse réglée »)
- **Given** le seuil est de 2 kg, l'adresse d'alerte est « stock@cafe-exemple.fr », « Moka » a 3 kg
- **When** le gérant corrige le stock de « Moka » à 1,5 kg
- **Then** un e-mail est envoyé à « stock@cafe-exemple.fr », nommant « Moka » et indiquant 1,5 kg

#### Scénario : déjà sous le seuil (détaille : P17, règle « pas à chaque mouvement suivant tant qu'il reste dessous »)
- **Given** le seuil est de 2 kg et « Moka » a 1,5 kg
- **When** le gérant corrige le stock à 1 kg
- **Then** aucun e-mail n'est envoyé

#### Scénario : arrivée exactement au seuil (détaille : P17, décision « strictement inférieur »)
- **Given** le seuil est de 2 kg et « Moka » a 3 kg
- **When** le gérant corrige le stock à 2 kg
- **Then** aucun e-mail n'est envoyé

#### Scénario : remontée puis nouvelle baisse (détaille : P17)
- **Given** le seuil est de 2 kg et « Moka » a 1 kg
- **When** le gérant corrige le stock à 5 kg, puis à 1,5 kg
- **Then** un seul e-mail est envoyé, lors de la baisse à 1,5 kg

#### Scénario : changer le seuil n'alerte pas (détaille : P17, décision « remonter le seuil n'envoie pas d'alerte »)
- **Given** « Java » a 5 kg et le seuil est de 2 kg
- **When** le gérant règle le seuil à 6 kg
- **Then** aucun e-mail n'est envoyé

#### Scénario : échec de l'envoi (détaille : P11 et P17)
- **Given** le seuil est de 2 kg, « Moka » a 3 kg, et l'envoi d'e-mail échoue
- **When** le gérant corrige le stock à 1,5 kg
- **Then** le stock est quand même enregistré à 1,5 kg

### Partie technique (lead tech)

Sources abrégées : « Archi » = `docs/cto/architecture/2026-10-09-architecture-boutique-cafe.md` (r3) ; « ADR 0001 » = `docs/cto/adr/0001-architecture-de-base-nestjs-clean-en-memoire.md`. Niveaux de test : recommandation (TESTING-R10, TESTING-R17, TESTING-R19) ; le développeur garde le dernier mot et signale tout écart (TESTING-R21). Pas de Cucumber.

#### Consignes

| Consigne | Source |
|---|---|
| Port transverse `EmailSenderInterface` + `InMemoryEmailSender` (garde et journalise, sans donnée sensible) | Archi A2 ; SECURITY-R06 |
| `Cafe.changeStock(nouveauStock, seuil)` indique le **passage** sous le seuil (avant ≥ seuil, après < seuil) | Archi « Parcours métier » étape 4 ; Q1 |
| `ChangeStockCafeUseCase` lit seuil + adresse via `ReglagesAlerteStockReaderInterface`, enregistre le stock **puis** envoie l'e-mail (nom du café + stock restant) ; échec d'envoi journalisé via `LoggerInterface`, stock conservé | Archi « Parcours métier » ; A3 ; « Fichiers, classes et relations » |
| Aucun envoi lors d'un changement de seuil (`UpdateReglagesBoutiqueUseCase` inchangé) | Archi Q2 |

#### Fichiers concernés

```
src/
|-- [A] shared/ports/EmailSenderInterface.ts, shared/adapters/InMemoryEmailSender.ts
|-- [M] catalogue/domain/cafe/Cafe.ts
|-- [M] catalogue/application/use-cases/ChangeStockCafeUseCase.ts
`-- [M] bootstrap/composition/AppModule.ts
```

#### Niveau de test suggéré par scénario

| Scénario | Niveau suggéré | Pourquoi |
|---|---|---|
| passage sous le seuil | unit (use case) | Archi « Démarche » : `FakeEmailSender`, seuil 2 kg, 3 → 1,5 kg |
| déjà sous le seuil | unit (use case) | Séquence 3 → 1,5 → 1 : un seul e-mail |
| arrivée exactement au seuil | unit (use case) | Limite Q1 |
| remontée puis nouvelle baisse | unit (use case) | Séquence via `execute` |
| changer le seuil n'alerte pas | e2e | Le use case réglages ne connaît pas l'e-mail ; seul un test de l'application câblée prouve l'absence d'envoi (`PUT /gerant/settings` puis lecture de `InMemoryEmailSender`) |
| échec de l'envoi | unit (use case) | Archi « Démarche » : fake e-mail en échec, stock enregistré, erreur journalisée (A3) |

#### Commandes de contrôle

`checks` est vide dans `.config/project.yaml` à ce jour : aucune commande déclarée. Lancer celles que T-001-01 aura renseignées : `checks.types`, `checks.lint`, `checks.format`, `checks.tests`, `checks.build`.

#### Points d'attention

- Test de contrat `FakeEmailSender` ↔ `InMemoryEmailSender` (TESTING-R20).
- Ne journaliser aucune donnée sensible (SECURITY-R06).

### Critères de fin
- [ ] Chaque scénario est vérifié par au moins un test.
- [ ] Les commandes de contrôle de la partie technique réussissent.
- [ ] Le reste de l'application compile et les tests existants passent.

### Dépendances
- Bloqué par : T-001-09 (même règle « sous le seuil » et lecture du seuil et de l'adresse réglés)
