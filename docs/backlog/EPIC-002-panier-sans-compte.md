# EPIC - Panier sans compte

Statut : À faire

## Problème / besoin
Un visiteur veut choisir plusieurs cafés avant de payer, sans créer de compte.
Il doit voir à tout moment ce qu'il a choisi et combien ça va lui coûter.

## Comportement attendu
- [ ] Un visiteur sans compte ajoute un café visible dans un format (250 g, 500 g, 1 kg) à son panier.
- [ ] Il change la quantité d'une ligne du panier.
- [ ] Il retire une ligne du panier.
- [ ] Un ajout ou une hausse de quantité qui dépasse le stock restant est refusé avec le message « Stock insuffisant ».
- [ ] Un café caché ne peut pas être ajouté au panier.
- [ ] Il voit le contenu de son panier : café, format, quantité, prix unitaire, prix de la ligne.
- [ ] Les prix affichés dans le panier sont toujours les prix actuels du catalogue.
- [ ] Une ligne dont le café a été caché reste visible, marquée « plus disponible », et n'est pas comptée dans le total.
- [ ] Il voit trois montants : sous-total des cafés, frais de livraison, total.

## Règles métier
- Aucun compte client, aucune connexion.
- Le panier ne bloque pas le stock : le stock est vérifié à l'ajout, puis de nouveau au paiement.
- Les frais de livraison sont un prix fixe, réglé par le gérant, jamais offerts.
- Le panier n'est pas retrouvé lors d'une visite suivante (pour l'instant).

## Questions ouvertes
- Aucune.
