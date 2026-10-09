# Besoin client — Boutique de café en ligne

> Document rédigé du point de vue du client, avec ses mots, sans technique.
> Il sert d'entrée au CEO pour prioriser, puis à l'architecte et au Project Owner pour découper.

## Qui je suis

Je tiens une petite boutique de café en grains et moulu. Aujourd'hui je vends uniquement en magasin. Je veux maintenant vendre en ligne.

Pour l'instant, je veux seulement la partie « moteur » du site (le back-end). L'interface viendra plus tard.

## Ce que je veux

### 1. Mon catalogue de cafés

- Je veux pouvoir ajouter, modifier et retirer mes cafés.
- Chaque café a un nom, une origine (Éthiopie, Colombie…), une description et un prix.
- Le café se vend au poids : 250 g, 500 g ou 1 kg. Le prix dépend du poids.
- Certains cafés existent en grains **et** moulus, d'autres seulement en grains.
- Je veux pouvoir cacher un café sans le supprimer, par exemple quand c'est hors saison.

### 2. Mon stock

- Je veux savoir combien il me reste de chaque café.
- On ne doit pas pouvoir commander un café que je n'ai plus.
- Quand le stock est bas, j'aimerais le savoir. Bas, c'est… je ne sais pas trop, « pas beaucoup ».

### 3. Le panier

- N'importe quel visiteur peut remplir un panier, **sans créer de compte**.
- Il peut ajouter un café, retirer un café et changer la quantité.
- Il voit le total de son panier.
- S'il revient plus tard, j'aimerais qu'il retrouve son panier. Mais je ne veux pas de compte client.

### 4. La commande

- Le visiteur transforme son panier en commande.
- Il donne son nom, son e-mail et son adresse de livraison.
- Il paie, et la commande est validée seulement si le paiement passe.
- Les frais de livraison sont offerts à partir d'un certain montant. Sinon, ils sont payants.

### 5. Le paiement

- Pour l'instant, on **simule** le paiement : un faux service qui dit « accepté » ou « refusé ».
- Plus tard, je brancherai un vrai service de paiement. Ça doit pouvoir se faire facilement.

### 6. Le suivi des commandes

- Je veux voir toutes mes commandes.
- Une commande passe par plusieurs étapes : payée, préparée, expédiée, livrée.
- Je veux aussi pouvoir annuler une commande. Dans ce cas, le stock doit revenir.

### 7. Les promotions

- Je veux faire des promos, mais **simples**.
- Par exemple un code « CAFE10 » pour -10 %.
- J'aimerais aussi « 1 kg acheté = 250 g offerts », et des promos réservées aux clients fidèles.

## Ce que je ne veux pas

- Pas de compte client, pas de connexion.
- Pas de vrai paiement pour l'instant.
- Pas d'interface (pas de site visible) pour l'instant.

## Ce qui compte le plus pour moi

Tout est important ! Mais surtout que les gens puissent commander vite, et que je ne vende jamais un café que je n'ai plus.

