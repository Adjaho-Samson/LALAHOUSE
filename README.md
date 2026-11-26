# LalaHouse — boutique mode

Vitrine e-commerce statique en HTML, CSS et JavaScript vanilla. Aucun backend ni paiement en ligne : les réservations, commandes et questions sont redirigées vers WhatsApp.

## Lancer en local

Ouvrir `index.html` dans un navigateur, ou lancer un serveur statique depuis la racine du projet, par exemple :

```sh
python3 -m http.server 8000
```

## Modifier le catalogue

Les articles de départ sont regroupés dans `js/products.js` (`window.LALAHOUSE_PRODUCTS`). Modifier ce fichier pour mettre à jour les prix, descriptions, images, tailles, couleurs et disponibilités. Les trois prix initiaux reprennent les références communiquées par la propriétaire.

## Avant mise en production

- Le numéro WhatsApp confirmé `+229 01 44 60 39 10` est utilisé par les liens de commande et de contact.
- Les prix affichés reprennent les références communiquées pour la boutique. Stocks, tailles, couleurs et modalités de livraison/retrait restent à confirmer avec LalaHouse.
- Les tarifs et délais de livraison affichés sont indicatifs et à confirmer.
- Les photographies générées sont des visuels d'ambiance, et non des photos certifiées des articles réellement vendus.
- Les polices Google sont facultatives ; des polices système de remplacement sont prévues.
