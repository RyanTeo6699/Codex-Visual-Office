"use client";

import { useState, useTransition } from "react";
import { Clipboard, FileText, SendHorizontal, ShieldCheck } from "lucide-react";
import type { CodexPromptHandoffMode, CodexPromptHandoffResult } from "@/lib/codex-cli/prompt-types";

type RecordHandoffAction = (taskId: string, mode: CodexPromptHandoffMode) => Promise<CodexPromptHandoffResult>;

export function CodexPromptHandoff({
  taskId,
  prompt,
  recordHandoffAction,
}: {
  taskId: string;
  prompt: string;
  recordHandoffAction: RecordHandoffAction;
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "fallback">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function copyPrompt() {
    setError(null);
    if (!navigator.clipboard?.writeText) {
      setCopyStatus("fallback");
      return;
    }

    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("fallback");
    }
  }

  function recordHandoff(mode: CodexPromptHandoffMode) {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await recordHandoffAction(taskId, mode);
      if (!result.ok) {
        setError(result.error ?? "Prompt handoff could not be recorded.");
        return;
      }

      setMessage(`${result.message ?? "Prompt handoff recorded"} · No CLI execution`);
    });
  }

  return (
    <section className="rounded-[18px] border border-sky-200/12 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-200/80" />
            <h2 className="text-sm font-bold tracking-tight text-slate-100">Codex Prompt Handoff</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">Prompt handoff only. No CLI execution in this step.</p>
        </div>
        <span className="rounded-md border border-amber-200/20 bg-amber-200/10 px-2 py-1 text-[10px] font-semibold text-amber-100">
          Dry-run only
        </span>
      </div>

      <textarea
        readOnly
        value={prompt}
        className="mt-4 h-52 w-full resize-y rounded-[14px] border border-white/8 bg-black/20 p-3 font-mono text-xs leading-relaxed text-slate-200 outline-none"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={copyPrompt} className="inline-flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.1]">
          <Clipboard className="h-4 w-4" />
          Copy Prompt
        </button>
        <button disabled={isPending} onClick={() => recordHandoff("mark_ready")} className="inline-flex items-center gap-2 rounded-[14px] border border-sky-200/18 bg-sky-200/10 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-200/14 disabled:cursor-not-allowed disabled:opacity-50">
          <ShieldCheck className="h-4 w-4" />
          Mark Ready for Codex
        </button>
        <button disabled={isPending} onClick={() => recordHandoff("dry_run_dispatch")} className="inline-flex items-center gap-2 rounded-[14px] border border-emerald-200/20 bg-emerald-200/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-200/14 disabled:cursor-not-allowed disabled:opacity-50">
          <SendHorizontal className="h-4 w-4" />
          Dry-run Dispatch
        </button>
      </div>

      {copyStatus === "copied" ? <p className="mt-3 text-xs font-semibold text-emerald-100">Prompt copied.</p> : null}
      {copyStatus === "fallback" ? <p className="mt-3 text-xs font-semibold text-amber-100">Clipboard unavailable. Use the visible prompt text area.</p> : null}
      {message ? <p className="mt-3 text-xs font-semibold text-emerald-100">{message}</p> : null}
      {error ? <p className="mt-3 text-xs font-semibold text-rose-100">{error}</p> : null}
    </section>
  );
}
