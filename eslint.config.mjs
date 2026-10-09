// Template ESLint de référence CodingFaber (STYLE-R12).
// Explication de chaque règle et règle de doctrine remplacée : knowledge developpement/lint-template.md.
// Dépendances : eslint, typescript, typescript-eslint, @stylistic/eslint-plugin,
// eslint-plugin-boundaries (v7), eslint-import-resolver-typescript, eslint-config-prettier, prettier.
// Les blocs propres à NestJS vivent dans eslint.nestjs.mjs, importé et étalé en fin de tableau.
// Attention : en flat config, une règle redéfinie dans un bloc par chemin écrase la précédente.
// Tout bloc qui redéfinit no-restricted-imports doit reprendre le motif des imports relatifs (STYLE-R23).

import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import boundaries from "eslint-plugin-boundaries";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
// Projet sans NestJS : retirer cette ligne et la ligne « ...nestjs » en fin de fichier.
import nestjs from "./eslint.nestjs.mjs";

const FREE_FUNCTION_MESSAGE = "OOP: fonction libre interdite";
const SAME_MODULE = { module: "{{ from.element.captured.module }}" };
const SAME_CHANNEL = { ...SAME_MODULE, channel: "{{ from.element.captured.channel }}" };
const element = (type, captured) => ({ element: captured ? { type, captured } : { type } });
const to = (type, captured) => ({ to: element(type, captured) });
const RELATIVE_IMPORT_PATTERN = { group: ["./*", "../*"], message: "Utilise un alias @<dossier>/ (STYLE-R23)." };

export default tseslint.config(
	{
		ignores: ["dist/**", "coverage/**", "node_modules/**"]
	},
	// Refuse tout commentaire eslint-disable ou de configuration en ligne (STYLE-R21).
	{
		linterOptions: { noInlineConfig: true }
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	// Placé avant les règles du projet : désactive les règles qui contredisent Prettier,
	// puis le bloc suivant réactive explicitement celles que la doctrine exige (curly, brace-style…).
	eslintConfigPrettier,
	{
		files: ["**/*.ts"],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		plugins: {
			"@stylistic": stylistic,
			boundaries
		},
		settings: {
			"import/resolver": { typescript: true, node: true },
			"boundaries/include": ["src/**/*"],
			"boundaries/elements": [
				{ type: "bootstrap", partialMatch: false, pattern: "src/bootstrap/**" },
				{ type: "shared-ports", partialMatch: false, pattern: "src/shared/ports/**" },
				{ type: "shared-adapters", partialMatch: false, pattern: "src/shared/adapters/**" },
				{ type: "domain", partialMatch: false, pattern: "src/*/domain/**", capture: ["module"] },
				{ type: "ports", partialMatch: false, pattern: "src/*/application/ports/**", capture: ["module"] },
				{ type: "application", partialMatch: false, pattern: "src/*/application/**", capture: ["module"] },
				{ type: "presentation", partialMatch: false, pattern: "src/*/presentation/*/**", capture: ["module", "channel"] },
				{ type: "infrastructure", partialMatch: false, pattern: "src/*/infrastructure/**", capture: ["module"] }
			]
		},
		rules: {
			// Mise en forme
			curly: ["error", "all"],
			"@stylistic/max-statements-per-line": ["error", { max: 1 }],
			"@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: false }],
			"@stylistic/padding-line-between-statements": [
				"error",
				{ blankLine: "always", prev: "block-like", next: "*" },
				{ blankLine: "always", prev: "*", next: "block-like" },
				{ blankLine: "always", prev: "*", next: "return" }
			],
			"arrow-body-style": ["error", "always"],
			"no-nested-ternary": "error",

			// Complexité
			"max-depth": ["error", 3],
			"max-params": ["error", 4],
			"max-lines-per-function": ["error", 50],
			"max-lines": ["error", 300],
			complexity: ["error", 10],

			// Valeurs magiques
			"no-magic-numbers": "off",
			"@typescript-eslint/no-magic-numbers": [
				"error",
				{
					ignore: [0, 1, -1],
					ignoreEnums: true,
					ignoreReadonlyClassProperties: true,
					ignoreNumericLiteralTypes: true,
					ignoreTypeIndexes: true,
					ignoreArrayIndexes: true,
					ignoreDefaultValues: true
				}
			],

			// Nommage
			"id-length": ["error", { min: 2 }],
			"@typescript-eslint/naming-convention": [
				"error",
				{ selector: "default", format: ["camelCase"] },
				{ selector: "import", format: null },
				{ selector: "variable", format: ["camelCase", "UPPER_CASE"] },
				{ selector: "parameter", format: ["camelCase"], leadingUnderscore: "allow" },
				{ selector: "classProperty", modifiers: ["static", "readonly"], format: ["UPPER_CASE", "camelCase"] },
				{ selector: "objectLiteralProperty", format: null },
				{ selector: "typeLike", format: ["PascalCase"] },
				{ selector: "enumMember", format: ["PascalCase"] },
				{
					selector: "interface",
					format: ["PascalCase"],
					suffix: ["Interface"],
					custom: { regex: "^I[A-Z]", match: false }
				}
			],

			// Orienté objet
			"no-restricted-syntax": [
				"error",
				{ selector: "Program > FunctionDeclaration", message: FREE_FUNCTION_MESSAGE },
				{ selector: "Program > ExportNamedDeclaration > FunctionDeclaration", message: FREE_FUNCTION_MESSAGE },
				{ selector: "Program > ExportDefaultDeclaration > FunctionDeclaration", message: FREE_FUNCTION_MESSAGE },
				{ selector: "Program > VariableDeclaration > VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)", message: FREE_FUNCTION_MESSAGE },
				{
					selector: "Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)",
					message: FREE_FUNCTION_MESSAGE
				},
				{ selector: "Program > ExportDefaultDeclaration > :matches(ArrowFunctionExpression, FunctionExpression)", message: FREE_FUNCTION_MESSAGE }
			],
			"@typescript-eslint/no-extraneous-class": "error",
			"max-classes-per-file": ["error", 1],
			"@typescript-eslint/explicit-member-accessibility": "error",
			"@typescript-eslint/member-ordering": "error",
			"@typescript-eslint/parameter-properties": ["error", { prefer: "parameter-property" }],
			"@typescript-eslint/prefer-readonly": "error",

			// Typage
			"@typescript-eslint/explicit-function-return-type": "error",
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
			"@typescript-eslint/no-non-null-assertion": "error",
			"@typescript-eslint/no-unsafe-assignment": "error",
			"@typescript-eslint/no-unsafe-return": "error",
			"@typescript-eslint/no-unsafe-member-access": "error",
			"@typescript-eslint/no-unsafe-call": "error",
			"@typescript-eslint/no-unsafe-argument": "error",
			"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

			// Imports : alias @<dossier>/ uniquement, aucun chemin relatif (STYLE-R23)
			"no-restricted-imports": ["error", { patterns: [RELATIVE_IMPORT_PATTERN] }],

			// Sens des dépendances (CODE-ARCHI-R03 à R10, DESIGN-R01)
			"boundaries/dependencies": [
				"error",
				{
					default: "disallow",
					policies: [
						{ from: element("domain"), allow: [to("domain", SAME_MODULE)] },
						{ from: element("ports"), allow: [to("domain", SAME_MODULE), to("ports", SAME_MODULE), to("shared-ports")] },
						{
							from: element("application"),
							allow: [to("domain", SAME_MODULE), to("ports", SAME_MODULE), to("application", SAME_MODULE), to("shared-ports")]
						},
						{
							from: element("presentation"),
							allow: [to("application", SAME_MODULE), to("domain", SAME_MODULE), to("presentation", SAME_CHANNEL), to("shared-ports")]
						},
						{
							from: element("infrastructure"),
							allow: [to("ports", SAME_MODULE), to("domain", SAME_MODULE), to("infrastructure", SAME_MODULE), to("shared-ports")]
						},
						{ from: element("shared-ports"), allow: [to("shared-ports")] },
						{ from: element("shared-adapters"), allow: [to("shared-ports"), to("shared-adapters")] },
						{ from: element("bootstrap"), allow: [to("*")] }
					]
				}
			]
		}
	},
	{
		// Une classe dans use-cases/ est un use case (UseCase), son entrée (DTO) ou sa sortie (Result).
		files: ["src/*/application/use-cases/**/*.ts"],
		rules: {
			"@typescript-eslint/naming-convention": [
				"error",
				{ selector: "class", format: ["PascalCase"], custom: { regex: "(UseCase|DTO|Result)$", match: true } },
				{
					selector: "interface",
					format: ["PascalCase"],
					suffix: ["Interface"],
					custom: { regex: "^I[A-Z]", match: false }
				}
			]
		}
	},
	{
		// Points d'entrée et fichiers de configuration : fonctions libres et nombres tolérés.
		files: ["src/bootstrap/entrypoints/**/*.ts", "*.config.{ts,mts,cts}"],
		rules: {
			"no-restricted-syntax": "off",
			"@typescript-eslint/no-magic-numbers": "off"
		}
	},
	{
		// Tests : describe/it sont des fonctions par nature ; les valeurs d'exemple ne sont pas magiques.
		files: ["tests/**/*.ts", "**/*.test.ts"],
		rules: {
			"no-restricted-syntax": "off",
			"@typescript-eslint/no-magic-numbers": "off",
			"max-lines-per-function": "off",
			"@typescript-eslint/explicit-function-return-type": "off"
		}
	},
	// Blocs NestJS (eslint.nestjs.mjs) : retirer cette ligne pour un projet sans NestJS.
	...nestjs
);
