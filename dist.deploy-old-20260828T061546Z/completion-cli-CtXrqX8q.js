import { n as formatConsoleDiagnosticLine } from "./json-console-line-C-rJUoue.js";
import { a as routeLogsToStderr } from "./console-SZn871dT.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as quoteCliArg } from "./quote-cli-arg-BriMa9wW.js";
import { t as publishOutputFileAtomically } from "./output-file.runtime.js";
import { c as isCompletionShell, f as resolveShellFromEnv, l as resolveCompletionCachePath, o as installCompletion, t as COMPLETION_SHELLS } from "./completion-runtime-BSaYDhze.js";
import { n as registerSubCliByNameCore, t as getSubCliEntries } from "./register.subclis-core-DoernLZY.js";
import { n as registerCoreCliByName, t as getCoreCliCommandNames } from "./command-registry-core-DYzO3MAc.js";
import { t as getProgramContext } from "./program-context-VEhF8JxS.js";
import fs from "node:fs/promises";
import { Option } from "commander";
//#region src/cli/completion-command-tree.ts
function completionFlags$1(option) {
	return [option.short, option.long].filter((flag) => Boolean(flag));
}
function commandNameVariants$1(command) {
	return [command.name(), ...command.aliases()];
}
function collectShellCompletionCommandTree(program) {
	const descendants = [];
	const visit = (command, pathVariants, inheritedValueOptions, inheritedValueChoices) => {
		const ownOptionFlags = new Set(command.options.flatMap(completionFlags$1));
		const context = {
			command,
			pathVariants,
			completions: [...command.commands.flatMap(commandNameVariants$1), ...command.options.flatMap(completionFlags$1)],
			valueOptions: [.../* @__PURE__ */ new Set([...inheritedValueOptions, ...command.options.flatMap((option) => option.required || option.optional ? completionFlags$1(option) : [])])],
			valueChoices: [...inheritedValueChoices.flatMap(({ flags, ...choice }) => {
				const inheritedFlags = flags.filter((flag) => !ownOptionFlags.has(flag));
				return inheritedFlags.length > 0 ? [{
					flags: inheritedFlags,
					...choice
				}] : [];
			}), ...command.options.flatMap((option) => option.argChoices?.length ? [{
				flags: completionFlags$1(option),
				choices: [...option.argChoices],
				requiresValue: option.required
			}] : [])]
		};
		if (pathVariants[0]?.length) descendants.push(context);
		for (const child of command.commands) visit(child, pathVariants.flatMap((parents) => commandNameVariants$1(child).map((name) => parents.concat(name))), context.valueOptions, context.valueChoices);
		return context;
	};
	return {
		root: visit(program, [[]], [], []),
		descendants
	};
}
//#endregion
//#region src/cli/completion-fish.ts
function escapeFishDescription(value) {
	return value.replace(/'/g, "'\\''");
}
function quoteFishCompletionChoice(value) {
	return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}
function escapeFishDoubleQuotedArgument(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\$/g, "\\$");
}
function buildFishSubcommandCompletionLine(params) {
	const desc = escapeFishDescription(params.description);
	return `complete -c ${params.rootCmd} -n "${params.condition}" -a "${params.name}" -d '${desc}'\n`;
}
function buildFishOptionCompletionLine(params) {
	const desc = escapeFishDescription(params.description);
	const choices = params.choices?.length ? escapeFishDoubleQuotedArgument(params.choices.map(quoteFishCompletionChoice).join(" ")) : void 0;
	let line = `complete -c ${params.rootCmd} -n "${params.condition}"`;
	for (const flag of params.flags) line += flag.startsWith("--") ? ` -l ${flag.slice(2)}` : ` -s ${flag.slice(1)}`;
	if (params.requiresValue) line += " -r";
	if (choices) line += ` -f -a "${choices}"`;
	line += ` -d '${desc}'\n`;
	if (choices && !params.requiresValue) {
		const pendingOption = `contains -- (commandline -opc)[-1] ${params.flags.join(" ")}`;
		line += `complete -c ${params.rootCmd} -n "${params.condition}; and ${pendingOption}" -f -a "${choices}" -d '${desc}'\n`;
	}
	return line;
}
//#endregion
//#region src/cli/completion-cli.ts
function getCompletionScript(shell, program) {
	if (shell === "zsh") return generateZshCompletion(program);
	if (shell === "bash") return generateBashCompletion(program);
	if (shell === "powershell") return generatePowerShellCompletion(program);
	return generateFishCompletion(program);
}
function completionFlags(option) {
	return [option.short, option.long].filter((flag) => Boolean(flag));
}
function preferredCompletionFlag(option) {
	return option.long ?? option.short ?? option.flags;
}
function fishWords(values) {
	return values.join(" ");
}
function commandNameVariants(cmd) {
	return [cmd.name(), ...cmd.aliases()];
}
function generateFishPathHelper(rootCmd, contexts) {
	const knownCommandPaths = contexts.flatMap((context) => context.pathVariants).map((pathSegments) => `'${pathSegments.join(" ").replaceAll("'", "'\\''")}'`).join(" ");
	return `
function __${rootCmd}_command_path_matches
  set -l expected
  set -l value_options
  set -l reading_value_options 0
  for arg in $argv
    if test "$arg" = "--"
      set reading_value_options 1
      continue
    end
    if test $reading_value_options -eq 1
      set -a value_options $arg
    else
      set -a expected $arg
    end
  end
  set -l tokens (commandline -opc)
  set -e tokens[1]
  set -l command_tokens
  set -l skip_next 0
  for token in $tokens
    if test $skip_next -eq 1
      set skip_next 0
      continue
    end
    set -l flag (string split -m1 "=" -- $token)[1]
    if contains -- $flag $value_options
      if not string match -q -- "*=*" $token
        set skip_next 1
      end
      continue
    end
    if string match -q -- "-*" $token
      continue
    end
    set -a command_tokens $token
  end
  if test (count $expected) -gt 0
    for i in (seq (count $expected))
      if test "$command_tokens[$i]" != "$expected[$i]"
        return 1
      end
    end
  end
${knownCommandPaths ? `
  if test (count $command_tokens) -gt (count $expected)
    set -l next_index (math (count $expected) + 1)
    set -l candidate_path (string join " " $expected $command_tokens[$next_index])
    switch "$candidate_path"
      case ${knownCommandPaths}
        return 1
    end
  end` : ""}
  return 0
end
`;
}
function fishCommandPathCondition(rootCmd, parents, valueOptions) {
	return `__${rootCmd}_command_path_matches${parents.length > 0 ? ` ${parents.join(" ")}` : ""} -- ${fishWords(valueOptions)}`.trimEnd();
}
async function writeCompletionCache(params) {
	for (const shell of params.shells) {
		const script = getCompletionScript(shell, params.program);
		await publishOutputFileAtomically({
			filePath: resolveCompletionCachePath(shell, params.binName),
			tempPrefix: ".openclaw-completion-cache",
			writeTemp: async (tempPath) => {
				await fs.writeFile(tempPath, script, {
					encoding: "utf-8",
					flag: "wx"
				});
			}
		});
	}
}
function writeCompletionRegistrationWarning(message) {
	const diagnostic = `[completion] ${message}`;
	process.stderr.write(`${formatConsoleDiagnosticLine({
		level: "warn",
		message: diagnostic
	})}\n`);
}
async function registerSubcommandsForCompletion(program) {
	const entries = getSubCliEntries();
	for (const entry of entries) {
		if (entry.name === "completion") continue;
		try {
			await registerSubCliByNameCore(program, entry.name, process.argv, { purpose: "completion" });
		} catch (error) {
			writeCompletionRegistrationWarning(`skipping subcommand \`${entry.name}\` while building completion cache: ${error instanceof Error ? error.message : String(error)}`);
		}
	}
}
function registerCompletionCli(program) {
	program.command("completion").description("Generate shell completion script").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/completion", "docs.openclaw.ai/cli/completion")}\n`).addOption(new Option("-s, --shell <shell>", "Shell to generate completion for (default: detected)").choices(COMPLETION_SHELLS)).option("-i, --install", "Install completion script to shell profile").option("--write-state", "Write completion scripts to $OPENCLAW_STATE_DIR/completions (no stdout)").option("-y, --yes", "Skip confirmation (non-interactive)", false).action(async (options) => {
		routeLogsToStderr();
		if (options.install && !options.writeState) {
			await installCompletion(options.shell ?? resolveShellFromEnv(), false, program.name());
			return;
		}
		const shell = options.shell ?? resolveShellFromEnv();
		const ctx = getProgramContext(program);
		if (ctx) for (const name of getCoreCliCommandNames()) await registerCoreCliByName(program, ctx, name);
		await registerSubcommandsForCompletion(program);
		if (process.env["OPENCLAW_COMPLETION_SKIP_PLUGIN_COMMANDS"] !== "1") {
			const { registerPluginCliCommandsFromValidatedConfig } = await import("./cli-C4iNqe7v.js");
			await registerPluginCliCommandsFromValidatedConfig(program, void 0, void 0, { mode: "eager" });
		}
		if (options.writeState) await writeCompletionCache({
			program,
			shells: options.shell ? [shell] : [...COMPLETION_SHELLS],
			binName: program.name()
		});
		if (options.install) {
			await installCompletion(options.shell ?? resolveShellFromEnv(), false, program.name());
			return;
		}
		if (options.writeState) return;
		if (!isCompletionShell(shell)) throw new Error(`Unsupported shell: ${shell}`);
		const script = getCompletionScript(shell, program);
		process.stdout.write(script + "\n");
	});
}
function generateZshCompletion(program) {
	const rootCmd = program.name();
	return `
#compdef ${rootCmd}

_${rootCmd}_root_completion() {
  local -a commands
  local -a options
  
  _arguments -C \\
    ${generateZshArgs(program)} \\
    ${generateZshSubcmdList(program)} \\
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        ${program.commands.map((cmd) => `(${commandNameVariants(cmd).join("|")}) _${rootCmd}_${cmd.name().replace(/-/g, "_")} ;;`).join("\n        ")}
      esac
      ;;
  esac
}

${generateZshSubcommands(program, rootCmd)}

_${rootCmd}_register_completion() {
  if (( ! $+functions[compdef] )); then
    return 0
  fi

  compdef _${rootCmd}_root_completion ${rootCmd}
  precmd_functions=(\${precmd_functions:#_${rootCmd}_register_completion})
  unfunction _${rootCmd}_register_completion 2>/dev/null
}

_${rootCmd}_register_completion
if (( ! $+functions[compdef] )); then
  typeset -ga precmd_functions
  if [[ -z "\${precmd_functions[(r)_${rootCmd}_register_completion]}" ]]; then
    precmd_functions+=(_${rootCmd}_register_completion)
  fi
fi
`;
}
function generateZshArgs(cmd) {
	return (cmd.options || []).map((opt) => {
		const flags = completionFlags(opt);
		const name = preferredCompletionFlag(opt);
		const alternate = flags.find((flag) => flag !== name);
		const desc = escapeZshDoubleQuotedDescription(opt.description);
		const choices = opt.argChoices?.map(escapeZshCompletionChoice).join(" ");
		const argument = opt.required || opt.optional ? `${opt.optional ? "::" : ":"}${opt.attributeName()}:${choices ? `(${choices})` : ""}` : "";
		if (alternate) return `"(${name} ${alternate})"{${name},${alternate}}"[${desc}]${argument}"`;
		return `"${name}[${desc}]${argument}"`;
	}).join(" \\\n    ");
}
function escapeZshCompletionChoice(choice) {
	return escapeZshDoubleQuotedDescription(choice.replace(/([\\\s:()[\]{}*?!|&;<>"'$`])/g, "\\$1"));
}
function generateZshSubcmdList(cmd) {
	return `"1: :_values 'command' ${cmd.commands.flatMap((c) => {
		const desc = c.description().replace(/\\/g, "\\\\").replace(/'/g, "'\\''").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
		return commandNameVariants(c).map((name) => `'${name}[${desc}]'`);
	}).join(" ")}"`;
}
function escapeZshDoubleQuotedDescription(description) {
	return description.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\$/g, "\\$").replaceAll("`", "\\`").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}
function generateZshSubcommands(program, prefix) {
	const segments = [];
	const visit = (current, currentPrefix) => {
		for (const cmd of current.commands) {
			const nextPrefix = `${currentPrefix}_${cmd.name().replace(/-/g, "_")}`;
			const funcName = `_${nextPrefix}`;
			visit(cmd, nextPrefix);
			const subCommands = cmd.commands;
			if (subCommands.length > 0) {
				segments.push(`
${funcName}() {
  local -a commands
  local -a options
  
  _arguments -C \\
    ${generateZshArgs(cmd)} \\
    ${generateZshSubcmdList(cmd)} \\
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        ${subCommands.map((sub) => `(${commandNameVariants(sub).join("|")}) ${funcName}_${sub.name().replace(/-/g, "_")} ;;`).join("\n        ")}
      esac
      ;;
  esac
}
`);
				continue;
			}
			segments.push(`
${funcName}() {
  _arguments -C \\
    ${generateZshArgs(cmd)}
}
`);
		}
	};
	visit(program, prefix);
	return segments.join("");
}
function generateBashCompletion(program) {
	const rootCmd = program.name();
	const { root, descendants: contexts } = collectShellCompletionCommandTree(program);
	const rootCompletions = root.completions;
	const rootValueOptions = root.valueOptions;
	const commandPathUpdate = generateBashCommandPathUpdate(contexts);
	const choiceCompletion = generateBashOptionChoiceCompletion([root, ...contexts]);
	return `
_${rootCmd}_completion() {
    local cur opts command_path candidate_path value_options word flag i
    local choice_flag choice_prefix choice_completion_prefix short_group short_flag short_index
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    opts="${rootCompletions.join(" ")}"
    value_options="${rootValueOptions.join(" ")}"
    command_path=""

    for ((i = 1; i < COMP_CWORD; i++)); do
        word="\${COMP_WORDS[i]}"
        if [[ \${word} == -* ]]; then
            flag="\${word%%=*}"
            if [[ \${word} != *=* && " \${value_options} " == *" \${flag} "* ]]; then
                i=$((i + 1))
            fi
            continue
        fi

        if [[ -n "\${command_path}" ]]; then
            candidate_path="\${command_path} \${word}"
        else
            candidate_path="\${word}"
        fi

${commandPathUpdate}
    done

    choice_flag="\${COMP_WORDS[COMP_CWORD-1]}"
    choice_prefix="\${cur}"
    choice_completion_prefix=""
    if [[ "\${cur}" == -*=* ]]; then
        choice_flag="\${cur%%=*}"
        choice_prefix="\${cur#*=}"
        choice_completion_prefix="\${choice_flag}="
    elif [[ "\${choice_flag}" == "=" ]]; then
        choice_flag="\${COMP_WORDS[COMP_CWORD-2]}"
    fi
    if [[ "\${choice_flag}" == -??* && "\${choice_flag}" != --* ]]; then
        short_group="\${choice_flag#-}"
        for ((short_index = 0; short_index < \${#short_group}; short_index++)); do
            short_flag="-\${short_group:short_index:1}"
            if [[ " \${value_options} " == *" \${short_flag} "* ]]; then
                if ((short_index == \${#short_group} - 1)); then
                    choice_flag="\${short_flag}"
                fi
                break
            fi
        done
    fi
    if [[ "\${cur}" == -??* && "\${cur}" != --* && "\${cur}" != *=* ]]; then
        short_group="\${cur#-}"
        for ((short_index = 0; short_index < \${#short_group}; short_index++)); do
            short_flag="-\${short_group:short_index:1}"
            if [[ " \${value_options} " == *" \${short_flag} "* ]]; then
                choice_flag="\${short_flag}"
                choice_prefix="\${short_group:short_index+1}"
                choice_completion_prefix="-\${short_group:0:short_index+1}"
                break
            fi
        done
    fi

${choiceCompletion}
    COMPREPLY=( $(compgen -W "\${opts}" -- "\${cur}") )
}

complete -F _${rootCmd}_completion ${rootCmd}
`;
}
function generateBashOptionChoiceCompletion(contexts) {
	const cases = contexts.filter(({ valueChoices }) => valueChoices.length > 0).map(({ pathVariants, valueChoices }) => {
		return `        ${pathVariants.map((segments) => `"${segments.join(" ")}"`).join("|")})
            case "\${choice_flag}" in
${valueChoices.map(({ flags, choices, requiresValue }) => {
			return `            ${flags.map((flag) => `"${flag}"`).join("|")})
                local -a choice_values=(${choices.map(quoteCliArg).join(" ")})
                local choice
                for choice in "\${choice_values[@]}"; do
                    if [[ "\${choice}" == "\${choice_prefix}"* ]]; then
                        COMPREPLY+=("\${choice_completion_prefix}\${choice}")
                    fi
                done
                if ${requiresValue ? "true" : `[[ \${#COMPREPLY[@]} -gt 0 || -n "\${choice_completion_prefix}" || "\${choice_prefix}" != -* ]]`}; then
                    return
                fi
                ;;`;
		}).join("\n")}
            esac
            ;;`;
	}).join("\n");
	return cases ? `    case "\${command_path}" in\n${cases}\n    esac\n` : "";
}
function generateBashCompletionContextCases(contexts) {
	return contexts.map((context) => {
		return `              ${context.pathVariants.map((commandPath) => `"${commandPath.join(" ")}"`).join("|")})
                opts="${context.completions.join(" ")}"
                value_options="${context.valueOptions.join(" ")}"
                ;;`;
	}).join("\n");
}
function generateBashCommandPathUpdate(contexts) {
	if (contexts.length === 0) return "";
	return `        case "\${candidate_path}" in
          ${contexts.flatMap((context) => context.pathVariants).map((commandPath) => `"${commandPath.join(" ")}"`).join("|")})
            command_path="\${candidate_path}"
            case "\${command_path}" in
${generateBashCompletionContextCases(contexts)}
            esac
            ;;
        esac`;
}
function generatePowerShellCompletion(program) {
	const rootCmd = program.name();
	const completionBodies = [];
	const formatPowerShellArray = (entries) => entries.length > 0 ? `@(${entries.map((entry) => `'${entry.replaceAll("'", "''")}'`).join(",")})` : "@()";
	const { root, descendants: contexts } = collectShellCompletionCommandTree(program);
	const rootValueOptions = root.valueOptions;
	const commandPathCases = contexts.flatMap((context) => context.pathVariants.map((pathSegments) => `            '${pathSegments.join(" ")}' {
                $commandPath = $candidatePath
                $valueOptions = ${formatPowerShellArray(context.valueOptions)}
            }`)).join("\n");
	const commandPathUpdate = commandPathCases ? `        $candidatePath = if ($commandPath -eq '') { $element } else { "$commandPath $element" }
        switch ($candidatePath) {
${commandPathCases}
        }` : "";
	for (const context of contexts) if (context.completions.length > 0) {
		const allCompletions = formatPowerShellArray(context.completions);
		for (const pathSegments of context.pathVariants) {
			const fullPath = pathSegments.join(" ");
			if (fullPath.length === 0) continue;
			completionBodies.push(`
            if ($commandPath -eq '${fullPath}') {
                $completions = ${allCompletions}
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }
`);
		}
	}
	const rootBody = completionBodies.join("");
	const choiceCompletion = [root, ...contexts].filter(({ valueChoices }) => valueChoices.length > 0).flatMap(({ pathVariants, valueChoices }) => pathVariants.map((pathSegments) => {
		const optionChoiceCases = valueChoices.map(({ flags, choices, requiresValue }) => `        if ($choiceFlag -in ${formatPowerShellArray(flags)}) {
            $matchingChoices = @(${formatPowerShellArray(choices)} | Where-Object {
                $_.StartsWith($choicePrefix, [StringComparison]::OrdinalIgnoreCase)
            })
            $matchingChoices | ForEach-Object {
                $choiceValue = if ($_ -match '^[A-Za-z0-9_./:+-]+$') {
                    $_
                } else {
                    "'" + $_.Replace("'", "''") + "'"
                }
                $completionText = "$choiceCompletionPrefix$choiceValue"
                [System.Management.Automation.CompletionResult]::new($completionText, $_, 'ParameterValue', $_)
            }
            if (${requiresValue ? "$true" : "$matchingChoices.Count -gt 0 -or $choiceCompletionPrefix -ne '' -or $choicePrefix -notlike '-*'"}) {
                return
            }
        }`).join("\n");
		return `    if ($commandPath -eq '${pathSegments.join(" ").replaceAll("'", "''")}') {
${optionChoiceCases}
    }`;
	})).join("\n");
	return `
Register-ArgumentCompleter -Native -CommandName ${rootCmd} -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)
    
    $commandElements = $commandAst.CommandElements
    $commandPath = ""
    $valueOptions = ${formatPowerShellArray(rootValueOptions)}
    $previousElementIndex = if ($wordToComplete -eq '') { $commandElements.Count - 1 } else { $commandElements.Count - 2 }
    $previousElement = if ($previousElementIndex -ge 1) { $commandElements[$previousElementIndex].Extent.Text } else { '' }
    $choiceFlag = $previousElement
    $choicePrefix = $wordToComplete
    $choiceCompletionPrefix = ''
    if ($wordToComplete -match '^(--[^=]+)=(.*)$') {
        $choiceFlag = $Matches[1]
        $choicePrefix = $Matches[2]
        $choiceCompletionPrefix = "$choiceFlag="
    }

    # Skip option values so global and nested flags cannot hide the command path.
    for ($i = 1; $i -lt $commandElements.Count; $i++) {
        $element = $commandElements[$i].Extent.Text
        if ($i -eq $commandElements.Count - 1 -and $wordToComplete -ne "") { break }
        if ($element -like "-*") {
            $flag = ($element -split '=', 2)[0]
            if ($element -notlike '*=*' -and $valueOptions -contains $flag) {
                $i++
            }
            continue
        }

${commandPathUpdate}
    }

    if ($previousElement -match '^-[^-].+$') {
        $shortGroup = $previousElement.Substring(1)
        for ($shortIndex = 0; $shortIndex -lt $shortGroup.Length; $shortIndex++) {
            $shortFlag = "-$($shortGroup[$shortIndex])"
            if ($valueOptions -contains $shortFlag) {
                if ($shortIndex -eq $shortGroup.Length - 1) {
                    $choiceFlag = $shortFlag
                }
                break
            }
        }
    }

    if ($wordToComplete -match '^-[^-].+$') {
        $shortGroup = $wordToComplete.Substring(1)
        for ($shortIndex = 0; $shortIndex -lt $shortGroup.Length; $shortIndex++) {
            $shortFlag = "-$($shortGroup[$shortIndex])"
            if ($valueOptions -contains $shortFlag) {
                $choiceFlag = $shortFlag
                $choicePrefix = $shortGroup.Substring($shortIndex + 1)
                $choiceCompletionPrefix = "-$($shortGroup.Substring(0, $shortIndex + 1))"
                break
            }
        }
    }

${choiceCompletion}
    
    # Root command
    if ($commandPath -eq "") {
         $completions = ${formatPowerShellArray(root.completions)}
         $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
            [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
         }
    }
    
    ${rootBody}
}
`;
}
function generateFishCompletion(program) {
	const rootCmd = program.name();
	const { root, descendants } = collectShellCompletionCommandTree(program);
	const segments = [generateFishPathHelper(rootCmd, descendants)];
	for (const context of [root, ...descendants]) {
		const cmd = context.command;
		const conditions = context.pathVariants.map((parents) => fishCommandPathCondition(rootCmd, parents, context.valueOptions));
		for (const condition of conditions) {
			for (const sub of cmd.commands) for (const name of commandNameVariants(sub)) segments.push(buildFishSubcommandCompletionLine({
				rootCmd,
				condition,
				name,
				description: sub.description()
			}));
			for (const opt of cmd.options) segments.push(buildFishOptionCompletionLine({
				rootCmd,
				condition,
				flags: completionFlags(opt),
				description: opt.description,
				requiresValue: opt.required,
				choices: opt.argChoices
			}));
		}
	}
	return segments.join("");
}
//#endregion
export { getCompletionScript, registerCompletionCli };
