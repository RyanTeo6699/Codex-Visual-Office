import type {
  SensitivePathCategory,
  SensitivePathClassification,
  SensitivePathValidationResult,
} from "./safety-types";

type SensitivePathRule = {
  category: Exclude<SensitivePathCategory, "allowed">;
  pattern: RegExp;
  reason: string;
};

const sensitivePathRules: SensitivePathRule[] = [
  {
    category: "auth_file",
    pattern: /(?:^|[/\\])(?:~[/\\])?\.codex[/\\]auth\.json(?:$|[?#])/i,
    reason: "Codex auth files are never valid local office inputs.",
  },
  {
    category: "auth_file",
    pattern: /^[/\\]Users[/\\][^/\\]+[/\\]\.codex[/\\]auth\.json(?:$|[?#])/i,
    reason: "User Codex auth files are never valid local office inputs.",
  },
  {
    category: "env_file",
    pattern: /(?:^|[/\\])\.env(?:$|[./\\_-][^/\\]*)/i,
    reason: "Environment files can contain local secrets.",
  },
  {
    category: "env_file",
    pattern: /(?:^|[/\\])\.envrc(?:$|[?#])/i,
    reason: "Environment loader files can contain local secrets.",
  },
  {
    category: "private_key",
    pattern: /(?:^|[/\\])id_(?:rsa|ed25519|ecdsa|dsa)(?!\.pub)(?:$|[._-])/i,
    reason: "Private SSH keys are blocked.",
  },
  {
    category: "private_key",
    pattern: /(?:^|[/\\])(?:[^/\\]*[._-])?private[._-]?key(?!\.pub)(?:[._-][^/\\]*)?(?:$|[?#])/i,
    reason: "Private key paths are blocked.",
  },
  {
    category: "token_or_secret",
    pattern: /(?:^|[/\\])(?:[^/\\]*[._-])?(?:token|secret|api[._-]?key|apikey|access[._-]?token|refresh[._-]?token|oauth)(?:[._-][^/\\]*)?(?:$|[?#])/i,
    reason: "Token and secret paths are blocked.",
  },
  {
    category: "credential_file",
    pattern: /(?:^|[/\\])(?:\.npmrc|\.netrc|\.pypirc)(?:$|[?#])/i,
    reason: "Package manager and network credential files are blocked.",
  },
  {
    category: "credential_file",
    pattern: /(?:^|[/\\])\.git(?:[/\\]|$)/i,
    reason: "Git internals are not valid approved project paths.",
  },
  {
    category: "credential_file",
    pattern: /(?:^|[/\\])\.aws[/\\]credentials(?:$|[?#])/i,
    reason: "AWS credential files are blocked.",
  },
  {
    category: "credential_file",
    pattern: /(?:^|[/\\])\.config[/\\]gcloud[/\\]application_default_credentials\.json(?:$|[?#])/i,
    reason: "Cloud provider credential files are blocked.",
  },
  {
    category: "credential_file",
    pattern: /(?:^|[/\\])[^/\\]*(?:credential|credentials|aws[._-]?credentials|google[._-]?credentials|service[._-]?account)(?:[._-]|$)[^/\\]*(?:$|[?#])/i,
    reason: "Credential file paths are blocked.",
  },
];

export function classifySensitivePathString(input: string): SensitivePathClassification {
  const trimmedInput = input.trim();

  if (trimmedInput.length === 0) {
    return {
      input,
      category: "unknown_sensitive",
      allowed: false,
      reason: "Empty paths cannot be approved safely.",
    };
  }

  const matchedRule = sensitivePathRules.find((rule) => rule.pattern.test(trimmedInput));

  if (matchedRule) {
    return {
      input,
      category: matchedRule.category,
      allowed: false,
      reason: matchedRule.reason,
    };
  }

  return {
    input,
    category: "allowed",
    allowed: true,
    reason: "No sensitive auth, env, key, token, secret, or credential marker matched.",
  };
}

export function validateNonSensitiveLocalPath(input: string): SensitivePathValidationResult {
  const classification = classifySensitivePathString(input);

  if (!classification.allowed) {
    return {
      ok: false,
      classification,
      error: classification.reason,
    };
  }

  return {
    ok: true,
    classification,
  };
}

export function getSensitivePathPolicySummary(): string {
  return [
    "String-level guard only: no file reads, globbing, directory scanning, existence checks, or source inspection.",
    "Blocks ~/.codex/auth.json, /Users/.../.codex/auth.json, .env variants, .envrc, private SSH keys, private_key paths, token, secret, API key, OAuth, access-token, refresh-token, .git internals, package credential files, cloud credential files, and service-account names.",
    "Sensitive categories: auth_file, env_file, private_key, token_or_secret, credential_file, unknown_sensitive, allowed.",
  ].join(" ");
}
