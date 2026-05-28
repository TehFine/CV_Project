import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { JOB_CATEGORIES, jobService } from "@/services/jobService";
import { HeroSection, CategoriesSection, FeaturedJobsSection } from "./sections/MainSections";
import { AIPromoSection, HowItWorksSection, CTASplitSection } from "./sections/BottomSections";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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
        // Hàm chuẩn hóa tiếng Việt: loại bỏ dấu và chuyển về chữ thường
        const normalize = (str) => 
          str.normalize("NFD")
             .replace(/[\u0300-\u036f]/g, "")
             .replace(/&/g, "va")
             .toLowerCase();

        const mapped = res.map(c => {
          const catNameNorm = normalize(c.name);
          const iconMatch = JOB_CATEGORIES.find(jc => 
            normalize(jc.name) === catNameNorm || 
            jc.id.toLowerCase() === catNameNorm
          );
          return { 
            ...c, 
            id: c.name, 
            name: iconMatch ? iconMatch.name : c.name, // Ưu tiên dùng tên có dấu từ frontend
            icon: iconMatch ? iconMatch.icon : "folder" 
          };
        });
        setCategories(mapped);
      }
    });
  }, []);

  const handleCreateCV = () =>
    navigate(isAuthenticated ? "/cv-builder" : "/login", { state: { from: "/cv-builder" } });

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
      <CTASplitSection onCreateCV={handleCreateCV} />
    </>
  );
}
