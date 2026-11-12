# Repères du contrat de test 0.2

Synthèse de développement du document « API commune de test — Code secret en couleurs », édition Google 1.5, mise à jour du 28 octobre 2026, fourni pour ce projet. Le contrat fourni fait foi. Ce fichier décrit les exigences ; il ne constitue ni une implémentation ni une preuve de conformité.

## Exposition et configuration

- Exposer `window.codeSecretTest` seulement avec le paramètre `test=1`, dès que le jeu accepte les appels. `version` vaut `"0.2"`.
- À chaque chargement du mode test : `not-started`, zéro essai, historique vide, `lastGuess`, `lastResult` et `lastError` à `null`. Aucun secret imposé antérieur ne persiste.
- Sans ce paramètre, ne pas exposer l’objet. Conserver les autres paramètres lors des tests de l’URL publiée.
- Une seule partie et un seul moteur pour les actions API et les actions visibles. Les mutations se résolvent lorsque l’écran et l’état renvoyé sont cohérents. Aucun appel concurrent n’est requis.

`getConfig()` est synchrone et renvoie :

```json
{
  "apiVersion": "0.2",
  "rulesVersion": "code-couleurs-1.0",
  "secretLength": 4,
  "maxAttempts": 10,
  "allowDuplicates": true,
  "colors": ["rouge", "bleu", "vert", "jaune", "orange", "violet"]
}
```

## Démarrer

`startGame(options?)` renvoie une `Promise<State>`.

- Sans argument, avec `undefined` ou `{}` : tirer quatre couleurs aléatoires avec répétitions. Un nouveau tirage peut être identique au précédent.
- Sinon, `options` doit être un objet ordinaire non nul et non tableau, sans autre clé autorisée que `secret`.
- Si `secret` est présent, il doit être un tableau dense de quatre chaînes autorisées, utilisé exactement comme code. Une valeur `undefined` ou `null` n’est pas un tirage aléatoire.
- Valider dans l’ordre : forme/options inconnues (`invalid-options`), type/densité du secret (`invalid-type`), longueur (`invalid-length`), couleurs (`invalid-color`).
- Un démarrage invalide rejette avec une `Error` ayant `code` et un `message` clair non vide ; il conserve intégralement l’état et l’écran antérieurs, y compris `lastError`.
- Un démarrage valide depuis tout état donne `playing`, zéro essai, historique vide et les trois champs `last…` à `null` ; l’écran est réinitialisé.

## Proposer et lire

`submitGuess(guess)` renvoie une `Promise<State>`. Pendant `playing`, une proposition valide est ajoutée une seule fois, consomme un essai et efface `lastError`. Compter les bien placées avant les mal placées, sans réutiliser une occurrence. Quatre bien placées donnent `won`, même au dixième essai ; sinon dix essais donnent `lost`.

Le premier refus applicable est retenu dans cet ordre :

| Code | Condition |
| --- | --- |
| `game-not-started` | Aucune partie démarrée. |
| `game-finished` | Partie déjà `won` ou `lost`. |
| `invalid-type` | Ce n’est pas un tableau dense de chaînes ; élément absent ou autre type. |
| `invalid-length` | Nombre d’éléments différent de quatre. |
| `invalid-color` | Identifiant différent des six noms exacts, minuscules sans espace. |

Un refus résout la promesse avec l’état dont seul `lastError` peut changer : `{ code, message }`, message clair et non vide. Il ne modifie ni statut, essais, historique, dernière proposition ni derniers indices. Pendant `playing`, l’interface explique le refus. Une exception inattendue reste une erreur de fonctionnement. Après `won`, même `submitGuess(null)` donne `game-finished`. Pendant `playing`, `["rouge", null]` donne `invalid-type` avant la longueur, et `["rouge"]` donne `invalid-length`. Les répétitions sont valides.

`getState()` est synchrone, sans effet sur l’écran ni `lastError`. Il renvoie les champs :

- `status` : `not-started`, `playing`, `won` ou `lost`.
- `attempts` : entier de 0 à 10 égal à `history.length`.
- `history` : entrées chronologiques `{ guess, result: { wellPlaced, misplaced } }` des seules propositions valides.
- `lastGuess` et `lastResult` : dernière entrée, ou `null` si l’historique est vide.
- `lastError` : dernier refus, ou `null`.

Les tableaux fournis en entrée et tous les objets renvoyés doivent être indépendants de l’état interne. Les résultats sont sérialisables en JSON. Les indices sont des entiers positifs ou nuls de somme au plus quatre. Aucun champ `secret` ou `solution`, ni affichage séparé de la solution ; une proposition gagnante reste normalement dans l’historique.

## Exemples à vérifier

Dans ce tableau seulement : R = rouge, B = bleu, V = vert, J = jaune, O = orange, Vi = violet. Les appels réels utilisent les noms complets. Démarrer une nouvelle partie imposée pour chaque ligne.

| Cas | Secret | Proposition | Bien | Mal | Statut |
| --- | --- | --- | --- | --- | --- |
| T01 | R B V J | R V B O | 1 | 2 | playing |
| T02 | R B V J | O Vi R B | 0 | 2 | playing |
| T03 | R B V J | B R J V | 0 | 4 | playing |
| T04 | R B V J | R B J V | 2 | 2 | playing |
| T05 | R B V J | R B V J | 4 | 0 | won |
| T06 | R R B V | R R R R | 2 | 0 | playing |
| T07 | R R B V | R B R V | 2 | 2 | playing |
| T08 | R R B V | R R B V | 4 | 0 | won |
| T09 | R R B V | R B R R | 1 | 2 | playing |

Chaque cas doit donner un essai, une entrée d’historique et `lastError: null`.

Avec le secret de quatre rouges, prévoir aussi : neuf propositions de quatre bleus puis quatre rouges donnent une victoire à dix ; un refus à neuf essais laisse la victoire à dix possible ; dix propositions de quatre bleus donnent une défaite. Vérifier ensuite le blocage, le redémarrage depuis victoire/défaite, les démarrages invalides sans mutation, la priorité des refus et les copies indépendantes.

## Intégration à vérifier

Tester sur l’URL publiée avec `test=1`, attendre l’objet, vérifier aussi son absence sans le paramètre. Comparer chaque résultat à l’écran puis saisir une action dans l’interface et relire `getState()`. Utiliser des chemins relatifs compatibles avec le sous-chemin du dépôt, un contexte de navigateur neuf et la version remise. Une extension facultative ne change pas ce contrat ; aucun serveur applicatif, service d’IA, donnée personnelle ou clé d’accès n’est intégré.

État actuel : le moteur interne est testé sur T01–T09 et plusieurs cas de cycle de vie et de refus (voir README). L’API publique n’est pas encore exposée : sa conformité et les contrôles d’intégration API restent non exécutés. L’outil de test enseignant n’est pas fourni avec le contrat ; les propres tests du projet complètent les contrôles enseignants sans en présumer les résultats.
