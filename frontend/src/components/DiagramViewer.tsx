'use client';

import { useEffect, useState } from 'react';
import { instance } from '@viz-js/viz';

interface DiagramViewerProps {
    data: {
        repoUrl: string;
        detectedTech: string[];
        schema: any;
        dotString: string;
        tablesCount: number;
    };
    onReset: () => void;
}

export default function DiagramViewer({ data, onReset }: DiagramViewerProps) {
    const [svgContent, setSvgContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'diagram' | 'schema' | 'dot'>('diagram');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderDiagram = async () => {
            try {
                setError(null);
                const viz = await instance();
                const svg = viz.renderString(data.dotString, { format: 'svg' });
                setSvgContent(svg);
            } catch (error: any) {
                console.error('Error rendering diagram:', error);
                setError(error.message || 'Failed to render diagram');
            } finally {
                setLoading(false);
            }
        };

        renderDiagram();
    }, [data.dotString]);

    const downloadDiagram = (format: 'svg' | 'dot') => {
        let content: string;
        let mimeType: string;
        let filename: string;

        if (format === 'svg') {
            content = svgContent;
            mimeType = 'image/svg+xml';
            filename = 'er-diagram.svg';
        } else {
            content = data.dotString;
            mimeType = 'text/plain';
            filename = 'er-diagram.dot';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Analysis Complete!</h2>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                </svg>
                                {data.repoUrl.split('/').slice(-2).join('/')}
                            </div>

                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-sm font-medium">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                </svg>
                                {data.tablesCount} {data.tablesCount === 1 ? 'Table' : 'Tables'}
                            </div>

                            {data.detectedTech.map((tech) => (
                                <span
                                    key={tech}
                                    className="inline-flex px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={onReset}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        New Analysis
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50">
                    <div className="flex">
                        {[
                            {
                                id: 'diagram', label: 'ER Diagram', icon: (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                )
                            },
                            {
                                id: 'schema', label: 'Schema JSON', icon: (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                    </svg>
                                )
                            },
                            {
                                id: 'dot', label: 'DOT Source', icon: (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                )
                            }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'diagram' && (
                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <svg className="animate-spin h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                    <svg className="h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Render Diagram</h3>
                                        <p className="text-sm text-gray-600 max-w-md">{error}</p>
                                        <p className="text-xs text-gray-500 mt-2">Check the DOT Source tab to view the raw diagram code</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => downloadDiagram('svg')}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download SVG
                                        </button>
                                        <button
                                            onClick={() => downloadDiagram('dot')}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download DOT
                                        </button>
                                    </div>
                                    <div className="overflow-auto max-h-[600px] border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                                        <div dangerouslySetInnerHTML={{ __html: svgContent }} />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'schema' && (
                        <div className="overflow-auto max-h-[600px]">
                            <pre className="text-sm bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto">
                                {JSON.stringify(data.schema, null, 2)}
                            </pre>
                        </div>
                    )}

                    {activeTab === 'dot' && (
                        <div className="overflow-auto max-h-[600px]">
                            <pre className="text-sm bg-gray-900 text-blue-300 p-6 rounded-xl overflow-x-auto font-mono">
                                {data.dotString}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
