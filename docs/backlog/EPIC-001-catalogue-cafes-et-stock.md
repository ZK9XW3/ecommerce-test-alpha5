# EPIC - Catalogue de cafés et stock

Statut : À faire

## Problème / besoin
Le gérant vend son café en grains uniquement en magasin. Pour vendre en ligne,
il doit pouvoir présenter ses cafés avec leurs prix et savoir à tout moment
combien il lui en reste, pour ne jamais vendre un café épuisé.

## Comportement attendu
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
- [ ] Le gérant voit la liste des cafés dont le stock est sous le seuil.
- [ ] Quand le stock d'un café passe sous le seuil, un e-mail d'alerte nommant ce café et son stock restant est envoyé à l'adresse réglée.
- [ ] Un visiteur sans accès gérant ne peut ni ajouter, ni modifier, ni cacher, ni supprimer un café, ni changer le stock, le seuil ou l'adresse d'alerte.

## Règles métier
- Vente en ligne en grains uniquement, pas de café moulu.
- Chaque café est toujours proposé dans les trois formats : 250 g, 500 g et 1 kg, chacun avec son propre prix.
- Le stock est compté en kilos par café. Un sachet de 500 g retire 0,5 kg.
- Un format n'est pas commandable si le stock restant est inférieur à son poids.
- Le seuil de stock bas est le même pour tous les cafés.
- Un café déjà commandé ne se supprime pas : il se cache, pour que les anciennes commandes gardent leurs informations.
- L'alerte e-mail part au moment où le stock passe sous le seuil, pas à chaque mouvement suivant tant qu'il reste dessous.

## Questions ouvertes
- Aucune.
