# LalaHouse — boutique mode

Vitrine e-commerce statique en HTML, CSS et JavaScript vanilla. Aucun backend ni paiement en ligne : les réservations, commandes et questions sont redirigées vers WhatsApp.

## Design

La direction artistique actuelle adopte un langage de **magazine de mode contemporain** : plus éditorial, sobre et centré sur les silhouettes.

- **Palette** : ivoire `#f7f5f0`, encre `#211f1b`, argile `#a6533d` et nuances sable.
- **Typographies** : Cormorant Garamond (titres éditoriaux) et Jost (texte / interface), avec des polices système de remplacement.
- **Composants** : navigation claire et discrète, hero typographique avec collage photo asymétrique, bandeau éditorial, cartes à angles droits, espaces généreux et appels à l'action contrastés.
- **Principes UX** : priorité à la découverte des pièces, filtres conservés, prix lisibles, commande WhatsApp et livraison locale clairement expliquées.

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

## Refonte — signature éditoriale

`css/editorial.css`, chargé après les styles responsive historiques, définit la nouvelle direction : ouverture sur une seule silhouette, titres de magazine, tons ivoire et olive, légendes éditoriales et catalogue épuré. Les photographies existantes sont conservées ; elles restent des visuels d’ambiance à remplacer par les photos réelles du stock.

### Photo dans les commandes WhatsApp

- Commander et réserver préremplissent le texte avec la référence, les préférences et **l’URL absolue de la photo**. Le client doit encore envoyer le message dans WhatsApp. Une éventuelle miniature dépend de WhatsApp et n’est pas garantie.
- Le bouton « Partager avec la photo » apparaît uniquement si le navigateur accepte le partage de fichiers et si la photo a été chargée. Il ouvre le partage système : le client choisit WhatsApp et le contact LalaHouse. Le site ne peut pas imposer le destinataire à cette fonction. Certaines applications ne conservent pas le texte partagé avec un fichier.
- Un lien de téléchargement permet aussi de joindre la photo manuellement.
- Le partage natif nécessite généralement HTTPS et un appareil compatible. En cas d’annulation, la fiche reste ouverte ; en cas d’échec, la commande classique reste disponible.
- En production, les images doivent être publiquement accessibles sur le même hébergement. Les liens d’un aperçu temporaire ne conviennent pas aux commandes réelles. Aucun service serveur ni accès à un compte WhatsApp n’a été ajouté.
