"use client";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  ns: "privacy" | "terms";
  websiteName: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function LegalPageContent({ ns, websiteName, email, phone, address }: Props) {
  const { t } = useTranslation();
  const page = t[ns];
  const sub = (s: string) => s.replace(/\{site\}/g, websiteName);
  const lastIndex = page.sections.length - 1;

  return (
    <>
      {page.sections.map((section, i) => (
        <div key={i} style={{ display: "contents" }}>
          <h2>{section.heading}</h2>
          {section.paragraphs?.map((p, pi) => <p key={pi}>{sub(p)}</p>)}
          {section.items && (
            <ul>
              {section.items.map((item, ii) => (
                <li key={ii}>
                  {item.bold && <strong>{item.bold}</strong>} {sub(item.text)}
                </li>
              ))}
            </ul>
          )}
          {i === lastIndex && (email || phone || address) && (
            <ul>
              {email && <li>{page.contactLabels.email} {email}</li>}
              {phone && <li>{page.contactLabels.phone} {phone}</li>}
              {address && <li>{page.contactLabels.address} {address}</li>}
            </ul>
          )}
        </div>
      ))}
      <p className="last-updated">{page.lastUpdated}</p>
    </>
  );
}
