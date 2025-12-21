import React, { useState, useEffect } from 'react';
import { IMAGE_FALLBACKS } from '@/constants/imageFallbacks';
import { AlertTriangle } from 'lucide-react';

// Singleton Toast Manager
const showToast = () => {
    const TOAST_ID = 'safe-image-toast';

    // 1. Singleton Check
    if (document.getElementById(TOAST_ID)) return;

    // 2. Create Toast DOM
    const toast = document.createElement('div');
    toast.id = TOAST_ID;
    toast.className = "fixed bottom-4 right-4 z-[9999] bg-white border-l-4 border-amber-500 shadow-2xl rounded-lg p-4 flex items-center gap-3 animate-in slide-in-from-right duration-300 max-w-sm";
    toast.innerHTML = `
        <div class="p-2 bg-amber-50 rounded-full text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
        </div>
        <div>
            <h4 class="font-bold text-gray-900 text-sm">Image unavailable</h4>
            <p class="text-xs text-gray-500">Showing a default image instead.</p>
        </div>
    `;

    document.body.appendChild(toast);

    // 3. Auto-remove after 3s
    setTimeout(() => {
        toast.classList.add('fade-out'); // Optional if we had CSS for it, but removing is fine
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 4000);
};

const SafeImage = ({
    src,
    category = 'default',
    alt = 'Image',
    className,
    ...props
}) => {
    // Stage: 'initial' | 'proxy' | 'fallback'
    const [imgSrc, setImgSrc] = useState(src);
    const [stage, setStage] = useState('initial');

    // Reset when src changes
    useEffect(() => {
        setImgSrc(src);
        setStage('initial');
    }, [src]);

    const handleError = () => {
        if (stage === 'initial') {
            // RETRY 1: Proxy
            // Encoded URL for wsrv.nl
            const encoded = encodeURIComponent(src);
            setImgSrc(`https://wsrv.nl/?url=${encoded}`);
            setStage('proxy');
        } else if (stage === 'proxy') {
            // RETRY 2: Fallback
            // If proxy fails, swap to fallback constant
            const fallbackUrl = IMAGE_FALLBACKS[category] || IMAGE_FALLBACKS['default'];
            setImgSrc(fallbackUrl);
            setStage('fallback');

            // Trigger User Feedback (Singleton)
            showToast();
        }
        // If stage is fallback and it fails, we stop to prevent infinite loops.
        // It presumably means Unsplash is down or we have a network issue.
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
            {...props}
        />
    );
};

export default SafeImage;
