# Boutique café (back-end)

API HTTP NestJS de la boutique de café en ligne.

## Configuration

L'application lit sa configuration dans des variables d'environnement au démarrage. Si une variable obligatoire manque ou est invalide, elle refuse de démarrer.

| Variable                            | Obligatoire | Contenu                                                                                             |
| ----------------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `GERANT_EMAIL`                      | oui         | E-mail du compte gérant unique                                                                      |
| `GERANT_PASSWORD_HASH`              | oui         | Empreinte scrypt du mot de passe du gérant, forme `selHex:cléHex` (jamais le mot de passe en clair) |
| `GERANT_SESSION_DURATION_MINUTES`   | oui         | Durée d'une connexion du gérant, en minutes (ex. `480` pour 8 h)                                    |
| `REGLAGES_SEUIL_STOCK_BAS_KG`       | oui         | Seuil de stock bas de départ, en kg (ex. `2` ou `1.5`, au gramme près)                              |
| `REGLAGES_ADRESSE_ALERTE`           | oui         | Adresse e-mail de départ qui reçoit les alertes de stock bas                                        |
| `REGLAGES_FRAIS_LIVRAISON_CENTIMES` | oui         | Frais de livraison de départ, en centimes (ex. `490` pour 4,90 €)                                   |
| `PORT`                              | non         | Port HTTP (3000 par défaut)                                                                         |

### Produire l'empreinte du mot de passe

La commande lit le mot de passe sur l'entrée standard, pour qu'il n'apparaisse pas dans l'historique du terminal :

```sh
node -e "const c=require('node:crypto');const p=require('node:fs').readFileSync(0,'utf8').replace(/\r?\n$/,'');const s=c.randomBytes(16);console.log(s.toString('hex')+':'+c.scryptSync(p,s,64).toString('hex'))"
```

Tape le mot de passe, appuie sur Entrée, puis termine la saisie (`Ctrl+D` sous Linux/macOS, `Ctrl+Z` puis Entrée sous Windows). Copie la ligne affichée dans `GERANT_PASSWORD_HASH`.
