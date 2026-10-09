# EPIC - Suivi et annulation des commandes

Statut : À faire
Rang : 4

## Problème / besoin
Le gérant doit savoir où en est chaque commande pour la préparer et l'expédier.
Il doit aussi pouvoir annuler une commande sans perdre le café qu'elle bloquait.

## Comportement attendu
- [ ] Le gérant voit la liste de toutes les commandes, avec client, date, montant et statut.
- [ ] Le gérant ouvre une commande et voit son détail : cafés, formats, quantités, adresse de livraison.
- [ ] Le gérant fait avancer une commande d'une étape : payée → préparée → expédiée → livrée.
- [ ] Le gérant annule une commande « payée » ou « préparée » : elle passe au statut « annulée » et le stock de chaque café remonte du poids commandé.
- [ ] L'annulation déclenche un remboursement du montant payé auprès du service de paiement (simulé).
- [ ] L'annulation d'une commande « expédiée » ou « livrée » est refusée.
- [ ] Le retour à une étape précédente est refusé.
- [ ] Le client reçoit un e-mail quand sa commande passe à « expédiée ».
- [ ] Le client reçoit un e-mail quand sa commande est annulée, avec le montant remboursé.
- [ ] Un visiteur sans accès gérant ne peut ni voir ni modifier les commandes.

## Règles métier
- L'accès gérant est celui défini dans l'EPIC catalogue (un seul compte, e-mail + mot de passe).
- Une commande ne peut ni sauter une étape, ni revenir en arrière.
- Une commande annulée ou livrée ne change plus de statut.
- Le service de remboursement simulé doit pouvoir être remplacé par un vrai service sans changer le reste.

## Questions ouvertes
- Aucune.
