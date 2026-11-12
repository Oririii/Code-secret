# Code-secret

Jeu solo inspiré du Mastermind : retrouver un code caché de quatre couleurs en dix essais. Projet individuel réalisé avec Codex, séparé du morpion.

## État actuel

Cadrage uniquement : le jeu, les tests exécutables et l’API commune ne sont pas encore réalisés. Aucune application publiée et aucun test du jeu exécuté. Le résultat visé est une application sur GitHub Pages, utilisable sur ordinateur et smartphone, au clavier et au toucher. Le lien et le mode d’emploi seront ajoutés après réalisation.

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

## Choix proposés avec Codex

Ces propositions sont à relire avant réalisation ; ce ne sont pas des règles imposées :

- Afficher le nom de chaque couleur avec son pion pour permettre de l’identifier autrement que par sa teinte.
- Utiliser quatre sélecteurs numérotés et un bouton « Valider » pour rendre l’ordre et la modification des choix compréhensibles au clavier et au toucher.
- Commencer par la sélection et le refus de trois couleurs sans modifier le compteur ni l’historique, avant de construire le jeu complet.

## Vérifications prévues

Tous les cas ci-dessous sont **non vérifiés**. Après chaque essai, ajouter le résultat observé, la méthode manuelle ou automatisée, la version Git et les limites de l’environnement.

| Cas | Action et résultat attendu | Observé / version |
| --- | --- | --- |
| Proposition incomplète | Choisir trois couleurs et tenter de valider : refus expliqué, compteur et historique inchangés. | Non vérifié ; aucun jeu. |
| Proposition valide | Valider quatre couleurs autorisées : un essai consommé, proposition et indices ajoutés à l’historique. | Non vérifié. |
| Couleur interdite | Pendant une partie, envoyer un identifiant interdit via `submitGuess` : `invalid-color`, compteur et historique inchangés. | Non vérifié. |
| Ordre | Secret rouge–bleu–vert–jaune ; proposition rouge–vert–bleu–orange : 1 bien placée et 2 mal placées. | Non vérifié. |
| Répétitions | Secret rouge–rouge–bleu–vert ; proposition de quatre rouges : 2 bien placées et 0 mal placée. | Non vérifié. |
| Dixième essai gagnant | Après neuf propositions incorrectes, proposer le secret : victoire au dixième essai. | Non vérifié. |
| Défaite et fin | Dix propositions incorrectes : défaite. Une validation après défaite ou victoire ne change rien. | Non vérifié. |
| Redémarrage | « Nouvelle partie » efface essais, historique et indices et effectue un nouveau tirage. Un nouveau tirage peut donner le même code. | Non vérifié. |
| Accessibilité et mobile | Jouer au clavier puis sur smartphone ; commandes accessibles, couleurs nommées et affichage lisible. | Non vérifié ; noter appareil et navigateur. |
| API commune 0.2 | Vérifier le contrat et le partage du même jeu et du même état avec l’interface. | Contrat reçu ; implémentation et tests non réalisés. |

Les exemples avec secret fixe utiliseront `startGame({ secret: [...] })` en mode test. La conformité de l’API n’a pas encore été vérifiée.

## API commune de test 0.2

Le contrat a été fourni : « API commune de test — Code secret en couleurs », édition Google 1.5, mise à jour du 28 octobre 2026. Ses exigences utiles au développement sont résumées dans [docs/api-0.2.md](docs/api-0.2.md).

À réaliser : avec `?test=1`, exposer `window.codeSecretTest` de version `0.2`, initialement dans l’état `not-started`. Sans ce paramètre, cet objet ne doit pas être exposé. `getConfig()` et `getState()` sont synchrones ; `startGame(options?)` et `submitGuess(guess)` renvoient des promesses. L’API et l’interface doivent utiliser la même partie, sans révéler le secret.

Les futurs tests couvriront les neuf exemples T01–T09, la priorité des erreurs, les démarrages invalides sans mutation, les copies indépendantes, le cycle de vie et la concordance avec l’écran, puis le fonctionnement sur l’URL publiée. Tous restent non exécutés à ce stade.

## Questions ouvertes et limites

- Le contrat de l’API est disponible ; son implémentation et la vérification de conformité restent à réaliser.
- Relire les choix d’interface avant réalisation.
- Choisir l’organisation des fichiers et les outils de test à la première réalisation ; aucune commande de test ou d’installation n’existe encore.
- Pour une correction réelle, conserver le défaut observé avant modification puis le résultat du même essai après correction. Ne pas inventer de défaut pour le rendu.

## Versions et reprise

Développement sur `dev` ou `feat/...`. Le propriétaire crée la pull request et décide de la fusion dans `main`. Les consignes de travail sont dans [AGENTS.md](AGENTS.md).

- **J1 : 20 novembre 2026 au soir**, heure exacte sur Cyberlearn : première version vérifiée, éventuellement incomplète ; liens dépôt/application, tag `jalon-1`, README avec choix expliqué, premiers tests, correction documentée et limites. Pas de vidéo à ce jalon.
- **J2 : 18 décembre 2026 au soir**, heure exacte sur Cyberlearn : version `final`, API 0.2 fonctionnelle avec accès et vérifications de conformité sur l’application publiée, tests, correction expliquée, essai sur smartphone avec appareil et résultat, bref retour sur le jeu d’un camarade, README actualisé et vidéo individuelle de 4 à 5 minutes avec écran et voix.

Les tags seront créés lorsque les versions correspondantes seront prêtes. La vidéo et les conversations privées ne sont jamais publiées sur GitHub. Les remises Cyberlearn sont effectuées par l’étudiante.
