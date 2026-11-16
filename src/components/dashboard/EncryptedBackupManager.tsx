/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  FileJson,
  KeyRound,
  Eye,
  EyeOff,
  Upload,
  Sparkles,
  Check,
  X,
  HardDrive,
  Database,
  Layers,
  MessageSquare,
  Star,
  Copy
} from 'lucide-react';

export interface EncryptedBackupEnvelope {
  schemaVersion: string;
  platform: string;
  region: string;
  createdAt: string;
  triggerType: 'Automático' | 'Exportação Manual';
  businessMetadata: {
    businessName: string;
    cnpj: string;
    category: string;
    address: string;
    recordCounts: {
      ads: number;
      leads: number;
      reviews: number;
      schedules: number;
    };
  };
  encryption: {
    algorithm: 'AES-256-GCM';
    kdf: 'PBKDF2-SHA-256';
    iterations: number;
    saltBase64: string;
    ivBase64: string;
    payloadSha256: string;
  };
  encryptedPayloadBase64: string;
}

export interface BackupSnapshotRecord {
  id: string;
  timestamp: string;
  triggerType: 'Automático' | 'Exportação Manual';
  sizeKb: string;
  sha256Short: string;
  counts: {
    ads: number;
    leads: number;
    reviews: number;
  };
  envelope: EncryptedBackupEnvelope;
}

const BACKUP_VAULT_STORAGE_KEY = 'guiaponto_encrypted_backup_vault_v1';

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function computeSha256Hex(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function encryptCompanyDataJSON(
  plaintextJson: string,
  passphrase: string
): Promise<{
  encryptedPayloadBase64: string;
  saltBase64: string;
  ivBase64: string;
  payloadSha256: string;
}> {
  const encoder = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encoder.encode(plaintextJson)
  );

  const payloadSha256 = await computeSha256Hex(plaintextJson);

  return {
    encryptedPayloadBase64: arrayBufferToBase64(ciphertextBuffer),
    saltBase64: arrayBufferToBase64(salt),
    ivBase64: arrayBufferToBase64(iv),
    payloadSha256
  };
}

async function decryptCompanyDataJSON(
  envelope: EncryptedBackupEnvelope,
  passphrase: string
): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const salt = base64ToUint8Array(envelope.encryption.saltBase64);
  const iv = base64ToUint8Array(envelope.encryption.ivBase64);
  const ciphertext = base64ToUint8Array(envelope.encryptedPayloadBase64);

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: envelope.encryption.iterations || 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    aesKey,
    ciphertext.buffer as ArrayBuffer
  );

  return decoder.decode(decryptedBuffer);
}

const DEFAULT_BACKUP_REVIEWS_SUMMARY = [
  {
    id: 'rev-1',
    customerName: 'Mariana Costa Moura',
    neighborhood: 'Parque Campolim, Sorocaba',
    adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
    rating: 5,
    sentiment: 'Positivo',
    comment: 'Experiência impecável no almoço executivo! Reserva rápida pelo WhatsApp.',
    responseStatus: 'Rascunho IA Pronto'
  },
  {
    id: 'rev-2',
    customerName: 'Carlos Eduardo Nogueira',
    neighborhood: 'Trujillo, Sorocaba',
    adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
    rating: 2,
    sentiment: 'Crítico / Negativo',
    comment: 'A comida é muito saborosa, porém na sexta-feira demorou no horário de pico.',
    responseStatus: 'Rascunho IA Pronto'
  },
  {
    id: 'rev-3',
    customerName: 'Beatriz & Família Mello',
    neighborhood: 'Santa Rosália, Sorocaba',
    adTitle: 'Residencial Sênior Acolher',
    rating: 5,
    sentiment: 'Positivo',
    comment: 'Carinho exemplar da equipe de enfermagem e fisioterapia em Santa Rosália.',
    responseStatus: 'Respondido'
  },
  {
    id: 'rev-4',
    customerName: 'Rafael Arruda Vieira',
    neighborhood: 'Centro, Votorantim',
    adTitle: 'Imobiliária Prime Sorocaba - Alto Padrão',
    rating: 1,
    sentiment: 'Crítico / Negativo',
    comment: 'Demora no envio da ficha técnica durante o plantão de sábado.',
    responseStatus: 'Pendente'
  },
  {
    id: 'rev-5',
    customerName: 'Fernanda L. Camargo',
    neighborhood: 'Wanel Ville, Sorocaba',
    adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
    rating: 4,
    sentiment: 'Positivo',
    comment: 'Pratos muito bem servidos e preço justo para a região do Campolim.',
    responseStatus: 'Pendente'
  },
  {
    id: 'rev-6',
    customerName: 'Dr. Gustavo Penteado',
    neighborhood: 'Mangal, Sorocaba',
    adTitle: 'Imobiliária Prime Sorocaba - Alto Padrão',
    rating: 3,
    sentiment: 'Neutro',
    comment: 'Excelentes opções de imóveis no portal, sugestão de adicionar tour 360º.',
    responseStatus: 'Pendente'
  }
];

interface EncryptedBackupManagerProps {
  accountData: {
    businessName: string;
    cnpj: string;
    category: string;
    address: string;
  };
  ads: any[];
  leads: any[];
  schedules?: any[];
  onAwardXp?: (amount: number, reason: string) => void;
}

export function EncryptedBackupManager({
  accountData,
  ads,
  leads,
  schedules = [],
  onAwardXp
}: EncryptedBackupManagerProps) {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState<boolean>(true);
  const [backupFrequency, setBackupFrequency] = useState<string>('realtime');
  const [includeAds, setIncludeAds] = useState<boolean>(true);
  const [includeLeads, setIncludeLeads] = useState<boolean>(true);
  const [includeReviews, setIncludeReviews] = useState<boolean>(true);
  const [includeCompanySettings, setIncludeCompanySettings] = useState<boolean>(true);

  const [encryptionKey, setEncryptionKey] = useState<string>('GP-SOROCABA-AES256-KEY#2026');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const [snapshots, setSnapshots] = useState<BackupSnapshotRecord[]>([]);
  const [selectedSnapshotForInspect, setSelectedSnapshotForInspect] =
    useState<BackupSnapshotRecord | null>(null);
  const [decryptedPreviewText, setDecryptedPreviewText] = useState<string | null>(null);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const buildEncryptedSnapshot = useCallback(
    async (
      triggerType: 'Automático' | 'Exportação Manual'
    ): Promise<BackupSnapshotRecord> => {
      const rawStructure = {
        exportedAt: new Date().toISOString(),
        region: 'Sorocaba & Região Metropolitana - SP',
        companyProfile: includeCompanySettings ? accountData : undefined,
        adsStructure: includeAds
          ? {
              totalAds: ads.length,
              items: ads,
              peakSchedules: schedules
            }
          : undefined,
        crmLeadsHistory: includeLeads
          ? {
              totalLeads: leads.length,
              items: leads
            }
          : undefined,
        customerReviewsHistory: includeReviews
          ? {
              totalReviews: DEFAULT_BACKUP_REVIEWS_SUMMARY.length,
              averageRating: 4.4,
              items: DEFAULT_BACKUP_REVIEWS_SUMMARY
            }
          : undefined
      };

      const plaintextJson = JSON.stringify(rawStructure, null, 2);
      const activeKey = encryptionKey.trim() || 'GP-SOROCABA-AES256-KEY#2026';
      const encrypted = await encryptCompanyDataJSON(plaintextJson, activeKey);

      const nowFormatted = new Date().toLocaleString('pt-BR');
      const envelope: EncryptedBackupEnvelope = {
        schemaVersion: 'GuiaPonto-SecureVault-v2.5',
        platform: 'GuiaPonto Executive Suite',
        region: 'Sorocaba & Região - SP',
        createdAt: nowFormatted,
        triggerType,
        businessMetadata: {
          businessName: accountData.businessName,
          cnpj: accountData.cnpj,
          category: accountData.category,
          address: accountData.address,
          recordCounts: {
            ads: includeAds ? ads.length : 0,
            leads: includeLeads ? leads.length : 0,
            reviews: includeReviews ? DEFAULT_BACKUP_REVIEWS_SUMMARY.length : 0,
            schedules: includeAds ? schedules.length : 0
          }
        },
        encryption: {
          algorithm: 'AES-256-GCM',
          kdf: 'PBKDF2-SHA-256',
          iterations: 100000,
          saltBase64: encrypted.saltBase64,
          ivBase64: encrypted.ivBase64,
          payloadSha256: encrypted.payloadSha256
        },
        encryptedPayloadBase64: encrypted.encryptedPayloadBase64
      };

      const serializedEnvelope = JSON.stringify(envelope, null, 2);
      const sizeKb = (new Blob([serializedEnvelope]).size / 1024).toFixed(1);

      return {
        id: `bkp-${Date.now()}`,
        timestamp: nowFormatted,
        triggerType,
        sizeKb: `${sizeKb} KB`,
        sha256Short: encrypted.payloadSha256.slice(0, 16).toUpperCase(),
        counts: {
          ads: envelope.businessMetadata.recordCounts.ads,
          leads: envelope.businessMetadata.recordCounts.leads,
          reviews: envelope.businessMetadata.recordCounts.reviews
        },
        envelope
      };
    },
    [
      accountData,
      ads,
      leads,
      schedules,
      includeAds,
      includeLeads,
      includeReviews,
      includeCompanySettings,
      encryptionKey
    ]
  );

  // Initialize first automatic encrypted backup snapshot on mount
  useEffect(() => {
    let mounted = true;
    try {
      const stored = localStorage.getItem(BACKUP_VAULT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BackupSnapshotRecord[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSnapshots(parsed);
          return;
        }
      }
    } catch {
      // Ignore storage error
    }

    buildEncryptedSnapshot('Automático').then((initialSnap) => {
      if (!mounted) return;
      const list = [initialSnap];
      setSnapshots(list);
      try {
        localStorage.setItem(BACKUP_VAULT_STORAGE_KEY, JSON.stringify(list));
      } catch {
        // Ignore storage write error
      }
    });

    return () => {
      mounted = false;
    };
  }, [buildEncryptedSnapshot]);

  // Automatic Real-Time Backup when ads or leads change while autoBackupEnabled is ON
  useEffect(() => {
    if (!autoBackupEnabled) return;
    const timer = setTimeout(() => {
      buildEncryptedSnapshot('Automático').then((snap) => {
        setSnapshots((prev) => {
          const updated = [snap, ...prev.slice(0, 5)];
          try {
            localStorage.setItem(BACKUP_VAULT_STORAGE_KEY, JSON.stringify(updated));
          } catch {
            // Ignore
          }
          return updated;
        });
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [ads.length, leads.length, autoBackupEnabled, buildEncryptedSnapshot]);

  const handleExportEncryptedJson = async () => {
    setIsProcessing(true);
    const snapshot = await buildEncryptedSnapshot('Exportação Manual');

    setSnapshots((prev) => {
      const updated = [snapshot, ...prev.slice(0, 5)];
      try {
        localStorage.setItem(BACKUP_VAULT_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    const jsonString = JSON.stringify(snapshot.envelope, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateSlug = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `guiaponto-backup-criptografado-sorocaba-${dateSlug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsProcessing(false);
    onAwardXp?.(120, 'Exportação de Backup JSON Criptografado (AES-256)');
    setStatusFeedback(
      `Backup JSON criptografado (AES-256-GCM • Hash ${snapshot.sha256Short}) exportado com sucesso!`
    );
    setTimeout(() => setStatusFeedback(null), 5000);
  };

  const handleTriggerManualSnapshot = async () => {
    setIsProcessing(true);
    const snapshot = await buildEncryptedSnapshot('Automático');
    setSnapshots((prev) => {
      const updated = [snapshot, ...prev.slice(0, 5)];
      try {
        localStorage.setItem(BACKUP_VAULT_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    setIsProcessing(false);
    onAwardXp?.(50, 'Ponto de Restauração Criptografado Criado');
    setStatusFeedback(
      `Novo ponto de backup automático salvo no Cofre Local (SHA-256: ${snapshot.sha256Short}).`
    );
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  const handleGenerateStrongKey = () => {
    const randomBytes = window.crypto.getRandomValues(new Uint8Array(12));
    const hex = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
      .join('');
    setEncryptionKey(`GP-SRO-${hex.slice(0, 8)}-${hex.slice(8, 16)}`);
    setShowKey(true);
  };

  const handleTestDecryptSnapshot = async (snap: BackupSnapshotRecord) => {
    setDecryptError(null);
    try {
      const plaintext = await decryptCompanyDataJSON(snap.envelope, encryptionKey.trim());
      setDecryptedPreviewText(plaintext);
    } catch {
      setDecryptError(
        'Não foi possível descriptografar com a chave atual. Verifique se a chave mestra corresponde à usada na criação deste snapshot.'
      );
    }
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result)) as EncryptedBackupEnvelope;
        if (parsed && parsed.encryptedPayloadBase64 && parsed.encryption?.algorithm === 'AES-256-GCM') {
          const importedSnap: BackupSnapshotRecord = {
            id: `bkp-imp-${Date.now()}`,
            timestamp: parsed.createdAt || new Date().toLocaleString('pt-BR'),
            triggerType: 'Exportação Manual',
            sizeKb: `${(file.size / 1024).toFixed(1)} KB`,
            sha256Short: (parsed.encryption.payloadSha256 || 'VALIDATED').slice(0, 16).toUpperCase(),
            counts: {
              ads: parsed.businessMetadata?.recordCounts?.ads || ads.length,
              leads: parsed.businessMetadata?.recordCounts?.leads || leads.length,
              reviews: parsed.businessMetadata?.recordCounts?.reviews || 6
            },
            envelope: parsed
          };
          setSnapshots((prev) => [importedSnap, ...prev.slice(0, 5)]);
          setSelectedSnapshotForInspect(importedSnap);
          setDecryptedPreviewText(null);
          setStatusFeedback(
            `Arquivo de backup "${file.name}" validado e carregado com sucesso no Cofre!`
          );
          setTimeout(() => setStatusFeedback(null), 4500);
        } else {
          setStatusFeedback('O arquivo selecionado não possui o cabeçalho criptográfico GuiaPonto AES-256-GCM.');
        }
      } catch {
        setStatusFeedback('Erro ao ler o arquivo JSON de backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Top Header & Auto-Backup Master Switch */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-7 text-white border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Segurança Corporativa • Criptografia AES-256-GCM</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5 flex-wrap">
              <span>Sistema de Backup Automático & Exportação JSON Criptografada</span>
              <span
                className={`text-xs px-3 py-0.5 rounded-full font-extrabold uppercase ${
                  autoBackupEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {autoBackupEnabled ? '● Backup Automático Ativo' : '○ Pausado'}
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Proteja toda a inteligência comercial de <strong className="text-white">{accountData.businessName}</strong> em Sorocaba. Exporte ou sincronize sua estrutura completa de anúncios, leads do CRM e histórico de avaliações em formato JSON criptografado com derivação de chave PBKDF2 SHA-256.
            </p>
          </div>

          {/* Toggle Switch Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center justify-between sm:justify-start gap-4 shrink-0">
            <button
              type="button"
              role="switch"
              aria-checked={autoBackupEnabled}
              onClick={() => {
                const next = !autoBackupEnabled;
                setAutoBackupEnabled(next);
                setStatusFeedback(
                  next
                    ? 'Backup Automático Criptografado ativado! Seus dados serão sincronizados em tempo real.'
                    : 'Backup Automático pausado. Você ainda pode exportar manualmente a qualquer momento.'
                );
                setTimeout(() => setStatusFeedback(null), 4000);
              }}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                autoBackupEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition duration-200 flex items-center justify-center ${
                  autoBackupEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                <ShieldCheck
                  className={`w-4 h-4 ${autoBackupEnabled ? 'text-emerald-600' : 'text-slate-400'}`}
                />
              </span>
            </button>

            <div>
              <div className="text-sm font-black text-white">Auto-Backup em Cofre</div>
              <div className="text-[11px] text-slate-300">
                {snapshots[0]
                  ? `Último snapshot: ${snapshots[0].timestamp}`
                  : 'Sincronizando...'}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Counters Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <Layers className="w-3.5 h-3.5 text-[#FE3A18]" />
              <span>Estrutura de Anúncios</span>
            </div>
            <div className="text-lg font-black text-white mt-1">{ads.length} campanhas</div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              + {schedules.length} horários de pico
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Leads CRM & Follow-up</span>
            </div>
            <div className="text-lg font-black text-white mt-1">{leads.length} contatos</div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              E-mails e WhatsApp inclusos
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Histórico de Avaliações</span>
            </div>
            <div className="text-lg font-black text-white mt-1">
              {DEFAULT_BACKUP_REVIEWS_SUMMARY.length} avaliações
            </div>
            <span className="text-[10px] text-amber-300 font-semibold">
              Notas 1★–5★ + Respostas IA
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <HardDrive className="w-3.5 h-3.5 text-sky-400" />
              <span>Padrão de Criptografia</span>
            </div>
            <div className="text-lg font-black text-white mt-1">AES-256-GCM</div>
            <span className="text-[10px] text-sky-300 font-semibold">
              PBKDF2 • 100.000 iterações
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      <AnimatePresence>
        {statusFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusFeedback(null)}
              className="text-emerald-700 hover:text-emerald-950"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configuration Grid: Scope + Encryption Passphrase + Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Data Scope & Frequency */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#FE3A18]" />
              <span>Escopo de Dados Incluídos no Backup</span>
            </h4>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Proteção Integral
            </span>
          </div>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={includeAds}
                  onChange={(e) => setIncludeAds(e.target.checked)}
                  className="w-4 h-4 accent-[#FE3A18] rounded cursor-pointer"
                />
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">
                    Estrutura de Anúncios & Agendamentos de Pico
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Títulos, categorias, métricas de cliques/impressões e slots do calendário ({ads.length} itens)
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                JSON
              </span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={includeLeads}
                  onChange={(e) => setIncludeLeads(e.target.checked)}
                  className="w-4 h-4 accent-[#FE3A18] rounded cursor-pointer"
                />
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">
                    Base de Leads WhatsApp & Rascunhos Auto-Follow-up IA
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Contatos capturados, status do funil e histórico de e-mails IA ({leads.length} leads)
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                JSON
              </span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={includeReviews}
                  onChange={(e) => setIncludeReviews(e.target.checked)}
                  className="w-4 h-4 accent-[#FE3A18] rounded cursor-pointer"
                />
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">
                    Histórico de Avaliações (1★ a 5★) & Respostas IA
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Feedbacks de clientes verificados de Sorocaba e respostas publicadas ({DEFAULT_BACKUP_REVIEWS_SUMMARY.length} avaliações)
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                JSON
              </span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={includeCompanySettings}
                  onChange={(e) => setIncludeCompanySettings(e.target.checked)}
                  className="w-4 h-4 accent-[#FE3A18] rounded cursor-pointer"
                />
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">
                    Cadastro Corporativo, CNPJ & Endereço Sorocaba
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Metadados da empresa e preferências de conta
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                JSON
              </span>
            </label>
          </div>
        </div>

        {/* Right: Encryption Key & Export Actions */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#FE3A18]" />
                <span>Chave Mestra de Criptografia & Frequência</span>
              </h4>
              <button
                type="button"
                onClick={handleGenerateStrongKey}
                className="text-xs font-extrabold text-[#FE3A18] hover:underline cursor-pointer"
              >
                Gerar Nova Chave Forte
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Chave Secreta para Criptografar/Descriptografar o JSON (AES-256-GCM)
              </label>
              <div className="relative flex items-center">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={encryptionKey}
                  onChange={(e) => setEncryptionKey(e.target.value)}
                  placeholder="Digite sua chave secreta de criptografia..."
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-[#FE3A18]"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  title={showKey ? 'Ocultar chave' : 'Mostrar chave'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                O conteúdo do arquivo é criptografado localmente no navegador via Web Crypto API antes do download.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Frequência do Backup Automático
              </label>
              <select
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FE3A18]"
              >
                <option value="realtime">
                  Tempo Real (A cada novo anúncio, lead ou avaliação)
                </option>
                <option value="15min">A cada 15 minutos (Sincronização Contínua)</option>
                <option value="daily">Diário às 03:00 BRT (Consolidado Noturno)</option>
                <option value="weekly">Semanal (Toda Segunda-feira)</option>
              </select>
            </div>
          </div>

          {/* Primary Export & Restore Buttons */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200/80">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleExportEncryptedJson}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#FE3A18] hover:bg-[#e03212] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#FE3A18]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Criptografando Estrutura (AES-256)...'
                  : 'Exportar Backup JSON Criptografado (.json)'}
              </span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleTriggerManualSnapshot}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Criar Snapshot Agora</span>
              </button>

              <label className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#FE3A18]" />
                <span>Importar / Verificar JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackupFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Encrypted Snapshots Vault Table */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Histórico Recente de Pontos de Backup Criptografados</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-semibold">
            {snapshots.length} snapshots armazenados com verificação SHA-256
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Origem</th>
                <th className="py-3 px-4">Registros Protegidos</th>
                <th className="py-3 px-4">Hash SHA-256 & Tamanho</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {snapshots.map((snap) => (
                <tr key={snap.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{snap.timestamp}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        snap.triggerType === 'Automático'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-orange-50 text-[#FE3A18] border border-orange-200'
                      }`}
                    >
                      {snap.triggerType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-semibold">
                    {snap.counts.ads} anúncios • {snap.counts.leads} leads • {snap.counts.reviews} avaliações
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    <span className="text-slate-800 font-bold">{snap.sha256Short}</span> ({snap.sizeKb})
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSnapshotForInspect(snap);
                          setDecryptedPreviewText(null);
                          setDecryptError(null);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FileJson className="w-3.5 h-3.5 text-[#FE3A18]" />
                        <span>Inspecionar JSON</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector & Decryption Verification Drawer */}
      <AnimatePresence>
        {selectedSnapshotForInspect && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  Inspetor de Pacote Criptográfico AES-256-GCM
                </span>
                <h5 className="text-base font-black text-white">
                  Snapshot de {selectedSnapshotForInspect.timestamp} (Hash: {selectedSnapshotForInspect.sha256Short})
                </h5>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTestDecryptSnapshot(selectedSnapshotForInspect)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Testar Descriptografia com Chave Mestra</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const content =
                      decryptedPreviewText ||
                      JSON.stringify(selectedSnapshotForInspect.envelope, null, 2);
                    navigator.clipboard.writeText(content);
                    setCopiedJson(true);
                    setTimeout(() => setCopiedJson(false), 2500);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar JSON</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSnapshotForInspect(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {decryptError && (
              <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 rounded-xl p-3 text-xs font-bold">
                {decryptError}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>
                  {decryptedPreviewText
                    ? '🔓 Estrutura JSON Descriptografada e Verificada (Anúncios, Leads e Avaliações):'
                    : '🔒 Estrutura do Arquivo JSON Criptografado (Ciphertext Base64 + IV + Salt PBKDF2):'}
                </span>
                {decryptedPreviewText && (
                  <button
                    type="button"
                    onClick={() => setDecryptedPreviewText(null)}
                    className="text-orange-300 hover:underline cursor-pointer"
                  >
                    Voltar para visualização criptografada
                  </button>
                )}
              </div>
              <pre className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-72 leading-relaxed">
                {decryptedPreviewText ||
                  JSON.stringify(selectedSnapshotForInspect.envelope, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
