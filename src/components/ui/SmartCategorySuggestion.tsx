/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  Loader2,
  RefreshCw,
  Sparkles,
  Wand2
} from 'lucide-react';

export interface CategorySuggestionResult {
  primaryCategory: string;
  secondaryCategories: string[];
  confidenceLabel: 'Alta' | 'Média';
  reasoning: string;
  suggestedTags: string[];
}

interface SmartCategorySuggestionProps {
  businessName: string;
  description: string;
  categories: string[];
  selectedCategory: string;
  isCategoryLockedManually: boolean;
  autoTriggerSignal: number;
  onApplyCategory: (category: string, source: 'auto' | 'manual_pick') => void;
}

export const SmartCategorySuggestion: React.FC<SmartCategorySuggestionProps> = ({
  businessName,
  description,
  categories,
  selectedCategory,
  isCategoryLockedManually,
  autoTriggerSignal,
  onApplyCategory
}) => {
  const [autoSuggestEnabled, setAutoSuggestEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<CategorySuggestionResult | null>(null);
  const lastAnalyzedTextRef = useRef<string>('');

  const trimmedDescription = description.trim();
  const canAnalyze = trimmedDescription.length >= 8;

  const requestCategorySuggestion = useCallback(
    async (mode: 'manual' | 'auto') => {
      if (trimmedDescription.length < 8) {
        if (mode === 'manual') {
          setErrorMsg(
            'Escreva pelo menos 8 caracteres na descrição dos serviços para sugerir uma categoria.'
          );
        }
        return;
      }

      const normalizedInputKey = `${businessName.trim().toLowerCase()}::${trimmedDescription.toLowerCase()}`;
      if (mode === 'auto' && lastAnalyzedTextRef.current === normalizedInputKey) {
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      try {
        const response = await fetch('/api/gemini/suggest-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName: businessName.trim(),
            description: trimmedDescription,
            categories
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data?.error ||
              'Erro ao consultar a API do Gemini para sugerir categorias.'
          );
        }

        lastAnalyzedTextRef.current = normalizedInputKey;
        const suggestion: CategorySuggestionResult = {
          primaryCategory: data.primaryCategory,
          secondaryCategories: Array.isArray(data.secondaryCategories)
            ? data.secondaryCategories
            : [],
          confidenceLabel: data.confidenceLabel === 'Média' ? 'Média' : 'Alta',
          reasoning: data.reasoning || '',
          suggestedTags: Array.isArray(data.suggestedTags)
            ? data.suggestedTags
            : []
        };

        setResult(suggestion);

        if (
          suggestion.primaryCategory &&
          (mode === 'manual' || !isCategoryLockedManually)
        ) {
          onApplyCategory(suggestion.primaryCategory, 'auto');
        }
      } catch (err: any) {
        setErrorMsg(
          err?.message ||
            'Falha na conexão com a API do Gemini. Você pode selecionar a categoria manualmente.'
        );
      } finally {
        setLoading(false);
      }
    },
    [
      businessName,
      trimmedDescription,
      categories,
      isCategoryLockedManually,
      onApplyCategory
    ]
  );

  // Trigger automatically on description blur when enabled and sufficient detail is provided
  useEffect(() => {
    if (
      autoTriggerSignal > 0 &&
      autoSuggestEnabled &&
      trimmedDescription.length >= 20
    ) {
      void requestCategorySuggestion('auto');
    }
  }, [autoTriggerSignal, autoSuggestEnabled, trimmedDescription, requestCategorySuggestion]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>Sugestão Inteligente de Categorias</span>
              <span className="text-[11px] font-bold text-orange-600">
                · Gemini IA
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Categoriza automaticamente seu negócio com base na descrição dos serviços.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!canAnalyze || loading}
          onClick={() => void requestCategorySuggestion('manual')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            !canAnalyze || loading
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-[#FE3A18] text-white'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analisando...</span>
            </>
          ) : result ? (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reanalisar</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>Sugerir Categoria</span>
            </>
          )}
        </button>
      </div>

      <label className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-600 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={autoSuggestEnabled}
          onChange={(e) => setAutoSuggestEnabled(e.target.checked)}
          className="rounded accent-[#FE3A18]"
        />
        <span>Categorizar automaticamente ao terminar de digitar a descrição</span>
      </label>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span className="leading-relaxed">{errorMsg}</span>
        </div>
      )}

      {!errorMsg && !loading && !result && (
        <div className="text-[11px] text-slate-500 leading-relaxed">
          {canAnalyze
            ? 'Descrição pronta! Clique em "Sugerir Categoria" ou saia do campo de texto para receber a classificação automática.'
            : 'Informe ao menos 8 caracteres na descrição acima para ativar a classificação automática.'}
        </div>
      )}

      {result && !loading && (
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-500">
                Recomendação principal:
              </span>
              <span className="font-black text-slate-900">
                {result.primaryCategory}
              </span>
              <span
                className={`text-[11px] font-bold ${
                  result.confidenceLabel === 'Alta'
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
              >
                · Confiança {result.confidenceLabel}
              </span>
            </div>

            {selectedCategory === result.primaryCategory ? (
              <span className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1 whitespace-nowrap">
                <Check className="w-3.5 h-3.5" />
                <span>Aplicada ao cadastro</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onApplyCategory(result.primaryCategory, 'manual_pick')}
                className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold cursor-pointer whitespace-nowrap"
              >
                Aplicar esta categoria
              </button>
            )}
          </div>

          {result.reasoning && (
            <p className="text-xs text-slate-600 leading-relaxed">
              {result.reasoning}
            </p>
          )}

          {result.secondaryCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">
                Alternativas:
              </span>
              {result.secondaryCategories.map((altCat) => {
                const isSelected = selectedCategory === altCat;
                return (
                  <button
                    key={altCat}
                    type="button"
                    onClick={() => onApplyCategory(altCat, 'manual_pick')}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#FE3A18] hover:text-[#FE3A18]'
                    }`}
                  >
                    {altCat}
                  </button>
                );
              })}
            </div>
          )}

          {result.suggestedTags.length > 0 && (
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="font-bold text-slate-700">Termos sugeridos:</span>{' '}
              <span>{result.suggestedTags.join(' · ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
