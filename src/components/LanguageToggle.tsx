import { setLocale, useLocale, t } from "../i18n";
export default function LanguageToggle() {
  const locale = useLocale();
  return (
    <div
      className="language-toggle"
      role="group"
      aria-label={t("language.choose")}
    >
      <button
        type="button"
        lang="pt-BR"
        aria-pressed={locale === "pt"}
        onClick={() => setLocale("pt")}
      >
        PT
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        lang="en"
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
    </div>
  );
}
