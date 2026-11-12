# Code-secret

Jeu solo inspiré du Mastermind : retrouver un code caché de quatre couleurs en dix essais. Projet individuel réalisé avec Codex, séparé du morpion.

## État actuel

Version **0.1.0 — sélection et validation** : quatre sélecteurs nommés, indicateur du nombre de couleurs, refus des propositions incomplètes, enregistrement des propositions complètes, compteur et remise à zéro. Le code caché, les indices, la victoire/défaite et l’API commune ne sont pas encore réalisés. Ce prototype ne constitue pas encore une partie complète de Code secret.

Pour essayer : récupérer la branche `dev`, puis ouvrir [index.html](index.html) localement dans un navigateur. Aucun serveur ni installation n’est nécessaire pour cette démonstration. Choisir trois couleurs et valider : le refus doit laisser le compteur et l’historique inchangés. Ajouter la quatrième puis valider : une proposition est enregistrée. « Recommencer » efface cette série de propositions.

L’application n’est pas encore publiée sur GitHub Pages. Le rendu visé reste utilisable sur ordinateur et smartphone, au clavier et au toucher.

## Règles et source

Référence : [Projet — Code secret en couleurs](https://docs.google.com/document/d/17RUqUnEvIilitiNSY1kbK0QT7vBVcUeAT3L6ONJN8XU/edit), édition 2.2 du 3 novembre 2026, annexe `code-couleurs-1.0`. Ce cadrage suit le texte de l’énoncé fourni par l’étudiante.

- Palette et identifiants exacts, dans cet ordre : `rouge`, `bleu`, `vert`, `jaune`, `orange`, `violet`.
- Le programme tire au hasard quatre couleurs avec répétitions possibles. Le secret reste fixe et caché pendant la partie.
- Une proposition contient quatre couleurs ordonnées, modifiables avant validation. Une proposition incomplète ou avec une couleur interdite est refusée avec une explication, sans modifier le compteur ni l’historique.
- Chaque proposition valide consomme un des dix essais. Les propositions et leurs indices restent consultables jusqu’à la nouvelle partie.
- L’indice indique deux nombres, sans désigner les positions : bien placées, puis mal placées parmi les occurrences restantes. Chaque occurrence compte au maximum une fois.
- Quatre bien placées donnent la victoire, même au dixième essai. Dix propositions valides sans victoire donnent la défaite. Après la fin, aucune proposition ne change la partie.
- « Nouvelle partie » tire un code et remet essais, historique et indices à zéro.
- Les règles, l’historique et les indices restent clairement visibles ; les couleurs sont aussi identifiables par un nom ou un symbole.

Le projet reste sans compte, paiement, serveur applicatif, classement en ligne, données personnelles, service d’IA ni clé API. L’installation comme application web progressive (PWA), le hors-ligne et les extensions sont facultatifs.

## Choix réalisés avec Codex

Choix d’interface acceptés par l’étudiante avant cette première réalisation ; ce ne sont pas des règles imposées :

- Afficher le nom de chaque couleur avec son pion pour permettre de l’identifier autrement que par sa teinte.
- Utiliser quatre sélecteurs numérotés et un bouton « Valider » pour rendre l’ordre et la modification des choix compréhensibles au clavier et au toucher.
- Commencer par la sélection et le refus de trois couleurs sans modifier le compteur ni l’historique, avant de construire le jeu complet.

## Vérifications prévues

Les contrôles indiqués « réussi » ci-dessous ont été exécutés sur la version 0.1.0, le 12 novembre 2026, dans Chromium sous Windows avec Playwright 1.65.0. Les autres restent non vérifiés. Aucun défaut préexistant n’a été inventé pour présenter une correction.

| Cas | Action et résultat attendu | Observé / version |
| --- | --- | --- |
| Proposition incomplète | Choisir trois couleurs et tenter de valider : refus expliqué, compteur et historique inchangés. | Réussi, test navigateur automatisé, v0.1.0 : zéro essai et aucune entrée. Refus également vérifié après une proposition acceptée, sans altérer l’historique existant. |
| Proposition valide | Valider quatre couleurs autorisées : un essai consommé, proposition et indices ajoutés à l’historique. | Partiellement vérifié, test navigateur automatisé, v0.1.0 : compteur à un et couleurs enregistrées dans l’ordre, répétitions acceptées. Les indices restent à réaliser. |
| Couleur interdite | Pendant une partie, envoyer un identifiant interdit via `submitGuess` : `invalid-color`, compteur et historique inchangés. | Non vérifié. |
| Ordre | Secret rouge–bleu–vert–jaune ; proposition rouge–vert–bleu–orange : 1 bien placée et 2 mal placées. | Non vérifié. |
| Répétitions | Secret rouge–rouge–bleu–vert ; proposition de quatre rouges : 2 bien placées et 0 mal placée. | Non vérifié. |
| Dixième essai gagnant | Après neuf propositions incorrectes, proposer le secret : victoire au dixième essai. | Non vérifié. |
| Défaite et fin | Dix propositions incorrectes : défaite. Une validation après défaite ou victoire ne change rien. | Non vérifié. |
| Redémarrage | « Nouvelle partie » efface essais, historique et indices et effectue un nouveau tirage. Un nouveau tirage peut donner le même code. | Partiellement vérifié, v0.1.0 : « Recommencer » efface compteur, historique et sélection. Le tirage et les indices ne sont pas réalisés. |
| Accessibilité et mobile | Jouer au clavier puis sur smartphone ; commandes accessibles, couleurs nommées et affichage lisible. | Sélection et validation au clavier réussies, v0.1.0. Largeur de 390 px sans débordement et capture inspectée. Aucun essai sur un vrai smartphone ; jeu complet non vérifié. |
| API commune 0.2 | Vérifier le contrat et le partage du même jeu et du même état avec l’interface. | Contrat reçu ; implémentation et tests non réalisés. |

Les exemples avec secret fixe utiliseront `startGame({ secret: [...] })` en mode test. La conformité de l’API n’a pas encore été vérifiée.

### Essai manuel confirmé

Le 12 novembre 2026, l’étudiante a essayé la démonstration locale fournie dans `Code-secret-etape-1.zip`, version 0.1.0 correspondant au commit `474bb8059a467ad582137eb59af0bdf2f197e647`.

| Action | Attendu | Observé rapporté par l’étudiante | Statut |
| --- | --- | --- | --- |
| Choisir trois couleurs et valider | Message de refus ; compteur à 0/10. | Message de refus affiché ; compteur resté à 0/10. | Réussi, manuel. |
| Ajouter la quatrième couleur et valider | Proposition dans l’historique ; compteur à 1/10. | Proposition enregistrée ; compteur passé à 1/10. | Réussi, manuel. |

Ces observations sont rapportées par l’étudiante, sans observation directe de son écran par Codex. Le navigateur et l’appareil ne sont pas précisés. Elles ne vérifient pas les indices, le moteur complet ou l’API, encore absents.

### Reproduire les contrôles de cette étape

Depuis la racine du dépôt, avec Node.js et npm disponibles et un accès réseau pour les premiers téléchargements :

```sh
npm ci
npx playwright install chromium
npm test
```

Le script [tests/selection.spec.cjs](tests/selection.spec.cjs) ouvre le fichier HTML réel. Résultat observé : **4 passed**. Dans l’environnement de développement, les dépendances ont été installées depuis le cache npm (`npm install --offline`) et le navigateur Chromium déjà téléchargé a été utilisé. `npm ci` est fourni pour la réinstallation à partir du fichier de versions `package-lock.json` ; il n’a pas été exécuté dans ce projet lors de cette étape. La configuration est dans [playwright.config.cjs](playwright.config.cjs). Les diagnostics d’échec restent dans `test-results/`, hors Git.

## API commune de test 0.2

Le contrat a été fourni : « API commune de test — Code secret en couleurs », édition Google 1.5, mise à jour du 28 octobre 2026. Ses exigences utiles au développement sont résumées dans [docs/api-0.2.md](docs/api-0.2.md).

À réaliser : avec `?test=1`, exposer `window.codeSecretTest` de version `0.2`, initialement dans l’état `not-started`. Sans ce paramètre, cet objet ne doit pas être exposé. `getConfig()` et `getState()` sont synchrones ; `startGame(options?)` et `submitGuess(guess)` renvoient des promesses. L’API et l’interface doivent utiliser la même partie, sans révéler le secret.

Les futurs tests couvriront les neuf exemples T01–T09, la priorité des erreurs, les démarrages invalides sans mutation, les copies indépendantes, le cycle de vie et la concordance avec l’écran, puis le fonctionnement sur l’URL publiée. Tous restent non exécutés à ce stade.

## Questions ouvertes et limites

- Le contrat de l’API est disponible ; son implémentation et la vérification de conformité restent à réaliser.
- Réaliser ensuite le moteur commun : secret, comptage des indices, fin de partie, puis API et tests de conformité.
- Organisation actuelle : `index.html` pour la page, `style.css` pour la présentation, `app.js` pour la sélection/validation et `tests/` pour les contrôles navigateur. Les chemins sont relatifs pour préparer GitHub Pages.
- Pour une correction réelle, conserver le défaut observé avant modification puis le résultat du même essai après correction. Ne pas inventer de défaut pour le rendu.

## Versions et reprise

Développement sur `dev` ou `feat/...`. Le propriétaire crée la pull request et décide de la fusion dans `main`. Les consignes de travail sont dans [AGENTS.md](AGENTS.md).

- **J1 : 20 novembre 2026 au soir**, heure exacte sur Cyberlearn : première version vérifiée, éventuellement incomplète ; liens dépôt/application, tag `jalon-1`, README avec choix expliqué, premiers tests, correction documentée et limites. Pas de vidéo à ce jalon.
- **J2 : 18 décembre 2026 au soir**, heure exacte sur Cyberlearn : version `final`, API 0.2 fonctionnelle avec accès et vérifications de conformité sur l’application publiée, tests, correction expliquée, essai sur smartphone avec appareil et résultat, bref retour sur le jeu d’un camarade, README actualisé et vidéo individuelle de 4 à 5 minutes avec écran et voix.

Les tags seront créés lorsque les versions correspondantes seront prêtes. La vidéo et les conversations privées ne sont jamais publiées sur GitHub. Les remises Cyberlearn sont effectuées par l’étudiante.
