<<<<<<< HEAD
# eventhubfilrouge
=======
# Fil rouge

## Installation

```bash
npm install
```

## Git — Convention des commits

Le projet utilise la convention **Conventional Commits**.

La structure d'un commit est :

```text
<type>[scope optionnel]: <description>
```

Exemples :

```text
feat: add event creation
fix: correct event date validation
docs: update README
style: format project files
refactor: simplify event service
test: add event tests
chore: update dependencies
```

### Types utilisés

| Type       | Utilisation                                                            |
| ---------- | ---------------------------------------------------------------------- |
| `feat`     | Ajout d'une fonctionnalité                                             |
| `fix`      | Correction d'un bug                                                    |
| `docs`     | Modification de la documentation                                       |
| `style`    | Modification du formatage/style sans changement fonctionnel            |
| `refactor` | Modification du code sans ajout de fonctionnalité ni correction de bug |
| `test`     | Ajout ou modification de tests                                         |
| `chore`    | Tâches de maintenance                                                  |

Un scope peut être ajouté lorsque cela apporte des précisions :

```text
feat(events): add event creation
fix(auth): correct login validation
```

Les commits doivent être rédigés avec une description courte et explicite.

La spécification utilisée est **Conventional Commits 1.0.0** :
https://www.conventionalcommits.org/fr/v1.0.0/

## Git Hooks

Le projet utilise **Husky** pour gérer les Git Hooks et **lint-staged** pour exécuter automatiquement les outils de formatage/lint sur les fichiers modifiés et staged.

Les fichiers concernés sont notamment :

```text
*.ts
*.tsx
*.js
*.json
*.md
*.yml
```

Avant chaque commit, les fichiers staged sont vérifiés automatiquement.

## Scripts

```bash
npm run format
npm run lint
```

## Git

Afficher l'historique :

```bash
git log --oneline
```
>>>>>>> 92f6dda (test: configure git hooks)
