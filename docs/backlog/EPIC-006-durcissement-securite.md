# EPIC - Durcissement sécurité

Statut : À faire
Rang : 6

## Problème / besoin
Aujourd'hui, n'importe qui peut essayer autant de mots de passe qu'il veut sur la connexion gérant (POST /gerant/session). Relevé en relecture de T-001-02 : chaque essai est ralenti, mais rien ne bloque une série d'essais.

## Comportement attendu
- [ ] Après trop d'essais de connexion ratés, les essais suivants sont refusés pendant un moment, même avec le bon mot de passe.
- [ ] À la fin du blocage, la connexion refonctionne avec le bon mot de passe.
- [ ] Les pages gérant d'un gérant déjà connecté ne sont pas touchées par le blocage.
- [ ] (À confirmer, voir question 4) Une connexion réussie remet le compteur d'essais ratés à zéro.

## Règles métier
- Le blocage ne concerne que les essais de connexion, pas une session gérant déjà ouverte.
- Pendant le blocage, aucun essai n'est accepté, même correct.

## Questions ouvertes
1. Combien d'essais ratés sont autorisés, et sur quelle période (ex. 5 en 15 min) ?
2. Combien de temps dure le blocage ?
3. Compte-t-on par adresse IP, par compte (risque qu'un attaquant bloque le vrai gérant), ou les deux ?
4. Une connexion réussie remet-elle le compteur à zéro ?
5. Quel message pendant le blocage : avec le temps d'attente restant ou non ?
6. Faut-il prévenir le gérant quand la limite est atteinte ? (si oui : autre ticket)
7. Pour l'architecte : @nestjs/throttler (nouvelle dépendance) ou compteur maison en mémoire (cohérent avec l'ADR 0001) ? ADR nécessaire ou non ? Estimation officielle du coût.

## Décision de priorisation
CEO, validée par l'utilisateur le 2026-10-09 : hors LOT-001 ; lot séparé, placé en dernier, après EPIC-005, car la démo reste locale. Impact S, coût S (estimation grossière du CEO, pas de l'architecte).

## Note
Un brouillon de ticket (T-001-11, 5 scénarios : sous la limite, limite atteinte, fin du blocage, reset après succès, pages gérant non touchées) a été préparé par le PO. Il sera repris et renuméroté par le PO lors du découpage du lot.
