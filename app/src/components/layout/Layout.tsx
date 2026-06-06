import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { settingService } from '../../services/setting.service';
import { Category, WebsiteInfo } from '../../types';

export default function Layout() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfo | null>(null);

  useEffect(() => {
    Promise.all([
      settingService.getWebsiteInfo(),
      settingService.getCategories(),
    ]).then(([info, cats]) => {
      setWebsiteInfo(info.websiteInfo);
      setCategories(cats.categoryList);
    });
  }, []);

  return (
    <>
      <Header categories={categories} websiteName={websiteInfo?.websiteName} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
