import { Link } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
            <AlertCircle className="w-20 h-20 text-[#1549B8] animate-bounce" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-8xl font-black text-[#0F172A] mb-4 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-bold text-[#1E293B] mb-4">
          Opps! Trang này không tồn tại
        </h2>
        <p className="text-slate-500 mb-10 leading-relaxed">
          Có vẻ như đường dẫn bạn truy cập không đúng hoặc bạn không có quyền truy cập vào khu vực này. 
          Vui lòng quay lại trang chủ hoặc liên hệ quản trị viên.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            variant="outline" 
            className="h-12 px-8 rounded-xl font-bold border-slate-200 hover:bg-slate-50 gap-2 transition-all"
          >
            <Link to={-1}>
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Link>
          </Button>
          <Button 
            asChild
            className="h-12 px-8 rounded-xl font-bold bg-[#1549B8] hover:bg-[#1E40AF] shadow-lg shadow-blue-200 gap-2 transition-all"
          >
            <Link to="/">
              <Home className="w-4 h-4" />
              Về trang chủ
            </Link>
          </Button>
        </div>

        {/* Footer info */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-400">
            &copy; 2025 NexCV Platform. Bảo mật & Tin cậy.
          </p>
        </div>
      </div>
    </div>
  );
}
