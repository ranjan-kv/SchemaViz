'use client';

import { useState } from 'react';
import DiagramViewer from '@/components/DiagramViewer';
import GitHubInput from '@/components/GitHubInput';
import Features from '@/components/Features';

export default function Home() {
  const [diagramData, setDiagramData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (repoUrl: string) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to analyze repository');
      }

      const data = await response.json();
      setDiagramData(data);
    } catch (error: any) {
      alert(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDiagramData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/70 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SchemaViz
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                AI Powered
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {!diagramData ? (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Generate ER Diagrams from
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Any GitHub Repository
                </span>
              </h2>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Paste a GitHub URL, and let AI analyze your database schema automatically.
                Supports SQL, Prisma, Sequelize, Django, Laravel, and more.
              </p>
            </div>

            {/* Input Section */}
            <GitHubInput onAnalyze={handleAnalyze} loading={loading} />

            {/* Features Section */}
            <Features />

            {/* Example Repos */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Try with Example Repositories
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Prisma Example',
                    url: 'https://github.com/prisma/prisma-examples',
                    tech: 'Prisma + TypeScript'
                  },
                  {
                    name: 'Django Blog',
                    url: 'https://github.com/divanov11/Django-2021',
                    tech: 'Django + Python'
                  },
                  {
                    name: 'Laravel Shop',
                    url: 'https://github.com/laravel/laravel',
                    tech: 'Laravel + PHP'
                  }
                ].map((example) => (
                  <button
                    key={example.url}
                    onClick={() => handleAnalyze(example.url)}
                    className="group p-6 rounded-xl border-2 border-gray-200 hover:border-blue-400 bg-white hover:shadow-xl transition-all duration-300 text-left"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {example.name}
                      </h4>
                      <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">{example.tech}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <DiagramViewer data={diagramData} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 bg-white/50 backdrop-blur">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>Made with ❤️ by Ranjan Kumar Verma • SchemaViz - Open Source Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
