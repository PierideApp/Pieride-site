# Piéride — site web

Site Next.js Piéride : accueil, équipe, téléchargements, contribution et blog. La documentation est un site séparé, accessible depuis le lien « Documentation » du menu.

## Lancer le site

Prérequis : Node.js 22 ou plus récent, et pnpm.

```powershell
pnpm install
pnpm dev
```

Puis ouvrir http://localhost:3000. Pour actualiser pnpm sur Windows : `pnpm self-update` (ou `npm install -g pnpm@latest`).

## Pages

- / : présentation du projet, fonctionnalités et maquettes.
- /fr/equipe : projet et contributeurs publics chargés depuis GitHub.
- /fr/telecharger : détection du système et téléchargement direct des fichiers de la dernière release.
- /fr/contribuer : étapes pour proposer une idée et contribuer.
- /fr/blog : articles Markdown stockés dans `docs/<rubrique>/`, avec recherche et filtres enregistrés.
- /fr/blog/updates : dossier consacré aux mises à jour Piéride, dans `docs/updates/`.
- Documentation : site distinct, ouvert depuis le menu vers https://pierideapp.github.io/Docs-Pieride/.

Dans ce site, `docs/` sert uniquement de dossier source du blog : chaque rubrique contient un `category.json` et ses articles Markdown. Il ne contient pas les pages du site Docs-Piéride.

Les visuels d’interface sont identifiés comme des maquettes.

## Production

`pnpm build` génère le site statique dans `out/`. Le workflow GitHub Actions vérifie la build sur les pull requests vers `main` et déploie GitHub Pages après un push sur `main`. Le chemin de base est configuré automatiquement par le workflow.
