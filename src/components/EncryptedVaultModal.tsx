import React, { useState } from 'react';
import { 
  Lock, 
  Key, 
  ShieldCheck, 
  Download, 
  Eye, 
  EyeOff, 
  X, 
  Copy, 
  Check, 
  FileCode, 
  Cpu,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { EmergencyContact } from '../types/guardian';
import { encryptData, decryptData, EncryptedPayload, computeSha256Hash } from '../utils/crypto';

interface EncryptedVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  onAddContact: (contact: EmergencyContact) => void;
  onRemoveContact: (id: string) => void;
}

export const EncryptedVaultModal: React.FC<EncryptedVaultModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onAddContact,
  onRemoveContact
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'contacts' | 'crypto-inspector'>('profile');
  const [copied, setCopied] = useState<string | null>(null);

  // Victim profile state
  const [profile, setProfile] = useState({
    fullName: 'Jane Doe',
    age: 24,
    bloodType: 'O-Negative',
    medicalNotes: 'Asthmatic, carries Albuterol inhaler; penicillin allergy',
    vehiclePlate: '7XYZ892 (2023 Dark Gray Honda Civic)',
    identifyingFeatures: '5 ft 7 in, brown hair, small birthmark on left wrist',
    secretEmergencyNotes: 'Regular commute route goes along 4th St through Financial District.'
  });

  // Crypto testing state
  const [testPlainText, setTestPlainText] = useState('CRITICAL TELEMETRY: Coords 37.7749N, 122.4194W | HeartRate 142BPM | Distress scream detected');
  const [encryptedResult, setEncryptedResult] = useState<EncryptedPayload | null>(null);
  const [decryptedResult, setDecryptedResult] = useState<string | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);

  // New contact form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelation, setNewRelation] = useState('Family');

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRunCryptoTest = async () => {
    setIsEncrypting(true);
    const enc = await encryptData(testPlainText);
    setEncryptedResult(enc);
    const dec = await decryptData<string>(enc);
    setDecryptedResult(typeof dec === 'string' ? dec : JSON.stringify(dec));
    setIsEncrypting(false);
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    onAddContact({
      id: `contact-${Date.now()}`,
      name: newName,
      phone: newPhone,
      relation: newRelation,
      isPrimary: contacts.length === 0,
      notifyOnDeviation: true,
      avatarBg: 'bg-indigo-600'
    });
    setNewName('');
    setNewPhone('');
  };

  const handleDownloadEncryptedDossier = async () => {
    const fullPayload = {
      profile,
      contacts,
      timestamp: Date.now(),
      system: 'Guardian AI E2EE Vault v2.6'
    };
    const encrypted = await encryptData(fullPayload);
    const hash = await computeSha256Hash(fullPayload);

    const dossier = {
      title: 'GUARDIAN AI - LAW ENFORCEMENT SEALED EVIDENCE DOSSIER',
      chainOfCustodyHash: hash,
      encryptionAlgorithm: 'AES-256-GCM (PBKDF2 SHA-256 derived)',
      createdAt: new Date().toISOString(),
      encryptedContainer: encrypted
    };

    const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guardian-sealed-evidence-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  End-to-End Encrypted Vault
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  AES-256-GCM ACTIVE
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Zero-knowledge encrypted storage for biometrics, medical data & emergency contacts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/40 px-5 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Medical & Biometric Profile
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'contacts'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Trusted Circle Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('crypto-inspector')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'crypto-inspector'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            AES-256 Crypto Inspector
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs text-zinc-300">
          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-200">
                  This profile data is encrypted on your device with your secret key before transmission. Only dispatched first responders and verified emergency guardians hold decryption tokens.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 font-bold uppercase block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 font-bold uppercase block mb-1">Blood Type</label>
                  <input
                    type="text"
                    value={profile.bloodType}
                    onChange={e => setProfile({ ...profile, bloodType: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 font-bold uppercase block mb-1">Vehicle License & Model</label>
                  <input
                    type="text"
                    value={profile.vehiclePlate}
                    onChange={e => setProfile({ ...profile, vehiclePlate: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 font-bold uppercase block mb-1">Physical Identifying Marks</label>
                  <input
                    type="text"
                    value={profile.identifyingFeatures}
                    onChange={e => setProfile({ ...profile, identifyingFeatures: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-bold uppercase block mb-1">Critical Medical Allergies / Conditions</label>
                <textarea
                  rows={2}
                  value={profile.medicalNotes}
                  onChange={e => setProfile({ ...profile, medicalNotes: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-bold uppercase block mb-1">Encrypted Emergency Notes</label>
                <textarea
                  rows={2}
                  value={profile.secretEmergencyNotes}
                  onChange={e => setProfile({ ...profile, secretEmergencyNotes: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Contacts */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <form onSubmit={handleCreateContact} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-3">
                <span className="font-bold text-white text-xs block">Add Trusted Emergency Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Contact Name (e.g. Sarah Miller)"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g. +1 555 019 2831)"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={newRelation}
                    onChange={e => setNewRelation(e.target.value)}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Family">Family / Parent</option>
                    <option value="Spouse">Spouse / Partner</option>
                    <option value="Security">Private Security Escort</option>
                    <option value="Friend">Trusted Friend</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded-lg text-xs transition-colors"
                >
                  Add Encrypted Contact
                </button>
              </form>

              <div className="space-y-2">
                {contacts.map(contact => (
                  <div
                    key={contact.id}
                    className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        {contact.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{contact.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-zinc-800 text-zinc-300 font-mono">
                            {contact.relation}
                          </span>
                          {contact.isPrimary && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                              PRIMARY NOTIFY
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400">{contact.phone}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveContact(contact.id)}
                      className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: AES-256 Crypto Inspector */}
          {activeTab === 'crypto-inspector' && (
            <div className="space-y-3 font-mono">
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1 font-sans">
                  Plaintext Emergency Telemetry Buffer:
                </label>
                <textarea
                  rows={2}
                  value={testPlainText}
                  onChange={e => setTestPlainText(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-emerald-400 font-mono focus:outline-none"
                />
                <button
                  onClick={handleRunCryptoTest}
                  disabled={isEncrypting}
                  className="mt-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors font-sans"
                >
                  {isEncrypting ? 'Encrypting with SubtleCrypto...' : 'Execute AES-256-GCM Encryption'}
                </button>
              </div>

              {encryptedResult && (
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-2">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase block font-sans">
                      Ciphertext Hex (Encrypted):
                    </span>
                    <div className="p-2 bg-zinc-950 rounded border border-zinc-800 text-[11px] text-amber-300 break-all max-h-20 overflow-y-auto">
                      {encryptedResult.cipherTextHex}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-zinc-500 block font-sans">IV (12 Bytes):</span>
                      <span className="text-zinc-300">{encryptedResult.ivHex}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block font-sans">Salt (16 Bytes):</span>
                      <span className="text-zinc-300">{encryptedResult.saltHex}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase block font-sans">
                      SHA-256 Tamper-Proof Chain of Custody Hash:
                    </span>
                    <span className="text-[11px] text-emerald-400 break-all">{encryptedResult.hash}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <button
            onClick={handleDownloadEncryptedDossier}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-700/40 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Signed Evidence Dossier</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
