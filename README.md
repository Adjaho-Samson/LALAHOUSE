# LalaHouse — boutique mode

Vitrine e-commerce statique en HTML, CSS et JavaScript vanilla. Aucun backend ni paiement en ligne : les réservations, commandes et questions sont redirigées vers WhatsApp.

## Design

La direction artistique reprend celle de l'atelier [Trina Hook](https://trinahook.vercel.app/) :

- **Palette** : noir profond `#100e12`, lavande `#c4a6d8`, bleu ciel `#9cc8da`, crème `#f6f1ea`, lavande clair `#eadff3`.
- **Typographies** : Playfair Display (titres) et Jost (texte / interface), avec des polices système de remplacement.
- **Composants** : barre d'annonce défilante, en-tête sombre, hero avec collage photo et badges flottants, bandeau incliné, cartes arrondies (univers, créations, savoir-faire, livraison), sections sombres, bouton WhatsApp flottant et fiche produit en fenêtre modale.

### Lisibilité garantie

Le thème est volontairement unique (clair sur fond crème, blanc sur fond sombre) afin qu'aucun texte ne puisse devenir invisible :

- contrastes vérifiés d'au moins 4,5:1 pour le texte courant et 3:1 pour les grands titres (WCAG AA) ;
- l'accent `#6f4f8c` est utilisé pour tout texte violet posé sur un fond clair ;
- chaque texte posé sur une photo dispose d'un fond plein ou d'un dégradé sombre ;
- les animations d'apparition ne masquent le contenu que si JavaScript et `IntersectionObserver` sont actifs (`html.js-anim`), avec un repli `noscript` et `@media (scripting: none)` ;
- le dégradé sur les mots en italique du hero n'est appliqué que si `background-clip:text` est pris en charge, sinon une couleur pleine est utilisée.

## Lancer en local

Ouvrir `index.html` dans un navigateur, ou lancer un serveur statique depuis la racine du projet, par exemple :

```sh
python3 -m http.server 8000
```

## Structure

- `index.html` — page unique : hero, univers, boutique, histoire, savoir-faire, livraison, appel à l'action, pied de page.
- `css/style.css` / `css/responsive.css` — design system puis adaptations responsive (1100, 900, 768, 560 et 380 px).
- `js/products.js` — catalogue (`window.LALAHOUSE_PRODUCTS`).
- `js/main.js` — rendu du catalogue, filtres, tri, fiche produit, menu mobile, animations et liens WhatsApp.
- `assets/images/` — visuels d'ambiance.

## Modifier le catalogue

Les articles de départ sont regroupés dans `js/products.js` (`window.LALAHOUSE_PRODUCTS`). Modifier ce fichier pour mettre à jour les prix, descriptions, images, tailles, couleurs et disponibilités. Les trois prix initiaux reprennent les références communiquées par la propriétaire.

## Avant mise en production

- Le numéro WhatsApp confirmé `+229 01 44 60 39 10` est utilisé par les liens de commande et de contact.
- Les prix affichés reprennent les références communiquées pour la boutique. Stocks, tailles, couleurs et modalités de livraison/retrait restent à confirmer avec LalaHouse.
- Les tarifs et délais de livraison affichés sont indicatifs et à confirmer.
- Les photographies générées sont des visuels d'ambiance, et non des photos certifiées des articles réellement vendus.
- Les polices Google sont facultatives ; des polices système de remplacement sont prévues.
