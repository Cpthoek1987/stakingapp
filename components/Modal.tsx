import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000000,
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: 'linear-gradient(45deg, #1a0f0f, #2c1a1a)',
                padding: '20px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 8px 32px rgba(255, 69, 0, 0.2)',
                border: '1px solid rgba(255, 69, 0, 0.1)',
                animation: 'modalGlow 3s infinite',
                position: 'relative',
                maxHeight: '85vh'
            }}>
                <style>{`
                    @keyframes modalGlow {
                        0%, 100% { box-shadow: 0 0 20px rgba(255, 69, 0, 0.2); }
                        50% { box-shadow: 0 0 40px rgba(255, 69, 0, 0.3); }
                    }
                `}</style>
                {children}
            </div>
        </div>,
        document.body
    );
};
