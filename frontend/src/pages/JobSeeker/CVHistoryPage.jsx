import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cvService } from '../../services/cvService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function CVHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScore, setSelectedScore] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await cvService.getScoreHistory();
      setHistory(data || []);
    } catch (err) {
      setError('Lỗi khi tải lịch sử chấm điểm CV. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to color code the score
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  const getLevelColor = (level) => {
    if (!level) return 'text-gray-400 bg-gray-400/10';
    const l = level.toLowerCase();
    if (l.includes('senior') || l.includes('lead')) return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    if (l.includes('middle') || l.includes('mid')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    if (l.includes('junior') || l.includes('fresher')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white py-12 px-4 relative overflow-hidden">
      {/* Background Orbs for Glassmorphism effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Lịch sử chấm điểm CV
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Xem lại quá trình phát triển năng lực của bạn thông qua các lần AI phân tích CV.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 backdrop-blur-md">
            <p>{error}</p>
            <button onClick={fetchHistory} className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors">
              Thử lại
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-bold mb-2">Bạn chưa chấm điểm CV nào</h3>
            <p className="text-gray-400 mb-6">Hãy thử tính năng AI Scoring để xem năng lực thực sự của bạn.</p>
            <a href="/cv-upload" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
              Chấm CV Ngay
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {history.map((item, index) => (
                <motion.div
                  key={item._id || item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedScore(item)}
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-6 cursor-pointer backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
                >
                  {/* Decorative glow inside card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex-1 truncate pr-4">
                      <h3 className="font-semibold text-lg text-white truncate" title={item.fileName}>
                        {item.fileName || 'CV_Khong_ten.pdf'}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {item.scoredAt ? format(new Date(item.scoredAt), 'dd MMMM, yyyy - HH:mm', { locale: vi }) : 'Vừa xong'}
                      </p>
                    </div>
                    
                    <div className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl border-2 shadow-lg backdrop-blur-md ${getScoreColor(item.overall)}`}>
                      {item.overall || 0}
                    </div>
                  </div>

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm w-20">Đánh giá:</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getScoreColor(item.overall)}`}>
                        {item.gradeLabel || 'N/A'} (Hạng {item.grade || 'N/A'})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm w-20">Trình độ:</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getLevelColor(item.level_assessment)}`}>
                        {item.level_assessment || 'Chưa phân tích'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm w-20">Vị trí:</span>
                      <span className="text-sm text-gray-200 truncate">
                        {item.targetPosition || 'Chung'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 relative z-10 flex justify-between items-center">
                    <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors">Xem chi tiết &rarr;</span>
                    <span className="text-xs text-gray-500">{item.extracted_experience_years || 0} năm K/N</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedScore && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedScore(null)}
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl max-h-[90vh] bg-[#111827] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-gradient-to-r from-[#111827] to-[#1F2937]">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{selectedScore.fileName}</h2>
                    <p className="text-sm text-gray-400">Chấm lúc: {selectedScore.scoredAt ? format(new Date(selectedScore.scoredAt), 'PPpp', { locale: vi }) : 'Vừa xong'}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedScore(null)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                  
                  {/* Top Stats */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex-1 min-w-[120px] p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                      <span className="text-gray-400 text-sm mb-1">Điểm AI</span>
                      <span className={`text-3xl font-black ${getScoreColor(selectedScore.overall).split(' ')[0]}`}>{selectedScore.overall}/100</span>
                    </div>
                    <div className="flex-1 min-w-[120px] p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                      <span className="text-gray-400 text-sm mb-1">Xếp hạng</span>
                      <span className={`text-3xl font-black ${getScoreColor(selectedScore.overall).split(' ')[0]}`}>{selectedScore.grade}</span>
                    </div>
                    <div className="flex-1 min-w-[120px] p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                      <span className="text-gray-400 text-sm mb-1">Cấp độ (Level)</span>
                      <span className={`text-xl font-bold text-center ${getLevelColor(selectedScore.level_assessment).split(' ')[0]}`}>{selectedScore.level_assessment || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Skills Analysis */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><span className="text-blue-400">⚡</span> Phân tích Kỹ năng chuyên sâu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                        <h4 className="text-green-400 font-medium mb-3 text-sm uppercase tracking-wider">Kỹ năng Thực chiến (Advanced)</h4>
                        <div className="flex flex-wrap gap-2">
                          {(selectedScore.skill_analysis?.advanced || []).length > 0 ? 
                            selectedScore.skill_analysis.advanced.map((s, i) => <span key={i} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-md text-sm">{s}</span>)
                            : <span className="text-gray-500 text-sm italic">Không có dữ liệu</span>
                          }
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                        <h4 className="text-yellow-400 font-medium mb-3 text-sm uppercase tracking-wider">Kỹ năng Cần bồi dưỡng (Familiar)</h4>
                        <div className="flex flex-wrap gap-2">
                          {(selectedScore.skill_analysis?.familiar || []).length > 0 ? 
                            selectedScore.skill_analysis.familiar.map((s, i) => <span key={i} className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-md text-sm">{s}</span>)
                            : <span className="text-gray-500 text-sm italic">Không có dữ liệu</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Categories Breakdown */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><span className="text-purple-400">📊</span> Chi tiết từng phần</h3>
                    <div className="space-y-4">
                      {(selectedScore.categories || []).map((cat, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-200">{cat.icon} {cat.label}</h4>
                            <span className={`font-bold ${cat.score >= 80 ? 'text-green-400' : cat.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {cat.score}/100
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3">
                            <div className={`h-1.5 rounded-full ${cat.score >= 80 ? 'bg-green-500' : cat.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${cat.score}%` }}></div>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{cat.feedback}</p>
                          {cat.suggestions && cat.suggestions.length > 0 && (
                            <ul className="text-sm text-blue-300/80 list-disc list-inside">
                              {cat.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {/* CSS for custom scrollbar in modal */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}
