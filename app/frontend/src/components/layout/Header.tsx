"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { useEffect, useRef, useState } from "react";
import { settingService } from "@/services/setting.service";
import { WebsiteInfo, Category } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageToggle from "@/components/shared/LanguageToggle";

export default function Header() {
  const { t } = useTranslation();
  const totalItems = useCartStore((s) => s.totalItems);
  const [siteInfo, setSiteInfo] = useState<WebsiteInfo | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    settingService.getWebsiteInfo().then((d) => setSiteInfo(d.websiteInfo)).catch(() => {});
    settingService.getCategories().then((d) => setCategories(d.categoryList)).catch(() => {});
  }, []);

  const openMenu = () => menuRef.current?.classList.add("active");
  const closeMenu = () => menuRef.current?.classList.remove("active");

  const toggleSubMenu = (e: React.MouseEvent<HTMLElement>) => {
    const li = (e.currentTarget as HTMLElement).closest("li");
    li?.classList.toggle("active");
  };

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <div className="container">
          <div className="inner-wrap">
            {siteInfo?.phone && (
              <div className="inner-item">
                <i className="fa-solid fa-phone"></i>
                {siteInfo.phone}
              </div>
            )}
            {siteInfo?.email && (
              <div className="inner-item">
                <i className="fa-solid fa-envelope"></i>
                {siteInfo.email}
              </div>
            )}
            {siteInfo?.address && (
              <div className="inner-item">
                <i className="fa-solid fa-building"></i>
                {siteInfo.address}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* End Top Header */}

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="inner-wrap">
            <button className="inner-button-menu" onClick={openMenu}>
              <img alt="" src="/client/assets/images/icon-menu.png" />
            </button>

            <Link className="inner-logo" href="/">
              <img alt={siteInfo?.websiteName || "Tourism"} src="/client/assets/images/logo.png" />
            </Link>

            <nav className="inner-menu" ref={menuRef}>
              <ul>
                <li>
                  <Link className="active" href="/">{t.header.home}</Link>
                </li>
                {categories.map((item) => (
                  <li key={item._id}>
                    <Link href={`/category/${item.slug}`}>{item.name}</Link>
                    {item.children && item.children.length > 0 && (
                      <>
                        <i className="fa-solid fa-caret-down" onClick={toggleSubMenu}></i>
                        <ul className="inner-sub">
                          {item.children.map((child) => (
                            <li key={child._id}>
                              <Link href={`/category/${child.slug}`}>{child.name}</Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </li>
                ))}
                <li><Link href="#">{t.header.news}</Link></li>
                <li><Link href="/contact">{t.header.contact}</Link></li>
              </ul>
              <div className="inner-overlay" onClick={closeMenu}></div>
            </nav>

            <LanguageToggle />

            <Link className="inner-cart" href="/cart">
              <img alt="" src="/client/assets/images/icon-cart.png" />
              <span>
                <img alt="" src="/client/assets/images/icon-arrow-left.png" />
                <div mini-cart="">{totalItems()}</div>
              </span>
            </Link>
          </div>
        </div>
      </header>
      {/* End Header */}
    </>
  );
}
