import './index.css';
import React, { useState, useEffect } from 'react';

export const Hexdiff: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {

  const [HexInput1, SetHexInput1] = useState('');
  const [HexInput2, SetHexInput2] = useState('');
  const [DiffResult, SetDiffResult] = useState<Array<{ type: 'equal' | 'added' | 'removed' | 'modified', value: string, byte1?: string, byte2?: string }>>([]);

  const clearInputs = () => {
    SetHexInput1('');
    SetHexInput2('');
    SetDiffResult([]);
  }

  const normalizeHex = (input: string): string[] => {
    // Remove all non-hex characters and split into bytes
    return input.replace(/[^0-9a-fA-F]/g, '').match(/.{1,2}/g) || [];
  }

  const calculateDiff = () => {
    const bytes1 = normalizeHex(HexInput1);
    const bytes2 = normalizeHex(HexInput2);
    const maxLength = Math.max(bytes1.length, bytes2.length);
    const result: Array<{ type: 'equal' | 'added' | 'removed' | 'modified', value: string, byte1?: string, byte2?: string }> = [];

    for (let i = 0; i < maxLength; i++) {
      const byte1 = bytes1[i];
      const byte2 = bytes2[i];

      if (!byte1 && byte2) {
        result.push({ type: 'added', value: byte2, byte2 });
      } else if (byte1 && !byte2) {
        result.push({ type: 'removed', value: byte1, byte1 });
      } else if (byte1 === byte2) {
        result.push({ type: 'equal', value: byte1, byte1, byte2 });
      } else {
        result.push({ type: 'modified', value: `${byte1}→${byte2}`, byte1, byte2 });
      }
    }

    SetDiffResult(result);
  }

  useEffect(() => {
    if (HexInput1.trim() || HexInput2.trim()) {
      calculateDiff();
    } else {
      SetDiffResult([]);
    }
  }, [HexInput1, HexInput2]);


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-3">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-br from-blue-400 to-red-500 mb-3">
            Diff Checker
          </h1>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 p-10 space-y-3">
          <div className="flex justify-center gap-4">
            <button
              className="px-15 py-2.5 rounded-lg text-sm font-bold transition-all bg-slate-700 text-gray-300 hover:bg-linear-to-br from-blue-400 to-purple-500 mb-3 hover:shadow-lg hover:shadow-blue-500/30"
              onClick={() => clearInputs()}
            >
              Reset
            </button>
            <button
              onClick={() => {
                onNavigate('converter');
              }}
              className="px-15 py-2.5 rounded-lg text-sm font-bold transition-all bg-slate-700 text-gray-300 hover:bg-linear-to-br from-red-400 to-purple-400 mb-3 hover:shadow-lg hover:shadow-gray-500/30"
            >
              Converter
            </button>
            <button
              onClick={() => onNavigate('structuretohex')}
              className="px-15 py-2.5 rounded-lg text-sm font-bold transition-all bg-slate-700 text-gray-300 hover:bg-linear-to-br from-red-400 to-purple-400 mb-3 hover:shadow-lg hover:shadow-gray-500/30"
            >
              Structure dumper
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="px-15 py-2.5 rounded-lg text-sm font-bold transition-all bg-slate-700 text-gray-300 hover:bg-linear-to-br from-green-400 to-teal-500 mb-3 hover:shadow-lg hover:shadow-gray-500/30"
            >
              About
            </button>
          </div>

          {/* Hex Input 1*/}
          <div className="group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full shrink-0"></span>
                <span className="text-lg font-semibold text-red-400">Hex input 1</span>
              </div>
            </div>
            <textarea
              value={HexInput1}
              onChange={(e) => {
                SetHexInput1(e.target.value);
              }}
              placeholder="Enter first hex dump (e.g., 01 02 03 FF AA BB)..."
              className="w-full px-5 py-4 bg-slate-900/50 border-2 border-slate-700 text-gray-100 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all font-mono text-base resize-y placeholder-gray-500"
              rows={4}
            />
          </div>

          {/* Hex Input 2*/}
          <div className="group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full shrink-0"></span>
                <span className="text-lg font-semibold text-green-400">Hex input 2</span>
              </div>
            </div>
            <textarea
              value={HexInput2}
              onChange={(e) => {
                SetHexInput2(e.target.value);
              }}
              placeholder="Enter second hex dump (e.g., 01 02 04 FF CC BB)..."
              className="w-full px-5 py-4 bg-slate-900/50 border-2 border-slate-700 text-gray-100 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all font-mono text-base resize-y placeholder-gray-500"
              rows={4}
            />
          </div>

          {/* Diff Result */}
          {DiffResult.length > 0 && (
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-purple-400 rounded-full shrink-0"></span>
                  <span className="text-lg font-semibold text-purple-400">Differences</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-slate-600 rounded"></span>
                    <span className="text-gray-400">Equal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-yellow-500 rounded"></span>
                    <span className="text-gray-400">Modified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-green-500 rounded"></span>
                    <span className="text-gray-400">Added</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-red-500 rounded"></span>
                    <span className="text-gray-400">Removed</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 border-2 border-slate-700 rounded-xl p-5 font-mono text-sm">
                <div className="flex flex-wrap gap-2">
                  {DiffResult.map((item, index) => {
                    let bgColor = 'bg-slate-600';
                    let textColor = 'text-gray-300';
                    let displayValue = item.value;

                    if (item.type === 'equal') {
                      bgColor = 'bg-slate-600';
                      textColor = 'text-gray-300';
                    } else if (item.type === 'modified') {
                      bgColor = 'bg-yellow-500';
                      textColor = 'text-gray-900';
                      displayValue = item.byte2 || item.value;
                    } else if (item.type === 'added') {
                      bgColor = 'bg-green-500';
                      textColor = 'text-gray-900';
                    } else if (item.type === 'removed') {
                      bgColor = 'bg-red-500';
                      textColor = 'text-white';
                    }

                    return (
                      <div
                        key={index}
                        className={`${bgColor} ${textColor} px-2.5 py-1 rounded font-bold transition-all hover:scale-110 hover:shadow-lg relative group/byte`}
                        title={item.type === 'modified' ? `Changed from ${item.byte1} to ${item.byte2}` : item.type}
                      >
                        {displayValue}
                        {item.type === 'modified' && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover/byte:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {item.byte1} → {item.byte2}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700 text-gray-400 text-xs">
                  <div className="flex gap-6">
                    <span>Total bytes: {DiffResult.length}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-green-400">Added: {DiffResult.filter(i => i.type === 'added').length}</span>
                    <span className="text-red-400">Removed: {DiffResult.filter(i => i.type === 'removed').length}</span>
                    <span className="text-yellow-400">Modified: {DiffResult.filter(i => i.type === 'modified').length}</span>
                    <span className="text-gray-400">Equal: {DiffResult.filter(i => i.type === 'equal').length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};