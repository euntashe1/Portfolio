/* ========================================
   Portfolio Homepage JavaScript
   Extracted from index.html
======================================== */

/* ========================================
   01. COMMON / SETTINGS
======================================== */
(() => {
      const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      // ==================================================
      // ★ 초보자용 애니메이션 설정
      // 아래 숫자만 바꾸면 주요 모션의 속도와 부드러움을 조절할 수 있습니다.
      // ==================================================
      const MOTION_SETTINGS = {
        introLineDuration: 1.35,// 포트폴리오 소개 제목 첫 줄이 등장하는 시간(초)
        ideaTypingDelay: 65,    // 한글 아이디어 문구 한 글자가 입력되는 간격(ms)
        ideaScrub: 1.4,         // 아이디어 원형이 스크롤을 따라오는 부드러움
        digitStopDelay: 180,    // 스크롤 정지 후 숫자 정렬을 시작하는 시간(ms)
        digitSettleDuration: .7,// 숫자가 360으로 감속·정렬되는 시간(초)
        legacyObjectScrub: .85, // 360° 장식 오브젝트의 스크롤 부드러움
        typingCharDelay: 55,    // 영문 제목 한 글자가 입력되는 기본 간격(ms)
        typingLinePause: 100    // 다음 줄 입력 전 쉬는 시간(ms)
      };

      // ==================================================
      // [0] 첫 진입 위치
      // 일반 index.html 접속은 항상 맨 위에서 시작합니다.
      // #approach, #about 같은 주소로 직접 들어온 경우에는 anchor를 유지합니다.
      // ==================================================
      const hasIntentionalHash = Boolean(location.hash);
      const initialAnchor = hasIntentionalHash ? document.getElementById(location.hash.slice(1)) : null;
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      const resetInitialScroll = () => {
        if (hasIntentionalHash) return;
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };
      resetInitialScroll();
      addEventListener('pageshow', resetInitialScroll);

      const openingIntro = document.querySelector('.opening-intro');
      const OPENING_INTRO_ENABLED = false;

      const handleInitialPagePosition = () => {
        if (initialAnchor) {
          // 주소에 명시된 #approach, #about 등의 기존 anchor 이동은 유지합니다.
          requestAnimationFrame(() => initialAnchor.scrollIntoView({ block: 'start' }));
        } else {
          resetInitialScroll();
          // 일부 브라우저가 load 직후 이전 위치를 늦게 복원하는 경우까지 막습니다.
          [0, 100, 500].forEach(delay => setTimeout(resetInitialScroll, delay));
        }
      };

      function initOpeningIntroMotion() {
        // 빠르게 조정된 오프닝 애니메이션입니다.
        // CSS의 opening-* animation delay/duration과 맞춰 약 1.8초 안에 종료됩니다.
        setTimeout(() => {
          if (openingIntro) openingIntro.classList.add('done');
          document.body.classList.remove('loading');
        }, reduceMotion ? 0 : 1800);
      }

      // ========================================
      // INTRO / OPENING TEXT MOTION
      // 현재 임시 비활성화
      // 다시 사용하려면 OPENING_INTRO_ENABLED 값을 true로 바꾸세요.
      // ========================================
      if (OPENING_INTRO_ENABLED) {
        addEventListener('load', () => {
          handleInitialPagePosition();
          initOpeningIntroMotion();
        });
      } else {
        if (openingIntro) {
          openingIntro.classList.add('done');
          openingIntro.style.opacity = '0';
          openingIntro.style.visibility = 'hidden';
        }
        document.body.classList.remove('loading');
        addEventListener('load', handleInitialPagePosition);
      }
      const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

      // ==================================================
      // [1] 메뉴 열기 / 닫기
      // ==================================================
      const menu = $('.menu-panel'), menuBtn = $('.menu-btn'), closeBtn = $('.menu-close');
      const toggleMenu = (open) => { if (window.jQuery) { jQuery(menu).toggleClass('open', open); jQuery(document.body).toggleClass('menu-open', open) } else { menu.classList.toggle('open', open); document.body.classList.toggle('menu-open', open) } menu.setAttribute('aria-hidden', String(!open)) };
      menuBtn.addEventListener('click', () => toggleMenu(true)); closeBtn.addEventListener('click', () => toggleMenu(false)); $$('.menu-panel a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
      const video = $('.hero video');
      const quick = $('.quick'); $('.quick-toggle').addEventListener('click', e => { quick.classList.toggle('open'); e.currentTarget.textContent = quick.classList.contains('open') ? '×' : '+' });
      const modal = $('.modal'); const setModal = open => { modal.classList.toggle('open', open); modal.setAttribute('aria-hidden', String(!open)); document.body.classList.toggle('menu-open', open) }; $('.notice').addEventListener('click', () => setModal(true)); $('.modal-card button').addEventListener('click', () => setModal(false)); modal.addEventListener('click', e => { if (e.target === modal) setModal(false) }); addEventListener('keydown', e => { if (e.key === 'Escape') { setModal(false); toggleMenu(false) } });
      addEventListener('scroll', () => { const y = scrollY; document.body.classList.toggle('hero-view', y < innerHeight * .92); quick.classList.toggle('show', y > innerHeight * .92) }, { passive: true }); dispatchEvent(new Event('scroll'));

      // ==================================================
      // [2] 마키 Swiper / 프로젝트 영상 재생 상태
      // Featured Projects는 세로 스크롤 구조이며, 다른 영역의 Swiper만 유지합니다.
      // ==================================================
      const syncProjectVideos = () => $$('.project-video').forEach(projectVideo => {
        const bounds = projectVideo.getBoundingClientRect();
        const isVisible = bounds.bottom > 0 && bounds.top < innerHeight;
        if (isVisible) projectVideo.play().catch(() => { }); else projectVideo.pause();
      });
      $$('.project-video').forEach(projectVideo => new IntersectionObserver(syncProjectVideos, { threshold: .15 }).observe(projectVideo));
      syncProjectVideos();
      let shortsSwiper;
      if (window.Swiper && $('.shortsSwiper')) {
        shortsSwiper = new Swiper('.shortsSwiper', { slidesPerView: 1.15, spaceBetween: 18, grabCursor: true, pagination: { el: '.shortsSwiper .swiper-pagination', clickable: true }, breakpoints: { 560: { slidesPerView: 2.1, spaceBetween: 20 }, 900: { slidesPerView: 3.1, spaceBetween: 24 }, 1280: { slidesPerView: 3.8, spaceBetween: 28 }, 1600: { slidesPerView: 4, spaceBetween: 30 } } });
      }
      const videoModal = $('#videoModal'), modalContainer = $('#modalContainer'), videoPlayerArea = $('#videoPlayerArea');
      const closeShortformModal = () => {
        if (!videoModal) return;
        videoModal.classList.remove('open');
        videoModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        if (videoPlayerArea) videoPlayerArea.innerHTML = '';
      };
      const openShortformModal = card => {
        if (!videoModal || !modalContainer || !videoPlayerArea) return;
        const videoUrl = card.dataset.videoUrl;
        const isVertical = card.dataset.videoType === 'vertical';
        if (!videoUrl) return;
        modalContainer.classList.toggle('vertical', isVertical);
        videoPlayerArea.innerHTML = '';
        const modalVideo = document.createElement('video');
        modalVideo.src = videoUrl;
        modalVideo.controls = true;
        modalVideo.autoplay = true;
        modalVideo.playsInline = true;
        modalVideo.setAttribute('playsinline', '');
        videoPlayerArea.appendChild(modalVideo);
        videoModal.classList.add('open');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        modalVideo.play().catch(() => { });
      };
      $$('.shortform-card').forEach(card => {
        const preview = $('.shortform-media video', card);
        card.addEventListener('click', () => openShortformModal(card));
        if (preview && matchMedia('(hover:hover)').matches) {
          card.addEventListener('mouseenter', () => preview.play().catch(() => { }));
          card.addEventListener('mouseleave', () => { preview.pause(); preview.currentTime = 0 });
        }
      });
      $('.shortform-close')?.addEventListener('click', closeShortformModal);
      videoModal?.addEventListener('click', event => { if (event.target === videoModal) closeShortformModal() });
      addEventListener('keydown', event => { if (event.key === 'Escape') closeShortformModal() });
      if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger, window.ScrollToPlugin);
        if (window.ScrollSmoother && innerWidth > 1024 && !matchMedia('(prefers-reduced-motion: reduce)').matches) { gsap.registerPlugin(ScrollSmoother); ScrollSmoother.create({ smooth: 1.05, effects: true, smoothTouch: false }) }

        // ==================================================
        // [2] 영문 제목 타이핑
        // 제목이 화면에 처음 들어왔을 때만 줄별로 한 글자씩 출력합니다.
        // ==================================================
        const wait = delay => new Promise(resolve => setTimeout(resolve, delay));
        const getTypingDelay = character => character === '.' ? 180 : character === ',' ? 140 : character === ' ' ? 65 : MOTION_SETTINGS.typingCharDelay;
        const typeTitle = async title => {
          if (title.dataset.typed === 'true') return;
          title.dataset.typed = 'true';
          const lines = $$('.typing-line', title);
          for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex], output = $('.typing-output', line), text = line.dataset.typingText || '';
            if (!output) continue;
            line.classList.add('is-typing');
            for (const character of text) {
              output.textContent += character;
              await wait(getTypingDelay(character));
            }
            if (lineIndex < lines.length - 1) {
              line.classList.remove('is-typing');
              await wait(MOTION_SETTINGS.typingLinePause);
            }
          }
          const lastLine = lines[lines.length - 1];
          await wait(650);
          lastLine.classList.add('typing-done');
          await wait(250);
          lastLine.classList.remove('is-typing');
        };
        if (!reduceMotion) {
          $$('.typing-title').forEach(title => ScrollTrigger.create({ trigger: title, start: 'top 80%', once: true, onEnter: () => typeTitle(title) }));

          let introTitleTl;
          const playIntroTitleMotion = () => {
            if (introTitleTl) introTitleTl.kill();
            gsap.killTweensOf('.portfolio-intro .intro-motion-line');
            introTitleTl = gsap.timeline()
              .fromTo('.portfolio-intro .ideas-line', { y: -110, opacity: 0 }, { y: 0, opacity: 1, duration: MOTION_SETTINGS.introLineDuration, ease: 'power4.out', overwrite: true })
              .fromTo('.portfolio-intro .digital-line', { x: 180, opacity: 0 }, { x: 0, opacity: 1, duration: 1.45, ease: 'power4.out', overwrite: true }, '-=.55')
              .fromTo('.portfolio-intro .experiences-line', { x: 180, opacity: 0 }, { x: 0, opacity: 1, duration: 1.55, ease: 'power4.out', overwrite: true }, '-=.45');
          };
          ScrollTrigger.create({ trigger: '.intro-motion-title', start: 'top 78%', end: 'bottom 22%', onEnter: playIntroTitleMotion, onEnterBack: playIntroTitleMotion });
        } else {
          gsap.set('.portfolio-intro .intro-motion-line', { x: 0, y: 0, opacity: 1 });
        }

        $$('.fade-up').forEach(el => gsap.to(el, { y: 0, opacity: 1, duration: .9, scrollTrigger: { trigger: el, start: 'top 85%' } }));
        if ($('.shortform-section')) {
          gsap.fromTo('.shortform-header', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.shortform-section', start: 'top 75%' } });
          gsap.fromTo('.shortform-card', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .85, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.shortsSwiper', start: 'top 78%' } });
        }
        if ($('.objects')) {
        if (!reduceMotion) {
          // ==================================================
          // [3] 아이디어 문구 타이핑
          // 아래/위 방향으로 섹션에 다시 진입할 때마다 처음부터 한 글자씩 재생합니다.
          // 실행 번호로 이전 비동기 입력을 즉시 중단해 빠르게 왕복해도 겹치지 않습니다.
          // ==================================================

          let ideaTypingRun = 0;
          const ideaTypingSegments = [
            { element: $('.idea-before'), text: '아이디어가 ' },
            { element: $('.idea-typing-highlight'), text: '경험', highlight: true },
            { element: $('.idea-join'), text: '으로' },
            { element: $('.idea-after'), text: '피어나는 순간' }
          ];
          const resetIdeaTyping = () => {
            ideaTypingSegments.forEach(segment => {
              if (!segment.element) return;
              segment.element.textContent = '';
              if (segment.highlight) segment.element.classList.remove('has-text');
            });
          };
          const playIdeaTyping = async () => {
            const currentRun = ++ideaTypingRun;
            resetIdeaTyping();
            for (const segment of ideaTypingSegments) {
              for (const character of segment.text) {
                if (currentRun !== ideaTypingRun) return;
                if (!segment.element) continue;
                if (segment.highlight) segment.element.classList.add('has-text');
                segment.element.textContent += character;
                await wait(MOTION_SETTINGS.ideaTypingDelay);
              }
            }
          };
          resetIdeaTyping();
          ScrollTrigger.create({ trigger: '.objects', start: 'top 78%', end: 'bottom 22%', onEnter: playIdeaTyping, onEnterBack: playIdeaTyping });

          // ==================================================
          // [4] 아이디어 섹션 원형 움직임
          // 배경은 고정된 채 원형만 스크롤 진행률에 맞춰 움직입니다.
          // ==================================================
          const motionMm = gsap.matchMedia();
          motionMm.add({ desktop: '(min-width: 901px)', tablet: '(max-width: 900px)', mobile: '(max-width: 560px)' }, context => {
            const compact = !context.conditions.desktop;
            const gather = compact ? {
              one: { x: '17vw', y: '14vh', scale: .9, rotation: 18 }, two: { x: '-20vw', y: '10vh', scale: .94, rotation: -16 }, three: { x: '-10vw', y: '-14vh', scale: .92, rotation: 14 }, four: { x: '13vw', y: '-14vh', scale: .9, rotation: -12 }
            } : {
              one: { x: '23vw', y: '21vh', scale: .86, rotation: 24 }, two: { x: '-24vw', y: '14vh', scale: .92, rotation: -20 }, three: { x: '-14vw', y: '-21vh', scale: .9, rotation: 18 }, four: { x: '17vw', y: '-19vh', scale: .9, rotation: -16 }
            };
            const bloom = compact ? {
              one: { x: '-1.7vw', y: '-2.5vh', scale: 1.03, rotation: 74 }, two: { x: '2.5vw', y: '-3.4vh', scale: 1.02, rotation: -68 }, three: { x: '2.5vw', y: '2.5vh', scale: 1.06, rotation: 62 }, four: { x: '-2.5vw', y: '3.4vh', scale: .96, rotation: -58 }
            } : {
              one: { x: '-2.5vw', y: '-4.2vh', scale: 1.08, rotation: 120 }, two: { x: '3.4vw', y: '-6vh', scale: 1.05, rotation: -100 }, three: { x: '4.2vw', y: '4.2vh', scale: 1.12, rotation: 90 }, four: { x: '-3.4vw', y: '4.2vh', scale: .94, rotation: -80 }
            };
            const drift = compact ? {
              one: { x: '.85vw', y: '-4.2vh', scale: 1, rotation: 88 }, two: { x: '-.85vw', y: '1.7vh', scale: .98, rotation: -82 }, three: { x: '.85vw', y: '-1.7vh', scale: 1.02, rotation: 78 }, four: { x: '-.85vw', y: '.85vh', scale: .94, rotation: -72 }
            } : {
              one: { x: '.85vw', y: '-6.8vh', scale: 1.03, rotation: 154 }, two: { x: '-.85vw', y: '2.5vh', scale: 1, rotation: -132 }, three: { x: '1.7vw', y: '-2.5vh', scale: 1.07, rotation: 122 }, four: { x: '-1.7vw', y: '1.7vh', scale: .96, rotation: -108 }
            };
            gsap.set('.glow', { opacity: 0, scale: 1 });
            gsap.to('.objects-stage', { y: () => document.querySelector('.objects').offsetHeight - innerHeight, ease: 'none', scrollTrigger: { trigger: '.objects', start: 'top top', end: 'bottom bottom', scrub: 1.4, invalidateOnRefresh: true } });
            const orbTl = gsap.timeline({ scrollTrigger: { trigger: '.objects', start: 'top top', end: 'bottom bottom', scrub: MOTION_SETTINGS.ideaScrub, invalidateOnRefresh: true } });
            orbTl
              .to('.orb.one', { ...gather.one, duration: 1.5, ease: 'none' }, 0)
              .to('.orb.two', { ...gather.two, duration: 1.5, ease: 'none' }, 0)
              .to('.orb.three', { ...gather.three, duration: 1.5, ease: 'none' }, 0)
              .to('.orb.four', { ...gather.four, duration: 1.5, ease: 'none' }, 0)
              .to('.orb', { scale: '+=0.035', duration: .4, ease: 'none' }, 1.5)
              .to('.orb.one', { ...bloom.one, duration: 1.5, ease: 'none' }, 1.9)
              .to('.orb.two', { ...bloom.two, duration: 1.5, ease: 'none' }, 1.9)
              .to('.orb.three', { ...bloom.three, duration: 1.5, ease: 'none' }, 1.9)
              .to('.orb.four', { ...bloom.four, duration: 1.5, ease: 'none' }, 1.9)
              .to('.glow', { opacity: .78, scale: 1.22, duration: 1, ease: 'none' }, 2.35)
              .to('.orb.one', { ...drift.one, duration: 2.25, ease: 'none' }, 3.4)
              .to('.orb.two', { ...drift.two, duration: 2.25, ease: 'none' }, 3.4)
              .to('.orb.three', { ...drift.three, duration: 2.25, ease: 'none' }, 3.4)
              .to('.orb.four', { ...drift.four, duration: 2.25, ease: 'none' }, 3.4);
          });
        } else {
          const reducedIdeaSegments = [
            [$('.idea-before'), '아이디어가 '],
            [$('.idea-typing-highlight'), '경험'],
            [$('.idea-join'), '으로'],
            [$('.idea-after'), '피어나는 순간']
          ];
          reducedIdeaSegments.forEach(([element, text]) => { if (element) element.textContent = text });
          $('.idea-typing-highlight')?.classList.add('has-text');
          gsap.set('.glow', { opacity: .78, scale: 1.22 });
        }
        }

        // ==================================================
        // [5] 360° 섹션 배경 / 장식 움직임
        // 배경(.legacy-bg)만 CSS sticky이며, petal은 absolute 요소입니다.
        // ==================================================
        if ($('.legacy')) {
        gsap.to('.legacy-mask', { clipPath: 'circle(85% at 50% 50%)', ease: 'none', scrollTrigger: { trigger: '.legacy', start: 'top bottom', end: 'top top', scrub: .6 } });
        gsap.to('.legacy-stage', { y: () => document.querySelector('.legacy').offsetHeight - innerHeight, ease: 'none', scrollTrigger: { trigger: '.legacy', start: 'top top', end: 'bottom bottom', scrub: .1, invalidateOnRefresh: true } });
        gsap.from('.legacy-content', { y: 90, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.legacy', start: 'top 80%', end: 'top 20%', scrub: .6 } });
        if (!reduceMotion) {
          const legacyObjectTl = gsap.timeline({ scrollTrigger: { trigger: '.legacy', start: 'top bottom', end: 'bottom top', scrub: MOTION_SETTINGS.legacyObjectScrub, invalidateOnRefresh: true } });
          legacyObjectTl
            .to('.petal.p1', { x: '30vw', y: '-25vh', rotation: 120, ease: 'none' }, 0)
            .to('.petal.p2', { x: '-28vw', y: '32vh', rotation: -118, ease: 'none' }, 0)
            .to('.petal.p3', { x: '38vw', y: '20vh', rotation: 145, ease: 'none' }, 0);
        }

        // ==================================================
        // [6] 360 숫자 롤링
        // 스크롤 중 숫자가 회전하고, 멈추면 3 / 6 / 0으로 정렬됩니다.
        // ==================================================
        const digitConfigs = [
          { reel: $('.digit-reel-3'), sequence: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3], target: 3, speed: 1, duration: MOTION_SETTINGS.digitSettleDuration, delay: 0 },
          { reel: $('.digit-reel-6'), sequence: [6, 5, 4, 3, 2, 1, 9, 8, 7, 6], target: 6, speed: 1.13, duration: MOTION_SETTINGS.digitSettleDuration + .07, delay: .08 },
          { reel: $('.digit-reel-0'), sequence: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], target: 0, speed: .92, duration: MOTION_SETTINGS.digitSettleDuration + .15, delay: .16 }
        ];
        const modulo = (value, length) => ((value % length) + length) % length;
        const renderDigit = state => { state.reel.style.transform = `translate3d(0,${-state.position * state.window.clientHeight}px,0)` };
        const digitStates = digitConfigs.map(config => {
          const fragment = document.createDocumentFragment();
          for (let copy = 0; copy < 5; copy++)config.sequence.forEach(number => { const value = document.createElement('span'); value.className = 'digit-value'; value.textContent = number; fragment.appendChild(value) });
          config.reel.replaceChildren(fragment);
          const state = { ...config, window: config.reel.parentElement, position: config.sequence.length * 2 + config.sequence.lastIndexOf(config.target) };
          renderDigit(state);
          return state;
        });
        if (!reduceMotion) {
          let digitRollingActive = false, digitRaf = 0, lastDigitTime = 0, lastDigitInput = 0, lastDigitVelocity = 0, smoothDigitVelocity = 0, digitSettling = false;
          const normalizeDigit = state => { state.position = state.sequence.length * 2 + modulo(state.position, state.sequence.length) };
          const cancelDigitSettle = () => { digitStates.forEach(state => gsap.killTweensOf(state)); digitSettling = false };
          const targetPosition = (state, direction) => {
            normalizeDigit(state);
            let index = direction > 0 ? Math.ceil(state.position) + 2 : Math.floor(state.position) - 2;
            for (let step = 0; step < state.sequence.length * 2; step++, index += direction) { if (state.sequence[modulo(index, state.sequence.length)] === state.target) return index }
            return state.position;
          };
          const settleTo360 = () => {
            if (digitSettling) return;
            digitSettling = true;
            const direction = lastDigitVelocity < 0 ? -1 : 1;
            digitStates.forEach((state, index) => {
              const destination = targetPosition(state, direction);
              gsap.to(state, {
                position: destination, duration: state.duration, delay: state.delay, ease: 'power3.out', overwrite: true, onUpdate: () => renderDigit(state), onComplete: () => {
                  state.position = state.sequence.length * 2 + state.sequence.lastIndexOf(state.target);
                  renderDigit(state);
                  if (index === digitStates.length - 1) digitSettling = false;
                }
              });
            });
          };
          const rollDigits = time => {
            digitRaf = 0;
            if (!digitRollingActive) return;
            const elapsed = Math.min((time - lastDigitTime) / 1000, .05); lastDigitTime = time;
            if (time - lastDigitInput > MOTION_SETTINGS.digitStopDelay) { settleTo360(); return }
            const maxSpeed = innerWidth <= 560 ? 9 : 12;
            const baseSpeed = gsap.utils.clamp(1.8, maxSpeed, Math.abs(lastDigitVelocity) * .0065);
            const direction = lastDigitVelocity < 0 ? -1 : 1;
            digitStates.forEach(state => { state.position += direction * baseSpeed * state.speed * elapsed; normalizeDigit(state); renderDigit(state) });
            lastDigitVelocity *= Math.pow(.91, elapsed * 60); smoothDigitVelocity = lastDigitVelocity;
            digitRaf = requestAnimationFrame(rollDigits);
          };
          const requestDigitRoll = velocity => {
            if (!digitRollingActive || Math.abs(velocity) < 8) return;
            cancelDigitSettle();
            const normalizedVelocity = gsap.utils.clamp(-1200, 1200, velocity);
            smoothDigitVelocity = Math.sign(normalizedVelocity) !== Math.sign(smoothDigitVelocity) ? normalizedVelocity * .12 : smoothDigitVelocity + (normalizedVelocity - smoothDigitVelocity) * .12;
            lastDigitVelocity = smoothDigitVelocity; lastDigitInput = performance.now();
            if (!digitRaf) { lastDigitTime = lastDigitInput; digitRaf = requestAnimationFrame(rollDigits) }
          };
          const legacySection = $('.legacy');
          const legacyTravel = () => legacySection.offsetHeight - innerHeight;
          ScrollTrigger.create({ trigger: legacySection, start: () => `top+=${Math.round(legacyTravel() * .15)} top`, end: () => `top+=${Math.round(legacyTravel() * .65)} top`, invalidateOnRefresh: true, onEnter: () => { digitRollingActive = true }, onEnterBack: () => { digitRollingActive = true }, onUpdate: self => requestDigitRoll(self.getVelocity()), onLeave: () => { digitRollingActive = false; settleTo360() }, onLeaveBack: () => { digitRollingActive = false; settleTo360() } });
          addEventListener('resize', () => digitStates.forEach(renderDigit), { passive: true });
        }
        }
        requestAnimationFrame(() => ScrollTrigger.refresh());
      } else {
        $$('.intro-motion-line').forEach(line => { line.style.opacity = 1; line.style.transform = 'none' });
        const fallbackIdeaSegments = [
          [$('.idea-before'), '아이디어가 '],
          [$('.idea-typing-highlight'), '경험'],
          [$('.idea-join'), '으로'],
          [$('.idea-after'), '피어나는 순간']
        ];
        fallbackIdeaSegments.forEach(([element, text]) => { if (element) element.textContent = text });
        $('.idea-typing-highlight')?.classList.add('has-text');
        $$('.typing-line').forEach(line => {
          const output = $('.typing-output', line);
          if (output) output.textContent = line.dataset.typingText || '';
        });
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = 'none' } }), { threshold: .2 }); $$('.fade-up').forEach(el => io.observe(el));
      }
    })();
