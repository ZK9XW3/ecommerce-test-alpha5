# EPIC - Catalogue de cafés et stock

Statut : À faire
Rang : 1

## Problème / besoin
Le gérant vend son café en grains uniquement en magasin. Pour vendre en ligne,
il doit pouvoir présenter ses cafés avec leurs prix et savoir à tout moment
combien il lui en reste, pour ne jamais vendre un café épuisé.

## Comportement attendu
- [ ] Le gérant se connecte sur une page dédiée avec son e-mail et son mot de passe.
- [ ] Un e-mail ou un mot de passe faux refuse la connexion.
- [ ] Toutes les pages gérant (catalogue, stock, réglages, commandes, promos) exigent cette connexion ; sans elle, l'accès est refusé.
- [ ] Le gérant ajoute un café avec un nom, une origine, une description et un prix pour chacun des trois formats (250 g, 500 g, 1 kg).
- [ ] Le gérant modifie chacune de ces informations.
- [ ] Le gérant supprime un café qui n'a jamais été commandé.
- [ ] La suppression d'un café déjà commandé est refusée, avec un message qui propose de le cacher.
- [ ] Le gérant cache un café : il n'apparaît plus dans le catalogue public et ne peut plus être commandé.
- [ ] Le gérant réaffiche un café caché : il réapparaît dans le catalogue public.
- [ ] Le catalogue public liste uniquement les cafés visibles, avec leur origine, leur description et le prix de chaque format.
- [ ] Le gérant saisit et corrige le stock de chaque café en kilos.
- [ ] Le gérant consulte le stock restant de chaque café.
- [ ] Le gérant règle le seuil de stock bas, commun à tous les cafés.
- [ ] Le gérant règle l'adresse e-mail qui reçoit les alertes de stock bas.
- [ ] Le gérant règle le prix fixe des frais de livraison dans l'écran de réglages, à côté du seuil de stock et de l'adresse d'alerte.
- [ ] Le gérant voit la liste des cafés dont le stock est sous le seuil.
- [ ] Quand le stock d'un café passe sous le seuil, un e-mail d'alerte nommant ce café et son stock restant est envoyé à l'adresse réglée.
- [ ] Un visiteur sans accès gérant ne peut ni ajouter, ni modifier, ni cacher, ni supprimer un café, ni changer le stock, le seuil, l'adresse d'alerte ou les frais de livraison.

## Règles métier
- Vente en ligne en grains uniquement, pas de café moulu.
- Chaque café est toujours proposé dans les trois formats : 250 g, 500 g et 1 kg, chacun avec son propre prix.
- Le stock est compté en kilos par café. Un sachet de 500 g retire 0,5 kg.
- Un format n'est pas commandable si le stock restant est inférieur à son poids.
- Le seuil de stock bas est le même pour tous les cafés.
- Un café déjà commandé ne se supprime pas : il se cache, pour que les anciennes commandes gardent leurs informations.
- Un seul compte gérant (e-mail + mot de passe) : pas de comptes multiples ni de rôles.
- Les frais de livraison sont un prix fixe unique, payé par le client, jamais offert.
- L'alerte e-mail part au moment où le stock passe sous le seuil, pas à chaque mouvement suivant tant qu'il reste dessous.

## Questions ouvertes
- Aucune.
