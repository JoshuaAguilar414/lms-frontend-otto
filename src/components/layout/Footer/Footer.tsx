import { ScrollToTop } from './ScrollToTop';

export function Footer() {
  const OTTO_GROUP_BASE = 'https://www.ottogroup.com';
  const og = (path: string) => `${OTTO_GROUP_BASE}${path}`;

  const navColumns = [
    [
      {
        title: 'Über uns',
        links: [
          { label: 'Werte', href: og('/de/ueber-uns/werte.php') },
          { label: 'Management', href: og('/de/ueber-uns/management.php') },
          { label: 'Kennzahlen', href: og('/de/ueber-uns/kennzahlen.php') },
          { label: 'Konzernfirmen', href: og('/de/ueber-uns/konzernfirmen.php') },
          { label: 'Creditor Relations', href: og('/de/ueber-uns/creditor-relations.php') },
          { label: 'Historie und Gründer', href: og('/de/ueber-uns/historie-und-gruender.php') },
          { label: 'Mitgliedschaften und Allianzen', href: og('/de/ueber-uns/mitgliedschaften-und-allianzen.php') },
          { label: 'Compliance', href: og('/de/ueber-uns/compliance.php') },
        ],
      },
    ],
    [
      {
        title: 'Strategie',
        links: [{ label: 'Strategie', href: og('/de/strategie/') }],
      },
      {
        title: 'Nachhaltigkeit',
        links: [
          { label: 'Ökologische Verantwortung', href: og('/de/nachhaltigkeit/oekologische-verantwortung.php') },
          { label: 'Soziale Verantwortung', href: og('/de/nachhaltigkeit/gesellschaftliche-verantwortung.php') },
          { label: 'Digitale Verantwortung', href: og('/de/nachhaltigkeit/corporate-digital-responsibility.php') },
          { label: 'Lieferkette', href: og('/de/nachhaltigkeit/lieferkette.php') },
          { label: 'Berichte und Richtlinien', href: og('/de/nachhaltigkeit/berichte-richtlinien.php') },
        ],
      },
    ],
    [
      {
        title: 'Karriereportal',
        links: [{ label: 'Stellenausschreibungen', href: og('/de/karriere/jobs/') }],
      },
      {
        title: 'Stories',
        links: [{ label: 'Stories', href: og('/de/stories/') }],
      },
      {
        title: 'Medien',
        links: [
          { label: 'Newsroom', href: og('/de/medien/newsroom/') },
          { label: 'Downloads', href: og('/de/medien/downloads/') },
          { label: 'Pressekontakte', href: og('/de/medien/kontakte/') },
        ],
      },
    ],
  ];

  const legalLinks = [
    { label: 'Impressum', href: og('/de/impressum/') },
    { label: 'Datenschutz', href: og('/de/datenschutz/') },
    { label: 'Cookie-Einstellungen', href: 'javascript:openCookieNotice();void(0);' },
  ];
  const socialLinks = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ottogroup' },
    { label: 'Instagram', href: 'https://instagram.com/ottogroupcom/' },
    { label: 'YouTube', href: 'https://www.youtube.com/channel/UCUAIZw9OFAiFNSVuUCI8DoA' },
    { label: 'SoundCloud', href: 'https://soundcloud.com/ottogroup' },
    { label: 'X', href: 'https://twitter.com/ottogroup_com?lang=de' },
    { label: 'Facebook', href: 'https://www.facebook.com/ottogroupcom/' },
  ];

  return (
    <>
      <footer
        id="blockFooter"
        className="font-sans border-t border-otto-burgundy bg-white text-otto-burgundy"
      >
        <div className="mx-auto max-w-full px-4 py-8 lg:px-[3.333rem]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="max-w-[280px] text-[14px] font-semibold leading-[1.4] sm:text-[16px]">
                Immer auf dem neuesten Stand mit unserem Newsletter.
              </p>
              <a
                href={og('/de/newsletter/')}
                className="mt-6 inline-flex h-[36px] items-center justify-center rounded-full border border-otto-burgundy px-5 text-[14px] font-semibold leading-none transition-colors hover:bg-otto-burgundy hover:text-white sm:h-[40px] sm:px-6 sm:text-[16px]"
              >
                Jetzt anmelden
              </a>
            </div>

            <div className="lg:col-span-9">
              <div className="mb-0 grid grid-cols-1 gap-6 md:grid-cols-2 min-[992px]:grid-cols-3">
                {navColumns.map((column, columnIndex) => (
                  <div key={`footer-column-${columnIndex}`} className="space-y-5">
                    {column.map((section) => (
                      <div key={section.title}>
                        <h3 className="mb-3 text-[14px] font-semibold leading-[1.4] sm:text-[16px]">{section.title}</h3>
                        <ul className="space-y-2 text-[12px] font-normal leading-[1.4] sm:text-[14px]">
                          {section.links.map((item) => (
                            <li key={item.label}>
                              <a
                                href={item.href}
                                className="text-otto-burgundy transition-opacity hover:opacity-75"
                              >
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-full flex-col gap-4 px-4 py-8 lg:px-[3.333rem]">
          <div className="flex flex-wrap items-center gap-2.5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-otto-burgundy bg-white text-otto-burgundy transition-colors hover:bg-otto-burgundy hover:text-white"
              >
                <SocialIcon name={social.label} />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] font-normal leading-[1.4] sm:text-[14px]">© {new Date().getFullYear()} Otto Group</p>
            <div className="flex flex-wrap items-center gap-6">
              {legalLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[12px] font-normal leading-[1.4] text-otto-burgundy transition-opacity hover:opacity-75 sm:text-[14px]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      <ScrollToTop />
    </>
  );
}

function SocialIcon({ name }: { name: string }) {
  const iconClass = 'h-[13px] w-[13px]';
  const spritePath = '/footer-social-sprite.svg';

  switch (name) {
    case 'LinkedIn':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 13 13" aria-hidden>
          <use href={`${spritePath}#icon-linkedin`} xlinkHref={`${spritePath}#icon-linkedin`} />
        </svg>
      );
    case 'Instagram':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 16 16" aria-hidden>
          <use href={`${spritePath}#icon-instagram`} xlinkHref={`${spritePath}#icon-instagram`} />
        </svg>
      );
    case 'YouTube':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 14" aria-hidden>
          <use href={`${spritePath}#icon-youtube`} xlinkHref={`${spritePath}#icon-youtube`} />
        </svg>
      );
    case 'SoundCloud':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 12" aria-hidden>
          <use href={`${spritePath}#icon-soundcloud`} xlinkHref={`${spritePath}#icon-soundcloud`} />
        </svg>
      );
    case 'X':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 17 17" aria-hidden>
          <use href={`${spritePath}#icon-x`} xlinkHref={`${spritePath}#icon-x`} />
        </svg>
      );
    case 'Facebook':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 10 18" aria-hidden>
          <use href={`${spritePath}#icon-facebook`} xlinkHref={`${spritePath}#icon-facebook`} />
        </svg>
      );
    default:
      return null;
  }
}
