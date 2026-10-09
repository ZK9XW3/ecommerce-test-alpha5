// Blocs ESLint propres à NestJS (rules developpement/nestjs.md).
// Importé et étalé par le modèle commun eslint.config.mjs : un projet sans Nest ne les charge pas.
// Explication : knowledge developpement/nestjs.md.

const RELATIVE_IMPORT_MESSAGE = "Utilise un alias @<dossier>/ (STYLE-R23).";
const NEST_IMPORT_MESSAGE = "NESTJS-R01 : Domain et Application n'importent pas NestJS";

export default [
	{
		// Composition NestJS : un @Module est une classe vide décorée, par nature (NESTJS-R02).
		files: ["src/bootstrap/composition/**/*.ts"],
		rules: {
			"@typescript-eslint/no-extraneous-class": ["error", { allowWithDecorator: true }]
		}
	},
	{
		// Domain et Application restent du TypeScript pur (NESTJS-R01).
		// Piège flat config : no-restricted-imports défini ici REMPLACE celui des blocs précédents
		// pour ces fichiers (pas de fusion). Ce bloc reprend donc l'interdiction des imports
		// relatifs (STYLE-R23) du modèle commun : toute interdiction ajoutée là-bas doit être recopiée ici.
		files: ["src/*/domain/**/*.ts", "src/*/application/**/*.ts"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{ group: ["@nestjs/*"], message: NEST_IMPORT_MESSAGE },
						{ group: ["./*", "../*"], message: RELATIVE_IMPORT_MESSAGE }
					]
				}
			]
		}
	}
];
