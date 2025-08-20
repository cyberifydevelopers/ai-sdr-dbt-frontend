// // src/pages/ProfileSection.jsx
// "use client";

// import { useEffect, useMemo, useRef, useState, useCallback } from "react";
// import Cropper from "react-easy-crop";
// import {
//   Camera,
//   Trash2,
//   CheckCircle2,
//   Loader2,
//   RefreshCcw,
//   UserRound,
//   SkipForward,
//   RotateCcw,
//   Check,
//   Crop as CropIcon,
//   X,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
// const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
// const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// function cx(...arr) {
//   return arr.filter(Boolean).join(" ");
// }

// /** canvas helper: returns Blob of cropped area */
// async function getCroppedBlob(imageSrc, crop, rotation = 0) {
//   const createImage = (url) =>
//     new Promise((resolve, reject) => {
//       const img = new Image();
//       img.addEventListener("load", () => resolve(img));
//       img.addEventListener("error", (e) => reject(e));
//       img.crossOrigin = "anonymous";
//       img.src = url;
//     });

//   const image = await createImage(imageSrc);
//   const radians = (rotation * Math.PI) / 180;

//   const naturalW = image.naturalWidth;
//   const naturalH = image.naturalHeight;

//   // rotate image onto an offscreen canvas
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   const sin = Math.abs(Math.sin(radians));
//   const cos = Math.abs(Math.cos(radians));
//   const bW = naturalW * cos + naturalH * sin;
//   const bH = naturalW * sin + naturalH * cos;

//   canvas.width = bW;
//   canvas.height = bH;

//   ctx.translate(bW / 2, bH / 2);
//   ctx.rotate(radians);
//   ctx.drawImage(image, -naturalW / 2, -naturalH / 2);

//   // crop from rotated canvas
//   const data = ctx.getImageData(crop.x, crop.y, crop.width, crop.height);

//   // output square canvas
//   const out = document.createElement("canvas");
//   out.width = crop.width;
//   out.height = crop.height;

//   const octx = out.getContext("2d");
//   octx.putImageData(data, 0, 0);

//   return new Promise((resolve) => {
//     out.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
//   });
// }

// export default function ProfileSection() {
//   const navigate = useNavigate();

//   const [currentPhoto, setCurrentPhoto] = useState(null);  // ABSOLUTE URL from /user-info
//   const [preview, setPreview] = useState(null);            // local/server preview (selected or current)
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState({
//     init: true,
//     saving: false,
//     delete: false,
//     refresh: false,
//   });
//   const [user, setUser] = useState({ name: "", email: "" });

//   // cropper modal state
//   const [showCropper, setShowCropper] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [cropReady, setCropReady] = useState(false);

//   // small success pulse on ring after saving
//   const [pulse, setPulse] = useState(false);

//   const inputRef = useRef(null);

//   const initials = useMemo(() => {
//     const name = (user?.name || localStorage.getItem("name") || "User").trim();
//     return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
//   }, [user?.name]);

//   const roleNavigate = useCallback(() => {
//     const role = (localStorage.getItem("role") || "").toLowerCase();
//     if (role === "user") return navigate("/user/dashboard", { replace: true });
//     if (role === "admin") return navigate("/admin/dashboard", { replace: true });
//     return navigate("/dashboard", { replace: true });
//   }, [navigate]);

//   // lock body scroll when modal open
//   useEffect(() => {
//     if (showCropper) {
//       const prev = document.body.style.overflow;
//       document.body.style.overflow = "hidden";
//       return () => {
//         document.body.style.overflow = prev;
//       };
//     }
//   }, [showCropper]);

//   // Load user info, then check per-user completion lock
//   const fetchUser = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/api/user-info`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.detail || "Failed loading user");

//       const email = data?.data?.email || "";
//       setUser({ name: data?.data?.name, email });
//       setCurrentPhoto(data?.data?.profile_photo_url || null);
//       if (data?.data?.profile_photo_url && !preview) {
//         setPreview(data.data.profile_photo_url);
//       }

//       // Per-user lock (only after we know which user is logged in)
//       if (email) {
//         const key = `profileComplete:${email.toLowerCase()}`;
//         if (localStorage.getItem(key) === "1") {
//           roleNavigate();
//           return;
//         }
//       }
//     } catch (e) {
//       toast.error(e.message || "Could not load profile info");
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       setLoading((s) => ({ ...s, init: true }));
//       await fetchUser();
//       setLoading((s) => ({ ...s, init: false }));
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // File selection
//   const validateAndStageFile = (f) => {
//     if (!f) return;
//     if (!ACCEPTED_TYPES.includes(f.type)) {
//       toast.error("Only PNG, JPEG or WEBP images are allowed.");
//       return;
//     }
//     if (f.size > MAX_SIZE) {
//       toast.error("Image too large. Max allowed is 5 MB.");
//       return;
//     }
//     if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);

//     setFile(f);
//     const url = URL.createObjectURL(f);
//     setPreview(url);
//     setShowCropper(false); // open modal only when user clicks "Crop"
//   };

//   const onInputChange = (e) => {
//     const f = e.target.files?.[0];
//     validateAndStageFile(f);
//   };

//   // drag & drop onto ring
//   const onRingDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const f = e.dataTransfer.files?.[0];
//     validateAndStageFile(f);
//   };
//   const onRingDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const onCropComplete = useCallback((_, croppedPixels) => {
//     setCroppedAreaPixels(croppedPixels);
//     setCropReady(true);
//   }, []);

//   // Apply crop & upload (from modal)
//   const applyCropAndSave = async () => {
//     if (!preview && !currentPhoto) {
//       toast.info("Choose an image first.");
//       return;
//     }
//     if (!cropReady || !croppedAreaPixels) {
//       toast.info("Adjust the crop a tiny bit, then save.");
//       return;
//     }
//     try {
//       setLoading((s) => ({ ...s, saving: true }));

//       const source = preview || currentPhoto;
//       const blob = await getCroppedBlob(source, croppedAreaPixels, rotation);

//       // update ring instantly with cropped preview
//       const croppedUrl = URL.createObjectURL(blob);
//       if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
//       setPreview(croppedUrl);

//       const token = localStorage.getItem("token");
//       const fd = new FormData();
//       const filename = `avatar_${Date.now()}.jpg`;
//       fd.append("file", blob, filename);

//       const res = await fetch(`${API_URL}/api/profile-photo`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: fd,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.detail || "Save failed");

//       // Persisted URL from server
//       setCurrentPhoto(data?.photo_url || null);
//       setShowCropper(false);
//       setFile(null);
//       setCropReady(false);
//       setPulse(true);
//       setTimeout(() => setPulse(false), 1400);
//       toast.success("Profile photo saved!");
//     } catch (e) {
//       toast.error(e.message || "Could not save the cropped photo");
//     } finally {
//       setLoading((s) => ({ ...s, saving: false }));
//     }
//   };

//   // Delete
//   const deletePhoto = async () => {
//     if (!currentPhoto) {
//       toast.info("No profile photo to delete.");
//       return;
//     }
//     try {
//       setLoading((s) => ({ ...s, delete: true }));
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/api/profile-photo`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.detail || "Delete failed");

//       if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
//       setCurrentPhoto(null);
//       setPreview(null);
//       setFile(null);
//       toast.success("Profile photo deleted.");
//     } catch (e) {
//       toast.error(e.message || "Delete error");
//     } finally {
//       setLoading((s) => ({ ...s, delete: false }));
//     }
//   };

//   // Refresh
//   const refresh = async () => {
//     setLoading((s) => ({ ...s, refresh: true }));
//     await fetchUser();
//     setLoading((s) => ({ ...s, refresh: false }));
//   };

//   // Confirm/Skip — lock future access (per-user) and navigate
//   const completeAndGo = () => {
//     const email = (user?.email || "").toLowerCase();
//     if (email) {
//       localStorage.setItem(`profileComplete:${email}`, "1");
//     }
//     roleNavigate();
//   };

//   return (
//     <div className="min-h-[calc(100vh-4rem)] bg-white relative">
//       {/* Subtle top gradient accent */}
//       <div
//         className="absolute inset-x-0 top-0 h-44"
//         style={{
//           background:
//             "linear-gradient(180deg, rgba(59,130,246,0.18) 0%, rgba(255,255,255,0) 100%)",
//         }}
//       />

//       <div className="relative mx-auto max-w-5xl px-4 py-10">
//         {/* Header */}
//         <div className="flex items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
//               Profile Photo
//             </h1>
//             <p className="text-slate-500">
//               Click the ring to upload/replace. Use the Crop button to fine-tune your avatar.
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={refresh}
//               disabled={loading.refresh || loading.init}
//               className={cx(
//                 "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border transition",
//                 "border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
//               )}
//             >
//               {loading.refresh ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
//               Refresh
//             </button>
//             <button
//               onClick={completeAndGo}
//               className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
//             >
//               <Check className="h-4 w-4" />
//               Confirm
//             </button>
//             <button
//               onClick={completeAndGo}
//               className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
//             >
//               <SkipForward className="h-4 w-4" />
//               Skip for now
//             </button>
//           </div>
//         </div>

//         {/* Main card (ring + actions) */}
//         <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 md:p-8">
//           {/* soft glow under ring */}
//           <div className="relative flex flex-col items-center">
//             <div className="pointer-events-none absolute -top-6 h-24 w-48 rounded-full blur-2xl opacity-50"
//                  style={{background:"radial-gradient(50% 50% at 50% 50%, rgba(59,130,246,0.25) 0%, rgba(34,211,238,0.18) 60%, transparent 100%)"}}/>
//             {/* Avatar ring */}
//             <div
//               className={cx(
//                 "group relative h-40 w-40 rounded-full p-[3px] cursor-pointer select-none transition-transform duration-200",
//                 pulse ? "animate-pulse" : "hover:scale-[1.02]"
//               )}
//               onClick={() => inputRef.current?.click()}
//               onDrop={onRingDrop}
//               onDragOver={onRingDragOver}
//               style={{
//                 background:
//                   "conic-gradient(rgba(59,130,246,0.9), rgba(34,211,238,0.9), rgba(59,130,246,0.9))",
//               }}
//               title="Click to upload/replace"
//             >
//               <div className="rounded-full h-full w-full bg-white grid place-items-center">
//                 <div className="relative rounded-full h-[148px] w-[148px] overflow-hidden ring-2 ring-blue-500/30 shadow-md bg-slate-50 flex items-center justify-center">
//                   {loading.init ? (
//                     <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
//                   ) : preview || currentPhoto ? (
//                     <img
//                       src={preview || currentPhoto}
//                       alt="Profile"
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <div className="flex flex-col items-center justify-center">
//                       <UserRound className="h-10 w-10 text-slate-400" />
//                       <span className="mt-1 text-sm font-semibold text-slate-600">{initials}</span>
//                     </div>
//                   )}

//                   {/* Hover camera overlay */}
//                   <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
//                     <div className="rounded-full bg-white/90 p-2 shadow-md">
//                       <Camera className="h-5 w-5 text-blue-600" />
//                     </div>
//                     <span className="absolute bottom-2 text-xs text-white/90">Change photo</span>
//                   </div>
//                 </div>
//               </div>
//               {/* Hidden input */}
//               <input
//                 ref={inputRef}
//                 type="file"
//                 accept={ACCEPTED_TYPES.join(",")}
//                 className="hidden"
//                 onChange={onInputChange}
//               />
//             </div>

//             {/* Status chip */}
//             <div className="mt-3 bg-white border border-slate-200 px-2 py-1 rounded-full text-[11px] text-slate-600 shadow-sm flex items-center gap-1">
//               <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
//               {currentPhoto ? "Photo set" : "No photo yet"}
//             </div>

//             {/* Buttons under ring only */}
//             <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (!preview && !currentPhoto) {
//                     toast.info("Select or upload an image first.");
//                     return;
//                   }
//                   setRotation(0);
//                   setZoom(1);
//                   setCropReady(false);
//                   setShowCropper(true);
//                 }}
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition shadow-sm bg-blue-600 hover:bg-blue-700"
//               >
//                 <CropIcon className="h-4 w-4" />
//                 Crop
//               </button>

//               <button
//                 type="button"
//                 onClick={deletePhoto}
//                 disabled={loading.delete || !currentPhoto}
//                 className={cx(
//                   "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition",
//                   currentPhoto
//                     ? "border-rose-200 text-rose-600 hover:bg-rose-50"
//                     : "border-slate-200 text-slate-400 cursor-not-allowed"
//                 )}
//               >
//                 {loading.delete ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" /> Deleting…
//                   </>
//                 ) : (
//                   <>
//                     <Trash2 className="h-4 w-4" /> Delete Photo
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CROPPER MODAL (fixed, very high z-index, overflow hidden fix) */}
//       {showCropper && (preview || currentPhoto) && (
//         <div className="fixed inset-0 z-[10000] flex items-center justify-center">
//           {/* backdrop */}
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={() => setShowCropper(false)}
//           />
//           {/* dialog */}
//           <div className="relative z-[10001] w-full max-w-lg mx-4 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xl">
//             {/* header */}
//             <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
//               <div className="flex items-center gap-2">
//                 <CropIcon className="h-4 w-4 text-blue-600" />
//                 <h3 className="text-sm font-semibold text-slate-900">Crop your photo</h3>
//               </div>
//               <button
//                 onClick={() => setShowCropper(false)}
//                 className="p-1 rounded-md hover:bg-slate-100"
//               >
//                 <X className="h-4 w-4 text-slate-500" />
//               </button>
//             </div>

//             {/* body */}
//             <div className="bg-slate-900">
//               {/* overflow-hidden prevents image overlaying controls */}
//               <div className="relative h-[360px] overflow-hidden">
//                 <Cropper
//                   image={preview || currentPhoto}
//                   crop={crop}
//                   zoom={zoom}
//                   rotation={rotation}
//                   aspect={1}
//                   cropShape="round"
//                   showGrid={false}
//                   objectFit="contain"
//                   onCropChange={setCrop}
//                   onRotationChange={setRotation}
//                   onZoomChange={setZoom}
//                   onCropComplete={(a, b) => {
//                     setCroppedAreaPixels(b);
//                     setCropReady(true);
//                   }}
//                 />
//               </div>

//               {/* controls */}
//               <div className="relative border-t border-white/10 bg-slate-900/70 p-4 space-y-3">
//                 <div className="flex items-center gap-3">
//                   <label className="text-xs text-white/80 w-16">Zoom</label>
//                   <input
//                     type="range"
//                     min={1}
//                     max={3}
//                     step={0.01}
//                     value={zoom}
//                     onChange={(e) => setZoom(parseFloat(e.target.value))}
//                     className="w-full accent-blue-500"
//                   />
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <label className="text-xs text-white/80 w-16">Rotate</label>
//                   <input
//                     type="range"
//                     min={-180}
//                     max={180}
//                     step={1}
//                     value={rotation}
//                     onChange={(e) => setRotation(parseFloat(e.target.value))}
//                     className="w-full accent-blue-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setRotation(0)}
//                     className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-white bg-white/10 hover:bg-white/20"
//                   >
//                     <RotateCcw className="h-3.5 w-3.5" />
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* footer */}
//             <div className="flex items-center justify-end gap-2 px-5 py-3 bg-white">
//               <button
//                 type="button"
//                 onClick={() => setShowCropper(false)}
//                 className="px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={applyCropAndSave}
//                 disabled={loading.saving || !cropReady}
//                 className={cx(
//                   "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition shadow-sm",
//                   cropReady ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"
//                 )}
//               >
//                 {loading.saving ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" /> Saving…
//                   </>
//                 ) : (
//                   <>
//                     <Check className="h-4 w-4" /> Crop & Save
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

















// src/pages/ProfileSection.jsx
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Camera,
  Trash2,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  UserRound,
  SkipForward,
  RotateCcw,
  Check,
  Crop as CropIcon,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Try both mount styles transparently
const API_BASES = [`${API_URL}/api/auth`, `${API_URL}/api`];

function cx(...arr) {
  return arr.filter(Boolean).join(" ");
}

/** canvas helper: returns Blob of cropped area */
async function getCroppedBlob(imageSrc, crop, rotation = 0) {
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (e) => reject(e));
      img.crossOrigin = "anonymous";
      img.src = url;
    });

  const image = await createImage(imageSrc);
  const radians = (rotation * Math.PI) / 180;

  const naturalW = image.naturalWidth || image.width;
  const naturalH = image.naturalHeight || image.height;

  // rotate image onto an offscreen canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const bW = Math.floor(naturalW * cos + naturalH * sin);
  const bH = Math.floor(naturalW * sin + naturalH * cos);

  canvas.width = bW;
  canvas.height = bH;

  ctx.translate(bW / 2, bH / 2);
  ctx.rotate(radians);
  ctx.drawImage(image, -naturalW / 2, -naturalH / 2);

  // crop from rotated canvas using pixel coords from react-easy-crop
  const data = ctx.getImageData(Math.round(crop.x), Math.round(crop.y), Math.round(crop.width), Math.round(crop.height));

  // output square canvas
  const out = document.createElement("canvas");
  out.width = Math.round(crop.width);
  out.height = Math.round(crop.height);

  const octx = out.getContext("2d");
  octx.putImageData(data, 0, 0);

  return new Promise((resolve) => {
    out.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
  });
}

export default function ProfileSection() {
  const navigate = useNavigate();

  const [currentPhoto, setCurrentPhoto] = useState(null);  // ABSOLUTE URL from /user-info (with cache-bust)
  const [preview, setPreview] = useState(null);            // local/server preview (selected or current)
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState({
    init: true,
    saving: false,
    delete: false,
    refresh: false,
  });
  const [user, setUser] = useState({ name: "", email: "" });

  // cropper modal state
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropReady, setCropReady] = useState(false);

  // small success pulse on ring after saving
  const [pulse, setPulse] = useState(false);

  const inputRef = useRef(null);

  const token = () => localStorage.getItem("token") || "";
  const authHeaders = () => (token() ? { Authorization: `Bearer ${token()}` } : {});
  const ensureAuth = () => {
    if (!token()) {
      toast.error("Authentication required. Please login again.");
      navigate("/login");
      return false;
    }
    return true;
  };

  // resilient fetch: try /api/auth first, then /api
  const apiFetch = async (path, opts = {}, { expectJson = true } = {}) => {
    const errors = [];
    for (const base of API_BASES) {
      try {
        const res = await fetch(`${base}${path}`, opts);
        if (res.status === 401 || res.status === 403) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || "Unauthorized");
        }
        if (res.ok) return expectJson ? await res.json() : res;
        if (res.status === 404) { errors.push({ base, status: 404 }); continue; }
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || `Request failed (${res.status})`);
      } catch (e) {
        errors.push({ base, err: e?.message });
        if (e?.message === "Unauthorized") throw e;
      }
    }
    const msg = errors?.length
      ? `Request failed: ${errors.map((x) => `${x.base}→${x.status || x.err}`).join(" | ")}`
      : "Network error";
    throw new Error(msg);
  };

  const initials = useMemo(() => {
    const name = (user?.name || localStorage.getItem("name") || "User").trim();
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }, [user?.name]);

  const roleNavigate = useCallback(() => {
    const role = (localStorage.getItem("role") || "").toLowerCase();
    if (role === "user") return navigate("/user/dashboard", { replace: true });
    if (role === "admin") return navigate("/admin/dashboard", { replace: true });
    return navigate("/dashboard", { replace: true });
  }, [navigate]);

  // lock body scroll when modal open
  useEffect(() => {
    if (showCropper) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [showCropper]);

  // Load user info (with cache-bust on photo url)
  const fetchUser = async () => {
    if (!ensureAuth()) return;
    try {
      const data = await apiFetch("/user-info", {
        headers: { ...authHeaders(), Accept: "application/json" },
      });

      const email = data?.data?.email || "";
      setUser({ name: data?.data?.name, email });

      const abs = data?.data?.profile_photo_url || null;
      const busted = abs ? abs + (abs.includes("?") ? "&" : "?") + "t=" + Date.now() : null;
      setCurrentPhoto(busted);
      if (busted && !preview) setPreview(busted);

      // Per-user lock
      if (email) {
        const key = `profileComplete:${email.toLowerCase()}`;
        if (localStorage.getItem(key) === "1") {
          roleNavigate();
          return;
        }
      }
    } catch (e) {
      toast.error(e.message || "Could not load profile info");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading((s) => ({ ...s, init: true }));
      await fetchUser();
      setLoading((s) => ({ ...s, init: false }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // File selection
  const validateAndStageFile = (f) => {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) {
      toast.error("Only PNG, JPEG or WEBP images are allowed.");
      return;
    }
    if (f.size > MAX_SIZE) {
      toast.error("Image too large. Max allowed is 5 MB.");
      return;
    }
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setShowCropper(false); // open modal only when user clicks "Crop"
  };

  const onInputChange = (e) => {
    const f = e.target.files?.[0];
    validateAndStageFile(f);
  };

  // drag & drop onto ring
  const onRingDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    validateAndStageFile(f);
  };
  const onRingDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
    setCropReady(true);
  }, []);

  // Apply crop & upload (from modal)
  const applyCropAndSave = async () => {
    if (!preview && !currentPhoto) {
      toast.info("Choose an image first.");
      return;
    }
    if (!cropReady || !croppedAreaPixels) {
      toast.info("Adjust the crop a tiny bit, then save.");
      return;
    }
    try {
      setLoading((s) => ({ ...s, saving: true }));

      const source = preview || currentPhoto;
      const blob = await getCroppedBlob(source, croppedAreaPixels, rotation);

      // update ring instantly with cropped preview
      const croppedUrl = URL.createObjectURL(blob);
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      setPreview(croppedUrl);

      const fd = new FormData();
      const filename = `avatar_${Date.now()}.jpg`;
      fd.append("file", blob, filename);

      const data = await apiFetch("/profile-photo", {
        method: "POST",
        headers: { ...authHeaders() }, // don't set Content-Type manually
        body: fd,
      });

      // Persisted URL from server (add cache-bust)
      const u = data?.photo_url;
      const busted = u ? u + (u.includes("?") ? "&" : "?") + "t=" + Date.now() : null;
      setCurrentPhoto(busted);
      setShowCropper(false);
      setFile(null);
      setCropReady(false);
      setPulse(true);
      setTimeout(() => setPulse(false), 1400);
      toast.success("Profile photo saved!");
    } catch (e) {
      toast.error(e.message || "Could not save the cropped photo");
    } finally {
      setLoading((s) => ({ ...s, saving: false }));
    }
  };

  // Delete
  const deletePhoto = async () => {
    if (!currentPhoto) {
      toast.info("No profile photo to delete.");
      return;
    }
    try {
      setLoading((s) => ({ ...s, delete: true }));
      await apiFetch("/profile-photo", {
        method: "DELETE",
        headers: { ...authHeaders(), Accept: "application/json" },
      });

      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      setCurrentPhoto(null);
      setPreview(null);
      setFile(null);
      toast.success("Profile photo deleted.");
    } catch (e) {
      toast.error(e.message || "Delete error");
    } finally {
      setLoading((s) => ({ ...s, delete: false }));
    }
  };

  // Refresh
  const refresh = async () => {
    setLoading((s) => ({ ...s, refresh: true }));
    await fetchUser();
    setLoading((s) => ({ ...s, refresh: false }));
  };

  // Confirm/Skip — lock future access (per-user) and navigate
  const completeAndGo = () => {
    const email = (user?.email || "").toLowerCase();
    if (email) localStorage.setItem(`profileComplete:${email}`, "1");
    roleNavigate();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white relative">
      {/* Subtle top gradient accent */}
      <div
        className="absolute inset-x-0 top-0 h-44"
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.18) 0%, rgba(255,255,255,0) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Profile Photo
            </h1>
            <p className="text-slate-500">
              Click the ring to upload/replace. Use the Crop button to fine-tune your avatar.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={loading.refresh || loading.init}
              className={cx(
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border transition",
                "border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              )}
            >
              {loading.refresh ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Refresh
            </button>
            <button
              onClick={completeAndGo}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              <Check className="h-4 w-4" />
              Confirm
            </button>
            <button
              onClick={completeAndGo}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            >
              <SkipForward className="h-4 w-4" />
              Skip for now
            </button>
          </div>
        </div>

        {/* Main card (ring + actions) */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 md:p-8">
          {/* soft glow under ring */}
          <div className="relative flex flex-col items-center">
            <div className="pointer-events-none absolute -top-6 h-24 w-48 rounded-full blur-2xl opacity-50"
                 style={{background:"radial-gradient(50% 50% at 50% 50%, rgba(59,130,246,0.25) 0%, rgba(34,211,238,0.18) 60%, transparent 100%)"}}/>
            {/* Avatar ring */}
            <div
              className={cx(
                "group relative h-40 w-40 rounded-full p-[3px] cursor-pointer select-none transition-transform duration-200",
                pulse ? "animate-pulse" : "hover:scale-[1.02]"
              )}
              onClick={() => inputRef.current?.click()}
              onDrop={onRingDrop}
              onDragOver={onRingDragOver}
              style={{
                background:
                  "conic-gradient(rgba(59,130,246,0.9), rgba(34,211,238,0.9), rgba(59,130,246,0.9))",
              }}
              title="Click to upload/replace"
            >
              <div className="rounded-full h-full w-full bg-white grid place-items-center">
                <div className="relative rounded-full h-[148px] w-[148px] overflow-hidden ring-2 ring-blue-500/30 shadow-md bg-slate-50 flex items-center justify-center">
                  {loading.init ? (
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  ) : preview || currentPhoto ? (
                    <img
                      src={preview || currentPhoto}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={() => {
                        // fallback to initials if URL dies (e.g., stale cache)
                        setCurrentPhoto(null);
                        if (preview && preview.startsWith("blob:")) {
                          URL.revokeObjectURL(preview);
                        }
                        setPreview(null);
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <UserRound className="h-10 w-10 text-slate-400" />
                      <span className="mt-1 text-sm font-semibold text-slate-600">{initials}</span>
                    </div>
                  )}

                  {/* Hover camera overlay */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
                    <div className="rounded-full bg-white/90 p-2 shadow-md">
                      <Camera className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="absolute bottom-2 text-xs text-white/90">Change photo</span>
                  </div>
                </div>
              </div>
              {/* Hidden input */}
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={onInputChange}
              />
            </div>

            {/* Status chip */}
            <div className="mt-3 bg-white border border-slate-200 px-2 py-1 rounded-full text-[11px] text-slate-600 shadow-sm flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              {currentPhoto ? "Photo set" : "No photo yet"}
            </div>

            {/* Buttons under ring only */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!preview && !currentPhoto) {
                    toast.info("Select or upload an image first.");
                    return;
                  }
                  setRotation(0);
                  setZoom(1);
                  setCropReady(false);
                  setShowCropper(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition shadow-sm bg-blue-600 hover:bg-blue-700"
              >
                <CropIcon className="h-4 w-4" />
                Crop
              </button>

              <button
                type="button"
                onClick={deletePhoto}
                disabled={loading.delete || !currentPhoto}
                className={cx(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition",
                  currentPhoto
                    ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                    : "border-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                {loading.delete ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" /> Delete Photo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CROPPER MODAL (fixed, very high z-index, overflow hidden fix) */}
      {showCropper && (preview || currentPhoto) && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCropper(false)}
          />
          {/* dialog */}
          <div className="relative z-[10001] w-full max-w-lg mx-4 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xl">
            {/* header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <CropIcon className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">Crop your photo</h3>
              </div>
              <button
                onClick={() => setShowCropper(false)}
                className="p-1 rounded-md hover:bg-slate-100"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            {/* body */}
            <div className="bg-slate-900">
              {/* overflow-hidden prevents image overlaying controls */}
              <div className="relative h-[360px] overflow-hidden">
                <Cropper
                  image={preview || currentPhoto}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  objectFit="contain"
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onZoomChange={setZoom}
                  onCropComplete={(a, b) => {
                    setCroppedAreaPixels(b);
                    setCropReady(true);
                  }}
                />
              </div>

              {/* controls */}
              <div className="relative border-t border-white/10 bg-slate-900/70 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-white/80 w-16">Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-white/80 w-16">Rotate</label>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={rotation}
                    onChange={(e) => setRotation(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setRotation(0)}
                    className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-white bg-white/10 hover:bg-white/20"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3 bg-white">
              <button
                type="button"
                onClick={() => setShowCropper(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCropAndSave}
                disabled={loading.saving || !cropReady}
                className={cx(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition shadow-sm",
                  cropReady ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"
                )}
              >
                {loading.saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Crop & Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
