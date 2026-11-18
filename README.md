# Code-secret

Jeu solo inspiré du Mastermind : retrouver un code caché de quatre couleurs en dix essais. Projet individuel réalisé avec Codex, séparé du morpion.

## État actuel

Version **0.4.0 — API commune de test 0.2** : le jeu attend le clic sur « Nouvelle partie » avant de tirer les quatre couleurs et lancer le chronomètre. Le code reste caché ; chaque proposition reçoit les indices de couleurs bien placées et mal placées. Dix essais, victoire (y compris au dixième), défaite et redémarrage sont réalisés. Le mode `?test=1` expose l’API commune sur le même moteur et la même interface.

Pour jouer : ouvrir [le jeu publié](https://oririii.github.io/Code-secret/) ou récupérer la branche `main`, puis ouvrir [index.html](index.html) localement dans un navigateur. Aucun serveur ni installation n’est nécessaire. Cliquer d’abord sur « Nouvelle partie » : les sélecteurs et la validation deviennent disponibles, le code est tiré et le temps démarre. Composer quatre couleurs puis valider et utiliser les deux indices pour ajuster la proposition suivante. Les indices ne disent pas quelles positions sont concernées. Un nouveau clic sur « Nouvelle partie » tire un code et efface les essais. Le secret n’est pas révélé, même après la fin.

Le chronomètre reste à `00:00` avant le démarrage, puis affiche minutes et secondes à partir du clic sur « Nouvelle partie ». Dès que le temps dépasse cinq minutes, il devient rouge et clignote doucement ; un message accompagne ce changement. Il est seulement indicatif : le dépassement ne consomme aucun essai et ne provoque pas de défaite. Le temps et le clignotement s’arrêtent à la victoire ou à la défaite. « Nouvelle partie » remet le chronomètre à zéro. Si la réduction des animations est activée sur l’appareil, l’urgence reste rouge fixe. Une actualisation remet le jeu en attente : aucun code n’est choisi, le temps n’est pas conservé et il faut recliquer pour commencer.

L’application est publiée sur GitHub Pages. L’affichage étroit et le clavier sont contrôlés dans Chromium ; un essai sur un vrai smartphone reste à réaliser.

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

- J'ai demandé à codex de changer le thème graphique du jeu
- J'ai demandé d'ajouté un timer et de donner un sentiment d'urgence visuel au joueur s'il dépasse 4 min 59 de jeu
- J'ai demandé à codex de tester l'API et l'ai également testé à la main pour m'assurer que ça fonctionne

## Vérifications prévues

API 0.2 implémentée dans la version 0.4.0, vérifiée le 18 novembre 2026 : **14 tests du moteur et 31 tests navigateur réussis localement**, dont 17 scénarios dédiés à l’API dans [tests/api.spec.cjs](tests/api.spec.cjs). Ils vérifient la configuration, l’exposition conditionnelle, T01–T09 et leur affichage, les promesses, les refus et leur priorité, les options de démarrage, les copies indépendantes, les fins à dix essais, le redémarrage, la remise en attente au rechargement et le partage entre interface et API.

**Les mêmes 17 scénarios API ont aussi réussi sur GitHub Pages**, dans Chromium sous Windows, sur le code applicatif du commit `716a2af40e4448f90c4001cc6cec361acf2e486d`. Les fichiers publics `index.html`, `app.js`, `engine.js` et `style.css` ont été comparés à ceux testés et correspondent (fins de ligne normalisées). GitHub Pages publie désormais `main` à la racine ; il utilisait auparavant `dev`, ce qui affichait l’ancienne version sans API. Le test de démarrage invalide vérifie aussi qu’un chronomètre à 00:12 poursuit à 00:13 sans être réinitialisé. L’outil enseignant et un vrai smartphone restent non vérifiés. Les observations ci-dessous sur les versions antérieures restent historiques.

Démarrage 0.3.1 vérifié le 18 novembre 2026 : **14 tests du moteur et 14 tests navigateur réussis**, soit 28. Le test de [tests/start.spec.cjs](tests/start.spec.cjs), exécuté avant la modification sur la version 0.3.0, observait quatre appels au générateur dès le chargement au lieu des zéro attendus pour la nouvelle demande. Après modification, le même test observe zéro appel, des commandes désactivées et `00:00` même après six minutes simulées. Un clic tire exactement quatre couleurs et lance le temps ; le redémarrage effectue un autre tirage ; l’actualisation remet en attente sans tirage. La capture de l’écran en attente a été inspectée. Les tests de partie et de chronomètre cliquent désormais explicitement sur « Nouvelle partie ».

Chronomètre 0.3.0 vérifié le 18 novembre 2026 : **14 tests du moteur et 12 tests navigateur réussis**, soit 26. Les cinq nouveaux scénarios de [tests/timer.spec.cjs](tests/timer.spec.cjs) vérifient 04:59, le seuil exact de 05:00 puis le dépassement à 05:01, le rouge et l’animation, la possibilité de continuer, la remise à zéro, l’arrêt après victoire/défaite et le rouge fixe en réduction des animations. Les tests utilisent une horloge simulée figée entre les actions, puis avancée explicitement ; il ne s’agit pas d’une attente réelle de cinq minutes. Les captures large et à 390 px ont été inspectées, sans débordement horizontal à 390 px. Mise en veille réelle du système et vrai smartphone non vérifiés.

Présentation 0.2.1 vérifiée le 18 novembre 2026 : les 14 tests du moteur et les 7 tests Chromium ont de nouveau réussi, dont la sélection/validation au clavier et l’absence de débordement horizontal à 390 px. Captures sur écran large et à 390 px inspectées : titres, contrôles, noms des couleurs et indices lisibles. Le moteur et les règles ne changent pas. Aucun nouvel essai sur un vrai smartphone ; l’API commune reste à réaliser.

Contrôles de la version 0.2.0 exécutés le 12 novembre 2026 : tests du moteur avec Node.js et essais dans Chromium sous Windows avec Playwright 1.65.0. Les limites sont indiquées pour chaque cas. Aucun défaut préexistant n’a été inventé pour présenter une correction.

| Cas | Action et résultat attendu | Observé / version |
| --- | --- | --- |
| Proposition incomplète | Choisir trois couleurs et tenter de valider : refus expliqué, compteur et historique inchangés. | Réussi dans Chromium, même avec historique existant. |
| Proposition valide | Valider quatre couleurs autorisées : un essai consommé, proposition et indices ajoutés à l’historique. | Réussi dans Chromium : couleurs et indices visibles, répétitions acceptées. |
| Couleur interdite | Envoyer un identifiant interdit : `invalid-color`, compteur et historique inchangés. | Réussi sur le moteur et via l’API 0.2 en navigateur local, v0.4.0. |
| Ordre | Secret rouge–bleu–vert–jaune ; proposition rouge–vert–bleu–orange : 1 bien placée et 2 mal placées. | Réussi sur le moteur (T01) ; les neuf exemples T01–T09 passent. |
| Répétitions | Secret rouge–rouge–bleu–vert ; proposition de quatre rouges : 2 bien placées et 0 mal placée. | Réussi sur le moteur et dans Chromium : indices 2/0. Le cas rouge–bleu–rouge–rouge donne aussi 1/2. |
| Dixième essai gagnant | Après neuf propositions incorrectes, proposer le secret : victoire au dixième essai. | Réussi sur le moteur et dans Chromium ; un refus au neuvième essai ne consomme rien. |
| Défaite et fin | Dix propositions incorrectes : défaite. Une validation après défaite ou victoire ne change rien. | Réussi sur le moteur et dans Chromium : commandes bloquées, historique conservé. |
| Redémarrage | « Nouvelle partie » efface essais, historique et indices et effectue un nouveau tirage. Un nouveau tirage peut donner le même code. | Réussi sur le moteur et dans Chromium depuis victoire/défaite. Un générateur contrôlé vérifie le nouveau tirage et la stabilité du secret entre les coups. |
| Accessibilité et mobile | Jouer au clavier puis sur smartphone ; commandes accessibles, couleurs nommées et affichage lisible. | Sélection/validation au clavier réussies. Capture large et capture à 390 px inspectées, sans débordement horizontal à 390 px. Vrai smartphone et partie complète au clavier non vérifiés. |
| API commune 0.2 | Vérifier le contrat et le partage du même jeu et du même état avec l’interface. | 17 scénarios API réussis localement puis sur GitHub Pages, v0.4.0. Outil enseignant non fourni. |

Les tests unitaires imposent le secret dans le moteur interne. Les tests navigateur de l’interface contrôlent leur générateur aléatoire ; les tests API utilisent `startGame({ secret: [...] })` en mode test. Aucune commande de révélation du secret n’est ajoutée à l’interface.

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

`npm test` exécute [tests/engine.test.cjs](tests/engine.test.cjs), puis les tests navigateur dans `tests/` sur le fichier HTML réel, dont [tests/api.spec.cjs](tests/api.spec.cjs). Résultat local observé sur la version 0.4.0 : **14 tests du moteur réussis et 31 tests navigateur réussis**. `npm run test:unit`, `npm run test:browser` et `npm run test:api` lancent chaque groupe séparément.

Dans cet environnement, les dépendances proviennent du cache npm et Chromium était déjà téléchargé. `npm ci` sert à réinstaller depuis `package-lock.json` ; il n’a pas été exécuté lors de cette étape. La configuration est dans [playwright.config.cjs](playwright.config.cjs). Les diagnostics d’échec restent dans `test-results/`, hors Git. Les secrets imposés et générateurs contrôlés appartiennent aux tests ; une partie normale tire son code au hasard.

## API commune de test 0.2

Le contrat a été fourni : « API commune de test — Code secret en couleurs », édition Google 1.5, mise à jour du 28 octobre 2026. Ses exigences utiles au développement sont résumées dans [docs/api-0.2.md](docs/api-0.2.md).

Ouvrir [le jeu en mode test](https://oririii.github.io/Code-secret/?test=1) et attendre `window.codeSecretTest`. Cet objet a la version `0.2`, initialement dans l’état `not-started`. Sans `test=1`, l’objet n’est pas exposé. `getConfig()` et `getState()` sont synchrones ; `startGame(options?)` et `submitGuess(guess)` renvoient des promesses. L’API et l’interface utilisent la même instance du moteur ; un démarrage API réinitialise aussi la sélection et le chronomètre. Un démarrage invalide rejette avec `Error.code` et conserve l’état ainsi que l’écran précédents.

Exemple à exécuter dans la console du navigateur en mode test :

```js
const api = window.codeSecretTest;
api.getConfig();
await api.startGame({ secret: ["rouge", "rouge", "bleu", "vert"] });
await api.submitGuess(["rouge", "bleu", "rouge", "rouge"]);
// Attendu : attempts = 1, lastResult = { wellPlaced: 1, misplaced: 2 }.
api.getState();
```

Pour rejouer les tests API sur l’application publiée, depuis PowerShell à la racine du dépôt :

```powershell
$env:CODE_SECRET_URL = 'https://oririii.github.io/Code-secret/'
npm run test:api
Remove-Item Env:CODE_SECRET_URL
```

La suite conserve les paramètres de l’URL, ouvre un contexte navigateur neuf par scénario et compare les états à l’écran. Les tests enseignants restent indépendants de ces propres contrôles.

## Questions ouvertes et limites

- Le contrat API est implémenté et ses 17 scénarios passent localement ainsi que sur l’application publiée. Ces contrôles ne préjugent pas des résultats de l’outil enseignant, non fourni.
- Je n'ai pas testé sur tous les modèles de téléphone

## Versions et reprise

Développement habituel sur `dev` ou `feat/...`. La publication de l’API sur `main` a été explicitement demandée par l’étudiante ; les publications suivantes sur `main` demandent une autorisation explicite. Les consignes de travail sont dans [AGENTS.md](AGENTS.md).

## Validation par un camarade

Un camarade à testé mon jeu et l'API, aucun bug n'a été signalé

## Appareils testés

Testé sur Windows et Iphone

- **J1 : 20 novembre 2026 au soir**, heure exacte sur Cyberlearn : première version vérifiée, éventuellement incomplète ; liens dépôt/application, tag `jalon-1`, README avec choix expliqué, premiers tests, correction documentée et limites. Pas de vidéo à ce jalon.
- **J2 : 18 décembre 2026 au soir**, heure exacte sur Cyberlearn : version `final`, API 0.2 fonctionnelle avec accès et vérifications de conformité sur l’application publiée, tests, correction expliquée, essai sur smartphone avec appareil et résultat, bref retour sur le jeu d’un camarade, README actualisé et vidéo individuelle de 4 à 5 minutes avec écran et voix.

Les tags seront créés lorsque les versions correspondantes seront prêtes. La vidéo et les conversations privées ne sont jamais publiées sur GitHub. Les remises Cyberlearn sont effectuées par l’étudiante.
