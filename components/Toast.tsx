import { ShowToastContext } from '@/context/ShowToastContext';
import React, { useContext, useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react';

function Toast({msg}:{msg:string}) {
    const toastCtx = useContext(ShowToastContext);
    const [visible, setVisible] = useState(true);

    if (!toastCtx) return null;

    const { showToastMsg, setShowToastMsg } = toastCtx;
    
    useEffect(() => {
        const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setShowToastMsg(null), 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [setShowToastMsg]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => setShowToastMsg(null), 300);
    };

  return (
    <div className="toast toast-top toast-end">
      <div
        className={`alert alert-success transition-all duration-300 transform ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        } text-white px-3 py-2 shadow-md flex items-center justify-between gap-2`}
        style={{
          backgroundColor: '#497FFF',
          borderRadius: '8px',
          minWidth: '250px',
        }}
      >
        <CheckCircle size={18} />
        <span className="flex-1">{msg}</span>
        <button onClick={handleClose} className="text-white text-lg font-bold leading-none">
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast