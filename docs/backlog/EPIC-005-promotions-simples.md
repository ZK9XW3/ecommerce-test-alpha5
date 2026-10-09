# EPIC - Promotions simples

Statut : À faire

## Problème / besoin
Le gérant veut attirer et faire revenir ses clients avec des promotions simples,
sans calcul à la main au moment de la commande.

## Comportement attendu
- [ ] Le gérant crée un code promo avec un pourcentage de réduction, une date de début et une date de fin (ex. « CAFE10 » = -10 %).
- [ ] Le gérant active ou désactive un code promo.
- [ ] Le visiteur saisit un code promo valide : la réduction s'applique au sous-total des cafés et le total baisse d'autant.
- [ ] Les frais de livraison ne sont jamais réduits par un code promo.
- [ ] Un code inconnu, désactivé, pas encore commencé ou expiré est refusé avec le message « Code promo invalide ».
- [ ] Le gérant active ou désactive l'offre « 1 kg acheté = 250 g offerts ».
- [ ] Quand l'offre est active, chaque sachet de 1 kg dans le panier ajoute un sachet de 250 g du même café, à 0 €.
- [ ] Un code promo et l'offre 1 kg se cumulent : le code réduit les cafés payés, le sachet offert reste à 0 €.
- [ ] Le sachet offert compte dans la vérification du stock (à l'ajout et au paiement) et retire 0,25 kg du stock au paiement.

## Règles métier
- Un seul code promo par commande.
- Promos réservées aux clients fidèles : hors périmètre pour l'instant.

## Questions ouvertes
- Aucune.
