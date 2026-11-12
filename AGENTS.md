# Consignes de travail — Code-secret

## Références et méthode

- Lire `README.md` puis les fichiers concernés avant toute modification. L’énoncé édition 2.2 et son annexe `code-couleurs-1.0`, référencés dans le README, font foi.
- Distinguer règles imposées, choix proposés, résultats attendus et résultats observés. Signaler une ambiguïté au lieu d’inventer une règle.
- Lire `docs/api-0.2.md` avant de réaliser ou modifier l’API commune 0.2. Ce document résume le contrat fourni (édition Google 1.5 du 28 octobre 2026). L’API doit utiliser le même jeu et le même état que l’interface ; ne pas annoncer une conformité non vérifiée.
- Avancer par petites étapes faciles à relire, préserver les modifications de l’utilisateur et limiter les changements à la demande.
- Si le message utilisateur se termine par `??`, reformuler brièvement et attendre son GO avant exécution. Une demande de plan sans modification ne permet pas de modifier les fichiers.
- Les choix proposés dans le README restent à relire avant réalisation. Mettre le README à jour si l’usage ou les limites changent.
- Garder une interface en français, utilisable au clavier et au toucher, avec noms ou symboles accompagnant les couleurs.
- Respecter les exclusions du README : notamment aucun serveur applicatif, donnée personnelle, service d’IA ou clé API dans le jeu. Les extensions facultatives préservent le mode commun.

## Git et confidentialité

- Travailler sur `dev` ou `feat/...` ; ne jamais créer de commit, pousser, fusionner ni forcer une mise à jour sur `main`.
- Les commits et push sur les branches de travail sont autorisés. Faire un commit à chaque changement important après les vérifications adaptées.
- L’utilisateur crée les pull requests et effectue les fusions. Ne pas créer les tags de rendu avant que les versions soient prêtes.
- Ne publier aucune conversation, pièce jointe privée, vidéo de remise, donnée personnelle ou secret d’accès. Les rendus Cyberlearn restent à la charge de l’étudiante.

## Vérification et restitution

- Avant de coder une étape, préciser les actions d’essai et le résultat attendu. Après modification, vérifier le comportement concerné et un cas valide.
- Pour une correction, conserver un exemple réel du défaut avant modification puis le résultat du même essai après. Ne pas fabriquer de preuve.
- Aucun outil ni script de test n’est encore installé dans ce projet. Ajouter seulement des commandes qui existent et préciser celles non exécutées.
- Vérifier les répétitions, les propositions invalides, la victoire au dixième essai, la défaite, le blocage après la fin et le redémarrage. Vérifier l’interface et, lorsque disponible, la conformité à l’API 0.2.
- Pour chaque essai, noter attendu, observé, version, méthode et limites. Un test sur ordinateur ne remplace pas un essai réel sur smartphone.
- Restituer en français les changements, contrôles exécutés, branche publiée et prochaine étape. Indiquer « non vérifié » quand aucune preuve d’exécution n’est disponible.
