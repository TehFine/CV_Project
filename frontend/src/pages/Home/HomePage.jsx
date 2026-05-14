import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { JOB_CATEGORIES, jobService } from "@/services/jobService";
import { HeroSection, CategoriesSection, FeaturedJobsSection } from "./sections/MainSections";
import { AIPromoSection, HowItWorksSection, CTASplitSection } from "./sections/BottomSections";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isEmployer } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [categories, setCategories] = useState(JOB_CATEGORIES);

  useEffect(() => {
    jobService.getJobs({ limit: 6 }).then(res => {
      setFeaturedJobs(res.data || []);
      setLoadingJobs(false);
    }).catch(() => setLoadingJobs(false));

    jobService.getCategories().then(res => {
      if (res && res.length > 0) {
        const mapped = res.map(c => {
          const iconMatch = JOB_CATEGORIES.find(jc => jc.name === c.name);
          return { ...c, id: c.name, icon: iconMatch ? iconMatch.icon : "📁" };
        });
        setCategories(mapped);
      }
    });
  }, []);

  const handleCreateCV = () =>
    navigate(isAuthenticated ? "/cv-builder" : "/login", { state: { from: "/cv-builder" } });

  // Điều hướng đến trang đăng ký nhà tuyển dụng
  // Nếu đang đăng nhập với role candidate: lưu prefill, đăng xuất, rồi mới chuyển trang
  const handleEmployerRegister = async () => {
    if (isAuthenticated && !isEmployer) {
      // Lưu thông tin vào sessionStorage để giữ qua lần navigate mới sau khi logout
      sessionStorage.setItem('employer_register_prefill', JSON.stringify({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
      }));
      await logout();
    }
    navigate('/employer/register');
  };

  return (
    <>
      <HeroSection />
      <CategoriesSection
        categories={categories}
        onCategoryClick={name => navigate(`/jobs?category=${name}`)}
      />
      <FeaturedJobsSection jobs={featuredJobs} loading={loadingJobs} />
      <AIPromoSection />
      <HowItWorksSection />
      <CTASplitSection onCreateCV={handleCreateCV} onEmployerRegister={handleEmployerRegister} />
    </>
  );
}
