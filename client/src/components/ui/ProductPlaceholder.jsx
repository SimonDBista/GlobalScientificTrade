import React from 'react';
import { Microscope, HardHat, Compass, Baby, Box, Layers, ShieldCheck } from 'lucide-react';

export default function ProductPlaceholder({ categorySlug, modelNumber, name, imageUrl, className = "h-52" }) {
    if (imageUrl) {
        return (
            <div className={`relative overflow-hidden bg-slate-100 flex items-center justify-center ${className}`}>
                <img
                    src={imageUrl}
                    alt={name || "Product"}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                <div style={{ display: 'none' }} className="w-full h-full items-center justify-center bg-slate-100">
                    <PlaceholderDesign categorySlug={categorySlug} modelNumber={modelNumber} name={name} />
                </div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 border-b border-slate-100 flex items-center justify-center p-6 ${className}`}>
            <PlaceholderDesign categorySlug={categorySlug} modelNumber={modelNumber} name={name} />
        </div>
    );
}

function PlaceholderDesign({ categorySlug = '', modelNumber, name }) {
    const slug = categorySlug.toLowerCase();

    let Icon = Box;
    let deptName = "Apparatus";
    let accentBg = "bg-brand-50 border-brand-200 text-brand-800";
    let iconColor = "text-brand-700";

    if (slug.includes('science')) {
        Icon = Microscope;
        deptName = "Science Lab";
        accentBg = "bg-emerald-50 border-emerald-200 text-emerald-800";
        iconColor = "text-emerald-700";
    } else if (slug.includes('civil')) {
        Icon = HardHat;
        deptName = "Civil Testing";
        accentBg = "bg-amber-50 border-amber-200 text-amber-900";
        iconColor = "text-amber-700";
    } else if (slug.includes('math')) {
        Icon = Compass;
        deptName = "Math Lab";
        accentBg = "bg-blue-50 border-blue-200 text-blue-900";
        iconColor = "text-blue-700";
    } else if (slug.includes('bal') || slug.includes('ecd')) {
        Icon = Baby;
        deptName = "Bal Bikas";
        accentBg = "bg-rose-50 border-rose-200 text-rose-900";
        iconColor = "text-rose-700";
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center relative select-none">
            {/* Subtle grid background */}
            <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#0b394a_1px,transparent_1px)] [background-size:12px_12px]" />

            {/* Department Badge */}
            <div className={`absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${accentBg} shadow-xs`}>
                {deptName}
            </div>

            {/* Central Schematic Icon */}
            <div className="w-16 h-16 rounded-2xl bg-white/90 shadow-sm border border-slate-200/80 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110">
                <Icon className={`w-8 h-8 ${iconColor}`} strokeWidth={1.75} />
            </div>

            {/* Model Number Pill if available */}
            {modelNumber ? (
                <div className="text-xs font-mono font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200/60 shadow-xs mb-1">
                    {modelNumber}
                </div>
            ) : (
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                    Precision Instrument
                </div>
            )}

            <div className="flex items-center text-[10px] text-slate-400 font-medium space-x-1 mt-1">
                <ShieldCheck className="w-3 h-3 text-brand-600" />
                <span>Genuine Quality Verified</span>
            </div>
        </div>
    );
}
