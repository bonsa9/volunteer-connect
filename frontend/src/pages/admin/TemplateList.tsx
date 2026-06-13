import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../../../utils/api';

type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  totalVariables: number;
  requiredVariables: number;
  createdAt: string;
  updatedAt: string;
};

export default function TemplateList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/templates')
      .then((data: any) => {
        // Handle array or object structure
        setTemplates(Array.isArray(data) ? data : data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch templates:', err);
        setLoading(false);
      });
  }, []);

  const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0A3D91]">Templates Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage document templates and variables</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3D91]/20 focus:border-[#0A3D91] transition-all w-64"
            />
          </div>
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-[#0A3D91] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-[#0A3D91] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-50 p-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#427DFF] text-white">
              <tr>
                <th className="px-6 py-4 font-bold">Template Name</th>
                <th className="px-6 py-4 font-bold">Description</th>
                <th className="px-6 py-4 font-bold text-center">Category</th>
                <th className="px-6 py-4 font-bold text-center">Variables</th>
                <th className="px-6 py-4 font-bold">Created</th>
                <th className="px-6 py-4 font-bold">Updated</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">Loading templates...</td>
                </tr>
              ) : filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">No templates found.</td>
                </tr>
              ) : filteredTemplates.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-700 font-semibold">{t.name}</td>
                  <td className="px-6 py-4 text-slate-500">{t.description}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-slate-100 text-slate-700 font-bold text-[11px] px-3 py-1 rounded-full">{t.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 text-xs font-bold">
                      <span className="text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{t.totalVariables} total</span>
                      <span className="text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{t.requiredVariables} required</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{new Date(t.updatedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-1.5">
                      <button className="p-1.5 text-slate-400 hover:text-[#0A3D91] bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-[#0A3D91] bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-[#0A3D91] bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
