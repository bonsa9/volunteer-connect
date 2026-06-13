import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateTemplate() {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!templateName.trim() || !file) {
      setError('Template name and file are required.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', templateName);
      if (description.trim()) {
        formData.append('description', description);
      }
      formData.append('file', file);

      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create template');
      }

      navigate('/admin/templates');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while uploading.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm h-full max-w-4xl mx-auto overflow-y-auto">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin/templates')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 px-4 py-2 rounded-xl transition-colors bg-white hover:bg-slate-50 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Templates
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-[#0A3D91]">Create New Template</h2>
          <p className="text-sm text-slate-500">Upload a new document template</p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-bold">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Template Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter template name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3D91]/20 focus:border-[#0A3D91] transition-all bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Description
          </label>
          <textarea
            placeholder="Enter template description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3D91]/20 focus:border-[#0A3D91] transition-all bg-white resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Template File <span className="text-red-500">*</span>
          </label>
          
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`w-full border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
              file ? 'border-[#427DFF] bg-[#427DFF]/5' : 'border-slate-300 hover:border-[#427DFF] hover:bg-slate-50 bg-white'
            }`}
          >
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-[#427DFF]/10 text-[#427DFF] rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-slate-700">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="mt-2 text-sm text-red-500 font-bold hover:underline"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="text-slate-400">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-700">Drop your template file here</h3>
                <p className="text-sm text-slate-500">or click to browse files</p>
                <div className="mt-4">
                  <label className="cursor-pointer bg-white border border-slate-200 text-slate-700 font-bold py-2 px-6 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm inline-block">
                    Choose File
                    <input type="file" className="hidden" accept=".docx" onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFile(e.target.files[0]);
                      }
                    }} />
                  </label>
                </div>
                <p className="text-xs text-slate-400 mt-4 font-semibold tracking-wide">Supported formats: DOCX (Max 10MB)</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 flex items-center gap-4 border-t border-slate-100">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#6B9DFD] text-white px-8 py-2.5 rounded-xl font-bold shadow-sm hover:bg-[#5b8cf0] disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading && <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
            {loading ? 'Creating...' : 'Create Template'}
          </button>
          <button 
            onClick={() => navigate('/admin/templates')}
            className="bg-white border border-slate-200 text-slate-700 px-8 py-2.5 rounded-xl font-bold hover:bg-slate-50 shadow-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
