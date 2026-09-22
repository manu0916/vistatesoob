/* oxlint-disable next/no-img-element -- Media is preoptimized locally; ArtImage supplies responsive srcsets and dimensions. */
'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { SiteLink as Link } from '@/components/site-link';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  MessageCircle,
  Minus,
  Play,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  editorialPhotos,
  looks,
  photo,
  video,
  type Look,
  type Photo,
} from '@/lib/catalog';
import { siteConfig, type OrderInput } from '@/lib/site-config';
import { cloneWhatsAppUrl } from '@/lib/clone-whatsapp';

type CloneContact = { cloneWhatsAppNumber: string | null };

export function ArtImage({
  item,
  className = '',
  priority = false,
  sizes = '(max-width: 700px) 88vw, 45vw',
  style,
}: {
  item: Photo;
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src={`/media/${item.src}`}
      srcSet={item.variants
        .map((variant) => `/media/${variant.src} ${variant.width}w`)
        .join(', ')}
      sizes={sizes}
      width={item.width}
      height={item.height}
      alt={item.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={className}
      style={style}
    />
  );
}

export function ContactLink({
  children,
  className = 'action action-red',
  input,
  cloneWhatsAppNumber,
}: {
  children?: React.ReactNode;
  className?: string;
  input?: OrderInput;
} & CloneContact) {
  const [open, setOpen] = useState(false);
  const reference = input?.reference;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        className={`${className} contact-trigger`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        {children || 'Encomendar sua peça'} <ArrowUpRight size={18} />
      </button>
      <DialogContent
        className="contact-dialog"
        showCloseButton={false}
        aria-describedby="contact-dialog-description"
      >
        <div className="contact-dialog-visual" aria-hidden="true">
          <ArtImage
            item={photo('editorial-03')}
            sizes="(max-width:700px) 92vw, 390px"
          />
          <span>TESOOB / CONTATO DIRETO</span>
          <img
            className="contact-dialog-logo"
            src="/media/logo-tesoob.png"
            width="701"
            height="144"
            alt=""
          />
        </div>
        <div className="contact-dialog-copy">
          <div className="contact-dialog-topline">
            <span>ESCOLHA SEU CANAL</span>
            <DialogClose
              render={
                <Button
                  className="contact-dialog-close"
                  variant="ghost"
                  aria-label="Fechar opções de contato"
                />
              }
            >
              <X size={20} />
            </DialogClose>
          </div>
          <p className="eyebrow">
            <span className="red-dot" /> ENCOMENDE SUA PEÇA
          </p>
          <DialogTitle className="contact-dialog-title">
            VAMOS TIRAR
            <br />
            SUA IDEIA DO
            <br />
            <span>PAPEL.</span>
          </DialogTitle>
          <DialogDescription
            id="contact-dialog-description"
            className="contact-dialog-description"
          >
            {reference ? (
              <>
                A referência <strong>{reference}</strong> já vai identificada na
                sua mensagem. Escolha por onde prefere conversar.
              </>
            ) : (
              'Escolha por onde prefere conversar com a Tesoob sobre valores, disponibilidade e possibilidades.'
            )}
          </DialogDescription>
          <div className="contact-dialog-actions">
            <a
              href={cloneWhatsAppUrl(cloneWhatsAppNumber, input)}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-channel contact-channel-primary"
            >
              <span>
                <MessageCircle size={20} />
                <span>
                  <small>RESPOSTA DIRETA</small>
                  WhatsApp
                </span>
              </span>
              <ArrowUpRight size={20} />
            </a>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-channel"
            >
              <span>
                <Camera size={20} />
                <span>
                  <small>@VISTATESOOB</small>
                  Instagram
                </span>
              </span>
              <ArrowUpRight size={20} />
            </a>
          </div>
          <p className="contact-dialog-note">
            SEM CADASTRO / CONVERSA DIRETA COM A MARCA
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SiteHeader({ cloneWhatsAppNumber }: CloneContact) {
  return (
    <header className="site-header">
      <Link href="/" aria-label="Tesoob, início">
        <img
          className="brand-logo"
          src="/media/logo-tesoob.png"
          alt="Tesoob"
          width="701"
          height="144"
        />
      </Link>
      <nav aria-label="Principal">
        {[
          ['Peças', 'pecas'],
          ['Editorial', 'editorial'],
          ['Processo', 'processo'],
        ].map(([label, id]) => (
          <Link key={id} href={`/#${id}`}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="header-right">
        <ContactLink
          className="header-contact"
          cloneWhatsAppNumber={cloneWhatsAppNumber}
        >
          Encomendar
        </ContactLink>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link href="/" aria-label="Tesoob, início">
          <img
            src="/media/logo-tesoob.png"
            alt="Tesoob"
            width="220"
            height="45"
          />
        </Link>
        <p>O comum ficou para trás.</p>
        <a
          href={siteConfig.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          @vistatesoob <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>TESOOB / PEÇAS EXCLUSIVAS</span>
        <a
          href={siteConfig.creatorInstagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          Por Lúcio Henrique <ArrowUpRight size={12} />
        </a>
        <span className="footer-credit">
          Site criado por <strong>emanuel silv</strong>
        </span>
        <Link href="/admin">Configurar WhatsApp</Link>
        <span>{siteConfig.locality} / Envio para todo o Brasil</span>
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        <a href="#conteudo">Voltar ao topo ↑</a>
      </div>
    </footer>
  );
}

function Motion() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll<HTMLElement>('[data-reveal]')
      .forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top > window.innerHeight)
          element.classList.add('reveal-ready');
        observer.observe(element);
      });
    const clear = () => {
      if (preference.matches) {
        document
          .querySelectorAll('.reveal-ready')
          .forEach((element) => element.classList.remove('reveal-ready'));
        observer.disconnect();
      }
    };
    preference.addEventListener('change', clear);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', clear);
    };
  }, []);
  return null;
}

function Hero({ cloneWhatsAppNumber }: CloneContact) {
  const frame = useRef<HTMLDivElement>(null);
  function parallax(event: React.PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== 'mouse' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !frame.current
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    frame.current.style.setProperty(
      '--pointer-x',
      `${((event.clientX - rect.left) / rect.width - 0.5) * 14}px`,
    );
    frame.current.style.setProperty(
      '--pointer-y',
      `${((event.clientY - rect.top) / rect.height - 0.5) * 14}px`,
    );
  }
  return (
    <section className="hero" id="inicio">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="red-dot" /> VISTA SUA PRÓPRIA ATITUDE
        </p>
        <h1>
          <span className="title-line">
            <span>O COMUM</span>
          </span>
          <span className="title-line">
            <span>FICOU</span>
          </span>
          <span className="title-line title-red title-brand">
            <span className="brand-accent">PARA TRÁS.</span>
          </span>
        </h1>
        <div className="hero-bottom">
          <p>
            Peças exclusivas.
            <br />
            Presença que não pede licença.
          </p>
        </div>
        <div className="hero-ctas">
          <Link href="#pecas" className="action action-red">
            Explorar as peças{' '}
            <ArrowUpRight size={20} />
          </Link>
          <ContactLink
            className="hero-order-cta"
            cloneWhatsAppNumber={cloneWhatsAppNumber}
          >
            Encomendar uma peça
          </ContactLink>
        </div>
        <a className="scroll-note" href="#pecas">
          <ArrowDown size={14} /> UM NOVO OLHAR, LOGO ABAIXO
        </a>
      </div>
      <div
        className="hero-art"
        onPointerMove={parallax}
        onPointerLeave={() => {
          frame.current?.style.setProperty('--pointer-x', '0px');
          frame.current?.style.setProperty('--pointer-y', '0px');
        }}
      >
        <div className="hero-frame" ref={frame}>
          <ArtImage item={photo('editorial-01')} priority />
          <span className="photo-caption">TESOOB / EDITORIAL</span>
        </div>
        <span className="side-caption">THE ORDINARY HAS BEEN LEFT BEHIND.</span>
        <span className="hero-stamp">
          PEÇAS
          <br />
          EXCLUSIVAS <ArrowUpRight size={24} />
        </span>
      </div>
    </section>
  );
}

function LookCard({
  look,
  index,
  cloneWhatsAppNumber,
}: { look: Look; index: number } & CloneContact) {
  const href = cloneWhatsAppUrl(cloneWhatsAppNumber, {
    reference: `REF. ${look.ref} — ${look.name}`,
  });
  const external = { target: '_blank', rel: 'noopener noreferrer' };
  return (
    <article className={`look-card look-${index + 1}`} data-reveal>
      <Link
        href={href}
        {...external}
        className="look-image-link"
        aria-label={`Ver ${look.name}`}
      >
        <ArtImage item={photo(look.cover)} className="look-image" />
        <ArtImage
          item={photo(look.alternate)}
          className="look-image-alternate"
        />
        <span className="look-badge">REF. {look.ref}</span>
        <span className="look-open">
          <ArrowUpRight size={24} />
          <span>VER DETALHES</span>
        </span>
      </Link>
      <div className="look-card-copy">
        <div className="look-label">
          <span className={`color-swatch ${look.color}`} />
          <p>REFERÊNCIA {look.ref}</p>
          <span>CONSULTE A ENCOMENDA</span>
        </div>
        <Link href={href} {...external}>
          <h3>{look.title}</h3>
        </Link>
        {index === 2 && <p className="look-description">{look.description}</p>}
        <Link className="text-link" href={href} {...external}>
          Conhecer a referência <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export function PhotoGallery({
  images = editorialPhotos,
  compact = false,
}: {
  images?: Photo[];
  compact?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchStart = useRef<number | null>(null);
  const current = images[active ?? 0];
  const move = (step: number) =>
    setActive((value) =>
      value === null ? null : (value + step + images.length) % images.length,
    );
  function open(index: number, event: React.MouseEvent<HTMLElement>) {
    returnFocus.current = event.currentTarget;
    setActive(index);
  }
  return (
    <>
      <div className={compact ? 'detail-photo-grid' : 'editorial-grid'}>
        {images
          .slice(0, expanded || compact ? images.length : 6)
          .map((item, index) => (
            <button
              key={item.id}
              className={`gallery-photo gallery-photo-${index + 1}`}
              type="button"
              onClick={(event) => open(index, event)}
              aria-label={`Ampliar foto ${index + 1}: ${item.alt}`}
            >
              <ArtImage
                item={item}
                sizes={
                  compact
                    ? '(max-width:700px) 43vw, 24vw'
                    : '(max-width:700px) 43vw, 30vw'
                }
              />
              <span className="image-expand">
                <Plus size={19} />
              </span>
              <span className="gallery-number">
                {String(index + 1).padStart(2, '0')} / TESOOB
              </span>
            </button>
          ))}
      </div>
      {!compact && (
        <div className="gallery-bottom">
          <p>Um olhar por inteiro. {images.length} fotografias.</p>
          <Button
            className="action gallery-more"
            variant="outline"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded
              ? 'Recolher arquivo'
              : `Ver arquivo completo — ${images.length} fotos`}
            {expanded ? <Minus size={17} /> : <Plus size={17} />}
          </Button>
        </div>
      )}
      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent
          className="lightbox"
          showCloseButton={false}
          fullScreen
          finalFocus={returnFocus}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              move(1);
            }
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              move(-1);
            }
          }}
        >
          <DialogTitle className="sr-only">Fotografias Tesoob</DialogTitle>
          <DialogDescription className="sr-only">
            {current.alt} Use as setas para navegar e Escape para fechar.
          </DialogDescription>
          <div className="lightbox-top">
            <span>
              TESOOB / {String((active ?? 0) + 1).padStart(2, '0')} —{' '}
              {images.length}
            </span>
            <DialogClose
              render={
                <Button
                  className="icon-button"
                  variant="ghost"
                  aria-label="Fechar fotografia"
                />
              }
            >
              <X />
            </DialogClose>
          </div>
          <div
            className="lightbox-photo"
            onTouchStart={(event) => {
              touchStart.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              if (touchStart.current !== null) {
                const delta =
                  event.changedTouches[0].clientX - touchStart.current;
                if (Math.abs(delta) > 60) move(delta < 0 ? 1 : -1);
              }
              touchStart.current = null;
            }}
          >
            <ArtImage
              item={current}
              priority
              sizes="(max-width:700px) 95vw, 80vw"
            />
          </div>
          <div className="lightbox-bottom">
            <Button
              className="icon-button"
              variant="ghost"
              onClick={() => move(-1)}
              aria-label="Fotografia anterior"
            >
              <ArrowLeft />
            </Button>
            <p aria-live="polite">{current.alt}</p>
            <Button
              className="icon-button"
              variant="ghost"
              onClick={() => move(1)}
              aria-label="Próxima fotografia"
            >
              <ArrowRight />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function VideoPlayer({
  id,
  className = '',
  continuous = false,
}: {
  id: string;
  className?: string;
  continuous?: boolean;
}) {
  const item = video(id);
  const element = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(continuous);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!started || !element.current) return;
    if (continuous) {
      // Muted inline playback is eligible for autoplay on mobile too.
      // Keep native controls available if the browser blocks it or the visitor pauses.
      element.current.muted = true;
      void element.current.play().catch(() => {});
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) element.current?.pause();
      },
      { threshold: 0.1 },
    );
    observer.observe(element.current);
    return () => observer.disconnect();
  }, [started, continuous]);
  return (
    <div
      className={`video-player ${className}`}
      style={
        { '--video-ratio': `${item.width} / ${item.height}` } as CSSProperties
      }
    >
      {started ? (
        <video
          ref={element}
          src={`/media/${item.src}`}
          poster={`/media/${item.poster}`}
          width={item.width}
          height={item.height}
          controls
          playsInline
          muted
          loop={continuous}
          preload="metadata"
          autoPlay
          onError={() => setError(true)}
          aria-label={item.title}
        />
      ) : (
        <button
          type="button"
          className="video-poster"
          onClick={() => setStarted(true)}
          aria-label={`Reproduzir: ${item.title}`}
        >
          <img
            src={`/media/${item.poster}`}
            width={item.width}
            height={item.height}
            alt={item.title}
            loading="lazy"
          />
          <span className="play-circle">
            <Play fill="currentColor" size={20} />
          </span>
          <span className="video-caption">
            {item.title}
            <small>
              {Math.round(item.duration)} S / ASSISTIR{' '}
              <ArrowUpRight size={14} />
            </small>
          </span>
        </button>
      )}
      {error && (
        <p className="video-error">
          Não foi possível carregar o vídeo.{' '}
          <a href={`/media/${item.src}`}>Abrir o arquivo</a>
        </p>
      )}
    </div>
  );
}

function CloseDetails({ cloneWhatsAppNumber }: CloneContact) {
  const entries = [
    {
      id: 'amarracoes',
      label: 'Amarrações',
      title: 'O detalhe que conecta.',
      copy: 'Linhas que atravessam o vermelho. Amarrações e ilhoses fazem parte do desenho do look.',
      photo: 'editorial-06',
      look: looks[0],
    },
    {
      id: 'ferragens',
      label: 'Ferragens',
      title: 'Presença em cada encontro.',
      copy: 'Cintos, ilhoses e fivelas no verde militar. A força está nos encontros entre os detalhes.',
      photo: 'editorial-09',
      look: looks[1],
    },
    {
      id: 'camadas',
      label: 'Camadas',
      title: 'Mais de uma forma de olhar.',
      copy: 'Jeans claro, roxo e aplicações. Cada camada deixa outro detalhe aparecer.',
      photo: 'processo-04',
      look: looks[2],
    },
  ];
  return (
    <section className="close-section section" data-reveal>
      <p className="eyebrow">03 / DE PERTO</p>
      <Tabs defaultValue="amarracoes" className="close-tabs">
        <div className="close-tabs-heading">
          <h2>
            NADA AQUI É<br />
            <span className="brand-accent">POR ACASO.</span>
          </h2>
          <TabsList
            className="detail-tabs"
            variant="line"
            aria-label="Detalhes das peças"
          >
            {entries.map((item, index) => (
              <TabsTrigger key={item.id} value={item.id}>
                <span>0{index + 1}</span>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {entries.map((item) => (
          <TabsContent key={item.id} value={item.id} className="close-content">
            <div className="close-photo">
              <img
                src={`/media/detalhes-${item.id}.webp`}
                width={
                  item.id === 'camadas'
                    ? 800
                    : item.id === 'ferragens'
                      ? 520
                      : 490
                }
                height={
                  item.id === 'camadas'
                    ? 800
                    : item.id === 'ferragens'
                      ? 520
                      : 490
                }
                alt={`Detalhe de ${item.label.toLowerCase()} da referência ${item.look.ref}`}
                loading="lazy"
              />
              <span className="detail-cross" aria-hidden="true">
                +
              </span>
            </div>
            <div className="close-copy">
              <span className="eyebrow">AMPLIE SEU OLHAR</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <div className="stitch-line" aria-hidden="true">
                <svg viewBox="0 0 320 46" fill="none">
                  <path d="M0 23H56L72 9L88 37L104 9L120 37L136 9L152 37L168 9L184 37L200 9L216 37L232 23H320" />
                </svg>
              </div>
              <Link
                className="text-link"
                href={cloneWhatsAppUrl(cloneWhatsAppNumber, {
                  reference: `REF. ${item.look.ref} — ${item.look.name}`,
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver a referência completa <ArrowUpRight size={17} />
              </Link>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="process-section" id="processo">
      <div className="section">
        <div className="process-heading" data-reveal>
          <div>
            <p className="eyebrow">04 / POR TRÁS DA PEÇA</p>
            <h2>
              O DETALHE FAZ
              <br />
              PARTE DA PEÇA.
            </h2>
          </div>
          <p>
            Do recorte à aplicação.
            <br />
            Um olhar para o processo, para as mãos
            <br />e para o que se constrói de perto.
          </p>
        </div>
        <div className="process-grid">
          <figure className="process-main" data-reveal>
            <ArtImage item={photo('processo-01')} />
            <figcaption>01 / ENTRE IDEIAS, RECORTES E APLICAÇÕES.</figcaption>
          </figure>
          <div className="process-film" data-reveal>
            <VideoPlayer id="processo-filme" continuous />
            <p>
              O processo em movimento. <ArrowUpRight size={15} />
            </p>
          </div>
          <figure className="process-bw" data-reveal>
            <ArtImage item={photo('processo-03')} />
            <figcaption>02 / UM OLHAR SOBRE A CONSTRUÇÃO.</figcaption>
          </figure>
          <div className="process-note" data-reveal>
            <span className="editorial-plus" aria-hidden="true">
              +
            </span>
            <p>
              ANTES DE VESTIR,
              <br />
              EXISTE UM
              <br />
              <span className="brand-accent">OLHAR.</span>
            </p>
            <a
              className="text-link"
              href={siteConfig.creatorInstagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Por Lúcio Henrique <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrderSection({ cloneWhatsAppNumber }: CloneContact) {
  return (
    <section className="order-section section" id="encomendar">
      <div className="order-intro" data-reveal>
        <p className="eyebrow">
          <span className="red-dot" /> 05 / DO SEU JEITO
        </p>
        <h2>
          SUA PRÓXIMA PEÇA
          <br />
          COMEÇA NUMA
          <br />
          <span className="brand-accent">CONVERSA.</span>
        </h2>
        <p className="order-description">
          Envie a referência que chamou sua atenção.
          <br />
          Converse com a Tesoob sobre valores, disponibilidade
          <br />e possibilidades para sua encomenda.
        </p>
        <ContactLink cloneWhatsAppNumber={cloneWhatsAppNumber} />
        <p className="contact-note">Sem cadastro. Contato direto pelo WhatsApp.</p>
      </div>
      <div className="order-side" data-reveal>
        <figure className="plate-photo">
          <ArtImage
            item={photo('placa')}
            sizes="(max-width:700px) 70vw, 25vw"
          />
          <figcaption>O COMUM FICOU PARA TRÁS.</figcaption>
        </figure>
        <ol className="order-steps">
          <li>
            <span>01</span>
            <div>
              Escolha uma referência
              <small>Encontre o look ou detalhe que é a sua cara.</small>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              Comece a conversa
              <small>Envie a referência e conte sua ideia.</small>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              Combine os detalhes
              <small>Consulte valores e possibilidades com a marca.</small>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}

function MobileContact({ cloneWhatsAppNumber }: CloneContact) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const start = document.getElementById('inicio');
    const end = document.getElementById('encomendar');
    if (!start || !end) return;
    let afterHero = false;
    let inContact = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === start)
          afterHero =
            !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        else inContact = entry.isIntersecting;
      });
      setVisible(afterHero && !inContact);
    });
    observer.observe(start);
    observer.observe(end);
    return () => observer.disconnect();
  }, []);
  return visible ? (
    <div className="mobile-contact">
      <span>Sua próxima peça?</span>
      <ContactLink
        className="action action-red"
        cloneWhatsAppNumber={cloneWhatsAppNumber}
      >
        Encomendar
      </ContactLink>
    </div>
  ) : null;
}

export function HomePage({ cloneWhatsAppNumber }: CloneContact) {
  return (
    <>
      <SiteHeader cloneWhatsAppNumber={cloneWhatsAppNumber} />
      <main>
        <Hero cloneWhatsAppNumber={cloneWhatsAppNumber} />
        <div className="statement-strip" aria-hidden="true">
          <span>ROUPA É EXPRESSÃO.</span>
          <span>TESOOB</span>
          <span>O COMUM FICOU PARA TRÁS.</span>
          <ArrowUpRight />
        </div>
        <section id="pecas" className="section looks-section">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">01 / AS PEÇAS</p>
              <h2>
                ATITUDE EM
                <br />
                <span className="brand-accent">CADA DETALHE.</span>
              </h2>
            </div>
            <p>
              Amarrações. Ferragens. Recortes.
              <br />
              Explore as referências e encontre
              <br />o que conversa com você.
            </p>
          </div>
          <div className="looks-grid">
            {looks.map((look, index) => (
              <LookCard
                look={look}
                index={index}
                key={look.slug}
                cloneWhatsAppNumber={cloneWhatsAppNumber}
              />
            ))}
          </div>
        </section>
        <section className="editorial-section section" id="editorial">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">02 / NOSSO UNIVERSO</p>
              <h2>
                FORA DO ÓBVIO.
                <br />
                <span className="brand-accent">DENTRO DA CENA.</span>
              </h2>
            </div>
            <p>
              Entre metal, cor e movimento.
              <br />O editorial Tesoob, por inteiro.
            </p>
          </div>
          <PhotoGallery />
          <div className="editorial-film-row" data-reveal>
            <div>
              <p className="eyebrow">APERTE O PLAY</p>
              <h3>
                A CENA
                <br />
                CONTINUA.
              </h3>
              <p>
                As peças, as pessoas e o cenário.
                <br />
                Veja o editorial em movimento.
              </p>
            </div>
            <VideoPlayer id="editorial-filme" continuous />
          </div>
        </section>
        <CloseDetails cloneWhatsAppNumber={cloneWhatsAppNumber} />
        <ProcessSection />
        <OrderSection cloneWhatsAppNumber={cloneWhatsAppNumber} />
      </main>
      <SiteFooter />
      <MobileContact cloneWhatsAppNumber={cloneWhatsAppNumber} />
      <Motion />
    </>
  );
}
