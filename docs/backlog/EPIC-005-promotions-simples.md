# EPIC - Promotions simples

Statut : À faire
Rang : 5

## Problème / besoin
Le gérant veut attirer et faire revenir ses clients avec des promotions simples,
sans calcul à la main au moment de la commande.

## Comportement attendu
- [ ] Le gérant crée un code promo avec un pourcentage de réduction, une date de début et une date de fin (ex. « CAFE10 » = -10 %).
- [ ] Le gérant active ou désactive un code promo.
- [ ] Le visiteur saisit un code promo valide : la réduction s'applique au sous-total des cafés et le total baisse d'autant.
- [ ] La réduction est arrondie au centime le plus proche (ex. -10 % sur 23,45 € = 2,35 €).
- [ ] Un code est valable jusqu'à 23 h 59 (heure de Paris) le jour de sa date de fin, puis refusé.
- [ ] Les frais de livraison ne sont jamais réduits par un code promo.
- [ ] Un code inconnu, désactivé, pas encore commencé ou expiré est refusé avec le message « Code promo invalide ».
- [ ] Le gérant active ou désactive l'offre « 1 kg acheté = 250 g offerts ».
- [ ] Quand l'offre est active, chaque sachet de 1 kg dans le panier ajoute un sachet de 250 g du même café, à 0 €.
- [ ] Un code promo et l'offre 1 kg se cumulent : le code réduit les cafés payés, le sachet offert reste à 0 €.
- [ ] Le sachet offert compte dans la vérification du stock (à l'ajout et au paiement) et retire 0,25 kg du stock au paiement.
- [ ] Offre active : si le stock ne couvre pas 1 kg + 250 g, l'ajout du sachet de 1 kg est refusé avec « Stock insuffisant » (pas d'achat sans le cadeau).
- [ ] Un visiteur sans accès gérant ne peut ni créer, ni activer, ni désactiver un code promo ou l'offre 1 kg.

## Règles métier
- Un seul code promo par commande.
- La réduction se calcule sur le sous-total des cafés uniquement, jamais sur la livraison.
- La date de fin est incluse, jusqu'à 23 h 59 heure de Paris.
- L'accès gérant est celui défini dans l'EPIC catalogue.
- Promos réservées aux clients fidèles : hors périmètre pour l'instant.

## Questions ouvertes
- Aucune.
