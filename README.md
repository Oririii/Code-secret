# Code-secret

Jeu solo inspiré du Mastermind : retrouver un code caché de quatre couleurs en dix essais. Projet individuel réalisé avec Codex, séparé du morpion.

## État actuel

Version **0.3.1 — démarrage sur demande** : le jeu attend le clic sur « Nouvelle partie » avant de tirer les quatre couleurs et lancer le chronomètre. Le code reste caché ; chaque proposition reçoit les indices de couleurs bien placées et mal placées. Dix essais, victoire (y compris au dixième), défaite et redémarrage sont réalisés. L’API commune de test n’est pas encore exposée ; le numéro de version du jeu ne signifie pas que l’API 0.2 est conforme.

Pour jouer : récupérer la branche `dev`, puis ouvrir [index.html](index.html) localement dans un navigateur. Aucun serveur ni installation n’est nécessaire. Cliquer d’abord sur « Nouvelle partie » : les sélecteurs et la validation deviennent disponibles, le code est tiré et le temps démarre. Composer quatre couleurs puis valider et utiliser les deux indices pour ajuster la proposition suivante. Les indices ne disent pas quelles positions sont concernées. Un nouveau clic sur « Nouvelle partie » tire un code et efface les essais. Le secret n’est pas révélé, même après la fin.

Le chronomètre reste à `00:00` avant le démarrage, puis affiche minutes et secondes à partir du clic sur « Nouvelle partie ». Dès que le temps dépasse cinq minutes, il devient rouge et clignote doucement ; un message accompagne ce changement. Il est seulement indicatif : le dépassement ne consomme aucun essai et ne provoque pas de défaite. Le temps et le clignotement s’arrêtent à la victoire ou à la défaite. « Nouvelle partie » remet le chronomètre à zéro. Si la réduction des animations est activée sur l’appareil, l’urgence reste rouge fixe. Une actualisation remet le jeu en attente : aucun code n’est choisi, le temps n’est pas conservé et il faut recliquer pour commencer.

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
- Présentation demandée par l’étudiante : style sobre et élégant, fond beige, brun profond, noir doux et accents rose poudré. Titres à empattements et textes de jeu sans empattements, sans police téléchargée. Les six couleurs des pions restent distinctes et accompagnées de leur nom ; la palette décorative ne change pas les règles.
- Chronomètre demandé par l’étudiante pour créer un sentiment d’urgence après cinq minutes. Ce choix d’interface conserve les dix essais et toutes les règles communes ; la valeur est calculée depuis l’heure de départ, même si les mises à jour de l’écran sont retardées. Le temps écoulé n’est pas annoncé à chaque seconde aux lecteurs d’écran ; le message de dépassement est annoncé au changement de seuil.
- Démarrage explicite demandé par l’étudiante : aucun secret ni chronomètre actif au chargement. « Nouvelle partie » déclenche le tirage et place le focus sur la première position ; le clavier permet de démarrer par ce bouton.

## Vérifications prévues

Démarrage 0.3.1 vérifié le 18 novembre 2026 : **14 tests du moteur et 14 tests navigateur réussis**, soit 28. Le test de [tests/start.spec.cjs](tests/start.spec.cjs), exécuté avant la modification sur la version 0.3.0, observait quatre appels au générateur dès le chargement au lieu des zéro attendus pour la nouvelle demande. Après modification, le même test observe zéro appel, des commandes désactivées et `00:00` même après six minutes simulées. Un clic tire exactement quatre couleurs et lance le temps ; le redémarrage effectue un autre tirage ; l’actualisation remet en attente sans tirage. La capture de l’écran en attente a été inspectée. Les tests de partie et de chronomètre cliquent désormais explicitement sur « Nouvelle partie ».

Chronomètre 0.3.0 vérifié le 18 novembre 2026 : **14 tests du moteur et 12 tests navigateur réussis**, soit 26. Les cinq nouveaux scénarios de [tests/timer.spec.cjs](tests/timer.spec.cjs) vérifient 04:59, le seuil exact de 05:00 puis le dépassement à 05:01, le rouge et l’animation, la possibilité de continuer, la remise à zéro, l’arrêt après victoire/défaite et le rouge fixe en réduction des animations. Les tests utilisent une horloge simulée figée entre les actions, puis avancée explicitement ; il ne s’agit pas d’une attente réelle de cinq minutes. Les captures large et à 390 px ont été inspectées, sans débordement horizontal à 390 px. Mise en veille réelle du système et vrai smartphone non vérifiés.

Présentation 0.2.1 vérifiée le 18 novembre 2026 : les 14 tests du moteur et les 7 tests Chromium ont de nouveau réussi, dont la sélection/validation au clavier et l’absence de débordement horizontal à 390 px. Captures sur écran large et à 390 px inspectées : titres, contrôles, noms des couleurs et indices lisibles. Le moteur et les règles ne changent pas. Aucun nouvel essai sur un vrai smartphone ; l’API commune reste à réaliser.

Contrôles de la version 0.2.0 exécutés le 12 novembre 2026 : tests du moteur avec Node.js et essais dans Chromium sous Windows avec Playwright 1.65.0. Les limites sont indiquées pour chaque cas. Aucun défaut préexistant n’a été inventé pour présenter une correction.

| Cas | Action et résultat attendu | Observé / version |
| --- | --- | --- |
| Proposition incomplète | Choisir trois couleurs et tenter de valider : refus expliqué, compteur et historique inchangés. | Réussi dans Chromium, même avec historique existant. |
| Proposition valide | Valider quatre couleurs autorisées : un essai consommé, proposition et indices ajoutés à l’historique. | Réussi dans Chromium : couleurs et indices visibles, répétitions acceptées. |
| Couleur interdite | Envoyer un identifiant interdit : `invalid-color`, compteur et historique inchangés. | Réussi sur le moteur interne ; API publique encore absente. |
| Ordre | Secret rouge–bleu–vert–jaune ; proposition rouge–vert–bleu–orange : 1 bien placée et 2 mal placées. | Réussi sur le moteur (T01) ; les neuf exemples T01–T09 passent. |
| Répétitions | Secret rouge–rouge–bleu–vert ; proposition de quatre rouges : 2 bien placées et 0 mal placée. | Réussi sur le moteur et dans Chromium : indices 2/0. Le cas rouge–bleu–rouge–rouge donne aussi 1/2. |
| Dixième essai gagnant | Après neuf propositions incorrectes, proposer le secret : victoire au dixième essai. | Réussi sur le moteur et dans Chromium ; un refus au neuvième essai ne consomme rien. |
| Défaite et fin | Dix propositions incorrectes : défaite. Une validation après défaite ou victoire ne change rien. | Réussi sur le moteur et dans Chromium : commandes bloquées, historique conservé. |
| Redémarrage | « Nouvelle partie » efface essais, historique et indices et effectue un nouveau tirage. Un nouveau tirage peut donner le même code. | Réussi sur le moteur et dans Chromium depuis victoire/défaite. Un générateur contrôlé vérifie le nouveau tirage et la stabilité du secret entre les coups. |
| Accessibilité et mobile | Jouer au clavier puis sur smartphone ; commandes accessibles, couleurs nommées et affichage lisible. | Sélection/validation au clavier réussies. Capture large et capture à 390 px inspectées, sans débordement horizontal à 390 px. Vrai smartphone et partie complète au clavier non vérifiés. |
| API commune 0.2 | Vérifier le contrat et le partage du même jeu et du même état avec l’interface. | Contrat reçu ; implémentation et tests non réalisés. |

Les tests unitaires imposent le secret dans le moteur interne. Les tests navigateur contrôlent uniquement leur générateur aléatoire pour reproduire le code rouge–rouge–bleu–vert, sans ajouter de commande de triche à l’interface. La future API utilisera `startGame({ secret: [...] })` en mode test ; sa conformité n’est pas encore vérifiée.

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

`npm test` exécute [tests/engine.test.cjs](tests/engine.test.cjs), puis les tests navigateur [tests/selection.spec.cjs](tests/selection.spec.cjs), [tests/timer.spec.cjs](tests/timer.spec.cjs) et [tests/start.spec.cjs](tests/start.spec.cjs) sur le fichier HTML réel. Résultat observé sur la version 0.3.1 : **14 tests du moteur réussis et 14 tests navigateur réussis**. `npm run test:unit` et `npm run test:browser` lancent chaque groupe séparément.

Dans cet environnement, les dépendances proviennent du cache npm et Chromium était déjà téléchargé. `npm ci` sert à réinstaller depuis `package-lock.json` ; il n’a pas été exécuté lors de cette étape. La configuration est dans [playwright.config.cjs](playwright.config.cjs). Les diagnostics d’échec restent dans `test-results/`, hors Git. Les secrets imposés et générateurs contrôlés appartiennent aux tests ; une partie normale tire son code au hasard.

## API commune de test 0.2

Le contrat a été fourni : « API commune de test — Code secret en couleurs », édition Google 1.5, mise à jour du 28 octobre 2026. Ses exigences utiles au développement sont résumées dans [docs/api-0.2.md](docs/api-0.2.md).

À réaliser : avec `?test=1`, exposer `window.codeSecretTest` de version `0.2`, initialement dans l’état `not-started`. Sans ce paramètre, cet objet ne doit pas être exposé. `getConfig()` et `getState()` sont synchrones ; `startGame(options?)` et `submitGuess(guess)` renvoient des promesses. L’API et l’interface doivent utiliser la même partie, sans révéler le secret.

Le moteur a été vérifié sur T01–T09, plusieurs refus, les copies indépendantes et le cycle de vie ; cela ne remplace pas les tests de l’API. L’exposition conditionnelle, la forme des options, les promesses, la conformité complète et l’accès depuis l’URL publiée restent à réaliser et tester.

## Questions ouvertes et limites

- Le contrat de l’API est disponible ; son implémentation et la vérification de conformité restent à réaliser.
- Réaliser ensuite l’adaptateur de l’API commune, ses tests et la publication GitHub Pages.
- Organisation actuelle : `index.html` pour la page, `style.css` pour la présentation, `engine.js` pour le moteur partagé, `app.js` pour l’interface et `tests/` pour les contrôles. Les chemins sont relatifs pour préparer GitHub Pages.
- Pour une correction réelle, conserver le défaut observé avant modification puis le résultat du même essai après correction. Ne pas inventer de défaut pour le rendu.

## Versions et reprise

Développement sur `dev` ou `feat/...`. Le propriétaire crée la pull request et décide de la fusion dans `main`. Les consignes de travail sont dans [AGENTS.md](AGENTS.md).

- **J1 : 20 novembre 2026 au soir**, heure exacte sur Cyberlearn : première version vérifiée, éventuellement incomplète ; liens dépôt/application, tag `jalon-1`, README avec choix expliqué, premiers tests, correction documentée et limites. Pas de vidéo à ce jalon.
- **J2 : 18 décembre 2026 au soir**, heure exacte sur Cyberlearn : version `final`, API 0.2 fonctionnelle avec accès et vérifications de conformité sur l’application publiée, tests, correction expliquée, essai sur smartphone avec appareil et résultat, bref retour sur le jeu d’un camarade, README actualisé et vidéo individuelle de 4 à 5 minutes avec écran et voix.

Les tags seront créés lorsque les versions correspondantes seront prêtes. La vidéo et les conversations privées ne sont jamais publiées sur GitHub. Les remises Cyberlearn sont effectuées par l’étudiante.
