// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// // Your voice data
// import { voiceset2, voiceset3 } from "../../helpers/data.js";

// /** --- Color palette --- */
// const colors = {
//   primary: "#4F46E5",
//   secondary: "#10B981",
//   danger: "#EF4444",
//   text: "#111827",
//   lightText: "#6B7280",
//   border: "#E5E7EB",
//   background: "#F3F4F6",
//   card: "#FFFFFF",
//   hover: "#F9FAFB",
//   radioSelected: "#1F2937",
//   radioBorder: "#374151",
// };

// const E164 = /^\+\d{7,15}$/;

// const CreateAssistant = () => {
//   const navigate = useNavigate();

//   // ----------- UI state -----------
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isAudioPlaying, setIsAudioPlaying] = useState(false);
//   const audioInstance = useRef(null);

//   // ----------- Form state -----------
//   const [formData, setFormData] = useState({
//     // Step 1 — core & transcription
//     name: "",
//     provider: "",
//     model: "",
//     temperature: 0.7,
//     maxTokens: 4096,
//     systemPrompt: "",
//     first_message: "",
//     transcribe_provider: "deepgram",
//     transcribe_language: "en",
//     transcribe_model: "nova-2",
//     forwardingPhoneNumber: "",
//     attached_Number: "",
//     category: "",
//     draft: false,
//     assistant_toggle: true,

//     // Step 2 — knowledge & tuning
//     knowledgeBase: [], // string[]
//     leadsfile: [], // number[]
//     languages: [], // string[]
//     endCallPhrases: [], // string[]
//     speed: 0,
//     stability: 0.5,
//     similarityBoost: 0.75,

//     // Step 3 — voice
//     voice_provider: "11labs",
//     voice_model: "",
//     voice: "",
//     voiceSet: "all",
//   });

//   const [chips, setChips] = useState({
//     knowledgeBase: "",
//     languages: "",
//     endCallPhrases: "",
//     leadsfile: "",
//   });

//   const [errors, setErrors] = useState({});

//   // ----------- Derived voice list -----------
//   const allVoices = useMemo(
//     () => [...voiceset2, ...voiceset3].sort((a, b) => (a?.showName || "").localeCompare(b?.showName || "")),
//     []
//   );

//   // Auto-choose first voice when entering step 3 / changing set
//   useEffect(() => {
//     if (currentStep !== 3) return;

//     const list =
//       formData.voiceSet === "voiceset1"
//         ? allVoices.filter((v) => voiceset2.includes(v))
//         : formData.voiceSet === "voiceset2"
//         ? allVoices.filter((v) => voiceset3.includes(v))
//         : allVoices;

//     if (!formData.voice && list.length && list[0]?.name) {
//       setFormData((p) => ({ ...p, voice: list[0].name }));
//       setErrors((p) => ({ ...p, voice: "" }));
//     }
//   }, [currentStep, formData.voiceSet, formData.voice, allVoices]);

//   // ----------- Helpers -----------
//   const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

//   const handleInput = (e) => {
//     const { id, value, type, checked } = e.target;
//     const next = type === "checkbox" ? checked : value;
//     setFormData((p) => ({ ...p, [id]: next }));
//     setErrors((p) => ({ ...p, [id]: "" }));
//   };

//   const addChip = (field, parser = (x) => x) => {
//     const raw = chips[field].trim();
//     if (!raw) return;
//     const nextValue = parser(raw);
//     if (nextValue === "" || nextValue === undefined || nextValue === null) return;
//     setFormData((p) => ({ ...p, [field]: [...(p[field] || []), nextValue] }));
//     setChips((p) => ({ ...p, [field]: "" }));
//   };

//   const removeChip = (field, idx) => {
//     setFormData((p) => {
//       const copy = [...(p[field] || [])];
//       copy.splice(idx, 1);
//       return { ...p, [field]: copy };
//     });
//   };

//   const handlePlayVoice = (audioSr) => {
//     try {
//       if (audioInstance.current) {
//         audioInstance.current.pause();
//         audioInstance.current = null;
//       }
//       const a = new Audio(audioSr);
//       audioInstance.current = a;
//       setIsAudioPlaying(true);
//       a.play()
//         .catch(() => {
//           toast.error("Failed to play voice preview");
//           setIsAudioPlaying(false);
//           audioInstance.current = null;
//         });
//       a.onended = () => {
//         setIsAudioPlaying(false);
//         audioInstance.current = null;
//       };
//     } catch {
//       toast.error("Failed to play voice preview");
//       setIsAudioPlaying(false);
//     }
//   };

//   const handleStopVoice = () => {
//     if (audioInstance.current) {
//       audioInstance.current.pause();
//       audioInstance.current = null;
//       setIsAudioPlaying(false);
//     }
//   };

//   const handleStepChange = (step) => {
//     if (step === currentStep) return;
//     handleStopVoice();
//     setCurrentStep(step);
//   };

//   // ----------- Validation mirrors backend required_fields -----------
//   const validate = () => {
//     const req = [
//       "name",
//       "provider",
//       "model",
//       "temperature",
//       "maxTokens",
//       "transcribe_provider",
//       "transcribe_language",
//       "transcribe_model",
//       "voice_provider",
//       "voice",
//     ];

//     const nErr = {};
//     let ok = true;

//     req.forEach((k) => {
//       const v = formData[k];
//       if (v === null || v === undefined || v === "" || Number.isNaN(v)) {
//         nErr[k] = "Required";
//         ok = false;
//       }
//     });

//     // Numeric ranges
//     if (formData.temperature < 0 || formData.temperature > 2) {
//       nErr.temperature = "Temperature must be between 0 and 2";
//       ok = false;
//     }
//     if (formData.maxTokens < 1) {
//       nErr.maxTokens = "maxTokens must be a positive integer";
//       ok = false;
//     }

//     // Optional E.164 checks if provided
//     if (formData.forwardingPhoneNumber && !E164.test(formData.forwardingPhoneNumber)) {
//       nErr.forwardingPhoneNumber = "Must be E.164 (+123...)";
//       ok = false;
//     }
//     if (formData.attached_Number && !E164.test(formData.attached_Number)) {
//       nErr.attached_Number = "Must be E.164 (+123...)";
//       ok = false;
//     }

//     setErrors(nErr);
//     return ok;
//   };

//   // ----------- Submit -----------
//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;

//     if (!validate()) {
//       // Jump to the first step that has an error
//       const step1Keys = [
//         "name",
//         "provider",
//         "model",
//         "temperature",
//         "maxTokens",
//         "systemPrompt",
//         "first_message",
//         "transcribe_provider",
//         "transcribe_language",
//         "transcribe_model",
//         "forwardingPhoneNumber",
//         "attached_Number",
//         "category",
//       ];
//       const step2Keys = ["knowledgeBase", "languages", "endCallPhrases", "leadsfile", "speed", "stability", "similarityBoost"];
//       const step3Keys = ["voice_provider", "voice_model", "voice"];

//       const hasErr = (keys) => keys.some((k) => errors[k]);

//       if (hasErr(step1Keys)) setCurrentStep(1);
//       else if (hasErr(step2Keys)) setCurrentStep(2);
//       else setCurrentStep(3);

//       return;
//     }

//     setIsSubmitting(true);
//     handleStopVoice();

//     try {
//       const token = localStorage.getItem("token");
//       const endpoint = `${API_URL}/api/assistants`;

//       const payload = {
//         name: formData.name,
//         provider: formData.provider,
//         first_message: formData.first_message || null,
//         model: formData.model,
//         systemPrompt: formData.systemPrompt || null,
//         knowledgeBase: formData.knowledgeBase, // string[]
//         leadsfile: formData.leadsfile, // number[]
//         temperature: Number(formData.temperature),
//         maxTokens: Number(formData.maxTokens),
//         transcribe_provider: formData.transcribe_provider,
//         transcribe_language: formData.transcribe_language,
//         transcribe_model: formData.transcribe_model,
//         languages: formData.languages, // string[]
//         forwardingPhoneNumber: formData.forwardingPhoneNumber || null,
//         endCallPhrases: formData.endCallPhrases, // string[]
//         voice_provider: formData.voice_provider,
//         voice: formData.voice,
//         voice_model: formData.voice_model || "",
//         attached_Number: formData.attached_Number || null,
//         draft: Boolean(formData.draft),
//         assistant_toggle: Boolean(formData.assistant_toggle),
//         category: formData.category || null,
//         speed: Number(formData.speed),
//         stability: Number(formData.stability),
//         similarityBoost: Number(formData.similarityBoost),
//       };

//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         // backend may send json or text
//         let msg = `HTTP ${res.status}`;
//         try {
//           const j = await res.json();
//           if (j?.detail) msg = j.detail;
//           // Backend returns specific message for forwarding phone number format
//           if (typeof j?.detail === "string" && j.detail.includes("ForwardingPhoneNumber")) {
//             msg = j.detail;
//           }
//         } catch {
//           const t = await res.text();
//           if (t) msg = `${msg} — ${t}`;
//         }
//         throw new Error(msg);
//       }

//       toast.success("Assistant created successfully!");
//       navigate("/admin/assistants");
//     } catch (err) {
//       toast.error(err?.message || "Failed to create assistant");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ----------- Render -----------
//   return (
//     <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
//       <div className="mx-auto max-w-[1400px] px-6 py-12">
//         <div
//           className="mb-8 rounded-xl border bg-white py-4 px-6 text-center shadow-sm"
//           style={{ borderColor: colors.border }}
//         >
//           <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
//             Create New Assistant
//           </h1>
//         </div>

//         {/* Stepper */}
//         <div className="mb-6 flex flex-wrap justify-center gap-3">
//           <StepButton active={currentStep === 1} onClick={() => handleStepChange(1)}>
//             Step 1: Core & Transcription
//           </StepButton>
//           <StepButton active={currentStep === 2} onClick={() => handleStepChange(2)}>
//             Step 2: Knowledge & Tuning
//           </StepButton>
//           <StepButton active={currentStep === 3} onClick={() => handleStepChange(3)}>
//             Step 3: Voice
//           </StepButton>
//         </div>

//         <div
//           className="rounded-xl border p-8 shadow-md transition-transform hover:scale-[1.01]"
//           style={{ backgroundColor: colors.card, borderColor: colors.border }}
//         >
//           <form onSubmit={onSubmit} noValidate>
//             {currentStep === 1 && (
//               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                 <TextInput id="name" label="Assistant Name" value={formData.name} onChange={handleInput} error={errors.name} placeholder="SupportBot" />

//                 <Select
//                   id="provider"
//                   label="LLM Provider"
//                   value={formData.provider}
//                   onChange={handleInput}
//                   error={errors.provider}
//                   options={[
//                     { label: "OpenAI", value: "openai" },
//                     { label: "Anthropic", value: "anthropic" },
//                     { label: "Google", value: "google" },
//                     { label: "AzureOpenAI", value: "azure" },
//                     { label: "Other", value: "other" },
//                   ]}
//                 />

//                 <TextInput id="model" label="Model" value={formData.model} onChange={handleInput} error={errors.model} placeholder="gpt-4o, claude-3.5, etc." />

//                 <NumberInput
//                   id="maxTokens"
//                   label="Max Tokens"
//                   min={1}
//                   value={formData.maxTokens}
//                   onChange={handleInput}
//                   error={errors.maxTokens}
//                 />

//                 <RangeInput
//                   id="temperature"
//                   label={`Temperature: ${formData.temperature}`}
//                   min={0}
//                   max={2}
//                   step={0.01}
//                   value={formData.temperature}
//                   onChange={handleInput}
//                   error={errors.temperature}
//                 />

//                 <Select
//                   id="transcribe_provider"
//                   label="Transcribe Provider"
//                   value={formData.transcribe_provider}
//                   onChange={handleInput}
//                   error={errors.transcribe_provider}
//                   options={[
//                     { label: "Deepgram", value: "deepgram" },
//                     { label: "Whisper", value: "whisper" },
//                     { label: "AssemblyAI", value: "assemblyai" },
//                   ]}
//                 />

//                 <TextInput
//                   id="transcribe_language"
//                   label="Transcribe Language"
//                   value={formData.transcribe_language}
//                   onChange={handleInput}
//                   error={errors.transcribe_language}
//                   placeholder="en"
//                 />

//                 <TextInput
//                   id="transcribe_model"
//                   label="Transcribe Model"
//                   value={formData.transcribe_model}
//                   onChange={handleInput}
//                   error={errors.transcribe_model}
//                   placeholder="nova-2 / whisper-large-v3, etc."
//                 />

//                 <TextInput
//                   id="forwardingPhoneNumber"
//                   label="Forwarding Phone Number (optional, E.164)"
//                   value={formData.forwardingPhoneNumber}
//                   onChange={handleInput}
//                   error={errors.forwardingPhoneNumber}
//                   placeholder="+12345678901"
//                 />

//                 <TextInput
//                   id="attached_Number"
//                   label="Attach Purchased Number (optional, E.164)"
//                   value={formData.attached_Number}
//                   onChange={handleInput}
//                   error={errors.attached_Number}
//                   placeholder="+12345678901"
//                 />

//                 <TextInput id="category" label="Category (optional)" value={formData.category} onChange={handleInput} />

//                 <div className="md:col-span-2">
//                   <Label>System Prompt</Label>
//                   <Textarea id="systemPrompt" value={formData.systemPrompt} onChange={handleInput} placeholder="Write your system prompt…" rows={4} />
//                   {errors.systemPrompt && <ErrorText>{errors.systemPrompt}</ErrorText>}
//                 </div>

//                 <div className="md:col-span-2">
//                   <Label>First Message</Label>
//                   <Textarea id="first_message" value={formData.first_message} onChange={handleInput} placeholder="Hello! ..." rows={3} />
//                   {errors.first_message && <ErrorText>{errors.first_message}</ErrorText>}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 md:col-span-2">
//                   <Checkbox id="draft" label="Save as Draft" checked={formData.draft} onChange={handleInput} />
//                   <Checkbox id="assistant_toggle" label="Enable Assistant Immediately" checked={formData.assistant_toggle} onChange={handleInput} />
//                 </div>
//               </div>
//             )}

//             {currentStep === 2 && (
//               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                 {/* knowledgeBase chips */}
//                 <ChipInput
//                   label="Knowledge Base IDs (strings)"
//                   placeholder="Type an ID and press Add"
//                   value={chips.knowledgeBase}
//                   onChange={(v) => setChips((p) => ({ ...p, knowledgeBase: v }))}
//                   onAdd={() => addChip("knowledgeBase")}
//                   items={formData.knowledgeBase}
//                   onRemove={(i) => removeChip("knowledgeBase", i)}
//                 />

//                 {/* languages chips */}
//                 <ChipInput
//                   label="Languages (ISO codes)"
//                   placeholder="e.g. en, es — press Add"
//                   value={chips.languages}
//                   onChange={(v) => setChips((p) => ({ ...p, languages: v }))}
//                   onAdd={() => addChip("languages")}
//                   items={formData.languages}
//                   onRemove={(i) => removeChip("languages", i)}
//                 />

//                 {/* endCallPhrases chips */}
//                 <ChipInput
//                   label="End Call Phrases"
//                   placeholder='e.g. "thank you", "goodbye" — press Add'
//                   value={chips.endCallPhrases}
//                   onChange={(v) => setChips((p) => ({ ...p, endCallPhrases: v }))}
//                   onAdd={() => addChip("endCallPhrases")}
//                   items={formData.endCallPhrases}
//                   onRemove={(i) => removeChip("endCallPhrases", i)}
//                 />

//                 {/* leadsfile chips (numbers) */}
//                 <ChipInput
//                   label="Lead File IDs (numbers)"
//                   placeholder="Type a number and press Add"
//                   value={chips.leadsfile}
//                   onChange={(v) => setChips((p) => ({ ...p, leadsfile: v }))}
//                   onAdd={() => addChip("leadsfile", (x) => {
//                     const n = Number(x);
//                     return Number.isFinite(n) ? n : "";
//                   })}
//                   items={formData.leadsfile}
//                   onRemove={(i) => removeChip("leadsfile", i)}
//                 />

//                 <RangeInput
//                   id="speed"
//                   label={`Voice Speed (0–2): ${formData.speed}`}
//                   min={0}
//                   max={2}
//                   step={0.01}
//                   value={formData.speed}
//                   onChange={handleInput}
//                   error={errors.speed}
//                 />
//                 <RangeInput
//                   id="stability"
//                   label={`Voice Stability (0–1): ${formData.stability}`}
//                   min={0}
//                   max={1}
//                   step={0.01}
//                   value={formData.stability}
//                   onChange={handleInput}
//                   error={errors.stability}
//                 />
//                 <RangeInput
//                   id="similarityBoost"
//                   label={`Similarity Boost (0–1): ${formData.similarityBoost}`}
//                   min={0}
//                   max={1}
//                   step={0.01}
//                   value={formData.similarityBoost}
//                   onChange={handleInput}
//                   error={errors.similarityBoost}
//                 />
//               </div>
//             )}

//             {currentStep === 3 && (
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//                   <Select
//                     id="voice_provider"
//                     label="Voice Provider"
//                     value={formData.voice_provider}
//                     onChange={handleInput}
//                     error={errors.voice_provider}
//                     options={[
//                       { label: "ElevenLabs", value: "11labs" },
//                       { label: "Hume", value: "hume" },
//                       { label: "PlayHT", value: "playht" },
//                       { label: "Amazon Polly", value: "polly" },
//                       { label: "Other", value: "other" },
//                     ]}
//                   />
//                   <TextInput
//                     id="voice_model"
//                     label="Voice Model"
//                     value={formData.voice_model}
//                     onChange={handleInput}
//                     error={errors.voice_model}
//                     placeholder="e.g., eleven_monolingual_v1"
//                   />
//                   <Select
//                     id="voiceSet"
//                     label="Voice Set"
//                     value={formData.voiceSet}
//                     onChange={(e) => {
//                       handleStopVoice();
//                       setFormData((p) => ({ ...p, voiceSet: e.target.value, voice: "" }));
//                       setErrors((p) => ({ ...p, voice: "" }));
//                     }}
//                     options={[
//                       { label: "All Voices", value: "all" },
//                       { label: "Voice Set 1", value: "voiceset1" },
//                       { label: "Voice Set 2", value: "voiceset2" },
//                     ]}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                   {(formData.voiceSet === "voiceset1"
//                     ? allVoices.filter((v) => voiceset2.includes(v))
//                     : formData.voiceSet === "voiceset2"
//                     ? allVoices.filter((v) => voiceset3.includes(v))
//                     : allVoices
//                   ).map((voice) =>
//                     voice && voice.name ? (
//                       <div
//                         key={voice.name}
//                         className={`relative cursor-pointer rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md ${
//                           formData.voice === voice.name ? "border-gray-800 bg-gray-50" : "border-gray-300 hover:bg-gray-100"
//                         }`}
//                         style={{
//                           borderColor: formData.voice === voice.name ? colors.radioBorder : colors.border,
//                           backgroundColor: formData.voice === voice.name ? colors.hover : colors.card,
//                         }}
//                         onClick={() => {
//                           setFormData((p) => ({ ...p, voice: voice.name }));
//                           setErrors((p) => ({ ...p, voice: "" }));
//                         }}
//                       >
//                         {/* Radio bubble */}
//                         <div className="absolute left-3 top-3">
//                           <div
//                             className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
//                               formData.voice === voice.name ? "border-gray-800 bg-gray-800" : "border-gray-400"
//                             }`}
//                             style={{
//                               borderColor: formData.voice === voice.name ? colors.radioBorder : colors.border,
//                               backgroundColor: formData.voice === voice.name ? colors.radioSelected : "transparent",
//                             }}
//                           >
//                             {formData.voice === voice.name && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
//                           </div>
//                         </div>

//                         <div className="ml-8 flex items-center justify-between">
//                           <div>
//                             <div className="text-lg font-semibold" style={{ color: colors.text }}>
//                               {voice.showName || voice.name}
//                             </div>
//                             <div className="text-sm" style={{ color: colors.lightText }}>
//                               {voice.gender || "Unknown"}
//                             </div>
//                           </div>
//                           <div className="flex gap-3">
//                             <button
//                               type="button"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handlePlayVoice(voice.audioSr || "");
//                               }}
//                               disabled={isAudioPlaying && formData.voice !== voice.name}
//                               className="rounded-full p-2.5 transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
//                               style={{ backgroundColor: colors.secondary, color: "white" }}
//                               title="Play preview"
//                             >
//                               ▶
//                             </button>
//                             <button
//                               type="button"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleStopVoice();
//                               }}
//                               disabled={!isAudioPlaying || formData.voice !== voice.name}
//                               className="rounded-full p-2.5 transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
//                               style={{ backgroundColor: colors.danger, color: "white" }}
//                               title="Stop"
//                             >
//                               ■
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ) : null
//                   )}
//                 </div>
//                 {errors.voice && <ErrorText>{errors.voice}</ErrorText>}
//               </div>
//             )}

//             <div className="mt-8 flex justify-between">
//               {currentStep > 1 ? (
//                 <button
//                   type="button"
//                   onClick={() => handleStepChange(currentStep - 1)}
//                   className="rounded-lg px-4 py-2 font-semibold transition-colors hover:bg-gray-300"
//                   style={{ backgroundColor: colors.border, color: colors.text }}
//                 >
//                   Back
//                 </button>
//               ) : (
//                 <span />
//               )}

//               {currentStep < 3 ? (
//                 <button
//                   type="button"
//                   onClick={() => handleStepChange(currentStep + 1)}
//                   className="ml-auto rounded-lg px-4 py-2 font-semibold transition-colors hover:bg-indigo-700"
//                   style={{ backgroundColor: colors.primary, color: "white" }}
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="rounded-lg px-4 py-2 font-semibold transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
//                   style={{ backgroundColor: colors.primary, color: "white" }}
//                 >
//                   {isSubmitting ? "Creating..." : "Create Assistant"}
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ---------------- Small UI primitives ---------------- */
// function StepButton({ active, onClick, children }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`cursor-pointer rounded-lg px-4 py-2 font-semibold transition-colors ${
//         active ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// function Label({ children }) {
//   return (
//     <label className="mb-2 block text-sm font-semibold" style={{ color: colors.text }}>
//       {children}
//     </label>
//   );
// }

// function ErrorText({ children }) {
//   return (
//     <p className="mt-2 flex items-center gap-1 text-sm" style={{ color: colors.danger }}>
//       {children}
//     </p>
//   );
// }

// function TextInput({ id, label, value, onChange, error, placeholder }) {
//   return (
//     <div className="mb-2">
//       <Label>{label}</Label>
//       <input
//         id={id}
//         type="text"
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full rounded-lg border p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
//         style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
//       />
//       {error && <ErrorText>{error}</ErrorText>}
//     </div>
//   );
// }

// function NumberInput({ id, label, value, onChange, error, min, max, step }) {
//   return (
//     <div className="mb-2">
//       <Label>{label}</Label>
//       <input
//         id={id}
//         type="number"
//         value={value}
//         onChange={onChange}
//         min={min}
//         max={max}
//         step={step || 1}
//         className="w-full rounded-lg border p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
//         style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
//       />
//       {error && <ErrorText>{error}</ErrorText>}
//     </div>
//   );
// }

// function RangeInput({ id, label, value, onChange, min, max, step, error }) {
//   return (
//     <div className="mb-2">
//       <Label>{label}</Label>
//       <input
//         id={id}
//         type="range"
//         min={min}
//         max={max}
//         step={step}
//         value={value}
//         onChange={onChange}
//         className="w-full"
//       />
//       {error && <ErrorText>{error}</ErrorText>}
//     </div>
//   );
// }

// function Select({ id, label, value, onChange, options, error }) {
//   return (
//     <div className="mb-2">
//       <Label>{label}</Label>
//       <select
//         id={id}
//         value={value}
//         onChange={onChange}
//         className="w-full rounded-lg border p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
//         style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
//       >
//         <option value="">Select…</option>
//         {options.map((o) => (
//           <option key={o.value} value={o.value}>
//             {o.label}
//           </option>
//         ))}
//       </select>
//       {error && <ErrorText>{error}</ErrorText>}
//     </div>
//   );
// }

// function Textarea({ id, value, onChange, placeholder, rows = 4 }) {
//   return (
//     <textarea
//       id={id}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       rows={rows}
//       className="w-full rounded-lg border p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
//       style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
//     />
//   );
// }

// function Checkbox({ id, label, checked, onChange }) {
//   return (
//     <label className="flex cursor-pointer items-center gap-2">
//       <input id={id} type="checkbox" checked={checked} onChange={onChange} />
//       <span>{label}</span>
//     </label>
//   );
// }

// function ChipInput({ label, placeholder, value, onChange, onAdd, items, onRemove }) {
//   return (
//     <div>
//       <Label>{label}</Label>
//       <div className="flex gap-2">
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={placeholder}
//           className="w-full rounded-lg border p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
//           style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
//         />
//         <button
//           type="button"
//           onClick={onAdd}
//           className="rounded-lg px-4 py-2 font-semibold transition-colors hover:bg-indigo-700"
//           style={{ backgroundColor: colors.primary, color: "white" }}
//         >
//           Add
//         </button>
//       </div>
//       {!!items?.length && (
//         <div className="mt-2 flex flex-wrap gap-2">
//           {items.map((x, i) => (
//             <span
//               key={`${x}-${i}`}
//               className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
//               style={{ borderColor: colors.border, backgroundColor: colors.hover }}
//             >
//               {String(x)}
//               <button
//                 type="button"
//                 className="rounded-full bg-red-500 px-2 text-white"
//                 onClick={() => onRemove(i)}
//                 title="Remove"
//               >
//                 ×
//               </button>
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default CreateAssistant;









// all updated with deepgram voices


"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Volume2,
  Play,
  Square,
  Loader2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// 🔊 Voice catalogs (from your data file)
import { deepgramVoices, openAIVoices } from "../../helpers/data.js";

/** Color palette (light) */
const colors = {
  primary: "#FFFFFF",
  secondary: "#2563EB",
  danger: "#EF4444",
  text: "#0F172A",
  lightText: "#64748B",
  border: "#E2E8F0",
  background: "#F8FAFC",
  card: "#ffffffff",
  hover: "#F1F5F9",
  radioSelected: "#1D4ED8",
  radioBorder: "#CBD5E1",
};

// E.164 phone validator
const E164 = /^\+\d{7,15}$/;

// ✅ Steps (includes Review to block premature submit)
const STEPS = [
  { id: 1, key: "core", label: "Core & Transcription", Icon: BrainCircuit },
  { id: 2, key: "voice", label: "Voice", Icon: Volume2 },
  { id: 3, key: "review", label: "Review & Create", Icon: Sparkles },
];

// Filter constants
const PROVIDER_OPTIONS = [
  { label: "Deepgram (Aura)", value: "deepgram" },
  { label: "OpenAI (TTS)", value: "openai" },
];

const GENDER_OPTIONS = [
  { label: "All voices", value: "all" },
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
];

export default function CreateAssistant() {
  const navigate = useNavigate();

  // ---------- UI ----------
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioInstance = useRef(null);

  // 🔒 Must explicitly click a voice card
  const [voiceTouched, setVoiceTouched] = useState(false);

  // ---------- Filters for Step 2 ----------
  const [genderFilter, setGenderFilter] = useState("all");

  // ---------- Form ----------
  const [formData, setFormData] = useState({
    // Step 1 — core & transcription
    name: "",
    provider: "openai",
    model: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 250,
    systemPrompt: "",
    first_message: "",
    transcribe_provider: "google",
    transcribe_language: "English",
    transcribe_model: "gemini-2.0-flash",
    forwardingPhoneNumber: "",
    attached_Number: "",
    category: "",
    draft: false,
    assistant_toggle: true,

    // Knowledge & tuning
    knowledgeBase: [],
    leadsfile: [],
    languages: [],
    endCallPhrases: [],
    speed: 0.8,
    stability: 0.5,
    similarityBoost: 0.75,

    // Step 2 — voice
    voice_provider: "deepgram", // user-chosen provider
    voice_model: "",            // auto-filled from voice card (aura-*, gpt-4o-mini-tts)
    voice: "",                  // short key (asteria/nova/etc.)
  });

  const [errors, setErrors] = useState({});

  // Purchased numbers for dropdown
  const [numbers, setNumbers] = useState([]); // [{phone_number, friendly_name}]
  const [numbersLoading, setNumbersLoading] = useState(false);
  const [numbersError, setNumbersError] = useState("");

  // Build the list based on provider + gender filters
  const currentVoiceList = useMemo(() => {
    const pool = formData.voice_provider === "openai" ? openAIVoices : deepgramVoices;
    const filtered =
      genderFilter === "all" ? pool : pool.filter((v) => v.gender === genderFilter);
    return filtered
      .slice()
      .sort((a, b) => (a?.showName || "").localeCompare(b?.showName || ""));
  }, [formData.voice_provider, genderFilter]);

  // Auto-fill model ID when a voice is selected
  useEffect(() => {
    if (!formData.voice) return;
    const selected = currentVoiceList.find((v) => v?.name === formData.voice);
    if (selected?.voice) {
      setFormData((p) => ({
        ...p,
        voice_model: selected.voice, // e.g., aura-asteria-en OR gpt-4o-mini-tts
      }));
      setErrors((p) => ({ ...p, voice_model: "" }));
    }
  }, [formData.voice, currentVoiceList]);

  // Helpers
  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

  const handleInput = (e) => {
    const { id, value, type, checked } = e.target;
    const next = type === "checkbox" ? checked : value;
    setFormData((p) => ({ ...p, [id]: next }));
    setErrors((p) => ({ ...p, [id]: "" }));
  };

  const handlePlayVoice = (audioSr) => {
    try {
      if (audioInstance.current) {
        audioInstance.current.pause();
        audioInstance.current = null;
      }
      const a = new Audio(audioSr);
      audioInstance.current = a;
      setIsAudioPlaying(true);
      a.play().catch(() => {
        toast.error("Failed to play voice preview");
        setIsAudioPlaying(false);
        audioInstance.current = null;
      });
      a.onended = () => {
        setIsAudioPlaying(false);
        audioInstance.current = null;
      };
    } catch {
      toast.error("Failed to play voice preview");
      setIsAudioPlaying(false);
    }
  };

  const handleStopVoice = () => {
    if (audioInstance.current) {
      audioInstance.current.pause();
      audioInstance.current = null;
      setIsAudioPlaying(false);
    }
  };

  // Step change guard (can't jump to Review without confirmed voice)
  const handleStepChange = (step) => {
    if (step === currentStep) return;
    if (step === 3 && (!formData.voice || !voiceTouched)) {
      setErrors((p) => ({ ...p, voice: "Select a voice and press Next to continue" }));
      toast.error("Please select a voice and press Next to continue.");
      return;
    }
    handleStopVoice();
    setCurrentStep(step);
  };

  // Footer Next logic
  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      if (!formData.voice) {
        setErrors((p) => ({ ...p, voice: "Please select a voice" }));
        toast.error("Select a voice to continue.");
        return;
      }
      if (!voiceTouched) {
        setErrors((p) => ({ ...p, voice: "Click a voice card to confirm your choice" }));
        toast.info("Click a voice card to confirm your choice.");
        return;
      }
      setCurrentStep(3);
    }
  };

  // -------- Fetch purchased numbers for dropdown --------
  const fetchPurchasedNumbers = async () => {
    setNumbersLoading(true);
    setNumbersError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/purchased_numbers`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.purchased_numbers || [];
      const normalized = list
        .filter(Boolean)
        .map((x) => ({
          phone_number: x?.phone_number || "",
          friendly_name: x?.friendly_name || "",
          attached_assistant: x?.attached_assistant ?? null,
        }))
        .filter((x) => x.phone_number);
      setNumbers(normalized);
    } catch (err) {
      console.error(err);
      setNumbersError("Failed to load your purchased numbers");
      setNumbers([]);
    } finally {
      setNumbersLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedNumbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validation (still used on submit)
  const validate = () => {
    const req = [
      "name",
      "provider",
      "model",
      "temperature",
      "maxTokens",
      "transcribe_provider",
      "transcribe_language",
      "transcribe_model",
      "voice_provider",
      "voice_model",
      "voice",
    ];

    const nErr = {};
    let ok = true;

    req.forEach((k) => {
      const v = formData[k];
      if (v === null || v === undefined || v === "" || Number.isNaN(v)) {
        nErr[k] = "Required";
        ok = false;
      }
    });

    if (formData.temperature < 0 || formData.temperature > 2) {
      nErr.temperature = "Temperature must be between 0 and 2";
      ok = false;
    }
    if (formData.maxTokens < 1) {
      nErr.maxTokens = "maxTokens must be a positive integer";
      ok = false;
    }

    if (formData.forwardingPhoneNumber && !E164.test(formData.forwardingPhoneNumber)) {
      nErr.forwardingPhoneNumber = "Must be E.164 (+123...)";
      ok = false;
    }
    if (formData.attached_Number && !E164.test(formData.attached_Number)) {
      nErr.attached_Number = "Invalid number format";
      ok = false;
    }

    setErrors(nErr);

    // Move to first step containing an error
    if (!ok) {
      const hasErr = (keys) => keys.some((k) => nErr[k]);
      const step1 = [
        "name",
        "provider",
        "model",
        "temperature",
        "maxTokens",
        "systemPrompt",
        "first_message",
        "transcribe_provider",
        "transcribe_language",
        "transcribe_model",
        "forwardingPhoneNumber",
        "attached_Number",
        "category",
      ];
      const step2 = ["voice_provider", "voice_model", "voice"];
      if (hasErr(step1)) setCurrentStep(1);
      else if (hasErr(step2)) setCurrentStep(2);
    }

    return ok;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 🔐 Only allow submit on Review step
    if (currentStep !== 3) {
      toast.error("Please complete the steps first.");
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    handleStopVoice();

    try {
      const token = localStorage.getItem("token");
      const endpoint = `${API_URL}/api/assistants`;

      const payload = {
        name: formData.name,
        provider: formData.provider,
        first_message: formData.first_message || null,
        model: formData.model,
        systemPrompt: formData.systemPrompt || null,
        knowledgeBase: formData.knowledgeBase,
        leadsfile: formData.leadsfile,
        temperature: Number(formData.temperature),
        maxTokens: Number(formData.maxTokens),
        transcribe_provider: formData.transcribe_provider,
        transcribe_language: formData.transcribe_language,
        transcribe_model: formData.transcribe_model,
        languages: formData.languages,
        forwardingPhoneNumber: formData.forwardingPhoneNumber || null,
        endCallPhrases: formData.endCallPhrases,

        // 🔊 TTS
        voice_provider: formData.voice_provider, // "deepgram" | "openai"
        voice: formData.voice,                   // e.g., "asteria" | "nova"
        voice_model: formData.voice_model,       // e.g., "aura-asteria-en" | "gpt-4o-mini-tts"

        attached_Number: formData.attached_Number || null,
        draft: Boolean(formData.draft),
        assistant_toggle: Boolean(formData.assistant_toggle),
        category: formData.category || null,
        speed: Number(formData.speed),
        stability: Number(formData.stability),
        similarityBoost: Number(formData.similarityBoost),
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          if (j?.detail) msg = j.detail;
        } catch {
          const t = await res.text();
          if (t) msg = `${msg} — ${t}`;
        }
        throw new Error(msg);
      }

      toast.success("Assistant created successfully!");
      navigate("/user/callassistent");
    } catch (err) {
      toast.error(err?.message || "Failed to create assistant");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset confirmation if provider changes
  useEffect(() => {
    setVoiceTouched(false);
    // clear selected voice on provider change
    setFormData((p) => ({ ...p, voice: "", voice_model: "" }));
  }, [formData.voice_provider]);

  // ---------- Render ----------
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: colors.background }}>
      {/* Soft animated background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="animate-[gradient_16s_ease_infinite] absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 20%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(50% 50% at 80% 20%, rgba(14,165,233,0.12) 0%, transparent 60%), radial-gradient(50% 50% at 50% 80%, rgba(99,102,241,0.12) 0%, transparent 60%)",
          }}
        />
      </div>

      <style>{`
        @keyframes gradient { 0%{transform:translateY(0)} 50%{transform:translateY(-12px)} 100%{transform:translateY(0)} }
        @keyframes eqbar { 0%{height:20%} 50%{height:90%} 100%{height:20%} }
      `}</style>

      <div className="mx-auto w-full max-w-[2000px] px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-2xl border shadow-sm backdrop-blur-xl"
          style={{ borderColor: colors.border, backgroundColor: colors.card }}
        >
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-300/30 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-8 translate-y-8 rounded-full bg-sky-300/30 blur-2xl" />
            <div className="relative p-6 text-center">
              <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-slate-900">
                <Sparkles className="h-7 w-7 text-blue-600" /> Create New Assistant
              </h1>
              <p className="mt-2 text-sm text-slate-600">Polished UX · Animated · Modern</p>
            </div>
          </div>
        </motion.div>

        {/* Icon Stepper */}
        <Stepper currentStep={currentStep} onChange={handleStepChange} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border p-6 shadow-lg backdrop-blur-xl"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <form onSubmit={onSubmit} noValidate>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  <TextInput
                    id="name"
                    label="Assistant Name"
                    value={formData.name}
                    onChange={handleInput}
                    error={errors.name}
                    placeholder="SupportBot"
                  />

                  <TextInput
                    id="forwardingPhoneNumber"
                    label="Forwarding Phone Number (optional, E.164)"
                    value={formData.forwardingPhoneNumber}
                    onChange={handleInput}
                    error={errors.forwardingPhoneNumber}
                    placeholder="+12345678901"
                  />

                  {/* Attached number dropdown */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between">
                      <Label>Attach Purchased Number (optional)</Label>
                      <button
                        type="button"
                        onClick={fetchPurchasedNumbers}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        disabled={numbersLoading}
                        title="Refresh"
                      >
                        {numbersLoading ? "Loading..." : "Refresh"}
                      </button>
                    </div>
                    <select
                      id="attached_Number"
                      value={formData.attached_Number}
                      onChange={handleInput}
                      disabled={numbersLoading || !numbers.length}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-blue-500"
                    >
                      <option value="" className="bg-white">
                        {numbersLoading
                          ? "Loading numbers..."
                          : numbers.length
                          ? "Do not attach"
                          : "No purchased numbers found"}
                      </option>
                      {numbers.map((n) => (
                        <option key={n.phone_number} value={n.phone_number} className="bg-white">
                          {n.friendly_name ? `${n.friendly_name} — ${n.phone_number}` : n.phone_number}
                        </option>
                      ))}
                    </select>
                    {numbersError && <ErrorText>{numbersError}</ErrorText>}
                    {errors.attached_Number && <ErrorText>{errors.attached_Number}</ErrorText>}
                  </div>

                  <TextInput
                    id="category"
                    label="Category (optional)"
                    value={formData.category}
                    onChange={handleInput}
                  />

                  <div className="md:col-span-2">
                    <Label>System Prompt</Label>
                    <Textarea
                      id="systemPrompt"
                      value={formData.systemPrompt}
                      onChange={handleInput}
                      placeholder="Write your system prompt…"
                      rows={4}
                    />
                    {errors.systemPrompt && <ErrorText>{errors.systemPrompt}</ErrorText>}
                  </div>

                  <div className="md:col-span-2">
                    <Label>First Message</Label>
                    <Textarea
                      id="first_message"
                      value={formData.first_message}
                      onChange={handleInput}
                      placeholder="Hello! …"
                      rows={3}
                    />
                    {errors.first_message && <ErrorText>{errors.first_message}</ErrorText>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <Checkbox id="draft" label="Save as Draft" checked={formData.draft} onChange={handleInput} />
                    <Checkbox
                      id="assistant_toggle"
                      label="Enable Assistant Immediately"
                      checked={formData.assistant_toggle}
                      onChange={handleInput}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Provider + Gender + Voice Model (read-only) */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Provider */}
                    <Select
                      id="voice_provider"
                      label="Voice Provider"
                      value={formData.voice_provider}
                      onChange={(e) => {
                        handleStopVoice();
                        const provider = e.target.value;
                        setFormData((p) => ({
                          ...p,
                          voice_provider: provider,
                          voice: "",
                          voice_model: "",
                        }));
                        setVoiceTouched(false);
                        setErrors((p) => ({ ...p, voice: "", voice_model: "" }));
                      }}
                      options={PROVIDER_OPTIONS}
                      error={errors.voice_provider}
                    />

                    {/* Gender filter */}
                    <Select
                      id="genderFilter"
                      label="Gender"
                      value={genderFilter}
                      onChange={(e) => {
                        handleStopVoice();
                        setGenderFilter(e.target.value);
                        setVoiceTouched(false);
                        // keep selection but require new confirm if list changes
                      }}
                      options={GENDER_OPTIONS}
                    />

                    {/* Model (auto-filled, locked) */}
                    <TextInput
                      id="voice_model"
                      label="Voice Model"
                      value={formData.voice_model}
                      onChange={() => {}}
                      error={errors.voice_model}
                      placeholder={
                        formData.voice_provider === "deepgram" ? "aura-*-en" : "gpt-4o-mini-tts"
                      }
                      readOnly
                    />
                  </div>

                  {/* Info */}
                  {!voiceTouched && (
                    <p className="text-sm text-slate-600">
                      Tip: <span className="font-medium">Click a voice card</span> to confirm your choice, then press{" "}
                      <span className="font-medium">Next</span>.
                    </p>
                  )}

                  {/* Voice grid */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      Showing <span className="font-medium">{currentVoiceList.length}</span> voices
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {currentVoiceList.length === 0 && (
                      <div className="col-span-full rounded-xl border p-6 text-center text-slate-600" style={{ borderColor: colors.border }}>
                        No voices match this filter.
                      </div>
                    )}

                    {currentVoiceList.map((voice) => (
                      <motion.div
                        key={`${voice.provider}-${voice.name}`}
                        whileHover={{ scale: 1.02 }}
                        className="relative cursor-pointer rounded-xl border p-5 shadow-sm backdrop-blur-md transition-all"
                        style={{
                          borderColor: formData.voice === voice.name ? "#93c5fd" : colors.border,
                          backgroundColor: formData.voice === voice.name ? "#eff6ff" : colors.card,
                        }}
                        onClick={() => {
                          setFormData((p) => ({
                            ...p,
                            voice: voice.name,
                            voice_model: voice.voice,
                            voice_provider: voice.provider || formData.voice_provider,
                          }));
                          setVoiceTouched(true);
                          setErrors((p) => ({ ...p, voice: "", voice_model: "" }));
                        }}
                      >
                        <div className="absolute left-3 top-3">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              formData.voice === voice.name ? "border-blue-500 bg-blue-500" : "border-slate-400 bg-transparent"
                            }`}
                          />
                        </div>
                        <div className="ml-8 flex items-center justify-between">
                          <div>
                            <div className="text-lg font-semibold text-slate-900">
                              {voice.showName || voice.name}
                            </div>
                            <div className="text-sm text-slate-600 capitalize">
                              {voice.gender || "unknown"} • {voice.provider}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">{voice.voice}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <PlayButton
                              isActive={isAudioPlaying && formData.voice === voice.name}
                              onPlay={() => handlePlayVoice(voice.audioSr || "")}
                              onStop={handleStopVoice}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {errors.voice && <ErrorText>{errors.voice}</ErrorText>}
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="rounded-xl border p-5" style={{ borderColor: colors.border }}>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900">Review</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <ReviewRow label="Name" value={formData.name || "—"} />
                      <ReviewRow label="Model" value={`${formData.provider} · ${formData.model}`} />
                      <ReviewRow label="Voice Provider" value={formData.voice_provider} />
                      <ReviewRow label="Voice" value={formData.voice || "—"} />
                      <ReviewRow label="Voice Model" value={formData.voice_model || "—"} />
                      <ReviewRow label="Forwarding Number" value={formData.forwardingPhoneNumber || "—"} />
                      <ReviewRow label="Attach Number" value={formData.attached_Number || "—"} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <GhostButton onClick={() => setCurrentStep(2)}>Edit Voice</GhostButton>
                      <GhostButton onClick={() => setCurrentStep(1)}>Edit Core</GhostButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer actions */}
            <div className="mt-8 flex items-center justify-between">
              {currentStep > 1 ? (
                <GhostButton onClick={() => handleStepChange(currentStep - 1)}>Back</GhostButton>
              ) : (
                <span />
              )}

              {currentStep < 3 ? (
                <PrimaryButton onClick={handleNext}>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </PrimaryButton>
              ) : (
                <PrimaryButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                    </span>
                  ) : (
                    "Create Assistant"
                  )}
                </PrimaryButton>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */
function Stepper({ currentStep, onChange }) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {STEPS.map(({ id, label, Icon }) => {
          const active = currentStep === id;
          return (
            <motion.button
              key={id}
              onClick={() => onChange(id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative flex items-center gap-3 rounded-xl border px-4 py-3 ${
                active ? "border-blue-500/40 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className={`grid h-10 w-10 place-items-center rounded-lg ${active ? "bg-blue-100" : "bg-slate-100"}`}>
                <Icon className={`h-5 w-5 ${active ? "text-blue-600" : "text-slate-600"}`} />
              </div>
              <div className="text-left">
                <div className={`text-sm font-semibold ${active ? "text-slate-900" : "text-slate-700"}`}>{label}</div>
                <div className={`text-xs ${active ? "text-blue-600" : "text-slate-500"}`}>{active ? "Active" : "Click to open"}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
      {/* Fuller progress bar on wide screens */}
      <div className="mx-auto mt-4 h-1 w-full max-w-5xl rounded-full bg-slate-200">
        <div
          className="h-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
          style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

function PrimaryButton({ children, onClick, type = "button", disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition ${
        disabled ? "bg-blue-400/60" : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

function Label({ children }) {
  return <label className="mb-2 block text-sm font-semibold text-slate-700">{children}</label>;
}

function ErrorText({ children }) {
  return <p className="mt-2 flex items-center gap-1 text-sm text-red-600">{children}</p>;
}

function TextInput({ id, label, value, onChange, error, placeholder, readOnly = false, disabled = false }) {
  return (
    <div className="mb-2">
      <Label>{label}</Label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        className={`w-full rounded-xl border bg-white p-3 text-slate-900 placeholder-slate-400 outline-none ring-0 transition focus:border-blue-500 ${
          disabled ? "opacity-60" : "border-slate-300"
        } ${readOnly ? "bg-slate-50" : ""}`}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function Select({ id, label, value, onChange, options, error }) {
  return (
    <div className="mb-2">
      <Label>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-white">
            {o.label}
          </option>
        ))}
      </select>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function Textarea({ id, value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500"
    />
  );
}

function Checkbox({ id, label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-slate-800">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="accent-blue-600" />
      <span>{label}</span>
    </label>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="rounded-lg border bg-white p-3 text-sm" style={{ borderColor: colors.border }}>
      <div className="text-slate-500">{label}</div>
      <div className="mt-0.5 font-medium text-slate-900">{value}</div>
    </div>
  );
}

// Fancy Play/Stop with equalizer
function PlayButton({ isActive, onPlay, onStop }) {
  return (
    <div className="flex items-center gap-2">
      {!isActive ? (
        <button
          type="button"
          onClick={onPlay}
          className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200 transition hover:brightness-110"
          title="Play preview"
        >
          <Play className="h-5 w-5" />
        </button>
      ) : (
        <>
          <div className="flex h-10 items-end gap-1">
            {[0, 150, 300].map((d, i) => (
              <div key={i} className="w-1.5 rounded-sm bg-blue-500" style={{ animation: `eqbar 0.9s ${d}ms ease-in-out infinite` }} />
            ))}
          </div>
          <button
            type="button"
            onClick={onStop}
            className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-lg shadow-rose-200 transition hover:brightness-110"
            title="Stop"
          >
            <Square className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
