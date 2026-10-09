# EPIC - Commande et paiement simulé

Statut : À faire

## Problème / besoin
Le visiteur a rempli son panier et veut acheter. Le gérant ne doit encaisser
que des commandes payées, sans jamais vendre un café qu'il n'a plus.

## Comportement attendu
- [ ] Le visiteur transforme son panier en commande en donnant son nom, son e-mail et son adresse de livraison.
- [ ] Une commande avec un nom, un e-mail ou une adresse manquant est refusée, avec le champ manquant indiqué.
- [ ] Au paiement, si un café n'a plus assez de stock, la commande est refusée avec le message « Stock insuffisant » et le café concerné.
- [ ] Le paiement passe par un service simulé qui répond « accepté » ou « refusé ».
- [ ] On peut forcer la réponse du simulateur (« accepté » ou « refusé ») selon le faux numéro de carte utilisé.
- [ ] Paiement accepté : la commande est créée au statut « payée », le stock de chaque café baisse du poids commandé et le panier est vidé.
- [ ] Paiement accepté : le client reçoit un e-mail de confirmation avec le récapitulatif de la commande et le montant payé.
- [ ] Paiement refusé : aucune commande n'est créée, le stock ne change pas et le panier reste intact.
- [ ] Le montant payé = sous-total des cafés + frais de livraison.

## Règles métier
- Le stock est vérifié au moment du paiement, pas avant.
- Les lignes « plus disponible » ne sont pas commandées.
- Le service de paiement simulé doit pouvoir être remplacé par un vrai service sans changer le reste.

## Questions ouvertes
- Aucune.
